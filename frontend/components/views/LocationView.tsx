"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Train,
  Bus,
  Car,
  Activity,
  ShieldCheck,
  Building2,
  Mail
} from "lucide-react";

export const LocationView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-8 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5" />
          Salem Main Campus
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Hospital Location, Contact &amp; How to Reach
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          PK Multispeciality Hospital Salem is located in the central healthcare corridor of Salem, Tamil Nadu, with round-the-clock emergency services and convenient transit connectivity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Address, Phone, Hours */}
        <div className="space-y-6">
          {/* Address Card */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Main Hospital Campus</h3>
                <p className="text-xs text-slate-400">Salem, Tamil Nadu, India</p>
              </div>
            </div>
            <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-1">
              <p className="font-bold text-white text-base">PK Multispeciality Hospital Salem</p>
              <p>No. 45, Sarada College Road,</p>
              <p>Near New Bus Stand,</p>
              <p>Salem — 636 016, Tamil Nadu, India.</p>
              <div className="pt-2 flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                <Mail className="w-3.5 h-3.5" />
                <span>contact@pkhospitalsalem.com</span>
              </div>
            </div>
          </div>

          {/* Contact Hotlines */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Direct Hospital Lines</h3>
                <p className="text-xs text-slate-400">24/7 Priority Assistance</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "🚨 24/7 Emergency & Trauma", number: "+91 427 400 1000", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
                { label: "📋 OPD Appointments Desk", number: "+91 427 400 1001", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/30" },
                { label: "🏥 General Enquiry & Reception", number: "+91 427 400 1002", color: "text-slate-300", bg: "bg-slate-800/40 border-slate-700/40" },
                { label: "🚑 24/7 Mobile ICU Ambulance", number: "+91 98765 43210", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" }
              ].map((item) => (
                <div key={item.label} className={`flex justify-between items-center p-3 rounded-2xl border ${item.bg}`}>
                  <span className="text-slate-300 text-xs font-medium">{item.label}</span>
                  <a href={`tel:${item.number.replace(/\s/g, "")}`} className={`font-bold text-sm ${item.color} hover:underline`}>
                    {item.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Timings */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Operational Hours</h3>
                <p className="text-xs text-slate-400">Outpatient &amp; Inpatient</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"><span className="text-slate-400">OPD Clinics (Mon – Sat)</span><span className="text-white font-bold">8:00 AM – 8:00 PM</span></div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"><span className="text-slate-400">OPD Clinics (Sunday)</span><span className="text-white font-bold">9:00 AM – 1:00 PM</span></div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"><span className="text-slate-400">Emergency &amp; Trauma Dept</span><span className="text-emerald-400 font-bold">24 Hours / 7 Days</span></div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"><span className="text-slate-400">Intensive Care Unit (ICU)</span><span className="text-emerald-400 font-bold">24 Hours / 7 Days</span></div>
            </div>
          </div>
        </div>

        {/* Right Column: Transit & Directions */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-cyan-500/30 shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">How to Reach the Hospital</h3>
                <p className="text-xs text-slate-400">Salem Junction &amp; Highway Connectivity</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center flex-shrink-0">
                  <Train className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">By Train (Salem Junction - SA)</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Salem Junction Railway Station is located <span className="text-white font-semibold">3.5 km</span> from the hospital. 24/7 auto-rickshaws, pre-paid taxis, and Ola/Uber cabs are available outside the main concourse (~10 min drive).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <Bus className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">By Bus (Salem New Bus Stand)</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Salem New Bus Stand is just <span className="text-white font-semibold">0.8 km</span> away (~5 minute walk). City bus routes 4, 7A, 12, and 23 stop directly at the Sarada College Road hospital entrance.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <Car className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">By Road / Car (NH-44)</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Accessible via NH-44 (Chennai – Bangalore – Salem Highway). Take the Salem Central exit, proceed along Sarada College Road. Dedicated multi-level visitor and emergency ambulance parking on-site.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Nearby Landmarks</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Directly opposite <span className="text-white font-semibold">Sarada College for Women</span>, adjacent to <span className="text-white font-semibold">Salem Steel Plant Road</span>. Landmark signage visible from Sarada College Circle.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Directions Card */}
          <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/70 p-6 text-center space-y-3 shadow-xl">
            <MapPin className="w-10 h-10 text-cyan-400 mx-auto" />
            <h4 className="font-bold text-white text-base">Interactive GPS Navigation</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Get real-time turn-by-turn navigation directly to the hospital's Emergency and OPD gates on Google Maps.
            </p>
            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Sarada+College+Road+Salem+Tamil+Nadu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white text-xs font-bold rounded-2xl shadow-lg shadow-sky-500/20 transition hover:scale-105"
              >
                <Navigation className="w-4 h-4" />
                Open Turn-by-Turn Directions in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
