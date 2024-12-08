import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

/**
 * Debug
 */
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const matcapTexture = textureLoader.load("./textures/matcaps/8.png");
const gradientTexture = textureLoader.load("./textures/gradients/3.jpg");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Objects
 */

/**
 * MeshBasicMaterial
 * 가장 기본 material
 * - map: color 텍스쳐 입히기
 * - color: 색상 입히기
 *   - color는 초기화 할때 말고는 그냥 문자열이 아닌 Color 객체임.
 * - wireframe: face 보여주는 wireframe 켜고 끄기
 * - opacity: 투명도 설정, transparent 속성이 켜져 있어야 적용됨
 * - alphaMap: alpha 텍스쳐 설정, 마찬가지로 transparent 속성이 켜져 있어야 적용
 * - side: 양면 적용 / 단면 적용 등을 선택할 수 있음. (THREE.DoubleSide - 양면)
 *   - 기본은 단면이라서 plane은 한 쪽면만 보이고, 구 안으로 들어가면 안에는 안보임
 *
 */
// const material = new THREE.MeshBasicMaterial(); // Material은 어떻게 "보여질지" 결정하기 때문에, 하나의 material로 여러 mesh에 적용 가능
// material.map = doorColorTexture;
// material.color = new THREE.Color("red");
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

/**
 * MeshNormalMaterial
 * Normal 텍스쳐와 같이 파란색 위주의 색을 가진다.
 * - normal은 기본적으로 각 정점이 어느 방향성을 가지는지를 의미하는 정보이다. (벡터)
 * - 이 material을 사용하면 각 정점의 방향성을 "보고있는 카메라 기준"으로 보여주는 것이다. 따라서 카메라를 돌려도 색상 분포가 동일하다.
 * - wireframe, transparent, opacity, side 등 프로퍼티는 그대로 사용 가능하고,
 * - 추가로 flatShading을 추가할 수 있다.
 *   -> 각 faces를 평탄화해서 시각적으로 보여줌
 * - 정점들의 normal을 디버그할 때 유용하게 사용 가능
 */
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

/**
 * MeshMatcapMaterial
 * - sphere 모양의 텍스쳐를 제공해주면, 이를 참고해서 알아서 카메라 방향에 맞게 텍스쳐를 입혀줌.
 * - https://github.com/nidorx/matcaps 에서 matcap 텍스쳐들 얻을 수 있음
 * - 아니면 Blender, Photoshop으로 matcap을 직접 만들거나,
 * - https://www.kchapelier.com/matcap-studio/ 에서 직접 만들수도 있음
 */
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

/**
 * MeshDepthMaterial
 * - 가까이 가야 보임
 */
// const material = new THREE.MeshDepthMaterial();

/**
 * MeshLambertMaterial
 * - lights가 필요한 material!!
 * - 다만 보여지는 그림자 무늬 등이 좀 부자연스럽다.
 */
// const material = new THREE.MeshLambertMaterial();

/**
 * MeshPhongMaterial
 * - 마찬가지로 lights가 필요한 material!!
 * - Lambert보다 더 자연스럽고, 무엇보다 더 많은 property를 조절할 수 있다.
 * - 다만 값들 자체가 사실과 와닿지 않고, 모호하다.
 */
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x2288ff);

/**
 * MeshToonMaterial
 * - 프로퍼티는 Lambert와 유사하나, 만화 같은 효과를 준다. (젤다 같은 느낌)
 * - gradient texture를 적용할 수 있다.
 *   - 이때, n단계의 gradient texture를 사용하면 기본적으로 mipmapping 때문에 GPU가 알아서 stretch 한다.
 *   - 만화 효과때문에 이 mipmap을 끌 필요가 있어서, NearestFilter로 설정한다.
 */
// const material = new THREE.MeshToonMaterial();
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

/**
 * MeshStandardMaterial
 * - Light을 지원하는 material 중 제일 사실적인 material (PBR에 가까움)
 */
// const material = new THREE.MeshStandardMaterial();

/**
 * MeshPhysicalMaterial
 * - MeshStandardMaterial과 동일하지만, 몇 가지 물리적인 기능이 추가됨
 * - clearcoat, sheen, iridescence, transmission
 */
const material = new THREE.MeshPhysicalMaterial();

// 아래는 Standard랑 Physical 모두 해당
material.metalness = 1;
material.roughness = 1;
material.side = THREE.DoubleSide;
// 모든 텍스쳐 다 적용해보자
material.map = doorColorTexture;
// Ambient Occulusion: 가짜 그림자 디테일, intensity 조절 가능
material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 3;
// Height(Displacement) Textures: 정점의 높낮이 설정, 충분히 subdivision이 있어야 제대로 설정됨
// scale로 높낮이 크기 설정 가능
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.1;
// Metalness & Roughness
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
// Normal: lighting에 대응하는 미친 세부적인 디테일을 넣어줌
// normalScale로 정도 조절 가능 (Vector2)
material.normalMap = doorNormalTexture;
material.normalScale.set(2, 2);
// Alpha: 투명도 설정, transparent true가 꼭 같이 필요함
material.transparent = true;
material.alphaMap = doorAlphaTexture;

// 여기서부터는 physical에 해당되는 내용
// // Clearcoat: material 겉에 얇은 유리막을 추가한 느낌
// // 성능 이슈가 있을 수 있어서, 사용에 주의 필요
// material.clearcoat = 1;
// material.clearcoatRoughness = 0;
// gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
// gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);

// // Sheen: 쇼파 같은 패브릭 재질의 텍스쳐에 주로 사용, material을 좁은 앵글에서 하이라이트
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1, 1, 1);
// gui.add(material, "sheen").min(0).max(1).step(0.0001);
// gui.add(material, "sheenRoughness").min(0).max(1).step(0.0001);
// gui.addColor(material, "sheenColor");

// // Iridescence: 기름막, CD 뒷면과 같은 무지개색 반사 효과를 줌
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];
// gui.add(material, "iridescence").min(0).max(1).step(0.0001);
// gui.add(material, "iridescenceIOR").min(1).max(2.333).step(0.0001);
// gui.add(material.iridescenceThicknessRange, "0").min(1).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, "1").min(1).max(1000).step(1);

// Transmission: material을 뚫고 지나가는 빛을 설정, 유리나 물 같은 효과
material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;
gui.add(material, "transmission").min(0).max(1).step(0.0001);
gui.add(material, "ior").min(1).max(10).step(0.0001);
gui.add(material, "thickness").min(0).max(1).step(0.0001);

/**
 * 계속 등장하는 IOR이란?
 * - Index of Refraction의 약자. 굴절률 같은 개념인듯
 *   - Diamond: 2.417
 *   - Water: 1.333
 *   - Air: 1.000293
 *   - https://en.wikipedia.org/wiki/List_of_refractive_indices
 */

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("white", 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight("white", 30);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

/**
 * Environment Map
 * - 전체 환경 맵 설정
 * - 일단 RGBELoader 활용
 * - 2k.hdr 파일이 lighting에 대한 정보도 담고 있음
 *   -> 밑에 있는 lighting 설정 없애도 됨
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  // scene의 배경으로 설정
  scene.background = environmentMap;
  // scene의 lighting도 hdr 파일을 기반으로 설정
  scene.environment = environmentMap;
});

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
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
