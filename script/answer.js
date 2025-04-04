import * as THREE from "three";
import {collidableobjects, actualresult, camera, scene} from "./setup.js";
import {createNumberTexture, getRandomColor} from "./equation.js";

const answercube = [];
function generateanswercube() {
  let actualIndex = Math.floor(Math.random() * (3 * 2 * 2));
  let counter = 0;

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 2; y++) {
      for (let z = 0; z < 2; z++) {
        const randomresult =
          counter === actualIndex
            ? actualresult
            : Math.floor(Math.random() * 100);
        counter++;

        const texture = createNumberTexture(Math.floor(randomresult));
        const color = new THREE.Color(getRandomColor());
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          color: color,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          camera.position.x + 16 + x,
          -17 + y,
          camera.position.z + 13 + z
        );
        scene.add(mesh);

        const boundingBox = new THREE.Box3().setFromObject(mesh);

        answercube.push({ mesh, color: `${color.getHexString()}`, number: randomresult, boundingBox });
        collidableobjects.push(boundingBox);
      }
    }
  }
}
  generateanswercube();

  export {answercube, generateanswercube}