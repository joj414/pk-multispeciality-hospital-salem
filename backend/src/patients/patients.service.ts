import { prisma } from "../db";
import { broadcastEvent } from "../websocket/socket.service";
import { logAudit } from "../audit/audit.service";
import { createNotification } from "../notifications/notifications.service";

export async function generateNextPatientId(): Promise<string> {
  const lastPatient = await prisma.patient.findFirst({
    orderBy: { id: "desc" }
  });

  if (!lastPatient || !lastPatient.id.startsWith("P")) {
    return "P000001";
  }

  const numericPart = parseInt(lastPatient.id.replace("P", ""), 10);
  const nextNum = isNaN(numericPart) ? 1 : numericPart + 1;
  return `P${String(nextNum).padStart(6, "0")}`;
}

export async function getAllPatients(search?: string, departmentId?: string, isEmergency?: boolean, limit: number = 100) {
  const where: any = {};

  if (search) {
    where.OR = [
      { id: { contains: search } },
      { name: { contains: search } },
      { phone: { contains: search } },
      { email: { contains: search } }
    ];
  }

  if (departmentId) {
    where.departmentId = departmentId;
  }

  if (isEmergency !== undefined) {
    where.isEmergency = isEmergency;
  }

  return await prisma.patient.findMany({
    where,
    include: {
      department: true,
      appointments: { take: 3, orderBy: { date: "desc" } },
      beds: true
    },
    take: limit,
    orderBy: { createdAt: "desc" }
  });
}

export async function getPatientById(id: string) {
  return await prisma.patient.findUnique({
    where: { id },
    include: {
      department: true,
      appointments: { include: { doctor: true } },
      queueEntries: true,
      bedAllocations: { include: { bed: true } },
      beds: true
    }
  });
}

export async function createPatient(data: {
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  isEmergency?: boolean;
  departmentId?: string;
  status?: string;
}) {
  const id = await generateNextPatientId();

  const patient = await prisma.patient.create({
    data: {
      id,
      name: data.name,
      age: Number(data.age),
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      address: data.address,
      bloodGroup: data.bloodGroup,
      emergencyContact: data.emergencyContact,
      isEmergency: !!data.isEmergency,
      departmentId: data.departmentId || null,
      status: data.status || (data.isEmergency ? "IN_QUEUE" : "REGISTERED")
    },
    include: { department: true }
  });

  // Broadcast WebSocket event
  broadcastEvent("patient.registered", patient);

  // Log audit
  await logAudit("PATIENT_REGISTERED", `Patient ${patient.id} (${patient.name}) registered. Emergency: ${patient.isEmergency}`);

  // Create real-time notification
  if (patient.isEmergency) {
    await createNotification(
      "🚨 Emergency Patient Registered",
      `Critical Emergency: ${patient.name} (${patient.id}) registered to ${patient.department?.name || "Triage"}. Priority Queue updated!`,
      "EMERGENCY"
    );
  } else {
    await createNotification(
      "Patient Registered",
      `New patient ${patient.name} (${patient.id}) registered successfully.`,
      "INFO"
    );
  }

  return patient;
}
