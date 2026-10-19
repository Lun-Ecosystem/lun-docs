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

1. Barrières locales vertes (format, lint, typage, tests) : lance-les et lis la sortie.
2. `git push -u origin <branche>` (jamais `main`).
3. `gh pr create` avec le gabarit du dépôt rempli : issue liée (`Closes #n`), critères de fin cochés,
   **preuves** (sortie des tests, capture, commande de démo), niveau.
4. `gh pr checks --watch` : la CI doit être verte.
5. Dis à CrOliX que la PR est prête, avec son lien.

## Interdit

Merger (`gh pr merge`), activer l'auto-merge, pousser sur `main`, forcer un push. Le hook de garde du
plugin les bloque ; ne cherche pas à le contourner.

## Release

Version et changelog sont produits par l'outillage du dépôt à partir des commits, jamais rédigés à la
main par un agent.
