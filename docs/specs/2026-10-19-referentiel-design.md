# lun-docs : conception du référentiel central

> Document de conception, étape 1 de la remise à plat de l'écosystème Lun'.
> Rédigé le 2026-10-19 à partir de la session de cadrage avec CrOliX.
> Les décisions marquées **[CrOliX]** ont été prises par lui ; celles marquées **[choix Claude]**
> sont des propositions de Claude, non contestées mais pas explicitement débattues.

---

## 1. Intention et pourquoi

L'écosystème Lun' (Natsume : une entité entre Jarvis et Neuro-sama) a accumulé du code livré mais
s'éloigne de ce que CrOliX avait en tête. Diagnostic établi pendant le cadrage :

1. **Une doc qui ne fait que grossir.** Chaque observation alimente un ADR, un plan ou un fichier de
   suivi ; rien n'en sort. LunAnima seul porte une constitution, 41 ADR, des paliers et une charte.
2. **Un avancement éclaté entre les dépôts.** Aucune vue d'ensemble ; on perd ce qui a été décidé à
   la base.
3. **Un périmètre qui glisse.** « J'ai fait 1, 2, 3, j'observe x et y, ils passent devant 5 et 6 qui
   concluaient le chantier » : ajout infini, chantiers jamais clos.
4. **Tester dépend du NAS.** Pas d'environnement local autonome ; les tests bout en bout sont reportés
   dans une doc « à faire une fois sur le NAS », ce qui ouvre la porte à la dérive.
5. **Un panel lourd et peu ergonomique**, et une architecture core/satellites où la propriété des
   fonctions est floue (boîte mail présente dans Acedia, dans le panel d'Anima et dans Avaritia ;
   deux agents LLM). Ces deux points relèvent de l'étape 2, mais le référentiel doit permettre de les
   éviter.

**lun-docs** est le remède à 1-4 : un référentiel unique, géré comme un projet de l'écosystème, qui
fixe les normes, la méthode de travail et la configuration de l'agent IA pour tous les projets. En cas
de conflit entre lun-docs et un projet, **lun-docs fait foi** (ou on change lun-docs par une PR).

Inspiration directe : `D:\MyAlfred.ai\my-docs` (dépôt de standards séparé des projets, registre,
gabarits). Références produit retenues pour la suite : **myBrain** (cerveau à fiches sourcées, qualité
du front) et **myLLM** (multi-modèles, connecteurs Google, catalogue unique modèles/tarifs).

## 2. Plan d'ensemble (contexte)

| Étape | Contenu | Statut |
|---|---|---|
| **1. Fondations** | lun-docs : normes, méthode, agent IA, outillage | **ce document** |
| 2. Planification | Besoin, architecture core/satellites, stack, découpage, MVP au 31/12/26, **sans regarder l'existant** | à venir |
| 3. Exécution | Chantier par chantier ; l'ancien code n'est consulté **qu'au début du chantier concerné**, pour être challengé | à venir |

**[CrOliX]** On replanifie de zéro ; on ne jette pas pour autant ce qui marche : l'ancien code est une
source d'inspiration consultée au cas par cas.

## 3. Objectifs, non-objectifs, anti-objectifs

