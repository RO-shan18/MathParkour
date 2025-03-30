function createUI() {
    const uiContainer = document.getElementById("ui-container");
  
    for (let i = 0; i < 10; i++) {
      const div = document.createElement("div");
      div.className = "ui-box";
      uiContainer.appendChild(div);
    }
  }

  createUI();