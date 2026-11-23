# L'émotion par phrase, sur le modèle d'OpenAmika. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **PR du chantier :** Lun-Ecosystem/lun-anima#132 (privé, brouillon) ; Lun-Ecosystem/lun-luxuria#108 (brouillon).
>
> **Issues :** Lun-Ecosystem/lun-anima#130 (`niveau:critique`, privé), critères figés par CrOliX le 23/11 ; sa part
> publique Lun-Ecosystem/lun-luxuria#107. **PR :** Lun-Ecosystem/lun-docs#198 (brouillon).
>
> **État : rédigé le 23/11 ; contesté le 23/11 (« à amender ») ; amendé le 23/11 avec les décisions de CrOliX du
> 23/11** (« Les décisions de CrOliX, le 23/11 »). **Validé par CrOliX le 23/11.**
>
> Code relu sur `main` de Lun'Anima (`0a3f411`) et de Lun'Luxuria (`0b4f4a4`), le graphe d'abord, puis chaque point
> dans le code. Le code d'OpenAmika relu dans un clone en lecture seule. Lun'Anima est privé : ce plan dit le
> comportement du cerveau, ses critères, ses tâches et ses mesures. Les fichiers, les étapes de code et les tests du
> core sont dans les commentaires de l'issue privée ([`securite.md`](../../standards/securite.md), « Dépôts
> publics »).

**But :** le modèle choisit une émotion pour chaque phrase qu'il dit à voix haute, dans une liste courte propre à
Natsume. Elle voyage avec la phrase jusqu'au corps, Lun'Luxuria, qui la garde prête pour la voix et le visage. Elle
n'est affichée ni gardée nulle part ailleurs. Jouer l'émotion viendra plus tard.

