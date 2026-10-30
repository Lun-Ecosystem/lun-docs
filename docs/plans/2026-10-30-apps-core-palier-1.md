# Apps du core, chantier 6, palier 1 : le socle, Natsume, À valider et l'accueil

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** L'app du core existe. Elle est servie par le core, s'appaire et s'installe en PWA. Elle
affiche l'accueil de pilotage et À valider, et Natsume la suit partout, en bulle.

**Architecture:** Deux dépôts.
- **lun-docs** : le kit de front commun devient une source unique, `design/kit/`, avec
  `tools/sync-kit.mjs`, sur le modèle des jetons. C'est le kit de Lun'Avaritia, le plus récent.
  Acedia et Avaritia le reprendront dans lun-docs#43 ; seul le core le consomme ici.
- **lun-anima** :
  - un workspace `ui/` (Svelte 5, Vite, PWA), servi par le core sous `/app` ;
  - côté core : une route `GET /api/home` qui rend sans appel réseau ce que le core a en base, l'état
    « vu » des alertes, le « plus tard » des échéances, « c'est fait » relayé à Lun'Avaritia, la
    phrase du jour écrite par la routine du matin, et HTTPS dès que `HOST` sort de la boucle locale.

**Tech Stack:**
- core : Node, Hono, node:sqlite, zod 4, Vitest ;
- `ui/` : Svelte 5, Vite 8, vite-plugin-pwa, Bits UI, `@lucide/svelte`, Testing Library en jsdom,
  svelte-check, les mêmes versions que lun-avaritia.

