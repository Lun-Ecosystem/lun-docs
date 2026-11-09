# Les écarts avant la semaine. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** rien de ce que la semaine de rodage juge ne dit faux ni ne passe outre une pause. Les écrans qui mentent
encore, la pause d'Avaritia, les copies des trois bases, et un test qui rougit au hasard.

**Source :** les issues `inbox` vues pendant les chantiers I, J et K ; proposition de Claude du 09/11, validée par
CrOliX ; [feuille de route](2026-11-07-feuille-de-route-mvp.md), chantier O.

**Cadre :** aucun code avant la validation de ce plan par CrOliX. Niveau `standard`. *Show* : tout se prouve sur le
laptop, sur des bases de démo. Une PR par dépôt ; elles ne dépendent pas l'une de l'autre, ni de celles de L et M.

| Dépôt, branche | Issues | Niveau |
|---|---|---|
| `lun-anima`, `fix/ecarts-avant-semaine` | lun-anima#80, #85, #86, #87, #89 | `standard` |
| `lun-acedia`, `fix/ecarts-avant-semaine` | lun-acedia#60, #58 ; lun-docs#110 pour Acedia | `standard` |
| `lun-avaritia`, `fix/ecarts-avant-semaine` | lun-avaritia#25, #26, #27, #28, #23 ; lun-docs#110 pour Avaritia | `standard` |

## Le tri

Une issue entre ici si la semaine peut la rencontrer : une pause, une clé refusée, un plafond, une copie ratée. Celles
qui ne se voient qu'à l'installation ou après une restauration restent en `inbox`, jusqu'après le MVP (en fin de plan).
lun-avaritia#28 et lun-anima#89 n'en relèvent pas, mais touchent les mêmes fichiers : elles suivent.

## Contraintes

- Un test d'abord pour chaque comportement changé. Les barrières de chaque dépôt restent vertes.
- Aucun changement du contrat entre le core et ses satellites. La santé d'un satellite ne connaît que `ok`,
  `degraded` et `paused`, et une copie ratée ne le met pas « dégradé » : le tri continue.
- Textes de l'écran en français, et aucun « core » chez un satellite.

## Tâches

### lun-anima

1. - [ ] **Un passage sauté ne s'affiche plus « faite »** (lun-anima#80). Le type `Run` de `Routines.svelte` connaît
   `skipped`, et `result()` le dit comme la Constellation (« sautée, en pause »). Test : un créneau sauté pendant une
   pause.