**Source :** les deux issues et leurs critères. L'étude du 23/11 sur OpenAmika, référence principale de la présence
du compagnon (https://github.com/zeekk0/OpenAmika) : c'est le vrai écart avec lui. La spec
[Natsume, un être présent](../specs/2026-11-05-natsume-etre-presence-design.md), § 4.2 (tempérament de départ),
§ 4.3 (évolution) et § 4.7 (humeur). La spec de [Lun'Luxuria](../specs/2026-11-06-lun-luxuria-design.md), § 5.1 (le
corps, `setMood(...)` plus tard) et § 11. La règle « Rien en dur » ([`qualite.md`](../../standards/qualite.md)). La
contestation du 23/11 et les décisions de CrOliX du même jour.

**Critères de fin**, ceux de Lun-Ecosystem/lun-anima#130, chacun prouvé en local :

1. **Le modèle choisit une émotion pour chaque phrase**, dans une liste courte propre à Natsume, tenue en
   configuration (pas écrite dans le code). Tâches 1, 3 et 6.
2. **Le cerveau transmet l'émotion avec chaque phrase jusqu'à Luxuria** ; un Luxuria plus ancien l'ignore sans
   planter. Tâches 1, 3, 4 et 6.
3. **L'émotion n'apparaît nulle part ailleurs** : ni à l'écrit, ni sur le mobile, ni dans l'historique, la mémoire
   ou les journaux. « N'apparaît pas » se lit « n'est ni affichée ni gardée » (« Le contrat du message »). Tâches 1,
   3 et 6.
4. **Une émotion oubliée ou hors de la liste revient au neutre**, lu selon la décision 2 : au neutre en tête de
   réponse ou après une inconnue ; oubliée au milieu, la phrase garde celle d'avant. Tâches 1 à 4.
5. **Luxuria reçoit l'émotion et la garde prête** pour la voix et le visage, qui la joueront plus tard. Tâches 2, 4
   et 5.
6. **Tests, et preuve sur une vraie conversation en local, coût du prompt mesuré.** Tâches 1 à 6.

Ceux de Lun-Ecosystem/lun-luxuria#107 sont la part de Luxuria des critères 2, 4 et 5 : émotion optionnelle par
phrase, inconnue traitée comme neutre, tenue jusqu'à la lecture, ni affichée ni journalisée en clair, tests.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-anima` : 3 tâches (1, 3, 6) | dans l'issue privée | Lun-Ecosystem/lun-anima#130 | `critique` |
| `lun-luxuria` : réception, scénario, tests | `feat/emotion-par-phrase` | Lun-Ecosystem/lun-luxuria#107 | `critique` |
| `lun-docs` : ce plan, ses coches, ses chiffres | `docs/emotion-par-phrase` | les deux | `trivial` |

**Le niveau.** `critique`, décidé par CrOliX : le chantier change le message de parole entre le cerveau et le corps,
et ajoute une consigne à chaque tour parlé, donc au coût. Chaque comportement changé a son test, écrit d'abord par
le testeur ([`workflow.md`](../../standards/workflow.md)). Une PR par dépôt ; celle du core ferme
Lun-Ecosystem/lun-anima#130, celle de Luxuria ferme Lun-Ecosystem/lun-luxuria#107.

## Les décisions de CrOliX, le 23/11

1. **Sept émotions** : neutre, sèche, douce, gênée, amusée, inquiète, vexée. Elles sont rangées dans les **données de
   l'instance**, à côté du tempérament. Le code ne garde qu'un **défaut neutre** (règles « agents neutres » et « rien
   en dur »). Les identifiants sont validés à la lecture : `[a-z_]`, 24 signes au plus, donc sans accents : `neutre`,
   `seche`, `douce`, `genee`, `amusee`, `inquiete`, `vexee`. Un test de garde « rien en dur » parcourt les sources.
2. **Une émotion devant chaque phrase, comme OpenAmika.** Une émotion oubliée au milieu d'une réponse garde celle
   d'avant ; le neutre seulement en tête de réponse ou après une émotion inconnue.
3. **L'humeur reste indépendante** de l'émotion, en code. **Pas d'intensité.** **Pas d'émotion sur les tours
   écrits** (le mobile, l'écrit au bureau).

Une urgence se dit par un texte fixe du code, jamais par `inquiete` : une phrase fixe ne porte pas d'émotion.

## Ce qu'OpenAmika fait, relu dans son code

- **Le modèle écrit une étiquette devant chaque phrase** : `[registre_émotion]"phrase"`, sans nombre d'intensité,
  sans combinaison ; s'il change d'émotion au milieu, il coupe en deux phrases (`brain/defaults/例子.txt:15-46`). Cinq
  registres et leurs émotions font 69 clés, liées à sa voix livrée. Les nombres sont interdits, mais **l'intensité
  vit dans les clés elles-mêmes** (`very_happy`, `very_shy`).
- **Un parseur de flux découpe la sortie en segments** `{text, tone}` (`brain/po_contract.py:452-545`). Un segment
  finit à la fermeture de sa citation, **à l'étiquette suivante** ou à la fin du texte (`:457-459`). Une étiquette
  inconnue se normalise vers la plus proche du même registre, sinon vers le neutre (`:127-148`). Une citation sans
  étiquette prend la dernière vue, ou le neutre.
- **Un message par phrase part vers le corps** : `{audio, emotion, pause_after, text}`, le texte sans l'étiquette
  (`speech/api.py:3932-3945`).
- **Le visage change au début réel de la lecture de sa phrase** : expression, sous-titre et voix sur la même image
  (`docs/AVATAR.md:7-12`).
- **Les étiquettes sont retirées de l'historique** et de l'archive de la mémoire (`brain/webui.py:942-950`).

**Ce qu'on reprend** : une étiquette devant chaque phrase, écrite par le modèle ; l'étiquette qui ferme le segment en
cours ; le retrait à la lecture du flux ; le repli neutre ; l'émotion portée par le message de chaque phrase ;
l'émotion appliquée au début réel de la lecture ; l'historique sans étiquette.

**Ce qu'on ne reprend pas** : les 69 clés, leurs registres et leurs degrés (liés à sa voix livrée, sous licence
d'usage personnel) ; son personnage ; les guillemets autour de la phrase (notre cerveau découpe déjà les phrases, et
des guillemets se mêleraient aux « » du français) ; la pause par émotion (`pause_after`) ; la normalisation vers « la
plus proche », inutile sur une liste de sept.

## Ce que le code fait aujourd'hui

**Le cerveau**, en comportement :

- **Natsume a un socle fixe et un tempérament dans les données de l'instance**, qui évolue pendant la nuit (§ 4.3).
  Le tempérament de départ : façade froide et crue, douceur dessous, gêne brève quand il la remarque, vexée par un
  travail bâclé, présence sans grands mots quand il va mal.
- **L'humeur est un état calculé en code**, qui revient seul au neutre et colore le ton par le prompt (§ 4.7).
- **Quatre sortes de tour parlé** : une réponse à la voix ; le rituel d'arrivée ; une parole d'elle-même ; la seconde
  réponse après une délégation, quand le tour est parlé. La réponse, le rituel et la seconde réponse se disent au fil
  du flux du modèle. **La parole d'elle-même se dit d'un bloc à la fin**, depuis le texte gardé, parce qu'elle peut
  choisir de ne rien dire.
- **Chaque phrase dite** perd son markdown et ses repères de carte, passe le masque des secrets, puis part sur le flux
  en direct : `{type: 'speech', id, n, text, why}`, puis `{type: 'speech-end', id, why}` à la fin. La première peut
  s'arrêter à une virgule.
- **Le même flux du modèle** sert le fil (le bureau, le web, le mobile, et le fil de Luxuria par la réponse en flux),
  le texte gardé (l'historique rejoué au modèle, la mémoire, la nuit, les tics) et la coupure (ce que CrOliX a
  entendu, renvoyé par Luxuria). La date du premier mot d'une réponse se prend sur le premier morceau du flux.
- **Des textes sans modèle** se disent aussi : le texte d'un poste quand il est toute la réponse, et les phrases fixes
  du code (une urgence, une annulation).
- **Les consignes propres à la voix** ne s'ajoutent qu'aux tours parlés. Chaque jeton ajouté à un tour parlé se paie
  à chaque appel.
- **Le flux en direct** part vers tous les clients ouverts, le téléphone compris. L'interface du cerveau ne lit pas
  les trames de parole aujourd'hui.

**Lun'Luxuria** :

- `src/brain.ts:3-6` : le type du flux en direct, `speech` sans émotion. `src/core.ts:134` lit chaque trame en JSON
  sans la valider : un champ de plus est ignoré aujourd'hui. Un Luxuria ancien tient donc déjà le critère 2.
- `src/conversation.ts:164-182` (`onLive`) : écrit `phrase_recue` dans la trace (rang, longueur, pourquoi), puis
  passe le texte au haut-parleur par `speaker.add(id, text, urgent)` (type à `:22`).
- `src/speech/speaker.ts:24-27` : une phrase en attente est `{text, clip}`. `add` à `:138-150`. Au début réel de la
  lecture, `subtitle` part à `:221` ; sans voix, `subtitle` muet à `:210`. Le type des événements à `:18-22`. Une
  phrase reprise après une suspension se relit avec son rang.
- `src/session.svelte.ts:467-485` : la session reçoit `subtitle`, affiche son texte, l'efface au silence.
- `src/body/body.ts` : l'état du corps et la bouche ; pas encore d'humeur (§ 5.1, `setMood(...)` plus tard).
- `src/presence/fakes.ts` : le faux cerveau des scénarios, qui publie des `speech` ; `npm run chaine` joue un
  scénario dans Chrome sans interface, avec une sonde posée sur la page (`src/presence/chaine/sonde.ts`).
- `src/local.ts` (Luxuria seul sur un modèle) publie des `speech` sans émotion : il reste tel quel.

## Le contrat de sortie du modèle

- **La forme** : `{emotion}` devant chaque phrase, un seul mot de la liste, sans intensité, sans combinaison, sans
  guillemets. Exemple : `{seche} Mange quelque chose. {douce} Un café, c'est pas un repas.`
- **Pourquoi des accolades.** Le français parlé n'en a pas, le markdown non plus. Les crochets et les parenthèses
  sont déjà pris : un lien `[texte](adresse)` et un repère de carte, que le découpage des phrases tient ouverts
  jusqu'à leur fin.
- **Où une étiquette est reconnue** : en tête d'une réponse, après une fin de phrase (`.`, `!`, `?`, `…` suivis d'un
  blanc) ou après un retour à la ligne. Ailleurs, `{mot}` reste du texte.
