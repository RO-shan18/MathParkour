import * as THREE from "three";
import {collidableobjects, scene, getActualResult, setActualResult, camera} from "./setup.js";

const equationCubes = []; 
// Function to create texture with numbers
function createNumberTexture(number) {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
  
    // Background color
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, size, size);
  
    // Number style
    ctx.fillStyle = "black";
    ctx.font = "bold 150px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(number, size / 2, size / 2);
  
    return new THREE.CanvasTexture(canvas);
  }
  
  function generateRandomEquation() {
    const operators = ["+", "-", "*", "/"];
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const equals = "=";
    const result = "?";

    let actualValue;
  
    if (operator === "+") {
      actualValue = num1 + num2;
    } else if (operator === "-") {
      actualValue = num1 - num2;
    } else if (operator === "*") {
      actualValue = num1 * num2;
    } else if (operator === "/") {
      actualValue = num1 / num2;
    }

    setActualResult(actualValue);
  
    const equation = [num1, operator, num2, equals, result];
  
    return equation;
  }
  
  function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16); // Generate random hex color
  }
  
  function createequationcube() {
    const equation = generateRandomEquation();
    let questionCube = null;
  
    equation.forEach((term, index) => {
      const texture = createNumberTexture(term.toString());
      const color = new THREE.Color(getRandomColor());
  
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        color: color,
      });
  
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(index * 1.1 + 32, -17, camera.position.z - 10);
      scene.add(mesh);

      const cubeData = { mesh, color, number: term };
      equationCubes.push(cubeData);

      if (term === "?") {
          questionCube = cubeData; // Store the '?' cube
      }
  
      //boundingbox for equation cube
      const boundingbox = new THREE.Box3().setFromObject(mesh);
      collidableobjects.push(boundingbox);
    });

    return questionCube;
  }

createequationcube();

export {createNumberTexture, getRandomColor, createequationcube, equationCubes};


  