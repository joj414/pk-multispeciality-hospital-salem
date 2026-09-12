"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../../components/navigation/Navbar";
import { apiGetAppointments, apiGetQueue, apiCallNextPatient, apiUpdateAppointmentStatus } from "../../../lib/api";
import { Appointment, QueueItem } from "../../../types";
import { useSocket } from "../../../hooks/useSocket";
import { Stethoscope, PhoneCall, Play, CheckCircle2, UserX, Clock, Users, Activity } from "lucide-react";

export default function DoctorDashboardPage() {
  const { lastEvent } = useSocket();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Appointment | null>(null);

  const refresh = async () => {
    try {
      const [appts, q] = await Promise.all([apiGetAppointments(), apiGetQueue()]);
      setAppointments(appts);
      setQueue(q);

      const inProg = appts.find((a) => a.status === "IN_PROGRESS" || a.status === "CALLED");
      if (inProg) setCurrentPatient(inProg);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (lastEvent?.event.includes("appointment") || lastEvent?.event.includes("queue")) {
      refresh();
    }
  }, [lastEvent]);

  const handleCallNext = async () => {
    const next = await apiCallNextPatient(undefined, "Dr. Marcus Chen");
    refresh();
  };

  const handleStart = async (id: string) => {
    await apiUpdateAppointmentStatus(id, "IN_PROGRESS");
    refresh();
  };

  const handleComplete = async (id: string) => {
    await apiUpdateAppointmentStatus(id, "COMPLETED");
    setCurrentPatient(null);
    refresh();
  };

  const handleNoShow = async (id: string) => {
    await apiUpdateAppointmentStatus(id, "NO_SHOW");
    setCurrentPatient(null);
    refresh();
  };

  const waitingAppts = appointments.filter((a) => a.status === "WAITING" || a.status === "BOOKED");
  const completedAppts = appointments.filter((a) => a.status === "COMPLETED");

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Stethoscope className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-black">Physician Clinical Workspace</h1>
                <p className="text-xs text-slate-400">Dr. Marcus Chen — Chief of Emergency Medicine & Trauma</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCallNext}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition"
          >
            <PhoneCall className="w-4 h-4" />
            CALL NEXT PATIENT
          </button>
        </div>

        {/* Current In-Consultation Patient Card */}
        <div className="bg-slate-900/80 border border-sky-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 animate-pulse text-sky-400" />
              Current Consultation Active
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Room ER-Bay 1
            </span>
          </div>

          {currentPatient ? (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">{currentPatient.patient?.name}</h2>
                <p className="text-xs text-slate-300 mt-1">
                  ID: {currentPatient.patientId} • Age: {currentPatient.patient?.age} • Blood: {currentPatient.patient?.bloodGroup}
                </p>
                <div className="mt-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">Chief Complaint:</span> {currentPatient.reason}
                </div>
              </div>

              {/* Consultation Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {currentPatient.status !== "IN_PROGRESS" && (
                  <button
                    onClick={() => handleStart(currentPatient.id)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    START APPOINTMENT
                  </button>
                )}
                <button
                  onClick={() => handleComplete(currentPatient.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  COMPLETE APPOINTMENT
                </button>
                <button
                  onClick={() => handleNoShow(currentPatient.id)}
                  className="px-4 py-2 bg-rose-950/60 border border-rose-700/50 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <UserX className="w-3.5 h-3.5" />
                  MARK NO-SHOW
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-slate-500 text-xs">
              No patient currently inside consultation room. Click "Call Next Patient" to summon ticket.
            </div>
          )}
        </div>

        {/* Dual Lists: Waiting Queue vs Completed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Waiting List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Today's Upcoming Consultations ({waitingAppts.length})
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {waitingAppts.slice(0, 10).map((apt) => (
                <div key={apt.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">{apt.patient?.name}</span>
                    <p className="text-[11px] text-slate-400">{apt.time} • {apt.type}</p>
                  </div>
                  <button
                    onClick={() => handleStart(apt.id)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    Admit to Room
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Completed List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Completed Consultations ({completedAppts.length})
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {completedAppts.slice(0, 10).map((apt) => (
                <div key={apt.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">{apt.patient?.name}</span>
                    <p className="text-[11px] text-slate-400">{apt.reason}</p>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">Discharged</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}