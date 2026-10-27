# ADR 0004 : délégation aux agents des satellites, sans paquet de vues

Statut : acceptée
Date : 2026-10-27

## Contexte

La [spec de la liaison core ↔ satellites](../docs/specs/2026-10-27-liaison-core-satellites-design.md)
fait du core un manager et de chaque satellite un poste tenu par son propre agent (Pina pour
Lun'Acedia). L'[ADR 0003](0003-contrat-satellite.md) prévoyait que le core interroge, agisse, écoute
tout le flux et intègre les vues des satellites : un core en capsule, avec des écrans en double.

## Décision

Ce que l'ADR 0003 posait et qui reste :

- routes REST sous `/lun/v1` pour la santé, les coûts, la pause, les actions ;
- événements en **Server-Sent Events**, reprise par `Last-Event-ID` ;
- authentification par **jeton d'appairage**, propre au client et révocable.

Ce qui s'ajoute ou change (contrat v1.1, [`standards/contrat-satellite.md`](../standards/contrat-satellite.md)) :

- **Délégation** : `POST /lun/v1/agent` confie une demande à l'agent du satellite, qui applique ses
  propres règles et rend un résumé, ses cartes, ses références et son coût.
- **Cartes relayées** : `GET /lun/v1/cards`, `accept` et `refuse`. Les cartes restent chez le
  satellite ; le core affiche et transmet le geste.
- **Bilan du jour** : l'action de lecture `day.digest`, appelée par le core sur la période qu'il
  choisit.
- **Alertes** : `urgent` réservé aux règles déterministes ; le core ne retient du flux que `urgent`
  et les événements de contrôle.
- **Fin du paquet de vues** : les apps du core ont leurs propres écrans et n'intègrent jamais ceux
  d'un satellite.

## Conséquences

- Le métier reste chez le satellite, garde-fous compris : une délégation ne contourne jamais une carte.
- Un satellite sans agent reste valide : `health` dit s'il en a un (`agent: true`).
- Ajouts sans rupture : un satellite ou un core v1 continue de fonctionner.
- `views/` d'un satellite redevient un découpage interne, plus une interface publiée.

## Alternatives écartées

- **Vues intégrées dans les apps du core** : doublon d'interface, core en capsule de l'écosystème.
- **WebSocket pour la délégation** : une requête et sa réponse suffisent.
- **Satellite qui pousse son bilan** : connexion permanente inutile pour une remontée quotidienne.
