# Basculer l'écosystème du desktop vers le NAS, après le rodage

> **Remplacé en partie par l'[ADR 0012](../../adr/0012-prod-machine-dediee.md)** (12/11) : la prod ira sur une machine
> dédiée, le NAS garde les copies et les fichiers. Ce plan se refait quand la machine s'achète ; le § 2, point 2 (les
> bases et leurs clés), et le § 3 restent la base de sa prochaine version.

> Préparé le 08/11, à exécuter **après la semaine de rodage sur le desktop** (décision de CrOliX le 08/11, feuille de
> route § 1). Rien ici ne se lance avant. Les choix marqués **[choix Claude]** se changent avant la bascule.

## 1. Ce qui existe déjà

`lun-anima/deploy/` (ADR 0008) : `compose.yaml` avec un conteneur Tailscale par appli (`anima`, `acedia`, `avaritia`),
les images GHCR, `deploy.sh` (déploiement et retour arrière), et le `README.md` de la première installation. Les images
v0.1.0 datent du 06/11. Le NAS est un UGREEN DXP2800 (Docker et Compose).

Vérifié dans le code le 08/11, sans écart à corriger :

- La nuit et le matin tournent à l'heure de Paris quel que soit le fuseau du conteneur (`Intl`, `Europe/Paris`).
- La copie de la base du core se fait dans `data/backups/`, donc dans le volume `anima-data`.
- Luxuria joint une adresse `https://…ts.net` : la portée de `plugin-http` admet tout HTTPS.

## 2. Ce que la bascule ajoute à la première installation du README

1. **Des images à jour.** CrOliX publie une release de chaque dépôt après le rodage (lun-anima est à 38 commits de
   v0.1.0). Les versions vont dans `.env`.
2. **Les bases du rodage, pas des bases neuves [choix Claude].** La semaine de rodage est sa vraie mémoire :
   - arrêter les trois tâches du desktop (`Stop-ScheduledTask 'Lun *'`), pour des copies cohérentes ;
   - copier `anima.db`, `acedia.db` et `avaritia.db` dans leurs volumes, au propriétaire `node` de l'image ;
   - garder dans chaque `.env.<app>` le **même** `*_SECRET_KEY` que sur le desktop. Sans elle, les jetons des
     satellites et les clés chiffrées en base ne se lisent plus.
3. **Les adresses qui changent.** Tout ce qui pointait vers le desktop prend le nom de l'appli dans le tailnet :
   - les liaisons du core vers Acedia et Avaritia : refaire `npm run connect` vers `https://acedia.<tailnet>.ts.net` et
     `https://avaritia.<tailnet>.ts.net` (une nouvelle liaison remplace-t-elle l'ancienne ? c'est C2, lun-acedia#30) ;
   - Atelier > Postes : l'adresse de la page d'Acedia et d'Avaritia ;
   - Acedia : `GOOGLE_REDIRECT_URI` vaut `https://acedia.<tailnet>.ts.net/oauth/callback`, déclarée aussi dans la
     console Google, puis une nouvelle connexion Google si l'ancienne refuse ;
   - `CORE_URL` du core, pour les commandes du terminal dans le conteneur.
4. **Les clients.**
   - Luxuria, qui reste sur le desktop : Réglages > L'agent, adresse `https://anima.<tailnet>.ts.net`. Le changement
     efface l'appairage ; nouveau code par `docker compose exec anima npm run pair-code`.
   - Le téléphone : l'origine change, donc installer l'app depuis la nouvelle adresse et se réabonner aux
     notifications.
5. **Le desktop rendu à son rôle de poste.** Une fois le NAS vérifié (§ 3) : `retirer.ps1 -Service D:\lun-service`
   (les tâches partent, les bases restent comme filet), et les `tailscale serve` du desktop retirés.

## 3. Vérifier

- `docker compose ps` : les trois applis `healthy`.
- La Constellation : les trois joignables, Luxuria présente.
- Une conversation avec Luxuria, puis une notification reçue au téléphone.
- La nuit suivante : la veille, la copie de la base dans le volume, le matin.

## 4. Ouvert, à trancher avec CrOliX

- **Une copie hors du NAS.** La copie de la nuit reste sur le même disque que la base. Il faut ajouter une sauvegarde du
  NAS (instantanés ou copie vers un autre support).
- **C2** (lun-acedia#30) : comment une nouvelle liaison traite l'ancienne. La bascule en refait deux.
- **Le retour arrière.** Tant que le desktop garde ses bases et son service (retiré mais pas effacé), revenir en arrière
  revient à relancer `installer.ps1` et à rendre aux clients leurs anciennes adresses.
