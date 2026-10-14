const G = window.GUIDE;
G.sections = G.sections || [];

function A(id, card) {
  const sec = G.sections.find(function(s){ return s.id === id; });
  if (sec) { sec.fiches = sec.fiches || []; sec.fiches.push(card); }
}

A("ccp1", {
  id:"pedagogie-ccp1",
  t:"Fiche pedagogique de reference - CP1 IA encadree",
  level:"intermediaire",
  r:"Definition : l'IA assiste l'humain mais ne decide pas a sa place. Contexte professionnel : un utilisateur ou un technicien utilise un assistant pour rediger une procedure ou suggere un script. Objectif : utiliser l'IA de facon fiable, securisee et documentee. Explication detaillee : l'IA n'a pas la verite terrain et peut halluciner ; elle doit etre bornee par des donnees propres et validee. Exemple concret : generer un script PowerShell de sauvegarde puis le tester en bac a sable. Erreurs frequentes : copier sans verifier, fournir des secrets, confondre suggestion et preuve. Questions jury : comment encadrez-vous l'IA, quelle est une hallucination, comment protegez-vous les donnees.",
  tags:["pedagogie","examen","ia"],
  g:["Identifier le besoin","Preparer un prompt structure et anonyme","Verifier le resultat","Tester en bac a sable","Documenter dans le ticket"],
  c:"No native command; validation manuelle et test obligatoire.",
  p:["Copier sans controle", "Publier des donnees sensibles", "Oublier la preuve"],
  w:"Conclusion : l'IA est un accelerateur, la validation humaine reste obligatoire."
});

A("ccp2", {
  id:"pedagogie-ccp2",
  t:"Fiche pedagogique de reference - CP2 deploiement",
  level:"intermediaire",
  r:"Definition : deployer des equipements numériques et accompagner les outils collaboratifs. Contexte : installer un parc avec image, AD, GPO et O365. Objectif : industrialiser et standardiser. Details : Sysprep, PXE, enrôlement Entra ID, M365, tests et communication utilisateur. Exemple : adoption d'un nouvel outil avec formation et documentation. Erreurs : sinon cloner sans Sysprep, oublier pilotes, ne pas accompagner. Jury : risque clone direct, accompagnement utilisateur, difference AD/Entra.",
  tags:["pedagogie","deploiement","collaboration"],
  g:["Preparer l'image","Deployer PXE","Joindre au domaine","Appliquer GPO","Accompagner l'utilisateur"],
  c:"sysprep /oobe /generalize /shutdown ; dism /Capture-Image",
  p:["Clonage direct","Absence de support utilisateur"],
  w:"Conclusion : le deploiement reussit quand technique et accompagnement avancent ensemble."
});

A("ccp3", {
  id:"pedagogie-ccp3",
  t:"Fiche pedagogique de reference - CP3 assistance technique",
  level:"intermediaire",
  r:"Definition : diagnostiquer et resoudre en respectant l'utilisateur. Contexte : panne VPN ou poste. Objectif : retablir vite et documenter. Details : methode entonnoir, physique, IP, passerelle, DNS, applicatif. Exemple : cable debranche puis IP APIPA. Erreurs : changer plusieurs parametres ace fois, fermer sans validation. Jury : priorite incident, difference incident/probleme/demande, escalade.",
  tags:["pedagogie","support"],
  g:["Identifier et rassurer","Reproduire","Tester couche par couche","Corriger","Valider et documenter"],
  c:"ipconfig /all; ping; nslookup; tracert",
  p:["Diagnostic trop rapide","Absence de communication"],
  w:"Conclusion : structure et communication valent autant que la commande."
});

A("ccp4", {
  id:"pedagogie-ccp4",
  t:"Fiche pedagogique de reference - CP4 réseau IP",
  level:"intermediaire",
  r:"Definition : comprendre adressage, routage, VLAN et services réseau. Contexte : poste isole dans un VLAN mal affecte. Objectif : analyser et retablir. Details : OSI, segmentation, ACL, DNS, DHCP. Exemple : documentation plan d'adressage et VLAN voie/data. Erreurs : modifier IP sans comprendre VLAN, masque incorrect. Jury : VLAN, routage statique/dynamique, DNS.",
  tags:["pedagogie","reseau","ccna"],
  g:["Analyser les symptômes","Verifier physique","Verifier IP/passerelle/DNS","Corriger","Documenter"],
  c:"ping; tracert; nslookup; show running-config",
  p:["Confusion masque/VLAN","Changements multiples"],
  w:"Conclusion : toujours expliquer la cause, pas seulement la solution."
});

A("ccp5", {
  id:"pedagogie-ccp5",
  t:"Fiche pedagogique de reference - CP5 serveurs Windows/Linux",
  level:"intermediaire",
  r:"Definition : installer et exploiter des serveurs. Contexte : mise en production AD/DNS/DHCP. Objectif : securiser et superviser. Details : AD DS, GPO, Linux systemd, journaux, patch et permissions. Exemple : creation DC et test GPO. Erreurs : compte admin unique, patch sans test. Jury : difference OU et groupe, GPO, reset mot de passe.",
  tags:["pedagogie","systemes"],
  g:["Installer","Configurer","Securiser","Tester","Superviser"],
  c:"server-manager ; dcdiag; Get-ADUser",
  p:["Permissions excessives","Sauvegarde absente"],
  w:"Conclusion : la documentation fait partie de l'exploitation."
});

