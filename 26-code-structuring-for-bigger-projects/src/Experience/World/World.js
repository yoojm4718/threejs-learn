import Experience from "../Experience";
import Environment from "./Environment";
import Floor from "./Floor";
import Fox from "./Fox";

class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Listen to Resources resourcesready event
    this.resources.on("resourcesready", () => this.#setWorld());
  }

  update() {
    if (this.fox) this.fox.update();
  }

  #setWorld() {
    // Setup
    // Environment 내부에 모든 mesh의 environment를 업데이트하는 코드가 있으므로, Environment 세팅을 가장 마지막에 배치!!!
    this.floor = new Floor();
    this.fox = new Fox();
    this.environment = new Environment();
  }
}

export default World;
