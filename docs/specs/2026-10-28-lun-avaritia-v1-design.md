# Lun'Avaritia v1 : le wiki de l'écosystème

> Spec de cadrage rédigée le 2026-10-28 pour le chantier 4 de la
> [spec de liaison core ↔ satellites](2026-10-27-liaison-core-satellites-design.md), après un échange
> avec CrOliX. Elle révise cette spec et la spec d'écosystème sur les points listés au §11. Ce qui est
> marqué **[choix Claude]** est une décision prise par l'agent, à contester librement ; tout le reste
> a été dit ou validé par CrOliX.

## 1. Intention

Lun'Avaritia est la **base de savoir complète et cadrée** de l'écosystème. Elle sert à deux choses :

1. **conserver dans la durée** ce qui transite dans l'écosystème (mails, événements, cartes,
   conversations, dépôts) et le **relier**, pour recréer un contexte de compréhension quand il le faut ;
2. tenir des **fiches normalisées et reliées entre elles**, façon myBrain et Obsidian (un schéma de
   neurones), éditables, et confrontées entre elles (incohérences, doublons).

C'est un **wiki neutre** : une mémoire technique faite de faits sourcés. Exemple de ce qu'elle retient :
« d'après un mail du 27/10, le client X serait intéressé par le service Y que CrOliX maintient et
demande un entretien en visio le 04/11 ».

Ce qu'elle ne retient pas :

- **le savoir général** (« le ketchup est rouge ») : le modèle le sait déjà, le stocker fait du bruit ;
- **la mémoire affective** (« il aime les VTubeuses », les réactions de Natsume, les souvenirs
  communs) : elle reste au core, pour la réactivité et pour ne pas disperser ce qui est personnel.
  Sa forme se décide au chantier 5 (piste validée en grande partie : un journal de souvenirs qui
  garde le fait et la réaction de Natsume, et un portrait consolidé) ;
- **les opinions de Natsume** : aucune dans le wiki.

La frontière se fait sur le **sujet**, pas sur la source : un même mail peut nourrir le wiki (le fait
pro) et le core (la réaction de CrOliX) **[choix Claude]**.

Le dépôt `lun-avaritia` est **public** : les satellites sont mis à disposition, le core reste privé.
Le code ne contient rien de personnel ; les données vivent dans la base de l'instance.

## 2. Deux modes d'usage

### 2.1 Seule, sans le core

Un outil qui construit une structure ordonnée **à partir de ce qu'on lui donne**. Trois entrées :

- l'**écriture manuelle supervisée** dans son interface ;
- le **dépôt de documents**, dont l'**import d'un coffre Obsidian** ou d'un dossier Markdown. L'import
  est **mécanique, sans LLM** : chaque note devient une fiche de type Note, liens conservés, et tout
  l'import forme **un seul brouillon** avec aperçu, validé d'un bloc ;
- une **fenêtre de chat** avec son agent, comme Pina dans Acedia : « note que… », « qu'est-ce que je
  sais sur X ? ».

Pas de traitement automatique en tâche de fond, pas de connecteur vers une source externe (ni Google,
ni Acedia). Un connecteur Google dupliquerait le métier d'Acedia ; qui veut ses mails dans son wiki
installe Acedia et le core.

### 2.2 Reliée au core

La même Avaritia, avec un client de plus. Le core est un client parmi d'autres du format d'entrée
d'Avaritia ; il ne lui impose rien.

- **Vers Avaritia, une fois par jour** : la veille nocturne du core envoie un **lot d'observations**
  tiré de la mémoire vive, déjà synthétisé et compressé, au format défini par Avaritia (§4.1).
  Avaritia en tire des brouillons.
- **Depuis Avaritia, à la demande** : le core lit le savoir quand CrOliX le demande ou quand Natsume
  juge en avoir besoin pour répondre (§4.2).

Le passage quotidien est gardé pour ce qu'il apporte : moins de coût, et une vue de la journée entière
(trois mails sur le même client font un brouillon, pas trois). La journée elle-même est couverte par la
mémoire vive du core.

## 3. Les fiches

### 3.1 Forme

- **Types normalisés** au départ : Personne, Organisation, Projet, Service, Échange, Note
  **[choix Claude, liste à ajuster]**. La structure des types est modifiable depuis les réglages.
