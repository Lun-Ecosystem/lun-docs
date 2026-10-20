# Lun'Anima, palier 1 : un core vivant

> Date : 2026-10-20. Cadré avec CrOliX. Découle de la spec de l'écosystème
> (`2026-10-19-ecosysteme-design.md`, §6 à §8 et jalon J2) et du standard `contrat-satellite.md`.
> Ce qui est marqué **[choix Claude]** est une décision de l'agent, à contester librement ; le reste
> a été dit ou validé par CrOliX.

## 1. Intention

Premier palier de Lun'Anima. CrOliX veut que les dépôts avancent **en parallèle, par paliers**,
plutôt qu'un jalon entier sur un seul dépôt : J2 (core v1) est donc découpé, et ce palier en est la
plus petite tranche qui rend le core **vivant** :

- un serveur `core/` qui tourne en local, avec sa base et l'appairage de ses clients ;
- le branchement à Lun'Acedia par le contrat satellite ;
- une conversation minimale avec Natsume, déjà rangée comme elle le sera pour de bon.

La personnalité n'en fait **pas** partie : elle a son propre chantier, cadré avec CrOliX (spec
écosystème §7.4). Ce palier utilise un prompt système neutre et provisoire.

## 2. Ce que CrOliX a décidé

### 2.1 La conversation : un fil principal, des sujets, une seule mémoire

