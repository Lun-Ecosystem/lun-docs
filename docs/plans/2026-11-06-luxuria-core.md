# Lun'Luxuria, la partie core. Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** donner au core ce dont un client vocal a besoin : savoir que CrOliX est là, composer l'accueil, publier ce qui se dit, être coupé, annoncer un P0.

**Architecture :** Luxuria reste un client sans logique. Le core marque ce qui se dit par un événement `speech` sur `GET /api/live`, une phrase masquée à la fois : réponses, rituel et P0 passent par ce seul chemin. La présence est un petit état en base, calculé à la lecture, sans minuteur. Une PR par tâche dans `lun-anima`, chaque tâche se livre seule.

**Stack :** TypeScript strict, `node:sqlite`, Hono `streamSSE`, zod, Vitest, `FakeOpenAi`, `FakeSatellite`, `makeHarness`.

**Spec :** [`docs/specs/2026-11-06-lun-luxuria-design.md`](../specs/2026-11-06-lun-luxuria-design.md) §8, §6.1 à §6.5, §9, et [`2026-11-05-natsume-etre-presence-design.md`](../specs/2026-11-05-natsume-etre-presence-design.md) §7.1, §10.3. Issue : Lun-Ecosystem/lun-docs#61.

Ce plan ne dépend pas de l'essai, sauf la tâche 7. Il suppose lun-anima#34 mergée.

## Contraintes globales