- **Une étiquette valide ferme la pièce en cours**, comme chez OpenAmika, même sans coupure de phrase : ce qui
  précède part avec l'émotion d'avant, ce qui suit avec la nouvelle.
- **Une émotion est en force** de son étiquette jusqu'à la suivante ou à la fin de la réponse (décision 2). Chaque
  phrase publiée porte celle en force à son premier mot. La première phrase coupée à une virgule garde la même
  émotion sur ses deux moitiés.
- **Compatible avec le flux phrase par phrase.** L'étiquette se retire à la lecture du flux du modèle, avant
  quiconque. Un `{` en position d'étiquette retient le texte qui suit jusqu'à `}`. Ce qui n'est pas une étiquette
  (un autre signe que des lettres ou `_`, ou plus de 24 signes sans fermer) repart tel quel. Une étiquette coupée
  entre deux morceaux du flux se recolle. Ce qui est retenu sur un `{` resté ouvert se rend en fin de flux, et au
  vidage qui précède un outil.
- **Un morceau du flux qui porte la fin d'une phrase et l'étiquette de la suivante** se coupe à l'étiquette, en deux
  morceaux.
- **La comparaison** se fait sans casse ni accents : `{Gênée}` vaut `genee`.
- **La consigne** donne la liste avec une ligne par émotion, rappelle de couper la phrase quand l'émotion change, et
  porte **un exemple juste et deux faux** (une intensité, deux émotions jointes). Elle est comptée dans le coût
  mesuré. Où elle va, pour chaque sorte de tour :

  | Tour | La consigne |
  |---|---|
  | Une réponse à la voix | dans les consignes de cet appel, avec celles de la voix |
  | La seconde réponse d'une délégation parlée | dans les consignes de ce second appel |
  | La seconde réponse d'une délégation écrite | aucune |
  | Le rituel d'arrivée, une parole d'elle-même | dans les consignes de leur appel |
  | Un tour écrit (mobile, clavier) | aucune |

  Si la liste de l'instance ne tient que le neutre, aucune consigne ne s'ajoute : le cerveau parle comme aujourd'hui.

