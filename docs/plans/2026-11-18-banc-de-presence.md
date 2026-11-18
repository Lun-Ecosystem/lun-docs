# Le banc de présence : sons, fausses briques, juge et outillage. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** lun-luxuria#104 (chapeau, `niveau:standard`) ; lun-luxuria#60, #67, #68, #69, #70, #73, #74, #75, #85,
> #101 ; la section « Tests et outillage » de #81 ; la case restante de #79.
>
> **État : rédigé le 18/11, contesté (plan-challenger) et amendé le 18/11 ; à valider par CrOliX.** Les points à
> trancher ont chacun leur **[avis]**. La dernière section dit ce que la contestation a changé, objection par
> objection.
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
dépôt » ; `standards/workflow.md:66-68` : « En parallèle, seulement ce qui est indépendant (deux dépôts, deux tâches
sans fichier commun) ».

**Critères de fin**, ceux du chapeau, figés. Chacun se vérifie en local, par une commande :

1. **Les sons** : la chaîne joue les scénarios de toux (`bruit.wav`, `toux.wav`, `toux-courte.wav` posés au banc) ;
   quand un son posé manque, elle le dit ou refuse de jouer, au lieu de prendre la synthèse sans rien dire. Tâches 9
   et 11.
2. **`CHAINE_TTS`** : le défaut trouve Piper depuis un worktree, ou la doc dit comment le régler. Tâche 8.
3. **Les fausses briques** : durée de synthèse par phrase ; un flux qui lève après le numéro, et après son `done` ;
   une erreur avant la fin de parole. Q7, I12 et Q8 joués chacun par un scénario. Tâche 3.
4. **Les scénarios manquants** : l'absence ; une urgence pendant un son ; l'invariant joue des phrases tenues et non
   tenues. Tâches 4 et 10.
5. **Le juge** : « au plus n », ancré sur un événement ; `hesite-puis-demande` perd sa fenêtre fixe de 2 880 ms
   (tâche 5). Les attentes `exact` trop justes tranchées (tâche 9), les fenêtres proches d'un bord revues,
   `arrete-puis-question` a sa ligne de base (tâche 12).
6. **Le lanceur** : une parole ancrée sur un envoi qui ne viendra pas est sautée tout de suite. Tâche 7.
7. **Les sorties** : `npm run banc` et `npm run scenarios` montrent leur résumé sous un agent, `npm run banc` saute
   `chaine/` et `scenarios/` (tâche 1) ; les mutations lisent des verdicts en JSON (tâche 2).
8. **La CI** : `voix/test_service.py` tourne quelque part. Tâche 6.
9. **Le témoin Chromium** : le recalage du départ vérifié, et le résultat écrit. Tâche 12.
10. **L'outillage de #81** : la recette « vu rater sur `main` » (tâche 8, point (f)) ; la durée de `npm test`
    mesurée (tâche 10) ; le numéro consommé par le faux serveur, écarté par écrit (tâche 3, point (e)).
