# Natsume au centre, slice 6: the places — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the map, the old journal and Écosystème in `lun-anima/ui` with the five places of the spec (Bureau, Constellation, Journal, Atelier, Natsume's fiche), the menu, the state band, Natsume's column with its VS Code–like conversation panel, the phone layouts, the address tree, the keyboard and the `--anima` token.

**Architecture:** Five shared stores live in Svelte contexts set once by `App.svelte`: `etat` (`GET /api/state`, the one source of every counter and state word), `file` (`GET /api/queue` plus the held gestures), `nav` (the current place parsed from the address), `monde` (world data: place names, the seven worlds and their heptagram places) and `conversation` (the panel's state, remembered on the device). Each place is a component that reads those stores and its own route; overlays (detail panel on a desktop, sheet on a phone) are one component; the keyboard is one data table plus one Escape layer stack. Old views are deleted only once `App.svelte` is switched over (Task 29), so the app keeps working between tasks.

**Tech Stack:** Svelte 5 (runes), TypeScript, Vite 8, Bits UI 2, `@lucide/svelte`, vitest 5 with jsdom and `@testing-library/svelte`; no new dependency.

**Spec:** `lun-docs/docs/specs/2026-11-02-natsume-au-centre-design.md` (§2, §3, §4, §5, §6, §7, §8, §11, §12, §14, §15 slice 6). Visual reference: `lun-docs/.superpowers/brainstorm/natsume-centre-2026-11-02/maquettes/` (`bureau.html` entry, `carnet.css`, `carnet.js`, `notes.html`). The spec wins over the prototype for the conversation panel (§4.4) and the Journal filters (§6.3).

**Repo / branch:** `D:/projets/projets perso/LunEcosystem/lun-anima`, new branch `feat/ui-natsume-centre` cut from `feat/core-caps-pause` (slice 5's branch, itself on `feat/core-held-gestures`, `feat/core-journal` and `feat/core-read-loop`). Task 1 also touches `lun-docs` (tokens), on `feat/kit-natsume-centre`, the lun-docs branch slice 4 cut from `main` for its toast and undo kit change; that branch carries both and is merged into lun-docs `main` before the lun-anima PRs that copy the kit.

## Global Constraints

- DA: « tokens only » — no colour written in a `.svelte` or `.css` file of `ui/src` outside `lib/tokens.css`; Cormorant (`var(--serif)`) and Inter (`var(--sans)`) only; kit components from `ui/src/lib/ui` first, Bits UI for anything the kit lacks, icons from `@lucide/svelte` one by one (`@lucide/svelte/icons/<name>`); no Tailwind.
- Phone breakpoint: `max-width: 767.98px` everywhere (CSS and `MediaQuery`).
- Desktop grid (§4.1): menu 240 px, column 360 px, shrinking to about 180 and 280 px at the narrowest; « Lisible de 1024 à 1920 px, vérifiée à 1280 et 1440 ».
- Copy (§3 and DA): « pas de libellé en capitales, pas de « · », pas de « → » dans un bouton, pas de tiret cadratin »; never « core », chantier, entité, front, persona, RVC, heptagramme, Desktop Agent on screen; never « Pina »; no pronoun for an agent; « Quand tout va bien, on se tait ».
- Formats (§3 rule 8): hours « 14:20 »; dates « lundi 2 novembre », « hier, 14:10 », day in lower case inside a sentence, « 1er »; amounts « 0,42 $ », two decimals, « moins de 0,01 $ » under a cent; no number written in letters in fixed text.
- Tone: fixed text simple and direct; Natsume's dynamic voice neutral and factual; game words only in place names, menu words and state words.
- Same verb on a button and in the toast that follows (§3 rule 4).
- App addresses use world ids (`acedia`), API paths satellite ids (`lunacedia`); convert with `worldOf` / `satelliteOf` (Task 3) only.
- A reply card of Lun'Acedia only creates a Gmail draft: its button is « Créer le brouillon » and its toast « Brouillon créé : … »; never « Envoyer la réponse » nor « Réponse envoyée ». `sends: true` means « writes outside, never batched ».
- Contract v1.4 is decided by the core (`Health.contract`); the UI never reads a post's version itself, it reads `PostView.state` and `readOnly`.
- No gesture is queued in the browser; offline or with Natsume unreachable, everything is read-only.
- Every `.svelte` file created or changed is run through `npx @sveltejs/mcp svelte-autofixer <path>` until it reports no issue (a step in every component task).
- Test command (from the repo root): `npx vitest run --project ui <files>`; full gate `npm test && npm run lint && npm run typecheck && npm run format:check`.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Rulings made where the spec is wrong or silent (binding for this plan)

1. Reply cards: « Créer le brouillon » / « Brouillon créé : <titre>. » replace the spec's « Envoyer la réponse » / « Réponse envoyée dans 5 s : … » (coordinator ruling from slice 1); the badge on such a row reads « Crée un brouillon » instead of « Envoie un mail ».
2. Mise en route header uses digits: « 4 réglages avant de commencer. », « 1 réglage avant de commencer. » (rule 8 beats the prototype's « Quatre »).
3. In a pile, « Valider celle-ci » accepts that card and refuses the other (the spec's toast « Une fiche validée, l'autre refusée. » implies it); « Refuser les deux » toasts « Les deux fiches refusées. ».
4. A pile gesture is one `POST /api/gestures` whose items are exactly the pile's cards, each `accept` or `refuse` (slice 4's pile rule); one toast, one held id, and its Annuler deletes that id.
5. Gesture toasts for a due: « C'est fait : <texte>. » and « Plus tard : <texte>. » (same verb as the button).
6. Toast nouns for batches follow slice 4's rule (`heldToastText`): the last word of the shared `kind`, lowercased, « s » for the plural (`Nouvelle fiche` → fiche/fiches); missing or mixed kinds say « cartes ». `nomDe` (Task 15) applies the same rule to button labels.
7. Every counter on screen reads `etat.state.queue` (menu, file title, phone tab, Natsume's star, palette); the file only removes rows optimistically, then both stores are read again after each gesture.
8. Menu counter staleness: « 13, lu à 14:11 » uses the oldest `readAt` among stale posts.
9. Presence line: « 1 urgence + 2 » = `urgent` then `count`; « 2 » alone without urgent; « 2 urgences » plural; zero of both shows nothing.
10. Natsume unreachable is decided by the UI: the first failed `GET /api/state` (network or 5xx) after a success; with no snapshot at all (reload during the outage) the error screen shows without data (§7).
11. After pairing, the app goes to `/app/`; `/app/` leads to `/app/mise-en-route` only while `state.route.done` is false, so a second device of a set-up core lands on the Bureau (n° 66).
12. The toast is centred on the place's page by mounting the kit `Toaster contained` (slice 4) inside the page cell, which is positioned.
13. `/app/constellation/natsume` on a phone opens a sheet with Natsume's state and the Constellation's word (routines, spend).
14. The old « Adresse du front » row of Postes is kept, relabelled « Adresse de sa page » (« front » is project vocabulary).
15. `carte/geometry.ts` is deleted with the map: fixed places in percent (from the prototype's polygon) need none of its orbit maths; `Noeud.svelte` becomes `constellation/Astre.svelte`.
16. Ce qui vient is read from `GET /api/upcoming` (slice 2, exact), not from `/api/word`.
17. Journal API filter for Natsume's own entries: app `poste=natsume` maps to API `poste=lunanima` (the core's id in today's journal).
18. Escape is handled by one layer stack for the app's own layers (lot, phone sheet, detail panel, Natsume's field); Bits UI dialogs (palette, confirmation band) keep their own Escape and the stack ignores keys while an `aria-modal` dialog is open.
19. The help bar reads the focus through `data-aide` on regions (`file`, `journal`, `ciel`, `atelier`, `saisie`).
20. The PWA manifest `theme_color` becomes `#6B2D4F` (`#7A1818` is now the danger fill only).
21. Apostrophes: post names keep the straight `'` of `nameOf`; all other fixed copy uses `’`, as the existing app does.

## Interfaces consumed from other slices

Slice 2 (`2026-11-02-natsume-centre-tranche-2-boucle-lecture.md`), exact: `GET /api/state` → `CoreState`; `GET /api/queue` → `Queue` (`QueueUrgent`, `QueueCard`, `QueuePile`, `QueueDue`, `QueueGroup`, `ReadOnlyReason`); `GET /api/upcoming` → `Upcoming` (`UpcomingItem`); `GET /api/posts/:id` and `POST /api/posts/:id/check` → `PostDetail` (`PostView` plus `contract?, lastContact?, lastSuccess?: { at, count }, lastError?: { at, reason }, readAt?, stale, today: { delegations: string[]; cost?: number }`); `PostState`, `PostReason`, `NatsumeKind`, `BandKind`; and (slice 2 Task 9) `DELETE /api/satellites/:id` → `204` / `404` (Délier), `DELETE /api/pairing-codes/:code` → `204` / `404` (Annuler ce code). These are copied as TypeScript types into `ui/src/types.ts` in Task 6, as are the slice 3 to 5 shapes below.

- Slice 3 (`…-tranche-3-journal.md`, Task 5), exact: `GET /api/journal?periode=auj|7j|tout&poste=<satelliteId or lunanima>&type=<JournalType>&q=<text>&avant=<YYYY-MM-DD>` → `JournalPage = { total: number; since?: string; matched: number; days: { day: string; count: number; entries: JournalRow[] }[]; next: string | null }`; `JournalRow = { id: number; at: string; type: JournalType; post: string; title: string; meta?: string; outcome?: JournalOutcome; cost?: number; durationMs?: number }`, `JournalType = 'urgence' | 'carte' | 'confie' | 'routine' | 'pause' | 'reglage' | 'liaison' | 'evenement'`, `JournalOutcome = 'a-trancher' | 'tranchee' | 'vue' | 'fait' | 'echoue' | 'sautee'`; `GET /api/journal/:id` → `JournalDetail = JournalRow & { steps: { at: string; text: string }[]; refs?: Ref[]; cardId?: string; eventId?: number; threadId?: string; messageId?: number; pending?: { satellite: string; card: Card } | { event: number } }`, `404` for an unknown id. The app's « n » in `/app/journal/<n>` is that `id`.
- Slice 4 (`…-tranche-4-gestes.md`, Tasks 3 to 5), exact: `ui/src/gestures/held.ts` — `HeldBody`, `ToastFacts`, `heldToastText(facts)`, `holdGesture(api, body, facts): Promise<Held>` (`POST /api/gestures` → `202 { id: number; dueAt: string }`, then one toast whose undo is `DELETE /api/gestures/:id`; a `POST` error throws), `settleGesture(api, held): Promise<HeldOutcome>` (`HeldOutcome = { state: 'relayed' | 'cancelled'; failed: { satellite: string; target: string; reason: string }[]; conflict: number; summary?: string }`, toasts « Déjà tranchée ailleurs. » itself). A gesture that covers exactly a pile's cards is one pile gesture, each card `accept` or `refuse`; any other gesture of two or more cards is a batch (all `accept`, all `batchable`, one satellite). Kit (`ui/src/lib/ui/toasts.svelte.ts` and `Toaster`, synced from lun-docs): `toast(message, options?)` as today, one toast at a time, 5 s with the time left when `undo` is given, 3 s otherwise, Ctrl Z bound by `Toaster` (never from a field), `Toaster` prop `contained?: boolean`.
- Slice 5 (`…-tranche-5-plafonds-pause.md`), exact: `POST /api/pause` → `200 { pause }`, `POST /api/resume` → `200 {}` or `200 { pause }` while a cap holds; `CoreState` gains `pause?: { since: string; by: 'manuel' | 'plafond-jour' | 'plafond-mois'; until?: string }`, `natsume.until?`, `NatsumeKind` gains `'pause'`, `BandKind` gains `'plafond' | 'pause'` (band `{ kind: 'plafond'; scope: 'jour' | 'mois'; spent: number; cap: number; until?: string }`, `until` absent with « Prévenir seulement »; `{ kind: 'pause'; since }`), `route.caps: boolean`, `spend: SpendView = { day: { total; cap; sources: { source: 'natsume' | string /* satellite id */; total: number; chat?: number; routines?: number; readAt?: string }[] }; month: { total; cap }; week: { day: string; total: number }[]; reached?: 'jour' | 'mois' }`; `GET /api/settings` / `PATCH /api/settings` gain `dayCapUsd`, `monthCapUsd`, `atCap: 'pause' | 'warn'`, `warnAt80: boolean`, `capsKept: boolean` (PATCH `capsKept: true`), and `posts: Record<satelliteId, { night: boolean; digest: boolean; capUsd: number | null; replyTimeoutS: number; liveUrgent: boolean; pairedAt: string /* GET only */ }>`; `GET /api/word?place=bureau|constellation|journal|atelier|natsume` → the per-place shapes of slice 5 Task 9 (copied in Task 12).

## Review Focus

1. Natsume becomes unreachable mid-session (core stopped): the page keeps the last snapshot, the band says since when, every gesture is disabled with « Natsume est injoignable : lecture seule. », and nothing is retried as a gesture later — pinned in Tasks 6 and 16.
2. A remembered panel height that no longer fits (window shrunk from 900 to 600 px high, or a corrupt or negative stored value, or storage that throws) must be clamped to « fil ≥ 160 px, mot ≥ 120 px » or fall back to the default — pinned in Task 9.
3. `/app/?carte=avaritia:<id>` for a card already decided or unknown: the file shows, nothing is chosen, no error, the address is cleaned — pinned in Task 18.
4. E, V, R or Ctrl Z typed inside Natsume's field, the Journal search or an Atelier field never triggers a place key; no key needs AltGr or Shift on AZERTY — pinned in Tasks 5 and 16.
5. Pressing V twice fast, or Valider then V, sends one gesture, not two — pinned in Task 16.

---

## File structure

Created (all under `lun-anima/ui/src` unless said):

| File | Responsibility |
|---|---|
| `monde.ts` | world data: place names, the seven worlds (heptagram order, place in %, role), `satelliteOf` |
| `etat.svelte.ts` | `Etat` store: `GET /api/state`, unreachable detection, `natsumeWord()` |
| `shell/nav.svelte.ts` | `Nav` store: current `Lieu`, `go()`, popstate, phone flag |
| `shell/routes.ts` (rewritten) | `parseAddress`, `hrefOf`, old address redirects |
| `shell/touches.ts` | the key table (§4.9) and `bindPlaceKeys` |
| `shell/couches.ts` | the Escape layer stack |
| `shell/bande.ts`, `shell/Bande.svelte` | band texts and the band |
| `shell/Menu.svelte`, `shell/Presences.svelte` | menu of places, presences |
| `shell/palette.ts`, `shell/Aide.svelte` | palette commands, help bar |
| `shell/Detail.svelte` | detail panel (desktop) or sheet (phone) |
| `shell/TeteTel.svelte`, `shell/BarreTel.svelte` | phone header, phone conversation bar |
| `shell/Shell.svelte` (rewritten) | the grid, band, menu, page, column, toaster, phone chrome |
| `natsume/panneau.svelte.ts` | conversation panel model: states, height, clamps, storage |
| `natsume/Colonne.svelte` | Natsume's column: head, word, panel, handle |
| `natsume/Conversation.svelte`, `natsume/Champ.svelte`, `natsume/CarteReduite.svelte` | panel content, the field, the reduced card |
| `natsume/mot/MotBureau.svelte`, `MotConstellation.svelte`, `MotJournal.svelte`, `MotAtelier.svelte`, `MotNatsume.svelte`, `natsume/mot/mot.ts` | the word of each place |
| `file/file.svelte.ts`, `file/textes.ts` | queue store and gestures, toast texts |
| `file/File.svelte`, `file/Rangee.svelte`, `file/Depliee.svelte`, `file/Pile.svelte`, `file/Lot.svelte` | the one queue component |
| `lieux/Bureau.svelte`, `lieux/BureauTel.svelte` | Bureau page (desktop), phone Bureau |
| `constellation/Constellation.svelte`, `constellation/Ciel.svelte`, `constellation/Astre.svelte`, `constellation/PanneauPoste.svelte` | Constellation |
| `journal/filtres.ts`, `journal/Journal.svelte`, `journal/PanneauEntree.svelte` | Journal |
| `atelier/Atelier.svelte`, `atelier/Reglage.svelte`, `atelier/Clavier.svelte`, `atelier/Notifications.svelte`, `atelier/Postes.svelte`, `atelier/Relier.svelte`, `atelier/Depenses.svelte`, `atelier/ModeleCle.svelte`, `atelier/Routines.svelte`, `atelier/Appareils.svelte` | Atelier and its themes |
| `lieux/Fiche.svelte`, `lieux/MiseEnRoute.svelte`, `lieux/Appareil.svelte` | Natsume's fiche, first launch, unknown browser |
| `testing/Host.svelte`, `testing/monde-neutre.ts` | test host with the contexts, the neutral world |
| `copy.test.ts` | the copy and colour guard |

Deleted in Task 31: `carte/` (all), `screens/` (all), `shell/Postes.svelte`, `shell/icons.ts`, `cards/` (all), `natsume/Panneau.svelte`, `Pair.svelte`, `testing/CardHost.svelte`, `testing/CarteHost.svelte`, and their tests.

---

### Task 1: The `--anima` token

**Files:**
- Modify: `lun-docs/design/tokens.css` (`:root`, `@monde anima`, new `@monde neutre`)
- Regenerate: `lun-anima/ui/src/lib/tokens.css`, `lun-anima/core/src/tokens.css`
- Modify: `lun-anima/ui/vite.config.ts` (manifest `theme_color`)
- Test: `lun-anima/ui/src/tokens.test.ts`

**Interfaces:**
- Produces CSS custom properties: `--anima #6B2D4F`, `--anima-survol #7C3A5E`, `--anima-doux rgba(107,45,79,.26)`, `--anima-bord rgba(214,170,196,.34)`, `--anima-texte #E2C3D3`, `--marque rgba(240,235,225,.78)`, `--marque-doux rgba(240,235,225,.22)`, `--cadre-focus` (prototype value), all in `:root`; `[data-monde='anima']` maps `--accent*` to them; `[data-monde='neutre']` (prototype values) for posts to link and the neutral world.

- [ ] **Step 0: Branch**

Run: `git switch feat/core-caps-pause && git switch -c feat/ui-natsume-centre && git -C ../lun-docs switch feat/kit-natsume-centre` (from `lun-anima`, like every command of this plan)
Expected: `Switched to a new branch 'feat/ui-natsume-centre'`

- [ ] **Step 1: Write the failing test**

```ts
// ui/src/tokens.test.ts — reads lib/tokens.css with node:fs (// @vitest-environment node)
it('Anima has its own accent, apart from the danger fill', () => {
  expect(css).toMatch(/--anima:#6B2D4F;/);
  expect(css).toMatch(/--danger-plein:#7A1818;/);
  expect(block('anima')).toMatch(/--accent:var\(--anima\);/);
  expect(block('anima')).toMatch(/--accent-texte:var\(--anima-texte\);/);
});
it('has the ivory marks and a neutral world', () => {
  expect(css).toMatch(/--marque:rgba\(240,235,225,\.78\);/);
  expect(block('neutre')).toMatch(/--accent:#3A342D;/);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run --project ui ui/src/tokens.test.ts`
Expected: FAIL (`--anima` absent)

- [ ] **Step 3: Implement**

In `lun-docs/design/tokens.css`: add the `--anima*`, `--marque*`, `--cadre-focus` lines to `:root` with the prototype's comments (« accent d'Anima, distinct du rouge destructif »; « marques du monde : ivoire atténué »); replace the anima block body with the prototype's line 26 and its comment; add a `/* @monde neutre */ … /* @fin-monde */` block with line 28 of `carnet.css`. Then regenerate:
`node ../lun-docs/tools/sync-tokens.mjs ui/src/lib/tokens.css` and `node ../lun-docs/tools/sync-tokens.mjs --monde anima core/src/tokens.css` (from `lun-anima`). Set `theme_color: '#6B2D4F'` in `ui/vite.config.ts` (ruling 20).

- [ ] **Step 4: Run to verify it passes, and the token sync check**

Run: `npx vitest run --project ui ui/src/tokens.test.ts && node ../lun-docs/tools/sync-tokens.mjs --check ui/src/lib/tokens.css && node ../lun-docs/tools/sync-tokens.mjs --check --monde anima core/src/tokens.css`
Expected: PASS, `tokens: OK` twice

- [ ] **Step 5: Commit both repos** (lun-docs on `feat/kit-natsume-centre`)

```bash
git -C ../lun-docs add design/tokens.css
git -C ../lun-docs commit -m "feat(design): --anima accent, ivory marks and a neutral world" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git add ui/src/lib/tokens.css core/src/tokens.css ui/vite.config.ts ui/src/tokens.test.ts
git commit -m "feat(ui): --anima token, apart from the danger fill" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Formats of §3

**Files:**
- Modify: `ui/src/time.ts` (add functions; `hourOf`, `dayTitle` stay until Task 31)
- Test: `ui/src/time.test.ts` (create)

**Interfaces:**
- Produces (`ui/src/time.ts`), Paris time:
  - `heure(iso: string): string` → `'14:20'`
  - `dateLongue(day: string): string` → `'lundi 2 novembre'`, `'dimanche 1er novembre'` (lower case)
  - `quand(iso: string, now: Date): string` → `'14:10'` today, `'hier, 14:10'`, else `'lundi 2 novembre, 14:10'`
  - `jourTitre(day: string, now: Date): string` → `'Aujourd'hui'`, `'Hier'`, else `dateLongue(day)` (a heading, so `Aujourd'hui` and `Hier` are capitalised; dates stay lower case)
  - `natsumeDay(at: Date): string` → the Paris civil day of `at - 5 h` (Natsume's day cuts at 05:00)
  - `dollars(n: number): string` → `'0,42 $'`, `'0,00 $'` for 0, `'moins de 0,01 $'` for `0 < n < 0.005`
  - `depuis(iso: string, now: Date): string` → `'depuis 14:16'` today, `'depuis hier, 14:16'` otherwise (built on `quand`)

- [ ] **Step 1: Write the failing tests**

```ts
it('hours are 14:20, Paris time', () => expect(heure('2026-11-02T13:20:00.000Z')).toBe('14:20'));
it('dates are lower case, with 1er', () => {
  expect(dateLongue('2026-11-02')).toBe('lundi 2 novembre');
  expect(dateLongue('2026-11-01')).toBe('dimanche 1er novembre');
});
it('quand says today, yesterday or the date', () => {
  const now = new Date('2026-11-02T13:20:00.000Z');
  expect(quand('2026-11-02T09:10:00.000Z', now)).toBe('10:10');
  expect(quand('2026-11-01T17:10:00.000Z', now)).toBe('hier, 18:10');
  expect(quand('2026-10-30T17:10:00.000Z', now)).toBe('vendredi 30 octobre, 18:10');
});
it('day headings', () => {
  const now = new Date('2026-11-02T13:20:00.000Z');
  expect(jourTitre('2026-11-02', now)).toBe('Aujourd’hui');
  expect(jourTitre('2026-11-01', now)).toBe('Hier');
  expect(jourTitre('2026-10-30', now)).toBe('vendredi 30 octobre');
});
it("Natsume's day starts at 05:00", () => {
  expect(natsumeDay(new Date('2026-11-02T03:59:00.000Z'))).toBe('2026-11-01'); // 04:59 Paris
  expect(natsumeDay(new Date('2026-11-02T04:00:00.000Z'))).toBe('2026-11-02');
});
it('amounts in dollars, two decimals', () => {
  expect(dollars(0.42)).toBe('0,42 $');
  expect(dollars(3)).toBe('3,00 $');
  expect(dollars(0)).toBe('0,00 $');
  expect(dollars(0.004)).toBe('moins de 0,01 $');
});
```

(Use the typographic apostrophe `’` in copy only where the existing code already does; `Aujourd’hui` follows `posts.ts`.)

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run --project ui ui/src/time.test.ts`
Expected: FAIL (functions not exported)

- [ ] **Step 3: Implement** the functions with `Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris' })` and `Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })`; the narrow no-break space Intl puts before `$` is replaced by a plain space only if the formatter emits one (format the number alone and append `' $'`).

- [ ] **Step 4: Run to verify they pass**

Run: `npx vitest run --project ui ui/src/time.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add ui/src/time.ts ui/src/time.test.ts
git commit -m "feat(ui): fixed formats for hours, dates and dollars" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: World data

**Files:**
- Create: `ui/src/monde.ts`, `ui/src/testing/monde-neutre.ts`
- Modify: `ui/src/posts.ts` (`roleOf` reads `monde.ts`; `ROLES` removed)
- Test: `ui/src/monde.test.ts`

**Interfaces:**
- Produces (`ui/src/monde.ts`):

```ts
export type LieuId = 'bureau' | 'trancher' | 'constellation' | 'journal' | 'atelier' | 'natsume';
export interface World { id: string; name: string; role?: string; place: { x: number; y: number } } // place in % of the sky
export interface Monde { lieux: Record<LieuId, string>; worlds: World[]; natsume: string }
export const MONDE: Monde;               // the real world
export const satelliteOf = (world: string): string => `lun${world}`;
export function worldData(monde: Monde, world: string): World | undefined;
```

`MONDE.lieux`: Bureau, À trancher, Constellation, Journal, Atelier, Natsume. `MONDE.worlds` in heptagram order, clockwise from the top, with the prototype polygon: ira (50, 12), avaritia (78.1, 26.3), gula (85.1, 58.5), superbia (65.6, 84.2), luxuria (34.4, 84.2), invidia (14.9, 58.5), acedia (21.9, 26.3); names `Lun'Ira` … from `nameOf`; roles: avaritia « Le cerveau », acedia « Mail, agenda, tâches » (the others none). `MONDE.natsume = 'Natsume'`. Natsume's star sits at (50, 50).
- `testing/monde-neutre.ts`: `MONDE_NEUTRE: Monde` with lieux « Accueil », « À faire », « Carte », « Historique », « Réglages », « Assistante », three worlds `a`, `b`, `c` at other places, `natsume: 'Assistante'`.

- [ ] **Step 1: Write the failing tests**

```ts
it('lists the seven worlds in heptagram order, as the core does', () => {
  expect(MONDE.worlds.map((w) => satelliteOf(w.id))).toEqual(
    ['lunira', 'lunavaritia', 'lungula', 'lunsuperbia', 'lunluxuria', 'luninvidia', 'lunacedia']);
});
it('every world has a place inside the sky', () => {
  for (const w of MONDE.worlds) expect(w.place.x > 0 && w.place.x < 100 && w.place.y > 0 && w.place.y < 100).toBe(true);
});
it('roles come from the world data', () => expect(roleOf('lunavaritia')).toBe('Le cerveau'));
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run --project ui ui/src/monde.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement** `monde.ts`, `monde-neutre.ts`, and `roleOf(id)` = `worldData(MONDE, worldOf(id))?.role`. Keep `roleOf`'s signature (callers unchanged).

- [ ] **Step 4: Run to verify they pass**

Run: `npx vitest run --project ui ui/src/monde.test.ts ui/src/posts.test.ts`
Expected: PASS (update the one `posts.test.ts` expectation for `lunavaritia` to « Le cerveau » if it checks it)

- [ ] **Step 5: Commit**

```bash
git add ui/src/monde.ts ui/src/monde.test.ts ui/src/testing/monde-neutre.ts ui/src/posts.ts ui/src/posts.test.ts
git commit -m "feat(ui): one world data for places and the heptagram" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: The address tree and the navigation store

**Files:**
- Modify: `ui/src/shell/routes.ts` (rewritten; old exports `Route`, `ROUTES`, `pathOf`, `routeFromPath` stay as they are until Task 29 removes them)
- Create: `ui/src/shell/nav.svelte.ts`
- Test: `ui/src/shell/routes.test.ts` (add a `describe('address tree')`)

**Interfaces:**
- Produces (`ui/src/shell/routes.ts`):

```ts
export type Periode = 'auj' | '7j' | 'tout';
export type JournalType = 'urgence' | 'carte' | 'confie' | 'routine';
export type Theme = 'postes' | 'depenses' | 'modele' | 'routines' | 'appareils' | 'notifications' | 'clavier';
export const THEMES: Theme[];
export type Lieu =
  | { place: 'bureau' | 'trancher'; carte?: { world: string; id: string }; poste?: string; depuis?: 'constellation' }
  | { place: 'constellation'; poste?: string /* world id or 'natsume' */ }
  | { place: 'journal'; n?: number; periode: Periode; poste?: string; type?: JournalType; q?: string }
  | { place: 'atelier'; theme: Theme; relier?: boolean; ajout?: boolean; reglage?: string /* fragment */ }
  | { place: 'natsume' } | { place: 'mise-en-route' } | { place: 'appareil'; revoque?: boolean };
export function parseAddress(url: URL, phone: boolean): { lieu: Lieu; redirect?: string };
export function hrefOf(lieu: Lieu): string; // canonical address, default params left out
```

- Rules: unknown paths → Bureau with `redirect: '/app/'`; `/app/valider` → `/app/trancher` (with query); `/app/ecosysteme?theme=x` → `/app/atelier/x` (old slug `cle` → `modele`), else `/app/atelier/postes`; `/app/atelier` → `/app/atelier/postes`; on a desktop `/app/trancher?…` → `/app/?…`; `?carte=avaritia:<id>` splits at the first `:`; `periode` defaults to `7j` and `hrefOf` leaves it out; an unknown `periode`, `type` or `theme` falls back to its default with a `redirect`.
- Produces (`ui/src/shell/nav.svelte.ts`): `class Nav { lieu: Lieu; phone: boolean; constructor(phone: () => boolean); go(href: string, opts?: { replace?: boolean }): void; back(): void }` — `go` pushes (or replaces) history, re-parses, applies a `redirect` with `replaceState`; listens to `popstate`. Context key `'nav'`.

- [ ] **Step 1: Write the failing tests**

```ts
const p = (path: string, phone = false) => parseAddress(new URL(path, 'http://x'), phone);
it.each([
  ['/app/', { place: 'bureau' }],
  ['/app/?carte=avaritia:c-1', { place: 'bureau', carte: { world: 'avaritia', id: 'c-1' } }],
  ['/app/?poste=acedia&depuis=constellation', { place: 'bureau', poste: 'acedia', depuis: 'constellation' }],
  ['/app/constellation/acedia', { place: 'constellation', poste: 'acedia' }],
  ['/app/journal?periode=auj&poste=acedia&type=confie&q=paul', { place: 'journal', periode: 'auj', poste: 'acedia', type: 'confie', q: 'paul' }],
  ['/app/journal/1284', { place: 'journal', n: 1284, periode: '7j' }],
  ['/app/atelier/postes/relier', { place: 'atelier', theme: 'postes', relier: true }],
  ['/app/atelier/appareils?ajout=1', { place: 'atelier', theme: 'appareils', ajout: true }],
  ['/app/atelier/depenses#plafond-jour', { place: 'atelier', theme: 'depenses', reglage: 'plafond-jour' }],
  ['/app/appareil?revoque', { place: 'appareil', revoque: true }],
])('%s', (path, lieu) => expect(p(path).lieu).toEqual(lieu));
it('old addresses lead to the new ones', () => {
  expect(p('/app/valider', true).redirect).toBe('/app/trancher');
  expect(p('/app/ecosysteme?theme=cle').redirect).toBe('/app/atelier/modele');
  expect(p('/app/atelier').redirect).toBe('/app/atelier/postes');
});
it('À trancher is the Bureau on a desktop, its own tab on a phone', () => {
  expect(p('/app/trancher?poste=acedia').redirect).toBe('/app/?poste=acedia');
  expect(p('/app/trancher', true)).toEqual({ lieu: { place: 'trancher' } });
});
it('hrefOf gives back the address, without defaults', () => {
  expect(hrefOf({ place: 'journal', periode: '7j' })).toBe('/app/journal');
  expect(hrefOf({ place: 'journal', periode: 'auj', q: 'paul' })).toBe('/app/journal?periode=auj&q=paul');
});
it('Nav follows the back button', () => { /* go('/app/journal'), go('/app/atelier/postes'), history.back() → popstate → lieu.place === 'journal' */ });
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run --project ui ui/src/shell/routes.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement** `parseAddress`, `hrefOf`, `Nav`.

- [ ] **Step 4: Run to verify they pass**

Run: `npx vitest run --project ui ui/src/shell/routes.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add ui/src/shell/routes.ts ui/src/shell/nav.svelte.ts ui/src/shell/routes.test.ts
git commit -m "feat(ui): the address tree of the places" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: The key table and the Escape layers

**Files:**
- Create: `ui/src/shell/touches.ts`, `ui/src/shell/couches.ts`
- Test: `ui/src/shell/touches.test.ts`

**Interfaces:**
- Produces (`ui/src/shell/touches.ts`):

```ts
export type Action = 'palette' | 'conversation' | 'echap' | 'suivant' | 'precedent' | 'valider' | 'refuser' | 'annuler'
  | 'tab' | 'ouvrir' | 'theme-suivant' | 'theme-precedent' | 'chercher';
export interface Touche { action: Action; combo: string /* kit form, '' for Tab */; affiche: string; ou: 'Partout' | 'À trancher' | 'Ailleurs'; effet: string }
export const TOUCHES: Touche[]; // the §4.9 table, one row per key, in its order
export function comboOf(action: Action): string;
export function bindPlaceKeys(handlers: Partial<Record<Action, () => void>>, target?: EventTarget): () => void;
```

Rows (`affiche` / `ou` / `effet`, French, verbatim from §4.9): Ctrl K / Partout / palette; E / Partout / « ouvre la conversation et met le focus dans le champ »; Échap / Partout / « ferme la couche du dessus, une par appui »; Flèches haut et bas / À trancher / « carte, entrée ou option suivante ou précédente »; V / À trancher / « Valider, ou Vu pour une urgence »; R / À trancher / Refuser; Ctrl Z / Partout / « Annuler le dernier geste encore tenu »; Tab / Partout / « ordre naturel »; Entrée / Ailleurs / « ouvre le détail »; Flèches gauche et droite / Ailleurs / « thème suivant ou précédent »; Ctrl F / Ailleurs / « met le focus dans la recherche du Journal ». `bindPlaceKeys` wraps the kit `bindShortcuts`, with `fromFields: [comboOf('palette')]` only. Ctrl Z is listed but bound by the kit Toaster (slice 4), not here.
- Produces (`ui/src/shell/couches.ts`):

```ts
export type Couche = 'lot' | 'feuille' | 'detail' | 'champ';
export function pushCouche(kind: Couche, close: () => void): () => void; // returns the remover
export function installEchap(target?: EventTarget): () => void;          // one keydown listener
```

Escape closes the open layer of highest rank (`lot` > `feuille` > `detail` > `champ`), one per press; does nothing while an `[aria-modal="true"]` element is in the document (Bits UI handles its own, ruling 18); never changes place.

- [ ] **Step 1: Write the failing tests**

```ts
it('no key needs Shift, Alt or AltGr', () => {
  for (const t of TOUCHES) expect(t.combo).not.toMatch(/Shift|Alt/);
});
it('E does nothing from a field, Ctrl K works from one', async () => {
  const conv = vi.fn(), pal = vi.fn();
  bindPlaceKeys({ conversation: conv, palette: pal });
  document.body.innerHTML = '<textarea></textarea>';
  const field = document.querySelector('textarea')!;
  field.focus();
  await userEvent.keyboard('e{Control>}k{/Control}');
  expect(conv).not.toHaveBeenCalled();
  expect(pal).toHaveBeenCalledOnce();
});
it('Escape closes one layer per press, the highest first', async () => {
  installEchap();
  const closed: string[] = [];
  pushCouche('champ', () => closed.push('champ'));
  pushCouche('detail', () => closed.push('detail'));
  pushCouche('lot', () => closed.push('lot'));
  await userEvent.keyboard('{Escape}{Escape}');
  expect(closed).toEqual(['lot', 'detail']);
});
it('Escape leaves a modal dialog to itself', async () => { /* aria-modal div present → no close */ });
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run --project ui ui/src/shell/touches.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement** both modules. A remover is idempotent; `installEchap` calls `preventDefault` only when it closed something.

- [ ] **Step 4: Run to verify they pass**

Run: `npx vitest run --project ui ui/src/shell/touches.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add ui/src/shell/touches.ts ui/src/shell/couches.ts ui/src/shell/touches.test.ts
git commit -m "feat(ui): one key table and the Escape layers" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: The state store, Natsume's state word and the band texts

**Files:**
- Modify: `ui/src/types.ts` (slice 2 types, plus slice 3–5 types from « Interfaces consumed »; `Card` gains `kind?`, `reason?`, `sends?: true`, `options?: string[]`)
- Create: `ui/src/etat.svelte.ts`, `ui/src/shell/bande.ts`
- Modify: `ui/src/testing/core.ts` (builders and defaults)
- Create: `ui/src/testing/Host.svelte`
- Test: `ui/src/etat.test.ts`, `ui/src/shell/bande.test.ts`

**Interfaces:**
- Consumes: `GET /api/state` (slice 2, with slice 5's `pause`, `plafond` and `pause` bands); `heure`, `depuis`, `dollars`, `dateLongue` (Task 2); `nameOf` (`posts.ts`).
- Produces (`ui/src/etat.svelte.ts`), context key `'etat'`:

```ts
export class Etat {
  state: CoreState | null;          // last snapshot, memory only
  readAt: Date | null;              // time of that snapshot
  downSince: Date | null;           // first failure after a success (ruling 10)
  get readOnly(): boolean;          // downSince !== null
  constructor(api: Api, clock?: () => Date);
  read(): Promise<void>;            // never throws
  start(): () => void;              // read now, then every 30 s while visible; returns stop
}
export type NatsumeWord = { kind: NatsumeKind | 'injoignable'; text: string };
export function natsumeWord(e: Pick<Etat, 'state' | 'downSince'>, asking: boolean, now: Date): NatsumeWord;
export function queueCount(state: CoreState): { total: number; staleAt?: string }; // ruling 8
```

`natsumeWord` texts (§4.4): « Disponible », « Réfléchit » (when `asking` or `kind === 'reflechit'`), « En pause depuis 14:15 », « En pause jusqu'à 05:00 » / « En pause jusqu'au 1er décembre » (cap pauses), « Clé refusée », « En attente de la clé », « Injoignable depuis 14:16 ».
- Produces (`ui/src/shell/bande.ts`): `export interface BandeView { tone: 'err' | 'att' | 'info' | 'neutre'; text: string; action?: { label: string; href?: string; run?: 'retry' | 'resume' } }` and `bandeOf(e: Pick<Etat, 'state' | 'downSince' | 'readAt'>, now: Date): BandeView | undefined`. Texts are §4.3's table verbatim, with times and amounts from the state; Natsume unreachable (UI-side) first; buttons: Réessayer (`run: 'retry'`), « Modèle et clé » (`/app/atelier/modele`), « Relever le plafond » (`/app/atelier/depenses#plafond-jour` or `#plafond-mois`), Reprendre (`run: 'resume'`), « Voir le poste » (`/app/constellation/<world>`), none for mise en route. Muet text by reason: `pause-locale` → « … est en pause dans ses propres réglages. Ses cartes sont en lecture seule. », `contrat` → « … doit être mis à jour pour que ses cartes arrivent ici. ». « Prévenir seulement » (a `plafond` band without `until`): first sentence only.
- Produces (`ui/src/testing/core.ts`): `coreState(over?: Partial<CoreState>): CoreState`, `queue(over?: Partial<Queue>): Queue`, `upcoming(over?)`, `word(place, over?)`, `postDetail(id, over?)`, `journalPage(over?)`; `fakeCore` defaults gain `'GET /state'`, `'GET /queue'`, `'GET /upcoming'`, `'GET /word'`, `'GET /satellites'`.
- Produces (`ui/src/testing/Host.svelte`): props `{ component: Component; props?: Record<string, unknown>; phone?: boolean; monde?: Monde; state?: CoreState }`; sets contexts `api` (`createApi('tok')`), `etat`, `file`, `nav`, `monde`, `conversation`, `fil`, `posts` with real stores over `fakeCore`, renders the component and the kit `Toaster`. Later tasks add their stores to it as they are created (`file` in Task 15, `conversation`/`fil` in Task 9/11).

- [ ] **Step 1: Write the failing tests**

```ts
// etat.test.ts
it('reads the state and says Disponible', async () => {
  fakeCore({ 'GET /state': json(coreState()) });
  const e = new Etat(createApi('tok')); await e.read();
  expect(natsumeWord(e, false, NOW)).toEqual({ kind: 'disponible', text: 'Disponible' });
});
it('a failed read after a success keeps the snapshot and turns read-only', async () => {
  const f = fakeCore({ 'GET /state': json(coreState()) });
  const e = new Etat(createApi('tok'), () => NOW); await e.read();
  f.mockRejectedValue(new TypeError('Failed to fetch')); await e.read();
  expect(e.state).not.toBeNull();
  expect(e.readOnly).toBe(true);
  expect(natsumeWord(e, false, NOW).text).toBe('Injoignable depuis 14:16');
});
it('a reload during the outage has no snapshot', async () => { /* first read fails → state null, readOnly true */ });
it('pause words', () => {
  expect(natsumeWord({ state: coreState({ natsume: { kind: 'pause', since: '2026-11-02T13:15:00.000Z' } }), downSince: null }, false, NOW).text).toBe('En pause depuis 14:15');
  expect(natsumeWord({ state: coreState({ natsume: { kind: 'pause', since: S, until: '2026-12-01T04:00:00.000Z' } }), downSince: null }, false, NOW).text).toBe('En pause jusqu’au 1er décembre');
});
it('the counter says when a stale read dates from', () => {
  expect(queueCount(coreState({ queue: { total: 13, urgent: 1, posts: { lunacedia: { count: 3, urgent: 1, stale: true, readAt: '2026-11-02T13:11:00.000Z' } } } }))).toEqual({ total: 13, staleAt: '2026-11-02T13:11:00.000Z' });
});
// bande.test.ts
it('Natsume unreachable wins, with both times', () => {
  expect(bandeOf({ state: coreState(), readAt: new Date('2026-11-02T13:15:00Z'), downSince: new Date('2026-11-02T13:16:00Z') }, NOW))
    .toEqual({ tone: 'err', text: 'Natsume ne répond pas depuis 14:16. Ce que tu vois date de 14:15, en lecture seule.', action: { label: 'Réessayer', run: 'retry' } });
});
it.each([
  [{ kind: 'cle-refusee' }, 'Clé refusée à 14:10. Natsume ne peut plus répondre ni rien confier.', 'Modèle et clé'],
  [{ kind: 'plafond', scope: 'jour', spent: 3, cap: 3, until: '2026-11-03T04:00:00.000Z' }, 'Plafond du jour atteint : 3,00 $ sur 3,00 $. Natsume est en pause jusqu’à 05:00, sauf les urgences.', 'Relever le plafond'],
  [{ kind: 'pause', since: '2026-11-02T13:15:00.000Z' }, 'Natsume est en pause depuis 14:15. Rien d’automatique ne tourne, sauf les urgences ; tu peux toujours lui écrire.', 'Reprendre'],
  [{ kind: 'poste-injoignable', post: 'lunacedia', since: '2026-11-02T13:12:00.000Z' }, 'Lun'Acedia ne répond pas depuis 14:12. Ses cartes sont en lecture seule ; nouvel essai automatique.', 'Voir le poste'],
  [{ kind: 'poste-muet', post: 'lunacedia', reason: 'contrat' }, 'Lun'Acedia doit être mis à jour pour que ses cartes arrivent ici.', 'Voir le poste'],
  [{ kind: 'mise-en-route' }, 'Rien ne tourne encore : la mise en route n’est pas finie.', undefined],
])('band %o', (band, text, label) => { /* bandeOf(...).text === text, action?.label === label */ });
it('no band when all is well', () => expect(bandeOf({ state: coreState(), readAt: NOW, downSince: null }, NOW)).toBeUndefined());
it('« Prévenir seulement » keeps the first sentence', () => { /* plafond band without until → 'Plafond du jour atteint : 3,00 $ sur 3,00 $.' */ });
```

Apostrophes (ruling 21): post names keep the straight `'` that `nameOf` gives (`Lun'Acedia`); every other apostrophe in fixed copy is the typographic `’`, as the existing app writes it (`n’est`, `Aujourd’hui`). Tests write strings the same way.

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run --project ui ui/src/etat.test.ts ui/src/shell/bande.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement** types, `Etat`, `natsumeWord`, `queueCount`, `bandeOf`, the fixtures and `Host.svelte`. The band of a post (`poste-injoignable`, `poste-muet`) is never shown while `state.pause` is set (§4.3; the core may already drop it, the UI drops it too).

- [ ] **Step 4: Validate the component and run the tests**

Run: `npx @sveltejs/mcp svelte-autofixer ui/src/testing/Host.svelte && npx vitest run --project ui ui/src/etat.test.ts ui/src/shell/bande.test.ts`
Expected: no issue; PASS

- [ ] **Step 5: Commit**

```bash
git add ui/src/types.ts ui/src/etat.svelte.ts ui/src/etat.test.ts ui/src/shell/bande.ts ui/src/shell/bande.test.ts ui/src/testing/core.ts ui/src/testing/Host.svelte
git commit -m "feat(ui): one state store, Natsume's state word and the band texts" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: The menu of places and the presences

**Files:**
- Create: `ui/src/shell/Menu.svelte`, `ui/src/shell/Presences.svelte`
- Test: `ui/src/shell/Menu.test.ts`

**Interfaces:**
- Consumes: `Etat`, `queueCount`, `natsumeWord` (Task 6); `Nav`, `hrefOf` (Task 4); `Monde` (Task 3); `heure`.
- Produces: `Menu.svelte` (props: `onpalette: () => void`); `Presences.svelte` (props: `forme: 'menu' | 'pastilles'`) — `pastilles` is the phone Bureau's wrapping row (Task 18), which adds « Relier un poste » when a known world is `a-relier`; `presenceLine(view: PostView, q?: { count: number; urgent: number }): string` exported from `Presences.svelte`'s module script (ruling 9; unreachable: « Ne répond pas depuis 14:12 », muet: « En pause dans ses réglages » or « À mettre à jour », inconnu: « Inconnu »).

Menu content (§4.2): the seal and « Lun'Anima » linking to `/app/`; Bureau, Constellation, Journal, Atelier in Cormorant from `monde.lieux`, the active one marked by the ivory thread (`--marque`) with `aria-current="page"`; Bureau carries the counter in neutral (« 13 » or « 13, lu à 14:11 »), nothing at 0; presences of posts not `a-relier` (world dot via `data-monde`, name, line), each a link to `/app/constellation/<world>`; none: « Aucun poste relié » linking to `/app/atelier/postes/relier`; footer button « Chercher » with `<Kbd>Ctrl K</Kbd>` calling `onpalette`. No Natsume entry. Background per prototype `.menu` (`--anima-doux` gradient).

- [ ] **Step 1: Write the failing tests**

```ts
it('lists the four places, the fiche of Natsume is not one', async () => {
  renderHost(Menu, { state: coreState() });
  expect(screen.getAllByRole('link').map((l) => l.textContent?.trim())).toEqual(expect.arrayContaining(['Bureau', 'Constellation', 'Journal', 'Atelier']));
  expect(screen.queryByRole('link', { name: /Natsume/ })).toBeNull();
});
it('the Bureau carries the counter, with the read time when stale', () => {
  // queue.total 13, lunacedia stale readAt 13:11Z
  expect(screen.getByRole('link', { name: /Bureau/ })).toHaveTextContent('13, lu à 14:11');
});
it('a presence says what waits and opens the post in the Constellation', () => {
  expect(screen.getByRole('link', { name: /Lun'Acedia/ })).toHaveTextContent('1 urgence + 2');
  expect(screen.getByRole('link', { name: /Lun'Acedia/ })).toHaveAttribute('href', '/app/constellation/acedia');
});
it('a post to link is not a presence; none linked says so', () => {
  // posts: lunira a-relier only
  expect(screen.getByRole('link', { name: 'Aucun poste relié' })).toHaveAttribute('href', '/app/atelier/postes/relier');
});
it.each([[{ count: 2, urgent: 0 }, '2'], [{ count: 0, urgent: 2 }, '2 urgences'], [{ count: 0, urgent: 0 }, '']])('presenceLine %o', (q, text) => {
  expect(presenceLine({ id: 'lunacedia', state: 'relie' }, q)).toBe(text);
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run --project ui ui/src/shell/Menu.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement** both components with kit `NavLink` where it fits (it already renders an icon; the menu has none, so use plain `<a>` styled with tokens if `NavLink` forces an icon).

- [ ] **Step 4: Validate and run**

Run: `npx @sveltejs/mcp svelte-autofixer ui/src/shell/Menu.svelte && npx @sveltejs/mcp svelte-autofixer ui/src/shell/Presences.svelte && npx vitest run --project ui ui/src/shell/Menu.test.ts`
Expected: no issue; PASS

- [ ] **Step 5: Commit**

```bash
git add ui/src/shell/Menu.svelte ui/src/shell/Presences.svelte ui/src/shell/Menu.test.ts
git commit -m "feat(ui): menu of places with the queue counter and presences" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: The state band

**Files:**
- Create: `ui/src/shell/Bande.svelte`
- Test: `ui/src/shell/Bande.test.ts`

**Interfaces:**
- Consumes: `bandeOf`, `BandeView` (Task 6); `Etat.read`; `POST /api/resume` (slice 5); `Nav.go`.
- Produces: `Bande.svelte` (no props; reads contexts). Full-width row: tone dot, text, one button (`Button variant="doux" size="petit"`); `role="status"`; renders nothing when `bandeOf` is undefined; sets `--bande-h` on `document.documentElement` from its measured height (0 when absent) for the detail panel's top. Reprendre calls `POST /api/resume`, toasts « Natsume reprend. », then `etat.read()`.

- [ ] **Step 1: Write the failing tests**

```ts
it('shows nothing when all is well', () => { renderHost(Bande, { state: coreState() }); expect(screen.queryByRole('status')).toBeNull(); });
it('Reprendre lifts the pause and says so', async () => {
  const f = fakeCore({ 'GET /state': json(coreState({ pause: { since: S, by: 'manuel' }, band: { kind: 'pause' } })), 'POST /resume': json({}) });
  renderHost(Bande);
  await userEvent.click(await screen.findByRole('button', { name: 'Reprendre' }));
  expect(f).toHaveBeenCalledWith('/api/resume', expect.objectContaining({ method: 'POST' }));
  expect(await screen.findByText('Natsume reprend.')).toBeInTheDocument();
});
it('Voir le poste leads to its panel', async () => { /* poste-injoignable → click → location.pathname === '/app/constellation/acedia' */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/shell/Bande.test.ts` — FAIL
- [ ] **Step 3: Implement** `Bande.svelte`.
- [ ] **Step 4: Validate and run** — `npx @sveltejs/mcp svelte-autofixer ui/src/shell/Bande.svelte && npx vitest run --project ui ui/src/shell/Bande.test.ts` — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/shell/Bande.svelte ui/src/shell/Bande.test.ts
git commit -m "feat(ui): one state band, the gravest first" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: The conversation panel model

**Files:**
- Create: `ui/src/natsume/panneau.svelte.ts`
- Test: `ui/src/natsume/panneau.test.ts`

**Interfaces:**
- Produces (context key `'conversation'`):

```ts
export type EtatConv = 'range' | 'ouvert' | 'agrandi';
export const PAS = 24;            // keyboard step, px
export const FIL_MIN = 160;       // the thread keeps at least this
export const MOT_MIN = 120;       // this much of the word stays visible outside « agrandi »
export const DEFAUT = 0.45;       // share of the column body
export class PanneauConv {
  etat: EtatConv;
  hauteur: number | null;          // last partial height kept, px; null = default
  corps: number;                   // height of the column body (under the head), set by the column
  constructor(storage?: Storage);  // reads `lunanima.conversation`
  readonly hauteurAffichee: number;  // range: 0 (the thin bar is outside this); agrandi: corps; ouvert: clamp(hauteur ?? DEFAUT * corps)
  ouvrir(): void;                  // from range: ouvert at the kept height; never agrandi
  agrandir(): void; restaurer(): void; ranger(): void;
  redimensionner(px: number): void; // sets a partial height, clamped; from agrandi goes to ouvert
  pas(sens: 1 | -1): void;          // ± PAS
  defaut(): void;                   // double-click: hauteur = null
}
export function borne(h: number, corps: number): number; // clamp to [FIL_MIN, corps - MOT_MIN]; if that range is empty, FIL_MIN
```

Stored as JSON `{ etat, hauteur }` under `lunanima.conversation`, written on every change; every storage access in try/catch; a stored value that is not an object, an unknown `etat`, or a `hauteur` not a finite positive number gives the defaults (`range`, `null`).

- [ ] **Step 1: Write the failing tests**

```ts
it('opens at the default height, about 45 % of the body', () => {
  const p = new PanneauConv(memory()); p.corps = 800; p.ouvrir();
  expect(p.etat).toBe('ouvert'); expect(p.hauteurAffichee).toBe(360);
});
it('opening from « rangé » takes the last partial height, never « agrandi »', () => {
  const p = new PanneauConv(memory()); p.corps = 800;
  p.redimensionner(300); p.agrandir(); p.ranger(); p.ouvrir();
  expect(p.etat).toBe('ouvert'); expect(p.hauteurAffichee).toBe(300);
});
it('keeps the thread at 160 px and 120 px of the word', () => {
  const p = new PanneauConv(memory()); p.corps = 800;
  p.redimensionner(40); expect(p.hauteurAffichee).toBe(160);
  p.redimensionner(790); expect(p.hauteurAffichee).toBe(680);
});
it('a kept height that no longer fits is clamped to the new body', () => {
  const s = memory({ 'lunanima.conversation': JSON.stringify({ etat: 'ouvert', hauteur: 700 }) });
  const p = new PanneauConv(s); p.corps = 500;
  expect(p.hauteurAffichee).toBe(380);
});
it.each(['nope', '{"etat":"x"}', '{"etat":"ouvert","hauteur":-4}', 'null'])('a corrupt stored value %s gives the defaults', (v) => {
  const p = new PanneauConv(memory({ 'lunanima.conversation': v }));
  expect([p.etat, p.hauteur]).toEqual(['range', null]);
});
it('storage that throws leaves the panel working', () => {
  const p = new PanneauConv(throwing()); p.corps = 800; p.ouvrir(); expect(p.etat).toBe('ouvert');
});
it('remembers state and height for the next load', () => {
  const s = memory(); const p = new PanneauConv(s); p.corps = 800; p.redimensionner(300);
  expect(new PanneauConv(s)).toMatchObject({ etat: 'ouvert', hauteur: 300 });
});
it('arrows move by 24 px, double-click goes back to the default', () => {
  const p = new PanneauConv(memory()); p.corps = 800; p.ouvrir(); p.pas(1);
  expect(p.hauteurAffichee).toBe(384); p.defaut(); expect(p.hauteurAffichee).toBe(360);
});
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/natsume/panneau.test.ts` — FAIL
- [ ] **Step 3: Implement** `PanneauConv` and `borne`.
- [ ] **Step 4: Run to verify they pass** — same command — PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/natsume/panneau.svelte.ts ui/src/natsume/panneau.test.ts
git commit -m "feat(ui): conversation panel states, bounds and memory" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Natsume's column

**Files:**
- Create: `ui/src/natsume/Colonne.svelte`
- Test: `ui/src/natsume/Colonne.test.ts`

**Interfaces:**
- Consumes: `PanneauConv` (Task 9), `natsumeWord`, `Etat` (Task 6), `pushCouche` (Task 5), `bindPlaceKeys` (`conversation` action), `POST /api/pause` / `POST /api/resume` (slice 5).
- Produces: `Colonne.svelte` props `{ mot: Snippet; conversation: Snippet<[{ etat: EtatConv }]>; champ: Snippet }` — the column draws the head, the word area and the panel frame; the content snippets come from Tasks 11–13 and the shell (Task 29). Exposes `focusChamp(): void` and `focusMot(): void` (component exports) for E and `/app/constellation/natsume`.

Layout rules (§4.4, the word never moves):
- Head (about 52 px): portrait (seal monogram in a small frame, link `/app/natsume`), « Natsume », `natsumeWord`, one button: Mettre en pause, Reprendre, or at a cap pause « Relever le plafond » (link to `/app/atelier/depenses#plafond-jour` or `#plafond-mois`); disabled when `etat.readOnly`. Pause toasts « Natsume en pause. », Reprendre « Natsume reprend. ».
- Body: `position: relative`, measured by a `ResizeObserver` into `panneau.corps`. The word is a scroller filling the body with a fixed width (no scrollbar gutter change: `scrollbar-gutter: stable`) and `padding-bottom` equal to `panneau.hauteurAffichee` (plus the thin bar's height when `range`); the panel is `position: absolute; bottom: 0; left: 0; right: 0; height: hauteurAffichee`. Nothing in the word re-flows when the panel moves.
- The thin bar (`range`) holds only the field snippet.
- Handle between word and thread: `role="separator"`, `aria-orientation="horizontal"`, `aria-valuenow` = height, `aria-valuemin`/`max` from the bounds, `tabindex="0"`, ArrowUp/ArrowDown → `pas(±1)`, double-click → `defaut()`, pointer drag with `setPointerCapture` → `redimensionner`. Hidden when `range` or `agrandi`.
- E (`bindPlaceKeys({ conversation })`): if a detail panel is open, it closes (via the layer stack) and the field takes focus (§4.5 ruling of the spec); from `range`, `ouvrir()`; then focus the field.
- While the field has focus, `pushCouche('champ', …)` returns focus to what had it before (§4.4: Escape in the field does not change the panel's state).

- [ ] **Step 1: Write the failing tests**

```ts
it('the word keeps its width and scroll position when the panel opens, moves and folds', async () => {
  renderHost(ColonneFixture); const mot = screen.getByTestId('mot');
  mot.scrollTop = 140; const width = mot.style.width;
  await userEvent.click(screen.getByRole('textbox', { name: 'Écrire à Natsume' }));
  expect(mot.scrollTop).toBe(140); expect(mot.style.width).toBe(width);
  expect(mot.style.paddingBottom).toBe(`${conv().hauteurAffichee}px`);
});
it('E from anywhere but a field opens at a partial height and focuses the field', async () => {
  await userEvent.keyboard('e');
  expect(conv().etat).toBe('ouvert');
  expect(screen.getByRole('textbox', { name: 'Écrire à Natsume' })).toHaveFocus();
});
it('the handle is a separator the keyboard moves by 24 px', async () => {
  const sep = screen.getByRole('separator'); sep.focus(); const before = Number(sep.getAttribute('aria-valuenow'));
  await userEvent.keyboard('{ArrowUp}'); expect(Number(sep.getAttribute('aria-valuenow'))).toBe(before + 24);
  await userEvent.dblClick(sep); expect(Number(sep.getAttribute('aria-valuenow'))).toBe(Math.round(0.45 * conv().corps));
});
it('Escape in the field gives the focus back without folding', async () => { /* focus a button, then E, Escape → button focused, etat still 'ouvert' */ });
it('pause and resume from the head', async () => { /* click « Mettre en pause » → POST /pause, toast « Natsume en pause. » */ });
it('the head button is disabled when Natsume is unreachable', () => { /* etat.downSince set → button disabled */ });
```

(`ColonneFixture.svelte` in `ui/src/natsume/fixtures/` renders `Colonne` with a tall word, a stub thread and a real `Champ`-like textarea labelled « Écrire à Natsume »; jsdom has no layout, so the test sets `panneau.corps = 800` through the context.)

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/natsume/Colonne.test.ts` — FAIL
- [ ] **Step 3: Implement** `Colonne.svelte` and the fixture.
- [ ] **Step 4: Validate and run** — `npx @sveltejs/mcp svelte-autofixer ui/src/natsume/Colonne.svelte && npx vitest run --project ui ui/src/natsume/Colonne.test.ts` — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/natsume/Colonne.svelte ui/src/natsume/Colonne.test.ts ui/src/natsume/fixtures
git commit -m "feat(ui): Natsume's column, a panel that never moves her word" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: The conversation content and the field

**Files:**
- Create: `ui/src/natsume/Conversation.svelte`, `ui/src/natsume/Champ.svelte`, `ui/src/natsume/CarteReduite.svelte`
- Modify: `ui/src/natsume/fil.svelte.ts` (add `queued` sending, see below)
- Test: `ui/src/natsume/Conversation.test.ts`, `ui/src/natsume/fil.test.ts` (add one test)

**Interfaces:**
- Consumes: `Fil` (existing; context key `'fil'`, created once in `App.svelte`), `PanneauConv`, `Etat`, `FileStore.has(satellite, cardId)` (Task 15) for « Tranchée », `Nav.go`, `heure`, `nameOf`, `worldOf`.
- Produces:
  - `Fil.envoyer(text: string): void` — sends now, or keeps the text as `Fil.enAttente` and sends it when the current reply ends (« on peut écrire la suite, l'envoi attend »); `Fil.enAttente: string | null`.
  - `Champ.svelte` props `{ desktop: boolean }`: a `TextArea`-like textarea labelled « Écrire à Natsume », placeholder « Écrire à Natsume »; Entrée sends, Maj Entrée new line; click or send calls `panneau.ouvrir()`; error: the text comes back, one line says why (`fil.failure`); disabled: replaced by its reason (`raisonChamp(e)`); in a manual pause it stays active.
  - `raisonChamp(e: Pick<Etat, 'state' | 'downSince'>): string | undefined` exported from `Champ.svelte`'s module script: « Clé refusée : Natsume ne peut pas répondre. », « Plafond du jour atteint : Natsume répond à nouveau à 05:00. » (month: « … à nouveau le 1er décembre. »), « Natsume est injoignable. », « Ajoute d'abord la clé du modèle. ».
  - `Conversation.svelte` props `{ desktop: boolean }`: header « Fil du jour » or the topic's title, Agrandir or Restaurer, Ranger (desktop only); the thread; topic pills « Réponse à Paul 11:03 » between thread and field; delegation line « Confié à Lun'Acedia, 11:04 » in the post's world; `CarteReduite` for each relayed card.
  - `CarteReduite.svelte` props `{ satellite: string; card: Card }`: type (`card.kind ?? 'Carte'`), post, hour, title, then « Voir dans À trancher » (`nav.go('/app/?carte=<world>:<id>')`, phone `/app/trancher?carte=…`) while the file still has it, else the badge « Tranchée ». No gesture button, ever.
  - `Conversation.ouvrirSujet(thread: string, messageId?: number): void` (component export) for « Voir la conversation » (Task 22): opens the panel, opens the thread, scrolls that message into view.

- [ ] **Step 1: Write the failing tests**

```ts
it('a relayed card has no gesture, only « Voir dans À trancher »', async () => {
  // GET /threads/main/messages → one message with cards: [{ satellite: 'lunavaritia', card: card({ id: 'c1' }) }]; queue holds c1
  renderHost(Conversation, { props: { desktop: true } });
  expect(await screen.findByRole('button', { name: 'Voir dans À trancher' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Valider|Refuser/ })).toBeNull();
});
it('a card no longer in the file is « Tranchée »', async () => { /* queue empty → badge text 'Tranchée' */ });
it('a delegation reads « Confié à Lun'Acedia, 11:04 »', async () => { /* message delegatedTo lunacedia at 10:04Z */ });
it('Enter sends, Shift Enter adds a line', async () => { /* type 'a{Shift>}{Enter}{/Shift}b{Enter}' → POST body text 'a\nb' */ });
it('while Natsume thinks, the next request waits and then goes', async () => { /* stream held open, envoyer('deux') → enAttente 'deux', release → second POST */ });
it('a failed send gives the text back with its reason', async () => { /* POST 500 { error: 'Hors service' } → textarea value restored, text 'Hors service' */ });
it.each([
  [{ key: { state: 'refusee' } }, 'Clé refusée : Natsume ne peut pas répondre.'],
  [{ key: { state: 'absente' } }, 'Ajoute d’abord la clé du modèle.'],
])('a disabled field says why %o', (over, reason) => { expect(raisonChamp({ state: coreState(over), downSince: null })).toBe(reason); });
it('a manual pause keeps the field active', () => { expect(raisonChamp({ state: coreState({ pause: { since: S, by: 'manuel' } }), downSince: null })).toBeUndefined(); });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/natsume/Conversation.test.ts ui/src/natsume/fil.test.ts` — FAIL
- [ ] **Step 3: Implement** the three components and `Fil.envoyer`. Topics come from `fil.threads` (`kind === 'topic'`), pill text `title` plus `heure(createdAt)`.
- [ ] **Step 4: Validate and run** — autofixer on the three files, then the same vitest command — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/natsume/Conversation.svelte ui/src/natsume/Champ.svelte ui/src/natsume/CarteReduite.svelte ui/src/natsume/fil.svelte.ts ui/src/natsume/Conversation.test.ts ui/src/natsume/fil.test.ts
git commit -m "feat(ui): the conversation panel, its field and reduced cards" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: The word of the Bureau

**Files:**
- Create: `ui/src/natsume/mot/mot.ts`, `ui/src/natsume/mot/MotBureau.svelte`
- Test: `ui/src/natsume/mot/MotBureau.test.ts`

**Interfaces:**
- Consumes: `GET /api/word?place=bureau` (slice 5 Task 9); `GET /api/upcoming` → `Upcoming` (slice 2, exact; ruling 16); `heure`, `dateLongue`, `jourTitre`.
- Produces (`ui/src/natsume/mot/mot.ts`):

```ts
// slice 5 Task 9, verbatim (JournalRow from slice 3; the Bureau's `upcoming` is not read, ruling 16)
export interface WordBureau { letter?: { day: string; writtenAt: string; text: string; notes: { at: string; text: string }[] }; noLetter?: 'echec' | 'pause';
  sinceMorning?: { new: number; pending: number }; upcoming: Upcoming; done: JournalRow[] }
export interface WordConstellation { routines: { routine: string; at: string; state: 'faite' | 'echouee' | 'sautee' | 'en-cours' | 'prevue' | 'suspendue' }[]; spend: SpendView }
export interface WordJournal { days: { day: 'aujourdhui' | 'hier'; posts: { post: string; confie: number; cartes: number; urgences: number; faits: number; echoues: number }[] }[] }
export interface WordAtelier { settings: JournalRow[] }
export interface WordNatsume { letterAt?: string; delegatedToday: number; spendToday: number }
export function readWord<T>(api: Api, place: string): Promise<T>;
export function routineLabel(item: UpcomingItem, now: Date): string; // « 05:00, Veille de la nuit, demain »
```

Sections (§6.1, top to bottom), each absent when empty; a section whose read fails is absent with one line saying why (`Ce qui vient ne s'est pas chargé.`):
1. « Lundi 2 novembre, lettre de 07:30 » (capital at the start of the line), the letter, then each correction « Correction de 10:12 : … »; before today's letter, nothing; `noLetter: 'echec'`: « Pas de lettre ce matin : la routine a échoué à 07:30. », `noLetter: 'pause'`: « Pas de lettre ce matin : Natsume était en pause à 07:30. »
2. Depuis ce matin (`sinceMorning.new`, `.pending`): « 3 nouvelles cartes, dont 2 à trancher » or « 3 nouvelles cartes, toutes tranchées » (« 1 nouvelle carte, à trancher » / « … tranchée » for one).
3. Ce qui vient: « 18:00, Justificatif pour la banque, dernier délai » (kind `due`), « 19:00, Rappeler Paul », « 05:00, Veille de la nuit, demain », « 07:30, Lettre du matin, demain » (routine names: night « Veille de la nuit », morning « Lettre du matin »; « demain » when its Natsume day is tomorrow), then `tasks` without hour.
4. Ce que j'ai fait: the three entries (`done`), each a link to `/app/journal/<id>`, then « Journal du jour » (`/app/journal?periode=auj`).
Reads once on mount and again on the window event `lun:changed` (dispatched by the app after each send, Task 29).

- [ ] **Step 1: Write the failing tests**

```ts
it('shows the letter with its date and corrections', async () => {
  // word: letter { day '2026-11-02', writtenAt 06:30Z, text 'Nuit calme. …', notes [{ at 09:12Z, text: 'la veille de la nuit a fini à 10:05 ; …' }] }
  expect(await screen.findByText('Lundi 2 novembre, lettre de 07:30')).toBeInTheDocument();
  expect(screen.getByText(/^Correction de 10:12 :/)).toBeInTheDocument();
});
it('no letter yet shows nothing of it; a failed routine says so', async () => { /* letter absent → no 'lettre de'; noLetter 'echec' → 'Pas de lettre ce matin : la routine a échoué à 07:30.' */ });
it('Ce qui vient lists times, then tasks without time', async () => {
  // upcoming items: due 17:00Z 'Justificatif pour la banque', event 18:00Z 'Rappeler Paul', routine night 2026-11-03T04:00Z; tasks [{ title: 'Payer la cantine' }]
  expect(lines()).toEqual(['18:00, Justificatif pour la banque, dernier délai', '19:00, Rappeler Paul', '05:00, Veille de la nuit, demain', 'Payer la cantine']);
});
it('an empty Ce qui vient disappears', async () => { /* items [], tasks [] → no heading 'Ce qui vient' */ });
it('the last three journal entries link to their detail', async () => { /* href '/app/journal/1284' and link 'Journal du jour' */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/natsume/mot/MotBureau.test.ts` — FAIL
- [ ] **Step 3: Implement** `mot.ts` and `MotBureau.svelte` (headings in Cormorant, lines in Inter, tokens only).
- [ ] **Step 4: Validate and run** — autofixer on `MotBureau.svelte`, then vitest — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/natsume/mot
git commit -m "feat(ui): the Bureau's word, letter first" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: The words of the other places

**Files:**
- Create: `ui/src/natsume/mot/MotConstellation.svelte`, `MotJournal.svelte`, `MotAtelier.svelte`, `MotNatsume.svelte`
- Test: `ui/src/natsume/mot/mots.test.ts`

**Interfaces:**
- Consumes: `readWord`, `Word*` types (Task 12); `etat.state.spend` (`SpendView`, slice 5); `dollars`, `heure`, `quand`, `jourTitre`.
- Produces: four components without props.
  - Constellation: Routines from `routines[]` (label by `routine`: night « Veille de la nuit », morning « Lettre du matin »; the `state` word: `faite` « faite », `echouee` « échouée », `sautee` « sautée, en pause », `en-cours` « en cours », `prevue` nothing, `suspendue` « suspendue »: « 05:00, Veille de la nuit, faite » ; « 07:30, Lettre du matin, faite » ; « 05:00, Veille de demain » ; « suspendue » during a pause) and Dépenses (Aujourd'hui « 0,42 $ sur 3,00 $ », Ce mois « 0,80 $ sur 40,00 $ », one gauge per line: a `<meter>` styled with tokens, full at the cap). Spend comes from `etat.state.spend`, not from the word route.
  - Journal: Aujourd'hui and Hier (`day` `aujourdhui` / `hier`), one line per post composed from its counts (`confie`, `cartes`, `urgences`; `post` is a satellite id or `lunanima`) « Lun'Acedia : 2 confiés, 3 cartes en retour, dont 1 urgence ». No cost total (n° 68).
  - Atelier: « Derniers réglages », three dated lines (`quand(at)` and the entry's `title`) « hier, 18:42 : délai de réponse de Lun'Acedia, 8 s ».
  - Natsume: Lettre du matin 07:30, Confié aujourd'hui, Dépense du jour.

- [ ] **Step 1: Write the failing tests**

```ts
it('Constellation: routines and spend from the state', async () => {
  expect(await screen.findByText('05:00, Veille de la nuit, faite')).toBeInTheDocument();
  expect(screen.getByText('0,42 $ sur 3,00 $')).toBeInTheDocument();
});
it('Constellation: tomorrow\'s night is « suspendue » in a pause', async () => { /* state 'suspendue' → '05:00, Veille de demain, suspendue' */ });
it('Journal: one line per post, never a cost total', async () => {
  expect(await screen.findByText('Lun'Acedia : 2 confiés, 3 cartes en retour, dont 1 urgence')).toBeInTheDocument();
  expect(screen.queryByText(/\$/)).toBeNull();
});
it('Atelier: the last three settings, dated', async () => { /* 'hier, 18:42 : délai de réponse de Lun'Acedia, 8 s' */ });
it('Natsume: letter time, delegations and spend of the day', async () => { /* '07:30', '2', '0,42 $' */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/natsume/mot/mots.test.ts` — FAIL
- [ ] **Step 3: Implement** the four components.
- [ ] **Step 4: Validate and run** — autofixer on each of the four files, then vitest — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/natsume/mot
git commit -m "feat(ui): the word of the Constellation, the Journal, the Atelier and the fiche" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: The detail panel and the phone sheet

**Files:**
- Create: `ui/src/shell/Detail.svelte`
- Test: `ui/src/shell/Detail.test.ts`

**Interfaces:**
- Consumes: `pushCouche` (Task 5), `Nav` (Task 4), Bits UI `Dialog` (for the phone sheet), `mondeOf`.
- Produces: `Detail.svelte` props `{ open: boolean; ariane: string; monde?: string; onclose: () => void; children: Snippet; pied?: Snippet }`.
  - Desktop: `<aside>` 400 px, `position: fixed; top: var(--bande-h, 0px); right: 0; bottom: 0`, over Natsume's column, shadow (`--ombre-2`) and a 3 px filet `var(--accent)` in `data-monde`; breadcrumb (« Constellation / Lun'Acedia »), close button (kit `IconButton`, label « Fermer »), content, footer. Not modal: the page stays usable; a click elsewhere does not close it. On open the focus goes to the panel heading; on close it returns to the element that had it at open time (the star or the entry), unless that element left the DOM (then the page heading).
  - Phone: a bottom sheet with Bits `Dialog` (modal), header with « Replier », a veil that closes on click; Android back closes it first (the owner place pushes an address for the sheet, so Back pops it — the component itself only calls `onclose`).
  - Registers `pushCouche(phone ? 'feuille' : 'detail', onclose)` while open.

- [ ] **Step 1: Write the failing tests**

```ts
it('Escape closes it and gives the focus back to its opener', async () => {
  renderHost(DetailFixture); const opener = screen.getByRole('button', { name: 'Ouvrir' });
  await userEvent.click(opener); expect(screen.getByRole('complementary', { name: /Lun'Acedia/ })).toBeInTheDocument();
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('complementary')).toBeNull(); expect(opener).toHaveFocus();
});
it('on a phone it is a sheet with « Replier »', async () => { renderHost(DetailFixture, { phone: true }); /* click Ouvrir → role dialog, button Replier */ });
it('it does not push the page: no class or style is set on the page', () => { /* document.querySelector('[data-page]') style unchanged */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/shell/Detail.test.ts` — FAIL
- [ ] **Step 3: Implement** `Detail.svelte` and `ui/src/shell/fixtures/DetailFixture.svelte`.
- [ ] **Step 4: Validate and run** — autofixer on both, then vitest — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/shell/Detail.svelte ui/src/shell/Detail.test.ts ui/src/shell/fixtures
git commit -m "feat(ui): detail panel over the column, sheet on a phone" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: The queue store and the gesture texts

**Files:**
- Create: `ui/src/file/file.svelte.ts`, `ui/src/file/textes.ts`
- Test: `ui/src/file/file.test.ts`, `ui/src/file/textes.test.ts`

**Interfaces:**
- Consumes: `GET /api/queue` (slice 2, exact); `holdGesture`, `settleGesture`, `heldToastText`, `HeldBody`, `ToastFacts` from `ui/src/gestures/held.ts` (slice 4 Task 5, which posts, toasts with the undo bound to `DELETE /api/gestures/:id`, and reads `GET /api/gestures/:id`); `Etat.read`, `Etat.readOnly`; `worldOf`, `satelliteOf`.
- Produces (`ui/src/file/file.svelte.ts`), context key `'file'`:

```ts
export type Key = string; // 'u:<eventId>' | 'c:<satellite>:<cardId>' | 'p:<satellite>:<firstCardId>' | 'd:<factId>'
export type Item = QueueUrgent | QueueCard | QueuePile | QueueDue;
export const keyOf: (item: Item) => Key;
export type Geste =
  | { kind: 'card'; item: QueueCard; gesture: 'accept' | 'refuse'; answer?: string }
  | { kind: 'pile'; item: QueuePile; keep?: string /* card id kept; others refused */; gesture: 'accept' | 'refuse' }
  | { kind: 'lot'; satellite: string; cards: Card[] }
  | { kind: 'seen'; item: QueueUrgent }
  | { kind: 'due'; item: QueueDue; gesture: 'done' | 'later' };
export class FileStore {
  queue: Queue | null; failure: string | null; choisie: Key | null; pliees: Set<string>; busy: Set<Key>;
  constructor(api: Api, etat: Etat, from: () => 'bureau' | 'trancher');
  load(): Promise<void>;
  has(satellite: string, cardId: string): boolean;
  choisir(key: Key | null): void;
  trancher(geste: Geste): Promise<void>; // see rules
}
```

`trancher` rules:
- no-op when `etat.readOnly`, when the item is `readOnly`, or when its key is in `busy` (Review Focus 5);
- removes the rows at once (optimistic), then one `holdGesture(api, bodyOf(geste), factsOf(geste))` (`from` = `bureau` on a desktop, `trancher` on a phone; a pile is one body whose items are its cards: `keep` accepted and the others refused, or all with `gesture`; ruling 4), then `etat.read()` and `load()`;
- the toast and its Annuler are `holdGesture`'s (one held id); the `DELETE` goes through `Api.send`, which re-reads `etat` and `file` after each call (Task 29), so the rows come back; a late undo shows the kit's danger toast with the core's « Trop tard pour annuler. »;
- then `settleGesture(api, held)`: each of its `failed` puts its card back with `failure` = its `reason` (« Lun'Acedia n'a pas répondu, rien n'a été fait. » or the post's own `400` reason), read by Task 16 as a row line with Réessayer; « Déjà tranchée ailleurs. » is toasted by `settleGesture` itself;
- a `POST` refused (`holdGesture` throws: `4xx`, `5xx`, network) puts the rows back and shows the error on the card.
- Produces (`ui/src/file/textes.ts`): `factsOf(geste: Geste): ToastFacts` and `texteDe(geste: Geste): string` = `heldToastText(factsOf(geste))` — « Validée : Paul Mercier. », « Refusée : Adresse de Marion. », « Urgence vue : la banque demande un justificatif. » (`factsOf` lowers the title's first letter), « Brouillon créé : Réponse à Paul. » (ruling 1), « Réponse donnée : Chez Lulu. » (question), « 5 fiches validées. », « Les deux fiches validées. », « Les deux fiches refusées. », « Une fiche validée, l’autre refusée. » (ruling 3), « C'est fait : … », « Plus tard : … » (ruling 5); `nomDe(kind?: string): { un: string; plusieurs: string }` (ruling 6).

- [ ] **Step 1: Write the failing tests**

```ts
// textes.test.ts
it.each([
  [{ kind: 'card', item: qc({ title: 'Paul Mercier' }), gesture: 'accept' }, 'Validée : Paul Mercier.'],
  [{ kind: 'card', item: qc({ title: 'Réponse à Paul', sends: true }), gesture: 'accept' }, 'Brouillon créé : Réponse à Paul.'],
  [{ kind: 'card', item: qc({ title: 'Lieu du dîner', options: ['Chez Lulu'] }), gesture: 'accept', answer: 'Chez Lulu' }, 'Réponse donnée : Chez Lulu.'],
  [{ kind: 'lot', satellite: 'lunavaritia', cards: five('Nouvelle fiche') }, '5 fiches validées.'],
  [{ kind: 'lot', satellite: 'lunavaritia', cards: mixed() }, '5 cartes validées.'],
  [{ kind: 'pile', item: pile(), keep: 'p1', gesture: 'accept' }, 'Une fiche validée, l’autre refusée.'],
  [{ kind: 'seen', item: urgent({ title: 'La banque demande un justificatif' }) }, 'Urgence vue : la banque demande un justificatif.'],
])('%#', (geste, text) => expect(texteDe(geste as Geste)).toBe(text));
// file.test.ts
it('a gesture removes the row at once and posts it held', async () => {
  const f = fakeCore({ 'GET /queue': json(queue1()), 'POST /gestures': json({ id: 7, dueAt: DUE }, 202) });
  const s = store(); await s.load();
  await s.trancher({ kind: 'card', item: first(s), gesture: 'accept' });
  expect(s.has('lunavaritia', 'c1')).toBe(false);
  expect(bodyOf(f, 'POST /gestures')).toEqual({ items: [{ satellite: 'lunavaritia', card: 'c1', gesture: 'accept' }], from: 'bureau' });
});
it('a question\'s answer goes as input.answer', async () => { /* answer 'Chez Lulu' → items[0].input { answer: 'Chez Lulu' } */ });
it('undo deletes the held gesture and the row comes back', async () => { /* api whose send re-reads the store, as Task 29 wires it; toast Annuler → DELETE /gestures/7 → 204 → GET /queue again → has c1 */ });
it('a pile goes as one gesture, one toast undoes it', async () => { /* keep p1 → one POST, items [accept p1, refuse p2]; Annuler → one DELETE /gestures/7 */ });
it('two presses send one gesture', async () => { /* Promise.all([trancher(g), trancher(g)]) → one POST */ });
it('nothing is sent while Natsume is unreachable', async () => { /* etat.downSince set → no POST, row stays */ });
it('a refused post puts the row back and says why', async () => { /* POST 500 { error } → has c1, item.failure === error */ });
it('a relay failure puts the card back with its reason', async () => { /* vi.useFakeTimers, GET /gestures/7 → relayed, items[0] { outcome: 'failed', reason } → item.failure === reason */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/file/file.test.ts ui/src/file/textes.test.ts` — FAIL
- [ ] **Step 3: Implement** both modules; add `file` to `testing/Host.svelte`.
- [ ] **Step 4: Run to verify they pass** — same command — PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/file ui/src/testing/Host.svelte
git commit -m "feat(ui): one queue store, held gestures and their toasts" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 16: Queue rows and the unfolded card

**Files:**
- Create: `ui/src/file/File.svelte`, `ui/src/file/Rangee.svelte`, `ui/src/file/Depliee.svelte`
- Test: `ui/src/file/File.test.ts`

**Interfaces:**
- Consumes: `FileStore`, `Geste`, `keyOf` (Task 15); `bindPlaceKeys` (`suivant`, `precedent`, `valider`, `refuser`); `leaveRow` (move `ui/src/screens/focus.ts` to `ui/src/file/focus.ts` in this task, unchanged); `frontHref`, `OUTSIDE`, `openLabel`, `posts` context; `heure`, `nameOf`, `worldOf`.
- Produces:
  - `File.svelte` props `{ poste?: string /* world id */ }`: « Urgent » first (not foldable), then one group per post (title button: chevron, world dot, name, number; `aria-expanded`), rows, the chosen row unfolded in place; a group read stale shows « Lu à 14:11 » in its title. `data-aide="file"` on the list. Lot button slot per group (filled by Task 17).
  - `Rangee.svelte` props `{ item: Item; choisie: boolean }`: world mark, type (`card.kind ?? 'Carte'`, « Urgence », « Échéance », « Deux fiches, même nom » for a pile), title, `heure(at)` and a short meta (`card.reason` shortened is not used; meta = « Lun'Acedia propose »), badge « Crée un brouillon » when `sends`; a row is a `button` that chooses it (click or Enter); hover never chooses.
  - `Depliee.svelte` props `{ item: Item }`: the card's `lines`, « Pourquoi » and `card.reason`, then gestures by type:
    - write/delete card: Valider, Refuser;
    - urgent: Vu, « Ouvrir le mail » (new tab via `frontHref`, keeps a tooltip « Le poste ne répond pas : le mail peut avoir changé. » when its post is not `relie`);
    - question (`options`): one button per option, and a field « Autre réponse, Entrée envoie »;
    - `sends`: « Créer le brouillon », Refuser, « Modifier dans Lun'Acedia » (new tab);
    - due: « C'est fait », « Plus tard ».
    - read-only: gestures disabled with one line: `injoignable` « Indisponible tant que Lun'Acedia ne répond pas. », `pause-locale` « Indisponible tant que Lun'Acedia est en pause. », `contrat` « Indisponible tant que Lun'Acedia n'est pas mis à jour. », `perimee`/`inconnu` the same as `injoignable`; Natsume unreachable: « Natsume est injoignable : lecture seule. ».
    - a relay failure: its line and Réessayer (runs the same `Geste` again).
- Keys (only inside `data-aide="file"`, never from a field): ArrowDown/ArrowUp choose the next/previous row across groups; V = Valider, or Vu on an urgency; never on `sends`, a question or a pile; R = Refuser (also on `sends`). After a gesture the focus goes to the first gesture of the next row at the same rank (`leaveRow`).

- [ ] **Step 1: Write the failing tests**

```ts
it('a row not unfolded has no Valider', async () => {
  renderHost(File); await screen.findByText('Paul Mercier');
  expect(screen.queryByRole('button', { name: 'Valider' })).toBeNull();
});
it('choosing a row unfolds it in place with its reason', async () => {
  await userEvent.click(screen.getByRole('button', { name: /Paul Mercier/ }));
  expect(screen.getByText('Pourquoi')).toBeInTheDocument(); expect(screen.getByRole('button', { name: 'Valider' })).toBeInTheDocument();
});
it('urgent first, then groups, the oldest waiting first', async () => { /* order of group headings */ });
it('V validates the chosen card and the focus goes to the next card\'s first gesture', async () => {
  await choose('Paul Mercier'); await userEvent.keyboard('v');
  expect(await screen.findByText('Validée : Paul Mercier.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Valider' })).toHaveFocus();
});
it('V does nothing on a draft, a question or a pile', async () => { /* each: keyboard 'v' → no POST /gestures */ });
it('V and R typed in the « Autre réponse » field write into it', async () => { /* type 'vr' → field value 'vr', no POST */ });
it('a reply card offers « Créer le brouillon », never « Envoyer »', async () => {
  await choose('Réponse à Paul');
  expect(screen.getByRole('button', { name: 'Créer le brouillon' })).toBeInTheDocument();
  expect(screen.queryByText(/Envoyer/)).toBeNull();
});
it('a free answer goes as { answer }', async () => { /* type 'Au Café{Enter}' → items[0].input { answer: 'Au Café' } */ });
it('a post down: its cards are greyed, gestures disabled, with the reason', async () => { /* readOnly injoignable → 'Indisponible tant que Lun'Acedia ne répond pas.' */ });
it('Natsume unreachable: every gesture is disabled', async () => { /* etat.downSince → 'Natsume est injoignable : lecture seule.' */ });
it('a group folds at its title', async () => { /* click group title → aria-expanded false, rows hidden */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/file/File.test.ts` — FAIL
- [ ] **Step 3: Implement** the three components (kit `Button`, `Badge`, `TextInput`, `Tooltip`).
- [ ] **Step 4: Validate and run** — autofixer on `File.svelte`, `Rangee.svelte`, `Depliee.svelte`, then vitest — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/file ui/src/screens/focus.ts
git commit -m "feat(ui): the queue, rows and the card unfolded in place" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 17: Pile and batch

**Files:**
- Create: `ui/src/file/Pile.svelte`, `ui/src/file/Lot.svelte`
- Modify: `ui/src/file/File.svelte` (group title button, lot in place of the group), `ui/src/file/Depliee.svelte` (a pile renders `Pile`)
- Test: `ui/src/file/Lot.test.ts`

**Interfaces:**
- Consumes: `FileStore.trancher` with `{ kind: 'pile' }` and `{ kind: 'lot' }` (Task 15); `pushCouche('lot', …)` (Task 5); `nomDe` (Task 15).
- Produces:
  - `Pile.svelte` props `{ item: QueuePile }`: type « Deux fiches, même nom », title alone, the contents side by side, each with « Valider celle-ci »; footer « Valider les deux », « Refuser les deux ». Never in a lot.
  - `Lot.svelte` props `{ satellite: string; cards: Card[]; onclose: () => void }`: heading « Valider ensemble », « Décoche une fiche pour la laisser à trancher. », one row per card (kit `Checkbox` checked, title, contents, reason), footer Fermer and the submit button whose label follows the checked count: « Valider les 5 fiches », « Valider la fiche », « Aucune fiche cochée » (disabled). Uses `nomDe(kind)` for « fiche(s) »/« carte(s) ».
  - In `File.svelte`: a group whose `batchable` items number at least two shows « Valider les N fiches » (`Button variant="doux"`) at its title; clicking replaces the group by `Lot`; the title button disappears meanwhile; Escape (layer `lot`) or Fermer brings the group back.

- [ ] **Step 1: Write the failing tests**

```ts
it('a batch of 5 with one unchecked validates 4, one toast, Annuler restores all', async () => {
  const f = fakeCore({ 'GET /queue': json(fiveFiches()), 'POST /gestures': json({ id: 7, dueAt: DUE }, 202), 'DELETE /gestures/7': empty() });
  renderHost(File); await userEvent.click(await screen.findByRole('button', { name: 'Valider les 5 fiches' }));
  await userEvent.click(screen.getAllByRole('checkbox')[2]!);
  await userEvent.click(screen.getByRole('button', { name: 'Valider les 4 fiches' }));
  expect(bodyOf(f, 'POST /gestures').items).toHaveLength(4);
  expect(screen.getByText('4 fiches validées.')).toBeInTheDocument();
  expect(screen.getByText(fiveFiches().groups[0]!.items[2]!.card.title)).toBeInTheDocument(); // the unchecked one stays
  await userEvent.click(screen.getByRole('button', { name: 'Annuler' }));
  expect(f).toHaveBeenCalledWith('/api/gestures/7', expect.objectContaining({ method: 'DELETE' }));
});
it('no box checked: the button says so and is disabled', async () => { /* uncheck all → 'Aucune fiche cochée' disabled */ });
it('one box: « Valider la fiche »', async () => { /* … */ });
it('Escape closes the batch and brings the group back', async () => { /* … */ });
it('a pile: « Valider celle-ci » keeps one and refuses the other', async () => { /* one POST, items [accept p1, refuse p2]; toast 'Une fiche validée, l’autre refusée.' */ });
it('a pile never joins a batch', () => { /* group with pile + 2 batchable → button 'Valider les 2 fiches' */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/file/Lot.test.ts` — FAIL
- [ ] **Step 3: Implement** both components and the two modifications.
- [ ] **Step 4: Validate and run** — autofixer on `Pile.svelte`, `Lot.svelte`, `File.svelte`, `Depliee.svelte`, then `npx vitest run --project ui ui/src/file` — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/file
git commit -m "feat(ui): piles and batches with exceptions, undone as one" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 18: The Bureau, the phone À trancher tab and deep links

**Files:**
- Create: `ui/src/lieux/Bureau.svelte`, `ui/src/lieux/BureauTel.svelte`
- Test: `ui/src/lieux/Bureau.test.ts`

**Interfaces:**
- Consumes: `File.svelte` (Tasks 16–17), `FileStore.choisir`, `queueCount`, `Nav`, `Lieu` (`bureau`/`trancher` with `carte`, `poste`, `depuis`), `Presences` (`forme: 'pastilles'`), `MotBureau`, kit `Chip`, `EmptyState`, `Skeleton`.
- Produces:
  - `Bureau.svelte` (desktop page, and the phone `trancher` tab): title « À trancher » with its number (from `queueCount`, ruling 7), then `File`. Filter banner only when `depuis=constellation`: « Seulement Lun'Acedia » and « Toute la file » (link `/app/`). Phone tab: chips « Tout », « Lun'Acedia 2 » … filter by post (address `?poste=`). Loading: group skeletons. Empty: « Tout est tranché. » with the seal and a link « Journal du jour »; filtered: « Plus rien à trancher pour Lun'Acedia. » and « Toute la file ».
  - `?carte=<world>:<id>`: once the queue is loaded, choose `c:lun<world>:<id>` (or the pile holding it), scroll it into view, focus its first gesture; unknown card (Review Focus 3): nothing chosen, the address is cleaned with `replaceState` to `/app/` (keeping `poste`), no error.
  - Choosing a row writes `?carte=` with `replaceState` (the chosen card survives a reload); folding it back removes it.
  - `BureauTel.svelte` (phone `/app/`): presences as wrapping pills, « À trancher » and the three most pressing (urgent first, then the queue order), each a link to `/app/trancher?carte=…`, « Voir les 13 », then `MotBureau`.

- [ ] **Step 1: Write the failing tests**

```ts
it('the title carries the same number as the state', async () => { renderHost(Bureau); expect(await screen.findByRole('heading', { name: 'À trancher 13' })).toBeInTheDocument(); });
it('/app/?carte=avaritia:c-1 opens that card unfolded and focused', async () => {
  history.replaceState(null, '', '/app/?carte=avaritia:c-1'); renderHost(Bureau);
  expect(await screen.findByRole('button', { name: 'Valider' })).toHaveFocus();
});
it('a deep link to a card already decided chooses nothing and cleans the address', async () => {
  history.replaceState(null, '', '/app/?carte=avaritia:gone'); renderHost(Bureau);
  await screen.findByText('Paul Mercier');
  expect(screen.queryByRole('button', { name: 'Valider' })).toBeNull(); expect(location.search).toBe('');
});
it('from the Constellation: the banner, and its end', async () => { /* ?poste=acedia&depuis=constellation → 'Seulement Lun'Acedia'; empty → 'Plus rien à trancher pour Lun'Acedia.' */ });
it('all decided: « Tout est tranché. » and the day\'s journal', async () => { /* empty queue → text and link href '/app/journal?periode=auj' */ });
it('phone Bureau: three most pressing and « Voir les 13 »', async () => { renderHost(BureauTel, { phone: true }); /* 3 links, 'Voir les 13' */ });
it('phone tab: chips filter by post', async () => { /* click 'Lun'Acedia 2' → location.search '?poste=acedia' */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/lieux/Bureau.test.ts` — FAIL
- [ ] **Step 3: Implement** both components.
- [ ] **Step 4: Validate and run** — autofixer on both, then vitest — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/lieux
git commit -m "feat(ui): the Bureau and the phone's À trancher" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 19: The Constellation sky

**Files:**
- Create: `ui/src/constellation/Constellation.svelte`, `ui/src/constellation/Ciel.svelte`, `ui/src/constellation/Astre.svelte` (from `carte/Noeud.svelte`)
- Test: `ui/src/constellation/Constellation.test.ts`

**Interfaces:**
- Consumes: `MONDE.worlds` places (Task 3), `etat.state.posts` and `queue.posts`, `natsumeWord`, `Nav`, `heure`; `Detail` (Task 14) and `PanneauPoste` (Task 20) for the panel slot.
- Produces:
  - `Ciel.svelte` props `{ decale: boolean }`: the heptagram polygon (the prototype's `points`, stroke `var(--bordure)` at low opacity), Natsume's star at (50, 50), one star per world that is paired or `a-relier`, at its fixed place; a straight link from Natsume to each, stroked like its outline; legend (Relié, Muet, Injoignable, À relier) and « Maintenant, 14:20 ». `decale` shifts the sky's centre left by half the panel (200 px) with a transform; nothing else moves.
  - `Astre.svelte` props `{ world: World; view: PostView | 'natsume'; count?: number; choisi: boolean }`, an `<a>` to `/app/constellation/<world>`: disc in the world colour (`data-monde`; `neutre` for `a-relier`) bearing the count (« + » for `a-relier`, nothing when `inconnu`), the name, a state line (« Le cerveau, relié » when the world has a role; « Ne répond pas depuis 14:12 »; « En pause dans ses réglages »; « À mettre à jour »; « Inconnu »). Outline: solid (`relie`), dashed (`muet`), dotted struck (`injoignable`), light dots (`a-relier`). Accessible name « Lun'Avaritia, relié, 10 à trancher ». All stars say « Inconnu » when `etat.readOnly`.
  - Natsume's star: monogram, `natsumeWord`, « 13 à trancher »; link to `/app/constellation/natsume`, which focuses the column's word (desktop) — no panel.
  - `Constellation.svelte`: heading « Constellation », the sky, a visually hidden list doubling it (`<ul>` with the same names), the post panel when `lieu.poste` is a world, the phone list (Natsume then the posts in heptagram order, state and number) under 768 px; Tab follows heptagram order (DOM order of the stars = `MONDE.worlds` order after Natsume); Enter on a star opens it (native link). No post: Natsume's star alone and « Relier un poste ». `data-aide="ciel"`.

- [ ] **Step 1: Write the failing tests**

```ts
it('each world sits at its fixed place, in heptagram order', async () => {
  renderHost(Constellation, { state: coreState({ posts: allSeven() }) });
  const stars = screen.getAllByRole('link', { name: /^Lun'/ });
  expect(stars.map((s) => s.getAttribute('href'))).toEqual(['/app/constellation/ira', '/app/constellation/avaritia', /* … */ '/app/constellation/acedia']);
  expect(stars[1]).toHaveStyle({ left: '78.1%', top: '26.3%' });
});
it('accessible names say what each star carries', () => {
  expect(screen.getByRole('link', { name: 'Lun'Avaritia, relié, 10 à trancher' })).toBeInTheDocument();
});
it('a world never paired is « à relier » with a +', () => { /* lunira a-relier → disc text '+' */ });
it('a post never read says « Inconnu », without a number', () => { /* state inconnu */ });
it('Natsume unreachable: every star says « Inconnu »', () => { /* etat.downSince */ });
it('nothing here decides a card', () => { expect(screen.queryByRole('button', { name: /Valider|Refuser/ })).toBeNull(); });
it('phone: a list of stars', () => { renderHost(Constellation, { phone: true }); /* list items Natsume, then posts */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/constellation/Constellation.test.ts` — FAIL
- [ ] **Step 3: Implement** the three components (copy the disc styles of `Noeud.svelte`, then delete nothing yet).
- [ ] **Step 4: Validate and run** — autofixer on the three files, then vitest — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/constellation
git commit -m "feat(ui): the Constellation, worlds at fixed places" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 20: The panel of a post

**Files:**
- Create: `ui/src/constellation/PanneauPoste.svelte`
- Modify: `ui/src/constellation/Constellation.svelte` (mount it in `Detail`)
- Test: `ui/src/constellation/PanneauPoste.test.ts`

**Interfaces:**
- Consumes: `GET /api/posts/:id`, `POST /api/posts/:id/check` (slice 2, exact; called with `satelliteOf(world)`); `Detail`; `frontHref`, `OUTSIDE`, `posts` context; `quand`, `heure`, `dollars`, `roleOf`, `nameOf`.
- Produces: `PanneauPoste.svelte` props `{ world: string }`, inside `Detail` with `ariane="Constellation / Lun'Acedia"` and `monde={world}`:
  - name and role, state badge (kit `Badge`: Relié ok, Muet attention, Injoignable danger, À relier neutre);
  - **Diagnostic** (`dl`): Agent (only when `agentName`), Dernier contact, Dernier succès (« hier, 14:10, 3 cartes lues »), Dernière erreur (« 14:12, <reason> »); injoignable: Dernier succès, Dernière erreur, Nouvel essai « automatique »; muet: the reason « En pause dans ses réglages » or « Version du contrat trop ancienne »; Natsume unreachable: Dernière lecture. Button « Réessayer » when injoignable, else « Vérifier maintenant »; while running « Essai en cours »; then toast « Lun'Acedia répond. » (state `relie`) or « Lun'Acedia ne répond toujours pas. ».
  - **Aujourd'hui**: Confié « 2, à 09:12 et 11:04 » (« Rien » when none), Coût (`dollars`).
  - « Voir ses 3 cartes » → `/app/?poste=<world>&depuis=constellation` (with « lu à 14:11 » when stale), or « Rien à trancher ».
  - Footer: « Régler ce poste » (`/app/atelier/postes#poste-<world>`), « Ouvrir Lun'Acedia » (new tab).
  - `a-relier`: « Pas encore relié. », « Une fois relié, ses cartes arrivent dans À trancher. », button « Relier Lun'Ira » (`/app/atelier/postes/relier?poste=ira`).
  - Just paired with no capability (`lastSuccess.count === 0` and no delegation setting, from `GET /api/settings` `posts[id].night === false`, slice 5): « Ce que Natsume peut lui confier : Lun'Ira n'a encore rien déclaré. », « Rien ne lui est confié tant que tu ne l'as pas réglé. », « Régler la veille de la nuit ».
  - A click on another star changes the content without closing (keyed on `world`); Escape, the cross, or Back close it and clean the address to `/app/constellation`.

- [ ] **Step 1: Write the failing tests**

```ts
it('Escape closes the panel, returns the focus to the star and cleans the address', async () => {
  history.replaceState(null, '', '/app/constellation'); renderHost(Constellation);
  const star = await screen.findByRole('link', { name: /^Lun'Acedia/ }); await userEvent.click(star);
  expect(location.pathname).toBe('/app/constellation/acedia');
  await userEvent.keyboard('{Escape}');
  expect(location.pathname).toBe('/app/constellation'); expect(star).toHaveFocus();
});
it('Réessayer on a post down gives its result', async () => { /* POST /posts/lunacedia/check → relie → toast 'Lun'Acedia répond.' */ });
it('« Voir ses 3 cartes » opens the filtered file', async () => { /* href '/app/?poste=acedia&depuis=constellation' */ });
it('no agent line unless the post declares one', async () => { /* agentName absent → no 'Agent'; 'Iris' → 'Agent' 'Iris' */ });
it('a world to link offers « Relier Lun'Ira »', async () => { /* GET /posts/lunira → { state: 'a-relier' } */ });
it('the API is called with the satellite id', async () => { /* fetch called with '/api/posts/lunacedia' */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/constellation/PanneauPoste.test.ts` — FAIL
- [ ] **Step 3: Implement** the panel and mount it.
- [ ] **Step 4: Validate and run** — autofixer on `PanneauPoste.svelte`, `Constellation.svelte`, then `npx vitest run --project ui ui/src/constellation` — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/constellation
git commit -m "feat(ui): a post's panel, diagnostic first" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 21: The Journal list and its filters

**Files:**
- Create: `ui/src/journal/filtres.ts`, `ui/src/journal/Journal.svelte`
- Test: `ui/src/journal/Journal.test.ts`

**Interfaces:**
- Consumes: `GET /api/journal` → `JournalPage` (slice 3); `Lieu` (`journal`), `Nav.go`, `hrefOf`; `etat.state.posts` for the post chips; `heure`, `jourTitre`, `nameOf`, `worldOf`; kit `Chip`, `Segmented`, `TextInput`, `Badge`, `EmptyState`, `Skeleton`.
- Produces (`ui/src/journal/filtres.ts`): `apiQuery(l: Extract<Lieu, { place: 'journal' }>, avant?: string): string` (app world id → satellite id, `natsume` → `lunanima` (ruling 17), `q` trimmed, `periode` always sent); `OUTCOMES: Record<JournalOutcome, { label: string; tone: Tone }>` = À trancher (ia), Tranchée (ok), Vue (neutre), Fait (ok), Échoué (danger), Sautée (neutre) — « Sautée, en pause » when `meta` says pause is the core's text, not the UI's.
- `Journal.svelte`: heading « Journal », « 1 286 événements depuis le 12 octobre » (`total` with a thin space thousands separator from `Intl.NumberFormat('fr-FR')`, `since` as `dateLongue` without weekday… use « le 12 octobre »); filter row: search (placeholder « Chercher : Paul, banque, veille », count of results (`matched`) when a filter acts), period (`Segmented`: Aujourd'hui, 7 jours, Tout), post chips (Tous, each linked post, Natsume), « Plus de filtres » toggling the types (Tous, Urgences, Cartes, Confiés, Routines). Every filter change calls `nav.go(hrefOf(...))` (push, so Back gives the previous filter); the search pushes after 300 ms idle and on Enter. List grouped by day: « Aujourd'hui », « Hier », then « lundi 2 novembre, 6 événements »; rows: hour, world mark, title, meta, outcome badge; each row a link to `/app/journal/<n>` (keeps the filters); « Plus ancien » appends `next`. Empty: « Rien ne correspond. », « Aucun événement avec ces filtres. », « Effacer les filtres »; nothing at all: « Rien d'écrit encore. »; error: « Le Journal ne s'est pas chargé. » and Réessayer. Ctrl F (Journal only, `bindPlaceKeys({ chercher })`) focuses the search; ArrowUp/Down move between rows (`data-aide="journal"`). Phone: filters folded under « Filtres ».

- [ ] **Step 1: Write the failing tests**

```ts
it('period, post, type and search combine in the address and the request', async () => {
  const f = fakeCore({ 'GET /journal': json(journalPage()) });
  history.replaceState(null, '', '/app/journal'); renderHost(Journal);
  await userEvent.click(await screen.findByRole('radio', { name: 'Aujourd’hui' }));
  await userEvent.click(screen.getByRole('button', { name: 'Lun'Acedia' }));
  await userEvent.click(screen.getByRole('button', { name: 'Plus de filtres' })); await userEvent.click(screen.getByRole('button', { name: 'Confiés' }));
  await userEvent.type(screen.getByRole('searchbox'), 'paul{Enter}');
  expect(location.pathname + location.search).toBe('/app/journal?periode=auj&poste=acedia&type=confie&q=paul');
  expect(lastUrl(f, '/api/journal')).toContain('poste=lunacedia');
});
it('Back gives the previous filter', async () => { /* after two filter changes, history.back() → previous query, list re-read */ });
it('groups by day with Aujourd’hui and Hier', async () => { /* headings */ });
it('« Plus ancien » loads the next days', async () => { /* next '2026-10-26' → second GET with avant=2026-10-26 */ });
it('nothing matches: says so and clears the filters', async () => { /* days [] with q → 'Rien ne correspond.' → click 'Effacer les filtres' → '/app/journal' */ });
it('Ctrl F focuses the search', async () => { await userEvent.keyboard('{Control>}f{/Control}'); expect(screen.getByRole('searchbox')).toHaveFocus(); });
it('no cost total anywhere', async () => { expect(screen.queryByText(/\$/)).toBeNull(); });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/journal/Journal.test.ts` — FAIL
- [ ] **Step 3: Implement** `filtres.ts` and `Journal.svelte` (reuse the load/append/generation logic of `screens/Journal.svelte`).
- [ ] **Step 4: Validate and run** — autofixer on `Journal.svelte`, then vitest — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/journal
git commit -m "feat(ui): the Journal, filters in the address" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 22: The panel of a Journal entry

**Files:**
- Create: `ui/src/journal/PanneauEntree.svelte`
- Modify: `ui/src/journal/Journal.svelte` (mount it in `Detail` when `lieu.n`)
- Test: `ui/src/journal/PanneauEntree.test.ts`

**Interfaces:**
- Consumes: `GET /api/journal/:id` → `JournalDetail` (slice 3); `Detail`; `Conversation.ouvrirSujet` (Task 11, reached through the `conversation` context: `panneau.ouvrir()` then `fil.open(thread)` and a `scrollIntoView` on `[data-message="<id>"]`); `frontHref`; `quand`, `heure`, `dollars`.
- Produces: `PanneauEntree.svelte` props `{ n: number }`: breadcrumb « Journal / Aujourd'hui, 11:04 » and « n° 1 284 »; title, meta, outcome badge; **La chaîne** (dated steps, the last one marked; « La carte est à trancher. » for a pending outcome); « Ce qui a été confié » for a delegation (type `confie`: its title and steps); Coût (`cost`), Durée (`durationMs`), Références (`refs`); « Trancher la carte » when `pending` holds a card (→ `/app/?carte=<worldOf(pending.satellite)>:<pending.card.id>`, phone `/app/trancher?carte=…`); footer « Voir la conversation » (when `threadId`, with `messageId`; hidden when `threadId` is absent) and « Ouvrir dans Lun'Acedia » (new tab). ArrowUp/ArrowDown with the panel open move to the previous/next entry of the loaded list (address `/app/journal/<n>` replaced, filters kept). Closing returns to `/app/journal?<filters>` and focuses the row.

- [ ] **Step 1: Write the failing tests**

```ts
it('a pending entry leads to its card', async () => {
  history.replaceState(null, '', '/app/journal/1284'); renderHost(Journal);
  await userEvent.click(await screen.findByRole('button', { name: 'Trancher la carte' }));
  expect(location.pathname + location.search).toBe('/app/?carte=acedia:c9');
});
it('a delegation shows the request, the post and the card returned', async () => { /* steps texts, 'Ce qui a été confié' */ });
it('arrows change entry, the panel open', async () => { /* ArrowDown → '/app/journal/1283' */ });
it('« Voir la conversation » opens the panel on that topic', async () => { /* conversation context etat 'ouvert', fil.thread === 't1' */ });
it('Escape closes and keeps the filters', async () => { /* '/app/journal/1284?periode=auj' → Escape → '/app/journal?periode=auj' */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/journal/PanneauEntree.test.ts` — FAIL
- [ ] **Step 3: Implement** the panel and mount it.
- [ ] **Step 4: Validate and run** — autofixer on both files, then `npx vitest run --project ui ui/src/journal` — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/journal
git commit -m "feat(ui): a Journal entry and its chain in a panel" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 23: The Atelier frame, its save rule, Clavier and Notifications

**Files:**
- Create: `ui/src/atelier/Atelier.svelte`, `ui/src/atelier/Reglage.svelte`, `ui/src/atelier/Clavier.svelte`, `ui/src/atelier/Notifications.svelte`
- Test: `ui/src/atelier/Atelier.test.ts`

**Interfaces:**
- Consumes: `Lieu` (`atelier`), `THEMES`, `Nav`; `TOUCHES` (Task 5); kit `SettingsCard`, `SettingsRow`, `Switch`, `Segmented`, `TextInput`, `Button`, `Banner`.
- Produces:
  - `Atelier.svelte`: text tabs (Postes, Dépenses et plafonds, Modèle et clé, Routines, Appareils, Notifications, Clavier) as a `role="tablist"`; ArrowLeft/ArrowRight move to the next/previous theme (`theme-suivant`/`theme-precedent`, `nav.go`); no explanation heading; one theme rendered at a time (themes from Tasks 24–26 are imported as they land; until then the tab shows the theme component that exists). A fragment (`reglage`) scrolls to and focuses `#<reglage>`. Phone: the list of themes with their state line, then the open theme. `data-aide="atelier"`.
  - `Reglage.svelte`, the save rule (§6.4), props `{ id: string; label: string; hint?: string; kind: 'bascule' | 'choix' | 'champ'; value: unknown; options?: Option[]; save: (v: unknown) => Promise<void>; consequence?: (v: string) => string | undefined }`: a toggle or a choice saves on click and says « Activé, enregistré », « Éteint, enregistré » or « Enregistré » in its hint for 3 s; a field saves on Enter or with its « Enregistrer » button, shown only once the value changed; Escape in the field puts its saved value back (and does not close any layer); a failed save: « Ce réglage ne s'est pas enregistré. » on its line, value restored. `consequence` shows a line under a field while typing (Task 25). Read-only when `etat.readOnly`.
  - `Clavier.svelte`: banner « Bientôt modifiables. », then `TOUCHES` grouped Partout, À trancher, Ailleurs, read-only (`Kbd` and effect).
  - `Notifications.svelte`: « Notifications non activées. » only.

- [ ] **Step 1: Write the failing tests**

```ts
it('arrows move between themes', async () => {
  history.replaceState(null, '', '/app/atelier/postes'); renderHost(Atelier);
  screen.getByRole('tab', { name: 'Postes' }).focus(); await userEvent.keyboard('{ArrowRight}');
  expect(location.pathname).toBe('/app/atelier/depenses');
});
it('a toggle saves on click and says so', async () => { /* Reglage bascule → save called with true → hint 'Activé, enregistré' */ });
it('a field saves on Enter; Escape puts its value back', async () => { /* type → button 'Enregistrer' appears; Escape → value restored, no save */ });
it('a failed save says so on its line', async () => { /* save rejects → 'Ce réglage ne s’est pas enregistré.' */ });
it('Clavier shows the table read-only', async () => { /* banner text, 'Ctrl K' row, no input */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/atelier/Atelier.test.ts` — FAIL
- [ ] **Step 3: Implement** the four components.
- [ ] **Step 4: Validate and run** — autofixer on the four files, then vitest — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/atelier
git commit -m "feat(ui): the Atelier, its save rule, Clavier and Notifications" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 24: Atelier, Postes and Relier un poste

**Files:**
- Create: `ui/src/atelier/Postes.svelte` (from `screens/ecosysteme/Postes.svelte`), `ui/src/atelier/Relier.svelte`
- Test: `ui/src/atelier/Postes.test.ts`

**Interfaces:**
- Consumes: `GET /api/satellites` (front address), `POST /api/satellites { url, code }`, `PUT /api/satellites/:id/front`, `GET /api/settings` `posts[id]` (with `pairedAt`) and `PATCH /api/settings { posts: { <satelliteId>: Partial<{ night; digest; capUsd; replyTimeoutS; liveUrgent }> } }` (slice 5), `DELETE /api/satellites/:id` (slice 2 Task 9, then `etat.read()`); `etat.state.posts` (agentName, states); `Reglage` (Task 23); kit `ConfirmDialog`, `Steps`, `CodeInput`, `TextInput`.
- Produces:
  - `Postes.svelte`: per linked post (`id="poste-<world>"`), one `SettingsCard`: role and « Relié depuis le 27 octobre » (`pairedAt`); Agent (read-only, no line when empty); Lui confier la veille de la nuit (bascule, `night`); Plafond du poste (champ, `capUsd`, empty = `null`, hint « Au-delà, plus rien ne lui est confié jusqu'à 05:00 »); Délai de réponse (champ, seconds, `replyTimeoutS`); Alertes urgentes en direct (bascule, `liveUrgent`); Bilan du jour (bascule, `digest`); « Adresse de sa page » (the old front address row, ruling 14); « État et diagnostic » (link to `/app/constellation/<world>`); Délier (`ConfirmDialog`, focus on Fermer, `confirmVariant="danger-plein"`, the prototype's text). A world to link: one row with Relier (→ `/app/atelier/postes/relier?poste=<world>`). No live state here.
  - `Relier.svelte` (page `/app/atelier/postes/relier`): `Steps` « Le poste », « Le code », « Vérification »; address field, then `CodeInput` (six digits shown by the post), a countdown, hint « Tu peux coller le code. »; errors « Il faut six chiffres. », the core's refusal text, « Code expiré. Demande un nouveau code au poste. »; on success: `nav.go('/app/constellation/<world>')` and toast « Lun'Ira est relié. ».

- [ ] **Step 1: Write the failing tests**

```ts
it('one template per linked post, the agent only when declared', async () => { /* two posts, one agentName 'Iris' → one 'Agent' row */ });
it('a toggle saves per post in settings', async () => { /* click 'Lui confier la veille de la nuit' → PATCH body { posts: { lunacedia: { night: true } } } */ });
it('Délier goes through the confirmation band, focus on Fermer', async () => { /* click Délier → alertdialog, Fermer focused */ });
it('Relier: six digits are required', async () => { /* code '123' → 'Il faut six chiffres.' */ });
it('Relier: success opens the post in the Constellation and says so', async () => { /* POST /satellites ok → pathname '/app/constellation/ira', toast 'Lun'Ira est relié.' */ });
it('no live state in the Atelier', async () => { expect(screen.queryByText(/ne répond pas|Réessayer/)).toBeNull(); });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/atelier/Postes.test.ts` — FAIL
- [ ] **Step 3: Implement** both components; hook `Relier` into `Atelier.svelte` when `lieu.relier`.
- [ ] **Step 4: Validate and run** — autofixer on `Postes.svelte`, `Relier.svelte`, `Atelier.svelte`, then vitest — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/atelier
git commit -m "feat(ui): Atelier Postes and the Relier page" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 25: Atelier, Dépenses et plafonds, Modèle et clé

**Files:**
- Create: `ui/src/atelier/Depenses.svelte`, `ui/src/atelier/ModeleCle.svelte` (from `screens/ecosysteme/`)
- Test: `ui/src/atelier/Depenses.test.ts`

**Interfaces:**
- Consumes: `etat.state.spend` (`SpendView`: `day.sources`, `week`) and `GET/PATCH /api/settings` with `dayCapUsd`, `monthCapUsd`, `atCap` (`'warn'` Prévenir seulement, `'pause'` Mettre en pause), `warnAt80`, and `posts[id].capUsd` for each post's « sur 1,00 $ » (slice 5); `PUT /api/settings/key`; `Reglage`; `dollars`, `dateLongue`, `heure`.
- Produces:
  - `Depenses.svelte`: Aujourd'hui (« remis à zéro à 05:00 ») by source (each post « 0,05 $ sur 1,00 $ », its cap from settings, « 0,05 $ » alone when `null`; « Natsume seule » is the `natsume` source with Conversation `chat` and lettre du matin `routines`); the last seven days in bars (CSS bars sized by `spend.week`, labelled for screen readers); Plafonds: Par jour (`id="plafond-jour"`, hint « Pour Natsume et tous ses postes »), Par mois (`id="plafond-mois"`), « Quand un plafond est atteint » (choix: Prévenir seulement, Mettre en pause), « Prévenir à 80 % du plafond » (bascule) with « Notifications non activées. » and a link to `/app/atelier/notifications`. Consequence lines while typing a cap below the spend: « Sous la dépense du jour (0,42 $) : pause jusqu'à 05:00. », « Sous la dépense du mois : pause jusqu'au 1er décembre. ». After a cap save: `etat.read()` (the band and the head follow).
  - `ModeleCle.svelte`: the model, the key (« Enregistrée le 27 octobre, se termine par 4f2a », or « Refusée à 14:10. Colle une nouvelle clé. »), its expiry, the reply length; the key is never shown again.

- [ ] **Step 1: Write the failing tests**

```ts
it('a cap below the spend shows its consequence', async () => {
  // spend.day.total 0.42
  await userEvent.clear(field('Par jour')); await userEvent.type(field('Par jour'), '0,30');
  expect(screen.getByText('Sous la dépense du jour (0,42 $) : pause jusqu’à 05:00.')).toBeInTheDocument();
});
it('saving it re-reads the state', async () => { /* Enter → PATCH { dayCapUsd: 0.3 } → GET /state called again */ });
it('amounts are dollars with two decimals', async () => { /* '0,05 $ sur 1,00 $' */ });
it('the key is never shown', async () => { /* only 'se termine par 4f2a' */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/atelier/Depenses.test.ts` — FAIL
- [ ] **Step 3: Implement** both components.
- [ ] **Step 4: Validate and run** — autofixer on both, then vitest — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/atelier
git commit -m "feat(ui): Atelier spend, caps, model and key" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 26: Atelier, Routines and Appareils

**Files:**
- Create: `ui/src/atelier/Routines.svelte`, `ui/src/atelier/Appareils.svelte` (from `screens/ecosysteme/`)
- Test: `ui/src/atelier/Appareils.test.ts`

**Interfaces:**
- Consumes: `GET /api/home` routines and `POST /api/routines/morning|night` (existing); `GET /api/clients`, `DELETE /api/clients/:id`, `POST /api/pairing-codes` (existing), `DELETE /api/pairing-codes/:code` (slice 2 Task 9); `Lieu.ajout`.
- Produces:
  - `Routines.svelte`: Veille de la nuit (05:00) and Lettre du matin (07:30): last run (`quand`), result, « Lancer maintenant » (also during a pause); a relaunched letter is a correction (the core decides; the UI says the result line it gets).
  - `Appareils.svelte`: « Un appareil reconnu voit tout Lun'Anima. », the list (badge « Cet appareil »), Révoquer (`ConfirmDialog`, focus on Fermer), « Ajouter un appareil » → `nav.go('/app/atelier/appareils?ajout=1')` which shows the code « 731 506 », « Valable encore 4:59. Un seul usage. » (live countdown m:ss) and « Annuler ce code ».

- [ ] **Step 1: Write the failing tests**

```ts
it('adding a device puts ?ajout=1 in the address and shows the code', async () => { /* code '731506' → '731 506', 'Valable encore 4:59. Un seul usage.' */ });
it('Révoquer asks first, focus on Fermer', async () => { /* … */ });
it('Lancer maintenant works during a pause', async () => { /* state.pause set → button enabled, POST /routines/morning */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/atelier/Appareils.test.ts` — FAIL
- [ ] **Step 3: Implement** both components.
- [ ] **Step 4: Validate and run** — autofixer on both, then `npx vitest run --project ui ui/src/atelier` — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/atelier
git commit -m "feat(ui): Atelier routines and devices" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 27: Natsume's fiche, the first launch and the unknown browser

**Files:**
- Create: `ui/src/lieux/Fiche.svelte`, `ui/src/lieux/MiseEnRoute.svelte`, `ui/src/lieux/Appareil.svelte` (from `Pair.svelte`)
- Test: `ui/src/lieux/Lieux.test.ts`

**Interfaces:**
- Consumes: `etat.state.route` (with `caps`, slice 5), `natsumeWord`, `GET /api/settings` (model), `pair()` (`session.ts`), `Steps`, `StandaloneCard`, `CodeInput`, `Badge`.
- Produces:
  - `Fiche.svelte` (`/app/natsume`): « Retour au Bureau », heading « Natsume », « Caractère, voix et apparence. Rien n'est encore réglable ici. »; left: monogram in the thin arcane frame, name, state; right: « Ce qui est vrai aujourd'hui » (Nom, Rôle « Comprend, confie aux postes, rapporte », Modèle with a link to `/app/atelier/modele`) and « Ce qui viendra » with the badge « bientôt » (Ton et caractère, Mémoire de la relation, Humeurs, Voix « Voix de synthèse, plus tard », Apparence). No tabs.
  - `MiseEnRoute.svelte` (`/app/mise-en-route`): header « 4 réglages avant de commencer. » counting the first four not done (ruling 2); rows checked by the state only: Cet appareil est reconnu, La clé du modèle (link Modèle et clé), Les plafonds with « Garder ces valeurs » (`PATCH /api/settings { capsKept: true }`, then `etat.read()`), Un premier poste relié (link Relier), Les notifications (badge « bientôt »), Un second appareil (facultatif, link Ajouter un appareil). Done: `nav.go('/app/', { replace: true })`.
  - `Appareil.svelte` (`/app/appareil`, no token): « Ce navigateur n'est pas encore reconnu », the device code field, « Rien de Lun'Anima n'est affiché avant la reconnaissance. », Entrer; `revoque`: heading « Cet appareil a été révoqué ». Props `{ revoque: boolean; onPaired: (token: string) => void }`.

- [ ] **Step 1: Write the failing tests**

```ts
it('the fiche says what is true today and what will come', () => { /* texts; no tablist */ });
it('first launch counts what is left, checked by the state only', () => {
  renderHost(MiseEnRoute, { state: coreState({ route: { device: true, key: false, caps: false, firstPost: false, secondDevice: false, done: false } }) });
  expect(screen.getByText('3 réglages avant de commencer.')).toBeInTheDocument();
  expect(screen.queryAllByRole('checkbox')).toHaveLength(0); // nothing to tick by hand
});
it('the unknown browser shows nothing of Lun'Anima', () => { /* only the code form */ });
it('a revoked device says so', () => { /* revoque → 'Cet appareil a été révoqué' */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/lieux/Lieux.test.ts` — FAIL
- [ ] **Step 3: Implement** the three components.
- [ ] **Step 4: Validate and run** — autofixer on the three, then vitest — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/lieux
git commit -m "feat(ui): Natsume's fiche, first launch and the device page" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 28: The palette and the help bar

**Files:**
- Create: `ui/src/shell/palette.ts`, `ui/src/shell/Aide.svelte`
- Test: `ui/src/shell/palette.test.ts`

**Interfaces:**
- Consumes: kit `PaletteCommand`; `CoreState`, `Queue` (first five), `MONDE`, `nameOf`, `worldOf`, `presenceLine`; `TOUCHES`.
- Produces:
  - `commandsOf(ctx: { state: CoreState | null; queue: Queue | null; monde: Monde; go: (href: string) => void; pause: () => void; resume: () => void; retry: (satellite: string) => void }): PaletteCommand[]` with groups (French group labels): « Lieux » (« Bureau, 13 à trancher », Constellation, Journal, Atelier, « Fiche de Natsume »), « Postes » (each linked post with its presence line or state), « Gestes » (Mettre en pause or Reprendre, or Relever le plafond; « Réessayer Lun'Acedia » only for a `muet` post; Relier un poste; Ajouter un appareil), « Réglages » (Plafond par jour, Plafond par mois, Modèle et clé, Raccourcis clavier → their Atelier address and fragment), « À trancher » (the five most pressing: urgent first then queue order; each opens `/app/?carte=…`). No command decides a card.
  - `Aide.svelte`: a one-line bar at the bottom of the page; on `focusin` it reads `document.activeElement.closest('[data-aide]')?.dataset.aide` and shows the keys of `TOUCHES` for that context (`file`: Flèches, V, R, Ctrl Z, E; `journal`: Flèches, Entrée, Ctrl F; `ciel`: Tab, Entrée; `atelier`: Flèches gauche et droite, Entrée, Échap; elsewhere: Ctrl K, E); inside a field (`saisie` or any input) it shows only Entrée, Maj Entrée, Échap. No message, no card reason.

- [ ] **Step 1: Write the failing tests**

```ts
it('groups places, posts, gestures, settings and the five most pressing', () => {
  const cmds = commandsOf(ctx());
  expect([...new Set(cmds.map((c) => c.group))]).toEqual(['Lieux', 'Postes', 'Gestes', 'Réglages', 'À trancher']);
  expect(cmds.find((c) => c.id === 'lieu:bureau')!.label).toBe('Bureau, 13 à trancher');
  expect(cmds.filter((c) => c.group === 'À trancher')).toHaveLength(5);
});
it('Réessayer only for a mute post', () => { /* one muet → 'Réessayer Lun'Acedia'; relie → none */ });
it('the help bar hides V and R while typing', async () => { /* focus textarea in data-aide=file → shows 'Entrée', not 'V' */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/shell/palette.test.ts` — FAIL
- [ ] **Step 3: Implement** both.
- [ ] **Step 4: Validate and run** — autofixer on `Aide.svelte`, then vitest — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/shell/palette.ts ui/src/shell/Aide.svelte ui/src/shell/palette.test.ts
git commit -m "feat(ui): palette groups and the help bar" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 29: The shell and the app, switched over

**Files:**
- Modify: `ui/src/shell/Shell.svelte` (rewritten), `ui/src/App.svelte` (rewritten)
- Modify: `ui/src/testing/core.ts` (`fakeCore` defaults no longer include `/map`, `/home` phrase)
- Test: `ui/src/App.test.ts` (rewritten), `ui/src/monde-neutre.test.ts`

**Interfaces:**
- Consumes: every store and place above.
- Produces:
  - `App.svelte`: without a token → `Appareil` at `/app/appareil` (`?revoque` after a 401: ruling 11); with one → creates `Etat`, `FileStore`, `Nav`, `PanneauConv`, `Fil`, `posts` and sets their contexts (`monde` = `MONDE` unless a `monde` prop is given — the hook for the neutral test); the `api` context's `send` and `stream` re-read `etat` and `file` after each call and dispatch `lun:changed`; `etat.start()`; `installEchap()`; redirects: `parseAddress().redirect` with `replaceState`, `/app/` → `/app/mise-en-route` while `state.route.done === false`; Natsume unreachable with no snapshot: an error screen « Natsume ne répond pas. » with Réessayer, no data.
  - `Shell.svelte`: desktop grid (§4.1) `grid-template-rows: auto 1fr; grid-template-columns: clamp(180px, 16vw, 240px) 1fr clamp(280px, 25vw, 360px)`, the band on the first row across; `Menu`, the page cell (`data-page`, `position: relative`, kit `Toaster contained` inside it — ruling 12 — and `Aide` at its bottom), `Colonne` with the place's word (`MotBureau` for bureau/trancher, `MotConstellation`, `MotJournal`, `MotAtelier`, `MotNatsume` for natsume and mise-en-route), `Conversation` and `Champ`. The place renders in a `{#key lieu.place}` block with a 180 ms opacity fade, none under `prefers-reduced-motion: reduce`. The palette (kit `CommandPalette`, lazy as today) with `commandsOf`. `/app/constellation/natsume` on a desktop calls `Colonne.focusMot()`. Phone chrome comes in Task 30.

- [ ] **Step 1: Write the failing tests**

```ts
it('/app/ shows the Bureau with the menu, the band and Natsume\'s column', async () => {
  fakeCore(); history.replaceState(null, '', '/app/'); render(App);
  expect(await screen.findByRole('heading', { name: /^À trancher/ })).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Lieux' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Écrire à Natsume' })).toBeInTheDocument();
});
it('one count everywhere, before and after a gesture and its undo', async () => {
  // state total 13 then 12 then 13; queue in step
  const counts = () => [menuCount(), titleCount(), paletteBureauCount()];
  expect(counts()).toEqual(['13', '13', '13']);
  await validateFirst(); expect(counts()).toEqual(['12', '12', '12']);
  await undo(); expect(counts()).toEqual(['13', '13', '13']);
});
it('E focuses Natsume\'s field on every place', async () => {
  for (const path of ['/app/', '/app/constellation', '/app/journal', '/app/atelier/postes', '/app/natsume']) { /* go(path), keyboard 'e', field has focus, conv etat !== 'agrandi' */ }
});
it('old addresses lead to the new ones', async () => { /* '/app/ecosysteme?theme=cle' → '/app/atelier/modele' */ });
it('an unfinished setup leads to the first launch', async () => { /* route.done false → '/app/mise-en-route' */ });
it('a 401 leads to the device page, revoked', async () => { /* GET /state 401 → '/app/appareil?revoque', heading 'Cet appareil a été révoqué' */ });
it('a reload during an outage shows the error without data', async () => { /* GET /state network error first → 'Natsume ne répond pas.' and no file */ });
// monde-neutre.test.ts — spec §12
it('with a neutral world the tool stays complete', async () => {
  fakeCore(); render(App, { props: { monde: MONDE_NEUTRE } });
  for (const name of ['Accueil', 'Carte', 'Historique', 'Réglages']) expect(await screen.findByRole('link', { name })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('link', { name: 'Carte' }));
  expect(screen.getAllByRole('link', { name: /^Lun'/ }).length).toBeGreaterThan(0); // posts placed by the neutral data
});
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/App.test.ts ui/src/monde-neutre.test.ts` — FAIL
- [ ] **Step 3: Implement** `Shell.svelte` and `App.svelte`; remove the old exports `Route`, `ROUTES`, `pathOf`, `routeFromPath` from `shell/routes.ts` and their old tests.
- [ ] **Step 4: Validate and run** — `npx @sveltejs/mcp svelte-autofixer ui/src/shell/Shell.svelte && npx @sveltejs/mcp svelte-autofixer ui/src/App.svelte && npx vitest run --project ui ui/src/App.test.ts ui/src/monde-neutre.test.ts ui/src/shell` — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/App.svelte ui/src/App.test.ts ui/src/monde-neutre.test.ts ui/src/shell ui/src/testing/core.ts
git commit -m "feat(ui): the places in one shell, the app switched over" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 30: The phone chrome

**Files:**
- Create: `ui/src/shell/TeteTel.svelte`, `ui/src/shell/BarreTel.svelte`
- Modify: `ui/src/shell/Shell.svelte` (phone layout), `ui/src/constellation/Constellation.svelte`, `ui/src/journal/Journal.svelte` (sheet addresses)
- Test: `ui/src/shell/Telephone.test.ts`

**Interfaces:**
- Consumes: `Nav` (phone), `natsumeWord`, `queueCount`, kit `BottomNav` (`countTone: 'neutre'`), `Detail` (sheet form), `Conversation`, `Champ`, `raisonChamp`, `pushCouche('feuille')`.
- Produces:
  - `TeteTel.svelte`: monogram (link `/app/natsume`), place name with Natsume's state under it, the search button (palette). The band sits under it.
  - Bottom navigation (n° 64): Bureau, À trancher (with its counter, neutral), Journal, Atelier.
  - `BarreTel.svelte`: « Écrire à Natsume » bar above the navigation on every page (or `raisonChamp` when disabled); it opens a sheet (header « Natsume » and state, Replier, thread, topics, field). Opening any sheet (conversation, a post, Natsume, a Journal entry) pushes a history entry (`history.pushState({ feuille: true }, '')` for the conversation; the address of the detail for the others), so Android's Back closes the sheet before leaving the place.
  - Constellation on a phone: the star list; a post or Natsume opens the sheet (ruling 13 for Natsume). Journal on a phone: filters folded under « Filtres »; an entry opens as a sheet.

- [ ] **Step 1: Write the failing tests**

```ts
// matchMedia stubbed to phone
it('the bottom navigation has four places, the counter in neutral', async () => { /* Bureau, À trancher 13, Journal, Atelier */ });
it('the conversation bar is on every page and Back closes its sheet first', async () => {
  for (const path of ['/app/', '/app/trancher', '/app/journal', '/app/atelier/postes']) { /* bar present */ }
  await userEvent.click(screen.getByRole('button', { name: 'Écrire à Natsume' }));
  expect(screen.getByRole('dialog', { name: 'Natsume' })).toBeInTheDocument();
  history.back(); await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(location.pathname).toBe('/app/atelier/postes');
});
it('a Journal entry and a post open as sheets; a card unfolds in place', async () => { /* … */ });
it('the header links the monogram to the fiche', async () => { /* href '/app/natsume' */ });
```

- [ ] **Step 2: Run to verify they fail** — `npx vitest run --project ui ui/src/shell/Telephone.test.ts` — FAIL
- [ ] **Step 3: Implement** the two components and the phone layout (`@media (max-width: 767.98px)`: single column, header, band, page, conversation bar, bottom navigation; `env(safe-area-inset-*)` kept as today).
- [ ] **Step 4: Validate and run** — autofixer on `TeteTel.svelte`, `BarreTel.svelte`, `Shell.svelte`, `Constellation.svelte`, `Journal.svelte`, then `npx vitest run --project ui` — no issue; PASS
- [ ] **Step 5: Commit**

```bash
git add ui/src/shell ui/src/constellation ui/src/journal
git commit -m "feat(ui): phone header, bottom navigation and Natsume's bar" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 31: Remove the old views, and the copy guard

**Files:**
- Delete: `ui/src/carte/` (all), `ui/src/screens/` (all), `ui/src/shell/Postes.svelte`, `ui/src/shell/Postes.test.ts`, `ui/src/shell/icons.ts`, `ui/src/shell/Shell.test.ts` (old), `ui/src/cards/` (all), `ui/src/natsume/Panneau.svelte`, `ui/src/natsume/Natsume.test.ts`, `ui/src/Pair.svelte`, `ui/src/Pair.test.ts` (its cases move to `lieux/Lieux.test.ts` if not already there), `ui/src/testing/CardHost.svelte`, `ui/src/testing/CarteHost.svelte`
- Modify: `ui/src/time.ts` (remove `hourOf`, `dayTitle` once no caller is left), `ui/src/testing/core.ts` (remove `mapDay`, `home` phrase), `lun-anima/CLAUDE.md` (« App au bureau » line)
- Create: `ui/src/copy.test.ts`

**Interfaces:**
- Produces: `copy.test.ts` (`// @vitest-environment node`) scanning every `ui/src/**/*.svelte` except `lib/ui` (the kit is checked in lun-docs):
  - no hex colour or `rgb(`/`rgba(` in a `<style>` block;
  - no `text-transform: uppercase`;
  - in the markup (outside `<script>` and `<style>`): no `·`, no `—`, no `→`, no `Pina`, no `/\bcore\b/i`, no `front`, no `heptagramme`, no « Envoyer la réponse ».

- [ ] **Step 1: Write the guard test**

```ts
it.each(svelteFiles())('%s keeps the copy and colour rules', (file) => {
  const { markup, style } = parts(read(file));
  expect(style).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
  expect(style).not.toMatch(/text-transform:\s*uppercase/);
  expect(markup).not.toMatch(/[·—→]|Pina|\bcore\b|\bfront\b|heptagramme|Envoyer la réponse/i);
});
```

- [ ] **Step 2: Run it to see what the old views break**

Run: `npx vitest run --project ui ui/src/copy.test.ts`
Expected: FAIL on files of `carte/`, `screens/` and others being deleted (and on any new file that slipped)

- [ ] **Step 3: Delete the old views, fix any new file the guard names, edit `CLAUDE.md`**

`CLAUDE.md` line « App au bureau : … » becomes: « App : cinq lieux (Bureau `/app/`, Constellation, Journal, Atelier, fiche de Natsume) et la colonne de Natsume ; au téléphone (767,98 px), Bureau, À trancher, Journal, Atelier en bas et une barre « Écrire à Natsume ». » `grep -rn "carte/\|screens/\|cards/\|Panneau.svelte\|Pair.svelte\|/map" ui/src` must return nothing.

- [ ] **Step 4: Run the whole UI suite and the type check**

Run: `npx vitest run --project ui && npm run check -w @lun-anima/ui`
Expected: PASS, `svelte-check found 0 errors and 0 warnings`

- [ ] **Step 5: Commit**

```bash
git add -A ui/src CLAUDE.md
git commit -m "refactor(ui): remove the map, the old journal and Écosystème" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 32: Full gate and browser check

**Files:** none new (fixes only, in the files they concern)

- [ ] **Step 1: Full gate**

Run: `npm test && npm run lint && npm run typecheck && npm run format:check`
Expected: all green

- [ ] **Step 2: Kit and token sync**

Run: `node ../lun-docs/tools/sync-tokens.mjs --check ui/src/lib/tokens.css && node ../lun-docs/tools/sync-kit.mjs --check ui/src/lib/ui`
Expected: `tokens: OK`, `kit: OK`

- [ ] **Step 3: Browser check (§14), Chrome on the local core**

Start the core (`npm run dev`) and the UI (`npm run dev:ui`); CrOliX signs in himself if a device code is asked (memory « Laisser la connexion à CrOliX »). At 1440×900, 1280×720 and 390×844, on each place: no console error, no horizontal scroll (`document.documentElement.scrollWidth === innerWidth`); the same À trancher number in the menu, the title, the phone tab, Natsume's star and the palette, before and after Valider, a batch and Annuler; E focuses the field on every place, the panel opens at a partial height, handle, Agrandir, Restaurer and Ranger work with mouse and keyboard, a reload restores height and state, the word keeps its width and scroll position; Escape closes one layer per press in the §4.9 order; the post panel covers the column with a shadow and the sky recentres; phone: conversation bar on every page, Back closes a sheet first. Compare each place with its prototype page in `maquettes/`.
Expected: every point holds; any miss is fixed in the file concerned and committed as `fix(ui): …` with the attribution line.

- [ ] **Step 4: Commit any fix** (one commit per fix, message `fix(ui): <what>`, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`)

---

## Self-review notes

- Spec coverage (slice 6 of §15): menu §4.2 (Task 7); band §4.3 (6, 8); column and panel §4.4 (9, 10, 11); words §6 (12, 13); detail panels §4.5 (14); toast §4.6 (consumed from slice 4, placed in 29); palette §4.7 and help bar §4.8 (28); keyboard §4.9 (5, used in 10, 16, 21, 23); phone §4.10 and §11 n° 64, n° 84 (18, 19, 21, 30); address tree §5 (4, 29); Bureau §6.1 (15–18); Constellation §6.2 (19, 20); Journal §6.3 (21, 22); Atelier §6.4 (23–26); fiche §6.5 and hors lieux §6.6 (27, 29); states by place §7 (6, 16, 19, 21, 23, 29); `--anima` §12 (1); world data and neutral test §12 (3, 29); removal §10 (31); acceptance §14 (29, 30, 32).
- Left to other slices: the toast and Ctrl Z kit change (slice 4), `/api/word` and pause/caps routes (slice 5), journal routes (slice 3), the satellites' own fronts under a core pause (slice 1).
- Not pinnable by a unit test: the visual « no reflow » of the word in a real layout and the 1024–1920 px fluid widths; Task 32's browser check covers them.