2. - [ ] **La lettre du matin dit le contexte du jour manqué** (lun-anima#85). Quand `composeWarm` rend `failed` alors
   qu'un fournisseur est en service, la routine reste `ok`, car la lettre est écrite. **[choix Claude]** Elle porte la
   raison « sans le contexte du jour », que l'Atelier et le Journal affichent comme « sans le modèle ». Tests : l'échec
   avec un fournisseur, et rien de changé sans fournisseur.
3. - [ ] **La copie du core, sous la forme de celles des satellites** (lun-anima#86, #87 ; le code de lun-acedia#61) :
   - une copie au démarrage puis chaque heure si celle du jour manque, détachée de la veille : une pause ne l'arrête
     plus. La première copie du jour tombe à la première heure après minuit, donc avant la veille de 5 h si le poste
     est allumé ;
   - le nom vient du fichier de la base, et la rotation ne compte que ses propres copies ;
   - un ancien fichier non retiré laisse sa propre ligne, « Ancienne copie non retirée », et se retente à la copie
     suivante. La santé ne dit plus une copie ratée pour autant ;
   - tests repris des satellites : copie lisible et complète, rotation à sept, autre base dans le même dossier,
     fichier tenu ouvert.
4. - [ ] **Le README** (lun-anima#89) : la copie se lit dans le journal du serveur, son échec dans la santé ; la
   restauration renvoie à la page de mise en service de lun-docs, comme les README d'Acedia et d'Avaritia.

### lun-acedia

5. - [ ] **La barre ne dit plus « Tri en pause » pour la clé de l'agent** (lun-acedia#60). `problem`
   (`app/src/shell/status.ts`) ne compte que la clé du fournisseur du tri (`getModelChoice()`). La clé refusée de
   l'agent se dit sur son panneau et dans Réglages, pas dans la barre. Test : la clé de l'agent refusée, le tri actif.
6. - [ ] **Le test « rejects a tampered blob » n'échoue plus au hasard** (lun-acedia#58). Le caractère altéré est
   toujours remplacé par un autre que lui-même. Preuve : 200 lancements de suite, sans un échec.
7. - [ ] **Une copie ratée se voit sans terminal** (lun-docs#110). **[choix Claude]** Acedia la dit sur son propre
   écran : la date de la dernière copie dans Réglages, et une ligne d'attention dans la barre quand la dernière a
   échoué. La santé reste celle du contrat, sans changement : le core n'en voit rien avant le MVP. Tests : la date
   affichée, la ligne après un échec, puis son retrait après une copie réussie.

### lun-avaritia

8. - [ ] **Une note ou un dépôt pendant une pause locale attend** (lun-avaritia#26). **[choix Claude]** Le texte est
   gardé, comme sans fournisseur, puis traité au premier lot qui suit la pause : en pause, rien ne se paie. La réponse
   et la barre disent « gardé, traité à la reprise ». Avant le code, la phrase du `CLAUDE.md` sur la pause (l. 38) est
   reprise avec CrOliX, puisque la copie de la base tourne, elle, même en pause. Tests : déposé pendant la pause, gardé
   et non payé ; la pause levée, traité.
9. - [ ] **La barre relit la santé** (lun-avaritia#25) : `readHealth()` dans le minuteur de 30 s, à côté des compteurs
   et des clés. Test avec un faux minuteur : une pause posée pendant la session se lit sans recharger.
10. - [ ] **Le plafond atteint se dit** (lun-avaritia#27) : la carte passe à « Plafond atteint », avec les mots de
    Réglages, quand la dépense du mois atteint le plafond. Test.
11. - [ ] **Le 503 sans clé dit d'ajouter une clé** (lun-avaritia#28), et plus de choisir un modèle, comme la barre
    depuis lun-avaritia#24. « Aucun modèle choisi » reste pour le cas où une clé existe. Test.
12. - [ ] **Le test « rejects a tampered blob »** (lun-avaritia#23), comme à la tâche 6.
13. - [ ] **Une copie ratée se voit sans terminal** (lun-docs#110), comme à la tâche 7.

### lun-docs, à la clôture

14. - [ ] `architecture-actuelle.md` : la cadence de la copie du core. `mise-en-service-desktop.md`, § 8 : où lire la
    dernière copie de chaque satellite. Le plan coché, sa tête donne les PR qui livrent ; lun-docs#110 se ferme.

## Preuves

- Les barrières de chaque dépôt, et chaque test nommé ci-dessus.
- Sur des bases de démo : une capture par écran changé (l'Atelier, la barre d'Acedia, la barre et Réglages
  d'Avaritia).
- Une copie du core faite pendant une pause de la veille, ouverte avec `node:sqlite`.

## Restent en `inbox`, après le MVP

- lun-anima#82 : le bandeau « Rien ne tourne encore » ne se voit qu'avant la fin de la mise en route, faite à
  l'installation.
- lun-anima#83 : la mise en route au téléphone, faite une fois, à l'installation.
- lun-anima#79 : `CORE_URL` et les commandes du terminal, qui ne servent qu'à l'installation.
- lun-anima#84 : la recherche du Journal par « échec ».
- lun-anima#90 et lun-acedia#62 : ne gênent qu'après une restauration, que la page de mise en service contourne
  déjà.
- lun-docs#109 : le texte des ADR 0001 et 0008.
