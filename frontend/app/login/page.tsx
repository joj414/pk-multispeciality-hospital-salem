"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/navigation/Navbar";
import { apiLogin } from "../../lib/api";
import {
  ShieldCheck,
  Stethoscope,
  Sparkles,
  User,
  Activity,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: "ADMIN",
      name: "Dr. Alexander Wright",
      title: "Superadmin / Chief Executive",
      email: "admin@smartcare.com",
      color: "border-purple-500/40 text-purple-400 bg-purple-500/10",
      redirect: "/admin/dashboard"
    },
    {
      role: "HOSPITAL_ADMIN",
      name: "Eleanor Vance",
      title: "Operations & Bed Director",
      email: "hospital.admin@smartcare.com",
      color: "border-sky-500/40 text-sky-400 bg-sky-500/10",
      redirect: "/dashboard"
    },
    {
      role: "DOCTOR",
      name: "Dr. Marcus Chen",
      title: "Chief of Emergency & Trauma",
      email: "dr.chen@smartcare.com",
      color: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
      redirect: "/doctor/dashboard"
    },
    {
      role: "NURSE",
      name: "Nurse Sarah Jenkins",
      title: "Head Charge Nurse (ICU)",
      email: "nurse.sarah@smartcare.com",
      color: "border-pink-500/40 text-pink-400 bg-pink-500/10",
      redirect: "/nurse/dashboard"
    },
    {
      role: "PATIENT",
      name: "David Miller",
      title: "Registered Inpatient / Queue",
      email: "patient.john@smartcare.com",
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
      redirect: "/patient/dashboard"
    }
  ];

  const handleQuickLogin = async (acc: typeof demoAccounts[0]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin(acc.email, "password123");
      localStorage.setItem("smartcare_token", res.token);
      localStorage.setItem("smartcare_user", JSON.stringify(res.user));
      router.push(acc.redirect);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin(email, password);
      localStorage.setItem("smartcare_token", res.token);
      localStorage.setItem("smartcare_user", JSON.stringify(res.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-8 my-auto">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black">Role-Based Hospital Access</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Select a verified demo persona below for instant 1-click evaluation, or sign in with custom credentials.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        {/* 1-Click Role Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoAccounts.map((acc) => (
            <div
              key={acc.email}
              onClick={() => handleQuickLogin(acc)}
              className={`p-5 rounded-2xl border cursor-pointer hover:scale-105 transition shadow-lg ${acc.color} flex flex-col justify-between h-40 group`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/40">
                  {acc.role}
                </span>
                <h3 className="font-bold text-base text-white mt-2 group-hover:text-cyan-400 transition">
                  {acc.name}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">{acc.title}</p>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold pt-2 border-t border-slate-700/40">
                <span className="text-[11px] text-slate-400">{acc.email}</span>
                <span className="flex items-center gap-1 text-white">
                  Enter <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Credentials Form */}
        <div className="max-w-md mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="font-bold text-sm text-center text-slate-300">Or Sign In with Email & Password</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@smartcare.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              Sign In to Command Center
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}