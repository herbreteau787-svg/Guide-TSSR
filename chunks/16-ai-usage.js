const G = window.GUIDE;
G.sections = G.sections || [];
G.sections.push({
 id:"ia-usage", group:"TSSR", icon:"🤖", title:"CP1 – Exploiter l’IA et encadrer son usage", desc:"Pratiques IA responsables et RGPD.", fiches:[
  { id:"ia-privacy", t:"Confidentialité et données sensibles avant IA", level:"debutant", r:"Ne jamais transmettre de données personnelles ou sensibles (IP internes, jetons, comptes) sans anonymisation.", tags:["ia","rgpd","privacy"], g:["Identifier les données personnelles","Anonymiser ou masquer","Vérifier la politique d'usage"], c:`# Contrôles avant envoi
# - supprimer noms/utilisateurs, IP, secrets, tokens
# - garder uniquement les logs nécessaires`, p:["RGPD : minimisation","Règles internes","Conservation maîtrisée"], w:"Divulgation de données = incident RGPD." },
  { id:"ia-prompt", t:"Rédiger un bon prompt de diagnostic", level:"intermediaire", r:"Contexte, symptômes, tests déjà faits, format attendu, données minimales.", tags:["ia","prompt"], g:["Décrire le contexte","Lister les symptômes","Indiquer les tests réalisés","Préciser la sortie attendue"], c:`# Exemple
Contexte: serveur VPN sur pfSense, utilisateurs distants.
Symptômes: déconnexions toutes les 5 min.
Tests: ping OK, logs IKE.
Format: causes probables + commandes de vérification.`, p:["Pas de données sensibles","Demander des sources"], w:"Un prompt flou donne un diagnostic faux." },
  { id:"ia-verify", t:"Vérifier le diagnostic proposé par l’IA", level:"intermediaire", r:"Comparer avec les journaux, reproduire, tester les hypothèses avant correction.", tags:["ia","verification"], g:["Croiser avec les logs","Prioriser les causes probables","Tester dans un environnement sûr"], c:`# Commandes typiques
ping 192.168.1.1
nslookupsrv1.tssr.local
journalctl -u vpn -n 50`, p:["Documenter la démarche","Distinguer proposition vs diagnostic"], w:"L’IA peut être plausible mais fausse." },
  { id:"ia-bias", t:"Biais, erreurs plausibles et sensibilisation", level:"debutant", r:"L’IA peut inventer, simplifier ou être biaisée ; sensibiliser les utilisateurs.", tags:["ia","biais"], g:["Former à la vérification","Donner des exemples concrets","Encadrer l’usage"], c:`# Risques
- hallucination
- données périmées
- biais d’entraînement`, p:["Gouvernance","Confidentialité"], w:"Toujours valider avant application." }
 ]
});
const groupRank = { 'TSSR': 0, 'CCNA': 1, 'Examens': 2 };
G.sections.sort((a, b) => (groupRank[a.group] ?? 9) - (groupRank[b.group] ?? 9));