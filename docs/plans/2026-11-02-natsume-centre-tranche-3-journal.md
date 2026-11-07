# Natsume au centre, slice 3: the Journal table — Implementation Plan

> **Livré** par [lun-anima#22](https://github.com/Lun-Ecosystem/lun-anima/pull/22). Cases cochées le 07/11/2026 d'après cette livraison, sans recontrôle tâche par tâche.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** One `journal` table (with its `journal_steps` chain) holds everything the core noted, existing history included; `GET /api/journal` and `GET /api/journal/:id` read it with period, post, type and accent-insensitive search filters; a card enters the Journal at its first read by the loop; `/api/map` and `core/src/map/` are gone.

**Architecture:** `core/src/journal/store.ts` is the only writer (`appendJournal`, `addStep`, and two thin helpers for cards and urgencies); every place that used to write a history row (events, seen, gestures, delegations, routine runs, pairing) also calls it, and the read loop's `saveCardRead` journals new cards. A function migration replays the old tables through the same writer, in time order. `core/src/journal/query.ts` serves the routes; `day` (Natsume day, 05:00 cut) and `search` (folded text) are stored columns, so a page is plain SQL.

**Tech Stack:** Node `^22.13.0 || >=24`, TypeScript run by `--experimental-strip-types`, Hono 4, `node:sqlite`, vitest 5 (root `vitest.config.ts`, project `core`).

**Spec:** `lun-docs/docs/specs/2026-11-02-natsume-au-centre-design.md` (§2 « Journal au palier 3 », §5 `/app/journal`, §6.3, §7 Journal column, §8 non-goals, §9.2 last sentence, §9.3 « noté au Journal à son relais », §9.4, §9.6, §10, §13 « Palier 4 », §14 Journal, §15 slice 3).

**Repo / branch:** `D:/projets/projets perso/LunEcosystem/lun-anima`, new branch `feat/core-journal` cut from `feat/core-read-loop` (slice 2, plan `2026-11-02-natsume-centre-tranche-2-boucle-lecture.md`).

## Global Constraints

- Node `^22.13.0 || >=24`; no new dependency.
- Migrations are appended to `MIGRATIONS` in `core/src/db.ts`, never edited.
- « Les routes de l'API ne parlent que d'identifiants de satellite (`lunacedia`) » : `post` (URL param `poste`) is a satellite id, or `lunanima` for Natsume herself (the id the current journal already uses for the core).
- Stable types, verbatim from §9.6: `urgence`, `carte`, `confie`, `routine`, `pause`, `reglage`, `liaison` (plus `evenement`, see rulings).
- « Recherche par sous-chaîne sur le texte sans accents. » No full-text index, no cursor (palier 4, §8).
- « La conversation n'y entre que par ses effets. » No message row becomes an entry.
- « Aucun total de coût » : routes give a cost per entry, never a sum.
- Pages are made of days « (comme aujourd'hui) »: 7 days per page.
- Day grouping « coupe à 05:00, la journée de Natsume » : `natsumeDay` from `core/src/chat/day.ts`.
- Journal routes call no post (they read `journal`, `journal_steps` and slice 2's `card_reads` only).
- Stored texts are French and follow §3 (no « core », no « · », no em dash, no « → »); code, comments, commits in English.
- Test command: `npx vitest run --project core <file>` from the repo root; full gate `npm test && npm run lint && npm run typecheck && npm run format:check`.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

**Consumed from slice 2 (exact names):** `saveCardRead(db, satelliteId, at: Date, cards: Card[])` and `cardRead(db, satelliteId)` in `core/src/reads/store.ts`; the `ReadLoop` (which calls `saveCardRead` on each successful pass); `Card.kind?` in `core/src/satellites/client.ts`; `RoutineSlot` in `core/src/routines/engine.ts` (re-exported from `map/map.ts` by slice 2 Task 7); `delegationsBetween` (kept: slice 2 Task 5 reads it); `unlinkSatellite(db, id): boolean` in `core/src/satellites/store.ts` (slice 2 Task 9); `WORLDS` in `core/src/worlds.ts` (read by `postName` for a world not paired).

**Rulings made where the spec is silent or wrong (binding for this plan):**

- The seven stable types have no slot for a post's non-urgent event, yet §9.6 migrates `events` « sauf log ». An eighth type `evenement` holds them (importance `normal`, `low`, `info`), migrated and written from now on; the UI's type filter (Urgences, Cartes, Confiés, Routines) never lists it, « Tous » shows it.
- Outcomes (stored in `outcome`, the badges of §6.3): `a-trancher`, `tranchee`, `vue`, `fait`, `echoue`, `sautee`, or none. Validated and refused are both `tranchee`; the step says which.
- An urgent `agenda.reminder` enters as `urgence` with no outcome (it never enters the queue, §6.1). An `urgence` still `a-trancher` from before today's Natsume day reads with no outcome (it left the queue at the day's end, §9.2 urgent window); the stored value is left alone.
- A card whose id leaves its post's `card_reads` list while still `a-trancher` becomes `tranchee` with the step « Tranchée dans <post name>. » (decided in the post's own front).
- A card's entry `at` is the card's own `at` (when the post made it), the read time when that is not a valid date.
- Natsume's own entries use `post = 'lunanima'`; the core's own events (`satellite_id = 'core'`) are written under it.
- Routine titles: `night` « Veille de la nuit », `morning` « Lettre du matin » (the spec's name; slice 5 makes it the letter).
- `liaison` is written by this slice at pairing (« Lun'Acedia relié. ») and at unlinking (« Lun'Acedia délié. », slice 2 Task 9's route), since no later slice owns it; `pause`, `reglage` and `sautee` routines are written by slice 5 through `appendJournal`.
- `threadId` and `messageId` are left empty by every writer of this slice; filling them is left for later (coordinator ruling). Slice 6 hides « Voir la conversation » when `threadId` is absent.
- The `gestures` table stops being written (the Journal is the one source); it and `event_seen` stay (the queue reads `event_seen`).
- Search text = folded `title + ' ' + meta`: NFD, combining marks removed, lower case, `’` and `‘` to `'`. The query is folded the same way and matched with `LIKE '%…%' ESCAPE '\'`, `%`, `_` and `\` escaped.
- Periods: `auj` = today's Natsume day only; `7j` (default) = today and the 6 days before; `tout` = no bound. A page is the 7 most recent **non-empty matching** days before `avant` (not 7 calendar days), so a search never shows an empty page with « Plus ancien ».
- **The UI is not touched in this slice.** It still compiles and its tests still pass (they mock the core), but at runtime its map screen (`/api/map` now 404) and its Journal screen (new response shape) are broken against this core. Slice 6 replaces both (§10: `carte/*` removed, `screens/Journal.svelte` rebuilt). Slices 3 to 5 are not deployed to the NAS on their own; the NAS keeps its last build until slice 6 merges.

## Review Focus

1. A search typed without accents or with a straight apostrophe (« lun'acedia », « BANQUE ») finds « Lun’Acedia », « Banqué » ; a `%` or `_` in the search matches itself only — pinned in Task 5.
2. A restart of the core, with `card_reads` already full, must not journal the same cards again — pinned in Task 4.
3. An entry at 04:30 Paris sits in the previous day's group (05:00 cut), and a page skips empty days under a filter — pinned in Task 5.
4. The history migration keeps time order (`id` grows with `at`) on interleaved sources, and one old row with an unreadable time is skipped instead of blocking the core's start-up (the runner would roll back and throw at every start) — pinned in Task 2.
5. An urgent event replayed by the SSE stream (same satellite, id and date, ignored by `storeEvent`) must not add a second entry — pinned in Task 3.

---

### Task 1: The journal tables and their writer

**Files:**
- Modify: `core/src/db.ts` (append one SQL migration)
- Create: `core/src/journal/store.ts`
- Test: `core/src/journal/store.test.ts`

**Interfaces:**
- Produces (`core/src/journal/store.ts`), **consumed by Tasks 2 to 5, by slice 4 (held gestures: `noteCardGesture` at relay, `noteSeen` for « Vu ») and slice 5 (`appendJournal` for `pause`, `reglage`, a `routine` `sautee`)**:

```ts
export const JOURNAL_TYPES = ['urgence', 'carte', 'confie', 'routine', 'pause', 'reglage', 'liaison', 'evenement'] as const;
export type JournalType = (typeof JOURNAL_TYPES)[number];
export type JournalOutcome = 'a-trancher' | 'tranchee' | 'vue' | 'fait' | 'echoue' | 'sautee';
export const NATSUME_POST = 'lunanima';
export interface JournalInput {
  at: string; type: JournalType; /** NATSUME_POST when absent. */ post?: string; title: string; meta?: string; outcome?: JournalOutcome;
  cost?: number; durationMs?: number; refs?: Ref[];
  cardId?: string; eventId?: number; threadId?: string; messageId?: number;
  /** First step of the chain, at `at`; none when absent. */
  step?: string;
}
export function fold(text: string): string;
/** Appends one entry and its first step; returns its `id` (the « n° » of §6.3). Never opens a transaction (callers may hold one). */
export function appendJournal(db: DatabaseSync, entry: JournalInput): number;
/** Adds a dated step; sets the outcome when given. */
export function addStep(db: DatabaseSync, id: number, at: string, text: string, outcome?: JournalOutcome): void;
export function entryOfCard(db: DatabaseSync, post: string, cardId: string): number | undefined; // latest
export function entryOfEvent(db: DatabaseSync, eventId: number): number | undefined;
/** 'Natsume' for lunanima, satellites.nom when paired, else the world name for a world of worlds.ts (lunira → « Lun'Ira »), else the id. The one post-name helper of the core: slice 5 uses it too. */
export function postName(db: DatabaseSync, post: string): string;
/** A gesture the post answered: steps « Validée. » (« Brouillon créé. » when `card.sends`, « Réponse donnée : <answer>. » when `answer`) / « Refusée. » / « Échec : <error>. », outcome tranchee or echoue; origin text appended (« depuis la file »…). Creates the card entry when none exists. */
export function noteCardGesture(db: DatabaseSync, g: { at: string; post: string; card: Card; gesture: 'accept' | 'refuse'; from?: string; answer?: string }): void;
/** « Vue. » on the urgency's entry, outcome vue; nothing when the event has no entry. */
export function noteSeen(db: DatabaseSync, eventId: number, at: string): void;
```

- [x] **Step 0: Branch**

Run: `git switch feat/core-read-loop && git switch -c feat/core-journal`
Expected: `Switched to a new branch 'feat/core-journal'`

- [x] **Step 1: Write the failing tests**

```ts
it('folds accents, case and curly apostrophes', () => {
  expect(fold('Lun’Acedia : Banqué ÉTÉ')).toBe("lun'acedia : banque ete");
});
it('appends an entry with its day, search text and first step, and returns its number', () => {
  const n = appendJournal(db, { at: '2026-11-02T03:30:00.000Z', type: 'confie', post: 'lunacedia', title: 'Rappeler Paul', meta: 'depuis la conversation', step: 'Confié à Lun’Acedia.' });
  expect(db.prepare('SELECT day, search FROM journal WHERE id = ?').get(n)).toEqual({ day: '2026-11-01', search: 'rappeler paul depuis la conversation' }); // 04:30 Paris → previous day
  expect(db.prepare('SELECT text FROM journal_steps WHERE entry = ?').all(n)).toEqual([{ text: 'Confié à Lun’Acedia.' }]);
});
it('rejects a type outside the stable list', () => {
  expect(() => appendJournal(db, { ...base, type: 'autre' as never })).toThrow();
});
it('a gesture on a known card adds a step and sets the outcome', () => {
  const n = appendJournal(db, { ...base, type: 'carte', cardId: 'c1', outcome: 'a-trancher' });
  noteCardGesture(db, { at: T2, post: 'lunacedia', card: { ...card('c1'), status: 'done' }, gesture: 'accept', from: 'accueil' });
  expect(outcomeOf(n)).toBe('tranchee'); expect(lastStep(n)).toMatch(/^Validée/);
});
it('an answer and a reply card name their step', () => {
  noteCardGesture(db, { at: T2, post: 'lunavaritia', card: { ...card('q1'), status: 'done' }, gesture: 'accept', answer: 'Chez Lulu' });
  expect(lastStep(entryOfCard(db, 'lunavaritia', 'q1')!)).toMatch(/^Réponse donnée : Chez Lulu\./);
  noteCardGesture(db, { at: T2, post: 'lunacedia', card: { ...card('r1'), status: 'done', sends: true }, gesture: 'accept' });
  expect(lastStep(entryOfCard(db, 'lunacedia', 'r1')!)).toMatch(/^Brouillon créé\./);
});
it('a failed gesture is « echoue », a gesture on an unknown card creates its entry', () => { /* status 'failed' → echoue; entryOfCard defined afterwards */ });
it('seen sets « vue » on the urgency', () => { /* appendJournal urgence eventId 7 → noteSeen(db, 7, T2) → outcome vue, step « Vue. » */ });
```

- [x] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/journal/store.test.ts`
Expected: FAIL (module not found)

- [x] **Step 3: Implement**

Migration (comment: « The Journal: one table for everything the core noted, and the chain of each entry »):

```sql
CREATE TABLE journal (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL, day TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('urgence','carte','confie','routine','pause','reglage','liaison','evenement')),
  post TEXT NOT NULL, title TEXT NOT NULL, meta TEXT,
  outcome TEXT CHECK (outcome IN ('a-trancher','tranchee','vue','fait','echoue','sautee')),
  cost REAL, duration_ms INTEGER, refs TEXT,
  card_id TEXT, event_id INTEGER, thread_id TEXT, message_id INTEGER,
  search TEXT NOT NULL
);
CREATE INDEX journal_by_day ON journal (day, at);
CREATE INDEX journal_by_card ON journal (post, card_id);
CREATE INDEX journal_by_event ON journal (event_id);
CREATE TABLE journal_steps (id INTEGER PRIMARY KEY AUTOINCREMENT, entry INTEGER NOT NULL REFERENCES journal (id), at TEXT NOT NULL, text TEXT NOT NULL);
CREATE INDEX journal_steps_by_entry ON journal_steps (entry, id);
```

`day = natsumeDay(new Date(at))`; `refs` JSON or NULL; `title` cut at 200 characters. Origin texts for `noteCardGesture` (`from`): `accueil` « depuis l'accueil », `valider` « depuis À trancher », `fil` « depuis la conversation », `carte` « depuis la carte », `file` « depuis la file » (slice 4's origin).

- [x] **Step 4: Run to verify they pass**

Run: `npx vitest run --project core core/src/journal/store.test.ts`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add core/src/db.ts core/src/journal/store.ts core/src/journal/store.test.ts
git commit -m "feat(core): journal and journal_steps tables with their writer" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: The history moves into the Journal

**Files:**
- Modify: `core/src/db.ts` (`MIGRATIONS` accepts `string | ((db: DatabaseSync) => void)`; append `(db) => importHistory(db)`)
- Create: `core/src/journal/import.ts`
- Test: `core/src/journal/import.test.ts`

**Interfaces:**
- Consumes: Task 1 `appendJournal`, `addStep`, `NATSUME_POST`; `CORE_SOURCE`; `NIGHT`, `MORNING`.
- Produces: `importHistory(db: DatabaseSync): void` (one call, inside the migration's transaction, on an empty `journal`).

Sources, all collected first, then sorted by `at` (ties by source order below, then source id) and appended one by one:

| Source | Entry | Outcome | Steps |
|---|---|---|---|
| `events`, `importance = 'urgent'` | `urgence`, title, `eventId` | none for `agenda.reminder`; `vue` when in `event_seen`, else `a-trancher` | « Reçue. » at `at`; « Vue. » at `seen_at` when seen |
| `events`, `normal`/`low`/`info` | `evenement` | none | « Reçu. » |
| `gestures` | `carte`, title, `cardId`, meta = origin text | `échec` → `echoue`, else `tranchee` | « Validée. », « Refusée. » or « Échec. » at `at` |
| `delegations` | `confie`, title = request, meta by origin (`conversation` « depuis la conversation », `fait` « C'est fait », `nuit` « veille de la nuit ») | `faite` → `fait`, else `echoue` | « Confié à <postName>. » |
| `routine_runs`, not `running` | `routine`, `lunanima`, title by name, `cost`, `durationMs` = ended − started, meta = `reason` | `ok` → `fait`, `failed` → `echoue` | « Faite. » or « Échec : <reason>. » at `COALESCE(ended_at, started_at)` |

`satellite_id = 'core'` becomes `lunanima`. A `log` event is never read. A row whose time is not a valid date is skipped.

- [x] **Step 1: Write the failing tests**

```ts
// fresh openDb(':memory:'): journal empty; insert rows into the old tables, then importHistory(db).
it('keeps time order across sources', () => {
  // delegation 08:00, urgent event 07:00, gesture 09:00, routine ended 06:00
  expect(rows().map((r) => [r.id, r.type])).toEqual([[1, 'routine'], [2, 'urgence'], [3, 'confie'], [4, 'carte']]);
});
it('a seen urgency is « vue » with two steps, an unseen one « a-trancher », a reminder has no outcome', () => {});
it('log events stay out, info events come in as « evenement »', () => {});
it('a core event is Natsume\'s', () => { expect(row(eventN).post).toBe('lunanima'); });
it('a row with an unreadable time is skipped, the rest comes in', () => {
  // gestures row with at = 'garbage' (natsumeDay would throw RangeError and abort the whole migration)
  expect(rows().map((r) => r.title)).not.toContain('garbage row');
});
```

- [x] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/journal/import.test.ts`
Expected: FAIL

- [x] **Step 3: Implement** `importHistory` and the runner change (`typeof m === 'string' ? db.exec(m) : m(db)` inside the existing `BEGIN`/`COMMIT`).

- [x] **Step 4: Run to verify they pass, and that every older migration test still passes**

Run: `npx vitest run --project core`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add core/src/db.ts core/src/journal/import.ts core/src/journal/import.test.ts
git commit -m "feat(core): replay the existing history into the Journal" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Every history write goes to the Journal

**Files:**
- Modify: `core/src/events/store.ts` (`storeEvent`), `core/src/events/core-events.ts` (`emitCoreEvent`)
- Modify: `core/src/accueil/routes.ts` (`/events/:id/seen` → `noteSeen`; `/dues/:factId/done` passes cost and cards)
- Modify: `core/src/satellites/routes.ts` (gesture route: `noteCardGesture` replaces `INSERT INTO gestures`; `ORIGINS` gains `'file'`)
- Modify: `core/src/delegations/store.ts`, `core/src/chat/service.ts` (`#record` gets cost and cards), `core/src/routines/night-day.ts` (unchanged call, still compiles)
- Modify: `core/src/routines/engine.ts` (`endRun` and the interrupted-runs update journal the run)
- Modify: `core/src/satellites/store.ts` (`pairSatellite` and `unlinkSatellite` write a `liaison`)
- Modify: `core/src/db.ts` (append `ALTER TABLE delegations ADD COLUMN cost REAL; ALTER TABLE delegations ADD COLUMN journal_id INTEGER;`)
- Test: `core/src/journal/writes.test.ts`

**Interfaces:**
- Consumes: Task 1 writer.
- Produces:
  - `Delegation` gains `cost?: number; cards?: { title: string }[]`; `recordDelegation(db, d): number` returns the journal `id` and stores it in `delegations.journal_id`. Steps: « Confié à <postName>. », then one « Carte rendue : <title>. » per card, or « <postName> n'a pas répondu. » (`sans-reponse`) / « Échec. » (`echouee`). Outcome `fait` / `echoue`. Cost from `AgentReply.cost.amount` when it is a finite number (`readReply` does not check it).
  - `storeEvent`: when the insert changed a row (`changes === 1`), `appendJournal` inside the same transaction (`urgence` or `evenement` as in Task 2, `eventId` = the new row id, step « Reçue. »/« Reçu. »). `emitCoreEvent` does the same under `lunanima`.
  - `endRun` and the start-up `UPDATE … WHERE status = 'running'` (use `RETURNING id`) call one `journalRun(db, runId)` in `engine.ts`, same mapping as Task 2.
  - `pairSatellite`: after the upsert, `liaison`, title « <nom> relié. », no outcome.
  - `unlinkSatellite` (slice 2 Task 9): inside its transaction, before the row goes, `liaison`, title « <nom> délié. », no outcome (slice 2 stays journal-free).

Every new call outside a transaction is best effort like today's `#record`: try/catch, log, the main action never fails for the Journal. Inside `storeEvent`/`emitCoreEvent` it shares their transaction.

- [x] **Step 1: Write the failing tests**

```ts
it('an urgent event enters once, even replayed', async () => {
  // harness + FakeSatellite; fake.emit urgent; then the stream replays it (reconnect with Last-Event-ID before it)
  await waitFor(() => count("type = 'urgence'") === 1);
  /* force reconnection */ await waitFor(() => fake.connections() === 2);
  expect(count("type = 'urgence'")).toBe(1);
});
it('seen marks the urgency « vue »', async () => { await post(`/api/events/${id}/seen`); expect(outcome(n)).toBe('vue'); });
it('a relayed gesture updates the card entry and writes no gestures row', async () => {
  expect(h.db.prepare('SELECT COUNT(*) AS c FROM gestures').get()).toEqual({ c: 0 });
});
it('a delegation from the conversation carries its cost and the cards it returned', async () => {
  // fake.queueAgent({ summary: 'ok', cards: [card('k1')], refs: [], cost: { currency: 'USD', amount: 0.012 } })
  expect(entry).toMatchObject({ type: 'confie', outcome: 'fait', cost: 0.012 });
  expect(steps(entry.id).map((s) => s.text)).toEqual(['Confié à Lun’Acedia.', 'Carte rendue : Classer la facture.']);
  expect(h.db.prepare('SELECT journal_id FROM delegations').get()).toEqual({ journal_id: entry.id });
});
it('a routine run ends in the Journal with its cost and duration, an interrupted one as « echoue »', () => {});
it('pairing a post writes « relié »', async () => { expect(lastEntry()).toMatchObject({ type: 'liaison', title: 'Lun’Acedia relié.' }); });
it('unlinking a post writes « délié »', async () => { await del('/api/satellites/lunacedia'); expect(lastEntry()).toMatchObject({ type: 'liaison', title: 'Lun’Acedia délié.' }); });
it('a broken journal never fails the gesture relay', async () => { /* DROP TABLE journal_steps; relay → 200 */ });
```

- [x] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/journal/writes.test.ts`
Expected: FAIL

- [x] **Step 3: Implement** as in the Interfaces block.

- [x] **Step 4: Run to verify they pass**

Run: `npx vitest run --project core`
Expected: PASS (the old `journal/journal.test.ts` gesture tests that read `/api/journal` still pass against the old route until Task 6 removes them; any that asserts a `gestures` row is changed to read the `journal` table)

- [x] **Step 5: Commit**

```bash
git add core/src
git commit -m "feat(core): events, gestures, delegations, routines and pairing write the Journal" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: A card enters the Journal at its first read

**Files:**
- Modify: `core/src/reads/store.ts` (`saveCardRead`)
- Create: `core/src/journal/cards.ts`
- Test: `core/src/journal/cards.test.ts`

**Interfaces:**
- Consumes: slice 2 `saveCardRead`, `cardRead`; Task 1 `appendJournal`, `addStep`, `entryOfCard`, `postName`.
- Produces: `journalCards(db: DatabaseSync, satelliteId: string, at: Date, cards: Card[]): void`, called by `saveCardRead` before its upsert, both in one transaction (`BEGIN`/`COMMIT` in `saveCardRead`).

Rules: a card with no entry for `(satelliteId, card.id)` → `appendJournal({ type: 'carte', post: satelliteId, title: card.title, meta: card.kind, outcome: 'a-trancher', cardId, at: card.at or read time, step: '<postName> propose.' })`. A card id in the previous `card_reads` row and absent from `cards`, whose latest entry is still `a-trancher` → `addStep(id, at, 'Tranchée dans <postName>.', 'tranchee')`.

- [x] **Step 1: Write the failing tests**

```ts
it('a card enters once, at its own time, « a-trancher »', () => {
  saveCardRead(db, 'lunacedia', t(0), [card('a')]);
  saveCardRead(db, 'lunacedia', t(1), [card('a')]);
  expect(rows("type = 'carte'")).toEqual([expect.objectContaining({ card_id: 'a', at: card('a').at, outcome: 'a-trancher' })]);
});
it('a restart with card_reads already full adds nothing', () => {
  saveCardRead(db, 'lunacedia', t(0), [card('a')]);
  const reopened = openDb(file); // same file database
  saveCardRead(reopened, 'lunacedia', t(1), [card('a')]);
  expect(count(reopened, "type = 'carte'")).toBe(1);
});
it('a card decided in the post\'s own front becomes « tranchee »', () => {
  saveCardRead(db, 'lunacedia', t(0), [card('a')]); saveCardRead(db, 'lunacedia', t(1), []);
  expect(outcomeOf('a')).toBe('tranchee'); expect(lastStep('a')).toBe('Tranchée dans Lun’Acedia.');
});
it('a card already decided through the core keeps its own step', () => { /* noteCardGesture then gone → no extra step */ });
it('a card that had a gesture before the migration does not enter again', () => { /* entry from importHistory with card_id 'a' */ });
```

- [x] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/journal/cards.test.ts`
Expected: FAIL

- [x] **Step 3: Implement** `journalCards` and the call in `saveCardRead`.

- [x] **Step 4: Run to verify they pass**

Run: `npx vitest run --project core core/src/journal core/src/reads`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add core/src/journal/cards.ts core/src/journal/cards.test.ts core/src/reads/store.ts
git commit -m "feat(core): a card enters the Journal at its first read" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: The Journal routes

**Files:**
- Create: `core/src/journal/query.ts`
- Rewrite: `core/src/journal/routes.ts`
- Test: `core/src/journal/routes.test.ts`

**Interfaces:**
- Consumes: Task 1 tables, `fold`, `JOURNAL_TYPES`; `natsumeDay`, `dayStart`, `isDay`; slice 2 `cardRead`.
- Produces (`core/src/journal/query.ts`), **consumed by slice 5 (`/api/word`: « Ce que j'ai fait », the Journal's word, the Atelier's last `reglage` lines) and slice 6 (the Journal place)**:

```ts
export type Periode = 'auj' | '7j' | 'tout';
export interface JournalQuery { periode: Periode; post?: string /* URL param `poste` */; type?: JournalType; q?: string; avant?: string /* YYYY-MM-DD */ }
export interface JournalRow { id: number; at: string; type: JournalType; post: string; title: string; meta?: string; outcome?: JournalOutcome; cost?: number; durationMs?: number }
export interface JournalPage { total: number; since?: string; matched: number; days: { day: string; count: number; entries: JournalRow[] }[]; next: string | null }
export interface JournalDetail extends JournalRow {
  steps: { at: string; text: string }[]; refs?: Ref[]; cardId?: string; eventId?: number; threadId?: string; messageId?: number;
  pending?: { satellite: string; card: Card } | { event: number };
}
export function listJournal(db: DatabaseSync, query: JournalQuery, now: Date): JournalPage;
export function journalEntry(db: DatabaseSync, id: number, now: Date): JournalDetail | undefined;
```

- `total` and `since` (the first entry's `at`) ignore every filter (« 1 286 événements depuis le 12 octobre »); `matched` counts entries matching all filters, period included.
- Days: the up-to-7 most recent distinct `day` values matching the filters with `day < avant` (when given) and inside the period, newest first; entries newest first inside a day; `next` = the oldest returned day when another matching day exists before it, else `null`.
- Row outcome: a stored `a-trancher` on an `urgence` whose `at` is before `dayStart(natsumeDay(now))` is left out.
- `pending`: a `carte` entry whose card is in `cardRead(db, post).cards` → `{ satellite, card }`; an `urgence` whose row outcome is `a-trancher` → `{ event: eventId }`.
- Routes: `GET /journal?periode&poste&type&q&avant` → `200 JournalPage`; `400 { error }` for a `periode` outside `auj|7j|tout` (« periode attend auj, 7j ou tout »), a `type` outside `JOURNAL_TYPES`, an `avant` that is not `isDay`, a `poste` param not matching `^[a-z]{1,40}$`; `q` trimmed, cut at 100 characters, ignored when empty. `GET /journal/:id` → `200 JournalDetail`, `404 { error: 'Entrée inconnue : <id>' }`.

- [x] **Step 1: Write the failing tests**

```ts
// clock 2026-11-02T13:00Z (14:00 Paris); entries written with appendJournal.
it('defaults to 7 days, newest first, grouped by Natsume day', async () => {
  // entries on 2026-11-02 10:00Z, 2026-11-02 03:30Z (04:30 Paris → day 11-01), 2026-10-20
  const p = await journal('');
  expect(p.days.map((d) => d.day)).toEqual(['2026-11-02', '2026-11-01']);
  expect(p).toMatchObject({ total: 3, since: '2026-10-20T…', matched: 2, next: null });
});
it('« auj » keeps today, « tout » reaches the oldest', async () => {});
it('searches without accents, case or curly apostrophes', async () => {
  // titles « Banqué : justificatif », meta « Lun’Acedia propose »
  expect((await journal('?q=BANQUE')).matched).toBe(1);
  expect((await journal("?q=lun'acedia")).matched).toBe(1);
});
it('a % or _ in the search matches itself only', async () => {
  expect((await journal('?q=%25')).matched).toBe(0);
});
it('filters by post and type, and combines them with the search', async () => {});
it('a page skips empty days and says when older ones exist', async () => {
  // 9 matching days spread over 40 days, periode=tout
  const p1 = await journal('?periode=tout&q=paul');
  expect(p1.days).toHaveLength(7); expect(p1.next).toBe(p1.days[6]!.day);
  const p2 = await journal(`?periode=tout&q=paul&avant=${p1.next}`);
  expect(p2.days).toHaveLength(2); expect(p2.next).toBeNull();
});
it('an urgency left unseen yesterday shows no « a-trancher », today\'s does', async () => {});
it('the detail gives the chain and the card still waiting', async () => {
  saveCardRead(h.db, 'lunacedia', h.clock(), [card('a')]);
  const d = await get(`/api/journal/${entryOfCard(h.db, 'lunacedia', 'a')}`);
  expect(d.body).toMatchObject({ steps: [{ text: 'Lun’Acedia propose.' }], pending: { satellite: 'lunacedia', card: { id: 'a' } } });
});
it('rejects bad filters with 400 and an unknown entry with 404', async () => {
  for (const q of ['?periode=mois', '?type=autre', '?avant=2026-13-01', '?poste=Lun Acedia']) expect((await get('/api/journal' + q)).status).toBe(400);
  expect((await get('/api/journal/999')).status).toBe(404);
});
it('no cost total anywhere in the page', async () => { expect(Object.keys(p)).toEqual(['total', 'since', 'matched', 'days', 'next']); });
it('calls no post', async () => { const before = calls(); await journal(''); expect(calls()).toBe(before); });
```

- [x] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/journal/routes.test.ts`
Expected: FAIL

- [x] **Step 3: Implement** `listJournal`, `journalEntry`, the two routes (`journalRoutes(deps: Pick<AppDeps, 'db' | 'clock'>)`, mounted where it is today).

- [x] **Step 4: Run to verify they pass**

Run: `npx vitest run --project core core/src/journal`
Expected: PASS (delete `core/src/journal/journal.test.ts` here: its route assertions are the old shape; its gesture assertions moved to Task 3)

- [x] **Step 5: Commit**

```bash
git add core/src/journal
git commit -m "feat(core): Journal routes with periods, filters and accent-free search" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: The map leaves

**Files:**
- Delete: `core/src/map/` (`map.ts`, `map.test.ts`, `routes.ts`), `core/src/journal/journal.ts`
- Modify: `core/src/app.ts` (drop `mapRoutes`; `RoutineSlot` imported from `./routines/engine.ts`; `routineSchedule` comment « When each routine is due (Paris), for Ce qui vient »)
- Modify: `README.md` (replace the two lines on `GET /api/journal` and `GET /api/map`)

**Interfaces:**
- Consumes: slice 2 `RoutineSlot` in `routines/engine.ts`.
- Produces: no `/api/map`; nothing imports `map/` or `journal/journal.ts`.

- [x] **Step 1: Write the failing test** (in `core/src/journal/routes.test.ts`)

```ts
it('the map is gone', async () => { expect((await get('/api/map')).status).toBe(404); });
```

- [x] **Step 2: Run to verify it fails**

Run: `npx vitest run --project core core/src/journal/routes.test.ts`
Expected: FAIL (200)

- [x] **Step 3: Delete and rewire**; README lines:
  - `GET /api/journal?periode=auj|7j|tout&poste=&type=&q=&avant=<AAAA-MM-JJ>` : le Journal par journée de Natsume (coupe à 05:00), sept journées non vides par page ; rend `{ total, since, matched, days, next }`. Recherche sans accents ni casse. Aucun appel aux postes.
  - `GET /api/journal/:id` : une entrée, sa chaîne et la carte encore en attente.

- [x] **Step 4: Full gate**

Run: `npm test && npm run lint && npm run typecheck && npm run format:check`
Expected: all green (UI untouched: its tests mock the core; see the UI ruling)

Run: `git grep -n "map/map\|mapRoutes\|journalDays\|journalEntriesOf" -- core`
Expected: no output

- [x] **Step 5: Commit**

```bash
git add -A core/src README.md
git commit -m "refactor(core): remove the map of a past day and its route" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Self-review notes

- Spec coverage (slice 3 of §15): `journal`, `journal_steps`, stable types (Task 1); history of `events` (not `log`), `gestures`, `event_seen`, `delegations`, `routine_runs` in time order (Task 2); « Un geste ou une vue met à jour l'issue … et ajoute une étape » and delegation cost from `AgentReply.cost` (Task 3); first read (Task 4); routes, periods with `7j` default, day pages, accent-free substring search, detail with chain and waiting card (Task 5); `/api/map` and `map/` removed (Task 6).
- Left out on purpose: held gestures and their relay note (slice 4, uses `noteCardGesture`/`noteSeen`); `pause`, `reglage`, skipped routines and `/api/word` (slice 5, uses `appendJournal`, `listJournal`); the Journal place and the removal of the UI map (slice 6, uses `listJournal`/`journalEntry` bodies); calendar, cursor, full-text (palier 4).
- « Voir la conversation » (§6.3) needs `threadId`/`messageId`; columns exist, but no writer fills them in this slice (the conversation enters only by its effects). See the ruling on `threadId`.
