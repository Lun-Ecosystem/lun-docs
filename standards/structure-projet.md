# Structure d'un projet

> Tout nouveau projet part de [`templates/project/`](../templates/project/) et s'inscrit dans
> [`registry.yaml`](../registry.yaml).

## Fichiers obligatoires

| Fichier | Contenu |
|---|---|
| `README.md` | Ce que fait le projet, son rôle (core ou satellite), **le démarrage local, tel qu'il se fait**. Même forme partout, celle de `templates/project/README.md` ; badges d'un dépôt public : version si publiée, CI, licence si posée, Node, stack, écosystème, à la couleur du monde |
| `CLAUDE.md` | 100 lignes max : renvoie à lun-docs et au plugin, ne garde que le spécifique au projet |
| `docs/` | Ce qui **existe** : utilisateur, technique, exploitation. Jamais l'historique |
| `docs/decisions/` | Les ADR propres au projet (une page, remplacés et jamais modifiés) |
| `.env.example` | Toutes les variables, sans valeur secrète |
| `.github/pull_request_template.md` | Gabarit de PR (critères, preuves, niveau) |
| `.github/ISSUE_TEMPLATE/` | Gabarits `chantier` et `inbox` |
| `.claude/settings.json` | Marketplace lun-docs, plugin `lun` activé, permissions refusées |

## Ce qui n'a pas sa place dans un dépôt

- Un fichier d'avancement, une roadmap, des « paliers » : l'avancement vit dans la feuille de route du MVP, dans
  lun-docs.
- Un journal des observations : ce sont les issues `inbox`.
- Un plan de chantier : il vit dans `lun-docs/docs/plans/`. À la clôture, ses cases sont cochées et sa tête donne le
  lien de la PR qui livre. Une tâche non faite reste vide, et la PR dit pourquoi.
- Une copie d'un standard de lun-docs : on y renvoie.
- `graphify-out/` : le graphe est local à chaque poste et se reconstruit.
- Un son : enregistrement, synthèse ou déroulé.
- Un modèle, sauf s'il est petit, libre, nécessaire à l'app et tracé : un `SOURCE.md` dans son dossier donne sa
  source, sa version, sa taille, son SHA-256 et sa licence. `check-repo.mjs --public` refuse un son, et un modèle sans
  ce `SOURCE.md`.

## Graphe de connaissance

Installation, une fois par poste : `uv tool install graphifyy`. À la racine d'un dépôt :

- premier graphe : `/graphify .` dans Claude Code ;
- après un changement de code : `graphify update .`, sans modèle ;
- après un changement de docs : `/graphify . --update`.

`.graphifyignore` écarte ce qui n'apporte rien au graphe, comme les captures et les maquettes.

Le graphe global se construit dans le dossier parent des dépôts, hors de git :
`graphify merge-graphs <dépôt>/graphify-out/graph.json … --out graphify-out/graph.json`. Il ne se met
pas à jour tout seul : on le refait après avoir rafraîchi les graphes des dépôts.

## CLAUDE.md

Trois sections, pas plus :

1. **Ce projet** : rôle dans l'écosystème, ce qu'il possède et ce qu'il ne possède pas.
2. **Lancer en local** : la commande, les prérequis.
3. **Spécificités** : ce qu'un agent ne peut pas deviner (pièges, conventions locales).

Tout le reste (méthode, git, design) vient du plugin et de lun-docs.

## Langues

- Ce qui entre dans git et le code : **anglais**. Le code, ses noms et ses commentaires, les tests, les commits, et
  le titre d'une PR, dont le squash fait le commit de `main`.
- Ce qu'une personne lit : **français**. Les docs, les README (celui de l'organisation compris), les issues, le corps
  d'une PR, les textes des écrans et les échanges avec CrOliX.
- Deux exceptions, par choix : le site, bilingue, et les devises des projets, en anglais
  ([`design.md`](design.md), « Ton des textes »).

## Doc et code ensemble

Toute modification visible par l'utilisateur met à jour `docs/` dans le même commit. La revue refuse
une PR qui change un comportement sans sa doc.
