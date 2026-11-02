# Natsume au centre, slice 4: held gestures and undo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every gesture of the queue (accept, refuse, an answer, Vu, C'est fait, Plus tard, a pile, a batch) goes through `POST /api/gestures`. The core holds it for 5 s in a persisted `held_gestures` table and takes its cards out of `/api/queue` at once. Then it relays the gesture to the post, or drops it on `DELETE`. The kit's toast shows one undoable line with Ctrl Z and the time left.

**Architecture:** A new `core/src/gestures/` holds three files: a store (tables, hold, cancel, claim, outcomes, what to hide), a `GestureRelay` (timers, relay of each item, Journal note, read-again) and the routes. The routes check a gesture against `buildQueue` (slice 2), so the batch, pile, read-only and question rules come from one place. `buildQueue` drops held targets and the ones just relayed. On the front, the shared kit (`lun-docs/design/kit`) changes its toast. A small `ui/src/gestures/held.ts` posts a gesture, toasts it with an undo bound to `DELETE`, and reads its outcome. The places that call it are slice 6.

**Tech Stack:** Node `^22.13.0 || >=24`, TypeScript run by `--experimental-strip-types`, Hono 4, `node:sqlite`, zod 4, vitest 5 (projects `core` and `ui`), Svelte 5 runes, Bits UI, `@lucide/svelte`, `@testing-library/svelte`.

**Spec:** `lun-docs/docs/specs/2026-11-02-natsume-au-centre-design.md` (§4.6, §4.9, §6.1 Gestes, Pile, Lot, Après un geste; §7 last paragraph; §9.3; §9.6 first bullet; §9.8 Cartes and Réponse; §12 Kit; §14 Bureau; §15 slice 4).

