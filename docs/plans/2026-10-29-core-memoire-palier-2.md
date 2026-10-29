# Core, chantier 5, palier 2 : la veille nocturne et la mémoire de la relation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chaque nuit à 5 h, le core relit la journée écoulée (fils, alertes, bilan d'Acedia), en tire
des observations neutres pour Lun'Avaritia et des souvenirs pour le journal de la relation, sans rien
perdre si le core était éteint, et sans écrire un souvenir deux fois.

**Architecture:** Dans lun-anima, un dossier `core/src/memory/` (masquage des secrets, journal,
portrait) et un dossier `core/src/routines/` (moteur à heure fixe, veille nocturne). La veille découpe
sa période en journées de Natsume ; chaque journée avance par **parties** (la journée, et le bilan
d'Acedia s'il manquait) et chaque partie par **étapes** notées en base (tri, envoi, journal) : une
reprise ne refait que ce qui manque. Le tri est un seul appel au modèle, en sortie JSON validée. Les
satellites ne changent pas : `day.digest` (Acedia) et `brain.ingest` (Avaritia) existent déjà.

**Tech Stack:** Node, Hono, node:sqlite, SDK `openai`, zod 4 ; Vitest. Monorepo à workspaces npm.

**Spec:** lun-docs `docs/specs/2026-10-29-core-memoire-routines-design.md` (§3 palier 2, §4, §5, §8) ;
contrat `standards/contrat-satellite.md` (v1.1 : `day.digest`) ; schéma d'entrée de `brain.ingest`
dans lun-avaritia `server/src/brain/ingest.ts` (`version: 1`, 1 à 500 observations, texte de 2 000
caractères au plus, `source.kind: 'core'`).

## Global Constraints

- La veille tourne à **5 h, heure de Paris**, et couvre **de la fin de la dernière veille réussie**
  jusqu'au début de la journée de Natsume en cours (`dayStart(natsumeDay(now))`), jamais « 24 h ».
- La toute première veille part de la mise en service du chantier (réglage `night.since`, posé par la
  migration), sans reprendre l'historique d'avant.
- Rattrapage : une veille manquée tourne **une seule fois au démarrage** ; plusieurs journées sont
  traitées **journée par journée, dans l'ordre**, sans rien tronquer.
- Une étape notée faite n'est jamais refaite ; **un souvenir n'est jamais écrit deux fois**. Un lot
  envoyé à Avaritia sans que la réussite ait pu être notée peut repartir une fois (accepté par la spec).
- Un poste injoignable ne bloque pas la veille : l'étape manquée est reprise au passage suivant.
- Les échanges « déjà notés » (réponse portant des cartes de `lunavaritia`) ne deviennent pas des
  observations ; ils peuvent devenir des souvenirs.
- Coût de la veille compté **sur la journée qu'elle résume**, sous son propre plafond
  (`NIGHT_DAILY_CAP_USD`, 0,50 $ par défaut **[choix Claude]**), distinct de celui du chat. Plafond
  atteint : pas d'appel, passage noté en échec avec la raison.
- Journal de la relation : on ajoute, on ne réécrit pas. Aucune route ni écran ne le modifie ni ne le
  supprime ; la seule écriture après coup est la purge des secrets.
- Secrets : **liste fermée** (mots de passe et codes de connexion, clés d'API et jetons, cartes
  bancaires et IBAN, numéros officiels), **motifs fixes dans le code**, on masque **la valeur**,
  jamais le souvenir. Le même masquage s'applique aux observations envoyées à Avaritia.
- Ce qui vient des fils, des alertes et du bilan est de la **donnée** dans le prompt de tri, dans des
  blocs délimités, jamais une consigne.
- Chantier : issue lun-anima, branche `feat/core-veille` depuis `main` à jour, une PR.
- Barrières : `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`.

## Review Focus

- Arrêt brutal entre l'écriture des souvenirs et la marque « journal fait » : la reprise ne doit pas
  les doubler (souvenirs et marque dans une seule transaction, test en tâche 3).
