# Les données et les taux : plusieurs voix, des hésitations, une toux, chaque scénario répété. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Relu par le plan-challenger (« à amender », treize objections reprises, voir la fin), à valider par CrOliX.**
> Écrit et amendé le 12/11. Rien n'est codé.
>
> **Deux paliers.** **Palier 1 : la tâche 0 seule**, jetable, qui mesure ce que la suite suppose : les voix qu'on
> peut atteindre, ce qu'elles font de nos phrases, la toux, la variance de la chaîne sur dix lancements, le coût d'une
> partie exacte. **Palier 2 : les tâches 1 à 5**, révisées avec ses mesures avant d'être validées.
>
> **PR :** celle de l'axe pour ce plan (lun-docs#162) ; celle de Lun'Luxuria s'ouvre avec le palier 2. Lun'Anima
> n'est pas touché.

**But :** qu'un scénario ne dise plus « ça a marché une fois », mais « ça tient tant de fois sur tant ». Deux mesures,
séparées. **La course** : chaque scénario joué trente fois avec la même voix, pour qu'un échec qui tient au temps se
montre et se compte. **La robustesse aux voix** : chaque scénario joué deux fois par voix, avec des voix de synthèse
françaises et locales, autres que la sienne, pour voir ce que chaque voix casse. La personne hésite et tousse aux
instants que le scénario choisit ; aucun son ni modèle de voix n'entre dans un dépôt. Le relevé donne un taux par
scénario et par attente, les échecs par espèce, par source et par voix, et le déroulé de chaque échec.

**Ce que cette étape règle.** Le cadrage le dit (§ 2, point 4) : ce qui tient à une course (une coupure, une
reprise, un essai retiré) passe une fois sur deux sans qu'on le voie. Trois suites de 25 attentes tenues ne disent
pas qu'une course rate une fois sur dix. Et la variété manque : toute la personne parle avec Hortense, et les quatre
scénarios de toux ne se jouent pas, faute de toux.

