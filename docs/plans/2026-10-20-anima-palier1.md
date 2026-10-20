# Lun'Anima palier 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** faire de `lun-anima/core` un serveur vivant en local : clients appairés, branchement à
Lun'Acedia par le contrat satellite v1, et conversation minimale avec Natsume (fil principal et
sujets, réponse au fil de l'eau par OpenAI, coûts comptés, plafond journalier).

**Architecture:** `core/` est un serveur Hono sur `node:sqlite`, calqué sur `lun-acedia/server`
(migrations ordonnées, horloge et `fetch` injectés, harnais de test sur base `:memory:`). Trois
modules : `auth/` (appairage des clients du core), `satellites/` (client générique du contrat v1,
écoute SSE, relais), `chat/` (fils, messages, fournisseur, coûts, réponses). Les commandes locales
(`pair-code`, `connect`, `chat`) sont des scripts de `core/src/cli/` ; `pair-code` et `connect`
écrivent dans la même base que le serveur, qui relit ses satellites périodiquement.

**Tech Stack:** Node `^22.13.0 || >=24`, TypeScript ~6.0.3 strict, Vitest, Hono +
`@hono/node-server` (`streamSSE`), `node:sqlite`, zod 4, SDK officiel `openai` (Chat Completions en
flux, `fetch` injecté).

**Spec:** `docs/specs/2026-10-20-anima-palier1-design.md` ; contrat : `standards/contrat-satellite.md` ;
spec de l'écosystème `docs/specs/2026-10-19-ecosysteme-design.md` (§5 à §8). Référence de code :
`lun-acedia/server/src` (`db.ts`, `crypto.ts`, `contract/auth.ts`, `contract/routes.ts`,
`testing/`).

## Global Constraints

- Un chantier = une issue dans `lun-anima` (`niveau:standard`, jalon `J2 Core v1`) + la branche
  `feat/core-palier1` partie de `main` à jour + **une** PR en brouillon dès le premier push ; seul
  CrOliX merge ; jamais de push vers `main`, de push forcé, de tag ni de release.
- Dépôt privé sans ruleset : `git config core.hooksPath hooks` avant le premier commit.
- Code, commits et noms techniques en anglais ; docs, issues, PR et messages affichés à CrOliX en
  français.
- **Aucun test ne touche le réseau ni une vraie clé** : faux OpenAI et faux satellite en mémoire.
- Aucun secret versionné : `.env` (ignoré), `.env.example` sans valeur réelle ; jeton du satellite
  chiffré en base (AES-256-GCM, clé `ANIMA_SECRET_KEY`, 32 octets en base64).
