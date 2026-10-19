const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp4.json','utf8'));

// create fiche entries for qcm categories if missing
const ids=['cp4-qcm-debutant','cp4-qcm-intermediaire','cp4-qcm-avance','cp4-examen-blanc'];
for(const id of ids){
  if(!d.fiches.find(f=>f.id===id)){
    d.fiches.push({id,t:id.replace('cp4-','').replace(/-/g,' '),level:'intermediaire',cli:false,r:'QCM par compétence.',tags:['cp4','qcm'],g:[],c:'Aucune.',p:[],w:'QCM.',resume:'QCM par niveau.',sections:[{title:'Introduction',body:'QCM.'}]});
  }
}

const Q=(id,cat,diff,q,choices,answer,explain)=>{
  return {id, fiche:'cp4-quiz', section:'cp4', difficulty:diff, category:cat, q, choices, answer, explain};
};

const questions=[];
let n=1;
function add(cat,diff,q,choices,answer,explain){
  questions.push(Q('cp4-qcm-'+String(n).padStart(3,'0'), cat, diff, q, choices, answer, explain));
  n++;
}

// IPv4 (15)
add('IPv4','debutant','Quelle est la taille d\'une adresse IPv4 ?', ['16 bits','32 bits','64 bits','128 bits'],1,'Une adresse IPv4 fait 32 bits.');
add('IPv4','debutant','Combien d\'octets dans une adresse IPv4 ?', ['2','4','6','8'],1,'4 octets de 8 bits = 32 bits.');
add('IPv4','debutant','Quelle est l\'adresse de loopback ?', ['127.0.0.1','192.168.1.1','10.0.0.1','169.254.0.1'],0,'127.0.0.1 est le loopback.');
add('IPv4','debutant','Quelle plage est privée (RFC1918) ?', ['8.8.8.0/24','192.168.0.0/16','203.0.113.0/24','1.1.1.0/24'],1,'192.168.0.0/16 est privée.');
add('IPv4','intermediaire','Combien d\'hôtes utilisables dans un /26 ?', ['60','62','64','66'],1,'2^6 - 2 = 62.');
add('IPv4','intermediaire','Quel est le broadcast de 192.168.1.0/26 ?', ['192.168.1.63','192.168.1.64','192.168.1.127','192.168.1.255'],0,'/26 = 64 adresses, broadcast = .63.');
add('IPv4','intermediaire','Qu\'est-ce que le VLSM ?', ['Masques de longueur variable','Masque fixe','Sous-réseau unique','Agrégation'],0,'VLSM permet des masques de tailles différentes.');
add('IPv4','intermediaire','Quelle est l\'adresse de réseau de 192.168.1.130/26 ?', ['192.168.1.128','192.168.1.130','192.168.1.0','192.168.1.64'],0,'/26 : blocs de 64, 130 est dans 128-191.');
add('IPv4','avance','Quel est le pas (block size) d\'un /27 ?', ['8','16','32','64'],2,'256-224=32.');
add('IPv4','avance','Combien de sous-réseaux /28 dans un /24 ?', ['8','16','32','64'],1,'2^(28-24)=16.');
add('IPv4','avance','Qu\'est-ce que le supernetting ?', ['Agrégation de réseaux','Découpage','Masque fixe','Routage statique'],0,'Supernetting = agrégation.');
add('IPv4','examen','Quelle adresse est l\'APIPA ?', ['169.254.0.0/16','127.0.0.0/8','10.0.0.0/8','172.16.0.0/12'],0,'APIPA = 169.254.x.x.');
add('IPv4','examen','Quel est le broadcast de 10.0.0.0/8 ?', ['10.255.255.255','10.0.0.255','255.255.255.255','10.0.255.255'],0,'Broadcast du réseau 10.0.0.0/8.');
add('IPv4','examen','Quelle est la première adresse utilisable de 192.168.1.0/24 ?', ['192.168.1.0','192.168.1.1','192.168.1.254','192.168.1.255'],1,'Première utilisable = .1.');
add('IPv4','examen','Combien d\'hôtes dans un /30 ?', ['0','2','4','6'],1,'2^2 - 2 = 2.');

