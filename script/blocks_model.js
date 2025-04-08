import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { collidableobjects, scene, getWorldSize} from "./setup.js";
import { isPositionValid } from "./validposition.js";

let blocks = [
    "block-grass-corner-low",
    "block-grass-corner-overhang",
    "block-grass-corner-overhang-low",
    "block-grass-corner",
    "block-grass-curve-half",
    "block-grass-curve-low",
  ];

const Loader = new GLTFLoader();

// Load trees using GLTF loader
function BlockModel(newz, oldz) {
  const worldSize = getWorldSize();
  blocks.forEach((path) => {
    Loader.load(
      `/Assets/Models/GLB format/${path}.glb`,
      (gltf) => {
        const block = gltf.scene;
        scene.add(block);

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
          
          block.position.copy(position);

        // Bounding box for collision detection
        const boundingbox = new THREE.Box3().setFromObject(block);
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


export { BlockModel };
