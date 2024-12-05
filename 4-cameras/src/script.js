import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

/**
 * Camera
 * - Camera라는 abstract class를 상속하는 여러 구현체가 있음
 *   - Array Camera: 여러 카메라를 사용, 멀티 플레이어 게임 등에 사용
 *   - Stereo Camera: 두 눈에 해당하는 카메라 두 개 사용, VR 기기를 위한 렌더링에 사용 - 깊이감을 줌
 *   - Cube Camera: 상하좌우전후 6개의 카메라로 서라운딩을 보여주는 카메라
 *   - Orthographic Camera: Perspective가 없는 카메라로, object가 멀리 있든 가까이 있는 똑같이 보이는 카메라
 *   - Perspective Cameara: 특정 시점의 카메라, 가장 일반적으로 사용
 */

// Camera
/**
 * Perspective Camera
 * - 파라미터 (총 4개)
 *   1. Field of view: "수직" 방향의 시야 각도. 특별한 목적이 아니면 45~75 정도가 적당
 *   2. Aspect Ratio: 종횡비
 *   3. Near
 *   4. Far
 *     - Near와 Far 파라미터는 얼마나 가까이, 그리고 얼마나 멀리 있는 물체까지 "보일건지"(=렌더할 것인지)를 결정한다.
 *     - 이 두 값은 0.00001이나 99999999와 같은 극단적인 값으로 지정하면 안됨!!
 *       - z-fighting 현상: GPU가 두 물체 간의 간격을 계산하기 힘들어서 두 물체가 겹쳐서 보인다. -> glitch가 발생
 */
const perspectiveCamera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
perspectiveCamera.position.x = 2;
perspectiveCamera.position.y = 2;
perspectiveCamera.position.z = 2;
perspectiveCamera.lookAt(mesh.position);
// scene.add(perspectiveCamera);

/**
 * Orthographic Camera
 * - 이 카메라는 perspective가 없음. 즉 "평행"으로의 시야각만 가짐
 * - 첫 4개 파라미터는 각각 left, right, top, bottom -> 카메라의 범위가 중앙(0)에서 얼마나 떨어져 있는지
 *   - 이 4개 파라미터를 단순히 숫자로 작성하면, render의 aspect ratio에 따라 보이는 모양이 짜부될 수 있다.
 *   - 따라서 left랑 right를 aspect ratio 값을 곱해주는 방식으로 지정하는게 자연스럽다. (카메라의 가로 세로 비율을 렌더의 비율과 동일하게 맞춰주는 것.)
 * - 마지막 2개 파라미터는 마찬가지로 Near과 Far
 */
const aspectRatio = sizes.width / sizes.height;
const orthographicCamera = new THREE.OrthographicCamera(
  -1 * aspectRatio,
  1 * aspectRatio,
  1,
  -1,
  0.1,
  100
);
orthographicCamera.position.x = 2;
orthographicCamera.position.y = 2;
orthographicCamera.position.z = 2;
orthographicCamera.lookAt(mesh.position);
// scene.add(orthographicCamera);

/**
 * Mouse Event 추가하기
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5; // -0.5 ~ 0.5
  cursor.y = -(event.clientY / sizes.height - 0.5); // 0.5 ~ -0.5 (브라우저는 y축이 아래 방향이지만, threejs에서는 위 방향이므로)
});

/**
 * Controls
 * - 카메라에 대한 컨트롤을 직접 설정할 수도 있지만, Control을 이용해 이미 만들어진 설정을 사용할 수 있다.
 * - 종류
 *   - FlyControls: 인공위성과 같은 완전 위의 시야에서 내려다 보듯이 움직이는 카메라.
 *   - FirstPersonControls: 이름과 달리 1인칭 시점은 맞지만 좀 더 비행기 같은 시점.
 *   - PointerLockControls: 1인칭 시점을 구현할 수 있게 포인터가 고정된 시점. 다만 사용하기 어려움
 *   - OrbitControls: 한 지점에 고정하고 마우스에 따라 자유롭게 회전함. -> 땅에 대한 Limit이 있고, upside-down도 안됨
 *   - TrackballControls: OrbitControls의 limit이 사라진 버전. 땅도 뚫고 upside-down도 됨
 *   - TransformControls: 물체를 마우스로 움직이고자 할 때 사용, 에디터 구현 시 보통 사용
 *   - DragControls: 마찬가지로 물체를 움직일 때 사용
 * - Controls는 THREE에 포함되지 않고, 따로 import
 * - Controls는 특정 속성 변경 후 항상 controls.update()를 해주어야 함.
 */

/**
 * OrbitControls
 */
const orbitControls = new OrbitControls(camera, canvas);
// orbitControls.target.y = 3; // target은 Vector3 객체이며, orbit control의 중심점을 설정한다.
orbitControls.enableDamping = true; // damping은 마우스로 인한 움직임을 더 자연스럽게 만든다. (마찰, 속도 제어 추가) -> tick안에 무조건 update가 들어가야 함.
orbitControls.update();

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // mesh.rotation.y = elapsedTime;

  // Update Camera
  // camera.position.x = cursor.x * 10; // 곱해주는 숫자만큼 더 멀리 이동
  // camera.position.y = cursor.y * 10;

  // x축 방향으로 한 바퀴 돌게 하고 싶다면, sin, cos과 PI 사용
  // z축 방향에 cos을 적용해서 카메라가 물체 주위를 한 바퀴 돌도록 설정
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 5;

  // camera.lookAt(mesh.position);

  // Update Controls
  orbitControls.update();

  // Render
  // renderer.render(scene, perspectiveCamera);
  // renderer.render(scene, orthographicCamera);
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
