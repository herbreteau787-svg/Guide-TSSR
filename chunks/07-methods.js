const G = window.GUIDE;
G.methods = G.methods || [];
G.methods.push(...[
 {
  title:"M�thode MSP (dossier pro)", type:"workflow",
  steps:[
   "Comprendre le besoin et le contexte.",
   "Maquetter � petite �chelle et valider.",
   "D�ployer avec une documentation pr�cise.",
   "Tester et collecter des preuves.",
   "Pr�senter au jury avec justification."
  ]
 },
 {
  title:"Plan de r�vision 30 jours", type:"plan",
  steps:[
   "J1-5 : Support + Windows",
   "J6-10 : Linux + scripting",
   "J11-15 : R�seau + Cisco",
   "J16-20 : Virtualisation + pfSense",
   "J21-24 : Sauvegarde + d�ploiement",
   "J25-27 : ToIP + DMZ + supervision",
   "J28-29 : Examens blancs",
   "J30 : Repos + relecture des Warn"
  ]
 },
 {
  title:"Structure de pr�sentation orale", type:"template",
  steps:[
   "Contexte et besoin",
   "Choix techniques argument�s",
   "D�monstration / preuves",
   "Difficult�s rencontr�es et corrections",
   "Am�liorations futures"
  ]
 },
 {
  title:"Checklist documentation", type:"checklist",
  steps:[
   "Sch�ma r�seau � jour",
   "Configurations sauvegard�es",
   "Tests ping/tracert/captures",
   "Tableau RPO/RTO",
   "Plan d'adressage",
   "Comptes et droits",
   "Proc�dure de restore"
  ]
 },
 {
  title:"Proc�dure : cr�ation d'utilisateur (AD + poste)", type:"procedure",
  steps:[
   "Cr�er compte AD (New-ADUser) dans OU correcte",
   "Ajouter aux groupes m�tiers (AGDLP)",
   "D�finir mot de passe temporaire + forcer changement",
   "V�rifier licence/mailbox si applicable",
   "Joindre le poste au domaine si n�cessaire",
   "Tester ouverture session + GPO",
   "Documenter dans le ticket et base de connaissances"
  ]
 },
 {
  title:"Proc�dure : incident r�seau (poste sans internet)", type:"procedure",
  steps:[
   "V�rifier voyants, c�ble, Wi-Fi activ�",
   "ipconfig /all (IP, gateway, DNS)",
   "Ping 127.0.0.1, gateway, 8.8.8.8, nom DNS",
   "nslookup du nom cible",
   "V�rifier �tat de la carte (Device Manager)",
   "Renouveler DHCP si IP APIPA (169.254)",
   "Purger cache DNS, tester navigateur",
   "Escalader avec captures si persistant"
  ]
 },
 {
  title:"Proc�dure : reset mot de passe verrouill�", type:"security",
  steps:[
   "V�rifier identit� (badge + manager)",
   "D�bloquer le compte (Unlock-ADAccount)",
   "R�initialiser MDP temporaire robuste",
   "Forcer changement � prochaine ouverture",
   "Envoyer MDP par canal s�par�",
   "V�rifier tentative r�p�t�e (verrouillage) et d�connecter sessions",
   "Journaliser dans ticket"
  ]
 },
 {
  title:"Proc�dure : d�pannage DNS/DHCP", type:"procedure",
  steps:[
   "V�rifier service DNS/DHCP actif",
   "Contr�ler �tendue et options (gateway/DNS)",
   "Tester nslookup depuis client et serveur",
   "V�rifier enregistrements A/PTR",
   "Clear-DnsServerCache et scavenging",
   "V�rifier baux DHCP et conflits",
   "Red�marrer services si stale",
   "Documenter cause racine"
  ]
 },
 {
  title:"Proc�dure : sauvegarde et test de restore", type:"procedure",
  steps:[
   "D�finir RPO/RTO par service",
   "Lancer backup (job planifi�)",
   "V�rifier logs de succ�s",
   "Restaurer un fichier test et une VM",
   "Valider l'int�grit� (hash, application)",
   "Conserver hors ligne/immuable",
   "Mettre � jour le registre des sauvegardes"
  ]
 },
 {
  title:"Proc�dure : d�ploiement VLAN Cisco", type:"procedure",
  steps:[
   "Cr�er VLAN et nommer",
   "Affecter ports d'acc�s (switchport access vlan X)",
   "Configurer trunk avec allowed VLAN",
   "Mettre � jour VLAN natif (99)",
   "Tester inter-VLAN via SVI/routeur",
   "V�rifier STP et EtherChannel",
   "Sauvegarder startup-config",
   "Documenter le plan de VLAN"
  ]
 },
 {
  title:"Proc�dure : durcissement serveur Linux", type:"security",
  steps:[
   "Mettre � jour le syst�me",
   "D�sactiver root login SSH",
   "Activer authentification par cl�",
   "Configurer UFW/firewalld",
   "Installer Fail2ban",
   "D�sactiver services inutiles",
   "V�rifier permissions sudo",
   "Lancer audit (lynis, aide)",
   "Planifier mises � jour automatiques"
  ]
 },
 {
  title:"Proc�dure : diagnostic performance Linux", type:"procedure",
  steps:[
   "uptime et load average",
   "top/htop (CPU/RAM/processus)",
   " free -h ; vmstat",
   "iostat -xz 1",
   "df -h / du -sh",
   "ss -s / lsof",
   "journalctl -p err",
   "Identifier processus gourmand et service associ�",
   "Corriger et surveiller"
  ]
 },
 {
  title:"Proc�dure : migration serveur Windows", type:"procedure",
  steps:[
   "Inventaire applications et d�pendances",
   "Sauvegarde configuration et donn�es",
   "Pr�parer nouveau serveur (r�les, IP, nom)",
   "Transf�rer donn�es (robocopy/rsync)",
   "Mettre � jour DNS et clients",
   "Tests fonctionnels et performance",
   "Coupe et bascule",
   "Post-mortem et documentation"
  ]
 },
 {
  title:"Proc�dure : gestion d'incident (ITIL)", type:"workflow",
  steps:[
   "D�tection et enregistrement",
   "Cat�gorisation et priorisation",
   "Diagnostic initial",
   "Escalade si n�cessaire",
   "R�solution et contournement",
   "Cl�ture et validation utilisateur",
   "Analyse post-incident (PIR)"
  ]
 }
]);