- Dates enregistrées en ISO 8601 UTC ; montants en dollars.
- Journée de Natsume : **de 5 h à 5 h, heure de Paris** (`Europe/Paris`, heure d'été comprise),
  fixée en un seul endroit du code.
- Le core ne remodèle jamais une réponse de satellite qu'il relaie (santé, actions, résultat
  d'action, coûts).
- Contrat satellite v1 tel qu'écrit dans `standards/contrat-satellite.md`.
- Versions : dernières stables à l'exécution, figées par le lockfile ; TypeScript ~6.0.3.

## Review Focus

1. Le client (mobile, terminal) se déconnecte en plein flux : la réponse va au bout, s'enregistre
   en `ok`, et un autre client la lit en entier. → test en Task 6.
2. Clé OpenAI invalide ou crédit épuisé : erreur lisible tout de suite, au plus un appel au
   fournisseur toutes les 5 minutes, rétablissement seul au premier succès. → tests en Tasks 5 et 6.
3. Soirée qui passe minuit, et nuits de changement d'heure : les messages de 23 h 30 et de 0 h 30
   sont dans la même journée ; 4 h 59 et 5 h 00 n'y sont pas. → tests en Task 4.
4. Acedia coupée puis revenue, ou jeton du core révoqué : le core reste debout, montre
   `unreachable` puis `connected`, ou `unpaired` ; pas de doublon d'événement après reprise.
   → tests en Task 3.
5. Deux messages envoyés en même temps dans le même fil (mobile et terminal) : les deux sont
   enregistrés dans l'ordre d'arrivée, chacun reçoit sa réponse, aucune ne se perd.
   → test en Task 6.

---

### Task 1: Serveur, base et appairage des clients

**Files:**
- Modify: `package.json` (racine : scripts `pair-code`, `connect`, `chat`), `core/package.json`
  (dépendances `hono`, `@hono/node-server`, `zod`, `openai` ; scripts `dev` → `src/main.ts`),
  `.env.example`, `.gitignore` (`data/`), `vitest.config.ts` si besoin.
- Create: `core/src/db.ts`, `core/src/crypto.ts` (copie de celui d'Acedia, message d'erreur sur
  `ANIMA_SECRET_KEY`), `core/src/app.ts`, `core/src/main.ts`, `core/src/auth/pairing.ts`,
  `core/src/auth/routes.ts`, `core/src/health.ts`, `core/src/cli/pair-code.ts`,
  `core/src/testing/harness.ts`, `core/src/testing/fake-fetch.ts` (copie de celui d'Acedia).
- Delete: `core/src/index.ts`, `core/src/index.test.ts`.
- Test: `core/src/auth/pairing.test.ts`, `core/src/health.test.ts`.

**Interfaces:**
- Produces:
  - `openDb(path: string): DatabaseSync` : migrations ordonnées comme Acedia (`schema_version`) ;
    première migration : `clients`, `pairing_codes`, `settings`.
  - `issuePairingCode(db, now: Date): string` (6 chiffres, 10 min), `pair(db, code, client, now):
    { token: string } | null`, `requireToken(db): MiddlewareHandler`, `revokeClient(db, id)`.
  - `class CoreHealth { set(key: string, reason: string): void; clear(key: string): void;
    has(key: string): boolean; snapshot(): { status: 'ok' | 'degraded'; reasons: string[] } }`.
  - `interface AppDeps { db: DatabaseSync; clock: () => Date; version: string; health: CoreHealth;
    satellites: SatelliteManager; chat: ChatService }` (les deux derniers arrivent aux Tasks 3 et
    6 ; d'ici là, le harnais n'en fournit pas et les routes correspondantes ne sont pas montées).
  - `createApp(deps: AppDeps): Hono` ; routes : `POST /api/pair { code, client }` →
    `{ token }` (401 `{ error }` si code invalide, utilisé ou expiré), `GET /api/health` →
    `{ status, reasons, version }`. Tout le reste de `/api/*` exige le jeton.
  - `makeHarness()` dans `testing/harness.ts` : `{ app, db, clock, advance(ms), pairClient(name?):
    Promise<string>, auth(token) }`, horloge partant de `2026-11-02T08:00:00.000Z`.
  - Variables `.env.example` : `PORT=8788`, `DB_PATH=./data/anima.db`, `ANIMA_SECRET_KEY=`,
    `OPENAI_API_KEY=`, `OPENAI_CHAT_MODEL=gpt-4o-mini`, `OPENAI_PRICES=`,
    `CHAT_DAILY_CAP_USD=1`, `CHAT_MAX_OUTPUT_TOKENS=800`, `CORE_URL=http://localhost:8788`.

- [ ] **Step 1: Préparer la branche** : `git switch main && git pull --ff-only && git switch -c
  feat/core-palier1`, `git config core.hooksPath hooks`, créer l'issue du chantier (gabarit, critères
  du §6 de la spec), installer les dépendances.

- [ ] **Step 2: Écrire les tests qui échouent**

```ts
// auth/pairing.test.ts
it('pairs a client with a fresh code and accepts its token', ...)
  // issuePairingCode → POST /api/pair { code, client: 'cli' } → 200 { token } ;
  // GET /api/health avec ce jeton → 200
it('refuses a used, unknown or expired code with 401', ...)
  // même code deux fois → 401 la 2e fois ; advance(10 * 60_000 + 1) → 401 ; body.error est une chaîne
it('answers 401 on /api/* without a valid token, and after revocation', ...)
// health.test.ts
it('is ok with no reason, degraded while a reason is set', ...)
  // set('chat', 'Clé OpenAI refusée') → { status: 'degraded', reasons: ['Clé OpenAI refusée'] } ;
  // clear('chat') → { status: 'ok', reasons: [] }
```

- [ ] **Step 3: Vérifier qu'ils échouent** — Run: `npx vitest run core/src/auth core/src/health.test.ts`
  — Expected: FAIL (modules absents).

- [ ] **Step 4: Implémenter** `db.ts`, `crypto.ts`, `auth/*`, `health.ts`, `app.ts`, `main.ts`
  (charge `.env` depuis la racine comme Acedia, ouvre la base, sert sur `PORT`, et comme
  `bootstrapPairing` d'Acedia affiche un code si aucun client n'est appairé) et
  `cli/pair-code.ts` (ouvre `DB_PATH`, émet un code, l'affiche avec sa validité).

- [ ] **Step 5: Vérifier** — Run: `npm run format:check && npm run lint && npm run typecheck && npm test`
  — Expected: tout vert. Puis `npm run dev` démarre et `npm run pair-code` affiche un code à 6 chiffres.

- [ ] **Step 6: Commit** `feat(core): serve the core with paired clients`, push, ouvrir la PR en
  brouillon (gabarit, issue liée).

### Task 2: Appairage d'un satellite et relais

**Files:**
- Create: `core/src/satellites/store.ts`, `core/src/satellites/client.ts`,
  `core/src/satellites/routes.ts`, `core/src/cli/connect.ts`, `core/src/testing/fake-satellite.ts`.
- Modify: `core/src/db.ts` (migration `satellites`), `core/src/app.ts`.
- Test: `core/src/satellites/client.test.ts`, `core/src/satellites/routes.test.ts`.

**Interfaces:**
- Consumes: `encrypt`/`decrypt`, `requireToken`, `makeHarness` (Task 1).
- Produces:
  - Table `satellites (id TEXT PRIMARY KEY, nom TEXT, version TEXT, url TEXT, token_enc TEXT,
    last_event_id TEXT, paired_at TEXT)`.
  - `pairSatellite(deps: { db; fetch; secretKey; now }, url: string, code: string):
    Promise<{ id: string; nom: string; version: string }>` : `POST <url>/lun/v1/pair
    { code, client: 'lun-anima' }`, enregistre (ou remplace, en remettant `last_event_id` à `NULL`)
    la ligne du satellite ; erreur lisible sur 401.
  - `class SatelliteClient { constructor(opts: { url; token; fetch }); health(): Promise<Health>;
    actions(): Promise<Response>; invoke(name: string, body: unknown): Promise<Response>;
    costs(since: string): Promise<Costs>; events(lastEventId?: string, signal?: AbortSignal):
    Promise<Response> }`. Une réponse 401 lève `SatelliteUnpairedError` ; une erreur réseau lève
    `SatelliteUnreachableError`.
  - `class FakeSatellite` (Hono en mémoire, contrat v1, `satellite: { id: 'fake', nom: 'Fake',
    version: '1.0.0' }`) : `url` (`http://fake.satellite`), `fetch` (à injecter), `issueCode()`,
    `setCosts(c: Costs)`,
    `emit(e: Omit<LunEvent, 'id' | 'at'>)`, `setDown(down: boolean)` (toute requête lève comme un
    réseau coupé), `revokeAll()`, `actions` déclarées : `echo` (renvoie son corps), compteur
    d'appels par route.
  - Routes (jeton du core requis) : `GET /api/satellites` → `[{ id, nom, version, link, health? }]`
    avec `link: 'connected' | 'unreachable' | 'unpaired'` ; `GET /api/satellites/:id/actions` et
    `POST /api/satellites/:id/actions/:name` relaient **statut et corps tels quels** ; 404
    `{ error }` pour un satellite inconnu.
  - `cli/connect.ts` : `npm run connect -- <url> <code>` appelle `pairSatellite` et affiche le nom
    du satellite branché.

- [ ] **Step 1: Écrire les tests qui échouent**

```ts
it('pairs with a satellite code and stores its token encrypted', ...)
  // pairSatellite(fake.url, fake.issueCode()) → { id: 'fake', ... } ;
  // la colonne token_enc ne contient pas le jeton en clair ; decrypt(...) le redonne
it('re-pairing replaces the token and resets the event cursor', ...)
it('lists the satellite with its health, relayed as is', ...)
  // GET /api/satellites → [{ id: 'fake', link: 'connected', health: { status: 'ok', version: '1.0.0' } }]
it('relays an action and its result untouched', ...)
  // POST /api/satellites/fake/actions/echo { a: 1 } → 200, corps identique à celui du FakeSatellite
it('shows unreachable when the satellite is down, unpaired when it refuses the token', ...)
it('answers 404 for an unknown satellite', ...)
```

- [ ] **Step 2: Vérifier qu'ils échouent** — Run: `npx vitest run core/src/satellites` — Expected: FAIL.
- [ ] **Step 3: Implémenter** store, client, routes, `FakeSatellite`, `cli/connect.ts`.
- [ ] **Step 4: Vérifier** — Run: `npx vitest run core/src/satellites` — Expected: PASS ; puis les
  quatre barrières.
- [ ] **Step 5: Commit** `feat(core): pair with a satellite and relay its contract`, push.

### Task 3: Écoute des événements et reconnexion

**Files:**
- Create: `core/src/satellites/sse.ts`, `core/src/satellites/listener.ts`,
  `core/src/satellites/manager.ts`, `core/src/events/store.ts`, `core/src/events/routes.ts`.
- Modify: `core/src/db.ts` (migration `events`), `core/src/app.ts`, `core/src/main.ts`,
  `core/src/satellites/routes.ts` (l'état `link` vient du gestionnaire).
- Test: `core/src/satellites/sse.test.ts`, `core/src/satellites/listener.test.ts`,
  `core/src/events/routes.test.ts`.

**Interfaces:**
- Consumes: `SatelliteClient`, `FakeSatellite`, table `satellites` (Task 2).
- Produces:
  - Table `events (id INTEGER PRIMARY KEY AUTOINCREMENT, satellite_id TEXT, remote_id TEXT,
    at TEXT, type TEXT, importance TEXT, title TEXT, data TEXT, received_at TEXT,
    UNIQUE (satellite_id, remote_id, at))`.
  - `parseSse(stream: ReadableStream<Uint8Array>): AsyncIterable<{ id?: string; event?: string;
    data: string }>`.
  - `class SatelliteManager { constructor(deps: { db; fetch; secretKey; clock; retryBaseMs?:
    number; retryMaxMs?: number }); refresh(): void /* démarre l'écoute des satellites nouveaux ou
    réappairés */; link(id: string): 'connected' | 'unreachable' | 'unpaired'; client(id: string):
    SatelliteClient | undefined; list(): string[]; stop(): Promise<void> }`. `main.ts` appelle
    `refresh()` au démarrage puis toutes les 15 s.
  - Écoute : `events(last_event_id)` ; chaque événement est inséré (`INSERT OR IGNORE`) puis
    `last_event_id` avancé ; coupure → `unreachable`, nouvel essai après `retryBaseMs` (1 s) doublé
    jusqu'à `retryMaxMs` (60 s), remis à la base après une connexion réussie ; 401 → `unpaired`,
    plus d'essai jusqu'au prochain appairage.
  - `GET /api/events?after=<id local>&limit=<≤ 200, défaut 50>` → `{ items: [{ id, satellite,
    event: LunEvent }], cursor? }`, dans l'ordre d'arrivée.

- [ ] **Step 1: Écrire les tests qui échouent**

```ts
it('parses SSE frames split across chunks, with ids and multi-line data', ...)
it('stores each event once and resumes with Last-Event-ID after a cut', ...)
  // 2 événements → setDown(true) → link 'unreachable' → emit 1 → setDown(false) →
  // 3 lignes en base, aucune en double ; la dernière requête events porte last-event-id
it('backs off while the satellite is down, then reconnects on its own', ...)
  // retryBaseMs: 10 ; les essais sont espacés de façon croissante ; link redevient 'connected'
it('stops retrying and shows unpaired on 401', ...)
it('picks up a satellite paired while the server runs', ...)   // pairSatellite puis refresh()
it('lists the stored events in arrival order with a cursor', ...)
```

- [ ] **Step 2: Vérifier qu'ils échouent** — Run: `npx vitest run core/src/satellites core/src/events`
  — Expected: FAIL.
- [ ] **Step 3: Implémenter** `sse.ts`, `listener.ts`, `manager.ts`, `events/*` ; brancher dans
  `main.ts`.
- [ ] **Step 4: Vérifier** — mêmes tests PASS, puis les quatre barrières.
- [ ] **Step 5: Commit** `feat(core): listen to satellite events and reconnect`, push.

### Task 4: Fils, messages et journée de Natsume

**Files:**
- Create: `core/src/chat/day.ts`, `core/src/chat/store.ts`, `core/src/chat/routes.ts` (lecture et
  création de sujets ; l'envoi arrive en Task 6).
- Modify: `core/src/db.ts` (migration `threads`, `messages`, et création du fil principal),
  `core/src/app.ts`.
- Test: `core/src/chat/day.test.ts`, `core/src/chat/store.test.ts`, `core/src/chat/routes.test.ts`.

**Interfaces:**
- Produces:
  - `natsumeDay(at: Date): string` (`YYYY-MM-DD`) : date de Paris de `at`, moins un jour si l'heure
    de Paris est avant 5 h. `dayStart(day: string): Date` : l'instant UTC de 5 h à Paris ce jour-là.
    Constantes `DAY_TIME_ZONE = 'Europe/Paris'`, `DAY_START_HOUR = 5`, seules dans `day.ts`.
    Implémentation par `Intl.DateTimeFormat` (composantes de l'heure de Paris), jamais en
    retranchant 5 heures d'un instant UTC (faux les nuits de changement d'heure).
  - Tables `threads (id TEXT PRIMARY KEY, kind TEXT CHECK (kind IN ('main', 'topic')), title TEXT,
    created_at TEXT)` avec la ligne `('main', 'main', NULL, …)` créée par la migration ;
    `messages (id INTEGER PRIMARY KEY AUTOINCREMENT, thread_id TEXT, role TEXT CHECK (role IN
    ('user', 'assistant')), text TEXT, surface TEXT, at TEXT, day TEXT, status TEXT CHECK (status IN
    ('pending', 'ok', 'partial', 'error')), error TEXT, model TEXT, input_tokens INTEGER,
    output_tokens INTEGER, cost REAL)`.
  - `type Surface = 'mobile' | 'desktop' | 'voice' | 'cli'`.
  - `interface Message { id: number; threadId: string; role: 'user' | 'assistant'; text: string;
    surface: Surface; at: string; day: string; status: 'pending' | 'ok' | 'partial' | 'error';
    error?: string; model?: string; inputTokens?: number; outputTokens?: number; cost?: number }`.
  - `createTopic(db, title: string, now): Thread`, `listThreads(db): Thread[]` (principal en tête,
    puis sujets du plus récent au plus ancien message), `addMessage(db, m: Omit<Message, 'id' |
    'day'>): Message` (calcule `day`), `updateMessage(db, id, patch)`, `listMessages(db, threadId,
    opts: { day?: string; before?: number; limit?: number }): { items: Message[]; cursor?: string }`
    (du plus ancien au plus récent dans la page ; `before` pagine vers le passé),
    `recentForContext(db, threadId, maxMessages = 40, maxChars = 16_000): Message[]` (statut `ok`
    seulement, les plus récents qui tiennent dans la borne, remis dans l'ordre chronologique).
  - Routes : `GET /api/threads`, `POST /api/threads { title }` (1 à 120 caractères) → sujet,
    `GET /api/threads/:id/messages?day=&before=&limit=` ; 404 pour un fil inconnu.

- [ ] **Step 1: Écrire les tests qui échouent**

```ts
// day.test.ts
expect(natsumeDay(new Date('2026-11-02T22:30:00Z'))).toBe('2026-11-02') // 23 h 30 Paris (UTC+1)
expect(natsumeDay(new Date('2026-11-02T23:30:00Z'))).toBe('2026-11-02') // 0 h 30 le 3
expect(natsumeDay(new Date('2026-11-03T03:59:00Z'))).toBe('2026-11-02') // 4 h 59
expect(natsumeDay(new Date('2026-11-03T04:00:00Z'))).toBe('2026-11-03') // 5 h 00
expect(natsumeDay(new Date('2026-07-10T02:59:00Z'))).toBe('2026-07-09') // 4 h 59 heure d'été
expect(natsumeDay(new Date('2027-03-28T03:00:00Z'))).toBe('2027-03-28') // 5 h 00, nuit du passage à l'heure d'été
expect(dayStart('2026-11-03').toISOString()).toBe('2026-11-03T04:00:00.000Z')
expect(dayStart('2026-07-10').toISOString()).toBe('2026-07-10T03:00:00.000Z')
// store.test.ts
it('has the main thread from the start, and topics created on demand', ...)
it('stores the surface and the Natsume day of each message', ...)
it('lists a thread by day and pages back in time', ...)
it('keeps only ok messages for the context, within the bounds', ...) // erreurs et partiels exclus
// routes.test.ts
it('lists threads, creates a topic, reads its messages; 404 for an unknown thread', ...)
```

- [ ] **Step 2: Vérifier qu'ils échouent** — Run: `npx vitest run core/src/chat` — Expected: FAIL.
- [ ] **Step 3: Implémenter** `day.ts`, `store.ts`, `routes.ts`.
- [ ] **Step 4: Vérifier** — mêmes tests PASS, puis les quatre barrières.
- [ ] **Step 5: Commit** `feat(core): store threads and messages by Natsume day`, push.

### Task 5: Fournisseur OpenAI, coûts et plafond

**Files:**
- Create: `core/src/chat/provider.ts`, `core/src/chat/openai.ts`, `core/src/chat/costs.ts`,
  `core/src/testing/fake-openai.ts`.
- Modify: `core/src/db.ts` (migration `costs`).
- Test: `core/src/chat/openai.test.ts`, `core/src/chat/costs.test.ts`.

**Interfaces:**
- Produces:
  - `type ChatTurn = { role: 'system' | 'user' | 'assistant'; content: string }`.
  - `type ChatChunk = { type: 'delta'; text: string } | { type: 'done'; inputTokens: number;
    outputTokens: number }`.
  - `interface ChatProvider { readonly name: string; stream(req: { model: string; turns: ChatTurn[];
    maxTokens: number }): AsyncIterable<ChatChunk> }`.
  - `class ProviderError extends Error { kind: 'auth' | 'credit' | 'unavailable' }`.
  - `createOpenAiProvider(opts: { apiKey: string; fetch?: typeof fetch }): ChatProvider` : SDK
    `openai`, `chat.completions.create({ stream: true, stream_options: { include_usage: true },
    max_completion_tokens })` ; 401 → `auth` ; 429 avec `code: 'insufficient_quota'` → `credit` ;
    tout le reste (réseau, 5xx, 429 de débit) → `unavailable`. Le SDK ne réessaie pas
    (`maxRetries: 0`) : le core décide.
  - `FakeOpenAi` : `fetch` à injecter ; `reply(text: string, usage?)` découpe le texte en plusieurs
    morceaux SSE ; `fail(status, body)` ; `hang()` (flux qui ne se termine qu'à `release()`) ;
    `calls` compte les requêtes.
  - `DEFAULT_PRICES: Record<string, [input: number, output: number]>` en dollars par million de
    jetons : `{ 'gpt-4o-mini': [0.15, 0.6] }` ; `pricesFrom(env: string | undefined)` fusionne
    `OPENAI_PRICES` (JSON `{"modèle":[entrée,sortie]}`) ; `priceOf(prices, model)` →
    `[number, number] | undefined`.
  - Table `costs (id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT, provider TEXT, model TEXT,
    amount REAL, calls INTEGER)`. `recordCost(db, { at, provider, model, amount })`,
    `spentSince(db, since: Date): number`, `costsSince(db, since: string, until: string): Costs`
    (format du contrat, regroupé par fournisseur et modèle).
  - `costOf(price, inputTokens, outputTokens): number` = `(in × p_in + out × p_out) / 1e6`.

- [ ] **Step 1: Écrire les tests qui échouent**

```ts
it('streams the reply in chunks and reports the usage', ...)
  // FakeOpenAi.reply('Bonjour CrOliX', { prompt_tokens: 12, completion_tokens: 4 }) →
  // plusieurs 'delta' dont la concaténation vaut 'Bonjour CrOliX', puis { type: 'done', 12, 4 }
it('sends the model, the turns and the token limit', ...) // corps de la requête : model, messages, max_completion_tokens: 800
it('maps 401 to auth, insufficient_quota to credit, the rest to unavailable', ...)
it('prices a call per million tokens', ...)
  // costOf([0.15, 0.6], 1_000_000, 1_000_000) === 0.75 ; costOf([0.15, 0.6], 12, 4) ≈ 0.0000042
it('lets OPENAI_PRICES add or override a model, and knows no price for an unknown one', ...)
it('sums the spend since an instant, and returns contract Costs', ...)
```

- [ ] **Step 2: Vérifier qu'ils échouent** — Run: `npx vitest run core/src/chat/openai.test.ts core/src/chat/costs.test.ts` — Expected: FAIL.
- [ ] **Step 3: Implémenter** `provider.ts`, `openai.ts`, `costs.ts`, `fake-openai.ts`.
- [ ] **Step 4: Vérifier** — mêmes tests PASS, puis les quatre barrières.
- [ ] **Step 5: Commit** `feat(core): stream replies from OpenAI and count their cost`, push.

### Task 6: Envoyer un message et recevoir la réponse

**Files:**
- Create: `core/src/chat/service.ts`, `core/src/chat/prompt.ts`.
- Modify: `core/src/chat/routes.ts` (envoi), `core/src/app.ts`, `core/src/main.ts`,
  `core/src/testing/harness.ts` (option `provider`).
- Test: `core/src/chat/service.test.ts`, `core/src/chat/send.test.ts`.

**Interfaces:**
- Consumes: store et `natsumeDay`/`dayStart` (Task 4), `ChatProvider`, `ProviderError`, coûts
  (Task 5), `CoreHealth` (Task 1).
- Produces:
  - `SYSTEM_PROMPT` dans `prompt.ts`, texte exact : « Tu es Natsume, l'assistante de CrOliX.
    Réponds en français, de façon naturelle et concise. Ta personnalité n'est pas encore définie :
    reste neutre et bienveillante. »
  - `class ChatService { constructor(deps: { db; clock; health; provider?: ChatProvider; model:
    string; prices; dailyCapUsd: number; maxTokens: number }); send(threadId: string, text: string,
    surface: Surface): { user: Message; reply: ReplyHandle }; settled(): Promise<void> }` ;
    `interface ReplyHandle { id: number; subscribe(listener: (e: ReplyEvent) => void): () => void }` ;
    `type ReplyEvent = { type: 'delta'; text: string } | { type: 'done'; message: Message }`.
  - Déroulé de `send` : enregistre le message de CrOliX ; crée la réponse en `pending` ; vérifie dans
    l'ordre (a) fournisseur configuré et prix connu, sinon raison `chat` « Conversation non
    configurée : … » ; (b) plafond : `spentSince(dayStart(natsumeDay(now))) >= dailyCapUsd` →
    réponse `error` « Plafond du jour atteint (1,00 $). La conversation reprend à 5 h. » ; (c) raison
    `chat` posée et dernier essai il y a moins de 5 minutes → réponse `error` avec la raison, sans
    appel ; sinon appelle le fournisseur avec `SYSTEM_PROMPT` + `recentForContext` + le nouveau
    message. Succès : `ok`, modèle, jetons, coût enregistré, raison `chat` effacée. `ProviderError`
    `auth` / `credit` : raison `chat` posée (« Clé OpenAI refusée » / « Crédit OpenAI épuisé »),
    réponse `error`. Coupure après au moins un morceau : `partial` avec le texte reçu.
  - La génération ne dépend d'aucun client : elle tourne dans le service, les abonnés ne font que
    l'écouter. Les envois dans un même fil sont traités **un à la fois, dans l'ordre d'arrivée**
    (file par fil), pour que chaque réponse voie la précédente.
  - `POST /api/threads/:id/messages { text (1 à 8 000 caractères), surface }` → flux SSE :
    `user` (le message enregistré), `delta` `{ text }`…, puis `done` (la réponse enregistrée, quel
    que soit son statut). 400 corps invalide, 404 fil inconnu.

- [ ] **Step 1: Écrire les tests qui échouent**

```ts
// service.test.ts (faux fournisseur en mémoire)
it('stores the user message and a streamed ok reply with model, tokens and cost', ...)
it('sends the system prompt, the ok history and the new message to the provider', ...)
it('refuses past the daily cap until 5 am Paris, then answers again', ...)
  // dépense enregistrée = cap → réponse error contenant 'Plafond du jour atteint' ;
  // avance l'horloge jusqu'à dayStart du lendemain → réponse ok
it('on a refused key: error reply, degraded health, at most one provider call per 5 minutes, recovery on success', ...)
  // fail(401) ; 3 envois en 1 min → 1 seul appel ; advance(5 min) → nouvel essai ; succès → health ok
it('keeps the partial text when the stream breaks', ...)
it('answers two messages sent at once in the same thread, in order', ...)
// send.test.ts (route HTTP, FakeOpenAi)
it('streams user, deltas and done over SSE', ...)
it('finishes and stores the reply when the client disconnects mid-stream', ...)
  // hang() → lire 1 delta → abort → release() → settled() → message 'ok' complet, lisible via GET
it('answers 400 on an empty text or an unknown surface, 404 on an unknown thread', ...)
```

- [ ] **Step 2: Vérifier qu'ils échouent** — Run: `npx vitest run core/src/chat` — Expected: FAIL.
- [ ] **Step 3: Implémenter** `prompt.ts`, `service.ts`, la route d'envoi ; brancher dans `main.ts`
  (fournisseur absent si `OPENAI_API_KEY` vide, ce qui pose la raison `chat` au démarrage).
- [ ] **Step 4: Vérifier** — mêmes tests PASS, puis les quatre barrières.
- [ ] **Step 5: Commit** `feat(core): converse with Natsume in threads`, push.

### Task 7: Coûts agrégés, discussion en terminal et preuve du palier

**Files:**
- Create: `core/src/costs/routes.ts`, `core/src/cli/chat.ts`, `docs/decisions/0001-core-palier1.md`
  (lun-anima).
- Modify: `core/src/app.ts`, `README.md`, `CLAUDE.md` (commandes locales), `docs/README.md`,
  `.gitignore` (`data/cli.token`).
- Test: `core/src/costs/routes.test.ts`, `core/src/cli/chat.test.ts`.

**Interfaces:**
- Consumes: `costsSince` (Task 5), `SatelliteManager.client` / `list` (Task 3).
- Produces:
  - `GET /api/costs?since=<ISO>` → `{ since, until, total, sources: [{ source: 'core', costs: Costs }
    | { source: '<id satellite>', costs: Costs } | { source: '<id>', error: string }] }` : les
    `Costs` d'un satellite sont recopiés tels quels ; `total` additionne les sources disponibles ;
    400 si `since` est illisible.
  - `cli/chat.ts` : `npm run chat [-- --topic "<titre>" | --thread <id>]`. Au premier lancement sans
    `data/cli.token`, demande un code (`npm run pair-code`), s'appaire et garde le jeton. Ensuite :
    une invite, chaque ligne envoyée avec la surface `cli`, la réponse affichée au fil de l'eau ;
    les erreurs du core affichées telles quelles. Le cœur testable : `runChat(opts: { coreUrl;
    fetch; input: AsyncIterable<string>; output: (s: string) => void; tokenStore })`.
  - Décision `0001-core-palier1.md` : stack calquée sur Acedia, fournisseur derrière
    `ChatProvider`, journée 5 h Paris, plafond borné à une réponse, commandes locales qui écrivent
    dans la base.

- [ ] **Step 1: Écrire les tests qui échouent**

```ts
it('shows the core spend and each satellite spend side by side, with a total', ...)
  // FakeSatellite costs total 0.42, core 0.10 → total 0.52 ; le Costs du satellite est deepEqual à sa réponse
it('keeps the other sources when a satellite cannot answer', ...) // { source: 'fake', error: … }
it('answers 400 on an unreadable since', ...)
it('pairs on first run, then streams the reply of each line', ...) // runChat avec le harnais comme fetch
```

- [ ] **Step 2: Vérifier qu'ils échouent** — Run: `npx vitest run core/src/costs core/src/cli` — Expected: FAIL.
- [ ] **Step 3: Implémenter** la route, `runChat` et son point d'entrée, la décision, la doc.
- [ ] **Step 4: Vérifier** — Run: `npm run format:check && npm run lint && npm run typecheck && npm test`
  — Expected: tout vert.
- [ ] **Step 5: Preuve de bout en bout, en local** (vraie clé OpenAI de CrOliX et Acedia locale sur
  le compte Google de test) ; consigner chaque sortie dans la PR :
  1. `npm run dev` dans `lun-acedia` et dans `lun-anima` ;
  2. code d'appairage lu dans le front d'Acedia → `npm run connect -- http://localhost:8787 <code>` ;
  3. `npm run chat` : appairage, trois échanges dans le fil principal, réponses au fil de l'eau ;
     `npm run chat -- --topic "Essai"` : un échange dans un sujet ;
  4. `GET /api/satellites`, `/api/events`, `/api/costs` (avec le jeton du terminal) : Acedia
     `connected`, événements reçus, dépense du core et d'Acedia côte à côte ;
  5. arrêter Acedia : le core reste debout et la montre `unreachable` ; la relancer : `connected`
     sans intervention ;
  6. `CHAT_DAILY_CAP_USD=0.0001` : refus propre ; clé volontairement fausse : erreur lisible.
- [ ] **Step 6: Commit** `feat(core): aggregate costs and chat from the terminal`, push, cocher les
  critères dans la PR et la passer « prête ».

## Hors de ce plan

Personnalité, cerveau et contexte chaud, résumé des autres fils, nuit et briefing, modes, voix et
avatar, apps, actions d'Acedia invoquées par Natsume pendant la conversation, choix du modèle par
module et second fournisseur, pause et interrupteur général, déploiement sur le NAS.
