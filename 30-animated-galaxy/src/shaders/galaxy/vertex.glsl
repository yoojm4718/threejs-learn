attribute float aScale;
attribute vec3 aRandomness;

uniform float uSize;
uniform float uTime;

varying vec3 vColor;

void main() {
    /**
     * Position
     */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Spin
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    // 중심으로부터의 거리에 반비례하도록! (중앙에 가까울 수록 빠르게 움직임)
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2; 
    angle += angleOffset;

    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    // Randomness
    // 기존 코드에서는 spin을 주기 전에 random을 넣었기 때문에, ribbon effect가 발생
    // 따라서 random 값을 attribute로 전달 받은 다음 spin 이후에 적용!
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    /**
     * Size
     */
    gl_PointSize = uSize * aScale;
    gl_PointSize *= ( 1.0 / - viewPosition.z );

    // Varying
    vColor = color;
}