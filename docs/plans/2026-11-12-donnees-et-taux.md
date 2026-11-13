# Les données et les taux : plusieurs voix, des hésitations, une toux, chaque scénario répété. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Relu par le plan-challenger (« à amender », treize objections reprises, voir la fin). Palier 1 validé par
> CrOliX le 12/11 (« je valide »)**, avec ses recommandations : la tâche 0 et le seul téléchargement de
> `fr_FR-upmc-medium` hors dépôt ; sans prise ni fichier CC0 de sa part, la toux synthétique est choisie sur Silero
> seul ; Common Voice n'est pas pris à cette étape.
>
> **Palier 1 fait le 12/11** : la tâche 0 a été jouée par le `testeur`, ses mesures sont écrites sous « Ce que la
> tâche 0 a mesuré ». La toux synthétique n'a pas tenu son critère : la toux revient à CrOliX (« À trancher »).
> **Palier 2 révisé d'après les mesures, validé par CrOliX le 12/11** (« je valide avec tes recommandations ») :
> les treize points de « À trancher » tels que recommandés, la toux par sa prise (a).
>
> **Palier 2 codé et fusionné le 12/11** : les tâches 1 à 5, lun-luxuria#76 ; la course et la robustesse jouées,
> une partie ratée sur 300 dans la course. La tâche 6 attend les prises de CrOliX. Voir « Ce que l'exécution a
> trouvé ».
>
> **Deux paliers.** **Palier 1 : la tâche 0 seule**, jetable, qui a mesuré ce que la suite suppose : les voix qu'on
> peut atteindre, ce qu'elles font de nos phrases, la toux, la variance de la chaîne sur dix lancements, le coût d'une
> partie exacte. **Palier 2 : les tâches 1 à 6.** La tâche 6, la toux, part dès que CrOliX l'a tranchée, et
> aucune autre ne l'attend.
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
  Piper, hors dépôt. Fait le 12/11, hors dépôt, mais le modèle est resté dans `essai-taux/voix-upmc/` : la tâche 5
  le déplace dans le dossier de Piper avant tout retrait.

**Critères de fin du palier 2 :**

- `CHAINE_REPETITIONS=N CHAINE_VOIX=… npm run chaine` joue chaque scénario jouable N fois par voix, tour par tour.
  Sans ces variables, la suite joue comme aujourd'hui : une partie par scénario, Hortense, les mêmes fichiers, plus
  `resultats.jsonl`.
