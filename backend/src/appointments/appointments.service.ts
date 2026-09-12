import { prisma } from "../db";
import { broadcastEvent } from "../websocket/socket.service";
import { logAudit } from "../audit/audit.service";
import { createNotification } from "../notifications/notifications.service";

export async function getAllAppointments(date?: string, departmentId?: string, doctorId?: string, status?: string) {
  const where: any = {};
  if (date) where.date = date;
  if (departmentId) where.departmentId = departmentId;
  if (doctorId) where.doctorId = doctorId;
  if (status) where.status = status;

  return await prisma.appointment.findMany({
    where,
    include: {
      patient: true,
      doctor: true,
      department: true
    },
    orderBy: [{ date: "desc" }, { time: "asc" }]
  });
}

export async function createAppointment(data: {
  patientId: string;
  doctorId: string;
  departmentId: string;
  date: string;
  time: string;
  type?: string;
  priority?: number;
  isEmergency?: boolean;
  reason?: string;
}) {
  const isEmergency = !!data.isEmergency;
  const priority = data.priority || (isEmergency ? 5 : 1);

  const appt = await prisma.appointment.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      departmentId: data.departmentId,
      date: data.date,
      time: data.time,
      type: data.type || (isEmergency ? "EMERGENCY" : "ROUTINE"),
      priority,
      isEmergency,
      reason: data.reason || (isEmergency ? "Immediate acute intervention" : "General consultation"),
      status: isEmergency ? "WAITING" : "BOOKED"
    },
    include: {
      patient: true,
      doctor: true,
      department: true
    }
  });

  // If waiting or emergency, automatically create queue entry
  if (appt.status === "WAITING") {
    const queueCount = await prisma.queueEntry.count();
    await prisma.queueEntry.create({
      data: {
        ticketNumber: isEmergency ? `EM-${String(queueCount + 1).padStart(3, "0")}` : `Q-${String(queueCount + 1).padStart(3, "0")}`,
        patientId: appt.patientId,
        appointmentId: appt.id,
        departmentId: appt.departmentId,
        priorityScore: appt.priority,
        queueType: isEmergency ? "PRIORITY" : "FIFO",
        status: "WAITING",
        estimatedWaitMin: Math.max(5, 40 - appt.priority * 7)
      }
    });
    broadcastEvent("queue.updated", { action: "ENQUEUED", appointmentId: appt.id });
  }

  broadcastEvent("appointment.created", appt);
  await logAudit("APPOINTMENT_CREATED", `Appointment created for patient ${appt.patient.id} with ${appt.doctor.name} (${appt.type})`);

  if (isEmergency) {
    await createNotification("Emergency Appointment", `Urgent triage appointment created for ${appt.patient.name}. Priority Level ${priority}`, "EMERGENCY");
  }

  return appt;
}

export async function updateAppointmentStatus(id: string, status: string, notes?: string) {
  const appt = await prisma.appointment.update({
    where: { id },
    data: { status },
    include: {
      patient: true,
      doctor: true,
      department: true
    }
  });

  // Update associated QueueEntry if it exists
  const queueEntry = await prisma.queueEntry.findFirst({
    where: { appointmentId: id }
  });

  if (queueEntry) {
    let qStatus = "WAITING";
    if (status === "CALLED") qStatus = "CALLED";
    else if (status === "IN_PROGRESS" || status === "COMPLETED") qStatus = "SERVICED";
    else if (status === "CANCELLED" || status === "NO_SHOW") qStatus = "CANCELLED";

    await prisma.queueEntry.update({
      where: { id: queueEntry.id },
      data: {
        status: qStatus,
        calledAt: status === "CALLED" ? new Date() : undefined
      }
    });

    broadcastEvent("queue.updated", { appointmentId: id, status: qStatus });
  }

  broadcastEvent("appointment.updated", appt);
  await logAudit("APPOINTMENT_UPDATED", `Appointment ${id} for ${appt.patient.name} transitioned to ${status}`);

  return appt;
}
