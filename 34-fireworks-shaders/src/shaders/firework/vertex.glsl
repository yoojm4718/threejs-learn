uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;
attribute float aTimeMultiplier;

// 이 remap function은 value가 originMin~originMax 동안 destinationMin->destinationMax로 가도록 만드는 함수
// smoothstep과 달리 clamping 기능은 없음, 따라서 destMax 도달 후에도 계속 증가
float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax);

void main() {
    vec3 newPosition = position;
    float progress = uProgress * aTimeMultiplier; // randomly accerlerated version of uProgress

    // Exploding
    // 0.0 ~ 0.1 동안 0에서 1.0으로 증가 (progress 초반에 빠르게 증가)
    float explodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
    explodingProgress = clamp(explodingProgress, 0.0, 1.0); // 직접 clamping 필요
    explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0); // easing 직접 구현
    newPosition *= explodingProgress;

    // Falling
    float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
    fallingProgress = clamp(fallingProgress, 0.0, 1.0);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    newPosition.y -= fallingProgress;

    // Scaling
    float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
    float sizeClosingProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
    float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);
    sizeProgress = clamp(sizeProgress, 0.0, 1.0);

    // Twinkling
    float twinklingProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
    twinklingProgress = clamp(twinklingProgress, 0.0, 1.0);
    float sizeTwinkling = sin(progress * 30.0) * 0.5 + 0.5;
    sizeTwinkling = 1.0 - sizeTwinkling * twinklingProgress;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Final Size
    gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkling;
    gl_PointSize *= 1.0 / -viewPosition.z;

    // For Windows (bc windows gl_PointSize min clamp is 1.0)
    if(gl_PointSize < 1.0) gl_Position = vec4(9999.9);
}

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax) {
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}