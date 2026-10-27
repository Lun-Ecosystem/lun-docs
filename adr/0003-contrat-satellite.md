# ADR 0003 : contrat satellite REST + SSE, appairage par jeton

Statut : remplacée par 0004
Date : 2026-10-19

## Contexte

La [spec de l'étape 2](../docs/specs/2026-10-19-ecosysteme-design.md) (§6) impose une interface
commune à tous les satellites, pour que le core et le panel les pilotent sans connaître leur métier,
et laisse le transport ouvert. L'ancien écosystème mêlait REST, WebSocket et secrets partagés
recopiés dans plusieurs `.env` sous des noms différents.

## Décision

- Routes REST sous `/lun/v1` pour la santé, les coûts, la pause, les actions.
- Événements en **Server-Sent Events**, reprise par `Last-Event-ID`.
- Authentification par **jeton d'appairage** : un code à usage unique affiché par le satellite,
  échangé contre un jeton propre au client et révocable.
- Les vues métier d'un satellite sont publiées en paquet de composants et intégrées par les apps de
  Lun'Anima ([`standards/contrat-satellite.md`](../standards/contrat-satellite.md)).

## Conséquences

- Un client HTTP suffit au core ; le flux reprend seul après une coupure réseau.
- Aucun secret partagé entre services ; un appareil perdu se révoque seul.
- Une rupture du contrat impose `/lun/v2` et une période de double service.

## Alternatives écartées

- **WebSocket** : bidirectionnel inutile ici, reprise après coupure à coder soi-même.
- **Secret partagé** dans les `.env` : fragile, impossible à révoquer par client.
- **gRPC** : outillage lourd pour un usage personnel, mal servi par les navigateurs.
