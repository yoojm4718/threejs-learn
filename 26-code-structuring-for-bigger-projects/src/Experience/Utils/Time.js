import EventEmitter from "./EventEmitter";

class Time extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16; // 보통 60fps에서는 16mills 이므로 일단 이렇게 해둠 (0으로 하면 문제 생길 수 있음)

    // Wait one frame and tick (첫 deltaTime이 0이 되지 않도록 하기 위해)
    window.requestAnimationFrame(() => this.tick());
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.trigger("tick");

    window.requestAnimationFrame(() => this.tick());
  }
}

export default Time;
