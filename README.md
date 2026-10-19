# lun-docs

Le référentiel central de l'écosystème Lun' : la vision, les standards, les décisions d'écosystème,
le registre des projets, les gabarits, et le plugin Claude Code `lun` qui applique tout cela dans
chaque projet. Ce dépôt ne contient aucun code applicatif.

## Quoi fait foi

| Sujet | Où |
|---|---|
| Ce qu'on construit et pourquoi | [`vision.md`](vision.md) |
| Les règles non négociables | [`standards/essentiel.md`](standards/essentiel.md) |
| La méthode de travail, les niveaux de tâche et les modèles | [`standards/workflow.md`](standards/workflow.md) |
| Branches, commits, PR, release | [`standards/git.md`](standards/git.md) |
| Local et prod | [`standards/environnements.md`](standards/environnements.md) |
| Structure d'un projet | [`standards/structure-projet.md`](standards/structure-projet.md) |
| Qualité, sécurité, stack, design | [`standards/`](standards/) |
| Décisions d'écosystème | [`adr/`](adr/) |
| Les projets, leur rôle, leur dépôt | [`registry.yaml`](registry.yaml) |
| Squelette d'un nouveau projet | [`templates/project/`](templates/project/) |
| Skills communautaires retenus et écartés | [`community-skills.md`](community-skills.md) |
| L'avancement | le GitHub Projects « Lun'Ecosystem » (jamais dans ce dépôt) |

En cas de conflit entre lun-docs et un projet, lun-docs fait foi, ou on le change par une PR.

## Installer le plugin dans un projet

Les gabarits de projet déclarent déjà la marketplace dans `.claude/settings.json`. À la main :

```
/plugin marketplace add Lun-Ecosystem/lun-docs
/plugin install lun@lun-docs
```

Le plugin apporte les agents (un par rôle et par niveau de tâche), les skills `lun-*` et le hook de
garde qui interdit à l'agent de merger, de pousser sur `main` ou de forcer un push.

## Par où commencer

1. [`vision.md`](vision.md), puis [`standards/essentiel.md`](standards/essentiel.md).
2. Le standard qui correspond à la tâche du jour.
3. Pour un nouveau projet : [`templates/project/`](templates/project/) et l'ajout au registre.

## Créer un projet

```bash
gh repo create Lun-Ecosystem/<nom> --private|--public --add-readme
git clone https://github.com/Lun-Ecosystem/<nom> && cd <nom> && git switch -c chore/socle
cp -r <lun-docs>/templates/project/. .
cp -r <lun-docs>/templates/ts/. .      # projet TypeScript (voir standards/stack.md)
git config core.hooksPath hooks
sh <lun-docs>/tools/setup-github.sh Lun-Ecosystem/<nom>
```

Remplacer ensuite tous les `<…>` (README, CLAUDE.md, `package.json`, `src/`), vérifier
`npm run format:check && npm run lint && npm run typecheck && npm test`, ouvrir la PR, puis inscrire
le projet dans [`registry.yaml`](registry.yaml).

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
