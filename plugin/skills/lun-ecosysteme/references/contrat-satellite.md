<!-- Copie générée depuis standards/contrat-satellite.md : ne pas modifier ici -->
# Contrat satellite

> Ce que tout satellite expose pour être piloté par Lun'Anima sans que le core connaisse son métier.
> Décision : [ADR 0003](../adr/0003-contrat-satellite.md). Version du contrat : **v1**.

## Principe

Un satellite est **garant de sa logique métier** : il opère seul, en autonome. Natsume s'y branche,
l'interroge, lui demande d'agir, écoute ses événements et relaie le résultat. Le core ne réimplémente
jamais ce que fait un satellite et ne recopie pas ses modèles de données.

## Routes

Toutes sous `/lun/v1`, en JSON, avec `Authorization: Bearer <jeton>`, sauf `pair`. Elles s'ajoutent à
l'API métier du satellite.

| Route | Rôle | Réponse |
|---|---|---|
| `POST /lun/v1/pair` `{ code }` | échange un code d'appairage contre un jeton | `{ token, satellite: { id, nom, version } }` |
| `GET /lun/v1/health` | santé et état | `{ status, reason?, version }` |
| `GET /lun/v1/costs?since=<ISO>` | dépense depuis une date | `{ currency: 'USD', since, until, total, items }` |
| `POST /lun/v1/pause` `{ reason? }` | coupe toute action automatique | `{ status }` |
| `POST /lun/v1/resume` | rétablit les actions automatiques | `{ status }` |
| `GET /lun/v1/events` | flux SSE des événements, reprise par `Last-Event-ID` | flux |
| `GET /lun/v1/actions` | actions disponibles | `{ actions }` |
| `POST /lun/v1/actions/:name` | invoque une action, corps validé par son schéma | `{ ok, result?, error? }` |

## Types

```ts
type Status = 'ok' | 'paused' | 'degraded';
type Importance = 'info' | 'normal' | 'urgent';

interface Health { status: Status; reason?: string; version: string }
interface CostItem { provider: string; model?: string; amount: number; calls: number }
interface Costs { currency: 'USD'; since: string; until: string; total: number; items: CostItem[] }
interface LunEvent { id: string; type: string; importance: Importance; at: string; title: string; data?: unknown }
interface Action { name: string; description: string; input: object /* JSON Schema */ }
interface ActionResult { ok: boolean; result?: unknown; error?: string }
```

Les dates sont en ISO 8601 UTC, les montants en dollars avec deux décimales au moins. Ces types
restent écrits ici ; un paquet partagé ne sera créé que si deux projets en ont réellement besoin.

## Appairage

- Le code est **affiché par le satellite** (son front autonome), à usage unique, valable **10 minutes**.
- Le jeton obtenu est propre à un client (le core, un appareil) et révocable depuis le satellite.
- Jamais de secret serveur saisi à la main, jamais de jeton dans un dépôt.

## Comportements

- **Pause** : le satellite continue de servir ses lectures et ses événements ; seules les actions
  automatiques (tri, écritures, appels LLM non demandés) s'arrêtent. Une action invoquée à la main
  reste possible.
- **Importance** : fixée par le satellite. `urgent` traverse le mode focus, `normal` attend la fin du
  focus, `info` n'interrompt jamais. Le core filtre selon le mode ; le satellite ne connaît pas les
  modes.
- **Coûts** : chaque appel payant (LLM, API) est compté par le satellite lui-même.
- **Crédit épuisé** : `health` passe en `degraded` avec la raison ; les lectures continuent.

## Erreurs

| Code | Cas |
|---|---|
| 400 | corps invalide (schéma de l'action, `since` illisible) |
| 401 | jeton absent, invalide ou révoqué ; code d'appairage expiré |
| 404 | action inconnue |
| 409 | `pause` alors que déjà en pause, `resume` alors que déjà actif |
| 503 | service `degraded` pour l'opération demandée |

Corps d'erreur : `{ error: string }`, message lisible par un humain.

## Fronts et vues

Une vue n'existe qu'en **un exemplaire** : un satellite qui a un front publie ses vues métier en paquet
de composants Svelte, versionné avec lui, nommé `@lun-ecosystem/<id>-views`. Les apps de Lun'Anima les
intègrent sans les réécrire.

| | Front autonome d'un satellite | Apps de Lun'Anima |
|---|---|---|
| Contenu | son domaine seulement : données, actions, réglages, autorisations | le transversal : Natsume, cerveau, briefing, modes, coûts agrégés |
| Vues métier | en est la source et les publie | les intègre |
| Connaît | son propre serveur, rien d'autre (aucun réglage « hub ») | le core seul, qui relaie les satellites |
| Interdit | les données d'un autre satellite, une fonction de Natsume | recoder une vue ou une règle métier d'un satellite |

Le front autonome sert aussi de **mode de secours** quand le core est en panne ou en pause.

## Versionnement

Une rupture (route retirée, champ renommé ou rendu obligatoire) crée `/lun/v2`. La v1 reste servie
jusqu'à ce que le core soit migré. Ajouter un champ optionnel ou une route n'est pas une rupture.