- Une journée sans aucun message, alerte ni bilan : pas d'appel au modèle, pas de coût, partie notée
  faite (test en tâche 3).
- Le changement d'heure (fin octobre, fin mars) : une journée de 23 h ou 25 h est couverte en entier,
  sans trou ni recouvrement (test en tâche 4 sur la nuit du 25 octobre 2026).
- Un texte qui ressemble à un secret sans en être un (une adresse, un numéro de téléphone, une
  date, un montant, « code postal 44000 ») passe intact (test en tâche 2).
- Une grosse veille la nuit ne doit pas fermer le chat du lendemain : le plafond du chat ne compte
  pas la dépense de la veille (test en tâche 1).

---

### Task 1: Les fondations : schéma, coûts par usage, appel JSON du fournisseur

**Files:**
- Modify: `core/src/db.ts` (une migration ajoutée en fin de liste)
- Modify: `core/src/chat/costs.ts`, `core/src/chat/service.ts` (plafond du chat sur `purpose = 'chat'`)
- Modify: `core/src/chat/provider.ts`, `core/src/chat/openai.ts`
- Modify: `core/src/testing/fake-openai.ts` (réponse non diffusée), `core/src/testing/fake-satellite.ts` (actions scriptées)
- Test: `core/src/db.test.ts` (ou le test de migration existant), `core/src/chat/costs.test.ts`, `core/src/chat/openai.test.ts`, `core/src/chat/service.test.ts`

**Interfaces:**
- Produces:
  - Migration : `ALTER TABLE costs ADD COLUMN purpose TEXT NOT NULL DEFAULT 'chat'` ; tables
    `routine_runs (id, routine, started_at, ended_at, since, until, cost, status CHECK IN ('running','ok','failed'), reason)`,
    `night_parts (day, part CHECK IN ('day','digest'), input TEXT, tri TEXT, tri_at, ingest_at, journal_at, PRIMARY KEY (day, part))`,
    `memories (id, day, at, text, source, reaction, created_at)`,
    `portraits (id, text, last_memory INTEGER, created_at)` ; réglage `night.since` posé à l'heure de
    la migration.
  - `recordCost(db, { at, provider, model, amount, purpose?: 'chat' | 'night' })` (défaut `'chat'`) ;
    `spentSince(db, since, purpose = 'chat')` ; `spentOn(db, since: Date, until: Date, purpose)`.
  - `ChatProvider.complete(req: CompleteRequest): Promise<{ text: string; inputTokens: number; outputTokens: number }>`
    avec `CompleteRequest = { model; turns; maxTokens; schema: { name: string; schema: Record<string, unknown> } }`.
    OpenAI : `response_format: { type: 'json_schema', json_schema: { name, schema, strict: true } }`,
    sans flux, mêmes erreurs (`toProviderError`).
  - `FakeOpenAi.json(value, usage?)` (une réponse non diffusée) ; `FakeSatellite.queueAction(name, reply: Scripted<unknown>)`
    et `actionBodies: { name; body }[]`.

- [ ] **Step 1: Write the failing tests**

```ts
it('keeps the chat cap on chat spend only', () => {
  recordCost(db, { at: NOW, provider: 'openai', model: 'm', amount: 0.4 });
  recordCost(db, { at: NOW, provider: 'openai', model: 'm', amount: 9, purpose: 'night' });
  expect(spentSince(db, new Date(0))).toBeCloseTo(0.4);
  expect(spentSince(db, new Date(0), 'night')).toBe(9);
});

it('asks for a JSON answer in the given schema, without streaming', async () => {
  const { fake, provider } = setup();
  fake.json({ ok: true });
  const r = await provider.complete({ ...request, schema: { name: 'tri', schema: { type: 'object' } } });
  expect(JSON.parse(r.text)).toEqual({ ok: true });
  expect(fake.requests[0]?.body).toMatchObject({
    stream: false,
    response_format: { type: 'json_schema', json_schema: { name: 'tri', strict: true } },
  });
});
```

