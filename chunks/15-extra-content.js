const G = window.GUIDE;
G.sections = G.sections || [];
G.sections.push(
{
 id:"procedures", group:"TSSR", icon:"🛠️", title:"Procédures pas à pas (mise en situation)", desc:"Installation et configuration des services clés.", fiches:[
  { id:"proc-ad", t:"Installer et configurer AD DS (forêt)", level:"intermediaire", r:"Deux DC minimum, DNS intégré, NTP synchronisé.", tags:["ad","procedure"], g:["Gestionnaire de serveur > AD DS + DNS","Promouvoir : nouvelle forêt tssr.local","DSRM, niveau fonctionnel, création des OU","Vérifier dcdiag et réplication"], c:`Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
Install-ADDSForest -DomainName tssr.local -InstallDns
dcdiag /q
repadmin /replsummary`, p:["NTP synchronisé","Sauvegarde AD autorité","Documentation du schéma"], w:"Un seul DC en production = risque majeur." },
  { id:"proc-dns", t:"Configurer DNS AD intégré", level:"intermediaire", r:"Zones directes/inverses, records, scavenging et cache.", tags:["dns","procedure"], g:["AD DS installe DNS","Créer zone tssr.local + inverse","Enregistrer A/PTR des serveurs","Activer scavenging"], c:`Add-DnsServerPrimaryZone -Name tssr.local -ZoneFile tssr.local.dns -DynamicUpdate Secure
Add-DnsServerResourceRecordA -Name srv1 -ZoneName tssr.local -IPv4Address 192.168.1.20
Clear-DnsServerCache`, p:["DNS pointe vers le DC","Retention 14-30 jours","Tester nslookup"], w:"Mauvais DNS côté client casse Kerberos." },
  { id:"proc-dhcp", t:"Configurer DHCP et options", level:"intermediaire", r:"Étendue, exclusions, réservations, option gateway/DNS.", tags:["dhcp","procedure"], g:["Installer rôle DHCP","Créer étendue avec masque","Définir options 003/006","Réserver les serveurs"], c:`Add-DhcpServerv4Scope -Name LAN -StartRange 192.168.1.100 -EndRange 192.168.1.200 -SubnetMask 255.255.255.0
Set-DhcpServerv4OptionValue -Router 192.168.1.1 -DnsServer 192.168.1.10
Add-DhcpServerv4Reservation -ScopeId 192.168.1.0 -IPAddress 192.168.1.50 -ClientId 00-11-22-33-44-55`, p:["Bail court pour Wi-Fi","Bascule DHCP en HA","Tester le bail"], w:"Le serveur doit être autorisé dans AD." },
  { id:"proc-gpo", t:"Déployer une GPO de base", level:"intermediaire", r:"Créer, lier et tester ; filtrer par groupe.", tags:["gpo","procedure"], g:["GPMC : nouvelle GPO liée à l'OU","Configurer paramètres ordinateur/utilisateur","gpupdate /force sur poste test","gpresult /r pour vérifier"], c:`New-GPO -Name "Base Postes"
gpupdate /force
gpresult /r | Out-File C:\\temp\\gpo.txt`, p:["LSDOU","Tester sur pilote","Documenter"], w:"Mauvais ciblage = déploiement massif erroné." },
  { id:"proc-shares", t:"Partages et droits NTFS (AGDLP)", level:"intermediaire", r:"User → Global → DomainLocal → Permission ; le plus restrictif gagne.", tags:["partage","ntfs","agdlp"], g:["Créer groupes Global (métier) et DomainLocal (ressource)","Appliquer NTFS + partage SMB","Tester accès autorisé/refusé","Documenter la matrice"], c:`New-SmbShare -Name Compta -Path D:\\Shares\\Compta -FullAccess "TSSR\\LD_PartageCompta"
icacls D:\\Shares\\Compta /grant "TSSR\\G_Compta:(RX)"
Get-SmbShare`, p:["Éviter Full Control Everyone","Audit trimestriel","Sauvegarder les ACL"], w:"Ne jamais donner contrôle total à Tout le monde." },
  { id:"proc-vlan", t:"VLAN, trunk et inter-VLAN", level:"intermediaire", r:"Créer VLAN, affecter ports, trunk et router-on-a-stick.", tags:["vlan","trunk","cisco"], g:["Créer VLAN et nommer","Ports d'accès","Trunk avec VLAN autorisés","Sous-interfaces dot1Q"], c:`vlan 10
 name COMPTA
interface f0/1
 switchport mode access
 switchport access vlan 10
interface f0/24
 switchport mode trunk`, p:["VLAN natif à changer","show interfaces trunk","Sauvegarder"], w:"Trunk mal autorisé coupe silencieusement." },
  { id:"proc-nat", t:"NAT/PAT et ACL de base", level:"intermediaire", r:"Sortie Internet via PAT, publications via NAT statique, filtrage par ACL.", tags:["nat","pat","acl"], g:["inside/outside","ACL sources","overload","Tester depuis l'extérieur"], c:`interface g0/0
 ip nat inside
interface g0/1
 ip nat outside
ip nat inside source list 1 interface g0/1 overload
ip access-list extended LAN-OUT`, p:["Logger les refus","Principe deny default","Tester en production"], w:"Exposer un serveur sans pare-feu = compromission." },
  { id:"proc-backup", t:"Sauvegarde et restauration test", level:"intermediaire", r:"3-2-1, immutabilité, test trimestriel.", tags:["backup","restore","pra"], g:["Définir RPO/RTO","Lancer backup","Restaurer fichier + VM","Valider intégrité"], c:`tar -czf /backup/etc-$(date +%F).tgz /etc
rsync -av --delete /data/ /backup/data/
borg create /backup/repo::backup-$(date +%F) /data`, p:["Copies hors ligne","Checksums","Alerte sur suppression"], w:"Sauvegarde non testée = inexistante." }
 ]
},
{
 id:"troubleshooting", group:"TSSR", icon:"🧠", title:"Arbres de dépannage et méthode couche par couche", desc:"Symptômes courants et diagnostic entonnoir.", fiches:[
  { id:"ts-nonet", t:"Aucun accès réseau (plan entonnoir)", level:"debutant", r:"Physique → IP → passerelle → DNS → Internet", tags:["troubleshoot","reseau"], g:["Voyants, câble, Wi-Fi, profil","ipconfig /all","Ping loopback → gateway → 8.8.8.8 → nom","nslookup si ping IP OK"], c:`ipconfig /all
ping 127.0.0.1
ping 192.168.1.1
ping 8.8.8.8
nslookup google.com`, p:["169.254 = APIPA (DHCP KO)","Ping IP OK mais nom KO = DNS","Tracert s'arrête passerelle = routage"], w:"Ne pas attribuer d'IP fixe sans diagnostic." },
  { id:"ts-domain", t:"Poste hors domaine", level:"intermediaire", r:"DNS du poste doit pointer vers le DC ; secure channel.", tags:["ad","poste"], g:["Vérifier DNS","Test-ComputerSecureChannel","Joindre à nouveau si besoin","GPO & OU"], c:`Test-ComputerSecureChannel
ipconfig /all
nltest /dsgetdc:tssr.local
gpresult /r`, p:["Heure < 5 min d'écart","Supprimer compte machine doublon","Garder compte local admin"], w:"Jonction réussie mais GPO absentes = vérifier l'emplacement OU." },
  { id:"ts-dns", t:"DNS ne résout pas", level:"intermediaire", r:"Tester client → serveur → zone → enregistrement → cache.", tags:["dns","diagnostic"], g:["Ping par IP puis par nom","nslookup explicite","Vérifier zone et A/PTR","Purger cache"], c:`ping 192.168.1.10
nslookup srv1.tssr.local
nslookup srv1.tssr.local 192.168.1.10
ipconfig /flushdns
Get-DnsServerResourceRecord -ZoneName tssr.local -Name srv1`, p:["Scavenging pour nettoyer","NTP pour cohérence","Dans AD, DNS = DC"], w:"Mauvais DNS côté client casse Kerberos." }
 ]
},
{
 id:"subnetting", group:"TSSR", icon:"🔢", title:"Subnetting, CIDR et plan d'adressage", desc:"Tables et méthode de calcul.", fiches:[
  { id:"sub-cidr", t:"Table CIDR à mémoriser", level:"debutant", r:"Hôtes = 2^h - 2, sauf /31 (RFC3021) et /32.", tags:["subnet","cidr"], g:["Apprendre /24→/30 par cœur","Utiliser sipcalc/ipcalc","Vérifier sur équipements"], c:`ipcalc 192.168.1.0/26
sipcalc 10.0.0.0/24`, p:["/24=254, /25=126, /26=62, /27=30, /28=14, /29=6, /30=2","VLSM selon besoin réel","Réseau+broadcast non utilisables"], w:"Apprendre la table pour l'examen." },
  { id:"sub-plan", t:"Exemple de plan d'adressage", level:"intermediaire", r:"Segmenter par VLAN/service, documenter.", tags:["plan","vlan"], g:["Lister VLAN et besoins","Affecter plages","Définir passerelles","Publier le plan"], c:`# VLAN10 Compta : 192.168.10.0/26 (62 hôtes)
# VLAN20 IT     : 192.168.20.0/26
# VLAN99 Mgmt   : 192.168.99.0/28
# Liens point-à-point /30`, p:["Réserver adresses serveurs","Éviter chevauchements","Mettre à jour le schéma"], w:"Un plan non documenté = chaos." }
 ]
},
{
 id:"security", group:"TSSR", icon:"🛡️", title:"Sécurité, durcissement et RGPD", desc:"Pratiques recommandées (ANSSI).", fiches:[
  { id:"sec-hygiene", t:"Hygiène de base (ANSSI)", level:"debutant", r:"Patcher, moindre privilège, MFA, sauvegardes, supervision.", tags:["securite","anssi"], g:["Mettre à jour OS/apps","Activer MFA admins","Chiffrer les disques","Durcir les services"], c:`# Linux
ufw enable
lynis audit system
# Windows
Get-MpComputerStatus`, p:["Référentiel ANSSI","Sensibilisation régulière","Audit périodique"], w:"La sécurité est un processus continu." },
  { id:"sec-passwords", t:"Mots de passe et MFA", level:"debutant", r:"Longs, uniques, coffre ; MFA obligatoire pour admin/distants.", tags:["mfa","password"], g:["Politique PW robuste","TOTP/FIDO2","Codes de secours","Revue d'accès"], c:`# Vérifier expiration
chage -l user
# AD PSO
Get-ADFineGrainedPasswordPolicy -Filter *`, p:["FIDO2 recommandé","Éviter SMS pour admins","Break-glass documenté"], w:"MFA sans secours bloque en cas de perte." },
  { id:"sec-backup", t:"Sauvegarde 3-2-1 et anti-ransomware", level:"intermediaire", r:"Copies hors ligne, immuables, testées, comptes isolés.", tags:["backup","anti-ransom"], g:["Copies offsite","Immutabilité","Test de restore","Alerte suppression"], c:`# Veeam immuable repository
# Borg append-only`, p:["RPO/RTO documentés","Snapshots court terme + backup long terme","Vérifier chaînes"], w:"Les sauvegardes connectées sont cibles prioritaires." },
  { id:"sec-rgpd", t:"RGPD et données personnelles", level:"intermediaire", r:"Recenser, minimiser, sécuriser, durée de conservation.", tags:["rgpd","conformite"], g:["Cartographier les données","Droits d'accès","Chiffrement au repos","Politique de rétention"], c:`# Vérifier partages et droits
icacls D:\\Shares /grant ...`, p:["DPO","Registre des traitements","Notification incident 72h"], w:"La conformité n'est pas optionnelle." }
 ]
},
{
 id:"cp-mapping", group:"TSSR", icon:"🗂️", title:"Correspondance REAC TSSR (CP1 à CP10)", desc:"Compétences du titre RNCP37682 et pages du site.", fiches:[
  { id:"cp1", t:"CP1 – Exploiter l’IA et encadrer son usage", level:"intermediaire", r:"IA, RGPD, données sensibles, biais, traçabilité.", tags:["cp1","ia"], g:["Questionnaire professionnel CP1","Sécurité & RGPD","Fiches de diagnostic"], c:`# Pages associées
securite, itil, scripts`, p:["Ne pas envoyer de données sensibles","Vérifier les diagnostics IA"], w:"L’IA assiste, elle ne décide pas." },
  { id:"cp2", t:"CP2 – Déploiement et outils collaboratifs", level:"intermediaire", r:"Postes, parc, MDT/WDS, inventaire, GLPI.", tags:["cp2"], g:["CCP9 déploiement","Oral/dossier pro","Cheat sheets"], c:`# Pages associées
ccp9, itil, scripts`, p:["Documentation des procédures"], w:"Tester avant la mise en production." },
  { id:"cp3", t:"CP3 – Assistance technique", level:"debutant", r:"Support, ticketing, communication client.", tags:["cp3"], g:["CCP1 support","ITIL","Arbre de dépannage"], c:`# Pages associées
ccp1, itil, troubleshooting`, p:["Validation utilisateur"], w:"Savoir reformuler le besoin." },
  { id:"cp4", t:"CP4 – Exploiter un réseau IP", level:"intermediaire", r:"OSI, VLAN, routage, NAT/ACL, services.", tags:["cp4"], g:["CCP4 + réseau","Cheat Cisco/Réseau","Subnetting"], c:`# Pages associées
ccp4, subnetting, troubleshooting`, p:["Tests couche par couche"], w:"Ne pas confondre IP et application." },
  { id:"cp5", t:"CP5 – Serveurs Windows et Linux", level:"intermediaire", r:"AD, DNS, DHCP, services, stockage.", tags:["cp5"], g:["CCP2, CCP3","Procédures","Cheat sheets"], c:`# Pages associées
ccp2, ccp3, procedures`, p:["Sauvegardes testées"], w:"Mauvais DNS casse Kerberos." },
  { id:"cp6", t:"CP6 – Virtualisation", level:"intermediaire", r:"ESXi/Hyper-V/Proxmox, snapshot ≠ backup.", tags:["cp6"], g:["CCP5","Exemples","Sauvegardes"], c:`# Pages associées
ccp5, exemples`, p:["HA/DRS","Tests restore"], w:"Snapshot n’est pas une sauvegarde." },
  { id:"cp7", t:"CP7 – Accès et sécurité hybride", level:"intermediaire", r:"IAM, MFA, pare-feu, VPN, durcissement.", tags:["cp7"], g:["CCP12 Sécurité","CCP7 pfSense","Cheat Réseau"], c:`# Pages associées
ccp7, security, ccp4`, p:["Moindre privilège","Logs centralisés"], w:"Les droits cumulés sont risqués." },
  { id:"cp8", t:"CP8 – Optimiser des scripts par IA", level:"avance", r:"Scripts, automatisation, IA (non évaluée selon questionnaire).", tags:["cp8"], g:["Scripts","Cheat sheets","Oral"], c:`# Pages associées
scripts, ccp6`, p:["Idempotence","Tests"], w:"Toujours tester avant prod." },
  { id:"cp9", t:"CP9 – Continuité et reprise", level:"intermediaire", r:"3-2-1, RPO/RTO, restore testé.", tags:["cp9"], g:["CCP8 sauvegardes","Sauvegarde 3-2-1","Sécurité"], c:`# Pages associées
ccp8, security`, p:["Immutabilité"], w:"Sauvegarde non testée = inexistante." },
  { id:"cp10", t:"CP10 – Mise à jour et supervision", level:"intermediaire", r:"Monitoring, patching, supervision sécurité.", tags:["cp10"], g:["CCP11","Cheat Supervision","ITIL"], c:`# Pages associées
ccp11, itil`, p:["Seuils et alertes","Maintenance windows"], w:"Surveiller avant la panne." }
 ]
},
{
 id:"oral", group:"TSSR", icon:"🎤", title:"Oral et dossier professionnel", desc:"Pitch, questions types et présentation.", fiches:[
  { id:"oral-pitch", t:"Pitch de 2 minutes", level:"intermediaire", r:"Contexte, besoin, choix, preuves, bilan.", tags:["oral","pitch"], g:["Situation client","Actions menées","Résultats mesurables","Améliorations"], c:`# Structure
1. Contexte
2. Problème
3. Solution
4. Preuves
5. Bilan`, p:["Rester concret","Chiffrer quand possible"], w:"Ne pas mentir sur ce qu'on ne maîtrise pas." },
  { id:"oral-questions", t:"Questions types et réponses", level:"intermediaire", r:"Préparer les classiques : incident, sauvegarde, VLAN, GPO…", tags:["oral","jury"], g:["Incident majeur géré","Restauration réussie","Projet réseau réalisé"], c:`# Exemples
- Comment gérez-vous un incident ?
- Expliquez AGDLP
- Quelle est votre sauvegarde ?`, p:["Répondre avec méthode"], w:"Dire « je ne sais pas mais je sais où chercher »." },
  { id:"oral-projets", t:"Projets à présenter", level:"intermediaire", r:"Labs réalisés, maquettes Packet Tracer, scripts.", tags:["labs","dossier"], g:["Lister les labs","Preuves et captures","Expliquer les difficultés"], c:`# Exemples de dossier
- Lab AD + DNS/DHCP
- VLAN + inter-VLAN
- Sauvegarde et restore`, p:["Montrer des captures"], w:"Un projet non documenté n'existe pas." }
 ]
},
{
 id:"scripts", group:"TSSR", icon:"📜", title:"Scripts prêts à l'emploi (PowerShell/Bash)", desc:"Création massive, inventaire, sauvegarde.", fiches:[
  { id:"sc-users", t:"Création d'utilisateurs en masse (PowerShell)", level:"intermediaire", r:"Importer CSV et créer comptes AD.", tags:["powershell","script"], g:["Préparer le CSV (Nom,Login)","Exécuter le script","Vérifier dans AD"], c:`Import-Csv .\\users.csv | ForEach-Object {
  New-ADUser -Name $_.Nom -SamAccountName $_.Login -Enabled $true
}`, p:["Ajouter groupes","Forcer MDP"], w:"Tester sur un objet pilote." },
  { id:"sc-inventory", t:"Inventaire poste (PowerShell)", level:"debutant", r:"Matériel et OS en CSV.", tags:["inventaire"], g:["Exécuter le script","Exporter CSV","Importer dans GLPI"], c:`Get-CimInstance Win32_ComputerSystem | Select Name,Manufacturer,Model | Export-Csv C:\\inv.csv -NoTypeInformation`, p:["Automatiser","Historiser"], w:"Vérifier les droits." },
  { id:"sc-backup-bash", t:"Sauvegarde Bash + cron", level:"intermediaire", r:"Script avec tar/rsync et log.", tags:["bash","cron"], g:["Créer le script","Donner +x","Planifier avec cron","Vérifier les logs"], c:`#!/bin/bash
set -euo pipefail
rsync -av --delete /data/ /backup/data/ >> /var/log/backup.log 2>&1`, p:["Redirection logs","Test manuel"], w:"Chemins absolus." }
 ]
},
{
 id:"itil", group:"TSSR", icon:"🎫", title:"ITIL et gestion de services", desc:"Ticketing, incident, problème, demande.", fiches:[
  { id:"itil-ticket", t:"Cycle de vie d'un ticket (GLPI)", level:"debutant", r:"Détection → qualification → résolution → clôture.", tags:["itil","glpi"], g:["Créer le ticket","Qualifier impact/urgence","Assigner","Clôturer avec validation"], c:`# Priorité = Impact × Urgence
# P1 critique, P2, P3, P4`, p:["Documentation","Base de connaissances"], w:"Ticket flou = incident mal routé." },
  { id:"itil-types", t:"Incident vs problème vs demande", level:"debutant", r:"Incident = rétablir ; problème = cause racine ; demande = besoin prévu.", tags:["incident","probleme"], g:["Classifier correctement","Escalade si besoin"], c:`# Exemples
Incident : service dégradé
Problème : panne récurrente
Demande : nouveau poste`, p:["SLA par type"], w:"Ne pas confondre incident et problème." },
  { id:"itil-supervision", t:"Supervision et alerting", level:"intermediaire", r:"Monitorer, alerter, escalader, documenter.", tags:["supervision","alerting"], g:["Définir seuils","Actions automatiques","Tableaux de bord"], c:`# Zabbix trigger
{host:system.cpu.load[all,avg1].last()}>5`, p:["Éviter le bruit"], w:"Sans supervision, on subit les pannes." }
 ]
},
{
 id:"english", group:"TSSR", icon:"🇬🇧", title:"Anglais technique pour l'IT", desc:"Vocabulaire et phrases utiles.", fiches:[
  { id:"en-vocab", t:"Vocabulaire IT essentiel", level:"debutant", r:"Mots clés pour lire une documentation.", tags:["english"], g:["Lire la doc","Traduire les messages d'erreur"], c:`deploy = déployer
troubleshoot = dépanner
throughput = débit
latency = latence
firewall = pare-feu`, p:["Surligner les termes"], w:"L'anglais est incontournable." },
  { id:"en-phrases", t:"Phrases pour la doc", level:"debutant", r:"Structures courantes.", tags:["english"], g:["Identifier sujet/verbe","Repérer if/when/unless"], c:`"If X, then Y" = si X alors Y
"Ensure that..." = s'assurer que...
"Deprecated" = obsolète`, p:["Garder un glossaire"], w:"Traduire mot à mot peut induire en erreur." }
 ]
}
);

const groupRank = { 'TSSR': 0, 'CCNA': 1, 'Examens': 2 };
G.sections.sort((a, b) => (groupRank[a.group] ?? 9) - (groupRank[b.group] ?? 9));