# Après l'utile, la présence : l'état cible de l'écosystème. Cadrage

> Cadrage du 10/11, à discuter avec CrOliX **avant toute spec et tout plan**. Il reprend ce qu'il a redit ce jour-là
> (§ 1), pose une page par projet avec une ligne d'arrivée, et ordonne deux axes : la présence, et la révision de
> l'existant. Les lignes d'arrivée et les ordres marqués **[avis Claude]** sont des propositions : c'est à CrOliX de les
> écrire. Rien ici n'ajoute de satellite.

## 1. Ce que CrOliX a redit, le 10/11

- **L'objectif.** Incarner Natsume, un personnage fictif né de nombreuses heures de jeu vidéo, dans le monde réel : une
  présence rendue possible par l'IA, dont la tâche est de l'assister au quotidien.
- **Pour qui.** Un étudiant en bac+4 d'informatique, qui aime les jeux vidéo, les mangas, le streaming, le VTubing et ce
  qui en découle.
- **Où on en est.** « On a pensé l'outil avant la présence, et c'est normal de viser l'utilité en premier. » Le cœur de ce
  qu'il voulait traiter a atteint son MVP : gérer les mails et l'agenda, une mémoire personnelle dynamique, un pilotage
  centralisé par un agent manager vers des sous-agents.
- **La suite, en deux axes.** 1) La présence, « qui aujourd'hui fait défaut ». 2) La révision, l'amélioration et la
  correction de l'existant.
- **La démarche.** Revoir l'état cible de l'écosystème actuel ; un nouveau satellite ne s'envisage que si des besoins
  spécifiques et regroupables se dégagent. Garder la cohérence, éviter la dérive, **aboutir** : le risque nommé est le
  projet « vibe codé » qui ne finit jamais.

## 2. L'anatomie

Corrigée par CrOliX le 10/11 : le cerveau sert à réfléchir et à projeter l'action, pas à se souvenir.

| | Ce que c'est | Projet |
|---|---|---|
| **Le cœur et le cerveau** | Qui elle est, ses souvenirs propres, ses émotions ; la réflexion, la décision ; le centre de pilotage, l'agent manager | Lun'Anima, le core |
| **La bibliothèque** | Ce qui se sait et se garde : des fiches liées, des faits sourcés | Lun'Avaritia |
| **Le corps** | Lui parler et la voir ; ses sens (voir, entendre) et ses mains (faire) ; être vue et entendue par d'autres (le stream) | Lun'Luxuria |
| **La journée** | Les mails, l'agenda, les tâches, triés à la source | Lun'Acedia |

