# Écosystème Lun' : architecture et MVP au 31/12/2026

> Spec de l'étape 2 (planification de zéro), rédigée le 2026-10-19 à l'issue du cadrage avec CrOliX.
> Elle fait autorité pour le découpage en chantiers. Ce qui est marqué **[choix Claude]** est une
> décision prise par l'agent pendant la rédaction, à contester librement ; tout le reste a été dit
> ou validé par CrOliX.

## 1. Intention

Lun' est l'assistante personnelle de CrOliX, incarnée par Natsume : « entre Jarvis et Neuro-sama ».
Une assistante de travail qui tient la journée (mails, agenda, tâches, veille, GitHub), un second
cerveau qui apprend de ce qui se passe et de ce qui se dit, et une présence : une personnalité, une
voix, un avatar, une compagnie en duo comique le soir.

La refonte part de zéro parce que l'ancien écosystème était en tension : panel lourd et lancé à coups
de fenêtres cmd, services externes gérés à côté, logique dupliquée entre projets, découpage des
dépôts par écran plutôt que par métier, releases sans environnement local. L'objectif est un
ensemble cohérent, proche d'un vrai produit.

## 2. Le besoin : une journée type

**Le matin.** Au réveil, CrOliX ouvre le mobile (ou le panel le week-end) et trouve le travail de la
nuit fait :

- mails triés, filtrés, étiquetés ;
- ce qui s'est passé et dit la veille transformé en fiches mémoire, nouvelles ou corrigées ; une
  contradiction n'est jamais tranchée seule, elle devient une question à valider ;
- tâches et agenda revus, rappels de l'imminent classés par urgence ;
- la journée préparée selon ce qui est en cours.

**La journée au travail.** Le mobile seul, en mode sobre : un fil de discussion comme Claude,
ChatGPT ou Gemini, la boîte, les validations, la gestion des connecteurs Google. Ni voix ni avatar.

**Le soir.** CrOliX lance le panel desktop et parle à Lun' de vive voix. Deux rôles :

1. **la compagnie** : un duo comique, réactif à ce qu'il dit et à ce qu'elle comprend ;
2. **la veille** : elle reste en alerte et remonte les événements de l'écosystème, filtrés par le
   **mode** actif (voir §7.3).

## 3. Principes d'architecture

1. **Un satellite est garant de sa logique métier.** C'est lui qui opère (trie, agit, planifie) et
   il fonctionne seul, en autonome, sans Lun'. Natsume s'y branche : elle l'interroge (GET), lui
   demande d'agir (POST), écoute ses événements, et transmet le résultat par la voix, le desktop ou
   le mobile. **Le core ne réimplémente jamais ce que fait un satellite**, et ne recopie pas ses
   modèles de données : il relaie.
2. **Une seule source de vérité par donnée.** Chaque fonctionnalité vit à un seul endroit (§5) et
   peut s'afficher à plusieurs.
3. **Un dépôt par métier, jamais par écran.** Un satellite porte dans son dépôt sa logique, son API
   et son interface autonome (web, installable sur mobile). Pas de dépôt « version mobile de X ».
4. **Les écrans n'ont pas de logique métier.** Le panel desktop et l'app mobile affichent ce que le
   core leur donne, et lui transmettent les gestes de l'utilisateur.
5. **Un contrat commun pour tous les satellites** (§6) : le core et le panel pilotent n'importe
   quel satellite sans connaître son métier.
6. **Le modèle juge, le code garantit.** Partout où un LLM produit du contenu (tri, mémoire,
   briefing), la tenue de livre est du code déterministe et testé.

Test de rangement d'une fonctionnalité :

