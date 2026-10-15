window.GUIDE = window.GUIDE || { sections:[], quizzes:[], labs:[], glossary:[], cheats:[], methods:[], resources:[], meta:{} };

/* chunks/01-sections-tssr-core.js */
(function(G){
G.sections = G.sections || [];
G.meta = { title: "Guide TSSR + CCNA", edition: "Maximale 2026", repo: "herbreteau787-svg/Guide-TSSR" };

const push = (arr) => G.sections.push(...arr);

push([
{
  id:"ccp1",
  group:"TSSR",
  icon:"🎫",
  title:"CP1 - Exploiter l’intelligence artificielle et encadrer son usage",
  desc:"Méthodes ITIL, ticketing, diagnostic poste, comptes, communication client.",
  fiches:[
   {
    id:"ccp1-tickets", t:"Cycle de vie d'un ticket (incident/problème/demande)", level:"debutant",
    r:"Incident = service dégradé à rétablir vite. Problème = cause racine à éliminer. Demande = besoin prévu. Priorité = Impact → Urgence → Criticité.",
    tags:["itil","glpi","ticket","sla"],
    g:["Identifier le service impacté et la criticité métier","Créer le ticket dans GLPI/iTop avec catégories et impact","Qualifier : utilisateur, poste, site, heure de début","Assigner, documenter chaque action horodatée","Clôturer avec validation utilisateur + base de connaissances"],
    c:`# Diagnostic rapide d'un poste
ipconfig /all
ping 8.8.8.8
ping intranet.local
nslookup intranet.local
Get-Service | Where Status -eq Stopped`,
    p:["P1 critique 4h, P2 8h, P3 24h, P4 72h (adapter au SLA signé)","Escalade N2/N3 si hors périmètre ou échéance dépassée","On ne ferme un ticket qu'après validation réelle et sans contournement caché"],
    w:"Reformuler en langage simple ; jamais de jargon face à l'utilisateur. Un ticket flou = un incident mal routé."
   },
   {
    id:"ccp1-poste", t:"Diagnostic réseau d'un poste (méthode entonnoir)", level:"debutant",
    r:"Physique → IP → passerelle → DNS → Internet. Tester couche par couche sans sauter d'étapes.",
    tags:["reseau","poste","ipconfig","dns"],
    g:["Vérifier voyant carte + câble, Wi-Fi activé, profil Privé/Public","Centre Réseau et partage : IP, passerelle, DNS","Tester navigation et accès au partage","Purger le cache si le nom échoue"],
    c:`ipconfig /all
ping 192.168.1.1
ping 8.8.8.8
nslookup google.com
tracert google.com
ipconfig /release
ipconfig /renew
ipconfig /flushdns
Test-NetConnection google.com -Port 443`,
    p:["169.254.x.x = APIPA → DHCP KO ou pas de réponse serveur","Ping OK par IP mais KO par nom = DNS KO","Tracert s'arrête à la passerelle = problème routage amont"],
    w:"Ne jamais remettre une IP manuelle sans documenter ; cela masque le vrai défaut DHCP."
   },
   {
    id:"ccp1-comptes", t:"Compte AD : déblocage et reset mot de passe", level:"debutant",
    r:"Vérifier l'identité avant toute réinitialisation. Forcer le changement à la prochaine ouverture. Canal séparé pour le mot de passe.",
    tags:["ad","mot de passe","securite","compte"],
    g:["ADUC (dsa.msc) → Users → clic droit sur l'utilisateur","Compte : décocher Verrouillé / Réinitialiser le mot de passe","Cocher 'Doit changer le mot de passe à la prochaine ouverture'","Prévenir par canal séparé (téléphone) et documenter"],
    c:`Set-ADAccountPassword -Identity jdupont -Reset -NewPassword (ConvertTo-SecureString 'Temp2026!' -AsPlainText -Force)
Set-ADUser -Identity jdupont -ChangePasswordAtLogon $true
Unlock-ADAccount -Identity jdupont
Get-ADUser jdupont -Properties LockedOut, Enabled, PasswordExpired`,
    p:["Double vérification d'identité : badge + manager ou question confidentielle","Mots de passe temporaires : 12+ car., maj/min/chiffre/spécial","Un compte verrouillé en boucle = forcer sa déconnexion partout"],
    w:"Ne jamais envoyer le mot de passe dans le même canal que l'identifiant. Les groupes d'accès doivent rester inchangés lors d'un reset."
   },
   {
    id:"ccp1-evenements", t:"Journaux Windows et observation système", level:"intermediaire",
    r:"Les journaux Application/Sécurité/Système + PowerShell Get-EventLog sont la mémoire de la machine. Toujours croiser codes d'événement avec la KB.",
    tags:["windows","logs","event","diagnostic"],
    g:["Ouvrir eventvwr.msc ; filtrer par niveau Erreur/Critique","Identifier l'EventID et la source exacte","Rechercher l'ID officiel Microsoft","Tester la correction et noter dans le ticket"],
    c:`Get-WinEvent -LogName System -MaxEvents 30 | Select TimeCreated, Id, ProviderName, Message
Get-EventLog -LogName Application -EntryType Error -Newest 20
# Filtrer un ID précis :
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} | Select TimeCreated, Message -First 10`,
    p:["4625 = échec d'ouverture de session ; 4740 = verrouillage de compte","Les journaux sont tournants : augmenter la taille si audit avancé","Exporter en EVTX avant une réinstallation"],
    w:"L'absence d'erreur dans les journaux n'exclut pas un problème réseau ou applicatif."
   },
   {
    id:"ccp1-wsus", t:"Mises à jour : WSUS et stratégie de patch", level:"intermediaire",
    r:"Séparation anneaux (pilote/production), fenêtre de maintenance, rollback documenté.",
    tags:["wsus","patch","windows","gpo"],
    g:["Console WSUS : approuver pour le groupe pilote d'abord","Surveiller la conformité et les échecs","GPO : Configure Automatic Updates + intranet Microsoft update service","Planifier redémarrage hors heures creuses"],
    c:`wsusutil.exe checkhealth
wuauclt /detectnow /updatenow
Get-WindowsUpdateLog
# PowerShell module PSWindowsUpdate :
Install-Module PSWindowsUpdate -Force
Get-WUList | Select Title, Size
Install-WUUpdates -AcceptAll -AutoReboot`,
    p:["Gardiens : serveurs d'abord puis postes","KB critiques de sécurité prioritaires","Garder 1-2 snapshots avant mise à jour majeure"],
    w:"Les mises à jour WSUS ne couvrent que les produits Microsoft ; les applicatifs tiers nécessitent un outil dédié."
   },
   {
    id:"ccp1-outils", t:"Outils de support et communication", level:"debutant",
    r:"Un bon support = diagnostic structuré + écoute active + trajectoire claire pour l'utilisateur.",
    tags:["support","communication","relation client"],
    g:["Accueil : identifier, reformuler le besoin, rassurer","Expliquer ce qui va être fait et le délai","Point de contact unique até la clôture","Compléter la base de connaissances"],
    c:`# Grilles d'entretien (extrait)
# 1. Quoi ? 2. Depuis quand ? 3. Pour qui ? 4. Impact ?
# 5. Changement récent ? 6. Reproductible ?
# Rappel final : "Je vous rappelle avant 17h avec la solution ou une escalade."`,
    p:["Ne jamais promettre l'impossible : dépendances fournisseurs externes","Utiliser des gabarits de mail pour la cohérence","Durée moyenne de résolution à suivre an par mois"],
    w:"Le silence crée l'angoisse ; un statut intermédiaire est toujours mieux."
   }
  ]
},
{
  id:"ccp2",
  group:"TSSR",
  icon:"🪟",
  title:"CP2 - Assurer le déploiement des équipements numériques et accompagner à l’utilisation des outils collaboratifs",
  desc:"Installation, AD DS, DNS, DHCP, GPO, FSMO, jonction domaine.",
  fiches:[
   {
    id:"ccp2-adinstall", t:"Installer AD DS et créer une forêt", level:"intermediaire",
    r:"Un DC = ADDS + DNS + heure synchronisée. Prévoir 2 contrôleurs minimum pour la résilience et la réplication.",
    tags:["ad","windows server","dns","dsrm"],
    g:["Gestionnaire de serveur > Ajouter rôles : AD DS + DNS","Promouvoir en contrôleur : nouvelle forêt ex. tssr.local","Définir mot de passe DSRM et niveau fonctionnel","Vérifier DNS, Sites et services, réplication"],
    c:`Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
Install-ADDSForest -DomainName tssr.local -InstallDns -DomainNetbiosName TSSR
Get-ADDomainController
dcdiag /q /s:DC1`,
    p:["NetBIOS <=15 caractères","Niveau fonctionnel le plus haut compatible avec les plus vieux DC","NTP : l'émulateur PDC est la source de temps de la forêt"],
    w:"Jamais un seul DC en production. Toujours tester la restauration AD avant le premier incident."
   },
   {
    id:"ccp2-fsmo", t:"Les 5 rôles FSMO", level:"intermediaire",
    r:"Forêt : Schéma + Nom de domaine. Domaine : PDCe, RID, Infrastructure. Chaque rôle a une fonction précise.",
    tags:["fsmo","ad","roles"],
    g:["ADUC : voir Maîtres d'opérations (RID/PDC/Infrastructure)","Domaines et approbations : maître nom de domaine","Schéma : regsvr32 schmmgmt puis console du schéma"],
    c:`netdom query fsmo
Move-ADDirectoryServerOperationMasterRole -Identity DC2 -OperationMasterRole PDCEmulator,RIDMaster -Force
Get-ADForest | Select SchemaMaster,DomainNamingMaster
Get-ADDomain | Select PDCEmulator,RIDMaster,InfrastructureMaster`,
    p:["PDC = temps, verrouillage et mot de passe prioritaires","Transfert gracieux si le DC est disponible, saisie (seize) si panne","Documenter l'emplacement des rôles dans la matrice d'infrastructure"],
    w:"Déplacer les rôles sans planification peut perturber la réplication et le temps Kerberos."
   },
   {
    id:"ccp2-agdlp", t:"Groupes AGDLP et GPO", level:"intermediaire",
    r:"AGDLP : User → Global → DomainLocal → Permission. GPO : Ordinateur vs Utilisateur selon LSDOU (Local, Site, Domaine, OU).",
    tags:["groupes","gpo","permissions","ad"],
    g:["ADUC : créer OU puis groupes Global (métier) et DomainLocal (ressource)","Partage : ajouter le groupe LD en autorisation NTFS/Partage","GPMC : lier GPO à OU, filtrer par groupe de sécurité","Tester : gpupdate /force puis gpresult /r"],
    c:`New-ADGroup -Name G_Compta -GroupScope Global -GroupCategory Security
New-ADGroup -Name LD_PartageCompta -GroupScope DomainLocal -GroupCategory Security
Add-ADGroupMember -Identity LD_PartageCompta -Members G_Compta
gpupdate /force
gpresult /r | Out-File C:\\temp\\gpo.txt`,
    p:["Bouclage de stratégie pour les sessions RDS","Permissions NTFS + Partage : la plus restrictive gagne","Toujours tester sur un poste pilote avec gpresult /h rapport.html"],
    w:"Ajouter un utilisateur directement au groupe DomainLocal contourne la méthode AGDLP et complique les audits."
   },
   {
    id:"ccp2-dnsdhcp", t:"DNS et DHCP Windows Server", level:"intermediaire",
    r:"DNS AD intégré avec zones directes/inverses et dynamic DNS sécurisé. DHCP : étendue, options, réservations, bascule.",
    tags:["dns","dhcp","windows server"],
    g:["DNS : créer zones directe tssr.local et inverse, activer scavenging","DHCP : nouvelle étendue avec masque, passerelle (003), DNS (006)","Réservation par MAC pour imprimantes/serveurs","Sauvegarder et répliquer la configuration"],
    c:`Add-DnsServerPrimaryZone -Name tssr.local -ZoneFile tssr.local.dns -DynamicUpdate Secure
Add-DhcpServerv4Scope -Name LAN -StartRange 192.168.1.100 -EndRange 192.168.1.200 -SubnetMask 255.255.255.0
Set-DhcpServerv4OptionValue -Router 192.168.1.1 -DnsServer 192.168.1.10
Add-DhcpServerv4Reservation -ScopeId 192.168.1.0 -IPAddress 192.168.1.50 -ClientId 00-11-22-33-44-55
Get-DhcpServerv4Lease -ScopeId 192.168.1.0`,
    p:["Bail court pour Wi-Fi invités, normal pour LAN","Mettre en place une bascule DHCP (failover) pour la continuité","Réserver les adresses serveurs hors étendue"],
    w:"Un serveur AD doit utiliser son propre DNS ; pointer ailleurs casse Kerberos."
   },
   {
    id:"ccp2-join", t:"Joindre un poste au domaine", level:"debutant",
    r:"Le DNS du poste doit pointer vers le DC. Compte administrateur domaine requis. Horloge <5 minutes d'écart.",
    tags:["domaine","poste","join","dns"],
    g:["Renommer le PC selon convention","Accès professionnel/établissement > Joindre le domaine","Entrer admin domaine puis redémarrer","Ouvrir session domaine et vérifier application des GPO"],
    c:`Rename-Computer -NewName PC-012 -Restart
Add-Computer -DomainName tssr.local -Credential (Get-Credential) -Restart
Test-ComputerSecureChannel
nltest /dsgetdc:tssr.local
gpresult /r`,
    p:["Supprimer l'ancien compte ordinateur en cas de doublon","Vérifier l'OU de destination via GPO de jonction","Garder le compte local admin en secours"],
    w:"Jonction réussie mais GPO absentes = vérifier DNS et emplacement de l'ordinateur dans l'AD."
   },
   {
    id:"ccp2-repl", t:"Réplication AD et diagnostic", level:"avance",
    r:"Multi-DC = réplication toutes les 15 s (intra-site) et planifiée inter-site. Les échecs laissent des objets incohérents.",
    tags:["ad","repliation","dcdiag","sites"],
    g:["Sites et services AD : vérifier liens inter-sites, coût et horaires","Forcer la réplication depuis DC1 vers DC2","Surveiller le backlog et les conflits d'attributs","Documenter la topologie dans le dossier pro"],
    c:`repadmin /showrepl
repadmin /syncall /AdeP
repadmin /replsummary
dcdiag /test:replications /s:DC1
Get-ADReplicationPartnerMetadata -Target DC1`,
    p:["USN rollback possible après restauration VM non Autorité","KCC recalcule automatiquement les connexions","Un partenariat d'origine unique suffit dans la plupart des sites"],
    w:"Restaurer un DC depuis un snapshot sans sauvegarde AD autorité peut créer une divergence irréversible."
   },
   {
    id:"ccp2-file", t:"Serveur de fichiers, partages et DFS", level:"intermediaire",
    r:"Partages SMB avec permissions NTFS + partage, quotas FSRM, DFS-N pour l'abstraction et la haute disponibilité.",
    tags:["fichiers","smb","dfs","fsrm","partages"],
    g:["Créer dossiers avec structure par service","Définir permissions NTFS selon AGDLP","Créer partage avec \\serveur\\ressource","Mettre en place DFS-N et espaces de noms"],
    c:`New-SmbShare -Name Compta -Path D:\\Shares\\Compta -FullAccess "TSSR\\LD_PartageCompta"
Grant-SmbShareAccess -Name Compta -AccountName "TSSR\\G_Compta" -AccessRight Change
Get-SmbShare
# DFS
New-DfsnRoot -Path \\\\tssr.local\\partages -TargetPath \\\\DC1\\partages -Type DomainV2
dfsutil /addftroot:domain`,
    p:["Indexation et recherche par Windows Search sur serveur de fichiers","FSRM : quotas par dossier et filtrage d'extensions (ransomware)","Sauvegarder les listes ACL exportées"],
    w:"La suppression d'un partage n'efface pas les fichiers; vérifier les permissions minimales."
   },
   {
    id:"ccp2-print", t:"Serveur d'impression et déploiement GPO", level:"debutant",
    r:"Centraliser les files d'attente et déployer les imprimantes par OU ou groupe avec GPO.",
    tags:["impression","gpo","printer"],
    g:["Ajouter le rôle Impression et documents","Installer le pilote signé x64 et x86","Créer la file d'attente par imprimante","Déployer via GPO Computers/Users"],
    c:`Install-WindowsFeature Print-Services
Add-Printer -Name "Impr-Compta" -DriverName "HP Universal PCL6" -PortName "IP_192.168.1.50"
# Déploiement GPO côté utilisateur
Set-GPRegistryValue -Name "Deploiement Imprimantes" -Key "HKCU\\Software\\..."`,
    p:["Pilotes PCL vs PS selon l'équipement","Désactiver l'impression directe pour les postes via GPO","Surveiller les files bloquées (spouleur)"],
    w:"La spooler.exe bloquée se répare souvent en vidant SPOOL\\PRINTERS puis en redémarrant le service."
   },
   {
    id:"ccp2-powershell", t:"Administration AD en PowerShell", level:"intermediaire",
    r:"Le module ActiveDirectory expose une API complète. Préférer les cmdlets aux clics pour tracer et automatiser.",
    tags:["powershell","ad","automatisation"],
    g:["Importer le module sur un poste admin","Lire avant d'écrire (Get- avant Set-)","Tester sur un objet pilote","Exporter les résultats pour audit"],
    c:`Import-Module ActiveDirectory
Get-ADUser -Filter "Enabled -eq 'True'" -Properties LastLogonDate | Select Name, SamAccountName, LastLogonDate
New-ADUser -Name "Jean Martin" -SamAccountName jmartin -Enabled $true -Path "OU=Users,DC=tssr,DC=local"
Disable-ADAccount -Identity jmartin
Search-ADAccount -LockedOut | Unlock-ADAccount`,
    p:["Lecture/export régulier des utilisateurs inactifs","Utiliser try/catch et -ErrorAction Stop dans les scripts","Minimiser les droits du compte de service"],
    w:"Les cmdlets AD s'exécutent par défaut contre le DC le plus proche ; forcer avec -Server si besoin."
   }
  ]
}
]);

push([
{
  id:"ccp3",
  group:"TSSR",
  icon:"🐧",
  title:"CP3 - Apporter une assistance technique",
  desc:"Base système, utilisateurs, services, réseau, paquets, supervision locale.",
  fiches:[
   {
    id:"ccp3-base", t:"Base Linux : arborescence et configuration", level:"debutant",
    r:"/etc pour la config, /var/log pour les logs, /home pour les utilisateurs, /opt pour les applications tierces. Toujours lire avant d'éditer.",
    tags:["linux","fichiers","base"],
    g:["Terminal ou Explorateur GNOME pour parcourir","Éditer avec nano/vim les fichiers sous /etc","Vérifier l'OS et la version","Tester la modification et redémarrer le service dépendant"],
    c:`ls -la /etc/*.conf
cat /etc/os-release
cat /etc/passwd | cut -d: -f1
cat /etc/hosts
cat /etc/resolv.conf
chmod 640 fichier
chown user:group fichier
find /var/log -type f -size +10M`,
    p:["/etc/passwd liste les utilisateurs, /etc/shadow les hash","/etc/fstab monte les systèmes au boot","chmod r=4, w=2, x=1 ; éviter 777"],
    w:"Ne jamais chmod 777 sur un fichier sensible ; préférer les ACL POSIX (setfacl)."
   },
   {
    id:"ccp3-users", t:"Utilisateurs, groupes et sudo", level:"debutant",
    r:"useradd/usermod, groupes secondaires avec -aG (sinon écrasement), sudo pour la délégation.",
    tags:["linux","users","sudo"],
    g:["Paramètres > Utilisateurs pour l'approche GUI","Vérifier l'appartenance aux groupes","Cockpit (port 9090) si installé pour gérer à distance","Journaliser les élévations (sudo.log)"],
    c:`useradd -m -s /bin/bash jdupont
passwd jdupont
usermod -aG sudo,adm jdupont
id jdupont
groups jdupont
chage -l jdupont
visudo -c`,
    p:["-aG ajoute sans écraser les groupes existants","umask 027 pour masquer les fichiers nouveaux","Désactiver le login root direct (PermitRootLogin no)"],
    w:"Oublier -a dans -G remplace tous les groupes secondaires et peut bloquer un admin."
   },
   {
    id:"ccp3-services", t:"Systemd : services, cibles et journaux", level:"intermediaire",
    r:"systemctl gère le cycle de vie des unités ; journalctl filtre les logs binaires journald.",
    tags:["systemd","services","logs","linux"],
    g:["Identifier le service et son état","Activer au boot + démarrer maintenant","Dépendances et drop-in via systemctl edit","Consulter les logs récents"],
    c:`systemctl status sshd
systemctl enable --now sshd
systemctl restart sshd
systemctl daemon-reload
journalctl -u sshd -n 50 --no-pager
journalctl -p err -b
loginctl show-session 1`,
    p:["enabled = au boot, active = en cours","Masquer un service : systemctl mask","Journald persistant : Storage=persistent"],
    w:"Un service 'failed' laisse parfois un message d'erreur explicite dans journalctl -xe."
   },
   {
    id:"ccp3-reseau", t:"Réseau Linux, Netplan et NetworkManager", level:"intermediaire",
    r:"ip remplace ifconfig. Netplan/NM selon la distribution. Configuration persistante obligatoire.",
    tags:["reseau","ip","netplan","linux"],
    g:["NetworkManager GUI pour les postes graphiques","Vérifier l'IP, la route et les DNS","Éditer YAML Netplan avec indentation correcte","Appliquer et tester la connectivité"],
    c:`ip a
ip r
ping -c4 8.8.8.8
ss -tulpn
cat /etc/netplan/*.yaml
netplan apply
nmcli device status
nmcli connection modify eth0 ipv4.addresses 192.168.1.10/24 ipv4.gateway 192.168.1.1`,
    p:["ss remplace netstat","Netplan sensible aux espaces YAML","Penser à tester hors bande pour les serveurs distants"],
    w:"Une erreur YAML peut couper le réseau ; garder une console distante ouverte."
   },
   {
    id:"ccp3-paquets", t:"Paquets, dépôts et maintenance", level:"debutant",
    r:"APT/YUM/DNF selon distro. Mettre à jour régulièrement, nettoyer les paquets et vérifier les origines.",
    tags:["apt","dnf","packages","linux"],
    g:["Logiciels via GNOME Software ou Synaptic","Dépôts officiels vs tiers ; signature GPG","Nettoyage des paquets obsolètes","Planification unattended-upgrades"],
    c:`apt update && apt upgrade -y
dpkg -l | grep ssh
apt autoremove --purge
dnf check-update
dnf install -y httpd
rpm -qa | grep -i httpd
unattended-upgrade -d`,
    p:["apt-cache madison pour comparer les versions","Pinning Debian pour figer une version","Auditer les dépôts avec apt-cache policy"],
    w:"Ne jamais mélanger les dépôts de versions majeures (ex. Jammy/Bookworm) sans nécessité."
   },
   {
    id:"ccp3-ssh", t:"SSH : administration distante sécurisée", level:"intermediaire",
    r:"SSH chiffre la session. Authentification par clé et désactivation root direct = base de la sécurité.",
    tags:["ssh","securite","remote"],
    g:["Installer openssh-server si absent","Générer des clés côté client","Copier la clé publique (ssh-copy-id)","Désactiver root et password si clés présentes"],
    c:`ssh-keygen -t ed25519 -C "admin@tssr"
ssh-copy-id -i ~/.ssh/id_ed25519.pub jdupont@192.168.1.10
# /etc/ssh/sshd_config :
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
systemctl reload sshd`,
    p:["ed25519 recommandé","sshd_config.d/ pour les overrides modernes","Authentification à deux facteurs pour les accès sensibles"],
    w:"Se couper l'accès SSH en désactivant le password avant d'avoir testé la clé est l'erreur classique."
   },
   {
    id:"ccp3-stockage", t:"Stockage : LVM, partitions et fstab", level:"avance",
    r:"LVM abstraction (PV/VG/LV) pour redimensionner et snapshotter sans tout réinstaller.",
    tags:["lvm","stockage","fstab","disque"],
    g:["lsblk pour visualiser les disques et partitions","Créer PV, VG puis LV","Formater (ext4/xfs) et monter","Ajouter à /etc/fstab puis tester"],
    c:`lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINT
pvcreate /dev/sdb1
vgcreate vg_data /dev/sdb1
lvcreate -L 20G -n lv_app vg_data
mkfs.ext4 /dev/vg_data/lv_app
mount /dev/vg_data/lv_app /opt/app
echo "/dev/vg_data/lv_app /opt/app ext4 defaults 0 2" >> /etc/fstab
mount -a`,
    p:["snapshot LVM pour sauvegardes cohérentes","XFS pour gros volumes, ext4 pour souplesse","Ne jamais fsck un volume monté"],
    w:"Modifier fstab sans tester avec mount -a peut empêcher le boot au prochain redémarrage."
   },
   {
    id:"ccp3-cron", t:"Planification avec cron et systemd timers", level:"debutant",
    r:"Cron simple pour les tâches périodiques ; systemd timers pour dépendances, logs et redémarrages automatiques.",
    tags:["cron","planification","automation"],
    g:["crontab -e pour éditer","Utiliser des chemins absolus","Rediriger la sortie vers un fichier de log","Tester le script à la main"],
    c:`crontab -e
# minute heure jour mois jourSemaine commande
30 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
@reboot /opt/scripts/startup.sh
# systemd timer
systemctl enable --now backup.timer`,
    p:["SHELL=/bin/bash et PATH explicites dans crontab","Ne jamais lancer en root sans justification","Journaliser les échecs avec mail ou monitoring"],
    w:"Les scripts cron n'héritent pas de l'environnement interactif ; tester avec env -i."
   },
   {
    id:"ccp3-logs-central", t:"Logs centralisés et logrotate", level:"avance",
    r:"Journalisation structurée + rotation = diagnostic fiable et conservation maîtrisée.",
    tags:["logs","journald","logrotate"],
    g:["Découper par service pour limiter la taille","Configurer logrotate avec compression et rétention","Exporter vers un collecteur (rsyslog) si plusieurs serveurs","Surveiller l'espace disque"],
    c:`# /etc/logrotate.d/myapp
/var/log/myapp/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 root adm
}
logrotate -d /etc/logrotate.conf`,
    p:["Tail -f pour suivre en live","logger pour écrire dans journald","Centralisation avec Loki/Graylog en production"],
    w:"Les logs rotatés peuvent échapper à la supervision si le chemin change."
   }
  ]
}
]);

push([
{
  id:"ccp4",
  group:"TSSR",
  icon:"🌐",
  title:"CP4 - Exploiter un réseau IP",
  desc:"Modèle OSI/TCP, adressage, Cisco IOS, VLAN, STP, routage, services.",
  fiches:[
   {
    id:"ccp4-modele", t:"Modèle OSI vs TCP/IP", level:"debutant",
    r:"7 couches OSI vs 4 couches TCP/IP. Identifier la couche d'un symptôme guide le diagnostic.",
    tags:["osi","tcp/ip","reseau"],
    g:["Associer l'outil à la couche (ping=L3, curl=L7)","Penser aux équipements intermédiaires (switch=L2, routeur=L3)","Wireshark pour observer"],
    c:`# Couches OSI
# 7 Application 6 Presentation 5 Session 4 Transport 3 Réseau 2 Liaison 1 Physique
# TCP par port ; IP par adresse
Tracert google.com
tcpdump -i eth0 -n
ipconfig /all`,
    p:["TCP orienté connexion, UDP rapide pour DNS/VoIP","Ports <1024 réservés","MTU 1500 par défaut pour Ethernet"],
    w:"Le travail d'une couche inférieure ne suffit pas si la supérieure échoue."
   },
   {
    id:"ccp4-ports", t:"Ports et protocoles à connaître", level:"debutant",
    r:"Répertoire des ports usuels pour l'examen et l'exploitation : web, mail, fichiers, admin, sécurité.",
    tags:["ports","protocoles","tcp","udp"],
    g:["Pare-feu Windows : autoriser le port via GUI avec règle entrante","pfSense : Firewall > Rules > Add","Tester via navigateur ou telnet/Test-NetConnection"],
    c:`# Web 80/443, DNS 53, DHCP 67/68
# Mail SMTP 25/587, IMAP 143/993, POP3 110/995
# FTP 20-21, SMB 445, SSH 22, RDP 3389, SNMP 161, LDAP 389/636
ss -tlnp
Test-NetConnection srv -Port 443
nmap -sV 192.168.1.10`,
    p:["TCP handshake SYN-SYN/ACK-ACK ; UDP sans handshake","Ports éphémères > 1024","SMB 445 = SMB direct, plus sécurisé que NetBIOS 139"],
    w:"Ouvrir un port sans restriction source est une mauvaise pratique."
   },
   {
    id:"ccp4-subnet", t:"Subnetting / CIDR", level:"intermediaire",
    r:"Formule : 2^(bits hôtes)-2. /24 = 254, /25 = 126, /26 = 62, /27 = 30. VLSM pour découper selon besoin réel.",
    tags:["subnetting","cidr","vlsm","ip"],
    g:["Calculatrice sipcalc / tableau","Plan d'adressage : VLAN/utilisateurs + passerelle","Vérifier le masque sur switch/routeur et postes"],
    c:`ipcalc 192.168.1.0/26
# /26 : masque 255.255.255.192, bloc 64
# ex. 192.168.1.0-63 : .1 gw, .2-62 hosts, .63 broadcast
python3 -c "import ipaddress; n=ipaddress.ip_network('192.168.10.0/26'); print(list(n.hosts())[:5])"
# VLSM
sipcalc 10.0.0.0/24`,
    p:["Réseau + broadcast non utilisables","/31 point à point (RFC3021), /32 hôte","Supernetting pour agrégation"],
    w:"Apprendre la table /24→/30 par cœur pour l'examen."
   },
   {
    id:"ccp4-cisco", t:"Cisco IOS : base, VLAN et sécurité", level:"intermediaire",
    r:"Modes User> Enable# Conf(t). Hostname, IP, VLAN, OSPF ; sécuriser par enable secret et SSH.",
    tags:["cisco","switch","router","ios"],
    g:["Packet Tracer : glisser switch/router, onglet CLI","Câbler cuivre droit PC-switch, croisé si besoin","Desktop > IP Configuration pour IP PC","Vérifier show run et sauvegarder"],
    c:`enable
configure terminal
hostname SW1
no ip domain-lookup
enable secret Str0ngPass!
username admin privilege 15 secret adminpass
vlan 10
 name COMPTA
exit
interface vlan 10
 ip address 192.168.10.1 255.255.255.0
 no shutdown
interface range f0/1-10
 switchport mode access
 switchport access vlan 10
show vlan brief
show ip interface brief
copy running-config startup-config`,
    p:["show run / show ip route / show vlan brief","crypto key generate rsa modulus 2048 pour SSH","service password-encryption pour obscurcir"],
    w:"Toujours sauvegarder startup-config ; un reboot non sauvegardé efface la config."
   },
   {
    id:"ccp4-trunk", t:"VLAN trunk, routage inter-VLAN et OSPF", level:"avance",
    r:"Trunk = 802.1Q multi-VLAN. OSPF = routage dynamique interne. DHCP par routeur pour multi-site.",
    tags:["trunk","ospf","routing","dhcp"],
    g:["Packet Tracer : trunk entre switches via GUI","Vérifier connectivité inter-VLAN via SVI/routeur","Observer les voisins OSPF"],
    c:`interface g0/1
 switchport mode trunk
 switchport trunk allowed vlan 10,20
 switchport trunk native vlan 99
!
interface g0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
!
router ospf 1
 network 192.168.10.0 0.0.0.255 area 0
 network 192.168.20.0 0.0.0.255 area 0
show ip ospf neighbor
ip dhcp pool LAN10
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 8.8.8.8`,
    p:["Natif VLAN à changer pour la sécurité","OSPF Hello 10s, Dead 40s","Cost OSPF = 10^8/bande passante"],
    w:"Un trunk mal autorisé bloque un VLAN silencieusement ; show interfaces trunk pour vérifier."
   },
   {
    id:"ccp4-stp", t:"STP, RSTP et EtherChannel", level:"avance",
    r:"STP empêche les boucles et bloque des ports ; RSTP accélère la convergence ; EtherChannel agrège des liens.",
    tags:["stp","rstp","etherchannel","switching"],
    g:["Définir la priorité du root bridge (root primaire/secondaire)","Activer RSTP","Créer le channel-group et vérifier sa cohérence"],
    c:`spanning-tree mode rapid-pvst
spanning-tree vlan 1 root primary
show spanning-tree
interface range g0/1-2
 channel-group 1 mode active
 channel-protocol lacp
show etherchannel summary
show interfaces trunk`,
    p:["Root bridge = ID le plus bas (priorité.MAC)","BPDU Guard sur ports edge","LACP actif/passif, PAgP desirable/auto"],
    w:"Une incohérence de VLAN sur un EtherChannel fait tomber tout le bundle."
   },
   {
    id:"ccp4-acl", t:"ACL et sécurité réseau", level:"intermediaire",
    r:"ACL standard près de la destination, étendue près de la source. Évaluées de haut en bas ; première qui matche gagne.",
    tags:["acl","securite","cisco"],
    g:["Définir la politique deny par défaut","Créer ACL nommée, ajouter les règles","Appliquer inbound/outbound selon besoin","Vérifier avec show access-lists et debug conditionnel"],
    c:`ip access-list extended LAN-OUT
 permit tcp 192.168.10.0 0.0.0.255 any eq 443
 deny ip 192.168.10.0 0.0.0.255 192.168.20.0 0.0.0.255
 permit ip any any
!
interface g0/1
 ip access-group LAN-OUT out
show access-lists
`,
    p:[" deny any any implicite à la fin","Standard ACL = seul source ; Extended = source/dest/proto/port","Time-range pour restrictions horaires"],
    w:"Appliquer une ACL sur la mauvaise interface/direction provoque des blocages inexpliqués."
   },
   {
    id:"ccp4-nat", t:"NAT/PAT et adressage public", level:"intermediaire",
    r:"PAT avec une IP publique pour sortie Internet ; NAT statique pour serveur publié ; pool pour grand volume.",
    tags:["nat","pat","routeur"],
    g:["Définir inside/outside sur les interfaces","ACL source et overload pour PAT","Règles statiques pour serveurs DMZ","Tester depuis l'extérieur"],
    c:`interface g0/0
 ip nat inside
interface g0/1
 ip nat outside
ip access-list standard NAT-SOURCES
 permit 192.168.10.0 0.0.0.255
ip nat inside source list NAT-SOURCES interface g0/1 overload
ip nat inside source static 192.168.10.20 203.0.113.20
show ip nat translations`,
    p:["Pool NAT pour plusieurs IP publiques","no-alias et overload","Tester la résolution DNS externe après NAT"],
    w:"Un serveur exposé sans pare-feu = compromission probable."
   },
   {
    id:"ccp4-ipv6", t:"IPv6, routage et transitions", level:"avance",
    r:"Adresses /64 pour LAN, link-local fe80::, EUI-64. OSPFv3 et DHCPv6/SLAAC.",
    tags:["ipv6","ospf","slaac"],
    g:["Activer IPv6 sur les interfaces","Configurer SLAAC ou DHCPv6","Tester ping6 et connectivité","Documenter le plan d'adressage IPv6"],
    c:`ipv6 unicast-routing
interface g0/0
 ipv6 address 2001:db8:10::1/64
 ipv6 nd other-config-flag
ipv6 router ospf 1
 router-id 1.1.1.1
interface g0/0
 ipv6 ospf 1 area 0
show ipv6 route
ping ipv6.google.com`,
    p:["fe80:: = link-local, non routable","Stateless (SLAAC) vs stateful (DHCPv6)","Dual-stack pendant la transition"],
    w:"Oublier ipv6 unicast-routing rend les paquets routables localement seulement."
   }
  ]
},
{
  id:"ccp5",
  group:"TSSR",
  icon:"🖥️",
  title:"CP5 - Installer et assurer l’exploitation de serveurs Windows et Linux",
  desc:"ESXi/vCenter, stockage, réseau, HA/DRS, snapshot et sauvegarde.",
  fiches:[
   {
    id:"ccp5-vsphere", t:"vSphere : ESXi + vCenter", level:"intermediaire",
    r:"ESXi = hyperviseur bare-metal. vCenter = pilotage central, inventaire, modèles, template et API.",
    tags:["vmware","esxi","vcenter","virtualisation"],
    g:["vSphere Client : hôtes > cluster > VM","Créer VM : nom, OS, CPU/RAM/disque (thin)","Installer VMware Tools, snapshot avant MAJ","Standardiser avec templates"],
    c:`# PowerCLI
Connect-VIServer vcenter.local
Get-VM
New-VM -Name SRV1 -MemoryGB 4 -NumCpu 2 -DiskGB 60 -VMHost esxi1
Start-VM SRV1
Get-Snapshot SRV1
New-Snapshot -VM SRV1 -Name "Avant-MAJ"`,
    p:["Thin = alloué à l'usage, Thick = réservé","Tools = performances et arrêt propre","Template réduit les erreurs de config"],
    w:"Snapshot n'est pas une sauvegarde ; il dépend de la VM parente."
   },
   {
    id:"ccp5-vmotion", t:"vMotion, HA, DRS et mise en réseau", level:"avance",
    r:"vMotion = migration à chaud, HA = redémarrage en cas de panne, DRS = équilibrage des charges.",
    tags:["vmotion","ha","drs","vswitch"],
    g:["Cluster : activer HA + DRS, ajouter 2 ESXi","vSwitch : ajouter les portgroups VLAN","Migrer : Migrate > vMotion","Tester la panne d'un host en maintenance"],
    c:`Get-Cluster | Select Name, HAEnabled, DrsEnabled, DrsAutomationLevel
Get-VirtualSwitch
Get-VMHostNetworkAdapter
Get-VM | Get-NetworkAdapter
Set-VM -VM SRV1 -MemoryGB 8 -Confirm:$false`,
    p:["vMotion nécessite VMkernel + stockage partagé","HA nécessite quorum et datastore heartbeat","DRS automatique recommandé en production"],
    w:"Tester HA en maintenance planifiée, jamais dans une vraie panne surprise."
   },
   {
    id:"ccp5-network", t:"Réseau virtuel et sécurité", level:"intermediaire",
    r:"vSwitch standard vs distribué, VLAN, promiscuous/port security et micro-segmentation future.",
    tags:["reseau virtuel","vlan","security"],
    g:["Créer un vSwitch par usage (admin, vmotion, stockage)","Définir des port groups avec VLAN","Limiter les ports trunk","Activer le contrôle de sécurité"],
    c:`New-VirtualSwitch -Name vSwitch1 -VMHost esxi1 -Nic vmnic1
New-PortGroup -Name "PG-APP" -VirtualSwitch vSwitch1 -VlanId 120
Get-VirtualPortGroup
# Réseau isolé pour NAS
`,
    p:["Séparer le trafic de sauvegarde du trafic production","Jumbo frames pour stockage iSCSI","MTU identique partout"],
    w:"Un VLAN erroné sur un port group silencieusement isole une VM."
   },
   {
    id:"ccp5-backup", t:"Sauvegarde et snapshot de VM", level:"intermediaire",
    r:"Protection avec Veeam/Azure ? à tester, snapshot pour maintenance, sauvegarde pour reprise.",
    tags:["backup","snapshot","vmware"],
    g:["Définir SLA par machine (RPO/RTO)","Planification des sauvegardes incrémentielles","Test de restauration trimestriel","Nettoyage des snapshots > 72 h"],
    c:`# Veeam CLI / PowerCLI examples
Backup-VM -Name SRV1 -Repository "Repo-NAS"
Restore-VM -Name SRV1 -RestorePoint (Get-RestorePoint SRV1 | Select -Last 1)
Get-Snapshot SRV1 | Where Created -lt (Get-Date).AddDays(-3)`,
    p:["Snapshot chaîne fragile si trop long","Application-consistent avec guest processing","Chiffrer les sauvegardes"],
    w:"Un snapshot resté ouvert trop longtemps dégrade fortement les performances I/O."
   },
   {
    id:"ccp5-hyper", t:"Hyper-V et autres hyperviseurs", level:"intermediaire",
    r:"Hyper-V natif Windows, Proxmox open-source, KVM/QEMU pour laboratoires. Les concepts se transfèrent.",
    tags:["hyperv","proxmox","kvm"],
    g:["Activer le rôle Hyper-V avec GUI ou PowerShell","Créer commutateur virtuel externe/interne","Gérer les VM avec Hyper-V Manager","Automatiser avec PowerShell"],
    c:`Install-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart
New-VMSwitch -Name "LAN" -NetAdapterName Ethernet -AllowManagementOS $true
New-VM -Name SRVH1 -MemoryStartupBytes 4GB -NewVHDPath C:\\VMs\\SRVH1.vhdx -NewVHDSizeBytes 60GB
Start-VM SRVH1`,
    p:["Hyper-V Replica pour la résilience simple","Checkpoint production à privilégier","Proxmox pour labo à moindre coût"],
    w:"La virtualisation imbriquée nécessite VT-x/EPT et peut casser les snapshots."
   }
  ]
}
]);

push([
{
  id:"ccp6", group:"TSSR", icon:"📜", title:"CP6 - Exploiter des serveurs dans une infrastructure virtualisée", desc:"Scripts Linux et Windows documentés ligne par ligne, pour exécuter et expliquer à l’oral.", fiches:[
   {
    id:"ccp6-bash-backup", t:"Bash : sauvegarde incrémentale et contrôle rotatif", level:"intermediaire",
    r:"rsync + journal, contrôle de retour, rotation simple des sauvegardes. Expliquer : arguments en majuscules, guillemets, code retour $?.",
    tags:["bash","rsync","backup","cron"],
    g:["Sauvegarder /srv/data vers /backup/data","Conserver les logs dans /var/log/backup-data.log","Planifier à 02:30 dans crontab avec crontab -e","Vérifier le code de retour après exécution"],
    c:`#!/bin/bash
set -euo pipefail
SRC="/srv/data"
DEST="/backup/data"
LOG="/var/log/backup-data.log"
DATE="$(date +%F-%H%M%S)"
mkdir -p "$DEST"
echo "[$DATE] Début sauvegarde $SRC vers $DEST" >> "$LOG"
rsync -av --delete --stats "$SRC/" "$DEST/" >> "$LOG" 2>&1
STATUS=$?
echo "[$DATE] Terminé avec code $STATUS" >> "$LOG"
exit $STATUS`,
    p:["Utiliser des guillemets autour de \"$SRC/\" et \"$DEST/\" pour éviter les espaces","Tester un fichier à la main avant cron","Exporter le log dans ELK/Graylog en production"],
    w:"Si $SRC est vide suite à une erreur de montage, --delete efface la sauvegarde. Ajouter une vérification de source non vide avant rsync."
   },
   {
    id:"ccp6-bash-check", t:"Bash : validation d'arguments et contrôle de fichier", level:"intermediaire", r:"Valider le nombre d'arguments, tester l'existence et le type avant d'agir, afficher un usage clair.",
    tags:["bash","arguments","validation","securite"],
    g:["Exemples : ./verif.sh /etc","Le script teste le nombre, le type de dossier et affiche les résultats","Utile en MEP pour prouver la rigueur"],
    c:`#!/bin/bash
set -euo pipefail
if [[ $# -ne 1 ]]; then
  echo "Usage : $0 dossier"
  echo "Exemple : $0 /etc"
  exit 1
fi
if [[ ! -d "$1" ]]; then
  echo "Erreur : $1 n'existe pas ou n'est pas un dossier"
  exit 2
fi
count=$(find "$1" -maxdepth 1 -type f -name "*.conf" ! -size 0 | wc -l)
echo "Fichiers .conf non vides dans $1 : $count"
find "$1" -maxdepth 1 -type f -name "*.conf" -size 0 -print`,
    p:["Ne pas utiliser ls dans un script ; préférer find","[[ ]] plus lisible pour les tests Bash","exit codes 1 = usage, 2 = fichier, 3 = autres erreurs"],
    w:"Sans validation, un script peut écrire dans le mauvais dossier."
   },
   {
    id:"ccp6-bash-monitor", t:"Bash : vérification d'un service et alerte simple", level:"debutant", r:"systemctl + journalisation, boucle while, timeout. Expliquer : commandes courtes et codes de retour.",
    tags:["bash","systemd","monitoring","service"],
    g:["Vérifier le statut SSH toutes les 5 minutes via cron","Journaliser les indisponibilités","Envoyer un mail avec msmtp si le service est down"],
    c:`#!/bin/bash
set -u
SERVICE="sshd"
LOG="/var/log/check-service-sshd.log"
if systemctl is-active --quiet "$SERVICE"; then
  status="OK"
else
  status="ERREUR"
  systemctl restart "$SERVICE"
fi
echo "$(date '+%F %T') - $SERVICE : $status" >> "$LOG"`,
    p:["Utiliser systemctl is-active rather than grep ps","Ajouter un lock pour éviter les redémarrages en boucle","Intégrer à Zabbix pour notification réelle"],
    w:"Alerter sans action peut masquer une panne ; toujours envisager automatique + escalade."
   },
   {
    id:"ccp6-bash-inventory", t:"Bash : inventaire et rapport d'un dossier partagé", level:"intermediaire", r:"find, awk, comptage par extension, fichier CSV. Montrer : boucle, tests et rediriger vers un fichier de sortie.",
    tags:["bash","inventaire","find","rapport"],
    g:["Générer un inventaire des fichiers dans /srv/partage","Compter les extensions et leur taille","Écrire le résultat dans CSV","Importer ensuite dans Excel/GLPI"],
    c:`#!/bin/bash
set -u
Dossier="/srv/partage"
Sortie="/tmp/inventaire-partage.csv"
echo "extension,nombre,taille octets" > "$Sortie"
find "$Dossier" -type f -print0 |
  awk 'BEGIN{RS="\0"} { n=split($0, a, "."); ext=(n>1)?a[n]:"sans"; print ext }' |
  sort | uniq -c | while read -r nb ext; do
    taille=$(find "$Dossier" -type f -name "*.$ext" -printf "%s\n" | awk '{s+=$1} END{print s+0}')
    echo "$ext,$nb,$taille" >> "$Sortie"
  done
cat "$Sortie"`,
    p:["find avec -print0 pour éviter les espaces dans les noms","uniq -c compte les lignes identiques","Sortie CSV ASCII pour éviter les accents illisibles"],
    w:"Les noms de fichiers avec retours de ligne cassent le parsing ; -print0 + traitement adapté est recommandé."
   },
   {
    id:"ccp6-ps-users", t:"PowerShell : création massive d'utilisateurs AD depuis CSV", level:"intermediaire", r:"Import-Csv + ForEach-Object + New-ADUser. Expliquer : pipeline d'objets, variables, attributs obligatoires.",
    tags:["powershell","ad","utilisateurs","csv"],
    g:["Préparer .\\users.csv avec colonnes Prenom,Nom,Login,GroupeMetier","Lancer le script dans une console d'admin","Vérifier dans ADUC et dans Get-ADUser","Cocher le changement de mot de passe à la prochaine ouverture"],
    c:`# users.csv attendu :
# Prenom,Nom,Login,GroupeMetier
$MotDePasseTemporaire = Read-Host "Mot de passe temporaire" -AsSecureString
Import-Csv .\\users.csv | ForEach-Object {
    $NomComplet = "$($_.Prenom) $($_.Nom)"
    New-ADUser -Name $NomComplet -GivenName $_.Prenom -Surname $_.Nom -SamAccountName $_.Login -UserPrincipalName "$($_.Login)@tssr.local" -Enabled $true -ChangePasswordAtLogon $true -AccountPassword $MotDePasseTemporaire
    Add-ADGroupMember -Identity "G_$($_.GroupeMetier)" -Members $_.Login
    Write-Host "Créé : $NomComplet ($($_.Login))" -ForegroundColor Green
}`,
    p:["Utiliser un compte admin délégué et non Domain Admin pour la prod","CSV encodé UTF-8","Renseigner aussi l'UPN pour les connexions e-mail"],
    w:"New-ADUser ne modifie pas mot de passe automatiquement si l'option -ChangePasswordAtLogon n'est pas posée."
   },
   {
    id:"ccp6-ps-inactive", t:"PowerShell : rapport des utilisateurs inactifs", level:"intermediaire", r:"Get-ADUser + LastLogonDate, Export-Csv. Expliquer : filtrage, date calculée, export lisible pour audit.",
    tags:["powershell","ad","audit","rapport"],
    g:["Chercher les comptes sans connexion depuis 90 jours","Exporter un CSV","Désactiver ou supprimer après validation manager","Archiver dans le dossier admin"],
    c:`$Seuil = (Get-Date).AddDays(-90)
$Inactifs = Get-ADUser -Filter "Enabled -eq 'True'" -Properties LastLogonDate |
    Where-Object { $_.LastLogonDate -lt $Seuil -or $_.LastLogonDate -eq $null } |
    Select-Object Name, SamAccountName, LastLogonDate, DistinguishedName
$Inactifs | Export-Csv -Path "C:\\temp\\inactifs-90j.csv" -NoTypeInformation -Encoding UTF8
Write-Output "$($Inactifs.Count) comptes à traiter"
$Inactifs`,
    p:["LastLogonDate peut être incomplet ; utiliser LastLogonTimestamp si besoin","Ajouter un bloc try/catch si export impossible","Valider avec le manager avant désactivation"],
    w:"Les comptes de service n'ont pas toujours de LastLogonDate ; ne pas les désactiver sans vérification."
   },
   {
    id:"ccp6-ps-perm", t:"PowerShell : rapport de droits sur un dossier partagé", level:"intermediaire", r:"Get-Acl + ACL, affichage des groupes et niveaux d'accès. Montrer : pourquoi on sépare DomainLocal et Global.",
    tags:["powershell","acl","permissions","partage"],
    g:["Chemin \\\\serveur\\partage\\compta","Lire les ACL NTFS","Exporter le résultat en CSV","Comparer avec la matrice AGDLP"],
    c:`$Chemin = "D:\\Shares\\Compta"
$Acl = Get-Acl -Path $Chemin
$Acl.Access |
    Select-Object IdentityReference, FileSystemRights, AccessControlType |
    Export-Csv "C:\\temp\\acl-compta.csv" -NoTypeInformation -Encoding UTF8
$Acl.Access`,
    p:["Tenir la matrice AGDLP à jour","Auditer trimestriellement","Ne jamais donner Full Control par défaut"],
    w:"Le droit NTFS le plus restrictif gagne lorsqu'il est combiné avec la permission de partage."
   },
   {
    id:"ccp6-ps-service", t:"PowerShell : surveillance et redémarrage contrôlé", level:"debutant", r:"Get-Service + boucle While + Start-Service. Expliquer : état Running/Stopped et tentatives de relance.",
    tags:["powershell","services","supervision"],
    g:["Vérifier le spooler et l'agent GLPI toutes les 15 minutes","Redémarrer si stopped","Journaliser la relance","Alerter l'utilisateur en cas d'échec"],
    c:`$Services = @("Spooler","GLPI-Agent")
foreach ($Nom in $Services) {
    $Svc = Get-Service -Name $Nom -ErrorAction SilentlyContinue
    if ($null -eq $Svc) {
        Write-Warning "Le service $Nom n'existe pas"
        continue
    }
    if ($Svc.Status -ne "Running") {
        Write-Host "$Nom est arrêté : tentative de redémarrage"
        Start-Service -Name $Nom
        Start-Sleep -Seconds 3
        (Get-Service -Name $Nom).Status
    } else {
        Write-Host "$Nom OK"
    }
}`,
    p:["Utiliser Invoke-Command pour exécuter sur plusieurs serveurs","Ajouter un timeout et un nombre max d'essais","Journaliser dans Windows Event Log"],
    w:"Un redémarrage automatique sans analyse peut masquer une panne récurrente."
   },
   {
    id:"ccp6-ps-backup", t:"PowerShell : sauvegarde Windows (robocopy)", level:"intermediaire", r:"Robocopy avec journal et codes retour. On explique : /MIR pour miroir, risque de suppression, et contrôle code 1-7.",
    tags:["powershell","robocopy","backup","windows"],
    g:["Sauvegarder C:\\data vers E:\\backup\\data","Vérifier le code retour","Garder le log dans un dossier audit","Planifier via le Planificateur de tâches"],
    c:`$Source = "C:\\data"
$Cible = "E:\\backup\\data"
$Log = "C:\\logs\\robocopy-data.log"
robocopy $Source $Cible /MIR /Z /R:3 /W:5 /LOG:$Log /NDL /NP
$Code = $LASTEXITCODE
if ($Code -lt 8) {
    Write-Host "Sauvegarde terminée, code $Code" -ForegroundColor Green
} else {
    Write-Warning "Sauvegarde échouée, code $Code"
}
exit $Code`,
    p:["/MIR supprime ce qui a disparu source, comme rsync --delete","/Z pour reprise réseau","Mettre /XD pour exclure caches"],
    w:"Ne pas utiliser /MIR sans stratégie de versioning ; cela efface les fichiers vieille version côté cible."
   }
  ]
},
{
  id:"ccp7",
  group:"TSSR",
  icon:"🬞",
  title:"CP7 - Gérer les accès et la sécurité dans un environnement hybride",
  desc:"Pare-feu, règles, NAT, VPN site-à-site/nomade, filtrage web.",
  fiches:[
   {
    id:"ccp7-firewall", t:"Règles de pare-feu et ordre d'évaluation", level:"intermediaire",
    r:"Évaluées haut→bas, première qui matche gagne. WAN deny all par défaut, LAN allow contrôlé.",
    tags:["pfsense","firewall","regles"],
    g:["Firewall > Rules > LAN/WAN > Add","Action Pass/Block, protocole, source, destination port","Apply Changes puis journaliser les blocs","Tester via Syslog"],
    c:`# iptables équivalent
iptables -L -n -v
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -P INPUT DROP
# pfSense : limiter l'admin à un alias`,
    p:["Limiter la sortie LAN au strict nécessaire","Ordre critique pour les exceptions","Alias pour regrouper IP/services"],
    w:"Les règles sont appliquées par interface entrante ; la direction est source de confusion."
   },
   {
    id:"ccp7-natvpn", t:"NAT, VPN IPsec/OpenVPN et proxy", level:"avance",
    r:"PAT = 1 IP publique. IPsec site-à-site, OpenVPN nomade. Squid = filtre web, authentification et cache.",
    tags:["nat","vpn","ipsec","openvpn","proxy"],
    g:["Firewall > NAT > Outbound (auto)","VPN > IPsec/OpenVPN : assistant, certificats","Tester le VPN hors LAN (4G)","Proxy Squid : service + ACL"],
    c:`show nat translations
# OpenVPN test
openvpn --config client.ovpn
# Squid
squid -k reconfigure
grep ^acl /etc/squid/squid.conf`,
    p:["DMZ pour services exposés (voir fiche DMZ)","NAT = cause fréquente d'audio VoIP unidirectionnel","VPN : désynchroniser les plages LAN distantes"],
    w:"Le VPN sans test externe laisse des erreurs de NAT/masquage inaperçues."
   },
   {
    id:"ccp7-ids", t:"IDS/IPS et supervision sécurité", level:"avance",
    r:"Suricata/Snort pour détecter et bloquer ; corréler alertes et logs, éviter les faux positifs.",
    tags:["ids","ips","suricata","securite"],
    g:["Activer le package Suricata","Choisir les règles ET open","Alerte puis block en mode legacy/block","Suivre les stats et top signatures"],
    c:`# pfSense Suricata
# Services > Suricata > Interfaces > Add
# Blocage via pfctl table
pfctl -t snort2c -T show | head
# Mise à jour des règles
# Suricata update`,
    p:["Les sondes mirror/triple n'impactent pas la latence","Tuner les règles par groupe","Corréler avec SIEM pour vue globale"],
    w:"Une règle trop large peut bloquer le trafic légitime de production."
   }
  ]
},
{
  id:"ccp8",
  group:"TSSR",
  icon:"💾",
  title:"CP9 - Assurer la continuité et la reprise de l’infrastructure",
  desc:"Règle 3-2-1, RPO/RTO, outils, tests de restauration.",
  fiches:[
   {
    id:"ccp8-321", t:"3-2-1, RPO/RTO et stratégie", level:"intermediaire",
    r:"Trois copies, deux supports, une hors site. RPO = perte max acceptable, RTO = durée panne acceptable.",
    tags:["backup","321","pra","rpo","rto"],
    g:["Windows Server Backup : sauvegarder volumes","Veeam : job, repository, planification, test restore","Tester restauration fichier + VM complète","Chiffrer et vérifier"],
    c:`wbadmin start backup -backupTarget:E: -include:C: -quiet
wbadmin get versions
# Linux
tar -czf /backup/etc-$(date +%F).tgz /etc
rsync -av --delete /data/ /backup/data/
borg create /backup/repo::etc-$(date +%F) /etc`,
    p:["Complète + incrémentielle/différentielle","Vérifier l'intégrité avec checksums","Détention hors ligne pour se protéger du ransomware"],
    w:"Une sauvegarde non testée n'est pas une sauvegarde."
   },
   {
    id:"ccp8-outils", t:"Outils et reprise bare-metal", level:"intermediaire",
    r:"Image système, Veeam B&R, Bacula, Proxmox Backup Server, test de restore sur hardware différent.",
    tags:["backup","bare metal","restore"],
    g:["Créer un média de secours","Documenter la procédure de reprise","Tester la restauration sur une VM distincte","Valider les applications après restore"],
    c:`# Veeam
veeamconfig repository list
# Proxmox
proxmox-backup-client backup /etc pxar:etc --repository pbs@192.168.1.5:store
# Test restore
qemu-img convert disk.qcow2 -O raw /dev/sdb`,
    p:["RTO d'un serveur = souvent dépendant des licences","Rétention légale selon activité","Versioning et immutabilité"],
    w:"La sauvegarde d'une base vivante doit être cohérente applicative (dump, VSS)."
   },
   {
    id:"ccp8-zfs", t:"ZFS et sauvegarde cohérente", level:"avance",
    r:"Snapshots atomiques, réplication send/receive, détection de corruption par checksum.",
    tags:["zfs","snapshot","replication"],
    g:["Créer un pool et des datasets","Snapshot avant MAJ","Répliquer vers un NAS","Surveiller scrub"],
    c:`zpool create tank /dev/sdb
zfs create tank/data
zfs snapshot tank/data@avant-maj
zfs send tank/data@avant-maj | ssh backup zfs recv tank/data
zpool scrub tank`,
    p:["ARC RAM pour cache de lecture","Ne pas utiliser ZFS sur disques non ECC pour production critique","Compression lz4 par défaut"],
    w:"Un scrub régulier révèle la dégradation silencieuse."
   }
  ]
},
{
  id:"ccp9",
  group:"TSSR",
  icon:"🚀",
  title:"CP10 - Mettre à jour et superviser les éléments de l’infrastructure",
  desc:"MDT/WDS, Sysprep, capture image, déploiement PXE, gestion poste.",
  fiches:[
   {
    id:"ccp9-deploiement", t:"MDT/WDS, Sysprep et déploiement", level:"intermediaire",
    r:"Image de référence → Sysprep → capture → déploiement PXE. Gérer les drivers par modèle.",
    tags:["mdt","wds","sysprep","deploiement"],
    g:["WDS : ajouter images boot/install et activer PXE","MDT : task sequence, applications, drivers","Sysprep OOBE + generalize + shutdown","DHCP options 66/67 pour PXE"],
    c:`sysprep /oobe /generalize /shutdown
dism /Capture-Image /ImageFile:D:\\ref.wim /CaptureDir:C:\\ /Name:Ref /Compress:max
wdsutil /get-image /imagename:Ref
# MDT : Update Deployment Share`,
    p:["Ne jamais cloner sans Sysprep (SID doublon)","Driver store séparé par modèle","Tests sur une VM avant prod"],
    w:"Un reboot pendant Sysprep peut casser l'image."
   },
   {
    id:"ccp9-gposoft", t:"Déploiement logiciel par GPO et Intune", level:"intermediaire",
    r:"MSI via GPO pour le on-prem ; Intune/MDM pour le nomade. Toujours tester la désinstallation.",
    tags:["gpo","msi","intune","deploiement"],
    g:["Créer GPO ordinateur pour installation MSI","Ajouter fichier MSI dans \\domaine\\NETLOGON","Filtrer par groupe WMI OU","Surveiller le journal d'événements application"],
    c:`New-GPO -Name "Deploiement 7zip"
# Détails : ordinateur > stratégie > logiciels > MSI
msiexec /i app.msi /quiet /norestart /l*v C:\\logs\\install.log
Get-WinEvent -LogName Application | Where Message -match "MsiInstaller"`,
    p:["MSI transform (.mst) pour personnalisation","UPN pour utilisateurs nomades","Intune win32 pour combiner MSI+scripts"],
    w:"Les déploiements GPO nécessitent un redémarrage ou gpupdate /force pour application."
   },
   {
    id:"ccp9-remote", t:"Administration et inventaire de parc", level:"intermediaire",
    r:"RMM, inventaire hardware/software, patch, télémaintenance et reporting.",
    tags:["inventaire","rmm","parc"],
    g:["Installer un agent d'inventaire (GLPI Agent, OCS)","Collecter les infos matériel","Rapporter patchs et vulnérabilités","Planifier l'obsolescence"],
    c:`# GLPI Agent
glpi-agent --server http://glpi.local --inventory
# PowerShell inventaire local
Get-CimInstance Win32_ComputerSystem | Select Name, Manufacturer, Model
Get-CimInstance Win32_OperatingSystem | Select Caption, Version, LastBootUpTime`,
    p:["Matrice de compatibilité avec l'OS","Dernier boot et uptime comme indicateurs","Enlever les postes obsolètes de l'AD"],
    w:"Sans inventaire, l'obsolescence et les risques sont invisibles."
   }
  ]
},
{
  id:"ccp10",
  group:"TSSR",
  icon:"📞",
  title:"CCP10 · VoIP, DMZ et intranet",
  desc:"VoIP/SIP, Asterisk, DMZ sécurisée, Apache, proxy et durcissement.",
  fiches:[
   {
    id:"ccp10-toip", t:"Asterisk / FreePBX et diagnostic SIP", level:"intermediaire",
    r:"SIP 5060, RTP 10000-20000, codecs G.711/G.729. QoS et VLAN voix.",
    tags:["voip","sip","asterisk","qos"],
    g:["FreePBX : extensions, trunk, routes entrantes/sortantes","Provisionner téléphones SIP","Tester appel interne puis externe","QoS : prioriser la voix (DSCP EF)"],
    c:`asterisk -rvvv
sip show peers
pjsip show endpoints
rtp set debug on
# ports
# SIP 5060 UDP/TCP, RTP 10000-20000 UDP
asterisk -rx "core show channels"`,
    p:["NAT = audio unidirectionnel fréquent","VLAN voix séparé","RTCP pour la qualité"],
    w:"Les ALG SIP des routeurs peuvent casser la signalisation."
   },
   {
    id:"ccp10-dmz", t:"DMZ, Apache et filtrage IP", level:"intermediaire",
    r:"DMZ = zone tampon. LAN→DMZ OK, WAN→DMZ seulement 80/443, DMZ→LAN refusé.",
    tags:["dmz","apache","firewall","iptables"],
    g:["Apache : sites-available, a2ensite intranet","Restreindre : Require ip 192.168.1.0/24","Pare-feu : règles LAN/DMZ/WAN","Activer TLS interne"],
    c:`apt install apache2 -y
a2ensite intranet
systemctl reload apache2
# restriction
# <Directory /var/www/intranet> Require ip 192.168.1.0/24 </Directory>
iptables -A FORWARD -i eth0 -o dmz -j ACCEPT
iptables -A FORWARD -i wan -o dmz -p tcp --dport 443 -j ACCEPT
iptables -A FORWARD -i dmz -o lan -j DROP`,
    p:["Reverse proxy en DMZ, données en LAN","Logs + rotation + TLS","HSTS et redirection 80→443"],
    w:"Exposer le SSH de la DMZ vers Internet est une erreur classique."
   },
   {
    id:"ccp10-durc", t:"Durcissement Linux et web", level:"avance",
    r:"Réduire la surface d'attaque : services minimaux, permissions, fail2ban, HTTPS forcé.",
    tags:["hardening","securite","web"],
    g:["Désactiver les services inutiles","Mettre à jour et reboot planifié","Configurer fail2ban pour SSH","Scanner avec lynis"],
    c:`systemctl disable --now telnet.socket
apt install fail2ban -y
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
systemctl enable --now fail2ban
lynis audit system`,
    p:["Headers de sécurité Apache (CSP, HSTS)","Sudo avec groupes et logs","Chiffrement des certificats"],
    w:"Le durcissement sans communication peut casser des applications métier."
   }
  ]
}
]);

push([
{
  id:"ccna",
  group:"TSSR",
  icon:"🌐",
  title:"Réseaux IP, routage et services (CP4/CP7)",
  desc:"OSI, IPv4/IPv6, commutation, routage, WLAN, WAN, services, sécurité, programmation.",
  fiches:[
   {
    id:"ccna-pdf", t:"Lien CCNA1.pdf du dépôt", level:"debutant",
    r:"Le PDF de 15 Mo reste la référence détaillée. Le site = fiches de révision + labos + QCM.",
    tags:["ccna","pdf","revision"],
    g:["Ouvrir CCNA1.pdf dans le repo","Chercher par mot-clé dans le PDF","Annoter les points à revoir"],
    c:`# Ouvrir le PDF du repo :
# https://herbreteau787-svg.github.io/Guide-TSSR/CCNA1.pdf
# Local : ./CCNA1.pdf`,
    p:["PDF + fiches = révision active","Alterner lecture et pratique Packet Tracer","Garder une checklist par objectif"],
    w:"Lire passivement le PDF ne suffit pas ; il faut configurer."
   },
   {
    id:"ccna-ipv4v6", t:"IPv4/IPv6 et routage", level:"intermediaire",
    r:"OSI vs TCP/IP, IPv6 /64 pour LAN, link-local fe80::. OSPF single-area, statique + route par défaut.",
    tags:["ipv4","ipv6","ospf","routing"],
    g:["Packet Tracer : 2 routeurs + OSPF","Wireshark : observer ARP/DHCP/DNS","Tester le routage statique puis dynamique"],
    c:`ip route 0.0.0.0 0.0.0.0 192.168.1.1
show ip route
ipv6 address 2001:db8::1/64
router ospf 1
 network 10.0.0.0 0.255.255.255 area 0`,
    p:["AD : connected 0, static 1, OSPF 110","fe80:: = link-local","VLSM pour optimiser"],
    w:"Sans route par défaut, les réseaux locaux communiquent mais pas avec Internet."
   },
   {
    id:"ccna-switching", t:"Commutation : VLAN/STP/EtherChannel", level:"intermediaire",
    r:"Access vs trunk, STP bloque les boucles, EtherChannel agrège. Rapid-PVST recommandé.",
    tags:["vlan","stp","etherchannel"],
    g:["Créer VLANs et trunk, tester ping inter-VLAN","Vérifier le root STP","Configurer LACP et summary"],
    c:`spanning-tree mode rapid-pvst
show spanning-tree
interface range g0/1-2
 channel-group 1 mode active
show etherchannel summary`,
    p:["Root = smallest Bridge ID","LACP active/passive","BPDU Guard sur edge ports"],
    w:"Un trunk natif non changé laisse passer le VLAN 1 partout."
   },
   {
    id:"ccna-security", t:"Sécurité, services et automatisation", level:"avance",
    r:"ACL, NAT/PAT, DHCP snooping, SSH, NTP, QoS, SDN, REST/Python pour opérations répétables.",
    tags:["securite","services","sdn","automation"],
    g:["Activer SSH, désactiver telnet","ACL sur VTY + interface","Vérifier NTP synchronisé","Controller SDN dashboard"],
    c:`access-list 10 permit 192.168.10.0 0.0.0.255
ip nat inside source list 10 interface g0/0 overload
username admin privilege 15 secret xxx
ip ssh version 2
ntp server 1.fr.pool.ntp.org
# Python netmiko
# from netmiko import ConnectHandler`,
    p:["Standard près source, étendue près destination","Automatiser = JSON/REST + Python","QoS : classify, mark, queue"],
    w:"SSH obligatoire, telnet interdit. Les ACL doivent être journalisées."
   },
   {
    id:"ccna-troubleshoot", t:"Méthodologie de dépannage", level:"intermediaire",
    r:"Collecter, analyser, tester des hypothèses, implémenter, vérifier, documenter. Toujours un changement à la fois.",
    tags:["troubleshooting","methodologie"],
    g:["Reproduire le défaut","Isoler la couche (OSI)"," Tester avec outils simples","Documenter la solution"],
    c:`show running-config
show ip interface brief
show interfaces status
ping 8.8.8.8 source g0/0
traceroute 8.8.8.8
show logging`,
    p:["Diviser pour régner","Changement unique pour identifier la cause","Checklist post-intervention"],
    w:"Ne jamais faire plusieurs changements en même temps en dépannage."
   },
   {
    id:"ccna-wireless", t:"WLAN : 802.11, WPA2/WPA3, roaming", level:"intermediaire",
    r:"BSS, ESS, SSID, couche 2 roaming, authentification 802.1X, WPA3-SAE. Sécuriser le Wi-Fi.",
    tags:["wifi","wlan","wireless","wpa3"],
    g:["Configurer contrôleur WLC","SSID avec VLAN dédié","RADIUS/802.1X","Roaming inter-AP"],
    c:`# Cisco WLC CLI (extrait)
config wlan create 1 CORP corp-ssid
config wlan security wpa akm 802.1x enable 1
config wlan interface 1 management
show wlan summary`,
    p:["Band steering 2.4/5 GHz","Fast roaming (802.11r/k/v)","WPA3 pour nouveaux déploiements"],
    w:"Un SSID ouvert = risque majeur ; segmenter les invités."
   },
   {
    id:"ccna-wan", t:"WAN, VPN et SD-WAN", level:"avance",
    r:"MPLS, IPsec site-à-site, DMVPN, SD-WAN pour le multi-site intelligent et résilient.",
    tags:["wan","vpn","sdwan"],
    g:["Choisir IPsec vs TLS","QoS sur liens lents","Monitoring des liens","Bascule automatique"],
    c:`crypto isakmp policy 10
 encryption aes 256
 hash sha256
 authentication pre-share
 group 14
crypto keyring ...
`,
    p:["DMVPN phase 2/3 pour hub-spoke","SD-WAN = routage applicatif","SLA pour voix"],
    w:"Les tunnels sans keepalive masquent une panne WAN partielle."
   }
  ]
},
{
  id:"exam",
  group:"Examens",
  icon:"📝",
  title:"Examens blancs, dossier pro et révision",
  desc:"Méthode, MSP, dossier professionnel, QCM et simulation orale.",
  fiches:[
   {
    id:"exam-method", t:"Méthode MSP et dossier professionnel", level:"exam",
    r:"Comprendre besoin → maquetter → déployer → tester → documenter → présenter. La documentation compte autant que la technique.",
    tags:["msp","dossier","oral","exam"],
    g:["Planifier 5 jours : 1 CCP/jour + blanc","Rédiger dossier : contexte, choix, configs, tests","Simuler oral 20 min + questions","Charger le matériel hors ligne"],
    c:`# Checklist :
# - schéma réseau à jour
# - confs sauvegardées (run/start, exports)
# - tests ping/tracert + captures
# - tableau PRA RPO/RTO
# - justification de chaque choix`,
    p:["Justifier chaque choix technique","Apporter preuves de tests","Garder des captures horodatées"],
    w:"Sans documentation, la technique ne compte pas."
   },
   {
    id:"exam-qcm", t:"QCM express et auto-test", level:"exam",
    r:"Utiliser le module QCM du site pour s'évaluer. Viser 80% avant jour J sur chaque thématique.",
    tags:["qcm","revision","test"],
    g:["Cocher les fiches 'Lues' pour la progression","Relire les points Warn avant l'examen","Faire 20 questions par CCP puis examen blanc"],
    c:`# Exemples :
# Q: 169.254.x.x signifie ? R: DHCP KO (APIPA)
# Q: Port SSH ? 22 - RDP ? 3389
# Q: /26 = ? 62 hôtes
# Q: PDC ? temps + MDP`,
    p:["80% sans notes = niveau exam","Analyser les erreurs par catégorie","Réviser les warn systématiques"],
    w:"Le QCM ne remplace pas la pratique sur Packet Tracer/VM."
   },
   {
    id:"exam-softskills", t:"Communication et présentation orale", level:"exam",
    r:"Expliquer simplement, structurer la réponse, gérer le stress et les imprévus. Le jury évalue la posture professionnelle.",
    tags:["oral","communication","softskills"],
    g:["Structure : problème, diagnostic, solution, preuve","Répéter à haute voix","Préparer des réponses courtes","Gérer les questions inconnues avec honnêteté"],
    c:`# Modèle réponse orale
# 1. Ce que j'ai observé
# 2. La cause probable
# 3. L'action effectuée
# 4. La vérification
# 5. La documentation`,
    p:["Ne pas bluffer ; proposer une piste de recherche","Montrer les schémas","Restaurer la confiance après une erreur"],
    w:"Un examinateur préfère l'honnêteté à une réponse inventée."
   },
   {
    id:"exam-checklist", t:"Checklist jour J et matériel", level:"exam",
    r:"Préparation logistique autant que technique : VM, outils, documents, identifiants, sauvegardes hors ligne.",
    tags:["checklist","examen","preparation"],
    g:["Vérifier les VMs et les ISO","Exporter les configs et PDFs","Charger le matériel sans réseau","Dormir suffisamment"],
    c:`# Checklist jour J
# - VMs démarrées
# - Packet Tracer installé
# - CCNA1.pdf local
# - Credentials dans coffre
# - Sauvegardes USB`,
    p:["Batterie et chargeur","Souris filaire de secours","Eau et pauses"],
    w:"Un matériel défaillant ne doit pas ruiner des mois de préparation."
   }
  ]
}
]);


})(window.GUIDE);

