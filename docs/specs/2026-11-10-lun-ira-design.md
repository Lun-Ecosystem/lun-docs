# Lun'Ira : l'atelier de dev. Fondations

> **Mise de côté par CrOliX le 10/11, le jour même.** Deux raisons. L'architecture du moment limite trop : aucun PC
> toujours allumé, un NAS qu'il veut ramener au stockage, et à terme un serveur dédié qui ferait aussi tourner les modèles
> les plus légers en local. Et la plus-value est faible : son abonnement à un agent de code fait déjà ce que ferait le
> satellite ; le seul ajout serait la présence (voir que c'est Natsume ou l'agent du poste qui a ouvert une PR), « de la
> com et de l'image, mais c'est tout ». Cette spec reste comme trace de la réflexion ; rien n'en est planifié.

> Spec de fondation du 10/11, à valider par CrOliX **avant tout plan**. Elle suit le
> [cadrage](2026-11-10-axe-dev-cadrage.md) et ce que CrOliX y a tranché (§ 1). Elle pose ce que le satellite est, ce qu'il
> possède, sa règle de coût, son harnais, son format et ses paliers ; elle ne dessine aucun écran et ne choisit aucune
> bibliothèque. Les choix marqués **[choix Claude]** se changent avant le plan. Ce qui vient des textes officiels lus le
> 10/11 est marqué **[vérifié le 10/11]** et se relit avant chaque palier : ces règles changent. Après le MVP de
> l'écosystème : rien ici n'entre dans ce que la semaine de rodage juge. Issue : lun-docs#125.

## 1. Ce qui est tranché

Par CrOliX, le 10/11 :

- **L'axe est son travail de dev**, conduit au quotidien avec l'IA. Trois tensions à faire disparaître : tout centraliser
  (sessions d'agent entre machines et entre postes, contrôle à distance), voir et contrôler GitHub par Natsume, piloter le
  travail.
- **Un atelier à soi, sur des briques existantes.** Comme Acedia pose sa surface et son agent sur Gmail sans réécrire un
  serveur de mail, l'atelier ne réécrit ni le moteur d'édition ni les agents de code, et possède tout ce qui est autour.
- **L'écriture à la main ne disparaît pas.** « À l'ère de l'IA, il n'y a plus de gain à taper soi-même le code », mais la
  retouche manuelle, la révision spontanée et le bac à sable restent. D'où une logique de harnais : une sécurité
  réglable, et de la vigilance sur le 100 % automatique.
- **La veille tech n'est pas le suivi de GitHub.** Ce satellite suit ce qui touche ses dépôts ; la veille par thèmes,
  tech comprise, se cadre à part (cadrage, § 7).
- **Aucun PC n'est toujours allumé.** Le NAS l'est, sur le réseau local ; la tension entre connectivité et exposition
  reste, et l'architecture d'ensemble est à revoir.
- **Avancer par paliers, brique par brique.** Pour commencer : un outil qui permet à l'agent du satellite, relié ou non
  à Natsume, d'assister et de piloter le travail de dev, avec « un travail béton sur la limitation du coût des appels ».
  D'où l'idée d'utiliser un abonnement plutôt que des appels d'API.
- **Le format du satellite reste ouvert** : comme Acedia et Avaritia, comme un paquet npm (l'ancien Lun'Ira), ou autre.

## 2. Ce que c'est

Un atelier où CrOliX pilote son travail de dev avec des agents : il y voit ses chantiers à travers les dépôts, y lance et
suit des sessions d'agent de code, y relit ce qu'elles produisent, y retouche à la main, et y décide ce qui part sur
GitHub. L'agent de l'atelier connaît l'état du travail, le dit, et prépare les gestes. Relié au core, c'est par lui que
Natsume sait où en est chaque chantier.

**Nom : Lun'Ira [choix Claude]**, l'atelier, la forge où le travail se fait. Le nom se confirme à la validation.

## 3. Ce qu'il possède, et ce qu'il ne possède pas

- **Il possède** : l'état des dépôts, des chantiers et de la CI ; les gestes sur GitHub et leur trace ; le registre des
  sessions d'agent ; la passation d'un poste à l'autre ; le compteur de coût et ses plafonds ; le harnais (§ 6) ; plus
  tard, la surface de l'atelier (revue des diffs, retouche, terminal, bac à sable) ; le suivi des dépendances.
- **Il ne possède pas** : le moteur d'édition ; les agents de code et leurs abonnements (les outils officiels, non
  modifiés) ; la méthode de travail (lun-docs et son plugin, pour l'écosystème Lun') ; les fiches (Avaritia) ; la veille
  par thèmes ; la conversation et la personnalité (le core).
