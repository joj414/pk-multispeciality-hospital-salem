import { Bed } from "../types";

// Complete 80-bed layout across 3 hospital floors with exact 3D coordinates
export const DEFAULT_HOSPITAL_BEDS: Bed[] = [
  // =========================================================================
  // FLOOR 1: Emergency & Diagnostics (16 Beds: B-001 to B-016)
  // =========================================================================
  ...Array.from({ length: 12 }, (_, idx) => ({
    id: `bed-f1-er-${idx + 1}`,
    code: `B-${String(idx + 1).padStart(3, "0")}`,
    floor: 1,
    room: `ER Trauma Bay ${(idx % 4) + 1}`,
    type: "EMERGENCY" as const,
    status: (idx % 3 === 0 ? "OCCUPIED" : idx % 5 === 0 ? "RESERVED" : "AVAILABLE") as any,
    positionX: -14 + (idx % 4) * 3.6,
    positionY: 0.5,
    positionZ: -8 + Math.floor(idx / 4) * 5.2,
    departmentId: "dept-emergency",
    department: { id: "dept-emergency", name: "Emergency & Trauma", code: "EMERGENCY", floor: 1 } as any,
    currentPatient: idx % 3 === 0 ? { id: `P00000${idx + 1}`, name: `Patient ${idx + 1}`, bloodGroup: "O+" } as any : undefined
  })),
  ...Array.from({ length: 4 }, (_, idx) => ({
    id: `bed-f1-diag-${idx + 13}`,
    code: `B-${String(idx + 13).padStart(3, "0")}`,
    floor: 1,
    room: `Obs Bay ${idx + 1}`,
    type: "GENERAL" as const,
    status: (idx === 0 ? "OCCUPIED" : "AVAILABLE") as any,
    positionX: 8 + (idx % 2) * 4.2,
    positionY: 0.5,
    positionZ: -6 + Math.floor(idx / 2) * 5.2,
    departmentId: "dept-diag",
    department: { id: "dept-diag", name: "Diagnostics & Imaging", code: "DIAG", floor: 1 } as any
  })),

  // =========================================================================
  // FLOOR 2: ICU, General Ward, Cardiology (48 Beds: B-017 to B-064)
  // =========================================================================
  ...Array.from({ length: 16 }, (_, idx) => ({
    id: `bed-f2-icu-${idx + 17}`,
    code: `B-${String(idx + 17).padStart(3, "0")}`,
    floor: 2,
    room: `ICU Suite ${idx + 1}`,
    type: "ICU" as const,
    status: (idx % 2 === 0 ? "OCCUPIED" : idx % 7 === 0 ? "CLEANING" : "AVAILABLE") as any,
    positionX: -15 + (idx % 4) * 3.6,
    positionY: 8.5,
    positionZ: -9 + Math.floor(idx / 4) * 4.6,
    departmentId: "dept-icu",
    department: { id: "dept-icu", name: "Intensive Care Unit", code: "ICU", floor: 2 } as any,
    currentPatient: idx % 2 === 0 ? { id: `P0000${idx + 17}`, name: `Patient ${idx + 17}`, bloodGroup: "A+" } as any : undefined
  })),
  ...Array.from({ length: 24 }, (_, idx) => ({
    id: `bed-f2-gen-${idx + 33}`,
    code: `B-${String(idx + 33).padStart(3, "0")}`,
    floor: 2,
    room: `Ward ${101 + Math.floor(idx / 4)}`,
    type: "GENERAL" as const,
    status: (idx % 3 === 1 ? "OCCUPIED" : idx % 8 === 0 ? "MAINTENANCE" : "AVAILABLE") as any,
    positionX: 2 + (idx % 6) * 2.8,
    positionY: 8.5,
    positionZ: -8 + Math.floor(idx / 6) * 4.6,
    departmentId: "dept-gen",
    department: { id: "dept-gen", name: "General Inpatient", code: "GEN", floor: 2 } as any
  })),
  ...Array.from({ length: 8 }, (_, idx) => ({
    id: `bed-f2-card-${idx + 57}`,
    code: `B-${String(idx + 57).padStart(3, "0")}`,
    floor: 2,
    room: `Telemetry ${idx + 1}`,
    type: "PRIVATE" as const,
    status: (idx % 2 === 1 ? "OCCUPIED" : "AVAILABLE") as any,
    positionX: -5 + (idx % 4) * 3.6,
    positionY: 8.5,
    positionZ: 9 + Math.floor(idx / 4) * 4.6,
    departmentId: "dept-card",
    department: { id: "dept-card", name: "Cardiology", code: "CARD", floor: 2 } as any
  })),

  // =========================================================================
  // FLOOR 3: Pediatrics, Neurology, Orthopedics (16 Beds: B-065 to B-080)
  // =========================================================================
  ...Array.from({ length: 8 }, (_, idx) => ({
    id: `bed-f3-ped-${idx + 65}`,
    code: `B-${String(idx + 65).padStart(3, "0")}`,
    floor: 3,
    room: `Peds Room ${idx + 1}`,
    type: "GENERAL" as const,
    status: (idx % 3 === 0 ? "OCCUPIED" : "AVAILABLE") as any,
    positionX: -14 + (idx % 4) * 3.6,
    positionY: 16.5,
    positionZ: -7 + Math.floor(idx / 4) * 5.2,
    departmentId: "dept-ped",
    department: { id: "dept-ped", name: "Pediatrics", code: "PED", floor: 3 } as any
  })),
  ...Array.from({ length: 4 }, (_, idx) => ({
    id: `bed-f3-neuro-${idx + 73}`,
    code: `B-${String(idx + 73).padStart(3, "0")}`,
    floor: 3,
    room: `Neuro Suite ${idx + 1}`,
    type: "ICU" as const,
    status: (idx === 1 ? "OCCUPIED" : "AVAILABLE") as any,
    positionX: 3 + (idx % 2) * 4.2,
    positionY: 16.5,
    positionZ: -7 + Math.floor(idx / 2) * 5.2,
    departmentId: "dept-neuro",
    department: { id: "dept-neuro", name: "Neurology", code: "NEURO", floor: 3 } as any
  })),
  ...Array.from({ length: 4 }, (_, idx) => ({
    id: `bed-f3-ortho-${idx + 77}`,
    code: `B-${String(idx + 77).padStart(3, "0")}`,
    floor: 3,
    room: `Ortho Bay ${idx + 1}`,
    type: "GENERAL" as const,
    status: "AVAILABLE" as any,
    positionX: 3 + (idx % 2) * 4.2,
    positionY: 16.5,
    positionZ: 6 + Math.floor(idx / 2) * 5.2,
    departmentId: "dept-ortho",
    department: { id: "dept-ortho", name: "Orthopedics", code: "ORTHO", floor: 3 } as any
  }))
];
