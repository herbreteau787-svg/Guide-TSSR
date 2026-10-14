const G = window.GUIDE;
const Q = (id, section, difficulty, q, choices, answer, explain) => G.quizzes.push({id, section, difficulty, q, choices, answer, explain});
// --- Cybersécurité ---
Q('q141','ccp12','facile',"ANSSI est ?",["Une banque"," L'agence nationale de cybersécurité"," Un FAI"," Un CMS"],1,"ANSSI = cybersécurité France.");
Q('q142','ccp12','moyen',"Le moindre privilège signifie ?",[" Donner tous les droits"," Donner le strict nécessaire"," Pas d'authentification"," Compte root partagé"],1,"Accès minimal.");
Q('q143','ccp12','moyen',"MFA recommandé pour ?",[" Uniquement l'impression"," Admin et accès externes"," Tous les comptes invités "," Aucun"],1,"Admin + remote.");
Q('q144','ccp12','facile',"EDR vs antivirus : ?",[" Identiques"," EDR détecte comportements"," Antivirus plus récent"," Aucun scan"],1,"EDR comportemental.");
Q('q145','ccp12','moyen',"Sauvegarde anti-ransomware doit être ?",[" En ligne avec prod"," Hors ligne/immuable"," Sur le même NAS"," Toujours en RAM"],1,"Hors ligne/immuable.");
Q('q146','ccp12','moyen',"IDS Suricata fait ?",[" Routage"," Détection/blocage signatures"," DNS cache"," DHCP"],1,"IDS/IPS.");
Q('q147','ccp12','facile',"Phishing détecte par ?",[" SPF/DKIM/DMARC"," OSI"," DNSSEC uniquement"," DHCP"],0,"Headers mail.");
Q('q148','ccp12','moyen',"Scan vulnérabilités avec ?",[" ping"," nmap vuln scripts"," ipconfig"," dcdiag"],1,"nmap.");
Q('q149','ccp12','facile',"RGPD concerne ?",[" Réseau uniquement"," Données personnelles"," OS only"," VLAN"],1,"Données perso.");
Q('q150','ccp12','moyen',"Logs incident conservés ?",[" 1 jour"," 90+ jours"," Jamais"," Uniquement erreurs"],1,"Rétention.");
// --- VoIP/CCP10 ---
Q('q151','ccp10','facile',"SIP port ?",[" 5060"," 53"," 443"," 22"],0,"SIP.");
Q('q152','ccp10','facile',"RTP range courant ?",[" 10000-20000 UDP"," 80-443"," 25-110"," 1-1024"],0,"RTP.");
Q('q153','ccp10','moyen',"Audio unidirectionnel VoIP souvent dû à ?",[" DNS"," NAT"," CPU"," DHCP"],1,"NAT.");
// --- CCP11 ---
Q('q154','identite','moyen',"LDAP & signifie ?",[" OR"," AND"," NOT"," XOR"],1,"& = AND.");
Q('q155','supervision','moyen',"SNMPv3 mode ?",[" Communauté"," authPriv"," noAuthNoPriv seulement"," v1"],1,"authPriv.");
Q('q156','containers','facile',"Image Docker est ?",[" Instance en cours"," Modèle"," Réseau"," Volume"],1,"Image.");
Q('q157','iac','moyen',"Terraform state sert à ?",[" Lancer VM"," Mapper ressources réelles"," Chiffrer"," Monitorer"],1,"State.");
// --- exam MEP ---
Q('q158','exam','moyen',"MEP phase 1 pratique dure (v2) ?",[" 30 min"," 90 min"," 4 h"," 15 min"],1,"90 min.");
Q('q159','exam','moyen',"Matériel autorisé phase 2 MEP ?",[" Tout Internet"," Rien sauf Word"," Tel portable"," Montre connectée"],1,"Rien sauf Word.");
Q('q160','exam','facile',"Durée totale examen v2026 ?",[" 5h35"," 7h00"," 3h"," 2h"],1,"7h.");
