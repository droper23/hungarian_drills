# Hungarian Grammar Quiz App

An interactive web-based Hungarian grammar practice tool focused on:

- Case inflection
- Verb conjugation (definite vs. indefinite)
- Vocabulary hover definitions
- Difficulty-based filtering

Built using:
- Vanilla JavaScript
- PapaParse (CSV parsing)
- HTML + CSS
- Python (CSV generation and data preprocessing)

---

## Features

### Case Inflection Mode
- Fill in correct case endings
- Hover over words for definitions
- Supports multiple difficulty levels

### Verb Conjugation Mode
- Definite vs. indefinite conjugation practice
- Dynamically generated sentences from templates
- CSV-driven verb forms
- Badge shows expected conjugation type

### Smart Blank Rendering
- Replaces correct word with blank
- Preserves hover definitions for other words

### CSV-Based Question System
All grammar questions are generated from:

- `cases.csv`
- `verbs.csv`

This allows easy expansion without modifying JavaScript logic.

---

## How Verb Conjugation Works

1. `verbs.csv` contains:
    - Verb (stem)
    - Form (conjugated form)
    - Tense
    - Translation
    - Difficulty

2. `verbSentenceTemplates` (in `state.js`) maps:
    - Verb stem
    - Indefinite sentence template
    - Definite sentence template

3. `loadVerbQuestionsFromCSV()`:
    - Reads CSV
    - Detects definite vs. indefinite
    - Selects correct template
    - Builds question object

---

## Python Script (scraper.py)

This script:

- Scrapes Hungarian verb conjugations from cooljugator.com
- Normalizes pronouns
- Handles tense detection
- Exports structured CSV format for the app

### Other Responsibilities:

- Prevent "-tek" ambiguity in past tense
- Detect conditional forms (`volna`)
- Normalize accented characters
- Export clean `verbs.csv`

---

# Magyar nyelvtani kvíz alkalmazás
Interaktív, webalapú magyar nyelvtani gyakorló eszköz, amely a következőkre összpontosít:

- Névmódok
- Igei ragozás (határozott vs. határozatlan)
- Szókincs leírások egérrel való megjelölésével
- Nehézségi szint szerinti szűrés 

Készült a következőkkel:

- Hagyományos JavaScript
- PapaParse (CSV elemzés)
- HTML + CSS
- Python (CSV generálás és adatelőfeldolgozás)

---

### Esetváltoztatási mód
- Töltsd ki a helyes esetvégződéseket!
- Vigyél az egérmutatót a szavak fölé a meghatározások megjelenítéséhez!
- Több nehézségi szint támogatása

### Igei ragozási mód
- Határozott és határozatlan ragozás gyakorlása
- Sablonokból dinamikusan generált mondatok
- CSV-alapú igealakok
- A jelvény a várt ragozási típust mutatja

### Intelligens üres helyek megjelenítése
- A helyes szót üres hellyel helyettesíti
- Megtartja az egérmutatóval megjelölt más szavak definícióit

### CSV-alapú kérdésrendszer
Minden nyelvtani kérdés a következőkből generálódik:

- `cases.csv`
- `verbs.csv`

Ez lehetővé teszi a könnyű bővítést a JavaScript logika módosítása nélkül.

---

## Hogyan működik az igei ragozás

1. A `verbs.csv` a következőket tartalmazza:

- Ige (tő)
- Forma (ragosított forma)
- Idő
- Fordítás
- Nehézségi szint

2. A `verbSentenceTemplates` (a `state.js` fájlban) a következőket térképezi fel:

- Igerag
- Határozatlan mondatsablon
- Határozott mondatsablon

3. `loadVerbQuestionsFromCSV()`:

- CSV olvasása
- Határozott és határozatlan formák felismerése
- A helyes sablon kiválasztása
- Kérdés objektum létrehozása 

## Python szkript (`scraper.py`)

Ez a szkript:

- Magyar igei ragozásokat gyűjt a cooljugator.com webhelyről
- Normalizálja a névmások használatát
- Kezelni tudja az igeidők felismerését
- Strukturált CSV formátumot exportál az alkalmazás számára

### Egyéb feladatok:

- Megakadályozza a „-tek” kétértelműségét a múlt időben
- Felismeri a feltételes módokat (volna)
- Normalizálja az ékezetes karaktereket
- Tiszta `verbs.csv`