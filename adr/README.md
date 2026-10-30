# Décisions d'écosystème (ADR)

Un ADR consigne une décision qui **engage plusieurs chantiers** ou qui serait **coûteuse à défaire**.
Une observation, un retour ou une idée n'est pas un ADR : c'est une issue `inbox`.

Les décisions propres à un seul projet vont dans le `docs/decisions/` de ce projet, au même format.

## Règles

- **Une page** : 60 lignes maximum (vérifié par `npm run check`).
- Numérotation sur quatre chiffres : `0001-titre-court.md`.
- Une ligne `Statut : acceptée` ou `Statut : remplacée par NNNN`.
- **On ne modifie jamais** un ADR accepté. Si la décision change, on écrit un nouvel ADR et on passe
  l'ancien à `Statut : remplacée par NNNN`. C'est la seule modification permise.
- Un ADR passe par une PR, comme le reste.

Gabarit : [`_template.md`](_template.md).

## Index

| N° | Décision | Statut |
|---|---|---|
| [0001](0001-referentiel-et-methode.md) | Référentiel central, méthode de travail et agent IA | acceptée |
| [0002](0002-stack.md) | Stack de l'écosystème | acceptée |
| [0003](0003-contrat-satellite.md) | Contrat satellite REST + SSE, appairage par jeton | remplacée par 0004 |
| [0004](0004-delegation-aux-agents.md) | Délégation aux agents des satellites, sans paquet de vues | acceptée |
| [0005](0005-cerveau-sqlite.md) | Le cerveau d'Avaritia vit dans SQLite | acceptée |
| [0006](0006-graphe-sigma.md) | Le graphe d'Avaritia : Sigma.js et graphology | acceptée |
| [0008](0008-acces-exterieur.md) | L'accès depuis l'extérieur, déchiffré sur le NAS seulement | acceptée |
