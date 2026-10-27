<!-- Copie générée depuis standards/contrat-satellite.md : ne pas modifier ici -->
# Contrat satellite

> Ce que tout satellite expose pour être piloté par Lun'Anima sans que le core connaisse son métier.
> Décision : [ADR 0004](../adr/0004-delegation-aux-agents.md), qui remplace l'[ADR 0003](../adr/0003-contrat-satellite.md).
> Version du contrat : **v1.1**.

## Principe

Un satellite est **garant de sa logique métier** et opère seul. Le core est un manager, le satellite un
poste : Natsume lui délègue, lit son bilan du jour, écoute ses alertes et restitue. Le core ne refait
jamais le travail d'un satellite, ne décide jamais à sa place et ne recopie pas ses données. Deux
satellites ne se parlent jamais : tout croisement passe par le core.

## Routes

Toutes sous `/lun/v1`, en JSON, avec `Authorization: Bearer <jeton>`, sauf `pair` et `authorize`. Elles s'ajoutent à
l'API métier du satellite.

| Route | Rôle | Réponse |
|---|---|---|
| `GET /lun/v1/authorize?client&redirect_uri&state&code_challenge` | publique, mène à la page d'autorisation du satellite | page HTML, ou redirection vers `redirect_uri` |
| `POST /lun/v1/pair` `{ code }` ou `{ code, code_verifier, client }` | échange un code d'appairage (6 chiffres) ou un code d'autorisation contre un jeton | `{ token, satellite: { id, nom, version } }` |
| `GET /lun/v1/health` | santé et état | `{ status, reason?, version, paused?, agent? }` |
| `GET /lun/v1/costs?since=<ISO>` | dépense depuis une date | `{ currency: 'USD', since, until, total, items }` |
| `POST /lun/v1/pause` `{ reason? }` | coupe toute action automatique | `{ status }` |
| `POST /lun/v1/resume` | rétablit les actions automatiques | `{ status }` |
| `GET /lun/v1/events` | flux SSE des événements, reprise par `Last-Event-ID` | flux |
| `GET /lun/v1/actions` | actions disponibles | `{ actions }` |
| `POST /lun/v1/actions/:name` | invoque une action, corps validé par son schéma | `{ ok, result?, error? }` |
| `POST /lun/v1/agent` `{ request, context? }` | confie une demande à l'agent du satellite | `AgentReply` |
| `GET /lun/v1/cards?status=pending` | cartes du satellite (par défaut, en attente) | `{ cards: Card[] }` |
| `POST /lun/v1/cards/:id/accept` `{ input? }` | valide une carte, `input` remplace l'entrée (« Modifier ») | `{ card: Card }` |
| `POST /lun/v1/cards/:id/refuse` | refuse une carte | `{ card: Card }` |

## Types

```ts
type Status = 'ok' | 'paused' | 'degraded';
type Importance = 'urgent' | 'normal' | 'low' | 'info' | 'log'; // paliers P0 à P4 : standards/notifications.md

interface Health { status: Status; reason?: string; version: string; paused?: true; agent?: true } // paused : en pause alors que l'état affiché est degraded ; agent : sert agent et cards
interface CostItem { provider: string; model?: string; amount: number; calls: number }
interface Costs { currency: 'USD'; since: string; until: string; total: number; items: CostItem[] }
interface LunEvent { id: string; type: string; importance: Importance; at: string; title: string; data?: unknown }
interface Action { name: string; description: string; input: object /* JSON Schema */; effect: 'read' | 'write' | 'delete' }
interface ActionResult { ok: boolean; result?: unknown; error?: string }

interface AgentRequest { request: string; context?: Record<string, string> } // texte de CrOliX, contexte libre borné
interface AgentReply { summary: string; cards: Card[]; refs: Ref[]; cost: { currency: 'USD'; amount: number } }
interface Ref { type: string; id: string; title: string } // ce que la réponse cite : un mail, un événement…
type CardStatus = 'pending' | 'done' | 'refused' | 'failed' | 'expired';
interface Card { id: string; action: string; effect: 'write' | 'delete'; title: string; lines: string[]; status: CardStatus; at: string; error?: string } // lines : cible et nouvelles valeurs, rédigées pour un humain
interface DigestItem { type: string; title: string; at: string; ref?: Ref }
interface Digest { since: string; until: string; received: DigestItem[]; done: DigestItem[]; pending: number }
```

Les dates sont en ISO 8601 UTC, les montants en dollars avec deux décimales au moins. Ces types
restent écrits ici ; un paquet partagé ne sera créé que si deux projets en ont réellement besoin.

`effect` dit ce que fait une action : `read` ne change rien, `write` modifie, `delete` supprime. Ajout
compatible au contrat v1 : un client qui l’ignore continue de fonctionner. Un agent qui agit par ces
actions garde toujours la main de l’utilisateur sur les `delete`.

## Appairage

- Le code est **donné par le satellite**, par son front ou par sa commande `pair-code`, à usage unique,
  valable **10 minutes**. Il s'affiche groupé par trois (« 482 917 ») ; `pair` ignore les espaces, rien d'autre.
- Le jeton obtenu est propre à un client (le core, un appareil) et révocable depuis le satellite.
- **Appareil** : navigateur relié par un code à 6 chiffres. **Application** : client relié par
  autorisation, enregistré au nom de `client` (le core). Les deux sont listés et retirables côté
  satellite ; retirer est une révocation douce.
