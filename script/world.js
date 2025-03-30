import * as THREE from "three";
import {scene,worldSize} from "./setup.js"

// Create world using InstancedMesh
function createWorld(){
    const geometry = new THREE.BoxGeometry(1, 5, 1);
    const material = new THREE.MeshBasicMaterial({ color: "#228B22" });
    const mesh = new THREE.InstancedMesh(geometry, material, worldSize * worldSize);
    scene.add(mesh);
    
    const dummy = new THREE.Object3D();
    let index = 0;
    for (let x = 0; x < worldSize; x++) {
      for (let z = 0; z < worldSize; z++) {
        dummy.position.set(x, -20, z);
        dummy.updateMatrix();
        mesh.setMatrixAt(index++, dummy.matrix);
      }
    }
    
    mesh.instanceMatrix.needsUpdate = true;
}

createWorld();