import * as THREE from "three";
import { collidableobjects, scene } from "./setup.js";

let WallInstance;
const boundingboxes = [];
const maxInstances = 2000;
const wallPositions = [];

const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xaa4a44 });

WallInstance = new THREE.InstancedMesh(wallGeometry, wallMaterial, maxInstances);
scene.add(WallInstance);

function wallEquation(xpos, ypos, zpos, index) {
    const dummy = new THREE.Object3D();
    dummy.position.set(xpos, ypos, zpos);
    dummy.updateMatrix();
    WallInstance.setMatrixAt(index, dummy.matrix);
    WallInstance.instanceMatrix.needsUpdate = true;

    wallPositions[index] = { x: xpos, y: ypos, z: zpos };

    // Store bounding box for collision detection
    const boundingbox = new THREE.Box3().setFromCenterAndSize(
        dummy.position.clone(),
        new THREE.Vector3(1, 1, 1)
    );

    collidableobjects.push(boundingbox);
    boundingboxes[index] = boundingbox;  // Store at correct index
}

export { wallEquation, WallInstance, boundingboxes, wallPositions};
