"use client";

import React, { useState, useEffect } from "react";
import { BedDetailsModal } from "../ui/BedDetailsModal";
import { apiGetBeds, apiGetPatients, apiUpdateBedStatus, apiAllocateBed, apiReleaseBed, apiGetDepartments } from "../../lib/api";
import { Bed, Patient, Department, BedStatus } from "../../types";
import { getBedStatusColor } from "../../lib/utils";
import { useSocket } from "../../hooks/useSocket";
import {
  BedDouble,
  Filter,
  Search
} from "lucide-react";

export const BedsView: React.FC = () => {
  const { lastEvent } = useSocket();
  const [beds, setBeds] = useState<Bed[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  // Filters
  const [floorFilter, setFloorFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchCode, setSearchCode] = useState<string>("");

  const refresh = async () => {
    try {
      const [b, p, d] = await Promise.all([
        apiGetBeds(),
        apiGetPatients(),
        apiGetDepartments()
      ]);
      setBeds(b);
      setPatients(p);
      setDepartments(d);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (lastEvent?.event.startsWith("bed.")) {
      refresh();
    }
  }, [lastEvent]);

  const filteredBeds = beds.filter((bed) => {
    if (floorFilter !== "ALL" && bed.floor !== Number(floorFilter)) return false;
    if (statusFilter !== "ALL" && bed.status !== statusFilter) return false;
    if (searchCode && !bed.code.toLowerCase().includes(searchCode.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <BedDouble className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Hospital Bed Management Matrix
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Live census and operational state across all 80 hospital beds in 3 floors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Total: {beds.length}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-400">
            Available: {beds.filter((b) => b.status === "AVAILABLE").length}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-red-950/50 border border-red-800 text-red-400">
            Occupied: {beds.filter((b) => b.status === "OCCUPIED").length}
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 px-2">
          <Filter className="w-4 h-4 text-sky-400" />
          <span>Filter:</span>
        </div>

        {/* Floor */}
        <select
          value={floorFilter}
          onChange={(e) => setFloorFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
        >
          <option value="ALL">All Floors</option>
          <option value="1">Floor 1 (Emergency &amp; Diagnostics)</option>
          <option value="2">Floor 2 (ICU &amp; General Ward)</option>
          <option value="3">Floor 3 (Pediatrics &amp; Specialty)</option>
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
        >
          <option value="ALL">All Bed States</option>
          <option value="AVAILABLE">Available</option>
          <option value="OCCUPIED">Occupied</option>
          <option value="RESERVED">Reserved</option>
          <option value="CLEANING">Cleaning</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>

        {/* Search Bed Code */}
        <div className="relative ml-auto">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Search bed (e.g. B-012)..."
            className="bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      {/* Beds Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {filteredBeds.map((bed) => {
          const meta = getBedStatusColor(bed.status);
          return (
            <div
              key={bed.id}
              onClick={() => setSelectedBed(bed)}
              className={`p-3 rounded-2xl border cursor-pointer hover:scale-105 hover:shadow-xl transition flex flex-col justify-between h-32 ${meta.bgClass}`}
            >
              <div className="flex justify-between items-start">
                <span className="font-mono font-black text-sm text-white">{bed.code}</span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.hex }} />
              </div>

              <div className="text-[10px] space-y-0.5">
                <div className="font-semibold text-slate-200 truncate">{bed.department?.name || "General"}</div>
                <div className="text-slate-400">Fl {bed.floor} • {bed.type}</div>
                {bed.currentPatient && (
                  <div className="font-bold text-sky-400 truncate">
                    {bed.currentPatient.name}
                  </div>
                )}
              </div>

              <div className="pt-1.5 border-t border-slate-700/40 flex justify-between items-center text-[10px]">
                <span className="font-bold uppercase tracking-wider">{meta.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <BedDetailsModal
        bed={selectedBed}
        patients={patients}
        onClose={() => setSelectedBed(null)}
        onUpdateStatus={async (id, s) => {
          await apiUpdateBedStatus(id, s);
          refresh();
        }}
        onAllocateBed={async (id, pId, r) => {
          await apiAllocateBed({ patientId: pId, reason: r });
          refresh();
        }}
        onReleaseBed={async (id) => {
          await apiReleaseBed(id);
          refresh();
        }}
      />
    </div>
  );
};
