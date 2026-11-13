# Mettre le desktop en service

La liste à suivre le jour où le core, Acedia et Avaritia passent sur le desktop pour de bon : lancés au démarrage de
Windows sans fenêtre, joints par le téléphone en HTTPS, chaque base copiée une fois par jour. Spec :
[`specs/2026-11-07-poste-autonome-design.md`](specs/2026-11-07-poste-autonome-design.md). Les scripts sont dans
`lun-anima/deploy/windows/` (leur `LISEZMOI.md` dit ce que fait chacun).

Tout ce qui touche au système (tâches planifiées, pare-feu, Tailscale, registre) se fait à la main, dans l'ordre
ci-dessous. Aucune adresse du tailnet ni aucun nom de machine n'entre dans un dépôt : ils restent dans les `.env` et dans
l'app.

## 1. Avant

- Node 24, `uv` et Git dans le `PATH` (`node -v`, `uv --version`, `git --version`).
- Tailscale installé et connecté sur le desktop et sur le téléphone, HTTPS activé pour le tailnet.
- Les trois dépôts de travail à jour sur `main` (l'installation clone depuis leur `origin`).
- Les serveurs de développement du desktop arrêtés : les ports 8788 (core), 8787 (Acedia) et 8789 (Avaritia) doivent
  être libres. L'installation refuse un port déjà écouté et n'arrête rien elle-même.
- Un dossier de service choisi, hors des dépôts de travail, par exemple `D:\lun-service`.

## 2. Installer

Dans un PowerShell **administrateur**, depuis `lun-anima\deploy\windows` d'une copie de travail :

```powershell
.\installer.ps1 -Service D:\lun-service -Travail "<dossier des dépôts>" -WhatIf
```

Le mode `-WhatIf` clone et construit pour de faux, et dit ce qu'il ferait : les clones, les `npm ci`, les builds et les
trois tâches (au démarrage, compte courant en S4U, sans limite de durée). Tant que les dépôts ne sont pas clonés, il
saute leurs `.env`.

1. Lancer une fois sans `-WhatIf` : il clone les trois dépôts, puis refuse faute de `.env`.
2. Poser un `.env` dans chacun des trois dépôts du service, depuis leur `.env.example`. Le `DB_PATH` reste dans le
   dossier de service (le défaut `data/...` convient) ; un `DB_PATH` qui en sort est refusé. Chez Acedia et Avaritia,
   un modèle sans prix y reçoit le sien (§ 11, « Un modèle sans prix »).
3. Choisir les bases (§ 3), puis relancer : les builds, puis les tâches `Lun core`, `Lun Acedia`, `Lun Avaritia`, lancées
   aussitôt.

## 3. Les bases qui entrent en service

**Question ouverte, à trancher ce jour-là.** L'installation n'apporte aucune base.

- **Trois bases neuves** (le défaut) : le service démarre vide dans son dossier.
  - `anima.db` vide : la mémoire de la relation, le tempérament et le fil repartent de zéro ;
  - `acedia.db` vide : Acedia se resynchronise depuis Google, mais ses règles de tri et ses cartes repartent de zéro ;
  - `avaritia.db` vide : le wiki repart de zéro.
- **Des bases existantes copiées** (celles du laptop ou du desktop), avant le premier démarrage, serveurs arrêtés :
  - prendre une copie cohérente : soit une copie du jour, en un seul fichier (`backups/anima-AAAA-MM-JJ.db`,
    `acedia-…`, `avaritia-…`, à côté de chaque base), soit la base de son serveur arrêté, avec ses fichiers `-wal` et
    `-shm` s'il y en a ;
  - la copier au chemin du `DB_PATH` du service, ses fichiers `-wal` et `-shm` à côté, sous le même nom ;
  - une `anima.db` copiée exige le **même `ANIMA_SECRET_KEY`** dans le `.env` du service que là d'où elle vient, sinon
    les jetons des satellites et la clé du modèle ne se déchiffrent plus ; la clé qui va avec chaque base est au § 9,
    « Restaurer une copie ».

## 4. Relier les satellites

Depuis `D:\lun-service\lun-anima`, une fois les trois serveurs lancés :

```powershell
npm run connect -- http://localhost:8787
npm run connect -- http://127.0.0.1:8789
```

Chaque commande ouvre la page d'autorisation du satellite dans le navigateur. Avec une base Acedia neuve, refaire
ensuite la connexion Google dans Acedia (`http://localhost:8787`) : son adresse de retour reste valable, c'est le même
port.

## 5. Appairer Luxuria

1. **Construire et poser l'exe.** Dans `lun-luxuria` à jour sur `main` : `npm ci`, puis
   `npm run tauri build -- --no-bundle`. Copier `src-tauri\target\release\lun-luxuria.exe` dans un dossier qui ne
   bouge pas, par exemple `D:\lun-service\luxuria\`, et le lancer **depuis là**. « Démarrer avec Windows » retient le
   chemin de l'exe qui l'active : depuis `target\release`, une reconstruction ou un nettoyage du dépôt le casserait. Les
   réglages et l'appairage ne dépendent pas de cet emplacement. Mettre à jour : quitter Luxuria, reconstruire, recopier
   l'exe au même endroit.
2. **Appairer, par l'écran.** Dans l'app du core, Atelier > Appareils > « Ajouter un appareil » : un code à six
   chiffres, valable quelques minutes. Dans Luxuria : « Relié à un serveur », puis le code. L'adresse par défaut,
   `http://127.0.0.1:8788`, est celle du core sur ce poste. Recours en terminal, depuis `D:\lun-service\lun-anima` :
   `npm run pair-code`.
3. **Sa voix**, dans Réglages > Voix, par des champs nommés (aucune ligne d'arguments à écrire) :
   - « Lancer le service voix avec l'appli », et le dossier qui contient `service.py` ;
   - Transcription : « Locale » (un modèle chargé dans le service) ou « whisper-server » et son adresse ;
   - Sa voix : le chemin du fichier Piper `.onnx` ;
   - RVC, facultatif : son adresse et son gain.

   Une installation qui avait des lignes d'arguments les retrouve rangées dans ces champs.
4. **whisper-server et RVC**, deux programmes à part. Pour que l'appli les lance, dans la carte de chacun :
   - « Choisir… » ouvre la boîte de dialogue de Windows : y choisir son `.exe`. L'appli le garde de son côté,
     « Oublier » le retire ;
   - ses arguments, un par ligne, tels qu'on les taperait (modèle, port) ;
   - « Lancer … avec l'appli » pour qu'il parte au démarrage, ou « Lancer … » pour le lancer tout de suite.

   L'appli les lance avant le service voix, sans console, chacun dans son dossier, et ne lance rien si quelque chose
   répond déjà à son adresse. Elle les suit jusqu'à ce qu'ils répondent ; un programme qui s'arrête aussitôt est dit
   avec son journal. Elle les arrête en quittant, et Windows les arrête aussi si elle plante, avec ce qu'ils ont
   ouvert eux-mêmes : si RVC ouvre un navigateur au lancement, couper cette ouverture dans ses arguments, sinon ce
   navigateur se ferme avec Luxuria. Leurs sorties vont dans `whisper-server.log` et `rvc.log`, vidés à chaque
   lancement, près de `voix.log`, dans `%LOCALAPPDATA%\io.github.lun-ecosystem.luxuria\logs`. Sans programme choisi,
   on les lance soi-même avant Luxuria : l'appli vérifie seulement qu'ils répondent.
5. **Ce que dit l'écran.** Chaque brique dit son état (répond, en démarrage, absente) et quoi faire quand elle manque.
   « Lancer ou vérifier » montre qu'il travaille, puis donne son résultat. Un champ changé alors que le service tourne
   n'est pris qu'au prochain lancement : chaque carte dit ce qu'utilise le service en marche (« En marche : Locale »)
   et ce qui attend, et « Relancer le service » le relance aussitôt. Un service lancé à la main se relance à la main.
   La scène dit quand la voix ne répond pas, avec un lien vers ce thème.
6. Réglages > Fenêtre : « Démarrer avec Windows » si Luxuria doit s'ouvrir avec la session (après l'étape 1). L'icône
   près de l'horloge arrive sous la flèche ^ de la barre des tâches : la glisser sur la barre pour la garder visible.
   Pleine et colorée : présente ; pleine et grise : en sourdine ; creuse : injoignable.
7. Quitter : Réglages, « Quitter l'appli » (ou le menu de l'icône). La présence se termine d'abord ; le service voix,
   whisper-server et RVC lancés par l'appli s'arrêtent avec elle.