- **Autonome et public** : il sert quelqu'un qui n'a ni core ni Natsume. Son agent est neutre et se règle. Rien à
  l'écran ne nomme le core.

## 4. La règle de coût

C'est la contrainte première. Trois niveaux, du moins cher au plus cher ; un niveau ne s'emploie que si le précédent ne
suffit pas.

- **C0, sans modèle.** Tout ce qui se calcule se calcule : l'état d'un chantier à travers ses dépôts, l'ordre de fusion,
  une CI rouge attendue ou réelle, le bilan du jour, les alertes. Coût nul. C'est le socle, et la plupart des questions
  (« où en est P ? », « qu'est-ce qui m'attend ? ») s'y répondent.
- **C1, l'abonnement, par l'outil officiel.** Le raisonnement de l'agent tourne dans l'agent de code officiel, non
  modifié, où CrOliX est connecté avec son propre abonnement ; l'atelier lui apporte ses outils et son rôle (§ 5).
  **[vérifié le 10/11]** La documentation du fournisseur dit qu'un utilisateur peut se connecter au binaire non modifié
  avec son abonnement, que le mode sans interface et le kit d'agents puisent alors dans les limites de l'abonnement, et
  que ces limites supposent un usage ordinaire et individuel. Elle interdit à un outil de recueillir, stocker ou
  relayer ces identifiants : l'atelier n'y touche jamais.
- **C2, une clé d'API.** Coupée par défaut. Si elle est posée : un plafond par tâche, par jour et par mois, et l'arrêt
  net au plafond, comme le core le fait déjà.

Ce que l'abonnement impose : ses limites (par fenêtre de cinq heures et par semaine) sont **partagées** avec tout le
reste de l'usage de CrOliX, et un lancement en éventail peut vider la semaine. L'atelier compte donc aussi le quota :
un nombre de tours borné par tâche, pas de sessions en parallèle par défaut, rien de lancé sans que CrOliX le voie, et
l'état du quota affiché quand l'outil le donne.

## 5. Le format

| | Ce que c'est | Pour | Contre |
|---|---|---|---|
| **F1. Serveur et front**, comme Acedia et Avaritia | Un conteneur, sur le NAS | toujours allumé ; le contrat satellite y est chez lui | les sessions ne peuvent pas y tourner (trop faible, Linux, pas d'outils) ; et un agent sur le NAS ne peut pas se servir de l'abonnement du poste |
| **F2. Un paquet npm**, comme l'ancien Lun'Ira | Une commande et un petit service local, sur le PC où l'on travaille | marche sur n'importe quel poste, sans hôte ; le plus simple à adopter pour un outil public | pas de présence quand tous les PC sont éteints |
| **F3. Une extension de l'agent de code** | Un greffon et un serveur d'outils (MCP) : l'agent de l'atelier est un rôle dans l'outil officiel | le plus léger ; vit là où le travail se fait ; **c'est ce qui rend C1 possible** | aucune surface à soi ; dépend de l'outil hôte |
| **F4. Une appli de bureau**, comme Luxuria | Une fenêtre | une vraie surface | le plus lourd, pour une surface qui ne vient qu'au dernier palier |

**[choix Claude] Un seul paquet npm (F2), à trois visages.** Son cœur calcule l'état (C0). Il s'offre aux agents de code
par un serveur d'outils et un greffon (F3) : c'est par là que l'agent de l'atelier existe sous l'abonnement. Plus tard,
le même paquet lancé en mode serveur sur le NAS devient le poste de contrôle et parle le contrat satellite (F1). Une
base de code, pas trois projets ; F4 se décide au palier de la surface.

## 6. Le harnais

Ce que l'atelier garantit, quel que soit l'agent :

- **Rien n'est 100 % automatique par défaut.** Un agent propose ; ce qui sort du poste (pousser, fusionner, publier,
  commenter) passe par une carte.
- **Une sécurité réglable**, par dépôt et par session : ce qu'un agent peut lire, écrire, lancer ; ce qui demande une
  validation ; ce qui est interdit.
- **Le bac à sable** : une session peut travailler dans une copie isolée du dépôt ; ce qu'elle produit n'entre dans le
  dépôt que par une revue.
- **La main reste possible partout** : arrêter une session, reprendre à sa place, retoucher son diff.
- **La trace** : qui a fait quoi (CrOliX, l'agent de l'atelier, une session, Natsume), et ce que ça a coûté, en dollars
  ou en quota.

## 7. Où le travail se fait, et comment il passe d'un poste à l'autre

