# Rien ne reste ouvert ni n'attend : le micro, la transcription, l'envoi et sa voix. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** lun-luxuria#77 (chapeau).
>
> **Validé par CrOliX le 12/11** (« je valide ») : les gardes à 15 s pour la transcription (confirmées par la tâche
> 1) et 60 s jusqu'à la première phrase ; les sondages de `/voix/micro` qui s'empilent corrigés dans la tâche 2.
>
> **Amendé le 13/11.** La garde de transcription passe à 20 s, par la règle de la tâche 1. Deux défauts trouvés à la
> relecture de la tâche 4, déjà sur `main`, entrent dans ce chantier (CrOliX, le 13/11) : I9 par une réponse en erreur
> (tâche 4 bis) et I12, la file de sa voix bloquée par un fragment raté qui a reçu son numéro (tâche 5).
>
> **État : rédigé le 12/11, relu par le plan-challenger (« à amender »), amendé le 12/11.**
> Le chantier « Écoute et parole » est validé dans son principe le 12/11 (« ok je valide »). Le manager l'a coupé en
> deux, d'après le plan-challenger : ce plan-ci, sans décision produit sauf les valeurs des gardes, qui démarre à la
> validation ; puis « le tour » (I8, lun-luxuria#63, #53, le nom), décrit à la fin et planifié après.
>
> **PR :** celle de l'axe de la présence pour ce plan (lun-docs#162) ; celle de Lun'Luxuria s'ouvre avec la première
> tâche de code. Lun'Anima n'est pas touché.

**But :** que rien ne reste ouvert ni n'attende sans fin. Le micro coupé par la sourdine l'est vraiment, et un micro
qui n'a pas pu s'ouvrir ne garde rien. Une transcription ou une réponse qui ne vient pas a sa garde. Sa voix ne garde
rien d'un tour jeté, et un arrêt à vide ne rouvre pas l'écoute de la pièce. Chaque correctif a sa preuve, vue rater sur
`main` avant d'être tenue.

**Ce que ce chantier règle**, les constats de l'audit du 12/11 :

- **I1** : le micro s'ouvre malgré la sourdine, ou deux fois, quand on agit pendant son ouverture.
- **I2** : un micro dont le worklet n'a pas pu se créer reste ouvert, sans plus personne pour le fermer.
- **I6** : une transcription ou une réponse qui ne vient pas laisse la page attendre sans fin, « réfléchit » allumé,
  sa voix suspendue.
- **I7** : un serveur injoignable garde la pièce « adressée » et remplit le déroulé.
- **I9** : « réfléchit » reste allumé après un fragment que le serveur a refusé.
- **I11** : sa voix synthétise encore les phrases d'un tour jeté, et la réponse suivante les attend.
- **I12** (13/11) : un fragment dont l'envoi lève après son numéro laisse un tour retenu qui ne finit jamais ; plus
  aucune réponse ne sonne ensuite.

**Source :** l'audit en lecture de Lun'Luxuria du 12/11 sur `main` (`11eb3d1`), rendu en message, ses constats lus
dans le code et jamais rejoués ; sa synthèse, § 2 « Écoute et parole ». Le plan-challenger, le 12/11, « à amender », et
ce que le manager en a retenu. Le code relu sur `main` (`11eb3d1`) le 12/11, constat par constat ; les lignes citées
sont celles de ce `main`. Lun'Anima lu en local pour deux comportements (une réponse coupée, un message reçu pendant
une absence), écrits ici sans rien de son intérieur. Les relevés de durée : `lun-luxuria/docs/essai-2026-11-07.md` et
le plan [des données et des taux](2026-11-12-donnees-et-taux.md).

