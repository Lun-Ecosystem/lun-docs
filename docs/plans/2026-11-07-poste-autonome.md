# Le poste qui tourne seul. Plan

> **Pour les agents d'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** après un redémarrage de Windows, sans rien taper, le core, Acedia et Avaritia tournent depuis un dossier de
service. Ils redémarrent s'ils tombent et écrivent leurs journaux. La base du core est copiée chaque nuit. Luxuria peut
démarrer avec Windows, avec une icône d'état. Une page dit à CrOliX quoi lancer, dans quel ordre, et comment tout
retirer.

**Architecture :** pas de Docker sous Windows.
- Chaque serveur tourne depuis son build, lancé par un petit lanceur Node (`deploy/windows/run.mjs`) qui écrit les
  journaux et rend le code de sortie du serveur.
- Une tâche planifiée par serveur lance ce lanceur au démarrage de Windows, sans session ni fenêtre, et le relance à
  l'échec.
- Les scripts PowerShell installent, mettent à jour et retirent. **C'est CrOliX qui les lance** : une tâche planifiée
  est un réglage système.

**Stack :** Node 24, PowerShell 5.1 (`Register-ScheduledTask`), Tauri 2 (`tray-icon`, `tauri-plugin-autostart`).

**Spec :** [`../specs/2026-11-07-poste-autonome-design.md`](../specs/2026-11-07-poste-autonome-design.md). Feuille de
route, chantier G. **Prérequis** : le mute du bureau (chantier F) fusionné, pour le menu de l'icône.

| Dépôt, branche | Issues | Niveau |
|---|---|---|
| `lun-anima`, `feat/poste-autonome` | issue à ouvrir | `standard` |
| `lun-acedia`, `fix/liaison-remplace` | lun-acedia#30 | `standard` |
| `lun-avaritia` | aucun changement attendu (`start` existe) ; une issue « sauvegarde de la base », hors MVP | n.a. |
| `lun-luxuria`, `feat/icone-et-demarrage` | issue à ouvrir | `standard` |
| `lun-docs`, branche de la feuille de route ou `docs/mise-en-service` | ce plan, la page de mise en service | `standard` |

## Contraintes globales

- Ne jamais arrêter ni toucher les cores et serveurs de CrOliX (8787, 8788, 8789), ni `data/anima.db`, ni
  `data/cli.token` d'un dossier de travail. Les preuves se font sur un dossier, des bases et des ports jetables.
- **Aucun réglage système fait par l'exécutant** : pas de tâche planifiée créée, pas de pare-feu, pas de registre, pas
  de Tailscale. Les scripts ont un mode `-WhatIf` qui affiche ce qu'ils feraient. C'est ce mode qui sert de preuve sur
  le laptop.
- Aucun secret ni adresse interne dans un dépôt ; les scripts lisent les `.env` existants et ne les affichent jamais.
- Le service tourne sur `main` seulement ; la mise à jour refuse une copie modifiée à la main ou sur une autre branche.
- Le lanceur et les scripts ne passent jamais par un shell pour lancer le serveur (`spawn` avec un tableau
  d'arguments).
- Pas de tiret cadratin ; textes en français, code et commits en anglais.

## Points de relecture

1. **Un port déjà pris au moment de l'installation** (un core de dev lancé) : le script refuse et dit lequel, il
   n'arrête rien. Test en tâche 2 (mode `-WhatIf` contre un port occupé par un serveur jetable).
2. **Un serveur qui meurt en boucle au démarrage** (`.env` absent, base verrouillée) : trois essais, puis arrêt. Le
   journal du jour dit pourquoi dès la première ligne. Test en tâche 1.
3. **La copie de nuit pendant que la veille écrit** : `VACUUM INTO` produit une base cohérente, et la veille n'attend
   pas. Test en tâche 3.
4. **Le disque plein** : une copie ratée laisse les anciennes en place et met la santé du core en défaut, sans arrêter
   la veille. Test en tâche 3 (dossier en lecture seule).
5. **Un `.env` du service qui pointe vers une base de travail** : l'installation refuse un `DB_PATH` hors du dossier de
   service. Test en tâche 2.

---

## lun-anima

### Tâche 1 : `start` et le lanceur

**Fichiers :** `package.json` (racine : `"start": "npm run start -w @lun-anima/core"`), `core/package.json`
(`"start": "node dist/main.js"`), `deploy/windows/run.mjs`, `deploy/windows/run.test.mjs` (ou `.test.ts` si Vitest le
prend : `vitest.config.ts` à étendre à `deploy/`).

**Interfaces :**
- `node deploy/windows/run.mjs --name <core|acedia|avaritia> --cwd <dossier du serveur> --logs <dossier>` :
  - `--cwd` est le dossier du serveur, pas celui du dépôt : `lun-anima/core`, `lun-acedia/server`,
    `lun-avaritia/server`. Ni Acedia ni Avaritia n'ont de `start` à la racine ;
  - lance `node dist/main.js` dans ce dossier, par le même `node.exe` que lui (`process.execPath`) ;
  - écrit stdout et stderr dans `<logs>/<name>-AAAA-MM-JJ.log`. Le fichier change à minuit, et les journaux du même nom
    vieux de plus de 14 jours sont effacés au lancement **et à chaque changement de jour** ;
  - **relance le serveur lui-même** : trois essais à 60 s d'intervalle après un arrêt avec un code non nul, puis il sort
    avec ce code. Un arrêt avec le code 0 ne relance rien. La relance de la tâche planifiée à l'échec n'est pas fiable
    pour un programme qui sort ;
  - écrit le pid du serveur dans `<logs>/<name>.pid` et l'efface à la sortie. À son propre arrêt (`SIGINT`, `SIGTERM`,
    `SIGBREAK`), il arrête le serveur avant de sortir.

