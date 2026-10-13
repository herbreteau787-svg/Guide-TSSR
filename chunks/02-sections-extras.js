// chunk: sections complémentaires (supervision, identité, conteneurs, IaC)
const G = window.GUIDE;
const push = (arr) => G.sections.push(...arr);

push([
{
  id:"supervision",
  group:"CCP11",
  icon:"📈",
  title:"CCP11 · Supervision · Zabbix, Nagios et observabilité",
  desc:"Disponibilité, métriques, journaux, alerting et tableaux de bord.",
  fiches:[
   { id:"sup-zabbix", t:"Zabbix : hôtes, templates et alertes", level:"intermediaire", r:"Zabbix surveille par agent/SSH/SNMP. Les templates standardisent la collecte. Les triggers et actions génèrent alertes et escalades.", tags:["zabbix","supervision","snmp"], g:["Installer Zabbix server sur une VM dédiée","Ajouter des hôtes par template (Linux/Windows/Cisco)","Créer des triggers et actions email/SMS","Construire des dashboards par service"], c:`# Zabbix agent (Linux)
apt install zabbix-agent -y
# /etc/zabbix/zabbix_agentd.conf
Server=192.168.1.10
Hostname=SRV1
systemctl enable --now zabbix-agent`, p:["Templates communautaires ; éviter les doublons","Seuils CPU/RAM/disco avec durées","Maintenance windows pour éviter le bruit"], w:"Une mauvaise stratégie de nommage complique les rapports." },
   { id:"sup-snmp", t:"SNMP, MIB et sécurité", level:"intermediaire", r:"SNMP expose l'état des équipements. SNMPv3 obligatoire pour chiffrer et authentifier.", tags:["snmp","cisco","reseau"], g:["Activer SNMPv3 avec authPriv","Limiter l'accès par ACL","Collecter CPU, mémoire, interfaces","Tester avec snmpwalk"], c:`# Cisco
snmp-server group MON v3 priv
snmp-server user monitor MON v3 auth sha Pass123 priv aes 128 Pass456
snmp-server view ALL iso included
# Test
snmpwalk -v3 -l authPriv -u monitor -a SHA -A Pass123 -x AES -X Pass456 192.168.1.1`, p:["Exporter les MIB constructeur","Remplacer community public/private","Port 161 UDP/TCP pour traps"], w:"SNMPv1/v2c en clair = fuite d'information." },
   { id:"sup-logging", t:"Syslog centralisé et corrélation", level:"avance", r:"Concentrer les logs OS et réseau, normaliser et rechercher. Syslog-ng ou rsyslog vers un serveur central.", tags:["syslog","logs","centralisation"], g:["Configurer rsyslog pour envoyer les logs","Centraliser sur une VM","Créer filtres par gravité","Relier à Graylog/ELK"], c:`# /etc/rsyslog.d/50-forward.conf
*.* @192.168.1.10:514
# Sur le serveur :
module(load="imudp") input(type="imudp" port="514")
*.* /var/log/remote/all.log`, p:["TCP pour fiabilité","Rotation et rétention","Horodatage NTP indispensable"], w:"Un journal central sans NTP rend l'analyse temporelle inutilisable." },
   { id:"sup-dash", t:"Grafana et métriques", level:"avance", r:"Grafana visualise Prometheus/Loki/InfluxDB, avec alerting multi-canal.", tags:["grafana","prometheus","monitoring"], g:["Installer Prometheus + node_exporter","Ajouter la source dans Grafana","Importer un dashboard standard","Créer des alertes par seuil"], c:`# Prometheus scrape
scrape_configs:
  - job_name: 'linux'
    static_configs:
      - targets: ['192.168.1.20:9100']
# Node exporter
curl -s 192.168.1.20:9100/metrics | head`,
    p:["Cardinality attention ; normaliser les labels","Alerting vers Slack/Teams","Enregistrement longue durée"], w:"Les métriques ne remplacent pas les logs pour le root-cause."
  }
 ]
},
{
  id:"identite",
  group:"CCP11",
  icon:"🔐",
  title:"CCP11 · Identité, SSO et annuaires",
  desc:"LDAP, authentification forte, MFA, RBAC et gouvernance des accès.",
  fiches:[
   { id:"id-ldap", t:"LDAP : structure et recherche", level:"intermediaire", r:"LDAP organise les objets en DIT (DN, OU, DC). Lire avec ldapsearch avant toute modification.", tags:["ldap","annuaire","recherche"], g:["Identifier le DN de base et les classes","Tester une recherche par filtre","Vérifier les droits de lecture","Documenter l'arborescence"], c:`ldapsearch -x -H ldap://dc1.tssr.local -D "cn=admin,dc=tssr,dc=local" -W -b "dc=tssr,dc=local" "(sAMAccountName=jdupont)"
ldapsearch -x -LLL -b "ou=Users,dc=tssr,dc=local" "(objectClass=user)" cn mail`, p:["Filtres LDAP : =, *, &, |","LDAPS port 636 avec certificat","pagination pour gros annuaires"], w:"Modifier directement avec ldapmodify exige prudence (pas de rollback)." },
   { id:"id-mfa", t:"MFA et authentification forte", level:"intermediaire", r:"TOTP, FIDO2, push. Adapter selon risque : admin et accès distants obligatoirement MFA.", tags:["mfa","securite","authentification"], g:["Activer MFA sur VPN/RDP/admin","Fournir un secours (codes, clé de secours)","Former les utilisateurs","Suivre l'adoption"], c:`# Windows Hello / Authenticator
# GPO : activer Windows Hello for Business
# Azure AD/Entra : Conditional Access MFA
# Linux PAM (oath)
pamtester sshd jdupont authenticate`, p:["FIDO2 plus sûr que TOTP","Éviter SMS pour les admins","Mécanisme de récupération documenté"], w:"MFA sans accès de secours = blocage complet en cas de perte du facteur." },
   { id:"id-rbac", t:"RBAC, PAM et gouvernance des privilèges", level:"avance", r:"Rôles par fonction, principe du moindre privilège, revue périodique des accès, comptes séparés admin.", tags:["rbac","pam","securite"], g:["Cartographier les accès par rôle","Séparer comptes nominatifs et admin","Revue trimestrielle des membres de groupes sensibles","Retirer les droits à la sortie"], c:`# PowerShell : membres du groupe Domain Admins
Get-ADGroupMember "Domain Admins" -Recursive | Select SamAccountName
# Azure PIM : activation juste-à-temps
# Linux sudoers :
%admins ALL=(ALL) ALL`,
    p:["Compte d'urgence (break-glass) sous coffre","Logs d'admin centralisés","Attestation manager pour accès sensibles"], w:"Les droits cumulés (groupes imbriqués) sont difficiles à auditer." }
  ]
},
{
  id:"containers",
  group:"CCP11",
  icon:"🐳",
  title:"CCP11 · Conteneurs · Docker, Compose et registry",
  desc:"Empaquetage d'application, orchestration simple, réseau, volumes et sécurité.",
  fiches:[
   { id:"docker-base", t:"Docker : images, conteneurs et cycle de vie", level:"intermediaire", r:"Image = modèle ; conteneur = instance. Build à partir d'un Dockerfile, registry pour distribuer.", tags:["docker","conteneurs"], g:["Installer Docker engine","Lancer un conteneur de test","Construire une image locale","Publier sur un registry privé"], c:`docker run -d --name web -p 8080:80 nginx:alpine
docker ps
docker build -t myapp:1.0 .
docker push registry.local:5000/myapp:1.0
docker logs web --tail 50`, p:["Images officielles pin par digest","Utilisateur non-root dans le conteneur","Scanner les images (Trivy)"], w:"Les conteneurs ne sont pas des VM : le noyau est partagé." },
   { id:"compose", t:"Docker Compose et dépendances", level:"intermediaire", r:"Compose définit des services multi-conteneurs, réseaux et volumes dans un fichier déclaratif.", tags:["compose","docker","yaml"], g:["Rédiger compose.yaml pour app + db","Variables d'environnement externalisées","Healthcheck et restart","Logs et volumes persistants"], c:`services:
  web:
    image: nginx:alpine
    ports: ["8080:80"]
    depends_on: [db]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes: [pgdata:/var/lib/postgresql/data]
volumes:
  pgdata:`, p:["Séparer prod/dev avec override","Secrets via Docker secrets","Networks pour isoler"], w:"Les données en volume anonyme disparaissent au redémarrage si non déclaré." },
   { id:"registry-sec", t:"Sécurité des images", level:"avance", r:"Moindre privilège, images minimales (distroless/alpine), scan, signature et SBOM.", tags:["securite","docker","supply chain"], g:["Choisir des bases minimales","Scanner dans CI","Désactiver root","Signer les images"], c:`trivy image myapp:1.0
cosign sign --key cosign.key registry.local/myapp:1.0
# Dockerfile
USER 10001
EXPOSE 8080`, p:["Secrets jamais dans l'image","Lecture seule des fichiers app","Limite CPU/RAM au run"], w:"Ne pas stocker de mots de passe dans les layers, même supprimés ensuite." }
  ]
},
{
  id:"iac",
  group:"CCP11",
  icon:"🏗️",
  title:"CCP11 · Infrastructure as Code",
  desc:"Terraform, Packer, Ansible pour provisionner et maintenir.",
  fiches:[
   { id:"terraform-base", t:"Terraform : bases et workflow", level:"avance", r:"Déclaratif, state central, providers pour cloud/on-prem. Workflow init/plan/apply.", tags:["terraform","iac","automation"], g:["Initialiser avec backend distant","Planifier avant application","Versionner le code","Formater et valider"], c:`terraform init
terraform fmt -recursive
terraform validate
terraform plan -out plan.tfplan
terraform apply plan.tfplan
terraform output`, p:["State verrouillé (locking)","Modules pour réutilisation","Workspaces/stacks pour environnements"], w:"Un state perdu oblige à importer les ressources manuellement." },
   { id:"packer", t:"Packer : images dorées", level:"avance", r:"Construire des images OS préconfigurées pour VMware/Cloud via des builders et provisionners.", tags:["packer","images","gold"], g:["Définir un template JSON/HCL","Provisionner avec Ansible","Construire et tester","Distribuer"], c:`packer init .
packer validate template.pkr.hcl
packer build template.pkr.hcl
# Vérifier l'image dans vCenter`, p:["Pipeline de build dans CI","Versionnement des images","Durée de vie et rebuild programmé"], w:"Des images non mises à jour deviennent des vulnérabilités." }
  ]
}
]);