| Où | Ce qui y vit | Le test |
|---|---|---|
| **Core** (privé) | Personnalité, cerveau, conversation, modes, agrégation du contrôle, API des écrans | Est-ce *Lun'* elle-même ? |
| **Satellite** (public) | Un outil métier complet, avec ses données et sa logique | Serait-il utile à quelqu'un sans Lun' ? |
| **Écrans** (apps) | Affichage et saisie | Affiche-t-il ce que le core lui donne ? |
| **Capacités PC** (dans l'app desktop) | Ce qui a besoin de la machine : micro, haut-parleurs, RVC, VTube Studio, plus tard écran et jeux | Faut-il le PC pour le faire ? |

## 4. Carte de l'écosystème

### 4.1 Les briques

| Brique | Rôle | Visibilité | Stack | Origine |
|---|---|---|---|---|
| **Core** | Natsume : personnalité, cerveau, conversation, nuit et matin, modes, agrégation du contrôle, API unique des apps | privé | TypeScript / Node, SQLite | remplace la partie cerveau de LunAnima |
| **Lun'Acedia** | Satellite « ta journée » : GitHub, Gmail, Agenda, Tâches, RSS, Home Assistant ; actions à la source ; agent de tri ; tableau de bord web autonome installable sur mobile (PWA) ; majordome conversationnel en autonome (hors MVP) | public | TypeScript / Node, SQLite, front Svelte | LunAcedia, à challenger au début de son chantier |
| **Apps Lun'** | Le front unique Svelte, empaqueté deux fois : **desktop** (Tauri 2, avec les capacités PC) et **mobile** (Capacitor, Android) | public **[choix Claude, déduit de la règle « tout public sauf le core »]** | Svelte 5 + Vite, Tauri 2, Capacitor | remplace le panel de LunAnima et LunAvaritia |
| **Website** | Vitrine FR/EN de l'écosystème | public | Astro | website, intégré à l'écosystème |
| **lun-docs** | Référentiel, normes, plugin `lun` | public | — | existe |

Les noms des nouveaux dépôts (core, apps) sont provisoires ; CrOliX les fixe à leur création.
Tous vivent dans l'organisation `Lun-Ecosystem`.

### 4.2 Verdict sur l'ancien écosystème

| Ancien projet | Verdict |
|---|---|
| LunAnima | **Scindé** : le cerveau va au core, le panel et l'agent desktop vont aux apps (capacités PC). Les liens jeux attendent le mode jeu. |
| LunAcedia | **Gardé** comme satellite. D'après son README, il est déjà en TypeScript / Node, avec une API REST + WebSocket, un tableau de bord, un appairage par jeton et une image GHCR. Reprendre ou réécrire se décide au début du chantier J1. **Aucune migration de données** : les autorisations Google sont redonnées, l'historique de tri n'est pas repris **[choix Claude]**. |
| LunAvaritia | **Remplacé** par l'app mobile Lun' (Capacitor). Acedia n'a plus d'app native : en autonome, son tableau de bord web suffit. Le code Flutter n'est pas repris. |
| website | **Gardé**, branché sur le registre (§10, chantier W). |
| LunArchive | **Archivé** : ancien site, remplacé par le website **[choix Claude, à confirmer]**. |
| LunIra, LunGula | Satellites sains, **hors MVP**, inchangés. |

Les anciens dépôts passent dans l'organisation et sont archivés avec leur historique, une fois leur
remplaçant en service.

## 5. Où vit, où s'affiche chaque fonctionnalité

| Fonctionnalité | Source de vérité | Affichée sur |
|---|---|---|
| Boîte (mails, notifications GitHub, tâches, agenda) et gestes à la source | Acedia | mobile, desktop, tableau de bord d'Acedia ; voix (résumé) |
| Tri, étiquetage, filtrage des mails | Acedia (son agent, sa clé LLM) | idem |
| Autorisations Google (jetons, scopes) | Acedia | panel et mobile (réglages), via le contrat |
| Conversation avec Natsume | Core | mobile (fil), desktop (voix + fil) |
| Cerveau (fiches, questions, dépôts de brouillons) | Core | mobile, desktop |
| Briefing du matin et rappels | Core (assemble Acedia + cerveau) | mobile, desktop ; voix |
| Personnalité, humeur, relation | Core | desktop (voix, avatar), mobile (ton du fil) |
| Modes (focus, silence, assistante ; streameuse plus tard) | Core | mobile, desktop |
| Coûts, états, pause / reprise | Chaque satellite et le core ; agrégés par le core | panel, mobile |
| Voix : captation, synthèse, RVC | Capacités PC (app desktop) | desktop |
| Avatar 2D (VTube Studio) | Capacités PC (app desktop), piloté par le core | desktop |

Le core expose aux apps une **API unique**. Pour les données d'un satellite, il relaie la réponse
du satellite sans la remodeler.

## 6. Le contrat satellite

Chaque satellite expose la même petite interface, en plus de son API métier. Elle devient un
standard de lun-docs (`standards/contrat-satellite.md`) :

- **santé et état** : en marche, en pause, dégradé, avec la raison ;
- **coûts** : dépense LLM et API sur une période, dans un format commun ;
- **pause et reprise** : couper toute action automatique sans arrêter le service ;
- **flux d'événements** : ce qui se passe, avec une **importance** (que le core filtre selon le mode) ;
- **actions** : la liste de ce qu'on peut lui demander, invocables par POST.

L'authentification entre core et satellite, et entre apps et core, passe par des jetons
d'appairage, jamais par un secret serveur saisi à la main. Le format exact (REST + WebSocket ou SSE,
schéma des types) est laissé au constructeur ; un satellite publie les types de son contrat pour
que le core et les apps les consomment.

