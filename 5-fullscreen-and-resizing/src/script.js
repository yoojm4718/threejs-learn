import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 * - canvas를 viewport만큼 채우려면 window.innerWidth랑 window.innerHeight 사용
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// resize 이벤트로 canvas가 윈도우 사이즈를 따라가도록 설정
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  // 카메라에 들어가는 aspect 값이 유지되어야 하므로 설정 필요
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  // renderer 사이즈를 viewport 사이즈에 맞추기
  renderer.setSize(sizes.width, sizes.height);
  /**
   * Pixel Ratio
   * - 모니터마다 pixel ratio가 있는데, 이건 한 픽셀 안에 몇 개의 픽셀을 표현하는지임
   *   - 보통은 1이고, retina display 같은 것들은 2임
   * - js에서 window.devicePixelRatio를 찍어보면 알 수 있고, 모니터 별로 움직이면 값이 다르게 나옴
   * - 아래 코드로 기기의 pixel ratio에 맞게 renderer의 pixel ratio를 설정하면 그래픽의 blur 효과나 stair 효과가 나타나지 않음
   * - 다만 2 이상의 pixel ratio는 불필요하기 때문에 Math.min으로 최대값을 2로 설정해주는게 좋음
   * - 모니터를 옮겨가는 상황을 대비하기 위해 resize 이벤트 안에 넣을 필요가 있음
   */
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Toggle Fullscreen
 */
window.addEventListener("dblclick", () => {
  // iPad 등 일부 fullscreen 지원을 하지 않는 브라우저의 경우 아래 코드는 동작 X
  // if (!document.fullscreenElement) {
  //   canvas.requestFullscreen();
  // } else {
  //   document.exitFullscreen();
  // }

  // 아래 코드가 더 범용적
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) canvas.requestFullscreen();
    else if (canvas.webkitRequestFullScreen) canvas.webkitRequestFullScreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
