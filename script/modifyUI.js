import * as THREE from "three";
import { equationCubes } from "./equation.js";
import { camera, getActualResult } from "./setup.js";
import { increaseScore, decreaseScore } from "./score.js";
import { showMessage } from "./message.js";
import {lowerWalls } from "./wallcreation.js";

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
    const lastValue = lastFilledBox.innerText.trim();
    const lastColor = window.getComputedStyle(lastFilledBox.firstChild).backgroundColor;

    if (!lastValue || isNaN(lastValue)) {
        return;
    }

    // Find the '?' cube in the equation
    const questionCube = equationCubes.find(cube => cube.number === "?");
    if (!questionCube) {
        return;
    }

    // Check if player is close to the '?' cube
    const distance = worldDistance(camera, questionCube.mesh);

    if (distance > 5) {
        return;
    }


    // Store previous '?' cube properties in case of reset
    const previousTexture = questionCube.mesh.material.map;
    const previousColor = questionCube.mesh.material.color.clone();

    // Update the texture of the '?' cube
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

    // Remove last filled UI box content
    lastFilledBox.innerHTML = "";

    // Validate the equation
    validateEquation(questionCube);
}

function validateEquation(questionCube) {
    const expectedResult = getActualResult();

    if (questionCube.number === expectedResult) {
        increaseScore(10);
        showMessage("You are right! Level 1 done");
        lowerWalls();
        
    } else {
        decreaseScore(5);
        showMessage("Answer is wrong", true);
    }
}

export { replaceQuestionCubeWithLastUIValue };