- Chaque partie écrit une ligne dans `resultats.jsonl` dès qu'elle finit, et porte le nom `<nom>#<k>` dans
  `partie.json`. Une suite répétée écrit `releve-taux.md` (tout ce que dit « Ce qu'est un taux ») et, pour les parties
  du premier tour, `releve-chaine.md` comme aujourd'hui.
- La course : trente parties par scénario avec Hortense, relevées. La robustesse : Julie, Paul, jessica et pierre,
  deux parties par scénario chacune, relevées. Le relevé dit en tête que ses taux sont ceux de `tiny` sur le laptop.
- Le relevé nomme la voix et le modèle de chaque son ; un son posé y est une prise (`pose:<fichier>`). Aucun son ni
  modèle de voix n'est suivi par git (la CI le vérifie pour les sons).
- Une parole perdue avant le faux modèle (un bruit pour l'écoute, une transcription vide ou qui choisit une autre
  réponse que son `dit`) est la source des échecs qui la suivent, et non le maillon où ils se montrent (tâche 2).
- `hesite-puis-demande` dit « euh » au milieu d'une demande avec chaque voix gardée ; ses attentes portent sur le
  mécanisme, jamais sur le mot transcrit (tâche 0, point 3).
- Les quatre scénarios de toux sont joués avec la toux que CrOliX a tranchée (tâche 6) ; sans toux, ils restent au
  niveau exact, le relevé dit « son manquant », et ce plan dit pourquoi. Ce que `tiny` fait de la toux est au relevé.
- lun-luxuria#72 : `couper-le-blanc` tient quand `tiny` entend « Arret. », et un test sur textes seuls montre que
  chaque transcription vue choisit la même réponse que son `dit`, sauf « Allez ! », un échec attendu de source
  `transcription`. lun-luxuria#70 : ses attentes restent des mesures, avec leur distribution. Aucune borne n'est
  élargie.
- `npm test` ne change pas de durée de plus de cinq secondes : la chaîne n'y tourne pas.

| Dépôt, branche | Issue | PR | Niveau |
|---|---|---|---|
| `lun-luxuria`, `feat/donnees-et-taux` | à ouvrir avec le palier 2 ; lun-luxuria#70, #72 | à ouvrir | `standard` |
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
  sont rognés à un niveau fixe de 0,01, sans marge (`sons.ts:28`, `:62-78`). Le cache garde le son brut de la
  synthèse, rogné à chaque lecture (`sons.ts:104-108`).
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
- **Le juge ne voit pas une parole perdue avant le faux modèle.** `divergence()` ne lit que les appels au faux
  modèle (`judge.ts:164-177`). Deux façons de perdre une parole n'en font aucun. L'écoute la juge bruit quand elle a
  moins de 250 ms de voix (`minSpeechMs`, `endpoint.ts:128-134`, `settings.ts:96`) : la page écrit `bruit`
  (`conversation.ts:50-57`), sans essai ni transcription. Ou bien la transcription revient vide, ou sans lettre :
  le filtre la juge bruit (`filter.ts:33-36`), la page écrit `transcrite` sans texte et `verdict` `bruit`
  (`conversation.ts:359-367`). Dans les deux cas, chaque échec qui suit nomme son propre maillon : `voix` pour
  `non-court/pour-de-bon` ; `serveur` pour une attente non jouée faute de réponse (`ouvreur`, `judge.ts:206-207`).
  Le relevé montre une case `entendu` vide dans les deux cas (`releve.ts:197`).
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
fichier d'Hortense rend le même texte cinq fois sur cinq (`chaine-laptop.md:206-207`). Ce qui varie d'une partie à
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
  la tâche 0 a mesuré ce que les deux changent à `tiny` (point 3) : la marge, beaucoup ; le sinc, rien.
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

0. - [x] **Ce que la suite suppose, mesuré** (`testeur`, des scripts jetables dans `banc-sons/chaine/essai-taux/`,
   hors git ; rien dans un dépôt). Seule. Faite le 12/11 : voir « Ce que la tâche 0 a mesuré ».
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
      fois** par morceau : cinq fois n'a rien montré sur Hortense (`chaine-laptop.md:206-207`). Pour chacun : le
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

## Ce que la tâche 0 a mesuré

Jouée le 12/11 par le `testeur`. Le poste : i7-1165G7, sur secteur (100 %), veille jamais sur secteur, au repos,
plan « Utilisation normale ». Aucun dépôt touché ; les worktrees d'essai retirés. Les fichiers bruts, hors git, dans
`banc-sons/chaine/essai-taux/` : `runs/` (un dossier par lancement, `var-1` à `var-10`, `verb-1`, `v-<voix>-1`,
`toux450-*`, `toux300-*`, chacun avec son relevé, ses déroulés et ses journaux), `analyse-var.txt` (les dix
lancements, attente par attente et délai par délai, dans leur ordre), `resume-voix.txt` (chaque voix sur nos
phrases), `point7-sortie.txt`, `scripts/` (dont `winrt.ps1`), `toux/`, `voix-upmc/` et les copies de `BANC_DIR`.

1. **Julie et Paul, par WinRT** depuis PowerShell 5.1 : marche (`scripts/winrt.ps1`, le texte sur l'entrée
   standard). Un WAV PCM 16 bits mono à 16 000 Hz natif, que `readWav` lit (son `fmt` a 18 octets). 475 à 725 ms par
   phrase de 37 caractères, processus compris. **Tient.**
2. **Piper pour la personne** : `piper.exe` du poste (en C++) prend `-m` (le modèle), `-s` (le numéro du locuteur),
   `-f` (le fichier de sortie), `-q`, et le texte sur l'entrée standard. Le champ des locuteurs du `.onnx.json` est
   `speaker_id_map`, `{ jessica: 0, pierre: 1 }`. Sortie à 22 050 Hz. Environ 540 ms par appel (le modèle est
   rechargé à chaque fois), 2 547 ms à froid. `fr_FR-upmc-medium` pèse 76,7 Mo, CC BY-SA 4.0 ; il a été posé dans
   `essai-taux/voix-upmc/`, pas dans le dossier de Piper : à déplacer avant le retrait d'`essai-taux` (tâche 5).
   MLS n'a pas été pris. **Tient** ; `piper.exe` n'est pas à côté du modèle, son chemin se donne (« Les variables »).
3. **Chaque voix sur nos phrases**, `tiny` une fois par morceau : les treize paroles des scénarios jouables, leurs
   quatorze morceaux, « euh », « ben », « hum », et « Tu peux me lire, euh, la liste des courses ».
   - Paroles justes sur treize, sans marge puis avec 100 ms de marge : Hortense 7 → 10 ; Julie 9 → 11 ; Paul 8 → 10 ;
     jessica 4 → 6 ; pierre 4 → 5. Sans marge, le début est mangé (« Tu peux me lire » rendu « Je suis pas me
     lire. »). Un rééchantillonnage en sinc contre le linéaire de `readWav` : rien (jessica et pierre, les seules à
     22 050 Hz, 4 sur 13 dans les deux cas). **Change** : la marge (tâche 1) ; le linéaire reste.
   - Silero (`replay()`, réglages par défaut, sans marge) : tenue à 384 ms le plus souvent, 416 à 448 quand la
     première trame de voix arrive à 32 ou 64 ms ; parfois 864 chez Hortense ; 800 à 1 024 chez jessica et pierre
     sur les phrases longues.
   - La durée réelle dépasse toujours `duree` : 1 635 contre 1 280 ms, 2 597 contre 1 600, 1 800 contre 1 600.
   - « euh » seul : « eux », « 2 », « D'accord. », « Euh... » ou rien, selon la voix et la marge ; seul, il dure 138 à
     164 ms chez Hortense, Julie et Paul, un bruit pour l'écoute. Dans « Tu peux me lire, euh, la liste des
     courses » (160 ms de silence avant « euh », 400 après) : une seule phrase pour Silero chez Hortense, Julie, Paul
     et pierre, « euh » repris comme voix ; **deux phrases chez jessica**, dont le « euh » n'est pas de la voix.
     `tiny` y entend « eux » (Julie, Paul, Hortense avec marge), « Euh... » (pierre), rien (jessica). **Change** :
     l'attente porte sur le mécanisme, pas sur le mot.
4. **La toux synthétique : tombe.** Des souffles filtrés, voisés ou non : Silero au plus 0,04 à 0,27, aucune tenue.
   Une voyelle /e/ à 210 Hz : tenue à 450 ms à un à trois décalages sur quatre, jamais aux quatre ; jamais à 300 ms.
   450 ms font quatorze trames et la tenue en demande douze : aucune marge. Le critère n'est pas atteint après trois
   grilles. La toux d'essai, non retenue : `toux/toux-450.wav`, `toux/toux-300.wav`, `scripts/genere-toux.mjs`.
   `tiny` en fait « C'est ça ? », « ... », « C'est... », « C'est ça ! » ; aucun « Merci. ».
5. **La variance de la chaîne** : dix lancements d'Hortense, `tiny`, un par un, puis un onzième bavard (`verb-1`).
   - La suite dure 136 à 146 s, mise en route d'environ 10 s comprise. Aucune dérive nette d'un lancement à l'autre.
   - Une partie, en ms : `faire-taire` 3 983 à 4 140 ; `delai-de-reponse` 6 189 à 6 440 ; `phrase-attente` 6 490 à
     6 720 ; `delai-a-l-essai` 6 301 à 6 790 ; `couper-le-blanc` 5 692 à 7 391 ; `non-court` 7 261 à 7 790 ;
     `oui-puis-reparler` 8 305 à 8 492 ; `deux-phrases` 11 466 à 12 081 ; `arrete-net` 6 131 à 13 531, en deux
     groupes : 13 s les six fois où « Arret » a choisi la longue réponse, 6,4 s les quatre autres.
   - **Chaque attente `tous` est tenue dix fois sur dix.** `couper-le-blanc` échoue cinq lancements sur onze par une
     demande sans réponse (« Arret. » ou « Arret ? », lun-luxuria#72). Le onzième rate aussi `non-court` : la prise
     « non » y est perdue par l'écoute, moins de 250 ms de voix, et le juge nomme `voix` (point 6).
   - Délais, du plus petit au plus grand : transcription 343 à 665 ms (le plan de la chaîne lisait 353 à 371) ;
     premier mot 403 à 427 (hors la réponse de `deux-phrases` qui attend 4 s) ; synthèse de Piper 105 à 297 ms pour
     27 caractères, 214 à 343 pour 55 ; durée de ses phrases non coupées 50 à 107 ms par caractère, surtout 55 à
     78 ; silence de tête 58 à 199 ms.
   - Les attentes `exact` ratées le sont à des valeurs stables : `son-arrete` 442 à 465 (`arrete-net`, contre
     [384, 416]) et 762 à 790 (`non-court`, contre [692, 724]) ; `blanc-de-tour` de `delai-a-l-essai` 1 162 à 1 353
     contre [860, 892] ; `retenue` de `oui-puis-reparler` 427 à 454 contre [384, 416] ; `suspendue-a-la-tenue` de
     `couper-le-blanc` 438 à 469.
   - La prise « non » de CrOliX (`sons/non.wav`) n'est jouée que par `non-court` : « Non. » sept fois, « Non ! »
     trois fois, perdue une fois sur onze.
6. **Un passage par voix**, sans code, la toux d'essai posée : Julie 274 s, Paul 194 s, jessica 283 s, pierre 275 s,
   cache vide compris.
   - Parties en échec, hors toux : Julie `couper-le-blanc` (« Arret. ») et `oui-puis-reparler` ; Paul `arrete-net` ;
     jessica `arrete-net`, `couper-le-blanc` (« Allez ! »), `non-court`, `oui-puis-reparler` ; pierre `non-court`,
     `oui-puis-reparler`.
   - **Le juge se trompe de source sur une parole perdue.** Le « Oui » de Julie (`runs/v-julie-1`), le « Non » et le
     « Oui » de jessica : l'écoute écrit `bruit`, sans essai ni transcription ; les trois attentes `tous` de
     `oui-puis-reparler`, non jouées, sont nommées `serveur`. Le « Non » et le « Oui » de pierre : la transcription
     revient sans lettre (`verdict` `bruit`) ; `pour-de-bon` est nommée `voix`, les non jouées `serveur`. Il en va de
     même de la prise « non » perdue de `verb-1`. **Change** : la tâche 2.
   - Paul, `arrete-net` : « Arrête » entendu juste, trop court pour une tenue ; elle ne coupe qu'à la fin de la phrase
     et `pour-de-bon` rate (`en_trop`, source `voix`). C'est ce qu'une voix casse, pas une course.
   - La toux d'essai de 450 ms sur Hortense, trois passages (`runs/toux450-*`) : Silero la tient chaque fois
     (`suspendue` à 440 à 444 ms). `chevauchement-garanti` vaut 486, 499 et 532 contre [0, 432] ;
     `chevauchement-nul` la même valeur (connu lun-luxuria#63). `tiny` en fait « et », rien ou « C'est ça ? », une
     fois « D'accord. ». `verdict-bruit` rate environ deux parties sur trois (source `filtre`). `toux-courte` avec la
     toux de 300 ms (`runs/toux300-*`) : un échec sur trois, `verdict-bruit`.
   - Dans les copies de voix, `toux-courte` jouait la toux de 450 ms au lieu de 300 : un son posé n'est pas coupé à
     sa `duree` (`sons.ts:111-114`). **Change** : la tâche 1.
7. **Le coût d'une partie exacte** : `scenarios.test.ts` en 1,09 à 2,11 s. Trois scénarios rejoués aux bords du
   point 5 (`point7-sortie.txt`) : `delai-a-l-essai` et `deux-phrases` tiennent toutes leurs attentes `tous`, les
   `exact` bougent ; `couper-le-blanc` rate `coupee` et `coupure-recue` au bord haut (107 ms par caractère), par
   construction. Les durées réelles seules déplacent déjà les instants : `coupee` de 5 152 à 5 472 ms,
   `essai-confirme` de 2 592 à 2 816. **Les tirages tombent** ; rejouer un échec demande ses durées réelles.
8. **Ce qu'on a entendu**, à la chaîne (onze lancements d'Hortense, un par autre voix) et hors chaîne (point 3). Le
   compte est à la chaîne ; « perdu » : ni texte, ni demande au faux modèle.
   - « Arrête » : « Arrête ? » 10, « Arret. » 7, « Arret ? » 6, « Arrête. » 4, « Arrête ! » 1, « Allez ! » 2
     (jessica, les deux fois). Hors chaîne, pierre : « Allez. ». Jamais « Arrête. » chez Hortense.
   - « Non » : « Non. » 9, « Non ! » 3, perdu 3 (la prise une fois, jessica, pierre). Hors chaîne : « vous »
     (jessica), « bon », « Hmm... » (pierre).
   - « Oui » : « Oui ? » 6, « Oui? » 4, « Oui. » 1, « Louis. » 1 (Paul), perdu 3 (Julie, jessica, pierre). Hors
     chaîne : « de suite. » (Paul), « C'est ça ? » (jessica), « ... », « Bon. », « 2 » (pierre).
   - « J'ai des mails ? » : « J'ai dit mec. » 7, « J'ai dit mai. » 2, puis une fois chacune « J'ai des mails. »,
     « J'ai des mains. », « J'ai des mecs. », « J'ai des milles. », « J'ai démètes. », « J'ai démilsé. ».
   - « Raconte-moi la journée de demain » : « Recondement à la journée de demain. » le plus souvent ; aussi
     « Reconte-moi… », « Racconte-moi… », « Raccontons à… », « Reconté moi… », « Recondo-moi… », « Raccont moi… ».
   - « Tu peux me lire la liste des courses » : juste le plus souvent ; aussi « Tu peux me dire… », « Tu peux nous
     lire… ». « Tu peux me rappeler le film de ce soir » : juste le plus souvent ; aussi « Tu peux nous
     rappeler… », « Suppe me rappelée le film de ce soir. ». Les autres paroles : justes, à la ponctuation près.
   - Le détail, texte entier et compte : les tables des paroles de `runs/*/releve-chaine.md`, et `resume-voix.txt`.

**Installé**, hors dépôt : `fr_FR-upmc-medium` (point 2) ; l'environnement du service, refait en moins de 100 s
(`uv-cache`, 315 Mo).

**Non mesuré** : une toux qui tienne le critère ; un sinc d'un outil externe ; `entrePhrasesMs`, laissé à 300 ; le
point 7 au-delà de trois scénarios ; la variance par voix, un seul passage chacune ; si le retard des tenues à la
chaîne tient à Silero ou au trajet du son ; la marge de 100 ms dans Silero et dans une suite à la chaîne (le point 3
la mesure sur `tiny` seul) ; `fr_FR-mls-medium` ; une seconde voix de contrôle pour #72. **Les taux sont ceux de
`tiny` sur le laptop, pas de whisper-server.**

## Palier 2 : les choix **[avis]**

Révisés avec les mesures de la tâche 0, à valider par CrOliX.

### Les voix de la personne

**Hortense pour la course ; pour la robustesse, Julie, Paul, jessica et pierre, jamais sa voix.** Mesuré : les
cinq voix sont atteintes (tâche 0, points 1 à 3).

- **Hortense** est déjà là et en cache : la course rejoue les mêmes sons, seule la chaîne varie.
- **Julie et Paul**, par WinRT (`Windows.Media.SpeechSynthesis`) : une femme et un homme de plus, sans rien à
  télécharger, à 16 kHz natif. Le script du testeur, `essai-taux/scripts/winrt.ps1`, est la référence de ce qu'il
  faut écrire (tâche 1).
- **jessica et pierre** (`fr_FR-upmc-medium`), par `piper.exe` : un seul fichier, deux voix, une femme et un homme.
  Le locuteur se choisit par `-s`, son numéro lu dans `speaker_id_map` du `.onnx.json`. Elles cassent les mots
  courts (« Non », « Oui », « Arrête ») : c'est ce que la robustesse doit montrer.
- **Exclues** : siwis, sa voix dans la chaîne (le cadrage veut des voix « différentes de la sienne ») ; Kokoro, dont
  la seule voix française vient, à ma connaissance, du même corpus SIWIS (non vérifié ici) ; espeak-ng, robotique,
  et sans exécutable sur le poste ; `fr_FR-tom-medium`, une voix de plus sous AGPLv3, inutile avec upmc. **MLS est
  retiré** : quatre voix tiennent sans lui. `fr_FR-gilles-low` (CC0) reste en réserve : sa qualité est la plus basse.
- **Une voix que `tiny` transcrit mal** reste mesurée : sa part juste au relevé, ses échecs par source. Ce qu'une
  voix casse ne fait pas échouer la suite si CrOliX tranche ainsi la robustesse (« Ce qui fait échouer »).
- **Le son posé** : ignoré quand `CHAINE_VOIX` est donné, pour que chaque voix dise tout, le « Non » court compris ;
  sans `CHAINE_VOIX`, sa prise joue, nommée `pose:non.wav` à la ligne et au relevé. Une toux posée sert toujours,
  aucune voix ne dit une toux ; elle est coupée à sa `duree` (tâche 1), là où `toux-courte` jouait 450 ms au lieu
  de 300. La source de chaque son est dans `phrases[].son` et au relevé. Mesuré : tient.
- **Le rognage, avec 100 ms de marge** de chaque côté de chaque morceau, comme AIRI : trois paroles justes de plus
  sur treize chez Hortense, deux chez Julie, Paul et jessica, une chez pierre ; le seul levier net. Le cache garde
  le son brut et le rognage se fait à la lecture (`sons.ts:104-108`) : la marge vaut aussi pour les sons déjà en
  cache, sans changer la clé. Si une tâche rognait avant d'écrire le cache, la clé devrait porter la marge, sinon les
  anciens sons resteraient. Ce que la marge coûte : un `trou` s'allonge des deux marges, jusqu'à 200 ms ; la durée
  réelle de chaque son est au relevé.
- **Le rééchantillonnage reste linéaire** (`readWav`) : un sinc n'a rien changé (tâche 0, point 3).
- **Ce qui ne change pas** : le texte sur l'entrée standard, jamais dans la ligne de commande (`sons.ts:235-238`) ;
  chaque son de synthèse en cache, dans `banc-sons`, par voix ; Piper et ses modèles hors du dépôt. Les voix de
  Windows sont sous la licence de Windows, pour un usage personnel ; leurs sons ne quittent pas le poste.
- **Deux Piper** : sa voix passe par le paquet Python du service (`voix/service.py:80-86`), celle de la personne par
  `piper.exe` du poste. Un même modèle peut sonner autrement dans chacun ; la personne ne passe jamais par le
  service. Le chemin de `piper.exe` se donne dans `CHAINE_VOIX`, il ne se déduit pas de `CHAINE_TTS`.

### Les hésitations

**Écrites dans le scénario, dites par chaque voix.** Le format les porte déjà : un mot dans `dit`, un silence dans
`trous`, à l'instant que le scénario choisit. Rien à coder. Mesuré (tâche 0, point 3) : seul, « euh » est un bruit
pour l'écoute chez trois voix ; au milieu d'une phrase, il est repris comme voix chez quatre voix sur cinq.
`tiny` n'en rend jamais deux fois le même texte : « eux », « Euh... », rien.

**Un scénario de plus, `hesite-puis-demande`**, dont l'attente porte sur le mécanisme, jamais sur le mot :
« Tu peux me lire, euh, la liste des courses », 160 ms de silence avant « euh », 400 après, entre la pause de
l'essai (160 ms) et le silence de fin (700 ms). Avec les deux marges du rognage, 400 ms écrits en font au plus 600 :
encore sous la fin. Il attend, en `tous` :

- **une seule demande** : la page n'écrit qu'une fin de phrase pour toute la parole, sans `bruit` ; un seul envoi
  reste au serveur, chaque essai retiré ayant son retrait ;
- **l'essai de la première pause retiré** quand la voix revient, sur « euh » ou après lui ;
- **une seule réponse qui sonne**, rien de l'essai retiré.

Le numéro de l'essai confirmé n'est pas une attente : il dépend du nombre de pauses que Silero voit, trois chez
Hortense, Julie et Paul, deux chez pierre. Son apport sur `delai-a-l-essai` : l'hésitation est un mot, et la phrase
tient malgré lui. Mesuré : jessica coupera la phrase en deux (son « euh » n'est pas de la voix), un échec de la
robustesse écrit tel quel.

Les 122 phrases de `banc-sons/pipecat-fra` ne servent pas ici : leur texte manque, et leurs hésitations visent
l'épreuve « tenir une pause » du banc français, qui attend le modèle de fin de phrase, sur une branche non fusionnée
(`feat/fin-de-phrase`). La longueur de leurs pauses n'a pas été mesurée. Common Voice, que le cadrage nomme pour les
hésitations, est un écart tranché par CrOliX le 12/11 : pas à cette étape.

### La toux

**La toux synthétique n'est pas retenue** : aucune n'a tenu le critère de Silero (tâche 0, point 4). **La règle
validée redevient la seule** : la toux est enregistrée par CrOliX, ou un fichier sous licence CC0 seulement
(`chaine-laptop.md:249-251`). Son choix est à trancher (voir la fin) : sa prise, recommandée ; un fichier CC0
téléchargé hors dépôt ; ou pas de toux à cette étape, les quatre scénarios restant au niveau exact.

**Le palier 2 n'attend pas la toux.** La tâche 6 la pose et joue les quatre scénarios quand elle est là ; aucune
autre tâche ne l'attend. Sans elle, le relevé dit « son manquant », comme aujourd'hui.

Ce que `tiny` en fait n'est jamais un critère : le plan de la chaîne veut le trouver (« un « Merci. » inventé est un
défaut à trouver ici », `chaine-laptop.md:279-280`). Choisir une toux que `tiny` rend vide le cacherait. Sur la toux
d'essai, il a rendu « et », rien, « C'est ça ? », une fois « D'accord. ».

Deux toux, rangées dans `banc-sons` hors de tout dépôt : `toux.wav`, une toux ordinaire d'au moins 450 ms, que
`toux-parole`, `toux-reflexion` et `bruit.wav` (le `bruits` de `toux-puis-parole.ts:25`) reprennent ; et
`toux-courte.wav`, d'au moins 300 ms, pour `toux-courte`, dont le `dit` devient `(toux courte)` (tâche 4). Chacune
est coupée à sa `duree` (tâche 1). Un seul fichier CC0 sert sous les deux noms. Aucun autre bruit (clic, porte, fond
sonore) : aucun scénario n'en demande.

**Ce que chaque toux donnera à la chaîne**, d'après les tenues des cinq suites et la toux d'essai (tâche 0,
point 6) :

| Scénario | Attentes `tous` | À la chaîne |
|---|---|---|
| `toux-parole` | `verdict-bruit`, `arrete`, `reprise`, `redite-dans-le-deroule`, `redite` | aucune bornée |
| `toux-courte` | `verdict-bruit` | `tiny` doit rendre vide 300 ms de toux |
| `toux-reflexion` | `verdict-bruit`, `relachee`, `elle-repond`, `pas-de-coupure` | aucune bornée |
| `toux-puis-parole` | `verdict-bruit`, `reprise`, `chevauchement-nul` | voir dessous |

- **Les attentes sans borne** demandent que Silero tienne la toux de 450 ms et que `tiny` rende la toux vide. Leurs
  attentes `exact` (`suspendue`, `blanc`, `retenue`, `relachee-a-la-fin`, les trois de `toux-courte`) restent des
  mesures.
- **`verdict-bruit`**, dans les quatre : si `tiny` invente un mot, elle rate. Sur la toux d'essai, deux parties sur
  trois. C'est le défaut que le plan de la chaîne veut trouver : une issue, et un connu qui la nomme.
- **`chevauchement-garanti`** (`[0, 432]`, « 400 + 32 », `toux-puis-parole.ts:69-76`) mesure le temps où elle parle
  par-dessus la parole 1. Mesuré : 486, 499 et 532 ms sur trois passages, raté chaque fois. Sa borne est le calcul à
  la trame (`toux-puis-parole.ts:13-15`), comme celles de lun-luxuria#70 : elle passe en `exact` (tâche 4), une
  mesure à la chaîne, sa distribution au relevé. Ce n'est pas une borne élargie : la borne reste, au niveau exact.
- **`chevauchement-nul`** (`[0, 0]`, connu lun-luxuria#63, `trouve: 384`) : à la chaîne, `trouve` vaut la même chose
  que `chevauchement-garanti`, et `judge.ts:317` ne le dira jamais conforme ; le défaut connu ferait échouer la
  partie. La tâche 2 le reconnaît, à la chaîne, par son espèce seule.
- **Le risque levé en partie** : les tenues à la chaîne arrivent 43 à 82 ms plus tard qu'au niveau exact, et la
  toux d'essai de 450 ms a pourtant été tenue trois fois sur trois (`suspendue` à 440 à 444 ms). Ce n'était pas une
  vraie toux : la tâche 6 le revoit sur celle de CrOliX.

### Où répéter : la chaîne seule

**La chaîne**, parce que c'est là que les choses varient : la transcription, Piper, Silero, le processeur. Elle a
deux défauts : elle est lente (4 à 13,5 s par partie, voir plus bas), et un échec ne s'y rejoue pas, le prochain
tirage de `tiny` ou de Piper sera autre.

**Pas de tirages au niveau exact.** Le cadrage veut ce niveau déterministe, dans la CI, en secondes (§ 4, point 3).
Tirer les délais des briques fausses ne toucherait ni `duree` ni l'écoute, là où la chaîne varie, et casserait des
ancres posées à la ms près : dans `couper-le-blanc`, « Arrête » tombe 1444 ms après le début d'une phrase de
24 × 60 = 1440 ms (`couper-le-blanc.ts:7-10`, `:23-24`) ; un `msParCaractere` au-dessus de 60,2 fait rater `coupee`
par construction. Mesuré (tâche 0, point 7) : aux bords des délais de la chaîne, `delai-a-l-essai` et `deux-phrases`
tiennent leurs attentes `tous`, `couper-le-blanc` rate au bord haut par construction. Aucun plan à part.

### Rejouer un échec au bit près, sans tirage

Une façon de faire, écrite ici, pas codée. On part de la ligne de la partie ratée (`delais`, `phrases`) et de son
déroulé :

1. Copier le scénario dans `src/presence/scenarios/<nom>-rejeu.ts`, son `nom` changé, jamais commité.
2. Y reposer ce que la partie a mesuré, **les délais et les durées réelles** : `transcriptionMs` de chaque parole ;
   `premierMotMs` et `entrePhrasesMs` de chaque réponse ; `voix.syntheseMs` ; `voix.msParCaractere`, la durée réelle
   de ses phrases sur leurs caractères (une moyenne, un seul nombre pour toutes, lue de `joue` à `arrete` dans le
   déroulé) ; la `duree` de chaque parole, la longueur réelle de son son (`phrases[].dureeMs`). Les durées réelles
   dépassent toujours `duree`, et elles seules déplacent déjà les instants (tâche 0, point 7) : une copie sans elles
   ne rejoue pas la partie.
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
- **Avant la longue suite**, `N=3` avec Hortense (30 parties sans la toux, environ 7 min) : la dérive des délais par
  rang, le serveur après 30 parties sur le même fil `main`, le relevé lu. La course ne part que si rien ne dérive.
- **Le temps sur le laptop**, mesuré (tâche 0, point 5) : la suite d'Hortense dure 136 à 146 s, environ 140 s,
  mise en route d'environ 10 s comprise, sans dérive sur dix lancements. Une partie dure 4 à 13,5 s selon le
  scénario. **La course** : trente fois la suite, les neuf scénarios et `hesite-puis-demande`, 300 parties,
  **environ 70 min** dans un seul processus ; un peu moins une fois #72 corrigé (`arrete-net` passe de 13 à 6,4 s,
  six parties sur dix). Les quatre toux l'allongent quand elles sont posées (tâche 6). **La robustesse** : un
  passage par voix a duré 194 à 283 s, cache vide compris ; deux par voix, quatre voix, environ 30 à 40 min (estimé).
- **Le poste** : la longue suite sur secteur, veille coupée, poste au repos, écrit ici avec le relevé ; le relevé
  donne le nom du poste et son processeur. La tâche 0 a tourné ainsi : i7-1165G7, sur secteur, veille jamais.
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
  réponse avec sa source (`releve.ts:162-177`) ; une parole perdue avant le faux modèle avec la sienne (tâche 2).
- **Ce que valent ces taux** : ceux de `tiny` sur le processeur du laptop, pas de whisper-server sur la RX. Le relevé
  le dit en tête, avec le poste.
- **Le déroulé de chaque échec** : le relevé liste les parties ratées avec leur nom, leur voix, l'attente, l'espèce,
  la source, la valeur, le fichier et l'extrait du verdict.

### Ce qui fait échouer une suite répétée

**`N=1` ne change pas** : une attente `tous` ratée ou une demande inattendue fait échouer la suite.

**`N>1`, la course : la variante du plan-challenger** (recommandée, mesurée). Chaque partie est jouée, sans `expect`
partie par partie ; une erreur hors du juge compte la partie ratée, d'espèce `joueur`, et la suite continue. À la
fin, la suite échoue si une partie d'Hortense a :

- une attente `tous` sans défaut connu, ratée ou non jouée, dont la source n'est pas `transcription` ;
- une demande sans réponse de source `scenario` ;
- une erreur du joueur.

Sinon elle rend 0. La dernière ligne dit quelles attentes `tous` sont sous 100 %, et lesquelles le sont par la
transcription. Elle garde la règle validée (`chaine-laptop.md:61-62` : une `tous` ratée ou non jouée fait échouer la
suite) pour ce que notre code fait, et laisse en mesure ce que `tiny` coûte. Une course trouvée devient une issue et
un connu, jamais une borne élargie.

**Mesuré sur les onze lancements d'Hortense** (tâche 0, point 5) : chaque attente `tous` y tient, sauf une fois
`non-court`. Les cinq échecs de `couper-le-blanc` sont des demandes sans réponse de source `transcription` : la
règle ne les compte pas. La règle tient, **à une condition : que le juge nomme juste la source d'une parole perdue**
avant le faux modèle. Aujourd'hui il nomme `voix` ou `serveur` (tâche 0, point 6), et la course échouerait sur un
défaut du juge.

**La source d'une parole perdue** (tâche 2). Une parole dont le `dit` choisit une réponse du faux modèle, et qui :

- n'a laissé qu'un `bruit` de l'écoute sur sa phrase, sans essai : la source est **`ecoute`**. `tiny` n'a rien
  entendu ; l'écoute a jugé le son trop court (moins de 250 ms de voix, `endpoint.ts:128-134`). C'est la prise
  « non » de `verb-1`, le « Oui » de Julie dans `v-julie-1`, le « Non » et le « Oui » de jessica ;
- a une transcription que le filtre juge bruit, vide, sans lettre ou une hallucination connue (`filter.ts:33-36`),
  suivie de `sans_reponse` : la source est **`transcription`**. C'est le « Non » et le « Oui » de pierre ;
- a atteint le faux modèle sur un texte qui choisit une autre réponse que son `dit` : la source est
  **`transcription`**, la règle d'aujourd'hui (`judge.ts:161-179`) ;

est la source de chaque échec dont la fenêtre l'atteint, non jouée comprise, quel que soit le maillon où il se
montre. **Ce que les déroulés corrigent** : le relevé montrait ces mots « transcrits vides » ; dans `verb-1` et
`v-julie-1`, la transcription n'a pas eu lieu, c'est l'écoute qui a perdu le mot. La nommer `transcription` serait
faux. Avec la règle d'échec, une parole perdue par l'écoute fait donc échouer la course : à trancher (voir la fin).

**La robustesse** (`N>1` ou non, une voix autre qu'Hortense) : à trancher. Ses mesures : chaque voix casse au moins
un mot court, et jessica coupera `hesite-puis-demande` en deux. Deux voies :

- **la même règle que la course** : chaque mot qu'une voix casse fait échouer la suite, tant qu'il n'a pas de
  connu ; or un connu vaut pour un scénario, pas pour une voix ;
- **le relevé seul** (recommandé) : les parties d'une voix autre qu'Hortense ne font échouer la suite que sur une
  erreur du joueur ; chaque échec est au relevé, avec sa voix et sa source, et la tâche 5 ouvre une issue pour chaque
  écart d'un mécanisme qu'elle y lit. La robustesse dit ce que chaque voix casse, pas si la suite passe.

Les autres voies pour la course : **la règle de Pipecat**, qui rend toujours 0 (ses robots reposent sur des modèles
qui tirent au hasard ; ici une course est un défaut de mécanisme) ; **au minimum**, échouer si une `tous` tombe à
0 %.

### lun-luxuria#72 : « Arret. »

**Urgent** : « Arret. » ou « Arret ? » fait échouer `couper-le-blanc` cinq lancements sur onze chez Hortense, et
fait durer `arrete-net` 13 s au lieu de 6,4 six fois sur dix, la longue réponse choisie (tâche 0, point 5).

**Le `si` de la réponse à « Arrête » devient `arret`**, dans `arrete-net.ts:27` et `couper-le-blanc.ts:28`. La page
ne lit pas le texte pour se suspendre ; le vrai serveur ne réagit à un texte d'arrêt que pour « annule »
(`service.ts:229-238`). Le faux modèle tient la place d'un modèle qui comprend « Arret. » comme « Arrête » ;
Lun'Anima applique la même règle (`faux-modele.ts:110`). Ce n'est pas une borne : `si` dit ce que le faux modèle
comprend, pas ce qu'on attend de la page. `arret` couvre « Arrête ? », « Arret. », « Arret ? », « Arrête. » et
« Arrête ! » ; **« Allez ! »** (jessica) reste un échec de source `transcription`, sans autre `si` pour lui.

**Le garde-fou : un test sur textes seuls** (tâche 4). Pour chaque scénario jouable, chaque transcription vue (tâche 0,
point 8) choisit par `choisir` (`scenario.ts:311-312`) la même réponse que son `dit`, sauf celles qu'il nomme comme
des échecs attendus (« Allez ! »). Il attrape le vrai risque : un `si` élargi qui prend une autre parole, ou qui passe
devant une autre réponse dans l'ordre de `choisir`. C'est ce test qui ferme #72. Comparer les déroulés exacts d'avant
et d'après ne montrait rien : à ce niveau, la transcription rend le `dit`. Les textes vus qui se lisent de près :
« Louis. » choisit la réponse de « Oui » (`oui` y est), par chance ; « Raccontons à la journée de demain. » ne
contient pas `non`.

L'autre voie : garder `arrete` et compter l'échec, de source `transcription`. Avec la règle d'échec recommandée, il
ne ferait pas échouer la suite, mais pèserait sur chaque taux et allongerait la course.

### lun-luxuria#70 : les attentes `exact` trop justes pour la chaîne

**Elles restent des mesures.** Le relevé des taux donne, pour chacune, la part dans sa borne et la distribution de ce
qu'elle trouve : « trois mots entendus, à un près », « `sortie-arretee` à −2 ms ». C'est ce que l'issue demande de
voir. Ajouter une attente `tous` plus large serait élargir une borne sous un autre nom. L'issue se ferme avec le
premier relevé des taux. Mesuré (tâche 0, point 5) : elles ratent toujours, à des valeurs stables, `son-arrete` de
442 à 465 contre [384, 416], `blanc-de-tour` de `delai-a-l-essai` de 1 162 à 1 353 contre [860, 892] ; une
distribution les dit mieux qu'une borne. `chevauchement-garanti` est du même genre et passe en `exact` (tâche 4).

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
  phrases?: { parole: number; dit: string; entendu?: string; confiance?: number; son: string; dureeMs: number }[];
  inattendus: { texte: string; source: 'transcription' | 'scenario' }[];
  deroule?: string;                  // le nom du fichier
  raison?: string;                   // un scénario non joué
}
```

`phrases[].son` dit d'où vient chaque son : `pose:non.wav`, `cache:julie`, `synthese:julie`. `phrases[].dureeMs`
est la longueur réelle du son joué pour la parole (`SonPret.duree`, `sons.ts:80-84`), celle que « Rejouer un
échec » reprend.

### Les variables et les fichiers

| Variable | Par défaut | Rôle |
|---|---|---|
| `CHAINE_REPETITIONS` | `1` | parties par scénario et par voix |
| `CHAINE_VOIX` | `hortense` | ses voix, par virgules : `hortense`, `julie`, `paul`, `piper:<exe>\|<modèle>[#<nom>]` |
| `CHAINE_STT`, `CHAINE_TTS`, `CHAINE_SCENARIOS`, `BANC_DIR` | inchangées | |

Une voix de Piper donne ses deux chemins : `<exe>`, celui de `piper.exe`, et `<modèle>`, celui du `.onnx`, séparés
par `|`, que Windows refuse dans un chemin ; le locuteur suit le dernier `#`, après `.onnx`. Le chemin de `piper.exe`
ne se déduit ni du modèle, ni de sa voix (`CHAINE_TTS`) : la tâche 0 a posé le modèle hors du dossier de Piper. Par
exemple : `CHAINE_VOIX="julie,paul,piper:C:\…\piper\piper.exe|C:\…\piper\fr_FR-upmc-medium.onnx#pierre"`.

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
| les quatre `toux-*` | oui, si une toux est posée (tâche 6) | sinon « son manquant », au niveau exact seulement |
| `hesite-puis-demande` (nouveau) | oui, dans la course et la robustesse | ses attentes portent sur le mécanisme |
| `aparte-parole-longue`, `phrase-ecartee`, `echo-fort`, `delai-modele-lent` | non | `chaine.test.ts:120-130` |

## Palier 2 : les tâches

**En parallèle d'emblée** : 1, 2 et 4 (la tâche 0 est faite). **Après 1 et 2** : 3. **En dernier** : 5. **La toux,
6**, commence dès que CrOliX l'a tranchée et n'est attendue par aucune autre ; pour jouer ses scénarios à la chaîne,
elle attend 1 et 4, et 3 pour les répéter. Chaque fichier n'a qu'une tâche à la fois : 1 seule dans `sons.ts` ; 2
dans `taux.ts`, `judge.ts` et `releve.ts`, que 3 reprend après elle ; 4 seule dans `scenarios/` et
`scenarios.test.ts` ; 3 seule dans le `CLAUDE.md` et le `.gitignore` ; 6 ne touche aucun fichier suivi.

1. - [x] **Les voix, et la source de chaque son** (`src/presence/chaine/sons.ts`, `sons.test.ts`, `dev-luxuria`).
   *Parallélisable d'emblée.*
   - `type Voix = { nom: string; synth: Synth }` ; `sonsDe(s, dir, voix, poses)` à la place de `synth`
     (`sons.ts:137`). `poses: false` ignore les paroles posées (« Le son posé ») ; un `dit` entre parenthèses prend
     toujours son fichier posé.
   - Le cache par voix (`dire`, `sons.ts:96-109`) : Hortense garde la clé `sapi-hortense-16k` et `sons/sapi/`, pour
     que le cache d'aujourd'hui serve encore ; une autre voix, la clé `<nom>\n<texte>` dans `sons/<nomDe(nom sans
     chemin)>/`, jamais de « : ». Le cache garde le son brut, comme aujourd'hui (`sons.ts:105-108`).
   - `rogner` (`sons.ts:62-78`) garde 100 ms de marge de chaque côté, dans la limite du son, comme le script du
     testeur (`rogneMarge`). Il s'applique à la lecture, sur chaque morceau, sur un son posé et sur un bruit. La clé du
     cache ne change pas : le cache est brut. S'il devenait rogné, sa clé devrait porter la marge.
   - `SonPret.source` (`sons.ts:16`) devient un texte : `pose:<fichier>`, `cache:<voix>`, `synthese:<voix>`.
   - Un son posé entre parenthèses est coupé à sa `duree`, comme un bruit (`sons.ts:141-146`) ; plus court qu'elle,
     une erreur qui le nomme. Aujourd'hui `toux-courte` joue la toux entière (tâche 0, point 6).
   - `synthWinRT(nom)` pour Julie et Paul : un script fixe par `-EncodedCommand`, comme `synthSapi`
     (`sons.ts:239-257`). Le nom de la voix vient d'une liste fixe (`Julie`, `Paul`), jamais de l'entrée ; le texte
     sur l'entrée standard ; le WAV en base64 sur la sortie standard, lu par `readWav` (16 kHz natif, `fmt` de 18
     octets). La référence est le script du testeur, `banc-sons/chaine/essai-taux/scripts/winrt.ps1`, hors dépôt, à
     lire avant son retrait (tâche 5) : `AllVoices` filtré par `DisplayName`, `SynthesizeTextToStreamAsync` attendu
     par `AsTask`, lu par un `DataReader`. Une voix absente : une erreur qui la nomme.
   - `synthPiper(exe, modele, locuteur?)` : `piper.exe` au chemin donné, sans shell, les arguments
     `-q -m <modele> -s <numéro> -f <fichier>`, le texte sur l'entrée standard (tâche 0, point 2). Le numéro est lu
     dans `speaker_id_map` de `<modele>.json` ; un locuteur absent, une erreur qui le nomme. Le fichier de sortie est
     un temporaire du dossier de la voix, lu par `readWav` (22 050 Hz rééchantillonnés en linéaire), puis effacé.
   - `voixDe(spec, tts)` lit une entrée de `CHAINE_VOIX` (« Les variables et les fichiers ») ; elle refuse sa voix
     (le même modèle et le même locuteur que `CHAINE_TTS`), une entrée inconnue, une voix de Piper sans `|`.
   - Tests (synthèse injectée) : le cache par voix, celui d'Hortense gardé (la même clé, le même dossier) ; aucun
     « : » dans un dossier ; le cache brut, le rognage à la lecture avec sa marge, bornée au son ; une parole posée
     ignorée ou jouée selon `poses` ; une toux posée coupée à sa `duree`, refusée plus courte ; la source de chaque
     son ; la lecture et les refus de `voixDe` ; le numéro du locuteur lu dans un `.onnx.json` écrit à la main.
   - Exclu : lancer une vraie synthèse dans `npm test` ; un générateur de toux ; un sinc.
2. - [x] **Une ligne par partie, la source d'une parole perdue, et le relevé des taux** (`src/presence/taux.ts`,
   `taux.test.ts`, `releve.ts`, `judge.ts`, `judge.test.ts`, `dev-luxuria`). *Parallélisable d'emblée.*
   - Le type `Resultat` du contrat, `phrases[].dureeMs` compris ; `resultat(jouee, { suite, partie, rang, voix,
     poste, deroule })` : la voix et le rang en paramètres. `Jouee` ne change que d'un champ : `synthese` devient un
     texte (`releve.ts:96`).
   - La source d'une demande sans réponse sort de `releveChaine` (`releve.ts:162-177`) en une fonction exportée, que
     le relevé et `resultat` appellent : une seule règle.
   - **La source d'une parole perdue** (« Ce qui fait échouer une suite répétée »), à `lieu === 'chaine'` seulement.
     `divergence()` (`judge.ts:161-179`) devient la première parole perdue, dans l'ordre du jeu : une parole dite
     (pas entre parenthèses), dont le `dit` choisit une réponse (`choisir`, `scenario.ts:311-312`), et dont la
     phrase finit par un `bruit` de l'écoute, sans essai (source `ecoute`), ou par un `verdict` `bruit` suivi de
     `sans_reponse` (source `transcription`) ; ou dont le texte reçu choisit une autre réponse (source
     `transcription`, la règle d'aujourd'hui). Son instant (le `bruit`, le `verdict` ou l'appel) et sa source prennent
     la place de `transcrit` (`judge.ts:334-346`) : chaque échec dont la fenêtre l'atteint, non jouée comprise, prend
     cette source si elle est en amont de `premier`. Au niveau exact, rien ne change.
   - `tenue(r)` : la seule définition de « Ce qu'est un taux ». `echoue(lignes)` : la règle d'échec tranchée pour
     `N>1`, sur les lignes d'Hortense ; pour les autres voix, ce que CrOliX tranche (recommandé : une erreur du
     joueur seule).
   - `releveTaux(lignes)`, pure : en tête le nombre de parties, les voix, la transcription et ce que valent ses taux
     (`tiny` sur le laptop), sa synthèse, le poste, la durée, et pour la course la phrase de la règle de trois ; puis
     par scénario, par attente et par voix, tout ce que dit « Ce qu'est un taux ».
   - Elle reprend `delays()`, `passe`, `nomDe` et les aides de `releve.ts` (`compte`, `parCle`, `table`), exportées,
     pas recopiées.
   - `judge.ts:313-318` : à `lieu === 'chaine'`, un défaut connu est conforme sur son espèce seule ; au niveau exact,
     rien ne change.
   - Tests, sur des lignes écrites à la main : une `non_jouee` jamais tenue ; un connu qui se montre une fois sur
     trois, avec ses trois comptes ; un connu autrement raté, hors de la partie tenue ; pas de 95e centile sous vingt
     valeurs ; les échecs par espèce, par source et par voix ; la part juste et les variantes ; le fichier et
     l'extrait d'une partie ratée ; `echoue` sur chaque cas de la règle, une voix autre qu'Hortense comprise ; un
     relevé entier comparé ligne à ligne. Dans `judge.test.ts` : le même verdict, un autre `trouve`, conforme à la
     chaîne et pas au niveau exact ; et, écrits d'abord et vus rater, les trois parties perdues de la tâche 0 en
     petit : le « Non » de `non-court` jugé bruit par l'écoute (`pour-de-bon` de source `ecoute`, et non `voix`) ;
     le « Oui » de `oui-puis-reparler` jugé bruit par l'écoute (les trois non jouées de source `ecoute`, et non
     `serveur`) ; le même « Oui » rendu sans lettre (`verdict` `bruit`, source `transcription`). Une toux jugée bruit
     ne nomme rien ; au niveau exact, les mêmes parties gardent leurs sources d'aujourd'hui.
   - Exclu : lire un fichier ; le navigateur ; changer l'écoute ou `minSpeechMs`.