- Jamais de secret serveur saisi à la main, jamais de jeton dans un dépôt.
- **Verrou** : 5 échecs de `POST /lun/v1/pair` sur une fenêtre glissante de 10 minutes bloquent
  l'appairage. Le verrou est global, ne compte pas les refus volontaires, annule les codes d'appairage
  et d'autorisation en cours puis remet le compteur à zéro. Les codes demandés ensuite marchent
  normalement.

### Liaison par autorisation

Flux OAuth 2.0 « authorization code » avec PKCE (S256), simplifié : un satellite, un client à la fois.
Le code à 6 chiffres reste valable (appareils, repli sans navigateur pour le core).

1. Le client choisit `state` et `code_verifier` au hasard, puis ouvre
   `GET /lun/v1/authorize?client=<nom>&redirect_uri=<uri>&state=<state>&code_challenge=<S256>`.
2. Le satellite vérifie les paramètres, puis sert sa page d'autorisation : nom du client, hôte de
   `redirect_uri`, ce que le contrat permet.
3. **Autoriser** : le front, avec son jeton d'appareil, obtient du serveur un **code d'autorisation**
   (usage unique, **2 minutes**, lié à `client`, `redirect_uri` et `code_challenge`) et redirige vers
   `redirect_uri?code=<code>&state=<state>`. La route qui délivre le code exige un jeton d'appareil
   valide.
4. **Refuser** : redirection vers `redirect_uri?error=access_denied&state=<state>`.
5. Le client vérifie `state`, puis échange le code par `POST /lun/v1/pair`
   `{ code, code_verifier, client }`. Le satellite vérifie que `code_verifier` correspond à
   `code_challenge` et répond `{ token, satellite }`. Le jeton est enregistré comme application.

**Boucle locale seulement** : `redirect_uri` n'est accepté que si le schéma est `http:` et l'hôte
exactement `127.0.0.1` ou `localhost` (port libre). Tout autre `redirect_uri` est refusé sur la page,
avant toute action. Plusieurs autorisations peuvent être en attente, chacune avec son code.

## Comportements

- **Pause** : le satellite continue de servir ses lectures et ses événements ; seules les actions
  automatiques (tri, écritures, appels LLM non demandés) s'arrêtent. Une action invoquée à la main
  reste possible.
- **Importance** : fixée par le satellite selon [`notifications.md`](notifications.md) (paliers P0 à P4).
  Le core rend selon le mode ; le satellite ne connaît pas les modes. `low` et `log` inconnus d'un
  client valent `info`.
- **Délégation** (`agent`, `cards` : seulement si `health` porte `agent: true`) : l'agent applique ses
  règles. Écriture = carte ; suppression = toujours une carte, quel que soit le mode ; jamais d'envoi
  de message. Une lecture simple peut passer par une action du catalogue, sans agent.
- **Cartes** : elles vivent chez le satellite, qui garde la décision et le journal. Le core les
  affiche et transmet le geste ; une carte qui n'est plus en attente ne se valide ni ne se refuse.
- **Bilan du jour** : tout satellite à données sert l'action de lecture `day.digest` `{ since, until }` (ISO UTC) qui rend un `Digest`.
  Le core choisit la période ; le satellite ne connaît pas la journée de Natsume.
- **Alertes** : `urgent` est réservé aux alertes issues de règles déterministes, pour joindre CrOliX
  en direct. Le core ne retient du flux que `urgent` et les événements de contrôle (clé, état).
- **Coûts** : chaque appel payant (LLM, API) est compté par le satellite lui-même.
- **Crédit épuisé** : `health` passe en `degraded` avec la raison ; les lectures continuent.
- **Clé de service** : types d'événement recommandés pour un satellite qui dépend d'une clé d'API.
  Jamais la clé elle-même, au plus ses 4 derniers caractères. Pas de doublon après un redémarrage.

  | Type | Importance | Cas |
  |---|---|---|
  | `key.invalid` | `normal` | la clé est refusée par le fournisseur |
  | `key.restored` | `log` | la clé refusée refonctionne |
  | `key.expiring` | `normal` à J-3, `low` à J-14 | échéance proche, `data: { daysLeft: 14 \| 3, expires: 'AAAA-MM-JJ' }` |

## Erreurs

| Code | Cas |
|---|---|
| 400 | corps invalide (schéma de l'action, `since` illisible) |
| 401 | jeton absent, invalide ou révoqué ; code d'appairage expiré |
| 404 | action inconnue ; carte inconnue ; `/agent` ou `/cards` sur un satellite sans agent |
| 409 | `pause` alors que déjà en pause, `resume` alors que déjà actif ; carte qui n'est plus en attente |
| 503 | service `degraded` pour l'opération demandée |

Corps d'erreur : `{ error: string }`, message lisible par un humain.

## Fronts

Un satellite a un **front autonome complet**, aussi mode de secours, qui ne connaît que son serveur
(ni Natsume, ni un autre satellite). Les apps de Lun'Anima ont **leurs propres écrans**, passent par
le core et n'intègrent jamais ceux d'un satellite : se ressembler n'est pas un doublon.

## Versionnement

Une rupture (route retirée, champ renommé ou rendu obligatoire) crée `/lun/v2`. La v1 reste servie
jusqu'à ce que le core soit migré. Ajouter un champ optionnel ou une route (comme `authorize`) n'est pas une rupture.
La v1.1 ajoute `agent`, `cards`, `day.digest`, `Health.agent` et les importances `low`, `log` sans rupture.
