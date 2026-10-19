---
name: lun-ecosysteme
description: Use when a task touches the Lun' ecosystem architecture - deciding which project owns a feature, wiring a satellite to the core, adding a project, or when a feature might already exist elsewhere. Enforces core privé / satellites autonomes.
---

# Écosystème Lun'

Le nord est `references/vision.md` ; les règles non négociables sont dans `references/essentiel.md`.
Lis-les avant de trancher une question d'architecture.

## Le principe

**Le core est privé. Les satellites sont des outils autonomes qui portent leur propre logique métier
et peuvent être câblés au core.**

- Un satellite fonctionne seul. Le core le consomme par un contrat explicite ; il ne réimplémente pas
  sa logique.
- **Une fonction a un seul propriétaire.** Avant d'ajouter une fonction, cherche qui la possède déjà
  dans le registre (`registry.yaml` de lun-docs, champ `contrats`). Si un autre projet la possède, on
  passe par son contrat. Une boîte mail, un agent ou une logique de tri en double est un défaut, pas
  une option.
- Une surface (panel, mobile) **affiche et pilote** ; elle ne porte pas de logique métier propre.
- Le branchement passe par le contrat commun : `references/contrat-satellite.md` (routes `/lun/v1`,
  appairage, pause, coûts, événements SSE, vues publiées en paquet). Un front autonome ne connaît que
  son satellite ; les apps de Lun'Anima intègrent les vues sans les réécrire.

## Quand une question d'architecture se pose

1. Identifie le propriétaire de la fonction dans le registre.
2. S'il n'y en a pas : propose un propriétaire et un contrat à CrOliX. Une décision qui engage
   plusieurs chantiers devient un ADR (`adr/` de lun-docs).
3. Un nouveau projet s'inscrit dans `registry.yaml` et part de `templates/project/` de lun-docs.

Lire le registre sans clone local :
`gh api repos/Lun-Ecosystem/lun-docs/contents/registry.yaml -H "Accept: application/vnd.github.raw"`
