# Le kit : la carte de décision apprend `fields` et `importance`, et le groupe « Tout valider ». Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-docs#222, `niveau:standard`. K1 de la carte des flux (lun-docs#216, § 11). Il passe
> avant le chantier des propositions au core, qui en a besoin.
>
> **État : rédigé le 25/11**, sur les réponses de CrOliX du 25/11 portées dans l'issue. À contester, puis à valider.
>
> Code relu sur `main` : lun-docs (`95a52fa`), Lun'Luxuria (`98eaf36`), Lun'Acedia (`29f63e0`, en référence
> seulement). Lun'Anima (`c7d5325`) est privé : ce plan n'en dit que le comportement
> ([`securite.md`](../../standards/securite.md), « Dépôts publics »). Le graphe d'abord, puis chaque fichier.

**But :** la carte du kit montre ce que le contrat 1.5 ajoute à `Card`. Elle dit « Urgent » quand il le faut. Elle se
corrige en place, dépliée, et rend `values` à l'app. Un composant nouveau valide d'un geste les cartes `bulk`, s'ouvre,
et laisse partir seule une carte corrigée. Rien n'est branché dans le core ni dans Acedia.

**Source :** l'issue lun-docs#222 et les réponses de CrOliX du 25/11 ; la spec de la
[carte des flux](../specs/2026-11-25-carte-des-flux-design.md), D5 ; le [contrat](../../standards/contrat-satellite.md)
1.5 (`Card`, `CardField`, `values`, règles des cartes et de la correction, `:52`, `:53`, `:110`, `:112`) ; le
[dictionnaire](../../standards/dictionnaire.md) (« la validation groupée », `:50` ; « le lot » est pris, `:89`) ;
[`ecriture.md`](../../standards/ecriture.md) ; [`design.md`](../../standards/design.md) (« Ergonomie »,
« Vérification avant toute PR de front »).

**Critères de fin** (ceux de l'issue, figés), chacun prouvé en local :

1. Une carte qui porte des `fields` montre chaque valeur proposée. Tâches 0 et 1.
2. « Corriger » déplie les choix, et « Valider ainsi » rend `values` (`Record<string, string[]>`) à l'app. Tâches 0, 1.
3. Un champ sans `multiple` garde exactement un choix. Un champ `multiple` en accepte zéro ou plusieurs. Tâches 0, 1.
4. Une carte qui reçoit à la fois `fields` et `options` ne montre que les options, et un test le dit. Tâches 0, 1.
5. Une carte `importance: 'urgent'` montre « Urgent ». Les autres paliers ne montrent rien. Tâches 0, 1.
6. Le composant de groupe montre « Tout valider (n) » sur les cartes `bulk` qu'on lui donne, s'ouvre, laisse sortir
   une carte corrigée, et n'accepte jamais une carte qui a `sends` ou `options`. Tâches 0, 2.
7. Clavier : le focus est gardé quand la carte se déplie puis se replie ; les choix s'annoncent (radiogroup, case à
   cocher). Tests de composant. Tâches 0 à 2.
8. Bureau et téléphone (390 px) vus dans la galerie, un cas par état. Tâche 3.
9. Les copies du kit sont resynchronisées dans lun-anima et lun-luxuria, leur CI reste verte, les cartes existantes
   ne changent pas de comportement. Tâches 5 et 6.
