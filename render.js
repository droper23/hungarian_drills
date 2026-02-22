// render.js

function renderProgress() {
    const progressText = document.getElementById('progress-text');
    if (!progressText) return;

    const i = appState.currentIndex;
    const total = appState.questions.length;
    const correct = appState.correctCount;

    const scorePct = i ? Math.round((correct / i) * 100) : 0;

    progressText.innerHTML = `Question ${i + 1} / ${total} <span id="score-text">Score: ${scorePct}%</span>`;
}

function renderModeBadges() {
    const container = document.getElementById('mode-badges');
    const q = appState.questions[appState.currentIndex];
    if (!q) return;
    container.innerHTML = '';

    // Mode badge
    const modeChip = document.createElement('span');
    modeChip.className = 'chip mode-chip';
    modeChip.textContent =
        q.type === 'verb_conjugation'
            ? 'Verbs'
            : q.type === 'listening'
                ? 'Listening'
                : 'Cases';
    container.appendChild(modeChip);

    // Difficulty badge
    if (q.difficulty) {
        const diffChip = document.createElement('span');
        diffChip.className = 'chip diff-chip';
        diffChip.textContent = q.difficulty;
        container.appendChild(diffChip);
    }

    // Case badge: only show after submission
    if (q.caseInflection?.inflectionCase && appState.isSubmitted) {
        const caseChip = document.createElement('span');
        caseChip.className =
            'chip case-chip case-' + q.caseInflection.inflectionCase;
        caseChip.textContent = q.caseInflection.inflectionCase;
        container.appendChild(caseChip);
    }

    if (q.formType && appState.isSubmitted) {
        const formChip = document.createElement('span');
        formChip.className = 'chip diff-chip';
        formChip.textContent = q.formType.charAt(0).toUpperCase() + q.formType.slice(1);
        container.appendChild(formChip);
    }
}

function renderSentenceWithBlank(q) {
    if (!q.words) return q.sentence || '';

    return q.words.map((w) => {
        if (w.isBlank) {
            if (appState.isSubmitted) {
                // show correct answer in bold after submission
                return `<strong class="correct-answer-display">${q.correctAnswer}</strong>`;
            } else {
                return `<span class="blank">_____</span>`;
            }
        }

        // Tooltip logic
        if (w.definition) {
            const defAttr = `class="word-tooltip" data-definition='${encodeURIComponent(JSON.stringify(w.definition))}'`;
            return `<span ${defAttr}>${w.text}</span>`;
        } else {
            return `<span>${w.text}</span>`;
        }
    }).join(' ');
}

function renderQuestion() {
    const container = document.getElementById('question-container');
    const q = appState.questions[appState.currentIndex];
    if (!q) return;

    container.classList.remove('enter');
    void container.offsetWidth;
    container.classList.add('enter');

    // Determine the target word
    let targetWordHTML = '';
    if (q.type === 'case_inflection' && q.caseInflection?.word) {
        targetWordHTML = `<div class="target-word">Inflect the word <em><strong>${q.caseInflection.word}</strong></em> correctly:</div>`;
    } else if (q.type === 'verb_conjugation' && q.verb) {
        targetWordHTML = `<div class="target-word">Conjugate the verb <em><strong>${q.verb}ni</strong></em> correctly:</div>`;
    }

    // Replace asterisks in translation with <strong>
    let translationHTML = '';
    if (q.translation) {
        translationHTML = q.translation.replace(/\*(.*?)\*/g, '<strong><u>$1</u></strong>');
    }

    container.innerHTML = `
    ${targetWordHTML}
    <div class="sentence" style="margin-bottom: .25rem; margin-top: 1.25rem;">
        ${renderSentenceWithBlank(q)}
    </div>
    <div class="translation ${
        appState.settings.showTranslationAutomatically ? '' : 'hidden'
    }" style="margin-top: 0.5rem;">
        ${translationHTML}
    </div>
`;

    renderExplanation(false);
}

function renderAnswerOverlay() {
    const overlay = document.getElementById('answer-overlay');
    overlay.innerHTML = '';

    const q = appState.questions[appState.currentIndex];
    if (!q) return;

    const diffs = diffAnswer(appState.currentAnswer, q.correctAnswer);

    diffs.forEach((wordDiff, wordIndex) => {
        wordDiff.chars.forEach((ch) => {
            // Only render characters the user has actually typed
            if (ch.char !== undefined && ch.status !== 'missing') {
                const span = document.createElement('span');
                span.textContent = ch.char;
                span.className = 'answer-char';

                if (appState.isSubmitted) {
                    span.classList.add(ch.status);
                }
                overlay.appendChild(span);
            }
        });

        // Add a space between words if it's not the last word
        if (wordIndex < diffs.length - 1) {
            const space = document.createElement('span');
            space.textContent = ' ';
            space.className = 'answer-char';
            overlay.appendChild(space);
        }
    });
}

function renderExplanation(open) {
    const container = document.getElementById('explanation-container');
    const q = appState.questions[appState.currentIndex];
    if (!q || !q.explanation) {
        container.textContent = '';
        container.classList.remove('open');
        return;
    }
    container.textContent = q.explanation;
    if (open) {
        container.classList.add('open');
    } else {
        container.classList.remove('open');
    }
}

