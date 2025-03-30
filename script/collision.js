import * as THREE from "three";
import {collidableobjects} from "./setup.js";

function checkcollision(newposition){
    const cameraBox = new THREE.Box3().setFromCenterAndSize(
      newposition,
      new THREE.Vector3(1,1,1)
    )
  
    for(let i=0; i<collidableobjects.length; i++){
      if(cameraBox.intersectsBox(collidableobjects[i])){
        return true;
      }
    }
  
    return false;
  
  }
  

  export {checkcollision};