10. Les textes suivent `ecriture.md` : le code ne dit ni « je » ni « tu ». Tâches 1 à 3.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-docs` : ce plan, le kit, la galerie (tâches 0 à 4) | `docs/plan-kit-decision` | lun-docs#222 | `standard` |
| `lun-anima` : la copie du kit (tâche 5) | dans l'issue privée | à ouvrir dans lun-anima | `trivial` |
| `lun-luxuria` : la copie du kit (tâche 6) | `chore/sync-kit-decision` | lun-docs#222 | `trivial` |

**Trois PR, une par dépôt, dans cet ordre.** La CI des deux satellites compare leur copie au kit de `main` de
lun-docs, cloné à chaque passage (`lun-luxuria/.github/workflows/ci.yml:33`). Leur étape du kit ne passe au vert
qu'une fois la PR de lun-docs fusionnée, comme pour lun-luxuria#109. Donc : lun-docs d'abord ; puis lun-anima et
lun-luxuria, en parallèle, régénérées depuis `main` à jour. Elles peuvent s'ouvrir en brouillon avant.

**Le niveau.** `standard`, celui de l'issue : deux composants du kit suivent un modèle existant (la feuille de
`DecisionCard`), avec leurs tests. Les copies ne sont que du code généré.

## Ce que le code fait aujourd'hui

### La carte (`design/kit/DecisionCard.svelte`)

- Props (`:17-73`) : `tone`, `kind`, `meta`, `title`, `icon`, `level`, `lines`, `reason`, `note`, `status`,
  `doneText`, `lineText`, `error`, `busy`, `off`, `options`, `acceptLabel`, `shortcuts`, `narrow`, sept fonctions de
  geste, trois snippets. Aucune trace de `fields`, `importance` ni `bulk`.
- En attente, c'est un `article` (`:113`) : sourcil (`kind` puis `meta`, `:114-119`), titre, `children` ou `lines`
  (`:123-129`), « Pourquoi » (`:130`), erreur en `alert` ou note (`:131-139`), puis les gestes (`:140-178`).
- `options` remplace « Valider » par un bouton par réponse (`:144-152`). « Modifier » n'est que `onedit` : l'app
  ouvre sa propre édition (`:163-165`).
- `locked` (`busy` ou `off`) désactive les gestes, sauf « Valider » qui tourne (`:109`, `:154-161`).
- Un statut final replie la feuille en une ligne ; « Annuler » y reprend une décision (`:180-203`).
- Aucune gestion du focus. Aucun texte en « je » ou « tu ».
- Tests : `DecisionCard.test.ts`, quinze cas, en attente et tranchée.

### Autour de la carte

- `PermissionCard.svelte` dessine la même feuille par `DecisionCard`, ton `accent`, ses gestes en `actions` (`:70-102`).
  Il ne passe ni `fields` ni `importance` : il ne doit pas bouger.
- `Chip.svelte` est un bouton à bascule : il pose toujours `aria-pressed={on}` après les attributs reçus (`:26`). Il
  ne peut donc pas servir de bouton radio tel quel. Aucun test ne le garde.
- `Checkbox.svelte` est la case de bits-ui, avec son libellé visible (`:7-21`) : rôle `checkbox`.
- `Segmented.svelte` est un `ToggleGroup` de bits-ui à choix unique (`:40-79`) : rôle `group`, pas `radiogroup`.
  bits-ui a aussi un `RadioGroup` (rôles `radiogroup` et `radio`, `aria-checked`, flèches), que le kit n'emploie pas.
- `Badge.svelte` : pastille de texte, tons de `types.ts:8` dont `attention`.
- `index.ts` n'exporte ni `DecisionCard` ni `PermissionCard` : chaque app les importe par leur fichier.
- `types.ts` n'a ni `CardField` ni palier. Les trois tsconfig (kit, Lun'Anima, Lun'Luxuria) chargent `vite/client` :
  `import.meta.env.DEV` y est typé.

### La galerie (`design/galerie/`)

- `sections/Cartes.svelte` : les quatre sortes, « En attente », « Tranchée », la permission, la file de 54 cartes.
  Chaque `Piece` porte `nom` et `etat`.
- `cartes.ts` : `CarteDemo` (`:5-19`) sans `fields`, `importance` ni `bulk`.
- `inventaire.ts` : `DecisionCard` et `PermissionCard` sont communs, absents d'Acedia et d'Avaritia (`:33-39`, `:124`).
- `galerie.test.ts:22-62` exige que chaque `.svelte` du kit soit montré par la page et soit commun dans l'inventaire.
  Un composant nouveau qui manque à l'un des deux fait échouer la galerie.

### La copie du kit (`tools/sync-kit.mjs`)

- Copie tout `design/kit/`, tests compris, avec un en-tête (`:12-16`, `:26-44`). `--check` échoue sur un fichier
  manquant, différent ou en trop (`:41-42`). Un fichier nouveau du kit s'ajoute sans toucher l'outil.
- Lun'Luxuria : copie dans `src/lib/ui`, hors Prettier et ESLint, vérifiée en CI. Aucun écran ne s'en sert pour la
  carte en dehors de la copie.
- Lun'Anima : une copie vérifiée de même. La file du core l'emploie pour sa ligne dépliée, sans `fields` ni
  `importance`. Elle ferme cette ligne sur Échap, sauf si l'événement est déjà pris (`defaultPrevented`).

### La référence d'Acedia (`lun-acedia/views/src/lib/mail/Pending.svelte`)

Lue pour l'interaction, rien n'en est repris. « Tout valider » prend la liste des cartes `bulk` en un appel, un seul
toast, une seule annulation (`:216-265`). Après un geste, le focus va sur la carte suivante (`:182-189`). Sa
correction s'ouvre dans un panneau par-dessus : CrOliX l'a écartée pour la carte du kit.

## Les choix

- **Le nom : `DecisionGroup`.** Il dit ce qu'il groupe, à côté de `DecisionCard`. « Lot » et `Batch` sont écartés :
  le dictionnaire réserve « le lot » à la bibliothèque. Il vit dans `design/kit/DecisionGroup.svelte`, importé par son
  fichier comme `DecisionCard`, hors de `index.ts`.
- **« Tout valider (n) » appelle l'app une fois, avec la liste.** Un geste de CrOliX fait un appel : l'app en tire
  un toast, une annulation et une ligne du Journal, comme Acedia (`Pending.svelte:257-265`). Elle envoie ensuite la
  suite de `accept` que le contrat prévoit (`contrat-satellite.md:112`), à son rythme. Un appel par carte lui ferait
  recoller le geste.
- **Une carte refusée par le groupe** (`sends`, `options` non vide, ou sans `bulk`) **n'est ni montrée ni comptée,
  et un avertissement part en dev** (`console.warn` sous `import.meta.env.DEV`, une fois par `id`). Sans bruit, l'app
  perdrait une carte sans le savoir ; une erreur casserait l'écran pour une donnée du poste. Le contrat interdit déjà
  ce cas (`:110`) : l'avertissement signale un poste ou une app fautifs.
- **`values` porte tous les champs**, chacun avec ses choix du moment, même inchangés. Le contrat l'accepte (une clé
  présente vaut, `:112`). La carte ne juge pas ce qu'est une correction : le poste compare s'il veut mesurer.
- **Le choix unique est un `RadioGroup` de bits-ui dessiné en `Chip`.** C'est le seul rôle `radiogroup` à portée.
  `Chip` change d'une ligne de comportement : avec un `role` explicite, il ne pose plus `aria-pressed`. Sans `role`,
  rien ne change. Les choix multiples sont des `Checkbox` du kit.
- **« Urgent » est un `Badge` ton `attention`, en tête du sourcil**, avant `kind`. Le filet garde le ton de l'app.

## La carte, ce qui s'ajoute

Props nouvelles, toutes optionnelles. Une app qui n'en passe aucune voit sa carte inchangée : les tests existants
restent tels quels.

| Prop | Type | Comportement |
|---|---|---|
| `importance` | `CardImportance` | `'urgent'` : « Urgent » en tête. Autre palier ou absent : rien. |
| `fields` | `CardField[]` | Montre chaque champ. Ignoré si `options` est non vide. |
| `oncorrect` | `(values: Record<string, string[]>) => void` | Sans elle, pas de « Corriger ». |
| `correcting` | `boolean`, `$bindable`, `false` par défaut | Choix dépliés ; l'app peut ouvrir la correction. |

`CardField` et `CardImportance` vont dans `types.ts` et dans l'export de types de `index.ts`, calqués sur le contrat
(`contrat-satellite.md:39`, `:53`) : `CardImportance` vaut `'urgent' | 'normal' | 'low' | 'info' | 'log'` ;
`CardField` vaut `{ name; label; value: string[]; choices: { value; label }[]; multiple?: true }`.

**Comportement.**

- **Les valeurs proposées** : après le corps (`children` ou `lines`), avant « Pourquoi », une liste de paires (`dl`) :
  le `label` du champ, puis les libellés des choix de `value`, séparés par une virgule. Un champ `multiple` vide dit
  « aucun choix ». Une valeur hors des `choices` s'affiche telle quelle.
- **« Corriger »** (secondaire) suit « Valider », avant « Modifier », si `fields` est non vide, `options` vide et
  `oncorrect` donnée. `locked` le désactive. Il porte `aria-expanded` et `aria-controls`.
- **Dépliée** : la liste de paires laisse la place aux choix, dans la carte. Un champ sans `multiple` : un
  `radiogroup` nommé par son `label`, une pastille par choix, exactement un choix. Un champ `multiple` : un `group`
  nommé par son `label`, une case par choix, zéro ou plusieurs. Les choix partent de `value`. Les gestes de la carte
  laissent la place à deux : « Valider ainsi » (principal) et « Annuler » (fantôme).
- **« Valider ainsi »** replie et appelle `oncorrect(values)`, tous les champs présents. Il est désactivé tant qu'un
  champ sans `multiple` n'a aucun choix (une `value` vide ou hors des `choices`).
- **« Annuler » ou Échap** replie sans rien appeler. Échap est pris (`preventDefault`) pour qu'une app qui ferme
  autre chose sur Échap ne le fasse pas en même temps. Les choix en cours sont gardés tant que la carte vit.
- **`fields` et `options` ensemble** : seules les options se montrent, ni valeurs ni « Corriger ».
- **Texte** : « Urgent », « Corriger », « Valider ainsi », « Annuler », « aucun choix ». Ni « je » ni « tu ».

**Focus.** « Corriger » met le focus sur le choix coché du premier champ, ou sa première case. « Annuler » et Échap
le rendent à « Corriger ». « Valider ainsi » le met sur l'`article` (qui prend `tabindex="-1"` si l'app n'en donne
pas) : « Corriger » peut être désactivé par `busy` juste après.

## Le groupe, `DecisionGroup`

| Prop | Type | Comportement |
|---|---|---|
| `title` | `string` | Titre du groupe, au niveau `level`. |
| `level` | `2 \| 3 \| 4 \| 5`, `3` par défaut | Niveau du titre ; les cartes prennent le suivant. |
| `cards` | `GroupCard[]` | Les cartes en attente que l'app propose au groupe. |
| `open` | `boolean`, `$bindable`, `false` par défaut | Cartes montrées. |
| `busy` | `boolean` | « Tout valider » tourne, les corrections attendent. |
| `off` | `string` | Lecture seule : les gestes restent en vue, désactivés, sous cette ligne. |
| `onaccept` | `(ids: string[]) => void` | « Tout valider (n) » : un appel, les `id` encore dans le groupe. |
| `oncorrect` | `(id: string, values: Record<string, string[]>) => void` | Une carte corrigée, qui part seule. |

`GroupCard` reprend de la carte du contrat ce que la feuille montre : `id`, `title`, `kind`, `meta`, `lines`,
`reason`, `importance`, `fields`, `bulk`, `sends`, `options`. Il est exporté avec les autres types.

**Comportement.**

- Le groupe ne prend que les cartes `bulk` sans `sends` ni `options`. Les autres : ni montrées, ni comptées, un
  `console.warn` en dev par `id`. Sans carte prise, il ne dessine rien.
- Une `section` nommée par son titre. En tête : le titre, « Tout valider (n) » (principal, `loading` sous `busy`) et
  une bascule « Voir les cartes » ou « Replier » (fantôme, `aria-expanded`, `aria-controls`).
- Ouvert : une `DecisionCard` par carte, avec ses valeurs et « Corriger », sans « Valider » ni « Refuser » : le
  groupe valide.
- « Valider ainsi » sur une carte : elle sort aussitôt du groupe et du compte, `oncorrect(id, values)` part. Le groupe
  garde la liste des sorties tant qu'il vit ; l'app peut aussi retirer la carte de `cards`.
- `n` compte les cartes prises, moins les sorties. « Tout valider » ne passe jamais une carte sortie.

**Focus.** La bascule garde le focus. « Tout valider » le garde (`aria-disabled` pendant `busy`, `Button.svelte:49`).
Une carte qui sort le donne à la bascule.

## Tâches

**Barrières de chaque tâche**, dans `design/` : `npm test`, `npm run typecheck`, `npm run format:check`,
`npm run build`. À la racine : `npm test` et `npm run check`. Les tests s'écrivent d'abord et sont rouges sur `main`
([`workflow.md`](../../standards/workflow.md)).

0. - [ ] **Les tests d'abord** (`testeur`). **D'abord.** Deux fichiers, que deux testeurs peuvent écrire en
   parallèle : ils ne dépendent que de ce plan.
   - `design/kit/DecisionCard.test.ts`, cas ajoutés, rouges sur `main` :
     - `fields` : chaque `label` et le libellé de chaque valeur se lisent ; un `multiple` vide dit « aucun choix » ;
     - « Corriger » absent sans `oncorrect`, sans `fields`, ou avec `options` (et seules les options se montrent) ;
     - « Corriger » : `aria-expanded` passe à `true`, un `radiogroup` par champ unique, un `group` de `checkbox` par
       champ `multiple`, nommés par leur `label`, choix partis de `value` ;
     - unique : cliquer une autre pastille la coche et décoche la première ; la flèche change le choix ;
     - multiple : tout décocher puis « Valider ainsi » rend `[]` ; deux cases cochées rendent les deux ;
     - « Valider ainsi » appelle `oncorrect` une fois, avec tous les champs ; désactivé si un unique n'a aucun choix ;
     - « Annuler » et Échap : replié, `oncorrect` jamais appelé, focus sur « Corriger », Échap `defaultPrevented` ;
     - focus à l'ouverture sur le choix coché du premier champ ; après « Valider ainsi », sur l'`article` ;
     - `importance: 'urgent'` montre « Urgent » dans le sourcil ; `normal`, `low`, `info`, `log` et absent, rien ;
     - aucune pastille de choix ne porte `aria-pressed`.
   - Gardes, vertes sur `main` : les quinze cas existants, inchangés ; `PermissionCard.test.ts`, inchangé.
   - `design/kit/DecisionGroup.test.ts`, nouveau, rouge sur `main` :
     - trois cartes `bulk` : « Tout valider (3) », une `section` nommée par le titre, fermé par défaut ;
     - une carte avec `sends`, une avec `options`, une sans `bulk` : ni montrées, ni comptées, un `console.warn` par
       `id` (espionné) ;
     - « Tout valider » appelle `onaccept` une fois, avec les trois `id` ;
     - la bascule ouvre (`aria-expanded`), montre les cartes et leur « Corriger », sans « Valider » par carte ;
     - une carte corrigée : `oncorrect(id, values)`, elle disparaît, « Tout valider (2) », puis `onaccept` sans elle ;
       focus sur la bascule ;
     - `busy` : le bouton tourne et garde le focus ; `off` : tout désactivé, la ligne lue ; zéro carte : rien.
   - Exclu : tout code de production.
1. - [ ] **La carte** (`dev-front`). **Après la tâche 0.**
   - Fichiers : `design/kit/DecisionCard.svelte`, `Chip.svelte`, `types.ts`, `index.ts` (types seuls).
   - Comportement : « La carte, ce qui s'ajoute », ci-dessus. `Chip` : avec un `role` donné, pas d'`aria-pressed`.
   - Preuve : les tests de la tâche 0 pour la carte, verts ; les gardes, vertes ; les barrières.
   - Exclu : le groupe, la galerie, `PermissionCard`, un nouveau geste au contrat, une fenêtre par-dessus.
2. - [ ] **Le groupe** (`dev-front`). **Après la tâche 1, dans le même worktree** : il emploie la correction de la
   carte.
   - Fichier : `design/kit/DecisionGroup.svelte` (et son type dans `types.ts`).
   - Comportement : « Le groupe, `DecisionGroup` », ci-dessus.
   - Preuve : `DecisionGroup.test.ts` vert ; les barrières.
   - Exclu : refuser ou repousser une carte du groupe, un état par carte (l'app retire une carte tranchée de `cards`),
     un seuil, un raccourci clavier.
3. - [ ] **La galerie** (`dev-front`). **Après la tâche 2.** Les données de `cartes.ts` peuvent s'écrire en parallèle
   des tâches 1 et 2.
   - `design/galerie/cartes.ts` : `CarteDemo` prend `importance`, `fields`, `bulk`. Des champs inventés : « Boîte »
     (unique : Factures, Banque, Achats) et « Étiquettes » (multiple : À payer, Pro, Perso). Quatre rangements `bulk`.
   - `design/galerie/sections/Cartes.svelte`, un `Piece` par état :
     - `DecisionCard` : « avec champs », « correction ouverte » (`correcting`), « urgente » ;
     - `DecisionGroup` : « fermé », « ouvert », « occupé », « lecture seule ».
   - `design/galerie/inventaire.ts` : `DecisionGroup` commun, famille `cartes`, absent d'Acedia et d'Avaritia.
   - Preuve : `galerie.test.ts` vert sans y toucher. Dans Chrome (`npm run galerie`) : 1440 px, 390 px (émulation ou
     Chrome sans interface), une hauteur de 630 px, les cinq mondes ; à 390 px les pastilles passent à la ligne, rien
     ne déborde. Captures dans la PR, sans donnée réelle.
   - Exclu : réécrire les sections existantes.
4. - [ ] **La revue et la PR de lun-docs** (`reviewer`, puis `livreur`). **Après la tâche 3.**
   - Une PR : ce plan, le kit, la galerie. Titre `feat(kit): …`.
5. - [ ] **La copie de Lun'Anima** (`dev-front`). **Après la fusion de la PR de lun-docs. En parallèle de la tâche 6.**
   - Le dossier, la commande et les gardes sont dans l'issue privée de lun-anima, à ouvrir.
   - Preuve : la vérification du kit répond `kit: OK` ; les barrières de Lun'Anima vertes ; la file du core se
     comporte comme avant (ses tests, inchangés) ; Échap y ferme toujours la ligne dépliée.
   - Exclu : brancher `fields`, `importance` ou le groupe dans le core.
6. - [ ] **La copie de Lun'Luxuria** (`dev-front`). **Après la fusion de la PR de lun-docs. En parallèle de la
   tâche 5.**
   - `node <lun-docs>/tools/sync-kit.mjs src/lib/ui`, depuis `main` de lun-docs à jour. Branche
     `chore/sync-kit-decision`, titre `chore: sync the kit's decision card from lun-docs`.
   - Preuve : `sync-kit.mjs --check src/lib/ui` répond `kit: OK` ; `npm run format:check`, `lint`, `typecheck`,
     `test`, `build` verts ; la CI verte.
   - Exclu : tout écran de Lun'Luxuria.