3. - [x] **Répéter à la chaîne** (`src/presence/chaine.test.ts`, `releve.ts`, `CLAUDE.md`, `.gitignore`,
   `dev-luxuria`). Après 1 et 2.
   - `CHAINE_REPETITIONS` et `CHAINE_VOIX`, lue par `voixDe`. L'ordre, comme Pipecat : le tour r joue chaque voix,
     puis chaque scénario, une fois. Un nom de test par partie (`<nom> #<k> <voix>`).
   - `partie.json` porte `<nom>#<k>` (`chaine.test.ts:423-424`) ; le témoin garde `<nom>-temoin`.
   - Les sons de chaque voix par `sonsDe(s, DIR, voix, poses)`, `poses` faux quand `CHAINE_VOIX` est donné.
   - `synthese` de la `Jouee` : `CHAINE_TTS` sans son chemin (`piper:fr_FR-siwis-medium`), ou `fausse`
     (`chaine.test.ts:562`).
   - Après chaque partie, une ligne dans `resultats.jsonl`, vidé au départ, avec la source et la durée réelle de
     chaque son (`phrases[].son`, `phrases[].dureeMs`). Les déroulés : une partie par scénario, les noms
     d'aujourd'hui ; sinon suffixés de `k`.
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
4. - [x] **Les scénarios** (`src/presence/scenarios/`, `src/presence/scenarios.test.ts`, `testeur`).
   *Parallélisable d'emblée*, en parallèle de 1 et 2.
   - lun-luxuria#72, urgent : `si: 'arret'` dans `arrete-net.ts:27` et `couper-le-blanc.ts:28`. Aucun autre `si` :
     les autres mots cassés (« Allez ! », « Louis. ») ne le demandent pas (« lun-luxuria#72 »).
   - Le test sur textes seuls, dans `scenarios.test.ts`, écrit d'abord et vu rater sur « Arret. » : une table des
     transcriptions vues (le scénario, la parole, les textes de la tâche 0, point 8) ; pour chacune,
     `choisir(reponses, entendu)` vaut `choisir(reponses, dit)`, sauf « Allez ! », écrit dans la table comme un
     échec attendu. Une phrase qui joint deux paroles se teste sur leurs textes joints, comme le juge
     (`judge.ts:172-176`).
   - `hesite-puis-demande.ts` (« Les hésitations ») : données seules, son calcul à la trame en commentaire ; en
     `tous`, une seule demande, l'essai de la première pause retiré, une seule réponse qui sonne, rien sur le texte de
     « euh » ni sur le numéro de l'essai confirmé ; `exact` pour les bornes à la trame. Le compte de
     `scenarios.test.ts:29-31` passe à dix-huit.
   - `toux-puis-parole` : `chevauchement-garanti` en `niveau: 'exact'`, sa borne inchangée.
   - `toux-courte` : son `dit` devient `(toux courte)`, pour qu'il prenne `toux-courte.wav` (« La toux ») ; au
     niveau exact, rien ne change, sa transcription fausse rend `entendu: ''`.
   - Exclu : changer une borne ; changer un mécanisme pour qu'un scénario tienne : un écart devient une issue.
5. - [ ] **Les premières suites, et le plan coché** (`testeur`). Après 1 à 4. Restent les issues, la PR et le
   retrait, à cocher plus bas.
   - [x] Avant tout retrait : `fr_FR-upmc-medium` déplacé d'`essai-taux/voix-upmc/` dans le dossier de Piper, hors
     dépôt ; `winrt.ps1` lu par la tâche 1.
   - [ ] Une partie par scénario, Hortense : les verdicts de la suite 2c, sauf #72 et la toux, comparés ici ; ce que
     la marge du rognage change aux trous (`delai-a-l-essai`). Comparés (« Ce que l'exécution a trouvé ») ; la
     longueur réelle du trou allongé n'a pas été relevée.
   - [x] `N=3`, Hortense, environ 7 min : la dérive par rang, le serveur après 30 parties, le relevé lu. Arrêt si
     quelque chose dérive. 394 s ; rien n'a dérivé, `hesite-puis-demande` a raté ses trois parties, et ses attentes
     ont changé avant la course.
   - [x] La course : `CHAINE_REPETITIONS=30`, Hortense, environ 70 min, sur secteur, veille coupée, poste au repos,
     écrit ici. 60 min, sur secteur ; la veille coupée n'a pas été vérifiée, et le poste n'était pas tout à fait au
     repos.
   - [x] La robustesse : `CHAINE_VOIX=julie,paul,piper:…#jessica,piper:…#pierre`, `CHAINE_REPETITIONS=2`.
   - [x] Recopier ici, sous « Ce que l'exécution a trouvé » : les taux, les échecs par espèce, source et voix, les
     distributions, la transcription par voix, les durées ; et que ces taux sont ceux de `tiny` sur le laptop.
   - [x] Une issue par écart d'un mécanisme, et un connu qui la nomme ; jamais une borne élargie. Si la course perd
     un mot court par l'écoute (la prise « non », une fois sur onze à la tâche 0), une issue le dit. lun-luxuria#70
     et #72 fermées avec le relevé, si elles tiennent. Aucun écart de mécanisme, et la course n'a perdu aucun mot
     par l'écoute. Fait le 12/11 : #72 se ferme avec la PR lun-luxuria#76 ; #70 reste ouverte et a reçu B, C, E et F en commentaire (https://github.com/Lun-Ecosystem/lun-luxuria/issues/70#issuecomment-6826918253) ; G est lun-luxuria#73 ; le juge sans attente sur un nombre d'événements (fenêtre fixe de 2 880 ms de `rien-de-l-essai-retire`) est lun-luxuria#74 ; le résumé de `banc` et `scenarios` tu sous un agent, lun-luxuria#75 ; H n'a pas d'issue.
   - [x] Relecture séparée du diff, la PR en brouillon ; la feuille de route mise à jour. La feuille de route est à
     jour ; branche poussée, PR en brouillon : lun-luxuria#76.
   - [x] Les scripts et les copies de `BANC_DIR` de la tâche 0 retirés de `banc-sons`, à la fusion. Fait le 12/11
     après la fusion de lun-luxuria#76 : `essai-taux/` retiré en entier (son `uv-cache` compris) ; les relevés de
     `banc-sons/chaine/taux/` restent, preuves de #70 et #73 à #75.
6. - [ ] **La toux** (`testeur`, hors dépôt). *Indépendante* : elle commence dès que CrOliX l'a tranchée (« À
   trancher ») ; aucune autre tâche ne l'attend. Ses scénarios se jouent à la chaîne une fois 1 et 4 faites, se
   répètent une fois 3 faite. **Pas commencée au 12/11** : elle attend les deux prises de CrOliX, à ranger dans
   `banc-sons/enregistrements-toux-1211/`, qui n'existe pas encore. Sans elles, rien à couper ni à jouer : la course
   et la robustesse ont dit « son manquant » pour les quatre scénarios de toux.
   - [ ] (a) Sa prise, deux toux, une ordinaire d'au moins 450 ms et une courte d'au moins 300 ms, rangées dans
     `banc-sons` hors de tout dépôt, comme sa prise « non ». (b) Un fichier CC0 téléchargé hors dépôt, sa licence lue
     sur sa page et écrite ici avec son adresse, servi sous les deux noms. Puis `sons/toux.wav`,
     `sons/toux-courte.wav` et `sons/bruit.wav` posés dans `banc-sons/chaine/`.
   - [ ] Silero par `replay()` sur chaque toux coupée à sa `duree`, aux décalages de la tâche 0 (0, 8, 16, 24 ms) :
     tenue ou non, écrit ici. Une mesure : c'est sa toux, elle n'est pas choisie sur Silero.
   - [ ] Les quatre scénarios de toux joués à la chaîne, une partie chacun, puis trente avec Hortense, dans la course
     si elle n'est pas encore partie, sinon à part (`CHAINE_SCENARIOS` réduit aux quatre toux, environ 30 min,
     estimé). Ce que `tiny` fait de chaque toux, au relevé et ici.
   - [ ] (c) Sans son : rien à jouer ; écrire ici que les quatre scénarios restent au niveau exact à cette étape, et
     que le relevé dit « son manquant ».
   - Exclu : une toux synthétique ; un générateur de toux ; un son dans un dépôt.

