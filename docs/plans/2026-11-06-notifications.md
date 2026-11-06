# Les notifications : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** loin du bureau, un P0 ou un P1 atteint le téléphone ; au bureau, la voix annonce, rappels compris.

**Architecture:** une file dans le core lit `events` et les cartes en attente, décide selon la présence, et pousse par Web
Push vers les appareils abonnés. Les rappels entrent dans la file de l'app comme des urgences. Le service worker affiche.

**Tech Stack:** TypeScript, Hono, `node:sqlite`, Svelte 5, Vitest, `web-push` 4 (MPL-2.0, confirmé sur npm), `vite-plugin-pwa`.

**Spec:** [`docs/specs/2026-11-06-notifications-design.md`](../specs/2026-11-06-notifications-design.md)

## Global Constraints

- Aucun appel au modèle pour décider d'une notification.
- Une seule dépendance ajoutée : `web-push`, dans le workspace `core`.
- Aucun push au desktop : l'interrupteur n'existe que sous 768 px (`phone.current`).
- Heure de nuit par défaut : 23 h à 7 h, Europe/Paris. Fenêtre de regroupement P1 : 2 minutes. Expiration : P0 1 h, P1 24 h.
- Poste injoignable : au-delà de 15 minutes de `down_since`.
- Sujet VAPID : `https://github.com/Lun-Ecosystem`, jamais une adresse mail.
- Services de push acceptés, en `https` seulement : `fcm.googleapis.com`, `*.push.services.mozilla.com`, `*.push.apple.com`,
  `*.notify.windows.com`.
- Pas d'em dash dans ce qui s'affiche ; commits en anglais, Conventional Commits, la doc dans le même commit.
- Une branche et une PR par dépôt : `lun-acedia` (tâche 1), `lun-anima` (tâches 2 à 7).

## Review Focus

- Un core relancé alors qu'un envoi vient de partir : rien ne repart (tâche 3).
- Une présence qui meurt sans « stopped » pendant l'attente d'un P1 : au-delà de 90 s, plus de présence, le P1 part (tâche 3).
- Le premier abonnement sur une base qui a déjà des milliers d'événements : aucune rafale (tâche 3).
- `ANIMA_SECRET_KEY` absente : l'app reste utilisable, l'activation dit pourquoi elle échoue (tâche 2).
- Un rappel de rendez-vous dont l'heure passe alors que l'app reste ouverte : il quitte l'écran sans geste (tâche 5).

---

### Task 1: Le nom du rendez-vous sur le rappel (`lun-acedia`)

**Files:** Modify `server/src/agenda/reminders.ts` ; Test `server/src/agenda/reminders.test.ts`

**Interfaces:** Produces `agenda.reminder` avec `data.subject: string`, le titre du rendez-vous ou de la tâche, sans le délai.

- [ ] **Step 1: Test** `it('carries the bare name of what is coming')` : un rappel émis a `data.subject === 'Dentiste'`, et son
      `title` reste `Dentiste dans 1 h`.
- [ ] **Step 2: Le voir échouer**, `npm test -w server -- reminders`.
- [ ] **Step 3: Implémenter** dans `runReminders` : `data.subject = r.title`.
- [ ] **Step 4: Barrières vertes**, commit `feat(agenda): name what a reminder is about`, PR sur `lun-acedia`.

### Task 2: La chaîne Web Push (`lun-anima`, core)

**Files:** Modify `core/src/db.ts`, `core/src/app.ts`, `core/src/main.ts`, `core/src/auth/pairing.ts`, `core/src/testing/harness.ts` ;
Create `core/src/push/store.ts`, `core/src/push/send.ts`, `core/src/push/routes.ts` ; Test `core/src/push/*.test.ts`

**Interfaces:**

- Produces, migration :
  `push_subscriptions (endpoint TEXT PRIMARY KEY, client_id INTEGER NOT NULL, p256dh TEXT NOT NULL, auth TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `push_queue (key TEXT PRIMARY KEY, at TEXT NOT NULL, urgent INTEGER NOT NULL, type TEXT NOT NULL, title TEXT NOT NULL, link TEXT NOT NULL, ended_at TEXT, outcome TEXT)`.
- Produces `knownPushService(endpoint: string): boolean`, `vapidKeys(db, secretKey): { publicKey, privateKey }` (créées une fois,
  privée chiffrée par `encrypt`, dans `settings`), `subscriptions(db)`, `addSubscription(db, clientId, sub, now)`, `removeSubscription(db, endpoint)`.
- Produces
  `type PushPayload = { title: string; body?: string; link: string; tag: string; silent: boolean }`,
  `type Pusher = (sub: Subscription, payload: PushPayload, ttlSeconds: number) => Promise<'ok' | 'gone' | 'retry'>`,
  `webPusher(db, secretKey): Pusher`, où 404 et 410 valent `gone`. `AppDeps.pusher?: Pusher`.
- Produces les routes, sous le jeton : `GET /push/key` → `{ publicKey }` ; `PUT /push/subscription` `{ endpoint, keys: { p256dh, auth } }` ;
  `DELETE /push/subscription` `{ endpoint }` ; `POST /push/test` ; `GET` et `PATCH /push/settings` `{ night: { on, from, to } }`.

- [ ] **Step 1: Tests** :
      `it('refuses an address outside the known push services')`, avec `http://fcm.googleapis.com/x`, `https://evil.test/x`,
      `https://fcm.googleapis.com.evil.test/x` en 400 ;
      `it('revoking a device removes its subscription')` ;
      `it('keeps one key pair across calls, the private one encrypted')` ;
      `it('without a secret key, says so and the rest of the app still answers')`, 503 sur `/push/key`, 200 sur `/clients` ;
      `it('sends a test to the device that asks')`, avec un `Pusher` factice ;
      `it('forgets a subscription a service says is gone')`.
