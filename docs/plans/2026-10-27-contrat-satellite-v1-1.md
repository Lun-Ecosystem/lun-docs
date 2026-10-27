# Contrat satellite v1.1 : délégation, cartes, bilan du jour

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Réviser le contrat satellite pour le modèle manager / postes : délégation à l'agent d'un
satellite, cartes relayées, bilan du jour, alertes bornées, fin du paquet de vues.

**Architecture:** Chantier de documentation dans lun-docs. Le standard `standards/contrat-satellite.md`
fait foi ; sa copie du plugin est régénérée par `npm run sync`. Les ajouts sont des routes et des
champs optionnels : pas de rupture, le préfixe reste `/lun/v1` et le contrat passe en **v1.1**.

**Tech Stack:** Markdown ; contrôles Node du dépôt (`npm run check`, `npm run sync:check`, `npm test`).

**Spec:** `docs/specs/2026-10-27-liaison-core-satellites-design.md` (§3, §4, §8, §11, chantier 1).

## Global Constraints

- Dépôt public : aucune adresse interne, aucun secret, aucune adresse mail réelle.
- Le chantier part de `main` à jour une fois la PR de la spec mergée : branche `docs/contrat-satellite-v1-1`.
- Commits Conventional Commits en anglais ; PR en brouillon au gabarit, via `lun-livrer`.
- Un ADR fait 60 lignes au plus ; un ADR accepté ne change que par sa ligne `Statut : remplacée par NNNN`.
- La copie `plugin/skills/lun-ecosysteme/references/contrat-satellite.md` ne s'édite jamais à la main.
- Le registre n'ajoute un projet qu'à sa création : **pas d'entrée Lun'Avaritia dans ce chantier**.

## Review Focus

- Une écriture déléguée par le core qui contournerait la carte : le contrat doit dire qu'une
  délégation suit les mêmes règles que l'agent du satellite (suppression toujours une carte, jamais
  d'envoi de mail).
- Une carte acceptée deux fois (double clic côté core, deux surfaces) : le contrat doit fixer `409`.
- Un bilan demandé sur une période floue : le core donne `since` et `until` en ISO UTC, le satellite
  ne connaît pas la journée de Natsume.
- Une alerte `urgent` utilisée pour de l'information : `urgent` est réservé aux règles déterministes.
- Un satellite sans agent : le core doit pouvoir le savoir avant d'appeler `/agent`.

Chacune est fixée par un texte vérifié dans la tâche 1 (étape de relecture par `grep`).

---

### Task 1: Le contrat v1.1

**Files:**
- Modify: `standards/contrat-satellite.md` (en-tête, Routes, Types, Comportements, Erreurs, « Fronts et vues », Versionnement)
- Regenerate: `plugin/skills/lun-ecosysteme/references/contrat-satellite.md` (par `npm run sync`)

**Interfaces:**
- Produces : les routes et types ci-dessous, consommés par les chantiers 2 (Acedia) et 3 (core).

- [ ] **Step 1: En-tête et routes**

En-tête : « Version du contrat : **v1.1** » et un renvoi vers l'ADR 0004. Ajouter au tableau des routes :

| Route | Rôle | Réponse |
|---|---|---|
| `POST /lun/v1/agent` `{ request, context? }` | confie une demande à l'agent du satellite | `AgentReply` |
| `GET /lun/v1/cards?status=pending` | cartes du satellite (par défaut, en attente) | `{ cards: Card[] }` |
| `POST /lun/v1/cards/:id/accept` `{ input? }` | valide une carte, `input` remplace l'entrée (« Modifier ») | `{ card: Card }` |
| `POST /lun/v1/cards/:id/refuse` | refuse une carte | `{ card: Card }` |

Une phrase : ces routes ne sont servies que par un satellite dont `health` porte `agent: true`.

- [ ] **Step 2: Types**

Ajouter au bloc de types, sans toucher aux existants sauf `Health` :

```ts
interface Health { status: Status; reason?: string; version: string; paused?: true; agent?: true }
interface AgentRequest { request: string; context?: Record<string, string> } // texte de CrOliX, contexte libre borné
interface AgentReply { summary: string; cards: Card[]; refs: Ref[]; cost: { currency: 'USD'; amount: number } }
interface Ref { type: string; id: string; title: string } // ce que la réponse cite : un mail, un événement…
type CardStatus = 'pending' | 'done' | 'refused' | 'failed' | 'expired';
interface Card { id: string; action: string; effect: 'write' | 'delete'; title: string; lines: string[]; status: CardStatus; at: string; error?: string }
interface DigestItem { type: string; title: string; at: string; ref?: Ref }
interface Digest { since: string; until: string; received: DigestItem[]; done: DigestItem[]; pending: number }
```

`lines` : la cible et les nouvelles valeurs, déjà rédigées pour un humain (le core les affiche telles quelles).

- [ ] **Step 3: Comportements**

Ajouter quatre puces :
- **Délégation** : l'agent du satellite traite la demande avec ses propres règles. Une écriture
  devient une carte ; une suppression est toujours une carte, quel que soit le mode ; un agent
  n'envoie jamais de message. Une lecture simple peut passer par une action du catalogue, sans agent.
- **Cartes** : elles vivent chez le satellite, qui garde la décision et le journal. Le core les
  affiche et transmet le geste.
