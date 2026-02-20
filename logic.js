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

    // LOCK THE INPUT but keep it focused
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

    // REMOVED input.blur() so the cursor stays in the box for the next Enter press

    if (appState.settings.showExplanationAutomatically) {
        renderExplanation(true);
    }

    renderQuestion();
    renderProgress();
    renderAnswerOverlay();
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
        alert('Quiz finished!');
    }
}