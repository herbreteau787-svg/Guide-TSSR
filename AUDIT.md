# AUDIT — Guide-TSSR

Date d'audit : 2026-10-16 (phase 0, aucune modification fonctionnelle au-delà de cet audit).

## A. Structure actuelle

- Frontend statique (GitHub Pages) : `index.html`, `app.js`, `styles.css`, `data.js`, `sw.js`, manifest.
- Contenu généré par `build-data.js` depuis des chunks JS : `chunks/01...`, `chunks/16...`, `chunks/17...`, `chunks/18-toip.js`, `chunks/20...29`.
- Onglets actuels : Cours, QCM, Labos, Glossaire, Cheat sheets, Vocabulaire Anglais, Support cours.
- Progression / favoris / scores stockés en `localStorage` (app.js).
- Sections actuelles dans `data.js` : CP1..CP10, `ccna`, `ccp12`, `exemples`, `exam`, `ccna-itn`, `toip`.

## B. Problèmes constatés

1. Mélange des contenus par CP : les titres et fiches CP1..CP10 sont historiques/de courte durée ; CP8 et CP9 portent des noms qui ne correspondent pas à la répartition 2026 demandée.
2. ToIP est dupliqué : il existe à la fois `chunks/18-toip.js`, des références CP4 et `ccp10 · VoIP, DMZ.
3. Les 15 à 30 fiches par CP ont été ajoutées, mais elles restent souvent synthétiques et partagent des images génériques.
4. La portabilité mobile / validation images / CLI strict dépend des champs `cli` et `img`, parfois hétérogènes.
5. Le vocabulaire anglais existe et reste à auditer/traduire (corrections déjà prévues en phase 4 : basic terminology, fixed bad literals, false friends).
6. Un paramètre `ccna-itn` embarque un texte de support volumineux en une seule fiche; le chapitre Vocabulaire TSSR est présent mais noyé.
7. L'onglet Support cours affiche des liens mais dépend du fichier `Fiche_Revision_ITNv7.docx` (désormais présent dans la repo courante).

## C. Données sources analysées

Fichiers effectivement présents dans le dossier de travail :

- `REAC TP TSSR.pdf` : référentiel / mise en situation pour les types de compétences TSSR.
- `TSSR_2023_Questionnaire_professionnel.pdf`, `TSSR_NR_Questionnaire_professionnel*.pdf`, `TSSR_NR_Corrige...`.
- `Déploiement CCME.pdf`, `live_toip_26_et_28_mai_2026.pdf` : ToIP, Cisco CME, VLAN Voix/Data, DHCP option 150, ephone-dn, CDP/LLDP, QoS, SIP/SCCP.
- `Fiche_Revision_ITNv7.docx` : CCNA / ITN.
- `Guide_Mural_TSSR_Complet.docx`, `Guide_Commandes_TSSR (1).docx` : fiches et commandes.
- `CCNA1.pdf` : support Cisco ITN.
- Le fichier spécifiquement mentionné `Question_TSSR.pdf` et `TSSR_Revision_Complete.pdf` ne correspond pas exactement au nom local; ils ont été rapprochés des fichiers questionnaire et supports respectifs.

Les documents suivants sont hors périmètre TSSR et ne doivent pas être mélangés au cours : tout livret d'admission AIS ou document administratif non professionnel.

## D. Plan de la nouvelle architecture (phase 1)

- Chaque CP dans `content/CPx.md` (ou `content/cpX.json`), chargé dynamiquement par `app.js`.
- 9 blocs de compétences 2026 :
  - CP1 Support utilisateur en centre de services (ITIL, tickets, ToIP côté utilisateur)
  - CP2 Serveurs Windows et domaine Active Directory
  - CP3 Serveurs Linux
  - CP4 Réseau IP (adressage, VLAN, routage, DNS/DHCP, diagnostic ; chapitre ToIP/CME inclus ici)
  - CP5 Serveurs en infrastructure virtualisée
  - CP6 Automatisation par scripts (PowerShell, Bash, optimisation avec l'IA)
  - CP7 Accès Internet et interconnexions sécurisés (pare-feu, DMZ, VPN, proxy)
  - CP8 Sauvegardes et restaurations (3-2-1, RTO/RPO, PRA)
  - CP9 Déploiement des postes de travail
  - Transverse : usage encadré de l'IA et outils collaboratifs (2026).
- Chaque CP contiendra objectifs, synthèse, schémas (SVG/Mermaid), GUI, CLI, vérification, pièges, mini-QCM 5 questions.
- ToIP/CME reste uniquement dans CP4, pas en section séparée. CCNA 1/2/3 reste une section distincte des CP et clairement identifiée.
- Support cours : affichage et consultation dans le site (PDF.js / HTML converti) sans téléchargement obligatoire.
- Glossaire français et Vocabulaire EN/FR séparés ; pas de doublon.
- Script de validation node exécuté avant chaque commit.

## E. Corrections déjà identifiées

- `tephone-dn 1` -> `ephone-dn 1`
- `auto assign 1 to 5exit` -> retour à la ligne manquant
- `Asterix` -> `Asterisk`
- `Slection Direct` -> `Sélection Directe à l'Arrivée (SDA)`
- Config CME incomplète : manque `create cnf-files`, DHCP VLAN 20, routage inter-VLAN.
- Ces corrections seront portées dans la refonte CP4 et AUDIT.md sera complété au fur et à mesure.

## F. Prochaine étape

Commit/push de phase 0 puis attente du "ok" utilisateur pour la phase 1 (architecture).