# Git, PR, release

> Le skill `lun-livrer` applique ce standard. Le hook de garde du plugin et les permissions des
> gabarits l'outillent.

## Branches

- `main` est protégée. Jamais de push direct, jamais de push forcé.
- **Un chantier = une branche = une PR** : `feat/<sujet>`, `fix/<sujet>`, `docs/<sujet>`, `chore/<sujet>`.
  Jamais une PR par tâche ou par étape du plan.
- Chaque chantier part de `main` à jour : `git switch main`, `git pull --ff-only`, puis
  `git switch -c <type>/<sujet>` ; ou, sans toucher la copie principale, son propre worktree :
  `git fetch` puis `git worktree add <dossier> -b <type>/<sujet> origin/main`.
- Les **étapes** du chantier se font sur sa branche : un ou plusieurs commits par étape, chacune
  contrôlée (barrières vertes) avant la suivante.
- **Worktrees** permis aussi pour des étapes indépendantes d'un même chantier : leurs branches restent
  locales, sont fusionnées dans la branche du chantier puis supprimées. Jamais poussées, jamais de PR.
- **Pas de branches empilées poussées** (une par étape, chacune partant de la précédente) : avec la
  fusion en squash, la suivante entre en conflit dès que la première est mergée.
- Un chantier trop gros pour une PR se **découpe en plusieurs chantiers au moment du plan** (une
  issue, une branche, une PR chacun, le suivant partant de `main` une fois le précédent mergé),
  jamais tâche par tâche en cours d'exécution.
- Une fois la PR mergée (la branche distante est supprimée automatiquement) : `git fetch --prune`,
  vérifier que tout est dans `main`, puis supprimer la branche locale (`git branch -D`, car le squash
  la fait paraître « en avance »).

## Commits

- [Conventional Commits](https://www.conventionalcommits.org/fr/) : `feat:`, `fix:`, `docs:`, `chore:`,
  `ci:`, `test:`, `refactor:`, avec une portée optionnelle (`feat(mail): …`).
- En anglais, à l'impératif, une idée par commit.
- La doc touchée par le changement est dans le même commit.

## Pull requests

- Une seule par chantier, **ouverte en brouillon dès le premier push** : la CI tourne à chaque étape
  poussée.
- Elle passe « prête » selon ce qui porte la preuve
  ([Ship/Show/Ask](https://martinfowler.com/articles/ship-show-ask.html), audit du 08/11, Q7).
  *Show* : ce qui se prouve sur le laptop (doc, code couvert par ses tests) passe « prête » dès ses
  critères prouvés. *Ask* : ce que seul le desktop prouve (voix, fenêtre Tauri, services) reste en
  brouillon jusqu'à la recette de CrOliX. Le plan du chantier dit lequel. Dans les deux cas, c'est CrOliX
  qui la passe « prête » : l'agent lui dit qu'elle l'est, avec son lien.
- Les corrections de revue arrivent dans la même PR, jamais dans une nouvelle.
- **Dans lun-docs aussi, une PR par chantier** : son plan, ses textes et ses coches y voyagent ensemble.
  Avant d'en ouvrir une, regarder si le chantier en a déjà une (`gh pr list --state open`) et y pousser.
  Un plan s'y valide par le « validé » écrit de CrOliX, pas par la fusion.
- Le gabarit est obligatoire : issue liée, critères de fin cochés, **preuves** (sortie des tests,
  capture, commande de démo), niveau de la tâche.
- La CI doit être verte.
- Fusion en **squash** : un commit propre par PR sur `main`. Les réglages de chaque dépôt n'en permettent
  pas d'autre.
- **Seul CrOliX merge.** L'agent ouvre la PR, ne la merge jamais, et n'active pas l'auto-merge.

## Protection de `main`

| Dépôt | Protection |
|---|---|
| Public | Ruleset GitHub : PR obligatoire, check CI requis, pas de push forcé, pas de suppression |
| Core (privé, pas de GitHub Pro) | Permissions Claude Code + hook git `pre-push` local qui refuse tout push vers `main` |

Dans les deux cas, le hook de garde du plugin bloque côté agent : `gh pr merge` (options `-R` et
`--repo` comprises), `git push` vers `main` ou `master`, `--force`, `-f`, `--force-with-lease` et les
réf. préfixées `+`. Il refuse aussi `gh pr create` sans `--draft`, et un titre de PR (`gh pr create`,
`gh pr edit`) que la CI refuserait. Ce qu'il ne lit pas passe (`gh api …/merge`, un alias) : le ruleset
et le hook `pre-push` restent derrière. Les règles `deny` du gabarit (`.claude/settings.json`) ne sont
qu'un filet par préfixe : elles ne voient ni `feat:main` ni une option glissée avant le dépôt, la garde
reste la barrière. L'agent agit avec l'identité GitHub de CrOliX : GitHub seul ne peut pas faire la
différence, d'où cette double barrière.

Le hook `pre-push` du gabarit vit aussi dans les dépôts publics : il arrête l'erreur avant le réseau. Le premier
push de `main` d'un dépôt neuf, avant de poser son ruleset, revient à CrOliX, avec `--no-verify` : le hook de garde
le refuse à l'agent.

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
