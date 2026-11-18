# Le banc de présence : sons, fausses briques, juge et outillage. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** lun-luxuria#104 (chapeau, `niveau:standard`) ; lun-luxuria#60, #67, #68, #69, #70, #73, #74, #75, #85,
> #101 ; la section « Tests et outillage » de #81 ; la case restante de #79.
>
> **État : rédigé le 18/11, à contester (plan-challenger), puis à valider par CrOliX.** Les points à trancher ont
> chacun leur **[avis]**.
>
> Code relu sur `main` de lun-luxuria (`1d07678`, « le tour » fusionné), par le graphe d'abord ; chaque ligne citée y a
> été relue. Le banc de sons (`banc-sons`, hors dépôt) lu par noms de dossiers et de fichiers seulement.

**But :** le banc de présence et la chaîne jouent et jugent ce que les chantiers précédents ont laissé sans preuve :
les sept scénarios de toux, Q7, I12 et Q8, l'absence, une urgence pendant un son. Le juge sait compter, le lanceur
n'attend plus une ancre qui ne viendra pas, les sorties se lisent sous un agent, et les tests du service de voix
tournent en CI. Rien de ce que fait Luxuria ne change.

**Source :** lun-luxuria#104 et ses critères ; les issues reprises, lues le 18/11 ; la feuille de route, « Le banc et
les mots des gestes » et « Le tri du 16/11 » ; le plan [le tour](2026-11-17-le-tour.md), tâche 9 (la chaîne du 18/11)
et son « Hors périmètre » ; le `CLAUDE.md` de Lun'Luxuria : « L'écoute se rejoue », « La présence se joue en
scénarios », « un écart du code devient une issue et un `connus`, jamais une borne élargie », « Aucun son dans le
dépôt ».

**Critères de fin**, ceux du chapeau, figés. Chacun se vérifie en local, par une commande :

1. **Les sons** : la chaîne joue les scénarios de toux (`bruit.wav`, `toux.wav`, `toux-courte.wav` posés au banc) ;
   quand un son posé manque, elle le dit ou refuse de jouer, au lieu de prendre la synthèse sans rien dire. Tâches 11
   et 12.
2. **`CHAINE_TTS`** : le défaut trouve Piper depuis un worktree, ou la doc dit comment le régler. Tâche 10.
3. **Les fausses briques** : durée de synthèse par phrase ; un flux qui lève après le numéro, et après son `done` ;
   une erreur avant la fin de parole. Q7, I12 et Q8 joués chacun par un scénario. Tâche 6.
4. **Les scénarios manquants** : l'absence ; une urgence pendant un son ; l'invariant joue des phrases tenues et non
   tenues. Tâches 7 et 16.
5. **Le juge** : « au plus n », ancré sur un événement ; `hesite-puis-demande` perd sa fenêtre fixe de 2 880 ms
   (tâche 8). Les attentes `exact` trop justes tranchées, les fenêtres proches d'un bord revues,
   `arrete-puis-question` a sa ligne de base (tâche 17).
6. **Le lanceur** : une parole ancrée sur un envoi qui ne viendra pas est sautée tout de suite. Tâche 9.
7. **Les sorties** : `npm run banc` et `npm run scenarios` montrent leur résumé sous un agent (tâche 3) ;
   `npm run banc` saute `chaine/` et `scenarios/` (tâche 2) ; les mutations lisent des verdicts en JSON (tâche 4).
8. **La CI** : `voix/test_service.py` tourne quelque part. Tâche 5.
9. **Le témoin Chromium** : le recalage du départ vérifié, et le résultat écrit. Tâche 14.
10. **L'outillage de #81** : la recette « vu rater sur `main` » outillée (tâche 15) ; la durée de `npm test` mesurée
    (tâche 1) ; le numéro consommé par le faux serveur, réglé ou écarté par écrit (tâche 13).
11. **La doc** : l'interface du serveur compatible de la chaîne dans `docs/README.md`. Tâche 10.
12. **Le déroulé depuis la fenêtre** (#60) : tranché ici, point (a).

Barrières à la fin : `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check` ; `npm run scenarios`,
chaque scénario joué deux fois à l'identique, tous tenus ou connus ; `npm run mutations`, chaque mutation sur son
maillon ; `npm run chaine`, une partie par scénario avec Hortense, sans échec nouveau contre la chaîne du 18/11.

| Dépôt, branche                             | Issue                        | Niveau     |
| ------------------------------------------ | ---------------------------- | ---------- |
| `lun-luxuria`, `test/banc-de-presence`     | lun-luxuria#104              | `standard` |
| `lun-docs`, `docs/banc-de-presence`        | lun-luxuria#104, pour ce plan | `trivial`  |

**Ce que la PR ferme :** #104, #67, #68, #69, #70, #73, #74, #75, #85, #101 ; la case de #79 (l'issue se ferme, ses
autres cases sont cochées) ; la section « Tests et outillage » de #81, cochée, l'issue restant ouverte pour ses autres
sections. #60 selon le point (a).

**Hors périmètre :**

- le comportement de la conversation : lun-luxuria#97 à #100, #102, #48, #63. Le banc les rend jouables, il ne les
  corrige pas. Un scénario neuf qui montre un écart du code le garde en `connus`, vers une issue, ouverte ou neuve ;
- les autres sections de #81 (parole et file, retrait d'un essai et connexions) ;
- tout son dans le dépôt : les sons restent dans `banc-sons` ;
- la fenêtre Tauri et l'IPC, sauf si CrOliX fait entrer #60 (point (a)) ;
- la latence, qui se mesure sur le desktop (feuille de route, § 4) ;
- l'écho dans la chaîne (`pourquoiPas`, `src/presence/chaine.test.ts:134`), qui demande un vrai micro.

