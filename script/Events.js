import * as THREE from "three";
import { checkcollision } from "./collision.js";
import { camera, getplayercontrol, setplayercontrol} from "./setup.js";
import { digwall, findClosestWall } from "./digwall.js";
import { movetoUI } from "./grabUI.js";
import { replaceQuestionCubeWithLastUIValue } from "./modifyUI.js";
import { updateScoreDisplay } from "./score.js";

const moveSpeed = 0.1;
const moveTarget = new THREE.Vector3();
moveTarget.copy(camera.position);

const keys = {};
let isMouseLocked = false;
let isMouseHeld = false;

// Add event listeners for movement
document.addEventListener("DOMContentLoaded", () => {
  updateScoreDisplay();
});


// Hide instructions on Enter key
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    document.getElementById("instructions").style.display = "none";
  }
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (keys[key]) return; 

  keys[key] = true; 
  if (key === "q") {
    findClosestWall();
    if(getplayercontrol() === "dig"){
      setplayercontrol("dig")
      digwall();
    };

    movetoUI()
    if(getplayercontrol() === "grab"){
      setplayercontrol("grab")
      movetoUI();
    };

    replaceQuestionCubeWithLastUIValue();
    if(getplayercontrol() === "put"){
      setplayercontrol("put");
      replaceQuestionCubeWithLastUIValue();
    }
  }
});

window.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

// Prevent default drag behavior when clicking
document.addEventListener("mousedown", (event) => {
  event.preventDefault();
  isMouseHeld = true; 
});

// Detect when mouse button is released
document.addEventListener("mouseup", () => {
  isMouseHeld = false; 
});

// Enable or disable mouse movement based on pointer lock state
document.addEventListener("pointerlockchange", () => {
  isMouseLocked = document.pointerLockElement === document.body;
});

// Enable pointer lock on click
document.addEventListener("click", (event) => {
  if (!isMouseLocked) {
    document.body.requestPointerLock();
    event.preventDefault(); 
    
  }
});

// Capture mouse movement only when pointer is locked and mouse is not held
document.addEventListener("mousemove", (event) => {
  if (isMouseLocked && !isMouseHeld) {
    // Ignore movement if mouse is held
    const sensitivity = 0.001;
     //Horizontal rotation
    camera.rotation.y -= event.movementX * sensitivity;
     //Vertical rotation
    // camera.rotation.x -= event.movementY * sensitivity;  

    camera.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, camera.rotation.x)
    );
  }
});

// Function to handle movement in each frame
function updateMovement() {
  let tempMoveTarget = moveTarget.clone();
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0; 

  if (keys["w"]) tempMoveTarget.addScaledVector(direction, moveSpeed);
  if (keys["s"]) tempMoveTarget.addScaledVector(direction, -moveSpeed);
  if (keys["a"]) {
    const left = new THREE.Vector3()
      .crossVectors(camera.up, direction)
      .normalize();
    tempMoveTarget.addScaledVector(left, moveSpeed);
  }
  if (keys["d"]) {
    const right = new THREE.Vector3()
      .crossVectors(direction, camera.up)
      .normalize();
    tempMoveTarget.addScaledVector(right, moveSpeed);
  }

  tempMoveTarget.y = Math.min(tempMoveTarget.y, 17.5);

  if (!checkcollision(tempMoveTarget)) {
    moveTarget.copy(tempMoveTarget);
  }

  requestAnimationFrame(updateMovement); 
}

moveTarget.y = -17;
updateMovement(); 

export { moveTarget, moveSpeed };
