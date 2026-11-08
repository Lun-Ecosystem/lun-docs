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
   dossier de service (le défaut `data/...` convient) ; un `DB_PATH` qui en sort est refusé.
3. Choisir les bases (§ 3), puis relancer : les builds, puis les tâches `Lun core`, `Lun Acedia`, `Lun Avaritia`, lancées
   aussitôt.

## 3. Les bases qui entrent en service

**Question ouverte, à trancher ce jour-là.** Rien ne copie de base tout seul.

- **Trois bases neuves** (le défaut) : le service démarre vide dans son dossier.
  - `anima.db` vide : la mémoire de la relation, le tempérament et le fil repartent de zéro ;
  - `acedia.db` vide : Acedia se resynchronise depuis Google, mais ses règles de tri et ses cartes repartent de zéro ;
  - `avaritia.db` vide : le wiki repart de zéro.
- **Des bases existantes copiées** (celles du laptop ou du desktop), avant le premier démarrage, serveurs arrêtés :
  - prendre une copie cohérente, en un seul fichier : une copie du jour (`backups/anima-AAAA-MM-JJ.db`, `acedia-…`,
    `avaritia-…`, à côté de chaque base), ou la base de son serveur arrêté, avec ses fichiers `-wal` et `-shm` s'il y en
    a ;
  - la poser au chemin du `DB_PATH` du service ;
  - une `anima.db` copiée exige le **même `ANIMA_SECRET_KEY`** dans le `.env` du service que là d'où elle vient, sinon
    les jetons des satellites et la clé du modèle ne se déchiffrent plus ; la clé qui va avec chaque base est au § 9,
    « Restaurer une copie ».

## 4. Relier les satellites

Depuis `D:\lun-service\lun-anima`, une fois les trois serveurs lancés :

```powershell
npm run connect -- http://localhost:8787
npm run connect -- http://localhost:8789
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

La veille de nuit et la copie de la base du core tournent à 5 h. Laisser le PC allumé (veille prolongée désactivée), ou
compter sur le rattrapage : une nuit manquée est jouée une fois, une minute après le démarrage suivant (sauf
`ROUTINES_CATCHUP=0` dans le `.env` du core). Une veille sautée pendant une pause ne copie pas la base du core
(lun-anima#86).

Acedia et Avaritia copient leur base eux-mêmes, sans heure fixe : dès qu'ils écoutent, puis chaque heure si la copie du
jour manque. Un poste éteint la nuit se rattrape donc à son démarrage.

## 8. Vérifier

- Les trois tâches : `Get-ScheduledTask 'Lun *' | Get-ScheduledTaskInfo` (dernier résultat `267009` : en cours).
- Les journaux du jour : `data\logs\<nom>-AAAA-MM-JJ.log` dans chaque dépôt du service. Un serveur qui s'arrête dit
  pourquoi dans ses premières lignes.
- Les copies : `backups\anima-AAAA-MM-JJ.db`, `backups\acedia-AAAA-MM-JJ.db` et `backups\avaritia-AAAA-MM-JJ.db`,
  chacune à côté de sa base, sept au plus. Celle du core dit « Base copiée » au Journal, et un échec se lit dans sa
  santé. Celles d'Acedia et d'Avaritia ne le disent que dans le journal de leur serveur (« Base copiée », « Copie de
  la base ratée ») : c'est ici qu'on les voit (lun-docs#110).
- La Constellation : le core, Acedia et Avaritia joignables, Luxuria présente.
- Un redémarrage de Windows, sans rien taper : tout revient, sans fenêtre de console.

## 9. Arrêter, mettre à jour, retirer

- **Arrêter un serveur** : `Stop-ScheduledTask 'Lun core'` (puis `Start-ScheduledTask` pour le relancer). Le lanceur
  relance seul un serveur tombé en erreur, trois fois, puis le laisse arrêté ; la Constellation le montre.
- **Mettre à jour** : `.\mettre-a-jour.ps1 -Service D:\lun-service` (`-WhatIf` d'abord). Il refuse une copie hors de
  `main` ou modifiée à la main ; sinon, dépôt par dépôt : arrêt, `git pull --ff-only`, `npm ci`, build, relance.
- **Retirer** : `.\retirer.ps1 -Service D:\lun-service`. Les tâches et les serveurs partent, le dossier et les bases
  restent.

### Restaurer une copie

Une copie remet une base au jour où elle a été faite : tout ce qui a été écrit depuis est perdu, y compris les appareils
reliés, les liaisons et les abonnements aux notifications pris entre-temps. Pour une base, dans un PowerShell :

1. Arrêter son serveur : `Stop-ScheduledTask 'Lun Acedia'` (ou `'Lun core'`, `'Lun Avaritia'`).
2. Dans le dossier de sa base (`data\` par défaut), mettre la base de côté sous un autre nom, poser la copie choisie à
   sa place sous le nom de la base (`acedia.db`), et supprimer `acedia.db-wal` et `acedia.db-shm` s'ils restent.
3. Relancer : `Start-ScheduledTask 'Lun Acedia'`.
4. Pour Acedia ou Avaritia, le relier de nouveau depuis le core (Atelier › Postes › Relier). La base restaurée reprend
   la numérotation de ses événements au jour de la copie, alors que le core ne demande que ceux qui suivent le dernier
   reçu : sans une nouvelle liaison, qui remet ce compte à zéro, urgences et cartes n'arrivent plus, sans aucune erreur.
   Le code se demande dans le satellite (Réglages › Appareils et applications › Relier un appareil), ou par
   `npm run pair-code` dans son dossier de service si plus aucun appareil n'y est relié.
5. Vérifier : pour un satellite, un événement neuf arrive au Journal du core ; pour le core, ses postes restent
   joignables à la Constellation. Ce qui a été relié après la copie se relie de nouveau : un appareil (Atelier ›
   Appareils pour le core, Réglages › Appareils et applications pour un satellite), un poste (Atelier › Postes). Le
   téléphone rouvre ses notifications s'il s'y était abonné depuis.

Une copie s'ouvre sans clé : seuls ses secrets demandent la clé de sa base d'origine, à garder à part des copies.

| Base | Clé | Ce qu'elle protège | Avec une autre clé |
|---|---|---|---|
| `anima.db` | `ANIMA_SECRET_KEY` | la clé du modèle, les jetons des satellites, la clé des notifications | à éviter : la clé du modèle se ressaisit et les postes se relient de nouveau, mais les notifications ne partent plus, et aucun écran ne les refait. Garder la même clé. |
| `acedia.db` | `ACEDIA_SECRET_KEY` | les jetons Google, les clés d'IA saisies dans Réglages | reconnecter Google, ressaisir les clés |
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
| Un serveur tombé trois fois de suite | Le lanceur l'abandonne : la Constellation montre un satellite injoignable, le core ne répond plus. Redémarrer Windows le relance | en place |
| Un nouveau téléphone | Le relier depuis un appareil déjà relié : Atelier › Appareils pour le core, Réglages › Appareils et applications pour un satellite | en place |
| Un code d'appairage expiré | Un nouveau code depuis l'écran du poste, qui affiche le temps restant | en place |
| Un navigateur qui perd son jeton | Un autre appareil relié lui donne un code ; sans lui, seul `npm run pair-code` en donne un | à mettre : garder le téléphone relié à chaque app |
| La clé d'un fournisseur qui arrive à échéance | Son échéance, déclarée dans l'écran, prévient avant ; la clé se remplace depuis le même écran | en place |
| Un correctif à passer en cours de semaine | `mettre-a-jour.ps1`, dans un PowerShell administrateur (§ 9) | terminal, pour un correctif voulu seulement |
