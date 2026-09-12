"use client";

import React, { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Bed } from "../../types";
import { Bed3D } from "./Bed3D";
import { HospitalFloors } from "./HospitalFloors";
import { EmergencyBeacon } from "./EmergencyBeacon";
import { DepartmentLabels } from "./DepartmentLabels";
import { CameraController } from "./CameraController";
import { CameraFocusTarget } from "../../hooks/useHospitalStore";

interface HospitalCanvasProps {
  beds: Bed[];
  selectedBed: Bed | null;
  activeFloor: number | "ALL";
  cameraTarget: CameraFocusTarget | null;
  emergencyActive: boolean;
  theme?: "dark" | "light";
  onSelectBed: (bed: Bed) => void;
  onSelectDepartment: (deptCode: string) => void;
}

export const HospitalCanvas: React.FC<HospitalCanvasProps> = ({
  beds,
  selectedBed,
  activeFloor,
  cameraTarget,
  emergencyActive,
  theme = "dark",
  onSelectBed,
  onSelectDepartment
}) => {
  const controlsRef = useRef<any>(null);

  const isDark = theme === "dark";
  const bgColor = isDark ? "#090d16" : "#f1f5f9";
  const ambientIntensity = isDark ? 0.8 : 1.2;

  return (
    <div className="relative w-full h-full min-h-[450px] overflow-hidden rounded-2xl border border-slate-800/80 shadow-2xl bg-[#090d16]">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%", background: bgColor }}
      >
        <PerspectiveCamera makeDefault position={[28, 26, 32]} fov={45} />

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={6}
          maxDistance={65}
          maxPolarAngle={Math.PI / 2 - 0.05} // prevent going below floor
        />

        <CameraController target={cameraTarget} controlsRef={controlsRef} />

        {/* Ambient & Hospital Lighting */}
        <ambientLight intensity={ambientIntensity} color={isDark ? "#94a3b8" : "#ffffff"} />

        <directionalLight
          position={[25, 40, 20]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={100}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />

        <directionalLight position={[-20, 25, -20]} intensity={0.5} color="#38bdf8" />

        <Suspense fallback={null}>
          {/* Hospital Building Structural Geometry */}
          <HospitalFloors activeFloor={activeFloor} />

          {/* Department HUD Labels in 3D WebGL */}
          <DepartmentLabels
            onSelectDepartment={onSelectDepartment}
            activeFloor={activeFloor}
          />

          {/* Emergency Entrance Beacon & Alarm Strobe */}
          <EmergencyBeacon active={emergencyActive} />

          {/* 3D Hospital Beds */}
          {beds.map((bed) => {
            // If specific floor active, hide beds from other floors
            if (activeFloor !== "ALL" && bed.floor !== activeFloor) {
              return null;
            }

            const isSelected = selectedBed?.id === bed.id;
            const isHighlighted = emergencyActive && (bed.type === "EMERGENCY" || bed.type === "ICU") && bed.status === "AVAILABLE";

            return (
              <Bed3D
                key={bed.id}
                bed={bed}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                onSelect={onSelectBed}
              />
            );
          })}
        </Suspense>
      </Canvas>

      {/* Floating 3D HUD Guide in Top Left */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-semibold text-white">SmartCare 3D Twin</span>
          <span className="text-[10px] text-slate-400">| Left Click: Rotate • Right Click: Pan • Scroll: Zoom</span>
        </div>
      </div>
    </div>
  );
};