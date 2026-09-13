"use client";

import React, { useState, useEffect } from "react";
import { apiGetAppointments, apiCreateAppointment, apiUpdateAppointmentStatus, apiGetPatients, apiGetDoctors, apiGetDepartments } from "../../lib/api";
import { Appointment, Patient, Doctor, Department } from "../../types";
import { useSocket } from "../../hooks/useSocket";
import { Calendar, Plus } from "lucide-react";

export const AppointmentsView: React.FC = () => {
  const { lastEvent } = useSocket();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showBookModal, setShowBookModal] = useState(false);

  // Booking fields
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [date, setDate] = useState("2026-09-12");
  const [time, setTime] = useState("11:30");
  const [type, setType] = useState("ROUTINE");
  const [reason, setReason] = useState("");

  const refresh = async () => {
    try {
      const [a, p, d, depts] = await Promise.all([
        apiGetAppointments(),
        apiGetPatients(),
        apiGetDoctors(),
        apiGetDepartments()
      ]);
      setAppointments(a);
      setPatients(p);
      setDoctors(d);
      setDepartments(depts);
      if (depts.length > 0 && !departmentId) setDepartmentId(depts[0].id);
      if (d.length > 0 && !doctorId) setDoctorId(d[0].id);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (lastEvent?.event.startsWith("appointment.")) {
      refresh();
    }
  }, [lastEvent]);

  const handleStatusChange = async (id: string, status: string) => {
    await apiUpdateAppointmentStatus(id, status);
    refresh();
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !departmentId) return;

    await apiCreateAppointment({
      patientId,
      doctorId,
      departmentId,
      date,
      time,
      type,
      reason: reason || "Routine outpatient examination"
    });

    setShowBookModal(false);
    refresh();
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Calendar className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Appointment Scheduling &amp; Clinical Flow
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Synchronized consultation schedule managing states from BOOKED to COMPLETED.
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/30 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Book New Appointment
        </button>
      </div>

      {/* Appointments List Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Time</th>
                <th className="p-3.5">Patient</th>
                <th className="p-3.5">Attending Doctor</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Type &amp; Reason</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {appointments.slice(0, 30).map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-mono font-bold text-sky-400">{apt.time}</td>
                  <td className="p-3.5 font-bold text-white">
                    {apt.patient?.name}
                    <div className="text-[10px] text-slate-500 font-mono">{apt.patientId}</div>
                  </td>
                  <td className="p-3.5 text-slate-300">{apt.doctor?.name}</td>
                  <td className="p-3.5 text-slate-300">{apt.department?.name}</td>
                  <td className="p-3.5 max-w-xs truncate text-slate-400">
                    <span className="font-semibold text-slate-200 mr-1.5">{apt.type}:</span>
                    {apt.reason}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      apt.status === "COMPLETED"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : apt.status === "IN_PROGRESS"
                        ? "bg-sky-500/20 text-sky-400 animate-pulse"
                        : apt.status === "CALLED"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-slate-800 text-slate-300"
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1">
                    {apt.status !== "COMPLETED" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(apt.id, "IN_PROGRESS")}
                          className="px-2 py-1 rounded bg-sky-950/60 border border-sky-700/50 hover:bg-sky-900 text-sky-400 text-[10px] font-semibold"
                        >
                          Start
                        </button>
                        <button
                          onClick={() => handleStatusChange(apt.id, "COMPLETED")}
                          className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700/50 hover:bg-emerald-900 text-emerald-400 text-[10px] font-semibold"
                        >
                          Complete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleBook} className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Book Appointment</h3>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Patient</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="">-- Select Patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Doctor</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="ROUTINE">Routine</option>
                  <option value="SPECIALIST">Specialist</option>
                  <option value="FOLLOW_UP">Follow-Up</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Chief Complaint / Reason</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Hypertension review, chest tightness"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
