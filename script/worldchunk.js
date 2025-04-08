import * as THREE from "three";
import { scene, getWorldSize,getZCord,setZCord } from "./setup.js";
import {LoadModel} from "./model.js"
import { BlockModel } from "./blocks_model.js";

function createWorld(){
  const worldSize = getWorldSize();
  const oldz = getZCord();
  const newz = oldz - 25;

    const geometry = new THREE.BoxGeometry(1, 5, 1);
    const material = new THREE.MeshBasicMaterial({ color: 'rgb(73, 154, 73)' });
    const mesh = new THREE.InstancedMesh(geometry, material, worldSize * 12.5 );
    scene.add(mesh);
    
    const dummy = new THREE.Object3D();
    let index = 0;
    for (let x = 0; x < worldSize; x++) {
      for (let z = newz; z < oldz; z++) {
        dummy.position.set(x, -20, z);
        dummy.updateMatrix();
        mesh.setMatrixAt(index++, dummy.matrix);
        
      }
    }
    mesh.instanceMatrix.needsUpdate = true;

     LoadModel(oldz, newz);
     BlockModel(oldz, newz)
     // Update values through setters
     setZCord(newz);
}

createWorld();
createWorld();

export { createWorld };