// IPv6 (10)
add('IPv6','debutant','Taille d\'une adresse IPv6 ?', ['32 bits','64 bits','128 bits','256 bits'],2,'IPv6 = 128 bits.');
add('IPv6','debutant','Préfixe link-local ?', ['fe80::/10','2000::/3','fc00::/7','ff00::/8'],0,'Link-local = fe80::/10.');
add('IPv6','debutant','Qu\'est-ce que le SLAAC ?', ['Autoconfiguration','DHCP','Routage','NAT'],0,'SLAAC = autoconfiguration sans DHCP.');
add('IPv6','intermediaire','Qu\'est-ce que NDP ?', ['Remplace ARP','Protocole de routage','Protocole de transport','Protocole applicatif'],0,'NDP remplace ARP en IPv6.');
add('IPv6','intermediaire','Préfixe global unicast ?', ['2000::/3','fe80::/10','fc00::/7','ff00::/8'],0,'Global unicast = 2000::/3.');
add('IPv6','intermediaire','Qu\'est-ce que ::1 ?', ['Loopback','Broadcast','Multicast','Anycast'],0,'::1 est le loopback.');
add('IPv6','avance','Quel préfixe pour un sous-réseau ?', ['/48','/56','/64','/128'],2,'/64 standard pour un sous-réseau.');
add('IPv6','avance','Qu\'est-ce que le dual stack ?', ['IPv4 et IPv6 simultanés','Tunneling','Translation','NAT64'],0,'Dual stack = IPv4+IPv6.');
add('IPv6','examen','Qu\'est-ce que ff02::1 ?', ['Tous les nœuds','Tous les routeurs','Loopback','Broadcast'],0,'ff02::1 = tous les nœuds.');
add('IPv6','examen','Qu\'est-ce que le solicited-node ?', ['Multicast pour NDP','Broadcast','Anycast','Unicast'],0,'Solicited-node multicast pour NDP.');

// VLAN (10)
add('VLAN','debutant','VLAN = ?', ['Domaine de broadcast logique','Sous-réseau IP','Protocole de routage','Câble'],0,'VLAN = domaine de broadcast logique.');
add('VLAN','debutant','Port access = ?', ['1 VLAN','Plusieurs VLAN','Trunk','Aucun VLAN'],0,'Port access = 1 VLAN.');
add('VLAN','debutant','Trunk transporte ?', ['Plusieurs VLAN','1 VLAN','Aucun VLAN','Tout le trafic'],0,'Trunk transporte plusieurs VLAN.');
add('VLAN','intermediaire','Tag VLAN = ?', ['802.1Q','802.3','802.11','802.1D'],0,'802.1Q tagge les VLAN.');
add('VLAN','intermediaire','VLAN natif = ?', ['VLAN non taggé','VLAN par défaut','VLAN de gestion','VLAN voix'],0,'VLAN natif = non taggé.');
add('VLAN','intermediaire','VLAN 1 = ?', ['VLAN par défaut','VLAN natif','VLAN de gestion','VLAN voix'],0,'VLAN 1 = par défaut.');
add('VLAN','avance','Communication inter-VLAN nécessite ?', ['Routeur ou switch L3','Switch L2','Hub','Répéteur'],0,'Routage inter-VLAN.');
add('VLAN','avance','VLAN voix nécessite ?', ['QoS','VLAN data','Trunk','NAT'],0,'QoS pour la voix.');
add('VLAN','examen','Pourquoi changer le VLAN natif ?', ['Sécurité','Performance','Compatibilité','Aucune raison'],0,'Sécurité.');
add('VLAN','examen','Port en mode access avec VLAN 10 : quelle commande ?', ['switchport access vlan 10','switchport trunk allowed vlan 10','vlan 10','switchport mode trunk'],0,'switchport access vlan 10.');

// Trunk (5)
add('Trunk','debutant','Trunk = ?', ['Lien multi-VLAN','Lien mono-VLAN','Câble croisé','Hub'],0,'Trunk = multi-VLAN.');
add('Trunk','intermediaire','Native VLAN mismatch = ?', ['Problème de communication','Amélioration','Aucun effet','Sécurité accrue'],0,'Mismatch = problème.');
add('Trunk','intermediaire','Allowed list = ?', ['VLAN autorisés sur le trunk','VLAN bloqués','VLAN par défaut','Tous les VLAN'],0,'Allowed list = VLAN autorisés.');
add('Trunk','avance','DTP = ?', ['Négociation de trunk','Protocole de routage','Protocole de sécurité','Protocole de gestion'],0,'DTP = négociation trunk.');
add('Trunk','examen','Commande pour forcer un trunk ?', ['switchport mode trunk','switchport mode access','switchport trunk allowed vlan','switchport native vlan'],0,'switchport mode trunk.');

