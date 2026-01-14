import * as THREE from "three";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World/World";
import Resources from "./Utils/Resources";
import sources from "./sources";
import Debug from "./Utils/Debug";

/**
 * Main class for this Three.js Project
 */
class Experience {
  static #instance = null;

  constructor(canvas) {
    // Singleton
    if (Experience.#instance) return Experience.#instance;
    Experience.#instance = this;

    // Global access (to use directly on browser console)
    window.experience = this;

    // Options
    this.canvas = canvas;

    // Three.js Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();

    // World Setup
    this.world = new World();

    // Listen to Sizes resize event
    this.sizes.on("resize", () => this.#resize());

    // Listen to Time tick event
    this.time.on("tick", () => this.#update());
  }

  // 프로젝트가 더 복잡해지면 각 클래스마다 destroy 메서드 만드는게 좋음!
  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    // Traverse the whole scene
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === "function") value.dispose();
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    // Post-Processing을 사용한다면 아래의 것들도 dispose
    // EffectComposer, WebGLRenderTarget 그리고 any potential passes you are using

    if (this.debug.active) this.debug.ui.destroy();
  }

  #resize() {
    // Propagate Sizes resize event (order matters)
    this.camera.resize();
    this.renderer.resize();
  }

  #update() {
    // Propagate Time tick event (order matters)
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }
}

export default Experience;
