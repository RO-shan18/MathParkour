import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const minHeight = -17;
let actualresult = 0;
let collidableobjects = [];
const worldSize = 200;

export function getActualResult() {
  return actualresult;
}

export function setActualResult(value) {
  actualresult = value;
}

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color("skyblue");

//camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Camera position
camera.position.set(32, 0, 32);
camera.lookAt(0, 0, 0);

//renderer setup
const renderer =  new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

//lights setup
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

export {minHeight, collidableobjects, camera, renderer, scene, worldSize, actualresult};

