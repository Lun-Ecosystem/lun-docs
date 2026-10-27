# Liaison core ↔ satellites : le manager et ses postes

> Spec de cadrage rédigée le 2026-10-27, à la fin du palier « Agent Acedia », partie 1, après un
> échange avec CrOliX. Elle révise la spec d'écosystème du 2026-10-19 sur les points listés au §8 et
> fixe la carte des besoins du MVP. Ce qui est marqué **[choix Claude]** est une décision prise par
> l'agent pendant la rédaction, à contester librement ; tout le reste a été dit ou validé par CrOliX.

## 1. Intention

Le core n'est pas une capsule qui cache les satellites derrière une interface unifiée. C'est un
**manager** : il comprend la demande, la confie au bon **poste**, reçoit la réponse et la restitue à
sa façon. Chaque satellite est un poste tenu par son propre agent, borné à sa mission, qui reste
responsable de son métier (règles, garde-fous, actions). Le core ne prend jamais cette
responsabilité à sa place.

Le but est de supprimer au maximum les gestes manuels de CrOliX et de ne lui laisser que la
validation des actions critiques, sans qu'un mauvais découpage n'encombre le core ou ne crée de
dépendance entre deux satellites.

Critère du MVP inchangé : une semaine d'usage quotidien, fluide, sans blocage. Tout ce qui est décrit
ici en fait partie, quitte à avancer par paliers.

## 2. Les rôles

