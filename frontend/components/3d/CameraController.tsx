"use client";

import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CameraFocusTarget } from "../../hooks/useHospitalStore";

interface CameraControllerProps {
  target: CameraFocusTarget | null;
  controlsRef: React.RefObject<any>;
}

export const CameraController: React.FC<CameraControllerProps> = ({ target, controlsRef }) => {
  const { camera } = useThree();
  const currentTargetPos = useRef(new THREE.Vector3(0, 10, 0));
  const currentCamPos = useRef(new THREE.Vector3(25, 25, 30));

  useEffect(() => {
    if (!target) return;

    // Desired camera destination offset relative to target
    let offset = new THREE.Vector3(8, 6, 8);

    if (target.floor === 1) {
      offset = new THREE.Vector3(7, 5, 7);
    } else if (target.floor === 2) {
      offset = new THREE.Vector3(7, 6, 7);
    } else if (target.floor === 3) {
      offset = new THREE.Vector3(6, 5, 6);
    }

    currentCamPos.current.set(target.x + offset.x, target.y + offset.y, target.z + offset.z);
    currentTargetPos.current.set(target.x, target.y, target.z);
  }, [target]);

  useFrame((_, delta) => {
    if (!target || !controlsRef.current) return;

    // Smoothly interpolate camera position
    camera.position.lerp(currentCamPos.current, 4 * delta);

    // Smoothly interpolate controls target
    controlsRef.current.target.lerp(currentTargetPos.current, 4 * delta);
    controlsRef.current.update();
  });

  return null;
};