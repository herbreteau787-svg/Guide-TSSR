const G = window.GUIDE;
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