# L'émotion par phrase, sur le modèle d'OpenAmika. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** Lun-Ecosystem/lun-anima#130 (`niveau:critique`, privé), critères figés par CrOliX le 23/11 ; sa part
> publique Lun-Ecosystem/lun-luxuria#107.
>
> **État : rédigé le 23/11.** Six décisions à poser à CrOliX, une à une (« Les décisions à poser »). Rien ne se code
> avant elles.
>
> Code relu sur `main` de Lun'Anima (`0a3f411`) et de Lun'Luxuria (`0b4f4a4`), le graphe d'abord, puis chaque point
> dans le code. Le code d'OpenAmika relu dans un clone en lecture seule. Lun'Anima est privé : ce plan dit le
> comportement du cerveau, ses critères, ses tâches et ses mesures. Les fichiers, les étapes de code et les tests du
> core sont dans un commentaire de l'issue privée ([`securite.md`](../../standards/securite.md), « Dépôts publics »).

**But :** le modèle choisit une émotion pour chaque phrase qu'il dit à voix haute, dans une liste courte propre à
Natsume. Elle voyage avec la phrase jusqu'au corps, Lun'Luxuria, qui la garde prête pour la voix et le visage. Elle
n'apparaît nulle part ailleurs. Jouer l'émotion viendra plus tard.

**Source :** les deux issues et leurs critères. L'étude du 23/11 sur OpenAmika, référence principale de la présence
du compagnon (https://github.com/zeekk0/OpenAmika) : c'est le vrai écart avec lui. La spec
[Natsume, un être présent](../specs/2026-11-05-natsume-etre-presence-design.md), § 4.2 (tempérament de départ),
§ 4.3 (évolution) et § 4.7 (humeur). La spec de [Lun'Luxuria](../specs/2026-11-06-lun-luxuria-design.md), § 5.1 (le
corps, `setMood(...)` plus tard) et § 11. La règle « Rien en dur » ([`qualite.md`](../../standards/qualite.md)).

**Critères de fin**, ceux de Lun-Ecosystem/lun-anima#130, chacun prouvé en local :

1. **Le modèle choisit une émotion pour chaque phrase**, dans une liste courte propre à Natsume, tenue en
   configuration (pas écrite dans le code). Tâches 1 et 3.
2. **Le cerveau transmet l'émotion avec chaque phrase jusqu'à Luxuria** ; un Luxuria plus ancien l'ignore sans
   planter. Tâches 1, 3 et 4.
3. **L'émotion n'apparaît nulle part ailleurs** : ni à l'écrit, ni sur le mobile, ni dans l'historique, la mémoire
   ou les journaux. Tâches 1 et 3.
4. **Une émotion oubliée ou hors de la liste revient au neutre.** Tâches 1 à 4 (lecture à trancher : décision 6).
5. **Luxuria reçoit l'émotion et la garde prête** pour la voix et le visage, qui la joueront plus tard. Tâches 2
   et 4.
6. **Tests, et preuve sur une vraie conversation en local, coût du prompt mesuré.** Tâches 1 à 5.

Ceux de Lun-Ecosystem/lun-luxuria#107 sont la part de Luxuria des critères 2, 4 et 5 : émotion optionnelle par
phrase, inconnue traitée comme neutre, tenue jusqu'à la lecture, ni affichée ni journalisée en clair, tests.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-anima` : 3 tâches (1, 3, 5) | dans l'issue privée | Lun-Ecosystem/lun-anima#130 | `critique` |
| `lun-luxuria` : la réception, ses tests | `feat/emotion-par-phrase` | Lun-Ecosystem/lun-luxuria#107 | `critique` |
| `lun-docs` : ce plan, ses coches, ses chiffres | `docs/emotion-par-phrase` | les deux | `trivial` |

**Le niveau.** `critique`, décidé par CrOliX : le chantier change le message de parole entre le cerveau et le corps,
et ajoute une règle à chaque tour parlé, donc au coût. Chaque comportement changé a son test, écrit d'abord par le
testeur ([`workflow.md`](../../standards/workflow.md)). Le plan passe au contradicteur avant la validation. Une PR
par dépôt ; celle du core ferme Lun-Ecosystem/lun-anima#130, celle de Luxuria ferme Lun-Ecosystem/lun-luxuria#107.

## Ce qu'OpenAmika fait, relu dans son code

- **Le modèle écrit une étiquette devant chaque phrase** : `[registre_émotion]"phrase"`, sans intensité, sans
  combinaison ; s'il change d'émotion au milieu, il coupe en deux phrases (`brain/defaults/例子.txt:15-46`). Cinq
  registres et leurs émotions font 69 clés, liées à sa voix livrée.
- **Un parseur de flux découpe la sortie en segments** `{text, tone}` (`brain/po_contract.py:452-545`). Une
  étiquette inconnue se normalise vers la plus proche du même registre, sinon vers le neutre
  (`brain/po_contract.py:127-148`). Une citation sans étiquette prend la dernière vue, ou le neutre.
- **Un message par phrase part vers le corps** : `{audio, emotion, pause_after, text}`, le texte sans l'étiquette
  (`speech/api.py:3932-3945`).
- **Le visage change au début réel de la lecture de sa phrase** : expression, sous-titre et voix sur la même image
  (`docs/AVATAR.md:7-12`).
- **Les étiquettes sont retirées de l'historique** et de l'archive de la mémoire (`brain/webui.py:942-950`).

**Ce qu'on reprend** : une étiquette par phrase écrite par le modèle, sans intensité ; le retrait à la lecture du
flux ; le repli neutre ; l'émotion portée par le message de chaque phrase ; l'émotion appliquée au début réel de la
lecture ; l'historique sans étiquette.

**Ce qu'on ne reprend pas** : les 69 clés et leurs registres (liés à sa voix livrée, sous licence d'usage
personnel) ; son personnage ; les guillemets autour de la phrase (notre cerveau découpe déjà les phrases, et des
guillemets se mêleraient aux « » du français et au fil écrit) ; la pause par émotion (`pause_after`) ; la
normalisation vers « la plus proche », inutile sur une liste de six.

