<!-- Copie générée depuis standards/qualite.md : ne pas modifier ici -->
# Qualité

## Barrières automatiques

Elles ne coûtent aucun token et passent avant toute revue humaine ou IA.

| Barrière | En local | En CI |
|---|---|---|
| Format | Hook avant commit | Vérifié |
| Lint | Hook avant commit | Vérifié |
| Typage | À la demande et avant push | Vérifié |
| Tests | À chaque tâche du plan | Vérifié, requis pour merger |
| Format des commits | Hook `commit-msg` | Vérifié sur la PR |

Les outils exacts dépendent de la stack ([`stack.md`](stack.md)) et sont fixés à la création du projet.

## Tests

- Tests d'abord quand le comportement est testable : on écrit le test, on le voit échouer, on code,
  on le voit passer.
- Un test qui passe avant l'implémentation est un test suspect.
- Les tests ne dépendent ni du NAS ni du vrai compte Google.

## Preuve d'usage

Les tests ne suffisent pas pour clore un chantier : CrOliX vérifie les critères de fin **en local, de
bout en bout**, et la preuve figure dans la PR (capture, commande de démo, sortie).

## Revue

- L'agent `reviewer` relit chaque diff contre la tâche, les critères de fin et les standards.
- Ses remarques bloquantes sont corrigées avant la PR ; les autres deviennent des issues `inbox`.
- Une affirmation « c'est fini » sans commande exécutée et sortie lue n'est pas recevable.
