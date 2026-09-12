"use client";

import React, { useState } from "react";
import { Bed, BedStatus, Patient } from "../../types";
import { getBedStatusColor } from "../../lib/utils";
import { X, UserCheck, ShieldAlert, Sparkles, Wrench, CheckCircle2, ArrowRight } from "lucide-react";

interface BedDetailsModalProps {
  bed: Bed | null;
  patients: Patient[];
  onClose: () => void;
  onUpdateStatus: (bedId: string, status: BedStatus) => Promise<void>;
  onAllocateBed: (bedId: string, patientId: string, reason?: string) => Promise<void>;
  onReleaseBed: (bedId: string) => Promise<void>;
}

export const BedDetailsModal: React.FC<BedDetailsModalProps> = ({
  bed,
  patients,
  onClose,
  onUpdateStatus,
  onAllocateBed,
  onReleaseBed
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [allocationReason, setAllocationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!bed) return null;

  const statusMeta = getBedStatusColor(bed.status);
  const unassignedPatients = patients.filter((p) => p.status !== "ADMITTED");

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;
    setIsSubmitting(true);
    try {
      await onAllocateBed(bed.id, selectedPatientId, allocationReason || "Manual Bed Allocation");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full shadow-lg"
              style={{ backgroundColor: statusMeta.hex, boxShadow: `0 0 12px ${statusMeta.hex}` }}
            />
            <div>
              <h3 className="text-lg font-bold tracking-wide">Bed {bed.code}</h3>
              <p className="text-xs text-slate-400">
                Floor {bed.floor} • {bed.room}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs text-slate-400">Department</span>
              <p className="font-semibold text-sky-400 mt-0.5">{bed.department?.name || "General"}</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs text-slate-400">Bed Type</span>
              <p className="font-semibold text-indigo-400 mt-0.5">{bed.type}</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs text-slate-400">Current Status</span>
              <p className="font-semibold mt-0.5" style={{ color: statusMeta.hex }}>
                {statusMeta.label}
              </p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs text-slate-400">Last Updated</span>
              <p className="font-semibold text-slate-300 mt-0.5">
                {new Date(bed.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Occupied Patient Details */}
          {bed.currentPatient ? (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40">
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                Assigned Patient
              </span>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">{bed.currentPatient.name}</h4>
                  <p className="text-xs text-slate-300">
                    ID: {bed.currentPatient.id} • Age: {bed.currentPatient.age} ({bed.currentPatient.gender}) • Blood: {bed.currentPatient.bloodGroup}
                  </p>
                </div>
                {bed.currentPatient.isEmergency && (
                  <span className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold animate-pulse">
                    EMERGENCY
                  </span>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-red-900/40 flex justify-end">
                <button
                  onClick={() => onReleaseBed(bed.id)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Discharge & Send to Cleaning
                </button>
              </div>
            </div>
          ) : (
            /* Allocation Section if Available */
            bed.status === "AVAILABLE" && (
              <form onSubmit={handleAllocate} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  Allocate to Patient
                </span>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Select Patient</label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="">-- Choose unadmitted patient --</option>
                    {unassignedPatients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} - {p.name} {p.isEmergency ? "🚨 [CRITICAL]" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Clinical / Admission Note</label>
                  <input
                    type="text"
                    value={allocationReason}
                    onChange={(e) => setAllocationReason(e.target.value)}
                    placeholder="e.g. Inpatient Admission from ER Triage"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedPatientId}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
                >
                  Confirm Allocation
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )
          )}

          {/* Quick Status Transitions */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Operational State Override
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onUpdateStatus(bed.id, "AVAILABLE")}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-950/40 border border-emerald-700/50 hover:bg-emerald-900/60 text-emerald-400 flex items-center justify-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Available
              </button>
              <button
                onClick={() => onUpdateStatus(bed.id, "RESERVED")}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-950/40 border border-amber-700/50 hover:bg-amber-900/60 text-amber-400 flex items-center justify-center gap-1.5 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Reserve
              </button>
              <button
                onClick={() => onUpdateStatus(bed.id, "CLEANING")}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-sky-950/40 border border-sky-700/50 hover:bg-sky-900/60 text-sky-400 flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Cleaning
              </button>
              <button
                onClick={() => onUpdateStatus(bed.id, "MAINTENANCE")}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-1.5 col-span-3 transition"
              >
                <Wrench className="w-3.5 h-3.5" />
                Mark Under Maintenance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};