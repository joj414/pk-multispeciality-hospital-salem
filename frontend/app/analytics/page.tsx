"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/navigation/Navbar";
import { apiGetAnalytics } from "../../lib/api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { BarChart3, TrendingUp, BedDouble, Clock, Activity, Zap } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetAnalytics()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((e) => console.error(e));
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
          Loading hospital operations intelligence...
        </div>
      </div>
    );
  }

  const { kpis, departmentUtilization, hourlyFlow, bedStatusDistribution } = data;

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <span className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
            <BarChart3 className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Hospital Operations Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Live metrics across bed capacity, department utilization, waiting times, and throughput.
            </p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Census</span>
            <p className="text-2xl font-black text-white mt-1">{kpis.totalPatients} Patients</p>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12% vs last week
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase">Hospital Occupancy</span>
            <p className="text-2xl font-black text-sky-400 mt-1">{kpis.bedOccupancyRate}%</p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {kpis.occupiedBeds + kpis.reservedBeds} of {kpis.totalBeds} Beds
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase">Triage Emergency</span>
            <p className="text-2xl font-black text-red-500 mt-1">{kpis.emergencyCases} Cases</p>
            <span className="text-[11px] text-red-400 mt-1 block">Avg triage speed: 4.2 mins</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Clinicians</span>
            <p className="text-2xl font-black text-cyan-400 mt-1">{kpis.doctorsAvailable} On Duty</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Across 9 specialty wards</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Department Utilization Rate */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200">
              Department Bed Utilization (%)
            </h3>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentUtilization}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px", fontSize: "12px" }} />
                  <Bar dataKey="utilizationRate" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Hourly Patient Flow & Waiting Time */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200">
              Hourly Traffic & Triage Wait (Mins)
            </h3>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyFlow}>
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line type="monotone" dataKey="emergency" stroke="#ef4444" strokeWidth={2} name="Emergency Cases" />
                  <Line type="monotone" dataKey="routine" stroke="#38bdf8" strokeWidth={2} name="Routine Inflow" />
                  <Line type="monotone" dataKey="triageAvgWait" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" name="Avg Wait (min)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Bed Status Census Distribution */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200">
              Overall Bed Census Distribution (80 Beds)
            </h3>
            <div className="w-full h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bedStatusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    label
                  >
                    {bedStatusDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Breakdown Table */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200">
              Department Capacity Summary
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 font-bold uppercase border-b border-slate-800 pb-2">
                  <tr>
                    <th className="py-2">Ward</th>
                    <th className="py-2">Floor</th>
                    <th className="py-2">Total Beds</th>
                    <th className="py-2">Occupied</th>
                    <th className="py-2">Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {departmentUtilization.map((d: any) => (
                    <tr key={d.code}>
                      <td className="py-2 font-semibold text-white">{d.name}</td>
                      <td className="py-2 text-slate-400">Fl {d.floor}</td>
                      <td className="py-2 font-mono">{d.totalBeds}</td>
                      <td className="py-2 font-mono text-rose-400">{d.occupiedBeds}</td>
                      <td className="py-2 font-mono text-emerald-400 font-bold">{d.availableBeds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}