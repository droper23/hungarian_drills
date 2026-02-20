const input = document.querySelector(".input-box");
const button = document.querySelector(".answer-button");
const result = document.querySelector(".result");
const correctAnswer = "látsz";

function checkAnswer() {
    const userAnswer = input.value.trim();
    if (userAnswer === correctAnswer) {
        result.textContent = "Correct!";
        result.className = "result correct";
    } else {
        result.textContent = "Wrong! Correct: " + correctAnswer;
        result.className = "result wrong";
    }
}

// Button click
button.addEventListener("click", checkAnswer);

// Enter key
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        checkAnswer();
    }
});