// STP (10)
add('STP','debutant','STP évite ?', ['Les boucles','Les collisions','Les virus','Les pannes'],0,'STP évite les boucles.');
add('STP','debutant','Root Bridge élu par ?', ['Bridge ID','IP','MAC','Hostname'],0,'Bridge ID (priorité + MAC).');
add('STP','debutant','Port bloqué = ?', ['Ne transfère pas','Transfère','Apprend les MAC','Envoie des BPDU'],0,'Blocking = ne transfère pas.');
add('STP','intermediaire','RSTP convergence = ?', ['Quelques secondes','30 secondes','5 minutes','1 minute'],0,'RSTP = quelques secondes.');
add('STP','intermediaire','PVST = ?', ['Un spanning tree par VLAN','Un spanning tree global','Pas de spanning tree','RSTP'],0,'PVST = par VLAN.');
add('STP','intermediaire','Portfast sur ?', ['Ports edge','Trunks','Ports bloqués','Ports root'],0,'Portfast = ports edge.');
add('STP','avance','BPDU guard protège contre ?', ['BPDU non autorisés','Virus','ARP spoofing','DHCP spoofing'],0,'BPDU guard.');
add('STP','avance','Forward delay = ?', ['15s par état','30s','5s','60s'],0,'15s listening + 15s learning.');
add('STP','examen','Root Bridge priorité par défaut ?', ['32768','4096','1','0'],0,'32768 par défaut.');
add('STP','examen','État Forwarding = ?', ['Transfère le trafic','Bloque','Apprend','Écoute'],0,'Forwarding = transfère.');

// Routage (10)
add('Routage','debutant','Routage = ?', ['Transfert inter-réseaux','Commutation','Broadcast','Multicast'],0,'Routage = inter-réseaux.');
add('Routage','debutant','Route par défaut = ?', ['0.0.0.0/0','255.255.255.255','127.0.0.1','224.0.0.1'],0,'0.0.0.0/0.');
add('Routage','debutant','Passerelle = ?', ['Routeur local','DNS','DHCP','Switch'],0,'Passerelle = routeur.');
add('Routage','intermediaire','Longest prefix match = ?', ['Route la plus spécifique','Route la moins spécifique','Première route','Dernière route'],0,'Plus spécifique.');
add('Routage','intermediaire','Distance administrative connected = ?', ['0','1','90','110'],0,'Connected = 0.');
add('Routage','intermediaire','Distance administrative static = ?', ['0','1','90','110'],1,'Static = 1.');
add('Routage','avance','Distance administrative OSPF = ?', ['90','110','120','20'],1,'OSPF = 110.');
add('Routage','avance','Distance administrative RIP = ?', ['90','110','120','20'],2,'RIP = 120.');
add('Routage','examen','Distance administrative EIGRP = ?', ['90','110','120','20'],0,'EIGRP = 90.');
add('Routage','examen','Distance administrative eBGP = ?', ['90','110','120','20'],3,'eBGP = 20.');

// OSPF (10)
add('OSPF','debutant','OSPF = ?', ['Link-state','Distance vector','Path vector','Hybride'],0,'OSPF = link-state.');
add('OSPF','debutant','Area 0 = ?', ['Backbone','Stub','NSSA','Totally stubby'],0,'Area 0 = backbone.');
add('OSPF','debutant','Hello interval multi-accès = ?', ['5s','10s','30s','60s'],1,'10 secondes.');
add('OSPF','intermediaire','Dead interval = ?', ['20s','40s','120s','180s'],1,'40 secondes (4x hello).');
add('OSPF','intermediaire','DR élu par ?', ['Priorité puis Router ID','IP','MAC','Hostname'],0,'Priorité puis Router ID.');
add('OSPF','intermediaire','Priorité par défaut = ?', ['0','1','32768','4096'],1,'1 par défaut.');
add('OSPF','avance','LSA Type 1 = ?', ['Router LSA','Network LSA','Summary LSA','External LSA'],0,'Type 1 = Router LSA.');
add('OSPF','avance','LSA Type 2 = ?', ['Router LSA','Network LSA','Summary LSA','External LSA'],1,'Type 2 = Network LSA.');
add('OSPF','examen','LSA Type 3 = ?', ['Router LSA','Network LSA','Summary LSA','External LSA'],2,'Type 3 = Summary LSA (inter-area).');
add('OSPF','examen','Coût OSPF = ?', ['100M / bande passante','Nombre de sauts','Délai','Débit'],0,'Coût = 100M / bande passante.');

// DHCP (5)
add('DHCP','debutant','DHCP = ?', ['Attribution automatique IP','Résolution de noms','Routage','Commutation'],0,'DHCP = attribution automatique.');
add('DHCP','debutant','DORA = ?', ['Discover, Offer, Request, Acknowledge','Domain, Offer, Request, Ack','Discover, Offer, Renew, Ack','Domain, Offer, Renew, Ack'],0,'DORA.');
add('DHCP','intermediaire','Port DHCP = ?', ['53','67/68','80','443'],1,'67 (serveur) / 68 (client).');
add('DHCP','intermediaire','APIPA = ?', ['169.254.x.x','127.0.0.1','0.0.0.0','255.255.255.255'],0,'APIPA = 169.254.x.x.');
add('DHCP','examen','DHCP relay = ?', ['ip helper-address','dhcp relay','ip dhcp server','dhcp server'],0,'ip helper-address.');

