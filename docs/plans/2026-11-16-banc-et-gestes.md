# Le banc et les mots des gestes. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** une issue chapeau à ouvrir dans lun-luxuria (voir la fin) ; lun-luxuria#6, #67 à #71, #73 à #75, et un
> point de lun-luxuria#81. Lun'Anima : sa part du core va dans une issue de lun-anima, à ouvrir.
>
> **État : rédigé le 16/11, à relire par le plan-challenger, puis à valider par CrOliX.**
>
> **PR :** lun-docs, branche `docs/banc-et-gestes`, pour ce plan, puis l'ADR de la règle et la ligne B1 de la feuille
> de route. Celle de Lun'Luxuria s'ouvre avec la première tâche de code, après la fusion de lun-luxuria#82.

**But :** que la voix ne tranche une carte que sur une règle mesurée. D'abord remettre le banc d'aplomb : ses
observations en `inbox`, et la chaîne qui prend la synthèse sans rien dire quand un son posé manque. Puis mesurer ce
que la transcription en service fait des mots des gestes, et de ce qui leur ressemble, avec les cinq voix du banc et
les prises de CrOliX. Puis CrOliX tranche la règle, et le verrou de l'ADR 0011 avec elle. Aucune vraie carte avant.

**Ce que ce chantier règle :**

