import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Fox() {
  const fox = useGLTF("./Fox/glTF/Fox.gltf");
  const foxRef = useRef<THREE.Group>(null!);

  const animations = useAnimations(fox.animations, fox.scene);

  const { animationName } = useControls({
    animationName: {
      options: animations.names,
    },
  });

  useEffect(() => {
    const action = animations.actions[animationName];
    if (action) action.reset().fadeIn(0.5).play();

    return () => {
      if (action) action.fadeOut(0.5);
    };
  }, [animationName]);

  useFrame((_, delta) => {
    const fox = foxRef.current;
    let speed = 0;
    switch (animationName) {
      case "Walk":
        speed = 0.25;
        break;
      case "Run":
        speed = 0.5;
    }

    const cylindrical = new THREE.Cylindrical().setFromVector3(fox.position);
    cylindrical.theta += Math.PI * delta * speed;
    fox.position.setFromCylindrical(cylindrical);
    fox.rotation.y = cylindrical.theta + Math.PI * 0.5;
  });

  return (
    <primitive
      ref={foxRef}
      object={fox.scene}
      scale={0.02}
      position={[0, -1, 3]}
      rotation-y={Math.PI * 0.5}
    />
  );
}
