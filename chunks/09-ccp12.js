const G = window.GUIDE;
const push = (arr) => G.sections.push(...arr);
push([
{
  id:"ccp12",
  group:"CCP12",
  icon:"🛡️",
  title:"CCP12 · Cybersécurité et durcissement",
  desc:"Posture de sécurité, ANSSI, détection, prévention et réponse.",
  fiches:[
   { id:"cyber-anssi", t:"Référentiels sécurité (ANSSI, CERT-FR, RGPD)", level:"intermediaire", r:"Connaître les organismes, recommandations d'hygiène et obligations légales. Sensibiliser et gouverner les accès.", tags:["cyber","anssi","rgpd"], g:["Lire le guide d'hygiène informatique ANSSI","Suivre les alertes CERT-FR","Cartographier les données personnelles","Appliquer le RGPD"], c:`# Ressources
# ANSSI : https://www.ssi.gouv.fr
# CERT-FR : https://www.cert.ssi.gouv.fr
# ANSSI 40 mesures essentielles`, p:["Cadre gestion des risques (EBIOS RM)","Sensibilisation régulière","Audit et exercices d'incident"], w:"La sécurité est un processus continu, pas un projet ponctuel." },
   { id:"cyber-hygiene", t:"Hygiène poste et durcissement", level:"intermediaire", r:"Mettre à jour, limiter les droits, chiffrer, désactiver services inutiles, protéger les navigateurs.", tags:["hardening","endpoint"], g:["Patch OS et apps automatiquement","Activer BitLocker/LUKS","Désactiver services inutiles","Configurer Pare-feu hôte"], c:`# Windows
Get-MpComputerStatus
# Linux
apt unattended-upgrade -d
ufw enable
lynis audit system`, p:["Mots de passe gérés (gestionnaire)","MFA obligatoire admins","Chiffrement des disques"], w:"Un poste non patché est la porte d'entrée la plus courante." },
   { id:"cyber-reseau", t:"Segmentation, firewall et DMZ", level:"intermediaire", r:"Segmenter par VLAN, limiter les flux, journaliser, surveiller les connexions anormales.", tags:["reseau","firewall","dmz"], g:["VLAN admin séparé","ACL deny by default","Pare-feu inter-VLAN","Journalisation centralisée"], c:`# Exemple iptables
iptables -A FORWARD -i vlan10 -o vlan20 -j DROP
iptables -A FORWARD -i wan -o dmz -p tcp --dport 443 -j ACCEPT`, p:["Zero Trust pour accès sensibles","Management plane isolé","Bastion pour admin"], w:"Les flat networks augmentent le rayon d'impact d'un incident." },
   { id:"cyber-users", t:"Gestion des identités et privilèges", level:"intermediaire", r:"Comptes nominatifs, groupes, moindre privilège, comptes de service dédiés, revue périodique.", tags:["iam","privilèges"], g:["Séparer comptes admin et user","PAM pour élévation","Revue trimestrielle des membres DA","Désactiver anciens comptes"], c:`Get-ADGroupMember "Domain Admins"
sudo -l
# PIM/JIT pour activations temporaires`, p:["Compte break-glass sous coffre","Logs d'admin centralisés","Attestation manager"], w:"Les droits cumulés sont la cause la plus fréquente d'escalade." },
   { id:"cyber-mfa", t:"MFA et authentification forte", level:"debutant", r:"Activer MFA sur accès distants, admin et cloud. MFA par défaut pour tous les comptes sensibles.", tags:["mfa","auth"], g:["Déployer TOTP/FIDO2","Codes de secours","Former utilisateurs","Suivre l'adoption"], c:`# Entra ID: Conditional Access MFA
# Linux PAM oath
pamtester sshd user authenticate`, p:["FIDO2 recommandé","Éviter SMS pour admins","Récupération documentée"], w:"MFA sans plan de secours bloque en cas de perte." },
   { id:"cyber-malware", t:"Anti-malware et EDR", level:"debutant", r:"Protection résidente, analyse, isolation d'hôte, réponse automatique.", tags:["edr","antivirus"], g:["Activer Defender/antivirus central","Bases à jour","Analyse planifiée","Alertes admin"], c:`Get-MpComputerStatus
# Isolation réseau automatique sur alerte EDR`, p:["Protection cloud","Sandboxing","Allowlisting pour serveurs"], w:"L'antivirus seul ne suffit pas; l'EDR détecte les comportements." },
   { id:"cyber-backup", t:"Sauvegarde anti-ransomware", level:"intermediaire", r:"Copies hors ligne, immuables, testées, séparées des credentials de production.", tags:["backup","ransomware"], g:["Copies offsite et hors ligne","Immutabilité","Test de restore","Comptes de backup isolés"], c:`# Veeam immuable (Linux hardened repo)
# Borg with append-only`, p:["RPO/RTO documentés","Snapshots à court terme + backup long terme","Alerte sur suppression"], w:"Les sauvegardes connectées sont cibles prioritaires." },
   { id:"cyber-ids", t:"IDS/IPS et supervision sécurité", level:"avance", r:"Suricata/Snort, corrélation, blocage et tuning pour éviter faux positifs.", tags:["ids","ips","siem"], g:["Déployer Suricata","Activer règles communautaires","Mode alerte puis block","Corréler avec SIEM"], c:`# pfSense Suricata package
pfctl -t snort2c -T show | head
lynis audit system`, p:["Sondes réseau stratégiques","Tuning par groupe","Retention logs"], w:"Une règle trop large bloque la production." },
   { id:"cyber-phishing", t:"Phishing et sensibilisation", level:"debutant", r:"Repérer les signes, vérifier les expéditeurs, signaler, phishing tests, formation continue.", tags:["phishing","sensibilisation"], g:["Vérifier domaine expéditeur","Ne jamais cliquer lien suspect","Signaler à l'admin","Campagnes de simulation"], c:`# Headers mail : Return-Path, SPF, DKIM, DMARC
# Outils : GoPhish pour simulations`, p:["DMARC enforce","Filtre mail gateway","Formation annuelle"], w:"Le maillon humain reste le plus exploité." },
   { id:"cyber-patch", t:"Gestion des vulnérabilités et patching", level:"intermediaire", r:"Recensement actifs, scans, priorisation CVSS, fenêtres maintenance, rollback.", tags:["vuln","patch","cve"], g:["Inventaire matériel/logiciel","Scan régulier","Prioriser CVE critiques","Planifier patch"], c:`# Scan
nmap -sV --script vuln 192.168.1.10
# WSUS / unattended-upgrades`, p:["VE (Vulnerability Exploitability)","Exceptions documentées","Maintenance windows"], w:"Des vulnérabilités non patchées restent ouvertes des mois." },
   { id:"cyber-logs", t:"Journalisation et réponse incident", level:"intermediaire", r:"Centraliser, conserver, analyser, chaîne de custody, playbooks d'incident.", tags:["incident","logs","response"], g:["Centraliser syslog","Conserver 90+ jours","Playbook d'incident","Post-mortem"], c:`# Linux syslog forward
*.* @siem:514
# Collecter preuves`, p:["Horodatage NTP","Intégrité des logs","Communication crise"], w:"Sans logs, l'analyse post-incident est impossible." },
   { id:"cyber-cloud", t:"Sécurité cloud et BYOD", level:"avance", r:"IAM cloud, MFA, accès conditionnels, chiffrement au repos/transit, MDM pour mobiles.", tags:["cloud","byod","mdm"], g:["IAM basé rôles","MFA cloud","Chiffrement au repos","MDM pour BYOD"], c:`# Intune / MDM enrollment
# AWS IAM policy least privilege`, p:["Logs cloud","Sauvegarde SaaS","Sensibilisation données mobiles"], w:"Les erreurs de config cloud sont la cause majeure de fuites." }
  ]
}
]);