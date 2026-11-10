# Le nouvel axe : le travail de dev. Cadrage

> Cadrage du 10/11, à discuter avec CrOliX **avant toute spec**. Il ouvre des possibilités et n'en tranche aucune. Demande
> de CrOliX le 09/11 : partir des besoins d'aujourd'hui, challenger [`vision.md`](../../vision.md), dire comment le satellite
> s'intègre aux autres, revoir le nom. Le 10/11, CrOliX a dit son besoin (§ 2) : ses points sont « des idées à valider,
> creuser, écarter ». Les avis marqués **[avis Claude]** sont des recommandations, pas des décisions. Ce qui vient d'une
> recherche du 10/11 est marqué **[vérifié le 10/11]** et se revérifie avant la spec : ces outils changent vite. Cet axe
> vient après le MVP : rien ici n'entre dans ce que la semaine de rodage juge.

## 1. Ce que dit la vision, et ce qu'elle ne dit pas

- Surface 1, « assistante de travail » : elle « traite les notifications GitHub directement à la source » et gère « la
  veille tech ». **Aucun projet ne possède ces deux promesses aujourd'hui** : Acedia a le mail, l'agenda et les tâches ;
  Avaritia le savoir ; Luxuria le corps.
- « Hors VIP » : « le pipeline de développement multi-agents ». La vision écarte donc la *fabrication* de code du VIP,
  mais pas le *suivi* ni le *pilotage* du travail de dev.
- **À corriger dans la vision, quelle que soit l'option** : dire qui possède le travail de dev, et séparer ce pilotage
  (dans le périmètre) de la fabrication de code par des agents maison (hors périmètre).

## 2. Le besoin, dans les mots de CrOliX

« Je travaille au quotidien avec l'IA, et j'ai un certain nombre de points de tension que je voudrais faire
disparaître. »

1. **Tout centraliser.** Ne plus galérer à reprendre une session d'agent de code d'une machine à l'autre ; faire
   communiquer deux sessions sur deux postes ; bien gérer le contrôle à distance.
