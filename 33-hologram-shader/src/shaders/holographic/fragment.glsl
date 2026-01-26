uniform float uTime;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    float stripes = pow(mod((vPosition.y - uTime * 0.02) * 20.0, 1.0), 3.0);

    // Normal
    // varying은 기본적으로 interpolate 되기 때문에, vertex와 vertex 사이의 fragment는 자동적으로 normal 값이 1이 아니게 됨!
    // 따라서 vertex shader에서 넘어올때는 vertex에 대한 값이므로 이미 normalize된 1의 길이를 가지지만,
    // 그려지는 모든 점을 다루는 fragment shader에서는 넘어오는 vNormal 값이 1보다 작을 수 있어서, fresnel이 제대로 적용되지 않고
    // vertex와 vertex 사이에 이상한 패턴이 그려지는 효과가 발생!
    // 이걸 없애기 위해, fragment shader에서 한 번 더 normalize 해주는 작업이 필요하다!
    vec3 normal = normalize(vNormal);
    // 안보이는 backside에도 적용하기 위해 (기본적으로 방향이 같아지므로 2.0이 되어버림)
    // backside라면 normal 값 자체를 invert 해버림
    // gl_FrontFacing은 현재 fragment가 카메라 기준 front side인지 boolean으로 알려줌
    if(!gl_FrontFacing) normal *= -1.0;

    // Fresnel Effect
    vec3 viewDirection = normalize(vPosition - cameraPosition); // 카메라 -> vertex unit 벡터
    // dot product 계산해서 0이면 수직이므로 밝고, -1이면 반대이므로 제일 어둡게
    // normal은 기본적으로 unit vector
    float fresnel = dot(viewDirection, normal) + 1.0; // 최종 적용 시에는 0~-1의 범위를 1~0으로 만들기
    fresnel = pow(fresnel, 2.0); // 또 power를 추가해서 빛이 센 부분이 더 바깥쪽으로 몰리게 

    // Falloff
    // 완전 가장자리에는 또 약간의 fade out을 주기 위해 사용
    float falloff = smoothstep(0.8, 0.0, fresnel);

    // Holographic
    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25;
    holographic *= falloff;

    // Final color
    gl_FragColor = vec4(uColor, holographic);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}