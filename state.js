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

function createWordsArray(sentence, blankWord, forceBlank = false) {
    const parts = sentence.split(' ');

    return parts.map(word => {
        const cleanWord = word.replace(/[^a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]/g, '');
        const hoverInfo = wordData[cleanWord];

        const isBlank = forceBlank && cleanWord === blankWord;

        if (word.includes('___') || isBlank) {
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
    return fetch('verbs.csv')
        .then(res => res.text())
        .then(csv => {
            const parsed = Papa.parse(csv, { header: true });
            parsed.data.forEach(row => {
                wordData[row.word] = row;
            });
        });
}


function pickVerbForm(verbRow, difficulty) {
    // Collect all conjugation keys
    const allForms = [
        '1s_pres_def','1s_pres_indef','1s_past_def','1s_past_indef',
        '2s_pres_def','2s_pres_indef','2s_past_def','2s_past_indef',
        '3s_pres_def','3s_pres_indef','3s_past_def','3s_past_indef',
        '1p_pres_def','1p_pres_indef','1p_past_def','1p_past_indef',
        '2p_pres_def','2p_pres_indef','2p_past_def','2p_past_indef',
        '3p_pres_def','3p_pres_indef','3p_past_def','3p_past_indef',
    ];

    let allowedForms;

    switch (difficulty) {
        case 'beginner':
            allowedForms = allForms.filter(k =>
                k.startsWith('1s_') || k.startsWith('3s_') // just 1st & 3rd person
            );
            break;
        case 'intermediate':
            // larger subset
            allowedForms = allForms.filter(k =>
                !k.startsWith('2p_') // e.g.
            );
            break;
        case 'advanced':
        default:
            allowedForms = allForms;
    }

    const formKey = allowedForms[Math.floor(Math.random() * allowedForms.length)];
    return { formKey, answer: verbRow[formKey] };
}

const verbSentenceTemplates = {
    menni: {
        indefinite: {
            hu: "___ a házba",
            en: "*{{verb}}* into the house"
        },
        definite: {
            hu: "___ a házat",
            en: "*{{verb}}* the house (definite)"
        }
    },
    elfogad: {
        indefinite: {
            hu: "___ egy ajánlatot",
            en: "*{{verb}}* an offer"
        },
        definite: {
            hu: "___ az ajánlatot",
            en: "*{{verb}}* the offer"
        }
    }
};

async function loadVerbQuestionsFromCSV(difficulty) {
    const response = await fetch('verbs.csv');
    const csvText = await response.text();
    const parsed = Papa.parse(csvText, { header: true });

    const rows = parsed.data.filter(r =>
        r.Verb && r.Form && r.Translation &&
        (!difficulty || r.Difficulty === difficulty)
    );

    const questions = [];

    rows.forEach(row => {
        // Determine formType from the Tense column
        let formType = null;
        if (row.Tense.toLowerCase().includes('indefinite')) formType = 'indefinite';
        else if (row.Tense.toLowerCase().includes('definite')) formType = 'definite';
        else formType = 'unknown';

        // Lookup template for this verb
        const templateSet = verbSentenceTemplates[row.Verb];
        if (!templateSet) return;

        // Pick the correct template based on formType
        const template = formType === 'definite' ? templateSet.definite : templateSet.indefinite;

        questions.push({
            type: "verb_conjugation",
            verb: row.Verb,
            formType,                         // 🔹 store definite/indefinite
            sentence: template.hu,
            translation: template.en.replace("{{verb}}", row.Translation),
            correctAnswer: row.Form,
            difficulty: row.Difficulty,
            words: createWordsArray(template.hu, row.Form, true)
        });
    });

    return questions;
}