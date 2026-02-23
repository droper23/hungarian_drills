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

const verbSentenceTemplates = {

    elfogad: {
        indefinite: {
            hu: "___ egy ajánlatot",
            en: "*{{verb}}* an offer"
        },
        definite: {
            hu: "___ az állást",
            en: "*{{verb}}* the job"
        }
    },

    hozzáad: {
        indefinite: {
            hu: "___ egy számot",
            en: "*{{verb}}* a number"
        },
        definite: {
            hu: "___ a cukrot",
            en: "*{{verb}}* the sugar"
        }
    },

    megenged: {
        indefinite: {
            hu: "___ egy hibát",
            en: "*{{verb}}* a mistake"
        },
        definite: {
            hu: "___ a bulit",
            en: "*{{verb}}* the party"
        }
    },

    válaszol: {
        indefinite: {
            hu: "___ egy kérdésre",
            en: "*{{verb}}* a question"
        },
        definite: {
            hu: "___ a tanár kérdésére",
            en: "*{{verb}}* the teacher’s question"
        }
    },

    megérkez: {
        indefinite: {
            hu: "___ egy városba",
            en: "*{{verb}}* in a city"
        },
        definite: {
            hu: "___ a repülőtérre",
            en: "*{{verb}}* at the airport"
        }
    },

    kérdez: {
        indefinite: {
            hu: "___ egy dolgot",
            en: "*{{verb}}* something"
        },
        definite: {
            hu: "___ a tanárt",
            en: "*{{verb}}* the teacher"
        }
    },

    len: {
        indefinite: {
            hu: "___ egy tanár",
            en: "*{{verb}}* a teacher"
        },
    },

    választa: {
        indefinite: {
            hu: "___ egy lehetőséget",
            en: "*{{verb}}* an option"
        },
        definite: {
            hu: "___ a legjobb megoldást",
            en: "*{{verb}}* the best solution"
        }
    },

    hin: {
        indefinite: {
            hu: "___ egy történetet",
            en: "*{{verb}}* a story"
        },
        definite: {
            hu: "___, hogy ez az igazság",
            en: "*{{verb}}* this is the truth"
        }
    },

    tör: {
        indefinite: {
            hu: "___ egy poharat",
            en: "*{{verb}}* a glass"
        },
        definite: {
            hu: "___ az ablakot",
            en: "*{{verb}}* the window"
        }
    },

    hoz: {
        indefinite: {
            hu: "___ egy ajándékot",
            en: "*{{verb}}* a gift"
        },
        definite: {
            hu: "___ a könyvet",
            en: "*{{verb}}* the book"
        }
    },

    ven: {
        indefinite: {
            hu: "___ egy jegyet",
            en: "*{{verb}}* a ticket"
        },
        definite: {
            hu: "___ a kabátot",
            en: "*{{verb}}* the coat"
        }
    },

    hív: {
        indefinite: {
            hu: "___ egy barátot",
            en: "*{{verb}}* a friend"
        },
        definite: {
            hu: "___ a szüleit",
            en: "*{{verb}}* his/her parents"
        }
    },

    változtat: {
        indefinite: {
            hu: "___ egy dolgot",
            en: "*{{verb}}* something"
        },
        definite: {
            hu: "___ a tervet",
            en: "*{{verb}}* the plan"
        }
    },

    tisztít: {
        indefinite: {
            hu: "___ egy szobát",
            en: "*{{verb}}* a room"
        },
        definite: {
            hu: "___ a konyhát",
            en: "*{{verb}}* the kitchen"
        }
    },

    bezár: {
        indefinite: {
            hu: "___ egy ajtót",
            en: "*{{verb}}* a door"
        },
        definite: {
            hu: "___ az ablakot",
            en: "*{{verb}}* the window"
        }
    },

    jön: {
        indefinite: {
            hu: "___ a boltból",
            en: "*{{verb}}* from the store"
        }
    },

    visszajön: {
        indefinite: {
            hu: "___ Budapestről",
            en: "*{{verb}}* back from Budapest"
        },
    },

    folytat: {
        indefinite: {
            hu: "___ egy beszélgetést",
            en: "*{{verb}}* a conversation"
        },
        definite: {
            hu: "___ a munkát",
            en: "*{{verb}}* the work"
        }
    },

    főz: {
        indefinite: {
            hu: "___ egy levest",
            en: "*{{verb}}* a soup"
        },
        definite: {
            hu: "___ a vacsorát",
            en: "*{{verb}}* the dinner"
        }
    },

    számol: {
        indefinite: {
            hu: "___ egy számot",
            en: "*{{verb}}* a number"
        },
        definite: {
            hu: "___ a pénzt",
            en: "*{{verb}}* the money"
        }
    },

    sír: {
        indefinite: {
            hu: "___ egy dalon",
            en: "*{{verb}}* over a song"
        },
    },

    vág: {
        indefinite: {
            hu: "___ egy tortát",
            en: "*{{verb}}* a cake"
        },
        definite: {
            hu: "___ a kenyeret",
            en: "*{{verb}}* the bread"
        }
    },

    dönte: {
        indefinite: {
            hu: "___ egy kérdésben",
            en: "*{{verb}}* in a matter"
        },
        definite: {
            hu: "___, hogy odamegyünk",
            en: "*{{verb}}* that we're going there"
        },
    },

    csinál: {
        indefinite: {
            hu: "___ egy projektet",
            en: "*{{verb}}* a project"
        },
        definite: {
            hu: "___ a házi feladatot",
            en: "*{{verb}}* the homework"
        }
    },

    vezet: {
        indefinite: {
            hu: "___ egy autót",
            en: "*{{verb}}* a car"
        },
        definite: {
            hu: "___ a buszt",
            en: "*{{verb}}* the bus"
        }
    },

    en: {
        indefinite: {
            hu: "___ egy almát",
            en: "*{{verb}}* an apple"
        },
        definite: {
            hu: "___ az ebédet",
            en: "*{{verb}}* the lunch"
        }
    },

    belép: {
        indefinite: {
            hu: "___ egy szobába",
            en: "*{{verb}}* into a room"
        },
    },

    repül: {
        indefinite: {
            hu: "___ az országba",
            en: "*{{verb}}* to the country"
        }
    },

    néz: {
        indefinite: {
            hu: "___ egy filmet",
            en: "*{{verb}}* a movie"
        },
        definite: {
            hu: "___ a tévét",
            en: "*{{verb}}* the TV"
        }
    },

    lát: {
        indefinite: {
            hu: "___ egy madarat",
            en: "*{{verb}}* a bird"
        },
        definite: {
            hu: "___ a hegyet",
            en: "*{{verb}}* the mountain"
        }
    },

    monda: {
        indefinite: {
            hu: "___ egy viccet",
            en: "*{{verb}}* a joke"
        },
        definite: {
            hu: "___ az igazat",
            en: "*{{verb}}* the truth"
        }
    },

    készíte: {
        indefinite: {
            hu: "___ egy képet",
            en: "*{{verb}}* a picture"
        },
        definite: {
            hu: "___ a vacsorát",
            en: "*{{verb}}* the dinner"
        }
    },

    tud: {
        indefinite: {
            hu: "___ arról",
            en: "*{{verb}}* about that"
        },
        definite: {
            hu: "___ a megoldást",
            en: "*{{verb}}* the solution"
        }
    },

    gondol: {
        indefinite: {
            hu: "___ egy ötletre",
            en: "*{{verb}}* of an idea"
        },
        definite: {
            hu: "___, hogy finom az étel",
            en: "*{{verb}}* that the food is delicious"
        }
    },

    kap: {
        indefinite: {
            hu: "___ egy levelet",
            en: "*{{verb}}* a letter"
        },
        definite: {
            hu: "___ a csomagot",
            en: "*{{verb}}* the package"
        }
    },

    fizet: {
        indefinite: {
            hu: "___ egy számlát",
            en: "*{{verb}}* a bill"
        },
        definite: {
            hu: "___ a vacsorát",
            en: "*{{verb}}* the dinner"
        }
    },

    szeret: {
        indefinite: {
            hu: "___ sportolni",
            en: "*{{verb}}* to play sports"
        },
        definite: {
            hu: "___ a családomat",
            en: "*{{verb}}* my family"
        }
    },

    vár: {
        indefinite: {
            hu: "___ egy buszt",
            en: "*{{verb}}* a bus"
        },
        definite: {
            hu: "___ a barátját",
            en: "*{{verb}}* for her friend"
        }
    },

    segíte: {
        indefinite: {
            hu: "___ a barátomnak",
            en: "*{{verb}}* my friend"
        },
    },

    kér: {
        indefinite: {
            hu: "___ egy kávét",
            en: "*{{verb}}* a coffee"
        },
        definite: {
            hu: "___ a segítségét",
            en: "*{{verb}}* his help"
        }
    },

    ad: {
        indefinite: {
            hu: "___ egy ajándékot",
            en: "*{{verb}}* a gift"
        },
        definite: {
            hu: "___ a könyvet neki",
            en: "*{{verb}}* the book to him"
        }
    },

    gyakorol: {
        indefinite: {
            hu: "___ egy dalt",
            en: "*{{verb}}* a song"
        },
        definite: {
            hu: "___ a nyelvtant",
            en: "*{{verb}}* the grammar"
        }
    },

    in: {
        indefinite: {
            hu: "___ egy sört",
            en: "*{{verb}}* a beer"
        },
        definite: {
            hu: "___ a vizet",
            en: "*{{verb}}* the water"
        }
    },

    vin: {
        indefinite: {
            hu: "___ néhány könyvet a könyvtárba.",
                en: "*{{verb}}* some books to the library"
        },
        definite: {
            hu: "___ a testvéremet a korházba",
                en: "*{{verb}}* my brother to the hospital"
        }
}

};

