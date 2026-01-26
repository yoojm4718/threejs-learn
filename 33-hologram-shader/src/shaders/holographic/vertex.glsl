uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

float random2D(vec2 st);

void main() {
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Glitch (in XZ plane)
    float glitchTime = uTime - modelPosition.y; // 시간에 따라 한 점에서의 glitch가 커졌다 작아졌다 하고, 그게 현재 위치의 y값에 따라 다른 시점에 발생해서 전체적으로 wave 같은 효과가 됨
    float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76); // sin 함수를 훨씬 더 불규칙적으로 만들기
    glitchStrength /= 3.0; // sin 함수 3개가 더해졌으니 -1~1 범위를 맞추기 위해 3으로 나눔
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength); // 한 점에서 strength가 0이 되는 구간을 더 늘림
    glitchStrength *= 0.25;

    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5)  // position update가 없이 가만히 있어도 glitch effect가 진행되도록 uTime을 변수로 넣음
                        * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) // - 0.5는 random이 0~1 사이의 값이므로, 중앙을 맞추기 위해
                        * glitchStrength; 

    // Final Position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model Normal
    // Normal 값이 카메라가 보고 있는 시선 기준으로 고정되도록!!
    // vec4에서 마지막 값은 "homogeneous" 값! 이걸 1.0으로 두면 normal vector가 model의 transform(translate, rotate, scale)을 따라감
    // position은 당연히 그게 필요함
    // normal은 그럴 필요가 없기 때문에 0.0으로 set
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // Varying
    vPosition = modelPosition.xyz;
    // vPosition = position.xyz; // 이렇게 하면 stripes가 모델과 함께 돌아감

    vNormal = modelNormal.xyz;
}

float random2D(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}