## Ce que l'exécution a trouvé

Le 12/11. Tâches 1, 2 et 4 en parallèle, puis 3, sur `feat/donnees-et-taux` (Lun'Luxuria, depuis `8a7d99f`) ; puis
la tâche 5, jouée par le `testeur` : une partie par scénario, `N=3`, la course, la robustesse. Des corrections du
banc ont suivi chaque suite. Lun'Anima n'est pas touché.

**Ce que valent ces chiffres.** Ce sont les taux de `tiny` sur le processeur du laptop (i7-1165G7), pas ceux de
whisper-server sur la RX. Le poste était sur secteur. La veille coupée n'a pas été vérifiée (`powercfg` refusé) ;
elle ne s'est pas déclenchée. Le poste n'était pas tout à fait au repos : un éditeur et des agents ouverts, rien de
lourd. La robustesse joue deux parties par voix : ce sont des constats, pas des taux.

**Les deux premières suites.**

- **Une partie par scénario** (164 s) : les 25 attentes `tous` des neuf scénarios de la suite 2c tiennent, comme en
  2c. `hesite-puis-demande` en rate deux : `retrait-recu` absente, `rien-de-l-essai-retire` en trop.
- **`N=3`** (394 s) : les mêmes deux attentes ratent trois fois sur trois ; le reste tient, rien ne dérive. Le relevé
  y écrivait la règle de trois malgré ces échecs. Ses attentes et la règle de trois ont changé avant la course
  (« Les écarts au plan »).
- Les tenues comptées du début de la parole arrivent environ 90 ms plus tard qu'en 2c : 523 à 543 ms contre 430 à
  457. La marge de tête de 100 ms en est la cause probable, non vérifiée dans un déroulé.

**La course** (`CHAINE_REPETITIONS=30`, Hortense) : 3 603 s au mur, dont 3 104 s de parties, contre 70 min
estimées. 300 parties, dix scénarios. **1 partie ratée sur 300**, de source `transcription`. La suite passe.

- **La partie ratée**, `oui-puis-reparler#28` : « Oui » entendu « On dit. », à 0,29 de confiance. Le filtre le
  laisse passer, le faux modèle n'a pas de réponse pour lui. `oubliee` et `coupure-vide` sont absentes, de source
  `transcription`. Chaque autre scénario tient 30 fois sur 30, et chaque autre attente `tous` aussi, les six de
  `hesite-puis-demande` comprises.
- **Les échecs** : par espèce, `absent` 2 ; par source, `transcription` 2 ; par voix, hortense 2. Une demande sans
  réponse, de source `transcription`. La règle de trois n'est pas écrite : le relevé dit « 1 partie ratée sur 300 ».
- **Non joués** : les quatre scénarios de toux (« son manquant ») et les quatre que la chaîne ne joue pas.
- **La dérive** : aucune nette. Médianes par passage, du premier au dernier des trente : transcription 466 → 461 ms
  (427 à 489 sur les trente), blanc de tour 1 225 → 1 231 (1 186 à 1 267), premier mot 413 → 415 (407 à 417).
  Attente de fin 710 → 704, file du serveur 5 → 9, second mot 2 665 → 2 663, synthèse 157 → 162.
- **La mémoire** du serveur : 96 à 125 Mo, elle oscille sans croître (une partie des échantillons lue). Son journal :
  135 739 octets, 1 082 lignes, une croissance linéaire.
- **Les mesures `exact`**, sur trente parties, en ms (médiane, puis étendue) :
  - les tenues comptées du début de la parole (`son-arrete` et `sortie-arretee` d'`arrete-net`,
    `suspendue-a-la-tenue`, les deux `retenue`) : aucune dans [384, 416] ; médianes 526 à 547, de 507 à 568 ;
  - `attente-fin`, dans trois scénarios : 30 sur 30 dans [700, 736] ; 710, de 700 à 715 ;
  - `blanc-de-tour`, jamais dans sa borne : 1 218 (1 116 à 1 404) dans `delai-a-l-essai` et 1 236 (1 151 à 1 419)
    dans `hesite-puis-demande`, pour [860, 892] ; 1 767 (1 659 à 1 880) dans `delai-de-reponse`, pour [1404, 1436] ;
  - `non-court` : `son-arrete` 27 sur 30 dans [692, 724], 703 (691 à 731) ; `sortie-arretee` 24 sur 30, 705 (694 à
    742) ;
  - `faire-taire` : `son-arrete` 30 sur 30 dans [0, 32] (0 à 2) ; `sortie-arretee` 26 sur 30, 5 (0 à 13), absente
    quatre fois (constat F). `arret-coupure` d'`arrete-net` : 30 sur 30 (0 à 1) ;
  - `phrase-pendant` de `deux-phrases` : 30 sur 30, 1 303 (1 287 à 1 317). `essai-retire-a-la-voix` : aucune dans
    [1056, 1088], 1 311 (1 302 à 1 330). `blanc` de `phrase-attente` : 2 sur 30 dans [1640, 1672], 1 540 (1 408 à
    1 755) ;
  - sans valeur à la chaîne : `poste` de `phrase-attente` (`delai_manquant` 30 fois, constat B), `synthese-pendant`
    (non jouée 30 fois, constat C), `coupee` et `coupure-recue` (absentes 27 fois dans `arrete-net`, 30 dans
    `non-court`, constat E), `retrait-recu` (absente 30 fois).
- **La transcription**, justes sur trente : « Raconte-moi la journée de demain » 0, dans les quatre scénarios
  (« Reconte-moi… », « Recondement à la journée de demain. ») ; « J'ai des mails ? » 0 (« J'ai dit mai. » 27 fois) ;
  « Tu peux me lire, euh, la liste des courses » 0 (« Tu peux me lire ? eux ? La liste des courses ? » 30 fois) ;
  « Arrête » 22 dans `arrete-net` et 21 dans `couper-le-blanc`, avec 16 « Arret » et un « Ahead. » ; « Oui » 29 ;
  « Non », la prise `non.wav`, 7 (« No. » 23 fois), jamais perdu par l'écoute. Les autres paroles : 30, à la
  ponctuation près.