## 6. Le téléphone

Sur le desktop, `tailscale serve` publie chaque appli en HTTPS sur le tailnet, et nulle part ailleurs. Les serveurs
restent sur `127.0.0.1`. Le desktop n'a qu'un nom dans le tailnet : chaque appli prend son port HTTPS. Tailscale
n'accepte que 443, 8443 et 10000.

```powershell
tailscale serve status                       # Acedia garde l'adresse qu'elle a depuis le J1 (443)
tailscale serve --bg --https=8443 8788       # le core
tailscale serve --bg --https=10000 8789      # Avaritia, pour les liens « Voir la fiche »
tailscale serve status                       # les trois adresses https://<machine>.<tailnet>.ts.net[:port]
```

- Dans l'app du core, Atelier > Postes : régler l'**adresse de sa page** d'Acedia et d'Avaritia sur leur adresse
  HTTPS.
- Sur le téléphone : ouvrir l'adresse du core, installer l'app, activer les notifications.
- Une origine qui change plus tard (autre port, autre nom) oblige le téléphone à se **réabonner aux notifications** :
  les rouvrir dans l'app installée.

## 7. La nuit

La nuit tourne à 5 h. Pendant le rodage, le desktop reste allumé : mise en veille sur « Jamais » dans l'alimentation de
Windows, veille prolongée désactivée. En mise en veille, les trois serveurs s'arrêtent tous, le tri, les rappels et les
copies compris. Au réveil, chacun reprend, mais le rattrapage ne rejoue que la nuit (et la lettre du matin) : une nuit
manquée est jouée une fois, dans la minute qui suit le réveil ou le démarrage suivant (sauf `ROUTINES_CATCHUP=0` dans
le `.env` du core). Un rappel d'Acedia dû pendant la mise en veille ne part plus, passé un quart d'heure.