**Objectifs**
- Une seule source pour : la vision, les normes, la méthode, les décisions d'écosystème, la config IA.
- Une méthode de travail qui **clôt** les chantiers (périmètre figé, critères de fin, preuve locale).
- Un agent IA qui colle aux définitions du référentiel, avec un coût maîtrisé (bon modèle au bon
  niveau de tâche, outils déterministes d'abord).
- Un avancement lisible d'un coup d'œil, transverse à tous les dépôts.

**Non-objectifs (ici)**
- Choisir la stack, l'architecture ou les MVP : étape 2. `standards/stack.md` reste un squelette.
- Les clés LLM du **produit** (clé OpenAI du core, tokens API Claude) : étape 2, catalogue façon myLLM.
- Migrer ou modifier les anciens projets.

**Anti-objectifs (échec même si « ça marche »)**
- Un référentiel qui recommence à grossir : des milliers de lignes de standards, de l'historique,
  du suivi d'avancement en Markdown.
- Une doctrine relue en entier à chaque session (contexte gaspillé, dérive).
- Une couche d'orchestration opaque qui retire le contrôle à CrOliX.
- Un agent qui merge, pousse sur `main` ou élargit un chantier de lui-même.

## 4. Contraintes

- Développeur solo. PC Windows 11 (D:\), NAS pour la prod, développement aussi **en déplacement
  (jours de cours) sans accès au NAS**.
- Abonnement **Claude Pro** (quota, pas de facturation au token). Modèles disponibles dans Claude Code :
  Opus 5.5 (défaut), Sonnet 5.5, Haiku 5.5, **Fable 5**.
- Échéance VIP : **31/12/2026** (~10 semaines au 2026-10-19). Le référentiel doit être léger à
  produire : il est le socle, pas le livrable.
- GitHub : organisation `Lun-Ecosystem` pour tous les dépôts de l'écosystème **[CrOliX, 2026-10-19]** ; le compte perso `CrOliX-AltF4` garde le website et les anciens projets, archivés en lecture seule.
- DA imposée : celle du website (`D:\projets\projets perso\website`), aussi présente sur le mobile et
  le desktop.

## 5. Décisions prises

### 5.1 Espace de travail **[CrOliX]**

```
D:\projets\projets perso\
  LunAnima\ LunAcedia\ LunAvaritia\ LunIra\ LunGula\ website\ …   ← anciens projets : référence, lecture seule
  LunEcosystem\                                                    ← tout le nouveau travail
    lun-docs\                                                      ← ce référentiel (dépôt git)
    <core>\ <satellite>\ …                                         ← nouveaux projets, créés à l'étape 2
```

Chaque dossier de `LunEcosystem\` est un dépôt git indépendant **[choix Claude]**.

### 5.2 Contenu de lun-docs **[CrOliX sur le principe, arborescence choix Claude]**

```
lun-docs/
  README.md                carte : quoi fait foi, où trouver quoi, par où commencer
  vision.md                le seul document « nord » (voir 5.3)
  standards/               normes courtes et opposables
    essentiel.md           les règles non négociables, lisibles en 5 minutes
    workflow.md            la méthode de travail (5.5)
    git.md                 branches, commits, PR, merge, release (5.7)
    environnements.md      local / prod (5.6)
    structure-projet.md    arborescence, README, CLAUDE.md, docs/ (5.9)
    qualite.md             barrières automatiques, tests
    securite.md            secrets, accès, données
    design.md              la DA traduite en règles (5.10)
    stack.md               squelette, rempli à l'étape 2
  adr/                     décisions d'écosystème uniquement (5.4)
  registry.yaml            chaque projet : rôle (core | satellite), dépôt, stack, état, contrats
  templates/               squelettes de projet, gabarits de doc, de PR, d'issue
  plugin/                  le plugin Claude Code distribué à chaque projet (5.8)
  community-skills.md      skills communautaires retenus, avec la raison de chaque choix
  docs/specs/              documents de conception du référentiel lui-même
```

Taille : chaque standard tient sur **une à deux pages** **[choix Claude]**. `essentiel.md` est le seul
que l'agent doit connaître en permanence ; les autres sont chargés à la demande (via les skills).

### 5.3 vision.md **[CrOliX]**

Contenu à reprendre tel quel :

- **Ce que c'est** : une entité unique (Natsume), une personnalité et une mémoire, présente sur
  plusieurs surfaces. À la frontière entre Jarvis (Iron Man) et Neuro-sama (Vedal).
- **Les cinq surfaces, toutes dans le VIP :**
  1. **Assistante de travail** : mail (lecture, réponses préparées, pré-tri corbeille / indésirables /
     archive / rangement par expéditeur et urgence), agenda (détection de chevauchements, propositions
     de déplacement), tâches, veille tech, notifications GitHub lues à la source (l'envoi de mails par
     GitHub est désactivé).
  2. **Second cerveau** : mémoire vectorielle organisée comme des fiches Obsidian (cf. myBrain), qui
     range tout ce qui entoure CrOliX et nourrit la personnalité.
  3. **Compagnon desktop / jeu** : vision de l'écran, réaction vocale (TTS), avatar via VTube Studio,
     personnalité dynamique selon la mémoire et les interactions, humeur injectée dans les réponses.
  4. **Mobile** : application dans l'esprit des apps Claude / Gemini, avec les fonctions mail, agenda,
     etc., pour suivre CrOliX en déplacement.
  5. **Contrôle total** : panel desktop complet : couper les services, voir le coût des appels,
     régler les variables en direct, gérer les autorisations Google (Gmail, Agenda, Drive, Tasks…).
     Non négociable : pas de surcoût inutile, pas de perte de contrôle.
- **Critère du VIP** : « utilisable de bout en bout sur une semaine sans point de tension ».
- **Hors VIP** : streaming, apprentissage par imitation (ex-Lun'Gula, test osu!), pipeline de dev
  multi-agents (ex-Lun'Ira).
- **Principe d'architecture** : le core est privé ; les satellites sont des outils autonomes qui
  portent leur propre logique métier et peuvent être câblés au core.
- **Points noirs à ne pas reproduire** : panel lourd et peu ergonomique ; tests dépendants du NAS ;
  front en dessous du niveau visé (référence : myBrain).

### 5.4 Une place unique pour chaque type d'information **[CrOliX]**

| Type | Où | Durée de vie |
|---|---|---|
| **Décision** structurante, coûteuse à défaire | `adr/` (écosystème) ou `docs/decisions/` (projet), **1 page max** | Permanente. Jamais modifiée : **remplacée** par une nouvelle qui la marque « remplacée par ». |
| **Observation, retour, idée** | Issue GitHub étiquetée `inbox` dans le dépôt concerné | Jusqu'au tri |
| **Plan d'un chantier** | Dans l'issue ou la PR du chantier | Le temps du chantier |
| **Avancement** | **Un seul GitHub Projects** pour tous les dépôts ; jalons = MVP | Vivant ; **jamais recopié dans une doc** |
| **Doc produit** | `docs/` du projet | Décrit ce qui **est**, jamais l'historique |

Conséquences : pas de `progress.md`, pas de « paliers » en Markdown, pas d'ADR pour une observation.
Seuil d'un ADR **[choix Claude]** : la décision engage plusieurs chantiers ou serait coûteuse à défaire.

### 5.5 La méthode de travail **[CrOliX]**

Pour toute tâche, du ticket au merge :

1. **Cadrer** (session principale, avec CrOliX) : lire l'issue, reformuler le besoin, écrire les
   **critères de fin**, fixer le **niveau** (5.8.2). Le périmètre est **figé**.
2. **Planifier et challenger** : 2-3 approches, critique, recommandation ; un **contradicteur
   indépendant** attaque le plan ; CrOliX valide. Aucun code avant le feu vert.
3. **Exécuter** : branche dédiée, sous-agents tâche par tâche (tests d'abord quand c'est pertinent),
   contrôle par l'agent principal entre chaque tâche.
4. **Valider** : barrières automatiques (format, lint, typage, tests) en local puis en CI ; revue par
   un agent relecteur ; **preuve d'usage bout en bout en local** par CrOliX.
5. **Livrer** : PR (5.7), merge par CrOliX, release.

**Règle anti-ajout infini :**
- Une observation faite pendant un chantier part dans `inbox`. Elle n'entre dans le chantier **que si
  elle empêche d'atteindre ses critères de fin**.
- Le chantier se ferme quand ses critères sont remplis **et prouvés en local**.
- Tri de l'inbox **une fois par semaine**, à heure fixe, jamais au fil de l'eau.

### 5.6 Environnements **[CrOliX]**

Deux environnements, pas trois.

| Env | Où | Rôle |
|---|---|---|
| **Local** | Le PC ou un portable, **sans aucune dépendance au NAS** | Développer et prouver chaque chantier de bout en bout |
| **Prod** | Le NAS | Usage quotidien, **jamais pour tester** |

- Local : toute la pile démarre en une commande. Google en local = **un compte Google de test dédié**
  **[CrOliX]** ; le vrai compte n'est utilisé qu'en prod.
- Prod : merge → release → image versionnée → le NAS la récupère → contrôle de santé automatique →
  retour à l'image précédente en une commande si besoin.
- Interdit : toute doc du type « tests à faire sur le NAS ».

### 5.7 Git, PR, release **[CrOliX sur les principes]**

- `main` protégée ; jamais de push direct ; **seul CrOliX merge**, jamais l'agent.
- Une branche par chantier ou par tâche.
- Commits en Conventional Commits (`feat:`, `fix:`, …), vérifiés par un hook.
- PR petites ; gabarit reprenant les critères de fin et les preuves (sortie des tests, capture,
  commande de démo) ; fusion en squash.
- La CI doit passer pour merger.
- **Release [CrOliX, 2026-10-19]** : un chantier ne vaut pas une release. On regroupe logiquement
  plusieurs chantiers et on ne release qu'après validation post-tests de l'ensemble. La release est
  déclenchée par un bump de version (PR mergée par CrOliX, puis tag posé par CrOliX seul) ; pas de
  bot de PR de release (retour d'expérience LunAnima : 60 PR de release). Notes générées depuis les
  commits par la CI.
- Revue automatique optionnelle d'une PR par l'API Claude dans la CI (avec les tokens API de CrOliX) :
  à évaluer lors de la mise en place de la CI **[choix Claude]**.

### 5.8 L'agent IA

#### 5.8.1 Principe et outillage **[CrOliX]**

- **Claude Code natif** (sous-agents, skills, hooks, commandes), **pas** de couche d'orchestration
  tierce.
  - **Ruflo (ex-Claude Flow) écarté** : 300+ outils MCP et essaims d'agents qui gonflent le contexte et
    vident le quota Pro ; une partie des fonctions signalées comme non implémentées par un audit ;
    orchestration opaque, contraire à l'exigence de contrôle. Déjà essayé (`LunArchive/.swarm`).
  - **Universal CLAUDE.md écarté** : une seule source, gain annoncé sur la sortie et non sur le
    contexte, sans méthode vérifiable.
- **Outils sans IA d'abord** : tout ce qu'un outil fait de façon fiable (format, lint, typage, tests,
  changelog, release) ne passe jamais par un LLM.
- Leviers de contexte appliqués par construction : CLAUDE.md courts, skills chargés à la demande,
  règles par dossier, sous-agents à contexte isolé qui ne renvoient qu'un résumé.
- **Distribution : un plugin Claude Code** (`lun-docs/plugin/`) installé dans chaque projet, plutôt
  que des copies de `.claude/` qui divergent **[choix Claude, accepté]**.

#### 5.8.2 Niveaux de tâche et modèles **[CrOliX]**

Le niveau est fixé **au cadrage**, sous forme d'étiquette sur l'issue (`niveau:trivial`,
`niveau:standard`, `niveau:critique`, `niveau:exceptionnel`). C'est elle qui choisit le modèle du dev.

| Niveau | Exemples | Modèle du dev |
|---|---|---|
| Trivial | Renommage, config, doc, correction évidente | Haiku 5.5 |
| Standard | Fonctionnalité qui suit un modèle existant, avec tests | Sonnet 5.5 |
| Critique | Contrat core/satellites, sécurité, OAuth Google, mémoire, refonte transverse, bug difficile | Opus 5.5, effort élevé |
| Exceptionnel | Opus a échoué, ou décision d'architecture pour tout l'écosystème | Fable 5, **sur demande explicite de CrOliX uniquement** |

Rôles fixes :

| Agent | Modèle |
|---|---|
| Session principale (cadrage, plan, contrôle) | Opus 5.5 |
| Contradicteur de plan | Opus 5.5 (autre fournisseur envisageable plus tard) |
| Explorateur (lecture seule) | Haiku 5.5 |
| Relecteur de code | Sonnet 5.5 |

Mesure de référence : le **coût par tâche terminée**, pas par appel.

#### 5.8.3 Skills

**Communautaires** (« pour la méthode ») **[CrOliX sur le principe]** :
- **superpowers** (installé) : cadrage, plan, exécution par sous-agents, TDD, revue, vérification
  avant de déclarer « fini », branches isolées. C'est le moteur de la méthode 5.5.
- **frontend-design** (installé) : qualité de l'interface.
- **skill-creator** (Anthropic) : écrire et **tester** nos skills.
- À évaluer : une source de documentation à jour des bibliothèques (type Context7).

**Sur mesure** (« pour ce qui est à nous »), dans `plugin/skills/` :

| Skill | Rôle |
|---|---|
| `lun-ecosysteme` | Architecture core/satellites, contrat de branchement, qui possède quoi (évite les fonctions en double) |
| `lun-design` | La DA en règles et tokens, pour desktop et mobile |
| `lun-chantier` | Ouvrir un chantier (périmètre figé, critères de fin, niveau) et le clore (preuve locale), relié à GitHub Projects |
| `lun-inbox` | Le tri hebdomadaire des observations |
| `lun-livrer` | Commits, PR, release selon `standards/git.md` |

Les skills sur mesure **s'appuient** sur superpowers au lieu de le réécrire : ils apportent le contexte
Lun', pas une méthode concurrente.

#### 5.8.4 Coûts **[CrOliX]**

- Aucun achat d'abonnement ou d'API supplémentaire maintenant.
- **Deux semaines de mesure** de la consommation dès la mise en service, puis décision chiffrée
  (passer à Max, ajouter une API, ajuster la grille de niveaux).
- **Caveman** : option à tester pendant la mesure, uniquement sur les rapports des sous-agents et
  la compression des fichiers mémoire, **jamais** sur ce qui est destiné à CrOliX.

### 5.9 Structure de chaque projet **[choix Claude, accepté]**

- `README.md` : ce que fait le projet ; démarrage local en une commande.
- `CLAUDE.md` : **~100 lignes max** ; renvoie à lun-docs et au plugin ; seulement le spécifique projet.
- `docs/` : ce qui existe (utilisateur, technique, exploitation) ; mis à jour dans le même commit que
  le code ; `docs/decisions/` pour les ADR propres au projet.
- Langues : code, commits, noms techniques en **anglais** ; docs et échanges en **français**.

### 5.10 Design **[CrOliX]**

La DA du website est la contrainte visuelle de toutes les surfaces. Sources à traduire dans
`standards/design.md` :
- `website/src/styles/global.css` : tokens (`--ivoire #F0EBE1`, `--papier #E8E2D6`, `--encre #0D0B09`,
  `--encre-2 #1A1612`, `--lavis #8A9BAE`, `--rouge #7A1818`, `--lune #C8C0B0`), polices Cormorant
  Garamond et Inter.