- **Le banc** (lun-luxuria) : les mutations lisent un relevé Markdown (#67) ; `voix/test_service.py` ne tourne nulle
  part (#68) ; le témoin de Chromium s'écarte de la sonde (#69) ; des attentes `exact` trop justes pour la chaîne
  (#70) ; `synthese-pendant` jamais jouée à la chaîne (#71) ; une parole ancrée sur un envoi qui ne vient pas attend
  90 s (#73) ; aucune attente sur un nombre d'événements (#74) ; le résumé tu sous un agent (#75) ; la chaîne qui joue
  la synthèse quand le « non » posé manque (le dernier point de #81).
- **Les mots des gestes** : lun-luxuria#6 (`critique`).
- **La toux** : la tâche 6 du plan [des données et des taux](2026-11-12-donnees-et-taux.md), restée ouverte. Les
  quatre scénarios de toux ne se jouent pas à la chaîne.

**Source :**

- La [feuille de route](2026-11-07-feuille-de-route-mvp.md), § 3, « L'ordre du 12/11 » et « Le banc et les mots des
  gestes » : « Le banc d'abord : ses observations en `inbox` (lun-luxuria#67 à #71, #73 à #75 ; #72 est fermée). Puis
  les mots des gestes […]. Un chantier court les mesure au banc avec cinq voix, puis la règle se tranche, et le verrou
  de l'ADR 0011 avec elle (B1). Aucune vraie carte avant. » § 2, B1 : « Le verrou ne se lève qu'après le chantier des
  mots des gestes : cinq voix au banc, puis la règle ; aucune vraie carte avant (tranché le 12/11, § 3). »
- La décision du 12/11, validée par CrOliX après l'audit (« ok je valide »), telle que le plan
  [des textes d'accord](2026-11-12-textes-d-accord.md) la recopie : « la barre de confiance des gestes : un chantier
  court mesure au banc les mots des gestes avec cinq voix, puis la règle se tranche ; aucune vraie carte avant ».
- L'[ADR 0011](../../adr/0011-chaine-vocale-mvp.md) : « Pas de validation de vraie carte à la voix tant que la
  transcription ne rend pas une confiance réelle ».
- Les issues du banc et leurs commentaires (#70 en a un, du 12/11) ; lun-luxuria#6 ; lun-luxuria#81.
- Le relevé du 10/11 : `lun-luxuria/docs/essai-2026-11-07.md`, « Relevés du 10/11 », « Confiance ».
- Le plan des données et des taux : ses choix tranchés le 12/11 (« À trancher », points 2 les voix, 3 le son posé, 10
  lun-luxuria#70, 11 `hesite-puis-demande`, 12 la toux) et sa tâche 6.
- La veille, lue le 16/11 : la transcription, les agents et leurs garde-fous, le défi des propositions. Le défi C4 vise
  une carte qui envoie : « jamais un simple « oui » ». Rien sur la confiance de whisper pour un mot court.
- Le code relu sur `main` de lun-luxuria (`c800776`) le 16/11, par le graphe d'abord. La PR lun-luxuria#82 (écoute et
  parole), en brouillon, touche `chaine.test.ts`, `fakes.ts`, `scenario.ts`, `scenarios.test.ts` et
  `tools/mutations.json` : les lignes citées sont celles de `main`, à relire après sa fusion. Lun'Anima lu en local
  pour sa part, dont rien n'est écrit ici.

**Critères de fin :**

- Chaque correctif du banc a son test, écrit d'abord et vu rater sur `main`, son message d'échec collé dans ce plan,
  puis tenu. Pour #69, la cause est écrite ici avant tout correctif.
- `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check` passent ; la CI joue `voix/test_service.py`.
- `npm run scenarios` : chaque scénario joué deux fois à l'identique et tenu ; un verdict changé s'explique ici avant
  d'être accepté. `npm run banc` et `npm run scenarios` montrent leur résumé sous un agent.
- `npm run mutations` : le même tableau avant et après #67, chaque mutation tuée sur son maillon.
- `npm run chaine`, une partie par scénario avec Hortense, sur `main` puis sur la branche : aucun échec nouveau ;
  `synthese-pendant` jouée ; `sortie-arretee` de `faire-taire` jamais absente pour une question d'horloge. Une parole
  ancrée sur un envoi qui ne viendra pas est sautée bien avant 90 s (le test de la sonde le prouve).
- `npm run gestes` joue la liste des gestes avec les cinq voix et les prises de CrOliX, sur la brique en service ou sa
  copie étalonnée, et écrit son relevé hors dépôt ; son résumé est ici (« Ce que la mesure a donné »).
- Sa part du core est faite, dans son issue de lun-anima ; ses comptes sont ici, sans ses mots.
- CrOliX a tranché la règle par écrit ; elle est écrite dans un ADR et la ligne B1 de la feuille de route suit ;
  lun-luxuria#6 se ferme.
- La PR de Lun'Luxuria ferme la chapeau, #67 à #71 et #73 à #75, et coche le point de #81.

| Dépôt, branche | Issue | PR | Niveau |
|---|---|---|---|
| `lun-luxuria`, `feat/banc-et-gestes` | chapeau à ouvrir ; #6, #67 à #71, #73 à #75 | à ouvrir | `critique` |
| `lun-anima` | une issue privée, à ouvrir | à ouvrir | `critique` |
| `lun-docs`, `docs/banc-et-gestes` | la chapeau de lun-luxuria | à ouvrir | `trivial` |

`critique` pour Lun'Luxuria : il ferme #6, et ses chiffres décident d'un verrou de sécurité. *Show* : ce qui est de
Lun'Luxuria se prouve sur le laptop.

## Ce que le code fait aujourd'hui

### Les gestes à la voix (lun-luxuria#6)

- **Luxuria ne tranche rien** : « aucune logique de carte ici : une phrase part comme n'importe quelle autre »
  (`CLAUDE.md:13-14`). La transcription rend `{ text, confidence }` (`src/voice.ts:14-19`) ; la conversation trace la
  confiance (`src/conversation.ts:343`) et l'envoie avec le texte (`:384`, `src/brain.ts:36`), que le client poste au
  serveur (`src/core.ts:93-96`). Le serveur décide ; sa barre est la barre de 0,7 de lun-luxuria#6.
- **La confiance n'est plus fixe.** Le titre de #6 date du 07/11 ; depuis lun-luxuria#10, faster-whisper rend
  l'exponentielle de la moyenne d'`avg_logprob` (`voix/service.py:49-53`), whisper-server la moyenne géométrique des
  probabilités des seuls jetons de texte, 0 sans aucun mot (`:56-68`). « Les deux ne se comparent pas : la barre de
  geste se juge sur la brique en service » (`docs/README.md:10-13`). Son test (`voix/test_service.py:43-60`) ne tourne
  nulle part (#68).
- **Aucune mesure n'est passée par `/stt`.** Le relevé du 10/11 « interroge whisper-server directement, avec le calcul
  de `/stt` recopié, et non `/stt` lui-même » (`docs/essai-2026-11-07.md:78-79`). La fausse transcription du banc rend
  0,9 par défaut (`src/presence/scenario.ts:107`, `src/presence/fakes.ts:143`). La chaîne trace la vraie confiance
  (`src/presence/releve.ts:230-236`, `src/presence/taux.ts:85-91`), mais sur `faster:tiny` (`chaine.test.ts:452`) :
  whisper-server ne tourne pas sur le laptop.
- **Ce que le banc a déjà pour mesurer** : les cinq voix (`src/presence/chaine/sons.ts:323-420`, `voixDe` à
  `:403-420`) et leur cache (`dire`, `:111-127`, non exporté) ; la fin de phrase rejouée sur un son (`replay`,
  `src/listen/replay.ts:87-95`), dont l'événement `end` porte le son que la page envoie
  (`src/listen/endpoint.ts:37`, `:132`), avec les valeurs de la page (`:18-28`) et Silero
  (`src/listen/banc.test.ts:16-19`) ; le service de voix lancé par la chaîne (`chaine.test.ts:559-563`), sans synthèse
  par `--tts aucun` (`docs/README.md:8-9`) ; un bruit tiré d'une graine (`banc.test.ts:21-28`).

### Le relevé du 10/11, relu

21 prises de CrOliX, une par cas : six mots (oui, non, ok, envoie, valide, annule) dits de trois façons, et trois
silences. Seuil 0,7 ; « 3 faux acceptés, 4 faux rejets sur 21 » (`essai-2026-11-07.md:105`), un faux accepté y
étant « texte faux à 0,7 ou plus ».

**[avis] Relu par le geste**, les trois faux acceptés sont « envoie » rendu « Au revoir. » : ce n'est pas un mot de
geste, rien n'y tranche une carte, quelle que soit sa confiance. Ce sont trois faux rejets d'« envoie ». Ce que le
tableau montre : « envoie » jamais entendu (déjà « sur les six » le 07/11), « oui » propre à 0,602 et dans le bruit à
0,628, « annule » propre à 0,544, sous la barre ; les silences rendus « Bruit de porte » à 0,445 et 0,454, hors des
mots de geste. Les 21 prises ne disent pas si un son qui n'est pas un geste peut devenir un mot de geste au-dessus de
la barre : elles n'ont ni mot voisin, ni négation, ni toux. C'est ce que la mesure doit chercher. Les comptes de la
part du core vérifient cette lecture avant qu'elle serve.

### Le banc, issue par issue

- **#67.** `echecs` lit `releve-scenarios.md` colonne par colonne (`tools/mutations.mjs:14-32`, lu à `:58`), avec sa
  vérification sur un exemple (`:34-44`). Le relevé est écrit par `src/presence/scenarios.test.ts:132-138`, sans JSON.
- **#68.** La CI (`.github/workflows/ci.yml:12-40`) n'a aucune étape Python. Le test donne sa propre commande
  (`voix/test_service.py:1-4`) ; c'est lui qui vérifie la confiance de whisper-server (`:43-60`), sur laquelle la
  mesure des gestes repose.
- **#69.** Le témoin met chaque son dans un seul WAV, après une attente d'ouverture de 8 s (`sons.ts:217-237`), joué
  par le faux périphérique de Chromium (`chaine.test.ts:606-616`) ; son `t0` est pris sur la première trame qui porte
  du son (`:664-669`, `PREMIERE_TRAME` à `:851-864`), moins l'instant de la première parole (`:843`). La cause
  supposée par l'issue n'est pas vérifiée.
- **#70.** Tranchée le 12/11 (point 10) : « garder ces attentes en mesures, avec leur distribution, sans attente `tous`
  plus large ». Son commentaire du 12/11 ajoute B, C, E et F. B : `poste` de `phrase-attente` est irréalisable à la
  chaîne, comme le commentaire l'explique. C, c'est #71. E : `coupee` et `coupure-recue` sur le mot à mot du
  faux son. F : `sortie-arretee` de `faire-taire` absente 4 fois sur 30 ; la sonde date `arrete` sur l'horloge du son
  (`src/presence/chaine/sonde.ts:225`, `:245`) et le geste sur l'horloge murale (`:249-252`), et le juge veut un
  instant après son ancre (`src/presence/judge.ts:280`).
- **#71.** `synthese-pendant` (`src/presence/scenarios/oui-puis-reparler.ts:45-54`) est ancrée sur `retenue`, une
  `exact` hors de ses bornes à la chaîne ; une ancre ne compte que tenue (`judge.ts:243-251`, `:247`).
- **#73.** La sonde garde une parole ancrée jusqu'à son ancre (`sonde.ts:97-104`, `:300-306`) et n'écrit
  `parole_sautee` qu'en fin de partie (`:26`). La partie attend que chaque son posé ait fini (`chaine.test.ts:898-900`),
  au plus `PLAFOND_MS`, 90 s (`:476`, `:895`). La sonde voit les envois (`sonde.ts:80`, `:157-182`), pas les
  transcriptions.
- **#74.** Le juge connaît un événement après son ancre, dans `entre`, ou `absent` (`scenario.ts:226-233`,
  `judge.ts:276-284`) ; aucun nombre. `rien-de-l-essai-retire` garde une fenêtre fixe, du début de la parole à 2 880 ms
  (`src/presence/scenarios/hesite-puis-demande.ts:95-104`). `transcription-lente`, que lun-luxuria#82 ajoute, contourne
  de même (plan [de l'écoute et la parole](2026-11-12-ecoute-et-parole.md), « Les scénarios nouveaux »).
- **#75.** `chaine` a `--reporter=default` (`package.json:24`), `banc` et `scenarios` non (`:21-22`) ; leurs résumés
  sont des `console.log` (`banc.test.ts:256`, `:337`, `scenarios.test.ts:137`). Aucun de ces deux scripts ne tourne
  en CI : elle joue `npm test` et `npm run mutations` (`ci.yml:24`, `:52`), et les mutations lancent Vitest par leur
  propre commande (`mutations.mjs:49-50`). La crainte de l'issue, perdre le rapporteur de la CI, ne tient pas.

### Le son posé (lun-luxuria#81)

- Sans `CHAINE_VOIX`, `POSES` est vrai (`chaine.test.ts:465-466`) : une parole prend `sons/<nom>.wav` s'il existe
  (`sons.ts:141-143`), et sinon elle est synthétisée sans rien dire (`:145-157`). Seul un son entre parenthèses est
  refusé quand il manque (`:144`). Le relevé nomme la source (`pose:` ou `cache:`, colonne « Son »,
  `releve.ts:230-236`) : on le lit après coup, rien ne le refuse. Le « non » posé avait disparu du banc ; une course a
  ainsi raté `non-court` (#81). Il est remis depuis le 16/11.
- Aucun scénario ne dit quelle parole attend un son posé : `non-court` joue sa prise par le seul nom du fichier
  (`src/presence/scenarios/non-court.ts:24`).

### La toux

- Tranchée le 12/11, « la toux par sa prise (a) » : deux toux de CrOliX, une ordinaire d'au moins 450 ms et une courte
  d'au moins 300 ms, rangées hors de tout dépôt (plan des données et des taux, « À trancher », point 12, et tâche 6).
  Les prises ne sont pas faites. `toux-courte`, `toux-parole`, `toux-puis-parole` et `toux-reflexion` disent « son
  manquant » à la chaîne (`sons.ts:140-144`).
- Aucune toux parmi les témoins d'un geste : les 21 prises n'en ont pas.

## Ce qui se prouve, et comment

- **Le banc** : les tests de la sonde, du juge, des sons et des mutations ; les scénarios au niveau exact ; une partie
  par scénario à la chaîne. Ils prouvent que le banc fait ce qu'il dit. Ils ne prouvent rien de neuf sur la page.
- **La mesure** : ce que la transcription en service rend de chaque son, texte et confiance, par mot, par voix et par
  condition. C'est le vrai `/stt`, la vraie fin de phrase et les valeurs de la page, sans la page. Elle ne prouve ni le
  micro ni la pièce du desktop, ni sa voix au quotidien, ni l'écho de la sienne, ni le confort d'une règle sur une
  semaine.
- **Ce que le serveur en fait** : sa part du core va dans une issue de lun-anima, et rend ici ses comptes. Le
  classement du banc (plus bas) n'est qu'un indicateur, et le dit.
- **La brique** : whisper.cpp `medium` est la brique en service (ADR 0011). Sur le laptop, une copie pour le
  processeur ; son étalonnage (tâche 1) la compare au tableau du 10/11 avant que rien ne compte.

## Les choix **[avis]**

### Le banc

- **#67.** `scenarios.test.ts` écrit, à côté du relevé, `verdicts-scenarios.json` : par scénario, ses verdicts (id,
  état, espèce, source), un défaut connu marqué comme tel. `mutations.mjs` lit ce fichier, avec les mêmes filtres
  qu'`echecs` (`:27-29`) ; sa vérification sur un exemple (`:34-44`) passe à un exemple JSON. Le Markdown reste, pour
  la lecture.
- **#68.** Une étape dans le travail `checks` de la CI : installer `uv`, puis la commande du test
  (`test_service.py:4`).
- **#69.** D'abord la vérification que l'issue demande, sans code : l'attente d'ouverture changée, l'instant de la
  première trame comparé à celui où la sonde pose le premier son. La cause est écrite ici. Un correctif seulement si
  c'est le recalage, dans `chaine.test.ts`.
- **#70.** B et E restent des mesures, comme tranché le 12/11 : rien ne change pour elles. F se corrige : la sonde
  date le geste sur la même horloge que `arrete`.
- **#71.** À la chaîne seulement, une ancre qui est une attente `exact` compte dès que son événement est trouvé, même
  hors de ses bornes : à la chaîne une `exact` est une mesure, et son instant existe. Le niveau exact ne change pas.
  Les verdicts que cela change à la chaîne sont listés ici.
- **#73.** La sonde suit aussi `/voix/stt`, comme elle suit les envois. Une parole ancrée sur l'envoi *n* est sautée
  (`parole_sautee`, la même espèce) quand chaque son non ancré a fini, que moins de *n* envois sont venus, et que rien
  n'est en route, ni transcription ni envoi, depuis `CALME_MS` (`chaine.test.ts:479`). Le plafond de 90 s reste pour
  le reste.
- **#74.** Une attente d'événement reçoit `nombre: [min, max]` : les événements qui conviennent, comptés après
  l'ancre (dans `entre` s'il est donné), entre ces bornes. `absent` reste tel quel. `rien-de-l-essai-retire` devient
  « une seule réponse sonne » : `premier_son`, écrit une fois par réponse (`src/conversation.ts:149`), compté à
  `[1, 1]` depuis le début de la parole. `transcription-lente` s'écrit de même si son contournement est celui-là.
- **#75.** `--reporter=default` sur `banc` et `scenarios`, comme `chaine`. La CI ne change pas.
- **Le son posé (#81).** Une parole peut dire `pose: true` (`Parole`, `scenario.ts:134-149`) : elle attend son son
  posé. Quand les sons posés jouent (`POSES`) et que le fichier manque, la partie n'est pas jouée et dit « son posé
  manquant : <nom> », par le chemin d'un son manquant (`sons.ts:144`, `chaine.test.ts:730`). Avec `CHAINE_VOIX`,
  chaque voix le dit, comme aujourd'hui. `non-court` marque son « Non ».

### Le banc des gestes

- **Une commande** : `npm run gestes`, un fichier de Vitest sous son mode, avec `--reporter=default`, sur le poste
  seulement, jamais en CI, comme `chaine`. Ses parties pures (la liste, le bruit, le classement, le tableau) sont
  testées dans `npm test`.
- **Sa liste, hors dépôt** : `BANC_DIR/gestes/mots.json`, chaque ligne un `dit` et son `attendu` : le mot de geste
  qu'il doit donner, ou rien pour un témoin. Hors du dépôt, parce que les mots de geste sont au serveur
  (`CLAUDE.md:13-14`), pas à Luxuria. Sans ce fichier, la commande s'arrête et le dit ; le dépôt n'a pas de liste.
- **Ses sons** : chaque `dit` dit par chaque voix, par son cache (`dire`, exporté) ; chaque prise de
  `BANC_DIR/gestes/prises/` jouée telle quelle, nommée `<attendu>-<façon>.wav`, ou `silence-<n>.wav` pour un témoin.
- **Ses conditions** : chaque son de synthèse propre, puis avec le bruit du banc (`banc.test.ts:21-28`, sorti dans un
  module partagé) à un niveau fixe. Les prises, telles quelles.
- **Le trajet** : chaque son passe par `replay`, Silero et les valeurs de la page ; le son de chaque phrase (`end`)
  part au `/stt` du service de voix que la commande lance, `--tts aucun`, sur la brique de `GESTES_STT`, sans valeur
  par défaut. Un son que la fin de phrase prend pour du bruit est écrit tel, rien n'est envoyé. Les voix :
  `GESTES_VOIX`, au format de `CHAINE_VOIX`, Hortense par défaut.
- **Ce qu'elle écrit, hors dépôt** : `BANC_DIR/gestes/gestes.jsonl`, une ligne par phrase (voix, source, condition,
  `dit`, `attendu`, entendu, confiance, ce que l'écoute en a fait, la brique, la durée de `/stt`), et
  `releve-gestes.md`.
- **Son classement, un indicateur** : « juste » (l'entendu, sans casse, accents ni ponctuation, vaut l'`attendu`),
  « autre mot » (il vaut un autre `attendu` de la liste), « hors liste ». Pour chaque barre de 0,50 à 0,95, par pas de
  0,05 : les justes sous la barre (faux rejets), les autres mots au-dessus (faux acceptés), par mot, par voix et par
  condition. Les comptes de la part du core font foi.

### La mesure

- **Les cinq voix**, tranchées le 12/11 (plan des données et des taux, « À trancher », point 2) : Hortense (Windows,
  par System.Speech) ; Julie et Paul (les voix OneCore de Windows, par WinRT) ; jessica et pierre (Piper,
  `fr_FR-upmc-medium`, CC BY-SA 4.0, téléchargé hors dépôt le 12/11). Toutes de synthèse et locales. Aucune n'est
  l'enregistrement d'une personne, et jamais sa voix à elle (`sons.ts:415-418`).
- **Une voix de personne** : les 21 prises de CrOliX du 10/11, les siennes, rangées avec le banc, hors git. Elles
  servent à l'étalonnage et sont la seule vraie voix. Les prises d'autres personnes restent dehors : « Common Voice, et
  toute prise de personne au-delà des siennes : tranché le 12/11 » (plan des données et des taux, « Hors périmètre »).
- **Les mots** : les six du relevé du 10/11, oui, non, ok, envoie, valide, annule. Les autres mots du serveur s'y
  ajoutent hors dépôt, par sa part du core. Puis les témoins, sans `attendu` : la négation d'un mot qui lâche
  (« n'envoie pas », « non merci ») ; des mots voisins (« Louis », « nous », « nom », « au revoir », « renvoie ») ;
  des hésitations (« euh », « hum ») ; les silences (un son nul, le bruit seul, ses trois silences du 10/11) ; la
  toux, une fois posée.
- **Le compte** : une vingtaine de `dit`, cinq voix, deux conditions, environ 200 sons, plus les 21 prises. À environ
  8 s par son pour `medium` sur le processeur du laptop, une demi-heure : estimé, pas mesuré.
- **La brique** : whisper.cpp v1.9.5, la version du desktop (`essai-2026-11-07.md:39`), pour le processeur, avec le
  modèle `medium`, téléchargé hors dépôt sur le laptop, avec l'accord de CrOliX (« Les choix qui restent »).
- **L'étalonnage** : les 21 prises rejouées comme le 10/11, le fichier entier à whisper-server, par le script jetable
  de ce relevé, hors dépôt, puis comparées prise par prise au tableau (`essai-2026-11-07.md:81-103`). Le même texte sur
  les 21 et aucun écart de confiance au-delà de 0,05 : la mesure du laptop compte. Sinon elle ne décide pas, et se
  rejoue sur le desktop par la même commande.

### Comment la règle se tranche

**Ce qui compte, posé avant la mesure** :

1. **Aucun faux accepté** : aucun témoin et aucun autre mot pris par le serveur pour un geste qui lâche (accepter,
   envoyer), sur tout le jeu, d'après les comptes de la part du core. Zéro sur *N* sons met le taux sous 3/*N*, pas
   à zéro.
2. **Les faux rejets**, écrits par mot, par voix et sur ses prises. Un mot gardé à la voix est entendu juste,
   au-dessus de la barre, sur au moins 4 sons sur 5 toutes voix ensemble, et sur 2 de ses 3 prises.
3. **Le sens compte** : un mot qui retient (« non », « annule ») coûte peu s'il est pris à tort, la carte attend ou le
   geste reste tenu. Un mot qui lâche (« oui », « envoie ») coûte une carte tranchée sans lui. La règle n'est pas la
   même pour les deux.

**Les règles possibles, jouées sur les mêmes données** :

- (a) **une barre** : une seule, choisie sur le tableau, les mots inchangés ;
- (b) **une liste** : seuls les mots qui tiennent 1 et 2 tranchent à la voix, les autres à l'écran ; une carte qui
  envoie se tranche à l'écran si son mot n'est jamais entendu ;
- (c) **une confirmation par un autre geste** : deux mots différents de suite, ou les 5 s pour dire « annule », gardées
  comme confirmation ;
- (d) **le verrou gardé** : aucune carte à la voix au MVP ; elle la lit, et dit de la trancher à l'écran.

**[avis], à confirmer par la mesure** : (b), une barre par brique, les 5 s gardées, pas de second mot. Un second mot
double l'attente, et les 5 s laissent déjà reprendre le geste. La veille va dans le même sens pour une carte qui
envoie (défi C4). Si aucun mot ne tient le point 1 : (d).

## Les tâches

**Avant tout code** : lun-luxuria#82 fusionnée ; elle touche les fichiers du banc. **Dès la validation, hors dépôt** :
1, 2 dès que ses prises existent, et le début de 13. **Après #82, en parallèle** : 3, 4, 5, 6 et la vérification de 7.
**Après 5** : 8. **Après 3 et 5** : 9. **Après 6** : le correctif de 7, s'il y en a un. **Après chacune de 3 à 9** :
10, sa relecture. **Après 3 à 10** : 11. **Après 1, 9, 11 et le début de 13** : 12. **Après 12** : les comptes de 13,
puis 14, puis 15.

Le banc des gestes (9) ne touche aucun fichier de #67 à #75 sauf `package.json` (après 3) et `sons.ts` (après 5) : il
avance avec le banc, et la mesure (12) vient après lui. **[avis]** C'est un écart à « le banc d'abord » : il ne change
que l'heure de départ de 9, pas l'ordre de la mesure et de la règle.

Chaque fichier n'a qu'une tâche à la fois : `scenario.ts`, 5 puis 8 ; `sons.ts`, 5 puis 9 ; `package.json`, 3 puis 9 ;
`chaine.test.ts`, 6 puis le correctif de 7 ; `sonde.ts`, 6 seule ; `judge.ts`, 8 seule ; `scenarios.test.ts`, 4
seule ; `banc.test.ts`, 9 seule (`package.json` porte #75). Chaque tâche de code suit le même ordre : son test d'abord,
vu rater sur `main`, le message collé sous « Ce que les preuves ont montré sur `main` », puis le correctif, puis tout
`npm test`.

1. - [ ] **La brique sur le laptop, et son étalonnage** (`testeur`, hors dépôt). *Parallélisable*, dès l'accord de
   CrOliX.
   - whisper.cpp v1.9.5 pour le processeur et le modèle `medium`, téléchargés hors de tout dépôt ; le lien et la
     somme de chaque fichier écrits ici. whisper-server lancé à la main, comme sur le desktop.
   - Les 21 prises du 10/11 rejouées comme ce jour-là (« La mesure », l'étalonnage) ; le tableau comparé, prise par
     prise, écrit ici, et le verdict : la mesure du laptop compte, ou elle attend le desktop.
   - Exclu : la version Vulkan ; `small` ; changer le service de voix.
2. - [ ] **La toux** (`testeur`, hors dépôt). *Indépendante.* La tâche 6 du plan des données et des taux, reprise telle
   quelle : sa prise (a), ou ce que CrOliX choisit (« Les choix qui restent »). Une fois posée, chaque toux sert aussi
   de témoin à la mesure (12).
3. - [ ] **La CI et les scripts** (`.github/workflows/ci.yml`, `package.json`, `dev-luxuria`). *Parallélisable.* #68,
   #75.
   - Une étape de `checks` installe `uv` et joue `voix/test_service.py` par sa commande. Preuve : la CI de la PR la
     montre verte, puis rouge sur une copie qui casse le calcul de la confiance (essai local, jamais poussé).
   - `--reporter=default` sur `banc` et `scenarios`. Preuve : sous un agent, chacun montre son résumé.
   - Exclu : `pyproject.toml` ; le reporter de `npm test`.
4. - [ ] **Les mutations lisent du JSON** (`src/presence/scenarios.test.ts`, `tools/mutations.mjs`, `dev-luxuria`).
   *Parallélisable.* #67.
   - D'abord : la vérification de `mutations.mjs` sur un exemple JSON, qui rate tant que le fichier n'est pas lu.
   - Puis « Les choix », #67. Preuve : le tableau de `npm run mutations` identique avant et après, collé ici.
   - Exclu : changer le relevé Markdown ; changer `tools/mutations.json`.
5. - [ ] **Le son posé qui manque** (`src/presence/scenario.ts`, `src/presence/chaine/sons.ts`, `sons.test.ts`,
   `src/presence/scenarios/non-court.ts`, `dev-luxuria`). *Parallélisable.* Le point de #81.
   - D'abord, dans `sons.test.ts` : une parole `pose: true` dont le fichier manque, sons posés en jeu, rend un manque
     qui la nomme ; la même avec `CHAINE_VOIX`, synthétisée ; présente, jouée `pose:`. Dans `scenario.test.ts`,
     `charger` accepte `pose`.
   - Puis « Les choix », le son posé. Le compte de la chaîne : `non-court` sans `non.wav` n'est plus jouée.
   - Exclu : toute autre règle des sons posés (tranchée le 12/11, point 3).
6. - [ ] **La sonde** (`src/presence/chaine/sonde.ts`, `sonde.test.ts`, `src/presence/chaine.test.ts`,
   `dev-luxuria`). *Parallélisable.* #73, F de #70.
   - D'abord, dans `sonde.test.ts` : une parole ancrée sur l'envoi 1, la parole 1 jugée bruit (aucun `/stt` ni envoi
     en route) : `parole_sautee` après `CALME_MS`, pas à la fin ; une transcription en route la retient. Un geste et
     un `arrete` du même instant : `arrete` n'est jamais avant le geste.
   - Puis « Les choix », #73 et F. Une partie de robustesse avec jessica sur `oui-puis-reparler`, si elle y perd
     encore le « Oui » : la durée de la partie, ici.
   - Exclu : le plafond de 90 s ; la page ; le témoin (7).
7. - [ ] **Le témoin** (`testeur`, puis `dev-luxuria`). La vérification *parallélisable* ; le correctif après 6. #69.
   - D'abord la vérification (« Les choix », #69), `deux-phrases` et son témoin joués trois fois ; la cause écrite
     ici.
   - Si c'est le recalage : son test d'abord, puis le correctif dans `chaine.test.ts`. Sinon, #69 se ferme sur la
     cause écrite, sans code.
   - Exclu : changer la fin de phrase de la page.
8. - [ ] **Le juge** (`src/presence/scenario.ts`, `src/presence/judge.ts`, `judge.test.ts`,
   `src/presence/scenarios/hesite-puis-demande.ts`, `transcription-lente.ts`, `dev-luxuria`). Après 5. #74, #71.
   - D'abord, dans `judge.test.ts` : `nombre` tenu, en trop, en manque, avec et sans `entre` ; à la chaîne, une ancre
     `exact` hors de ses bornes donne son instant ; au niveau exact, non. `charger` refuse `nombre` avec `absent`, et
     des bornes inversées.
   - Puis « Les choix », #74 et #71. `npm run scenarios` : chaque verdict identique à `main`, sauf
     `rien-de-l-essai-retire`, expliqué ici. À la chaîne, la liste des verdicts que #71 change.
   - Exclu : élargir une borne ; une attente `tous` nouvelle pour #70 (tranché le 12/11).
9. - [ ] **Le banc des gestes** (`src/presence/gestes.ts` et `gestes.test.ts`, nouveaux ; `sons.ts`, `replay.ts`,
   `banc.test.ts`, `package.json`, `CLAUDE.md`, `docs/README.md` ; `dev-luxuria`). Après 3 et 5.
   - D'abord, dans `gestes.test.ts`, au niveau des tests : la liste lue, une ligne sans `dit` refusée ; une prise
     nommée lue (`oui-propre.wav` donne `oui`, `silence-1.wav` un témoin) ; le classement (« Oui. » juste pour `oui`,
     « Non. » autre mot, « Au revoir. » hors liste) ; le tableau des barres sur trois lignes connues ; le bruit
     identique d'un tirage à l'autre.
   - Puis « Le banc des gestes ». `dire` exporté ; le bruit sorti de `banc.test.ts` dans `replay.ts`. La commande et
     ses variables dans `CLAUDE.md` et `docs/README.md`, comme `chaine`.
   - Exclu : la page ; le serveur ; une liste de mots dans le dépôt ; un son dans le dépôt ; un réglage de Luxuria ;
     changer le calcul de la confiance.
10. - [ ] **Relecture** (`reviewer`). Après chaque tâche 3 à 9, sur son diff, contre ses critères ; puis le diff entier
    avant la PR. Un écart revient à sa tâche.
11. - [ ] **Les suites** (`testeur`). Après 3 à 10.
    - [ ] `npm test`, `lint`, `typecheck`, `format:check` ; `npm run scenarios`, le relevé lu ; `npm run mutations`.
    - [ ] `npm run chaine`, une partie par scénario avec Hortense, sur `main` puis sur la branche, comparées ici.
12. - [ ] **La mesure** (`testeur`). Après 1, 9, 11, et les mots que la part du core ajoute à la liste.
    - [ ] La liste écrite hors dépôt (« La mesure », les mots) ; les 21 prises posées dans `BANC_DIR/gestes/prises/`.
    - [ ] `npm run gestes` avec les cinq voix, sur la brique de la tâche 1. Sa durée, et le résumé du relevé ici : les
      six mots publics par voix et par condition, les témoins par famille, le tableau des barres.
    - [ ] Exclu : écrire ici un mot de la liste du serveur.
13. - [ ] **La part du core** (Lun'Anima). Sa part du core va dans une issue de lun-anima. Ses mots s'ajoutent à la
    liste avant 12 ; ses comptes reviennent ici après 12, sans ses mots ; le reste suit la règle (14), dans son issue.
14. - [ ] **La règle** (CrOliX ; puis la session principale). Après les comptes de 13.
    - [ ] Le relevé et les comptes présentés, avec les quatre règles jouées sur les mêmes données ; CrOliX tranche par
      écrit.
    - [ ] L'ADR qui le dit (« Les choix qui viendront après la mesure ») ; la ligne B1 de la feuille de route ;
      lun-luxuria#6 fermée avec le relevé.
15. - [ ] **La fin** (`testeur`, `livreur`).
    - [ ] Ce plan coché, « Ce que l'exécution a trouvé » écrit ; chaque observation nouvelle, une issue `inbox`.
    - [ ] À la fusion : les worktrees retirés. Le relevé des gestes reste dans `BANC_DIR`, preuve de #6.

## Ce que les preuves ont montré sur `main`

À remplir par chaque tâche de code, avant son correctif : le message d'échec de chacun de ses tests, collé tel quel.
Un test qui passe sur `main` : la tâche s'arrête et le dit ; le constat est revu ici avant tout correctif.

## Ce que la mesure a donné

À remplir par les tâches 1, 12 et 13 : l'étalonnage, le résumé du relevé, les comptes de la part du core.

## Ce que le desktop vérifiera

- Si l'étalonnage ne tient pas : la mesure rejouée sur la carte, par la même commande.
- Le micro et la pièce du desktop, et l'écho de sa voix à elle pris pour un geste : la session du desktop (feuille de
  route, § 4).
- Ce que sa part du core vérifie sur le desktop, avant la première vraie carte à la voix : dans son issue.

## Hors périmètre

- **lun-anima#97** : son propre chantier, après celui-ci ; ce qui en touche ce chantier va dans sa part du core.
- L'écho, le micro et la pièce du desktop : la session du desktop.
- Changer le calcul de la confiance (le minimum des jetons plutôt que la moyenne), une seconde transcription pour les
  gestes, un modèle de mots-clés : si aucune règle ne tient, une issue.
- La langue (B2) : la mesure est en français ; si la langue transcrite change, elle se rejoue.
- Le tour (I8, lun-luxuria#63, #53), l'IPC (lun-luxuria#78), le flux RVC (lun-luxuria#7).
- Les prises d'autres personnes, le débit des voix, d'autres bruits que celui du banc et la toux.
- B et E de #70 : des mesures, tranché le 12/11.

## Limites

- **Les voix de synthèse sont propres** : elles disent ce que la transcription confond, pas comment CrOliX parle. Ses
  21 prises sont la seule vraie voix, une prise par cas.
- **Le processeur n'est pas la carte** : l'étalonnage tient sur 21 prises. Le fichier exact du modèle `medium` du
  desktop n'est pas vérifié.
- **Le classement du banc est un indicateur** : les comptes de la part du core font foi.
- **Zéro faux accepté** sur *N* sons met le taux sous 3/*N*, pas à zéro.
- **`replay` n'est pas le micro** : ni écho ni pièce, et la page ne joue pas (l'essai à la pause, la tenue).
- **#73** : la règle suppose que la sonde voit chaque transcription ; elle ne voit aujourd'hui que les envois.
- **Le temps de la mesure** est estimé, pas mesuré.

## Les choix qui restent à CrOliX pour démarrer

1. **Le plan**, tâches 1 à 15. Je recommande de le valider : le banc se corrige avec ses preuves, la mesure passe par
   le vrai `/stt`, et la règle se tranche sur des critères posés avant elle.
2. **La brique sur le laptop** : télécharger whisper.cpp v1.9.5 pour le processeur et le modèle `medium` (environ
   1,5 Go, non vérifié), hors de tout dépôt. Je le recommande : la mesure part sans le desktop, et l'étalonnage dit si
   elle compte. L'autre voie : la mesure attend la session du desktop.
3. **La toux**, tranchée le 12/11 : sa prise (a), qui manque encore. Je recommande de l'enregistrer maintenant, deux
   toux au micro du laptop : elle sert les quatre scénarios et les témoins de la mesure. Les autres voies : (b) un
   fichier CC0, hors dépôt, sa licence lue sur sa page ; (c) sans toux, les quatre scénarios restent au niveau exact
   et la mesure n'a pas de toux.

## Les choix qui viendront après la mesure

Posés au moment où ils serviront, avec le relevé :

- **La règle** : (a) à (d) de « Comment la règle se tranche », avec l'avis révisé d'après les chiffres.
- **De nouvelles prises de lui**, si la règle tient à ses faux rejets : une série de cinq prises par mot.
- **Où elle s'écrit** : **[avis]** un ADR nouveau, le 0014 aujourd'hui. On ne modifie jamais un ADR accepté
  ([`adr/README.md`](../../adr/README.md)) : il reprend le point « Pas de validation de vraie carte à la voix » de
  l'ADR 0011, et lui seul.

## L'issue chapeau à ouvrir dans lun-luxuria

Avant la première tâche de code : « Le banc et les mots des gestes », étiquette `niveau:critique`, le lien vers ce
plan, lun-luxuria#6, #67 à #71, #73 à #75, le point de #81, et la PR qui la ferme.
