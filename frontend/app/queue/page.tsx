"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/navigation/Navbar";
import { apiGetQueue, apiCallNextPatient, apiUpdateQueuePriority, apiEnqueuePatient, apiGetPatients, apiGetDepartments } from "../../lib/api";
import { QueueItem, Patient, Department } from "../../types";
import { getPriorityMeta } from "../../lib/utils";
import { useSocket } from "../../hooks/useSocket";
import {
  Activity,
  Flame,
  Clock,
  PhoneCall,
  UserPlus,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export default function QueuePage() {
  const { lastEvent } = useSocket();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Enqueue form modal
  const [showEnqueueModal, setShowEnqueueModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [priorityScore, setPriorityScore] = useState(1);
  const [isEmergency, setIsEmergency] = useState(false);
  const [calledMessage, setCalledMessage] = useState<string | null>(null);

  const fetchQueueData = async () => {
    try {
      const [qData, pData, dData] = await Promise.all([
        apiGetQueue(),
        apiGetPatients(),
        apiGetDepartments()
      ]);
      setQueue(qData);
      setPatients(pData);
      setDepartments(dData);
      if (dData.length > 0) setSelectedDeptId(dData[0].id);
    } catch (err) {
      console.error("Queue load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
  }, []);

  // Real-time synchronization
  useEffect(() => {
    if (lastEvent?.event === "queue.updated") {
      fetchQueueData();
    }
  }, [lastEvent]);

  // Call Next Patient
  const handleCallNext = async () => {
    try {
      const next = await apiCallNextPatient(undefined, "Triage Desk");
      if (next) {
        setCalledMessage(`Now Calling: ${next.ticketNumber} — ${next.patientName}`);
        setTimeout(() => setCalledMessage(null), 5000);
      }
      fetchQueueData();
    } catch (err) {
      console.error(err);
    }
  };

  // Escalate / Change priority
  const handleUpdatePriority = async (id: string, newScore: number) => {
    if (newScore < 1 || newScore > 5) return;
    await apiUpdateQueuePriority(id, newScore);
    fetchQueueData();
  };

  // Submit enqueue
  const handleEnqueue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedDeptId) return;

    await apiEnqueuePatient({
      patientId: selectedPatientId,
      departmentId: selectedDeptId,
      priorityScore,
      isEmergency
    });
    setShowEnqueueModal(false);
    fetchQueueData();
  };

  // Separate priority emergency queue vs FIFO routine
  const emergencyQueue = queue.filter((q) => q.priorityScore >= 3 || q.queueType === "PRIORITY");
  const routineQueue = queue.filter((q) => q.priorityScore < 3 && q.queueType === "FIFO");

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                <Activity className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Priority-Aware Hospital Queue
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Dynamic triage scheduling combining Max-Heap emergency preemption with FIFO routine flow.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleCallNext}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition"
            >
              <PhoneCall className="w-4 h-4" />
              Call Next Patient
            </button>

            <button
              onClick={() => setShowEnqueueModal(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-900/30 flex items-center justify-center gap-2 transition"
            >
              <UserPlus className="w-4 h-4" />
              Enqueue Patient
            </button>
          </div>
        </div>

        {/* Live Call Announcement Banner */}
        {calledMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 flex items-center gap-3 animate-bounce">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">{calledMessage}</span>
          </div>
        )}

        {/* Dual Column Queue Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Priority Queue (Max-Heap) */}
          <div className="bg-slate-900/60 border border-red-500/30 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base">Emergency Priority Queue (Max-Heap)</h2>
                  <p className="text-xs text-slate-400">Urgency Level 3 to 5 • Immediate Preemption</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold font-mono">
                {emergencyQueue.length} Active
              </span>
            </div>

            <div className="space-y-2.5">
              {emergencyQueue.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No emergency patients currently waiting.
                </div>
              ) : (
                emergencyQueue.map((item, idx) => {
                  const meta = getPriorityMeta(item.priorityScore);
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-slate-800 font-mono text-xs font-black flex items-center justify-center text-slate-300">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{item.patientName}</span>
                            <span className="text-xs text-slate-400 font-mono">({item.patientId})</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-sky-400">{item.departmentName || "Emergency"}</span>
                            <span className="text-slate-600">•</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${meta.color}`}>
                              Priority {item.priorityScore}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Priority Escalation controls */}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleUpdatePriority(item.id, item.priorityScore + 1)}
                            disabled={item.priorityScore >= 5}
                            title="Escalate Urgency"
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleUpdatePriority(item.id, item.priorityScore - 1)}
                            disabled={item.priorityScore <= 1}
                            title="De-escalate Urgency"
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Outpatient FIFO Queue */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base">Outpatient Routine Queue (FIFO)</h2>
                  <p className="text-xs text-slate-400">First-In, First-Out Routine Consultations</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 text-xs font-bold font-mono">
                {routineQueue.length} Active
              </span>
            </div>

            <div className="space-y-2.5">
              {routineQueue.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Routine queue is currently clear.
                </div>
              ) : (
                routineQueue.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-slate-800 font-mono text-xs font-black flex items-center justify-center text-slate-300">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{item.patientName}</span>
                          <span className="text-xs text-slate-400 font-mono">({item.ticketNumber})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.departmentName || "Outpatient Clinic"} • Est. Wait: ~{item.estimatedWaitMin} mins
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUpdatePriority(item.id, 4)}
                      className="px-2.5 py-1 bg-red-950/50 hover:bg-red-900 border border-red-700/50 text-red-400 rounded-lg text-[11px] font-semibold transition"
                    >
                      Triage Escalate
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Enqueue Modal */}
      {showEnqueueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleEnqueue} className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Enqueue Patient</h3>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Select Patient</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="">-- Choose patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Department</label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} (Floor {d.floor})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Triage Priority (1: Routine to 5: Critical)</label>
              <select
                value={priorityScore}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPriorityScore(val);
                  if (val >= 4) setIsEmergency(true);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value={1}>Priority 1 - Routine / Non-Urgent</option>
                <option value={2}>Priority 2 - Semi-Urgent</option>
                <option value={3}>Priority 3 - Urgent</option>
                <option value={4}>Priority 4 - Emergent Trauma</option>
                <option value={5}>Priority 5 - Critical Resuscitation</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="emergCheck"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="rounded text-sky-500 bg-slate-950 border-slate-700"
              />
              <label htmlFor="emergCheck" className="text-xs text-slate-300">
                Mark as Critical Emergency Preemption
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowEnqueueModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold"
              >
                Enqueue
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}