**Le core (Lun'Anima)** est le manager et le centre de commande :

- la présence : chat, sessions de travail façon Claude ou ChatGPT, personnalité, humeur, voix, avatar ;
- la **mémoire de la relation** (ce que Natsume pense, les souvenirs communs, les habitudes) et la
  **mémoire vive de la journée** (§5) ;
- le routage et la délégation aux postes, les **routines** programmées, la validation des cartes
  relayées, les propositions d'action ;
- le contrôle agrégé (coûts, pause, interrupteur général, modes) et le **portail** vers les outils.

**Un satellite** possède des données et agit à la source. Il a son agent, ses garde-fous, son
interface autonome, et il passe le test « utile à quelqu'un sans Lun' ».

- **Lun'Acedia** : bornée aux outils Google. Mail, agenda et tâches au MVP ; Drive plus tard si c'est
  cohérent. Son agent est Pina.
- **Lun'Avaritia, le cerveau** (nouveau satellite) : la base de connaissance. Il reçoit
  des sources, rédige les fiches, les met en forme et les relie, dans l'esprit de myBrain et
  d'Obsidian. Son agent rédige ; rien n'entre sans la validation de CrOliX. Au MVP, son front
  autonome reste sobre (consulter, éditer, valider) [choix Claude] : la validation quotidienne passe
  par les cartes relayées dans l'app du core, et le soin du produit va à celle-ci.

## 3. Règles de découpage

Elles servent à placer tout besoin, maintenant et plus tard.

1. **Un besoin appartient au satellite qui possède la source et les actions.**
2. **Le core ne garde que le transverse** : la présence, la relation, le routage, les routines, la
   validation, le portail, le contrôle.
3. **Deux satellites ne se parlent jamais.** Tout croisement passe par le core, qui sert de coursier.
4. **Un besoin sans maison ne grossit pas le core par défaut** : il devient un futur satellite, une
   source d'un satellite existant, ou il sort du MVP.
5. **Une source qui ne fait que lire**, sans agir ni avoir d'écran propre, n'est pas un satellite :
   elle est une entrée du satellite qui en tire la valeur (la veille tech va au cerveau).
6. **Un écran n'est pas un doublon parce qu'il ressemble à un autre.** Le core et un satellite sont
   deux produits ; ils partagent le socle de design Lun', pas leurs écrans métier.

## 4. Les flux

| Sens | Quand | Quoi |
|---|---|---|
| Core → satellite | à tout moment | **Délégation** : une demande confiée à l'agent du poste, qui répond sous une forme normalisée |
| Satellite → core | une fois par jour | **Bilan du jour** : ce qui est entré et ce qui a été fait, lu par la veille nocturne |
| Satellite → core | en direct, borné | **Alertes urgentes** seulement, issues de règles déterministes (Acedia #37), pour joindre le mobile |
| Core ↔ satellite | sur geste | **Cartes à valider** : elles restent chez le satellite ; le core les affiche et transmet le geste |

**La délégation** [choix Claude, forme exacte laissée au plan] : une route du contrat, par exemple
`POST /lun/v1/agent { demande, contexte }`, qui fait travailler l'agent du satellite et rend
`{ résumé, cartes en attente, références, coût }`. Les écritures restent des cartes du satellite,
avec ses règles : suppression toujours validée, mail en brouillon seulement. Une lecture simple
(« qu'est-ce que j'ai demain ? ») peut appeler directement une action du catalogue, sans agent, pour
ne pas payer deux fois les jetons.

**Le bilan du jour** [choix Claude] : une action de lecture du catalogue (par exemple `day.digest`),
appelée par le core. Le satellite ne pousse rien et n'a besoin d'aucune connexion ouverte pour ça.

**Les alertes** : le flux SSE existant du contrat reste, mais le core n'en retient que les
événements `urgent` et ceux du contrôle (clé, état). Le mode actif filtre toujours ce qui sonne.

**Les cartes relayées** [choix Claude] : le contrat expose la liste des cartes en attente et le geste
(valider, refuser, modifier). Dans l'app du core, une carte allégée dit ce qui va être fait, avec
Valider, Refuser et un lien vers le détail dans l'outil.

## 5. La mémoire : un cycle d'un jour

1. **Le jour, dans le core** : une mémoire vive de la journée (conversations, « note ça », demandes,
   alertes reçues). Elle sert la réactivité, sans aller-retour vers le cerveau.
2. **La nuit, une routine** (la veille nocturne) prend la mémoire vive, le bilan de chaque satellite
   et les sources de veille, et les confie au cerveau.
3. **Le cerveau** écrit ou modifie les fiches, repère les incohérences et les doublons, et en fait
   des questions à valider. Les règles de la spec d'écosystème (§7.1) tiennent : une fiche naît à la
   deuxième source, cinq questions au plus par nuit, un fait démenti est barré et daté, jamais effacé.
4. **Le lendemain**, le core repart propre avec un **contexte chaud** recomposé depuis le cerveau
   (environ 500 mots, lu à chaque échange, gardé localement pour que la voix reste sous 2 s).
5. **La mémoire de la relation** ne se compacte pas : elle reste dans le core et évolue.

**Repartir propre** [choix Claude] ne supprime rien : l'historique des fils reste consultable (spec du
palier 1). Seul ce que le core met dans le contexte du modèle repart de zéro, nourri par le contexte
chaud. La veille nocturne tourne à la coupe de la journée de Natsume (5 h, heure de Paris).

Les **propositions d'action** naissent de ce cycle, cinq au plus par matin comme les questions
[choix Claude]. Exemple : un mail urgent demande un rendu à
telle heure ; le core demande à Acedia de préparer un brouillon et, au retour de la routine, prévient
CrOliX et lui demande de relire et valider. Au MVP, le volet nocturne d'Acedia se limite à faire
remonter ses propositions de tri en attente.

**Les sources du cerveau** :

| Source | Arrive par | Horizon |
|---|---|---|
| « Note ça » dans le chat | le core, qui transmet | MVP |
| Document ou cours déposé (dépôt de brouillon) | le core, qui transmet | MVP |
| Bilan des satellites (Acedia) | la veille nocturne, via le core | MVP |
| Veille tech sur une liste d'URL et de flux choisis | le cerveau lui-même, petit modèle, plafond de coût | MVP léger, coupé en premier |
| Veille libre sur internet | le cerveau | plus tard |

Les fiches de veille et de cours vont dans un espace « technique », en brouillon jusqu'à validation.

## 6. Les routines

Une routine est un **déclencheur générique** du core : une heure, une suite d'appels (« bilan du jour
chez Acedia », « confier au cerveau », « préparer les propositions »), sans métier propre. La veille
nocturne et le point du matin sont les deux premières. La mémoire n'est pas une routine : c'est le
cerveau, que plusieurs routines et le chat alimentent.

Au MVP, les routines sont définies dans le core ; les créer et les régler depuis l'app vient au
moyen terme.

## 7. Les surfaces

| Surface | Ce que c'est |
|---|---|
| **Mobile** (80 % du temps) | L'app du core, seule app installée. Chemin unique : mobile → core sur le NAS → satellite. Elle reprend beaucoup d'éléments d'Acedia (seul satellite pour l'instant) avec ses propres écrans, plus de réglages et les fonctions du core. Un outil de dev ou d'apprentissage n'y a pas sa place. Le core est le seul à notifier |
| **Desktop** (le soir) | L'app du core : voix, avatar, fil, contrôle, et le portail vers les outils |
| **Front autonome d'un satellite** | Complet sur son métier, utile sans Lun', et mode de secours. Ce n'est pas le parcours de CrOliX au quotidien ; on s'y rend depuis le portail pour le détail ou un problème |

## 8. Ce qui change dans la spec d'écosystème du 2026-10-19

- **Principe 7 et paquet de vues** : abandonnés. Les apps de Lun'Anima n'intègrent plus les vues d'un
  satellite ; le contrat satellite perd sa section « Fronts et vues » au profit des règles du §3.
  `views/` reste un découpage interne d'Acedia.
