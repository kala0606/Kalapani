// Define the shaders
const vertexShader = `
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
`;

const fragmentShader = `
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
  vec3 color1 = vec3(0.5,0.5,0.5);
//   vec3 color2 = vec3(sc*n,sc*n,sc*n);
  vec3 color2 = vec3(1.0,1.0,1.0);
  vec3 color3 = vec3(0.0,0.0,0.0);
  vec3 color4 = vec3(1.0,1.0,1.0);
  vec2 baseUV = rotate2d(n)*vPosition.xy*0.1;
  float basePattern = lines(baseUV, 0.1);
  float secondPattern = lines(baseUV, 0.1);
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
`;

// // create a new AudioContext
// const audioContext = new AudioContext();

// // create a new AnalyserNode to perform the FFT
// const analyser = audioContext.createAnalyser();

// // set the FFT size (number of samples)
// analyser.fftSize = 2048;

// // request access to the user's microphone
// navigator.mediaDevices.getUserMedia({ audio: true })
//   .then(stream => {
//     // connect the microphone input to the analyser
//     const micSource = audioContext.createMediaStreamSource(stream);
//     micSource.connect(analyser);

//     // create a new Float32Array to hold the FFT data
//     const fftData = new Float32Array(analyser.frequencyBinCount);

//     // update the FFT data and visualize it
//     function updateFFT() {
//       // get the current FFT data
//       analyser.getFloatFrequencyData(fftData);

//       // visualize the FFT data however you like
//       // for example, log-scale spectrogram:
//     //   const canvas = document.getElementById('fft-canvas');
//     //   const ctx = canvas.getContext('2d');
//     //   const width = canvas.width;
//     //   const height = canvas.height;

//     //   ctx.clearRect(0, 0, width, height);

//       for (let i = 0; i < fftData.length; i++) {
//         const sum = fftData.reduce((acc, val) => acc + val);
//         const avg = sum / fftData.length;
//         console.log('Average loudness:', avg);
//         sc = -avg/255;
//     //     const x = Math.log2(i / fftData.length) * width;
//     //     const y = (1 - (fftData[i] / -100)) * height;
//     //     ctx.fillStyle = `hsl(${i / fftData.length * 360}, 100%, 50%)`;
//     //     ctx.fillRect(x, y, 1, 1);
//       }

//       // update the FFT data again on the next animation frame
//       requestAnimationFrame(updateFFT);
//     }

//     // start the FFT analysis
//     updateFFT();
//   })
//   .catch(error => {
//     console.error('Error getting microphone input:', error);
//   });


//

var analyser = new Tone.Analyser("fft", 16);
analyser.smoothing = 0.9;
// Tone.Master.connect(analyser);

const meter = new Tone.Meter();
const mic = new Tone.UserMedia().connect(meter);
mic.open().then(() => {
	// promise resolves when input is available
	console.log("mic open");
	// print the incoming mic levels in decibels
	setInterval(() => console.log(meter.getValue()), 100);
}).catch(e => {
	// promise is rejected when the user doesn't have or allow mic access
	console.log("mic not open");
});

mic.connect(analyser);


var t = 0; var sc = Math.random(); var ba = Math.random();

// Initialize the scene, camera and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the sphere
var geometry = new THREE.SphereBufferGeometry(5.5, 100, 100);
var material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: "f", value: 0 },
      sc: { type: "f", value: 0 },
      ba: { type: "f", value: 0 },
      // mountain: {type: "t", value: new THREE.TextureLoader().load(mountain)},
      resolution: { type: "v4", value: new THREE.Vector4() },
      uvRate1: {
        value: new THREE.Vector2(1, 1)
      }
    },
    // wireframe: true,
    // transparent: true,
    vertexShader,
    fragmentShader 
  });

var sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);



// Set the uniforms for the shader
// var uniforms = {
//   resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
//   time: { value: 0.0 }
// };
// material.uniforms = uniforms;

// Render the scene
function render() {
  requestAnimationFrame(render);
//   uniforms.time.value += 0.1;
    t += 0.05;

    const energies = analyser.getValue();
    sc = (energies[3]/-100)

    // sc+=0.005;
    material.uniforms.time.value = t;
    material.uniforms.sc.value = sc;
    // material.uniforms.ba.value = ba;
    renderer.render(scene, camera);
}
render();