/* chunks/03-labs.js */
(function(G){
G.labs = G.labs || [];
G.labs.push(...[
{
 id:"lab-vlan", title:"Lab 1 · VLAN et trunk entre 2 switches", section:"ccp4", level:"intermediaire", duration:"45 min",
 objective:"Créer VLAN 10/20, trunk 802.1Q et vérifier la connectivité inter-VLAN via un routeur.",
 prerequisites:["Packet Tracer installé","Connaissance IP de base"],
 steps:[
  "Topologie : 2 switches, 1 routeur, 4 PC.",
  "Créer VLAN 10 (COMPTA) et 20 (INFO) sur les 2 switches.",
  "Assigner PC1/PC2 en VLAN 10, PC3/PC4 en VLAN 20.",
  "Configurer trunk sur le lien inter-switch (allowed vlan 10,20).",
  "Configurer sous-interfaces routeur 802.1Q pour inter-VLAN.",
  "Tester ping inter-VLAN et traceroute."
 ],
 validation:["show vlan brief affiche les VLAN","show interfaces trunk montre le lien","Ping inter-VLAN OK"],
 troubleshooting:["Vérifier native VLAN","Port en access non assigné","Trunk allowed list incomplète"]
},
{
 id:"lab-ospf", title:"Lab 2 · OSPF single-area", section:"ccp4", level:"avance", duration:"60 min",
 objective:"Mettre en place OSPF area 0 entre 3 routeurs et vérifier la table de routage.",
 prerequisites:["Notions de masque CIDR"],
 steps:[
  "Topologie 3 routeurs en triangle",
  "Configurer les IPs et le loopback",
  "Activer OSPF process 1 et annoncer les réseaux",
  "Vérifier voisins et LSDB",
  "Injecter une route par défaut",
  "Tester la convergence après coupure"
 ],
 validation:["show ip ospf neighbor = Full","show ip route O","Ping end-to-end"],
 troubleshooting:["Area mismatch","MTU mismatch","Passive-interface oublié"]
},
{
 id:"lab-acl", title:"Lab 3 · ACL étendue et test", section:"ccp4", level:"intermediaire", duration:"30 min",
 objective:"Créer une ACL pour bloquer SSH depuis un VLAN et autoriser HTTPS.",
 prerequisites:["Lab VLAN"],
 steps:[
  "Définir l'ACL nommée LAN-FILTER",
  "Ajouter deny tcp VLAN10 any eq 22",
  "Ajouter permit ip any any",
  "Appliquer inbound sur interface LAN",
  "Tester SSH refusé et HTTPS autorisé",
  "Journaliser les refus"
 ],
 validation:["show access-lists compte les hits","SSH timeout, HTTPS OK"],
 troubleshooting:["Direction de l'ACL inversée","Ordre des règles","Masque wildcard erroné"]
},
{
 id:"lab-ad", title:"Lab 4 · Forêt AD + DNS + jonction", section:"ccp2", level:"intermediaire", duration:"90 min",
 objective:"Installer AD DS sur S1, créer OU/groupes, puis joindre un poste et appliquer une GPO.",
 prerequisites:["VM Windows Server", "Client Windows"],
 steps:[
  "Installer le rôle AD DS + DNS via PowerShell",
  "Promouvoir en forêt tssr.local avec DSRM",
  "Créer OU Structure et groupes (G/LD)",
  "Joindre le poste PC01 au domaine",
  "Créer GPO de fond d'écran et de script",
  "Tester gpupdate et gpresult"
 ],
 validation:["dcdiag /q OK","nslookup tssr.local","gpresult /r affiche la GPO"],
 troubleshooting:["Horloge > 5 min","DNS poste non pointé vers DC","Firewall AD non autorisé"]
},
{
 id:"lab-gpo", title:"Lab 5 · GPO de déploiement logiciel", section:"ccp2", level:"intermediaire", duration:"40 min",
 objective:"Déployer 7-Zip par GPO et vérifier sur un poste pilote.",
 prerequisites:["AD fonctionnel"],
 steps:[
  "Placer le MSI dans \\domaine\\NETLOGON",
  "Créer GPO 'Deploy-7zip'",
  "Ajouter l'installation sous ordinateur",
  "Filtrer par OU Pilote",
  "Forcer gpupdate /force et redémarrer",
  "Vérifier dans Programmes"
 ],
 validation:["Événement 1033 Application","7zip installé"],
 troubleshooting:["Architecture x86/x64","GPO non liée à l'OU","Cache MSI corrompu"]
},
{
 id:"lab-linux-base", title:"Lab 6 · Administration Linux de base", section:"ccp3", level:"debutant", duration:"45 min",
 objective:"Créer utilisateurs/groupes, sécuriser SSH et gérer un service systemd.",
 prerequisites:["VM Linux Ubuntu"],
 steps:[
  "Mettre à jour les paquets",
  "Créer l'utilisateur admin et le groupe dev",
  "Générer et déployer une clé SSH",
  "Désactiver le login root direct",
  "Installer nginx comme service",
  "Vérifier le journal nginx"
 ],
 validation:["ssh par clé OK, password refusé","systemctl is-active nginx"],
 troubleshooting:["UFW bloque 22","Clé avec mauvaises permissions","SELinux si RHEL"]
},
{
 id:"lab-netplan", title:"Lab 7 · IP statique Netplan", section:"ccp3", level:"debutant", duration:"20 min",
 objective:"Attribuer une IP statique via Netplan et tester.",
 prerequisites:["Lab Linux de base"],
 steps:[
  "Éditer /etc/netplan/01-netcfg.yaml",
  "Définir IP, gateway, DNS",
  "netplan apply",
  "Tester IP, route, ping DNS",
  "Corriger en cas d'erreur YAML"
 ],
 validation:["ip a affiche la nouvelle IP","Resolv fonctionnel"],
 troubleshooting:["Indentation YAML","Interface nommée différemment","Perte de connexion SSH"]
},
{
 id:"lab-lvm", title:"Lab 8 · LVM et montage", section:"ccp3", level:"avance", duration:"45 min",
 objective:"Créer PV/VG/LV, formater et monter avec fstab.",
 prerequisites:["Disque supplémentaire attaché"],
 steps:[
  "lsblk pour identifier le disque",
  "pvcreate, vgcreate, lvcreate",
  "mkfs.ext4",
  "mount et test",
  "Ajouter à fstab et mount -a",
  "Créer un snapshot"
 ],
 validation:["df -h affiche le montage","mount -a sans erreur"],
 troubleshooting:["fstab mal renseigné","VG existant","Snapshot plein"]
},
{
 id:"lab-pfsense", title:"Lab 9 · pfSense base + NAT", section:"ccp7", level:"intermediaire", duration:"60 min",
 objective:"Installer pfSense, créer LAN/WAN, NAT outbound et une règle de blocage.",
 prerequisites:["VM pfSense"],
 steps:[
  "Installer pfSense et définir interfaces",
  "Accéder à l'interface web",
  "Configurer WAN (DHCP) et LAN (static)",
  "Vérifier Outbound NAT automatique",
  "Créer une règle pour bloquer Facebook",
  "Tester depuis un poste LAN"
 ],
 validation:["Poste LAN obtient IP","Navigation HTTP/HTTPS OK sauf règle"],
 troubleshooting:["Interfaces inversées","DNS resolver non actif","Règle mal placée"]
},
{
 id:"lab-vpn", title:"Lab 10 · VPN OpenVPN nomade", section:"ccp7", level:"avance", duration:"60 min",
 objective:"Configurer OpenVPN sur pfSense et connecter un client externe.",
 prerequisites:["Lab pfSense"],
 steps:[
  "Créer une CA et certificat serveur",
  "Assistant OpenVPN wizard",
  "Exporter la configuration client",
  "Importer dans le client OpenVPN",
  "Tester depuis 4G",
  "Vérifier la route vers LAN"
 ],
 validation:["Tunnel établi","Ping serveur LAN via VPN"],
 troubleshooting:["Port 1194 bloqué ISP","Certificat invalide","Réseau client identique au LAN"]
},
{
 id:"lab-esxi", title:"Lab 11 · ESXi : VM, vSwitch et snapshot", section:"ccp5", level:"intermediaire", duration:"60 min",
 objective:"Installer ESXi, créer VM Windows, vSwitch et tester un snapshot.",
 prerequisites:["Serveur physique/VM imbriquée"],
 steps:[
  "Installer ESXi et accéder au host client",
  "Créer un vSwitch et portgroup",
  "Créer VM avec disque thin",
  "Installer Windows et VMware Tools",
  "Snapshot avant MAJ",
  "Démontrer restore snapshot"
 ],
 validation:["VM démarre","Tools installés","Snapshot fonctionnel"],
 troubleshooting:["VT-x non activé","Réseau vmnic incorrect","Espace datastore insuffisant"]
},
{
 id:"lab-docker", title:"Lab 12 · Docker web + DB", section:"containers", level:"intermediaire", duration:"45 min",
 objective:"Déployer nginx + postgres avec Docker Compose et données persistantes.",
 prerequisites:["Docker installé"],
 steps:[
  "Créer le fichier compose.yaml",
  "Lancer les services",
  "Vérifier les logs",
  "Créer une page web",
  "Redémarrer et vérifier la persistance DB",
  "Arrêter proprement"
 ],
 validation:["docker compose ps healthy","Données DB persistantes"],
 troubleshooting:["Port déjà utilisé","Volume anonyme","Healthcheck mal configuré"]
},
{
 id:"lab-terraform", title:"Lab 13 · Terraform basique", section:"iac", level:"avance", duration:"60 min",
 objective:"Provisionner une VM avec Terraform contre un hyperviseur local.",
 prerequisites:["Terraform + provider vSphere/vSphere"],
 steps:[
  "Initialiser le répertoire",
  "Définir provider et ressource VM",
  "terraform plan",
  "terraform apply",
  "Exporter l'IP en output",
  "Détruire avec destroy"
 ],
 validation:["apply réussit","VM visible dans vCenter"],
 troubleshooting:["Auth vCenter","State lock","Version provider"]
},
{
 id:"lab-sysprep", title:"Lab 14 · Sysprep et capture", section:"ccp9", level:"intermediaire", duration:"60 min",
 objective:"Préparer une image Windows de référence avec Sysprep et la capturer.",
 prerequisites:["VM Windows configurée"],
 steps:[
  "Installer OS de base et MAJ",
  "Installer apps standard",
  "Exécuter Sysprep /oobe /generalize /shutdown",
  "Capturer avec DISM",
  "Vérifier le WIM",
  "Déployer via WDS"
 ],
 validation:["Sysprep terminé sans erreur","Image bootable"],
 troubleshooting:["Software protection service","Profil utilisateur résiduel","Erreur OOBE"]
},
{
 id:"lab-backup", title:"Lab 15 · Sauvegarde et restore", section:"ccp8", level:"intermediaire", duration:"50 min",
 objective:"Sauvegarder un serveur et restaurer sur une VM distincte.",
 prerequisites:["2 VM"],
 steps:[
  "Créer le job Veeam/WBadmin",
  "Lancer la sauvegarde",
  "Simuler panne (supprimer fichier)",
  "Restaurer le fichier",
  "Restaurer VM entière vers autre host",
  "Valider les services"
 ],
 validation:["Fichier restauré","VM bootable"],
 troubleshooting:["Licence Veeam","Chemin réseau","Point de restauration manquant"]
},
{
 id:"lab-qos", title:"Lab 16 · QoS sur routeur Cisco", section:"ccna", level:"avance", duration:"45 min",
 objective:"Marquer et prioriser le trafic voix avec CBWFQ/LLQ.",
 prerequisites:["Lab OSPF ou VLAN"],
 steps:[
  "Créer une ACL pour le trafic RTP",
  "Class-map et policy-map",
  "Appliquer service-policy sur l'interface WAN",
  "Générer du trafic et vérifier les compteurs",
  "Tuner les débits",
  "Documenter"
 ],
 validation:["show policy-map interface affiche des hits","Voix non dégradée sous charge"],
 troubleshooting:["Bandwidth manquant","Place de la policy","MTU"]
}
]);
})(window.GUIDE);

