import {
  shaderMaterial,
  Center,
  OrbitControls,
  Sparkles,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import portalVertexShaders from "@/shaders/portal/vertex.glsl";
import portalFragmentShaders from "@/shaders/portal/fragment.glsl";
import * as THREE from "three";
import {
  extend,
  ThreeElement,
  ThreeElements,
  useFrame,
} from "@react-three/fiber";
import { useRef } from "react";

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#ffffff"),
    uColorEnd: new THREE.Color("#000000"),
  },
  portalVertexShaders,
  portalFragmentShaders,
);

extend({ PortalMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    portalMaterial: ThreeElement<typeof PortalMaterial>;
  }
}

export default function Experience() {
  const { nodes } = useGLTF("./models/portal.glb");
  const bakedTexture = useTexture("./models/baked.jpg");

  const portalMaterial = useRef<ThreeElements["portalMaterial"]>(null!);

  useFrame((state) => {
    portalMaterial.current.uTime = state.clock.elapsedTime;
  });

  return (
    <>
      <color args={["#030202"]} attach="background" />

      <OrbitControls makeDefault />

      <Center>
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={bakedTexture} map-flipY={false} />
        </mesh>

        <mesh
          geometry={nodes.poleLightA.geometry}
          position={nodes.poleLightA.position}
          rotation={nodes.poleLightA.rotation}
          scale={nodes.poleLightA.scale}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>

        <mesh
          geometry={nodes.poleLightB.geometry}
          position={nodes.poleLightB.position}
          rotation={nodes.poleLightB.rotation}
          scale={nodes.poleLightB.scale}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>

        <mesh
          geometry={nodes.portalLight.geometry}
          position={nodes.portalLight.position}
          rotation={nodes.portalLight.rotation}
          scale={nodes.portalLight.scale}
        >
          <portalMaterial ref={portalMaterial} />
        </mesh>

        <Sparkles
          size={6}
          scale={[4, 2, 4]}
          position-y={1}
          speed={0.2}
          count={40}
        />
      </Center>
    </>
  );
}
