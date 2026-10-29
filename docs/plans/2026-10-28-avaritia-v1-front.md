# Lun'Avaritia v1, palier 2 : le front autonome

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un front complet, installable, sur le métier d'Avaritia : tableau de bord, À valider,
Mémoire (arborescence et graphe), Dépôts, Réglages, et l'agent en bulle flottante, servi par le
serveur du palier 1.

**Architecture:** Un seul workspace `app/` (Svelte 5 + Vite, PWA), comme celui d'Acedia mais sans
paquet de vues : depuis la spec de liaison, un satellite n'exporte plus de vues au core. Les
composants communs d'Acedia (`views/src/lib/ui`, jetons, `base.css`) sont **copiés** dans
`app/src/lib/ui`, jamais réécrits : deux satellites ne dépendent pas l'un de l'autre, et le standard
de design interdit les versions refaites. Le serveur gagne trois lectures pour le front
(`/api/drafts`, `/api/graph`, voisins dans `/api/fiches/:id`). Le graphe est chargé à part
(`import()`), seulement en mode Graphe.

**Tech Stack:** Svelte 5, Vite, vite-plugin-pwa, Bits UI, `@lucide/svelte`, Sigma.js 3 + graphology
(+ graphology-layout-forceatlas2 en worker), Vitest + Testing Library (jsdom), svelte-check.

**Spec:** lun-docs `docs/specs/2026-10-28-lun-avaritia-v1-design.md` (§3.3, §5, §10) ; maquette
validée le 2026-10-28 (`.superpowers/brainstorm/1285-1793175427/content/avaritia-ecrans.html` à la
racine de l'espace Lun') ; `standards/design.md` ; ADR 0006 (tâche 1).

## Global Constraints

- Dépôt **public** : aucune donnée réelle, ni dans les tests ni dans les captures (noms fictifs, `example.org`).
- Design : socle Lun' commun, couleur du monde en **accent seulement** (`#1A3070`, jetons `/* @monde avaritia */` de `design/tokens.css`). Chaque écran ne s'assemble qu'avec les composants copiés d'Acedia ; un composant manquant s'ajoute à `app/src/lib/ui` dans le style des autres, jamais en ligne dans un écran.
- Polices Cormorant Garamond et Inter auto-hébergées (`@fontsource`), aucune ressource d'un CDN ; pas d'`alert`, `confirm`, `prompt` natifs.
- Ton : voix technique neutre, phrases courtes, pas de « tu », pas de tiret cadratin ; nom affiché « Lun'Avaritia ». Le front ne parle ni d'Anima ni de Natsume : il vit sans le core, qui n'apparaît que comme « le core » (lots, liaison).
- **Jamais de `{@html}`** sur un texte venu de la base (titre, synthèse, fait, nom de dépôt) : ces textes viennent d'un LLM, d'un import ou d'un document. La synthèse Markdown est découpée en jetons et rendue par Svelte.
- Rien n'entre sans validation : le front n'écrit dans les fiches que par l'édition de l'utilisateur (`PATCH /api/fiches/:id`) ou par `accept` d'une carte.
- Toutes les requêtes portent le jeton d'appareil ; un 401 renvoie à l'écran d'appairage et efface le jeton.
- Navigation : rail à gauche en bureau, barre du bas sous 760 px ; agent en bulle flottante en bas à droite sur tous les écrans.
- Chaque morceau du build sous 500 kB : le graphe et les réglages des modèles sont chargés à la demande, le seuil de Vite n'est pas relevé.
- Barrières : `npm test`, `npm run typecheck` (tsc + svelte-check `--fail-on-warnings`), `npm run lint`, `npm run format:check`, `npm run build`.

## Review Focus