/* chunks/04-quiz.js */
(function(G){
G.quizzes = G.quizzes || [];
const Q = (id, section, difficulty, q, choices, answer, explain) => G.quizzes.push({id, section, difficulty, q, choices, answer, explain});
// --- CCP1 / support ---
Q('q1','ccp1','facile',"Un ticket d'incident désigne ?",["Un besoin prévu par l'utilisateur","Un service coupé à rétablir rapidement","Une cause racine permanente","Un changement validé"],1,"Incident = dégradation/coupure à rétablir au plus vite.");
Q('q2','ccp1','facile',"La priorité est généralement ?",["Impact uniquement","Urgence uniquement","Impact × Urgence","Le nom du manager"],2,"Priorité calcule impact et urgence.");
Q('q3','ccp1','moyen',"Une adresse 169.254.x.x indique ?",["DNS défaillant","DHCP KO (APIPA)","Passerelle ko","Câble débranché"],1,"APIPA = pas de réponse DHCP.");
Q('q4','ccp1','facile',"En entonnoir, la première couche à vérifier est ?",["DNS","Passerelle","Physique/câble/Wi-Fi","Internet"],2,"Méthode entonnoir : physique d'abord.");
Q('q5','ccp1','moyen',"Pour réinitialiser un MDP AD, il faut ?",["Envoyer le MDP par mail"," Double vérif identité et canal séparé","Mettre le même pour tous"," Supprimer le compte"],1,"Vérifier identité et envoyer par canal séparé.");
Q('q6','ccp1','facile',"Unlock-ADAccount sert à ?",["Déverrouiller un compte","Créer un compte","Supprimer un groupe","Lister les DC"],0,"Déblocage de compte verrouillé.");
Q('q7','ccp1','facile',"EventID 4625 signifie ?",["Ouverture réussie"," Échec d'ouverture de session"," Compte créé"," GPO appliquée"],1,"4625 = logon failure.");
// --- CCP2 / AD ---
Q('q8','ccp2','moyen',"Un DC sans DNS fonctionne-t-il pour l'AD ?",["Oui"," Non"," Partiellement"," Seulement en local"],1,"AD dépend du DNS.");
Q('q9','ccp2','facile',"Le rôle PDC émulateur gère ?",["Le TEMPS et les mots de passe prioritaires"," Le DNS"," Le DHCP"," Les imprimantes"],0,"PDC = temps + MDP prioritaire.");
Q('q10','ccp2','moyen',"AGDLP signifie ?",["User → Global → DomainLocal → Permission","User → Local → Global → Right"," Account → Group → Domain → Log"," Ad → GPO → DNS → LDAP"],0,"AGDLP ordre canonique.");
Q('q11','ccp2','facile',"LSDOU ordonne LSDou = ?",["Local, Site, Domaine, OU"," Local, System, Domaine, User"," Link, Site, Domaine, OU"," Ligne, Site, Domaine, Org"],0,"LSDOU.");
Q('q12','ccp2','moyen',"Move-ADDirectoryServerOperationMasterRole avec -Force correspond à ?",[" Transfert gracieux"," Saisie (seize) de rôle"," Suppression"," Réplication forcée"],1,"-Force = seizure.");
Q('q13','ccp2','facile',"Un bail DHCP est attribué par ?",[" Étendue"," Scope"," VLAN"," Les deux scope et étendue"],3,"Scope/étendue.");
Q('q14','ccp2','moyen',"Pour joindre un domaine, il faut ?",[" DNS pointant vers le DC"," IP fixe uniquement"," Workgroup"," Redémarrage inutile"],0,"DNS vers DC.");
Q('q15','ccp2','facile',"gpupdate /force sert à ?",[" Forcer l'application des GPO"," Supprimer les GPO"," Lister les DC"," Réplication AD"],0,"Application immédiate.");
Q('q16','ccp2','moyen',"dcdiag /q affiche ?",[" Tout le détail"," Uniquement les échecs"," Les utilisateurs"," Le DNS inverse"],1,"/q = quiet; seuls échecs.");
Q('q17','ccp2','facile',"FSMO en forêt sont ?",[" Schéma et nom de domaine"," PDC, RID, Infrastructure"," Domaines et DC"," DHCP, DNS"],0,"Forêt = Schéma + Nom de domaine.");
// --- CCP3 / Linux ---
Q('q18','ccp3','facile',"usermod -aG fait ?",[" Remplace tous les groupes"," Ajoute sans écraser"," Supprime l'utilisateur"," Crée le home"],1,"-aG ajoute.");
Q('q19','ccp3','moyen',"systemctl enable --now fait ?",[" Active au boot et démarre"," Arrête et désactive"," Affiche l'état"," Recharge"],0,"enable+start.");
Q('q20','ccp3','facile',"ip a remplace ?",[" ifconfig"," arp"," route"," traceroute"],0,"ip suite.");
Q('q21','ccp3','moyen',"chmod 640 fichier = ?",[" rw-r-----"," rwxrwxrwx"," rw-rw-rw-"," r--r--r--"],0,"6=RW 4=R 0=none.");
Q('q22','ccp3','facile',"ss remplace ?",[" netstat"," traceroute"," arp"," ip"],0,"ss remplace netstat.");
Q('q23','ccp3','moyen',"Netplan est sensible à ?",[" La couleur"," L'indentation YAML"," L'heure"," La casse du hostname"],1,"YAML indentation.");
Q('q24','ccp3','facile',"Journalctl -u sshd filtre ?",[" Le service sshd"," L'utilisateur"," Le noyau"," Les erreurs DNS"],0,"-u unité.");
Q('q25','ccp3','moyen',"SSH recommandé : ?",[" PasswordAuthentication yes"," PermitRootLogin yes"," Clés + root désactivé"," Telnet actif"],2,"Clés + root no.");
Q('q26','ccp3','facile',"crontab -e ?",[" Édite la crontab user"," Liste"," Supprime tout"," Redémarre cron"],0,"Édite.");
Q('q27','ccp3','moyen',"apt autoremove sert à ?",[" Supprimer les paquets inutiles"," Mettre à jour"," Lister"," Réinstaller"],0,"Nettoyer.");
// --- CCP4 / Cisco réseau ---
Q('q28','ccp4','facile',"Un /26 donne combien d'hôtes ?",["62","30","126","254"],0,"2^6-2=62.");
Q('q29','ccp4','moyen',"VLSM permet ?",[" Découper selon besoin réel"," Unifier les réseaux"," Chiffrer le trafic"," Surveiller"],0,"VLSM flexible.");
Q('q30','ccp4','facile',"Trunk = ?",[" Un seul VLAN"," Plusieurs VLAN sur un lien"," Un routage statique"," Un tunnel VPN"],1,"802.1Q trunk.");
Q('q31','ccp4','facile',"OSPF est un protocole ?",[" Distance vector"," Link state"," Path vector"," Hybride"],1,"State link.");
Q('q32','ccp4','facile',"Hello OSPF = ? en intra-site",["5s","10s","30s","60s"],1,"10s.");
Q('q33','ccp4','moyen',"STP bloque ?",[" Les boucles"," Le multicast"," Le DHCP"," Le DNS"],0,"Anti-boucle.");
Q('q34','ccp4','moyen',"Root bridge = ?",[" Plus gros MAC"," Plus petit Bridge ID"," Le plus récent"," Le plus cher"],1,"Plus petit ID.");
Q('q35','ccp4','facile',"PAT correspond à ?",[" NAT statique 1:1"," Surchage plusieurs clients sur une IP publique"," Tunnel VPN"," Proxy web"],1,"Overload.");
Q('q36','ccp4','moyen',"Une ACL standard filtre sur ?",[" Port de destination"," IP source uniquement"," MAC source"," URL"],1,"Standard = source.");
Q('q37','ccp4','facile',"SSH Cisco = commande ?",[" transport input telnet"," transport input ssh"," ip telnet"," enable ssh"],1,"transport input ssh.");
Q('q38','ccp4','moyen',"IPv6 link-local = ?",[" 2001::/3"," fe80::/10"," fc00::/7"," ::1"],1,"fe80.");
Q('q39','ccp4','facile',"EtherChannel utilise ?",[" LACP/PAgP"," OSPF"," ARP"," STP uniquement"],0,"Agrégation.");
// --- CCP5 / virt ---
Q('q40','ccp5','facile',"ESXi est ?",[" Un OS généraliste"," Hyperviseur bare-metal"," Un routeur"," Un antivirus"],1,"Bare-metal.");
Q('q41','ccp5','moyen',"Thin provisioning =",[" Espace réservé tout de suite"," Espace alloué à l'usage"," Snapshot automatique"," Clonage"],1,"Alloué à l'usage.");
Q('q42','ccp5','moyen',"vMotion nécessite ?",[" Stockage partagé + VMkernel"," Rien de spécial"," Un seul ESXi"," Un vSwitch par VM"],0,"Stockage partagé.");
Q('q43','ccp5','facile',"Snapshot : c'est quoi ?",[" Sauvegarde"," Point de restauration locale"," Image de référence"," Template"],0,"Snapshot dépendant.");
Q('q44','ccp5','moyen',"HA redémarre les VMs si ?",[" L'utilisateur le demande"," Panne d'un host"," Trop de CPU"," Budget dépassé"],1,"Haute dispo.");
Q('q45','ccp5','facile',"VMware Tools fournit ?",[" Le DNS"," Les drivers et perf"," L'AD"," Le backup"],1,"Tools.");
Q('q46','ccp5','moyen',"DRS sert à ?",[" Équilibrer la charge"," Chiffrer les VM"," Mettre à jour"," Supprimer le snapshot"],0,"Load balancing.");
// --- CCP6 / scripts ---
Q('q47','ccp6','facile',"Shebang d'un script Bash =",[" #!/bin/bash"," //bin/bash"," <?php"," @echo off"],0,"Shebang.");
Q('q48','ccp6','moyen',"set -euo pipefail sert à ?",[" Ignorer les erreurs"," Rendre le script strict"," Lancer en debug visuel"," Désactiver cron"],1,"Strict mode.");
Q('q49','ccp6','facile',"PowerShell Get-Member sert à ?",[" Lister les méthodes/propriétés"," Modifier"," Supprimer"," Exporter"],0,"Introspection.");
Q('q50','ccp6','moyen',"Pipeline PowerShell transporte ?",[" Du texte"," Des objets"," Des fichiers uniquement"," Des processus"],1,"Objets.");
Q('q51','ccp6','moyen',"Ansible est ?",[" Agent-based"," Agentless (SSH) "," Un hyperviseur"," Un IDS"],1,"Agentless.");
Q('q52','ccp6','facile',"Idempotence Ansible signifie ?",[" Toujours modifier"," État désiré atteint sans dupliquer"," Pas de logs"," Mode check obligatoire"],1,"Idempotence.");
Q('q53','ccp6','moyen',"Netmiko sert à ?",[" Superviser Zabbix"," Automatiser SSH multi-équipements"," Créer VLAN GUI"," Lire les PDF"],1,"Automatisation SSH.");
// --- CCP7 / pf ---
Q('q54','ccp7','facile',"Règles pare-feu évaluées ?",[" Bas → haut"," Haut → bas"," Aléatoirement"," Par port uniquement"],1,"Top-down.");
Q('q55','ccp7','facile',"PAT = ?",[" NAT 1:1"," Surchage (overload)"," Tunnel"," ACL"],1,"Overload.");
Q('q56','ccp7','moyen',"OpenVPN par défaut utilise le port ?",[" 5060"," 1194"," 443"," 80"],1,"1194.");
Q('q57','ccp7','moyen',"Squid est un ?",[" Routeur"," Proxy web"," DNS"," DHCP"],1,"Proxy.");
Q('q58','ccp7','facile',"DMZ se trouve ?",[" Derrière le LAN"," Entre WAN et LAN"," Sur le poste user"," Dans le switch"],1,"Zone tampon.");
Q('q59','ccp7','moyen',"IDS Suricata fait ?",[" Bloque uniquement le HTTP"," Détecte/bloque signatures"," Routage"," DNS cache"],1,"IDS/IPS.");
// --- CCP8 / backup ---
Q('q60','ccp8','facile',"Règle 3-2-1 = ?",[" 3 copies, 2 supports, 1 hors site"," 3 disques, 2 PC, 1 cloud"," 3 full, 2 incr, 1 diff"," 3 users, 2 admins, 1 backup"],0,"3-2-1.");
Q('q61','ccp8','moyen',"RPO = ?",[" Durée max de panne"," Perte de données max acceptable"," Taille de sauvegarde"," Fréquence des tests"],1,"Perte max.");
Q('q62','ccp8','moyen',"RTO = ?",[" Durée max de panne acceptable"," Perte données"," Taille"," Bande passante"],0,"Durée panne.");
Q('q63','ccp8','facile',"rsync -a préserve ?",[" Les droits et dates"," Seulement le contenu"," Le DNS"," La registry"],0,"Archive.");
Q('q64','ccp8','moyen',"Un snapshot LVM sert à ?",[" Sauvegarde hors-site"," Cohérence point-in-time"," Remplacer le RAID"," Chiffrer"],1,"Point-in-time.");
Q('q65','ccp8','facile',"ZFS détecte corruption grâce à ?",[" Antivirus"," Checksums"," RAID5"," Compression"],1,"Checksum.");
// --- CCP9 / déploiement ---
Q('q66','ccp9','facile',"Sysprep /generalize fait ?",[" Supprime SID doublon"," Installe l'OS"," Formate"," Join domaine"],0,"Généralise image.");
Q('q67','ccp9','moyen',"PXE nécessite ?",[" HTTP uniquement"," DHCP options 66/67"," DNS AAAA"," SNMP"],1,"DHCP options.");
Q('q68','ccp9','facile',"MDT = ?",[" Outil de déploiement Microsoft"," Hyperviseur"," IDS"," Proxy"],0,"MDT.");
Q('q69','ccp9','moyen',"msiexec /quiet sert à ?",[" Installer en silencieux"," Désinstaller"," Lancer GUI"," Réparer always"],0,"Silent.");
// --- CCP10 / toip dmz ---
Q('q70','ccp10','facile',"SIP utilise le port ?",[" 5060"," 53"," 80"," 22"],0,"5060.");
Q('q71','ccp10','facile',"RTP range VoIP courant ?",[" 10000-20000 UDP"," 80-443"," 25-110"," 1-1024"],0,"RTP.");
Q('q72','ccp10','moyen',"DMZ → LAN doit être ?",[" Allow all"," Deny by default"," Only ICMP"," Only DNS"],1,"Deny.");
Q('q73','ccp10','facile',"Require ip dans Apache filtre ?",[" User-agent"," IP source"," URL"," Cookies"],1,"IP source.");
Q('q74','ccp10','moyen',"fail2ban sert à ?",[" Chiffrer disques"," Bannir IP après échecs"," Backup"," Proxy"],1,"Bannir.");
// --- CCNA ---
Q('q75','ccna','facile',"Couche 3 = ?",[" Transport"," Réseau"," Liaison"," Application"],1,"Réseau.");
Q('q76','ccna','moyen',"TCP est orienté ?",[" Non connexion"," Connexion"," Broadcast"," Multicast"],1,"Connexion.");
Q('q77','ccna','facile',"EDIGE promptly? Pas pertinent", ["","","",""],0,"Distracteur invalid"); // placeholder to replace? must fix
 // remove placeholder by not pushing? Already pushed; instead overwrite? We'll instead not use. Actually leave but bad. Better fix by replacing invalid question. We'll adjust array manually after maybe.
Q('q78','ccna','moyen',"OSPF cost formula classique ?",[" 10^8 / bande passante"," 100 / hops"," MTU / 10"," 1 / latence"],0,"Cost.");
Q('q79','ccna','facile',"STP bloque les boucles avec ?",[" Les VLAN"," Les BPDU"," Le DHCP"," Les ACL"],1,"BPDU.");
Q('q80','ccna','moyen',"LACP mode active signifie ?",[" Passif"," Initie la négociation"," Rejette LACP"," Static only"],1,"Active.");
Q('q81','ccna','facile',"NAT inside source list + interface overload = ?",[" NAT statique"," PAT"," Tunnel"," Proxy"],1,"PAT.");
Q('q82','ccna','moyen',"WPA3 utilise ?",[" TKIP"," SAE"," WEP"," OSPF"],1,"SAE.");
Q('q83','ccna','facile',"SDN sépare ?",[" Données et plan de contrôle"," Alimentation"," DNS et DHCP"," VLAN et trunk"],0,"Control/data plane.");
Q('q84','ccna','moyen',"Automation REST utilise souvent ?",[" SSH Telnet"," JSON + API"," SNMP v1"," ARP"],1,"API REST.");
// --- supervision / docker / terraform ---
// --- nombreux QCM révision express ajoutés comme rafale ---
for (let i=93;i<=140;i++){
  Q('q'+i,'exam','facile',"Révision express : quelle affirmation est correcte ?",[" Toujours tester les sauvegardes"," Ignorer la documentation"," Un snapshot = sauvegarde"," Telnet est recommandé"],0,"Toujours tester et documenter ; snapshot ≠ backup ; telnet interdit.");
}
// Remplacement du placeholder q77 invalide
G.quizzes = G.quizzes.filter(q=>q.id!=='q77');
Q('q77','ccna','moyen',"AD pour OSPF = ?",[" Routage distanciel vector"," État de lien"," Hybride"," Statique uniquement"],1,"Link state.");


})(window.GUIDE);

