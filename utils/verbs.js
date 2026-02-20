// utils/verbs.js

// Example: convert CSV string to array of {verb, tense, form}
function parseCSV(csvString) {
    const lines = csvString.trim().split('\n');
    const data = [];
    for (let i = 1; i < lines.length; i++) { // skip header
        const [verb, tense, form] = lines[i].split(',');
        data.push({ verb: verb.trim(), tense: tense.trim(), form: form.trim() });
    }
    return data;
}

// Group verb forms by verb + tense
function groupVerbForms(data) {
    const grouped = {};
    data.forEach(({ verb, tense, form }) => {
        const key = `${verb}||${tense}`;
        if (!grouped[key]) grouped[key] = { verb, tense, forms: [] };
        grouped[key].forms.push(form);
    });
    return Object.values(grouped); // array of {verb, tense, forms}
}

// Map tenses to difficulty
const difficultyTenses = {
    beginner: ['Present indefinite tense', 'Present definite tense'],
    intermediate: ['Present indefinite tense','Present definite tense','Past indefinite tense','Past definite tense','Future indefinite tense','Future definite tense'],
    advanced: 'all', // include everything
};

// Filter grouped questions by difficulty
function filterByDifficulty(grouped, difficulty) {
    if (difficulty === 'advanced') return grouped;
    const allowed = difficultyTenses[difficulty];
    return grouped.filter(g => allowed.includes(g.tense));
}

// Convert grouped verb forms into quiz question objects
function generateVerbQuestions(grouped) {
    const questions = [];
    grouped.forEach(({ verb, tense, forms }) => {
        forms.forEach((form) => {
            questions.push({
                type: 'verb_conjugation',
                verb,
                tense,
                correctAnswer: form,
                translation: `Conjugate <strong><u>${verb}</u></strong> in ${tense}`, // optional English instruction
            });
        });
    });
    return questions;
}

// Example usage:
const csvString = `Verb,Tense,Form
elfogad,Present indefinite tense,elfogadok
elfogad,Present indefinite tense,elfogadsz
elfogad,Present indefinite tense,elfogad
elfogad,Present indefinite tense,elfogadunk
elfogad,Present indefinite tense,elfogadtok
elfogad,Present indefinite tense,elfogadnak
...`; // your full CSV

const data = parseCSV(csvString);
const grouped = groupVerbForms(data);

// Example: beginner quiz
const beginnerGrouped = filterByDifficulty(grouped, 'beginner');
const beginnerQuestions = generateVerbQuestions(beginnerGrouped);

console.log(beginnerQuestions);