function showMessage(text, restart = false) {
    let messageDiv = document.getElementById("game-message");

    if (!messageDiv) {
        messageDiv = document.createElement("div");
        messageDiv.id = "game-message";
        document.body.appendChild(messageDiv);
    }

    messageDiv.innerText = text;
    messageDiv.style.position = "absolute";
    messageDiv.style.top = "20px";  
    messageDiv.style.left = "50%";
    messageDiv.style.transform = "translateX(-50%)";
    messageDiv.style.fontSize = "24px";
    messageDiv.style.color = "black"; 
    messageDiv.style.fontWeight = "bold";
    messageDiv.style.zIndex = "1000";

    if (restart) {
        setTimeout(() => {
            messageDiv.innerText = "";
            restartGame();
        }, 2000);
    } else {
        setTimeout(() => {
            messageDiv.innerText = "";
        }, 3000);
    }
}

function restartGame() {
    setTimeout(() => {
        location.reload();
    }, 2000);
}

export { showMessage, restartGame };
