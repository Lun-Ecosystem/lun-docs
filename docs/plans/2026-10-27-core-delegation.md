# Core : délégation aux postes et cartes relayées

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Natsume confie seule une demande au bon poste (Pina pour Acedia) par un outil du modèle, et
CrOliX valide les cartes du poste depuis le core : « marque le resto » dit à Natsume donne une carte
de Pina, validée depuis le core.

**Architecture:** Dans lun-anima. Le fournisseur OpenAI du core apprend l'appel d'outil. Un seul outil,
`deleguer { poste, demande }`, est offert à Natsume quand un poste à agent est relié. Le parcours se
fait **en un temps** : Natsume répond par l'appel d'outil, le core appelle `POST /lun/v1/agent` du
poste, et la réponse affichée est le résumé du poste plus ses cartes, sans seconde passe du modèle
pour reformuler. Les cartes restent chez le satellite : le core les liste et transmet le geste.
Une lecture simple passe aussi par le poste, dont le résumé répond : appeler une action du catalogue
demanderait une seconde passe du modèle pour la mettre en phrase [choix Claude].

**Tech Stack:** Node, Hono, node:sqlite, SDK `openai`, zod ; Vitest. Monorepo à workspaces npm.

**Spec:** `docs/specs/2026-10-27-liaison-core-satellites-design.md` (§2, §4, §11, chantier 3) ;
contrat `standards/contrat-satellite.md` (v1.1).

## Global Constraints

- Natsume décide seule d'appeler l'outil. **Elle ne demande jamais de confirmation en conversation**
  avant une action : la bretelle est la carte du poste, validée par CrOliX (règle de CrOliX, 27/10).
- Pas de seconde passe du modèle pour reformuler une réponse de poste : un message de CrOliX coûte au
  plus un appel du modèle de Natsume, plus le travail du poste.
- Le core ne prend aucune décision métier d'un poste et ne réécrit pas ses textes : il affiche
  `summary`, `title` et `lines` tels quels.
- Chantier : issue lun-anima, branche `feat/core-delegation` depuis `main` à jour, une PR.
  `git config core.hooksPath hooks` posé.
- Barrières : `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`.
- Commits Conventional Commits en anglais. Aucun secret ; adresses `example.org` dans les tests.
- Le bilan du jour, les routines, le rendu des notifications et le cerveau sont hors de ce chantier.

## Review Focus

- Une délégation pendant la pause d'Acedia, Acedia injoignable, ou un poste sans agent (`404`) :
  une réponse claire de Natsume (« rien n'a été fait »), aucune erreur interne, le fil continue.
- Le modèle appelle l'outil deux fois dans une réponse : une seule délégation part.
- Des arguments d'outil illisibles (JSON coupé, poste inconnu, demande vide ou de plus de
  4 000 caractères) : aucune délégation, un message d'erreur clair.
- Une carte d'hier validée depuis le core : le `409` « Carte expirée » du poste arrive tel quel à
  CrOliX, rien ne s'exécute.
- Le plafond du jour atteint : ni appel du modèle ni délégation.

Chaque ligne a son test dans la tâche qui possède le code (tâches 1, 3 et 4).

---

### Task 1: Le fournisseur sait appeler un outil

**Files:**
- Modify: `core/src/chat/provider.ts`, `core/src/chat/openai.ts`, `core/src/testing/fake-openai.ts`
- Test: `core/src/chat/openai.test.ts`

