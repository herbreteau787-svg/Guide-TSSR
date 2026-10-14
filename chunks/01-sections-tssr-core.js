const G = window.GUIDE;
G.sections = G.sections || [];
G.meta = { title: "Guide TSSR + CCNA", edition: "Maximale 2026", repo: "herbreteau787-svg/Guide-TSSR" };

const push = (arr) => G.sections.push(...arr);

push([
{
  id:"ccp1",
  group:"TSSR",
  icon:"ðŸŽ«",
  title:"CCP1 Â· Support, service desk & utilisateurs",
  desc:"MÃ©thodes ITIL, ticketing, diagnostic poste, comptes, communication client.",
  fiches:[
   {
    id:"ccp1-tickets", t:"Cycle de vie d'un ticket (incident/problÃ¨me/demande)", level:"debutant",
    r:"Incident = service dÃ©gradÃ© Ã  rÃ©tablir vite. ProblÃ¨me = cause racine Ã  Ã©liminer. Demande = besoin prÃ©vu. PrioritÃ© = Impact Ã— Urgence Ã— CriticitÃ©.",
    tags:["itil","glpi","ticket","sla"],
    g:["Identifier le service impactÃ© et la criticitÃ© mÃ©tier","CrÃ©er le ticket dans GLPI/iTop avec catÃ©gories et impact","Qualifier : utilisateur, poste, site, heure de dÃ©but","Assigner, documenter chaque action horodatÃ©e","ClÃ´turer avec validation utilisateur + base de connaissances"],
    c:`# Diagnostic rapide d'un poste
ipconfig /all
ping 8.8.8.8
ping intranet.local
nslookup intranet.local
Get-Service | Where Status -eq Stopped`,
    p:["P1 critique 4h, P2 8h, P3 24h, P4 72h (adapter au SLA signÃ©)","Escalade N2/N3 si hors pÃ©rimÃ¨tre ou Ã©chÃ©ance dÃ©passÃ©e","On ne ferme un ticket qu'aprÃ¨s validation rÃ©elle et sans contournement cachÃ©"],
    w:"Reformuler en langage simple ; jamais de jargon face Ã  l'utilisateur. Un ticket flou = un incident mal routÃ©."
   },
   {
    id:"ccp1-poste", t:"Diagnostic rÃ©seau d'un poste (mÃ©thode entonnoir)", level:"debutant",
    r:"Physique â†’ IP â†’ passerelle â†’ DNS â†’ Internet. Tester couche par couche sans sauter d'Ã©tapes.",
    tags:["reseau","poste","ipconfig","dns"],
    g:["VÃ©rifier voyant carte + cÃ¢ble, Wi-Fi activÃ©, profil PrivÃ©/Public","Centre RÃ©seau et partage : IP, passerelle, DNS","Tester navigation et accÃ¨s au partage","Purger le cache si le nom Ã©choue"],
    c:`ipconfig /all
ping 192.168.1.1
ping 8.8.8.8
nslookup google.com
tracert google.com
ipconfig /release
ipconfig /renew
ipconfig /flushdns
Test-NetConnection google.com -Port 443`,
    p:["169.254.x.x = APIPA â†’ DHCP KO ou pas de rÃ©ponse serveur","Ping OK par IP mais KO par nom = DNS KO","Tracert s'arrÃªte Ã  la passerelle = problÃ¨me routage amont"],
    w:"Ne jamais remettre une IP manuelle sans documenter ; cela masque le vrai dÃ©faut DHCP."
   },
   {
    id:"ccp1-comptes", t:"Compte AD : dÃ©blocage et reset mot de passe", level:"debutant",
    r:"VÃ©rifier l'identitÃ© avant toute rÃ©initialisation. Forcer le changement Ã  la prochaine ouverture. Canal sÃ©parÃ© pour le mot de passe.",
    tags:["ad","mot de passe","securite","compte"],
    g:["ADUC (dsa.msc) â†’ Users â†’ clic droit sur l'utilisateur","Compte : dÃ©cocher VerrouillÃ© / RÃ©initialiser le mot de passe","Cocher 'Doit changer le mot de passe Ã  la prochaine ouverture'","PrÃ©venir par canal sÃ©parÃ© (tÃ©lÃ©phone) et documenter"],
    c:`Set-ADAccountPassword -Identity jdupont -Reset -NewPassword (ConvertTo-SecureString 'Temp2026!' -AsPlainText -Force)
Set-ADUser -Identity jdupont -ChangePasswordAtLogon $true
Unlock-ADAccount -Identity jdupont
Get-ADUser jdupont -Properties LockedOut, Enabled, PasswordExpired`,
    p:["Double vÃ©rification d'identitÃ© : badge + manager ou question confidentielle","Mots de passe temporaires : 12+ car., maj/min/chiffre/spÃ©cial","Un compte verrouillÃ© en boucle = forcer sa dÃ©connexion partout"],
    w:"Ne jamais envoyer le mot de passe dans le mÃªme canal que l'identifiant. Les groupes d'accÃ¨s doivent rester inchangÃ©s lors d'un reset."
   },
   {
    id:"ccp1-evenements", t:"Journaux Windows et observation systÃ¨me", level:"intermediaire",
    r:"Les journaux Application/SÃ©curitÃ©/SystÃ¨me + PowerShell Get-EventLog sont la mÃ©moire de la machine. Toujours croiser codes d'Ã©vÃ©nement avec la KB.",
    tags:["windows","logs","event","diagnostic"],
    g:["Ouvrir eventvwr.msc ; filtrer par niveau Erreur/Critique","Identifier l'EventID et la source exacte","Rechercher l'ID officiel Microsoft","Tester la correction et noter dans le ticket"],
    c:`Get-WinEvent -LogName System -MaxEvents 30 | Select TimeCreated, Id, ProviderName, Message
Get-EventLog -LogName Application -EntryType Error -Newest 20
# Filtrer un ID prÃ©cis :
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} | Select TimeCreated, Message -First 10`,
    p:["4625 = Ã©chec d'ouverture de session ; 4740 = verrouillage de compte","Les journaux sont tournants : augmenter la taille si audit avancÃ©","Exporter en EVTX avant une rÃ©installation"],
    w:"L'absence d'erreur dans les journaux n'exclut pas un problÃ¨me rÃ©seau ou applicatif."
   },
   {
    id:"ccp1-wsus", t:"Mises Ã  jour : WSUS et stratÃ©gie de patch", level:"intermediaire",
    r:"SÃ©paration anneaux (pilote/production), fenÃªtre de maintenance, rollback documentÃ©.",
    tags:["wsus","patch","windows","gpo"],
    g:["Console WSUS : approuver pour le groupe pilote d'abord","Surveiller la conformitÃ© et les Ã©checs","GPO : Configure Automatic Updates + intranet Microsoft update service","Planifier redÃ©marrage hors heures creuses"],
    c:`wsusutil.exe checkhealth
wuauclt /detectnow /updatenow
Get-WindowsUpdateLog
# PowerShell module PSWindowsUpdate :
Install-Module PSWindowsUpdate -Force
Get-WUList | Select Title, Size
Install-WUUpdates -AcceptAll -AutoReboot`,
    p:["Gardiens : serveurs d'abord puis postes","KB critiques de sÃ©curitÃ© prioritaires","Garder 1-2 snapshots avant mise Ã  jour majeure"],
    w:"Les mises Ã  jour WSUS ne couvrent que les produits Microsoft ; les applicatifs tiers nÃ©cessitent un outil dÃ©diÃ©."
   },
   {
    id:"ccp1-outils", t:"Outils de support et communication", level:"debutant",
    r:"Un bon support = diagnostic structurÃ© + Ã©coute active + trajectoire claire pour l'utilisateur.",
    tags:["support","communication","relation client"],
    g:["Accueil : identifier, reformuler le besoin, rassurer","Expliquer ce qui va Ãªtre fait et le dÃ©lai","Point de contact unique atÃ© la clÃ´ture","ComplÃ©ter la base de connaissances"],
    c:`# Grilles d'entretien (extrait)
# 1. Quoi ? 2. Depuis quand ? 3. Pour qui ? 4. Impact ?
# 5. Changement rÃ©cent ? 6. Reproductible ?
# Rappel final : "Je vous rappelle avant 17h avec la solution ou une escalade."`,
    p:["Ne jamais promettre l'impossible : dÃ©pendances fournisseurs externes","Utiliser des gabarits de mail pour la cohÃ©rence","DurÃ©e moyenne de rÃ©solution Ã  suivre an par mois"],
    w:"Le silence crÃ©e l'angoisse ; un statut intermÃ©diaire est toujours mieux."
   }
  ]
},
{
  id:"ccp2",
  group:"TSSR",
  icon:"ðŸªŸ",
  title:"CCP2 Â· Windows Server & Active Directory",
  desc:"Installation, AD DS, DNS, DHCP, GPO, FSMO, jonction domaine.",
  fiches:[
   {
    id:"ccp2-adinstall", t:"Installer AD DS et crÃ©er une forÃªt", level:"intermediaire",
    r:"Un DC = ADDS + DNS + heure synchronisÃ©e. PrÃ©voir 2 contrÃ´leurs minimum pour la rÃ©silience et la rÃ©plication.",
    tags:["ad","windows server","dns","dsrm"],
    g:["Gestionnaire de serveur > Ajouter rÃ´les : AD DS + DNS","Promouvoir en contrÃ´leur : nouvelle forÃªt ex. tssr.local","DÃ©finir mot de passe DSRM et niveau fonctionnel","VÃ©rifier DNS, Sites et services, rÃ©plication"],
    c:`Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
Install-ADDSForest -DomainName tssr.local -InstallDns -DomainNetbiosName TSSR
Get-ADDomainController
dcdiag /q /s:DC1`,
    p:["NetBIOS <=15 caractÃ¨res","Niveau fonctionnel le plus haut compatible avec les plus vieux DC","NTP : l'Ã©mulateur PDC est la source de temps de la forÃªt"],
    w:"Jamais un seul DC en production. Toujours tester la restauration AD avant le premier incident."
   },
   {
    id:"ccp2-fsmo", t:"Les 5 rÃ´les FSMO", level:"intermediaire",
    r:"ForÃªt : SchÃ©ma + Nom de domaine. Domaine : PDCe, RID, Infrastructure. Chaque rÃ´le a une fonction prÃ©cise.",
    tags:["fsmo","ad","roles"],
    g:["ADUC : voir MaÃ®tres d'opÃ©rations (RID/PDC/Infrastructure)","Domaines et approbations : maÃ®tre nom de domaine","SchÃ©ma : regsvr32 schmmgmt puis console du schÃ©ma"],
    c:`netdom query fsmo
Move-ADDirectoryServerOperationMasterRole -Identity DC2 -OperationMasterRole PDCEmulator,RIDMaster -Force
Get-ADForest | Select SchemaMaster,DomainNamingMaster
Get-ADDomain | Select PDCEmulator,RIDMaster,InfrastructureMaster`,
    p:["PDC = temps, verrouillage et mot de passe prioritaires","Transfert gracieux si le DC est disponible, saisie (seize) si panne","Documenter l'emplacement des rÃ´les dans la matrice d'infrastructure"],
    w:"DÃ©placer les rÃ´les sans planification peut perturber la rÃ©plication et le temps Kerberos."
   },
   {
    id:"ccp2-agdlp", t:"Groupes AGDLP et GPO", level:"intermediaire",
    r:"AGDLP : User â†’ Global â†’ DomainLocal â†’ Permission. GPO : Ordinateur vs Utilisateur selon LSDOU (Local, Site, Domaine, OU).",
    tags:["groupes","gpo","permissions","ad"],
    g:["ADUC : crÃ©er OU puis groupes Global (mÃ©tier) et DomainLocal (ressource)","Partage : ajouter le groupe LD en autorisation NTFS/Partage","GPMC : lier GPO Ã  OU, filtrer par groupe de sÃ©curitÃ©","Tester : gpupdate /force puis gpresult /r"],
    c:`New-ADGroup -Name G_Compta -GroupScope Global -GroupCategory Security
New-ADGroup -Name LD_PartageCompta -GroupScope DomainLocal -GroupCategory Security
Add-ADGroupMember -Identity LD_PartageCompta -Members G_Compta
gpupdate /force
gpresult /r | Out-File C:\\temp\\gpo.txt`,
    p:["Bouclage de stratÃ©gie pour les sessions RDS","Permissions NTFS + Partage : la plus restrictive gagne","Toujours tester sur un poste pilote avec gpresult /h rapport.html"],
    w:"Ajouter un utilisateur directement au groupe DomainLocal contourne la mÃ©thode AGDLP et complique les audits."
   },
   {
    id:"ccp2-dnsdhcp", t:"DNS et DHCP Windows Server", level:"intermediaire",
    r:"DNS AD intÃ©grÃ© avec zones directes/inverses et dynamic DNS sÃ©curisÃ©. DHCP : Ã©tendue, options, rÃ©servations, bascule.",
    tags:["dns","dhcp","windows server"],
    g:["DNS : crÃ©er zones directe tssr.local et inverse, activer scavenging","DHCP : nouvelle Ã©tendue avec masque, passerelle (003), DNS (006)","RÃ©servation par MAC pour imprimantes/serveurs","Sauvegarder et rÃ©pliquer la configuration"],
    c:`Add-DnsServerPrimaryZone -Name tssr.local -ZoneFile tssr.local.dns -DynamicUpdate Secure
Add-DhcpServerv4Scope -Name LAN -StartRange 192.168.1.100 -EndRange 192.168.1.200 -SubnetMask 255.255.255.0
Set-DhcpServerv4OptionValue -Router 192.168.1.1 -DnsServer 192.168.1.10
Add-DhcpServerv4Reservation -ScopeId 192.168.1.0 -IPAddress 192.168.1.50 -ClientId 00-11-22-33-44-55
Get-DhcpServerv4Lease -ScopeId 192.168.1.0`,
    p:["Bail court pour Wi-Fi invitÃ©s, normal pour LAN","Mettre en place une bascule DHCP (failover) pour la continuitÃ©","RÃ©server les adresses serveurs hors Ã©tendue"],
    w:"Un serveur AD doit utiliser son propre DNS ; pointer ailleurs casse Kerberos."
   },
   {
    id:"ccp2-join", t:"Joindre un poste au domaine", level:"debutant",
    r:"Le DNS du poste doit pointer vers le DC. Compte administrateur domaine requis. Horloge <5 minutes d'Ã©cart.",
    tags:["domaine","poste","join","dns"],
    g:["Renommer le PC selon convention","AccÃ¨s professionnel/Ã©tablissement > Joindre le domaine","Entrer admin domaine puis redÃ©marrer","Ouvrir session domaine et vÃ©rifier application des GPO"],
    c:`Rename-Computer -NewName PC-012 -Restart
Add-Computer -DomainName tssr.local -Credential (Get-Credential) -Restart
Test-ComputerSecureChannel
nltest /dsgetdc:tssr.local
gpresult /r`,
    p:["Supprimer l'ancien compte ordinateur en cas de doublon","VÃ©rifier l'OU de destination via GPO de jonction","Garder le compte local admin en secours"],
    w:"Jonction rÃ©ussie mais GPO absentes = vÃ©rifier DNS et emplacement de l'ordinateur dans l'AD."
   },
   {
    id:"ccp2-repl", t:"RÃ©plication AD et diagnostic", level:"avance",
    r:"Multi-DC = rÃ©plication toutes les 15 s (intra-site) et planifiÃ©e inter-site. Les Ã©checs laissent des objets incohÃ©rents.",
    tags:["ad","repliation","dcdiag","sites"],
    g:["Sites et services AD : vÃ©rifier liens inter-sites, coÃ»t et horaires","Forcer la rÃ©plication depuis DC1 vers DC2","Surveiller le backlog et les conflits d'attributs","Documenter la topologie dans le dossier pro"],
    c:`repadmin /showrepl
repadmin /syncall /AdeP
repadmin /replsummary
dcdiag /test:replications /s:DC1
Get-ADReplicationPartnerMetadata -Target DC1`,
    p:["USN rollback possible aprÃ¨s restauration VM non AutoritÃ©","KCC recalcule automatiquement les connexions","Un partenariat d'origine unique suffit dans la plupart des sites"],
    w:"Restaurer un DC depuis un snapshot sans sauvegarde AD autoritÃ© peut crÃ©er une divergence irrÃ©versible."
   },
   {
    id:"ccp2-file", t:"Serveur de fichiers, partages et DFS", level:"intermediaire",
    r:"Partages SMB avec permissions NTFS + partage, quotas FSRM, DFS-N pour l'abstraction et la haute disponibilitÃ©.",
    tags:["fichiers","smb","dfs","fsrm","partages"],
    g:["CrÃ©er dossiers avec structure par service","DÃ©finir permissions NTFS selon AGDLP","CrÃ©er partage avec \\serveur\\ressource","Mettre en place DFS-N et espaces de noms"],
    c:`New-SmbShare -Name Compta -Path D:\\Shares\\Compta -FullAccess "TSSR\\LD_PartageCompta"
Grant-SmbShareAccess -Name Compta -AccountName "TSSR\\G_Compta" -AccessRight Change
Get-SmbShare
# DFS
New-DfsnRoot -Path \\\\tssr.local\\partages -TargetPath \\\\DC1\\partages -Type DomainV2
dfsutil /addftroot:domain`,
    p:["Indexation et recherche par Windows Search sur serveur de fichiers","FSRM : quotas par dossier et filtrage d'extensions (ransomware)","Sauvegarder les listes ACL exportÃ©es"],
    w:"La suppression d'un partage n'efface pas les fichiers; vÃ©rifier les permissions minimales."
   },
   {
    id:"ccp2-print", t:"Serveur d'impression et dÃ©ploiement GPO", level:"debutant",
    r:"Centraliser les files d'attente et dÃ©ployer les imprimantes par OU ou groupe avec GPO.",
    tags:["impression","gpo","printer"],
    g:["Ajouter le rÃ´le Impression et documents","Installer le pilote signÃ© x64 et x86","CrÃ©er la file d'attente par imprimante","DÃ©ployer via GPO Computers/Users"],
    c:`Install-WindowsFeature Print-Services
Add-Printer -Name "Impr-Compta" -DriverName "HP Universal PCL6" -PortName "IP_192.168.1.50"
# DÃ©ploiement GPO cÃ´tÃ© utilisateur
Set-GPRegistryValue -Name "Deploiement Imprimantes" -Key "HKCU\\Software\\..."`,
    p:["Pilotes PCL vs PS selon l'Ã©quipement","DÃ©sactiver l'impression directe pour les postes via GPO","Surveiller les files bloquÃ©es (spouleur)"],
    w:"La spooler.exe bloquÃ©e se rÃ©pare souvent en vidant SPOOL\\PRINTERS puis en redÃ©marrant le service."
   },
   {
    id:"ccp2-powershell", t:"Administration AD en PowerShell", level:"intermediaire",
    r:"Le module ActiveDirectory expose une API complÃ¨te. PrÃ©fÃ©rer les cmdlets aux clics pour tracer et automatiser.",
    tags:["powershell","ad","automatisation"],
    g:["Importer le module sur un poste admin","Lire avant d'Ã©crire (Get- avant Set-)","Tester sur un objet pilote","Exporter les rÃ©sultats pour audit"],
    c:`Import-Module ActiveDirectory
Get-ADUser -Filter "Enabled -eq 'True'" -Properties LastLogonDate | Select Name, SamAccountName, LastLogonDate
New-ADUser -Name "Jean Martin" -SamAccountName jmartin -Enabled $true -Path "OU=Users,DC=tssr,DC=local"
Disable-ADAccount -Identity jmartin
Search-ADAccount -LockedOut | Unlock-ADAccount`,
    p:["Lecture/export rÃ©gulier des utilisateurs inactifs","Utiliser try/catch et -ErrorAction Stop dans les scripts","Minimiser les droits du compte de service"],
    w:"Les cmdlets AD s'exÃ©cutent par dÃ©faut contre le DC le plus proche ; forcer avec -Server si besoin."
   }
  ]
}
]);

