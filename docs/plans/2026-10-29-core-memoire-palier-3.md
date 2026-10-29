# Core, chantier 5, palier 3 : le contexte chaud, le point du matin et les relances

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chaque matin, Natsume repart propre, nourrie d'un contexte chaud d'environ 500 mots. À 7 h 30,
elle pose dans le fil principal un point de cinq éléments au plus, dont les relances des échéances
qu'Avaritia porte.

**Architecture:** Trois dépôts, une PR chacun.
- **lun-avaritia** : un fait reçoit une **échéance** facultative (`due`, jour ISO). L'agent la pose
  quand une note décrit une chose à faire à une date ; la carte la montre. Une lecture de contrat
  `brain.due` rend les faits actifs échus.
- **lun-docs** : le contrat passe en v1.2 (`brain.due`), et la spec d'Avaritia décrit la lecture.
- **lun-anima** : une routine `morning` à 7 h 30, qui passe après la veille si les deux sont dues. Elle
  classe le point du matin sans modèle, compose le contexte chaud (deux appels au modèle), le garde en
  base et poste le point. Le chat lit le dernier contexte chaud et ne garde que la journée en cours du
  fil principal, plus ses six derniers messages d'avant.

**Tech Stack:** Node, Hono, node:sqlite, zod 4, Vitest ; SDK `openai` (core) ; Svelte 5 (front
d'Avaritia).

**Spec:** lun-docs `docs/specs/2026-10-29-core-memoire-routines-design.md` (§3 palier 3, §5, §7, §8) ;
contrat `standards/contrat-satellite.md` ; spec d'Avaritia `docs/specs/2026-10-28-lun-avaritia-v1-design.md`
§4.

## Global Constraints

- **Échéance** : rien n'est deviné. Pas de date dite, pas d'échéance. Un jour ISO `YYYY-MM-DD`, compté
  depuis la date de la note. Visible sur la carte et validé avec le reste ; le core n'en garde aucune
  copie.
- **`brain.due {day}`** rend les faits **actifs** (non barrés, fiche non fusionnée) dont l'échéance
  tombe au plus tard ce jour : `{ factId, ficheId, fiche, text, due }`, triés par échéance.
- **Relance** : une échéance du jour ou passée est poussée chaque matin tant qu'elle est ouverte, et
  **sept jours au plus après sa date**. Au huitième jour, elle n'est plus poussée.
- **Clôture** : « c'est fait » part chez Avaritia comme tout « note ça ». Le brouillon remplace le fait
  daté (`replaces`), sans échéance. Aucune échéance ne se clôt sans carte validée.
- **Point du matin** : à **7 h 30, heure de Paris**, **cinq éléments au plus, tous postes confondus**,
  dans cet ordre :
  1. les alertes `urgent` de la journée écoulée ;
  2. les échéances ouvertes ;
  3. les contradictions et doublons d'Avaritia (`brain.contradiction`, `brain.doublon`) ;
  4. les autres cartes en attente, de la plus ancienne à la plus récente.

  Aucun appel au modèle pour classer. Le surplus reste dans le relais de cartes.
- **Contexte chaud** : composé par la routine du matin, avant le point. Environ 500 mots, tirés de trois
  sources : le portrait et les souvenirs récents, le point du matin, et les fiches liées aux sujets de
  la veille (`brain.search`). Gardé en base, lu à chaque échange **sans appel réseau**. Entre 5 h et
  7 h 30, celui de la veille reste en place.
- **Repartir propre** : le contexte du modèle devient le contexte chaud, puis les messages de la
  journée en cours, plus les **six derniers** de la journée d'avant. Rien n'est effacé.
- Une réponse ordinaire n'attend jamais le cerveau ni la composition du contexte.
- Coût de la composition : sous le plafond des routines (`NIGHT_DAILY_CAP_USD`), compté sur la
  journée en cours **[choix Claude]**.
- Ce qui vient des fiches, des souvenirs et des cartes est de la **donnée** dans le prompt, dans des
  blocs délimités, jamais une consigne. Le contexte chaud passe par `maskSecrets` avant d'être gardé.
- Branches depuis `main` à jour : `feat/echeances` (lun-avaritia), `feat/core-matin` (lun-anima). La PR
  de ce plan porte aussi le contrat v1.2.
- Barrières lun-anima : `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`.
  Barrières lun-avaritia : les mêmes, plus `npm run build`.

## Choix du plan **[choix Claude]**

- **Le point du matin est un texte composé par le code**, sans modèle, posté par Natsume dans le fil
  principal avec une nouvelle surface `routine`. La personnalité viendra au chantier 7.
  - Il n'est posté que s'il a au moins un élément.
  - Il n'est posté qu'avant midi : un core redémarré le soir (maintenance, mise à jour, coupure du NAS) compose le contexte chaud, mais ne dit pas
    « bonjour ».
- **Le contexte chaud se compose en deux appels.**
  1. Le premier donne trois recherches au plus : des noms de personnes, de projets ou d'organisations.
     Il part des souvenirs et des observations de la veille, lus dans `night_parts.tri`.
  2. Le second écrit le texte.

  La recherche d'Avaritia demande tous les mots d'une requête : une phrase entière ne trouverait rien.
  Si la composition échoue, le contexte précédent reste et le point part quand même.
- **« Repartir propre » vaut pour le fil principal seulement.** Un sujet repris après des jours garde
  ses 40 derniers messages : le couper à 5 h lui ferait perdre son objet.
- **Une routine attend celle qui la précède dans la liste du moteur.** Le core tourne en continu (NAS) ; après un redémarrage exceptionnel vers 9 h, le
  matin passe après la veille.
- **Un Avaritia qui ne connaît pas `brain.due` (404)** : pas d'échéance ce matin, l'incident est noté
  dans les logs, le point part.

## Review Focus

- **Un 404 de `brain.due` ou Avaritia éteinte** : le point part sans échéance, le contexte chaud se
  compose avec ce qu'il a (test en tâche 9).
- **Une échéance au huitième jour** n'est plus poussée ; au septième, elle l'est encore. Le compte se
  fait en jours calendaires de Paris, y compris autour du changement d'heure (test en tâche 7).
- **Une réponse du modèle avec une échéance invalide** (« jeudi », `2026-02-30`) est refusée et
  redemandée comme toute sortie invalide (test en tâche 2).
- **Le contexte du chat juste après 5 h** : les six derniers messages de la veille et le contexte chaud
  d'hier, aucun appel réseau (test en tâche 6).
- **Un core redémarré à 9 h** (maintenance, coupure du NAS) avec la veille et le matin dus : le matin attend la fin de la veille (test en
  tâche 5).

---

## Lun'Avaritia (`feat/echeances`)

### Task 1: L'échéance d'un fait, de la base à la carte

**Files:**
- Modify: `server/src/db.ts` (migration n° 7 : `ALTER TABLE facts ADD COLUMN due TEXT`),
  `server/src/types.ts` (`Fact.due?`), `server/src/brain/store.ts` (`addFact`), `server/src/brain/drafts.ts`
  (`DraftPayloadSchema`, `applyFiche`, `cardOf`, `draftView`), `server/src/brain/agent.ts` (`readAction`
  rend `due`)
- Test: `server/src/brain/drafts.test.ts`

**Interfaces:**
- Produces:
  - `addFact(db, ficheId, text, source, now, due?: string): number`.
  - Le fait d'un brouillon `fiche` accepte `due?: string`, un jour ISO valide.
  - Ligne de carte : `Échéance : <jour en toutes lettres>` sous le fait (via `parisDay` d'un jour ISO).

- [ ] **Step 1: Write the failing tests**
  - `a fiche draft with a due date writes it on the fact` : appliquer le brouillon ; `getFiche` rend le
    fait avec `due: '2026-11-05'`.
  - `the card shows the due date` : les lignes de `cardOf` contiennent
    `Échéance : jeudi 5 novembre 2026`.
  - `an impossible due date is refused` : `due: '2026-02-30'` → `InvalidInputError` à l'ajout.
- [ ] **Step 2: Run** `npx vitest run server/src/brain/drafts.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.** Valider avec `z.iso.date()` plus un contrôle d'aller-retour par `Date`
  pour refuser le 30 février.
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(brain): a fact may carry a due date`

### Task 2: L'agent pose l'échéance et clôt par un remplacement

**Files:**
- Modify: `server/src/brain/process.ts` (`AgentShape` : `due: z.string().nullable()` ; `agentSchema`
  valide le jour ; report vers le brouillon), `server/src/brain/prompt.ts` (`AGENT_SYSTEM`)
- Test: `server/src/brain/process.test.ts`

**Interfaces:**
- Consumes: tâche 1 (`due` du brouillon).
- Produces: deux règles dans `AGENT_SYSTEM`.
  - « Une observation qui décrit une chose à faire à une date reçoit `due`, le jour ISO de cette date,
    comptée depuis la date de l'observation ; sans date dite, `due` est null. »
  - « Une observation qui dit qu'une chose datée est faite remplace (`replaces`) le fait daté, et son
    fait n'a pas d'échéance. »

- [ ] **Step 1: Write the failing tests** (fournisseur factice, comme les tests existants de
  `process.test.ts`)
  - `a dated thing to do becomes a fact with its due date` : la réponse factice porte
    `due: '2026-11-05'` ; le brouillon a `facts[0].due === '2026-11-05'`.
  - `a due date that is not a day is asked again` : première réponse `due: 'jeudi'`, seconde valide ;
    deux appels, brouillon valide.
  - `the agent prompt carries the due and closing rules` : `AGENT_SYSTEM` contient « due » et
    « remplace ».
- [ ] **Step 2: Run** `npx vitest run server/src/brain/process.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(brain): the agent sets due dates and closes them by replacement`

### Task 3: La lecture `brain.due`

**Files:**
- Modify: `server/src/brain/agent.ts` (`DueSchema`, `dueAction`), `server/src/contract/catalog.ts`
  (`brain.due`, effet `read`)
- Test: `server/src/brain/agent.test.ts`

**Interfaces:**
- Produces:
  - `DueSchema = z.object({ day: <jour ISO> })`.
  - `dueAction({ day }, deps): { factId, ficheId, fiche, text, due }[]` : faits avec
    `struck_at IS NULL`, `due <= day`, fiche `merged_into IS NULL`, triés par `due` puis `id`.

- [ ] **Step 1: Write the failing tests** (par HTTP, `run(h, 'brain.due', …)`)
  - `brain.due gives the open facts due by that day` : trois faits, échus le 01/11, le 05/11 et le
    10/11 ; `day: '2026-11-05'` rend les deux premiers, dans l'ordre.
  - `a replaced fact is no longer due` : le fait du 01/11 remplacé par un brouillon validé n'est plus
    rendu.
  - `a bad day is a 400`.
- [ ] **Step 2: Run** `npx vitest run server/src/brain/agent.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(contract): brain.due, the open facts due by a day`

### Task 4: L'échéance dans le front

**Files:**
- Modify: `app/src/valider/drafts.ts` (`due?` sur le fait), `app/src/valider/DraftItem.svelte`,
  `app/src/memoire/FichePanel.svelte`
- Test: `app/src/screens/Valider.test.ts`

- [ ] **Step 1: Write the failing test** `shows the due date of a fact to validate` : un brouillon dont
  le fait a `due: '2026-11-05'` affiche « Échéance : jeudi 5 novembre 2026 ».
- [ ] **Step 2: Run** `npx vitest run app/src/screens/Valider.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.** Une ligne discrète sous le fait, avec les styles existants. `FichePanel`
  montre l'échéance d'un fait actif de la même façon.
- [ ] **Step 4: Run** `npm test && npm run typecheck && npm run build`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(app): show a fact's due date`

## lun-docs (cette PR)

### Task 0: Le contrat v1.2

**Files:** `standards/contrat-satellite.md`, `docs/specs/2026-10-28-lun-avaritia-v1-design.md` (§4)

- [ ] Version du contrat **v1.2**. Ajouter la ligne : « La v1.2 ajoute la lecture `brain.due` de
  Lun'Avaritia, sans rupture ».
- [ ] Spec d'Avaritia §4 : `brain.due {day}` → `{ factId, ficheId, fiche, text, due }[]`, et le champ
  `due` d'un fait.
- [ ] Commit `docs(contract): v1.2, brain.due`

## Lun'Anima (`feat/core-matin`)

### Task 5: Le moteur : une routine attend la précédente

**Files:**
- Modify: `core/src/routines/engine.ts`
- Test: `core/src/routines/engine.test.ts`

**Interfaces:**
- Produces: dans `tick`, une routine n'est pas lancée tant qu'une routine listée avant elle est en
  cours.

- [ ] **Step 1: Write the failing test** `a routine waits for the one listed before it` : deux
  routines dues, la première bloquée sur une promesse.
  - Après un tick, seule la première a démarré.
  - Une fois la première résolue, le tick suivant lance la seconde.
- [ ] **Step 2: Run** `npx vitest run core/src/routines/engine.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(core): a routine waits for the one before it`

### Task 6: Repartir propre avec le contexte chaud

**Files:**
- Modify:
  - `core/src/db.ts` (migration : `warm_contexts (id, day, text, created_at)`) ;
  - `core/src/chat/store.ts` :
    - `Surface` reçoit `'routine'` ;
    - `recentForContext(db, threadId, maxMessages, maxChars, beforeId, since?)` ;
  - `core/src/chat/service.ts` ;
  - `core/src/chat/prompt.ts` (`warmLine(text)`).
- Create: `core/src/memory/warm.ts` (`saveWarm(db, day, text, now)`, `latestWarm(db): string | undefined`)
- Test: `core/src/chat/service.test.ts`, `core/src/chat/store.test.ts`

**Interfaces:**
- Produces:
  - `recentForContext(…, since?: Date)` garde les messages à partir de `since`, plus les **six**
    d'avant, sous les mêmes limites (40 messages, 16 000 caractères).
  - Le chat passe `since = dayStart(natsumeDay(now))` pour le fil principal seulement.
  - Le message système se termine par `warmLine(latestWarm(db))` quand un contexte chaud existe :
    « Ce que tu as en tête ce matin : <bloc> ».

- [ ] **Step 1: Write the failing tests**
  - `the main thread starts afresh at 5:00, with the six last messages before` : dix messages hier,
    deux aujourd'hui → huit dans la requête au modèle.
  - `a topic keeps its forty last messages`.
  - `the last warm context is in the system turn, read from the base` : `saveWarm` puis un échange ; le
    système contient le texte ; aucun appel à un satellite.
- [ ] **Step 2: Run** `npx vitest run core/src/chat`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(core): start afresh each morning on the warm context`

### Task 7: Le point du matin, classé sans modèle

**Files:**
- Create: `core/src/routines/morning-point.ts`
- Test: `core/src/routines/morning-point.test.ts`

**Interfaces:**
- Produces:
  - `type PointItem = { kind: 'alerte' | 'echeance' | 'contradiction' | 'carte'; text: string; at: string }`.
  - `rankPoint({ alerts, dues, cards }, today: string): PointItem[]` :
    - ordre et plafond de cinq des Global Constraints ;
    - échéance gardée si `today - 7 jours <= due <= today` ;
    - contradiction ou doublon : `card.action` vaut `brain.contradiction` ou `brain.doublon`, venant de
      `lunavaritia` ;
    - cartes `pending` seulement, de la plus ancienne (`card.at`) à la plus récente.
  - `pointText(items, today): string` :
    - « Bonjour CrOliX. Ce matin : », puis une ligne par élément ;
    - une échéance s'écrit « <texte> (prévu le <jour en toutes lettres>) : c'est fait ? ».
  - `gatherPoint(deps, now): Promise<{ alerts, dues, cards }>` :
    - alertes `urgent` de `[dayStart(hier), dayStart(aujourd'hui))` ;
    - `brain.due` avec le jour de Paris ;
    - cartes de chaque poste (`client.cards('pending')`).

    Un poste injoignable ou un 404 donne une liste vide et une ligne de log.

- [ ] **Step 1: Write the failing tests**
  - `ranks alerts, then dues, then contradictions, then the oldest cards, five at most`.
  - `a due date is pushed seven days after it, not eight` (`today` = `due` + 7 → poussée ; + 8 →
    non).
  - `a due date in the future is not pushed`.
  - `the text asks whether a due thing is done`.
  - `gatherPoint survives an Avaritia without brain.due` (404 → `dues: []`, log).
- [ ] **Step 2: Run** `npx vitest run core/src/routines/morning-point.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(core): the morning point, ranked without the model`

### Task 8: La composition du contexte chaud

**Files:**
- Create: `core/src/memory/compose-warm.ts`
- Test: `core/src/memory/compose-warm.test.ts`

**Interfaces:**
- Consumes: `NightDeps` (palier 2), `latestWarm`/`saveWarm` (tâche 6), `PointItem` (tâche 7).
- Produces: `composeWarm(deps: NightDeps, day: string, point: PointItem[]): Promise<'written' | 'failed'>`.
  1. Le premier appel (schéma `{ recherches: string[] }`, trois au plus, 60 caractères au plus) part
     des souvenirs et des observations de la veille (`night_parts.tri` du jour d'avant).
  2. `brain.search` (`limit: 3`) pour chaque recherche.
  3. Le second appel (schéma `{ contexte: string }`, 4 000 caractères au plus) part de :
     - `block('portrait', …)` ;
     - `block('souvenirs', <7 derniers jours, 30 au plus>)` ;
     - `block('point', point)` ;
     - `block('fiches', résultats)`.
  4. Le résultat est masqué (`maskSecrets`), puis gardé par `saveWarm`.

  Coût `night` sur `dayStart(day)`, plafond vérifié avant chaque appel. Sans fournisseur, plafond
  atteint ou sortie invalide après une relance : `'failed'`, rien n'est écrit.

- [ ] **Step 1: Write the failing tests**
  - `composes from the portrait, memories, point and fiches` : les deux requêtes au modèle contiennent
    ce qu'il faut ; `brain.search` est appelé avec les recherches rendues ; `latestWarm` rend le
    texte.
  - `without Avaritia, composes from the rest`.
  - `over the cap, keeps the previous context`.
  - `masks a secret in the composed context`.
- [ ] **Step 2: Run** `npx vitest run core/src/memory/compose-warm.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(core): compose the warm context each morning`

### Task 9: La routine du matin

**Files:**
- Create: `core/src/routines/morning.ts`
- Modify:
  - `core/src/routines/routes.ts` (`POST /routines/morning`) ;
  - `core/src/app.ts` (`AppDeps.morning?`) ;
  - `core/src/main.ts` (routines `[night 5:00, morning 7:30]`) ;
  - `core/src/cli/night.ts` (`npm run morning` réutilise le même client, routine en argument) ;
  - `package.json`, `core/package.json`, `README.md`.
- Test: `core/src/routines/morning.test.ts`, `core/src/routines/routes.test.ts`

**Interfaces:**
- Produces: `runMorning(deps: NightDeps): Promise<MorningRecord>`, avec
  `MorningRecord { id, status, cost, items: number, posted: boolean, warm: 'written' | 'failed', reason? }`.
  1. `beginRun('morning')`.
  2. `gatherPoint`, puis `rankPoint`.
  3. `composeWarm`.
  4. Le message `pointText` est posté dans le fil principal (rôle `assistant`, surface `routine`)
     s'il y a au moins un élément et qu'il est moins de midi à Paris.
  5. `endRun`.

  Un échec de la composition n'empêche pas le point.

- [ ] **Step 1: Write the failing tests**
  - `posts the point in the main thread and keeps the warm context`.
  - `nothing to say, nothing posted`.
  - `after noon, composes but does not post`.
  - `Avaritia away: the point leaves without due dates, the run is ok`.
  - `POST /routines/morning runs it, 409 while one runs`.
- [ ] **Step 2: Run** `npx vitest run core/src/routines`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `npm test && npm run typecheck && npm run lint && npm run format:check`.
  Expected: PASS.
- [ ] **Step 5: Commit** `feat(core): the morning routine at 7:30`

### Task 10: La preuve sur les serveurs locaux

**Files:** `docs/README.md`, `docs/decisions/0003-matin.md` (lun-anima)

Sur les trois serveurs locaux, branches des tâches 1 à 9, avec les vraies clés. Les scénarios qui
demandent une autre heure tournent sur une copie de la base, horloge avancée (méthode du palier 2).

- [ ] **Step 1** : « note que je dois rappeler Paul jeudi » dans le chat. La carte d'Avaritia montre
  l'échéance ; la valider.
- [ ] **Step 2** : `npm run morning`, horloge le jour de l'échéance à 7 h 30. Le fil principal a le
  point avec « … c'est fait ? » ; le contexte chaud est en base ; son coût est noté.
- [ ] **Step 3** : « oui c'est fait » dans le chat. La carte remplace le fait daté ; une fois validée,
  `brain.due` ne le rend plus.
- [ ] **Step 4** : un échange après 5 h. La requête au modèle porte le contexte chaud, la journée en
  cours et les six messages d'avant.
- [ ] **Step 5** : horloge à l'échéance + 8 jours. L'échéance n'est plus poussée.
- [ ] **Step 6** : écrire la démarche et les coûts mesurés dans `docs/README.md`, et les choix du plan dans l'ADR `0003-matin.md` (spec §11). Commit
  `docs(core): prove the morning on a real day`.

---

Hors périmètre (spec §6) : écran et notification du point du matin (chantier 6), personnalité de
Natsume (chantier 7), préparation d'actions par les postes la nuit.
