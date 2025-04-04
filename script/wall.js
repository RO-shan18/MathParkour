import * as THREE from "three";
import { collidableobjects, scene } from "./setup.js";

const maxInstances = 2000;
let WallInstance = null;
let wallGeometry = null;
let wallMaterial = null;
let wallTexture = null;
const boundingboxes = [];
const wallPositions = [];

export function initWalls() {
  if (WallInstance) {
    disposeWalls();
  }

  boundingboxes.length = 0;
  wallPositions.length = 0;

  collidableobjects.push(...boundingboxes);

  if (!wallTexture) {
    const textureLoader = new THREE.TextureLoader();
    wallTexture = textureLoader.load("Assets/textures/wall.png");
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(1, 1);
  }

  if (!wallGeometry) {
    wallGeometry = new THREE.BoxGeometry(1, 1, 1);
  }

  if (!wallMaterial) {
    wallMaterial = new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 1,
      metalness: 0.1,
    });
  }

  WallInstance = new THREE.InstancedMesh(wallGeometry, wallMaterial, maxInstances);
  scene.add(WallInstance);
}

export function disposeWalls() {
  if (WallInstance) {
    scene.remove(WallInstance);
    WallInstance = null;
  }
}

export function fullCleanup() {
  disposeWalls();
  
  if (wallGeometry) {
    wallGeometry.dispose();
    wallGeometry = null;
  }
  
  if (wallMaterial) {
    wallMaterial.dispose();
    wallMaterial = null;
  }
  
  if (wallTexture) {
    wallTexture.dispose();
    wallTexture = null;
  }
  
  boundingboxes.length = 0;
  wallPositions.length = 0;
}

export function wallEquation(xpos, ypos, zpos, index) {
  if (!WallInstance) initWalls();
  
  const dummy = new THREE.Object3D();
  dummy.position.set(xpos, ypos, zpos);
  dummy.updateMatrix();
  WallInstance.setMatrixAt(index, dummy.matrix);
  WallInstance.instanceMatrix.needsUpdate = true;

  if (index >= WallInstance.count) {
    WallInstance.count = index + 1;
  }

  wallPositions[index] = { x: xpos, y: ypos, z: zpos };

  const boundingbox = new THREE.Box3().setFromCenterAndSize(
    dummy.position.clone(),
    new THREE.Vector3(1, 1, 1)
  );

  collidableobjects.push(boundingbox);
  boundingboxes[index] = boundingbox;  
}

export { WallInstance, boundingboxes, wallPositions };