**La robustesse** (Julie, Paul, jessica, pierre ; `CHAINE_REPETITIONS=2`) : 1 241 s au mur, dont 1 055 s de parties,
contre 30 à 40 min estimées. 80 parties, 20 par voix. La suite passe.

- **Par voix** : Julie et Paul tiennent leurs 20 parties. jessica rate `arrete-net`, `couper-le-blanc` et
  `oui-puis-reparler` deux fois sur deux. pierre rate `oui-puis-reparler` deux fois sur deux, `couper-le-blanc` une
  fois sur deux.
- **Les échecs** : par espèce, `non_jouee` 9, `absent` 6, `en_trop` 4 ; par source, `transcription` 19, tous ; par
  voix, jessica 14, pierre 5, Julie et Paul 0. Quatre demandes sans réponse, de source `transcription`.
- **Ce que les voix cassent** : « Arrête » entendu « à l'autre. » ou « Salut ! » chez jessica, « Ah j'ai... » chez
  pierre. Leur « Oui » revient vide ou jugé bruit ; la transcription a eu lieu, la source `transcription` est juste.
  `hesite-puis-demande` tient deux fois sur deux chez jessica, dont la tâche 0 attendait une phrase coupée en deux :
  non expliqué, sur deux parties.
- **La dérive**, sur deux passages : au plus 38 ms d'écart sur un délai, pour chaque voix. **La mémoire** du serveur
  n'a pas été relevée.
