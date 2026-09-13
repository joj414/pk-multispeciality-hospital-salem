"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Layers,
  Users,
  Calendar,
  BedDouble,
  BarChart3,
  Search,
  Bell,
  Sun,
  Moon,
  UserCheck,
  Flame,
  Compass,
  MapPin
} from "lucide-react";
import { apiSearchGlobal, apiGetNotifications } from "../../lib/api";
import { NotificationItem } from "../../types";

interface NavbarProps {
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
  emergencyActive?: boolean;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme = "dark",
  onToggleTheme,
  emergencyActive = false,
  activeTab,
  onSelectTab
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // User
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("smartcare_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {}
    }

    apiGetNotifications().then(setNotifications).catch(() => {});
  }, []);

  // Live search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await apiSearchGlobal(searchQuery);
        setSearchResults(res);
        setShowSearchDropdown(true);
      } catch (e) {
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navLinks = [
    { id: "overview", label: "Overview", icon: Compass },
    { id: "command", label: "3D Command Center", icon: Layers },
    { id: "queue", label: "Priority Queue", icon: Activity },
    { id: "beds", label: "Bed Allocation", icon: BedDouble },
    { id: "patients", label: "Patients", icon: Users },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "contact", label: "Location & Contact", icon: MapPin }
  ];

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectTab) {
      onSelectTab(id);
    } else {
      router.push(`/?tab=${id}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={(e) => handleNavClick("overview", e)}
          className="flex items-center gap-3 group cursor-pointer"
        >
          {/* PK Hospital Logo — Hexagonal medical badge */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 group-hover:scale-105 transition">
              <defs>
                <linearGradient id="pkGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              {/* Hexagon shape */}
              <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="url(#pkGrad)" opacity="0.15" />
              <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="none" stroke="#0ea5e9" strokeWidth="1.5" />
              {/* Medical Cross */}
              <rect x="17.5" y="11" width="5" height="18" rx="1.5" fill="#22d3ee" opacity="0.4" />
              <rect x="11" y="17.5" width="18" height="5" rx="1.5" fill="#22d3ee" opacity="0.4" />
              {/* PK Text */}
              <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="11" fill="white" letterSpacing="-0.5">PK</text>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-cyan-400 transition leading-tight">
                PK <span className="text-cyan-400">MULTISPECIALITY</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono font-bold uppercase tracking-wider">
                Salem
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">No. 45, Sarada College Road, Salem — 636 016</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab ? activeTab === item.id : false;
            return (
              <button
                key={item.id}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
                  isActive
                    ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Operations Hub (Search, Emergency Strobe, Notifications, Theme, Auth) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency Alert Indicator */}
          {emergencyActive && (
            <div className="px-2.5 py-1 rounded-xl bg-red-600/20 border border-red-500/50 text-red-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span className="hidden sm:inline">TRAUMA ACTIVE</span>
            </div>
          )}

          {/* Global Search Bar */}
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search patient, bed, doctor..."
                className="w-36 sm:w-48 bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:w-56 transition-all"
              />
            </div>

            {/* Search Dropdown Modal */}
            {showSearchDropdown && searchResults && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs text-slate-300 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="font-semibold text-slate-400">Search Results</span>
                  <button
                    onClick={() => setShowSearchDropdown(false)}
                    className="text-slate-500 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                {/* Patients */}
                {searchResults.patients?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-sky-400 uppercase">Patients</span>
                    <div className="mt-1 space-y-1">
                      {searchResults.patients.map((p: any) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            if (onSelectTab) onSelectTab("patients");
                            else router.push("/?tab=patients");
                            setShowSearchDropdown(false);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer flex justify-between"
                        >
                          <span className="font-medium text-white">{p.name} ({p.id})</span>
                          <span className="text-slate-400">{p.bloodGroup}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Beds */}
                {searchResults.beds?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Beds</span>
                    <div className="mt-1 space-y-1">
                      {searchResults.beds.map((b: any) => (
                        <div
                          key={b.id}
                          onClick={() => {
                            if (onSelectTab) onSelectTab("beds");
                            else router.push("/?tab=beds");
                            setShowSearchDropdown(false);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer flex justify-between"
                        >
                          <span className="font-medium text-white">{b.code} ({b.room})</span>
                          <span className="text-slate-400">{b.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Doctors */}
                {searchResults.doctors?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Doctors</span>
                    <div className="mt-1 space-y-1">
                      {searchResults.doctors.map((d: any) => (
                        <div
                          key={d.id}
                          onClick={() => {
                            if (onSelectTab) onSelectTab("appointments");
                            else router.push("/?tab=appointments");
                            setShowSearchDropdown(false);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer flex justify-between"
                        >
                          <span className="font-medium text-white">{d.name}</span>
                          <span className="text-slate-400">{d.specialty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition relative"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h4 className="font-bold text-white">Live Hospital Notifications</h4>
                  <span className="text-[10px] text-slate-500 font-mono">Socket.IO</span>
                </div>
                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sky-400">{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          )}

          {/* Role Portal / Login Button */}
          <button
            onClick={(e) => handleNavClick("login", e)}
            className={`px-3 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "login"
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{user ? user.name.split(" ")[0] : "Demo Roles"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};