Dans `service.test.ts` : une dépense `purpose: 'night'` au-delà du plafond du chat n'empêche pas une
réponse. Test de migration : après `openDb(':memory:')`, `night.since` existe et les quatre tables aussi.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run core/src/chat`
Expected: FAIL (`purpose`, `complete`, `fake.json` inconnus).

- [ ] **Step 3: Implement**

Le commentaire de `createOpenAiProvider` est remonté au-dessus de la fonction (la constante
`REASONING_OFF_WITH_TOOLS` s'était glissée entre les deux).

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, les tests existants du chat et des coûts compris.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(core): night storage, spend by purpose and JSON answers from the provider"
```

### Task 2: Le masquage des secrets

**Files:**
- Create: `core/src/memory/secrets.ts`
- Test: `core/src/memory/secrets.test.ts`

**Interfaces:**
- Produces: `maskSecrets(text: string): string` : chaque valeur reconnue devient `[masqué]`, le reste
  du texte est rendu octet pour octet.

La liste fermée, et rien d'autre :
- **mot de passe et code de connexion** : la valeur qui suit « mot de passe », « mdp », « password »,
  « code (de connexion | de vérification | 2FA | reçu par SMS | Wi-Fi) », « PIN » (avec `:`, `est`,
  `=` ou un espace) ;
- **clé d'API et jeton** : préfixes connus (`sk-`, `sk-ant-`, `ghp_`, `gho_`, `github_pat_`, `xox[abp]-`,
  `AKIA`, `AIza`), `Bearer <jeton>`, JWT (`eyJ….….…`) ;
- **carte bancaire** : 13 à 19 chiffres, espaces ou tirets permis, **clé de Luhn valide** ;
- **IBAN** : pays + 2 chiffres + 11 à 30 caractères, **contrôle mod 97 valide** ;
- **numéro officiel** : n° de sécurité sociale (15 chiffres, 1 ou 2 en tête, clé valide), et la valeur
  qui suit « passeport » ou « carte d'identité ».

- [ ] **Step 1: Write the failing tests**

```ts
it.each([
  ['Le mot de passe du Wi-Fi est Tr0ub4dor&3', 'Le mot de passe du Wi-Fi est [masqué]'],
  ['mdp : hunter2', 'mdp : [masqué]'],
  ['mon code 2FA 482913', 'mon code 2FA [masqué]'],
  ['clé sk-proj-abcdefghijklmnopqrstuv1234', 'clé [masqué]'],
  ['carte 4970 1012 3456 7890', 'carte [masqué]'], // Luhn valide dans le test réel
  ['IBAN FR76 3000 6000 0112 3456 7890 189', 'IBAN [masqué]'],
])('masks %s', (input, out) => expect(maskSecrets(input)).toBe(out));

it.each([
  '12 rue des Lilas, 44000 Nantes',
  'Appelle Paul au 06 12 34 56 78',
  'Rendez-vous le 29/10/2026 à 14 h',
  'Facture de 1 234,56 €',
  'Il a une angine, il est fatigué',
  'Je vote écolo',
  'Commande 1234567890123', // 13 chiffres, Luhn faux
])('leaves %s untouched', (text) => expect(maskSecrets(text)).toBe(text));
```

Les numéros des tests sont fictifs et choisis pour que les clés (Luhn, mod 97) soient valides ou
fausses comme annoncé.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run core/src/memory/secrets.test.ts`
Expected: FAIL, le module n'existe pas.

- [ ] **Step 3: Implement `maskSecrets`**

Expressions régulières par famille, appliquées dans l'ordre ci-dessus ; cartes et IBAN vérifiés par
leur clé avant masquage. Aucun appel au modèle.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run core/src/memory/secrets.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(core): mask a closed list of secrets"
```

### Task 3: Une journée de veille, partie par partie

**Files:**
- Create: `core/src/routines/night-day.ts`, `core/src/routines/tri.ts` (prompt et schéma du tri)
- Create: `core/src/memory/journal.ts`
- Test: `core/src/routines/night-day.test.ts`, `core/src/memory/journal.test.ts`

