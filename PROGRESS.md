# PROGRESS — Guide-TSSR + CCNA (refonte-wip)

## État des phases
- Phase 0 : terminée (support PDF continu, cache v13, supports PDF uniquement, docs/FORMAT.md, scripts/import-pack.js, validate-content 0 issue).
- Phase A (vocabulaire) : terminée. 554 entrées (site comme modèle d'organisation/couverture + manuel), sections par typologie, EN | FR, recherche, menu par section, flashcards/quiz.
- Phase 1 (unification des sources) : terminée. labs (16), glossaire (155), cheat sheets (36, 846 lignes), ressources (10) migrés vers content/*.json ; data.js, build-data.js, chunks/ supprimés ; index.html ne référence plus data.js ; validate-content 0 issue.
- Phase 3a (pilote CP1/CP2 essentiel) : en cours. cp1-essentiel et cp2-essentiel ajoutés, champ resume ajouté aux fiches détaillées, validateur couvre/resume ajouté.

## Stats (scripts/stats.js)
- Fiches : 319
- Questions QCM : 64
- Vocabulaire : 554
- Labos : 16
- Glossaire : 155
- Cheat sheets : 36 (846 lignes)
- Ressources : 10
- Supports : 2

## Vocabulaire par section (ordre d'affichage)
- Support utilisateur et tickets (ITIL) : 31
- Phrases types : 45
- Verbes de travail : 21
- Dépannage et support : 21
- Réseau et infrastructure : 62
- Windows et Active Directory : 49
- Linux et administration : 52
- Virtualisation et cloud : 47
- Sauvegarde et supervision : 15
- Cybersécurité : 50
- Matériel : 32
- Logiciel et système : 41
- Internet et Web : 15
- Développement : 11
- Expressions et idiomes professionnels : 12
- Abréviations : 33
- Faux amis et confusions : 15

## Entrées marquées a_verifier (4)
- vocab-004 | device => appareil / périphérique — "appareil" ou "périphérique" selon le contexte.
- vocab-013 | desktop => bureau (interface) — désigne soit l'interface, soit l'ordinateur fixe.
- vocab-123 | glitch => anomalie (défaut mineur et passager) — traduction variable (anomalie, dysfonctionnement, bug mineur).
- vocab-124 | lag => latence / décalage d'affichage — peut désigner la latence réseau ou le décalage d'affichage.

## Vérification navigateur (réelle, localhost:8765)
- Onglet ouvert via tools.browser.tabs.open ; clics sur les 7 onglets (Cours, QCM, Labos, Glossaire, Cheat sheets, Vocabulaire Anglais, Support cours) ; console sans erreur (0 erreur). Aucune vérification visuelle approfondie du rendu n'a été effectuée au-delà de l'absence d'erreur console.

## Points ouverts
- Phase 3a : UI essentiel/repliée et bouton Tout déplier/replier implémentés ; validateur couvre/resume ajouté.
- Commandes à vérifier : commandes marquées À VÉRIFIER dans cp1-essentiel et cp2-essentiel.