- **Les mesures `exact`**, huit valeurs par mesure, les quatre voix ensemble : les délais de la page restent dans les
  plages de la course (`attente-fin` 700 à 713 ; `blanc-de-tour` de `delai-a-l-essai` 1 192 à 1 296). Les tenues
  s'étalent là où une voix casse le mot : `son-arrete` de 482 à 1 576 dans `arrete-net`, de 2 à 1 195 dans
  `non-court`.
- **La transcription par voix**, justes sur toutes les paroles : Julie 20 sur 30, Paul 17 sur 30, jessica 6 sur 28,
  pierre 5 sur 29. « Oui » rendu « Louis. » deux fois chez Paul ; « Non » rendu « Loup. » chez jessica, « Où ? » chez
  pierre. « Raconte-moi… », « J'ai des mails ? » et « Tu peux me lire, euh… » sont faux chez les quatre.

**Les constats, classés** (le code des deux worktrees relu, sans rien changer). **Aucun défaut du mécanisme**, ni
dans la page ni dans le serveur. Six défauts du banc, A à G ; H tient à la transcription.

- **A.** La ligne de résumé n'atteignait pas la sortie : sous un agent, Vitest 5 prend un rapporteur qui tait les
  `console.log` d'une suite passée. Corrigé : `npm run chaine` demande le rapporteur par défaut. Vu sur la chaîne :
  `faire-taire` joué deux fois sous un agent, la ligne sort.