- `website/README.md` § « Charte de ton » (voix, noms « Lun'Xxx », pas de tiret cadratin).
- `website/src/data/projects.ts` : couleurs « monde » par projet.

On garde l'identité, on refait l'ergonomie (référence de qualité : le front de myBrain).

### 5.11 Précisions issues de la relecture **[choix Claude]**

- **Installation du plugin** : lun-docs est aussi une **marketplace Claude Code** hébergée sur GitHub ;
  les projets installent le plugin depuis le dépôt GitHub (pas depuis un chemin local), ce qui marche
  sur le PC, sur un portable en déplacement et en CI.
- **Standards à l'exécution** : `standards/` reste la source unique. Une étape de build de lun-docs
  copie les standards nécessaires dans le plugin à chaque release ; les skills les lisent depuis le
  plugin installé. Pas de copie manuelle, pas de lecture d'un chemin `D:\`.
- **Respect des niveaux** : un agent de dev par modèle (`dev-haiku`, `dev-sonnet`, `dev-opus`,
  `dev-fable`), modèle fixé dans sa définition. `lun-chantier` choisit l'agent d'après l'étiquette
  de l'issue ; `dev-fable` n'est jamais lancé sans demande explicite de CrOliX dans la conversation.
  Convention outillée, pas de blocage par hook. Vérification de l'essai à blanc : le compte rendu
  montre l'agent attendu pour chaque niveau.
- **« Seul CrOliX merge »** : l'agent agit avec l'identité GitHub de CrOliX, donc GitHub ne peut pas
  faire la différence. La règle est appliquée par les **permissions Claude Code** du plugin (refus de
  `gh pr merge`, de `git push` vers `main` et des `--force`), en plus de la protection de `main`.
- **Visibilité des dépôts [CrOliX]** : tout est **public** (lun-docs compris), sauf le **core**,
  **privé** (brique personnelle, pas conçue comme open source). Pas de GitHub Pro.
  - Dépôts publics : `main` protégée par un ruleset GitHub (PR obligatoire, CI verte requise).
  - Core privé : la protection de `main` n'est pas disponible sans Pro. Elle est remplacée par les
    permissions Claude Code ci-dessus **et** un hook git `pre-push` local, installé par le gabarit du
    core, qui refuse tout push vers `main`.
  - lun-docs étant public : aucun secret, aucune adresse interne (IP du NAS, domaines privés, Tailscale)
    dans `registry.yaml` ni ailleurs ; ces valeurs restent dans les `.env` non versionnés des projets.
- **CI** : GitHub Actions (runners hébergés) ; registre d'images : GHCR. L'outillage de déploiement
  sur le NAS n'est **pas** construit à l'étape 1 : seuls les gabarits le décrivent ; il sera construit
  avec le premier projet de l'étape 2.
- **Essai à blanc** : sur le quota Pro uniquement. L'évaluation de la revue de PR par l'API Claude est
  reportée à la mise en place de la CI du premier projet.
- **vision.md** : peut être rédigé en prose, **sans rien ajouter** au contenu de 5.3.
- **Lecture des anciens projets** : « lecture seule » interdit de les modifier, pas de les lire ; lire
  le website pour écrire `design.md` est prévu.

## 6. Laissé au constructeur

- La rédaction de chaque standard dans les limites ci-dessus.
- Le schéma exact de `registry.yaml` (les champs listés en 5.2 sont le minimum).
- La mécanique du plugin : forme exacte des agents par niveau (un agent par modèle ou un agent
  paramétré), hooks retenus, mode d'installation dans les projets.
- La configuration du GitHub Projects (champs, vues) à partir de 5.4 et 5.8.2.
- L'outil de release et de changelog, l'outil de vérification des commits.
- L'outil de mesure de consommation pour les deux semaines de mesure.
- Le contenu des templates de projet, tant qu'ils respectent 5.6, 5.7 et 5.9 (le contenu technique
  dépendra de la stack choisie à l'étape 2).

## 7. Critères de fin de l'étape 1

- `LunEcosystem/lun-docs` existe, est un dépôt git poussé sur GitHub, `main` protégée.
- `vision.md`, `README.md` et tous les standards de 5.2 sont écrits (sauf `stack.md`, squelette).
- Le plugin est installable dans un projet vide et y apporte les agents, skills et hooks décrits.
- Le GitHub Projects existe avec les étiquettes `inbox` et `niveau:*`.
- Un essai à blanc sur un projet jetable passe la méthode 5.5 de bout en bout (cadrage → PR mergée
  par CrOliX) avec les bons modèles par niveau.
- La mesure de consommation est en place.
