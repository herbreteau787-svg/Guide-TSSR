const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp4.json','utf8'));
const f=d.fiches.find(x=>x.id==='cp4-routage');

const I='Le routage IP est l\'un des piliers de l\'exploitation réseau. Il permet de transférer des paquets entre des réseaux distincts, de choisir le meilleur chemin et de garantir la connectivité de bout en bout. Pour un candidat TSSR, maîtriser le routage est indispensable car il est au cœur des mises en situation professionnelles et des questions du jury. Cette fiche détaille le fonctionnement d\'un routeur, les tables de routage, les routes statiques et dynamiques, les métriques et les méthodes de diagnostic.';
const D='Le routage est le processus par lequel un routeur transfère un paquet IP d\'une interface à une autre en fonction de sa table de routage. La commutation (switching) opère au niveau 2 (liaison) et transfère des trames au sein d\'un même VLAN. Le routage opère au niveau 3 (réseau) et transfère des paquets entre des réseaux différents. Un routeur possède une interface par réseau. La table de routage contient les chemins connus vers les destinations.';
const P='Dans un réseau d\'entreprise, les équipements sont répartis en plusieurs sous-réseaux (VLAN, sites distants, DMZ). Sans routage, les postes d\'un VLAN ne peuvent pas communiquer avec un autre VLAN ou avec Internet. Le routage permet l\'interconnexion, la segmentation et la sécurité. Il est indispensable pour l\'accès aux services (DNS, DHCP, messagerie, ERP).';
const DC='La commutation utilise les adresses MAC et opère au niveau 2. Elle est rapide et se fait au sein d\'un même domaine de broadcast. Le routage utilise les adresses IP et opère au niveau 3. Il traverse les domaines de broadcast. Un switch commute ; un routeur route. Dans un réseau moderne, on combine les deux : switch de couche 2 pour l\'accès, routeur ou switch de couche 3 pour l\'inter-VLAN.';
const FR='Un routeur reçoit un paquet sur une interface, consulte sa table de routage, détermine l\'interface de sortie et le next-hop, décrémente le TTL, recalcule le checksum et transmet le paquet. Le processus est répété à chaque saut. Le routeur utilise l\'ARP pour résoudre l\'adresse MAC du next-hop si nécessaire.';
const TR='La table de routage contient les routes connues. Chaque entrée indique le réseau destination, le masque, le next-hop, l\'interface de sortie et la métrique. La route par défaut (0.0.0.0/0) est utilisée si aucune route spécifique ne correspond. Les routes sont classées par préfixe le plus long (longest prefix match).';
const RC='Les routes connectées sont automatiquement ajoutées pour les réseaux directement attachés aux interfaces du routeur. Elles ont une distance administrative de 0. Elles disparaissent si l\'interface est down.';
const RS='Les routes statiques sont configurées manuellement. Elles sont simples et prévisibles mais ne s\'adaptent pas aux pannes. Syntaxe : ip route réseau masque next-hop. La route par défaut est une route statique vers 0.0.0.0/0.';
const RD='Les routes dynamiques sont apprises via des protocoles (RIP, OSPF, EIGRP, BGP). Elles s\'adaptent aux changements de topologie. OSPF est un protocole à état de lien, RIP à vecteur de distance.';
const MR='La métrique indique le coût d\'une route. Pour RIP, c\'est le nombre de sauts (max 15). Pour OSPF, c\'est le coût (basé sur la bande passante). Pour EIGRP, c\'est le composite (bande passante, délai). Plus la métrique est basse, meilleure est la route.';
const CP='Le routeur choisit la route avec le préfixe le plus long (longest prefix match). En cas d\'égalité, il choisit la route avec la métrique la plus basse. En cas d\'égalité de métrique, il peut faire du load balancing (ECMP). La distance administrative départage les protocoles.';
const DR='La route par défaut (0.0.0.0/0) est utilisée lorsque aucune route spécifique ne correspond à la destination. Elle est essentielle pour l\'accès à Internet. Elle est souvent configurée comme route statique ou apprise par OSPF (default-information originate).';
const PG='La passerelle par défaut (default gateway) est l\'adresse IP du routeur sur le sous-réseau local. Les postes l\'utilisent pour envoyer le trafic vers d\'autres réseaux. Sans passerelle, pas de communication externe.';
const RI='Le routage inter-VLAN permet la communication entre VLAN. Il nécessite un routeur (router on a stick) ou un switch de couche 3. Chaque VLAN est un sous-réseau. Le routeur a une sous-interface par VLAN avec encapsulation 802.1Q. Le switch de couche 3 fait du routage matériel.';
const AE='Architecture d\'entreprise type : accès (switches L2), distribution (switches L3, routage inter-VLAN), cœur (routage haute capacité), services (DNS, DHCP, firewall), sécurité (pare-feu, IDS/IPS). Les sites distants sont connectés par VPN ou MPLS. La redondance est assurée par HSRP/VRRP et OSPF.';
const CE='Scénario PME : un routeur avec des sous-interfaces pour 3 VLAN et une route par défaut vers Internet. Scénario école : VLAN élèves/profs/admin avec routage inter-VLAN et firewall. Scénario mairie : multi-sites avec VPN et OSPF. Scénario multi-sites : routeurs avec OSPF et liens redondants.';
const PROC='1. Vérifier la table de routage (show ip route). 2. Vérifier l\'interface de sortie. 3. Vérifier le next-hop (ARP). 4. Tester le ping vers la passerelle. 5. Tester le ping distant. 6. Tracer la route. 7. Vérifier les ACL et le firewall. 8. Vérifier le NAT si accès Internet.';
const DEP='Route absente : ajouter la route. Mauvaise passerelle : corriger la gateway. Mauvaise route par défaut : corriger 0.0.0.0/0. Réseau inaccessible : vérifier la connectivité et le routage. Boucle : vérifier les routes et TTL. Erreur de masque : recalculer. Problème d\'adressage IP : vérifier IP/masque/gateway.';
const CMD='Commandes de diagnostic :\nshow ip route\nshow running-config\nshow ip interface brief\nshow cdp neighbors\nshow arp\nshow interfaces\nping\ntraceroute\n\nCommandes de configuration :\nip route 0.0.0.0 0.0.0.0 <next-hop>\nip route <réseau> <masque> <next-hop>\n\nExplication :\nshow ip route affiche la table de routage (C, S, O, etc.).\nshow running-config affiche la configuration active.\nshow ip interface brief affiche l\'état des interfaces.\nshow cdp neighbors affiche les voisins Cisco.\nshow arp affiche la table ARP.\nshow interfaces affiche les détails des interfaces.\nping teste la connectivité.\ntraceroute trace le chemin.\nip route configure une route statique.';
const VER='show ip route : vérifier la présence des routes. show ip interface brief : vérifier que les interfaces sont up/up. show arp : vérifier la résolution. ping : tester la connectivité. traceroute : localiser le blocage.';
const QJ='Expliquer le routage. Qu\'est-ce qu\'une table de routage ? Qu\'est-ce qu\'une route par défaut ? Différence entre route statique et dynamique. Qu\'est-ce que le longest prefix match ? Qu\'est-ce qu\'une métrique ?';
const PE='Confondre routage et commutation. Oublier la route par défaut. Mauvais masque. Next-hop inaccessible. Interface down. ACL bloquante. NAT mal configuré.';
const BP='Documenter les routes. Utiliser le routage dynamique pour les grands réseaux. Vérifier la connectivité à chaque étape. Utiliser les ACL pour la sécurité. Éviter les routes statiques inutiles.';
const MEMO='Routage = transfert inter-réseaux via table de routage. Route par défaut = 0.0.0.0/0. Longest prefix match. Métrique = coût. Route statique = manuelle. Route dynamique = protocole. Passerelle = routeur local.';
const MER='graph TD; R1[Routeur1]-->R2[Routeur2]; R2-->Internet; PC1-->R1; PC2-->R2;';
const SRC='RFC 791, Cisco Networking Academy, documentation Cisco IOS.';

