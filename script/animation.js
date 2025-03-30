import {camera, renderer, scene, minHeight} from "./setup.js";
import {moveTarget, moveSpeed} from "./Events.js";
// Modify the animation loop
function animate() {
    requestAnimationFrame(animate);
  
    camera.position.lerp(moveTarget, moveSpeed);
    if (camera.position.y < minHeight) {
      camera.position.y = minHeight;
    }
  
    renderer.render(scene, camera);
  }
  
animate();