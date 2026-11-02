# Apps du core, chantier 6, palier 2 : Journal, Écosystème, catalogue des postes et contrat v1.3

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** L'app du core remplace le terminal et le `.env`. Le Journal raconte ce qui a été fait,
Écosystème règle les postes, les dépenses, la clé, les routines et les appareils sans redémarrer le
core, et le lanceur Postes ouvre le front de chaque poste, au bon endroit quand une carte ou une
alerte sait où elle vit.

**Architecture:** Quatre dépôts, une PR chacun.
- **lun-docs** : le contrat satellite passe en v1.3 (`link` facultatif sur `Card` et `LunEvent`).
- **lun-anima** :
  - côté core, des réglages vivants lus à chaque appel dans la table `settings` (le `.env` donne la
    valeur de départ) ;
  - les routes manquantes : réglages, clé, relier un poste, adresse de front, appareils, journal ;
  - un relevé des gestes relayés, et le `link` des événements gardé en base ;
  - côté `ui/`, les écrans Journal et Écosystème à la place de `Bientot`, puis le lanceur Postes et
    les boutons « Ouvrir » des lignes et des cartes.
- **lun-acedia** et **lun-avaritia** : chacun remplit `link`. Acedia gagne aussi la route
  `#/mail/<id>`.

**Tech Stack:** celle du palier 1. Côté core : Node, Hono, node:sqlite, zod 4 et Vitest. Côté
`ui/` : Svelte 5, Bits UI, `@lucide/svelte` et Testing Library en jsdom. Aucune dépendance
nouvelle.

**Spec:** lun-docs `docs/specs/2026-10-30-apps-core-design.md`. Sections utiles :
- §3.6 Journal, §3.7 Écosystème, §3.9 catalogue ;
- §4 les frontières, §5.2 le palier 2 ;
- §8 le contrat v1.3, §11 la recette.

Planche validée : `docs/maquettes/2026-10-30-apps-core/06-journal-ecosysteme-postes.html`.
Standards : `standards/design.md`, `standards/contrat-satellite.md`.

## Global Constraints

- **DA** : celle du palier 1, sans exception.
  - Les jetons sont la seule source de couleur ; le rouge d'Anima n'est jamais en texte.
  - Les composants du kit seulement ; `data-monde` sur la racine de chaque ligne, tuile ou carte,
    selon son poste.
  - Les routines du core portent le monde `anima`.
- **Un seul seuil mobile** : `max-width: 767.98px`.
- **Quatre sections**, pas une de plus : le lanceur Postes est un bouton de la barre haute, pas une
  section.
- **Écosystème, desktop** : une colonne de thèmes de 170 px, puis la grille des cartes de réglages
  sur deux colonnes `repeat(2, minmax(0, 1fr))`. **Mobile** : la liste des thèmes, chacun avec son
  état en une ligne, puis le thème ouvert avec les mêmes lignes.
- **Thèmes**, dans cet ordre : Postes, Dépenses et plafonds, Modèle et clé, Routines, Appareils,
  Notifications.
- **Réglages** :
  - un réglage posé dans l'app s'applique sans redémarrer le core ;
  - il l'emporte sur le `.env`, qui ne donne plus que la valeur de départ ;
  - la clé saisie n'est jamais réaffichée ni renvoyée par une route.
- **Natsume ne touche pas aux réglages** : aucun outil de Natsume n'écrit dans `settings`.
- **Journal** : lecture seule ; groupé par jour, du plus récent au plus ancien ; filtre par poste
  (Tout, puis un chip par poste, puis Lun'Anima). Une carte décidée dans le front d'un poste n'y
  paraît que par ses événements.
- **Catalogue** :
  - l'app n'embarque aucun écran de satellite ;
  - « Ouvrir » ouvre le front dans un nouvel onglet, avec `rel="noopener noreferrer"` : le front ne
    sait pas d'où l'on vient ;
  - sans adresse de front, la tuile n'a pas de bouton et dit « Adresse de son front à régler dans
    Écosystème ».
- **Textes** :
  - voix technique neutre ; pas de tiret cadratin ; « Lun'Xxx » ;
  - pas de libellé en capitales ni de « · » de jonction ; pas de « → » dans un bouton ;
  - un bouton dit ce qu'il fait, et le toast reprend le même verbe.
- **Satellites publics** : aucune adresse réelle ni aucun secret dans lun-acedia et lun-avaritia.
- **Vérification** :
  - chaque écran est vu dans Chrome en 1440 px et 390 px contre la planche 06, avant la PR ;
  - la capture ne contient aucune donnée réelle.

## Choix du plan

- **L'adresse du front est un réglage du core**, `front:<id>` dans `settings`, et ne figure pas dans
  le manifeste. La spec §8 parle du manifeste, mais le contrat n'a pas de manifeste (le satellite
  ne donne que `{ id, nom, version }`), et l'adresse joignable dépend de l'appareil et du réseau,
  que le satellite ne connaît pas. La v1.3 n'ajoute donc que `link`. Coût si c'est faux : une
  route `GET /lun/v1/front` à ajouter plus tard, sans rupture.
