const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp4.json','utf8'));
const f=d.fiches.find(x=>x.id==='cp4-vlan');

const I='Les VLAN (Virtual Local Area Network) sont l\'un des concepts fondamentaux de la commutation Ethernet. Ils permettent de segmenter un réseau physique en plusieurs réseaux logiques indépendants, améliorant la sécurité, la performance et la gestion. Pour l\'examen TSSR, maîtriser les VLAN est indispensable car ils sont au cœur de la conception réseau d\'entreprise.';
const D='Un VLAN est un domaine de broadcast logique. Un port access appartient à un seul VLAN. Un trunk transporte plusieurs VLAN. Le VLAN natif est le VLAN non taggé sur un trunk. Le VLAN de gestion est utilisé pour administrer les équipements. Le VLAN par défaut (VLAN 1) est le VLAN initial sur les switches Cisco. Le VLAN de données transporte le trafic utilisateur. Le VLAN voix transporte le trafic téléphonique (ToIP).';
const P='Les VLAN existent pour segmenter un réseau physique sans multiplier les équipements. Avant les VLAN, chaque réseau logique nécessitait des switches dédiés. Les VLAN permettent de créer des groupes logiques indépendants du câblage physique, réduisant les coûts et simplifiant la gestion. Ils améliorent la sécurité en isolant les flux (ex. : réseau invité séparé du réseau production). Ils réduisent la taille des domaines de broadcast, améliorant les performances.';
const F='Un VLAN fonctionne au niveau 2 (liaison de données). Le switch maintient une table VLAN associant les ports aux VLAN. Lorsqu\'une trame arrive sur un port access, le switch l\'associe au VLAN du port. Sur un trunk, les trames sont taggées avec l\'ID VLAN (802.1Q) pour identifier leur appartenance. Le switch transfère la trame uniquement dans le VLAN correspondant. Le broadcast reste dans le VLAN. La commutation est basée sur l\'adresse MAC et le VLAN.';
const VD='Le VLAN de données transporte le trafic des utilisateurs (ordinateurs, imprimantes). Chaque VLAN de données a son propre sous-réseau IP. Les ports access sont assignés à ce VLAN. La sécurité repose sur l\'isolement entre VLAN.';
const VV='Le VLAN voix (souvent VLAN 10 ou 20) transporte le trafic ToIP. Il nécessite une priorisation QoS. Les téléphones IP sont souvent en VLAN voix via CDP/LLDP. Le switch peut assigner automatiquement un port en VLAN voix.';
const VN='Le VLAN natif est le VLAN dont les trames ne sont pas taggées sur un trunk. Par défaut, c\'est le VLAN 1. Il est important de le changer pour des raisons de sécurité. Le VLAN natif doit être le même des deux côtés du trunk.';
const VG='Le VLAN de gestion (souvent VLAN 99) est utilisé pour administrer les switches (SSH, SNMP). Il doit être isolé du trafic utilisateur. L\'accès à la gestion doit être restreint (ACL).';
const VDf='Le VLAN par défaut (VLAN 1) est le VLAN initial sur les switches Cisco. Tous les ports sont dans le VLAN 1 par défaut. Pour la sécurité, il est recommandé de ne pas utiliser le VLAN 1 pour le trafic utilisateur.';
const CI='La communication intra-VLAN se fait directement au niveau 2. Le switch transfère la trame vers le port destination dans le même VLAN. Aucun routeur n\'est nécessaire. La commutation est basée sur la table MAC.';
const PI='La communication inter-VLAN nécessite un routeur (router on a stick) ou un switch de couche 3. Chaque VLAN est un réseau IP distinct. Le routage inter-VLAN transfère les paquets entre VLAN via des sous-interfaces 802.1Q.';
const VS='Les VLAN améliorent la sécurité par segmentation. Un attaquant dans un VLAN ne peut pas accéder directement à un autre VLAN sans traverser un routeur/firewall. Le VLAN natif doit être sécurisé. Le port security limite les MAC. Le DHCP snooping et DAI protègent contre les attaques.';
const CE='Dans une PME, on crée VLAN 10 (admin), VLAN 20 (production), VLAN 30 (invités), VLAN 99 (gestion). Dans une mairie, VLAN par service. Dans une école, VLAN élèves, profs, admin. Dans une entreprise multi-services, VLAN par département avec QoS pour la voix.';
const PROC='1. Définir le plan de VLAN. 2. Créer les VLAN sur le switch. 3. Nommer les VLAN. 4. Assigner les ports access. 5. Configurer les trunks. 6. Vérifier avec show vlan brief et show interfaces trunk. 7. Tester la connectivité.';
const DEP='Poste dans mauvais VLAN : vérifier l\'assignation du port. VLAN absent : créer le VLAN. Trunk mal configuré : vérifier allowed list et native VLAN. VLAN non propagé : vérifier le trunk et le VTP. Problème de routage inter-VLAN : vérifier les sous-interfaces.';
const CMD='Configuration VLAN :\n\nvlan 10\n name ADMIN\n\ninterface fa0/1\n switchport mode access\n switchport access vlan 10\n\nConfiguration trunk :\n\ninterface gi0/1\n switchport mode trunk\n switchport trunk allowed vlan 10,20,99\n switchport trunk native vlan 99\n\nCommandes de vérification :\nshow vlan brief\nshow interfaces trunk\nshow running-config\nshow mac address-table\nshow interfaces switchport\nshow spanning-tree';
const VER='show vlan brief affiche les VLAN et les ports. show interfaces trunk affiche les trunks et les VLAN autorisés. show mac address-table affiche les adresses MAC par VLAN. show interfaces switchport affiche la configuration du port.';
const QJ='Expliquer la différence entre VLAN et sous-réseau. Qu\'est-ce que le VLAN natif ? Pourquoi le VLAN 1 est déconseillé ? Comment fonctionne le routage inter-VLAN ? Qu\'est-ce que le trunk ?';
const PE='Confondre VLAN et sous-réseau (VLAN = couche 2, sous-réseau = couche 3). Oublier le VLAN natif. Laisser le VLAN 1 pour le trafic. Trunk non autorisé. Port non assigné. Native VLAN mismatch.';
const BP='Nommer les VLAN, documenter, changer le VLAN natif, désactiver le VLAN 1, utiliser le port security, activer DHCP snooping et DAI.';
const MEMO='VLAN = domaine de broadcast logique. Access = 1 VLAN. Trunk = plusieurs VLAN (802.1Q). Native VLAN = non taggé. VLAN 1 = par défaut (à éviter). Routage inter-VLAN = router on a stick ou switch L3.';
const MER='graph TD; SW[Switch]-->|access VLAN10|PC1; SW-->|access VLAN20|PC2; SW-->|trunk|RT[Routeur];';
const SRC='IEEE 802.1Q, Cisco Networking Academy, documentation officielle Cisco IOS.';

