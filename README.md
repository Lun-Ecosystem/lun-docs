<div align="center">

# lun-docs

**Le référentiel central de l'écosystème Lun' : la vision, les standards, le registre et le plugin qui les applique.**

Les décisions d'écosystème, les gabarits et le plugin Claude Code `lun`, utilisés par chaque projet. Ce dépôt ne contient
aucun code applicatif.

[![CI](https://img.shields.io/github/actions/workflow/status/Lun-Ecosystem/lun-docs/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/Lun-Ecosystem/lun-docs/actions/workflows/ci.yml)
[![Licence](https://img.shields.io/github/license/Lun-Ecosystem/lun-docs?style=flat-square&label=licence)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22-5FA04E?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Écosystème Lun'](https://img.shields.io/badge/%C3%A9cosyst%C3%A8me-Lun'-555555?style=flat-square)](https://github.com/Lun-Ecosystem)

</div>

## Quoi fait foi

| Sujet | Où |
|---|---|
| Ce qu'on construit et pourquoi | [`vision.md`](vision.md) |
| Les règles non négociables | [`standards/essentiel.md`](standards/essentiel.md) |
| La méthode de travail, les niveaux de tâche et les modèles | [`standards/workflow.md`](standards/workflow.md) |
| Branches, commits, PR, release | [`standards/git.md`](standards/git.md) |
| Local et prod | [`standards/environnements.md`](standards/environnements.md) |
| Paliers et rendu des notifications | [`standards/notifications.md`](standards/notifications.md) |
| Les mots de l'écosystème | [`standards/dictionnaire.md`](standards/dictionnaire.md) |
| Structure d'un projet | [`standards/structure-projet.md`](standards/structure-projet.md) |
| Qualité, sécurité, stack, design | [`standards/`](standards/) |
| Variables de design de référence (copiées dans chaque dépôt) | [`design/tokens.css`](design/tokens.css) |
| Le kit de composants communs, et sa galerie locale (dans `design/` : `npm ci`, puis `npm run galerie`) | [`design/kit/`](design/kit/), [`design/galerie/`](design/galerie/) |
| Décisions d'écosystème | [`adr/`](adr/) |
| Les projets, leur rôle, leur dépôt | [`registry.yaml`](registry.yaml) |
| Squelette d'un nouveau projet | [`templates/project/`](templates/project/) |
| Skills communautaires retenus et écartés | [`community-skills.md`](community-skills.md) |
| Ce qui tourne aujourd'hui | [`docs/architecture-actuelle.md`](docs/architecture-actuelle.md) |
| L'état cible et les lignes d'arrivée de chaque projet | le [cadrage de l'état cible](docs/specs/2026-11-10-etat-cible-cadrage.md) |
| L'avancement | la [feuille de route du MVP](docs/plans/2026-11-07-feuille-de-route-mvp.md) |

En cas de conflit entre lun-docs et un projet, lun-docs fait foi, ou on le change par une PR.

## Installer le plugin dans un projet

Les gabarits de projet déclarent déjà la marketplace dans `.claude/settings.json`. À la main :

```
/plugin marketplace add Lun-Ecosystem/lun-docs
/plugin install lun@lun-docs
```

Le plugin apporte les agents spécialisés (recherche, veille, plan, développement par dépôt, tests,
relecture, livraison ; voir `standards/workflow.md`), les skills `lun-*` et le hook de
garde qui interdit à l'agent de merger, de pousser sur `main` ou de forcer un push.

## Par où commencer

1. [`vision.md`](vision.md), puis [`standards/essentiel.md`](standards/essentiel.md).
2. Le standard qui correspond à la tâche du jour.
3. Pour un nouveau projet : [`templates/project/`](templates/project/) et l'ajout au registre.
4. Pour mettre le desktop en service : [`docs/mise-en-service-desktop.md`](docs/mise-en-service-desktop.md).

## Créer un projet

```bash
gh repo create Lun-Ecosystem/<nom> --private|--public --add-readme
git clone https://github.com/Lun-Ecosystem/<nom>
cd <nom>
git switch -c chore/socle
cp -r <lun-docs>/templates/project/. .
cp -r <lun-docs>/templates/ts/. .      # projet TypeScript (voir standards/stack.md)
git add hooks
git update-index --chmod=+x hooks/*    # Windows perd le bit exécutable à la copie
git config core.hooksPath hooks
sh <lun-docs>/tools/setup-github.sh Lun-Ecosystem/<nom>
```

Remplacer ensuite tous les `<…>` (README, CLAUDE.md, `package.json`, `src/`), lancer `npm run format:check`,
`npm run lint`, `npm run typecheck` et `npm test`, ouvrir la PR, puis inscrire le projet dans
[`registry.yaml`](registry.yaml).

## Travailler sur lun-docs

```bash
npm test           # tests de l'outillage
npm run check      # fichiers requis, longueurs, adresses internes, registre, ADR, versions
npm run sync       # recopie les standards modifiés dans le plugin (obligatoire avant commit)
```

lun-docs suit ses propres règles : une branche, une PR, CrOliX merge.

## Publier une version du plugin

Un chantier ne vaut pas une release. Quand plusieurs chantiers mergés forment un ensemble validé :

1. PR `chore(release): lun x.y.z` : même version dans `plugin/.claude-plugin/plugin.json` et
   `.claude-plugin/marketplace.json`, liste des chantiers regroupés. CrOliX merge.
2. Sur `main` à jour, CrOliX pose le tag : `claude plugin tag plugin --push`.
3. La CI vérifie et publie la release GitHub avec ses notes. Les projets récupèrent la nouvelle version
   avec `/plugin update lun@lun-docs`.