**Une dette de vocabulaire** (voir le [dictionnaire](../../standards/dictionnaire.md), lun-docs#131, et lun-docs#130). Les textes appellent encore Avaritia « le cerveau » : `vision.md` (« second cerveau »),
`standards/stack.md` et `notifications.md`, l'ADR 0005, les README et `CLAUDE.md` d'Avaritia et du core, et le code
(`brain` dans une trentaine de fichiers, `brain.due` dans le contrat). Les textes se corrigent dans l'axe de révision ; le
code et le contrat, seulement si le renommage vaut une rupture **[avis Claude : les textes oui, le code non]**.

## 3. Ce que le socle a livré, et ce qu'il n'a pas encore prouvé

Livré, sur `main` : le tri des mails, l'agenda et les tâches avec leur agent ; la bibliothèque en fiches avec son agent et son
lot du jour ; le core, sa conversation, sa nuit, sa lettre du matin, ses cartes, ses coûts et sa pause, son
app au bureau et au téléphone ; Luxuria, une voix, une scène, des images, la sourdine.

**Pas encore prouvé** : la session sur le desktop (douze points, feuille de route § 2.B) et la semaine de rodage n'ont pas
eu lieu. Le socle est écrit, pas éprouvé par l'usage. **[avis Claude]** Ne plus en faire une porte à franchir avant la
suite, mais le premier chantier de l'axe de révision : c'est l'usage quotidien qui dira quoi corriger, comme CrOliX le
dit lui-même.

## 4. Une page par projet

Chaque ligne d'arrivée dit quand le projet est **abouti** : après elle, il ne reçoit plus que des corrections.

### 4.1 Lun'Luxuria, le corps

- **Existe** : la scène et le petit mode, la voix (écoute, filtre, synthèse, RVC), le corps en images fixes, la sourdine,
  l'icône, le démarrage avec Windows, le mode seul et le mode relié.
- **Mis de côté** (spec Luxuria, § 11) : l'avatar animé ; les modes de présence ; les pensées et relances ; le mot d'éveil
  et les enceintes ; la mascotte ; la perception (fenêtre active, puis l'écran) ; le compagnon qui agit sur le poste par
  cartes ; le compagnon de jeu ; le stream ; la voix apprise.
- **Ligne d'arrivée, validée par CrOliX le 10/11** :
  1. elle a un visage qui vit, et il suit sa voix phrase par phrase : lèvres, regard, expression ;
  2. elle se laisse couper, et sait où elle en était ;
  3. elle perçoit ce que fait CrOliX sur son poste et s'y accorde sans qu'il règle rien ;
  4. elle voit l'écran ;
  5. elle parle d'elle-même, à propos, sans lasser : après un silence, une fois, et elle se tait si on ne lui répond pas ;
  6. elle peut faire sur le poste : avec une permission pour l'immédiat, une carte pour ce qui attend ;
  7. elle accompagne en jeu ;
  8. elle peut être vue et entendue par d'autres.

  Les points 1, 2 et le garde-fou du point 5 viennent de l'[étude d'OpenAmika](2026-11-10-etude-openamika.md).
- **Ne fera jamais** : décider de ce qui est dit quand elle est reliée ; garder une mémoire à elle.

### 4.2 Lun'Anima, le cœur et le cerveau

- **Existe** : l'identité, l'humeur, le tempérament, les souvenirs de la relation, la conversation, la délégation aux
  postes, la nuit, la lettre du matin, les cartes, les coûts, la pause, l'app.
- **Mis de côté** : les rôles (assistante, experte, streameuse) ; l'humeur calculée par les événements ; la porte des
  pensées, le budget de parole ; le point du soir ; la validation par lot ; le premier appareil sans terminal ; le NAS.
- **Ligne d'arrivée, validée par CrOliX le 10/11** :
  1. sa personnalité passe la barre : les scènes de référence, notées par CrOliX ;
  2. son humeur change avec ce qui arrive, et se voit dans sa voix et son corps ;
  3. elle prend l'initiative à bon escient : le core décide quand parler et quoi dire, dans un budget de parole ;
     Lun'Luxuria le dit ;
  4. une journée d'usage tient dans son plafond de coût, sans que CrOliX y pense ;
  5. elle a un visage public, séparé du privé, pour être vue et entendue par d'autres ;
  6. une semaine d'usage sans point de tension ;
  7. tout se règle sans terminal.
- **Ne fera jamais** : refaire le métier d'un poste ; recopier ses données.

### 4.3 Lun'Avaritia, la bibliothèque

- **Existe** : les fiches, les faits sourcés et datés, les contradictions soumises, le lot du jour, l'import et l'export
  Obsidian, la recherche plein texte.
- **Mis de côté** : la recherche sémantique (« pas en v1 », `stack.md`), alors que la vision la veut vectorielle ; la
  migration vers le kit commun.
- **Ligne d'arrivée, validée par CrOliX le 10/11** :
  1. Natsume y retrouve ce qu'il faut sans que la question reprenne les mots de la fiche : la recherche par le sens ;
  2. ce qu'elle apprend en conversation y entre sans geste de CrOliX au-delà de la validation ; un fait n'entre que s'il
     cite mot pour mot la parole de celui à qui il est attribué, et seulement après une parole réellement entendue ;
  3. la base tient des milliers de fiches sans ralentir ;
  4. ses écrans sont faits du kit commun (lun-docs#43).
- **Ne fera jamais** : garder les souvenirs de la relation (ils sont au core).

### 4.4 Lun'Acedia, la journée

- **Existe** : le tri, les boîtes, les réponses préparées, l'agenda, les tâches, l'agent, les règles.
- **Mis de côté** : Google branché depuis l'interface ; le confort (couleurs, listes, archivage du journal) ; Gmail en
  push ; le nom de l'agent encore écrit en dur ; le poids du build.
- **Ligne d'arrivée [avis Claude]** : 1) une semaine sans ouvrir Gmail ni Agenda pour le courant ; 2) installée et
  reliée à Google sans terminal ni fichier ; 3) son agent n'a plus aucun nom en dur.
- **Ne fera jamais** : la conversation ; les fiches.

## 5. L'axe 1 : la présence

Ce qui fait défaut, du plus près de l'existant au plus loin. Chaque marche se cadre par sa propre spec.

| | Marche | Où | Ce qu'elle demande |
|---|---|---|---|
| 1 | **Un visage qui vit** : l'avatar animé | Luxuria (lun-docs#62) | un modèle et une illustration ; l'interface du corps existe déjà |
| 2 | **Une humeur qui se voit** : calculée par les événements, lue par la voix et le visage | core, puis Luxuria | rien de matériel |
| 3 | **Elle s'accorde à ce que fait CrOliX** : fenêtre active, inactivité, jeu ; les modes de présence | Luxuria | rien de matériel ; reprend les signaux de la sourdine et de l'absence |
| 4 | **Elle parle d'elle-même, à propos** : les pensées, le seuil, le budget de parole | core, Luxuria | un coût à borner |
| 5 | **Elle voit l'écran** | Luxuria | un modèle de vision : coût, ou modèle local |
| 6 | **Compagne de jeu** | Luxuria | la marche 5 ; des intégrations par jeu |
| 7 | **Elle fait sur le poste**, par cartes | Luxuria | le harnais des cartes |
| 8 | **Le stream** : être vue et entendue par d'autres | Luxuria, core | toutes les marches d'avant ; une persona publique et son mur vers le privé |

**[avis Claude]** Les marches 1 à 4 ne demandent ni achat ni changement d'architecture, et ce sont elles qui changent ce
que CrOliX ressent au quotidien. Les marches 5 et 6 dépendent du coût d'un modèle de vision, donc du serveur ou de la carte
graphique à venir. La 8 est l'horizon : elle justifie de bien faire les sept autres, pas de commencer par elle.

## 6. L'axe 2 : la révision de l'existant

| | Quoi | D'où ça vient |
|---|---|---|
| 1 | **Éprouver le socle** : la session sur le desktop, puis l'usage quotidien, et corriger ce qu'il montre | feuille de route, § 2.B et § 4 |
| 2 | **Les observations en attente** : dix-huit issues `inbox`, à trier en une fois (faire, plus tard, jamais) | les cinq dépôts |
| 3 | **Les mots** : l'anatomie du § 2 dans `vision.md`, les standards et les README | § 2 |
| 4 | **La vision** : l'incarnation d'abord, l'assistance comme tâche ; le stream n'est plus « hors périmètre » mais à l'horizon | § 1 |
| 5 | **L'architecture** : un serveur dédié, le NAS au stockage, la porte d'entrée ; l'ADR 0008 à revoir (lun-docs#109) | CrOliX, le 10/11 |
| 6 | **Le premier contact sans terminal** : le premier appareil, Google depuis l'interface, la liaison d'un poste | lun-anima#72, #90, lun-acedia#55, #30 |
| 7 | **La bibliothèque cherchée par le sens** | § 4.3 |
| 8 | **Les mots et les composants partagés** : le [dictionnaire](../../standards/dictionnaire.md), puis la galerie du kit en trois paliers (le kit tel qu'il est ; les cartes et la permission ; la convergence des kits) | CrOliX, le 10/11 ; [plan](../plans/2026-11-10-galerie-kit.md) |

**[avis Claude]** 1 à 4 d'abord : ils coûtent peu et remettent les textes d'accord avec ce que CrOliX veut. 5 se cadre
quand l'achat se précise. 6 et 7 sont de vrais chantiers, à ordonner contre les marches de la présence.

## 7. Ce que cette démarche interdit

- Un nouveau satellite tant que les quatre lignes d'arrivée ne sont pas écrites par CrOliX. Un besoin qui ne tient dans
  aucune d'elles, et qui se regroupe avec d'autres, devient alors un candidat.
- Une marche de la présence commencée avant que la précédente soit éprouvée par l'usage.
- Une fonction ajoutée à un projet au-delà de sa ligne d'arrivée sans la réécrire d'abord.

## 8. Ce qui reste à trancher, dans l'ordre

1. Les quatre lignes d'arrivée (§ 4) : les corriger, une par une, en commençant par Luxuria.
2. La première marche de la présence (§ 5).
3. La place de la session du desktop et de la semaine d'usage : une porte, ou le premier chantier de la révision (§ 3).
4. La réécriture de `vision.md` (§ 6, points 3 et 4).

Ensuite : la feuille de route du MVP se clôt, et une nouvelle prend sa suite avec ces deux axes.
