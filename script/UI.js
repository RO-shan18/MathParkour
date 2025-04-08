function createUI() {
    const uiContainer = document.getElementById("ui-container");

    for (let i = 0; i < 12; i++) {
      const div = document.createElement("div");
      div.className = "ui-box";
      uiContainer.appendChild(div);
    }
  }

  let selectedUIBox = null;

function setupUIBoxListeners() {
  const uiBoxes = document.querySelectorAll(".ui-box");

  uiBoxes.forEach(box => {
    box.addEventListener("click", () => {
      // Deselect previous
      if (selectedUIBox) selectedUIBox.classList.remove("selected-ui-box");

      // Select this one
      selectedUIBox = box;
      box.classList.add("selected-ui-box");
    });
  });
}

function getSelectedUIBox() {
  return selectedUIBox;
}

function clearSelectedUIBox() {
  if (selectedUIBox) {
    selectedUIBox.classList.remove("selected-ui-box");
    selectedUIBox = null;
  }
}

export { setupUIBoxListeners, getSelectedUIBox, clearSelectedUIBox };


  createUI();

