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
| Plan d'un chantier | Dans l'issue ou la PR du chantier |
| Avancement | Le GitHub Projects « Lun'Ecosystem », jamais recopié dans une doc |
| Doc produit | `docs/` du projet : ce qui **est**, jamais l'historique |

Pas de fichier d'avancement, pas de « paliers » en Markdown, pas d'ADR pour une observation.

## 3. Un chantier se ferme

- Le périmètre est figé à l'ouverture, avec des critères de fin écrits et un niveau (`niveau:*`).
- Une observation faite en cours de route part dans `inbox`. Elle n'entre dans le chantier que si elle
  empêche d'atteindre ses critères de fin.
- Le chantier se ferme quand ses critères sont remplis et **prouvés en local**.

## 4. On teste en local, jamais sur le NAS

Toute la pile démarre en local en une commande, sans dépendre du NAS. La prod sert à l'usage, pas aux
essais. Aucune doc du type « à tester sur le NAS ».

## 5. Seul CrOliX merge

Jamais de push sur `main`, jamais de push forcé, jamais de merge par l'agent. Une branche et une PR
par chantier (jamais une par tâche), CI verte, CrOliX merge.

## 6. Rien de privé dans un dépôt public

Aucun secret, aucune adresse interne (IP du NAS, Tailscale, domaines privés), ni en clair ni dans
l'historique. Ces valeurs vivent dans des `.env` non versionnés.

## 7. La doc suit le code

Toute modification visible met à jour `docs/` dans le même commit.

## 8. Un satellite opère, le core relaie

Un satellite porte sa logique métier et fonctionne seul ; le core s'y branche par le
[contrat satellite](contrat-satellite.md) et ne réimplémente jamais ce qu'il fait. Une vue métier
n'existe qu'en un exemplaire, publiée par le satellite qui la possède.