- Une synthèse ou un titre contenant `<img src=x onerror=…>` ou `<script>` s'affiche en texte brut, partout (fiche, carte, graphe, agent). Test en tâche 5.
- Valider une carte déjà tranchée ailleurs (le core l'a acceptée) : 409, message « Déjà tranché ailleurs », la file se recharge, pas d'écran cassé. Test en tâche 5.
- Jeton révoqué depuis un autre appareil : le prochain appel rend 401, l'app revient à l'appairage sans boucle. Test en tâche 2.
- Première ouverture, base vide et aucune clé : chaque écran affiche un état vide qui explique (tableau de bord : « aucune nuit traitée », graphe : « aucune fiche »), sans erreur. Tests en tâches 4, 6 et 7.
- Import d'un dossier avec des fichiers non Markdown ou de plus de 20 Mo : les non-`.md` sont ignorés et comptés, le dépassement est refusé avant l'envoi avec un message. Test en tâche 8.

---

### Task 1: ADR 0006, la bibliothèque du graphe (lun-docs)

**Files:**
- Create: `lun-docs/adr/0006-graphe-sigma.md`
- Modify: `lun-docs/adr/README.md`, `lun-docs/standards/design.md` (table « Bibliothèques retenues »)

**Interfaces:**
- Produces: le choix Sigma.js 3 + graphology + graphology-layout-forceatlas2 (worker), consommé par la tâche 6.

- [ ] **Step 1: Écrire l'ADR** au format des ADR 0004 et 0005 (Contexte, Options, Décision, Conséquences). Contexte : spec §5, des milliers de fiches, fluide en déplacement, zoom, filtres, centrage, sur le NAS servi au navigateur (le rendu est côté client, le serveur ne calcule rien). Options : Sigma.js + graphology (WebGL), Cytoscape.js (Canvas, ralentit au-delà de quelques milliers), d3-force + SVG (lent au-delà de quelques centaines de nœuds), vis-network (Canvas, maintenance faible). Décision : Sigma.js 3 + graphology, mise en page ForceAtlas2 dans un worker, positions non stockées en v1 (recalculées à l'ouverture). Conséquences : chargé à part (`import()`), pas de rendu sans WebGL (message d'état vide), habillage par les jetons (couleurs lues sur `:root`).
- [ ] **Step 2: Ajouter la ligne** « Graphe de fiches | **Sigma.js 3 + graphology** (WebGL), ADR 0006 » à la table des bibliothèques de `standards/design.md`, et l'entrée à `adr/README.md`.
- [ ] **Step 3: Vérifier** : `npm run check` → `check: OK` ; `npm run sync:check` → `sync: OK`.
- [ ] **Step 4: Commit** `docs: graph library ADR for Avaritia (Sigma.js + graphology)`.

### Task 2: Le squelette du front (lun-avaritia)

**Files:**
- Create: `app/` (package `@lun-avaritia/app` : `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `catalogue.html`, `public/icon-192.png`, `public/icon-512.png`, `scripts/icons.mjs`), `app/src/main.ts`, `app/src/App.svelte`, `app/src/session.ts`, `app/src/api.ts`, `app/src/Pair.svelte`, `app/src/Authorize.svelte`, `app/src/authorization.ts`, `app/src/shell/Shell.svelte`, `app/src/shell/routes.ts`, `app/src/lib/ui/**`, `app/src/lib/{tokens.css,base.css,styles.css}`, `app/src/catalogue/*`, `app/vitest.setup.ts`
- Modify: `package.json` (workspace `app`, `typecheck` lance `npm run check -w @lun-avaritia/app`), `vitest.config.ts` (projet `app/vite.config.ts`), `eslint.config.js` et `.prettierrc` (Svelte, comme Acedia), `.github/workflows/ci.yml` si le build doit précéder le contrôle
- Test: `app/src/session.test.ts`, `app/src/api.test.ts`, `app/src/App.test.ts`, `app/src/Pair.test.ts`, `app/src/Authorize.test.ts`

**Interfaces:**
- Consumes: routes du palier 1 (`/lun/v1/pair`, `/lun/v1/authorize`, `/api/*` avec jeton d'appareil, `/lun/v1/*`).
- Produces:
  - `createApi(baseUrl: string, token: string, opts?: { onUnauthorized?: () => void; fetch?: typeof fetch }): Api` dans `app/src/api.ts`, avec `get<T>(path)`, `send<T>(method, path, body?)`, `upload<T>(path, form: FormData)` ; erreurs `ApiError { status: number; message: string }` (message = `error` du JSON) et `UnauthorizedError`.
  - `Route = 'tableau' | 'valider' | 'memoire' | 'depots' | 'reglages'`, `routeFromPath(path: string): Route`, `pathOf(route: Route): string` (`/`, `/valider`, `/memoire`, `/depots`, `/reglages`) dans `app/src/shell/routes.ts`.
  - `Shell.svelte` props `{ route: Route; counts: { valider: number; fiches: number }; status: { paused: boolean; core: boolean }; children: Snippet }` : rail (marque « Lun'*Avaritia* », cinq entrées avec compteurs, carte d'état du service) en bureau, `BottomNav` sous 760 px, emplacement de la bulle d'agent en bas à droite.
  - Contexte Svelte `api` (`setContext('api', api)`) lu par chaque écran.

- [ ] **Step 1: Copier depuis lun-acedia** `views/src/lib/ui/**`, `views/src/lib/base.css`, `views/src/lib/styles.css`, `views/vitest.setup.ts`, et prendre `tokens.css` de lun-docs `design/tokens.css` avec le monde avaritia (`node ../lun-docs/tools/sync-tokens.mjs --monde avaritia` ou équivalent, sans toucher au fichier de lun-docs). Retirer de la copie ce qui est propre au mail (`DayGroup`, `AutoMark`, `ProposalChip` si aucun écran ne s'en sert à la fin de la tâche 9 : décision en tâche 10). Adapter les imports, rien d'autre.
- [ ] **Step 2: Tests d'abord** :
  - `session.test.ts` : `saveToken` puis `loadToken` rend le jeton ; `clearToken` le retire ; `pair(fetch, code)` poste `{ code, name }` sur `/lun/v1/pair` et rend le jeton ; un 401 rend `REFUSED_CODE`.
  - `api.test.ts` : l'en-tête `Authorization: Bearer <jeton>` part sur chaque appel ; un 401 appelle `onUnauthorized` une seule fois et lève `UnauthorizedError` ; un 409 `{ error: 'X' }` lève `ApiError` avec `status 409` et `message 'X'` ; un corps non JSON en erreur donne `message` = texte du statut.
  - `App.test.ts` : sans jeton, l'écran d'appairage s'affiche ; avec jeton, le shell s'affiche sur la route de l'URL ; **un 401 en cours de route efface le jeton et revient à l'appairage, sans boucle** (le faux `fetch` compte les appels) ; `?authorize=…` affiche la page d'autorisation du core (même logique qu'Acedia).
  - `Pair.test.ts`, `Authorize.test.ts` : repris d'Acedia, textes adaptés (« Lun'Avaritia »), aucune mention d'Anima.
- [ ] **Step 3: Lancer** `npx vitest run --project app` → échec (modules absents).
- [ ] **Step 4: Écrire** `api.ts`, `session.ts`, `routes.ts`, `App.svelte`, `Pair.svelte`, `Authorize.svelte`, `Shell.svelte` en partant de ceux d'Acedia (`app/src`), écrans encore vides (`EmptyState`). Manifeste PWA : `name: "Lun'Avaritia"`, `short_name: 'Avaritia'`, `theme_color: '#1A3070'`, `background_color: '#0D0B09'`, `navigateFallbackDenylist` `/api/`, `/lun/`. Proxy de dev vers `http://localhost:8789`. Icônes générées par `scripts/icons.mjs` à la couleur du monde.
- [ ] **Step 5: Lancer** `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build` → tout vert, `app/dist/index.html` présent, le serveur le sert (`npm run dev`, `GET /` rend la page).
- [ ] **Step 6: Commit** `feat(app): standalone app shell, pairing and shared UI kit`.

### Task 3: Le serveur, les lectures du front

**Files:**
- Modify: `server/src/brain/routes.ts`, `server/src/brain/drafts.ts` (export d'une vue), `server/src/brain/agent.ts` ou `store.ts` (voisins), `server/src/brain/settings.ts` et `server/src/brain/prompt.ts` (agent personnalisable, décision de CrOliX du 2026-10-28 : un agent neutre par défaut, personnalisable par chaque utilisateur)
- Test: `server/src/brain/routes.test.ts` (ou le fichier de tests des routes existant)

**Interfaces:**
- Produces:
  - `GET /api/drafts` → `{ drafts: DraftView[]; held: number }`, dans l'ordre de la file (`queue(db, drafts.cap)`), `held` = brouillons en attente au-delà du plafond. `DraftView = { id: number; kind: 'fiche' | 'contradiction' | 'doublon' | 'import'; card: Card; payload: DraftPayload; names: Record<string, string>; facts: Record<string, { text: string; struck: boolean }>; createdAt: string; origin: Draft['origin'] }` : `names` donne le titre de chaque fiche citée par id, `facts` le texte de chaque fait cité (`keep`, `strike`, `replaces`).
  - `GET /api/graph` → `{ nodes: { id: number; title: string; typeId: number; degree: number; flagged: boolean }[]; edges: { from: number; to: number; relation: string }[] }`, fiches fusionnées exclues, `flagged` = fiche citée par une contradiction, un doublon ou un fait `replaces` en attente.
  - `GET /api/fiches/:id` ajoute `neighbors: { id: number; title: string; relation: string; direction: 'out' | 'in' }[]` (fiches gardées seulement) et `depots: { id: number; name: string }[]` (dépôts d'où viennent ses faits).
  - Réglages de l'agent dans `SCHEMAS` de `settings.ts` : `'agent.name'` (texte de 1 à 40 caractères, défaut `'Agent'`), `'agent.icon'` (un de `'sparkles' | 'brain' | 'book-open' | 'library' | 'feather' | 'moon' | 'gem' | 'scroll'`, noms d'icônes Lucide, défaut `'sparkles'`), `'agent.tone'` (`'neutre' | 'chaleureux' | 'concis'`, défaut `'neutre'`), `'agent.persona'` (texte de 0 à 500 caractères, défaut `''`). `GET /api/settings` les rend, `PUT` les valide comme les autres.
  - `askSystem(s: Pick<Settings, 'agent.name' | 'agent.tone' | 'agent.persona'>): string` dans `prompt.ts` remplace la constante `ASK_SYSTEM` pour le chat et la délégation (les appels de tri et de rédaction des lots ne changent pas : les fiches restent neutres). Forme : une ligne de voix (nom, ton), puis le contexte du personnage dans un bloc délimité `<personnage>…</personnage>` annoncé comme réglant **la voix seulement**, puis les règles du wiki **après** le bloc, inchangées.

- [ ] **Step 1: Tests d'abord** :
  - Agent personnalisable : `saveSettings` refuse `agent.name` vide ou de 41 caractères, `agent.icon` hors liste, `agent.persona` de 501 caractères ; `askSystem` avec les défauts contient « Agent » et aucun bloc `<personnage>` ; avec un contexte, le bloc est présent et les règles du wiki viennent après lui ; un contexte contenant `</personnage>` est neutralisé (la balise fermante est retirée ou échappée, le bloc ne se ferme qu'une fois) ; l'agent du chat (`ask`) envoie `askSystem(...)` au fournisseur (faux fournisseur, `system` capturé).
  - `GET /api/drafts` : avec une contradiction, un doublon et une fiche en attente, l'ordre est contradiction, doublon, fiche ; `names[keep]` est le titre de la fiche ; avec `drafts.cap` à 1 et trois brouillons, `drafts.length === 1` et `held === 2`.
  - `GET /api/graph` : deux fiches liées donnent un nœud chacune avec `degree 1` et une arête `{ from, to, relation }` ; une fiche fusionnée n'apparaît pas et ses liens pointent vers la fiche gardée ou disparaissent ; une fiche citée par une contradiction en attente a `flagged: true`.
  - `GET /api/fiches/:id` : `neighbors` contient le lien sortant (`direction 'out'`) et entrant (`'in'`) avec le titre ; sans jeton d'appareil → 401.
- [ ] **Step 2: Lancer** → échec.
- [ ] **Step 3: Implémenter** les trois lectures, requêtes SQL simples, sans nouveau module.
- [ ] **Step 4: Lancer** les barrières → vertes.
- [ ] **Step 5: Commit** `feat(server): drafts, graph and neighbors reads for the app`.

### Task 4: Le tableau de bord

**Files:**
- Create: `app/src/screens/Tableau.svelte`, `app/src/format.ts`
- Test: `app/src/screens/Tableau.test.ts`, `app/src/format.test.ts`

**Interfaces:**
- Consumes: `GET /api/dashboard` (`Dashboard` du palier 1), `GET /lun/v1/health`, `GET /lun/v1/costs`.
- Produces: `formatCost(dollars: number): string` (`0,02 $`), `formatDuration(ms: number): string` (`41 s`, `2 min 05 s`), `formatWhen(iso: string, now: Date): string` (`hier 18:12`, `26/10`), heure de Paris.

- [ ] **Step 1: Tests d'abord** :
  - `format.test.ts` : `formatCost(0.0213)` → `'0,02 $'` ; `formatDuration(41_000)` → `'41 s'` ; `formatWhen` d'hier 18:12 → `'hier 18:12'`.
  - `Tableau.test.ts` : en-tête « Dernier traitement » avec heure, durée, coût, observations reçues et brouillons créés tirés de `lastRun` ; trois cartes (brouillons à valider, contradictions, doublons probables) avec leur chiffre et un lien vers `/valider` (filtre `?filtre=contradictions` et `?filtre=doublons`) ; `heldLots > 0` affiche la bannière « Plafond de coût atteint : N lots en attente » avec un lien vers `/reglages` ; activité récente listée ; **base vide** : « Aucun traitement pour l'instant », cartes à 0, aucune erreur.
- [ ] **Step 2: Lancer** → échec.
- [ ] **Step 3: Écrire** l'écran selon la maquette (écran 1) avec `SettingsCard`, `Badge`, `Button`, `Banner`, `ListRow`, `EmptyState`, `Skeleton` pendant le chargement.
- [ ] **Step 4: Lancer** les barrières → vertes.
- [ ] **Step 5: Commit** `feat(app): dashboard`.

### Task 5: À valider

**Files:**
- Create: `app/src/screens/Valider.svelte`, `app/src/valider/DraftItem.svelte`, `app/src/valider/FicheDraftEditor.svelte`, `app/src/markdown.ts`, `app/src/Prose.svelte`
- Test: `app/src/screens/Valider.test.ts`, `app/src/markdown.test.ts`

**Interfaces:**
- Consumes: `GET /api/drafts` (tâche 3), `POST /lun/v1/cards/:id/accept { input? }`, `POST /lun/v1/cards/:id/refuse`.
- Produces:
  - `tokens(md: string): Token[]` dans `markdown.ts`, `Token = { kind: 'text' | 'strong' | 'em' | 'link'; text: string } | { kind: 'break' } | { kind: 'para' }` : paragraphes, retours à la ligne, `**gras**`, `*italique*`, `[[Fiche]]` en `link`. Rien d'autre n'est interprété.
  - `Prose.svelte` props `{ text: string; onLink?: (title: string) => void }` : rend les jetons par Svelte, un `link` est un bouton.

- [ ] **Step 1: Tests d'abord** :
  - `markdown.test.ts` : `tokens('a [[Client X]] b')` contient `{ kind: 'link', text: 'Client X' }` ; `tokens('<img src=x onerror=alert(1)>')` rend un seul `text` identique à l'entrée.
  - `Valider.test.ts` :
    - la file s'affiche dans l'ordre servi, chaque brouillon avec son type (`Badge` : contradiction en ton danger, doublon en accent, nouvelle fiche, enrichissement, import) ;
    - `?filtre=contradictions` ne montre que les contradictions et les fiches qui remplacent un fait ;
    - **Valider** poste `accept` sans `input` et retire l'élément ; **Refuser** poste `refuse` et le retire ; un toast « Appliqué » ou « Refusé » s'affiche ;
    - **contradiction** : l'élément montre les deux faits ; « Garder l'autre » poste `accept` avec `input` dont `keep` et `strike` sont échangés ;
    - **doublon** : « Garder l'autre » échange `keep` et `merge` ;
    - **fiche** : « Modifier » ouvre `FicheDraftEditor` (titre, synthèse, cases pour retirer un fait ou un lien) ; « Valider » poste `accept` avec le `payload` modifié ;
    - **409** : message « Déjà tranché ailleurs », la file est relue (deuxième `GET /api/drafts`) ;
    - **400** sur `accept` : le message du serveur s'affiche sur l'élément, qui reste dans la file ;
    - `held > 0` : « N autres brouillons attendent le prochain passage » en pied de file ;
    - **un titre `<script>alert(1)</script>` s'affiche en texte** (`getByText` le trouve, aucun élément `script` dans le conteneur) ;
    - file vide : « Rien à valider. »
- [ ] **Step 2: Lancer** → échec.
- [ ] **Step 3: Écrire** l'écran : une colonne, chaque brouillon en `ProposalCard` (ou carte du kit), action principale « Valider », secondaires « Refuser » et « Modifier » ou « Garder l'autre ». Raccourcis clavier `V` (valider) et `R` (refuser) sur l'élément actif, via `shortcuts.ts` du kit. La synthèse passe par `Prose`.
- [ ] **Step 4: Lancer** les barrières → vertes.
- [ ] **Step 5: Commit** `feat(app): review queue for drafts`.

### Task 6: Mémoire, arborescence et fiche

**Files:**
- Create: `app/src/screens/Memoire.svelte`, `app/src/memoire/Arbre.svelte`, `app/src/memoire/FichePanel.svelte`, `app/src/memoire/FicheEdit.svelte`
- Test: `app/src/screens/Memoire.test.ts`, `app/src/memoire/FichePanel.test.ts`

**Interfaces:**
- Consumes: `GET /api/fiches`, `GET /api/fiches/:id` (avec `neighbors`, `depots`, `redirectedFrom`), `PATCH /api/fiches/:id`, `GET /api/types`, `POST /lun/v1/actions/brain.search { query }`, `Prose` (tâche 5).
- Produces: `FichePanel.svelte` props `{ id: number; onOpen: (id: number) => void; onClose?: () => void }`, réutilisé par le graphe (tâche 7). URL : `/memoire?fiche=<id>&mode=arbre|graphe`.

- [ ] **Step 1: Tests d'abord** :
  - `Memoire.test.ts` : les fiches sont groupées par type avec leur nombre (« Personnes · 2 »), groupes repliables ; la saisie dans la recherche (après 250 ms) appelle `brain.search` et remplace l'arbre par les résultats ; vider la recherche rend l'arbre ; un clic sur une fiche met `?fiche=<id>` dans l'URL et ouvre le panneau ; la commande segmentée bascule `mode=graphe` ; base vide : « Aucune fiche. Écrire une note ou déposer un document. » avec liens vers l'agent et `/depots`.
  - `FichePanel.test.ts` : titre, type, date de mise à jour ; la synthèse passe par `Prose` et un `[[Titre]]` connu ouvre la fiche liée ; les faits actifs listés avec leur source et leur date, **les faits barrés en `<s>` avec « barré le JJ/MM »** ; les voisins avec la relation et le sens (« travaille chez → Entreprise Z », « ← concerne ») ; `redirectedFrom` affiche « Fusionnée dans cette fiche » ; « Modifier » ouvre `FicheEdit` et l'enregistrement poste `PATCH` puis affiche la nouvelle version ; l'historique des versions est dans un `Tabs` ou un repli ; **une synthèse `<img src=x onerror=alert(1)>` est rendue en texte**.
- [ ] **Step 2: Lancer** → échec.
- [ ] **Step 3: Écrire** l'écran selon la maquette (écran 2, mode A) : recherche en haut, `Segmented` Arborescence / Graphe, arbre à gauche (260 px), fiche à droite ; sous 760 px, l'arbre plein écran et la fiche par-dessus (retour en haut à gauche).
- [ ] **Step 4: Lancer** les barrières → vertes.
- [ ] **Step 5: Commit** `feat(app): memory tree, search and fiche panel`.

### Task 7: Mémoire, le graphe

**Files:**
- Create: `app/src/memoire/Graphe.svelte`, `app/src/memoire/graph.ts`, `app/src/memoire/layout.worker.ts` (si le worker de forceatlas2 ne suffit pas)
- Modify: `app/src/screens/Memoire.svelte` (mode graphe en `import()`), `server/src/demo/main.ts` (sert `app/dist` comme `main.ts` ; `DEMO_FICHES=3000` ajoute autant de fiches inventées et reliées, noms générés type « Fiche 0042 », pour éprouver la fluidité ; la démo affiche aussi un code d'appairage pour le navigateur)
- Test: `app/src/memoire/graph.test.ts`, `app/src/screens/Memoire.test.ts` (chargement du mode)

**Interfaces:**
- Consumes: `GET /api/graph` (tâche 3), `FichePanel` (tâche 6), ADR 0006.
- Produces: `buildGraph(data: GraphData, palette: Palette): Graph` (graphology) dans `graph.ts`, `Palette = { node: string; edge: string; flagged: string; accent: string; label: string }` lue sur `:root` (`--lavis`, `--bord`, `--danger`, `--accent`, `--lune`) ; `nodeSize(degree: number): number` (entre 2 et 10, croissance en racine ; ramené de 3–14 après la passe Chrome, graphe plus calme) ; `focus(graph, id): Set<number>` (la fiche et ses voisins directs).

- [ ] **Step 1: Tests d'abord** (`graph.test.ts`, sans WebGL) :
  - `buildGraph` crée un nœud par fiche et une arête par lien ; une arête vers un nœud absent est ignorée sans erreur ; un nœud `flagged` prend `palette.flagged` en bordure ; la taille suit `nodeSize(degree)` ;
  - `nodeSize(0) === 2`, `nodeSize(10000) === 10` ;
  - `focus` rend la fiche et ses voisins ;
  - 5 000 nœuds et 15 000 arêtes se construisent en moins de 500 ms (borne lâche, mesurée dans le test).
  - `Memoire.test.ts` : en `mode=graphe`, le module du graphe n'est importé qu'à ce moment (mock de `./memoire/Graphe.svelte` compté) ; sans WebGL (`getContext('webgl2')` nul en jsdom), l'état vide « Le graphe demande WebGL. » s'affiche.
- [ ] **Step 2: Lancer** → échec.
- [ ] **Step 3: Écrire** `Graphe.svelte` : Sigma sur le conteneur, ForceAtlas2 en worker (arrêté après stabilisation ou 3 s), zoom et déplacement natifs, filtre par type (`Chip`), champ « Centrer sur… » (recherche dans les titres, animation de caméra vers le nœud, voisins mis en avant, les autres estompés), clic sur un nœud : `FichePanel` en panneau latéral (plein écran sous 760 px), fiches à problème en bordure `--danger`, étiquettes seulement au-delà d'un seuil de zoom. Base vide : « Aucune fiche. »
- [ ] **Step 4: Lancer** les barrières et `npm run build` : le morceau du graphe est à part et sous 500 kB. Dans Chrome, `DEMO_FICHES=3000 npm run demo` : déplacement et zoom restent fluides.
- [ ] **Step 5: Commit** `feat(app): interactive fiche graph (Sigma.js)`.

### Task 8: Dépôts

**Files:**
- Create: `app/src/screens/Depots.svelte`, `app/src/depots/vault.ts`
- Test: `app/src/screens/Depots.test.ts`, `app/src/depots/vault.test.ts`

**Interfaces:**
- Consumes: `GET /api/depots` (`{ depots: { id, name, type, size, createdAt, pending, total }[] }` du palier 1), `POST /api/depots` (multipart, champ `file`), `DELETE /api/depots/:id`, `POST /api/import { files: { path, text }[] }`.
- Produces: `readVault(files: File[]): Promise<{ files: { path: string; text: string }[]; skipped: number; tooBig: boolean }>` dans `vault.ts` (garde les `.md`, chemin relatif `webkitRelativePath`, `tooBig` si le total dépasse 20 000 000 caractères ou 2 000 fichiers, valeurs du serveur).

- [ ] **Step 1: Tests d'abord** :
  - `vault.test.ts` : trois fichiers dont un `.png` → deux gardés, `skipped 1` ; un total de 20 000 001 caractères → `tooBig true`.
  - `Depots.test.ts` : glisser un fichier ou le choisir poste le multipart puis affiche « Brouillon créé » avec un lien vers `/valider` ; un PDF refusé (400) affiche le message du serveur ; la liste montre chaque dépôt avec « N brouillons en attente sur M » ; « Supprimer » ouvre `ConfirmDialog` (`danger-plein`) puis poste `DELETE` ; « Importer un coffre Obsidian » (input `webkitdirectory`) poste `/api/import` et annonce « 1 brouillon d'import, N notes » ; **dossier trop gros : message « Coffre trop gros (20 Mo au plus) » sans aucun envoi** ; fichiers ignorés : « N fichiers non Markdown ignorés ».
- [ ] **Step 2: Lancer** → échec.
- [ ] **Step 3: Écrire** l'écran : zone de dépôt en haut (texte, Markdown ; PDF annoncé comme non pris en charge), import Obsidian à côté, liste des dépôts dessous.
- [ ] **Step 4: Lancer** les barrières → vertes.
- [ ] **Step 5: Commit** `feat(app): document drops and Obsidian import`.

### Task 9: Réglages

**Files:**
- Create: `app/src/screens/Reglages.svelte`, `app/src/reglages/{Modele.svelte,Lots.svelte,Types.svelte,Donnees.svelte,Agent.svelte,Appareils.svelte}`
- Test: `app/src/screens/Reglages.test.ts`, `app/src/reglages/Types.test.ts`

**Interfaces:**
- Consumes: `GET|PUT /api/settings` (`drafts.cap`, `cost.monthlyCap`, `core.lots`), `/api/llm/providers`, `/api/llm/models`, `/api/llm/choice`, `GET|POST|PATCH|DELETE /api/types`, `POST /api/export`, `GET /api/clients`, `DELETE /api/clients/:id`, `POST /api/pairing-codes`, `POST /lun/v1/pause|resume`, `GET /lun/v1/health`. Les composants `Providers` et `ModelPicker` d'Acedia (`views/src/lib/settings`) sont copiés et adaptés, pas réécrits.

- [ ] **Step 1: Tests d'abord** :
  - `Reglages.test.ts` : quatre cartes dans l'ordre de la maquette (Modèle de langage, Lots du core, Structure des fiches, Données) plus Agent, Appareils et Service ; la carte **Agent** règle le nom (1 à 40 caractères), l'icône (choix parmi les huit du serveur, aperçu dans la bulle), le ton (commande segmentée Neutre / Chaleureux / Concis) et le contexte du personnage (zone de texte, compteur « N / 500 », aide « Règle la voix de l'agent, jamais ce qu'il a le droit de faire »), le tout par `PUT /api/settings` ; le plafond mensuel se modifie (`PUT /api/settings` avec `cost.monthlyCap`) et la dépense du mois s'affiche à côté (« 1,20 $ sur 5,00 $ ») ; la bascule « Accepter les lots du core » poste `core.lots` ; le plafond de brouillons refuse 0 et accepte 1 à 100 (valeurs du serveur) ; aucune heure de passage n'est réglable ici, la ligne dit « Heure fixée par le core » ; « Exporter en Markdown » affiche le dossier rendu ; « Pause » poste `/lun/v1/pause` et la carte d'état du rail passe à « En pause » ; une clé enregistrée n'affiche que ses 4 derniers caractères.
  - `Types.test.ts` : ajouter, renommer ; retirer un type non vide affiche l'erreur du serveur ; retirer un type vide passe par `ConfirmDialog`.
- [ ] **Step 2: Lancer** → échec.
- [ ] **Step 3: Écrire** l'écran avec `SettingsCard` et `SettingsRow` ; la carte Modèle de langage (fournisseurs, modèles) est chargée par `import()`.
- [ ] **Step 4: Lancer** les barrières → vertes.
- [ ] **Step 5: Commit** `feat(app): settings`.

### Task 10: L'agent en bulle, preuve et finition

**Files:**
- Create: `app/src/agent/{Bulle.svelte,AgentPanel.svelte,conversation.svelte.ts}`
- Modify: `app/src/shell/Shell.svelte`, `README.md`, `docs/prouver-avaritia.md`, `CLAUDE.md`
- Test: `app/src/agent/AgentPanel.test.ts`, `app/src/agent/conversation.test.ts`

**Interfaces:**
- Consumes: `POST /api/agent { request, context?, history }` (palier 1, sans état côté serveur), `Prose` (tâche 5). Le lanceur et le panneau de Pina d'Acedia (`views/src/lib/pina/Launcher.svelte`, `PinaPanel.svelte`, `Thread.svelte`) servent de base, copiés et renommés.
- Produces: `conversation` (rune) avec `send(text: string): Promise<void>`, `messages: { role: 'user' | 'agent'; text: string; cost?: number }[]`, `clear()`, gardée en mémoire de la page seulement (rien dans `localStorage`).

- [ ] **Step 1: Tests d'abord** :
  - `conversation.test.ts` : `send` poste `request` et l'historique des tours précédents ; la réponse s'ajoute avec son coût ; une erreur 402 ou de crédit affiche « Crédit épuisé chez le fournisseur » ; en pause, la réponse de pause s'affiche telle quelle.
  - `AgentPanel.test.ts` : la bulle est en bas à droite sur chaque écran, avec l'icône et le nom réglés (`agent.icon`, `agent.name`, lus dans `GET /api/settings` ; défaut « Agent » et `sparkles`), le titre du panneau porte ce nom, `Échap` ferme le panneau et rend le focus à la bulle ; « note que Client X préfère le mardi » produit la réponse de l'agent et, si un brouillon est créé, un lien « Voir dans À valider » ; la réponse passe par `Prose` (aucun HTML).
- [ ] **Step 2: Lancer** → échec.
- [ ] **Step 3: Écrire** la bulle et le panneau (400 px en bureau, plein écran sous 760 px), le contexte envoyé est la fiche ouverte (`?fiche=<id>`) s'il y en a une.
- [ ] **Step 4: Retirer** de `app/src/lib/ui` les composants copiés qu'aucun écran n'utilise (`grep` de chaque nom dans `app/src`).
- [ ] **Step 5: Vérifier dans Chrome** (`npm run build` puis `npm run demo`, port 8798, données inventées), en 1440 px et 390 px, chaque écran contre la maquette : tableau de bord, À valider (les quatre sortes), Mémoire arborescence, Mémoire graphe avec la base de démo, Dépôts, Réglages, agent ouvert. Captures sans donnée réelle, jointes à la PR.
- [ ] **Step 6: Mettre à jour** `README.md` (lancer le front), `docs/prouver-avaritia.md` (parcours dans le navigateur), `CLAUDE.md` (le front).
- [ ] **Step 7: Lancer** toutes les barrières → vertes ; `npm run build` sans avertissement de taille.
- [ ] **Step 8: Commit** `feat(app): floating agent, proof walkthrough and cleanup`.

## Amendements du 2026-10-29 (revue croisée avec Acedia, décisions de CrOliX)

- Rien de visible ne pointe vers le core : plus de bascule « Accepter les lots du core » ni de ligne
  « Heure fixée par le core » (le réglage `core.lots` disparaît aussi du serveur), plus de « Core
  relié / non relié » dans le rail (la carte d'état montre la dépense du mois), une source `core`
  s'affiche « observation », le tableau de bord parle de « Dernier traitement ».
- Une note ou un dépôt traité alimente aussi « Dernier traitement » (table `runs`).
- Seuil mobile à 768 px partout (et non 760), comme le kit et Acedia.
- Mémoire : groupes fermés par défaut, sauf celui de la fiche ouverte.
- Réglages en thèmes (colonne groupée, une page par thème, liste puis thème en plein écran sur
  téléphone), comme Acedia.
- Panneau de l'agent redimensionnable, pleine hauteur possible, taille gardée, ouvert par Ctrl J,
  comme celui d'Acedia.
- Kit commun synchronisé depuis lun-docs : chantier à part (lun-docs#43).