Les copies ne dépendent pas de la nuit : le core, Acedia et Avaritia copient chacun leur base, sans heure fixe, dès
qu'ils écoutent, puis chaque heure si la copie du jour manque. Un poste éteint la nuit se rattrape donc à son
démarrage, ou dans l'heure qui suit son réveil, et une pause n'arrête pas la copie.

## 8. Vérifier

- Les trois tâches : `Get-ScheduledTask 'Lun *' | Get-ScheduledTaskInfo` (dernier résultat `267009` : en cours, même
  quand le lanceur attend de relancer un serveur tombé, § 9).
- Les journaux du jour : `data\logs\<nom>-AAAA-MM-JJ.log` dans chaque dépôt du service. Un serveur qui s'arrête dit
  pourquoi dans ses premières lignes.
- Les copies : `backups\anima-AAAA-MM-JJ.db`, `backups\acedia-AAAA-MM-JJ.db` et `backups\avaritia-AAAA-MM-JJ.db`,
  chacune à côté de sa base, sept au plus. Chaque serveur le dit dans son journal du jour (« Base copiée », « Copie de
  la base ratée »). Une copie ratée arrive aussi au Journal de l'app, au nom de son poste, une fois par jour au plus,
  et au téléphone : celle d'un satellite, s'il est relié au core.
