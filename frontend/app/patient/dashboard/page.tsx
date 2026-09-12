"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../../components/navigation/Navbar";
import { apiGetQueue, apiGetAppointments } from "../../../lib/api";
import { QueueItem, Appointment } from "../../../types";
import { useSocket } from "../../../hooks/useSocket";
import { Clock, Ticket, UserCheck, Stethoscope, MapPin, AlertCircle, Heart } from "lucide-react";

export default function PatientDashboardPage() {
  const { lastEvent } = useSocket();
  const [queueItem, setQueueItem] = useState<QueueItem | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  const fetchPatientTicket = async () => {
    try {
      const q = await apiGetQueue();
      if (q.length > 0) {
        setQueueItem(q[0]); // mock or active patient ticket
      }
      const appts = await apiGetAppointments();
      if (appts.length > 0) {
        setAppointment(appts[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPatientTicket();
  }, []);

  useEffect(() => {
    if (lastEvent?.event === "queue.updated") {
      fetchPatientTicket();
    }
  }, [lastEvent]);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6">
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/20">
            <Heart className="w-3.5 h-3.5" /> Patient Live Companion
          </div>
          <h1 className="text-3xl font-black">Your Hospital Visit Status</h1>
          <p className="text-xs text-slate-400">
            Real-time consultation tracking, queue position, and departmental wayfinding.
          </p>
        </div>

        {/* Live Ticket Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 border border-sky-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Assigned Ticket Number
              </span>
              <div className="text-4xl sm:text-5xl font-mono font-black text-sky-400 mt-1">
                {queueItem?.ticketNumber || "Q-014"}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Status
              </span>
              <div className="mt-1">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-xs">
                  {queueItem?.status || "WAITING"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
              <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <span className="text-xs text-slate-400">Estimated Wait Time</span>
              <p className="text-xl font-black text-white mt-1">
                ~{queueItem?.estimatedWaitMin || 12} Mins
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
              <Ticket className="w-6 h-6 text-sky-400 mx-auto mb-2" />
              <span className="text-xs text-slate-400">Your Queue Position</span>
              <p className="text-xl font-black text-sky-400 mt-1">#1 in Line</p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
              <Stethoscope className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <span className="text-xs text-slate-400">Attending Doctor</span>
              <p className="text-sm font-bold text-white mt-1">
                {appointment?.doctor?.name || "Dr. Marcus Chen"}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-300 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Department Location:</span>
              <p className="text-slate-400 mt-0.5">
                Floor 1 — Emergency Trauma Bay / Outpatient Wing (West Side). Please remain in the reception waiting lounge until your ticket is announced.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}