- **B.** `poste` de `phrase-attente`, `delai_manquant` 30 fois sur 30. Le faux modèle de la chaîne fait le poste par
  `relire_journee` ; le serveur le traite en relecture et n'écrit `postMs` qu'en délégation. Le temps du poste tombe
  dans le second mot. L'attente recopie le `postMs` du faux serveur : irréalisable à la chaîne.
- **C.** `synthese-pendant` de `oui-puis-reparler`, non jouée 30 fois sur 30. L'événement existe, 438 ms après
  `retenue`, mais l'attente est ancrée sur `retenue`, une `exact` toujours hors de sa borne à la chaîne ; une ancre
  doit être tenue (`judge.ts:245-249`). C'est ce que lun-luxuria#71 nomme.
- **E.** `coupee` et `coupure-recue`, absentes dans `arrete-net` et `non-court` : des attentes `exact` sur le mot à mot
  du faux son, 60 ms par caractère. À la chaîne, un mot de plus ou de moins (« Demain matin il » contre « Demain
  matin il fera »). La page coupe et envoie la coupure à chaque partie.
- **F.** `sortie-arretee` de `faire-taire`, absente 4 fois sur 30 : la sonde date `arrete` sur l'horloge du son,
  latence de sortie comprise, et le geste sur l'horloge murale (`chaine/sonde.ts:216-253`). `arrete` tombe 1 à 3 ms
  avant le geste, et le juge veut un instant après son ancre.
- **G.** Une partie attend son plafond de 90 s (`PLAFOND_MS`) en robustesse : dans `oui-puis-reparler`, la parole 2
  est ancrée sur l'envoi 1 ; quand l'écoute juge la parole 1 bruit, rien n'est envoyé, et la parole 2 est sautée au
  plafond.
- **H.** « On dit. », à 0,29 de confiance, passe le filtre : conforme à sa règle. Le filtre n'a pas de seuil de
  confiance (`src/listen/filter.ts:25-56`) ; la confiance est tracée. Pas d'issue.

**Les issues.** **lun-luxuria#72 tient** : 16 « Arret » dans la course, `couper-le-blanc` 30 sur 30 (il échouait
cinq lancements sur onze à la tâche 0), `arrete-net` tenu sur ses sept « Arret ». La PR de Lun'Luxuria la fermera.
**lun-luxuria#70 reste ouverte**, à l'inverse de ce que ce plan prévoyait (« l'issue se ferme avec le premier relevé
des taux ») : elle reçoit B, C, E et F, des attentes `exact` qu'une distribution ne dit pas, sans valeur ou décalées
d'une horloge à la chaîne. Leur suite se tranche dans #70, sans borne élargie. **G devient une issue à part.**

**Les écarts au plan**, chacun vu dans le diff (`8a7d99f..HEAD`) :

- **Un son coupé à sa `duree`** (une toux entre parenthèses, `bruit.wav`) ne garde aucune marge, ni en tête ni en
  fin. Il est refusé s'il est plus court que sa `duree`, `bruit.wav` compris. Le plan mettait la marge sur un son posé
  et sur un bruit. Raison : avec la marge de tête, une prise qui commence par un silence perdait jusqu'à 100 ms de
  toux, sous ce que Silero demande pour la tenir ; avec celle de fin, 400 ms de toux suivies de silence passaient
  pour 450. La marge de 100 ms reste pour les morceaux dits et pour les sons posés parlés, comme `non.wav`.
- **La source des sons est portée par `Jouee`** : la source et la durée de chaque parole (`sons`), avec la voix de la
  personne (`voix`). `resultat()` les lit sur la partie, au lieu de les prendre en paramètres. Le plan ne changeait
  `Jouee` que d'un champ, `synthese`. Raison : un seul chemin, que lisent le relevé de la chaîne (sa colonne « Son »,
  le titre de chaque scénario par voix) et la ligne de la partie.
- **La dérive est relevée par passage**, la k-ième partie de chaque scénario dans une voix, puis agrégée : premier et
  dernier passage, les scénarios mis ensemble. Le plan disait « par tour » ; le relevé garde ce mot pour les tours
  d'une partie, dans sa table des délais. Une dérive d'un seul scénario s'y dilue : un raccourci noté dans `taux.ts`,
  à séparer si l'un d'eux dérive.
- **La « une par scénario »** (les `expect` d'aujourd'hui, les déroulés sans `k`, pas de `releve-taux.md`) n'est
  écrite qu'à `N=1`, avec Hortense seule (`uneParScenario`). Le plan l'aurait donnée à `N=1` avec une seule autre voix.
  Raison : une voix autre qu'Hortense suit la règle de la robustesse, `N>1` ou non (« Ce qui fait échouer une suite
  répétée ») ; des `expect` partie par partie la contrediraient.
- **L'en-tête du relevé des taux exclut les défauts connus** de ses échecs par espèce, par source et par voix, quel
  que soit leur état. Le plan les voulait « comme aujourd'hui » (`releve.ts:62-64`), où un connu qui a changé compte
  parmi les échecs. Raison : la même définition que la partie tenue, d'où un connu est exclu ; ses trois comptes sont
  dans sa propre table.
- **Les attentes de `hesite-puis-demande` ont changé.** `retrait-recu` passe en `exact`. `rien-de-l-essai-retire`
  n'attend plus de numéro de réponse : rien ne sonne pendant la parole, de son début à 2 880 ms. `pas-un-bruit` est
  rangée sous l'écoute, plus sous le filtre. Raison : à la chaîne, elles tenaient au numéro du message, le vrai
  numéro de la base, et à la vitesse de `tiny` : retiré avant sa transcription, l'essai n'est jamais envoyé. Les deux
  premières rataient à `N=1` et trois fois sur trois à `N=3`.
- **La règle de trois n'est écrite qu'à zéro échec** ; sinon, le relevé dit combien de parties d'Hortense ont raté.
  Raison : à `N=3`, il l'écrivait alors que `hesite-puis-demande` ratait ses trois parties. Aussi, une erreur du
  joueur compte une fois par partie, sous la source `joueur`, hors des tables des attentes et de la dérive : une
  synthèse de Piper pendue était comptée contre le maillon de la première attente.
- **Le lanceur des synthèses a une limite de 30 s** (`lancer`, `sons.ts`), pour Piper comme pour Hortense, Julie et
  Paul, qui passent par lui. Le plan n'en mettait pas. Raison : une synthèse de Piper pendue tenait la partie. Le refus
  attend que l'enfant tué se ferme : avant, Windows refuse d'effacer le WAV qu'il écrit. Piper est lancé depuis son
  dossier, où il trouve les données d'espeak-ng, ses deux chemins rendus absolus.

## Hors périmètre

- Corriger ce que les taux trouvent : une issue par écart. lun-luxuria#63 (elle reprend par-dessus une phrase qui
  suit une toux) est un défaut de mécanisme ; son correctif a son propre chantier.
- Changer l'écoute pour les mots courts (`minSpeechMs`, la tenue) : si la course perd un mot court, une issue.
- lun-luxuria#67 (les mutations lisent des lignes JSON) : elle reste une issue `inbox`, hors de cette étape.
- lun-luxuria#68, #69, #71 : non touchées. Le relevé des taux montrera #71 (`synthese-pendant` jamais jouée) à
  chaque partie.
