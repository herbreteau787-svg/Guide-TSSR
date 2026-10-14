const G = window.GUIDE;

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
