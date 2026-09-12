"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/navigation/Navbar";
import { apiGetPatients, apiCreatePatient, apiGetDepartments } from "../../lib/api";
import { Patient, Department } from "../../types";
import { useSocket } from "../../hooks/useSocket";
import { Users, UserPlus, Search, Flame, CheckCircle, ShieldAlert, Phone } from "lucide-react";

export default function PatientsPage() {
  const { lastEvent } = useSocket();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("35");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("+1-555-0199");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("Metro District 4");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [emergencyContact, setEmergencyContact] = useState("+1-555-0198");
  const [isEmergency, setIsEmergency] = useState(false);
  const [departmentId, setDepartmentId] = useState("");

  const refreshPatients = async () => {
    try {
      const [p, d] = await Promise.all([apiGetPatients({ search }), apiGetDepartments()]);
      setPatients(p);
      setDepartments(d);
      if (d.length > 0 && !departmentId) setDepartmentId(d[0].id);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshPatients();
  }, [search]);

  useEffect(() => {
    if (lastEvent?.event === "patient.registered") {
      refreshPatients();
    }
  }, [lastEvent]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age) return;

    await apiCreatePatient({
      name,
      age: Number(age),
      gender,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      address,
      bloodGroup,
      emergencyContact,
      isEmergency,
      departmentId
    });

    setShowRegisterModal(false);
    setName("");
    setIsEmergency(false);
    refreshPatients();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                <Users className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Patient Registration & Directory
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Synthetic healthcare records with automated unique ID generation (P000001+) and triage tagging.
            </p>
          </div>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-900/30 flex items-center gap-2 transition"
          >
            <UserPlus className="w-4 h-4" />
            Register New Patient
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name, ID, or phone..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Patients Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Patient ID</th>
                  <th className="p-3.5">Full Name</th>
                  <th className="p-3.5">Age/Gender</th>
                  <th className="p-3.5">Blood</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Triage Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-mono font-bold text-sky-400">{p.id}</td>
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      {p.name}
                      {p.isEmergency && (
                        <span className="p-1 rounded-full bg-red-500/20 text-red-500">
                          <Flame className="w-3 h-3" />
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-300">{p.age} yrs • {p.gender}</td>
                    <td className="p-3.5 font-mono text-amber-400">{p.bloodGroup}</td>
                    <td className="p-3.5 text-slate-300">{p.department?.name || "General"}</td>
                    <td className="p-3.5 text-slate-400 font-mono">{p.phone}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === "ADMITTED"
                          ? "bg-purple-500/20 text-purple-400"
                          : p.status === "IN_QUEUE"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleRegister} className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">Register Patient</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Eleanor Vance"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Department</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isEmergReg"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="rounded text-red-500 bg-slate-950 border-slate-700"
              />
              <label htmlFor="isEmergReg" className="text-xs text-red-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Mark as Critical Emergency Trauma Case
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold"
              >
                Save & Register
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}