push([
{
  id:"ccp3",
  group:"TSSR",
  icon:"ðŸ§",
  title:"CCP3 Â· Linux ( Debian/Ubuntu/RHEL )",
  desc:"Base systÃ¨me, utilisateurs, services, rÃ©seau, paquets, supervision locale.",
  fiches:[
   {
    id:"ccp3-base", t:"Base Linux : arborescence et configuration", level:"debutant",
    r:"/etc pour la config, /var/log pour les logs, /home pour les utilisateurs, /opt pour les applications tierces. Toujours lire avant d'Ã©diter.",
    tags:["linux","fichiers","base"],
    g:["Terminal ou Explorateur GNOME pour parcourir","Ã‰diter avec nano/vim les fichiers sous /etc","VÃ©rifier l'OS et la version","Tester la modification et redÃ©marrer le service dÃ©pendant"],
    c:`ls -la /etc/*.conf
cat /etc/os-release
cat /etc/passwd | cut -d: -f1
cat /etc/hosts
cat /etc/resolv.conf
chmod 640 fichier
chown user:group fichier
find /var/log -type f -size +10M`,
    p:["/etc/passwd liste les utilisateurs, /etc/shadow les hash","/etc/fstab monte les systÃ¨mes au boot","chmod r=4, w=2, x=1 ; Ã©viter 777"],
    w:"Ne jamais chmod 777 sur un fichier sensible ; prÃ©fÃ©rer les ACL POSIX (setfacl)."
   },
   {
    id:"ccp3-users", t:"Utilisateurs, groupes et sudo", level:"debutant",
    r:"useradd/usermod, groupes secondaires avec -aG (sinon Ã©crasement), sudo pour la dÃ©lÃ©gation.",
    tags:["linux","users","sudo"],
    g:["ParamÃ¨tres > Utilisateurs pour l'approche GUI","VÃ©rifier l'appartenance aux groupes","Cockpit (port 9090) si installÃ© pour gÃ©rer Ã  distance","Journaliser les Ã©lÃ©vations (sudo.log)"],
    c:`useradd -m -s /bin/bash jdupont
passwd jdupont
usermod -aG sudo,adm jdupont
id jdupont
groups jdupont
chage -l jdupont
visudo -c`,
    p:["-aG ajoute sans Ã©craser les groupes existants","umask 027 pour masquer les fichiers nouveaux","DÃ©sactiver le login root direct (PermitRootLogin no)"],
    w:"Oublier -a dans -G remplace tous les groupes secondaires et peut bloquer un admin."
   },
   {
    id:"ccp3-services", t:"Systemd : services, cibles et journaux", level:"intermediaire",
    r:"systemctl gÃ¨re le cycle de vie des unitÃ©s ; journalctl filtre les logs binaires journald.",
    tags:["systemd","services","logs","linux"],
    g:["Identifier le service et son Ã©tat","Activer au boot + dÃ©marrer maintenant","DÃ©pendances et drop-in via systemctl edit","Consulter les logs rÃ©cents"],
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
    id:"ccp3-reseau", t:"RÃ©seau Linux, Netplan et NetworkManager", level:"intermediaire",
    r:"ip remplace ifconfig. Netplan/NM selon la distribution. Configuration persistante obligatoire.",
    tags:["reseau","ip","netplan","linux"],
    g:["NetworkManager GUI pour les postes graphiques","VÃ©rifier l'IP, la route et les DNS","Ã‰diter YAML Netplan avec indentation correcte","Appliquer et tester la connectivitÃ©"],
    c:`ip a
ip r
ping -c4 8.8.8.8
ss -tulpn
cat /etc/netplan/*.yaml
netplan apply
nmcli device status
nmcli connection modify eth0 ipv4.addresses 192.168.1.10/24 ipv4.gateway 192.168.1.1`,
    p:["ss remplace netstat","Netplan sensible aux espaces YAML","Penser Ã  tester hors bande pour les serveurs distants"],
    w:"Une erreur YAML peut couper le rÃ©seau ; garder une console distante ouverte."
   },
   {
    id:"ccp3-paquets", t:"Paquets, dÃ©pÃ´ts et maintenance", level:"debutant",
    r:"APT/YUM/DNF selon distro. Mettre Ã  jour rÃ©guliÃ¨rement, nettoyer les paquets et vÃ©rifier les origines.",
    tags:["apt","dnf","packages","linux"],
    g:["Logiciels via GNOME Software ou Synaptic","DÃ©pÃ´ts officiels vs tiers ; signature GPG","Nettoyage des paquets obsolÃ¨tes","Planification unattended-upgrades"],
    c:`apt update && apt upgrade -y
dpkg -l | grep ssh
apt autoremove --purge
dnf check-update
dnf install -y httpd
rpm -qa | grep -i httpd
unattended-upgrade -d`,
    p:["apt-cache madison pour comparer les versions","Pinning Debian pour figer une version","Auditer les dÃ©pÃ´ts avec apt-cache policy"],
    w:"Ne jamais mÃ©langer les dÃ©pÃ´ts de versions majeures (ex. Jammy/Bookworm) sans nÃ©cessitÃ©."
   },
   {
    id:"ccp3-ssh", t:"SSH : administration distante sÃ©curisÃ©e", level:"intermediaire",
    r:"SSH chiffre la session. Authentification par clÃ© et dÃ©sactivation root direct = base de la sÃ©curitÃ©.",
    tags:["ssh","securite","remote"],
    g:["Installer openssh-server si absent","GÃ©nÃ©rer des clÃ©s cÃ´tÃ© client","Copier la clÃ© publique (ssh-copy-id)","DÃ©sactiver root et password si clÃ©s prÃ©sentes"],
    c:`ssh-keygen -t ed25519 -C "admin@tssr"
ssh-copy-id -i ~/.ssh/id_ed25519.pub jdupont@192.168.1.10
# /etc/ssh/sshd_config :
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
systemctl reload sshd`,
    p:["ed25519 recommandÃ©","sshd_config.d/ pour les overrides modernes","Authentification Ã  deux facteurs pour les accÃ¨s sensibles"],
    w:"Se couper l'accÃ¨s SSH en dÃ©sactivant le password avant d'avoir testÃ© la clÃ© est l'erreur classique."
   },
   {
    id:"ccp3-stockage", t:"Stockage : LVM, partitions et fstab", level:"avance",
    r:"LVM abstraction (PV/VG/LV) pour redimensionner et snapshotter sans tout rÃ©installer.",
    tags:["lvm","stockage","fstab","disque"],
    g:["lsblk pour visualiser les disques et partitions","CrÃ©er PV, VG puis LV","Formater (ext4/xfs) et monter","Ajouter Ã  /etc/fstab puis tester"],
    c:`lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINT
pvcreate /dev/sdb1
vgcreate vg_data /dev/sdb1
lvcreate -L 20G -n lv_app vg_data
mkfs.ext4 /dev/vg_data/lv_app
mount /dev/vg_data/lv_app /opt/app
echo "/dev/vg_data/lv_app /opt/app ext4 defaults 0 2" >> /etc/fstab
mount -a`,
    p:["snapshot LVM pour sauvegardes cohÃ©rentes","XFS pour gros volumes, ext4 pour souplesse","Ne jamais fsck un volume montÃ©"],
    w:"Modifier fstab sans tester avec mount -a peut empÃªcher le boot au prochain redÃ©marrage."
   },
   {
    id:"ccp3-cron", t:"Planification avec cron et systemd timers", level:"debutant",
    r:"Cron simple pour les tÃ¢ches pÃ©riodiques ; systemd timers pour dÃ©pendances, logs et redÃ©marrages automatiques.",
    tags:["cron","planification","automation"],
    g:["crontab -e pour Ã©diter","Utiliser des chemins absolus","Rediriger la sortie vers un fichier de log","Tester le script Ã  la main"],
    c:`crontab -e
# minute heure jour mois jourSemaine commande
30 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
@reboot /opt/scripts/startup.sh
# systemd timer
systemctl enable --now backup.timer`,
    p:["SHELL=/bin/bash et PATH explicites dans crontab","Ne jamais lancer en root sans justification","Journaliser les Ã©checs avec mail ou monitoring"],
    w:"Les scripts cron n'hÃ©ritent pas de l'environnement interactif ; tester avec env -i."
   },
   {
    id:"ccp3-logs-central", t:"Logs centralisÃ©s et logrotate", level:"avance",
    r:"Journalisation structurÃ©e + rotation = diagnostic fiable et conservation maÃ®trisÃ©e.",
    tags:["logs","journald","logrotate"],
    g:["DÃ©couper par service pour limiter la taille","Configurer logrotate avec compression et rÃ©tention","Exporter vers un collecteur (rsyslog) si plusieurs serveurs","Surveiller l'espace disque"],
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
    p:["Tail -f pour suivre en live","logger pour Ã©crire dans journald","Centralisation avec Loki/Graylog en production"],
    w:"Les logs rotatÃ©s peuvent Ã©chapper Ã  la supervision si le chemin change."
   }
  ]
}
]);

