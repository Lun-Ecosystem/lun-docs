# Relier et alerter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** relier le core de Lun'Anima à un satellite par une page d'autorisation (sans code recopié),
durcir l'appairage d'Acedia, et prévenir d'une clé d'API refusée ou proche de son échéance, avec
remplacement sans redémarrage, le tout dans la DA.

**Architecture:** le contrat v1 gagne `GET /lun/v1/authorize` et un échange `POST /lun/v1/pair` avec
`code_verifier` (OAuth « authorization code » + PKCE S256, retour en boucle locale seulement). Acedia
porte la page d'autorisation (route `autoriser` de son front), la liste « Appareils et applications »
et la clé Anthropic modifiable ; le core lance le flux depuis `npm run connect -- <url>`, émet ses
propres événements (`satellite: "core"`) pour la clé OpenAI, et sert une page d'accueil publique.

**Tech Stack:** Node `^22.13.0 || >=24`, TypeScript ~6.0.3 strict, Hono, `node:sqlite`, zod 4,
Svelte 5 (front et vues d'Acedia), Vitest, `@anthropic-ai/sdk`, `openai`, `@fontsource/inter` et
`@fontsource/cormorant-garamond` (polices auto-hébergées, déjà utilisées par le front d'Acedia).

**Spec:** `docs/specs/2026-10-20-relier-et-alerter-design.md` (§3.5 pour les précisions de
construction) ; `standards/contrat-satellite.md`, `standards/design.md`, skill `lun-design`.

## Global Constraints

- Un chantier = une issue par dépôt touché (`lun-acedia`, `lun-anima`), label `niveau:critique`
  (appairage et clés) ; branche `feat/relier-et-alerter` partie de `main` à jour dans chacun ; une PR
  en brouillon dès le premier push. Les docs (Task 1) vont dans la PR lun-docs#31. Seul CrOliX
  merge ; jamais de push vers `main`, de push forcé, de tag ni de release.
- Code, commits et noms techniques en anglais ; docs, PR et textes affichés en français.
- Textes des écrans d'outil : voix technique neutre, pas de « tu », pas de tiret cadratin, noms en
  « Lun'Xxx ». **Le front autonome d'Acedia ne contient jamais « Anima » en dur.**
- DA : tokens et polices de `standards/design.md` seulement, jamais de couleur en dur hors des
  tokens ; monde Acedia (`--monde-fond: #070c14`, `--monde-accent: #3a6080`) pour Acedia, monde
  Anima (`#120a0a` / `#7a1818`) pour le core ; contraste WCAG AA ; aucune police ni ressource
  depuis un CDN. Capture de chaque écran dans la PR de son dépôt.
- Lun'Acedia et lun-docs sont publics : aucun secret, aucune adresse réelle ni interne, y compris
  dans les captures.
- Une clé d'API n'est jamais journalisée, renvoyée par une API ni affichée en entier : seulement
  ses 4 derniers caractères.
- Aucun test ne touche le réseau, un vrai navigateur ou une vraie clé.
- Valeurs fixées : code d'appairage **10 min** ; code d'autorisation **2 min** ; verrou **5 échecs
  sur une fenêtre glissante de 10 min** ; attente de `connect` **5 min** ; `redirect_uri` accepté si
  `http:` et hôte exactement `127.0.0.1` ou `localhost` ; échéances **J-14** et **J-3** en jours
  calendaires `Europe/Paris`, contrôle au démarrage puis toutes les heures.
- Événements : `key.invalid` (`normal`), `key.restored` (`info`), `key.expiring` (`normal`,
  `data: { daysLeft: 14 | 3, expires: 'AAAA-MM-JJ' }`).

## Review Focus

1. `redirect_uri` piégé (`http://localhost.evil.test/`, `http://127.0.0.1@evil.test/`,
   `https://localhost/`, `javascript:`) : refusé avant toute action. → test en Task 3.
2. « Autoriser » cliqué deux fois, ou page rechargée après usage du code : le second échange échoue
   proprement, un seul client créé, le core affiche une erreur lisible. → tests en Tasks 3 et 7.
3. `npm run connect` lancé puis onglet fermé sans répondre : au bout de 5 min, message clair, écouteur
   fermé, code de sortie 1. → test en Task 7.
4. Redémarrage du serveur avec une clé toujours refusée, ou après une alerte d'échéance déjà
   envoyée : aucun événement en double. → tests en Tasks 5 et 8.
5. L'appareil qui consulte se retire lui-même dans « Appareils et applications » : retour à l'écran
   d'appairage, sans boucle d'erreurs 401. → test en Task 4.

---

### Task 1: Contrat satellite (lun-docs)

**Files:**
- Modify: `standards/contrat-satellite.md` (lun-docs, branche `docs/relier-et-alerter`)

**Interfaces:**
- Produces: le texte de référence des Tasks 3 et 7.

- [ ] **Step 1:** Ajouter à la table des routes `GET /lun/v1/authorize?client&redirect_uri&state&code_challenge`
  (publique, mène à la page d'autorisation du satellite) ; compléter `POST /lun/v1/pair` :
  `{ code }` (code à 6 chiffres) **ou** `{ code, code_verifier, client }` (code d'autorisation).
- [ ] **Step 2:** Section « Appairage » : remplacer « affiché par le satellite (son front autonome) »
  par « donné par le satellite, par son front ou par sa commande `pair-code` » ; ajouter une
  sous-section « Liaison par autorisation » (flux du spec §3.1, PKCE S256, code 2 min, boucle
  locale, `error=access_denied`), la distinction appareil / application, et le verrou (5 échecs,
  10 min glissantes, codes en cours annulés).
- [ ] **Step 3:** Ajouter `key.invalid`, `key.restored`, `key.expiring` comme types d'événement
  recommandés (section Comportements, à côté de « Crédit épuisé »).
- [ ] **Step 4:** Commit `docs: linking by authorization in the satellite contract`.

### Task 2: Acedia, appairage durci et commande `pair-code`

**Files:**
- Modify: `server/src/db.ts` (migration : `clients.kind TEXT NOT NULL DEFAULT 'device'`, table
  `pairing_failures (at TEXT NOT NULL)`), `server/src/contract/auth.ts`,
  `server/src/contract/routes.ts`, `server/src/app.ts` (routes clients), `server/src/main.ts`
  (`HOST`), `package.json` + `server/package.json` (script `pair-code`), `.env.example` (`HOST=127.0.0.1`),
  `README.md`.
- Create: `server/src/cli/pair-code.ts`.
- Test: `server/src/contract/auth.test.ts`, `server/src/contract/routes.test.ts`, `server/src/app.test.ts`.

**Interfaces:**
- Produces:
  - `recordPairingFailure(db, now: Date, log: (line: string) => void): void` : enregistre l'échec ;
    au 5e dans la fenêtre, annule les `pairing_codes` non utilisés (Task 3 y ajoutera les codes
    d'autorisation), vide les échecs, journalise
    `Appairage verrouillé : 5 codes faux en 10 min, codes en cours annulés.` puis rappelle
    `bootstrapPairing`.
  - `listClients(db): { id: number; name: string; kind: 'device' | 'app'; createdAt: string; tokenHash: string }[]`
    (non révoqués) ; `GET /api/clients` → `{ clients: { id, name, kind, createdAt, current }[] }`
    (`current` vrai pour le jeton de la requête ; jamais de hash renvoyé) ; `DELETE /api/clients/:id`
    → 204 (`revokeClient`, révocation douce), 404 si inconnu.
  - `pair(db, code, clientName, now, kind: 'device' | 'app' = 'device')`.

- [ ] **Step 1: Tests qui échouent** : `locks pairing after 5 failures in 10 minutes` (4 échecs puis
  un code valide marche ; 5 échecs annulent un code émis avant, journal attendu) ; `slides the
  window` (5 échecs étalés sur 11 min ne verrouillent pas) ; `re-issues the first-run code when no
  client exists` ; `lists and revokes clients, current flagged, no hash in the response` ;
  `pair-code works whether clients exist or not`.
- [ ] **Step 2:** Lancer `npm test -w @lun-acedia/server` : échecs attendus.
- [ ] **Step 3:** Implémenter. Échecs comptés en base (le CLI et le serveur partagent l'état). `serve`
  reçoit `hostname: process.env.HOST?.trim() || '127.0.0.1'`. `cli/pair-code.ts` charge le `.env`
  racine comme `main.ts`, ouvre la base, affiche `Code d'appairage (10 min) : 123456`.
- [ ] **Step 4:** `npm test && npm run lint && npm run typecheck && npm run format:check` : vert.
- [ ] **Step 5:** Commit `feat(server): pairing lock, client list and pair-code command`.

### Task 3: Acedia, liaison par autorisation (serveur)

**Files:**
- Modify: `server/src/db.ts` (table `authorization_codes (code TEXT PRIMARY KEY, client TEXT NOT
  NULL, redirect_uri TEXT NOT NULL, code_challenge TEXT NOT NULL, expires_at TEXT NOT NULL,
  used_at TEXT)`), `server/src/contract/auth.ts`, `server/src/contract/routes.ts`, `server/src/app.ts`.
- Create: `server/src/contract/authorize.ts`.
- Test: `server/src/contract/authorize.test.ts`.

**Interfaces:**
- Consumes: `pair(..., kind)`, `recordPairingFailure` (Task 2).
- Produces:
  - `isLoopbackRedirect(uri: string): boolean` (`new URL`, protocole `http:`, `hostname` exactement
    `127.0.0.1` ou `localhost`, sans `username`/`password`).
  - `GET /lun/v1/authorize?client&redirect_uri&state&code_challenge` (publique) : paramètres
    manquants ou `redirect_uri` refusé → 400 texte lisible, sans redirection ; sinon 302 vers
    `/?autoriser=1&client=…&redirect_uri=…&state=…&code_challenge=…`.
  - `POST /api/authorizations` (jeton d'appareil, `kind = 'device'` exigé, 403 sinon)
    `{ client, redirect_uri, state, code_challenge, decision: 'allow' | 'deny' }` →
    `{ redirect: string }` : `allow` → crée un code d'autorisation (32 octets base64url, 2 min) et
    renvoie `redirect_uri?code=…&state=…` ; `deny` → `redirect_uri?error=access_denied&state=…`.
    `redirect_uri` revalidé ici.
  - `POST /lun/v1/pair` avec `code_verifier` : vérifie `base64url(sha256(code_verifier)) ===
    code_challenge`, code non utilisé et non expiré ; crée le client `kind = 'app'` au nom stocké ;
    échec → 401 et `recordPairingFailure`.

- [ ] **Step 1: Tests qui échouent** : `rejects tricky redirect_uri` (les quatre de Review Focus 1,
  plus `https://localhost/`) ; `redirects a valid request to the front` ; `issues a code only to a
  device token` (jeton d'application → 403) ; `allow then pair with the right verifier creates one
  app client` ; `wrong verifier, expired code (2 min 1 s), reused code: 401, counted as failures` ;
  `deny returns error=access_denied and creates nothing` ; `the lock also voids pending
  authorization codes`.
- [ ] **Step 2:** Lancer les tests : échecs attendus.
- [ ] **Step 3:** Implémenter (`node:crypto` `createHash('sha256')`, comparaison à temps constant).
- [ ] **Step 4:** Suite complète, lint, typecheck, format : vert.
- [ ] **Step 5:** Commit `feat(server): link a client app by authorization (PKCE)`.

### Task 4: Acedia, page d'autorisation et « Appareils et applications » (front)

**Files:**
- Create: `app/src/Authorize.svelte`, `views/src/lib/settings/Devices.svelte`.
- Modify: `app/src/App.svelte` (paramètre `autoriser`), `app/src/Pair.svelte` (reprise de
  l'autorisation après appairage), `views/src/lib/client.ts` (`listClients`, `revokeClient`,
  `authorize`), `views/src/lib/settings/Settings.svelte` (remplace `Pairing` par `Devices`).
- Delete: `views/src/lib/settings/Pairing.svelte`.
- Test: `views/src/lib/settings/Settings.test.ts` (ou `Devices.test.ts`), `app/src/*.test.ts`.

**Interfaces:**
- Consumes: routes des Tasks 2 et 3.
- Produces (`AcediaClient`) : `listClients(): Promise<{ id: number; name: string; kind: 'device' | 'app'; createdAt: string; current: boolean }[]>`,
  `revokeClient(id: number): Promise<void>`,
  `authorize(req: { client: string; redirect_uri: string; state: string; code_challenge: string; decision: 'allow' | 'deny' }): Promise<{ redirect: string }>`.

- [ ] **Step 1: Tests qui échouent** : `Devices lists devices and apps and revokes one` ;
  `revoking the current device clears the token and shows pairing, once` (Review Focus 5 : un seul
  passage à l'écran d'appairage, aucun appel après) ; `no "Anima" in the standalone front`
  (recherche insensible à la casse dans `app/src` et `views/src`, fichiers de test exclus) ;
  `Authorize shows the client name and the return host:port, and follows the redirect`.
- [ ] **Step 2:** Lancer les tests : échecs attendus.
- [ ] **Step 3:** Implémenter selon la maquette validée (`lun-docs/.superpowers/brainstorm/…/flux-connexion.html`)
  avec le skill `lun-design` puis `frontend-design` dans les limites de la DA. Textes fixés :
  - Autorisation : titre `{client} demande l'accès à Lun'Acedia` ; liste « lire l'état, les coûts
    et les événements », « lire et ranger les mails », « gérer l'agenda, les tâches et les
    rappels », « mettre en pause et reprendre le service » ; ligne `Retour vers {hôte}:{port}` ;
    boutons « Autoriser » et « Refuser » ; pied « Accès retirable à tout moment dans Réglages,
    Appareils et applications. »
  - Navigateur inconnu (Pair avec autorisation en attente) : « Lun'Acedia ne connaît pas ce
    navigateur. Saisir le code donné par `npm run pair-code` sur la machine qui héberge
    Lun'Acedia. »
  - Réglages : titre « Appareils et applications », sous-titre « Ce qui a accès à Lun'Acedia. »,
    « Ce navigateur » pour la ligne courante, « Retirer » (confirmation pour la ligne courante),
    « Relier un appareil » (affiche le code et son heure d'expiration).
- [ ] **Step 4:** Tests, lint, `npm run typecheck` (vues et app), format, `npm run build -w app` :
  vert. Captures de la page d'autorisation, de l'étape « navigateur inconnu » et des Réglages
  (données fictives) jointes à la PR.
- [ ] **Step 5:** Commit `feat(app): authorization page and devices and apps settings`.

### Task 5: Acedia, clé Anthropic (serveur)

**Files:**
- Create: `server/src/keys/anthropic-key.ts`, `server/src/keys/expiry.ts`.
- Modify: `server/src/triage/classifier.ts` (`KeyRefusedError`), `server/src/triage/anthropic.ts`
  (401 et 403 → `KeyRefusedError`), `server/src/triage/pipeline.ts`, `server/src/main.ts`,
  `server/src/app.ts`, `.env.example` (`ANTHROPIC_KEY_EXPIRES=`).
- Test: `server/src/keys/anthropic-key.test.ts`, `server/src/keys/expiry.test.ts`,
  `server/src/triage/pipeline.test.ts`.

**Interfaces:**
- Produces:
  - `KeyChecker = (apiKey: string) => Promise<'ok' | 'refused' | 'unreachable'>` (vrai : liste des
    modèles du SDK ; tests : faux).
  - `currentAnthropicKey(db, secretKey, envKey?): { key: string; source: 'saved' | 'env' } | undefined`.
  - `saveAnthropicKey(db, secretKey, key, expires?: string): void` (réglages chiffrés
    `anthropic.key`, `anthropic.expires`, remise à zéro de `anthropic.expiryWarned`).
  - `keyRefused(db, now)` / `keyWorks(db, now)` : passage d'état persistant (`anthropic.keyState`),
    raison de dégradation `anthropic-key` (même convention que `credit`), un seul `key.invalid` par
    passage (titre « Clé Anthropic refusée : le tri par l'IA est en pause, les règles continuent »),
    `key.restored` au retour (« Clé Anthropic de nouveau en service »).
  - `checkExpiry(db, now, expires: string | undefined, label: string)` : émet J-14 / J-3 selon les
    règles du spec §3.5 (`anthropic.expiryWarned: number[]`).
  - `GET /api/anthropic-key` → `{ state: 'ok' | 'refused' | 'credit' | 'absent', last4?: string, expires?: string, source?: 'saved' | 'env' }` ;
    `PUT /api/anthropic-key { key, expires? }` → vérifie (`refused` → 400 « Clé refusée par
    Anthropic, rien n'a changé », `unreachable` → 502 « Anthropic injoignable, rien n'a changé »,
    `ACEDIA_SECRET_KEY` absente → 400), enregistre, appelle `keyWorks`, renvoie le même corps que
    `GET`.
  - Le classifieur est obtenu à chaque passage de tri (`classifierFor(db)` ou équivalent) : une clé
    enregistrée sert dès le mail suivant, sans redémarrage.

- [ ] **Step 1: Tests qui échouent** : `a refused key pauses AI triage, rules go on, one key.invalid` ;
  `restart with the key still refused emits nothing new` (Review Focus 4) ; `a working call clears
  the state and emits key.restored` ; `credit exhausted stays distinct from a refused key` ;
  `PUT verifies, saves encrypted, never returns the key, the next mail uses it` ; `a refused or
  unreachable check changes nothing` ; `expiry: J-14 then J-3 once each, only J-3 when set 2 days
  ahead, reset by a new date, nothing re-emitted after restart` ; `GET never contains the key`.
- [ ] **Step 2:** Lancer les tests : échecs attendus.
- [ ] **Step 3:** Implémenter ; `main.ts` lance `checkExpiry` au démarrage puis toutes les heures.
- [ ] **Step 4:** Suite, lint, typecheck, format : vert.
- [ ] **Step 5:** Commit `feat(server): detect a refused Anthropic key, warn before expiry, replace it live`.

### Task 6: Acedia, section « Clé Anthropic » (front)

**Files:**
- Create: `views/src/lib/settings/AnthropicKey.svelte`.
- Modify: `views/src/lib/client.ts` (`getAnthropicKey`, `saveAnthropicKey`),
  `views/src/lib/settings/Settings.svelte`.
- Test: `views/src/lib/settings/AnthropicKey.test.ts`.

**Interfaces:**
- Consumes: `GET`/`PUT /api/anthropic-key` (Task 5).

- [ ] **Step 1: Tests qui échouent** : `shows state, last 4 and expiry, never a full key` ;
  `saves a key and shows the new state` ; `shows the refusal message and keeps the old state` ;
  `the key field is cleared after saving and is of type password`.
- [ ] **Step 2:** Lancer : échecs attendus.
- [ ] **Step 3:** Implémenter (DA, voix neutre). Libellés : « Clé Anthropic », états « En service »,
  « Refusée », « Crédit épuisé », « Absente : seules les règles trient » ; « Se termine par … » ;
  « Échéance déclarée : … » ; champs « Nouvelle clé », « Échéance (facultatif) » ; bouton
  « Vérifier et enregistrer ».
- [ ] **Step 4:** Tests, lint, typecheck, format, build : vert ; capture jointe à la PR.
- [ ] **Step 5:** Commit `feat(views): Anthropic key settings`.

### Task 7: Core, `npm run connect` par autorisation

**Files:**
- Create: `core/src/satellites/authorize.ts`.
- Modify: `core/src/satellites/store.ts` (`pairSatellite` accepte le corps d'échange),
  `core/src/cli/connect.ts`, `core/src/testing/fake-satellite.ts` (autorisation et
  `code_verifier`), `README.md`.
- Test: `core/src/satellites/authorize.test.ts`.

**Interfaces:**
- Consumes: contrat (Task 1).
- Produces: `authorizeSatellite(deps: PairDeps & { openBrowser: (url: string) => void; log: (line: string) => void; timeoutMs?: number }, url: string): Promise<SatelliteIdentity>` ;
  `pairSatellite(deps, url, exchange: { code: string } | { code: string; code_verifier: string; client: string })`
  (l'appel avec une chaîne seule reste accepté pour le chemin à 6 chiffres).

- [ ] **Step 1: Tests qui échouent** : `opens the authorize URL with client "Lun'Anima", a loopback
  redirect, state and S256 challenge` ; `pairs on the redirect with the verifier` ; `a wrong state
  is rejected and nothing is paired` ; `access_denied ends with "Liaison refusée dans Lun'Acedia."`
  (nom du satellite tel que renvoyé, sinon l'URL) ; `a reused code ends with a readable error`
  (Review Focus 2) ; `after the timeout: readable message, listener closed` (Review Focus 3,
  `timeoutMs` court en test) ; `connect -- <url> <code> keeps working`.
- [ ] **Step 2:** Lancer : échecs attendus.
- [ ] **Step 3:** Implémenter : écouteur `node:http` sur `127.0.0.1`, port 0 ; `state` et
  `code_verifier` de 32 octets base64url ; page de retour minimale dans le monde Anima (« Liaison
  terminée, cet onglet peut être fermé. » ou le message d'erreur) ; `openBrowser` réel via
  `start ""` / `open` / `xdg-open` selon la plateforme, l'URL toujours affichée aussi. Délai par
  défaut 5 min, sortie code 1 et message `Pas de réponse de la page d'autorisation après 5 min.`
- [ ] **Step 4:** `npm run format:check && npm run lint && npm run typecheck && npm test` : vert.
- [ ] **Step 5:** Commit `feat(core): connect a satellite through its authorization page`.

### Task 8: Core, alertes de clé et `npm run set-key`

**Files:**
- Create: `core/src/events/core-events.ts`, `core/src/keys/openai-key.ts`, `core/src/keys/expiry.ts`,
  `core/src/cli/set-key.ts`.
- Modify: `core/src/chat/service.ts` (transition `auth` ↔ succès), `core/src/main.ts`,
  `package.json` (script `set-key`), `.env.example` (`OPENAI_KEY_EXPIRES=`), `README.md`.
- Test: `core/src/events/core-events.test.ts`, `core/src/keys/*.test.ts`, `core/src/chat/service.test.ts`.

**Interfaces:**
- Consumes: `REFUSED`, `ProviderError` kind `auth` (palier 1).
- Produces:
  - `emitCoreEvent(db, event: { type: string; importance: Importance; title: string; data?: unknown }, now: Date): void`
    (`satellite_id = 'core'`, `remote_id` = compteur local en réglage `core.eventSeq`) ; visible dans
    `GET /api/events` avec `satellite: "core"`.
  - Transitions persistantes (`openai.keyState`) : `key.invalid` une fois (« Clé OpenAI refusée :
    Natsume ne peut plus répondre »), `key.restored` au premier succès (« Clé OpenAI de nouveau en
    service »).
  - `checkExpiry` avec les mêmes règles qu'Acedia (`openai.expiryWarned`), au démarrage puis toutes
    les heures.
  - `npm run set-key` : saisie masquée de la clé, échéance facultative `AAAA-MM-JJ`, vérification
    gratuite (liste des modèles), stockage chiffré `openai.key` avec `ANIMA_SECRET_KEY`, et
    `openai.keyVersion` incrémenté. Le serveur relit `openai.keyVersion` toutes les **15 s** et
    remplace le fournisseur du `ChatService` (`setProvider`) sans redémarrage. Une clé en base
    l'emporte sur `OPENAI_API_KEY`.

- [ ] **Step 1: Tests qui échouent** : `core events appear in /api/events with satellite "core"` ;
  `a refused key emits key.invalid once, even across a restart` (Review Focus 4) ; `the next
  successful reply emits key.restored` ; `expiry J-14 / J-3 rules` ; `a saved key replaces the
  provider without restart` ; `set-key refuses a key the check rejects and changes nothing`.
- [ ] **Step 2:** Lancer : échecs attendus.
- [ ] **Step 3:** Implémenter.
- [ ] **Step 4:** Format, lint, typecheck, tests : vert.
- [ ] **Step 5:** Commit `feat(core): key alerts, expiry warnings and set-key`.

### Task 9: Core, page d'accueil

**Files:**
- Create: `core/src/home.ts` (HTML), `core/src/home.test.ts`.
- Modify: `core/src/app.ts` (`GET /` public, polices servies sous `/fonts/`), `core/package.json`
  (`@fontsource/inter`, `@fontsource/cormorant-garamond`).

**Interfaces:**
- Produces: `GET /` → `text/html` ; `GET /fonts/<fichier>.woff2` → fichiers des paquets
  `@fontsource` (latin, graisses Inter 300 à 500, Cormorant Garamond 400 et 500).

- [ ] **Step 1: Tests qui échouent** : `GET / answers 200 html without a token` ; `shows the
  version from package.json` ; `exposes no satellite, thread, cost or key information` (aucune
  requête en base pendant le rendu ; aucun id de satellite enregistré dans le HTML) ; `loads no
  external resource` (aucune URL `http(s)://` hors texte d'aide `localhost`).
- [ ] **Step 2:** Lancer : échecs attendus.
- [ ] **Step 3:** Implémenter dans le monde Anima, voix neutre : titre « Lun'Anima », sous-titre
  « Core de Lun'Anima, API sans interface pour l'instant. », état « En ligne · version X »,
  rubriques « Relier un satellite » (`npm run connect -- <adresse du satellite>`) et « Discuter
  avec Natsume » (`npm run chat`).
- [ ] **Step 4:** Format, lint, typecheck, tests : vert ; capture jointe à la PR.
- [ ] **Step 5:** Commit `feat(core): public home page`.

### Task 10: Preuve du palier avec CrOliX

**Files:**
- Modify: les deux PR (preuves, critères cochés, captures), `docs/decisions/` du core si une
  décision le mérite.

- [ ] **Step 1:** Avec CrOliX, sur sa machine, vraies clés et compte Google de test :
  `npm run pair-code` (Acedia) relie le navigateur ; `npm run connect -- http://localhost:8787`
  (core) passe par la page d'autorisation ; « Refuser » une fois puis « Autoriser » ; vérifier
  `GET /api/satellites` ; Réglages, « Retirer » Lun'Anima → le core montre « à réappairer », puis
  relier à nouveau.
- [ ] **Step 2:** Clé Anthropic : coller une fausse clé (refusée, rien ne change) ; mettre une
  fausse clé dans le `.env` sans clé enregistrée → `key.invalid` relayé par le core ; coller la
  vraie dans les Réglages → `key.restored`, tri repris sans redémarrage. Échéance déclarée à J+10
  → `key.expiring` J-14 visible dans le core.
- [ ] **Step 3:** Core : `npm run set-key` avec une fausse clé (refusée) puis la vraie ; Natsume
  répond sans redémarrage. `GET /` dans le navigateur.
- [ ] **Step 4:** Relecture DA des trois écrans avec CrOliX ; captures dans les PR ; critères du
  spec §6 cochés ; PR passées « prêtes ».
