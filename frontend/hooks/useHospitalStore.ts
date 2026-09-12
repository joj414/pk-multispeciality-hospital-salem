"use client";

import { useState, useEffect } from "react";
import { Bed } from "../types";

export interface CameraFocusTarget {
  x: number;
  y: number;
  z: number;
  floor?: number;
  label?: string;
}

export function useHospitalStore() {
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [activeFloor, setActiveFloor] = useState<number | "ALL">("ALL");
  const [cameraTarget, setCameraTarget] = useState<CameraFocusTarget | null>(null);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [isDigitalTwinMode, setIsDigitalTwinMode] = useState(true);
  const [viewMode, setViewMode] = useState<"3D" | "2.5D">("3D");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [simulationState, setSimulationState] = useState<any | null>(null);
  const [user, setUser] = useState<{ email: string; name: string; role: string } | null>(null);

  useEffect(() => {
    // Load persisted auth
    const storedUser = localStorage.getItem("smartcare_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    // Default to dark mode for modern high-tech medical operations aesthetic
    const root = document.documentElement;
    root.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    const root = document.documentElement;
    if (nextTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const focusDepartment = (deptCode: string) => {
    switch (deptCode) {
      case "EMERGENCY":
        setActiveFloor(1);
        setCameraTarget({ x: -14, y: 1.5, z: -8, floor: 1, label: "Emergency Trauma Bay" });
        break;
      case "ICU":
        setActiveFloor(2);
        setCameraTarget({ x: -15, y: 9.5, z: -9, floor: 2, label: "Intensive Care Unit (ICU)" });
        break;
      case "GEN":
        setActiveFloor(2);
        setCameraTarget({ x: 4, y: 9.5, z: -4, floor: 2, label: "General Ward" });
        break;
      case "PED":
        setActiveFloor(3);
        setCameraTarget({ x: -12, y: 17.5, z: -6, floor: 3, label: "Pediatrics Ward" });
        break;
      case "CARD":
        setActiveFloor(2);
        setCameraTarget({ x: -5, y: 9.5, z: 9, floor: 2, label: "Cardiology Unit" });
        break;
      default:
        setActiveFloor("ALL");
        setCameraTarget({ x: 0, y: 12, z: 0, label: "Overview" });
        break;
    }
  };

  const focusBed = (bed: Bed) => {
    setSelectedBed(bed);
    setActiveFloor(bed.floor);
    setCameraTarget({
      x: bed.positionX,
      y: bed.positionY + 1.2,
      z: bed.positionZ,
      floor: bed.floor,
      label: `Bed ${bed.code}`
    });
  };

  return {
    selectedBed,
    setSelectedBed,
    activeFloor,
    setActiveFloor,
    cameraTarget,
    setCameraTarget,
    emergencyActive,
    setEmergencyActive,
    isDigitalTwinMode,
    setIsDigitalTwinMode,
    viewMode,
    setViewMode,
    theme,
    toggleTheme,
    simulationState,
    setSimulationState,
    user,
    setUser,
    focusDepartment,
    focusBed
  };
}