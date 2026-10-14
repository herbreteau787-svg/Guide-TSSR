const G = window.GUIDE;
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