- **Une session travaille là où est son dépôt cloné : sur un PC.** Jamais sur le NAS.
- **GitHub est le fil commun entre les machines.** L'état des chantiers s'y lit depuis n'importe quel poste ; rien n'a à
  se synchroniser entre le desktop et le laptop pour que l'atelier dise la même chose sur les deux.
- **Rejoindre** une session qui tourne sur un PC allumé : par le contrôle à distance de l'agent officiel, tant que
  l'atelier n'a pas mieux.
- **Passer la main** quand le PC va s'éteindre : aucun outil ne migre une session vivante. L'atelier en fait un geste
  propre : pousser le travail en cours sur sa branche, écrire la note de passation (où on en est, ce qui reste, ce qui
  attendait) dans la PR du chantier, puis ouvrir une session neuve sur l'autre poste à partir des deux.
- **Rien de nouveau n'est exposé.** L'atelier interroge GitHub ; GitHub n'appelle jamais chez CrOliX. Quand le poste de
  contrôle arrive sur le NAS, il prend la porte de l'[ADR 0008](../../adr/0008-acces-exterieur.md), et les PC s'y relient
  en sortie seulement.

## 8. Les paliers

Le MVP de l'atelier est fait des paliers 0 à 3. Chacun a sa spec de design et son plan.

| | Brique | Ce qu'elle prouve | Coût |
|---|---|---|---|
| **0. L'essai** | Dans l'agent officiel, sous l'abonnement : un outil de l'atelier appelé par un rôle, puis une tâche bornée en mode sans interface ; la mesure de ce que ça consomme | que C1 tient, et combien il coûte en quota | C1 |
| **1. Voir** | Le paquet : les dépôts suivis, un chantier lu à travers ses dépôts, l'ordre de fusion, la CI attendue ou réelle, le bilan, les alertes ; en ligne de commande et en outils pour agents | que l'état se calcule sans modèle | C0 |
| **2. Assister** | L'agent de l'atelier : un rôle et ses outils dans l'agent de code ; il répond, résume, propose la suite ; le compteur de coût et ses bornes | que l'agent pilote sans appel d'API | C0, C1 |
| **3. Agir** | Les gestes sur GitHub par cartes : fusionner dans l'ordre, relancer une CI, ouvrir une issue, tenir l'avancement à jour ; la trace | le harnais | C0, C1 |
| **4. Passer la main** | Le registre des sessions du poste ; la passation par GitHub | la tension « tout centraliser », sans hôte | C0, C1 |
| **5. Relié** | Le mode serveur sur le NAS : le contrat satellite, le bilan au point du matin, Natsume qui demande ; l'identité GitHub propre à Natsume | le poste dans l'écosystème | C0 quand aucun PC n'est allumé |
| **6. L'atelier** | La surface : revue des diffs, retouche, terminal, bac à sable ; d'autres agents (GPT, Gemini) par le protocole ouvert des éditeurs | l'IDE à soi, fonction par fonction | selon l'agent |

Au palier 5, le poste sur le NAS ne répond qu'en C0 quand aucun PC n'est allumé : il dit l'état, il ne raisonne pas. Un
raisonnement demande un PC allumé (C1) ou une clé (C2). C'est une limite connue, pas un défaut à cacher.

**L'identité sur GitHub.** Jusqu'au palier 4, l'atelier agit avec la connexion de CrOliX, par cartes. Une identité
propre à Natsume vient au palier 5 : une application GitHub **[choix Claude]**, pour ses droits dépôt par dépôt et ses
jetons courts, ou un compte machine si « une collègue qui commente » compte plus. Jamais de jeton à haut privilège pour
une commodité.

## 9. Ce que cette spec change ailleurs

- [`vision.md`](../../vision.md) : dire qui possède le travail de dev ; garder « hors VIP » la fabrication de code par des
  agents maison, et y distinguer le pilotage d'agents existants.
- Un ADR d'écosystème : Lun'Ira, l'atelier de dev, satellite public autonome, et son format.
- `registry.yaml` : l'entrée `lunira`, à la création du dépôt.
- Le contrat satellite : rien avant le palier 5 ; un poste qui n'est pas toujours joignable s'y cadre alors.

Ces changements se font à la validation de cette spec, pas avant.

## 10. Hors périmètre

- Écrire un éditeur de texte, ou des agents de code à soi (l'ancien Lun'Ira).
- Recueillir, stocker ou relayer un identifiant d'abonnement, de quelque fournisseur que ce soit.
- La veille par thèmes, tech comprise : cadrage, § 7, à trancher à part.
- Le stream, le jeu, l'imitation : hors de cet axe.
