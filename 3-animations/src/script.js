import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/**
 * Animation의 핵심
 *
 * 1. `requestAnimationFrame`: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
 *  - window 객체의 Web API로, 이름과는 달리 Animation을 위한 함수가 아님.
 *  - 대신 "다음 프레임"을 한 번 호출하기 위한 함수. -> 재귀적으로 작성해서 연쇄적으로 실행되는 것.
 */

/**
 * Basic Animations
 *  - 아래와 같이 애니메이션 적용하면 잘 되지만, "컴퓨터 사양"에 따라 FPS가 다르기 때문에,
 *    FPS가 높을수록 애니메이션이 빠르게 수행된다.
 */
const tickBasic = () => {
  // Update Objects
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  // Render
  renderer.render(scene, camera);

  // 컴퓨터 사양에 따라 FPS가 다를 수 있음.
  window.requestAnimationFrame(tickBasic);
};
// tickBasic();

/**
 * Adaptation to the framerate using Date
 * - FPS에 따른 속도 문제를 해결하려면, "시간"을 기반으로 애니메이션을 동작하면 된다.
 * - 이전 프레임과의 시간 차이를 확인하고(deltaTime),
 */
let time = Date.now();

const tickAdapt = () => {
  // Time
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;
  console.log(deltaTime); // FPS가 높을수록 deltaTime 값은 낮아짐 (frame간 시간차가 적으므로)

  mesh.rotation.y += 0.001 * deltaTime; // 애니메이션 변화 자체를 deltaTime을 기반으로 설정해준다.

  // Render
  renderer.render(scene, camera);

  // 컴퓨터 사양에 따라 FPS가 다를 수 있음.
  window.requestAnimationFrame(tickAdapt);
};
// tickAdapt();

/**
 * Adaptation to the framerate using Clock
 * - three.js에 내장된 Clock 클래스를 사용할 수도 있다.
 * - (getDelta는 사용하지 말 것)
 */
const clock = new THREE.Clock();

const tickAdaptWithClock = () => {
  // Clock
  const elapsedTime = clock.getElapsedTime();
  console.log(elapsedTime); // Clock 인스턴스화 후 경과 시간이 찍힌다. (소수점 포함된 초 단위로 찍힘)

  mesh.rotation.y = elapsedTime;
  // mesh.rotation.y = elapsedTime * Math.PI * 2; // 1초에 한 바퀴 돌려면 PI * 2를 곱해준다.
  mesh.position.y = Math.sin(elapsedTime); // 사인 값을 활용하면 사인 함수로 위 아래 왔다갔다하는 애니메이션을 적용할 수 있다. (당연히 다른 삼각함수도 가능)
  mesh.position.x = Math.cos(elapsedTime); // 사인과 코사인 합치면 원 운동 쌉가능.

  // 아래와 같이 설정하면 mesh를 계속 바라보면서 카메라가 원 운동한다.
  // mesh.position.y = Math.sin(elapsedTime);
  // mesh.position.x = Math.cos(elapsedTime);
  // camera.lookAt(mesh.position);

  // Render
  renderer.render(scene, camera);

  // 컴퓨터 사양에 따라 FPS가 다를 수 있음.
  window.requestAnimationFrame(tickAdaptWithClock);
};
// tickAdaptWithClock();

/**
 * GSAP를 이용한 애니메이션
 * - GSAP(GreenSock)는 JS의 애니메이션을 돕는 라이브러리.
 */
gsap.to(mesh.position, {
  x: 2,
  duration: 1,
  delay: 1,
});
gsap.to(mesh.position, {
  x: 0,
  delay: 2,
  duration: 1,
});
const tickGSAP = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tickGSAP);
};
tickGSAP();
