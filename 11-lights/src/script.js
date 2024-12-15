import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import GUI from "lil-gui";

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
 * - 여러 종류가 있지만, Light는 기본적으로 성능 저하의 큰 원인이 되기 때문에 최소화하는게 좋다.
 * - AmbientLight랑 HemisphereLight는 성능 이슈가 크게 없어서 좀 괜찮음
 * - DirectionalLight랑 PointLight는 중간 정도의 성능 이슈
 * - SpotLight랑 RectAreaLight는 높은 성능 이슈를 가지므로 최대한 안써야 한다.
 * - 제일 최소화하는 방법은 Blender를 활용해서 light을 Baking하는 것!!
 *      -> texture안에 light을 그대로 집어넣는 방식이다. 따라서 light 자체가 움직이는 등의 표현은 불가함
 */

/**
 * AmbientLight
 * - 모든 방향에서 오는 light이다. 따라서 어떤 면에서 봐도 균일하게 보인다.
 * - 색과 intensity를 조절
 * - 이거 자체로는 비현실적이지만, light bouncing을 구현하기 위해 보통 쓰인다.
 * - three.js에서는 빛이 하나라면 물체의 반대면은 어두워서 안보인다.
 * - 그러나 현실에서는 light bouncing 때문에 뒷면도 보인다.
 * - 제대로 구현하기는 어렵지만, 이걸 쉽게 구현하기 위해 ambient light도 추가로 적용한다.
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

/**
 * DirectionalLight
 * - 굴절없이 평행하게 들어오는 빛, 태양과 비슷
 * - 기본적으로 position 위치에서 scene의 center 방향으로 평행하게 빛이 들어온다.
 * - 당장은 얼마나 멀리 떨어져 있는지는 전혀 차이가 없다.
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(2, 0.5, 0);
scene.add(directionalLight);

/**
 * HemisphereLight
 * - 양쪽에서 들어오는 빛 -> 각 방향의 빛에 대해 색을 정할 수 있고, 중간 위치에서는 두 색이 섞인 색이 된다. (그라데이션 처럼)
 * - 바닥은 풀이고 하늘이 파란색일때, 그 빛을 표현하기 위해 사용 가능
 */
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9);
scene.add(hemisphereLight);

/**
 * PointLight
 * - 한 점에서 발생하는 빛, 사방으로 퍼짐
 * - color와 intensity 다음에 오는 인수는 distance로, 어느정도 멀리까지 퍼질건지 설정
 * - 네번째 인수는 decay로, 빛이 퍼지면서 얼마나 빨리 빛이 줄어들건지 설정, 기본값은 2이고 보통 기본값 그대로 둠
 */
const pointLight = new THREE.PointLight(0xff9000, 1.5, 10, 0.5);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

/**
 * RectAreaLight
 * - 평면 형태의 조명
 * - 3, 4번째 인수는 각각 width랑 height
 * - 이 light는 MeshStandardMaterial이랑 MeshPhysicalMaterial만 영향을 받음
 * - position이 Object3D의 인스턴스이므로 lookAt을 사용할 수 있음
 */
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 10, 3, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

/**
 * SpotLight
 * - 정말 손전등 같은 조명으로, 벽면에 닿으면 원 모양이 됨
 * - 1, 2번째 인수는 당연히 color와 intensity
 * - 3은 distance: 얼마나 멀리까지 빛이 도달할건지
 * - 4는 angle: 손전등 각도가 얼마나 벌어질건지
 * - 5는 penumbra: 손전등 비치는 원의 가장자리 부분이 얼마나 blurry할지, 0이면 blur가 없이 sharp함
 * - 6은 decay: 위와 같은 의미인데, 보통 1로 그냥 둠
 *
 * - spotlight이 바라보는 방향은 굉장히 특이하게 작동하는데, spotlight의 "target"의 위치를 설정해줘야 함.
 * - 기본적으로 안보이는 하나의 target을 기준으로 손전등이 바라보는 듯
 * - 적용하려면 target을 scene에 추가해줘야 함
 */
const spotLight = new THREE.SpotLight(
  0x78ff00,
  4.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

spotLight.target.position.x = -1.75;
scene.add(spotLight.target);

/**
 * Light Helpers
 * - light만 사용하면 light의 효과만 볼 수 있을 뿐, light 그 자체를 볼수는 없음
 */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);
const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
scene.add(spotLightHelper);

// 얘는 따로 import 필요
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
