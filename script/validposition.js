import * as THREE from "three";
import { answercube } from "./answer.js";
import { equationCubes } from "./equation.js";
import {camera} from "./setup.js";
import { wallPositions } from "./wall.js";


// Function to check if a position is too close to excluded objects
function isPositionValid(position) {
  
  //check for camerapostion
  const cameraPos = camera.position;
  if (position.distanceTo(cameraPos) < 10) return false;
  
  // Check distance to answer cubes
  for (const cube of answercube) {
    if (position.distanceTo(cube.mesh.position) < 3) return false;
  }
  
  // Check distance to equation cubes
  for (const cube of equationCubes) {
    if (position.distanceTo(cube.mesh.position) < 3) return false;
  }

  // // Check distance to wall positions (wallbehindequation and wallaroundanswercube)
  for (const wallPos of wallPositions) {
    const wallPosition = new THREE.Vector3(wallPos.x, wallPos.y, wallPos.z);
    if (position.distanceTo(wallPosition) < 3) return false;
  }
  
  return true;
}

export {isPositionValid};
