const fs=require('fs');
const m=JSON.parse(fs.readFileSync('content/manifest.json','utf8'));

function classify(f, file){
  const id=(f.id||'').toLowerCase();
  const t=(f.t||'').toLowerCase();
  const tags=(f.tags||[]).join(' ').toLowerCase();
  const txt=id+' '+t+' '+tags;
  if(/(?:^|[\s'’-])ia(?:$|[\s'’-])|intelligence artificielle|prompt|copilot|chatgpt|claude|rgpd|automatisation|générative|hallucination/.test(txt)) return 'cp1';
  if(/windows 1[01]|déploiement|m365|microsoft 365|teams|onedrive|sharepoint|messagerie|inventaire|mdt|intune|collab|poste/.test(txt)) return 'cp2';
  if(/support|ticket|diagnostic|itil|incident|documentation|procédure support|prise en main|assistance/.test(txt)) return 'cp3';
  if(/réseau|osi|tcp|ip|vlan|trunk|stp|etherchannel|routage|rip|ospf|nat|pat|dhcp|dns|wi-?fi|vpn|pare-feu|sécurité réseau|cisco|acl|toip|voip/.test(txt)) return 'cp4';
  if(/windows server|active directory|gpo|powershell|linux|bash|apache|nginx|ssh|mariadb|services|utilisateurs|groupes/.test(txt)) return 'cp5';
  if(/virtuel|hyperviseur|vmware|hyper-v|stockage virtuel|snapshot|haute disponibilité|clustering|vmotion|drs/.test(txt)) return 'cp6';
  if(/mfa|pki|certificat|iam|durcissement|siem|ids|ips|audit|journalisation|zero trust|vulnérabilité|identité/.test(txt)) return 'cp7';
  if(/sauvegarde|pra|pca|réplication|restauration|sinistre|reprise|rpo|rto/.test(txt)) return 'cp9';
  if(/supervision|monitoring|centreon|zabbix|grafana|glpi|alerting|logs|mises à jour|patch|inventaire automatisé|kpi|capacity/.test(txt)) return 'cp10';
  if(file==='transverse.json'){
    if(/ia|copilot|prompt|chatgpt|claude|rgpd|automatisation/.test(txt)) return 'cp1';
    if(/collab|m365|teams|onedrive|sharepoint|messagerie|poste|deploiement/.test(txt)) return 'cp2';
    if(/support|ticket|diagnostic|itil|incident/.test(txt)) return 'cp3';
    if(/securite|cyber|mfa|rbac|zero|zt|hardening|vuln|siem|ids|ips|iam/.test(txt)) return 'cp7';
    if(/sauvegarde|backup|continuite|pra|pca|replication|restauration/.test(txt)) return 'cp9';
    if(/supervision|monitoring|patch|update|logs|mettre/.test(txt)) return 'cp10';
    return 'cp3';
  }
  const oldCp=(()=>{
    const m1=txt.match(/cp(10|\d)/); if(m1) return parseInt(m1[1],10);
    const m2=txt.match(/ccp(10|\d+)/); if(m2) return parseInt(m2[1],10);
    return null;
  })();
  const map={1:'cp3',2:'cp5',3:'cp5',4:'cp4',5:'cp6',6:'cp5',7:'cp7',8:'cp9',9:'cp2',10:'cp10'};
  if(oldCp && map[oldCp]) return map[oldCp];
  const mm=id.match(/mig-legacy-cp(10|\d)/); if(mm && map[parseInt(mm[1],10)]) return map[parseInt(mm[1],10)];
  const mm2=id.match(/mig-legacy-ccp(10|\d)/); if(mm2 && map[parseInt(mm2[1],10)]) return map[parseInt(mm2[1],10)];
  return 'cp3';
}

const buckets={};
for(const cp of ['cp1','cp2','cp3','cp4','cp5','cp6','cp7','cp9','cp10']) buckets[cp]=[];
let total=0;
for(const file of m.files){
  if(!/^cp\d\.json$/.test(file) && file!=='transverse.json') continue;
  const d=JSON.parse(fs.readFileSync('content/'+file,'utf8'));
  for(const f of (d.fiches||[])){
    if(String(f.id).endsWith('-essentiel')) continue;
    const cp=classify(f,file);
    buckets[cp].push({id:f.id, title:f.t, from:file});
    total++;
  }
}

const missingTopics = {
 cp1: ["Introduction à l'IA","Prompt Engineering","Copilot","ChatGPT","Claude","Sécurité des données dans l'IA","RGPD et IA","Usage professionnel de l'IA","Automatisation","IA générative","Limites de l'IA","Bonnes pratiques"],
 cp2: ["Windows 10","Windows 11","Installation de postes","Microsoft 365","Teams","OneDrive","SharePoint","Messagerie","Configuration de postes","Inventaire","Gestion du matériel"],
 cp3: ["Diagnostic","Support utilisateur","Ticketing","Méthodologie ITIL","Résolution incidents","Documentation","Procédures support","Prise en main à distance"],
 cp4: ["OSI","TCP/IP","IPv4","IPv6","VLAN","Trunk","STP","EtherChannel","Routage","RIP","OSPF","NAT","PAT","DHCP","DNS","Wi-Fi","VPN","Pare-feu","Sécurité réseau","Cisco IOS","ACL"],
 cp5: ["Active Directory","GPO","DNS Windows","DHCP Windows","PowerShell","Hyper-V","Linux","Bash","Apache","Nginx","SSH","MariaDB","Gestion des services","Sauvegardes"],
 cp6: ["VMware","Hyper-V avancé","Virtualisation serveurs","Stockage","Réseaux virtuels","Clustering","Haute disponibilité"],
 cp7: ["MFA","PKI","Certificats","IAM","Durcissement","SIEM","IDS","IPS","Audit","Journalisation","Zero Trust","Gestion des vulnérabilités"],
 cp9: ["Sauvegarde","PRA","PCA","Réplication","Restauration","Gestion des sinistres","Tests de reprise"],
 cp10: ["Centreon","Zabbix","Grafana","GLPI","Monitoring","Alerting","Logs","Mises à jour","Patch management","Inventaire automatisé"]
};

let md='# Audit mapping REAC TSSR\n\n';
md+='Total fiches migrables: '+total+'\n\n';
for(const cp of ['cp1','cp2','cp3','cp4','cp5','cp6','cp7','cp9','cp10']){
  md+='## '+cp+' — '+buckets[cp].length+' fiches\n\n';
  for(const f of buckets[cp]) md+='- '+f.id+' | '+f.title+' (from '+f.from+')\n';
  md+='\n';
}
md+='\n## Fiches manquantes (topics sans fiche correspondante)\n\n';
for(const cp of Object.keys(missingTopics)){
  const existing=(buckets[cp]||[]).map(f=> (f.id+' '+f.title).toLowerCase());
  const missing=[];
  for(const topic of missingTopics[cp]){
    const slug=topic.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const found=existing.some(s=> s.includes(slug) || s.includes(slug.replace(/\s+/g,'-')) );
    if(!found) missing.push(topic);
  }
  md+='- '+cp+': '+missing.length+' manquantes — '+missing.join(', ')+'\n';
}
md+='\n## Estimation mots par CP (fiches x 2500)\n\n';
for(const cp of Object.keys(buckets)){
  const n=buckets[cp].length + (missingTopics[cp]?missingTopics[cp].length:0);
  md+='- '+cp+': ~'+(n*2500)+' mots ('+n+' fiches)\n';
}
fs.writeFileSync('AUDIT_MAPPING.md', md, 'utf8');
console.log('written AUDIT_MAPPING.md');