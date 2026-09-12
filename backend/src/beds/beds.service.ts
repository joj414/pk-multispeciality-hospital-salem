import { prisma } from "../db";
import { BedAllocationEngine } from "./BedAllocationEngine";
import { BedAllocationRequest, BedStatus } from "../types";
import { broadcastEvent } from "../websocket/socket.service";
import { logAudit } from "../audit/audit.service";
import { createNotification } from "../notifications/notifications.service";

export async function getAllBeds(floor?: number, departmentId?: string, status?: string) {
  const where: any = {};
  if (floor) where.floor = Number(floor);
  if (departmentId) where.departmentId = departmentId;
  if (status) where.status = status;

  return await prisma.bed.findMany({
    where,
    include: {
      department: true,
      currentPatient: true,
      allocations: {
        take: 1,
        orderBy: { allocatedAt: "desc" },
        include: { patient: true }
      }
    },
    orderBy: { code: "asc" }
  });
}

export async function getBedById(id: string) {
  return await prisma.bed.findUnique({
    where: { id },
    include: {
      department: true,
      currentPatient: true,
      allocations: {
        include: { patient: true },
        orderBy: { allocatedAt: "desc" }
      }
    }
  });
}

export async function updateBedStatus(id: string, status: BedStatus, notes?: string) {
  const bed = await prisma.bed.update({
    where: { id },
    data: {
      status,
      lastUpdated: new Date()
    },
    include: {
      department: true,
      currentPatient: true
    }
  });

  broadcastEvent("bed.updated", bed);
  await logAudit("BED_STATUS_CHANGED", `Bed ${bed.code} status set to ${status}${notes ? ` (${notes})` : ""}`);

  return bed;
}

export async function allocateBedSmart(request: BedAllocationRequest) {
  const allocation = await BedAllocationEngine.findBestBed(request);
  if (!allocation.success || !allocation.bedId) {
    throw new Error(allocation.message);
  }

  const bedId = allocation.bedId;
  const patient = await prisma.patient.findUnique({ where: { id: request.patientId } });
  if (!patient) throw new Error("Patient not found");

  // Update Bed
  const updatedBed = await prisma.bed.update({
    where: { id: bedId },
    data: {
      status: "OCCUPIED",
      currentPatientId: patient.id,
      lastUpdated: new Date()
    },
    include: {
      department: true,
      currentPatient: true
    }
  });

  // Update Patient status
  await prisma.patient.update({
    where: { id: patient.id },
    data: { status: "ADMITTED" }
  });

  // Record Allocation
  const allocationRecord = await prisma.bedAllocation.create({
    data: {
      bedId: updatedBed.id,
      patientId: patient.id,
      allocatedBy: request.allocatedBy || "BedAllocationEngine",
      reason: request.reason || (request.isEmergency ? "Emergency Triage Admission" : "Physician Admission Order")
    },
    include: {
      bed: true,
      patient: true
    }
  });

  // Real-time Socket.IO events
  broadcastEvent("bed.allocated", {
    bed: updatedBed,
    patient,
    allocationRecord,
    isOverflow: allocation.isOverflowAllocation
  });
  broadcastEvent("bed.updated", updatedBed);

  // Audit Log
  await logAudit(
    "BED_ALLOCATED",
    `Bed ${updatedBed.code} (${updatedBed.department.name}, Fl ${updatedBed.floor}) allocated to patient ${patient.name} (${patient.id})`
  );

  // Notification
  await createNotification(
    request.isEmergency ? "🚨 Emergency Bed Allocated" : "Bed Allocation Confirmed",
    `Bed ${updatedBed.code} in ${updatedBed.department.name} allocated to ${patient.name} (${patient.id}).`,
    request.isEmergency ? "EMERGENCY" : "SUCCESS"
  );

  return {
    success: true,
    bed: updatedBed,
    allocation: allocationRecord,
    engineMessage: allocation.message
  };
}

export async function releaseBed(bedId: string, setToCleaning: boolean = true) {
  const bed = await prisma.bed.findUnique({
    where: { id: bedId },
    include: { currentPatient: true, department: true }
  });

  if (!bed) throw new Error("Bed not found");

  const patientId = bed.currentPatientId;

  // Mark latest allocation closed
  if (patientId) {
    const activeAlloc = await prisma.bedAllocation.findFirst({
      where: { bedId: bed.id, patientId: patientId, releasedAt: null },
      orderBy: { allocatedAt: "desc" }
    });

    if (activeAlloc) {
      await prisma.bedAllocation.update({
        where: { id: activeAlloc.id },
        data: { releasedAt: new Date() }
      });
    }

    // Update patient status to DISCHARGED
    await prisma.patient.update({
      where: { id: patientId },
      data: { status: "DISCHARGED" }
    });
  }

  // Update Bed status
  const nextStatus: BedStatus = setToCleaning ? "CLEANING" : "AVAILABLE";
  const updatedBed = await prisma.bed.update({
    where: { id: bed.id },
    data: {
      status: nextStatus,
      currentPatientId: null,
      lastUpdated: new Date()
    },
    include: {
      department: true
    }
  });

  // Real-time events
  broadcastEvent("bed.released", { bed: updatedBed, previousPatientId: patientId });
  broadcastEvent("bed.updated", updatedBed);

  // Audit Logs
  await logAudit("BED_RELEASED", `Bed ${bed.code} released. Next status: ${nextStatus}.`);
  if (patientId) {
    await logAudit("PATIENT_DISCHARGED", `Patient ${patientId} discharged from bed ${bed.code}.`);
  }

  // Notification
  await createNotification(
    "Bed Released & Cleaning Required",
    `Bed ${bed.code} in ${bed.department.name} has been released and marked for sanitization.`,
    "INFO"
  );

  return updatedBed;
}
