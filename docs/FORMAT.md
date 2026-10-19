# FORMAT — Guide-TSSR + CCNA

Source de vérité : `content/*.json` chargés via `content/manifest.json`. Un fichier par section (`cp1.json`, etc.). Chaque section a `id`, `title`, `fiches[]` et optionnellement `quiz[]`.

## 1. Fiche (dans `content/cpN.json` > `fiches[]`)

Champs obligatoires : `id`, `t` (titre), `level` (`debutant`/`intermediaire`/`avance`/`exam`), `r` (synthèse), `g` (étapes/manipulations), `c` (commandes), `p` (pièges), `w` (ce que le test ne prouve pas).

Exemple réel (`content/cp1.json`) :
```json
{
  "id": "cp1-objectifs",
  "t": "Objectifs et lien avec la mise en situation professionnelle",
  "level": "exam",
  "cli": false,
  "r": "CP1 - Objectifs et lien MEP : ...",
  "tags": ["cp1", "support", "mep", "itil"],
  "g": ["Lire la MEP et le scénario", "Qualifier le symptôme"],
  "c": "Aucune commande native indispensable pour cette fiche théorique.",
  "p": ["Oublier le contexte métier", "Sauter la qualification"],
  "w": "Conclusion : CP1 se joue sur la méthode et la communication."
}
```

## 2. Fiche « essentiel » (première position du CP)

Même structure qu'une fiche, avec `id` suffixé `-essentiel`, champ `couvre` listant tous les IDs des autres fiches du CP, et un tableau `Je veux faire… | GUI | CLI | Vérification` intégré dans `r` ou `g`. Les fiches détaillées sont repliées et ont un champ `resume` (une phrase).

## 3. Question de QCM (dans `quiz[]`)

Champs : `id`, `fiche` (ID de fiche valide), `section`, `difficulty`, `q`, `choices[]`, `answer` (index), `explain`.

Exemple réel (`content/cp1.json`) :
```json
{
  "id": "cp1-qcm-01",
  "fiche": "cp1-objectifs",
  "section": "cp1",
  "difficulty": "examen",
  "q": "Quel resultat professionnel attendu du support utilisateur TSSR ?",
  "choices": ["Resoudre seul sans tracer", " Servir l'utilisateur et tracer le ticket"],
  "answer": 1,
  "explain": "Objectif du support : accueillir, diagnostiquer, tracer et valider."
}
```

## 4. Lab (dans `content/labs.json` ou section dédiée)

Champs : `id`, `title`, `section`, `level`, `duration`, `objective`, `prerequisites[]`, `steps[]`, `validation[]`, `troubleshooting[]`.

Exemple réel (`chunks/03-labs.js`) :
```json
{
  "id": "lab-vlan",
  "title": "Lab 1 · VLAN et trunk entre 2 switches",
  "section": "ccp4",
  "level": "intermediaire",
  "duration": "45 min",
  "objective": "Créer VLAN 10/20, trunk 802.1Q et vérifier la connectivité inter-VLAN via un routeur.",
  "prerequisites": ["Packet Tracer installé", "Connaissance IP de base"],
  "steps": ["Topologie : 2 switches, 1 routeur, 4 PC.", "Créer VLAN 10 (COMPTA)..."],
  "validation": ["show vlan brief affiche les VLAN", "Ping inter-VLAN OK"],
  "troubleshooting": ["Vérifier native VLAN", "Trunk allowed list incomplète"]
}
```

## 5. Entrée de glossaire (dans `content/glossary.json`)

Champs : `term`, `def`, `cat`.

Exemple réel (`chunks/05-glossary.js`) :
```json
{ "term": "ACL", "def": "Liste de contrôle d'accès filtrant le trafic réseau selon des critères.", "cat": "Réseau" }
```

## 6. Cheat sheet (dans `content/cheats.json`)

Champs : `title`, `intro`, `columns[]`, `rows[][]`.

Exemple réel (`chunks/06-cheats.js`) :
```json
{
  "title": "Windows / PowerShell — fondamentaux",
  "intro": "Commandes clés pour l'administration Windows et PowerShell.",
  "columns": ["Commande", "Usage"],
  "rows": [["Get-Command", "Lister les cmdlets disponibles"], ["Get-Help cmdlet -Full", "Aide complète d'une cmdlet"]]
}
```

## 7. Entrée de vocabulaire (dans `content/vocab.json` > `entries[]`)

Champs : `id`, `en`, `fr`, `section`, `fiabilite` (`sure` ou `a_verifier`).

Exemple réel (`content/vocab.json`) :
```json
{
  "id": "vocab-001",
  "en": "computer",
  "fr": "ordinateur",
  "section": "Logiciel et système",
  "fiabilite": "sure"
}
```

## Import de pack

`scripts/import-pack.js <fichier>` lit `sources/packs/<nom>.json` (UTF-8), valide le format, refuse toute collision d'ID, puis fusionne dans `content/`. Affiche les ajouts.