## Ce que le code fait aujourd'hui

Chemins de lun-luxuria, sur `main` (`1d07678`).

### Les sons de la chaîne

- Une parole entre parenthèses (une toux) lit toujours son fichier `sons/<nom>.wav`, coupé à sa durée et refusé plus
  court ; absent, la partie n'est pas jouée et le relevé dit « son manquant » (`src/presence/chaine/sons.ts:137-144`,
  `:129-135`). Un bruit lit `bruit.wav` de même (`:170-174`). Le refus passe par `planDePartie` (`:189-191`), puis
  `jeu` rend la raison (`src/presence/chaine.test.ts:741-743`).
- Une parole ordinaire, en mode posé (`POSES`, sans `CHAINE_VOIX`, `chaine.test.ts:479`), prend `sons/<nom>.wav` s'il
  existe, sinon le cache de la voix, sinon sa synthèse (`sons.ts:141-157`). Rien ne dit qu'un son devait être posé :
  c'est le cas de #81, « non » manquant. La source de chaque son est écrite dans `resultats.jsonl` (`src/presence/
  taux.ts:92`), que personne ne lit pendant une partie.
- **Sept scénarios** demandent un son de toux ou de bruit. Cinq ont une parole `(toux)` ou `(toux courte)` :
  `reponse-vide-puis-toux`, `toux-courte`, `toux-parole`, `toux-reflexion`, `toux-verdict-tardif`. Deux ont un
  `bruits` : `toux-puis-parole`, `toux-puis-parole-tard`. Le relevé de la chaîne du 18/11 les liste tous les sept en
  « son manquant ».
- Au banc, `chaine/sons/` ne tient que `non.wav` et le cache `sapi/`. Le banc des gestes a des toux réelles :
  `gestes/prises/toux-longue-1.wav`, `-2.wav` (« toux d'au moins 450 ms », `gestes/mots.json`), `toux-courte-1.wav`,
  `-2.wav` (« au moins 300 ms »), et `raclement`, `souffle`, `clavier`. Leurs en-têtes disent 1,3 à 2,3 s, silences
  compris ; leur durée après `rogner` n'est pas vérifiée.

### `CHAINE_TTS`

- Le défaut est `piper:${resolve('../../piper/fr_FR-siwis-medium.onnx')}`, résolu depuis le dossier de lancement
  (`chaine.test.ts:466-467`, un `shortcut:` le dit). Depuis le clone principal il vise le dossier `piper` à côté des
  projets ; depuis `wt/<nom>/`, un dossier qui n'existe pas. Le service de voix sort alors en code 1, et `attendre`
  dit seulement « son processus s'est arrêté (code 1) » (`:505`). Le banc des gestes lit le même défaut pour refuser
  sa voix (`docs/README.md:238-240`).
- `docs/README.md` n'a aucune section sur la chaîne : seul le `CLAUDE.md` la décrit. L'interface du serveur
  compatible n'est écrite nulle part. Ce que la chaîne en lit, d'après son code : une réponse à `GET` sur son adresse
  fixe (`chaine.test.ts:469`, `:554-563`) ; le code d'appairage dans `BANC_DIR/chaine/serveur/code` et
  `POST /api/pair { code, client }` qui rend `{ token }` (`:583-590`) ; `serveur/partie.json`, `{ nom, reponses }`,
  écrit avant chaque partie (`:614`) ; `serveur/journal.jsonl`, une ligne `{ partie, t, name, ... }` par événement,
  dont `envoi_recu`, `coupure_recue`, `retrait_recu`, `modele_appele`, `modele_inattendu` (`:47-61`, `:714-720`) ;
  `POST /api/chaine/parle { pourquoi, phrases }`, porteur du jeton (`:696-700`) ; et l'API de « Relié »
  (`docs/README.md:196-207`).

### Les fausses briques

- La synthèse dure `voix.syntheseMs` pour toutes les phrases (`src/presence/fakes.ts:80`) ; la chaîne sert la même
  durée par sa route de `/voix/tts` (`chaine.test.ts:657-663`).
- `FauxServeur.send` ne lève qu'au refus, avant tout événement (`fakes.ts:173`). Il envoie toujours `speech-end`
  avant le `done`, même en erreur (`:206-215`). Aucun scénario ne joue donc Q7 (erreur, puis aucune fin de parole),
  I12 (flux qui lève après le numéro) ni Q8 (`done` en erreur, puis flux qui lève). Les tests de la conversation les
  tiennent (`src/conversation.test.ts:1773` et suivantes).
- Le faux serveur numérote à la réception (`fakes.ts:169`), avant le refus (`:173`) : un refus consomme un numéro.
  Sans effet sur les verdicts d'aujourd'hui : `fragment-refuse` nomme ses réponses par leur rang d'envoi
  (`src/presence/judge.ts:138-145`).
- Le joueur ne donne à la conversation ni `ready` ni les réglages d'une absence (`src/presence/player.ts:78-88`). La
  session, absente et reliée, coupe l'essai (`src/session.svelte.ts:295-300`) et fait attendre l'envoi sur le retour
  (`:305`, `:435-450`). Aucun scénario ne joue l'absence.
- Une parole spontanée `p0` passe devant les tours qui attendent (`src/conversation.ts:178`,
  `src/speech/speaker.ts:106-113`). Le vocabulaire des scénarios la sait déjà (`modele.parle`, `pourquoi`,
  `src/presence/scenario.ts:181-185`) ; aucun scénario ne s'en sert.
- L'invariant des réponses en erreur (`conversation.test.ts:887-905`) joue chaque phrase par `start`, `held`, puis
  `noise` ou la fin (`:963-966`) : toujours tenue.

### Le juge et les scénarios

- Une attente sur un événement dit « au moins un » ou, `absent`, « aucun dans la fenêtre » (`judge.ts:276-287`). Rien
  ne compte. `hesite-puis-demande/rien-de-l-essai-retire` garde une fenêtre fixe `[0, 2880]` depuis le début de la
  parole (`src/presence/scenarios/hesite-puis-demande.ts:94-104`).
- Au niveau de la chaîne, une attente `exact` est une mesure : elle ne fait jamais échouer (`judge.ts:44-53`, `:330`).
  Les lignes de #70 : `coupee` et `coupure-recue` de `non-court` (`non-court.ts:71-85`) et de `arrete-net`
  (`arrete-net.ts:71-85`), `sortie-arretee` de `faire-taire` `[0, 32]` (`faire-taire.ts:43-51`).
- Les fenêtres proches d'un bord : `deux-reponses`, `phrase-2-recue` `[3000, 5500]` et `son-1-encore` `[1, 3000]`,
  toutes deux `tous` (`deux-reponses.ts:41-59`).
- `scenarios.test.ts:30` attend trente scénarios.

### Le lanceur, les sorties, la CI

- La partie de la chaîne attend que tous les sons du plan aient leur fin (`chaine.test.ts:911-913`). Une parole
  ancrée dont l'ancre ne vient pas n'a jamais de fin : la partie attend le plafond de 90 s (`:489`, `:908`), puis la
  sonde écrit `parole_sautee` (`src/presence/chaine/sonde.ts:328-331`). Le joueur exact, lui, finit `finApresMs`
  après le dernier événement posé et saute l'ancre restée en attente (`player.ts:20-29`, `:96-108`, `:167`).
- `npm run banc` saute `gestes/` seul, au premier niveau (`src/listen/banc.test.ts:182-188`, test `:194-205`).
- `npm run banc` et `npm run scenarios` n'ont pas de `--reporter` (`package.json:21`, `:23`) ; `npm run gestes` et
  `npm run chaine` ont `--reporter=default` (`:22`, `:25`). Leurs résumés sont des `console.log` (`banc.test.ts:275`,
  `:356`, `scenarios.test.ts:137`).
- `npm run mutations` lit `releve-scenarios.md` colonne par colonne (`tools/mutations.mjs:18-33`) ; il lance Vitest
  lui-même, sans passer par le script (`:47-52`).
- La CI lance `npm test`, `npm run build` et `npm run mutations` sur Ubuntu, `cargo` sur Windows
  (`.github/workflows/ci.yml`). Rien n'y lance Python. `voix/test_service.py` dit sa commande en tête : `uv run --with
  numpy --with httpx --with soundfile python voix/test_service.py` ; il finit par `print("ok")` (`:1-5`, `:265-277`).
- Le témoin `deux-phrases` est un WAV avec 8 000 ms de silence en tête (`sons.ts:217-237`). La page note l'instant de
  sa première trame non silencieuse (`chaine.test.ts:864-877`), et le départ s'en déduit : `__premiere` moins
  l'instant de la première parole (`:677-682`). Les 8 000 ms ne sont jamais soustraites : seul ce recalage les retire.

## Ce que les issues disent et que le code contredit

- **#85** nomme `src/listen/banc.ts` : ce fichier n'existe pas. Le saut est dans `src/listen/banc.test.ts:182-188`.
- **#75** cite `banc.test.ts:256` et `:337` : ces `console.log` sont aujourd'hui à `:275` et `:356`. Sa raison de ne
  pas mettre `--reporter=default`, « garder le reporter `github-actions` en CI », ne tient pas : ni `npm run banc` ni
  `npm run scenarios` ne tournent en CI, et les mutations lancent Vitest sans le script. Le « correctif de la chaîne »
  est ce même drapeau (`package.json:25`).
- **#73** cite `chaine.test.ts:475`, `893`, `896` : `PLAFOND_MS` est à `:489`, lu à `:908`. L'attente vient de
  `:913`.
- **#101** et le plan « le tour » (tâche 9) comptent six scénarios de toux non joués : le code et le relevé du 18/11
  en donnent sept.

## Les points à trancher par CrOliX

### (a) #60 : le déroulé depuis la fenêtre, ici ou à la session du desktop

- **[avis] À la session du desktop (§ 4).** L'export passe par un téléchargement de navigateur ; dans la fenêtre, il
  demande une boîte d'enregistrement. lun-luxuria#87 vient de borner ce chemin : aucune permission `dialog:` pour la
  page, les boîtes s'ouvrent côté Rust, une à la fois (`CLAUDE.md`, « Aucune permission `dialog:` »). Une commande
  Rust de plus se conçoit avec l'IPC, et se prouve dans l'exe lancé depuis l'Explorateur, sur le poste. La chaîne n'en
  a pas besoin : elle exporte par le bouton, dans Chrome (`chaine.test.ts:938-946`). #60 reste ouverte ; sa ligne
  entre au § 4 de la feuille de route quand CrOliX le valide.
- L'autre voie : une tâche de plus ici, côté Rust (une commande qui ouvre la boîte et écrit le fichier), relue avec
  les règles de #87. Coût : le chantier touche `src-tauri/`, et sa preuve attend le desktop.

### (b) D'où viennent les trois sons de toux

- **[avis] Des prises qui existent déjà, copiées dans `banc-sons/chaine/sons/`.** `toux.wav` depuis
  `gestes/prises/toux-longue-1.wav`, `toux-courte.wav` depuis `gestes/prises/toux-courte-1.wav`, `bruit.wav` depuis
  `gestes/prises/toux-longue-2.wav`. Les deux `bruits` des scénarios sont une toux de 450 ms (`toux-puis-parole.ts:26`),
  comme la longue. Ce sont de vraies toux de CrOliX, prises pour le banc des gestes ; elles restent hors dépôt. Aucune
  prise neuve. La tâche 12 vérifie que chacune tient sa durée une fois rognée ; sinon l'autre prise du même mot.
- L'autre voie : une prise neuve de CrOliX pour chacun, au micro du laptop. Coût : une séance, pour rien de plus que
  ce qui existe.

### (c) #70 : attentes `tous` plus larges, ou mesures seulement

- **[avis] Mesures seulement.** Au niveau de la chaîne, une attente `exact` ne fait déjà jamais échouer
  (`judge.ts:330`). Ce que la chaîne doit tenir sur ces lignes l'est déjà en `tous` : `pour-de-bon` et `silence-coupe`
  (`non-court.ts:87-95`, `arrete-net.ts:87-95`), `coupure-recue` de `faire-taire` (`faire-taire.ts:92-98`). Les mots
  entendus à ±1 mot dépendent de la voix réelle : une borne `tous` plus large n'y prouverait rien. Un commentaire dans
  chaque scénario le dit, et #70 se ferme.
- L'autre voie : une attente `tous` par ligne, à bornes plus larges. Coût : trois à six attentes neuves, et des bornes
  qui ne viennent d'aucun calcul.

### (d) #75 : le résumé écrit comme la chaîne, ou le reporter selon l'environnement

- **[avis] Comme la chaîne : `--reporter=default` dans les deux scripts.** C'est déjà ce que font `chaine` et `gestes`
  (`package.json:22`, `:25`), et la CI n'est pas touchée (plus haut). Deux mots dans `package.json`.
- L'autre voie : choisir le reporter selon une variable d'environnement, dans `vite.config.ts`. Coût : une règle de
  plus, pour un cas que la CI ne connaît pas.

### (e) #81 : le numéro que le faux serveur consomme à chaque refus

- **[avis] Écarté par écrit.** Le dépôt ne dit pas si le vrai serveur consomme un numéro au refus, et rien ne
  l'observe : la page ne voit jamais le numéro d'un refus (`docs/README.md:205`, le flux commence par `user`). Un
  commentaire `shortcut:` sur `fakes.ts:169` le dit, avec quand y revenir : un scénario qui lirait le numéro d'une
  réponse après un refus.
- L'autre voie : numéroter après le refus. Coût : `envoi_recu` d'un refus perd son `reponse`, et le relevé de
  `fragment-refuse` change ; le gain n'est pas observable.

### (f) La recette « vu rater sur `main` » : un outil ou une page

- **[avis] Un petit outil, `tools/sur-main.mjs`.** Le critère dit « outillée ». Il crée un worktree détaché de
  `origin/main` dans le dossier temporaire, y relie `node_modules` du clone (jonction sous Windows), copie les
  fichiers de test donnés, lance `vitest run` sur eux avec le `fs` de Vite ouvert au clone, affiche la sortie, puis
  retire le worktree. Il se teste par une assertion en tête, comme `tools/mutations.mjs:35-44`.
- L'autre voie : la recette en commandes dans `docs/README.md`, une par ligne. Coût : rien à maintenir, mais
  chaque tâche la retape.

## Les tâches

Chaque tâche : le **testeur** écrit d'abord les tests, les voit rater sur `main` et colle le message d'échec dans la
tâche ; puis **dev-luxuria** écrit le code dans le worktree qu'on lui donne. Les tâches de mesure (1, 14, 17) sont au
testeur seul. Les noms des tests sont des avis ; leurs assertions ne le sont pas. Barrières de chaque tâche, une
commande par ligne :

```
npm test
npm run lint
npm run typecheck
npm run format:check
```

Et, pour toute tâche qui touche `src/presence/` ou `tools/mutations.*` :

```
npm run scenarios
npm run mutations
```

**L'ordre.**

- **En parallèle de tout**, chacune dans son worktree parti de `test/banc-de-presence` : tâches 1, 2, 3, 4, 5, 12,
  13, 14, 15. Les tâches 2 et 3 touchent toutes deux le `CLAUDE.md` de Lun'Luxuria (lignes différentes) : la seconde
  fusionnée reprend la première.
- **Piste B**, `src/presence/scenario.ts`, `scenarios.test.ts:30`, `tools/mutations.json` : tâches 6, 7, 8, dans cet
  ordre. Elles touchent les mêmes fichiers.
- **Piste C**, `src/presence/chaine.test.ts` et `chaine/sons.ts` : tâches 9, 10, 11, dans cet ordre. Les tâches 6
  et 7 touchent aussi `pourquoiPas` (`chaine.test.ts:133-150`), loin des lignes de la piste C : la seconde fusionnée
  reprend l'autre.
- **La tâche 16** après la tâche 1 : elle a besoin du budget de `npm test`.
- **La tâche 17** après les pistes B et C et la tâche 12 : elle joue la chaîne.
- **La tâche 18** ferme.
- Une seule PR ; `npm run mutations` se rejoue après chaque fusion.

### Tâche 1. La durée de `npm test` (testeur ; mesure, sans code)

- [ ] **Établir** : la durée de `npm test` sur `main`, cinq fois de suite, poste au calme (rien d'autre lancé), avec
  la médiane et l'écart ; puis la durée par fichier que Vitest affiche, pour les cinq plus longs.
- **Commande**, une par ligne : `npm test`, cinq fois.
- **Rend** : les chiffres dans cette tâche, et le budget que la tâche 16 ne dépasse pas : la médiane plus l'écart
  mesuré.
- **Exclu** : un outil de mesure ; raccourcir un test.

### Tâche 2. `npm run banc` saute `chaine/` et `scenarios/` (#85)

- [ ] **Fichiers** : `src/listen/banc.test.ts` (`:182-188`, test `:194-205`), le `CLAUDE.md` de Lun'Luxuria
  (« L'écoute se rejoue »).
- **Ce qui change** : au premier niveau, `chaine` et `scenarios` sont sautés comme `gestes`. Le commentaire `:182`
  dit pourquoi : ce sont les sons et les sorties d'autres bancs.
- **Test** : celui de `:194` gagne `chaine/sons/x.wav` et `scenarios/y.wav` dans son dossier, et attend toujours
  `['a.wav', 'sous/b.wav']`. Sur `main`, il rate.
- **Preuve** : `npm test -- src/listen/banc.test.ts`.
- **Exclu** : tout autre dossier ; le contenu de `releve.md`.

### Tâche 3. Le résumé de `banc` et de `scenarios` sous un agent (#75, point (d))

- [ ] **Fichiers** : `package.json` (`:21`, `:23`), le `CLAUDE.md` de Lun'Luxuria (la phrase « Son
  `--reporter=default` est voulu », qui vaut alors pour les quatre).
- **Ce qui change** : `--reporter=default` au bout des scripts `banc` et `scenarios`.
- **Preuve**, depuis un agent : `npm run scenarios` affiche « Relevé et déroulés écrits dans … » ; `npm run banc`
  affiche les cinq premières lignes du relevé, ou « Pas de dossier d'enregistrements ».
- **Exclu** : `vite.config.ts` ; `npm test`.

### Tâche 4. Les mutations lisent des verdicts en JSON (#67)

- [ ] **Fichiers** : `src/presence/scenarios.test.ts` (`afterAll`, `:132-138`), `tools/mutations.mjs` (`echecs`,
  `:18-44` ; `jouer`, `:47-64`).
- **Ce qui change** : en mode `scenarios`, `afterAll` écrit aussi `verdicts.json` à côté de `releve-scenarios.md` :
  pour chaque scénario, `{ nom, verdicts }`, les `Verdict` tels que `juger` les rend. `mutations.mjs` lit ce fichier.
  Un échec est un verdict qui n'est pas tenu et n'est pas un `connus` conforme : la même règle qu'aujourd'hui
  (`:28-29`), écrite sur les champs (`etat`, `connu.conforme`) et non sur les libellés.
- **Test** : l'assertion en tête de `mutations.mjs` (`:35-44`) passe sur un exemple en JSON, avec les mêmes trois cas
  (raté, tenu, tenu et connu ailleurs). Sur `main`, `echecs` lit du Markdown : l'assertion neuve rate.
- **Preuve** : `npm run mutations`, le même tableau qu'avant la tâche, ligne pour ligne.
- **Exclu** : le format de `releve-scenarios.md` ; la table `tools/mutations.json`.

### Tâche 5. `voix/test_service.py` en CI (#68)

- [ ] **Fichiers** : `.github/workflows/ci.yml` (un job neuf, `voix`, sur `ubuntu-latest`).
- **Ce qui change** : le job installe `uv` par l'action officielle d'Astral, à une version fixée, puis lance la
  commande de l'en-tête du fichier, telle quelle :
  `uv run --with numpy --with httpx --with soundfile python voix/test_service.py`.
- **Preuve** en local : la même commande affiche `ok`. Puis le job vert sur la PR.
- **Exclu** : faster-whisper et Piper (le test ne les charge pas) ; Windows ; un `pyproject.toml`.

### Tâche 6. Les fausses briques : Q7, I12, Q8 (#101 ; piste B, la première)

- [ ] **Fichiers** : `src/presence/scenario.ts` (`Reponse`, `:158-175` ; `voix` de `Scenario`, `:290`),
  `src/presence/fakes.ts` (`synth`, `:79-87` ; `send`, `:167-216`), `src/presence/chaine.test.ts` (la route de
  `/voix/tts`, `:657-663` ; `pourquoiPas`, `:133-150`), `src/presence/player.test.ts`, trois scénarios neufs,
  `src/presence/scenarios.test.ts:30`, `tools/mutations.json` si une mutation doit les viser.
- **Ce qui change**, trois champs, chacun optionnel, son défaut étant le comportement d'aujourd'hui :
  - `voix.syntheseMsPar`, texte → ms : la durée de synthèse d'une phrase donnée, lue par `synth` et par la route de la
    chaîne, comme `voix.echoue` est lu par texte ;
  - `Reponse.leve`, `'apres_numero'` ou `'apres_done'` : `send` lève à cet endroit ;
  - `Reponse.fin`, `'avant'` (aujourd'hui), `'apres'` (le `done` avant `speech-end`) ou `'jamais'` (pas de
    `speech-end`).
  `pourquoiPas` refuse à la chaîne un scénario avec `leve` ou `fin`, comme le refus (`:137-138`) : le vrai serveur ne
  le fait pas sur commande.
- **Scénarios**, noms en avis : `erreur-sans-fin` (Q7 : une réponse en erreur après un tour relâché, `fin: 'jamais'` ;
  attendu : la réponse suivante sonne), `flux-casse-apres-numero` (I12 : `leve: 'apres_numero'` sur un fragment ;
  attendu : la réponse suivante sonne avant la garde de 60 s), `erreur-puis-flux-casse` (Q8 : `erreur` et
  `leve: 'apres_done'` ; attendu : un `sans_reponse`, puis `absent` d'un second, ancré sur le premier). Le calcul en
  tête de chacun, comme les autres.
- **Tests** : `player.test.ts`, chaque champ sur un scénario minimal : la durée par phrase, le flux qui lève aux deux
  endroits, l'ordre `done` puis `speech-end`, et l'absence de `speech-end`.
- **Sur `main`** : les champs n'existent pas, `charger` ou le typage refusent les scénarios. Avec les champs, les
  trois scénarios tiennent : « le tour » a réglé Q7, Q8 et I12. Si l'un rate, c'est un écart du code : une issue et un
  `connus`.
- **Exclu** : le code de la conversation ; jouer ces scénarios à la chaîne.

### Tâche 7. L'absence, et une urgence pendant un son (#101 ; piste B, après la 6)

- [ ] **Fichiers** : `src/presence/scenario.ts` (`Scenario`, `:264-296` ; `BancNom`, `:31-64`),
  `src/presence/player.ts` (`partie`, `:78-88`), `src/presence/player.test.ts`, deux scénarios neufs,
  `src/presence/scenarios.test.ts:30`, `src/presence/chaine.test.ts` (`pourquoiPas`).
- **Ce qui change** :
  - `Scenario.absence?: { retourMs: number }` : la partie commence absente. Le joueur fait ce que fait la session
    (`session.svelte.ts:295-305`, `:435-450`), rien de plus : absente, `settings()` rend `speculate` à faux ; au
    premier `addressed`, la présence revient, une ligne `retour` au journal, et `ready()` rend une promesse qui se
    tient `retourMs` plus tard ;
  - aucun champ pour l'urgence : `modele.parle` avec `pourquoi: 'p0'` le dit déjà.
  `pourquoiPas` refuse l'absence à la chaîne : la page n'y est jamais absente.
- **Scénarios** : `absente-puis-phrase` (attendus : l'essai ne part pas, `envoi_recu` après la ligne `retour`) ;
  `urgence-pendant-un-son` (une réponse de deux phrases, une parole `p0` pendant la première ; attendus : la phrase en
  cours n'est pas coupée, l'urgence sonne avant la phrase 2, `reponses_ensemble` à `[0, 0]`).
- **Tests** : `player.test.ts`, l'absence : sans `addressed`, aucune ligne `retour` ; avec, `ready` tient
  `retourMs`.
- **Sur `main`** : le champ n'existe pas. `urgence-pendant-un-son` se joue sans code : s'il rate, c'est un écart du
  code, une issue et un `connus`.
- **Exclu** : la session ; l'absence dans la chaîne.

### Tâche 8. Le juge compte : « au plus n » (#74 ; piste B, après la 7)

- [ ] **Fichiers** : `src/presence/scenario.ts` (`AttenduEvenement`, `:229-235` ; `charger`, `:392` et suivantes),
  `src/presence/judge.ts` (`:276-287`), `src/presence/releve.ts` si la colonne `Trouvé` doit dire un compte,
  `src/presence/judge.test.ts`, `src/presence/scenarios/hesite-puis-demande.ts`.
- **Ce qui change** : `auPlus?: number` sur une attente d'événement. Les événements qui conviennent, depuis l'ancre
  et dans `entre` s'il est donné, sont comptés ; plus de `auPlus`, l'attente rate en `en_trop`, `trouve` le compte.
  `charger` refuse `auPlus` avec `absent` (`absent` vaut `auPlus: 0`), et un `auPlus` négatif ou non entier.
- **Scénario** : `rien-de-l-essai-retire` devient « une seule réponse sonne » : `evenement: 'premier_son'`,
  `auPlus: 1`, sans `entre`, depuis le début de la partie. Une réponse a un seul `premier_son` ; compter les `joue`
  serait faux, une phrase coupée à sa virgule en donnant deux (`scenario.ts:324-338`).
- **Tests** : `judge.test.ts`, sur un banc écrit à la main : un événement, tenu ; deux, `en_trop` et `trouve: 2` ;
  ancré sur une autre attente, les événements d'avant l'ancre ne comptent pas.
- **Sur `main`** : le champ n'existe pas ; les tests ratent.
- **Mutation** : aucune neuve ; la preuve que le compte mord est le test à deux événements.
- **Exclu** : un `auMoins` ou un `exactement` : personne ne les demande.

### Tâche 9. Une ancre qui ne viendra pas ne fait plus attendre 90 s (#73 ; piste C, la première)

- [ ] **Fichiers** : `src/presence/chaine.test.ts` (`partieFinie`, `:899-921` ; son test, `:321-339`).
- **Ce qui change** : la partie ne compte plus que les sons posés, et non ceux du plan (`:913`). Une parole ancrée
  qui n'a pas sa fin quand tout le reste est fini (`finApresMs` après la dernière fin, aucune réponse en cours, sa
  voix calme) est sautée : `fin()` de la sonde écrit déjà `parole_sautee` (`sonde.ts:328-331`). C'est la règle du
  joueur exact (`player.ts:20-29`).
- **Tests** : à côté de celui de `:321`, un plan de deux paroles, la seconde ancrée sur `envoi: 1`, aucun envoi au
  journal : `partieFinie` est vrai `finApresMs` après la fin de la première, sa voix calme. Un second : l'ancre vient
  avant cet instant, la partie attend la fin de la seconde. Sur `main`, le premier rate.
- **Preuve** : `npm test -- src/presence/chaine.test.ts`.
- **Exclu** : la sonde ; le plafond, qui reste.

### Tâche 10. `CHAINE_TTS` et l'interface du serveur compatible (#101, #79 ; piste C, après la 9)

- [ ] **Fichiers** : `src/presence/chaine.test.ts` (`:466-467`, `beforeAll`, `:553-593`), `docs/README.md` (une
  section « La chaîne », après « Mesures »), le `CLAUDE.md` de Lun'Luxuria si sa ligne sur la chaîne renvoie à la
  section.
- **Ce qui change** :
  - avant de lancer le service, `beforeAll` vérifie que le `.onnx` de `CHAINE_TTS` existe ; sinon il lève « Voix
    introuvable : <chemin>. Règle CHAINE_TTS (depuis un worktree, le défaut vise un dossier qui n'existe pas). » ;
  - la section dit le défaut, d'où il se résout, et comment le régler sous PowerShell, une commande par ligne ;
  - elle écrit l'interface du serveur compatible, depuis ce que le code en lit (« Ce que le code fait aujourd'hui ») :
    l'appairage, `partie.json`, le journal et ses noms de lignes, `parle`, l'API de « Relié ». Sans adresse : « son
    adresse fixe, dans `chaine.test.ts` ».
- **Test** : aucun test automatique ; la preuve est `npm run chaine` lancé depuis un worktree sans `CHAINE_TTS`, qui
  rend le message, puis avec, qui joue.
- **Exclu** : chercher Piper depuis le dépôt principal ; le banc des gestes.

### Tâche 11. Un son posé qui manque ne passe plus à la synthèse (#81, #101 ; piste C, après la 10)

- [ ] **Fichiers** : `src/presence/scenario.ts` (`Parole`, `:134-149`), `src/presence/chaine/sons.ts`
  (`sonDeParole`, `:137-158`), `src/presence/chaine/sons.test.ts`, `src/presence/scenarios/non-court.ts:24`.
- **Ce qui change** : `Parole.pose?: true`, « ce son se pose à la main ». En mode posé, une telle parole sans son
  fichier rend `{ manque: 'son posé manquant : <nom>.wav' }`, comme une toux ; la partie n'est pas jouée et le relevé
  le dit. Avec `CHAINE_VOIX`, rien ne change : chaque voix dit chaque parole (`chaine.test.ts:478-479`). La parole
  « Non » de `non-court` reçoit `pose: true`.
- **Tests** : `sons.test.ts`, un dossier sans `non.wav` : `manque` ; avec : `pose:non.wav` ; avec `poses` à faux :
  la voix. Sur `main`, le premier rate (la synthèse est prise).
- **Exclu** : une liste de sons attendus hors des scénarios.

### Tâche 12. Les trois sons au banc (point (b) ; testeur, hors dépôt)

- [ ] **Après l'accord de CrOliX sur (b)** : copier, sans déplacer, sous PowerShell, une commande par ligne, depuis
  `banc-sons` :

  ```powershell
  Copy-Item gestes\prises\toux-longue-1.wav chaine\sons\toux.wav
  Copy-Item gestes\prises\toux-courte-1.wav chaine\sons\toux-courte.wav
  Copy-Item gestes\prises\toux-longue-2.wav chaine\sons\bruit.wav
  ```

- **Vérifier** que chacun tient sa durée une fois rogné (450 ms pour `toux` et `bruit`, 300 pour `toux-courte`) :
  `CHAINE_SCENARIOS` réglé sur les sept scénarios de toux, puis `npm run chaine` ; un son trop court est nommé par
  `coupe` (`sons.ts:129-135`). Trop court : l'autre prise du même mot.
- **Rend** : la liste des sept scénarios joués ou non, et pourquoi.
- **Exclu** : tout son dans le dépôt ; une prise neuve.

### Tâche 13. Le numéro du refus, écarté par écrit (#81, point (e))

- [ ] **Fichiers** : `src/presence/fakes.ts:169`.
- **Ce qui change** : un commentaire `shortcut:` sur la ligne : un refus consomme un numéro ; à revoir si un scénario
  lit le numéro d'une réponse après un refus. Avec l'autre voie de (e), cette tâche est réécrite ici avant le code.
- **Preuve** : `npm run scenarios`, aucun verdict changé.

### Tâche 14. Le témoin Chromium : le recalage vérifié (#69 ; testeur, mesure)

- [ ] **Établir** : sur une partie `deux-phrases` de la chaîne, l'instant de la première trame non silencieuse que la
  page reçoit (`__premiere`), l'instant où la page a ouvert le micro, et l'écart entre les deux, à comparer aux
  8 000 ms de silence du fichier (`sons.ts:221`). Puis l'écart du témoin à la sonde, déjà au relevé.
- **Comment** : `CHAINE_SCENARIOS` réglé sur `deux-phrases`, puis `npm run chaine`, trois fois. Les instants se lisent
  en ajoutant, le temps de la mesure et sans commit, un `console.log` à `chaine.test.ts:682`.
- **Rend**, dans cette tâche et dans #69 : si le décalage presque constant (jusqu'à 74 ms) vient du recalage (la
  première trame arrive après le début du son), ou d'ailleurs ; ce qui n'est pas établi s'écrit tel quel.
- **Exclu** : changer le recalage. Si la mesure le montre faux, une issue neuve.

### Tâche 15. La recette « vu rater sur `main` » (#81, point (f))

- [ ] **Fichiers** : `tools/sur-main.mjs` (neuf), `docs/README.md` (sa ligne, sous « Mesures » ou dans la section de
  la tâche 10), le `CLAUDE.md` de Lun'Luxuria si une ligne y suffit.
- **Ce qui change** : `node tools/sur-main.mjs <test> [<test>…]` fait ce que dit (f), et rend le code de sortie de
  Vitest. Le worktree temporaire est retiré même en cas d'échec.
- **Test** : une assertion en tête sur la partie pure (la liste des fichiers copiés, les arguments de Vitest).
  **Preuve** : lancé sur un test écrit pour rater sur `main`, il rate et affiche le message ; sur un test qui y
  passe, il passe.
- **Exclu** : `npm ci` dans le worktree ; tout autre dépôt.

### Tâche 16. L'invariant joue des phrases tenues et non tenues (#101 ; après la tâche 1)

- [ ] **Fichiers** : `src/conversation.test.ts` (`errorRuns`, `:887-905` ; le jeu des phrases, `:957-970`).
- **Ce qui change** : une dimension `held`, vrai ou faux. Fausse, une phrase passe par `start`, puis sa fin, sans
  `held`. Les mêmes assertions.
- **Budget** : `npm test` reste sous celui de la tâche 1. S'il le dépasse, la dimension se joue sur une ligne sur
  deux, comme `someLines` (`:903`), et la tâche le dit.
- **Sur `main`** : l'invariant passe déjà sur les phrases tenues ; sur les autres, s'il rate, c'est un écart du code :
  une issue, et le cas sort de l'invariant en `it.fails` nommant l'issue.
- **Exclu** : le code de la conversation.

### Tâche 17. Les fenêtres, #70 et la ligne de base (testeur ; après les pistes B et C et la tâche 12)

- [ ] **Avec (c)** : un commentaire dans `non-court.ts`, `arrete-net.ts` et `faire-taire.ts`, sur les lignes de #70 :
  mesures à la chaîne, ce que la chaîne tient est en `tous` (qui le dit). Avec l'autre voie, la tâche est réécrite.
- [ ] **La ligne de base** de `arrete-puis-question`, et des sept scénarios de toux, trente parties avec Hortense,
  sous PowerShell, une commande par ligne :

  ```powershell
  $s = 'arrete-puis-question,deux-reponses,reponse-vide-puis-toux,toux-courte,toux-parole,toux-reflexion'
  $s += ',toux-verdict-tardif,toux-puis-parole,toux-puis-parole-tard'
  $env:CHAINE_SCENARIOS = $s
  Remove-Variable s
  $env:CHAINE_REPETITIONS = '30'
  npm run chaine
  Remove-Item Env:CHAINE_REPETITIONS
  Remove-Item Env:CHAINE_SCENARIOS
  ```

- [ ] **Les fenêtres proches d'un bord** : `phrase-2-recue` et `son-1-encore` de `deux-reponses`, relues sur ces
  trente parties. Une borne se revoit si elle ne vient d'aucun calcul du scénario ; elle se récrit alors depuis ce
  que le mécanisme doit tenir, le calcul en commentaire. Une borne calculée qui rate est un écart : une issue et un
  `connus`, jamais une borne élargie (`CLAUDE.md`).
- **Rend** : `releve-taux.md` résumé ici (taux par attente `tous`), et chaque borne revue avec sa raison.
- **Exclu** : la robustesse par voix, qui n'est pas un critère.

### Tâche 18. La fin

- [ ] `npm run chaine`, une partie par scénario avec Hortense : aucun échec nouveau contre la chaîne du 18/11 ; les
  sept scénarios de toux joués.
- [ ] La relecture du diff entier (reviewer), contre ce plan et ses critères.
- [ ] Les issues : chaque issue reprise reçoit son commentaire de clôture avec la preuve ; #81 a sa section cochée ;
  #60 suit le point (a).

## Risques

- **Les toux de CrOliX rognées trop court.** `coupe` refuse un son plus court que sa durée (`sons.ts:132-133`).
  Parade : l'autre prise du même mot (tâche 12) ; sinon une prise neuve, et (b) se rouvre.
- **Les sept scénarios de toux rateront peut-être à la chaîne.** Ils n'y ont jamais été joués. `toux-puis-parole` a
  108 ms de marge au niveau exact, contre 43 à 82 ms de retard des tenues à la chaîne le 12/11 (plan « le tour »,
  tâche 4). Un raté là est une observation pour #63, hors périmètre : il s'écrit, il ne se corrige pas ici.
- **Sauter une ancre plus tôt peut sauter une parole qui serait venue.** Une transcription plus lente que
  `finApresMs` (5 s) après le dernier son ferait partir l'envoi trop tard. Parade : `reponses().enCours` attend déjà
  une réponse en route ; le test de la tâche 9 tient le cas d'une ancre venue à temps.
- **La durée de `npm test`.** L'invariant de « le tour » a déjà doublé une fois (30 s à 53 s). Parade : le budget de
  la tâche 1, et la moitié des lignes.
- **Trois tâches changent le compte des scénarios** (6, 7, et toute issue neuve) : `scenarios.test.ts:30` passe de
  30 à 35. Piste B, dans l'ordre : la dernière fusionnée fixe le compte.
- **La CI de Python** : `soundfile` demande `libsndfile`, que sa roue Linux embarque d'après sa documentation, non
  vérifié ici. Si le job rate pour cela, une ligne `apt-get` ; rien d'autre.
- **Un champ de scénario qui ne se joue qu'au niveau exact** (`leve`, `fin`, `absence`) : `pourquoiPas` le refuse à
  la chaîne. S'il était oublié, la chaîne jouerait un scénario qu'elle ne peut pas tenir. Parade : un test de
  `pourquoiPas` par champ, dans les tâches 6 et 7.

## Limites

- Non vérifié dans le code : que le vrai serveur de la chaîne accepte `parle` avec `pourquoi: 'p0'`. Le scénario
  d'urgence se joue d'abord au niveau exact ; à la chaîne, la première partie le dira.
- Non vérifié : la durée rognée des prises de toux ; que le test Python passe sous Linux ; ce que le vrai serveur fait
  du numéro d'un refus.
- Les mesures de ce chantier se prennent sur le laptop : aucune ne vaut pour la latence du desktop.
