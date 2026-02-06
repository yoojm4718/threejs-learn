import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { meshBounds, OrbitControls, useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Experience() {
  const canvasDOM = useThree((state) => state.gl.domElement);
  const hamburger = useGLTF("./hamburger.glb");

  const cube = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  const eventHandler = (event: ThreeEvent<MouseEvent>) => {
    const cubeMaterial = cube.current.material;
    if (cubeMaterial instanceof THREE.MeshStandardMaterial)
      cubeMaterial.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`);
  };

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh position-x={-2} onClick={(event) => event.stopPropagation()}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh
        ref={cube}
        raycast={meshBounds}
        position-x={2}
        scale={1.5}
        onClick={eventHandler}
        onPointerEnter={() => (canvasDOM.style.cursor = "pointer")}
        onPointerLeave={() => (canvasDOM.style.cursor = "default")}
      >
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      <primitive
        object={hamburger.scene}
        scale={0.25}
        position-y={0.5}
        onClick={(e) => {
          console.log(e.object.name);
          e.stopPropagation();
        }}
      />
    </>
  );
}
