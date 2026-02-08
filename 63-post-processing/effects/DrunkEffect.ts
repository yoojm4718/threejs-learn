import { Effect } from "postprocessing";
import * as THREE from "three";
import { BlendFunction } from "postprocessing";

export interface DrunkEffectOptions {
  frequency?: number;
  amplitude?: number;
  blendFunction?: BlendFunction;
}

const fragmentShader = /* glsl */ `
    uniform float uFrequency;
    uniform float uAmplitude;
    uniform float uOffset;

    void mainUv(inout vec2 uv) {
        uv.y += sin(uv.x * uFrequency + uOffset) * uAmplitude;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec4 color = inputColor;
        color.rgb *= vec3(0.8, 1.0, 0.5);

        outputColor = color;
    }
`;

export default class DrunkEffect extends Effect {
  constructor(options: DrunkEffectOptions) {
    super("DrunkEffect", fragmentShader, {
      uniforms: new Map([
        ["uFrequency", new THREE.Uniform(options.frequency || 2)],
        ["uAmplitude", new THREE.Uniform(options.amplitude || 0.1)],
        ["uOffset", new THREE.Uniform(0)],
      ]),
      blendFunction: options.blendFunction || BlendFunction.DARKEN,
    });
  }

  update(
    renderer: THREE.WebGLRenderer,
    inputBuffer: THREE.WebGLRenderTarget,
    deltaTime?: number,
  ) {
    const uOffset = this.uniforms.get("uOffset");
    if (uOffset) uOffset.value += deltaTime;
  }
}
