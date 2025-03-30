import * as THREE from "three";
import {collidableobjects, scene} from "./setup.js";

function wallEquation(xpos, ypos, zpos, index) {

    const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xaa4a44 });
  
    const WallInstance = new THREE.InstancedMesh(wallGeometry, wallMaterial, 64);
    scene.add(WallInstance);
  
    const dummy = new THREE.Object3D();
    dummy.position.set(xpos, ypos, zpos);
    dummy.updateMatrix();
    WallInstance.setMatrixAt(index++, dummy.matrix);
  
    WallInstance.instanceMatrix.needsUpdate = true;
    
    //bounding box for wall
    const boundingbox = new THREE.Box3().setFromCenterAndSize(
      dummy.position.clone(),
      new THREE.Vector3(1,1,1)
    )
  
    collidableobjects.push(boundingbox);
  }

export {wallEquation};