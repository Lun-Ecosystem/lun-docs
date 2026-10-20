---
name: lun-chantier
description: Use when starting, executing or closing any piece of work (chantier) in a Lun' project - from a GitHub issue to a merged PR. Freezes scope, sets the level label, routes to the right dev agent and requires local proof.
---

# Chantier Lun'

La méthode complète est dans `references/workflow.md`, les règles dans `references/essentiel.md`.
Ce skill s'appuie sur superpowers ; il ne le remplace pas.

## Ouvrir

1. Lis l'issue (`gh issue view <n>`). Reformule le besoin à CrOliX.
2. Écris les **critères de fin**, vérifiables en local. Fixe le **niveau** avec CrOliX et pose
   l'étiquette : `gh issue edit <n> --add-label niveau:<trivial|standard|critique|exceptionnel>`.
3. Le périmètre est **figé** à partir d'ici.
4. Cadrage et plan : `superpowers:brainstorming` si le besoin n'est pas clair, puis
   `superpowers:writing-plans`. Fais attaquer le plan par l'agent `plan-challenger`, intègre ou
   réfute ses objections, puis CrOliX valide. **Pas de code avant.**

## Exécuter

- Partir de `main` à jour, puis créer la branche du chantier, jamais `main` :
  `git switch main && git pull --ff-only && git switch -c <type>/<sujet>`. Ne pas rester sur la
  branche d'un chantier précédent. (`git pull --ff-only` plutôt que `git checkout main && git pull` :
  le mode auto de Claude Code prend parfois ce dernier pour un merge.)
- **Une seule branche et une seule PR pour tout le chantier** (`references/git.md`) : chaque tâche du
  plan est un ou plusieurs commits sur cette branche, jamais une branche poussée ni une PR à part.
  Des worktrees locaux pour des tâches parallèles, fusionnés dans la branche du chantier, au besoin.
  La PR s'ouvre en brouillon au premier push (`lun-livrer`).
- Agent de dev selon l'étiquette : `niveau:trivial` → `dev-haiku`, `niveau:standard` → `dev-sonnet`,
  `niveau:critique` → `dev-opus`. **`dev-fable` uniquement si CrOliX le demande explicitement dans
  la conversation**, même avec `niveau:exceptionnel` (sinon : `dev-opus`, et le signaler).
- Après chaque tâche : agent `reviewer` sur le diff. Corrige les points bloquants.
- Une observation hors périmètre devient une issue `inbox`
  (`gh issue create --label inbox --title "…" --body "…"`), **sauf** si elle empêche d'atteindre les
  critères de fin.

## Clore

- Chaque critère de fin est **prouvé en local**, de bout en bout, par une commande ou une capture.
- `superpowers:verification-before-completion` avant d'annoncer que c'est fini.
- Livraison avec `lun-livrer`. CrOliX merge.
