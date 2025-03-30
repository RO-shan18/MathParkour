import * as THREE from "three";
import {wallEquation} from "./wall.js"
import {camera} from "./setup.js"

function Wallaroundcube() {
    //create wall behind the equation
    let idx = 0;
    for (let x = 0; x < 12; x++) {
      for (let y = 0; y < 5; y++) {
        wallEquation(x + 30, -17 + y, camera.position.z - 13, idx++);
      }
    }
  
    //create fourside wall around the answerblock
    let idx2 = 0;
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 5; y++) {
        wallEquation(
          camera.position.x + 17,
          -17 + y,
          camera.position.z + 17 + x,
          idx2++
        );
      }
    }
    let idx3 = 0;
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 5; y++) {
        wallEquation(
          camera.position.x + 17 + x,
          -17 + y,
          camera.position.z + 17,
          idx3++
        );
      }
    }
    let idx4 = 0;
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 5; y++) {
        wallEquation(
          camera.position.x + 25,
          -17 + y,
          camera.position.z + 17 + x,
          idx4++
        );
      }
    }
    let idx5 = 0;
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 5; y++) {
        wallEquation(
          camera.position.x + 17 + x,
          -17 + y,
          camera.position.z + 25,
          idx5++
        );
      }
    }
  }

  Wallaroundcube();
  