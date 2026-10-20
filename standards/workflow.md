# Méthode de travail

> Comment toute tâche passe du ticket au merge. Le skill `lun-chantier` applique ce standard ;
> superpowers fournit la mécanique (cadrage, plan, sous-agents, revue, vérification).

## Les cinq étapes

1. **Cadrer** (session principale, avec CrOliX). Lire l'issue, reformuler le besoin, écrire les
   **critères de fin**, fixer le **niveau** (étiquette `niveau:*`). Le périmètre est **figé**.
2. **Planifier et challenger.** Proposer 2 ou 3 approches, les critiquer, en recommander une.
   L'agent `plan-challenger` attaque le plan. CrOliX valide. **Aucun code avant ce feu vert.**
3. **Exécuter.** Une seule branche pour le chantier, une PR en brouillon dès le premier push. Les
   sous-agents `dev-*` prennent les tâches du plan une par une, tests d'abord quand c'est pertinent,
   chacune en commits sur cette branche. L'agent principal contrôle chaque tâche avant la suivante.
4. **Valider.** Barrières automatiques (format, lint, typage, tests) en local puis en CI ; revue par
   l'agent `reviewer` ; **preuve d'usage bout en bout en local** par CrOliX.
5. **Livrer.** La PR du chantier passe « prête », selon [`git.md`](git.md). CrOliX merge.

## La règle anti-ajout infini

- Une observation faite pendant un chantier devient une issue `inbox`. Elle n'entre dans le chantier
  **que si elle empêche d'atteindre ses critères de fin**.
- Le chantier se ferme quand ses critères sont remplis **et prouvés en local**. Les points prévus
  passent toujours avant les observations.
- L'inbox se trie **une fois par semaine**, à heure fixe, jamais au fil de l'eau (skill `lun-inbox`).
  Chaque issue est jetée, transformée en chantier futur avec un niveau, ou rattachée à un jalon.

## Niveaux de tâche et modèles

Le niveau est fixé au cadrage. C'est lui qui choisit l'agent de dev.

| Niveau | Exemples | Agent de dev |
|---|---|---|
| `niveau:trivial` | Renommage, config, doc, correction évidente | `dev-haiku` (Haiku 5.5) |
| `niveau:standard` | Fonctionnalité qui suit un modèle existant, avec tests | `dev-sonnet` (Sonnet 5.5) |
| `niveau:critique` | Contrat core/satellites, sécurité, OAuth Google, mémoire, refonte transverse, bug difficile | `dev-opus` (Opus 5.5, effort élevé) |
| `niveau:exceptionnel` | Opus a échoué, ou décision d'architecture pour tout l'écosystème | `dev-fable` (Fable 5), **sur demande explicite de CrOliX uniquement** |

Rôles fixes :

| Agent | Modèle | Rôle |
|---|---|---|
| Session principale | Opus 5.5 | Cadrage, plan, contrôle |
| `plan-challenger` | Opus 5.5 | Attaque le plan, ne code pas |
| `explorer` | Haiku 5.5 | Lecture et recherche, sans modification |
| `reviewer` | Sonnet 5.5 | Revue du diff contre la tâche et les standards |

La mesure qui compte est le **coût par tâche terminée**, pas le coût par appel : une tâche difficile
ratée par un petit modèle puis refaite coûte plus cher que le bon modèle du premier coup.

## Outils sans IA d'abord

Tout ce qu'un outil fait de façon fiable (format, lint, typage, tests, changelog, release) ne passe
jamais par un LLM. Les hooks locaux et la CI s'en chargent.

## Économie de contexte

- `CLAUDE.md` court dans chaque projet (100 lignes max).
- Les standards se chargent via les skills, au moment où la tâche les demande.
- Les sous-agents travaillent dans leur propre contexte et ne renvoient qu'un résumé.

## Mesure

Deux semaines de mesure de la consommation à partir de la mise en service du plugin :

- outil : `npx ccusage@latest daily` (lit les journaux locaux de Claude Code) ;
- une issue lun-docs « Mesure de consommation » porte la date de début et les relevés ;
- à la fin : décision chiffrée (passer à Max, ajouter une API, ajuster la grille des niveaux).

Aucun achat d'abonnement ou d'API avant cette décision. Caveman peut être testé pendant la mesure,
uniquement sur les rapports des sous-agents et la compression des fichiers mémoire, **jamais** sur ce
qui est destiné à CrOliX.
