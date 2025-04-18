import * as THREE from "three";
import { createequationcube, equationCubes } from "./equation.js";
import { camera, getActualResult, setplayercontrol } from "./setup.js";
import { increaseScore, decreaseScore } from "./score.js";
import { showMessage } from "./message.js";
import {lowerWalls,  Wallaroundanswercube, wallbehindequationcube, removeWalls } from "./wallcreation.js";
import { generateanswercube } from "./answer.js";
import { removeanswercubes, removeequationcube } from "./removeequation.js";
import { createWorld } from "./worldchunk.js";
import { clearSelectedUIBox, getSelectedUIBox } from "./UI.js";

function worldDistance(obj1, obj2) {
    return obj1.position.distanceTo(obj2.position);
}

function replaceQuestionCubeWithLastUIValue() {
    const uiBoxes = document.querySelectorAll(".ui-box");

    // Find last filled UI box
    let lastFilledBox = null;
    for (let i = uiBoxes.length - 1; i >= 0; i--) {
        if (uiBoxes[i].hasChildNodes()) {
            lastFilledBox = uiBoxes[i];
            break;
        }
    }

    if (!lastFilledBox) {
        return;
    }

    // Extract the number and color from the last filled UI box
    const selectedBox = getSelectedUIBox();
    if (!selectedBox || !selectedBox.hasChildNodes()) {
        return;
    }

    const lastValue = selectedBox.innerText.trim();
    const lastColor = window.getComputedStyle(selectedBox.firstChild).backgroundColor;

    if (!lastValue || isNaN(lastValue)) {
        return;
    }

    const questionCube = equationCubes.find(cube => cube.number === "?");
    if (!questionCube) {
        return;
    }

    const distance = worldDistance(camera, questionCube.mesh);
    if (distance > 3) {
        setplayercontrol("");
        return;
    }

    // Update the cube texture
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = lastColor;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "black";
    ctx.font = "bold 150px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(lastValue, size / 2, size / 2);

    const newTexture = new THREE.CanvasTexture(canvas);
    questionCube.mesh.material.map = newTexture;
    questionCube.mesh.material.color.setStyle(lastColor);
    questionCube.mesh.material.needsUpdate = true;
    questionCube.number = parseInt(lastValue, 10);

    selectedBox.innerHTML = "";
    clearSelectedUIBox();  // Reset selection after replacement

    // Validate the equation
    validateEquation(questionCube);
}

function validateEquation(questionCube) {
    const expectedResult = getActualResult();
  
    if (questionCube.number === expectedResult) {
        increaseScore(10);
        showMessage("You are right! ");
        lowerWalls();  

        setTimeout(() => {
            removeequationcube(); 
            removeanswercubes();
            removeWalls();
        }, 2000);
         
        setTimeout(()=>{
            createequationcube(); 
            wallbehindequationcube();
            Wallaroundanswercube();
            generateanswercube();  
            createWorld();  
        }, 5000)
         

    } else {
        decreaseScore(5);
        showMessage("Answer is wrong", true);
    }
  }
  

function clearUIBoxes(){
    const uiBoxes = document.querySelectorAll(".ui-box");

    uiBoxes.forEach(box => box.innerHTML = "");
}

export { replaceQuestionCubeWithLastUIValue, clearUIBoxes};
