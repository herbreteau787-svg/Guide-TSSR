# Guide TSSR + CCNA — Édition Maximale

Site statique (HTML/CSS/JS) prêt pour GitHub Pages.

## Contenu
- `index.html` — structure de l'application
- `styles.css` — thème sombre/clair responsive
- `app.js` — logique applicative (navigation, recherche, QCM, labos, glossaire…)
- `data.js` — contenu complet (77 fiches, 140 questions, 16 labos, 155 termes, cheat sheets, etc.)

## Déploiement sur GitHub Pages
1. Copier `index.html`, `styles.css`, `app.js`, `data.js` (et `CCNA1.pdf`) à la racine du dépôt.
2. Commit + push sur la branche `main`.
3. Settings → Pages → Deploy from branch `main` / root.

## Dossiers utiles
- `chunks/` : sources de contenu pour régénérer `data.js` (`node build-data.js`).
- `build-data.js` : agrège les chunks en `data.js`.

## Personnalisation
- Ajouter/modifier des fiches dans `chunks/` puis relancer `node build-data.js`.
- La progression est stockée dans `localStorage` du navigateur (export depuis le site).