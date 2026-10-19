<!-- Copie générée depuis standards/git.md : ne pas modifier ici -->
# Git, PR, release

> Le skill `lun-livrer` applique ce standard. Le hook de garde du plugin et les permissions des
> gabarits l'outillent.

## Branches

- `main` est protégée. Jamais de push direct, jamais de push forcé.
- Une branche par chantier ou par tâche : `feat/<sujet>`, `fix/<sujet>`, `docs/<sujet>`, `chore/<sujet>`.
- Chaque chantier part de `main` à jour : `git switch main && git pull --ff-only`, puis
  `git switch -c <type>/<sujet>`.

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

**Un chantier ne vaut pas une release.**

- On **regroupe logiquement** plusieurs chantiers mergés (un thème, un jalon) avant de publier.
- On ne release **qu'après validation post-tests** de l'ensemble regroupé, en local, de bout en bout.
- La release se déclenche par un **bump de version** : une PR `chore(release): <projet> x.y.z` qui
  liste les chantiers regroupés, mergée par CrOliX, puis le tag de version posé **par CrOliX seul**.
- Le tag déclenche la CI de release : vérifications, release GitHub avec notes générées depuis les
  commits, et pour les projets déployés, l'image GHCR. Aucune PR de release automatique.
- Versions sémantiques. Notes et changelog sont générés par l'outillage, jamais rédigés par un LLM.
- L'agent peut préparer la PR de bump sur demande ; il ne pose jamais de tag et ne crée jamais de
  release (le hook de garde bloque `git push --tags`, `refs/tags/…`, `claude plugin tag`,
  `gh release create`).

Pour lun-docs : versions de `plugin.json` et de `marketplace.json` identiques (vérifié par
`npm run check`), tag posé avec `claude plugin tag plugin --push` (format `lun--v<version>`).