f.r='Les VLAN segmentent un réseau physique en réseaux logiques indépendants, améliorant sécurité et performance.';
f.resume='VLAN : segmentation, access/trunk, natif, routage inter-VLAN.';
f.sections=[
 {title:'Introduction', body:I},
 {title:'Définitions', body:D},
 {title:'Pourquoi les VLAN existent', body:P},
 {title:'Fonctionnement interne', body:F},
 {title:'VLAN de données', body:VD},
 {title:'VLAN voix', body:VV},
 {title:'VLAN natif', body:VN},
 {title:'VLAN de gestion', body:VG},
 {title:'VLAN par défaut', body:VDf},
 {title:'Communication intra-VLAN', body:CI},
 {title:'Problématique inter-VLAN', body:PI},
 {title:'Routage inter-VLAN', body:PI},
 {title:'VLAN et sécurité', body:VS},
 {title:'Cas réel d\'entreprise', body:CE},
 {title:'Mise en œuvre pas à pas', body:PROC},
 {title:'Dépannage', body:DEP},
 {title:'Commandes Cisco IOS', body:CMD},
 {title:'Commandes de vérification', body:VER},
 {title:'Questions de jury', body:QJ},
 {title:'Pièges d\'examen', body:PE},
 {title:'Bonnes pratiques', body:BP},
 {title:'Mémo révision', body:MEMO},
 {title:'Schémas Mermaid', body:MER},
 {title:'Sources de référence', body:SRC}
];
fs.writeFileSync('content/cp4.json', JSON.stringify(d,null,2)+'\n','utf8');
console.log('vlan enriched');