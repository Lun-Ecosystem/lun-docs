# Core, chantier 5, palier 1 : Avaritia branchée au core

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Natsume confie à Lun'Avaritia « note ça » et les questions sur le savoir, comme elle confie
déjà le mail, l'agenda et les tâches à Lun'Acedia ; les cartes d'Avaritia arrivent par le relais
existant.

**Architecture:** Dans lun-anima, sans nouvelle route ni nouvelle table. Avaritia entre dans la table
des rôles du core (`chat/posts.ts`). Les deux règles fixes du prompt (`DELEGATION_RULE`,
`NO_POST_RULE`) deviennent une règle composée depuis les postes offerts et ceux qui manquent : une
Avaritia reliée sans Acedia ne doit pas laisser croire que le mail est joignable, et inversement.
Le parcours de délégation (un seul appel du modèle, résumé du poste, cartes relayées) ne change pas.

**Tech Stack:** Node, Hono, node:sqlite, SDK `openai`, zod ; Vitest. Monorepo à workspaces npm.

**Spec:** lun-docs `docs/specs/2026-10-29-core-memoire-routines-design.md` (§3, palier 1) ; contrat
`standards/contrat-satellite.md` (v1.1).

## Global Constraints

- Le chat garde **un seul appel au modèle par tour** : pas de boucle d'outils, la lecture du savoir
  passe par la délégation à l'agent d'Avaritia, qui cherche et lit lui-même.
- Le rôle d'Avaritia est **écrit dans la table des rôles du core**, comme celui d'Acedia : le contrat
  ne porte pas de rôle et les satellites ne changent pas.
- Natsume ne demande jamais de confirmation en conversation : la bretelle est la carte du poste.
- Le core n'affiche aucun nom d'agent d'Avaritia : son agent est neutre et se nomme dans ses réglages.
- « Déjà noté » n'a pas de marque propre : une réponse dont les cartes relayées viennent de
  `lunavaritia` est, par construction, un échange déjà noté. Le palier 2 lira cette marque ; ce palier
  garantit seulement que ces cartes sont stockées avec `satellite: 'lunavaritia'`.
- Chantier : issue lun-anima, branche `feat/core-avaritia` depuis `main` à jour, une PR.
- Barrières : `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`.

## Review Focus

- Avaritia reliée, Acedia absente : Natsume dit que le mail n'est pas joignable au lieu d'appeler
  `lunacedia` (test en tâche 1).
- Acedia reliée, Avaritia absente : un « note ça » ne part nulle part, Natsume dit que la mémoire n'est
  pas joignable (test en tâche 1).
- Un satellite inconnu de la table des rôles (une troisième app appairée) n'est jamais offert
  (test existant de `postsFrom`, gardé vert).
- Avaritia répond par une erreur ou un délai : le texte d'échec existant nomme `lunavaritia`, rien
  n'est stocké comme carte (test en tâche 1).

---

### Task 1: Avaritia, un poste du core

**Files:**
- Modify: `core/src/chat/posts.ts` (table `ROLES`, retirer le commentaire `shortcut:` devenu faux)
- Modify: `core/src/chat/prompt.ts` (remplacer `DELEGATION_RULE` et `NO_POST_RULE` par `postRule`)
- Modify: `core/src/chat/service.ts` (prompt système dans `#generate`)
- Test: `core/src/chat/delegation.test.ts`, `core/src/chat/service.test.ts`

**Interfaces:**
- Consumes: `Post`, `ROLES`, `postsFrom` existants (`chat/posts.ts`).
- Produces:
  - `ROLES.lunavaritia = "mémoire et fiches de l'écosystème : noter, chercher, lire"`.
  - `postRule(offered: Post[]): string` dans `chat/prompt.ts`, qui remplace `DELEGATION_RULE` et
    `NO_POST_RULE` (supprimés). Le prompt système devient `${SYSTEM_PROMPT} ${postRule(offered)}`.

- [ ] **Step 1: Write the failing tests**

Dans `delegation.test.ts`, remplacer les deux tests de règle par ceux-ci, et ajouter un `setup`
paramétré par l'identité du faux satellite (`setup({ id: 'lunavaritia', nom: "Lun'Avaritia" })`) :