- [ ] Branche, issue (critères de la spec §3.1, §3.2, §5), PR en brouillon.
- [ ] Tests d'abord, avec un faux serveur (un script qui écrit deux lignes et sort en 3) :
  - les deux lignes arrivent dans le fichier du jour, et le code de sortie vaut 3 ;
  - un journal daté de 15 jours est effacé, un de 13 jours reste, un autre nom n'est pas touché ;
  - une horloge passée à minuit écrit dans le fichier du lendemain (horloge injectée) ;
  - un serveur qui sort tout de suite écrit sa raison en tête du journal (point de relecture 2) ;
  - un faux serveur qui sort en 1 quatre fois est lancé quatre fois en tout (un premier lancement et trois essais),
    puis le lanceur sort en 1. Le délai est injecté, à 0 dans le test. Un faux serveur qui sort en 0 est lancé une
    seule fois ;
  - le fichier pid existe pendant que le serveur vit, et disparaît après ;
  - un journal de 15 jours apparu pendant que le lanceur tourne est effacé au changement de jour.
- [ ] Code.
- [ ] `npm run build` puis `npm start` contre une base jetable (`DB_PATH`, `PORT` jetables) : le core répond sur
  `/health`, et l'app sous `/app`.

### Tâche 2 : installer, mettre à jour, retirer

**Fichiers :** `deploy/windows/installer.ps1`, `deploy/windows/mettre-a-jour.ps1`, `deploy/windows/retirer.ps1`,
`deploy/windows/LISEZMOI.md` (renvoie à la page de lun-docs).

