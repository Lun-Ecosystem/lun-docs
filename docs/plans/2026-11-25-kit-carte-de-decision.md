# Le kit : la carte de décision apprend `fields` et `importance`, et le groupe « Valider ensemble ». Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-docs#222, `niveau:standard`. K1 de la carte des flux (lun-docs#216, § 11). Il passe
> avant le chantier des propositions au core, qui en a besoin.
>
> **État : rédigé le 25/11 ; contesté le 25/11 ; amendé le 25/11** (« Ce que la contestation a changé »), avec la
> réponse de CrOliX sur le groupe. À valider.
>
> Code relu sur `main` : lun-docs (`95a52fa`), Lun'Luxuria (`98eaf36`), Lun'Acedia (`29f63e0`, en référence
> seulement). Lun'Anima (`c7d5325`) est privé : ce plan n'en dit que le comportement
> ([`securite.md`](../../standards/securite.md), « Dépôts publics »). Le graphe d'abord, puis chaque fichier.

**But :** la carte du kit montre ce que le contrat 1.5 ajoute à `Card`. Elle dit « Urgent » quand il le faut. Elle se
corrige en place, dépliée, et rend `values` à l'app. Un composant nouveau, `DecisionGroup`, valide d'un geste les
cartes `bulk` cochées, et laisse partir seule une carte corrigée. Rien n'est branché dans le core ni dans Acedia.

**Source :** l'issue lun-docs#222 et les réponses de CrOliX du 25/11 ; la spec de la
[carte des flux](../specs/2026-11-25-carte-des-flux-design.md), D5 ; le [contrat](../../standards/contrat-satellite.md)
1.5 (`Card`, `CardField`, `values`, règles des cartes et de la correction, `:52`, `:53`, `:110`, `:112`) ; le
[dictionnaire](../../standards/dictionnaire.md) (« la validation groupée », `:50` ; « le lot » est pris, `:89`) ;
[`ecriture.md`](../../standards/ecriture.md) ; [`design.md`](../../standards/design.md) (« Ergonomie »,
« Vérification avant toute PR de front ») ; le groupe « Valider ensemble » de la file du core, décrit par son
comportement.

**Critères de fin** (ceux de l'issue, figés), chacun prouvé en local :

1. Une carte qui porte des `fields` montre chaque valeur proposée. Tâches 0 et 1.
2. « Corriger » déplie les choix, et « Valider ainsi » rend `values` (`Record<string, string[]>`) à l'app. Tâches 0, 1.
3. Un champ sans `multiple` garde exactement un choix. Un champ `multiple` en accepte zéro ou plusieurs. Tâches 0, 1.
4. Une carte qui reçoit à la fois `fields` et `options` ne montre que les options, et un test le dit. Tâches 0, 1.
5. Une carte `importance: 'urgent'` montre « Urgent ». Les autres paliers ne montrent rien. Tâches 0, 1.
6. Le composant de groupe valide d'un geste les cartes `bulk` qu'on lui donne, montre ses cartes, laisse sortir une
   carte corrigée, et n'accepte jamais une carte qui a `sends` ou `options`. Tâches 0, 2. Le libellé « Tout valider
   (n) » de l'issue devient celui du core, « Valider les n … » (réponse de CrOliX, ci-dessous).
7. Clavier : le focus est gardé quand la carte se déplie puis se replie ; les choix s'annoncent (radiogroup, case à
   cocher). Tests de composant. Tâches 0 à 2.
8. Bureau et téléphone (390 px) vus dans la galerie, un cas par état. Tâche 3.
9. Les copies du kit sont resynchronisées dans lun-anima et lun-luxuria, leur CI reste verte, les cartes existantes
   ne changent pas de comportement. Tâches 5 et 6.
