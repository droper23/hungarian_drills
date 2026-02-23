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
- Export clean `verbs.csv