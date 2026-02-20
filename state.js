// state.js

const appState = {
    questions: [],
    currentIndex: 0,
    correctCount: 0,
    currentAnswer: '',
    isSubmitted: false,   // 🔥 ADD THIS
    settings: loadSettings(),
    sessionId: null,
};

async function loadQuestionsFromCSV(mode = 'all') {
    const filename = mode === 'verb_conjugation' ? 'verbs.csv' : 'cases.csv';
    try {
        const response = await fetch(filename);
        const csvText = await response.text();
        const parsed = Papa.parse(csvText, { header: true });

        appState.questions = parsed.data
            .filter(row => row.sentence && row.correctAnswer)
            .map((row, index) => {
                const q = {
                    id: parseInt(row.id) || index + 1,
                    type: row.type || 'case_inflection',
                    difficulty: row.difficulty || 'beginner',
                    sentence: row.sentence,
                    translation: row.translation || '',
                    correctAnswer: row.correctAnswer,
                    explanation: row.explanation || '',
                    words: [] // filled later
                };

                if (q.type === 'case_inflection') {
                    q.caseInflection = {
                        word: row.caseWord,
                        inflectionCase: row.caseName
                    };
                    // generate words array for rendering
                    q.words = createWordsArray(row.sentence, row.caseWord);
                } else if (q.type === 'verb_conjugation') {
                    q.verb = row.verb;
                    q.words = createWordsArray(row.sentence, row.verb, true); // verb blank
                }

                return q;
            });
        console.log(`Loaded ${appState.questions.length} questions from CSV: ${filename}`);
    } catch (error) {
        console.error('Failed to load CSV:', error);
        appState.questions = []; // fallback empty
    }
}

function createWordsArray(sentence) {
    const parts = sentence.split(' ');

    return parts.map(word => {
        const cleanWord = word.replace(/[^a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]/g, ''); // strip punctuation
        const hoverInfo = wordData[cleanWord];

        if (word.includes('___')) {
            return { text: '', isBlank: true };
        } else if (hoverInfo) {
            return {
                text: word,
                definition: {
                    baseForm: hoverInfo.baseForm,
                    partOfSpeech: hoverInfo.partOfSpeech,
                    englishDefinitions: [hoverInfo.translation]
                }
            };
        } else {
            return { text: word };
        }
    });
}

const wordData = {};
function loadWordDataCSV() {
    return fetch('word_data.csv')
        .then(res => res.text())
        .then(csv => {
            const parsed = Papa.parse(csv, { header: true });
            parsed.data.forEach(row => {
                wordData[row.word] = row;
            });
        });
}