**Repos / branches:**
- `lun-anima`: new branch `feat/core-held-gestures` cut from `feat/core-journal` (slice 3, which sits on slice 2's `feat/core-read-loop`).
- `lun-docs`: new branch `feat/kit-natsume-centre` cut from `main`, shared with slice 6: it carries this slice's toast and undo kit change (Task 4) and slice 6's tokens (`--anima*`, `--marque*`, `--cadre-focus`, the neutre block). It is merged into lun-docs `main` before the lun-anima PRs that copy the kit: lun-anima's CI checks the kit copy against lun-docs `main`.

## Global Constraints

- No new dependency. Migrations are appended to `MIGRATIONS` in `core/src/db.ts` and never edited.
- « Les routes de l'API ne parlent que d'identifiants de satellite (`lunacedia`) » : every `satellite` field in a gesture body or view is a satellite id.
- « Annuler pendant 5 s, tenu par le core » : `HOLD_MS = 5_000`, counted from the core's clock at `POST`.
- « Tous les gestes de la file passent par là, « C'est fait » et « Plus tard » compris : une seule règle d'annulation. »
- « Le geste relayé est noté au Journal à son relais ; un geste annulé n'y laisse rien. »
- « Lot : seulement des cartes d'un même poste, `effect: 'write'`, sans `sends` ni `options`, hors pile, d'un poste qui parle la v1.4. Le core refuse un lot qui contient autre chose (`400`). » This is exactly `QueueCard.batchable` from slice 2. Its v1.4 test reads `Health.contract` (coordinator ruling, slice 1), never `Health.version`.
- « La route de geste directe actuelle (`POST /satellites/:id/cards/:card/accept|refuse`) reste pour le fil et les outils, sans délai. » `/dues/*` and `/events/:id/seen` also stay as they are.
- « Au démarrage, le core relaie les gestes tenus dont l'heure est passée. »
- `sends: true` means « writes to the outside, never batched ». Accepting a Lun'Acedia reply card only creates a Gmail draft. Its wording is « Brouillon créé : … », never « Réponse envoyée ».
- Only Lun'Avaritia's contradiction and doublon cards carry `options`. The satellite answers a free answer it does not take with a `400`. That `400` is shown as the card's error, never as a toast.
- Toast: « Un seul toast à la fois … Une ligne, puis « Annuler » avec la touche Ctrl Z affichée, et le temps qui reste (5 s). … Ctrl Z n'agit pas depuis un champ. Toast sans annulation (information) : 3 s. »
- On-screen text follows §3: no « · », no « → » in a button, no em dash, no capitalised label, never « core ». Error strings stored for display are in French; code, comments and commits are in English.
- Svelte: runes only, tokens only (no colour written in a style), no Tailwind. Kit files are edited in `lun-docs/design/kit` only, then copied with `node "../lun-docs/tools/sync-kit.mjs" ui/src/lib/ui`. Never edit the copy.
- Tests: `npx vitest run --project core <file>` and `npx vitest run --project ui <file>` from the lun-anima root. Full gate: `npm test && npm run lint && npm run typecheck && npm run format:check`.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

**Interfaces consumed from slice 2 (exactly as its plan names them):**
- `buildQueue(deps: { db; satellites: SatelliteManager; reads: ReadLoop }, now: Date): Queue` in `core/src/reads/queue.ts`, with `QueueCard { satellite; card; batchable; sends; options?; readOnly; readOnlyReason? }`, `QueuePile { satellite; cards; readOnly }`, `QueueDue { satellite: 'lunavaritia'; due: Due; readOnly }`, `QueueUrgent { id; satellite; title }`, `Queue { total; urgent; groups: QueueGroup[] }`.
- `cardRead(db, satelliteId): { readAt; cards } | undefined` and `cached<T>(db, key): { readAt; value } | undefined` (key `dues`) in `core/src/reads/store.ts`.
- `ReadLoop.readNow(satelliteId): Promise<void>` and `AppDeps.reads`.

**Interfaces consumed from slice 3 (its Task 1 and Task 3, `core/src/journal/store.ts` and `core/src/delegations/store.ts`):**

```ts
noteCardGesture(db, g: { at: string; post: string; card: Card; gesture: 'accept' | 'refuse'; from?: string; answer?: string }): void;
// settles the card's existing entry: « Validée. » / « Brouillon créé. » (card.sends) / « Réponse donnée : <answer>. » / « Refusée. », outcome tranchee
noteSeen(db, eventId: number, at: string): void;   // « Vue. », outcome vue
appendJournal(db, entry: JournalInput): number;    // JournalInput { at; type; post?; title; meta?; outcome?; …; step? }
recordDelegation(db, d): number;                   // journals the delegation itself (type confie, outcome fait / echoue)
```

Mapping of each `ok` item:
- An accepted or refused card goes to `noteCardGesture({ at, post, card, gesture, from: 'file', answer })`. `card` is the card from the post's answer (`{ card }`); when that body is unreadable, it is the snapshot taken at hold time with `status: 'done'`.
- Vu goes to `noteSeen(eventId, at)`.
- C'est fait is journaled by `recordDelegation`, which `markDueDone` already calls. No other call is made, so it is never written twice.
- Plus tard goes to `appendJournal({ at, type: 'carte', post: 'lunavaritia', title: due.fiche, meta: 'Plus tard', step: 'Plus tard.' })`, with no outcome.

`addStep` is not needed here.

**Rulings made where the spec is silent (binding for this plan):**

- Gesture items live in a second table, `held_gesture_items`. That way the queue can hide a card by query, and the outcome is kept per card.
- A gesture on a target missing from `buildQueue` gets `409 { error: 'Déjà tranchée ailleurs.' }`. That covers unknown, already decided, and already held by another device. A read-only target gets `409 { error: 'Carte en lecture seule.' }`. A malformed body gets `400`.
- A gesture that covers exactly the cards of one pile is a pile gesture, not a batch. Each card may be accepted or refused (« Valider celle-ci » accepts one and refuses the other). Any other gesture of two or more cards is a batch: all `accept`, all `batchable`, one satellite, otherwise `400`.
- `input` is allowed only on `accept` of a card that has `options`, as `{ answer }` (trimmed, 1 to 500 characters). Such a card cannot be accepted without it. Anywhere else, `input` gets `400`.
- Superseding is front-only: a new toast drops the previous toast's Annuler, and that gesture leaves at its time. The core keeps `DELETE` valid for any gesture until its `dueAt` (§9.3). Two devices never cancel each other's gestures.
- `DELETE` after `dueAt` gets `409 { error: 'Trop tard pour annuler.' }`, even when the timer has not fired yet.
- Each card relay is bounded to `RELAY_TIMEOUT_MS = 15_000`. When the post is unreachable, unpaired, has no client, gives a 5xx or times out, the item is `failed` with « <nom> n'a pas répondu, rien n'a été fait. ». A post `409` is `conflict`. Any other 4xx is `failed`, with the satellite's own `{ error }` as the reason.
- After a relay, a card with an `ok` or `conflict` outcome stays out of the queue until a `card_reads` row newer than the relay arrives. Likewise, a due marked done stays out until a `dues` cache read is newer than the relay. The relay calls `reads.readNow` for each satellite it touched.
- Only `ok` items are journaled (mapping above). A `failed` or `conflict` item leaves the card's entry at « À trancher ».
- The « C'est fait » summary from Lun'Avaritia is kept on the item (`summary`) and shown by `GET /api/gestures/:id`.
- `from` is optional, `'bureau' | 'trancher'`, and stored on the gesture. The Journal always gets slice 3's origin `'file'` (« depuis la file »).
- A held card item keeps a snapshot of its `Card` (from the queue), so the relay can journal it even when the post's answer has no card.
- An information toast that arrives while an undoable toast is counting waits for the undoable toast to end; the latest such toast wins. Only a new undoable toast replaces one that is counting. A danger toast is information and lasts 5 s.
- Toast texts for the forms the spec does not give: « C'est fait : <titre>. », « Plus tard : <titre>. ». In a batch, the noun is the last word of the shared `kind`, lowercased and pluralised with « s », or « cartes » when the kinds differ or are missing. The participle is feminine (fiche, carte).
- The kit's Toaster gains `contained?: boolean`: it is centred in its positioned parent instead of the window, so slice 6 can centre it on the place's page. Its default keeps today's placement for the satellites.

## Review Focus

1. Ctrl Z or `DELETE` after `dueAt` but before the timer fires: the answer is 409 and the relay still happens. Nothing is half-cancelled. Pinned in Task 3.
2. A double click, or two devices on the same card: the second `POST` gets 409, and the card is relayed once. Pinned in Task 3.
3. A core restart in the middle of a gesture (state `relaying`, one item already done): only the items without an outcome are relayed, so « C'est fait » is never delegated twice. Pinned in Task 2.
4. A post that hangs during the relay: after 15 s the item is `failed` with its reason, the card comes back, and the next gestures still go. Pinned in Task 2.
5. Between the relay and the next read, the decided card must not flash back into the queue or the counters. Pinned in Task 1.

---

### Task 1: Held gesture tables, store, and the queue that hides them

**Files:**
- Modify: `core/src/db.ts` (append one migration)
- Create: `core/src/gestures/store.ts`
- Modify: `core/src/reads/queue.ts` (`buildQueue` filters before forming piles)
- Test: `core/src/gestures/store.test.ts`, `core/src/reads/queue.test.ts` (add a `describe`)

**Interfaces:**
- Consumes: slice 2 `buildQueue`, `cardRead`, `cached('dues')`.
- Produces (`core/src/gestures/store.ts`):

```ts
export const HOLD_MS = 5_000;
export type HeldItem =
  | { kind: 'card'; satellite: string; target: string; gesture: 'accept' | 'refuse'; title: string; input?: { answer: string }; card: Card }
  | { kind: 'event'; satellite: string; target: number; gesture: 'seen'; title: string }
  | { kind: 'due'; satellite: 'lunavaritia'; target: number; gesture: 'done' | 'later'; title: string; text: string };
export type ItemOutcome = 'ok' | 'failed' | 'conflict';
export type GestureState = 'held' | 'relaying' | 'relayed' | 'cancelled';
export interface GestureView {
  id: number; state: GestureState; dueAt: string;
  items: { kind: HeldItem['kind']; satellite: string; target: string; gesture: HeldItem['gesture']; outcome?: ItemOutcome; reason?: string; summary?: string }[];
}
export function holdGesture(db: DatabaseSync, items: HeldItem[], now: Date, origin?: 'bureau' | 'trancher', holdMs?: number): { id: number; dueAt: string };
export function cancelGesture(db: DatabaseSync, id: number, now: Date): 'cancelled' | 'late' | 'unknown';
export function claimGesture(db: DatabaseSync, id: number): boolean;             // held -> relaying, atomic
export function pendingItems(db: DatabaseSync, id: number): (HeldItem & { n: number })[]; // items without outcome
export function settleItem(db: DatabaseSync, id: number, n: number, outcome: ItemOutcome, at: Date, extra?: { reason?: string; summary?: string }): void;
export function finishGesture(db: DatabaseSync, id: number): void;              // relaying -> relayed
export function overdueGestures(db: DatabaseSync, now: Date): number[];         // held, due_at <= now, oldest first
export function waitingGestures(db: DatabaseSync): { id: number; dueAt: string }[]; // held
export function interruptedGestures(db: DatabaseSync): number[];                // relaying (only read at start)
export function gestureView(db: DatabaseSync, id: number): GestureView | undefined;
export interface Hidden { cards: Map<string, string | null>; events: Set<number>; dues: Map<number, string | null> }
export function hiddenTargets(db: DatabaseSync, now: Date): Hidden;
```

`hiddenTargets` keys cards as `` `${satellite}:${cardId}` ``. A value of `null` means the target is still `held` or `relaying` and has no outcome yet. Otherwise the value is the `done_at` of an `ok` or `conflict` outcome from the last 24 h. `events` holds the event ids that are still held (a relayed Vu is already in `event_seen`). `dues` follows the cards rule for `done`; a relayed `later` is already in `due_later`.

- [ ] **Step 0: Branch**

Run: `git switch feat/core-journal && git pull && git switch -c feat/core-held-gestures`
Expected: `Switched to a new branch 'feat/core-held-gestures'`

- [ ] **Step 1: Write the failing tests**

```ts
// store.test.ts — openDb(':memory:'), t(s) = new Date(Date.parse('2026-11-02T08:00:00.000Z') + s * 1000)
const card = (id: string): HeldItem => ({ kind: 'card', satellite: 'lunacedia', target: id, gesture: 'accept', title: id, card: pendingCard(id) });
it('holds a gesture for 5 s', () => {
  expect(holdGesture(db, [card('a')], t(0))).toEqual({ id: 1, dueAt: t(5).toISOString() });
  expect(gestureView(db, 1)).toMatchObject({ state: 'held', items: [{ kind: 'card', target: 'a', gesture: 'accept' }] });
});
it('cancels while the delay runs, never after', () => {
  const { id } = holdGesture(db, [card('a')], t(0));
  expect(cancelGesture(db, id, t(4.999))).toBe('cancelled');
  expect(cancelGesture(db, id, t(4.999))).toBe('late');
  const second = holdGesture(db, [card('b')], t(10)).id;
  expect(cancelGesture(db, second, t(15))).toBe('late');
  expect(cancelGesture(db, 99, t(0))).toBe('unknown');
});
it('a claimed gesture can no longer be cancelled, nor claimed twice', () => {
  const { id } = holdGesture(db, [card('a')], t(0));
  expect(claimGesture(db, id)).toBe(true);
  expect(claimGesture(db, id)).toBe(false);
  expect(cancelGesture(db, id, t(1))).toBe('late');
});
it('pending items leave once settled', () => {
  const { id } = holdGesture(db, [card('a'), card('b')], t(0));
  settleItem(db, id, 0, 'ok', t(6));
  expect(pendingItems(db, id).map((i) => i.target)).toEqual(['b']);
});
it('hides held cards, and relayed ones until a newer read', () => {
  const { id } = holdGesture(db, [card('a')], t(0));
  expect(hiddenTargets(db, t(1)).cards.get('lunacedia:a')).toBeNull();
  claimGesture(db, id); settleItem(db, id, 0, 'ok', t(6)); finishGesture(db, id);
  expect(hiddenTargets(db, t(7)).cards.get('lunacedia:a')).toBe(t(6).toISOString());
  const { id: c } = holdGesture(db, [card('x')], t(0)); cancelGesture(db, c, t(1));
  expect(hiddenTargets(db, t(2)).cards.has('lunacedia:x')).toBe(false);
});
it('a failed card is not hidden', () => { /* settle 'failed' → absent from hiddenTargets */ });

// queue.test.ts, describe('held gestures')
it('a held card leaves the queue and the total at once', () => {
  // card_reads for lunacedia read at t(0) with cards a, b; hold accept on a
  expect(ids(buildQueue(deps, t(1)))).toEqual(['b']);
  expect(buildQueue(deps, t(1)).total).toBe(1);
});
it('a cancelled card comes back', () => { /* cancel → ids ['a', 'b'] */ });
it('a relayed card stays out until a read newer than the relay', () => {
  // relay ok at t(6); card_reads still at t(0) with a → hidden; saveCardRead at t(7) still with a → shown again
});
it('one held card of a pile leaves the other as a single card', () => {
  expect(group.items).toEqual([expect.objectContaining({ type: 'card', card: expect.objectContaining({ id: 'p2' }) })]);
});
it('a held Vu hides its urgent event, a held due hides its due', () => { /* events, dues */ });
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/gestures/store.test.ts core/src/reads/queue.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement**

Migration:

```sql
CREATE TABLE held_gestures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  due_at TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('held', 'relaying', 'relayed', 'cancelled')),
  origin TEXT
);
CREATE INDEX held_gestures_by_state ON held_gestures (state, due_at);
CREATE TABLE held_gesture_items (
  gesture_id INTEGER NOT NULL REFERENCES held_gestures (id),
  n INTEGER NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('card', 'event', 'due')),
  satellite_id TEXT NOT NULL,
  target TEXT NOT NULL,
  gesture TEXT NOT NULL CHECK (gesture IN ('accept', 'refuse', 'seen', 'done', 'later')),
  title TEXT NOT NULL,
  payload TEXT,            -- JSON: { input?, card?, text? }
  outcome TEXT CHECK (outcome IN ('ok', 'failed', 'conflict')),
  reason TEXT,
  summary TEXT,
  done_at TEXT,
  PRIMARY KEY (gesture_id, n)
);
CREATE INDEX held_items_by_target ON held_gesture_items (kind, satellite_id, target);
```

`holdGesture` inserts inside one `BEGIN`/`COMMIT`. `cancelGesture` is `UPDATE … SET state = 'cancelled' WHERE id = ? AND state = 'held' AND due_at > ?`, then a lookup tells `late` from `unknown`. `claimGesture` is `UPDATE … SET state = 'relaying' WHERE id = ? AND state = 'held'` and checks `changes === 1`. In `buildQueue`, call `hiddenTargets` once, then drop targets before forming piles. A card is dropped when its value is `null`, or when its `done_at` is at or after `cardRead.readAt`. A due is dropped the same way against `cached('dues').readAt`. An event is dropped when its id is in `events`.

- [ ] **Step 4: Run to verify they pass**

Run: `npx vitest run --project core core/src/gestures core/src/reads`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add core/src/db.ts core/src/gestures/store.ts core/src/gestures/store.test.ts core/src/reads/queue.ts core/src/reads/queue.test.ts
git commit -m "feat(core): held_gestures tables, and the queue hides held cards" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: The delayed relay

**Files:**
- Create: `core/src/gestures/relay.ts`
- Modify: `core/src/satellites/client.ts` (`decide` gets an optional timeout)
- Modify: `core/src/accueil/routes.ts` (extract `putOffDue` and `markDueDone`; the existing routes call them)
- Modify: `core/src/app.ts` (`AppDeps.gestures: GestureRelay`), `core/src/testing/harness.ts` (build it, not started, return `gestures`), `core/src/main.ts` (build, `gestures.start()` right after `satellites.refresh()` in the readable-key branch, otherwise `gestures.start()` anyway; `await gestures.stop()` in shutdown before `satellites.stop()`)
- Test: `core/src/gestures/relay.test.ts`

**Interfaces:**
- Consumes: Task 1 store; `noteCardGesture`, `noteSeen`, `appendJournal` (slice 3, mapping above); `ReadLoop.readNow`; `Posts.delegate`; `getSatellite(db, id)?.nom`; `errorOf(res)`.
- Produces:
  - `client.ts`: `decide(id: string, gesture: 'accept' | 'refuse', input?: unknown, timeoutMs?: number): Promise<Response>`. When `timeoutMs` is given, it passes `AbortSignal.timeout(timeoutMs)`.
  - `accueil/routes.ts`: `putOffDue(db: DatabaseSync, factId: number, now: Date): void` and `markDueDone(deps: { db; clock; log; posts: Posts }, text: string): Promise<{ ok: true; summary: string; cards: RelayedCard[] } | { ok: false; reason: string }>`. It records the delegation as the existing route does.
  - `relay.ts`:

```ts
export const RELAY_TIMEOUT_MS = 15_000;
export class GestureRelay {
  constructor(deps: { db: DatabaseSync; satellites: SatelliteManager; posts: Posts; reads: ReadLoop; clock: () => Date; log: (line: string) => void });
  start(): void;                         // finishes interrupted gestures, relays overdue ones, arms timers for the rest
  stop(): Promise<void>;                 // clears timers, awaits the relay in flight
  arm(id: number, dueAt: string): void;  // a timer at dueAt (core clock), only once started
  disarm(id: number): void;
  relayDue(): Promise<void>;             // every overdue gesture, serialised on one promise chain
}
```

Relay of one gesture: `claimGesture` (when it returns false, the gesture was cancelled, so stop). Then, for each item from `pendingItems`, in order:
- `card`: `client.decide(target, gesture, input, RELAY_TIMEOUT_MS)`. `res.ok` gives `ok`. `409` gives `conflict`. Any other 4xx gives `failed` with `await errorOf(res)`. A 5xx, a thrown error or no client gives `failed` with « <nom> n'a pas répondu, rien n'a été fait. ».
- `event`: `INSERT OR IGNORE INTO event_seen`, then `ok`.
- `due` `later`: `putOffDue`, then `ok`. `due` `done`: `markDueDone(text)`; `ok` keeps `summary`, `failed` keeps « Lun'Avaritia n'a pas répondu, rien n'a été fait. ».

Each item gets `settleItem` right after its call, so a crash resumes at the next item. On `ok`, journal it with the slice 3 mapping (Interfaces consumed from slice 3) (`noteCardGesture` / `noteSeen` / `appendJournal`; C'est fait is already journaled by `recordDelegation`). The call is try/caught and a failure is only logged. When all items are settled, call `finishGesture`, then `void reads.readNow(sat)` (errors logged) for each satellite with an `ok` or `conflict` item.

- [ ] **Step 1: Write the failing tests**

```ts
// harness with FakeSatellite lunacedia (contract 1.4) and lunavaritia; h.gestures not started
it('relays nothing before 5 s, then the gesture once', async () => {
  const { id } = holdGesture(h.db, [card('a')], h.clock());
  await h.gestures.relayDue();
  expect(fake.callsTo('POST /lun/v1/cards/a/accept')).toBe(0);
  h.advance(5_000); await h.gestures.relayDue(); await h.gestures.relayDue();
  expect(fake.callsTo('POST /lun/v1/cards/a/accept')).toBe(1);
  expect(gestureView(h.db, id)).toMatchObject({ state: 'relayed', items: [{ outcome: 'ok' }] });
});
it('a cancelled gesture never reaches the post and leaves no Journal entry', async () => {
  const { id } = holdGesture(h.db, [card('a')], h.clock()); cancelGesture(h.db, id, h.clock());
  h.advance(5_000); await h.gestures.relayDue();
  expect(fake.callsTo('POST /lun/v1/cards/a/accept')).toBe(0);
  expect(h.db.prepare('SELECT COUNT(*) AS n FROM journal_steps').get()!.n).toBe(before);
});
it('relays an answer as input { answer }', async () => {
  holdGesture(h.db, [{ ...card('q'), input: { answer: 'Garder les deux' } }], h.clock());
  h.advance(5_000); await h.gestures.relayDue();
  expect(fake.lastBody('POST /lun/v1/cards/q/accept')).toEqual({ input: { answer: 'Garder les deux' } });
});
it('a post 400 keeps its own reason, a 409 is a conflict, a cut post a failure', async () => {
  fake.failDecide('b', 400, { error: 'Réponse libre refusée pour un doublon' });
  fake.failDecide('c', 409, { error: 'déjà décidée' });
  holdGesture(h.db, [card('b'), card('c')], h.clock()); h.advance(5_000); await h.gestures.relayDue();
  expect(view.items).toEqual([
    expect.objectContaining({ outcome: 'failed', reason: 'Réponse libre refusée pour un doublon' }),
    expect.objectContaining({ outcome: 'conflict' }),
  ]);
  fake.setDown(true); /* hold d, relay */
  expect(viewD.items[0]).toMatchObject({ outcome: 'failed', reason: "Lun'Acedia n'a pas répondu, rien n'a été fait." });
});
it('a post that hangs fails after the relay timeout, and the next gesture still goes', async () => {
  // fake.hangDecide('h'); vi.useFakeTimers({ toFake: ['setTimeout'] }) not needed: pass RELAY_TIMEOUT_MS via AbortSignal → use a 20 ms override exported for tests? No: decide gets timeoutMs from the relay's deps.relayTimeoutMs ?? RELAY_TIMEOUT_MS; the test sets 20.
});
it('Vu, Plus tard and C\'est fait are relayed at their time too', async () => {
  // event → event_seen row only after relay; due later → due_later row only after relay; done → one POST /lun/v1/agent with « C’est fait : … », summary kept
});
it('journals each ok item on its card's existing entry', async () => {
  // appendJournal({ type: 'carte', post: 'lunacedia', title: 'a', cardId: 'a', outcome: 'a-trancher', … }) before the relay
  expect(h.db.prepare('SELECT id, at, type, post, title, meta, outcome FROM journal WHERE card_id = ?').all('a'))
    .toEqual([expect.objectContaining({ type: 'carte', post: 'lunacedia', title: 'a', outcome: 'tranchee' })]); // settled, not a second entry
  expect(lastStepText('a')).toMatch(/^Validée\./); expect(lastStepText('a')).toContain('depuis la file');
});
it('Plus tard is a new entry without outcome; C'est fait is the delegation's own entry, once', async () => {
  expect(h.db.prepare("SELECT type, post, meta, outcome FROM journal WHERE meta = 'Plus tard'").get()).toEqual({ type: 'carte', post: 'lunavaritia', meta: 'Plus tard', outcome: null });
  expect(h.db.prepare("SELECT COUNT(*) AS n FROM journal WHERE type = 'confie'").get()!.n).toBe(1);
});
it('a reply card accepted is journaled « Brouillon créé », an answer « Réponse donnée »', async () => { /* last step of each card entry */ });
it('at start, relays overdue gestures and resumes an interrupted one without redoing its done items', async () => {
  // gesture 1 held, due in the past; gesture 2 'relaying' with item 0 (done → ok) settled, item 1 pending
  h.gestures.start(); await waitFor(() => gestureView(h.db, 2)!.state === 'relayed');
  expect(fake.callsTo('POST /lun/v1/agent')).toBe(0);           // item 0 not delegated again
  expect(gestureView(h.db, 1)!.state).toBe('relayed');
});
it('reads the post again after a relay', async () => { /* readNow spy called with 'lunacedia' */ });
```

To pin the hang, give the constructor deps an optional `relayTimeoutMs` (default `RELAY_TIMEOUT_MS`); the test sets it to 20. If `FakeSatellite` does not yet have `failDecide(id, status, body)`, `hangDecide(id)` and `lastBody(route)`, add them, one small method each.

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/gestures/relay.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement** `GestureRelay` as specified, the `decide` timeout, and the two extractions (`/dues/:factId/later` and `/dues/:factId/done` keep their answers byte for byte). Then wire the harness and `main.ts`. Timers use `unref()`.

- [ ] **Step 4: Run to verify they pass, and that nothing else moved**

Run: `npx vitest run --project core`
Expected: PASS (`home.test.ts` and `satellites/routes.test.ts` unchanged)

- [ ] **Step 5: Commit**

```bash
git add core/src/gestures/relay.ts core/src/gestures/relay.test.ts core/src/satellites/client.ts core/src/accueil/routes.ts core/src/app.ts core/src/main.ts core/src/testing
git commit -m "feat(core): relay held gestures after 5 s, and at start" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: The gesture routes

