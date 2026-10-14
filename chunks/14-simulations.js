const G = window.GUIDE;
G.sections = G.sections || [];
G.sections.push({
 id:"exemples",
 group:"TSSR",
  icon:"🧪",
 title:"Exemples pratiques & simulations",
 desc:"Mises en situation pas � pas (GUI + CLI) pour comprendre par l'action.",
 fiches:[
  {
   id:"sim-poste-sans-internet", t:"Simulation : poste Windows sans internet", level:"debutant",
   r:"Poste en DHCP avec IP APIPA (169.254.x.x) : pas de r�ponse serveur DHCP. On v�rifie couche par couche.",
   tags:["simulation","reseau","poste","dhcp"],
   g:["Ouvrir Centre R�seau et partage : l'IP est 169.254.42.17","Tester ping 127.0.0.1 (OK) puis ping passerelle (KO)","Red�marrer la carte ou ipconfig /renew","V�rifier le serveur DHCP (�tendue, bail)"],
   c:`ipconfig /all
ping 127.0.0.1
ping 192.168.1.1
ipconfig /release
ipconfig /renew
ipconfig /flushdns`,
   p:["APIPA = 169.254.0.0/16","Le d�faut peut venir d'un c�ble ou d'un VLAN","Tracer les changements dans le ticket"],
   w:"Ne pas mettre une IP fixe � pour faire marcher � sans diagnostic."
  },
  {
   id:"sim-creation-user-ad", t:"Simulation : cr�er un utilisateur AD puis tester", level:"debutant",
   r:"Cr�ation compl�te d'un compte et validation de la connexion + GPO.",
   tags:["simulation","ad","compte"],
   g:["ADUC : nouvelle OU Users","Cr�er l'utilisateur Jean Martin","Ajouter au groupe G_Compta","Se connecter sur un poste du domaine"],
   c:`New-ADUser -Name "Jean Martin" -SamAccountName jmartin -GivenName Jean -Surname Martin -Enabled $true -Path "OU=Users,DC=tssr,DC=local" -AccountPassword (ConvertTo-SecureString 'Temp2026!' -AsPlainText -Force) -ChangePasswordAtLogon $true
Add-ADGroupMember -Identity G_Compta -Members jmartin
gpupdate /force
gpresult /r`,
   p:["Le mot de passe doit �tre chang� � la premi�re ouverture","V�rifier les GPO appliqu�es","Garder les preuves pour le dossier pro"],
   w:"Un compte cr�� dans la mauvaise OU h�rite de mauvaises GPO."
  },
  {
   id:"sim-vlan-cisco", t:"Simulation : VLAN et trunk Cisco", level:"intermediaire",
   r:"Mettre deux PC dans deux VLAN puis v�rifier l'isolation et le trunk.",
   tags:["simulation","cisco","vlan"],
   g:["Packet Tracer : switch + 2 PC","Cr�er VLAN 10 et 20, affecter les ports","Configurer le trunk entre deux switches","Test ping intra/inter VLAN"],
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
   p:["Sans routeur, les VLAN sont isol�s","show interfaces trunk r�v�le les VLAN autoris�s","Sauvegarder startup-config"],
   w:"Un VLAN non autoris� sur le trunk coupe silencieusement la communication."
  },
  {
   id:"sim-routage-inter-vlan", t:"Simulation : routage inter-VLAN (router-on-a-stick)", level:"intermediaire",
   r:"Un routeur avec sous-interfaces .10/.20 route entre VLAN.",
   tags:["simulation","cisco","routing","vlan"],
   g:["Connecter switch (trunk) au routeur","Cr�er sous-interfaces dot1Q","Configurer IP passerelle par VLAN","Tester ping entre VLAN"],
   c:`interface g0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
interface g0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
no shutdown
show ip route
show ip interface brief`,
   p:["Le port physique doit �tre no shutdown","Les passerelles sont les SVI/router subif","Tester avec ping puis DNS"],
   w:"Un trunk natif mal d�fini casse tout le routage."
  },
  {
   id:"sim-acl", t:"Simulation : ACL et test de blocage", level:"intermediaire",
   r:"Bloquer un sous-r�seau A vers B sur le port 80, puis v�rifier.",
   tags:["simulation","acl","cisco","securite"],
   g:["Cr�er l'ACL �tendue","L'appliquer en entr�e sur l'interface","Tester ping/HTTP depuis le r�seau bloqu�","Consulter les compteurs"],
   c:`ip access-list extended LAN-BLOCK
 permit ip any any
 deny tcp 192.168.10.0 0.0.0.255 192.168.20.0 0.0.0.255 eq 80
interface g0/1
 ip access-group LAN-BLOCK in
show access-lists`,
   p:["L'ordre des r�gles compte","deny implicite � la fin","Tester dans les deux sens"],
   w:"Une ACL sur la mauvaise interface bloque tout le trafic."
  },
  {
   id:"sim-linux-users", t:"Simulation : utilisateurs, groupes et SSH", level:"debutant",
   r:"Cr�er un compte, lui donner sudo, configurer une cl� SSH et tester la connexion distante.",
   tags:["simulation","linux","users","ssh"],
   g:["Cr�er l'utilisateur alice sur le serveur","Ajouter la cl� publique","D�sactiver l'authentification par mot de passe","Se connecter avec la cl�"],
   c:`useradd -m -s /bin/bash alice
usermod -aG sudo alice
ssh-keygen -t ed25519 -C "alice@tssr"
ssh-copy-id alice@192.168.1.20
# /etc/ssh/sshd_config
PasswordAuthentication no
systemctl reload sshd
ssh alice@192.168.1.20`,
   p:["Toujours tester la cl� avant de d�sactiver le password","sudo -l pour v�rifier","Journaliser l'acc�s"],
   w:"Se couper l'acc�s SSH est l'erreur la plus fr�quente."
  },
  {
   id:"sim-lvm", t:"Simulation : ajout de disque avec LVM", level:"avance",
   r:"Ajouter un disque, le transformer en volume logique mont�.",
   tags:["simulation","linux","lvm","stockage"],
   g:["Brancher le disque et rep�rer /dev/sdb","Cr�er PV, VG, LV","Formater et monter","Ajouter � fstab"],
   c:`lsblk
pvcreate /dev/sdb
vgcreate vg_data /dev/sdb
lvcreate -L 10G -n lv_data vg_data
mkfs.ext4 /dev/vg_data/lv_data
mount /dev/vg_data/lv_data /opt/data
echo "/dev/vg_data/lv_data /opt/data ext4 defaults 0 2" >> /etc/fstab
mount -a`,
   p:["XFS pour gros volumes","Ne jamais fsck un volume mont�","Snapshot LVM avant MAJ"],
   w:"fstab erron� peut emp�cher le boot."
  },
  {
   id:"sim-apache-restriction", t:"Simulation : site Apache restreint par IP", level:"intermediaire",
   r:"D�ployer un site en DMZ et limiter l'acc�s aux IP internes.",
   tags:["simulation","apache","dmz","securite"],
   g:["Installer Apache","Cr�er un vhost intranet","Restreindre par Require ip","Recharger et tester"],
   c:`apt install apache2 -y
a2ensite intranet
# /etc/apache2/sites-available/intranet.conf
<Directory /var/www/intranet>
 Require ip 192.168.1.0/24
</Directory>
systemctl reload apache2
curl -I http://intranet`,
   p:["Reverse proxy recommand�","Logs + rotation","TLS pour production"],
   w:"Oublier la r�gle Allow/Deny bloque tout acc�s."
  },
  {
   id:"sim-backup-test", t:"Simulation : sauvegarde et test de restore", level:"intermediaire",
   r:"Sauvegarder un dossier puis le restaurer dans un emplacement de test et v�rifier l'int�grit�.",
   tags:["simulation","backup","restore"],
   g:["Cr�er des fichiers de test","Lancer une sauvegarde tar/rsync","Supprimer les originaux","Restaurer et comparer"],
   c:`mkdir -p /data/test && echo ok > /data/test/f.txt
tar -czf /backup/test-$(date +%F).tgz /data/test
rm -rf /data/test
mkdir -p /restore/test
tar -xzf /backup/test-$(date +%F).tgz -C /restore
diff -r /restore/data/test /data 2>/dev/null || echo restored`,
   p:["RPO/RTO d�finis","Checksums pour l'int�grit�","Conserver hors ligne"],
   w:"Une sauvegarde non test�e n'est pas une sauvegarde."
  },
  {
   id:"sim-dns-trace", t:"Simulation : diagnostic DNS de bout en bout", level:"intermediaire",
   r:"Nom qui ne r�sout pas : tests DNS client/serveur, zone et enregistrement.",
   tags:["simulation","dns","diagnostic"],
   g:["Ping par IP (OK) puis par nom (KO)","nslookup pour identifier le serveur","V�rifier la zone et lenregistrement A","Purger le cache et retester"],
   c:`ping 192.168.1.10
ping srv1.tssr.local
nslookup srv1.tssr.local
nslookup srv1.tssr.local 192.168.1.10
ipconfig /flushdns
# Serveur DNS :
Get-DnsServerResourceRecord -ZoneName tssr.local -Name srv1`,
   p:["Le poste doit pointer vers le bon DNS","Scavenging pour nettoyer","V�rifier la zone inverse PTR"],
   w:"Un mauvais DNS c�t� client casse Kerberos/AD."
  }
 ]
});
const groupRank = { 'TSSR': 0, 'CCNA': 1, 'Examens': 2 };
G.sections.sort((a, b) => (groupRank[a.group] ?? 9) - (groupRank[b.group] ?? 9));
