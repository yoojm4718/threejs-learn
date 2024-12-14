import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import GUI from "lil-gui";

/**
 * Typeface Font
 * - 3D 텍스트를 만드려면 특수한 폰트인 Typeface Font를 사용해야 한다.
 * - https://gero3.github.io/facetype.js/ -> 이 사이트에서 변환 가능
 * - static 폴더에 font와 license 넣기
 */

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Fonts
 * - FontLoader로 로딩
 * - load 메서드에서 콜백 함수로 font 사용
 */
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  /**
   * TextGeometry
   * - size랑 depth로 크기랑 두께 조절
   * - 기본적으로 face가 굉장히 많고, 곡선과 모서리 굴곡(bevel)이 많음 -> 성능에 치명적
   * - curveSegments(곡선 부분)랑 bevelSegments(모서리 부분)로 조절하기
   */
  const textGeometry = new TextGeometry("Hello Three.js", {
    font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  const matcapMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });
  //   matcapMaterial.wireframe = true;
  const text = new THREE.Mesh(textGeometry, matcapMaterial);

  /**
   * 중앙 정렬
   * - 중앙 정렬을 위한 방법은 두 가지가 있다.
   * 1. Bounding을 활용한 방법
   *    - 이때는 Mesh가 아닌 Geometry를 움직여서, Mesh는 그대로고 Geometry만 움직이는 상태로 만든다.
   *    - 따라서 회전축은 Mesh 기준 원래 왼쪽 아래인데, Geometry가 움직이니깐 회전축이 중앙이 되는 효과가 된다.
   * 2. 그냥 textGeometry.center() 사용
   */

  /**
   * Boundings
   * - 모든 material은 기본적으로 두 종류의 bounding을 가진다.
   *   - Box Bounding: material을 둘러싸는 직육면체 영역
   *     -> 카메라가 어떤 material을 보이고 안보일건지에 대한 기준이 됨 = frustum culling
   *   - Sphere Bounding: material을 둘러싸는 구체 영역 (길이를 지름으로 가지게 됨)
   *     -> three.js의 기본 bounding 방식
   */
  // geometry의 box bounding을 계산한다. 계산하지 않으면 boundingBox 프로퍼티가 null임
  textGeometry.computeBoundingBox();
  // boundingBox 프로퍼티는 Box3의 인스턴스이다.
  //   - min은 mesh 기준 왼쪽 아래의 위치, max는 오른쪽 위의 위치인듯
  // 확인해보면, min 값이 0,0,0이 아니라 약간의 마이너스 값임을 알 수 있고, 육안으로도 x,y,z 축보다 살짝 튀어나와 있음
  // 이는 bevel 부분이 튀어나와 있기 때문이고, bevelSize랑 bevelThickness로 결정된다.
  console.log(textGeometry.boundingBox);
  // translate로 geometry 자체를 변형한다. (css transform의 translate와 비슷한 듯, Mesh는 가만히 있고 내용만 변형)
  // x, y에 대해서는 bevelSize(0.02)만큼의 보정이 필요하고, z에 대해서는 bevelThickness(0.03)에 대한 보정이 필요
  textGeometry.translate(
    -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  );

  // 근데 이렇게만 해도 됨...
  // textGeometry.center();

  scene.add(text);

  // 우리가 랜덤화 하는 것은 donut의 모양이나 geometry가 아니기 때문에,
  // scene 상의 정보인 mesh를 제외한 geometry나 material은 하나만 사용한다!!
  // * 매우 중요한 최적화 방식
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  // material도 font와 동일한 material을 사용하기 때문에, 공유해도 됨
  // const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, matcapMaterial);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
});

// /**
//  * Object
//  */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );

// scene.add(cube);

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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
