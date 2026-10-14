const G = window.GUIDE;
G.sections = G.sections || [];
G.sections.push(
{
 id:"procedures", group:"TSSR", icon:"ðŸ› ï¸", title:"ProcÃ©dures pas Ã  pas (mise en situation)", desc:"Installation et configuration des services clÃ©s.", fiches:[
  { id:"proc-ad", t:"Installer et configurer AD DS (forÃªt)", level:"intermediaire", r:"Deux DC minimum, DNS intÃ©grÃ©, NTP synchronisÃ©.", tags:["ad","procedure"], g:["Gestionnaire de serveur > AD DS + DNS","Promouvoir : nouvelle forÃªt tssr.local","DSRM, niveau fonctionnel, crÃ©ation des OU","VÃ©rifier dcdiag et rÃ©plication"], c:`Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
Install-ADDSForest -DomainName tssr.local -InstallDns
dcdiag /q
repadmin /replsummary`, p:["NTP synchronisÃ©","Sauvegarde AD autoritÃ©","Documentation du schÃ©ma"], w:"Un seul DC en production = risque majeur." },
  { id:"proc-dns", t:"Configurer DNS AD intÃ©grÃ©", level:"intermediaire", r:"Zones directes/inverses, records, scavenging et cache.", tags:["dns","procedure"], g:["AD DS installe DNS","CrÃ©er zone tssr.local + inverse","Enregistrer A/PTR des serveurs","Activer scavenging"], c:`Add-DnsServerPrimaryZone -Name tssr.local -ZoneFile tssr.local.dns -DynamicUpdate Secure
Add-DnsServerResourceRecordA -Name srv1 -ZoneName tssr.local -IPv4Address 192.168.1.20
Clear-DnsServerCache`, p:["DNS pointe vers le DC","Retention 14-30 jours","Tester nslookup"], w:"Mauvais DNS cÃ´tÃ© client casse Kerberos." },
  { id:"proc-dhcp", t:"Configurer DHCP et options", level:"intermediaire", r:"Ã‰tendue, exclusions, rÃ©servations, option gateway/DNS.", tags:["dhcp","procedure"], g:["Installer rÃ´le DHCP","CrÃ©er Ã©tendue avec masque","DÃ©finir options 003/006","RÃ©server les serveurs"], c:`Add-DhcpServerv4Scope -Name LAN -StartRange 192.168.1.100 -EndRange 192.168.1.200 -SubnetMask 255.255.255.0
Set-DhcpServerv4OptionValue -Router 192.168.1.1 -DnsServer 192.168.1.10
Add-DhcpServerv4Reservation -ScopeId 192.168.1.0 -IPAddress 192.168.1.50 -ClientId 00-11-22-33-44-55`, p:["Bail court pour Wi-Fi","Bascule DHCP en HA","Tester le bail"], w:"Le serveur doit Ãªtre autorisÃ© dans AD." },
  { id:"proc-gpo", t:"DÃ©ployer une GPO de base", level:"intermediaire", r:"CrÃ©er, lier et tester ; filtrer par groupe.", tags:["gpo","procedure"], g:["GPMC : nouvelle GPO liÃ©e Ã  l'OU","Configurer paramÃ¨tres ordinateur/utilisateur","gpupdate /force sur poste test","gpresult /r pour vÃ©rifier"], c:`New-GPO -Name "Base Postes"
gpupdate /force
gpresult /r | Out-File C:\\temp\\gpo.txt`, p:["LSDOU","Tester sur pilote","Documenter"], w:"Mauvais ciblage = dÃ©ploiement massif erronÃ©." },
  { id:"proc-shares", t:"Partages et droits NTFS (AGDLP)", level:"intermediaire", r:"User â†’ Global â†’ DomainLocal â†’ Permission ; le plus restrictif gagne.", tags:["partage","ntfs","agdlp"], g:["CrÃ©er groupes Global (mÃ©tier) et DomainLocal (ressource)","Appliquer NTFS + partage SMB","Tester accÃ¨s autorisÃ©/refusÃ©","Documenter la matrice"], c:`New-SmbShare -Name Compta -Path D:\\Shares\\Compta -FullAccess "TSSR\\LD_PartageCompta"
icacls D:\\Shares\\Compta /grant "TSSR\\G_Compta:(RX)"
Get-SmbShare`, p:["Ã‰viter Full Control Everyone","Audit trimestriel","Sauvegarder les ACL"], w:"Ne jamais donner contrÃ´le total Ã  Tout le monde." },
  { id:"proc-vlan", t:"VLAN, trunk et inter-VLAN", level:"intermediaire", r:"CrÃ©er VLAN, affecter ports, trunk et router-on-a-stick.", tags:["vlan","trunk","cisco"], g:["CrÃ©er VLAN et nommer","Ports d'accÃ¨s","Trunk avec VLAN autorisÃ©s","Sous-interfaces dot1Q"], c:`vlan 10
 name COMPTA
interface f0/1
 switchport mode access
 switchport access vlan 10
interface f0/24
 switchport mode trunk`, p:["VLAN natif Ã  changer","show interfaces trunk","Sauvegarder"], w:"Trunk mal autorisÃ© coupe silencieusement." },
  { id:"proc-nat", t:"NAT/PAT et ACL de base", level:"intermediaire", r:"Sortie Internet via PAT, publications via NAT statique, filtrage par ACL.", tags:["nat","pat","acl"], g:["inside/outside","ACL sources","overload","Tester depuis l'extÃ©rieur"], c:`interface g0/0
 ip nat inside
interface g0/1
 ip nat outside
ip nat inside source list 1 interface g0/1 overload
ip access-list extended LAN-OUT`, p:["Logger les refus","Principe deny default","Tester en production"], w:"Exposer un serveur sans pare-feu = compromission." },
  { id:"proc-backup", t:"Sauvegarde et restauration test", level:"intermediaire", r:"3-2-1, immutabilitÃ©, test trimestriel.", tags:["backup","restore","pra"], g:["DÃ©finir RPO/RTO","Lancer backup","Restaurer fichier + VM","Valider intÃ©gritÃ©"], c:`tar -czf /backup/etc-$(date +%F).tgz /etc
rsync -av --delete /data/ /backup/data/
borg create /backup/repo::backup-$(date +%F) /data`, p:["Copies hors ligne","Checksums","Alerte sur suppression"], w:"Sauvegarde non testÃ©e = inexistante." }
 ]
},
{
 id:"troubleshooting", group:"TSSR", icon:"ðŸ§ ", title:"Arbres de dÃ©pannage et mÃ©thode couche par couche", desc:"SymptÃ´mes courants et diagnostic entonnoir.", fiches:[
  { id:"ts-nonet", t:"Aucun accÃ¨s rÃ©seau (plan entonnoir)", level:"debutant", r:"Physique â†’ IP â†’ passerelle â†’ DNS â†’ Internet", tags:["troubleshoot","reseau"], g:["Voyants, cÃ¢ble, Wi-Fi, profil","ipconfig /all","Ping loopback â†’ gateway â†’ 8.8.8.8 â†’ nom","nslookup si ping IP OK"], c:`ipconfig /all
ping 127.0.0.1
ping 192.168.1.1
ping 8.8.8.8
nslookup google.com`, p:["169.254 = APIPA (DHCP KO)","Ping IP OK mais nom KO = DNS","Tracert s'arrÃªte passerelle = routage"], w:"Ne pas attribuer d'IP fixe sans diagnostic." },
  { id:"ts-domain", t:"Poste hors domaine", level:"intermediaire", r:"DNS du poste doit pointer vers le DC ; secure channel.", tags:["ad","poste"], g:["VÃ©rifier DNS","Test-ComputerSecureChannel","Joindre Ã  nouveau si besoin","GPO & OU"], c:`Test-ComputerSecureChannel
ipconfig /all
nltest /dsgetdc:tssr.local
gpresult /r`, p:["Heure < 5 min d'Ã©cart","Supprimer compte machine doublon","Garder compte local admin"], w:"Jonction rÃ©ussie mais GPO absentes = vÃ©rifier l'emplacement OU." },
  { id:"ts-dns", t:"DNS ne rÃ©sout pas", level:"intermediaire", r:"Tester client â†’ serveur â†’ zone â†’ enregistrement â†’ cache.", tags:["dns","diagnostic"], g:["Ping par IP puis par nom","nslookup explicite","VÃ©rifier zone et A/PTR","Purger cache"], c:`ping 192.168.1.10
nslookup srv1.tssr.local
nslookup srv1.tssr.local 192.168.1.10
ipconfig /flushdns
Get-DnsServerResourceRecord -ZoneName tssr.local -Name srv1`, p:["Scavenging pour nettoyer","NTP pour cohÃ©rence","Dans AD, DNS = DC"], w:"Mauvais DNS cÃ´tÃ© client casse Kerberos." }
 ]
},
{
 id:"subnetting", group:"TSSR", icon:"ðŸ”¢", title:"Subnetting, CIDR et plan d'adressage", desc:"Tables et mÃ©thode de calcul.", fiches:[
  { id:"sub-cidr", t:"Table CIDR Ã  mÃ©moriser", level:"debutant", r:"HÃ´tes = 2^h - 2, sauf /31 (RFC3021) et /32.", tags:["subnet","cidr"], g:["Apprendre /24â†’/30 par cÅ“ur","Utiliser sipcalc/ipcalc","VÃ©rifier sur Ã©quipements"], c:`ipcalc 192.168.1.0/26
sipcalc 10.0.0.0/24`, p:["/24=254, /25=126, /26=62, /27=30, /28=14, /29=6, /30=2","VLSM selon besoin rÃ©el","RÃ©seau+broadcast non utilisables"], w:"Apprendre la table pour l'examen." },
  { id:"sub-plan", t:"Exemple de plan d'adressage", level:"intermediaire", r:"Segmenter par VLAN/service, documenter.", tags:["plan","vlan"], g:["Lister VLAN et besoins","Affecter plages","DÃ©finir passerelles","Publier le plan"], c:`# VLAN10 Compta : 192.168.10.0/26 (62 hÃ´tes)
# VLAN20 IT     : 192.168.20.0/26
# VLAN99 Mgmt   : 192.168.99.0/28
# Liens point-Ã -point /30`, p:["RÃ©server adresses serveurs","Ã‰viter chevauchements","Mettre Ã  jour le schÃ©ma"], w:"Un plan non documentÃ© = chaos." }
 ]
},
{
 id:"security", group:"TSSR", icon:"ðŸ›¡ï¸", title:"SÃ©curitÃ©, durcissement et RGPD", desc:"Pratiques recommandÃ©es (ANSSI).", fiches:[
  { id:"sec-hygiene", t:"HygiÃ¨ne de base (ANSSI)", level:"debutant", r:"Patcher, moindre privilÃ¨ge, MFA, sauvegardes, supervision.", tags:["securite","anssi"], g:["Mettre Ã  jour OS/apps","Activer MFA admins","Chiffrer les disques","Durcir les services"], c:`# Linux
ufw enable
lynis audit system
# Windows
Get-MpComputerStatus`, p:["RÃ©fÃ©rentiel ANSSI","Sensibilisation rÃ©guliÃ¨re","Audit pÃ©riodique"], w:"La sÃ©curitÃ© est un processus continu." },
  { id:"sec-passwords", t:"Mots de passe et MFA", level:"debutant", r:"Longs, uniques, coffre ; MFA obligatoire pour admin/distants.", tags:["mfa","password"], g:["Politique PW robuste","TOTP/FIDO2","Codes de secours","Revue d'accÃ¨s"], c:`# VÃ©rifier expiration
chage -l user
# AD PSO
Get-ADFineGrainedPasswordPolicy -Filter *`, p:["FIDO2 recommandÃ©","Ã‰viter SMS pour admins","Break-glass documentÃ©"], w:"MFA sans secours bloque en cas de perte." },
  { id:"sec-backup", t:"Sauvegarde 3-2-1 et anti-ransomware", level:"intermediaire", r:"Copies hors ligne, immuables, testÃ©es, comptes isolÃ©s.", tags:["backup","anti-ransom"], g:["Copies offsite","ImmutabilitÃ©","Test de restore","Alerte suppression"], c:`# Veeam immuable repository
# Borg append-only`, p:["RPO/RTO documentÃ©s","Snapshots court terme + backup long terme","VÃ©rifier chaÃ®nes"], w:"Les sauvegardes connectÃ©es sont cibles prioritaires." },
  { id:"sec-rgpd", t:"RGPD et donnÃ©es personnelles", level:"intermediaire", r:"Recenser, minimiser, sÃ©curiser, durÃ©e de conservation.", tags:["rgpd","conformite"], g:["Cartographier les donnÃ©es","Droits d'accÃ¨s","Chiffrement au repos","Politique de rÃ©tention"], c:`# VÃ©rifier partages et droits
icacls D:\\Shares /grant ...`, p:["DPO","Registre des traitements","Notification incident 72h"], w:"La conformitÃ© n'est pas optionnelle." }
 ]
},
{
 id:"oral", group:"TSSR", icon:"ðŸŽ¤", title:"Oral et dossier professionnel", desc:"Pitch, questions types et prÃ©sentation.", fiches:[
  { id:"oral-pitch", t:"Pitch de 2 minutes", level:"intermediaire", r:"Contexte, besoin, choix, preuves, bilan.", tags:["oral","pitch"], g:["Situation client","Actions menÃ©es","RÃ©sultats mesurables","AmÃ©liorations"], c:`# Structure
1. Contexte
2. ProblÃ¨me
3. Solution
4. Preuves
5. Bilan`, p:["Rester concret","Chiffrer quand possible"], w:"Ne pas mentir sur ce qu'on ne maÃ®trise pas." },
  { id:"oral-questions", t:"Questions types et rÃ©ponses", level:"intermediaire", r:"PrÃ©parer les classiques : incident, sauvegarde, VLAN, GPOâ€¦", tags:["oral","jury"], g:["Incident majeur gÃ©rÃ©","Restauration rÃ©ussie","Projet rÃ©seau rÃ©alisÃ©"], c:`# Exemples
- Comment gÃ©rez-vous un incident ?
- Expliquez AGDLP
- Quelle est votre sauvegarde ?`, p:["RÃ©pondre avec mÃ©thode"], w:"Dire Â« je ne sais pas mais je sais oÃ¹ chercher Â»." },
  { id:"oral-projets", t:"Projets Ã  prÃ©senter", level:"intermediaire", r:"Labs rÃ©alisÃ©s, maquettes Packet Tracer, scripts.", tags:["labs","dossier"], g:["Lister les labs","Preuves et captures","Expliquer les difficultÃ©s"], c:`# Exemples de dossier
- Lab AD + DNS/DHCP
- VLAN + inter-VLAN
- Sauvegarde et restore`, p:["Montrer des captures"], w:"Un projet non documentÃ© n'existe pas." }
 ]
},
{
 id:"scripts", group:"TSSR", icon:"ðŸ“œ", title:"Scripts prÃªts Ã  l'emploi (PowerShell/Bash)", desc:"CrÃ©ation massive, inventaire, sauvegarde.", fiches:[
  { id:"sc-users", t:"CrÃ©ation d'utilisateurs en masse (PowerShell)", level:"intermediaire", r:"Importer CSV et crÃ©er comptes AD.", tags:["powershell","script"], g:["PrÃ©parer le CSV (Nom,Login)","ExÃ©cuter le script","VÃ©rifier dans AD"], c:`Import-Csv .\\users.csv | ForEach-Object {
  New-ADUser -Name $_.Nom -SamAccountName $_.Login -Enabled $true
}`, p:["Ajouter groupes","Forcer MDP"], w:"Tester sur un objet pilote." },
  { id:"sc-inventory", t:"Inventaire poste (PowerShell)", level:"debutant", r:"MatÃ©riel et OS en CSV.", tags:["inventaire"], g:["ExÃ©cuter le script","Exporter CSV","Importer dans GLPI"], c:`Get-CimInstance Win32_ComputerSystem | Select Name,Manufacturer,Model | Export-Csv C:\\inv.csv -NoTypeInformation`, p:["Automatiser","Historiser"], w:"VÃ©rifier les droits." },
  { id:"sc-backup-bash", t:"Sauvegarde Bash + cron", level:"intermediaire", r:"Script avec tar/rsync et log.", tags:["bash","cron"], g:["CrÃ©er le script","Donner +x","Planifier avec cron","VÃ©rifier les logs"], c:`#!/bin/bash
set -euo pipefail
rsync -av --delete /data/ /backup/data/ >> /var/log/backup.log 2>&1`, p:["Redirection logs","Test manuel"], w:"Chemins absolus." }
 ]
},
{
 id:"itil", group:"TSSR", icon:"ðŸŽ«", title:"ITIL et gestion de services", desc:"Ticketing, incident, problÃ¨me, demande.", fiches:[
  { id:"itil-ticket", t:"Cycle de vie d'un ticket (GLPI)", level:"debutant", r:"DÃ©tection â†’ qualification â†’ rÃ©solution â†’ clÃ´ture.", tags:["itil","glpi"], g:["CrÃ©er le ticket","Qualifier impact/urgence","Assigner","ClÃ´turer avec validation"], c:`# PrioritÃ© = Impact Ã— Urgence
# P1 critique, P2, P3, P4`, p:["Documentation","Base de connaissances"], w:"Ticket flou = incident mal routÃ©." },
  { id:"itil-types", t:"Incident vs problÃ¨me vs demande", level:"debutant", r:"Incident = rÃ©tablir ; problÃ¨me = cause racine ; demande = besoin prÃ©vu.", tags:["incident","probleme"], g:["Classifier correctement","Escalade si besoin"], c:`# Exemples
Incident : service dÃ©gradÃ©
ProblÃ¨me : panne rÃ©currente
Demande : nouveau poste`, p:["SLA par type"], w:"Ne pas confondre incident et problÃ¨me." },
  { id:"itil-supervision", t:"Supervision et alerting", level:"intermediaire", r:"Monitorer, alerter, escalader, documenter.", tags:["supervision","alerting"], g:["DÃ©finir seuils","Actions automatiques","Tableaux de bord"], c:`# Zabbix trigger
{host:system.cpu.load[all,avg1].last()}>5`, p:["Ã‰viter le bruit"], w:"Sans supervision, on subit les pannes." }
 ]
},
);

const groupRank = { 'TSSR': 0, 'CCNA': 1, 'Examens': 2 };
G.sections.sort((a, b) => (groupRank[a.group] ?? 9) - (groupRank[b.group] ?? 9));
