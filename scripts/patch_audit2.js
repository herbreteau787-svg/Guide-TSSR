const fs=require('fs');
const p='scripts/audit_mapping.js';
let s=fs.readFileSync(p,'utf8');
// Replace newCp function start: insert keyword-first check after function newCp(f,file){ and before transverse split
const old="function newCp(f, file){\n  const id=(f.id||'').toLowerCase();";
const neu="function newCp(f, file){\n  const id=(f.id||'').toLowerCase();\n  const t=(f.t||'').toLowerCase();\n  const tags=(f.tags||[]).join(' ').toLowerCase();\n  const txt=id+' '+t+' '+tags;\n  // keyword-first classification\n  if(/\\bia\\b|intelligence artificielle|prompt|copilot|chatgpt|claude|rgpd|automatisation|générative|hallucination/.test(txt)) return 'cp1';\n  if(/windows 1[01]|déploiement|m365|microsoft 365|teams|onedrive|sharepoint|messagerie|inventaire|mdt|intune|collab|poste/.test(txt)) return 'cp2';\n  if(/support|ticket|diagnostic|itil|incident|documentation|procédure support|prise en main|assistance/.test(txt)) return 'cp3';\n  if(/réseau|osi|tcp|ip|vlan|trunk|stp|etherchannel|routage|rip|ospf|nat|pat|dhcp|dns|wi-?fi|vpn|pare-feu|sécurité réseau|cisco|acl|toip|voip/.test(txt)) return 'cp4';\n  if(/windows server|active directory|gpo|powershell|linux|bash|apache|nginx|ssh|mariadb|services|utilisateurs|groupes/.test(txt)) return 'cp5';\n  if(/virtuel|hyperviseur|vmware|hyper-v|stockage virtuel|snapshot|haute disponibilité|clustering|vMotion|drs/.test(txt)) return 'cp6';\n  if(/mfa|pki|certificat|iam|durcissement|siem|ids|ips|audit|journalisation|zero trust|vulnérabilité|identité/.test(txt)) return 'cp7';\n  if(/sauvegarde|pra|pca|réplication|restauration|sinistre|reprise|rpo|rto/.test(txt)) return 'cp9';\n  if(/supervision|monitoring|centreon|zabbix|grafana|glpi|alerting|logs|mises à jour|patch|inventaire automatisé|kpi|capacity/.test(txt)) return 'cp10';\n";
// remove the old transverse split and oldCpOf fallback? We'll keep fallback after keyword block.
// Remove duplicate txt declaration later? The original function declares t/tags after. We'll just comment out the original transverse split by replacing it.
s=s.replace("  const id=(f.id||'').toLowerCase();\n  const t=(f.t||'').toLowerCase();\n  const tags=(f.tags||[]).join(' ').toLowerCase();\n  const txt=id+' '+t+' '+tags;\n  // transverse split\n", "  const id=(f.id||'').toLowerCase();\n");
// Remove the old transverse split block (from 'if(file==='transverse.json'){' to its closing)
const start=s.indexOf("  if(file==='transverse.json'){");
const end=s.indexOf("  const n=oldCpOf", start);
if(start!==-1 && end!==-1){ s=s.slice(0,start)+s.slice(end); }
fs.writeFileSync(p,s,'utf8');
console.log('done');