**Files:**
- Create: `core/src/gestures/routes.ts`
- Modify: `core/src/app.ts` (mount `gestureRoutes(deps)` under the token-protected `/api`)
- Modify: `README.md` (routes list: three lines)
- Test: `core/src/gestures/routes.test.ts`

**Interfaces:**
- Consumes: `buildQueue` (slice 2); Task 1 `holdGesture`, `cancelGesture`, `gestureView`; Task 2 `GestureRelay.arm/disarm`.
- Produces (consumed by Task 5 and slice 6):
  - `POST /api/gestures`, with a body of one of these three shapes:
    - `{ items: { satellite: string; card: string; gesture: 'accept' | 'refuse'; input?: { answer: string } }[]; from?: 'bureau' | 'trancher' }` (1 to 50 items)
    - `{ event: number; gesture: 'seen'; from? }`
    - `{ due: number; gesture: 'done' | 'later'; text?: string; from? }`

    It answers `202 { id: number; dueAt: string }`.
  - `DELETE /api/gestures/:id` answers `204`, `409 { error: 'Trop tard pour annuler.' }`, or `404 { error: 'Geste inconnu : <id>' }`.
  - `GET /api/gestures/:id` answers `200 GestureView` (Task 1), or `404`.

Checks, in this order, against `buildQueue(deps, now)`:
1. The zod parse fails, or a card appears twice: `400 { error: 'Geste illisible.' }`.
2. Each target is looked up among the queue's `QueueCard`s, the cards of its `QueuePile`s, its `urgent` entries, and Lun'Avaritia's `QueueDue`s. A missing target gets `409 'Déjà tranchée ailleurs.'`. A `readOnly` one gets `409 'Carte en lecture seule.'`.
3. `input` on `refuse`, or on a card without `options`, gets `400 'Geste illisible.'`. `accept` of a card with `options` but no `input.answer` gets `400 'Une question attend une réponse.'`.
4. When there are two or more items: if their cards are exactly the cards of one pile, the gesture passes. Otherwise every item must be `accept`, `batchable`, and from one satellite. If not, the answer is `400 { error: 'Ce lot contient une carte qui ne se valide pas en lot.' }`.
5. `holdGesture(items, now, from)`, then `deps.gestures.arm(id, dueAt)`, then `202`. Titles come from the queue (`card.title`, `urgent.title`, `due.fiche`). A due's `text` defaults to `due.text`. A card item keeps `card` (the queue's `Card`, `sends` included).

