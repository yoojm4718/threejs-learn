import DrunkEffect, { DrunkEffectOptions } from "@/effects/DrunkEffect";
import { ThreeElements } from "@react-three/fiber";

interface DrunkProps extends DrunkEffectOptions {
  ref?: React.Ref<ThreeElements["primitive"]>;
}

export default function Drunk({ ref, ...options }: DrunkProps) {
  const effect = new DrunkEffect(options);

  return <primitive ref={ref} object={effect} />;
}
