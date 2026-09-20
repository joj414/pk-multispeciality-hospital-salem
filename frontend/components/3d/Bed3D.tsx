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

  // Gentle pulse animation for the status beacon
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (beaconRef.current) {
      const scale = 1 + Math.sin(t * 3.5) * 0.15;
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
      scale={hovered || isSelected ? [1.2, 1.2, 1.2] : [1, 1, 1]}
    >
      {/* 1. Floor Status Glow Disk (Ground projection) */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.3, 16]} />
        <meshBasicMaterial color={statusColor.hex} transparent opacity={isSelected ? 0.6 : 0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. Bed Base / Frame */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.4, 2.3]} />
        <meshStandardMaterial
          color={isSelected ? "#38bdf8" : "#1e293b"}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* 3. Mattress */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.4, 0.26, 2.2]} />
        <meshStandardMaterial
          color={bed.status === "OCCUPIED" ? "#cbd5e1" : "#ffffff"}
          roughness={0.4}
        />
      </mesh>

      {/* 4. Pillow */}
      <mesh position={[0, 0.73, -0.8]}>
        <boxGeometry args={[1.0, 0.14, 0.5]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
      </mesh>

      {/* 5. Headboard */}
      <mesh position={[0, 0.85, -1.1]}>
        <boxGeometry args={[1.5, 1.0, 0.12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* 6. Footboard */}
      <mesh position={[0, 0.65, 1.1]}>
        <boxGeometry args={[1.5, 0.6, 0.12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* 7. Side Medical Safety Rails */}
      <mesh position={[-0.76, 0.7, 0]}>
        <boxGeometry args={[0.04, 0.28, 1.4]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.76, 0.7, 0]}>
        <boxGeometry args={[0.04, 0.28, 1.4]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 8. IV Drip Pole Stand */}
      <mesh position={[0.85, 1.2, -0.9]}>
        <cylinderGeometry args={[0.02, 0.02, 1.9, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* IV Saline Bag */}
      <mesh position={[0.85, 1.95, -0.9]}>
        <boxGeometry args={[0.15, 0.28, 0.08]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.85} roughness={0.1} />
      </mesh>

      {/* 9. Tall Status Beacon Pole */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>

      {/* 10. Status Beacon LED Light Sphere */}
      <mesh ref={beaconRef} position={[0, 1.75, 0]}>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial
          color={statusColor.hex}
          emissive={statusColor.hex}
          emissiveIntensity={isSelected || isHighlighted ? 4.0 : 2.5}
          roughness={0.1}
        />
      </mesh>

      {/* 11. Point Light for radiant glow */}
      <pointLight color={statusColor.hex} intensity={isSelected ? 4 : 1.5} distance={3} />

      {/* 12. Active Selection Ring */}
      {(isSelected || isHighlighted) && (
        <mesh ref={haloRef} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.65, 32]} />
          <meshBasicMaterial
            color={isHighlighted ? "#ef4444" : "#38bdf8"}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}

      {/* 13. 3D Floating Tooltip Badge on Hover or Selection */}
      {(hovered || isSelected) && (
        <Html position={[0, 2.2, 0]} center distanceFactor={14} style={{ pointerEvents: "none" }}>
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl shadow-2xl border border-slate-700 text-xs whitespace-nowrap flex flex-col items-center gap-0.5 transform -translate-y-2 transition-all">
            <div className="font-bold tracking-wide flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColor.hex }} />
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