10. Les textes suivent `ecriture.md` : le code ne dit ni « je » ni « tu ». Tâches 1 à 3.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-docs` : plan, kit, galerie, `design.md` (tâches 0 à 4) | `docs/plan-kit-decision` | lun-docs#222 | `standard` |
| `lun-anima` : la copie du kit (tâche 5) | dans l'issue privée | à ouvrir dans lun-anima | `trivial` |
| `lun-luxuria` : la copie du kit (tâche 6) | `chore/sync-kit-decision` | lun-docs#222 | `trivial` |

**Trois PR, une par dépôt, dans cet ordre.** La CI des deux satellites compare leur copie au kit de `main` de
lun-docs, cloné à chaque passage (`lun-luxuria/.github/workflows/ci.yml:33`). Leur étape du kit ne passe au vert
qu'une fois la PR de lun-docs fusionnée, comme pour lun-luxuria#109. Donc : lun-docs d'abord ; puis lun-anima et
lun-luxuria, en parallèle, régénérées depuis `main` à jour. Elles peuvent s'ouvrir en brouillon avant.

**Le niveau.** `standard`, celui de l'issue : deux composants du kit suivent un modèle existant (la feuille de
`DecisionCard`, le groupe du core), avec leurs tests. Les copies ne sont que du code généré.

## Ce que le code fait aujourd'hui

### La carte (`design/kit/DecisionCard.svelte`)

- Props (`:17-73`) : `tone`, `kind`, `meta`, `title`, `icon`, `level`, `lines`, `reason`, `note`, `status`,
  `doneText`, `lineText`, `error`, `busy`, `off`, `options`, `acceptLabel`, `shortcuts`, `narrow`, sept fonctions de
  geste, trois snippets. Aucune trace de `fields`, `importance` ni `bulk`. Le reste des attributs (dont `onkeydown`)
  va sur la racine (`:106`, `:113`).
- En attente, c'est un `article` (`:113`). Le sourcil n'existe que si `kind` ou `meta` est donné (`:114-119`). Puis
  le titre, `children` ou `lines` (`:123-129`), « Pourquoi » (`:130`), l'erreur en `alert` ou la note (`:131-139`),
  les gestes (`:140-178`).
- `options` remplace « Valider » par un bouton par réponse (`:144-152`). « Modifier » n'est que `onedit` : l'app
  ouvre sa propre édition (`:163-165`).
- `locked` (`busy` ou `off`) désactive les gestes, sauf « Valider » qui tourne (`:109`, `:154-161`).
- Un statut final replie la feuille en une ligne ; « Annuler » y reprend une décision (`:180-203`).
- Aucune gestion du focus ni du clavier. Aucun texte en « je » ou « tu ».
- Tests : `DecisionCard.test.ts`, quinze cas, en attente et tranchée.

### Autour de la carte

- `PermissionCard.svelte` dessine la même feuille par `DecisionCard`, ton `accent`, ses gestes en `actions` (`:70-102`).
  Il ne passe ni `fields` ni `importance` : il ne doit pas bouger.
- `Chip.svelte` est un bouton à bascule : il pose toujours `aria-pressed={on}` après les attributs reçus (`:26`). Il
  ne peut donc pas servir de bouton radio tel quel. Aucun test ne le garde.
- `Checkbox.svelte` est la case de bits-ui, avec son libellé visible ou `aria-label` (`:7-21`) : rôle `checkbox`.
- `Segmented.svelte` est un `ToggleGroup` de bits-ui à choix unique (`:40-79`) : rôle `group`, pas `radiogroup`.
  bits-ui a aussi un `RadioGroup` (rôles `radiogroup` et `radio`, `aria-checked`, flèches), que le kit n'emploie pas.
- `Badge.svelte` : pastille de texte, tons de `types.ts:8` dont `attention`.
- `Button.svelte` : sous `loading`, `aria-disabled` et non `disabled` (`:47-49`) : le bouton garde le focus.
- `index.ts` n'exporte ni `DecisionCard` ni `PermissionCard` : chaque app les importe par leur fichier.
- `types.ts` n'a ni `CardField` ni palier. Les trois tsconfig (kit, Lun'Anima, Lun'Luxuria) chargent `vite/client` :
  `import.meta.env.DEV` y est typé.

### Le groupe du core, par son comportement

La file du core a déjà un groupe « Valider ensemble ». L'app l'ouvre. Toutes les cartes y sont cochées ; décocher une
carte la laisse à trancher. Le bouton dit « Valider les n … », « Valider la … », ou « Aucune … cochée », désactivé.
L'en-tête invite à décocher une carte pour la laisser à trancher. Un seul geste part, avec un toast et un Annuler. Échap
referme le groupe. Il ne connaît ni `fields` ni la correction. Le kit n'en a pas de copie : l'inventaire le nomme parmi
les éléments propres du core (`design/galerie/inventaire.ts:153`).

### La galerie (`design/galerie/`)

- `sections/Cartes.svelte` : les quatre sortes, « En attente », « Tranchée », la permission, la file de 54 cartes.
  Chaque `Piece` porte `nom` et `etat`.
- `cartes.ts` : `CarteDemo` (`:5-19`) sans `fields`, `importance` ni `bulk`.
- `inventaire.ts` : `DecisionCard` et `PermissionCard` sont communs, absents d'Acedia et d'Avaritia (`:33-39`, `:124`).
- `galerie.test.ts:22-59` exige que chaque `.svelte` du kit soit montré par la page et soit commun dans l'inventaire.
  `galerie.test.ts:64-66` compte deux éléments « absents d'Acedia et d'Avaritia » : un de plus le fait passer à 3.

### La copie du kit (`tools/sync-kit.mjs`)

- Copie tout `design/kit/`, tests compris, avec un en-tête (`:12-16`, `:26-44`). `--check` échoue sur un fichier
  manquant, différent ou en trop (`:41-42`). Un fichier nouveau du kit s'ajoute sans toucher l'outil.
- Lun'Luxuria : copie dans `src/lib/ui`, hors Prettier et ESLint, vérifiée en CI. Aucun écran ne s'en sert pour la
  carte en dehors de la copie.
- Lun'Anima : une copie vérifiée de même. La file du core l'emploie pour sa ligne dépliée, sans `fields` ni
  `importance`. Elle ferme cette ligne sur Échap, sauf si l'événement est déjà pris (`defaultPrevented`).

### Le standard de design

`standards/design.md:118-120` liste les cartes communes : `DecisionCard` et `PermissionCard`. Le fichier tient déjà
ses 150 lignes, la limite de `npm run check`. Il a des copies dans le plugin (`tools/standards-map.json:3`).

### La référence d'Acedia (`lun-acedia/views/src/lib/mail/Pending.svelte`)

Lue pour l'interaction, rien n'en est repris. « Tout valider » prend la liste des cartes `bulk` en un appel, un seul
toast, une seule annulation (`:216-265`). Après un geste, le focus va sur la carte suivante (`:182-189`). Sa
correction s'ouvre dans un panneau par-dessus : CrOliX l'a écartée pour la carte du kit.

## Les choix

- **Le nom : `DecisionGroup`.** Il dit ce qu'il groupe, à côté de `DecisionCard`. « Lot » et `Batch` sont écartés :
  le dictionnaire réserve « le lot » à la bibliothèque. Il vit dans `design/kit/DecisionGroup.svelte`, importé par son
  fichier comme `DecisionCard`, hors de `index.ts`.
- **Un seul groupe, à terme** (réponse de CrOliX). `DecisionGroup` réunit le groupe du core (cases cochées, un geste)
  et la correction de D5. Il remplacera le groupe du core au chantier des propositions au core : il n'y en aura alors
  qu'un.
- **Le geste appelle l'app une fois, avec les cartes cochées.** Un geste de CrOliX fait un appel : l'app en tire un
  toast, un Annuler et une ligne du Journal, comme le core et Acedia (`Pending.svelte:257-265`). Elle envoie ensuite
  la suite de `accept` que le contrat prévoit (`contrat-satellite.md:112`), à son rythme.
- **Une carte refusée par le groupe** (`sends`, `options` non vide, ou sans `bulk`) **n'est ni montrée ni comptée,
  et un avertissement part en dev** (`console.warn` sous `import.meta.env.DEV`, une fois par `id` et par instance).
  Sans bruit, l'app perdrait une carte sans le savoir ; une erreur casserait l'écran pour une donnée du poste. Le
  contrat interdit déjà ce cas (`:110`).
- **`values` ne porte que les champs changés.** Une clé absente garde `value` (`:112`) : `values` dit exactement la
  correction, et le poste n'a rien à comparer.
- **Le choix unique est un `RadioGroup` de bits-ui dessiné en `Chip`**, si l'essai de la tâche 1 le permet. C'est le
  seul rôle `radiogroup` à portée. Le repli est écrit d'avance (tâche 1). Les choix multiples sont des `Checkbox`.
- **« Urgent » est un `Badge` ton `attention`, en tête du sourcil**, avant `kind`. Le filet garde le ton de l'app.
- **Le texte d'invite est à l'infinitif** : « Décocher une … pour la laisser à trancher. » Celui du core dit
  « Décoche », un « tu » que `ecriture.md:14` et le critère 10 interdisent au code.

## La carte, ce qui s'ajoute

Props nouvelles, toutes optionnelles. Une app qui n'en passe aucune voit sa carte inchangée : les tests existants
restent tels quels.

| Prop | Type | Comportement |
|---|---|---|
| `importance` | `CardImportance` | `'urgent'` : « Urgent » en tête. Autre palier ou absent : rien. |
| `fields` | `CardField[]` | Montre chaque champ. Ignoré si `options` est non vide. |
| `oncorrect` | `(values: Record<string, string[]>) => void` | Sans elle, pas de « Corriger ». |
| `correcting` | `boolean`, `false` par défaut | État initial, lu au montage : la carte s'ouvre dépliée. |

`CardField` et `CardImportance` vont dans `types.ts` et dans l'export de types de `index.ts`, calqués sur le contrat
(`contrat-satellite.md:39`, `:53`) : `CardImportance` vaut `'urgent' | 'normal' | 'low' | 'info' | 'log'` ;
`CardField` vaut `{ name; label; value: string[]; choices: { value; label }[]; multiple?: true }`.

**Comportement.**

- **« Urgent »** : le sourcil existe dès que `importance` vaut `'urgent'`, même sans `kind` ni `meta`.
- **Les valeurs proposées** : après le corps (`children` ou `lines`), avant « Pourquoi », une liste de paires (`dl`) :
  le `label` du champ, puis les libellés des choix de `value`, séparés par une virgule. Un champ `multiple` vide dit
  « aucun choix ». Une valeur hors des `choices` s'affiche telle quelle.
- **« Corriger »** (secondaire) suit « Valider », avant « Modifier », si `fields` est non vide, `options` vide et
  `oncorrect` donnée. `locked` le désactive. Il porte `aria-expanded` et `aria-controls`.
- **Dépliée** : la liste de paires laisse la place aux choix, dans la carte. Un champ sans `multiple` : un
  `radiogroup` nommé par son `label`, une pastille par choix, exactement un choix. Un champ `multiple` : un `group`
  nommé par son `label`, une case par choix, zéro ou plusieurs. Les choix partent de `value`. Les gestes de la carte
  laissent la place à deux : « Valider ainsi » (principal) et « Annuler » (fantôme).
- **« Valider ainsi »** replie et appelle `oncorrect(values)`, avec les seuls champs changés. Il est désactivé tant
  que rien ne diffère de la proposition, ou qu'un champ sans `multiple` n'a aucun choix. Après lui, la carte ne pose
  ni `tabindex` ni focus : l'app décide, puisque la carte va changer de statut ou de place.
- **« Annuler » ou Échap** replie sans rien appeler. Échap n'est pris que pendant la correction : `preventDefault`
  puis `stopPropagation`, comme le core le fait, pour qu'une ligne dépliée ou un groupe ne se ferment pas en même
  temps. Le gestionnaire s'ajoute au `onkeydown` reçu, appelé dans tous les cas, au lieu de l'écraser. Repliée, la
  carte laisse passer Échap.
- **Un échec** : si l'app rend la carte avec `error` après `oncorrect`, la carte reste en attente, repliée, l'erreur
  en `alert`, et « Corriger » revient. Les choix repartent de `value`.
- **`fields` et `options` ensemble** : seules les options se montrent, ni valeurs ni « Corriger ».
- **Texte** : « Urgent », « Corriger », « Valider ainsi », « Annuler », « aucun choix ». Ni « je » ni « tu ».

**Focus.** « Corriger » met le focus sur le choix coché du premier champ, ou sa première case. « Annuler » et Échap
le rendent à « Corriger ». Une carte montée avec `correcting` ne prend pas le focus.

## Le groupe, `DecisionGroup`

L'app l'ouvre et le ferme. Le kit ne dessine que le groupe ouvert, avec son « Fermer » : ni bascule ni `open`.

| Prop | Type | Comportement |
|---|---|---|
| `cards` | `GroupCard[]` | Les cartes en attente que l'app propose au groupe. |
| `one`, `many` | `string`, `'carte'` et `'cartes'` par défaut | Le nom des cartes dans les textes (« proposition »). |
| `level` | `2 \| 3 \| 4`, `3` par défaut | Niveau du titre ; les cartes prennent le suivant. |
| `busy` | `boolean` | Le geste tourne, les corrections et les cases attendent. |
| `off` | `string` | Lecture seule : les gestes restent en vue, désactivés, sous cette ligne. |
| `onaccept` | `(ids: string[]) => void` | Le geste : un appel, les `id` cochés encore dans le groupe. |
| `oncorrect` | `(id: string, values: Record<string, string[]>) => void` | Une carte corrigée, qui part seule. |
| `onclose` | `() => void` | « Fermer » et Échap. |

`GroupCard` reprend de la carte du contrat ce que la feuille montre : `id`, `title`, `kind`, `meta`, `lines`,
`reason`, `importance`, `fields`, `bulk`, `sends`, `options`. Il est exporté avec les autres types.

**Comportement.**

- Le groupe ne prend que les cartes `bulk` sans `sends` ni `options`. Les autres : ni montrées, ni comptées, un
  `console.warn` en dev par `id`, mémorisé dans l'instance. Monté sans carte prise, il ne dessine rien.
- Une `section` nommée par son en-tête, « Valider ensemble », suivi de « Décocher une {one} pour la laisser à
  trancher. » La ligne `off` vit sous l'en-tête, une seule fois : les cartes ne la portent pas.
- Une ligne par carte : une case (nommée par le titre), cochée au départ, puis la carte `narrow`, avec ses valeurs et
  « Corriger », sans « Valider » ni « Refuser » : décocher suffit à laisser une carte.
- Le bouton principal : « Valider les {n} {many} », « Valider la {one} » pour une, « Aucune {one} cochée »
  désactivé. Il appelle `onaccept(ids)` une fois, avec les cartes cochées. `loading` sous `busy`.
- « Valider ainsi » sur une carte : elle sort aussitôt du groupe et du compte, `oncorrect(id, values)` part. Le
  groupe garde la liste des sorties tant qu'il vit : même si l'app la laisse dans `cards`, elle ne revient pas. En
  cas d'échec, l'app la montre seule, avec son erreur.
- « Fermer » (fantôme) et Échap hors d'une correction appellent `onclose`.
- Texte au féminin : `one` et `many` doivent être des noms féminins (« carte », « proposition »).

**Focus.** Le groupe ne prend pas le focus à son montage : l'app qui l'ouvre décide. Le bouton principal le garde
pendant `busy` (`Button.svelte:49`). Une carte qui sort le donne à la case de la ligne suivante, sinon de la
précédente. Quand la dernière sort, le groupe reste dessiné (en-tête, bouton désactivé, « Fermer ») et le focus va sur
« Fermer ».

## Ce que la contestation a changé

- **Le groupe** suit le core (réponse de CrOliX) : cases cochées, plus de « Tout valider (n) », plus de bascule ni
  d'`open`, un « Fermer ». Les deux questions à CrOliX sont tranchées : pas de « Refuser » par carte ; l'app ouvre.
- **B2.** Le compte de `galerie.test.ts:64-66` passe à 3, à la tâche 3.
- **I1.** Échap n'est pris que pendant la correction, et s'ajoute au `onkeydown` de l'app.
- **I2.** La carte ne pose plus de focus après « Valider ainsi ».
- **I3.** Un essai court ouvre la tâche 1, avec son repli.
- **I4.** L'échec d'une correction a son comportement et son test.
- **I5.** `values` ne porte que les champs changés.
- **I6.** `correcting` est un état initial, sans focus.
- **M1 à M8** : mémoire des avertissements par instance, `level` borné à 4, focus quand la dernière carte sort, `off`
  sur le groupe seul, « Urgent » sans `kind` ni `meta`, `design.md`, pastilles vues à 390 px, le risque de la CI.

## Tâches

**Barrières de chaque tâche**, dans `design/` : `npm test`, `npm run typecheck`, `npm run format:check`,
`npm run build`. À la racine : `npm test`, `npm run check`, `npm run sync:check`. Les tests s'écrivent d'abord et sont
rouges sur `main` ([`workflow.md`](../../standards/workflow.md)).

0. - [ ] **Les tests d'abord** (`testeur`). **D'abord.** Deux fichiers, que deux testeurs peuvent écrire en
   parallèle : ils ne dépendent que de ce plan.
   - `design/kit/DecisionCard.test.ts`, cas ajoutés, rouges sur `main` :
     - `fields` : chaque `label` et le libellé de chaque valeur se lisent ; un `multiple` vide dit « aucun choix » ;
     - « Corriger » absent sans `oncorrect`, sans `fields`, ou avec `options` (et seules les options se montrent) ;
     - « Corriger » : `aria-expanded` passe à `true`, un `radiogroup` par champ unique, un `group` de `checkbox` par
       champ `multiple`, nommés par leur `label`, choix partis de `value` ;
     - unique : cliquer une autre pastille la coche et décoche la première ; la flèche change le choix ;
     - multiple : tout décocher puis « Valider ainsi » rend `{ [name]: [] }` ;
     - « Valider ainsi » appelle `oncorrect` une fois, avec les seuls champs changés ; désactivé sans changement, ou
       si un unique n'a aucun choix ;
     - « Annuler » et Échap : replié, `oncorrect` jamais appelé, focus sur « Corriger » ;
     - Échap pendant la correction : `defaultPrevented`, et ne remonte pas (un écouteur du parent ne le reçoit pas) ;
     - repliée, Échap n'est pas `defaultPrevented` ;
     - le `onkeydown` de l'app est appelé, repliée comme dépliée ;
     - focus à l'ouverture sur le choix coché du premier champ ; montée avec `correcting`, le focus ne bouge pas ;
     - un échec : rendue avec `error` après `oncorrect`, l'`alert` se lit et « Corriger » revient ;
     - `importance: 'urgent'` montre « Urgent », aussi sans `kind` ni `meta` ; `normal`, `low`, `info`, `log` et
       absent, rien ;
     - aucune pastille de choix ne porte `aria-pressed`.
   - Gardes, vertes sur `main` : les quinze cas existants, inchangés ; `PermissionCard.test.ts`, inchangé.
   - `design/kit/DecisionGroup.test.ts`, nouveau, rouge sur `main` :
     - trois cartes `bulk` : une `section` « Valider ensemble », l'invite, trois cases cochées, « Valider les 3
       cartes » ; avec `one` et `many`, « Valider les 3 propositions » ;
     - une carte avec `sends`, une avec `options`, une sans `bulk` : ni montrées, ni comptées, un `console.warn` par
       `id` (espionné), pas deux au rendu suivant ;
     - décocher deux cartes : « Valider la carte » ; les trois : « Aucune carte cochée », désactivé ;
     - le geste appelle `onaccept` une fois, avec les `id` cochés seulement ;
     - une carte corrigée : `oncorrect(id, values)`, elle disparaît et ne revient pas avec les mêmes `cards`, le
       compte baisse, `onaccept` part sans elle ; focus sur la case suivante ; la dernière sortie, focus sur
       « Fermer » ;
     - « Fermer » et Échap appellent `onclose` ; Échap pendant une correction ne l'appelle pas ;
     - `busy` : le bouton tourne et garde le focus ; `off` : tout désactivé, la ligne lue une seule fois ;
     - monté, le groupe ne prend pas le focus ; monté sans carte prise, il ne dessine rien.
   - Exclu : tout code de production.
1. - [ ] **La carte** (`dev-front`). **Après la tâche 0.**
   - **Essai d'abord, court** : un `RadioGroup` de bits-ui dont chaque item est dessiné par `Chip`, par sa forme
     `child`. Il tient si les rôles `radiogroup` et `radio`, `aria-checked` et les flèches marchent, et si `Chip`
     change au plus d'une ligne : avec un `role` donné, pas d'`aria-pressed`. Dans ce cas, une garde s'ajoute à
     `design/kit/components.test.ts` : sans `role`, `aria-pressed` suit `on`.
   - **Repli, si l'essai échoue** : des boutons à la manière de `Segmented`, rôle `radio` dans un `radiogroup`, au
     dessin de pastille, dans la carte. `Chip` ne bouge pas.
   - Fichiers : `design/kit/DecisionCard.svelte`, `types.ts`, `index.ts` (types seuls), et `Chip.svelte` si l'essai
     tient.
   - Comportement : « La carte, ce qui s'ajoute », ci-dessus.
   - Preuve : les tests de la tâche 0 pour la carte, verts ; les gardes, vertes ; les barrières.
   - Exclu : le groupe, la galerie, `PermissionCard`, un nouveau geste au contrat, une fenêtre par-dessus.
2. - [ ] **Le groupe** (`dev-front`). **Après la tâche 1, dans le même worktree** : il emploie la correction de la
   carte.
   - Fichier : `design/kit/DecisionGroup.svelte` (et ses types dans `types.ts`).
   - Comportement : « Le groupe, `DecisionGroup` », ci-dessus.
   - Preuve : `DecisionGroup.test.ts` vert ; les barrières.
   - Exclu : refuser ou repousser une carte du groupe, un état par carte (l'app retire une carte tranchée de `cards`),
     un seuil, un raccourci clavier, l'ouverture du groupe.
3. - [ ] **La galerie et le standard** (`dev-front`). **Après la tâche 2.** Les données de `cartes.ts` peuvent
   s'écrire en parallèle des tâches 1 et 2.
   - `design/galerie/cartes.ts` : `CarteDemo` prend `importance`, `fields`, `bulk`. Des champs inventés : « Boîte »
     (unique : Factures, Banque, Achats) et « Étiquettes » (multiple : À payer, Pro, Perso). Quatre rangements `bulk`.
   - `design/galerie/sections/Cartes.svelte`, un `Piece` par état :
     - `DecisionCard` : « avec champs », « correction ouverte » (`correcting`), « urgente », « urgente sans sourcil » ;
     - `DecisionGroup` : « ouvert », « occupé », « lecture seule ».
   - `design/galerie/inventaire.ts` : `DecisionGroup` commun, famille `cartes`, absent d'Acedia et d'Avaritia ;
     `File` (`:153`) dit que son groupe sera remplacé par `DecisionGroup`.
   - `design/galerie/galerie.test.ts:64-66` : le compte « absents d'Acedia et d'Avaritia » passe de 2 à 3.
   - `standards/design.md:118-120` : `DecisionGroup` rejoint les cartes communes, sans ligne de plus (le fichier est à
     150 lignes). Puis `npm run sync` pour les copies du plugin.
   - Preuve : `galerie.test.ts` vert avec le compte à 3 ; `npm run check` et `npm run sync:check` verts. Dans Chrome
     (`npm run galerie`) : 1440 px, 390 px (émulation ou Chrome sans interface), une hauteur de 630 px, les cinq
     mondes ; à 390 px, les pastilles de 28 px passent à la ligne et restent touchables, rien ne déborde. Captures
     dans la PR, sans donnée réelle.
   - Exclu : réécrire les sections existantes.
4. - [ ] **La revue et la PR de lun-docs** (`reviewer`, puis `livreur`). **Après la tâche 3.**
   - Une PR : ce plan, le kit, la galerie, `design.md` et ses copies. Titre `feat(kit): …`.
5. - [ ] **La copie de Lun'Anima** (`dev-front`). **Après la fusion de la PR de lun-docs. En parallèle de la tâche 6.**
   - Le dossier, la commande et les gardes sont dans l'issue privée de lun-anima, à ouvrir.
   - Preuve : la vérification du kit répond `kit: OK` ; les barrières de Lun'Anima vertes ; la file du core se
     comporte comme avant (ses tests, inchangés) ; Échap y ferme toujours la ligne dépliée.
   - Exclu : brancher `fields`, `importance` ou `DecisionGroup` dans le core.
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

## Ensuite, hors du chantier

- Au chantier des propositions au core : `DecisionGroup` remplace le groupe « Valider ensemble » de la file du core,
  qui garde son ouverture, son toast et son Annuler.

## Hors périmètre

- Le branchement dans le core : le chantier des propositions au core.
- L'écran « À valider » d'Acedia, qui garde le sien. Acedia et Avaritia n'ont pas de copie de la carte.
- La mesure et le seuil par boîte, le seuil de validation groupée.
- Un geste de plus au contrat, un raccourci clavier pour corriger ou valider ensemble.
- Refuser une carte depuis le groupe : décocher suffit.
- Ouvrir le groupe : c'est l'app.
- Une marque pour les paliers `normal`, `low`, `info`, `log`.
- `PermissionCard`, qui ne change pas.

## Limites

- **La CI des satellites rougit dès la fusion de lun-docs**, tant que les tâches 5 et 6 ne sont pas faites : leur
  étape du kit compare à `main` de lun-docs. Les deux PR partent donc juste après la fusion.
- **Les pastilles font 28 px de haut** (`Chip.svelte:38`), sous les 44 px d'une cible tactile. Le kit les garde ainsi
  partout ; ce chantier ne les change pas, la tâche 3 les regarde à 390 px.
- **Le groupe se fie à l'app pour une carte tranchée** : il n'en montre pas le statut, l'app la retire de `cards`.
- **Le texte suppose des noms féminins** pour `one` et `many`.
- **L'avertissement de dev ne se voit qu'en console** : une app en prod ne dit rien d'une carte écartée.
- **Le texte d'invite diffère de celui du core** (« Décocher » contre « Décoche ») jusqu'au remplacement.
