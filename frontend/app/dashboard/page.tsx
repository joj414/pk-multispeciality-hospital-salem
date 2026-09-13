"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "../../components/navigation/Navbar";
import { Sidebar } from "../../components/navigation/Sidebar";
import { BedDetailsModal } from "../../components/ui/BedDetailsModal";
import { SimulationModal } from "../../components/simulation/SimulationModal";
import { useSocket } from "../../hooks/useSocket";
import { useHospitalStore } from "../../hooks/useHospitalStore";
import {
  apiGetBeds,
  apiGetKPIs,
  apiGetPatients,
  apiGetNotifications,
  apiUpdateBedStatus,
  apiAllocateBed,
  apiReleaseBed,
  apiRunSimulation
} from "../../lib/api";
import { Bed, HospitalKPIs, Patient, NotificationItem, BedStatus } from "../../types";
import {
  Activity,
  Users,
  Calendar,
  Clock,
  Flame,
  BedDouble,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Stethoscope
} from "lucide-react";

// Dynamically load 3D Canvas
const HospitalCanvas = dynamic(
  () => import("../../components/3d/HospitalCanvas").then((mod) => mod.HospitalCanvas),
  { ssr: false }
);

export default function DashboardPage() {
  const { isConnected, lastEvent } = useSocket();
  const store = useHospitalStore();

  const [beds, setBeds] = useState<Bed[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [kpis, setKpis] = useState<HospitalKPIs | null>(null);
  const [liveAlerts, setLiveAlerts] = useState<NotificationItem[]>([]);
  const [activityStream, setActivityStream] = useState<string[]>([
    "PK Multispeciality Hospital Salem 3D Twin synchronized.",
    "Max-Heap Priority Engine online and monitoring.",
    "Real-time WebSocket connection established."
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<any | null>(null);

  // Initial load
  const refreshData = async () => {
    try {
      const [bedsData, kpisData, patientsData, notifsData] = await Promise.all([
        apiGetBeds(),
        apiGetKPIs(),
        apiGetPatients(),
        apiGetNotifications()
      ]);
      setBeds(bedsData);
      setKpis(kpisData);
      setPatients(patientsData);
      setLiveAlerts(notifsData);
    } catch (err) {
      console.error("Dashboard refresh error:", err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Listen to Socket.IO real-time events!
  useEffect(() => {
    if (!lastEvent) return;
    const { event, data } = lastEvent;

    if (event === "bed.updated") {
      setBeds((prev) => prev.map((b) => (b.id === data.id ? { ...b, ...data } : b)));
      setActivityStream((prev) => [`Bed ${data.code} status changed to ${data.status}`, ...prev.slice(0, 15)]);
      apiGetKPIs().then(setKpis).catch(() => {});
    } else if (event === "bed.allocated") {
      setActivityStream((prev) => [
        `Bed ${data.bed.code} allocated to ${data.patient.name} (${data.patient.id})`,
        ...prev.slice(0, 15)
      ]);
      apiGetKPIs().then(setKpis).catch(() => {});
    } else if (event === "patient.registered") {
      setActivityStream((prev) => [
        `Patient ${data.name} (${data.id}) registered ${data.isEmergency ? "🚨 EMERGENCY" : ""}`,
        ...prev.slice(0, 15)
      ]);
      if (data.isEmergency) {
        store.setEmergencyActive(true);
      }
      apiGetKPIs().then(setKpis).catch(() => {});
    } else if (event === "notification.created") {
      setLiveAlerts((prev) => [data, ...prev.slice(0, 10)]);
    } else if (event === "simulation.step") {
      setIsSimulating(true);
      setSimStep(data);
      if (data.cameraTarget) {
        store.setCameraTarget(data.cameraTarget);
      }
      if (data.phase === "COMPLETED") {
        setTimeout(() => setIsSimulating(false), 4000);
      }
    }
  }, [lastEvent]);

  // Bed action handlers
  const handleUpdateStatus = async (bedId: string, status: BedStatus) => {
    await apiUpdateBedStatus(bedId, status);
    refreshData();
  };

  const handleAllocateBed = async (bedId: string, patientId: string, reason?: string) => {
    await apiAllocateBed({ patientId, reason });
    refreshData();
  };

  const handleReleaseBed = async (bedId: string) => {
    await apiReleaseBed(bedId);
    refreshData();
  };

  const triggerLiveSimulation = async () => {
    setIsSimulating(true);
    store.setEmergencyActive(true);
    await apiRunSimulation();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar
        theme={store.theme}
        onToggleTheme={store.toggleTheme}
        emergencyActive={store.emergencyActive}
      />

      {/* Top Live Hospital KPIs Bar */}
      <div className="w-full bg-slate-950/70 border-b border-slate-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
              <Users className="w-3 h-3 text-sky-400" /> Patients
            </span>
            <p className="text-base font-black text-white">{kpis?.totalPatients ?? "--"}</p>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-400" /> Appointments
            </span>
            <p className="text-base font-black text-indigo-400">{kpis?.todayAppointments ?? "--"}</p>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> Waiting Queue
            </span>
            <p className="text-base font-black text-amber-400">{kpis?.waitingPatients ?? "--"}</p>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-xl border border-red-500/30">
            <span className="text-[10px] text-red-400 uppercase font-bold flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-red-500" /> Emergency
            </span>
            <p className="text-base font-black text-red-500">{kpis?.emergencyCases ?? "--"}</p>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Available Beds
            </span>
            <p className="text-base font-black text-emerald-400">{kpis?.availableBeds ?? "--"}</p>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-rose-400 uppercase font-bold flex items-center justify-center gap-1">
              <BedDouble className="w-3 h-3 text-rose-400" /> Occupied
            </span>
            <p className="text-base font-black text-rose-400">{kpis?.occupiedBeds ?? "--"}</p>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-sky-400 uppercase font-bold flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-sky-400" /> Occupancy %
            </span>
            <p className="text-base font-black text-sky-400">{kpis?.bedOccupancyRate ?? "--"}%</p>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-cyan-400 uppercase font-bold flex items-center justify-center gap-1">
              <Stethoscope className="w-3 h-3 text-cyan-400" /> Doctors Avail
            </span>
            <p className="text-base font-black text-cyan-400">{kpis?.doctorsAvailable ?? "--"}</p>
          </div>
        </div>
      </div>

      {/* Main Command Center Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeFloor={store.activeFloor}
          onSelectFloor={store.setActiveFloor}
          onSelectDepartment={store.focusDepartment}
        />

        {/* Center: 3D Hospital Canvas */}
        <main className="flex-1 flex flex-col p-3 overflow-hidden">
          <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <HospitalCanvas
              beds={beds}
              selectedBed={store.selectedBed}
              activeFloor={store.activeFloor}
              cameraTarget={store.cameraTarget}
              emergencyActive={store.emergencyActive}
              theme={store.theme}
              onSelectBed={store.focusBed}
              onSelectDepartment={store.focusDepartment}
            />

            {/* Floating Floor Quick Selector on Mobile/Small screens */}
            <div className="absolute top-4 right-4 z-10 flex gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-slate-700 md:hidden">
              {["ALL", 1, 2, 3].map((f) => (
                <button
                  key={f}
                  onClick={() => store.setActiveFloor(f as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    store.activeFloor === f ? "bg-sky-500 text-white" : "text-slate-400"
                  }`}
                >
                  {f === "ALL" ? "All" : `F${f}`}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Operational Live Timeline & Simulation Runner */}
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Live Simulation Trigger Bar */}
            <div className="lg:col-span-2">
              <SimulationModal
                isRunning={isSimulating}
                stepData={simStep}
                onTriggerSimulation={triggerLiveSimulation}
              />
            </div>

            {/* Live Activity Stream */}
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Activity Stream
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Real-time</span>
              </div>
              <div className="space-y-1.5 max-h-24 overflow-y-auto font-mono text-[11px] text-slate-400">
                {activityStream.map((act, i) => (
                  <div key={i} className="truncate hover:text-white transition">
                    &gt; {act}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Right Operations Side Panel: Alerts & Selected Bed Inspector */}
        <aside className="w-80 bg-slate-950/90 backdrop-blur-md border-l border-slate-800 p-4 hidden xl:flex flex-col gap-4 overflow-y-auto">
          {/* Selected Bed Inspector */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Selected Bed Inspector
            </h3>
            {store.selectedBed ? (
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-base font-black text-white">{store.selectedBed.code}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-sky-400">
                    Floor {store.selectedBed.floor}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {store.selectedBed.department?.name || "General"} • {store.selectedBed.type}
                </p>
                <div className="text-xs">
                  <span className="text-slate-400">Status: </span>
                  <span className="font-bold text-emerald-400">{store.selectedBed.status}</span>
                </div>
                <button
                  onClick={() => store.setSelectedBed(store.selectedBed)}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition"
                >
                  Manage Bed Actions
                </button>
              </div>
            ) : (
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/80 text-center text-slate-500 text-xs">
                Click any 3D bed in the hospital to inspect or allocate.
              </div>
            )}
          </div>

          {/* Live Alerts Stream */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Live Operational Alerts</span>
              <span className="text-[10px] text-sky-400 font-mono">LIVE</span>
            </h3>
            <div className="flex-1 space-y-2 max-h-96 overflow-y-auto pr-1">
              {liveAlerts.slice(0, 8).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                    alert.type === "EMERGENCY"
                      ? "bg-red-950/30 border-red-800/40 text-red-300"
                      : "bg-slate-900/70 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="font-semibold flex items-center gap-1.5">
                    {alert.type === "EMERGENCY" && <Flame className="w-3.5 h-3.5 text-red-500" />}
                    {alert.title}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Bed Details Modal Popup */}
      <BedDetailsModal
        bed={store.selectedBed}
        patients={patients}
        onClose={() => store.setSelectedBed(null)}
        onUpdateStatus={handleUpdateStatus}
        onAllocateBed={handleAllocateBed}
        onReleaseBed={handleReleaseBed}
      />
    </div>
  );
}