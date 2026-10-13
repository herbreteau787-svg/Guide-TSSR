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
  title:"CCP1 · Support, service desk & utilisateurs",
  desc:"Méthodes ITIL, ticketing, diagnostic poste, comptes, communication client.",
  fiches:[
   {
    id:"ccp1-tickets", t:"Cycle de vie d'un ticket (incident/problème/demande)", level:"debutant",
    r:"Incident = service dégradé à rétablir vite. Problème = cause racine à éliminer. Demande = besoin prévu. Priorité = Impact × Urgence × Criticité.",
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
  title:"CCP2 · Windows Server & Active Directory",
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
  title:"CCP3 · Linux ( Debian/Ubuntu/RHEL )",
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
  title:"CCP4 · Réseau, Cisco et subnetting",
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
  title:"CCP5 · Virtualisation VMware",
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
  id:"ccp6",
  group:"TSSR",
  icon:"📜",
  title:"CCP6 · Scripts Bash & PowerShell",
  desc:"Automatisation, pipeline, erreurs, planification, paramétrisation.",
  fiches:[
   {
    id:"ccp6-bash", t:"Bash : base et arguments", level:"intermediaire",
    r:"Shebang, droits +x, variables positionnelles $1 $# $?, tests -f/-d/-z pour scripts sûrs.",
    tags:["bash","script","shell"],
    g:["Éditer avec nano/VS Code puis chmod +x","Tester dans le terminal et planifier avec cron","Tracer avec set -x si besoin"],
    c:`#!/bin/bash
set -euo pipefail
if [ $# -ne 1 ]; then echo "Usage: $0 dossier"; exit 1; fi
if [ ! -d "$1" ]; then echo "introuvable"; exit 2; fi
for f in "$1"/*.conf; do [ -f "$f" ] && cp "$f" /tmp/; done
echo "Terminé avec code $?"`,
    p:["Toujours guillemets autour de \"$var\"","set -euo pipefail pour scripts robustes","$? 0 = succès"],
    w:"Un script sans validation peut effacer des données sur un chemin erroné."
   },
   {
    id:"ccp6-powershell", t:"PowerShell : pipeline et gestion d'erreurs", level:"intermediaire",
    r:"Pipeline d'objets, Where/Select/Export, try/catch avec -ErrorAction Stop.",
    tags:["powershell","pipeline","erreurs"],
    g:["ISE/VS Code pour pas à pas","Politique RemoteSigned pour CurrentUser","Planificateur : action powershell -File"],
    c:`Import-Csv .\\users.csv | ForEach-Object { New-ADUser -Name $_.Nom -SamAccountName $_.Login -Enabled $true }
try { Get-Content C:\\absent.txt -ErrorAction Stop } catch { Write-Warning $_.Exception.Message }
Get-Service | Where-Object Status -eq Stopped | Select-Object Name, DisplayName | Export-Csv C:\\stopped.csv -NoTypeInformation`,
    p:["Get-Help et Get-Member indispensables","Chemins absolus en tâche planifiée","Utiliser [CmdletBinding()] pour les scripts pros"],
    w:"Le pipeline PowerShell conserve les objets ; ne pas tout convertir en texte."
   },
   {
    id:"ccp6-ansible", t:"Ansible : automatisation agentless", level:"avance",
    r:"YAML, inventaire, modules idempotents, playbooks réutilisables et collections.",
    tags:["ansible","automation","yaml"],
    g:["Installer Ansible (WSL/Linux)","Inventaire avec groupes","Ad-hoc pour tester","Playbook pour orchestrer"],
    c:`# inventory.ini
[web]
web1 ansible_host=192.168.1.21
# playbook.yml
- hosts: web
  become: yes
  tasks:
    - name: Installer Apache
      apt: name=apache2 state=present update_cache=yes
    - name: Service actif
      service: name=apache2 state=started enabled=yes
ansible-playbook -i inventory.ini playbook.yml --check`,
    p:["Idempotence : relancer ne change rien si état déjà bon","Vault pour chiffrer les secrets","Roles pour réutiliser"],
    w:"Les playbooks non versionnés créent des dérives de configuration (drift)."
   },
   {
    id:"ccp6-python", t:"Python pour le réseau (Netmiko/NAPALM)", level:"avance",
    r:"Automatisation multi-équipements via SSH, parsing et sauvegarde de configurations.",
    tags:["python","netmiko","reseau","automation"],
    g:["Installer Python et les modules","Créer un inventaire SSH","Tester la connexion à un labo Packet Tracer/GNS3","Versionner les scripts Git"],
    c:`from netmiko import ConnectHandler
dev = {'device_type':'cisco_ios','host':'192.168.1.1','username':'admin','password':'xxx'}
conn = ConnectHandler(**dev)
print(conn.send_command('show ip int brief'))
conn.send_config_set(['hostname R1','interface l0','ip address 1.1.1.1 255.255.255.255'])
conn.disconnect()`,
    p:["API REST pour SDN (DNAC, Meraki)","YAML + Jinja2 pour générer des configs","Tests unitaires pour éviter les régressions"],
    w:"Les scripts réseau doivent avoir un rollback prévu avant l'exécution."
   }
  ]
},
{
  id:"ccp7",
  group:"TSSR",
  icon:"🧱",
  title:"CCP7 · pfSense, NAT, VPN et proxy",
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
  title:"CCP8 · Sauvegardes et PRA",
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
  title:"CCP9 · Déploiement et gestion de parc",
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
  group:"CCNA",
  icon:"🌐",
  title:"CCNA 200-301 · Réseaux, sécurité et automatisation",
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

/* chunks/02-sections-extras.js */
(function(G){
// chunk: sections complémentaires (supervision, identité, conteneurs, IaC)
const push = (arr) => G.sections.push(...arr);

push([
{
  id:"supervision",
  group:"CCP11",
  icon:"📈",
  title:"CCP11 · Supervision · Zabbix, Nagios et observabilité",
  desc:"Disponibilité, métriques, journaux, alerting et tableaux de bord.",
  fiches:[
   { id:"sup-zabbix", t:"Zabbix : hôtes, templates et alertes", level:"intermediaire", r:"Zabbix surveille par agent/SSH/SNMP. Les templates standardisent la collecte. Les triggers et actions génèrent alertes et escalades.", tags:["zabbix","supervision","snmp"], g:["Installer Zabbix server sur une VM dédiée","Ajouter des hôtes par template (Linux/Windows/Cisco)","Créer des triggers et actions email/SMS","Construire des dashboards par service"], c:`# Zabbix agent (Linux)
apt install zabbix-agent -y
# /etc/zabbix/zabbix_agentd.conf
Server=192.168.1.10
Hostname=SRV1
systemctl enable --now zabbix-agent`, p:["Templates communautaires ; éviter les doublons","Seuils CPU/RAM/disco avec durées","Maintenance windows pour éviter le bruit"], w:"Une mauvaise stratégie de nommage complique les rapports." },
   { id:"sup-snmp", t:"SNMP, MIB et sécurité", level:"intermediaire", r:"SNMP expose l'état des équipements. SNMPv3 obligatoire pour chiffrer et authentifier.", tags:["snmp","cisco","reseau"], g:["Activer SNMPv3 avec authPriv","Limiter l'accès par ACL","Collecter CPU, mémoire, interfaces","Tester avec snmpwalk"], c:`# Cisco
snmp-server group MON v3 priv
snmp-server user monitor MON v3 auth sha Pass123 priv aes 128 Pass456
snmp-server view ALL iso included
# Test
snmpwalk -v3 -l authPriv -u monitor -a SHA -A Pass123 -x AES -X Pass456 192.168.1.1`, p:["Exporter les MIB constructeur","Remplacer community public/private","Port 161 UDP/TCP pour traps"], w:"SNMPv1/v2c en clair = fuite d'information." },
   { id:"sup-logging", t:"Syslog centralisé et corrélation", level:"avance", r:"Concentrer les logs OS et réseau, normaliser et rechercher. Syslog-ng ou rsyslog vers un serveur central.", tags:["syslog","logs","centralisation"], g:["Configurer rsyslog pour envoyer les logs","Centraliser sur une VM","Créer filtres par gravité","Relier à Graylog/ELK"], c:`# /etc/rsyslog.d/50-forward.conf
*.* @192.168.1.10:514
# Sur le serveur :
module(load="imudp") input(type="imudp" port="514")
*.* /var/log/remote/all.log`, p:["TCP pour fiabilité","Rotation et rétention","Horodatage NTP indispensable"], w:"Un journal central sans NTP rend l'analyse temporelle inutilisable." },
   { id:"sup-dash", t:"Grafana et métriques", level:"avance", r:"Grafana visualise Prometheus/Loki/InfluxDB, avec alerting multi-canal.", tags:["grafana","prometheus","monitoring"], g:["Installer Prometheus + node_exporter","Ajouter la source dans Grafana","Importer un dashboard standard","Créer des alertes par seuil"], c:`# Prometheus scrape
scrape_configs:
  - job_name: 'linux'
    static_configs:
      - targets: ['192.168.1.20:9100']
# Node exporter
curl -s 192.168.1.20:9100/metrics | head`,
    p:["Cardinality attention ; normaliser les labels","Alerting vers Slack/Teams","Enregistrement longue durée"], w:"Les métriques ne remplacent pas les logs pour le root-cause."
  }
 ]
},
{
  id:"identite",
  group:"CCP11",
  icon:"🔐",
  title:"CCP11 · Identité, SSO et annuaires",
  desc:"LDAP, authentification forte, MFA, RBAC et gouvernance des accès.",
  fiches:[
   { id:"id-ldap", t:"LDAP : structure et recherche", level:"intermediaire", r:"LDAP organise les objets en DIT (DN, OU, DC). Lire avec ldapsearch avant toute modification.", tags:["ldap","annuaire","recherche"], g:["Identifier le DN de base et les classes","Tester une recherche par filtre","Vérifier les droits de lecture","Documenter l'arborescence"], c:`ldapsearch -x -H ldap://dc1.tssr.local -D "cn=admin,dc=tssr,dc=local" -W -b "dc=tssr,dc=local" "(sAMAccountName=jdupont)"
ldapsearch -x -LLL -b "ou=Users,dc=tssr,dc=local" "(objectClass=user)" cn mail`, p:["Filtres LDAP : =, *, &, |","LDAPS port 636 avec certificat","pagination pour gros annuaires"], w:"Modifier directement avec ldapmodify exige prudence (pas de rollback)." },
   { id:"id-mfa", t:"MFA et authentification forte", level:"intermediaire", r:"TOTP, FIDO2, push. Adapter selon risque : admin et accès distants obligatoirement MFA.", tags:["mfa","securite","authentification"], g:["Activer MFA sur VPN/RDP/admin","Fournir un secours (codes, clé de secours)","Former les utilisateurs","Suivre l'adoption"], c:`# Windows Hello / Authenticator
# GPO : activer Windows Hello for Business
# Azure AD/Entra : Conditional Access MFA
# Linux PAM (oath)
pamtester sshd jdupont authenticate`, p:["FIDO2 plus sûr que TOTP","Éviter SMS pour les admins","Mécanisme de récupération documenté"], w:"MFA sans accès de secours = blocage complet en cas de perte du facteur." },
   { id:"id-rbac", t:"RBAC, PAM et gouvernance des privilèges", level:"avance", r:"Rôles par fonction, principe du moindre privilège, revue périodique des accès, comptes séparés admin.", tags:["rbac","pam","securite"], g:["Cartographier les accès par rôle","Séparer comptes nominatifs et admin","Revue trimestrielle des membres de groupes sensibles","Retirer les droits à la sortie"], c:`# PowerShell : membres du groupe Domain Admins
Get-ADGroupMember "Domain Admins" -Recursive | Select SamAccountName
# Azure PIM : activation juste-à-temps
# Linux sudoers :
%admins ALL=(ALL) ALL`,
    p:["Compte d'urgence (break-glass) sous coffre","Logs d'admin centralisés","Attestation manager pour accès sensibles"], w:"Les droits cumulés (groupes imbriqués) sont difficiles à auditer." }
  ]
},
{
  id:"containers",
  group:"CCP11",
  icon:"🐳",
  title:"CCP11 · Conteneurs · Docker, Compose et registry",
  desc:"Empaquetage d'application, orchestration simple, réseau, volumes et sécurité.",
  fiches:[
   { id:"docker-base", t:"Docker : images, conteneurs et cycle de vie", level:"intermediaire", r:"Image = modèle ; conteneur = instance. Build à partir d'un Dockerfile, registry pour distribuer.", tags:["docker","conteneurs"], g:["Installer Docker engine","Lancer un conteneur de test","Construire une image locale","Publier sur un registry privé"], c:`docker run -d --name web -p 8080:80 nginx:alpine
docker ps
docker build -t myapp:1.0 .
docker push registry.local:5000/myapp:1.0
docker logs web --tail 50`, p:["Images officielles pin par digest","Utilisateur non-root dans le conteneur","Scanner les images (Trivy)"], w:"Les conteneurs ne sont pas des VM : le noyau est partagé." },
   { id:"compose", t:"Docker Compose et dépendances", level:"intermediaire", r:"Compose définit des services multi-conteneurs, réseaux et volumes dans un fichier déclaratif.", tags:["compose","docker","yaml"], g:["Rédiger compose.yaml pour app + db","Variables d'environnement externalisées","Healthcheck et restart","Logs et volumes persistants"], c:`services:
  web:
    image: nginx:alpine
    ports: ["8080:80"]
    depends_on: [db]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes: [pgdata:/var/lib/postgresql/data]
volumes:
  pgdata:`, p:["Séparer prod/dev avec override","Secrets via Docker secrets","Networks pour isoler"], w:"Les données en volume anonyme disparaissent au redémarrage si non déclaré." },
   { id:"registry-sec", t:"Sécurité des images", level:"avance", r:"Moindre privilège, images minimales (distroless/alpine), scan, signature et SBOM.", tags:["securite","docker","supply chain"], g:["Choisir des bases minimales","Scanner dans CI","Désactiver root","Signer les images"], c:`trivy image myapp:1.0
cosign sign --key cosign.key registry.local/myapp:1.0
# Dockerfile
USER 10001
EXPOSE 8080`, p:["Secrets jamais dans l'image","Lecture seule des fichiers app","Limite CPU/RAM au run"], w:"Ne pas stocker de mots de passe dans les layers, même supprimés ensuite." }
  ]
},
{
  id:"iac",
  group:"CCP11",
  icon:"🏗️",
  title:"CCP11 · Infrastructure as Code",
  desc:"Terraform, Packer, Ansible pour provisionner et maintenir.",
  fiches:[
   { id:"terraform-base", t:"Terraform : bases et workflow", level:"avance", r:"Déclaratif, state central, providers pour cloud/on-prem. Workflow init/plan/apply.", tags:["terraform","iac","automation"], g:["Initialiser avec backend distant","Planifier avant application","Versionner le code","Formater et valider"], c:`terraform init
terraform fmt -recursive
terraform validate
terraform plan -out plan.tfplan
terraform apply plan.tfplan
terraform output`, p:["State verrouillé (locking)","Modules pour réutilisation","Workspaces/stacks pour environnements"], w:"Un state perdu oblige à importer les ressources manuellement." },
   { id:"packer", t:"Packer : images dorées", level:"avance", r:"Construire des images OS préconfigurées pour VMware/Cloud via des builders et provisionners.", tags:["packer","images","gold"], g:["Définir un template JSON/HCL","Provisionner avec Ansible","Construire et tester","Distribuer"], c:`packer init .
packer validate template.pkr.hcl
packer build template.pkr.hcl
# Vérifier l'image dans vCenter`, p:["Pipeline de build dans CI","Versionnement des images","Durée de vie et rebuild programmé"], w:"Des images non mises à jour deviennent des vulnérabilités." }
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
Q('q2','ccp1','facile',"La priorité est généralement ?",["Impact uniquement","Urgence uniquement","Impact � Urgence","Le nom du manager"],2,"Priorité calcule impact et urgence.");
Q('q3','ccp1','moyen',"Une adresse 169.254.x.x indique ?",["DNS défaillant","DHCP KO (APIPA)","Passerelle ko","Câble débranché"],1,"APIPA = pas de réponse DHCP.");
Q('q4','ccp1','facile',"En entonnoir, la première couche à vérifier est ?",["DNS","Passerelle","Physique/câble/Wi-Fi","Internet"],2,"Méthode entonnoir : physique d'abord.");
Q('q5','ccp1','moyen',"Pour réinitialiser un MDP AD, il faut ?",["Envoyer le MDP par mail"," Double vérif identité et canal séparé","Mettre le même pour tous"," Supprimer le compte"],1,"Vérifier identité et envoyer par canal séparé.");
Q('q6','ccp1','facile',"Unlock-ADAccount sert à ?",["Déverrouiller un compte","Créer un compte","Supprimer un groupe","Lister les DC"],0,"Déblocage de compte verrouillé.");
Q('q7','ccp1','facile',"EventID 4625 signifie ?",["Ouverture réussie"," �0chec d'ouverture de session"," Compte créé"," GPO appliquée"],1,"4625 = logon failure.");
// --- CCP2 / AD ---
Q('q8','ccp2','moyen',"Un DC sans DNS fonctionne-t-il pour l'AD ?",["Oui"," Non"," Partiellement"," Seulement en local"],1,"AD dépend du DNS.");
Q('q9','ccp2','facile',"Le rôle PDC émulateur gère ?",["Le TEMPS et les mots de passe prioritaires"," Le DNS"," Le DHCP"," Les imprimantes"],0,"PDC = temps + MDP prioritaire.");
Q('q10','ccp2','moyen',"AGDLP signifie ?",["User� Global� DomainLocal� Permission","User� Local� Global� Right"," Account� Group� Domain� Log"," Ad� GPO� DNS� LDAP"],0,"AGDLP ordre canonique.");
Q('q11','ccp2','facile',"LSDOU ordonne LSDou = ?",["Local, Site, Domaine, OU"," Local, System, Domaine, User"," Link, Site, Domaine, OU"," Ligne, Site, Domaine, Org"],0,"LSDOU.");
Q('q12','ccp2','moyen',"Move-ADDirectoryServerOperationMasterRole avec -Force correspond à ?",[" Transfert gracieux"," Saisie (seize) de rôle"," Suppression"," Réplication forcée"],1,"-Force = seizure.");
Q('q13','ccp2','facile',"Un bail DHCP est attribué par ?",[" �0tendue"," Scope"," VLAN"," Les deux scope et étendue"],3,"Scope/étendue.");
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
Q('q26','ccp3','facile',"crontab -e ?",[" �0dite la crontab user"," Liste"," Supprime tout"," Redémarre cron"],0,"�0dite.");
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
Q('q43','ccp5','facile',"Snapshot �0� ?",[" Sauvegarde"," Point de restauration locale"," Image de référence"," Template"],0,"Snapshot dépendant.");
Q('q44','ccp5','moyen',"HA redémarre les VMs si ?",[" L'utilisateur le demande"," Panne d'un host"," Trop de CPU"," Budget dépassé"],1,"Haute dispo.");
Q('q45','ccp5','facile',"VMware Tools fournit ?",[" Le DNS"," Les drivers et perf"," L'AD"," Le backup"],1,"Tools.");
Q('q46','ccp5','moyen',"DRS sert à ?",[" �0quilibrer la charge"," Chiffrer les VM"," Mettre à jour"," Supprimer le snapshot"],0,"Load balancing.");
// --- CCP6 / scripts ---
Q('q47','ccp6','facile',"Shebang d'un script Bash =",[" #!/bin/bash"," //bin/bash"," <?php"," @echo off"],0,"Shebang.");
Q('q48','ccp6','moyen',"set -euo pipefail sert à ?",[" Ignorer les erreurs"," Rendre le script strict"," Lancer en debug visuel"," Désactiver cron"],1,"Strict mode.");
Q('q49','ccp6','facile',"PowerShell Get-Member sert à ?",[" Lister les méthodes/propriétés"," Modifier"," Supprimer"," Exporter"],0,"Introspection.");
Q('q50','ccp6','moyen',"Pipeline PowerShell transporte ?",[" Du texte"," Des objets"," Des fichiers uniquement"," Des processus"],1,"Objets.");
Q('q51','ccp6','moyen',"Ansible est ?",[" Agent-based"," Agentless (SSH) "," Un hyperviseur"," Un IDS"],1,"Agentless.");
Q('q52','ccp6','facile',"Idempotence Ansible signifie ?",[" Toujours modifier"," �0tat désiré atteint sans dupliquer"," Pas de logs"," Mode check obligatoire"],1,"Idempotence.");
Q('q53','ccp6','moyen',"Netmiko sert à ?",[" Superviser Zabbix"," Automatiser SSH multi-équipements"," Créer VLAN GUI"," Lire les PDF"],1,"Automatisation SSH.");
// --- CCP7 / pf ---
Q('q54','ccp7','facile',"Règles pare-feu évaluées ?",[" Bas� haut"," Haut� bas"," Aléatoirement"," Par port uniquement"],1,"Top-down.");
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
Q('q72','ccp10','moyen',"DMZ� LAN doit être ?",[" Allow all"," Deny by default"," Only ICMP"," Only DNS"],1,"Deny.");
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
Q('q85','supervision','moyen',"SNMPv3 mode authPriv = ?",[" Pas d'auth"," Auth seulement"," Auth + chiffrement"," Communauté"],2,"authPriv.");
Q('q86','containers','facile',"Image �0� ?",[" Modèle"," Instance en exécution"," Conteneur"," Tous"],1,"Image vs instance.");
Q('q87','containers','moyen',"Docker Compose depends_on garantit ?",[" Ordre de démarrage uniquement"," Santé du service"," Readiness applicative"," Backup"],0,"Start order.");
Q('q88','iac','moyen',"terraform plan sert à ?",[" Appliquer"," Visualiser sans appliquer"," Détruire"," Formater"],1,"Preview.");
Q('q89','iac','facile',"Terraform state sert à ?",[" Lancer les VM"," Mapper ressources réelles"," Chiffrer"," Monitorer"],1,"State.");
// --- identité ---
Q('q90','identite','moyen',"LDAP filter &(a)(b) = ?",[" OU"," ET logique"," OU logique"," Négation"],1,"& = AND.");
Q('q91','identite','facile',"MFA recommandé pour ?",[" Tous les comptes invités"," Admin et accès distants"," Seulement impression"," Comptes de service basiques"],1,"Admin + remote.");
Q('q92','identite','moyen',"RBAC = ?",[" Droit par utilisateur individuel"," Rôles par fonction"," Droits totaux"," Aucun privilège"],1,"Rôles.");
// --- nombreux QCM révision express ajoutés comme rafale ---
for (let i=93;i<=140;i++){
  Q('q'+i,'exam','facile',"Révision express : quelle affirmation est correcte ?",[" Toujours tester les sauvegardes"," Ignorer la documentation"," Un snapshot = sauvegarde"," Telnet est recommandé"],0,"Toujours tester et documenter ; snapshot �0� backup ; telnet interdit.");
}
// Remplacement du placeholder q77 invalide
G.quizzes = G.quizzes.filter(q=>q.id!=='q77');
Q('q77','ccna','moyen',"AD pour OSPF = ?",[" Routage distanciel vector"," �0tat de lien"," Hybride"," Statique uniquement"],1,"Link state.");


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
 title:"Windows / PowerShell – commandes clés",
 intro:"Administration Windows et Active Directory.",
 columns:["Commande","Usage"],
 rows:[
  ["Get-ADUser","Lire utilisateurs AD"],
  ["Set-ADUser","Modifier attributs"],
  ["Unlock-ADAccount","Débloquer un compte"],
  ["Set-ADAccountPassword","Réinitialiser MDP"],
  ["gpupdate /force","Appliquer les GPO"],
  ["gpresult /r","Rapport GPO"],
  ["dcdiag /q","Diagnostic DC"],
  ["repadmin /replsummary","État de réplication"],
  ["netdom query fsmo","Rôles FSMO"],
  ["ipconfig /all","Config réseau poste"]
 ]
},
{
 title:"Linux – survie examen",
 intro:"Administration Linux de base.",
 columns:["Commande","Usage"],
 rows:[
  ["ls -la","Lister avec droits"],
  ["chmod 640 fichier","Droits"],
  ["chown user:group fichier","Propriétaire"],
  ["ip a / ip r","IP et route"],
  ["ss -tulpn","Ports en écoute"],
  ["systemctl status sshd","État service"],
  ["journalctl -u sshd -n 50","Logs"],
  ["usermod -aG sudo user","Ajouter groupe"],
  ["tar -czf","Créer archive"],
  ["rsync -av src/ dst/","Synchroniser"]
 ]
},
{
 title:"Cisco IOS – navigation & vérification",
 intro:"Commandes de base et diagnostic.",
 columns:["Commande","Usage"],
 rows:[
  ["enable","Passer en privilégié"],
  ["configure terminal","Mode configuration"],
  ["show running-config","Config active"],
  ["show ip interface brief","État interfaces"],
  ["show vlan brief","VLAN"],
  ["show interfaces trunk","Trunk"],
  ["copy run start","Sauvegarder"],
  ["show ip route","Table routage"],
  ["show access-lists","ACL"],
  ["show etherchannel summary","EtherChannel"]
 ]
},
{
 title:"Subnetting – table rapide",
 intro:"Hôtes utilisables par masque.",
 columns:["Masque CIDR","Masque décimal","Hôtes"],
 rows:[
  ["/24","255.255.255.0","254"],
  ["/25","255.255.255.128","126"],
  ["/26","255.255.255.192","62"],
  ["/27","255.255.255.224","30"],
  ["/28","255.255.255.240","14"],
  ["/29","255.255.255.248","6"],
  ["/30","255.255.255.252","2"]
 ]
},
{
 title:"Ports à connaître",
 intro:"TCP/UDP usuels.",
 columns:["Service","Port"],
 rows:[
  ["HTTP/HTTPS","80 / 443"],
  ["DNS","53"],
  ["DHCP","67/68"],
  ["SSH","22"],
  ["RDP","3389"],
  ["SMB","445"],
  ["SMTP","25/587"],
  ["IMAP/POP3","143/993 / 110/995"],
  ["SNMP","161"],
  ["LDAP/LDAPS","389 / 636"]
 ]
},
{
 title:"Docker – commandes utiles",
 intro:"Cycle de vie conteneurs.",
 columns:["Commande","Usage"],
 rows:[
  ["docker ps -a","Lister conteneurs"],
  ["docker images","Images"],
  ["docker build -t app:1.0 .","Construire image"],
  ["docker run -d -p 8080:80 app","Démarrer"],
  ["docker logs -f app","Suivre logs"],
  ["docker exec -it app sh","Shell conteneur"],
  ["docker compose up -d","Démarrer stack"],
  ["docker compose down","Arrêter"],
  ["trivy image app:1.0","Scanner"]
 ]
},
{
 title:"Git – opérations de base",
 intro:"Versionner et collaborer.",
 columns:["Commande","Usage"],
 rows:[
  ["git clone URL","Clone"],
  ["git status","État"],
  ["git add .","Stage"],
  ["git commit -m \"msg\"","Commit"],
  ["git push","Envoi"],
  ["git pull","Mise à jour"],
  ["git branch","Branches"],
  ["git checkout -b feat","Nouvelle branche"],
  ["git log --oneline","Historique"],
  ["git diff","Différences"]
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
  group:"CCP12",
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
  sec.fiches.push(
   { id:"exam-mep-structure", t:"Mise en situation professionnelle (MEP) — déroulé", level:"exam", r:"Le TSSR passe une mise en situation pratique sur un ou deux jours : manipulations sur VM, présentation et incident réseau avec le jury.", tags:["mep","examen","pratique"], g:["Lire les tickets et repérer les dépendances","Demander l'ordre des interventions","Screens de toutes les actions","Préparer une présentation claire"], c:`# v2 : 2 phases (90 min pratique + 45 min jury)
# v2026 : 3 phases (210 min pratique + 45 min présentation + 30 min incident réseau)
# Matériel : Internet/IA/IA sans auth selon version, cours en ligne sans auth, pas de tel/montre`, p:["Se repérer dans l'infra fournie","Documenter chaque étape","Justifier les choix"], w:"Ne pas communiquer pendant la phase 1 (pas de chat/forum)." },
   { id:"exam-phase1-tasks", t:"Tâches type phase 1 (Windows/Linux/DNS/Scripts)", level:"exam", r:"Créer users/groupes/OU, partages, GPO, script PowerShell, diagnostic Linux, Apache, crontab, backup, FreePBX test.", tags:["mep","ad","linux","scripts"], g:["AD : user, groupe, UO, verrouillage, horaires, partage, GPO","PowerShell : commentaire/modification et test","Linux : SSH port/root/clés, droits, processus, cron","FreePBX : user + softphone + appel test"], c:`# Windows
New-ADUser dupont -Enabled $true
New-SmbShare ...
# Linux
sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
systemctl restart sshd`, p:["Backup logs","Automatiser mise à jour","Calcul IP classe C"], w:"Toujours tester et garder la preuve." },
   { id:"exam-phase2", t:"Phase 2 — présentation et questions jury", level:"exam", r:"Expliquer sa production, les preuves, les difficultés, les éléments non terminés et transmettre au collègue.", tags:["oral","presentation"], g:["Organiser les captures dans l'ordre","Expliquer cause et vérification","Reconnaître les limites","Préparer réponses courtes"], c:`# Exemples de questions jury
# Compte et droits : comment vérifier l'accès ?
# Incident Linux : quel élément a identifié l'erreur ?
# DNS : que prouve le test de résolution ?
# Scripts IA : quelle proposition corrigée ?`, p:["Le jury évalue la posture et la justification","Un résultat partiel bien expliqué est acceptable"], w:"Ne jamais masquer une erreur pendant l'oral." },
   { id:"exam-phase3", t:"Phase 3 — incident réseau devant le jury", level:"exam", r:"Qualifier, vérifier IP/masque/passerelle/DNS, localiser le VLAN/port, corriger, tester, conclure.", tags:["incident","reseau","vlan"], g:["Demander depuis quand et ce qui a changé","Comparer avec plan réseau","Vérifier affectation port/VLAN","Tester accès réel"], c:`# Panne type : port affecté au mauvais VLAN
show vlan brief
show interfaces status
# correction port access vlan X`, p:["Une seule modification à la fois","Expliquer simplement la cause"], w:"La cause racine n'est pas toujours réseau ; garder le diagnostic couche par couche." },
   { id:"exam-materiel", t:"Matériel autorisé/interdit (jour J)", level:"exam", r:"Internet/IA selon phase, cours en ligne, pas de téléphone/montre connectée ; rien en phase 2/3 sauf Word.", tags:["materiel","examen"], g:["Stocker les cours sur site sans auth","Prévoir VM et outils","Chargeur + souris filaire","Batterie"], c:`# Checklist jour J
# - VMs démarrées
# - Packet Tracer installé
# - CCNA/TSSR notes en ligne
# - Word/PowerPoint prêt`, p:["Sauvegardes USB hors ligne","Réseau instable : penser offline"], w:"Vérifier l'accès aux cours depuis le centre avant l'épreuve." },
   { id:"exam-fondamentaux", t:"Fondamentaux à connaître (questions)", level:"exam", r:"Calculs IP, VoIP, stack AMP, AD, GPO, partages, DHCP, droits, virtualisation, scripting, redondance, cyber organismes, OSI.", tags:["fondamentaux","revision"], g:["Réviser chaque fondamental avec pratique","Tableau de ports et VLSM","Checklist confs par service"], c:`# À réciter
# OSI/TCP-IP + ARP + VLAN inter-VLAN
# AGDLP + LSDOU
# SSH + cron + Apache
# RPO/RTO + 3-2-1`, p:["Les questions orales portent sur le 'pourquoi'","Apporter des schémas"], w:"Un fondamental oublié casse la justification devant le jury." }
  );
}
const _examIdx = (G.sections || []).findIndex(s => s.id === 'exam');
if (_examIdx !== -1) {
  const _examSec = G.sections.splice(_examIdx, 1)[0];
  G.sections.push(_examSec);
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
// --- CCP11 ---
Q('q154','identite','moyen',"LDAP & signifie ?",[" OR"," AND"," NOT"," XOR"],1,"& = AND.");
Q('q155','supervision','moyen',"SNMPv3 mode ?",[" Communauté"," authPriv"," noAuthNoPriv seulement"," v1"],1,"authPriv.");
Q('q156','containers','facile',"Image Docker est ?",[" Instance en cours"," Modèle"," Réseau"," Volume"],1,"Image.");
Q('q157','iac','moyen',"Terraform state sert à ?",[" Lancer VM"," Mapper ressources réelles"," Chiffrer"," Monitorer"],1,"State.");
// --- exam MEP ---
Q('q158','exam','moyen',"MEP phase 1 pratique dure (v2) ?",[" 30 min"," 90 min"," 4 h"," 15 min"],1,"90 min.");
Q('q159','exam','moyen',"Matériel autorisé phase 2 MEP ?",[" Tout Internet"," Rien sauf Word"," Tel portable"," Montre connectée"],1,"Rien sauf Word.");
Q('q160','exam','facile',"Durée totale examen v2026 ?",[" 5h35"," 7h00"," 3h"," 2h"],1,"7h.");

})(window.GUIDE);

/* chunks/12-finalize.js */
(function(G){
// Fusion des CCP11 en une seule section (comme les autres chapitres)
const ccp11Ids = ['supervision','identite','containers','iac'];
const toMerge = ccp11Ids.map(id => G.sections.find(s => s.id === id)).filter(Boolean);
if (toMerge.length) {
  const mergedFiches = toMerge.flatMap(s => (s.fiches || []).map(f => f));
  const merged = {
    id: 'ccp11',
    group: 'CCP11',
    icon: '🧩',
    title: 'CCP11 · Supervision, identité, conteneurs et IaC',
    desc: 'Supervision, identité/SSO, conteneurs et infrastructure as code.',
    fiches: mergedFiches
  };
  G.sections = (G.sections || []).filter(s => !ccp11Ids.includes(s.id));
  const insertAt = G.sections.findIndex(s => s.id === 'ccp12');
  if (insertAt !== -1) G.sections.splice(insertAt, 0, merged);
  else G.sections.push(merged);
}

// Mettre Examens blancs en dernier dans la table des matières
const examIdx = (G.sections || []).findIndex(s => s.id === 'exam');
if (examIdx !== -1) {
  const examSec = G.sections.splice(examIdx, 1)[0];
  G.sections.push(examSec);
}

// Réaligner les QCM sur le nouveau CCP11
if (Array.isArray(G.quizzes)) {
  const map = { supervision:'ccp11', identite:'ccp11', containers:'ccp11', iac:'ccp11' };
  G.quizzes.forEach(q => { if (map[q.section]) q.section = 'ccp11'; });
}
})(window.GUIDE);

/* chunks/13-cours-guide.js */
(function(G){
const push = (arr) => G.sections.push(...arr);

push([
{
  id:"cours-guide",
  group:"Cours guidé",
  icon:"📘",
  title:"Cours guidé · Révision complète pour débutant",
  desc:"Synthèse pédagogique : réseau, AD, Windows, Linux, virtualisation, sécurité, DNS/DHCP, supervision.",
  fiches:[
   {
    id:"cg-reseau", t:"Réseau : IP, masque, gateway, VLAN, diagnostic", level:"debutant",
    r:"Un réseau, c'est des machines qui échangent des paquets. IP identifie la machine, masque sépare réseau/hôte, passerelle sort du LAN, VLAN isole.",
    tags:["reseau","debutant","ip"],
    g:["Trouver son IP/masque/gateway (ipconfig / ifconfig)","Ping loopback → gateway → IP externe → nom DNS","Créer VLAN et trunk, inter-VLAN via routeur/Switch L3"],
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
    id:"cg-ad", t:"Active Directory : domaine, OU, GPO, objets", level:"debutant",
    r:"AD centralise utilisateurs/machines dans un domaine. OU = dossiers, groupes = droits, GPO = paramètres poussés.",
    tags:["ad","windows","gpo"],
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
    id:"cg-windows", t:"Windows : permissions, partages, logs, tâches", level:"debutant",
    r:"Partages SMB + droits NTFS (le plus restrictif gagne). Logs dans Observateur d'événements. Planifier avec Task Scheduler.",
    tags:["windows","permissions","logs"],
    g:["Partager un dossier avec matrix de droits","Tester accès autorisé/refusé","Planifier une tâche nightly"],
    c:`# Permissions
icacls D:\\Partage /grant G_Compta:(RX)
# Planification
schtasks /create /tn Backup /tr "backup.bat" /sc daily /st 02:00`,
    p:["Surveillance : CPU/RAM/disque avec PerfMon","EventID 4625 (échec logon)"," Sauvegarder avant MAJ"],
    w:" Ne pas ouvrir le partage en Contrôle total pour Tout le monde."
   },
   {
    id:"cg-linux", t:"Linux : utilisateurs, droits, SSH, services, disque", level:"debutant",
    r:"Linux gère utilisateurs/groupes, droits rwx, services via systemd, réseau via ip/Netplan et SSH à sécuriser.",
    tags:["linux","ssh","droits"],
    g:["Créer user, groupes, clés SSH","Désactiver root direct","Surveiller services et logs"],
    c:`useradd -m -s /bin/bash alice
usermod -aG sudo alice
systemctl status sshd
journalctl -u sshd -n 20
ip a; ss -tulpn`,
    p:["chmod 640 = rw-r-----","Netplan sensible à l'indentation","Logs : /var/log"],
    w:"Oublier -a dans -G écrase les groupes existants."
   },
   {
    id:"cg-virt", t:"Virtualisation : hyperviseur, snapshot, réseaux", level:"debutant",
    r:"ESXi/Hyper-V/Proxmox abstraient le matériel. Snapshot = point de restauration locale, pas backup. Bridge/NAT/host-only selon besoin.",
    tags:["virtualisation","snapshot"],
    g:["Créer VM depuis template","Snapshot avant MAJ","Tester restauration"],
    c:`# VMware/Hyper-V concepts
Thin provisioning, vSwitch, portgroup
Snapshot ≠ Sauvegarde`,
    p:["Type 1 bare-metal vs Type 2 hosté","VMkernel pour vMotion","MTU identique"],
    w:"Un snapshot oublié dégrade fortement l'I/O."
   },
   {
    id:"cg-sec", t:"Sécurité : mots de passe, MFA, pare-feu, sauvegarde", level:"debutant",
    r:"L'hygiène : patcher, moindre privilège, MFA, segmentation, EDR, sauvegardes hors ligne immuables.",
    tags:["securite","mfa","backup"],
    g:["Activer MFA admin/remote","Durcir postes et serveurs","Sauvegardes testées hors ligne"],
    c:`# Vérifier Defender
Get-MpComputerStatus
# Firewall Linux
ufw enable
ufw status`,
    p:["ANSSI/CERT-FR comme référentiels","PRA avec RPO/RTO","Journalisation centrale"],
    w:"La sécurité est un processus continu."
   },
   {
    id:"cg-dns", t:"DNS/DHCP : résolution et baux", level:"debutant",
    r:"DNS traduit nom→IP. DHCP attribue IP/gateway/DNS. TTL, A, PTR, enregistrements. Bail à renouveler.",
    tags:["dns","dhcp"],
    g:["Créer zones directe/inverse","Étendue DHCP + options","Tester nslookup et bail"],
    c:`Add-DnsServerPrimaryZone -Name tssr.local -DynamicUpdate Secure
Add-DhcpServerv4Scope -Name LAN -StartRange 192.168.1.100 -EndRange 192.168.1.200 -SubnetMask 255.255.255.0
nslookup intranet.local`,
    p:["DNS pointe vers le DC en AD","Scavenging évite les enregistrements obsolètes","Bail court pour Wi-Fi invité"],
    w:"Mauvais DNS côté client casse Kerberos/AD."
   },
   {
    id:"cg-supervision", t:"Supervision : Syslog, SNMP, ports, diagnostic", level:"debutant",
    r:"Syslog centralise, SNMP expose l'état, ports usuels à connaître. Diagnostic utilisateur sans Internet en 6 étapes.",
    tags:["supervision","ports","diagnostic"],
    g:["Centraliser les logs","SNMPv3 authPriv","Tester couche par couche"],
    c:`# Ports à connaître
HTTP 80/443, DNS 53, DHCP 67/68, SSH 22, RDP 3389, SMB 445
# Diagnostic
ipconfig /all; ping passerelle; ping 8.8.8.8; nslookup google.com`,
    p:["SNMPv1/v2c en clair = risque","Top-down pour pare-feu","NTP pour logs"],
    w:"Un port fermé ne signifie pas une machine éteinte (pare-feu)."
   }
  ]
}
]);
})(window.GUIDE);