f.r='Le routage IP transfère les paquets entre réseaux distincts en utilisant la table de routage.';
f.resume='Routage : table, route par défaut, statique/dynamique, métrique.';
f.sections=[
 {title:'Introduction', body:I},
 {title:'Définition du routage', body:D},
 {title:'Pourquoi le routage est nécessaire', body:P},
 {title:'Différence entre commutation et routage', body:DC},
 {title:'Fonctionnement d\'un routeur', body:FR},
 {title:'Tables de routage', body:TR},
 {title:'Routes connectées', body:RC},
 {title:'Routes statiques', body:RS},
 {title:'Routes dynamiques', body:RD},
 {title:'Métriques de routage', body:MR},
 {title:'Choix du meilleur chemin', body:CP},
 {title:'Default Route', body:DR},
 {title:'Passerelle par défaut', body:PG},
 {title:'Routage inter-VLAN', body:RI},
 {title:'Architecture réseau d\'entreprise', body:AE},
 {title:'Cas concret entreprise', body:CE},
 {title:'Configuration Cisco IOS', body:PROC},
 {title:'Vérification', body:VER},
 {title:'Dépannage', body:DEP},
 {title:'Questions de jury', body:QJ},
 {title:'Pièges d\'examen', body:PE},
 {title:'Bonnes pratiques', body:BP},
 {title:'Mémo de révision', body:MEMO},
 {title:'Schémas Mermaid', body:MER},
 {title:'Sources de référence', body:SRC}
];
// Add commands section
f.sections.splice(16,0,{title:'Commandes Cisco IOS', body:CMD});
fs.writeFileSync('content/cp4.json', JSON.stringify(d,null,2)+'\n','utf8');
console.log('routage enriched');