async function loadVerbQuestionsFromCSV(difficulty) {
    try {
        const response = await fetch('verbs.csv');
        const csvText = await response.text();
        const parsed = Papa.parse(csvText, { header: true });

        const rows = parsed.data.filter(r =>
            r.Verb && r.Form && r.Translation &&
            (!difficulty || r.Difficulty === difficulty)
        );

        const questions = [];

        rows.forEach(row => {
            const verbKey = (row.Verb || "").trim().toLowerCase();
            const templateSet = verbSentenceTemplates[verbKey];

            if (!templateSet) {
                console.warn("No template for verb:", verbKey);
                return; // skip this row
            }

            // Determine form type
            const tense = (row.Tense || "").trim().toLowerCase();
            let formType = 'indefinite';

            if (tense.includes('indefinite')) {
                formType = 'indefinite';
            } else if (tense.includes('definite')) {
                formType = 'definite';
            }

            let template = templateSet[formType];
            if (!template) {
                console.warn(`Verb ${verbKey} does not have ${formType} form, using indefinite instead`);
                template = templateSet['indefinite'];
            }

            questions.push({
                type: "verb_conjugation",
                verb: verbKey,
                tense,
                formType,
                sentence: template.hu,
                translation: template.en.replace("{{verb}}", row.Translation),
                correctAnswer: row.Form,
                difficulty: row.Difficulty,
                words: createWordsArray(template.hu, row.Form, true)
            });
        });

        console.log(`Loaded ${questions.length} verb questions`);
        return questions;

    } catch (error) {
        console.error("Error loading verb questions:", error);
        return [];
    }
}