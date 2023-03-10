uniform float time;
uniform sampler2D uTexture;
uniform float sc;
uniform float ba;

varying float pulse;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float lines(vec2 uv, float offset){
  return smoothstep(
    0., sc + offset*0.9,
    abs(0.9*sin(uv.x*10.) + offset*0.1)
  );
}

mat2 rotate2d(float angle){
  return mat2(
    cos(angle), -sin(angle),
    sin(angle), cos(angle)

  );
}
void main() {
  float n = noise(vPosition+time/5.);
  vec3 color1 = vec3(0.6,0.1,0.9);
  // vec3 color2 = vec3(sc*n,sc*n*0.5,sc*n);
  vec3 color2 = vec3(n,n*0.5,n);
  vec3 color3 = vec3(0.0,0.2,1.);
  vec3 color4 = vec3(1.0,0.0,0.0);
  vec2 baseUV = rotate2d(n)*vPosition.xy*0.1;
  float basePattern = lines(baseUV, 0.1);
  float secondPattern = lines(baseUV, 0.2);
  float thirdPattern = lines(baseUV, 0.3);

  vec3 baseColor = mix(color2,color1,basePattern);
  vec3 secondBaseColor = mix(baseColor,color3,secondPattern);
  vec3 thirdBaseColor = mix(secondBaseColor,color4,thirdPattern);
    // gl_FragColor = vec4(0.,0.,1., 1.);

    // vec4 myimage = texture(
    //     uTexture,
    //     vUv + 0.03*sin(vUv*1. + time) 
    // );

    //  vec4 myimage = texture(
    //     uTexture,
    //     vUv + 0.003*cnoise(vec4((vUv.x*50. - time)*0.1), vec4(1.0)) 
    // );

    // float sinePulse = 0.01*cnoise(vec4((vUv.x*50. - time)*0.1), vec4(1.0)) ;
    gl_FragColor = vec4( vec3(thirdBaseColor),1.);
    // gl_FragColor = vec4( sinePulse,0.,0.,1.);
    // gl_FragColor = myimage;
    // gl_FragColor = vec4( pulse,0.,0.,1.);
}