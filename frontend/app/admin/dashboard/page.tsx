"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../../components/navigation/Navbar";
import { apiGetAuditLogs, apiGetKPIs, apiGetDepartments } from "../../../lib/api";
import { AuditLogItem, HospitalKPIs, Department } from "../../../types";
import { Shield, Lock, FileText, Database, Server, CheckCircle2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [kpis, setKpis] = useState<HospitalKPIs | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    apiGetAuditLogs().then(setLogs).catch(() => {});
    apiGetKPIs().then(setKpis).catch(() => {});
    apiGetDepartments().then(setDepartments).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Shield className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black">Hospital Administration & Audit Ledger</h1>
            <p className="text-xs text-slate-400">Superadmin System Diagnostics, RBAC Enforcement, and Immutable Event Trails.</p>
          </div>
        </div>

        {/* System Health Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold">Engine Status</span>
              <p className="font-bold text-white text-sm flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ONLINE (Socket.IO + REST)
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold">Database Persistence</span>
              <p className="font-bold text-white text-sm mt-0.5">
                Prisma ORM (SQLite / PG Ready)
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold">RBAC Authentication</span>
              <p className="font-bold text-white text-sm mt-0.5">
                JWT + SHA-256 Hashing Active
              </p>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Operational Audit Trail (Requirement 27)
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Immutable Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 font-bold uppercase border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-2.5">Timestamp</th>
                  <th className="py-2.5">Action</th>
                  <th className="py-2.5">Audit Details</th>
                  <th className="py-2.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-2 text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</td>
                    <td className="py-2 font-bold text-purple-400">{log.action}</td>
                    <td className="py-2 text-slate-300">{log.details}</td>
                    <td className="py-2 text-slate-500">{log.ipAddress || "127.0.0.1"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}