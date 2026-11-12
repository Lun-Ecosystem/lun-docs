# Remettre les textes d'accord : la doc, les règles et la surface publique. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Version 2**, après le plan-challenger (« à amender ») ; ce qui a changé est en fin de plan. **À valider par
> CrOliX.** Les choix marqués **[avis]** se tranchent à la fin (« À trancher par CrOliX ») ; le texte de l'ADR 0012
> se valide avant la tâche 2.
>
> **PR :** une par dépôt touché, en brouillon dès le premier push, *Show* partout. Celle de lun-docs fusionne la
> première : la CI des trois satellites clone `main` de lun-docs pour lancer `check-repo.mjs --public`. Lun'Anima
> n'est pas touché.

**But :** que les textes disent ce qui est décidé et ce que le code fait, que deux règles ne se contredisent plus, et
qu'un dépôt public ne décrive plus l'intérieur d'un dépôt privé. Trois morceaux. **Les textes** : les décisions du
12/11 écrites là où elles font foi, la feuille de route et la carte de ce qui tourne justes, le serveur dédié dans les
normes. **Les règles** : le registre, le plugin, la règle des PR de lun-docs. **La surface publique** : une règle et un
contrôle pour ce qu'un dépôt public tait, et le `CLAUDE.md` de Lun'Luxuria qui dit ce que fait son IPC.

**Ce que ce chantier règle.** L'audit du 12/11 trouve deux définitions du MVP ; une feuille de route qui dit « en
attente » ce qui est fusionné ; des normes qui disent le NAS quand CrOliX vise un serveur dédié ; un skill qui lit un
champ que le registre n'a pas ; deux règles du plugin qui se contredisent sur `gh pr ready` ; des chemins du core dans
le dépôt public ; un `CLAUDE.md` qui dit l'IPC de la fenêtre « borné » quand la page choisit encore des dossiers, des
arguments et des hôtes.

**Ce qui en sort.** L'IPC de Lun'Luxuria devient un chantier `critique` à part : son issue est écrite, hors dépôt, et
sa première tâche est un test qui prouve le mécanisme (« Hors périmètre »). Ici, la PR de Lun'Luxuria ne porte que des
textes et sa CI.

**Source :**

- L'audit du 12/11, hors dépôt : la synthèse (« Décisions qui reviennent à CrOliX », « 3. Les textes d'accord et la
  surface publique ») et le rapport de lun-docs (constats 1 à 9, 11 ; issues #41, #109, #130, #136). Chaque constat
  repris ici a été relu dans son fichier. Ce qui n'a pas tenu est sous « Constats écartés ».
- Les décisions du 12/11. **CrOliX les a validées le 12/11 en répondant « ok je valide » à la liste que le manager lui
  avait écrite ; le texte exact est recopié dans l'issue chapeau** (« L'issue chapeau »). Elles disent :
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
  `1ae4457`, lun-avaritia `424c4ec`. Les sources de tauri 2.12.5, tauri-plugin-http 2.8.3 et tauri-plugin-dialog
  2.8.4, dans le cache de Cargo du laptop, pour l'issue de l'IPC. Les PR lun-docs#162 et le plan « tenir en continu »
  (`wt\continu-docs`, `a505e63`), lus pour ce qu'ils touchent ici.

**Critères de fin :**

- Les sept décisions sont écrites là où elles font foi : le cadrage de l'état cible (1, 4, 6), la feuille de route
  (1, 2, 3, 6, 7), l'ADR 0012 et `environnements.md` (4), `structure-projet.md`, le `CLAUDE.md` de Lun'Luxuria et
  `check-repo.mjs --public` (5), le dictionnaire (le MVP, le serveur dédié, le NAS).
- Les ADR 0001 et 0008 sont « remplacée par » 0013 et 0012 ; le texte de 0012 est celui que CrOliX a validé ;
  lun-docs#109 est fermée. Aucun texte normatif ne dit plus que la prod ira sur le NAS : la PR porte la recherche
  (« Les preuves »), et chaque occurrence restante y est justifiée.
- La feuille de route ne dit plus rien de faux (lun-luxuria#44 vu par `gh pr view`, P, les agents de dev, l'autonomie,
  le NAS, lun-anima#72, B1, B2, B8, le calendrier, les commandes et colonnes du core) et porte l'ordre du 12/11.
  `architecture-actuelle.md` est datée du jour de la PR et suit le dictionnaire.
- `npm run check` échoue sur deux projets de même `id` ou de même `depot`, sur une liste imbriquée et sur une valeur
  vide du registre ; le skill `lun-ecosysteme` ne cherche plus un champ absent.
- `lun-livrer`, le message du hook de garde et le livreur disent la même chose de `gh pr ready` : la PR porte la
  recherche, chaque occurrence restante justifiée. La règle des PR de lun-docs est celle que CrOliX a tranchée, écrite
  pareil dans tous les textes qui la portent.
- La règle « ce qu'un dépôt public tait » est dans `essentiel.md` § 6 et `securite.md`, avec la ligne sur la part du
  core d'un plan. `check-repo.mjs --public` échoue sur un chemin écrit avec le nom d'un dépôt privé, sur un son et sur
  un modèle sans `SOURCE.md` voisin qui porte son SHA-256 ; `npm run check` aussi, avec les dossiers du core écrits
  seuls ; un drapeau inconnu fait échouer le script ; `npm test` le prouve. `--public` remplace `--addresses` dans la
  CI des trois satellites et s'y lance en local. Le `reviewer` a la règle.
- Les textes vivants des quatre dépôts publics sont conformes. Le `CLAUDE.md` de Lun'Luxuria dit ce que fait l'IPC : la
  défense en profondeur et la liste des sorties qui restent, avec le lien de l'issue `critique`.
- lun-docs#41 et #136 fermées ; lun-docs#130 faite pour lun-docs et les satellites publics, laissée ouverte pour le
  reste, avec un commentaire qui le dit.
- Les barrières de chaque dépôt sont vertes ; celles de `design/` aussi, pour la galerie touchée.

| Dépôt, branche | Issue | PR | Niveau |
|---|---|---|---|
| `lun-docs`, `docs/textes-d-accord` | la chapeau, à ouvrir ; #109, #130 en partie, #136, #41 | à ouvrir | `standard` |
| `lun-luxuria`, `chore/surface-publique` | la chapeau | à ouvrir | `trivial` |
| `lun-acedia`, `chore/surface-publique` | la chapeau | à ouvrir | `trivial` |
| `lun-avaritia`, `chore/surface-publique` | la chapeau ; #130 en partie | à ouvrir | `trivial` |

**Les agents.** Les textes des quatre dépôts et `check-repo.mjs` : la session principale, ou `dev-front`. Le métier de
`dev-front` est le kit et les écrans ; il est pris ici parce qu'il connaît `tools/` et `design/` de lun-docs, et
qu'aucun spécialiste ne tient la doc. Aucun code d'appli n'est touché : ni `dev-luxuria` ni `dev-core`. Le `reviewer`
relit chaque diff, le `livreur` pousse.

## Ce que le code fait aujourd'hui

### lun-docs : les textes

- **Deux définitions du MVP.** La feuille de route fait de la semaine de rodage une porte :
  `docs/plans/2026-11-07-feuille-de-route-mvp.md:46` (J5), `:75` (B8), `:330`. Le cadrage
  `docs/specs/2026-11-10-etat-cible-cadrage.md:45-48` propose d'en faire le premier chantier de la révision
  (**[avis Claude]**), `:141` la range dans la révision (§ 6, point 1), `:164` laisse la question ouverte (§ 8,
  point 3), et `:167` clôt la feuille sans dire quand.
- **Le premier appareil sans terminal.** Le cadrage le range dans « Mis de côté » d'Anima (`:79`, avec « le NAS ») et
  le veut dans sa ligne d'arrivée (§ 4.2, point 7). La feuille le sort du MVP (`:27-29`) et le met après (`:98`).
- **La feuille dit faux.** L y attend « la recette du desktop », en brouillon (`:15-16`, `:23`) : lun-luxuria#44 est
  fusionnée. P est « en brouillon jusqu'à la fusion de lun-docs#123 » (`:22`), fusionnée le 09/11. Les agents de dev y
  sont « retirés depuis lun-docs#108 » (`:282`) ; ils existent depuis lun-docs#163 (`plugin/agents/dev-*.md`,
  `standards/workflow.md:44-58`). `:107-108` fait partir un plan après le plan-challenger, quand
  `standards/workflow.md:9-14` attend le « validé » écrit de CrOliX. Le calendrier (`:338-343`) est passé. Les
  chantiers du 10 au 12/11 n'ont de trace que dans la liste d'essais du § 4 (`:297-320`). `:98`, `:288`, `:291`,
  `:306` et `:319` citent des commandes, des colonnes et un outil du core.
