import {
  Center,
  OrbitControls,
  Text3D,
  useMatcapTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useEffect, useRef } from "react";
// import { useState } from "react";
import * as THREE from "three";
import { element } from "three/tsl";

const torusGeometry = new THREE.TorusGeometry();
const material = new THREE.MeshMatcapMaterial();

export default function Experience() {
  const [matcapTexture] = useMatcapTexture("7B5254_E9DCC7_B19986_C8AC91", 256);

  // const [torusGeometry, setTorusGeometry] = useState<THREE.TorusGeometry>(
  //   null!,
  // );
  // const [material, setMaterial] = useState<THREE.MeshMatcapMaterial>(null!);

  const toruses = useRef<THREE.Mesh[]>([]);
  // const torusGroup = useRef<THREE.Group>(null!);

  useEffect(() => {
    matcapTexture.colorSpace = THREE.SRGBColorSpace;
    matcapTexture.needsUpdate = true;

    material.matcap = matcapTexture;
    material.needsUpdate = true;
  }, []);

  useFrame((state, delta) => {
    toruses.current.forEach((torus) => {
      torus.rotation.y += delta * 0.2;
    });
  });

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />
      {/* <torusGeometry ref={setTorusGeometry} />
      <meshMatcapMaterial ref={setMaterial} matcap={matcapTexture} /> */}

      <Center>
        <Text3D
          font="./fonts/helvetiker_regular.typeface.json"
          material={material}
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          HELLO R3F
        </Text3D>
      </Center>

      {/* <group ref={torusGroup}> */}
      {[...Array(100)].map((_, index) => (
        <mesh
          ref={(element) => element && (toruses.current[index] = element)}
          key={index}
          geometry={torusGeometry}
          material={material}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          scale={0.2 + Math.random() * 0.2}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        />
      ))}
      {/* </group> */}
    </>
  );
}