L'ancien écosystème avait deux modèles : un fil unique archivé par jour (LunAnima) et des sessions
séparées à la Claude ou ChatGPT (l'app mobile). Aucun n'est repris tel quel. Le modèle retenu sépare
**la mémoire** du **rangement** :

- **La mémoire ne dépend pas des fils.** Tout ce qui est dit, sur toute surface et dans tout fil,
  est enregistré au même endroit, avec sa date, sa surface et son fil. Ce qui est dit sur le mobile
  compte autant que ce qui est dit sur le desktop : c'est le cerveau (la nuit) qui unifie, pas le
  fil.
- **Un fil principal**, unique et continu, partagé par toutes les surfaces : c'est la relation. On
  commence une phrase sur le mobile, on continue le soir à la voix sur le desktop. Il s'affiche
  découpé par jour.
- **Des sujets**, ouverts à la demande, pour travailler sur une chose précise sans noyer le fil
  principal (un cours, un bug). Ils complètent le fil, ils ne le remplacent pas.
- **La continuité entre les fils** : quand Natsume répond, elle voit son contexte chaud, les
  derniers échanges du fil courant, et un résumé de ce qui s'est dit ailleurs dans la journée.
  Le contexte chaud et ce résumé dépendent du cerveau : **ils arrivent avec lui, pas dans ce
  palier**. Ce palier pose le modèle de données qui les permettra.

Écartés : le fil unique seul (une heure de travail noie la soirée) et les sessions seules (Natsume
devient un outil qu'on ouvre et ferme, contraire à l'idée de présence).

### 2.2 Le fournisseur : OpenAI au départ

La conversation passe par **OpenAI**, avec la clé que CrOliX utilise déjà (l'ancien LunAnima
dialoguait avec `gpt-4o-mini`). Le modèle est réglé par variable d'environnement. Plus tard viendra
un paramétrage « quel modèle pour quel module », pour adapter et alterner entre fournisseurs : le
code passe donc par une **fine interface de fournisseur**, avec OpenAI comme seule implémentation.
Pas d'Anthropic dans ce palier.

### 2.3 La journée commence à 5 h, heure de Paris

Une « journée » de Natsume va de **5 h à 5 h, heure de Paris** (`Europe/Paris`, heure d'été
comprise). Une soirée qui déborde après minuit reste dans sa journée. Cette coupure sert au
découpage du fil principal à l'écran, au plafond journalier de dépense, et plus tard à « la veille »
que relit la nuit. Elle est **fixe dans le code** pour l'instant, en un seul endroit ; elle deviendra
réglable si l'usage le demande. Les dates restent enregistrées en UTC (contrat) : seule la coupure
dépend du fuseau.

## 3. Le périmètre

### 3.1 Le serveur

- `core/` devient un serveur HTTP en TypeScript sur Node, base SQLite, sur le modèle de
  Lun'Acedia **[choix Claude]** : Hono, `node:sqlite`, Zod pour valider les corps, Vitest. Même
  outillage, mêmes habitudes d'un dépôt à l'autre.
- Tout tourne en local sur le poste, sans NAS. Configuration par `.env` (`.env.example` versionné,
  sans aucune valeur réelle).
- Une horloge injectable et un `fetch` injectable partout où le temps ou le réseau comptent, pour
  des tests sans réseau (comme Acedia).

### 3.2 L'appairage des clients du core

Les apps (mobile, desktop) et tout outil local parlent au core avec un **jeton d'appairage**, jamais
un secret saisi à la main (spec écosystème §6) :

- un code à usage unique, valable 10 minutes, échangé contre un jeton propre au client, révocable ;
- même mécanique que le contrat satellite, côté core cette fois ;
- comme il n'existe pas encore d'app pour afficher le code, le core l'**affiche dans sa console**
  à la demande, par une commande locale **[choix Claude]** (par exemple `npm run pair-code`).

### 3.3 Le branchement à Lun'Acedia

Le core est un client d'Acedia selon `contrat-satellite.md` v1 :

- **Appairage** : CrOliX lit un code dans le front autonome d'Acedia et le donne au core par une
  commande locale (URL d'Acedia + code). Le core l'échange contre un jeton qu'il **garde chiffré**
  dans sa base **[choix Claude]** (clé de chiffrement dans `.env`, comme `ACEDIA_SECRET_KEY`).
- **Santé** : le core interroge `GET /lun/v1/health` et sait dire si Acedia est `ok`, `paused`,
  `degraded` ou injoignable.
- **Événements** : le core écoute `GET /lun/v1/events` (SSE), reprend après une coupure avec
  `Last-Event-ID`, et **enregistre** chaque événement reçu, avec son importance. C'est l'amorce de
  la file unique du core (spec §7.3) ; le filtrage par mode viendra avec les modes.
  **[choix Claude]** Un événement est identifié par satellite, par son `id` et par sa date (pas de
  doublon). Une base d'Acedia remise à zéro perd aussi ses clients appairés : le jeton du core est
  refusé (401), le satellite apparaît « à réappairer », et le nouvel appairage repart de zéro pour
  les événements. Une coupure plus longue que la rétention d'Acedia (7 jours) perd les événements
  les plus anciens : c'est accepté.
- **Actions et relais** : le core liste les actions d'Acedia et peut en invoquer une. L'API des apps
  relaie santé, actions et coûts d'Acedia **sans remodeler** ses réponses (spec §5).
- **Coupure** : Acedia absente ou injoignable ne fait jamais tomber le core ; le core le dit et
  réessaie avec un délai croissant.

Le core est écrit pour **un satellite générique** (une URL, un jeton, le contrat), avec Acedia comme
seul satellite branché **[choix Claude]**.

### 3.4 La conversation

- **Modèle de données** : des **fils** (le fil principal, créé une fois pour toutes, et des sujets
  créés à la demande, avec un titre) et des **messages** (fil, rôle, texte, surface d'origine, date,
  et pour les réponses : modèle, jetons consommés, coût).
- **Surface** : chaque message porte la surface d'où il vient (`mobile`, `desktop`, `voice`,
  `cli`…). Elle est déclarée par le client à chaque envoi **[choix Claude]**.
- **Réponse** : le core construit le contexte (prompt système provisoire + derniers échanges du fil
  courant, bornés en taille) et appelle le fournisseur. La réponse est **diffusée au fil de l'eau**
  (SSE) **[choix Claude]** : la voix visera moins de 2 secondes avant le premier mot, autant poser
  le flux tout de suite.
- **Lecture** : l'API donne le fil principal découpé par jour, la liste des sujets, et les messages
  d'un fil par pages.
- **Réponse détachée du client** **[choix Claude]** : une fois lancée, la réponse va au bout et
  s'enregistre même si le client se déconnecte en cours de flux ; une autre surface la voit ensuite
  en entier.
- **Fournisseur en panne ou crédit épuisé** : dégradation propre, jamais de plantage. Le message de
  CrOliX est enregistré ; la réponse ratée est enregistrée **avec un statut d'erreur** et une raison
  lisible, affichée dans le fil mais **jamais renvoyée au modèle** comme une parole de Natsume
  **[choix Claude]**. Une réponse coupée en plein flux garde son texte partiel, marqué comme tel.
- **État dégradé** **[choix Claude]** : le core tient une liste de raisons (comme le `degraded` d'Acedia),
  en mémoire. Clé invalide ou crédit épuisé : la raison est posée, et tant qu'elle l'est le core
  n'appelle le fournisseur qu'au plus une fois toutes les 5 minutes pour vérifier ; entre-temps il
  répond tout de suite par l'erreur lisible. Le premier appel réussi efface la raison.

### 3.5 Les coûts et le plafond

- Chaque appel au fournisseur est **compté** : jetons d'entrée et de sortie, modèle, coût en dollars
  calculé depuis une table de prix par modèle, surchargeable par configuration.
- Un **plafond journalier** de dépense de conversation, réglable par `.env` **[choix Claude :
  valeur par défaut modeste, par exemple 1 $]**. Au-delà, le core refuse proprement de répondre
  et le dit. Le budget global tient déjà côté fournisseur (crédits prépayés, spec §8) ; ce plafond
  évite qu'un emballement vide le crédit en une soirée. **[choix Claude]** Le plafond est vérifié
  avant chaque appel et chaque réponse a un nombre maximal de jetons : le dépassement est borné à
  une réponse, pas davantage.
- L'API des apps expose la dépense **par source, côte à côte** **[choix Claude]** : celle du core, et
  celle de chaque satellite **telle qu'il la renvoie** (format `Costs` du contrat, jamais fusionnée
  ni remodelée), plus un total calculé par le core à côté.

### 3.6 Essayer sans app

Il n'y a pas encore d'app. Pour prouver le palier en local **[choix Claude]** :

- une petite **commande de discussion en terminal** (`npm run chat`), cliente appairée comme une
  autre, qui parle dans le fil principal ou dans un sujet, avec la surface `cli` ;
- les commandes locales d'appairage (code pour un client, branchement d'Acedia).

