# La fin de phrase : décider, plutôt qu'attendre un délai. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** que Natsume réponde vite quand CrOliX a fini, et attende quand il hésite. Aujourd'hui un seul silence de
500 ms décide, le même pour « oui » et pour « alors, je me disais que… ». Un petit modèle écoute comment la phrase
sonne et dit si elle est finie ; le silence ne sert plus que de garde-fou.

**Source :** l'étude [« La présence : où nous en sommes »](../specs/2026-11-10-presence-etat-comparaison.md), § 3.2 ;
le plan [« l'écoute »](2026-11-10-ecoute.md), dont celui-ci est la suite annoncée ; les relevés du 11/11 ci-dessous.
Le code relu sur la branche `feat/ecoute` de Lun'Luxuria (lun-luxuria#54). Plan relu par le plan-challenger le 11/11 :
« à amender », ses sept objections sont reprises ici (voir la fin).

**Critères de fin :**

- Sur le banc, le modèle est jugé là où il servira : à chaque pause, sur le son entendu jusque-là. Le relevé compare
  le silence fixe et le modèle : phrases coupées trop tôt, attentes pour rien, délai avant la fin, mots courts à part.
- Ce relevé décide de la suite : si le modèle ne tient pas à la pause, le plan s'arrête là et le dit.
- Dans la page, une phrase jugée finie se clôt plus vite qu'aujourd'hui ; une phrase jugée pas finie attend plus
  longtemps, jusqu'à un plafond. À la touche, rien ne change.
- Le modèle a son interrupteur ; coupé, ou s'il ne se charge pas, l'écoute est celle d'aujourd'hui.

**À valider par CrOliX.** Niveau proposé : `standard`. Aucune dépendance nouvelle : le moteur est celui de Silero.

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-luxuria`, `feat/fin-de-phrase` (après la fusion de lun-luxuria#54) | à ouvrir à la validation | `standard` |
| `lun-docs`, `docs/ecoute-releve` | la même | `trivial` |

## Les relevés du 11/11

### Les données

Aucun de ces fichiers n'est dans un dépôt ; tout est dans `banc-sons`, sur le laptop.

| Jeu | Ce que c'est | Licence |
|---|---|---|
| 122 phrases françaises du jeu de test de Pipecat (`smart-turn-data-v3.2-test`, un fichier sur dix) | Des voix de synthèse, étiquetées : 67 finies, 55 pas finies, avec ou sans hésitation | CC BY 4.0 |
| 20 phrases et 18 mots de CrOliX, et 3 silences (desktop, 07/11 et 10/11) | Sa voix, micro brut ; phrases transcrites en local le 11/11 | Hors dépôt |

Le jeu de Pipecat compte 1 252 phrases françaises, toutes de synthèse, mêlées aux autres langues dans dix fichiers
de 480 Mo : en prendre une, c'est lire tout le fichier. Un fichier a été lu.

### Notre silence fixe, sur les 122 phrases

- **Un délai ne peut pas distinguer** une phrase finie d'une phrase en suspens : il clôt après 500 ms, quoi qu'on ait
  dit. Ce n'est pas une mesure, c'est sa nature ; un plafond de 1,5 s répondrait aussi à une phrase laissée en suspens.
- **Mesuré : il coupe 12 phrases sur 122 en deux**, sur quatorze pauses intérieures de 0,54 à 1,0 s, dont onze de
  moins de 0,7 s.
- **Les pauses courtes sont partout** : 170 reprises après une pause de 160 ms. Chacune est un tour à l'essai envoyé,
  puis retiré.

### Le modèle de fin de tour, sur les mêmes phrases

`smart-turn` v3.2 (8,7 Mo), sur le processeur du laptop, depuis un script Python : 63 ms par jugement, **un jugement
par clip entier**.

| | Justes | Pas finies jugées finies (elle couperait) | Finies jugées pas finies (elle attendrait) |
|---|---|---|---|
| Les 122 phrases, seuil 0,5 | 116 | 3 | 3 |
| Seuil 0,7 | 116 | 2 | 4 |
| Seuil 0,9 | 114 | 1 | 7 |

Deux réserves : ces phrases sortent du même moule que celles qui ont entraîné le modèle ; et il n'a pas été jugé aux
170 pauses intérieures, là où il servira.

### Sur la voix de CrOliX : provisoire

Mesuré sur des prises entières, qui finissent par 0,4 à 0,8 s de silence, alors qu'à la pause le modèle n'en aura que
160 ms. À refaire dans les conditions réelles (tâche 2).

- **Phrases entières** : 19 sur 20 jugées finies au seuil 0,5 ; 17 au seuil 0,7. Une phrase entière est jugée pas
  finie (`10.wav`, 0,01).
- **Mots courts** : les 18 jugés finis au seuil 0,5 ; « ok » dit proprement tombe à 0,62. Ces mots valident des cartes.
- **Le silence est jugé fini** : les trois prises sans parole donnent 0,96 à 0,98. Le modèle ne doit donc être
  interrogé qu'après une voix, ce que fait `pause`.
- **Phrases tronquées au milieu, sans silence après** : deux jugées pas finies, à raison (« Bon, heu, je sais pas
  trop… », « Hum… ouais, je vais peut-être… », 0,01) ; une jugée finie alors qu'elle continue (« …ce que j'ai fait
  aujourd'hui / et je suis plutôt content », 0,95).
- **Ce qu'il ne sait pas** : « Attends, laisse-moi réfléchir », suivi d'un silence, est jugé fini (0,97, puis 0,84 un
  peu plus loin). La phrase sonne finie ; c'est son sens qui dit d'attendre.

## Ce que le code fait aujourd'hui

- `Endpointer` (`src/listen/endpoint.ts`) : après 160 ms de silence il rend `pause`, avec le son de la phrase jusque-là ;
  après 500 ms, `end` (`endpoint.ts:121`). Il est synchrone et ne connaît qu'un silence de fin.
- La session juge les trames l'une après l'autre sur une chaîne, chacune datée à son arrivée
  (`session.svelte.ts`, `#frames`). À la touche seule, lâcher la touche met la voix à zéro, donc une `pause`.
- Le moteur ONNX tourne sur un seul fil, dans la page (`src/listen/vad.ts`) : un jugement bloque la page le temps
  qu'il dure, où qu'on l'attende.
- `Conversation` (`src/conversation.ts:140`) : à `pause`, le tour à l'essai part ; à `resume`, il est retiré.
- Le banc (`src/listen/replay.ts`, `banc.test.ts`) rejoue un fichier et lit sa fiche ; il ajoute du silence en fin de
  fichier pour clore la dernière phrase.

## Tâches

1. - [ ] **L'entrée du modèle, en TypeScript.** `src/listen/turn.ts`, porté du module numpy que Pipecat publie
   (BSD 2) : les 8 dernières secondes, complétées de silence devant, 80 bandes, fenêtres de 25 ms tous les 10 ms, son
   normalisé. La CI tient un signal fabriqué par une formule, dans trois cas (moins de 8 s, plus de 8 s, que du
   silence), avec les valeurs attendues écrites dans le dépôt à 0,001 près, et la probabilité du modèle. Les scripts
   de mesure entrent dans `tools/`.
2. - [ ] **Le relevé qui décide.** Le modèle (8,7 Mo, licence relue ici, rangé dans le dépôt avec sa source) interrogé
   par le banc à chaque `pause`, sur le son jusqu'à cette pause. La vérité : une pause suivie d'une reprise est « pas
   finie » ; la dernière porte l'étiquette de la fiche. Le relevé donne, pour le silence fixe et pour le modèle, à
   plusieurs seuils : coupées trop tôt, attentes pour rien, délai avant la fin ; les mots courts à part ; et le temps
   d'un jugement dans le moteur de la page. **Si le modèle ne fait pas mieux que le silence fixe à la pause, ou si un
   jugement bloque la page plus de 100 ms, le plan s'arrête ici** et le relevé le dit.
3. - [ ] **Deux délais, choisis hors d'`Endpointer`.** `Endpointer` reste synchrone : il gagne seulement un silence
   de fin qu'on lui donne pour la phrase en cours, remis à zéro à `start` et à `resume`. À `pause`, la session attend
   le verdict dans sa chaîne de trames, puis le lui donne : court si « finie », long si « pas finie », celui
   d'aujourd'hui sans verdict. Le banc passe par le même chemin. Le seuil penche vers « finie » : attendre pour rien
   coûte plus cher qu'un essai retiré. À la touche, aucun verdict. Le délai court ne descend pas sous 160 ms plus le
   temps d'un jugement.
4. - [ ] **Son interrupteur.** « Juger la fin de phrase par un modèle », dans les réglages avancés. Les deux délais
   restent des constantes, réglées sur le banc et écrites ici.
5. - [ ] **La preuve dans la page** : la page construite sous la CSP de la fenêtre, un clip « finie » puis un clip
   « pas finie » joués comme micro ; les deux délais se lisent dans la suite des états.
6. - [ ] Cocher ce plan avec le relevé, lier la PR, et écrire dans la feuille de route ce que le desktop doit
   réentendre.

## À trancher par CrOliX

1. **Le modèle entre dans le dépôt** : 8,7 Mo de plus dans Lun'Luxuria et dans l'appli.
2. **Le plafond d'attente.** Pipecat attend jusqu'à 3 s une phrase jugée pas finie. Les pauses intérieures relevées ne
   dépassent pas 1 s : je propose de partir de 1,5 s et de le corriger sur le banc.
3. **Ses vraies hésitations.** Les 122 phrases sont de synthèse. Dix minutes de CrOliX qui hésite, se reprend et
   laisse une phrase en suspens valent plus que les 1 130 autres phrases de Pipecat (4,3 Go à lire). Elles peuvent
   venir après la tâche 2 ; le relevé sera refait avec.

## Hors périmètre

- **« Attends, laisse-moi réfléchir »** : dire d'attendre par le sens. C'est au cerveau de le dire (un état du tour,
  comme chez OpenAmika et en option chez Pipecat). À cadrer avec le core, à part.
- **Le tour à l'essai lié au verdict** : son avance serait presque nulle (le verdict arrive quand la phrase se clôt
  déjà). Il reste comme il est.
