import * as THREE from "three";
import {checkcollision} from "./collision.js"
import {camera} from "./setup.js"
import {digwall} from "./digwall.js";

const moveSpeed = 0.2;
const moveTarget = new THREE.Vector3(); // Store the target position
moveTarget.copy(camera.position);

// Event listener for movement input
window.addEventListener("keydown", (event) => {
  let tempMoveTarget = moveTarget.clone();
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0; // Prevent vertical movement

  switch (event.key.toLowerCase()) {
    case "w":
      tempMoveTarget.addScaledVector(direction, moveSpeed);
      break;
    case "s":
      tempMoveTarget.addScaledVector(direction, -moveSpeed);
      break;
    case "a":
      const left = new THREE.Vector3().crossVectors(camera.up, direction).normalize();
      tempMoveTarget.addScaledVector(left, moveSpeed);
      break;
    case "d":
      const right = new THREE.Vector3().crossVectors(direction, camera.up).normalize();
      tempMoveTarget.addScaledVector(right, moveSpeed);
      break;
    case "arrowleft":
      camera.rotation.y += 0.03;
      break;
    case "arrowright":
      camera.rotation.y -= 0.03;
      break;
    case "arrowup": 
      tempMoveTarget.y += 0.5; // Slightly increase height
      break;
    case "arrowdown": 
      tempMoveTarget.y -= 0.5; // Slightly decrease height
      break;
    case "q":
      digwall();
      break;
  }

  if(!checkcollision(tempMoveTarget)){
    moveTarget.copy(tempMoveTarget);
  }
});

moveTarget.y = -17;

export {moveTarget, moveSpeed}