A("ccp6", {
  id:"pedagogie-ccp6",
  t:"Fiche pedagogique de reference - CP6 virtualisation",
  level:"intermediaire",
  r:"Definition : mutualiser des serveurs virtuels avec haute disponibilite. Contexte : VMware, Hyper-V ou Proxmox. Objectif : provisionner, sauvegarder et restaurer. Details : vSwitch, storage, snapshots vs sauvegardes, cluster HA/DRS. Exemple : creation VM puis sauvegarde pro. Erreurs : confondre snapshot et sauvegarde, ignorer ressources. Jury : pourquoi deux vSwitch, hotes vs invites, sauvegarde.",
  tags:["pedagogie","virtualisation"],
  g:["Provisionner","Snapshot avant modification","Tester","Sauvegarder","Valider"],
  c:"Get-VM; esxcli system version get",
  p:["Snapshot unique consideré comme sauvegarde","Datastore unique"],
  w:"Conclusion : preuve de restauration indispensable."
});

A("ccp7", {
  id:"pedagogie-ccp7",
  t:"Fiche pedagogique de reference - CP7 acces et securite hybride",
  level:"intermediaire",
  r:"Definition : gerer identites, MFA, groupes, VPN et durcissement dans un environnement hybride. Contexte : Entra ID, M365, sites distants et firewall. Objectif : proteger l'infrastructure. Details : hybrid identity, Conditional Access, MDM, segmentation, journalisation, pfSense/WireGuard. Exemple : VPN site-to-site securise. Erreurs : admin global permanent, VPN sans MFA, sur-exposition. Jury : hybrid identity, MFA vs MDM, segmentation LAN.",
  tags:["pedagogie","securite","hybride"],
  g:["Definir le flux","Generer les cles","Tester","Journaliser","Documenter"],
  c:"ip a; systemctl status wg-quick@wg0",
  p:["Sur-exposure d'administration","Absence de MFA"],
  w:"Conclusion : securite par couche et moindre privilege."
});

A("ccp8", {
  id:"pedagogie-ccp8",
  t:"Fiche pedagogique de reference - CP8 supervision et mise a jour",
  level:"intermediaire",
  r:"Definition : surveiller proactivement et mettre a jour le parc. Contexte : Zabbix/PRTG et WSUS/GPO. Objectif : maintenir la disponibilite. Details : agents, seuils, alertes, patch management, tests. Exemple : alerte CPU > 80 pendant 5 minutes. Erreurs : seuils inadaptes, faux positifs ignores. Jury : OID, agentless vs agent, priorite des correctifs.",
  tags:["pedagogie","supervision","mise a jour"],
  g:["Inventorier","Installer agent","Definir seuils","Tester notification","Documenter"],
  c:"zabbix_agentd -t system.cpu.load",
  p:["Pas de test annuel","KPI non mesurables"],
  w:"Conclusion : la supervision previent et favorise l'examen."
});

A("ccp9", {
  id:"pedagogie-ccp9",
  t:"Fiche pedagogique de reference - CP9 continuite et reprise",
  level:"intermediaire",
  r:"Definition : preparer la continuite et la reprise d'activite. Contexte : sauvegarde Veeam et plan d'urgence. Objectif : reduire RPO et RTO. Details : regle 3-2-1, test de restauration, matrice de service, PCA/PRA. Exemple : restauration d'une VM de production pour valider le RTO. Erreurs : jamais tester une sauvegarde, sauvegarde unique, oublier l'authentification Veeam. Jury : difference RPO/RTO, test de restauration, preuve du PCA.",
  tags:["pedagogie","pca","pra"],
  g:["Identifier RPO/RTO","Sauvegarder hors site","Tester la restauration trimestrielle","Documenter et simuler"],
  c:"veeam backup ; powercli Backup-VM",
  p:["Absence de test","Pas de plan de communication"],
  w:"Conclusion : une sauvegarde n'est utile que si elle est testee."
});

A("ccp10", {
  id:"pedagogie-ccp10",
  t:"Fiche pedagogique de reference - CP10 infrastructure supervisionnee",
  level:"intermediaire",
  r:"Definition : maintenir, mettre a jour et superviser le parc de maniere professionnelle. Contexte : inventaire, reporting, documentation et demonstration au jury. Objectif : assurer le suivi. Details : KPI, carnet de maintenance, scripts, tableau de bord. Exemple : rapport mensuel d'etat des services. Erreurs : KPI non mesurables, documentation non mise a jour, absence de tracabilite. Jury : quels KPI, comment documentez-vous, comment ameliorez-vous la supervision.",
  tags:["pedagogie","operations","reporting"],
  g:["Collecter les indicateurs","Produire le tableau de bord","Proposer des actions","Archiver"],
  c:"PowerShell reporting, export CSV et Excel",
  p:["Inventaire incomplet","Documentation non mise a jour"],
  w:"Conclusion : le suivi et la preuve sont indispensables au titre."
});