## Le contrat du message vers le corps

- `speech` gagne un champ **optionnel** : `{type: 'speech', id, n, text, why, emotion?}`. `text` ne change pas : la
  phrase dite, sans étiquette.
- **Le neutre ne s'envoie pas** : sans étiquette valide, le champ est absent. Une phrase neutre d'un cerveau nouveau
  est donc identique à celle d'un cerveau ancien. Le corps lit « absent » comme neutre.
- **La valeur est un identifiant de la liste** (`[a-z_]`, 24 signes au plus). Luxuria ne connaît pas la liste : il
  garde ce qui a cette forme, et traite le reste comme absent. Une émotion qu'il ne sait pas jouer sera jouée neutre
  quand la voix et le visage viendront.
- **Un Luxuria ancien** lit la trame sans la valider et ignore le champ (`src/core.ts:134`). Un cerveau ancien
  n'envoie jamais le champ. Aucune version n'a besoin de l'autre.
- **Le téléphone et les autres clients** reçoivent aussi les trames de parole, comme aujourd'hui, et ne les lisent
  pas : l'émotion n'y est ni affichée ni gardée. C'est la lecture retenue du critère 3, plutôt qu'un filtre par
  client.
- `speech-end` et le reste du contrat ne changent pas.

**Dans le cerveau**, l'émotion voyage avec le texte dans l'événement de morceau de la réponse, en champ facultatif,
jamais dans un événement nouveau : la voix et la route de flux d'une réponse ferment sur tout autre événement. La
route de flux n'écrit que le texte du morceau.

## Où l'étiquette est retirée

**Un seul point** : la lecture du flux du modèle, dans le cerveau, sur chaque appel d'un tour parlé. Le texte propre
en sort, avec l'émotion à côté. Tout le reste ne voit que le texte propre :

| Ce qui lit | Ce qu'il reçoit |
|---|---|
| Le fil : bureau, web, mobile, fil de Luxuria (la réponse en flux) | le texte sans étiquette |
| Le texte gardé : l'historique rejoué au modèle, la mémoire, la nuit, les tics | le texte sans étiquette |
| La coupure : ce qui a été entendu, comparé au texte gardé | le texte sans étiquette |
| Le silence choisi d'une parole d'elle-même (« rien ») | jugé sur le texte sans étiquette |
| La date du premier mot | prise sur le premier signe du texte propre |
| Les journaux du cerveau et la trace de Luxuria | ni le texte brut ni l'émotion |
| La voix : le texte de chaque phrase | sans étiquette ; l'émotion à part, dans son champ |
| Les outils de mesure du cerveau (premier mot, scènes) | le même retrait |

