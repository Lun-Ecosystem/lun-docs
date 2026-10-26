<!-- Copie générée depuis standards/contrat-satellite.md : ne pas modifier ici -->
# Contrat satellite

> Ce que tout satellite expose pour être piloté par Lun'Anima sans que le core connaisse son métier.
> Décision : [ADR 0003](../adr/0003-contrat-satellite.md). Version du contrat : **v1**.

## Principe

Un satellite est **garant de sa logique métier** : il opère seul, en autonome. Natsume s'y branche,
l'interroge, lui demande d'agir, écoute ses événements et relaie le résultat. Le core ne réimplémente
jamais ce que fait un satellite et ne recopie pas ses modèles de données.

## Routes

Toutes sous `/lun/v1`, en JSON, avec `Authorization: Bearer <jeton>`, sauf `pair` et `authorize`. Elles s'ajoutent à
l'API métier du satellite.

| Route | Rôle | Réponse |
|---|---|---|
| `GET /lun/v1/authorize?client&redirect_uri&state&code_challenge` | publique, mène à la page d'autorisation du satellite | page HTML, ou redirection vers `redirect_uri` |
| `POST /lun/v1/pair` `{ code }` ou `{ code, code_verifier, client }` | échange un code d'appairage (6 chiffres) ou un code d'autorisation contre un jeton | `{ token, satellite: { id, nom, version } }` |
| `GET /lun/v1/health` | santé et état | `{ status, reason?, version, paused? }` |
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

interface Health { status: Status; reason?: string; version: string; paused?: true } // paused : en pause alors que l'état affiché est degraded
interface CostItem { provider: string; model?: string; amount: number; calls: number }
interface Costs { currency: 'USD'; since: string; until: string; total: number; items: CostItem[] }
interface LunEvent { id: string; type: string; importance: Importance; at: string; title: string; data?: unknown }
interface Action { name: string; description: string; input: object /* JSON Schema */ }
interface ActionResult { ok: boolean; result?: unknown; error?: string }
```

Les dates sont en ISO 8601 UTC, les montants en dollars avec deux décimales au moins. Ces types
restent écrits ici ; un paquet partagé ne sera créé que si deux projets en ont réellement besoin.

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
- **Importance** : fixée par le satellite. `urgent` traverse le mode focus, `normal` attend la fin du
  focus, `info` n'interrompt jamais. Le core filtre selon le mode ; le satellite ne connaît pas les
  modes.
- **Coûts** : chaque appel payant (LLM, API) est compté par le satellite lui-même.
- **Crédit épuisé** : `health` passe en `degraded` avec la raison ; les lectures continuent.
- **Clé de service** : types d'événement recommandés pour un satellite qui dépend d'une clé d'API.
  Jamais la clé elle-même, au plus ses 4 derniers caractères. Pas de doublon après un redémarrage.

  | Type | Importance | Cas |
  |---|---|---|
  | `key.invalid` | `normal` | la clé est refusée par le fournisseur |
  | `key.restored` | `info` | la clé refusée refonctionne |
  | `key.expiring` | `normal` | échéance proche, `data: { daysLeft: 14 \| 3, expires: 'AAAA-MM-JJ' }` |

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
jusqu'à ce que le core soit migré. Ajouter un champ optionnel ou une route (comme `authorize`) n'est pas une rupture.