push([
{
  id:"ccp4",
  group:"TSSR",
  icon:"ðŸŒ",
  title:"CCP4 Â· RÃ©seau, Cisco et subnetting",
  desc:"ModÃ¨le OSI/TCP, adressage, Cisco IOS, VLAN, STP, routage, services.",
  fiches:[
   {
    id:"ccp4-modele", t:"ModÃ¨le OSI vs TCP/IP", level:"debutant",
    r:"7 couches OSI vs 4 couches TCP/IP. Identifier la couche d'un symptÃ´me guide le diagnostic.",
    tags:["osi","tcp/ip","reseau"],
    g:["Associer l'outil Ã  la couche (ping=L3, curl=L7)","Penser aux Ã©quipements intermÃ©diaires (switch=L2, routeur=L3)","Wireshark pour observer"],
    c:`# Couches OSI
# 7 Application 6 Presentation 5 Session 4 Transport 3 RÃ©seau 2 Liaison 1 Physique
# TCP par port ; IP par adresse
Tracert google.com
tcpdump -i eth0 -n
ipconfig /all`,
    p:["TCP orientÃ© connexion, UDP rapide pour DNS/VoIP","Ports <1024 rÃ©servÃ©s","MTU 1500 par dÃ©faut pour Ethernet"],
    w:"Le travail d'une couche infÃ©rieure ne suffit pas si la supÃ©rieure Ã©choue."
   },
   {
    id:"ccp4-ports", t:"Ports et protocoles Ã  connaÃ®tre", level:"debutant",
    r:"RÃ©pertoire des ports usuels pour l'examen et l'exploitation : web, mail, fichiers, admin, sÃ©curitÃ©.",
    tags:["ports","protocoles","tcp","udp"],
    g:["Pare-feu Windows : autoriser le port via GUI avec rÃ¨gle entrante","pfSense : Firewall > Rules > Add","Tester via navigateur ou telnet/Test-NetConnection"],
    c:`# Web 80/443, DNS 53, DHCP 67/68
# Mail SMTP 25/587, IMAP 143/993, POP3 110/995
# FTP 20-21, SMB 445, SSH 22, RDP 3389, SNMP 161, LDAP 389/636
ss -tlnp
Test-NetConnection srv -Port 443
nmap -sV 192.168.1.10`,
    p:["TCP handshake SYN-SYN/ACK-ACK ; UDP sans handshake","Ports Ã©phÃ©mÃ¨res > 1024","SMB 445 = SMB direct, plus sÃ©curisÃ© que NetBIOS 139"],
    w:"Ouvrir un port sans restriction source est une mauvaise pratique."
   },
   {
    id:"ccp4-subnet", t:"Subnetting / CIDR", level:"intermediaire",
    r:"Formule : 2^(bits hÃ´tes)-2. /24 = 254, /25 = 126, /26 = 62, /27 = 30. VLSM pour dÃ©couper selon besoin rÃ©el.",
    tags:["subnetting","cidr","vlsm","ip"],
    g:["Calculatrice sipcalc / tableau","Plan d'adressage : VLAN/utilisateurs + passerelle","VÃ©rifier le masque sur switch/routeur et postes"],
    c:`ipcalc 192.168.1.0/26
# /26 : masque 255.255.255.192, bloc 64
# ex. 192.168.1.0-63 : .1 gw, .2-62 hosts, .63 broadcast
python3 -c "import ipaddress; n=ipaddress.ip_network('192.168.10.0/26'); print(list(n.hosts())[:5])"
# VLSM
sipcalc 10.0.0.0/24`,
    p:["RÃ©seau + broadcast non utilisables","/31 point Ã  point (RFC3021), /32 hÃ´te","Supernetting pour agrÃ©gation"],
    w:"Apprendre la table /24â†’/30 par cÅ“ur pour l'examen."
   },
   {
    id:"ccp4-cisco", t:"Cisco IOS : base, VLAN et sÃ©curitÃ©", level:"intermediaire",
    r:"Modes User> Enable# Conf(t). Hostname, IP, VLAN, OSPF ; sÃ©curiser par enable secret et SSH.",
    tags:["cisco","switch","router","ios"],
    g:["Packet Tracer : glisser switch/router, onglet CLI","CÃ¢bler cuivre droit PC-switch, croisÃ© si besoin","Desktop > IP Configuration pour IP PC","VÃ©rifier show run et sauvegarder"],
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
    w:"Toujours sauvegarder startup-config ; un reboot non sauvegardÃ© efface la config."
   },
   {
    id:"ccp4-trunk", t:"VLAN trunk, routage inter-VLAN et OSPF", level:"avance",
    r:"Trunk = 802.1Q multi-VLAN. OSPF = routage dynamique interne. DHCP par routeur pour multi-site.",
    tags:["trunk","ospf","routing","dhcp"],
    g:["Packet Tracer : trunk entre switches via GUI","VÃ©rifier connectivitÃ© inter-VLAN via SVI/routeur","Observer les voisins OSPF"],
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
    p:["Natif VLAN Ã  changer pour la sÃ©curitÃ©","OSPF Hello 10s, Dead 40s","Cost OSPF = 10^8/bande passante"],
    w:"Un trunk mal autorisÃ© bloque un VLAN silencieusement ; show interfaces trunk pour vÃ©rifier."
   },
   {
    id:"ccp4-stp", t:"STP, RSTP et EtherChannel", level:"avance",
    r:"STP empÃªche les boucles et bloque des ports ; RSTP accÃ©lÃ¨re la convergence ; EtherChannel agrÃ¨ge des liens.",
    tags:["stp","rstp","etherchannel","switching"],
    g:["DÃ©finir la prioritÃ© du root bridge (root primaire/secondaire)","Activer RSTP","CrÃ©er le channel-group et vÃ©rifier sa cohÃ©rence"],
    c:`spanning-tree mode rapid-pvst
spanning-tree vlan 1 root primary
show spanning-tree
interface range g0/1-2
 channel-group 1 mode active
 channel-protocol lacp
show etherchannel summary
show interfaces trunk`,
    p:["Root bridge = ID le plus bas (prioritÃ©.MAC)","BPDU Guard sur ports edge","LACP actif/passif, PAgP desirable/auto"],
    w:"Une incohÃ©rence de VLAN sur un EtherChannel fait tomber tout le bundle."
   },
   {
    id:"ccp4-acl", t:"ACL et sÃ©curitÃ© rÃ©seau", level:"intermediaire",
    r:"ACL standard prÃ¨s de la destination, Ã©tendue prÃ¨s de la source. Ã‰valuÃ©es de haut en bas ; premiÃ¨re qui matche gagne.",
    tags:["acl","securite","cisco"],
    g:["DÃ©finir la politique deny par dÃ©faut","CrÃ©er ACL nommÃ©e, ajouter les rÃ¨gles","Appliquer inbound/outbound selon besoin","VÃ©rifier avec show access-lists et debug conditionnel"],
    c:`ip access-list extended LAN-OUT
 permit tcp 192.168.10.0 0.0.0.255 any eq 443
 deny ip 192.168.10.0 0.0.0.255 192.168.20.0 0.0.0.255
 permit ip any any
!
interface g0/1
 ip access-group LAN-OUT out
show access-lists
`,
    p:[" deny any any implicite Ã  la fin","Standard ACL = seul source ; Extended = source/dest/proto/port","Time-range pour restrictions horaires"],
    w:"Appliquer une ACL sur la mauvaise interface/direction provoque des blocages inexpliquÃ©s."
   },
   {
    id:"ccp4-nat", t:"NAT/PAT et adressage public", level:"intermediaire",
    r:"PAT avec une IP publique pour sortie Internet ; NAT statique pour serveur publiÃ© ; pool pour grand volume.",
    tags:["nat","pat","routeur"],
    g:["DÃ©finir inside/outside sur les interfaces","ACL source et overload pour PAT","RÃ¨gles statiques pour serveurs DMZ","Tester depuis l'extÃ©rieur"],
    c:`interface g0/0
 ip nat inside
interface g0/1
 ip nat outside
ip access-list standard NAT-SOURCES
 permit 192.168.10.0 0.0.0.255
ip nat inside source list NAT-SOURCES interface g0/1 overload
ip nat inside source static 192.168.10.20 203.0.113.20
show ip nat translations`,
    p:["Pool NAT pour plusieurs IP publiques","no-alias et overload","Tester la rÃ©solution DNS externe aprÃ¨s NAT"],
    w:"Un serveur exposÃ© sans pare-feu = compromission probable."
   },
   {
    id:"ccp4-ipv6", t:"IPv6, routage et transitions", level:"avance",
    r:"Adresses /64 pour LAN, link-local fe80::, EUI-64. OSPFv3 et DHCPv6/SLAAC.",
    tags:["ipv6","ospf","slaac"],
    g:["Activer IPv6 sur les interfaces","Configurer SLAAC ou DHCPv6","Tester ping6 et connectivitÃ©","Documenter le plan d'adressage IPv6"],
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
  icon:"ðŸ–¥ï¸",
  title:"CCP5 Â· Virtualisation VMware",
  desc:"ESXi/vCenter, stockage, rÃ©seau, HA/DRS, snapshot et sauvegarde.",
  fiches:[
   {
    id:"ccp5-vsphere", t:"vSphere : ESXi + vCenter", level:"intermediaire",
    r:"ESXi = hyperviseur bare-metal. vCenter = pilotage central, inventaire, modÃ¨les, template et API.",
    tags:["vmware","esxi","vcenter","virtualisation"],
    g:["vSphere Client : hÃ´tes > cluster > VM","CrÃ©er VM : nom, OS, CPU/RAM/disque (thin)","Installer VMware Tools, snapshot avant MAJ","Standardiser avec templates"],
    c:`# PowerCLI
Connect-VIServer vcenter.local
Get-VM
New-VM -Name SRV1 -MemoryGB 4 -NumCpu 2 -DiskGB 60 -VMHost esxi1
Start-VM SRV1
Get-Snapshot SRV1
New-Snapshot -VM SRV1 -Name "Avant-MAJ"`,
    p:["Thin = allouÃ© Ã  l'usage, Thick = rÃ©servÃ©","Tools = performances et arrÃªt propre","Template rÃ©duit les erreurs de config"],
    w:"Snapshot n'est pas une sauvegarde ; il dÃ©pend de la VM parente."
   },
   {
    id:"ccp5-vmotion", t:"vMotion, HA, DRS et mise en rÃ©seau", level:"avance",
    r:"vMotion = migration Ã  chaud, HA = redÃ©marrage en cas de panne, DRS = Ã©quilibrage des charges.",
    tags:["vmotion","ha","drs","vswitch"],
    g:["Cluster : activer HA + DRS, ajouter 2 ESXi","vSwitch : ajouter les portgroups VLAN","Migrer : Migrate > vMotion","Tester la panne d'un host en maintenance"],
    c:`Get-Cluster | Select Name, HAEnabled, DrsEnabled, DrsAutomationLevel
Get-VirtualSwitch
Get-VMHostNetworkAdapter
Get-VM | Get-NetworkAdapter
Set-VM -VM SRV1 -MemoryGB 8 -Confirm:$false`,
    p:["vMotion nÃ©cessite VMkernel + stockage partagÃ©","HA nÃ©cessite quorum et datastore heartbeat","DRS automatique recommandÃ© en production"],
    w:"Tester HA en maintenance planifiÃ©e, jamais dans une vraie panne surprise."
   },
   {
    id:"ccp5-network", t:"RÃ©seau virtuel et sÃ©curitÃ©", level:"intermediaire",
    r:"vSwitch standard vs distribuÃ©, VLAN, promiscuous/port security et micro-segmentation future.",
    tags:["reseau virtuel","vlan","security"],
    g:["CrÃ©er un vSwitch par usage (admin, vmotion, stockage)","DÃ©finir des port groups avec VLAN","Limiter les ports trunk","Activer le contrÃ´le de sÃ©curitÃ©"],
    c:`New-VirtualSwitch -Name vSwitch1 -VMHost esxi1 -Nic vmnic1
New-PortGroup -Name "PG-APP" -VirtualSwitch vSwitch1 -VlanId 120
Get-VirtualPortGroup
# RÃ©seau isolÃ© pour NAS
`,
    p:["SÃ©parer le trafic de sauvegarde du trafic production","Jumbo frames pour stockage iSCSI","MTU identique partout"],
    w:"Un VLAN erronÃ© sur un port group silencieusement isole une VM."
   },
   {
    id:"ccp5-backup", t:"Sauvegarde et snapshot de VM", level:"intermediaire",
    r:"Protection avec Veeam/Azure ? Ã  tester, snapshot pour maintenance, sauvegarde pour reprise.",
    tags:["backup","snapshot","vmware"],
    g:["DÃ©finir SLA par machine (RPO/RTO)","Planification des sauvegardes incrÃ©mentielles","Test de restauration trimestriel","Nettoyage des snapshots > 72 h"],
    c:`# Veeam CLI / PowerCLI examples
Backup-VM -Name SRV1 -Repository "Repo-NAS"
Restore-VM -Name SRV1 -RestorePoint (Get-RestorePoint SRV1 | Select -Last 1)
Get-Snapshot SRV1 | Where Created -lt (Get-Date).AddDays(-3)`,
    p:["Snapshot chaÃ®ne fragile si trop long","Application-consistent avec guest processing","Chiffrer les sauvegardes"],
    w:"Un snapshot restÃ© ouvert trop longtemps dÃ©grade fortement les performances I/O."
   },
   {
    id:"ccp5-hyper", t:"Hyper-V et autres hyperviseurs", level:"intermediaire",
    r:"Hyper-V natif Windows, Proxmox open-source, KVM/QEMU pour laboratoires. Les concepts se transfÃ¨rent.",
    tags:["hyperv","proxmox","kvm"],
    g:["Activer le rÃ´le Hyper-V avec GUI ou PowerShell","CrÃ©er commutateur virtuel externe/interne","GÃ©rer les VM avec Hyper-V Manager","Automatiser avec PowerShell"],
    c:`Install-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart
New-VMSwitch -Name "LAN" -NetAdapterName Ethernet -AllowManagementOS $true
New-VM -Name SRVH1 -MemoryStartupBytes 4GB -NewVHDPath C:\\VMs\\SRVH1.vhdx -NewVHDSizeBytes 60GB
Start-VM SRVH1`,
    p:["Hyper-V Replica pour la rÃ©silience simple","Checkpoint production Ã  privilÃ©gier","Proxmox pour labo Ã  moindre coÃ»t"],
    w:"La virtualisation imbriquÃ©e nÃ©cessite VT-x/EPT et peut casser les snapshots."
   }
  ]
}
]);

push([
{
  id:"ccp6", group:"TSSR", icon:"ðŸ“œ", title:"CCP6 Â· Scripts Bash & PowerShell (exemples expliquÃ©s)", desc:"Scripts Linux et Windows documentÃ©s ligne par ligne, pour exÃ©cuter et expliquer Ã  l'oral.", fiches:[
   {
    id:"ccp6-bash-backup", t:"Bash : sauvegarde incrÃ©mentale et contrÃ´le rotatif", level:"intermediaire",
    r:"rsync + journal, contrÃ´le de retour, rotation simple des sauvegardes. Expliquer : arguments en majuscules, guillemets, code retour $?.",
    tags:["bash","rsync","backup","cron"],
    g:["Sauvegarder /srv/data vers /backup/data","Conserver les logs dans /var/log/backup-data.log","Planifier Ã  02:30 dans crontab avec crontab -e","VÃ©rifier le code de retour aprÃ¨s exÃ©cution"],
    c:`#!/bin/bash
set -euo pipefail
SRC="/srv/data"
DEST="/backup/data"
LOG="/var/log/backup-data.log"
DATE="$(date +%F-%H%M%S)"
mkdir -p "$DEST"
echo "[$DATE] DÃ©but sauvegarde $SRC vers $DEST" >> "$LOG"
rsync -av --delete --stats "$SRC/" "$DEST/" >> "$LOG" 2>&1
STATUS=$?
echo "[$DATE] TerminÃ© avec code $STATUS" >> "$LOG"
exit $STATUS`,
    p:["Utiliser des guillemets autour de \"$SRC/\" et \"$DEST/\" pour Ã©viter les espaces","Tester un fichier Ã  la main avant cron","Exporter le log dans ELK/Graylog en production"],
    w:"Si $SRC est vide suite Ã  une erreur de montage, --delete efface la sauvegarde. Ajouter une vÃ©rification de source non vide avant rsync."
   },
   {
    id:"ccp6-bash-check", t:"Bash : validation d'arguments et contrÃ´le de fichier", level:"intermediaire", r:"Valider le nombre d'arguments, tester l'existence et le type avant d'agir, afficher un usage clair.",
    tags:["bash","arguments","validation","securite"],
    g:["Exemples : ./verif.sh /etc","Le script teste le nombre, le type de dossier et affiche les rÃ©sultats","Utile en MEP pour prouver la rigueur"],
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
    p:["Ne pas utiliser ls dans un script ; prÃ©fÃ©rer find","[[ ]] plus lisible pour les tests Bash","exit codes 1 = usage, 2 = fichier, 3 = autres erreurs"],
    w:"Sans validation, un script peut Ã©crire dans le mauvais dossier."
   },
   {
    id:"ccp6-bash-monitor", t:"Bash : vÃ©rification d'un service et alerte simple", level:"debutant", r:"systemctl + journalisation, boucle while, timeout. Expliquer : commandes courtes et codes de retour.",
    tags:["bash","systemd","monitoring","service"],
    g:["VÃ©rifier le statut SSH toutes les 5 minutes via cron","Journaliser les indisponibilitÃ©s","Envoyer un mail avec msmtp si le service est down"],
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
    p:["Utiliser systemctl is-active rather than grep ps","Ajouter un lock pour Ã©viter les redÃ©marrages en boucle","IntÃ©grer Ã  Zabbix pour notification rÃ©elle"],
    w:"Alerter sans action peut masquer une panne ; toujours envisager automatique + escalade."
   },
   {
    id:"ccp6-bash-inventory", t:"Bash : inventaire et rapport d'un dossier partagÃ©", level:"intermediaire", r:"find, awk, comptage par extension, fichier CSV. Montrer : boucle, tests et rediriger vers un fichier de sortie.",
    tags:["bash","inventaire","find","rapport"],
    g:["GÃ©nÃ©rer un inventaire des fichiers dans /srv/partage","Compter les extensions et leur taille","Ã‰crire le rÃ©sultat dans CSV","Importer ensuite dans Excel/GLPI"],
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
    p:["find avec -print0 pour Ã©viter les espaces dans les noms","uniq -c compte les lignes identiques","Sortie CSV ASCII pour Ã©viter les accents illisibles"],
    w:"Les noms de fichiers avec retours de ligne cassent le parsing ; -print0 + traitement adaptÃ© est recommandÃ©."
   },
   {
    id:"ccp6-ps-users", t:"PowerShell : crÃ©ation massive d'utilisateurs AD depuis CSV", level:"intermediaire", r:"Import-Csv + ForEach-Object + New-ADUser. Expliquer : pipeline d'objets, variables, attributs obligatoires.",
    tags:["powershell","ad","utilisateurs","csv"],
    g:["PrÃ©parer .\\users.csv avec colonnes Prenom,Nom,Login,GroupeMetier","Lancer le script dans une console d'admin","VÃ©rifier dans ADUC et dans Get-ADUser","Cocher le changement de mot de passe Ã  la prochaine ouverture"],
    c:`# users.csv attendu :
# Prenom,Nom,Login,GroupeMetier
$MotDePasseTemporaire = Read-Host "Mot de passe temporaire" -AsSecureString
Import-Csv .\\users.csv | ForEach-Object {
    $NomComplet = "$($_.Prenom) $($_.Nom)"
    New-ADUser -Name $NomComplet -GivenName $_.Prenom -Surname $_.Nom -SamAccountName $_.Login -UserPrincipalName "$($_.Login)@tssr.local" -Enabled $true -ChangePasswordAtLogon $true -AccountPassword $MotDePasseTemporaire
    Add-ADGroupMember -Identity "G_$($_.GroupeMetier)" -Members $_.Login
    Write-Host "CrÃ©Ã© : $NomComplet ($($_.Login))" -ForegroundColor Green
}`,
    p:["Utiliser un compte admin dÃ©lÃ©guÃ© et non Domain Admin pour la prod","CSV encodÃ© UTF-8","Renseigner aussi l'UPN pour les connexions e-mail"],
    w:"New-ADUser ne modifie pas mot de passe automatiquement si l'option -ChangePasswordAtLogon n'est pas posÃ©e."
   },
   {
    id:"ccp6-ps-inactive", t:"PowerShell : rapport des utilisateurs inactifs", level:"intermediaire", r:"Get-ADUser + LastLogonDate, Export-Csv. Expliquer : filtrage, date calculÃ©e, export lisible pour audit.",
    tags:["powershell","ad","audit","rapport"],
    g:["Chercher les comptes sans connexion depuis 90 jours","Exporter un CSV","DÃ©sactiver ou supprimer aprÃ¨s validation manager","Archiver dans le dossier admin"],
    c:`$Seuil = (Get-Date).AddDays(-90)
$Inactifs = Get-ADUser -Filter "Enabled -eq 'True'" -Properties LastLogonDate |
    Where-Object { $_.LastLogonDate -lt $Seuil -or $_.LastLogonDate -eq $null } |
    Select-Object Name, SamAccountName, LastLogonDate, DistinguishedName
$Inactifs | Export-Csv -Path "C:\\temp\\inactifs-90j.csv" -NoTypeInformation -Encoding UTF8
Write-Output "$($Inactifs.Count) comptes Ã  traiter"
$Inactifs`,
    p:["LastLogonDate peut Ãªtre incomplet ; utiliser LastLogonTimestamp si besoin","Ajouter un bloc try/catch si export impossible","Valider avec le manager avant dÃ©sactivation"],
    w:"Les comptes de service n'ont pas toujours de LastLogonDate ; ne pas les dÃ©sactiver sans vÃ©rification."
   },
   {
    id:"ccp6-ps-perm", t:"PowerShell : rapport de droits sur un dossier partagÃ©", level:"intermediaire", r:"Get-Acl + ACL, affichage des groupes et niveaux d'accÃ¨s. Montrer : pourquoi on sÃ©pare DomainLocal et Global.",
    tags:["powershell","acl","permissions","partage"],
    g:["Chemin \\\\serveur\\partage\\compta","Lire les ACL NTFS","Exporter le rÃ©sultat en CSV","Comparer avec la matrice AGDLP"],
    c:`$Chemin = "D:\\Shares\\Compta"
$Acl = Get-Acl -Path $Chemin
$Acl.Access |
    Select-Object IdentityReference, FileSystemRights, AccessControlType |
    Export-Csv "C:\\temp\\acl-compta.csv" -NoTypeInformation -Encoding UTF8
$Acl.Access`,
    p:["Tenir la matrice AGDLP Ã  jour","Auditer trimestriellement","Ne jamais donner Full Control par dÃ©faut"],
    w:"Le droit NTFS le plus restrictif gagne lorsqu'il est combinÃ© avec la permission de partage."
   },
   {
    id:"ccp6-ps-service", t:"PowerShell : surveillance et redÃ©marrage contrÃ´lÃ©", level:"debutant", r:"Get-Service + boucle While + Start-Service. Expliquer : Ã©tat Running/Stopped et tentatives de relance.",
    tags:["powershell","services","supervision"],
    g:["VÃ©rifier le spooler et l'agent GLPI toutes les 15 minutes","RedÃ©marrer si stopped","Journaliser la relance","Alerter l'utilisateur en cas d'Ã©chec"],
    c:`$Services = @("Spooler","GLPI-Agent")
foreach ($Nom in $Services) {
    $Svc = Get-Service -Name $Nom -ErrorAction SilentlyContinue
    if ($null -eq $Svc) {
        Write-Warning "Le service $Nom n'existe pas"
        continue
    }
    if ($Svc.Status -ne "Running") {
        Write-Host "$Nom est arrÃªtÃ© : tentative de redÃ©marrage"
        Start-Service -Name $Nom
        Start-Sleep -Seconds 3
        (Get-Service -Name $Nom).Status
    } else {
        Write-Host "$Nom OK"
    }
}`,
    p:["Utiliser Invoke-Command pour exÃ©cuter sur plusieurs serveurs","Ajouter un timeout et un nombre max d'essais","Journaliser dans Windows Event Log"],
    w:"Un redÃ©marrage automatique sans analyse peut masquer une panne rÃ©currente."
   },
   {
    id:"ccp6-ps-backup", t:"PowerShell : sauvegarde Windows (robocopy)", level:"intermediaire", r:"Robocopy avec journal et codes retour. On explique : /MIR pour miroir, risque de suppression, et contrÃ´le code 1-7.",
    tags:["powershell","robocopy","backup","windows"],
    g:["Sauvegarder C:\\data vers E:\\backup\\data","VÃ©rifier le code retour","Garder le log dans un dossier audit","Planifier via le Planificateur de tÃ¢ches"],
    c:`$Source = "C:\\data"
$Cible = "E:\\backup\\data"
$Log = "C:\\logs\\robocopy-data.log"
robocopy $Source $Cible /MIR /Z /R:3 /W:5 /LOG:$Log /NDL /NP
$Code = $LASTEXITCODE
if ($Code -lt 8) {
    Write-Host "Sauvegarde terminÃ©e, code $Code" -ForegroundColor Green
} else {
    Write-Warning "Sauvegarde Ã©chouÃ©e, code $Code"
}
exit $Code`,
    p:["/MIR supprime ce qui a disparu source, comme rsync --delete","/Z pour reprise rÃ©seau","Mettre /XD pour exclure caches"],
    w:"Ne pas utiliser /MIR sans stratÃ©gie de versioning ; cela efface les fichiers vieille version cÃ´tÃ© cible."
   }
  ]
},
{
  id:"ccp7",
  group:"TSSR",
  icon:"ðŸ§±",
  title:"CCP7 Â· pfSense, NAT, VPN et proxy",
  desc:"Pare-feu, rÃ¨gles, NAT, VPN site-Ã -site/nomade, filtrage web.",
  fiches:[
   {
    id:"ccp7-firewall", t:"RÃ¨gles de pare-feu et ordre d'Ã©valuation", level:"intermediaire",
    r:"Ã‰valuÃ©es hautâ†’bas, premiÃ¨re qui matche gagne. WAN deny all par dÃ©faut, LAN allow contrÃ´lÃ©.",
    tags:["pfsense","firewall","regles"],
    g:["Firewall > Rules > LAN/WAN > Add","Action Pass/Block, protocole, source, destination port","Apply Changes puis journaliser les blocs","Tester via Syslog"],
    c:`# iptables Ã©quivalent
iptables -L -n -v
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -P INPUT DROP
# pfSense : limiter l'admin Ã  un alias`,
    p:["Limiter la sortie LAN au strict nÃ©cessaire","Ordre critique pour les exceptions","Alias pour regrouper IP/services"],
    w:"Les rÃ¨gles sont appliquÃ©es par interface entrante ; la direction est source de confusion."
   },
   {
    id:"ccp7-natvpn", t:"NAT, VPN IPsec/OpenVPN et proxy", level:"avance",
    r:"PAT = 1 IP publique. IPsec site-Ã -site, OpenVPN nomade. Squid = filtre web, authentification et cache.",
    tags:["nat","vpn","ipsec","openvpn","proxy"],
    g:["Firewall > NAT > Outbound (auto)","VPN > IPsec/OpenVPN : assistant, certificats","Tester le VPN hors LAN (4G)","Proxy Squid : service + ACL"],
    c:`show nat translations
# OpenVPN test
openvpn --config client.ovpn
# Squid
squid -k reconfigure
grep ^acl /etc/squid/squid.conf`,
    p:["DMZ pour services exposÃ©s (voir fiche DMZ)","NAT = cause frÃ©quente d'audio VoIP unidirectionnel","VPN : dÃ©synchroniser les plages LAN distantes"],
    w:"Le VPN sans test externe laisse des erreurs de NAT/masquage inaperÃ§ues."
   },
   {
    id:"ccp7-ids", t:"IDS/IPS et supervision sÃ©curitÃ©", level:"avance",
    r:"Suricata/Snort pour dÃ©tecter et bloquer ; corrÃ©ler alertes et logs, Ã©viter les faux positifs.",
    tags:["ids","ips","suricata","securite"],
    g:["Activer le package Suricata","Choisir les rÃ¨gles ET open","Alerte puis block en mode legacy/block","Suivre les stats et top signatures"],
    c:`# pfSense Suricata
# Services > Suricata > Interfaces > Add
# Blocage via pfctl table
pfctl -t snort2c -T show | head
# Mise Ã  jour des rÃ¨gles
# Suricata update`,
    p:["Les sondes mirror/triple n'impactent pas la latence","Tuner les rÃ¨gles par groupe","CorrÃ©ler avec SIEM pour vue globale"],
    w:"Une rÃ¨gle trop large peut bloquer le trafic lÃ©gitime de production."
   }
  ]
},
{
  id:"ccp8",
  group:"TSSR",
  icon:"ðŸ’¾",
  title:"CCP8 Â· Sauvegardes et PRA",
  desc:"RÃ¨gle 3-2-1, RPO/RTO, outils, tests de restauration.",
  fiches:[
   {
    id:"ccp8-321", t:"3-2-1, RPO/RTO et stratÃ©gie", level:"intermediaire",
    r:"Trois copies, deux supports, une hors site. RPO = perte max acceptable, RTO = durÃ©e panne acceptable.",
    tags:["backup","321","pra","rpo","rto"],
    g:["Windows Server Backup : sauvegarder volumes","Veeam : job, repository, planification, test restore","Tester restauration fichier + VM complÃ¨te","Chiffrer et vÃ©rifier"],
    c:`wbadmin start backup -backupTarget:E: -include:C: -quiet
wbadmin get versions
# Linux
tar -czf /backup/etc-$(date +%F).tgz /etc
rsync -av --delete /data/ /backup/data/
borg create /backup/repo::etc-$(date +%F) /etc`,
    p:["ComplÃ¨te + incrÃ©mentielle/diffÃ©rentielle","VÃ©rifier l'intÃ©gritÃ© avec checksums","DÃ©tention hors ligne pour se protÃ©ger du ransomware"],
    w:"Une sauvegarde non testÃ©e n'est pas une sauvegarde."
   },
   {
    id:"ccp8-outils", t:"Outils et reprise bare-metal", level:"intermediaire",
    r:"Image systÃ¨me, Veeam B&R, Bacula, Proxmox Backup Server, test de restore sur hardware diffÃ©rent.",
    tags:["backup","bare metal","restore"],
    g:["CrÃ©er un mÃ©dia de secours","Documenter la procÃ©dure de reprise","Tester la restauration sur une VM distincte","Valider les applications aprÃ¨s restore"],
    c:`# Veeam
veeamconfig repository list
# Proxmox
proxmox-backup-client backup /etc pxar:etc --repository pbs@192.168.1.5:store
# Test restore
qemu-img convert disk.qcow2 -O raw /dev/sdb`,
    p:["RTO d'un serveur = souvent dÃ©pendant des licences","RÃ©tention lÃ©gale selon activitÃ©","Versioning et immutabilitÃ©"],
    w:"La sauvegarde d'une base vivante doit Ãªtre cohÃ©rente applicative (dump, VSS)."
   },
   {
    id:"ccp8-zfs", t:"ZFS et sauvegarde cohÃ©rente", level:"avance",
    r:"Snapshots atomiques, rÃ©plication send/receive, dÃ©tection de corruption par checksum.",
    tags:["zfs","snapshot","replication"],
    g:["CrÃ©er un pool et des datasets","Snapshot avant MAJ","RÃ©pliquer vers un NAS","Surveiller scrub"],
    c:`zpool create tank /dev/sdb
zfs create tank/data
zfs snapshot tank/data@avant-maj
zfs send tank/data@avant-maj | ssh backup zfs recv tank/data
zpool scrub tank`,
    p:["ARC RAM pour cache de lecture","Ne pas utiliser ZFS sur disques non ECC pour production critique","Compression lz4 par dÃ©faut"],
    w:"Un scrub rÃ©gulier rÃ©vÃ¨le la dÃ©gradation silencieuse."
   }
  ]
},
{
  id:"ccp9",
  group:"TSSR",
  icon:"ðŸš€",
  title:"CCP9 Â· DÃ©ploiement et gestion de parc",
  desc:"MDT/WDS, Sysprep, capture image, dÃ©ploiement PXE, gestion poste.",
  fiches:[
   {
    id:"ccp9-deploiement", t:"MDT/WDS, Sysprep et dÃ©ploiement", level:"intermediaire",
    r:"Image de rÃ©fÃ©rence â†’ Sysprep â†’ capture â†’ dÃ©ploiement PXE. GÃ©rer les drivers par modÃ¨le.",
    tags:["mdt","wds","sysprep","deploiement"],
    g:["WDS : ajouter images boot/install et activer PXE","MDT : task sequence, applications, drivers","Sysprep OOBE + generalize + shutdown","DHCP options 66/67 pour PXE"],
    c:`sysprep /oobe /generalize /shutdown
dism /Capture-Image /ImageFile:D:\\ref.wim /CaptureDir:C:\\ /Name:Ref /Compress:max
wdsutil /get-image /imagename:Ref
# MDT : Update Deployment Share`,
    p:["Ne jamais cloner sans Sysprep (SID doublon)","Driver store sÃ©parÃ© par modÃ¨le","Tests sur une VM avant prod"],
    w:"Un reboot pendant Sysprep peut casser l'image."
   },
   {
    id:"ccp9-gposoft", t:"DÃ©ploiement logiciel par GPO et Intune", level:"intermediaire",
    r:"MSI via GPO pour le on-prem ; Intune/MDM pour le nomade. Toujours tester la dÃ©sinstallation.",
    tags:["gpo","msi","intune","deploiement"],
    g:["CrÃ©er GPO ordinateur pour installation MSI","Ajouter fichier MSI dans \\domaine\\NETLOGON","Filtrer par groupe WMI OU","Surveiller le journal d'Ã©vÃ©nements application"],
    c:`New-GPO -Name "Deploiement 7zip"
# DÃ©tails : ordinateur > stratÃ©gie > logiciels > MSI
msiexec /i app.msi /quiet /norestart /l*v C:\\logs\\install.log
Get-WinEvent -LogName Application | Where Message -match "MsiInstaller"`,
    p:["MSI transform (.mst) pour personnalisation","UPN pour utilisateurs nomades","Intune win32 pour combiner MSI+scripts"],
    w:"Les dÃ©ploiements GPO nÃ©cessitent un redÃ©marrage ou gpupdate /force pour application."
   },
   {
    id:"ccp9-remote", t:"Administration et inventaire de parc", level:"intermediaire",
    r:"RMM, inventaire hardware/software, patch, tÃ©lÃ©maintenance et reporting.",
    tags:["inventaire","rmm","parc"],
    g:["Installer un agent d'inventaire (GLPI Agent, OCS)","Collecter les infos matÃ©riel","Rapporter patchs et vulnÃ©rabilitÃ©s","Planifier l'obsolescence"],
    c:`# GLPI Agent
glpi-agent --server http://glpi.local --inventory
# PowerShell inventaire local
Get-CimInstance Win32_ComputerSystem | Select Name, Manufacturer, Model
Get-CimInstance Win32_OperatingSystem | Select Caption, Version, LastBootUpTime`,
    p:["Matrice de compatibilitÃ© avec l'OS","Dernier boot et uptime comme indicateurs","Enlever les postes obsolÃ¨tes de l'AD"],
    w:"Sans inventaire, l'obsolescence et les risques sont invisibles."
   }
  ]
},
{
  id:"ccp10",
  group:"TSSR",
  icon:"ðŸ“ž",
  title:"CCP10 Â· VoIP, DMZ et intranet",
  desc:"VoIP/SIP, Asterisk, DMZ sÃ©curisÃ©e, Apache, proxy et durcissement.",
  fiches:[
   {
    id:"ccp10-toip", t:"Asterisk / FreePBX et diagnostic SIP", level:"intermediaire",
    r:"SIP 5060, RTP 10000-20000, codecs G.711/G.729. QoS et VLAN voix.",
    tags:["voip","sip","asterisk","qos"],
    g:["FreePBX : extensions, trunk, routes entrantes/sortantes","Provisionner tÃ©lÃ©phones SIP","Tester appel interne puis externe","QoS : prioriser la voix (DSCP EF)"],
    c:`asterisk -rvvv
sip show peers
pjsip show endpoints
rtp set debug on
# ports
# SIP 5060 UDP/TCP, RTP 10000-20000 UDP
asterisk -rx "core show channels"`,
    p:["NAT = audio unidirectionnel frÃ©quent","VLAN voix sÃ©parÃ©","RTCP pour la qualitÃ©"],
    w:"Les ALG SIP des routeurs peuvent casser la signalisation."
   },
   {
    id:"ccp10-dmz", t:"DMZ, Apache et filtrage IP", level:"intermediaire",
    r:"DMZ = zone tampon. LANâ†’DMZ OK, WANâ†’DMZ seulement 80/443, DMZâ†’LAN refusÃ©.",
    tags:["dmz","apache","firewall","iptables"],
    g:["Apache : sites-available, a2ensite intranet","Restreindre : Require ip 192.168.1.0/24","Pare-feu : rÃ¨gles LAN/DMZ/WAN","Activer TLS interne"],
    c:`apt install apache2 -y
a2ensite intranet
systemctl reload apache2
# restriction
# <Directory /var/www/intranet> Require ip 192.168.1.0/24 </Directory>
iptables -A FORWARD -i eth0 -o dmz -j ACCEPT
iptables -A FORWARD -i wan -o dmz -p tcp --dport 443 -j ACCEPT
iptables -A FORWARD -i dmz -o lan -j DROP`,
    p:["Reverse proxy en DMZ, donnÃ©es en LAN","Logs + rotation + TLS","HSTS et redirection 80â†’443"],
    w:"Exposer le SSH de la DMZ vers Internet est une erreur classique."
   },
   {
    id:"ccp10-durc", t:"Durcissement Linux et web", level:"avance",
    r:"RÃ©duire la surface d'attaque : services minimaux, permissions, fail2ban, HTTPS forcÃ©.",
    tags:["hardening","securite","web"],
    g:["DÃ©sactiver les services inutiles","Mettre Ã  jour et reboot planifiÃ©","Configurer fail2ban pour SSH","Scanner avec lynis"],
    c:`systemctl disable --now telnet.socket
apt install fail2ban -y
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
systemctl enable --now fail2ban
lynis audit system`,
    p:["Headers de sÃ©curitÃ© Apache (CSP, HSTS)","Sudo avec groupes et logs","Chiffrement des certificats"],
    w:"Le durcissement sans communication peut casser des applications mÃ©tier."
   }
  ]
}
]);

push([
{
  id:"ccna",
  group:"TSSR",
  icon:"ðŸŒ",
  title:"RÃ©seaux IP, routage et services (CP4/CP7)",
  desc:"OSI, IPv4/IPv6, commutation, routage, WLAN, WAN, services, sÃ©curitÃ©, programmation.",
  fiches:[
   {
    id:"ccna-pdf", t:"Lien CCNA1.pdf du dÃ©pÃ´t", level:"debutant",
    r:"Le PDF de 15 Mo reste la rÃ©fÃ©rence dÃ©taillÃ©e. Le site = fiches de rÃ©vision + labos + QCM.",
    tags:["ccna","pdf","revision"],
    g:["Ouvrir CCNA1.pdf dans le repo","Chercher par mot-clÃ© dans le PDF","Annoter les points Ã  revoir"],
    c:`# Ouvrir le PDF du repo :
# https://herbreteau787-svg.github.io/Guide-TSSR/CCNA1.pdf
# Local : ./CCNA1.pdf`,
    p:["PDF + fiches = rÃ©vision active","Alterner lecture et pratique Packet Tracer","Garder une checklist par objectif"],
    w:"Lire passivement le PDF ne suffit pas ; il faut configurer."
   },
   {
    id:"ccna-ipv4v6", t:"IPv4/IPv6 et routage", level:"intermediaire",
    r:"OSI vs TCP/IP, IPv6 /64 pour LAN, link-local fe80::. OSPF single-area, statique + route par dÃ©faut.",
    tags:["ipv4","ipv6","ospf","routing"],
    g:["Packet Tracer : 2 routeurs + OSPF","Wireshark : observer ARP/DHCP/DNS","Tester le routage statique puis dynamique"],
    c:`ip route 0.0.0.0 0.0.0.0 192.168.1.1
show ip route
ipv6 address 2001:db8::1/64
router ospf 1
 network 10.0.0.0 0.255.255.255 area 0`,
    p:["AD : connected 0, static 1, OSPF 110","fe80:: = link-local","VLSM pour optimiser"],
    w:"Sans route par dÃ©faut, les rÃ©seaux locaux communiquent mais pas avec Internet."
   },
   {
    id:"ccna-switching", t:"Commutation : VLAN/STP/EtherChannel", level:"intermediaire",
    r:"Access vs trunk, STP bloque les boucles, EtherChannel agrÃ¨ge. Rapid-PVST recommandÃ©.",
    tags:["vlan","stp","etherchannel"],
    g:["CrÃ©er VLANs et trunk, tester ping inter-VLAN","VÃ©rifier le root STP","Configurer LACP et summary"],
    c:`spanning-tree mode rapid-pvst
show spanning-tree
interface range g0/1-2
 channel-group 1 mode active
show etherchannel summary`,
    p:["Root = smallest Bridge ID","LACP active/passive","BPDU Guard sur edge ports"],
    w:"Un trunk natif non changÃ© laisse passer le VLAN 1 partout."
   },
   {
    id:"ccna-security", t:"SÃ©curitÃ©, services et automatisation", level:"avance",
    r:"ACL, NAT/PAT, DHCP snooping, SSH, NTP, QoS, SDN, REST/Python pour opÃ©rations rÃ©pÃ©tables.",
    tags:["securite","services","sdn","automation"],
    g:["Activer SSH, dÃ©sactiver telnet","ACL sur VTY + interface","VÃ©rifier NTP synchronisÃ©","Controller SDN dashboard"],
    c:`access-list 10 permit 192.168.10.0 0.0.0.255
ip nat inside source list 10 interface g0/0 overload
username admin privilege 15 secret xxx
ip ssh version 2
ntp server 1.fr.pool.ntp.org
# Python netmiko
# from netmiko import ConnectHandler`,
    p:["Standard prÃ¨s source, Ã©tendue prÃ¨s destination","Automatiser = JSON/REST + Python","QoS : classify, mark, queue"],
    w:"SSH obligatoire, telnet interdit. Les ACL doivent Ãªtre journalisÃ©es."
   },
   {
    id:"ccna-troubleshoot", t:"MÃ©thodologie de dÃ©pannage", level:"intermediaire",
    r:"Collecter, analyser, tester des hypothÃ¨ses, implÃ©menter, vÃ©rifier, documenter. Toujours un changement Ã  la fois.",
    tags:["troubleshooting","methodologie"],
    g:["Reproduire le dÃ©faut","Isoler la couche (OSI)"," Tester avec outils simples","Documenter la solution"],
    c:`show running-config
show ip interface brief
show interfaces status
ping 8.8.8.8 source g0/0
traceroute 8.8.8.8
show logging`,
    p:["Diviser pour rÃ©gner","Changement unique pour identifier la cause","Checklist post-intervention"],
    w:"Ne jamais faire plusieurs changements en mÃªme temps en dÃ©pannage."
   },
   {
    id:"ccna-wireless", t:"WLAN : 802.11, WPA2/WPA3, roaming", level:"intermediaire",
    r:"BSS, ESS, SSID, couche 2 roaming, authentification 802.1X, WPA3-SAE. SÃ©curiser le Wi-Fi.",
    tags:["wifi","wlan","wireless","wpa3"],
    g:["Configurer contrÃ´leur WLC","SSID avec VLAN dÃ©diÃ©","RADIUS/802.1X","Roaming inter-AP"],
    c:`# Cisco WLC CLI (extrait)
config wlan create 1 CORP corp-ssid
config wlan security wpa akm 802.1x enable 1
config wlan interface 1 management
show wlan summary`,
    p:["Band steering 2.4/5 GHz","Fast roaming (802.11r/k/v)","WPA3 pour nouveaux dÃ©ploiements"],
    w:"Un SSID ouvert = risque majeur ; segmenter les invitÃ©s."
   },
   {
    id:"ccna-wan", t:"WAN, VPN et SD-WAN", level:"avance",
    r:"MPLS, IPsec site-Ã -site, DMVPN, SD-WAN pour le multi-site intelligent et rÃ©silient.",
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
  icon:"ðŸ“",
  title:"Examens blancs, dossier pro et rÃ©vision",
  desc:"MÃ©thode, MSP, dossier professionnel, QCM et simulation orale.",
  fiches:[
   {
    id:"exam-method", t:"MÃ©thode MSP et dossier professionnel", level:"exam",
    r:"Comprendre besoin â†’ maquetter â†’ dÃ©ployer â†’ tester â†’ documenter â†’ prÃ©senter. La documentation compte autant que la technique.",
    tags:["msp","dossier","oral","exam"],
    g:["Planifier 5 jours : 1 CCP/jour + blanc","RÃ©diger dossier : contexte, choix, configs, tests","Simuler oral 20 min + questions","Charger le matÃ©riel hors ligne"],
    c:`# Checklist :
# - schÃ©ma rÃ©seau Ã  jour
# - confs sauvegardÃ©es (run/start, exports)
# - tests ping/tracert + captures
# - tableau PRA RPO/RTO
# - justification de chaque choix`,
    p:["Justifier chaque choix technique","Apporter preuves de tests","Garder des captures horodatÃ©es"],
    w:"Sans documentation, la technique ne compte pas."
   },
   {
    id:"exam-qcm", t:"QCM express et auto-test", level:"exam",
    r:"Utiliser le module QCM du site pour s'Ã©valuer. Viser 80% avant jour J sur chaque thÃ©matique.",
    tags:["qcm","revision","test"],
    g:["Cocher les fiches 'Lues' pour la progression","Relire les points Warn avant l'examen","Faire 20 questions par CCP puis examen blanc"],
    c:`# Exemples :
# Q: 169.254.x.x signifie ? R: DHCP KO (APIPA)
# Q: Port SSH ? 22 - RDP ? 3389
# Q: /26 = ? 62 hÃ´tes
# Q: PDC ? temps + MDP`,
    p:["80% sans notes = niveau exam","Analyser les erreurs par catÃ©gorie","RÃ©viser les warn systÃ©matiques"],
    w:"Le QCM ne remplace pas la pratique sur Packet Tracer/VM."
   },
   {
    id:"exam-softskills", t:"Communication et prÃ©sentation orale", level:"exam",
    r:"Expliquer simplement, structurer la rÃ©ponse, gÃ©rer le stress et les imprÃ©vus. Le jury Ã©value la posture professionnelle.",
    tags:["oral","communication","softskills"],
    g:["Structure : problÃ¨me, diagnostic, solution, preuve","RÃ©pÃ©ter Ã  haute voix","PrÃ©parer des rÃ©ponses courtes","GÃ©rer les questions inconnues avec honnÃªtetÃ©"],
    c:`# ModÃ¨le rÃ©ponse orale
# 1. Ce que j'ai observÃ©
# 2. La cause probable
# 3. L'action effectuÃ©e
# 4. La vÃ©rification
# 5. La documentation`,
    p:["Ne pas bluffer ; proposer une piste de recherche","Montrer les schÃ©mas","Restaurer la confiance aprÃ¨s une erreur"],
    w:"Un examinateur prÃ©fÃ¨re l'honnÃªtetÃ© Ã  une rÃ©ponse inventÃ©e."
   },
   {
    id:"exam-checklist", t:"Checklist jour J et matÃ©riel", level:"exam",
    r:"PrÃ©paration logistique autant que technique : VM, outils, documents, identifiants, sauvegardes hors ligne.",
    tags:["checklist","examen","preparation"],
    g:["VÃ©rifier les VMs et les ISO","Exporter les configs et PDFs","Charger le matÃ©riel sans rÃ©seau","Dormir suffisamment"],
    c:`# Checklist jour J
# - VMs dÃ©marrÃ©es
# - Packet Tracer installÃ©
# - CCNA1.pdf local
# - Credentials dans coffre
# - Sauvegardes USB`,
    p:["Batterie et chargeur","Souris filaire de secours","Eau et pauses"],
    w:"Un matÃ©riel dÃ©faillant ne doit pas ruiner des mois de prÃ©paration."
   }
  ]
}
]);