**Critères de fin** (Lun'Luxuria, en local) :

- Chaque défaut a son test ou son scénario, écrit d'abord et vu rater sur `main`, son message d'échec collé dans ce
  plan (« Ce que les preuves ont montré sur `main` »), puis tenu après le correctif. Aucun `connus` ni `it.fails` de
  ce chantier.
- `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check` passent. La durée de `npm test`, mesurée sur
  `main` puis sur la branche, ne grandit pas de plus de cinq secondes.
- `npm run scenarios` joue vingt-quatre scénarios, chacun deux fois à l'identique, tous tenus. Les dix-huit
  d'aujourd'hui gardent leurs verdicts ; un verdict changé s'explique ici avant d'être accepté.
- `npm run mutations` : chaque mutation, ancienne ou nouvelle, fait échouer son maillon ; aucune n'en double une autre.
- `npm run chaine`, une partie par scénario avec Hortense : aucun échec nouveau par rapport à la course du 12/11.
- La garde de transcription est fixée après la mesure d'une phrase de 30 s (tâche 1).
- La preuve à la main sur le laptop (tâche 8) est écrite ici, chaque écart avec son issue.
- La PR ferme l'issue chapeau.

| Dépôt, branche | Issue | PR | Niveau |
|---|---|---|---|
| `lun-luxuria`, `fix/rien-ne-reste-ouvert` | chapeau à ouvrir (voir la fin) | à ouvrir | `standard` |
| `lun-docs`, `docs/deroule-tour` | la même | lun-docs#162 | `trivial` |

## Ce que le code fait aujourd'hui

### Le micro (I1, I2)

- **`#applyMic`** (`src/session.svelte.ts:436-462`) compare l'état voulu à `#mic !== null` (`:443`), puis attend
  `openMicrophone` (`:457`). Rien ne tient pendant l'attente : `#mic` reste `null` jusqu'à la fin de l'ouverture.
- **Sept appelants**, dont aucun ne sait qu'une ouverture est en cours : `saveSettings` (`:176`), `enter` (`:319`),
  `#pollBusy` (`:418`, `:431`), `toggleMic` (`:547`), `toggleMute` (`:560`), `takeBackMic` (`:566`), `setLayout`
  (`:572`). Détection d'occupation coupée (`busy.on` faux ; vrai par défaut, `src/settings.ts:93`), `#pollBusy` le
  rappelle toutes les 3 s (`:33`, `:294`, `:416-418`).
- **Deux courses.** (A) Un appel pendant une ouverture voit `#mic === null` et ouvre un second flux ; le premier est
  écrasé à `:457` sans être arrêté. (B) La sourdine, le micro coupé ou une disposition muette pendant l'ouverture :
  l'état voulu est faux, `#mic` encore `null`, et `:443` rend la main sans rien faire. L'ouverture finit, pose `#mic` et
  `capturing` (`:457-458`) : le micro est ouvert en sourdine. Détection en service (le défaut), rien ne le referme
  avant le prochain appel ; détection coupée, le prochain tour de `#pollBusy`, dans les 3 s.
- **Micro ouvert en sourdine** : chaque phrase est transcrite (`src/conversation.ts:328`) avant que la sourdine ne la
  retienne (`:348`) ; une tenue suspend sa voix sans regarder la sourdine (`:187-195`). Rien ne part au serveur.
- **La durée de la course** est celle de `getUserMedia` : l'invite d'autorisation, dans un onglet, la première fois ;
  dans WebView2, non vérifié.
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
  Côté serveur, fermer ce flux ne fait que se désabonner ; une réponse **coupée**, elle, cesse d'être produite.
- **Les gardes qui existent.** La synthèse : `Promise.race` contre 5 s (`src/speech/speaker.ts:43`, `:145-150`). Le
  mode seul : 60 s, mais sur tout le flux du modèle, par un signal (`src/local.ts:14`, `:205`).
- **Les durées de transcription relevées.** À la chaîne, `tiny` sur le laptop : 343 à 665 ms (plan des données et des
  taux, tâche 0, point 5). Sur le desktop (`essai-2026-11-07.md:43-48`, phrases courtes) : whisper.cpp `medium` sur la
  carte, 553 ms en médiane, 625 au 95e centile ; `faster-whisper small` sur le processeur, 2 270 et 2 565 ;
  `whisper.cpp small` sur le processeur, 2 058 et 2 172 ; `medium` sur le processeur, jusqu'à 7 734. À la chaîne sur
  le laptop, `small` compris : 0,3 à 2 s (plan [de la chaîne sur le laptop](2026-11-11-chaine-laptop.md)). Aucune
  phrase longue n'a été mesurée.
- **Trouvé en relisant, pour l'épuisement des connexions.** `#pollBusy` lance `/voix/micro` toutes les 3 s
  (`session.svelte.ts:294`, `:420-421`), sans délai ni signal (`voice.ts:30-34`), et sans attendre le précédent. Un
  service figé : une requête pendue de plus toutes les 3 s. Dans un onglet, la page joint le service et le serveur par
  sa propre origine, le mandataire de Vite (`src/desktop/net.ts:37-39`) : six connexions par hôte en HTTP/1.1, dont une
  tenue par `live`. En quinze secondes environ, toute requête de la page attendrait, l'envoi compris. Dans la fenêtre,
  le service est joint en direct (`net.ts:8`, `:28-31`) et le serveur par le `fetch` de la fenêtre : seule la voix
  attendrait. Lu dans le code, pas vu.

### Le fragment refusé (I9)

- Un fragment qui passe le filtre est marqué `passed` (`conversation.ts:382`), puis envoyé (`:384-386`). Si l'envoi
  lève, le `catch` éteint « réfléchit » et dit l'échec, mais n'appelle `#noAnswer` que pour une phrase confirmée
  (`:387-392`) : le fragment reste en vie.
- La fin de phrase le confirme (`:442-456`) : `#awaits` le met dans `#unjudged` et `#unheard` (`:240-244`), puis
  `addressed` et `#supersede`, qui la coupe et le retire aussitôt de `#unjudged` (`:291`) ; enfin « réfléchit » est
  rallumé (`:451`). Seul `#unheard` le garde.
- Rien n'y répondra : « réfléchit » reste allumé. Une parole suivante, tenue pendant qu'elle se tait, retient cette
  tentative morte (`:256-263`), puis la relâche en rallumant « réfléchit » (`:281`).
- Un échec de transcription sur un fragment, lui, le marque `dropped` (`:333`), et la fin de phrase le traite (`:223`).

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

## Les constats gardés et écartés

| Constat | Verdict | Pourquoi |
|---|---|---|
| I1, la course du micro | gardé | les deux courses se lisent ; leur durée réelle n'est pas mesurée |
| I2, le flux qui fuit | gardé | chaque nouvel essai en laisse un de plus |
| I6, les attentes sans fin | gardé, nuancé | whisper-server s'arrête à 60 s dans le service ; `faster` jamais |
| I7, `link(false)` répété | gardé, corrigé à sa racine | c'est `stop()` à vide qui écrit et rouvre la fenêtre |
| I9, « réfléchit » après un fragment raté | gardé, corrigé | seul `#unheard` garde la tentative morte |
| I11, la file pour un tour jeté | gardé, en partie | sauter la synthèse, oui ; couper `/tts` ne libère rien |
| I12, la file bloquée par un fragment raté | gardé (13/11) | vu à la sonde du relecteur : la réponse suivante ne sonne pas |
| I8, lun-luxuria#63, M1 (#53), M2, M3 | au chantier suivant | ils demandent des choix sur le tour (voir la fin) |

Écartés, avec leur raison :

- **La garde de l'audit pour I7** (`if (up !== this.linked)` dans la session) : une présence ratée met `linked` à faux
  pendant que `live` tourne (`session.svelte.ts:336`). La perte de `live` qui suit verrait `up === this.linked`, et ne
  couperait plus ni sa voix ni « réfléchit ». `stop()` à vide qui ne dit rien suffit : la répétition de `link(false)`
  devient sans effet.
- **Couper la requête `/tts` à la garde de 5 s** (I11) : le service finit sa synthèse sous `tts_lock`
  (`voix/service.py:290`), que la page coupe ou non.

## Ce qui se prouve, et comment

**Ce que le banc et les tests prouvent** : que le code fait ce que sa lecture dit, avant puis après le correctif. Ils
rejouent la logique sur une horloge et des briques fausses. Ils ne mesurent ni l'invite de WebView2, ni un
whisper-server figé, ni un processus suspendu, ni les connexions du navigateur : ce sont les essais à la main de la
tâche 8, sur le laptop, puis le desktop (« Ce que le desktop vérifiera »).

**Ce que le banc atteint.**

- **Le niveau exact** (`npm test`, `npm run scenarios`) joue les vrais `Endpointer`, `Conversation`, son filtre,
  `Speaker` et `Trace`, câblés comme la session, sur l'horloge fausse (`src/presence/player.ts:41-175`). Sont fausses :
  la probabilité de voix, la transcription, le serveur, la synthèse et la sortie (`src/presence/fakes.ts`).
- **Il n'atteint pas** `session.svelte.ts`, `audio.ts`, `voice.ts`, `core.ts`, ni `voix/service.py`. Les événements de
  la conversation vers la session (`thinking`, `addressed`, `failed`) tombent dans `on: () => {}` (`player.ts:87`) :
  « réfléchit » ne se voit pas au banc.
- **Ses briques** : la transcription peut durer (`transcriptionMs`, `fakes.ts:136`) et échouer (`echec`, `:137`) ; le
  serveur peut tarder sur sa première phrase (`premierMotMs`, `:186-188`), mais `send` ne lève jamais (`:167-215`).
  Le geste « Faire taire » appelle `convo.silence()`, donc `stop()`, à tout instant (`player.ts:110-115`,
  `conversation.ts:484-488`).
- **La chaîne** joue la page construite, session comprise : la sonde remplace `getUserMedia`, le worklet et `fetch`
  (`src/presence/chaine/sonde.ts:107-192`). Elle ne sait injecter aucune de ces pannes : elle garde contre une
  régression. La toux de CrOliX n'est pas encore là : les scénarios de toux y restent « son manquant ».
- **Les mutations** mutent le code au chargement et rejouent le niveau exact : elles n'atteignent que ce qu'il atteint.

**Défaut par défaut**, ce que la preuve montre sur `main`, puis après :

- **I1**, hors du banc. `mute.test.ts`, une ouverture qui attend : la sourdine pendant l'ouverture laisse le micro
  ouvert. Après : il est arrêté, et une seule ouverture se fait à la fois. À la main : tâche 8.
- **I2**, hors du banc. `src/audio.test.ts`, nouveau : `addModule` rejette, les pistes ne sont jamais arrêtées. Après :
  arrêtées, le contexte fermé.
- **I6, la transcription**, au banc : la garde vit dans `Conversation`. `transcription-figee` : aucun échec, aucune
  reprise. Après : l'échec à la garde, puis la reprise. `transcription-lente` : la réponse tardive envoyée. Après :
  ignorée. « Réfléchit », la requête coupée, l'essai retiré : tests unitaires. À la main : tâche 8.
- **I6, l'envoi**, au banc de même. `reponse-figee` : aucun `sans_reponse`. Après : `sans_reponse` et la coupure à la
  garde. « Réfléchit » et le numéro tardif : tests unitaires. À la main : tâche 8.
- **I7**, au banc par le bouton. `taire-a-vide` : un `silence` en trop, puis une phrase qui passe par `fenetre`.
  Après : rien d'écrit, la phrase écartée. Le vrai chemin, le lien perdu, n'est pas au banc.
- **I9**, au banc, avec un refus dans le serveur faux. `fragment-refuse` : aucun `sans_reponse`, une retenue morte.
  Après : `sans_reponse`, rien de retenu. « Réfléchit » : test unitaire.
- **I11**, au banc. `arrete-puis-question` : des synthèses commencent pour le tour arrêté. Après : aucune ne commence.
  Le gain avec la vraie synthèse : au desktop.

Pour ce que le banc n'atteint pas, le plus petit moyen est le test unitaire, sur les montages qui existent : la
session avec `openMicrophone` simulé (`mute.test.ts:3-7`), la conversation qui garde chaque événement
(`src/conversation.test.ts:30`, `:67`). Faire écrire « réfléchit » au journal du joueur reste au chantier du banc.

## Les choix **[avis]**

- **I1.** `#applyMic` sérialisé par une chaîne de promesses, comme `#frames` (`session.svelte.ts:146`, `:486`) :
  chaque appel attend le précédent, puis relit l'état voulu. Une ouverture finie alors que l'état voulu est devenu
  faux est arrêtée aussitôt. L'entrée attend toujours la sienne (`:319`).
- **I2.** `openMicrophone` arrête les pistes et ferme le contexte quand une étape après `getUserMedia` lève, puis relève
  l'erreur.
- **I6, les gardes, dans `Conversation`**, sur le motif de `speaker.ts:145-150`. `core.ts` ne change pas.
  - **Réglée une fois.** Une garde par essai ; elle ne se déclenche qu'une fois, et ignore toute réponse tardive :
    une transcription arrivée après elle ne rappelle pas `#noAnswer` et n'envoie rien ; un `reply` arrivé après elle
    est oublié (`#forget`, `conversation.ts:303-307`).
  - **Un essai retiré** (`#dropAttempt`, `:432-439`) annule ses gardes.
  - **La transcription** : 20 s, d'après la mesure de la tâche 1 (une phrase de 30 s sur `faster:small`). À la
    garde, le chemin d'un échec de transcription (`:329-339`). Elle coupe aussi la requête : un signal passé à la
    dépendance `stt` et à `transcribe` (`voice.ts:14-15`), comme `local.ts:205`. La connexion du navigateur est rendue ;
    le service, lui, finit son calcul sous son verrou.
  - **Le serveur** : 60 s entre l'envoi et la première phrase de sa réponse (une `speech` reçue sur `live` avec son
    numéro, ou `done`). Pas de plafond sur le flux entier : un outil long peut le tenir ouvert. À la garde :
    « réfléchit » éteint, `sans_reponse`, la réponse coupée au serveur si son numéro est venu (il cesse alors de la
    produire), et le message de la personne gardé.
