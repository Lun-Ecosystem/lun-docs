# Trois chantiers du laptop avant le MVP : la voix de Luxuria, la présence, la garde. Plan

> **Pour les agents d'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

> **Livré** par [lun-luxuria#17](https://github.com/Lun-Ecosystem/lun-luxuria/pull/17) (A),
> [lun-anima#64](https://github.com/Lun-Ecosystem/lun-anima/pull/64) (B) et
> [lun-docs#87](https://github.com/Lun-Ecosystem/lun-docs/pull/87) (C). Cases cochées le 07/11/2026. Ordre de merge : B,
> puis A ; C quand il veut.

**But :** finir sur le laptop ce qui peut l'être avant le MVP, en trois chantiers regroupés au lieu d'une PR par issue.
CrOliX, le 07/11 : « il faut planifier et regrouper ». Le desktop attend (relevés de confiance, RVC à l'oreille,
`/micro` avec Discord) : rien ici n'en dépend.

**Cadre :** issues passées en chantier au tri du 07/11 (lun-docs#73) ou ouvertes depuis par les relectures. Autonomie
donnée par CrOliX le 07/11 : le plan s'exécute après la relecture du plan-challenger, sans attendre de validation.

**Une PR par dépôt, brouillon dès le premier push, un commit ou plus par étape :**

| Chantier | Dépôt, branche | Issues | Niveau |
|---|---|---|---|
| A. Ce que dit la voix de Luxuria | `lun-luxuria`, `fix/voix-et-presence` | lun-luxuria#14, #12 ; client de lun-anima#63 | `standard` |
| B. Présence et Constellation | `lun-anima`, `fix/presence-onglets` | lun-anima#63, #60 | `standard` |
| C. La garde du plugin | `lun-docs`, `feat/garde-et-chantiers-avant-mvp` | lun-docs#2, #23, #33 ; ce plan et ses coches | `standard` |

**Ordre de merge :** B avant A, et un core redémarré sur B avant le premier lancement de A. Le core refuse un champ
inconnu (`z.strictObject`) : un Luxuria qui envoie `tab` à un core sans B reçoit 400 sur sa présence. C est indépendant ; il porte ce plan, et ses coches arrivent en dernier.

**Ce qui est repris :** lun-luxuria#16 (le correctif de #14, CI verte, 10 lancements sur 10), lun-docs#85 (coche du plan
du micro) et #86 (plan de #14, `2026-11-07-refus-sans-coupure.md`) : leurs commits passent tels quels dans A et C, et
les trois PR se ferment avec un renvoi.

## A. Ce que dit la voix de Luxuria (lun-luxuria)

### Critères de fin

1. **#14** : les critères 1 à 5 de `2026-11-07-refus-sans-coupure.md`, déjà prouvés sur lun-luxuria#16 ; le commit est
   repris sans changement.
2. **#12** : en mode seul, ce qui part à la voix (`speech` de `src/local.ts`) perd les marques de markdown : titre,
   citation, puce et numéro en tête de ligne ; `**`, `*`, `__`, `_` d'emphase ; `` ` `` ; un lien `[texte](url)` dit
   son texte. Le fil garde le texte écrit. Une phrase vide une fois nettoyée ne part pas. Les règles reprennent celles du
   core (`core/src/natsume/speech.ts`, `spoken`) sans les repères de cartes, qui n'existent pas en mode seul ; aucun
   code partagé entre les deux dépôts **[choix Claude]** : le dépôt public ne dépend pas du core privé. Preuve :
   `src/local.test.ts`, un flux qui contient chaque marque, dont une emphase à cheval sur deux phrases
   (`**Il pleut.** Prends`) et un numéro de liste seul en tête de ligne, et `speech` ne la contient plus.
3. **#63, côté client** : chaque page tire un identifiant d'onglet (`crypto.randomUUID()`) au chargement du module et
   l'envoie, `tab`, à chaque appel de présence ; pas de `sessionStorage`, qu'un onglet dupliqué copierait. La même page
   rendue par l'historique garde le sien. Preuve : `src/core.test.ts`, le champ part sur `started`, `beat` et
   `stopped`, le même d'un appel à l'autre.
4. `docs/README.md` : la ligne de présence du tableau dit `tab`, et le mode seul dit que la voix ne lit pas le markdown.
5. Barrières vertes : `npm run format:check`, `lint`, `typecheck`, `test`, `build`, et `voix/test_service.py`.

### Tâches

- [x] Branche depuis `main`, reprise du commit de lun-luxuria#16, PR en brouillon ; fermer #16 avec un renvoi.
- [x] Test d'abord, puis `spoken` dans `src/local.ts` (ou un petit `src/spoken.ts` s'il dépasse vingt lignes).
- [x] Test d'abord, puis `tab` dans `src/core.ts` et `src/session.svelte.ts`.
- [x] `docs/README.md`, relecture (agent reviewer), critères cochés et preuves dans la PR, passage en « prête ».

## B. Présence et Constellation (lun-anima)

### Critères de fin

1. **#63** : `POST /api/presence` accepte `tab` (chaîne de 1 à 64 caractères, facultative), et le message 400 le cite.
   La présence range, par onglet, son dernier battement et son `busy`, au plus 8 onglets, le plus ancien battement
   retiré au-delà **[choix Claude]**. Un onglet n'est jamais retiré pour son âge : un laptop sorti de veille reprend
   avec ses battements, comme aujourd'hui, sans recharger la page. Ce qui sépare l'onglet fermé de l'onglet endormi,
   c'est le `stopped` reçu.
   - `started` avec `tab` ajoute l'onglet ; l'accueil ne change pas (rapide si la présence est vivante). Une présence
     neuve garde les onglets de la précédente qui n'ont jamais envoyé `stopped`.
   - `beat` avec `tab` : un onglet connu bat et ranime une présence expirée sans `endedAt`, comme aujourd'hui. Un onglet
     inconnu, quand d'autres sont connus, ne compte pas : c'est le battement en vol d'un onglet fermé. Si aucun onglet
     n'est connu (présence écrite à l'ancien format, avant ce chantier), il est ajouté.
   - `stopped` avec `tab` retire l'onglet. La présence ne finit que si aucun autre onglet n'a battu depuis moins de
     `BEAT_LIMIT_MS`.
   - `busy` vaut vrai si au moins un onglet vivant est occupé : un onglet en arrière-plan n'efface pas l'appel de l'autre.
   - Sans `tab`, rien ne change : un `stopped` sans `tab` finit la présence, même si des onglets avec `tab` vivent.
   Preuve : `presence.test.ts` et un test de route : deux onglets, l'un se ferme, encore présent ; le second se ferme,
   absent ; un battement en vol du premier ne rouvre rien ; veille de plus de 90 s puis battement, présent sans
   `started` ; `busy` d'un seul onglet ; présence en base à l'ancien format puis battement avec `tab` ; sans `tab`,
   l'ancien comportement.
2. **#60** : la Constellation dit « sautée, en pause » seulement si le passage a été sauté pour une pause (`reason` =
   `PAUSED`, que `word.ts` connaît déjà pour `noLetter`), « sautée » sinon. Le core rend la raison avec l'état. Preuve :
   `word.test.ts` (les deux raisons) et `ui/src/natsume/mot/mots.test.ts` (le texte rendu).