11. **La doc** : l'interface du serveur compatible de la chaîne dans `docs/README.md`. Tâche 8.
12. **Le déroulé depuis la fenêtre** (#60) : CrOliX décide s'il entre ici ou à la session du desktop (point (a)).

Barrières à la fin : `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check` ; `npm run scenarios`,
chaque scénario joué deux fois à l'identique, tous tenus ou connus ; `npm run mutations`, chaque mutation sur son
maillon ; `npm run chaine`, une partie par scénario avec Hortense, lue selon « La règle de la chaîne » plus bas.

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
- l'écho dans la chaîne (`pourquoiPas`, `src/presence/chaine.test.ts:134`), qui demande un vrai micro ;
- un outil pour la recette « vu rater sur `main` » (point (f)).

## La règle de la chaîne

La chaîne du 18/11 est la référence : `banc-sons/chaine/le-tour-1811/chaine/releve-chaine.md`, 14 scénarios joués,
tous tenus au niveau `tous`, 16 non joués. Avec une partie par scénario, une attente qui rate fait échouer son test
(`chaine.test.ts:827-829`). La barrière se lit sur le relevé, pas sur le code de sortie :

- **les 14 scénarios joués le 18/11** : aucun verdict `tous` ne change. Un changement bloque la PR ;
- **les scénarios jamais joués à la chaîne** (les sept de toux, ceux des tâches 3 et 4 que `pourquoiPas` laisse
  passer) : une attente `tous` qui rate s'écrit dans la tâche 12, avec l'issue ouverte pour elle et la ligne du
  relevé. Elle ne bloque pas la PR. Elle ne devient pas un `connus` : au niveau exact, l'attente tient, et un
  `connus` qui tient n'est plus conforme (`src/presence/judge.ts:343-347`), ce qui casserait `npm test`.

## Le dossier du banc

- Le défaut `../banc-sons` se résout depuis le dossier de lancement (`chaine.test.ts:464`, `scenarios.test.ts:17`,
  `banc.test.ts:175`) : depuis un worktree sous `wt/`, il vise un dossier qui n'existe pas, comme `CHAINE_TTS`.
- La chaîne du 18/11 a tourné avec `BANC_DIR` réglé sur `banc-sons/chaine/le-tour-1811` : son `chaine/sons/` tient
  `non.wav` et le cache `sapi/`, son `chaine/serveur/` le code et le journal. `banc-sons/chaine/sons/` est un autre
  dossier.
- `beforeAll` crée `BANC_DIR/chaine` sans rien dire (`chaine.test.ts:564`), puis échoue en lisant `serveur/code`
  (`:583`) si le serveur de la chaîne a été lancé sur un autre dossier.
- **Le `BANC_DIR` des parties de référence de ce chantier** : `banc-sons/chaine/banc-de-presence`. La tâche 11 le
  crée depuis le dossier du 18/11 (ses sons et son cache) et y pose les trois toux. Le serveur de la chaîne est lancé
  sur `banc-sons/chaine/banc-de-presence/chaine`, le même dossier que la chaîne lit.

## Ce que le code fait aujourd'hui

Chemins de lun-luxuria, sur `main` (`1d07678`).

### Les sons de la chaîne

- Une parole entre parenthèses (une toux) lit toujours son fichier `sons/<nom>.wav`, rogné de ses bords puis coupé à
  sa durée et refusé plus court ; absent, la partie n'est pas jouée et le relevé dit « son manquant »
  (`src/presence/chaine/sons.ts:129-144`). Les silences entre deux quintes restent. Un bruit lit `bruit.wav` de même
  (`:170-174`). Le refus passe par `planDePartie` (`:189-191`), puis `jeu` rend la raison (`chaine.test.ts:741-743`).
- Une parole ordinaire, en mode posé (`POSES`, sans `CHAINE_VOIX`, `chaine.test.ts:479`), prend `sons/<nom>.wav` s'il
  existe, sinon le cache de la voix, sinon sa synthèse (`sons.ts:141-157`). Rien ne dit qu'un son devait être posé :
  c'est le cas de #81, « non » manquant. La source de chaque son est écrite dans `resultats.jsonl`
  (`src/presence/taux.ts:92`), que personne ne lit pendant une partie.
- **Sept scénarios** demandent un son de toux ou de bruit. Cinq ont une parole `(toux)` ou `(toux courte)` :
  `reponse-vide-puis-toux`, `toux-courte`, `toux-parole`, `toux-reflexion`, `toux-verdict-tardif`. Deux ont un
  `bruits` : `toux-puis-parole`, `toux-puis-parole-tard`. Le relevé du 18/11 les liste tous les sept en « son
  manquant ». Les scénarios supposent une voix continue d'au moins 384 ms (`toux-puis-parole.ts:11`) et une
  transcription vide.
- Le banc des gestes a des toux réelles : `gestes/prises/toux-longue-1.wav`, `-2.wav` (« toux d'au moins 450 ms »,
  `gestes/mots.json`), `toux-courte-1.wav`, `-2.wav` (« au moins 300 ms »), et `raclement`, `souffle`, `clavier`.
  Leurs en-têtes disent 1,3 à 2,3 s, silences compris ; ce que la détection en fait n'est pas vérifié.

### `CHAINE_TTS` et le serveur de la chaîne

- Le défaut est `piper:${resolve('../../piper/fr_FR-siwis-medium.onnx')}`, résolu depuis le dossier de lancement
  (`chaine.test.ts:466-467`, un `shortcut:` le dit). Depuis `wt/<nom>/`, il vise un dossier qui n'existe pas. Le
  service de voix sort alors en code 1, et `attendre` dit seulement « son processus s'est arrêté (code 1) » (`:505`).
  `CHAINE_TTS` peut aussi valoir une autre brique que Piper (`voix/service.py:319`).
- `docs/README.md` n'a aucune section sur la chaîne : seul le `CLAUDE.md` la décrit. Ce que Luxuria attend du
  serveur compatible, d'après le code de la chaîne :
  - qu'il réponde à `GET` sur son adresse fixe (`chaine.test.ts:469`, `:554-563`) ;
  - qu'il écrive un code dans `BANC_DIR/chaine/serveur/code`, et rende `{ token }` à `POST /api/pair { code, client }`
    (`:583-590`) ;
  - qu'il lise `serveur/partie.json`, `{ nom, reponses }`, écrit avant chaque partie (`:614`), et que son faux modèle
    réponde à chaque texte reçu par la `Reponse` que choisit `choisir` (`src/presence/scenario.ts:313-315`) ;
  - qu'il écrive `serveur/journal.jsonl`, une ligne `{ partie, t, name, ... }` par événement : `envoi_recu`,
    `coupure_recue`, `retrait_recu`, `modele_appele`, `modele_inattendu` (`:47-61`, `:714-720`), et `parle_recu`
    pour un mot à elle ; aucun `envoi_recu` pour un envoi qu'il refuse ;
  - qu'il accepte `POST /api/chaine/parle { pourquoi, phrases }`, porteur du jeton (`:696-700`) : `pourquoi` parmi
    `ritual`, `p0`, `spontaneous` ; de 1 à 20 phrases, chacune de 1 à 2 000 caractères ; aucune autre clé ;
  - qu'il serve l'API de « Relié » (`docs/README.md:196-207`).

### Les fausses briques

- La synthèse dure `voix.syntheseMs` pour toutes les phrases (`src/presence/fakes.ts:80`) ; la chaîne sert la même
  durée par sa route de `/voix/tts` (`chaine.test.ts:657-663`).
- `FauxServeur.send` ne lève qu'au refus, avant tout événement (`fakes.ts:173`). Il envoie toujours `speech-end`
  avant le `done`, même en erreur (`:206-215`). Aucun scénario ne joue donc Q7 (erreur, puis aucune fin de parole),
  I12 (flux qui lève après le numéro) ni Q8 (`done` en erreur, puis flux qui lève). Les tests de la conversation les
  tiennent (`src/conversation.test.ts:1773` et suivantes).
- Le faux serveur numérote à la réception (`fakes.ts:169`), avant le refus (`:173`) : un refus consomme un numéro.
  Sans effet sur les verdicts d'aujourd'hui : `fragment-refuse` nomme ses réponses par leur rang d'envoi
  (`judge.ts:138-145`).
- Le joueur ne donne à la conversation ni `ready` ni les réglages d'une absence (`src/presence/player.ts:78-88`). La
  session, absente et reliée, coupe l'essai (`src/session.svelte.ts:295-300`) et fait attendre l'envoi sur le retour,
  au plus `BACK_WAIT_MS` (3 s, `:38`, `:305`, `:435-450`). Aucun scénario ne joue l'absence.
- Une parole spontanée `p0` passe devant les tours qui attendent (`src/conversation.ts:178`,
  `src/speech/speaker.ts:106-113`). `modele.parle` la dit déjà (`scenario.ts:181-185`), mais à un instant fixe, sans
  ancre ; la chaîne la demande au serveur à cet instant (`sesMots`, `chaine.test.ts:880-893`), et le faux serveur
  l'envoie phrase par phrase quand le serveur de la chaîne la dit d'un tenant. Aucun scénario ne s'en sert en `p0`.
- L'invariant des réponses en erreur (`conversation.test.ts:887-905`) joue chaque phrase par `start`, `held`, puis
  `noise` ou la fin (`:963-966`) : toujours tenue.

### Le juge et les scénarios

- Une attente sur un événement dit « au moins un » ou, `absent`, « aucun dans la fenêtre » (`judge.ts:276-287`). Rien
  ne compte. `hesite-puis-demande/rien-de-l-essai-retire` garde une fenêtre fixe `[0, 2880]` depuis le début de la
  parole (`src/presence/scenarios/hesite-puis-demande.ts:94-104`).
- Au niveau de la chaîne, une attente `exact` est une mesure : elle ne fait jamais échouer (`judge.ts:44-53`, `:330`).
  Les lignes de #70 : `coupee` et `coupure-recue` de `non-court` (`non-court.ts:71-85`) et de `arrete-net`
  (`arrete-net.ts:71-85`), `sortie-arretee` de `faire-taire` `[0, 32]` (`faire-taire.ts:43-51`). En `tous`,
  `non-court` n'a que `pour-de-bon` (`:86-96`), `arrete-net` a `silence-coupe` (`:87-95`) : aucun des deux ne prouve en
  `tous` que la coupure arrive au serveur. `faire-taire` le prouve (`coupure-recue`, `:92-98`, sans borne ni ancre,
  comme `charger` l'exige à la chaîne, `scenario.ts:415-424`).
- Les fenêtres proches d'un bord : `deux-reponses`, `phrase-2-recue` `[3000, 5500]` et `son-1-encore` `[1, 3000]`,
  toutes deux `tous` (`deux-reponses.ts:41-59`).
- `scenarios.test.ts:30` attend trente scénarios ; `chaine.test.ts:353-369` attend exactement neuf scénarios refusés
  par `pourquoiPas`, avec leurs raisons.

### Le lanceur, les sorties, la CI

- La sonde écrit la fin d'un son dès qu'il est posé (`src/presence/chaine/sonde.ts:296-297`) ; une parole ancrée
  n'est posée qu'à son ancre. La partie attend que tous les sons du plan aient leur fin (`chaine.test.ts:911-913`) :
  une ancre qui ne vient pas fait attendre le plafond de 90 s (`:489`, `:908`), puis `fin()` écrit `parole_sautee`
  (`sonde.ts:328-331`). `reponses().enCours` ne compte que les envois déjà partis (`sonde.ts:155-158`, `:322-326`) :
  une transcription en cours n'y est pas. Le joueur exact, lui, finit à l'horloge seule (`player.ts:20-29`, `:166`).
- Une attente `absent` sans `entre` court jusqu'à la fin de la partie (`judge.ts:274`).
- `npm run banc` saute `gestes/` seul, au premier niveau (`src/listen/banc.test.ts:182-188`, test `:194-205`).
- `npm run banc` et `npm run scenarios` n'ont pas de `--reporter` (`package.json:21`, `:23`) ; `npm run gestes` et
  `npm run chaine` ont `--reporter=default` (`:22`, `:25`). Leurs résumés sont des `console.log` (`banc.test.ts:275`,
  `:356`, `scenarios.test.ts:137`).
- `npm run mutations` lit `releve-scenarios.md` colonne par colonne (`tools/mutations.mjs:18-33`), lance Vitest
  lui-même, sans le script (`:47-52`), et juge une mutation sur le maillon que nomme la majorité des échecs (`:75-77`).
- La CI lance `npm test`, `npm run build` et `npm run mutations` sur Ubuntu, `cargo` sur Windows
  (`.github/workflows/ci.yml`). Rien n'y lance Python. `voix/test_service.py` dit sa commande en tête (`:1-5`) et
  finit par `print("ok")` ; `voix/service.py` demande Python 3.12 ou plus (`:2`).
- Le témoin `deux-phrases` est un WAV avec 8 000 ms de silence en tête (`sons.ts:217-237`). La page note seulement
  l'instant de sa première trame non silencieuse, `__premiere` (`chaine.test.ts:864-877`) ; le départ s'en déduit
  (`:677-682`). Rien ne note quand `getUserMedia` répond.
- Le `CLAUDE.md` de Lun'Luxuria fait 98 lignes sur 100 : chaque ligne ajoutée en remplace une.

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
  entre au § 4 de la feuille de route quand CrOliX le décide.
- L'autre voie : une tâche de plus ici, côté Rust (une commande qui ouvre la boîte et écrit le fichier), relue avec
  les règles de #87. Coût : le chantier touche `src-tauri/`, et sa preuve attend le desktop.

### (b) D'où viennent les trois sons de toux

- **[avis] Des prises qui existent déjà, passées d'abord au banc, puis copiées dans le dossier de référence.**
  `toux.wav` depuis `gestes/prises/toux-longue-1.wav`, `toux-courte.wav` depuis `toux-courte-1.wav`, `bruit.wav`
  depuis `toux-longue-2.wav` : les deux `bruits` des scénarios sont une toux de 450 ms (`toux-puis-parole.ts:26`). Ce
  sont de vraies toux de CrOliX, prises pour le banc des gestes ; elles restent hors dépôt. La tâche 11 vérifie
  d'abord ce que la détection en fait ; une prise qui ne tient pas cède la place à l'autre prise du même mot.
- L'autre voie : une prise neuve de CrOliX pour chacun, au micro du laptop. Coût : une séance.

### (c) #70 : attentes `tous` plus larges, ou mesures seulement

- **[avis] Les lignes `exact` restent des mesures, et deux attentes `tous` s'ajoutent.** Au niveau de la chaîne, une
  attente `exact` ne fait déjà jamais échouer (`judge.ts:330`) ; les mots entendus à ±1 mot dépendent de la voix
  réelle, une borne plus large n'y prouverait rien. Ce qui manque en `tous`, c'est que la coupure arrive au serveur
  dans `non-court` et `arrete-net` : une attente `coupure_recue`, `ou: { reponse: 1 }`, sans borne ni ancre, dans
  chacun, comme `faire-taire.ts:92-98`. Un commentaire sur chaque ligne de #70 dit qu'elle est une mesure à la chaîne.
- L'autre voie : une attente `tous` à bornes larges par ligne de #70. Coût : des bornes qui ne viennent d'aucun
  calcul.

### (d) #75 : le résumé écrit comme la chaîne, ou le reporter selon l'environnement

- **[avis] Comme la chaîne : `--reporter=default` dans les deux scripts.** C'est ce que font `chaine` et `gestes`
  (`package.json:22`, `:25`), et la CI n'est pas touchée (plus haut).
- L'autre voie : choisir le reporter selon une variable d'environnement, dans `vite.config.ts`. Coût : une règle de
  plus, pour un cas que la CI ne connaît pas.

### (e) #81 : le numéro que le faux serveur consomme à chaque refus

- **[avis] Écarté par écrit.** Luxuria n'attend aucun numéro d'un envoi refusé : la page n'en voit jamais
  (`docs/README.md:205`, le flux commence par `user`), et le serveur de la chaîne n'écrit aucun `envoi_recu` pour un
  envoi qu'il refuse. Un commentaire `shortcut:` sur `fakes.ts:169` le dit : sans effet, non observé ; à revoir si un
  scénario lit le numéro d'une réponse après un refus.
- L'autre voie : numéroter après le refus. Coût : `envoi_recu` d'un refus perd son `reponse`, le relevé de
  `fragment-refuse` change, pour un gain qui ne s'observe pas.

### (f) La recette « vu rater sur `main` » : écrite, ou outillée

- **[avis] La recette écrite**, quelques lignes dans la section « La chaîne » de `docs/README.md` (tâche 8) : un
  worktree détaché de `origin/main`, la jonction de `node_modules`, le réglage du `fs` de Vite que #81 nomme, les
  tests copiés, une commande par ligne. Un outil (worktree, jonction, `fs` de Vite, nettoyage) coûterait plus que la
  recette qu'il remplace. **CrOliX dit si « outillée », dans le critère 10, s'en contente.**
- L'autre voie : `tools/sur-main.mjs`, qui fait ces gestes et rend le code de Vitest. Coût : un outil de plus à tenir.

## Les tâches

Chaque tâche : le **testeur** écrit d'abord les tests, les voit rater sur `main` et colle le message d'échec dans la
tâche ; puis **dev-luxuria** écrit le code dans le worktree qu'on lui donne. Les tâches 11 et 12 sont au testeur seul.
Les noms des tests sont des avis ; leurs assertions ne le sont pas. Barrières de chaque tâche, une commande par
ligne :

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

**L'ordre**, selon `standards/workflow.md:66-68` : en parallèle, seulement des tâches sans fichier commun.

| Piste | Tâches, dans l'ordre | Ce qu'elles partagent |
| ----- | -------------------- | --------------------- |
| A | 1 | `package.json`, `banc.test.ts`, `CLAUDE.md` |
| B | 2, 3, 4, 5, 9 | `scenarios.test.ts`, `scenario.ts`, `fakes.ts`, `mutations.json`, `chaine.test.ts`, scénarios |
| C | 7, 8 | `chaine.test.ts`, `docs/README.md` |
| D | 6 | `ci.yml` |
| E | 10 | `conversation.test.ts` |
| F | 11 | `banc-sons` seul, hors dépôt |

- **Au départ, en parallèle** : les pistes A, D, E, F, et la tâche 2 de la piste B. Chacune dans son worktree, parti
  de `test/banc-de-presence`.
- **La piste C** touche `chaine.test.ts`, comme les tâches 3 et 4 (`pourquoiPas` et son test) : elle part après la
  tâche 4, ou la piste B attend la fin de la C. Avis : la C après la 4, et la 5 en parallèle de la C (`judge.ts`,
  `scenario.ts`, aucun fichier de la C).
- **La tâche 9** ferme la piste B, après la 5 (`scenario.ts`) ; elle ne touche pas `chaine.test.ts`, et tourne à côté
  de la piste C.
- **La tâche 12** après toutes les autres : elle joue la chaîne. **La tâche 13** ferme.
- Une seule PR ; `npm run mutations` se rejoue après chaque fusion.

### Tâche 1. Les sorties du banc (#85, #75, point (d))

- [ ] **Fichiers** : `src/listen/banc.test.ts` (`:182-188`, test `:194-205`), `package.json` (`:21`, `:23`), le
  `CLAUDE.md` de Lun'Luxuria (« L'écoute se rejoue », et la phrase « Son `--reporter=default` est voulu »).
- **Ce qui change** : au premier niveau, `chaine` et `scenarios` sont sautés comme `gestes`, le commentaire `:182` dit
  pourquoi (les sons et les sorties d'autres bancs). `--reporter=default` au bout des scripts `banc` et `scenarios`.
  Le `CLAUDE.md` reste sous 100 lignes : les deux phrases sont récrites, aucune n'est ajoutée.
- **Test** : celui de `:194` gagne `chaine/sons/x.wav` et `scenarios/y.wav` dans son dossier, et attend toujours
  `['a.wav', 'sous/b.wav']`. Sur `main`, il rate.
- **Preuve**, depuis un agent : `npm test -- src/listen/banc.test.ts` ; `npm run scenarios` affiche « Relevé et
  déroulés écrits dans … » ; `npm run banc` affiche les cinq premières lignes du relevé, ou « Pas de dossier
  d'enregistrements ».
- **Exclu** : `vite.config.ts` ; tout autre dossier sauté.

### Tâche 2. Les mutations lisent des verdicts en JSON (#67 ; piste B)

- [ ] **Fichiers** : `src/presence/scenarios.test.ts` (`afterAll`, `:132-138`), `tools/mutations.mjs` (`echecs`,
  `:18-44` ; `jouer`, `:47-64`).
- **Ce qui change** : en mode `scenarios`, `afterAll` écrit aussi `verdicts.json` à côté de `releve-scenarios.md` :
  pour chaque scénario, `{ nom, verdicts }`, les `Verdict` tels que `juger` les rend. `mutations.mjs` lit ce fichier.
  Un échec est un verdict ni tenu ni `connus` conforme : la règle d'aujourd'hui (`:28-29`), écrite sur les champs
  (`etat`, `connu.conforme`) et non sur les libellés.
- **Test** : l'assertion en tête de `mutations.mjs` (`:35-44`) passe sur un exemple en JSON, avec les mêmes trois cas
  (raté, tenu, tenu et connu ailleurs). Sur `main`, `echecs` lit du Markdown : l'assertion neuve rate.
- **Preuve** : `npm run mutations`, le même tableau qu'avant la tâche, ligne pour ligne.
- **Exclu** : le format de `releve-scenarios.md` ; la table `tools/mutations.json`.

### Tâche 3. Les fausses briques : Q7, I12, Q8 (#101, #81 ; piste B, après la 2)

- [ ] **Fichiers** : `src/presence/scenario.ts` (`Reponse`, `:158-175` ; `voix` de `Scenario`, `:290`),
  `src/presence/fakes.ts` (`synth`, `:79-87` ; `send`, `:167-216`), `src/presence/chaine.test.ts` (la route de
  `/voix/tts`, `:657-663` ; `pourquoiPas`, `:133-150` ; son test, `:353-369`), `src/presence/player.test.ts`, trois
  scénarios neufs, `src/presence/scenarios.test.ts:30`, `tools/mutations.json` si une mutation doit les viser.
- **Ce qui change**, trois champs, chacun optionnel, son défaut étant le comportement d'aujourd'hui :
  - `voix.syntheseMsPar`, texte → ms : la durée de synthèse d'une phrase donnée, lue par `synth` et par la route de la
    chaîne, comme `voix.echoue` est lu par texte ;
  - `Reponse.leve`, `'apres_numero'` ou `'apres_done'` : `send` lève à cet endroit ;
  - `Reponse.fin`, `'avant'` (aujourd'hui), `'apres'` (le `done` avant `speech-end`) ou `'jamais'` (pas de
    `speech-end`).
  `pourquoiPas` refuse à la chaîne un scénario avec `leve` ou `fin`, comme le refus (`:137-138`) : le vrai serveur ne
  le fait pas sur commande. Et le commentaire du point (e) sur `fakes.ts:169`.
- **Scénarios**, noms en avis : `erreur-sans-fin` (Q7 : une réponse en erreur après un tour relâché, `fin: 'jamais'` ;
  attendu : la réponse suivante sonne), `flux-casse-apres-numero` (I12 : `leve: 'apres_numero'` sur un fragment ;
  attendu : la réponse suivante sonne avant la garde de 60 s), `erreur-puis-flux-casse` (Q8 : `erreur` et
  `leve: 'apres_done'` ; attendu : un `sans_reponse`, puis `absent` d'un second, ancré sur le premier). Le calcul en
  tête de chacun, comme les autres.
- **`syntheseMsPar` sans scénario** : #101 demande la brique, pas un cas qui la joue, et aucun des trois scénarios
  n'en a besoin. Un test du joueur suffit : il prouve que la durée vaut pour la phrase nommée seule, et la route de la
  chaîne lit le même champ.
- **Tests** : `player.test.ts`, chaque champ sur un scénario minimal : la durée par phrase, le flux qui lève aux deux
  endroits, l'ordre `done` puis `speech-end`, l'absence de `speech-end`. `chaine.test.ts:353` : la liste des refusés
  gagne les trois scénarios et leur raison ; un test de `pourquoiPas` par champ (`leve`, `fin`).
- **Sur `main`** : les champs n'existent pas, le typage refuse les scénarios. Avec les champs, les trois scénarios
  devraient tenir : « le tour » a réglé Q7, Q8 et I12. Si l'un rate, c'est un écart du code : une issue et un
  `connus`.
- **Exclu** : le code de la conversation ; jouer ces scénarios à la chaîne ; numéroter après le refus.

### Tâche 4. L'absence, et une urgence pendant un son (#101 ; piste B, après la 3)

- [ ] **Fichiers** : `src/presence/scenario.ts` (`Scenario`, `:264-296` ; `BancNom`, `:31-64` ; `ECRIT_PAR`,
  `:87-101` ; `charger`), `src/presence/player.ts` (`partie`, `:78-88`), `src/presence/player.test.ts`, deux
  scénarios neufs, `src/presence/scenarios.test.ts:30`, `src/presence/chaine.test.ts` (`pourquoiPas` et son test,
  `:353-369`), `src/session.svelte.ts:38` si `BACK_WAIT_MS` s'exporte.
- **Ce qui change** :
  - `Scenario.absence?: { retourMs: number }` : la partie commence absente. Le joueur copie la session, avec un
    commentaire qui y renvoie (`session.svelte.ts:295-305`, `:435-450`), rien de plus : absente, `settings()` rend
    `speculate` à faux ; au premier `addressed`, la présence revient, une ligne `retour` au journal, et `ready()` rend
    une promesse qui se tient `retourMs` plus tard. La session borne cette attente à `BACK_WAIT_MS` : `charger`
    refuse un `retourMs` qui l'atteint. `BACK_WAIT_MS` est exporté et importé ; si l'import de `session.svelte.ts`
    tirait la page dans le joueur, la valeur passe dans un module sans Svelte que les deux importent ;
  - `retour` entre dans `BancNom` et dans `ECRIT_PAR`, au maillon `serveur` (le juge nomme l'auteur d'une ligne par
    cette table, `judge.ts:59-64`) ;
  - aucun champ pour l'urgence : `modele.parle` avec `pourquoi: 'p0'` la dit déjà.
  `pourquoiPas` refuse à la chaîne l'absence (la page n'y est jamais absente) et une parole `p0` : son instant est
  fixe et la réponse y arrive à un instant réel, et le serveur de la chaîne dit ses phrases d'un tenant. Les autres
  `modele.parle` restent jouées.
- **Scénarios** : `absente-puis-phrase` (attendus : l'essai ne part pas, `envoi_recu` après la ligne `retour`) ;
  `urgence-pendant-un-son` (une réponse de deux phrases, une parole `p0` pendant la première ; attendus : la phrase en
  cours n'est pas coupée, l'urgence sonne avant la phrase 2, `reponses_ensemble` à `[0, 0]`).
- **Tests** : `player.test.ts`, l'absence : sans `addressed`, aucune ligne `retour` ; avec, `ready` tient
  `retourMs`. `charger` refuse `retourMs: 3000`. `chaine.test.ts:353` : les deux scénarios et leurs raisons ; un test
  de `pourquoiPas` pour `absence` et pour `p0`.
- **Sur `main`** : le champ n'existe pas. `urgence-pendant-un-son` se joue sans code : s'il rate, c'est un écart du
  code, une issue et un `connus`.
- **Exclu** : la session, sauf l'export de sa constante ; l'absence et `p0` dans la chaîne.

### Tâche 5. Le juge compte : « au plus n » (#74 ; piste B, après la 4)

- [ ] **Fichiers** : `src/presence/scenario.ts` (`AttenduEvenement`, `:229-235` ; `charger`, `:392` et suivantes),
  `src/presence/judge.ts` (`:276-287`), `src/presence/releve.ts` si la colonne `Trouvé` doit dire un compte,
  `src/presence/judge.test.ts`, `src/presence/scenarios/hesite-puis-demande.ts`.
- **Ce qui change** : `auPlus?: number` sur une attente d'événement. Les événements qui conviennent, depuis l'ancre
  et dans `entre` s'il est donné, sont comptés ; plus de `auPlus`, l'attente rate en `en_trop`, `trouve` le compte.
  `charger` refuse `auPlus` avec `absent` (`absent` vaut `auPlus: 0`), et un `auPlus` négatif ou non entier.
- **Scénario** : `rien-de-l-essai-retire` se récrit en deux attentes `tous`. `une-reponse-apres-la-parole` :
  `premier_son` tenu, `depuis: { parole: 1, bord: 'fin' }`. `une-seule-reponse` : `premier_son`, `auPlus: 1`, sur
  toute la partie. Ensemble : rien ne sonne avant la fin de la parole, et une seule réponse sonne. Compter les `joue`
  serait faux : une phrase coupée à sa virgule en donne deux (`scenario.ts:324-338`).
- **Tests** : `judge.test.ts`, sur un banc écrit à la main : un événement, tenu ; deux, `en_trop` et `trouve: 2` ;
  ancré sur une autre attente, les événements d'avant l'ancre ne comptent pas.
- **Sur `main`** : le champ n'existe pas ; les tests ratent.
- **Mutation** : aucune neuve ; la preuve que le compte mord est le test à deux événements.
- **Exclu** : un `auMoins` ou un `exactement` : personne ne les demande.

### Tâche 6. `voix/test_service.py` en CI (#68 ; piste D)

- [ ] **Fichiers** : `.github/workflows/ci.yml` (un job neuf, `voix`, sur `ubuntu-latest`).
- **Ce qui change** : le job installe `uv` par l'action officielle d'Astral, à une version fixée, puis lance la
  commande de l'en-tête du fichier avec la version de Python que `service.py` demande :
  `uv run --python 3.12 --with numpy --with httpx --with soundfile python voix/test_service.py`.
- **Preuve** : en local, la même commande affiche `ok`, sous Windows. Sous Linux, la seule preuve est le job vert sur
  la PR.
- **Exclu** : faster-whisper et Piper (le test ne les charge pas) ; Windows ; un `pyproject.toml`.

### Tâche 7. Une ancre qui ne viendra pas ne fait plus attendre 90 s (#73 ; piste C, après la tâche 4)

- [ ] **Fichiers** : `src/presence/chaine.test.ts` (`partieFinie`, `:899-921` ; son test, `:321-339`).
- **Ce qui change** : la condition `fins.length < plan.poses.length` (`:913`) sort. La partie finit quand tous les
  sons posés ont fini depuis `finApresMs`, qu'aucune réponse n'est en cours et que sa voix est calme ; une parole
  ancrée encore en attente est alors sautée par `fin()` de la sonde (`sonde.ts:328-331`). Le plafond reste.
- **Limite, écrite dans le code** (`shortcut:`) : une transcription en cours n'est pas vue, `enCours` ne comptant
  que les envois partis. Un envoi qui partirait plus de `finApresMs` (5 s) après la fin du dernier son serait perdu,
  et sa parole ancrée sautée. Ce plan n'a pas la durée la plus longue d'une transcription à la chaîne : si un relevé
  montre une `parole_sautee` avec une transcription en cours, la sonde apprendra à lire les essais ouverts.
- **Effet sur le juge** : la partie finit plus tôt, et une attente `absent` sans `entre` court jusqu'à la fin de la
  partie (`judge.ts:274`) : sa fenêtre raccourcit d'autant, jusqu'à 85 s de moins pour une partie qui touchait le
  plafond. La tâche 12 relève les parties qui finissent ainsi.
- **Tests** : à côté de celui de `:321`, un plan de deux paroles, la seconde ancrée sur `envoi: 1`, aucun envoi au
  journal : `partieFinie` est vrai `finApresMs` après la fin de la première, sa voix calme. Un second : l'ancre vient
  avant cet instant, la partie attend la fin de la seconde. Sur `main`, le premier rate.
- **Preuve** : `npm test -- src/presence/chaine.test.ts`.
- **Exclu** : la sonde ; le plafond.

### Tâche 8. Le dossier, la voix, et la doc de la chaîne (#101, #79, #81 ; piste C, après la 7)

- [ ] **Fichiers** : `src/presence/chaine.test.ts` (`:464-467`, `beforeAll`, `:553-593`), `docs/README.md` (une
  section « La chaîne », après « Mesures »).
- **Ce qui change** :
  - avant de créer quoi que ce soit (`:564`), `beforeAll` vérifie que `BANC_DIR/chaine/serveur/code` existe ; sinon
    il lève « Pas de serveur de la chaîne sur <dossier> : règle BANC_DIR, et lance le serveur sur le même dossier
    (depuis un worktree, le défaut vise un dossier qui n'existe pas). » ;
  - pour une valeur `piper:` de `CHAINE_TTS`, il vérifie que le `.onnx` existe ; sinon « Voix introuvable : <chemin>.
    Règle CHAINE_TTS ». Les autres briques ne sont pas vérifiées : le service le dit au lancement ;
  - la section dit les défauts de `BANC_DIR` et de `CHAINE_TTS`, d'où ils se résolvent, comment les régler sous
    PowerShell, une commande par ligne, et le dossier de référence de ce chantier ;
  - elle écrit ce que Luxuria attend du serveur compatible, depuis « Ce que le code fait aujourd'hui », sans adresse :
    « son adresse fixe, dans `chaine.test.ts` » ;
  - elle écrit la recette « vu rater sur `main` » (point (f)), en quelques lignes.
- **Test** : aucun test automatique. Preuve : `npm run chaine` depuis un worktree, sans `BANC_DIR`, rend le premier
  message ; avec `BANC_DIR` et sans `CHAINE_TTS`, le second ; avec les deux, il joue.
- **Exclu** : chercher le banc ou Piper depuis le dépôt principal ; le banc des gestes ; le `CLAUDE.md`.

### Tâche 9. `non-court` et `arrete-net` : le son posé, et ce que #70 laisse (piste B, après la 5)

- [ ] **Fichiers** : `src/presence/scenario.ts` (`Parole`, `:134-149`), `src/presence/chaine/sons.ts`
  (`sonDeParole`, `:137-158`), `src/presence/chaine/sons.test.ts`, `src/presence/scenarios/non-court.ts`,
  `arrete-net.ts`, `faire-taire.ts`.
- **Ce qui change** :
  - `Parole.pose?: true`, « ce son se pose à la main ». En mode posé, une telle parole sans son fichier rend
    `{ manque: 'son posé manquant : <nom>.wav' }`, comme une toux ; la partie n'est pas jouée et le relevé le dit.
    Avec `CHAINE_VOIX`, rien ne change : chaque voix dit chaque parole (`chaine.test.ts:478-479`). « Non » de
    `non-court` reçoit `pose: true` ;
  - point (c) : `non-court` et `arrete-net` gagnent chacun une attente `tous` `coupure_recue`,
    `ou: { reponse: 1 }`, sans borne ni ancre, comme `faire-taire.ts:92-98` ; un commentaire sur chaque ligne de #70
    dit qu'elle est une mesure à la chaîne.
- **Tests** : `sons.test.ts`, un dossier sans `non.wav` : `manque` ; avec : `pose:non.wav` ; `poses` à faux : la
  voix. Sur `main`, le premier rate. Les deux attentes neuves tiennent au niveau exact.
- **Exclu** : une liste de sons attendus hors des scénarios ; élargir une borne.

### Tâche 10. L'invariant joue des phrases tenues et non tenues, et la durée de `npm test` (#101, #81 ; piste E)

- [ ] **Fichiers** : `src/conversation.test.ts` (`errorRuns` et `someLines`, `:887-905` ; le jeu des phrases,
  `:957-970`).
- **Ce qui change** : sans cas de plus, `held` alterne sur les lignes de `someLines` : une ligne sur deux tenue
  (`start`, `held`, puis la fin), l'autre non (`start`, puis la fin). Les mêmes assertions.
- **La mesure** : `npm test`, cinq fois sur `main`, puis cinq fois après la tâche, poste au calme ; la médiane et
  l'écart de chaque série, et les cinq fichiers les plus longs, écrits dans cette tâche. Le nombre de cas ne change
  pas : une différence plus grande que l'écart se dit et s'explique.
- **Sur `main`** : l'invariant passe sur les phrases tenues. Sur les autres, s'il rate, c'est un écart du code : une
  issue, et le cas en `it.fails` nommant l'issue.
- **Exclu** : le code de la conversation ; un outil de mesure.

### Tâche 11. Le dossier de référence et les trois sons (point (b) ; testeur, hors dépôt)

- [ ] **Après l'accord de CrOliX sur (b)**, sous PowerShell, une commande par ligne, depuis `banc-sons`. D'abord, ce
  que la détection fait des trois prises, sur un dossier temporaire :

  ```powershell
  New-Item -ItemType Directory -Force essai-toux
  Copy-Item gestes\prises\toux-longue-1.wav essai-toux\toux.wav
  Copy-Item gestes\prises\toux-courte-1.wav essai-toux\toux-courte.wav
  Copy-Item gestes\prises\toux-longue-2.wav essai-toux\bruit.wav
  ```

  Puis, depuis lun-luxuria, `BANC_DIR` réglé sur ce dossier, `npm run banc`. Chaque son doit tenir la tenue
  (au moins 384 ms de voix continue pour `toux` et `bruit`) ou non (`toux-courte`), comme ses scénarios le
  supposent. Une prise qui ne tient pas : l'autre prise du même mot. Le dossier temporaire est retiré ensuite.
- [ ] **Le dossier de référence**, `chaine\banc-de-presence`, depuis celui du 18/11, puis les trois sons retenus :

  ```powershell
  New-Item -ItemType Directory -Force chaine\banc-de-presence\chaine
  Copy-Item -Recurse chaine\le-tour-1811\chaine\sons chaine\banc-de-presence\chaine\sons
  Copy-Item gestes\prises\toux-longue-1.wav chaine\banc-de-presence\chaine\sons\toux.wav
  Copy-Item gestes\prises\toux-courte-1.wav chaine\banc-de-presence\chaine\sons\toux-courte.wav
  Copy-Item gestes\prises\toux-longue-2.wav chaine\banc-de-presence\chaine\sons\bruit.wav
  ```

- **Rend** : ce que `npm run banc` a trouvé pour chaque prise, et les prises retenues.
- **Exclu** : tout son dans le dépôt ; une prise neuve.

### Tâche 12. La séance de la chaîne (#69, #70, #101, la ligne de base ; testeur, après les tâches 1 à 11)

Le serveur de la chaîne lancé sur `banc-sons/chaine/banc-de-presence/chaine`, `BANC_DIR` réglé sur
`banc-sons/chaine/banc-de-presence`.

- [ ] **Le témoin** (#69) : `CHAINE_SCENARIOS` réglé sur `deux-phrases`, `npm run chaine`, trois fois. Le temps de
  la mesure, sans commit, le script de `PREMIERE_TRAME` (`chaine.test.ts:865-877`) note aussi l'instant où
  `getUserMedia` répond, et `:682` les écrit. Rend, ici et dans #69 : l'écart entre la réponse du micro et la
  première trame non silencieuse, contre les 8 000 ms de silence du fichier (`sons.ts:221`), et si le décalage
  presque constant (jusqu'à 74 ms) vient du recalage. Ce qui n'est pas établi s'écrit tel quel ; un recalage faux
  devient une issue.
- [ ] **La ligne de base** de `arrete-puis-question`, `deux-reponses` et des sept scénarios de toux, trente parties
  avec Hortense, une commande par ligne :

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
  que le mécanisme doit tenir, le calcul en commentaire. Une borne calculée qui rate est un écart : une issue, jamais
  une borne élargie. Les parties finies avant le plafond par la tâche 7 sont relevées.
- [ ] **La partie complète** : une partie par scénario avec Hortense, sans `CHAINE_SCENARIOS`, lue selon « La règle
  de la chaîne ».
- **Rend** : `releve-taux.md` résumé ici (taux par attente `tous`), chaque borne revue avec sa raison, et chaque
  attente neuve qui rate avec son issue.
- **Exclu** : la robustesse par voix, qui n'est pas un critère.

### Tâche 13. La fin

- [ ] La relecture du diff entier (reviewer), contre ce plan et ses critères.
- [ ] Les issues : chaque issue reprise reçoit son commentaire de clôture avec la preuve ; #81 a sa section cochée ;
  #60 suit la décision de CrOliX au point (a).

## Risques

- **Les toux de CrOliX ne tiennent pas comme les scénarios le supposent.** `coupe` garde les premières ms après le
  rognage des bords seulement (`sons.ts:130-134`) : les silences entre quintes restent. Parade : la tâche 11 passe
  les prises au banc avant de les poser ; sinon une prise neuve, et (b) se rouvre.
- **Les scénarios de toux rateront peut-être à la chaîne.** Ils n'y ont jamais été joués. `toux-puis-parole` a
  108 ms de marge au niveau exact, contre 43 à 82 ms de retard des tenues à la chaîne le 12/11 (plan « le tour »,
  tâche 4). Parade : « La règle de la chaîne », une issue par attente qui rate, sans correction ici.
- **La première chaîne avec les toux exerce `modele.parle` pour la première fois** : `reponse-vide-puis-toux`,
  `toux-puis-parole`, `toux-puis-parole-tard` et `toux-verdict-tardif` en ont une. Un refus du serveur fait échouer la
  partie (`chaine.test.ts:889-890`). Parade : la même règle ; un refus se lit dans le relevé, et une issue suit.
- **Sauter une ancre plus tôt** : la limite de la tâche 7, et des fenêtres `absent` plus courtes. Parade : la limite
  écrite, et la tâche 12 qui relève les parties concernées.
- **Cinq scénarios de plus peuvent faire basculer une mutation** : le maillon nommé est celui de la majorité des
  échecs (`tools/mutations.mjs:75-77`). Parade : la table suit ; jamais un scénario affaibli pour qu'une mutation
  meure.
- **Le compte des scénarios** passe de 30 à 35 (`scenarios.test.ts:30`), celui des refusés de 9 à 14
  (`chaine.test.ts:353-369`) : piste B, dans l'ordre, la dernière tâche fixe les comptes.
- **La CI de Python** : `soundfile` demande `libsndfile`, que sa roue Linux embarque d'après sa documentation, non
  vérifié ici. Si le job rate pour cela, une ligne `apt-get` ; rien d'autre.
- **Le `CLAUDE.md` de Lun'Luxuria** est à 98 lignes sur 100 : la tâche 1 récrit, n'ajoute pas.

## Limites

- Non vérifié : ce que la détection fait des prises de toux (tâche 11) ; que le test Python passe sous Linux (tâche
  6, la CI seule le dira).
- Les mesures de ce chantier se prennent sur le laptop : aucune ne vaut pour la latence du desktop.

## Contestation du 18/11

Le plan-challenger a fait dix-neuf objections, et une sur le critère 12. Toutes sont retenues, aucune n'est réfutée :
chacune a été relue dans le code.

1. La barrière finale se contredisait : **intégrée**, « La règle de la chaîne » (relevé du 18/11 cité ; pourquoi pas
   un `connus`).
2. Le dossier du banc : **intégrée**, « Le dossier du banc », tâches 8 et 11 ; le message nomme `BANC_DIR`.
3. Le parallélisme partageait des fichiers : **intégrée**, « L'ordre » (pistes sans fichier commun), tâches fondues.
4. Le test des neuf refusés de `pourquoiPas` : **intégrée**, tâches 3 et 4, avec un test par champ.
5. L'urgence à la chaîne : **intégrée**, tâche 4 (`p0` refusé par `pourquoiPas`) ; la limite sur `p0` retirée.
6. La tâche 9 (désormais 7) : **intégrée**, la condition retirée, la limite d'une transcription lente écrite, l'effet
   sur les fenêtres `absent` noté, la phrase sur le joueur exact corrigée.
7. Le point (c) : **intégrée**, deux attentes `tous` `coupure_recue` (tâche 9), « Le juge et les scénarios » corrigé.
8. Les toux d'abord au banc : **intégrée**, tâche 11, et le premier risque.
9. `tools/sur-main.mjs` : **intégrée**, l'outil retiré, la recette dans la tâche 8, le point (f) récrit.
10. L'invariant : **intégrée**, `held` alterne sur `someLines` sans cas de plus ; la mesure fondue dans la tâche 10.
11. `auPlus` seul laissait passer un son pendant la parole : **intégrée**, tâche 5, deux attentes.
12. L'absence copiée de la session : **intégrée**, tâche 4 (renvoi, `BACK_WAIT_MS`, `ECRIT_PAR`).
13. `syntheseMsPar` sans utilisateur : **intégrée**, tâche 3, pourquoi un test du joueur suffit.
14. Le contrôle de `CHAINE_TTS` et l'interface : **intégrée**, tâche 8 (`piper:` seulement), et « `CHAINE_TTS` et le
    serveur de la chaîne » (`parle_recu`, les bornes de `parle`).
15. Python 3.12 : **intégrée**, tâche 6, `--python 3.12` ; la CI, seule preuve sous Linux.
16. L'instant de `getUserMedia` : **intégrée**, tâche 12, le témoin.
17. Les mutations et `modele.parle` : **intégrée**, deux risques.
18. Le nombre de tâches : **intégrée**, treize tâches, chaque critère gardé (la liste des critères dit où).
19. Le commentaire du point (e) : **intégrée**, (e) dit ce que Luxuria attend du serveur, et garde « sans effet, non
    observé ».

Critère 12 : **intégrée**, il se lit comme une décision de CrOliX.