**Spec:** lun-docs `docs/specs/2026-10-30-apps-core-design.md` (§3.1 à §3.5, §3.8 pour le cycle
d'une alerte, §4, §7, §10, §11). Maquettes : `docs/maquettes/2026-10-30-apps-core/`. Standards :
`standards/design.md`, `standards/notifications.md`.

## Global Constraints

- **DA** :
  - jetons de `design/tokens.css` recopiés par `sync-tokens.mjs` sans `--monde`, car l'app affiche
    tous les mondes ;
  - Cormorant Garamond et Inter servies en local ;
  - les composants du kit seulement, aucune couleur en dur ;
  - le rouge d'Anima jamais en texte ;
  - `data-monde` sur la racine de chaque ligne, carte ou bandeau, selon son poste.
- **Un seul seuil mobile** : `max-width: 767.98px`.
- **Quatre sections** : Accueil, À valider, Journal, Écosystème. Journal et Écosystème sont livrés au
  palier 2 : au palier 1, leur écran est un état vide qui le dit (« Arrive au palier 2 »), jamais un
  squelette muet.
- **Natsume** :
  - au desktop, une bulle qui ouvre un **panneau flottant superposé** (Ctrl J), sans pousser la page,
    ouvert d'une section à l'autre ;
  - au mobile, une **feuille** qui monte par-dessus l'écran ;
  - la dictée d'Android passe par le champ texte, sans rien de plus.
- **L'accueil n'appelle jamais le modèle** et n'attend jamais un poste : la part du core arrive d'un
  bloc, la part de chaque poste bloc par bloc. Après 8 s, le bloc affiche « Lun'Xxx ne répond pas »
  **[choix du plan]**.
- **Le jeton d'appareil** est sous la clé `lunanima.token` dans `localStorage`, et rien d'autre n'est
  stocké sauf les préférences d'affichage.
- **Réseau** :
  - `HOST` hors de `127.0.0.1`, `::1` ou `localhost` exige `TLS_CERT` et `TLS_KEY`, sinon le core
    refuse de démarrer et dit pourquoi ;
  - toutes les routes `/api` gardent le jeton ;
  - le front ne nomme jamais une adresse interne en dur.
- **Textes** : voix technique neutre dans les écrans d'outil, pas de tiret cadratin, « Lun'Xxx ».
- **Vérification** : chaque écran est vu dans Chrome en 1440 px et 390 px contre sa planche, avant la
  PR, avec une capture sans donnée réelle.

## Choix du plan

- **Le kit** : la source est le `lib/ui` de Lun'Avaritia tel quel. Les textes propres à un produit
  (`ServiceCard`, `StandaloneCard.brand`, le monde par défaut de `Dialog`) passent en props dans la
  source. La fusion avec Acedia reste à lun-docs#43. Coût si c'est faux : une reprise du kit au
  moment de #43, mais pas une troisième copie divergente.
- **`/app` sous le même port que l'API** : un seul certificat, pas de CORS. La page publique `GET /`
  gagne un lien « Ouvrir l'app », qui ne lit rien de privé.
- **Un état « vu » par événement** (`event_seen`), plutôt qu'une colonne sur `events` : le palier 3
  y ajoute le retrait des notifications.
- **« C'est fait »** : le core délègue à Lun'Avaritia la demande `C'est fait : <texte du fait>` par le
  même chemin que Natsume (`Posts.delegate`). La carte de remplacement suit le chemin habituel.
- **La phrase du jour** : un champ `phrase` (240 caractères au plus) s'ajoute à la réponse du
  deuxième appel de `composeWarm`. Il est gardé dans `warm_contexts.phrase`. Aucun appel en plus.

## Review Focus

- Un poste lent ou coupé : l'accueil affiche la date, les urgences, les routines et la dépense
  immédiatement. Le bloc du poste affiche un squelette, puis « ne répond pas », et rien d'autre ne se
  bloque.
- Un jeton révoqué pendant que l'app est ouverte : le prochain appel ramène à l'appairage, sans
  boucle ni écran blanc.
- Le panneau de Natsume ouvert, l'utilisateur change de section : le panneau reste, le fil garde sa
  position, le flux SSE en cours n'est pas coupé.
- Une carte déjà décidée ailleurs (409) depuis l'accueil ou À valider : la ligne part, un toast le
  dit, et le compteur suit.
- `HOST=0.0.0.0` sans certificat : le core refuse de démarrer. Avec certificat, l'app s'installe
  depuis Chrome Android.

---

### Task 0 : la planche de l'accueil (design, avant le code de l'accueil)

**Files:**
- Create: `lun-docs/docs/maquettes/2026-10-30-apps-core/04-accueil-v2.html`

**Interfaces:**
- Produces : la disposition validée de l'accueil, au desktop et au mobile, que Task 9 suit.

- [ ] **Step 1 : reprendre l'agencement des blocs et l'occupation de l'espace**
  - Partir de `01-accueil.html`.
  - Chercher la disposition dans Chrome, en 1440 px et en 390 px.
  - Respecter le standard design et les retours de CrOliX : la couleur par poste, le chat en
    superposition, la DA complète.
  - Proposer deux variantes au plus.
- [ ] **Step 2 : faire valider par CrOliX** (navigateur). Task 9 attend cette validation ; Tasks 1 à
  8 n'attendent pas.
- [ ] **Step 3 : commit** `docs(maquettes): home layout v2 for the core app`.

### Task 1 : le kit commun dans lun-docs

**Files:**
- Create: `lun-docs/design/kit/**`, une copie du `lun-avaritia/app/src/lib/ui`, les textes produit
  passés en props.
- Create: `lun-docs/tools/sync-kit.mjs`, `lun-docs/tools/sync-kit.test.mjs`.
- Modify: `lun-docs/standards/design.md`, une ligne « Le kit : source `design/kit/`, copie par
  `sync-kit.mjs` », sans dépasser 150 lignes.

**Interfaces:**
- Produces : `node tools/sync-kit.mjs [--check] <dir>`. L'outil écrit dans `<dir>` chaque fichier
  de `design/kit/`. Les `.ts` et `.svelte` portent l'en-tête « Copie générée depuis
  lun-docs/design/kit : ne pas modifier ici ». Un fichier de `<dir>` absent de la source est signalé
  par `--check`. Les codes de sortie sont ceux de `sync-tokens.mjs`.

- [ ] **Step 1 : écrire les tests qui échouent** (`sync-kit.test.mjs`, `node --test`) :
  - `writes every kit file with the header` ;
  - `check passes on an identical copy` ;
  - `check fails on a changed file and names it` ;
  - `check fails on an extra file in the copy`.
- [ ] **Step 2 : `npm test`.** Attendu : FAIL, module absent.
- [ ] **Step 3 : implémenter `syncKit(root, target, { check })`** sur le modèle de `syncTokens`, en
  fins de ligne LF.
- [ ] **Step 4 : `npm test && npm run check`.** Attendu : PASS.
- [ ] **Step 5 : commit** `feat(kit): common front kit in design/kit with sync-kit`.

### Task 2 : le workspace `ui/` de lun-anima

**Files:**
- Create : `ui/package.json` (`@lun-anima/ui`), `ui/vite.config.ts`, `ui/index.html`,
  `ui/tsconfig.json`, `ui/vitest.setup.ts`, `ui/src/main.ts`, `ui/src/App.svelte`, `ui/public/`
  (les icônes 192 et 512 sur fond encre, marque Anima).
- Create : `ui/src/lib/ui/**` (copie du kit, par `sync-kit.mjs`) et `ui/src/tokens.css` (copie, par
  `sync-tokens.mjs`).
- Modify : `package.json` racine (workspace `ui`, `typecheck` = `tsc --noEmit && npm run check -w
  @lun-anima/ui`), `eslint.config.js`, `vitest.config.ts` (projet `ui`), `.github/workflows/*` (étapes
  `--check` du kit et des jetons, comme dans lun-avaritia).

**Interfaces:**
- Produces :
  - le build `ui/dist`, avec `base: '/app/'` ;
  - un manifeste PWA (`name: "Lun'Anima"`, `start_url: '/app/'`, `scope: '/app/'`,
    `theme_color: '#7A1818'`, `background_color: '#0D0B09'`) ;
  - un service worker qui ne met en cache que la coque, et jamais `/api`.

- [ ] **Step 1 : test qui échoue**, `ui/src/App.test.ts > renders the pairing screen without a token`.
- [ ] **Step 2 : `npm test`.** Attendu : FAIL.
- [ ] **Step 3 : poser le workspace**, sur le modèle de `lun-avaritia/app`. Le proxy de dev envoie
  `/api` vers `127.0.0.1:8788`.
- [ ] **Step 4 : contrôles de la racine.** Lancer `npm test && npm run typecheck && npm run lint &&
  npm run format:check && npm run build`. Attendu : vert.
- [ ] **Step 5 : commit** `feat(ui): app workspace with the common kit and tokens`.

### Task 3 : le core sert l'app, et HTTPS hors de la boucle locale

**Files:**
- Create : `core/src/serve-app.ts`, `core/src/serve-app.test.ts`, `core/src/tls.ts`,
  `core/src/tls.test.ts`.
- Modify : `core/src/app.ts` (`AppDeps.appDir?`), `core/src/main.ts`, `core/src/home.ts` (lien
  « Ouvrir l'app »), `README.md` et `.env.example` (`TLS_CERT`, `TLS_KEY`).

**Interfaces:**
- Produces :
  - `serveApp(app: Hono, dir: string, base = '/app')` : sert les fichiers, puis `index.html` pour toute
    autre page sous `/app`. Il ne répond jamais sous `/api` ni `/fonts`. Le cache suit
    `lun-avaritia/server/src/static.ts`. Les pages HTML portent `frame-ancestors 'none'`.
  - `tlsOptions(env): { cert: Buffer; key: Buffer } | undefined`, qui lève une erreur claire quand
    `HOST` n'est pas en boucle locale et qu'un fichier manque.

- [ ] **Step 1 : tests qui échouent**
  - `serveApp` :
    - `serves a built file under /app` ;
    - `answers the shell for an app route` ;
    - `never answers under /api` ;
    - `refuses a path escaping the directory`.
  - `tlsOptions` :
    - `loopback host needs no certificate` ;
    - `LAN host without certificate throws, naming TLS_CERT` ;
    - `LAN host with both files gives the options`.
- [ ] **Step 2 : `npx vitest run core/src/serve-app.test.ts core/src/tls.test.ts`.** Attendu : FAIL.
- [ ] **Step 3 : implémenter, puis brancher dans `main.ts`.** `serve({ fetch, hostname, port,
  createServer: https.createServer, serverOptions })` quand `tlsOptions` rend des options.
  `appDir = ui/dist` quand il existe.
- [ ] **Step 4 : suite complète.** Attendu : PASS.
- [ ] **Step 5 : commit** `feat(core): serve the app under /app, HTTPS off loopback`.

### Task 4 : appairage et client d'API de l'app

**Files:**
- Create : `ui/src/session.ts`, `ui/src/api.ts`, `ui/src/Pair.svelte`, et leurs tests.

**Interfaces:**
- Produces :
  - `loadToken`, `saveToken` et `clearToken(storage)`, sous la clé `lunanima.token` ;
  - `pair(code): Promise<string>` vers `POST /api/pair { code, client: "Lun'Anima (app)" }` ;
  - `createApi(token, { onUnauthorized })`, qui rend `{ get, send, stream }`. `stream(path, body,
    onEvent)` lit le SSE de `POST /api/threads/:id/messages`.
  - `ApiError` et `UnauthorizedError`, comme dans Avaritia.

- [ ] **Step 1 : tests qui échouent**
  - `session` :
    - `a refused code says so without telling whether it existed` ;
    - `a 401 clears the token and calls onUnauthorized once` ;
    - `stream yields user, delta and done events in order`.
  - `Pair` : `six digits pair the device and open the app`.
- [ ] **Step 2 : lancer les tests.** Attendu : FAIL.
- [ ] **Step 3 : implémenter.** `Pair.svelte` = `StandaloneCard` avec `CodeInput` et le monde anima.
- [ ] **Step 4 : lancer les tests.** Attendu : PASS.
- [ ] **Step 5 : commit** `feat(ui): pairing and API client`.

### Task 5 : la coque, quatre sections

**Files:**
- Create : `ui/src/shell/Shell.svelte`, `ui/src/shell/routes.ts`, leurs tests, `ui/src/screens/Bientot.svelte`.

**Interfaces:**
- Produces :
  - `Route = 'accueil' | 'valider' | 'journal' | 'ecosysteme'` ;
  - `pathOf(route)` sous `/app` ;
  - `routeFromPath(path)` ;
  - le `Shell`, qui rend le rail au desktop et la `BottomNav` sous 768 px. Le compteur de À valider
    vient de `GET /api/cards`. La carte d'état du service vient de `GET /api/health` et
    `GET /api/costs`. La palette Ctrl K porte les commandes de navigation.

- [ ] **Step 1 : tests qui échouent**
  - `routes` : `routes map to /app paths and back, unknown goes home`.
  - `Shell` :
    - `shows four sections and the valider count` ;
    - `below 768px shows the bottom bar instead of the rail` ;
    - `journal and ecosysteme say they come at palier 2`.
- [ ] **Step 2 à 4 : rouge, implémentation, vert.**
- [ ] **Step 5 : commit** `feat(ui): shell with four sections`.

### Task 6 : Natsume, la bulle et son panneau

**Files:**
- Create :
  - `ui/src/natsume/Bulle.svelte`, `ui/src/natsume/Panneau.svelte` ;
  - `ui/src/natsume/fil.svelte.ts` (fil, sujets, envoi en flux) ;
  - `ui/src/cards/CardItem.svelte` (une carte relayée, avec ses actions, à la couleur de son poste) ;
  - leurs tests.

**Interfaces:**
- Consumes : `createApi().stream`, `GET /api/threads`, `GET /api/threads/:id/messages`,
  `POST /api/satellites/:id/cards/:card/{accept|refuse}`.
- Produces :
  - `Fil` : `messages`, `asking` et `thread` (`'main'` par défaut), avec `send(text)` et `open(threadId)` ;
  - `CardItem` (`{ satellite, card, ondecided }`), réutilisé par Tasks 7 et 9.

- [ ] **Step 1 : tests qui échouent**
  - `Bulle` :
    - `Ctrl J opens and closes the panel` ;
    - `the panel stays open across a section change and keeps its thread`.
  - `Fil` :
    - `a reply streams into the last message` ;
    - `a reply with cards shows them under it`.
  - `Panneau` :
    - `on desktop the panel overlays the page, which keeps its width` (la largeur du `main` est la même
      panneau ouvert et fermé) ;
    - `below 768px it opens as a sheet over the screen`.
  - `CardItem` : `accepting relays the gesture; a 409 removes the card and says it was decided elsewhere`.
- [ ] **Step 2 à 4 : rouge, implémentation, vert.** Le panneau suit `lun-avaritia/app/src/agent/AgentPanel.svelte` (calque, focus, Échap) ; la feuille suit le kit mobile.
- [ ] **Step 5 : commit** `feat(ui): Natsume as a floating presence`.

### Task 7 : À valider

**Files:**
- Create : `ui/src/screens/Valider.svelte` et son test.

**Interfaces:**
- Consumes : `CardItem`, `GET /api/cards`.

- [ ] **Step 1 : tests qui échouent**
  - `groups pending cards by post, each in its world` ;
  - `an unreachable post is named, the others still show` ;
  - `deciding a card updates the shell count`.
- [ ] **Step 2 à 4 : rouge, implémentation, vert.** Raccourcis V (valider) et R (refuser), repris
  d'Avaritia, sur la carte qui a le focus.
- [ ] **Step 5 : commit** `feat(ui): pending cards screen`.

### Task 8 : la part du core de l'accueil

**Files:**
- Modify : `core/src/db.ts` (migration).
- Create : `core/src/home/home.ts`, `core/src/home/routes.ts`, et leurs tests.
- Modify : `core/src/memory/compose-warm.ts`, `core/src/memory/warm.ts` (`phrase`), `core/src/app.ts`, `README.md`.

**Interfaces:**
- Produces :
  - La migration :

    ```sql
    ALTER TABLE warm_contexts ADD COLUMN phrase TEXT;
    CREATE TABLE event_seen (event_id INTEGER PRIMARY KEY, seen_at TEXT NOT NULL);
    CREATE TABLE due_later (fact_id INTEGER NOT NULL, until_day TEXT NOT NULL, PRIMARY KEY (fact_id, until_day));
    ```

  - `GET /api/home` → `{ day, phrase?, urgent, routines, spend, posts, key }`, sans appel réseau :
    - `phrase` : la phrase du dernier contexte chaud si son `day` est le jour en cours ;
    - `urgent` : les événements `urgent` de la journée de Natsume pas encore vus, sous la forme
      `{ id, satellite, at, title }[]` ;
    - `routines` : le dernier passage de `night` et de `morning` ;
    - `spend` : `{ chat, routines, chatCap, routinesCap }` ;
    - `posts` : `{ id, link }[]` ;
    - `key` : l'échéance, si connue.
  - `POST /api/events/:id/seen` → 204.
  - `GET /api/dues` → les échéances de `brain.due` relayées, sans celles masquées « plus tard »
    jusqu'au lendemain. Elle peut attendre Avaritia, et c'est le front qui la charge à part.
  - `POST /api/dues/:factId/later` → 204.
  - `POST /api/dues/:factId/done { text }` → la réponse du poste (`{ summary, cards }`), par
    `Posts.delegate('lunavaritia', 'C’est fait : ' + text)`.
  - `composeWarm` : un champ `phrase` dans `Warm` (`z.string().min(1).max(240)`), gardé avec le
    contexte. La consigne : une phrase pour CrOliX, dans la voix de Natsume, sur ce qui compte
    aujourd'hui, avec les dates en entier.

- [ ] **Step 1 : tests qui échouent**
  - `home` :
    - `answers without calling any post` (avec un poste qui lève une erreur à tout appel) ;
    - `a seen urgent event leaves urgent` ;
    - `yesterday's phrase is not today's` ;
    - `spend splits chat and routines against their caps`.
  - `dues` :
    - `later hides a due until the next day` ;
    - `done delegates "C’est fait : <text>" to lunavaritia and returns its cards`.
  - `compose-warm` : `keeps the phrase with the context`.
- [ ] **Step 2 : `npm test`.** Attendu : FAIL.
- [ ] **Step 3 : implémenter.**
- [ ] **Step 4 : suite complète.** Attendu : PASS.
- [ ] **Step 5 : commit** `feat(core): home data, seen alerts, due later and done, the day's phrase`.

### Task 9 : l'accueil (après la validation de Task 0)

**Files:**
- Create : `ui/src/screens/Accueil.svelte` et ses blocs, selon la planche validée, avec leurs tests.

**Interfaces:**
- Consumes : `GET /api/home`, `GET /api/dues`, `GET /api/cards`, `CardItem`, les routes `seen`,
  `later` et `done`.

- [ ] **Step 1 : tests qui échouent**
  - `shows the core part at once while a post is still loading` (`/api/cards` retenu) ;
  - `a post that takes more than 8 s says it does not answer, the rest stays usable` ;
  - `urgent first, then dues, then cards, each row in its world` ;
  - `Vu removes an urgent row` ;
  - `Plus tard hides a due` ;
  - `C'est fait shows the replacement card from Avaritia` ;
  - `no phrase today shows only the date`.
- [ ] **Step 2 à 4 : rouge, implémentation, vert.**
- [ ] **Step 5 : commit** `feat(ui): the home, piloting view`.

### Task 10 : la preuve

**Files:**
- Modify : `lun-anima/docs/README.md` (section « Preuve : l'app du core »), `lun-anima/README.md`
  (« Organisation » : `ui/` en PWA, `mobile/` retiré ; « Lancer l'app »), `lun-anima/CLAUDE.md` (les
  apps).

- [ ] **Step 1 : Chrome, 1440 px et 390 px**, avec les vrais serveurs locaux :
  - appairer l'app ;
  - accueil, À valider et Natsume depuis trois sections ;
  - une carte d'Acedia et une d'Avaritia validées ;
  - Lun'Acedia coupé : son bloc dit qu'il ne répond pas.

  Faire des captures sans donnée réelle.
- [ ] **Step 2 : le téléphone de CrOliX en réseau local**, en HTTPS avec un certificat local :
  installer l'app depuis Chrome, faire l'accueil, dicter une demande, valider sa carte.
- [ ] **Step 3 : commit** `docs: core app proof`.

## Hors du palier 1

- Le Journal et l'Écosystème, le catalogue des postes et le contrat v1.3 : palier 2.
- Les notifications et les quatre événements du core : palier 3.
- La reprise du kit commun par Lun'Acedia et Lun'Avaritia : lun-docs#43.
