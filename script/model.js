import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { collidableobjects, scene, getWorldSize, camera } from "./setup.js";

let treeModels = [];
let treePaths = [
  "tree_blocks_dark",
  "tree_blocks_fall",
  "tree_blocks",
  "tree_cone_dark",
  "tree_cone_fall",
  "tree_cone",
  "tree_default_dark",
  "tree_default_fall",
  "tree_default",
  "tree_detailed_dark",
  "tree_detailed_fall",
  "tree_detailed",
  "tree_fat_darkh",
  "tree_fat_fall",
  "tree_fat",
  "tree_oak_dark",
];

const Loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const minDistanceFromCamera = 5; // Adjust as needed

// Check if position is too close to the camera
function isNearCamera(position) {
  return position.distanceTo(camera.position) < minDistanceFromCamera;
}

// Generate a valid position for the tree
function getValidTreePosition(newz, oldz) {
  const worldSize = getWorldSize();
  let position;

  do {
    position = new THREE.Vector3(
      Math.random() * worldSize,
      -17,
      Math.random() * (oldz - newz) + newz
    );
  } while (isNearCamera(position));

  return position;
}

// Load trees using GLTF loader
function LoadModel(newz, oldz) {
  treePaths.forEach((path) => {
    Loader.load(
      `/Assets/Trees_GLTF/${path}.glb`,
      (gltf) => {
        const tree = gltf.scene;
        tree.scale.set(10, 10, 10);
        scene.add(tree);

        // Get a valid tree position
        tree.position.copy(getValidTreePosition(newz, oldz));

        // Bounding box for collision detection
        const boundingbox = new THREE.Box3().setFromObject(tree);
        collidableobjects.push(boundingbox);

        // Assign a fixed direction for consistency
        const directions = ["NE", "NW", "SE", "SW"];
        const randomDirection =
          directions[Math.floor(Math.random() * directions.length)];
        const texturePath = `/Assets/Trees_png/${randomDirection}/${path}_${randomDirection}.png`;

        // Rotate tree correctly
        const rotations = {
          NE: Math.PI / 4,
          NW: -Math.PI / 4,
          SE: (3 * Math.PI) / 4,
          SW: (-3 * Math.PI) / 4,
        };
        tree.rotation.y = rotations[randomDirection];

        // Load the texture after the model loads
        textureLoader.load(
          texturePath,
          (texture) => {
            texture.encoding = THREE.sRGBEncoding;
            tree.traverse((child) => {
              if (child.isMesh) {
                const material = child.material.clone();
                material.map = texture;
                material.needsUpdate = true;
                child.material = material;
              }
            });
          },
          undefined,
          (error) => {
            console.error(`Error loading texture for ${path}:`, error);
          }
        );

        treeModels.push(tree);
      },
      undefined,
      (error) => {
        console.error(`Error loading model: ${path}`, error);
      }
    );
  });
}

LoadModel();

export { LoadModel };
