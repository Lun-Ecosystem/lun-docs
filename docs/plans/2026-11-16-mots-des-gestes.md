# Les mots des gestes. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** une issue chapeau à ouvrir dans lun-luxuria (voir la fin) ; lun-luxuria#6. Lun'Anima : 4 tâches,
> lun-anima#110 (issue privée).
>
> **État : rédigé le 16/11, amendé le même jour après le plan-challenger, à valider par CrOliX.** Le challenger a
> vérifié la relecture du 10/11 dans le relevé et dans le code. L'amendement sépare le banc de ce chantier, mesure le
> son que la page envoie, juge les faux rejets sur les prises de CrOliX, dit quand le verrou se lève et rend la mesure
> du laptop provisoire.
>
> **PR :** lun-docs, branche `docs/banc-et-gestes`, pour ce plan, puis l'ADR de la règle et la ligne B1 de la feuille
> de route. Celle de Lun'Luxuria s'ouvre avec la tâche 3 ; elle n'attend pas lun-luxuria#82 (« Les tâches »).

**But :** que la voix ne tranche une vraie carte que sur une règle mesurée. Mesurer ce que la page envoie au serveur,
texte et confiance, quand CrOliX dit un mot de geste, et quand arrive un son qui n'en est pas un : ses prises, cinq
voix de synthèse, des non-paroles. Puis CrOliX tranche la règle. Le verrou de l'ADR 0011 se lève ensuite, à trois
conditions (« Quand le verrou se lève »). Aucune vraie carte avant.

