import * as THREE from "three";
import { boundingboxes, WallInstance } from "./wall.js";
import { collidableobjects, camera, setplayercontrol } from "./setup.js";

function findClosestWall() {
    let closestIndex = -1;
    let closestDistance = Infinity;
    const cameraPosition = camera.position.clone();

    boundingboxes.forEach((box, index) => {
        if (box) {  
            const center = new THREE.Vector3();
            box.getCenter(center);
            const distance = cameraPosition.distanceTo(center);

            // Get the forward direction of the camera
            const cameraDirection = new THREE.Vector3();
            camera.getWorldDirection(cameraDirection);
            
            // Vector from camera to block
            const toBlock = new THREE.Vector3().subVectors(center, cameraPosition).normalize();
            
            // Check if the block is within the forward view (dot product)
            const angle = cameraDirection.dot(toBlock); // 1 = perfectly ahead, -1 = behind

            // Ensure the wall is directly in front (angle close to 1) & within 1 meter
            if (distance < closestDistance && distance <= 1.5 && angle > 0.8) {
                closestDistance = distance;
                closestIndex = index;
                setplayercontrol("dig")
            }

        }
    });

    return closestIndex;
}


function digwall() {
    const index = findClosestWall();
    if (index === -1 || !boundingboxes[index]) return; // Ensure it's a valid index

    // Remove the bounding box from collision detection
    const boxIndex = collidableobjects.indexOf(boundingboxes[index]);
    if (boxIndex !== -1) {
        collidableobjects.splice(boxIndex, 1);
    }
    boundingboxes[index] = null; // Mark this wall as removed

    // Move the instance far away instead of deleting it
    const dummy = new THREE.Object3D();
    dummy.position.set(9999, 9999, 9999); // Move it far so it's effectively "gone"
    dummy.updateMatrix();
    WallInstance.setMatrixAt(index, dummy.matrix);
    WallInstance.instanceMatrix.needsUpdate = true;

}


export { digwall, findClosestWall };
