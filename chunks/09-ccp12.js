const G = window.GUIDE;
const push = (arr) => G.sections.push(...arr);
push([
{
  id:"ccp12",
  group:"TSSR",
  icon:"=�",
  title:"CCP12 � Cybers�curit� et durcissement",
  desc:"Posture de s�curit�, ANSSI, d�tection, pr�vention et r�ponse.",
  fiches:[
   { id:"cyber-anssi", t:"R�f�rentiels s�curit� (ANSSI, CERT-FR, RGPD)", level:"intermediaire", r:"Conna�tre les organismes, recommandations d'hygi�ne et obligations l�gales. Sensibiliser et gouverner les acc�s.", tags:["cyber","anssi","rgpd"], g:["Lire le guide d'hygi�ne informatique ANSSI","Suivre les alertes CERT-FR","Cartographier les donn�es personnelles","Appliquer le RGPD"], c:`# Ressources
# ANSSI : https://www.ssi.gouv.fr
# CERT-FR : https://www.cert.ssi.gouv.fr
# ANSSI 40 mesures essentielles`, p:["Cadre gestion des risques (EBIOS RM)","Sensibilisation r�guli�re","Audit et exercices d'incident"], w:"La s�curit� est un processus continu, pas un projet ponctuel." },
   { id:"cyber-hygiene", t:"Hygi�ne poste et durcissement", level:"intermediaire", r:"Mettre � jour, limiter les droits, chiffrer, d�sactiver services inutiles, prot�ger les navigateurs.", tags:["hardening","endpoint"], g:["Patch OS et apps automatiquement","Activer BitLocker/LUKS","D�sactiver services inutiles","Configurer Pare-feu h�te"], c:`# Windows
Get-MpComputerStatus
# Linux
apt unattended-upgrade -d
ufw enable
lynis audit system`, p:["Mots de passe g�r�s (gestionnaire)","MFA obligatoire admins","Chiffrement des disques"], w:"Un poste non patch� est la porte d'entr�e la plus courante." },
   { id:"cyber-reseau", t:"Segmentation, firewall et DMZ", level:"intermediaire", r:"Segmenter par VLAN, limiter les flux, journaliser, surveiller les connexions anormales.", tags:["reseau","firewall","dmz"], g:["VLAN admin s�par�","ACL deny by default","Pare-feu inter-VLAN","Journalisation centralis�e"], c:`# Exemple iptables
iptables -A FORWARD -i vlan10 -o vlan20 -j DROP
iptables -A FORWARD -i wan -o dmz -p tcp --dport 443 -j ACCEPT`, p:["Zero Trust pour acc�s sensibles","Management plane isol�","Bastion pour admin"], w:"Les flat networks augmentent le rayon d'impact d'un incident." },
   { id:"cyber-users", t:"Gestion des identit�s et privil�ges", level:"intermediaire", r:"Comptes nominatifs, groupes, moindre privil�ge, comptes de service d�di�s, revue p�riodique.", tags:["iam","privil�ges"], g:["S�parer comptes admin et user","PAM pour �l�vation","Revue trimestrielle des membres DA","D�sactiver anciens comptes"], c:`Get-ADGroupMember "Domain Admins"
sudo -l
# PIM/JIT pour activations temporaires`, p:["Compte break-glass sous coffre","Logs d'admin centralis�s","Attestation manager"], w:"Les droits cumul�s sont la cause la plus fr�quente d'escalade." },
   { id:"cyber-mfa", t:"MFA et authentification forte", level:"debutant", r:"Activer MFA sur acc�s distants, admin et cloud. MFA par d�faut pour tous les comptes sensibles.", tags:["mfa","auth"], g:["D�ployer TOTP/FIDO2","Codes de secours","Former utilisateurs","Suivre l'adoption"], c:`# Entra ID: Conditional Access MFA
# Linux PAM oath
pamtester sshd user authenticate`, p:["FIDO2 recommand�","�viter SMS pour admins","R�cup�ration document�e"], w:"MFA sans plan de secours bloque en cas de perte." },
   { id:"cyber-malware", t:"Anti-malware et EDR", level:"debutant", r:"Protection r�sidente, analyse, isolation d'h�te, r�ponse automatique.", tags:["edr","antivirus"], g:["Activer Defender/antivirus central","Bases � jour","Analyse planifi�e","Alertes admin"], c:`Get-MpComputerStatus
# Isolation r�seau automatique sur alerte EDR`, p:["Protection cloud","Sandboxing","Allowlisting pour serveurs"], w:"L'antivirus seul ne suffit pas; l'EDR d�tecte les comportements." },
   { id:"cyber-backup", t:"Sauvegarde anti-ransomware", level:"intermediaire", r:"Copies hors ligne, immuables, test�es, s�par�es des credentials de production.", tags:["backup","ransomware"], g:["Copies offsite et hors ligne","Immutabilit�","Test de restore","Comptes de backup isol�s"], c:`# Veeam immuable (Linux hardened repo)
# Borg with append-only`, p:["RPO/RTO document�s","Snapshots � court terme + backup long terme","Alerte sur suppression"], w:"Les sauvegardes connect�es sont cibles prioritaires." },
   { id:"cyber-ids", t:"IDS/IPS et supervision s�curit�", level:"avance", r:"Suricata/Snort, corr�lation, blocage et tuning pour �viter faux positifs.", tags:["ids","ips","siem"], g:["D�ployer Suricata","Activer r�gles communautaires","Mode alerte puis block","Corr�ler avec SIEM"], c:`# pfSense Suricata package
pfctl -t snort2c -T show | head
lynis audit system`, p:["Sondes r�seau strat�giques","Tuning par groupe","Retention logs"], w:"Une r�gle trop large bloque la production." },
   { id:"cyber-phishing", t:"Phishing et sensibilisation", level:"debutant", r:"Rep�rer les signes, v�rifier les exp�diteurs, signaler, phishing tests, formation continue.", tags:["phishing","sensibilisation"], g:["V�rifier domaine exp�diteur","Ne jamais cliquer lien suspect","Signaler � l'admin","Campagnes de simulation"], c:`# Headers mail : Return-Path, SPF, DKIM, DMARC
# Outils : GoPhish pour simulations`, p:["DMARC enforce","Filtre mail gateway","Formation annuelle"], w:"Le maillon humain reste le plus exploit�." },
   { id:"cyber-patch", t:"Gestion des vuln�rabilit�s et patching", level:"intermediaire", r:"Recensement actifs, scans, priorisation CVSS, fen�tres maintenance, rollback.", tags:["vuln","patch","cve"], g:["Inventaire mat�riel/logiciel","Scan r�gulier","Prioriser CVE critiques","Planifier patch"], c:`# Scan
nmap -sV --script vuln 192.168.1.10
# WSUS / unattended-upgrades`, p:["VE (Vulnerability Exploitability)","Exceptions document�es","Maintenance windows"], w:"Des vuln�rabilit�s non patch�es restent ouvertes des mois." },
   { id:"cyber-logs", t:"Journalisation et r�ponse incident", level:"intermediaire", r:"Centraliser, conserver, analyser, cha�ne de custody, playbooks d'incident.", tags:["incident","logs","response"], g:["Centraliser syslog","Conserver 90+ jours","Playbook d'incident","Post-mortem"], c:`# Linux syslog forward
*.* @siem:514
# Collecter preuves`, p:["Horodatage NTP","Int�grit� des logs","Communication crise"], w:"Sans logs, l'analyse post-incident est impossible." },
   { id:"cyber-cloud", t:"S�curit� cloud et BYOD", level:"avance", r:"IAM cloud, MFA, acc�s conditionnels, chiffrement au repos/transit, MDM pour mobiles.", tags:["cloud","byod","mdm"], g:["IAM bas� r�les","MFA cloud","Chiffrement au repos","MDM pour BYOD"], c:`# Intune / MDM enrollment
# AWS IAM policy least privilege`, p:["Logs cloud","Sauvegarde SaaS","Sensibilisation donn�es mobiles"], w:"Les erreurs de config cloud sont la cause majeure de fuites." }
  ]
}
]);