- **I7.** `stop()` garde sa valeur de retour et l'abandon des tours. Seule l'émission de `silent` devient
  conditionnelle : si une phrase d'elle est montrée depuis son dernier `silent` (`#shown`, posé au `subtitle`, retiré
  au `silent` ; sur la branche, `speaker.ts:66-67`), ou si un tour était suspendu (`:303`) ; jamais sur le drapeau
  `cut`. Pas `speaking` : entre deux tours, ou après des mots montrés sans voix, la page la montre encore alors que
  `speaking` est faux (`25c8af3`, `speaker.test.ts:183-205`). `speaker.test.ts:157-161` passe encore. Ni `core.ts` ni
  la session ne changent.
- **I9.** Un fragment dont l'envoi a échoué finit comme une phrase entière dont l'envoi a échoué (`:378-391`) : coupée
  par `#supersede`, la phrase était pour elle ; « réfléchit » éteint ; `sans_reponse` ; il ne reste pas dans
  `#unheard`.
- **I11.** `#oneClip` rend `null` sans synthèse pour un tour de `#gone`, sans rien écrire ni signaler d'échec. Une
  synthèse déjà commencée finit.
- **Les écarts acceptés à l'exécution**, aux relectures des tâches 4 bis et 5. Les lignes sont celles de la branche à
  `7ac8d50`.
  - **4 bis.** La tentative passe encore par `#awaits`, puis rend la place à celle d'avant (la tâche le dit). `setup`
    reçoit une `Trace`.
  - **La garde du serveur est un minuteur à part**, posé à l'envoi (`conversation.ts:420-422`), pas une course contre
    `send` : son flux peut finir, ou casser, et ses phrases venir quand même, ou jamais. Elle s'éteint à la première
    phrase (`:152`), à `done` (`:470`), au retrait (`:502`) et quand la phrase est remplacée (`:322`). La garde de
    transcription, elle, suit le motif de `speaker.ts` (`:354-362`).
  - **Le message à la garde** : « Sa réponse n'est pas venue : aucune phrase en 60 s » (`#late`, `:441-448`). La garde
    dit l'échec comme un envoi raté.
  - **`failed` posé aussi sur une phrase confirmée dont l'envoi a raté** (`#sendFailed`, `:433-439`), pas seulement sur
    un fragment. La garde le lit : un envoi qui a levé ne redit pas son échec à 60 s (`:446-447`), et son tour, qui ne
    retenait plus que sa voix, est coupé par `#forget` (I12).
  - **`pourquoiPas` et `>=`** : la chaîne écarte une `transcriptionMs` ou un `premierMotMs` égal à sa garde ou au-delà
    (`chaine.test.ts:139-140`), pas seulement au-delà.
  - **Le commit du test, rouge au typecheck** : `963a5fb` passe un signal à `transcribe`, qui ne le prend qu'avec le
    correctif ; `npm run typecheck` n'y passe pas. Sans effet après le squash.
  - **L'essai retiré ne coupe pas sa requête de transcription.** `#dropAttempt` appelle `#answered` (`:502`), qui
    éteint le seul minuteur `guard`, celui de la transcription compris. Ses gardes sont annulées, comme prévu, mais sa
    requête `/voix/stt` reste ouverte jusqu'à la réponse du service, même au-delà de 20 s.
  - **Le correctif de `#supersede`** (`7435dc5`, `7ac8d50`). Remplacer une phrase appelait `#answered` sur elle, qui
    éteignait aussi sa garde de transcription : une phrase retenue pendant sa transcription, puis remplacée,
    n'échouait plus jamais. `#supersede` n'éteint plus que la garde d'une phrase qui attend sa réponse (`:322`).

## Les scénarios nouveaux

Données seules, leur calcul à la trame en tête, comme les dix-huit d'aujourd'hui, sans `connus` : chacun rate sur
`main`, son message est collé ici, puis il tient. Les instants sont à refaire à la trame par la tâche qui l'écrit.

- **`taire-a-vide`** (I7, tâche 3). Petit mode ; elle dit une phrase ; « Faire taire » 16 s après sa fin, la fenêtre
  fermée (elle tient 15 s bornes comprises, `filter.ts:53`) ; 2 s après, une phrase sans son nom. En `tous` : aucun
  `silence` au geste, le verdict `ecartee`, rien d'envoyé. Sa source dit le vrai chemin, le lien perdu
  (`session.svelte.ts:280-286`), joué ici par le geste, qui appelle le même `stop()`. Pas à la chaîne : le petit mode.
