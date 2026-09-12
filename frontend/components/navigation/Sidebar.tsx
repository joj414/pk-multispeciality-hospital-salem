"use client";

import React from "react";
import {
  Layers,
  Flame,
  HeartPulse,
  Stethoscope,
  Baby,
  Brain,
  Bone,
  Eye,
  Activity
} from "lucide-react";

interface SidebarProps {
  activeFloor: number | "ALL";
  onSelectFloor: (floor: number | "ALL") => void;
  onSelectDepartment: (deptCode: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeFloor,
  onSelectFloor,
  onSelectDepartment
}) => {
  const floors: { id: number | "ALL"; label: string; sub: string }[] = [
    { id: "ALL", label: "Full Hospital", sub: "Complete 3D Twin" },
    { id: 1, label: "Floor 1", sub: "Emergency & Diagnostics" },
    { id: 2, label: "Floor 2", sub: "ICU & General Ward" },
    { id: 3, label: "Floor 3", sub: "Pediatrics & Specialty" }
  ];

  const depts = [
    { code: "EMERGENCY", name: "Emergency Trauma", icon: Flame, color: "text-red-400" },
    { code: "ICU", name: "Intensive Care (ICU)", icon: HeartPulse, color: "text-amber-400" },
    { code: "GEN", name: "General Ward", icon: Stethoscope, color: "text-emerald-400" },
    { code: "PED", name: "Pediatrics", icon: Baby, color: "text-pink-400" },
    { code: "CARD", name: "Cardiology", icon: Activity, color: "text-sky-400" }
  ];

  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-md border-r border-slate-800/80 flex flex-col p-4 text-slate-300 select-none overflow-y-auto hidden md:flex">
      {/* Floor Cutaway Controls */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Architectural View
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {floors.map((f) => {
            const isActive = activeFloor === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onSelectFloor(f.id)}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-center ${
                  isActive
                    ? "bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-md shadow-sky-500/10"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span className="font-bold text-xs">{f.label}</span>
                <span className="text-[10px] text-slate-500 truncate">{f.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Department Focus Buttons */}
      <div className="mt-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Focus Department
        </h3>
        <div className="space-y-1.5">
          {depts.map((d) => {
            const Icon = d.icon;
            return (
              <button
                key={d.code}
                onClick={() => onSelectDepartment(d.code)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800/60 hover:border-slate-700 text-xs font-medium flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${d.color} group-hover:scale-110 transition`} />
                  <span className="text-slate-300 group-hover:text-white">{d.name}</span>
                </div>
                <Eye className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Bed Status Legend */}
      <div className="mt-auto pt-6 border-t border-slate-800/60">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Bed Status Indicators
        </h3>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-sm shadow-emerald-500/50" />
            <span className="text-slate-400">Available (Soft Green)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-sm shadow-red-500/50" />
            <span className="text-slate-400">Occupied (Red)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-sm shadow-amber-500/50" />
            <span className="text-slate-400">Reserved (Amber)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9] shadow-sm shadow-sky-500/50" />
            <span className="text-slate-400">Cleaning (Sky Blue)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#64748B] shadow-sm shadow-slate-500/50" />
            <span className="text-slate-400">Maintenance (Slate)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};