const G = window.GUIDE;
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