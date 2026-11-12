# Remettre les textes d'accord : la doc, les règles et la surface publique. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **À relire par le plan-challenger, puis à valider par CrOliX.** Le chantier est validé par CrOliX le 12/11 (« ok je
> valide »), avec les sept décisions écrites sous « Source ». Les choix marqués **[avis]** se tranchent à la fin
> (« À trancher par CrOliX »).
>
> **PR :** une par dépôt touché, en brouillon dès le premier push. Celle de lun-docs fusionne la première : la CI des
> trois satellites clone `main` de lun-docs pour lancer le nouveau contrôle. Lun'Anima n'est pas touché.

**But :** que les textes disent ce qui est décidé et ce que le code fait, que deux règles ne se contredisent plus, et
qu'un dépôt public ne décrive plus l'intérieur d'un dépôt privé. Trois morceaux. **Les textes** : les décisions du
12/11 écrites là où elles font foi, la feuille de route et la carte de ce qui tourne à jour, le serveur dédié dans les
normes. **Les règles** : le registre, le plugin, la règle des PR de lun-docs. **La surface publique** : une règle et un
contrôle pour ce qu'un dépôt public tait, et l'IPC de la fenêtre de Lun'Luxuria bornée par la personne, plus par la
page.

**Ce que ce chantier règle.** L'audit du 12/11 trouve deux définitions du MVP ; une feuille de route qui dit « en
attente » ce qui est fusionné ; des normes qui disent le NAS quand CrOliX vise un serveur dédié ; un skill qui lit un
champ que le registre n'a pas ; deux règles du plugin qui se contredisent sur `gh pr ready` ; des centaines de chemins
du core dans le dépôt public ; une fenêtre dont la page choisit le dossier qu'elle lit et celui où elle lance un script.

**Source :**

