"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../../components/navigation/Navbar";
import { apiGetBeds, apiUpdateBedStatus, apiReleaseBed } from "../../../lib/api";
import { Bed } from "../../../types";
import { useSocket } from "../../../hooks/useSocket";
import { Sparkles, BedDouble, AlertCircle, ArrowRightLeft, CheckCircle2, ShieldAlert } from "lucide-react";

export default function NurseDashboardPage() {
  const { lastEvent } = useSocket();
  const [beds, setBeds] = useState<Bed[]>([]);

  const refresh = async () => {
    try {
      const b = await apiGetBeds();
      setBeds(b);
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

  const cleaningBeds = beds.filter((b) => b.status === "CLEANING");
  const occupiedBeds = beds.filter((b) => b.status === "OCCUPIED");

  const handleMarkSanitized = async (bedId: string) => {
    await apiUpdateBedStatus(bedId, "AVAILABLE", "Sanitized & Linens Changed by Nurse");
    refresh();
  };

  const handleDischarge = async (bedId: string) => {
    await apiReleaseBed(bedId);
    refresh();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <span className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
            <Sparkles className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black">Nursing Station & Bed Turnover</h1>
            <p className="text-xs text-slate-400">Nurse Sarah Jenkins — Charge Nurse & Bed Management Lead</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cleaning Queue */}
          <div className="bg-slate-900/60 border border-sky-500/30 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-sky-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Sanitization & Cleaning Queue ({cleaningBeds.length})
              </h3>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {cleaningBeds.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  All discharged beds are currently sanitized and ready for admission.
                </div>
              ) : (
                cleaningBeds.map((bed) => (
                  <div key={bed.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white">{bed.code} ({bed.room})</span>
                      <p className="text-[11px] text-slate-400">Floor {bed.floor} • {bed.department?.name}</p>
                    </div>
                    <button
                      onClick={() => handleMarkSanitized(bed.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Ready (Available)
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Occupied Inpatient Discharges */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-rose-400" />
                Active Inpatient Admissions ({occupiedBeds.length})
              </h3>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {occupiedBeds.slice(0, 10).map((bed) => (
                <div key={bed.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">{bed.code} — {bed.currentPatient?.name || "Patient Admitted"}</span>
                    <p className="text-[11px] text-slate-400">Floor {bed.floor} • {bed.type}</p>
                  </div>
                  <button
                    onClick={() => handleDischarge(bed.id)}
                    className="px-3 py-1.5 bg-rose-950/60 border border-rose-700/50 hover:bg-rose-900 text-rose-300 rounded-lg font-bold transition"
                  >
                    Initiate Discharge
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}