`DELETE` calls `cancelGesture`, then `disarm` when the result is `cancelled`.

- [ ] **Step 1: Write the failing tests**

```ts
// harness; lunacedia v1.4 with cards w1, w2 (write), send (sends: true), del (effect delete), p1/p2 (pile); lunavaritia with ask (options ['Garder', 'Fusionner']) and a due 7; one urgent event
it('holds a unit gesture: 202, out of the queue and the count at once', async () => {
  const before = (await get('/api/state')).body.queue.total;
  const res = await post('/api/gestures', { items: [{ satellite: 'lunacedia', card: 'w1', gesture: 'accept' }], from: 'bureau' });
  expect(res.status).toBe(202);
  expect(res.body).toEqual({ id: expect.any(Number), dueAt: '2026-11-02T08:00:05.000Z' });
  expect((await get('/api/state')).body.queue.total).toBe(before - 1);
  expect(ids((await get('/api/queue')).body)).not.toContain('w1');
});
it('DELETE within 5 s brings the card back; after 5 s it is too late', async () => {
  const { id } = (await post('/api/gestures', unit('w1'))).body;
  h.advance(4_999); expect((await del(`/api/gestures/${id}`)).status).toBe(204);
  expect(ids((await get('/api/queue')).body)).toContain('w1');
  const second = (await post('/api/gestures', unit('w1'))).body.id;
  h.advance(5_000);
  expect(await del(`/api/gestures/${second}`)).toMatchObject({ status: 409, body: { error: 'Trop tard pour annuler.' } });
  await h.gestures.relayDue();
  expect(fake.callsTo('POST /lun/v1/cards/w1/accept')).toBe(1);
});
it('the same card twice: the second gets 409', async () => {
  await post('/api/gestures', unit('w1'));
  expect(await post('/api/gestures', unit('w1'))).toMatchObject({ status: 409, body: { error: 'Déjà tranchée ailleurs.' } });
});
it('a batch of batchable cards of one post is one gesture', async () => {
  const res = await post('/api/gestures', { items: ['w1', 'w2'].map((c) => ({ satellite: 'lunacedia', card: c, gesture: 'accept' })) });
  expect(res.status).toBe(202);
  expect((await get(`/api/gestures/${res.body.id}`)).body.items).toHaveLength(2);
});
it.each([
  ['a card that writes outside', ['w1', 'send']],
  ['a delete card', ['w1', 'del']],
  ['a pile card', ['w1', 'p1']],
])('a batch with %s gets 400', async (_name, cards) => {
  expect((await post('/api/gestures', batch(cards))).status).toBe(400);
});
it('a batch across two posts, or with a refuse, gets 400', async () => { /* w1 + ask; w1 accept + w2 refuse */ });
it('the two cards of a pile may be decided together, one each way', async () => {
  expect((await post('/api/gestures', { items: [acc('p1'), ref('p2')] })).status).toBe(202);
});
it('a question needs an answer, and only a question takes one', async () => {
  expect((await post('/api/gestures', { items: [{ satellite: 'lunavaritia', card: 'ask', gesture: 'accept' }] })).status).toBe(400);
  expect((await post('/api/gestures', { items: [{ satellite: 'lunavaritia', card: 'ask', gesture: 'accept', input: { answer: 'Autre chose' } }] })).status).toBe(202);
  expect((await post('/api/gestures', { items: [{ ...acc('w1'), input: { answer: 'x' } }] })).status).toBe(400);
});
it('a read-only card gets 409', async () => { /* lunacedia v1.3 → 409 'Carte en lecture seule.' */ });
it('Vu and C\'est fait are held like the cards', async () => {
  expect((await post('/api/gestures', { event: urgentId, gesture: 'seen' })).status).toBe(202);
  expect((await get('/api/queue')).body.urgent).toEqual([]);
  expect((await post('/api/gestures', { due: 7, gesture: 'done' })).status).toBe(202);
});
it('GET gives held, then relayed with each outcome', async () => { /* held → advance → relayDue → relayed, items[0].outcome 'ok' */ });
it('a world id is not an API id', async () => {
  expect((await post('/api/gestures', { items: [{ satellite: 'acedia', card: 'w1', gesture: 'accept' }] })).status).toBe(409);
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run --project core core/src/gestures/routes.test.ts`
Expected: FAIL (404 on `/api/gestures`)

