# La chaîne sur le laptop : la page construite, un son pour micro, le vrai serveur, un faux modèle. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **À valider par CrOliX.** Les choix marqués **[avis]** sont des propositions ; rien n'est codé.
>
> **PR :** aucune encore. Une par dépôt, ouvertes en brouillon à la première tâche.

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
modèle pour les mécanismes, validé avec le cadrage). Les plans fusionnés [du déroulé](2026-11-11-deroule-tour.md) et
[des scénarios](2026-11-11-scenarios-presence.md), avec ce que leur exécution a trouvé. Code relu sur `main` de
Lun'Luxuria (`b1d8761`) et de Lun'Anima (`84618a3`). Références relues, rien lancé : AIRI
(`packages/testing-audio`, `packages/vitest-plugin-fakemic`), Pipecat (`evals/`), LiveKit Agents (`tests/fake_*.py`),
la preuve dans la page du 10/11 (un script hors dépôt, CDP brut).

**Critères de fin :**

- `npm run chaine` (Lun'Luxuria) construit la page, la sert, lance le service de voix, ouvre Chrome sans écran, et
  joue chaque scénario jouable à ce niveau contre un serveur lancé par `npm run chaine` (Lun'Anima). Une partie dure
  le temps réel du scénario ; la suite tient en moins de huit minutes sur le laptop.
- Aucun appel payant, aucune clé : le faux modèle répond dans le serveur, sans réseau. Le serveur de la chaîne tourne
  sur une base en mémoire et refuse de démarrer hors de la boucle locale.
- Le micro de la page est un `MediaStream` fabriqué dans la page : chaque parole est un son posé à son instant, ou
  ancré sur un événement de la partie (« 1 s après le début de sa phrase 1 »). Aucun enregistrement de voix n'entre
  dans le dépôt ; les sons vivent dans `banc-sons`, hors git.
- Une seule horloge : celle de la page. Ce que le serveur écrit est daté sur l'heure du système et ramené à l'horloge
  de la page par `performance.timeOrigin`, sur la même machine ; une dérive de plus de 5 ms entre le début et la fin
  de la partie la fait échouer (`joueur`, « horloge »).
- Le juge est le même. Au niveau de la chaîne, une attente `exact` n'échoue jamais : elle est rendue comme une
  mesure, avec sa borne et ce qui a été trouvé. Une attente `tous` ratée ou non jouée fait échouer la suite.
- Le relevé donne, par scénario : les verdicts, les délais de chaque tour au niveau exact et à la chaîne et leur
  écart rangé par maillon, les champs du scénario ignorés à ce niveau, et la raison de tout scénario non joué.
- `npm run mutations` (Lun'Luxuria) joue chaque mutation connue contre le niveau exact et échoue si l'une survit ou ne
  nomme pas son maillon. Le bouton « Faire taire » a son scénario, et sa mutation ne survit plus.
- `npm test` des deux dépôts ne change pas de durée de plus de cinq secondes ; aucun test de la chaîne n'y tourne.

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-luxuria`, `feat/chaine-laptop` | à ouvrir à la validation | `standard` |
| `lun-anima`, `feat/chaine-laptop` | à ouvrir à la validation | `standard` |
| `lun-docs`, `docs/deroule-tour` | les mêmes | `trivial` |

## Ce que le code fait aujourd'hui

**Lun'Luxuria**

- **La page dans un onglet** parle au serveur par `/api` (`core.ts:51`, Bearer) et au service de voix par `/voix`
  (`voice.ts:15`, `:22`). Vite les relaie vers `CORE_URL` et `VOIX_URL` (`vite.config.ts:9-19`). Le jeton vit dans
  `localStorage['luxuria.token']`, les réglages dans `luxuria.settings`, le micro dans `luxuria.mic`
  (`session.svelte.ts:24-27`). Un onglet n'entre qu'après un clic (`session.svelte.ts:234-238`).
- **Le petit mode n'existe que dans la fenêtre** : dans un onglet, la disposition est toujours `scene`
  (`session.svelte.ts:69`).
- **Le micro** : `getUserMedia`, puis un `AudioContext` à 16 kHz et un worklet qui rend des trames de 512
  échantillons (`audio.ts:61-83`). Chaque trame passe par Silero (`session.svelte.ts:478-506`), dans l'ordre.
- **Sa voix** : `synthesize` rend des échantillons bruts et leur fréquence (`voice.ts:21-28`) ; `webOutput` les joue
  dans un `AudioBufferSourceNode` copié tel quel, et `heard()` lit `ctx.currentTime` (`audio.ts:4-43`).
- **Le service de voix** (`voix/service.py`) : `/stt` (faster-whisper ou whisper-server), `/tts` (Piper ou Kokoro,
  `--tts` obligatoire, `:313`). Il refuse toute origine hors de sa liste (`:32-39`), où une page servie sur un autre
  port que 5180 n'est pas.
- **Le déroulé** (`trace.ts`, format 2) garde les vingt derniers tours ; un bouton des réglages avancés de l'écoute
  l'exporte dans un onglet (`Reglages.svelte:592`). Le bouton « Faire taire » appelle `session.silence()`
  (`Scene.svelte:143`).
- **Le niveau exact** (`src/presence/`) : seize scénarios en données (`scenario.ts`), des briques fausses
  (`fakes.ts`), un joueur sur l'horloge fausse de vitest (`player.ts`, il importe `vi` : jamais en temps réel), un
  juge à règles (`judge.ts`), un relevé (`releve.ts`). Une parole a un instant absolu `a` (`scenario.ts:111-125`).
  Le juge résout `reponse: n` par le n-ième `envoi_recu` du journal du joueur (`judge.ts:122-130`).
- **Ce que les scénarios demandent à ce niveau** : 46 attentes `tous` sur 16 fichiers. Trois ne jouent que des
  briques fausses (`echo-fort`, `delai-modele-lent` : l'écho et le temps du modèle de voix sont des réglages du faux ;
  `delai-de-reponse` n'a que des attentes `exact`, il reste utile pour ses mesures). Deux sont en petit mode
  (`aparte-parole-longue`, `phrase-ecartee`). Quatre font tousser (`dit: '(toux)'`), et `toux-puis-parole` a un bruit.
  Deux font dire au serveur une parole à lui (`modele.parle` : `toux-puis-parole`, et `aparte` déjà exclu).
- **Les mutations** : un script hors dépôt (`mutations.mjs`) mute neuf motifs, joue la suite, résume les sources ; il
  remet le fichier par `git checkout --`, ce qui efface aussi un travail non commité de ce fichier. La mutation f2 (le
  bouton qui n'arrête plus le son) survit : aucun scénario ne joue ce bouton.
- **Outillage** : vitest 5, jsdom ; ni Playwright ni navigateur piloté dans le dépôt. Le laptop a Chrome, `uv`, les
  modèles faster-whisper `small` (464 Mo) et `tiny` (75 Mo) en cache, et trois voix françaises de Windows : Hortense
  (SAPI, lisible par `System.Speech`), Julie et Paul (OneCore seulement).

**Lun'Anima**

- **Le modèle** passe par `ChatProvider` (`core/src/chat/provider.ts:53-59`). `createOpenAiProvider` accepte un
  `fetch` injecté (`openai.ts:34-40`) : c'est ainsi que les tests le branchent sur `FakeOpenAi`
  (`core/src/testing/fake-openai.ts:90`), qui rend du SSE comme OpenAI, tout d'un coup, sans délai.
- **Le démarrage** lit la clé dans la base ou l'environnement et ne crée un fournisseur qu'avec elle
  (`core/src/main.ts:91-100`) ; la surveillance de la clé peut le remplacer (`:155-162`).
- **Les routes de la conversation** : l'envoi connaît le message et le numéro de la réponse (`chat/routes.ts:93`),
  la coupure ce qui a été entendu (`:65`), le retrait le message (`:72`).
- **Les durées** d'une réponse sont mesurées sur `performance.now()` et jointes à `done` (`chat/service.ts:559-562`,
  `:643`, `:1058`).
- **La présence** : un `started` avec `ritual` non faux compose un rituel par le modèle
  (`natsume/presence-routes.ts:41-44`) ; `chat.say` dit une phrase sans modèle (`:43`).
- **La base jetable** : `seed:recette` refuse la base par défaut et toute base non vide (`cli/seed-recette.ts:156`).
  `natsume:eval` et `first-word` tournent sur une base en mémoire. `pair-code` écrit un code dans la base.

## Ce que les références apportent

- **AIRI** : le fichier son devient le micro de Chromium (`--use-file-for-fake-audio-capture=<wav>%noloop`), la page
  est sondée par un script posé avant elle (`addInitScript`), le modèle est une réponse écrite. Un fichier par
  lancement de Chromium, qui part quand le micro s'ouvre.
- **Pipecat** : un tour peut attendre ce que fait l'agent avant de parler ; la parole de la personne est synthétisée
  et gardée en cache.
- **LiveKit** : un veto sur l'état réel du serveur, qui peut faire échouer, jamais sauver.
- **La recherche du 11/11** (cadrage § 3) : remplacer `getUserMedia` plutôt que passer par les options de Chromium,
  pour piloter le son pendant l'essai ; et la mise en garde d'EVA sur le recollage de deux horloges.

## Les choix **[avis]**

### Le son de la personne

Les deux, par ordre de priorité, et rien dans le dépôt :

1. **Un son posé à la main** : `BANC_DIR/chaine/sons/<nom>.wav`, où `<nom>` est le texte de `dit` réduit (minuscules,
   sans accents, tirets). C'est ainsi qu'entrent une toux, un bruit, ou une de ses prises (`non-propre.wav`,
   `oui-propre.wav` du 10/11 couvrent `non-court` et `oui-puis-reparler`).
2. **Sinon, la synthèse locale de Windows** : Hortense, par `System.Speech`, en WAV 16 kHz mono, gardée en cache dans
   `BANC_DIR/chaine/sons/sapi/`. Rien à installer, aucune clé, une voix qui n'est pas la sienne. Plusieurs voix et
   les hésitations restent à l'étape 4.

Une parole entre parenthèses (`'(toux)'`) n'est pas un texte : sans son posé à la main, le scénario n'est pas joué
et le relevé dit « son manquant : toux.wav ». Un `bruits` demande `bruit.wav`, coupé à sa durée. Les quatre scénarios
de toux attendent donc une toux enregistrée une fois, ou une toux libre téléchargée par CrOliX (voir « À trancher »).

**Pourquoi pas un fichier WAV par partie, par les options de Chromium** (le choix d'AIRI) : le fichier part quand le
micro s'ouvre, à un instant que la page ne date pas, et il faut relancer Chromium à chaque partie. Un micro fabriqué
dans la page démarre au signal du joueur, à un instant lu sur l'horloge de la page, et peut poser une parole au moment
où elle commence à parler. Ce qu'il ne prouve pas : la capture de Chrome elle-même (annulation d'écho, suppression de
bruit), qui ne compte qu'avec un vrai micro, au desktop.

### Une parole ancrée sur la partie

À ce niveau, le premier son arrive plus tard qu'au niveau exact : la vraie transcription prend une seconde, pas
150 ms. Une toux posée à 3008 ms tomberait avant qu'elle parle, et le scénario ne dirait plus rien. Une parole peut
donc être ancrée : `apres: { joue: 1, phrase?: 1, ms: 1000 }` (1 s après le début du son de sa phrase 1 de la réponse
1) ou `apres: { envoi: 1, ms: 3000 }` (3 s après le n-ième envoi). Le niveau exact résout l'ancre de la même façon,
sur son journal. Chaque scénario converti garde au niveau exact son déroulé ligne pour ligne : c'est le test de la
conversion. Les gestes suivent la même règle (`gestes: [{ geste: 'silence', apres: … }]`).

### La transcription : la vraie

faster-whisper `small`, sur le processeur du laptop, par `voix/service.py` tel qu'il est (le réglage par défaut de la
page). Ce qu'elle prouve et qu'une fausse ne prouverait pas : la coupe du son que la page envoie à l'essai et à la fin,
le délai de transcription réel, la confiance réelle, et ce qu'elle fait d'une toux (whisper invente souvent un
« Merci. » sur un bruit : c'est un défaut à trouver ici, pas à masquer). Ce qu'elle coûte : `entendu`, `confiance`,
`transcriptionMs` et `echec` du scénario sont ignorés, et le relevé le dit. Une attente `tous` ne doit donc pas
dépendre d'un texte transcrit au mot près ; la tâche 1 le vérifie au chargement.

Une fausse transcription n'est pas proposée : elle devrait deviner quelle parole couvre le son reçu, ce que seule
une transcription sait faire. whisper-server reste au desktop.

### Sa voix : une fausse synthèse, servie par le joueur

Le joueur répond lui-même à `/voix/tts`, au niveau du navigateur : il attend `syntheseMs`, échoue sur `echoue`, et
rend un son discret de `msParCaractere × longueur`, comme `FausseVoix` (`fakes.ts:66-74`). Son premier échantillon
porte un numéro, que la sonde lit au départ du son : le journal sait quelle phrase sonne. Le service de voix ne sert
plus qu'à transcrire : il gagne `--tts aucun`. La vraie synthèse et sa durée sont celles du desktop (étape 5).

### Le faux modèle, côté Lun'Anima

Il se branche là où se branche `FakeOpenAi` : un `fetch` injecté dans `createOpenAiProvider`, choisi au démarrage en
mode « chaîne » seulement. Le vrai fournisseur, le vrai SDK et son analyse du flux tournent ; rien ne sort du
processus ; la clé est un mot sans valeur.

Il lit les `reponses` du scénario, envoyées au début de chaque partie, et répond comme le faux serveur du niveau exact
(`fakes.ts:153-199`) : la première réponse dont `si` est contenu dans le dernier message de la personne, sans accents
ni casse, ou la première sans `si`. Il attend `premierMotMs` avant la première phrase, `entrePhrasesMs` entre deux, et
envoie chaque phrase en trois morceaux. `erreur` coupe le flux. Une coupure de la réponse arrête le flux.

**Le poste est un blanc dans le flux** : après la phrase `apres`, il attend `poste.ms + premierMotMs`. Le vrai appel à
un poste demande un satellite appairé ; le délai `poste` du serveur manque donc à ce niveau, et l'attente qui le lit
est `exact`. Le vrai poste viendra avec un faux satellite servi en HTTP, plus tard.

Toute autre demande au modèle (un rituel, une scène, la nuit, un message sans réponse prévue) est écrite au journal
comme `modele_inattendu` et refusée : elle se voit au lieu de répondre n'importe quoi.

### Le serveur de la chaîne

`npm run chaine` (Lun'Anima) démarre le vrai serveur, avec :

- une base en mémoire, rien sur le disque ; ni copie quotidienne, ni nuit, ni rattrapage, ni surveillance de clé, ni
  satellites, ni envoi au téléphone ;
- un refus de démarrer si `HOST` n'est pas la boucle locale ; un port à lui (8798) pour ne pas gêner un core qui
  tournerait déjà ;
- quatre routes sous `/api/chaine`, qui n'existent qu'en ce mode (le contrat ci-dessous).

### La sonde et le joueur réel

Le joueur réel est un fichier de vitest qui ne tourne qu'en mode `chaine`, comme le banc (`banc.test.ts:174`) : il
réutilise le chargement, le juge, le relevé et, pour la comparaison, le joueur du niveau exact. Il pilote Chrome par
`playwright-core`, sans télécharger de navigateur : celui du poste (`channel: 'chrome'`). La preuve du 10/11 l'a fait
en CDP brut ; Playwright apporte d'un coup le script posé avant la page, les réponses fabriquées et le téléchargement
du déroulé, qu'il faudrait réécrire.

La sonde est un script posé avant la page. Elle remplace `getUserMedia`, pose les sons à leurs instants ou à leurs
ancres, clique sur « Faire taire » à l'instant d'un geste, et écrit le journal du joueur sur l'horloge de la page :
`parole`, `bruit_joue`, `geste`, `joue` (au départ d'un `AudioBufferSourceNode`, le texte retrouvé par son numéro),
`arrete` (à son arrêt ou à sa fin). Le numéro de la réponse d'un `joue` est celui du dernier `son` de la page avant
lui, comme au niveau exact (`player.ts:68-71`). Le déroulé de la page est pris par son bouton d'export, à la fin de la
partie : rien ne change dans la page.

Le journal du serveur (`envoi_recu`, `coupure_recue`, `retrait_recu`, `parle_recu`, `modele_inattendu`) est lu par
la route du journal à la fin de la partie, et ramené à l'horloge de la page. C'est le veto de LiveKit : ce que le
serveur a vraiment reçu, pas ce que la page croit avoir envoyé.

### Le juge à ce niveau

`juger(s, partie, 'chaine')` : une attente `exact` est jugée comme avant, mais marquée `horsNiveau` ; elle ne fait
jamais échouer, n'entre pas dans le calcul de la source des autres, et le relevé la range sous « Mesures ». Une
attente `tous` ne peut pas s'ancrer sur une attente `exact` : `charger` le refuse. Rien d'autre ne change : la règle
de la source, les espèces, `connus`.

### Le temps réel, et où ça tourne

Une partie dure son scénario plus le temps d'entrer, soit dix à quarante secondes ; une partie de chaque scénario
jouable, une seule fois (les répétitions et les taux sont l'étape 4). Sur le laptop seulement, à la main : la chaîne
demande Chrome, `uv`, un modèle de transcription de 464 Mo, la synthèse de Windows et le serveur privé. Rien en CI.
Les mutations, elles, tournent sur le niveau exact : un job à part dans la CI de Lun'Luxuria, d'une à deux minutes.

## Le contrat entre les deux dépôts

Les routes du mode « chaîne » de Lun'Anima. Elles n'existent qu'en ce mode ; toutes sauf la première demandent le
jeton de l'appareil appairé.

| Route | Corps | Effet |
|---|---|---|
| `GET /api/chaine/code` | | `{ code }`, un code d'appairage neuf |
| `POST /api/chaine/partie` | `{ nom, reponses }` | les réponses du faux modèle ; le journal repart à vide ; 204 |
| `POST /api/chaine/parle` | `{ pourquoi, phrases }` | une parole à elle, par `chat.say` ; 202 |
| `GET /api/chaine/journal` | | `{ lignes }` depuis la dernière partie |

`reponses` a la forme de `Reponse` (`scenario.ts:134-149`), recopiée dans Lun'Anima avec un commentaire qui renvoie à
ce plan. Une ligne du journal : `{ t, name, ...valeurs }`, `t` en millisecondes depuis l'époque (`Date.now()`).

| `name` | Écrit par | Valeurs |
|---|---|---|
| `envoi_recu` | la route d'envoi | `texte`, `message`, `reponse` |
| `coupure_recue` | la route de coupure | `reponse`, `entendu` |
| `retrait_recu` | la route de retrait | `message` |
| `parle_recu` | la route `parle` | `reponse` si `chat.say` le rend |
| `modele_appele` | le faux modèle | `reponse` (l'index dans `reponses`), `texte` |
| `modele_inattendu` | le faux modèle | `sorte` (`stream` ou `complete`), `extrait` (80 caractères) |

## Les scénarios à ce niveau

| Scénario | À ce niveau | Pourquoi |
|---|---|---|
| `deux-phrases`, `couper-le-blanc`, `oui-puis-reparler`, `phrase-attente` | joués | |
| `delai-a-l-essai`, `delai-de-reponse` | joués | des mesures surtout : le blanc de tour réel, étape par étape |
| `arrete-net`, `non-court` | joués | « non » : sa prise du 10/11 si elle est posée, sinon Hortense |
| `faire-taire` (nouveau) | joué | le bouton, cliqué dans la page |
| les quatre `toux-*` | joués si `toux.wav` est posé (et `bruit.wav`) | une toux n'a pas de texte |
| `aparte-parole-longue`, `phrase-ecartee` | non joués | petit mode, la fenêtre seule (`session.svelte.ts:69`) |
| `echo-fort` | non joué | l'écho passe par un vrai micro et une vraie sortie, étape 5 |
| `delai-modele-lent` | non joué | `modeleMs` règle un faux ; ici le temps de Silero est le vrai |

## Tâches

**En parallèle d'emblée** : 1, 3, 4, 5, 6 (Lun'Luxuria, fichiers distincts) et 7, 8 (Lun'Anima). Puis 2 après 1 ; 9
après 1, 3, 4, 6 et 8 ; 10 en dernier. Les tâches 5 et 9 ajoutent chacune une ligne à `package.json` : la seconde
reprend la première.

1. - [ ] **Le format, le joueur exact et le juge pour la chaîne** (Lun'Luxuria, `dev-luxuria`).
   - `src/presence/scenario.ts` : `Parole.apres?: { joue: number; phrase?: number; ms: number } | { envoi: number;
     ms: number }`, exclusif de `a` ; `Scenario.gestes?: { geste: 'silence'; a?: number; apres?: … }[]` ; les
     noms `geste` et `parole_sautee` au journal du joueur (`BancNom`), écrits par aucun mécanisme. `charger` refuse :
     ni `a` ni `apres`, les deux à la fois, une ancre vers une réponse ou une phrase que `modele` ne prévoit pas, une
     attente `tous` ancrée sur une `exact`, une attente `tous` qui compare `texte` ou `entendu` d'une phrase de la
     personne (la vraie transcription ne la rend pas au mot près). Le contrôle des paroles qui se chevauchent ne vaut
     que pour les paroles à instant absolu.
   - `src/presence/player.ts` : une parole ancrée est posée quand son ancre paraît au journal (`joue` de la réponse et
     de la phrase, ou `envoi_recu`), plus `ms` ; une ancre jamais venue écrit `parole_sautee` à la fin. Un geste
     `silence` appelle `convo.silence()`, comme le bouton (`session.svelte.ts:575`). `merged` passe dans
     `scenario.ts`, exporté : le joueur réel en a besoin et ne doit pas importer `vi`.
   - `src/presence/judge.ts` : `juger(s, partie, niveau: 'exact' | 'chaine' = 'exact')`. En `chaine`, un verdict
     `exact` porte `horsNiveau: true`, `passe` le laisse passer, et il n'entre pas dans `premier` (`judge.ts:282`).
     Une parole sautée : l'attente qui la vise est `non_jouee`, sa source est le maillon de l'ancre (`voix` pour
     `joue`, `serveur` pour `envoi`), pas `ecoute`.
   - `src/presence/releve.ts` : une section « Mesures » pour les verdicts hors niveau ; `releveChaine(parties)` ajoute
     par scénario le tableau des délais de chaque tour (`delays()`, `trace.ts:164`), exact et chaîne côte à côte,
     l'écart et son maillon (`attente_fin` → `ecoute`, `transcription` → `transcription`, `file_serveur`,
     `premier_mot`, `premiere_phrase` → `serveur`, chaque `synthese` → `voix`, `arret_coupure` → `suspension`), la
     latence de capture (de `parole` début à la `voix` de la page), les champs ignorés et la raison d'une partie non
     jouée. Médiane et 95e centile attendront les répétitions (étape 4).
   - Tests : chaque refus nouveau de `charger` (`scenario.test.ts`) ; une parole ancrée sur `joue` et sur `envoi`, une
     ancre jamais venue, un geste `silence` (`player.test.ts`) ; `horsNiveau`, `passe`, la source d'une parole sautée,
     une `exact` ratée qui ne nomme plus la source des autres (`judge.test.ts`) ; un relevé de chaîne écrit à la main,
     comparé ligne à ligne. Les seize scénarios passent sans changement.
   - Exclu : convertir les scénarios (tâche 2), le navigateur.
2. - [ ] **Les scénarios ancrés et `faire-taire`** (`src/presence/scenarios/`, `testeur`). Après 1.
   - Chaque parole dont le sens dépend d'elle (« pendant qu'elle parle », « pendant qu'elle réfléchit ») devient
     ancrée : `toux-parole`, `toux-courte`, `toux-reflexion`, `toux-puis-parole`, `arrete-net`, `non-court`,
     `couper-le-blanc`, `oui-puis-reparler`, `deux-phrases`, les autres si le calcul le montre. `ms` vaut l'ancien `a`
     moins l'instant de l'ancre au niveau exact : le déroulé exact reste le même ligne pour ligne, et un test de la
     suite le compare au déroulé d'avant la conversion, tiré de `main` dans un fichier de témoin hors dépôt.
   - `faire-taire.ts` : une demande, une réponse de trois phrases, le geste `silence` 1 s après le début de la phrase
     1. Les attentes, à lire dans `conversation.ts` (`silence`) et `speaker.ts` (`stop`) : le son arrêté (`arrete`)
     dans la trame qui suit le geste, ce que la page écrit de la coupure, la coupure reçue avec les mots entendus,
     plus aucun `joue` de la réponse. Niveau `tous` pour ce que la chaîne doit tenir, `exact` pour les bornes à la
     trame. Le compte de `scenarios.test.ts` passe à dix-sept.
   - Exclu : changer un mécanisme pour qu'un scénario tienne ; un écart devient une issue.
3. - [ ] **Les sons de la personne** (`src/presence/chaine/sons.ts`, `dev-luxuria`). *Parallélisable.*
   - `sonsDe(s, dir, synth)` rend, pour chaque parole et chaque bruit, un son 16 kHz mono et sa durée, ou la raison de
     son absence. Ordre : `dir/sons/<nom>.wav` (le `dit` réduit : minuscules, sans accents, tirets), puis la synthèse
     en cache `dir/sons/sapi/<empreinte>.wav`, puis la synthèse. Un `dit` entre parenthèses ne se synthétise pas.
     Un bruit prend `bruit.wav`, coupé à sa durée. Les silences de début et de fin d'un son sont retirés (seuil sur le
     niveau, comme `levelToVoice`) ; un son plus long que `duree` est gardé, et sa vraie durée est rendue.
   - Les `trous` : le texte est coupé au mot le plus proche de chaque trou, chaque morceau synthétisé, les silences
     insérés à leur place.
   - `synthSapi(texte)` : lance `powershell.exe` avec des arguments fixes et lit le texte sur l'entrée standard,
     jamais dans la ligne de commande ; `System.Speech`, voix Hortense, `SpeechAudioFormatInfo(16000, Sixteen,
     Mono)`. Hors Windows ou sans Hortense : une erreur qui le dit.
   - Lecture et écriture des WAV par `readWav`, `writeWav` (`src/listen/replay.ts`).
   - Tests (`sons.test.ts`, synthèse injectée, aucune synthèse réelle) : la réduction du nom, l'ordre de recherche,
     le cache, la toux manquante, le bruit coupé, le retrait des silences, les trous. Exclu : le navigateur.
4. - [ ] **Le service de voix sans synthèse** (`voix/service.py`, `voix/test_service.py`, `dev-luxuria`).
   *Parallélisable.*
   - `--tts` n'est plus obligatoire ; `--tts aucun` (et l'absence de `--tts`) : `/tts` répond 503 « pas de synthèse
     dans ce service », `/ping` dit `"tts": "aucun"`. Rien d'autre ne change. Une ligne au `docs/README.md`.
   - Tests : le 503, le `/ping`, et qu'aucun module de synthèse n'est importé dans ce cas.
5. - [ ] **La contre-épreuve dans le dépôt** (`tools/mutations.mjs`, `npm run mutations`, `dev-luxuria`).
   *Parallélisable ; la ligne de f2 attend la tâche 2.*
   - Reprendre `mutations.mjs` : chaque mutation porte le maillon qu'elle doit faire nommer (a et e `ecoute`, b
     `suspension`, c `retenue`, d1 et d2 `filtre`, f1 `suspension`, f2 `coupure`). Elle échoue si son motif manque
     dans le fichier (le code a changé : la table se met à jour), si aucune attente ne tombe (la mutation survit), ou
     si la source majoritaire n'est pas la sienne.
   - Le fichier muté est remis depuis son texte d'avant, gardé en mémoire, dans un `finally` et sur `SIGINT` : jamais
     par `git checkout`, qui effacerait un travail en cours. Les relevés vont dans un dossier temporaire, retiré à la
     fin.
   - La sortie : une ligne par mutation (échecs, scénarios, sources), puis un tableau Markdown à recopier dans un plan.
   - Un job `mutations` dans `.github/workflows/`, à côté du job principal, sur chaque PR. Une ligne au `CLAUDE.md`.
   - Exclu : muter au niveau de la chaîne.
6. - [ ] **La sonde dans la page** (`src/presence/chaine/sonde.ts`, `dev-luxuria`). *Parallélisable.*
   - Une fonction autonome, sérialisable par Playwright (`addInitScript`), sans import, qui reçoit un plan de partie :
     les sons (échantillons, instant ou ancre), les gestes, et la table numéro → texte de la fausse synthèse.
   - Elle remplace `navigator.mediaDevices.getUserMedia` par un `MediaStream` tiré d'un `AudioContext` à 16 kHz
     (`createMediaStreamDestination`), silencieux jusqu'au signal `__banc.jouer()`. `t0` est l'instant de la page où
     ce contexte commence à sonner (`getOutputTimestamp`). Chaque son est posé à `t0 + a`, ou quand son ancre paraît.
   - Elle observe sa voix : `AudioBufferSourceNode.prototype.start` écrit `joue` (texte retrouvé par le premier
     échantillon), `stop` et la fin écrivent `arrete`, une seule fois par son. Elle observe les envois de la page
     (`fetch` vers `/api/threads/…/messages`) pour les ancres `envoi`.
   - Un geste `silence` clique `[aria-label="Faire taire"]` à son instant.
   - Le journal (`window.__banc.journal`), daté par `performance.now()`.
   - Tests (jsdom, Web Audio simulé à la main) : le remplacement de `getUserMedia`, une ancre `joue` qui pose son son,
     `arrete` écrit une seule fois, le texte retrouvé par son numéro. Exclu : lancer un navigateur.
7. - [ ] **Le faux modèle** (Lun'Anima, `core/src/testing/faux-modele.ts`, `dev-core`). *Parallélisable.*
   - `fauxModele(journal, now)` rend `{ fetch, partie(reponses) }`. Le `fetch` se branche dans `createOpenAiProvider`
     et parle comme `FakeOpenAi` (`testing/fake-openai.ts`), dont il reprend l'écriture du flux, avec les délais du
     choix « Le faux modèle » : `premierMotMs`, trois morceaux par phrase, `entrePhrasesMs`, le blanc du poste,
     `erreur`, l'arrêt sur le signal de la requête.
   - Le choix de la réponse : le dernier tour `user`, sans accents ni casse, comme `plain` (`fakes.ts` de
     Lun'Luxuria). Écrit `modele_appele` ; une demande sans réponse prévue, ou non diffusée (`complete`), écrit
     `modele_inattendu` et rend une erreur 500.
   - Le type `Reponse` recopié, avec un commentaire vers ce plan.
   - Tests (horloge fausse) : le choix par `si`, la réponse sans `si`, les délais à la milliseconde, le blanc du
     poste, l'erreur, l'arrêt par le signal, l'inattendu ; et, branché dans `createOpenAiProvider`, une réponse
     entière lue par le vrai fournisseur.
8. - [ ] **Le mode « chaîne » du serveur** (Lun'Anima, `core/src/cli/chaine.ts`, `core/src/main.ts`,
   `core/src/chat/routes.ts`, `dev-core`). *Parallélisable ; branche le faux modèle quand 7 est là.*
   - `npm run chaine` : pose `ANIMA_CHAINE=1`, `DB_PATH=:memory:`, `PORT=8798` par défaut, puis importe `main.ts`.
     `main.ts` refuse le mode si `HOST` n'est pas la boucle locale ; il y prend le faux modèle comme fournisseur, sans
     surveillance de clé, et coupe la copie quotidienne, la nuit, le rattrapage des routines, les satellites et
     l'envoi au téléphone. `dbPath()` rend `:memory:` tel quel.
   - Les quatre routes du contrat, montées en ce mode seulement, et le journal en mémoire. `chatRoutes` reçoit un
     `observe` facultatif, appelé après l'envoi (`routes.ts:93`), la coupure (`:65`) et le retrait (`:72`) ;
     silencieux par défaut.
   - Une ligne au `CLAUDE.md` et au `README.md` du dépôt.
   - Tests : le refus hors de la boucle locale ; les routes absentes hors du mode ; `observe` appelé avec le texte,
     le message, la réponse, les mots entendus ; une partie qui remet le journal à vide ; un envoi de bout en bout
     (appairage par le code, envoi, flux, journal) sur `app.request`, avec le faux modèle.
   - Revue de sécurité de ce diff : aucune route du mode ne doit exister sans lui, et le mode ne peut pas toucher une
     base sur le disque.
9. - [ ] **Le joueur réel** (`src/presence/chaine.test.ts`, `npm run chaine`, `dev-luxuria`). Après 1, 3, 4, 6 et 8.
   - `// @vitest-environment node`, ne joue qu'en mode `chaine` (comme `banc.test.ts:174`) ; dépendance de dév.
     `playwright-core`, Chrome du poste (`channel: 'chrome'`, sans écran, `--mute-audio`,
     `--autoplay-policy=no-user-gesture-required`).
   - Au départ : `vite build`, puis `vite preview` sur un port libre avec `CORE_URL` (par défaut le serveur de la
     chaîne) et `VOIX_URL` ; le service de voix lancé par `uv run voix/service.py --stt faster:small --tts aucun
     --origin <la page>`, sauf si `VOIX_URL` répond déjà ; le serveur doit répondre, sinon un message qui dit de lancer
     `npm run chaine` de l'autre côté. Un code par `/api/chaine/code`, l'appairage par la vraie route.
   - Par scénario jouable : `POST /api/chaine/partie` ; un contexte neuf ; `localStorage` posé (le jeton, le micro
     ouvert, les réglages du scénario fusionnés sur `DEFAULTS`, plus `brain: 'linked'`, `busy.on: false`,
     `speak.ritual: false`) ; la sonde avec son plan (tâche 3) ; `/voix/tts` servi par le joueur ; le clic d'entrée ;
     le micro ouvert ; `__banc.jouer()` ; une parole à elle (`modele.parle`) par `POST /api/chaine/parle` à son
     instant. La partie finit `finApresMs` après la dernière parole posée, au plus 90 s.
   - À la fin : le déroulé par le bouton d'export ; le journal de la sonde ; celui du serveur, ramené à l'horloge de la
     page par `performance.timeOrigin`, la dérive contrôlée ; tout décalé de `t0`. Puis `juger(s, partie, 'chaine')`,
     et `jouer(s)` du niveau exact pour la comparaison des délais.
   - Écrit `releve-chaine.md` et un `deroule-chaine-<nom>.jsonl` par partie dans `BANC_DIR/chaine`. Échoue sur toute
     attente `tous` ratée ou non jouée, hors `connus`. Une ligne au `.gitignore` et au `CLAUDE.md`.
   - Tests : la conversion d'horloge et le refus d'une dérive, la fusion des journaux, la liste des scénarios non
     joués et leur raison ; sur des entrées écrites à la main, sans navigateur.
   - Exclu : répéter une partie, la fenêtre Tauri, la vraie synthèse.
10. - [ ] **La première partie, et le plan coché** (`testeur`). Après tout le reste.
    - Lancer les deux `npm run chaine` sur le laptop, une fois avec les seuls sons d'Hortense, une fois avec les sons
      posés à la main s'il y en a. Recopier le relevé ici, sous « Ce que l'exécution a trouvé » : les verdicts, les
      délais par maillon, les écarts au niveau exact, la durée de la suite.
    - Une issue par écart d'un mécanisme, et un `connus` qui la nomme ; jamais une borne élargie.
    - Relecture séparée de chaque diff, les deux PR en brouillon ; la feuille de route mise à jour.

## Hors périmètre

- Les voix synthétisées en nombre, les hésitations insérées, les répétitions et les taux (étape 4).
- Le desktop, la fenêtre Tauri, le petit mode, l'écho, la vraie synthèse, whisper-server, RVC (étape 5).
- La langue de la synthèse de sa voix.
- Le vrai appel à un poste par un satellite ; les cartes ; ce que le serveur fait d'une coupure, au-delà de la recevoir.
- Le vrai modèle : ses suites de consigne restent `first-word`, `wait-phrase` et `natsume:eval`.
- Muter le code au niveau de la chaîne.
- Corriger ce que la chaîne trouve : une issue par écart.

## Limites

- Le micro fabriqué ne passe pas par la capture de Chrome : ni annulation d'écho, ni suppression de bruit, ni
  pilote. Le desktop le prouvera avec le vrai micro.
- La synthèse d'Hortense est une voix propre, lente et sans hésitation : elle ne dit rien de la détection sur sa
  voix à lui, que le banc couvre déjà sur ses enregistrements.
- Les délais sont ceux du laptop : la transcription sur son processeur n'est pas celle du desktop.
- Le blanc du poste est fabriqué par le faux modèle ; le délai `poste` du serveur manque.
- Deux horloges du même poste restent deux horloges : la conversion par `performance.timeOrigin` est contrôlée par
  sa dérive, pas prouvée exacte à la milliseconde.
- Non vérifié : que `vite preview` reprenne le relais de `server.proxy` et laisse passer le flux SSE sans le retenir ;
  qu'un Chrome sans écran et muet tienne l'horloge de Web Audio comme un Chrome visible ; le temps de faster-whisper
  `small` et de Silero dans Chrome sur le laptop ; que la base en mémoire suffise à tout le démarrage de Lun'Anima ;
  que l'environnement `uv` du service soit déjà en cache ; la taille de `playwright-core` (de l'ordre de 8 Mo) ;
  qu'une toux libre de droits soit jugée voix par Silero.

## À trancher par CrOliX

- **La toux.** Quatre scénarios en dépendent. Trois voies : il enregistre une toux et un bruit une fois, dans
  `banc-sons/chaine/sons/` ; il télécharge une toux libre de droits ; ou les quatre scénarios attendent l'étape 4.
  Je recommande la première : deux fichiers de quelques secondes, jamais dans un dépôt.
- **Le son par la page plutôt que par les options de Chromium**, et une parole ancrée sur la partie : c'est un
  changement du format, validé par le niveau exact inchangé ligne pour ligne.
- **La transcription vraie dès ce niveau**, au prix des champs `entendu` et `confiance` ignorés.
- **Les mutations dans la CI** de Lun'Luxuria, une à deux minutes par PR.
