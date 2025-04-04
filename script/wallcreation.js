import * as THREE from "three";
import { wallEquation, wallPositions, WallInstance, boundingboxes, initWalls, fullCleanup} from "./wall.js";
import { camera, worldSize, collidableobjects} from "./setup.js";
import { clearUIBoxes } from "./modifyUI.js";

function wallbehindequationcube() {
  let globalidx = 0;
  for (let x = 0; x < worldSize+33; x++) {
    for (let y = 0; y < 5; y++) {
      wallEquation(x-33, -17 + y, camera.position.z - 7, globalidx++);
    }
  }
}


function Wallaroundanswercube() {
 
  let globalidx2 = 0;
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 5; y++) {
      wallEquation(
        camera.position.x + 13,
        -17 + y,
        camera.position.z + 10 + x,
        globalidx2++
      );
    }
  }
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 5; y++) {
      wallEquation(
        camera.position.x + 13 + x,
        -17 + y,
        camera.position.z + 10,
        globalidx2++
      );
    }
  }

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 5; y++) {
      wallEquation(
        camera.position.x + 21,
        -17 + y,
        camera.position.z + 10 + x,
        globalidx2++
      );
    }
  }

  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 5; y++) {
      wallEquation(
        camera.position.x + 13 + x,
        -17 + y,
        camera.position.z + 18,
        globalidx2++
      );
    }
  }
}

function lowerWalls() {
  if (!WallInstance || wallPositions.length === 0) {
    return;
  }

  let interval = setInterval(() => {
    if (!WallInstance) {
      clearInterval(interval);
      return;
    }

    let allWallsDown = true;
    const dummy = new THREE.Object3D();

    wallPositions.forEach((pos, index) => {
      if (pos.y > -40) {
        pos.y -= 0.5;
        allWallsDown = false;

        dummy.position.set(pos.x, pos.y, pos.z);
        dummy.updateMatrix();
        WallInstance.setMatrixAt(index, dummy.matrix);
      }

      if (pos.y <= -30 && boundingboxes[index]) {
        const boxIndex = collidableobjects.indexOf(boundingboxes[index]);
        if (boxIndex !== -1) {
          collidableobjects.splice(boxIndex, 1);
        }
        delete boundingboxes[index];
      }
    });

    if (WallInstance) {
      WallInstance.instanceMatrix.needsUpdate = true;
    }

    if (allWallsDown) {
      clearInterval(interval);
    }
  }, 300);
}

function removeWalls() {
  initWalls(); 
  fullCleanup();

  setTimeout(() => {
    clearUIBoxes();
  }, 200);
}

wallbehindequationcube();
Wallaroundanswercube();

export { wallbehindequationcube, lowerWalls, Wallaroundanswercube, removeWalls};
