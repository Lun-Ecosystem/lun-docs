# Lun'Ira : l'atelier de dev. Fondations

> Spec de fondation du 10/11, à valider par CrOliX **avant tout plan**. Elle suit le
> [cadrage](2026-11-10-axe-dev-cadrage.md) et ce que CrOliX y a tranché (§ 1). Elle pose ce que le satellite est, ce qu'il
> possède, ses règles de sécurité et ses paliers ; elle ne dessine aucun écran et ne choisit aucune bibliothèque. Les choix
> marqués **[choix Claude]** se changent avant le plan. Après le MVP : rien ici n'entre dans ce que la semaine de rodage
> juge. Issue : lun-docs#125.

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

## 2. Ce que c'est

Un atelier où CrOliX pilote son travail de dev avec des agents : il y voit ses chantiers à travers les dépôts, y lance et
suit des sessions d'agent de code, y relit ce qu'elles produisent, y retouche à la main, et y décide ce qui part sur
GitHub. L'agent de l'atelier connaît l'état du travail et le dit ; relié au core, c'est par lui que Natsume sait où en
est chaque chantier et agit sur GitHub.

**Nom : Lun'Ira [choix Claude]**, l'atelier, la forge où le travail se fait. Le nom se confirme à la validation.

## 3. Ce qu'il possède, et ce qu'il ne possède pas

- **Il possède** : l'état des dépôts, des chantiers et de la CI ; une identité sur GitHub et les gestes faits en son nom ;
  le registre des sessions d'agent (lesquelles, où, sur quel chantier, ce qu'elles attendent) ; la surface de l'atelier
  (pilotage, revue des diffs, lecture et retouche de fichiers, terminal) ; le harnais (§ 5) ; le suivi des dépendances de
  ses dépôts.
- **Il ne possède pas** : le moteur d'édition (un composant existant, embarqué) ; les agents de code et leurs
  abonnements (les outils officiels, pilotés) ; la méthode de travail (lun-docs et son plugin, pour l'écosystème Lun') ;
  les fiches et le savoir (Avaritia) ; la veille par thèmes ; la conversation et la personnalité (le core).
- **Autonome et public**, comme Acedia et Avaritia : il sert quelqu'un qui n'a ni core ni Natsume. Son agent est neutre
  et se règle (nom, ton, contexte). Rien à l'écran ne nomme le core.

## 4. Les trois métiers

### 4.1 GitHub, vu et contrôlé

- **Lire** : dépôts, issues, PR, CI, notifications. Un bilan du jour, des alertes (une CI rouge sur la branche
  principale, une PR verte qui attend), et l'agent répond : « où en est tel chantier ? ». Un chantier se lit à travers
  plusieurs dépôts : ses PR, leur ordre de fusion, ce qui les bloque.
- **Agir, toujours par une carte** : fusionner dans l'ordre, relancer une CI, ouvrir une issue depuis une phrase, tenir
  un document d'avancement à jour à la fusion.
- **L'identité : une application GitHub [choix Claude]**, pour ses droits dépôt par dépôt et ses jetons courts. Un compte
  machine reste possible si « une collègue qui commente » compte plus ; la spec du palier 1 tranche. Jamais de jeton à
  haut privilège pour une commodité.

### 4.2 Les sessions d'agent

- L'atelier **pilote les agents officiels** par le protocole ouvert des éditeurs (Agent Client Protocol) : chaque agent
  garde sa propre connexion, abonnement compris. L'atelier ne lit, ne recopie et ne stocke aucun jeton d'abonnement. Une
  clé d'API reste possible en repli, avec son coût affiché.
- Il **tient le registre** des sessions : en cours, en attente d'une réponse, finies, perdues ; le chantier et le dépôt
  de chacune ; ce qu'elle a coûté quand l'agent le dit.