- **Bilan du jour** : un satellite à données expose l'action de lecture `day.digest`
  `{ since, until }` (ISO UTC) qui rend un `Digest`. Le core choisit la période ; le satellite ne
  connaît pas la journée de Natsume.
- **Alertes** : `urgent` est réservé aux alertes issues de règles déterministes du satellite, faites
  pour joindre CrOliX en direct. Le core ne retient du flux que `urgent` et les événements de
  contrôle (clé, état).

- [ ] **Step 4: Erreurs**

Ligne `404` complétée par « carte inconnue ; `/agent` ou `/cards` sur un satellite sans agent ».
Ligne `409` complétée par « carte qui n'est plus en attente ».

- [ ] **Step 5: Remplacer « Fronts et vues » par « Fronts »**

Section `## Fronts`, sans paquet de vues :
- Un satellite a un front autonome complet sur son métier ; c'est aussi le mode de secours.
- Les apps de Lun'Anima construisent leurs propres écrans et passent par le core ; elles n'intègrent
  jamais les écrans d'un satellite. Deux écrans qui se ressemblent ne sont pas un doublon.
- Un front autonome ne connaît que son serveur ; il ne contient aucune fonction de Natsume.

- [ ] **Step 6: Versionnement**

Ajouter : « v1.1 ajoute `agent`, `cards`, `day.digest` et `Health.agent` sans rupture. »

- [ ] **Step 7: Régénérer la copie et vérifier**

Run: `npm run sync && npm run sync:check && npm run check && npm test`
Expected: `sync: OK`, `check: OK`, tous les tests verts.

Run: `grep -c "toujours une carte\|409\|ISO UTC\|réservé aux alertes\|agent: true" standards/contrat-satellite.md`
Expected: 5 ou plus (les cinq points du Review Focus sont écrits).

Run: `grep -rn "paquet de vues\|-views" standards plugin/skills`
Expected: aucune ligne, sauf `standards/stack.md` (traité en tâche 2).

- [ ] **Step 8: Commit**

```bash
git add standards/contrat-satellite.md plugin/skills/lun-ecosysteme/references/contrat-satellite.md
git commit -m "docs(contract): delegation, relayed cards and day digest (v1.1)"
```

### Task 2: ADR 0004 et la pile

**Files:**
- Create: `adr/0004-delegation-aux-agents.md`
- Modify: `adr/0003-contrat-satellite.md` (ligne `Statut` seulement)
- Modify: `adr/README.md` (index)
- Modify: `standards/stack.md` (ligne « Vues partagées »)

**Interfaces:**
- Consumes : le contrat v1.1 de la tâche 1.

- [ ] **Step 1: Écrire l'ADR 0004 au gabarit `adr/_template.md`**

Titre « ADR 0004 : délégation aux agents des satellites, sans paquet de vues », `Statut : acceptée`,
date 2026-10-27. Contexte : spec du 2026-10-27. Décision : reprend ce que l'ADR 0003 garde (REST sous
`/lun/v1`, SSE avec `Last-Event-ID`, jeton d'appairage) et ajoute délégation, cartes relayées, bilan
du jour, alertes bornées, fin du paquet de vues. Alternatives écartées : vues intégrées dans les apps
du core (doublon d'interface, core en capsule) ; WebSocket pour la délégation (une requête suffit) ;
satellite qui pousse son bilan (connexion permanente inutile).

- [ ] **Step 2: Passer l'ADR 0003 à `Statut : remplacée par 0004`**

- [ ] **Step 3: Compléter l'index de `adr/README.md`**

Lignes 0002 (pile, acceptée), 0003 (contrat REST + SSE, remplacée par 0004), 0004 (acceptée).

- [ ] **Step 4: `standards/stack.md`**

Ligne « Vues partagées » remplacée par « Écrans | chaque produit a les siens ; les apps du core
n'intègrent pas les écrans d'un satellite (contrat satellite, « Fronts ») ». Ligne « Cerveau » :
préciser qu'il vit dans le satellite Lun'Avaritia.

- [ ] **Step 5: Vérifier**

Run: `npm run sync && npm run sync:check && npm run check`
Expected: `sync: OK`, `check: OK` (l'ADR fait 60 lignes au plus, son statut est valide).

- [ ] **Step 6: Commit**

```bash
git add adr standards/stack.md plugin
git commit -m "docs(adr): 0004 delegation to satellite agents replaces 0003"
```

### Task 3: Registre et renvoi depuis la spec d'écosystème

**Files:**
- Modify: `registry.yaml` (description de `lunacedia`)
- Modify: `docs/specs/2026-10-19-ecosysteme-design.md` (bandeau en tête seulement)

- [ ] **Step 1: Description d'Acedia**

`description: "Serveur de la journée : mail, agenda et tâches Google, triés à la source, avec son assistante Pina."`

- [ ] **Step 2: Bandeau de la spec d'écosystème**

Sous le titre : « > Révisée le 2026-10-27 par `2026-10-27-liaison-core-satellites-design.md` (§8) :
le paquet de vues, le cerveau dans le core et le majordome hors MVP ne tiennent plus. »

- [ ] **Step 3: Vérifier**

Run: `npm run check && npm test`
Expected: `check: OK`, tous les tests verts.

- [ ] **Step 4: Commit**

```bash
git add registry.yaml docs/specs/2026-10-19-ecosysteme-design.md
git commit -m "docs(registry): Acedia scoped to Google tools"
```
