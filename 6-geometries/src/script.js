import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
/**
 * Geometries
 * - Geometry는 기본적으로 vertices로 이루어져 있음 (정점)
 * - 각 vertex간에 삼각형으로 연결되면 면이 생기는데, 이 삼각형들을 faces(or subdivision)라고 함 => faces가 모인 것이 geometry
 * - 모든 Built-in Geometry는 BufferGeometry 클래스를 상속
 */

/**
 * BoxGeometry
 * - 첫 3개 파라미터는 width, height, depth
 * - 마지막 3개 파라미터는 widthSegments, heightSegments, depthSegments
 *   - 한 방향에 대해 face가 얼마나 들어갈지를 결정한다. (모두 2이면 총 8개가 들어감)
 * - material에서 wireframe 옵션을 켜면 subdivision을 확인할 수 있다.
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * BufferGeometry
 * - 모든 Built-in geometry의 상위 클래스이고, custom geometry를 만들 때 사용한다.
 * - vertices의 데이터를 넣어야 하는데, 이때 JS의 Float32Array 자료형을 사용한다.
 * - 먼저 THREE.BufferAttribute를 생성한다.
 *   - 첫 번째 파라미터로 이 데이터를 넣고, 두 번째 파라미터로 vertex의 개수를 넣는다.
 */
const positionsArray1 = new Float32Array(9);

// x, y, z
positionsArray1[0] = 0;
positionsArray1[1] = 0;
positionsArray1[2] = 0;

positionsArray1[3] = 0;
positionsArray1[4] = 1;
positionsArray1[5] = 0;

positionsArray1[6] = 1;
positionsArray1[7] = 0;
positionsArray1[8] = 0;

// const positionsArray1 = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]); // 이렇게 해도 됨

const positionsAttribute1 = new THREE.BufferAttribute(positionsArray1, 3);
const customGeometry1 = new THREE.BufferGeometry();
// 이름을 무조건 positon으로 해야 한다. 이 position은 나중에 배울 shaders의 속성이다.
customGeometry1.setAttribute("position", positionsAttribute1);

const customMaterial1 = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const customMesh1 = new THREE.Mesh(customGeometry1, customMaterial1);
scene.add(customMesh1);

/**
 * 여러 faces 생성
 */
const count = 50;
// x, y, z 값이 3개 * 삼각형 점이 3개 * count개의 삼각형
const positionsArray2 = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray2[i] = Math.random() - 0.5;
}

const positionsAttribute2 = new THREE.BufferAttribute(positionsArray2, 3);
const customGeometry2 = new THREE.BufferGeometry();
customGeometry2.setAttribute("position", positionsAttribute2);

const customMaterial2 = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const customMesh2 = new THREE.Mesh(customGeometry2, customMaterial2);
scene.add(customMesh2);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
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

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
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