**L'ordre et le parallèle.** Tâche 0 seule d'abord, ses deux fichiers en parallèle. Les tâches 1, 2, 3 par un seul
`dev-front`, dans le worktree de lun-docs : 2 et 3 touchent ce que 1 pose. Les données de la galerie peuvent partir
avant. Puis la revue et la PR. Après la fusion, les tâches 5 et 6 en parallèle, une PR chacune.

## Hors périmètre

- Le branchement dans le core : le chantier des propositions au core.
- L'écran « À valider » d'Acedia, qui garde le sien. Acedia et Avaritia n'ont pas de copie de la carte.
- La mesure et le seuil par boîte, le seuil de validation groupée.
- Un geste de plus au contrat, un raccourci clavier pour corriger ou tout valider.
- Refuser une carte depuis le groupe ouvert (question pour CrOliX ci-dessous).
- Une marque pour les paliers `normal`, `low`, `info`, `log`.
- `PermissionCard`, qui ne change pas.

## Limites

- **Les pastilles font 28 px de haut** (`Chip.svelte:38`), sous les 44 px d'une cible tactile. Le kit les garde ainsi
  partout ; ce chantier ne les change pas.
- **Le groupe se fie à l'app pour une carte tranchée** : il n'en montre pas le statut, l'app la retire de `cards`.
- **`values` ne dit pas ce qui a changé** : le poste compare à sa proposition s'il veut compter les corrections.
- **Le `RadioGroup` de bits-ui n'a pas été essayé avec `Chip`** : sa forme par `child` est à confirmer à la tâche 1.
- **L'avertissement de dev ne se voit qu'en console** : une app en prod ne dit rien d'une carte écartée.

## Questions pour CrOliX

1. **Refuser depuis le groupe ouvert.** D5 ne parle que de corriger. Faut-il un « Refuser » par carte dans le groupe,
   qui la sort comme une correction ? Ce plan dit non : elle se refuse à l'unité.
2. **Le groupe fermé** ne montre que son titre et ses deux gestes. Faut-il y lire quelques titres des cartes ?
