"use client";

import React from "react";
import { Html } from "@react-three/drei";

interface DepartmentLabelsProps {
  onSelectDepartment: (deptCode: string) => void;
  activeFloor: number | "ALL";
}

export const DepartmentLabels: React.FC<DepartmentLabelsProps> = ({
  onSelectDepartment,
  activeFloor
}) => {
  const departments = [
    // Floor 1
    {
      code: "EMERGENCY",
      name: "Emergency & Trauma",
      floor: 1,
      pos: [-10, 4.5, -8] as [number, number, number],
      beds: "7/12 Beds",
      badgeColor: "bg-red-500/20 border-red-500/40 text-red-400"
    },
    {
      code: "DIAG",
      name: "Diagnostics & Imaging",
      floor: 1,
      pos: [10, 4.5, -4] as [number, number, number],
      beds: "2/4 Obs",
      badgeColor: "bg-indigo-500/20 border-indigo-500/40 text-indigo-400"
    },
    // Floor 2
    {
      code: "ICU",
      name: "Intensive Care Unit (ICU)",
      floor: 2,
      pos: [-10, 12.5, -9] as [number, number, number],
      beds: "12/16 Beds",
      badgeColor: "bg-amber-500/20 border-amber-500/40 text-amber-400"
    },
    {
      code: "GEN",
      name: "General Inpatient Ward",
      floor: 2,
      pos: [10, 12.5, -4] as [number, number, number],
      beds: "18/24 Beds",
      badgeColor: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
    },
    {
      code: "CARD",
      name: "Cardiology Unit",
      floor: 2,
      pos: [-5, 12.5, 9] as [number, number, number],
      beds: "6/8 Beds",
      badgeColor: "bg-sky-500/20 border-sky-500/40 text-sky-400"
    },
    // Floor 3
    {
      code: "PED",
      name: "Pediatrics Ward",
      floor: 3,
      pos: [-8, 20.5, -6] as [number, number, number],
      beds: "5/8 Beds",
      badgeColor: "bg-pink-500/20 border-pink-500/40 text-pink-400"
    },
    {
      code: "NEURO",
      name: "Neurology & Stroke",
      floor: 3,
      pos: [6, 20.5, -6] as [number, number, number],
      beds: "3/4 Beds",
      badgeColor: "bg-purple-500/20 border-purple-500/40 text-purple-400"
    }
  ];

  return (
    <>
      {departments.map((dept) => {
        // Only show if matching active floor or ALL floors
        if (activeFloor !== "ALL" && activeFloor !== dept.floor) {
          return null;
        }

        return (
          <group key={dept.code} position={dept.pos}>
            <Html center distanceFactor={22}>
              <button
                onClick={() => onSelectDepartment(dept.code)}
                className={`cursor-pointer px-3 py-1.5 rounded-xl backdrop-blur-md border shadow-lg flex items-center gap-2 hover:scale-105 transition-all text-xs font-semibold select-none ${dept.badgeColor} bg-slate-900/90 hover:bg-slate-800`}
              >
                <span>{dept.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 font-mono text-slate-300">
                  {dept.beds}
                </span>
              </button>
            </Html>
          </group>
        );
      })}
    </>
  );
};