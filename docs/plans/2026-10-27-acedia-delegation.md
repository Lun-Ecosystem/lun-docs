# Acedia, poste délégable : contrat v1.1 et paliers de notification

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lun'Acedia sert le contrat satellite v1.1 (délégation à Pina, cartes relayées, `day.digest`,
`Health.agent`) et émet chaque événement à son palier de notification.

**Architecture:** Les nouvelles routes du contrat réutilisent Pina telle qu'elle est : `ask` pour la
délégation, la décision de carte extraite des routes `/api/pina` dans une fonction partagée. Le texte
d'une carte (titre, champs) passe du front au serveur, qui le donne au core dans `Card.lines` ; le
front l'importe depuis le serveur. Les paliers se règlent là où chaque événement est émis.

**Tech Stack:** Node 22+, TypeScript strict, Hono, `node:sqlite`, zod 4, Svelte 5, Vitest.

**Spec:** lun-docs `standards/contrat-satellite.md` (v1.1), `standards/notifications.md`,
`docs/specs/2026-10-27-liaison-core-satellites-design.md` (§4, chantier 2).

## Global Constraints

- Dépôt public : aucune adresse mail réelle (`example.org`, `example.com` dans les tests), aucun secret.
- Une clé ne s'affiche que par ses 4 derniers caractères ; jamais d'envoi de mail par Pina.
- Une suppression est toujours une carte, quel que soit le mode.
- Chaque chantier : issue lun-acedia, branche `feat/acedia-delegation` depuis `main` à jour, une PR.
- Barrières : `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run check:colors`.
- Commits Conventional Commits en anglais.

## Review Focus