- Pendant le rodage, aucune copie ne quitte le desktop : un disque perdu emporte la base et ses copies, qui ne sont pas
  chiffrées. Pour en garder une ailleurs, le NAS tire lui-même les dossiers `backups\` : un réglage du NAS, sans code,
  qui dit lui-même ses échecs.
- Un serveur arrêté sur une erreur laisse l'erreur et sa pile à son journal du jour, juste avant la ligne du lanceur.
  Celui du core le dit aussi au Journal et au téléphone (« Le core s'est arrêté sur une erreur »), une fois par jour au
  plus. Celui d'un satellite ne se lit qu'à son journal du jour, et au core s'il reste injoignable 15 min (« … ne
  répond plus depuis plus de 15 minutes », au Journal et au téléphone). Un lot d'Avaritia en échec se voit à
  l'activité récente de son tableau de bord (« Lot en échec »), et nulle part ailleurs.
- La Constellation : le core, Acedia et Avaritia joignables, Luxuria présente.
- Un redémarrage de Windows, sans rien taper : tout revient, sans fenêtre de console.

## 9. Arrêter, mettre à jour, retirer

- **Arrêter un serveur** : `Stop-ScheduledTask 'Lun core'` (puis `Start-ScheduledTask` pour le relancer). La tâche
  arrêtée, rien ne relance le serveur.
- **Le lanceur ne lâche pas** un serveur tombé en erreur, le core comme Acedia et Avaritia : il le relance trois fois à
  60 s d'écart, puis une fois toutes les 15 min, sans fin. Un serveur qui a tourné plus de 10 min avant de tomber
  retrouve ses trois relances rapides. Chaque chute et chaque relance, avec son délai, ont leur ligne au journal du
  jour (§ 8). Dans le Planificateur, la tâche reste « en cours » tant que le lanceur tourne, même pendant qu'il
  attend : le journal du jour et la Constellation disent si le serveur répond.
- **Mettre à jour** : `.\mettre-a-jour.ps1 -Service D:\lun-service` (`-WhatIf` d'abord). Il refuse une copie hors de
  `main` ou modifiée à la main ; sinon, dépôt par dépôt : arrêt, `git pull --ff-only`, `npm ci`, build, relance.
  L'arrêt prend la tâche avec son lanceur, même pendant une attente : la tâche repart sur le serveur mis à jour.
- **Retirer** : `.\retirer.ps1 -Service D:\lun-service`. Les tâches et les serveurs partent, le dossier et les bases
  restent.

### Restaurer une copie

Une copie remet une base au jour où elle a été faite : tout ce qui a été écrit depuis en est absent, y compris les
appareils reliés, les liaisons et les abonnements aux notifications pris entre-temps. Pour une base, dans un PowerShell
administrateur. Les commandes sont celles d'Acedia ; pour le core ou Avaritia, remplacer `lun-acedia`, `acedia`,
`'Lun Acedia'` et 8787 par `lun-anima`, `anima`, `'Lun core'` et 8788, ou par `lun-avaritia`, `avaritia`,
`'Lun Avaritia'` et 8789.

1. Arrêter son serveur, puis vérifier que son port n'écoute plus :

   ```powershell
   Stop-ScheduledTask 'Lun Acedia'
   Get-NetTCPConnection -LocalPort 8787 -State Listen -ErrorAction Ignore
   ```

   La seconde commande ne doit rien rendre. Si elle rend une ligne, le serveur a survécu à sa tâche :
   `Stop-Process -Id (Get-NetTCPConnection -LocalPort 8787 -State Listen).OwningProcess`, puis vérifier de nouveau.
2. Mettre la base de côté avec ses fichiers `-wal` et `-shm`, dans un dossier daté créé d'abord. Rien ne se supprime :
   le `-wal` peut garder ses dernières heures, et, laissé à côté de la copie, SQLite le rejouerait sur elle sans rien
   dire.

   ```powershell
   cd D:\lun-service\lun-acedia\data
   $cote = "avant-restauration-$(Get-Date -Format 'yyyy-MM-dd-HHmm')"
   New-Item -ItemType Directory $cote
   Get-ChildItem acedia.db* | Move-Item -Destination $cote
   Get-ChildItem acedia.db*
   ```

   La dernière commande ne doit rien rendre : si elle rend un fichier, s'arrêter là.
3. Copier, et non déplacer, la copie choisie, puis relancer :

   ```powershell
   Copy-Item backups\acedia-AAAA-MM-JJ.db acedia.db
   Start-ScheduledTask 'Lun Acedia'
   ```

4. Pour Acedia ou Avaritia, le relier de nouveau au core, même s'il paraît relié. La base restaurée reprend la
   numérotation de ses événements au jour de la copie, alors que le core ne demande que ceux qui suivent le dernier
   reçu : sans une nouvelle liaison, qui remet ce compte à zéro, urgences, alertes et entrées du Journal n'arrivent
   plus, sans aucune erreur. Les cartes, relues toutes les deux minutes, arrivent encore : elles ne prouvent pas la
   liaison. Dans le core, Ctrl K, « Relier un poste » (l'Atelier ne propose pas « Relier » à un poste qui paraît
   relié, lun-anima#90) : son adresse locale, `http://localhost:8787` pour Acedia ou `http://127.0.0.1:8789` pour
   Avaritia, puis le code que donne le satellite, dans Réglages › Appareils et applications › Relier un appareil, ou
   par `npm run pair-code` dans son dossier de service si plus aucun appareil n'y est relié. La commande du § 4,
   `npm run connect`, fait la même chose depuis le terminal.
