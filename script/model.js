import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { collidableobjects, scene, getWorldSize} from "./setup.js";
import { isPositionValid } from "./validposition.js";

let treePaths = [
  "tree-pine-small",
  "tree-pine",
  "tree",
  "tree-pine-small",
];

const Loader = new GLTFLoader();

// Load trees using GLTF loader
function LoadModel(newz, oldz) {
  const worldSize = getWorldSize();
  treePaths.forEach((path) => {
    Loader.load(
      `/Assets/Models/GLB format/${path}.glb`,
      (gltf) => {
        const tree = gltf.scene;
        tree.scale.set(3, 3, 3);
        scene.add(tree);

          // Try to find a valid position
          let position;
          let attempts = 0;
          const maxAttempts = 10;
          
          do {
            position = new THREE.Vector3(
              Math.random() * 23,
              -17.5,
              Math.random() * (oldz - newz) + newz
            );
            attempts++;
          } while (!isPositionValid(position) && attempts < maxAttempts);
          
          if (attempts >= maxAttempts) {
            console.warn(`Could not find valid position for tree ${path}`);
            return;
          }
          
          tree.position.copy(position);

        // Bounding box for collision detection
        const boundingbox = new THREE.Box3().setFromObject(tree);
        collidableobjects.push(boundingbox);

          },
          undefined,
          (error) => {
            console.error(`Error loading texture for ${path}:`, error);
          }
        );
      },
      undefined,
      (error) => {
        console.error(`Error loading model: ${path}`, error);
      }
    );
  };

export { LoadModel };
