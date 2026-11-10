# La galerie du kit, palier 1. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** une page locale, dans lun-docs, qui montre chaque composant du kit commun dans ses états et dans les cinq
mondes, construite à partir du kit lui-même. Elle sert à reprendre un design au lieu de le réinventer, à dessiner une
variante à côté de l'original, et à vérifier un écran avant une PR.

**Source :** demande de CrOliX le 10/11, après le [dictionnaire](../../standards/dictionnaire.md) : « un double travail de
dictionnaire et de maquettage de composants partagés, à garder accessible ». Tranché le même jour : une page **locale**,
gardée dans le dépôt de doc, rien de publié. Cadrage de l'[état cible](../specs/2026-11-10-etat-cible-cadrage.md), axe de
révision.

**Trois paliers, un plan par palier.** Celui-ci : le kit tel qu'il est. Le suivant : la famille des cartes (dessinées
trois fois aujourd'hui, dans Acedia, le core et Avaritia, aucune dans le kit) et la permission, en maquettes d'abord. Le
dernier : la convergence des kits d'Acedia et d'Avaritia (lun-docs#43).

**Critères de fin :**

- `npm run galerie`, dans `design/`, ouvre une page où chaque composant exporté par le kit se voit dans ses états, et où
  un sélecteur change de monde (neutre, anima, acedia, avaritia, luxuria).
- Un test échoue si un composant du kit n'est pas montré dans la galerie.
- Les tests du kit tournent dans lun-docs, et sa CI les lance avec le typage et le build de la galerie.
- La racine du dépôt reste sans dépendance : `npm test`, `npm run check` et `npm run sync:check` ne demandent toujours
  aucune installation.

**Cadre :** aucun code avant la validation de ce plan par CrOliX. Niveau `standard`. *Show* : tout se prouve sur le
laptop. Une PR, dans lun-docs.

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-docs`, `feat/galerie-kit` | lun-docs#132 | `standard` |

## Contraintes

- **Le kit ne change pas.** Aucun fichier de `design/kit/` n'est retouché pour la galerie : les quatre copies des apps
  restent vertes sans resynchronisation. Un défaut du kit vu en route devient une issue `inbox`.
- **Les dépendances vivent dans `design/`**, pas dans `design/galerie/` : les fichiers du kit importent `svelte`,
  `bits-ui` et `@lucide/svelte`, et Node les cherche en remontant depuis `design/kit/`. Un `design/package.json`, privé,
  les porte pour le kit et pour la galerie. `tools/sync-kit.mjs` ne recopie que `design/kit/` : rien d'autre ne part
  dans les apps.
- **Les mêmes versions que le core**, qui fait foi pour le kit aujourd'hui (Svelte 5, Vite, bits-ui, vitest).
- **La galerie montre, elle ne redessine pas.** Ses seuls styles propres sont sa mise en page (titres, grilles, fond des
  vitrines), écrits avec les variables de design. Aucune couleur en dur.
- **Aucune donnée réelle** : des noms et des textes inventés, comme dans les démos.
- La page d'Acedia (`app/catalogue.html`) reste où elle est tant que son kit lui est propre (lun-docs#43). Elle sert de
  modèle pour les sections, pas de source à copier ligne à ligne : elle montre aussi des composants qui ne sont pas dans
  le kit.

## Tâches

1. - [ ] **`design/package.json` et l'outillage** : Svelte, Vite, vitest, jsdom, les bibliothèques de test, `svelte-check`,
   `bits-ui`, `@lucide/svelte`, les deux polices. Scripts : `galerie` (serveur de développement), `build`, `test`,
   `typecheck`. `design/node_modules` et `design/galerie/dist` sont ignorés par git. Preuve : les tests existants du kit
   (`components`, `overlays`, `shortcuts`, `ui`) passent dans lun-docs, sans qu'un fichier du kit ait changé.
2. - [ ] **Le squelette** : `design/galerie/index.html`, `main.ts`, `Galerie.svelte`. Un en-tête avec le sélecteur de monde
   (un `Segmented` du kit, qui pose `data-monde` sur la racine des vitrines) ; un sommaire ; une vitrine par section,
   sur le fond des surfaces communes. La page tient à 390 px.
3. - [ ] **Les sections**, un fichier Svelte par section sous `design/galerie/sections/`, chaque composant dans ses
   états (normal, désactivé, erreur, chargement, vide, selon ce qu'il a) :
   - *Boutons* : `Button` (cinq variantes, trois tailles, chargement), `IconButton`, `Kbd` ;
   - *Champs* : `Field`, `TextInput`, `TextArea`, `Select`, `Slider`, `Segmented`, `CodeInput`, `DropZone` ;
   - *Bascules et pastilles* : `Switch`, `Checkbox`, `Badge`, `Chip` ;
   - *Ce qui flotte* : `Tooltip`, `Dialog`, `ConfirmDialog`, `CommandPalette`, `Toaster` et ses toasts, `Banner` ;
   - *Listes et réglages* : `ListRow`, `SettingsCard`, `SettingsRow`, `EmptyState`, `Skeleton`, `Steps` ;
   - *Cartes d'information* : `StatCard`, `ServiceCard`, `StandaloneCard` ;
   - *Navigation* : `Rail`, `NavGroup`, `NavLink`, `BottomNav` ;
   - *Les variables de design* : la palette, les rayons, les espacements, la typographie, lues dans `tokens.css`.
4. - [ ] **Le garde-fou** : un test lit la liste des fichiers `.svelte` de `design/kit/` (hors `fixtures/`) et échoue si
   l'un d'eux n'est importé par aucune section. Un composant ajouté au kit sans vitrine casse la CI.
5. - [ ] **La CI** : un second job dans `ci.yml`, `design`, qui installe dans `design/`, puis lance `typecheck`, `test` et
   `build`. Le premier job reste tel quel, sans installation.
6. - [ ] **La doc** : `standards/design.md` (« le catalogue des composants » devient la galerie, avec sa commande) ;
   `CLAUDE.md` et `README.md` de lun-docs (la racine sans dépendance, `design/` avec les siennes) ; `npm run sync`, car
   `design.md` est recopié dans le plugin.

## Preuves

- Dans `design/` : `npm run typecheck`, `npm test` (les tests du kit et le garde-fou), `npm run build`.
- À la racine : `npm test`, `npm run check`, `npm run sync:check`, sans installation.
- La galerie dans Chrome sans interface, à 1440 px et à 390 px, une capture par section et une par monde, dans une page
  privée de preuves.
- Le garde-fou éprouvé : un composant retiré d'une section fait échouer le test, puis il est remis.
- Les copies du kit inchangées : `git diff origin/main -- design/kit` est vide.

## Hors périmètre

- Les cartes et la permission : palier 2, en maquettes d'abord.
- Les composants propres à Acedia (`Menu`, `Popover`, `Tabs`, `Fab`, les cartes de proposition) et à Avaritia : palier 3
  (lun-docs#43).
- Retirer la page d'Acedia.
- Publier la galerie.
