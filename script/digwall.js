import * as THREE from "three";
import { boundingboxes, WallInstance } from "./wall.js";
import { collidableobjects, camera } from "./setup.js";

function findClosestWall() {
    let closestIndex = -1;
    let closestDistance = Infinity;
    const cameraPosition = camera.position.clone();

    boundingboxes.forEach((box, index) => {
        if (box) { 
            const center = new THREE.Vector3();
            box.getCenter(center);
            const distance = cameraPosition.distanceTo(center);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        }
    });

    return closestIndex;
}


function digwall() {
    const index = findClosestWall();
    if (index === -1) return;

    if (boundingboxes[index]) {
        const boxIndex = collidableobjects.indexOf(boundingboxes[index]);
        if (boxIndex !== -1) {
            collidableobjects.splice(boxIndex, 1);
        }
        boundingboxes[index] = null;  
    }

    const dummy = new THREE.Object3D();
    dummy.position.set(9999, 9999, 9999); 
    dummy.updateMatrix();
    WallInstance.setMatrixAt(index, dummy.matrix);
    WallInstance.instanceMatrix.needsUpdate = true;
}


export { digwall };
