const G = window.GUIDE;
G.labs = G.labs || [];
G.labs.push(...[
{
 id:"lab-vlan", title:"Lab 1 � VLAN et trunk entre 2 switches", section:"ccp4", level:"intermediaire", duration:"45 min",
 objective:"Cr�er VLAN 10/20, trunk 802.1Q et v�rifier la connectivit� inter-VLAN via un routeur.",
 prerequisites:["Packet Tracer install�","Connaissance IP de base"],
 steps:[
  "Topologie : 2 switches, 1 routeur, 4 PC.",
  "Cr�er VLAN 10 (COMPTA) et 20 (INFO) sur les 2 switches.",
  "Assigner PC1/PC2 en VLAN 10, PC3/PC4 en VLAN 20.",
  "Configurer trunk sur le lien inter-switch (allowed vlan 10,20).",
  "Configurer sous-interfaces routeur 802.1Q pour inter-VLAN.",
  "Tester ping inter-VLAN et traceroute."
 ],
 validation:["show vlan brief affiche les VLAN","show interfaces trunk montre le lien","Ping inter-VLAN OK"],
 troubleshooting:["V�rifier native VLAN","Port en access non assign�","Trunk allowed list incompl�te"]
},
{
 id:"lab-ospf", title:"Lab 2 � OSPF single-area", section:"ccp4", level:"avance", duration:"60 min",
 objective:"Mettre en place OSPF area 0 entre 3 routeurs et v�rifier la table de routage.",
 prerequisites:["Notions de masque CIDR"],
 steps:[
  "Topologie 3 routeurs en triangle",
  "Configurer les IPs et le loopback",
  "Activer OSPF process 1 et annoncer les r�seaux",
  "V�rifier voisins et LSDB",
  "Injecter une route par d�faut",
  "Tester la convergence apr�s coupure"
 ],
 validation:["show ip ospf neighbor = Full","show ip route O","Ping end-to-end"],
 troubleshooting:["Area mismatch","MTU mismatch","Passive-interface oubli�"]
},
{
 id:"lab-acl", title:"Lab 3 � ACL �tendue et test", section:"ccp4", level:"intermediaire", duration:"30 min",
 objective:"Cr�er une ACL pour bloquer SSH depuis un VLAN et autoriser HTTPS.",
 prerequisites:["Lab VLAN"],
 steps:[
  "D�finir l'ACL nomm�e LAN-FILTER",
  "Ajouter deny tcp VLAN10 any eq 22",
  "Ajouter permit ip any any",
  "Appliquer inbound sur interface LAN",
  "Tester SSH refus� et HTTPS autoris�",
  "Journaliser les refus"
 ],
 validation:["show access-lists compte les hits","SSH timeout, HTTPS OK"],
 troubleshooting:["Direction de l'ACL invers�e","Ordre des r�gles","Masque wildcard erron�"]
},
{
 id:"lab-ad", title:"Lab 4 � For�t AD + DNS + jonction", section:"ccp2", level:"intermediaire", duration:"90 min",
 objective:"Installer AD DS sur S1, cr�er OU/groupes, puis joindre un poste et appliquer une GPO.",
 prerequisites:["VM Windows Server", "Client Windows"],
 steps:[
  "Installer le r�le AD DS + DNS via PowerShell",
  "Promouvoir en for�t tssr.local avec DSRM",
  "Cr�er OU Structure et groupes (G/LD)",
  "Joindre le poste PC01 au domaine",
  "Cr�er GPO de fond d'�cran et de script",
  "Tester gpupdate et gpresult"
 ],
 validation:["dcdiag /q OK","nslookup tssr.local","gpresult /r affiche la GPO"],
 troubleshooting:["Horloge > 5 min","DNS poste non point� vers DC","Firewall AD non autoris�"]
},
{
 id:"lab-gpo", title:"Lab 5 � GPO de d�ploiement logiciel", section:"ccp2", level:"intermediaire", duration:"40 min",
 objective:"D�ployer 7-Zip par GPO et v�rifier sur un poste pilote.",
 prerequisites:["AD fonctionnel"],
 steps:[
  "Placer le MSI dans \\domaine\\NETLOGON",
  "Cr�er GPO 'Deploy-7zip'",
  "Ajouter l'installation sous ordinateur",
  "Filtrer par OU Pilote",
  "Forcer gpupdate /force et red�marrer",
  "V�rifier dans Programmes"
 ],
 validation:["�v�nement 1033 Application","7zip install�"],
 troubleshooting:["Architecture x86/x64","GPO non li�e � l'OU","Cache MSI corrompu"]
},
{
 id:"lab-linux-base", title:"Lab 6 � Administration Linux de base", section:"ccp3", level:"debutant", duration:"45 min",
 objective:"Cr�er utilisateurs/groupes, s�curiser SSH et g�rer un service systemd.",
 prerequisites:["VM Linux Ubuntu"],
 steps:[
  "Mettre � jour les paquets",
  "Cr�er l'utilisateur admin et le groupe dev",
  "G�n�rer et d�ployer une cl� SSH",
  "D�sactiver le login root direct",
  "Installer nginx comme service",
  "V�rifier le journal nginx"
 ],
 validation:["ssh par cl� OK, password refus�","systemctl is-active nginx"],
 troubleshooting:["UFW bloque 22","Cl� avec mauvaises permissions","SELinux si RHEL"]
},
{
 id:"lab-netplan", title:"Lab 7 � IP statique Netplan", section:"ccp3", level:"debutant", duration:"20 min",
 objective:"Attribuer une IP statique via Netplan et tester.",
 prerequisites:["Lab Linux de base"],
 steps:[
  "�diter /etc/netplan/01-netcfg.yaml",
  "D�finir IP, gateway, DNS",
  "netplan apply",
  "Tester IP, route, ping DNS",
  "Corriger en cas d'erreur YAML"
 ],
 validation:["ip a affiche la nouvelle IP","Resolv fonctionnel"],
 troubleshooting:["Indentation YAML","Interface nomm�e diff�remment","Perte de connexion SSH"]
},
{
 id:"lab-lvm", title:"Lab 8 � LVM et montage", section:"ccp3", level:"avance", duration:"45 min",
 objective:"Cr�er PV/VG/LV, formater et monter avec fstab.",
 prerequisites:["Disque suppl�mentaire attach�"],
 steps:[
  "lsblk pour identifier le disque",
  "pvcreate, vgcreate, lvcreate",
  "mkfs.ext4",
  "mount et test",
  "Ajouter � fstab et mount -a",
  "Cr�er un snapshot"
 ],
 validation:["df -h affiche le montage","mount -a sans erreur"],
 troubleshooting:["fstab mal renseign�","VG existant","Snapshot plein"]
},
{
 id:"lab-pfsense", title:"Lab 9 � pfSense base + NAT", section:"ccp7", level:"intermediaire", duration:"60 min",
 objective:"Installer pfSense, cr�er LAN/WAN, NAT outbound et une r�gle de blocage.",
 prerequisites:["VM pfSense"],
 steps:[
  "Installer pfSense et d�finir interfaces",
  "Acc�der � l'interface web",
  "Configurer WAN (DHCP) et LAN (static)",
  "V�rifier Outbound NAT automatique",
  "Cr�er une r�gle pour bloquer Facebook",
  "Tester depuis un poste LAN"
 ],
 validation:["Poste LAN obtient IP","Navigation HTTP/HTTPS OK sauf r�gle"],
 troubleshooting:["Interfaces invers�es","DNS resolver non actif","R�gle mal plac�e"]
},
{
 id:"lab-vpn", title:"Lab 10 � VPN OpenVPN nomade", section:"ccp7", level:"avance", duration:"60 min",
 objective:"Configurer OpenVPN sur pfSense et connecter un client externe.",
 prerequisites:["Lab pfSense"],
 steps:[
  "Cr�er une CA et certificat serveur",
  "Assistant OpenVPN wizard",
  "Exporter la configuration client",
  "Importer dans le client OpenVPN",
  "Tester depuis 4G",
  "V�rifier la route vers LAN"
 ],
 validation:["Tunnel �tabli","Ping serveur LAN via VPN"],
 troubleshooting:["Port 1194 bloqu� ISP","Certificat invalide","R�seau client identique au LAN"]
},
{
 id:"lab-esxi", title:"Lab 11 � ESXi : VM, vSwitch et snapshot", section:"ccp5", level:"intermediaire", duration:"60 min",
 objective:"Installer ESXi, cr�er VM Windows, vSwitch et tester un snapshot.",
 prerequisites:["Serveur physique/VM imbriqu�e"],
 steps:[
  "Installer ESXi et acc�der au host client",
  "Cr�er un vSwitch et portgroup",
  "Cr�er VM avec disque thin",
  "Installer Windows et VMware Tools",
  "Snapshot avant MAJ",
  "D�montrer restore snapshot"
 ],
 validation:["VM d�marre","Tools install�s","Snapshot fonctionnel"],
 troubleshooting:["VT-x non activ�","R�seau vmnic incorrect","Espace datastore insuffisant"]
},
{
 id:"lab-docker", title:"Lab 12 � Docker web + DB", section:"containers", level:"intermediaire", duration:"45 min",
 objective:"D�ployer nginx + postgres avec Docker Compose et donn�es persistantes.",
 prerequisites:["Docker install�"],
 steps:[
  "Cr�er le fichier compose.yaml",
  "Lancer les services",
  "V�rifier les logs",
  "Cr�er une page web",
  "Red�marrer et v�rifier la persistance DB",
  "Arr�ter proprement"
 ],
 validation:["docker compose ps healthy","Donn�es DB persistantes"],
 troubleshooting:["Port d�j� utilis�","Volume anonyme","Healthcheck mal configur�"]
},
{
 id:"lab-terraform", title:"Lab 13 � Terraform basique", section:"iac", level:"avance", duration:"60 min",
 objective:"Provisionner une VM avec Terraform contre un hyperviseur local.",
 prerequisites:["Terraform + provider vSphere/vSphere"],
 steps:[
  "Initialiser le r�pertoire",
  "D�finir provider et ressource VM",
  "terraform plan",
  "terraform apply",
  "Exporter l'IP en output",
  "D�truire avec destroy"
 ],
 validation:["apply r�ussit","VM visible dans vCenter"],
 troubleshooting:["Auth vCenter","State lock","Version provider"]
},
{
 id:"lab-sysprep", title:"Lab 14 � Sysprep et capture", section:"ccp9", level:"intermediaire", duration:"60 min",
 objective:"Pr�parer une image Windows de r�f�rence avec Sysprep et la capturer.",
 prerequisites:["VM Windows configur�e"],
 steps:[
  "Installer OS de base et MAJ",
  "Installer apps standard",
  "Ex�cuter Sysprep /oobe /generalize /shutdown",
  "Capturer avec DISM",
  "V�rifier le WIM",
  "D�ployer via WDS"
 ],
 validation:["Sysprep termin� sans erreur","Image bootable"],
 troubleshooting:["Software protection service","Profil utilisateur r�siduel","Erreur OOBE"]
},
{
 id:"lab-backup", title:"Lab 15 � Sauvegarde et restore", section:"ccp8", level:"intermediaire", duration:"50 min",
 objective:"Sauvegarder un serveur et restaurer sur une VM distincte.",
 prerequisites:["2 VM"],
 steps:[
  "Cr�er le job Veeam/WBadmin",
  "Lancer la sauvegarde",
  "Simuler panne (supprimer fichier)",
  "Restaurer le fichier",
  "Restaurer VM enti�re vers autre host",
  "Valider les services"
 ],
 validation:["Fichier restaur�","VM bootable"],
 troubleshooting:["Licence Veeam","Chemin r�seau","Point de restauration manquant"]
},
{
 id:"lab-qos", title:"Lab 16 � QoS sur routeur Cisco", section:"ccna", level:"avance", duration:"45 min",
 objective:"Marquer et prioriser le trafic voix avec CBWFQ/LLQ.",
 prerequisites:["Lab OSPF ou VLAN"],
 steps:[
  "Cr�er une ACL pour le trafic RTP",
  "Class-map et policy-map",
  "Appliquer service-policy sur l'interface WAN",
  "G�n�rer du trafic et v�rifier les compteurs",
  "Tuner les d�bits",
  "Documenter"
 ],
 validation:["show policy-map interface affiche des hits","Voix non d�grad�e sous charge"],
 troubleshooting:["Bandwidth manquant","Place de la policy","MTU"]
}
]);