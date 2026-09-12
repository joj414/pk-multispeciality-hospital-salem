import { prisma } from "../db";
import { broadcastEvent } from "../websocket/socket.service";
import { logAudit } from "../audit/audit.service";
import { createNotification } from "../notifications/notifications.service";
import { allocateBedSmart } from "../beds/beds.service";

let isSimulating = false;

export async function runLiveSimulation() {
  if (isSimulating) {
    return { success: false, message: "Simulation is already in progress" };
  }

  isSimulating = true;
  const simId = `SIM-${Date.now()}`;
  console.log(`🎬 [Simulation] Starting scenario: ${simId}`);

  // Background asynchronous execution of steps
  (async () => {
    try {
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      // Step 1: Emergency Patient Inflow
      broadcastEvent("simulation.step", {
        step: 1,
        totalSteps: 6,
        phase: "EMERGENCY_ARRIVAL",
        title: "🚨 Inbound Critical Emergency",
        description: "EMS Ambulance arriving with critical trauma patient: Marcus Thorne (48M, Severe Cardiac Arrest).",
        cameraTarget: { x: -14, y: 0.5, z: -8, floor: 1 }
      });
      await createNotification("🚨 EMS INBOUND", "Critical trauma arriving at Emergency Bay 1. Triage Level 5.", "EMERGENCY");
      await delay(2500);

      // Step 2: Patient Registration & Triage
      const simPatientId = `P-EMERG-${Math.floor(100 + Math.random() * 900)}`;
      const emergencyDept = await prisma.department.findUnique({ where: { code: "EMERGENCY" } });
      const patient = await prisma.patient.create({
        data: {
          id: simPatientId,
          name: "Marcus Thorne (Sim)",
          age: 48,
          gender: "Male",
          phone: "+1-555-9110",
          email: "m.thorne.sim@emergency.org",
          address: "Metro City Central",
          bloodGroup: "O-",
          emergencyContact: "+1-555-9111",
          isEmergency: true,
          departmentId: emergencyDept?.id,
          status: "IN_QUEUE"
        }
      });
      broadcastEvent("patient.registered", patient);
      await logAudit("PATIENT_REGISTERED", `[SIMULATION] Emergency patient registered: ${patient.name} (${patient.id})`);

      broadcastEvent("simulation.step", {
        step: 2,
        totalSteps: 6,
        phase: "PRIORITY_TRIAGE",
        title: "⚡ Priority Queue Preemption",
        description: "Patient classified as Priority 5 (Resuscitation). Instantly preempts standard FIFO queue to rank #1.",
        patient
      });
      await delay(2500);

      // Step 3: Priority Queue Enqueue
      const qEntry = await prisma.queueEntry.create({
        data: {
          ticketNumber: `EM-SIM-${Math.floor(10 + Math.random() * 90)}`,
          patientId: patient.id,
          departmentId: emergencyDept?.id || "",
          priorityScore: 5,
          queueType: "PRIORITY",
          status: "WAITING",
          estimatedWaitMin: 0
        },
        include: { patient: true, department: true }
      });
      broadcastEvent("queue.updated", { action: "ENQUEUED", item: qEntry, position: 1 });
      await delay(2500);

      // Step 4: Smart Bed Allocation Engine Triggered
      broadcastEvent("simulation.step", {
        step: 4,
        totalSteps: 6,
        phase: "BED_SEARCH",
        title: "🧠 Smart Bed Allocation Engine Activated",
        description: "Scanning hospital digital twin for optimal critical care bed: evaluating ICU, trauma resuscitation, and floor telemetry.",
      });
      await delay(2000);

      // Step 5: Bed Match Found & Camera Pan
      // Find an available ICU or Emergency bed
      let candidateBed = await prisma.bed.findFirst({
        where: { status: "AVAILABLE", floor: { in: [1, 2] } }
      });

      if (!candidateBed) {
        // Free one for demonstration
        candidateBed = await prisma.bed.findFirst();
        if (candidateBed) {
          await prisma.bed.update({ where: { id: candidateBed.id }, data: { status: "AVAILABLE" } });
        }
      }

      if (candidateBed) {
        // Reserve bed first
        await prisma.bed.update({
          where: { id: candidateBed.id },
          data: { status: "RESERVED" }
        });
        broadcastEvent("bed.updated", { ...candidateBed, status: "RESERVED" });

        broadcastEvent("simulation.step", {
          step: 5,
          totalSteps: 6,
          phase: "BED_RESERVED",
          title: `🎯 Bed ${candidateBed.code} Selected & Reserved`,
          description: `Engine selected ${candidateBed.code} on Floor ${candidateBed.floor} (${candidateBed.room}). Flying 3D camera to location.`,
          bedId: candidateBed.id,
          bedCode: candidateBed.code,
          cameraTarget: {
            x: candidateBed.positionX,
            y: candidateBed.positionY,
            z: candidateBed.positionZ,
            floor: candidateBed.floor
          }
        });
        await delay(3000);

        // Step 6: Occupy Bed & Finalize Admission
        const allocationResult = await allocateBedSmart({
          patientId: patient.id,
          departmentId: candidateBed.departmentId,
          isEmergency: true,
          priorityScore: 5,
          allocatedBy: "Dr. Marcus Chen (Sim)",
          reason: "Acute Resuscitation Protocol"
        });

        broadcastEvent("simulation.step", {
          step: 6,
          totalSteps: 6,
          phase: "COMPLETED",
          title: "✅ Patient Flow Cycle Complete",
          description: `Patient ${patient.name} admitted to ${candidateBed.code}. Real-time KPIs, 3D digital twin, and audit trail updated seamlessly.`,
          bedId: candidateBed.id,
          bedCode: candidateBed.code,
          patient
        });
        await createNotification("Simulation Completed", `Full priority patient flow successfully demonstrated for ${patient.name}.`, "SUCCESS");
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      isSimulating = false;
    }
  })();

  return { success: true, message: "Live simulation initiated. Broadcasting real-time events." };
}

export function getSimulationStatus() {
  return { isSimulating };
}