- [ ] **Step 3: Implement** `gestureRoutes`, mount it, and add the README lines: `POST /api/gestures` (« tenu 5 s, puis relayé au poste »), `DELETE /api/gestures/:id`, `GET /api/gestures/:id`.

- [ ] **Step 4: Full core gate**

Run: `npx vitest run --project core && npm run lint && npm run typecheck`
Expected: all green

- [ ] **Step 5: Commit**

```bash
git add core/src/gestures/routes.ts core/src/gestures/routes.test.ts core/src/app.ts README.md
git commit -m "feat(core): POST, DELETE and GET /api/gestures, with the batch rule" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: The kit's toast: one at a time, 5 s, Ctrl Z, time left

**Files (lun-docs, branch `feat/kit-natsume-centre` from `main`):**
- Modify: `lun-docs/design/kit/toasts.svelte.ts`
- Modify: `lun-docs/design/kit/Toaster.svelte`
- Modify: `lun-docs/design/kit/overlays.test.ts` (`describe('toast')`)

**Files (lun-anima):** `ui/src/lib/ui/*`, regenerated by the sync, never edited by hand.

**Interfaces:**
- Produces (kit, consumed by Task 5, slice 6 and the satellites at their next copy):

```ts
export const UNDO_DURATION = 5000;  // an undoable toast
export const INFO_DURATION = 3000;  // information
export const DANGER_DURATION = 5000;
export interface Toast { readonly id: number; message: string; tone: 'ok' | 'danger' | undefined; undo: (() => Promise<void>) | undefined; undoing: boolean; /** epoch ms when it leaves */ endsAt: number }
export function toast(message: string, options?: ToastOptions): void; // same signature as today
export function toasts(): readonly Toast[];   // at most one
export function lastUndoable(): Toast | undefined;
export function undo(id: number): Promise<void>; export function undoLast(): void; export function dismiss(id: number): void; export function dismissAll(): void;
```

`TOAST_DURATION` and `MAX_SHOWN` go away. `toast` with `undo` replaces the toast on screen, and the previous `undo` is dropped (that gesture becomes final). `toast` without `undo`, while an undoable toast is counting and not `undoing`, is kept as the next toast (the latest wins) and shown when the current one leaves. Otherwise it replaces the current one. The Toaster binds `Ctrl+z` (not from a field: `bindShortcuts` already guarantees it) and shows `<Kbd>Ctrl Z</Kbd>`. It shows the seconds left, `Math.ceil((endsAt - now) / 1000)` followed by « s », refreshed every second by an `$effect` interval that runs only while an undoable toast is shown. The Toaster takes `contained?: boolean`: when true, it is `position: absolute` and centred in its parent; otherwise it keeps today's fixed placement. Failure of an undo is unchanged: the error message, the danger tone, no Annuler.

- [ ] **Step 0: Branch**

Run: `cd ../lun-docs && git switch main && git pull && git switch -c feat/kit-natsume-centre`
Expected: `Switched to a new branch 'feat/kit-natsume-centre'`

- [ ] **Step 1: Write the failing tests** (in `lun-docs/design/kit/overlays.test.ts`, replacing the four current `toast` tests)

```ts
it('Ctrl Z runs the undo of the toast, which then goes away', async () => {
  render(Toaster); const undo = vi.fn(() => Promise.resolve());
  toast('Validée : Paul Mercier.', { undo }); await tick();
  expect(screen.getByText('Ctrl Z')).toBeInTheDocument();
  await user().keyboard('{Control>}z{/Control}'); await vi.advanceTimersByTimeAsync(0);
  expect(undo).toHaveBeenCalledOnce();
  expect(screen.queryByText('Validée : Paul Mercier.')).toBeNull();
});
it('Z alone does nothing', async () => { /* keyboard('z') → undo not called */ });
it('Ctrl Z does nothing from a field', async () => { /* render an <input> next to the Toaster, focus it, Ctrl Z → undo not called */ });
it('an undoable toast shows the seconds left, and leaves after 5 s', async () => {
  render(Toaster); toast('Refusée : Adresse de Marion.', { undo: vi.fn(() => Promise.resolve()) }); await tick();
  expect(screen.getByText('5 s')).toBeInTheDocument();
  await vi.advanceTimersByTimeAsync(1000); expect(screen.getByText('4 s')).toBeInTheDocument();
  await vi.advanceTimersByTimeAsync(3999); expect(screen.getByText('Refusée : Adresse de Marion.')).toBeInTheDocument();
  await vi.advanceTimersByTimeAsync(1); expect(screen.queryByText('Refusée : Adresse de Marion.')).toBeNull();
});
it('an information toast stays 3 s, without Annuler', async () => { /* 2999 present, 3000 gone, no 'Annuler' button */ });
it('one toast at a time: a new gesture replaces the toast and the first can no longer be undone', async () => {
  render(Toaster); const first = vi.fn(() => Promise.resolve()), second = vi.fn(() => Promise.resolve());
  toast('Validée : A.', { undo: first }); toast('Validée : B.', { undo: second }); await tick();
  expect(screen.queryByText('Validée : A.')).toBeNull();
  await user().keyboard('{Control>}z{/Control}'); await vi.advanceTimersByTimeAsync(0);
  expect(first).not.toHaveBeenCalled(); expect(second).toHaveBeenCalledOnce();
});
it('an information toast waits for the undoable one to end', async () => {
  render(Toaster); toast('Validée : A.', { undo: vi.fn(() => Promise.resolve()) }); toast('Déjà tranchée ailleurs.'); await tick();
  expect(screen.getByText('Validée : A.')).toBeInTheDocument();
  await vi.advanceTimersByTimeAsync(5000);
  expect(screen.getByText('Déjà tranchée ailleurs.')).toBeInTheDocument();
});
it('an undo that fails replaces the toast by its message, in the danger tone', async () => { /* kept from today, message 'Trop tard pour annuler.' */ });
```

- [ ] **Step 2: Copy into lun-anima and run to verify they fail**

Run: `cd ../lun-anima && node ../lun-docs/tools/sync-kit.mjs ui/src/lib/ui && npx vitest run --project ui ui/src/lib/ui/overlays.test.ts`
Expected: FAIL (`Ctrl Z` not found)

- [ ] **Step 3: Implement** `toasts.svelte.ts` and `Toaster.svelte` in `lun-docs/design/kit` as specified (tokens only, Lucide icons through `Icon.ts`, Svelte 5 runes).

- [ ] **Step 4: Copy again and run to verify they pass**

Run: `node ../lun-docs/tools/sync-kit.mjs ui/src/lib/ui && npx vitest run --project ui && node ../lun-docs/tools/sync-kit.mjs --check ui/src/lib/ui && npm run typecheck`
Expected: PASS, `kit: OK`

- [ ] **Step 5: Commit, in both repos**

```bash
cd ../lun-docs && git add design/kit/toasts.svelte.ts design/kit/Toaster.svelte design/kit/overlays.test.ts
git commit -m "feat(kit): one toast at a time, 5 s undo with Ctrl Z and time left" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
cd ../lun-anima && git add ui/src/lib/ui
git commit -m "chore(ui): copy the kit's new toast" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Holding a gesture from the app