- **Tout centraliser : un hôte unique [choix Claude].** L'atelier tourne sur une machine toujours allumée (le desktop,
  puis le NAS) et les sessions y vivent ; le laptop et le téléphone s'y relient par son front. Une session ne se
  « transporte » plus : elle reste où elle est, et on la rejoint.
- **Un essai avant le plan** : brancher un agent officiel par le protocole depuis un programme à soi, y lancer une
  session, lire ses événements, répondre à une demande d'autorisation. Si l'essai échoue, ce métier se recadre.

### 4.3 L'atelier

Dans l'ordre où les fonctions arrivent : piloter (chantiers, sessions, ce qui attend CrOliX) ; relire un diff et le
commenter ; lire un fichier et le retoucher à la main ; un terminal ; un bac à sable où essayer sans toucher au dépôt.
Chaque fonction d'IDE de plus (débogage, extensions, serveurs de langage) est un chantier à part, décidé quand le besoin
se montre.

## 5. Le harnais

Ce que l'atelier garantit, quel que soit l'agent piloté :

- **Rien n'est 100 % automatique par défaut.** Un agent propose ; ce qui sort du poste (pousser, fusionner, publier,
  commenter au nom de l'identité) passe par une carte.
- **Une sécurité réglable**, par dépôt et par session : ce qu'un agent peut lire, écrire, lancer ; ce qui demande une
  validation ; ce qui est interdit. Les demandes d'autorisation des agents arrivent dans l'atelier, pas dans un terminal
  perdu.
- **Le bac à sable** : une session peut travailler dans une copie isolée du dépôt ; ce qu'elle produit n'entre dans le
  dépôt que par une revue.
- **La main reste possible partout** : arrêter une session, reprendre à sa place, retoucher son diff.
- **La trace** : qui a fait quoi (CrOliX, l'agent de l'atelier, une session, Natsume), et ce que ça a coûté.

## 6. Relié au core

Un poste comme les autres, par le [contrat satellite](../../standards/contrat-satellite.md) v1.4, sans y toucher
[choix Claude] : `health`, `costs`, `pause`, `events` (CI rouge, PR prête, session qui attend), `agent` (« où en est
P ? »), `cards` (les gestes sur GitHub). Son bilan entre au point du matin. Deux satellites ne se parlent jamais : une
décision de chantier qui mérite une fiche passe par le core vers Avaritia.

## 7. La forme du dépôt

Celle des autres satellites : un serveur, un front, une base locale, le kit et les jetons de design recopiés de lun-docs,
une couleur de monde à choisir [choix Claude : à la spec du premier écran]. Dépôt public `Lun-Ecosystem/lun-ira`, parti
de `templates/project/`, inscrit au registre à sa création.

## 8. Les paliers

1. **GitHub en lecture** : l'identité, les dépôts suivis, le bilan, les alertes, l'agent qui répond, le suivi des
   dépendances. Se prouve seul, sans agent de code.
2. **Les gestes par cartes** sur GitHub.
3. **Les sessions** : l'essai du protocole, puis le registre et le pilotage d'un agent, avec le harnais.
4. **L'atelier** : la revue des diffs, la lecture et la retouche, le terminal, le bac à sable.

Chaque palier a sa spec de design et son plan ; ses écrans se cadrent par des maquettes avant le code.

## 9. Ce que cette spec change ailleurs

- [`vision.md`](../../vision.md) : dire qui possède le travail de dev ; garder « hors VIP » la fabrication de code par des
  agents maison, et y distinguer le pilotage d'agents existants.
- Un ADR d'écosystème : Lun'Ira, l'atelier de dev, satellite public autonome.
- `registry.yaml` : l'entrée `lunira`, à la création du dépôt.

Ces trois changements se font à la validation de cette spec, pas avant.

## 10. Hors périmètre

- Écrire un éditeur de texte, ou des agents de code à soi (l'ancien Lun'Ira).
- La veille par thèmes, tech comprise : cadrage, § 7, à trancher à part.
- Le stream, le jeu, l'imitation : hors de cet axe.
