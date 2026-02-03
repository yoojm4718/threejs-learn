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
        shadows={false}
        camera={{ fov: 45, near: 0.1, far: 200, position: [3, 2, 6] }}
      >
        <color args={["ivory"]} attach="background" />

        <Experience />
      </Canvas>
    </>
  );
}
