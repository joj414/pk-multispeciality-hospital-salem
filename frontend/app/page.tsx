"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "../components/navigation/Navbar";
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  BedDouble,
  HeartHandshake,
  Layers,
  Sparkles,
  Clock,
  Compass,
  CheckCircle2
} from "lucide-react";
import { apiGetBeds, apiGetKPIs } from "../lib/api";
import { Bed, HospitalKPIs } from "../types";

// Dynamically load 3D Canvas on client only to prevent SSR canvas errors
const HospitalCanvas = dynamic(
  () => import("../components/3d/HospitalCanvas").then((mod) => mod.HospitalCanvas),
  { ssr: false }
);

export default function LandingPage() {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [kpis, setKpis] = useState<HospitalKPIs | null>(null);

  useEffect(() => {
    apiGetBeds().then(setBeds).catch(() => {});
    apiGetKPIs().then(setKpis).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white overflow-hidden">
      <Navbar />

      {/* Hero Section with Interactive 3D Digital Hospital */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-4 pt-8 pb-16">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Title and Tagline */}
        <div className="max-w-4xl mx-auto text-center z-10 space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            Next-Generation Healthcare Flow & Digital Twin
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1]">
            SMARTCARE <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400">FLOW</span>
          </h1>

          <p className="text-xl sm:text-2xl font-medium text-slate-300 tracking-wide">
            "Intelligent Hospital Operations. Faster Decisions. Better Patient Flow."
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A real-time digital hospital platform combining priority-aware patient flow, intelligent resource allocation, and an interactive 3D hospital visualization.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-bold rounded-2xl shadow-xl shadow-sky-500/25 flex items-center gap-2.5 transition hover:scale-105 active:scale-95 text-sm"
            >
              <span>ENTER COMMAND CENTER</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-2xl backdrop-blur-md shadow-lg flex items-center gap-2.5 transition hover:scale-105 active:scale-95 text-sm"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>EXPLORE 3D HOSPITAL</span>
            </Link>
          </div>
        </div>

        {/* 3D Hospital View Container */}
        <div className="w-full max-w-6xl h-[550px] relative z-10 px-2 sm:px-4">
          <div className="w-full h-full rounded-3xl p-1 bg-gradient-to-b from-slate-700/50 via-slate-800/30 to-slate-900/60 shadow-2xl">
            <HospitalCanvas
              beds={beds}
              selectedBed={null}
              activeFloor="ALL"
              cameraTarget={null}
              emergencyActive={false}
              onSelectBed={() => {}}
              onSelectDepartment={() => {}}
            />
          </div>

          {/* Floating Live KPI Overlays */}
          {kpis && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Patients</span>
                <p className="text-xl font-black text-white">{kpis.totalPatients}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Waiting in Queue</span>
                <p className="text-xl font-black text-amber-400">{kpis.waitingPatients}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Available Beds</span>
                <p className="text-xl font-black text-emerald-400">{kpis.availableBeds} / {kpis.totalBeds}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Bed Occupancy</span>
                <p className="text-xl font-black text-sky-400">{kpis.bedOccupancyRate}%</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Core Innovation: Priority-Aware Hospital Flow Engine */}
      <section className="py-24 px-4 max-w-6xl mx-auto w-full border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Core Breakthrough</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Priority-Aware Hospital Flow Engine
          </h2>
          <p className="text-sm text-slate-400">
            Eliminating bottleneck delays by merging deterministic FIFO queuing with urgent max-heap triage and algorithmic bed placement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">FIFO Routine Scheduling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equitable appointment queuing for routine consultations and specialized outpatient clinics with precise time prediction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-red-500/30 hover:border-red-500/60 transition">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Max-Heap Priority Queue</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly preempts standard queue slots when critical trauma or unstable vitals arrive, guaranteeing zero-delay physician mobilization.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-500/60 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <BedDouble className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Smart Bed Allocation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Spatial and operational matching algorithm allocating ICU, Trauma, and General beds based on proximity, acuity, and sanitization cycles.
            </p>
          </div>
        </div>
      </section>

      {/* SDG 3: GOOD HEALTH AND WELL-BEING SECTION */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <HeartHandshake className="w-4 h-4" />
                UNITED NATIONS SUSTAINABLE DEVELOPMENT GOAL 3
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                SDG 3: Good Health & Well-Being
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                SmartCare Flow directly addresses hospital operational inefficiencies that lead to overcrowding, delayed emergency interventions, and suboptimal patient outcomes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Reduced operational waiting times",
                  "Better hospital resource visibility",
                  "Faster emergency coordination",
                  "Better capacity awareness",
                  "Improved patient flow across wards",
                  "Transparent audit accountability"
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 text-center max-w-xs space-y-3 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-emerald-300">Zero-Waste Operations</h4>
              <p className="text-xs text-slate-400">
                Empowering clinical staff with real-time digital twin insights to make life-critical allocation decisions within seconds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}