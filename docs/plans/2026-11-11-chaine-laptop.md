# La chaîne sur le laptop : la page construite, un son pour micro, le vrai serveur, un faux modèle. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Palier 1 fait** : validé par CrOliX le 11/11 (« ok »), sans toux, et joué le même jour ; ses mesures sont
> écrites sous « Ce que la tâche 0 a mesuré ». **Palier 2 validé par CrOliX le 11/11 (« je valide »)**, avec chaque
> recommandation de « À trancher » : Piper (la fausse synthèse pour `oui-puis-reparler`), `tiny`, la source
> `transcription` seulement quand la réponse change, le son par la page et les ancres, la transcription vraie, les
> mutations dans la CI.
>
> **Deux paliers.** **Palier 1 : la tâche 0 seule**, une partie de bout en bout jetable, qui a mesuré ce que la suite
> suppose. **Palier 2 : les tâches 1 à 10.** Les quatre scénarios de toux attendent une toux.
>
> **Palier 2 codé et éprouvé le 11/11, fusionné le 12/11** : lun-luxuria#66, lun-anima#106 (voir « Ce que
> l'exécution a trouvé »). Les trois scénarios ajustés par B2 (`toux-parole`, `echo-fort`, `non-court`), sans borne
> élargie, sont validés par CrOliX le 12/11.
>
> **PR :** lun-luxuria#66, lun-anima#106, et celle-ci (lun-docs#162). Issues `inbox` : lun-luxuria#67
> à #72.

**But :** rejouer les scénarios écrits à travers la vraie chaîne, sans personne. La page construite tourne dans un
Chrome sans écran ; son micro est un son joué à des instants choisis ; elle parle au vrai serveur Lun'Anima, dont le
modèle est remplacé par une réponse écrite d'avance ; la transcription est la vraie. Le même juge lit le même déroulé
et rend, pour chaque attente de niveau `tous`, tenue ou ratée, son espèce et sa source. Pour chaque délai, le relevé
met côte à côte la valeur du niveau exact et celle de la chaîne : l'écart, et le maillon où il est né.

**Ce que cette étape règle.** Le doute de CrOliX : « tel quel je ne suis pas sûr de l'efficacité des tests de bout en
bout ». Le niveau exact prouve les mécanismes sur un câblage recopié de la session (`player.ts:57-84`) et des briques
fausses. Ce niveau-ci prouve que le vrai câblage, le vrai son, la vraie détection, la vraie transcription, le vrai
réseau et le vrai serveur les laissent jouer, et mesure ce que chacun coûte. Son oreille n'y ajoute rien : tout est
lu dans le déroulé.

