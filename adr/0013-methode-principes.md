# ADR 0013 : la méthode, ses principes durables

Statut : acceptée
Date : 2026-11-12

## Contexte

L'ADR 0001 a posé le référentiel et la méthode le 19/10. Une part n'est plus vraie : l'avancement a quitté le GitHub
Projects pour la feuille de route du MVP, la prod quitte le NAS (ADR 0012), et aucun niveau de tâche ne choisit plus le
modèle ([`workflow.md`](../standards/workflow.md)). Un ADR accepté ne se modifie pas : celui-ci garde ce qui dure et
remplace 0001.

## Décision

- **lun-docs fait foi** et se distribue par le plugin Claude Code `lun`.
- **Une place par information**, celle que dit [`essentiel.md`](../standards/essentiel.md), § 2.
- **Le périmètre d'un chantier se fige à son ouverture** ; une observation part en issue `inbox`.
- **Un chantier se clôt par une preuve locale**, de bout en bout.
- **Un local autonome et une prod** ; on teste en local, jamais sur la prod.
- **Seul CrOliX merge.**
- **Les dépôts sont publics, sauf le core et le site.**
- **Les outils sans IA d'abord.**

La méthode vit dans les standards et se change par une PR : [`essentiel.md`](../standards/essentiel.md),
[`workflow.md`](../standards/workflow.md), [`git.md`](../standards/git.md),
[`environnements.md`](../standards/environnements.md). Cet ADR ne la recopie pas.

## Conséquences

- Quittent 0001 : le GitHub Projects ; la prod sur le NAS ; le modèle choisi par niveau de tâche, et la décision
  d'achat après mesure qui en dépendait.
- Restent vraies celles de 0001 : aucun fichier d'avancement dans le dépôt d'un projet, l'avancement vit dans la
  feuille de route de lun-docs ; chaque projet installe le plugin `lun` et part du gabarit de lun-docs.

## Alternatives écartées

- **Modifier 0001** : un ADR accepté ne se modifie pas.
- **Recopier la méthode ici** : deux textes à tenir d'accord, quand les standards font déjà foi.
- Celles que 0001 écartait, pour les mêmes raisons.