**Interfaces:**
- Consumes: tâche 1 (`complete`, `recordCost` avec `purpose`, `spentOn`, tables), tâche 2 (`maskSecrets`) ;
  `natsumeDay`, `dayStart` (`chat/day.ts`) ; `SatelliteManager.client(id)` et `SatelliteClient.invoke`.
- Produces:
  - `addMemories(db, day: string, items: { text; source; at }[])` et `listMemories(db, opts)` ;
    aucune fonction de modification ni de suppression.
  - `runNightDay(deps: NightDeps, day: string): Promise<DayOutcome>` avec
    `NightDeps = { db; clock; provider?: ChatProvider; model; prices; capUsd; satellites: SatelliteManager; log }`
    et `DayOutcome = { status: 'done' | 'pending' | 'failed'; reason?: string; cost: number }`.

Ce que fait `runNightDay(day)`, pour la période `[dayStart(day), dayStart(jour suivant)[` :

1. **Partie `day`** (créée à la première visite) :
   - entrée, figée à la première visite : messages `ok` de tous les fils de la journée (avec la marque
     `deja_note` quand la réponse porte une carte de `lunavaritia`), alertes `urgent` reçues dans la
     période, et le bilan d'Acedia (`day.digest { since, until }`) s'il répond. S'il ne répond pas, la
     partie `digest` est créée, vide, pour plus tard ;
   - **tri** : si l'entrée est vide, rien n'est appelé et la partie est faite. Sinon, plafond vérifié
     sur `spentOn(day, 'night')`, puis un appel `complete` ; le résultat validé (zod) est gardé dans
     `tri`, le coût compté `purpose: 'night'` à `dayStart(day)` ;
   - **envoi** : les observations, masquées, partent à `lunavaritia` par `brain.ingest`
     (`{ version: 1, observations: [{ text, source: { kind: 'core', origin, ref, at } }] }`, par
     paquets de 500). Avaritia injoignable : l'étape reste à faire, la journée est `pending` ;
   - **journal** : les souvenirs, masqués, et la marque `journal_at` dans **une seule transaction**.
2. **Partie `digest`** (si elle existe et que son entrée est vide) : nouvelle tentative de
   `day.digest` ; s'il répond, la partie suit les mêmes étapes, sur le bilan seul.

Le tri rend `{ observations: { text, ref }[], souvenirs: { text, ref }[] }` : `ref` est la référence
d'un élément de l'entrée (`m<id>`, `e<id>`, `d<index>`), qui donne la source (`origin`) et l'heure
(`at`) de l'observation ou du souvenir. Une `ref` inconnue fait échouer la validation ; une réponse
invalide est redemandée une fois, puis la journée échoue. Le prompt système est une constante
(wiki ou relation, règle des `deja_note`, données entre balises) ; l'entrée est dans le message
utilisateur, en blocs `<messages>`, `<alertes>`, `<bilan>`.

- [ ] **Step 1: Write the failing tests**

Noms et assertions :
- `sends observations to Lun'Avaritia and writes memories, masked` : `fake.actionBodies` contient un
  `brain.ingest` dont le texte ne contient pas le mot de passe dit dans un message ; `listMemories`
  rend le souvenir avec `[masqué]`.
- `does not turn an exchange already noted into an observation` : le message `deja_note` est marqué
  dans l'entrée envoyée au modèle (`"deja_note": true`).
- `an empty day calls nothing and costs nothing` : aucun appel au fournisseur, partie faite, coût 0.
- `resuming after a crash never writes a memory twice` : on simule un arrêt après l'envoi (journal
  non fait), deux `runNightDay` successifs donnent les souvenirs une seule fois et un seul appel au
  modèle.
- `without Lun'Acedia the day goes on, its digest comes on a later pass` : premier passage sans
  bilan (partie `digest` créée), second passage avec Acedia joignable : un second tri sur le bilan
  seul.
- `without Lun'Avaritia the sending waits, the memories are written` : journée `pending`, souvenirs
  écrits ; au passage suivant, l'envoi part sans nouvel appel au modèle.