**Source :** le cadrage [« Prouver la présence sans l'oreille »](../specs/2026-11-11-banc-presence-cadrage.md),
validé par CrOliX le 11/11 (lun-docs#161), § 3, § 4 pièce 3 (« la chaîne sur le laptop »), § 5 étape 3, § 6 (le faux
modèle pour les mécanismes, validé avec le cadrage), § 8 (la synthèse locale supposée). Les plans fusionnés
[du déroulé](2026-11-11-deroule-tour.md) et [des scénarios](2026-11-11-scenarios-presence.md), avec ce que leur
exécution a trouvé. Code relu sur `main` de Lun'Luxuria (`b1d8761`) et de Lun'Anima (`84618a3`). Références relues,
rien lancé : AIRI (`packages/testing-audio`, `packages/vitest-plugin-fakemic`), Pipecat (`evals/`), LiveKit Agents
(`tests/fake_*.py`), la preuve dans la page du 10/11 (un script hors dépôt, CDP brut). Plan relu par le
plan-challenger le 11/11 : « à amender », architecture tenue ; ses objections sont reprises (voir la fin).

**Critères de fin du palier 1 :**

- Une partie de `deux-phrases` a tourné de bout en bout sur le laptop, et chaque mesure de la tâche 0 est écrite
  dans ce plan, avec sa valeur et ce qu'elle change au palier 2.
- Rien n'est entré dans un dépôt : les scripts jetables vivent dans `banc-sons`, et en sont retirés à la fusion du
  palier 2.

**Critères de fin du palier 2 :**

- `npm run chaine` (Lun'Luxuria) construit la page, la sert, lance son propre service de voix, ouvre Chrome sans
  écran, et joue chaque scénario jouable à ce niveau contre un serveur lancé par `npm run chaine` (Lun'Anima). Une
  partie dure le temps réel du scénario ; la durée de la suite est mesurée et écrite ici.
- Aucun appel payant, aucune clé : le faux modèle répond dans le serveur, sans réseau. Le serveur de la chaîne tourne
  sur une base en mémoire, par un point d'entrée à lui ; `main.ts` n'est pas touché.
- Le micro de la page est un `MediaStream` fabriqué dans la page : chaque parole est un son posé à son instant, ou
  ancré sur un événement de la partie. Un scénario témoin passe aussi par le faux périphérique de Chromium, pour
  comparer ce que voit Silero. Aucun enregistrement de voix n'entre dans le dépôt, et la CI le vérifie.
- Deux horloges, comme le veut le cadrage (§ 3) : ce que la page décide, et ce qui sonne. La sonde date le premier et
  le dernier échantillon non silencieux de sa voix, sur l'horloge de la page.
- Le juge est le même. Au niveau de la chaîne, une attente `exact` n'échoue jamais : elle est rendue comme une
  mesure. Une attente `tous` ratée ou non jouée fait échouer la suite.
- Le relevé donne, par scénario : les verdicts ; pour chaque phrase, `dit`, `entendu` et la confiance ; les délais de
  chaque tour au niveau exact et à la chaîne, leur écart et son maillon ; les champs ignorés ; et pourquoi chaque
  scénario manquant manque.
- `npm run mutations` (Lun'Luxuria) mute le code au chargement, sans toucher un fichier, et échoue si une mutation
  survit ou ne nomme pas son maillon. Le bouton « Faire taire » a son scénario.
- `npm test` des deux dépôts ne change pas de durée de plus de cinq secondes ; aucun test de la chaîne n'y tourne.

| Dépôt, branche | Issue | PR | Niveau |
|---|---|---|---|
| `lun-luxuria`, `feat/chaine-laptop` | lun-luxuria#65 | lun-luxuria#66 | `standard` |
| `lun-anima`, `feat/chaine-laptop` | lun-anima#105 | lun-anima#106 | `standard` |
| `lun-docs`, `docs/deroule-tour` | les mêmes ; la tâche 0 n'en ouvre pas | lun-docs#162 | `trivial` |

## Ce que le code fait aujourd'hui

**Lun'Luxuria**

- **La page dans un onglet** parle au serveur par `/api` (`core.ts:51`, Bearer) et au service de voix par `/voix`
  (`voice.ts:15`, `:22`). Vite les relaie vers `CORE_URL` et `VOIX_URL` (`vite.config.ts:9-19`). Le jeton vit dans
  `localStorage['luxuria.token']`, les réglages dans `luxuria.settings`, le micro dans `luxuria.mic`
  (`session.svelte.ts:24-27`). Un onglet n'entre qu'après un clic (`session.svelte.ts:234-238`).
- **Le petit mode n'existe que dans la fenêtre** : dans un onglet, la disposition est toujours `scene`
  (`session.svelte.ts:69`).
- **Le micro** : `getUserMedia`, puis un `AudioContext` à 16 kHz et un worklet qui rend des trames de 512
  échantillons (`audio.ts:61-83`). Chaque trame passe par Silero (`session.svelte.ts:478-506`), dans l'ordre. La page
  sait enregistrer ce qu'elle entend (« Enregistrer un essai », `session.svelte.ts:509-520`, `Reglages.svelte:520`).
- **Sa voix** : `synthesize` rend des échantillons bruts et leur fréquence (`voice.ts:21-28`) ; `webOutput` les joue
  dans un `AudioBufferSourceNode` copié tel quel, et `heard()` lit `ctx.currentTime` (`audio.ts:4-43`).
- **Le service de voix** (`voix/service.py`) : `/stt` (faster-whisper ou whisper-server), `/tts` (Piper ou Kokoro,
  `--tts` obligatoire, `:313`). Il refuse toute origine hors de sa liste (`:32-39`), où une page servie sur un autre
  port que 5180 n'est pas. faster-whisper est appelé sans température (`:50`) : sur un son difficile, il réessaie à des
  températures plus hautes, par tirage, et ne rend pas deux fois le même texte.
- **Le déroulé** (`trace.ts`, format 2) garde les vingt derniers tours ; un bouton des réglages avancés de l'écoute
  l'exporte dans un onglet (`Reglages.svelte:592`). Le bouton « Faire taire » appelle `session.silence()`
  (`Scene.svelte:143`).
- **Le niveau exact** (`src/presence/`) : seize scénarios en données (`scenario.ts`), des briques fausses
  (`fakes.ts`), un joueur sur l'horloge fausse de vitest (`player.ts`, il importe `vi` : jamais en temps réel), un
  juge à règles (`judge.ts`), un relevé (`releve.ts`). Une parole a un instant absolu `a` (`scenario.ts:111-125`).
  Le juge résout `reponse: n` par le n-ième `envoi_recu` du journal du joueur (`judge.ts:122-130`).
- **Ce que les scénarios demandent à ce niveau** : 46 attentes `tous` sur 16 fichiers. Deux ne jouent que des
  briques fausses (`echo-fort`, `delai-modele-lent`). Deux sont en petit mode (`aparte-parole-longue`,
  `phrase-ecartee`). Quatre font tousser (`dit: '(toux)'`), et `toux-puis-parole` a un bruit et une parole à elle
  (`modele.parle`).
- **Les attentes qui lisent ce que le serveur a reçu** : parmi les scénarios jouables ici, quatre attentes `tous`
  (`couper-le-blanc/coupure-recue`, `deux-phrases/coupure-vide`, `oui-puis-reparler/coupure-vide`,
  `toux-reflexion/pas-de-coupure`). Aucune n'a de bornes ni ne sert d'ancre : leur instant ne compte pas, seuls leur
  présence et leur numéro de réponse comptent. `phrase-ecartee/rien-ne-part` en a, mais ce scénario n'est pas joué ici.
- **Les mutations** : un script hors dépôt mute neuf motifs, joue la suite, résume les sources ; il remet le fichier
  par `git checkout --`, ce qui efface aussi un travail non commité. La mutation f2 (le bouton qui n'arrête plus le
  son) survit : aucun scénario ne joue ce bouton.
- **La CI** (`.github/workflows/ci.yml`) ne vérifie pas qu'aucun son n'est suivi par git ; aucun ne l'est aujourd'hui.
- **Outillage** : vitest 5, jsdom ; ni Playwright ni navigateur piloté dans le dépôt.

**Lun'Anima**

- **Le modèle** passe par `ChatProvider` (`core/src/chat/provider.ts:53-59`). `createOpenAiProvider` accepte un
  `fetch` injecté (`openai.ts:34-40`) : c'est ainsi que les tests le branchent sur `FakeOpenAi`
  (`core/src/testing/fake-openai.ts:90`), qui rend du SSE comme OpenAI, tout d'un coup, sans délai.
- **L'assemblage de test** (`core/src/testing/harness.ts`) monte `createApp` (`app.ts:91`) sur une base en mémoire
  (`:60`), avec une horloge réglée à la main et `onTestFinished` de vitest (`:4`) : il ne sert pas hors d'un test.
- **Le démarrage du serveur** (`main.ts`) lit la clé et ne crée un fournisseur qu'avec elle (`:91-100`), et donne le
  premier code d'appairage par `bootstrapPairing` (`:264`, `auth/pairing.ts:151`), qui rend le code.
- **Les routes de la conversation** : l'envoi rend `user` puis `reply` `{ id }` en tête de son flux
  (`chat/routes.ts:116-117`), la coupure prend le numéro et ce qui a été entendu (`:60-67`), le retrait le numéro
  (`:69-74`). Toutes sont derrière le jeton (`app.ts:99`).
- **Les durées** d'une réponse sont mesurées sur `performance.now()` et jointes à `done` (`chat/service.ts:559-562`).
- **La présence** : un `started` avec `ritual` non faux compose un rituel par le modèle
  (`natsume/presence-routes.ts:41-44`) ; `chat.say` dit une phrase sans modèle (`:43`).

**Sur le laptop** (vérifié sans rien installer) : Chrome ; `uv` ; les modèles faster-whisper `small` (464 Mo) et
`tiny` (75 Mo) en cache ; les voix françaises de Windows Hortense (SAPI, lisible par `System.Speech`), Julie et Paul
(OneCore seulement) ; Piper et sa voix `fr_FR-siwis-medium` (63 Mo), hors des dépôts. Non vérifié : l'environnement
`uv` du service en cache.

## Ce que les références apportent

- **AIRI** : le fichier son devient le micro de Chromium (`--use-file-for-fake-audio-capture=<wav>%noloop`), la page
  est sondée par un script posé avant elle, le modèle est une réponse écrite. Un fichier par lancement de Chromium.
- **Pipecat** : un tour peut attendre ce que fait l'agent avant de parler ; la parole est synthétisée et gardée en
  cache.
- **LiveKit** : un veto sur l'état réel du serveur, qui peut faire échouer, jamais sauver.
- **La recherche du 11/11** (cadrage § 3) : remplacer `getUserMedia` pour piloter le son pendant l'essai ; mesurer
  ce qui s'entend, pas seulement ce qui est décidé ; la mise en garde d'EVA sur le recollage de deux horloges.

## Palier 1 : la tâche 0

0. - [x] **Une partie jetable, et ce qu'elle mesure** (`testeur`, avec des scripts jetables dans
   `banc-sons/chaine/essai/`, hors git ; rien dans un dépôt). Seule.
   - **La partie** : `deux-phrases`, les deux phrases dites par Hortense (`System.Speech`, WAV 16 kHz), à leurs
     instants absolus, sans ancre, sans conversion d'horloge, sans juge ni mutations. Le serveur : `createApp` monté
     à la main sur `openDb(':memory:')`, l'horloge réelle, `FakeOpenAi` avec ses deux réponses et un délai écrit à la
     main avant le flux. La page construite servie par `vite preview`. Le service de voix lancé sur son propre port,
     avec `--origin` de la page. Chrome sans écran et muet, piloté par `playwright-core` installé dans le dossier
     jetable. Le déroulé pris par le bouton d'export.
   - **Ce qu'elle mesure**, chaque point écrit ici avec sa valeur :
     1. le flux SSE à travers `vite preview` : chaque `delta` daté côté serveur et côté page, pour voir s'il est
        retenu ;
     2. l'horloge de Web Audio dans un Chrome sans écran et muet : `currentTime` contre `performance.now()` sur une
        minute, et `getOutputTimestamp` ;
     3. le `MediaStream` entre le contexte de la sonde (48 kHz) et celui de la page (16 kHz) : le retard et la
        fidélité, en comparant l'enregistrement d'essai de la page au son joué ;
     4. le traitement du son de Chrome sur le faux périphérique par fichier, contre la sonde : la même partie par les
        deux voies, annulation d'écho et suppression de bruit allumées puis éteintes, l'enregistrement d'essai de la
        page comparé au fichier, et les `voix`, `tenue` et `fin` de la page comparés ;
     5. faster-whisper `small` contre `tiny` sur le laptop : le délai et le texte de chaque phrase ; une toux
        transcrite cinq fois, pour voir le tirage de température ;
     6. Silero sur Hortense et sur une toux, rejoué par `replay()` (`src/listen/replay.ts`) : la probabilité de voix
        trame par trame, et si la toux tient les 400 ms d'une tenue ;
     7. Lun'Anima sur `:memory:` : qu'il démarre, appaire, réponde et coupe sans rien écrire sur le disque ;
     8. Piper par le service (`--tts piper:<voix siwis>`) : le temps de synthèse de chaque phrase, contre la fausse
        synthèse ;
     9. la prise sur la sortie de sa voix : le premier et le dernier échantillon non silencieux, contre `start()` et
        la fin du son ;
     10. la durée de la partie, de l'ouverture de Chrome au déroulé exporté.
   - **Ce qu'elle installe**, dans le dossier jetable seulement : `playwright-core` (taille mesurée et écrite ici) ;
     l'environnement `uv` du service s'il manque (taille mesurée). Aucun navigateur téléchargé. Une toux enregistrée
     par CrOliX, ou une toux sous licence CC0 qu'il choisit ; sans elle, les points 5 et 6 sont faits sans toux.
   - **Ce qu'elle rend** : une section « Ce que la tâche 0 a mesuré » dans ce plan, et pour chaque choix du palier 2
     s'il tient, change ou tombe. Les scripts restent dans `banc-sons/chaine/essai/` jusqu'à la fusion du palier 2,
     puis sont retirés.

## Ce que la tâche 0 a mesuré

Jouée le 11/11 par le `testeur`, sans toux : quatre parties de `deux-phrases`, par la sonde puis par le faux
périphérique de Chromium, écho et bruit allumés puis éteints. Le serveur sur `:memory:` avec `FakeOpenAi` (4000 ms
puis 400 ms avant le flux, 150 ms entre deux morceaux), la page par `vite preview`, le service de voix
(`faster:small`, Piper siwis, `--origin`), Chrome sans écran et muet par `playwright-core`. Aucun dépôt touché.

1. **Le flux SSE par `vite preview`** : chaque `delta` arrive 2 à 14 ms après sa sortie du serveur (12 deltas), les
   150 ms entre deux conservées. **Tient.**
2. **L'horloge de Web Audio**, une minute, trois contextes : dérive de +26, −150 et −106 ppm (9 ms par minute au
   plus), sous le bruit de lecture de `currentTime` (11 à 15 ms, par blocs). `getOutputTimestamp` est stable à
   0,2 ms mais annonce 40 à 58 ms de latence de sortie, même muet. **Change** : une convention écrite (« Les deux
   horloges »), sinon 50 ms d'écart sans cause.
3. **Le `MediaStream` de la sonde** (48 kHz vers 16 kHz) : corrélation 0,997, gain 0,997, 22 à 23 dB de rapport
   signal sur bruit. Le son commence dans une trame de la page 20 à 30 ms après sa pose ; trames de 30 ms en médiane,
   40 ms au 95e centile, aucune perdue. Un arrêt de 366 à 395 ms à l'ouverture, avant `t0` (les clics, le chargement
   de Silero). **Tient**, et `__banc.jouer()` attend des trames régulières.
4. **Le traitement du son de Chrome** : la sonde le contourne (allumé ou éteint : 0,997, 22 dB). Le faux périphérique
   allumé le subit (corrélation 0,71 à 0,74, gain 0,55 à 0,71, environ 0 dB) ; éteint, 0,996 et 21 dB. Les décisions
   de la page sont les mêmes à 35 ms près dans les quatre variantes, les textes aussi. L'enregistrement de la page par
   le faux périphérique est décalé d'environ 170 ms sur l'arrivée des trames, sans perte. **Change** : le témoin se
   joue écho et bruit allumés (le défaut réel, la seule voie qui passe par le traitement), recalé sur les trames.
5. **faster-whisper**, cinq essais par phrase (Hortense, 2323 et 1551 ms) : `small` 1923 à 2046 ms, confiance 0,68 à
   0,72 ; `tiny` 325 à 392 ms, confiance 0,63 à 0,70. Le même texte juste cinq fois sur cinq, aucun tirage. Dans la
   chaîne, `small` rend la phrase 2 « et aussi la météo de demand. » quatre fois sur quatre (le fichier seul :
   « demain »). **À trancher** (voir la fin) : le modèle, et la règle de la source `transcription`.
6. **Silero** (`replay()`) sur Hortense : 0,99 à 1 dès la première ou la deuxième trame, un seul bloc, aucune pause.
   Hortense parle 2240 ms pour la phrase 1 (le scénario en écrit 1280) et 1568 ms pour la phrase 2 (2048). Tenue à
   384 ms à chaque fois. **Tient** : les ancres sont nécessaires, Hortense ne tient pas les `duree`.
7. **Lun'Anima sur `:memory:`** : démarre en une seconde, appaire par la vraie route, répond deux fois, reçoit la
   coupure de la réponse 1 (`said` vide), rien sur le disque, aucun appel inattendu. L'assemblage recopié de
   `harness.ts` sans vitest tient en 30 lignes. **Tient** (tâche 8).
8. **Piper par le service** : 148 à 233 ms de synthèse pour 3,1 à 3,8 s de son ; la durée varie d'environ 350 ms d'un
   essai à l'autre, même texte. Dans la chaîne, 79 à 116 ms par morceau. La fausse synthèse aurait rendu 2040 et
   1440 ms de son ; Piper en rend 2113 et 1347. **Tient** (plus rapide), durée non constante.
9. **La prise sur la sortie** (marche dans Chrome sans écran) : Piper met 191 ms de silence en tête, 70 à 104 ms en
   fin. Premier échantillon non silencieux : `start()` + 191 ms + 0 à 9 ms à l'heure du rappel (+ 64 à 73 ms selon
   `getOutputTimestamp`). Le son n'est pas tronqué. La page écrit `premier_son` à `start()`. Sept sons sur huit datés :
   deux sons à moins de 250 ms l'un de l'autre se fondent. **Tient**, découpée par source et non par silence.