- **Des réglages vivants plutôt que des nombres figés.**
  - `ChatService` et la routine de nuit lisent leurs réglages par une fonction appelée à chaque
    appel, au lieu des valeurs passées une fois à la construction.
  - Les clés de `settings` sont `chat.capUsd`, `routines.capUsd`, `chat.model` et
    `chat.maxTokens`.
  - Un ADR du core (`lun-anima/docs/decisions/0004-reglages-vivants.md`) l'acte, comme le demande
    la spec §9.
- **Remplacer la clé** : la route vérifie la clé avec `checkWithModelsList`, puis appelle
  `saveOpenAiKey` et prévient tout de suite le core en cours. Elle ne compte pas sur le relevé de
  15 s, qui reste pour `npm run set-key`.
- **Relier un poste** : par adresse puis code à 6 chiffres seulement (`pairSatellite`). Le chemin
  par page d'autorisation écoute sur `127.0.0.1` et ne marche pas depuis le téléphone :
  `npm run connect` le garde.
- **Le rôle d'un poste** (« Mail, agenda, tâches ») vient d'une table de `ui/src/posts.ts` pour les
  postes connus. Pour un poste inconnu, la ligne n'a pas de rôle.
- **Dernier contact** : l'heure du dernier événement reçu du poste (`MAX(received_at)`), sinon
  rien. Le lien vivant (`link`) donne l'état.
- **Les gestes relayés** vont dans une table `gestures`. Le corps de
  `POST /satellites/:id/cards/:card/:gesture` accepte un `from` facultatif (`accueil`, `valider`,
  `fil`) pour dire d'où vient le geste.
