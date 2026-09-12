"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Bed } from "../../types";
import { getBedStatusColor } from "../../lib/utils";

interface Bed3DProps {
  bed: Bed;
  isSelected: boolean;
  isHighlighted?: boolean;
  onSelect: (bed: Bed) => void;
}

export const Bed3D: React.FC<Bed3DProps> = ({ bed, isSelected, isHighlighted, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const beaconRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  const statusColor = getBedStatusColor(bed.status);

  // Gentle pulse animation for the status beacon & emergency halo
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (beaconRef.current) {
      const scale = 1 + Math.sin(t * 3) * 0.12;
      beaconRef.current.scale.set(scale, scale, scale);
    }
    if (haloRef.current && (isSelected || isHighlighted)) {
      haloRef.current.rotation.z = t * 1.5;
      const hScale = 1.2 + Math.sin(t * 5) * 0.3;
      haloRef.current.scale.set(hScale, hScale, hScale);
    }
  });

  return (
    <group
      position={[bed.positionX, bed.positionY, bed.positionZ]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(bed);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      scale={hovered || isSelected ? [1.1, 1.1, 1.1] : [1, 1, 1]}
    >
      {/* Bed Base / Frame */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.4, 2.2]} />
        <meshStandardMaterial color={isSelected ? "#38bdf8" : "#334155"} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Mattress */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.3, 0.25, 2.1]} />
        <meshStandardMaterial color={bed.status === "OCCUPIED" ? "#cbd5e1" : "#f8fafc"} roughness={0.7} />
      </mesh>

      {/* Pillow */}
      <mesh position={[0, 0.72, -0.75]}>
        <boxGeometry args={[0.9, 0.12, 0.45]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* Headboard */}
      <mesh position={[0, 0.8, -1.05]}>
        <boxGeometry args={[1.4, 0.9, 0.1]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Footboard */}
      <mesh position={[0, 0.6, 1.05]}>
        <boxGeometry args={[1.4, 0.5, 0.1]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Side Medical Rails */}
      <mesh position={[-0.68, 0.65, 0]}>
        <boxGeometry args={[0.04, 0.25, 1.2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.68, 0.65, 0]}>
        <boxGeometry args={[0.04, 0.25, 1.2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* IV Drip Pole Stand */}
      <mesh position={[0.8, 1.2, -0.9]}>
        <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* IV Saline Bag */}
      <mesh position={[0.8, 1.9, -0.9]}>
        <boxGeometry args={[0.15, 0.25, 0.08]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.85} roughness={0.1} />
      </mesh>

      {/* Status Beacon LED Light Sphere */}
      <mesh ref={beaconRef} position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={statusColor.hex}
          emissive={statusColor.hex}
          emissiveIntensity={isSelected || isHighlighted ? 2.5 : 1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Point Light emitted by beacon for realistic local glow */}
      <pointLight color={statusColor.hex} intensity={isSelected ? 3.5 : 0.8} distance={2.5} />

      {/* Selection / Highlight Glowing Halo Ring */}
      {(isSelected || isHighlighted) && (
        <mesh ref={haloRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.5, 32]} />
          <meshBasicMaterial
            color={isHighlighted ? "#ef4444" : "#38bdf8"}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {/* 3D Floating Tooltip on Hover or Selection */}
      {(hovered || isSelected) && (
        <Html position={[0, 1.8, 0]} center distanceFactor={14} style={{ pointerEvents: "none" }}>
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-2.5 py-1.5 rounded-lg shadow-xl border border-slate-700 text-xs whitespace-nowrap flex flex-col items-center gap-0.5 transform -translate-y-2 transition-all">
            <div className="font-bold tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor.hex }} />
              {bed.code}
            </div>
            <div className="text-[10px] text-slate-300">
              {bed.type} • {statusColor.label}
            </div>
            {bed.currentPatient && (
              <div className="text-[10px] text-sky-400 font-medium">
                Pt: {bed.currentPatient.name}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};