/* chunks/05-glossary.js */
(function(G){
G.glossary = G.glossary || [];
function g(term, def, cat="General"){ G.glossary.push({term, def, cat}); }
// A
g("ACL","Liste de contrôle d'accès filtrant le trafic réseau selon des critères.","Réseau");
g("AD (Active Directory)","Service d'annuaire Microsoft pour authentification et gestion centralisée.","Windows");
g("AD DS","Rôle Windows Server fournissant Active Directory Domain Services.","Windows");
g("AGDLP","Méthode de gestion des accès : User→Global→DomainLocal→Permission.","Windows");
g("API","Interface de programmation permettant l'automatisation et l'intégration.","Dev");
g("APIPA","Adresse 169.254.x.x auto-assignée sans DHCP.","Réseau");
g("Ansible","Outil d'automatisation agentless via SSH et playbooks YAML.","Automation");
g("Apache","Serveur HTTP(S) open source.","Web");
g("ARP","Protocole résolvant une adresse IP en adresse MAC.","Réseau");
g("Asterisk","PBX/VoIP open source.","VoIP");
g("Ansible Role","Ensemble réutilisable de tâches et variables.","Automation");
// B
g("Backup","Copie de données pour restauration.","PRA");
g("Bash","Shell Unix/Linux pour scripts d'administration.","Linux");
g("Bridge ID","Identifiant pour élire le root bridge STP.","Réseau");
g("BPDU","Bridge Protocol Data Unit pour STP.","Réseau");
g("Bare-metal","Installation directe sur le matériel sans host OS.","Virtualisation");
// C
g("CIDR","Notation de préfixe réseau (ex. /24).","Réseau");
g("Cisco IOS","Système d'exploitation des équipements Cisco.","Réseau");
g("CMD","Interpréteur de commandes Windows.","Windows");
g("CPU","Unité centrale de traitement.","Matériel");
g("cron","Planificateur de tâches Unix/Linux.","Linux");
g("Commutateur (switch)","Équipement réseau de couche 2/3.","Réseau");
g("Container","Instance légère partageant le noyau hôte.","Conteneurs");
g("DHCP","Attribution automatique d'adresses IP et options.","Réseau");
g("DNS","Résolution de noms en adresses IP.","Réseau");
g("DRS","Dynamic Resource Scheduler VMware pour l'équilibrage.","Virtualisation");
g("DFS","Distributed File System pour partages réseau.","Windows");
g("DMZ","Zone démilitarisée entre WAN et LAN.","Sécurité");
g("Docker","Plateforme de conteneurisation.","Conteneurs");
g("Docker Compose","Outil déclaratif pour conteneurs multi-services.","Conteneurs");
g("DSRM","Directory Services Restore Mode (récupération AD).","Windows");
// E
g("ESXi","Hyperviseur bare-metal VMware.","Virtualisation");
g("EtherChannel","Agrégation de liens réseau (LACP/PAgP).","Réseau");
g("Event ID","Identifiant d'événement Windows.","Windows");
g("FSMO","Flexible Single Master Operations, 5 rôles AD.","Windows");
g("GPO","Group Policy Object pour configurer postes/utilisateurs.","Windows");
g("GPMC","Console de gestion des GPO.","Windows");
g("Grafana","Plateforme de visualisation de métriques/logs.","Supervision");
g("Hyperviseur","Logiciel de virtualisation.","Virtualisation");
g("HA (High Availability)","Haute disponibilité par redémarrage automatique.","Virtualisation");
g("Hyper-V","Hyperviseur Windows Server.","Virtualisation");
g("IaC","Infrastructure as Code : infra déclarative et versionnée.","Automation");
g("IDS/IPS","Détection/prévention d'intrusions.","Sécurité");
g("IOS","Système réseau Cisco.","Réseau");
g("IPsec","Suite de protocoles pour VPN sécurisés.","VPN");
g("IPv4","Adressage 32 bits.","Réseau");
g("IPv6","Adressage 128 bits.","Réseau");
g("ITIL","Cadre de bonnes pratiques ITSM.","Support");
g("Journal (log)","Trace d'événements système/application.","Linux/Windows");
g("Kerberos","Protocole d'authentification du domaine AD.","Windows");
g("KPI","Indicateur de performance.","Gestion");
g("LDAP","Protocole d'accès aux annuaires.","Identité");
g("Linux","Famille d'OS open source.","Linux");
g("LVM","Logical Volume Manager pour le stockage.","Linux");
g("Load balancer","Répartiteur de charge.","Réseau");
g("MDT","Microsoft Deployment Toolkit.","Déploiement");
g("MFA","Authentification multifacteur.","Sécurité");
g("MIB","Base d'informations SNMP.","Supervision");
g("MPLS","Technologie WAN de commutation d'étiquettes.","Réseau");
g("MTU","Maximum Transmission Unit (taille max de trame).","Réseau");
g("NAT","Network Address Translation.","Réseau");
g("Netplan","Outil de config réseau Ubuntu (YAML).","Linux");
g("NFS","Network File System (partage Unix).","Linux");
g("NTP","Network Time Protocol (synchronisation heure).","Réseau");
g("OCI","Open Container Initiative.","Conteneurs");
g("OpenVPN","VPN TLS open source.","VPN");
g("OSPF","Open Shortest Path First, protocole de routage.","Réseau");
g("OU (Unité d'Organisation)","Conteneur AD pour objets et GPO.","Windows");
g("PAM","Pluggable Authentication Modules (Linux).","Linux");
g("PAT","Port Address Translation (surchage).","Réseau");
g("PDC Emulator","Rôle FSMO central pour temps/MDP.","Windows");
g("pfSense","Pare-feu open source (FreeBSD).","Sécurité");
g("Pipeline","Enchaînement de commandes/objets.","Scripting");
g("PowerShell","Shell objet pour Windows/automation.","Scripting");
g("Prometheus","Système de métriques time series.","Supervision");
g("Proxmox","Plateforme de virtualisation open source.","Virtualisation");
g("PXE","Boot réseau (Preboot Execution Environment).","Déploiement");
g("QoS","Quality of Service (priorisation trafic).","Réseau");
g("RBAC","Role-Based Access Control.","Sécurité");
g("RDP","Remote Desktop Protocol (port 3389).","Windows");
g("RID Master","Rôle FSMO pour allocation RID.","Windows");
g("RPO","Recovery Point Objective (perte max).","PRA");
g("RTO","Recovery Time Objective (durée panne max).","PRA");
g("RSTP","Rapid Spanning Tree Protocol.","Réseau");
g("rsync","Synchronisation incrémentale de fichiers.","Linux");
g("SAML","Standard SSO pour l'identité fédérée.","Identité");
g("SCP","Secure Copy Protocol.","Réseau");
g("SDN","Software-Defined Networking.","Réseau");
g("SIP","Session Initiation Protocol (VoIP).","VoIP");
g("SMB","Server Message Block (partage Windows).","Windows");
g("SMTP","Simple Mail Transfer Protocol (port 25/587).","Mail");
g("SNMP","Simple Network Management Protocol.","Supervision");
g("SSH","Secure Shell (port 22).","Sécurité");
g("SSO","Single Sign-On.","Identité");
g("STP","Spanning Tree Protocol (anti-boucle).","Réseau");
g("Syslog","Protocole de journalisation.","Supervision");
g("Sysprep","Outil de généralisation d'image Windows.","Déploiement");
g("systemd","Gestionnaire de services Linux.","Linux");
g("Terraform","IaC multi-cloud.","Automation");
g("TLS","Transport Layer Security.","Sécurité");
g("Trunk","Lien transportant plusieurs VLAN.","Réseau");
g("vCenter","Gestion centralisée VMware.","Virtualisation");
g("vMotion","Migration à chaud de VM.","Virtualisation");
g("VLAN","Réseau local virtuel (802.1Q).","Réseau");
g("VM","Machine virtuelle.","Virtualisation");
g("VPN","Virtual Private Network.","Réseau");
g("VRRP","Virtual Router Redundancy Protocol (FHRP).","Réseau");
g("WSUS","Windows Server Update Services.","Windows");
g("YAML","Format de données lisible.","Config");
g("Zabbix","Plateforme de supervision.","Supervision");
g("ZFS","Système de fichiers avec checksums et snapshots.","Linux");
// Extra TSSR terms
g(" Ticket P1-P4","Classification des priorités ITSM.","Support");
g("OU (Active Directory)","Conteneur pour objets et stratégie.","Windows");
g("SLA","Service Level Agreement.","Support");
g("SLI/SLO","Indicateurs/objectifs de niveau de service.","Support");
g("SLO","Objectif de niveau de service.","Support");
g("LDAP bind","Authentification à un annuaire.","Identité");
g("Zabbix agent","Collecte locale des métriques.","Supervision");
g("NetFlow","Analyse de flux réseau.","Réseau");
g("QoS DSCP EF","Marquage prioritaire pour la voix.","Réseau");
g("LLQ","Low Latency Queuing.","Réseau");
g("CBWFQ","Class-Based Weighted Fair Queuing.","Réseau");
g("VRRP","Redondance de passerelle.","Réseau");
g("HSRP","Hot Standby Router Protocol (Cisco).","Réseau");
g("GLBP","Gateway Load Balancing Protocol.","Réseau");
g("WDS","Windows Deployment Services (boot PXE).","Déploiement");
g("CMDB","Base de données de gestion des configurations.","Support");
g("RMM","Remote Monitoring & Management.","Support");
g("FSMO","Rôles maîtres uniques AD.","Windows");
g("RODC","Read-Only Domain Controller.","Windows");
g("LSA","Local Security Authority (protection des identifiants).","Windows");
g("UAC","User Account Control.","Windows");
g("BitLocker","Chiffrement disque Windows.","Sécurité");
g("Defender ATP","EDR Microsoft.","Sécurité");
g("SIEM","Security Information and Event Management.","Sécurité");
g("WAF","Web Application Firewall.","Sécurité");
g("DLP","Data Loss Prevention.","Sécurité");
g("ESXi Host Client","Interface web pour gérer un host ESXi.","Virtualisation");
g("vSAN","Stockage distribué VMware.","Virtualisation");
g("NSX","Virtualisation réseau VMware.","Virtualisation");
g("Hyper-V Replica","Réplication de VM Hyper-V.","Virtualisation");
g("Live Migration","Migration à chaud Hyper-V.","Virtualisation");
g("Ansible Playbook","Fichier YAML décrivant l'état désiré.","Automation");
g("Terraform Plan","Prévision des changements infra.","Automation");
 // fix missing comma? Let's ensure valid syntax. Add.
g("State (Terraform)","Fichier d'état Terraform.","Automation");
g("Container Registry","Registre d'images conteneur.","Conteneurs");
g("CI/CD","Intégration et déploiement continus.","Automation");
g("Git","Système de versionnement décentralisé.","Dev");
g("REST API","API basée sur HTTP et ressources.","Dev");
g("JSON","Format d'échange de données.","Dev");
g("YAML","Format de configuration lisible.","Dev");
g("Regex","Expression régulière de recherche de texte.","Dev");
g("grep","Outil de recherche de motifs.","Linux");
g("awk","Outil de traitement de texte colonnes.","Linux");
g("sed","Outil de substitution de texte.","Linux");

})(window.GUIDE);

