import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { setupUIBoxListeners } from "./UI.js";

const minHeight = -16.5;
let actualresult = 0;
let collidableobjects = [];
let worldSize = 50;
let z_cord = 50;
let playercontrol = "";
const worldChunks = []; // Array to track world chunks

export function getplayercontrol() {
  return playercontrol;
}

export function setplayercontrol(value) {
  playercontrol = value;
}

export function getActualResult() {
  return actualresult;
}

export function setActualResult(value) {
  actualresult = value;
}

export function getWorldSize() {
  return worldSize;
}

export function getZCord() {
  return z_cord;
}

export function setZCord(value) {
  z_cord = value;
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
camera.position.set(15, 0, 15);
camera.lookAt(0, 0, 0);

//renderer setup
const renderer =  new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

//lights setup
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 100, camera.position.z + 60);
directionalLight.castShadow = true;
scene.add(directionalLight);

setupUIBoxListeners();

export {minHeight, collidableobjects, camera, renderer, scene, worldSize, actualresult, z_cord, worldChunks};