**La parole d'elle-même**, dite d'un bloc à la fin : les émotions de chaque phrase sont gardées avec la réponse en
cours, hors du texte gardé, jusqu'au moment où elle est dite, puis oubliées.

**Les textes sans modèle** n'ont pas d'étiquette et n'héritent d'aucune émotion : le texte d'un poste quand il est
toute la réponse, et chaque phrase fixe du code (une urgence comprise) partent au neutre, sans champ.

**Une délégation** : l'émotion ne passe pas du premier appel au second. Le second appel est une nouvelle réponse du
modèle : neutre jusqu'à sa première étiquette.

## Le repli neutre

- Pas d'étiquette en tête de la réponse : neutre jusqu'à la première.
- Une étiquette hors de la liste : retirée du texte, neutre jusqu'à la suivante.
- Une étiquette oubliée au milieu : la phrase garde l'émotion d'avant (décision 2).
- Une étiquette mal formée (pas de `}`, d'autres signes) : ce n'est pas une étiquette, le texte passe tel quel. Elle
  compte comme une fuite dans la mesure (tâche 6).
- Une liste illisible dans les données de l'instance : le défaut, le neutre seul, donc ni consigne ni étiquette ; une
  ligne de journal qui le dit, une fois.

## Le coût du prompt, à mesurer

- **En entrée** : la consigne, la liste et ses trois exemples, environ 200 jetons par appel parlé (estimation, à
  mesurer). Ils se paient à chaque appel parlé, la seconde réponse d'une délégation parlée comprise. Un tour écrit ne
  paie rien.
- **En sortie** : 3 à 4 jetons par phrase pour l'étiquette.
- **Le premier mot** : l'étiquette passe avant le premier mot, et le retrait retient le texte jusqu'à `}`. Le délai se
  mesure jusqu'au premier signe propre, et jusqu'à la sortie de la première phrase vers la voix.
- **Mesuré à la tâche 6**, sur le modèle du rodage, raisonnement coupé : jetons d'entrée et coût d'un tour parlé avant
  et après ; taux d'étiquettes valides ; fuites ; délai du premier mot. Les chiffres s'écrivent ici.

## Les sept émotions

Les textes ci-dessous sont la donnée à ranger dans l'instance (décision 1). Ils se relisent comme ceux du
tempérament ; CrOliX peut les reprendre.

| Identifiant | Ce qu'elle dit au modèle |
|---|---|
| `neutre` | le ton ordinaire |
| `seche` | la façade : sec, cru, une pique |
| `douce` | la douceur dessous : elle prend soin, sans le dire |
| `genee` | il a remarqué sa tendresse : une gêne brève |
| `amusee` | un sourire en coin, une moquerie légère |
| `inquiete` | il va mal : présente, sans grands mots |
| `vexee` | un travail bâclé, ou on doute du sien |

**Qui les range dans l'instance.** Le code n'en garde que le neutre. Les sept s'écrivent dans les données de
l'instance par le chemin des autres données de l'instance, à la mise en route ; sur une base de test, par l'amorce de
recette. Le geste exact est dans l'issue privée ; il se confirme avec CrOliX avant la mise en route du NAS.

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit échouer ; un développeur écrit le code ; le
**reviewer** relit le diff. Elle se ferme sur les barrières du dépôt au vert. Lun'Luxuria : `npm test`,
`npm run lint`, `npm run typecheck`, `npm run format:check`. Lun'Anima : les siennes, dans l'issue privée.

**L'ordre.** **1 et 2 partent en parallèle** (deux dépôts, aucun fichier commun). **3 et 4 partent en parallèle**, 3
après 1, 4 après 2. **5 et 6 partent en parallèle** : 5 après 4 (faux cerveau, sans le core), 6 après 3. 7 en
dernier. Le contrat du message est la seule chose que 3 et 4 partagent : il ne bouge pas sans ce plan.

1. - [x] **Les tests du cerveau, rouges** (testeur, Lun'Anima ; fichiers dans l'issue privée).
   - **Le retrait** : une étiquette en tête, deux étiquettes dans une réponse, une étiquette coupée entre deux
     morceaux du flux, **une étiquette au milieu d'un morceau** (le morceau se coupe à l'étiquette), `{Gênée}` sans
     casse ni accents, une inconnue retirée, `{mot}` au milieu d'une phrase laissé tel quel, un `{` sans fin et
     `{a b}` rendus, un `{` ouvert rendu en fin de flux et au vidage avant un outil, un lien et un repère de carte
     intacts.
   - **Le message**, sur les quatre sortes de tour parlé (réponse, rituel, parole d'elle-même, seconde réponse d'une
     délégation parlée) : chaque phrase publiée porte l'émotion en force à son premier mot ; une étiquette valide
     ferme la pièce en cours ; la première phrase coupée à une virgule et sa suite portent la même ; une oubliée au
     milieu garde celle d'avant ; neutre, le champ est absent. La parole d'elle-même, dite d'un bloc, garde
     l'émotion de chaque phrase.
   - **Sans modèle, sans émotion** : le texte d'un poste qui est toute la réponse, une phrase fixe d'urgence, une
     phrase fixe d'annulation partent sans champ. Le second appel d'une délégation ne reprend pas l'émotion du
     premier.
   - **Nulle part ailleurs** : aucune accolade dans le fil, la route de flux, le texte gardé, l'historique rejoué au
     modèle, le silence choisi, les tics, la coupure.
   - **Le premier mot** : sa date se prend sur le premier signe propre, pas sur l'étiquette.
   - **La consigne** : présente selon le tableau des quatre sortes de tour, avec la liste lue des données de
     l'instance ; absente d'un tour écrit et du second appel d'une délégation écrite, dont le prompt reste identique
     à aujourd'hui ; absente si la liste ne tient que le neutre ou est illisible.
   - **La garde « rien en dur »** : un test qui parcourt les sources et refuse un identifiant de la liste, hors
     `neutre`, dans le code du cerveau.
   - Exclu : tout test de voix ou de visage ; tout changement d'un attendu existant sans le nommer dans la PR.

