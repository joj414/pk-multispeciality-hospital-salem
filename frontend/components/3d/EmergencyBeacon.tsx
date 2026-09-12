"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface EmergencyBeaconProps {
  active: boolean;
  position?: [number, number, number];
}

export const EmergencyBeacon: React.FC<EmergencyBeaconProps> = ({
  active,
  position = [-14, 2.5, -8]
}) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!active) return;
    const t = clock.getElapsedTime();

    // Pulsing strobe light
    if (lightRef.current) {
      lightRef.current.intensity = 4 + Math.sin(t * 12) * 3;
    }

    // Expanding alarm ring
    if (ringRef.current) {
      const ringScale = 1 + (t * 2) % 3;
      ringRef.current.scale.set(ringScale, ringScale, ringScale);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - (ringScale - 1) / 2.5);
    }

    // Rotating strobe core
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 6;
    }
  });

  if (!active) return null;

  return (
    <group position={position}>
      {/* Dynamic Strobe Point Light */}
      <pointLight ref={lightRef} color="#ef4444" distance={15} intensity={5} />

      {/* Rotating Strobe Head */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.6, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#ff2222" emissiveIntensity={3} />
      </mesh>

      {/* Expanding Emergency Ripple Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <ringGeometry args={[1.5, 1.8, 32]} />
        <meshBasicMaterial color="#ff3333" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};