- Deux `accept` simultanés sur une même carte (core et front d'Acedia) : une seule exécution, l'autre `409`.
- Une carte d'hier acceptée depuis le core : `409` « Carte expirée », rien ne s'exécute.
- Un contexte de délégation hostile (clé inconnue, valeur de 5 000 caractères, `screen` inconnu) : `400`.
- Une délégation pendant la pause d'Acedia ou sans fournisseur de LLM : réponse propre, sans écriture.
- Un mail que seul le LLM juge urgent : jamais `urgent` dans le flux.

Chaque ligne a son test dans la tâche qui possède le code (tâches 2, 3 et 5).

---

### Task 1: Le texte des cartes passe au serveur

**Files:**
- Create: `server/src/pina/wording.ts` (déplacé de `views/src/lib/pina/cards.ts`, sans les icônes)
- Create: `server/src/pina/wording.test.ts` (les cas de `views/src/lib/pina/cards.test.ts` qui portent sur le texte)
- Modify: `views/src/lib/pina/cards.ts` (garde l'icône par action, réexporte le reste depuis le serveur)
- Modify: `views/src/lib/pina/cards.test.ts`

**Interfaces:**
- Produces : `describe(card: { action: string; input: unknown }, names: Names): { title: string; fields: CardField[]; done: string }`,
  `targetsOf(messages: ChatMessage[]): Map<string, Target>`, `cardLines(db: DatabaseSync, card: Card): string[]`
  (une ligne par champ, « Libellé : valeur », noms tirés des boîtes et des messages du jour de la carte).

- [ ] **Step 1:** Écrire `cardLines` test : une carte `mail.file` sur un mail lu dans le fil donne
  `['Mail : <sujet>', 'Boîte : Factures']` ; une carte `event.delete` donne la ligne de l'événement.
- [ ] **Step 2:** Lancer, voir échouer (`cardLines` absent).
- [ ] **Step 3:** Déplacer le texte (sans `Icon.ts`) dans `wording.ts`, adapter `targetsOf` aux messages
  du serveur, écrire `cardLines`. `views/.../cards.ts` importe `../../../../server/src/pina/wording.ts`
  (même procédé que `types.test.ts`) et n'ajoute que l'icône.
- [ ] **Step 4:** `npx vitest run server/src/pina views/src/lib/pina` : vert, front inchangé.
- [ ] **Step 5:** Commit `refactor(pina): card wording lives on the server`.

### Task 2: Cartes relayées et `Health.agent`

**Files:**
- Modify: `server/src/pina/agent.ts` (nouvelle `decideCard`), `server/src/pina/routes.ts` (l'utilise)
- Modify: `server/src/contract/routes.ts` (routes `cards`, `health`), `server/src/app.ts` (passe les deps de Pina)
- Modify: `server/src/types.ts`, `views/src/lib/types.ts` (types `ContractCard`)
- Test: `server/src/contract/cards.test.ts`

**Interfaces:**
- Consumes : `cardLines` (tâche 1).
- Produces : `decideCard(deps: PinaDeps, id: number, decision: 'accept' | 'refuse', input?: unknown): Promise<{ ok: true; card: Card } | { ok: false; status: 400 | 404 | 409; error: string }>` ;
  `toContractCard(db, card): ContractCard` avec `ContractCard = { id: string; action; effect: 'write' | 'delete'; title; lines: string[]; status; at; error?: string }`.

- [ ] **Step 1:** Tests dans `cards.test.ts` :
  - `GET /lun/v1/cards` rend les cartes en attente au format du contrat (id en texte, `lines` remplies) ;
  - `GET /lun/v1/cards?status=done` filtre ;
  - `accept` exécute et rend `status: 'done'` ; `refuse` rend `refused` ;
  - deux `accept` en parallèle : une seule exécution (un seul appel au faux Google), l'autre `409` ;
  - carte d'hier : `409` « Carte expirée » ; id inconnu : `404` ;
  - `accept { input }` sur une carte `delete` : `400` ;
  - `GET /lun/v1/health` porte `agent: true`.
- [ ] **Step 2:** Lancer, voir échouer.
- [ ] **Step 3:** Extraire le corps de `POST /api/pina/cards/:id` dans `decideCard` (expiration, édition,
  exécution, `resume`), refuser `input` sur `effect === 'delete'`, brancher les deux routes du contrat
  et `GET /lun/v1/cards?status=` (défaut `pending`, tous jours confondus, plus récentes d'abord).
- [ ] **Step 4:** `npx vitest run server/src/contract server/src/pina` : vert.
- [ ] **Step 5:** Commit `feat(contract): relayed cards and health.agent`.

### Task 3: La délégation `POST /lun/v1/agent`

**Files:**
- Modify: `server/src/pina/agent.ts` (`ask` accepte `{ mode?: 'validate' }`, rend le tour)
- Modify: `server/src/contract/routes.ts`
- Test: `server/src/contract/agent.test.ts`

**Interfaces:**
- Consumes : `toContractCard` (tâche 2).
- Produces : `ask(deps, text, context, opts?: { mode?: 'validate' }): Promise<number>` (rend l'id du tour).

- [ ] **Step 1:** Tests dans `agent.test.ts`, avec le faux fournisseur de Pina :
  - « Range ce mail dans Factures » avec `context: { screen: 'mail', mailId: 'm02' }` : réponse
    `{ summary, cards: [une carte pending mail.file], refs: [], cost: { currency: 'USD', amount } }` ;
  - Pina réglée en « faire tout de suite » : une délégation donne quand même une carte, rien n'est exécuté ;
  - contexte avec une clé inconnue, une valeur de plus de 200 caractères ou un `screen` inconnu : `400` ;
  - sans fournisseur configuré : `200`, `summary` dit qu'aucun LLM n'est réglé, aucune carte.
- [ ] **Step 2:** Lancer, voir échouer.
- [ ] **Step 3:** Route : valider `{ request: string (1 à 4 000), context?: { screen?, mailId?, day?, listId?, draftId? } }`
  avec les règles d'id de `pina/routes.ts`, appeler `ask(..., { mode: 'validate' })`, puis bâtir la réponse :
  `summary` = dernier message assistant du tour, `cards` = cartes du tour, `cost` = dépense de Pina avant / après.
  `refs: []` avec `// shortcut: refs empty until the core shows them, fill from the turn's read tools`.
- [ ] **Step 4:** `npx vitest run server/src/contract server/src/pina` : vert.
- [ ] **Step 5:** Commit `feat(contract): delegate a request to Pina`.

### Task 4: Le bilan du jour `day.digest`

**Files:**
- Modify: `server/src/contract/catalog.ts` (action `day.digest`, `effect: 'read'`), `server/src/contract/parity.ts` si le test de parité l'exige
- Test: `server/src/contract/digest.test.ts`

**Interfaces:**
- Produces : `day.digest({ since, until })` → `{ since, until, received: DigestItem[], done: DigestItem[], pending: number }`,
  `DigestItem = { type; title; at; ref?: { type; id; title } }`.

- [ ] **Step 1:** Tests : avec la démo, un intervalle d'un jour rend les mails reçus dedans (`type: 'mail'`),
  les entrées du journal (`type: 'journal.<action>'`) et les cartes faites (`type: 'card.<action>'`) ;
  `pending` = propositions en attente + cartes en attente ; `since` après `until` ou illisible : erreur `400`.
- [ ] **Step 2:** Lancer, voir échouer.
- [ ] **Step 3:** Écrire l'action (lecture seule, bornes `[since, until[` en UTC).
- [ ] **Step 4:** `npx vitest run server/src/contract` : vert, parité comprise.
- [ ] **Step 5:** Commit `feat(contract): day.digest`.

### Task 5: Chaque événement à son palier

**Files:**
- Modify: `server/src/types.ts`, `views/src/lib/types.ts` (`Importance = 'urgent' | 'normal' | 'low' | 'info' | 'log'`)
- Modify: `server/src/agenda/reminders.ts`, `agenda/tasks.ts`, `agenda/unified.ts`, `gmail/sync.ts`, `google/client.ts`,
  `keys/expiry.ts`, `llm/keys.ts`, `triage/pipeline.ts`
- Test: les tests existants de ces modules, plus `triage/pipeline.test.ts`

Table à appliquer (standard des notifications) :

| Type | Avant | Après |
|---|---|---|
| `agenda.reminder` | `normal` | `urgent` |
| `google.reauth`, `credit.exhausted` | `urgent` | `normal` |
| `key.expiring` | `normal` | `normal` à J-3, `low` à J-14 |
| `key.restored`, `mail.changed`, `agenda.changed`, `llm.unknown-price` | `info` | `log` |
| `mail.triaged` par une règle | `info` | `urgent` si la règle pose l'étiquette urgente, sinon `info` |
| `mail.triaged` par l'IA | avis du LLM | `normal` si le LLM le dit urgent, sinon `info` |
| `mail.pending` | avis du LLM | `normal` si le LLM le dit urgent, sinon `low` |

- [ ] **Step 1:** Tests : un mail que le LLM dit urgent n'émet jamais `urgent` ; une règle qui pose
  l'étiquette urgente émet `urgent` ; `key.expiring` à J-14 est `low` ; un rappel d'agenda est `urgent`.
- [ ] **Step 2:** Lancer, voir échouer.
- [ ] **Step 3:** Appliquer la table.
- [ ] **Step 4:** `npm test` : vert.
- [ ] **Step 5:** Commit `fix(events): each event at its notification tier`.

### Task 6: Le menu des rappels au-dessus de la fenêtre (#39), doc et barrières

**Files:**
- Modify: `views/src/lib/ui/Menu.svelte` (`z-index: 55` sur le contenu en portail)
- Test: `views/src/lib/agenda/ItemEditor.test.ts` (ou le test d'éditeur existant)
- Modify: `docs/pina.md` (« Pina, poste du core » : délégation, cartes relayées, mode forcé), `README.md` (contrat v1.1)

- [ ] **Step 1:** Test : ouvrir « + Rappel » dans l'éditeur ouvert, le menu est au-dessus (`z-index` calculé > 51) et un choix ajoute le rappel.
- [ ] **Step 2:** Lancer, voir échouer.
- [ ] **Step 3:** Corriger `Menu.svelte`, écrire la doc.
- [ ] **Step 4:** Toutes les barrières : vertes.
- [ ] **Step 5:** Commit `fix(views): reminder menu above the editor` puis `docs: Pina as a post of the core`.
