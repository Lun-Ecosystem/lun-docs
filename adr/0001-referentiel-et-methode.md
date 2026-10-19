# ADR 0001 : référentiel central, méthode de travail et agent IA

Statut : acceptée
Date : 2026-10-19

## Contexte

L'écosystème Lun' s'éloignait de sa vision : une doc qui ne fait que grossir (ADR et suivi pour chaque
observation), un avancement éclaté entre les dépôts, des chantiers jamais clos parce que les
observations passaient devant ce qui les concluait, et des tests qui dépendaient du NAS.

## Décision

Remise à plat en trois étapes : fondations (ce référentiel), planification de zéro, exécution chantier
par chantier. Pour les fondations :

- **lun-docs** est le référentiel unique et fait foi ; il est distribué par un plugin Claude Code.
- **Une place par information** : décisions en ADR d'une page, observations en issues `inbox`,
  avancement dans un seul GitHub Projects, doc produit qui décrit ce qui existe.
- **Périmètre figé** à l'ouverture d'un chantier ; une observation n'y entre que si elle bloque ses
  critères de fin ; tri de l'inbox une fois par semaine.
- **Deux environnements** : local autonome (compte Google de test) et prod sur le NAS.
- **Seul CrOliX merge.** Dépôts publics sauf le core.
- **Claude Code natif**, outils sans IA d'abord, modèle choisi par niveau de tâche (Haiku, Sonnet,
  Opus, Fable sur demande explicite), décision d'achat après deux semaines de mesure.

Détail complet : [`docs/specs/2026-10-19-referentiel-design.md`](../docs/specs/2026-10-19-referentiel-design.md).

## Conséquences

- Plus de fichier d'avancement ni de « paliers » dans les dépôts.
- Un chantier n'est clos qu'avec une preuve locale de bout en bout.
- Chaque projet installe le plugin `lun` et part du gabarit de lun-docs.

## Alternatives écartées

- **Ruflo (ex-Claude Flow)** : contexte gonflé, quota Pro vidé, fonctions partiellement non
  implémentées, orchestration opaque contraire à l'exigence de contrôle.
- **Trois environnements avec recette** : sans valeur pour un développeur solo si le local est complet.
- **Copies de `.claude/` par projet** : divergent avec le temps ; le plugin garde une seule source.