**Source :** le cadrage [« Prouver la présence sans l'oreille »](../specs/2026-11-11-banc-presence-cadrage.md),
validé par CrOliX le 11/11 (lun-docs#161) : § 3 (deux horloges, les seuils du banc français, des données françaises
fabriquées), § 4 pièce 4 (« Des données et des taux »), § 5 étape 4, § 7. Les plans exécutés
[des scénarios](2026-11-11-scenarios-presence.md) et [de la chaîne sur le laptop](2026-11-11-chaine-laptop.md), avec
ce que leur exécution a trouvé. Les issues `inbox` lun-luxuria#63, #70, #72. Code relu sur `main` de Lun'Luxuria
(`8a7d99f`) et de Lun'Anima (`b457668`). Les relevés des suites 1, 1 small, 2, 2b et 2c dans `banc-sons/chaine/`.
Références relues le 12/11, rien lancé : Pipecat (`evals/release/README.md`, `src/pipecat/evals/results.py`,
`evals/release/scenarios/user_audio.yaml`), LiveKit Agents (`tests/fake_session.py`), AIRI (`packages/testing-audio`,
avec `scripts/generate-wake-word-fixtures.ts`) ; la liste des voix de Piper et leurs fiches (`rhasspy/piper-voices`,
Hugging Face). Le plan-challenger, le 12/11 : treize objections, chacune vérifiée dans le code avant d'être reprise.

**Critères de fin du palier 1 :**

- Chaque mesure de la tâche 0 est écrite dans ce plan, avec sa valeur et ce qu'elle change au palier 2.
- Rien n'entre dans un dépôt : les scripts et les copies de `BANC_DIR` vivent dans `banc-sons/chaine/essai-taux/`,
  retirés à la fusion du palier 2. Une voix de Piper téléchargée l'est après l'accord de CrOliX, dans le dossier de
  Piper, hors dépôt.

**Critères de fin du palier 2 :**

- `CHAINE_REPETITIONS=N CHAINE_VOIX=… npm run chaine` joue chaque scénario jouable N fois par voix, tour par tour.
  Sans ces variables, la suite joue comme aujourd'hui : une partie par scénario, Hortense, les mêmes fichiers, plus
  `resultats.jsonl`.
- Chaque partie écrit une ligne dans `resultats.jsonl` dès qu'elle finit, et porte le nom `<nom>#<k>` dans
  `partie.json`. Une suite répétée écrit `releve-taux.md` (tout ce que dit « Ce qu'est un taux ») et, pour les parties
  du premier tour, `releve-chaine.md` comme aujourd'hui.
- La course : trente parties par scénario avec Hortense, relevées. La robustesse : au moins trois voix de synthèse
  autres que la sienne, deux parties par scénario chacune, relevées.
- Le relevé nomme la voix et le modèle de chaque son ; un son posé y est une prise (`pose:<fichier>`). Aucun son ni
  modèle de voix n'est suivi par git (la CI le vérifie pour les sons).
- Un mot d'hésitation (« euh ») est dit par chaque voix gardée, dans `hesite-puis-demande`, ou ce plan dit pourquoi
  non (tâche 0, point 3).
- Les quatre scénarios de toux sont joués avec la toux que CrOliX a tranchée ; sinon le relevé dit encore « son
  manquant », et ce plan dit pourquoi. Ce que `tiny` fait de la toux est au relevé.
- lun-luxuria#72 : `couper-le-blanc` tient quand `tiny` entend « Arret. », et un test sur textes seuls montre que
  chaque transcription vue choisit la même réponse que son `dit`. lun-luxuria#70 : ses attentes restent des mesures,
  avec leur distribution. Aucune borne n'est élargie.
- `npm test` ne change pas de durée de plus de cinq secondes : la chaîne n'y tourne pas.

| Dépôt, branche | Issue | PR | Niveau |
|---|---|---|---|
| `lun-luxuria`, `feat/taux-presence` | à ouvrir avec le palier 2 ; lun-luxuria#70, #72 | à ouvrir | `standard` |
| `lun-docs`, `docs/deroule-tour` | la même ; la tâche 0 n'en ouvre pas | lun-docs#162 | `trivial` |

## Ce que le code fait aujourd'hui

**Lun'Luxuria**

- **Une partie par scénario, un lancement par suite.** Chaque lancement construit la page, démarre son service de
  voix, Chrome et le serveur de la chaîne, et s'appaire (`chaine.test.ts:363-402`). `it.each` joue chaque scénario
  une fois (`:542-571`) et échoue sur une demande inattendue au faux modèle ou une attente qui ne passe pas
  (`:567-568`). La fin écrit `releve-chaine.md` et un `deroule-chaine-<nom>.jsonl` par scénario (`:404-414`). Le
  témoin par Chromium joue `deux-phrases` (`:565`). `CHAINE_SCENARIOS` filtre par nom (`:544`) : un nom donné deux
  fois ne joue qu'une fois. `BANC_DIR` se lit dans l'environnement (`:294`).
- **La partie en cours** : le joueur écrit `serveur/partie.json`, `{ nom, reponses }`, avec le nom du scénario seul
  (`chaine.test.ts:423-424`), et garde la longueur du journal du serveur pour n'en lire que la suite (`:426-427`).
- **Un seul fil** : la page écrit toujours dans le fil `main` (`src/core.ts:11`, `:94`) ; sur un lancement, toutes les
  parties s'ajoutent au même fil du serveur.
- **Une seule voix pour la personne.** `sonsDe(s, DIR, synthSapi)` (`chaine.test.ts:551`) : la synthèse est un
  paramètre (`sons.ts:137`). Hortense par `System.Speech` (`sons.ts:239-257`). La clé du cache est
  `sha256('sapi-hortense-16k\n' + texte)` dans `sons/sapi/` (`sons.ts:29`, `:96-109`). Les silences de tête et de fin
  sont rognés à un niveau fixe de 0,01, sans marge (`sons.ts:28`, `:62-78`).
- **Un son posé passe devant tout** (`sons.ts:111-114`) : `sons/<nomDe(dit)>.wav`. Chaque suite de `banc-sons/chaine`
  a `sons/non.wav`, la prise de CrOliX du 10/11 : `non-court` joue ce « Non », quelle que soit la voix. Un son posé est
  rogné, jamais coupé à sa `duree` ; un bruit l'est (`sons.ts:141-146`). `nomDe('(toux)')` vaut `toux`
  (`sons.ts:32-39`) : un seul `toux.wav` servirait `toux-courte` (300 ms) et les deux toux de 450 ms, à sa propre
  longueur.
- **Les hésitations s'écrivent déjà.** Un mot dans `dit`, un silence dans `trous` (`scenario.ts:141-142`) ; la
  chaîne coupe le texte au mot le plus proche de chaque silence et synthétise chaque morceau (`sons.ts:42-56`,
  `:117-129`). Aucun scénario n'a de mot d'hésitation ; `delai-a-l-essai` a un trou de 300 ms.
- **La toux manque.** Un `dit` entre parenthèses n'est pas synthétisé : « son manquant : toux.wav »
  (`sons.ts:116`) ; un bruit prend `bruit.wav` (`:141-146`). Quatre scénarios toussent (`toux-parole`, `toux-courte`,
  `toux-reflexion`, `toux-puis-parole`, qui a aussi un `bruits`, `toux-puis-parole.ts:25`).
- **Le juge.** `juger(s, partie, 'chaine')` fait d'une attente `exact` une mesure (`judge.ts:302`), et nomme
  `transcription` quand le faux modèle choisit sur le texte reçu une autre réponse que sur le `dit`
  (`judge.ts:161-179`, `:334-346`). Un défaut connu est conforme si l'attente rate de la même espèce **et** au même
  `trouve` (`judge.ts:313-318`) ; `passe` le compte alors tenu (`:52-53`). À la chaîne, un connu dont le `trouve`
  diffère fait échouer la partie (`chaine.test.ts:568`).
- **Le relevé.** `releve()` compte les tenues et range les échecs par espèce et par source (`releve.ts:46-83`) ;
  `releveChaine` ajoute par scénario les phrases (`dit`, `entendu`, confiance), les délais exacts et de la chaîne, ce
  qui sonne (`releve.ts:132-269`). Une demande sans réponse y reçoit une source : `transcription` si le `dit` aurait
  choisi une réponse, sinon `scenario` (`releve.ts:162-177`). Aucun compte sur plusieurs parties.
- **Les tenues à la chaîne** arrivent 427 à 466 ms après le début de la parole dans les cinq suites (`suspendue`,
  `retenue`, `sortie-arretee`), contre 384 au niveau exact : 43 à 82 ms plus tard.
- **Le niveau exact ne varie pas.** Le joueur pose l'horloge fausse à zéro (`player.ts:31-39`) ; la suite joue chaque
  scénario deux fois et exige deux déroulés égaux (`scenarios.test.ts:40-41`). Les délais des briques fausses sont
  des champs du scénario : `transcriptionMs` par parole (`fakes.ts:136`), `premierMotMs` et `entrePhrasesMs` par
  réponse (`fakes.ts:186-188`, `:198`), `syntheseMs` et `msParCaractere` pour sa voix (`fakes.ts:80-82`).
- **Le choix du faux modèle** : `choisir`, la première réponse dont `si` est contenu dans le texte reçu, sans accents
  ni casse (`scenario.ts:308-312`). `arrete-net.ts:27` et `couper-le-blanc.ts:28` répondent à `si: 'arrete'`. Dans
  `couper-le-blanc`, l'autre réponse a aussi un `si` : « Arret. » n'en choisit aucune, d'où `modele_inattendu`
  (lun-luxuria#72). Dans `arrete-net`, l'autre n'en a pas : « Arret. » la choisit, sans échec, mais le juge y voit une
  divergence.
- **Le service de voix** n'a qu'une synthèse, la sienne, par le paquet Python `piper` (`voix/service.py:74-95`,
  `:80-86`). Kokoro y est appelé avec la voix `ff_siwa` (`:94`).

**Lun'Anima**

- Le faux modèle choisit par la même règle (`core/src/testing/faux-modele.ts:110`) et relit `partie.json` à chaque
  demande : un `si` changé dans un scénario vaut des deux côtés, sans rien toucher ici.
- Le serveur de la chaîne tourne sur une base en mémoire, un par lancement. Son journal étiquette chaque ligne avec la
  partie lue au moment de la ligne (`core/src/cli/chaine.ts:33-40`).
- Le serveur ne réagit à un texte d'arrêt que pour « annule » et ses variantes (`core/src/chat/service.ts:229-238`) :
  « Arrête » coupe par la page, jamais par son texte.

**Sur le laptop** (vérifié le 12/11, sans rien installer) :

- Voix de Windows : en SAPI, Hortense (et Zira, anglaise) ; en OneCore, Hortense, Julie et Paul.
- Le dossier de Piper (`../../piper` depuis Lun'Luxuria) : `piper.exe`, `piper_phonemize.dll`,
  `libtashkeel_model.ort`, `espeak-ng.dll` et ses données, une seule voix (`fr_FR-siwis-medium`), qui est la sienne
  dans la chaîne (`chaine.test.ts:297`). C'est le Piper en C++, pas le paquet Python du service : deux Piper.
- `banc-sons/pipecat-fra/` : 122 phrases françaises du jeu de test de Pipecat, toutes de synthèse (`chirp3_1`),
  étiquetées finies ou non, avec une hésitation au milieu (82) ou à la fin (37), sans leur texte ; CC BY 4.0, déjà
  servies au plan [« la fin de phrase »](2026-11-11-fin-de-phrase.md).
- `banc-sons/chaine/` : les relevés et déroulés des suites 1, 1 small, 2, 2b, 2c ; `sons/non.wav` dans chacune.
  Aucun `toux.wav` ni `bruit.wav`.

**Déjà mesuré** (plan de la chaîne, « Ce que l'exécution a trouvé », et les relevés des suites) : une suite `tiny`
dure environ 140 s pour neuf parties et le témoin ; les déroulés de la suite 2c durent 4,2 à 12,2 s. `tiny` sur un
fichier d'Hortense rend le même texte cinq fois sur cinq (`chaine-laptop.md:205-208`). Ce qui varie d'une partie à
l'autre : « Arrête », transcrit à une confiance de 0,37 à 0,43, rendu « Arret ? » ou « Arret. » 2 fois sur 6 ; le
silence de tête de Piper, de 0 à 190 ms, et la durée d'une même phrase, de 1506 à 1691 ms ; les mots entendus à la
coupure, à un près ; le blanc de tour, jusqu'à 130 ms. La transcription `tiny` dans la chaîne : 353 à 371 ms.

## Ce que les références apportent

- **Pipecat** (`evals/release/README.md`, « Repeating a run ») : `--repeat N` rend un taux par robot et par
  scénario ; les essais alternent (`A#1, B#1, C#1, A#2…`) pour que chacun voie la même machine ; chaque essai numérote
  ses fichiers ; les échecs sont rangés par espèce, tour et attente (`FAILURE_KINDS`, `results.py`) ; un tour
  `not_run` n'est jamais compté réussi, « counting those as passes would inflate any rate ». **Une suite répétée
  rend toujours 0** : ses robots reposent sur des modèles qui tirent au hasard, le taux acceptable est à décider.
  Chaque essai écrit une ligne dans `results.jsonl` dès qu'il finit ; un essai raté y porte tous les événements vus.
- **Ce que Pipecat ne fait pas** : sa personne parle d'une seule voix (Kokoro `af_heart`, `user_audio.yaml`),
  gardée en cache ; aucun bruit n'est ajouté (rien de tel dans `src/pipecat/evals/`). Plusieurs voix et des bruits
  viennent du cadrage (§ 3, point 4) et d'EVA, qui n'a pas été cloné ni relu ici.
- **LiveKit** (`tests/fake_session.py:35-52`) : un `speed_factor` accélère le temps réel ; aucun délai tiré au
  hasard dans ses fausses briques ni dans ses tests de session. On n'en tire pas non plus (voir « Où répéter »).
- **AIRI** : rien sur la répétition dans `packages/testing-audio/src`. Ses scripts de fixtures
  (`scripts/generate-wake-word-fixtures.ts`) font chaque fixture d'une seule voix (`alloy` d'OpenAI, une autre avec
  Samantha de macOS), rognent le silence avec 100 ms de marge, et rééchantillonnent en linéaire, sans filtre : un TODO
  dit que les fixtures passent avec ce rééchantillonnage et avec un sinc. Nous rognons sans marge (`sons.ts:62-78`) et
  rééchantillonnons aussi en linéaire (`replay.ts:32` : « fine to find where a voice is, not to judge a sound ») :
  la tâche 0 mesure ce que les deux changent à `tiny`.
- **Les voix de Piper** (liste et fiches lues le 12/11) : sept modèles français. Les licences sont celles de leurs
  données, d'après leur fiche :

| Modèle | Locuteurs | Données, licence |
|---|---|---|
| `fr_FR-upmc-medium` | 2 : jessica, pierre | `upmc-pierre-data`, CC BY-SA 4.0 |
| `fr_FR-mls-medium` | 125 | Multilingual LibriSpeech (lecteurs de LibriVox), CC BY 4.0 |
| `fr_FR-gilles-low` | 1 | un jeu Kaggle à une voix, CC0 |
| `fr_FR-tom-medium` | 1 | AGPLv3 |
| `fr_FR-mls_1840-low` | 1 | fiche non lue |
| `fr_FR-siwis-low`, `fr_FR-siwis-medium` | 1 | sa voix dans la chaîne, exclue |

  Ces voix reproduisent des personnes réelles. Rien n'étant distribué, leurs licences ne pèsent pas en local ; ce qui
  compte : aucun son ni modèle dans un dépôt, et la voix nommée au relevé, sa licence dans ce tableau.
- **Unmute** (cadrage § 3) rend médiane, 90e et 95e centiles d'un client de charge : il n'est pas cloné ici et n'a
  pas été relu. Le calcul des centiles de ce plan ne s'en inspire pas.

## Palier 1 : la tâche 0

0. - [ ] **Ce que la suite suppose, mesuré** (`testeur`, des scripts jetables dans `banc-sons/chaine/essai-taux/`,
   hors git ; rien dans un dépôt). Seule.
   1. **Julie et Paul.** `System.Speech` ne les voit pas. Les atteindre par WinRT
      (`Windows.Media.SpeechSynthesis.SpeechSynthesizer`) depuis PowerShell 5.1, un script fixe, le texte sur l'entrée
      standard : marche-t-il, quel format, quelle fréquence, quel temps par phrase. Essayé en premier.
   2. **Piper pour la personne.** `piper.exe` du poste, avec `--model`, `--speaker`, `--output_file` et le texte sur
      l'entrée standard (ses options sont à vérifier, pas supposées). Après l'accord de CrOliX, télécharger
      `fr_FR-upmc-medium` dans le dossier de Piper, écrire ici sa taille et le champ de son `.onnx.json` qui nomme les
      locuteurs. `fr_FR-mls-medium` seulement si Julie, Paul, jessica et pierre donnent moins de trois voix utiles.
   3. **Chaque voix sur nos phrases.** Hortense, Julie, Paul, jessica, pierre (et des lecteurs de MLS, s'il a fallu
      le télécharger). Pour chacune, les morceaux distincts des treize scénarios jouables à la chaîne, tels que
      `couper` les coupe (`sons.ts:42-56`), et trois mots d'hésitation (« euh », « ben », « hum »). `tiny` **une
      fois** par morceau : cinq fois n'a rien montré sur Hortense (`chaine-laptop.md:205-208`). Pour chacun : le
      texte, la confiance, la part juste au sens de `nomDe(entendu) === nomDe(dit)` (`sons.ts:32`). Deux variantes,
      une fois chacune, sur toutes les voix : le WAV à sa fréquence native contre le même passé par `readWav`
      (`replay.ts:25-32`, linéaire sans filtre ; Piper sort à 22,05 kHz, Hortense à 16 kHz) ; le rognage sans marge
      contre 100 ms de marge, comme AIRI. Silero par `replay()` (première trame de voix, un bloc ou plusieurs, tenue à
      384 ms) ; la durée réelle contre `duree`.
   4. **La toux**, celle que CrOliX tranche (voir « À trancher ») : sa prise, un fichier CC0, ou une synthétique (un
      souffle filtré à attaque franche et descente rapide ; deux souffles ; un souffle sur une impulsion grave voisée).
      Coupée à 300 et à 450 ms. **Le critère, Silero seul**, par `replay()` : à 450 ms, une tenue (400 ms de voix) ; à
      300 ms, aucune ; à quatre décalages dans la trame de 32 ms (0, 8, 16, 24 ms de silence en tête) ; avec au moins
      une trame de marge des deux côtés. Ce que `tiny` en fait (vide, « Merci. », un mot) est noté à chaque décalage :
      une mesure, jamais un critère. La toux gardée est posée en `toux.wav` et en `bruit.wav` dans les copies du
      point 6.
   5. **La variance de la chaîne.** Dix lancements de la suite d'aujourd'hui (Hortense, `tiny`), un par un, les
      relevés gardés. Le taux de chaque attente `tous`, compté à la main. Pour chaque délai de brique (transcription,
      premier mot, synthèse de Piper, durée par caractère, silence de tête) : les valeurs **dans l'ordre des
      lancements**, pour qu'une dérive se voie, puis le plus petit et le plus grand. La durée de chaque partie et de
      la mise en route. Le poste sur secteur, veille coupée, au repos, noté ici.
   6. **Un passage par voix gardée, sans code.** Pour chaque voix : un script appelle `sonsDe` avec sa synthèse
      (elle est un paramètre, `sons.ts:137`) sur une copie de `BANC_DIR` (`essai-taux/<voix>/`) ; le cache s'y remplit
      de cette voix, sous la clé d'Hortense (`sons.ts:101-102`). `BANC_DIR=…/essai-taux/<voix> npm run chaine` la
      joue (`chaine.test.ts:294`). La copie n'a pas `non.wav` : chaque voix dit « Non ». Pour chaque voix : les échecs
      qu'elle fait naître, par source, et sa durée. La copie a la toux gardée : ce passage joue les quatre scénarios
      de toux, et dit si Silero tient à la chaîne une toux de 450 ms (les tenues y arrivent 43 à 82 ms plus tard).
   7. **Le coût d'une partie exacte** : `scenarios.test.ts` chronométré, puis trois scénarios rejoués par la façon de
      « Rejouer un échec », aux bords des plages du point 5 : leurs attentes `tous` tiennent-elles ? Ce point suffit à
      dire si un plan à part, qui tirerait les délais au niveau exact, a une raison d'être.
   8. **Ce qu'on a entendu** : chaque transcription vue aux points 3, 5 et 6 pour chaque `dit` d'un scénario jouable,
      écrite dans ce plan. Le test de la tâche 4 se construit dessus.
   - **Ce qu'elle installe**, hors dépôt : `fr_FR-upmc-medium` après accord ; `fr_FR-mls-medium` s'il le faut, après
     accord. Rien d'autre.
   - **Ce qu'elle rend** : une section « Ce que la tâche 0 a mesuré » dans ce plan, et pour chaque choix du palier 2
     s'il tient, change ou tombe.

## Palier 2 : les choix **[avis]**

À réviser avec les mesures de la tâche 0.

### Les voix de la personne

**Hortense pour la course ; pour la robustesse, Julie, Paul, jessica et pierre, jamais sa voix.**

- **Hortense** est déjà là et en cache : la course rejoue les mêmes sons, seule la chaîne varie.
- **Julie et Paul**, si la tâche 0 les atteint : une femme et un homme de plus, sans rien à télécharger.
- **jessica et pierre** (`fr_FR-upmc-medium`) : un seul fichier, deux voix, une femme et un homme. **MLS** seulement
  s'il en faut plus, deux ou trois lecteurs choisis sur les mesures du point 3, pas à l'oreille.
- **Exclues** : siwis, sa voix dans la chaîne (le cadrage veut des voix « différentes de la sienne ») ; Kokoro, dont
  la seule voix française vient, à ma connaissance, du même corpus SIWIS (non vérifié ici) ; espeak-ng, robotique,
  et sans exécutable sur le poste ; `fr_FR-tom-medium`, une voix de plus sous AGPLv3, inutile avec upmc.
  `fr_FR-gilles-low` (CC0) reste en réserve : sa qualité est la plus basse.
- **Une voix que `tiny` transcrit mal** reste mesurée (sa part juste au relevé) ; ses échecs de source
  `transcription` ne font pas échouer la suite (voir la règle d'échec).
- **Le son posé** (à trancher) : je recommande qu'il soit ignoré quand `CHAINE_VOIX` est donné, pour que chaque voix
  dise tout, le « Non » court compris, le plus dur pour `tiny` ; sans `CHAINE_VOIX`, sa prise joue, nommée
  `pose:non.wav` à la ligne et au relevé. Une toux posée sert toujours : aucune voix ne dit une toux.
- **Ce qui ne change pas** : le texte sur l'entrée standard, jamais dans la ligne de commande (`sons.ts:235-238`) ;
  chaque son de synthèse en cache, dans `banc-sons`, par voix ; Piper hors du dépôt. Les voix de Windows sont sous
  la licence de Windows, pour un usage personnel ; leurs sons ne quittent pas le poste.
- **Deux Piper** : sa voix passe par le paquet Python du service (`voix/service.py:80-86`), celle de la personne par
  `piper.exe` du dossier. Un même modèle peut sonner autrement dans chacun ; la personne ne passe jamais par le
  service.

### Les hésitations

**Écrites dans le scénario, dites par chaque voix.** Le format les porte déjà : un mot dans `dit`, un silence dans
`trous`, à l'instant que le scénario choisit. Rien à coder. Ce qu'on ignore : comment chaque voix dit « euh »
(tâche 0, point 3).

**Un scénario de plus**, `hesite-puis-demande`, si la tâche 0 montre que les voix disent « euh » comme une voix :
« Tu peux me lire, euh, la liste des courses », un silence de 400 ms après « euh », entre la pause de l'essai
(160 ms) et le silence de fin (700 ms). Il attend, en `tous` : un essai à l'hésitation, retiré quand la voix revient ;
l'essai de la fin confirmé ; une seule réponse qui sonne, rien de l'essai retiré. Son apport sur `delai-a-l-essai` :
l'hésitation est un mot, et l'essai part sur un texte qui finit par « euh », dont la vraie transcription fait ce
qu'elle veut. Une voix qui ne dit pas « euh » comme une voix est écrite ici, avec ce que Silero et `tiny` en font.

Les 122 phrases de `banc-sons/pipecat-fra` ne servent pas ici : leur texte manque, et leurs hésitations visent
l'épreuve « tenir une pause » du banc français, qui attend le modèle de fin de phrase, sur une branche non fusionnée
(`feat/fin-de-phrase`). La longueur de leurs pauses n'a pas été mesurée. Common Voice, que le cadrage nomme pour les
hésitations, est un écart à trancher (voir la fin).

### La toux

**La règle validée reste l'option principale** : la toux est enregistrée par CrOliX, ou un fichier sous licence CC0
seulement (`chaine-laptop.md:249-251`). Sa prise, gardée dans `banc-sons` hors git, ou un fichier CC0 qu'il choisit
(Freesound en a ; non vérifié ici). **L'autre option** : une toux synthétique, choisie sur Silero seul (tâche 0,
point 4), écrite une fois par le script de la tâche 0 et posée comme un fichier ; aucun générateur dans le dépôt.

Ce que `tiny` en fait n'est jamais un critère : le plan de la chaîne veut le trouver (« un « Merci. » inventé est un
défaut à trouver ici », `chaine-laptop.md:279-280`). Choisir une toux que `tiny` rend vide le cacherait.

La toux est posée en `toux.wav` et en `bruit.wav` (le `bruits` de `toux-puis-parole.ts:25`), et coupée à sa `duree`
(tâche 1). Aucun autre bruit (clic, porte, fond sonore) : aucun scénario n'en demande.

**Ce que chaque toux donnera à la chaîne**, d'après les tenues des cinq suites :

| Scénario | Attentes `tous` | À la chaîne |
|---|---|---|
| `toux-parole` | `verdict-bruit`, `arrete`, `reprise`, `redite-dans-le-deroule`, `redite` | aucune bornée |
| `toux-courte` | `verdict-bruit` | `tiny` doit rendre vide 300 ms de toux |
| `toux-reflexion` | `verdict-bruit`, `relachee`, `elle-repond`, `pas-de-coupure` | aucune bornée |
| `toux-puis-parole` | `verdict-bruit`, `reprise`, `chevauchement-garanti`, `chevauchement-nul` | voir dessous |

- **Les attentes sans borne** demandent que Silero tienne la toux de 450 ms et que `tiny` rende la toux vide. Leurs
  attentes `exact` (`suspendue`, `blanc`, `retenue`, `relachee-a-la-fin`, les trois de `toux-courte`) restent des
  mesures.
- **`verdict-bruit`**, dans les quatre : si `tiny` invente un mot, elle rate. C'est le défaut que le plan de la
  chaîne veut trouver : une issue, et un connu qui la nomme.
- **`chevauchement-garanti`** (`[0, 432]`, « 400 + 32 », `toux-puis-parole.ts:69-76`) mesure le temps où elle parle
  par-dessus la parole 1. À la chaîne, son son s'arrête 447 à 466 ms après le début de la parole (`sortie-arretee`,
  cinq suites) : elle ratera presque toujours. Sa borne est le calcul à la trame (`toux-puis-parole.ts:13-15`), comme
  celles de lun-luxuria#70 : à trancher.
- **`chevauchement-nul`** (`[0, 0]`, connu lun-luxuria#63, `trouve: 384`) : à la chaîne `trouve` vaudra environ 450,
  et `judge.ts:317` ne le dira jamais conforme ; le défaut connu ferait échouer la partie. La tâche 2 le reconnaît, à
  la chaîne, par son espèce seule.
- **Un risque** : les tenues à la chaîne arrivent 43 à 82 ms plus tard qu'au niveau exact. Si ce retard tient à
  l'attaque de Silero plutôt qu'au trajet du son, une toux de 450 ms pourrait ne pas être tenue à la chaîne. Le point 6
  de la tâche 0 le voit.

### Où répéter : la chaîne seule

**La chaîne**, parce que c'est là que les choses varient : la transcription, Piper, Silero, le processeur. Elle a
deux défauts : elle est lente (environ 13 s par partie, voir plus bas), et un échec ne s'y rejoue pas, le prochain
tirage de `tiny` ou de Piper sera autre.

**Pas de tirages au niveau exact.** Le cadrage veut ce niveau déterministe, dans la CI, en secondes (§ 4, point 3).
Tirer les délais des briques fausses ne toucherait ni `duree` ni l'écoute, là où la chaîne varie, et casserait des
ancres posées à la ms près : dans `couper-le-blanc`, « Arrête » tombe 1444 ms après le début d'une phrase de
24 × 60 = 1440 ms (`couper-le-blanc.ts:7-10`, `:23-24`) ; un `msParCaractere` au-dessus de 60,2 fait rater `coupee`
par construction. Le point 7 de la tâche 0 dit si un plan à part se justifie.

### Rejouer un échec au bit près, sans tirage

Une façon de faire, écrite ici, pas codée. On part de la ligne de la partie ratée (`delais`, `phrases`) et de son
déroulé :

1. Copier le scénario dans `src/presence/scenarios/<nom>-rejeu.ts`, son `nom` changé, jamais commité.
2. Y reposer ce que la partie a mesuré : `transcriptionMs` de chaque parole ; `premierMotMs` et `entrePhrasesMs` de
   chaque réponse ; `voix.syntheseMs` ; `voix.msParCaractere`, la durée réelle de ses phrases sur leurs caractères
   (une moyenne, un seul nombre pour toutes) ; la `duree` de chaque parole, la longueur réelle de son son.
3. `npm run scenarios` la joue au niveau exact : deux fois le même déroulé (`scenarios.test.ts:40-41`), lu avec les
   briques fausses, autant de fois qu'on veut.

Ce qu'elle dit : la copie reproduit les délais de la partie, pas son écoute (Silero et `tiny` y sont faux). Un échec
que la copie reproduit est une course dans la page ; un échec qu'elle ne reproduit pas vient de l'écoute ou d'une vraie
brique. Le compte de `scenarios.test.ts:29-31` échoue tant que la copie est là : voulu, elle ne s'oublie pas.

### Combien de parties, en combien de temps

- **La course** : Hortense, trente parties par scénario. Les mêmes sons à chaque partie (le cache) : ce qui varie est
  la chaîne. La règle de trois vaut ici, les parties étant jouées de la même façon : zéro échec sur trente met
  l'échec sous 10 %, à 95 %. Une course qui rate une partie sur dix se montre au moins une fois en trente parties, 96
  fois sur 100 ; une qui rate une fois sur deux, en cinq parties, 97 fois sur 100.
- **La robustesse** : chaque voix gardée, deux parties par scénario. Pas de taux : une voix qui casse un mot le casse
  presque à chaque fois ; deux parties le montrent, et le séparent d'une course, que la course mesure. Les échecs par
  source disent si c'est la transcription.
- **Avant la longue suite**, `N=3` avec Hortense (39 parties, environ 9 min) : la dérive des délais par rang, le
  serveur après 39 parties sur le même fil `main`, le relevé lu. La course ne part que si rien ne dérive.
- **Le temps sur le laptop** : environ 13 s par partie, mise en route comprise (estimé : (140 − 23) / 9, la suite 2c ;
  mesuré à la tâche 0). La course : treize scénarios, 390 parties, environ 1 h 25 dans un seul processus. La
  robustesse avec quatre voix : 104 parties, environ 23 min.
- **Le poste** : la longue suite sur secteur, veille coupée, poste au repos, écrit ici avec le relevé ; le relevé
  donne le nom du poste et son processeur.
- **Une partie à la fois** : `partie.json` est unique (`chaine.test.ts:424`), et la transcription partage le
  processeur avec Chrome : deux parties à la fois se mesureraient l'une l'autre.
- **Le disque** : un déroulé pèse environ 6 Ko (suite 2c) ; environ 500 parties, environ 3 Mo. Chaque partie garde
  le sien.

### Ce qu'est un taux

- **Une partie** : un scénario joué une fois, avec une voix. `k` compte les parties d'un scénario sur tout le
  lancement ; la partie s'appelle `<nom>#<k>` dans `partie.json`, et le journal du serveur porte ce nom
  (`chaine.ts:36-40`).
- **Une partie tenue**, une seule définition, partout (relevé, ligne de résumé, règle d'échec) : chaque verdict sans
  défaut connu passe (`passe`, `judge.ts:52-53`), et le faux modèle n'a reçu aucune demande inattendue. Les verdicts
  d'un défaut connu n'y entrent pas, quel que soit leur état.
- **Le taux d'un scénario** : parties tenues sur parties jouées, par voix. La phrase de la règle de trois n'accompagne
  que la course.
- **Le taux d'une attente `tous`** : tenues sur parties où le scénario a été joué. Une `non_jouee` n'est jamais
  tenue ; elle est comptée à part, comme le `not_run` de Pipecat.
- **Un défaut connu** : trois comptes, montré tel qu'il est connu (à la chaîne, la même espèce), absent (tenu),
  autrement raté (une autre espèce).
- **Une attente `exact`** : la part de ses parties dans sa borne, et la distribution de `trouve`.
- **Un délai** : par tour, la médiane, le 95e centile s'il y a au moins vingt valeurs, le plus petit, le plus grand ;
  et la médiane du premier et du dernier tour, pour une dérive. Jamais une moyenne seule (cadrage § 3, point 2).
- **La transcription** : par phrase et par voix, la part juste (`nomDe(entendu) === nomDe(dit)`) et chaque variante
  entendue, avec son compte.
- **Les échecs** : par espèce et par source, comme aujourd'hui (`releve.ts:62-64`), et par voix ; une demande sans
  réponse avec sa source (`releve.ts:162-177`).
- **Le déroulé de chaque échec** : le relevé liste les parties ratées avec leur nom, leur voix, l'attente, l'espèce,
  la source, la valeur, le fichier et l'extrait du verdict.

### Ce qui fait échouer une suite répétée

**`N=1` ne change pas** : une attente `tous` ratée ou une demande inattendue fait échouer la suite.

**`N>1`, la variante du plan-challenger** (à trancher, recommandée). Chaque partie est jouée, sans `expect` partie
par partie ; une erreur hors du juge compte la partie ratée, d'espèce `joueur`, et la suite continue. À la fin, la
suite échoue si une partie a :

- une attente `tous` sans défaut connu, ratée ou non jouée, dont la source n'est pas `transcription` ;
- une demande sans réponse de source `scenario` ;
- une erreur du joueur.

Sinon elle rend 0. La dernière ligne dit quelles attentes `tous` sont sous 100 %, et lesquelles le sont par la
transcription. Elle garde la règle validée (`chaine-laptop.md:61-62` : une `tous` ratée ou non jouée fait échouer la
suite) pour ce que notre code fait, et laisse en mesure ce que `tiny` coûte. Une course trouvée devient une issue et
un connu, jamais une borne élargie.

Les autres voies : **la règle de Pipecat**, qui rend toujours 0 (ses robots reposent sur des modèles qui tirent au
hasard ; ici une course est un défaut de mécanisme) ; **au minimum**, échouer si une `tous` tombe à 0 %.

### lun-luxuria#72 : « Arret. »

**Le `si` de la réponse à « Arrête » devient `arret`**, dans `arrete-net.ts:27` et `couper-le-blanc.ts:28`. La page
ne lit pas le texte pour se suspendre ; le vrai serveur ne réagit à un texte d'arrêt que pour « annule »
(`service.ts:229-238`). Le faux modèle tient la place d'un modèle qui comprend « Arret. » comme « Arrête » ;
Lun'Anima applique la même règle (`faux-modele.ts:110`). Ce n'est pas une borne : `si` dit ce que le faux modèle
comprend, pas ce qu'on attend de la page.

**Le garde-fou : un test sur textes seuls** (tâche 4). Pour chaque scénario jouable, chaque transcription vue (tâche 0,
point 8, et les suites) choisit par `choisir` (`scenario.ts:311-312`) la même réponse que son `dit`. Il attrape le vrai
risque : un `si` élargi qui prend une autre parole, ou qui passe devant une autre réponse dans l'ordre de `choisir`.
C'est ce test qui ferme #72. Comparer les déroulés exacts d'avant et d'après ne montrait rien : à ce niveau, la
transcription rend le `dit`.

L'autre voie : garder `arrete` et compter l'échec, de source `transcription`. Avec la règle d'échec recommandée, il
ne ferait pas échouer la suite, mais pèserait sur chaque taux.

### lun-luxuria#70 : les attentes `exact` trop justes pour la chaîne

**Elles restent des mesures.** Le relevé des taux donne, pour chacune, la part dans sa borne et la distribution de ce
qu'elle trouve : « trois mots entendus, à un près », « `sortie-arretee` à −2 ms ». C'est ce que l'issue demande de
voir. Ajouter une attente `tous` plus large serait élargir une borne sous un autre nom. L'issue se ferme avec le
premier relevé des taux. `chevauchement-garanti` est du même genre : à trancher (voir la fin).

## Palier 2 : les contrats

### Une ligne par partie

`resultats.jsonl`, vidé à chaque lancement, une ligne ajoutée dès qu'une partie finit : une suite arrêtée garde les
lignes de ses parties. Le type vit dans `src/presence/taux.ts`.

```ts
interface Resultat {
  suite: string;                     // l'heure du lancement, ISO
  scenario: string;
  partie: string;                    // `<nom>#<k>`, le nom écrit dans `partie.json`
  rang: number;                      // k, de 1, sur tout le lancement
  voix: string;                      // `hortense`, `julie`, `piper:fr_FR-upmc-medium#pierre`…
  transcription: string;             // `faster:tiny`
  synthese: string;                  // sa voix : `piper:fr_FR-siwis-medium`, ou `fausse`
  poste: string;                     // `os.hostname()` et le processeur
  dureeMs?: number;                  // la durée réelle de la partie
  verdicts: (Omit<Verdict, 'couverture' | 'extrait'> & { extrait?: string[] })[];  // l'extrait : échecs seuls
  delais: { tour: number; ms: Partial<Record<DelayName, number>>; synthese: number[] }[];  // `delays()`
  phrases?: { parole: number; dit: string; entendu?: string; confiance?: number; son: string }[];
  inattendus: { texte: string; source: 'transcription' | 'scenario' }[];
  deroule?: string;                  // le nom du fichier
  raison?: string;                   // un scénario non joué
}
```

`phrases[].son` dit d'où vient chaque son : `pose:non.wav`, `cache:julie`, `synthese:julie`.

### Les variables et les fichiers

| Variable | Par défaut | Rôle |
|---|---|---|
| `CHAINE_REPETITIONS` | `1` | parties par scénario et par voix |
| `CHAINE_VOIX` | `hortense` | ses voix, par des virgules : `hortense`, `julie`, `paul`, `piper:<modèle>[#<locuteur>]` |
| `CHAINE_STT`, `CHAINE_TTS`, `CHAINE_SCENARIOS`, `BANC_DIR` | inchangées | |

`<modèle>` est le chemin du `.onnx` ; `piper.exe` est pris à côté de lui, jamais à côté de sa voix (`CHAINE_TTS`).

| Fichier, dans `BANC_DIR` | Écrit par | Quand |
|---|---|---|
| `chaine/resultats.jsonl` | `npm run chaine` | toujours, une ligne par partie |
| `chaine/releve-chaine.md` | `npm run chaine` | toujours ; pour une suite répétée, les parties du premier tour |
| `chaine/deroule-chaine-<nom>.jsonl` | `npm run chaine` | une partie par scénario, comme aujourd'hui |
| `chaine/releve-taux.md`, `chaine/deroule-chaine-<nom>-<k>.jsonl` | `npm run chaine` | `N>1` ou plusieurs voix |
| `chaine/sons/<voix>/<empreinte>.wav` | `sonsDe` | le cache d'une voix ; Hortense garde `sons/sapi/` |

Le dossier d'une voix est le `nomDe` de son nom sans chemin (`piper-fr-fr-upmc-medium-pierre`) : jamais de « : »,
que Windows refuse dans un nom de dossier.

## Les scénarios à ce niveau

| Scénario | Répété à la chaîne | Pourquoi |
|---|---|---|
| les neuf joués aujourd'hui | oui, dans la course et la robustesse | |
| les quatre `toux-*` | oui, si une toux est posée | sinon « son manquant », comme aujourd'hui |
| `hesite-puis-demande` (nouveau) | oui, si la tâche 0 le garde | |
| `aparte-parole-longue`, `phrase-ecartee`, `echo-fort`, `delai-modele-lent` | non | `chaine.test.ts:120-130` |

## Palier 2 : les tâches

**En parallèle d'emblée** : 1 et 2. **Après la tâche 0** : 4, en parallèle de 1 et 2. **Après 1 et 2** : 3. **En
dernier** : 5. Chaque fichier n'a qu'une tâche à la fois : 1 seule dans `sons.ts` ; 2 dans `taux.ts`, `judge.ts` et
`releve.ts`, que 3 reprend après elle ; 4 seule dans `scenarios/` et `scenarios.test.ts` ; 3 seule dans le `CLAUDE.md`
et le `.gitignore`.

1. - [ ] **Les voix, et la source de chaque son** (`src/presence/chaine/sons.ts`, `sons.test.ts`, `dev-luxuria`).
   *Parallélisable d'emblée.*
   - `type Voix = { nom: string; synth: Synth }` ; `sonsDe(s, dir, voix, poses)` à la place de `synth`
     (`sons.ts:137`). `poses: false` ignore les paroles posées (la règle tranchée, voir « Le son posé ») ; un `dit`
     entre parenthèses prend toujours son fichier posé.
   - Le cache par voix (`dire`, `sons.ts:96-109`) : Hortense garde la clé `sapi-hortense-16k` et `sons/sapi/`, pour
     que le cache d'aujourd'hui serve encore ; une autre voix, la clé `<nom>\n<texte>` dans `sons/<nomDe(nom sans
     chemin)>/`.
   - `SonPret.source` (`sons.ts:16`) devient un texte : `pose:<fichier>`, `cache:<voix>`, `synthese:<voix>`.
   - Un son posé entre parenthèses est coupé à sa `duree`, comme un bruit (`sons.ts:141-146`) ; plus court qu'elle,
     une erreur qui le nomme. Aujourd'hui `toux.wav` servirait 300 et 450 ms à sa propre longueur.
   - `synthOneCore(nom)`, si la tâche 0 atteint Julie et Paul : comme `synthSapi` (`sons.ts:239-257`), un script fixe
     par `-EncodedCommand`, le texte sur l'entrée standard ; une voix absente, une erreur qui la nomme.
   - `synthPiper(modele, locuteur?)` : `piper.exe` à côté du modèle, des arguments fixes, sans shell, le texte sur
     l'entrée standard ; le locuteur retrouvé par son nom dans `<modele>.onnx.json` (le champ que la tâche 0 a lu).
     La fréquence et le rognage : ce que la tâche 0 a décidé (`readWav` ou la fréquence native, la marge).
   - `voixDe(spec, tts)` lit une entrée de `CHAINE_VOIX` ; elle refuse sa voix (le même modèle et le même locuteur que
     `CHAINE_TTS`) et une entrée inconnue.
   - Tests (synthèse injectée) : le cache par voix, celui d'Hortense gardé (la même clé, le même dossier) ; aucun
     « : » dans un dossier ; une parole posée ignorée ou jouée selon `poses` ; une toux posée coupée à sa `duree`,
     refusée plus courte ; la source de chaque son ; la lecture et les refus de `voixDe` ; le locuteur lu dans un
     `.onnx.json` écrit à la main.
   - Exclu : lancer une vraie synthèse dans `npm test` ; un générateur de toux (une toux synthétique, si elle est
     choisie, est un fichier posé).
2. - [ ] **Une ligne par partie, et le relevé des taux** (`src/presence/taux.ts`, `taux.test.ts`, `releve.ts`,
   `judge.ts`, `judge.test.ts`, `dev-luxuria`). *Parallélisable d'emblée.*
   - Le type `Resultat` du contrat ; `resultat(jouee, { suite, partie, rang, voix, poste, deroule })` : la voix et le
     rang en paramètres. `Jouee` ne change que d'un champ : `synthese` devient un texte (`releve.ts:96`).
   - La source d'une demande sans réponse sort de `releveChaine` (`releve.ts:162-177`) en une fonction exportée, que
     le relevé et `resultat` appellent : une seule règle.
   - `tenue(r)` : la seule définition de « Ce qu'est un taux ». `echoue(lignes)` : la règle d'échec tranchée, pour
     `N>1`.
   - `releveTaux(lignes)`, pure : en tête le nombre de parties, les voix, la transcription, sa synthèse, le poste, la
     durée, et pour la course la phrase de la règle de trois ; puis par scénario, par attente et par voix, tout ce que
     dit « Ce qu'est un taux ».
   - Elle reprend `delays()`, `passe`, `nomDe` et les aides de `releve.ts` (`compte`, `parCle`, `table`), exportées,
     pas recopiées.
   - `judge.ts:313-318` : à `lieu === 'chaine'`, un défaut connu est conforme sur son espèce seule ; au niveau exact,
     rien ne change.
   - Tests, sur des lignes écrites à la main : une `non_jouee` jamais tenue ; un connu qui se montre une fois sur
     trois, avec ses trois comptes ; un connu autrement raté, hors de la partie tenue ; pas de 95e centile sous vingt
     valeurs ; les échecs par espèce, par source et par voix ; la part juste et les variantes ; le fichier et
     l'extrait d'une partie ratée ; `echoue` sur chaque cas de la règle ; un relevé entier comparé ligne à ligne.
     Dans `judge.test.ts` : le même verdict, un autre `trouve`, conforme à la chaîne et pas au niveau exact.
   - Exclu : lire un fichier ; le navigateur.
3. - [ ] **Répéter à la chaîne** (`src/presence/chaine.test.ts`, `releve.ts`, `CLAUDE.md`, `.gitignore`,
   `dev-luxuria`). Après 1 et 2.
   - `CHAINE_REPETITIONS` et `CHAINE_VOIX`, lue par `voixDe`. L'ordre, comme Pipecat : le tour r joue chaque voix,
     puis chaque scénario, une fois. Un nom de test par partie (`<nom> #<k> <voix>`).
   - `partie.json` porte `<nom>#<k>` (`chaine.test.ts:423-424`) ; le témoin garde `<nom>-temoin`.
   - Les sons de chaque voix par `sonsDe(s, DIR, voix, poses)`, `poses` selon la règle tranchée (recommandé : faux
     quand `CHAINE_VOIX` est donné).
   - `synthese` de la `Jouee` : `CHAINE_TTS` sans son chemin (`piper:fr_FR-siwis-medium`), ou `fausse`
     (`chaine.test.ts:562`).
   - Après chaque partie, une ligne dans `resultats.jsonl`, vidé au départ. Les déroulés : une partie par scénario,
     les noms d'aujourd'hui ; sinon suffixés de `k`.
   - Le témoin, une fois, au premier tour. `releve-chaine.md` écrit pour les parties du premier tour, avec la source
     de chaque son dans la table des paroles (`releve.ts:189-199`).
   - Une partie par scénario : les `expect` d'aujourd'hui (`chaine.test.ts:567-568`). Sinon : aucun `expect` partie
     par partie ; une partie qui lève une erreur compte ratée (`joueur`) et la suite continue ; à la fin,
     `releve-taux.md`, la ligne de résumé, et un seul `expect` sur `echoue(lignes)`.
   - Une ligne au `CLAUDE.md` (la course et la robustesse, leur commande) et au `.gitignore` (`releve-taux.md`,
     `resultats.jsonl`).
   - Tests, sans navigateur : l'ordre des parties et des voix, les noms de partie et de fichiers, une partie par
     scénario inchangée.
   - Exclu : jouer deux parties à la fois ; reprendre une suite arrêtée ; changer le fil `main`.
4. - [ ] **Les scénarios** (`src/presence/scenarios/`, `src/presence/scenarios.test.ts`, `testeur`). Après la
   tâche 0, *en parallèle de 1 et 2*.
   - lun-luxuria#72 : `si: 'arret'` dans `arrete-net.ts:27` et `couper-le-blanc.ts:28`, et tout autre `si` qu'une
     voix gardée casse à la tâche 0, par la racine du mot, listé dans ce plan.
   - Le test sur textes seuls, dans `scenarios.test.ts`, écrit d'abord et vu rater sur « Arret. » : une table des
     transcriptions vues (le scénario, la parole, les textes : tâche 0, point 8, et les suites) ; pour chacune,
     `choisir(reponses, entendu)` vaut `choisir(reponses, dit)`. Une phrase qui joint deux paroles se teste sur leurs
     textes joints, comme le juge (`judge.ts:172-176`).
   - `hesite-puis-demande.ts`, si la tâche 0 le garde : données seules, son calcul à la trame en commentaire, `tous`
     pour ce que la chaîne doit tenir, `exact` pour les bornes à la trame. Le compte de `scenarios.test.ts:29-31`
     passe à dix-huit.
   - `toux-puis-parole` : `chevauchement-garanti` comme CrOliX le tranche (recommandé : `niveau: 'exact'`).
   - Exclu : changer une borne ; changer un mécanisme pour qu'un scénario tienne : un écart devient une issue.
5. - [ ] **Les premières suites, et le plan coché** (`testeur`). Après tout le reste.
   - [ ] Une partie par scénario, Hortense : les verdicts de la suite 2c, sauf #72 et la toux, comparés ici.
   - [ ] `N=3`, Hortense : la dérive par rang, le serveur après 39 parties, le relevé lu. Arrêt si quelque chose
     dérive.
   - [ ] La course : `CHAINE_REPETITIONS=30`, Hortense, sur secteur, veille coupée, poste au repos, écrit ici.
   - [ ] La robustesse : `CHAINE_VOIX=<les voix gardées>`, `CHAINE_REPETITIONS=2`.
   - [ ] Recopier ici, sous « Ce que l'exécution a trouvé » : les taux, les échecs par espèce, source et voix, les
     distributions, la transcription par voix, les durées.
   - [ ] Une issue par écart d'un mécanisme, et un connu qui la nomme ; jamais une borne élargie. lun-luxuria#70 et
     #72 fermées avec le relevé, si elles tiennent.
   - [ ] Relecture séparée du diff, la PR en brouillon ; la feuille de route mise à jour.
   - [ ] Les scripts et les copies de `BANC_DIR` de la tâche 0 retirés de `banc-sons`, à la fusion.

## Hors périmètre

- Corriger ce que les taux trouvent : une issue par écart. lun-luxuria#63 (elle reprend par-dessus une phrase qui
  suit une toux) est un défaut de mécanisme ; son correctif a son propre chantier.
- lun-luxuria#67 (les mutations lisent des lignes JSON) : elle reste une issue `inbox`, hors de cette étape.
- lun-luxuria#68, #69, #71 : non touchées. Le relevé des taux montrera #71 (`synthese-pendant` jamais jouée) à
  chaque partie.
- Tirer les délais au niveau exact : un plan à part, si la tâche 0 (point 7) le justifie.
- Le desktop, la fenêtre Tauri, le petit mode, l'écho, whisper-server, le vrai modèle, RVC : l'étape 5.
- Les épreuves d'hésitation au-delà de 700 ms (« tenir une pause ») : elles attendent le modèle de fin de phrase.
- Un fond de bruit sous la parole, le débit des voix, les bruits autres que la toux.
- Common Voice, et toute prise de personne au-delà des siennes : voir « À trancher ».
- Jouer deux parties à la fois ; reprendre une suite arrêtée (ses lignes restent) ; un fil par partie.
- Garder le son des deux voies d'une partie ratée : son oreille n'ajoute rien sur cet axe.

## Limites

- Les taux sont ceux du laptop : `tiny` sur son processeur, pas whisper-server sur la RX.
- Trente parties sans échec mettent l'échec sous 10 %, elles ne disent pas qu'il n'existe pas. Deux parties par voix
  ne donnent aucun taux : elles disent ce que la voix casse.
- Les voix sont propres, lues, sans accent, sans pièce ni micro : la sonde pose le son dans la page. Une hésitation
  lue par une synthèse n'est pas quelqu'un qui cherche ses mots.
- Rejouer un échec reproduit ses délais, pas son écoute ; la durée de ses phrases y est une moyenne.
- Non mesuré, estimé : 13 s par partie à la chaîne, d'après la suite 2c, sur un poste au repos ; en charge ou sur
  batterie, plus, et les délais bougent. La tâche 0 le mesure.
- Deux Piper : la version du `piper.exe` du poste est déduite de ses fichiers (`piper_phonemize.dll`,
  `libtashkeel_model.ort`), pas lue.
- Non vérifié : que WinRT atteigne Julie et Paul depuis PowerShell 5.1 ; les options de `piper.exe` ; le champ des
  locuteurs dans un `.onnx.json` à plusieurs voix ; le nombre d'hommes et de femmes parmi les lecteurs de MLS ; la
  licence de `fr_FR-mls_1840-low` ; qu'un CC0 de Freesound convienne.
- **Kokoro** : `voix/service.py:94` nomme la voix `ff_siwa`, là où sa voix française s'appelle, à ma connaissance,
  `ff_siwis`. Aucun fichier de voix de Kokoro sur le laptop pour le vérifier. À vérifier ; une issue sera ouverte
  une fois vérifié. Hors de ce plan.
- Le fil `main` sur 390 parties d'un même lancement n'a jamais été joué : `N=3` le regarde d'abord.
- Les tenues arrivent 43 à 82 ms plus tard à la chaîne qu'au niveau exact ; on ne sait pas si c'est Silero ou le
  trajet du son.
- Unmute et EVA ne sont pas relus : leur façon de compter les centiles et d'ajouter du bruit n'est pas comparée.

## Ce qui reste pour l'étape 5, le desktop

- La même commande et le même relevé des taux, avec le vrai modèle, whisper-server sur la RX et sa vraie voix
  (Piper ou Kokoro, puis RVC), dans la fenêtre Tauri : le petit mode (`aparte-parole-longue`, `phrase-ecartee`) et
  l'écho (`echo-fort`), par de vrais haut-parleurs, un vrai micro et l'annulation d'écho.
- Copier le cache des voix (`sons/<voix>/`) sur le desktop : Piper y referait des sons différents. Y vérifier Julie
  et Paul.
- `synthese` nomme sa vraie voix (Kokoro, RVC), et `poste` le desktop.
- Ce qui s'entend vraiment, au-delà de la sortie du graphe.
- Les budgets par étape de la veille (transcription sous 300 ms, première phrase sous 700 ms…) en seuils sur les
  médianes et les 95e centiles du relevé.
- La liste d'écoute retirée de la feuille de route.

## À trancher par CrOliX

**Maintenant, pour lancer le palier 1 :**

- **La tâche 0**, avec ce qu'elle télécharge hors dépôt : `fr_FR-upmc-medium` dans le dossier de Piper, et
  `fr_FR-mls-medium` seulement s'il manque des voix. Je recommande oui : `piper.exe` est déjà là, c'est un fichier, et
  rien d'autre n'est installé.
- **La toux** : je recommande la règle validée, une prise à lui ou un fichier CC0 qu'il choisit, d'au moins 450 ms,
  posé dans `banc-sons` hors git. L'autre option : une toux synthétique choisie sur Silero seul (point 4), posée de
  la même façon. Dans les deux cas, ce que `tiny` en fait est mesuré, jamais choisi.
- **Common Voice** : le cadrage (§ 3, point 4) veut « de la parole spontanée libre (Common Voice) pour les
  hésitations » ; ce plan ne la prend pas. La contrainte réelle est de ne rien mettre dans un dépôt public, pas de
  ne rien garder sur le poste. Je recommande de ne pas la prendre à cette étape : ses phrases n'ont pas d'hésitation
  datée, il faudrait les trouver et les couper à la main, et le scénario ne choisirait plus l'instant. Un plan à
  part, après la course, s'il la veut.

**Après la tâche 0, pour valider le palier 2** (chaque recommandation révisée avec ses mesures) :

- **Les voix** : je recommande Hortense pour la course ; Julie, Paul, jessica et pierre pour la robustesse ; MLS
  seulement s'il en tient moins de trois.
- **Le son posé** : je recommande qu'il soit ignoré quand `CHAINE_VOIX` est donné (chaque voix dit « Non »), et
  joué, nommé `pose:non.wav`, sinon. L'autre voie : un son posé est sa propre voix, toujours joué.
- **Ce qui fait échouer une suite répétée** : je recommande la variante du plan-challenger. `N>1` échoue sur une
  `tous` sous 100 % hors défauts connus et hors source `transcription`, une demande sans réponse de source
  `scenario`, une erreur du joueur. Les autres voies : la règle de Pipecat (toujours 0) ; échouer à 0 % seulement.
- **`chevauchement-garanti`** (`toux-puis-parole`) : je recommande `exact`. Sa borne est un calcul à la trame, comme
  celles de #70 ; à la chaîne elle devient une mesure, sa distribution au relevé. L'autre voie : garder `tous`, une
  issue et un connu ; mais rien ne dit encore que 447 à 466 ms soit un défaut de la page plutôt que le trajet du son.
- **lun-luxuria#72** : je recommande `si: 'arret'`, avec le test sur textes seuls. Le faux modèle comprend ce qu'un
  vrai comprendrait ; ce que `tiny` coûte se lit dans la part juste de chaque phrase.
- **lun-luxuria#70** : je recommande de garder ces attentes en mesures, avec leur distribution, sans attente `tous`
  plus large.
- **Le nombre de parties** : je recommande trente par scénario pour la course, deux par voix pour la robustesse, et
  `N=3` avant la course.
- **`hesite-puis-demande`** : je recommande de l'écrire si les voix disent « euh » comme une voix.

## Ce que le plan-challenger a changé

Chaque preuve a été relue dans le code avant d'être reprise.

1. **Les toux à la chaîne** : ce que chaque attente `tous` donnera, chiffré ; un connu reconnu à la chaîne par son
   espèce seule (tâche 2) ; `chevauchement-garanti` à trancher ; une seule définition de la partie tenue, connus
   exclus quel que soit leur état. Rectifié : les cinq suites donnent des tenues de 427 à 466 ms, pas 414 à 481 ; la
   conclusion tient.
2. **Le son posé** : il passait devant toutes les voix ; sa règle est à trancher, la source de chaque son est à la
   ligne et au relevé dès les tâches 1 et 3. Le critère « aucune voix tirée d'un enregistrement » et l'item « ses
   prises » de l'étape 5 sont corrigés : `non.wav` sert déjà.
3. **Les tirages au niveau exact sont retirés** (l'ancienne tâche 7, son critère, `TIRAGES_N`, `TIRAGE`, `'tire'`,
   `graine`). À la place : rejouer un échec par ses délais mesurés, dans une copie jouée au niveau exact, sans code.
4. **La course et la robustesse séparées** : Hortense sur trente parties ; chaque voix sur deux parties, ses échecs
   par source. La règle de trois ne vaut que pour la course.
5. **La toux** : la règle validée (sa prise ou un CC0) redevient l'option principale ; une synthétique se choisit sur
   Silero seul, à plusieurs décalages dans la trame ; ce que `tiny` en fait reste une mesure.
6. **Common Voice** : l'écart au cadrage est nommé, à trancher ; un critère sur l'hésitation dite par chaque voix.
7. **Le rééchantillonnage et le rognage** mesurés à la tâche 0 (fréquence native contre `readWav`, sans marge contre
   100 ms). Rejeté : AIRI ne rééchantillonne pas en sinc. Son script passe par un rééchantillonnage linéaire sans
   filtre, et un TODO dit que ses fixtures passent avec lui comme avec un sinc. Sa marge de 100 ms est juste.
8. **La règle d'échec à `N>1`** : la variante du plan-challenger est recommandée ; celle de Pipecat devient l'autre
   voie.
9. **Le garde-fou de #72** : un test sur textes seuls remplace la comparaison des déroulés exacts, qui ne montrait
   rien.
10. **La tâche 0** : `tiny` une fois par morceau ; les délais dans l'ordre des lancements ; le poste noté ; le point 6
    sans code, par une copie de `BANC_DIR` remplie sous la clé d'Hortense ; `N=3` avant la course. Rejeté : `BANC_DIR`
    n'est pas une constante, `chaine.test.ts:294` le lit dans l'environnement ; c'est ce qui rend le point 6 possible
    sans code.
11. **Les fichiers** : chaque fichier n'a qu'une tâche à la fois ; `releve.ts` est dans la liste de la tâche 2 ;
    `resultat()` prend la voix et le rang en paramètres.
12. **Pour l'étape 5** : `synthese` et `poste` en texte ; `piper.exe` à côté du modèle de `CHAINE_VOIX` ; le cache
    des voix à copier ; Julie et Paul à vérifier là-bas ; le dossier d'une voix par `nomDe` ; `ff_siwa` aux limites.
    Repris en partie : le relevé donne le nom du poste et son processeur ; le secteur et la veille, que le code ne
    lit pas, sont écrits dans ce plan.
13. **Les mineurs** : un nom par partie, `<nom>#<k>` ; `releve-chaine.md` écrit pour le premier tour ; le critère
    « mêmes fichiers, plus `resultats.jsonl` » ; #67 sortie de l'étape (ancienne tâche 6) ; le critère sur les voix
    réécrit (aucun son ni modèle dans un dépôt, la voix nommée au relevé). Nuance : un nom par partie aide le journal,
    mais une ligne tardive du serveur peut encore porter le nom de la partie suivante ; la longueur gardée du journal
    (`chaine.test.ts:426-427`) les sépare déjà par position.

**Trouvé en reprenant les objections** : un `toux.wav` posé n'est jamais coupé à sa `duree` et sert les trois toux
sous le même nom (`sons.ts:111-114`, `nomDe`) ; la tâche 1 le coupe, comme un bruit.