**Interfaces :**
- `installer.ps1 -Service <dossier> -Travail <dossier des dépôts> [-WhatIf]` :
  - clone les trois dépôts depuis leur `origin` dans `<Service>`, s'ils n'y sont pas ;
  - vérifie un `.env` dans chacun, sans l'afficher. Sinon il dit lequel manque et s'arrête ;
  - refuse un `DB_PATH` hors de `<Service>`, et un `PORT` déjà écouté (point de relecture 1). Le service prend les
    ports habituels, 8787, 8788 et 8789 : l'adresse de retour Google d'Acedia est enregistrée sur 8787. Sur le desktop,
    les serveurs de dev s'arrêtent donc avant l'installation, ou prennent d'autres ports. C'est CrOliX qui les arrête ;
  - lance `npm ci` et `npm run build` dans chaque dépôt ;
  - vérifie les ports : le `PORT` du `.env`, ou à défaut 8788 pour le core, 8787 pour Acedia et 8789 pour Avaritia ;
  - crée les tâches `Lun core`, `Lun Acedia`, `Lun Avaritia`. Le déclencheur est le démarrage de Windows. Elles
    tournent sous le compte de CrOliX en ouverture **S4U** : aucun mot de passe enregistré, la session 0, donc aucune
    fenêtre. Les appels HTTPS sortants (OpenAI, Google) et la boucle locale marchent ; seuls les partages réseau
    authentifiés manquent, et rien ici n'en a besoin. Pas de limite de durée (`ExecutionTimeLimit` à zéro), pas de
    relance par la tâche : c'est le lanceur qui relance. L'action donne le chemin absolu de `node.exe` (`(Get-Command
    node).Source` à l'installation), puis `run.mjs` et ses arguments. L'enregistrement demande un PowerShell
    administrateur : le script le vérifie et le dit.
- `mettre-a-jour.ps1 -Service <dossier> [-WhatIf]`, par dépôt :
  - refuse une branche autre que `main` ou une copie modifiée ;
  - sinon, dans cet ordre : arrête la tâche. Si le pid de `<logs>/<name>.pid` vit encore et que sa ligne de commande
    contient le dossier de service, il l'arrête aussi, et lui seul. Ensuite `git pull --ff-only`, `npm ci`,
    `npm run build`, puis relance la tâche. `npm ci` ne tourne jamais sous un serveur vivant.
- `retirer.ps1 [-WhatIf]` : arrête les trois tâches, arrête les serveurs selon la même règle du pid, puis supprime les
  tâches. Il ne supprime ni le dossier ni les bases.

- [ ] Tests : Pester n'est pas installé par défaut ; la preuve est le mode `-WhatIf` et un dossier jetable. Sur le
  laptop, consigné dans la PR :
  - `installer.ps1 -WhatIf` liste les clones, les builds et le XML des trois tâches ;
  - avec un `.env` manquant : refus, nom du dépôt ;
  - avec `DB_PATH=../ailleurs.db` : refus (point 5) ;
  - avec un port occupé par un serveur jetable : refus, port nommé, rien d'arrêté ;
  - `mettre-a-jour.ps1 -WhatIf` sur une copie modifiée : refus.
- [ ] La vraie installation n'est pas faite par l'exécutant. Les points 1 et 2 de la recette de la spec demandent de
  vraies tâches : la PR les liste comme une recette à jouer par CrOliX. Sur le laptop, dans un dossier jetable, s'il le
  veut ; sinon le jour de l'installation sur le desktop, en suivant la page. La PR le dit franchement.

### Tâche 3 : la copie de nuit

**Fichiers :** `core/src/memory/backup.ts`, `core/src/memory/backup.test.ts`, `core/src/main.ts` (dans la fermeture
`night`, avant `runNight`), `README.md`.

**Interfaces :**
- `backupDatabase(db: DatabaseSync, dir: string, now: Date, keep = 7): { file: string }` :
  - `VACUUM INTO` un fichier temporaire du dossier, effacé d'abord s'il traîne, puis renomme vers
    `<dir>/anima-AAAA-MM-JJ.db` en écrasant. `VACUUM INTO` refuse une cible qui existe, et `night` peut tourner deux fois
    le même jour (route `POST /api/routines/night`, rattrapage) ;
  - crée `dir` au besoin, garde les `keep` plus récentes et efface les autres ;
  - lève en cas d'échec ; l'appelant attrape.
  La connexion est synchrone : le core est figé pendant la copie. C'est accepté, puisque la base est petite et la copie
  a lieu à 5 h ; le journal note la durée de la copie.
- Dans `night` : `try { backupDatabase(db, resolve(root, 'data/backups'), clock()) ; journal } catch (err) { health.set('sauvegarde', ...) }`,
  puis `runNight` comme avant. La note du Journal passe par l'événement du core qu'utilise déjà la présence
  (`emitCoreEvent`, importance `log`) : « Base copiée ». Une copie réussie efface le défaut de santé.

- [ ] Tests d'abord :
  - la copie s'ouvre avec `node:sqlite` et contient une ligne écrite juste avant ;
  - la huitième copie efface la plus vieille, et un fichier d'un autre nom dans le dossier reste ;
  - deux copies le même jour : la seconde réussit et remplace la première ;
  - une écriture depuis une **seconde connexion** pendant la copie aboutit (WAL, `busy_timeout`), et la copie reste
    lisible (point 3) ;
  - un dossier où l'on ne peut pas écrire lève, et les anciennes copies restent (point 4) ;
  - dans `main`, la santé passe en défaut puis revient, par le chemin de `night` (test de la fermeture, ou extraction
    d'une petite fonction `nightWithBackup` testée seule).
- [ ] `README.md` : où sont les copies, combien, comment en restaurer une (arrêter la tâche, copier, relancer).

- [ ] Relecture (agent reviewer), critères cochés et preuves dans la PR, passage en « prête ».

## lun-acedia : rien dans ce chantier

lun-acedia#30 parle de la liaison du core à Acedia, pas de l'appairage de Luxuria. Elle attend aussi un choix de
cadrage, révocation douce ou doublons affichés. Aucun critère de la recette ne l'exige avec des bases neuves : elle sort
du chantier et reste au classement C de la feuille de route.

## lun-luxuria

### Tâche 5 : l'icône et le démarrage avec Windows

**Fichiers :** `src-tauri/Cargo.toml` (`tauri` avec la fonction `tray-icon`, `tauri-plugin-autostart`),
`src-tauri/src/lib.rs` ou `src-tauri/src/tray.rs`, `src-tauri/capabilities/*.json` (permissions nommées seulement :
`autostart:allow-enable`, `allow-disable`, `allow-is-enabled`), `src/desktop/tray.svelte.ts`, `src/settings.ts`
(`display.startWithWindows: false`), `src/Reglages.svelte`, `docs/README.md`, `CLAUDE.md` (permissions) ; tests
`src/desktop/tray.svelte.test.ts`, `src/settings.test.ts`.

**Interfaces :**
- Rust : une icône avec trois entrées (`show`, `mute`, `quit`). Un clic émet l'événement `tray` vers la page avec l'id.
  La commande `tray_state(state: String)` change l'icône et l'infobulle : `present`, `silenced`, `unreachable`. Les
  trois images sont dérivées de `icons/icon.svg`, comme les autres.
- Page : `trayFollows(session)` appelle `tray_state` à chaque changement de `session.state` ramené à ces trois valeurs
  (`$derived`). Elle reçoit `tray` : `show` met la fenêtre au premier plan, `mute` appelle `session.toggleMute()`,
  `quit` passe par la même fin de présence que la fermeture.
- `display.startWithWindows` suit `autostart.enable()` et `disable()` à l'enregistrement. Au lancement, l'écran lit
  `isEnabled()`, et c'est lui qui fait foi.

- [ ] Branche depuis `main` (après F), issue, PR en brouillon.
- [ ] Tests d'abord (plugins simulés comme dans `keys.svelte.test.ts`) : l'état ramené à trois valeurs ; un autre
  réglage sauvé ne rappelle pas `tray_state` ; `mute` du menu bascule ; `startWithWindows` activé appelle `enable`, et
  désactivé `disable` ; un échec du plugin se dit à l'écran sans casser l'enregistrement.
- [ ] Code, `cargo fmt`, `clippy -D warnings`, `cargo test`.
- [ ] Preuve sur le laptop dans l'exe construit : l'icône suit l'état (core jetable coupé : injoignable), le menu
  « Muette » bascule, « Démarrer avec Windows » est activé puis désactivé.
  La clé `Run` du registre est posée par le plugin à la demande de l'utilisateur dans l'écran : c'est son geste, pas
  celui de l'exécutant. L'exécutant la pose et la retire une fois pour la preuve, avec l'accord de CrOliX demandé dans
  la PR, sinon la preuve reste à CrOliX.
- [ ] Relecture, critères et preuves, passage en « prête ».

## lun-docs

### Tâche 6 : la page de mise en service

**Fichiers :** `docs/mise-en-service-desktop.md`, lien depuis `README.md` de lun-docs (section des documents).

- [ ] La page, dans l'ordre que CrOliX suivra :
  - **avant** : Node 24, `uv`, Git, Tailscale installé sur le desktop et le téléphone, les cores de dev du desktop
    arrêtés ;
  - **installer** dans un PowerShell administrateur : `installer.ps1 -WhatIf`, puis pour de vrai ;
  - **les bases qui entrent en service** (§ « Question ouverte » ci-dessous) ;
  - **relier les satellites** : `npm run connect` du core en service vers Acedia et Avaritia en service, puis la
    nouvelle autorisation Google d'Acedia ;
  - **appairer** Luxuria construite sur le core en service ;
  - **le téléphone** : `tailscale serve` sur un port HTTPS par appli (Acedia garde le sien), adresses à régler dans
    Écosystème > Postes, et réabonnement aux notifications si une origine change ;
  - **la nuit** : laisser le PC allumé, ou compter sur le rattrapage ;
  - **vérifier** : les trois tâches, les journaux du jour, la copie de la nuit, la Constellation ;
  - **arrêter, mettre à jour, retirer** ;
  - **ce qui reste à la main** : les notifications Windows (`ToastEnabled`), le pare-feu de vcclient.
  Aucune adresse du tailnet, aucun nom d'hôte réel.
- [ ] `npm run check` vert ; ce plan et la feuille de route cochés.

## Question ouverte, pour CrOliX

**Quelles bases entrent en service ?** Par défaut, le service démarre sur trois bases neuves dans son dossier.
- `anima.db` vide : la mémoire de la relation, le tempérament et le fil repartent de zéro.
- `acedia.db` vide : Acedia se resynchronise depuis Google, mais ses règles de tri et ses cartes repartent de zéro.
- `avaritia.db` vide : le wiki repart de zéro.

L'autre choix : copier des bases existantes (celles du laptop ou du desktop) dans le dossier de service, serveurs
arrêtés, avant le premier démarrage. Une `anima.db` copiée exige le même `ANIMA_SECRET_KEY` dans le `.env` du service,
sinon les jetons des satellites ne se déchiffrent plus. La page décrit les deux et ne copie rien seule. Rien d'autre
dans ce plan n'en dépend.
