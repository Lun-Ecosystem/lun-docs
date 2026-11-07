# La carte de l'écosystème : plan d'implémentation

> **Livré** par [lun-anima#19](https://github.com/Lun-Ecosystem/lun-anima/pull/19). Cases cochées le 07/11/2026 d'après cette livraison, sans recontrôle tâche par tâche.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal :** remplacer, au bureau, l'accueil en listes et la colonne de Natsume par une carte interactive de l'écosystème (Natsume au centre, son cadran, les postes en orbite, des fiches ancrées, une barre de conversation en bas), et faire montrer un thème à la fois à Écosystème.

**Architecture :** le core enregistre les délégations et sert une lecture agrégée de la journée (`GET /api/map`) ; l'app compose la carte depuis cette lecture et les lectures existantes (`/home`, `/dues`, `/cards`, `/satellites`). La géométrie (orbite, cadran) vit dans des modules TypeScript purs, testés à part. Le téléphone garde ses écrans ; seul Écosystème y gagne une rangée de présences.

**Tech Stack :** Hono, `node:sqlite`, zod 4 (core) ; Svelte 5, Bits UI, `@lucide/svelte`, kit `ui/src/lib/ui` (app) ; Vitest et Testing Library.

**Spec :** `lun-docs/docs/specs/2026-10-30-carte-ecosysteme-design.md`. Planche : `lun-docs/docs/maquettes/2026-10-30-apps-core/07-carte.html` (vues Carte avec 3 et 7 postes, Écosystème, encart téléphone).

Dépôt : `lun-anima`, branche `feat/core-app-palier-2` (PR #19, brouillon). Commandes depuis la racine de `lun-anima` : `npx vitest run <filtre>` pour un fichier, `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check` pour tout.

## Global Constraints

- **DA** : jetons de `ui/src/lib/tokens.css` seulement ; socle commun, couleur du monde en accent ; Cormorant Garamond (titres) et Inter ; composants du kit `ui/src/lib/ui`, Bits UI, `@lucide/svelte` ; pas de Tailwind. `data-monde` sur la racine de chaque nœud, fiche ou ligne, selon son poste ; Natsume et ses routines portent `anima`.
- **Un seul seuil mobile** : `max-width: 767.98px`. La carte est un motif de bureau : sous ce seuil, elle n'est jamais rendue.
- **Bureau** : trois onglets, dans cet ordre : Carte (adresse `/app/`), Journal, Écosystème. Pas de colonne de Natsume. Pas de bouton Postes dans la tétière.
- **Téléphone** : la navigation du bas et les écrans du palier 2 restent (Accueil, À valider, Journal, Écosystème, barre de Natsume, bouton Postes).
- **Cadran** : jamais deux marques superposées ; les événements d'une même heure de Paris forment une marque avec leur nombre ; pas de `log` ; seulement ce qui a eu lieu.
- **Postes** : un nombre sur le disque (ce qui attend maintenant), aucun trait par carte ; l'orbite place n'importe quel nombre de postes, jusqu'à 7 sans chevauchement ; un poste non appairé est neutre (contour pointillé, sans couleur d'accent) ; pas d'appareils sur la carte.
- **Jour passé** : les nombres en attente, la pastille de Natsume et les gestes sont masqués.
- **États de contour** : relié (plein), ne répond pas (tirets : `link: 'connected'` mais `GET /satellites` ne donne pas sa santé, la sonde n'ayant pas répondu), injoignable (pointillé barré : `link: 'unreachable'`), à relier (pointillé clair : `link: 'unpaired'`).
- **Mouvement** : seulement sur un lien actif ce jour, coupé sous `prefers-reduced-motion: reduce`.
- **Accessibilité** : chaque nœud, marque et routine est un bouton atteignable au clavier, avec un nom qui dit ce qu'il porte (« Lun'Avaritia, 11 en attente ») ; une fiche ancrée prend le focus et le rend au nœud à sa fermeture (Échap, croix, clic sur la carte) ; la carte a une liste alternative de ce qui attend, lisible par un lecteur d'écran.
- **Textes** : voix neutre, « Lun'Xxx », pas de tiret cadratin, pas de capitales, pas de « · » de jonction, pas de « → » dans un bouton ; un bouton dit ce qu'il fait.
- **Lisibilité** : la carte tient de 1280 à 1920 px de large ; une fiche ne sort jamais de l'écran.
- **Vérification** : chaque écran vu dans le navigateur à 1440 et 390 px contre la planche 07, et les gestes faits pour de vrai sur la recette locale (core 8788, Lun'Acedia 8787, Lun'Avaritia 8789).

## Review Focus

1. **Un poste qui ne répond pas pendant le chargement** : la carte s'affiche quand même, le poste en tirets, sans bloquer les autres (test en Task 4).
2. **Une heure chargée** (5 événements ou plus à la même heure) : une seule marque « 5 », pas de chevauchement (tests en Tasks 2 et 3).
3. **Un geste depuis une fiche** (Valider) : le nombre du poste et la pastille de Natsume baissent sans recharger la page (test en Task 5).
4. **Revenir à hier puis à aujourd'hui** : les nombres et les gestes reviennent (test en Task 4).
5. **Aucun poste relié** : la carte montre Natsume seule et « Relier un poste », sans erreur (test en Task 4).

---

### Task 1 : enregistrer les délégations (core)

**Files:**
- Create : `core/src/delegations/store.ts`, `core/src/delegations/store.test.ts`
- Modify : `core/src/db.ts` (nouvelle migration en fin de liste), `core/src/chat/service.ts` (`#delegate`), `core/src/chat/routes.ts` (évènement `done`), `core/src/accueil/routes.ts` (« C'est fait »), `core/src/routines/night-day.ts` (envoi à Lun'Avaritia)

**Interfaces :**
- Produces :
  - table `delegations(id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, satellite_id TEXT NOT NULL, request TEXT NOT NULL, origin TEXT NOT NULL, outcome TEXT NOT NULL)` ;
  - `type DelegationOrigin = 'conversation' | 'fait' | 'nuit'` ; `type DelegationOutcome = 'faite' | 'echouee' | 'sans-reponse'` ;
  - `recordDelegation(db, d: { at: string; satellite: string; request: string; origin: DelegationOrigin; outcome: DelegationOutcome }): void` (la demande est tronquée à 200 caractères, secrets masqués avec `maskSecrets`) ;
  - `delegationsBetween(db, lo: string, hi: string): { at: string; satellite: string; request: string; origin: DelegationOrigin; outcome: DelegationOutcome }[]` ;
  - l'évènement SSE `done` de la conversation porte `delegatedTo?: string` (l'id du poste) quand le message a délégué.

