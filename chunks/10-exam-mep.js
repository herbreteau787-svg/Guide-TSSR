const G = window.GUIDE;
const sec = G.sections.find(s => s.id === 'exam');
if (sec) {
  sec.fiches.push(
   { id:"exam-mep-structure", t:"Mise en situation professionnelle (MEP) — déroulé", level:"exam", r:"Le TSSR passe une mise en situation pratique sur un ou deux jours : manipulations sur VM, présentation et incident réseau avec le jury.", tags:["mep","examen","pratique"], g:["Lire les tickets et repérer les dépendances","Demander l'ordre des interventions","Screens de toutes les actions","Préparer une présentation claire"], c:`# v2 : 2 phases (90 min pratique + 45 min jury)
# v2026 : 3 phases (210 min pratique + 45 min présentation + 30 min incident réseau)
# Matériel : Internet/IA/IA sans auth selon version, cours en ligne sans auth, pas de tel/montre`, p:["Se repérer dans l'infra fournie","Documenter chaque étape","Justifier les choix"], w:"Ne pas communiquer pendant la phase 1 (pas de chat/forum)." },
   { id:"exam-phase1-tasks", t:"Tâches type phase 1 (Windows/Linux/DNS/Scripts)", level:"exam", r:"Créer users/groupes/OU, partages, GPO, script PowerShell, diagnostic Linux, Apache, crontab, backup, FreePBX test.", tags:["mep","ad","linux","scripts"], g:["AD : user, groupe, UO, verrouillage, horaires, partage, GPO","PowerShell : commentaire/modification et test","Linux : SSH port/root/clés, droits, processus, cron","FreePBX : user + softphone + appel test"], c:`# Windows
New-ADUser dupont -Enabled $true
New-SmbShare ...
# Linux
sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
systemctl restart sshd`, p:["Backup logs","Automatiser mise à jour","Calcul IP classe C"], w:"Toujours tester et garder la preuve." },
   { id:"exam-phase2", t:"Phase 2 — présentation et questions jury", level:"exam", r:"Expliquer sa production, les preuves, les difficultés, les éléments non terminés et transmettre au collègue.", tags:["oral","presentation"], g:["Organiser les captures dans l'ordre","Expliquer cause et vérification","Reconnaître les limites","Préparer réponses courtes"], c:`# Exemples de questions jury
# Compte et droits : comment vérifier l'accès ?
# Incident Linux : quel élément a identifié l'erreur ?
# DNS : que prouve le test de résolution ?
# Scripts IA : quelle proposition corrigée ?`, p:["Le jury évalue la posture et la justification","Un résultat partiel bien expliqué est acceptable"], w:"Ne jamais masquer une erreur pendant l'oral." },
   { id:"exam-phase3", t:"Phase 3 — incident réseau devant le jury", level:"exam", r:"Qualifier, vérifier IP/masque/passerelle/DNS, localiser le VLAN/port, corriger, tester, conclure.", tags:["incident","reseau","vlan"], g:["Demander depuis quand et ce qui a changé","Comparer avec plan réseau","Vérifier affectation port/VLAN","Tester accès réel"], c:`# Panne type : port affecté au mauvais VLAN
show vlan brief
show interfaces status
# correction port access vlan X`, p:["Une seule modification à la fois","Expliquer simplement la cause"], w:"La cause racine n'est pas toujours réseau ; garder le diagnostic couche par couche." },
   { id:"exam-materiel", t:"Matériel autorisé/interdit (jour J)", level:"exam", r:"Internet/IA selon phase, cours en ligne, pas de téléphone/montre connectée ; rien en phase 2/3 sauf Word.", tags:["materiel","examen"], g:["Stocker les cours sur site sans auth","Prévoir VM et outils","Chargeur + souris filaire","Batterie"], c:`# Checklist jour J
# - VMs démarrées
# - Packet Tracer installé
# - CCNA/TSSR notes en ligne
# - Word/PowerPoint prêt`, p:["Sauvegardes USB hors ligne","Réseau instable : penser offline"], w:"Vérifier l'accès aux cours depuis le centre avant l'épreuve." },
   { id:"exam-fondamentaux", t:"Fondamentaux à connaître (questions)", level:"exam", r:"Calculs IP, VoIP, stack AMP, AD, GPO, partages, DHCP, droits, virtualisation, scripting, redondance, cyber organismes, OSI.", tags:["fondamentaux","revision"], g:["Réviser chaque fondamental avec pratique","Tableau de ports et VLSM","Checklist confs par service"], c:`# À réciter
# OSI/TCP-IP + ARP + VLAN inter-VLAN
# AGDLP + LSDOU
# SSH + cron + Apache
# RPO/RTO + 3-2-1`, p:["Les questions orales portent sur le 'pourquoi'","Apporter des schémas"], w:"Un fondamental oublié casse la justification devant le jury." }
  );
}
const _examIdx = (G.sections || []).findIndex(s => s.id === 'exam');
if (_examIdx !== -1) {
  const _examSec = G.sections.splice(_examIdx, 1)[0];
  G.sections.push(_examSec);
}