- `over the night cap, no call and the day fails with the reason` : `status: 'failed'`, `reason`
  contient « plafond ».
- `the night spend is counted on the day it summarizes` : coût enregistré à `dayStart(day)`,
  `purpose: 'night'`.
- `an invalid answer is asked again once, then the day fails`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run core/src/routines core/src/memory`
Expected: FAIL, modules absents.

- [ ] **Step 3: Implement `runNightDay`, `addMemories`, `listMemories`, le prompt et le schéma du tri**

Le schéma de sortie est écrit avec zod (`z.strictObject`, champs `nullable` plutôt qu'optionnels, pour
le mode strict d'OpenAI) et passé par `z.toJSONSchema`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(core): the night pass of one day, step by step, into observations and memories"
```

### Task 4: La veille nocturne, le moteur des routines et le déclenchement

**Files:**
- Create: `core/src/routines/engine.ts`, `core/src/routines/night.ts`, `core/src/routines/routes.ts`, `core/src/cli/night.ts`
- Modify: `core/src/app.ts` (routes), `core/src/main.ts` (démarrage, arrêt), `core/package.json` (`"night"`), `README.md` (variable, commande, route)
- Test: `core/src/routines/engine.test.ts`, `core/src/routines/night.test.ts`, `core/src/routines/routes.test.ts`

