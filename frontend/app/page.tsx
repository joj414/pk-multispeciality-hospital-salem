"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Car
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
            Next-Generation Healthcare &amp; Digital Hospital Management
          </div>

          {/* PK Hospital Logo Mark */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="relative w-20 h-20">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-spin" style={{ animationDuration: "8s" }} />
              {/* Inner hexagon-style badge */}
              <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-cyan-500/30">
                <span className="text-2xl font-black text-white tracking-tight">PK</span>
              </div>
              {/* Medical cross overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3 h-0.5 bg-white/20 absolute" />
                <div className="w-0.5 h-3 bg-white/20 absolute" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1]">
            PK <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400">MULTISPECIALITY</span>
          </h1>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-300 tracking-widest uppercase">
            Hospital <span className="text-cyan-400">Salem</span>
          </h2>

          <p className="text-xl sm:text-2xl font-medium text-slate-300 tracking-wide">
            "Excellence in Patient Care. Advanced Diagnostics. Compassionate Healing."
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A premier multi-specialty hospital in Salem, Tamil Nadu — combining cutting-edge medical technology with priority-aware patient flow, intelligent resource allocation, and real-time 3D hospital visualization.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-bold rounded-2xl shadow-xl shadow-sky-500/25 flex items-center gap-2.5 transition hover:scale-105 active:scale-95 text-sm"
            >
              <span>HOSPITAL COMMAND CENTER</span>
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
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Hospital Management System</span>
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

      {/* Specialities Section */}
      <section className="py-16 px-4 bg-slate-950/60 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Our Departments</span>
            <h2 className="text-3xl font-black mt-2">Medical Specialities</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
              <div key={dept.name} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition text-center group">
                <div className="text-3xl mb-2">{dept.icon}</div>
                <p className="text-xs font-semibold text-slate-300 group-hover:text-cyan-400 transition">{dept.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section className="py-20 px-4 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Find Us</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">Contact &amp; Location</h2>
            <p className="text-sm text-slate-400 mt-2">We are conveniently located in the heart of Salem city</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Address & Contact Card */}
            <div className="space-y-6">
              {/* Hospital Address */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Hospital Address</h3>
                    <p className="text-xs text-slate-400">Main Campus</p>
                  </div>
                </div>
                <div className="text-sm text-slate-300 leading-relaxed pl-13">
                  <p className="font-bold text-white text-base">PK Multispeciality Hospital Salem</p>
                  <p className="mt-1">No. 45, Sarada College Road,</p>
                  <p>Near New Bus Stand,</p>
                  <p>Salem — 636 016,</p>
                  <p>Tamil Nadu, India.</p>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="font-bold text-white">Contact Numbers</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "🚨 Emergency (24/7)", number: "+91 427 400 1000", color: "text-red-400" },
                    { label: "📋 OPD Appointments", number: "+91 427 400 1001", color: "text-sky-400" },
                    { label: "🏥 General Enquiry", number: "+91 427 400 1002", color: "text-slate-300" },
                    { label: "🚑 Ambulance", number: "+91 98765 43210", color: "text-amber-400" }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 text-xs">{item.label}</span>
                      <a href={`tel:${item.number.replace(/\s/g, "")}`} className={`font-bold ${item.color} hover:underline`}>
                        {item.number}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timings */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white">Hospital Timings</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">OPD (Mon – Sat)</span><span className="text-white font-semibold">8:00 AM – 8:00 PM</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">OPD (Sunday)</span><span className="text-white font-semibold">9:00 AM – 1:00 PM</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Emergency Department</span><span className="text-emerald-400 font-bold">24 × 7</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">ICU / Critical Care</span><span className="text-emerald-400 font-bold">24 × 7</span></div>
                </div>
              </div>
            </div>

            {/* How to Reach */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="font-bold text-white text-lg">How to Reach Us</h3>
                </div>

                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center flex-shrink-0">
                      <Train className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">By Train</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Salem Junction Railway Station is <span className="text-white">3.5 km</span> away. Take an auto-rickshaw or cab from the station — approximately 10 minutes.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                      <Bus className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">By Bus</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Salem New Bus Stand is <span className="text-white">0.8 km</span> away — just a 5-minute walk. City buses 4, 7A, and 12 stop directly outside the hospital gates.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <Car className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">By Road / Car</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        From Chennai: Take NH-44 (Chennai – Salem Highway), exit at <span className="text-white">Salem Toll Plaza</span>, follow signs toward Sarada College Road. Free parking available on campus.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">Nearby Landmarks</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Opposite to <span className="text-white">Sarada College for Women</span>, adjacent to <span className="text-white">Salem Steel Plant Road</span>. The hospital's blue-and-white tower is visible from the main road.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 h-48 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-sky-950/30 to-slate-900" />
                <div className="relative text-center space-y-2">
                  <MapPin className="w-8 h-8 text-cyan-400 mx-auto" />
                  <p className="font-bold text-white">PK Multispeciality Hospital Salem</p>
                  <p className="text-xs text-slate-400">No. 45, Sarada College Road, Salem — 636 016</p>
                  <a
                    href="https://maps.google.com/?q=Sarada+College+Road+Salem+Tamil+Nadu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition"
                  >
                    <Navigation className="w-3 h-3" />
                    Get Directions on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}