**Interfaces:**
- Produces :
  ```ts
  interface ToolSpec { name: string; description: string; parameters: Record<string, unknown> } // JSON Schema
  // ChatRequest gagne : tools?: ToolSpec[]
  // ChatChunk gagne : { type: 'tool'; name: string; arguments: string }  // arguments = JSON brut du modèle
  ```
  Un `tool` est émis une fois par appel complet, après la fin du flux et avant `done`. Plusieurs
  appels d'outil donnent plusieurs `tool`, dans l'ordre (la tâche 3 n'exécute que le premier).
- `FakeOpenAi` peut scripter une réponse avec des appels d'outil (texte facultatif + appels), streamée
  en morceaux comme le fait OpenAI (`delta.tool_calls[i].function.arguments` découpé).

- [ ] **Step 1:** Tests : avec `tools`, la requête envoyée porte `tools` au format OpenAI
  (`type: 'function'`) ; un appel d'outil streamé en trois morceaux donne un seul chunk `tool` avec
  les arguments recollés ; deux appels donnent deux chunks ; le texte éventuel reste en `delta` ;
  sans `tools`, la requête n'a pas de champ `tools`.
- [ ] **Step 2:** Lancer, voir échouer.
- [ ] **Step 3:** Implémenter (accumuler par `index`, émettre à la fin).
- [ ] **Step 4:** `npm test` : vert.
- [ ] **Step 5:** Commit `feat(chat): tool calls in the provider`.

### Task 2: Le client du contrat v1.1

**Files:**
- Modify: `core/src/satellites/client.ts`
- Test: `core/src/satellites/client.test.ts`, `core/src/testing/fake-satellite.ts`

**Interfaces:**
- Produces (types recopiés du contrat v1.1) :
  ```ts
  type Importance = 'urgent' | 'normal' | 'low' | 'info' | 'log';
  interface Health { ...; agent?: true }
  interface Card { id: string; action: string; effect: 'write' | 'delete'; title: string; lines: string[];
    status: 'pending' | 'done' | 'refused' | 'failed' | 'expired'; at: string; error?: string }
  interface AgentReply { summary: string; cards: Card[]; refs: Ref[]; cost: { currency: 'USD'; amount: number } }
  // SatelliteClient :
  agent(request: string): Promise<AgentReply>          // POST /agent { request }
  cards(status?: string): Promise<Response>            // GET /cards?status=…, relayée telle quelle
  decide(id: string, gesture: 'accept' | 'refuse', input?: unknown): Promise<Response> // relayée telle quelle
  ```
  `agent` lève les erreurs existantes (`SatelliteUnreachableError`, `SatelliteUnpairedError`,
  `SatelliteResponseError` avec le statut et le message d'erreur du poste).
- Le faux satellite sert `/agent`, `/cards`, `/cards/:id/accept|refuse` avec des réponses scriptables
  (dont `404`, `409` « Carte expirée », pause).

- [ ] **Step 1:** Tests : `agent` envoie `{ request }` avec le jeton et rend l'`AgentReply` ; un `404`
  ou un `409` lève `SatelliteResponseError` avec le statut et le message ; `decide` relaie le corps
  `{ input }` et rend la réponse brute ; un événement `low` ou `log` du flux est stocké tel quel.
- [ ] **Step 2:** Lancer, voir échouer.
- [ ] **Step 3:** Implémenter.
- [ ] **Step 4:** `npm test` : vert.
- [ ] **Step 5:** Commit `feat(satellites): contract v1.1 client (agent, cards)`.

### Task 3: Natsume délègue en un temps

**Files:**
- Create: `core/src/chat/posts.ts`
- Modify: `core/src/chat/service.ts`, `core/src/chat/prompt.ts`, `core/src/chat/store.ts`,
  `core/src/db.ts` (migration ajoutée en fin de liste), `core/src/main.ts`, `core/src/testing/harness.ts`
- Test: `core/src/chat/delegation.test.ts`

**Interfaces:**
- Consumes : `ToolSpec` et le chunk `tool` (tâche 1) ; `SatelliteClient.agent` (tâche 2).
- Produces :
  ```ts
  // posts.ts
  interface Post { id: string; role: string }               // ex. { id: 'lunacedia', role: 'mail, agenda et tâches Google (agente : Pina)' }
  interface Posts { offered(): Post[]; delegate(id: string, request: string): Promise<AgentReply> }
  function postsFrom(manager: SatelliteManager): Posts       // offre les postes connus et reliés (`connected`)
  const DELEGATE_TOOL = 'deleguer';                          // { poste: enum des ids offerts, demande: 1 à 4000 caractères }
  // store.ts : Message gagne cards?: RelayedCard[] ; interface RelayedCard { satellite: string; card: Card }
  // ServiceDeps gagne posts?: Posts
  ```
  Le rôle d'un poste vient d'une table du core (`shortcut:` : en dur tant qu'Acedia est le seul poste ;
  à lire du registre quand un deuxième arrive).

Comportement :
- Les outils ne sont offerts que si au moins un poste est relié.
- Au premier chunk `tool` valide, le core appelle `delegate`, une seule fois par réponse ; les appels
  suivants sont ignorés (journalisés).
- Le texte affiché : le texte de Natsume s'il y en a, puis `summary` du poste, émis aussi en `delta`
  pour les clients qui streament. Les cartes vont dans `message.cards` (colonne JSON) et dans `done`.
- Échec de délégation (pause, injoignable, `404`, `400`) : statut `ok`, texte « Je n'ai pas pu joindre
  <poste> : <raison>. Rien n'a été fait. ». Arguments illisibles : même forme, raison « demande
  illisible ». Le coût de Natsume est compté dans tous les cas ; celui du poste vient de ses `costs`.
- L'historique envoyé au modèle garde le texte stocké de la réponse (le résumé du poste), rien de plus.
- `SYSTEM_PROMPT` ajoute : pour toute action ou lecture sur le mail, l'agenda ou les tâches, appeler
  `deleguer` avec une demande complète et autonome ; ne jamais demander de confirmation, le poste
  prépare une carte que CrOliX valide ; ne pas inventer ce que le poste n'a pas dit.

- [ ] **Step 1:** Tests (FakeOpenAi + faux satellite) :
  - « marque le resto » : le modèle appelle `deleguer`, le poste rend un résumé et une carte, la réponse
    stockée a le résumé et `cards` ; le fournisseur n'est appelé **qu'une fois** ;
  - deux appels d'outil : une seule délégation ;
  - Acedia en pause, injoignable, ou `404` : réponse « Rien n'a été fait », statut `ok` ;
  - arguments illisibles, poste inconnu, demande vide : aucune délégation ;
  - plafond atteint : ni modèle ni délégation ;
  - aucun poste relié : la requête au modèle n'a pas de `tools` ;
  - le prompt système contient la règle « ne demande jamais de confirmation ».
- [ ] **Step 2:** Lancer, voir échouer.
- [ ] **Step 3:** Implémenter.
- [ ] **Step 4:** `npm test` : vert.
- [ ] **Step 5:** Commit `feat(chat): Natsume delegates to a post in one turn`.

### Task 4: Les cartes relayées par le core

**Files:**
- Modify: `core/src/satellites/routes.ts`, `core/src/cli/chat.ts`
- Test: `core/src/satellites/routes.test.ts`, `core/src/cli/chat.test.ts`

**Interfaces:**
- Consumes : `SatelliteClient.cards`, `decide` (tâche 2) ; `message.cards` (tâche 3).
- Produces (API du core, jeton client comme les autres routes `/api`) :
  - `GET /api/cards` → `{ cards: RelayedCard[], unreachable: string[] }` : les cartes en attente de
    chaque poste relié ; un poste injoignable est nommé, il ne fait pas échouer la liste ;
  - `POST /api/satellites/:id/cards/:card/accept` `{ input? }` et `.../refuse` : relayés tels quels
    (statut et corps du poste, dont `409` « Carte expirée »).

`npm run chat` : après une réponse qui porte des cartes, chaque carte s'affiche (titre, lignes) avec
`[v] valider · [r] refuser · [Entrée] plus tard` ; la commande `/cartes` liste les cartes en attente ;
le message d'erreur du poste s'affiche tel quel.

- [ ] **Step 1:** Tests : la liste rassemble les cartes de deux postes et nomme celui qui est
  injoignable ; un `accept` relaie `{ input }` et le `200` ; une carte d'hier rend `409`
  « Carte expirée » ; dans le CLI, `v` valide la carte affichée et `/cartes` les liste.
- [ ] **Step 2:** Lancer, voir échouer.
- [ ] **Step 3:** Implémenter.
- [ ] **Step 4:** `npm test` : vert.
- [ ] **Step 5:** Commit `feat(core): relayed cards in the API and the terminal chat`.

### Task 5: Doc et barrières

**Files:**
- Create: `docs/decisions/0002-delegation.md` (outil unique, un temps, pas de confirmation en conversation)
- Modify: `README.md` (routes `/api/cards`, outil de délégation), `CLAUDE.md` (« Ne possède pas » : plus
  de vues de satellite intégrées, contrat v1.1)

- [ ] **Step 1:** Écrire la décision et la doc.
- [ ] **Step 2:** Toutes les barrières : vertes.
- [ ] **Step 3:** Démo locale (Acedia avec un fournisseur de LLM configuré par CrOliX ; sinon la démo
  passe en recette avec lui) : core relié à Acedia, « marque le resto » dans `npm run chat`,
  la carte de Pina validée avec `v` ; sortie gardée pour la PR.
- [ ] **Step 4:** Commit `docs: delegation to posts`.
