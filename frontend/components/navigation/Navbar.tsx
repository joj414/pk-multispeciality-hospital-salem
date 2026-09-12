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
  ChevronDown,
  UserCheck,
  Flame,
  Stethoscope
} from "lucide-react";
import { apiSearchGlobal, apiGetNotifications } from "../../lib/api";
import { NotificationItem } from "../../types";

interface NavbarProps {
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
  emergencyActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme = "dark",
  onToggleTheme,
  emergencyActive = false
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
    { href: "/dashboard", label: "3D Command Center", icon: Layers },
    { href: "/queue", label: "Priority Queue", icon: Activity },
    { href: "/beds", label: "Bed Allocation", icon: BedDouble },
    { href: "/patients", label: "Patients", icon: Users },
    { href: "/appointments", label: "Appointments", icon: Calendar },
    { href: "/analytics", label: "Analytics", icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-400 transition">
                SMARTCARE <span className="text-cyan-400">FLOW</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono font-bold uppercase tracking-wider">
                3D TWIN
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Intelligent Hospital Operations</p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
                  isActive
                    ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
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
                className="w-40 sm:w-56 bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:w-64 transition-all"
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
                            router.push(`/patients`);
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
                            router.push(`/beds`);
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
                            router.push(`/appointments`);
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
          <Link
            href="/login"
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{user ? user.name.split(" ")[0] : "Demo Roles"}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};