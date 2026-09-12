import { prisma } from "../db";
import { PriorityQueueEngine } from "./PriorityQueue";
import { QueueItem } from "../types";
import { broadcastEvent } from "../websocket/socket.service";
import { logAudit } from "../audit/audit.service";
import { createNotification } from "../notifications/notifications.service";

// In-memory heap engines per department or global
const priorityHeap = new PriorityQueueEngine();

export async function refreshQueueFromDb() {
  const waitingEntries = await prisma.queueEntry.findMany({
    where: { status: { in: ["WAITING", "CALLED"] } },
    include: {
      patient: true,
      department: true
    },
    orderBy: { enqueuedAt: "asc" }
  });

  priorityHeap.clear();

  for (const entry of waitingEntries) {
    const item: QueueItem = {
      id: entry.id,
      ticketNumber: entry.ticketNumber,
      patientId: entry.patientId,
      patientName: entry.patient.name,
      appointmentId: entry.appointmentId || undefined,
      departmentId: entry.departmentId,
      departmentName: entry.department.name,
      priorityScore: entry.priorityScore,
      queueType: entry.queueType as "FIFO" | "PRIORITY",
      status: entry.status as any,
      enqueuedAt: entry.enqueuedAt,
      estimatedWaitMin: entry.estimatedWaitMin
    };
    priorityHeap.enqueue(item);
  }

  return priorityHeap.getAllSorted();
}

export async function getQueueStatus(departmentId?: string) {
  const sorted = await refreshQueueFromDb();
  if (departmentId) {
    return sorted.filter((item) => item.departmentId === departmentId);
  }
  return sorted;
}

export async function enqueuePatient(data: {
  patientId: string;
  departmentId: string;
  appointmentId?: string;
  priorityScore?: number;
  isEmergency?: boolean;
}) {
  const patient = await prisma.patient.findUnique({ where: { id: data.patientId } });
  if (!patient) throw new Error("Patient not found");

  const dept = await prisma.department.findUnique({ where: { id: data.departmentId } });
  if (!dept) throw new Error("Department not found");

  const isEmergency = data.isEmergency ?? patient.isEmergency;
  const priorityScore = data.priorityScore ?? (isEmergency ? 5 : 1);
  const queueType = isEmergency ? "PRIORITY" : "FIFO";

  const count = await prisma.queueEntry.count();
  const ticketNumber = isEmergency ? `EM-${String(count + 1).padStart(3, "0")}` : `Q-${String(count + 1).padStart(3, "0")}`;

  const entry = await prisma.queueEntry.create({
    data: {
      ticketNumber,
      patientId: data.patientId,
      departmentId: data.departmentId,
      appointmentId: data.appointmentId || null,
      priorityScore,
      queueType,
      status: "WAITING",
      estimatedWaitMin: Math.max(5, 45 - priorityScore * 8)
    },
    include: {
      patient: true,
      department: true
    }
  });

  const item: QueueItem = {
    id: entry.id,
    ticketNumber: entry.ticketNumber,
    patientId: entry.patientId,
    patientName: entry.patient.name,
    appointmentId: entry.appointmentId || undefined,
    departmentId: entry.departmentId,
    departmentName: entry.department.name,
    priorityScore: entry.priorityScore,
    queueType: entry.queueType as any,
    status: entry.status as any,
    enqueuedAt: entry.enqueuedAt,
    estimatedWaitMin: entry.estimatedWaitMin
  };

  priorityHeap.enqueue(item);
  const position = priorityHeap.queuePosition(item.id);

  broadcastEvent("queue.updated", {
    action: "ENQUEUED",
    item,
    position,
    totalWaiting: priorityHeap.size()
  });

  await logAudit("QUEUE_UPDATED", `Enqueued ${patient.name} (${ticketNumber}) with Priority ${priorityScore}`);

  if (isEmergency) {
    await createNotification(
      "🚨 Critical Queue Alert",
      `Emergency patient ${patient.name} enqueued at position #${position} (Priority ${priorityScore})`,
      "EMERGENCY"
    );
  }

  return { entry, position };
}

export async function callNextPatient(departmentId?: string, doctorName: string = "Doctor") {
  const currentQueue = await refreshQueueFromDb();
  const candidates = departmentId
    ? currentQueue.filter((q) => q.departmentId === departmentId && q.status === "WAITING")
    : currentQueue.filter((q) => q.status === "WAITING");

  if (candidates.length === 0) {
    return null;
  }

  const nextPatient = candidates[0];

  await prisma.queueEntry.update({
    where: { id: nextPatient.id },
    data: {
      status: "CALLED",
      calledAt: new Date()
    }
  });

  if (nextPatient.appointmentId) {
    await prisma.appointment.update({
      where: { id: nextPatient.appointmentId },
      data: { status: "CALLED" }
    });
  }

  broadcastEvent("queue.updated", {
    action: "CALLED",
    calledItem: nextPatient,
    caller: doctorName
  });

  await logAudit("QUEUE_UPDATED", `Called patient ${nextPatient.patientName} (${nextPatient.ticketNumber}) by ${doctorName}`);

  await createNotification(
    "Patient Called",
    `Ticket ${nextPatient.ticketNumber} (${nextPatient.patientName}) called for consultation.`,
    "INFO"
  );

  return nextPatient;
}

export async function updateQueuePriority(id: string, newPriority: number) {
  const entry = await prisma.queueEntry.update({
    where: { id },
    data: {
      priorityScore: newPriority,
      estimatedWaitMin: Math.max(5, 45 - newPriority * 8)
    },
    include: { patient: true, department: true }
  });

  priorityHeap.updatePriority(id, newPriority);
  const newPosition = priorityHeap.queuePosition(id);

  broadcastEvent("queue.updated", {
    action: "PRIORITY_CHANGED",
    itemId: id,
    newPriority,
    newPosition
  });

  await logAudit("QUEUE_UPDATED", `Updated priority of ${entry.ticketNumber} to ${newPriority}`);
  return { entry, newPosition };
}
