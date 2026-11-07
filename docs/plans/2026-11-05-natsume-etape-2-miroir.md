# Natsume, étape 2 : le miroir. Plan d'implémentation

> **Livré** par [lun-anima#33](https://github.com/Lun-Ecosystem/lun-anima/pull/33). Cases cochées le 07/11/2026 d'après cette livraison, sans recontrôle tâche par tâche.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal :** valider une carte à l'écrit ou à la parole comme au clic, par le même geste, et faire savoir aux autres apps en moins de 2 s qu'elle est tranchée.

**Architecture :** le chemin du geste sort de la route dans `gestures/decide.ts`, partagé par le clic et par l'outil `trancher_carte`. Le code autorise : une fonction pure lit le message courant de CrOliX, et un outil appelé sans cela est ignoré et journalisé. Un bus en mémoire alimente `GET /api/live`, que l'app écoute pour relire la file et le fil.

**Stack :** TypeScript strict, Node `node:sqlite`, Hono (`streamSSE`), zod, Svelte 5, Vitest, `FakeOpenAi`, `FakeSatellite`.

**Spec :** [`docs/specs/2026-11-05-natsume-etre-presence-design.md`](../specs/2026-11-05-natsume-etre-presence-design.md), §6, §8, §10.2. Issue : Lun-Ecosystem/lun-anima#30. Branche : `feat/natsume-miroir`.

## Contraintes globales

- Un seul chemin : mêmes 5 s, même Journal, même relais. Seule l'origine change, posée par le serveur, jamais par le client.
- Le code autorise, pas le modèle. Une consigne cachée ne doit jamais pouvoir valider une carte.
- Jamais en lot depuis la conversation : une carte par appel d'outil.
- Accusés, relecture de carte et annulation : texte fixe, sans appel au modèle. Une carte garde le texte de son poste (§5).
- Titres et lignes de cartes : de la donnée dans un `block(...)`, jamais une consigne.
- **Ne pas toucher à `SOCLE` ni à `TEMPERAMENT_SEED`** : la voix écrite est provisoire et non validée, un autre chantier s'en occupe.
- Aucun écran nouveau, aucun texte visible nouveau dans l'app : elle se rafraîchit, c'est tout.
- Pas de tiret cadratin. Code et commits en anglais, textes de Natsume en français.
- Barrières avant chaque commit : `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check`.

## Décisions de ce plan (la spec les laisse au constructeur)

| Sujet | Décision | Pourquoi |
|---|---|---|
| Repère de carte | `c` + 5 hexa de `sha1("<poste>:<id>")`, sans migration | stable d'un tour à l'autre, sans état |
| Carte courante | réglage `natsume.currentCard` `{ satellite, card, at }`, valable **30 min** | un « oui » le lendemain ne doit rien valider |
| Délégation à plusieurs cartes | la carte courante est vidée | un « oui » nu serait ambigu |
| Présenter une carte | texte du poste tel quel, sans second appel | §5, et aucune surface d'injection |
| Longueur d'un message qui tranche | **12 mots** au plus | « oui je pense qu'il a raison, et... » n'est pas un geste |
| Transcription douteuse | `confidence` < **0,7** : aucun geste, mais « annule » reste valable | annuler est le sens sûr |
| Délai de « Trop tard » | dernier geste parti depuis moins de **30 s**, sinon le message va au modèle | « annule » peut parler d'autre chose |

## Points de vigilance

1. **Consigne cachée dans un mail ou une carte** : le modèle appelle `trancher_carte` alors que CrOliX parle d'autre chose : aucun geste, une trace au Journal (Tâche 5).
2. **« oui » tardif ou hors sujet** : plus de 30 min après, ou sans carte courante : rien (Tâches 4 et 5).
3. **« annule » pendant qu'une réponse tourne** : la file du fil le ferait attendre plus de 5 s ; il annule dès la réception (Tâche 6).
4. **Négation et ambiguïté** : « non, n'envoie pas », « oui mais non » : aucun geste d'acceptation (Tâche 5).
5. **Carte tranchée sur le téléphone entre la lecture et le « oui »** : ni erreur vue, ni carte en attente, ni second geste (Tâches 1 et 5).

---

### Tâche 1 : un seul chemin pour le geste, et l'origine

**Fichiers :**
- Créer : `core/src/gestures/decide.ts`, `core/src/gestures/decide.test.ts`
- Modifier : `core/src/gestures/routes.ts`, `core/src/gestures/store.ts`, `core/src/gestures/relay.ts`, `core/src/journal/store.ts`

**Interfaces :**
- Produit : `type GestureOrigin = 'bureau' | 'trancher' | 'fil' | 'voix'` (dans `store.ts`) ; `type CardRefusal = 'illisible' | 'gone' | 'readOnly' | 'question' | 'batch'` ; `holdCards(deps: Pick<AppDeps, 'db' | 'clock' | 'satellites' | 'reads' | 'gestures'>, items: CardItem[], origin?: GestureOrigin): { held: { id: number; dueAt: string } } | { refused: CardRefusal }`

- [x] **Étape 1 : écrire les tests qui échouent.** Dans `decide.test.ts` : `holdCards` sur une carte en attente rend `held` ; sur une carte déjà retenue rend `{ refused: 'gone' }`. Dans `relay.test.ts`, deux gestes identiques d'origine `undefined` et `'voix'` :

```ts
expect(steps(a)).toEqual(['Validée depuis la file.']);
expect(steps(b)).toEqual(['Validée à la voix.']);
```

Et `'fil'` donne `Validée depuis la conversation.`, résultat au poste identique.

- [x] **Étape 2 : lancer `npx vitest run core/src/gestures`.** Attendu : échec, module absent.
- [x] **Étape 3 : implémenter.** Déplacer dans `holdCards` le bloc « Cards » de `routes.ts:76-125` et le `hold` ; la route traduit chaque refus avec les statuts et messages actuels, et son schéma `From` ne change pas (un client ne peut pas se dire `voix`). Élargir `holdGesture`. `store.ts` gagne `gestureOrigin(db, id): GestureOrigin | undefined`. Dans `relay.ts:206`, `from` vaut `'fil'` ou `'voix'` selon l'origine, sinon `'file'`. Ajouter `voix: 'à la voix'` à `ORIGINS`.
- [x] **Étape 4 : lancer `npx vitest run core/src/gestures core/src/journal`.** Attendu : tout passe, dont `routes.test.ts` inchangé.
- [x] **Étape 5 : barrières, puis commit** `refactor(gestures): one path for a card gesture, with a signed origin`.

### Tâche 2 : le flux en direct

**Fichiers :**
- Créer : `core/src/live/bus.ts`, `core/src/live/routes.ts`, `core/src/live/routes.test.ts`
- Modifier : `core/src/app.ts`, `core/src/main.ts`, `core/src/testing/harness.ts`, `core/src/gestures/decide.ts`, `core/src/gestures/routes.ts`, `core/src/gestures/relay.ts`, `core/src/reads/loop.ts`, `core/src/chat/service.ts`

**Interfaces :**
- Produit : `type LiveEvent = { type: 'message'; threadId: string; id: number } | { type: 'card'; satellite: string; card: string; state: 'held' | 'cancelled' | ItemOutcome } | { type: 'queue' }` ; `class LiveBus { publish(e: LiveEvent): void; subscribe(l: (e: LiveEvent) => void): () => void }` (un abonné qui lève ne coupe pas les autres) ; `GET /api/live` (SSE, `event` = `type`, jeton exigé, commentaire `ping` toutes les 25 s) ; `AppDeps.live: LiveBus` ; dépendance optionnelle `live?: LiveBus` pour `GestureRelay`, `ReadLoop`, `ChatService`

- [x] **Étape 1 : écrire les tests qui échouent.** `routes.test.ts` : sans jeton, 401 ; un geste au clic envoie `card` état `held` **avant** la fin des 5 s, puis `ok` après le relais ; un `DELETE` envoie `cancelled` ; à l'abandon du client, le bus n'a plus d'abonné. Dans `loop.test.ts` : une relecture qui change les cartes publie `queue`, une relecture identique rien. Dans `service.test.ts` : `message` publié pour le message de CrOliX et pour la réponse finie.
- [x] **Étape 2 : lancer `npx vitest run core/src/live`.** Attendu : échec, module absent.
- [x] **Étape 3 : implémenter.** Reprendre le schéma de file et de réveil de `chat/routes.ts:72-114`. Dans `reads/loop.ts:253`, comparer `JSON.stringify` des cartes à `cardRead` avant `saveCardRead`. Construire le bus en tête de `main.ts` et du harnais.
- [x] **Étape 4 : lancer `npx vitest run core/src/live core/src/reads core/src/chat core/src/gestures`.** Attendu : tout passe.
- [x] **Étape 5 : barrières, puis commit** `feat(core): a live stream of messages, card gestures and queue changes`.

### Tâche 3 : l'app écoute

**Fichiers :**
- Créer : `ui/src/live.ts`, `ui/src/live.test.ts`
- Modifier : `ui/src/api.ts`, `ui/src/api.test.ts`, `ui/src/App.svelte`, `ui/src/natsume/fil.svelte.ts`, `ui/src/natsume/fil.test.ts`

**Interfaces :**
- Consomme : `GET /api/live` (Tâche 2), `FileStore.load()`, `Fil.open(id)`
- Produit : `Api.listen(path: string, onEvent: (e: StreamEvent) => void, signal: AbortSignal): Promise<void>` ; `startLive(api: Api, on: { queue(): void; message(threadId: string): void }, wait?: (ms: number) => Promise<void>): () => void` ; `Fil.refreshFrom(threadId: string): Promise<void>`

- [x] **Étape 1 : écrire les tests qui échouent.** `live.test.ts` : `card` et `queue` appellent `on.queue` ; `message` appelle `on.message` ; une coupure relance après 2 s et rappelle `on.queue` pour se resynchroniser ; le stop abandonne et ne relance plus ; un 401 ne relance pas. `fil.test.ts` : `refreshFrom` relit le fil courant, ne fait rien sur un autre fil ni pendant `asking`.
- [x] **Étape 2 : lancer `npx vitest run ui/src/live ui/src/natsume/fil`.** Attendu : échec.
- [x] **Étape 3 : implémenter.** `listen` partage la lecture de `stream` (`frames`), en `GET`. Dans `App.svelte`, à côté de `new FileStore` et `new Fil` (lignes 61-62), lancer `startLive` là où `etat.start()` est lancé, et l'arrêter au même endroit. Charger les skills Svelte du dépôt avant d'écrire le composant.
- [x] **Étape 4 : vérifier qu'une relecture pendant les 5 s ne ressuscite pas la carte** : un test `File.svelte.test.ts` trouve la ligne retirée après `load()` avec une file qui ne la contient plus, et le bouton Annuler reste présent. Lancer `npx vitest run ui`. Attendu : tout passe.
- [x] **Étape 5 : barrières, puis commit** `feat(ui): the app follows the core's live stream`.

### Tâche 4 : ce qu'elle perçoit, et la carte courante

**Fichiers :**
- Créer : `core/src/natsume/cards.ts`, `core/src/natsume/cards.test.ts`
- Modifier : `core/src/natsume/situation.ts`, `core/src/natsume/situation.test.ts`, `core/src/chat/prompt.ts`, `core/src/chat/service.ts`, `core/src/chat/service.test.ts`

**Interfaces :**
- Produit, dans `cards.ts` : `cardMark(post: string, cardId: string): string` ; `findCard(queue: Queue, mark: string): { item: QueueCard | QueuePile; card: Card } | undefined` ; `presentCard(db, ref: { satellite: string; card: string } | undefined, now: Date): void` ; `currentCard(db, now: Date): { satellite: string; card: string } | undefined` (`CURRENT_TTL_MS = 30 * 60_000`) ; `READ_CARD_TOOL: ToolSpec` (`lire_carte`, `{ carte: string }`) ; `cardText(card: Card, post: string): string` ; `readCardFor(deps, mark: string, now: Date): Promise<string>`
- Produit, dans `situation.ts` : `cardsRule`, `resultsRule`, `DayState.waitingCards[].id`, `DayState.results`

- [x] **Étape 1 : écrire les tests qui échouent.**

```ts
expect(cardMark('lunacedia', 'a1')).toMatch(/^c[0-9a-f]{5}$/);
// the same line whatever the origin: she speaks of it the same way
expect(resultsRule(stateAfter('bureau'))).toEqual(resultsRule(stateAfter('voix')));
expect(resultsRule(stateAfter('bureau'))).toContain('Devis imprimeur (lunacedia) : validée.');
```

Aussi : `cardsRule` liste 5 cartes au plus, avec repère et total, et rien de leurs lignes ; `resultsRule` couvre validée, refusée, annulée, en cours, déjà tranchée ailleurs, échec et sa raison, 5 lignes au plus, et rien d'une journée passée ; `currentCard` rend `undefined` après 30 min. `readCardFor` relit le poste avant de répondre, donne le texte tel quel, avec « Pour celle-ci, dis « envoie », ou valide-la sur la carte. » si `sends` ; sur une carte tranchée ou retenue, « Celle-là est déjà tranchée. » et ne touche pas à la carte courante. Dans `service.test.ts`, sur le fil principal : `lire_carte` ne provoque aucun second appel et la carte devient courante ; une délégation à une carte la rend courante, à deux la vide ; sur un sujet, l'outil n'est pas proposé.

- [x] **Étape 2 : lancer `npx vitest run core/src/natsume/cards core/src/natsume/situation`.** Attendu : échec.
- [x] **Étape 3 : implémenter.** `readCardFor` borne `reads.readNow` à `CARD_READ_TIMEOUT_MS = 3_000` puis lit `buildQueue` ; une carte en lecture seule le dit. Ajouter `cardsRule` après `urgentRule` et `resultsRule` juste après. `postRule` gagne, seulement quand les outils de carte sont offerts : lire une carte seulement s'il le demande, et trancher sans jamais demander de confirmation. `ChatService` reçoit `reads`, `satellites` et `gestures` en dépendances optionnelles ; `Acted` sans `turn` couvre `lire_carte`. Ne pas modifier `identity.ts`.
- [x] **Étape 4 : lancer `npx vitest run core/src/natsume core/src/chat`.** Attendu : tout passe.
- [x] **Étape 5 : barrières, puis commit** `feat(natsume): she sees waiting cards and gesture results, and reads a card as it stands`.

### Tâche 5 : trancher en conversation, le code autorise

**Fichiers :**
- Créer : `core/src/natsume/authorize.ts`, `core/src/natsume/authorize.test.ts`
- Modifier : `core/src/natsume/cards.ts`, `core/src/chat/service.ts`, `core/src/chat/routes.ts`, `core/src/chat/routes.test.ts`, `core/src/chat/delegation.test.ts`

**Interfaces :**
- Consomme : `holdCards` (Tâche 1), `findCard`, `currentCard`, `presentCard` (Tâche 4)
- Produit : `MIN_CONFIDENCE = 0.7` ; `MAX_GESTURE_WORDS = 12` ; `speaksGesture(a: { message: string; confidence?: number; gesture: 'accept' | 'refuse'; answer?: string; card: Pick<Card, 'title' | 'sends' | 'options'>; mark: string; isCurrent: boolean }): boolean` ; `DECIDE_CARD_TOOL: ToolSpec` (`trancher_carte`, `{ carte?: string; geste: 'accept' | 'refuse'; reponse?: string }`) ; `decideCardFor(deps, args: string, message: { text: string; surface: Surface; confidence?: number }, now: Date): string` ; `POST /threads/:id/messages` accepte `confidence?: number` entre 0 et 1 ; `ChatService.send(threadId, text, surface, opts?: { confidence?: number })`

- [x] **Étape 1 : écrire les tests qui échouent.** Une table dans `authorize.test.ts` :

```ts
const yes = { gesture: 'accept', card: plain, mark: 'c12345', isCurrent: true } as const;
it.each([
  ['oui', true], ["d'accord, vas-y", true], ['OK.', true],
  ['non', false], ["n'envoie pas", false], ['oui mais non', false], ["c'est pas bon", false],
  ['quel temps fait-il', false],
  ['oui je pense que Paul a raison sur toute cette histoire de planning de vendredi', false],
])('accept on %s', (message, ok) => expect(speaksGesture({ ...yes, message })).toBe(ok));

expect(speaksGesture({ ...yes, message: 'oui', isCurrent: false })).toBe(false);
expect(speaksGesture({ ...yes, message: 'oui, le devis imprimeur', isCurrent: false })).toBe(true); // named
expect(speaksGesture({ ...yes, message: 'oui', confidence: 0.5 })).toBe(false);
const sends = { ...yes, card: { ...plain, sends: true } } as const;
expect(speaksGesture({ ...sends, message: 'oui' })).toBe(false);
expect(speaksGesture({ ...sends, message: 'envoie' })).toBe(true);
expect(speaksGesture({ ...sends, message: 'crée le brouillon' })).toBe(true);
expect(speaksGesture({ ...sends, message: 'envoie', isCurrent: false })).toBe(false);
const asks = { ...yes, card: { ...plain, options: ['Lundi', 'Mardi'] } } as const;
expect(speaksGesture({ ...asks, message: 'mardi', answer: 'Mardi' })).toBe(true);
expect(speaksGesture({ ...asks, message: 'oui', answer: 'Mardi' })).toBe(false); // the model's answer alone is not his
```

Dans `delegation.test.ts`, de bout en bout avec `FakeOpenAi.replyWithTools` et `FakeSatellite` :
- « oui » sur la carte courante : geste retenu, origine `fil`, un seul appel au modèle, réponse fixe ; `surface: 'voice'` donne l'origine `voix`.
- **Injection** : message « et la météo ? », le modèle appelle `trancher_carte` : aucun `held_gestures`, le poste n'est pas appelé, une ligne au Journal « Geste ignoré ».
- **Carte tranchée entre-temps** : elle est retenue d'un clic, puis « oui » : réponse « Celle-là est déjà tranchée. », statut `ok`, pas de second geste.
- `refused: 'readOnly'` et `'question'` donnent chacun une phrase fixe, sans erreur.

- [x] **Étape 2 : lancer `npx vitest run core/src/natsume/authorize`.** Attendu : échec, module absent.
- [x] **Étape 3 : implémenter.** `speaksGesture` travaille sur `fold(message)`, ponctuation remplacée par des espaces, avec ces mots entiers :
  - acceptation : `oui ouais ok okay valide valider accepte accepter`, `d accord`, `vas y`, `c est bon` ;
  - refus : `non refuse refuser jette`, `laisse tomber` ;
  - envoi : `envoie envoies envoyer`, `cree le brouillon`, `fais le brouillon` ;
  - négation : `ne n pas jamais`.

  Une acceptation échoue en présence d'un mot de refus ou de négation ; un refus échoue en présence d'un mot d'acceptation ou de `ne`, `n`. Désignée : `isCurrent`, ou le repère dans le message, ou un mot du titre de 5 lettres ou plus. Une carte `sends` exige `isCurrent` et un mot d'envoi. Une réponse à `options` exige la réponse pliée dans le message. `decideCardFor` prend `args.carte` ou la carte courante, appelle `speaksGesture` puis `holdCards(..., surface === 'voice' ? 'voix' : 'fil')`, vide la carte courante si elle est tenue, et rend le texte fixe :
  - acceptation : « C'est noté. Tu as 5 secondes pour dire annule. »
  - refus : « Refusée. Tu as 5 secondes pour dire annule. »
  - ignoré : « Je n'ai rien tranché. Dis-moi clairement laquelle. », `sends` : « Pour celle-ci, dis « envoie », ou valide-la sur la carte. »

  Une trace `appendJournal` de type `carte`, meta `Geste ignoré` ; le texte du message n'y entre pas. Un seul appel d'outil par tour reste la règle existante.
- [x] **Étape 4 : lancer `npx vitest run core/src/natsume core/src/chat core/src/gestures`.** Attendu : tout passe.
- [x] **Étape 5 : barrières, puis commit** `feat(natsume): she can decide a card, and the code authorizes it`.

### Tâche 6 : « annule », sans passer par le modèle

**Fichiers :**
- Modifier : `core/src/chat/service.ts`, `core/src/chat/service.test.ts`, `core/src/gestures/store.ts`, `core/src/gestures/store.test.ts`

**Interfaces :**
- Produit : `latestHeld(db, now: Date): number | undefined` et `lastRelayedSince(db, since: Date): boolean` dans `store.ts` ; `ChatService.send` traite l'annulation avant la file

- [x] **Étape 1 : écrire les tests qui échouent.** Dans `service.test.ts`, chacun sans aucun appel au modèle ni coût :
  - « annule » pendant un geste retenu : `state = 'cancelled'`, timer désarmé, réponse fixe « Annulé. » ; le poste n'est jamais appelé ; le bus publie `cancelled`.
  - **Pendant qu'une réponse tourne** (`openai.hang`) : le geste est annulé **avant** `release()`, et « Annulé. » arrive après la réponse en cours.
  - Sous le plafond et sans clé : l'annulation marche quand même.
  - Avec `confidence: 0.3` : elle marche aussi.
  - Geste parti il y a moins de 30 s : « Trop tard, c'est parti. »
  - Aucun geste récent : le message va au modèle. « annule mon rendez-vous de jeudi » aussi.
- [x] **Étape 2 : lancer `npx vitest run core/src/chat/service`.** Attendu : échec.
- [x] **Étape 3 : implémenter.** Le message plié et sans ponctuation doit valoir `annule`, `annule ca`, `annule le` ou `annule la`. La décision se prend de façon synchrone dans `send`, via `cancelGesture` et `gestures.disarm`, à l'heure de réception ; le texte fixe passe à `#answer`, qui écrit la réponse sans `#generate` : `delta` puis `done`, statut `ok`, sans modèle ni coût.
- [x] **Étape 4 : lancer `npx vitest run core/src/chat core/src/gestures`.** Attendu : tout passe.
- [x] **Étape 5 : barrières, puis commit** `feat(natsume): saying cancel within 5 s cancels the gesture, with no model call`.

### Tâche 7 : la recette §10.2 et la documentation

**Fichiers :**
- Créer : `core/src/natsume/mirror.test.ts`
- Modifier : `README.md`, `CLAUDE.md`

- [x] **Étape 1 : écrire le test de recette**, de bout en bout sur le harnais, un `it` par critère du §10.2 :
  - la même carte, validée au clic et par « oui » : `steps` du Journal égaux à l'origine près, même appel au poste, `resultsRule` identique ;
  - un geste au clic : `card` état `held` publié aussitôt, puis `lire_carte` répond « déjà tranchée » ;
  - « annule » dans les 5 s : le poste n'est jamais appelé ;
  - un « oui » seul sur une carte `sends` : aucun geste ; une carte déjà tranchée : statut `ok`, pas d'`error`, rien en attente.
- [x] **Étape 2 : lancer `npx vitest run core/src/natsume/mirror`.** Attendu : tout passe ; corriger le code, pas le test, en cas d'écart.
- [x] **Étape 3 : documenter** `GET /api/live` et `confidence` dans le tableau des routes du `README.md`, et le flux dans la description de `core/src/natsume/` du `CLAUDE.md` (100 lignes au plus).
- [x] **Étape 4 : recette réelle sur base jetable**, par l'API, jamais `npm run chat` : un satellite factice, une carte, 2 onglets de l'app dans Chrome, valider au téléphone (largeur 390 px) et mesurer la disparition sur l'autre onglet (moins de 2 s). Noter le résultat dans le corps de la PR.
- [x] **Étape 5 : barrières, puis commit** `docs(natsume): stage 2 acceptance and the live route`.
