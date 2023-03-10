uniform float time;
uniform float sc;
uniform float ba;
varying float pulse;

varying vec3 vPosition;

uniform vec2 pixels;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}