- **La coupure qui se reprend, l'urgence devant, les bornes du tour à l'essai** : le plan suivant.
- La transcription au fil de l'eau ; la phrase d'attente pendant une délégation.

## Limites

- Les 122 phrases sont de synthèse et flattent le modèle ; les prises de CrOliX sont 38, au micro brut du desktop.
- Le temps d'un jugement dans la page n'est pas connu : 63 ms en Python, sur le même processeur. La transformation
  du son y demande un calcul que la page n'a pas en natif ; la tâche 1 le mesure.
- Une phrase finie jugée pas finie attend le plafond : un « ok » qui valide une carte pourrait attendre 1,5 s au lieu
  de 0,5 s. D'où le seuil qui penche, et les mots courts comptés à part.
- Les clips de Pipecat ont été ramenés à 16 kHz sans filtre quand ils n'y étaient pas ; les 122 l'étaient déjà.
- Rien n'est entendu : l'écoute sur le desktop reste la dernière étape.

## Ce que le plan-challenger a changé

Verdict « à amender », sept objections, toutes reprises. Les chiffres sur la voix de CrOliX étaient pris sur des
prises entières et comptaient trois silences parmi les mots : ils sont dits provisoires, corrigés, et deux résultats
omis sont rendus. Le relevé à la pause devient la tâche qui décide de la suite. Le verdict s'attend dans la chaîne de
trames, `Endpointer` reste synchrone. La touche n'a pas de verdict. Le tour à l'essai lié au verdict sort du plan.
Le test de l'entrée du modèle ne repose plus sur des probabilités saturées. Les champs de réglage des délais sortent.
Le téléchargement de 4,3 Go est remplacé par ses vraies hésitations.
