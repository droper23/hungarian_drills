// main.js

function setupAnswerInput() {
    const input = document.getElementById('answer-input');

    input.addEventListener('input', () => {
        if (appState.isSubmitted) return;
        appState.currentAnswer = input.value;
        renderAnswerOverlay();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (appState.isSubmitted) {
                // If already submitted, move to next question
                goToNextQuestion();
            } else {
                // If first time pressing Enter, submit the answer
                handleSubmitAnswer();
            }
        }
    });
}


function setupButtons() {
    document
        .getElementById('next-button')
        .addEventListener('click', goToNextQuestion);

    // document
    //     .getElementById('toggle-explanation-button')
    //     .addEventListener('click', () => {
    //         const el = document.getElementById('explanation-container');
    //         if (!el.textContent) {
    //             renderExplanation(true);
    //             return;
    //         }
    //         el.classList.toggle('open');
    //     });
}

document.addEventListener('DOMContentLoaded', async function() {
    await loadWordDataCSV();        // Load all hoverable word info
    await loadQuestionsFromCSV();   // Load quiz questions

    showHomeScreen();               // Home screen now comes first

    window.addEventListener('beforeunload', () => {
        saveSettings(appState.settings);
    });
});