```ts
it('gives Natsume the rule of the posts offered', async () => {
  const { openai, h } = await setup(); // Lun'Acedia
  openai.reply('ok');
  await ask(h);
  const system = systemOf(openai);
  expect(system).toBe(`${SYSTEM_PROMPT} ${postRule([{ id: 'lunacedia', role: ROLES.lunacedia! }])}`);
  expect(system).toContain('ne demande jamais de confirmation');
  expect(system).toContain(DELEGATE_TOOL);
  expect(system).toContain('mémoire et fiches'); // Avaritia named as out of reach
});

it('offers Lun’Avaritia for notes and knowledge, mail stays out of reach', async () => {
  const { openai, h } = await setup({ id: 'lunavaritia', nom: "Lun'Avaritia" });
  openai.reply('ok');
  await ask(h);
  const system = systemOf(openai);
  expect(system).toContain('lunavaritia');
  expect(system).toContain('note');
  expect(system).toMatch(/mail.*pas joignable/s);
});

it('relays the drafts of a note to Lun’Avaritia', async () => {
  const { fake, openai, h } = await setup({ id: 'lunavaritia', nom: "Lun'Avaritia" });
  openai.replyWithTools([call({ poste: 'lunavaritia', demande: 'Note que le studio a déménagé à Nantes.' })]);
  fake.queueAgent({ summary: 'Brouillon prêt.', cards: [NOTE_CARD], refs: [] });
  const stored = await ask(h, 'note que le studio a déménagé à Nantes');
  expect(fake.agentRequests[0]).toMatchObject({ request: 'Note que le studio a déménagé à Nantes.' });
  expect(stored.text).toBe('Brouillon prêt.');
  expect(stored.cards).toEqual([{ satellite: 'lunavaritia', card: NOTE_CARD }]);
});

it('says Lun’Avaritia could not be reached when its agent fails', async () => {
  const { fake, openai, h } = await setup({ id: 'lunavaritia', nom: "Lun'Avaritia" });
  openai.replyWithTools([call({ poste: 'lunavaritia', demande: 'Note que X.' })]);
  fake.queueAgent({ status: 503, error: 'en pause' });
  const stored = await ask(h, 'note que X');
  expect(stored.text).toBe(failure('en pause', 'lunavaritia'));
  expect(stored.cards).toBeUndefined();
});
```

Dans `service.test.ts`, sans poste : `SYSTEM` devient `${SYSTEM_PROMPT} ${postRule([])}`, et un test
vérifie que cette règle dit le mail, l'agenda, les tâches **et** la mémoire non joignables, sans
`DELEGATE_TOOL`.

`NOTE_CARD` est une carte du contrat d'Avaritia (`action: 'brain.draft'`, titre et lignes fictifs) ;
`systemOf(openai)` lit le premier tour du premier appel (factoriser les deux lectures existantes). Le
nom exact du corps reçu par `POST /agent` suit celui des tests existants (`fake.agentRequests`).

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run core/src/chat/delegation.test.ts core/src/chat/service.test.ts`
Expected: FAIL, `postRule` n'existe pas.

- [ ] **Step 3: Implement**

- `ROLES` : ajouter `lunavaritia` avec le rôle ci-dessus ; supprimer le commentaire `shortcut:`
  (la table reste la source des rôles, c'est la décision de la spec).
- `postRule(offered)` : deux parties.
  - Si des postes sont offerts : la règle de délégation actuelle, généralisée (« Pour toute demande qui
    relève d'un poste, appelle l'outil deleguer… »), plus une phrase par poste offert tirée d'une table
    de consignes : pour `lunavaritia`, « note ça » et toute question sur ce qui a été noté, les fiches,
    les personnes, les projets ; pour `lunacedia`, le mail, l'agenda et les tâches.
  - Pour chaque rôle de `ROLES` non offert : la phrase « … n'est pas joignable en ce moment : dis-le,
    ne prétends pas agir. », avec le rôle en clair (« le mail, l'agenda et les tâches », « la mémoire
    et les fiches »).
- `service.ts` : le prompt système utilise `postRule(offered)`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, tous les fichiers, dont les tests existants de délégation à Acedia.

- [ ] **Step 5: Commit**

```bash
git add core/src/chat
git commit -m "feat(core): Lun'Avaritia as a post, for notes and knowledge"
```

### Task 2: La preuve de bout en bout

**Files:**
- Modify: `docs/README.md` (ou le document de preuve existant du core) : la démarche ci-dessous.

**Interfaces:**
- Consumes: tâche 1 ; la démo d'Avaritia (`DEMO_FICHES=3000 npm run demo` dans lun-avaritia, port
  8798) et l'appairage existant du core (`npm run connect`).

- [ ] **Step 1: Relier le core à la démo d'Avaritia**

Run, dans lun-avaritia : `npm run demo` ; dans lun-anima : `npm run connect -- http://127.0.0.1:8798 <code>`
Expected: `npm run clients` (ou la santé du core) montre `lunavaritia` relié.

- [ ] **Step 2: « Note ça »**

Run: `npm run chat -- "note que le studio Exemple a déménagé à Nantes"`
Expected: la réponse est le résumé d'Avaritia ; une carte de brouillon apparaît dans `GET /api/cards`
du core et dans « À valider » d'Avaritia ; l'accepter depuis le core écrit la fiche.

- [ ] **Step 3: Une question sur le savoir**

Run: `npm run chat -- "qu'est-ce qu'on sait du studio Exemple ?"`
Expected: une réponse tirée des fiches de la démo, sans carte, en un seul appel du modèle côté core
(une ligne de coût pour ce tour dans `costs`).

- [ ] **Step 4: Écrire la démarche dans la doc du core, puis commit**

```bash
git add docs
git commit -m "docs(core): prove notes and knowledge through Lun'Avaritia"
```

---

Les paliers 2 (veille nocturne et mémoire de la relation) et 3 (contexte chaud et point du matin)
auront chacun leur plan, écrit une fois le palier précédent mergé, pour partir du code réel.