- **Le jour du Journal** est le jour civil de Paris (`DAY_TIME_ZONE`), comme sur la planche
  (« Aujourd'hui, vendredi 30 octobre »), et non le jour de Natsume (5 h à 5 h).
- **Les événements du Journal** sont ceux d'importance `info` et `log` (P3 et P4), plus les alertes
  vues (`event_seen`).
- **Notifications** : le thème est présent et dit qu'il arrive avec les notifications. Sa ligne
  porte « Arrive au palier 3 », sans interrupteur muet.
- **Une PR par dépôt** plutôt qu'une PR du palier (spec §5) : quatre dépôts ne tiennent pas dans
  une PR. L'ordre est lun-docs, lun-anima, puis les deux satellites.

## Review Focus

- **Un `link` venu d'un poste qui n'est pas un chemin** (`https://ailleurs`, `javascript:…`,
  `//hote`) : il est ignoré, et le bouton ouvre l'accueil du front. Le test est dans Task 9.
- **Une adresse de front mal formée** (sans schéma, en `ftp:`, avec un chemin ou une barre finale) :
  - une adresse illisible ou en `ftp:` est refusée en 400, avec la raison ;
  - une adresse acceptée est ramenée à son origine.

  Le test est dans Task 4.
- **Révoquer l'appareil qu'on tient en main** : la ligne dit « cet appareil » et demande une
  confirmation dans un Dialog du kit. L'appel suivant ramène à l'appairage, sans boucle. Le test est
  dans Task 8.
- **Un plafond posé sous la dépense du jour, ou une valeur invalide** :
  - sous la dépense, la conversation répond tout de suite « Plafond du jour atteint » ;
  - une valeur négative, `NaN` ou un texte donne un 400, et l'ancienne valeur reste.

  Les tests sont dans Task 2.
- **Remplacer la clé quand OpenAI ne répond pas ou la refuse** :
  - si OpenAI ne répond pas, la route rend un 502 avec la raison ;
  - si OpenAI la refuse, la route rend un 422 ;
  - dans les deux cas, l'ancienne clé reste en service ;
  - aucune réponse, y compris celle de `GET /settings`, ne contient la clé.

  Le test est dans Task 3.

---

### Task 1 : le contrat satellite v1.3 (lun-docs)

**Files:**
- Modify: `lun-docs/standards/contrat-satellite.md`

**Interfaces:**
- Produces :
  - `interface Card { …; link?: string }` et `interface LunEvent { …; link?: string }` ;
  - `link` est un chemin dans le front du poste qui commence par `/` ou `#/`, sans hôte ;
  - le client l'ajoute à l'adresse du front qu'il connaît.

- [ ] **Step 1 :** passer la version à **v1.3** et ajouter `link?: string` aux deux types, avec le
  commentaire « chemin dans le front du poste (`/…` ou `#/…`), jamais une adresse ».
- [ ] **Step 2 :** ajouter dans « Fronts » une phrase. Le core ouvre le front à ce chemin, à une
  adresse qu'il règle lui-même, et le front n'en sait rien.
- [ ] **Step 3 :** compléter « Versionnement » avec « la v1.3 `link` sur `Card` et `LunEvent` ».
- [ ] **Step 4 : `npm run check`.** Attendu : PASS.
- [ ] **Step 5 : commit** `docs(contract): satellite contract v1.3 with an optional link`. PR en
  brouillon, avec le plan et la planche 06 sur la même branche `docs/core-apps-palier-2`.

### Task 2 : les réglages vivants du core

**Files:**
- Create: `core/src/settings/live.ts`, `core/src/settings/routes.ts`, `core/src/settings/routes.test.ts`
- Create: `docs/decisions/0004-reglages-vivants.md`
- Modify:
  - `core/src/chat/service.ts` : `dailyCapUsd`, `model` et `maxTokens` deviennent
    `settings: () => ChatSettings` ;
  - `core/src/routines/night-day.ts` et `night.ts` : `capUsd` et `model` passent en getters, comme
    `provider` ;
  - `core/src/main.ts`, `core/src/app.ts` (`limits` disparaît au profit de `settings`) ;
  - `core/src/accueil/routes.ts` et les tests touchés.

**Interfaces:**
- Produces :
  - `interface LiveSettings { chatCapUsd: number; routinesCapUsd: number; model: string; maxTokens: number }` ;
  - `readSettings(db, defaults: LiveSettings): LiveSettings`, qui lit `chat.capUsd`,
    `routines.capUsd`, `chat.model` et `chat.maxTokens` avec `getSetting` ;
  - `AppDeps.settings: () => LiveSettings` ;
  - `GET /api/settings` rend
    `{ chatCapUsd, routinesCapUsd, model, maxTokens, key: { state: 'ok' | 'missing' | 'refused', expires?: string } }` ;
  - `PATCH /api/settings` reçoit un sous-ensemble de `LiveSettings`, validé par zod :
    - `capUsd` est un nombre fini, de 0 à 100 ;
    - `maxTokens` est un entier, de 50 à 8000 ;
    - `model` est un texte de 1 à 64 caractères, en `[\w.:-]+` ;
    - la route rend le nouvel état comme `GET`, ou un 400 avec la raison.

- [ ] **Step 1 : écrire les tests qui échouent** (`settings/routes.test.ts`, avec le `createApp` de
  test) :
  - `GET /settings gives the .env values when nothing was set` ;
  - `PATCH /settings stores the cap and the next chat message uses it` : poser
    `chatCapUsd: 0.01` avec une dépense du jour de 0,02, puis vérifier que la réponse suivante
    (`ChatService.send`) commence par `Plafond du jour atteint` ;
  - `PATCH /settings refuses a negative cap, NaN and text, and keeps the old value` ;
  - `PATCH /settings changes the model of the next reply`, vérifié avec le faux fournisseur ;
  - `GET /settings never contains the key`.
- [ ] **Step 2 : `npm test -w core -- settings`.** Attendu : FAIL, module absent.
- [ ] **Step 3 : implémenter `live.ts`, les routes, puis brancher `ChatService` et la nuit.**
  - Garder les messages `… invalide` de `ChatService`, appliqués à la valeur lue.
  - `main.ts` passe `() => readSettings(db, defaultsFromEnv)`.
- [ ] **Step 4 : écrire l'ADR 0004** : le contexte, la décision (settings l'emporte sur `.env`, lu à
  chaque appel), et l'alternative écartée (un redémarrage du core).
