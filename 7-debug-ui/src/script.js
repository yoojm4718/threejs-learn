import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

/**
 * Debug UI
 * - 코드가 아닌 웹 상에서 여러 조정을 GUI로 가능 - 빠른 테스트
 * https://lil-gui.georgealways.com/
 */
const gui = new GUI({
  width: 300,
  title: "DEBUG UI",
  closeFolders: false,
});
const debugObject = { color: "#ff0000" };

// 아래 코드로 h 버튼 누르는걸로 gui 토글 가능
gui.hide();
window.addEventListener("keydown", (event) => {
  console.log(event.key);
  if (event.key === "h") gui.show(gui._hidden);
});

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
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Folder를 추가할 수 있다.
const cubeTweaks = gui.addFolder("Control Cube");
// cubeTweaks.close();

/**
 * - Debug UI에 add 메서드로 조정할 값을 추가한다.
 * - 이때, 첫 인자로 "Object"가 들어가고, 두 번째 인자로 "Property"가 들어간다.
 * - 나머지 두 인자는 min, max, step
 */
// gui.add(mesh.position, "y", -3, 3, 0.01);
// 아래와 같이 builder 패턴으로도 설정 가능
// name으로 ui에 뜨는 이름 설정 가능
cubeTweaks.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");

// 프로퍼티의 타입이 boolean이면 checkbox가 된다.
cubeTweaks.add(mesh, "visible");
cubeTweaks.add(material, "wireframe");

// color에 대해서는 addColor를 사용하면 됨 - 색상 선택 이용하려면
// cubeTweaks.addColor(material, "color");

/**
 * onChange를 활용하면 값 변경에 대한 핸들러를 직접 만들어 줄 수 있다.
 */
// cubeTweaks.addColor(material, "color").onChange((value) => {
//   // 아래 둘 다 같은 값
//   // console.log(material.color);
//   // console.log(value);

//   /**
//    * Three.js는 렌더링 최적화를 위해 자체적인 색상 management를 진행한다.
//    * 따라서 debug ui에 뜨는 색상이랑 실제 object에 적용되는 색상이 조금 다르다.
//    * 정확한 색상을 알려면 onChange 이용해서 아래와 같이 직접 얻어오면 된다.
//    */
//   console.log(value.getHexString())
// });

/**
 * 만약 debug ui랑 실제 색상이 같도록 설정하려면, debugObject(외부 객체)를 만들어서 외부에서 색상을 관리하도록 설정한다.
 */
cubeTweaks.addColor(debugObject, "color").onChange(() => {
  material.color.set(debugObject.color);
});

/**
 * Function / Button을 사용하려면 역시 특정 객체에 메서드를 넣어서 추가해야 한다.
 * debugObject에 넣으면 좋음
 * fuction이면 자동으로 버튼이 됨
 */
debugObject.spin = () => {
  gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 });
};
cubeTweaks.add(debugObject, "spin");

/**
 * widthSegment, heightSegment, depthSegment와 같이 material이 "생성될 때"만 수정되는 값에 대해서는
 * 단순한 방식으로 debug UI 설정을 할 수가 없음.
 * 그래서 이때도 debutObject로 값을 관리하고, 대신 바뀔때마다 geometry가 새로 생성되게끔 한다.
 * 그러나 바뀔때마다 geometry가 새로 생성되는건 부하가 많이 걸리므로,
 * onChange 대신 onFinishChange를 사용한다. (조정할 때 마우스를 떼야 적용됨)
 * 이전 geometry는 dispose 메서드로 제거되도록 해서 메모리 누수를 방지한다.
 */
debugObject.subdivision = 2;
cubeTweaks
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