- [ ] **Step 2: Les voir échouer**, `npm test -w core -- push`.
- [ ] **Step 3: Implémenter**, `npm i web-push -w core`. Valider le corps avec zod.
- [ ] **Step 4: Tests verts.**
- [ ] **Step 5: Commit** `feat(push): subscribe a device and send it a notification`.

### Task 3: La file

**Files:** Create `core/src/push/queue.ts` ; Modify `core/src/main.ts` ; Test `core/src/push/queue.test.ts`

**Interfaces:**

- Consumes `Pusher`, `presenceNow(db, now)`, `cardRead(db, post)`, `isHidden`, `postSettings(db, post).liveUrgent`.
- Produces `class PushQueue { constructor(deps: { db; clock; pusher: Pusher; log; live? }); tick(): Promise<void>; start(ms = 15_000): void; stop(): void }`.
- Produces le curseur `push.cursor` dans `settings`.

Décisions que le constructeur ne peut pas deviner :

- **Sans abonnement, `tick` ne fait rien.** Quand le nombre d'abonnements passe de 0 à 1, `addSubscription` met le curseur au dernier
  événement, et inscrit les cartes en attente avec `outcome = 'seed'` : rien d'ancien ne sort.
- **Lecture** : `events` où `id > cursor` et `importance` vaut `urgent` ou `normal`. Cartes : `INSERT OR IGNORE`, clé `card:<poste>:<id>`, type `card.waiting`.
- **Abandon, à chaque tour, avec `outcome = 'dropped'`** : expirée ; événement dans `event_seen` ; carte plus en attente ; urgence d'un poste à
  `liveUrgent` faux ; présence active non occupée ; P1 pendant une présence occupée.
- **Envoi** : P0 tout de suite, `tag` `event:<id>`. P1 par `type`, quand la plus ancienne a 2 minutes, `tag` égal au type.
- **Un envoi est réussi dès qu'un appareil répond `ok`** : `outcome = 'sent'`. Tous en `retry` : l'entrée reste, jusqu'à l'expiration. `gone` retire l'abonnement.
- **Nuit** : `silent: true` pour un P0 dans la plage. Un P1 est toujours `silent: true`.
- **Lien** : `/app/?carte=<poste>:<id>` pour une carte, `/app/` sinon. L'urgence est en tête de la file.

- [ ] **Step 1: Tests**, avec un `Pusher` factice et une horloge :
      `it('sends a P0 at once')` ; `it('groups P1 of a type after two minutes, with their count')` ;
      `it('stays silent while the voice can speak')` ; `it('sends a P0 and no P1 while busy')` ;
      `it('sends a P1 once the presence has died without a stop')`, battement à t, envoi à t + 91 s, P1 créé après la mort ;
      `it('does not send again after a restart')`, nouvelle instance sur la même base ;
      `it('does not flood on the first subscription')`, 50 événements avant, zéro envoi ;
      `it('drops what expired')`, 1 h et 24 h ; `it('drops what was seen or decided before sending')` ;
      `it('keeps a P0 silent at night, and across midnight')` ; `it('retries until expiry, then gives up')`.
- [ ] **Step 2: Les voir échouer.**
- [ ] **Step 3: Implémenter**, et brancher dans `main.ts`, avec `stop()` à l'arrêt.
- [ ] **Step 4: Tests verts.**
- [ ] **Step 5: Commit** `feat(push): queue what deserves a notification`.

### Task 4: Les rappels à voix haute

**Files:** Modify `core/src/natsume/announce.ts`, `core/src/natsume/announce.test.ts`

**Interfaces:** Produces `reminderLine(title: string): string`, `Rappel : <title>.`

- [ ] **Step 1: Test** : remplacer `agenda.reminder is not announced` par `it('says a reminder, without calling it urgent')`, et ajouter
      `it('leaves a reminder in the thread while busy')`.
- [ ] **Step 2: Le voir échouer.**
- [ ] **Step 3: Implémenter** : retirer le `return`, choisir la phrase selon le type.
- [ ] **Step 4: Commit** `feat(natsume): say the reminders aloud`.

### Task 5: Les rappels dans la file

