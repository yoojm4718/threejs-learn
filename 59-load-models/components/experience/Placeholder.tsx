import { ThreeElements } from "@react-three/fiber";

type MeshProps = ThreeElements["mesh"];

export default function Placeholder(props: MeshProps) {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
      <meshBasicMaterial wireframe color="red" />
    </mesh>
  );
}
