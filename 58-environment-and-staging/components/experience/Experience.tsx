import { useFrame, useThree } from "@react-three/fiber";
import {
  AccumulativeShadows,
  BakeShadows,
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  RandomizedLight,
  Sky,
  SoftShadows,
  Stage,
  useHelper,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useControls } from "leva";

export default function Experience() {
  const directionalLight = useRef<THREE.Light>(null!);
  const cube = useRef<THREE.Mesh>(null!);
  // const scene = useThree((state) => state.scene);

  useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

  useFrame((state, delta) => {
    const { elapsedTime } = state.clock;
    cube.current.position.x = 2 + Math.sin(elapsedTime);
    cube.current.rotation.y += delta * 0.2;
  });

  const contactShadowsControls = useControls("ContactShadows", {
    color: "#000000",
    opacity: {
      value: 0.4,
      step: 0.001,
      min: 0,
      max: 1,
    },
    blur: {
      value: 2.8,
      min: 0,
      max: 10,
    },
  });

  const { sunPositionSpherical } = useControls("Sky", {
    sunPositionSpherical: {
      value: { phi: 0.4, theta: 0.4 },
      phi: {
        min: -1,
        max: 1,
        step: 0.1,
      },
      theta: {
        min: -1,
        max: 1,
        step: 0.1,
      },
    },
  });

  const sunPosition = useMemo<[number, number, number]>(
    () =>
      new THREE.Vector3()
        .setFromSphericalCoords(
          1,
          sunPositionSpherical.phi * Math.PI,
          sunPositionSpherical.theta * Math.PI,
        )
        .toArray(),
    [sunPositionSpherical],
  );

  const { environmentIntensity, envMapHeight, envMapRadius, envMapScale } =
    useControls("Envirionment Map", {
      environmentIntensity: {
        value: 3.5,
        min: 0,
        max: 12,
      },
      envMapHeight: { value: 7, min: 0, max: 100 },
      envMapRadius: { value: 20, min: 10, max: 1000 },
      envMapScale: { value: 100, min: 10, max: 1000 },
    });

  // useEffect(() => {
  //   scene.environmentIntensity = environmentIntensity;
  // }, [scene, environmentIntensity]);

  return (
    <>
      {/* <Environment
        preset="sunset"
        ground={{
          height: envMapHeight,
          radius: envMapRadius,
          scale: envMapScale,
        }}
        // resolution={32}
      > */}
      {/* <color args={["black"]} attach="background" />
        <mesh position-z={-5} scale={10}>
          <planeGeometry />
          <meshBasicMaterial color={[10, 0, 0]} />
        </mesh>
        <Lightformer
          position-z={-5}
          scale={10}
          color="red"
          intensity={10}
          form="ring"
        /> */}
      {/* </Environment> */}

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/* <BakeShadows /> */}
      {/* <SoftShadows size={25} samples={10} focus={0} /> */}
      {/* <AccumulativeShadows
        position={[0, -0.99, 0]}
        scale={10}
        color="#316d39"
        opacity={0.8}
        frames={Infinity}
        temporal
        blend={200}
      >
        <RandomizedLight
          amount={8}
          radius={1}
          ambient={0.5}
          intensity={3}
          position={[1, 2, 3]}
          bias={0.001}
        />
      </AccumulativeShadows> */}
      {/* <ContactShadows
        position={[0, 0, 0]}
        resolution={512}
        far={5}
        // frames={1}
        {...contactShadowsControls}
      /> */}

      {/* <directionalLight
        ref={directionalLight}
        castShadow
        position={sunPosition}
        intensity={4.5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      />
      <ambientLight intensity={1.5} /> */}

      {/* <Sky sunPosition={sunPosition} /> */}

      <Stage
        shadows={{
          type: "contact", // default is accumulative
          opacity: 0.2,
          blur: 3,
        }}
        environment="sunset" // preset of environment
        preset="portrait" // preset of stage's lights
        intensity={environmentIntensity}
      >
        <mesh castShadow position-y={1} position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        <mesh castShadow ref={cube} position-y={1} position-x={2} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </Stage>

      {/* <mesh position-y={0} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh> */}
    </>
  );
}
