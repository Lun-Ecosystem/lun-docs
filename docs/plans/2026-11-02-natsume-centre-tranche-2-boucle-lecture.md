# Natsume au centre, slice 2: the read loop and the state — Implementation Plan

> **Livré** par [lun-anima#20](https://github.com/Lun-Ecosystem/lun-anima/pull/20). Cases cochées le 07/11/2026 d'après cette livraison, sans recontrôle tâche par tâche.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** The core keeps what every post last served (cards, dues, agenda, costs, health) in its own tables, refreshed by a background loop, and answers `GET /api/state`, `/api/queue`, `/api/upcoming`, `/api/posts/:id` and `POST /api/posts/:id/check` from that cache alone.

**Architecture:** A `ReadLoop` (new `core/src/reads/`) reads each paired post on every SSE signal from its listener (coalesced) and every 2 minutes, writes `card_reads`, `post_status` and `read_cache`, and never looks at any pause. Pure builders (`postStates`, `buildQueue`, `buildUpcoming`, `buildState`) turn those rows into the route bodies; `/api/state` is a summary of `buildQueue` and `postStates`, so every counter has one source. Contract v1.4 fields are added to the core's own contract types and stored where they arrive.

**Tech Stack:** Node `^22.13.0 || >=24`, TypeScript run by `--experimental-strip-types`, Hono 4, `node:sqlite`, zod 4, vitest 5 (root `vitest.config.ts`, project `core`).

**Spec:** `lun-docs/docs/specs/2026-11-02-natsume-au-centre-design.md` (§4.3, §5, §6.1, §6.2, §7, §9.1, §9.2, §9.7, §9.8, §14, §15 slice 2).

**Repo / branch:** `D:/projets/projets perso/LunEcosystem/lun-anima`, new branch `feat/core-read-loop` cut from `feat/core-app-palier-2`.

## Global Constraints

- Node `^22.13.0 || >=24`; no new dependency (zod, hono, node:sqlite are already there).
- Migrations are appended to `MIGRATIONS` in `core/src/db.ts`, never edited.
- « Les routes de l'API ne parlent que d'identifiants de satellite (`lunacedia`), les adresses de l'app que d'identifiants de monde (`acedia`). » An API path given a world id (`acedia`) answers 404.
- « `/api/state`, `/api/queue` et le Bureau ne lisent que ce cache, jamais un poste en direct. » Every GET of this slice makes zero satellite calls.
- « Une lecture est **périmée** (`stale`) quand la dernière tentative a échoué ou quand la dernière réussite date de plus de 5 minutes. »
- Loop rhythm: « dès qu'un événement de son flux SSE arrive, et sinon toutes les 2 minutes ». « Elle tourne pendant une pause » : the loop takes no pause input, and slice 5 must not add one.
- « Pas de nouvelle sonde périodique » : `health()` (8 s bound) is called only inside a loop pass or a check.
- « Aucun nom d'agent n'est écrit en dur, ni dans le core » : `agentName` only from `Health.agentName`; absent or blank, no field.
- A post below contract v1.4 is `muet` (§9.8).
- Error and reason strings stored for display are French, like the existing core; code, comments and commits in English.
- Test command: `npx vitest run --project core <file>` from the repo root; full gate `npm test && npm run lint && npm run typecheck && npm run format:check`.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

**Rulings made where the spec is silent (binding for this plan):**

- Contract version: the core reads it from `Health.contract` (added by slice 1 as `CONTRACT = '1.4'` in each satellite's identity.ts; `Health.version` stays the package version): `major > 1 || (major === 1 && minor >= 4)`; absent or unreadable is below v1.4.
- World data in the core: `core/src/worlds.ts` lists the seven worlds in heptagram order; satellite id = `lun` + world. The front's world data (slice 6) owns names and places; it must list the same ids.
- `inconnu`: no loop pass for that post has finished since this process started (kept in memory by the loop).
- `injoignable`: listener link is not `connected`, or the last pass's `health()` failed. A token refused (`unpaired` link or no client) is `injoignable` with `reason: 'liaison'`.
- Dues, agenda and costs are cached in one generic table `read_cache (key, read_at, value)`, keys `dues`, `agenda`, `costs:<satelliteId>`.
- Pile: two or more pending cards of one post with the same `kind ?? 'Carte'` and the same `title`.
- Urgent window: unchanged from `/home` (unseen urgent events of Natsume's day).
- `Ce qui vient` window: from now to the next 07:30 morning slot after the end of Natsume's day; all-day events and tasks due today go to `tasks` (no hour).
- A reminder (`agenda.reminder`) goes to `Ce qui vient` at its `data.at`, unless an agenda item with the same `data.id` is already listed.
- `/api/state` in this slice has no `pause` and no caps (slice 5 adds them); `spend` keeps the current `/home` figures; `route` has no caps line yet.
- `ROLES.lunacedia` in `core/src/chat/posts.ts` loses « (agente : Pina) » (§14, no agent name in the core).

## Review Focus

1. A replay of hundreds of missed SSE events at start-up must give one or two reads of that post, not hundreds (coalescing) — pinned in Task 4.
2. A post that answers health but serves a malformed `/cards` body keeps its previous cards visible, marked stale, never an empty group — pinned in Task 4.
3. A satellite still on v1.3 (no `contract` field, as today) reads as `muet` with `reason: 'contrat'`, its cards read-only and never batchable — pinned in Tasks 5 and 6.
4. The core's own pause (`pausedBy: 'core'`) must not make a post `muet`; only `pausedBy: 'local'` does — pinned in Task 5.
5. `state.queue.total` equals `queue.total`, and both drop by one when a card leaves the post's list — pinned in Task 8.

---

### Task 1: Contract v1.4 types and event lines

**Files:**
- Modify: `core/src/satellites/client.ts` (types `Health`, `Card`, `LunEvent`)
- Modify: `core/src/db.ts` (append migration)
- Modify: `core/src/events/store.ts` (`storeEvent`, `toStored`)
- Test: `core/src/events/store.test.ts` (create)

**Interfaces:**
- Produces:
  - `Health` gains `contract?: string; pausedBy?: 'core' | 'local'; agentName?: string`.
  - `Card` gains `kind?: string; reason?: string; sends?: true; options?: string[]`.
  - `LunEvent` gains `lines?: string[]`.
  - `events.lines TEXT` (JSON `string[]` or NULL); `StoredEvent.event.lines` restored when present.

- [x] **Step 0: Branch**

Run: `git switch feat/core-app-palier-2 && git pull && git switch -c feat/core-read-loop`
Expected: `Switched to a new branch 'feat/core-read-loop'`

- [x] **Step 1: Write the failing tests**

```ts
// core/src/events/store.test.ts — uses openDb(':memory:'), inserts a satellites row (token_enc 't').
it('keeps the lines of an event', () => {
  storeEvent(db, { satelliteId: 'lunacedia', tokenEnc: 't', lastEventId: '1', receivedAt: now,
    event: { id: '1', type: 'mail.urgent', importance: 'urgent', at: AT, title: 'Banque', lines: ['De : banque', 'Objet : justificatif'] } });
  expect(listEvents(db, 0, 10).items[0]!.event.lines).toEqual(['De : banque', 'Objet : justificatif']);
});
it('drops lines that are not a list of strings', () => {
  storeEvent(db, { ...received('2'), event: { ...ev('2'), lines: [1, 'x'] as never } });
  expect(listEvents(db, 0, 10).items[0]!.event).not.toHaveProperty('lines');
});
```

- [x] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/events/store.test.ts`
Expected: FAIL (`lines` undefined)

- [x] **Step 3: Implement**

Append migration `ALTER TABLE events ADD COLUMN lines TEXT;` (comment: « v1.4: what an urgent event shows unfolded »). In `storeEvent`, write `JSON.stringify(event.lines)` only when `Array.isArray(event.lines) && event.lines.every((l) => typeof l === 'string')`, else NULL. `toStored` sets `event.lines` when the column is not NULL. Add the type fields with one-line doc comments quoting §9.8.

- [x] **Step 4: Run to verify they pass**

Run: `npx vitest run --project core core/src/events core/src/satellites`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add core/src/satellites/client.ts core/src/db.ts core/src/events/store.ts core/src/events/store.test.ts
git commit -m "feat(core): contract v1.4 fields and stored event lines" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Read tables and their store

**Files:**
- Modify: `core/src/db.ts` (append one migration)
- Create: `core/src/reads/store.ts`
- Test: `core/src/reads/store.test.ts`

**Interfaces:**
- Produces (all in `core/src/reads/store.ts`):
  - `STALE_MS = 5 * 60_000`
  - `isStale(readAt: string | undefined, failed: boolean, now: Date): boolean`
  - `saveCardRead(db, satelliteId: string, at: Date, cards: Card[]): void` (upsert). **Slice 3 hooks here** to journal cards absent from the previous row (« Une carte entre au Journal à sa première lecture »).
  - `cardRead(db, satelliteId): { readAt: string; cards: Card[] } | undefined`
  - `interface PostStatus { lastContact?: string; lastSuccess?: string; lastCount?: number; lastErrorAt?: string; lastError?: string; downSince?: string; readFailed: boolean; health?: Health }`
  - `postStatus(db, satelliteId): PostStatus` (empty `{ readFailed: false }` when no row)
  - `touchContact(db, id, at: Date): void`
  - `recordFailure(db, id, at: Date, reason: string, opts: { read: boolean; down: boolean }): void` — sets `lastErrorAt/lastError`; `read` sets `readFailed`; `down` sets `downSince` if NULL and clears `health`.
  - `recordSuccess(db, id, at: Date, health: Health, count: number): void` — sets contact, success, count, health; clears `readFailed` and `downSince`.
  - `saveCache(db, key: string, at: Date, value: unknown): void`, `cached<T>(db, key): { readAt: string; value: T } | undefined`

- [x] **Step 1: Write the failing tests**

```ts
it('a read is stale after 5 minutes or after a failed attempt', () => {
  const at = '2026-11-02T08:00:00.000Z';
  expect(isStale(at, false, new Date('2026-11-02T08:05:00.000Z'))).toBe(false);
  expect(isStale(at, false, new Date('2026-11-02T08:05:00.001Z'))).toBe(true);
  expect(isStale(at, true, new Date('2026-11-02T08:00:01.000Z'))).toBe(true);
  expect(isStale(undefined, false, new Date(at))).toBe(true);
});
it('a failure keeps the last cards and the first down time', () => {
  saveCardRead(db, 'lunacedia', t(0), [card('a')]);
  recordSuccess(db, 'lunacedia', t(0), { status: 'ok', version: '0.0.0', contract: '1.4' }, 1);
  recordFailure(db, 'lunacedia', t(1), 'Satellite injoignable', { read: true, down: true });
  recordFailure(db, 'lunacedia', t(2), 'Satellite injoignable', { read: true, down: true });
  expect(cardRead(db, 'lunacedia')!.cards.map((c) => c.id)).toEqual(['a']);
  expect(postStatus(db, 'lunacedia')).toMatchObject({ readFailed: true, downSince: t(1).toISOString(), lastSuccess: t(0).toISOString() });
  expect(postStatus(db, 'lunacedia').health).toBeUndefined();
  recordSuccess(db, 'lunacedia', t(3), { status: 'ok', version: '0.0.0', contract: '1.4' }, 1);
  expect(postStatus(db, 'lunacedia')).toMatchObject({ readFailed: false, lastCount: 1 });
  expect(postStatus(db, 'lunacedia').downSince).toBeUndefined();
});
```

- [x] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/reads/store.test.ts`
Expected: FAIL (module not found)

- [x] **Step 3: Implement**

Migration:

```sql
CREATE TABLE card_reads (satellite_id TEXT PRIMARY KEY, read_at TEXT NOT NULL, cards TEXT NOT NULL);
CREATE TABLE post_status (
  satellite_id TEXT PRIMARY KEY, last_contact TEXT, last_success TEXT, last_count INTEGER,
  last_error_at TEXT, last_error TEXT, down_since TEXT, read_failed INTEGER NOT NULL DEFAULT 0, health TEXT
);
CREATE TABLE read_cache (key TEXT PRIMARY KEY, read_at TEXT NOT NULL, value TEXT NOT NULL);
```

Functions are one upsert each (`INSERT … ON CONFLICT(satellite_id) DO UPDATE`); NULL columns map to absent fields.

- [x] **Step 4: Run to verify they pass**

Run: `npx vitest run --project core core/src/reads/store.test.ts`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add core/src/db.ts core/src/reads/store.ts core/src/reads/store.test.ts
git commit -m "feat(core): card_reads, post_status and read_cache tables" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Listener signals

**Files:**
- Modify: `core/src/satellites/listener.ts` (`ListenerDeps`, `#run`, `#receive`)
- Modify: `core/src/satellites/manager.ts` (`ManagerDeps`, `refresh`)
- Test: `core/src/satellites/listener.test.ts` (add a `describe`)

**Interfaces:**
- Produces:
  - `export type Signal = { kind: 'open' } | { kind: 'event' } | { kind: 'cut'; reason: string }` in `listener.ts`.
  - `ListenerDeps.onSignal?: (signal: Signal) => void`
  - `ManagerDeps.onSignal?: (satelliteId: string, signal: Signal) => void`, passed to each listener bound to its row id.

- [x] **Step 1: Write the failing test**

```ts
it('signals open, each stored event, and a cut', async () => {
  const signals: string[] = [];
  // setup() variant: makeHarness gets onSignal through a new harness option `onSignal`.
  const { fake, manager } = await setup({ onSignal: (id, s) => signals.push(`${id}:${s.kind}`) });
  manager.refresh();
  await waitFor(() => signals.includes('fake:open'));
  fake.emit({ type: 'mail', importance: 'normal', title: 'Un' });
  await waitFor(() => signals.includes('fake:event'));
  fake.setDown(true);
  await waitFor(() => signals.includes('fake:cut'));
});
```

- [x] **Step 2: Run to verify it fails**

Run: `npx vitest run --project core core/src/satellites/listener.test.ts`
Expected: FAIL (no signal)

- [x] **Step 3: Implement**

Call `onSignal({ kind: 'open' })` right after `this.#link = 'connected'`; `{ kind: 'event' }` after a successful `storeEvent` in `#receive`; `{ kind: 'cut', reason: message }` in the non-abort `catch` (also for `unpaired`), and once when the stream ends without error (reason `Flux d'événements fermé`). A throwing `onSignal` is caught and logged, never ends the listener. Harness: add `onSignal?` to `HarnessOptions`, passed to the manager (Task 4 keeps it and calls it after `reads.signal`).

- [x] **Step 4: Run to verify it passes**

Run: `npx vitest run --project core core/src/satellites`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add core/src/satellites/listener.ts core/src/satellites/manager.ts core/src/satellites/listener.test.ts core/src/testing/harness.ts
git commit -m "feat(core): listeners signal open, event and cut" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: The read loop

**Files:**
- Create: `core/src/reads/loop.ts`
- Modify: `core/src/app.ts` (`AppDeps.reads: ReadLoop`)
- Modify: `core/src/testing/harness.ts` (build the loop, wire `onSignal`, return `reads`; loop not started)
- Modify: `core/src/main.ts` (build, wire, `reads.start()` after `satellites.refresh()`, `await reads.stop()` in shutdown before `satellites.stop()`)
- Test: `core/src/reads/loop.test.ts`

**Interfaces:**
- Consumes: Task 2 store functions; Task 3 `Signal`, `ManagerDeps.onSignal`; `SatelliteManager.list/link/client`; `dayStart`, `natsumeDay` (`chat/day.ts`); `parisIsoDay` (`routines/morning-point.ts`).
- Produces (`core/src/reads/loop.ts`):
  - `READ_INTERVAL_MS = 120_000`
  - `class ReadLoop { constructor(deps: { db: DatabaseSync; satellites: SatelliteManager; clock: () => Date; log: (line: string) => void; intervalMs?: number }) }`
  - `start(): void` — one pass for every `satellites.list()` id now, then every `intervalMs`; signals trigger reads only once started.
  - `stop(): Promise<void>` — clears the timer, awaits passes in flight.
  - `signal(satelliteId: string, s: Signal): void` — `open`/`event`: `touchContact` then `schedule(id)`; `cut`: `recordFailure(..., { read: false, down: true })`. Writes are try/caught and logged.
  - `readNow(satelliteId: string): Promise<void>` — resolves after a pass that **started after the call** (waits for one in flight, then runs another).
  - `everRead(satelliteId: string): boolean` — a pass finished since this process started.
  - Cache keys written: `dues` (`Due[]`, from `lunavaritia`), `agenda` (`AgendaItem[]`, from `lunacedia`), `costs:<id>` (`{ since: string; total: number }`).
  - Exported `AgendaItem` type (copy of Lun'Acedia's `AgendaEvent | AgendaTask`, fields `kind, id, title, start?, end?, allDay?, due?, done?`).

A pass for post `id`:
1. no client → `recordFailure(reason 'Jeton du satellite illisible : il faut le réappairer', { read: true, down: true })`, done.
2. `health()`; failure → `recordFailure({ read: true, down: true })`, done.
3. `cards('pending')`, parsed with a zod schema of `Card` (v1.4 fields optional, `sends: z.literal(true).optional()`, `options: z.array(z.string()).optional()`); a non-ok status or a parse failure → `recordFailure(reason, { read: true, down: false })`, cards kept.
4. success → `saveCardRead` + `recordSuccess(health, cards.length)`.
5. extras, each failing alone (logged once per distinct message, cache kept): `costs(dayStart(natsumeDay(now)))` → `costs:<id>`; for `lunavaritia` `invoke('brain.due', { day: parisIsoDay(now) })` → `dues` (same zod schema as `accueil/routes.ts`, move it to `reads/loop.ts` and import it there); for `lunacedia` `invoke('agenda.list', { from: now.toISOString(), to: upcomingEnd(now).toISOString() })` → `agenda` (`result.items`). `upcomingEnd` is produced in Task 7; until then pass `to` = now + 26 h and replace in Task 7.

Coalescing: one pass in flight per post; a `schedule` during a pass marks one more pass, any number of marks give one.

- [x] **Step 1: Write the failing tests**

```ts
// setup: FakeSatellite({ id: 'lunacedia', contract: '1.4' }), paired, h.reads.start(); onTestFinished(() => h.reads.stop()).
it('reads the cards at start and keeps them in card_reads', async () => {
  fake.setCards([card('a')]);
  h.reads.start();
  await waitFor(() => cardRead(h.db, 'lunacedia')?.cards.length === 1);
  expect(h.reads.everRead('lunacedia')).toBe(true);
});
it('reads again when an event arrives', async () => {
  h.reads.start(); await waitFor(() => fake.callsTo('GET /lun/v1/cards') === 1);
  fake.setCards([card('a'), card('b')]);
  fake.emit({ type: 'mail.new', importance: 'normal', title: 'Un' });
  await waitFor(() => cardRead(h.db, 'lunacedia')?.cards.length === 2);
});
it('a burst of events gives at most two more reads', async () => {
  h.reads.start(); await waitFor(() => fake.callsTo('GET /lun/v1/cards') >= 1);
  const before = fake.callsTo('GET /lun/v1/cards');
  for (let i = 0; i < 200; i++) fake.emit({ type: 'mail.new', importance: 'normal', title: `n${i}` });
  await waitFor(() => h.db.prepare('SELECT COUNT(*) AS n FROM events').get()!.n === 200);
  await new Promise((r) => setTimeout(r, 50));
  expect(fake.callsTo('GET /lun/v1/cards') - before).toBeLessThanOrEqual(2);
});
it('reads every interval without any event', async () => {
  // new ReadLoop({ ..., intervalMs: 20 }) built on h.db / h.satellites
  await waitFor(() => fake.callsTo('GET /lun/v1/cards') >= 3);
});
it('a malformed cards answer keeps the last cards and marks the read failed', async () => {
  fake.setCards([card('a')]); await h.reads.readNow('lunacedia');
  fake.setCards([{ id: 'b' } as never]); await h.reads.readNow('lunacedia');
  expect(cardRead(h.db, 'lunacedia')!.cards.map((c) => c.id)).toEqual(['a']);
  expect(postStatus(h.db, 'lunacedia')).toMatchObject({ readFailed: true });
  expect(postStatus(h.db, 'lunacedia').health).toBeDefined();
});
it('a post down records the failure and its first down time', async () => {
  await h.reads.readNow('lunacedia'); fake.setDown(true); h.advance(60_000);
  await h.reads.readNow('lunacedia');
  expect(postStatus(h.db, 'lunacedia')).toMatchObject({ readFailed: true, downSince: expect.any(String) });
});
it('caches the dues of Lun\'Avaritia and the agenda of Lun\'Acedia', async () => {
  // second fake 'lunavaritia' routed by URL host; queueAction('brain.due', [due]) and queueAction('agenda.list', { items: [event] })
  await h.reads.readNow('lunavaritia'); await h.reads.readNow('lunacedia');
  expect(cached(h.db, 'dues')!.value).toEqual([due]);
  expect(cached(h.db, 'agenda')!.value).toEqual([event]);
});
```

(Two fakes need distinct URLs: give `FakeSatellite` an optional `url` in its constructor identity, and a test `fetch` that dispatches on the URL host.)

- [x] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/reads/loop.test.ts`
Expected: FAIL (module not found)

- [x] **Step 3: Implement `ReadLoop` in `core/src/reads/loop.ts`** as specified in the Interfaces block; wire harness and `main.ts` (`let reads: ReadLoop` declared before the manager, `onSignal: (id, s) => reads.signal(id, s)`), timer `unref()`.

- [x] **Step 4: Run to verify they pass, and that nothing else moved**

Run: `npx vitest run --project core`
Expected: PASS (the existing `home.test.ts` call-count test still passes: the harness loop is not started)

- [x] **Step 5: Commit**

```bash
git add core/src/reads/loop.ts core/src/reads/loop.test.ts core/src/app.ts core/src/main.ts core/src/testing core/src/accueil/routes.ts
git commit -m "feat(core): background read loop for cards, dues, agenda and costs" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Post states and the post routes

**Files:**
- Create: `core/src/worlds.ts`
- Create: `core/src/reads/posts.ts`
- Create: `core/src/reads/routes.ts` (this task: `GET /posts/:id`, `POST /posts/:id/check`)
- Modify: `core/src/app.ts` (mount `readRoutes(deps)` under the token-protected `/api`)
- Modify: `core/src/chat/posts.ts` (`ROLES.lunacedia` without « (agente : Pina) »)
- Test: `core/src/reads/posts.test.ts`

**Interfaces:**
- Consumes: Task 2 `postStatus`, `cardRead`, `cached`, `isStale`; Task 4 `ReadLoop.everRead/readNow`; `listSatellites`; `delegationsBetween`.
- Produces:
  - `worlds.ts`: `WORLDS = ['ira', 'avaritia', 'gula', 'superbia', 'luxuria', 'invidia', 'acedia'] as const` (heptagram order, clockwise from the top); `satelliteOfWorld(world: string): string` (`'lun' + world`).
  - `posts.ts`:
    - `speaksV14(contract: string | undefined): boolean`
    - `type PostState = 'relie' | 'muet' | 'injoignable' | 'a-relier' | 'inconnu'`
    - `type PostReason = 'pause-locale' | 'contrat' | 'liaison'`
    - `interface PostView { id: string; state: PostState; since?: string; reason?: PostReason; agentName?: string }`
    - `postStates(deps: { db; satellites: SatelliteManager; reads: ReadLoop }): PostView[]` — worlds in `WORLDS` order (paired or `a-relier`), then other paired satellites by id. **Consumed by Tasks 6 and 8 and by the presences/Constellation in slice 6.**
  - Routes:
    - `GET /api/posts/:id` → `200 { ...PostView, contract?, lastContact?, lastSuccess?: { at, count }, lastError?: { at, reason }, readAt?, stale: boolean, today: { delegations: string[] /* ISO times */, cost?: number } }`; an `a-relier` world → `200 { id, state: 'a-relier' }`; any other id (a world id like `acedia` included) → `404 { error: 'Poste inconnu : <id>' }`.
    - `POST /api/posts/:id/check` → `await reads.readNow(id)`, then the same body as GET; `404` as above, also for `a-relier`.

State rule, in this order: not in `satellites` table and a world → `a-relier`; `!reads.everRead(id)` → `inconnu`; link `unpaired` or no client → `injoignable`/`liaison`; link not `connected` or `postStatus.health` absent → `injoignable` with `since: downSince`; `health.pausedBy === 'local'` → `muet`/`pause-locale`; `!speaksV14(health.contract)` → `muet`/`contrat`; else `relie`. `agentName` = `health.agentName?.trim().slice(0, 40)` when non-empty, on any state that has a health.

- [x] **Step 1: Write the failing tests**

```ts
it('a world never paired is « à relier »', async () => {
  expect((await get('/api/posts/lunira')).body).toEqual({ id: 'lunira', state: 'a-relier' });
});
it('a world id is not an API id', async () => {
  expect((await get('/api/posts/acedia')).status).toBe(404);
});
it('a paired post never read since start is « inconnu »', async () => {
  expect((await get('/api/posts/lunacedia')).body).toMatchObject({ state: 'inconnu' });
});
it('a v1.3 post is « muet », reason contrat', async () => {
  // FakeSatellite({ id: 'lunacedia' }) // no contract field: v1.3
  await h.reads.readNow('lunacedia');
  expect((await get('/api/posts/lunacedia')).body).toMatchObject({ state: 'muet', reason: 'contrat' });
});
it('a local pause is « muet », the core pause is not', async () => {
  fake.setHealth({ status: 'paused', pausedBy: 'local' }); await h.reads.readNow('lunacedia');
  expect((await get('/api/posts/lunacedia')).body).toMatchObject({ state: 'muet', reason: 'pause-locale' });
  fake.setHealth({ status: 'paused', pausedBy: 'core' }); await h.reads.readNow('lunacedia');
  expect((await get('/api/posts/lunacedia')).body).toMatchObject({ state: 'relie' });
});
it('a cut post is « injoignable » since its first failure, and check reads it again', async () => {
  await h.reads.readNow('lunacedia'); fake.setDown(true);
  await waitFor(() => h.satellites.link('lunacedia') === 'unreachable');
  const down = (await get('/api/posts/lunacedia')).body;
  expect(down).toMatchObject({ state: 'injoignable', since: expect.any(String), stale: false });
  fake.setDown(false);
  await waitFor(() => h.satellites.link('lunacedia') === 'connected');
  const res = await post('/api/posts/lunacedia/check');
  expect(res.body).toMatchObject({ state: 'relie', lastSuccess: { count: 0 } });
});
it('names the agent only when the post declares one', async () => {
  fake.setHealth({ status: 'ok', agentName: '  ' }); await h.reads.readNow('lunacedia');
  expect((await get('/api/posts/lunacedia')).body).not.toHaveProperty('agentName');
  fake.setHealth({ status: 'ok', agentName: 'Iris' }); await h.reads.readNow('lunacedia');
  expect((await get('/api/posts/lunacedia')).body).toMatchObject({ agentName: 'Iris' });
});
it('GET makes no call to the post, and gives the day\'s delegations and cost', async () => {
  recordDelegation(h.db, { at: '2026-11-02T08:12:00.000Z', satellite: 'lunacedia', request: 'x', origin: 'conversation', outcome: 'faite' });
  fake.setCosts({ currency: 'USD', since: '…', until: '…', total: 0.05, items: [] });
  await h.reads.readNow('lunacedia');
  const before = calls();
  expect((await get('/api/posts/lunacedia')).body.today).toEqual({ delegations: ['2026-11-02T08:12:00.000Z'], cost: 0.05 });
  expect(calls()).toBe(before);
});
it('no agent name is written in the core', () => {
  expect(JSON.stringify(ROLES)).not.toMatch(/Pina/);
});
```

- [x] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/reads/posts.test.ts`
Expected: FAIL

- [x] **Step 3: Implement** `worlds.ts`, `postStates`, `speaksV14`, the two routes (`stale` from `isStale(cardRead?.readAt, postStatus.readFailed, now)`; `cost` only when the cached `costs:<id>.since` equals today's `dayStart`), mount in `app.ts`, edit `ROLES`.

- [x] **Step 4: Run to verify they pass**

Run: `npx vitest run --project core`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add core/src/worlds.ts core/src/reads/posts.ts core/src/reads/routes.ts core/src/reads/posts.test.ts core/src/app.ts core/src/chat/posts.ts
git commit -m "feat(core): post states and the post diagnostic routes" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: The queue

**Files:**
- Create: `core/src/reads/queue.ts`
- Modify: `core/src/reads/routes.ts` (`GET /queue`)
- Test: `core/src/reads/queue.test.ts`

**Interfaces:**
- Consumes: `postStates` (Task 5), `cardRead`, `postStatus`, `cached('dues')`, `isStale`, `speaksV14`; tables `events`, `event_seen`, `due_later`; `natsumeDay`, `dayStart`.
- Produces (`core/src/reads/queue.ts`), **consumed by Task 8, by slice 4 (held gestures remove their cards inside `buildQueue`, and validate a batch with `batchable`) and by slice 6 (the file)**:

```ts
export type ReadOnlyReason = 'injoignable' | 'pause-locale' | 'contrat' | 'liaison' | 'inconnu' | 'perimee';
export interface QueueUrgent { type: 'urgent'; id: number; satellite: string; at: string; title: string; lines?: string[]; link?: string; due?: string }
export interface QueueCard { type: 'card'; satellite: string; card: Card; batchable: boolean; sends: boolean; options?: string[]; readOnly: boolean; readOnlyReason?: ReadOnlyReason }
export interface QueuePile { type: 'pile'; satellite: string; cards: Card[]; readOnly: boolean; readOnlyReason?: ReadOnlyReason }
export interface QueueDue { type: 'due'; satellite: 'lunavaritia'; due: Due; readOnly: boolean; readOnlyReason?: ReadOnlyReason }
export interface QueueGroup { satellite: string; state: PostState; readAt?: string; stale: boolean; count: number; items: (QueueCard | QueuePile | QueueDue)[] }
export interface Queue { total: number; urgent: QueueUrgent[]; groups: QueueGroup[] }
export function buildQueue(deps: { db: DatabaseSync; satellites: SatelliteManager; reads: ReadLoop }, now: Date): Queue;
```

Rules:
- `urgent`: unseen `importance = 'urgent'` events of Natsume's day (same query as `/home`), `type != 'agenda.reminder'`, oldest first; `lines` and `link` when stored; `due` = `data.due` when a string.
- Groups: one per post with at least one item; items = pending cards of its `card_reads` row, plus for `lunavaritia` the cached dues minus `due_later` with `until_day > today`.
- Pile: ≥ 2 cards with the same `kind ?? 'Carte'` and `title`; a pile counts one in `count`.
- Sort: items by `card.at` (pile: its oldest card; due: its `due` day string, which compares with ISO times at day precision), groups by their first item's key, both ascending.
- `readOnly`: the post's state is not `relie` (reason = its `reason`, or `injoignable`/`inconnu`), or its read is stale (`perimee`).
- `batchable`: `!readOnly && speaksV14 && card.effect === 'write' && card.sends !== true && !card.options && not in a pile`.
- `sends`: `card.sends === true`.
- `total` = `urgent.length + Σ group.count`.

- [x] **Step 1: Write the failing tests**

```ts
it('urgent first, oldest first, without reminders or seen ones', () => { /* insert 3 urgent events: one agenda.reminder, one seen */
  expect(q.urgent.map((u) => u.title)).toEqual(['Banque 08:01', 'Banque 08:30']);
});
it('groups by post, the one waiting longest first, oldest card first', () => {
  expect(q.groups.map((g) => g.satellite)).toEqual(['lunavaritia', 'lunacedia']);
  expect(q.groups[1]!.items.map((i) => (i as QueueCard).card.id)).toEqual(['a1', 'a2']);
});
it('two cards of the same kind and title form one pile that counts once', () => {
  expect(group.items).toEqual([expect.objectContaining({ type: 'pile', cards: [expect.objectContaining({ id: 'p1' }), expect.objectContaining({ id: 'p2' })] })]);
  expect(group.count).toBe(1);
});
it('dues sit in Lun\'Avaritia\'s group, without those put off today', () => {
  expect(avaritia.items.filter((i) => i.type === 'due').map((i) => (i as QueueDue).due.factId)).toEqual([7]);
});
it('batchable only for a v1.4 write card that sends nothing and asks nothing', () => {
  expect(byId('w').batchable).toBe(true);
  expect(byId('send').batchable).toBe(false);   // sends: true
  expect(byId('ask').batchable).toBe(false);    // options: ['Oui', 'Non']
  expect(byId('del').batchable).toBe(false);    // effect: 'delete'
});
it('a v1.3 post\'s cards are read-only and never batchable', () => {
  expect(old.items[0]).toMatchObject({ readOnly: true, readOnlyReason: 'contrat', batchable: false });
});
it('a stale read keeps its cards, read-only, with its read time', () => {
  h.advance(5 * 60_000 + 1);
  expect(g).toMatchObject({ stale: true, readAt: '2026-11-02T08:00:00.000Z' });
  expect(g.items[0]).toMatchObject({ readOnly: true, readOnlyReason: 'perimee' });
});
it('GET /api/queue calls no post', async () => {
  const before = calls(); expect((await get('/api/queue')).status).toBe(200); expect(calls()).toBe(before);
});
it('total counts urgencies plus each group\'s count', () => {
  expect(q.total).toBe(q.urgent.length + q.groups.reduce((n, g) => n + g.count, 0));
});
```

Most tests call `buildQueue` directly on rows written with Task 2's store functions and a stub `reads`/`satellites` (`{ everRead: () => true }`, `{ link: () => 'connected', client: () => ({}) }`), to avoid fakes.

- [x] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/reads/queue.test.ts`
Expected: FAIL

- [x] **Step 3: Implement `buildQueue`** and `GET /queue` (`c.json(buildQueue(deps, deps.clock()))`).

- [x] **Step 4: Run to verify they pass**

Run: `npx vitest run --project core core/src/reads`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add core/src/reads/queue.ts core/src/reads/queue.test.ts core/src/reads/routes.ts
git commit -m "feat(core): one ordered queue from the read cache" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Ce qui vient

**Files:**
- Create: `core/src/reads/upcoming.ts`
- Modify: `core/src/reads/routes.ts` (`GET /upcoming`)
- Modify: `core/src/reads/loop.ts` (`agenda.list` `to` = `upcomingEnd(now)`)
- Test: `core/src/reads/upcoming.test.ts`

**Interfaces:**
- Consumes: `cached<AgendaItem[]>('agenda')`, `isStale`, `AppDeps.routineSchedule` (`RoutineSlot[]`, today in `map/map.ts`: move the `RoutineSlot` type to `routines/engine.ts` since slice 3 deletes `map/`), `events` table, `natsumeDay`, `dayStart`, `parisIsoDay`.
- Produces (`core/src/reads/upcoming.ts`), **consumed by slice 5 (the letter) and slice 6 (the Bureau's word)**:

```ts
export function upcomingEnd(now: Date): Date; // dayStart(next Natsume day) + 2 h 30 (07:30)
export type UpcomingItem =
  | { kind: 'routine'; at: string; routine: string }
  | { kind: 'event' | 'reminder' | 'due'; at: string; title: string; satellite: string };
export interface Upcoming { readAt?: string; stale: boolean; items: UpcomingItem[]; tasks: { title: string; satellite: string }[] }
export function buildUpcoming(deps: { db: DatabaseSync; routineSchedule: RoutineSlot[] }, now: Date): Upcoming;
```

Rules: window `(now, upcomingEnd(now)]`; routines: each slot of today and of the next Natsume day inside the window; agenda events with a timed `start` inside the window → `event`; all-day events whose day is today, and tasks with `due === parisIsoDay(now)` and `!done` → `tasks`; `agenda.reminder` events of the last 2 days whose `data.at` is inside the window and whose `data.id` is not an agenda item already listed → `reminder` at `data.at`; urgent events of the last 7 days with a string `data.due` inside the window → `due`. Items sorted by `at`. `readAt`/`stale` describe the `agenda` cache (`stale` with `failed = false`; absent cache → `stale: true`). A post absent puts nothing.

- [x] **Step 1: Write the failing tests**

```ts
// clock 2026-11-02T08:00Z = 09:00 Paris
it('lists what comes until tomorrow\'s letter, by time', () => {
  expect(u.items.map((i) => [i.kind, i.at])).toEqual([
    ['due', '2026-11-02T17:00:00.000Z'],      // urgent with data.due 18:00 Paris
    ['event', '2026-11-02T18:00:00.000Z'],    // « Rappeler Paul » 19:00
    ['routine', '2026-11-03T04:00:00.000Z'],  // night 05:00 tomorrow
    ['routine', '2026-11-03T06:30:00.000Z'],  // morning 07:30 tomorrow
  ]);
});
it('today\'s morning slot already past is not listed', () => {
  expect(u.items.some((i) => i.kind === 'routine' && i.at === '2026-11-02T06:30:00.000Z')).toBe(false);
});
it('tasks of the day come without time, done ones and other days left out', () => {
  expect(u.tasks).toEqual([{ title: 'Payer la cantine', satellite: 'lunacedia' }]);
});
it('a reminder sits at its item\'s time, once', () => {
  // reminder data { id: 'ev9', at: '2026-11-02T13:00:00.000Z' }, ev9 absent from agenda → listed; reminder for 'ev1' (listed) → not twice
});
it('without an agenda read, the rest still shows and says it is stale', () => {
  expect(u).toMatchObject({ stale: true }); expect(u).not.toHaveProperty('readAt');
});
it('GET /api/upcoming calls no post', async () => { /* call counter unchanged */ });
```

- [x] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/reads/upcoming.test.ts`
Expected: FAIL

- [x] **Step 3: Implement** `upcomingEnd`, `buildUpcoming`, `GET /upcoming` (`routineSchedule: deps.routineSchedule ?? []`); switch the loop's `agenda.list` `to` to `upcomingEnd(now)`; move `RoutineSlot` and re-export it from `map/map.ts` so nothing else changes.

- [x] **Step 4: Run to verify they pass**

Run: `npx vitest run --project core`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add core/src/reads core/src/routines/engine.ts core/src/map/map.ts core/src/app.ts
git commit -m "feat(core): Ce qui vient served from the read cache" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: The single state

**Files:**
- Create: `core/src/reads/state.ts`
- Modify: `core/src/reads/routes.ts` (`GET /state`)
- Modify: `core/src/accueil/routes.ts` (extract `daySpend`)
- Modify: `README.md` (routes list: the five new routes, one line each)
- Test: `core/src/reads/state.test.ts`

**Interfaces:**
- Consumes: `buildQueue` (Task 6), `postStates` (Task 5), `AppDeps.keyStatus`, `AppDeps.settings`, tables `messages`, `events`, `clients`, `satellites`.
- Produces:
  - `accueil/routes.ts`: `export function daySpend(deps: Pick<AppDeps, 'db' | 'settings'>, now: Date): { chat: number; routines: number; chatCap: number; routinesCap: number }` (the current `/home` computation, `/home` now calls it).
  - `reads/state.ts`, **consumed by slice 5 (adds `pause`, caps, `plafond`/`pause` bands, the caps line of `route`) and slice 6 (every place)**:

```ts
export type NatsumeKind = 'disponible' | 'reflechit' | 'cle-refusee' | 'attente-cle';
export type BandKind = 'cle-refusee' | 'poste-injoignable' | 'poste-muet' | 'mise-en-route';
export const BAND_ORDER: BandKind[]; // ['cle-refusee', 'poste-injoignable', 'poste-muet', 'mise-en-route']; slice 5 inserts 'plafond' and 'pause' after 'cle-refusee'
export interface CoreState {
  natsume: { kind: NatsumeKind; since?: string };
  key: { state: 'ok' | 'refusee' | 'absente'; at?: string };
  spend: ReturnType<typeof daySpend>;
  queue: { total: number; urgent: number; posts: Record<string, { count: number; urgent: number; readAt?: string; stale: boolean }> };
  posts: PostView[];
  band?: { kind: BandKind; post?: string; since?: string; reason?: PostReason };
  route: { device: true; key: boolean; firstPost: boolean; secondDevice: boolean; done: boolean };
}
export function buildState(deps: Pick<AppDeps, 'db' | 'satellites' | 'reads' | 'settings' | 'keyStatus'>, now: Date): CoreState;
```

Rules:
- `key`: `keyStatus()` `ok`/`refused`/`missing` → `ok`/`refusee`/`absente`; `refusee.at` = `at` of the latest core event `key.invalid`.
- `natsume.kind`: `attente-cle` if the key is absent, `cle-refusee` (`since` = key `at`) if refused, `reflechit` if a message has `status = 'pending'`, else `disponible`.
- `queue.posts[id]`: from the queue group (`count`, `readAt`, `stale`) plus `urgent` = that satellite's entries in `queue.urgent`; a post with urgent items but no group gets `count: 0` and its card read's `readAt`/`stale`.
- `band`: the first of `BAND_ORDER` that holds: key refused; a post `injoignable` (the one down longest, `since`); a post `muet` (with `reason`); `!route.done`. No band otherwise.
- `route`: `key` = key state `ok`; `firstPost` = a row in `satellites`; `secondDevice` = at least two clients with `revoked_at IS NULL`; `done = key && firstPost`.

- [x] **Step 1: Write the failing tests**

```ts
it('one count everywhere: state.queue.total is the queue\'s total, before and after a card leaves', async () => {
  const q1 = (await get('/api/queue')).body, s1 = (await get('/api/state')).body;
  expect(s1.queue.total).toBe(q1.total);
  fake.setCards(cards.slice(1)); await h.reads.readNow('lunacedia');
  const s2 = (await get('/api/state')).body;
  expect(s2.queue.total).toBe(s1.queue.total - 1);
  expect(s2.queue.total).toBe((await get('/api/queue')).body.total);
});
it('calls no post', async () => { const before = calls(); await get('/api/state'); expect(calls()).toBe(before); });
it('lists the seven worlds in heptagram order, unpaired ones « à relier »', () => {
  expect(s.posts.map((p) => p.id)).toEqual(['lunira', 'lunavaritia', 'lungula', 'lunsuperbia', 'lunluxuria', 'luninvidia', 'lunacedia']);
  expect(s.posts[0]).toEqual({ id: 'lunira', state: 'a-relier' });
});
it('the key refused wins the band over a post down', () => { /* keyRefused(db, now) + post down */ expect(s.band).toMatchObject({ kind: 'cle-refusee' }); });
it('a post down shows its band with its time', () => { expect(s.band).toEqual({ kind: 'poste-injoignable', post: 'lunacedia', since: expect.any(String) }); });
it('a v1.3 post shows the « muet » band, reason contrat', () => { expect(s.band).toMatchObject({ kind: 'poste-muet', reason: 'contrat' }); });
it('no band when all is well', () => { expect(s).not.toHaveProperty('band'); });
it('setup unfinished without a key or a post', () => {
  // fresh harness, provider: null, keyStatus → missing, no satellite
  expect(s.route).toEqual({ device: true, key: false, firstPost: false, secondDevice: false, done: false });
  expect(s.band).toEqual({ kind: 'mise-en-route' });
  expect(s.natsume).toEqual({ kind: 'attente-cle' });
});
it('/home keeps its spend', async () => { /* existing home.test spend assertions still pass */ });
```

- [x] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/reads/state.test.ts`
Expected: FAIL

- [x] **Step 3: Implement** `daySpend` (move, `/home` calls it), `buildState`, `GET /state`; add the README lines for `GET /api/state`, `GET /api/queue`, `GET /api/upcoming`, `GET /api/posts/:id`, `POST /api/posts/:id/check` (« lus dans le cache du core, aucun appel aux postes » for the GETs).

- [x] **Step 4: Full gate**

Run: `npm test && npm run lint && npm run typecheck && npm run format:check`
Expected: all green

- [x] **Step 5: Commit**

```bash
git add core/src/reads core/src/accueil/routes.ts README.md
git commit -m "feat(core): GET /api/state, one state for every place" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Unlink a post, cancel a pairing code

**Files:**
- Modify: `core/src/satellites/store.ts` (`unlinkSatellite`), `core/src/satellites/routes.ts` (`DELETE /satellites/:id`)
- Modify: `core/src/auth/pairing.ts` (`cancelPairingCode`), `core/src/auth/routes.ts` (`DELETE /pairing-codes/:code` in `deviceRoutes`)
- Modify: `README.md` (two lines)
- Test: `core/src/satellites/unlink.test.ts`, `core/src/auth/routes.test.ts` (add cases)

**Interfaces:**
- Consumes: `listSatellites`, `SatelliteManager.refresh`, Task 2 tables, Task 5 `postStates`.
- Produces, **consumed by slice 6 (Atelier: Délier, « Annuler ce code »)**:
  - `unlinkSatellite(db: DatabaseSync, id: string): boolean` — in one transaction, deletes the `satellites` row, its `card_reads` and `post_status` rows and its `costs:<id>` cache; `events` stay (history). `false` when no row.
  - `DELETE /api/satellites/:id` → `unlinkSatellite`, then `deps.satellites.refresh()` (drops the listener) → `204`; unknown id, a world id like `acedia` included → `404 { error: 'Poste inconnu : <id>' }`. A world unlinked reads `a-relier` again.
  - `cancelPairingCode(db: DatabaseSync, code: string): boolean` — deletes an unused code (`used_at IS NULL`).
  - `DELETE /api/pairing-codes/:code` → `204`; unknown or already used → `404 { error: 'Code inconnu' }`.

- [x] **Step 1: Write the failing tests**

```ts
// unlink.test.ts — harness with FakeSatellite lunacedia (contract 1.4), paired and read once
it('unlinking drops the post, its listener and its cached reads', async () => {
  expect((await del('/api/satellites/lunacedia')).status).toBe(204);
  expect(h.satellites.client('lunacedia')).toBeUndefined(); // refresh() dropped the entry
  expect(cardRead(h.db, 'lunacedia')).toBeUndefined();
  expect((await get('/api/posts/lunacedia')).body).toEqual({ id: 'lunacedia', state: 'a-relier' });
  expect((await get('/api/queue')).body.groups).toEqual([]);
});
it('an unknown post or a world id is a 404', async () => {
  expect((await del('/api/satellites/acedia')).status).toBe(404);
  await del('/api/satellites/lunacedia');
  expect((await del('/api/satellites/lunacedia')).status).toBe(404);
});
// auth/routes.test.ts
it('a cancelled code can no longer pair', async () => {
  const { code } = (await post('/api/pairing-codes')).body;
  expect((await del(`/api/pairing-codes/${code}`)).status).toBe(204);
  expect((await post('/api/pair', { code, client: 'x' })).status).toBe(401);
  expect((await del(`/api/pairing-codes/${code}`)).status).toBe(404);
});
```

- [x] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/satellites/unlink.test.ts core/src/auth/routes.test.ts`
Expected: FAIL (404 on the routes)

- [x] **Step 3: Implement** the two store functions and the two routes; README lines `DELETE /api/satellites/:id` (« délie un poste ; ses événements restent ») and `DELETE /api/pairing-codes/:code` (« annule un code d'appairage pas encore utilisé »).

- [x] **Step 4: Full gate**

Run: `npm test && npm run lint && npm run typecheck && npm run format:check`
Expected: all green

- [x] **Step 5: Commit**

```bash
git add core/src/satellites core/src/auth README.md
git commit -m "feat(core): unlink a post and cancel a pairing code" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Self-review notes

- Spec coverage (slice 2 of §15): `card_reads`, `post_status` (Task 2); loop on SSE and every 2 min, no pause gate, `stale` (Tasks 2, 4); Ce qui vient cache (Tasks 4, 7); post states incl. world data (Task 5); `/api/state` (8), `/api/queue` (6), `/api/upcoming` (7), `/api/posts/:id` and `/check` (5); satellite ids in routes, world id 404 (5); `DELETE /api/satellites/:id` and `DELETE /api/pairing-codes/:code` for slice 6's Délier and « Annuler ce code » (9, assigned here at coordination: no slice owned them). Left out on purpose: journal table and first-read journaling (slice 3, hook named in Task 2), held gestures (slice 4, hook named in Task 6), pause/caps/letter (slice 5, slots named in Task 8), UI (slice 6).
- Not pinnable in this slice: « la boucle tourne pendant une pause » has no pause to test against; slice 5 must add a test that a pause leaves `GET /lun/v1/cards` calls going.