**Files:** Modify `core/src/reads/queue.ts`, `core/src/reads/queue.test.ts`, `core/src/push/queue.ts`, `ui/src/file/textes.ts` ; Test `ui/src/file/*.test.ts`

**Interfaces:**

- Produces dans `urgentOf` : les rappels sont inclus, `title` vaut `data.subject` s'il existe, et le titre de l'événement sinon.
- Produces dans `QueueUrgent` : `reminder?: true`.
- Consumes `data.due`, `data.id`, `data.kind` de la tâche 1.

Règles : rendez-vous dont `due` est passé, retiré ; plusieurs rappels d'un même `data.id`, seul le plus récent reste ; tâche, jusqu'à la fin de
la journée de Natsume. Le temps restant se calcule à l'affichage. `PushQueue.tick` publie `{ type: 'queue' }` quand un `due` vient de passer, pour
qu'un écran ouvert retire le rappel sans geste.

- [ ] **Step 1: Tests** : `it('lists a reminder with its bare name and due time')` ; `it('removes a meeting reminder once it has started')` ;
      `it('shows only the latest reminder of a meeting')` ; `it('keeps a task reminder until the day ends')` ;
      `it('tells open screens when a reminder falls due')` ; côté écran, `it('shows the time left')`.
- [ ] **Step 2: Vérifier les doublons** : `ritual.test.ts` et `upcoming.test.ts` reçoivent `it('does not repeat a reminder already in the queue')`.
      Un rappel déjà émis a un `at` passé et ne devrait plus entrer dans `upcoming` ; si le rituel le répète, le retirer de ses lignes.
- [ ] **Step 3: Implémenter, tests verts.**
- [ ] **Step 4: Commit** `feat(queue): keep the reminders in the queue until they fall due`.

### Task 6: Les sources à créer

**Files:** Modify `core/src/routines/engine.ts`, `core/src/routines/morning.ts`, `core/src/pause/pause.ts`, `core/src/push/queue.ts`, et leurs tests.

**Interfaces:** Consumes `emitCoreEvent`, `importance: 'normal'` pour les cinq.

| Événement | Où | Une seule fois |
|---|---|---|
| `routine.failed` | fin d'une exécution en échec, et les interrompues au démarrage de l'engine | une par exécution |
| `morning.posted` | fin de `runMorning` en `ok` | une par jour : `settings`, `push.morning` |
| `cap.reached` | `PauseKeeper.apply`, au passage vers `plafond-jour` ou `plafond-mois` | déjà au changement d'état |
| `cap.warned` | quand `warnAt80` est actif et que la dépense du jour passe 80 % | une par jour |
| `post.unreachable` | `PushQueue.tick` : `down_since` dépasse 15 minutes | une par `down_since` : `settings`, `push.down.<poste>` |

`warnAt80` s'enregistre aujourd'hui sans que rien ne s'en serve : c'est ce chantier qui lui donne son effet.

- [ ] **Step 1: Tests**, un par ligne, plus `it('does not warn twice the same day')` et `it('warns again after the post came back and went down')`.
- [ ] **Step 2: Implémenter, tests verts.**
- [ ] **Step 3: Commit** `feat(events): tell when a routine, a post or a cap needs him`.

### Task 7: Le service worker et l'écran

**Files:** Create `ui/public/push-sw.js`, `ui/src/atelier/push.ts` ; Modify `ui/vite.config.ts`, `ui/src/atelier/Notifications.svelte`, `ui/src/atelier/Depenses.svelte`,
`ui/src/atelier/Appareils.svelte`, `ui/src/main.ts`, `ui/src/atelier/Atelier.test.ts`, `core/src/auth/routes.ts`

**Interfaces:**

- Consumes les routes de la tâche 2, `phone.current`, le kit (`SettingsCard`, `SettingsRow`).
- Produces `/clients` avec `pushes: boolean`.
- Produces `workbox.importScripts: ['push-sw.js']`.

`push-sw.js` : `push` affiche sauf P1 avec une fenêtre au premier plan ; `notificationclick` focalise ou ouvre sur `link`. À l'ouverture de l'app, `main.ts` ferme
les notifications de `getNotifications()`.

- [ ] **Step 1: Tests** : `it('offers the switch on a phone')` ; `it('tells the desktop it goes through voice and counters')`, sans mention d'une appli absente ;
      `it('says how to restore a refused permission')` ; `it('sends a test')` ; `it('marks the devices that receive')` ; le test « Notifications non activées. » suit l'état réel.
- [ ] **Step 2: Implémenter, tests verts**, build vérifié : `ui/dist/sw.js` contient `importScripts`.
- [ ] **Step 3: Essai dans Chrome**, sur un core jetable, `localhost`, fenêtre étroite : recette 1 à 16 de la spec.
- [ ] **Step 4: Commit** `feat(app): turn notifications on from the phone`, doc de `lun-anima` à jour, PR.

**Reste après la PR :** recette 17 et 18, sur le vrai téléphone en HTTPS, dès que le core lui est joignable.
