const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp4.json','utf8'));
const f=d.fiches.find(x=>x.id==='cp4-ospf');

const I='OSPF (Open Shortest Path First) est le protocole de routage dynamique le plus utilisé en entreprise. Il est à état de lien (link-state), rapide, scalable et standard (RFC 2328). Pour un candidat TSSR, maîtriser OSPF est indispensable car il est au cœur des mises en situation réseau et des questions du jury. Cette fiche détaille le fonctionnement d\'OSPF, les zones, la LSDB, les LSA, l\'algorithme SPF, les métriques et le dépannage.';
const P='Les routes statiques sont simples mais ne s\'adaptent pas aux pannes ni aux changements de topologie. Dans un réseau avec plusieurs routeurs et des liens redondants, la gestion manuelle des routes devient impossible. Les protocoles de routage dynamique permettent aux routeurs d\'échanger automatiquement les informations de routage et de recalculer les chemins en cas de panne.';
const PR='OSPF a été développé pour remplacer RIP (limité à 15 sauts) et répondre aux besoins des grands réseaux. Il est normalisé par l\'IETF (RFC 2328 pour OSPFv2 IPv4, RFC 5340 pour OSPFv3 IPv6). Il supporte le VLSM, les masques de longueur variable, et converge rapidement.';
const FG='OSPF fonctionne en plusieurs étapes : découverte des voisins (Hello), élection du DR/BDR sur les réseaux multi-accès, échange de la LSDB, calcul du plus court chemin (SPF/Dijkstra). Les routeurs envoient des Hello toutes les 10 secondes sur les réseaux multi-accès et toutes les 30 secondes sur les liens point-à-point. Le dead interval est de 40 secondes (4x le hello).';
const EV='Les voisins OSPF passent par plusieurs états : Down (pas de hello reçu), Init (hello reçu mais pas le sien), 2-Way (hello bidirectionnel, élection DR/BDR), ExStart (établissement de la relation master/slave), Exchange (échange des DBD), Loading (demande des LSA manquantes), Full (LSDB synchronisée). L\'état Full est l\'état normal pour les voisins adjacents.';
const DR='Sur les réseaux multi-accès (Ethernet), OSPF élit un Designated Router (DR) et un Backup DR (BDR). Le DR centralise l\'échange des LSA pour réduire le trafic. L\'élection se base sur la priorité (par défaut 1) puis l\'ID routeur le plus élevé. Un routeur avec priorité 0 ne peut pas être élu. Le DR et le BDR sont adjacents avec tous les autres routeurs (DROTHER).';
const ZO='OSPF utilise des zones pour hiérarchiser le réseau. La zone 0 (backbone) est obligatoire et centrale. Les autres zones sont connectées à la zone 0. Les routeurs ABR (Area Border Router) connectent les zones. Le découpage en zones réduit la taille de la LSDB et la charge CPU.';
const BB='La zone 0 (backbone) est le cœur du réseau OSPF. Toutes les zones non-backbone doivent être connectées à la zone 0. Les ABR font la liaison. Le backbone ne doit pas être partitionné. Le trafic inter-zones passe par la zone 0.';
const LS='La Link-State Database (LSDB) contient toutes les informations de topologie du réseau OSPF. Chaque routeur construit une LSDB identique pour sa zone. La LSDB est utilisée pour calculer le plus court chemin. La synchronisation de la LSDB est essentielle pour la convergence.';
const LSA='Les LSA (Link-State Advertisements) décrivent la topologie. Type 1 (Router LSA) : liens du routeur. Type 2 (Network LSA) : réseau multi-accès avec DR. Type 3 (Summary LSA) : routes inter-zones (ABR). Type 4 (ASBR Summary) : route vers un ASBR. Type 5 (External LSA) : routes externes. Type 7 (NSSA External) : routes externes dans une NSSA.';
const SPF='OSPF utilise l\'algorithme de Dijkstra (SPF) pour calculer le plus court chemin. Chaque routeur construit un arbre SPF à partir de sa propre perspective. Le calcul est déclenché lors d\'un changement de topologie. L\'algorithme est efficace mais consomme de la CPU sur de grands réseaux.';
const MC='La métrique OSPF est le coût, basé sur la bande passante de référence (100 Mbps par défaut). Coût = 100 000 000 / bande passante (en bps). Un lien 100 Mbps a un coût de 1, un lien 10 Mbps un coût de 10. La métrique totale est la somme des coûts des liens. La métrique la plus basse gagne.';
const TA='Les tables OSPF incluent la table des voisins (show ip ospf neighbor), la LSDB (show ip ospf database), la table de routage (show ip route). Les voisins doivent être en état Full. La LSDB doit être cohérente. La table de routage contient les routes OSPF (marquées O et O IA pour inter-area).';
const AM='Architecture multi-sites : zone 0 au cœur, zones secondaires pour chaque site. Les ABR connectent les sites. Les ASBR injectent des routes externes (BGP, RIP). La hiérarchisation réduit la taille de la LSDB et améliore la convergence. Le design doit éviter les zones trop grandes.';
const CE='Scénario PME : OSPF single-area (area 0) entre 3 routeurs. Scénario multi-sites : area 0 au cœur, area 1 pour le site A, area 2 pour le site B. Scénario école : VLAN avec OSPF pour la connectivité. Scénario collectivité : OSPF avec plusieurs sites et redondance. Scénario infrastructure avec plusieurs VLAN : OSPF sur les liens inter-switchs et vers le routeur.';
const PROC='1. Activer OSPF (router ospf 1). 2. Définir le Router ID (router-id). 3. Annoncer les réseaux (network). 4. Configurer les interfaces passives. 5. Vérifier les voisins (show ip ospf neighbor). 6. Vérifier la LSDB (show ip ospf database). 7. Vérifier la table de routage (show ip route). 8. Tester la connectivité.';
const DEP='Voisinage qui ne monte pas : vérifier le hello/dead interval, le masque, l\'area, le MTU. Area incorrecte : corriger l\'area dans la commande network. Masque incorrect : vérifier le wildcard mask. Router ID en conflit : changer le router-id. Interfaces passives : vérifier passive-interface. Route absente : vérifier l\'annonce et la LSDB. LSDB incohérente : vérifier la synchronisation.';
const CMD='Configuration :\nrouter ospf 1\n router-id 1.1.1.1\n network 192.168.1.0 0.0.0.255 area 0\n network 10.0.0.0 0.0.0.3 area 0\n passive-interface default\n no passive-interface gi0/0\n\nVérification :\nshow ip ospf\nshow ip ospf neighbor\nshow ip route\nshow ip protocols\nshow ip ospf database\nshow running-config\n\nExplication :\nshow ip ospf affiche les paramètres OSPF.\nshow ip ospf neighbor affiche les voisins et leur état.\nshow ip route affiche la table de routage (routes O).\nshow ip protocols affiche les protocoles de routage.\nshow ip ospf database affiche la LSDB.\nshow running-config affiche la configuration.';
const VER='Les voisins doivent être en état Full. La LSDB doit être cohérente. La table de routage doit contenir les routes OSPF. Le ping et le traceroute valident la connectivité. La convergence doit être rapide après une panne.';
const COMP='RIP : vecteur de distance, max 15 sauts, mises à jour périodiques, simple mais limité. OSPF : état de lien, rapide, scalable, supporte VLSM, converge rapidement. RIP est pour les petits réseaux, OSPF pour les moyens et grands.';
const QJ='Expliquer OSPF. Qu\'est-ce qu\'un DR ? Qu\'est-ce qu\'une area ? Qu\'est-ce que la LSDB ? Qu\'est-ce qu\'un LSA ? Qu\'est-ce que l\'algorithme SPF ? Quelle est la métrique OSPF ?';
const PE='Voisinage qui ne monte pas (hello/dead, masque, area, MTU). Area mismatch. Router ID en conflit. Interface passive oubliée. Oublier le network. Confondre coût et métrique. LSDB incohérente.';
const BP='Utiliser area 0 comme backbone. Documenter les zones. Vérifier les voisins. Utiliser des router-id explicites. Configurer les interfaces passives. Monitorer la convergence. Tester le failover.';
const MEMO='OSPF = link-state, area, DR/BDR, LSDB, LSA, SPF, coût. Voisins en Full. Area 0 backbone. Hello 10s, dead 40s. Coût = 100M / bande passante.';
const MER='graph TD; R1[Routeur1]--area0-->R2[Routeur2]; R2--area1-->R3[Routeur3]; R1--area0-->R3;';
const SRC='RFC 2328, RFC 5340, Cisco Networking Academy, documentation Cisco IOS.';

