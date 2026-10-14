const G = window.GUIDE;
const sec = G.sections.find(s => s.id === 'exam');
if (sec) {
  sec.fiches = [
   { id:"exam-q-ad", t:"QCM/R�ponse : comment v�rifie-t-on un acc�s AD ?", level:"exam", r:"On v�rifie l'utilisateur avec Get-ADUser, l'appartenance aux groupes, puis le droit effectif sur la ressource avec test r�el et revue des ACL. V�rification : acc�s accord� uniquement au profil autoris� et refus pour le profil non autoris�.", tags:["exam","ad","droits"], g:["1. Lister les groupes via ADUC ou Get-ADGroupMember","2. Tester le partage avec l'utilisateur","3. Lire les ACL NTFS et partage","4. Documenter le test de non-r�gression"], c:`Get-ADUser jdupont -Properties MemberOf
Get-ADGroupMember "LD_PartageCompta" -Recursive
Test-Path \\\\serveur\\compta
# NSS: icacls et Get-Acl`, p:["Penser au moindre privil�ge","Un refus clair prouve que la matrice est respect�e"], w:"V�rifier seulement l'AD sans tester la ressource ne prouve rien." },
   { id:"exam-q-reseau", t:"QCM/R�ponse : un poste n'acc�de plus au r�seau, diagnostic ?", level:"exam", r:"On suit la couche par couche : c�ble/Voyant, IP/passerelle/DNS, ping par IP puis par nom, trace. On corrige un �l�ment � la fois et on reteste.", tags:["exam","reseau","diagnostic"], g:["ipconfig /all et ping passerelle","Ping 8.8.8.8 puis nslookup","Comparer le plan r�seau et le VLAN du port","Corriger DHCP/VLAN/passerelle"], c:`ipconfig /all
ping 192.168.1.1
ping 8.8.8.8
nslookup google.com
tracert google.com`, p:["169.254 = APIPA/DHCP KO","Ping IP OK mais nom KO = DNS","Tracert s'arr�tant � la passerelle = routage"], w:"Ne pas changer IP et DNS en m�me temps : la cause devient floue." },
   { id:"exam-q-vlan", t:"QCM/R�ponse : pourquoi un port d'acc�s mal affect� isole un poste ?", level:"exam", r:"La communication L2 se limite au VLAN du port. Si le poste est en VLAN non attendu, il est dans un domaine de broadcast diff�rent sans passerelle inter-VLAN.", tags:["exam","vlan","switch"], g:["show vlan brief","show interfaces status","show running-config interface f0/x","corriger access vlan et tester"], c:`show interface f0/5 switchport
show vlan brief
conf t
interface f0/5
 switchport access vlan 20
end`, p:["VLAN natif et allowed VLAN � v�rifier sur les trunks","Tester depuis le poste apr�s correction"], w:"Un VLAN silencieux donne un faux r�seau op�rationnel." },
   { id:"exam-q-linux", t:"QCM/R�ponse : comment s�curiser l'acc�s SSH ?", level:"exam", r:"Authentification par cl� ed25519, d�sactivation du root direct, PasswordAuthentication no, et test avant fermeture de session. Conclure avec journalisation.", tags:["exam","ssh","linux","securite"], g:["G�n�rer une cl� c�t� client","Copier la cl� publique","Modifier sshd_config","Recharger sshd et tester"], c:`ssh-keygen -t ed25519 -C admin@tssr
ssh-copy-id user@serveur
# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
systemctl reload sshd`, p:["Toujours tester la cl� dans un second terminal","Conserver emergency access","Versionner la config distante"], w:"D�sactiver le password avant d'avoir test� la cl� coupe l'acc�s." },
   { id:"exam-q-cron", t:"QCM/R�ponse : comment mettre une sauvegarde automatique fiable ?", level:"exam", r:"Script avec shebang, variables, journal, code retour. Planifier dans cron � 02:30 et v�rifier le lendemain. Expliquer chaque ligne � l'oral.", tags:["exam","cron","backup","linux"], g:["Cr�er le script sous /opt/scripts","chmod +x","crontab -e","V�rifier le log et le code de retour"], c:`30 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
# dans le script :
set -euo pipefail
rsync -av --delete /srv/data/ /backup/data/
echo "code=$?"`, p:["Chemins absolus","Rediriger stdout et stderr","Tester manuellement le script"], w:"Les variables d'environnement interactif ne sont pas transmises � cron." },
   { id:"exam-q-ad", t:"QCM/R�ponse : cr�er un utilisateur, ses groupes et un partage", level:"exam", r:"Cr�er l'OU et le user, ajouter aux groupes Global/DomainLocal (AGDLP), cr�er le partage, configurer ACL, puis tester acc�s autoris� et non autoris�.", tags:["exam","ad","agdlp","partage"], g:["ADUC : OU, user, groupes","SMB share + ACL NTFS","gpresult pour GPO applicables","Test dans session utilisateur"], c:`New-ADUser jdupont -Enabled $true
New-ADGroup -Name G_Compta -GroupScope Global
Add-ADGroupMember LD_PartageCompta -Members G_Compta
New-SmbShare -Name Compta -Path D:\\Shares\\Compta`, p:["Permissions les plus restrictives gagnent","S�parer Global et DomainLocal","Documenter la matrice d'acc�s"], w:"Ajouter directement un user au groupe DomainLocal casse la tra�abilit�." },
   { id:"exam-q-snap", t:"QCM/R�ponse : diff�rences snapshot, sauvegarde et restauration ?", level:"exam", r:"Snapshot = point temporel d�pendant de la VM source, sauvegarde = copie ind�pendante et test�e, restauration = remise en exploitation v�rifi�e.", tags:["exam","vmware","backup","pra"], g:["Snapshot avant maintenance","Sauvegarde planifi�e nightly","Restauration dans VM isol�e","Valider la connexion et les services"], c:`# RPO = perte max acceptable
# RTO = dur�e de panne acceptable
# Test : fichier puis VM enti�re`, p:["R�gle 3-2-1","Copie hors site","Immutabilit� anti-ransomware"], w:"Un snapshot laiss� trop longtemps d�grade les performances." },
   { id:"exam-q-oral", t:"QCM/R�ponse : comment pr�senter une mise en situation � l'oral ?", level:"exam", r:"Contexte, objectif, actions, preuves, difficult�s et am�liorations. R�pondre avec m�thode, admettre ce qui n'est pas fini.", tags:["exam","oral","presentation","jury"], g:["Organiser captures par ordre chronologique","Expliquer cause et v�rification","Justifier les choix","Reconna�tre les limites"], c:`# Structure
1. Contexte du ticket
2. Analyse et cause
3. Solution mise en place
4. Preuves et tests
5. Ce qui reste � faire`, p:["Une r�ponse courte et juste vaut mieux qu'une improvisation","Le jury �value la trajectoire, pas uniquement le r�sultat"], w:"Ne jamais masquer une erreur ou une �tape non termin�e." }
  ];
  const _examIdx = (G.sections || []).findIndex(s => s.id === 'exam');
  if (_examIdx !== -1) {
    const _examSec = G.sections.splice(_examIdx, 1)[0];
    G.sections.push(_examSec);
  }
}