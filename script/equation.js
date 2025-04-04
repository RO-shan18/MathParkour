import * as THREE from "three";
import {collidableobjects, scene, setActualResult, camera} from "./setup.js";

const equationCubes = []; 
let operationIndex = 0; // Tracks the level progression

const operationSequence = ["+", "+", "-", "-", "*", "*", "/", "/"]; // Repeating pattern
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
    let numOperands = 2; 
    let numbers = [];
    let equationStr = "";
    
  
    let fixedOperators = ["+", "-", "*", "/"];
    let operatorIndex = operationIndex % fixedOperators.length; 
    let operator = fixedOperators[operatorIndex]; 
    operationIndex++; 


    let num1, num2;
    if (operator === "/") {
        num2 = Math.floor(Math.random() * 9) + 1; 
        num1 = num2 * (Math.floor(Math.random() * 9) + 1); 
    } else {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
    }

    numbers.push(num1, num2);
    equationStr = `${num1} ${operator} ${num2}`;

    if (operationIndex >= 6) {
        numOperands = Math.min(3 + Math.floor(operationIndex / 4), 5); 
        let availableOperators = ["+", "-", "*", "/"];

        for (let i = 2; i < numOperands; i++) {
            let nextOperator = availableOperators[Math.floor(Math.random() * availableOperators.length)];
            let nextNumber = Math.floor(Math.random() * 10) + 1;

            if (nextOperator === "/") {
                nextNumber = Math.floor(Math.random() * 9) + 1;
            }

            equationStr += ` ${nextOperator} ${nextNumber}`;
            numbers.push(nextNumber);
        }
    }

    if (operationIndex >= 10) {
        equationStr = `(${numbers[0]} ${operator} ${numbers[1]})`;
        for (let i = 2; i < numbers.length; i++) {
            let nextOperator = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
            equationStr = `(${equationStr} ${nextOperator} ${numbers[i]})`;
        }
    }

    let actualValue;
    try {
        actualValue = eval(equationStr); 
    } catch (e) {
        actualValue = null; 
    }

    if (actualValue === null || isNaN(actualValue)) {
        return generateRandomEquation(); 
    }

    setActualResult(actualValue);
    
    return equationStr.split(" ").concat("=", "?"); 
}

  
  function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16); 
  }

  function clearOldEquations() {
    equationCubes.forEach(cubeData => {
        scene.remove(cubeData.mesh);
    });
    
    collidableobjects.length = 0;
    equationCubes.length = 0;
}
  
  function createequationcube() {
    clearOldEquations();
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
      mesh.position.set(index * 1.1 + 32, -17, camera.position.z - 5);
      scene.add(mesh);

      const cubeData = { mesh, color, number: term };
      equationCubes.push(cubeData);

      if (term === "?") {
          questionCube = cubeData; 
      }
  
      //boundingbox for equation cube
      const boundingbox = new THREE.Box3().setFromObject(mesh);
      collidableobjects.push(boundingbox);
    });

    return questionCube;
  }

createequationcube();

export {createNumberTexture, getRandomColor, createequationcube, equationCubes};


  