2. - [x] **Les tests de Luxuria, rouges** (testeur, Lun'Luxuria ; `src/conversation.test.ts`,
   `src/speech/speaker.test.ts`, la session).
   - Un `speech` avec `emotion: 'douce'` : `speaker.add` la reçoit avec la phrase ; `subtitle` la porte au début réel
     de la lecture de **cette** phrase, pas à sa réception ; le `subtitle` muet (voix en échec) aussi.
   - Deux phrases d'émotions différentes en file : chacune garde la sienne jusqu'à sa lecture.
   - **Une phrase reprise après une suspension** garde son émotion.
   - Sans `emotion` : rien ne change (les tests d'aujourd'hui passent sans retouche).
   - `emotion` mal formée (`'DOUCE !'`, `42`, `''`, 40 signes) : traitée comme absente, sans erreur.
   - La session garde l'émotion de la phrase lue, sans l'afficher, et l'oublie au silence.
   - La trace (`phrase_recue`, `son`) n'écrit pas l'émotion ; le sous-titre affiché reste le texte seul.
   - Exclu : `src/local.ts`.

3. - [x] **Le cerveau** (`dev-core`, Lun'Anima ; étapes dans l'issue privée). Après 1.
   - La liste lue des données de l'instance, validée à la lecture, avec le seul neutre en défaut (décision 1) ; la
     consigne selon le tableau ; le retrait au seul point de lecture du flux ; l'émotion dans l'événement de morceau ;
     le champ `emotion` sur `speech`, absent au neutre ; les émotions de la parole d'elle-même gardées jusqu'à ce
     qu'elle soit dite ; la date du premier mot sur le texte propre.
   - Le même retrait dans les outils de mesure du cerveau, pour que la tâche 6 mesure le vrai chemin.
   - Les sept émotions écrites sur la base de test de recette.
   - Exclu : un écran ; l'humeur (décision 3) ; un cache du prompt ; le tempérament.