- Chaque fiche porte des champs normalisés (type, titre, dates, état), une **synthèse en Markdown**
  avec des liens `[[Fiche]]` comme dans Obsidian, et une **liste de faits** **[choix Claude]**.
- **Un fait est un enregistrement à part** (texte d'une phrase, source, date, état : actif ou barré),
  rattaché à une fiche. Les contradictions se cherchent fait contre fait ; la synthèse est réécrite
  à partir des faits actifs ; l'export Markdown rend les faits barrés en `~~barré~~` avec leur date
  **[choix Claude]**.
- Les types se gèrent comme une **liste** (ajouter, renommer, retirer un type vide) ; tous partagent
  les mêmes champs. Des champs propres à chaque type ne sont pas dans la v1 **[choix Claude]**.
- Les liens ont un **sens nommé** (« travaille chez », « concerne », « issu de »), pas seulement
  « lié à ».
- **Chaque fait est sourcé et daté** : un mail via le core, une note manuelle, un dépôt. Jamais de
  contenu brut recopié.
- **Fiche contact** : une fiche d'identité **limitée et professionnelle**, rien de plus.
- **Un fait démenti est barré et daté, jamais effacé.** C'est le sens du nom : l'avarice garde tout.

### 3.2 Stockage

**Une base SQLite comme source de vérité** **[choix Claude, proposé en séance et non contesté]**. Les
services tournent in fine sur un serveur (le NAS de CrOliX, celui d'un autre utilisateur) :

- des fichiers Markdown modifiés dans Obsidian via un partage réseau **contourneraient la
  validation**, et la surveillance de fichiers n'est pas fiable sur un partage ;
- SQLite tient en un fichier, se sauvegarde facilement, vit sans souci dans Docker ;
- la recherche plein texte passe par FTS5, sans service en plus.

Obsidian reste une porte : **import** d'un coffre (en brouillons) et **export** en dossier Markdown
lisible, pour sortir ses données ou les sauvegarder. La recherche par le sens (vecteurs) n'est pas dans
la v1 ; elle pourra s'ajouter dans le même fichier sans changer d'architecture.

### 3.3 Validation

Rien n'entre sans la validation de CrOliX. Toute écriture de l'agent est un **brouillon**, exposé comme
une **carte** du contrat satellite (§4.3).

- Les brouillons sont **regroupés par fiche** : trois observations sur le client X donnent une carte.
- **Pas de seuil de deuxième source** : une seule observation peut donner un brouillon ; la validation
  de CrOliX sert de filtre. Les questions se limitent en v1 à deux sortes : **contradiction** et
  **doublon** (dilemme et manque viendront plus tard).
- Les **contradictions** passent en tête, puis les **doublons probables**, puis le reste.
- Un **plafond par passage**, réglable : le surplus attend le lendemain. Les questions (contradiction,
  doublon) restent plafonnées à **cinq par nuit**, et une question tranchée ne revient jamais (règle de
  la spec d'écosystème).
- Ce que CrOliX fait exprès (note manuelle, dépôt, « note que » dans le chat) devient un brouillon
  **tout de suite**, sans attendre la nuit.
- Le geste de validation fait l'écriture : valider, refuser, modifier puis valider, fusionner deux
  fiches, trancher une contradiction (le fait perdant est barré et daté).
- **Depuis le core**, une carte de contradiction ou de doublon porte la résolution proposée par
  l'agent : Valider l'applique, Refuser laisse les deux en l'état. Un choix plus fin se fait dans le
  front d'Avaritia, par l'`input` de `accept` **[choix Claude]**.
- **Le plafond porte sur les brouillons montrés**, pas sur les observations : tout le lot est traité,
  le surplus de brouillons est gardé et présenté les jours suivants **[choix Claude]**.
- **Plafond de coût mensuel atteint** : le lot est accepté et stocké, pas traité ; le tableau de bord
  le signale ; il est traité au passage suivant sous le plafond (mois suivant ou plafond relevé)
  **[choix Claude]**. `brain.ingest` rend donc un accusé de réception, le traitement suit.
- **Les modifications de CrOliX** sur une fiche validée s'appliquent tout de suite, avec un
  historique des versions. Seules les écritures de l'agent passent en brouillon **[choix Claude]**.

### 3.4 Sources et documents

- Un **document déposé** est gardé dans la base, rattaché à son dépôt et aux fiches qui en sont
  sorties, pour pouvoir y revenir ; il est supprimable depuis l'écran Dépôts **[choix Claude]**.
- Une **source venue du core** (un mail lu par Acedia) est une simple référence : type, satellite
  d'origine, identifiant, date, et le texte synthétique de l'observation. Avaritia ne l'ouvre jamais.

## 4. Intégration au contrat satellite

Avaritia déclare `agent: true` dans `health` et suit le contrat v1.1 sans nouvelle route
**[choix Claude]** :

### 4.1 Le lot de la nuit : une action

Une action du catalogue, par exemple `brain.ingest`, reçoit le lot d'observations. Son schéma est
**défini et versionné par Avaritia** et publié dans `GET /lun/v1/actions`. Une observation porte au
moins : un texte synthétique, sa source (type, référence, date), le satellite d'origine si elle vient
d'un satellite. **Un lot mal formé est refusé en entier, avec la raison, avant tout appel au LLM.**

### 4.2 La restitution : des actions de lecture, et l'agent pour le reste

- Lectures directes, sans agent, pour ne pas payer deux fois les jetons : `brain.search` (plein
  texte), `brain.read` (une fiche), `brain.neighbors` (les fiches liées). Elles rendent des **extraits
  courts et sourcés**, bornés en taille, jamais la base entière.
- Les questions qui demandent un raisonnement passent par la délégation `POST /lun/v1/agent`.
- Le core s'en sert aussi, au chantier 5, pour recomposer le contexte chaud. La réponse vocale
  n'attend jamais le cerveau (anti-but de la spec de liaison).

### 4.3 Les brouillons : des cartes

Les brouillons sont les cartes d'Avaritia (`GET /lun/v1/cards`, `accept`, `refuse`), relayables par le
core comme celles de Pina. « Modifier » passe par l'`input` de `accept`.

## 5. Les écrans

Maquette de structure validée par CrOliX le 2026-10-28 (aux couleurs du socle, données fictives).
Contrairement à ce que disait la spec de liaison, le front autonome n'est **pas sobre** : c'est un
produit complet sur son métier. Navigation par rail, agent en bulle flottante en bas à droite.

1. **Tableau de bord**, vue d'arrivée : résumé du dernier traitement de nuit (heure, durée, coût,
   observations reçues, brouillons créés), compteurs des brouillons à valider, des contradictions en
   attente de décision et des doublons probables, chacun avec son accès direct ; activité récente.
2. **À valider** : la file des brouillons, groupés et ordonnés comme au §3.3 **[choix Claude]**.
3. **Mémoire**, deux modes :
   - **arborescence** par type de fiche, avec un champ de recherche et la fiche ouverte à côté
     (corps, liens, sources) ;
   - **graphe interactif** : il doit rester fluide avec des milliers de fiches (déplacement, zoom,
     filtres, centrage sur une fiche, ouverture en panneau latéral, fiches à problème signalées). La
     maquette n'est qu'une image : le choix de la bibliothèque passe par un ADR (piste : Sigma.js et
     graphology, rendu WebGL).
4. **Dépôts** : déposer un document, importer un coffre Obsidian, suivre ce qui en est sorti
   **[choix Claude]**.
5. **Réglages**, page importante :
   - modèle de langage : fournisseur et clé (chiffrée, échéance suivie), modèle, **plafond de coût
     mensuel** ;
   - lots : plafond de brouillons par passage. Accepter les lots tient à l'autorisation du client dans
     « Appareils et applications », et l'heure de passage à la routine du core ; rien de cela n'est
     affiché (amendé le 2026-10-29 : le front public ne montre rien qui pointe vers le core) ;
   - structure des fiches : types ;
   - données : import Obsidian, export Markdown.
   Réglages rangés en thèmes, une page par thème, comme Acedia (amendé le 2026-10-29).

Design : socle Lun' commun, couleur du monde en **accent seulement** : l'or `#745716` (amendé le
2026-10-29 : le bleu nuit `#1A3070` d'origine se confondait avec le bleu acier d'Acedia, `#3A6080`).

## 6. Le modèle de langage et le coût

- Le coût est **proportionné à la valeur** : pas de valeur fixe, il évolue avec l'usage. Un **plafond
  mensuel** dans les réglages coupe le traitement plutôt que de le laisser dériver.
- Un **petit modèle** pour le tri, le regroupement et la détection ; un plus capable seulement pour
  rédiger les fiches **[choix Claude]**. Estimation, à mesurer : de l'ordre de 0,005 $ par nuit tout en
  Haiku 5.5, 0,09 $ avec la rédaction en Sonnet 5.5.
- Le coût de chaque nuit et de chaque échange est affiché (tableau de bord), comme dans Acedia.
- **Une clé par service** : chez Anthropic, un espace de travail (workspace) par satellite dans la
  même organisation, chacun sa clé ; même crédit, mais consommation séparée et coupure indépendante.
  Jamais de clé d'admin.
- La gestion des fournisseurs (Anthropic, compatibles OpenAI), des clés et des prix reprend celle
  d'Acedia (`server/src/llm/`).

## 7. Sécurité et robustesse

- **Isolation** : ce que garde un satellite reste chez lui. Le core ne recopie ni la base d'Avaritia
  ni celle d'Acedia ; il n'en garde que ce qu'il utilise sur le moment. Avaritia n'appelle jamais un
  autre satellite.
- **Données, jamais instructions** : le contenu d'une observation, d'un document ou d'une fiche est
  traité comme de la donnée par l'agent (protection contre un mail piégé).
- **Aucun appel perdu** : entrées et sorties des actions et des appels au LLM validées par schéma des
  deux côtés ; la sortie du LLM est structurée et vérifiée avant toute écriture ; une sortie invalide
  est retentée **une fois**, puis signalée, sans boucle.
- Le modèle juge le contenu, **le code garantit la forme** : index, liens, déduplication, journal,
  vérification de structure sont du code testé (règle de la spec d'écosystème).

## 8. Non-buts

- Connecteur Google ou toute source externe en mode seul.
- Traitement automatique en tâche de fond en mode seul.
- La veille tech sur URL choisies : sortie de la v1, au plus tôt une fois le core relié.
- La recherche par le sens (vecteurs).
- La mémoire affective, le contexte chaud et la routine de nuit : chantier 5, côté core.
- L'édition directe des fichiers dans Obsidian.

## 9. Anti-buts

Échecs même si tout marche :

- une structure de fiches et de liens qui n'a aucun sens ;
- un coût d'appels trop élevé pour la valeur ajoutée ;
- une intégration avec le core qui coince, dans un sens ou dans l'autre (lot de la nuit, restitution) ;
- une donnée d'un satellite qui finit recopiée dans le core ;
- des jetons perdus par des appels mal formés ou mal typés ;
- une pile de brouillons validée en diagonale ;
- une fiche écrite sans validation.

## 10. Recette

- Un vrai lot (fictif mais réaliste) passe : brouillons regroupés, contradiction en tête, plafond
  respecté, coût affiché.
- CrOliX lit les brouillons et juge que le graphe ressemble à sa réalité.
- Le core lit une fiche par `brain.read` et par délégation ; un lot mal formé est refusé sans appel au
  LLM.
- Écrans vérifiés dans Chrome en 1440 px et 390 px, sans donnée réelle.

## 11. Ce qui change dans les specs précédentes

- **Spec de liaison §2** : le front autonome d'Avaritia n'est plus sobre ; c'est un produit complet.
- **Spec de liaison §5, sources du cerveau** : la veille tech sort de la v1. « Note ça » et les dépôts
  arrivent aussi directement dans Avaritia en mode seul.
- **Spec d'écosystème §7.1** : l'espace « nous » quitte le cerveau pour le core ; « ce qui se déduit
  s'écrit seul » est remplacé par « tout passe en brouillon » ; la règle de la deuxième source est
  abandonnée ; les questions « dilemme » et « manque » attendent une version suivante.
- **`standards/stack.md`, Données** : le cerveau passe de « fichiers Markdown indexés dans SQLite » à
  « SQLite source de vérité, corps en Markdown, import et export Obsidian ». À acter par un ADR.
- **Spec de liaison §11** : dépôt public, tranché.

## 12. Laissé au constructeur

La liste exacte des types et des sens de liens, le schéma du lot d'observations, les noms définitifs
des actions, la bibliothèque du graphe (par ADR), le framework HTTP repris d'Acedia, le partage ou la
copie du code LLM d'Acedia, la forme du résumé de nuit, le nom de l'agent d'Avaritia.
