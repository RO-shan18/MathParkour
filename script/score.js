let score = 0; // Initialize score

function updateScoreDisplay() {
    let scoreDiv = document.getElementById("score-display");

    if (!scoreDiv) {
        scoreDiv = document.createElement("div");
        scoreDiv.id = "score-display";
        document.body.appendChild(scoreDiv);
    }

    scoreDiv.innerText = `Score: ${score}`;
    scoreDiv.style.position = "absolute";
    scoreDiv.style.top = "20px";  
    scoreDiv.style.right = "20px";  
    scoreDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";  
    scoreDiv.style.color = "white";  
    scoreDiv.style.padding = "10px 20px";  
    scoreDiv.style.borderRadius = "8px";  
    scoreDiv.style.fontSize = "20px";  
    scoreDiv.style.fontWeight = "bold";  
    scoreDiv.style.zIndex = "1000";  
}

function increaseScore(value) {
    score += value;
    updateScoreDisplay();
}

function decreaseScore(value) {
    if (score > 0) {
        score = Math.max(0, score - value);
        updateScoreDisplay();
    }
}

export { updateScoreDisplay, increaseScore, decreaseScore };
