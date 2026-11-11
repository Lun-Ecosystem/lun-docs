# Le déroulé d'un tour : chaque décision datée, chaque délai nommé. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **PR :** [lun-luxuria#61](https://github.com/Lun-Ecosystem/lun-luxuria/pull/61) (#59) et lun-anima#104 (#103),
> en brouillon.

**But :** qu'un tour de parole laisse derrière lui la suite datée de ce qui s'est passé, du premier son de la
personne au dernier mot de Natsume, et que chaque délai en soit tiré sous un nom arrêté. C'est la première pièce du
banc de présence : sans elle, les autres mesurent sans expliquer.

**Source :** le cadrage [« Prouver la présence sans l'oreille »](../specs/2026-11-11-banc-presence-cadrage.md),
validé par CrOliX le 11/11 (lun-docs#161), § 4 pièce 1 et § 5 étape 1. Code relu sur `main` de Lun'Luxuria et de
Lun'Anima. Plan relu par le plan-challenger le 11/11 : « à amender », ses six objections sont reprises ici (voir la
fin).

**Critères de fin :**

- Chaque mécanisme de la page écrit ce qu'il décide, à l'instant où il le décide, sous un nom arrêté (voir « Les
  événements »).
- Une phrase de la personne a son propre numéro, posé à son premier son ; chaque essai de cette phrase a son rang ;
  le numéro de la réponse du serveur est une valeur de l'essai. Rien ne se retrouve par l'heure.
- Une seule horloge, qui ne recule pas, sert à la page entière ; au banc, c'est le temps du son rejoué.
- Le serveur joint à la fin de chaque réponse ses propres durées, sans les garder ; la page les range dans le même
  tour.
- Les délais d'un tour sont calculés depuis le déroulé, sous des noms arrêtés ; un délai dont une borne manque est
  absent, jamais déduit.
- Le déroulé s'exporte en un fichier, une ligne par événement, avec le numéro de version de son format.
- Rien ne change à ce que la personne entend ou voit. La mesure d'aujourd'hui reste, et le déroulé rend la même.
- Le texte d'une phrase écartée par le filtre n'est pas écrit dans le déroulé.

**Validé par CrOliX le 11/11**, par écrit en conversation.

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-luxuria`, `feat/deroule-tour` | à ouvrir à la validation | `standard` |
| `lun-anima`, `feat/delais-reponse` | à ouvrir à la validation | `standard` |
| `lun-docs`, `docs/deroule-tour` | les mêmes | `trivial` |

## Ce que le code fait aujourd'hui

- **Dans la page**, trois pièces prennent toutes les décisions d'un tour : la fin de phrase, la conversation et sa
  voix. Chacune prévient déjà la session par des événements, faits pour l'écran.
- **Une seule mesure** en sort : du dernier son de la personne au premier son de la réponse, pour vingt tours. Elle
  ne dit pas où le temps est passé, et s'annule dans deux cas (une réponse reprise après un bruit, une réponse sans
  voix).
- **Trois horloges** se mêlent : celle du mur (`Date.now()`, qui peut reculer) dans la conversation et à l'arrivée
  d'une trame ; la place de la trame dans le son, pour la fin de phrase ; aucune dans la voix. Une trame est datée à
  son arrivée mais jugée plus tard, après le modèle de voix. Au banc, la conversation vit à l'instant zéro pendant
  que la fin de phrase avance.
- **Avant tout numéro du serveur**, il se passe déjà beaucoup : voix détectée, voix tenue, pause, essai,
  transcription, verdict. Une phrase écartée ou un bruit n'ont jamais de numéro ; une phrase à l'essai retirée puis
  reprise en reçoit plusieurs ; la phrase suivante commence avant que la précédente ait le sien.
- **Le serveur** garde, par appel au modèle, le temps du premier mot, et par délégation, sa durée. Il rend le numéro
  de la réponse avant tout travail, puis la réponse finie, sans ces durées. L'attente dans sa file n'est mesurée
  nulle part.

## Les événements

Le vocabulaire du déroulé, version 1 du format. Les scénarios du plan suivant s'appuieront sur ces noms.

| Pièce | Événements |
|---|---|
| L'écoute | `voix`, `tenue`, `pause`, `reprise`, `fin`, `bruit` : chacun avec l'instant du son et l'instant de la décision |
| La phrase | `essai` (son rang, à l'essai ou final), `transcrite` (durée, confiance, longueur ; son texte si elle passe), `verdict` (pour elle, écartée, bruit), `envoyee`, `numero` (message et réponse), `retiree`, `confirmee`, `sans_reponse` |
| Le serveur | `phrase_recue` (rang, longueur), `fin_recue`, `durees` (celles que le serveur rend) |
| Sa voix | `synthese` (début, fin, échec), `son` (début, fin), `premier_son`, `suspendue`, `reprise_voix`, `coupee` (les mots entendus), `arretee`, `silence` |

Une parole sans phrase de la personne (rituel, parole spontanée, urgence, réponse à un message écrit) se retrouve par
le numéro de sa réponse seul. Une suspension porte la phrase qui l'a causée et la réponse suspendue.

## Les délais

Chacun va d'un événement à un autre.

| Nom | De… à… |
|---|---|
| `attente_fin` | le dernier son de la personne → `fin` décidée |
| `transcription` | `essai` → `transcrite` |
| `file_serveur` | la phrase reçue par le serveur → sa demande au modèle (rendu par le serveur) |
| `premier_mot` | la demande au modèle → son premier mot (rendu par le serveur) |
| `poste` | la demande à un poste → sa réponse (rendu par le serveur) |
| `second_mot` | la seconde demande au modèle → son premier mot (rendu par le serveur) |
| `premiere_phrase` | `envoyee` → la première `phrase_recue` ; marqué « à l'essai » quand la phrase est partie à une pause |
| `synthese` | `synthese` début → fin, par phrase |
| `blanc_de_tour` | le dernier son de la personne → `premier_son` ; égal à la mesure d'aujourd'hui |
| `arret_coupure` | `tenue` → `son` arrêté, en coupure franche seulement |

« Premier bruit » et « premier contenu » (la phrase d'attente n'est pas la réponse) attendent que le serveur dise
laquelle de ses phrases précède un poste : hors de ce plan.

## Tâches

1. - [x] **Une seule horloge** (Lun'Luxuria). La session, la conversation et la voix reçoivent la même, qui ne recule
   pas. Chaque événement de l'écoute porte l'instant du son et l'instant de la décision. Au banc, l'horloge est le
   temps du son rejoué. Fait d'un bloc, avant le reste : la mesure d'aujourd'hui, la fenêtre du filtre et les bornes
   de l'essai en dépendent. Tests : les tests existants passent ; au banc, une conversation n'est plus à l'instant
   zéro.
2. - [x] **Le déroulé, une pièce à part** (`src/trace.ts`). Une liste d'événements : l'instant, le nom, le numéro de
   phrase, le rang d'essai, le numéro de réponse quand il existe, quelques valeurs. Bornée aux derniers tours.
   Tests : l'ordre ; deux phrases qui se chevauchent restent séparées ; un essai retiré puis repris garde ses deux
   numéros de réponse sous la même phrase ; la borne.
3. - [x] **Les trois pièces écrivent**, en option : sans déroulé, rien ne change. Un test par cas tient la suite
   attendue : un tour simple ; une phrase à l'essai retirée puis confirmée ; une phrase écartée (sans son texte) ;
   un bruit ; une suspension reprise ; une coupure franche ; une parole sans phrase.
4. - [x] **Les délais nommés** : une fonction qui lit le déroulé et rend les délais du tableau. Tests sur des
   déroulés écrits à la main, dont les cas où une borne manque ; et l'égalité de `blanc_de_tour` avec la mesure
   d'aujourd'hui, qui reste émise.
5. - [x] **Les durées du serveur** (Lun'Anima). Cumulées pendant le tour, jointes une seule fois à la réponse finie,
   non gardées en base : l'attente dans la file, le premier mot, le poste, le second premier mot. Tests : une
   réponse simple, une délégation, une réponse coupée avant son premier mot (aucune durée inventée), une phrase
   fixe. Un corps plus ancien ignore le champ ; la page l'écrit dans le déroulé s'il est là, et seule sur un modèle
   mesure son premier mot elle-même.
6. - [x] **Le fichier.** Le banc écrit le déroulé de sa chaîne à côté du relevé, une ligne par événement. Dans la
   page, un bouton des réglages avancés l'enregistre, à côté des mesures de la session, qui ne changent pas. Le
   dépôt ignore ces fichiers.
7. - [x] Relecture séparée de chaque diff, deux PR en brouillon, ce plan coché.

## Hors périmètre

- Les scénarios écrits, qui liront ce déroulé : le plan suivant.
- Un tableau des délais au banc : avec une transcription et un serveur simulés, ils valent zéro ou une constante.
  Il viendra avec la chaîne entière sur le laptop.
- La seconde horloge, le son enregistré des deux voies : elle demande une vraie sortie sonore.
- Envoyer le déroulé à un outil de traces : le format reste un fichier de lignes.
- Baisser le délai de coupure, 400 ms par construction : ce plan le mesure, il ne le change pas.
- La coupure en mode doux et celle d'un mot court n'ont pas de délai d'arrêt : le son ne s'arrête pas sur la voix.

## Limites

- Les instants de la page et ceux du serveur ne sont pas sur la même horloge : le serveur rend des durées, pas des
  instants, pour que rien ne soit à recoller par l'heure.
- Un rituel, une parole spontanée et une urgence n'ont pas de réponse finie rendue à la page : leurs durées de
  serveur manquent au déroulé.
- Le premier son du déroulé est l'instant où la page donne le son à jouer, pas celui où il sort du haut-parleur.
- Le déroulé contient ce que la personne a dit à Natsume. Il reste en mémoire dans la page et ne s'écrit en fichier
  que sur son geste, ou dans le dossier du banc, hors dépôt.
- `blanc_de_tour` n'est égal à la mesure d'aujourd'hui que là où elle est émise. Une réponse retenue par un bruit
  puis relâchée a un `blanc_de_tour` qui compte la retenue, sans mesure d'aujourd'hui.
- Le texte d'une phrase qui finit sans réponse (écartée, bruit, échec de transcription ou d'envoi) est effacé du
  déroulé, même s'il avait été écrit à un essai.

## Ce que l'exécution a trouvé

- **Le banc devient fidèle.** Rejoué sur `main` puis sur la branche : coupure réelle 160/160 sur `main`, 157/160 sur
  la branche. Le déroulé en donne la cause. Au banc, la conversation vivait à l'instant zéro : la fenêtre de 15 s du
  filtre ne se fermait jamais. Trois phrases de 15 s voient maintenant leur fenêtre se fermer. La page ne change pas.
  `performance.now()` sert partout sur le tour ; `heardAt` et `busySince` restent sur `Date.now()`, sans comparaison
  croisée.
- **Écarts au plan.** La voix reçoit l'horloge par le déroulé. `premier_son` est écrit par la conversation, pour
  l'égalité stricte de `blanc_de_tour` avec la mesure d'aujourd'hui. `durees` garde les noms du serveur, traduits par
  `delays()`.
- **Le texte effacé va plus loin que prévu.** Décision de CrOliX : le texte d'une phrase finalement écartée est
  effacé du déroulé. Cela vaut aussi sur échec de transcription ou d'envoi.
- **L'export depuis la fenêtre Tauri** reste à faire : le bouton ne marche que dans un onglet de navigateur
  ([lun-luxuria#60](https://github.com/Lun-Ecosystem/lun-luxuria/issues/60)).

## Ce que le plan-challenger a changé

1. Le numéro de la réponse ne pouvait pas être la clé : une phrase a son numéro, un essai son rang.
2. Trois horloges ne se comparaient pas : une seule, posée d'abord ; le tableau des délais est retiré du banc.
3. Quatre délais étaient mal définis : `envoi` devient l'attente dans la file, rendue par le serveur ;
   `premiere_phrase` part de l'envoi ; `arret_coupure` ne vaut qu'en coupure franche ; la mesure d'aujourd'hui reste
   et sert de témoin.
4. Les durées du serveur sont cumulées et jointes en un seul endroit, sans être gardées.
5. Le texte d'une phrase écartée n'entre pas dans le déroulé ; le dépôt ignore les fichiers de déroulé.
6. Les noms d'événements et la version du format sont arrêtés, pour les scénarios à venir.
