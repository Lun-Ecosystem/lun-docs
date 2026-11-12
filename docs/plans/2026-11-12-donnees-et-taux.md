# Les données et les taux : plusieurs voix, des hésitations, une toux sans personne, chaque scénario répété. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **À relire par le plan-challenger, puis à valider par CrOliX.** Écrit le 12/11. Rien n'est codé.
>
> **Deux paliers.** **Palier 1 : la tâche 0 seule**, jetable, qui mesure ce que la suite suppose : les voix qu'on
> peut atteindre, une toux synthétique, la variance de la chaîne sur dix passages, le coût d'une partie exacte.
> **Palier 2 : les tâches 1 à 8**, révisées avec ses mesures avant d'être validées.
>
> **PR :** celle de l'axe pour ce plan (lun-docs#162) ; celle de Lun'Luxuria s'ouvre avec le palier 2. Lun'Anima
> n'est pas touché.

**But :** qu'un scénario ne dise plus « ça a marché une fois », mais « ça tient tant de fois sur tant », avec la
voix de plusieurs personnes qui ne sont personne. La personne parle avec des voix de synthèse françaises, libres et
locales, autres que la sienne ; elle hésite et tousse à des instants que le scénario choisit, sans qu'aucun
enregistrement de personne n'entre dans un dépôt. Chaque scénario est rejoué ; le relevé donne un taux par scénario
et par attente, les échecs par espèce, par source et par voix, et pour chaque échec le déroulé de sa partie.

**Ce que cette étape règle.** Le cadrage le dit (§ 2, point 4) : ce qui tient à une course (une coupure, une
reprise, un essai retiré) passe une fois sur deux sans qu'on le voie. Trois suites de 25 attentes tenues ne disent
pas qu'une course rate une fois sur dix. Et la variété manque : toute la personne parle avec Hortense, et les quatre
scénarios de toux ne se jouent pas, faute de toux.

