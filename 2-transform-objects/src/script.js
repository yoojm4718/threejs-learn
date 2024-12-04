import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// =========================
/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

/**
 * Positioning
 * - mesh.position은 Vector3 클래스의 객체
 */
// x, y, x 위치 개별 설정
mesh.position.x = 0.7;
mesh.position.y = -0.6;
mesh.position.z = 1;

console.log(mesh.position.length()); // 원점으로부터의 거리
mesh.position.normalize(); // normalize하면 object를 원점으로부터 1만큼의 거리로 가져옴
console.log(mesh.position.length()); // 1

// 한 번에 설정
mesh.position.set(0.7, -0.6, 1);

/**
 * Scale
 */
mesh.scale.x = 2;
mesh.scale.y = 0.5;
mesh.scale.z = 0.5;
// or
mesh.scale.set(2, 0.5, 0.5);

/**
 * Rotate
 * - 회전하려면 Rotation / Quarternion
 * - rotation을 수정하면 quarternion도 수정되고, 반대도 성립 -> 둘 중 하나로 사용하면 됨
 */

/**
 * Rotation
 * - mesh.rotation은 Euler 클래스의 객체 (Vector3가 아님)
 */
// 여기서의 x, y, z는 "회전축"을 의미함.
// 반 바퀴 돌려면 PI, 한 바퀴 돌려면 2 * PI로 설정해야 함.
// 중요한 것은 x, y, z의 적용 순서이다. 하나가 회전하면 물체의 회전축도 같이 돌아가므로, 순서가 바뀌면 회전 모양도 달라진다.
// reorder를 사용하면 적용되는 회전축 순서를 바꿀 수 있음, 기본은 XYZ (코드의 순서는 관계 없음)
mesh.rotation.reorder("YXZ");
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.4;

scene.add(mesh);

// =========================

/**
 * Group
 *
 * - Mesh와 같이 Object3D를 extend하므로, Group에 요소들을 묶어서 한 번에 transform 가능
 */
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "green" })
);
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "blue" })
);
cube2.position.x = -2;
group.add(cube2);

// group 한 번에 이동
group.position.y = 1;

// Axes helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

// =========================
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, 3);
scene.add(camera);

/**
 * lookAt
 * - Camera가 특정 요소를 보게끔 설정
 */
camera.lookAt(mesh.position);
// =========================

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
