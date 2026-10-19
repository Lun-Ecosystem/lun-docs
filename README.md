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

## Travailler sur lun-docs

```bash
npm test           # tests de l'outillage
npm run check      # fichiers requis, longueur des standards, aucune adresse interne
```

lun-docs suit ses propres règles : une branche, une PR, CrOliX merge.
