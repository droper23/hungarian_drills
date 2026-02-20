// state.js

// Example questions; replace with your own or fetch from backend.
const SAMPLE_QUESTIONS = [
    {
        id: 1,
        type: 'case_inflection',
        difficulty: 'intermediate',
        sentence: 'Minä näen ____ puun.',
        translation: 'I see the tree.',
        correctAnswer: 'sen',
        altAnswers: [],
        audioUrl: 'audio/q1.mp3',   // optional
        explanation: 'Accusative case of "se" used as a direct object.',
        words: [
            { text: 'Minä', definition: null },
            { text: 'näen', definition: null },
            { text: '____', isBlank: true },
            {
                text: 'puun.',
                definition: {
                    baseForm: 'puu',
                    partOfSpeech: 'noun',
                    englishDefinitions: ['tree'],
                    grammaticalInfo: { case: 'gen/acc', number: 'singular' },
                    grammarTip: 'Genitive/accusative ends in -n.',
                },
            },
        ],
        caseInflection: {
            word: 'se',
            inflectionCase: 'accusative',
        },
    },
    {
        id: 2,
        type: 'listening',
        difficulty: 'beginner',
        sentence: 'Kuuntele ja kirjoita lause.',
        translation: 'Listen and type the sentence.',
        correctAnswer: 'Hyvää huomenta',
        altAnswers: [],
        audioUrl: 'audio/q2.mp3',
        explanation: 'Standard Finnish greeting for "Good morning".',
        words: [],
    },
];

const appState = {
    questions: SAMPLE_QUESTIONS,
    currentIndex: 0,
    correctCount: 0,
    currentAnswer: '',
    settings: loadSettings(),
    sessionId: null,
    isSubmitted: false,
};
