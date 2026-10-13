const G = window.GUIDE;
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