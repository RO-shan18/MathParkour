import * as THREE from "three";
import {scene, getWorldSize, getZCord, setZCord} from "./setup.js"
import { LoadModel } from "./model.js";

const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load(
  "/Assets/Textures/grass.png");

groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(1, 1);
groundTexture.encoding = THREE.sRGBEncoding;

// Create world using InstancedMesh
function createWorld(){
  const worldSize = getWorldSize();
  const oldz = getZCord();
  const newz = oldz - 100;

    const geometry = new THREE.BoxGeometry(1, 5, 1);
    const material = new THREE.MeshBasicMaterial({ map: groundTexture});
    const mesh = new THREE.InstancedMesh(geometry, material, worldSize * worldSize);
    scene.add(mesh);
    
    const dummy = new THREE.Object3D();
    let index = 0;
    for (let x = 0; x < worldSize; x++) {
      for (let z = newz; z < oldz + 100 ; z++) {
        dummy.position.set(x, -20, z);
        dummy.updateMatrix();
        mesh.setMatrixAt(index++, dummy.matrix);
        
      }
    }
    mesh.instanceMatrix.needsUpdate = true;

     LoadModel(oldz+100, newz);
     // Update values through setters
     setZCord(newz);
}

createWorld();

export {createWorld};