- [ ] **Step 5 : `npm test && npm run typecheck`.** Attendu : PASS, et les tests du palier 1
  restent verts.
- [ ] **Step 6 : commit** `feat(core): live settings read per call, settings routes`.

### Task 3 : remplacer la clé depuis l'app

**Files:**
- Modify: `core/src/settings/routes.ts`, `core/src/settings/routes.test.ts`, `core/src/app.ts`, `core/src/main.ts`

**Interfaces:**
- Consumes : `checkWithModelsList`, `saveOpenAiKey(db, secretKey, key, expires?)` et `keyWorks`
  (`keys/openai-key.ts`).
- Produces :
  - `AppDeps.checkKey?: KeyChecker`, par défaut `checkWithModelsList` ;
  - `AppDeps.onKeySaved?: (key: string) => void` ; dans `main.ts`, c'est le même corps que
    `watchOpenAiKey.onChange`, extrait en fonction ;
  - `PUT /api/settings/key { key: string, expires?: 'YYYY-MM-DD' }` :
    - 204 si la clé est enregistrée ;
    - 422 `{ error: 'Clé refusée par OpenAI' }` si OpenAI la refuse ;
    - 502 `{ error: <raison> }` si OpenAI ne répond pas ;
    - 400 si le corps est invalide.

- [ ] **Step 1 : écrire les tests qui échouent** :
  - `PUT /settings/key saves a checked key and serves it at once` : le faux `onKeySaved` est appelé
    avec la clé ;
  - `PUT /settings/key keeps the old key when OpenAI refuses it (422)` ;
  - `PUT /settings/key keeps the old key when OpenAI does not answer (502)` ;
  - `the key never comes back` : ni `GET /settings`, ni la réponse du `PUT`, ni les logs.
- [ ] **Step 2 : `npm test -w core -- settings`.** Attendu : FAIL.
- [ ] **Step 3 : implémenter la route.** Sans `secretKey` lisible, elle rend 503
  « ANIMA_SECRET_KEY absente ».
- [ ] **Step 4 : `npm test -w core`.** Attendu : PASS.
- [ ] **Step 5 : commit** `feat(core): replace the OpenAI key from the app`.

### Task 4 : relier un poste et régler l'adresse de son front

**Files:**
- Modify: `core/src/satellites/routes.ts`, `core/src/satellites/store.ts`
- Test: `core/src/satellites/routes.test.ts`

**Interfaces:**
- Consumes : `pairSatellite(deps, url, code)`, `satelliteBaseUrl(url)` et `SatelliteManager.refresh()`.
- Produces :
  - `GET /api/satellites` ajoute à chaque poste `front?: string` (une origine) et
    `lastContact?: string` (le `MAX(received_at)` de ses événements) ;
  - `POST /api/satellites { url, code }` relie le poste :
    - 201 `{ id, nom, version }` ;
    - 400 si le code n'a pas 6 chiffres ou si l'adresse est illisible ;
    - 502 avec la raison du poste s'il est injoignable ou s'il refuse le code ;
  - `PUT /api/satellites/:id/front { url }` :
    - 204 ;
    - 404 pour un poste inconnu ;
    - 400 si l'adresse n'est pas en `http:` ou `https:` ;
    - l'adresse gardée est `new URL(url).origin` ;
    - `{ url: null }` efface l'adresse.

- [ ] **Step 1 : écrire les tests qui échouent** :
  - `POST /satellites pairs with a 6-digit code and the post shows in the list`, avec un faux
    `fetch` qui répond à `/lun/v1/pair` ;
  - `POST /satellites says why when the post refuses the code` ;
  - `PUT front keeps the origin only` : `http://nas.local:8787/app/` devient
    `http://nas.local:8787` ;
  - `PUT front refuses ftp: and an unreadable address with the reason` ;
  - `GET /satellites gives front and lastContact`.