- **Majordome conversationnel d'Acedia** : il n'est plus hors MVP. Pina existe et devient le poste
  auquel le core délègue.
- **Le cerveau** sort du core et devient un satellite ; le core garde la relation et le contexte
  chaud.
- **Le lien core ↔ satellite** passe de « interroger, agir, écouter tout le flux » à « déléguer,
  lire le bilan du jour, écouter les alertes ».
- **Acedia** : bornée aux outils Google ; GitHub, RSS et Home Assistant sortent de sa description au
  registre.
- **Le mobile** : plus de boîte d'Acedia intégrée par paquet de vues ; l'app du core construit ses
  écrans et passe par le core.

## 9. La carte des besoins

| Besoin | Projet | Horizon |
|---|---|---|
| Conversation, fil principal, sessions, persona | Core | MVP (base posée au palier 1) |
| Délégation aux agents, réponse normalisée, cartes relayées | Core + contrat | MVP, nouveau |
| Mémoire vive du jour, mémoire de la relation, contexte chaud | Core | MVP |
| Routines (veille nocturne, point du matin) | Core | MVP ; réglables depuis l'app : moyen terme |
| Propositions d'action issues de la nuit | Core → postes | MVP |
| Portail, contrôle agrégé, modes | Core | MVP |
| Voix + RVC, avatar | Core + desktop | MVP, première ligne de coupe |
| Fiches, liens, incohérences, dépôts, « note ça » | Lun'Avaritia | MVP |
| Veille tech sur URL choisies | Lun'Avaritia | MVP léger |
| Mail, agenda, tâches, tri, Pina | Acedia | fait |
| Délégation et bilan du jour côté Acedia | Acedia | MVP, nouveau |
| Alertes déterministes (#37) | Acedia | MVP |
| Journal borné (#33), poids du build (#38) | Acedia | MVP léger |
| Confort façon Google (#34), Drive | Acedia | moyen terme |
| Notifications GitHub à la source, pilotage de l'environnement de dev | Ira (refondu) | moyen terme |
| Veille libre sur internet | Lun'Avaritia | moyen terme |
| Home Assistant | futur satellite | long terme |
| Gula, mode jeu, vision d'écran, streaming | — | long terme (2027) |

## 10. Non-buts et anti-buts

**Non-buts** : une app Acedia sur le téléphone de CrOliX ; l'intégration des écrans d'un satellite
dans le core ; un satellite par source de lecture.

**Anti-buts**, échecs même si tout marche :

- le core qui prend une décision métier à la place d'un poste ;
- deux satellites qui s'appellent l'un l'autre ;
- une alerte qui sonne deux fois, ou un matin rempli de propositions qu'on accepte toujours ;
- une fiche écrite sans validation, ou une mémoire de la relation compactée avec la journée ;
- une réponse vocale qui attend le cerveau.

## 11. Décisions de suite

- **Le nom** : le cerveau s'appelle **Lun'Avaritia**. L'avarice garde tout et n'efface rien, comme une
  mémoire où un fait démenti est barré, jamais effacé. Le nom, mis en réserve pour une app Android
  d'Acedia qui n'a plus lieu d'être, est repris. Reste à trancher à sa création : dépôt public ou
  privé.
- **L'ordre des chantiers** jusqu'au 31/12, chacun avec son issue, sa branche et sa PR :
  1. **Contrat satellite v2** (lun-docs) : délégation, cartes relayées, bilan du jour, retrait des
     vues ; ADR.
  2. **Acedia** : route de délégation, cartes exposées, bilan du jour, alertes déterministes (#37).
  3. **Core** : délégation et cartes relayées. Première boucle complète : « marque le resto » dit à
     Natsume, une carte de Pina, validée depuis le core.
  4. **Lun'Avaritia v1** : fiches, « note ça », dépôts, validation.
  5. **Core** : mémoire vive, routines (veille nocturne, point du matin), contexte chaud.
  6. **Apps du core** : mobile d'abord, puis desktop.
  7. **Personnalité, voix, avatar, modes.**
  8. **Rodage** : une semaine d'usage en local.
- **La liaison** (mobile → core sur le NAS, core → satellites) attend la fin du dev local du MVP. On
  ne reprend pas le parcours de l'ancien écosystème, trop lourd en étapes : relier un satellite doit
  rester simple pour quelqu'un qui le récupère seul. D'ici là, le core et Acedia se relient en local
  avec l'existant (`pair-code`, `connect`).

## 12. Laissé au constructeur

La forme exacte des routes de délégation et de cartes relayées, le format du bilan du jour, le
stockage de la mémoire vive, la recomposition du contexte chaud, le moteur des routines, la façon
dont le cerveau va chercher la veille. Chaque choix structurant donne un ADR ; la révision du contrat
satellite (délégation, cartes, retrait des vues) passe par l'ADR 0003 ou un successeur.