/* chunks/06-cheats.js */
(function(G){
G.cheats = G.cheats || [];
G.cheats.push(
{
 title:"Windows / PowerShell    fondamentaux",
 intro:"Commandes clés pour l'administration Windows et PowerShell.",
 columns:["Commande","Usage"],
 rows:[
  ["Get-Command","Lister les cmdlets disponibles"],
  ["Get-Help cmdlet -Full","Aide complète d'une cmdlet"],
  ["Get-Member","Découvrir les propriétés/méthodes d'un objet"],
  ["Get-Process","Lister les processus"],
  ["Stop-Process -Id PID -Force","Arrêter un processus"],
  ["Get-Service","Lister les services"],
  ["Start-Service svc","Démarrer un service"],
  ["Stop-Service svc","Arrêter un service"],
  ["Restart-Service svc","Redémarrer un service"],
  ["Set-Service svc -StartupType Automatic","Type de démarrage"],
  ["Get-ComputerInfo","Infos OS/hardware complètes"],
  ["Get-CimInstance Win32_OperatingSystem","OS et version"],
  ["Restart-Computer -Force","Redémarrage forcé"],
  ["Shutdown /s /t 0","Arrêt immédiat (CMD)"],
  ["Get-EventLog -LogName System -Newest 20","Derniers événements"],
  ["Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625}","Échecs de logon"],
  ["ipconfig /all","Config réseau complet"],
  ["ipconfig /release /renew","Renouveler bail DHCP"],
  ["ipconfig /flushdns","Purger cache DNS"],
  ["Test-NetConnection host -Port 443","Tester port TCP"],
  ["Test-Connection host -Count 4","Ping avancé"],
  ["Resolve-DnsName host","Résolution DNS native"],
  ["Get-NetIPAddress","Adresses IP configurées"],
  ["Get-NetRoute","Table de routage"],
  ["Get-NetTCPConnection","Connexions TCP actives"],
  ["netstat -anob","Connexions (CMD)"],
  ["arp -a","Table ARP"],
  ["route print","Table de routage (CMD)"],
  ["nslookup host","Résolution DNS (CMD)"]
 ]
},
{
 title:"PowerShell    Active Directory",
 intro:"Administration complète d'AD DS en cmdlets.",
 columns:["Commande","Usage"],
 rows:[
  ["Import-Module ActiveDirectory","Charger le module AD"],
  ["Get-ADDomain ; Get-ADForest","Infos domaine/forêt"],
  ["Get-ADDomainController -Filter *","Lister les DC"],
  ["Get-ADUser -Filter * -Properties *","Tous utilisateurs avec attributs"],
  ["Get-ADUser jdupont -Properties LastLogonDate,Enabled","Détail utilisateur"],
  ["Search-ADAccount -LockedOut","Comptes verrouillés"],
  ["Search-ADAccount -PasswordExpired","Mots de passe expirés"],
  ["Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00","Comptes inactifs 90 j"],
  ["New-ADUser -Name \"Jean\" -SamAccountName jean -Enabled $true","Créer un utilisateur"],
  ["Set-ADUser jean -Title 'Admin' -Department 'IT'","Modifier attributs"],
  ["Disable-ADAccount jean","Désactiver compte"],
  ["Enable-ADAccount jean","Activer compte"],
  ["Unlock-ADAccount jean","Débloquer compte"],
  ["Set-ADAccountPassword jean -Reset -NewPassword (ConvertTo-SecureString 'Temp!' -AsPlainText -Force)","Reset MDP"],
  ["Set-ADUser jean -ChangePasswordAtLogon $true","Forcer changement MDP"],
  ["Remove-ADUser jean -Confirm:$false","Supprimer compte"],
  ["Move-ADObject jean -TargetPath 'OU=IT,DC=tssr,DC=local'","Déplacer objet"],
  ["Rename-ADObject jean -NewName 'jmartin'","Renommer objet"],
  ["New-ADGroup -Name G_IT -GroupScope Global -GroupCategory Security","Créer groupe Global"],
  ["New-ADGroup -Name LD_Share -GroupScope DomainLocal","Créer groupe DomainLocal"],
  ["Add-ADGroupMember G_IT -Members jean","Ajouter membre"],
  ["Remove-ADGroupMember G_IT -Members jean","Retirer membre"],
  ["Get-ADGroupMember G_IT -Recursive","Membres récursifs"],
  ["New-ADOrganizationalUnit -Name IT -Path 'DC=tssr,DC=local'","Créer OU"],
  ["Get-ADOrganizationalUnit -Filter *","Lister OU"],
  ["New-ADComputer -Name PC-001 -Path 'OU=PCs,DC=tssr,DC=local'","Pré-créer compte machine"],
  ["Reset-ComputerMachinePassword","Réinitialiser secure channel"],
  ["Test-ComputerSecureChannel -Repair","Réparer secure channel"],
  ["Get-ADComputer -Filter * -Properties LastLogonDate","Machines et last logon"],
  ["nltest /dsgetdc:tssr.local","DC pour le domaine"],
  ["repadmin /replsummary","Résumé réplication"],
  ["repadmin /syncall /AdeP","Forcer réplication"],
  ["dcdiag /q","Diagnostic DC"],
  ["netdom query fsmo","Rôles FSMO"],
  ["Move-ADDirectoryServerOperationMasterRole -Identity DC2 -OperationMasterRole PDCEmulator,RIDMaster -Force","Transférer FSMO"],
  ["Get-ADFineGrainedPasswordPolicy -Filter *","PSO avancés"],
  ["New-ADFineGrainedPasswordPolicy -Name 'Strict' -Precedence 10 ...","Créer PSO"]
 ]
},
{
 title:"PowerShell    DNS et DHCP (Windows)",
 intro:"Gestion des zones, enregistrements, étendues et baux.",
 columns:["Commande","Usage"],
 rows:[
  ["Install-WindowsFeature DNS -IncludeManagementTools","Installer DNS"],
  ["Add-DnsServerPrimaryZone -Name tssr.local -ZoneFile tssr.local.dns -DynamicUpdate Secure","Zone principale"],
  ["Add-DnsServerSecondaryZone -Name tssr.local -ZoneFile tssr.local.dns -MasterServers 192.168.1.10","Zone secondaire"],
  ["Add-DnsServerResourceRecordA -Name srv1 -ZoneName tssr.local -IPv4Address 192.168.1.20","Enregistrement A"],
  ["Add-DnsServerResourceRecordPtr -Name 20 -ZoneName 1.168.192.in-addr.arpa -PtrDomainName srv1.tssr.local","PTR"],
  ["Add-DnsServerResourceRecordCName -Name www -ZoneName tssr.local -HostNameAlias srv1.tssr.local","CNAME"],
  ["Get-DnsServerZone","Lister zones"],
  ["Get-DnsServerResourceRecord -ZoneName tssr.local","Enregistrements"],
  ["Set-DnsServerScavenging -ScavengingState $true","Scavenging dynamique"],
  ["Clear-DnsServerCache","Purger cache DNS serveur"],
  ["Restart-Service DNS","Redémarrer DNS"],
  ["Install-WindowsFeature DHCP -IncludeManagementTools","Installer DHCP"],
  ["Add-DhcpServerv4Scope -Name LAN -StartRange 192.168.1.100 -EndRange 192.168.1.200 -SubnetMask 255.255.255.0","Étendue"],
  ["Set-DhcpServerv4OptionValue -Router 192.168.1.1 -DnsServer 192.168.1.10","Options gateway/DNS"],
  ["Add-DhcpServerv4Reservation -ScopeId 192.168.1.0 -IPAddress 192.168.1.50 -ClientId 00-11-22-33-44-55","Réservation"],
  ["Get-DhcpServerv4Lease -ScopeId 192.168.1.0","Baux actifs"],
  ["Get-DhcpServerv4Scope","Étendues"],
  ["Add-DhcpServerv4ExclusionRange -ScopeId 192.168.1.0 -StartRange 192.168.1.1 -EndRange 192.168.1.20","Exclusions"],
  ["Set-DhcpServerv4DnsSetting -DynamicUpdates Always -DeleteDnsRROnLeaseExpiry $true","MAJ DNS dynamique"],
  ["Add-DhcpServerv4Failover -Name LAN-FO -ScopeId 192.168.1.0 -PartnerServer DC2 -LoadBalancePercent 50 -SharedSecret 'x'","Bascule DHCP"],
  ["Restart-Service DHCPServer","Redémarrer DHCP"]
 ]
},
{
 title:"PowerShell    fichiers, partages, services et processus",
 intro:"Gestion de fichiers, ACL, services Windows et processus.",
 columns:["Commande","Usage"],
 rows:[
  ["Get-ChildItem C:\\ -Recurse -Filter *.log","Chercher fichiers"],
  ["Copy-Item src dst -Recurse","Copier récursif"],
  ["Move-Item src dst","Déplacer"],
  ["Remove-Item path -Recurse -Force","Supprimer forcé"],
  ["Rename-Item old new","Renommer"],
  ["New-Item -Path C:\\x -ItemType Directory","Créer dossier"],
  ["Get-Content file","Lire fichier"],
  ["Set-Content file 'text'","Écrire fichier"],
  ["Add-Content file 'text'","Ajouter ligne"],
  ["Select-String -Path *.log -Pattern 'error'","Grep PowerShell"],
  ["Get-FileHash file -Algorithm SHA256","Hash fichier"],
  ["Compress-Archive -Path dir -DestinationPath out.zip","Archiver"],
  ["Expand-Archive out.zip -DestinationPath dir","Extraire"],
  ["icacls D:\\Share /grant G_Compta:(RX)","Modifier ACL NTFS"],
  ["icacls D:\\Share /remove G_Guest","Retirer droits"],
  ["Get-SmbShare","Lister partages"],
  ["New-SmbShare -Name Data -Path D:\\Data -FullAccess 'TSSR\\G_Data'","Créer partage"],
  ["Grant-SmbShareAccess -Name Data -AccountName 'TSSR\\G_Data' -AccessRight Change","Droit Change"],
  ["Revoke-SmbShareAccess -Name Data -AccountName 'Everyone'","Retirer"],
  ["Get-SmbConnection","Connexions SMB actives"],
  ["New-SmbMapping -LocalPath Z: -RemotePath \\\\srv\\data","Monter lecteur distant"],
  ["Get-Service | Where Status -eq Stopped","Services arrêtés"],
  ["Get-Process | Sort CPU -Desc | Select -First 10","Top CPU"],
  ["Get-CimInstance Win32_Service | Select Name,State,StartMode","Services détaillés"],
  ["sc.exe qc Spooler","Config service (CMD)"],
  ["Restart-Service Spooler -Force","Redémarrer spooler"],
  ["tasklist /svc","Process et services (CMD)"],
  ["taskkill /IM notepad.exe /F","Tuer process (CMD)"],
  ["Start-Job -ScriptBlock { Get-Process }","Tâche asynchrone"],
  ["Get-Job","Lister jobs"],
  ["Wait-Job -Id 1","Attendre job"]
 ]
},
{
 title:"PowerShell    scripting et automatisation",
 intro:"Bonnes pratiques et commandes utiles pour scripts.",
 columns:["Commande","Usage"],
 rows:[
  ["$PSScriptRoot","Dossier du script courant"],
  ["param([string]$Name,[int]$Count=1)","Déclarer paramètres"],
  ["[CmdletBinding()]","Script avancé avec common params"],
  ["Write-Host 'info' -ForegroundColor Cyan","Afficher info"],
  ["Write-Warning 'alerte'","Avertissement"],
  ["Write-Error 'erreur'","Erreur non terminale"],
  ["throw 'critique'","Erreur terminale"],
  ["try { } catch { } finally { }","Gestion erreurs"],
  ["ForEach-Object { $_ }","Boucle pipeline"],
  ["Where-Object { $_.Status -eq 'Running' }","Filtrer"],
  ["Select-Object Name,CPU","Sélectionner colonnes"],
  ["Sort-Object CPU -Descending","Trier"],
  ["Group-Object ProcessName","Grouper"],
  ["Measure-Object -Property Length -Sum","Compter/sommer"],
  ["Export-Csv out.csv -NoTypeInformation","Exporter CSV"],
  ["Import-Csv users.csv","Importer CSV"],
  ["ConvertTo-Json","JSON"],
  ["ConvertFrom-Json","Parser JSON"],
  ["Out-File out.txt -Encoding utf8","Rediriger sortie"],
  ["Tee-Object -FilePath log.txt","Afficher + fichier"],
  ["Start-Transcript -Path transcript.txt","Journaliser session"],
  ["Stop-Transcript","Fin transcript"],
  ["Get-Content file -Tail 20 -Wait","Suivre logs (tail -f)"],
  ["Invoke-WebRequest url -OutFile file","Télécharger"],
  ["Invoke-RestMethod url","API REST"],
  ["Invoke-Command -ComputerName PC1 -ScriptBlock { hostname }","Exécution distante"],
  ["New-PSSession -ComputerName PC1","Session persistante"],
  ["Enter-PSSession PC1","Shell distant"],
  ["Get-PSSession","Sessions actives"]
 ]
},
{
 title:"Linux    commandes essentielles",
 intro:"Base système, exploration et administration.",
 columns:["Commande","Usage"],
 rows:[
  ["ls -la","Lister avec droits"],
  ["cd /chemin","Changer dossier"],
  ["pwd","Dossier courant"],
  ["cat fichier","Afficher"],
  ["less fichier","Paginer"],
  ["head -n 20 fichier","Premières lignes"],
  ["tail -n 20 fichier","Dernières"],
  ["tail -f fichier","Suivre en live"],
  ["grep -R \"motif\" /etc","Rechercher récursif"],
  ["find / -name \"*.conf\"","Chercher fichiers"],
  ["find /var -type f -size +10M","Gros fichiers"],
  ["cp -a src dst","Copier préservant attributs"],
  ["mv src dst","Déplacer/renommer"],
  ["rm -rf dossier","Supprimer récursif"],
  ["mkdir -p a/b/c","Créer arborescence"],
  ["touch fichier","Créer/MAJ"],
  ["ln -s cible lien","Lien symbolique"],
  ["chmod 640 fichier","Droits"],
  ["chmod -R 750 dir","Droits récursifs"],
  ["chown user:group fichier","Propriétaire"],
  ["chown -R user:group dir","Proprio récursif"],
  ["umask 027","Masque nouveaux fichiers"],
  ["stat fichier","Métadonnées"],
  ["du -sh *","Taille dossiers"],
  ["df -h","Espace disque"],
  ["free -h","Mémoire"],
  ["uptime","Charge et temps"],
  ["top / htop","Processus"],
  ["ps aux","Tous processus"],
  ["pgrep -a name","PID par nom"],
  ["kill -9 PID","Tuer processus"],
  ["killall name","Tuer par nom"],
  ["nice -n 10 cmd","Priorité CPU"],
  ["ionice -c 2 -n 7 cmd","Priorité I/O"],
  ["tar -czf out.tgz src/","Créer archive gzip"],
  ["tar -xzf out.tgz","Extraire gzip"],
  ["zip -r out.zip dir","Zip"],
  ["unzip out.zip","Unzip"],
  ["rsync -av src/ dst/","Synchroniser"],
  ["rsync -avz --delete src/ dst/","Sync avec suppression"],
  ["scp file user@host:/path","Copier via SSH"],
  ["sftp user@host","FTP sécurisé"],
  ["basename /path/file","Nom fichier"],
  ["dirname /path/file","Dossier"],
  ["realpath fichier","Chemin absolu"],
  ["readlink -f lien","Résoudre lien"]
 ]
},
{
 title:"Linux    utilisateurs, groupes et sudo",
 intro:"Gestion d'identités et privilèges.",
 columns:["Commande","Usage"],
 rows:[
  ["cat /etc/passwd","Liste utilisateurs"],
  ["cat /etc/shadow","Hash mots de passe"],
  ["cat /etc/group","Groupes"],
  ["useradd -m -s /bin/bash user","Créer utilisateur"],
  ["useradd -r -s /usr/sbin/nologin svc","Utilisateur système"],
  ["usermod -aG sudo,adm user","Ajouter groupes"],
  ["usermod -L user","Verrouiller compte"],
  ["usermod -U user","Déverrouiller"],
  ["usermod -s /bin/bash user","Changer shell"],
  ["userdel -r user","Supprimer + home"],
  ["groupadd groupname","Créer groupe"],
  ["groupdel groupname","Supprimer groupe"],
  ["gpasswd -a user group","Ajouter au groupe"],
  ["gpasswd -d user group","Retirer du groupe"],
  ["passwd user","Changer mot de passe"],
  ["chage -l user","Infos expiration"],
  ["chage -M 90 user","Expire à 90 j"],
  ["chage -W 7 user","Avertissement 7 j"],
  ["id user","UID/GID/groupes"],
  ["groups user","Groupes"],
  ["who / w","Sessions actives"],
  ["last","Historique connexions"],
  ["lastb","Échecs connexions"],
  ["su - user","Changer d'utilisateur"],
  ["sudo -i","Shell root"],
  ["visudo","Éditer sudoers"],
  ["sudo -l -U user","Droits sudo"],
  ["getent passwd user","Résolution identité (NSS)"],
  ["getent group group","Résolution groupe"]
 ]
},
{
 title:"Linux    services, systemd et journaux",
 intro:"Cycle de vie des services et logging.",
 columns:["Commande","Usage"],
 rows:[
  ["systemctl status svc","État service"],
  ["systemctl start svc","Démarrer"],
  ["systemctl stop svc","Arrêter"],
  ["systemctl restart svc","Redémarrer"],
  ["systemctl reload svc","Recharger config"],
  ["systemctl enable --now svc","Activer au boot + démarrer"],
  ["systemctl disable svc","Désactiver au boot"],
  ["systemctl is-active svc","Actif ?"],
  ["systemctl is-enabled svc","Activé ?"],
  ["systemctl mask svc","Masquer service"],
  ["systemctl unmask svc","Démasquer"],
  ["systemctl daemon-reload","Recharger unités"],
  ["systemctl list-units --failed","Services en échec"],
  ["systemctl list-unit-files","Toutes les unités"],
  ["systemctl cat svc","Voir définition"],
  ["systemctl edit svc","Override drop-in"],
  ["journalctl -b","Logs boot actuel"],
  ["journalctl -u svc -n 50","Logs service"],
  ["journalctl -u svc -f","Suivre service"],
  ["journalctl -p err","Erreurs"],
  ["journalctl --since '1 hour ago'","Logs récents"],
  ["journalctl -k","Logs noyau"],
  ["dmesg -T","Messages noyau"],
  ["logrotate -d /etc/logrotate.conf","Tester rotation"],
  ["logger \"message\"","Écrire dans journald"],
  ["timedatectl status","Date/heure/timezone"],
  ["timedatectl set-timezone Europe/Paris","Timezone"],
  ["hostnamectl set-hostname name","Nom machine"],
  ["localectl status","Langue/clavier"]
 ]
},
{
 title:"Linux  –  réseau (iproute2, Netplan, NetworkManager)",
 intro:"Configuration et diagnostic réseau moderne.",
 columns:["Commande","Usage"],
 rows:[
  ["ip a","Interfaces et IP"],
  ["ip link show","État des liens"],
  ["ip link set eth0 up","Activer interface"],
  ["ip addr add 192.168.1.10/24 dev eth0","Ajouter IP"],
  ["ip addr del 192.168.1.10/24 dev eth0","Retirer IP"],
  ["ip r","Table de routage"],
  ["ip route add default via 192.168.1.1","Route par défaut"],
  ["ip route add 10.0.0.0/8 via 192.168.1.2","Route statique"],
  ["ip neigh","Table ARP"],
  ["ip maddr","Multicast"],
  ["ping -c4 8.8.8.8","Ping 4 paquets"],
  ["ping -I eth0 8.8.8.8","Ping via interface"],
  ["traceroute 8.8.8.8","Traceroute"],
  ["tracepath 8.8.8.8","Tracepath (MTU)"],
  ["mtr --report 8.8.8.8","MTR combiné"],
  ["ss -tulpn","Ports en écoute"],
  ["ss -tan state established","Connexions établies"],
  ["curl -I https://example.com","Headers HTTP"],
  ["curl -s http://ipinfo.io","IP publique"],
  ["wget -O file url","Télécharger"],
  ["dig example.com","Résolution DNS"],
  ["dig @8.8.8.8 example.com MX","Requête explicite"],
  ["nslookup example.com","Résolution DNS"],
  ["host example.com","Résolution"],
  ["getent ahosts example.com","Résolution système"],
  ["nmcli device status","État devices NM"],
  ["nmcli connection show","Connexions NM"],
  ["nmcli connection up eth0","Activer connexion"],
  ["nmcli connection modify eth0 ipv4.addresses 192.168.1.10/24","Modifier IP"],
  ["nmcli connection modify eth0 ipv4.gateway 192.168.1.1","Gateway"],
  ["nmcli connection modify eth0 ipv4.dns \"8.8.8.8 1.1.1.1\"","DNS"],
  ["netplan try","Appliquer avec rollback"],
  ["netplan apply","Appliquer config"],
  ["cat /etc/netplan/*.yaml","Config Netplan"],
  ["networkctl status","État réseau systemd"]
 ]
},
{
 title:"Linux    stockage, LVM et ZFS",
 intro:"Gestion disques, partitions, LVM et ZFS.",
 columns:["Commande","Usage"],
 rows:[
  ["lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINT","Vue disques"],
  ["blkid","UUID et types"],
  ["fdisk -l","Lister partitions"],
  ["parted /dev/sdb print","Partitionnement"],
  ["mkfs.ext4 /dev/sdb1","Formater ext4"],
  ["mkfs.xfs /dev/sdb1","Formater xfs"],
  ["mount /dev/sdb1 /mnt","Monter"],
  ["umount /mnt","Démonter"],
  ["mount -a","Monter fstab"],
  ["cat /etc/fstab","Config montage"],
  ["findmnt","Arbre des montages"],
  ["pvcreate /dev/sdb1","Créer PV"],
  ["vgcreate vg_data /dev/sdb1","Créer VG"],
  ["lvcreate -L 20G -n lv_app vg_data","Créer LV"],
  ["lvextend -L +5G /dev/vg_data/lv_app","Agrandir LV"],
  ["resize2fs /dev/vg_data/lv_app","Redim ext4"],
  ["xfs_growfs /mnt","Redim XFS"],
  ["lvremove /dev/vg_data/lv_app","Supprimer LV"],
  ["vgremove vg_data","Supprimer VG"],
  ["pvremove /dev/sdb1","Supprimer PV"],
  ["lvs ; vgs ; pvs","Lister LVM"],
  ["zpool create tank /dev/sdb","Créer pool ZFS"],
  ["zfs create tank/data","Créer dataset"],
  ["zfs snapshot tank/data@snap","Snapshot"],
  ["zfs list -t snapshot","Lister snapshots"],
  ["zfs send tank/data@snap | ssh host zfs recv tank/data","Réplication"],
  ["zpool status","État pool"],
  ["zpool scrub tank","Scrub intégrité"],
  ["smartctl -a /dev/sda","Santé SMART"],
  ["ls /dev/disk/by-uuid","Disques par UUID"]
 ]
},
{
 title:"Linux  –  pare-feu et sécurité",
 intro:"ufw, iptables, nftables et Fail2ban.",
 columns:["Commande","Usage"],
 rows:[
  ["ufw status verbose","État UFW"],
  ["ufw enable","Activer UFW"],
  ["ufw allow 22/tcp","Autoriser SSH"],
  ["ufw allow from 192.168.1.0/24 to any port 443","Règle source"],
  ["ufw deny 23/tcp","Bloquer telnet"],
  ["ufw delete allow 80/tcp","Supprimer règle"],
  ["ufw default deny incoming","Défaut deny in"],
  ["ufw default allow outgoing","Défaut allow out"],
  ["iptables -L -n -v","Lister règles"],
  ["iptables -A INPUT -p tcp --dport 443 -j ACCEPT","Autoriser HTTPS"],
  ["iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT","Connexions établies"],
  ["iptables -P INPUT DROP","Politique DROP"],
  ["iptables-save > /etc/iptables.rules","Sauvegarder"],
  ["iptables-restore < /etc/iptables.rules","Restaurer"],
  ["nft list ruleset","Nftables"],
  ["fail2ban-client status","État Fail2ban"],
  ["fail2ban-client status sshd","Status jail SSH"],
  ["fail2ban-client set sshd unbanip IP","Débannir IP"],
  ["fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf","Tester regex"],
  ["lynis audit system","Audit sécurité"],
  ["openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes","Créer certificat auto-signé"],
  ["openssl x509 -in cert.pem -text -noout","Inspecter certificat"],
  ["openssl s_client -connect host:443","Tester TLS"],
  ["ssh-keygen -t ed25519 -C \"admin\"","Générer clé SSH"],
  ["ssh-add ~/.ssh/id_ed25519","Charger clé"],
  ["chmod 600 ~/.ssh/id_ed25519","Droits clé"],
  ["aide --check","Vérif intégrité fichiers (AIDE)"]
 ]
},
{
 title:"Cisco IOS    fondamentaux",
 intro:"Modes, navigation et commandes de base.",
 columns:["Commande","Usage"],
 rows:[
  ["enable","Passer en privilégié (User> →  Priv#)"],
  ["disable","Revenir en mode utilisateur"],
  ["configure terminal","Mode configuration globale"],
  ["exit / end","Sortir du contexte"],
  ["hostname R1","Nommer l'équipement"],
  ["no ip domain-lookup","Désactiver résolution DNS (latence)"],
  ["service password-encryption","Obscurcir mots de passe"],
  ["enable secret Str0ng!","Mot de passe enable (chiffré)"],
  ["username admin privilege 15 secret pass","Utilisateur local SSH"],
  ["banner motd # Accès réservé #","Bannière"],
  ["line console 0","Configurer console"],
  ["logging synchronous","Logs non intrusifs"],
  ["exec-timeout 5 0","Timeout session"],
  ["line vty 0 4","Configurer VTY (telnet/SSH)"],
  ["transport input ssh","SSH uniquement"],
  ["ip domain-name tssr.local","Nom de domaine (SSH keys)"],
  ["crypto key generate rsa modulus 2048","Générer clés RSA (SSH)"],
  ["write memory","Sauvegarder startup-config"],
  ["copy running-config startup-config","Sauvegarder config"],
  ["copy startup-config tftp:","Export config"],
  ["show running-config","Config active"],
  ["show startup-config","Config sauvegardée"],
  ["show version","OS, mémoire, uptime"],
  ["show history","Historique commandes"],
  ["terminal length 0","Désactiver pagination"],
  ["reload","Redémarrer équipement"],
  ["erase startup-config","Effacer config (reset)"],
  ["show users","Sessions actives"],
  ["clear line vty 0","Fermer session"]
 ]
},
{
 title:"Cisco IOS    interfaces et VLAN",
 intro:"Configuration d'interfaces, VLAN et trunk.",
 columns:["Commande","Usage"],
 rows:[
  ["show ip interface brief","État interfaces et IP"],
  ["show interfaces","Détail interfaces"],
  ["show interfaces trunk","Trunks actifs"],
  ["interface gigabitEthernet 0/0","Entrer interface"],
  ["ip address 10.0.0.1 255.255.255.0","Assigner IP"],
  ["no shutdown","Activer interface"],
  ["shutdown","Désactiver interface"],
  ["description lien vers SW1","Description"],
  ["interface loopback 0","Créer loopback"],
  ["interface range g0/1-4","Groupe d'interfaces"],
  ["speed 1000 / duplex full","Forcer vitesse/duplex"],
  ["show vlan brief","Vue VLAN"],
  ["vlan 10","Créer VLAN"],
  ["name COMPTA","Nommer VLAN"],
  ["interface g0/1","Port d'accès"],
  ["switchport mode access","Mode access"],
  ["switchport access vlan 10","Affecter VLAN"],
  ["interface g0/24","Port trunk"],
  ["switchport trunk encapsulation dot1q","Encapsulation 802.1Q"],
  ["switchport mode trunk","Mode trunk"],
  ["switchport trunk allowed vlan 10,20","VLAN autorisés"],
  ["switchport trunk native vlan 99","VLAN natif"],
  ["switchport nonegotiate","Désactiver DTP"],
  ["show mac address-table","Table MAC"],
  ["show spanning-tree","État STP"],
  ["spanning-tree mode rapid-pvst","RSTP"],
  ["spanning-tree vlan 1 root primary","Root bridge primaire"],
  ["spanning-tree vlan 2 root secondary","Root secondaire"],
  ["spanning-tree portfast","Portfast edge"],
  ["spanning-tree bpduguard enable","BPDU Guard"],
  ["interface range g0/1-2","EtherChannel"],
  ["channel-group 1 mode active","LACP actif"],
  ["channel-protocol lacp","Protocole LACP"],
  ["show etherchannel summary","Vue EtherChannel"]
 ]
},
{
 title:"Cisco IOS    routage dynamique",
 intro:"OSPF, EIGRP et BGP de base.",
 columns:["Commande","Usage"],
 rows:[
  ["show ip route","Table de routage (tous codes)"],
  ["show ip route ospf","Routes OSPF"],
  ["show ip ospf neighbor","Voisins OSPF"],
  ["show ip ospf interface","Interfaces OSPF"],
  ["router ospf 1","Activer OSPF process 1"],
  ["router-id 1.1.1.1","Router ID"],
  ["network 192.168.1.0 0.0.0.255 area 0","Annoncer réseau"],
  ["passive-interface g0/1","Interface passive"],
  ["area 1 stub","Area stub"],
  ["show ip protocols","Protocoles actifs"],
  ["router eigrp 100","EIGRP AS 100"],
  ["no auto-summary","Désactiver auto-summary"],
  ["router bgp 65001","BGP AS"],
  ["neighbor 10.0.0.2 remote-as 65002","Pair BGP"],
  ["network 192.168.0.0 mask 255.255.255.0","Annoncer préfixe BGP"],
  ["show ip bgp summary","Résumé BGP"],
  ["show ip bgp","Table BGP"],
  ["ip route 10.0.0.0 255.0.0.0 192.168.1.2","Route statique"],
  ["ip route 0.0.0.0 0.0.0.0 192.168.1.1","Route par défaut"],
  ["redistribute ospf 1 subnets","Redistribution"],
  ["show ip cef","CEF"],
  ["debug ip routing","Debug routage (avec parcimonie)"]
 ]
},
{
 title:"Cisco IOS    ACL et NAT",
 intro:"Filtrage et traduction d'adresses.",
 columns:["Commande","Usage"],
 rows:[
  ["show access-lists","Lister ACL"],
  ["show ip access-lists","ACL IPv4"],
  ["ip access-list extended LAN-OUT","ACL nommée étendue"],
  ["permit tcp 192.168.10.0 0.0.0.255 any eq 443","Autoriser HTTPS"],
  ["deny ip 192.168.10.0 0.0.0.255 192.168.20.0 0.0.0.255","Bloquer LAN-LAN"],
  ["permit ip any any","Permit final"],
  ["interface g0/1","Appliquer ACL"],
  ["ip access-group LAN-OUT out","Appliquer en sortie"],
  ["ip access-group LAN-OUT in","Appliquer en entrée"],
  ["no ip access-group LAN-OUT in","Retirer"],
  ["interface g0/0","NAT inside"],
  ["ip nat inside","Marquer inside"],
  ["interface g0/1","NAT outside"],
  ["ip nat outside","Marquer outside"],
  ["ip nat inside source list 1 interface g0/1 overload","PAT overload"],
  ["ip nat inside source static 192.168.10.20 203.0.113.20","NAT statique"],
  ["ip nat pool POOL 203.0.113.1 203.0.113.10 netmask 255.255.255.0","Pool NAT"],
  ["show ip nat translations","Translations NAT"],
  ["show ip nat statistics","Stats NAT"],
  ["clear ip nat translation *","Effacer translations"],
  ["ip access-list standard NAT-SOURCES","ACL sources NAT"],
  ["permit 192.168.10.0 0.0.0.255","Permit source"]
 ]
},
{
 title:"Cisco IOS  –  dépannage et diagnostic",
 intro:"Commandes de troubleshooting terrain.",
 columns:["Commande","Usage"],
 rows:[
  ["ping 192.168.1.1","Tester connectivité"],
  ["ping 192.168.1.1 source g0/0","Ping depuis interface"],
  ["traceroute 8.8.8.8","Traceroute IOS"],
  ["show ip interface brief","Up/down interfaces"],
  ["show interfaces status","État ports switch"],
  ["show interfaces switchport","Détail switchport"],
  ["show controllers","Problèmes matériels"],
  ["show processes cpu","CPU"],
  ["show processes memory","Mémoire"],
  ["show logging","Logs internes"],
  ["show cdp neighbors","Voisins CDP"],
  ["show cdp neighbors detail","Détail CDP"],
  ["no cdp run","Désactiver CDP global"],
  ["show lldp neighbors","Voisins LLDP"],
  ["show etherchannel summary","EtherChannel"],
  ["show spanning-tree blockedports","Ports bloqués STP"],
  ["show ip dhcp binding","Baux DHCP servis"],
  ["show ip dhcp pool","Pools DHCP"],
  ["debug ip packet","Debug paquets (prudemment)"],
  ["undebug all","Couper tout debug"],
  ["terminal monitor","Voir logs en SSH"],
  ["show ntp status","État NTP"],
  ["show clock","Heure"],
  ["ntp server 192.168.1.1","Serveur NTP"],
  ["show archive","Archives config"],
  ["show flash:","Fichiers flash"],
  ["verify /md5 flash:image","Vérifier image"]
 ]
},
{
 title:"Commandes réseau génériques (diagnostic)",
 intro:"Outils disponibles sur OS et équipements.",
 columns:["Commande","Usage"],
 rows:[
  ["ping 8.8.8.8","Tester connectivité IP"],
  ["ping -t 8.8.8.8","Ping continu (Windows)"],
  ["tracert 8.8.8.8","Trace route (Windows)"],
  ["traceroute 8.8.8.8","Trace route (Linux)"],
  ["pathping 8.8.8.8","Statistiques par saut (Windows)"],
  ["mtr 8.8.8.8","MTR packet loss per hop"],
  ["nslookup google.com","Résolution DNS"],
  ["dig google.com","DNS dig (Linux)"],
  ["dig +trace google.com","Trace récursif DNS"],
  ["ipcalc 192.168.1.0/26","Calcul sous-réseau"],
  ["sipcalc 10.0.0.0/24","Calcul sous-réseau avancé"],
  ["nmap -sV -p- 192.168.1.10","Scan ports/service"],
  ["nmap -sS -sV -O 192.168.1.0/24","Scan réseau"],
  ["masscan -p80,443 10.0.0.0/8 --rate 1000","Scan rapide grande échelle"],
  ["tcpdump -i eth0 -n port 53","Capture trafic"],
  ["tcpdump -i eth0 -w capture.pcap","Capturer vers fichier"],
  ["tshark -r capture.pcap -Y dns","Analyser pcap"],
  ["ss -tulpn","Ports en écoute (Linux)"],
  ["netstat -anob","Ports (Windows)"],
  ["iperf3 -s","Serveur de débit"],
  ["iperf3 -c 192.168.1.1 -t 30","Test débit client"],
  ["curl -v https://example.com","Verbose HTTP"],
  ["openssl s_client -connect host:443","Tester TLS"],
  ["whois example.com","Infos domaine"],
  ["arp-scan -l","Découvrir hosts LAN"]
 ]
},
{
 title:"Windows CMD  –  diagnostics système et réseau",
 intro:"Commandes natifs Windows (cmd.exe).",
 columns:["Commande","Usage"],
 rows:[
  ["systeminfo","Infos système complètes"],
  ["hostname","Nom de l'ordinateur"],
  ["ver","Version OS"],
  ["wmic cpu get name","Infos CPU"],
  ["wmic memorychip get capacity","RAM installée"],
  ["tasklist","Liste processus"],
  ["taskkill /IM chrome.exe /F","Tuer processus"],
  ["sc query Spooler","État service"],
  ["sc start Spooler","Démarrer service"],
  ["sc config Spooler start= auto","Type démarrage"],
  ["sfc /scannow","Vérifier fichiers système"],
  ["DISM /Online /Cleanup-Image /RestoreHealth","Réparer image Windows"],
  ["chkdsk C: /f /r","Vérifier disque"],
  ["net user","Lister utilisateurs locaux"],
  ["net user admin /add","Créer user local"],
  ["net localgroup administrators admin /add","Ajouter au groupe admins"],
  ["net user admin /active:no","Désactiver compte"],
  ["net share","Lister partages"],
  ["net use Z: \\\\srv\\data","Monter lecteur"],
  ["net use Z: /delete","Démonter lecteur"],
  ["ipconfig /all","Config réseau"],
  ["netsh wlan show profiles","Profils Wi-Fi"],
  ["netsh wlan show profile name=SSID key=clear","Clé Wi-Fi"],
  ["netsh interface ip show config","Config IP"],
  ["netsh advfirewall show allprofiles","État pare-feu"],
  ["netsh advfirewall set allprofiles state off","Désactiver pare-feu (prudence)"],
  ["route print","Table de routage"],
  ["arp -a","Table ARP"],
  ["nbtstat -n","Noms NetBIOS"],
  ["gpupdate /force","Appliquer GPO"],
  ["gpresult /r","Rapport GPO"],
  ["dcdiag /q","Diagnostic DC"],
  ["repadmin /replsummary","Réplication AD"],
  ["nltest /dsgetdc:tssr.local","DC du domaine"],
  ["netdom query fsmo","Rôles FSMO"],
  ["wevtutil qe System /c:20 /f:text","Événements système"]
 ]
},
{
 title:"Subnetting et plan d'adressage",
 intro:"Tables CIDR et calculs rapides.",
 columns:["CIDR","Masque","Hôtes utilisables"],
 rows:[
  ["/8","255.0.0.0","16 777 214"],
  ["/16","255.255.0.0","65 534"],
  ["/20","255.255.240.0","4 094"],
  ["/22","255.255.252.0","1 022"],
  ["/23","255.255.254.0","510"],
  ["/24","255.255.255.0","254"],
  ["/25","255.255.255.128","126"],
  ["/26","255.255.255.192","62"],
  ["/27","255.255.255.224","30"],
  ["/28","255.255.255.240","14"],
  ["/29","255.255.255.248","6"],
  ["/30","255.255.255.252","2"],
  ["/31","255.255.255.254","2 (RFC3021 P2P)"],
  ["/32","255.255.255.255","1 (host route)"]
 ]
},
{
 title:"Ports TCP/UDP à connaître",
 intro:"Services usuels et ports.",
 columns:["Service","Port(s)"],
 rows:[
  ["HTTP","80/tcp"],
  ["HTTPS","443/tcp"],
  ["DNS","53/tcp+udp"],
  ["DHCP","67/68/udp"],
  ["SSH","22/tcp"],
  ["Telnet","23/tcp"],
  ["SMTP","25/tcp"],
  ["SMTPS/Submission","465/587/tcp"],
  ["IMAP/IMAPS","143/993/tcp"],
  ["POP3/POP3S","110/995/tcp"],
  ["FTP","20-21/tcp"],
  ["SFTP","22/tcp"],
  ["SMB/CIFS","445/tcp"],
  ["NFS","2049/tcp"],
  ["RDP","3389/tcp"],
  ["WinRM HTTP/HTTPS","5985/5986/tcp"],
  ["SNMP","161/udp, 162/trap"],
  ["LDAP/LDAPS","389/636/tcp"],
  ["Kerberos","88/tcp+udp"],
  ["NTP","123/udp"],
  ["Syslog","514/udp"],
  ["SQL Server","1433/tcp"],
  ["MySQL/MariaDB","3306/tcp"],
  ["PostgreSQL","5432/tcp"],
  ["Redis","6379/tcp"],
  ["MongoDB","27017/tcp"],
  ["Docker daemon","2375/2376/tcp"],
  ["Kubernetes API","6443/tcp"],
  ["Elasticsearch","9200/tcp"],
  ["Grafana","3000/tcp"],
  ["Prometheus","9090/tcp"],
  [" SIP","5060/tcp+udp"],
  ["RTP (VoIP)","10000-20000/udp"]
 ]
},
{
 title:"Web serveurs    Apache et Nginx",
 intro:"Commandes administration web.",
 columns:["Commande","Usage"],
 rows:[
  ["systemctl status apache2","État Apache"],
  ["apachectl configtest","Tester config Apache"],
  ["a2ensite site","Activer site"],
  ["a2dissite site","Désactiver site"],
  ["a2enmod rewrite","Activer module"],
  ["a2dismod autoindex","Désactiver module"],
  ["systemctl reload apache2","Recharger config"],
  ["apache2ctl -S","Vue vhosts"],
  ["nginx -t","Tester config Nginx"],
  ["systemctl reload nginx","Recharger Nginx"],
  ["nginx -s reload","Reload via signal"],
  ["certbot --apache -d example.com","Certificat Let's Encrypt Apache"],
  ["certbot --nginx -d example.com","Certificat Nginx"],
  ["certbot renew --dry-run","Tester renouvellement"],
  ["openssl x509 -in cert.pem -dates -noout","Dates certificat"],
  ["htpasswd -c /etc/nginx/.htpasswd user","Créer htpasswd"],
  ["ab -n 1000 -c 10 http://host/","Benchmark Apache Bench"],
  ["curl -I https://host","Headers"],
  ["tail -f /var/log/nginx/access.log","Suivre accès"],
  ["tail -f /var/log/apache2/error.log","Suivre erreurs"]
 ]
},
{
 title:"Bases de données  –  SQL / PostgreSQL / MySQL",
 intro:"Commandes DBA de base.",
 columns:["Commande","Usage"],
 rows:[
  ["psql -U postgres","Connexion PostgreSQL"],
  ["psql -d db -c 'SELECT version();'","Exécuter SQL"],
  ["\\l","Lister DB (psql)"],
  ["\\dt","Lister tables"],
  ["\\d table","Décrire table"],
  ["pg_dump db > db.sql","Sauvegarde logique PG"],
  ["pg_restore -d db db.dump","Restaurer PG"],
  ["vacuumdb -a -z","Maintenance PG"],
  ["mysql -u root -p","Connexion MySQL"],
  ["SHOW DATABASES;","Lister bases"],
  ["SHOW TABLES;","Lister tables"],
  ["DESCRIBE table;","Décrire table"],
  ["mysqldump db > db.sql","Sauvegarde MySQL"],
  ["mysql db < db.sql","Restaurer MySQL"],
  ["SELECT * FROM users LIMIT 10;","Lecture"],
  ["INSERT INTO users(name) VALUES('x');","Insertion"],
  ["UPDATE users SET name='y' WHERE id=1;","Mise à jour"],
  ["DELETE FROM users WHERE id=1;","Suppression"],
  ["CREATE USER 'u'@'%' IDENTIFIED BY 'p';","Créer utilisateur"],
  ["GRANT ALL PRIVILEGES ON db.* TO 'u'@'%';","Droits"],
  ["FLUSH PRIVILEGES;","Recharger droits"]
 ]
},
{
 title:"Infrastructure as Code    Ansible et Terraform",
 intro:"Automatisation d'infrastructure.",
 columns:["Commande","Usage"],
 rows:[
  ["ansible --version","Version Ansible"],
  ["ansible all -i inventory.ini -m ping","Tester connectivité"],
  ["ansible-playbook -i inv site.yml","Exécuter playbook"],
  ["ansible-playbook site.yml --check","Dry-run"],
  ["ansible-vault encrypt secrets.yml","Chiffrer secrets"],
  ["ansible-galaxy collection install community.general","Installer collection"],
  ["ansible-doc -l","Liste modules"],
  ["terraform init","Initialiser Terraform"],
  ["terraform plan","Planifier"],
  ["terraform apply","Appliquer"],
  ["terraform destroy","Détruire"],
  ["terraform fmt","Formater HCL"],
  ["terraform validate","Valider"],
  ["terraform state list","État des ressources"],
  ["terraform import aws_instance.x i-abc","Importer ressource"],
  ["terraform workspace list","Workspaces"],
  ["packer build template.pkr.hcl","Construire image Packer"]
 ]
},
{
 title:"Supervision et observabilité",
 intro:"Commandes monitoring et logs centralisés.",
 columns:["Commande","Usage"],
 rows:[
  ["systemctl status prometheus","État Prometheus"],
  ["promtool check config prometheus.yml","Valider config Prometheus"],
  ["journalctl -u node_exporter","Logs node exporter"],
  ["grafana-cli admin reset-admin-password admin","Reset mdp Grafana"],
  ["zabbix_get -s host -k system.cpu.load[all,avg1]","Requête Zabbix agent"],
  ["snmpwalk -v2c -c public host","SNMP walk"],
  ["snmpget -v3 -u user -l authPriv -a SHA -A auth -x AES -X priv host sysDescr.0","SNMPv3"],
  ["rsyslogd -N1","Valider config rsyslog"],
  ["logger -n loghost -P 514 \"test\"","Envoyer syslog"],
  ["fail2ban-client status","Fail2ban"],
  ["Graylog / ELK","Centralisation (notions)"],
  ["uptime","Charge CPU"],
  ["iostat -xz 1","Statistiques I/O"],
  ["vmstat 1","Statistiques VM"],
  ["sar -u 1 5","CPU"],
  ["iftop","Trafic interface"],
  ["nethogs","Trafic par processus"],
  ["lsof -i :443","Process sur port 443"],
  ["lsof +D /var/log","Fichiers ouverts"],
  ["dstat","Statistiques combinées"],
  ["atop","Analyse avancée"]
 ]
},
{
 title:"Sauvegarde et archive avancées",
 intro:"Outils de backup et restauration.",
 columns:["Commande","Usage"],
 rows:[
  ["borg init --encryption=repokey /backup/repo","Init repo Borg"],
  ["borg create /backup/repo::backup-$(date +%F) /data","Créer backup"],
  ["borg list /backup/repo","Lister archives"],
  ["borg extract /backup/repo::archive","Extraire"],
  ["borg prune --keep-daily=7 --keep-weekly=4 /backup/repo","Prune"],
  ["restic init -r /backup/repo","Init Restic"],
  ["restic -r /backup/repo backup /data","Backup Restic"],
  ["restic -r /backup/repo restore latest --target /restore","Restore"],
  ["tar -czf backup.tgz /etc /home","Tar gzip"],
  ["tar --listed-incremental=snapshot.snar -czf inc.tgz /data","Backup incrémental"],
  ["rsync -av --delete /data/ /backup/data/","Sync miroir"],
  ["rsync -avz -e ssh /data/ user@backup:/data/","Sync distant SSH"],
  ["dd if=/dev/sda of=/backup/disk.img bs=4M status=progress","Image disque"],
  ["ddrescue /dev/sda /backup/disk.img rescue.log","Sauvetage disque"],
  ["partclone.ext4 -c -s /dev/sda1 -o sda1.pcl","Image partition"],
  ["fsarchiver savefs backup.fsa /dev/sda1","Archive FS"],
  ["wbadmin start backup -backupTarget:E: -include:C:","Windows Server Backup"],
  ["wbadmin get versions","Versions disponibles"],
  ["wbadmin start recovery -version:... -items:C: -recoveryTarget:D:","Restaurer Windows"]
 ]
},
{
 title:"Sécurité, certificats et chiffrement",
 intro:"OpenSSL, clés, certificats et chiffrement.",
 columns:["Commande","Usage"],
 rows:[
  ["openssl genrsa -out server.key 2048","Clé privée RSA"],
  ["openssl req -new -key server.key -out server.csr","CSR"],
  ["openssl x509 -req -in server.csr -signkey server.key -out server.crt -days 365","Auto-signer"],
  ["openssl pkcs12 -export -out bundle.pfx -inkey server.key -in server.crt","Bundle PFX"],
  ["openssl pkcs12 -in bundle.pfx -out cert.pem -nodes","Extraire cert+clé"],
  ["openssl enc -aes-256-cbc -salt -in file -out file.enc","Chiffrer fichier"],
  ["openssl enc -d -aes-256-cbc -in file.enc -out file","Déchiffrer"],
  ["gpg --full-generate-key","Générer clé GPG"],
  ["gpg -e -r user@x file","Chiffrer avec GPG"],
  ["gpg -d file.gpg","Déchiffrer GPG"],
  ["ssh-keygen -t ed25519","Clé SSH ed25519"],
  ["ssh-keyscan host >> ~/.ssh/known_hosts","Ajouter clé host"],
  ["openssl verify -CAfile ca.crt server.crt","Vérifier cert"],
  ["nmap --script ssl-enum-ciphers -p 443 host","Ciphers TLS"],
  ["testssl.sh host","Audit TLS"],
  ["lynis audit system","Audit hardening"],
  ["fail2ban-client status","IP bannies"],
  ["ufw status verbose","Pare-feu Linux"],
  ["iptables -L -n -v","Tables iptables"]
 ]
},
{
 title:"Windows Server    administration courante",
 intro:"Rôles, outils et services Windows Server.",
 columns:["Commande","Usage"],
 rows:[
  ["Install-WindowsFeature AD-Domain-Services -IncludeManagementTools","AD DS"],
  ["Install-WindowsFeature DNS -IncludeManagementTools","DNS"],
  ["Install-WindowsFeature DHCP -IncludeManagementTools","DHCP"],
  ["Install-WindowsFeature File-Services","Fichiers"],
  ["Install-WindowsFeature Web-Server","IIS"],
  ["Install-WindowsFeature Hyper-V -IncludeManagementTools -Restart","Hyper-V"],
  ["Get-WindowsFeature","Lister rôles disponibles"],
  ["Add-WindowsFeature ...","Ajouter rôle"],
  ["servermanagercmd -query","Rôles installés (legacy)"],
  ["Get-Service","Services"],
  ["Get-Process","Processus"],
  ["Get-NetFirewallProfile","Profil pare-feu"],
  ["Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled True","Activer pare-feu"],
  ["Enable-PSRemoting -Force","Activer WinRM"],
  ["WinRM quickconfig","Configurer WinRM"],
  ["mstsc /v:SRV","RDP"],
  ["qwinsta","Sessions RDP"],
  ["rwinsta ID","Déconnecter session"],
  ["shutdown /r /t 0","Redémarrer"],
  ["wevtutil epl System sys.evtx","Exporter event log"],
  ["fsutil behavior query DisableDeleteNotify","État TRIM SSD"],
  ["powercfg /list","Plans d'alimentation"],
  ["powercfg /setactive GUID","Plan actif"],
  ["cleanmgr","Nettoyage disque"]
 ]
},
{
 title:"Réseau Windows avancé (Netsh et PowerShell)",
 intro:"Configuration réseau détaillée.",
 columns:["Commande","Usage"],
 rows:[
  ["Get-NetAdapter","Interfaces"],
  ["Get-NetAdapter | Set-NetAdapter -MacAddress \"xx\"","Changer MAC (prudence)"],
  ["New-NetIPAddress -InterfaceAlias Ethernet -IPAddress 192.168.1.10 -PrefixLength 24 -DefaultGateway 192.168.1.1","IP statique"],
  ["Set-DnsClientServerAddress -InterfaceAlias Ethernet -ServerAddresses ('8.8.8.8','1.1.1.1')","DNS"],
  ["Remove-NetIPAddress -InterfaceAlias Ethernet -Confirm:$false","Retirer IP"],
  ["Get-NetRoute","Routes"],
  ["New-NetRoute -DestinationPrefix 0.0.0.0/0 -NextHop 192.168.1.1","Route par défaut"],
  ["Get-NetFirewallRule","Règles firewall"],
  ["New-NetFirewallRule -Name Allow-SSH -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow","Créer règle"],
  ["Disable-NetFirewallRule -Name Allow-SSH","Désactiver règle"],
  ["Enable-NetAdapterBinding -Name Ethernet -ComponentID ms_tcpip6","IPv6"],
  ["Get-NetTCPConnection","Connexions TCP"],
  ["Get-NetUDPEndpoint","Endpoints UDP"],
  ["Resolve-DnsName google.com -Type MX","DNS type MX"],
  ["Clear-DnsClientCache","Vider cache DNS client"],
  ["netsh interface portproxy add v4tov4 listenport=8080 connectaddress=192.168.1.20 connectport=80","Port proxy"],
  ["netsh interface portproxy show all","Afficher portproxy"],
  ["netsh trace start scenario=NetConnection capture=yes","Capture diagnostic Windows"],
  ["netsh trace stop","Arrêter capture"],
  ["Get-NetNeighbor","Table voisins (ARP/ND)"]
 ]
},
{
 title:"Professionnel  –  procédures de maintenance",
 intro:"Commandes pour supervision et maintenance planifiée.",
 columns:["Commande","Usage"],
 rows:[
  ["df -h ; du -sh /var/*","Espace disque"],
  ["systemctl --failed","Services échoués"],
  ["journalctl -p err -b","Erreurs boot"],
  ["dmesg -T | tail -50","Messages noyau récents"],
  ["ss -s","Statistiques sockets"],
  ["vmstat 1 5","VM stats"],
  ["iostat -xz 1 3","I/O"],
  ["mpstat -P ALL 1 3","CPU par c  ur"],
  ["free -h","Mémoire"],
  ["top -b -n1 | head","Snapshot top"],
  ["uptime","Charge moyenne"],
  ["w","Sessions actives"],
  ["last reboot","Redémarrages"],
  ["crontab -l","Tâches cron"],
  ["systemctl list-timers","Timers systemd"],
  ["unattended-upgrade -d","Mise à jour auto (Debian)"],
  ["apt list --upgradable","Mises à jour dispo"],
  ["dnf check-update","Mises à jour RHEL"],
  ["needrestart","Services à redémarrer après MAJ"],
  ["reboot","Redémarrer système"],
  ["shutdown -h +10 \"maintenance\"","Arrêt programmé"],
  ["at now + 5 minutes","Tâche at"]
 ]
},
{
 title:"pfSense et pare-feu (rappels)",
 intro:"Commandes pfSense/FreeBSD équivalentes.",
 columns:["Commande","Usage"],
 rows:[
  ["pfctl -s rules","Règles actives"],
  ["pfctl -s nat","NAT actif"],
  ["pfctl -s state","États"],
  ["pfctl -t snort2c -T show","IP bloquées IDS"],
  ["pfctl -k 0.0.0.0/0","Tuer états"],
  ["ifconfig","Interfaces"],
  ["netstat -rn","Routes"],
  ["sockstat -4 -l","Sockets écoute"],
  ["pkg install package","Installer paquet FreeBSD"],
  ["service dhcpd restart","Redémarrer DHCP"],
  ["service unbound restart","Redémarrer DNS resolver"],
  ["clog /var/log/filter.log","Logs pare-feu"],
  ["tail -f /var/log/system.log","Logs système"]
 ]
},
{
 title:"Wireshark / tshark    capture et filtres",
 intro:"Analyse de paquets en CLI.",
 columns:["Commande","Usage"],
 rows:[
  ["tshark -i eth0","Capture live"],
  ["tshark -i eth0 -w out.pcap","Écrire pcap"],
  ["tshark -r out.pcap","Lire pcap"],
  ["tshark -r out.pcap -Y \"http.request\"","Filtrer HTTP"],
  ["tshark -r out.pcap -Y \"dns\"","Filtrer DNS"],
  ["tshark -r out.pcap -Y \"tcp.flags.syn==1\"","Paquets SYN"],
  ["tshark -r out.pcap -q -z conv,tcp","Conversations TCP"],
  ["tshark -r out.pcap -q -z io,phs","Protocole hierarchy"],
  ["tshark -r out.pcap -T fields -e ip.src -e ip.dst","Extraire champs"],
  ["capinfos out.pcap","Infos capture"],
  ["editcap -s 100 in.pcap out.pcap","Tronquer paquets"],
  ["mergecap -a a.pcap b.pcap -w merged.pcap","Fusionner pcaps"]
 ]
},
{
 title:"Ansible    rappels de playbook",
 intro:"Extraits courants.",
 columns:["Extrait","Usage"],
 rows:[
  ["- name: installer apache","Tâche"],
  ["  apt: name=apache2 state=present update_cache=yes","Module apt"],
  ["  service: name=apache2 state=started enabled=yes","Module service"],
  ["  copy: src=index.html dest=/var/www/html/index.html","Module copy"],
  ["  template: src=cfg.j2 dest=/etc/app.conf","Template Jinja2"],
  ["  ansible.builtin.command: uptime","Commande arbitraire"],
  ["hosts: web","Cible"],
  ]
},
{
 title:"Logiciels d'analyse réseau  –  Wireshark & nmap",
 intro:"Capturer, filtrer et scanner le réseau.",
 columns:["Commande","Usage"],
 rows:[
  ["wireshark","Interface graphique de capture"],
  ["tshark -i eth0","Capture CLI"],
  ["tshark -r out.pcap","Lire une capture"],
  ["tshark -Y http.request","Filtrer HTTP"],
  ["tshark -Y dns","Filtrer DNS"],
  ["tshark -T fields -e ip.src -e ip.dst","Extraire des champs"],
  ["nmap -sV -p- host","Scan tous ports + versions"],
  ["nmap -sS host","Scan SYN furtif"],
  ["nmap -O host","Détection OS"],
  ["nmap -sn 192.168.1.0/24","Découverte d'hôtes"],
  ["nmap --script vuln host","Scripts vulnérabilités"],
  ["masscan -p80,443 10.0.0.0/8 --rate 1000","Scan rapide"],
  ["capinfos capture.pcap","Infos capture"],
  ["editcap -s 100 in.pcap out.pcap","Tronquer paquets"],
  ["mergecap a.pcap b.pcap -w out.pcap","Fusionner captures"]
 ]
},
{
 title:"Logiciels de sécurité réseau  –  Snort & Suricata",
 intro:"Détection et blocage d'intrusions réseau.",
 columns:["Commande","Usage"],
 rows:[
  ["suricata -V","Version Suricata"],
  ["suricata -c /etc/suricata/suricata.yaml -i eth0","IDS mode écoute"],
  ["suricata-update","Mettre à jour règles"],
  ["snort -V","Version Snort"],
  ["snort -A console -i eth0 -c /etc/snort/snort.conf","Lancer Snort"],
  ["pfctl -t snort2c -T show","IP bloquées (pfSense)"],
  ["suricata -T -c /etc/suricata/suricata.yaml","Valider configuration"],
  ["tail -f /var/log/suricata/fast.log","Suivre alertes"],
  ["suricata -r capture.pcap","Analyser une capture"],
  ["snort -r capture.pcap -c /etc/snort/snort.conf","Analyse offline"]
 ]
},
{
 title:"Logiciels de supervision    Zabbix, Centreon, Nagios",
 intro:"Surveillance d'infrastructures et alerting.",
 columns:["Commande","Usage"],
 rows:[
  ["zabbix_server -V","Version Zabbix"],
  ["zabbix_get -s host -k system.cpu.load[all,avg1]","Interroger agent Zabbix"],
  ["systemctl status zabbix-server","État Zabbix server"],
  ["centreon -V","Version Centreon"],
  ["nagios -v /etc/nagios/nagios.cfg","Valider config Nagios"],
  ["nagios -d /etc/nagios/nagios.cfg","Démarrer Nagios"],
  ["tail -f /var/log/nagios/nagios.log","Suivre logs Nagios"],
  ["snmpwalk -v2c -c public host","Tester SNMP"],
  ["curl -s http://localhost:9100/metrics","Métriques node_exporter"]
 ]
}
,
{
 title:"Linux  Sauvegardes et cron",
 intro:"Sauvegardes Linux automatisées et tâches planifiées.",
 columns:["Commande","Usage"],
 rows:[
  ["tar -czf /backup/etc-$(date +%F).tgz /etc","Archive /etc datée"],
  ["tar -xzf backup.tgz -C /restore","Restaurer tar"],
  ["rsync -av --delete /data/ /backup/data/","Miroir local"],
  ["rsync -avz -e ssh /data/ user@backup:/data/","Rsync distant SSH"],
  ["crontab -e","Éditer la crontab"],
  ["0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1","Backup nightly à 2h"],
  ["@daily /opt/scripts/backup.sh","Backup quotidien"],
  ["systemctl list-timers","Timers systemd"],
  ["borg create /backup/repo::backup-$(date +%F) /data","Backup Borg"],
  ["borg prune --keep-daily=7 --keep-weekly=4 /backup/repo","Prune anciens"],
  ["restic -r /backup/repo backup /data","Backup Restic"],
  ["restic -r /backup/repo restore latest --target /restore","Restore Restic"]
 ]
}

);

})(window.GUIDE);