10. **La durée d'une partie** : 16,7 et 17,4 s par la sonde ; 23,4 et 23,5 s par le faux périphérique (dont 8 s
    d'attente en tête du fichier). **Tient.**

**Sur `deux-phrases`**, lu dans le déroulé : la transcription de `small` (2 s) fait partir la réponse 1 à 4,8 s, après
le début de la parole 2 (4,6 s). L'attente `exact` `phrase-pendant` ne peut donc pas se produire ; les cinq attentes
`tous` tiennent quatre fois sur quatre. Premier son de la réponse 2 : 8,97 à 9,20 s.

**Installé**, hors dépôt : `playwright-core` 1.65.0, 13,3 Mo ; l'environnement `uv` du service (il manquait),
589,7 Mo avec son cache. **Non mesuré** : la toux ; le flux de la réponse 1 (coupée avant son premier mot) ; l'instant
réellement entendu (pas de vraie sortie sans écran) ; des centiles (une partie par variante).

## Palier 2 : les choix **[avis]**

Révisés avec les mesures de la tâche 0.

### Le son de la personne

Les deux, par ordre de priorité, et rien dans le dépôt :

1. **Un son posé à la main** : `BANC_DIR/chaine/sons/<nom>.wav`, où `<nom>` est le texte de `dit` réduit (minuscules,
   sans accents, tirets). C'est ainsi qu'entrent une toux, un bruit, ou une de ses prises (`non-propre.wav`,
   `oui-propre.wav` du 10/11 couvrent `non-court` et `oui-puis-reparler`).
2. **Sinon, la synthèse locale de Windows** : Hortense, par `System.Speech`, gardée en cache dans
   `BANC_DIR/chaine/sons/sapi/`. Rien à installer, aucune clé, une voix qui n'est pas la sienne. Plusieurs voix et les
   hésitations restent à l'étape 4.

Une parole entre parenthèses (`'(toux)'`) n'est pas un texte : sans son posé, le scénario n'est pas joué et le relevé
dit « son manquant : toux.wav ». Un `bruits` demande `bruit.wav`. La toux est enregistrée par CrOliX, ou une toux
sous licence CC0 seulement.

### Le micro : fabriqué dans la page, et un témoin par Chromium

La sonde remplace `getUserMedia` par un `MediaStream` tiré d'un `AudioContext` à 48 kHz, comme un vrai micro, que la
page rééchantillonne. Il démarre au signal du joueur, à un instant lu sur l'horloge de la page, et peut poser une
parole au moment où elle commence à parler. `__banc.jouer()` ne démarre qu'après des trames régulières : la page
s'arrête 366 à 395 ms à l'ouverture (point 3). La sonde contourne le traitement du son de Chrome (point 4) : elle
prouve la page, pas la capture.

