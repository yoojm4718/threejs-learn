import { OrbitControls, Stage } from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";

export default function Experience() {
  useControls({ test: 1 });

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <Stage
        shadows={{
          type: "contact",
          opacity: 0.2,
          blur: 3,
        }}
        environment="sunset"
        preset="portrait"
        intensity={3.5}
      >
        <mesh position={[-2, 1, 0]}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        <mesh position={[2, 1, 0]} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </Stage>
    </>
  );
}
