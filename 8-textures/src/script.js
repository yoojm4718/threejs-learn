import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Textures
 * 텍스쳐의 종류
 * - Color(Albedo) Textures: 가장 단순함, geometry에 적용됨
 * - Alpha Textures: 흑백이고, 흰 색 부분은 보이고 검은색 부분은 안보임
 * - Height(Displacement) Textures: 정점들을 움직임
 *   - 완전 회색을 기준으로 더 흰색이면 올라가고 검은색이면 내려가는 방식
 *   - 그만큼 충분한 subdivision이 필요함
 * - Normal Textures: 디테일을 추가하는 텍스쳐, 디테일이란 거의 lighting에 대한 부분.
 *   - 정점의 이동이 필요 없어서 굳이 subdivision이 많이 필요하진 않음
 * - Ambient Occlusion: 흑백이고, 가짜 그림자와 같은 디테일을 넣음
 * - Metalness: 이것도 흑백이고, 흰 부분은 metalic, 검은 부분은 non-metalic / 주로 reflection 만들 때 사용
 * - Roughness: 빛의 분산 표현, 흰 부분은 rough, 검은 부분은 smooth
 *
 * 이러한 texture들은 모두 PBR 원칙을 기반으로 한다. (특히 metalness랑 roughness)
 * - PBR = Physically Based Rendering
 * - 즉, 현실세계의 물리 법칙이 반영된 렌더링
 * - threejs 말고도 unity, unreal 등등도 PBR을 기반으로 함
 *
 * 텍스쳐를 직접 준비하고자 할 때(포토샵 등), 3가지 중요한 요소를 고려해야 함
 *   1. weight
 *     - 텍스쳐 파일은 최대한 가볍게
 *     - jpg/png 중에 어떤거 쓸지 고민 필요, 웬만하면 jpg
 *     - tinypng.com 같은데서 압축해서 사용
 *     - 더 압축된 파일인 basis라는 것도 있음
 *   2. size
 *     - 더 작을수록 당연히 성능은 좋음
 *     - mipmapping때문에 가로 세로 길이는 무조건 2의 제곱수! ex) 512x512, 512x2048, ...
 *   3. data
 *     - png로 하나에 투명도까지 전달할지, 아니면 alpha 텍스쳐를 추가해서 두 개의 jpg를 할 건지 밸런스있게 정해야 됨
 *     - normal 같은 텍스쳐는 정확도가 중요하기 때문에, loss가 없는 png로 하는게 좋음.
 *
 * 텍스쳐를 구할 수 있는 사이트
 * - poliigon.com
 * - 3dtextures.me
 * - arroway-textures.ch
 * 텍스쳐 제작하는 adobe 툴
 * - Substance Designer
 */
// 아래 방식은 기본적인 텍스쳐 로드 방식
/*
const image = new Image();
const texture = new THREE.Texture(image);

// image가 확실히 로드되었는지 확인 후에 넣기 위해 Image 객체 만들고 onload 이벤트 설정
image.onload = () => {
  // texture 변수를 최상위 스코프에 선언하고, onload에는 Update 설정 진행
  texture.needsUpdate = true;
};
image.src = "/textures/door/color.jpg";
*/

// 이 방식이 더 간단한 텍스쳐 로드 방식

// LoadingManager를 사용하면 텍스쳐 등등 로딩 이후에 3D를 시작할 수 있도록 설정할 수 있음 (로딩 구현)
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {};
loadingManager.onLoad = () => {};
loadingManager.onProgress = () => {};
loadingManager.onError = () => {};

// TextureLoader는 여러 texture를 로드할 수 있음
// loadingManager를 추가해서 loader를 loadingManager 범위로 포함
const textureLoader = new THREE.TextureLoader(loadingManager);
// textureLoader.load로 로드함, 이때, 경로 이후의 인수는 각각 load, progress, error임
const colorTexture = textureLoader.load(
  "/textures/door/color.jpg",
  () => {},
  () => {},
  () => {}
);
// map이나 matcap을 이용해 적용될 텍스쳐는 sRGB로 인코딩 되어야 해서, 아래 설정이 추가되어야 함
colorTexture.colorSpace = THREE.SRGBColorSpace;

// repeat만 설정하면 각 방향의 마지막 픽셀을 n배 만큼 쭉 늘린다.
// repeat는 Vector2 객체이다.
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 4;

// 정상적으로 반복하려면 wrapS랑 wrapT도 추가로 사용해야 한다. (repeat랑 무조건 같이 사용!!)
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;

// 반전해서 반복하려면 MirroredRepeatWrapping을 사용한다.
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;

// offset으로 위치를 옮길 수 있음
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

// rotation으로 회전도 가능함, 단위는 radian
// colorTexture.rotation = Math.PI / 4;
// rotation 기준점이 왼쪽 아래이기 때문에, 중앙을 기준점으로 하려면 아래와 같이 설정
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

/**
 * Filtering and Mipmapping
 * - 거의 안보이는 텍스쳐의 경우 blurry하게 보인다. -> 이는 자동으로 수행되는 Mipmapping 작업 때문
 * - 기존 텍스쳐를 계속 반으로 줄인 텍스쳐를 생성해서, 1x1까지 생성한다, 그리고 이걸 GPU로 보냄
 * - GPU는 그 중 상황에 가장 적절한 텍스쳐를 선정해서 보여줌
 * - mipmapping하면 기존 텍스쳐의 두 배 크기로 GPU에서 저장하기 때문에, 성능 부하가 걸린다.
 * - Mipmapping 알고리즘은 두 종류가 있음
 */

/**
 * 1. Minification Filter
 *   - 기존 텍스쳐에 비해 보여주는 부분이 작은 경우 발생
 *   - 기본값은 THREE.LinearMipmapLinearFilter
 *   - 여러 값이 있는데, 미묘한 차이가 남
 *   - 이 예제에 static에 있는 checkerboard-1024x1024를 사용하면 차이를 확연하게 알 수 있음
 *   - NearestFilter를 사용하면 제일 큰 텍스쳐를 사용하기 때문에(화질 제일 좋음), mipmapping이 필요 없음
 *     -> generateMipmaps를 false로 설정해서 비활성화, 성능 더 최적화 가능
 */
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.generateMipmaps = false;

/**
 * 2. Magnification Filter
 *   - 텍스쳐에 비해 더 확대된 경우 발생
 *   - 기본값은 THREE.LinearFilter
 *   - 두 가지 값 밖에 없음: LinearFilter랑 NearestFilter
 *   - Nearest Filter를 하면 아주 작은 텍스쳐여도 깨짐 없이 나옴 -> 더 나은 결과물을 위해 이렇게 지정해주는게 좋음
 */
colorTexture.magFilter = THREE.NearestFilter;

const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

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
// map 속성으로 texture를 설정할 수 있다.
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
/**
 * UV Coordinates
 * - 만약 복잡한 모양의 geometry에 대해 텍스쳐를 입히려면, 각 면을 전개한 전개도처럼 텍스쳐 이미지를 만들어야 한다.
 * - 이것이 가능한 이유는 바로 UV Coordinates 때문인데, 이는 전개도 상에서 각 꼭짓점의 좌표이다.
 * - Blender 같은 거로 텍스쳐 작업할 때 이 UV Coordinates로 작업하면 된다.
 * - geometry.attributes.uv에서 이 UV Coordinates를 확인할 수 있다. (array안의 두 개씩 묶은게 좌표)
 */
console.log(geometry.attributes.uv);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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