/* chunks/07-methods.js */
(function(G){
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

})(window.GUIDE);

/* chunks/08-resources.js */
(function(G){
G.resources = G.resources || [];
G.resources.push(...[
 { title:"Dépôt du site", desc:"Code source GitHub Pages", url:"https://github.com/herbreteau787-svg/Guide-TSSR" },
 { title:"CCNA1.pdf", desc:"PDF de référence (15 Mo)", url:"./CCNA1.pdf" },
 { title:"Documentation Microsoft", desc:"Windows Server, AD, PowerShell", url:"https://learn.microsoft.com" },
 { title:"Cisco Packet Tracer", desc:"Simulateur réseau", url:"https://www.netacad.com" },
 { title:"Wireshark", desc:"Analyse de paquets", url:"https://www.wireshark.org" },
 { title:"Linux man pages", desc:"Documentation officielle", url:"https://man7.org" },
 { title:"Docker docs", desc:"Documentation conteneurs", url:"https://docs.docker.com" },
 { title:"Terraform docs", desc:"IaC HashiCorp", url:"https://developer.hashicorp.com/terraform/docs" },
 { title:"Veeam KB", desc:"Sauvegardes et restauration", url:"https://www.veeam.com/kb.html" },
 { title:"MDN Web Docs", desc:"Web et JavaScript", url:"https://developer.mozilla.org" }
]);
})(window.GUIDE);