5. Vérifier : pour un satellite, un événement qu'il émet après la liaison arrive au Journal du core, comme le prochain
   courrier trié par Acedia ; l'entrée « … relié. », que le core écrit lui-même, ne le prouve pas. Pour le core, ses
   postes restent joignables à la Constellation. Ce qui a été relié après la copie se relie de nouveau : un appareil
   (Atelier › Appareils pour le core, Réglages › Appareils et applications pour un satellite), un poste (comme à
   l'étape 4). Le téléphone rouvre ses notifications s'il s'y était abonné depuis.

Revenir en arrière : arrêter le serveur comme à l'étape 1, puis mettre de côté la base restaurée dans un second
dossier daté :

```powershell
cd D:\lun-service\lun-acedia\data
$restauree = "restauree-$(Get-Date -Format 'yyyy-MM-dd-HHmm')"
New-Item -ItemType Directory $restauree
Get-ChildItem acedia.db* | Move-Item -Destination $restauree
Get-ChildItem acedia.db*
```

La dernière commande ne doit rien rendre. Puis remettre les fichiers de l'étape 2 à leur place, et relancer :

```powershell
Get-ChildItem avant-restauration-AAAA-MM-JJ-HHMM\acedia.db* | Move-Item -Destination .
Start-ScheduledTask 'Lun Acedia'
```

Un satellite remis ainsi se relie de nouveau, comme à l'étape 4 : le core ne garde que le jeton reçu de la base
restaurée, que la base d'origine ne connaît pas.

Une copie s'ouvre sans clé : seuls ses secrets demandent la clé de sa base d'origine. Garder aussi une copie de chaque
clé hors du dossier de service, par exemple dans un gestionnaire de mots de passe : le `.env` qui la porte est à côté
des copies.

| Base | Clé | Ce qu'elle protège | Avec une autre clé |
|---|---|---|---|
| `anima.db` | `ANIMA_SECRET_KEY` | la clé du modèle, les jetons des satellites, la clé des notifications | à éviter : la clé du modèle se ressaisit et les postes se relient de nouveau, mais les notifications ne partent plus, et aucun écran ne les refait. Garder la même clé. |
| `acedia.db` | `ACEDIA_SECRET_KEY` | les jetons Google, les clés d'IA saisies dans Réglages | à éviter : les clés d'IA se ressaisissent, mais l'écran du compte Google reste sur « Vérification… », sans proposer de connecter (lun-acedia#62). Garder la même clé. |
| `avaritia.db` | `AVARITIA_SECRET_KEY` | les clés d'IA saisies dans Réglages | ressaisir les clés |

Les jetons des appareils sont hachés, pas chiffrés : ils ne dépendent d'aucune clé.

## 10. Ce qui reste à la main

- Les notifications de Windows, si elles sont coupées (`ToastEnabled = 0` dans le registre de l'utilisateur).
- Le pare-feu du service de conversion de voix, s'il écoute au-delà de la boucle locale.
- Le `tailscale serve` de chaque appli (§ 6), qui survit aux redémarrages une fois posé avec `--bg`.

## 11. Rien ne force le terminal pendant la semaine

Le terminal sert à l'installation, à la restauration et aux correctifs voulus. Pendant la semaine de rodage, chaque cas
qui pourrait le redemander a sa réponse sans terminal, en place ou à mettre avant :

| Cas | Réponse | État |
|---|---|---|
| Le jeton Google en « Test », qui tombe au bout de 7 jours | Google en Production, consentement refait sur le vrai compte | à mettre : B10, sur le desktop |
| Un redémarrage ou une mise à jour de Windows | Les trois tâches planifiées relancent les serveurs au démarrage, sans fenêtre | en place (§ 2), à constater : B12 |
| Un serveur qui retombe après ses trois relances | Le lanceur le relance toutes les 15 min, sans fin (§ 9) : le journal du jour dit pourquoi il tombe, et le core prévient d'un satellite injoignable 15 min (§ 8) | en place |
| Un nouveau téléphone | Le relier depuis un appareil déjà relié : Atelier › Appareils pour le core, Réglages › Appareils et applications pour un satellite | en place |
| Un code d'appairage expiré | Un nouveau code depuis l'écran du poste, qui affiche le temps restant | en place |
| Un navigateur qui perd son jeton | Un autre appareil relié lui donne un code ; sans lui, seul `npm run pair-code` en donne un | à mettre : garder le téléphone relié à chaque app |
| La clé d'un fournisseur qui arrive à échéance | Son échéance, déclarée dans l'écran, prévient à J-14 puis J-3 ; la clé se remplace depuis le même écran | à mettre : déclarer l'échéance de chaque clé, aucune base neuve n'en a |
| Un modèle sans prix chez Acedia ou Avaritia (Mistral Small et Medium n'en ont pas) | Son coût est compté 0 : les dépenses le taisent, et aucun plafond ne le retient. Choisir un modèle qui a un prix, ou mettre le sien dans le `.env` du service, `LLM_PRICES={"mistral/mistral-small-latest":[entrée, sortie]}`, en dollars par million de jetons, puis relancer sa tâche | à mettre : un prix pour chaque modèle utilisé, avant le rodage |
| Chez Acedia, un refus de l'IA qui vaut pour tous les mails, un mauvais réglage du modèle par exemple (une erreur 4xx autre qu'une clé refusée, un crédit épuisé, 408 ou 429) | Voulu : chaque passe du tri s'arrête au premier mail, et toutes les trois passes un mail sort de la file, à trier à la main, avec sa ligne au journal du jour. Corriger le réglage dans Réglages ; les mails déjà sortis restent à trier à la main | en place |
| Chez Avaritia, un lot retenu après un tri déjà payé, sa rédaction en échec | Voulu, pour ne pas repayer le tri chaque heure : il ne repart qu'au bout d'un jour, vers +25 h, même si la clé a été corrigée entre-temps. Aucune relance d'un lot à la main n'existe. Les autres lots retenus repartent dans l'heure où leur fournisseur revient ou leur plafond se lève | en place |
| Un correctif à passer en cours de semaine | `mettre-a-jour.ps1`, dans un PowerShell administrateur (§ 9) | terminal, pour un correctif voulu seulement |
| Un correctif de Luxuria | Quitter Luxuria, reconstruire, recopier l'exe au même endroit (§ 5, étape 1) : `mettre-a-jour.ps1` ne le fait pas | terminal, pour un correctif voulu seulement |
