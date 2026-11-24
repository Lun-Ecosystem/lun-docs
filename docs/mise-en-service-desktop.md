# Mettre le desktop en service

> **Depuis le 20/11, ce n'est plus la mise en service de l'écosystème** ([ADR 0014](../adr/0014-mvp-sur-le-nas.md)) :
> le core, Acedia et Avaritia tournent sur le NAS, dont la page viendra avec son chantier. Cette page reste le mode
> d'emploi d'une recette en local sur le desktop, et celui de Lun'Luxuria (§ 5), qui y vit.

Ce que CrOliX voit et fait, dans l'ordre, le jour où le core, Acedia et Avaritia passent sur le desktop pour de bon :
lancés au démarrage de Windows sans fenêtre, joints par le téléphone en HTTPS, chaque base copiée une fois par jour.
Spec : [`specs/2026-11-07-poste-autonome-design.md`](specs/2026-11-07-poste-autonome-design.md).

**Le détail du déploiement est dans le dépôt du core, [lun-anima](https://github.com/Lun-Ecosystem/lun-anima)
(privé)**, page « Mettre le desktop en service » : l'installation et ses scripts, les commandes, les chemins, sa base
et sa restauration. Cette page n'en garde que ce qui se voit.

Tout ce qui touche au système (tâches planifiées, pare-feu, Tailscale, registre) se fait à la main, dans l'ordre
ci-dessous. Aucune adresse du tailnet ni aucun nom de machine n'entre dans un dépôt : ils restent dans les `.env` et
dans l'app.

## 1. Avant

- Node 24, `uv` et Git installés sur le desktop.
- Tailscale installé et connecté sur le desktop et sur le téléphone, HTTPS activé pour le tailnet.
- Les dépôts de travail à jour sur `main`.
- Les serveurs de développement du desktop arrêtés : les ports 8788 (core), 8787 (Acedia) et 8789 (Avaritia) doivent
  être libres. L'installation refuse un port déjà écouté et n'arrête rien elle-même.
- Un dossier de service choisi, hors des dépôts de travail : le core, Acedia et Avaritia y tournent depuis leurs
  propres clones, jamais depuis le dossier de travail.

## 2. Installer

L'installation se lance dans un PowerShell **administrateur** et dit d'abord ce qu'elle ferait, sans rien faire. Elle
crée une tâche planifiée par serveur, `Lun core`, `Lun Acedia` et `Lun Avaritia` : lancées au démarrage de Windows,
sans fenêtre, sans mot de passe gardé. Son mode d'emploi est dans le dépôt du core.

1. La lancer pour de bon une première fois : elle clone les trois dépôts dans le dossier de service, puis s'arrête
   faute de `.env`.
2. Poser un `.env` dans chacun des trois dépôts du service, depuis leur `.env.example`. Chaque base reste dans le
   dossier de service : une base ailleurs est refusée. Chez Acedia et Avaritia, un modèle sans prix y reçoit le sien
   (§ 11, « Un modèle sans prix »).
3. Choisir les bases (§ 3), puis relancer l'installation : elle construit, crée les trois tâches et les lance
   aussitôt. Elle finit sur les trois pages à ouvrir sur cette machine, dans l'ordre : l'app du core, Acedia,
   Avaritia (« Le premier appareil », avant le § 4).

## 3. Les bases qui entrent en service

**Question ouverte, à trancher ce jour-là.** L'installation n'apporte aucune base.

- **Trois bases neuves** (le défaut) : le service démarre vide dans son dossier.
  - celle du core : les souvenirs de Natsume, son tempérament et le fil repartent de zéro ;
  - `acedia.db` : Acedia se resynchronise depuis Google, mais ses règles de tri et ses cartes repartent de zéro ;
  - `avaritia.db` : la bibliothèque repart de zéro.
- **Des bases existantes copiées** (celles du laptop ou du desktop), avant le premier démarrage, serveurs arrêtés :
  - prendre une copie cohérente : soit une copie du jour, en un seul fichier (`backups/acedia-AAAA-MM-JJ.db`,
    `avaritia-…`, à côté de chaque base), soit la base de son serveur arrêté, avec ses fichiers `-wal` et `-shm` s'il
    y en a ;
  - la copier au chemin de la base du service, ses fichiers `-wal` et `-shm` à côté, sous le même nom ;
  - une base copiée exige la **même clé** dans le `.env` du service que là d'où elle vient, sinon ses secrets ne se
    déchiffrent plus : la clé qui va avec chaque base est au § 9, « Restaurer une copie ». Celle du core : dans son
    dépôt.

## Le premier appareil

Sur une installation neuve, le premier appareil de chaque app s'appaire par sa page, sans terminal. Sur le desktop,
les trois serveurs lancés, dans une fenêtre privée : un onglet habituel sur ces adresses garde le jeton d'une autre
base, que l'app oublie au premier refus. Garder cette fenêtre ouverte jusqu'au bout du § 6 : fermée, elle perd ses
jetons, et une page dont un appareil est déjà appairé ne montre plus de code.

1. L'app du core (`http://127.0.0.1:8788`) : la page « Ce navigateur n'est pas encore reconnu » montre le code du
   premier appareil, déjà saisi, et l'heure où il expire. « Entrer » : la mise en route suit, la clé du modèle et les
   plafonds par leurs écrans.
2. Acedia (`http://localhost:8787`), puis Avaritia (`http://127.0.0.1:8789`) : leur page « Relier ce navigateur »
   montre de même le code de leur premier appareil, déjà saisi. « Relier ».
3. Un code refusé, expiré (10 min) ou annulé par 5 codes faux en 10 min : « Nouveau code », sur la même page, en remet
   un dans le champ.

La page ne montre un code que sur cette machine, à cette adresse exacte (ni par le tailnet, ni, pour le core, à
`localhost`), et tant qu'aucun appareil n'est appairé. Ensuite, un appareil appairé en donne un (§ 11, « Un navigateur
qui perd son jeton »).

## 4. Relier Acedia et Avaritia

Une fois le premier appareil de chaque app appairé, pour Acedia puis pour Avaritia :

1. Dans le satellite, Réglages › Appareils et applications › « Relier un appareil » : un code à six chiffres, valable
   10 minutes, dont il affiche le temps restant.
2. Dans l'app du core, Atelier › Postes, sur la carte du satellite (« Pas encore relié. ») : « Relier ». Saisir
   l'« Adresse du poste », `http://localhost:8787` pour Acedia, `http://127.0.0.1:8789` pour Avaritia, puis le code
   affiché par le satellite, et « Relier ».
3. Avec une base Acedia neuve, refaire ensuite la connexion Google dans Acedia (`http://localhost:8787`) : son adresse
   de retour reste valable, c'est le même port.

Le recours en terminal du core est dans son dépôt.

## 5. Appairer Luxuria

1. **Construire et poser l'exe.** Dans `lun-luxuria` à jour sur `main` : `npm ci`, puis
   `npm run tauri build -- --no-bundle`. Copier `src-tauri\target\release\lun-luxuria.exe` dans un dossier qui ne
   bouge pas, par exemple un dossier `luxuria` du dossier de service, et le lancer **depuis là**. « Démarrer avec
   Windows » retient le chemin de l'exe qui l'active : depuis `target\release`, une reconstruction ou un nettoyage du
   dépôt le casserait. Les réglages et l'appairage ne dépendent pas de cet emplacement. Mettre à jour : quitter
   Luxuria, reconstruire, recopier l'exe au même endroit.
2. **Appairer, par l'écran.** Dans l'app du core, Atelier > Appareils > « Ajouter un appareil » : un code à six
   chiffres, valable quelques minutes. Dans Luxuria : « Relié à un serveur », puis le code. L'adresse par défaut,
   `http://127.0.0.1:8788`, est celle du core sur ce poste.
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
restent sur la boucle locale. Le desktop n'a qu'un nom dans le tailnet : chaque appli prend son port HTTPS, parmi les
trois que Tailscale accepte : Acedia sur 443, le core sur 8443, Avaritia sur 10000.

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

## 7. La nuit, la mise en veille et les copies

La nuit tourne à 5 h. Pendant le rodage, le desktop reste allumé : mise en veille sur « Jamais » dans l'alimentation de
Windows, veille prolongée désactivée. En mise en veille, les trois serveurs s'arrêtent tous, le tri, les rappels et les
copies compris. Au réveil, chacun reprend où il en était : le tri reprend sa file, les copies se rattrapent dans
l'heure, les lots d'Avaritia repartent, et une nuit manquée, comme la lettre du matin, est jouée une fois dans la minute
qui suit. Seuls se perdent les rappels d'Acedia dus depuis plus d'un quart d'heure. Après un démarrage, la nuit manquée
est jouée de même ; le réglage qui saute plutôt les créneaux déjà dus est dans le dépôt du core.

Les copies ne dépendent pas de la nuit : le core, Acedia et Avaritia copient chacun leur base, sans heure fixe, dès
qu'ils écoutent, puis chaque heure si la copie du jour manque. Le desktop éteint la nuit se rattrape donc à son
démarrage, ou dans l'heure qui suit son réveil, et une pause n'arrête pas la copie.

## 8. Vérifier, et voir qu'un service est tombé

- Les trois tâches, dans le Planificateur de tâches de Windows : chacune reste « En cours d'exécution » tant que son
  serveur est suivi, même pendant l'attente d'une relance (§ 9). Elle ne dit donc pas si le serveur répond : le
  journal du jour et la Constellation le disent.
- Le journal du jour de chaque serveur, dans le dossier de service (où le trouver : dépôt du core). Un serveur qui
  s'arrête dit pourquoi dans ses premières lignes.
- Les copies : `backups\acedia-AAAA-MM-JJ.db` et `backups\avaritia-AAAA-MM-JJ.db`, chacune à côté de sa base, sept au
  plus, et celles du core de même à côté de la sienne. Chaque serveur le dit dans son journal du jour (« Base
  copiée », « Copie de la base ratée »). Une copie ratée arrive aussi au Journal de l'app, au nom de son poste, une
  fois par jour au plus, et au téléphone : celle d'un satellite, s'il est relié au core.
- Pendant le rodage, aucune copie ne quitte le desktop : un disque perdu emporte la base et ses copies, qui ne sont pas
  chiffrées. Pour en garder une ailleurs, le NAS tire lui-même les dossiers `backups\`, par un partage Windows de
  chacun : un réglage du NAS, sans code, qui dit lui-même ses échecs. Il ne prend que les fichiers
  `<nom>-AAAA-MM-JJ.db` : chaque copie s'écrit d'abord dans un `.<nom>-copie.tmp` du même dossier, qu'il emporterait à
  moitié écrit.
- Un serveur arrêté sur une erreur laisse l'erreur et sa pile à son journal du jour. Celui du core le dit aussi au
  Journal, et au téléphone une fois le core relancé (« Le core s'est arrêté sur une erreur »), une fois par jour au
  plus : un core qui tombe à chaque démarrage n'envoie rien au téléphone. Celui d'un satellite ne se lit qu'à son
  journal du jour, et au core s'il reste injoignable 15 min (« … ne répond plus depuis plus de 15 minutes », au Journal
  et au téléphone). Un lot d'Avaritia en échec se voit à l'activité récente de son tableau de bord (« Lot en échec »),
  et nulle part ailleurs.
- La Constellation : le core, Acedia et Avaritia joignables, Luxuria présente.
- Un redémarrage de Windows, sans rien taper : tout revient, sans fenêtre de console.

## 9. Arrêter, mettre à jour, retirer

- **Arrêter un serveur** : arrêter sa tâche dans le Planificateur de tâches, la relancer de même. La tâche arrêtée,
  rien ne relance le serveur jusqu'au prochain démarrage de Windows, où la tâche repart d'elle-même.
- **Un serveur tombé en erreur est relancé de lui-même**, le core comme Acedia et Avaritia, sans fin : chaque chute et
  chaque relance, avec son délai, ont leur ligne au journal du jour (§ 8). Le rythme des relances est dans le dépôt
  du core.
- **Mettre à jour** et **retirer** : dans un PowerShell administrateur, comme le dit le dépôt du core. La mise à jour
  refuse une copie hors de `main` ou modifiée à la main, puis passe dépôt par dépôt et relance chaque serveur. Le
  retrait enlève les tâches et arrête les serveurs ; le dossier et les bases restent.

### Restaurer une copie

Une copie remet une base au jour où elle a été faite : tout ce qui a été écrit depuis en est absent, y compris les
appareils appairés et les liaisons pris entre-temps. Ce qui suit vaut pour Acedia et Avaritia, dans un PowerShell
administrateur ; restaurer la base du core : dans son dépôt. Les commandes sont celles d'Acedia ; pour Avaritia,
remplacer `lun-acedia`, `acedia`, `'Lun Acedia'` et 8787 par `lun-avaritia`, `avaritia`, `'Lun Avaritia'` et 8789.

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
   cd "<dossier de service>\lun-acedia\data"
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

4. Le relier de nouveau au core, même s'il paraît relié. La base restaurée reprend la numérotation de ses événements au
   jour de la copie, alors que le core ne demande que ceux qui suivent le dernier reçu : sans une nouvelle liaison, qui
   remet ce compte à zéro, urgences, alertes et entrées du Journal n'arrivent plus, sans aucune erreur. Les cartes,
   relues toutes les deux minutes, arrivent encore : elles ne prouvent pas la liaison. Dans le core, Ctrl K, « Relier
   un poste » (l'Atelier ne propose pas « Relier » à un poste qui paraît relié, lun-anima#90) : son adresse locale,
   `http://localhost:8787` pour Acedia ou `http://127.0.0.1:8789` pour Avaritia, puis le code que donne le satellite,
   dans Réglages › Appareils et applications › Relier un appareil, ou par `npm run pair-code` dans son dossier de
   service si plus aucun appareil n'y est appairé.
5. Vérifier : un événement que le satellite émet après la liaison arrive au Journal du core, comme le prochain courrier
   trié par Acedia ; l'entrée « … relié. », que le core écrit lui-même, ne le prouve pas. Ce qui a été appairé après
   la copie s'appaire de nouveau, dans Réglages › Appareils et applications du satellite.

Revenir en arrière : arrêter le serveur comme à l'étape 1, puis mettre de côté la base restaurée dans un second
dossier daté :

```powershell
cd "<dossier de service>\lun-acedia\data"
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

- **`acedia.db`**, clé `ACEDIA_SECRET_KEY` : elle protège les jetons Google et les clés d'IA saisies dans Réglages.
  Avec une autre clé, à éviter : les clés d'IA se ressaisissent, et la carte Compte Google dit que le compte
  enregistré ne se lit pas (« Compte illisible », « Non connecté »). Remettre l'ancienne clé dans `.env` et relancer,
  ou reconnecter le compte. Garder la même clé.
- **`avaritia.db`**, clé `AVARITIA_SECRET_KEY` : elle protège les clés d'IA saisies dans Réglages. Avec une autre clé,
  ressaisir les clés.
- **La base du core** : sa clé et ce qu'elle protège sont dans son dépôt. Garder la même clé.

Les jetons des appareils sont hachés, pas chiffrés : ils ne dépendent d'aucune clé.

## 10. Ce qui reste à la main

- Les notifications de Windows, si elles sont coupées (`ToastEnabled = 0` dans le registre de l'utilisateur).
- Le pare-feu du service de conversion de voix, s'il écoute au-delà de la boucle locale.
- Le `tailscale serve` de chaque appli (§ 6), qui survit aux redémarrages une fois posé avec `--bg`.
- Le partage Windows des dossiers `backups\`, si le NAS tire les copies (§ 8).

## 11. Rien ne force le terminal pendant la semaine

Le terminal sert à l'installation, à la restauration et aux correctifs voulus. Pendant la semaine de rodage, chaque cas
qui pourrait le redemander a sa réponse sans terminal, en place ou à mettre avant :

- **Le jeton Google en « Test », qui tombe au bout de 7 jours** : Google en Production, consentement refait sur le vrai
  compte. *À mettre : B10, sur le desktop.*
- **Un redémarrage ou une mise à jour de Windows** : les trois tâches planifiées relancent les serveurs au démarrage,
  sans fenêtre. *En place (§ 2), à constater : B12.*
- **Un serveur qui retombe** : il est relancé sans fin (§ 9) ; le journal du jour dit pourquoi il tombe, et le core
  prévient d'un satellite injoignable 15 min (§ 8). *En place.*
- **Un nouveau téléphone** : l'appairer depuis un appareil déjà appairé, Atelier › Appareils pour le core, Réglages ›
  Appareils et applications pour un satellite. *En place.*
- **Un code d'appairage expiré** : un nouveau code depuis l'écran du poste, qui affiche le temps restant. *En place.*
- **Un navigateur qui perd son jeton** : un autre appareil appairé lui donne un code ; sans lui, seul le terminal en
  donne un (`npm run pair-code` dans le dossier d'un satellite ; pour le core, son dépôt). *À mettre : garder le
  téléphone appairé à chaque app.*
- **La clé d'un fournisseur qui arrive à échéance** : son échéance, déclarée dans l'écran, prévient à J-14 puis J-3 ;
  la clé se remplace depuis le même écran. *À mettre : déclarer l'échéance de chaque clé, aucune base neuve n'en a.*
- **Un modèle sans prix chez Acedia ou Avaritia** (Mistral Small et Medium n'en ont pas) : son coût est compté 0, les
  dépenses le taisent et aucun plafond ne le retient. Choisir un modèle qui a un prix, ou mettre le sien dans le `.env`
  du service, `LLM_PRICES={"mistral/mistral-small-latest":[entrée, sortie]}`, en dollars par million de jetons, puis
  relancer sa tâche. *À mettre : un prix pour chaque modèle utilisé, avant le rodage.*
- **Chez Acedia, un refus de l'IA qui vaut pour tous les mails**, un mauvais réglage du modèle par exemple (une erreur
  4xx autre qu'une clé refusée, un crédit épuisé, 408 ou 429) : voulu. Chaque passe du tri s'arrête au premier mail qui
  demande l'IA (les règles passent avant elle), et toutes les trois passes un mail sort de la file, à trier à la main,
  avec sa ligne au journal du jour. Corriger le réglage dans Réglages ; les mails déjà sortis restent à trier à la
  main. *En place.*
- **Chez Avaritia, un lot retenu après un tri déjà payé, sa rédaction en échec** : voulu, pour ne pas repayer le tri
  chaque heure. Il ne repart qu'au bout d'un jour, vers +25 h, même si la clé a été corrigée entre-temps. Aucune
  relance d'un lot à la main n'existe. Les autres lots retenus repartent dans l'heure où leur fournisseur revient ou
  leur plafond se lève. *En place.*
- **Un correctif à passer en cours de semaine** : la mise à jour du service, dans un PowerShell administrateur (§ 9).
  *Terminal, pour un correctif voulu seulement.*
- **Un correctif de Luxuria** : quitter Luxuria, reconstruire, recopier l'exe au même endroit (§ 5, étape 1) ; la mise
  à jour du service ne le fait pas. *Terminal, pour un correctif voulu seulement.*
