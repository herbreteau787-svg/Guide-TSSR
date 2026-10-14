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
 },
 {
  title:"Procédure : création d'utilisateur (AD + poste)", type:"procedure",
  steps:[
   "Créer compte AD (New-ADUser) dans OU correcte",
   "Ajouter aux groupes métiers (AGDLP)",
   "Définir mot de passe temporaire + forcer changement",
   "Vérifier licence/mailbox si applicable",
   "Joindre le poste au domaine si nécessaire",
   "Tester ouverture session + GPO",
   "Documenter dans le ticket et base de connaissances"
  ]
 },
 {
  title:"Procédure : incident réseau (poste sans internet)", type:"procedure",
  steps:[
   "Vérifier voyants, câble, Wi-Fi activé",
   "ipconfig /all (IP, gateway, DNS)",
   "Ping 127.0.0.1, gateway, 8.8.8.8, nom DNS",
   "nslookup du nom cible",
   "Vérifier état de la carte (Device Manager)",
   "Renouveler DHCP si IP APIPA (169.254)",
   "Purger cache DNS, tester navigateur",
   "Escalader avec captures si persistant"
  ]
 },
 {
  title:"Procédure : reset mot de passe verrouillé", type:"security",
  steps:[
   "Vérifier identité (badge + manager)",
   "Débloquer le compte (Unlock-ADAccount)",
   "Réinitialiser MDP temporaire robuste",
   "Forcer changement à prochaine ouverture",
   "Envoyer MDP par canal séparé",
   "Vérifier tentative répétée (verrouillage) et déconnecter sessions",
   "Journaliser dans ticket"
  ]
 },
 {
  title:"Procédure : dépannage DNS/DHCP", type:"procedure",
  steps:[
   "Vérifier service DNS/DHCP actif",
   "Contrôler étendue et options (gateway/DNS)",
   "Tester nslookup depuis client et serveur",
   "Vérifier enregistrements A/PTR",
   "Clear-DnsServerCache et scavenging",
   "Vérifier baux DHCP et conflits",
   "Redémarrer services si stale",
   "Documenter cause racine"
  ]
 },
 {
  title:"Procédure : sauvegarde et test de restore", type:"procedure",
  steps:[
   "Définir RPO/RTO par service",
   "Lancer backup (job planifié)",
   "Vérifier logs de succès",
   "Restaurer un fichier test et une VM",
   "Valider l'intégrité (hash, application)",
   "Conserver hors ligne/immuable",
   "Mettre à jour le registre des sauvegardes"
  ]
 },
 {
  title:"Procédure : déploiement VLAN Cisco", type:"procedure",
  steps:[
   "Créer VLAN et nommer",
   "Affecter ports d'accès (switchport access vlan X)",
   "Configurer trunk avec allowed VLAN",
   "Mettre à jour VLAN natif (99)",
   "Tester inter-VLAN via SVI/routeur",
   "Vérifier STP et EtherChannel",
   "Sauvegarder startup-config",
   "Documenter le plan de VLAN"
  ]
 },
 {
  title:"Procédure : durcissement serveur Linux", type:"security",
  steps:[
   "Mettre à jour le système",
   "Désactiver root login SSH",
   "Activer authentification par clé",
   "Configurer UFW/firewalld",
   "Installer Fail2ban",
   "Désactiver services inutiles",
   "Vérifier permissions sudo",
   "Lancer audit (lynis, aide)",
   "Planifier mises à jour automatiques"
  ]
 },
 {
  title:"Procédure : diagnostic performance Linux", type:"procedure",
  steps:[
   "uptime et load average",
   "top/htop (CPU/RAM/processus)",
   " free -h ; vmstat",
   "iostat -xz 1",
   "df -h / du -sh",
   "ss -s / lsof",
   "journalctl -p err",
   "Identifier processus gourmand et service associé",
   "Corriger et surveiller"
  ]
 },
 {
  title:"Procédure : migration serveur Windows", type:"procedure",
  steps:[
   "Inventaire applications et dépendances",
   "Sauvegarde configuration et données",
   "Préparer nouveau serveur (rôles, IP, nom)",
   "Transférer données (robocopy/rsync)",
   "Mettre à jour DNS et clients",
   "Tests fonctionnels et performance",
   "Coupe et bascule",
   "Post-mortem et documentation"
  ]
 },
 {
  title:"Procédure : gestion d'incident (ITIL)", type:"workflow",
  steps:[
   "Détection et enregistrement",
   "Catégorisation et priorisation",
   "Diagnostic initial",
   "Escalade si nécessaire",
   "Résolution et contournement",
   "Clôture et validation utilisateur",
   "Analyse post-incident (PIR)"
  ]
 }
]);
