# Méthode de travail

> Comment toute tâche passe du ticket au merge. Le skill `lun-chantier` applique ce standard ;
> superpowers fournit la mécanique (cadrage, plan, revue, vérification).

## Les cinq étapes

1. **Cadrer** (session principale, avec CrOliX). Lire l'issue, reformuler le besoin, écrire les
   **critères de fin**, fixer le **niveau** (étiquette `niveau:*`). Le périmètre est **figé**.
2. **Planifier et challenger.** Un plan court, dans `lun-docs/docs/plans/`
   ([`structure-projet.md`](structure-projet.md)). L'agent `plan-challenger` l'attaque ; ses
   objections sont intégrées ou réfutées par écrit. CrOliX valide. **Aucun code avant ce feu vert.**
3. **Exécuter.** La session principale code, tâche par tâche, tests d'abord quand c'est pertinent,
   en commits sur la branche unique du chantier ; la PR s'ouvre en brouillon dès le premier push.
4. **Valider.** Barrières automatiques (format, lint, typage, tests) en local puis en CI ; relecture
   du diff par l'agent `reviewer` ; **preuve d'usage bout en bout en local**.
5. **Livrer.** *Show* ou *Ask*, selon ce qui porte la preuve ([`git.md`](git.md)). CrOliX merge.

## La règle anti-ajout infini

- Une observation faite pendant un chantier devient une issue `inbox`. Elle n'entre dans le chantier
  **que si elle empêche d'atteindre ses critères de fin**.
- Le chantier se ferme quand ses critères sont remplis **et prouvés en local**. Les points prévus
  passent toujours avant les observations.
- L'inbox se trie **une fois par semaine**, à heure fixe, jamais au fil de l'eau (skill `lun-inbox`).
  Chaque issue est jetée, transformée en chantier futur avec un niveau, ou rattachée à la feuille de
  route.

## Niveaux de tâche

Le niveau est fixé au cadrage. Il dit le soin attendu, pas le modèle qui code.

| Niveau | Exemples | Ce qu'il demande en plus des barrières |
|---|---|---|
| `niveau:trivial` | Renommage, config, doc, correction évidente | Rien |
| `niveau:standard` | Fonctionnalité qui suit un modèle existant | Un test par comportement changé |
| `niveau:critique` | Contrat core/satellites, sécurité, OAuth Google, mémoire, refonte transverse, bug difficile | Les cas limites testés, une preuve bout en bout décrite dans la PR |
| `niveau:exceptionnel` | Échec répété, ou décision d'architecture pour tout l'écosystème | Ce que demande `critique` |

Aucun niveau ne choisit le modèle : Fable ne code que **sur demande explicite de CrOliX**.

Rôles :

| Agent | Modèle | Rôle |
|---|---|---|
| Session principale | Opus 5.5 | Cadrage, plan, code, contrôle |
| `plan-challenger` | Opus 5.5 | Attaque le plan, ne code pas |
| `reviewer` | Opus 5.5 | Relit le diff contre la tâche et les standards, ne code pas |
| `explorer` | Haiku 5.5 | Lecture et recherche, sans modification |

## Outils sans IA d'abord

Tout ce qu'un outil fait de façon fiable (format, lint, typage, tests, changelog, release) ne passe
jamais par un LLM. Les hooks locaux et la CI s'en chargent.

## Économie de contexte

- `CLAUDE.md` court dans chaque projet (100 lignes max).
- Les standards se chargent via les skills, au moment où la tâche les demande.
- Les sous-agents travaillent dans leur propre contexte et ne renvoient qu'un résumé.
