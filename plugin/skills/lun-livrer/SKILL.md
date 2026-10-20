---
name: lun-livrer
description: Use when committing, opening a pull request or preparing a release in a Lun' project. Conventional commits, PR with completion criteria and proofs, never merge.
---

# Livrer

Les règles sont dans `references/git.md` et `references/qualite.md`.

## Commits

- Conventional Commits en anglais : `feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `test:`, `refactor:`.
- La doc touchée est dans le même commit.

## Pull request

**Une seule PR par chantier**, jamais une par tâche. Si le chantier a déjà sa PR, pousse sur sa
branche : la PR se met à jour.

1. Barrières locales vertes (format, lint, typage, tests) : lance-les et lis la sortie.
2. `git push -u origin <branche>` (jamais `main`).
3. Premier push du chantier : `gh pr create --draft` avec le gabarit du dépôt (issue liée,
   `Closes #n`, niveau).
4. `gh pr checks --watch` : la CI doit être verte.
5. Critères de fin prouvés : gabarit complété (critères cochés, **preuves** : sortie des tests,
   capture, commande de démo), `gh pr ready`, puis dis à CrOliX que la PR est prête, avec son lien.

## Après le merge

La branche distante est supprimée automatiquement. `git fetch --prune`, vérifie que tout est dans
`main` (`git diff origin/main <branche>` vide), puis `git branch -D <branche>` et repars de `main`.

## Interdit

Merger (`gh pr merge`), activer l'auto-merge, pousser sur `main`, forcer un push. Le hook de garde du
plugin les bloque ; ne cherche pas à le contourner.

## Release

**Un chantier ne vaut pas une release.** Les chantiers mergés se regroupent logiquement ; la release
n'a lieu qu'après validation post-tests de l'ensemble, sur décision de CrOliX.

- Sur demande seulement : préparer la PR `chore(release): <projet> x.y.z` (bump de version, liste
  des chantiers regroupés).
- Jamais : poser un tag, pousser des tags, créer une release. C'est CrOliX qui tague ; la CI fait le
  reste (notes générées depuis les commits, image si le projet est déployé).
