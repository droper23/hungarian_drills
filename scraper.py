import requests
from bs4 import BeautifulSoup
import csv
import time

# Top 50-100 verbs (infinitive forms)
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

# Hungarian infinitive -> English root translation
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

verbs_no_ni = [verb[:-2] if verb.endswith("ni") else verb for verb in top_verbs]

base_url = "https://cooljugator.com/hu/"

# Assign difficulty
def get_difficulty(tense_name):
    tense_name_lower = tense_name.lower()
    if "present" in tense_name_lower and not "conditional" in tense_name_lower and not "subjunctive" in tense_name_lower:
        return "beginner"
    elif "past" in tense_name_lower or "conditional" in tense_name_lower:
        return "intermediate"
    else:
        return "advanced"

# Map Hungarian verb endings to pronouns (longer endings first)
pronoun_map = {
    "tok": "You all",
    "etek": "You all",
    "étek": "You all",
    "tek": "You all",
    "tök": "You all",

    "om": "I",
    "ok": "I",
    "ök": "I",
    "öm": "I",
    "tam": "I",
    "tem": "I",
    "nék": "I",
    "ném": "I",
    "nám": "I",
    "jak": "I",
    "jam": "I",

    "öl": "You",
    "el": "You",
    "ed": "You",
    "sz": "You",
    "od": "You",
    "tál": "You",
    "öd": "You",
    "tél": "You",
    "ad": "You",
    "nél": "You",
    "néd": "You",
    "nál": "You",
    "nád": "You",
    "j": "You",

    "ja": "He",
    "i": "He",
    "t": "He",
    "ta": "He",
    "te": "He",
    "na": "He",
    "ná": "He",
    "ne": "He",
    "né": "He",
    "n": "He",
    "gye": "He",

    "uk": "We",
    "ük": "We",
    "nk": "We",

    "nek": "They",
    "ik": "They",
    "ják": "They",
    "tak": "They",
    "nak": "They",

}

def get_translation(form, root_verb, tense_name):
    root_en = root_translations.get(root_verb, root_verb)
    tense_lower = tense_name.lower()
    pronoun = None

    # --------------------------------------------------
    # 1️⃣ Handle FUTURE: fog + infinitive
    # --------------------------------------------------
    if form.startswith("fog "):
        parts = form.split()
        if len(parts) == 2 and parts[1].endswith("ni"):
            aux = parts[0]

            for ending in sorted(pronoun_map.keys(), key=len, reverse=True):
                if aux.endswith(ending):
                    pronoun = pronoun_map[ending]
                    break

            return f"{pronoun} will {root_en}"

    # --------------------------------------------------
    # 2️⃣ Handle CONDITIONAL PERFECT: volna
    # --------------------------------------------------
    if form.endswith(" volna"):
        base = form.replace(" volna", "")

        for ending in sorted(pronoun_map.keys(), key=len, reverse=True):
            if base.endswith(ending):
                pronoun = pronoun_map[ending]
                break

        return f"{pronoun} would have {root_en}"

    # --------------------------------------------------
    # 3️⃣ Special Rule: -tek = They ONLY in past tense
    # --------------------------------------------------
    if "past" in tense_lower and form.endswith("tek"):
        pronoun = "They"

    if "subjunctive" in tense_lower and form.endswith("d"):
        pronoun = "You"

    # --------------------------------------------------
    # 4️⃣ Normal Suffix Matching
    # --------------------------------------------------
    if not pronoun:
        for ending in sorted(pronoun_map.keys(), key=len, reverse=True):
            if form.endswith(ending):
                pronoun = pronoun_map[ending]
                break

    # Fallback
    if not pronoun:
        pronoun = "He"

    # --------------------------------------------------
    # 5️⃣ English Verb Adjustment
    # --------------------------------------------------
    if "past" in tense_lower:
        root_en = root_en + "ed"

    elif pronoun == "He":
        if root_en.endswith("y"):
            root_en = root_en[:-1] + "ies"
        elif root_en.endswith(("s", "sh", "ch", "x", "z")):
            root_en = root_en + "es"
        else:
            root_en = root_en + "s"

    return f"{pronoun} {root_en}"