2. **La vision et le contrôle de GitHub.** Un compte GitHub contrôlé par Natsume, « comme Claude en somme ».
3. **Piloter mon travail.** Un IDE sur mesure, adapté à l'intégration de l'IA ; utiliser des comptes par abonnement
   (Claude, GPT, Gemini et d'autres).

Et pour la veille, trois approches à comparer : une veille purement tech, portée par ce satellite ; un outil dédié qui
règle plusieurs veilles par thème ; ou un outil existant qu'on branche (un serveur Perplexity pour agents, par exemple).

Ce que les sessions des 09 et 10/11 ont montré va dans le même sens : une session perdue à la fusion des partitions,
reconstruite depuis la mémoire, les PR et les plans ; cinq PR à fusionner dans un ordre ; une CI rouge qu'il faut ouvrir
pour savoir si elle est attendue ; une feuille de route tenue à la main.

## 3. Ce que l'ancien essai apprend

L'ancien Lun'Ira (archivé, référence seulement) était une forge : une intention en texte, quatre agents en chaîne (PO,
planification, dev, QA), du code en sortie, avec ses propres clés de modèles. Deux leçons :

- les agents de code du marché font ce travail, mieux, et CrOliX en utilise un tous les jours ; refaire une forge, c'est
  concurrencer son propre outil ;
- ce qui manquait autour n'a pas changé : le budget, la trace, savoir où on en est, reprendre. C'est là qu'est le besoin.

## 4. Point 1 : tout centraliser

**Ce que l'outil fait déjà [vérifié le 10/11].** L'agent de code de CrOliX sait pousser une session locale vers un autre
appareil (le contrôle à distance : la session continue de tourner sur le poste d'origine, qui doit rester allumé),
ramener une session du nuage dans un terminal, et faire s'écrire des sessions entre elles. Ce qu'il ne fait pas :
reprendre *en local sur le poste B* une session *née en local sur le poste A*. Les transcriptions et la mémoire vivent
dans le dossier de l'utilisateur de chaque machine, rangées par chemin de projet ; elles ne se synchronisent pas.

| | Ce que c'est | Pour | Contre |
|---|---|---|---|
| **1a. Un seul hôte** | Les sessions tournent toutes sur une machine toujours allumée (le desktop, puis le NAS) ; le laptop et le téléphone s'y relient par le contrôle à distance | centralisé par construction, sans rien écrire ; même logique que « l'écosystème tourne sur le NAS » | l'hôte doit avoir les dépôts, les outils et la puissance ; pas de travail hors ligne |
| **1b. Le nuage du fournisseur** | Les sessions tournent chez le fournisseur ; on les ramène en local au besoin | rien à héberger | pas d'accès au poste (voix, GPU, fichiers locaux) ; dépend d'un seul fournisseur |
| **1c. Synchroniser les dossiers** | Recopier transcriptions et mémoire entre machines | garde le travail local | format interne non garanti, chemins différents d'un poste à l'autre (le 09/11 l'a montré) : fragile |
| **1d. Un registre des sessions** | Le satellite sait quelles sessions existent, où, sur quel chantier, ce qu'elles attendent ; il ne les héberge pas | utile quel que soit l'hôte ; c'est ce que Natsume peut dire | ne règle pas la reprise à lui seul |

**[avis Claude]** 1a d'abord, parce que c'est une décision d'installation et pas du code, puis 1d par-dessus : le
satellite tient le registre et le dit à Natsume. 1c non. À vérifier avant la spec : ce que l'outil expose pour lister et
suivre ses sessions de l'extérieur.

## 5. Point 2 : GitHub vu et contrôlé par Natsume

**Deux façons de lui donner une identité [vérifié le 10/11].**

| | Ce que c'est | Pour | Contre |
|---|---|---|---|
| **2a. Un compte machine** | Un second compte GitHub, réservé à l'automatisation ; les conditions de GitHub en autorisent un gratuit par personne | une vraie identité : elle commente, ouvre des PR, se fait mentionner, « comme Claude » | un jeton à longue durée à garder ; des droits larges par défaut ; un siège dans l'organisation |
| **2b. Une application GitHub** | Une app installée sur l'organisation, avec des droits dépôt par dépôt et des jetons courts | les droits les plus fins ; pas de siège ; des événements poussés (webhooks) | une identité « bot », moins « un collègue » ; demande une adresse joignable pour les événements |

**Ce qu'elle en fait**, par paliers :

- **Lire** : dépôts, issues, PR, CI, notifications. Un bilan du jour, des alertes (« CI rouge sur `main` », « PR verte
  depuis hier »), et l'agent du poste répond à Natsume : « où en est P ? ». Le contrat satellite v1.4 suffit.
- **Agir, par cartes** : fusionner dans l'ordre, relancer une CI, ouvrir une issue `inbox` depuis une phrase, cocher la
  feuille de route à la fusion. Chaque geste est une carte : les bretelles restent les cartes.

**[avis Claude]** C'est le point le plus mûr : il se prouve seul, sert dès le premier jour, et ne dépend d'aucun
fournisseur de modèle. Lire d'abord, agir ensuite. Pour l'identité, 2b pour les droits et les événements ; 2a seulement
si « une collègue qui commente » compte plus que la finesse des droits. Rappel : jamais de clé à haut privilège pour une
commodité.

## 6. Point 3 : piloter le travail

**Deux faits qui cadrent tout [vérifiés le 10/11].**

- **Les abonnements ne se branchent pas dans un outil tiers.** Depuis février 2026, le fournisseur de l'agent de CrOliX
  réserve les jetons d'abonnement à ses propres produits : un outil tiers, même fait pour soi, doit passer par une clé
  d'API payée à l'usage. Plusieurs outils tiers ont été coupés en 2026 pour cette raison.
- **Un protocole ouvert relie éditeurs et agents** (Agent Client Protocol). Un éditeur qui le parle pilote les agents
  officiels (ceux de Claude, de GPT, de Gemini), et chacun garde sa propre connexion, abonnement compris. L'abonnement
  reste dans l'outil officiel ; l'éditeur ne fait que le conduire.

| | Ce que c'est | Pour | Contre |
|---|---|---|---|
| **3a. Un IDE à soi** | Écrire un éditeur de code | sur mesure | des années de travail pour rattraper l'existant ; et les abonnements n'y entrent pas |
| **3b. Un éditeur existant qui parle le protocole** | Adopter un éditeur ouvert aux agents externes ; y brancher les trois agents officiels | les abonnements marchent, légitimement ; rien à écrire | on s'adapte à l'éditeur |
| **3c. Un poste de pilotage, pas un éditeur** | Une surface du satellite : les chantiers, les sessions, les PR, la CI, ce qui attend CrOliX ; elle ouvre l'éditeur ou la session au bon endroit | c'est ce qui manque vraiment ; cohérent avec les points 1 et 2 | ne remplace pas l'éditeur |
| **3d. La forge maison** | L'ancien Ira : des agents à soi | — | écarté par la vision et par le § 3 |

**[avis Claude]** 3b pour écrire le code, 3c pour piloter : ne pas construire d'IDE. Le besoin « adapté à l'intégration de
l'IA » est déjà servi par les éditeurs qui parlent le protocole ; ce qu'aucun ne donne, c'est la vue des chantiers à
travers les dépôts et les sessions, et c'est ce que le satellite peut posséder. Plusieurs abonnements : oui, par les
outils officiels pilotés, jamais par leurs jetons recopiés.

## 7. La veille : trois approches

Aujourd'hui, la veille se fait à la main, avec Perplexity, dans `perplexity/` : des notes et une base de 133 sources.

| | Ce que c'est | Pour | Contre |
|---|---|---|---|
| **V1. La tech, dans ce satellite** | Les sorties des dépendances, les dépôts suivis, les avis de sécurité : tout vient de GitHub | même source et même identité que le § 5 ; rien de plus à brancher | ne couvre que la tech liée au code |
| **V2. Un outil dédié, par thèmes** | Des veilles réglables : un thème, des sources, un rythme, une synthèse | couvre tout (tech, VTubeuses, sorties) ; un métier net | un projet de plus pour un besoin encore flou ; la recherche est le métier d'outils déjà bons |
| **V3. Brancher l'existant** | Un serveur de recherche pour agents (Perplexity en publie un, officiel, avec une clé d'API payée à l'usage) appelé par une routine : un thème, une question, un rythme | la recherche est faite par un outil dont c'est le métier ; très peu de code | un coût par appel ; dépend d'un fournisseur |

Qui reçoit le résultat se décide à part : ce qui mérite de rester devient une fiche sourcée dans Avaritia, dont c'est le
métier ; le reste passe au point du matin.

**[avis Claude]** V1 dans ce satellite, parce que c'est gratuit et lié. V3 pour le reste, réglé par thèmes : cela donne
l'essentiel de V2 sans écrire un moteur de veille. Qui porte la routine de V3 reste à trancher : pas le core (il ne
possède aucun métier), plutôt Avaritia, qui range déjà ce qu'on lui apporte.

## 8. Ce que le satellite posséderait, et comment il s'intègre

- **Il possède** : l'état des dépôts, des chantiers et de la CI ; l'identité GitHub de Natsume et ses gestes ; le
  registre des sessions d'agent ; la surface de pilotage ; la veille tech des dépôts.
- **Il ne possède pas** : le code des autres projets ; la méthode (lun-docs) ; les fiches (Avaritia) ; l'éditeur ; les
  agents de code eux-mêmes et leurs abonnements ; la conversation (le core).
- **Avec le core** : un poste comme les autres, par le contrat v1.4. Son bilan entre au point du matin ; une CI rouge
  sur `main` est une alerte ; ses cartes passent par « À trancher ».
- **Avec Avaritia** : jamais en direct. Une décision de chantier qui mérite une fiche passe par le core.
- **Public** : un outil autonome, utilisable sans le core, comme Acedia et Avaritia.

## 9. Le nom

Pris : Acedia, Avaritia, Luxuria. Restent Ira, Gula, Superbia, Invidia. Les notes de veille (`04-propositions`,
« septénaire ») proposaient Superbia pour la scène et Invidia pour la veille, sans rien décider.

- **Ira** : la forge de l'ancien essai. Il convient à un atelier où le travail se pilote ; il promet moins bien un poste
  qui ne ferait que lire.
- **Superbia** : l'orgueil de l'ouvrage, mais la piste « scène » le perdrait.
- **Invidia** : regarder ce que font les autres ; à garder pour la veille si elle devient un outil dédié (V2).

**[avis Claude]** Avec les trois points du § 2, l'axe est bien un atelier : Ira convient. À confirmer après le périmètre.

## 10. Un ordre possible, par paliers

1. **GitHub, en lecture** (§ 5) : l'identité, le bilan, les alertes, « où en est P ? ». Avec la veille tech (V1).
2. **GitHub, les gestes par cartes** (§ 5).
3. **Le registre des sessions et la surface de pilotage** (§ 4, 1d ; § 6, 3c), une fois l'hôte unique choisi (1a).
4. **La veille par thèmes** (V3), à part, quand son porteur est tranché.

## 11. Ce qui reste à trancher, dans l'ordre

1. Point 3 : pas d'IDE à soi, un éditeur existant et une surface de pilotage (3b et 3c) ?
2. Point 1 : un hôte unique pour les sessions (1a), et lequel ?
3. Point 2 : l'identité de Natsume sur GitHub, compte machine ou application ?
4. La veille : V1 ici et V3 pour le reste, et qui porte V3 ?
5. Le nom, puis la correction de `vision.md`, dans la PR de la spec.

Ensuite : une spec de design pour le premier palier, puis son plan.
