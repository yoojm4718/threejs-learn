varying vec3 vColor;

void main() {
    float strength = pow(1.0 - distance(gl_PointCoord, vec2(0.5)), 10.0);

    // Final
    vec3 color = mix(vec3(0.0), vColor, strength);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}