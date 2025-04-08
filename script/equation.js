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
    const op = ["+", "-", "*", "/"];
    let equationStr = "";
    let numbers = [];
    let level = operationIndex++;

    function getRandomNum() {
        return Math.floor(Math.random() * 9) + 1;
    }

    function getSafeDivPair() {
      const b = getRandomNum();
      const a = b * getRandomNum(); 
      return [a, b];
  }
  

    // Level 0–3: Single operators
    if (level < 4) {
      const operator = op[level];
      let a, b;
      if (operator === "/") {
          [a, b] = getSafeDivPair();
      } else {
          a = getRandomNum();
          b = getRandomNum();
      }
      equationStr = `${a} ${operator} ${b}`;
      numbers = [a, b];
  }
  
    // Level 4–7: Double same operator
    else if (level < 8) {
      const operator = op[level - 4];
      let a, b, c;
      if (operator === "/") {
          [a, b] = getSafeDivPair();
          let tempResult = a / b;
          [c, b] = getSafeDivPair(); // c / b will be valid
          a = tempResult * b;
          equationStr = `(${a} ${operator} ${b}) ${operator} ${c}`;
      } else {
          [a, b, c] = [getRandomNum(), getRandomNum(), getRandomNum()];
          equationStr = `${a} ${operator} ${b} ${operator} ${c}`;
      }
      numbers = [a, b, c];
  }
  
    // Level 8–11: Mixed double operators
    else if (level < 12) {
      let a = getRandomNum(), b = getRandomNum(), c = getRandomNum();
      let operator1 = op[Math.floor(Math.random() * 4)];
      let operator2 = op[Math.floor(Math.random() * 4)];
  
      if (operator1 === "/") [a, b] = getSafeDivPair();
      if (operator2 === "/") [b, c] = getSafeDivPair(); // ensures clean division even for middle operand
  
      equationStr = `${a} ${operator1} ${b} ${operator2} ${c}`;
      numbers = [a, b, c];
  }
  
    // Level 12–15: Triple same operator with brackets
    else if (level < 16) {
      const operator = op[(level - 12) % 4];
      let a, b, c, d;
  
      if (operator === "/") {
          [a, b] = getSafeDivPair();
          let temp1 = a / b;
          [c, d] = getSafeDivPair();
          let temp2 = c / d;
          a = temp1 * d;
          b = d;
          c = temp2 * getRandomNum();
          d = getRandomNum();
      } else {
          [a, b, c, d] = [getRandomNum(), getRandomNum(), getRandomNum(), getRandomNum()];
      }
  
      equationStr = `((${a} ${operator} ${b}) ${operator} ${c}) ${operator} ${d}`;
      numbers = [a, b, c, d];
  }
  
    // Level 16–19: Triple mixed with brackets
    else if (level < 20) {
      let a = getRandomNum(), b = getRandomNum(), c = getRandomNum(), d = getRandomNum();
      let ops = [];
      for (let i = 0; i < 3; i++) {
          ops.push(op[Math.floor(Math.random() * 4)]);
      }
  
      if (ops[0] === "/") [a, b] = getSafeDivPair();
      if (ops[1] === "/") [b, c] = getSafeDivPair();
      if (ops[2] === "/") [c, d] = getSafeDivPair();
  
      equationStr = `((${a} ${ops[0]} ${b}) ${ops[1]} ${c}) ${ops[2]} ${d}`;
      numbers = [a, b, c, d];
  }
  
    // Level 20+: Four mixed ops with brackets (loop)
    else {
      let [a, b, c, d, e] = [getRandomNum(), getRandomNum(), getRandomNum(), getRandomNum(), getRandomNum()];
      let ops = op.map((o, i) => {
          if (o === "/") {
              [a, b] = getSafeDivPair();
          }
          return o;
      });
  
      equationStr = `(((${a} ${ops[0]} ${b}) ${ops[1]} ${c}) ${ops[2]} ${d}) ${ops[3]} ${e}`;
      numbers = [a, b, c, d, e];
  }
  

    let actualValue;
    try {
        actualValue = eval(equationStr);
    } catch {
        return generateRandomEquation(); // Retry on failure
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
      mesh.position.set(index * 1.1 + 10, -17, camera.position.z - 5);
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


  