import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";


// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color("skyblue");

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
document.body.appendChild(labelRenderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(32, 0, 120);
camera.lookAt(32, 0, 120);

const minHeight = -17;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// Create world using InstancedMesh
const worldSize = 200;
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
let actualresult;
let collidableobjects = [];
const Loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

//load trees using gltf loader
treePaths.forEach((path) => {
  Loader.load(`/Assets/Trees_GLTF/${path}.glb`, (gltf) => {
    const tree = gltf.scene;
    tree.scale.set(10, 10, 10);
    scene.add(tree);

    // Position the tree
    tree.position.set(
      Math.random() * worldSize,
      -17,
      Math.random() * worldSize
    );

    //bounding box for tree
    const boundingbox = new THREE.Box3().setFromObject(tree);
    collidableobjects.push(boundingbox);

    // Assign a fixed direction for consistency
    const directions = ["NE", "NW", "SE", "SW"];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const texturePath = `/Assets/Trees_png/${randomDirection}/${path}_${randomDirection}.png`;

    // Rotate tree correctly
    const rotations = {
      "NE": Math.PI / 4,
      "NW": -Math.PI / 4,
      "SE": (3 * Math.PI) / 4,
      "SW": (-3 * Math.PI) / 4,
    };
    tree.rotation.y = rotations[randomDirection];

    // Load the texture **after** model loads
    textureLoader.load(texturePath, (texture) => {
      texture.encoding = THREE.sRGBEncoding;
      tree.traverse((child) => {
        if (child.isMesh) {
          const material = child.material.clone(); // Prevent material override
          material.map = texture;
          material.needsUpdate = true;
          child.material = material;
        }
      });
    }, undefined, (error) => {
      console.error(`Error loading texture for ${path}:`, error);
    });

    treeModels.push(tree);
  }, undefined, (error) => {
    console.error(`Error loading model: ${path}`, error);
  });
});


// Function to create texture with numbers
function createNumberTexture(number) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Background color
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, size, size);

  // Number style
  ctx.fillStyle = "black";
  ctx.font = "bold 150px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(number, size / 2, size / 2);

  return new THREE.CanvasTexture(canvas);
}

function generateRandomEquation() {
  const operators = ["+", "-", "*", "/"];
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = operators[Math.floor(Math.random() * operators.length)];
  const equals = "=";
  const result = "?";

  if (operator === "+") {
    actualresult = num1 + num2;
  } else if (operator === "-") {
    actualresult = num1 - num2;
  } else if (operator === "*") {
    actualresult = num1 * num2;
  } else if (operator === "/") {
    actualresult = num1 / num2;
  }

  const equation = [num1, operator, num2, equals, result];

  return equation;
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16); // Generate random hex color
}

function createequationcube() {
  const equation = generateRandomEquation();

  equation.forEach((term, index) => {
    const texture = createNumberTexture(term.toString());
    const color = new THREE.Color(getRandomColor());

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      color: color,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(index * 1.1 + 32, -17, camera.position.z - 10);
    scene.add(mesh);

    //boundingbox for equation cube
    const boundingbox = new THREE.Box3().setFromObject(mesh);
    collidableobjects.push(boundingbox);
  });
}

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
          camera.position.x + 20 + x,
          -17 + y,
          camera.position.z + 20 + z
        );
        scene.add(mesh);

        //bouding box for answercubes
        const boundingbox = new THREE.Box3().setFromObject(mesh);
        collidableobjects.push(boundingbox);
      }
    }
  }
}

function Wallaroundcube() {
  //create wall behind the equation
  let idx = 0;
  for (let x = 0; x < 12; x++) {
    for (let y = 0; y < 5; y++) {
      wallEquation(x + 30, -17 + y, camera.position.z - 13, idx++);
    }
  }

  //create fourside wall around the answerblock
  let idx2 = 0;
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 5; y++) {
      wallEquation(
        camera.position.x + 17,
        -17 + y,
        camera.position.z + 17 + x,
        idx2++
      );
    }
  }
  let idx3 = 0;
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 5; y++) {
      wallEquation(
        camera.position.x + 17 + x,
        -17 + y,
        camera.position.z + 17,
        idx3++
      );
    }
  }
  let idx4 = 0;
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 5; y++) {
      wallEquation(
        camera.position.x + 25,
        -17 + y,
        camera.position.z + 17 + x,
        idx4++
      );
    }
  }
  let idx5 = 0;
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 5; y++) {
      wallEquation(
        camera.position.x + 17 + x,
        -17 + y,
        camera.position.z + 25,
        idx5++
      );
    }
  }
}

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

function createUI() {
  const uiContainer = document.getElementById("ui-container");

  for (let i = 0; i < 10; i++) {
    const div = document.createElement("div");
    div.className = "ui-box";
    uiContainer.appendChild(div);
  }
}

createequationcube();
generateanswercube();
Wallaroundcube();
createUI();

const moveSpeed = 0.2;
const moveTarget = new THREE.Vector3(); // Store the target position
moveTarget.copy(camera.position);

// Event listener for movement input
window.addEventListener("keydown", (event) => {
  let tempMoveTarget = moveTarget.clone();
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0; // Prevent vertical movement

  switch (event.key.toLowerCase()) {
    case "w":
      tempMoveTarget.addScaledVector(direction, moveSpeed);
      break;
    case "s":
      tempMoveTarget.addScaledVector(direction, -moveSpeed);
      break;
    case "a":
      const left = new THREE.Vector3().crossVectors(camera.up, direction).normalize();
      tempMoveTarget.addScaledVector(left, moveSpeed);
      break;
    case "d":
      const right = new THREE.Vector3().crossVectors(direction, camera.up).normalize();
      tempMoveTarget.addScaledVector(right, moveSpeed);
      break;
    case "arrowleft":
      camera.rotation.y += 0.03;
      break;
    case "arrowright":
      camera.rotation.y -= 0.03;
      break;
    case "arrowup": 
      tempMoveTarget.y += 0.5; // Slightly increase height
      break;
    case "arrowdown": 
      tempMoveTarget.y -= 0.5; // Slightly decrease height
      break;
    case "q":
      digWall();
      break;
  }

  if(!checkcollision(tempMoveTarget)){
    moveTarget.copy(tempMoveTarget);
  }
});

// Camera position
camera.position.set(32, 0, 32);
camera.lookAt(0, 0, 0);

moveTarget.y = -17;

// Modify the animation loop
function animate() {
  requestAnimationFrame(animate);

  camera.position.lerp(moveTarget, moveSpeed);
  if (camera.position.y < minHeight) {
    camera.position.y = minHeight;
  }

   labelRenderer.render(scene, camera);
  renderer.render(scene, camera);
}

animate();
