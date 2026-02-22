// diff.js

function diffWord(inputWord, correctWord) {
    const chars = [];
    const maxLen = Math.max(inputWord.length, correctWord.length);

    for (let i = 0; i < maxLen; i++) {
        const ic = inputWord[i] || '';
        const cc = correctWord[i] || '';
        let status;

        if (!ic && cc) status = 'missing';
        else if (ic && !cc) status = 'extra';
        else status = ic === cc ? 'correct' : 'incorrect';

        // CHANGE: Only use 'ic' (user input).
        // Do not fallback to 'cc' (correct answer).
        chars.push({ char: ic, status });
    }
    return { inputWord, correctWord, chars };
}

function diffAnswer(input, correct) {
    const inWords = input.trim().split(/\s+/).filter(Boolean);
    const correctWords = correct.trim().split(/\s+/).filter(Boolean);
    const result = [];

    const maxLen = Math.max(inWords.length, correctWords.length);
    for (let i = 0; i < maxLen; i++) {
        const iw = inWords[i] || '';
        const cw = correctWords[i] || '';
        result.push(diffWord(iw, cw));
    }
    return result;
}