- Tirer les délais au niveau exact : la tâche 0 (point 7) ne le justifie pas.
- `fr_FR-mls-medium` et ses lecteurs : quatre voix tiennent sans eux.
- Le desktop, la fenêtre Tauri, le petit mode, l'écho, whisper-server, le vrai modèle, RVC : l'étape 5.
- Les épreuves d'hésitation au-delà de 700 ms (« tenir une pause ») : elles attendent le modèle de fin de phrase.
- Un fond de bruit sous la parole, le débit des voix, les bruits autres que la toux.
- Common Voice, et toute prise de personne au-delà des siennes : tranché le 12/11, pas à cette étape.
- Jouer deux parties à la fois ; reprendre une suite arrêtée (ses lignes restent) ; un fil par partie.
- Garder le son des deux voies d'une partie ratée : son oreille n'ajoute rien sur cet axe.

## Limites

- **Les taux sont ceux du laptop** : `tiny` sur son processeur, pas whisper-server sur la RX. La transcription y
  prend 343 à 665 ms dans la chaîne.
- Trente parties sans échec mettent l'échec sous 10 %, elles ne disent pas qu'il n'existe pas. Deux parties par voix
  ne donnent aucun taux : elles disent ce que la voix casse.
- Les voix sont propres, lues, sans accent, sans pièce ni micro : la sonde pose le son dans la page. Une hésitation
  lue par une synthèse n'est pas quelqu'un qui cherche ses mots.
- Rejouer un échec reproduit ses délais et ses durées, pas son écoute ; la durée de ses phrases y est une moyenne,
  alors qu'elle va de 50 à 107 ms par caractère d'une phrase à l'autre.
- Le temps de la course est mesuré sur un poste au repos, sur secteur ; en charge ou sur batterie, plus, et les
  délais bougent.
- Deux Piper : la version du `piper.exe` du poste est déduite de ses fichiers (`piper_phonemize.dll`,
  `libtashkeel_model.ort`), pas lue.
- La source d'une parole perdue ne couvre pas un mot entendu juste mais trop court pour une tenue (Paul,
  `arrete-net`) : le juge y nomme `voix`, parce qu'une attente `exact` en amont n'entre pas dans `premier`
  (`judge.ts:330-333`). À la robustesse, c'est ce que la voix casse ; à la course, une issue s'il se montre.
- La marge de 100 ms est mesurée sur `tiny` seul, pas dans Silero ni dans une suite à la chaîne : la tâche 5 le voit
  à sa première suite.
- Non vérifié : qu'un CC0 de Freesound convienne ; la licence de `fr_FR-mls_1840-low` (hors périmètre).
- **Kokoro** : `voix/service.py:94` nomme la voix `ff_siwa`, là où sa voix française s'appelle, à ma connaissance,
  `ff_siwis`. Aucun fichier de voix de Kokoro sur le laptop pour le vérifier. À vérifier ; une issue sera ouverte
  une fois vérifié. Hors de ce plan.
- Le fil `main` sur 300 parties d'un même lancement n'a jamais été joué : `N=3` le regarde d'abord. Dix lancements
  de neuf parties n'ont montré aucune dérive.
- Les tenues arrivent 43 à 82 ms plus tard à la chaîne qu'au niveau exact ; on ne sait pas si c'est Silero ou le
  trajet du son. La toux d'essai de 450 ms a pourtant été tenue trois fois sur trois.
- Unmute et EVA ne sont pas relus : leur façon de compter les centiles et d'ajouter du bruit n'est pas comparée.

## Ce qui reste pour l'étape 5, le desktop

- La même commande et le même relevé des taux, avec le vrai modèle, whisper-server sur la RX et sa vraie voix
  (Piper ou Kokoro, puis RVC), dans la fenêtre Tauri : le petit mode (`aparte-parole-longue`, `phrase-ecartee`) et
  l'écho (`echo-fort`), par de vrais haut-parleurs, un vrai micro et l'annulation d'écho.
- Copier le cache des voix (`sons/<voix>/`) et `fr_FR-upmc-medium` sur le desktop : Piper y referait des sons
  différents. Y vérifier Julie et Paul.
- `synthese` nomme sa vraie voix (Kokoro, RVC), et `poste` le desktop.
- Ce qui s'entend vraiment, au-delà de la sortie du graphe.
- Les budgets par étape de la veille (transcription sous 300 ms, première phrase sous 700 ms…) en seuils sur les
  médianes et les 95e centiles du relevé.
- La liste d'écoute retirée de la feuille de route.

## À trancher par CrOliX

**Tranché le 12/11, pour le palier 1** (« je valide ») : la tâche 0 et le seul téléchargement de
`fr_FR-upmc-medium` ; la toux synthétique choisie sur Silero seul, faute de prise ou de CC0 ; Common Voice, pas à
cette étape. La tâche 0 est faite ; la toux synthétique n'a pas tenu son critère.

**Tranché le 12/11, pour le palier 2** (« je valide avec tes recommandations ») : les treize points ci-dessous,
chacun selon sa recommandation ; la toux par sa prise (a).

**Pour valider le palier 2** (chaque recommandation révisée avec les mesures de la tâche 0) :

1. **Le palier 2 entier**, tâches 1 à 6, tel que révisé ici. Je recommande de le valider : chaque choix y est
   mesuré, sauf la toux, qui n'en bloque aucun.
2. **Les voix** : je recommande Hortense pour la course ; Julie, Paul (WinRT), jessica et pierre (`piper.exe`) pour
   la robustesse ; MLS retiré. Les cinq sont atteintes, et jessica et pierre cassent les mots courts : c'est ce que
   la robustesse doit montrer.
3. **Le son posé** : je recommande qu'il soit ignoré quand `CHAINE_VOIX` est donné (chaque voix dit « Non »), et
   joué, nommé `pose:non.wav`, sinon ; une toux posée toujours jouée, coupée à sa `duree`. L'autre voie : un son posé
   est sa propre voix, toujours joué.
4. **Le rognage** : je recommande 100 ms de marge de chaque côté de chaque morceau, le seul levier net (trois paroles
   justes de plus sur treize chez Hortense). Le cache reste brut, sa clé ne change pas. L'autre voie : la marge sur
   la tête et la fin de la parole seulement, qui ne touche pas aux trous, mais n'a pas été mesurée.
5. **La source d'une parole perdue** : je recommande la règle de la tâche 2, `ecoute` quand l'écoute a jugé le mot
   bruit, `transcription` quand la transcription le rend vide ou choisit une autre réponse. Puis, **une parole perdue
   par l'écoute fait-elle échouer la course ?** Je recommande oui : c'est notre écoute qui jette un vrai « Non » de
   sa prise, une fois sur onze ; une course qui le montre ouvre une issue et un connu, sans borne élargie. L'autre
   voie : la compter comme une source `transcription`, une mesure qui ne fait pas échouer la course ; la course
   passerait, au prix d'un nom faux.
6. **Ce qui fait échouer la course** (`N>1`, Hortense) : je recommande la variante du plan-challenger, mesurée sur
   onze lancements : `N>1` échoue sur une `tous` sous 100 % hors défauts connus et hors source `transcription`, une
   demande sans réponse de source `scenario`, une erreur du joueur. Les autres voies : la règle de Pipecat
   (toujours 0) ; échouer à 0 % seulement.
7. **La robustesse** : je recommande le relevé seul. Les parties d'une voix autre qu'Hortense ne font échouer la
   suite que sur une erreur du joueur, et la tâche 5 ouvre une issue pour chaque écart d'un mécanisme qu'elle lit au
   relevé. L'autre voie : la même règle que la course ; chaque mot qu'une voix casse ferait échouer la suite, et un
   connu ne vaut pas pour une voix.
8. **`chevauchement-garanti`** (`toux-puis-parole`) : je recommande `exact`. Mesuré à 486, 499 et 532 ms contre
   [0, 432] ; sa borne est un calcul à la trame, comme celles de #70. L'autre voie : garder `tous`, une issue et un
   connu ; mais rien ne dit que ce soit un défaut de la page plutôt que le trajet du son.
9. **lun-luxuria#72** : je recommande `si: 'arret'`, avec le test sur textes seuls, en urgence : « Arret » fait
   échouer `couper-le-blanc` cinq lancements sur onze. « Allez ! » reste un échec de source `transcription`.
10. **lun-luxuria#70** : je recommande de garder ces attentes en mesures, avec leur distribution, sans attente
    `tous` plus large. Leurs valeurs sont stables d'un lancement à l'autre.
11. **`hesite-puis-demande`** : je recommande de l'écrire avec des attentes sur le mécanisme (une seule demande,
    l'essai de la première pause retiré, une seule réponse qui sonne), jamais sur le mot « euh », que `tiny` ne
    rend jamais deux fois pareil.
12. **La toux** : (a) **sa prise**, deux toux, une ordinaire d'au moins 450 ms et une courte d'au moins 300 ms,
    rangées dans `banc-sons` hors de tout dépôt, comme sa prise « non » ; je la recommande, c'est la règle validée
    et la seule toux vraie. (b) Un fichier CC0 téléchargé hors dépôt, sa licence vérifiée sur sa page. (c) Pas de
    son : les quatre scénarios de toux restent au niveau exact à cette étape, et le relevé le dit. Le palier 2
    avance sans attendre : la tâche 6 n'est attendue par aucune autre.
13. **Le nombre de parties** : je recommande trente par scénario pour la course (environ 70 min), deux par voix pour
    la robustesse, et `N=3` avant la course (environ 7 min), sur secteur, veille coupée.

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
12. **Pour l'étape 5** : `synthese` et `poste` en texte ; `piper.exe` jamais pris à côté de sa voix (révisé après la
    tâche 0 : son chemin se donne dans `CHAINE_VOIX`) ; le cache des voix à copier ; Julie et Paul à vérifier
    là-bas ; le dossier d'une voix par `nomDe` ; `ff_siwa` aux limites.
    Repris en partie : le relevé donne le nom du poste et son processeur ; le secteur et la veille, que le code ne
    lit pas, sont écrits dans ce plan.
13. **Les mineurs** : un nom par partie, `<nom>#<k>` ; `releve-chaine.md` écrit pour le premier tour ; le critère
    « mêmes fichiers, plus `resultats.jsonl` » ; #67 sortie de l'étape (ancienne tâche 6) ; le critère sur les voix
    réécrit (aucun son ni modèle dans un dépôt, la voix nommée au relevé). Nuance : un nom par partie aide le journal,
    mais une ligne tardive du serveur peut encore porter le nom de la partie suivante ; la longueur gardée du journal
    (`chaine.test.ts:426-427`) les sépare déjà par position.

**Trouvé en reprenant les objections** : un `toux.wav` posé n'est jamais coupé à sa `duree` et sert les trois toux
sous le même nom (`sons.ts:111-114`, `nomDe`) ; la tâche 1 le coupe, comme un bruit.