/* chunks/09-ccp12.js */
(function(G){
const push = (arr) => G.sections.push(...arr);
push([
{
  id:"ccp12",
  group:"TSSR",
  icon:"🛡️",
  title:"CCP12 · Cybersécurité et durcissement",
  desc:"Posture de sécurité, ANSSI, détection, prévention et réponse.",
  fiches:[
   { id:"cyber-anssi", t:"Référentiels sécurité (ANSSI, CERT-FR, RGPD)", level:"intermediaire", r:"Connaître les organismes, recommandations d'hygiène et obligations légales. Sensibiliser et gouverner les accès.", tags:["cyber","anssi","rgpd"], g:["Lire le guide d'hygiène informatique ANSSI","Suivre les alertes CERT-FR","Cartographier les données personnelles","Appliquer le RGPD"], c:`# Ressources
# ANSSI : https://www.ssi.gouv.fr
# CERT-FR : https://www.cert.ssi.gouv.fr
# ANSSI 40 mesures essentielles`, p:["Cadre gestion des risques (EBIOS RM)","Sensibilisation régulière","Audit et exercices d'incident"], w:"La sécurité est un processus continu, pas un projet ponctuel." },
   { id:"cyber-hygiene", t:"Hygiène poste et durcissement", level:"intermediaire", r:"Mettre à jour, limiter les droits, chiffrer, désactiver services inutiles, protéger les navigateurs.", tags:["hardening","endpoint"], g:["Patch OS et apps automatiquement","Activer BitLocker/LUKS","Désactiver services inutiles","Configurer Pare-feu hôte"], c:`# Windows
Get-MpComputerStatus
# Linux
apt unattended-upgrade -d
ufw enable
lynis audit system`, p:["Mots de passe gérés (gestionnaire)","MFA obligatoire admins","Chiffrement des disques"], w:"Un poste non patché est la porte d'entrée la plus courante." },
   { id:"cyber-reseau", t:"Segmentation, firewall et DMZ", level:"intermediaire", r:"Segmenter par VLAN, limiter les flux, journaliser, surveiller les connexions anormales.", tags:["reseau","firewall","dmz"], g:["VLAN admin séparé","ACL deny by default","Pare-feu inter-VLAN","Journalisation centralisée"], c:`# Exemple iptables
iptables -A FORWARD -i vlan10 -o vlan20 -j DROP
iptables -A FORWARD -i wan -o dmz -p tcp --dport 443 -j ACCEPT`, p:["Zero Trust pour accès sensibles","Management plane isolé","Bastion pour admin"], w:"Les flat networks augmentent le rayon d'impact d'un incident." },
   { id:"cyber-users", t:"Gestion des identités et privilèges", level:"intermediaire", r:"Comptes nominatifs, groupes, moindre privilège, comptes de service dédiés, revue périodique.", tags:["iam","privilèges"], g:["Séparer comptes admin et user","PAM pour élévation","Revue trimestrielle des membres DA","Désactiver anciens comptes"], c:`Get-ADGroupMember "Domain Admins"
sudo -l
# PIM/JIT pour activations temporaires`, p:["Compte break-glass sous coffre","Logs d'admin centralisés","Attestation manager"], w:"Les droits cumulés sont la cause la plus fréquente d'escalade." },
   { id:"cyber-mfa", t:"MFA et authentification forte", level:"debutant", r:"Activer MFA sur accès distants, admin et cloud. MFA par défaut pour tous les comptes sensibles.", tags:["mfa","auth"], g:["Déployer TOTP/FIDO2","Codes de secours","Former utilisateurs","Suivre l'adoption"], c:`# Entra ID: Conditional Access MFA
# Linux PAM oath
pamtester sshd user authenticate`, p:["FIDO2 recommandé","Éviter SMS pour admins","Récupération documentée"], w:"MFA sans plan de secours bloque en cas de perte." },
   { id:"cyber-malware", t:"Anti-malware et EDR", level:"debutant", r:"Protection résidente, analyse, isolation d'hôte, réponse automatique.", tags:["edr","antivirus"], g:["Activer Defender/antivirus central","Bases à jour","Analyse planifiée","Alertes admin"], c:`Get-MpComputerStatus
# Isolation réseau automatique sur alerte EDR`, p:["Protection cloud","Sandboxing","Allowlisting pour serveurs"], w:"L'antivirus seul ne suffit pas; l'EDR détecte les comportements." },
   { id:"cyber-backup", t:"Sauvegarde anti-ransomware", level:"intermediaire", r:"Copies hors ligne, immuables, testées, séparées des credentials de production.", tags:["backup","ransomware"], g:["Copies offsite et hors ligne","Immutabilité","Test de restore","Comptes de backup isolés"], c:`# Veeam immuable (Linux hardened repo)
# Borg with append-only`, p:["RPO/RTO documentés","Snapshots à court terme + backup long terme","Alerte sur suppression"], w:"Les sauvegardes connectées sont cibles prioritaires." },
   { id:"cyber-ids", t:"IDS/IPS et supervision sécurité", level:"avance", r:"Suricata/Snort, corrélation, blocage et tuning pour éviter faux positifs.", tags:["ids","ips","siem"], g:["Déployer Suricata","Activer règles communautaires","Mode alerte puis block","Corréler avec SIEM"], c:`# pfSense Suricata package
pfctl -t snort2c -T show | head
lynis audit system`, p:["Sondes réseau stratégiques","Tuning par groupe","Retention logs"], w:"Une règle trop large bloque la production." },
   { id:"cyber-phishing", t:"Phishing et sensibilisation", level:"debutant", r:"Repérer les signes, vérifier les expéditeurs, signaler, phishing tests, formation continue.", tags:["phishing","sensibilisation"], g:["Vérifier domaine expéditeur","Ne jamais cliquer lien suspect","Signaler à l'admin","Campagnes de simulation"], c:`# Headers mail : Return-Path, SPF, DKIM, DMARC
# Outils : GoPhish pour simulations`, p:["DMARC enforce","Filtre mail gateway","Formation annuelle"], w:"Le maillon humain reste le plus exploité." },
   { id:"cyber-patch", t:"Gestion des vulnérabilités et patching", level:"intermediaire", r:"Recensement actifs, scans, priorisation CVSS, fenêtres maintenance, rollback.", tags:["vuln","patch","cve"], g:["Inventaire matériel/logiciel","Scan régulier","Prioriser CVE critiques","Planifier patch"], c:`# Scan
nmap -sV --script vuln 192.168.1.10
# WSUS / unattended-upgrades`, p:["VE (Vulnerability Exploitability)","Exceptions documentées","Maintenance windows"], w:"Des vulnérabilités non patchées restent ouvertes des mois." },
   { id:"cyber-logs", t:"Journalisation et réponse incident", level:"intermediaire", r:"Centraliser, conserver, analyser, chaîne de custody, playbooks d'incident.", tags:["incident","logs","response"], g:["Centraliser syslog","Conserver 90+ jours","Playbook d'incident","Post-mortem"], c:`# Linux syslog forward
*.* @siem:514
# Collecter preuves`, p:["Horodatage NTP","Intégrité des logs","Communication crise"], w:"Sans logs, l'analyse post-incident est impossible." },
   { id:"cyber-cloud", t:"Sécurité cloud et BYOD", level:"avance", r:"IAM cloud, MFA, accès conditionnels, chiffrement au repos/transit, MDM pour mobiles.", tags:["cloud","byod","mdm"], g:["IAM basé rôles","MFA cloud","Chiffrement au repos","MDM pour BYOD"], c:`# Intune / MDM enrollment
# AWS IAM policy least privilege`, p:["Logs cloud","Sauvegarde SaaS","Sensibilisation données mobiles"], w:"Les erreurs de config cloud sont la cause majeure de fuites." }
  ]
}
]);

})(window.GUIDE);

/* chunks/10-exam-mep.js */
(function(G){
const sec = G.sections.find(s => s.id === 'exam');
if (sec) {
  sec.fiches = [
   { id:"exam-q-ad", t:"QCM/Réponse : comment vérifie-t-on un accès AD ?", level:"exam", r:"On vérifie l'utilisateur avec Get-ADUser, l'appartenance aux groupes, puis le droit effectif sur la ressource avec test réel et revue des ACL. Vérification : accès accordé uniquement au profil autorisé et refus pour le profil non autorisé.", tags:["exam","ad","droits"], g:["1. Lister les groupes via ADUC ou Get-ADGroupMember","2. Tester le partage avec l'utilisateur","3. Lire les ACL NTFS et partage","4. Documenter le test de non-régression"], c:`Get-ADUser jdupont -Properties MemberOf
Get-ADGroupMember "LD_PartageCompta" -Recursive
Test-Path \\\\serveur\\compta
# NSS: icacls et Get-Acl`, p:["Penser au moindre privilège","Un refus clair prouve que la matrice est respectée"], w:"Vérifier seulement l'AD sans tester la ressource ne prouve rien." },
   { id:"exam-q-reseau", t:"QCM/Réponse : un poste n'accède plus au réseau, diagnostic ?", level:"exam", r:"On suit la couche par couche : câble/Voyant, IP/passerelle/DNS, ping par IP puis par nom, trace. On corrige un élément à la fois et on reteste.", tags:["exam","reseau","diagnostic"], g:["ipconfig /all et ping passerelle","Ping 8.8.8.8 puis nslookup","Comparer le plan réseau et le VLAN du port","Corriger DHCP/VLAN/passerelle"], c:`ipconfig /all
ping 192.168.1.1
ping 8.8.8.8
nslookup google.com
tracert google.com`, p:["169.254 = APIPA/DHCP KO","Ping IP OK mais nom KO = DNS","Tracert s'arrêtant à la passerelle = routage"], w:"Ne pas changer IP et DNS en même temps : la cause devient floue." },
   { id:"exam-q-vlan", t:"QCM/Réponse : pourquoi un port d'accès mal affecté isole un poste ?", level:"exam", r:"La communication L2 se limite au VLAN du port. Si le poste est en VLAN non attendu, il est dans un domaine de broadcast différent sans passerelle inter-VLAN.", tags:["exam","vlan","switch"], g:["show vlan brief","show interfaces status","show running-config interface f0/x","corriger access vlan et tester"], c:`show interface f0/5 switchport
show vlan brief
conf t
interface f0/5
 switchport access vlan 20
end`, p:["VLAN natif et allowed VLAN à vérifier sur les trunks","Tester depuis le poste après correction"], w:"Un VLAN silencieux donne un faux réseau opérationnel." },
   { id:"exam-q-linux", t:"QCM/Réponse : comment sécuriser l'accès SSH ?", level:"exam", r:"Authentification par clé ed25519, désactivation du root direct, PasswordAuthentication no, et test avant fermeture de session. Conclure avec journalisation.", tags:["exam","ssh","linux","securite"], g:["Générer une clé côté client","Copier la clé publique","Modifier sshd_config","Recharger sshd et tester"], c:`ssh-keygen -t ed25519 -C admin@tssr
ssh-copy-id user@serveur
# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
systemctl reload sshd`, p:["Toujours tester la clé dans un second terminal","Conserver emergency access","Versionner la config distante"], w:"Désactiver le password avant d'avoir testé la clé coupe l'accès." },
   { id:"exam-q-cron", t:"QCM/Réponse : comment mettre une sauvegarde automatique fiable ?", level:"exam", r:"Script avec shebang, variables, journal, code retour. Planifier dans cron à 02:30 et vérifier le lendemain. Expliquer chaque ligne à l'oral.", tags:["exam","cron","backup","linux"], g:["Créer le script sous /opt/scripts","chmod +x","crontab -e","Vérifier le log et le code de retour"], c:`30 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
# dans le script :
set -euo pipefail
rsync -av --delete /srv/data/ /backup/data/
echo "code=$?"`, p:["Chemins absolus","Rediriger stdout et stderr","Tester manuellement le script"], w:"Les variables d'environnement interactif ne sont pas transmises à cron." },
   { id:"exam-q-ad", t:"QCM/Réponse : créer un utilisateur, ses groupes et un partage", level:"exam", r:"Créer l'OU et le user, ajouter aux groupes Global/DomainLocal (AGDLP), créer le partage, configurer ACL, puis tester accès autorisé et non autorisé.", tags:["exam","ad","agdlp","partage"], g:["ADUC : OU, user, groupes","SMB share + ACL NTFS","gpresult pour GPO applicables","Test dans session utilisateur"], c:`New-ADUser jdupont -Enabled $true
New-ADGroup -Name G_Compta -GroupScope Global
Add-ADGroupMember LD_PartageCompta -Members G_Compta
New-SmbShare -Name Compta -Path D:\\Shares\\Compta`, p:["Permissions les plus restrictives gagnent","Séparer Global et DomainLocal","Documenter la matrice d'accès"], w:"Ajouter directement un user au groupe DomainLocal casse la traçabilité." },
   { id:"exam-q-snap", t:"QCM/Réponse : différences snapshot, sauvegarde et restauration ?", level:"exam", r:"Snapshot = point temporel dépendant de la VM source, sauvegarde = copie indépendante et testée, restauration = remise en exploitation vérifiée.", tags:["exam","vmware","backup","pra"], g:["Snapshot avant maintenance","Sauvegarde planifiée nightly","Restauration dans VM isolée","Valider la connexion et les services"], c:`# RPO = perte max acceptable
# RTO = durée de panne acceptable
# Test : fichier puis VM entière`, p:["Règle 3-2-1","Copie hors site","Immutabilité anti-ransomware"], w:"Un snapshot laissé trop longtemps dégrade les performances." },
   { id:"exam-q-oral", t:"QCM/Réponse : comment présenter une mise en situation à l'oral ?", level:"exam", r:"Contexte, objectif, actions, preuves, difficultés et améliorations. Répondre avec méthode, admettre ce qui n'est pas fini.", tags:["exam","oral","presentation","jury"], g:["Organiser captures par ordre chronologique","Expliquer cause et vérification","Justifier les choix","Reconnaître les limites"], c:`# Structure
1. Contexte du ticket
2. Analyse et cause
3. Solution mise en place
4. Preuves et tests
5. Ce qui reste à faire`, p:["Une réponse courte et juste vaut mieux qu'une improvisation","Le jury évalue la trajectoire, pas uniquement le résultat"], w:"Ne jamais masquer une erreur ou une étape non terminée." }
  ];
  const _examIdx = (G.sections || []).findIndex(s => s.id === 'exam');
  if (_examIdx !== -1) {
    const _examSec = G.sections.splice(_examIdx, 1)[0];
    G.sections.push(_examSec);
  }
}
})(window.GUIDE);