## 4. Hors périmètre

Personnalité, humeur, relation (chantier dédié) ; cerveau, contexte chaud, résumé des autres fils,
nuit, briefing ; modes et filtrage des événements ; voix et avatar ; apps `ui/`, `desktop/`,
`mobile/` ; Natsume qui invoque elle-même les actions d'Acedia pendant la conversation ; choix du
modèle par module et second fournisseur ; pause et interrupteur général agrégés ; déploiement sur
le NAS.

## 5. Contraintes

- Les standards de lun-docs : `essentiel.md`, `qualite.md`, `securite.md`, `git.md`.
- **Aucun test ne dépend du réseau ni d'une vraie clé** : faux OpenAI et faux Acedia en mémoire.
  Une seule vérification de bout en bout, manuelle, avec la vraie clé et Acedia en local.
- Dépôt privé, mais aucun secret versionné ; jetons et clés en `.env` ou chiffrés en base.
- **Le modèle juge, le code garantit** : comptage des coûts, plafond, enregistrement des messages et
  des événements sont du code déterministe et testé.
- Le core ne recopie pas les données d'Acedia : il enregistre les événements reçus (c'est sa file),
  il relaie le reste.

## 6. Critères de fin

1. `npm run dev` démarre le core en local ; `format:check`, `lint`, `typecheck` et `test` sont verts.
2. Un client s'appaire avec un code affiché par le core ; sans jeton valide, l'API répond 401.
3. Le core s'appaire à un Acedia local ; l'API des apps montre sa santé, ses actions et ses coûts ;
   une action invoquée via le core s'exécute dans Acedia.
4. Les événements d'Acedia arrivent dans le core et y sont enregistrés ; après un arrêt d'Acedia ou
   du core, l'écoute reprend sans perte ni doublon.
5. `npm run chat` permet de discuter avec Natsume dans le fil principal ; la réponse arrive au fil
   de l'eau ; un sujet se crée et a ses propres messages ; chaque message garde sa surface.
6. Chaque réponse enregistre modèle, jetons et coût ; au-delà du plafond journalier, le core refuse
   proprement ; fournisseur en panne ou clé invalide : erreur lisible, rien ne plante.
7. Acedia coupée : le core reste debout, le dit, et se reconnecte seul quand elle revient.

## 7. Laissé au constructeur

Le schéma exact des tables, les noms des routes de l'API des apps, la taille de la fenêtre de
contexte, le texte du prompt provisoire, le format des types partagés (un paquet de types interne
au monorepo viendra avec `ui/`), la stratégie de reconnexion, la bibliothèque cliente OpenAI (SDK
officiel recommandé). Tout choix structurant donne une décision dans `docs/decisions/` de
lun-anima.