**Source :** le cadrage [« Prouver la présence sans l'oreille »](../specs/2026-11-11-banc-presence-cadrage.md),
validé par CrOliX le 11/11 (lun-docs#161) : § 3 (deux horloges, les seuils du banc français, des données françaises
fabriquées), § 4 pièce 4 (« Des données et des taux »), § 5 étape 4, § 7. Les plans exécutés
[des scénarios](2026-11-11-scenarios-presence.md) et [de la chaîne sur le laptop](2026-11-11-chaine-laptop.md), avec
ce que leur exécution a trouvé. Les issues `inbox` lun-luxuria#63, #67 à #72. Code relu sur `main` de Lun'Luxuria
(`8a7d99f`) et de Lun'Anima (`b457668`). Les relevés des suites 2, 2b et 2c dans `banc-sons/chaine/`. Références
relues le 12/11, rien lancé : Pipecat (`evals/release/README.md`, `src/pipecat/evals/results.py`,
`evals/release/scenarios/user_audio.yaml`), LiveKit Agents (`tests/fake_session.py`), AIRI
(`packages/testing-audio`) ; la liste des voix de Piper et leurs fiches (`rhasspy/piper-voices`, Hugging Face).

**Critères de fin du palier 1 :**

- Chaque mesure de la tâche 0 est écrite dans ce plan, avec sa valeur et ce qu'elle change au palier 2.
- Rien n'entre dans un dépôt : les scripts vivent dans `banc-sons/chaine/essai-taux/`, retirés à la fusion du
  palier 2. Les voix de Piper téléchargées le sont après l'accord de CrOliX, dans le dossier de Piper, hors dépôt.

**Critères de fin du palier 2 :**

- `CHAINE_REPETITIONS=N npm run chaine` joue chaque scénario jouable N fois, tour par tour, et la personne change de
  voix à chaque partie parmi `CHAINE_VOIX`. Sans ces variables, la suite est celle d'aujourd'hui : mêmes fichiers,
  même échec.
- Chaque partie écrit une ligne dans `resultats.jsonl` dès qu'elle finit. Une suite répétée écrit `releve-taux.md` :
  par scénario et par attente `tous`, un taux (tenues sur parties jouées, une `non_jouee` jamais comptée tenue) ; les
  échecs par espèce, par source et par voix ; pour chaque partie ratée, son fichier de déroulé et l'extrait du
  verdict ; pour chaque attente `exact` et chaque délai, la part dans la borne, la médiane, le 95e centile (à partir
  de vingt valeurs), le plus petit et le plus grand ; pour chaque phrase et chaque voix, la part transcrite juste et
  les variantes entendues.
- La personne parle avec au moins trois voix autres que la sienne, aucune tirée d'un enregistrement de personne.
  Aucun son n'est suivi par git (la CI le vérifie déjà).
- Les quatre scénarios de toux sont joués si la tâche 0 garde une toux synthétique ; sinon le relevé dit encore « son
  manquant », et ce plan dit pourquoi.
- lun-luxuria#72 : `couper-le-blanc` tient quand `tiny` entend « Arret. ». lun-luxuria#70 : ses attentes restent des
  mesures, avec leur distribution. Aucune borne n'est élargie.
- Si CrOliX les retient : `npm run tirages` joue chaque scénario au niveau exact sur N tirages des délais des
  briques fausses, dans les plages mesurées à la chaîne ; même relevé ; un tirage raté se rejoue par sa graine, au
  bit près.
- lun-luxuria#67 : `npm run mutations` lit des lignes JSON, plus le relevé Markdown.
- `npm test` ne change pas de durée de plus de cinq secondes : ni la chaîne ni les tirages n'y tournent.

| Dépôt, branche | Issue | PR | Niveau |
|---|---|---|---|
| `lun-luxuria`, `feat/taux-presence` | à ouvrir avec le palier 2 ; lun-luxuria#67, #70, #72 | à ouvrir | `standard` |
| `lun-docs`, `docs/deroule-tour` | la même ; la tâche 0 n'en ouvre pas | lun-docs#162 | `trivial` |

## Ce que le code fait aujourd'hui

**Lun'Luxuria**

- **Une partie par scénario.** `it.each` joue chaque scénario une fois (`chaine.test.ts:542-571`) et échoue sur une
  demande inattendue au faux modèle ou une attente qui ne passe pas (`:567-568`). La fin écrit `releve-chaine.md` et
  un `deroule-chaine-<nom>.jsonl` par scénario (`:404-414`). Le témoin par Chromium joue `deux-phrases` (`:565`). Le
  joueur écrit `serveur/partie.json` avant chaque partie (`:424`) : un fichier, une partie à la fois.
- **Une seule voix pour la personne.** `sonsDe(s, DIR, synthSapi)` (`chaine.test.ts:551`) : un son posé à la main,
  sinon le cache, sinon Hortense par `System.Speech` (`sons.ts:239-257`). La clé du cache est
  `sha256('sapi-hortense-16k\n' + texte)` dans `sons/sapi/` (`sons.ts:29`, `:96-109`). Les silences de tête et de fin
  sont rognés à un niveau fixe de 0,01 (`sons.ts:28`, `:62-78`).
- **Les hésitations s'écrivent déjà.** Un mot dans `dit`, un silence dans `trous` (`scenario.ts:141-142`) ; la
  chaîne coupe le texte au mot le plus proche de chaque silence et synthétise chaque morceau (`sons.ts:42-56`,
  `:117-129`). Aucun scénario n'a de mot d'hésitation ; `delai-a-l-essai` a un trou de 300 ms.
- **La toux manque.** Un `dit` entre parenthèses n'est pas synthétisé : « son manquant : toux.wav »
  (`sons.ts:116`) ; un bruit prend `bruit.wav` (`:141-146`). Quatre scénarios toussent (`toux-parole`, `toux-courte`,
  `toux-reflexion`, `toux-puis-parole`, qui a aussi un `bruits`, `toux-puis-parole.ts:25`).
- **Le juge et le relevé.** `juger(s, partie, 'chaine')` fait d'une attente `exact` une mesure (`judge.ts:302`), et
  nomme `transcription` quand le faux modèle choisit sur le texte reçu une autre réponse que sur le `dit`
  (`judge.ts:161-179`, `:334-346`). `releve()` compte les tenues et range les échecs par espèce et par source
  (`releve.ts:46-83`) ; `releveChaine` ajoute par scénario les phrases (`dit`, `entendu`, confiance), les délais
  exacts et de la chaîne, ce qui sonne (`releve.ts:132-269`). Aucun compte sur plusieurs parties.
- **Le niveau exact ne varie pas.** Le joueur pose l'horloge fausse à zéro (`player.ts:31-39`) ; la suite joue chaque
  scénario deux fois et exige deux déroulés égaux (`scenarios.test.ts:40-41`). Les délais des briques fausses sont
  des champs du scénario : `transcriptionMs` par parole (`fakes.ts:136`), `premierMotMs` et `entrePhrasesMs` par
  réponse (`fakes.ts:186-188`, `:198`), `syntheseMs` et `msParCaractere` pour sa voix (`fakes.ts:80-82`).
- **Le choix du faux modèle** : la première réponse dont `si` est contenu dans le texte reçu, sans accents ni casse
  (`scenario.ts:308-312`). `arrete-net.ts:27` et `couper-le-blanc.ts:28` répondent à `si: 'arrete'`. Dans
  `couper-le-blanc`, l'autre réponse a aussi un `si` : « Arret. » n'en choisit aucune, d'où `modele_inattendu`
  (lun-luxuria#72). Dans `arrete-net`, l'autre n'en a pas : « Arret. » la choisit, sans échec, mais le juge y voit une
  divergence.
- **Les mutations** lisent `releve-scenarios.md` colonne par colonne (`tools/mutations.mjs:18-44`), ce que
  lun-luxuria#67 veut remplacer par du JSON.
- **Le service de voix** n'a qu'une synthèse, la sienne (`voix/service.py:74-95`). Kokoro y est appelé avec la voix
  `ff_siwa` (`:94`).

**Lun'Anima**

- Le faux modèle choisit par la même règle (`core/src/testing/faux-modele.ts:110`) : un `si` changé dans un scénario
  vaut des deux côtés, sans rien toucher ici. Le serveur de la chaîne tourne sur une base en mémoire
  (`core/src/cli/chaine.ts`), jamais redémarré pendant une suite.

**Sur le laptop** (vérifié le 12/11, sans rien installer) :

- Voix de Windows : en SAPI, Hortense (et Zira, anglaise) ; en OneCore, Hortense, Julie et Paul.
- Le dossier de Piper (`../../piper` depuis Lun'Luxuria) : `piper.exe`, `espeak-ng.dll` et ses données, une seule
  voix (`fr_FR-siwis-medium`), qui est la sienne dans la chaîne (`chaine.test.ts:297`).
- `banc-sons/pipecat-fra/` : 122 phrases françaises du jeu de test de Pipecat, toutes de synthèse (`chirp3_1`),
  étiquetées finies ou non, avec une hésitation au milieu (82) ou à la fin (37), sans leur texte ; CC BY 4.0, déjà
  servies au plan [« la fin de phrase »](2026-11-11-fin-de-phrase.md).
- `banc-sons/chaine/` : les relevés et déroulés des suites 1, 1 small, 2, 2b, 2c. Aucun `toux.wav` ni `bruit.wav`.

**Déjà mesuré** (plan de la chaîne, « Ce que l'exécution a trouvé », et les relevés des suites) : une suite `tiny`
dure environ 140 s pour neuf parties et le témoin ; les déroulés de la suite 2c durent 4,2 à 12,2 s. Ce qui varie
d'une partie à l'autre : « Arrête », transcrit à une confiance de 0,37 à 0,43, rendu « Arret ? » ou « Arret. » 2 fois
sur 6 ; le silence de tête de Piper, de 0 à 190 ms, et la durée d'une même phrase, de 1506 à 1691 ms ; les mots
entendus à la coupure, à un près ; le blanc de tour, jusqu'à 130 ms. La transcription `tiny` dans la chaîne : 353 à
371 ms.

## Ce que les références apportent

- **Pipecat** (`evals/release/README.md`, « Repeating a run ») : `--repeat N` rend un taux par robot et par
  scénario ; les essais alternent (`A#1, B#1, C#1, A#2…`) pour que chacun voie la même machine ; chaque essai numérote
  ses fichiers ; les échecs sont rangés par espèce, tour et attente (`FAILURE_KINDS`, `results.py`) ; un tour
  `not_run` n'est jamais compté réussi, « counting those as passes would inflate any rate ». **Une suite répétée
  rend toujours 0** : elle mesure, le taux acceptable est à décider. Chaque essai écrit une ligne dans
  `results.jsonl` dès qu'il finit ; un essai raté y porte tous les événements vus.
- **Ce que Pipecat ne fait pas** : sa personne parle d'une seule voix (Kokoro `af_heart`, `user_audio.yaml`),
  gardée en cache ; aucun bruit n'est ajouté (rien de tel dans `src/pipecat/evals/`). Plusieurs voix et des bruits
  viennent du cadrage (§ 3, point 4) et d'EVA, qui n'a pas été cloné ni relu ici.
- **LiveKit** (`tests/fake_session.py:35-52`) : un `speed_factor` accélère le temps réel ; aucun délai tiré au
  hasard dans ses fausses briques ni dans ses tests de session. **AIRI** : rien sur la répétition ni sur la variété
  des voix dans `packages/testing-audio/src`. Tirer les délais au niveau exact est donc à nous, sans modèle à
  reprendre.
- **Les voix de Piper** (liste et fiches lues le 12/11) : sept modèles français. Les licences sont celles de leurs
  données, d'après leur fiche :

| Modèle | Locuteurs | Données, licence |
|---|---|---|
| `fr_FR-upmc-medium` | 2 : jessica, pierre | `upmc-pierre-data`, CC BY-SA 4.0 |
| `fr_FR-mls-medium` | 125 | Multilingual LibriSpeech, CC BY 4.0 |
| `fr_FR-gilles-low` | 1 | un jeu Kaggle à une voix, CC0 |
| `fr_FR-tom-medium` | 1 | AGPLv3 |
| `fr_FR-mls_1840-low` | 1 | fiche non lue |
| `fr_FR-siwis-low`, `fr_FR-siwis-medium` | 1 | sa voix dans la chaîne, exclue |

- **Unmute** (cadrage § 3) rend médiane, 90e et 95e centiles d'un client de charge : il n'est pas cloné ici et n'a
  pas été relu. Le calcul des centiles de ce plan ne s'en inspire pas.

## Palier 1 : la tâche 0

0. - [ ] **Ce que la suite suppose, mesuré** (`testeur`, des scripts jetables dans `banc-sons/chaine/essai-taux/`,
   hors git ; rien dans un dépôt). Seule.
   1. **Julie et Paul.** `System.Speech` ne les voit pas. Les atteindre par WinRT
      (`Windows.Media.SpeechSynthesis.SpeechSynthesizer`) depuis PowerShell 5.1, un script fixe, le texte sur l'entrée
      standard : marche-t-il, quel format, quelle fréquence, quel temps par phrase.
   2. **Piper pour la personne.** `piper.exe` du poste, avec `--model`, `--speaker`, `--output_file` et le texte sur
      l'entrée standard (ses options sont à vérifier, pas supposées). Après l'accord de CrOliX, télécharger
      `fr_FR-upmc-medium` et `fr_FR-mls-medium` dans le dossier de Piper, et écrire ici leur taille.
   3. **Chaque voix sur nos phrases.** Hortense, Julie, Paul, jessica, pierre, et six locuteurs de MLS pris au hasard.
      Pour chacune, les `dit` distincts des treize scénarios jouables à la chaîne, et trois mots d'hésitation
      (« euh », « ben », « hum ») : `tiny` cinq fois (texte, confiance, part juste au sens de
      `nomDe(entendu) === nomDe(dit)`, `sons.ts:32`) ; Silero par `replay()` (première trame de voix, un bloc ou
      plusieurs, tenue à 384 ms) ; la durée réelle contre `duree` ; le rognage à 0,01 sur ce que chaque voix met en
      tête et en fin.
   4. **Une toux synthétique.** Trois ou quatre façons, sans personne : un souffle filtré à attaque franche et
      descente rapide ; deux souffles ; un souffle sur une impulsion grave voisée. À 300 et à 450 ms. Pour chacune :
      Silero la tient-il 400 ms à 450 ms, et pas à 300 ? `tiny` la rend-il vide cinq fois sur cinq (un « Merci. »
      inventé n'est pas vide) ? Gardée si une façon a les deux.
   5. **La variance de la chaîne.** Dix passages de la suite d'aujourd'hui (Hortense, `tiny`) par une boucle, les
      relevés gardés : le taux de chaque attente `tous`, compté à la main ; le plus petit et le plus grand de chaque
      délai de brique (transcription, premier mot, synthèse de Piper, durée par caractère, silence de tête) ; la
      durée de chaque partie et de la mise en route ; le serveur de la chaîne après dix passages (mémoire, jeton
      encore valable, taille du journal).
   6. **Un passage par voix gardée**, pour voir les échecs qu'elle fait naître et sa durée.
   7. **Le coût d'une partie exacte** : `scenarios.test.ts` chronométré, puis trois scénarios rejoués à la main aux
      bords des plages du point 5, pour voir si leurs attentes `tous` tiennent.
   8. **`si: 'arret'`** contre chaque transcription de « Arrête » vue aux points 3, 5 et 6.
   - **Ce qu'elle installe**, hors dépôt : les deux voix de Piper, après accord. Rien d'autre.
   - **Ce qu'elle rend** : une section « Ce que la tâche 0 a mesuré » dans ce plan, et pour chaque choix du palier 2
     s'il tient, change ou tombe.

## Palier 2 : les choix **[avis]**

À réviser avec les mesures de la tâche 0.

### Les voix de la personne

**Les trois voix de Windows et deux à cinq voix de Piper, jamais la sienne.**

- **Hortense** est déjà là. **Julie et Paul**, si la tâche 0 les atteint : une femme et un homme de plus, sans rien à
  télécharger.
- **jessica et pierre** (`fr_FR-upmc-medium`) : un seul fichier, deux voix, une femme et un homme. **MLS** : 125
  lecteurs dans un seul fichier, pour en garder deux ou trois, choisis sur les mesures du point 3, pas à l'oreille.
- **Exclues** : siwis, sa voix dans la chaîne (le cadrage veut des voix « différentes de la sienne ») ; Kokoro, dont
  la seule voix française vient, à ma connaissance, du même corpus SIWIS (non vérifié ici) ; espeak-ng, robotique,
  et sans exécutable sur le poste ; `fr_FR-tom-medium`, une voix de plus sous AGPLv3, inutile avec upmc et MLS.
  `fr_FR-gilles-low` (CC0) reste en réserve : sa qualité est la plus basse.
- **Une voix que `tiny` transcrit mal** reste mesurée (sa part juste au relevé) ; si ses échecs viennent tous de la
  transcription, elle sort de la rotation et le plan le dit.
- **Ce qui ne change pas** : le texte sur l'entrée standard, jamais dans la ligne de commande (`sons.ts:235-238`) ;
  chaque son de synthèse en cache, dans `banc-sons`, par voix ; Piper hors du dépôt. Les voix de Windows sont sous
  la licence de Windows, pour un usage personnel ; leurs sons ne quittent pas le poste.

### Les hésitations

**Écrites dans le scénario, dites par chaque voix.** Le format les porte déjà : un mot dans `dit`, un silence dans
`trous`, à l'instant que le scénario choisit. Rien à coder. Ce qu'on ignore : comment chaque voix dit « euh »
(tâche 0, point 3).

**Un scénario de plus**, `hesite-puis-demande`, si la tâche 0 montre que les voix disent « euh » comme une voix :
« Tu peux me lire, euh, la liste des courses », un silence de 400 ms après « euh », entre la pause de l'essai
(160 ms) et le silence de fin (700 ms). Il attend, en `tous` : un essai à l'hésitation, retiré quand la voix revient ;
l'essai de la fin confirmé ; une seule réponse qui sonne, rien de l'essai retiré. Son apport sur `delai-a-l-essai` :
l'hésitation est un mot, et l'essai part sur un texte qui finit par « euh », dont la vraie transcription fait ce
qu'elle veut.

Les 122 phrases de `banc-sons/pipecat-fra` ne servent pas ici : leur texte manque, et leurs hésitations visent
l'épreuve « tenir une pause » du banc français, qui attend le modèle de fin de phrase, sur une branche non fusionnée
(`feat/fin-de-phrase`). La longueur de leurs pauses n'a pas été mesurée.

### La toux, sans personne

Une toux, pour nos scénarios, a deux propriétés : Silero l'entend comme une voix assez longtemps pour la tenir
(450 ms : une tenue ; 300 ms : aucune), et la transcription la rend vide (verdict `bruit`). Un « hum hum » de synthèse
serait sans doute entendu comme une voix, mais transcrit en mots (tâche 0, point 3) : verdict `pour_elle`, elle
serait coupée au lieu de reprendre. Un souffle peut n'être pas entendu du tout.

**Une toux synthétique si la tâche 0 en trouve une qui a les deux ; sinon la sienne.** Gardée, elle devient
`toux(duree, graine)` dans `sons.ts`, tirée d'un bruit à graine fixe, qui sert quand ni `toux.wav` ni `bruit.wav`
n'est posé ; le relevé dit si chaque son est posé, en cache, synthétisé ou synthétique. Sinon, la toux reste à
CrOliX : une prise à lui, gardée dans `banc-sons`, ou un fichier CC0 qu'il choisit (Freesound en a ; non vérifié
ici). Aucun autre bruit (clic, porte, fond sonore) : aucun scénario n'en demande.

### Où répéter : la chaîne, et des tirages au niveau exact

**La chaîne d'abord**, parce que c'est là que les choses varient : la transcription, Piper, Silero, le processeur.
Elle a deux défauts : elle est lente (environ 13 s par partie, voir plus bas), et un échec ne se rejoue pas, le
prochain tirage de `tiny` ou de Piper sera autre.

**Des tirages au niveau exact, en plus, si CrOliX les retient.** Le niveau exact est déterministe par construction ;
il le reste. Une partie y coûte de l'ordre d'un dixième de seconde (estimé sur la durée des mutations, mesuré à la
tâche 0). Je propose d'y tirer, partie par partie, les délais des briques fausses dans les plages que la chaîne a
mesurées (tâche 0, point 5), jamais au-delà : la transcription de chaque parole, le premier mot et le blanc entre
phrases de chaque réponse, la synthèse et la durée par caractère de sa voix. Ce sont des champs du scénario :
`tirer(s, graine)` rend un autre scénario, données seules, que le joueur exact joue sans changer. Une graine rend
toujours le même scénario : un échec se rejoue au bit près et se lit avec les briques fausses. Les attentes `exact`
y deviennent des mesures, comme à la chaîne : leurs bornes valent pour les délais par défaut.

Ce que les tirages ne prouvent pas : la forme des vraies distributions (tirées uniformes entre le plus petit et le
plus grand vus), ni qu'une combinaison tirée arrive vraiment. Un tirage raté se lit avant de devenir une issue : une
ancre trop juste est un défaut du scénario, pas du code.

### Combien de parties, en combien de temps

- **Ce qu'un taux de 100 % dit** : zéro échec sur N parties met l'échec sous 3/N, à 95 % (la règle de trois). Dix
  parties : sous 30 %. Trente : sous 10 %. Cent : sous 3 %.
- **Ce qu'une course coûte à trouver** : une course qui rate une partie sur dix se montre au moins une fois en trente
  parties, 96 fois sur 100 ; une course qui rate une fois sur deux, en cinq parties, 97 fois sur 100.
- **Le temps sur le laptop** : environ 13 s par partie, mise en route comprise (estimé : 140 s pour neuf parties et
  un témoin de 23 s ; mesuré à la tâche 0). Un tour des neuf scénarios jouables : 2 min ; des treize, avec la toux :
  3 min. Trente parties par scénario : une heure, une heure et demie avec la toux, en tâche de fond.
- **Une partie à la fois** : `partie.json` est unique (`chaine.test.ts:424`), et la transcription partage le
  processeur avec Chrome : deux parties à la fois se mesureraient l'une l'autre.
- **[avis] Trente parties par scénario à la chaîne**, les voix tour à tour (dix par voix avec trois voix) ;
  `N=1` reste l'essai rapide. **Cinquante tirages par scénario** au niveau exact : 850 parties, de une à quatre
  minutes estimées, mesurées à la tâche 0.
- **Le disque** : un déroulé pèse environ 6 Ko (suite 2c) ; trente parties de treize scénarios, environ 2,5 Mo.
  Chaque partie garde le sien.

### Ce qu'est un taux

- **Une partie** : un scénario joué une fois, avec une voix (chaîne) ou une graine (tirage).
- **Une partie tenue** : toutes ses attentes `tous` passent (`passe`, `judge.ts:52-53`), et le faux modèle n'a reçu
  aucune demande inattendue (`chaine.test.ts:567`). **Le taux d'un scénario** : parties tenues sur parties jouées, en
  tout et par voix.
- **Le taux d'une attente `tous`** : tenues sur parties où le scénario a été joué. Une `non_jouee` n'est jamais
  tenue ; elle est comptée à part, comme le `not_run` de Pipecat.
- **Un défaut connu** (`connus`), sur plusieurs parties : compté connu là où il se montre, tenu là où il ne se montre
  pas, son taux donné ; il n'entre pas dans le taux de la partie.
- **Une attente `exact`** : la part de ses parties dans sa borne, et la distribution de `trouve`.
- **Un délai** : par tour, la médiane, le 95e centile s'il y a au moins vingt valeurs, le plus petit, le plus grand.
  Jamais une moyenne seule (cadrage § 3, point 2).
- **La transcription** : par phrase et par voix, la part juste (`nomDe(entendu) === nomDe(dit)`) et chaque variante
  entendue, avec son compte.
- **Les échecs** : par espèce et par source, comme aujourd'hui (`releve.ts:62-64`), et par voix.
- **Le déroulé de chaque échec** : chaque partie garde son fichier ; le relevé liste les parties ratées avec leur
  rang, leur voix ou leur graine, l'attente, l'espèce, la source, la valeur, le fichier et l'extrait du verdict.

### Ce qui fait échouer une suite répétée

**La règle de Pipecat.** `N=1` ne change pas : une attente `tous` ratée ou une demande inattendue fait échouer la
suite. `N>1` mesure : la commande rend 0, sauf si aucune partie n'a été jouée ; une partie qui lève une erreur hors
du juge compte ratée, d'espèce `joueur`, et la suite continue ; la dernière ligne dit combien d'attentes `tous` sont
sous 100 %, et dans quels scénarios. Une attente sous
100 % dont la source est un mécanisme de la page devient une issue, jamais une borne élargie, comme aujourd'hui. Les
tirages suivent la même règle, et ne vont pas dans la CI (voir « À trancher »).

### lun-luxuria#72 : « Arret. »

**Le `si` de la réponse à « Arrête » devient `arret`**, dans `arrete-net.ts:27` et `couper-le-blanc.ts:28`. Le faux
modèle tient la place d'un modèle qui comprend « Arret. » comme « Arrête » ; Lun'Anima applique la même règle
(`faux-modele.ts:110`). Ce n'est pas une borne : `si` dit ce que le faux modèle comprend, pas ce qu'on attend de la
page. Le niveau exact ne bouge pas (sa transcription rend le `dit`), vérifié une fois en comparant les déroulés
d'avant et d'après. Ce que `tiny` coûte n'est pas caché : le relevé donne la part juste de chaque phrase, par voix.
Un autre `si` qu'une voix gardée casse à la tâche 0 suit la même règle (la racine du mot), écrit dans ce plan.

L'autre voie : garder `arrete` et compter l'échec, de source `transcription`. Chaque suite répétée rapporterait alors
un échec qui n'est pas celui de notre code.

### lun-luxuria#70 : les attentes `exact` trop justes pour la chaîne

**Elles restent des mesures.** Le relevé des taux donne, pour chacune, la part dans sa borne et la distribution de ce
qu'elle trouve : « trois mots entendus, à un près », « `sortie-arretee` à −2 ms ». C'est ce que l'issue demande de
voir. Ajouter une attente `tous` plus large serait élargir une borne sous un autre nom. L'issue se ferme avec le
premier relevé des taux.

### lun-luxuria#67, au passage

Une ligne par partie sert aussi les mutations : en mode `scenarios`, la suite écrit `resultats.jsonl` à côté de
`releve-scenarios.md`, et `tools/mutations.mjs` le lit à la place du Markdown.

## Palier 2 : les contrats

### Une ligne par partie

`resultats.jsonl`, réécrit à chaque lancement, une ligne ajoutée dès qu'une partie finit : une suite arrêtée garde
les lignes de ses parties. Le type vit dans `src/presence/taux.ts`.

```ts
interface Resultat {
  suite: string;                     // l'heure du lancement, ISO
  lieu: 'exact' | 'chaine' | 'tire';
  scenario: string;
  rang: number;                      // de 1
  voix?: string;                     // à la chaîne : `hortense`, `piper:fr_FR-upmc-medium#pierre`…
  graine?: number;                   // en tirage
  transcription?: string;            // `faster:tiny`
  synthese?: 'piper' | 'fausse';
  dureeMs?: number;                  // à la chaîne : la durée réelle de la partie
  verdicts: (Omit<Verdict, 'couverture' | 'extrait'> & { extrait?: string[] })[];  // l'extrait : échecs seuls
  delais: { tour: number; ms: Partial<Record<DelayName, number>>; synthese: number[] }[];  // `delays()`
  phrases?: { parole: number; dit: string; entendu?: string; confiance?: number; son: string }[];
  inattendus: number;                // demandes au faux modèle sans réponse prévue
  deroule?: string;                  // le nom du fichier
  raison?: string;                   // un scénario non joué
}
```

### Les variables et les fichiers

| Variable | Par défaut | Rôle |
|---|---|---|
| `CHAINE_REPETITIONS` | `1` | parties par scénario, à la chaîne |
| `CHAINE_VOIX` | `hortense` | ses voix tour à tour : `hortense`, `julie`, `paul`, `piper:<modèle>[#<locuteur>]` |
| `CHAINE_STT`, `CHAINE_TTS`, `CHAINE_SCENARIOS` | inchangées | `piper.exe` est pris à côté du modèle de `CHAINE_TTS` |
| `TIRAGES_N` | `50` | tirages par scénario, au niveau exact |
| `TIRAGE` | | `<nom>:<graine>` : rejoue un seul tirage |

| Fichier, dans `BANC_DIR` | Écrit par | Quand |
|---|---|---|
| `chaine/resultats.jsonl` | `npm run chaine` | toujours |
| `chaine/releve-chaine.md`, `chaine/deroule-chaine-<nom>.jsonl` | `npm run chaine` | `N=1`, comme aujourd'hui |
| `chaine/releve-taux.md`, `chaine/deroule-chaine-<nom>-<rang>.jsonl` | `npm run chaine` | `N>1` |
| `chaine/sons/<voix>/<empreinte>.wav` | `sonsDe` | le cache d'une voix ; Hortense garde `sons/sapi/` |
| `tirages/resultats.jsonl`, `tirages/releve-tirages.md` | `npm run tirages` | toujours |
| `tirages/deroule-tirage-<nom>-<graine>.jsonl` | `npm run tirages` | un tirage raté |
| `scenarios/resultats.jsonl` | `npm run scenarios`, les mutations | toujours |

## Les scénarios à ce niveau

| Scénario | Répété à la chaîne | Pourquoi |
|---|---|---|
| les neuf joués aujourd'hui | oui, chaque voix tour à tour | |
| les quatre `toux-*` | oui si une toux est gardée ou posée | sinon « son manquant », comme aujourd'hui |
| `hesite-puis-demande` (nouveau) | oui, si la tâche 0 le garde | |
| `aparte-parole-longue`, `phrase-ecartee`, `echo-fort`, `delai-modele-lent` | non | `chaine.test.ts:120-130` |

En tirage, les dix-sept (ou dix-huit) scénarios sont joués : le niveau exact les joue tous.

## Palier 2 : les tâches

**En parallèle d'emblée** : 1, 3 et 5. Puis 2 après 1 (même fichier) ; 4 après 1 et 3 ; 6 et 7 après 3 ; 8 en
dernier. Les tâches 4 et 7 ajoutent chacune une ligne au `CLAUDE.md` et au `.gitignore`, et 7 une au
`package.json` : la seconde reprend la première.

1. - [ ] **Les voix de la personne** (`src/presence/chaine/sons.ts`, `sons.test.ts`, `dev-luxuria`).
   *Parallélisable.*
   - `type Voix = { nom: string; synth: Synth }` ; `sonsDe(s, dir, voix)` à la place de `synth`
     (`sons.ts:137`). La clé et le dossier du cache prennent `voix.nom` (`dire`, `sons.ts:96-109`) ; Hortense garde
     `sapi-hortense-16k` et `sons/sapi/`, pour que le cache d'aujourd'hui serve encore.
   - `synthOneCore(nom)` : comme `synthSapi`, un script fixe par `-EncodedCommand` (le WinRT de la tâche 0), le texte
     sur l'entrée standard ; une voix absente, une erreur qui la nomme.
   - `synthPiper(modele, locuteur?)` : `piper.exe` à côté du modèle de `CHAINE_TTS`, des arguments fixes, sans shell,
     le texte sur l'entrée standard ; le WAV rendu lu par `readWav`, qui rééchantillonne (`replay.ts:25`) ; le
     locuteur retrouvé par son nom dans `<modele>.onnx.json`.
   - `voixDe(spec, tts)` lit une entrée de `CHAINE_VOIX`, et refuse sa voix (le même modèle, le même locuteur que
     `CHAINE_TTS`).
   - Le rognage (`sons.ts:28`, `:62-78`) : inchangé, sauf si la tâche 0 trouve une voix qu'il coupe mal.
   - Tests (synthèse injectée) : le cache par voix, celui d'Hortense gardé, la lecture et les refus de `voixDe`, le
     locuteur lu dans un `.onnx.json` écrit à la main. Exclu : lancer une vraie synthèse dans `npm test`.
2. - [ ] **La toux synthétique** (`src/presence/chaine/sons.ts`, `sons.test.ts`, `dev-luxuria`). Après 1, et
   seulement si la tâche 0 garde une façon.
   - `toux(duree, graine)` : la façon que la tâche 0 a gardée, écrite comme ses mesures la décrivent, tirée d'un
     bruit à graine fixe. Un `dit` entre parenthèses (`sons.ts:116`) et un bruit (`:141-146`) la prennent quand
     `toux.wav` ou `bruit.wav` n'est pas posé ; `SonPret.source` dit `toux`.
   - Le relevé écrit la source de chaque son de la personne.
   - Tests : la même graine rend les mêmes échantillons, la durée demandée, rien de rogné en tête.
3. - [ ] **Une ligne par partie, et le relevé des taux** (`src/presence/taux.ts`, `taux.test.ts`, `dev-luxuria`).
   *Parallélisable.*
   - Le type `Resultat` du contrat ; `resultat(...)` qui le tire d'une `Jouee` (`releve.ts:86-101`) ou d'une partie
     exacte jugée ; `releveTaux(lignes, titre)`, pure, qui écrit tout ce que dit « Ce qu'est un taux » : en tête le
     nombre de parties, les voix, la transcription, la durée, et la phrase de la règle de trois ; puis par scénario
     et par attente.
   - Elle reprend `delays()`, `passe`, `nomDe` et les aides de `releve.ts` (`compte`, `parCle`, `table`), exportées,
     pas recopiées.
   - Tests, sur des lignes écrites à la main : une `non_jouee` jamais tenue ; un `connus` qui se montre une fois sur
     trois ; pas de 95e centile sous vingt valeurs ; les échecs par espèce, par source et par voix ; la part juste et
     les variantes ; le fichier et l'extrait d'une partie ratée ; un relevé entier comparé ligne à ligne.
   - Exclu : lire un fichier ; le navigateur.
4. - [ ] **Répéter à la chaîne** (`src/presence/chaine.test.ts`, `releve.ts`, `dev-luxuria`). Après 1 et 3.
   - `CHAINE_REPETITIONS` et `CHAINE_VOIX`. L'ordre : le tour k joue chaque scénario une fois, comme Pipecat ; la
     partie k d'un scénario prend la voix k modulo le nombre de voix. Un nom de test par partie
     (`<nom> #<k> <voix>`).
   - Les sons de chaque voix par `sonsDe` (le cache) ; `Jouee` gagne `voix` et `rang`, que `releveChaine` écrit.
   - Après chaque partie, une ligne dans `resultats.jsonl`. Les déroulés : à `N=1`, les noms d'aujourd'hui ; à
     `N>1`, suffixés du rang.
   - Le témoin, une seule fois, au premier tour.
   - `N=1` : les `expect` d'aujourd'hui (`chaine.test.ts:567-568`) et `releve-chaine.md`. `N>1` : aucun `expect`
     sur les verdicts ; une partie qui lève une erreur compte ratée (`joueur`) et la suite continue ; à la fin,
     `releve-taux.md` et la ligne de résumé ; la suite échoue seulement si aucune partie n'a été jouée.
   - Une ligne au `CLAUDE.md` et au `.gitignore` (`releve-taux.md`, `resultats.jsonl`).
   - Tests, sans navigateur : l'ordre des parties et la rotation des voix, les noms de fichiers, `N=1` inchangé.
   - Exclu : jouer deux parties à la fois ; reprendre une suite arrêtée.
5. - [ ] **Les scénarios** (`src/presence/scenarios/`, `testeur`). Après la tâche 0. *Parallélisable.*
   - lun-luxuria#72 : `si: 'arret'` dans `arrete-net.ts:27` et `couper-le-blanc.ts:28`, et tout autre `si` qu'une
     voix gardée casse à la tâche 0, par la racine du mot, listé dans ce plan. Le garde-fou : les déroulés exacts
     d'avant et d'après comparés une fois, ligne pour ligne, le résultat écrit ici.
   - `hesite-puis-demande.ts`, si la tâche 0 le garde : données seules, son calcul à la trame en commentaire, `tous`
     pour ce que la chaîne doit tenir, `exact` pour les bornes à la trame. Le compte de `scenarios.test.ts:29-31`
     passe à dix-huit.
   - Exclu : changer une borne ; changer un mécanisme pour qu'un scénario tienne : un écart devient une issue.
6. - [ ] **Les mutations lisent des lignes** (lun-luxuria#67 ; `src/presence/scenarios.test.ts`,
   `tools/mutations.mjs`, `dev-luxuria`). Après 3.
   - En mode `scenarios`, `resultats.jsonl` à côté de `releve-scenarios.md` : une ligne par scénario, `lieu: 'exact'`,
     rang 1, par `resultat(...)`.
   - `mutations.mjs` lit ce fichier : un échec est un verdict qui ne passe pas, hors des mesures. La lecture du
     Markdown et sa vérification (`mutations.mjs:14-44`) partent ; la sortie reste la même.
   - Preuve : `npm run mutations` rend les mêmes huit verdicts qu'avant, recopiés ici.
7. - [ ] **Les tirages au niveau exact** (`src/presence/tirage.ts`, `tirage.test.ts`, `tirages.test.ts`,
   `judge.ts`, `scenario.ts`, `dev-luxuria`). Après 3, et seulement si CrOliX les retient.
   - `TIRAGES` : les plages de la tâche 0 (point 5), chacune commentée de sa mesure ; un écart autour de la valeur du
     scénario pour `premierMotMs` et `entrePhrasesMs`, une plage pour `transcriptionMs` et `syntheseMs`, un rapport
     pour `msParCaractere`.
   - `tirer(s, graine): Scenario`, pure, données en entrée et en sortie, avec un petit générateur à graine. Tirés :
     chaque `Parole.transcriptionMs`, chaque `Reponse.premierMotMs` et `entrePhrasesMs`, `voix.syntheseMs` et
     `voix.msParCaractere`. Rien d'autre : ni `duree`, ni `modeleMs`, ni les délais fixes de `DEFAUTS`.
   - `Lieu` gagne `'tire'` (`scenario.ts:195`) : `juger` y fait des attentes `exact` des mesures (`judge.ts:302`) ;
     les refus propres à la chaîne de `charger` restent à `'chaine'` (`scenario.ts:406-422`).
   - `tirages.test.ts`, `npm run tirages` : il ne joue qu'en mode `tirages`, comme `chaine.test.ts:293`, jamais
     dans `npm test`. Chaque scénario sur `TIRAGES_N` graines ; les lignes et `releve-tirages.md` par `releveTaux` ;
     un tirage raté garde son déroulé ; `TIRAGE` rejoue un seul tirage. Une ligne au `CLAUDE.md` et au `.gitignore`.
   - Tests : une graine rend toujours le même scénario ; chaque champ dans sa plage ; le scénario tiré passe
     `charger` et `JSON.stringify` ; en `'tire'`, une `exact` ratée est une mesure, une `tous` ratée échoue.
   - Exclu : la CI ; tirer au-delà des plages mesurées.
8. - [ ] **Les premières suites, et le plan coché** (`testeur`). Après tout le reste.
   - [ ] `CHAINE_REPETITIONS=30` avec les voix gardées ; `npm run tirages` si les tirages sont retenus. Recopier
     ici, sous « Ce que l'exécution a trouvé » : les taux, les échecs par espèce, source et voix, les distributions,
     la transcription par voix, les durées.
   - [ ] Une issue par écart d'un mécanisme, et un `connus` qui la nomme ; jamais une borne élargie.
     lun-luxuria#70 et #72 fermées avec le relevé, si elles tiennent.
   - [ ] Relecture séparée du diff, la PR en brouillon ; la feuille de route mise à jour.
   - [ ] Les scripts de la tâche 0 retirés de `banc-sons`, à la fusion.

## Hors périmètre

- Corriger ce que les taux trouvent : une issue par écart. lun-luxuria#63 (elle reprend par-dessus une phrase qui
  suit une toux) est un défaut de mécanisme ; son correctif a son propre chantier.
- lun-luxuria#68, #69, #71 : non touchées. Le relevé des taux montrera #71 (`synthese-pendant` jamais jouée) à
  chaque partie.
- Le desktop, la fenêtre Tauri, le petit mode, l'écho, whisper-server, le vrai modèle, RVC : l'étape 5.
- Les épreuves d'hésitation au-delà de 700 ms (« tenir une pause ») : elles attendent le modèle de fin de phrase.
- Un fond de bruit sous la parole, le débit des voix, les bruits autres que la toux.
- Une voix de personne : ni Common Voice ni aucun enregistrement, hors ses prises déjà dans `banc-sons`.
- Jouer deux parties à la fois ; reprendre une suite arrêtée (ses lignes restent).
- Garder le son des deux voies d'une partie ratée : son oreille n'ajoute rien sur cet axe.
- Les tirages dans la CI.

## Limites

- Les taux sont ceux du laptop : `tiny` sur son processeur, pas whisper-server sur la RX.
- Trente parties sans échec mettent l'échec sous 10 %, elles ne disent pas qu'il n'existe pas.
- Les voix sont propres, lues, sans accent, sans pièce ni micro : la sonde pose le son dans la page. Une hésitation
  lue par une synthèse n'est pas quelqu'un qui cherche ses mots.
- Les tirages supposent des délais uniformes entre le plus petit et le plus grand vus ; une combinaison tirée peut
  n'arriver jamais.
- Non mesuré, estimé : 13 s par partie à la chaîne (d'après la suite 2c) ; un dixième de seconde par partie exacte
  (d'après la durée des mutations). La tâche 0 les mesure.
- Non vérifié : que WinRT atteigne Julie et Paul depuis PowerShell 5.1 ; les options de `piper.exe` du poste ; le
  nombre d'hommes et de femmes parmi les 125 lecteurs de MLS ; la licence de `fr_FR-mls_1840-low` ; qu'un CC0 de
  Freesound convienne. Kokoro : `voix/service.py:94` nomme la voix `ff_siwa`, là où sa voix française s'appelle, à
  ma connaissance, `ff_siwis` ; aucun fichier de voix de Kokoro sur le laptop pour le vérifier, hors de ce plan.
- Unmute et EVA ne sont pas relus : leur façon de compter les centiles et d'ajouter du bruit n'est pas comparée.
- Un long passage sur le même serveur de la chaîne (sa base en mémoire, son jeton) n'a jamais été fait : tâche 0,
  point 5.

## Ce qui reste pour l'étape 5, le desktop

- La même commande et le même relevé des taux, avec le vrai modèle, whisper-server sur la RX et sa vraie voix
  (Piper ou Kokoro, puis RVC), dans la fenêtre Tauri : le petit mode (`aparte-parole-longue`, `phrase-ecartee`) et
  l'écho (`echo-fort`), par de vrais haut-parleurs, un vrai micro et l'annulation d'écho.
- Ce qui s'entend vraiment, au-delà de la sortie du graphe.
- Ses prises de `banc-sons` comme voix de la personne, à côté des voix de synthèse.
- Les budgets par étape de la veille (transcription sous 300 ms, première phrase sous 700 ms…) en seuils sur les
  médianes et les 95e centiles du relevé.
- La liste d'écoute retirée de la feuille de route.

## À trancher par CrOliX

**Maintenant, pour lancer le palier 1 :**

- **La tâche 0**, avec ce qu'elle télécharge hors dépôt : `fr_FR-upmc-medium` et `fr_FR-mls-medium`, dans le dossier
  de Piper. Je recommande oui : `piper.exe` est déjà là, ce sont deux fichiers, et rien d'autre n'est installé.
- **La toux** : je recommande d'essayer d'abord la toux synthétique (point 4). S'il préfère, une prise à lui ou un
  fichier CC0 qu'il choisit peut être posé en même temps, dans `banc-sons`.

**Après la tâche 0, pour valider le palier 2** (chaque recommandation révisée avec ses mesures) :

- **Les voix** : je recommande Hortense, Julie, Paul, jessica et pierre, plus deux ou trois lecteurs de MLS, si
  `tiny` les transcrit aussi bien qu'Hortense.
- **Les tirages au niveau exact** : je recommande oui, à la demande, hors de la CI. Ils trouvent une course vite et
  la rejouent au bit près ; ils ne coûtent qu'un champ de plus dans le juge et une fonction pure. La CI se décidera sur
  leur durée mesurée.
- **Ce qui fait échouer une suite répétée** : je recommande la règle de Pipecat. `N=1` échoue comme aujourd'hui ;
  `N>1` mesure, rend 0, et dit en dernière ligne ce qui est sous 100 %.
- **lun-luxuria#72** : je recommande `si: 'arret'`. Le faux modèle comprend ce qu'un vrai comprendrait ; ce que
  `tiny` coûte se lit dans la part juste de chaque phrase.
- **lun-luxuria#70** : je recommande de garder ces attentes en mesures, avec leur distribution, sans attente `tous`
  plus large.
- **Le nombre de parties** : je recommande trente par scénario à la chaîne, les voix tour à tour, et cinquante
  tirages par scénario.
- **`hesite-puis-demande`** : je recommande de l'écrire si les voix disent « euh » comme une voix.
