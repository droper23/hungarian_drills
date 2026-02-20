// logic.js

function normalizeAnswer(str) {
    return (str || '').trim().toLocaleLowerCase();
}

function showAnswerFeedback(isCorrect) {
    const input = document.getElementById('answer-input');
    input.classList.remove('correct', 'incorrect');
    void input.offsetWidth;
    input.classList.add(isCorrect ? 'correct' : 'incorrect');
}

function handleSubmitAnswer() {
    const q = appState.questions[appState.currentIndex];
    if (!q || appState.isSubmitted) return;

    appState.isSubmitted = true;

    const input = document.getElementById('answer-input');
    input.readOnly = true;

    const user = normalizeAnswer(appState.currentAnswer);
    const correct = normalizeAnswer(q.correctAnswer);

    const isCorrect =
        user === correct ||
        (Array.isArray(q.altAnswers) &&
            q.altAnswers.some((a) => normalizeAnswer(a) === user));

    if (isCorrect) appState.correctCount++;

    showAnswerFeedback(isCorrect);
    input.classList.remove('real-text');

    // Render everything again
    renderModeBadges();     // ✅ Make sure badges update after submission
    renderQuestion();
    renderAnswerOverlay();

    if (appState.settings.showExplanationAutomatically) {
        renderExplanation(true);
    }
}

function goToNextQuestion() {
    if (appState.currentIndex < appState.questions.length - 1) {
        appState.currentIndex++;
        appState.currentAnswer = '';
        appState.isSubmitted = false;

        const input = document.getElementById('answer-input');
        input.value = '';
        input.readOnly = false; // Unlock
        input.classList.remove('correct', 'incorrect', 'real-text');

        renderProgress();
        renderModeBadges();
        renderQuestion();
        renderAnswerOverlay();

        input.focus();
    } else {
        showQuizFinished(); // ✅ show custom screen
    }
}

function showQuizFinished() {
    const app = document.getElementById('app');
    const total = appState.questions.length;
    const correct = appState.correctCount;
    const scorePct = total ? Math.round((correct / total) * 100) : 0;

    app.innerHTML = `
        <div class="quiz-finished">
            <h2>Quiz Finished!</h2>
            <p>Your score: ${scorePct}% (${correct} / ${total})</p>
            <div class="finished-buttons">
                <button id="restart-button">Restart Quiz</button>
                <button id="home-button">Return to Home</button>
            </div>
        </div>
    `;

    document.getElementById('restart-button').addEventListener('click', () => {
        startQuiz(appState.currentType); // restart the same mode
    });

    document.getElementById('home-button').addEventListener('click', () => {
        showHomeScreen();
    });
}

function showHomeScreen() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="home-screen">
            <h1>Hungarian Quiz</h1>
            <p>Select a quiz mode:</p>
            <button id="cases-mode">Cases / Noun Inflections</button>
            <button id="verbs-mode">Verb Conjugations</button>
        </div>
    `;

    document.getElementById('cases-mode').addEventListener('click', () => startQuiz('case_inflection'));
    document.getElementById('verbs-mode').addEventListener('click', () => startQuiz('verb_conjugation'));
}

async function startQuiz(mode) {
    // Load word data first if not already
    if (Object.keys(wordData).length === 0) {
        await loadWordDataCSV();
    }

    // Load the CSV for the selected mode
    await loadQuestionsFromCSV(mode);

    // reset state
    appState.currentIndex = 0;
    appState.correctCount = 0;
    appState.currentAnswer = '';
    appState.isSubmitted = false;
    appState.currentType = mode; // store selected mode

    // Rebuild quiz HTML
    const app = document.getElementById('app');
    app.innerHTML = `
        <header class="quiz-header">
            <div class="progress-wrapper">
                <div id="progress-bar" class="progress-bar"></div>
            </div>
            <div id="score-display" class="score-display"></div>
            <div id="mode-badges" class="mode-badges"></div>
        </header>

        <main class="quiz-main">
            <section id="question-container" class="question-container"></section>

            <section id="answer-container" class="answer-container">
                <input id="answer-input" type="text" autocomplete="off" />
                <div id="answer-overlay" aria-hidden="true"></div>
            </section>

            <section id="explanation-container" class="explanation-container"></section>
        </main>

        <footer class="quiz-footer">
            <button id="next-button">Next</button>
        </footer>
    `;

    // Load the CSV for the selected mode
    loadQuestionsFromCSV(mode).then(() => {
        renderProgress();
        renderModeBadges();
        renderQuestion();
        renderAnswerOverlay();
        setupAnswerInput();
        setupButtons();
        setupTooltips();
        setupAdminOverlay();
    });
}