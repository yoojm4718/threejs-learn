import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");
bakedShadow.colorSpace = THREE.SRGBColorSpace;
simpleShadow.colorSpace = THREE.SRGBColorSpace;

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

directionalLight.castShadow = true;

// Light에 포함된 shadow의 Mipmapping 사이즈를 줄여서 최적화 할 수 있다.
// 텍스쳐와 마찬가지로 2의 제곱수로 설정해야됨
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 10;

directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

// directionalLight.shadow.radius = 10;

// directionalLight의 camera를 가져와서 설정해주면 near, far 값을 조정할 수도 있음
// 그 전에 카메라 자체가 안보이기 때문에, Camera Helper를 사용해주면 편하다.
// (참고로 directional light는 빛이 평행으로 가기 때문에, orthogonal camera를 사용함)
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
// -> 확인해보면 near은 나쁘지 않은데 far이 너무 far임. 최적화 이슈 발생.
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

// Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 7, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

// not supported?
// spotLight.shadow.camera.near = 1;
// spotLight.shadow.camera.far = 6;
// spotLight.shadow.camera.fov = 30;

scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 2.7);
pointLight.position.set(-1, 1, 0);
pointLight.castShadow = true;

pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 1;
pointLight.shadow.camera.far = 6;

scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
// 그림자 계산의 대상이 되도록
sphere.castShadow = true;

const headSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 32),
  material
);
headSphere.position.y = 0.8;
// 그림자 계산의 대상이 되도록
headSphere.castShadow = true;

// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(5, 5),
//   new THREE.MeshBasicMaterial({
//     map: bakedShadow,
//   })
// );
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
// 그림자가 실제로 보이는 대상이 되도록
plane.receiveShadow = true;

scene.add(sphere, plane, headSphere);

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    alphaMap: simpleShadow,
    transparent: true,
  })
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;
scene.add(sphereShadow);

/**
 * Sizes
 */
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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Shadows
 * - shadows는 기본적으로 렌더링 시에 "shadow map"이라는 것을 그려서 동작한다고 함
 * - 이 shadow map은 각 light에 대해 생성되는데, 각 light가 카메라라고 쳤을 때 시선에서 모든 material이 MeshDepthMaterial이라고 가정한 사진을 찍음
 * - 여기서 shadow map의 느낌을 알 수 있음 https://threejs.org/examples/webgl_shadowmap_viewer.html
 * - shadow는 PointLight, DirectionalLight, SpotLight만 지원함
 * - shadow 적용 단계
 *   1. renderer에 shadowMap을 enable
 *   2. mesh에 castShadow를 true로 설정해서 그림자 계산의 대상이 되도록
 *   3. 그림자가 실제로 생길 대상 mesh에 receiveShadow를 true로 설정
 *   4. light에 castShadow를 true로 설정
 */

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// shadowMap을 enable해서 shadowMap을 그리게끔 설정
// renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update the sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  headSphere.position.x = Math.cos(elapsedTime) * 1.5;
  headSphere.position.z = Math.sin(elapsedTime) * 1.5;
  headSphere.position.y = Math.abs(Math.sin(elapsedTime * 3)) + 0.8;

  // Update the sphere shadow
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