**Interfaces:**
- Consumes: tâche 3 (`runNightDay`, `NightDeps`).
- Produces:
  - `runNight(deps: NightDeps): Promise<RunRecord>` : ouvre une ligne `routine_runs` (`running`),
    calcule `since` (le `until` de la dernière veille `ok`, sinon `night.since`) et
    `until = dayStart(natsumeDay(now))`, passe d'abord les journées qui ont une partie inachevée, puis
    chaque journée de `[since, until[` dans l'ordre, et ferme la ligne : `ok` si aucune journée n'a
    échoué (des parties `pending` n'empêchent pas `ok`), sinon `failed` avec la première raison.
    Une veille déjà `running` fait refuser la suivante.
  - `startRoutines({ clock, routines: Routine[], log }): () => void` avec
    `Routine = { name: string; hour: number; minute: number; run: () => Promise<unknown> }` : vérifie
    toutes les minutes **et au démarrage** si une routine est due, c'est-à-dire si aucune ligne de
    `routine_runs` de ce nom n'a commencé depuis sa dernière heure prévue (heure de Paris). Une veille
    en échec n'est pas relancée avant l'heure suivante.
  - `POST /api/routines/night` (jeton Bearer) : lance une veille tout de suite, rend le `RunRecord` ;
    409 si une veille tourne. `npm run night` appelle cette route, comme `npm run chat`.

- [ ] **Step 1: Write the failing tests**

- `engine` : `runs a missed routine once at start, not again before its next hour` (horloge à 9 h,
  dernière veille la veille à 5 h : un passage ; 9 h 01 : aucun ; lendemain 5 h : un passage) ;
  `a failed run waits for the next hour`.
- `night` : `covers from the end of the last good run to 5:00 today, day by day` (trois journées
  manquées : trois `runNightDay` dans l'ordre, une seule ligne `ok` avec `since`/`until` attendus) ;
  `the first run starts at night.since` ; `covers the 25-hour day of the DST change in full`
  (journée du 2026-10-25 : `since` 2026-10-25T03:00Z, `until` 2026-10-26T04:00Z) ;
  `a running night refuses a second one`.
- `routes` : `POST /api/routines/night needs a token, answers 409 while one runs`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run core/src/routines`
Expected: FAIL, modules absents.

- [ ] **Step 3: Implement**

`main.ts` démarre `startRoutines` avec la veille (`hour: 5, minute: 0`) après les satellites, et
l'arrête au `shutdown` avant `chat.settled()` ; une veille en cours est attendue dans le même délai de
10 s. `NIGHT_DAILY_CAP_USD` est lu comme `CHAT_DAILY_CAP_USD`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(core): the night watch at 5:00, catch-up at start, run on demand"
```

### Task 5: Le portrait

**Files:**
- Create: `core/src/memory/portrait.ts`
- Modify: `core/src/routines/night.ts` (dernière étape de la veille)
- Test: `core/src/memory/portrait.test.ts`

**Interfaces:**
- Consumes: tâches 1, 3, 4.
- Produces: `refreshPortrait(deps: NightDeps, day: string): Promise<'skipped' | 'written' | 'failed'>` :
  si le dernier portrait a plus de 7 jours (ou n'existe pas) et que le journal a des souvenirs plus
  récents que lui, un appel `complete` (portrait précédent + souvenirs depuis), dans le plafond de la
  journée `day`, ajoute une version. Les versions anciennes restent.

- [ ] **Step 1: Write the failing tests**

- `writes a first portrait from the journal, then not again within 7 days`.
- `keeps every version` (deux portraits à 8 jours d'écart : deux lignes).
- `without new memories, no call`.
- `the portrait never changes the journal` (journal identique avant et après).

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run core/src/memory/portrait.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `refreshPortrait` et l'appeler en fin de `runNight` (journée = dernière couverte)**

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(core): a weekly portrait of CrOliX from the journal"
```

### Task 6: La purge des secrets

**Files:**
- Create: `core/src/cli/purge-secrets.ts`
- Modify: `core/package.json` (`"purge-secrets"`), `README.md`
- Test: `core/src/cli/purge-secrets.test.ts`

**Interfaces:**
- Consumes: tâche 2 (`maskSecrets`), tâche 3 (`memories`), tâche 5 (`portraits`).
- Produces: `purgeSecrets(db): { memories: number; portraits: number }` : passe `maskSecrets` sur le
  texte de chaque souvenir et de chaque portrait, et ne réécrit que ceux qui changent. Le CLI ouvre la
  base directement (hors de l'app, comme `set-key`) et affiche les deux nombres.

- [ ] **Step 1: Write the failing tests**

- `masks a secret that got into the journal, and only that` : un souvenir avec un IBAN valide est
  masqué ; un souvenir sur la santé et un sur une adresse restent identiques ; `{ memories: 1 }`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run core/src/cli/purge-secrets.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(core): purge secrets from the journal, from the command line"
```

### Task 7: La preuve sur une vraie journée

**Files:**
- Modify: `docs/README.md` (la veille, la démarche de preuve)

**Interfaces:**
- Consumes: tâches 1 à 6 ; les trois serveurs en local avec les vraies clés (Acedia 8787, core 8788,
  Avaritia 8789).

- [ ] **Step 1: Une journée réaliste**

Dans `npm run chat`, une conversation fictive mais réaliste (un client, un rendez-vous, une humeur,
un « note que… », un mot de passe Wi-Fi), puis `npm run night`.
Expected: la ligne `routine_runs` est `ok` ; Avaritia a reçu un lot (« À valider » montre les
brouillons tirés des observations, aucun pour l'échange déjà noté) ; le journal a des souvenirs, le
mot de passe y est `[masqué]` ; le coût `night` de la journée est noté.

- [ ] **Step 2: Rattrapage**

Core arrêté, horloge réelle : relancer le core le lendemain après 5 h.
Expected: une veille au démarrage, une seule, qui couvre la période depuis la précédente.

- [ ] **Step 3: Acedia arrêtée**

`npm run night` avec Acedia arrêtée, puis relancée et `npm run night` à nouveau.
Expected: première veille `ok` sans bilan (partie `digest` en attente), la seconde envoie le bilan seul.

- [ ] **Step 4: Écrire la démarche et le coût mesuré dans `docs/README.md`, puis commit**

Le coût d'un lot réel d'Avaritia (resté ouvert au chantier 4) est relevé dans ses coûts après le
traitement du lot, et écrit dans la preuve.

```bash
git commit -m "docs(core): prove the night watch on a real day"
```

---

Le palier 3 (contexte chaud, point du matin, relances d'échéance) aura son plan, écrit une fois ce
palier mergé.
