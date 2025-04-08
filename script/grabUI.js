import * as THREE from "three";
import { answercube } from "./answer.js";
import { scene, camera, collidableobjects, setplayercontrol } from "./setup.js";

function movetoUI() {
  if (answercube.length === 0) return;

  let closestCube = null;
  let closestDistance = Infinity;
  let closestIndex = -1;

  // Find the closest answer cube
  answercube.forEach((cube, index) => {
    const distance = camera.position.distanceTo(cube.mesh.position);
    if (distance < closestDistance && distance <= 1.5) {
      closestDistance = distance;
      closestCube = cube;
      closestIndex = index;
    }

  });

  if (!closestCube || closestIndex === -1) return;
  scene.remove(closestCube.mesh);
  answercube.splice(closestIndex, 1);

  const bboxIndex = collidableobjects.indexOf(closestCube.boundingBox);
  if (bboxIndex !== -1) {
    collidableobjects.splice(bboxIndex, 1);  
  }

  const uiBoxes = document.querySelectorAll(".ui-box");
  for (let box of uiBoxes) {
    if (!box.hasChildNodes()) {
      const div = document.createElement("div");
      div.innerText = closestCube.number;

      const colorHex =
        closestCube.color instanceof THREE.Color
          ? `#${closestCube.color.getHexString()}`
          : `#${closestCube.color}`;

      div.style.backgroundColor = colorHex;
      div.className = "ui-answer";
      box.appendChild(div);
      break;
    }
  }
}

export { movetoUI};
