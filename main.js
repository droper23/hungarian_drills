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

// settings.js
const DEFAULT_SETTINGS = {
    showTranslationAutomatically: true,
    showExplanationAutomatically: true,
    hasSeenWordDefinitions: false,
};

function loadSettings() {
    const raw = localStorage.getItem('quiz-settings');
    if (!raw) return { ...DEFAULT_SETTINGS };
    try {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
        console.warn('Bad settings in localStorage');
        return { ...DEFAULT_SETTINGS };
    }
}

function saveSettings(settings) {
    localStorage.setItem('quiz-settings', JSON.stringify(settings));
}