**Files:**
- Create: `ui/src/gestures/held.ts`
- Test: `ui/src/gestures/held.test.ts`

**Interfaces:**
- Consumes: Task 3 routes; Task 4 `toast`; `Api.send`, `ApiError` (`ui/src/api.ts`).
- Produces (consumed by slice 6's file, pile and batch):

```ts
export type HeldBody =
  | { items: { satellite: string; card: string; gesture: 'accept' | 'refuse'; input?: { answer: string } }[]; from?: 'bureau' | 'trancher' }
  | { event: number; gesture: 'seen'; from?: 'bureau' | 'trancher' }
  | { due: number; gesture: 'done' | 'later'; text?: string; from?: 'bureau' | 'trancher' };
export type ToastFacts =
  | { gesture: 'accept'; title: string; sends?: boolean; answer?: string }
  | { gesture: 'refuse' | 'seen' | 'done' | 'later'; title: string }
  | { batch: { count: number; kinds: (string | undefined)[] } }
  | { pile: { kind: string | undefined; accepted: number; refused: number } };
export function heldToastText(facts: ToastFacts): string;
export interface Held { id: number; dueAt: string }
export function holdGesture(api: Api, body: HeldBody, facts: ToastFacts): Promise<Held>; // POST, then toast with undo = DELETE
export interface HeldOutcome { state: 'relayed' | 'cancelled'; failed: { satellite: string; target: string; reason: string }[]; conflict: number; summary?: string }
export function settleGesture(api: Api, held: Held, now?: () => number): Promise<HeldOutcome>;
```

Texts from `heldToastText`:
- « Validée : T. », or « Brouillon créé : T. » when `sends`, or « Réponse donnée : A. » when `answer`.
- « Refusée : T. », « Urgence vue : T. », « C'est fait : T. », « Plus tard : T. ».
- Batch: « 5 fiches validées. » (noun rule in Global Constraints), « 3 cartes validées. ».
- Pile: « Les deux fiches validées. », « Les deux fiches refusées. », « Une fiche validée, l'autre refusée. ».

A title that already ends with « . », « ? » or « ! » takes no extra full stop.

`holdGesture` lets a `POST` error throw: the caller shows it on the card (slice 6). `settleGesture` waits until `dueAt` plus 500 ms by the device clock, then reads `GET /gestures/:id`. While the state is `held` or `relaying`, it reads again every second, at most 20 times. It toasts « Déjà tranchée ailleurs. » once when `conflict > 0`, and returns the failures for the caller to show on their cards (« … n'a pas répondu, rien n'a été fait. », or the satellite's `400` reason). A cancelled gesture resolves `{ state: 'cancelled', failed: [], conflict: 0 }`.

- [ ] **Step 1: Write the failing tests**

```ts
it.each([
  [{ gesture: 'accept', title: 'Paul Mercier' }, 'Validée : Paul Mercier.'],
  [{ gesture: 'accept', title: 'Réponse à Paul', sends: true }, 'Brouillon créé : Réponse à Paul.'],
  [{ gesture: 'accept', title: 'Doublon', answer: 'Chez Lulu' }, 'Réponse donnée : Chez Lulu.'],
  [{ gesture: 'refuse', title: 'Adresse de Marion' }, 'Refusée : Adresse de Marion.'],
  [{ gesture: 'seen', title: 'la banque demande un justificatif' }, 'Urgence vue : la banque demande un justificatif.'],
  [{ batch: { count: 5, kinds: Array(5).fill('Nouvelle fiche') } }, '5 fiches validées.'],
  [{ batch: { count: 2, kinds: ['Nouvelle fiche', 'Brouillon'] } }, '2 cartes validées.'],
  [{ pile: { kind: 'Nouvelle fiche', accepted: 2, refused: 0 } }, 'Les deux fiches validées.'],
  [{ pile: { kind: 'Nouvelle fiche', accepted: 1, refused: 1 } }, 'Une fiche validée, l’autre refusée.'],
])('%o reads « %s »', (facts, text) => expect(heldToastText(facts as ToastFacts)).toBe(text));
it('never writes « envoyée »', () => { /* every case above: not.toMatch(/envoy/) */ });
it('holds, toasts with the undo bound to DELETE', async () => {
  // fake api: POST /gestures → { id: 3, dueAt }; render(Toaster); Ctrl Z → api.send called with ('DELETE', '/gestures/3')
});
it('settles: failures come back for their cards, a conflict is toasted once', async () => {
  // GET → held, then relayed with items [{ outcome: 'failed', reason: "Lun'Acedia n'a pas répondu, rien n'a été fait." }, { outcome: 'conflict' }]
  expect(out).toEqual({ state: 'relayed', failed: [expect.objectContaining({ reason: "Lun'Acedia n'a pas répondu, rien n'a été fait." })], conflict: 1 });
  expect(toasts().map((t) => t.message)).toContain('Déjà tranchée ailleurs.');
});
```

Use the apostrophe character the codebase already uses in its French copy (`’` in `decide.ts`), and keep it the same in `heldToastText` and the test.

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run --project ui ui/src/gestures/held.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement `ui/src/gestures/held.ts`** as specified.

- [ ] **Step 4: Full gate**

Run: `npm test && npm run lint && npm run typecheck && npm run format:check`
Expected: all green

- [ ] **Step 5: Commit**

```bash
git add ui/src/gestures/held.ts ui/src/gestures/held.test.ts
git commit -m "feat(ui): hold a gesture, toast it with undo, read its outcome" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Self-review notes

- Spec coverage (slice 4 of §15):
  - `held_gestures` (Task 1); `POST`/`DELETE`/`GET` and their codes (Task 3).
  - 5 s hold for every queue gesture, including Vu, C'est fait and Plus tard (Tasks 1 to 3); removal from the queue at once, so the counters follow (Task 1).
  - Delayed relay, relay at start, `{ answer }` (Task 2); a batch is one gesture and is cancelled whole (Tasks 1 and 3); batch rule with `400` (Task 3); unchecked cards are simply not sent (Task 3 accepts any subset of `batchable` cards).
  - Journal at the relay, nothing for a cancelled gesture (Task 2).
  - One toast, 5 s with the time left, Ctrl Z outside fields, 3 s information (Task 4); undo bound to `DELETE`, failure and conflict surfaced (Task 5).
- Left out on purpose: the file, pile and batch screens, the focus after a gesture, the gestures disabled when Natsume is unreachable, and the toast's place on the page (slice 6, which mounts `Toaster contained`); caps and pause (slice 5: gestures keep working under both, so no gate is added here).
- §14 « sans annulation, le geste y arrive après 5 s, même si l'onglet est fermé » holds because the relay lives in the core (Task 2), and no browser holds anything.
