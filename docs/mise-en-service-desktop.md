# Mettre le desktop en service

La liste à suivre le jour où le core, Acedia et Avaritia passent sur le desktop pour de bon : lancés au démarrage de
Windows sans fenêtre, joints par le téléphone en HTTPS, la base du core copiée chaque nuit. Spec :
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
  - prendre une copie cohérente, en un seul fichier : pour le core, une copie de nuit (`backups/anima-AAAA-MM-JJ.db`
    à côté de sa base) ; pour les autres, la base de son serveur arrêté, avec ses fichiers `-wal` et `-shm` s'il y en a ;
  - la poser au chemin du `DB_PATH` du service ;
  - une `anima.db` copiée exige le **même `ANIMA_SECRET_KEY`** dans le `.env` du service que là d'où elle vient, sinon
    les jetons des satellites et la clé du modèle ne se déchiffrent plus.

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
   avec son journal. Elle les arrête en quittant, et Windows les arrête aussi si elle plante. Leurs sorties vont dans
   `whisper-server.log` et `rvc.log`, vidés à chaque lancement, près de `voix.log`, dans
   `%LOCALAPPDATA%\io.github.lun-ecosystem.luxuria\logs`. Sans programme choisi, on les lance soi-même avant Luxuria :
   l'appli vérifie seulement qu'ils répondent.
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

La veille de nuit et la copie de la base tournent à 5 h. Laisser le PC allumé (veille prolongée désactivée), ou compter
sur le rattrapage : une nuit manquée est jouée une fois, une minute après le démarrage suivant (sauf
`ROUTINES_CATCHUP=0` dans le `.env` du core).

## 8. Vérifier

- Les trois tâches : `Get-ScheduledTask 'Lun *' | Get-ScheduledTaskInfo` (dernier résultat `267009` : en cours).
- Les journaux du jour : `data\logs\<nom>-AAAA-MM-JJ.log` dans chaque dépôt du service. Un serveur qui s'arrête dit
  pourquoi dans ses premières lignes.
- La copie de la nuit : `backups\anima-AAAA-MM-JJ.db` à côté de la base du core, sept copies au plus, et l'événement
  « Base copiée » au Journal. Un échec se lit dans la santé du core.
- La Constellation : le core, Acedia et Avaritia joignables, Luxuria présente.
- Un redémarrage de Windows, sans rien taper : tout revient, sans fenêtre de console.

## 9. Arrêter, mettre à jour, retirer

- **Arrêter un serveur** : `Stop-ScheduledTask 'Lun core'` (puis `Start-ScheduledTask` pour le relancer). Le lanceur
  relance seul un serveur tombé en erreur, trois fois, puis le laisse arrêté ; la Constellation le montre.
- **Mettre à jour** : `.\mettre-a-jour.ps1 -Service D:\lun-service` (`-WhatIf` d'abord). Il refuse une copie hors de
  `main` ou modifiée à la main ; sinon, dépôt par dépôt : arrêt, `git pull --ff-only`, `npm ci`, build, relance.
- **Retirer** : `.\retirer.ps1 -Service D:\lun-service`. Les tâches et les serveurs partent, le dossier et les bases
  restent.
- **Restaurer la base du core** : voir « La copie de la base » dans le `README.md` de lun-anima.

## 10. Ce qui reste à la main

- Les notifications de Windows, si elles sont coupées (`ToastEnabled = 0` dans le registre de l'utilisateur).
- Le pare-feu du service de conversion de voix, s'il écoute au-delà de la boucle locale.
- Le `tailscale serve` de chaque appli (§ 6), qui survit aux redémarrages une fois posé avec `--bg`.
