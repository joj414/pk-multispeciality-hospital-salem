"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HospitalFloorsProps {
  activeFloor: number | "ALL";
}

export const HospitalFloors: React.FC<HospitalFloorsProps> = ({ activeFloor }) => {
  const floor2Group = useRef<THREE.Group>(null);
  const floor3Group = useRef<THREE.Group>(null);
  const roofGroup = useRef<THREE.Group>(null);

  // Smooth architectural explosion / isolation animation
  useFrame((_, delta) => {
    // If Floor 1 isolated: Floor 2 and Floor 3 lift up or hide
    // If Floor 2 isolated: Floor 3 lifts up
    let targetF2Y = 0;
    let targetF3Y = 0;
    let targetRoofY = 0;

    if (activeFloor === 1) {
      targetF2Y = 18; // explode upwards
      targetF3Y = 32;
      targetRoofY = 40;
    } else if (activeFloor === 2) {
      targetF2Y = 0;
      targetF3Y = 22;
      targetRoofY = 30;
    } else if (activeFloor === 3) {
      targetF2Y = 0;
      targetF3Y = 0;
      targetRoofY = 20;
    } else {
      // "ALL"
      targetF2Y = 0;
      targetF3Y = 0;
      targetRoofY = 0;
    }

    if (floor2Group.current) {
      floor2Group.current.position.y = THREE.MathUtils.damp(floor2Group.current.position.y, targetF2Y, 4, delta);
    }
    if (floor3Group.current) {
      floor3Group.current.position.y = THREE.MathUtils.damp(floor3Group.current.position.y, targetF3Y, 4, delta);
    }
    if (roofGroup.current) {
      roofGroup.current.position.y = THREE.MathUtils.damp(roofGroup.current.position.y, targetRoofY, 4, delta);
    }
  });

  return (
    <group>
      {/* ========================================================================= */}
      {/* FLOOR 1: Emergency, Reception, Triage, Diagnostics (Base Y: 0)            */}
      {/* ========================================================================= */}
      <group position={[0, 0, 0]}>
        {/* Floor 1 Concrete Slab */}
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[42, 0.4, 30]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.2} />
        </mesh>

        {/* Floor 1 Floor Grid Markings */}
        <gridHelper args={[40, 20, "#38bdf8", "#334155"]} position={[0, 0.02, 0]} />

        {/* Outer Perimeter Foundation Curb */}
        <mesh position={[0, 0.1, 14.8]}>
          <boxGeometry args={[42, 0.2, 0.4]} />
          <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.2} />
        </mesh>

        {/* Emergency Bay Partition (West Wing) */}
        <mesh position={[-7, 1.5, -2]}>
          <boxGeometry args={[0.2, 3, 14]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={0.8} roughness={0.3} />
        </mesh>

        {/* Reception Counter (Center Front) */}
        <mesh position={[0, 0.7, 5]} castShadow>
          <boxGeometry args={[6, 1.4, 1.2]} />
          <meshStandardMaterial color="#0284c7" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Diagnostics Imaging Bay Partition (East Wing) */}
        <mesh position={[6, 1.5, -2]}>
          <boxGeometry args={[0.2, 3, 14]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.2} roughness={0.1} />
        </mesh>

        {/* Ambulance Bay Ramp & Marking outside Emergency */}
        <mesh position={[-16, 0.03, -8]}>
          <planeGeometry args={[8, 8]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* FLOOR 2: ICU, General Ward, Cardiology (Base Y: 8)                        */}
      {/* ========================================================================= */}
      <group ref={floor2Group}>
        {/* Floor 2 Slab */}
        <mesh position={[0, 7.8, 0]} receiveShadow>
          <boxGeometry args={[42, 0.4, 30]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.2} />
        </mesh>
        <gridHelper args={[40, 20, "#10b981", "#334155"]} position={[0, 8.02, 0]} />

        {/* Central Nursing Station Station Desk */}
        <mesh position={[0, 8.7, 0]} castShadow>
          <cylinderGeometry args={[2.5, 2.5, 1.4, 16]} />
          <meshStandardMaterial color="#0f766e" metalness={0.4} roughness={0.4} />
        </mesh>

        {/* ICU Glass Soundproof Partitions */}
        <mesh position={[-7, 9.5, -2]}>
          <boxGeometry args={[0.15, 3, 14]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.25} roughness={0.1} />
        </mesh>

        {/* General Ward Dividers */}
        <mesh position={[6, 9.5, -2]}>
          <boxGeometry args={[0.2, 3, 14]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={0.7} roughness={0.5} />
        </mesh>

        {/* Support Columns between Floor 1 and Floor 2 */}
        {[
          [-18, 4, -12], [-18, 4, 12],
          [18, 4, -12], [18, 4, 12],
          [-6, 4, -12], [-6, 4, 12],
          [6, 4, -12], [6, 4, 12]
        ].map(([x, y, z], i) => (
          <mesh key={`col-f1-${i}`} position={[x, y, z]}>
            <cylinderGeometry args={[0.3, 0.3, 8, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* FLOOR 3: Pediatrics, Neurology, Orthopedics (Base Y: 16)                  */}
      {/* ========================================================================= */}
      <group ref={floor3Group}>
        {/* Floor 3 Slab */}
        <mesh position={[0, 15.8, 0]} receiveShadow>
          <boxGeometry args={[42, 0.4, 30]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.2} />
        </mesh>
        <gridHelper args={[40, 20, "#ec4899", "#334155"]} position={[0, 16.02, 0]} />

        {/* Pediatrics Playful Wall Accents */}
        <mesh position={[-6, 17.5, -2]}>
          <boxGeometry args={[0.2, 3, 12]} />
          <meshStandardMaterial color="#ec4899" transparent opacity={0.4} roughness={0.4} />
        </mesh>

        {/* Neurology Isolation Chamber */}
        <mesh position={[6, 17.5, -2]}>
          <boxGeometry args={[0.2, 3, 12]} />
          <meshStandardMaterial color="#8b5cf6" transparent opacity={0.3} roughness={0.3} />
        </mesh>

        {/* Support Columns between Floor 2 and Floor 3 */}
        {[
          [-18, 12, -12], [-18, 12, 12],
          [18, 12, -12], [18, 12, 12],
          [-6, 12, -12], [-6, 12, 12],
          [6, 12, -12], [6, 12, 12]
        ].map(([x, y, z], i) => (
          <mesh key={`col-f2-${i}`} position={[x, y, z]}>
            <cylinderGeometry args={[0.3, 0.3, 8, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* ROOF & HELIPAD (Base Y: 24)                                              */}
      {/* ========================================================================= */}
      <group ref={roofGroup}>
        {/* Roof Slab */}
        <mesh position={[0, 23.8, 0]}>
          <boxGeometry args={[42, 0.4, 30]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Helipad Circle for Emergency Air Medical Evacuation */}
        <mesh position={[-10, 24.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[5, 32]} />
          <meshStandardMaterial color="#ef4444" roughness={0.5} />
        </mesh>
        <mesh position={[-10, 24.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.4, 4.8, 32]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>

        {/* Roof Perimeter Glass Balustrade */}
        <mesh position={[0, 24.5, 14.8]}>
          <boxGeometry args={[42, 1, 0.1]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Central Glass Elevator Shaft (Full Height Core) */}
      <mesh position={[0, 12, 12]}>
        <boxGeometry args={[4, 24, 4]} />
        <meshStandardMaterial color="#0284c7" transparent opacity={0.15} roughness={0.1} />
      </mesh>
    </group>
  );
};