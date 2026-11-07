# Satellites on contract v1.4 (Natsume au centre, slice 1) Implementation Plan

> **Livré** par [lun-docs#55](https://github.com/Lun-Ecosystem/lun-docs/pull/55), [lun-acedia#46](https://github.com/Lun-Ecosystem/lun-acedia/pull/46), [lun-avaritia#12](https://github.com/Lun-Ecosystem/lun-avaritia/pull/12). Cases cochées le 07/11/2026 d'après cette livraison, sans recontrôle tâche par tâche.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Lun'Acedia and Lun'Avaritia serve satellite contract v1.4 (core pause apart from local pause, `/agent` open under a core pause, rules-only triage, declared agent name, new card and event fields, `{ answer }`), and `standards/contrat-satellite.md` says so.

**Architecture:** Each satellite keeps its own copy of the contract types (no shared package: the contract says « un paquet partagé ne sera créé que si deux projets en ont réellement besoin », and the core has its own copy in `lun-anima/core/src/satellites/client.ts`, out of this slice). The pause becomes two independent flags in `contract/state.ts` (`paused` for the local one, kept as the stored key so existing data stays a local pause, and `pausedByCore`); every caller reads `pausedBy` to decide. New card and event fields are filled where the satellites already build their contract objects (`toContractCard`, `cardOf`, `emitEvent`).

**Tech Stack:** Node 22+ with `--experimental-strip-types`, Hono, zod 4, `node:sqlite`, Svelte 5 fronts, Vitest 5 (`npm test` = `vitest run` with projects `server`, `app`, and `views` for Acedia). lun-docs: `node --test`.

**Spec:** `lun-docs/docs/specs/2026-11-02-natsume-au-centre-design.md` (§2 « La pause », « Noms » ; §9.4 ; §9.7 ; §9.8 ; §12 ; §14 « Pause » and « Partout » ; §15 slice 1).

## Global Constraints

- Contract version served: **v1.4**. « les routes et les champs ne cassent rien (aucun champ retiré ni rendu obligatoire), mais le comportement d'un satellite en pause change ».
- `POST /lun/v1/pause` accepts `{ reason?, by?: 'core' }`, `resume` `{ by?: 'core' }`; `Health.pausedBy?: 'core' | 'local'`. « `resume` avec `by: 'core'` ne lève qu'une pause du core ; une pause locale ne se lève que dans le front du poste. » A `409` stays the answer to a pause already set (or a resume of a pause not set) of the same origin; the core treats it as an acknowledgement.
- Under a core pause: rules-only triage (no model, free), `/agent` keeps answering, reads, events and card gestures keep working; « tout ce qui est automatique et passe par le modèle s'arrête ». Under a local pause: full stop as today, `/agent` answers that the post is paused.
- `Health.agentName?: string`, from the post's setting, « vide par défaut » ; empty or absent, it is not sent. Never « Pina » in anything a satellite declares.
- `Card.kind?`, `Card.reason?` (third person), `Card.sends?: true`, `Card.options?: string[]`; `accept` takes `input: { answer: string }`; `LunEvent.lines?: string[]`, `data.due?` (ISO deadline).
- Public repos: no secret, no real address (test data uses `example.org`), and nothing on a satellite's own front that names or points to the core (the existing `noCore.test.ts` / `noAnima.test.ts` guards must stay green).
- Code, comments, commits in English; texts shown to a user in French, following the spec's §3 (no `·` in new text, no em dash, no capitals label).
- One branch per repo, `feat/contract-v1-4`, created from an up-to-date `main` (`standards/git.md`: no stacked branches pushed). **Precondition:** the open `feat/contract-v1.3-links` branches of lun-acedia and lun-avaritia are merged into `main` first; this plan's file paths and line numbers are those of that v1.3 state.
- Every commit message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Load the `lun-livrer` skill before opening any PR (Conventional Commits title, body template).
- Each task ends with its repo green: `npm test`, `npm run typecheck`, `npm run lint` in the satellite; `npm test` and `npm run sync:check` in lun-docs.

## Review Focus

- **The two pauses overlap** (core pauses, then CrOliX pauses locally, then the core resumes): the post must stay fully stopped and say `pausedBy: 'local'`; tested in Tasks 2 and 6.
- **The satellite's own front under a core pause**: its Reprendre button must not call a `resume` that answers 409, and the front must say nothing of the core; tested in Tasks 5 and 8.
- **A free answer on a question that cannot take one** (Avaritia doublon, any Acedia card): a clear 400, nothing written; tested in Task 7.
- **An answer that equals the proposed loser** (contradiction: CrOliX picks the fact Avaritia wanted to strike): the facts swap, nothing else changes; tested in Task 7.
- **A mail with no rule while the core is paused**: it stays queued, untouched, and is triaged by the model on the first pass after `resume { by: 'core' }`; tested in Task 3.

---

### Task 1: Contract text v1.4 in lun-docs

The contract in `standards/contrat-satellite.md` still reads v1.2: v1.3 (`link`, `apps-core-design` §8) was implemented in the satellites but never written here. This task writes both.

**Files:**
- Modify: `lun-docs/standards/contrat-satellite.md`
- Modify: `lun-docs/registry.yaml:53` (Lun'Acedia description: « avec son assistante Pina » becomes « avec son agent »)
- Regenerated: `lun-docs/plugin/skills/lun-ecosysteme/references/contrat-satellite.md` (by `npm run sync`, never by hand)

**Interfaces:**
- Produces: the contract text Tasks 2 to 8 implement. Field names exactly: `by`, `pausedBy`, `agentName`, `contract`, `kind`, `reason`, `sends`, `options`, `answer`, `lines`, `data.due`, `link`.

- [x] **Step 1: Branch** — `git switch main && git pull --ff-only && git switch -c feat/contract-v1-4` in lun-docs.

- [x] **Step 2: Edit the contract.** In French, keeping the document's style:
  - Header: « Version du contrat : **v1.4**. »
  - Routes table: `GET /lun/v1/health` answers `{ status, reason?, version, contract?, paused?, pausedBy?, agent?, agentName? }`; `POST /lun/v1/pause` `{ reason?, by? }`; `POST /lun/v1/resume` `{ by? }`; `POST /lun/v1/cards/:id/accept` `{ input? }`, « `input` remplace l'entrée (« Modifier »), ou porte `{ answer }` pour une carte qui a des `options` ».
  - Types: `Health` gains `contract?: string` (« version du contrat servie, `'1.4'` »), `pausedBy?: 'core' | 'local'`, `agentName?: string`; `LunEvent` gains `link?: string` (v1.3, chemin dans le front du poste, jamais une adresse) and `lines?: string[]`; `Card` gains `link?: string` (v1.3), `kind?: string`, `reason?: string`, `sends?: true`, `options?: string[]`. One comment line each, from §9.8. Add « `data.due` : heure limite ISO, quand le poste la connaît ».
  - Comportements, replace the **Pause** bullet with three: **Deux pauses** (the `by` rule and the 409 rule from Global Constraints); **Pause du core** (the §9.8 paragraph verbatim); **Pause locale** (« arrêt complet de ce poste, comme avant la v1.4 ; `/agent` répond qu'il est en pause »). Add to **Cartes**: « Sans `kind`, le core écrit « Carte ». Une carte qui a `sends` ou `options` ne se valide jamais en lot. Une réponse libre (hors `options`) qu'une carte ne sait pas prendre vaut `400`. » Add a **Nom d'agent** bullet (the §9.8 text).
  - Versionnement: replace the last sentence with « Sans rupture de route ni de champ, la v1.1 ajoute … la v1.2 `brain.due` (Avaritia §4.2), la v1.3 `link` sur `Card` et `LunEvent`. La v1.4 ajoute `by`, `pausedBy`, `agentName`, `contract`, `kind`, `reason`, `sends`, `options`, `answer`, `lines` et `data.due`, et **change le comportement en pause** : un poste qui ne déclare pas `contract` `1.4` ou plus est muet pour le core. »

- [x] **Step 3: Regenerate the copy** — Run: `npm run sync` then `npm run sync:check`. Expected: `sync:check` exits 0; `git diff --stat` shows the plugin copy changed with the same lines.

- [x] **Step 4: Run the checks** — Run: `npm test && npm run check`. Expected: all pass.

- [x] **Step 5: Commit**

```bash
git add standards/contrat-satellite.md plugin/skills/lun-ecosysteme/references/contrat-satellite.md registry.yaml
git commit -m "docs(contract): satellite contract v1.4, core pause apart from local pause

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Lun'Acedia, two pauses and health v1.4

**Files:**
- Modify: `lun-acedia/server/src/contract/state.ts`
- Modify: `lun-acedia/server/src/contract/routes.ts:103-128` (health, pause, resume)
- Modify: `lun-acedia/server/src/identity.ts` (contract version constant)
- Modify: `lun-acedia/server/src/pina/store.ts` (declared agent name)
- Test: `lun-acedia/server/src/contract/pause.test.ts`, `lun-acedia/server/src/contract/health.test.ts`

**Interfaces:**
- Produces, in `contract/state.ts`:
  - `type PausedBy = 'core' | 'local'`
  - `interface SatelliteState { paused: boolean; pausedBy?: PausedBy; core: boolean; local: boolean; degraded: string[] }` — `paused = core || local`; `pausedBy = local ? 'local' : core ? 'core' : undefined` (local wins: it is the stronger stop).
  - `setPaused(db: DatabaseSync, paused: boolean, by: PausedBy = 'local'): void` — writes setting `paused` for local (the existing key, so a pause stored before v1.4 stays local) and `pausedByCore` for core. Existing calls `setPaused(db, true)` keep their meaning.
- Produces, in `identity.ts`: `export const CONTRACT = '1.4'`.
- Produces, in `pina/store.ts`: `declaredAgentName(db: DatabaseSync): string | undefined` — the trimmed `pina.name` setting, or `undefined` when it is empty or still the neutral default `'Agent'` (`DEFAULTS.name`).

- [x] **Step 1: Write the failing tests** in `pause.test.ts` (keep the three existing ones):

```ts
it('keeps the core pause and the local pause apart', async () => {
  // pause { by: 'core' } → 200, getState(h.db) toMatchObject { core: true, local: false, pausedBy: 'core' }
  // pause {} → 200, pausedBy 'local'
  // resume { by: 'core' } → 200 { status: 'paused' }, getState toMatchObject { core: false, local: true, pausedBy: 'local' }
  // resume {} → 200 { status: 'ok' }
});
it('answers 409 to a pause or a resume of the same origin twice', async () => {
  // pause {by:'core'} twice → second 409; resume {by:'core'} with no core pause → 409 even while paused locally
});
it('refuses an unknown origin', async () => {
  // pause { by: 'satellite' } → 400 { error: expect.any(String) }
});
```

In `health.test.ts`, change the first expectation to `{ status: 'ok', version: '0.0.0-test', contract: '1.4', agent: true }` and add:

```ts
it('says who paused', async () => {
  // setPaused(h.db, true, 'core') → json toMatchObject { status: 'paused', pausedBy: 'core' }
  // then setPaused(h.db, true) → pausedBy 'local'
});
it('declares the agent name only once the user set one', async () => {
  // default settings → body has no 'agentName' key
  // putPinaSettings(h.db, { name: 'Iris' }) → agentName 'Iris'
});
```

- [x] **Step 2: Run them** — `npx vitest run server/src/contract/pause.test.ts server/src/contract/health.test.ts`. Expected: FAIL (no `by`, no `contract`, no `pausedBy`).

- [x] **Step 3: Implement.** State as in Interfaces. Routes: parse the pause body with `z.object({ reason: z.string().max(500).optional(), by: z.literal('core').optional() })` and the resume body with `z.object({ by: z.literal('core').optional() })` via the file's `readJson` (empty body = `{}`; bad JSON or schema → 400). The 409 checks read `state.core` or `state.local` for the given origin. `resume` answers `{ status: statusOf(getState(db)).status }` (so `'paused'` while the other pause holds). Health: `{ ...status, ...paused, ...(state.pausedBy && { pausedBy: state.pausedBy }), version: deps.version, contract: CONTRACT, agent: true, ...(name && { agentName: name }) }`, `paused` unchanged (degraded and any pause).

- [x] **Step 4: Run** — `npm test && npm run typecheck && npm run lint`. Expected: PASS (other tests still call `setPaused(db, true)`, now a local pause).

- [x] **Step 5: Commit** — `feat(contract): core pause apart from local pause, health v1.4` (with the Co-Authored-By line).

---

### Task 3: Lun'Acedia, rules-only triage and `/agent` under a core pause

**Files:**
- Modify: `lun-acedia/server/src/triage/pipeline.ts:275-303` (`triageNew` and its doc comment)
- Modify: `lun-acedia/server/src/contract/routes.ts:210-216` (`/agent`)
- Test: `lun-acedia/server/src/triage/pipeline.test.ts`, `lun-acedia/server/src/contract/agent.test.ts`

**Interfaces:**
- Consumes: `getState(db).pausedBy`, `setPaused(db, paused, by)` from Task 2.

- [x] **Step 1: Write the failing tests** in `pipeline.test.ts` (next to « does nothing while paused… », which stays as the local-pause test):

```ts
it('under a core pause, rules still file and raise urgent, the AI waits', async () => {
  let box = '';
  const s = await setup(() => ({ boxId: box, confidence: 90 }));
  box = s.perso;
  createRule(s.h.db, { field: 'fromDomain', op: 'equals', value: 'ecole.example.org', boxId: s.ecole, tagIds: [s.urgent] });
  setPaused(s.h.db, true, 'core');
  await s.triage(await s.deliver({ id: 'm1', from: 'p@ecole.example.org' }, { id: 'm2', from: 'p@perso.example.org' }));
  expect(s.fake.inputs).toHaveLength(0);
  expect(getStoredMessage(s.h.db, 'm1')?.labels).toContain(s.ecole);
  expect(eventsSince(s.h.db).find((e) => e.type === 'mail.triaged')?.importance).toBe('urgent');
  expect(getProposal(s.h.db, 'm2')).toBeUndefined();
  expect(queuedIds(s.h.db)).toContain('m2');
  setPaused(s.h.db, false, 'core');
  await s.triage([]);
  expect(getProposal(s.h.db, 'm2')?.status).toBe('pending');
});
it('a local pause over a core pause stops the rules too', async () => {
  // rule as above, setPaused(core) then setPaused(local): after triage, m1 not filed, no event
});
```

In `agent.test.ts`:

```ts
it('answers a request under a core pause, refuses it under a local pause', async () => {
  const s = await setup();
  setPaused(s.h.db, true, 'core');
  expect((await (await s.post({ request: 'Range ce mail' })).json()).cards).toHaveLength(1);
  setPaused(s.h.db, true);
  const paused = await (await s.post({ request: 'Range ce mail' })).json();
  expect(paused).toMatchObject({ cards: [], cost: { amount: 0 } });
  expect(s.rounds()).toBe(2); // the model ran for the first request only (FILE then DONE)
});
```

- [x] **Step 2: Run them** — `npx vitest run server/src/triage/pipeline.test.ts server/src/contract/agent.test.ts`. Expected: FAIL.

- [x] **Step 3: Implement.** In `triageNew`, at each iteration read the state once: `pausedBy === 'local'` returns (as today); a core pause sets `useAi = false` (rules only, the rest stays queued through the existing `'wait'` outcome). Update the doc comment to say so. In `/agent`, refuse only when `getState(db).pausedBy === 'local'`; the `PAUSED` text stays.

- [x] **Step 4: Run** — `npm test && npm run typecheck && npm run lint`. Expected: PASS.

- [x] **Step 5: Commit** — `feat(triage): rules only under a core pause, agent still answers`.

---

### Task 4: Lun'Acedia, card kind and sends, event lines and due

**Files:**
- Modify: `lun-acedia/server/src/types.ts:86-95` (`LunEvent.lines?`), `:257-271` (`ContractCard.kind?`, `ContractCard.sends?`)
- Modify: `lun-acedia/server/src/db.ts` (append migration `'ALTER TABLE events ADD COLUMN lines TEXT'` after the v1.3 one)
- Modify: `lun-acedia/server/src/contract/events.ts` (`Row.lines`, `toEvent`, `emitEvent` store `lines` as JSON or NULL)
- Modify: `lun-acedia/server/src/contract/routes.ts:39-53` (`toContractCard`)
- Modify: `lun-acedia/server/src/triage/pipeline.ts` (rule-urgent `mail.triaged` gets `lines`)
- Modify: `lun-acedia/server/src/agenda/reminders.ts:83-90` (event reminders get `data.due`)
- Test: `lun-acedia/server/src/contract/cards.test.ts`, `lun-acedia/server/src/contract/events.test.ts`, `lun-acedia/server/src/triage/pipeline.test.ts`, `lun-acedia/server/src/agenda/reminders.test.ts`

**Interfaces:**
- Produces: `emitEvent(db, e: Omit<LunEvent, 'id' | 'at'>, now)` now also persists `e.lines`.
- Values: `kind` = `cardText(db, card).title` (« Créer un événement », « Brouillon de réponse »…). `sends: true` only for `draft.create` whose input has `replyTo` (the card titled « Brouillon de réponse »). No `reason` (Acedia's cards carry none) and no `options` (Acedia asks no questions).
- Urgent rule mail `lines`: `` `De : ${from.name ? `${from.name} <${from.addr}>` : from.addr}` `` then, when the snippet is not empty, `` `Extrait : ${snippet}` ``.
- Event reminder `data.due`: the event's start, ISO (`r.at + r.minutes * 60_000`); task reminders get none (no hour).

- [x] **Step 1: Write the failing tests.**
  - `cards.test.ts`: `it('gives each card its kind, and sends only on a reply draft')` — an `event.create` card lists with `kind: 'Créer un événement'` and no `sends` key; a `draft.create` card with input `{ to: 'paul@example.org', subject: 'Re: Orion', text: 'Jeudi.', replyTo: 'm1' }` lists with `kind: 'Brouillon de réponse', sends: true`; without `replyTo`, no `sends`. Update the existing exact `toEqual` of « lists pending cards in the contract format » with `kind`.
  - `events.test.ts`: `it('keeps the lines of an event')` — `emitEvent(h.db, { type: 't', importance: 'urgent', title: 'x', lines: ['a', 'b'] }, now)` then `eventsSince(h.db)[0]` toMatchObject `{ lines: ['a', 'b'] }`; an event without lines has no `lines` key.
  - `pipeline.test.ts`, in « a rule that sets the urgent tag emits urgent… »: deliver `m1` with `from: 'Prof <prof@ecole.example.org>'`, `snippet: 'Réunion demain'` (or the fake's default snippet) and expect the urgent event's `lines` toEqual `['De : Prof <prof@ecole.example.org>', 'Extrait : Réunion demain']`; the `info` event has no `lines`.
  - `reminders.test.ts`, in « emits a 10-minute reminder once… »: expect `data` toMatchObject `{ due: <the event start ISO> }`; in the task test, `data` has no `due`.

- [x] **Step 2: Run** — `npx vitest run server/src/contract server/src/triage/pipeline.test.ts server/src/agenda/reminders.test.ts`. Expected: FAIL.

- [x] **Step 3: Implement** as in Interfaces.

- [x] **Step 4: Run** — `npm test && npm run typecheck && npm run lint`. Expected: PASS.

- [x] **Step 5: Commit** — `feat(contract): card kind and sends, urgent lines and due (v1.4)`.

---

### Task 5: Lun'Acedia, the front shows only its own pause

**Files:**
- Modify: `lun-acedia/views/src/lib/client.ts:163-164` (health type: `pausedBy?: 'core' | 'local'`)
- Modify: `lun-acedia/app/src/shell/status.ts:84-91` (`readStatus`)
- Modify: `lun-acedia/views/src/lib/settings/Settings.svelte:164`
- Test: `lun-acedia/app/src/shell/status.test.ts`, `lun-acedia/views/src/lib/settings/Settings.test.ts`

**Interfaces:**
- Consumes: `Health.pausedBy` from Task 2.
- Rule: the front's `paused` (what Mettre en pause / Reprendre acts on) is `(status === 'paused' || paused === true) && pausedBy !== 'core'`. Under a core pause only, the service card says `service: 'pause'`, `detail: 'Les règles seules rangent'`, and the bar offers Mettre en pause (a local pause). Nothing names who paused.

- [x] **Step 1: Write the failing tests.** `status.test.ts`: `it('under a pause it did not set, offers to pause and says the rules go on')` — `client.health.mockResolvedValue({ status: 'paused', pausedBy: 'core' })` → `readStatus(...)` toMatchObject `{ service: 'pause', detail: 'Les règles seules rangent', paused: false }`; with `pausedBy: 'local'` → `{ service: 'pause', detail: 'Rien n’est rangé seul', paused: true }`. `Settings.test.ts`: with health `{ status: 'paused', pausedBy: 'core' }`, the service toggle offers the pause, not Reprendre (follow the file's existing health mock).

- [x] **Step 2: Run** — `npx vitest run app/src/shell/status.test.ts views/src/lib/settings/Settings.test.ts`. Expected: FAIL.

- [x] **Step 3: Implement** the rule in `readStatus` (a core-only pause takes the `'paused'` branch with the new detail) and in `Settings.svelte`.

- [x] **Step 4: Run** — `npm test && npm run typecheck && npm run lint && npm run check:colors`. Expected: PASS.

- [x] **Step 5: Commit** — `feat(app): the pause a front shows is its own`. Then open the PR (load `lun-livrer` first).

---

### Task 6: Lun'Avaritia, two pauses, health v1.4, `/agent` under a core pause

**Files:**
- Modify: `lun-avaritia/server/src/contract/state.ts` (same shape as Task 2)
- Modify: `lun-avaritia/server/src/contract/routes.ts:91-117` (health, pause, resume), `:189-200` (`/agent`)
- Modify: `lun-avaritia/server/src/identity.ts` (`export const CONTRACT = '1.4'`)
- Modify: `lun-avaritia/server/src/brain/settings.ts` (`declaredAgentName`)
- Test: `lun-avaritia/server/src/contract/pause.test.ts`, `lun-avaritia/server/src/contract/health.test.ts`, `lun-avaritia/server/src/brain/agent.test.ts`, `lun-avaritia/server/src/brain/ingest.test.ts`

**Interfaces:**
- Produces: `PausedBy`, `SatelliteState`, `setPaused(db, paused, by = 'local')` exactly as Task 2 (same setting keys `paused` and `pausedByCore`); `declaredAgentName(db: DatabaseSync): string | undefined` in `brain/settings.ts`, from `setting(db, 'agent.name')`, undefined when empty or `'Agent'`.
- Behaviour: `runPending` (`brain/ingest.ts:60,68`) already stops on `getState(db).paused`, which now covers both pauses: unchanged, that is the « automatique par le modèle s'arrête ». `resume` (either origin) still calls `runPending`, which returns at once while the other pause holds.

- [x] **Step 1: Write the failing tests.** Copy Task 2's `pause.test.ts` and `health.test.ts` cases (agent name set with `saveSettings(h.db, { 'agent.name': 'Iris' })`; Avaritia's health has the same exact `toEqual` to update with `contract: '1.4'`). In `agent.test.ts` « agent routes »: `it('answers under a core pause, refuses under a local pause')` — `setPaused(t.h.db, true, 'core')` then `post({ request: 'salut' })` toMatchObject `{ summary: 'Rien.' }`; `setPaused(t.h.db, true)` then the summary matches `/en pause/` and `cost.amount` is 0. In `ingest.test.ts`: `it('under a core pause, a lot waits queued with no model call')` — `setPaused(t.h.db, true, 'core')`, push `t.goodReplies()`, ingest one observation as the first test does, wait a tick: expect `t.status(1).status` toBe `'queued'` and every pushed reply still in `t.replies`; then `POST /lun/v1/resume { by: 'core' }` and `await t.settle()` → `'done'`.

- [x] **Step 2: Run** — `npx vitest run server/src/contract server/src/brain/agent.test.ts server/src/brain/ingest.test.ts`. Expected: FAIL.

- [x] **Step 3: Implement** as Task 2 (same body schemas, 409 per origin, same health shape) plus `/agent` refusing only when `pausedBy === 'local'`.

- [x] **Step 4: Run** — `npm test && npm run typecheck && npm run lint`. Expected: PASS.

- [x] **Step 5: Commit** — on `feat/contract-v1-4` from up-to-date `main`: `feat(contract): core pause apart from local pause, health v1.4`.

---

### Task 7: Lun'Avaritia, kind, reason, options and `{ answer }`

Avaritia's questions are its `contradiction` and `doublon` drafts (`brain/process.ts:133`, « questions »). A question's options are the two things it opposes; the answer picks one.

**Files:**
- Modify: `lun-avaritia/server/src/brain/drafts.ts` (`Card` type `:81-92`, `DraftPayloadSchema` contradiction `:60`, `applyDraft` `:267-302`, `applyContradiction` `:233-245`, `cardOf` `:322-377`)
- Test: `lun-avaritia/server/src/brain/drafts.test.ts`, `lun-avaritia/server/src/contract/routes.test.ts`

**Interfaces:**
- `Card` gains `kind?: string; reason?: string; options?: string[]` (no `sends`: nothing leaves Avaritia).
- `kind`: fiche without `ficheId` « Nouvelle fiche », with `ficheId` « Fiche enrichie », contradiction and doublon « Question », import « Import ».
- `reason`: the payload's `reason` for contradiction and doublon; the `Raison : …` line leaves `lines` (one fact, once). Avaritia's own front reads `payload`, not `lines`, so it is unaffected.
- `options`: contradiction `[factText(keep), factText(strike)]`; doublon `[ficheTitle(keep), ficheTitle(merge)]`.
- Contradiction payload gains `answer: z.string().trim().min(1).max(1000).optional()`: a free answer.
- `applyDraft(db, draftId, input, now)` unchanged signature; an `input` that parses as `z.strictObject({ answer: z.string().trim().min(1).max(1000) })` is an answer, anything else keeps today's « Modifier » path. Answer rules:
  - contradiction: equals `options[0]` → as proposed; equals `options[1]` → `keep` and `strike` swap; otherwise → `{ ...payload, answer }`, applied as one new active fact on the fiche (`addFact` with source `{ kind: 'core', at: now }`) that strikes both (`strikeFact(db, keep, added, now)` and `strike`).
  - doublon: equals `options[0]` → as proposed; `options[1]` → `keep` and `merge` swap; otherwise `InvalidInputError('Choisis l’une des deux fiches.')` (400 through the existing route mapping).
  - fiche or import: `InvalidInputError('Cette carte n’attend pas de réponse.')`.
  - Option texts are read when the answer arrives, from the same helpers `cardOf` uses.

- [x] **Step 1: Write the failing tests** in `drafts.test.ts`:

```ts
it('gives kind, reason and options to its questions, kind alone to a fiche', () => {
  // contradiction keep 'neuf fait' strike 'vieux fait' reason 'Deux dates citées.'
  // → card toMatchObject { kind: 'Question', reason: 'Deux dates citées.', options: ['neuf fait', 'vieux fait'] }
  //   and card.lines has no line starting with 'Raison'
  // doublon keep 'Dora' merge 'Dorah' → options ['Dora', 'Dorah'], kind 'Question'
  // new fiche draft → kind 'Nouvelle fiche', no reason/options keys; with ficheId → 'Fiche enrichie'
});
it('an answer naming the proposed loser swaps the contradiction', () => {
  // applyDraft(db, id, { answer: 'vieux fait' }, 't2') → 'neuf fait' struck by 'vieux fait'
});
it('a free answer replaces both facts with the answer', () => {
  // applyDraft(db, id, { answer: 'Chez Lulu' }, 't2') → facts: 'Chez Lulu' active, both others struckBy its id
});
it('an answer naming the other fiche merges the doublon the other way', () => {
  // { answer: 'Dorah' } → fiche 'Dora' mergedInto 'Dorah'
});
it('refuses a free answer to a doublon and any answer to a fiche, writing nothing', () => {
  // expect(() => applyDraft(db, dup, { answer: 'Autre' }, 't2')).toThrow(InvalidInputError); getDraft(db, dup)!.status 'pending'
  // same for a fiche draft with { answer: 'x' }
});
```

In `routes.test.ts`: `it('accepts an answer through the contract')` — `POST /lun/v1/cards/:id/accept` `{ input: { answer: 'vieux fait' } }` → 200, `card.status` `'done'`; `{ input: { answer: 'Autre' } }` on a doublon → 400 `{ error: 'Choisis l’une des deux fiches.' }`. Update « writes human lines for a contradiction… » if it relied on the `Raison` line (it does not today).

- [x] **Step 2: Run** — `npx vitest run server/src/brain/drafts.test.ts server/src/contract/routes.test.ts`. Expected: FAIL.

- [x] **Step 3: Implement** as in Interfaces; the answer is resolved into a payload before the existing transaction, so the claim and the writes stay one transaction.

- [x] **Step 4: Run** — `npm test && npm run typecheck && npm run lint`. Expected: PASS.

- [x] **Step 5: Commit** — `feat(brain): questions carry options, an answer decides them (v1.4)`.

---

### Task 8: Lun'Avaritia, the front shows only its own pause

**Files:**
- Modify: `lun-avaritia/app/src/App.svelte:69-96` (status read from health, pause toggle)
- Modify: `lun-avaritia/app/src/shell/Shell.svelte:34-35,138` (service card state)
- Test: `lun-avaritia/app/src/App.test.ts`

**Interfaces:**
- Consumes: `Health.pausedBy` from Task 6.
- App status gains `held: boolean` (any pause: `status === 'paused' || paused === true`); `paused` (what the toggle and Réglages act on) becomes `held && pausedBy !== 'core'`. The rail's service card shows `'pause'` when `held`, so the card says « Traitement en pause » under a core pause while the toggle offers « Mettre le traitement en pause ». Nothing names who paused.

- [x] **Step 1: Write the failing test** in `App.test.ts`: `it('under a pause it did not set, shows the pause and offers to pause')` — a `fakeServer` variant answering health `{ status: 'paused', pausedBy: 'core', version: '0.0.0', agent: true }`; the rail shows « Traitement en pause » and the palette or rail action reads « Mettre le traitement en pause »; clicking it calls `POST /lun/v1/pause` (never `resume`).

- [x] **Step 2: Run** — `npx vitest run app/src/App.test.ts`. Expected: FAIL.

- [x] **Step 3: Implement** the rule above.

- [x] **Step 4: Run** — `npm test && npm run typecheck && npm run lint`. Expected: PASS, `noCore.test.ts` and `noAnima.test.ts` included.

- [x] **Step 5: Commit** — `feat(app): the pause a front shows is its own`. Then open the PR (load `lun-livrer` first).