**Le contrat des écrans** (l'API du core vue par les apps) est décrit dans un paquet de types
**public**, publié depuis le dépôt des apps ; le core privé l'implémente. Ce contrat ne contient ni
secret ni adresse, et la CI des apps publiques n'a jamais besoin d'accéder au dépôt privé
**[choix Claude]**.

**Réseau** : en prod, le mobile et le desktop joignent le NAS par un réseau privé maillé
(Tailscale, comme aujourd'hui). Le core et les satellites **ne sont jamais exposés sur internet**.
Les notifications push partent du core vers le service de push (FCM), en sortant uniquement. En
local, tout tourne sur le poste **[choix Claude]**.

## 7. Le core

### 7.1 Le cerveau

Inspiré de myBrain, adapté à un seul utilisateur et à une compagne.

- **Un wiki Markdown** au format Obsidian : une fiche par sujet, chaque fait avec une date, une
  synthèse en une phrase et sa provenance (une conversation, un mail via Acedia, un dépôt). Jamais
  de contenu brut recopié.
- **Classement personnel** : personnes, projets, goûts, événements, idées, plus un espace **« nous »**
  pour la mémoire de la relation (ce qu'elle pense, les souvenirs communs, tes habitudes)
  **[choix Claude]**. Le détail de l'arborescence est laissé au constructeur.
- **Le modèle juge le contenu, le code garantit la forme** : index, liens, déduplication, journal,
  vérification de structure sont du code testé.
- **La nuit** relit les conversations de la veille et ce qu'Acedia a vu (via son API, jamais
  Gmail en direct) :
  - ce qui **se déduit** de faits sourcés s'écrit seul, tracé et réversible ;
  - ce qui **se discute** devient une question, de quatre sortes seulement : contradiction
    (« lequel est juste ? »), dilemme, manque, doublon ;
  - une fiche ne naît qu'à la **deuxième source** ;
  - **5 questions au plus** par nuit ; une question tranchée ne revient jamais.
- **La réponse fait le geste** : le fait démenti est barré et daté, jamais effacé.
- **Contexte chaud** (environ 500 mots, lu à chaque échange) et **un seul point d'entrée** pour
  aller chercher le contexte, borné en taille : la réponse vocale doit rester rapide.
- **Une intention**, dite par CrOliX avec ses mots, qui oriente le tri.
- **Dépôts de brouillons** : CrOliX dépose des notes brutes (un cours, un sujet pointu), Natsume
  les met au format des fiches et les relie, CrOliX valide avant l'entrée dans le cerveau.
- **Édition uniquement depuis les apps.** Les fichiers restent lisibles dans Obsidian, sans que ce
  soit un parcours prévu.
- Le cerveau ne tient ni l'agenda ni les tâches : Acedia les possède.

### 7.2 Le matin

Le core assemble le briefing : ce qu'Acedia a trié, ce qui arrive (agenda, tâches, par urgence),
ce que le cerveau a retenu, les questions du jour. Il est prêt au réveil, sur le mobile et le panel.

### 7.3 Les modes

Chaque événement transmis (alerte d'un satellite, rappel, question du cerveau) porte une importance.
Le mode actif décide s'il passe tout de suite, attend ou est coupé :

- **assistante** : comportement par défaut ;
- **focus** : seuls les événements urgents passent, le reste attend la fin du focus ;
- **silence** : rien ne passe à voix haute ;
- **streameuse** : hors MVP, avec le mode jeu.

Un satellite continue d'opérer quel que soit le mode : le core ne fait que retenir ce qu'il
transmet. Deux événements ne se chevauchent jamais : une file unique dans le core.

### 7.4 La présence

- **Personnalité** : un ton, des humeurs, une mémoire de la relation, du désaccord maîtrisé.
- **Voix** : CrOliX parle, Natsume répond à voix haute (synthèse + RVC). Captation, transcription,
  synthèse et RVC se font côté PC (fournisseurs cloud ou GPU local) ; **seul du texte transite
  vers le core**, qui décide quoi dire. Cible : **moins de 2 secondes** entre la fin de ta phrase
  et le premier mot entendu **[choix Claude]**.
- **Avatar 2D** : VTube Studio piloté depuis le core via les capacités PC. Les modèles sont
  génériques, sans fichiers d'expressions : au MVP, la vie de l'avatar passe uniquement par ses
  **paramètres** (clignement, respiration, synchro labiale, boucle d'animation au repos).
- **Ce qui existe** : un modèle de voix RVC (à récupérer sur l'autre poste) ; l'intégration RVC de
  LunAnima sert de référence de code au chantier voix. La personnalité est **repensée de zéro**
  dans un chantier dédié, technique comme écriture : la référence est la façon dont le **website**
  présente Natsume, pas l'implémentation ni les textes de LunAnima. Le cerveau **démarre à
  blanc**, sans import de l'ancienne mémoire **[choix Claude]**.

## 8. Le contrôle

- **Le core tourne en continu sur le NAS en prod.** On ne l'éteint pas : la nuit, le matin et le
  mobile au travail en dépendent.
- **On coupe des capacités, pas le core** : chaque satellite (pause via le contrat), chaque
  connecteur, chaque fonction coûteuse, et un **interrupteur général** « plus aucune action
  automatique ».
- **Coûts** : chaque brique déclare sa dépense via le contrat ; le panel et le mobile affichent le
  total et le détail.
- **Budget** : deux clés, OpenAI et Anthropic, en crédits prépayés (15 $, alerte à 5 $, sans
  recharge automatique). Le plafond dur est donc tenu par les fournisseurs. Conséquences :
  - les tâches de fond (tri de nuit, recoupement du cerveau) utilisent les petits modèles ; les
    modèles plus capables sont réservés à la conversation, avec des plafonds réglables ;
  - le core prévient avant le seuil d'alerte ;
  - **crédit épuisé = dégradation propre** : rien ne plante, Lun' le dit, Acedia continue de
    servir la boîte sans tri, et tout reprend seul quand le crédit revient.
- **Autorisations Google** : gérées par Acedia, affichées et réglables depuis les apps.
- **App desktop = une vraie application** : elle démarre avec Windows (réglable), vit dans la zone de
  notification, lance et surveille elle-même ses services locaux (RVC…) **sans aucune fenêtre
  cmd**, affiche leur état et se met à jour seule.

## 9. Stack

| Couche | Choix | Pourquoi |
|---|---|---|
| Core, satellites | TypeScript sur Node ≥ 22 | travail surtout réseau ; SDK officiels en TS ; une seule langue côté serveur |
| Stockage | SQLite | un utilisateur, une instance ; plus de JSON comme stockage |
| Cerveau | fichiers Markdown + index SQLite | lisible, versionnable ; recherche sémantique laissée au constructeur |
| Front (panel, mobile, tableau de bord d'Acedia) | Svelte 5 + Vite, tokens de `standards/design.md` | même stack que myBrain ; un seul front pour desktop et mobile |
| Desktop | Tauri 2 | léger à côté d'un jeu ; services en arrière-plan sans console ; zone de notification, démarrage, mises à jour (précédent : myLauncher) |
| Mobile | Capacitor (Android) | même front que le desktop ; notifications push (précédent : myLLM) |
| Website | Astro | existe |
| Python | seulement pour les services externes qui l'imposent (RVC) | — |
| Prod | UGREEN NASync DXP2800 (x86-64, Intel N100), SSD 250 Go (500 Go prévu), disque de 4 To prévu | images Docker **amd64 seulement** ; rien de lourd en local sur le NAS (recherche sémantique par API ou modèle très léger) |

Ces choix remplissent `standards/stack.md` et donnent lieu à un ADR. Le framework HTTP, la
bibliothèque de tests du front et les fournisseurs LLM, STT et TTS sont laissés au constructeur,
dans le respect de `standards/qualite.md`.

## 10. MVP au 31/12/2026

### 10.1 Périmètre

**Dedans**, par priorité :

1. **L'assistante au quotidien** : tri de nuit, briefing du matin, rappels par urgence, cerveau
   (nuit, questions, dépôts), boîte et gestes à la source, fil de discussion sur mobile.
2. **Le contrôle** : pause par satellite, interrupteur général, coûts, autorisations Google, modes
   assistante, focus et silence ; app desktop propre (§8).
3. **Les débuts de la présence** : personnalité, voix (parler et entendre, avec RVC), avatar 2D
   dans VTube Studio.

**Dehors** : le mode jeu (réactions aux jeux, lien osu!, posture streameuse), la vision de l'écran,
iOS, LunIra et LunGula, le majordome conversationnel autonome d'Acedia (utile seulement sans Lun',
il viendra plus tard).

### 10.2 Critère de réussite

Le VIP est atteint quand Lun' est **utilisable de bout en bout sur une semaine complète, sans point
de tension** : chaque matin le briefing est là, la journée se suit depuis le mobile, le soir le panel
démarre sans fenêtre cmd et répond à la voix, et rien n'a demandé d'intervention technique.

### 10.3 Découpage en chantiers et jalons [choix Claude, ordre à valider]

Dix semaines. Chaque chantier suit la méthode de lun-docs (issue, niveau, plan challengé, preuves
locales). Les jalons deviennent les valeurs du champ « Jalon » du Projects.

| Jalon | Chantiers | Fin visée |
|---|---|---|
| **J0 Socle** | `standards/stack.md` + ADR ; `standards/contrat-satellite.md` ; registre étendu (rôles `app` et `vitrine`) ; création des dépôts core et apps depuis le gabarit ; chantier **W** : le website lit `registry.yaml` au build | 01/11 |
| **J1 Acedia** | Acedia conforme au contrat, dans l'organisation, tableau de bord installable sur mobile, prouvé en local avec le compte Google de test | 15/11 |
| **J2 Core v1** | Conversation ; personnalité (chantier dédié, cadré avec CrOliX) ; cerveau v1 (wiki, contexte chaud, point d'entrée du contexte) ; branchement à Acedia ; API des apps | 29/11 |
| **J3 Apps v1** | Front Svelte commun ; mobile (fil, boîte, validations, réglages) ; desktop (panel, zone de notification, services surveillés) | 13/12 |
| **J4 Nuit, voix, contrôle** | Cycle de nuit et briefing ; voix et RVC ; VTube Studio ; modes ; coûts et pause agrégés | 22/12 |
| **J5 Rodage** | Une semaine d'usage réel en prod, corrections ; releases groupées ; anciens dépôts archivés | 31/12 |

**Ligne de coupe si le calendrier glisse** : l'avatar part d'abord, puis RVC (voix de synthèse
seule), puis les dépôts de brouillons. L'assistante au quotidien et le contrôle ne sont jamais
coupés.

## 11. Non-buts et anti-buts

**Non-buts** : multi-utilisateur, iOS, mode jeu et vision d'écran avant 2027, édition du cerveau
dans Obsidian comme parcours prévu.

**Anti-buts**, ce qui serait un échec même si tout marche :

- le core qui refait le travail d'un satellite, ou deux dépôts pour un même métier ;
- une fenêtre cmd, ou un service à lancer à la main ;
- deux notifications ou deux prises de parole qui se chevauchent ;
- une mémoire qui se réécrit en silence, ou un matin rempli de questions auxquelles on répond
  toujours oui ;
- une fonctionnalité testée pour la première fois sur le NAS ;
- une release par chantier, ou un bot qui accumule les PR de release.

## 12. Laissé au constructeur

Le framework HTTP, le transport des événements, le format des types partagés, les fournisseurs LLM,
STT et TTS, la recherche sémantique du cerveau, l'arborescence détaillée du wiki, la façon de
packager les capacités PC dans Tauri, la stratégie de notifications push, les noms définitifs des
écrans. Chaque choix structurant donne un ADR.