3. `README.md` du core ou la doc de la route, si elle décrit le corps de `/presence` : `tab`.
4. Barrières vertes : `npm run format:check`, `lint`, `typecheck`, `test`, `build`.

**#7 sort du chantier :** le 07/11, sous une charge qui occupe les 8 cœurs, `listener.test.ts` seul a passé 20 fois sur
20 et la suite du core 8 fois sur 8. Sans échec avant correctif, un « zéro échec après » ne prouverait rien. La mesure va
dans l'issue, qui reste ouverte jusqu'au prochain échec observé.

### Tâches

- [x] Branche depuis `main`, PR en brouillon au premier push ; la mesure de #7 en commentaire de l'issue.
- [x] #63 : tests d'abord, puis `presence.ts` et `presence-routes.ts`.
- [x] #60 : tests d'abord, puis `word.ts`, `ui/src/types.ts`, `MotConstellation.svelte`.
- [x] Relecture (agent reviewer), critères cochés et preuves, passage en « prête ».

## C. La garde du plugin (lun-docs)

### Critères de fin

1. **#2** : `gh` suivi d'options globales (`-R o/r`, `--repo o/r`, `--repo=o/r`) puis `pr merge` est bloqué.
2. **#23** : `master` est protégée comme `main` : destination d'un `git push` (`master`, `refs/heads/master`,
   `HEAD:master`, `HEAD:refs/heads/master`), et push implicite depuis `master`.
3. **#33** : `gh pr create` et `gh pr edit` avec un titre (`--title x`, `--title=x`, `-t x`, `-tx`) hors de
   l'expression de la CI (`templates/ts/.github/workflows/ci.yml`) sont bloqués, et le message donne l'expression.
   `gh pr create` sans `--draft` ni `-d` est bloqué : `git.md` veut la PR en brouillon dès le premier push **[choix
   Claude]**. Le brouillon se cherche dans toute la commande, pas dans un seul segment : un corps en here-string
   PowerShell qui contient une apostrophe ne doit pas fausser la lecture. `--fill` reste permis (le titre vient d'un
   commit, déjà aux normes), comme `gh pr edit` sans titre (`--body-file`, `--add-label`).
4. Ce qui reste permis l'est toujours : `gh pr view`, `gh pr create --draft --title "fix: x" --body-file b.md`,
   `gh pr ready 3`, `git switch main`, `git branch -D x`, un commit dont le message cite `gh pr merge`. Preuve :
   `plugin/hooks/guard.test.mjs`, un cas par règle, bloqué et permis, dont un `gh pr create` PowerShell réel avec
   here-string.
5. `standards/git.md`, paragraphe « Protection de `main` » : ce que la garde bloque désormais, sans promettre plus
   (`gh api …/merge` ou un alias `gh` passent : le ruleset reste derrière). Copies régénérées (`sync-standards`),
   `npm run check` vert.
6. Ce plan coché, avec les liens des trois PR en tête, dans le dernier commit de la PR.

### Tâches

- [x] Branche depuis `main`, reprise des commits de lun-docs#85 et #86, ce plan ; PR en brouillon ; fermer #85 et #86
      avec un renvoi.
- [x] Tests d'abord, puis `guard.mjs` : options globales de `gh`, `master`, titre, brouillon.
- [x] `standards/git.md` et les copies.
- [x] Relecture (agent reviewer), coches de ce plan quand A et B sont prêts, passage en « prête ».

## Hors périmètre

Ce qui attend le desktop : lun-luxuria#6 (relevé de confiance) et #7 (la phrase jouée en continu), la recette « À
confirmer » de `luxuria-essai/RECETTE.md`. Le corps de PR au gabarit vérifié par la garde (lun-docs#33 le laisse en
piste ; le gabarit reste porté par `lun-livrer`). Les issues gardées après le MVP au tri du 07/11. lun-acedia#30 et le
front, qui demandent un cadrage design avec CrOliX. Le nom des branches vérifié par la garde : `git branch` a trop de
formes légitimes (`-D` que prescrit `git.md`, `--list`, `-m`…) et autant de contournements (`worktree add -b`,
`push HEAD:nom`) ; la revue de PR le voit.
