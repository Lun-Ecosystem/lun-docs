# L'écoute et la parole : la sourdine tient le micro, rien n'attend sans fin, elle ne reprend pas par-dessus. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **État : rédigé le 12/11, à relire par le plan-challenger, puis à valider par CrOliX.** Le chantier est validé dans
> son principe le 12/11 (« ok je valide ») ; ce plan ne l'est pas encore. Les choix marqués **[avis]** et la liste
> « À trancher » attendent sa décision.
>
> **PR :** celle de l'axe de la présence pour ce plan (lun-docs#162) ; celle de Lun'Luxuria s'ouvre avec la tâche 0.
> Lun'Anima n'est pas touché.

**But :** que chaque défaut de l'écoute et de la prise de parole relevé par l'audit du 12/11 soit corrigé, et que la
preuve le montre deux fois : avant le correctif, le défaut se voit ; après, il ne se voit plus. La preuve est le banc
de présence partout où il atteint le code (un scénario au niveau exact, puis une mutation), un test unitaire là où il
ne l'atteint pas.

**Ce que ce chantier règle.** Le micro peut rester ouvert malgré la sourdine. Une transcription ou une réponse qui ne
vient pas laisse la page attendre sans fin, « réfléchit » allumé, sa voix suspendue. Un serveur injoignable garde la
pièce « adressée ». Après une toux, elle reprend par-dessus une phrase qui commence juste après (lun-luxuria#63).
Absente, un fragment part avant l'annonce du retour (lun-luxuria#53). Un mot voisin de son nom passe pour son nom.

**Source :** l'audit en lecture de Lun'Luxuria du 12/11 sur `main` (`11eb3d1`), rendu en message : ses constats I1,
I2, I6 à I9, I11 et M1 à M3, lus dans le code, jamais rejoués. Sa synthèse, § 2 « Écoute et parole ». Les issues
`inbox` lun-luxuria#63 et #53. Le code relu pour ce plan sur `main` (`11eb3d1`) le 12/11, constat par constat ; les
lignes citées ici sont celles de ce `main`, corrigées quand celles de l'audit s'en écartaient (`core.ts`).

**Critères de fin** (Lun'Luxuria, en local) :

- Chaque défaut gardé a sa preuve, vue rater sur `main` (tâche 0) et tenue après son correctif : un scénario dont le
  `connus` est retiré par la tâche qui corrige, ou un test unitaire écrit `it.fails`, passé en `it` par elle.
- Plus aucun `it.fails` dans le dépôt, plus aucun `connus` qui nomme l'issue chapeau ; celui de lun-luxuria#63 est
  retiré de `toux-puis-parole`.
- `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check` passent. `npm test` ne prend pas plus de
  cinq secondes de plus.
- `npm run scenarios` joue vingt-cinq scénarios, chacun deux fois à l'identique, tous tenus. Les dix-huit d'aujourd'hui
  gardent leurs verdicts, sauf ceux que ce plan nomme ; un verdict changé ailleurs s'explique ici avant d'être accepté.
- `npm run mutations` : chaque mutation, ancienne ou nouvelle, fait échouer son maillon.
- `npm run chaine`, une partie par scénario avec Hortense : aucun échec nouveau par rapport à la course du 12/11, hors
  ceux que ce plan nomme ; les scénarios nouveaux que la chaîne ne joue pas le disent avec leur raison.
- La PR ferme l'issue chapeau, lun-luxuria#63 et #53.

| Dépôt, branche | Issue | PR | Niveau |
|---|---|---|---|
| `lun-luxuria`, `fix/ecoute-et-parole` | chapeau à ouvrir (voir la fin) ; lun-luxuria#63, #53 | à ouvrir | `standard` |
| `lun-docs`, `docs/deroule-tour` | la même | lun-docs#162 | `trivial` |

## Ce que le code fait aujourd'hui

### Le micro (I1, I2)

- **`#applyMic`** (`src/session.svelte.ts:436-462`) compare l'état voulu à `#mic !== null` (`:443`), puis attend
  `openMicrophone` (`:457`). Rien ne tient pendant l'attente : `#mic` reste `null` jusqu'à la fin de l'ouverture.
- **Sept appelants**, dont aucun ne sait qu'une ouverture est en cours : `saveSettings` (`:176`), `enter` (`:319`),
  `#pollBusy` (`:418`, `:431`), `toggleMic` (`:547`), `toggleMute` (`:560`), `takeBackMic` (`:566`), `setLayout`
  (`:572`).
  Détection d'occupation coupée (`busy.on` faux ; vrai par défaut, `src/settings.ts:93`), `#pollBusy` le rappelle
  toutes les 3 s (`:33`, `:294`, `:416-418`).
- **Deux courses.** (A) Un appel pendant une ouverture voit `#mic === null` et ouvre un second flux ; le premier est
  écrasé à `:457` sans être arrêté. (B) La sourdine, le micro coupé ou une disposition muette pendant l'ouverture :
  l'état voulu est faux, `#mic` encore `null`, et `:443` rend la main sans rien faire. L'ouverture finit, pose `#mic` et
  `capturing` (`:457-458`) : le micro est ouvert en sourdine. Détection en service (le défaut), rien ne le referme
  avant le prochain appel ; détection coupée, le prochain tour de `#pollBusy`, dans les 3 s.
- **Micro ouvert en sourdine** : chaque phrase est transcrite (`src/conversation.ts:328`) avant que la sourdine ne la
  retienne (`:348`) ; une tenue suspend sa voix sans regarder la sourdine (`:187-195`). Rien ne part au serveur.
- **La durée de la course** est celle de `getUserMedia` : une invite d'autorisation dans un onglet de navigateur, la
  première fois ; dans WebView2, non vérifié.
- **`openMicrophone`** (`src/audio.ts:61-83`) : `getUserMedia` (`:65`), puis `new AudioContext` (`:68`), `addModule`
  (`:70`), `new AudioWorkletNode` (`:72`). Si l'un des trois lève, ni les pistes ni le contexte ne sont fermés : seul
  `stop()` le fait (`:76-81`), et il n'est jamais rendu. La session écrit l'échec (`session.svelte.ts:459-461`) ; chaque
  appel suivant retente, et laisse un flux de plus.
- **Les tests.** Aucun pour `audio.ts` (« nothing here can be tested without a sound card », `:3`). Ceux de la
  session simulent `openMicrophone` (`src/mute.test.ts:3-7`, `src/desktop/away.test.ts:3-7`), qui répond aussitôt.

### Les attentes sans fin (I6)

- **La transcription.** `transcribe` (`src/voice.ts:14-19`) : un `fetch` sans délai ni signal. Le service sert `/stt`
  sous un verrou global (`voix/service.py:209`, `:282`). Avec whisper-server, il abandonne au bout de 60 s (`:62`) et
  répond une erreur, que la page traite (`conversation.ts:329-339`). Avec `faster`, en processus, aucun délai
  (`:47-51`). Un service figé ne répond jamais.
- **Pendant l'attente.** Une phrase finie est dans `#unjudged` (`conversation.ts:240-244`) ; `#letGo` ne reprend pas
  sa voix tant qu'elle y est (`:270`) : une réponse qu'elle a suspendue le reste. Un fragment confirmé par la fin de
  phrase a rallumé « réfléchit » (`:451`), qui reste allumé ; une phrase entière ne l'allume qu'à son verdict
  (`:380`). Les transcriptions suivantes attendent derrière le verrou du service.
- **L'envoi.** `CoreClient.send` (`src/core.ts:93-105`) lit le flux jusqu'à sa fin, sans délai. Un serveur qui donne
  `user`, ou le numéro, puis plus rien : `send` ne finit jamais, « réfléchit » reste allumé (`conversation.ts:380`).
- **La synthèse a déjà sa garde** : `Promise.race` contre 5 s (`src/speech/speaker.ts:43`, `:145-150`). Le même motif
  manque à la transcription et à l'envoi.

### Le tour (I8, lun-luxuria#63, I9, M1)

- **`#talking`** (`conversation.ts:104`) : posé par `held` (`:188`), retiré par `noise` (`:212`), `end` (`:218`) et
  `stopListening` (`:477`). `start` ne le pose pas (`:227-229`). `#letGo` reprend sa voix si `#talking` est faux et
  `#unjudged` vide (`:270`).
- **I8.** Le verdict d'une phrase qui arrive après le début de la suivante, mais avant sa tenue (400 ms), la fait
  reprendre par-dessus : une toux transcrite lentement, par exemple.
- **lun-luxuria#63 n'est pas I8.** Dans `toux-puis-parole` (`src/presence/scenarios/toux-puis-parole.ts:8-16`), la
  fin de la phrase de la toux la reprend à 3168 ; la parole d'après commence à 3360, 192 ms plus tard ; elle parle
  dessus jusqu'à sa tenue (3744) : 384 ms. La reprise vient avant la nouvelle parole : poser `#talking` à `start` n'y
  change rien. L'issue le dit : rien n'attend après une reprise.
- **I9.** Un fragment qui passe le filtre est marqué `passed` (`:382`), puis envoyé (`:384-386`). Si l'envoi lève, le
  `catch` éteint « réfléchit » et ne fait rien d'autre pour un fragment (`:387-392`). La fin de phrase le confirme
  (`:442-456`) : `addressed`, `#supersede` qui la coupe, « réfléchit » rallumé (`:451`), et il entre dans `#unjudged`
  et `#unheard` (`:240-244`). Rien n'y répondra : « réfléchit » reste allumé ; une parole suivante, tenue pendant
  qu'elle se tait, retient cette tentative morte (`:256-263`), puis la relâche en rallumant « réfléchit » (`:281`). Un
  échec de transcription sur un fragment, lui, le marque `dropped` (`:333`), et la fin de phrase le traite (`:223`).
- **M1 (lun-luxuria#53).** Pour une phrase entière, `addressed` part avant l'envoi (`:378-386`) ; pour un fragment,
  à sa confirmation (`:447-449`), après son envoi. La session revient de l'absence sur `addressed`
  (`session.svelte.ts:262-265`, `:364-367`) : absente, le fragment part au serveur avant l'annonce du retour. Le
  commentaire de `#heard` (`:363`) dit l'inverse. `away.test.ts:180-192` coupe l'essai pour ne pas le voir
  (`:181-184`).

### Sa voix (I7, I11)

- **`Speaker.stop()`** (`speaker.ts:289-310`) émet toujours `silent` (`:298`), même quand rien ne sonne ni n'attend.
  Chaque `silent` écrit `silence` dans le déroulé (`:84`) et rouvre la fenêtre de 15 s (`conversation.ts:168-170`,
  `src/listen/filter.ts:53-54`).
- **La page appelle `stop()` à chaque `link(false)`** (`session.svelte.ts:280-286`), et `live` rappelle `link(false)` à
  chaque tentative ratée, toutes les 3 s (`core.ts:135-140`). Serveur injoignable : un `silence` toutes les 3 s, la
  fenêtre jamais fermée. Dans le petit mode (filtre en service, `settings.ts:89`), toute phrase de la pièce passe par
  `fenetre`, ramène la présence, part au serveur et échoue : un message d'erreur par phrase.
- **Un `silence` n'a ni phrase ni réponse** : le déroulé ne l'élague que quand un tour plus ancien part
  (`src/trace.ts:111-118`). Sans tour, ils s'accumulent : 9 600 en 8 h.
- **I11.** `add` refuse un tour jeté (`speaker.ts:123`), mais une phrase déjà en file garde sa synthèse : `#oneClip`
  ne regarde pas `#gone` (`:140-163`), et `drop` et `stop` n'annulent rien (`:213-223`, `:289-299`). La file est une
  seule chaîne pour tous les tours (`:128-129`) : la première phrase d'une réponse nouvelle attend les synthèses du
  tour jeté, chacune jusqu'à 5 s. Côté service, une synthèse tient `tts_lock` jusqu'à sa fin (`voix/service.py:210`,
  `:290`) : couper la requête dans la page ne l'arrêterait pas.

### Le nom (M2, M3)

- **`saysName`** (`filter.ts:17-20`) admet une distance d'édition d'au plus `name.tolerance`, 2 par défaut
  (`settings.ts:90`), quelle que soit la longueur du nom. « nature » est à 2 de « natsume » ; « avant », « gens »,
  « urgent » à 2 d'« Agent », le nom par défaut (`settings.ts:84`) ; un nom de trois lettres accepte presque tout mot
  de deux. Un mot vide dans `name.words` accepterait tout mot de deux lettres, mais l'écran les retire
  (`src/Reglages.svelte:155-159`).
- **M3.** `isNoise` (`filter.ts:33-36`) juge bruit « Merci. » seul (`:30`), dans la fenêtre comme hors d'elle : un
  « Merci. » dit après sa réponse est perdu, comme celui que Whisper invente sur un bruit (`:22`).

## Les constats gardés et écartés

| Constat | Verdict | Pourquoi |
|---|---|---|
| I1, la course du micro | gardé, à rejouer d'abord | les deux courses se lisent ; leur durée réelle n'est pas mesurée |
| I2, le flux qui fuit | gardé | chaque nouvel essai en laisse un de plus |
| I6, les attentes sans fin | gardé, à rejouer d'abord | nuancé : whisper-server s'arrête à 60 s dans le service |
| I7, `link(false)` répété | gardé, corrigé à sa racine | c'est `stop()` à vide qui écrit et rouvre la fenêtre |
| I8, `start` sans `#talking` | gardé | un défaut réel, mais ce n'est pas lun-luxuria#63 |
| lun-luxuria#63 | gardé | la reprise précède la parole ; une règle de plus, à trancher |
| I9, « réfléchit » après un fragment raté | gardé | et la tentative morte se fait retenir ensuite |
| I11, la file pour un tour jeté | gardé, en partie | sauter la synthèse, oui ; couper `/tts` ne libère rien |
| M1 (lun-luxuria#53) | gardé | reproduit par la lecture et par `away.test.ts`, essai en service |
| M2, la tolérance absolue | gardé, en partie | le mot vide est écarté : l'écran ne le laisse pas entrer |
| M3, « Merci. » seul | à trancher | un choix d'origine ; recommandé : rien ne change |

Écartés, avec leur raison :

- **La garde de l'audit pour I7** (`if (up !== this.linked)` dans la session) : `linked` vient aussi de la présence
  (`session.svelte.ts:332`, `:336`). Un démarrage réussi le remet vrai alors que `live` reste coupé, et plus rien ne
  le remettrait faux. `stop()` à vide qui ne dit rien suffit : la répétition de `link(false)` devient sans effet.
- **Couper la requête `/tts` à la garde de 5 s** (I11) : le service finit sa synthèse sous `tts_lock`
  (`voix/service.py:290`), que la page coupe ou non.
- **Le mot vide de M2** : seul un réglage écrit à la main le ferait entrer ; `readSettings` ne lit que ce que l'écran
  a écrit.

## Ce que le banc atteint

- **Le niveau exact** (`npm test`, `npm run scenarios`) joue les vrais `Endpointer`, `Conversation`, son filtre
  (`decide`, `filter.ts:43-56`), `Speaker` et `Trace`, câblés comme la session, sur l'horloge fausse
  (`src/presence/player.ts:41-175`). Sont fausses : la probabilité de voix, la transcription, le serveur, la synthèse
  et la sortie (`src/presence/fakes.ts`).
- **Il n'atteint pas** `session.svelte.ts` (le micro, la sourdine, l'occupation, l'absence, le lien), `audio.ts`,
  `voice.ts`, `core.ts`, ni `voix/service.py`. Les événements de la conversation vers la session (`thinking`,
  `addressed`, `failed`) tombent dans `on: () => {}` (`player.ts:87`) : « réfléchit » ne se voit pas au banc.
- **Ce que ses briques savent faire.** La transcription peut durer (`transcriptionMs`, `fakes.ts:136`) et échouer
  (`echec`, `:137`) ; le serveur peut tarder sur sa première phrase (`premierMotMs`, `:186-188`). `FauxServeur.send`
  ne lève jamais (`:167-215`), et son numéro vient toujours après `numeroMs` (`:182`) : un envoi refusé ne s'écrit pas
  aujourd'hui. Le bouton « Faire taire » appelle `silence()`, donc `stop()`, à tout instant (`player.ts:111-116`).
- **La chaîne** (`npm run chaine`) joue la page construite, session comprise : la sonde remplace `getUserMedia`, le
  worklet et `fetch` (`src/presence/chaine/sonde.ts:107-192`). Elle ne sait injecter aucune panne de ce chantier
  (un micro lent à s'ouvrir, une transcription figée, un envoi refusé). Elle sert ici de garde contre une régression,
  pas de preuve. La toux de CrOliX n'est pas encore là : les scénarios de toux y restent « son manquant ».
- **Les mutations** (`npm run mutations`, `tools/mutations.json`) mutent le code au chargement et rejouent le niveau
  exact : elles n'atteignent que ce qu'il atteint.

Constat par constat, ce que la preuve montre avant le correctif, puis après :

- **I1**, hors du banc. `mute.test.ts`, une ouverture qui attend : la sourdine pendant l'ouverture laisse le micro
  ouvert. Après : il est arrêté, et une seule ouverture se fait à la fois.
- **I2**, hors du banc. `audio.test.ts`, nouveau : `addModule` rejette, les pistes ne sont jamais arrêtées. Après :
  arrêtées, le contexte fermé.
- **I6, la transcription**, au banc si la garde vit dans `Conversation`. `transcription-figee` : aucun échec, aucune
  reprise. Après : l'échec à la garde, puis la reprise.
- **I6, l'envoi**, au banc de même. `reponse-figee` : aucun `sans_reponse`. Après : `sans_reponse` à la garde.
  « Réfléchit » se prouve en test unitaire.
- **I7**, au banc par le bouton. `taire-a-vide` : un `silence` en trop, puis une phrase qui passe par `fenetre`.
  Après : rien d'écrit, la phrase écartée.
- **I8**, au banc. `toux-verdict-tardif` : elle reprend sur la parole commencée. Après : aucune reprise.
- **lun-luxuria#63**, au banc. `toux-puis-parole`, son `connus` d'aujourd'hui (384 ms). Après : 0 ms, `connus` retiré.
- **I9**, au banc, avec un refus dans le serveur faux. `fragment-refuse` : aucun `sans_reponse`, une retenue morte.
  Après : `sans_reponse`, rien de retenu.
- **I11**, au banc. `arrete-puis-question` : les synthèses du tour arrêté. Après : aucune, la réponse 2 plus tôt.
- **M1**, hors du banc : l'absence vit dans la session. `away.test.ts`, l'essai en service : le message part avant le
  retour. Après : le retour d'abord.
- **M2**, au banc. `nom-voisin` : « avant » passe pour « Agent » ; la table de `filter.test.ts`. Après : écartée.
- **M3**, au banc, selon le choix (« À trancher »).

Pour ce que le banc n'atteint pas, le plus petit moyen est le test unitaire, sur les montages qui existent : la
session avec `openMicrophone` simulé (`mute.test.ts:3-7`), la conversation qui garde chaque événement
(`src/conversation.test.ts:30`, `:67`). Faire écrire « réfléchit » au journal du joueur reste au chantier du banc
(lun-luxuria#67 à #75).

## Les choix **[avis]**

- **I1.** `#applyMic` sérialisé par une chaîne de promesses, comme `#frames` (`session.svelte.ts:146`, `:486`) :
  chaque appel attend le précédent, puis relit l'état voulu. Une ouverture finie alors que l'état voulu est devenu
  faux est arrêtée aussitôt. L'entrée attend toujours la sienne (`:319`).
- **I2.** `openMicrophone` arrête les pistes et ferme le contexte quand une étape après `getUserMedia` lève, puis relève
  l'erreur.
- **I6.** **Les gardes vivent dans `Conversation`**, sur le motif de `speaker.ts:145-150` : le banc les atteint, une
  seule place pour la transcription et l'envoi. `voice.ts` et `core.ts` ne changent pas.
  - La transcription : 15 s. À la garde, le chemin d'un échec de transcription (`conversation.ts:329-339`).
  - Le serveur : 60 s entre l'envoi et la première phrase de sa réponse (une `speech` reçue sur `live` avec son numéro,
    ou `done`). Pas de plafond sur le flux entier : un outil long peut le tenir ouvert. À la garde : « réfléchit »
    éteint, `sans_reponse`, la réponse oubliée au serveur comme par `#forget` (`:303-307`), le message de la personne
    gardé. Une réponse qui arrive après ne sonne pas.
- **I7.** `stop()` n'émet `silent` que si elle parlait (`speaking` vrai avant l'arrêt) ou si un tour était suspendu ;
  sinon il ne dit rien et rend `undefined`. Ni `core.ts` ni la session ne changent.
- **I8.** `#talking` posé à `start`, comme à `held`.
- **lun-luxuria#63.** Après une reprise ou une relâche, une voix qui commence dans les W ms la suspend aussitôt, sans
  attendre la tenue. W est un réglage du groupe `bargeIn`, 1000 ms par défaut, 0 le coupe, avec sa ligne dans
  Réglages. Dans `toux-puis-parole`, elle reprend à 3168, la parole commence à 3360 : suspendue à 3360, 0 ms de
  chevauchement. Son attente `exact` `suspendue-par-la-parole` passe de `[384, 416]` à `[0, 32]` depuis le début de la
  parole : le mécanisme change, le calcul en tête du scénario est refait. Les autres voies : « À trancher », point 2.
- **I9.** Un fragment dont l'envoi a échoué finit comme une phrase entière dont l'envoi a échoué (`:378-391`) : la
  phrase était pour elle, elle est coupée ; « réfléchit » s'éteint ; `sans_reponse` ; elle n'entre ni dans
  `#unjudged` ni dans `#unheard`.
- **I11.** `#oneClip` rend `null` sans synthèse pour un tour de `#gone`, sans rien écrire ni signaler d'échec.
- **M1.** `addressed` au passage du fragment, avant son envoi, une seule fois par phrase. Le commentaire de `#heard`
  (`session.svelte.ts:363`) devient vrai.
- **M2.** Au plus une lettre d'écart par quatre lettres du mot du nom, et jamais plus que `name.tolerance`. « Agent » :
  une (« avant » écarté, « agents » gardé) ; « natsume » : une (« nature » écarté, « natsumi » gardé) ; un nom de
  moins de quatre lettres : exact. Le réglage reste, son texte le dit (`Reglages.svelte:512-513`).
- **M3.** Rien ne change ; voir « À trancher », point 7.

## Les scénarios nouveaux

Données seules, leur calcul à la trame en tête, comme les dix-huit d'aujourd'hui. Chaque attente qui rate sur `main` a
son `connus` (l'issue chapeau, l'espèce et la valeur trouvées), retiré par la tâche qui corrige. Les instants
ci-dessous sont à refaire à la trame par le testeur.

- **`transcription-figee`** (I6). Elle parle seule ; la personne la suspend ; sa transcription ne répond pas
  (`transcriptionMs: 600000`) ; `jusqua` passé la garde. En `tous` : `transcrite` en `echec`, `sans_reponse`,
  `reprise_voix` ; en `exact`, l'échec à l'instant de la garde. Pas à la chaîne : une transcription ne s'y fige pas.
- **`reponse-figee`** (I6). Une demande ; la première phrase ne vient pas (`premierMotMs: 600000`) ; `jusqua` passé
  la garde. En `tous` : `sans_reponse`, et une `coupure_recue` vide pour la réponse 1. Pas à la chaîne, de même.
- **`fragment-refuse`** (I9). Elle parle seule ; la personne la suspend ; le serveur refuse le fragment (`refus`) ;
  puis une parole tenue pendant qu'elle se tait. En `tous` : `coupee`, `sans_reponse`, aucune `retenue` après la
  seconde parole. Pas à la chaîne : le vrai serveur ne refuse pas sur commande.
- **`toux-verdict-tardif`** (I8). `toux-puis-parole`, la toux en parole `(toux)` entendue vide, transcrite en 800 ms :
  le verdict vient à 3424, la parole d'après commence à 3360. En `tous` : aucune `reprise_voix` dans la parole 2. Pas
  de mesure de chevauchement : la toux y est une parole, que la mesure compterait. À la chaîne : son manquant.
- **`taire-a-vide`** (I7). Petit mode ; elle dit une phrase ; « Faire taire » 15 s plus tard, quand rien ne sonne ; 2 s
  après, une phrase sans son nom. En `tous` : aucun `silence` au geste, le verdict `ecartee`, rien d'envoyé. Sa source
  dit le vrai chemin : le lien perdu (`session.svelte.ts:280-286`), joué ici par le bouton, qui appelle le même
  `stop()`. Pas à la chaîne : le petit mode.
- **`arrete-puis-question`** (I11). Une réponse de quatre phrases, `syntheseMs: 1000` ; « Faire taire » au premier son ;
  une autre demande. En `tous` : aucune `synthese` de la réponse 1 après `arretee` ; en `exact`, le premier son de la
  réponse 2 à la valeur du calcul. À la chaîne, si elle s'y charge.
- **`nom-voisin`** (M2). Petit mode, le nom par défaut, aucune fenêtre ouverte. « On part avant midi », puis « Agent,
  tu m'entends ? », puis « Les agents arrivent ». En `tous` : la parole 1 `ecartee`, les paroles 2 et 3 `pour_elle`
  par `nom`. Pas à la chaîne : le petit mode.
- Un scénario que `charger(s, 'chaine')` refuse est nommé à `src/presence/scenarios.test.ts:34-35`, comme
  `phrase-ecartee`. La chaîne écarte les autres par `pourquoiPas` (`src/presence/chaine.test.ts:130-141`).

## Les tâches

**D'abord** : 0, qui rejoue I1 et I6 avant tout. **En parallèle après 0** : 1, 2, 3 et 5. **Après 3** : 4 (le même
`conversation.ts`). **En dernier** : 6, puis 7. Chaque fichier n'a qu'une tâche à la fois : 0 seule dans
`scenarios.test.ts`, `chaine.test.ts`, `fakes.ts` et `scenario.ts` ; 1 dans `session.svelte.ts` et `audio.ts` ; 2
dans `speaker.ts` ; 3 puis 4 dans `conversation.ts` et `conversation.test.ts` ; 4 dans `settings.ts` ; 4 puis 5 dans
`Reglages.svelte` ; 5 dans `filter.ts` ; 7 seule dans `tools/mutations.json`. Chaque tâche de code retire les
`connus` et passe en `it` les `it.fails` de ses constats, et seulement les siens.

0. - [ ] **Les preuves d'abord** (`testeur`). Seule, sur `fix/ecoute-et-parole` depuis `main`, dans un worktree.
   L'issue chapeau est ouverte avant.
   1. **I1 et I6, rejoués en premier**, sur `main`, avant toute autre preuve. Le résultat est écrit dans ce plan, sous
      « Ce que la tâche 0 a rejoué ». **Un défaut qui ne se montre pas** : la tâche s'arrête et le dit ; sa part de ce
      plan est rayée, ses tâches réduites.
      - I1, dans `mute.test.ts` : `mic.open` rend une promesse résolue à la main. (B) `toggleMute()` avant la
        résolution, puis la résolution : le `stop` du micro ouvert est appelé, `capturing` est faux ; de même avec
        `toggleMic()`. (A) Détection coupée, deux appels avant la résolution (`toggleMic` deux fois, ou
        `saveSettings`) : une seule ouverture à la fois, aucun flux ouvert sans son `stop`.
      - I6 : `transcription-figee` et `reponse-figee` (voir plus haut) ; dans `conversation.test.ts`, une transcription
        et un envoi qui ne répondent jamais, horloge fausse : « réfléchit » éteint en dernier, un `failed`.
   2. **Les autres preuves.**
      - `Reponse.refus?: string` (`src/presence/scenario.ts:158-173`) : `FauxServeur.send` lève ce message après
        `envoi_recu`, avant tout événement (`fakes.ts:167-171`), comme `CoreClient.send` sur une réponse refusée
        (`core.ts:58-62`). `pourquoiPas` écarte un scénario qui a un `refus`, une `transcriptionMs` ou un
        `premierMotMs` au-delà de leur garde.
      - Les cinq autres scénarios de « Les scénarios nouveaux » ; le compte de `scenarios.test.ts:29-31` passe à
        vingt-cinq.
      - `src/audio.test.ts` (I2) : `navigator.mediaDevices.getUserMedia` simulé, ses pistes espionnées ; `AudioContext`
        simulé dont `addModule` rejette, puis dont `AudioWorkletNode` lève : les pistes arrêtées, `close` appelé,
        l'erreur relevée.
      - `src/speech/speaker.test.ts` : `stop()` sans rien en cours n'émet rien et n'écrit pas `silence` (I7) ; un tour
        jeté avec des phrases en file n'en synthétise aucune (I11).
      - `conversation.test.ts` : un fragment refusé, puis la fin de phrase : « réfléchit » éteint en dernier, la
        coupure, aucune retenue (I9) ; un fragment qui passe : `addressed` avant l'appel à `send` (M1). `setup`
        (`:21-67`) gagne un envoi qui lève.
      - `away.test.ts` (M1) : un test comme celui de `:180-192`, l'essai en service :
        `['stopped', 'started', 'send']`.
      - `src/listen/filter.test.ts` (M2) : une table (mot entendu, nom, tolérance, attendu), avec les cas de « Le nom ».
   - Les tests unitaires qui ratent sur `main` s'écrivent `it.fails`, avec en commentaire le constat et l'issue :
     `npm test` reste vert. Les scénarios portent leurs `connus`.
   - Exclu : toucher un fichier de production ; changer une borne d'aujourd'hui.
1. - [ ] **Le micro** (`src/session.svelte.ts`, `src/audio.ts`, `dev-luxuria`). *Parallélisable* après 0. I1, I2.
   - « Les choix », I1 et I2. Les `it.fails` de `mute.test.ts` et `audio.test.ts` passent en `it`.
   - Exclu : changer `openMicrophone` au-delà du nettoyage ; la détection d'occupation ; WebView2.
2. - [ ] **Sa voix** (`src/speech/speaker.ts`, `dev-luxuria`). *Parallélisable* après 0. I7, I11.
   - « Les choix », I7 et I11. Les `connus` de `taire-a-vide` et `arrete-puis-question` retirés ; les `it.fails` de
     `speaker.test.ts` passent en `it`. Le motif de la mutation `f2` (`tools/mutations.json`) reste trouvé une fois.
   - Exclu : `core.ts`, la session ; un `AbortController` sur `/tts` ; élaguer `#gone`.
3. - [ ] **Rien n'attend sans fin** (`src/conversation.ts`, `dev-luxuria`). *Parallélisable* après 0. I6, I9, M1.
   - « Les choix », I6, I9 et M1. Les deux gardes en constantes exportées, à côté de `MAX_TRIES` (`:59-60`).
   - Les `connus` de `transcription-figee`, `reponse-figee` et `fragment-refuse` retirés ; les `it.fails` de
     `conversation.test.ts` et `away.test.ts` pour I6, I9 et M1 passent en `it`.
   - Exclu : `voice.ts`, `core.ts`, le service ; renvoyer un fragment refusé comme phrase entière.
4. - [ ] **Ne pas reprendre par-dessus** (`src/conversation.ts`, `src/settings.ts`, `src/Reglages.svelte`,
   `dev-luxuria`). Après 3. I8, lun-luxuria#63.
   - « Les choix », I8 et lun-luxuria#63, selon ce que CrOliX tranche. W dans `bargeIn` (`settings.ts:95`), sa ligne
     dans Réglages à côté de la tenue (`Reglages.svelte:550-556`), dans les mots de l'écran, sans parler de serveur.
   - Les `connus` de `toux-verdict-tardif` et celui de lun-luxuria#63 dans `toux-puis-parole` retirés ; son calcul et
     son attente `suspendue-par-la-parole` refaits.
   - Exclu : changer la tenue (`holdMs`) ou la fin de phrase ; une règle propre à l'écho.
5. - [ ] **Le nom** (`src/listen/filter.ts`, `dev-luxuria`). *Parallélisable* après 0, sauf sa ligne de Réglages,
   après 4. M2, et M3 si CrOliX en décide.
   - « Les choix », M2. Le `connus` de `nom-voisin` retiré ; la table de `filter.test.ts` en `it`. Le texte de la
     tolérance (`Reglages.svelte:512-513`) dit qu'un nom court en admet moins.
   - Exclu : un nom de plusieurs mots ; la liste des hallucinations, sauf décision sur M3.
6. - [ ] **Relecture** (`reviewer`). Après chaque tâche 1 à 5, sur son diff, contre ses critères ; puis le diff entier
   avant la PR. Un écart revient à sa tâche.
7. - [ ] **Les mutations, les suites, le plan coché** (`testeur`). Après 1 à 6.
   - [ ] Une mutation par correctif atteignable dans `tools/mutations.json` : la garde de transcription retirée
     (`transcription-figee`) ; celle du serveur (`reponse-figee`) ; `#talking` à `start` retiré
     (`toux-verdict-tardif`) ; W à 0 (`toux-puis-parole`) ; le fragment refusé laissé en vie (`fragment-refuse`) ;
     `stop()` qui émet toujours (`taire-a-vide`) ; la synthèse d'un tour jeté (`arrete-puis-question`) ; la
     tolérance absolue (`nom-voisin`). Le maillon de chacune est celui que son premier passage nomme, écrit ici. Un
     motif ancien trouvé deux fois après les tâches : la table suit, sans affaiblir la mutation.
   - [ ] `npm test` (sa durée), `lint`, `typecheck`, `format:check` ; `npm run scenarios`, le relevé lu ;
     `npm run mutations`.
   - [ ] `npm run chaine`, une partie par scénario avec Hortense : comparée à la course du 12/11
     (`banc-sons/chaine/taux/`) ; chaque écart nouveau écrit ici.
   - [ ] Plus aucun `it.fails`, plus aucun `connus` de l'issue chapeau ; ce plan coché, « Ce que l'exécution a
     trouvé » écrit. La feuille de route n'est pas touchée : le chantier « textes d'accord » la reprend.
   - [ ] À la fusion : le worktree retiré.

## Ce que la tâche 0 a rejoué

À écrire par la tâche 0 : pour I1 (A et B) et I6 (transcription, envoi), si le défaut s'est montré, comment, et ce
que ce plan en garde.

## Hors périmètre

- M4 (`live()` sans garde contre une connexion à moitié morte) et M5 (aucun rejeu des événements `live` perdus) : ils
  dépendent du serveur.
- Le banc, lun-luxuria#67 à #75 : un chantier à part, après celui-ci. Faire voir « réfléchit » au banc en fait partie.
- La barre de confiance des gestes (lun-luxuria#6) : à mesurer plus tard au banc.
- L'IPC Tauri et la surface publique : le chantier « textes d'accord ». La feuille de route aussi.
- Le flux RVC (lun-luxuria#7).
- La file du service sous `stt_lock` et `tts_lock` (`voix/service.py:209-210`) : une garde de la page n'y change rien.
- `Speaker.#gone` jamais élagué (`speaker.ts:61`) ; la chaîne `#frames` sans borne (`session.svelte.ts:146`, `:486`) ;
  la reconnexion de `live` à pause fixe (`core.ts:140`).
- **Trouvé en relisant, une issue à ouvrir** : un nom de plusieurs mots n'est jamais reconnu, `saysName` compare le
  nom entier à chaque mot entendu (`filter.ts:18-19`).
- Renvoyer un fragment refusé comme phrase entière ; réessayer un envoi.
- `linked`, qui mêle la présence et `live` (`session.svelte.ts:286`, `:332`, `:336`).

## Limites

- **Le niveau exact est une horloge fausse.** La durée réelle de l'ouverture du micro (l'invite de WebView2) et ce
  que fait un whisper-server figé ne sont pas mesurés. Les tests de la session simulent `openMicrophone` : ils prouvent
  l'ordre des appels, pas `getUserMedia`.
- **Les valeurs des gardes sont raisonnées, pas mesurées.** Une longue phrase sur `faster:small`, sur le processeur du
  laptop, pourrait passer 15 s ; un modèle local froid, 60 s avant sa première phrase.
- **Les gardes finissent l'attente de la page, pas celle du service** : whisper-server garde `stt_lock` jusqu'à 60 s
  par requête (`voix/service.py:62`, `:282`), et les requêtes en file y passent pour rien.
- **La suspension prompte et l'écho.** Si l'annulation d'écho rate, l'écho de sa voix qui reprend la suspendrait
  aussitôt. `echo-fort` ne joue aucune reprise : ce risque n'est pas mesuré.
- **Les valeurs par défaut** de W (1000 ms) et de la tolérance (une lettre pour quatre) sont devinées, comme les
  préréglages de l'écoute : à mesurer sur le desktop, avec whisper-server et la vraie voix.
- **La chaîne ne joue pas ces pannes**, et pas encore les toux : elle ne garde que contre une régression.
- **Non vérifié** : ce que le serveur fait d'un message reçu pendant une absence (lun-luxuria#53) ; ce qu'il envoie
  pendant un long outil (Lun'Anima n'est pas lu ici) : la garde de l'envoi s'arrête donc à la première phrase.

## À trancher par CrOliX

1. **Le plan entier**, tâches 0 à 7. Je recommande de le valider : chaque correctif a sa preuve avant et après, et
   I1 et I6 sont rejoués avant d'être corrigés.
2. **lun-luxuria#63.** (a) **Recommandé** : la suspension prompte, une voix qui commence dans les 1000 ms après une
   reprise ou une relâche la suspend aussitôt ; `toux-parole` et `toux-reflexion` ne bougent pas. (b) Une attente
   avant chaque reprise (300 ms par exemple) : rien à craindre de l'écho, mais le blanc de `toux-parole` passe de
   768 à 1068 ms, `toux-puis-parole` ne reprend plus du tout, et une parole qui vient après l'attente reprend les
   384 ms. (c) Corriger I8 seul, et laisser lun-luxuria#63 ouverte.
3. **Où vivent les gardes de I6.** Recommandé : dans `Conversation`, que le banc atteint. L'autre voie :
   `AbortSignal.timeout` dans `voice.ts` et `core.ts`, qui coupe la requête, mais que le banc n'atteint pas et qui ne
   libère rien dans le service.
4. **Les valeurs de I6.** Recommandé : 15 s pour la transcription ; 60 s jusqu'à la première phrase de la réponse ; à
   la garde, la réponse abandonnée et oubliée au serveur, le message de la personne gardé. L'autre voie : laisser
   sonner une réponse qui arrive après la garde.
5. **I9.** Recommandé : un fragment refusé finit comme une phrase entière refusée, coupée et sans réponse. L'autre
   voie : le traiter comme un fragment retiré, elle reprend ce qu'elle disait ; mais la phrase était pour elle.
6. **M1 (lun-luxuria#53).** Recommandé : `addressed` au passage du fragment, avant son envoi. L'autre voie : corriger
   seulement le commentaire de `#heard` et laisser le fragment partir avant le retour.
7. **M3, « Merci. » seul.** Recommandé : rien ne change, jusqu'à la toux de CrOliX et whisper-server sur le desktop ;
   un « Merci. » perdu ne coûte qu'une réponse, un « Merci. » inventé dans la fenêtre lui ferait dire « de rien » à
   une toux. Les autres voies : le laisser passer dans la fenêtre seulement ; le juger par sa confiance (non mesuré).
8. **M2.** Recommandé : une lettre d'écart par quatre lettres du nom, au plus la tolérance réglée. L'autre voie : une
   par trois lettres, qui garde plus de variantes, mais « nature » passerait encore pour « natsume ».
9. **`it.fails`**, le `connus` des tests unitaires : recommandé, la preuve reste écrite sur la branche entre la tâche
   0 et son correctif. L'autre voie : chaque test écrit et vu rater dans la tâche qui corrige, sans trace avant.
10. **L'issue chapeau à ouvrir dans lun-luxuria**, avant la tâche 0 : « L'écoute et la parole : la sourdine tient le
    micro, rien n'attend sans fin, elle ne reprend pas par-dessus », étiquette `niveau:standard`, le lien vers ce
    plan, les constats gardés, et la PR qui la ferme avec lun-luxuria#63 et #53.
