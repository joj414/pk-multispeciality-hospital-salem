"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "../components/navigation/Navbar";
import {
  Activity,
  ArrowRight,
  Zap,
  BedDouble,
  Layers,
  Clock,
  Compass,
  MapPin,
  Phone,
  Navigation,
  Train,
  Bus,
  Car,
  Users,
  Calendar,
  BarChart3,
  UserCheck,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { apiGetBeds, apiGetKPIs } from "../lib/api";
import { Bed, HospitalKPIs } from "../types";

// Dynamically load view components to optimize bundle
const HospitalCanvas = dynamic(
  () => import("../components/3d/HospitalCanvas").then((mod) => mod.HospitalCanvas),
  { ssr: false }
);
const CommandCenterView = dynamic(
  () => import("../components/views/CommandCenterView").then((mod) => mod.CommandCenterView),
  { ssr: false }
);
const QueueView = dynamic(
  () => import("../components/views/QueueView").then((mod) => mod.QueueView),
  { ssr: false }
);
const BedsView = dynamic(
  () => import("../components/views/BedsView").then((mod) => mod.BedsView),
  { ssr: false }
);
const PatientsView = dynamic(
  () => import("../components/views/PatientsView").then((mod) => mod.PatientsView),
  { ssr: false }
);
const AppointmentsView = dynamic(
  () => import("../components/views/AppointmentsView").then((mod) => mod.AppointmentsView),
  { ssr: false }
);
const AnalyticsView = dynamic(
  () => import("../components/views/AnalyticsView").then((mod) => mod.AnalyticsView),
  { ssr: false }
);
const LocationView = dynamic(
  () => import("../components/views/LocationView").then((mod) => mod.LocationView),
  { ssr: false }
);
const RoleLoginView = dynamic(
  () => import("../components/views/RoleLoginView").then((mod) => mod.RoleLoginView),
  { ssr: false }
);

export default function SingleWebsitePage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [beds, setBeds] = useState<Bed[]>([]);
  const [kpis, setKpis] = useState<HospitalKPIs | null>(null);

  // Sync tab with URL search parameter (?tab=...)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      const url = tabId === "overview" ? "/" : `/?tab=${tabId}`;
      window.history.pushState(null, "", url);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    apiGetBeds().then(setBeds).catch(() => {});
    apiGetKPIs().then(setKpis).catch(() => {});
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: Compass },
    { id: "command", label: "3D Command Center", icon: Layers, badge: "Live" },
    { id: "queue", label: "Priority Queue", icon: Activity, badge: kpis ? `${kpis.waitingPatients}` : undefined },
    { id: "beds", label: "Bed Allocation", icon: BedDouble, badge: kpis ? `${kpis.availableBeds}` : undefined },
    { id: "patients", label: "Patients", icon: Users },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "contact", label: "Salem Location", icon: MapPin },
    { id: "login", label: "Role Portal", icon: UserCheck }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      {/* Global Hospital Navbar */}
      <Navbar activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Universal Single-Website Tab Navigation Bar */}
      <div className="sticky top-16 z-30 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-2 sm:px-4 py-2 overflow-x-auto scrollbar-none shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-start xl:justify-center gap-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  isActive
                    ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? "bg-black/30 text-white" : "bg-sky-500/20 text-sky-400"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View Rendering */}
      <main className="flex-1 w-full">
        {activeTab === "command" && <CommandCenterView onSelectTab={handleSelectTab} />}
        {activeTab === "queue" && <QueueView />}
        {activeTab === "beds" && <BedsView />}
        {activeTab === "patients" && <PatientsView />}
        {activeTab === "appointments" && <AppointmentsView />}
        {activeTab === "analytics" && <AnalyticsView />}
        {activeTab === "contact" && <LocationView />}
        {activeTab === "login" && (
          <RoleLoginView onSuccessLogin={(target) => handleSelectTab(target)} />
        )}

        {/* Default / Overview View */}
        {activeTab === "overview" && (
          <div className="w-full space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center px-4 pt-8 pb-12 overflow-hidden">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
              <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

              <div className="max-w-4xl mx-auto text-center z-10 space-y-4 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  All-In-One Digital Hospital Platform • Salem, Tamil Nadu
                </div>

                {/* PK Hospital Logo Mark */}
                <div className="flex items-center justify-center gap-4 mb-1">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-spin" style={{ animationDuration: "8s" }} />
                    <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-cyan-500/30">
                      <span className="text-2xl font-black text-white tracking-tight">PK</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-3 h-0.5 bg-white/30 absolute" />
                      <div className="w-0.5 h-3 bg-white/30 absolute" />
                    </div>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1]">
                  PK <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400">MULTISPECIALITY</span>
                </h1>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-300 tracking-widest uppercase">
                  Hospital <span className="text-cyan-400">Salem</span>
                </h2>

                <p className="text-lg sm:text-xl font-medium text-slate-300 tracking-wide">
                  "Excellence in Patient Care. Advanced Diagnostics. Compassionate Healing."
                </p>

                <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  A premier multi-specialty hospital in Salem, Tamil Nadu — combining priority-aware patient flow, 80-bed real-time digital twin monitoring, and compassionate care.
                </p>

                {/* Quick Action Launcher Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleSelectTab("command")}
                    className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-bold rounded-2xl shadow-xl shadow-sky-500/25 flex items-center gap-2.5 transition hover:scale-105 active:scale-95 text-xs font-mono uppercase tracking-wider"
                  >
                    <span>OPEN 3D COMMAND CENTER</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSelectTab("queue")}
                    className="px-5 py-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-2xl backdrop-blur-md shadow-lg flex items-center gap-2 transition hover:scale-105 active:scale-95 text-xs"
                  >
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>PRIORITY QUEUE</span>
                  </button>

                  <button
                    onClick={() => handleSelectTab("beds")}
                    className="px-5 py-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-2xl backdrop-blur-md shadow-lg flex items-center gap-2 transition hover:scale-105 active:scale-95 text-xs"
                  >
                    <BedDouble className="w-4 h-4 text-emerald-400" />
                    <span>BED ALLOCATION</span>
                  </button>

                  <button
                    onClick={() => handleSelectTab("contact")}
                    className="px-5 py-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-2xl backdrop-blur-md shadow-lg flex items-center gap-2 transition hover:scale-105 active:scale-95 text-xs"
                  >
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>HOSPITAL LOCATION</span>
                  </button>
                </div>
              </div>

              {/* 3D Hospital Canvas */}
              <div className="w-full max-w-6xl h-[520px] relative z-10 px-2 sm:px-4">
                <div className="w-full h-full rounded-3xl p-1 bg-gradient-to-b from-slate-700/50 via-slate-800/30 to-slate-900/60 shadow-2xl">
                  <HospitalCanvas
                    beds={beds}
                    selectedBed={null}
                    activeFloor="ALL"
                    cameraTarget={null}
                    emergencyActive={false}
                    onSelectBed={() => handleSelectTab("beds")}
                    onSelectDepartment={() => handleSelectTab("command")}
                  />
                </div>

                {/* Floating Live KPI Overlays */}
                {kpis && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div onClick={() => handleSelectTab("patients")} className="cursor-pointer hover:opacity-80 transition">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Total Patients</span>
                      <p className="text-xl font-black text-white">{kpis.totalPatients}</p>
                    </div>
                    <div onClick={() => handleSelectTab("queue")} className="cursor-pointer hover:opacity-80 transition">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Waiting in Queue</span>
                      <p className="text-xl font-black text-amber-400">{kpis.waitingPatients}</p>
                    </div>
                    <div onClick={() => handleSelectTab("beds")} className="cursor-pointer hover:opacity-80 transition">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Available Beds</span>
                      <p className="text-xl font-black text-emerald-400">{kpis.availableBeds} / {kpis.totalBeds}</p>
                    </div>
                    <div onClick={() => handleSelectTab("analytics")} className="cursor-pointer hover:opacity-80 transition">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Bed Occupancy</span>
                      <p className="text-xl font-black text-sky-400">{kpis.bedOccupancyRate}%</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Quick Feature Modules Grid */}
            <section className="py-12 px-4 max-w-7xl mx-auto w-full">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">All Systems Integrated</span>
                <h2 className="text-2xl sm:text-3xl font-black mt-1">Single Website Hospital Suite</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Click any module below to open it instantly without leaving this page</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    id: "command",
                    title: "3D Command Center",
                    desc: "Interactive 3D building model with floor cutaway selectors and emergency simulation.",
                    icon: Layers,
                    color: "text-sky-400",
                    border: "hover:border-sky-500/50",
                    badge: "WebGL Twin"
                  },
                  {
                    id: "queue",
                    title: "Priority Queue",
                    desc: "Max-Heap emergency triage engine with immediate critical preemption and ticket calling.",
                    icon: Activity,
                    color: "text-red-400",
                    border: "hover:border-red-500/50",
                    badge: "Max-Heap"
                  },
                  {
                    id: "beds",
                    title: "Bed Allocation",
                    desc: "Real-time occupancy across 80 beds with ward filtering and instant patient assignment.",
                    icon: BedDouble,
                    color: "text-emerald-400",
                    border: "hover:border-emerald-500/50",
                    badge: "80 Beds"
                  },
                  {
                    id: "patients",
                    title: "Patient Registry",
                    desc: "Patient directory with triage categorization and emergency admission registration.",
                    icon: Users,
                    color: "text-cyan-400",
                    border: "hover:border-cyan-500/50",
                    badge: "Records"
                  },
                  {
                    id: "appointments",
                    title: "Doctor Appointments",
                    desc: "Clinical schedule management across specialized departments and doctors.",
                    icon: Calendar,
                    color: "text-indigo-400",
                    border: "hover:border-indigo-500/50",
                    badge: "Schedule"
                  },
                  {
                    id: "analytics",
                    title: "Operations Analytics",
                    desc: "Department capacity charts, hourly patient inflow, and bed status distribution.",
                    icon: BarChart3,
                    color: "text-purple-400",
                    border: "hover:border-purple-500/50",
                    badge: "KPIs"
                  },
                  {
                    id: "contact",
                    title: "Location & Transit",
                    desc: "Salem address, 24/7 hotlines, train & bus directions, and Google Maps GPS navigation.",
                    icon: MapPin,
                    color: "text-amber-400",
                    border: "hover:border-amber-500/50",
                    badge: "Directions"
                  },
                  {
                    id: "login",
                    title: "Demo Role Portals",
                    desc: "1-Click evaluation personas for Executive, Doctor, Nurse, and Patient roles.",
                    icon: UserCheck,
                    color: "text-pink-400",
                    border: "hover:border-pink-500/50",
                    badge: "1-Click"
                  }
                ].map((card) => {
                  const CardIcon = card.icon;
                  return (
                    <div
                      key={card.id}
                      onClick={() => handleSelectTab(card.id)}
                      className={`p-5 rounded-3xl bg-slate-900/60 border border-slate-800 ${card.border} transition hover:scale-105 cursor-pointer shadow-lg group flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-10 h-10 rounded-2xl bg-slate-800/80 flex items-center justify-center ${card.color}`}>
                            <CardIcon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {card.badge}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-white group-hover:text-cyan-400 transition">{card.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{card.desc}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-cyan-400 font-semibold mt-3">
                        <span>Open Module</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Innovation Highlights */}
            <section className="py-16 px-4 max-w-6xl mx-auto w-full border-t border-slate-800/60">
              <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Hospital Architecture</span>
                <h2 className="text-3xl font-black tracking-tight">Priority-Aware Flow Engine</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Combining deterministic outpatient scheduling with rapid emergency prioritization.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => handleSelectTab("appointments")}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold mb-2">FIFO Routine Scheduling</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Equitable appointment queuing for routine consultations and specialized outpatient clinics with estimated wait time tracking.
                  </p>
                </div>

                <div
                  onClick={() => handleSelectTab("queue")}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-red-500/30 hover:border-red-500/60 transition cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold mb-2">Max-Heap Priority Queue</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Instantly preempts standard queue slots when critical trauma arrives, ensuring immediate physician mobilization.
                  </p>
                </div>

                <div
                  onClick={() => handleSelectTab("beds")}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-500/60 transition cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                    <BedDouble className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold mb-2">Smart Bed Allocation</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Spatial bed placement matching ICU, Trauma, and General wards by acuity, proximity, and sanitization cycles.
                  </p>
                </div>
              </div>
            </section>

            {/* Medical Specialities */}
            <section className="py-12 px-4 bg-slate-950/60 border-t border-slate-800/60">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Clinical Excellence</span>
                  <h2 className="text-2xl sm:text-3xl font-black mt-1">Medical Specialities at Salem</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    { name: "Cardiology", icon: "❤️" },
                    { name: "Neurology", icon: "🧠" },
                    { name: "Orthopedics", icon: "🦴" },
                    { name: "Oncology", icon: "🎗️" },
                    { name: "Pediatrics", icon: "👶" },
                    { name: "Gynecology", icon: "🌸" },
                    { name: "Nephrology", icon: "🫀" },
                    { name: "Emergency & Trauma", icon: "🚨" },
                    { name: "Dermatology", icon: "✨" },
                    { name: "Ophthalmology", icon: "👁️" },
                    { name: "Gastroenterology", icon: "🩺" },
                    { name: "Pulmonology", icon: "🫁" }
                  ].map((dept) => (
                    <div key={dept.name} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                      <div className="text-2xl mb-1.5">{dept.icon}</div>
                      <p className="text-xs font-semibold text-slate-300">{dept.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Embedded Location & Contact */}
            <section className="border-t border-slate-800/60 pt-8">
              <LocationView />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}