- **`arrete-puis-question`** (I11, tâche 3). Une réponse de quatre phrases, `syntheseMs: 1000` ; « Faire taire » au
  premier son ; une autre demande. En `tous` : aucune `synthese` d'étape `debut` pour la réponse 1 après `arretee`. La
  synthèse déjà en cours finit et compte dans le premier son de la réponse 2, une attente `exact` à la valeur du
  calcul. À la chaîne, si elle s'y charge.
- **`fragment-refuse`** (I9, tâche 4). Elle parle seule ; la personne la suspend ; le serveur refuse le fragment
  (`refus`) ; puis une parole tenue pendant qu'elle se tait. En `tous` : `coupee`, `sans_reponse`, aucune `retenue`
  après la seconde parole. Pas à la chaîne : le vrai serveur ne refuse pas sur commande.
- **`transcription-figee`** (I6, tâche 5). Elle parle seule ; la personne la suspend ; sa transcription ne répond pas
  dans la partie (`transcriptionMs: 600000`, `jusqua` passé la garde). En `tous` : `transcrite` en `echec`,
  `sans_reponse`, `reprise_voix` ; en `exact`, l'échec à l'instant de la garde. Pas à la chaîne.
- **`transcription-lente`** (I6, tâche 5). Le même, mais la transcription répond entre la garde et `jusqua` (20 s pour
  une garde de 15). En `tous` : l'échec à la garde ; après lui, aucun `verdict`, aucun `envoi_recu`, aucun second
  `sans_reponse` (une attente `absent` ancrée sur le premier : le juge n'a pas d'attente sur un nombre,
  lun-luxuria#74). Pas à la chaîne.
- **`reponse-figee`** (I6, tâche 5). Une demande ; la première phrase ne vient pas (`premierMotMs: 600000`, `jusqua`
  passé la garde). En `tous` : `sans_reponse`, une `coupure_recue` vide pour la réponse 1. Pas à la chaîne.

Un scénario que `charger(s, 'chaine')` refuse est nommé à `src/presence/scenarios.test.ts:34-35`, comme
`phrase-ecartee`. La chaîne écarte les autres par `pourquoiPas` (`src/presence/chaine.test.ts:130-141`), sur `refus`
(tâche 4) et sur les gardes exportées (tâche 5).

## Les tâches

**Dès la validation, en parallèle** : 1, 2 et 3. **Après 3** : 4. **Après 1, 2 et 4** : 5. **Après chacune de 2 à
5** : 6, sa relecture. **En dernier** : 7, puis 8.

Chaque fichier n'a qu'une tâche à la fois : 2 puis 5 dans `session.svelte.ts` ; 2 seule dans `audio.ts` ; 3 seule dans
`speaker.ts` ; 3, 4 puis 5 dans `scenarios.test.ts` et `chaine.test.ts` ; 4, 4 bis puis 5 dans `conversation.ts` et
`conversation.test.ts` ; 4 seule dans `fakes.ts` et `scenario.ts` ; 5 seule dans `voice.ts` ; 7 seule dans
`tools/mutations.json`. **`speaker.ts`** : seule la tâche 3 y touche ; les scénarios de 4 et 5 n'en dépendent pas, leur
coupure passe par `cutSuspended` (`speaker.ts:261-283`), jamais par `stop()` à vide ni par une file jetée.

Chaque tâche de code suit le même ordre : son test ou son scénario d'abord, vu rater sur `main`, le message d'échec
collé sous « Ce que les preuves ont montré sur `main` », puis le correctif, puis tout `npm test`.

1. - [x] **La mesure de la garde** (`testeur`, sur le laptop, hors dépôt). *Parallélisable.*
   - Le service seul (`uv run voix/service.py --stt faster:small --tts aucun`), au repos, sur secteur. Un son de 30 s de
     parole française : des prises de `banc-sons` mises bout à bout, ou une lecture d'Hortense. Cinq appels à `/stt`,
     leur durée ; puis le même sur `faster:tiny`.
   - Écrit ici, avec la valeur que la tâche 5 prend : 15 s si le plus long reste sous la moitié, sinon le double du plus
     long arrondi aux 5 s au-dessus, et CrOliX le sait avant la tâche 5.
   - Exclu : `medium` sur le processeur ; whisper-server (le desktop).
   - **Mesuré le 13/11**, sur secteur, sans test ni build en cours ; un son de 32,7 s, huit prises de `banc-sons` mises
     bout à bout. `faster:small` : 5,29, 4,51, 4,48, 5,56 et 6,71 s (chauffe 4,48). `faster:tiny` : 1,37 à 1,45 s.
     Un premier passage, coupé avant d'être écrit, donnait 7,14 à 8,05 s sur `small`, sans cause trouvée. Le plus
     long des deux, 8,05 s, dépasse la moitié de 15 s : la garde vaut **20 s** (le double, arrondi aux 5 s).
2. - [x] **Le micro** (`src/session.svelte.ts`, `src/audio.ts`, `dev-luxuria`). *Parallélisable.* I1, I2.
   - D'abord, dans `mute.test.ts` : `mic.open` rend une promesse résolue à la main. (B) `toggleMute()` avant la
     résolution, puis la résolution : le `stop` du micro ouvert est appelé, `capturing` est faux ; de même avec
     `toggleMic()`. (A) Détection coupée, deux appels avant la résolution (`toggleMic` deux fois, ou `saveSettings`) :
     une seule ouverture à la fois, aucun flux ouvert sans son `stop`.
   - D'abord, `src/audio.test.ts` : `navigator.mediaDevices.getUserMedia` simulé, ses pistes espionnées ;
     `AudioContext` simulé dont `addModule` rejette, puis dont `AudioWorkletNode` lève : les pistes arrêtées, `close`
     appelé, l'erreur relevée.
   - Puis « Les choix », I1 et I2.
   - Exclu : changer `openMicrophone` au-delà du nettoyage ; la détection d'occupation ; WebView2.
3. - [x] **Sa voix** (`src/speech/speaker.ts`, `dev-luxuria`). *Parallélisable.* I7, I11.
   - D'abord : `taire-a-vide` et `arrete-puis-question`, le compte de `scenarios.test.ts:29-31` à vingt ; dans
     `speaker.test.ts`, `stop()` sans rien en cours n'émet rien et n'écrit pas `silence`, et un tour jeté avec des
     phrases en file n'en synthétise aucune.
   - Puis « Les choix », I7 et I11. `speaker.test.ts:157-161` passe encore. Les motifs des mutations `f1` et `f2`
     (`tools/mutations.json`, `speaker.ts:239`, `:304`) restent trouvés une fois chacun.
   - Exclu : `core.ts`, la session ; un `AbortController` sur `/tts` ; élaguer `#gone`.
4. - [x] **Le fragment refusé** (`src/conversation.ts`, `dev-luxuria`). Après 3. I9.
   - D'abord : `Reponse.refus?: string` (`src/presence/scenario.ts:158-173`), que `FauxServeur.send` lève après
     `envoi_recu`, avant tout événement (`fakes.ts:167-171`), comme `CoreClient.send` sur une réponse refusée
     (`core.ts:58-62`) ; `pourquoiPas` écarte un scénario qui a un `refus`. `fragment-refuse`, le compte à vingt et un.
     Dans `conversation.test.ts`, `setup` (`:21-67`) gagne un envoi qui lève, à côté de `refuse` (`:26`, `:48`), qui
     rend une réponse en erreur : un fragment refusé, puis la fin de phrase, « réfléchit » éteint en dernier, la
     coupure, aucune retenue ensuite.
   - Puis « Les choix », I9. Les motifs des mutations `b` et `c` restent trouvés une fois chacun.
   - Exclu : renvoyer un fragment refusé comme phrase entière ; réessayer un envoi.

4 bis. - [x] **La réponse en erreur d'un fragment** (`src/conversation.ts`, `dev-luxuria`). Après 4. I9 par un second
   chemin, trouvé à la relecture de la tâche 4 (13/11).
   - D'abord, dans `conversation.test.ts` : un fragment dont la réponse finit en erreur (`done`, `status: 'error'`)
     avant la fin de phrase ; « réfléchit » éteint en dernier, un seul `sans_reponse`, aucune retenue à la parole
     suivante. Vu rater sur `main`.
   - Puis le correctif : `#onTurn` (`:412-420`) écrit déjà `sans_reponse` ; `#commit` ne rallume pas « réfléchit »,
     sans écrire `sans_reponse` une seconde fois. La tentative passe encore par `#unheard`, que `#supersede` lit
     pour libérer une réponse d'avant qu'elle remplace, puis rend la place à celle d'avant (corrigé à la relecture :
     sans ce passage, la réponse d'avant reste retenue ; un test le fige).
   - Exclu : le message « Sa réponse n'est pas venue », affiché dès le refus d'un fragment (`:394`), en `inbox`.
   - Commits : `28dec5a` le test, `56d8a97` le correctif ; à la relecture, `cfdd8e0` le test de la réponse remplacée et
     `1819731` les commentaires.
5. - [x] **Les gardes** (`src/conversation.ts`, `src/voice.ts`, `src/session.svelte.ts`, `dev-luxuria`). Après 1, 2,
   4 et 4 bis. I6 et I12.
   - D'abord : `transcription-figee`, `transcription-lente`, `reponse-figee`, le compte à vingt-quatre. Dans
     `conversation.test.ts`, horloge fausse : une transcription qui ne répond jamais (« réfléchit » éteint en
     dernier, un `failed`, le signal de `stt` coupé) ; un envoi sans première phrase (« réfléchit » éteint, la
     coupure) ; un essai retiré, dont aucune garde ne se déclenche ensuite ; un numéro arrivé après la garde, oublié.
     Dans `src/voice.test.ts`, le signal passé à `fetch`.
   - Puis « Les choix », I6. Les deux gardes en constantes exportées, à côté de `MAX_TRIES` (`conversation.ts:59-60`),
     la transcription à la valeur de la tâche 1 ; `stt` câblée avec le signal dans la session
     (`session.svelte.ts:247`) ; `pourquoiPas` écarte une `transcriptionMs` ou un `premierMotMs` au-delà de leur
     garde. Les motifs de `b` et `c` restent trouvés une fois chacun.
   - Exclu : `core.ts` ; le service ; les sondages de `/voix/micro`, sauf décision (« Les choix qui restent »).
   - **I12** (13/11), dans la même tâche : une tentative dont l'envoi a levé après son numéro ne retient pas la file
     de sa voix plus longtemps que la garde de la réponse ; passée la garde sans phrase, son tour finit
     (`speaker.ts:180`) et la réponse suivante sonne. Test dans `conversation.test.ts`, horloge fausse : le flux coupé
     après `user` et `reply`, la parole suivante a sa réponse et elle sonne. Vu rater sur `main`.
     Si la même garde couvre aussi un tour relâché après une réponse en erreur dont la fin de parole ne vient pas
     (relecture de la tâche 4 bis), elle le couvre, avec son test ; sinon, ce cas va à l'`inbox`.
   - Commits : `963a5fb` les tests et les scénarios, `f689883` le correctif ; à la relecture, `7435dc5` le test et
     `7ac8d50` le correctif de `#supersede` (« Les choix », les écarts).
   - Écrit aussi, à la relecture : une retenue morte, après la garde du serveur, rallumait « réfléchit » sans fin. Une
     tentative sans réponse, remplacée ou entendue ne sortait de la file des réponses non entendues qu'à ses deux
     premiers rangs. Le correctif l'en sort à n'importe quel rang ; il couvre aussi la réponse en erreur et l'envoi qui
     lève, ce dernier venu de `main`. Commits : `1a17fcb` et `4866d56` les tests, `055a340` et `e684267` les
     correctifs.
6. - [x] **Relecture** (`reviewer`). Après chaque tâche 2 à 5, sur son diff, contre ses critères ; puis le diff entier
   avant la PR. Un écart revient à sa tâche.
   - Le diff entier approuvé le 13/11, sans bloquant ; sa remarque sur la file des réponses non entendues est revenue
     à la tâche 5 (« Écrit aussi, à la relecture »), relue deux fois puis approuvée.
7. - [x] **Les mutations et les suites** (`testeur`). Après 2 à 6.
   - [x] Une mutation par correctif que le banc atteint, dans `tools/mutations.json` : la garde de transcription
     retirée (`transcription-figee`) ; la garde qui accepte une réponse tardive (`transcription-lente`) ; la garde du
     serveur retirée (`reponse-figee`) ; le fragment refusé laissé en vie (`fragment-refuse`) ; `stop()` qui émet
     toujours (`taire-a-vide`) ; la synthèse d'un tour jeté (`arrete-puis-question`). Le maillon de chacune est celui
     que son premier passage nomme, écrit ici. Aucune n'en double une autre, ancienne comprise (même motif, ou mêmes
     échecs) ; un motif ancien trouvé deux fois : la table suit, sans affaiblir la mutation.
     - Fait le 13/11 (`10b4966`), les six tuées, chacune par son maillon : `transcription-figee` par la transcription
       (9 échecs) ; `transcription-lente` par le filtre (2) ; `reponse-figee` par la retenue (4) ; `fragment-refuse`
       par la retenue (3) ; `taire-a-vide` par le filtre (3) ; `arrete-puis-question` par la voix (2). Aucun motif
       ancien n'est trouvé deux fois. Deux ensembles d'échecs sont compris dans d'autres sans leur être égaux : ceux de
       `taire-a-vide` dans ceux de `d2` (la phrase écartée qui passe), ceux de `transcription-lente` dans ceux de
       `transcription-figee`. La règle parle des mêmes échecs : ce ne sont pas des doublons.
   - [x] La durée de `npm test` sur `main` puis sur la branche, trois fois chacune, contre le budget de 5 s ; `lint`,
     `typecheck`, `format:check` ; `npm run scenarios`, le relevé lu ; `npm run mutations`.
     - `main` 684 réussis, la branche 722. Médianes de la série demandée : 31,2 s contre 35,7 s (+4,5 s), le premier
       passage de `main`, à froid (56,9 s), écarté par la médiane ; d'une seconde série alternée : 36,3 s contre
       34,2 s (−2,1 s). Le budget tient, mais le bruit du laptop (±5 s) est de l'ordre du budget : la différence n'est
       pas établie. `lint`, `typecheck`, `format:check` propres ; 24 scénarios, 136 tenues, 1 connue (#63) ;
       `npm run mutations`, 14 tuées sur 14.
   - [x] `npm run chaine`, une partie par scénario avec Hortense : comparée à la course du 12/11
     (`banc-sons/chaine/taux/`) ; chaque écart nouveau écrit ici.
     - Le 13/11 : onze scénarios jouables dans la chaîne, 35 attentes tenues, aucune ratée. Les treize autres ne s'y
       jouent pas (le petit mode, des sons de toux absents du banc, des pannes que les vraies briques ne font pas sur
       commande). Des six nouveaux, seul `arrete-puis-question` y passe, ses attentes tenues ; sa mesure
       `reponse-2-a-temps` (2262 ms, hors de [2000, 2032]) n'a pas d'équivalent le 12/11.
     - Un écart, venu du banc et non de la branche : `non-court` faisait une tenue sur le « non » (0 sur 10, contre
       30 sur 30 le 12/11), et `main` aussi, dans le même montage (1 sur 10). Le « non » posé à la main de la course du
       12/11 manquait au banc, et la synthèse le disait plus court. Remis, la branche rend `pas-de-tenue` et
       `son-arrete` à 5 sur 5, `sortie-arretee` à 3 sur 5 (24 sur 30 le 12/11).
8. - [x] **La preuve à la main sur le laptop** (`testeur` ; CrOliX pour la fenêtre, lancée depuis l'Explorateur).
   Après 7. Ce qui est vu est écrit ici ; un écart, une issue.
   - [x] **La sourdine pendant l'invite d'autorisation.** Dans Chrome (`npm run dev`), l'autorisation du micro retirée
     pour la page : « Entrer », la sourdine pendant que l'invite est ouverte, puis « Autoriser ». Attendu : l'icône de
     micro de l'onglet s'éteint, la scène dit la sourdine. Puis la fenêtre : si WebView2 montre une invite, le même
     geste ; sinon, l'écrire.
   - [x] **Suspendus en pleine phrase**, chacun à son tour, par le Moniteur de ressources (« Suspendre le
     processus »), pendant qu'il lui parle : le service de voix (`faster`), puis whisper-server s'il tourne sur le
     laptop (sinon au desktop), puis le serveur. Attendu : le message et la reprise à la garde de transcription ;
     « réfléchit » éteint à celle du serveur ; le processus repris, rien de tardif ne sonne.
   - [x] **L'épuisement des connexions.** Le service de voix suspendu une minute, la détection d'occupation en
     service. Dans les outils de développement de Chrome (Réseau), les requêtes en attente ; une phrase écrite
     pendant ce temps part-elle ? Puis dans la fenêtre. Ce que le code prédit : « Trouvé en relisant », plus haut.
   - [x] Plus aucun `connus` ni `it.fails` de ce chantier ; ce plan coché, « Ce que l'exécution a trouvé » écrit. La
     feuille de route n'est pas touchée : le chantier « textes d'accord » la reprend.
   - [ ] À la fusion : le worktree retiré.

## Ce que les preuves ont montré sur `main`

Chaque test et chaque scénario a été vu rater sur `main` (`11eb3d1`), avant son correctif, sauf où une autre base est
dite. Les messages sont ceux de Vitest, sans la ligne qui les situe : elle date de la version du test d'alors. Les
lignes données ici sont celles de la branche à `7ac8d50`.

- **I1**, `src/mute.test.ts:198-233`.
  - (B) `toggleMute`, puis `toggleMic`, pendant l'ouverture, le même message (le `stop` du micro ouvert) :
    `expected "vi.fn()" to be called at least once`.
  - (A) Rappelé pendant l'ouverture (`mic.open`) : `expected "vi.fn()" to be called once, but got 3 times`.
- **Les sondages**, `src/mute.test.ts:235-250` : `expected [ [ '/voix/micro' ], …(2) ] to have a length of 1 but got 3`.
  Contre le correctif sans son `.finally`, le drapeau jamais remis à faux, le même test rate :
  `expected [ [ '/voix/micro' ] ] to have a length of 2 but got 1`.
- **I2**, `src/audio.test.ts:46-68`. `addModule` qui rejette, le nœud qui lève et le contexte qui refuse, le même
  message (le `stop` des pistes) : `expected "vi.fn()" to be called at least once`. L'URL du worklet, avant `8900d04` :
  `expected "revokeObjectURL" to be called with arguments: [ Array(1) ]`, `Number of calls: 0`.
- **I6**, `src/conversation.test.ts:788-844` et `:863-887`, `src/voice.test.ts:15-24`, trois scénarios.
  - Une transcription qui ne répond jamais, puis un envoi sans première phrase, le même message :
    `expected { type: 'thinking', on: true } to deeply equal { type: 'thinking', on: false }`.
  - Un numéro arrivé après la garde : `expected [] to deeply equal [ 'cut 110 ""' ]`.
  - Le signal passé à `fetch` : `expected undefined to be AbortSignal { aborted: false } // Object.is equality`.
  - Un essai retiré : il passe sur `main`, qui n'a aucune garde à déclencher. Il rate sur une variante du correctif
    sans `#answered` dans `#dropAttempt` : `expected [ 'withdraw 10', 'cut 110 ""' ] to deeply equal [ 'withdraw 10' ]`.
  - Une phrase retenue pendant sa transcription, puis remplacée, sur `f689883` (relecture de la tâche 5) :
    `expected [] to have a length of 1 but got +0`.
  - `reponse-figee` : 1 tenue, 4 ratées. `transcription-figee` : 2 tenues, 3 ratées, 1 non jouée.
    `transcription-lente` : 1 tenue, 4 ratées, 1 non jouée ; `aucun-verdict` et `rien-ne-part` en trop à 28424.
- **I7**, `taire-a-vide` et `src/speech/speaker.test.ts:168-181`.
  - `stop()` deux fois, elle déjà silencieuse : `expected [ Array(5) ] to have a length of 3 but got 5`.
  - `taire-a-vide` : 2 tenues, 3 ratées ; `rien-au-geste` en trop, `ecartee` absente, `rien-ne-part` en trop.
- **I9**, `fragment-refuse` et `src/conversation.test.ts:297-351`.
  - Le fragment refusé (tâche 4), puis la réponse en erreur d'un fragment (tâche 4 bis), le même message :
    `expected { type: 'thinking', on: true } to deeply equal { type: 'thinking', on: false }`.
  - `fragment-refuse` : 3 tenues, 3 ratées ; `sans-reponse` et `sans-reponse-a-la-fin` absentes, `rien-de-retenu` en
    trop.
  - Une réponse retenue, remplacée par un fragment dont la réponse rate (relecture de la tâche 4 bis), sur `161510a`,
    avant le correctif, et sur la variante du plan sans `#awaits` :
    `expected [ { par: 1, at: 1000, …(4) }, …(1) ] to have a length of 1 but got 2`.
- **I11**, `arrete-puis-question` et `src/speech/speaker.test.ts:207-228`.
  - Un tour jeté par `stop`, puis par `drop`, le même message :
    `expected [ 'Un.', 'Deux.', 'Trois.', …(1) ] to deeply equal [ 'Un.', 'Suivante.' ]`.
  - `arrete-puis-question` : 4 tenues, 2 ratées ; `aucune-synthese` en trop, `reponse-2-a-temps` hors bornes (6000
    pour `[2000, 2032]`).
- **I12**, `src/conversation.test.ts:846-861` : `expected [] to have a length of 1 but got +0`.

Tenus après les correctifs, à `7ac8d50` : 712 tests réussis, 27 ignorés ; vingt-quatre scénarios, deux fois à
l'identique, 136 tenues, 0 ratée, 1 connue, celle de `toux-puis-parole`, d'avant ce chantier. Les déroulés des
dix-huit anciens sont ceux de `main`, octet pour octet.

## Ce que l'exécution a trouvé

- **R1**, à la relecture du diff entier (tâche 6) : la retenue restait morte après la garde de 60 s, et « réfléchit »
  allumé sans fin. Réparé dans le chantier, à tout rang (`4866d56`, `e684267`), relu deux fois.
- **I9 et I12** sont entrés dans le chantier le 13/11, par le choix de CrOliX (tâches 4 bis et 5).
- **Le « non » posé manquait au banc** (tâche 7) : `non-court` ratait dans la chaîne sans que la branche y soit pour
  rien. Remis dans `banc-sons/chaine/sons/`.
- **Les suites**, à trier : lun-luxuria#81 (Q7, Q8 et R2, les retraits et les connexions, l'outillage), complétée par
  la preuve à la main.

### La preuve à la main (tâche 8), le 16/11

Sur le laptop, à `10b4966` : `faster:small`, Piper (`fr_FR-siwis-medium`), le serveur de la chaîne de Lun'Anima avec
une seule réponse, pour toute phrase. Les gestes de CrOliX, dans un onglet Invité de Chrome (`npm run dev`), puis
dans la fenêtre construite depuis la branche, lancée depuis l'Explorateur.

- **La sourdine pendant l'invite.** Dans l'onglet : sourdine mise pendant l'invite, puis « Autoriser » ; ni point
  rouge sur l'onglet, ni icône de micro dans la barre d'adresse, la scène dit « En sourdine ». Sortie de la sourdine :
  le point rouge vient. Dans la fenêtre : tenu.
- **Suspendus en pleine phrase.**
  - Le service de voix suspendu : « Ta phrase n'a pas pu être transcrite : aucun texte en 20 s », à l'heure ; repris,
    rien de tardif, et la phrase suivante est entendue et envoyée. Le même service arrêté, et non suspendu : le
    mandataire de Vite rend 502 aussitôt, « transcription refusée (502) ».
  - Le serveur suspendu pendant « réfléchit » : « Sa réponse n'est pas venue : aucune phrase en 60 s », à l'heure ;
    repris, rien de tardif. **Écart** : le retrait que la garde envoie revient en erreur à la reprise (404), et
    « Coupure non transmise : … » remplace le message de la garde.
  - whisper-server ne tourne pas sur le laptop : au desktop (« Ce que le desktop vérifiera »).
- **Les connexions.** Le service de voix suspendu une minute, la détection d'occupation en service. Dans l'onglet :
  une seule requête `micro` en attente à la fois ; une phrase écrite pendant ce temps part, sa réponse s'écrit aussitôt
  dans le fil ; seule la voix attend, et à la reprise « Sa voix n'a pas pu dire une phrase : synthèse trop longue »,
  sans phrase tardive. Dans la fenêtre : de même.
- **Vu en passant**, à trier :
  - un message d'erreur reste à l'écran une fois le service revenu ; rien ne dit qu'il l'est ;
  - un service de voix figé ne se dit nulle part tant qu'aucune synthèse ne l'attend ;
  - dans la fenêtre, l'erreur du réseau arrive brute, en anglais (« error sending request for url … »), où l'onglet
    dit la sienne en français ;
  - la fenêtre garde les réglages d'un essai ancien (un modèle, un serveur à d'autres ports) : voulu, mais l'erreur ne
    dit pas l'adresse en cause autrement que par l'URL brute.

## Ce que le desktop vérifiera

- **I11 avec la vraie synthèse** : Piper, puis RVC en blocs de 0,5 s, plus lents qu'au laptop ; le temps gagné sur la
  première phrase d'une réponse après « Faire taire ».
- **whisper-server figé** : sa propre limite de 60 s dans le service, le verrou de `/stt`, et la garde de la page avec
  sa requête coupée.
- La sourdine pendant l'invite, dans la fenêtre du desktop, si elle s'y montre autrement.
- **I12 est borné à 60 s, pas supprimé.** Après un flux cassé sur un fragment qui a reçu son numéro, aucune réponse ne
  sonne pendant 60 s, et « réfléchit » reste allumé, jusqu'à la garde de ce fragment. Le desktop dit ce que ces 60 s
  donnent en usage, sur un vrai flux cassé.

## Hors périmètre

- **Le chantier suivant, « le tour »** : I8, lun-luxuria#63, M1 (#53), M2, M3 (voir la fin).
- M4 (`live()` sans garde contre une connexion à moitié morte) et M5 (aucun rejeu des événements `live` perdus) : ils
  dépendent du serveur.
- Le banc, lun-luxuria#67 à #75 : un chantier à part, après ceux-ci. Faire voir « réfléchit » au banc en fait partie.
- La barre de confiance des gestes (lun-luxuria#6) : à mesurer plus tard au banc.
- L'IPC Tauri et la surface publique : le chantier « textes d'accord ». La feuille de route aussi.
- Le flux RVC (lun-luxuria#7).
- La file du service sous `stt_lock` et `tts_lock` (`voix/service.py:209-210`) : une garde de la page n'y change rien.
- `Speaker.#gone` jamais élagué (`speaker.ts:61`) ; la chaîne `#frames` sans borne (`session.svelte.ts:146`, `:486`) ;
  la reconnexion de `live` à pause fixe (`core.ts:140`).
- `linked`, qui mêle la présence et `live` (`session.svelte.ts:286`, `:332`, `:336`).
- **Une issue `inbox` dans Lun'Anima**, proposée par le plan-challenger : une garde sur l'appel au modèle. Le manager
  l'ouvre, après avoir vérifié ce qui existe déjà.

## Limites

- **Le niveau exact est une horloge fausse.** Les tests de la session simulent `openMicrophone` : ils prouvent l'ordre
  des appels, pas `getUserMedia`. La tâche 8 en voit une partie, à la main, sur un seul poste.
- **La garde de transcription** dépend d'une seule mesure sur le laptop (tâche 1). Une phrase plus longue que 30 s, ou
  `medium` sur le processeur (jusqu'à 7,7 s sur une phrase courte), pourrait la passer.
- **La garde du serveur** s'arrête à la première phrase : une réponse qui cale ensuite n'a pas de garde. Elle ne
  rallume rien : « réfléchit » s'est éteint au premier son.
- **Une réponse dont la première phrase dépasse 60 s est coupée**, un outil long avant tout mot par exemple : c'est
  la conséquence du choix validé, 60 s jusqu'à la première phrase.
- **Un sondage qui ne finit jamais fige la détection.** `#pollBusy` n'en lance pas d'autre tant que le précédent n'a
  pas répondu (`session.svelte.ts:424-428` sur la branche), et `appsOnMicrophone` n'a ni délai ni signal
  (`voice.ts:38-42`). Un service figé : la détection reste sur son dernier état. La suite : un signal, comme pour
  `transcribe`.
- **Un serveur figé avant même le numéro de sa réponse** : la garde n'a rien à couper, et la requête d'envoi reste
  ouverte, `send` n'ayant pas de signal (`core.ts:93-105`). Dans un onglet, elle tient une connexion. Si la tâche 8
  le voit, un signal pour `send`, comme pour `transcribe`, est la suite.
- **Les gardes finissent l'attente de la page, pas celle du service** : whisper-server garde `stt_lock` jusqu'à 60 s
  par requête (`voix/service.py:62`, `:282`), et les requêtes en file y passent pour rien.
- **La chaîne ne joue pas ces pannes**, et pas encore les toux : elle ne garde que contre une régression.
- **Les connexions** : ce que « Trouvé en relisant » prédit n'est vu que par la tâche 8, dans Chrome et dans la fenêtre.

## Les choix qui restent à CrOliX pour démarrer

1. **Le plan**, tâches 1 à 8. Je recommande de le valider : aucun choix produit, chaque correctif a sa preuve vue
   rater sur `main`, et ce que les tests ne voient pas est essayé à la main.
2. **Les valeurs des gardes.** Recommandé : 15 s pour la transcription, confirmées ou relevées par la mesure de la
   tâche 1 ; 60 s jusqu'à la première phrase de la réponse, comme le mode seul pour son modèle.
3. **Les sondages de `/voix/micro`**, trouvés en relisant. Recommandé : les ajouter à la tâche 2, un sondage ne part
   pas tant que le précédent n'a pas fini (`session.svelte.ts:294`, `:415-433`), avec son test dans `mute.test.ts`.
   L'autre voie : seulement l'essayer à la main (tâche 8), et ouvrir une issue s'il se voit.

## L'issue chapeau à ouvrir dans lun-luxuria

Avant la première tâche de code : « Rien ne reste ouvert ni n'attend : le micro, la transcription, l'envoi et sa
voix », étiquette `niveau:standard`, le lien vers ce plan, les constats I1, I2, I6, I7, I9 et I11, et la PR qui la
ferme.

## Le chantier suivant : le tour

Planifié après celui-ci. Ses questions seront posées au moment où elles serviront ; voici ce qui est lu, et les choix à
faire. Rien ici n'est validé.

### I8 et lun-luxuria#63 : ne pas reprendre par-dessus

- **Ce que le code fait.** `#talking` (`conversation.ts:104`) est posé par `held` (`:188`), retiré par `noise`
  (`:212`), `end` (`:218`) et `stopListening` (`:477`) ; `start` ne le pose pas (`:227-229`). `#letGo` reprend sa voix
  si `#talking` est faux et `#unjudged` vide (`:270`).
- **I8.** Le verdict d'une phrase qui arrive après le début de la suivante, mais avant sa tenue, la fait reprendre
  par-dessus. Un scénario le montre : `toux-verdict-tardif`, `toux-puis-parole` avec la toux en parole `(toux)`
  entendue vide, transcrite en 800 ms ; le verdict vient à 3424, la parole d'après commence à 3360 ; en `tous`, aucune
  `reprise_voix` dans la parole 2.
- **lun-luxuria#63 n'est pas I8.** Dans `toux-puis-parole` (`toux-puis-parole.ts:8-16`), la fin de phrase de la toux
  la reprend à 3168, la parole d'après commence à 3360, et elle parle dessus jusqu'à sa tenue (3744) : 384 ms. La
  reprise vient avant la parole : poser `#talking` à `start` n'y change rien.
- **Les deux comptent en usage réel.** L'essai part à la pause, 160 ms après la dernière voix ; son verdict vient
  160 ms plus la transcription après elle ; la fin de phrase, à 700 ms (`settings.ts:96`). Une transcription de moins
  de 540 ms : elle reprend à la fin, et une parole d'après lui passe dessus jusqu'à sa tenue, c'est #63. Plus longue :
  elle reprend au verdict, et une parole commencée entre la fin et le verdict, c'est I8. Les durées relevées (« Les
  attentes sans fin ») vont de 343 ms à plus de 2 s : les deux cas se rencontrent.
- **#63, les voies.** (b) **[avis]** : une attente de 300 à 400 ms avant de reprendre, annulée par un `start`, réglable
  dans `bargeIn` avec sa ligne dans Réglages, 0 pour la couper. Ce qu'elle change, à 300 ms : le `blanc` de
  `toux-parole` passe d'environ `[768, 800]` à environ `[1068, 1100]` ; dans `toux-puis-parole`, l'attente `reprise`
  s'inverse (elle ne reprend plus, la parole venant dans l'attente) et `suspendue-par-la-parole` disparaît. (a) Une voix
  qui commence dans la seconde après une reprise la suspend aussitôt : rien n'allonge le blanc, mais l'écho de sa
  propre voix pourrait la suspendre en boucle si l'annulation d'écho rate. (c) I8 seul, #63 laissée ouverte.
- **Un scénario écho plus toux** : l'écho en service, une toux pendant qu'elle parle ; elle reprend une seule fois, et
  son écho ne la fait pas boucler. Au niveau exact seulement.
- **`chevauchement-nul`** (`tous`, `[0, 0]`) de `toux-puis-parole` échouera à la chaîne quand la toux y sera jouée :
  les tenues y arrivent 43 à 82 ms plus tard. À passer en `exact`.

### M1 (lun-luxuria#53) : absente, le fragment part avant le retour

- **Ce que le code fait.** Pour une phrase entière, `addressed` part avant l'envoi (`conversation.ts:378-386`) ; pour
  un fragment, à sa confirmation (`:447-449`), après son envoi. La session revient de l'absence sur `addressed`
  (`session.svelte.ts:262-265`, `:364-367`). Le commentaire de `#heard` (`:363`) dit l'inverse ; `away.test.ts:180-192`
  coupe l'essai pour ne pas le voir (`:181-184`).
- **Ce que le serveur en fait.** Un message reçu pendant une présence arrêtée reçoit sa réponse, dite à voix haute,
  sans qu'elle sache qu'il est revenu. Le démarrage de la présence, arrivé après, lance l'accueil : il vient après la
  réponse, au lieu de la précéder.
- **Les voies.** (a) `addressed` au passage du fragment, avant son envoi. Elle inverse deux tests, qui disent un choix
  voulu : « passed on a pause, it counts only at the end of the sentence » (`conversation.test.ts:77-85`) et « a
  fragment withdrawn never counts » (`:87-97`). (b) **[avis]** Absente, pas d'essai à la pause, et la présence
  attendue avant d'envoyer, comme `write()` (`session.svelte.ts:579-584`) : les deux tests tiennent, seule la première
  phrase après une absence perd l'essai et attend le démarrage.
- **La preuve** : `away.test.ts`, l'essai en service, `['stopped', 'started', 'send']`. Hors du banc : l'absence vit
  dans la session.

### M2 et M3 : le nom et « Merci. »

- **M2.** `saysName` (`filter.ts:17-20`) admet au plus `name.tolerance` lettres d'écart, 2 par défaut
  (`settings.ts:90`), quelle que soit la longueur : « nature » vaut « natsume », « avant » vaut « Agent », le nom par
  défaut (`settings.ts:84`). **[avis]** Au plus une lettre par quatre du mot du nom, et jamais plus que le réglage ; un
  nom de moins de quatre lettres, exact. Prouvé par la table de `filter.test.ts` seule, sans scénario ni mutation :
  « avant » et « nature » écartés, « agents » et « natsumi » gardés, et « argent » gardé, à une lettre d'« Agent » :
  la limite de la règle, écrite comme telle. Le mot vide est écarté du constat : l'écran ne le laisse pas entrer
  (`src/Reglages.svelte:155-159`). Trouvé en relisant : un nom de plusieurs mots n'est jamais reconnu
  (`filter.ts:18-19`), une issue à ouvrir.
- **M3.** `isNoise` juge bruit « Merci. » seul (`filter.ts:30`), dans la fenêtre comme hors d'elle. **[avis]** Rien ne
  change avant la toux de CrOliX et whisper-server : un « Merci. » perdu ne coûte qu'une réponse, un « Merci. »
  inventé sur une toux, dans la fenêtre, lui ferait répondre à une toux.
