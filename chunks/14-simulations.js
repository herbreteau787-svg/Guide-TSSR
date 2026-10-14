const G = window.GUIDE;
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