Une fois par suite, `deux-phrases` est aussi joué par le faux périphérique de Chromium
(`--use-file-for-fake-audio-capture`, un fichier construit d'avance), **écho et bruit allumés** : c'est le défaut des
réglages et la seule voie qui passe par le traitement. Ses instants sont recalés sur l'arrivée de la première trame
de son, pas sur l'ouverture (environ 170 ms de retard pris au démarrage, point 4). Le relevé compare ce que la page a
décidé par les deux voies (`voix`, `tenue`, `fin`) ; la tâche 0 les a trouvées identiques à 35 ms près.

### Une parole ancrée sur la partie

À ce niveau, le premier son arrive plus tard qu'au niveau exact : la vraie transcription prend 0,3 à 2 s, pas
150 ms, et Hortense ne tient pas les `duree` (2240 ms pour 1280 écrites, point 6). Une toux posée à 3008 ms
tomberait avant qu'elle parle. La tâche 0 confirme qu'il faut des ancres. Une parole peut donc être ancrée :
`apres: { joue: 1, phrase?: 1, ms: 1000 }` (1 s après le début du son de sa phrase 1 de la réponse 1) ou
`apres: { envoi: 1, ms: 3000 }` (3 s après le premier envoi). La résolution d'une ancre est une seule fonction pure de
`scenario.ts`, que le joueur exact appelle et que la sonde embarque par un build. Les gestes suivent la même règle.

### La transcription : la vraie

faster-whisper, le modèle tranché par CrOliX (voir « À trancher » : `tiny` recommandé). Le modèle de la partie est
écrit au relevé. Ce qu'elle prouve : la coupe du son que la page envoie, le délai réel, la confiance réelle, et ce
qu'elle fait d'une toux (un « Merci. » inventé est un défaut à trouver ici). Ce qu'elle coûte : `entendu`,
`confiance`, `transcriptionMs` et `echec` sont ignorés ; le relevé écrit pour chaque phrase `dit`, `entendu` et la
confiance, et une attente `tous` ne compare jamais un texte transcrit. Sur Hortense, aucun tirage de température en
cinq essais (point 5) ; sur un bruit, un texte qui change d'une partie à l'autre se lit dans le relevé, il ne se
rejoue pas.

**[avis] La source `transcription`** ne se nomme pas sur un texte qui diverge seulement : « demand » pour « demain »
divergerait à chaque partie, sans effet. Elle se nomme quand la divergence change la réponse du faux modèle : la
réponse choisie par `si` sur le texte reçu n'est pas celle qu'il aurait choisie sur le `dit`. Toute divergence reste
écrite au relevé.

### Sa voix : Piper par le service, ou une fausse synthèse

Voir « À trancher ». **Piper par le service** (déjà sur le laptop) fait jouer le maillon `voix` en entier : l'appel au
service, sa file, le vrai temps de synthèse et la vraie durée d'une phrase. `syntheseMs`, `msParCaractere` et
`echoue` sont alors ignorés et dits au relevé. **La fausse synthèse servie par le joueur** (il répond lui-même à
`/voix/tts`, comme `FausseVoix`, `fakes.ts:66-74`) garde ces réglages, mais le maillon `voix` s'arrête au `Speaker` et
à Web Audio : ni le service, ni sa file, ni le temps de synthèse ne sont mesurés. **Piper est recommandé** : la
tâche 0 le trouve plus rapide que la fausse synthèse (79 à 233 ms, point 8). Sa durée varie d'environ 350 ms d'une
partie à l'autre pour un même texte : une ancre `joue` absorbe ce jeu, un instant absolu après sa voix non. La fausse
synthèse reste pour les seuls scénarios qui en ont besoin (`oui-puis-reparler` et sa synthèse d'une seconde).

### Les deux horloges

La page écrit ce qu'elle décide (`son`, `premier_son`). La sonde branche une prise sur la sortie de sa voix et date le
premier et le dernier échantillon non silencieux de chaque phrase, sur l'horloge de la page : ce sont ses `joue` et
`arrete`. La prise est **découpée par source** : chaque `AudioBufferSourceNode` a la sienne, et deux sons à moins de
250 ms ne se fondent plus (point 9). Le départ d'une source ne sert qu'à retrouver son texte.

**La convention, écrite une fois** (point 2). L'horloge commune est `performance.now()` de la page. Un instant de
Web Audio s'y rapporte par un couple (`currentTime`, `performance.now()`) lu au même rappel, **sans ajouter la
latence de sortie** que `getOutputTimestamp` annonce (40 à 58 ms, même muet). `t0` de la sonde est l'instant de son
contexte qui sort par la `MediaStreamDestination`, rapporté ainsi. « Ce qui sonne » est, par choix, l'instant où
l'échantillon atteint la prise sur la sortie, rapporté de même : pas ce qu'un haut-parleur rendrait. Le relevé donne la
latence de sortie annoncée à part, une fois par partie.

**`premier_son` et ce qui sonne.** La page écrit `premier_son` à `start()` ; Piper met 191 ms de silence en tête, et
rien ne sonne avant. La page ne change pas : ce qu'elle croit est une mesure. Le relevé écrit, par phrase, l'écart
`joue − premier_son`, le silence de tête du son rendu (lu dans les échantillons de `/voix/tts`), et leur différence,
qui est ce que coûte Web Audio (0 à 9 ms sur le laptop). Les délais de la chaîne se comptent jusqu'à `joue`, et le
délai de la page jusqu'à `premier_son` se lit à côté.

### Le faux modèle, côté Lun'Anima

Il se branche là où se branche `FakeOpenAi` : un `fetch` injecté dans `createOpenAiProvider`. Le vrai fournisseur, le
vrai SDK et son analyse du flux tournent ; rien ne sort du processus ; la clé est un mot sans valeur. Il lit les
`reponses` de la partie et répond comme le faux serveur du niveau exact (`fakes.ts:153-199`) : la première réponse
dont `si` est contenu dans le dernier message de la personne, sans accents ni casse, ou la première sans `si`. Il
attend `premierMotMs`, envoie chaque phrase en trois morceaux, `entrePhrasesMs` entre deux ; `erreur` coupe le flux ;
une coupure l'arrête.

**Le poste est un blanc dans le flux** : après la phrase `apres`, il attend `poste.ms + premierMotMs`. Le délai `poste`
du serveur manque donc ; l'attente qui le lit est `exact`. Toute autre demande au modèle est écrite au journal comme
`modele_inattendu` et refusée.

### Le serveur de la chaîne : un point d'entrée à lui

`npm run chaine` (Lun'Anima) lance `core/src/cli/chaine.ts`, qui assemble `createApp` comme l'assemblage de test, sorti
de sa dépendance à vitest, sur une base en mémoire et l'horloge réelle. `main.ts` n'est pas touché : ni copie
quotidienne, ni nuit, ni surveillance de clé, ni satellites n'y sont montés, parce qu'ils ne le sont pas. Il refuse de
démarrer hors de la boucle locale, écoute sur un port à lui (8798), et donne le code d'appairage par
`bootstrapPairing`.

**[avis] Des fichiers plutôt que des routes**, la variante la plus simple : la partie et le journal passent par
`BANC_DIR/chaine/serveur/`, que les deux dépôts trouvent au même endroit (`../banc-sons/chaine`, ou `CHAINE_DIR`).
Une seule route, `parle`, parce qu'une parole à elle doit partir à son instant. Le journal est écrit par un middleware
monté devant `createApp`, qui lit le corps de la requête et la tête du flux rendu : aucune route de la conversation ne
change.

### Ce que le serveur a reçu, sans conversion d'horloge

Aucune attente `tous` jouée ici ne lit l'instant d'une ligne du serveur (voir « Ce que le code fait aujourd'hui ») :
le journal du serveur est fondu dans la partie par son ordre et ses numéros, chaque ligne posée à l'instant de
l'événement de la page qui porte le même numéro (`envoi_recu` sur `numero`, `coupure_recue` sur `coupee`, sinon
`oubliee`, sinon `arretee`, `retrait_recu` sur `retiree`). `charger` refuse, au niveau de la chaîne, une attente `tous` sur une ligne du serveur
qui a des bornes ou sert d'ancre : le jour où il en faut une, la conversion reviendra, avec un aller-retour au début
et à la fin de la partie et une borne tirée de sa durée.

### Le juge à ce niveau

`juger(s, partie, 'chaine')` : une attente `exact` est jugée comme avant, marquée `horsNiveau` ; elle ne fait jamais
échouer et n'entre pas dans le calcul de la source des autres. Une attente `tous` ne peut pas s'ancrer sur une
`exact`. La règle de la source gagne un cas : quand le texte transcrit d'une phrase change la réponse que le faux
modèle choisit (voir « La transcription »), un échec qui suit cette phrase nomme `transcription`.

### Le temps réel, et où ça tourne

Une partie par scénario jouable, une seule fois (les répétitions et les taux sont l'étape 4). Une partie dure 17 s par
la sonde, 23 s par le faux périphérique (point 10) : neuf scénarios sans toux et le témoin, quelques minutes, mesurées
à la tâche 10. L'environnement `uv` du service pèse 590 Mo, hors dépôt. Sur le laptop seulement,
à la main : la chaîne demande Chrome, `uv`, un modèle de transcription, la synthèse de Windows et le serveur privé.
Rien en CI. Les mutations tournent sur le niveau exact, dans un job à part de la CI ; sa durée sera mesurée.

## Palier 2 : les contrats

### Entre les deux dépôts

Dans `CHAINE_DIR` (par défaut `../banc-sons/chaine` depuis chaque dépôt), sous `serveur/` :

| Fichier ou route | Écrit par | Contenu |
|---|---|---|
| `serveur/code` | le serveur, au démarrage | le code de `bootstrapPairing` |
| `serveur/partie.json` | le joueur, avant chaque partie | `{ nom, reponses }`, `reponses` de la forme de `Reponse` |
| `serveur/journal.jsonl` | le serveur | une ligne par événement, `{ partie, t, name, ...valeurs }` |
| `POST /api/chaine/parle` | le joueur, au jeton | `{ pourquoi, phrases }` : `chat.say`, puis 202 |

Le faux modèle relit `partie.json` à chaque demande. `t` est `Date.now()`, pour le relevé seulement. `Reponse` est
recopié dans Lun'Anima avec un commentaire vers ce plan.

| `name` | Écrit par | Valeurs |
|---|---|---|
| `envoi_recu` | le middleware, sur l'envoi | `texte`, `message`, `reponse` |
| `coupure_recue` | le middleware, sur la coupure | `reponse`, `entendu` |
| `retrait_recu` | le middleware, sur le retrait | `message` |
| `parle_recu` | la route `parle` | `reponse` si `chat.say` le rend |
| `modele_appele` | le faux modèle | `reponse` (l'index dans `reponses`), `texte` |
| `modele_inattendu` | le faux modèle | `sorte` (`stream` ou `complete`), `extrait` (80 caractères) |

### Dans Lun'Luxuria

| Pièce | Rendu par | Lu par |
|---|---|---|
| Le plan de partie | `planDePartie(s, sons)`, tâche 3 | la sonde (6), le joueur (9) |
| Les sons | le joueur (9), par une route du navigateur | la sonde |
| La résolution d'une ancre | `ancre(apres, journal)` de `scenario.ts`, tâche 1 | le joueur exact, la sonde |
| Le texte de ce qui sonne | la sonde | le juge |
| Le journal de la sonde | la sonde | le joueur |

- **Le plan de partie** : des données seules. Pour chaque parole et chaque bruit, `{ son, a }` ou `{ son, apres }` ;
  les gestes ; les `reponses`.
- **Les sons** : `/banc/sons/<n>.wav`, servis depuis `CHAINE_DIR`, jamais en JSON dans le script posé.
- **L'ancre** : une fonction pure, embarquée dans la sonde par un build de Vite.
- **Le texte de ce qui sonne** : la sonde garde chaque réponse de `/voix/tts` avec son texte ; au départ d'une
  source, les 64 premiers échantillons **non silencieux** de son tampon la retrouvent (les premiers sont du silence
  chez Piper). La fausse synthèse met en plus un numéro dans son premier échantillon.
- **Le journal de la sonde** : `window.__banc.journal`, des `BancEvent` datés par `performance.now()`, selon la
  convention de « Les deux horloges ».

## Les scénarios à ce niveau

| Scénario | À ce niveau | Pourquoi |
|---|---|---|
| `deux-phrases` | joué, et témoin | `phrase-pendant` (`exact`) tenue avec `tiny`, et aussi avec `small` : une mesure |
| `couper-le-blanc`, `oui-puis-reparler`, `phrase-attente` | joués | |
| `delai-a-l-essai`, `delai-de-reponse` | joués | des mesures surtout : le blanc de tour réel, étape par étape |
| `arrete-net`, `non-court` | joués | « non » : sa prise du 10/11 si elle est posée, sinon Hortense |
| `faire-taire` (nouveau) | joué | le bouton, cliqué dans la page |
| les quatre `toux-*` | joués si `toux.wav` est posé (et `bruit.wav`) | une toux n'a pas de texte |
| `aparte-parole-longue`, `phrase-ecartee` | non joués | petit mode, la fenêtre seule (`session.svelte.ts:69`) |
| `echo-fort` | non joué | l'écho passe par un vrai micro et une vraie sortie, étape 5 |
| `delai-modele-lent` | non joué | `modeleMs` règle un faux ; ici le temps de Silero est le vrai |

Le relevé recopie la raison de chaque scénario non joué.

## Palier 2 : les tâches

**En parallèle d'emblée** : 1, 3, 4, 5, 6 (Lun'Luxuria, fichiers distincts) et 7, 8 (Lun'Anima). Puis 2 après 1 ; 9
après 1, 3, 4, 6 et 8 ; 10 en dernier. Les tâches 5 et 9 ajoutent chacune une ligne à `package.json` : la seconde
reprend la première.

1. - [x] **Le format, le joueur exact et le juge pour la chaîne** (Lun'Luxuria, `dev-luxuria`).
   - `src/presence/scenario.ts` : `Parole.apres?: { joue: number; phrase?: number; ms: number } | { envoi: number;
     ms: number }`, exclusif de `a` ; `Scenario.gestes?: { geste: 'silence'; a?: number; apres?: … }[]` ; les noms
     `geste` et `parole_sautee` au journal du joueur, écrits par aucun mécanisme ; `ancre(apres, journal)`, pure, qui
     rend l'instant ou `undefined`. `charger` refuse : ni `a` ni `apres`, les deux, une ancre vers une réponse ou une
     phrase que `modele` ne prévoit pas, une attente `tous` ancrée sur une `exact`, une attente `tous` qui compare
     `texte` ou `entendu` d'une phrase de la personne, et, au niveau de la chaîne, une attente `tous` sur une ligne du
     serveur avec bornes ou ancre. Le contrôle des paroles qui se chevauchent ne vaut que pour les instants absolus.
     `merged` passe ici, exporté : le joueur réel ne doit pas importer `vi`.
   - `src/presence/player.ts` : une parole ancrée est posée à `ancre(...)` ; une ancre jamais venue écrit
     `parole_sautee`. Un geste `silence` appelle `convo.silence()`, comme le bouton (`session.svelte.ts:575`).
   - `src/presence/judge.ts` : `juger(s, partie, niveau: 'exact' | 'chaine' = 'exact')`. En `chaine`, un verdict
     `exact` porte `horsNiveau: true`, `passe` le laisse passer, et il n'entre pas dans `premier` (`judge.ts:282`).
     Une parole sautée : l'attente qui la vise est `non_jouee`, sa source est le maillon de l'ancre (`voix` pour
     `joue`, `serveur` pour `envoi`). La source `transcription` quand la réponse choisie sur le texte reçu
     (`modele_appele`) n'est pas celle que la règle du faux serveur (`fakes.ts:153-199`, sortie en fonction pure)
     choisit sur le `dit` ; une divergence sans ce changement ne nomme rien.
   - `src/presence/releve.ts` : une section « Mesures » pour les verdicts hors niveau ; `releveChaine(parties)`
     ajoute par scénario : chaque phrase (`dit`, `entendu`, confiance) ; les délais de chaque tour (`delays()`,
     `trace.ts:164`), exact et chaîne côte à côte, l'écart et son maillon (`attente_fin` → `ecoute`,
     `transcription` → `transcription`, `file_serveur`, `premier_mot`, `premiere_phrase` → `serveur`, chaque
     `synthese` → `voix`, `arret_coupure` → `suspension`) ; la latence de capture (de `parole` début à la `voix` de
     la page) ; par phrase, `joue − premier_son`, le silence de tête du son et leur différence (« Les deux
     horloges ») ; la latence de sortie annoncée ; le modèle de transcription ; la comparaison du témoin par
     Chromium ; les champs ignorés ; la raison d'une partie non jouée.
   - Tests : chaque refus nouveau de `charger` ; `ancre` sur `joue` et sur `envoi`, une ancre jamais venue, un geste
     `silence` ; `horsNiveau`, `passe`, la source d'une parole sautée, la source `transcription` (une divergence qui
     change la réponse, une qui ne la change pas, comme « demand »), une `exact` ratée qui ne nomme plus la source des
     autres ; un relevé de chaîne écrit à la main, comparé ligne à ligne. Les seize scénarios passent sans changement.
   - Exclu : convertir les scénarios (tâche 2), le navigateur.
2. - [x] **Les scénarios ancrés et `faire-taire`** (`src/presence/scenarios/`, `testeur`). Après 1.
   - Chaque parole dont le sens dépend d'elle devient ancrée : `toux-parole`, `toux-courte`, `toux-reflexion`,
     `toux-puis-parole`, `arrete-net`, `non-court`, `couper-le-blanc`, `oui-puis-reparler`, `deux-phrases`, les autres
     si le calcul le montre. `ms` vaut l'ancien `a` moins l'instant de l'ancre au niveau exact.
   - Le garde-fou : une comparaison faite une fois, pendant cette tâche, des déroulés exacts d'avant et d'après la
     conversion, ligne pour ligne ; son résultat est écrit dans ce plan. Pas de test contre un témoin hors dépôt.
   - `faire-taire.ts` : une demande, une réponse de trois phrases, le geste `silence` 1 s après le début de la phrase
     1. Les attentes, à lire dans `conversation.ts` (`silence`) et `speaker.ts` (`stop`) : le son arrêté (`arrete`)
     dans la trame qui suit le geste, ce que la page écrit de la coupure, la coupure reçue, plus aucun `joue` de la
     réponse. `tous` pour ce que la chaîne doit tenir, `exact` pour les bornes à la trame. Dix-sept scénarios.
   - Exclu : changer un mécanisme pour qu'un scénario tienne ; un écart devient une issue.
3. - [x] **Les sons de la personne et le plan de partie** (`src/presence/chaine/sons.ts`, `dev-luxuria`).
   *Parallélisable.*
   - `sonsDe(s, dir, synth)` : pour chaque parole et chaque bruit, un son et sa durée, ou la raison de son absence.
     Ordre : `dir/sons/<nom>.wav`, puis le cache `dir/sons/sapi/<empreinte>.wav`, puis la synthèse. Un `dit` entre
     parenthèses ne se synthétise pas ; un bruit prend `bruit.wav`, coupé à sa durée. Les silences de début et de fin
     sont retirés ; un son plus long que `duree` est gardé, et sa vraie durée est rendue. Les `trous` : le texte est
     coupé au mot le plus proche, chaque morceau synthétisé, les silences insérés.
   - `planDePartie(s, sons)` : le plan du contrat interne, données seules. Et le fichier du témoin par Chromium :
     les sons posés à leurs instants dans un seul WAV, avec en tête l'attente d'ouverture mesurée par la tâche 0
     (8 s), dont le joueur retire la durée au recalage. Les ancres ne s'y résolvent pas : le témoin reste
     `deux-phrases`, aux instants absolus.
   - `synthSapi(texte)` : `powershell.exe` avec des arguments fixes, le texte sur l'entrée standard, jamais dans la
     ligne de commande ; `System.Speech`, Hortense, 16 kHz mono. Hors Windows ou sans Hortense : une erreur qui le dit.
   - Lecture et écriture par `readWav`, `writeWav` (`src/listen/replay.ts`).
   - Tests (synthèse injectée) : la réduction du nom, l'ordre de recherche, le cache, la toux manquante, le bruit
     coupé, le retrait des silences, les trous, le plan, le WAV du témoin. Exclu : le navigateur.
4. - [x] **Le service de voix sans synthèse** (`voix/service.py`, `voix/test_service.py`, `dev-luxuria`).
   *Parallélisable ; inutile si CrOliX choisit Piper partout.*
   - `--tts aucun` (et l'absence de `--tts`) : `/tts` répond 503, `/ping` dit `"tts": "aucun"`. Une ligne au
     `docs/README.md`. Tests : le 503, le `/ping`, aucun module de synthèse importé.
5. - [x] **La contre-épreuve dans le dépôt** (`npm run mutations`, `dev-luxuria`). *Parallélisable ; f2 attend 2.*
   - Une mutation est appliquée au chargement par un plugin `transform` de vitest (`MUTATION=<nom>`), dans une config
     à part : aucun fichier n'est touché. Seulement la suite de `src/presence`.
   - Chaque mutation porte le maillon qu'elle doit faire nommer (a et e `ecoute`, b `suspension`, c `retenue`, d1 et
     d2 `filtre`, f1 `suspension`, f2 `voix` : la mutation retire l'arrêt du son dans `speaker.stop()`, le bouton et la
     coupure tiennent, c'est la sortie qui sonne encore). La commande échoue si un motif manque (la table se met à jour), si
     une mutation survit, ou si la source majoritaire n'est pas la sienne. La sortie : une ligne par mutation, puis un
     tableau Markdown à recopier dans un plan.
   - Un job `mutations` dans `ci.yml`, à côté de `checks` ; sur la première PR (lun-luxuria#66), 73 s, autant que `checks`.
     Une ligne au `CLAUDE.md`.
   - Dans le même job, une étape qui échoue si `git ls-files` suit un `.wav`, `.flac`, `.mp3` ou `.ogg`.
6. - [x] **La sonde dans la page** (`src/presence/chaine/sonde.ts`, `dev-luxuria`). *Parallélisable.*
   - Une fonction posée avant la page (`addInitScript`), construite par Vite en un seul fichier avec `ancre` de
     `scenario.ts`. Elle reçoit le plan de partie et va chercher les sons par `/banc/sons/<n>.wav`.
   - Elle remplace `navigator.mediaDevices.getUserMedia` par un `MediaStream` tiré d'un `AudioContext` à 48 kHz,
     silencieux jusqu'à `__banc.jouer()`. `jouer()` attend des trames régulières de la page (dix de suite à moins de
     45 ms d'écart, lues en enveloppant le `port.onmessage` du worklet `frames`, `audio.ts:73`, sans changer la page),
     puis démarre. `t0` est l'instant où ce contexte commence à sonner, rapporté à `performance.now()` sans latence
     de sortie. Chaque son est posé à `t0 + a`, ou à son ancre.
   - Sa voix : une prise par `AudioBufferSourceNode` de la page (posée à son `connect`, vers une prise à elle en plus
     de sa destination) date le premier et le dernier échantillon non silencieux de cette source : `joue` et
     `arrete`, selon la convention de « Les deux horloges ». Les réponses de `/voix/tts` sont gardées avec leur texte
     et leur silence de tête ; le départ d'une source retrouve son texte. Les envois de la page (`fetch` vers
     `/api/threads/…/messages`) servent aux ancres `envoi`.
   - Un geste `silence` clique `[aria-label="Faire taire"]` à son instant.
   - Tests (jsdom, Web Audio simulé à la main) : le remplacement de `getUserMedia`, `jouer()` qui attend des trames
     régulières, une ancre `joue`, deux sources à 100 ms l'une de l'autre datées à part, `arrete` écrit une seule
     fois, le texte retrouvé derrière un silence de tête. Exclu : lancer un navigateur.
7. - [x] **Le faux modèle** (Lun'Anima, `core/src/testing/faux-modele.ts`, `dev-core`). *Parallélisable.*
   - `fauxModele(dir, journal)` rend un `fetch` à brancher dans `createOpenAiProvider`, qui parle comme `FakeOpenAi`
     (dont il reprend l'écriture du flux) avec les délais de « Le faux modèle », et relit `partie.json` à chaque
     demande. Écrit `modele_appele` ; une demande sans réponse prévue, ou `complete`, écrit `modele_inattendu` et rend
     une erreur 500. Le type `Reponse` recopié.
   - Tests (horloge fausse) : le choix par `si`, la réponse sans `si`, les délais, le blanc du poste, l'erreur,
     l'arrêt par le signal, l'inattendu ; une réponse entière lue par le vrai fournisseur.
8. - [x] **Le serveur de la chaîne** (Lun'Anima, `core/src/cli/chaine.ts`, `core/src/testing/`, `dev-core`).
   *Parallélisable ; branche le faux modèle quand 7 est là.*
   - Sortir de `testing/harness.ts` l'assemblage de `createApp` (base, horloge, santé, conversation, présence) dans
     une fonction sans vitest ; `makeHarness` la garde, avec son horloge à la main et `onTestFinished`. Les tests
     existants passent sans changement.
   - `cli/chaine.ts`, `npm run chaine` : cet assemblage sur `openDb(':memory:')`, l'horloge réelle, le faux modèle ;
     refus si `HOST` n'est pas la boucle locale ; port 8798 ; `bootstrapPairing` écrit son code dans
     `serveur/code`. Un middleware devant `createApp` écrit `envoi_recu`, `coupure_recue`, `retrait_recu` d'après le
     corps de la requête et la tête du flux rendu, pour une réponse acceptée seulement. La route `parle`, au jeton.
     `main.ts` n'est pas touché.
   - Une ligne au `CLAUDE.md` et au `README.md` du dépôt.
   - Tests : le refus hors de la boucle locale ; le middleware sur un envoi, une coupure, un retrait, et rien sur une
     requête refusée ; `parle` sans jeton refusé ; un envoi de bout en bout (code, appairage, envoi, flux, journal)
     sur `app.request`.
   - Revue de sécurité de ce diff : rien de ce point d'entrée n'est atteignable depuis `main.ts`.
9. - [x] **Le joueur réel** (`src/presence/chaine.test.ts`, `npm run chaine`, `dev-luxuria`). Après 1, 3, 4, 6 et 8.
   - `// @vitest-environment node`, ne joue qu'en mode `chaine` (comme `banc.test.ts:174`) ; dépendance de dév.
     `playwright-core`, Chrome du poste (`channel: 'chrome'`, sans écran, `--mute-audio`,
     `--autoplay-policy=no-user-gesture-required`).
   - Au départ : `vite build`, `vite preview` sur un port libre avec `CORE_URL` et `VOIX_URL` ; toujours son propre
     service de voix, sur son port, par `uv run voix/service.py --stt faster:<modèle> --tts <choix> --origin <page>`,
     arrêté à la fin ; le serveur doit répondre, sinon un message qui dit de lancer `npm run chaine` de l'autre côté.
     L'appairage par la vraie route, avec `serveur/code`.
   - Par scénario jouable : `partie.json` écrit ; un contexte neuf ; `localStorage` posé (le jeton, le micro ouvert,
     les réglages du scénario fusionnés sur `DEFAULTS`, plus `brain: 'linked'`, `busy.on: false`,
     `speak.ritual: false`) ; la sonde et son plan ; `/banc/sons/*` servis ; `/voix/tts` servi s'il le faut ; le clic
     d'entrée ; le micro ouvert ; `__banc.jouer()` ; `parle` à son instant. La partie finit `finApresMs` après la
     dernière parole posée, au plus 90 s. Puis le témoin `deux-phrases` par le faux périphérique de Chromium, écho et
     bruit allumés (les réglages par défaut), recalé sur l'arrivée de sa première trame de son.
   - À la fin d'une partie : le déroulé par le bouton d'export ; le journal de la sonde ; celui du serveur, fondu par
     ordre et numéros ; tout décalé de `t0`. `juger(s, partie, 'chaine')`, et `jouer(s)` du niveau exact pour les
     délais.
   - Écrit `releve-chaine.md` et un `deroule-chaine-<nom>.jsonl` par partie dans `BANC_DIR/chaine`. Échoue sur toute
     attente `tous` ratée ou non jouée, hors `connus`. Une ligne au `.gitignore` et au `CLAUDE.md`.
   - Tests, sur des entrées écrites à la main, sans navigateur : la fusion par numéros, la liste des scénarios non
     joués et leur raison.
   - Exclu : répéter une partie, la fenêtre Tauri.
10. - [x] **La première suite, et le plan coché** (`testeur`). Après tout le reste.
    - [x] Lancer les deux `npm run chaine` sur le laptop. Recopier le relevé ici, sous « Ce que l'exécution a
      trouvé » : les verdicts, les délais par maillon, les écarts au niveau exact, le témoin, la durée de la suite.
    - [x] Une issue par écart d'un mécanisme, et un `connus` qui la nomme ; jamais une borne élargie. Aucun écart de
      mécanisme : les six observations du banc sont des issues `inbox`.
    - [x] Relecture séparée de chaque diff, les deux PR en brouillon ; la feuille de route mise à jour.
    - [x] Les scripts de la tâche 0 retirés de `banc-sons`, avec `node_modules` et `uv-cache` de `chaine/essai/`
      (environ 600 Mo) : retirés le 12/11, à la fusion.

## Ce que l'exécution a trouvé

Le 11/11. Tâches 1, 3 à 6 (Lun'Luxuria) et 7, 8 (Lun'Anima) en parallèle, rassemblées sur `feat/chaine-laptop` ;
puis 2, 9, une relecture séparée de chaque diff et deux suites réelles.

- **Relectures, « à corriger » toutes deux, reprises.** Lun'Anima : `modele_appele` écrit avant son `envoi_recu`
  (rattachés par `texte`, ordre figé par un test) ; un code d'appairage neuf après chaque appairage ; `head()`
  protégé ; `cli/chaine.ts` exclu du build. Lun'Luxuria, bloquant : la sonde écrivait le geste sans `etape: 'fait'`,
  `faire-taire` était toujours raté. Aussi : l'appel rattaché par texte, l'envoi refusé non compté, la prise datée de
  `bufferSize/sr` plus tôt, le micro rouvert (`clone()`), l'ancre `phrase` par numéro, `parle` surveillé.
- **Tâche 2** : huit scénarios ancrés (`toux-parole`, `toux-courte` `joue:1`+580 ; `toux-reflexion` `envoi:1`+682 ;
  `arrete-net`, `non-court` `joue:1`+708 ; `couper-le-blanc` `joue:1`+1444 ; `oui-puis-reparler` `envoi:1`+458 ;
  `deux-phrases` `envoi:1`+2730). Déroulés exacts d'avant et d'après : 16 identiques ligne pour ligne, relevé
  identique. `toux-puis-parole` reste aux instants absolus ; `faire-taire` est le 17e ; `phrase-ecartee` est refusé
  par `charger(s, 'chaine')`.
- **Première suite** : `tiny` 17 tenues, 5 ratées, 3 non jouées ; `small` 16, 4, 5. Aucun écart de mécanisme, tout
  venait du banc : B1 le poste du faux modèle n'était pas un appel d'outil (vrai appel de `relire_journee`) ; B2 le
  faux serveur exact ne coupait pas la première phrase à la virgule ; B3 le retrait du silence trompé par un clic
  (enveloppe RMS de 20 ms) ; B4 `modele_inattendu` ignoré par la source `transcription` ; B6 la partie finie avant la
  réponse ; B7 `coupure_recue` mal rattachée. `small` coûte 1,8 s de plus par tour.
- **Deuxième suite** (`tiny`, trois passages d'environ 140 s) : **25 attentes `tous` tenues sur 25, trois fois**. Un
  passage échoue : « Arrête » transcrit « Arret. » (2 fois sur 6), `modele_inattendu` sur `couper-le-blanc`.
- **Délais**, chaîne contre exact : attente de fin 701-710 (704) ; transcription `tiny` 353-371 (150) ; file du
  serveur 2-13 ; premier mot +4 à +25 ; première phrase +15 à +60 ; synthèse Piper −98 à +92 contre 150 ; blanc de
  tour +137 à +447 ; arrêt à la coupure 0-1 ; second mot = poste + ~405.
- **Bord de l'écoute** : début de voix 34-91 ms après le son, fin 6-111 (exact −12), tenue du silence 698-712 pour
  700, tenue de parole 414-481 (384 exact). `non-court` : `son-arrete` 771-781 pour [692,724], la fin de voix lue
  ~80 ms après le son plus 700 de tenue ; ni défaut du banc ni écart de mécanisme.
- **Variabilité** : Piper 0-190 ms de silence de tête, la même phrase 1506-1691 ms ; mots entendus ±1 ; blanc de tour
  jusqu'à 130 ms d'écart. Témoin Chromium : jusqu'à 74 ms d'écart, presque constant (lun-luxuria#69).
- **Durées** : environ 140 s la suite `tiny`, 155 s `small` ; mutations 10 s en local, 8 tuées.
- **Issues `inbox`** : lun-luxuria#67 (verdicts des mutations en JSON), #68 (`voix/test_service.py` ne tourne nulle
  part), #69 (témoin), #70 (attentes `exact` trop justes), #71 (`synthese-pendant` jamais jouée), #72 (`tiny` et les
  mots courts).

## Hors périmètre

- Les voix synthétisées en nombre, les hésitations insérées, les répétitions et les taux (étape 4).
- Le desktop, la fenêtre Tauri, le petit mode, l'écho, whisper-server, RVC (étape 5).
- La langue de la synthèse de sa voix.
- Le vrai appel à un poste par un satellite ; les cartes ; ce que le serveur fait d'une coupure, au-delà de la recevoir.
- Le vrai modèle : ses suites de consigne restent `first-word`, `wait-phrase` et `natsume:eval`.
- Muter le code au niveau de la chaîne. Corriger ce que la chaîne trouve : une issue par écart.

## Limites

- **La capture de Chrome.** La sonde contourne l'annulation d'écho et la suppression de bruit (point 4) : elle ne dit
  rien d'eux. Seul le témoin par le faux périphérique les traverse, une fois par suite, et sur Hortense ils dégradent
  le son (corrélation 0,71 à 0,74) sans changer les décisions de la page. Aucune des deux voies ne passe par un vrai
  pilote ni un vrai micro : le desktop le fera.
- **Ce qui sonne n'est pas ce qui s'entend** : la prise date l'échantillon à la sortie du graphe, par convention ; la
  latence jusqu'au haut-parleur (40 à 58 ms annoncés) n'est pas mesurée sans vraie sortie.
- La durée d'une phrase de Piper varie d'environ 350 ms d'une partie à l'autre : un délai lu après sa voix change
  d'autant.
- La synthèse d'Hortense est une voix propre, lente et sans hésitation : elle ne dit rien de la détection sur sa voix
  à lui, que le banc couvre sur ses enregistrements.
- Les délais sont ceux du laptop : la transcription sur son processeur n'est pas celle du desktop.
- Le blanc du poste est fabriqué par le faux modèle ; le délai `poste` du serveur manque.
- Le texte d'une toux transcrite change d'une partie à l'autre : une seule partie ne le dit qu'une fois. La toux n'a
  pas été mesurée : ni sa transcription, ni sa tenue par Silero.
- Une partie par variante à la tâche 0 : aucun centile. Le flux de la réponse 1 n'a pas été vu (coupée avant son
  premier mot).

## À trancher par CrOliX

**Valider le palier 2 entier** (tâches 1 à 10, révisées avec la tâche 0), avec ces choix :

- **Sa voix** : Piper par le service (le maillon `voix` entier, ses réglages de scénario ignorés), ou la fausse
  synthèse (les réglages gardés, le service et le temps de synthèse non mesurés). Je recommande Piper : plus rapide
  que la fausse synthèse (point 8) ; sa durée variable est absorbée par les ancres. La fausse synthèse pour
  `oui-puis-reparler` seulement.
- **`small` ou `tiny`** pour la transcription. Le code prend `small` par défaut (`voix/service.py:312`,
  `src/settings.ts:107`), mais le desktop passe par whisper-server, hors de ce niveau : `small` sur le processeur du
  laptop n'est fidèle au desktop que par le nom du modèle, pas par son délai. Je recommande **`tiny`** : cinq fois
  plus rapide (325 à 392 ms contre 2 s), le même texte juste sur Hortense, et les scénarios gardent leur forme :
  avec `small`, la réponse 1 de `deux-phrases` part après le début de la parole 2. `small` reste un réglage du
  joueur (`--stt faster:small`), et le modèle de chaque partie est écrit au relevé. Le délai de `tiny` dans la chaîne
  et son texte sur la phrase 2 (« demain » ou « demand ») sont à lire sur la première suite.
- **La source `transcription`** : nommée seulement quand le texte reçu change la réponse du faux modèle, pas sur toute
  divergence (« demand » pour « demain » la nommerait à chaque partie, sans effet). Je le recommande.
- **Le son par la page, et une parole ancrée sur la partie** : un changement du format, gardé par une comparaison des
  déroulés exacts faite une fois. La tâche 0 confirme les ancres (Hortense ne tient pas les `duree`).
- **La transcription vraie dès ce niveau**, au prix des champs `entendu` et `confiance` ignorés.
- **Les mutations dans la CI** de Lun'Luxuria, à la durée mesurée sur la première PR.

La toux : les quatre scénarios de toux attendent qu'il en enregistre une (et un bruit) ou choisisse une toux CC0.

## Ce que le plan-challenger a changé

1. **Deux paliers** : une tâche 0 jetable mesure d'abord ce que la suite suppose ; le reste attend ses mesures.
2. **`main.ts` intact** : un point d'entrée à part, sur l'assemblage de test sorti de vitest ; un middleware au lieu
   d'un `observe` dans les routes ; le code par `bootstrapPairing`, sans route ; des fichiers pour la partie et le
   journal, `parle` seule en route.
3. **Le micro** : un contexte à 48 kHz ; un témoin par le faux périphérique de Chromium ; la limite sur l'annulation
   d'écho et la suppression de bruit réécrite, à mesurer.
4. **Deux horloges** : la sonde date ce qui sonne sur la sortie de sa voix, pas seulement `start()` et `stop()`.
5. **La conversion d'horloge du serveur disparaît** : aucune attente `tous` jouée ne lit un instant du serveur ; le
   journal est fondu par ordre et numéros, et `charger` garde cette vérité.
6. **Sa voix** passe dans « À trancher » : Piper est sur le laptop, et l'interception coûte au maillon `voix` le
   service, sa file et le temps de synthèse.
7. **La transcription** : le relevé écrit `dit`, `entendu` et la confiance ; la source nomme `transcription` quand le
   texte diverge ; le tirage de température de faster-whisper est noté.
8. **Les ancres** : une fonction pure de `scenario.ts`, embarquée dans la sonde ; leur garde-fou est une comparaison
   faite une fois, pas un test contre un témoin hors dépôt.
9. **Un contrat interne** à Lun'Luxuria : le plan de partie, les sons servis par une route, le texte de ce qui sonne.
10. **Toujours son propre service de voix**, sur son port, avec `--origin`.
11. **Les mutations** au chargement par un plugin de vitest, sans toucher un fichier, sur `src/presence` seul ; la
    durée du job mesurée.
12. **La couverture** : le relevé dit pourquoi chaque scénario manque ; la toux est la sienne, ou CC0.
13. **Aucun son suivi par git**, vérifié par la CI.
