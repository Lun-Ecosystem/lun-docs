<!-- Copie générée depuis standards/essentiel.md : ne pas modifier ici -->
# L'essentiel

> Les règles non négociables. Cinq minutes de lecture. Le seul standard que l'agent doit connaître en
> permanence ; les autres se lisent au moment où la tâche les demande.

## 1. lun-docs fait foi

En cas de conflit entre lun-docs et un projet, le projet a tort, ou on change lun-docs par une PR.
Le nord est [`vision.md`](../vision.md).

## 2. Une place pour chaque information

| Type | Où |
|---|---|
| Décision structurante, coûteuse à défaire | ADR d'une page (`adr/` ou `docs/decisions/` du projet), jamais modifié : remplacé |
| Observation, retour, idée | Issue GitHub étiquetée `inbox` |
| Plan d'un chantier | `lun-docs/docs/plans/`, lié depuis l'issue et la PR du chantier |
| Avancement | La feuille de route du MVP (`lun-docs/docs/plans/2026-11-07-feuille-de-route-mvp.md`) ; les issues gardent étiquettes et niveaux |
| Doc produit | `docs/` du projet : ce qui **est**, jamais l'historique |
| Ce qui tourne (dépôts, postes, ports, liaisons) | `lun-docs/docs/architecture-actuelle.md`, mise à jour par la PR qui le change |

Un seul fichier d'avancement, la feuille de route ; pas d'ADR pour une observation.

## 3. Un chantier se ferme

- Le périmètre est figé à l'ouverture, avec des critères de fin écrits et un niveau (`niveau:*`).
- Une observation faite en cours de route part dans `inbox`. Elle n'entre dans le chantier que si elle
  empêche d'atteindre ses critères de fin.
- Le chantier se ferme quand ses critères sont remplis et **prouvés en local**.

## 4. On teste en local, jamais sur la prod

Toute la pile démarre en local, sans dépendre du NAS ni du desktop. La prod (le desktop pendant le
rodage, la machine dédiée ensuite) sert à l'usage ; ce que seul le desktop prouve s'y essaie à part
([`environnements.md`](environnements.md)). Aucune doc du type « à tester sur la prod ».

## 5. Seul CrOliX merge

Jamais de push sur `main`, jamais de push forcé, jamais de merge par l'agent. Une branche et une PR
par chantier (jamais une par tâche), CI verte, CrOliX merge.

## 6. Rien de privé dans un dépôt public

Aucun secret, aucune adresse interne (IP du NAS, Tailscale, domaines privés), ni en clair ni dans
l'historique. Ces valeurs vivent dans des `.env` non versionnés. D'un dépôt privé, un dépôt public ne dit que le
nom, le rôle, les issues et les PR, le contrat public et l'adresse locale ; rien de son intérieur
([`securite.md`](securite.md)).

## 7. La doc suit le code

Toute modification visible met à jour `docs/` dans le même commit.

## 8. Un satellite opère, le core relaie

Un satellite porte sa logique métier et fonctionne seul ; le core s'y branche par le
[contrat satellite](contrat-satellite.md) et ne réimplémente jamais ce qu'il fait. Une vue métier
n'existe qu'en un exemplaire, publiée par le satellite qui la possède.

## 9. Le graphe d'abord

Quand `graphify-out/graph.json` existe, toute recherche commence par `graphify query "<question>"`,
`graphify explain "<nom>"` ou `graphify path "<A>" "<B>"`, et cette consigne passe dans le prompt de
chaque sous-agent. On lit ensuite les seuls passages utiles, plutôt que specs et standards en entier.
Une règle ou une décision se cite toujours depuis son texte d'origine, jamais depuis le graphe. Voir
[`structure-projet.md`](structure-projet.md).