# Write CSV
with open("top_100_hungarian_verbs_with_translation.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Verb", "Tense", "Form", "Translation", "Difficulty"])

    for verb in verbs_no_ni:
        print(f"Scraping {verb}...")
        url = base_url + verb
        res = requests.get(url)
        soup = BeautifulSoup(res.text, "html.parser")

        tense_divs = soup.find_all("div", class_="tense-title")
        for tense_div in tense_divs:
            tense_name = tense_div.get_text(strip=True)

            # Only look at siblings after tense-title
            forms = []
            sibling = tense_div.find_next_sibling()
            while sibling and len(forms) < 6:
                meta = sibling.find("div", class_="meta-form")
                if meta:
                    forms.append(meta.get_text(strip=True))
                sibling = sibling.find_next_sibling()

            difficulty = get_difficulty(tense_name)

            for form in forms:
                if tense_name:
                    translation = get_translation(form, verb, tense_name)
                    writer.writerow([verb, tense_name, form, translation, difficulty])

        time.sleep(0.5)

print("Saved to top_100_hungarian_verbs_with_translation.csv")



#
# import requests
# from bs4 import BeautifulSoup
# import csv
# import time
#
# # Top 100 most common Hungarian verbs (infinitive forms)
# top_verbs = [
#     "elfogad", "hozzáad", "megenged", "válaszol", "megérkez",
#     "kérdez", "lesz", "vál", "hisz", "tör", "hoz", "vesz",
#     "hív", "változtat", "választ", "tisztít", "bezár",
#     "jön", "visszajön", "folytat", "főz", "számol", "sír",
#     "vág", "dönt", "csinál", "vezet", "eszik", "belép",
#     "repül", "néz", "lát", "mond", "vesz", "készít",
#     "tud", "gondol", "kap", "fizet", "szeret", "vár",
#     "segít", "kér", "ad", "gyakorol", "iszik"
# ]
#
# verbs_no_ni = [verb[:-2] if verb.endswith("ni") else verb for verb in top_verbs]
#
# base_url = "https://cooljugator.com/hu/"
#
# # Simple function to assign difficulty based on tense
# def get_difficulty(tense_name):
#     tense_name_lower = tense_name.lower()
#     if "present" in tense_name_lower:
#         return "beginner"
#     elif "past" in tense_name_lower or "conditional" in tense_name_lower:
#         return "intermediate"
#     else:
#         return "advanced"
#
# # Simple placeholder for translation (you could replace with Glosbe API)
# def get_translation(hun_form):
#     # For now, just make a basic "I/You/He ..." placeholder
#     # For more advanced, use Glosbe or another translation API
#     pronouns = {
#         "ok": "I",
#         "sz": "You (singular)",
#         "unk": "We",
#         "tok": "You (plural)",
#         "nak": "They",
#         "om": "I",
#         "od": "You",
#         "ja": "He/She",
#         "juk": "We",
#         "játok": "You (plural)",
#         "ják": "They",
#         "tam": "I",
#         "tál": "You",
#         "ott": "He/She",
#         "tunk": "We",
#         "tátok": "You (plural)",
#         "tak": "They"
#     }
#     for key, pron in pronouns.items():
#         if hun_form.endswith(key):
#             return f"{pron} {hun_form}"
#     return hun_form  # fallback
#
# # Write CSV with Translation and Difficulty
# with open("top_100_hungarian_verbs_with_difficulty.csv", "w", newline="", encoding="utf-8") as f:
#     writer = csv.writer(f)
#     writer.writerow(["Verb", "Tense", "Form", "Translation", "Difficulty"])
#
#     for verb in verbs_no_ni:
#         print(f"Scraping {verb}...")
#         url = base_url + verb
#         res = requests.get(url)
#         soup = BeautifulSoup(res.text, "html.parser")
#
#     # Find all tense sections by class
#         tense_divs = soup.find_all("div", class_="tense-title")
#         for tense_div in tense_divs:
#             tense_name = tense_div.get_text(strip=True)
#
#             # Only look at siblings after this tense-title
#             forms = []
#             sibling = tense_div.find_next_sibling()
#             while sibling and len(forms) < 6:
#                 meta = sibling.find("div", class_="meta-form")
#                 if meta:
#                     forms.append(meta.get_text(strip=True))
#                 sibling = sibling.find_next_sibling()
#
#             difficulty = get_difficulty(tense_name)
#
#             for form in forms:
#                 if tense_name:
#                     translation = get_translation(form)
#                     writer.writerow([verb, tense_name, form, translation, difficulty])
#
#         time.sleep(0.5)
#
# print("Saved to top_100_hungarian_verbs_with_difficulty.csv")