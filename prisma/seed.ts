import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SmartCare Flow database...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.bedAllocation.deleteMany();
  await prisma.queueEntry.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.bed.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create Departments
  const departmentsData = [
    { name: "Emergency Department", code: "EMERGENCY", floor: 1, description: "24/7 Level 1 Trauma & Resuscitation Center", totalBeds: 12 },
    { name: "Reception & Triage", code: "RECEPTION", floor: 1, description: "Central Patient Intake & Initial Assessment", totalBeds: 0 },
    { name: "Diagnostics & Imaging", code: "DIAG", floor: 1, description: "CT, MRI, X-Ray & Hematology Lab", totalBeds: 4 },
    { name: "Intensive Care Unit (ICU)", code: "ICU", floor: 2, description: "Critical Care Life Support & Continuous Monitoring", totalBeds: 16 },
    { name: "General Ward", code: "GEN", floor: 2, description: "Inpatient Internal Medicine & Sub-acute Care", totalBeds: 24 },
    { name: "Cardiology", code: "CARD", floor: 2, description: "Cardiovascular Telemetry & Post-Cath Care", totalBeds: 8 },
    { name: "Pediatrics Ward", code: "PED", floor: 3, description: "Neonatal & Pediatric Specialized Care", totalBeds: 8 },
    { name: "Neurology & Stroke Unit", code: "NEURO", floor: 3, description: "Neurovascular & Epilepsy Monitoring", totalBeds: 4 },
    { name: "Orthopedics", code: "ORTHO", floor: 3, description: "Musculoskeletal & Post-Surgical Rehabilitation", totalBeds: 4 }
  ];

  const deptMap: Record<string, string> = {};
  for (const d of departmentsData) {
    const created = await prisma.department.create({ data: d });
    deptMap[d.code] = created.id;
  }

  // 2. Create Users
  const usersData = [
    { email: "admin@smartcare.com", name: "Dr. Alexander Wright (Superadmin)", role: "ADMIN" },
    { email: "hospital.admin@smartcare.com", name: "Eleanor Vance (Operations Director)", role: "HOSPITAL_ADMIN" },
    { email: "dr.chen@smartcare.com", name: "Dr. Marcus Chen (Chief of Emergency)", role: "DOCTOR", departmentId: deptMap["EMERGENCY"] },
    { email: "dr.sharma@smartcare.com", name: "Dr. Priya Sharma (ICU Intensivist)", role: "DOCTOR", departmentId: deptMap["ICU"] },
    { email: "dr.adams@smartcare.com", name: "Dr. James Adams (Cardiologist)", role: "DOCTOR", departmentId: deptMap["CARD"] },
    { email: "nurse.sarah@smartcare.com", name: "Nurse Sarah Jenkins (Head Charge Nurse)", role: "NURSE", departmentId: deptMap["ICU"] },
    { email: "nurse.john@smartcare.com", name: "Nurse John Morales (Emergency Triage)", role: "NURSE", departmentId: deptMap["EMERGENCY"] },
    { email: "reception@smartcare.com", name: "Lisa Wong (Admissions Lead)", role: "RECEPTIONIST", departmentId: deptMap["RECEPTION"] },
    { email: "patient.john@smartcare.com", name: "David Miller (Patient)", role: "PATIENT" }
  ];

  for (const u of usersData) {
    await prisma.user.create({
      data: {
        email: u.email,
        name: u.name,
        passwordHash,
        role: u.role,
        departmentId: u.departmentId || null
      }
    });
  }

  // 3. Create 20 Doctors
  const doctorsData = [
    { name: "Dr. Marcus Chen", email: "m.chen@hospital.org", phone: "+1-555-0101", specialty: "Emergency Medicine", roomNumber: "ER-Bay 1", departmentId: deptMap["EMERGENCY"] },
    { name: "Dr. Sarah Lin", email: "s.lin@hospital.org", phone: "+1-555-0102", specialty: "Emergency Trauma", roomNumber: "ER-Bay 2", departmentId: deptMap["EMERGENCY"] },
    { name: "Dr. David Kim", email: "d.kim@hospital.org", phone: "+1-555-0103", specialty: "Critical Care", roomNumber: "ER-Resus", departmentId: deptMap["EMERGENCY"] },
    
    { name: "Dr. Priya Sharma", email: "p.sharma@hospital.org", phone: "+1-555-0201", specialty: "Intensive Care Specialist", roomNumber: "ICU-Pod A", departmentId: deptMap["ICU"] },
    { name: "Dr. Robert Taylor", email: "r.taylor@hospital.org", phone: "+1-555-0202", specialty: "Neurocritical Care", roomNumber: "ICU-Pod B", departmentId: deptMap["ICU"] },
    { name: "Dr. Elena Rostova", email: "e.rostova@hospital.org", phone: "+1-555-0203", specialty: "Surgical Critical Care", roomNumber: "ICU-Pod C", departmentId: deptMap["ICU"] },

    { name: "Dr. James Adams", email: "j.adams@hospital.org", phone: "+1-555-0301", specialty: "Interventional Cardiology", roomNumber: "Cardio-201", departmentId: deptMap["CARD"] },
    { name: "Dr. Maya Patel", email: "m.patel@hospital.org", phone: "+1-555-0302", specialty: "Electrophysiology", roomNumber: "Cardio-202", departmentId: deptMap["CARD"] },

    { name: "Dr. Gregory House", email: "g.house@hospital.org", phone: "+1-555-0401", specialty: "Internal Medicine", roomNumber: "Gen-101", departmentId: deptMap["GEN"] },
    { name: "Dr. Allison Cameron", email: "a.cameron@hospital.org", phone: "+1-555-0402", specialty: "Immunology & Internal Med", roomNumber: "Gen-102", departmentId: deptMap["GEN"] },
    { name: "Dr. Eric Foreman", email: "e.foreman@hospital.org", phone: "+1-555-0403", specialty: "General Inpatient", roomNumber: "Gen-103", departmentId: deptMap["GEN"] },

    { name: "Dr. Sophia Martinez", email: "s.martinez@hospital.org", phone: "+1-555-0501", specialty: "Pediatric Emergency", roomNumber: "Ped-301", departmentId: deptMap["PED"] },
    { name: "Dr. Benjamin Walker", email: "b.walker@hospital.org", phone: "+1-555-0502", specialty: "General Pediatrics", roomNumber: "Ped-302", departmentId: deptMap["PED"] },

    { name: "Dr. Daniel Vance", email: "d.vance@hospital.org", phone: "+1-555-0601", specialty: "Neurology", roomNumber: "Neuro-310", departmentId: deptMap["NEURO"] },
    { name: "Dr. Grace Hopper", email: "g.hopper@hospital.org", phone: "+1-555-0602", specialty: "Stroke Specialist", roomNumber: "Neuro-311", departmentId: deptMap["NEURO"] },

    { name: "Dr. Thomas Scott", email: "t.scott@hospital.org", phone: "+1-555-0701", specialty: "Orthopedic Surgery", roomNumber: "Ortho-320", departmentId: deptMap["ORTHO"] },
    { name: "Dr. Rachel Green", email: "r.green@hospital.org", phone: "+1-555-0702", specialty: "Sports Medicine & Joint", roomNumber: "Ortho-321", departmentId: deptMap["ORTHO"] },

    { name: "Dr. Lucas Scott", email: "l.scott@hospital.org", phone: "+1-555-0801", specialty: "Radiology & MRI", roomNumber: "Diag-110", departmentId: deptMap["DIAG"] },
    { name: "Dr. Hannah Abbott", email: "h.abbott@hospital.org", phone: "+1-555-0802", specialty: "Clinical Pathology", roomNumber: "Diag-111", departmentId: deptMap["DIAG"] },
    { name: "Dr. Julian Bashir", email: "j.bashir@hospital.org", phone: "+1-555-0901", specialty: "Triage & Acute Care", roomNumber: "Tri-105", departmentId: deptMap["RECEPTION"] }
  ];

  const createdDoctors = [];
  for (const doc of doctorsData) {
    const created = await prisma.doctor.create({ data: doc });
    createdDoctors.push(created);
  }

  // 4. Create 50 Synthetic Patients (P000001 to P000050)
  const firstNames = ["James", "Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia", "Ethan", "Isabella", "Michael", "Mia", "Alexander", "Charlotte", "Daniel", "Amelia", "Matthew", "Harper", "Henry", "Evelyn"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const deptsKeys = ["EMERGENCY", "ICU", "GEN", "CARD", "PED", "NEURO", "ORTHO"];

  const createdPatients = [];
  for (let i = 1; i <= 50; i++) {
    const pId = `P${String(i).padStart(6, "0")}`;
    const fName = firstNames[i % firstNames.length];
    const lName = lastNames[(i * 3) % lastNames.length];
    const isEmerg = i % 6 === 0; // ~8 emergency cases
    const deptKey = deptsKeys[i % deptsKeys.length];
    const statusPool = ["REGISTERED", "IN_QUEUE", "CONSULTING", "ADMITTED", "DISCHARGED"];
    const status = statusPool[i % statusPool.length];

    const patient = await prisma.patient.create({
      data: {
        id: pId,
        name: `${fName} ${lName}`,
        age: 18 + ((i * 7) % 65),
        gender: i % 2 === 0 ? "Male" : "Female",
        phone: `+1-555-${String(1000 + i).padStart(4, "0")}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@example.com`,
        address: `${100 + i} Medical Center Blvd, Suite ${i % 10 + 1}`,
        bloodGroup: bloodGroups[i % bloodGroups.length],
        emergencyContact: `+1-555-${String(9000 + i).padStart(4, "0")}`,
        isEmergency: isEmerg,
        departmentId: deptMap[deptKey],
        status: status
      }
    });
    createdPatients.push(patient);
  }

  // 5. Create 80 Beds across 3 floors with precise 3D coordinate layout
  // Floor 1 (y: 0): Emergency (12 beds: B-001 to B-012), Diagnostics (4 beds: B-013 to B-016)
  // Floor 2 (y: 8): ICU (16 beds: B-017 to B-032), General Ward (24 beds: B-033 to B-056), Cardiology (8 beds: B-057 to B-064)
  // Floor 3 (y: 16): Pediatrics (8 beds: B-065 to B-072), Neurology (4 beds: B-073 to B-076), Orthopedics (4 beds: B-077 to B-080)
  const bedConfigs = [
    // Floor 1
    ...Array.from({ length: 12 }, (_, idx) => ({
      num: idx + 1,
      floor: 1,
      posY: 0.5,
      deptKey: "EMERGENCY",
      type: "EMERGENCY",
      room: `ER Trauma Bay ${(idx % 4) + 1}`,
      // 3D placement: west wing
      posX: -14 + (idx % 4) * 3.5,
      posZ: -8 + Math.floor(idx / 4) * 5
    })),
    ...Array.from({ length: 4 }, (_, idx) => ({
      num: idx + 13,
      floor: 1,
      posY: 0.5,
      deptKey: "DIAG",
      type: "GENERAL",
      room: `Obs Bay ${idx + 1}`,
      posX: 8 + (idx % 2) * 4,
      posZ: -6 + Math.floor(idx / 2) * 5
    })),
    // Floor 2
    ...Array.from({ length: 16 }, (_, idx) => ({
      num: idx + 17,
      floor: 2,
      posY: 8.5,
      deptKey: "ICU",
      type: "ICU",
      room: `ICU Suite ${idx + 1}`,
      posX: -15 + (idx % 4) * 3.5,
      posZ: -9 + Math.floor(idx / 4) * 4.5
    })),
    ...Array.from({ length: 24 }, (_, idx) => ({
      num: idx + 33,
      floor: 2,
      posY: 8.5,
      deptKey: "GEN",
      type: "GENERAL",
      room: `Gen Ward Room ${101 + Math.floor(idx / 4)}`,
      posX: 2 + (idx % 6) * 2.8,
      posZ: -8 + Math.floor(idx / 6) * 4.5
    })),
    ...Array.from({ length: 8 }, (_, idx) => ({
      num: idx + 57,
      floor: 2,
      posY: 8.5,
      deptKey: "CARD",
      type: "PRIVATE",
      room: `Cardio Telemetry ${idx + 1}`,
      posX: -5 + (idx % 4) * 3.5,
      posZ: 9 + Math.floor(idx / 4) * 4.5
    })),
    // Floor 3
    ...Array.from({ length: 8 }, (_, idx) => ({
      num: idx + 65,
      floor: 3,
      posY: 16.5,
      deptKey: "PED",
      type: "PEDIATRIC",
      room: `Pediatric Suite ${idx + 1}`,
      posX: -12 + (idx % 4) * 3.5,
      posZ: -6 + Math.floor(idx / 4) * 5
    })),
    ...Array.from({ length: 4 }, (_, idx) => ({
      num: idx + 73,
      floor: 3,
      posY: 16.5,
      deptKey: "NEURO",
      type: "ISOLATION",
      room: `Neuro Monitoring ${idx + 1}`,
      posX: 4 + (idx % 2) * 4,
      posZ: -6 + Math.floor(idx / 2) * 5
    })),
    ...Array.from({ length: 4 }, (_, idx) => ({
      num: idx + 77,
      floor: 3,
      posY: 16.5,
      deptKey: "ORTHO",
      type: "GENERAL",
      room: `Ortho Recovery ${idx + 1}`,
      posX: 4 + (idx % 2) * 4,
      posZ: 5 + Math.floor(idx / 2) * 5
    }))
  ];

  const statuses = ["AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING", "MAINTENANCE"];
  const createdBeds = [];

  for (let i = 0; i < bedConfigs.length; i++) {
    const c = bedConfigs[i];
    const bedCode = `B-${String(c.num).padStart(3, "0")}`;
    
    // Distribute realistic statuses: ~55% available, ~30% occupied, ~8% reserved, ~4% cleaning, ~3% maintenance
    let status = "AVAILABLE";
    let assignedPatientId = null;

    if (i % 10 === 0) status = "MAINTENANCE";
    else if (i % 8 === 0) status = "CLEANING";
    else if (i % 5 === 0) status = "RESERVED";
    else if (i % 3 === 0) {
      status = "OCCUPIED";
      assignedPatientId = createdPatients[i % createdPatients.length].id;
    }

    const bed = await prisma.bed.create({
      data: {
        id: bedCode,
        code: bedCode,
        departmentId: deptMap[c.deptKey] || deptMap["GEN"],
        floor: c.floor,
        room: c.room,
        type: c.type,
        status: status,
        positionX: c.posX,
        positionY: c.posY,
        positionZ: c.posZ,
        currentPatientId: assignedPatientId,
        lastUpdated: new Date()
      }
    });

    if (assignedPatientId) {
      await prisma.bedAllocation.create({
        data: {
          bedId: bed.id,
          patientId: assignedPatientId,
          allocatedBy: "Dr. Marcus Chen",
          reason: "Admitted from Emergency Triage"
        }
      });
    }

    createdBeds.push(bed);
  }

  // 6. Create 100 Appointments
  const apptTypes = ["ROUTINE", "FOLLOW_UP", "EMERGENCY", "SPECIALIST"];
  const apptStatuses = ["BOOKED", "WAITING", "CALLED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"];

  for (let i = 1; i <= 100; i++) {
    const patient = createdPatients[i % createdPatients.length];
    const doctor = createdDoctors[i % createdDoctors.length];
    const isEmerg = patient.isEmergency || i % 7 === 0;
    const priority = isEmerg ? 4 + (i % 2) : 1 + (i % 3);
    const apptStatus = apptStatuses[i % apptStatuses.length];

    const appt = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        departmentId: doctor.departmentId,
        date: "2026-09-12",
        time: `${String(8 + Math.floor(i / 10)).padStart(2, "0")}:${(i % 4) * 15 === 0 ? "00" : (i % 4) * 15}`,
        type: isEmerg ? "EMERGENCY" : apptTypes[i % apptTypes.length],
        priority: priority,
        isEmergency: isEmerg,
        reason: isEmerg ? "Acute chest discomfort / respiratory distress" : "Standard consultation and medical checkup",
        status: apptStatus
      }
    });

    // 7. Enqueue WAITING or CALLED appointments into QueueEntry
    if (apptStatus === "WAITING" || apptStatus === "CALLED") {
      await prisma.queueEntry.create({
        data: {
          ticketNumber: isEmerg ? `EM-${String(i).padStart(3, "0")}` : `Q-${String(i).padStart(3, "0")}`,
          patientId: patient.id,
          appointmentId: appt.id,
          departmentId: doctor.departmentId,
          priorityScore: priority,
          queueType: isEmerg ? "PRIORITY" : "FIFO",
          status: apptStatus,
          estimatedWaitMin: Math.max(5, 45 - priority * 8)
        }
      });
    }
  }

  // 8. Create Live Notifications
  const sampleNotifications = [
    { title: "Emergency Priority Alert", message: "Patient P000006 admitted to Emergency Resuscitation. Priority Level 5.", type: "EMERGENCY", targetRole: "ALL" },
    { title: "ICU Bed Reserved", message: "Bed B-019 reserved for transfer from Cardiology.", type: "WARNING", targetRole: "NURSE" },
    { title: "Bed Maintenance Complete", message: "Bed B-005 in ER Bay 2 has been sanitized and marked AVAILABLE.", type: "SUCCESS", targetRole: "ALL" },
    { title: "Queue Update", message: "General Medicine outpatient queue running on schedule. Avg wait time: 14 mins.", type: "INFO", targetRole: "DOCTOR" }
  ];

  for (const notif of sampleNotifications) {
    await prisma.notification.create({ data: notif });
  }

  // 9. Initial Audit Logs
  await prisma.auditLog.create({
    data: {
      action: "SYSTEM_INITIALIZATION",
      details: "SmartCare Flow digital hospital engine booted. 80 3D beds synchronized.",
      ipAddress: "127.0.0.1"
    }
  });

  console.log(`✅ Seed complete: 50 patients, 20 doctors, 100 appointments, 80 3D beds, 9 departments.`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