- **La barre de confiance et la langue.** B1 : « le verrou reste à CrOliX » (`:68`) ; B2 : « à l'oreille » (`:69`).
  `adr/0011-chaine-vocale-mvp.md:26-29` interdit une vraie carte à la voix tant que la transcription ne rend pas une
  confiance réelle, et laisse la langue ouverte. Il ne contredit pas les décisions 2 et 3 : la feuille dit la suite.
- **Le NAS dans les normes.** `standards/environnements.md:3-4`, `:10`, `:37-43`, `:47` ;
  `standards/essentiel.md:33-35` ; `standards/stack.md:51-55` (le NAS, son modèle, et le dossier de déploiement du
  core) ; `docs/architecture-actuelle.md:33` ; `adr/0008-acces-exterieur.md:8`, `:15` (« Tout tourne sur le NAS ») ;
  `adr/0001-referentiel-et-methode.md:22` ; la feuille `:91-92` ; tout `docs/plans/2026-11-08-bascule-nas.md`. Seul le
  cadrage (`:145`) dit le serveur dédié.
- **L'ADR 0001** (lun-docs#109) : un seul GitHub Projects (`:19`, fermé depuis le 09/11), la prod sur le NAS (`:22`),
  le modèle par niveau et une décision d'achat après mesure (`:24-25`). `workflow.md:42` : aucun niveau ne choisit le
  modèle. `adr/README.md:9-13` : un ADR accepté ne se modifie pas ; le suivant le remplace, et l'ancien passe à
  « remplacée par NNNN ». `tools/check-registry.mjs:49-62` vérifie cette ligne et les 60 lignes.
- **La carte de ce qui tourne.** `docs/architecture-actuelle.md:3` est « au 08/11/2026 ». `:16` dit « sa mémoire » et
  `:18` « le savoir », là où le dictionnaire dit les souvenirs et la bibliothèque. `:33` met le NAS après le rodage.
  `:50-51` donne une commande du core.
- **Le dictionnaire.** `standards/dictionnaire.md:92` définit le MVP sans sa porte. Aucun mot pour le serveur dédié ni
  pour le NAS, alors qu'un mot qui porte une décision s'y ajoute avant de s'écrire ailleurs (`:4-5`).
- **Les modèles.** Aucune norme ne dit si un modèle entre dans un dépôt. Les ADR 0010 (`:22`) et 0011 (`:25`) gardent
  le modèle de voix hors des dépôts. `standards/structure-projet.md:19-28` liste ce qui n'a pas sa place dans un dépôt,
  sans les sons ni les modèles.