// DNS (5)
add('DNS','debutant','DNS = ?', ['Résolution de noms','Attribution IP','Routage','Commutation'],0,'DNS = résolution de noms.');
add('DNS','debutant','Port DNS = ?', ['53','80','443','25'],0,'Port 53.');
add('DNS','intermediaire','Enregistrement A = ?', ['Adresse IPv4','Alias','Serveur mail','Serveur de noms'],0,'A = IPv4.');
add('DNS','intermediaire','Enregistrement MX = ?', ['Adresse IPv4','Alias','Serveur mail','Serveur de noms'],2,'MX = serveur mail.');
add('DNS','examen','Enregistrement CNAME = ?', ['Adresse IPv4','Alias','Serveur mail','Serveur de noms'],1,'CNAME = alias.');

// NAT/PAT (5)
add('NAT/PAT','debutant','NAT = ?', ['Traduction d\'adresse','Résolution de noms','Routage','Commutation'],0,'NAT = traduction.');
add('NAT/PAT','debutant','PAT = ?', ['NAT + ports','NAT statique','NAT dynamique','Pas de NAT'],0,'PAT = NAT overload.');
add('NAT/PAT','intermediaire','Inside = ?', ['Réseau privé','Internet','DMZ','VLAN'],0,'Inside = privé.');
add('NAT/PAT','intermediaire','Outside = ?', ['Réseau privé','Internet','DMZ','VLAN'],1,'Outside = Internet.');
add('NAT/PAT','examen','Commande pour vider la table NAT ?', ['clear ip nat translation *','show ip nat translations','ip nat inside','ip nat outside'],0,'clear ip nat translation *.');

// ACL (10)
add('ACL','debutant','ACL standard filtre sur ?', ['Source uniquement','Destination uniquement','Source et destination','Port'],0,'Standard = source.');
add('ACL','debutant','ACL étendue filtre sur ?', ['Source uniquement','Destination uniquement','Source, destination, protocole, port','MAC'],2,'Étendue = tout.');
add('ACL','debutant','Implicit deny = ?', ['Refus par défaut','Autorisation par défaut','Pas de règle','Erreur'],0,'Implicit deny.');
add('ACL','intermediaire','ACL standard numéros ?', ['1-99, 1300-1999','100-199, 2000-2699','1-100','200-300'],0,'1-99, 1300-1999.');
add('ACL','intermediaire','ACL étendue numéros ?', ['1-99, 1300-1999','100-199, 2000-2699','1-100','200-300'],1,'100-199, 2000-2699.');
add('ACL','intermediaire','Placement ACL standard = ?', ['Près de la destination','Près de la source','Sur le switch','Sur le serveur'],0,'Près de la destination.');
add('ACL','avance','Placement ACL étendue = ?', ['Près de la destination','Près de la source','Sur le switch','Sur le serveur'],1,'Près de la source.');
add('ACL','avance','Masque wildcard 0.0.0.255 = ?', ['Tous les hôtes','1 seul hôte','256 hôtes','Réseau entier'],0,'0.0.0.255 = tous les hôtes du /24.');
add('ACL','examen','Traitement ACL = ?', ['Séquentiel, première correspondance','Parallèle','Aléatoire','Par priorité'],0,'Séquentiel.');
add('ACL','examen','Masque wildcard = ?', ['Masque inversé','Masque normal','Masque de sous-réseau','Masque de broadcast'],0,'Masque inversé.');

// Firewall (5)
add('Firewall','debutant','Pare-feu = ?', ['Filtrage de trafic','Routage','Commutation','DNS'],0,'Filtrage.');
add('Firewall','debutant','DMZ = ?', ['Zone semi-fiable','Zone de confiance','Zone non fiable','Zone interne'],0,'DMZ = semi-fiable.');
add('Firewall','intermediaire','Stateful = ?', ['Suivi de connexion','Paquet par paquet','Pas de suivi','Inspection L7'],0,'Stateful = suivi.');
add('Firewall','intermediaire','Stateless = ?', ['Suivi de connexion','Paquet par paquet','Pas de suivi','Inspection L7'],1,'Stateless = paquet par paquet.');
add('Firewall','examen','NGFW = ?', ['Next-Gen Firewall','Network Gateway Firewall','New Generation Firewall','No Good Firewall'],0,'NGFW = Next-Gen.');

// Add to quiz array
d.quiz = (d.quiz||[]).concat(questions);
// fix fiche references: set fiche to cp4-quiz
for(const q of d.quiz){ q.fiche='cp4-quiz'; }

fs.writeFileSync('content/cp4.json', JSON.stringify(d,null,2)+'\n','utf8');
console.log('QCM added:', questions.length, 'total quiz:', d.quiz.length);