import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {collidableobjects, scene, getWorldSize} from "./setup.js"

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
  "tree_oak_fall",
  "tree_oak",
  "tree_palm",
  "tree_palmBend",
  "tree_palmDetailedShort",
  "tree_palmDetailedTall",
  "tree_palmShort",
  "tree_palmTall",
  "tree_pineDefaultA",
  "tree_pineDefaultB",
  "tree_pineGroundA",
  "tree_pineGroundB",
  "tree_pineRoundA",
  "tree_pineRoundB",
  "tree_pineRoundC",
  "tree_pineRoundD",
  "tree_pineRoundF",
  "tree_pineSmallA",
  "tree_pineSmallB",
  "tree_pineSmallC",
  "tree_pineSmallD",
  "tree_pineTallA_detailed",
  "tree_pineTallA",
  "tree_pineTallB_detailed",
  "tree_pineTallB",
  "tree_pineTallC_detailed",
  "tree_pineTallC",
  "tree_pineTallD_detailed",
  "tree_pineTallD",
  "tree_plateau_dark",
  "tree_plateau_fall",
  "tree_plateau",
  "tree_simple_dark",
  "tree_simple_fall",
  "tree_simple",
  "tree_small_dark",
  "tree_small_fall",
  "tree_small",
  "tree_tall_dark",
  "tree_tall_fall",
  "tree_tall",
  "tree_thin_dark",
  "tree_thin_fall",
  "tree_thin",
];

const Loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

//load trees using gltf loader
function LoadModel(newz, oldz) {
  const worldSize = getWorldSize(); 

  treePaths.forEach((path) => {
    Loader.load(
      `/Assets/Trees_GLTF/${path}.glb`,
      (gltf) => {
        const tree = gltf.scene;
        tree.scale.set(10, 10, 10);
        scene.add(tree);

        // Position the tree
        tree.position.set(
          Math.random() * worldSize,
          -17,
          Math.random() * (oldz - newz) + newz,
        );

        //bounding box for tree
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

        // Load the texture **after** model loads
        textureLoader.load(
          texturePath,
          (texture) => {
            texture.encoding = THREE.sRGBEncoding;
            tree.traverse((child) => {
              if (child.isMesh) {
                const material = child.material.clone(); // Prevent material override
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

export {LoadModel};