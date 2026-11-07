# Natsume au centre, slice 5: caps and pause — Implementation Plan

> **Livré** par [lun-anima#24](https://github.com/Lun-Ecosystem/lun-anima/pull/24). Cases cochées le 07/11/2026 d'après cette livraison, sans recontrôle tâche par tâche.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** The core has one daily cap over every source and a monthly cap, per-post settings, a global pause (manual or at a cap) that it holds, journals and relays to every post through contract v1.4, and a morning letter written once a day and only corrected, served with every place's word by `GET /api/word`.

**Architecture:** Caps and per-post settings extend `settings/live.ts`. A pure `spendView` adds the core's own costs to each post's cached `/costs` (slice 2's read loop). A `PauseKeeper` (new `core/src/pause/`) derives the wanted pause (manual, or a cap reached with « Mettre en pause »), stores it in `settings`, journals each edge and hands it to a `PauseRelay`, which calls `pause`/`resume` with `by: 'core'` on each post and again on each SSE reconnection. The routine engine skips its slots under a pause and no longer makes the morning wait for the night. The morning writes `letters`/`letter_notes` from the cached queue instead of posting in the main thread. `/api/state` gains the pause, the caps and the two band slots slice 2 left.

**Tech Stack:** Node `^22.13.0 || >=24`, TypeScript run by `--experimental-strip-types`, Hono 4, `node:sqlite`, zod 4, vitest 5 (root `vitest.config.ts`, project `core`).

**Spec:** `lun-docs/docs/specs/2026-11-02-natsume-au-centre-design.md` (§3, §4.3, §4.4, §6.1 « Le mot du Bureau », §6.2 « Le mot de la Constellation », §6.3 « Le mot du Journal », §6.4 « Dépenses et plafonds », « Routines », « Le mot de l'Atelier », §6.5, §7 rows Pause and Plafond atteint, §9.1, §9.4, §9.5, §9.7 « Plafonds » and « Par poste », §14 « Bureau » (letter), « Atelier », « Pause », §15 slice 5).

**Repo / branch:** `D:/projets/projets perso/LunEcosystem/lun-anima`, new branch `feat/core-caps-pause` cut from `feat/core-held-gestures`.

## Global Constraints

- Node `^22.13.0 || >=24`; no new dependency.
- Migrations are appended to `MIGRATIONS` in `core/src/db.ts`, never edited.
- « Les routes de l'API ne parlent que d'identifiants de satellite (`lunacedia`) » : per-post settings and every body use satellite ids.
- « La pause est globale : elle arrête tout l'automatique de l'écosystème et la remontée des erreurs ; les urgences remontent toujours ; les demandes spontanées restent possibles. »
- « Ce qui continue : la boucle de lecture du §9.2 et l'écoute des flux SSE (observer n'est pas agir) ; les urgences des postes, qui entrent dans la file ; la conversation et les délégations qu'elle demande ; les gestes ; « Lancer maintenant » ; « Réessayer ». » Slice 2 forbids adding any pause input to `ReadLoop`.
- « à la pause, le core appelle `POST /lun/v1/pause` avec `by: 'core'` sur chaque poste relié, puis `resume` avec `by: 'core'` à la reprise. […] Un `409` vaut accusé. » Slice 1: a 409 only answers a repeat from the same origin.
- « Relever le plafond au-dessus de la dépense lève la pause tout de suite. » « Avec « Prévenir seulement », la bande seule. »
- Plafond pauses: `plafond-jour` until the next 05:00, `plafond-mois` « jusqu'au 1er du mois suivant » (05:00 of that day, Natsume's day cut); « la conversation s'arrête aussi (elle coûte), les gestes continuent ».
- « Le budget interne de la veille par jour résumé reste dans `.env` » : `NIGHT_DAILY_CAP_USD` stays, read from the environment only.
- Letter: « Écrite une fois par la routine de 07:30 ; une seconde écriture du même jour est refusée par la base. » « composé sans appel au modèle ». « Le point du matin n'est plus posté dans le fil principal. »
- « La phrase du jour n'est plus exposée par `/home` ni affichée ; sa génération reste en place. »
- Texts computed by the core follow §3: « 14:20 » hours, no « · », no « → », no em dash, no « core », figures never in words.
- Journal writes go through slice 3's `appendJournal` only (see Interfaces below); this slice creates no journal table.
- Stored display strings are French; code, comments and commits in English.
- Test command: `npx vitest run --project core <file>` from the repo root; full gate `npm test && npm run lint && npm run typecheck && npm run format:check`.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Never a provider admin key: spend comes only from the core's own `costs` table and the posts' `/costs`.

## Interfaces consumed from other slices

- **Slice 2** (`2026-11-02-natsume-centre-tranche-2-boucle-lecture.md`), exactly as its Interfaces blocks say: `ReadLoop` (`start`, `stop`, `signal(id, s)`, `readNow(id)`, `everRead(id)`), `Signal` (`{ kind: 'open' }` on each stream (re)connection), `ManagerDeps.onSignal`, `cached<T>(db, key)`, `saveCache`, `cardRead`, `buildQueue(deps, now): Queue`, `buildUpcoming(deps, now): Upcoming`, `upcomingEnd(now)`, `postStates`, `buildState(deps, now): CoreState`, `BAND_ORDER`, `BandKind`, `NatsumeKind`, `daySpend` (replaced here, Task 2), `WORLDS`, cache key `costs:<id>` (`{ since, total }`).
- **Slice 1:** `Health.contract` says the contract version (v1.4 detection reads it, not `Health.version`; slice 2's `speaksV14` must follow); each satellite keeps two flags (`paused` local, `pausedByCore`); `POST /lun/v1/pause { reason?, by?: 'core' }` and `POST /lun/v1/resume { by?: 'core' }`; a 409 answers a repeat of the same origin.
- **Slice 3** (`2026-11-02-natsume-centre-tranche-3-journal.md`, Task 1 `core/src/journal/store.ts` and Task 5 `core/src/journal/query.ts`), exactly:

```ts
export const JOURNAL_TYPES = ['urgence', 'carte', 'confie', 'routine', 'pause', 'reglage', 'liaison', 'evenement'] as const;
export type JournalType = (typeof JOURNAL_TYPES)[number];
export type JournalOutcome = 'a-trancher' | 'tranchee' | 'vue' | 'fait' | 'echoue' | 'sautee';
export interface JournalInput {
  at: string; type: JournalType; /** NATSUME_POST ('lunanima') when absent. */ post?: string; title: string; meta?: string; outcome?: JournalOutcome;
  cost?: number; durationMs?: number; refs?: Ref[]; cardId?: string; eventId?: number; threadId?: string; messageId?: number; step?: string;
}
export function appendJournal(db: DatabaseSync, entry: JournalInput): number; // the entry's id
// query.ts
export interface JournalRow { id: number; at: string; type: JournalType; post: string; title: string; meta?: string; outcome?: JournalOutcome; cost?: number; durationMs?: number }
```

This slice also reads table `journal` columns `id, at, type, post, title, meta, outcome` (Task 9). Routine runs are journaled by slice 3 in `endRun` (`journalRun`, slice 3 Task 3).

**Rulings made where the spec is wrong or silent (binding for this plan):**

- Cap settings: `day.capUsd` (0 to 100), `month.capUsd` (0 to 1000), `caps.atCap: 'pause' | 'warn'` (default `'pause'`), `caps.warnAt80: boolean` (default `false`, stored only: notifications do not exist), `caps.kept: boolean` (mise en route line). `day.capUsd` is seeded once, at the first start of this version, with `chat.capUsd + routines.capUsd` (stored values, else their `.env` defaults); `month.capUsd` default `MONTHLY_CAP_USD` or 40. The old keys stay in the table, unread.
- Per-post settings, keys `post:<satelliteId>:<name>`: `night` (boolean, default true: the night gives the day to this post or reads its digest), `digest` (boolean, default true: the night reads its digest; for Lun'Acedia the digest is read only when `night && digest`), `capUsd` (number 0 to 100 or `null`, default `null`), `replyTimeoutS` (integer 10 to 600, default 120), `liveUrgent` (boolean, default true: false keeps its urgent events out of the Urgent head of the queue; they still reach the Journal).
- When both caps are reached, the month wins (later `until`). A manual pause wins over a cap pause; resuming while a cap is still reached leaves a cap pause.
- `POST /api/pause` while paused and `POST /api/resume` while not paused answer 200 with the current state (idempotent), never 409.
- The relay goes to every paired post, whatever its contract version: a v1.3 post takes it as a full stop, which over-stops rather than spends. The core sends `pause` on every `open` signal while paused; it sends `resume` on `open` only to a post that has not acknowledged the last resume (kept in setting `pause.unacked`).
- « Erreurs écrites au Journal, pas levées » : during any pause, `poste-injoignable` and `poste-muet` bands are dropped (§4.3); the `cle-refusee` band stays, since §4.3 ranks it above the pause and a refused key blocks the conversation the pause keeps open. Routine runs reach the Journal where they end (`endRun`, slice 3 Task 3).
- Skipped routines are stored as `routine_runs.status = 'skipped'`, `reason = 'en pause'`, journaled `routine` / `sautee`. This needs a rebuild of `routine_runs` (its CHECK constraint).
- The letter's figures come from `buildQueue` (one source for counters, §8 anti-objective); `rankPoint` still ranks the point, stored in the letter's `items` and given to the warm context. `gatherPoint` reads slice 2's cache instead of the posts.
- A morning past noon still writes the letter (dated by its time); `POST_BEFORE_HOUR` goes.
- A correction that changes nothing is not written (rule 10), except the night's end after the letter, which always says when it finished.
- No letter today: the Bureau word says « Pas de lettre ce matin : la routine a échoué à 07:30. » after a failure, and « Pas de lettre ce matin : Natsume était en pause à 07:30. » after a skip.
- `natsume.kind` order: `attente-cle`, `cle-refusee`, `pause`, `reflechit`, `disponible`.
- `/home.spend` becomes the day part of `spendView`; the current UI's Dépenses screen (`ui/src/screens/ecosysteme/Depenses.svelte`, `chatCapUsd`) stays broken until slice 6 rewrites it.
- Mise en route: `route.caps` = `caps.kept`, set by any PATCH that carries a cap field or `capsKept: true`; `done = key && caps && firstPost`.

## Review Focus

1. A post that never answers `/costs` must not make the day spend zero forever nor block the cap: its last cached value of today counts, an older one counts 0 — pinned in Task 2.
2. Lowering the cap under the spend, then raising it back, must give exactly two relays (pause, resume) and two journal entries, not one per minute — pinned in Task 3.
3. A post down when the pause is sent must receive it at its next stream `open`, and a post down at the resume must not stay paused by the core — pinned in Task 4.
4. A core restart between 05:00 and 07:30 with the night still running must still write the letter at 07:30 and correct it when the night ends — pinned in Tasks 5 and 7.
5. Two « Lancer maintenant » on the morning the same day must leave one letter and at most one correction per real change — pinned in Task 7.

---

### Task 1: Caps and per-post settings

**Files:**
- Modify: `core/src/settings/live.ts`, `core/src/settings/routes.ts`, `core/src/main.ts` (defaults, seed), `core/src/testing/harness.ts` (defaults)
- Test: `core/src/settings/routes.test.ts`

**Interfaces:**
- Consumes: `appendJournal` (slice 3), `listSatellites`.
- Produces (`settings/live.ts`):

```ts
export interface PostSettings { night: boolean; digest: boolean; capUsd: number | null; replyTimeoutS: number; liveUrgent: boolean }
export const POST_DEFAULTS: PostSettings; // { night: true, digest: true, capUsd: null, replyTimeoutS: 120, liveUrgent: true }
export interface LiveSettings { dayCapUsd: number; monthCapUsd: number; atCap: 'pause' | 'warn'; warnAt80: boolean; capsKept: boolean; model: string; maxTokens: number }
export function readSettings(db, defaults: LiveSettings): LiveSettings;
export function postSettings(db, satelliteId: string): PostSettings;
export function seedCaps(db, old: { chatCapUsd: number; routinesCapUsd: number }): void; // writes day.capUsd = stored-or-old chat + routines, once
```

`SETTING_KEYS`: `dayCapUsd: 'day.capUsd'`, `monthCapUsd: 'month.capUsd'`, `atCap: 'caps.atCap'`, `warnAt80: 'caps.warnAt80'`, `capsKept: 'caps.kept'`, `model`, `maxTokens` unchanged. `chatCapUsd`/`routinesCapUsd` leave `LiveSettings`.
- `PATCH /api/settings` body: `{ dayCapUsd?, monthCapUsd?, atCap?, warnAt80?, capsKept?: true, model?, maxTokens?, posts?: Record<satelliteId, Partial<PostSettings>> }`; a post id not in `satellites` → 400 `Poste inconnu : <id>`; any cap field also sets `caps.kept`. Each changed field → one `appendJournal(db, { at, type: 'reglage', title, post? })` (`at` = the clock's now), titles « Plafond par jour, 3,00 $ », « Plafond par mois, 40,00 $ », « Quand un plafond est atteint : Mettre en pause » / « Prévenir seulement », « Délai de réponse de Lun'Acedia, 8 s », « Plafond de Lun'Acedia, 1,00 $ » / « sans plafond », « Veille de la nuit de Lun'Acedia, activée » / « éteinte », same form for « Bilan du jour » and « Alertes urgentes en direct », « Modèle, gpt-6-luna », « Longueur des réponses, 800 ». Then `deps.pause?.apply()` (Task 3 adds the dep). `GET /api/settings` adds `posts: Record<id, PostSettings & { pairedAt: string }>` for every paired post (`pairedAt` = `satellites.paired_at`, read-only: a PATCH carrying it gets 400, for « Relié depuis le 27 octobre »).

- [x] **Step 0: Branch** — `git switch feat/core-held-gestures && git pull && git switch -c feat/core-caps-pause`. Expected: `Switched to a new branch 'feat/core-caps-pause'`.

- [x] **Step 1: Write the failing tests** (in `routes.test.ts`, replace the chat/routines cap cases):

```ts
it('seeds the day cap once with the two old caps', () => {
  putSetting(db, 'chat.capUsd', 1); putSetting(db, 'routines.capUsd', 0.5);
  seedCaps(db, { chatCapUsd: 9, routinesCapUsd: 9 });
  seedCaps(db, { chatCapUsd: 9, routinesCapUsd: 9 });
  expect(getSetting(db, 'day.capUsd', 0)).toBe(1.5);
});
it('changes the caps and journals each change', async () => {
  const res = await patch({ dayCapUsd: 3, monthCapUsd: 40, atCap: 'warn' });
  expect(res.body).toMatchObject({ dayCapUsd: 3, monthCapUsd: 40, atCap: 'warn', capsKept: true });
  expect(journalTitles('reglage')).toEqual(['Plafond par jour, 3,00 $', 'Plafond par mois, 40,00 $', 'Quand un plafond est atteint : Prévenir seulement']);
});
it('stores per-post settings under post:<id>:…', async () => {
  await patch({ posts: { lunacedia: { replyTimeoutS: 8, capUsd: null, liveUrgent: false } } });
  expect(getSetting(db, 'post:lunacedia:replyTimeoutS', 0)).toBe(8);
  expect((await get('/api/settings')).body.posts.lunacedia).toEqual({ ...POST_DEFAULTS, replyTimeoutS: 8, liveUrgent: false, pairedAt: expect.any(String) });
});
it('refuses a world id, an unknown post and an out-of-range value', async () => {
  expect((await patch({ posts: { acedia: { night: false } } })).status).toBe(400);
  expect((await patch({ posts: { lunacedia: { replyTimeoutS: 5 } } })).status).toBe(400);
  expect((await patch({ monthCapUsd: 1001 })).status).toBe(400);
  expect((await patch({ chatCapUsd: 1 })).body.error).toBe('Réglage inconnu : chatCapUsd');
});
```

- [x] **Step 2: Run** — `npx vitest run --project core core/src/settings`. Expected: FAIL.
- [x] **Step 3: Implement** as in Interfaces. Validation with the file's zod style (French messages). `main.ts`: `seedCaps(db, { chatCapUsd: numberEnv('CHAT_DAILY_CAP_USD', 1), routinesCapUsd: numberEnv('NIGHT_DAILY_CAP_USD', 0.5) })` before the first `settings()`; `nightDeps.capUsd` = `numberEnv('NIGHT_DAILY_CAP_USD', 0.5)` (a constant, not a setting). Fix every compile error from the removed fields (`ChatService` gets its cap in Task 2; until then pass `dayCapUsd`).
- [x] **Step 4: Run** — `npx vitest run --project core`. Expected: PASS.
- [x] **Step 5: Commit** — `git add core/src && git commit -m "feat(core): one daily cap, a monthly cap and per-post settings" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`

---

### Task 2: One spend over every source

**Files:**
- Create: `core/src/costs/spend.ts`
- Modify: `core/src/chat/day.ts` (`monthStart`, `nextMonthStart`), `core/src/reads/loop.ts` (month costs), `core/src/accueil/routes.ts` (`daySpend` removed, `/home.spend`, no phrase), `core/src/reads/state.ts` (`spend` type), `core/src/chat/service.ts` (cap refusal), `core/src/main.ts`
- Test: `core/src/costs/spend.test.ts`, `core/src/chat/service.test.ts`

**Interfaces:**
- Produces:

```ts
// chat/day.ts
export function monthStart(now: Date): Date;      // dayStart of the 1st of natsumeDay(now)'s month
export function nextMonthStart(now: Date): Date;  // dayStart of the 1st of the next month
// costs/spend.ts
export interface SpendSource { source: 'natsume' | string; total: number; chat?: number; routines?: number; readAt?: string }
export interface SpendView { day: { total: number; cap: number; sources: SpendSource[] }; month: { total: number; cap: number }; week: { day: string; total: number }[]; reached?: 'jour' | 'mois' }
export function spendView(deps: { db: DatabaseSync; settings: () => LiveSettings }, now: Date): SpendView;
```

- Rules: `natsume` = core `costs` rows of today (`chat` + `night` purposes, both shown); each paired post = cached `costs:<id>.total` when its `since` equals today's `dayStart`, else 0 (with `readAt` of that cache). Month = core rows since `monthStart` + each cached `costs-month:<id>.total` whose `since` equals `monthStart`. `reached` = `'mois'` if month ≥ month cap, else `'jour'` if day ≥ day cap. `week` (the Atelier's « sept derniers jours en barres ») = the 7 Natsume days ending today, oldest first: core `costs` rows of that day + each post's `costs-week:<id>[day]` (0 when absent); today's entry equals `day.total`. Amounts rounded to 6 decimals.
- Read loop extras: `client.costs(monthStart(now).toISOString())` → `saveCache('costs-month:<id>', …)`, failing alone like the other extras; after each `costs:<id>` read, `costs-week:<id>` (`Record<day, number>`) gets today's total and keeps only its 7 most recent days.
- `ChatService` deps: `settings` becomes `Pick<LiveSettings, 'model' | 'maxTokens'>`; new `capPause: () => Pause | undefined` (Task 3's `PauseKeeper.wanted`, cap pauses only). Refusal: `plafond-jour` → `Plafond du jour atteint : Natsume répond à nouveau à 05:00.`; `plafond-mois` → `Plafond du mois atteint : Natsume répond à nouveau le 1er décembre.` (month name of `until`, « 1er »). Until Task 3 lands, the harness passes `capPause: () => undefined`.

- [x] **Step 1: Write the failing tests**

```ts
it('adds the core and each post, a post\'s old read counting zero', () => {
  recordCost(db, { at: T, provider: 'openai', model: 'gpt-6-luna', amount: 0.3, purpose: 'chat' });
  recordCost(db, { at: T, provider: 'openai', model: 'gpt-6-luna', amount: 0.1, purpose: 'night' });
  saveCache(db, 'costs:lunacedia', T, { since: dayStart(natsumeDay(T)).toISOString(), total: 0.05 });
  saveCache(db, 'costs:lunavaritia', T, { since: '2026-11-01T04:00:00.000Z', total: 9 });
  const s = spendView(deps, T);
  expect(s.day.total).toBe(0.45);
  expect(s.day.sources[0]).toEqual({ source: 'natsume', total: 0.4, chat: 0.3, routines: 0.1 });
});
it('the month counts from the 1st at 05:00', () => {
  expect(monthStart(new Date('2026-11-01T03:00:00Z')).toISOString()).toBe('2026-10-01T03:00:00.000Z'); // 04:00 Paris on Nov 1 is still Oct 31
  expect(nextMonthStart(new Date('2026-11-02T08:00:00Z')).toISOString()).toBe('2026-12-01T04:00:00.000Z');
});
it('gives the last seven days, today last', () => {
  // core cost 0.2 on 2026-10-30; costs-week:lunacedia { '2026-10-30': 0.1, '2026-11-02': 0.05 }
  expect(spendView(deps, T).week.map((w) => w.day)).toEqual(['2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02']);
  expect(spendView(deps, T).week[3]).toEqual({ day: '2026-10-30', total: 0.3 });
  expect(spendView(deps, T).week[6]!.total).toBe(spendView(deps, T).day.total);
});
it('says which cap is reached, the month first', () => { /* day 3.10/3, month 40.5/40 */ expect(s.reached).toBe('mois'); });
it('the chat stops at a cap pause, with the time it comes back', async () => {
  // ChatService with capPause: () => ({ by: 'plafond-jour', since: T, until: '2026-11-03T04:00:00.000Z' })
  expect(message.error).toBe('Plafond du jour atteint : Natsume répond à nouveau à 05:00.');
});
it('/home has no phrase and the day spend', async () => { expect(body).not.toHaveProperty('phrase'); expect(body.spend).toMatchObject({ total: expect.any(Number), cap: expect.any(Number) }); });
```

- [x] **Step 2: Run** — `npx vitest run --project core core/src/costs core/src/chat core/src/accueil`. Expected: FAIL.
- [x] **Step 3: Implement** as in Interfaces; `CoreState.spend` becomes `SpendView`; delete `daySpend` and update its callers.
- [x] **Step 4: Run** — `npx vitest run --project core`. Expected: PASS.
- [x] **Step 5: Commit** — `feat(core): one spend over the core and every post`.

---

### Task 3: The pause, held by the core

**Files:**
- Create: `core/src/pause/pause.ts`, `core/src/pause/routes.ts`
- Modify: `core/src/app.ts` (`AppDeps.pause: PauseKeeper`, mount routes), `core/src/settings/routes.ts` (`apply()` after a PATCH), `core/src/main.ts`, `core/src/testing/harness.ts`
- Test: `core/src/pause/pause.test.ts`

**Interfaces:**
- Consumes: `spendView` (Task 2), `appendJournal`, `PauseRelay` (Task 4; in this task the keeper takes `relay?: { send(paused: boolean): Promise<void> }`).
- Produces (`pause/pause.ts`):

```ts
export type PauseBy = 'manuel' | 'plafond-jour' | 'plafond-mois';
export interface Pause { since: string; by: PauseBy; until?: string }
export function currentPause(db: DatabaseSync): Pause | undefined; // setting 'pause.state'
export class PauseKeeper {
  constructor(deps: { db: DatabaseSync; clock: () => Date; settings: () => LiveSettings; relay?: { send(paused: boolean): Promise<void> }; log: (line: string) => void });
  wanted(now?: Date): Pause | undefined;      // pure: manual (setting 'pause.manual' = { since }) else a reached cap with atCap 'pause'
  apply(): Pause | undefined;                 // stores 'pause.state' when `by` or presence changed (since = now, or the old since if same by), journals, relays paused↔running edges only
  pause(): Pause;                             // sets 'pause.manual' then apply()
  resume(): Pause | undefined;                // clears 'pause.manual' then apply()
  start(intervalMs?: number): void;           // apply() every 60 s, timer unref
  stop(): void;
}
```

- Journal on each stored change: `appendJournal(db, { at, type: 'pause', title })` (`at` = the change's time) with titles `Mise en pause`, `Pause au plafond du jour`, `Pause au plafond du mois`, `Reprise`. `until`: next `dayStart` for `plafond-jour`, `nextMonthStart` for `plafond-mois`.
- Routes: `POST /api/pause` → `200 { pause }`; `POST /api/resume` → `200 {}` or `200 { pause }` if a cap still holds.
- `ChatService.capPause` = `() => { const p = pause.wanted(); return p?.by === 'manuel' ? undefined : p; }`; a manual pause never stops the chat. Delegations asked by the chat and gestures never read the pause.

- [x] **Step 1: Write the failing tests**

```ts
it('pause and resume are stored, journaled and survive a restart', async () => {
  expect((await post('/api/pause')).body.pause).toMatchObject({ by: 'manuel', since: T.toISOString() });
  expect(new PauseKeeper({ ...keeperDeps, db }).wanted()).toMatchObject({ by: 'manuel' }); // a new keeper on the same db: survives a restart
  await post('/api/resume');
  expect(journalTitles('pause')).toEqual(['Mise en pause', 'Reprise']);
});
it('a cap reached pauses until 05:00, and raising the cap lifts it at once', async () => {
  recordCost(db, { at: T, provider: 'openai', model: 'gpt-6-luna', amount: 3, purpose: 'chat' });
  await patch({ dayCapUsd: 3 });
  expect((await get('/api/state')).body.pause).toEqual({ by: 'plafond-jour', since: T.toISOString(), until: '2026-11-03T04:00:00.000Z' });
  await patch({ dayCapUsd: 5 });
  expect((await get('/api/state')).body).not.toHaveProperty('pause');
  expect(relayed).toEqual([true, false]);
});
it('lowering then raising the cap gives two edges, however often apply runs', () => {
  for (let i = 0; i < 5; i++) keeper.apply();
  expect(journalTitles('pause')).toEqual(['Pause au plafond du jour', 'Reprise']);
});
it('« Prévenir seulement » never pauses', async () => { await patch({ atCap: 'warn', dayCapUsd: 1 }); expect(keeper.apply()).toBeUndefined(); });
it('resume under a reached cap leaves the cap pause', async () => { expect((await post('/api/resume')).body.pause).toMatchObject({ by: 'plafond-jour' }); });
it('a manual pause keeps the chat open; a cap pause closes it', async () => { /* send a message under each */ });
```

- [x] **Step 2: Run** — `npx vitest run --project core core/src/pause`. Expected: FAIL.
- [x] **Step 3: Implement** as in Interfaces; `main.ts` builds the keeper after `settings`, `keeper.start()`, `keeper.stop()` on shutdown. (`/api/state.pause` is wired in Task 8; until then the tests read `currentPause`.)
- [x] **Step 4: Run** — `npx vitest run --project core`. Expected: PASS.
- [x] **Step 5: Commit** — `feat(core): a global pause, manual or at a cap`.

---

### Task 4: The relay to the posts

**Files:**
- Modify: `core/src/satellites/client.ts` (`pause`, `resume`)
- Create: `core/src/pause/relay.ts`
- Modify: `core/src/main.ts`, `core/src/testing/harness.ts` (`onSignal` also calls `relay.onOpen`), `core/src/testing/fake-satellite.ts` (pause/resume routes recording their bodies, 409 on a repeat of the same origin)
- Test: `core/src/pause/relay.test.ts`

**Interfaces:**
- Produces:
  - `SatelliteClient.pause(body: { by: 'core' }): Promise<Response>`, `resume(body: { by: 'core' }): Promise<Response>` — raw answers, 8 s timeout.
  - `class PauseRelay { constructor(deps: { db; satellites: SatelliteManager; log }); send(paused: boolean): Promise<void>; onOpen(satelliteId: string): Promise<void> }` — `send` calls every `satellites.list()` id in parallel; ack = `res.ok || res.status === 409`; non-acked ids are stored in setting `pause.unacked` (string[]), acked ones removed. `onOpen`: `currentPause(db)` set → send `pause`; else id in `pause.unacked` → send `resume`. Errors are logged once and never thrown.
  - Wiring: `onSignal: (id, s) => { reads.signal(id, s); if (s.kind === 'open') void relay.onOpen(id); }`.

- [x] **Step 1: Write the failing tests**

```ts
it('pause and resume reach each paired post with by: core', async () => {
  await post('/api/pause'); await waitFor(() => fake.calls('POST /lun/v1/pause').length === 1);
  expect(fake.calls('POST /lun/v1/pause')[0]!.body).toEqual({ by: 'core' });
  await post('/api/resume'); await waitFor(() => fake.calls('POST /lun/v1/resume').length === 1);
});
it('a 409 counts as acknowledged', async () => { fake.setPausedByCore(true); await post('/api/pause'); await settle(); expect(getSetting(db, 'pause.unacked', [])).toEqual([]); });
it('a post down at the pause gets it at its next stream open', async () => {
  fake.setDown(true); await post('/api/pause'); await settle();
  expect(getSetting(db, 'pause.unacked', [])).toEqual(['lunacedia']);
  fake.setDown(false); await waitFor(() => fake.calls('POST /lun/v1/pause').length >= 1);
});
it('the pause is sent again on each reconnection while paused', async () => { /* cut then reopen twice: two more pause calls */ });
it('a post down at the resume gets it at its next open, and only then', async () => { /* resume while down; reopen → one resume; reopen again → none */ });
it('a post paired during a pause gets it at once', async () => { /* pair a second fake while paused → pause call on its first open */ });
it('the read loop keeps reading during a pause', async () => {
  // ReadLoop with intervalMs: 20 started on h.db / h.satellites
  await post('/api/pause');
  const before = fake.callsTo('GET /lun/v1/cards');
  await waitFor(() => fake.callsTo('GET /lun/v1/cards') >= before + 3);
});
```

- [x] **Step 2: Run** — `npx vitest run --project core core/src/pause/relay.test.ts`. Expected: FAIL.
- [x] **Step 3: Implement** as in Interfaces; the keeper gets `relay` in `main.ts` and the harness.
- [x] **Step 4: Run** — `npx vitest run --project core`. Expected: PASS.
- [x] **Step 5: Commit** — `feat(core): relay the pause to every post, again on each reconnection`.

---

### Task 5: Routines under the pause, and the morning no longer waits

**Files:**
- Modify: `core/src/db.ts` (append migration), `core/src/routines/engine.ts` (`skipRun`, `paused` option, line 84), `core/src/main.ts`
- Test: `core/src/routines/engine.test.ts`

**Interfaces:**
- Produces:
  - Migration: rebuild `routine_runs` with `CHECK (status IN ('running', 'ok', 'failed', 'skipped'))` (create `routine_runs_new`, copy, drop, rename, recreate `routine_runs_by_routine`).
  - `skipRun(db, routine: string, now: Date): void` — inserts a `skipped` run (`started_at = ended_at = now`, `reason = 'en pause'`) and `appendJournal(db, { at: now.toISOString(), type: 'routine', title: <routine label>, outcome: 'sautee', meta: 'en pause' })`; labels `Veille de la nuit`, `Lettre du matin` (`ROUTINE_LABELS` exported, the same titles slice 3's `journalRun` writes).
  - `startRoutines` opts gain `paused?: () => boolean`; a due routine under a pause gets `skipRun` instead of a run (the slot counts as done). `POST /api/routines/*` never reads it (« Lancer maintenant » is a request).
  - Line 84's wait (« the morning waits for a night still under way ») is removed: every due routine starts in the same tick.
  - `main.ts`: `paused: () => keeper.apply() !== undefined`.

- [x] **Step 1: Write the failing tests**

```ts
it('under a pause, a due routine is skipped, noted, and not run', async () => {
  const e = startRoutines({ ..., paused: () => true }); await e.tick();
  expect(ran).toEqual([]);
  expect(runs()).toEqual([expect.objectContaining({ routine: 'morning', status: 'skipped', reason: 'en pause' })]);
  expect(journal('routine')).toEqual([expect.objectContaining({ outcome: 'sautee' })]);
  await e.tick(); expect(runs()).toHaveLength(1); // the slot is done
});
it('the morning starts while the night still runs', async () => {
  // clock 07:31 after a restart, both slots due, night never resolves
  await Promise.race([e.tick(), sleep(20)]);
  expect(started).toEqual(['night', 'morning']);
});
it('a routine failing during a pause is journaled and raises no band', async () => {
  // pause set, POST /api/routines/morning with a failing gather → journal routine/echoue; state has no band
});
```

- [x] **Step 2: Run** — `npx vitest run --project core core/src/routines/engine.test.ts`. Expected: FAIL.
- [x] **Step 3: Implement** as in Interfaces; update the `startRoutines` doc comment.
- [x] **Step 4: Run** — `npx vitest run --project core`. Expected: PASS.
- [x] **Step 5: Commit** — `feat(core): routines skipped under a pause, the morning no longer waits for the night`.

---

### Task 6: Per-post settings applied

**Files:**
- Modify: `core/src/chat/posts.ts` (`postsFrom`), `core/src/routines/night-day.ts` (digest read, ingest), `core/src/reads/queue.ts` (urgent filter), `core/src/main.ts`
- Test: `core/src/chat/delegation.test.ts`, `core/src/routines/night-day.test.ts`, `core/src/reads/queue.test.ts`

**Interfaces:**
- Consumes: `postSettings` (Task 1), `spendView` sources (Task 2).
- Produces:
  - `postsFrom(manager, opts: { db: DatabaseSync; clock: () => Date })`: `delegate` rejects with `Error('Plafond de Lun'Acedia atteint : rien ne lui est confié jusqu'à 05:00.')` when the post's day spend ≥ its `capUsd`; otherwise `client.agent(request, replyTimeoutS * 1000)`. `offered()` unchanged, so Natsume can say it.
  - Night: Lun'Acedia's digest is read only when `night && digest` (else treated as not connected: `bilan: null`, not waited for); Lun'Avaritia's `brain.ingest` is skipped when `night` is false or its cap is reached (the ingest step counts done with nothing sent, no delegation recorded).
  - `buildQueue`: `urgent` drops events of a post whose `liveUrgent` is false.
  - Post names in texts: slice 3's `postName(db, post)` (`core/src/journal/store.ts`); no other name helper is added.

- [x] **Step 1: Write the failing tests**

```ts
it('a post over its cap is not delegated to, and the reason says until when', async () => {
  putSetting(db, 'post:lunacedia:capUsd', 0.05); saveCache(db, 'costs:lunacedia', T, { since: todayStart, total: 0.05 });
  await expect(posts.delegate('lunacedia', 'x')).rejects.toThrow('Plafond de Lun\'Acedia atteint : rien ne lui est confié jusqu\'à 05:00.');
});
it('the reply delay is the post\'s setting', async () => { putSetting(db, 'post:lunacedia:replyTimeoutS', 10); /* fake answers after 11 s (fake timers) → TimeoutError */ });
it('the night skips a post whose night is off', async () => { putSetting(db, 'post:lunavaritia:night', false); /* no brain.ingest call, day done */ });
it('the night does not read a digest turned off', async () => { putSetting(db, 'post:lunacedia:digest', false); /* no day.digest call, bilan null */ });
it('urgent events of a post without live alerts stay out of Urgent', () => { putSetting(db, 'post:lunacedia:liveUrgent', false); expect(q.urgent).toEqual([]); });
```

- [x] **Step 2: Run** — `npx vitest run --project core core/src/chat core/src/routines core/src/reads`. Expected: FAIL.
- [x] **Step 3: Implement** as in Interfaces.
- [x] **Step 4: Run** — `npx vitest run --project core`. Expected: PASS.
- [x] **Step 5: Commit** — `feat(core): per-post night, digest, cap, reply delay and live alerts`.

---

### Task 7: The morning letter

**Files:**
- Modify: `core/src/db.ts` (append migration)
- Create: `core/src/routines/letter.ts`
- Modify: `core/src/routines/morning.ts`, `core/src/routines/morning-point.ts` (`gatherPoint` from the cache), `core/src/main.ts` (night wrapper, morning deps), `core/src/routines/routes.ts` (record shape)
- Test: `core/src/routines/letter.test.ts`, `core/src/routines/morning.test.ts`, `core/src/routines/morning-point.test.ts`

**Interfaces:**
- Consumes: `buildQueue`, `buildUpcoming` (slice 2), `rankPoint`, `composeWarm`, `postName(db, post)` (slice 3), `NIGHT`.
- Produces:

```sql
CREATE TABLE letters (day TEXT PRIMARY KEY, written_at TEXT NOT NULL, text TEXT NOT NULL, items TEXT NOT NULL);
CREATE TABLE letter_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, day TEXT NOT NULL, at TEXT NOT NULL, text TEXT NOT NULL);
```

```ts
// routines/letter.ts
export interface LetterFacts { night?: 'ok' | 'failed' | 'running'; alerts: number; counts: Record<string, number>; urgent: number; point: PointItem[] }
export interface Letter { day: string; writtenAt: string; text: string; facts: LetterFacts; notes: { at: string; text: string }[] }
export function parisHm(at: Date | string): string;                       // « 07:30 »
// `name` is `(id) => postName(db, id)` (slice 3), passed in so both stay pure
export function composeLetter(f: LetterFacts, upcoming: Upcoming, now: Date, name: (post: string) => string): string;
export function correction(before: LetterFacts, after: LetterFacts, name: (post: string) => string, nightEnd?: { at: Date; status: 'ok' | 'failed' }): string | undefined;
export function writeLetter(db, day: string, at: Date, text: string, facts: LetterFacts): void; // plain INSERT: a second one throws
export function addLetterNote(db, day: string, at: Date, text: string): void;
export function letterOf(db, day: string): Letter | undefined;
export function noteAfterNight(deps: MorningDeps, run: RunRecord): void;  // the night ended after today's letter → a note
// routines/morning.ts
export type MorningDeps = NightDeps & { queue(now: Date): Queue; upcoming(now: Date): Upcoming };
export interface MorningRecord { id: number; status: 'ok' | 'failed'; cost: number; items: number; letter: 'written' | 'noted' | 'unchanged'; warm: 'written' | 'failed'; reason?: string }
```

- `composeLetter` sentences, in order, each ending with « . »: night `failed` → « La veille de la nuit a échoué. », `running` → « La veille de la nuit tourne encore. »; then `alerts === 0` → « Nuit calme. » else « N urgence(s) cette nuit. »; then the posts with a count, in `WORLDS` order, « Lun'Avaritia propose 10 cartes » (« 1 carte »), joined by « , », followed by « , rien d'urgent » or « , et N urgence(s) à voir » (no post: « Rien à trancher » or « N urgence(s) à voir »); then up to three `event`/`reminder`/`due` items of `upcoming` before the next 05:00, « Rappeler Paul à 19:00. ».
- `correction`, lowercase, « ; »-joined: « la veille de la nuit a fini à 10:05 » (or « a échoué à 10:05 »), « Lun'Avaritia propose 4 cartes de plus », « N urgence(s) de plus »; undefined when nothing changed and no `nightEnd`.
- `facts`: `counts` = `queue.groups[].count` by satellite, `urgent` = `queue.urgent.length`, `alerts` = `gathered.alerts.length`, `night` = status of the night run started since today's 05:00 slot, `point` = `rankPoint(...)`. Stored in `items` as JSON.
- `runMorning`: gather (cache) → rank → `composeWarm` (failure kept as today) → no letter today: `writeLetter` (`written`); a letter: `correction(letter.facts, facts, (id) => postName(db, id), nightEnd)` (`facts` = the facts just gathered; `nightEnd` only when the night run ended since the last note) → `addLetterNote` (`noted`) or nothing (`unchanged`). No `addMessage` any more. A thrown gather fails the run, no letter.
- `gatherPoint(deps, now)` reads `card_reads` (every row), `cached('dues')` and the events table: no post call.
- `main.ts`: `const night = async () => { const r = await runNight(nightDeps); noteAfterNight(morningDeps, r); return r; }`.

- [x] **Step 1: Write the failing tests**

```ts
it('writes the prototype\'s letter', () => {
  expect(composeLetter({ night: 'ok', alerts: 0, counts: { lunavaritia: 10 }, urgent: 0, point: [] }, upcomingWith('Rappeler Paul', '2026-11-02T18:00:00.000Z'), T0730, (id) => postName(db, id)))
    .toBe('Nuit calme. Lun\'Avaritia propose 10 cartes, rien d\'urgent. Rappeler Paul à 19:00.');
});
it('a second letter for the same day is refused by the database', () => {
  writeLetter(db, '2026-11-02', T0730, 'a', facts); expect(() => writeLetter(db, '2026-11-02', T0730, 'b', facts)).toThrow();
});
it('the morning writes the letter and posts nothing in the main thread', async () => {
  const r = await runMorning(deps); expect(r.letter).toBe('written');
  expect(letterOf(db, '2026-11-02')!.text).toMatch(/^Nuit calme\./);
  expect(mainThreadMessages()).toEqual([]);
});
it('the letter is written at 07:30 while the night runs, and the night\'s end corrects it', async () => {
  // night run 'running' since 05:00; queue lunavaritia 10 → letter says « La veille de la nuit tourne encore. »
  // then night ends 10:05 with 4 more cards → noteAfterNight → note « la veille de la nuit a fini à 10:05 ; Lun'Avaritia propose 4 cartes de plus »
  expect(letterOf(db, day)!.text).toBe(textAt0730); // never rewritten
});
it('a relaunch after a failed 07:30 writes the first letter', async () => { /* gather throws at 07:30 → failed, no letter; relaunch 09:00 → written */ });
it('a relaunch with nothing new writes no note; with a change, one note', async () => { /* twice: unchanged, then +2 cards → one note */ });
it('the point is gathered from the cache, calling no post', async () => { const before = calls(); await gatherPoint(deps, T); expect(calls()).toBe(before); });
```

- [x] **Step 2: Run** — `npx vitest run --project core core/src/routines`. Expected: FAIL.
- [x] **Step 3: Implement** as in Interfaces; update `morning.test.ts` cases that expected `posted`.
- [x] **Step 4: Run** — `npx vitest run --project core`. Expected: PASS.
- [x] **Step 5: Commit** — `feat(core): the morning letter, written once a day and corrected`.

---

### Task 8: Pause and caps in the single state

**Files:**
- Modify: `core/src/reads/state.ts`, `core/src/reads/routes.ts` (deps), `core/src/app.ts`
- Test: `core/src/reads/state.test.ts`

**Interfaces:**
- Consumes: `currentPause`, `spendView`, `LiveSettings.capsKept`.
- Produces (changes to slice 2's types):

```ts
export type NatsumeKind = 'disponible' | 'reflechit' | 'pause' | 'cle-refusee' | 'attente-cle';
export type BandKind = 'cle-refusee' | 'plafond' | 'pause' | 'poste-injoignable' | 'poste-muet' | 'mise-en-route';
export const BAND_ORDER: BandKind[]; // ['cle-refusee', 'plafond', 'pause', 'poste-injoignable', 'poste-muet', 'mise-en-route']
// CoreState gains:
pause?: Pause;
natsume: { kind: NatsumeKind; since?: string; until?: string };
spend: SpendView;
band?: { kind: BandKind; post?: string; since?: string; until?: string; reason?: PostReason; scope?: 'jour' | 'mois'; spent?: number; cap?: number };
route: { device: true; key: boolean; caps: boolean; firstPost: boolean; secondDevice: boolean; done: boolean };
```

- Rules: `pause` = `currentPause(db)` (absent when none). `natsume`: order `attente-cle`, `cle-refusee`, `pause` (`since`, `until` of the pause), `reflechit`, `disponible`. Band `plafond` when `spend.reached` (whatever `atCap`): `{ scope, spent, cap, until? }`, `until` only when the pause is a cap pause. Band `pause` when the pause is `manuel`: `{ since }`. Any pause drops the `poste-injoignable` and `poste-muet` bands. `route.caps = capsKept`; `done = key && caps && firstPost`.

- [x] **Step 1: Write the failing tests**

```ts
it('a manual pause shows its band and Natsume\'s state', async () => {
  await post('/api/pause');
  expect(s.band).toEqual({ kind: 'pause', since: T.toISOString() });
  expect(s.natsume).toEqual({ kind: 'pause', since: T.toISOString() });
});
it('the cap band wins over the pause band, with its figures and until', () => {
  expect(s.band).toEqual({ kind: 'plafond', scope: 'jour', spent: 3, cap: 3, until: '2026-11-03T04:00:00.000Z' });
});
it('« Prévenir seulement » shows the cap band without until and without pause', () => { expect(s.band).not.toHaveProperty('until'); expect(s).not.toHaveProperty('pause'); });
it('a post down raises no band during a pause, its state still says it', () => {
  expect(s.band).toMatchObject({ kind: 'pause' }); expect(s.posts.find((p) => p.id === 'lunacedia')).toMatchObject({ state: 'injoignable' });
});
it('a refused key keeps its band during a pause', () => { expect(s.band).toMatchObject({ kind: 'cle-refusee' }); });
it('an urgent event of a post enters the queue during a pause', () => { expect(s.queue.urgent).toBe(1); });
it('setup needs the caps kept', () => { expect(s.route).toMatchObject({ caps: false, done: false }); });
```

- [x] **Step 2: Run** — `npx vitest run --project core core/src/reads/state.test.ts`. Expected: FAIL.
- [x] **Step 3: Implement** as in Interfaces.
- [x] **Step 4: Run** — `npx vitest run --project core`. Expected: PASS.
- [x] **Step 5: Commit** — `feat(core): pause and caps in the single state`.

---

### Task 9: The word of each place

**Files:**
- Create: `core/src/word/word.ts`, `core/src/word/routes.ts`
- Modify: `core/src/app.ts` (mount), `README.md` (routes: `POST /api/pause`, `POST /api/resume`, `GET /api/word`)
- Test: `core/src/word/word.test.ts`

**Interfaces:**
- Consumes: `letterOf`, `buildUpcoming`, `spendView`, `currentPause`, `lastSlot`, `routine_runs`, table `journal`, `delegationsBetween`.
- Produces: `GET /api/word?place=bureau|constellation|journal|atelier|natsume` → `200` body below; any other place → `400 { error: 'Lieu inconnu : <place>' }`. No post call, no model call.

```ts
// JournalRow: slice 3's, from core/src/journal/query.ts
type BureauWord = { letter?: Letter /* without facts */; noLetter?: 'echec' | 'pause'; sinceMorning?: { new: number; pending: number }; upcoming: Upcoming; done: JournalRow[] /* last 3 of today */ };
type ConstellationWord = { routines: { routine: string; at: string; state: 'faite' | 'echouee' | 'sautee' | 'en-cours' | 'prevue' | 'suspendue' }[]; spend: SpendView };
type JournalWord = { days: { day: 'aujourdhui' | 'hier'; posts: { post: string; confie: number; cartes: number; urgences: number; faits: number; echoues: number }[] }[] };
type AtelierWord = { settings: JournalRow[] /* last 3 'reglage' */ };
type NatsumeWord = { letterAt?: string; delegatedToday: number; spendToday: number };
```

- Rules: `noLetter` only after today's 07:30 slot, without a letter, from today's last `morning` run (`failed` → `echec`, `skipped` → `pause`). `sinceMorning` = `carte` entries since the letter's `written_at` (else today's start): `new` = count, `pending` = those with outcome `a-trancher`; absent when `new` is 0. Routines: today's slot of each routine with its run's state, then tomorrow's slot as `prevue`, or `suspendue` while paused. Journal days: today and yesterday, one line per post with any entry (`confie` = type `confie`, `cartes` = type `carte`, `urgences` = type `urgence`, `faits`/`echoues` = outcome `fait`/`echoue` among `confie`). No cost total anywhere in the Journal word (n° 68).

- [x] **Step 1: Write the failing tests**

```ts
it('the Bureau gives the letter with its notes, what comes and the last three entries', async () => {
  expect(w.letter).toMatchObject({ writtenAt: T0730.toISOString(), notes: [{ text: expect.stringMatching(/^la veille/) }] });
  expect(w.done).toHaveLength(3);
});
it('no letter after a failed 07:30 says so; before 07:30 says nothing', async () => {
  expect(at0900.noLetter).toBe('echec'); expect(at0600).not.toHaveProperty('noLetter');
});
it('since this morning counts new cards and those still to decide, absent when none', () => { expect(w.sinceMorning).toEqual({ new: 3, pending: 2 }); });
it('the Constellation shows tomorrow\'s night suspended during a pause', () => { expect(w.routines.at(-2)).toMatchObject({ routine: 'night', state: 'suspendue' }); });
it('the Journal word has a line per post and no cost', () => { expect(JSON.stringify(w)).not.toMatch(/cost|total/); });
it('an unknown place is a 400, and no post is called', async () => { expect((await get('/api/word?place=carte')).status).toBe(400); expect(calls()).toBe(before); });
```

- [x] **Step 2: Run** — `npx vitest run --project core core/src/word`. Expected: FAIL.
- [x] **Step 3: Implement** as in Interfaces; add the README lines.
- [x] **Step 4: Full gate** — `npm test && npm run lint && npm run typecheck && npm run format:check`. Expected: all green.
- [x] **Step 5: Commit** — `feat(core): GET /api/word, the word of each place`.

---

## Self-review notes

- Spec coverage (§15 slice 5): unified daily cap seeded at the sum (1), monthly cap (1, 2), per-post settings stored (1) and applied (6), cap enforcement on the chat (2, 3), pause and its journal (3), relay with `by: 'core'`, 409 ack, reconnection, new pairing (4), errors journaled without band, urgents still in, read loop running (4, 5, 8), raising the cap lifts the pause (3), routines skipped and the engine change at line 84 (5), the letter: once, never rewritten, corrected, no model, 07:30 without the night, relaunch rule, no main-thread post (7), `GET /api/word` (9), `/api/state` pause, caps and band slots (8). The phrase leaves `/home` (2). UI left to slice 6.
- Not covered on purpose: the 80 % warning has nothing to send (notifications are out of palier 3); it is stored only.
