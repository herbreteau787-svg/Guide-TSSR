const G = window.GUIDE;
G.methods = G.methods || [];
G.methods.push(...[
 {
  title:"Méthode MSP (dossier pro)", type:"workflow",
  steps:[
   "Comprendre le besoin et le contexte.",
   "Maquetter à petite échelle et valider.",
   "Déployer avec une documentation précise.",
   "Tester et collecter des preuves.",
   "Présenter au jury avec justification."
  ]
 },
 {
  title:"Plan de révision 30 jours", type:"plan",
  steps:[
   "J1-5 : Support + Windows",
   "J6-10 : Linux + scripting",
   "J11-15 : Réseau + Cisco",
   "J16-20 : Virtualisation + pfSense",
   "J21-24 : Sauvegarde + déploiement",
   "J25-27 : ToIP + DMZ + supervision",
   "J28-29 : Examens blancs",
   "J30 : Repos + relecture des Warn"
  ]
 },
 {
  title:"Structure de présentation orale", type:"template",
  steps:[
   "Contexte et besoin",
   "Choix techniques argumentés",
   "Démonstration / preuves",
   "Difficultés rencontrées et corrections",
   "Améliorations futures"
  ]
 },
 {
  title:"Checklist documentation", type:"checklist",
  steps:[
   "Schéma réseau à jour",
   "Configurations sauvegardées",
   "Tests ping/tracert/captures",
   "Tableau RPO/RTO",
   "Plan d'adressage",
   "Comptes et droits",
   "Procédure de restore"
  ]
 }
]);