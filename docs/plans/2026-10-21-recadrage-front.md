# Recadrage front et design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** refaire le front d'Acedia (vues partagées et app autonome) et les pages du core d'Anima
selon les planches validées, sur un socle commun (jetons B, Bits UI, Lucide, FullCalendar), avec
les ajouts de fond retenus : « pourquoi » de l'IA, second seuil, bilan du jour, vraie annulation des
actions de l'utilisateur, règle « Retenir pour cet expéditeur », et deux bugs corrigés.

**Architecture:** lun-docs porte la référence `design/tokens.css` et l'outil qui en vérifie les
copies. Acedia reçoit une bibliothèque de composants communs dans `views/src/lib/ui/`, montrée par
une page catalogue de développement. Chaque écran est ensuite refait uniquement avec ces composants,
un écran à la fois, avec un arrêt pour la validation de CrOliX après chacun. Le serveur d'Acedia gagne
les données nouvelles ; le core d'Anima ne change que la forme de ses deux pages.

**Tech Stack:** Node `^22.13.0 || >=24`, TypeScript ~6.0 strict, Svelte 5.57, Vite 8, Hono,
`node:sqlite`, zod 4, Vitest. Nouvelles dépendances (versions vérifiées le 2026-10-21) : `bits-ui`
^2.20.0, `@internationalized/date` ^3.12.4, `@lucide/svelte` ^1.61.0, `fullcalendar` ^7.1.3.

**Spec:** `docs/specs/2026-10-21-recadrage-front-design.md` ; planches dans
`docs/maquettes/2026-10-21-recadrage-front/` ; `standards/design.md`, skill `lun-design`.

## Global Constraints

