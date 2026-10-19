const fs=require('fs');
const labsFile='content/labs.json';
const d=JSON.parse(fs.readFileSync(labsFile,'utf8'));
const arr=d.labs||[];

const newLabs=[
 {
  id:'cp4-lab-vlan', title:'Lab VLAN et trunk', section:'cp4', level:'intermediaire', duration:'45 min',
  objective:'Créer VLAN 10/20, trunk 802.1Q et vérifier la connectivité inter-VLAN via un routeur.',
  prerequisites:['Packet Tracer installé','Connaissance IP de base'],
  steps:[
   'Topologie : 2 switches, 1 routeur, 4 PC.',
   'Créer VLAN 10 (ADMIN) et 20 (PROD) sur les 2 switches.',
   'Assigner PC1/PC2 en VLAN 10, PC3/PC4 en VLAN 20.',
   'Configurer trunk sur le lien inter-switch (allowed vlan 10,20).',
   'Configurer sous-interfaces routeur 802.1Q pour inter-VLAN.',
   'Tester ping inter-VLAN et traceroute.'
  ],
  validation:['show vlan brief affiche les VLAN','show interfaces trunk montre le lien','Ping inter-VLAN OK'],
  troubleshooting:['Vérifier native VLAN','Port en access non assigné','Trunk allowed list incomplète']
 },
 {
  id:'cp4-lab-routage', title:'Lab routage inter-VLAN', section:'cp4', level:'intermediaire', duration:'45 min',
  objective:'Mettre en place le routage inter-VLAN via un routeur on a stick.',
  prerequisites:['Lab VLAN'],
  steps:[
   'Topologie : 1 routeur, 1 switch, 2 PC dans des VLAN différents.',
   'Configurer les sous-interfaces du routeur avec encapsulation 802.1Q.',
   'Assigner les adresses IP aux sous-interfaces.',
   'Configurer les ports access sur le switch.',
   'Tester le ping inter-VLAN.',
   'Vérifier la table de routage.'
  ],
  validation:['show ip route affiche les routes connectées','Ping inter-VLAN OK'],
  troubleshooting:['Encapsulation incorrecte','Sous-interface down','VLAN non créé']
 },
 {
  id:'cp4-lab-dhcp', title:'Lab DHCP', section:'cp4', level:'intermediaire', duration:'30 min',
  objective:'Configurer un serveur DHCP pour attribuer des adresses IP automatiquement.',
  prerequisites:['Lab routage inter-VLAN'],
  steps:[
   'Topologie : 1 routeur/serveur DHCP, 1 switch, 2 PC.',
   'Créer l\'étendue DHCP.',
   'Configurer les exclusions.',
   'Configurer les options (passerelle, DNS).',
   'Activer l\'étendue.',
   'Tester avec un poste (ipconfig /renew).'
  ],
  validation:['show ip dhcp pool affiche l\'étendue','show ip dhcp binding affiche les baux','Poste obtient une IP'],
  troubleshooting:['Étendue non activée','Relay manquant','Conflit d\'adresse']
 },
 {
  id:'cp4-lab-nat', title:'Lab NAT/PAT', section:'cp4', level:'intermediaire', duration:'30 min',
  objective:'Configurer le NAT/PAT pour l\'accès Internet depuis un réseau privé.',
  prerequisites:['Lab routage'],
  steps:[
   'Topologie : 1 routeur, 1 switch, 2 PC, lien vers Internet simulé.',
   'Définir les interfaces inside et outside.',
   'Créer une ACL pour le réseau privé.',
   'Configurer PAT (overload).',
   'Tester l\'accès Internet depuis un poste.',
   'Vérifier la table de traduction.'
  ],
  validation:['show ip nat translations affiche les mappings','show ip nat statistics affiche les hits','Accès Internet OK'],
  troubleshooting:['Interface inside/outside inversée','ACL incorrecte','Route par défaut absente']
 }
];

// avoid duplicates
const existingIds=new Set(arr.map(l=>l.id));
for(const lab of newLabs){
  if(existingIds.has(lab.id)) continue;
  arr.push(lab);
}
d.labs=arr;
fs.writeFileSync(labsFile, JSON.stringify(d,null,2)+'\n','utf8');
console.log('labs added, total:', d.labs.length);