f.r='OSPF est le protocole de routage dynamique à état de lien le plus utilisé en entreprise.';
f.resume='OSPF : link-state, areas, DR/BDR, LSDB, LSA, SPF, coût.';
f.sections=[
 {title:'Introduction', body:I},
 {title:'Pourquoi les protocoles de routage existent', body:P},
 {title:'Limites des routes statiques', body:P},
 {title:'Présentation d\'OSPF', body:PR},
 {title:'Historique et objectifs', body:PR},
 {title:'Fonctionnement général', body:FG},
 {title:'États des voisins OSPF', body:EV},
 {title:'Élection DR et BDR', body:DR},
 {title:'Zones OSPF', body:ZO},
 {title:'Backbone Area 0', body:BB},
 {title:'LSDB', body:LS},
 {title:'LSA', body:LSA},
 {title:'SPF Algorithm (Dijkstra)', body:SPF},
 {title:'Métriques OSPF', body:MC},
 {title:'Coût OSPF', body:MC},
 {title:'Tables OSPF', body:TA},
 {title:'Architecture multi-sites', body:AM},
 {title:'Cas concret entreprise', body:CE},
 {title:'Configuration Cisco IOS', body:PROC},
 {title:'Vérification', body:VER},
 {title:'Dépannage', body:DEP},
 {title:'Comparatif RIP / OSPF', body:COMP},
 {title:'Questions de jury', body:QJ},
 {title:'Pièges d\'examen', body:PE},
 {title:'Bonnes pratiques', body:BP},
 {title:'Mémo de révision', body:MEMO},
 {title:'Schémas Mermaid', body:MER},
 {title:'Sources de référence', body:SRC}
];
// Add commands section
f.sections.splice(18,0,{title:'Commandes Cisco IOS', body:CMD});
fs.writeFileSync('content/cp4.json', JSON.stringify(d,null,2)+'\n','utf8');
console.log('ospf enriched');