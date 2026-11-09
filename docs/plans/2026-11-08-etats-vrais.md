# Des états qui disent vrai. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** chaque écran dit ce qui est (`design.md`, « Honnêteté »). Les écarts vus par l'audit (§ 4.2, point 3) et par
la recette du 08/11 se ferment.

**Source :** [audit du 08/11](2026-11-08-audit-ecosysteme.md), § 4.2 ;
[feuille de route](2026-11-07-feuille-de-route-mvp.md), chantier J.

**Livré :** lun-anima#81, lun-acedia#59 et lun-avaritia#24, le 09/11.

**Cadre :** aucun code avant la validation de ce plan par CrOliX. Niveau `standard`, *Show* : tout se prouve sur le
laptop, sur des bases de démo. Une PR par dépôt ; elles ne dépendent pas l'une de l'autre, ni de celles de K.

| Dépôt, branche | Issues | Niveau |
|---|---|---|
| `lun-anima`, `fix/etats-vrais` | lun-anima#74, lun-anima#73 | `standard` |
| `lun-acedia`, `fix/etats-vrais` | lun-acedia#56 | `standard` |
| `lun-avaritia`, `fix/etats-vrais` | lun-avaritia#21 | `standard` |

## Contraintes

- Un test d'abord pour chaque comportement changé ; barrières de chaque dépôt vertes (`format:check`, `lint`,
  `typecheck`, `test`, `build`).
- Aucun changement de contrat ni de schéma de base : `routine_runs.reason` existe déjà.
- Textes de l'écran en français ; aucun « core » chez un satellite.

## Tâches

### lun-anima

1. **Une routine faite sans le modèle le dit** (lun-anima#74). `runNight` et `runMorning` finissent `ok` quand aucun
   fournisseur n'est en service : contexte chaud, portrait, tempérament et scènes le notent au journal du serveur,
   jamais à l'écran. **[choix Claude]** La routine reste `ok`, avec la raison « sans le modèle » ; l'Atelier dit
   « faite 05:00, sans le modèle », le Journal « Fait · sans le modèle ». Un jour de veille qui demandait le modèle
   échoue déjà, et le dit.
   - [x] Tests : sur une base sans clé, les deux routines finissent `ok` avec cette raison ; avec une clé, sans raison.
   - [x] `endRun` garde la raison d'un passage `ok` ; `journalRun`, `Routines.svelte` et `MotConstellation.svelte`
     l'affichent.
2. **Un échec dit une fois.** Le Journal montre « Veille de la nuit : en échec » (l'événement `routine.failed`, fait
   pour le téléphone) puis « Veille de la nuit · Échoué » (le passage).
   - [x] Test : un passage en échec laisse une entrée au Journal, et l'événement part toujours vers le téléphone
     (`journalEvent` passe `routine.failed`).
3. **La mise en route compte juste.** « 3 réglages avant de commencer » compte les quatre premiers rangs, « 1 sur 6 »
   les six, alors que l'écran cède la place au Bureau dès les quatre faits. **[choix Claude]** La section compte les
   mêmes quatre (« 1 sur 4 ») ; les deux derniers rangs se disent facultatifs.
   - [x] Test du composant : les deux nombres s'accordent, à chaque étape.
4. **Relier un poste dit vrai** (lun-anima#73, ses quatre critères).
   - [x] La section s'appelle « Appareils et applications », comme chez Acedia et Avaritia.
   - [x] Rien ne se décompte avant qu'un code soit saisi ; la durée annoncée est celle que le poste affiche.
   - [x] Une étape n'est cochée qu'une fois faite.
   - [x] Le champ propose et accepte `http://localhost:<port>` pour un poste local.

### lun-acedia

5. **Le pied de la barre sans fournisseur** (lun-acedia#56).
   - [x] Un état de service de plus, quand aucun fournisseur n'est en service : « Tri par les règles », détail
     « Aucun fournisseur d'IA en service », les mots de Réglages. Dans `status.ts` et la copie de `ServiceCard`.
   - [x] Tests de `status.ts` : sans fournisseur, avec un fournisseur, clé refusée.
6. - [x] Le badge du site, lien mort, retiré du README (feuille de route, C3).

### lun-avaritia

7. **Le pied de la barre sans fournisseur** (lun-avaritia#21).
   - [x] « Traitement à l'arrêt », détail « Aucune clé de fournisseur d'IA » : sans clé, l'IA ne travaille pas.
   - [x] Tests du calcul de l'état.
8. - [x] Le badge du site retiré du README.

## Preuves

- Les démos de l'audit rejouées : base de recette jetable du core, démos d'Acedia et d'Avaritia ; une capture par écran
  corrigé, à 1440 et 390 px.
- La sortie des barrières de chaque dépôt ; relecture `reviewer` de chaque diff.

## Hors périmètre

- Le kit (`design/kit/ServiceCard.svelte`) prend l'état nouveau avec le chantier M ; Acedia et Avaritia gardent leur
  copie à part jusqu'à lun-docs#43.
- La Constellation montre « Inconnu » environ 15 s avant « Relié » : lecture toutes les 15 s, attendu (lun-anima#73).