4. - [x] **La réception dans Luxuria** (`dev-luxuria`, Lun'Luxuria). Après 2, en parallèle de 3.
   - `src/brain.ts` : `emotion?: string` sur `speech`, et une petite fonction qui garde une valeur de forme `[a-z_]`,
     24 signes au plus, sinon `undefined`.
   - `src/conversation.ts` (`onLive`) : passe l'émotion filtrée à `speaker.add(id, text, urgent, emotion)` ; la trace
     reste telle quelle.
   - `src/speech/speaker.ts` : la phrase en attente porte son émotion, reprise comprise ; les deux `subtitle` la
     portent.
   - `src/session.svelte.ts` : l'émotion de la phrase lue, gardée en état, non affichée, oubliée au silence. C'est le
     point où la voix et le visage la liront (§ 5.1, `setMood(...)`).
   - Exclu : jouer l'émotion ; la synthèse (`#synth`) ne la reçoit pas encore ; aucun réglage, aucun texte à l'écran.

5. - [x] **Le critère 5 de bout en bout, dans Chrome** (testeur, Lun'Luxuria). Après 4.
   - Un scénario de la chaîne (`src/presence/scenarios/`) dont le faux cerveau (`src/presence/fakes.ts`) publie des
     phrases étiquetées : deux émotions, une phrase neutre sans champ, une émotion mal formée.
   - Joué par `npm run chaine` dans Chrome sans interface. La sonde vérifie que la session tient l'émotion de la
     phrase lue, et qu'aucun sous-titre ni aucun texte passé à la voix ne porte d'accolade. Comment la sonde lit
     l'état de la session sans rien afficher reste à trouver par le développeur, sans écrire l'émotion dans la trace.

6. - [x] **La preuve en local, avec le vrai modèle** (testeur ou session ; commandes dans l'issue privée). Après 3.
   - Le cerveau en local sur une base de test amorcée avec les sept émotions, le modèle du rodage, raisonnement
     coupé, par le vrai service, avec les vraies consignes. Le budget de la mesure se dit à CrOliX avant de lancer.
   - **Une conversation parlée longue** (au moins 20 tours, fil plein), avec **au moins une délégation et un
     rituel** : taux d'étiquettes valides par phrase, en début et en fin de conversation ; répartition des émotions.
   - **Les fuites**, cherchées dans le texte propre : un identifiant de la liste entre crochets, entre parenthèses,
     entre astérisques, ou en tête de phrase suivi de « : » ; une accolade dans le fil, le texte gardé ou les
     journaux.
   - **Le coût** : jetons d'entrée d'un tour parlé avant et après, consigne et exemples compris ; coût moyen d'un
     tour parlé, d'après le décompte du cerveau ; un tour écrit inchangé.
   - **Le premier mot** : le délai médian avant et après, au premier signe propre et à la première phrase sortie.
   - Les trames `speech` lues sur le flux en direct portent l'émotion.
   - Les chiffres s'écrivent dans ce plan. Si le taux tombe en conversation longue, le dire à CrOliX avant de rien
     changer (« Risques »).

   **Mesures du 23/11.** Modèle du rodage, raisonnement coupé, par le vrai service ; postes simulés (aucun satellite).
   Une conversation « avant » (l'état d'aujourd'hui) et trois « après », 26 tours chacune : 23 répliques dites,
   2 rituels, 1 tour écrit, 2 à 4 délégations ; fil de départ de 45 messages sans étiquette. Chaque mesure est un
   petit échantillon (de 76 à 83 phrases par conversation « après »).
   - **Le taux d'étiquettes valides par phrase tombe.** Sur les trois conversations « après » : 36,8 %, 31,3 % et
     38,3 % de toutes les phrases (85 sur 240, soit 35,4 %). Début de fil (cinq premiers tours dits) : 40,0 %, 57,9 %
     et 70,6 % (29 sur 51, soit 56,9 %). Fin de fil (cinq derniers) : 53,3 %, 26,7 % et 53,8 % (19 sur 43, soit
     44,2 %). Au milieu du fil, plusieurs tours de suite n'ont aucune étiquette. **Rien n'a été changé** : le sujet
     est à décider par CrOliX (« Risques »).
   - **La répartition des 85 étiquettes valides** : neutre 38, douce 24, sèche 16, gênée 4, inquiète 3, amusée 0,
     vexée 0. Les trames de parole portent une émotion dans 10 à 14 tours dits sur 25 selon la conversation.
   - **Les fuites : zéro** dans les trois conversations, dans le fil, le texte gardé, les trames, les journaux et la
     base, et aucune étiquette dans l'historique rejoué au modèle.
   - **Le coût.** Entrée du premier tour dit, à fil identique : 4 454 jetons avant, 4 824 à 4 829 après, soit environ
     375 de plus (8 %) pour la consigne et ses exemples. Sur le premier mot (30 appels, requête parlée type) : 5 041
     jetons avant, 5 425 après. Coût moyen d'un tour dit d'après le décompte du cerveau : 0,84 milli-dollar avant ;
     0,74, 0,86 et 0,82 après (les fils divergent, car les réponses diffèrent : l'écart ne se lit pas comme un
     surcoût). Coût d'une conversation : 0,0209 $ avant, de 0,0186 à 0,0214 $ après.
   - **Le tour écrit est inchangé** : le préfixe du prompt est identique, au signe près, dans les quatre
     conversations (mêmes empreintes) ; ses jetons d'entrée varient avec le fil (6 179 à 7 135), pas avec la consigne.
   - **Le premier mot** (alternance avant et après, 29 appels gardés par bras) : premier signe propre, médiane 503 ms
     avant et 688 ms après (+185 ms) ; première phrase, 632 ms avant et 710 ms après (+79 ms). Outil de premier mot
     de la branche seul, 19 appels : 652 ms au premier signe, 705 ms à la première phrase. Dans les conversations :
     602 ms avant, 678 à 714 ms après. La cible de 2,5 s tient largement.
   - **Le coût de la mesure** : environ 0,14 $ en tout, sous le plafond de 0,25 $ ; les conversations ont coûté de
     1,5 à 1,7 fois l'estimation haute (0,0125 $ et 0,0138 $), car le décompte réel en jetons est près de deux fois
     celui d'un compte à quatre signes par jeton.

7. - [x] **La livraison** (livreur). Une PR en brouillon par dépôt : Lun'Anima (ferme Lun-Ecosystem/lun-anima#130),
   Lun'Luxuria (ferme Lun-Ecosystem/lun-luxuria#107), et celle de ce plan, cochée au fil des tâches.

## Risques

- **Le modèle cesse d'étiqueter en conversation longue.** Son historique rejoué ne montre aucune étiquette : il peut
  imiter ses réponses passées. OpenAmika fait de même. La tâche 6 le mesure en début et en fin de fil. Le remède
  possible (rejouer les étiquettes dans l'historique d'un tour parlé) ferait voyager l'étiquette dans le texte gardé :
  à décider par CrOliX sur les chiffres, pas d'avance.
- **Le premier mot recule** de quelques jetons. La cible de 2,5 s tient-elle ? La tâche 6 le dit.
- **Le coût** : environ 200 jetons d'entrée par appel parlé. Petit sur Haiku, mais chaque appel parlé le paie.
- **Une émotion choisie au hasard** se verra quand le visage la jouera. Rien ne la vérifie aujourd'hui ; les scènes
  de contrôle pourront la regarder plus tard.
- **Une fuite déguisée** (`[douce]`, `*douce*`, `Douce :`) passe dans le texte et à la voix. La tâche 6 la compte ;
  la consigne et ses deux exemples faux se corrigent si elle apparaît.

## Hors périmètre

Jouer l'émotion à la voix (la synthèse, RVC) ou au visage (les images, Live2D, `setMood`) : plus tard. Un écran pour
la liste. L'humeur calculée en code et son lien avec le visage. La pause par émotion d'OpenAmika. Les émotions en
mode Luxuria seul (`src/local.ts`). Un cache du prompt. Une liste qui évolue avec le tempérament. Un filtre des trames
de parole par client.

## Limites

- Non vérifié : le nombre de jetons de la consigne et de ses exemples (estimé, pas compté) ; que le modèle du rodage
  suive le format sur un fil long ; qu'aucun journal du cerveau n'écrive le texte d'une réponse (relu en partie, gardé
  par un test de la tâche 1) ; comment la sonde de la chaîne lira l'état de la session (tâche 5).
- Le geste qui range les sept émotions dans l'instance du NAS est à confirmer avec CrOliX.
- OpenAmika relu dans les passages cités seulement, pas lancé (sa voix demande une RTX).

## Écarts à l'exécution

- Trois données de tests existants ont été ajustées, sans changer leur intention.
- Un delta vide d'un tour écrit n'est plus émis.
- La garde « rien en dur » a des limites connues.
- Luxuria : une sonde de test lit l'émotion tenue par la session, sans rien afficher ni tracer ; la session oublie l'émotion
  au silence, avant que le sous-titre s'efface ; la chaîne passe par le serveur de chaîne du cerveau.
- Mesure du 23/11 : le taux d'étiquettes valides est de 35 %. CrOliX a décidé de livrer tel quel, avec un remède à part.
