import { answercube } from "./answer.js";
import { equationCubes } from "./equation.js";
import { scene } from "./setup.js";

function removeanswercubes(){
    answercube.forEach((cube =>{
        scene.remove(cube.mesh);
    })) 
}

function removeequationcube(){
    equationCubes.forEach((cube)=>{
        scene.remove(cube.mesh);
    })
}

export {removeanswercubes, removeequationcube};