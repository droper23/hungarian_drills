// render.js

function renderProgress() {
    const progressBar = document.getElementById('progress-bar');
    const scoreDisplay = document.getElementById('score-display');

    const i = appState.currentIndex;
    const total = appState.questions.length;
    const correct = appState.correctCount;

    const pct = total ? Math.round((i / total) * 100) : 0;
    progressBar.style.width = pct + '%';

    const scorePct = i ? Math.round((correct / i) * 100) : 0;
    scoreDisplay.textContent = `Score: ${scorePct}%`;
}

function renderModeBadges() {
    const container = document.getElementById('mode-badges');
    const q = appState.questions[appState.currentIndex];
    if (!q) return;
    container.innerHTML = '';

    const modeChip = document.createElement('span');
    modeChip.className = 'chip mode-chip';
    modeChip.textContent =
        q.type === 'verb_conjugation'
            ? 'Verbs'
            : q.type === 'listening'
                ? 'Listening'
                : 'Cases';
    container.appendChild(modeChip);

    if (q.difficulty) {
        const diffChip = document.createElement('span');
        diffChip.className = 'chip diff-chip';
        diffChip.textContent = q.difficulty;
        container.appendChild(diffChip);
    }

    if (q.caseInflection?.inflectionCase) {
        const caseChip = document.createElement('span');
        caseChip.className =
            'chip case-chip case-' + q.caseInflection.inflectionCase;
        caseChip.textContent = q.caseInflection.inflectionCase;
        container.appendChild(caseChip);
    }
}

function renderSentenceWithBlank(q) {
    if (!q.words) return q.sentence || '';

    return q.words.map((w) => {
        if (w.isBlank) {
            if (appState.isSubmitted) {
                // Return the correct answer in bold when submitted
                return `<strong class="correct-answer-display">${q.correctAnswer}</strong>`;
            } else {
                // Show placeholders while typing
                return `<span class="blank">_____</span>`;
            }
        }

        // Tooltip logic for normal words
        const defAttr = w.definition
            ? `class="word-tooltip" data-definition="${encodeURIComponent(JSON.stringify(w.definition))}"`
            : '';

        return `<span ${defAttr}>${w.text}</span>`;
    }).join(' ');
}

function renderQuestion() {
    const container = document.getElementById('question-container');
    const q = appState.questions[appState.currentIndex];
    if (!q) return;

    container.classList.remove('enter');
    // force reflow
    void container.offsetWidth;
    container.classList.add('enter');

    container.innerHTML = `
    <div class="sentence">
      ${renderSentenceWithBlank(q)}
    </div>
    <div class="translation ${
        appState.settings.showTranslationAutomatically ? '' : 'hidden'
    }">
      ${q.translation || ''}
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