- **Le design** (lun-docs#136). `standards/design.md:18` fait de `--rouge` l'accent d'Anima, et `:31-32` dit que
  `--accent-texte` y reprend `--texte`. `design/tokens.css:38-48` donne à Anima `--anima`, distinct du rouge, et
  `--anima-texte`. `design.md:106` promet une échelle typographique, des espacements, des hauteurs et le mouvement :
  `tokens.css` (73 lignes) n'en a aucun.
- **Le vocabulaire** (lun-docs#130, la part de lun-docs). « Cerveau » pour Avaritia : `standards/stack.md:28`,
  `standards/notifications.md:44`. « Le point du matin » : `notifications.md:26`, `:40`, `:43`, `:57`. « Jetons de
  design » : `CLAUDE.md:10`, `README.md:30`. `vision.md` attend sa réécriture (lun-docs#127). « La veille de nuit »
  (`docs/mise-en-service-desktop.md:133`) revient à « tenir en continu » (« Coordination »).
- **Ce qui fait foi.** `README.md:18-36` ne renvoie ni à `architecture-actuelle.md` ni au cadrage de l'état cible.

### lun-docs : le registre, le plugin, la règle des PR

- **Le registre.** `registry.yaml:15` annonce un champ optionnel `contrats` ; aucun projet ne l'a. Le skill
  `plugin/skills/lun-ecosysteme/SKILL.md:20-23` fait chercher le propriétaire d'une fonction « dans le registre, champ
  `contrats` » : la recherche ne trouve rien. Le site ne lit pas ce champ (cherché dans son dépôt local). La propriété
  est déjà écrite ailleurs : « Possède » et « Ne possède pas » dans le `CLAUDE.md` de chaque projet,
  `architecture-actuelle.md:13-20`.
- `tools/check-registry.mjs:13-29` (`parseProjects`, non exporté) lit une liste plate, ligne à ligne ; `:33-47` ne
  vérifie l'unicité ni de `id` ni de `depot`. Une liste imbriquée sous un projet crée un projet fantôme (essai de
  l'audit). Le site lit ce fichier à son build.
- **Le site.** `registry.yaml:34` : `CrOliX-AltF4/website`, privé ; `gh repo view` donne le même propriétaire.
  `docs/plans/2026-10-19-j0-socle.md:3` lie `Lun-Ecosystem/website`, l'ancien : un plan daté, laissé.
  `standards/securite.md:12` dit « Tout est public sauf le core » : le site est privé aussi.
- **`gh pr ready`.** `plugin/skills/lun-livrer/SKILL.md:29-31` le fait lancer en *Show* ; le message du hook de garde
  aussi (`plugin/hooks/guard.mjs:116`). `plugin/agents/livreur.md:19` l'interdit (« tu dis qu'elle l'est »), et le mode
  auto le refuse. `standards/git.md:38-42` dit qu'elle « passe prête » sans dire qui. `guard.test.mjs:114` range
  `gh pr ready 3` parmi les commandes permises : seul le message change.
- **La règle des PR de lun-docs** tient dans cinq textes : `standards/git.md:44-47` (une PR par axe),
  `plugin/skills/lun-livrer/SKILL.md:17-19`, `plugin/agents/livreur.md:12-13` et `:17-18`,
  `plugin/skills/lun-chantier/SKILL.md:20`, plus la copie générée `plugin/skills/lun-livrer/references/git.md`.
  `standards/essentiel.md:39-40` dit une PR par chantier, sans l'exception. La règle par axe date de lun-docs#163, le
  11/11, après celle du 07/11 (plans et coches dans une seule PR) ; lun-docs#162 porte 28 commits et quatre plans hors
  de `main`.
- **Le hook `pre-push`** (lun-docs#41). `templates/project/hooks/pre-push:2` dit « Core privé : refuse tout push vers
  main (pas de protection de branche sans GitHub Pro) », recopié tel quel dans les trois satellites publics, qui ont le
  ruleset (`git.md:59-62`). Le premier push d'un dépôt neuf n'est dit nulle part.

### lun-docs : ce que le dépôt public dit du privé

- La règle existe dans `CLAUDE.md` (« Spécificités ») seulement : « rien des dépôts privés au-delà de leur nom ».
  `essentiel.md` § 6 (`:42-45`) et `securite.md:10-19` ne parlent que des secrets, des adresses et des données.
- Sur `main`, les chemins des dossiers source du core sont dans 38 plans et specs datés, la mise en service et le plan
  de bascule. Hors de ces fichiers, la règle de la tâche 5, rejouée à blanc sur les quatre dépôts publics (un script
  jetable, hors dépôt), ne trouve que `design/galerie/inventaire.ts:154`, `:161` et `design/galerie/base.css:2`.
  S'ajoutent, sans chemin, des commandes et des colonnes : la feuille (`:98` à `:319`),
  `architecture-actuelle.md:50-51`, le dossier de déploiement de `stack.md:52`.
- `tools/check-repo.mjs:89-127` ne cherche que les adresses ; `:113` saute une ligne marquée `allow-address`, relue à
  la main. `--addresses <dir>` (`:144-155`) est lancé par la CI des trois satellites (`ci.yml:26-29`) et par celle des
  deux dépôts privés. Un drapeau inconnu n'est pas refusé : sans `--addresses`, le script contrôle lun-docs lui-même et
  passe, quel que soit le dossier donné. `listFiles` (`:50-60`) lit les fichiers suivis et les non suivis non ignorés.

### Lun'Luxuria

- **Ce que dit le `CLAUDE.md`.** `:31` : « lire le dossier du corps (borné à ce dossier) » ; `:35-36` : « serveur et
  modèle par plugin-http ». La lecture est bornée au dossier (`src-tauri/src/body.rs:17-61`) ; les programmes sont
  choisis par la personne dans la boîte du système et gardés côté Rust (`src-tauri/src/programs.rs:209-235`) ; la CSP
  est serrée (`tauri.conf.json:24`) ; aucun sink HTML. Mais la page donne encore le dossier du corps
  (`body.rs:75-83`), celui du service voix et ses arguments (`voice.rs:35-46`, `:219-241`), les arguments et
  l'adresse des programmes (`programs.rs:93-97`, `:244-256`), et plugin-http admet tout hôte
  (`capabilities/default.json:8-24`), un proxy venu de la page et les redirections sans contrôle. Le détail, avec
  ses lignes, est dans le corps de l'issue `critique` (« Hors périmètre »).
- **Le privé dans le public.** `CLAUDE.md:52-53` (une commande du core), `docs/README.md:22-23` (une commande et une
  variable du core), `src/presence/chaine.test.ts:41`, `:547`, `:577` (la même commande, en commentaire et dans deux
  messages d'erreur), `hooks/pre-push:2` (« Core privé »). Le nom seul (`docs/essai-2026-11-07.md:125`) est permis.
- **Les modèles.** `src/listen/silero/silero_vad.onnx` est le seul fichier de modèle suivi (`git ls-files`, extensions
  onnx, ort, pt, pth, ckpt, safetensors, gguf, tflite, bin). `src/listen/silero/SOURCE.md:3-5` donne sa taille, son
  SHA-256, sa source, sa version et sa licence (MIT). La CI ne refuse que les sons (`.github/workflows/ci.yml:47-51`).

### Lun'Acedia et Lun'Avaritia

- **Lun'Acedia** nomme Lun'Anima et le contrat public (`CLAUDE.md:12`, `README.md:65`, `:84`, `docs/pina.md:32-34`) ;
  son `pair-code` est le sien (`README.md:56`). Conforme, hors `hooks/pre-push:2`.
- **Lun'Avaritia** : `docs/prouver-avaritia.md:64-65` nomme une commande du core ; « cerveau » pour elle-même
  (`CLAUDE.md:9`, `README.md:79`) ; « la mémoire affective et personnelle » parmi ce qu'elle ne possède pas
  (`CLAUDE.md:13`) ; `hooks/pre-push:2`.
- Les deux lancent `--addresses .` (`ci.yml:26-29`) et n'ont aucun contrôle des sons ni des modèles.

### Constats écartés

- **`D:\` dans le plan de bascule.** `D:` a disparu du laptop le 09/11. Le plan (`:39`) et la mise en service
  (`:19`, `:26`, `:58`…) parlent du dossier de service sur `D:` **du desktop**, qui garde ses disques d'après la
  mémoire de la session. Rien à corriger ici ; à confirmer par CrOliX sur le desktop.
- **La doc de Lun'Acedia** : le nom et le contrat seuls.
- **« Cerveau » dans `lun-avaritia/app/src/agent/icons.ts:6`** : le libellé d'un pictogramme, pas le nom du projet.
- **« Son cerveau » dans `lun-luxuria/docs/README.md:18`, `:113`** : ce qui décide de ce qu'elle dit (`Brain`), pas
  Avaritia.
- **« Sous-agent »** dans `workflow.md:64`, `:86` et `essentiel.md:61` : les sous-agents de Claude Code.
- **« Dix-huit issues `inbox` »** (cadrage, § 6, point 2) : juste au 10/11 pour les cinq dépôts.
- **Les chiffres de l'audit** : 38 fichiers et 397 chemins pour les dossiers source du core (l'audit dit 39 et 396).

## Les choix **[avis]**

### Ce qu'un dépôt public tait

**La règle.** Un dépôt public dit d'un dépôt privé son nom, son rôle, ses issues et ses PR, le contrat public qu'il
emploie (`/lun/v1`, l'appairage tel qu'un client le voit) et son adresse locale. Il ne dit ni ses chemins, ni ses
tables et colonnes, ni ses commandes et scripts, ni ses variables d'environnement, ni ses fichiers de déploiement. La
part d'un plan qui touche l'intérieur du core va dans l'issue privée de lun-anima ; le plan de lun-docs n'en garde que
« Lun'Anima : n tâches, lun-anima#N ». C'est la règle de `CLAUDE.md` appliquée ; « tenir en continu » le fait déjà.

**Le contrôle tranche les chemins ; la relecture, le reste.** Une commande, une colonne ou une variable ne se
distingue pas d'un nom à soi : un satellite peut nommer sa commande comme une commande du core. Celles-là restent à
la relecture, par une ligne du `reviewer`. Le contrôle cherche :

- le nom d'un dépôt privé, lu dans `registry.yaml` (`visibilite: prive`, le nom tiré de `depot` : `lun-anima`,
  `website`), suivi d'une barre ou d'une barre inverse et d'un chemin ; un paquet `@lun-anima/` ;
- dans lun-docs seulement, `core/src` et `ui/src` écrits seuls (un satellite peut avoir son propre `ui/src`) ;
- les liens GitHub sont retirés de la ligne avant la recherche, sauf `blob/` et `tree/` suivis d'un chemin : un lien
  d'issue ou de PR passe, un lien vers un fichier du core est pris ;
- une ligne marquée `allow-private` est sautée, relue à la main, comme `allow-address` (`check-repo.mjs:113`).

**L'historique, par une date de coupure.** Dans lun-docs, un plan ou une spec dont le nom porte une date au plus tard
du 2026-11-12 compte comme historique, et deux fichiers nommés en dur aussi : `docs/mise-en-service-desktop.md` (la
procédure du desktop, qui sort du contrôle jusqu'à la bascule) et `docs/plans/2026-11-08-bascule-nas.md`. La feuille de
route et le cadrage de l'état cible, datés mais vivants, restent contrôlés : aucun chemin du core n'y est aujourd'hui
(vérifié). L'historique de git garde ce qui a été publié ; réécrire les plans datés ne le retirerait pas.

**Les sons et les modèles, dans le même pas.** `--public` refuse tout son suivi (wav, flac, mp3, ogg, et les autres
formats audio courants) et tout modèle (onnx, ort, pt, pth, ckpt, safetensors, gguf, ggml, tflite, pb, h5, bin) qui
n'a pas, dans son dossier, un `SOURCE.md` portant son SHA-256. « Petit, libre, nécessaire » reste à la relecture ;
« tracé », le contrôle le tient. Un seul pas pour les trois satellites, au lieu d'un garde par CI.

### Le serveur dédié et le NAS

**L'ADR 0012, texte proposé, à valider par CrOliX avant la tâche 2.** Court, pour durer : ni le desktop du rodage (il
va dans `environnements.md`), ni la raison du choix, ni la machine.

> **ADR 0012 : la prod sur une machine dédiée, le NAS pour les copies**
>
> Statut : acceptée. Date : le jour de la fusion.
>
> **Contexte.** L'ADR 0008 mettait tout sur le NAS (UGREEN DXP2800). Le 10/11, CrOliX vise une machine dédiée pour la
> prod, le NAS au stockage (cadrage de l'état cible, § 6, point 5).
>
> **Décision.**
> - La prod ne tourne pas sur le NAS : une machine dédiée, à la maison, choisie à l'achat, porte les apps et leurs
>   bases.
> - Le NAS garde les copies et les fichiers.
> - L'accès depuis l'extérieur est celui de 0008, déchiffré sur la machine de prod : Tailscale au MVP ; la cible
>   (un domaine, Caddy, un VPS qui relaie le flux encore chiffré, les passkeys) inchangée. La porte vit dans le
>   déploiement, jamais dans le code.
>
> **Conséquences.** Restent vraies celles de 0008 : l'adresse publique en configuration, le battement des flux SSE, le
> TLS hors boucle locale sans porte, les PWA et Web Push par l'adresse HTTPS, les jetons d'appareil, le coût de la
> cible. Le plan de bascule se refait quand la machine s'achète.
>
> **Alternatives écartées.** Tout sur le NAS (0008). Celles que 0008 écartait, pour les mêmes raisons.

**L'ADR 0013** remplace 0001 (lun-docs#109) et garde ses principes durables : lun-docs fait foi et se distribue par
le plugin ; une place par information ; le périmètre figé à l'ouverture d'un chantier ; un chantier clos par une
preuve locale ; un local autonome et une prod ; seul CrOliX merge ; les dépôts publics sauf le core et le site ; les
outils sans IA d'abord. Pour la méthode, il renvoie à `essentiel.md`, `workflow.md`, `git.md` et `environnements.md`,
sans les recopier : ni *Show* et *Ask*, ni le manager et ses agents, ni Fable. Il dit ce qui quitte 0001 : le GitHub
Projects, la prod sur le NAS, le modèle par niveau et la décision d'achat qui en dépendait.

## Les tâches

**En parallèle d'emblée** : 1, 4 et 7 dans lun-docs ; 10, 11 et 12 dans les satellites, sauf leur pas de CI. **Après
1, et le « validé » de CrOliX sur le texte de 0012** : 2. **Après 2** : 3 et 5. **Après 5** : 6. **La feuille** : 8,
selon la règle des PR (« Coordination »). **Après 1 à 8** : 9. **Après la fusion de la PR de lun-docs** : le pas de CI
des tâches 10, 11 et 12, puis 13.

Un fichier n'a qu'une tâche à la fois. Dans lun-docs : 1 dans le cadrage, le dictionnaire et `structure-projet.md` ;
2 dans les ADR, `environnements.md`, `stack.md`, le plan de bascule et le § 4 d'`essentiel.md` ; 3 dans
`architecture-actuelle.md` ; 4 dans le registre, `check-registry.*` et `lun-ecosysteme` ; 5 dans `check-repo.*`,
`securite.md`, `CLAUDE.md`, `reviewer.md`, la galerie et le § 6 d'`essentiel.md` ; 6 dans `git.md`, `lun-livrer`,
`lun-chantier`, `livreur.md`, `guard.mjs`, le gabarit et le § 5 d'`essentiel.md` ; 7 dans `design.md`,
`notifications.md` et `README.md` ; 8 dans la feuille.

### lun-docs (session principale ou `dev-front`, worktree `wt\accord-docs`, branche `docs/textes-d-accord`)

1. - [ ] **Les décisions du 12/11** (`docs/specs/2026-11-10-etat-cible-cadrage.md`, `standards/dictionnaire.md`,
   `standards/structure-projet.md`). *Parallélisable d'emblée.*
   - Le cadrage. En tête (`:3-5`) : ce qui est tranché le 12/11 et où. § 3 (`:45-48`) : l'**[avis Claude]** devient
     « Tranché par CrOliX le 12/11 : la semaine de rodage sans tension sur le desktop est la porte du MVP ; la révision
     de l'état cible vient après. » § 4.2 (`:79`) : « le premier appareil sans terminal » sort de « Mis de côté » (il
     entre dans le MVP, lun-anima#72) ; « le NAS » devient « la bascule vers le serveur dédié ». § 6 (`:141`, `:145`,
     `:146`) : le point 1 n'est plus de la révision, c'est la porte ; le point 5 renvoie à l'ADR 0012 ; le point 6 dit
     que le premier appareil entre dans le MVP. § 8 (`:164`) : le point 3 tranché, avec la décision. `:167` : « La
     feuille de route du MVP se clôt après la semaine de rodage ; une nouvelle prend sa suite avec ces deux axes. »
   - Le dictionnaire, table « La méthode » : le MVP (`:92`) « atteint quand une semaine de rodage sur le desktop passe
     sans point de tension (12/11) » ; deux lignes. **le serveur dédié** : la machine de la maison où tournera la prod
     après le rodage (ADR 0012) ; ne désigne pas « le serveur » seul (celui auquel Lun'Luxuria est reliée, ou celui de
     la chaîne). **le NAS** : le stockage de la maison, les copies et les fichiers ; ne désigne pas la prod.
   - `structure-projet.md`, « Ce qui n'a pas sa place dans un dépôt » (`:19-28`) : « Un son : enregistrement, synthèse
     ou déroulé. Un modèle, sauf s'il est petit, libre, nécessaire à l'app et tracé : un `SOURCE.md` dans son dossier
     donne sa source, sa version, sa taille, son SHA-256 et sa licence. `check-repo.mjs --public` refuse un son, et un
     modèle sans ce `SOURCE.md`. »
   - Preuve : `npm run sync`, `npm run check`, `npm run sync:check` (le dictionnaire est recopié dans
     `lun-ecosysteme`).
   - Exclu : réécrire `vision.md` (lun-docs#127) ; la première marche de la présence (cadrage § 8, point 2).
2. - [ ] **Le serveur dédié dans les normes** (`adr/`, `standards/environnements.md`, `standards/essentiel.md` § 4,
   `standards/stack.md`, `docs/plans/2026-11-08-bascule-nas.md`). Après 1, et le « validé » de CrOliX sur 0012.
   - `adr/0012-prod-machine-dediee.md` : le texte validé, tel quel. `adr/0013-methode-principes.md` : « L'ADR 0013 »
     ci-dessus, en 60 lignes au plus, avec sa ligne « Statut : ».
   - `adr/0001-…` et `adr/0008-…` : « Statut : remplacée par 0013 » et « remplacée par 0012 », seule modification
     permise ; l'index de `adr/README.md` suit. Les numéros suivent l'ordre de fusion, s'il en vient un autre avant.
   - `environnements.md` : la prod est le desktop pendant le rodage, puis la machine dédiée (ADR 0012) ; « Prod
     ensuite » (`:37-43`) sans le NAS, et une ligne pour le NAS (les copies et les fichiers) ; « Interdit » (`:47`) :
     « tests à faire une fois sur la prod ». `essentiel.md:33-35` : « le desktop pendant le rodage, la machine dédiée
     ensuite » et « à tester sur la prod ». `stack.md:51-55` : l'image récupérée par la machine de prod (ADR 0012),
     sans le modèle du NAS ni le dossier de déploiement du core ; `stack.md:28` : « Bibliothèque (le satellite
     Lun'Avaritia) » (lun-docs#130).
   - Le plan de bascule : une note en tête, sans le réécrire : remplacé en partie par l'ADR 0012, il se refait quand
     la machine s'achète ; le § 2, point 2 (les bases et leurs clés), et le § 3 restent la base de la prochaine version.
   - Preuve : `npm run sync` (`essentiel.md` est recopié dans deux skills, `stack.md` et `environnements.md` non :
     `tools/standards-map.json`), `npm run check`, `npm run sync:check` ; la recherche du NAS (« Les preuves »).
   - Exclu : choisir la machine ; réécrire le plan de bascule ; la feuille de route (tâche 8).
3. - [ ] **La carte de ce qui tourne** (`docs/architecture-actuelle.md`). Après 2.
   - La date du jour de la PR (`:3`). `:16` « ses souvenirs » ; `:18` « la bibliothèque ». Les postes (`:24-33`) : la
     machine dédiée (la prod après le rodage, ADR 0012, pas encore achetée) et le NAS (les copies et les fichiers,
     rien n'y tourne). Les liaisons (`:50-51`) : le core relie un satellite par sa page d'autorisation et garde son
     jeton, chiffré, sans sa commande. Deux liens : les lignes d'arrivée (cadrage, § 4) et l'anatomie (dictionnaire).
   - Preuve : `npm run check`. Exclu : décrire la machine dédiée avant qu'elle existe.
4. - [ ] **Le registre** (`registry.yaml`, `tools/check-registry.mjs`, `tools/check-registry.test.mjs`,
   `plugin/skills/lun-ecosysteme/SKILL.md`). *Parallélisable d'emblée.*
   - **[avis]** La recherche se retire, le champ ne se remplit pas : `SKILL.md:20-23` fait chercher le propriétaire
     dans le rôle et la description du registre, puis dans « Possède » et « Ne possède pas » du `CLAUDE.md` du projet ;
     `registry.yaml:15` ne cite plus `contrats`.
   - `checkRegistry` : deux projets de même `id`, ou de même `depot` (à la casse près, comme GitHub), sont une erreur
     qui les nomme. Une ligne sous `projets:` que le parseur ne lit pas, un élément plus indenté que le premier projet
     (une liste imbriquée) et un champ sans valeur sont une erreur qui donne le numéro de la ligne. `parseProjects` est
     exporté pour la tâche 5.
   - Tests, écrits d'abord et vus rater : les deux doublons ; `contrats:` suivi de `- id: z` (une erreur à sa ligne, pas
     cinq champs manquants) ; un champ vide ; le registre d'aujourd'hui passe.
   - Preuve : `npm test`, `npm run check`, `npm run sync:check`. Exclu : un vrai parseur YAML ; ce que lit le site.
5. - [ ] **Ce qu'un dépôt public tait** (`standards/essentiel.md` § 6, `standards/securite.md`, `CLAUDE.md`,
   `plugin/agents/reviewer.md`, `tools/check-repo.mjs`, `tools/check-repo.test.mjs`, `design/galerie/inventaire.ts`,
   `design/galerie/base.css`). Après 2 (le même `essentiel.md`) et 4 (`parseProjects`).
   - La règle : une phrase dans `essentiel.md` § 6 (`:42-45`) ; dans `securite.md`, « Dépôts publics » (`:10-19`),
     « Tout est public sauf le core et le site » (`:12`), ce que le contrôle cherche et ce qui reste à la relecture, et
     la ligne « la part d'un plan qui touche l'intérieur du core va dans l'issue privée de lun-anima ; le plan de
     lun-docs n'en garde que « Lun'Anima : n tâches, lun-anima#N » ». La ligne de `CLAUDE.md` (« Spécificités ») renvoie
     là. `reviewer.md:15-16`, point 4 : « rien de l'intérieur d'un dépôt privé dans un dépôt public (chemin, table,
     commande, variable) ». `CLAUDE.md:10` « variables de design » (lun-docs#130).
   - `checkNoPrivateNames(root, { docs })` : les motifs de « Ce qu'un dépôt public tait » ; les noms lus par
     `parseProjects` dans le `registry.yaml` à côté du script ; les motifs propres à lun-docs et la date de coupure si
     `docs`. `checkMedia(root)` : les sons et les modèles, le SHA-256 calculé et cherché dans le `SOURCE.md` du dossier.
     Les deux sautent les tests et les binaires comme le contrôle des adresses (`:105-110`) et rendent `chemin:ligne`.
   - Les drapeaux : `runAll` lance les deux avec `docs`. `--public <dir>` lance les adresses, les noms (sans `docs`)
     et les médias, puis une dernière ligne qui nomme le dossier contrôlé. `--addresses` ne change pas (la CI des
     dépôts privés). Un drapeau inconnu sort en erreur, avec son nom.
   - Les textes vivants : `inventaire.ts:154`, `:161`, le `fichier` d'un élément propre au core devient « dans le core,
     privé » (`design/galerie/galerie.test.ts:43-52` veut un `fichier` non vide et affiché : il l'est) ; `base.css:2`,
     « la base du core » sans chemin.
   - Tests (`check-repo.test.mjs`), écrits d'abord et vus rater : un chemin écrit avec le nom d'un dépôt privé, avec
     sa ligne, à la barre et à la barre inverse ; un paquet `@lun-anima/` ; un lien d'issue ou de PR passe ; un lien
     `blob/` vers un fichier du core échoue ; le nom seul passe ; `allow-private` passe ; `core/src` seul échoue avec
     `docs` et passe sans ; un plan daté du 12/11 passe, un du 13/11 échoue ; la feuille de route est contrôlée ; un
     fichier de test est sauté ; un `.wav` échoue ; un `.onnx` sans `SOURCE.md` échoue, avec le bon SHA-256 passe, un
     octet changé échoue ; `--public` sur un dépôt temporaire nomme le dossier ; un drapeau inconnu échoue ;
     `--addresses` sur un dépôt qui a un chemin du core passe encore.
   - Preuve : `npm test`, `npm run sync`, `npm run check`, `npm run sync:check` ; `--public` lancé à la main sur les
     trois satellites, la sortie dans la PR ; dans `design/` : `npm ci`, `npm run typecheck`, `npm test`,
     `npm run format:check`, `npm run build`.
   - Exclu : réécrire un plan daté ; chercher commandes, tables et variables par motif ; Lun'Anima.
6. - [ ] **Les règles du plugin et des PR** (`plugin/skills/lun-livrer/SKILL.md`, `plugin/hooks/guard.mjs`,
   `standards/git.md`, `standards/essentiel.md` § 5, `templates/project/hooks/pre-push`, et selon la règle tranchée
   `plugin/agents/livreur.md`, `plugin/skills/lun-chantier/SKILL.md`). Après 5.
   - `lun-livrer/SKILL.md:29-31` : « *Show* : dis à CrOliX que la PR est prête, avec son lien ; c'est lui qui la passe
     prête et la fusionne. » `guard.mjs:116` : le message dit d'ajouter `--draft`, puis de dire à CrOliX que la PR est
     prête une fois ses critères prouvés. `git.md:38-42` : CrOliX la passe prête. Le comportement du hook ne change pas.
   - La règle des PR de lun-docs, selon CrOliX. **(a)** Rien ne change dans ces textes. **(b)** L'exception de
     lun-docs sort des cinq textes (`git.md:44-47`, `lun-livrer/SKILL.md:17-19`, `livreur.md:12-13` et `:17-18`,
     `lun-chantier/SKILL.md:20`) ; « une PR par chantier » y vaut partout, comme `essentiel.md:39-40`.
   - lun-docs#41 : `templates/project/hooks/pre-push:2` dit « Refuse tout push vers main : passer par une branche et une
     PR. Dans un dépôt public, le ruleset le refuse aussi ; ce hook arrête l'erreur avant le réseau. » ; une ligne dans
     `git.md` : le premier push de `main` d'un dépôt neuf, fait par CrOliX avec `--no-verify`, avant de poser son
     ruleset (le hook de garde le refuse à l'agent).
   - Preuve : `npm test` (le test du hook ne change pas), `npm run sync`, `npm run check`, `npm run sync:check` ; la
     recherche de `gh pr ready` (« Les preuves »).
   - Exclu : bloquer `gh pr ready` dans le hook ; borner les outils des agents (`tools:`).
7. - [ ] **Le design et les mots** (`standards/design.md`, `standards/notifications.md`, `README.md`).
   *Parallélisable d'emblée.*
   - `design.md:18` et `:31-32`, alignés sur `tokens.css:38-48` : l'accent d'Anima est `--anima`, distinct du rouge,
     avec son texte `--anima-texte` ; `--rouge` dit ce qu'il sert vraiment, d'après `tokens.css`.
   - **[avis]** lun-docs#136, la promesse retirée : `design.md:106` dit ce que `tokens.css` contient (couleurs, tons,
     rayons, ombres, polices, marques, cadre de focus) et que l'échelle typographique, les espacements, les hauteurs
     et le mouvement n'y sont pas encore. « Jetons » y devient « variables de design ».
   - lun-docs#130 : `notifications.md:26`, `:40`, `:43`, `:57` « la lettre du matin » ; `:44` « une question de la
     bibliothèque » ; `README.md:30` « Variables de design ».
   - `README.md`, « Quoi fait foi » : deux lignes, ce qui tourne aujourd'hui (`docs/architecture-actuelle.md`) et
     l'état cible avec ses lignes d'arrivée (le cadrage).
   - Preuve : `npm run sync`, `npm run check`, `npm run sync:check`. Exclu : ajouter des variables à `tokens.css`.
8. - [ ] **La feuille de route** (`docs/plans/2026-11-07-feuille-de-route-mvp.md`). Selon la règle des PR
   (« Coordination »), partie de `main`.
   - Ce qui est faux. § 1 : L (`:15-16`, `:23`) et P (`:22`) disent fusionné, chacun vu par `gh pr view`
     (lun-luxuria#44, lun-docs#123) ; une ligne par chantier du 10 au 12/11, avec ses PR, chacune vue par
     `gh pr view`. § 2 : B1 (`:68`) « le verrou ne se lève qu'après le chantier des mots des gestes : cinq voix au banc,
     puis la règle ; aucune vraie carte avant » ; B2 (`:69`) « sur le desktop, à l'oreille » ; B8 (`:75`) « la porte du
     MVP » ; § D (`:89-103`) : « la bascule vers la machine dédiée (ADR 0012) » au lieu du NAS, lun-anima#72 sorti de
     D et de `:27-29`, `:98` sans les commandes du core. § 3 : l'intro (`:107-108`) suit `workflow.md:9-14`. § 4 :
     `:282`, les agents de dev sont là depuis lun-docs#163 ; `:288`, `:291`, `:306`, `:319` disent ce qu'il faut lire
     sans la commande, les colonnes ni l'outil du core. § 5 (`:332-343`) : l'ordre remplace les dates ; restent la Black
     Week (ADR 0011) et le 31/12.
   - L'ordre du 12/11, après P, un sous-titre par chantier avec ses dépôts et son plan quand il existe : « tenir en
     continu » ; « écoute et parole » ; « remettre les textes d'accord » (ce plan) ; l'IPC de Lun'Luxuria (son issue) ;
     le banc (lun-luxuria#67 à #75) et les mots des gestes (lun-luxuria#6, ADR 0011) ; le premier contact sans terminal
     (lun-anima#72) ; le desktop (§ 4) ; le rodage (B8), puis la bascule.
   - Preuve : `npm run check` ; chaque PR citée vue par `gh pr view`. Exclu : l'état des lignes d'arrivée, que l'audit
     a lu sans le rejouer ; la liste d'essais du § 4 au-delà des lignes dites ; un index des plans.
9. - [ ] **Les preuves de lun-docs, la PR et les issues** (`livreur`). Après 1 à 8.
   - L'issue chapeau ouverte avant le premier push (« L'issue chapeau ») ; la PR en brouillon au gabarit, avec « Les
     preuves » ; la relecture du diff par le `reviewer` ; les barrières de la tâche 5.
   - La PR ferme lun-docs#109, #136 et #41 ; elle commente lun-docs#130 avec ce qui reste (Lun'Anima).

### Les satellites (session principale ou `dev-front`, branche `chore/surface-publique` dans chacun)

10. - [ ] **Lun'Luxuria** (`CLAUDE.md`, `docs/README.md:22-23`, `src/presence/chaine.test.ts:41`, `:547`, `:577`,
    `hooks/pre-push:2`, `.github/workflows/ci.yml`). *Parallélisable d'emblée*, sauf le pas de CI.
    - `CLAUDE.md:31-36` récrit pour dire ce que fait le code. La défense en profondeur : aucun sink HTML, la CSP, la
      lecture du corps bornée au dossier, à ses noms et à ses tailles, les programmes choisis dans la boîte du système
      et gardés côté Rust, sans shell. Les sorties qui restent, chacune en quelques mots : le dossier du corps et celui
      du service venus de la page ; les arguments du service et des programmes ; l'adresse que sonde un programme ;
      plugin-http ouvert à tout hôte, au proxy de la page et aux redirections. Le lien de l'issue `critique`.
    - `CLAUDE.md:52-53` et `chaine.test.ts:41`, `:547`, `:577` : « le serveur de la chaîne (un serveur compatible sur un
      faux modèle), lancé avant » ; dans l'écosystème, le core le fournit ; sans sa commande. `docs/README.md:22-23` :
      « Dans l'écosystème Lun', c'est le core, qui donne le code d'appairage », sans commande ni variable.
      `hooks/pre-push:2` : le commentaire du gabarit (tâche 6).
    - « Spécificités » : la règle des modèles, une ligne (aucun son ; un modèle seulement s'il est petit, libre,
      nécessaire à l'app et tracé par son `SOURCE.md` ; aujourd'hui `src/listen/silero/silero_vad.onnx` seul) ; et la
      commande locale `node ../lun-docs/tools/check-repo.mjs --public .`.
    - Après la fusion de lun-docs : `--public .` remplace `--addresses .` (`ci.yml:26-29`) ; le pas des sons
      (`:47-51`) sort, couvert par `--public`.
    - Preuve : `npm run format:check`, `lint`, `typecheck`, `test` ; `--public` en local ; la CI verte, avec la ligne
      qui nomme le dossier contrôlé. Exclu : `src-tauri/` et tout code (l'issue `critique`).
11. - [ ] **Lun'Acedia.** *Parallélisable d'emblée*, sauf le pas de CI. `hooks/pre-push:2` (tâche 6) ; la commande
    locale dans `CLAUDE.md` ; après la fusion de lun-docs, `--public .` à la place de `--addresses .`
    (`ci.yml:26-29`). Preuve : `--public` en local, puis la CI verte avec la ligne du dossier contrôlé.
12. - [ ] **Lun'Avaritia.** *Parallélisable d'emblée*, sauf le pas de CI.
    - `docs/prouver-avaritia.md:64-65` : « Dans le core, relier le satellite avec son adresse et ce code », sans la
      commande. `CLAUDE.md:9` : « satellite « bibliothèque » » ; `README.md:79` : « satellite, la bibliothèque » ;
      `CLAUDE.md:13` : « les souvenirs de Natsume » au lieu de « la mémoire affective et personnelle » (lun-docs#130).
    - `hooks/pre-push:2`, la commande locale et le pas `--public`, comme la tâche 11.
    - Exclu : le code (`brain` reste) ; le libellé d'icône « Cerveau » (« Constats écartés »).
13. - [ ] **Les PR des satellites** (`livreur`). Après 10 à 12 et la fusion de lun-docs : relecture du diff par le
    `reviewer` dans chaque dépôt, les PR renvoient à la chapeau, *Show*.

## Les preuves

Dans la PR de lun-docs, chaque recherche avec sa sortie, et une ligne par occurrence restante qui dit pourquoi elle
reste :

- le NAS : `git grep -n -i -w "NAS" -- standards adr templates plugin docs/architecture-actuelle.md
  docs/specs/2026-11-10-etat-cible-cadrage.md docs/plans/2026-11-07-feuille-de-route-mvp.md` (restent permis : l'ADR
  0008 remplacé, le NAS au stockage, les plans datés) ;
- `gh pr ready` : `git grep -n "gh pr ready" -- plugin standards` (restent permis : le test du hook, les textes qui
  disent que l'agent ne la lance pas) ;
- la règle des PR, si (b) : `git grep -n -i "par axe" -- plugin standards`, vide hors des plans datés.

## Coordination

- **La règle des PR de lun-docs et lun-docs#162.** Avec (b), CrOliX fusionne #162 maintenant ; le plan « écoute et
  parole » part sur sa propre branche depuis `main` ; la tâche 8 part de `main` après cette fusion. Avec (a), #162
  reste ouverte jusqu'au palier de son axe, et la tâche 8 attend sa fusion : #162 ajoute deux paragraphes après la
  ligne 23 de la feuille et change son § 4 (`:313-316`), et une seule PR à la fois récrit la feuille.
- **« Tenir en continu »** (`wt\continu-docs`). Son plan est daté du 12/11 : la date de coupure le compte comme
  historique, et sa part du core va dans l'issue privée de lun-anima. **Le contrat satellite** (`server.crashed`,
  `lot.failed`, `lot.held`) lui revient, puisqu'il émet ces événements : son plan (`:450`) le renvoie aux textes
  d'accord, il doit le reprendre. La ligne `:133` de la mise en service (« La veille de nuit ») lui revient aussi. Il
  n'écrit pas dans la feuille : la tâche 8 y met sa ligne.
- **« Écoute et parole »** touche `lun-luxuria/src`. La tâche 10 touche le `CLAUDE.md`, `docs/README.md`, trois textes
  de `src/presence/chaine.test.ts`, `hooks/` et `ci.yml`. Fichiers communs possibles : `chaine.test.ts`, `CLAUDE.md`.
  Le second à fusionner reprend la branche sur `main` ; aucun ne reformate ces fichiers.
- **L'IPC de Lun'Luxuria**, chantier `critique` à part, récrira `CLAUDE.md:31-36` quand ses sorties se ferment.
- **La maquette non suivie** `docs/maquettes/2026-10-30-apps-core/04-accueil-v2.html` reste à CrOliX. Le contrôle la
  lit en local ; elle n'a aucun chemin du core.

## Ce qui ne se prouve pas en local

- Le pas `--public` dans la CI des trois satellites : il clone `main` de lun-docs, donc il ne tourne qu'après la
  fusion. Avant, `--public` se lance à la main sur chaque satellite, sa sortie dans la PR de lun-docs.
- Le build du site, qui lit le registre : la tâche 4 n'y change aucune valeur lue.
- Le dossier de service sur `D:` du desktop : à voir quand CrOliX y est.

## Hors périmètre

- **L'IPC de la fenêtre de Lun'Luxuria**, chantier `critique` à part. Le corps de son issue est écrit, hors dépôt :
  les dossiers, les arguments et les hôtes venus de la page, le proxy et les redirections de plugin-http, la sonde des
  programmes, les pièges d'une correction, la variante la moins chère, et une première tâche qui prouve le mécanisme.
- **Les actions par SHA et Dependabot** : une issue `inbox`, dans lun-docs.
- **Un changement de méthode pour les plans à venir** au-delà de la ligne de `securite.md`.
- **Les en-têtes des cinq plans à moitié cochés** (constat 14 de l'audit).
- Lun'Anima, dépôt privé : sa part de lun-docs#130, ses textes, ses plans.
- Réécrire `vision.md` (lun-docs#127) ; la première marche de la présence.
- Le secret scanning, la push protection et les alertes Dependabot : des réglages de dépôt, à CrOliX. L'adresse Gmail
  de `docs/maquettes/2026-10-21-recadrage-front/10-composants-b.html:458` (audit de lun-docs, constat 5).
- Jeter `feat/fin-de-phrase` et son worktree, fermer lun-docs#61, annuler les deux runs bloqués, la branche
  `docs/axe-dev-cadrage` : des décisions de CrOliX.
- Le kit et ses cartes (lun-docs#43, #124, #134, #135, #143, #144) ; les cas limites de `tools/` (audit, constat 13),
  sauf le drapeau inconnu ; les outils des agents (`tools:`) ; les copies des standards dans les skills (constat 15).
- Réécrire le plan de bascule et déplacer la mise en service : à la bascule.
- Ouvrir les issues : ce plan dit lesquelles.

## Limites

- La date de coupure laisse les chemins des plans datés : l'historique de git les garde de toute façon.
- Le contrôle voit les chemins, pas les commandes, les colonnes ni les variables : ceux-là tiennent à la relecture.
- Un modèle avec son `SOURCE.md` passe même s'il n'est ni petit ni nécessaire : ces deux-là restent à la relecture.
- La commande locale de `--public` suppose lun-docs cloné à côté du satellite, comme sur le laptop.
- Les numéros de ligne sont ceux des `main` du 12/11.

## L'issue chapeau

Dans lun-docs : « Remettre les textes d'accord : la doc, les règles et la surface publique », `niveau:standard`, sans
`inbox`. Son corps : le lien de ce plan ; **le texte exact des sept décisions tel que CrOliX l'a validé le 12/11** ;
ce qu'elle ferme (lun-docs#109, #136, #41) et ce qu'elle traite en partie (lun-docs#130) ; une ligne par PR.

À ouvrir à côté : dans lun-luxuria, l'issue de l'IPC, `niveau:critique`, avec le corps écrit hors dépôt ; dans
lun-docs, l'issue `inbox` des actions par SHA et de Dependabot.

## À trancher par CrOliX

1. **Le plan entier.**
2. **Le texte de l'ADR 0012**, avant la tâche 2 (« Le serveur dédié et le NAS »), et deux points qu'il ne dit pas
   encore. **La raison** du choix : la mémoire de la session du 10/11 dit « des modèles légers en local » ; aucun texte
   du dépôt ne l'écrit. Faut-il l'écrire dans le contexte ? **Le rôle exact du NAS** : je recommande les copies et les
   fichiers, aucune base, car SQLite sur un partage réseau verrouille mal. L'autre voie : des bases sur le NAS.
3. **Ce qu'un dépôt public tait.** Je recommande la règle de « Ce qu'un dépôt public tait » : le nom, le rôle, les
   issues et PR, le contrat public et l'adresse locale, oui ; chemins, tables, commandes, variables et déploiement,
   non. L'autre voie, celle de l'audit : tolérer les noms de fichiers, refuser schéma et secrets.
4. **La règle des PR de lun-docs.** **(a)** Garder une PR par axe (lun-docs#163, le 11/11) : rien ne change, #162 reste
   ouverte, la tâche 8 attend. **(b)** Une PR par chantier partout : l'exception de lun-docs sort des cinq textes, la
   règle s'applique aux trois plans du jour (« tenir en continu », « écoute et parole », ce plan, une PR chacun), #162
   fusionne maintenant, « écoute et parole » part sur sa branche. (b) serait le troisième changement de cette règle en
   une semaine, après le 07/11 et le 11/11. Je recommande (b) : un plan validé arrive sur `main` en jours, pas en
   semaines, et #162 montre ce que coûte l'axe (28 commits hors de `main`). Le coût : une règle de plus à réapprendre.
5. **Le registre.** Je recommande de retirer la recherche de `contrats` du skill. L'autre voie : remplir le champ, une
   valeur par ligne ; la propriété serait alors écrite deux fois.
6. **lun-docs#136.** Je recommande de retirer la promesse de `design.md`. L'autre voie : ajouter l'échelle, les
   espacements, les hauteurs et le mouvement à `tokens.css`, qui touche le kit et les cinq apps.
7. **Le hook `pre-push` des dépôts publics** (lun-docs#41). Je recommande de le garder, avec un commentaire juste.
   L'autre voie : le retirer des dépôts publics, que le ruleset protège déjà.
8. **Le dossier de service sur `D:`** : je le laisse tel quel, chemin du desktop. À confirmer quand CrOliX y est.

## Ce que le plan-challenger a changé

Rendu « à amender » sur la version 1 (`2893142`) ; le manager a retenu ces points.

- L'IPC de Lun'Luxuria sort : un chantier `critique` à part, dont le corps d'issue reprend les constats du challenger
  (le proxy et les redirections de plugin-http, les arguments du service et des programmes, la sonde, le motif de
  portée qui coupe le réseau, le `.unwrap()` d'`add_capability`, les dossiers perdus, la boîte en plein tour). Ici, il
  ne reste que le `CLAUDE.md` récrit ; la PR de Lun'Luxuria passe `trivial` et *Show*.
- La règle des PR de lun-docs passe d'une recommandation à deux voies à trancher, avec ce que chacune implique.
- `--public` cherche les noms des dépôts privés lus dans le registre, avec une échappatoire, les barres inverses et
  les liens `blob/` et `tree/` ; une date de coupure remplace le gel par compte ; les sons et les modèles y entrent ;
  il remplace `--addresses` dans la CI des satellites et se lance en local.
- L'ADR 0012 est court, son texte se valide avant la tâche 2 ; l'ADR 0013 renvoie aux standards sans les recopier.
- Une ligne dit comment CrOliX a validé les décisions, et où en est le texte exact.
- Sortent : les SHA et Dependabot, un changement de méthode pour les plans à venir, les en-têtes des plans à moitié
  cochés, l'état des lignes d'arrivée dans la feuille, la ligne `:133` de la mise en service.
- Les preuves : `npm run sync` aux tâches 1 et 5, les recherches écrites dans la PR, « Ce qui ne se prouve pas en
  local ».
- La coordination : le contrat satellite revient à « tenir en continu » ; le propriétaire du site vérifié.
- Les agents : la session principale ou `dev-front`, dit explicitement.
