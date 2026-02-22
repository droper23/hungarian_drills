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

