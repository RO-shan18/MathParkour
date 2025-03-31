import * as THREE from "three";
import { answercube } from "./answer.js";
import { scene, camera } from "./setup.js";

function movetoUI() {
  if (answercube.length === 0) return;

  let closestCube = null;
  let closestDistance = Infinity;

  answercube.forEach((cube) => {
    const distance = camera.position.distanceTo(cube.mesh.position);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestCube = cube;
    }
  });

  if (!closestCube) return;

  // Remove from Three.js scene
  scene.remove(closestCube.mesh);

  // Properly remove from the array
  const index = answercube.indexOf(closestCube);
  if (index !== -1) {
    answercube.splice(index, 1);
  }

  // Find first empty UI box
  const uiBoxes = document.querySelectorAll(".ui-box");
  for (let box of uiBoxes) {
    if (!box.hasChildNodes()) {
      const div = document.createElement("div");
      div.innerText = closestCube.number;
   
      const colorHex =
        closestCube.color instanceof THREE.Color
          ? `#${closestCube.color.getHexString()}`
          : `#${closestCube.color}`

      div.style.backgroundColor = colorHex;
      div.className = "ui-answer";
      box.appendChild(div);
      break;
    }
  }
}

export { movetoUI };
