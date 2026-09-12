import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BedStatus } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBedStatusColor(status: BedStatus | string) {
  switch (status) {
    case "AVAILABLE":
      return {
        hex: "#10B981", // soft emerald green
        bgClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
        badgeClass: "bg-emerald-500 text-white",
        glowColor: "#34d399",
        label: "Available"
      };
    case "OCCUPIED":
      return {
        hex: "#EF4444", // crimson red
        bgClass: "bg-red-500/20 text-red-400 border-red-500/40",
        badgeClass: "bg-red-500 text-white",
        glowColor: "#f87171",
        label: "Occupied"
      };
    case "RESERVED":
      return {
        hex: "#F59E0B", // amber/yellow
        bgClass: "bg-amber-500/20 text-amber-400 border-amber-500/40",
        badgeClass: "bg-amber-500 text-white",
        glowColor: "#fbbf24",
        label: "Reserved"
      };
    case "CLEANING":
      return {
        hex: "#0EA5E9", // sky blue
        bgClass: "bg-sky-500/20 text-sky-400 border-sky-500/40",
        badgeClass: "bg-sky-500 text-white",
        glowColor: "#38bdf8",
        label: "Cleaning"
      };
    case "MAINTENANCE":
    default:
      return {
        hex: "#64748B", // slate gray
        bgClass: "bg-slate-500/20 text-slate-400 border-slate-500/40",
        badgeClass: "bg-slate-500 text-white",
        glowColor: "#94a3b8",
        label: "Maintenance"
      };
  }
}

export function getPriorityMeta(score: number) {
  switch (score) {
    case 5:
      return { label: "Level 5 - Resuscitation", color: "bg-red-600 text-white animate-pulse", textClass: "text-red-500" };
    case 4:
      return { label: "Level 4 - Emergent", color: "bg-orange-500 text-white", textClass: "text-orange-500" };
    case 3:
      return { label: "Level 3 - Urgent", color: "bg-amber-500 text-white", textClass: "text-amber-500" };
    case 2:
      return { label: "Level 2 - Less Urgent", color: "bg-blue-500 text-white", textClass: "text-blue-500" };
    case 1:
    default:
      return { label: "Level 1 - Non-Urgent", color: "bg-emerald-600 text-white", textClass: "text-emerald-500" };
  }
}