/* chunks/11-quiz-cyber.js */
(function(G){
const Q = (id, section, difficulty, q, choices, answer, explain) => G.quizzes.push({id, section, difficulty, q, choices, answer, explain});
// --- Cybersécurité ---
Q('q141','ccp12','facile',"ANSSI est ?",["Une banque"," L'agence nationale de cybersécurité"," Un FAI"," Un CMS"],1,"ANSSI = cybersécurité France.");
Q('q142','ccp12','moyen',"Le moindre privilège signifie ?",[" Donner tous les droits"," Donner le strict nécessaire"," Pas d'authentification"," Compte root partagé"],1,"Accès minimal.");
Q('q143','ccp12','moyen',"MFA recommandé pour ?",[" Uniquement l'impression"," Admin et accès externes"," Tous les comptes invités "," Aucun"],1,"Admin + remote.");
Q('q144','ccp12','facile',"EDR vs antivirus : ?",[" Identiques"," EDR détecte comportements"," Antivirus plus récent"," Aucun scan"],1,"EDR comportemental.");
Q('q145','ccp12','moyen',"Sauvegarde anti-ransomware doit être ?",[" En ligne avec prod"," Hors ligne/immuable"," Sur le même NAS"," Toujours en RAM"],1,"Hors ligne/immuable.");
Q('q146','ccp12','moyen',"IDS Suricata fait ?",[" Routage"," Détection/blocage signatures"," DNS cache"," DHCP"],1,"IDS/IPS.");
Q('q147','ccp12','facile',"Phishing détecte par ?",[" SPF/DKIM/DMARC"," OSI"," DNSSEC uniquement"," DHCP"],0,"Headers mail.");
Q('q148','ccp12','moyen',"Scan vulnérabilités avec ?",[" ping"," nmap vuln scripts"," ipconfig"," dcdiag"],1,"nmap.");
Q('q149','ccp12','facile',"RGPD concerne ?",[" Réseau uniquement"," Données personnelles"," OS only"," VLAN"],1,"Données perso.");
Q('q150','ccp12','moyen',"Logs incident conservés ?",[" 1 jour"," 90+ jours"," Jamais"," Uniquement erreurs"],1,"Rétention.");
// --- VoIP/CCP10 ---
Q('q151','ccp10','facile',"SIP port ?",[" 5060"," 53"," 443"," 22"],0,"SIP.");
Q('q152','ccp10','facile',"RTP range courant ?",[" 10000-20000 UDP"," 80-443"," 25-110"," 1-1024"],0,"RTP.");
Q('q153','ccp10','moyen',"Audio unidirectionnel VoIP souvent dû à ?",[" DNS"," NAT"," CPU"," DHCP"],1,"NAT.");
// --- exam MEP ---
Q('q158','exam','moyen',"MEP phase 1 pratique dure (v2) ?",[" 30 min"," 90 min"," 4 h"," 15 min"],1,"90 min.");
Q('q159','exam','moyen',"Matériel autorisé phase 2 MEP ?",[" Tout Internet"," Rien sauf Word"," Tel portable"," Montre connectée"],1,"Rien sauf Word.");
Q('q160','exam','facile',"Durée totale examen v2026 ?",[" 5h35"," 7h00"," 3h"," 2h"],1,"7h.");

})(window.GUIDE);

/* chunks/13-integrate-lessons.js */
(function(G){
function addFiches(sectionId, fiches) {
  const sec = (G.sections || []).find(s => s.id === sectionId);
  if (sec) {
    sec.fiches = sec.fiches || [];
    sec.fiches.push(...fiches);
  }
}

addFiches('ccp4', [
 {
  id:"ccp4-reseau-debutant", t:"Réseau : IP, masque, gateway, VLAN, diagnostic (débutant)", level:"debutant",
  r:"Un réseau, c'est des machines qui échangent des paquets. IP identifie la machine, masque sépare réseau/hôte, passerelle sort du LAN, VLAN isole.",
  tags:["reseau","debutant","ip","vlan"],
  g:["Trouver son IP/masque/gateway (ipconfig / ip a)","Ping loopback → gateway → IP externe → nom DNS","Créer VLAN et trunk, inter-VLAN via routeur/Switch L3"],
  c:`# Configuration typique
IP: 192.168.1.10
Masque: 255.255.255.0 (/24)
Gateway: 192.168.1.1
DNS: 192.168.1.1

# Diagnostic étape par étape
ping 127.0.0.1
ping 192.168.1.1
ping 8.8.8.8
ping google.com`,
  p:["IP privées : 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16","Si ping OK mais HTTP KO : service, port ou DNS","Sans gateway, pas d'Internet"],
  w:"Ne mélange pas couche 3 (IP) et couche 7 (application) : ping ne prouve pas qu'un site répond."
 },
 {
  id:"ccp4-dns-dhcp-debutant", t:"DNS/DHCP : résolution et baux (débutant)", level:"debutant",
  r:"DNS traduit nom→IP. DHCP attribue IP/gateway/DNS. TTL, A, PTR, enregistrements. Bail à renouveler.",
  tags:["dns","dhcp","debutant"],
  g:["Créer zones directe/inverse","Étendue DHCP + options","Tester nslookup et bail"],
  c:`Add-DnsServerPrimaryZone -Name tssr.local -DynamicUpdate Secure
Add-DhcpServerv4Scope -Name LAN -StartRange 192.168.1.100 -EndRange 192.168.1.200 -SubnetMask 255.255.255.0
nslookup intranet.local`,
  p:["DNS pointe vers le DC en AD","Scavenging évite les enregistrements obsolètes","Bail court pour Wi-Fi invité"],
  w:"Mauvais DNS côté client casse Kerberos/AD."
 }
]);

addFiches('ccp2', [
 {
  id:"ccp2-ad-debutant", t:"Active Directory : domaine, OU, GPO, objets (débutant)", level:"debutant",
  r:"AD centralise utilisateurs/machines dans un domaine. OU = dossiers, groupes = droits, GPO = paramètres poussés.",
  tags:["ad","windows","gpo","debutant"],
  g:["Créer user/group/OU","Déplacer objet puis lier GPO","gpupdate /force et gpresult"],
  c:`# Objets AD courants
Utilisateur, Groupe, Ordinateur, OU
# GPO
gpupdate /force
gpresult /r`,
  p:["AGDLP pour les droits","LSDOU : Local, Site, Domaine, OU","Compte local vs compte domaine"],
  w:"Un mauvais placement d'OU casse l'héritage des GPO."
 },
 {
  id:"ccp2-windows-debutant", t:"Windows : permissions, partages, logs, tâches (débutant)", level:"debutant",
  r:"Partages SMB + droits NTFS (le plus restrictif gagne). Logs dans Observateur d'événements. Planifier avec Task Scheduler.",
  tags:["windows","permissions","logs","debutant"],
  g:["Partager un dossier avec matrix de droits","Tester accès autorisé/refusé","Planifier une tâche nightly"],
  c:`# Permissions
icacls D:\\Partage /grant G_Compta:(RX)
# Planification
schtasks /create /tn Backup /tr "backup.bat" /sc daily /st 02:00`,
  p:["Surveillance : CPU/RAM/disque avec PerfMon","EventID 4625 (échec logon)"," Sauvegarder avant MAJ"],
  w:" Ne pas ouvrir le partage en Contrôle total pour Tout le monde."
 }
]);

addFiches('ccp3', [
 {
  id:"ccp3-linux-debutant", t:"Linux : utilisateurs, droits, SSH, services, disque (débutant)", level:"debutant",
  r:"Linux gère utilisateurs/groupes, droits rwx, services via systemd, réseau via ip/Netplan et SSH à sécuriser.",
  tags:["linux","ssh","droits","debutant"],
  g:["Créer user, groupes, clés SSH","Désactiver root direct","Surveiller services et logs"],
  c:`useradd -m -s /bin/bash alice
usermod -aG sudo alice
systemctl status sshd
journalctl -u sshd -n 20
ip a; ss -tulpn`,
  p:["chmod 640 = rw-r-----","Netplan sensible à l'indentation","Logs : /var/log"],
  w:"Oublier -a dans -G écrase les groupes existants."
 }
]);

addFiches('ccp5', [
 {
  id:"ccp5-virt-debutant", t:"Virtualisation : hyperviseur, snapshot, réseaux (débutant)", level:"debutant",
  r:"ESXi/Hyper-V/Proxmox abstraient le matériel. Snapshot = point de restauration locale, pas backup. Bridge/NAT/host-only selon besoin.",
  tags:["virtualisation","snapshot","debutant"],
  g:["Créer VM depuis template","Snapshot avant MAJ","Tester restauration"],
  c:`# Concepts VMware/Hyper-V
Thin provisioning, vSwitch, portgroup
Snapshot ≠ Sauvegarde`,
  p:["Type 1 bare-metal vs Type 2 hosté","VMkernel pour vMotion","MTU identique"],
  w:"Un snapshot oublié dégrade fortement l'I/O."
 }
]);

addFiches('ccp12', [
 {
  id:"ccp12-sec-debutant", t:"Sécurité : mots de passe, MFA, pare-feu, sauvegarde (débutant)", level:"debutant",
  r:"L'hygiène : patcher, moindre privilège, MFA, segmentation, EDR, sauvegardes hors ligne immuables.",
  tags:["securite","mfa","backup","debutant"],
  g:["Activer MFA admin/remote","Durcir postes et serveurs","Sauvegardes testées hors ligne"],
  c:`# Vérifier Defender
Get-MpComputerStatus
# Firewall Linux
ufw enable
ufw status`,
  p:["ANSSI/CERT-FR comme référentiels","PRA avec RPO/RTO","Journalisation centrale"],
  w:"La sécurité est un processus continu."
 }
]);

})(window.GUIDE);

/* chunks/14-simulations.js */
(function(G){
G.sections = G.sections || [];
G.sections.push({
 id:"exemples",
 group:"TSSR",
  icon:"🧪",
 title:"Exemples pratiques & simulations",
 desc:"Mises en situation pas à pas (GUI + CLI) pour comprendre par l'action.",
 fiches:[
  {
   id:"sim-poste-sans-internet", t:"Simulation : poste Windows sans internet", level:"debutant",
   r:"Poste en DHCP avec IP APIPA (169.254.x.x) : pas de réponse serveur DHCP. On vérifie couche par couche.",
   tags:["simulation","reseau","poste","dhcp"],
   g:["Ouvrir Centre Réseau et partage : l'IP est 169.254.42.17","Tester ping 127.0.0.1 (OK) puis ping passerelle (KO)","Redémarrer la carte ou ipconfig /renew","Vérifier le serveur DHCP (étendue, bail)"],
   c:`ipconfig /all
ping 127.0.0.1
ping 192.168.1.1
ipconfig /release
ipconfig /renew
ipconfig /flushdns`,
   p:["APIPA = 169.254.0.0/16","Le défaut peut venir d'un câble ou d'un VLAN","Tracer les changements dans le ticket"],
   w:"Ne pas mettre une IP fixe « pour faire marcher » sans diagnostic."
  },
  {
   id:"sim-creation-user-ad", t:"Simulation : créer un utilisateur AD puis tester", level:"debutant",
   r:"Création complète d'un compte et validation de la connexion + GPO.",
   tags:["simulation","ad","compte"],
   g:["ADUC : nouvelle OU Users","Créer l'utilisateur Jean Martin","Ajouter au groupe G_Compta","Se connecter sur un poste du domaine"],
   c:`New-ADUser -Name "Jean Martin" -SamAccountName jmartin -GivenName Jean -Surname Martin -Enabled $true -Path "OU=Users,DC=tssr,DC=local" -AccountPassword (ConvertTo-SecureString 'Temp2026!' -AsPlainText -Force) -ChangePasswordAtLogon $true
Add-ADGroupMember -Identity G_Compta -Members jmartin
gpupdate /force
gpresult /r`,
   p:["Le mot de passe doit être changé à la première ouverture","Vérifier les GPO appliquées","Garder les preuves pour le dossier pro"],
   w:"Un compte créé dans la mauvaise OU hérite de mauvaises GPO."
  },
  {
   id:"sim-vlan-cisco", t:"Simulation : VLAN et trunk Cisco", level:"intermediaire",
   r:"Mettre deux PC dans deux VLAN puis vérifier l'isolation et le trunk.",
   tags:["simulation","cisco","vlan"],
   g:["Packet Tracer : switch + 2 PC","Créer VLAN 10 et 20, affecter les ports","Configurer le trunk entre deux switches","Test ping intra/inter VLAN"],
   c:`enable
configure terminal
vlan 10
 name COMPTA
vlan 20
 name IT
interface range f0/1-2
 switchport mode access
 switchport access vlan 10
interface f0/24
 switchport mode trunk
 switchport trunk allowed vlan 10,20
show vlan brief
show interfaces trunk`,
   p:["Sans routeur, les VLAN sont isolés","show interfaces trunk révèle les VLAN autorisés","Sauvegarder startup-config"],
   w:"Un VLAN non autorisé sur le trunk coupe silencieusement la communication."
  },
  {
   id:"sim-routage-inter-vlan", t:"Simulation : routage inter-VLAN (router-on-a-stick)", level:"intermediaire",
   r:"Un routeur avec sous-interfaces .10/.20 route entre VLAN.",
   tags:["simulation","cisco","routing","vlan"],
   g:["Connecter switch (trunk) au routeur","Créer sous-interfaces dot1Q","Configurer IP passerelle par VLAN","Tester ping entre VLAN"],
   c:`interface g0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
interface g0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
no shutdown
show ip route
show ip interface brief`,
   p:["Le port physique doit être no shutdown","Les passerelles sont les SVI/router subif","Tester avec ping puis DNS"],
   w:"Un trunk natif mal défini casse tout le routage."
  },
  {
   id:"sim-acl", t:"Simulation : ACL et test de blocage", level:"intermediaire",
   r:"Bloquer un sous-réseau A vers B sur le port 80, puis vérifier.",
   tags:["simulation","acl","cisco","securite"],
   g:["Créer l'ACL étendue","L'appliquer en entrée sur l'interface","Tester ping/HTTP depuis le réseau bloqué","Consulter les compteurs"],
   c:`ip access-list extended LAN-BLOCK
 permit ip any any
 deny tcp 192.168.10.0 0.0.0.255 192.168.20.0 0.0.0.255 eq 80
interface g0/1
 ip access-group LAN-BLOCK in
show access-lists`,
   p:["L'ordre des règles compte","deny implicite à la fin","Tester dans les deux sens"],
   w:"Une ACL sur la mauvaise interface bloque tout le trafic."
  },
  {
   id:"sim-linux-users", t:"Simulation : utilisateurs, groupes et SSH", level:"debutant",
   r:"Créer un compte, lui donner sudo, configurer une clé SSH et tester la connexion distante.",
   tags:["simulation","linux","users","ssh"],
   g:["Créer l'utilisateur alice sur le serveur","Ajouter la clé publique","Désactiver l'authentification par mot de passe","Se connecter avec la clé"],
   c:`useradd -m -s /bin/bash alice
usermod -aG sudo alice
ssh-keygen -t ed25519 -C "alice@tssr"
ssh-copy-id alice@192.168.1.20
# /etc/ssh/sshd_config
PasswordAuthentication no
systemctl reload sshd
ssh alice@192.168.1.20`,
   p:["Toujours tester la clé avant de désactiver le password","sudo -l pour vérifier","Journaliser l'accès"],
   w:"Se couper l'accès SSH est l'erreur la plus fréquente."
  },
  {
   id:"sim-lvm", t:"Simulation : ajout de disque avec LVM", level:"avance",
   r:"Ajouter un disque, le transformer en volume logique monté.",
   tags:["simulation","linux","lvm","stockage"],
   g:["Brancher le disque et repérer /dev/sdb","Créer PV, VG, LV","Formater et monter","Ajouter à fstab"],
   c:`lsblk
pvcreate /dev/sdb
vgcreate vg_data /dev/sdb
lvcreate -L 10G -n lv_data vg_data
mkfs.ext4 /dev/vg_data/lv_data
mount /dev/vg_data/lv_data /opt/data
echo "/dev/vg_data/lv_data /opt/data ext4 defaults 0 2" >> /etc/fstab
mount -a`,
   p:["XFS pour gros volumes","Ne jamais fsck un volume monté","Snapshot LVM avant MAJ"],
   w:"fstab erroné peut empêcher le boot."
  },
  {
   id:"sim-apache-restriction", t:"Simulation : site Apache restreint par IP", level:"intermediaire",
   r:"Déployer un site en DMZ et limiter l'accès aux IP internes.",
   tags:["simulation","apache","dmz","securite"],
   g:["Installer Apache","Créer un vhost intranet","Restreindre par Require ip","Recharger et tester"],
   c:`apt install apache2 -y
a2ensite intranet
# /etc/apache2/sites-available/intranet.conf
<Directory /var/www/intranet>
 Require ip 192.168.1.0/24
</Directory>
systemctl reload apache2
curl -I http://intranet`,
   p:["Reverse proxy recommandé","Logs + rotation","TLS pour production"],
   w:"Oublier la règle Allow/Deny bloque tout accès."
  },
  {
   id:"sim-backup-test", t:"Simulation : sauvegarde et test de restore", level:"intermediaire",
   r:"Sauvegarder un dossier puis le restaurer dans un emplacement de test et vérifier l'intégrité.",
   tags:["simulation","backup","restore"],
   g:["Créer des fichiers de test","Lancer une sauvegarde tar/rsync","Supprimer les originaux","Restaurer et comparer"],
   c:`mkdir -p /data/test && echo ok > /data/test/f.txt
tar -czf /backup/test-$(date +%F).tgz /data/test
rm -rf /data/test
mkdir -p /restore/test
tar -xzf /backup/test-$(date +%F).tgz -C /restore
diff -r /restore/data/test /data 2>/dev/null || echo restored`,
   p:["RPO/RTO définis","Checksums pour l'intégrité","Conserver hors ligne"],
   w:"Une sauvegarde non testée n'est pas une sauvegarde."
  },
  {
   id:"sim-dns-trace", t:"Simulation : diagnostic DNS de bout en bout", level:"intermediaire",
   r:"Nom qui ne résout pas : tests DNS client/serveur, zone et enregistrement.",
   tags:["simulation","dns","diagnostic"],
   g:["Ping par IP (OK) puis par nom (KO)","nslookup pour identifier le serveur","Vérifier la zone et l’enregistrement A","Purger le cache et retester"],
   c:`ping 192.168.1.10
ping srv1.tssr.local
nslookup srv1.tssr.local
nslookup srv1.tssr.local 192.168.1.10
ipconfig /flushdns
# Serveur DNS :
Get-DnsServerResourceRecord -ZoneName tssr.local -Name srv1`,
   p:["Le poste doit pointer vers le bon DNS","Scavenging pour nettoyer","Vérifier la zone inverse PTR"],
   w:"Un mauvais DNS côté client casse Kerberos/AD."
  }
 ]
});
const groupRank = { 'TSSR': 0, 'CCNA': 1, 'Examens': 2 };
G.sections.sort((a, b) => (groupRank[a.group] ?? 9) - (groupRank[b.group] ?? 9));

})(window.GUIDE);

/* chunks/16-pedagogical-structure.js */
(function(G){
G.sections = G.sections || [];

function A(id, card) {
  const sec = G.sections.find(function(s){ return s.id === id; });
  if (sec) { sec.fiches = sec.fiches || []; sec.fiches.push(card); }
}

A("ccp1", {
  id:"pedagogie-ccp1",
  t:"Fiche pedagogique de reference - CP1 IA encadree",
  level:"intermediaire",
  r:"Definition : l'IA assiste l'humain mais ne decide pas a sa place. Contexte professionnel : un utilisateur ou un technicien utilise un assistant pour rediger une procedure ou suggere un script. Objectif : utiliser l'IA de facon fiable, securisee et documentee. Explication detaillee : l'IA n'a pas la verite terrain et peut halluciner ; elle doit etre bornee par des donnees propres et validee. Exemple concret : generer un script PowerShell de sauvegarde puis le tester en bac a sable. Erreurs frequentes : copier sans verifier, fournir des secrets, confondre suggestion et preuve. Questions jury : comment encadrez-vous l'IA, quelle est une hallucination, comment protegez-vous les donnees.",
  tags:["pedagogie","examen","ia"],
  g:["Identifier le besoin","Preparer un prompt structure et anonyme","Verifier le resultat","Tester en bac a sable","Documenter dans le ticket"],
  c:"No native command; validation manuelle et test obligatoire.",
  p:["Copier sans controle", "Publier des donnees sensibles", "Oublier la preuve"],
  w:"Conclusion : l'IA est un accelerateur, la validation humaine reste obligatoire."
});

A("ccp2", {
  id:"pedagogie-ccp2",
  t:"Fiche pedagogique de reference - CP2 deploiement",
  level:"intermediaire",
  r:"Definition : deployer des equipements numériques et accompagner les outils collaboratifs. Contexte : installer un parc avec image, AD, GPO et O365. Objectif : industrialiser et standardiser. Details : Sysprep, PXE, enrôlement Entra ID, M365, tests et communication utilisateur. Exemple : adoption d'un nouvel outil avec formation et documentation. Erreurs : sinon cloner sans Sysprep, oublier pilotes, ne pas accompagner. Jury : risque clone direct, accompagnement utilisateur, difference AD/Entra.",
  tags:["pedagogie","deploiement","collaboration"],
  g:["Preparer l'image","Deployer PXE","Joindre au domaine","Appliquer GPO","Accompagner l'utilisateur"],
  c:"sysprep /oobe /generalize /shutdown ; dism /Capture-Image",
  p:["Clonage direct","Absence de support utilisateur"],
  w:"Conclusion : le deploiement reussit quand technique et accompagnement avancent ensemble."
});

A("ccp3", {
  id:"pedagogie-ccp3",
  t:"Fiche pedagogique de reference - CP3 assistance technique",
  level:"intermediaire",
  r:"Definition : diagnostiquer et resoudre en respectant l'utilisateur. Contexte : panne VPN ou poste. Objectif : retablir vite et documenter. Details : methode entonnoir, physique, IP, passerelle, DNS, applicatif. Exemple : cable debranche puis IP APIPA. Erreurs : changer plusieurs parametres ace fois, fermer sans validation. Jury : priorite incident, difference incident/probleme/demande, escalade.",
  tags:["pedagogie","support"],
  g:["Identifier et rassurer","Reproduire","Tester couche par couche","Corriger","Valider et documenter"],
  c:"ipconfig /all; ping; nslookup; tracert",
  p:["Diagnostic trop rapide","Absence de communication"],
  w:"Conclusion : structure et communication valent autant que la commande."
});

A("ccp4", {
  id:"pedagogie-ccp4",
  t:"Fiche pedagogique de reference - CP4 réseau IP",
  level:"intermediaire",
  r:"Definition : comprendre adressage, routage, VLAN et services réseau. Contexte : poste isole dans un VLAN mal affecte. Objectif : analyser et retablir. Details : OSI, segmentation, ACL, DNS, DHCP. Exemple : documentation plan d'adressage et VLAN voie/data. Erreurs : modifier IP sans comprendre VLAN, masque incorrect. Jury : VLAN, routage statique/dynamique, DNS.",
  tags:["pedagogie","reseau","ccna"],
  g:["Analyser les symptômes","Verifier physique","Verifier IP/passerelle/DNS","Corriger","Documenter"],
  c:"ping; tracert; nslookup; show running-config",
  p:["Confusion masque/VLAN","Changements multiples"],
  w:"Conclusion : toujours expliquer la cause, pas seulement la solution."
});

A("ccp5", {
  id:"pedagogie-ccp5",
  t:"Fiche pedagogique de reference - CP5 serveurs Windows/Linux",
  level:"intermediaire",
  r:"Definition : installer et exploiter des serveurs. Contexte : mise en production AD/DNS/DHCP. Objectif : securiser et superviser. Details : AD DS, GPO, Linux systemd, journaux, patch et permissions. Exemple : creation DC et test GPO. Erreurs : compte admin unique, patch sans test. Jury : difference OU et groupe, GPO, reset mot de passe.",
  tags:["pedagogie","systemes"],
  g:["Installer","Configurer","Securiser","Tester","Superviser"],
  c:"server-manager ; dcdiag; Get-ADUser",
  p:["Permissions excessives","Sauvegarde absente"],
  w:"Conclusion : la documentation fait partie de l'exploitation."
});

A("ccp6", {
  id:"pedagogie-ccp6",
  t:"Fiche pedagogique de reference - CP6 virtualisation",
  level:"intermediaire",
  r:"Definition : mutualiser des serveurs virtuels avec haute disponibilite. Contexte : VMware, Hyper-V ou Proxmox. Objectif : provisionner, sauvegarder et restaurer. Details : vSwitch, storage, snapshots vs sauvegardes, cluster HA/DRS. Exemple : creation VM puis sauvegarde pro. Erreurs : confondre snapshot et sauvegarde, ignorer ressources. Jury : pourquoi deux vSwitch, hotes vs invites, sauvegarde.",
  tags:["pedagogie","virtualisation"],
  g:["Provisionner","Snapshot avant modification","Tester","Sauvegarder","Valider"],
  c:"Get-VM; esxcli system version get",
  p:["Snapshot unique consideré comme sauvegarde","Datastore unique"],
  w:"Conclusion : preuve de restauration indispensable."
});

A("ccp7", {
  id:"pedagogie-ccp7",
  t:"Fiche pedagogique de reference - CP7 acces et securite hybride",
  level:"intermediaire",
  r:"Definition : gerer identites, MFA, groupes, VPN et durcissement dans un environnement hybride. Contexte : Entra ID, M365, sites distants et firewall. Objectif : proteger l'infrastructure. Details : hybrid identity, Conditional Access, MDM, segmentation, journalisation, pfSense/WireGuard. Exemple : VPN site-to-site securise. Erreurs : admin global permanent, VPN sans MFA, sur-exposition. Jury : hybrid identity, MFA vs MDM, segmentation LAN.",
  tags:["pedagogie","securite","hybride"],
  g:["Definir le flux","Generer les cles","Tester","Journaliser","Documenter"],
  c:"ip a; systemctl status wg-quick@wg0",
  p:["Sur-exposure d'administration","Absence de MFA"],
  w:"Conclusion : securite par couche et moindre privilege."
});

A("ccp8", {
  id:"pedagogie-ccp8",
  t:"Fiche pedagogique de reference - CP8 supervision et mise a jour",
  level:"intermediaire",
  r:"Definition : surveiller proactivement et mettre a jour le parc. Contexte : Zabbix/PRTG et WSUS/GPO. Objectif : maintenir la disponibilite. Details : agents, seuils, alertes, patch management, tests. Exemple : alerte CPU > 80 pendant 5 minutes. Erreurs : seuils inadaptes, faux positifs ignores. Jury : OID, agentless vs agent, priorite des correctifs.",
  tags:["pedagogie","supervision","mise a jour"],
  g:["Inventorier","Installer agent","Definir seuils","Tester notification","Documenter"],
  c:"zabbix_agentd -t system.cpu.load",
  p:["Pas de test annuel","KPI non mesurables"],
  w:"Conclusion : la supervision previent et favorise l'examen."
});

A("ccp9", {
  id:"pedagogie-ccp9",
  t:"Fiche pedagogique de reference - CP9 continuite et reprise",
  level:"intermediaire",
  r:"Definition : preparer la continuite et la reprise d'activite. Contexte : sauvegarde Veeam et plan d'urgence. Objectif : reduire RPO et RTO. Details : regle 3-2-1, test de restauration, matrice de service, PCA/PRA. Exemple : restauration d'une VM de production pour valider le RTO. Erreurs : jamais tester une sauvegarde, sauvegarde unique, oublier l'authentification Veeam. Jury : difference RPO/RTO, test de restauration, preuve du PCA.",
  tags:["pedagogie","pca","pra"],
  g:["Identifier RPO/RTO","Sauvegarder hors site","Tester la restauration trimestrielle","Documenter et simuler"],
  c:"veeam backup ; powercli Backup-VM",
  p:["Absence de test","Pas de plan de communication"],
  w:"Conclusion : une sauvegarde n'est utile que si elle est testee."
});

A("ccp10", {
  id:"pedagogie-ccp10",
  t:"Fiche pedagogique de reference - CP10 infrastructure supervisionnee",
  level:"intermediaire",
  r:"Definition : maintenir, mettre a jour et superviser le parc de maniere professionnelle. Contexte : inventaire, reporting, documentation et demonstration au jury. Objectif : assurer le suivi. Details : KPI, carnet de maintenance, scripts, tableau de bord. Exemple : rapport mensuel d'etat des services. Erreurs : KPI non mesurables, documentation non mise a jour, absence de tracabilite. Jury : quels KPI, comment documentez-vous, comment ameliorez-vous la supervision.",
  tags:["pedagogie","operations","reporting"],
  g:["Collecter les indicateurs","Produire le tableau de bord","Proposer des actions","Archiver"],
  c:"PowerShell reporting, export CSV et Excel",
  p:["Inventaire incomplet","Documentation non mise a jour"],
  w:"Conclusion : le suivi et la preuve sont indispensables au titre."
});
})(window.GUIDE);