**Ce que ce chantier règle :** lun-luxuria#6 (`critique`). Un chantier court : le banc des gestes, les prises, la
mesure, la règle. Le banc de présence (#67 à #75) est un autre chantier (« Hors périmètre »).

**Source :**

- La [feuille de route](2026-11-07-feuille-de-route-mvp.md), § 3, « Le banc et les mots des gestes » : « Un chantier
  court les mesure au banc avec cinq voix, puis la règle se tranche, et le verrou de l'ADR 0011 avec elle (B1). Aucune
  vraie carte avant. » § 2, B1 : « Le verrou ne se lève qu'après le chantier des mots des gestes : cinq voix au banc,
  puis la règle ; aucune vraie carte avant (tranché le 12/11, § 3). »
- La décision du 12/11, validée par CrOliX après l'audit, telle que le plan
  [des textes d'accord](2026-11-12-textes-d-accord.md) la recopie : « la barre de confiance des gestes : un chantier
  court mesure au banc les mots des gestes avec cinq voix, puis la règle se tranche ; aucune vraie carte avant ».
- L'[ADR 0011](../../adr/0011-chaine-vocale-mvp.md) : « Pas de validation de vraie carte à la voix tant que la
  transcription ne rend pas une confiance réelle » (`:26-28`) ; « Les mesures du MVP se prennent sur le desktop
  seulement. Un chiffre du laptop ne vaut pas pour la cible. » (`:38`) ; « Restent à mesurer : […] la fenêtre de
  « annule » à la voix » (`:39-40`).
- Le relevé du 10/11 : `lun-luxuria/docs/essai-2026-11-07.md`, « Relevés du 10/11 », « Confiance » (`:74-106`).
- Le plan [des données et des taux](2026-11-12-donnees-et-taux.md) : ce qu'on a entendu le 12/11 (`:332-333`, `:348`),
  les cinq voix (« À trancher », point 2), la toux (point 12 et tâche 6).
- La veille, lue le 16/11 : la transcription, les agents et leurs garde-fous, le défi des propositions. Le défi C4 vise
  une carte qui envoie : « jamais un simple « oui » ». Rien sur la confiance de whisper pour un mot court.
- La règle de la surface publique : `standards/securite.md:17-22`. Le code relu sur `main` de lun-luxuria (`c800776`)
  le 16/11, par le graphe d'abord, et la branche de lun-luxuria#82. Lun'Anima lu en local, dont rien n'est écrit ici.

**Critères de fin :**

- `npm run gestes` fait passer chaque son par la vraie écoute et une vraie `Conversation`, jusqu'au vrai `/stt`. Il
  écrit hors dépôt ce que reçoit `brain.send`. Ses parties pures sont testées dans `npm test`, et `npm test`,
  `npm run lint`, `npm run typecheck`, `npm run format:check` passent.
- Les prises de CrOliX sont faites et rangées dans `banc-sons`, hors git : cinq par mot de la liste entière, et une
  dizaine de non-paroles.
- La mesure qui décide est jouée sur le desktop, à l'étape 2 du § 4, par la même commande. Son résumé est ici, avec
  celui de la mesure provisoire du laptop, si CrOliX l'a choisie.
- Lun'Anima : ses 4 tâches dans lun-anima#110. Ses comptes des six mots publics sont ici.
- CrOliX a tranché la règle par écrit. L'ADR qu'il a choisi et la ligne B1 disent la règle, et les trois conditions qui
  lèvent le verrou. lun-luxuria#6 se ferme avec le relevé.

| Dépôt, branche | Issue | PR | Niveau |
|---|---|---|---|
| `lun-luxuria`, `feat/mots-des-gestes` | chapeau à ouvrir ; #6 | à ouvrir | `standard` |
| `lun-anima` | Lun'Anima : 4 tâches, lun-anima#110 | ouverte | `critique` |
| `lun-docs`, `docs/banc-et-gestes` | la chapeau de lun-luxuria | à ouvrir | `trivial` |

`standard` pour Lun'Luxuria : un outil de mesure sur le modèle de `npm run banc`, aucun code de la page. `critique`
reste sur l'issue du core, qui applique la règle. *Show* : ce qui est de Lun'Luxuria se prouve sur le laptop.

## Ce que le code fait aujourd'hui

### Les gestes à la voix

- **Luxuria ne tranche rien** : « aucune logique de carte ici : une phrase part comme n'importe quelle autre »
  (`CLAUDE.md:14`). La transcription rend `{ text, confidence }` (`src/voice.ts:14-19`). La conversation envoie le
  texte avec sa confiance (`src/conversation.ts:384`, `src/brain.ts:36`), et le client le poste au serveur
  (`src/core.ts:93-96`). Le relevé du 10/11 juge à la barre de 0,7.
- **La confiance n'est plus fixe.** Le titre de #6 date du 07/11 ; lun-luxuria#10 l'a corrigé le même jour.
  faster-whisper rend l'exponentielle de la moyenne d'`avg_logprob` (`voix/service.py:49-53`). whisper-server rend la
  moyenne géométrique des probabilités des seuls jetons de texte, 0 sans aucun mot (`:56-68`). « Les deux ne se
  comparent pas : la barre de geste se juge sur la brique en service » (`docs/README.md:10-13`). Son test
  (`voix/test_service.py:43-60`) ne tourne pas en CI (#68) ; sa commande est `voix/test_service.py:4`.
- **Aucune mesure n'est passée par `/stt`.** Le relevé du 10/11 « interroge whisper-server directement, avec le calcul
  de `/stt` recopié, et non `/stt` lui-même », sur le fichier entier (`essai-2026-11-07.md:76-79`). Son script est hors
  dépôt, sur le desktop.

### Le son que la page envoie

- **La parole à l'essai est en service par défaut** : `speculate: true`, `pauseMs: 160`, `silenceMs: 700`
  (`src/settings.ts:96`). Après 160 ms de silence, la fin de phrase émet `pause` avec le son jusque-là, si la voix a
  duré au moins `minSpeechMs`, 250 ms (`src/listen/endpoint.ts:122-125`, `:24`). Après 700 ms, `end`, ou `noise` si la
  voix a duré moins (`:129-134`). 200 ms de son sont gardés devant (`prePadMs`, `:23`).
- **La conversation transcrit le son de la pause** (`src/conversation.ts:196-206`) et le garde à la fin de la phrase
  (`:217-224`). Le son de `end` ne part que sans essai en route (`:224`), après trois essais ou dix secondes
  (`MAX_TRIES`, `MAX_TRIED_MS`, `:59-60`).
- **Le filtre** : `decide` après chaque transcription (`:354-358`, `src/listen/filter.ts:43-56`). `isNoise` écarte un
  texte sans lettre ou une hallucination connue (`filter.ts:33-36`). Puis la mise en page : en scène, le filtre est
  coupé par défaut (`settings.ts:89`) et tout le reste passe ; en petit mode, il faut le nom, la touche ou les 15 s
  après sa phrase (`filter.ts:49-55`). Seul ce qui passe arrive à `brain.send`.
- **Donc** : pour un mot seul, le serveur reçoit la transcription du son de la pause, environ 160 ms de silence après
  la voix, pas les 700 ms de `end`. Un mot de moins de 250 ms de voix n'est jamais transcrit. Envoyer le son de `end`
  au `/stt` mesurerait un autre son, et sauterait `isNoise`.
- **Une installation déjà réglée** garde 0,5 s de silence de fin (feuille de route, § 4, étape 4). Avec la parole à
  l'essai, le son envoyé est coupé à la pause : ces 0,5 s ne le changent pas pour un mot seul.

### Ce que le banc a déjà

- `src/listen/banc.test.ts:124-155` pilote une vraie `Conversation` sur `replay`, avec une fausse transcription et un
  faux serveur. `replay` rejoue un son sur l'horloge du son (`src/listen/replay.ts:87-117`). Silero :
  `banc.test.ts:16-19`. Un bruit tiré d'une graine : `banc.test.ts:21-28`, local à ce fichier.
- Les cinq voix (`src/presence/chaine/sons.ts:323-420`, `voixDe` à `:403-420`) et leur cache (`dire`, `:111-127`, non
  exporté). Le service de voix lancé comme la chaîne le lance (`src/presence/chaine.test.ts:559-563`), sans synthèse
  par `--tts aucun` (`docs/README.md:8-9`). Il accepte une requête sans `Origin` (`voix/service.py:35-39`).
- La branche de lun-luxuria#82 ajoute une garde de 20 s à chaque transcription (`STT_TIMEOUT_MS`, dans
  `src/conversation.ts`), et touche `CLAUDE.md`.

### Le relevé du 10/11, relu

21 prises de CrOliX, une par cas : six mots (oui, non, ok, envoie, valide, annule), chacun dit de trois façons, soit
18 prises de mots, et trois silences. Seuil 0,7 ; « 3 faux acceptés, 4 faux rejets sur 21 » (`essai-2026-11-07.md:105`).

Relu par le geste, et vérifié par le challenger : les trois faux acceptés sont « envoie » rendu « Au revoir. », qui
n'est aucun des six mots du relevé. Ce sont trois faux rejets d'« envoie ». Ce que le tableau montre (`:83-103`) :
« envoie » jamais entendu ; « oui » à 0,602 et 0,628, « annule » à 0,544 et 0,696, sous la barre de 0,7. À une barre de
0,60, « oui » ne tiendrait qu'à une prise, à 0,602. Les 21 prises n'ont ni mot voisin, ni négation, ni toux.

### Ce que le 12/11 a montré

- Les voix de synthèse ont rendu « Oui ? » ou « Oui? » 10 fois sur 15 à la chaîne (`donnees-et-taux.md:348`). Leurs
  faux rejets disent la synthèse, pas la voix de CrOliX.
- La toux d'essai de 450 ms, sur `tiny`, a été rendue une fois « D'accord. » (`donnees-et-taux.md:332-333`). C'est le
  témoin le plus dangereux connu : une non-parole devenue un mot qui accepte.
- Les toux de CrOliX ne sont pas enregistrées (tâche 6 du plan des données et des taux, ouverte). Aucun mot du
  serveur au-delà des six n'a de prise.

## Ce qui se prouve, et comment

- **Le banc des gestes** : ses parties pures dans `npm test`. Une partie sur `faster:tiny` prouve la commande de bout en
  bout sur le laptop, sans rien télécharger. Ses chiffres ne comptent pas.
- **La mesure provisoire**, sur le processeur du laptop, si CrOliX la choisit : une indication. Elle ne décide rien
  (ADR 0011, `:38`).
- **La mesure qui décide** : sur le desktop, whisper.cpp `medium` en Vulkan, la brique en service, par la même
  commande, à l'étape 2 du § 4.
- **Ce que le serveur en fait** : Lun'Anima, lun-anima#110. Ses comptes reviennent ici.
- **Ce qui ne se prouve pas** : voir « Limites ».

## Les choix **[avis]**

### Le banc des gestes

- **Une commande** : `npm run gestes`, `vitest run src/listen/gestes.test.ts --mode gestes --reporter=default`, comme
  `banc` (`package.json:21`). Sur le poste seulement, jamais en CI.
- **Sa liste, hors dépôt** : `BANC_DIR/gestes/mots.json`. Chaque ligne a un `id`, un `dit`, un `attendu` (`accepter`,
  `refuser`, `envoyer`, `annuler`, ou `aucun` pour un témoin) et le nombre de ses prises. Les mots de geste sont au
  serveur (`CLAUDE.md:14`), pas à Luxuria : le dépôt n'a pas de liste. Sans ce fichier, la commande s'arrête et le dit.
- **Ses prises vérifiées** : `BANC_DIR/gestes/prises/<id>-<n>.wav`. Avant de jouer, la commande compte les prises de
  chaque ligne. Une prise qui manque arrête tout, et la nomme : rien ne se joue à la place.
- **Ses sons** :
  - chaque `dit` de chaque voix de `GESTES_VOIX` (au format de `CHAINE_VOIX`, les cinq par défaut), par `dire`, exporté
    pour cela ; propre, puis avec le bruit du banc à un niveau fixe ;
  - chaque prise de CrOliX telle quelle ;
  - le jeu épais sur les non-paroles, où le risque est réel : chacune propre et dans le bruit, à trois niveaux (-6, 0
    et +6 dB). Avec elles, la toux d'essai de 450 ms du 12/11, les trois silences du 10/11, un son nul, le bruit seul.
- **Le trajet** : chaque son passe par `replay`, Silero et les valeurs par défaut de la page (`DEFAULTS`, la pièce
  « normale »). Puis une `Conversation` neuve par son, comme `banc.test.ts:124-155`. Sa transcription est `transcribe`
  (`src/voice.ts:14-19`) vers le service que la commande lance, `--stt` pris dans `GESTES_STT`, sans valeur par défaut,
  et `--tts aucun`. Mise en page `scene`, filtre par défaut : seul `isNoise` écarte (`filter.ts:48-49`). Le faux
  serveur note ce que reçoit `send`, texte et confiance, et ce que `withdraw` reprend. La commande attend chaque
  transcription en route avant le son suivant.
- **Ce qu'elle écrit, hors dépôt** : `BANC_DIR/gestes/gestes.jsonl`, une ligne par son : `id`, la source (la voix, ou
  `prise`), la condition et le niveau, l'`attendu`, ce que l'écoute en a fait, chaque transcription (texte, confiance,
  durée), ce que `send` a reçu, ce qui a été repris, la brique, la date. C'est tout.
- **Aucun classement côté Luxuria.** Comparer un texte à un mot enlèverait la ponctuation : « Oui ? » compterait comme
  juste. Ce que le serveur fait d'un texte, ses comptes le disent, et eux seuls font foi.

### Les prises de CrOliX

- **Avant la mesure**, CrOliX enregistre cinq prises par mot de la liste entière, les six mots publics et ceux que
  lun-anima#110 ajoute à la liste, lue hors dépôt.
- **Une dizaine de non-paroles** : des toux, dont une courte, un raclement, « mmh », un souffle, le clavier. Ses deux
  toux de la tâche 6 [des données et des taux](2026-11-12-donnees-et-taux.md), au moins 450 ms et au moins 300 ms, en
  font partie : elles servent aussi le banc de présence.
- Tout va dans `banc-sons`, hors git. Ses 21 prises du 10/11 y sont déjà. Aucune prise d'une autre personne.

### La mesure

- **Les cinq voix**, tranchées le 12/11 : Hortense (Windows, par System.Speech) ; Julie et Paul (les voix OneCore de
  Windows) ; jessica et pierre (Piper, `fr_FR-upmc-medium`, CC BY-SA 4.0, hors dépôt). Toutes de synthèse et locales,
  jamais sa voix à elle (`sons.ts:415-418`). Elles servent aux faux acceptés, pas aux faux rejets.
- **Les témoins publics**, `attendu` `aucun` : des mots voisins (« Louis », « nous », « nom », « au revoir »,
  « renvoie »), des hésitations (« euh », « hum »), les non-paroles. Les négations et les autres témoins sont dans la
  liste privée.
- **Le compte** : environ 335 sons, la liste privée comprise. Plus d'une heure sur le processeur du laptop, estimé.
  Environ 0,55 s par son en Vulkan sur le desktop (ADR 0011, `:22`), quelques minutes.
- **La mesure provisoire** : whisper.cpp v1.9.5, la version du desktop (`essai-2026-11-07.md:39`), pour le processeur,
  avec le modèle `medium`, téléchargés hors dépôt, si CrOliX le choisit. Sinon, la commande se prouve sur `faster:tiny`
  et les chiffres attendent le desktop.
- **L'étalonnage de la mesure provisoire** : `voix/test_service.py` joué une fois en local, puis `make_stt` de
  `voix/service.py` (`:42`, `:56-68`) sur le fichier entier de chacune des 18 prises de mots du 10/11, par un script
  hors dépôt. Comparé au tableau (`essai-2026-11-07.md:83-100`), les mots normalisés (casse, accents, ponctuation) mais
  le « ? » gardé. Les mêmes mots sur les 18, et aucun écart de confiance au-delà de 0,05 : la mesure provisoire
  indique. Sinon elle ne dit rien.
- **La mesure qui décide** : sur le desktop, la même commande, à l'étape 2 du § 4. Le même étalonnage vérifie d'abord
  que la brique est celle du 10/11.

### Comment la règle se tranche

**Ce qui compte, posé avant la mesure** :

1. **Aucun faux accepté** pour un geste qui lâche (accepter, envoyer) : aucun son qui n'est pas ce geste, pris pour
   lui par le serveur, sur tout le jeu : ses prises, les cinq voix, les non-paroles. Zéro sur *N* sons met le taux sous
   3/*N*, pas à zéro. Les non-paroles pèsent le plus.
2. **Les faux rejets se jugent sur ses prises** : un mot gardé à la voix passe sur au moins 4 de ses 5 prises, chacune
   au moins 0,05 au-dessus de la barre. La barre se pose avec cette marge sous ses prises. Les voix de synthèse ne
   jugent pas les faux rejets.
3. **Un mot sans prises ne tranche pas à la voix.**
4. **Par sens** : les comptes se font par sens (accepter, refuser, envoyer, annuler), et la règle peut différer d'un
   sens à l'autre. Ce que coûte une erreur dans chaque sens est dit dans lun-anima#110.
5. **Seule la mesure du desktop décide.** La provisoire prépare le choix.

**Les règles possibles, jouées sur les mêmes données** :

- (a) **une barre** : une seule, choisie sur le tableau, les mots inchangés ;
- (b) **une liste** : seuls les mots qui tiennent 1 à 3 tranchent à la voix, les autres à l'écran ; une carte qui
  envoie se tranche à l'écran si son mot ne tient pas ;
- (c) **une confirmation par un autre geste** : deux mots différents de suite, ou les 5 s pour dire « annule », gardées
  comme confirmation ;
- (d) **le verrou gardé** : aucune carte à la voix au MVP ; elle la lit, et dit de la trancher à l'écran.

**[avis], à confirmer par la mesure** : (b), une barre par brique, les 5 s gardées, pas de second mot. Un second mot
double l'attente, et les 5 s laissent déjà reprendre le geste. La veille va dans le même sens pour une carte qui
envoie (défi C4). Si aucun mot ne tient le point 1 : (d).

### Quand le verrou se lève

Le verrou de l'ADR 0011 est une consigne : aucune vraie carte à la voix (B1). Le choix de la règle par CrOliX ne le
lève pas. Il se lève quand trois conditions sont réunies :

1. le core applique la règle (lun-anima#110) ;
2. l'écho est vérifié sur le desktop : un mot qu'elle dit, repris par le micro, n'est pas pris pour le sien ;
3. la fenêtre d'« annule » à la voix est vérifiée sur le desktop (ADR 0011, « Restent à mesurer »).

L'ADR de la règle et la ligne B1 le disent. Chaque condition remplie s'y note, avec sa date.

## Les tâches

**Dès la validation, en parallèle** : 1, 2 (si CrOliX l'a choisie), 3, et la première tâche de lun-anima#110. **Après
3** : 4. **Après 1, 2, 4 et la première tâche de lun-anima#110** : 5. **À l'étape 2 du § 4** : 6. **Après 6 et les
comptes de lun-anima#110** : 8. **Après 8** : 9.

lun-luxuria#82 ne bloque rien ici : les fichiers du banc des gestes sont les mêmes sur `main` et sur sa branche. Seul
`CLAUDE.md` est touché par les deux : sa ligne s'écrit après la fusion de #82, ou se fusionne à la main. Après #82, une
transcription de plus de 20 s échoue : sur le processeur, elle s'écrit comme telle, jamais comme un faux rejet.

1. - [ ] **Les prises** (CrOliX, puis `testeur`, hors dépôt). *Parallélisable.*
   - CrOliX enregistre (« Les prises de CrOliX »), au micro choisi (« Les choix qui restent », point 3).
   - Le `testeur` les nomme `<id>-<n>.wav` dans `BANC_DIR/gestes/prises/`, compte chaque famille, et écrit ici les
     comptes : par famille, jamais un mot de la liste privée.
   - Exclu : la prise d'une autre personne ; un son dans un dépôt.
2. - [ ] **La brique du laptop et son étalonnage** (`testeur`, hors dépôt). *Parallélisable*, si CrOliX l'a choisie.
   - `voix/test_service.py` par sa commande (`:4`), une fois ; le résultat ici.
   - whisper.cpp v1.9.5 pour le processeur et le modèle `medium`, téléchargés hors de tout dépôt ; le lien et la somme
     de chaque fichier ici. whisper-server lancé à la main.
   - L'étalonnage (« La mesure ») ; les 18 prises comparées, une par une, et le verdict ici.
   - Exclu : la version Vulkan ; `small` ; changer le service de voix.
3. - [ ] **Le banc des gestes** (`dev-luxuria`). *Parallélisable.* `src/listen/gestes.ts` et `gestes.test.ts`,
   nouveaux ; `src/listen/replay.ts` (le bruit à graine, sorti de `banc.test.ts`) ; `src/listen/banc.test.ts` (il
   l'importe) ; `src/presence/chaine/sons.ts` (`dire` exporté) ; `package.json` ; `docs/README.md` ; `CLAUDE.md` (voir
   plus haut).
   - D'abord, dans `gestes.test.ts`, au niveau des tests, vus rater avant le code :
     - la liste lue ; une ligne sans `dit`, ou d'un `attendu` hors des cinq, refusée ;
     - une prise qui manque nommée, et rien de joué ;
     - le bruit et les trois niveaux identiques d'un tirage à l'autre ;
     - une `Conversation` sur `replay`, fausse transcription et faux serveur : pour un mot seul, la transcription reçoit
       le son de la pause, plus court que celui de `end` d'environ `silenceMs - pauseMs` ;
     - un texte que `isNoise` écarte n'arrive jamais à `send`, et sa ligne le dit ;
     - la ligne du `.jsonl` porte le texte et la confiance que `send` a reçus, tels quels.
   - Puis « Le banc des gestes ». La commande et ses variables dans `CLAUDE.md` et `docs/README.md`, comme `chaine`.
   - Preuve : `npm run gestes` avec `GESTES_STT=faster:tiny`, trois lignes de liste et une voix ; la ligne collée ici.
   - Exclu : la page ; le serveur ; une liste de mots dans le dépôt ; un son dans le dépôt ; tout classement ; un
     réglage de Luxuria ; le calcul de la confiance.
4. - [ ] **Relecture** (`reviewer`). Après 3, sur son diff, contre ses critères et ses exclusions. Un écart revient à 3.
5. - [ ] **La mesure provisoire** (`testeur`, laptop).
   - `npm run gestes` avec les cinq voix, sur la brique de la tâche 2, ou sur `faster:tiny` si elle n'est pas choisie.
   - Ici : la durée, le nombre de sons par famille, puis les comptes de lun-anima#110 pour les six mots publics.
   - Exclu : écrire ici un mot de la liste privée ; trancher sur ces chiffres.
6. - [ ] **La mesure qui décide** (`testeur`, desktop, étape 2 du § 4).
   - L'étalonnage d'abord, puis la même commande sur la brique en service.
   - Ici : la durée, l'étalonnage, puis les comptes de lun-anima#110 pour les six mots publics, et pour chaque critère de
     « Comment la règle se tranche », tenu ou non.
7. - [ ] **Lun'Anima : 4 tâches, lun-anima#110** (`dev-core`, `testeur`).
8. - [ ] **La règle** (CrOliX, puis la session principale). Après 6 et les comptes de lun-anima#110.
   - Le relevé et les comptes présentés, avec les quatre règles jouées sur les mêmes données ; CrOliX tranche par
     écrit.
   - L'ADR qu'il a choisi (« Les choix qui restent », point 5) ; la ligne B1 : la règle et les trois conditions ;
     lun-luxuria#6 fermée avec le relevé.
9. - [ ] **La fin** (`testeur`, `livreur`).
   - Ce plan coché, « Ce que l'exécution a trouvé » écrit ; chaque observation nouvelle, une issue `inbox`.
   - À la fusion : les worktrees retirés. Le relevé reste dans `BANC_DIR`, preuve de #6.

## Ce que les preuves ont montré sur `main`

À remplir par la tâche 3, avant son code : le message d'échec de chacun de ses tests, collé tel quel.

## Ce que la mesure a donné

À remplir par les tâches 1, 2, 5 et 6 : les prises, l'étalonnage, les deux relevés, les comptes de lun-anima#110.

## Ce que le desktop vérifiera

- La mesure qui décide (tâche 6), à l'étape 2 du § 4.
- L'écho et la fenêtre d'« annule » : deux des trois conditions du verrou.
- À l'étape 4 du § 4, la file du core se joue « sur de vraies cartes » : voir « Les choix qui restent », point 6.

## Hors périmètre

- **Le banc de présence**, son propre chantier, `standard`, en parallèle de celui-ci : lun-luxuria#67, #68, #69, #70,
  #71, #73, #74, #75, le point de lun-luxuria#81 (la chaîne qui joue la synthèse quand un son posé manque), et les
  quatre scénarios de toux (`toux-courte`, `toux-parole`, `toux-puis-parole`, `toux-reflexion`). Il aura son plan. Ce
  chantier n'en attend rien : #68 se remplace ici par `voix/test_service.py` joué en local (tâche 2), et le banc des
  gestes vérifie lui-même ses prises.
- **lun-anima#97** : son propre chantier, après celui-ci ; ce qui en touche ce chantier est dans lun-anima#110.
- Changer le calcul de la confiance, une seconde transcription pour les gestes, un modèle de mots-clés : si aucune
  règle ne tient, une issue.
- La langue (B2) : la mesure est en français ; si la langue transcrite change, elle se rejoue.
- Le tour (I8, lun-luxuria#63, #53), l'IPC (lun-luxuria#78), le flux RVC (lun-luxuria#7).
- Les prises d'autres personnes ; le débit des voix.

## Limites

- **Ce que le banc ne mesure pas** :
  - un « ok » ou un « d'accord » dit en passant, pendant qu'une carte est en cours ;
  - l'écho d'un « D'accord. » dit par elle et repris par le micro ;
  - sa propre voix qui porte une phrase de geste.
  Le banc donne un son à la fois, hors conversation. Ces trois cas se jugent sur le desktop et dans lun-anima#110.
- **Les voix de synthèse sont propres** : elles disent ce que la transcription confond, pas comment CrOliX parle.
- **Ses prises viennent d'un micro** : celui du choix 3. L'autre micro, et la pièce, restent à entendre.
- **Le processeur n'est pas la carte** : l'étalonnage tient sur 18 prises, une par cas. Le fichier exact du modèle
  `medium` du desktop n'est pas vérifié.
- **Zéro faux accepté** sur *N* sons met le taux sous 3/*N*, pas à zéro.
- **`replay` n'est pas le micro** : ni écho, ni pièce.
- **Les temps de la mesure** sont estimés, pas mesurés.

## Les choix qui restent à CrOliX pour démarrer

1. **Le plan**, tâches 1 à 9. Je recommande de le valider : la mesure passe par le son que la page envoie et par le
   vrai `/stt`, et la règle se tranche sur des critères posés avant elle.
2. **Séparer le banc des gestes** (recommandé). Le banc de présence devient son propre chantier, `standard`, en
   parallèle. Ce chantier n'a besoin d'aucune de ses issues. La feuille de route, § 3, dit aujourd'hui « le banc
   d'abord » : elle suivra ce choix.
3. **Ses prises** : cinq par mot de la liste entière, et une dizaine de non-paroles. (a) Au micro du laptop,
   maintenant (recommandé) : la mesure part sans attendre le desktop. (b) Au micro du desktop, à la session du § 4 :
   le micro réel, mais tout attend.
4. **La brique de la mesure provisoire** : (a) télécharger whisper.cpp v1.9.5 pour le processeur et le modèle
   `medium` (environ 1,5 Go, non vérifié), hors de tout dépôt (recommandé) : les règles se discutent sur des chiffres
   avant le desktop, et l'étalonnage dit s'ils tiennent. (b) La commande prouvée sur `faster:tiny` seulement, les
   chiffres au desktop. Dans les deux cas, seul le desktop décide.
5. **L'ADR**. On ne modifie jamais un ADR accepté, sauf pour le passer à « remplacée par NNNN »
   (`adr/README.md:13-14`). Le 0014 est libre le 16/11 (aucun dans `adr/`, aucun dans une PR ouverte de lun-docs).
   (a) L'ADR 0014 remplace l'ADR 0011 en entier : il en reprend chaque décision, et y change le verrou (recommandé).
   (b) L'ADR que le § 4 annonce pour B2 (étape 9) remplacera alors 0014, et non plus 0011.
6. **Une remarque sur le § 4** : l'étape 4 joue la file du core avec la carte du kit « sur de vraies cartes ». L'ordre
   doit mettre la règle et les trois conditions avant, ou ne jouer que des cartes d'essai. Je recommande les cartes
   d'essai tant que le verrou tient.
7. **Une remarque sur lun-luxuria#6** : il reste `critique` par nature. Mais aucune faille connue n'est ouverte, le
   défaut de son titre est corrigé (lun-luxuria#10), et à une barre de 0,60 les 21 prises du 10/11 ne donnent aucun
   faux accepté. Rien ne presse au point de faire passer ce chantier avant le banc : ils vont en parallèle.

## Les choix qui viendront après la mesure

Posés au moment où ils serviront, avec le relevé :

- **La règle** : (a) à (d) de « Comment la règle se tranche », avec l'avis révisé d'après les chiffres.
- **De nouvelles prises**, si un mot tient à une prise près : une série de plus pour ce mot.

## L'issue chapeau à ouvrir dans lun-luxuria

Avant la tâche 3 : « Les mots des gestes », étiquette `niveau:standard`, le lien vers ce plan, lun-luxuria#6, et la PR
qui la ferme.
