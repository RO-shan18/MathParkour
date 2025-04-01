import * as THREE from "three";
import { collidableobjects, scene } from "./setup.js";



let WallInstance;
const boundingboxes = [];
const maxInstances = 2000;
const wallPositions = [];

const textureLoader = new THREE.TextureLoader();
const wallTexture = textureLoader.load("Assets/textures/wall.png"); // Update with your actual texture path
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(1, 1);

const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
const wallMaterial = new THREE.MeshStandardMaterial({ 
    map: wallTexture,
    roughness: 1, 
    metalness: 0.1  
});

WallInstance = new THREE.InstancedMesh(wallGeometry, wallMaterial, maxInstances);
scene.add(WallInstance);

function wallEquation(xpos, ypos, zpos, index) {
    const dummy = new THREE.Object3D();
    dummy.position.set(xpos, ypos, zpos);
    dummy.updateMatrix();
    WallInstance.setMatrixAt(index, dummy.matrix);
    WallInstance.instanceMatrix.needsUpdate = true;

    wallPositions[index] = { x: xpos, y: ypos, z: zpos };

    const boundingbox = new THREE.Box3().setFromCenterAndSize(
        dummy.position.clone(),
        new THREE.Vector3(1, 1, 1)
    );

    collidableobjects.push(boundingbox);
    boundingboxes[index] = boundingbox;  
}

export { wallEquation, WallInstance, boundingboxes, wallPositions};