- [x] **Step 1 : tests qui échouent** (`store.test.ts`, plus un test par point d'appel) :
  - `records a delegation and reads it back between two instants` ;
  - `truncates the request to 200 characters and masks secrets` ;
  - `a chat delegation is recorded with origin conversation and outcome faite` (et `echouee` quand le poste lève) ;
  - `the done event names the post when the reply delegated` (`delegatedTo: 'lunacedia'`) ;
  - `C'est fait records a delegation to lunavaritia with origin fait` ;
  - `the night sending to Avaritia records a delegation with origin nuit`.
- [x] **Step 2 : `npx vitest run delegations chat accueil night-day`.** Attendu : FAIL.
- [x] **Step 3 : implémenter.** Un enregistrement raté ne coûte jamais la délégation : `try/catch` et journalisation, comme `#alert`.
- [x] **Step 4 : `npx vitest run delegations chat accueil night-day && npm run typecheck`.** Attendu : PASS.
- [x] **Step 5 : commit** `feat(core): record delegations to posts`.

### Task 2 : la lecture de la journée, `GET /api/map` (core)

**Files:**
- Create : `core/src/map/map.ts`, `core/src/map/routes.ts`, `core/src/map/map.test.ts`
- Modify : `core/src/app.ts` (monter la route), `core/src/main.ts` (passer l'horaire des routines), `core/src/testing/` (harnais : horaire par défaut 5 h 00 et 7 h 30)

**Interfaces :**
- Consumes : `delegationsBetween` (Task 1) ; les entrées du Journal (`journalDays` de `core/src/journal/journal.ts`, ou sa collecte interne extraite en `journalEntriesOf(db, lo, hi, post?)` si besoin) ; `routine_runs`.
- Produces : `GET /api/map?day=YYYY-MM-DD` (jour de Paris ; absent, aujourd'hui ; un jour mal formé ou futur donne 400 avec un message en français) :

```ts
type MapDay = {
  day: string;            // YYYY-MM-DD, Paris
  today: boolean;
  routines: { name: string; hour: number; minute: number;
              run?: { at: string; status: string } }[];   // dernier passage de ce jour-là
  hours: { hour: number; entries: Entry[] }[];            // heures de Paris 0..23 non vides, croissantes ; Entry du Journal, sans log
  posts: { id: string;
           aller: { count: number; last?: { at: string; request: string; outcome: string } };
           retour: { events: number; urgent: number } }[]; // un par poste connu de /satellites, même à zéro
};
```

- [x] **Step 1 : tests qui échouent** (`map.test.ts`) :
  - `groups the day's entries by Paris hour` : 5 entrées à 10 h 02, 10 h 15, 10 h 40, 10 h 41, 10 h 59 donnent une seule heure `{ hour: 10, entries: [5] }` ;
  - `never returns log events` ;
  - `counts aller from delegations and retour from the post's events, urgent apart` ;
  - `gives every known post, even with nothing today` ;
  - `gives the routines' schedule with the run of that day` (`night` 5 h 00, `morning` 7 h 30) ;
  - `a past day reads that day only` (`?day=2026-10-29`, `today: false`) ;
  - `refuses a malformed or future day with 400`.
- [x] **Step 2 : `npx vitest run map`.** Attendu : FAIL.
- [x] **Step 3 : implémenter.** Bornes du jour de Paris comme le Journal (fuseau `Europe/Paris`, passage à l'heure d'hiver compris).
- [x] **Step 4 : `npx vitest run map journal && npm run typecheck`.** Attendu : PASS.
- [x] **Step 5 : commit** `feat(core): map day read`.

### Task 3 : la géométrie de la carte (app, modules purs)

**Files:**
- Create : `ui/src/carte/geometry.ts`, `ui/src/carte/geometry.test.ts`

**Interfaces :**
- Produces :
  - `orbit(n: number, box: { width: number; height: number }): { x: number; y: number }[]` : positions des centres de `n` postes sur une ellipse autour du centre de la boîte, le premier en haut à gauche, répartis à angles égaux en évitant le bas centré (réservé à la barre de Natsume) ;
  - `dialAngle(hour: number, minute: number): number` : angle en degrés, 0 h en haut, sens horaire ;
  - `MIN_GAP = 120` (px) : écart minimal entre deux centres de postes à 1280 px de large.

- [x] **Step 1 : tests qui échouent** :
  - `places n posts with at least MIN_GAP between centres, for n from 1 to 7, at 1280 and 1920 px` ;
  - `keeps every post inside the box with its label (margin 90 px)` ;
  - `dialAngle puts 0 h at the top and 6 h on the right` (0 et 90) ;
  - `two marks of the dial never share an hour` : sur 24 heures distinctes, les angles diffèrent d'au moins 15°.
- [x] **Step 2 : `npx vitest run geometry`.** Attendu : FAIL.
- [x] **Step 3 : implémenter.**
- [x] **Step 4 : `npx vitest run geometry`.** Attendu : PASS.
- [x] **Step 5 : commit** `feat(ui): map geometry`.

### Task 4 : l'écran Carte (app)

**Files:**
- Create : `ui/src/carte/Carte.svelte`, `ui/src/carte/Carte.test.ts`, `ui/src/carte/map.ts` (types de `MapDay`, `waitingOf`), `ui/src/carte/Noeud.svelte`
- Modify : `ui/src/testing/core.ts` (défaut de `GET /map`)

**Interfaces :**
- Consumes : `GET /api/map` (Task 2), `orbit` et `dialAngle` (Task 3), `GET /home`, `/dues`, `/cards`, et le contexte `posts` (`ui/src/posts.ts` : `nameOf`, `worldOf`, `roleOf`).
- Produces :
  - `waitingOf(home, dues, cards): { natsume: number; byPost: Record<string, number> }` dans `map.ts` : par poste, ses cartes en attente plus ses urgences non vues plus (pour `lunavaritia`) les échéances ; pour Natsume, le total sans doublon ;
  - `<Carte />`, qui expose à ses fiches (Task 5) `selected: { kind: 'natsume' | 'poste' | 'heure' | 'routine'; id: string } | null` et un rappel `reload()`.

- [x] **Step 1 : tests qui échouent** (`Carte.test.ts`, avec `fakeCore`) :
  - `shows Natsume at the centre and one node per known post, in its world` (`data-monde`) ;
  - `a post's node gives its waiting number in its name` (« Lun'Avaritia, 11 en attente ») ;
  - `an unpaired post is neutral and says it is to link` (classe ou attribut `data-etat="a-relier"`, pas de `data-monde`) ;
  - `a post that answers late is drawn as not answering, the rest shows` (Review Focus 1) ;
  - `five entries in one hour give one mark labelled 5` (Review Focus 2) ;
  - `the routines are diamonds at their hour on the dial, with their state` (« Veille de la nuit, faite à 9 h 30 ») ;
  - `the day arrows read yesterday and hide the numbers, then today brings them back` (Review Focus 4) ;
  - `with no post, shows Natsume alone and Relier un poste` (Review Focus 5) ;
  - `lists what waits for a screen reader` (une liste masquée visuellement, nommée « Ce qui attend »).
- [x] **Step 2 : `npx vitest run Carte`.** Attendu : FAIL.
- [x] **Step 3 : implémenter** sur la planche 07 (vue « 3 postes ») : SVG pour le cadran et les liens, boutons HTML positionnés pour les nœuds ; libellé de lien (rôle, « 11 cartes en retour ») ; survol d'un lien qui estompe les autres ; flèches de date ; nœud « Relier un poste » qui mène à `/app/ecosysteme?theme=postes`.
- [x] **Step 4 : `npx vitest run Carte geometry && npm run typecheck`.** Attendu : PASS.
- [x] **Step 5 : commit** `feat(ui): ecosystem map screen`.

### Task 5 : les fiches ancrées (app)

**Files:**
- Create : `ui/src/carte/Fiche.svelte` (le cadre ancré), `ui/src/carte/FicheNatsume.svelte`, `ui/src/carte/FichePoste.svelte`, `ui/src/carte/FicheHeure.svelte`, `ui/src/carte/FicheRoutine.svelte`, `ui/src/carte/Fiche.test.ts`
- Modify : `ui/src/carte/Carte.svelte`

**Interfaces :**
- Consumes : `selected` et `reload()` (Task 4) ; `CardItem` et `decideCard` avec `origin: 'carte'` (`ui/src/cards/`) ; les gestes d'échéance et d'urgence de l'Accueil (`POST /dues/:id/done|later`, `POST /events/:id/seen`) ; `frontHref`, `OUTSIDE`, `openLabel` (`ui/src/frontHref.ts`, `ui/src/posts.ts`) ; `POST /routines/night|morning`.
- Produces : rien pour les tâches suivantes.

- [x] **Step 1 : tests qui échouent** (`Fiche.test.ts`) :
  - `clicking Natsume opens her card with what she asks, the phrase of the day and the day's spend` ;
  - `a post's card lists its pending cards with Valider and Refuser, Ouvrir Lun'Avaritia in a new tab, and Régler ce poste` ;
  - `a post's card says what went to it and came back today, and the last exchange` (le détail du survol de son lien) ;
  - `Valider in a post's card lowers the post's number and Natsume's badge` (Review Focus 3) ;
  - `an hour mark's card lists that hour's entries` ;
  - `a routine's card offers Lancer` ;
  - `Escape closes the card and gives the focus back to the node` ;
  - `the card stays inside the window near the right edge`.
- [x] **Step 2 : `npx vitest run Fiche`.** Attendu : FAIL.
- [x] **Step 3 : implémenter** avec le Popover de Bits UI ancré sur le nœud (`customAnchor`), `collisionPadding` de 16 px. Le contenu reprend l'ordre de l'ancien « À traiter » (urgences, échéances, cartes) pour Natsume, et la série V/R de l'ancien « À valider » (`focus.ts`) pour un poste. `decideCard` accepte l'origine `'carte'` (ajouter la valeur côté core si la route la filtre).
- [x] **Step 4 : `npx vitest run Fiche Carte CardItem && npm run typecheck`.** Attendu : PASS.
- [x] **Step 5 : commit** `feat(ui): anchored cards on the map`.

### Task 6 : la barre de Natsume au bureau (app)

**Files:**
- Modify : `ui/src/natsume/Panneau.svelte` (mode bureau : barre en bas qui se déplie ; plus de colonne ni de phrase du jour), `ui/src/natsume/Natsume.test.ts`

**Interfaces :**
- Consumes : `Fil` (`ui/src/natsume/fil.svelte.ts`) ; `delegatedTo` de l'évènement `done` (Task 1).
- Produces : `Panneau` n'a plus de prop `phrase` (Task 7 cesse de la passer).

- [x] **Step 1 : tests qui échouent** :
  - `desktop: the bar Écrire à Natsume sits at the bottom and / focuses it` ;
  - `desktop: sending unfolds the thread above the bar, Escape folds it and keeps the thread` ;
  - `desktop: a reply that delegated shows « Confié à Lun'Acedia »` ;
  - `desktop: no column and no phrase of the day` ;
  - les tests téléphone existants restent verts (barre au-dessus de la navigation, feuille).
- [x] **Step 2 : `npx vitest run Natsume`.** Attendu : FAIL.
- [x] **Step 3 : implémenter.** La barre dépliée est non modale, ancrée en bas au centre, largeur 640 px au plus ; les sujets (fils) restent atteignables depuis elle.
- [x] **Step 4 : `npx vitest run Natsume fil && npm run typecheck`.** Attendu : PASS.
- [x] **Step 5 : commit** `feat(ui): Natsume's bar on the desktop`.

### Task 7 : la coque et les onglets (app)

**Files:**
- Modify : `ui/src/shell/Shell.svelte`, `ui/src/shell/Shell.test.ts`, `ui/src/App.svelte`, `ui/src/App.test.ts`

**Interfaces :**
- Consumes : `<Carte />` (Task 4), `Panneau` sans `phrase` (Task 6).

- [x] **Step 1 : tests qui échouent** :
  - `desktop: the tabs are Carte, Journal and Écosystème` ; « Carte » mène à `/app/` ;
  - `desktop: /app/ renders the map` ; `desktop: /app/valider shows the map` (l'adresse devient `/app/` par `replaceState`) ;
  - `desktop: no Postes button in the top bar` ;
  - `phone: the four sections and the Postes button stay` ; `phone: /app/ renders the Accueil`.
- [x] **Step 2 : `npx vitest run Shell App`.** Attendu : FAIL.
- [x] **Step 3 : implémenter** avec la `MediaQuery` du seuil mobile ; la grille de la coque perd la colonne de Natsume au bureau.
- [x] **Step 4 : `npm test && npm run typecheck`.** Attendu : PASS (les tests de l'Accueil et d'À valider se font au téléphone s'ils dépendent du rendu bureau).
- [x] **Step 5 : commit** `feat(ui): map, journal and ecosystem tabs on the desktop`.

### Task 8 : Écosystème, un thème à la fois au bureau (app)

**Files:**
- Modify : `ui/src/screens/ecosysteme/Ecosysteme.svelte`, `ui/src/screens/ecosysteme/Ecosysteme.test.ts`

- [x] **Step 1 : tests qui échouent** :
  - `desktop: only the selected theme is shown, Postes by default` ;
  - `desktop: choosing Routines in the menu shows Routines alone and sets ?theme=routines` ;
  - `desktop: /app/ecosysteme?theme=cle opens Modèle et clé` ;
  - `desktop: the menu gives each theme its state line` (comme la liste du téléphone).
- [x] **Step 2 : `npx vitest run Ecosysteme`.** Attendu : FAIL.
- [x] **Step 3 : implémenter** sur la vue Écosystème de la planche 07 : menu de 220 px, thème à pleine largeur utile (760 px au plus). Les thèmes restent montés pour garder leur état (`summary`).
- [x] **Step 4 : `npx vitest run Ecosysteme && npm run typecheck`.** Attendu : PASS.
- [x] **Step 5 : commit** `feat(ui): one ecosystem theme at a time on the desktop`.

### Task 9 : la rangée de présences au téléphone (app)

**Files:**
- Create : `ui/src/screens/ecosysteme/Presences.svelte`
- Modify : `ui/src/screens/ecosysteme/Ecosysteme.svelte`, `ui/src/screens/ecosysteme/Ecosysteme.test.ts`

**Interfaces :**
- Consumes : `waitingOf` (Task 4), le contexte `posts`.

- [x] **Step 1 : tests qui échouent** :
  - `phone: the Postes line is a row of presences, Natsume first, each with its waiting number` ;
  - `phone: an unreachable post says so in its name` ;
  - `phone: touching a presence opens that post in the Postes theme`.
- [x] **Step 2 : `npx vitest run Ecosysteme`.** Attendu : FAIL.
- [x] **Step 3 : implémenter** sur l'encart téléphone de la planche 07.
- [x] **Step 4 : `npm test && npm run typecheck && npm run lint && npm run format:check`.** Attendu : PASS.
- [x] **Step 5 : mettre à jour** `README.md` et `CLAUDE.md` de lun-anima (la carte au bureau, `GET /api/map`), puis commit `feat(ui): presences row on the phone`.

### Task 10 : recette dans le navigateur (contrôleur)

- [x] Recette locale (8788, 8787, 8789), à 1440 px puis 1280 et 1920 px : la carte contre la planche 07 ; un Valider depuis la fiche de Lun'Avaritia ; « Voir la fiche » ; une conversation qui délègue, avec « Confié à » ; hier puis aujourd'hui ; Écosystème thème par thème.
- [x] À 390 px : Accueil, À valider, Écosystème avec la rangée de présences.
- [x] Clavier : Tab parcourt les nœuds, Entrée ouvre une fiche, Échap la ferme et rend le focus.
- [x] Mettre à jour la PR #19 (corps au gabarit, preuves), sans la sortir du brouillon.
