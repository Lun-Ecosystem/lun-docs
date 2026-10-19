# Git, PR, release

> Le skill `lun-livrer` applique ce standard. Le hook de garde du plugin et les permissions des
> gabarits l'outillent.

## Branches

- `main` est protégée. Jamais de push direct, jamais de push forcé.
- Une branche par chantier ou par tâche : `feat/<sujet>`, `fix/<sujet>`, `docs/<sujet>`, `chore/<sujet>`.

## Commits

- [Conventional Commits](https://www.conventionalcommits.org/fr/) : `feat:`, `fix:`, `docs:`, `chore:`,
  `ci:`, `test:`, `refactor:`, avec une portée optionnelle (`feat(mail): …`).
- En anglais, à l'impératif, une idée par commit.
- La doc touchée par le changement est dans le même commit.

## Pull requests

- Petites : un chantier, ou une tâche d'un gros chantier.
- Le gabarit est obligatoire : issue liée, critères de fin cochés, **preuves** (sortie des tests,
  capture, commande de démo), niveau de la tâche.
- La CI doit être verte.
- Fusion en **squash** : un commit propre par PR sur `main`.
- **Seul CrOliX merge.** L'agent ouvre la PR, ne la merge jamais, et n'active pas l'auto-merge.

## Protection de `main`

| Dépôt | Protection |
|---|---|
| Public | Ruleset GitHub : PR obligatoire, check CI requis, pas de push forcé, pas de suppression |
| Core (privé, pas de GitHub Pro) | Permissions Claude Code + hook git `pre-push` local qui refuse tout push vers `main` |

Dans les deux cas, le hook de garde du plugin bloque côté agent : `gh pr merge`, `git push` vers
`main`, `--force`, `-f`, `--force-with-lease` et les réf. préfixées `+`. L'agent agit avec l'identité
GitHub de CrOliX : GitHub seul ne peut pas faire la différence, d'où cette double barrière.

## Release

- Versions sémantiques, déduites des commits.
- Changelog et numéro de version générés par l'outillage, jamais écrits à la main par un LLM.
- L'outil et le déclenchement sont fixés projet par projet, à la mise en place de sa CI.