- **Arrêts de validation (décision de CrOliX, prime sur la marche continue de l'exécution).** Une
  tâche marquée « Arrêt » se termine ainsi : vérifier l'écran dans Chrome contre sa planche, en
  largeur 1440 px et 390 px ; enregistrer les captures (sans donnée réelle) ; les envoyer à CrOliX ;
  **attendre son accord** avant la tâche suivante. Un écart signalé est corrigé dans la même tâche.
- Les planches font foi pour la mise en page, la hiérarchie et les états. Seul écart permis sans
  accord : retirer un élément classé hors palier (§8 de la spec) ou absent des données et non listé
  au §2.4 (« Plus tard », lien tâche vers mail, dernière activité d'un appareil).
- Un chantier = une issue par dépôt touché (`lun-acedia`, `lun-anima`), étiquette `niveau:critique`
  (refonte transverse) ; branche `feat/recadrage-front` partie de `main` à jour ; PR en brouillon dès
  le premier push. lun-docs sur la branche `docs/recadrage-front` (spec déjà commitée). Ordre de fusion
  : lun-docs, puis Acedia, puis le core (la CI d'Acedia lit lun-docs `main`). Seul CrOliX fusionne ;
  jamais de push vers `main`, de push forcé, de tag ni de release.
- Code, commits et noms techniques en anglais ; docs, PR et textes affichés en français.
- Textes : voix technique neutre, sans « tu » (les textes des planches sont réécrits : « 3
  propositions sous le seuil de 95 % », « Saisir le code à 6 chiffres ») ; apostrophe ’ dans les
  textes, « Lun'Xxx » avec apostrophe droite ; aucun tiret cadratin ; dates en minuscules à la
  française (« 19 – 25 octobre 2026 », « mer. 21 oct. »). **Le front autonome d'Acedia ne contient
  jamais « Anima » en dur.**
- Aucune couleur écrite en dur dans `views/src` ni `app/src` hors des fichiers de jetons ; aucune
  police ni ressource depuis un CDN ; contraste WCAG AA ; focus visible ; pas d'alerte native
  (`alert`, `confirm`, `prompt`).
- Les menus, listes déroulantes, bulles, info-bulles et dialogues passent par Bits UI (calque au-dessus
  de la page) ; aucun n'est coupé par un conteneur.
- Lun'Acedia et lun-docs sont publics : aucun secret, aucune adresse réelle ni interne, y compris
  dans les captures. Compte Google de test seulement. Une clé n'est montrée que par ses 4 derniers
  caractères.
- Aucun test ne touche le réseau, un vrai navigateur ou une vraie clé.
- Valeurs fixées : seuil « Tout valider » par défaut **85**, borné 0 à 100 et jamais au-dessus du
  seuil d'auto-rangement ; toast d'annulation **6 s** ; justification de l'IA **160 caractères** au
  plus ; bascule mobile sous **768 px** ; bilan du jour en jour calendaire `Europe/Paris`.
- Raccourcis : Mail J, K, Entrée, Échap, V, C, R, E, #, X ; À valider J, K, V, C, Maj+V, Z ; Agenda
  T, J, K, D, W, M, A, C ; partout Ctrl K. Aucun raccourci ne s'active dans un champ de saisie.

## Review Focus

1. Annuler une action de l'utilisateur alors que le mail a changé depuis dans Gmail : refus lisible
   sous la ligne ou dans le toast, rien n'est écrasé. → test en Task 6.
2. Un raccourci clavier tapé dans un champ (recherche, filtre de menu, saisie d'une règle) : la
   lettre s'écrit, aucune action ne part. → test en Task 3.
3. Un mail HTML mis en page (fonds, `bgcolor`) affiché en thème sombre, texte noir sur encre : il doit
   rester sur la carte papier. → test en Task 9.
4. Seuil « Tout valider » réglé au-dessus du seuil d'auto-rangement : refusé par l'API avec un
   message, le curseur ne peut pas le dépasser. → test en Task 5.
5. Coller un code d'appairage avec espaces ou un point au milieu (« 482 917 », « 482·917 ») : les six
   chiffres sont pris. → test en Task 4.

---

### Task 1: Jetons de référence et standard design (lun-docs)

**Files:**
- Create: `design/tokens.css`, `tools/sync-tokens.mjs`, `tools/sync-tokens.test.mjs`
- Modify: `standards/design.md`, `README.md` (ligne sur `design/` s'il liste les dossiers),
  copie du plugin régénérée par `node tools/sync-standards.mjs`

**Interfaces:**
- Produces: `design/tokens.css`, et `node tools/sync-tokens.mjs --check <fichier>` : code de sortie
  0 si le fichier est identique à la référence précédée de l'en-tête
  `/* Copie générée depuis lun-docs/design/tokens.css : ne pas modifier ici */`, 1 sinon (avec le
  chemin en erreur) ; sans `--check`, écrit la copie. Tasks 2 et 16 l'utilisent.

- [ ] **Step 1:** Écrire `design/tokens.css` avec les valeurs exactes de
  `10-composants-b.html` (`:root` du socle : `--encre`, `--encre-2`, `--ivoire`, `--papier`,
  `--lune`, `--lavis`, `--rouge`, `--fond`, `--surface-1..3`, `--survol`, `--appui`, `--bordure`,
  `--bordure-forte`, `--texte`, `--texte-2`, `--texte-3`, tons `ok`, `attention`, `danger`
  (+ `--danger-plein`), `info`, `ia` en trio couleur/doux/bord, `--r-1..3`, `--r-rond`, `--ombre-1`,
  `--ombre-2`, `--serif`, `--sans`) puis deux blocs `[data-monde='acedia']` (`--accent:#3A6080`,
  `--accent-survol:#45719A`, `--accent-texte:#9DBEDA`, `--accent-doux:rgba(58,96,128,.24)`,
  `--accent-bord:rgba(110,155,195,.45)`) et `[data-monde='anima']` (`--accent:#7A1818`,
  `--accent-survol:#8E2020`, `--accent-texte:var(--texte)`, `--accent-doux:rgba(122,24,24,.26)`,
  `--accent-bord:rgba(224,180,172,.32)`), avec le commentaire « rouge Anima jamais en texte ».
- [ ] **Step 2:** Tests `node:test` de `syncTokens(root, target, { check })` sur le modèle de
  `sync-standards.test.mjs` : copie absente → changée ; copie identique (fins de ligne CRLF
  comprises) → inchangée ; copie modifiée → `--check` sort 1. Les lancer, échec attendu.
- [ ] **Step 3:** Écrire `tools/sync-tokens.mjs` ; tests au vert (`node --test tools/`).
- [ ] **Step 4:** Mettre à jour `standards/design.md` selon le §7 de la spec : règle B (socle commun,
  accent du monde, `data-monde` posé sur la racine de chaque vue) ; rouge Anima jamais en texte ;
  fichier `design/tokens.css` et sa vérification ; tableau des mondes gardé « pour identifier un
  projet, plus comme fond d'application » ; liste des composants du §4 ; bibliothèques du §3 ;
  catalogue vérifié dans Chrome avant toute PR de front. Puis `node tools/sync-standards.mjs` et
  `node tools/check-repo.mjs --addresses .`.
- [ ] **Step 5:** Commit `docs: shared design tokens and rule B in the design standard`, pousser,
  ouvrir la PR lun-docs en brouillon (spec, maquettes, plan, jetons, standard).

### Task 2: Socle technique d'Acedia

**Files:**
- Create: `views/src/lib/tokens.css` (remplacé par la copie générée), `scripts/check-colors.mjs`,
  `scripts/check-colors.test.ts`
- Modify: `views/package.json`, `app/package.json`, `package.json` (script `check:colors`),
  `.github/workflows/ci.yml`, `app/src/main.ts`, `app/index.html`

**Interfaces:**
- Consumes: `tools/sync-tokens.mjs` (Task 1).
- Produces: dépendances `bits-ui`, `@internationalized/date`, `@lucide/svelte` dans `views` ;
  `fullcalendar` dans `views` ; `npm run check:colors` ; l'attribut `data-monde="acedia"` posé sur la
  racine de chaque vue exportée (pas sur `<html>`).

- [ ] **Step 1:** Test de `findHardcodedColors(files: string[]): { file: string; line: number }[]`
  dans `scripts/check-colors.test.ts` : signale `#3a6080`, `rgb(`, `rgba(` et `hsl(` dans un `.svelte`
  ou `.ts` ; ignore `tokens.css`, les fichiers de test et les commentaires `/* … */` ;
  `color-mix(in srgb, var(--x) 20%, transparent)` n'est pas signalé. Échec attendu.
- [ ] **Step 2:** Écrire `scripts/check-colors.mjs` (parcourt `views/src` et `app/src`) ; tests au
  vert ; ajouter `check:colors` et l'étape CI qui lance aussi
  `node "$RUNNER_TEMP/lun-docs/tools/sync-tokens.mjs" --check views/src/lib/tokens.css`.
- [ ] **Step 3:** Générer `views/src/lib/tokens.css` depuis lun-docs ; l'export `./styles.css` du
  paquet reste ; installer les quatre dépendances aux versions de l'en-tête.
- [ ] **Step 4:** `npm run check:colors` liste les couleurs en dur des vues actuelles : c'est la
  liste de travail des Tasks 9 à 15 (la CI ne bloque sur `check:colors` qu'à partir de la Task 15,
  quand tous les écrans sont refaits ; jusque-là l'étape est en `continue-on-error`).
- [ ] **Step 5:** `npm run typecheck && npm test && npm run build` au vert ; commit
  `chore: shared tokens and ui dependencies`.

### Task 3: Composants de base et page catalogue

**Files:**
- Create: dans `views/src/lib/ui/` : `Button.svelte`, `IconButton.svelte`, `Field.svelte`,
  `TextInput.svelte`, `Select.svelte`, `Slider.svelte`, `Switch.svelte`, `Checkbox.svelte`,
  `Segmented.svelte`, `Badge.svelte`, `Chip.svelte`, `Icon.ts`, `shortcuts.ts`,
  `shortcuts.test.ts`, `index.ts` ; `app/catalogue.html`, `app/src/catalogue/Catalogue.svelte`
- Modify: `views/src/lib/index.ts` (exporte `ui`), `app/vite.config.ts` (entrée `catalogue.html`
  servie par `vite dev` seulement, absente du build)

**Interfaces:**
- Produces:
  - `Button` : props `variant: 'principal' | 'doux' | 'secondaire' | 'fantome' | 'danger'`,
    `size: 'petit' | 'normal' | 'grand'` (28, 34, 42 px), `icon?: Component`, `disabled`, `onclick`.
  - `IconButton` : `icon`, `label` (obligatoire, sert d'`aria-label` et d'info-bulle), `size`.
  - `Field` : `label`, `hint?`, `error?` (l'erreur remplace l'aide), slot du contrôle.
  - `Select`, `Slider` (avec `value`, `min`, `max`, affichage « 95 % »), `Switch`, `Checkbox`,
    `Segmented` (`options: { value: string; label: string }[]`) : sur Bits UI.
  - `Badge` : `tone: 'ok' | 'attention' | 'danger' | 'info' | 'ia' | 'neutre'`. `Chip` : `on`.
  - `shortcuts.ts` : `bindShortcuts(map: Record<string, () => void>, target?: EventTarget): () => void` ;
    clés au format `j`, `Shift+v`, `Ctrl+k`, `Escape`, `#` ; ignore les événements venus d'un
    `input`, `textarea`, `select` ou `[contenteditable]` ; renvoie la fonction de retrait.

- [ ] **Step 1:** Tests de `bindShortcuts` : `j` déclenche, `Shift+v` ne déclenche pas `v`, une
  touche tapée dans un `<input>` ne déclenche rien (Review Focus 2), `Ctrl+k` déclenche même dans un
  champ de recherche marqué `data-palette`, le retrait coupe tout. Échec attendu.
- [ ] **Step 2:** Écrire `shortcuts.ts` ; tests au vert.
- [ ] **Step 3:** Écrire les composants, styles uniquement par jetons, mesures de la planche 10
  (rayons 6, 10, 14 ; hauteurs ; une seule ombre pour ce qui flotte).
- [ ] **Step 4:** Tests de rendu (Testing Library, comme les tests de vues existants) : `Field` avec
  `error` n'affiche plus l'aide et pose `aria-invalid` ; `IconButton` sans libellé ne compile pas (prop
  requise) ; `Segmented` émet la valeur choisie.
- [ ] **Step 5:** `Catalogue.svelte` montre chaque composant dans ses états (normal, survol forcé,
  focus, désactivé, erreur, chargement) ; `npm run dev -w @lun-acedia/app` puis ouvrir
  `/catalogue.html` dans Chrome.
- [ ] **Step 6:** Commit `feat(views): base ui components and catalogue page`.

### Task 4: Calques, IA, structures et navigation (arrêt)

**Files:**
- Create: dans `views/src/lib/ui/` : `Menu.svelte` (menu avec filtre au clavier, sections,
  raccourcis affichés), `Popover.svelte`, `Tooltip.svelte`, `Dialog.svelte`,
  `ConfirmDialog.svelte`, `toasts.svelte.ts`, `Toaster.svelte`, `Banner.svelte`,
  `ProposalChip.svelte`, `ProposalCard.svelte`, `AutoMark.svelte`, `ListRow.svelte`,
  `DayGroup.svelte`, `SettingsCard.svelte`, `SettingsRow.svelte`, `EmptyState.svelte`,
  `Skeleton.svelte`, `Rail.svelte`, `NavLink.svelte`, `ServiceCard.svelte`, `Tabs.svelte`,
  `CommandPalette.svelte`, `BottomNav.svelte`, `Fab.svelte`, `CodeInput.svelte`,
  `StandaloneCard.svelte`, `Steps.svelte`, avec leurs tests
- Modify: `views/src/lib/ui/index.ts`, `app/src/catalogue/Catalogue.svelte`

**Interfaces:**
- Produces:
  - `toasts.svelte.ts` : `toast(message: string, options?: { undo?: () => Promise<void>; tone?: 'ok' | 'danger' }): void` ;
    durée 6 s ; `Z` déclenche l'annulation du dernier toast encore affiché ; un échec d'annulation
    remplace le toast par le message d'erreur (ton danger).
  - `ConfirmDialog` : `title`, `message`, `confirmLabel`, `onconfirm: () => Promise<void>` ; bouton
    de confirmation en variante `danger`.
  - `ProposalChip` : `proposal: ProposalView`, `boxName: string`, `onvalidate`, `oncorrect` ;
    `ProposalCard` : en plus `reason?: string` et `threshold: number` (texte « Sous le seuil de
    N % : en attente de validation »).
  - `ServiceCard` : `state: 'actif' | 'pause' | 'cle-refusee'`, `detail: string`.
  - `CodeInput` : `value` (six chiffres), `error?`, `oncomplete(code: string)` ; garde les seuls
    chiffres de ce qui est collé ou tapé.
  - `CommandPalette` : `commands: { id: string; label: string; group: string; run: () => void }[]`,
    ouverte par Ctrl K.

- [ ] **Step 1:** Tests : `toast` avec `undo` appelle la fonction sur `Z` puis disparaît ; un
  `undo` qui rejette affiche son message ; `CodeInput` sur collage de « 482 917 » et de « 482·917 »
  appelle `oncomplete('482917')` (Review Focus 5) ; `Menu` filtre ses entrées à la saisie et `Entrée`
  choisit la première ; `ConfirmDialog` n'appelle `onconfirm` qu'au clic. Échec attendu.
- [ ] **Step 2:** Écrire les composants sur Bits UI (`DropdownMenu`, `Popover`, `Tooltip`,
  `Dialog`, `AlertDialog`, `Tabs`, `Command`) ; tests au vert.
- [ ] **Step 3:** Compléter le catalogue (planche 10, blocs 05 à 08) ; vérifier dans Chrome qu'un
  menu ouvert dans un conteneur `overflow:hidden` reste entier.
- [ ] **Step 4:** `npm run typecheck && npm test` ; commit `feat(views): overlays, ai, structure and navigation components`.
- [ ] **Step 5 (Arrêt):** captures du catalogue (bureau et mobile) à CrOliX ; attendre son accord.

### Task 5: Serveur, « pourquoi » de l'IA et second seuil

**Files:**
- Modify: `server/src/db.ts` (migration ajoutée en fin de liste), `server/src/triage/classifier.ts`,
  `server/src/triage/anthropic.ts`, `server/src/triage/proposals.ts`,
  `server/src/triage/pipeline.ts`, `server/src/triage/routes.ts`, `server/src/types.ts`,
  `views/src/lib/types.ts` (par `npm run sync-types -w @lun-ecosystem/lunacedia-views`),
  `views/src/lib/client.ts`, `views/src/testing/fake-client.ts`
- Test: `server/src/triage/anthropic.test.ts`, `server/src/triage/pipeline.test.ts`,
  `server/src/app.test.ts` (routes)

**Interfaces:**
- Produces: `Classification.reason: string` ; `ProposalView.reason?: string` ;
  `Settings { threshold: number; bulkThreshold: number }` ; `PUT /api/settings` accepte l'un ou
  l'autre champ ; client `updateSettings(patch: Partial<Settings>): Promise<Settings>`.

- [ ] **Step 1:** Tests : l'appel outil d'Anthropic exige `reason` (chaîne, 160 caractères au plus,
  tronquée au-delà côté serveur) ; une proposition enregistrée rend son `reason` dans la liste des
  mails ; une ancienne proposition sans motif rend `reason` absent ; `GET /api/settings` rend
  `bulkThreshold: 85` par défaut ; `PUT` avec `bulkThreshold` supérieur à `threshold` répond 400 avec
  « Le seuil de « Tout valider » ne peut pas dépasser le seuil d’auto-rangement » (Review Focus 4).
  Échec attendu.
- [ ] **Step 2:** Migration : `ALTER TABLE proposals ADD COLUMN reason TEXT` ; consigne du prompt :
  une phrase factuelle, en français, sur ce qui justifie la boîte (expéditeur déjà vu, contenu),
  sans donnée personnelle recopiée. Implémenter ; tests au vert.
- [ ] **Step 3:** Synchroniser les types des vues, compléter le client et le faux client.
- [ ] **Step 4:** `npm run typecheck && npm test` ; commit `feat(server): ai reason and bulk validation threshold`.

### Task 6: Serveur, vraie annulation, règle par expéditeur et bilan du jour

**Files:**
- Modify: `server/src/triage/journal.ts`, `server/src/triage/pipeline.ts`,
  `server/src/triage/examples.ts`, `server/src/triage/rules.ts`, `server/src/triage/routes.ts`,
  `server/src/gmail/routes.ts`, `server/src/types.ts`, puis types, client et faux client des vues
- Test: `server/src/triage/journal.test.ts`, `server/src/triage/pipeline.test.ts`,
  `server/src/gmail/routes.test.ts`

**Interfaces:**
- Produces:
  - `Origin = 'rule' | 'ai' | 'user'`.
  - `logUser(db, change: LabelChange, action: UserAction, now: Date, previous?: { proposalStatus: ProposalStatus; example: Example | null }): number`
    avec `UserAction = 'validate' | 'correct' | 'file' | 'archive' | 'trash' | 'spam'` ; l'état
    d'avant est stocké dans une nouvelle colonne `journal.restore TEXT` (JSON).
  - Les routes `POST /api/mail/:id/{validate,correct}` et les actions unitaires
    `POST /api/mail/:id/{file,archive,trash,spam}` renvoient en plus `journalId: number` ; `batch`
    renvoie `journalId` pour chaque mail.
  - `undo` d'une entrée `user` : remet les étiquettes (même contrôle « le mail a changé depuis »),
    puis pour `validate` et `correct` remet la proposition à `pending` et restaure l'exemple d'avant
    (ou le supprime s'il n'y en avait pas).
  - `POST /api/mail/:id/correct` accepte `rememberSender?: boolean` : crée la règle
    `{ field: 'from', op: 'equals', value: <adresse de l'expéditeur>, boxId }` en dernière position,
    sauf si une règle identique existe.
  - `GET /api/stats/today` → `{ autoFiled: number; validated: number; corrected: number }`, comptés
    sur le journal non annulé du jour `Europe/Paris`.
  - Client : `validate`, `correct(id, boxId, tagIds, opts?: { rememberSender?: boolean })`, actions
    unitaires et `batch` rendent `journalId` ; `todayStats()`.

- [ ] **Step 1:** Tests :
  - valider puis annuler → étiquettes d'avant, proposition `pending`, exemple d'avant restauré ;
  - corriger sans exemple préalable puis annuler → exemple supprimé ;
  - archiver puis annuler → mail de retour en réception ;
  - annuler alors que Gmail montre d'autres étiquettes → `ConflictError` « Le mail a changé depuis,
    annulation refusée », rien n'est modifié (Review Focus 1) ;
  - annuler deux fois → « Action déjà annulée » ;
  - `rememberSender` crée une seule règle, même appelé deux fois ;
  - `stats/today` compte une action d'hier comme hier (23 h 30 heure de Paris), ignore les entrées
    annulées.
  Échec attendu.
- [ ] **Step 2:** Migration `ALTER TABLE journal ADD COLUMN restore TEXT` ; implémenter ; tests au
  vert. Le journal (`/api/journal`) ne fait pas partie du contrat satellite : pas de changement de
  `contrat-satellite.md`, à vérifier en relisant ses routes.
- [ ] **Step 3:** Types, client et faux client ; commit `feat(server): undo for user actions, sender rule and daily stats`.

### Task 7: Bug d'encodage des mails

**Files:** à déterminer par l'enquête (point de départ : `server/src/gmail/body.ts`,
`server/src/gmail/sync.ts` pour l'extrait, `views/src/lib/mail/MailFrame.svelte`)

- [ ] **Step 1:** Suivre superpowers:systematic-debugging. Reproduire « Envoyé à partir de Outlook
  pour Android » qui s'affiche « Envoy家 該 partir de » : retrouver dans Gmail de test le mail envoyé
  depuis Outlook pour Android, relever ses en-têtes `Content-Type` et `Content-Transfer-Encoding`
  partie par partie, et localiser la couche fautive (décodage serveur, extrait, rendu de la frame).
- [ ] **Step 2:** Écrire un test de non-régression à partir d'une partie MIME anonymisée qui
  reproduit le défaut ; il échoue.
- [ ] **Step 3:** Corriger la cause ; test au vert, et les tests de `body.test.ts` toujours au vert.
- [ ] **Step 4:** Commit `fix(server): decode mail parts in their real charset` (ou le titre qui
  nomme la vraie cause).

### Task 8: Bug des événements en double au changement d'heure

**Files:** à déterminer par l'enquête (point de départ : `server/src/agenda/calendar.ts`,
`server/src/agenda/time.ts`, `views/src/lib/agenda/dates.ts`)

- [ ] **Step 1:** Suivre superpowers:systematic-debugging : reproduire avec un événement récurrent
  hebdomadaire qui traverse le passage à l'heure d'hiver (dimanche 25 octobre 2026), et trouver où
  la même occurrence apparaît deux fois (synchronisation, fusion des fenêtres, calcul des jours).
- [ ] **Step 2:** Test de non-régression avec le faux agenda (`testing/fake-agenda.ts`) : la semaine
  du 19 au 25 octobre et celle du 26 octobre au 1er novembre montrent chaque occurrence une seule fois.
  Échec attendu.
- [ ] **Step 3:** Corriger la cause ; tests au vert ; commit `fix(agenda): no duplicate events across a DST change`.

### Task 9: Coque de l'app et écran Mail (arrêt)

**Files:**
- Create: `app/src/shell/Shell.svelte` (rail, haut de page avec recherche, `Toaster`, palette,
  navigation mobile), `views/src/lib/mail/theme.ts`, `views/src/lib/mail/theme.test.ts`,
  `views/src/lib/mail/SelectionBar.svelte`
- Modify: `app/src/App.svelte`, `views/src/lib/mail/*.svelte` (Mailbox, MailboxNav, MailList,
  MailRow, MailReader, ActionBar, BoxMenu, MailFrame, Composer), `views/src/lib/mail/Mailbox.test.ts`

**Interfaces:**
- Consumes: composants des Tasks 3 et 4 ; `ProposalView.reason`, `Settings.threshold` (Task 5) ;
  `journalId` et `undo` (Task 6).
- Produces: `mailTheme(html: string): 'sombre' | 'papier'` ; `Shell` : props `current: 'mail' | 'a-valider' | 'agenda' | 'taches' | 'journal' | 'reglages'`,
  `service: ServiceCard['state']`, `counts: { inbox: number; pending: number; tasks: number }`.

- [ ] **Step 1:** Tests de `mailTheme` : texte brut et HTML sans fond → `sombre` ; HTML avec
  `bgcolor=`, ou `background`/`background-color` autre que blanc, `#fff`, `#ffffff`, `white` ou
  `transparent` → `papier` (Review Focus 3) ; HTML avec seulement `color:#333` → `sombre`. Échec
  attendu, puis implémenter, puis au vert.
- [ ] **Step 2:** Tests de `Mailbox` : sans mail ouvert, aucune zone de lecture n'est rendue et la
  liste occupe la largeur ; ouvrir un mail affiche la lecture ; `Échap` la ferme ; valider une
  proposition depuis la ligne affiche le toast « Rangé dans Factures » avec Annuler, qui appelle
  `undo(journalId)` ; cocher deux mails affiche la barre de sélection « 2 sélectionnés ». Échec
  attendu.
- [ ] **Step 3:** Refaire l'écran selon `03-mail.html` : rangée avec pastille IA (proposé, rangé
  seul, rien trouvé), actions au survol, groupes par jour, barre d'outils de lecture groupée avec une
  seule action principale (Répondre), carte de proposition avec le motif, menu « Ranger dans »
  (`Menu`, suggestion de l'IA en tête), frame en thème `sombre` (feuille de style injectée dans le
  `srcdoc` : fond `--fond`, texte `--papier`, liens `--accent-texte`) ou `papier` (carte claire
  arrondie) ; raccourcis Mail ; mobile : deux écrans, navigation en bas, bouton flottant. La coque
  porte la carte d'état du service. Palette (Ctrl K) : aller à chaque écran, « Nouveau message »,
  « Mettre le tri en pause » ou « Reprendre le tri », rechercher dans les mails. Retirer « Plus
  tard » (hors palier).
- [ ] **Step 4:** Tests au vert ; `npm run check:colors` sans entrée dans `mail/` ni `shell/` ;
  commit `feat(views): mail screen on the shared components`.
- [ ] **Step 5 (Arrêt):** captures (réception, mail ouvert avec menu, mobile liste et lecture) à
  CrOliX ; attendre son accord.

### Task 10: Écran À valider (arrêt)

**Files:**
- Create: `views/src/lib/mail/Pending.svelte`, `views/src/lib/mail/Pending.test.ts`
- Modify: `views/src/lib/index.ts`, `app/src/App.svelte`

**Interfaces:**
- Consumes: `bulkThreshold`, `todayStats()`, `correct(…, { rememberSender })`, `journalId`.

- [ ] **Step 1:** Tests : propositions groupées par boîte proposée, groupe trié par confiance ;
  « Tout valider au-dessus de 85 % » ne valide que celles à 85 % et plus ; `V` valide la carte active
  et passe à la suivante ; `Maj+V` valide le groupe actif ; menu « Corriger » avec la case « Retenir
  pour cet expéditeur » décochée par défaut, et cochée elle envoie `rememberSender: true` ; file vide
  : « Rien à valider » et les trois nombres de `todayStats()`. Échec attendu.
- [ ] **Step 2:** Refaire selon `04-a-valider.html` (textes au neutre) ; tests au vert ; commit
  `feat(views): pending proposals queue`.
- [ ] **Step 3 (Arrêt):** captures (file, menu Corriger, file vide, mobile) ; attendre l'accord.

### Task 11: Agenda et tâches (arrêt)

**Files:**
- Create: `views/src/lib/agenda/CalendarGrid.svelte` (monte FullCalendar), `views/src/lib/agenda/EventPopover.svelte`,
  `views/src/lib/agenda/Tasks.svelte`, `views/src/lib/agenda/Tasks.test.ts`
- Modify: `views/src/lib/agenda/Agenda.svelte`, `ItemEditor.svelte`, `dates.ts`,
  `Agenda.test.ts` ; `DayView.svelte`, `WeekView.svelte`, `MonthView.svelte`, `ItemChip.svelte`
  supprimés si FullCalendar est retenu

- [ ] **Step 1 (garde-fou de la spec §3):** monter FullCalendar 7 en vue semaine avec des données
  factices, habillé par les jetons (fond, grille, ligne de l'heure en `--danger`, couleurs par
  agenda, bandeau des journées entières et des tâches en haut). Si l'un de ces quatre points ne se
  règle pas proprement par les variables et classes de FullCalendar, garder la grille maison et la
  refaire selon `05-agenda.html` ; noter la décision dans le ledger (`Ruling:`), sans revenir vers
  CrOliX.
- [ ] **Step 2:** Tests : titre de période « 19 – 25 octobre 2026 » ; clic sur un événement ouvre la
  bulle (titre, horaire, lieu, rappel, agenda) ; `C` ouvre la création ; tâches groupées « En
  retard », « Cette semaine », « Sans date », terminées repliées ; ajout en une ligne avec date et
  liste. Échec attendu.
- [ ] **Step 3:** Refaire selon la planche : vues Jour, Semaine, Mois, Planning (Planning par défaut
  sous 768 px) ; mini-calendrier et agendas à cocher dans le rail ; fenêtre unique de création ou
  modification (bascule Événement ou Tâche) ; raccourcis Agenda. Retirer le lien tâche vers mail.
- [ ] **Step 4:** Tests au vert ; commit `feat(views): agenda and tasks screens`.
- [ ] **Step 5 (Arrêt):** captures (semaine avec bulle, mois, tâches, fenêtre, mobile) ; attendre
  l'accord.

### Task 12: Réglages (arrêt)

**Files:**
- Modify: `views/src/lib/settings/*.svelte` et `Settings.test.ts`, `AnthropicKey.test.ts`

- [ ] **Step 1:** Tests : colonne de thèmes (Compte Google, Appareils et applications, Tri par
  l'IA, Boîtes et règles) ; curseurs des deux seuils, le second borné par le premier ; rôle d'une
  étiquette en `Segmented` « Boîte / Étiquette / Ignorée » (« Ignorée » = le rôle affiché aujourd'hui « Aucun », même donnée) ; règle
  affichée en phrase « Si l’expéditeur est « … », ranger dans Factures » ; « Monter » sur la
  deuxième règle envoie `position` ; retirer un appareil ou la clé passe par `ConfirmDialog` ; clé
  refusée → bannière avec « Remplacer la clé ». Échec attendu.
- [ ] **Step 2:** Refaire selon `06-reglages.html` (glisser par la poignée en plus des boutons ;
  appareils sans dernière activité) ; tests au vert ; commit `feat(views): settings screens`.
- [ ] **Step 3 (Arrêt):** captures (tri par l'IA, boîtes et règles avec bannière, appareils avec
  confirmation, mobile) ; attendre l'accord.

### Task 13: Journal (arrêt)

**Files:**
- Modify: `views/src/lib/mail/Journal.svelte` ; Create: `views/src/lib/mail/Journal.test.ts`

- [ ] **Step 1:** Tests : groupes par jour ; icône et libellé par origine (« par l’IA », « par une
  règle », « à la main ») ; filtres Tout, IA, Règles, Annulés sur les lignes chargées ; une
  annulation refusée affiche son message sous sa ligne ; « Plus ancien » charge la page suivante ;
  journal vide avec son explication. Échec attendu.
- [ ] **Step 2:** Refaire selon `07-journal.html` (« par une règle » : le journal ne garde pas le
  numéro de la règle) ; tests au vert ; commit `feat(views): journal screen`.
- [ ] **Step 3 (Arrêt):** captures (journal, vide, mobile) ; attendre l'accord.

### Task 14: Appairage et autorisation (arrêt)

**Files:**
- Modify: `app/src/Pair.svelte`, `app/src/Authorize.svelte`, leurs tests,
  `views/src/lib/settings/Devices.svelte` (fenêtre « Code pour un nouvel appareil »),
  `server/src/cli/pair-code.ts` (code affiché « 482 917 » et heure d'expiration)

- [ ] **Step 1:** Tests : `Pair` sur `StandaloneCard` + `CodeInput`, envoi automatique au sixième
  chiffre, erreur « Code incorrect ou expiré. Demander un nouveau code. » ; en mode autorisation,
  `Steps` montre « Navigateur relié » puis « Autoriser » ; `Authorize` rend les quatre droits avec
  icône, l'hôte de retour, deux boutons de même taille ; `pair-code` imprime le code groupé par trois.
  Échec attendu.
- [ ] **Step 2:** Refaire selon `08-appairage.html` ; tests au vert ; commit `feat(app): pairing and authorization pages`.
- [ ] **Step 3 (Arrêt):** captures (relier, code refusé, autoriser, code dans Réglages, mobile) ;
  attendre l'accord.

### Task 15: Le bilan des couleurs et des textes

- [ ] **Step 1:** `npm run check:colors` ne trouve plus rien ; retirer `continue-on-error` de l'étape
  CI.
- [ ] **Step 2:** Relire tous les textes affichés : aucun « tu », aucun « Anima » dans `views/` ni
  `app/` (le test `noAnima.test.ts` couvre `app/` ; l'étendre à `views/src`), aucun tiret
  cadratin. Commit `chore: enforce tokens and copy rules`.

### Task 16: Pages du core d'Anima (arrêt)

**Files (lun-anima):**
- Create: `core/src/tokens.css` (copie générée par `tools/sync-tokens.mjs`)
- Modify: `core/src/web-page.ts` (lit les jetons au lieu de `ANIMA_TOKENS`), `core/src/home.ts`,
  `core/src/satellites/authorize.ts` (`returnPage`), `core/src/home.test.ts`, test de la page de
  retour, CI (étape `sync-tokens.mjs --check`)

**Interfaces:**
- Consumes: `SatelliteIdentity.name`, résolu avant l'envoi de la page de succès.

- [ ] **Step 1:** Tests : l'accueil rend « En ligne · version <v> », deux étapes numérotées avec
  `npm run connect -- http://localhost:8787` et `npm run chat`, et la phrase sur Lun'Acedia ; la
  politique de sécurité de l'accueil et de la page de retour est inchangée (en-tête comparé à la
  valeur actuelle, aucune balise `<script>` ni `<form>`) ; la page de succès dit « Lun'Acedia est
  relié à Lun'Anima. » quand l'identité porte le nom, sinon « Le satellite est relié à Lun'Anima. » ;
  interrompue : le message du satellite échappé, et « Rien n’a été relié. Relancer la commande pour
  réessayer. ». Échec attendu.
- [ ] **Step 2:** Refaire selon `09-core.html` (surfaces communes, `data-monde="anima"`, rouge en
  fond et en point seulement) ; tests au vert ; commit `feat(core): home and return pages in rule B`.
- [ ] **Step 3 (Arrêt):** captures (accueil, trois pages de retour, mobile) ; attendre l'accord.

### Task 17: Recette et PR

- [ ] **Step 1:** Barrières de chaque dépôt au vert (`format:check`, `lint`, `typecheck`, `test`,
  `build`, `check:colors`, `check-repo --addresses`).
- [ ] **Step 2:** Mettre à jour les PR (Acedia, core, lun-docs) : critères du §10 de la spec cochés
  un par un, captures de chaque écran, lien vers les autres PR, ordre de fusion. Passer les PR en
  « prêtes » seulement après la recette.
- [ ] **Step 3:** Recette de CrOliX dans Chrome sur le compte Google de test : parcours complet
  (trier, valider, corriger avec règle, annuler depuis le toast et depuis le journal, agenda autour
  du changement d'heure, réglages, relier un navigateur, autoriser le core). Corriger dans la même
  branche ce qu'il signale, sans vague de patchs : chaque retour est traité contre sa planche.