- L'audit du 12/11, hors dépôt : la synthèse (« Décisions qui reviennent à CrOliX », « 3. Les textes d'accord et la
  surface publique ») et le rapport de lun-docs (constats 1 à 9, 11 et 14 ; issues #41, #109, #130, #136). Chaque
  constat repris ici a été relu dans son fichier. Ce qui n'a pas tenu est sous « Constats écartés ».
- Les décisions de CrOliX du 12/11 :
  1. la semaine de rodage sans tension sur le desktop est la porte du MVP ; la révision de l'état cible vient après ;
  2. la barre de confiance des gestes : un chantier court mesure au banc les mots des gestes avec cinq voix, puis la
     règle se tranche ; aucune vraie carte avant ;
  3. la langue de la voix (B2) se tranche sur le desktop ;
  4. la prod tournera sur un serveur dédié, le NAS au stockage (décision du 10/11, cadrage de l'état cible `:145`) ;
  5. aucun son dans un dépôt ; un modèle seulement s'il est petit, libre, nécessaire à l'app et tracé ;
     `silero_vad.onnx` reste dans lun-luxuria, et un garde en CI refuse tout autre fichier de modèle ;
  6. le premier appareil sans terminal (lun-anima#72) entre dans le MVP ;
  7. l'ordre : en parallèle « tenir en continu », « écoute et parole » et ce chantier ; puis le banc et les mots des
     gestes ; le premier contact sans terminal ; le desktop ; le rodage, puis la bascule.
- Le code relu sur `main` le 12/11, par le graphe d'abord : lun-docs `139a3e2`, lun-luxuria `11eb3d1`, lun-acedia
  `1ae4457`, lun-avaritia `424c4ec`. Les sources de Tauri 2.12.5, de tauri-plugin-http 2.8.3 et de
  tauri-plugin-dialog 2.8.4, lues dans le cache de Cargo du laptop. La PR lun-docs#162 (`docs/deroule-tour`), lue pour
  ce qu'elle change de la feuille de route.

**Critères de fin :**

- Les sept décisions sont écrites là où elles font foi : le cadrage de l'état cible (1, 4, 6), la feuille de route
  (1, 2, 3, 6, 7), l'ADR qui remplace 0008 et `environnements.md` (4), `structure-projet.md`, le `CLAUDE.md` et la CI
  de Lun'Luxuria (5), le dictionnaire (le MVP, le serveur dédié, le NAS).
- Aucun texte normatif ne dit plus que la prod ira sur le NAS : `standards/`, les ADR acceptés,
  `docs/architecture-actuelle.md`, `templates/`, les skills. Les ADR 0001 et 0008 sont « remplacée par » ; lun-docs#109
  est fermée.
- La feuille de route a une ligne par chantier jusqu'au 12/11, l'ordre du 12/11, rien de fusionné « en attente », les
  agents `dev-*` tels qu'ils sont. `architecture-actuelle.md` est datée du jour de la PR et suit le dictionnaire.
- `npm run check` échoue sur deux projets de même `id` ou de même `depot`, sur une liste imbriquée et sur une valeur
  vide du registre ; le skill `lun-ecosysteme` ne cherche plus un champ absent.
- Le skill `lun-livrer`, le message du hook de garde et l'agent livreur disent la même chose : l'agent ne passe pas une
  PR « prête », il dit qu'elle l'est. `git.md` porte la règle des PR de lun-docs tranchée par CrOliX.
- La règle « rien de l'intérieur d'un dépôt privé » est dans `essentiel.md` § 6 et `securite.md`. `npm run check`
  échoue sur un chemin du core hors des fichiers gelés ; `check-repo.mjs --public` le fait dans la CI de Lun'Luxuria,
  de Lun'Acedia et de Lun'Avaritia ; un drapeau inconnu fait échouer le script ; le `reviewer` a la règle. Les textes
  vivants des quatre dépôts publics sont conformes.
- Lun'Luxuria : aucune commande de la fenêtre ne prend un dossier de la page ; `http:default` ne nomme que la boucle
  locale ; un autre hôte n'est joint qu'après l'accord de la personne, gardé côté Rust ; son `CLAUDE.md` dit vrai. La
  CI refuse tout fichier de modèle autre que `silero_vad.onnx`, et celui-ci s'il ne correspond plus à son `SOURCE.md`.
- lun-docs#41 et #136 fermées ; lun-docs#130 faite pour lun-docs et les satellites publics, laissée ouverte pour le
  reste, avec un commentaire qui le dit.
- Les barrières de chaque dépôt sont vertes ; celles de `design/` aussi, pour la galerie touchée.

| Dépôt, branche | Issue | PR | Niveau |
|---|---|---|---|
| `lun-docs`, `docs/textes-d-accord` | la chapeau, à ouvrir ; #109, #130 en partie, #136, #41 | à ouvrir | `standard` |
| `lun-luxuria`, `fix/surface-publique` | une issue à ouvrir, l'IPC et les hôtes ; la chapeau | à ouvrir | `critique` |
| `lun-acedia`, `chore/surface-publique` | la chapeau | à ouvrir | `trivial` |
| `lun-avaritia`, `chore/surface-publique` | la chapeau ; #130 (en partie) | à ouvrir | `trivial` |

*Show* partout. Lun'Luxuria passe « prête » après la preuve à la main de CrOliX dans l'exe, sur le laptop : une boîte
de dialogue du système ne se clique pas par un agent.

## Ce que le code fait aujourd'hui

### lun-docs : les textes

- **Deux définitions du MVP.** La feuille de route fait de la semaine de rodage une porte :
  `docs/plans/2026-11-07-feuille-de-route-mvp.md:46` (J5), `:75` (B8), `:330`. Le cadrage
  `docs/specs/2026-11-10-etat-cible-cadrage.md:45-48` propose d'en faire le premier chantier de la révision
  (**[avis Claude]**), `:141` la range dans la révision (§ 6, point 1), `:164` laisse la question ouverte (§ 8,
  point 3), et `:167` clôt la feuille sans dire quand.
- **Le premier appareil sans terminal.** Le cadrage le range dans « Mis de côté » d'Anima (`:79`, avec « le NAS ») et
  le veut dans sa ligne d'arrivée (§ 4.2, point 7). La feuille le sort du MVP (`:27-29`) et le met après (`:98`).
- **La feuille en retard.** L y attend « la recette du desktop », en brouillon (`:15-16`, `:23`) : lun-luxuria#44
  est fusionnée depuis le 10/11. P est « en brouillon jusqu'à la fusion de lun-docs#123 » (`:22`), fusionnée le 09/11.
  Les chantiers du 10 au 12/11 n'ont de trace que dans la liste d'essais du § 4 (`:297-320`). Les agents de dev y sont
  « retirés depuis lun-docs#108 » (`:282`) ; ils existent depuis lun-docs#163 (`plugin/agents/dev-*.md`,
  `standards/workflow.md:46-58`). `:107-108` fait partir un plan après le plan-challenger, quand
  `standards/workflow.md:9-14` attend le « validé » écrit de CrOliX. Le calendrier (`:338-343`) est passé. `:8-46`
  range les jours dans le désordre (09/11, 10/11, 08/11 au soir, 08/11), puis un tableau du 07/11. Le § 4 cite une
  commande, deux colonnes et un outil du core (`:288`, `:291`, `:306`, `:319`).
- **La barre de confiance et la langue.** B1 : « le verrou reste à CrOliX » (`:68`) ; B2 : « à l'oreille » (`:69`).
  `adr/0011-chaine-vocale-mvp.md:26-29` interdit une vraie carte à la voix tant que la transcription ne rend pas une
  confiance réelle, et laisse la langue ouverte. Il est accepté et ne se modifie pas : il ne contredit pas les
  décisions 2 et 3, la feuille dit la suite.
- **Le NAS dans les normes.** `standards/environnements.md:3-4`, `:10`, `:37-43` ; `standards/essentiel.md:33-35` ;
  `standards/stack.md:51-55` (le NAS, son modèle, et le dossier de déploiement du core) ;
  `docs/architecture-actuelle.md:33` ; `adr/0008-acces-exterieur.md:8`, `:15` (« Tout tourne sur le NAS ») ;
  `adr/0001-referentiel-et-methode.md:22` ; la feuille `:91-92` ; tout `docs/plans/2026-11-08-bascule-nas.md`. Seul le
  cadrage (`:145`) dit le serveur dédié.
- **L'ADR 0001** (lun-docs#109) : un seul GitHub Projects (`:19`, fermé depuis le 09/11), la prod sur le NAS (`:22`),
  le modèle par niveau et une décision d'achat après mesure (`:24-25`). `workflow.md:44-58` range les agents par métier
  depuis le 11/11, et aucun niveau ne choisit le modèle (`:42`). `adr/README.md:9-13` : un ADR accepté ne se modifie
  pas ; le suivant le remplace, et l'ancien passe à « remplacée par NNNN ». `tools/check-registry.mjs:49-62` vérifie
  cette ligne et les 60 lignes.
- **La carte de ce qui tourne.** `docs/architecture-actuelle.md:3` est « au 08/11/2026 ». `:16` dit « sa mémoire » et
  `:18` « le savoir », là où le dictionnaire dit les souvenirs et la bibliothèque. `:33` met le NAS après le rodage.
  `:50-51` donne une commande du core. Rien sur les lignes d'arrivée ni sur l'anatomie.
- **Le dictionnaire.** `standards/dictionnaire.md:92` définit le MVP sans sa porte. Aucun mot pour le serveur dédié ni
  pour le NAS, alors qu'un mot qui porte une décision s'y ajoute avant de s'écrire ailleurs (`:4-5`).
- **Les modèles.** Aucune norme ne dit si un modèle entre dans un dépôt. Les ADR 0010 (`:22`) et 0011 (`:25`) gardent
  le modèle de voix hors des dépôts ; les plans du banc (lun-docs#162) disent « aucun son ni modèle dans un dépôt ».
  `standards/structure-projet.md:19-28` liste ce qui n'a pas sa place dans un dépôt, sans les sons ni les modèles.
- **Le design** (lun-docs#136 et constat 11). `standards/design.md:18` fait de `--rouge` l'accent d'Anima, et `:31-32`
  dit que `--accent-texte` y reprend `--texte`. `design/tokens.css:38-48` donne à Anima son accent `--anima`, distinct
  du rouge, et son texte `--anima-texte`. `design.md:106` promet une échelle typographique, des espacements, des
  hauteurs et le mouvement : `tokens.css` (73 lignes) n'en a aucun.
- **Le vocabulaire** (lun-docs#130, la part de lun-docs). « Cerveau » pour Avaritia : `standards/stack.md:28`,
  `standards/notifications.md:44`. « Le point du matin » : `notifications.md:26`, `:40`, `:43`, `:57`. « La veille de
  nuit » : `docs/mise-en-service-desktop.md:133`. « Jetons de design » : `CLAUDE.md:10`, `README.md:30`. `vision.md`
  (« VIP ») attend sa réécriture (lun-docs#127). Le titre de l'ADR 0005 ne se modifie pas.
- **Ce qui fait foi.** `README.md:18-36` ne renvoie ni à `architecture-actuelle.md` ni au cadrage de l'état cible.
- **Les plans à moitié cochés** (constat 14) : `2026-11-06-luxuria-essai-chronometre.md` (26 cases vides, son relevé
  est lun-luxuria#9), `2026-11-07-poste-autonome.md:197`, `2026-11-07-voix-confiance-blocs.md:73`, `:76`,
  `2026-11-08-normes-a-jour.md:94`, `2026-11-08-voix-au-quotidien.md:33`.

### lun-docs : le registre, le plugin, la règle des PR

- **Le registre.** `registry.yaml:15` annonce un champ optionnel `contrats` ; aucun projet ne l'a. Le skill
  `plugin/skills/lun-ecosysteme/SKILL.md:20-23` fait chercher le propriétaire d'une fonction « dans le registre, champ
  `contrats` » : la recherche ne trouve rien. Le site ne lit pas ce champ (cherché dans son dépôt local). La propriété
  est déjà écrite ailleurs : « Possède » et « Ne possède pas » dans le `CLAUDE.md` de chaque projet,
  `architecture-actuelle.md:13-20`.
- `tools/check-registry.mjs:13-29` lit une liste plate, ligne à ligne ; `:33-47` ne vérifie l'unicité ni de `id` ni de
  `depot`. Une liste imbriquée sous un projet crée un projet fantôme (essai de l'audit). Le site lit ce fichier à son
  build (`CLAUDE.md`, « Spécificités »).
- **`gh pr ready`.** `plugin/skills/lun-livrer/SKILL.md:29-31` le fait lancer en *Show* ; le message du hook de garde
  aussi (`plugin/hooks/guard.mjs:116`). `plugin/agents/livreur.md:19` l'interdit (« tu dis qu'elle l'est »), et le mode
  auto le refuse. `standards/git.md:38-43` dit qu'elle « passe prête » sans dire qui. `guard.test.mjs:114` range
  `gh pr ready 3` parmi les commandes permises : seul le message change.
- **La règle des PR de lun-docs.** `standards/git.md:45-48` : une PR par axe, fusionnée quand le palier de l'axe est
  fini ; `standards/essentiel.md:39-40` : une branche et une PR par chantier, sans l'exception. lun-docs#162 porte 28
  commits, cinq fichiers et quatre plans exécutés, en brouillon depuis le 11/11, en retard d'un commit sur `main`.
- **Le hook `pre-push`** (lun-docs#41). `templates/project/hooks/pre-push:2` dit « Core privé : refuse tout push vers
  main (pas de protection de branche sans GitHub Pro) », recopié tel quel dans les trois satellites publics. Ceux-ci ont
  le ruleset (`git.md:58-63`), leur licence, leur README et leur `CLAUDE.md`. Le premier push d'un dépôt neuf n'est dit
  nulle part.

### lun-docs : ce que le dépôt public dit du privé

- La règle existe, dans `CLAUDE.md` (« Spécificités ») seulement : « rien des dépôts privés au-delà de leur nom ».
  `essentiel.md` § 6 (`:42-45`) et `securite.md:10-19` ne parlent que des secrets, des adresses et des données.
- Sur `main` : 397 chemins distincts des dossiers `core/src` et `ui/src` du core, dans 38 fichiers ; 42 fichiers en
  comptant les chemins écrits avec le nom du dépôt du core (hors liens d'issue et de PR). Tous sont des plans et specs
  datés, sauf `design/galerie/inventaire.ts:154`, `:161`, `design/galerie/base.css:2` et
  `docs/mise-en-service-desktop.md` (la procédure du desktop : dossiers, scripts, variables et base du core).
  S'ajoutent, sans chemin : les commandes et colonnes de la feuille (`:288` à `:319`), la commande de
  `architecture-actuelle.md:50-51`, le dossier de déploiement de `stack.md:52`, tout le § 1 du plan de bascule.
- `tools/check-repo.mjs:89-127` ne cherche que les adresses. `--addresses <dir>` (`:144-155`) est lancé par la CI de
  Lun'Luxuria, de Lun'Acedia et de Lun'Avaritia (`ci.yml:26-29`), et par celle des deux dépôts privés : un motif ajouté
  à `--addresses` casserait la CI du core. Un drapeau inconnu n'est pas refusé : sans `--addresses`, le script contrôle
  lun-docs lui-même et passe, quel que soit le dossier donné.
- `listFiles` (`:50-60`) lit aussi les fichiers non suivis : la maquette `04-accueil-v2.html` n'a aucun chemin du core
  (vérifié), le contrôle passera aussi en local.

### Lun'Luxuria

- **Les dossiers viennent de la page.** `src-tauri/src/body.rs:75-83` : `body_config(folder)`, `body_image(folder,
  name)`. La lecture est bornée au dossier donné (`inside`, `:42-50` ; noms d'image, `:17-39` ; tailles, `:52-61`), mais
  le dossier est celui que la page envoie. `src-tauri/src/voice.rs:219-241` : `voice_start(dir, args)` et
  `voice_restart(dir, args)` ; le dossier doit contenir `service.py` (`:27-33`), puis `uv run service.py` y tourne
  (`:49-62`). La page garde ces dossiers dans ses réglages (`src/settings.ts:46-47`, `:63`, `:104`, `:121`, `:171`),
  saisis au clavier (`src/desktop/DossierCorps.svelte:13-26`, `src/desktop/ServiceVoix.svelte:253-259`), envoyés par
  `src/desktop/corps.svelte.ts:80`, `:88`, `:96` et `src/desktop/voix.ts:152`, `:225`. `voix.ts:30` refuse un dossier
  vide.
- **Le modèle à suivre.** `src-tauri/src/programs.rs:1-5`, `:209-235` : la boîte de dialogue du système s'ouvre côté
  Rust (`program_pick`), modale à la fenêtre ; le chemin choisi est vérifié, puis gardé dans `programmes.json` du
  dossier de config (`:69-90`, `:195-202`) ; `program_start` le relit (`:244-256`). La page ne donne qu'un nom d'une
  liste fixe (`:17-18`, `:42-47`). Elle n'a aucune permission `dialog:` (`capabilities/default.json`).
- **Le réseau.** `src-tauri/capabilities/default.json:8-24` : `http:default` permet tout hôte, en http et https, avec
  ou sans port. Par plugin-http passent le serveur relié et le modèle seul (`src/desktop/net.ts:18-33`,
  `src/session.svelte.ts:132`, `:243`). Le service voix passe par le fetch de la page, borné par la CSP
  (`net.ts:28-31`, `tauri.conf.json:24`). Le modèle par défaut est sur la boucle locale (`settings.ts:87`) ; un
  serveur hors de la boucle locale doit être en https (`net.ts:42-48`). Le plan de bascule note qu'une adresse du
  réseau privé passe parce que la portée admet tout https.
- **Tauri.** `Manager::add_capability` ajoute une capacité pendant l'exécution (tauri 2.12.5, `src/lib.rs:841`) ;
  `CapabilityBuilder::window` et `permission_scoped` (`src/ipc/capability_builder.rs:62`, `:101`) ; aucune fonction ne
  la retire. tauri-plugin-dialog 2.8.4 : `blocking_pick_folder` (`src/lib.rs:738`), une boîte de message
  `blocking_show` (`:372`). L'app ne déclare aucune permission propre (`src-tauri/build.rs` : `tauri_build::build()`
  seul) : une commande de `src-tauri/src/lib.rs:31-44` est appelable par la page.
- **Ce que dit le `CLAUDE.md`.** `:31` : « lire le dossier du corps (borné à ce dossier) » ; la lecture l'est, le choix
  du dossier non. `:35-36` : « serveur et modèle par plugin-http », sans borne.
- **Le privé dans le public.** `CLAUDE.md:52-53` (une commande du core), `docs/README.md:22-23` (une commande et une
  variable du core), `src/presence/chaine.test.ts:41`, `:547`, `:577` (la même commande, en commentaire et dans deux
  messages d'erreur), `hooks/pre-push:2` (« Core privé »). Le nom seul (`docs/essai-2026-11-07.md:125`) est permis.
- **Les modèles.** `src/listen/silero/silero_vad.onnx` est le seul fichier de modèle suivi (`git ls-files`, extensions
  onnx, ort, pt, pth, ckpt, safetensors, gguf, tflite, bin). `src/listen/silero/SOURCE.md:3-5` donne sa taille, son
  SHA-256, sa source, sa version et sa licence (MIT). La CI ne refuse que les sons (`.github/workflows/ci.yml:47-51`).
- **Les actions.** `ci.yml:15-16`, `:46`, `:52`, `:66-67` (`actions/checkout@v4`, `actions/setup-node@v4`), `:72`
  (`Swatinem/rust-cache@v2`), par étiquette ; jeton en lecture (`:8-9`). Aucun `dependabot.yml`.

### Lun'Acedia et Lun'Avaritia

- **Lun'Acedia** nomme Lun'Anima et le contrat public (`CLAUDE.md:12`, `README.md:65`, `:84`, `docs/pina.md:32-34`) ;
  son `pair-code` est le sien (`README.md:56`). Rien de l'intérieur du core : conforme. `hooks/pre-push:2` dit « Core
  privé ».
- **Lun'Avaritia** : `docs/prouver-avaritia.md:64-65` nomme une commande du core ; « cerveau » pour elle-même
  (`CLAUDE.md:9`, `README.md:79`) ; « la mémoire affective et personnelle » (`CLAUDE.md:13`) ; `hooks/pre-push:2`.
- **Les actions des deux** : `ci.yml:15-16`, puis `:45` ou `:43` (`actions/*@v4`) ; `release.yml:17`, `:25-31`
  (`docker/setup-buildx-action@v3`, `docker/login-action@v3`, `docker/build-push-action@v6`), avec
  `packages: write` (`release.yml:9-11`). Aucun `dependabot.yml`.

### Constats écartés

- **`D:\` dans le plan de bascule.** `D:` a disparu du laptop le 09/11. Le plan (`:39`) et la mise en service
  (`:19`, `:26`, `:58`…) parlent du dossier de service sur `D:` **du desktop**, qui garde ses disques d'après la
  mémoire de la session. Rien à corriger ici ; à confirmer par CrOliX sur le desktop.
- **La doc de Lun'Acedia** : le nom et le contrat seuls. Rien à y changer hors du hook.
- **« Cerveau » dans `lun-avaritia/app/src/agent/icons.ts:6`** : le libellé d'un pictogramme parmi les icônes de
  l'agent (à côté de « Bibliothèque »), pas le nom du projet. Pas un écart.
- **« Son cerveau » dans `lun-luxuria/docs/README.md:18`, `:113`** : ce qui décide de ce qu'elle dit (un modèle ou un
  serveur, `Brain` dans le code), pas Avaritia. Laissé.
- **« Sous-agent »** dans `workflow.md:64`, `:86` et `essentiel.md:61` : les sous-agents de
  Claude Code, pas l'agent d'un poste que le dictionnaire nomme. Laissé.
- **« Dix-huit issues `inbox` »** (cadrage, § 6, point 2) : juste au 10/11 pour les cinq dépôts.
- **Les chiffres de l'audit** : 38 fichiers et 397 chemins sur `main` pour `core/src` et `ui/src` (l'audit dit 39 et
  396) ; 26 cases vides dans l'essai chronométré (25).

## Les choix **[avis]**

### Ce qu'un dépôt public tait

**La règle.** Un dépôt public dit d'un dépôt privé son nom, son rôle, ses issues et ses PR, le contrat public qu'il
emploie (`/lun/v1`, l'appairage tel qu'un client le voit) et son adresse locale. Il ne dit ni ses chemins, ni ses
tables et colonnes, ni ses commandes et scripts, ni ses variables d'environnement, ni ses fichiers de déploiement.

**Le contrôle tranche les chemins ; la relecture, le reste.** Un motif sûr existe pour un chemin : un dossier du core
(`core/src`, `ui/src`) suivi d'une barre et d'un nom, ou le nom d'un dépôt privé du registre suivi d'une barre et d'un
nom, hors liens d'issue et de PR. Une commande, une colonne ou une variable ne se distingue pas d'un nom à soi : un
satellite peut nommer sa commande comme une commande du core. Celles-là restent à la relecture, par une ligne du
`reviewer`.

**L'existant gelé, pas réécrit.** L'historique de git garde tout ce qui a été publié : réécrire 38 plans datés ne retire
rien, coûte beaucoup et abîme ce qui sert de trace. Le contrôle gèle chaque fichier daté à son compte du jour, dans
`tools/prive-gele.json` : un compte qui monte échoue, un fichier à zéro sort de la liste. Les textes vivants (normes,
galerie, feuille, carte) sont corrigés maintenant. `docs/mise-en-service-desktop.md` est gelée jusqu'à la bascule :
la récrire avant la session du desktop gênerait la seule page qui y sert.

**Les plans à venir.** Le plan d'un chantier qui touche l'intérieur du core écrit cette part dans le dépôt du core
(`docs/plans/`, même nom) ; lun-docs garde sa ligne de feuille de route et, pour un chantier à plusieurs dépôts, le plan
public qui renvoie à cette part. Sinon, la règle ne tient pas une semaine : un plan dit « ce que le code fait
aujourd'hui » avec `chemin:ligne` (`plugin/agents/redacteur-plan.md:10-11`).

### Le serveur dédié et le NAS

**Le NAS garde les copies et les fichiers, aucune base n'y tourne.** SQLite sur un partage réseau verrouille mal ; et
l'audit note que les copies restent sur le disque de la base. Le serveur dédié tient la prod (les apps, leurs bases, la
porte) ; le NAS reçoit les copies, hors du disque du serveur. Le choix de la machine attend l'achat (cadrage § 6,
point 5) : l'ADR le dit, sans la nommer.

### L'hôte réglé de Lun'Luxuria

**Confirmé par la personne dans une boîte du système, comme un programme.** Les adresses du serveur et du modèle
viennent des réglages, donc de la page. Une portée que la page élargit à la demande ne borne rien contre une page
compromise. Une boîte de message ouverte côté Rust, que la page ne peut ni ouvrir ni cliquer, fait de la personne la
seule à choisir, comme `program_pick` (`programs.rs:209-213`). Le risque reste théorique (aucun sink HTML, CSP serrée) ;
le coût est une boîte par nouvelle origine, une fois.

### Les actions par SHA

**Oui, avec Dependabot.** Une étiquette (`@v4`) se déplace : qui prend la main sur le dépôt d'une action la repointe,
et chaque CI exécute le nouveau code au run suivant. Le risque compte surtout là où le jeton écrit : `release.yml` de
Lun'Acedia et de Lun'Avaritia publie l'image sur GHCR (`packages: write`) par trois actions tierces ; une image piégée
serait celle que la prod tire. Dans Lun'Luxuria, `Swatinem/rust-cache` est tierce aussi. Un SHA seul se fige : sans
Dependabot (`github-actions`, une fois par mois, groupé), les actions vieillissent (l'audit voit déjà l'avertissement
« Node.js 20 is deprecated »). Le core suivra par un chantier qui passe chez lui.

### La règle des PR de lun-docs

**Une PR par plan, pas par axe.** Le cadrage voyage avec le premier plan de l'axe ; la PR s'ouvre en brouillon avec
le plan, reçoit ses coches, passe prête quand le plan est coché ou arrêté, et CrOliX la fusionne ; le plan suivant de
l'axe ouvre la suivante, partie de `main`. lun-docs#162 aurait fait quatre PR de trois à dix commits, et chaque plan
validé aurait été sur `main` un ou deux jours après sa dernière coche. Les deux autres voies sont « À trancher ».

## Les tâches

**En parallèle d'emblée** : 1, 4 et 7 dans lun-docs ; 10 et 12 dans Lun'Luxuria ; 13 et 14. **Après 1** : 2. **Après
2** : 3 et 5. **Après 5** : 6. **En dernier dans lun-docs** : 8, après la fusion de lun-docs#162. **Après 10** : 11.
**Après la fusion de la PR de lun-docs** : le pas `--public` des tâches 12, 13 et 14. **À la fin** : 15.

Chaque fichier n'a qu'une tâche à la fois. Dans lun-docs : 1 seule dans le cadrage, le dictionnaire et
`structure-projet.md` ; 2 dans les ADR, `environnements.md`, `stack.md`, le plan de bascule et le § 4
d'`essentiel.md` ; 3 dans `architecture-actuelle.md` ; 4 dans le registre et `check-registry.*` ; 5 dans
`check-repo.*`, `securite.md`, `CLAUDE.md`, `reviewer.md`, la galerie et les § 2 et 6 d'`essentiel.md` ; 6 dans
`git.md`, `lun-livrer`, `guard.mjs`, le gabarit et le § 5 d'`essentiel.md` ; 7 dans `design.md`, `notifications.md`,
`README.md` et la ligne 133 de la mise en service ; 8 dans la feuille et les cinq plans à moitié cochés. Dans
Lun'Luxuria : 10 puis 11 dans `src-tauri/src/lib.rs` et le haut du `CLAUDE.md` (`:31-36`) ; 12 seule dans
`ci.yml`, `docs/README.md`, `hooks/pre-push`, `chaine.test.ts` et le bas du `CLAUDE.md` (`:50-70`).

### lun-docs (`dev-front`, worktree `wt\accord-docs`, branche `docs/textes-d-accord`)

1. - [ ] **Les décisions du 12/11** (`docs/specs/2026-11-10-etat-cible-cadrage.md`, `standards/dictionnaire.md`,
   `standards/structure-projet.md`). *Parallélisable d'emblée.*
   - Le cadrage. En tête (`:3-5`) : ce qui est tranché le 12/11 et où. § 3 (`:45-48`) : l'**[avis Claude]** devient
     « Tranché par CrOliX le 12/11 : la semaine de rodage sans tension sur le desktop est la porte du MVP ; la révision
     de l'état cible vient après. » § 4.2 (`:79`) : « le premier appareil sans terminal » sort de « Mis de côté » (il
     entre dans le MVP, lun-anima#72) ; « le NAS » devient « la bascule vers le serveur dédié ». § 6 (`:141`, `:145`,
     `:146`) : le point 1 n'est plus de la révision, c'est la porte ; le point 5 renvoie à l'ADR de la tâche 2 ; le
     point 6 dit que le premier appareil entre dans le MVP. § 8 (`:164`) : le point 3 barré, avec la décision. `:167` :
     « La feuille de route du MVP se clôt après la semaine de rodage ; une nouvelle prend sa suite avec ces deux axes. »
   - Le dictionnaire, table « La méthode » : le MVP (`:92`) « atteint quand une semaine de rodage sur le desktop passe
     sans point de tension (12/11) » ; deux lignes. **le serveur dédié** : la machine de la maison où tourne la prod
     après le rodage (ADR de la tâche 2) ; ne désigne pas « le serveur » seul (celui auquel Lun'Luxuria est reliée, ou
     celui de la chaîne). **le NAS** : le stockage de la maison, les copies et les fichiers ; ne désigne pas la prod.
     Le dictionnaire passe avant les textes qui emploient ces mots : la tâche 2 vient après.
   - `structure-projet.md`, « Ce qui n'a pas sa place dans un dépôt » (`:19-28`) : « Un son : enregistrement, synthèse
     ou déroulé. Un modèle, sauf s'il est petit, libre, nécessaire à l'app et tracé : un `SOURCE.md` à côté donne sa
     source, sa version, sa taille, son SHA-256 et sa licence, et la CI du dépôt refuse tout autre fichier de modèle. »
   - Preuve : `npm run check`, `npm run sync:check` (le dictionnaire est recopié dans `lun-ecosysteme`).
   - Exclu : réécrire `vision.md` (lun-docs#127) ; la première marche de la présence (cadrage § 8, point 2).
2. - [ ] **Le serveur dédié dans les normes** (`adr/`, `standards/environnements.md`, `standards/essentiel.md` § 4,
   `standards/stack.md`, `docs/plans/2026-11-08-bascule-nas.md`). Après 1.
   - `adr/0012-prod-serveur-dedie.md`, qui remplace 0008. **Contexte** : la décision du 10/11 (cadrage `:145`), le NAS
     d'aujourd'hui, le desktop du rodage. **Décision** : la prod sur le desktop pendant le rodage, puis sur un serveur
     dédié à la maison, à choisir à l'achat ; le NAS au stockage, selon ce que CrOliX tranche (« À trancher », point
     5) ; l'accès comme dans 0008, déchiffré sur la machine de prod : Tailscale au MVP, la cible inchangée (domaine,
     Caddy, VPS qui relaie le flux chiffré, passkeys), la porte dans le déploiement. **Conséquences** : celles de 0008
     qui restent vraies (adresse publique en configuration, battement des flux SSE, TLS hors boucle locale, PWA par
     l'adresse HTTPS, jetons d'appareil) ; le plan de bascule à refaire à l'achat. **Alternatives écartées** : tout sur
     le NAS ; ce que 0008 écartait déjà. La raison du serveur (des modèles légers en local) vient de la mémoire de la
     session du 10/11 : la phrase est à relire par CrOliX.
   - `adr/0013-methode-apres-audit.md`, qui remplace 0001 (lun-docs#109). Garde ce qui tient : lun-docs fait foi, le
     plugin, une place par information, le périmètre figé, seul CrOliX merge, publics sauf le core, les outils sans IA
     d'abord. Change : l'avancement dans la feuille de route, le Project fermé (audit du 08/11, Q8) ; *Show* et *Ask*
     (Q7) ; local et prod, la prod sur le desktop puis le serveur dédié (Q1, ADR 0012) ; le manager et dix agents par
     métier, aucun niveau ne choisit le modèle, Fable sur demande (Q9, lun-docs#163) ; la mesure de consommation et la
     décision d'achat qui en dépendait retirées. Chacun tient en 60 lignes, avec sa ligne « Statut : ».
   - `adr/0001-…` et `adr/0008-…` : « Statut : remplacée par 0013 » et « remplacée par 0012 », seule modification
     permise ; l'index de `adr/README.md` suit. Les numéros suivent l'ordre de fusion, s'il en vient un autre avant.
   - `environnements.md` : en tête et dans la table, la prod ensuite est le serveur dédié ; « Prod ensuite : le serveur
     dédié » (`:37-43`), les cinq étapes sans le NAS, et une ligne pour le NAS (les copies, selon le point 5) ;
     « Interdit » (`:47`) : « tests à faire une fois sur la prod ». `essentiel.md:33-35` : « le desktop pendant le
     rodage, le serveur dédié ensuite » et « à tester sur la prod ». `stack.md:51-55` : l'image récupérée par le
     serveur dédié (ADR 0012), sans le modèle du NAS ni le dossier de déploiement du core ; `stack.md:28` :
     « Bibliothèque (le satellite Lun'Avaritia) » (lun-docs#130).
   - Le plan de bascule : une note en tête, sans le réécrire : remplacé en partie par l'ADR 0012, il se refait quand le
     serveur s'achète ; le § 2, point 2 (les bases et leurs clés), et le § 3 restent la base de la prochaine version.
   - `npm run sync` (`essentiel.md` est recopié dans deux skills, `stack.md` et `environnements.md` non :
     `tools/standards-map.json`), puis `npm run check`, `npm run sync:check`.
   - Exclu : choisir la machine ; réécrire le plan de bascule ; la feuille de route (tâche 8).
3. - [ ] **La carte de ce qui tourne** (`docs/architecture-actuelle.md`). Après 2.
   - La date du jour de la PR (`:3`). `:16` « ses souvenirs » ; `:18` « la bibliothèque ». Les postes (`:24-33`) : le
     serveur dédié (la prod après le rodage, ADR 0012, rien n'y tourne encore) et le NAS (le stockage selon le point 5,
     rien n'y tourne). Les liaisons (`:50-51`) : le core relie un satellite par sa page d'autorisation et garde son
     jeton, chiffré, sans sa commande. Une section courte, « La cible » : les quatre lignes d'arrivée (lien vers le
     cadrage, § 4) et l'anatomie (lien vers le dictionnaire).
   - Preuve : `npm run check`. Exclu : décrire ce que fait le serveur dédié avant qu'il existe.
4. - [ ] **Le registre** (`registry.yaml`, `tools/check-registry.mjs`, `tools/check-registry.test.mjs`,
   `plugin/skills/lun-ecosysteme/SKILL.md`). *Parallélisable d'emblée.*
   - **[avis]** La recherche se retire, le champ ne se remplit pas : `SKILL.md:20-23` fait chercher le propriétaire
     dans le rôle et la description du registre, puis dans « Possède » et « Ne possède pas » du `CLAUDE.md` du projet ;
     `registry.yaml:15` ne cite plus `contrats`. Si CrOliX préfère le remplir : une valeur sur une ligne, sans liste, et
     l'en-tête dit la forme.
   - `checkRegistry` : deux projets de même `id`, ou de même `depot` (à la casse près, comme GitHub), sont une erreur
     qui les nomme. Une ligne sous `projets:` que le parseur ne lit pas, un élément plus indenté que le premier projet
     (une liste imbriquée) et un champ sans valeur sont une erreur qui donne le numéro de la ligne ; aucun projet
     fantôme.
   - Tests, écrits d'abord et vus rater : les deux doublons ; `contrats:` suivi de `- id: z` (une erreur à sa ligne, pas
     cinq champs manquants) ; un champ vide ; le registre d'aujourd'hui passe.
   - Exclu : un vrai parseur YAML, une dépendance ; changer ce que lit le site.
5. - [ ] **Ce qu'un dépôt public tait** (`standards/essentiel.md` § 2 et 6, `standards/securite.md`, `CLAUDE.md`,
   `plugin/agents/reviewer.md`, `tools/check-repo.mjs`, `tools/check-repo.test.mjs`, `tools/prive-gele.json`,
   `design/galerie/inventaire.ts`, `design/galerie/base.css`). Après 2 (le même `essentiel.md`).
   - La règle (« Ce qu'un dépôt public tait ») : une phrase dans `essentiel.md` § 6 (`:42-45`), une ligne dans
     `securite.md`, « Dépôts publics » (`:10-19`), qui dit ce que le contrôle cherche et ce qui reste à la relecture ;
     la ligne de `CLAUDE.md` (« Spécificités ») la renvoie là. `reviewer.md:15-16`, point 4 : « rien de l'intérieur
     d'un dépôt privé dans un dépôt public (chemin, table, commande, variable) ». `CLAUDE.md:10` « variables de
     design » (lun-docs#130).
   - `checkNoPrivatePaths(root, gel)` : les deux motifs de « Ce qu'un dépôt public tait » ; les dépôts privés lus dans
     `registry.yaml` à côté du script (`visibilite: prive`, le nom tiré de `depot`) ; un motif précédé d'un début de mot
     ou du nom de son propriétaire. Il saute les tests et les binaires comme le contrôle des adresses (`:105-110`) et
     rend `chemin:ligne`. Dans `runAll`, avec le gel ; sous `--public <dir>` : les adresses et les chemins, sans gel,
     et une dernière ligne qui nomme le dossier contrôlé. `--addresses` ne change pas. Un drapeau inconnu sort en
     erreur, avec son nom.
   - `tools/prive-gele.json` : `{ "<fichier>": <lignes touchées> }`, tiré de `main` au moment de la tâche (après la
     fusion de lun-docs#162 si elle a eu lieu), pour les plans et specs datés, la mise en service et le plan de bascule.
     La feuille de route n'y entre pas.
   - Les textes vivants : `inventaire.ts:154`, `:161`, le `fichier` d'un élément propre au core devient « dans le core,
     privé » (le test `design/galerie/galerie.test.ts:43-52` veut un `fichier` non vide et affiché : il l'est) ;
     `base.css:2`, « la base du core » sans chemin.
   - **Si CrOliX prend « Les plans à venir »** : `structure-projet.md:24`, `essentiel.md` § 2 (`:17`),
     `workflow.md:9-10` et `redacteur-plan.md:10-11` disent où vit la part du core. Après 1 (le même
     `structure-projet.md`).
   - Tests (`check-repo.test.mjs`), écrits d'abord et vus rater : un chemin d'un dossier du core, avec sa ligne ; un
     chemin écrit avec le nom d'un dépôt privé ; un lien d'issue ou de PR vers lui passe ; le nom seul passe ; un
     fichier de test est sauté ; un fichier gelé à son compte passe, à un de plus échoue ; un gelé à zéro doit sortir ;
     `--public` sur un dépôt temporaire échoue avec un chemin, passe sans, et nomme le dossier ; un drapeau inconnu
     échoue ; `--addresses` sur un dépôt qui a un chemin du core passe encore (la CI des dépôts privés).
   - Preuve : `npm test`, `npm run check`, `npm run sync:check` ; dans `design/` : `npm ci`, `npm run typecheck`,
     `npm test`, `npm run format:check`, `npm run build`.
   - Exclu : réécrire un plan daté ; chercher commandes, tables et variables par motif ; toucher Lun'Anima.
6. - [ ] **Les règles du plugin et des PR** (`plugin/skills/lun-livrer/SKILL.md`, `plugin/hooks/guard.mjs`,
   `standards/git.md`, `standards/essentiel.md` § 5, `templates/project/hooks/pre-push`). Après 5.
   - `SKILL.md:29-31` : « *Show* : dis à CrOliX que la PR est prête, avec son lien ; c'est lui qui la passe prête et la
     fusionne. » `guard.mjs:116` : le message dit d'ajouter `--draft`, puis de dire à CrOliX que la PR est prête une
     fois ses critères prouvés. `git.md:38-43` : CrOliX la passe prête. Le comportement du hook ne change pas.
   - La règle des PR de lun-docs, telle que CrOliX la tranche : `git.md:45-50` et l'exception dans `essentiel.md:39-40`.
   - lun-docs#41 : `templates/project/hooks/pre-push:2` dit « Refuse tout push vers main : passer par une branche et une
     PR. Dans un dépôt public, le ruleset le refuse aussi ; ce hook arrête l'erreur avant le réseau. » ; une ligne dans
     `git.md` : le premier push de `main` d'un dépôt neuf, fait par CrOliX avec `--no-verify`, avant de poser son
     ruleset (le hook de garde le refuse à l'agent).
   - Preuve : `npm test` (le test du hook ne change pas), `npm run sync`, `npm run check`, `npm run sync:check`.
   - Exclu : bloquer `gh pr ready` dans le hook ; borner les outils des agents (`tools:`).
7. - [ ] **Le design et les mots** (`standards/design.md`, `standards/notifications.md`, `README.md`,
   `docs/mise-en-service-desktop.md:133`). *Parallélisable d'emblée.*
   - `design.md:18` et `:31-32`, alignés sur `tokens.css:38-48` : l'accent d'Anima est `--anima`, distinct du rouge,
     avec son texte `--anima-texte` ; `--rouge` dit ce qu'il sert vraiment, d'après `tokens.css`.
   - **[avis]** lun-docs#136, la promesse retirée : `design.md:106` dit ce que `tokens.css` contient (couleurs, tons,
     rayons, ombres, polices, marques, cadre de focus) et que l'échelle typographique, les espacements, les hauteurs
     et le mouvement n'y sont pas encore. « Jetons » y devient « variables de design ».
   - lun-docs#130 : `notifications.md:26`, `:40`, `:43`, `:57` « la lettre du matin » ; `:44` « une question de la
     bibliothèque » ; `README.md:30` « Variables de design » ; la mise en service `:133` « La nuit tourne à 5 h ».
   - `README.md`, « Quoi fait foi » : deux lignes, ce qui tourne aujourd'hui (`docs/architecture-actuelle.md`) et
     l'état cible avec ses lignes d'arrivée (le cadrage).
   - Preuve : `npm run sync`, `npm run check`, `npm run sync:check`. Exclu : ajouter des variables à `tokens.css`.
8. - [ ] **La feuille de route** (`docs/plans/2026-11-07-feuille-de-route-mvp.md`, et l'en-tête des cinq plans à moitié
   cochés). En dernier dans lun-docs, après la fusion de lun-docs#162 (« Coordination »), partie de `main`.
   - § 1 (`:8-50`) récrit **par chantier** : une table « Chantier, plan, PR, état » de F à P, puis ceux du 10 au 12/11,
     chacun avec ses PR, toutes fusionnées au 12/11 sauf lun-docs#162 (rattachées par leur titre, à revoir par
     `gh pr view`) : les relevés de B1 (lun-luxuria#49, lun-docs#152) et la session du desktop complétée (#151) ;
     L (lun-luxuria#44) ; le premier mot (lun-anima#96, lun-docs#150) ; le tour de parole (lun-luxuria#51,
     lun-anima#99, lun-docs#153) ; la galerie du kit, paliers 1 et 2 (lun-docs#133, #138, #140, #142 ; copies
     lun-luxuria#46, #47, lun-anima#93, #94) ; le dictionnaire
     (lun-docs#131) ; l'état cible et les lignes d'arrivée (lun-docs#128, #148 ; OpenAmika #146, #149) ; l'écoute
     (lun-luxuria#54, #56 ; lun-docs#154, #155) ; la fin de phrase, arrêtée sur son verdict (lun-docs#156) ; la coupure
     qui reprend (lun-luxuria#58, lun-docs#157, #158) ; la phrase d'attente (lun-anima#102, lun-docs#159, #160) ; le
     manager et ses agents (lun-docs#163) ; le banc de présence (cadrage lun-docs#161 ; le déroulé lun-luxuria#61 et
     lun-anima#104 ; les scénarios #64 ; la chaîne #66 et lun-anima#106 ; les taux #76 ; plans lun-docs#162). Les
     deux paragraphes de #162 (11 et 12/11) entrent dans la table. Puis les décisions du 08/11 et du 12/11, en quelques
     lignes. Le tableau du 07/11 laisse la place à une ligne par ligne d'arrivée : points faits, partiels, manquants,
     tels que l'audit du 12/11 les lit (« lu, pas rejoué »).
   - § 2 : B1 (`:68`) « le verrou ne se lève qu'après le chantier des mots des gestes : cinq voix au banc, puis la
     règle ; aucune vraie carte avant » ; B2 (`:69`) « sur le desktop, à l'oreille » ; B8 (`:75`) « la porte du MVP » ;
     § D (`:89-103`) : « la bascule vers le serveur dédié (ADR 0012) » au lieu du NAS, lun-anima#72 sorti de D et de
     `:27-29`, `:98` sans les commandes du core.
   - § 3 : l'intro (`:107-108`) suit `workflow.md:9-14` (CrOliX valide par écrit) ; après P, l'ordre du 12/11, un
     sous-titre par chantier avec ses dépôts et son plan quand il existe : « tenir en continu » ; « écoute et
     parole » ; « remettre les textes d'accord » (ce plan) ; le banc (lun-luxuria#67 à #75) et les mots des gestes
     (lun-luxuria#6, ADR 0011) ; le premier contact sans terminal (lun-anima#72 ; son plan dira le reste, cadrage § 6,
     point 6) ; le desktop (§ 4) ; le rodage (B8), puis la bascule.
   - § 4 : `:282`, les agents de dev sont là depuis lun-docs#163 ; `:288`, `:291`, `:306`, `:319` disent ce qu'il faut
     lire sans la commande, les colonnes ni l'outil du core (« le temps du premier mot gardé par le core »).
   - § 5 (`:332-343`) : l'ordre remplace les dates ; restent la Black Week (ADR 0011) et le 31/12.
   - Les cinq plans à moitié cochés : une ligne en tête, ce qui reste et où il est passé (feuille § 4, ou clos) ;
     l'essai chronométré déclaré clos, son relevé étant lun-luxuria#9. Aucune case cochée à tort.
   - Preuve : `npm run check` ; chaque PR citée vue fusionnée. Exclu : la liste d'essais du § 4 au-delà des quatre
     lignes ; un index des plans.
9. - [ ] **Les preuves de lun-docs, la PR et les issues** (`livreur`). Après 1 à 8.
   - L'issue chapeau ouverte avant le premier push (« L'issue chapeau ») ; la PR en brouillon au gabarit ; la relecture
     du diff par le `reviewer` ; les barrières de la tâche 5.
   - La PR ferme lun-docs#109, #136 et #41 ; elle commente lun-docs#130 avec ce qui reste (Lun'Anima).

### Lun'Luxuria (`dev-luxuria`, branche `fix/surface-publique`)

10. - [ ] **Les dossiers choisis par la personne** (`src-tauri/src/body.rs`, `voice.rs`, un module des dossiers
    gardés, `lib.rs`, `src/desktop/corps.svelte.ts`, `DossierCorps.svelte`, `ServiceVoix.svelte`, `voix.ts`,
    `src/settings.ts`, leurs tests, `CLAUDE.md:31`). *Parallélisable d'emblée.*
    - Comme `programs.rs` : `folder_pick(name)`, le nom pris dans une liste fixe (`corps`, `voix`) ; la boîte du système
      modale à la fenêtre (`blocking_pick_folder`) ; le dossier vérifié avant d'être gardé (`corps` : `corps.json`
      lisible par `body::config` ; `voix` : `voice::checked_dir`) ; gardé dans `dossiers.json` du dossier de config ;
      `folder_paths()` pour l'écran ; `folder_forget(name)`.
    - `body_config()`, `body_image(name)`, `voice_start(args)` et `voice_restart(args)` ne prennent plus de dossier :
      ils lisent celui qui est gardé. Aucun : « Aucun dossier choisi », et pour le corps le souffle, comme aujourd'hui
      (`corps.svelte.ts:75`).
    - La page : chaque champ texte devient le chemin affiché, « Choisir… » et « Oublier », comme le choix d'un
      programme (`voix.ts:274-277`, testé par `reglages.test.ts:303-317`). `body.folder` et `voice.service.folder`
      sortent des réglages (`settings.ts:46-47`, `:63`, `:104`, `:121`, `:171`) ; `missing()` (`voix.ts:30`) lit
      `folder_paths`. Un réglage enregistré qui porte encore un dossier est ignoré : après la mise à jour, la personne
      choisit ses deux dossiers une fois, et l'écran le dit.
    - Tests Rust, comme ceux de `programs.rs` : garder, relire, oublier ; un nom hors liste refusé ; `voix` sans
      `service.py` refusé avant d'être gardé ; un dossier gardé puis effacé du disque rend l'erreur d'aujourd'hui.
      Tests de la page : `corps.test.ts`, `corps.svelte.test.ts` et `voix.test.ts` sans dossier dans les appels ; le
      choix et l'oubli depuis l'écran.
    - `CLAUDE.md:31` : le dossier du corps et celui du service, choisis dans la boîte du système et gardés côté Rust.
    - Exclu : les arguments du service, le chemin de la voix compris ; `program_*` ; ce que fait `service.py`.
11. - [ ] **Les hôtes du réseau** (`src-tauri/capabilities/default.json`, un module des hôtes gardés, `lib.rs`,
    `src/desktop/net.ts`, `net.test.ts`, `CLAUDE.md:35-36`). Après 10 (le même `lib.rs`).
    - `default.json:8-24` : la portée de `http:default` ne garde que la boucle locale (`127.0.0.1`, `localhost`,
      `[::1]`, avec ou sans port, en http et https).
    - **[avis]** `net_allow(url)` réduit l'adresse à son origine (schéma, hôte, port) ; refuse un autre schéma que
      http(s) et une adresse qui porte des identifiants. Une origine non gardée ouvre une boîte du système modale à la
      fenêtre, qui la nomme. Acceptée : gardée dans `hotes.json` du dossier de config, et ajoutée par
      `app.add_capability` (une capacité `http:default` pour la fenêtre `main`, sa seule origine). Au lancement, chaque
      origine gardée est ajoutée de nouveau, dans `setup` (`lib.rs:28`). Refusée : `false`, rien de gardé.
    - La page : `routes().server` (`net.ts:18-33`) demande `net_allow` une fois par origine hors de la boucle locale,
      avant le premier appel ; la promesse est gardée, une seule boîte s'ouvre ; un refus fait échouer l'appel sans
      l'envoyer, avec « Adresse non autorisée ». Rien ne change pour la boucle locale ni pour le service voix.
      `src/session.svelte.ts` n'est pas touché (« écoute et parole » y travaille).
    - Tests Rust : l'origine tirée d'une adresse (chemin retiré, port gardé, schéma et identifiants refusés) ; garder et
      relire `hotes.json` ; `default.json`, lu par `include_str!`, ne nomme que la boucle locale. Tests de
      la page : une origine distante demandée une seule fois pour deux appels simultanés ; aucune demande pour la boucle
      locale ; un refus rejette l'appel sans fetch.
    - `CLAUDE.md:35-36` : la boucle locale permise, tout autre hôte confirmé par la personne et gardé côté Rust.
    - Exclu : la CSP ; oublier une origine ; `program_start` et l'adresse qu'il sonde.
12. - [ ] **Les textes publics, les modèles et la CI** (`CLAUDE.md:50-70`, `docs/README.md:22-23`,
    `src/presence/chaine.test.ts:41`, `:547`, `:577`, `hooks/pre-push:2`, `.github/workflows/ci.yml`,
    `.github/dependabot.yml`). *Parallélisable d'emblée.*
    - `CLAUDE.md:53` et `chaine.test.ts:41`, `:547`, `:577` : « le serveur de la chaîne (un serveur compatible sur un
      faux modèle), lancé avant » ; dans l'écosystème, le core le fournit ; sans sa commande. `docs/README.md:22-23` :
      « Dans l'écosystème Lun', c'est le core, qui donne le code d'appairage », sans commande ni variable.
      `hooks/pre-push:2` : le commentaire du gabarit (tâche 6).
    - La règle des modèles, une ligne dans « Spécificités » : aucun son ; un modèle seulement s'il est petit, libre,
      nécessaire à l'app et tracé par son `SOURCE.md` ; aujourd'hui `src/listen/silero/silero_vad.onnx` seul.
    - `ci.yml:47-51`, le pas des sons devient celui des sons et des modèles : il refuse un son, comme aujourd'hui ; un
      fichier suivi d'extension onnx, ort, pt, pth, ckpt, safetensors, gguf, ggml, tflite, pb, h5 ou bin, autre que
      `silero_vad.onnx` ; et celui-ci si son SHA-256 n'est pas celui de `SOURCE.md:3`. Preuve : le pas rejoué en local,
      dans une copie jetable du dépôt, avec un `.onnx` en plus puis un octet changé ; la sortie dans la PR.
    - Si CrOliX prend les SHA : chaque `uses:` (`ci.yml:15-16`, `:46`, `:52`, `:66-67`, `:72`) par son SHA, l'étiquette
      en commentaire ; `.github/dependabot.yml` (`github-actions`, une fois par mois, groupé).
    - Après la fusion de la PR de lun-docs : un pas `check-repo.mjs --public .` après celui des adresses (`:26-29`) ; la
      CI montre la ligne qui nomme le dossier contrôlé.
    - Exclu : le reste de `src/` ; `npm audit`.

### Lun'Acedia et Lun'Avaritia (`dev-front`, branche `chore/surface-publique` dans chacun)

13. - [ ] **Lun'Acedia.** *Parallélisable d'emblée.* `hooks/pre-push:2` (tâche 6). Si CrOliX prend les SHA :
    `ci.yml:15-16`, `:45`, `release.yml:17`, `:25-31`, et `.github/dependabot.yml`. Après la fusion de lun-docs : le pas
    `--public .` (`ci.yml:26-29`). Preuve : la CI verte, avec la ligne du dossier contrôlé. Exclu : la doc, conforme.
14. - [ ] **Lun'Avaritia.** *Parallélisable d'emblée.*
    - `docs/prouver-avaritia.md:64-65` : « Dans le core, relier le satellite avec son adresse et ce code », sans la
      commande. `CLAUDE.md:9` : « satellite « bibliothèque » » ; `README.md:79` : « satellite, la bibliothèque » ;
      `CLAUDE.md:13` : « les souvenirs de Natsume » au lieu de « la mémoire affective et personnelle » (lun-docs#130).
    - `hooks/pre-push:2`, les SHA et le pas `--public`, comme la tâche 13.
    - Exclu : le code (`brain` reste) ; le libellé d'icône « Cerveau » (« Constats écartés »).
15. - [ ] **Les preuves de Lun'Luxuria, et les PR des satellites** (`livreur`, puis CrOliX). Après 10 à 14 et la fusion
    de lun-docs.
    - Lun'Luxuria : `npm run format:check`, `lint`, `typecheck`, `test`, `build` ; `cargo fmt --check`,
      `cargo clippy --all-targets -- -D warnings`, `cargo test`. L'exe construit sur le laptop, lancé depuis
      l'Explorateur (lancé par Claude, il écrit ailleurs). La preuve de CrOliX : choisir les deux dossiers, relancer,
      ils restent ; le corps s'affiche, le service part ; en « Seul » avec un modèle distant en https, la boîte s'ouvre
      une fois ; refusée, le message ; relié au core local, aucune boîte.
    - L'issue de Lun'Luxuria ouverte avant le premier push ; les PR des satellites renvoient à la chapeau ; relecture
      du diff par le `reviewer` dans chaque dépôt. Ordre de fusion : lun-docs, puis les trois autres.

## Coordination

- **lun-docs#162** ajoute deux paragraphes après la ligne 23 de la feuille et change son § 4 (`:313-316`). La tâche 8
  récrit les § 1 à 3 : elle part après la fusion de #162, depuis `main`. **[avis]** CrOliX fusionne #162 maintenant :
  ses quatre plans sont exécutés et cochés, seule la toux attend ses prises, et elle peut aller dans la PR suivante. Si
  #162 n'est pas fusionnée quand la tâche 8 est prête : la tâche 8 reprend ses deux paragraphes dans sa table, et la
  PR #162 retire sa part de la feuille avant de fusionner. Le gel de la tâche 5 compte les trois plans de #162 s'ils
  sont sur `main` ; sinon la CI de #162 échouera après la fusion de ce chantier.
- **« Tenir en continu »** (`wt\continu-docs`, `docs/tenir-en-continu`) écrit son plan en ce moment, et il touchera le
  core. S'il arrive sur `main` après le contrôle de la tâche 5 avec des chemins du core, sa CI échoue. À régler avant
  l'une ou l'autre fusion : son plan suit la règle dès maintenant (« Les plans à venir »), ou il fusionne avant et le
  gel le compte. Il n'écrit pas dans les § 1 à 3 de la feuille : la tâche 8 y met sa ligne.
- **« Écoute et parole »** touche `lun-luxuria/src`, hors de `src/desktop/`. Les tâches 10 à 12 touchent `src-tauri/`,
  `src/desktop/`, `src/settings.ts` (deux champs), `src/presence/chaine.test.ts` (trois textes), le `CLAUDE.md`,
  `docs/README.md`, `hooks/` et `ci.yml`. Fichiers communs possibles : `settings.ts`, `chaine.test.ts`, `CLAUDE.md`.
  Le second à fusionner reprend la branche sur `main` ; aucun des deux ne reformate ces fichiers.
- **La maquette non suivie** `docs/maquettes/2026-10-30-apps-core/04-accueil-v2.html` reste à CrOliX. Le contrôle la
  lit en local (fichier non suivi) ; elle n'a aucun chemin du core.

## Hors périmètre

- Lun'Anima, dépôt privé : sa part de lun-docs#130, ses actions, ses textes, ses plans.
- Réécrire `vision.md` (lun-docs#127, cadrage § 8, point 4) ; la première marche de la présence.
- Le secret scanning, la push protection et les alertes Dependabot : des réglages de dépôt, à CrOliX (synthèse de
  l'audit, décision 7). L'adresse Gmail de `docs/maquettes/2026-10-21-recadrage-front/10-composants-b.html:458` (audit
  de lun-docs, constat 5).
- Jeter `feat/fin-de-phrase` et son worktree, fermer lun-docs#61, annuler les deux runs bloqués, la branche
  `docs/axe-dev-cadrage` : des décisions de CrOliX (synthèse, décision 7).
- Le kit et ses cartes (lun-docs#43, #124, #134, #135, #143, #144) ; les cas limites de `tools/` (audit, constat 13),
  sauf le drapeau inconnu ; les outils des agents (`tools:`) ; les copies des standards dans les skills (constat 15).
- Réécrire le plan de bascule et déplacer la mise en service dans le dépôt du core : à la bascule.
- Un index de l'état des 60 plans ; un état pour les specs.
- Dans Lun'Luxuria : les arguments du service voix, venus de la page ; l'adresse que `program_start` sonde ; oublier un
  hôte ; `npm audit`.
- Ouvrir les issues : ce plan dit lesquelles.

## Limites

- Le gel compte des lignes : un chemin ajouté dans un fichier gelé passe si un autre en sort le même jour. Les plans
  datés ne bougent plus guère, seule une note d'en-tête y entre.
- Le contrôle voit les chemins, pas les commandes, les colonnes ni les variables : ceux-là tiennent à la relecture.
  L'historique de git garde ce qui a déjà été publié.
- Une origine permise pendant l'exécution le reste jusqu'à la fermeture de l'appli : Tauri 2.12.5 n'a pas de fonction
  qui retire une capacité (lue dans ses sources, pas essayée).
- Une boîte de dialogue ne se clique pas par un agent : la preuve de la tâche 15 attend CrOliX, sur le laptop. Un exe
  lancé depuis Claude écrit ses réglages ailleurs : il se lance depuis l'Explorateur.
- Un SHA sans Dependabot vieillit. Dependabot ajoute des PR, une fois par mois.
- La raison du serveur dédié (des modèles légers en local) vient de la mémoire de la session, pas d'un texte du dépôt.
- L'état des lignes d'arrivée vient de l'audit, qui l'a lu sans rien rejouer.
- Non vérifié : que `D:` existe toujours sur le desktop ; la syntaxe exacte de la portée de plugin-http pour `[::1]`
  et pour un port (le développeur l'essaie dans un test) ; que le site ne lise du registre que ce que son code montre
  (une recherche, pas une lecture de son build) ; le rattachement de chaque PR à son chantier, fait par son titre.
- Les numéros de ligne sont ceux des `main` du 12/11.

## L'issue chapeau

Dans lun-docs : « Remettre les textes d'accord : la doc, les règles et la surface publique », `niveau:standard`, sans
`inbox`. Son corps : le lien de ce plan ; les sept décisions du 12/11 ; ce qu'elle ferme (lun-docs#109, #136, #41) et
ce qu'elle traite en partie (lun-docs#130) ; une ligne par PR. Dans Lun'Luxuria : « L'IPC de la fenêtre et les hôtes
du réseau, choisis par la personne », `niveau:critique`, que sa PR ferme. Les PR de Lun'Acedia et de Lun'Avaritia
renvoient à la chapeau.

## À trancher par CrOliX

1. **Le plan entier.** Je recommande de le valider : chaque constat y est relu dans son fichier, et chaque tâche a son
   brief.
2. **Ce qu'un dépôt public tait.** Je recommande la règle de « Ce qu'un dépôt public tait » : le nom, le rôle, les
   issues et PR, le contrat public et l'adresse locale, oui ; chemins, tables, commandes, variables et déploiement,
   non. L'autre voie, celle de l'audit : tolérer les noms de fichiers, refuser schéma et secrets.
3. **L'existant.** Je recommande le gel par compte : l'historique garde tout, la réécriture ne retire rien. Les autres
   voies : récrire les 42 fichiers (un gros chantier) ; les déplacer dans le dépôt du core (ils quittent l'arbre, pas
   l'historique, et les liens de la feuille cassent).
4. **Les plans à venir.** Je recommande que la part du core d'un plan vive dans le dépôt du core. L'autre voie : le plan
   reste dans lun-docs et décrit le core par ce qu'il fait, sans chemin ; les développeurs y perdent leurs
   `chemin:ligne`.
5. **Le NAS au stockage.** Je recommande : les copies et les fichiers, aucune base. L'autre voie : les bases sur le NAS,
   que SQLite sur un partage réseau rend fragiles.
6. **Le registre.** Je recommande de retirer la recherche de `contrats` du skill. L'autre voie : remplir le champ, une
   valeur par ligne ; la propriété serait alors écrite deux fois.
7. **lun-docs#136.** Je recommande de retirer la promesse de `design.md`. L'autre voie : ajouter l'échelle, les
   espacements, les hauteurs et le mouvement à `tokens.css`, qui touche le kit et les cinq apps.
8. **L'hôte de Lun'Luxuria.** Je recommande la boîte du système par origine. L'autre voie : Rust ajoute l'hôte que la
   page règle, sans boîte ; plus simple, elle ne borne rien contre une page compromise.
9. **Les actions.** Je recommande les SHA et Dependabot dans les quatre dépôts publics. L'autre voie : les étiquettes,
   telles quelles.
10. **Les PR de lun-docs.** Je recommande une PR par plan (« La règle des PR de lun-docs »). Les autres voies : le plan
    validé fusionné seul dès le « validé », puis ses coches dans la PR de l'axe (deux PR par plan) ; ou la règle
    d'aujourd'hui, avec « un palier = un plan » écrit.
11. **lun-docs#162.** Je recommande de la fusionner maintenant, avant la tâche 8 (« Coordination »).
12. **Le hook `pre-push` des dépôts publics** (lun-docs#41). Je recommande de le garder, avec un commentaire juste.
    L'autre voie : le retirer des dépôts publics, que le ruleset protège déjà.
13. **Le dossier de service sur `D:`** : je le laisse tel quel, chemin du desktop. À confirmer quand CrOliX y est.
