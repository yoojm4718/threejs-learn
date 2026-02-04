import { Stage } from "@react-three/drei";

export default function Experience() {
  return (
    <>
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