## Ce que le code fait aujourd'hui

**Le cerveau**, en comportement :

- **Natsume a un socle fixe et un tempérament en base**, qui évolue pendant la nuit (§ 4.3). Le tempérament de
  départ : façade froide et crue, douceur dessous, gêne brève quand il la remarque, présence sans grands mots quand
  il va mal.
- **L'humeur est calculée en code** à chaque tour, depuis les urgences et les cartes en attente, et revient seule
  au neutre. Elle n'entre dans le prompt que par une phrase, au-dessus d'un seuil de tension. Elle n'est gardée nulle
  part.
- **Un tour parlé** (une réponse à la voix, le rituel d'arrivée, une parole d'elle-même, la seconde réponse après
  une délégation) se découpe en phrases dans le flux du modèle. La première peut s'arrêter à une virgule. Chaque
  phrase perd son markdown et ses repères de carte, passe le masque des secrets, puis part sur le flux en direct :
  `{type: 'speech', id, n, text, why}`, puis `{type: 'speech-end', id, why}` à la fin.
- **Le même flux du modèle** sert le fil (le bureau, le web, le mobile, et le fil de Luxuria par la réponse en
  flux), le texte gardé de la réponse (l'historique rejoué au modèle, la mémoire, la nuit, les tics) et la coupure
  (ce que CrOliX a entendu, renvoyé par Luxuria).
- **Les consignes propres à la voix** viennent en dernier dans le prompt, pour que l'écrit et la voix partagent le
  même début. Le chemin d'Anthropic ne pose aucun marqueur de cache aujourd'hui : chaque jeton ajouté au prompt d'un
  tour parlé se paie en entrée, à chaque appel.
- **Un tour écrit** (le mobile, le bureau au clavier) n'a ni phrase sur le flux en direct ni consigne de voix.

**Lun'Luxuria** :

- `src/brain.ts:3-6` : le type du flux en direct, `speech` sans émotion. `src/core.ts:134` lit chaque trame en JSON
  sans la valider : un champ de plus est ignoré aujourd'hui. Un Luxuria ancien tient donc déjà le critère 2.
- `src/conversation.ts:164-182` (`onLive`) : écrit `phrase_recue` dans la trace (rang, longueur, pourquoi), puis
  passe le texte au haut-parleur par `speaker.add(id, text, urgent)` (type à `:22`).
- `src/speech/speaker.ts:24-27` : une phrase en attente est `{text, clip}`. `add` à `:138-150`. Au début réel de la
  lecture, `subtitle` part à `:221` ; sans voix, `subtitle` muet à `:210`. Le type des événements à `:18-22`.
- `src/session.svelte.ts:467-485` : la session reçoit `subtitle`, affiche son texte, l'efface au silence.
- `src/body/body.ts` : l'état du corps et la bouche ; pas encore d'humeur (§ 5.1, `setMood(...)` plus tard).
- `src/local.ts` (Luxuria seul sur un modèle) et `src/presence/fakes.ts` (le banc) publient des `speech` sans
  émotion : ils restent tels quels.

## Le contrat de sortie du modèle

- **La forme** : `{emotion}` en tête de chaque phrase, un seul mot de la liste, sans intensité, sans combinaison,
  sans guillemets. Exemple : `{seche} Mange quelque chose. {douce} Un café, c'est pas un repas.`
- **Pourquoi des accolades.** Le français parlé n'en a pas, le markdown non plus. Les crochets et les parenthèses
  sont déjà pris : un lien `[texte](adresse)` et un repère de carte, que le découpage des phrases tient ouverts
  jusqu'à leur fin.
- **Compatible avec le flux phrase par phrase.** L'étiquette se retire à la lecture du flux du modèle, avant
  quiconque. Un `{` retient le texte qui le suit jusqu'à `}`. Ce qui n'est pas une étiquette (un autre signe que des
  lettres ou `_`, ou plus de 24 signes sans fermer) repart tel quel. Une étiquette coupée entre deux morceaux du
  flux se recolle.
- **Une émotion est en force** de son étiquette jusqu'à la suivante ou à la fin du tour. Chaque phrase publiée porte
  celle en force à son premier mot. Le découpage du cerveau ne suit pas exactement les phrases du modèle (la
  première coupe à une virgule) : c'est ce qui garde la même émotion aux deux moitiés d'une phrase.
- **La comparaison** se fait sans casse ni accents : `{Gênée}` vaut `genee`.
- **La consigne** ne s'ajoute qu'aux tours parlés, en dernier, après ce que l'écrit et la voix partagent. Elle donne
  la liste avec une ligne par émotion, et rappelle de couper la phrase quand l'émotion change.

## Le contrat du message vers le corps

- `speech` gagne un champ **optionnel** : `{type: 'speech', id, n, text, why, emotion?}`. `text` ne change pas : la
  phrase dite, sans étiquette.
- **Le neutre ne s'envoie pas** : sans étiquette valide, le champ est absent. Une phrase neutre d'un cerveau nouveau
  est donc identique à celle d'un cerveau ancien. Le corps lit « absent » comme neutre.
- **La valeur est un identifiant de la liste**, en minuscules, sans accents (`[a-z_]`, 24 signes au plus). Luxuria ne
  connaît pas la liste : il garde ce qui a cette forme, et traite le reste comme absent. Une émotion qu'il ne sait
  pas jouer sera jouée neutre quand la voix et le visage viendront.
- **Un Luxuria ancien** lit la trame sans la valider et ignore le champ (`src/core.ts:134`). Un cerveau ancien
  n'envoie jamais le champ. Aucune version n'a besoin de l'autre.
- `speech-end` et le reste du contrat ne changent pas.

## Où l'étiquette est retirée

**Un seul point** : la lecture du flux du modèle, dans le cerveau, sur chaque appel qui parle. Le texte propre en
sort, avec l'émotion en force à côté. Tout le reste ne voit que le texte propre :

| Ce qui lit | Ce qu'il reçoit |
|---|---|
| Le fil : bureau, web, mobile, fil de Luxuria (la réponse en flux) | le texte sans étiquette |
| Le texte gardé : l'historique rejoué au modèle, la mémoire, la nuit, les tics | le texte sans étiquette |
| La coupure : ce qui a été entendu, comparé au texte gardé | le texte sans étiquette |
| Le silence choisi d'une parole d'elle-même (« rien ») | jugé sur le texte sans étiquette |
| Les journaux du cerveau et la trace de Luxuria | ni le texte brut ni l'émotion |
| La voix : le texte de chaque phrase | sans étiquette ; l'émotion à part, dans son champ |
| Les outils de mesure du cerveau (premier mot, scènes) | le même retrait |

Une phrase sans modèle (un texte du code dit à voix haute) n'a pas d'étiquette : elle part sans émotion.

## Le repli neutre

- Pas d'étiquette en tête du tour : neutre jusqu'à la première.
- Une étiquette hors de la liste : retirée du texte, neutre jusqu'à la suivante.
- Une étiquette mal formée (pas de `}`, d'autres signes) : ce n'est pas une étiquette, le texte passe tel quel. Elle
  compte comme invalide dans la mesure (tâche 5).
- Une liste illisible dans la configuration : la liste par défaut, et une ligne de journal qui le dit, une fois.
- Le cas d'une étiquette oubliée au milieu d'un tour est la décision 6.

## Le coût du prompt, à mesurer

- **En entrée** : la consigne et la liste, environ 150 jetons par appel parlé (estimation, à mesurer). Sans cache sur
  le chemin d'Anthropic, ils se paient à chaque appel, y compris la seconde réponse après une délégation. Un tour
  écrit ne paie rien.
- **En sortie** : 3 à 4 jetons par phrase pour l'étiquette.
- **Le premier mot** : l'étiquette passe avant le premier mot, et le retrait retient le texte jusqu'à `}`. Quelques
  jetons de plus avant le premier son.
- **Mesuré à la tâche 5**, sur le modèle du rodage, raisonnement coupé : jetons d'entrée et coût d'un tour parlé avant
  et après ; taux d'étiquettes valides ; délai du premier mot. Les chiffres s'écrivent ici.

## Les décisions à poser

Une à une, à CrOliX, dans cet ordre. Chacune avec ma recommandation.

1. **La liste des émotions de Natsume.** Recommandé : six, en accord avec son tempérament, rien de dramatique (ni
   colère, ni larmes, ni euphorie) :

   | Identifiant | Ce qu'elle dit au modèle |
   |---|---|
   | `neutre` | le ton ordinaire, le repli |
   | `seche` | la façade : sec, cru, une pique |
   | `douce` | la douceur dessous : elle prend soin, sans le dire |
   | `genee` | il a remarqué sa tendresse : une gêne brève |
   | `amusee` | un sourire en coin, une moquerie légère |
   | `inquiete` | il va mal, ou une urgence : présente, sans grands mots |

   `vexee` (un travail bâclé la vexe, dit le tempérament) en septième si CrOliX le veut. Ces textes sont de la
   donnée : ils se relisent comme ceux du tempérament.
2. **Où la liste se règle.** Recommandé : dans la configuration de l'instance, lue à chaque tour parlé, avec la liste
   ci-dessus comme seul défaut dans le code. **Pas d'écran dans ce chantier** : la liste change rarement, et un écran
   demande son propre passage de design ; une issue à part s'il le veut. Elle n'évolue pas avec le tempérament : le
   visage et la voix devront savoir jouer chaque émotion.
3. **Le lien avec l'humeur calculée en code.** Recommandé : **indépendants en code**. L'humeur reste ce qu'elle est
   (une phrase dans le prompt au-dessus d'un seuil) et colore déjà le choix du modèle. Le code ne borne pas l'émotion
   par l'humeur. Plus tard, le corps pourra les combiner : l'humeur pour le visage au repos, l'émotion pour la
   phrase.
4. **L'intensité.** Recommandé : **non**. OpenAmika l'interdit aussi, elle coûte des jetons, et ni la voix ni le
   visage ne la joueront avant longtemps.
5. **Les phrases écrites au mobile en portent-elles ?** Recommandé : **non**, comme le défaut posé. Un tour écrit n'a
   ni consigne, ni étiquette, ni coût de plus.
6. **Une étiquette oubliée au milieu d'un tour** (critère 4). Recommandé : **la phrase garde l'émotion en force**,
   le neutre seulement en tête d'un tour sans étiquette ou après une étiquette inconnue. Le découpage du cerveau coupe
   parfois une phrase du modèle en deux, et un visage qui retombe au neutre au milieu d'une réplique se verrait.
   L'autre lecture, stricte : toute phrase sans sa propre étiquette est neutre ; le modèle doit alors en écrire une
   par phrase, sans faute. C'est une lecture d'un critère figé : à CrOliX.

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit échouer ; un développeur écrit le code ; le
**reviewer** relit le diff. Elle se ferme sur les barrières du dépôt au vert. Lun'Luxuria : `npm test`,
`npm run lint`, `npm run typecheck`, `npm run format:check`. Lun'Anima : les siennes, dans l'issue privée.

**L'ordre.** **1 et 2 partent en parallèle** (deux dépôts, aucun fichier commun). **3 et 4 partent en parallèle**, 3
après 1, 4 après 2. 5 après 3 (et 4 pour son dernier point). 6 en dernier. Le contrat du message (section plus haut)
est la seule chose que 3 et 4 partagent : il ne bouge pas sans ce plan.

1. - [ ] **Les tests du cerveau, rouges** (testeur, Lun'Anima ; fichiers dans l'issue privée).
   - **Le retrait** : une étiquette en tête, deux étiquettes dans un tour, une étiquette coupée entre deux morceaux
     du flux, `{Gênée}` sans casse ni accents, une étiquette inconnue retirée, un `{` sans fin et `{a b}` laissés
     tels quels, un lien et un repère de carte qui passent intacts.
   - **Le message** : chaque phrase publiée porte l'émotion en force à son premier mot ; la première coupée à une
     virgule et sa suite portent la même ; neutre, le champ est absent.
   - **Nulle part ailleurs** : sur un tour parlé avec étiquettes, le flux du fil, le texte gardé, l'historique rejoué
     au modèle, le silence choisi et la coupure ne voient aucune accolade. Sur les quatre sortes de tour parlé (une
     réponse, le rituel, une parole d'elle-même, la seconde réponse après une délégation).
   - **La consigne** : présente dans un tour parlé, avec la liste lue de la configuration ; absente d'un tour écrit,
     dont le prompt reste identique à celui d'aujourd'hui. Une liste illisible donne le défaut.
   - **Le repli** selon la décision 6.
   - Exclu : tout test de voix ou de visage ; tout changement d'un attendu existant sans le nommer dans la PR.

2. - [ ] **Les tests de Luxuria, rouges** (testeur, Lun'Luxuria ; `src/conversation.test.ts`,
   `src/speech/speaker.test.ts`, la session).
   - Un `speech` avec `emotion: 'douce'` : `speaker.add` la reçoit avec la phrase ; `subtitle` la porte au début réel
     de la lecture de **cette** phrase, pas à sa réception ; le `subtitle` muet (voix en échec) aussi.
   - Deux phrases d'émotions différentes en file : chacune garde la sienne jusqu'à sa lecture.
   - Sans `emotion` : rien ne change (les tests d'aujourd'hui passent sans retouche).
   - `emotion` mal formée (`'DOUCE !'`, `42`, `''`, 40 signes) : traitée comme absente, sans erreur.
   - La session garde l'émotion de la phrase lue, sans l'afficher, et l'oublie au silence.
   - La trace (`phrase_recue`, `son`) n'écrit pas l'émotion ; le sous-titre affiché reste le texte seul.
   - Exclu : `src/local.ts`, `src/presence/fakes.ts`, le banc.

3. - [ ] **Le cerveau** (`dev-core`, Lun'Anima ; étapes dans l'issue privée). Après 1.
   - La liste en configuration de l'instance avec son défaut (décisions 1 et 2) ; la consigne des tours parlés ; le
     retrait au seul point de lecture du flux ; le champ `emotion` sur `speech`, absent au neutre.
   - Le même retrait dans les outils de mesure du cerveau, pour que la tâche 5 mesure le vrai chemin.
   - Exclu : un écran ; l'humeur (décision 3) ; un cache du prompt ; le tempérament.

4. - [ ] **La réception dans Luxuria** (`dev-luxuria`, Lun'Luxuria). Après 2, en parallèle de 3.
   - `src/brain.ts` : `emotion?: string` sur `speech`, et une petite fonction qui garde une valeur de forme `[a-z_]`,
     24 signes au plus, sinon `undefined`.
   - `src/conversation.ts` (`onLive`) : passe l'émotion filtrée à `speaker.add(id, text, urgent, emotion)` ; la trace
     reste telle quelle.
   - `src/speech/speaker.ts` : la phrase en attente porte son émotion ; les deux `subtitle` la portent.
   - `src/session.svelte.ts` : l'émotion de la phrase lue, gardée en état, non affichée, oubliée au silence. C'est le
     point où la voix et le visage la liront (§ 5.1, `setMood(...)`).
   - Exclu : jouer l'émotion ; la synthèse (`#synth`) ne la reçoit pas encore ; aucun réglage, aucun texte à l'écran.

5. - [ ] **La preuve en local, avec le vrai modèle** (testeur ou session ; commandes dans l'issue privée). Après 3.
   - Le cerveau en local sur une base de test, le modèle du rodage, raisonnement coupé, par le vrai service, avec les
     vraies consignes. Le budget de la mesure se dit à CrOliX avant de lancer.
   - **Une conversation parlée longue** (au moins 20 tours, fil plein) : taux d'étiquettes valides par phrase, en
     début et en fin de conversation ; répartition des émotions ; aucune accolade dans le fil, le texte gardé, ni les
     journaux.
   - **Le coût** : jetons d'entrée du prompt d'un tour parlé avant et après, coût moyen d'un tour parlé, d'après le
     décompte du cerveau ; un tour écrit inchangé.
   - **Le premier mot** : le délai médian avant et après, avec l'outil de mesure du premier mot.
   - **Le corps** : les trames `speech` lues sur le flux en direct portent l'émotion ; si Luxuria tourne sur le poste
     contre ce cerveau, sa session la tient (sinon, le dire dans la PR : prouvé par les tests de la tâche 4 seuls).
   - Les chiffres s'écrivent dans ce plan. Si le taux tombe en conversation longue, le dire à CrOliX avant de rien
     changer (« Risques »).

6. - [ ] **La livraison** (livreur). Une PR en brouillon par dépôt : Lun'Anima (ferme Lun-Ecosystem/lun-anima#130),
   Lun'Luxuria (ferme Lun-Ecosystem/lun-luxuria#107), et celle de ce plan, cochée au fil des tâches.

## Risques

- **Le modèle cesse d'étiqueter en conversation longue.** Son historique rejoué ne montre aucune étiquette : il peut
  imiter ses réponses passées. OpenAmika fait de même. La tâche 5 le mesure en début et en fin de fil. Le remède
  possible (rejouer les étiquettes dans l'historique d'un tour parlé) ferait voyager l'étiquette dans le texte gardé :
  à décider par CrOliX sur les chiffres, pas d'avance.
- **Le premier mot recule** de quelques jetons. La cible de 2,5 s tient-elle ? La tâche 5 le dit.
- **Le coût** : environ 150 jetons d'entrée par appel parlé, sans cache. Petit sur Haiku, mais chaque appel parlé le
  paie, la seconde réponse d'une délégation comprise.
- **Une émotion choisie au hasard** se verra quand le visage la jouera. Rien ne la vérifie aujourd'hui ; les scènes
  de contrôle pourront la regarder plus tard.
- **Un `{` légitime** dans un tour parlé (rare à l'oral) : retenu jusqu'à 24 signes, puis rendu tel quel. Le texte
  reste juste ; la voix l'a déjà eu en retard.

## Hors périmètre

Jouer l'émotion à la voix (la synthèse, RVC) ou au visage (les images, Live2D, `setMood`) : plus tard. Un écran pour
la liste. L'humeur calculée en code et son lien avec le visage. La pause par émotion d'OpenAmika. Les émotions en
mode Luxuria seul (`src/local.ts`) et au banc. Le cache du prompt chez Anthropic. Une liste qui évolue avec le
tempérament.

## Limites

- Non vérifié : le nombre de jetons de la consigne et de la liste (estimé, pas compté) ; que le modèle du rodage
  suive le format sur un fil long ; qu'aucun journal du cerveau n'écrive le texte d'une réponse (relu en partie, à
  garder par un test de la tâche 1) ; que Luxuria puisse tourner contre un cerveau local sur le laptop pour la
  tâche 5.
- OpenAmika relu dans les passages cités seulement, pas lancé (sa voix demande une RTX).