- [ ] **Step 2 : `npm test -w core -- satellites`.** Attendu : FAIL.
- [ ] **Step 3 : implémenter.**
  - L'adresse de front est gardée avec `putSetting(db, 'front:' + id, origin)`.
  - `lastContact` est lu par une seule requête groupée par `satellite_id`.
- [ ] **Step 4 : `npm test -w core`.** Attendu : PASS.
- [ ] **Step 5 : commit** `feat(core): link a post and set its front address from the app`.

### Task 5 : les appareils depuis l'app

**Files:**
- Modify: `core/src/auth/pairing.ts` (`requireToken` pose l'id du client dans `c.var.clientId`),
  `core/src/auth/routes.ts`, `core/src/app.ts`
- Test: `core/src/auth/routes.test.ts`

**Interfaces:**
- Consumes : `issuePairingCode`, `codeExpiry`, `listClients` et `revokeClient`.
- Produces :
  - `GET /api/clients` rend `{ clients: { id, name, createdAt, revokedAt?, current: boolean }[] }`,
    où `current` marque l'appareil qui appelle ;
  - `DELETE /api/clients/:id` rend 204, ou 404 ;
  - `POST /api/pairing-codes` rend `{ code, expiresAt }` ;
  - les trois routes sont sous le jeton, et les règles d'échec d'appairage restent celles du
    palier 1.

- [ ] **Step 1 : écrire les tests qui échouent** :
  - `lists the devices and marks the current one` ;
  - `a revoked device is refused at its next call (401)` ;
  - `issues a 10-minute pairing code` ;
  - `the pairing code routes need a token`.
- [ ] **Step 2 : `npm test -w core -- auth`.** Attendu : FAIL.
- [ ] **Step 3 : implémenter.** `requireToken` lit l'id avec la même requête que `isValidToken`.
- [ ] **Step 4 : `npm test -w core`.** Attendu : PASS.
- [ ] **Step 5 : commit** `feat(core): devices and pairing codes from the app`.

### Task 6 : le relevé des gestes, le `link` des événements, la route du Journal

**Files:**
- Modify:
  - `core/src/db.ts` : une migration crée `gestures (id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT
    NOT NULL, satellite_id TEXT NOT NULL, card_id TEXT NOT NULL, title TEXT NOT NULL, gesture TEXT
    NOT NULL, outcome TEXT NOT NULL, origin TEXT)`, puis `ALTER TABLE events ADD COLUMN link TEXT` ;
  - `core/src/satellites/client.ts` : `link?: string` sur `Card` et `LunEvent` ;
  - `core/src/satellites/routes.ts` : la route du geste note le geste ;
  - `core/src/events/store.ts` : `storeEvent` garde `link`, et `listEvents` le rend ;
  - `core/src/accueil/routes.ts` : les urgences de `/home` portent `link`.
- Create: `core/src/journal/journal.ts`, `core/src/journal/routes.ts`, `core/src/journal/journal.test.ts`

**Interfaces:**
- Produces :
  - `type Entry = { at: string; post: string; kind: 'gesture' | 'seen' | 'routine' | 'event'; title: string; detail?: string; outcome: string }`.
    `post` vaut l'id du satellite, ou `lunanima` pour une routine ;
  - `GET /api/journal?post=<id>&before=<YYYY-MM-DD>` rend `{ days: { day: string, entries: Entry[] }[] }`,
    avec sept jours civils de Paris au plus avant `before` (aujourd'hui par défaut), du plus
    récent au plus ancien ;
  - ce qu'une entrée dit, selon sa source :
    - un geste : `outcome` vaut `validée`, `refusée` ou `échec`, selon la carte rendue ;
      `detail` vaut `depuis l'accueil`, `depuis le fil de Natsume` ou `depuis À valider`, selon
      `origin`, et rien sans `origin` ;
    - une alerte vue : `outcome` vaut `vue` ;
    - une routine : `outcome` vaut `faite` ou `échec : <raison>`, et `detail` donne le coût en
      dollars ;
    - un événement `info` ou `log` : `outcome` vaut `info`, et `detail` vaut `événement du poste`.

- [ ] **Step 1 : écrire les tests qui échouent** (`journal.test.ts`) :
  - `a relayed accept is noted with its origin and outcome` ;
  - `a refused relay (409, unreachable) notes nothing` ;
  - `entries are grouped by Paris day, newest first` : vérifier qu'une entrée de 0 h 30 heure de
    Paris tombe dans son jour civil ;
  - `post filters gestures, events and seen alerts; lunanima gives the routines` ;
  - `an urgent event keeps its link through /home and /events`.
- [ ] **Step 2 : `npm test -w core -- journal`.** Attendu : FAIL.
- [ ] **Step 3 : implémenter.** Une requête par source, fusionnées et triées en mémoire : sept
  jours restent petits.
- [ ] **Step 4 : `npm test -w core`.** Attendu : PASS.
- [ ] **Step 5 : commit** `feat(core): journal of relayed gestures, routines and events`.

### Task 7 : l'écran Journal

**Files:**
- Create: `ui/src/screens/Journal.svelte`, `ui/src/screens/Journal.test.ts`
- Modify: `ui/src/App.svelte` (la route `journal` rend `<Journal />`), `ui/src/testing/core.ts` (défaut de `GET /journal`)

**Interfaces:**
- Consumes : `GET /api/journal`, et `nameOf` et `worldOf` (`ui/src/posts.ts`).

- [ ] **Step 1 : écrire les tests qui échouent** :
  - `days come newest first with their date` : « Aujourd'hui », puis « vendredi 30 octobre » ;
  - `a row gives the hour, the post and the outcome, in its world` : `data-monde` vaut `acedia`, et
    l'heure s'écrit « 10 h 12 » ;
  - `the post chips filter the list` : Tout, puis Lun'Acedia, puis Lun'Avaritia, puis Lun'Anima ;
  - `an empty week says so` : « Rien de fait ces sept derniers jours. » ;
  - `"Plus ancien" loads the week before`.
- [ ] **Step 2 : `npm test -w ui -- Journal`.** Attendu : FAIL.
- [ ] **Step 3 : implémenter** sur la planche 06 :
  - au bureau, les lignes `.trace` : l'heure, le filet du poste, ce qui s'est passé et d'où, puis
    le badge d'issue ;
  - au téléphone, l'issue passe sous le texte ;
  - les chips sont des boutons `aria-pressed`.
- [ ] **Step 4 : `npm test -w ui && npm run typecheck`.** Attendu : PASS.
- [ ] **Step 5 : vérifier dans Chrome** en 1440 et 390 px contre la planche 06.
- [ ] **Step 6 : commit** `feat(ui): journal screen`.

### Task 8 : l'écran Écosystème

**Files:**
- Create:
  - `ui/src/screens/ecosysteme/Ecosysteme.svelte`, avec la colonne des thèmes, la grille et la
    liste mobile ;
  - un composant par thème : `Postes.svelte`, `Depenses.svelte`, `ModeleCle.svelte`,
    `Routines.svelte`, `Appareils.svelte`, `Notifications.svelte` ;
  - `ui/src/screens/ecosysteme/Ecosysteme.test.ts`.
- Modify: `ui/src/App.svelte`, `ui/src/posts.ts` (`roleOf(id): string | undefined`), `ui/src/testing/core.ts`

**Interfaces:**
- Consumes :
  - `GET/PATCH /settings` et `PUT /settings/key` ;
  - `GET/POST /satellites` et `PUT /satellites/:id/front` ;
  - `GET/DELETE /clients` et `POST /pairing-codes` ;
  - `GET /costs?since=<7 jours>`, `GET /home` (les routines) et `POST /routines/{night,morning}`.
- Produces : `roleOf`, consommé par Task 9.

- [ ] **Step 1 : écrire les tests qui échouent**, un par thème, plus la navigation :
  - `desktop shows the themes column and the cards; phone shows the list, then one theme` ;
  - `Relier un poste` : l'adresse et le code envoient `POST /satellites`, puis le poste paraît. Une
    erreur 502 dit la raison du poste ;
  - `l'adresse du front` : elle s'enregistre, et une erreur 400 dit la raison sous le champ ;
  - `Dépenses et plafonds` :
    - le tableau donne sept jours, et le plafond se modifie ;
    - « Plafond enregistré » paraît dans le toast ;
    - un 400 garde l'ancienne valeur affichée ;
  - `Modèle et clé` :
    - « Remplacer » ouvre un Dialog avec un champ mot de passe ;
    - un 422 donne « Clé refusée par OpenAI », un 204 donne « Clé remplacée » ;
    - le champ est vidé après l'envoi ;
  - `Routines` : « Lancer » appelle la routine, et la ligne montre son résultat ;
  - `Appareils` :
    - « Appairer un appareil » montre le code et son échéance ;
    - « Révoquer » sur « cet appareil » demande une confirmation, puis l'appel suivant ramène à
      l'appairage ;
  - `Notifications says it arrives with palier 3`.
- [ ] **Step 2 : `npm test -w ui -- ecosysteme`.** Attendu : FAIL.
- [ ] **Step 3 : implémenter** sur la planche 06.
  - Chaque thème charge seul ; un thème en erreur le dit sans masquer les autres.
  - Le thème mobile ouvert garde son nom dans la requête (`/app/ecosysteme?theme=cle`), car
    `routeFromPath` ne connaît que les quatre chemins ; le retour du téléphone revient à la
    liste.
- [ ] **Step 4 : `npm test -w ui && npm run typecheck && npm run lint`.** Attendu : PASS.
- [ ] **Step 5 : vérifier dans Chrome** en 1440 et 390 px, chaque thème contre la planche 06. Les
  thèmes Appareils et Notifications, absents de la planche au bureau, suivent la même carte.
- [ ] **Step 6 : commit** `feat(ui): ecosystem screen replaces the terminal and the .env`.

### Task 9 : le lanceur Postes et les liens profonds

**Files:**
- Create: `ui/src/shell/Postes.svelte`, `ui/src/shell/Postes.test.ts`, `ui/src/frontHref.ts`, `ui/src/frontHref.test.ts`
- Modify:
  - `ui/src/shell/Shell.svelte` : le bouton « Postes » au bureau, l'icône en haut à droite au
    téléphone ;
  - `ui/src/screens/Accueil.svelte` : « Ouvrir le mail » ou « Voir la fiche » sur une urgence ou une
    carte qui a un `link` ;
  - `ui/src/cards/CardItem.svelte`, `ui/src/shell/icons.ts`.

**Interfaces:**
- Consumes : `GET /satellites` (`front`, `link`, `health`), le compte des cartes en attente par
  poste (`GET /cards`) et `roleOf`.
- Produces : `frontHref(front: string | undefined, link?: string): string | undefined`.
  - Sans `front`, la fonction rend `undefined`.
  - Un `link` qui commence par `/` ou `#/` (et pas par `//`) donne `front + link`.
  - Tout autre `link` est ignoré et donne `front + '/'`.

- [ ] **Step 1 : écrire les tests qui échouent** :
  - `frontHref` :
    - `joins a path and a hash route to the front` ;
    - `ignores https://, //host, javascript: and an empty link` ;
    - `gives nothing without a front` ;
  - `Postes` :
    - `the launcher shows one tile per post in its world, with what waits there` (« 2 brouillons,
      1 urgence ») ;
    - `Ouvrir opens the front in a new tab with noopener noreferrer` ;
    - `a post without a front address has no button and says where to set it` ;
    - `phone: the icon opens the posts as a sheet` ;
  - `Accueil` : `an urgent row with a link offers "Ouvrir le mail" to the right place`.
- [ ] **Step 2 : `npm test -w ui -- Postes frontHref Accueil`.** Attendu : FAIL.
- [ ] **Step 3 : implémenter.**
  - Au bureau, un popover Bits ; au téléphone, la feuille Dialog du palier 1.
  - Le libellé du bouton suit le poste : « Ouvrir le mail » pour Acedia, « Voir la fiche » pour
    Avaritia, « Ouvrir » pour un autre poste.
- [ ] **Step 4 : `npm test -w ui && npm run typecheck`.** Attendu : PASS.
- [ ] **Step 5 : vérifier dans Chrome** en 1440 et 390 px contre la planche 06.
- [ ] **Step 6 : mettre à jour la doc.**
  - Dans `README.md` et `CLAUDE.md` : Écosystème fait ce que font `connect`, `set-key`,
    `pair-code`, `clients` et `revoke`, et les commandes restent pour le terminal.
  - Dans `.env.example` : les quatre réglages ne donnent que la valeur de départ.
- [ ] **Step 7 : commit** `feat(ui): posts launcher and deep links to the posts' fronts`. PR
  lun-anima en brouillon, Tasks 2 à 9.

### Task 10 : Lun'Acedia remplit `link` et ouvre un mail par son adresse

**Files:**
- Modify:
  - `server/src/types.ts` : `link?: string` sur `Card` et `LunEvent` ;
  - `server/src/contract/events.ts` : une colonne `link` par migration, gardée par `emitEvent` ;
  - `server/src/contract/routes.ts` : `toContractCard` ;
  - `server/src/triage/pipeline.ts`, `server/src/agenda/reminders.ts` ;
  - `app/src/App.svelte` : `screenOf` reconnaît `#/mail/<id>` et pose `opening`.
- Test: `server/src/contract/routes.test.ts`, `server/src/triage/*.test.ts`, `app/src/App.test.ts` (ou le test d'écran existant)

**Interfaces:**
- Consumes : le contrat v1.3 (Task 1).
- Produces :
  - une carte `mail.*` porte `link: '#/mail/<id>'`, avec l'id du mail que lit `wording.ts` ;
  - `mail.triaged` porte `link: '#/mail/<id>'` ;
  - `agenda.reminder` porte `link: '#/agenda'` ;
  - `#/mail/<id>` ouvre la boîte sur ce mail, et un id inconnu ouvre la boîte seule.

- [ ] **Step 1 : écrire les tests qui échouent** :
  - `a mail card carries its link` ;
  - `mail.triaged and agenda.reminder carry their link` ;
  - `#/mail/42 opens the mail 42` ;
  - `#/mail/inconnu opens the box`.
- [ ] **Step 2 : `npm test`.** Attendu : FAIL.
- [ ] **Step 3 : implémenter.** Le front ne gagne aucun texte ni lien vers le core.
- [ ] **Step 4 : `npm test && npm run typecheck && npm run lint`.** Attendu : PASS.
- [ ] **Step 5 : commit** `feat(contract): v1.3 links to mails and the agenda`. PR en brouillon.

### Task 11 : Lun'Avaritia remplit `link` pour les fiches

**Files:**
- Modify: `server/src/brain/drafts.ts` (`interface Card` et `cardOf`), `server/src/types.ts` ou le
  type `LunEvent` du contrat
- Test: `server/src/brain/drafts.test.ts`

**Interfaces:**
- Consumes : le contrat v1.3 (Task 1).
- Produces : une carte qui vise une fiche existante porte `link` vers le chemin de sa fiche. Les
  kinds concernés sont `fiche` avec `ficheId`, `contradiction` et `doublon`. Le chemin est celui
  que `app/src/App.svelte` ouvre déjà, aujourd'hui `/memoire?fiche=<id>`. Une fiche à créer n'a pas
  de `link`.

- [ ] **Step 1 : écrire les tests qui échouent** :
  - `an enrichment card links to its fiche` ;
  - `a new fiche card has no link`.
- [ ] **Step 2 : `npm test`.** Attendu : FAIL.
- [ ] **Step 3 : implémenter dans `cardOf`.**
- [ ] **Step 4 : `npm test && npm run typecheck`.** Attendu : PASS.
- [ ] **Step 5 : commit** `feat(contract): v1.3 links to fiches`. PR en brouillon.

### Task 12 : la recette du palier 2

- [ ] Avec les trois apps lancées en local (comptes de test), dans Chrome en 1440 et 390 px :
  - changer le plafond de la conversation dans Écosystème : il est pris en compte sans redémarrer
    le core ;
  - révoquer un appareil : il est refusé à l'appel suivant ;
  - relier Lun'Avaritia par adresse et code ;
  - régler les deux adresses de front ;
  - le Journal montre le geste ;
  - depuis une urgence d'Acedia, « Ouvrir le mail » ouvre ce mail ; le front ne montre rien du
    core.
- [ ] Noter dans chaque PR les captures, sans donnée réelle.
