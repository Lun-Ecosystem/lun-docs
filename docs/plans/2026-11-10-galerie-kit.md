# La galerie du kit, palier 1. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** une page locale, dans lun-docs, qui montre chaque composant du kit commun dans ses états et dans les cinq
mondes, construite à partir du kit lui-même. Elle sert à reprendre un design au lieu de le réinventer, et à vérifier un
écran avant une PR. Dessiner une variante à côté de l'original commence au palier 2, avec les maquettes : ce palier
montre le kit, il ne le redessine pas.

**Source :** demande de CrOliX le 10/11, après le [dictionnaire](../../standards/dictionnaire.md) : « un double travail de
dictionnaire et de maquettage de composants partagés, à garder accessible ». Tranché le même jour : une page **locale**,
gardée dans le dépôt de doc, rien de publié. Cadrage de l'[état cible](../specs/2026-11-10-etat-cible-cadrage.md), axe de
révision. Plan relu par le plan-challenger le 10/11 : ses douze objections sont reprises ci-dessous. Il a éprouvé le kit
hors d'une app : ses 65 tests passent et son typage est propre, avec la configuration des apps.

**Validé par CrOliX le 10/11**, avec une demande de plus : que la galerie range les rendus par type et par rapprochement
(une section des boutons, rangés par type d'action puis par variante), et qu'une légende dise de chaque élément s'il est
commun à tous, une variante, ou propre à un projet.

**Trois paliers, un plan par palier.** Celui-ci : le kit tel qu'il est. Le suivant : la famille des cartes (dessinées
trois fois aujourd'hui, dans Acedia, le core et Avaritia, aucune dans le kit), la permission et les variantes, en
maquettes d'abord. Le dernier : la convergence des kits d'Acedia et d'Avaritia (lun-docs#43).

**Critères de fin :**

- `npm run galerie`, dans `design/`, ouvre une page où chaque fichier `.svelte` du kit se voit dans ses états, et où un
  sélecteur change de monde (neutre, anima, acedia, avaritia, luxuria), calques compris.
- Les rendus sont rangés par famille, puis par usage, puis par variante ; chaque élément porte sa légende : **commun**
  (dans le kit, le même partout), **variante** (un projet garde sa propre version d'un composant du kit), **propre** (il
  n'existe que dans un projet). Les variantes et les éléments propres sont nommés à leur place dans la famille, avec leur
  projet et leur fichier ; leur rendu vient au palier 3.
- Un test échoue si un composant du kit n'est rendu par aucune section.
- Les tests du kit tournent dans lun-docs, et sa CI les lance avec le typage, le format de la galerie et son build, dans
  le job qui bloque la fusion.
- La racine du dépôt reste sans dépendance : `npm test`, `npm run check` et `npm run sync:check` ne demandent toujours
  aucune installation.

**Cadre :** aucun code avant la validation de ce plan par CrOliX. Niveau `standard`. *Show* : tout se prouve sur le
laptop. Une PR, dans lun-docs.

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-docs`, `feat/galerie-kit` | lun-docs#132 | `standard` |

## Contraintes

- **Le kit ne change pas.** Aucun fichier de `design/kit/` n'est retouché, pas même reformaté : les deux copies tenues
  par `sync-kit` (le core et Luxuria) restent vertes sans resynchronisation. Un défaut du kit vu en route devient une
  issue `inbox`. Rien de la galerie ne vit dans `design/kit/`, que `sync-kit.mjs` recopie en entier dans les apps.
- **Les dépendances vivent dans `design/`**, pas dans `design/galerie/` : les fichiers du kit importent `svelte`,
  `bits-ui` et `@lucide/svelte`, et Node les cherche en remontant depuis `design/kit/`. Un `design/package.json`, privé,
  et son `package-lock.json` versionné les portent pour le kit et pour la galerie.
- **Les versions exactes du core**, reprises de son verrou, qui fait foi pour le kit aujourd'hui. Node : celui que
  demande jsdom (`^22.22.2 || >=24.15`), écrit dans `engines` de `design/package.json` ; la racine reste à « Node 22 ».
- **La base de page du core.** Le rendu du kit dépend de la feuille de base de l'app, et le core et Luxuria n'ont pas la
  même (Luxuria pose `box-sizing: border-box` partout, le core non : un `Badge` mesure 24 px dans l'un, 22 px dans
  l'autre). La galerie reprend la base du core, et le dit en tête de page ; l'écart devient une issue `inbox`.
- **La galerie montre, elle ne redessine pas.** Ses seuls styles propres sont cette base et sa mise en page (titres,
  grilles, fond des vitrines), écrits avec les variables de design. Aucune couleur en dur.
- **Le même typage que les apps** : le `tsconfig` de `design/` reprend les options du core. Un typage plus lâche donnerait
  un vert trompeur.
- **Aucune donnée réelle** : des noms et des textes inventés, comme dans les démos.
- La page d'Acedia (`app/catalogue.html`) reste où elle est tant que son kit lui est propre (lun-docs#43). Elle sert de
  modèle pour les sections, pas de source à copier : elle montre aussi des composants qui ne sont pas dans le kit.

## Tâches

1. - [ ] **`design/package.json` et l'outillage.** Les dépendances aux versions du verrou du core ; `package-lock.json`.
   La configuration de test des apps : le plugin de test de Svelte, `jest-dom`, un faux `ResizeObserver`, et les
   bibliothèques à passer par Vite (`bits-ui`, `@lucide/svelte`, `svelte-toolbelt`, `runed`). Le `tsconfig` du core
   (`allowImportingTsExtensions`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`).
   Scripts : `galerie`, `build`, `test`, `typecheck`, `format:check`. Ignorés par git : `design/node_modules`,
   `design/galerie/dist` ; `dist/` s'ajoute à `.graphifyignore`. Preuve : les 65 tests du kit passent dans lun-docs et
   `svelte-check` est propre, sans qu'un fichier du kit ait changé.
2. - [ ] **Le squelette** : `design/galerie/index.html`, `main.ts`, `base.css` (la base du core), `Galerie.svelte`. Un
   en-tête avec le sélecteur de monde, un `Segmented` du kit ; l'en-tête porte lui aussi `data-monde`, sinon l'accent
   n'y est défini nulle part. Les vitrines se remontent quand le monde change (`{#key}`) : `Dialog`, `ConfirmDialog`,
   `CommandPalette` et `Select` lisent leur monde une fois, à l'ouverture. Un sommaire ; une vitrine par section ; la
   page tient à 390 px.
3. - [ ] **Les sections**, un fichier Svelte par section sous `design/galerie/sections/`. Chaque section importe ses
   composants fichier par fichier, pas par le baril `index.ts`, qui n'exporte ni `CommandPalette`, ni `Dialog`, ni
   `Select`, ni `Switch`, ni `NavGroup`. Chaque composant dans ses états : normal, survol, focus, désactivé, erreur,
   chargement, vide, selon ce qu'il a ; le survol et le focus par l'attribut que le kit prévoit pour cela (`data-etat`).
   - *Boutons* : `Button` (six variantes, trois tailles, chargement), `IconButton`, `Kbd` ;
   - *Champs* : `Field`, `TextInput`, `TextArea`, `Select`, `Slider`, `Segmented`, `CodeInput`, `DropZone` ;
   - *Bascules et pastilles* : `Switch`, `Checkbox`, `Badge`, `Chip` ;
   - *Ce qui flotte* : `Tooltip`, `Dialog`, `ConfirmDialog`, `CommandPalette` (une seule par page), `Toaster` en mode
     contenu et ses toasts, `Banner` ;
   - *Listes et réglages* : `ListRow`, `SettingsCard`, `SettingsRow`, `EmptyState`, `Skeleton`, `Steps` ;
   - *Cartes d'information* : `StatCard`, `ServiceCard`, `StandaloneCard` (qui rend déjà son `<main>`) ;
   - *Navigation* : `Rail`, `NavGroup`, `NavLink`, `BottomNav` ;
   - *Les variables de design* : ce que `tokens.css` contient vraiment (couleurs, tons, rayons, ombres, polices, cadre
     de focus), lu depuis le fichier lui-même pour qu'une variable ajoutée paraisse seule.
4. - [ ] **L'inventaire et la légende** : `design/galerie/inventaire.ts` liste chaque élément d'interface réutilisable de
   l'écosystème : son nom, sa famille, son usage, son statut (commun, variante, propre), ses projets, son fichier. Relevé
   du 10/11 : 34 composants communs ; Acedia garde 10 variantes (`Badge`, `Button`, `ConfirmDialog`, `Dialog`,
   `EmptyState`, `Rail`, `Segmented`, `ServiceCard`, `SettingsRow`, `StandaloneCard`) et 8 éléments propres
   (`AutoMark`, `DayGroup`, `Fab`, `Menu`, `Popover`, `ProposalCard`, `ProposalChip`, `Tabs`) ; Avaritia garde 3
   variantes (`ConfirmDialog`, `Dialog`, `StandaloneCard`) ; le core et Luxuria n'en ont aucune. S'y ajoutent les cartes,
   propres à trois projets (Acedia, le core, Avaritia). Chaque section lit l'inventaire : elle rend les communs, groupés
   par usage puis par variante (les boutons : l'action principale, l'action secondaire, l'action discrète, l'action qui
   détruit ; puis les tailles, puis l'icône seule), et nomme sous eux les variantes et les éléments propres de la même
   famille, sans les rendre. Une légende en tête de page explique les trois statuts. **[choix Claude]** L'inventaire est
   écrit à la main et daté : un script qui lirait les quatre dépôts ferait dépendre lun-docs des apps.
5. - [ ] **Les garde-fous**, dans `design/galerie/` : un test liste les fichiers `.svelte` de `design/kit/` (hors
   `fixtures/`) et échoue si la balise de l'un d'eux n'apparaît dans le balisage d'aucune section, ou s'il manque à
   l'inventaire ; un test de rendu
   monte `Galerie.svelte` et vérifie que chaque section s'affiche, dans un monde puis dans un autre.
6. - [ ] **La CI** : à la fin du job `checks`, le seul que le ruleset exige, après les étapes actuelles qui tournent donc
   avant toute installation : `npm ci`, `typecheck`, `test`, `format:check` et `build`, dans `design/`. Pas de second
   job : il ne bloquerait aucune fusion. `format:check` ne couvre que `galerie/`, avec la configuration des apps ; le
   kit en est exempté, car le reformater romprait la première contrainte (issue `inbox`).
7. - [ ] **La doc** : `standards/design.md` (« le catalogue des composants » devient la galerie, avec sa commande ; 8
   lignes de marge sous la limite de 150) ; `CLAUDE.md` et `README.md` de lun-docs (la racine sans dépendance, `design/`
   avec les siennes et son Node) ; le cadrage de l'état cible, § 6 (la galerie dans l'axe de révision) ; `npm run sync`,
   car `design.md` est recopié dans le plugin.

## Preuves

- Dans `design/` : `npm run typecheck`, `npm test` (les 65 tests du kit et les deux garde-fous), `npm run format:check`,
  `npm run build`.
- À la racine, sans `design/node_modules` : `npm test`, `npm run check`, `npm run sync:check`.
- La galerie dans Chrome sans interface, à 1440 px et à 390 px : une capture par section, une par monde, un calque
  ouvert après un changement de monde, un survol et un focus forcés. Dans une page privée de preuves.
- Le garde-fou éprouvé : une balise retirée d'une section fait échouer le test, puis elle est remise.
- Le kit inchangé : `git diff origin/main -- design/kit` est vide.
- La CI de la PR verte, avec les étapes de `design/` visibles dans `checks`.

## Hors périmètre, en issues `inbox` à ouvrir à l'exécution

- L'écart de `box-sizing` entre la base du core et celle de Luxuria.
- Le kit n'est pas au format des apps (`ConfirmDialog`, `StandaloneCard`, `Toaster`), et un import y est inutilisé
  (`Steps`).
- `design.md` annonce des espacements, des hauteurs, une échelle typographique et du mouvement que `tokens.css` n'a pas.
- Les cartes, la permission et les variantes : palier 2. Les composants propres à Acedia et à Avaritia : palier 3
  (lun-docs#43). Retirer la page d'Acedia. Publier la galerie.
