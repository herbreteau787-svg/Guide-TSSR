const fs=require('fs');

const newCPs = [
 {id:'cp1', title:"CP1 — Exploiter l'intelligence artificielle et encadrer son usage"},
 {id:'cp2', title:"CP2 — Déploiement des équipements numériques et outils collaboratifs"},
 {id:'cp3', title:"CP3 — Apporter une assistance technique"},
 {id:'cp4', title:"CP4 — Exploiter un réseau IP"},
 {id:'cp5', title:"CP5 — Installer et assurer l'exploitation de serveurs Windows et Linux"},
 {id:'cp6', title:"CP6 — Exploiter des serveurs dans une infrastructure virtualisée"},
 {id:'cp7', title:"CP7 — Gérer les accès et la sécurité dans un environnement hybride"},
 {id:'cp9', title:"CP9 — Assurer la continuité et la reprise de l'infrastructure"},
 {id:'cp10', title:"CP10 — Mettre à jour et superviser les éléments d'infrastructure"}
];

const missingTopics = {
 cp1: ["Introduction à l'IA","Prompt Engineering","Copilot","ChatGPT","Claude","Sécurité des données dans l'IA","RGPD et IA","Usage professionnel de l'IA","Automatisation","IA générative","Limites de l'IA","Bonnes pratiques"],
 cp2: ["Windows 10","Windows 11","Installation de postes","Microsoft 365","Teams","OneDrive","SharePoint","Messagerie","Configuration de postes","Inventaire","Gestion du matériel"],
 cp3: ["Diagnostic","Support utilisateur","Ticketing","Méthodologie ITIL","Résolution incidents","Documentation","Procédures support","Prise en main à distance"],
 cp4: ["Architecture réseau","OSI","TCP/IP","IPv4","IPv6","VLAN","Trunk","STP","EtherChannel","Routage","RIP","OSPF","NAT","PAT","DHCP","DNS","Wi-Fi","VPN","Pare-feu","Sécurité réseau"],
 cp5: ["Windows Server","Active Directory","DNS Microsoft","DHCP Microsoft","GPO","PowerShell","Gestion utilisateurs","Gestion groupes","Rôles et fonctionnalités","Sauvegarde","Haute disponibilité","Virtualisation Hyper-V","Linux","Apache","Nginx","SSH","Bash","Scripts","MariaDB","Docker","Supervision","Centreon","Grafana","Sauvegarde Linux"],
 cp6: ["Hyperviseur","VM","Stockage virtuel","Snapshot","Sauvegarde VM","Haute disponibilité","DRS","vMotion","Switch virtuel","Sécurité hyperviseur"],
 cp7: ["Identité hybride","MFA","RBAC","Zero Trust","Segmentation réseau","Durcissement","Gestion des vulnérabilités","SIEM","IDS/IPS","Journalisation"],
 cp9: ["Analyse d'impact","RPO et RTO","Règle 3-2-1","Réplication","Snapshots et restauration","Test de reprise","Communication de crise","Validation de restauration","Isolation et containment"],
 cp10: ["Supervision","Monitoring","Patch et mises à jour","Logs centralisés","Métriques","Alerting"]
};

function slug(s){ return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
function classify(f){
  const txt=(f.id+' '+(f.t||'')+' '+(f.tags||[]).join(' ')).toLowerCase();
  if(/ia|copilot|prompt|chatgpt|claude|rgpd/.test(txt)) return 'cp1';
  if(/cp9|backup|rpo|rto|replication|snapshot|restore|continuite|pra|\bdr\b/.test(txt)) return 'cp9';
  if(/cp10|supervision|monitoring|patch|update|logs/.test(txt)) return 'cp10';
  if(/cp7|cyber|mfa|rbac|zero.?trust|zt|hardening|vuln|siem|identity|segmentation|ids|ips/.test(txt)) return 'cp7';
  if(/cp6|virt|hyp|vm|snap|ha|drs|motion|container|docker/.test(txt)) return 'cp6';
  if(/cp5|windows|linux|ad|gpo|dns|dhcp|powershell|ssh|lvm|systemd|serveur/.test(txt)) return 'cp5';
  if(/cp4|reseau|vlan|routage|nat|dhcp|dns|wifi|ipv4|ipv6|vpn|firewall|toip|cisco|port|subnet|trunk|stp|osi|tcp/.test(txt)) return 'cp4';
  if(/cp3|support|ticket|diagnostic|poste|malware|remote|entretien|print|mail|escalade|evenements|collab/.test(txt)) return 'cp3';
  if(/cp2|deploy|m365|teams|onedrive|sharepoint|installation|inventaire|materiel|licence|hardware|parc|image|mdt|intune/.test(txt)) return 'cp2';
  return 'cp3';
}

// collect existing fiches
const oldFiles=['cp1.json','cp2.json','cp3.json','cp4.json','cp5.json','cp6.json','cp7.json','cp8.json','cp9.json','cp10.json'];
const byCp={};
for(const cp of newCPs) byCp[cp.id]=[];
for(const file of oldFiles){
  if(!fs.existsSync('content/'+file)) continue;
  const d=JSON.parse(fs.readFileSync('content/'+file,'utf8'));
  for(const f of (d.fiches||[])){
    // skip essentiel old
    if(String(f.id).endsWith('-essentiel')) continue;
    const target=classify(f);
    if(!byCp[target]) byCp[target]=[];
    byCp[target].push(f);
  }
}

// generate skeleton topic fiches
for(const cp of newCPs){
  const existingIds=new Set((byCp[cp.id]||[]).map(f=>f.id));
  const topics=missingTopics[cp.id]||[];
  for(const topic of topics){
    const id=cp+'-'+slug(topic);
    if(existingIds.has(id)) continue;
    byCp[cp.id].push({
      id, t: topic, level:'debutant', r:'À compléter.', tags:[cp, slug(topic)], g:[], c:'Aucune.', p:[], w:'À compléter.', resume:'Fiche à développer.', sections:[{title:'Introduction', body:'À compléter.'}]
    });
  }
}

// add essentiel to each
for(const cp of newCPs){
  const others=(byCp[cp.id]||[]).map(f=>f.id);
  const ess={
    id: cp+'-essentiel',
    t: cp.title+' — L\'essentiel',
    level:'exam',
    r:'Fiche essentielle : objectifs, notions, tableau, diagnostic, pièges, index.',
    tags:[cp,'essentiel'],
    g:['Objectif','Notions','Tableau','Diagnostic','Pièges','Index'],
    c:'À compléter.',
    p:['À compléter.'],
    w:'À compléter.',
    resume:'Fiche essentielle du CP.',
    couvre: others,
    sections:[{title:'Introduction', body:'À compléter.'}]
  };
  byCp[cp.id].unshift(ess);
}

// write new cp files
for(const cp of newCPs){
  const d={id: cp.id, title: cp.title, fiches: byCp[cp.id], quiz:[]};
  fs.writeFileSync('content/'+cp.id+'.json', JSON.stringify(d,null,2)+'\n','utf8');
  console.log(cp.id, '->', d.fiches.length, 'fiches');
}

// remove cp8 from manifest
const manifest=JSON.parse(fs.readFileSync('content/manifest.json','utf8'));
manifest.files=manifest.files.filter(f=>f!=='cp8.json');
fs.writeFileSync('content/manifest.json', JSON.stringify(manifest,null,2)+'\n','utf8');
// delete cp8.json
if(fs.existsSync('content/cp8.json')) fs.unlinkSync('content/cp8.json');
console.log('cp8 removed');