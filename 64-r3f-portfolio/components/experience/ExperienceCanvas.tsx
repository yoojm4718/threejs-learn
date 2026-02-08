"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Leva } from "leva";

export default function ExperienceCanvas() {
  return (
    <>
      <Leva collapsed />
      <Canvas
        className="touch-none"
        camera={{
          fov: 45,
          near: 0.1,
          far: 2000,
          position: [-3, 1.5, 4],
        }}
      >
        <Experience />
      </Canvas>
    </>
  );
}
