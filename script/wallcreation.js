import * as THREE from "three";
import { wallEquation, wallPositions,WallInstance } from "./wall.js";
import { camera, worldSize, scene } from "./setup.js";

let globalidx = 0;
function wallbehindequationcube() {

    for (let x = 0; x < worldSize; x++) {
        for (let y = 0; y < 5; y++) {
            wallEquation(x, -17 + y, camera.position.z - 13, globalidx++);
        }
    }
}

function Wallaroundanswercube() {

  // Store all wall positions
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 5; y++) {
        wallEquation(
          camera.position.x + 17,
          -17 + y,
          camera.position.z + 17 + x,
          globalidx++
        );
      }
    }
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 5; y++) {
        wallEquation(
          camera.position.x + 17 + x,
          -17 + y,
          camera.position.z + 17,
          globalidx++
        );
      }
    }

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 5; y++) {
        wallEquation(
          camera.position.x + 25,
          -17 + y,
          camera.position.z + 17 + x,
          globalidx++
        );
      }
    }

    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 5; y++) {
        wallEquation(
          camera.position.x + 17 + x,
          -17 + y,
          camera.position.z + 25,
          globalidx++
        );
      }
    }
}

function lowerWalls() {
  if (wallPositions.length === 0) {
      return;
  }

  let interval = setInterval(() => {
      let allWallsDown = true;
      const dummy = new THREE.Object3D();

      wallPositions.forEach((pos, index) => {
          if (pos.y > -40) {  
              pos.y -= 0.5;
              allWallsDown = false;
          }

          dummy.position.set(pos.x, pos.y, pos.z);
          dummy.updateMatrix();
          WallInstance.setMatrixAt(index, dummy.matrix);
      });

      WallInstance.instanceMatrix.needsUpdate = true; 

      if (allWallsDown) {
          clearInterval(interval);
      }
  }, 300);
}

wallbehindequationcube();
Wallaroundanswercube();

export { wallbehindequationcube, lowerWalls };