- `TEMPERAMENT_SEED` ne change pas. Le `SOCLE` est recadré par sa propre PR (lun-anima#35), à la validation de CrOliX.
- État au 06/11 : tâches 1 à 6 et 5b en PR (lun-anima#36 à #45, à merger dans l'ordre de la pile), tâche 7 en attente de l'essai et de son accord. Ajouts hors plan : parole spontanée bornée, retrait d'un fragment, identifiant de réponse dans le flux.
- Présence terminée à l'arrêt, ou sans battement pendant **90 s**. Pas de rituel complet si la relance arrive moins de **30 minutes** après la fin.
- Un événement ne réveille jamais le modèle. Le P0 est une phrase fixe, sans modèle.
- Le core ne reçoit que du texte et des signaux. « Occupé » ne porte jamais le nom d'une appli.
- Aucune notion de carte dans ce qu'un client vocal doit savoir : il parle de messages, jamais de gestes.
- Le code du geste reste la seule autorité : le modèle ne décide de rien, et le geste fixe sa phrase.
- Le core jetable des recettes a son `DB_PATH` à lui. Ne jamais toucher `data/anima.db`, `data/cli.token`, ni arrêter un core sur 8788 ou 8789.
- Barrières avant chaque PR : `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check`. Charger `lun-livrer`. Jamais de merge.
- Routes nouvelles décrites dans `README.md`, dans la PR qui les crée. Pas de tiret cadratin dans les textes.

## Points de vigilance

Chacun a son test dans la tâche indiquée.

1. **Un événement rejoué à la reconnexion d'un satellite** ne doit pas se redire : ni doublon, ni vieux P0 (tâche 6).
2. **Une coupure quand la réponse est déjà finie** : c'est le cas courant, le modèle va plus vite que l'audio. Le fil doit quand même ne garder que ce qui a été dit (tâche 4).
3. **Une coupure avant le premier mot** : un message vide ne doit jamais repartir au modèle (tâche 4).
4. **Un secret à cheval sur deux fragments du flux** doit rester masqué dans `speech` (tâche 3).
5. **Un core qui redémarre pendant une présence** ne doit ni rejouer le rituel ni croire CrOliX absent (tâche 5).

---

### Tâche 1 : « non annule », « annule tout »

**Fichiers :** modifier `core/src/chat/service.ts` (`CANCEL_WORDS`, `#cancelAsked`), `core/src/natsume/mirror.test.ts`.

**Interfaces :** rien de nouveau pour les autres tâches.

- [ ] **Test en échec**, dans `mirror.test.ts` :

```ts
it.each(['non annule', 'annule tout', 'non, annule !'])('« %s » within 5 s means the post is never called', async (said) => {
  const t = await setup();
  await yes(t);
  expect((await say(t, said)).text).toBe('Annulé.');
  t.h.advance(6_000);
  await t.h.gestures.relayDue();
  expect(t.fake.decisions).toEqual([]);
});

it('« annule tout » cancels every gesture still held', async () => { /* deux clics sur deux cartes, puis zéro appel au poste */ });
it('« n\'annule pas » goes to the model and cancels nothing', async () => { /* le geste part */ });
```

- [ ] Vérifier l'échec : `npx vitest run core/src/natsume/mirror.test.ts`.
- [ ] Ajouter `non annule`, `non annule ca`, `non annule la`, `non annule le`, `annule tout` à `CANCEL_WORDS`. Pour `annule tout` seul, boucler sur `latestHeld` jusqu'à vide. Les autres annulent le dernier geste, comme aujourd'hui.
- [ ] Tests verts, barrières, commit `fix(natsume): hear « non annule » and « annule tout »`, PR.

### Tâche 2 : une carte changée depuis sa lecture

**Fichiers :** modifier `core/src/natsume/cards.ts`, `core/src/natsume/authorize.ts`, `core/src/chat/service.ts` (`#present`, `Heard.current`), tests dans `mirror.test.ts`.

**Interfaces :** `cardDigest(card: Card): string` (sha256 de `title`, `lines`, `action`, `sends`, et des options de la carte) ; `Ref` gagne `digest?: string` ; `currentCardSince` le rend. Texte fixe `CHANGED = "Cette carte a changé depuis que je te l'ai lue : relis-la avant de trancher."`.

- [ ] **Test en échec :**

```ts
it('a card reworded after her reading is not held, and says so', async () => {
  const t = await setup(SENDS);
  t.openai.replyWithTools([READ]).replyWithTools([ACCEPT]);
  await say(t, 'montre-moi la carte');
  t.fake.setCards([{ ...SENDS, lines: ['De : ami@example.org', 'Libellé : autre chose'] }]);
  await t.h.reads.readNow('lunacedia');
  expect((await say(t, 'envoie')).text).toBe(CHANGED);
  expect(holds(t)).toEqual({ n: 0 });
});
it('the card read again after a change can be decided', async () => { /* relire, « envoie » : tenu */ });
it('a change that keeps its words does not refuse the gesture', async () => { /* seul `at` change */ });
it('the hint keeps the digest of the reading, so « envoie » after a change is refused', async () => { /* lire, changer, « oui », « envoie » */ });
```

- [ ] Vérifier l'échec.
- [ ] `readCardFor` et `#present` posent le `digest` ; l'indice de `decideCardFor` le conserve dans son `presentCard`. Dans `decideCardFor`, si `isCurrent` et que `cur.digest` existe et diffère de `cardDigest(card)`, répondre `CHANGED` via `ignore`, sans tenir. Une carte désignée par son repère sans lecture, ou un `current` antérieur sans `digest`, passe comme aujourd'hui.
- [ ] Limite à écrire dans un commentaire `shortcut:` : le core ne voit un changement qu'une fois lu chez le poste, sans toucher au contrat.
- [ ] Tests verts, barrières, commit `fix(natsume): refuse a gesture on a card changed since it was read`, PR.

### Tâche 3 : ce qui se dit, sur le flux en direct

**Fichiers :** créer `core/src/natsume/speech.ts` et son test ; modifier `core/src/live/bus.ts`, `core/src/chat/service.ts` (`send`), `core/src/chat/routes.ts` (`MessageBody`), `README.md`.

**Interfaces, produites pour les tâches 4 à 7 :**

```ts
// bus.ts, en plus des événements actuels
| { type: 'speech'; id: number; n: number; text: string; why: 'reply' | 'ritual' | 'p0' }
| { type: 'speech-end'; id: number; why: 'reply' | 'ritual' | 'p0' }

// speech.ts
export function speaker(publish: (e: LiveEvent) => void, id: number, why: SpeechWhy): {
  push(text: string): void;   // fragment du flux
  end(): void;                // publie le reste, puis speech-end
  stop(): void;               // plus rien ne sort, speech-end compris
};

// service.ts
send(threadId, text, surface, opts: { confidence?: number; speak?: boolean })
```

`POST /threads/:id/messages` accepte `speak` (booléen, facultatif). Un client vocal le passe à `true`, qu'il s'agisse d'une phrase dite ou écrite chez lui. La réponse SSE ne change pas, et `speech` n'est publié que sur `/api/live`.

**[choix Claude]** Le core découpe en phrases et masque lui-même par `maskSecrets` (`memory/secrets.ts`), plutôt que d'envoyer les fragments bruts. Un seul masquage, et sous-titres comme audio n'en disent pas plus que le fil.

- [ ] **Tests en échec :**

```ts
// speech.test.ts
it('publishes whole sentences in order, the rest at the end', ...);     // 'Il est tard. Tu ' + 'dors ?' => 2 speech, 1 speech-end
it('does not cut after a number or an abbreviation', ...);              // '3.5 €' et 'M. Mercier' restent entiers
it('masks a secret split across two fragments', ...);                   // la carte 4111… coupée en deux push : jamais en clair
it('stop() lets nothing out afterwards, speech-end included', ...);
// service.test.ts
it('a reply with speak publishes speech events; one without publishes none', ...);
it('a failed reply still ends its speech', ...);
it('a fixed sentence (Annulé.) with speak is spoken whole, without the model', ...);
// routes.test.ts
it('accepts speak and refuses a non-boolean', ...);
```

- [ ] Vérifier l'échec, puis écrire `speaker` : tampon, coupure sur `.`, `!`, `?`, `…` suivis d'un espace et d'une majuscule, d'un guillemet ou d'un tiret de dialogue.
- [ ] Dans `send`, si `speak`, abonner un `speaker(..., 'reply')` au `Reply` : `delta` vers `push`, `done` vers `end`.
- [ ] Vérifier que l'app ignore un type inconnu sur `/api/live` : `grep` du client dans `ui/src`, test si besoin.
- [ ] Tests verts, barrières, commit `feat(chat): publish what is said on the live stream`, PR.

### Tâche 4 : la coupure

**Fichiers :** modifier `core/src/chat/provider.ts`, `core/src/chat/openai.ts`, `core/src/chat/service.ts`, `core/src/chat/routes.ts`, `core/src/testing/fake-openai.ts` si besoin, `README.md`.

**Interfaces :**

- `ChatRequest` gagne `signal?: AbortSignal`, transmis à `client.chat.completions.create(body, { signal })`.
- `ChatService.cut(id: number, said: string): Message | undefined`.
- `POST /api/threads/:id/messages/:mid/cut`, corps `{ said: string }` (0 à 8 000 caractères) : 200 et le message, 404 si inconnu ou s'il n'est pas de Natsume. Idempotente.

**Règle de stockage :** seuls les messages `ok` repartent au modèle (`recentForContext`). `said` non vide donne donc `status: 'ok'`, `text: said`. `said` vide donne `status: 'partial'`, `text: ''`.

- [ ] **Tests en échec**, sur le flux suspendu de `FakeOpenAi` (`hang: 'first'`) :

```ts
it('cutting a reply under way stops the provider, stores what was said and bills what streamed', ...);
it('cutting a finished reply replaces its text: the next turn replays only what was said', ...);
it('a cut before the first word never goes back to the model', ...);
it('no tool runs after a cut, even one the model had already asked for', ...);  // poste non appelé
it('no second call runs after a cut', ...);                                     // #voice
it('a gesture held by the cut reply stays cancellable by « annule »', ...);
it('the next message in the queue runs right after a cut', ...);
it('speech stops at the cut', ...);
it('a cut on a CrOliX message or an unknown id is a 404', ...);
```

- [ ] Vérifier l'échec.
- [ ] `#running: Map<id, { abort: AbortController; speaker?; cutSaid?: string }>`. `cut` en cours : poser `cutSaid`, arrêter le `speaker`, `abort()`. Passer `signal` aux deux `provider.stream`. Dans `#generate`, tester `cutSaid` après la boucle et dans le `catch` : compter le coût par `#charge`, ne lancer aucun outil, stocker selon la règle ci-dessus. `noteTics` ne voit que `said`.
- [ ] `cut` sur un message déjà final : `#update` selon la même règle. `live.publish({ type: 'message', ... })` pour que le mobile suive.
- [ ] Tests verts, barrières, commit `feat(chat): let a client cut a reply and keep only what was said`, PR.

### Tâche 5 : la présence et « occupé »

**Fichiers :** créer `core/src/natsume/presence.ts`, `presence.test.ts`, `presence-routes.ts` ; modifier `core/src/app.ts`, `core/src/natsume/situation.ts` (une règle), `README.md`.

**Interfaces, produites pour les tâches 5b et 6 :**

```ts
export const BEAT_LIMIT_MS = 90_000;
export const QUICK_RETURN_MS = 30 * 60_000;
export interface Presence { startedAt: string; lastBeat: string; endedAt?: string; busy: boolean; clientId: number }

export function presenceStart(db, clientId: number, now: Date): { quick: boolean };
export function presenceBeat(db, busy: boolean, now: Date): void;
export function presenceEnd(db, now: Date): void;
export function presenceNow(db, now: Date): { present: boolean; busy: boolean };
```

État dans `settings` (`natsume.presence`), sans minuteur : `present` est `!endedAt && now - lastBeat < BEAT_LIMIT_MS`. Événements du core par `emitCoreEvent`, importance `log` : `presence.started`, `presence.ended`. Une présence morte sans arrêt se ferme au `presenceStart` suivant, datée de son `lastBeat`.

`POST /api/presence`, corps `{ state: 'started' | 'beat' | 'stopped', busy?: boolean }`, sur l'API à jeton d'appareil. Le signal « occupé » n'existe que là.

- [ ] **Tests en échec :**

```ts
it('present after a start, absent 90 s after the last beat', ...);
it('a stop ends it at once and records presence.ended', ...);
it('a beat after a stop does not bring it back', ...);
it('a dead presence closes at the next start, dated from its last beat', ...);
it('a start under 30 min after the end is quick, at 30 min it is not', ...);
it('a core restart during a presence: still present, no new ritual', ...);  // même base, nouvelle instance, battement
it('busy follows the beats', ...);
it('refuses an unknown state and an unpaired client', ...);
it('stays out of the Journal', ...);
```

- [ ] Vérifier l'échec, écrire le module et la route. La route de cette tâche renvoie seulement 204 ; le rituel vient en 5b.
- [ ] Règle `presenceRule` dans `SITUATION_RULES`, une ligne quand il est là : `CrOliX est sur son PC.` Avec `occupé` : `CrOliX est en vocal avec quelqu'un.` Test de `situation.test.ts` à côté des autres.
- [ ] Tests verts, barrières, commit `feat(natsume): know when CrOliX is at his desk`, PR.

### Tâche 5b : le rituel

**Fichiers :** créer `core/src/natsume/ritual.ts` et son test ; modifier `core/src/chat/service.ts`, `presence-routes.ts`.

**Interfaces :**

```ts
export const QUICK_LINE = 'Te revoilà.';
export function ritualTurn(deps, now: Date, clientId: number): string;

// ChatService
compose(lastTurn: string, why: SpeechWhy): { reply: ReplyHandle };  // fil principal, sans outil, un appel, en flux
say(text: string, surface: Surface, why: SpeechWhy | undefined): Message;  // sans modèle ; tâche 6 aussi
```

`compose` passe par la file du fil et réutilise `#voice`. Échec ou plafond : un message en erreur comme aujourd'hui, jamais de phrase inventée. `say` n'existe que sur le fil principal.

`ritualTurn` rend la consigne suivie d'un `block('rituel', données)`. **« Neuf »** veut dire postérieur au plus récent de : son dernier message, toute surface, et le `seen_at` de ses autres appareils, celui de Luxuria exclu. Le détail pour le neuf, une ligne de compte pour le reste. Sources : `buildQueue` (cartes, urgences) et `buildUpcoming` (soirée et lendemain). Le fil du jour et l'heure sont déjà dans le contexte. Une source qui échoue est omise.

Consigne, en un seul bloc : une phrase de bienvenue, comment il va, puis ce qui est neuf ; ne rien redire de ce qui n'est pas dans les données comme neuf ; rien à dire si rien de neuf.

**Météo : hors de ce plan tant que CrOliX n'a pas dit quelle ville et quelle source.** La spec prévoit qu'une source absente est omise sans bruit.

- [ ] **Tests en échec :**

```ts
it('a start composes one model call, in the main thread, spoken as ritual', ...);
it('a quick start says the short line without any model call', ...);
it('what his phone saw is not in the new part', ...);       // seen_at du mobile après la carte
it('what came after is in the new part', ...);
it('the desk client\'s own seen_at does not count', ...);
it('a failed source is left out, and the ritual still comes', ...);
it('at the cap, no ritual and no invented sentence', ...);
it('the ritual has no tool', ...);                           // openai.requests[0].body.tools absent
```

- [ ] Vérifier l'échec, écrire `ritualTurn`, `compose`, `say`, et les appeler depuis `POST /api/presence` à `started`. La route répond 204 sans attendre le modèle.
- [ ] **Recette réelle** sur core jetable, 4 passes : relever le texte, le coût, et ce qui a été redit. Résultats dans la PR, sans enjoliver.
- [ ] Tests verts, barrières, commit `feat(natsume): welcome him when he arrives`, PR.

### Tâche 6 : le P0 à voix haute

**Fichiers :** modifier `core/src/events/store.ts` (`storeEvent` rend `boolean`), `core/src/satellites/listener.ts` (`Signal`), `core/src/main.ts` ou le module qui câble ; créer `core/src/natsume/announce.ts` et son test.

**Interfaces :**

```ts
export const P0_FRESH_MS = 5 * 60_000;
export const p0Line = (title: string) => `Urgent : ${clip(title, 80)}.`;
export function announceP0(deps, e: { type: string; title: string; at: string }, now: Date): void;
```

`Signal` événement gagne `fresh?: { type: string; title: string; at: string }`, posé seulement si la ligne vient d'être insérée et que l'importance est `urgent`.

**[choix Claude]** P0 veut dire `importance: 'urgent'`, sauf `agenda.reminder`, comme la file d'attente (`reads/queue.ts`).

La phrase est stockée en `surface: 'routine'`, déjà rejouée au modèle comme donnée (`block('point', ...)`), car le titre vient d'un satellite. `why: 'p0'` laisse Luxuria appliquer son réglage.

- [ ] **Tests en échec :**

```ts
it('a P0 during a presence is said, without any model call, and is in the thread', ...);
it('busy: in the thread, not said', ...);
it('absent: nothing in the thread, the queue carries it as today', ...);
it('the same event received twice is announced once', ...);
it('an event older than 5 minutes is not announced', ...);
it('agenda.reminder is not announced', ...);
it('its title replays as data, never as her words', ...);    // block('point') dans le tour suivant
it('a failure to announce does not cost the stored event', ...);
```

- [ ] Vérifier l'échec, écrire, câbler dans `onSignal`, dans un `try`.
- [ ] Tests verts, barrières, commit `feat(natsume): say a P0 aloud during a presence`, PR.

### Tâche 7 : les 5 s partent à la fin de sa phrase

**À ne commencer qu'une fois le relevé lu et ce départ différé confirmé par CrOliX** (§7 et §8 de la spec). Si le relevé montre que la fenêtre tient sans, supprimer cette tâche.

**Fichiers :** modifier `core/src/gestures/store.ts`, `core/src/gestures/decide.ts`, `core/src/natsume/authorize.ts`, `core/src/chat/service.ts`, `core/src/chat/routes.ts`.

**Interfaces :**

- `SPOKEN_LIMIT_MS = 30_000` : si le client ne revient jamais, le geste part à cette échéance, après avoir été annulable tout ce temps.
- `holdCards(deps, items, origin, holdMs?)` ; `rescheduleHeld(db, id, dueAt): boolean`, seulement si l'état est `held`.
- `POST /api/threads/:id/messages/:mid/spoken`, 204. Le client parle d'un message qu'il a fini de dire, jamais d'un geste. La tâche 4 appelle le même chemin dans `cut`.

- [ ] **Tests en échec :**

```ts
it('with speak, a gesture waits for the sentence, then 5 s', ...);
it('without speak, 5 s from reception as today', ...);
it('« annule » during the sentence cancels it', ...);
it('no spoken signal: it goes at 30 s, not before', ...);
it('a cut counts as the end of the sentence', ...);
it('spoken on a message with no gesture does nothing', ...);
it('a core restart keeps the 30 s deadline', ...);
it('the Journal and the post call are the same as a click', ...);
```

- [ ] Vérifier l'échec. `Acted` gagne `heldId`, `#awaitingSpoken: Map<messageId, gestureId>`. `spoken` : `rescheduleHeld`, `gestures.arm`, nouvelle publication `{ type: 'card', state: 'held' }` pour le compteur de l'app.
- [ ] Tests verts, barrières, commit `feat(gestures): start the hold when she has finished saying it`, PR.

---

## Après ce plan

La recette §9 et §10.3 ne se joue qu'avec l'app Luxuria, dont le plan part du relevé. Ce plan se vérifie par ses tests et, pour le rituel, sur le vrai modèle.
