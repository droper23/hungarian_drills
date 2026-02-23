import requests
from bs4 import BeautifulSoup
import csv
import time

# -------------------------------
# Top 50-100 Hungarian verbs
# -------------------------------
top_verbs = [
    "elfogad", "hozzáad", "megenged", "válaszol", "megérkez",
    "kérdez", "lesz", "vál", "hisz", "tör", "hoz", "vesz",
    "hív", "változtat", "választ", "tisztít", "bezár",
    "jön", "visszajön", "folytat", "főz", "számol", "sír",
    "vág", "dönt", "csinál", "vezet", "eszik", "belép",
    "repül", "néz", "lát", "mond", "vesz", "készít",
    "tud", "gondol", "kap", "fizet", "szeret", "vár",
    "segít", "kér", "ad", "gyakorol", "iszik"
]

# -------------------------------
# Hungarian infinitive -> English root
# -------------------------------
root_translations = {
    "elfogad": "accept",
    "hozzáad": "add",
    "megenged": "allow",
    "válaszol": "answer",
    "megérkez": "arrive",
    "kérdez": "ask",
    "lesz": "become",
    "vál": "choose",
    "hisz": "believe",
    "tör": "break",
    "hoz": "bring",
    "vesz": "take",
    "hív": "call",
    "változtat": "change",
    "választ": "select",
    "tisztít": "clean",
    "bezár": "close",
    "jön": "come",
    "visszajön": "come back",
    "folytat": "continue",
    "főz": "cook",
    "számol": "count",
    "sír": "cry",
    "vág": "cut",
    "dönt": "decide",
    "csinál": "do",
    "vezet": "drive",
    "eszik": "eat",
    "belép": "enter",
    "repül": "fly",
    "néz": "look",
    "lát": "see",
    "mond": "say",
    "készít": "make",
    "tud": "know",
    "gondol": "think",
    "kap": "receive",
    "fizet": "pay",
    "szeret": "love",
    "vár": "wait",
    "segít": "help",
    "kér": "request",
    "ad": "give",
    "gyakorol": "practice",
    "iszik": "drink"
}

base_url = "https://cooljugator.com/hu/"

# -------------------------------
# Assign difficulty
# -------------------------------
def get_difficulty(verb_tense_name):
    tense_lower = verb_tense_name.lower()
    if "present" in tense_lower and not ("conditional" in tense_lower or "subjunctive" in tense_lower):
        return "beginner"
    elif "past" in tense_lower or "conditional" in tense_lower:
        return "intermediate"
    else:
        return "advanced"

# -------------------------------
# Automatic English past tense
# -------------------------------
def to_past(verb_en):
    # Handle common irregulars
    irregulars = {
        "become":"became","bring":"brought","come":"came","do":"did","eat":"ate",
        "go":"went","have":"had","make":"made","see":"saw","say":"said","take":"took",
        "think":"thought","drink":"drank","give":"gave","receive":"received","allow":"allowed",
        "ask":"asked","help":"helped","love":"loved","wait":"waited","practice":"practiced",
        "call":"called","look":"looked"
    }
    return irregulars.get(verb_en, verb_en + "ed")

# -------------------------------
# Handle -sz / -szik replacement for CSV verb
# -------------------------------
def adjust_hungarian_verb(verb_stem):
    if verb_stem.endswith("szik"):
        return verb_stem[:-4] + "n"
    elif verb_stem.endswith("sz"):
        return verb_stem[:-2] + "n"
    return verb_stem

# -------------------------------
# Translation function
# -------------------------------
def get_translation(verb_form, root_verb, verb_tense_name, position=None):
    root_en = root_translations.get(root_verb, root_verb)
    tense_lower = verb_tense_name.lower()

    # Pronouns by table position
    pronouns_order = ["I","You","He","We","You all","They"]
    pronoun = pronouns_order[position] if position is not None and 0 <= position < 6 else "He"

    # FUTURE
    if verb_form.startswith("fog"):
        parts = verb_form.split()
        if len(parts) == 2:
            return f"{pronoun} will {root_en}"

    # CONDITIONAL PERFECT
    if verb_form.endswith(" volna"):
        root_en = to_past(root_en)
        return f"{pronoun} would have {root_en}"

    # CONDITIONAL
    if "conditional" in tense_lower and not verb_form.endswith(" volna"):
        return f"{pronoun} would {root_en}"

    # PAST
    if "past" in tense_lower:
        root_en = to_past(root_en)

    # 3rd person singular present
    elif pronoun == "He":
        if root_en.endswith("y"):
            root_en = root_en[:-1] + "ies"
        elif root_en.endswith(("s","sh","ch","x","z")):
            root_en = root_en + "es"
        else:
            root_en = root_en + "s"

    return f"{pronoun} {root_en}"

# -------------------------------
# Scrape and write CSV
# -------------------------------
with open("verbs.csv","w",newline="",encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Verb","Tense","Form","Translation","Difficulty"])

    for verb in top_verbs:
        print(f"Scraping {verb}...")
        url = base_url + verb
        res = requests.get(url)
        soup = BeautifulSoup(res.text,"html.parser")

        tense_divs = soup.find_all("div",class_="tense-title")
        for tense_div in tense_divs:
            tense_name = tense_div.get_text(strip=True)

            forms = []
            sibling = tense_div.find_next_sibling()
            while sibling and len(forms)<6:
                meta = sibling.find("div",class_="meta-form")
                if meta:
                    forms.append(meta.get_text(strip=True))
                sibling = sibling.find_next_sibling()

            difficulty = get_difficulty(tense_name)

            for i, form in enumerate(forms):
                if tense_name:
                    translation = get_translation(form, verb, tense_name, position=i)
                    adjusted_verb = adjust_hungarian_verb(verb)
                    writer.writerow([adjusted_verb, tense_name, form, translation, difficulty])

        time.sleep(0.5)

print("Saved to verbs.csv")