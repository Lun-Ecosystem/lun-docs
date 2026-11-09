# Trois écrans qui mentent encore. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** trois écarts vus en route pendant J et M, que la semaine de rodage peut rencontrer : le bandeau de la mise en
route qui dit « Rien ne tourne encore » pendant que les routines tournent ; le rang des plafonds qui se replie mot par
mot au téléphone ; une erreur perdue derrière un toast annulable, dans le kit et donc dans ses copies.

**Source :** lun-anima#82, lun-anima#83, lun-docs#119 ; ordre validé par CrOliX le 09/11 : L, puis P, puis le cadrage
d'un nouvel axe. [Feuille de route](2026-11-07-feuille-de-route-mvp.md), chantier P. Spec
[`2026-11-02-natsume-au-centre-design.md`](../specs/2026-11-02-natsume-au-centre-design.md), § 4.3 : une seule bande,
la plus grave l'emporte, et la ligne « Mise en route » de son tableau. Plan relu par le plan-challenger le 09/11 : ses
douze objections sont reprises ci-dessous (copies partielles d'Acedia et d'Avaritia, preuve du kit dans lun-anima,
texte du bandeau vrai dans tous les cas, région `status`, seconde branche des toasts, spec, critères, niveau).

**Critères de fin :**

- lun-anima#82 : sur une base neuve, le bandeau ne dit plus que rien ne tourne ; il dit ce qui attend, et le même texte
  est lu par un lecteur d'écran quand il change ; le pied de la mise en route dit la même chose que le bandeau.
- lun-anima#83 : à 390 px, chaque rang de la mise en route se lit sur deux ou trois lignes, ses boutons sous son texte ;
  à 1440 px, rien ne change.
- lun-docs#119 : dans le kit, une erreur qui attend derrière un toast annulable s'affiche à la fin de celui-ci, même si
  une information est arrivée entre-temps ; prouvé par les tests de la copie de lun-anima, puis repris dans les quatre
  copies.

**Cadre :** aucun code avant la validation de ce plan par CrOliX. Niveau `standard` : le kit vaut pour quatre apps, et
le bandeau change une ligne de la spec et son annonce aux lecteurs d'écran ; lun-anima#83 seul serait `trivial`. *Show* :
tout se prouve sur le laptop, avec un core jetable sans clé. Une PR par dépôt, cinq en tout ; lun-docs d'abord, les
copies ensuite.

| Dépôt, branche | Issues | Niveau |
|---|---|---|
| `lun-docs`, `docs/p-ecarts-core` | lun-docs#119, la spec § 4.3, ce plan, la feuille de route | `standard` |
| `lun-anima`, `fix/ecrans-qui-mentent` | lun-anima#82, #83, la copie du kit | `standard` |
| `lun-luxuria`, `chore/kit-toasts` | la copie du kit entière | `trivial` |
| `lun-acedia`, `lun-avaritia`, `chore/kit-toasts` | `toasts.svelte.ts` et son bloc de tests seulement | `trivial` |

## Contraintes

- Le kit (`design/kit/`) est la seule référence. lun-anima et lun-luxuria le recopient entier par
  `tools/sync-kit.mjs <dir>`, et leur CI compare la copie à `main` de lun-docs : leurs PR restent en brouillon, CI rouge
  sur « Shared front kit is in sync », jusqu'à la fusion de lun-docs ; une relance (`gh run rerun`) la passe verte, car
  la CI clone lun-docs à chaque passage. Dès cette fusion, toute autre PR ouverte de ces deux dépôts rougit de même :
  fusionner les copies juste après, et regarder les PR ouvertes. Si la PR lun-docs change à la relecture, refaire la
  synchro partout.
- Acedia et Avaritia gardent leur propre kit jusqu'à lun-docs#43 (`CLAUDE.md` de lun-docs) : une synchro entière y
  écraserait `index.ts` et des composants adaptés à la main (`StandaloneCard`, `Dialog`). Comme au chantier M
  (lun-acedia#64, lun-avaritia#31), seul `toasts.svelte.ts` y reprend le code du kit, à l'identique et sans en-tête
  (il est dans leur `.prettierignore`), avec le bloc `describe('toast')` de `overlays.test.ts`.
- lun-docs ne fait pas tourner les tests du kit (`npm test` n'y lance que `tools/` et `plugin/hooks/`) : le kit se prouve
  dans lun-anima, sur la copie, par `npx vitest run --project ui ui/src/lib/ui/overlays.test.ts`, puis par les barrières
  complètes (format, lint, typage, tests, build) de lun-anima et de lun-luxuria.
- Le bandeau reste unique et court (spec, § 4.3) ; il ne liste pas la mise en route, il renvoie vers elle.
- Rien ne change dans le moteur des routines. Le défaut est dans le texte ; une condition de plus dans `engine.ts`
  pour un bug de texte ajouterait un état à tester et à expliquer. (La copie de nuit de la base ne dépend déjà plus des
  routines depuis lun-anima#91.) **À trancher par CrOliX** : l'issue laissait les deux sorties ouvertes.

## Tâches

### Le kit (lun-docs#119)

1. - [x] `design/kit/toasts.svelte.ts` : pendant qu'un toast annulable compte, ou pendant que son annulation tourne,
   l'attente garde le plus grave. Une information qui arrive ne remplace pas une erreur en attente ; une erreur remplace
   ce qui attend ; entre deux informations, ou deux erreurs, la dernière gagne (comme aujourd'hui). La règle vaut pour
   les deux branches de `toast()` : celle qui met en attente, et celle qui vide l'attente quand un toast simple prend
   l'écran (`waiting = undefined`). **[choix Claude]** Une seule place d'attente, pas de file : un seul écran de 5 s ne
   montrerait pas mieux deux retards. Le commentaire d'en-tête dit la règle, et dit aussi ce qu'elle ne couvre pas : une
   erreur **à l'écran** reste remplacée tout de suite par un toast plus récent (issue `inbox` à ouvrir, hors périmètre),
   et une suite de toasts annulables fait attendre l'erreur sans limite (`shortcut:` dans le code).
   Tests dans `design/kit/overlays.test.ts`, trois cas : l'exemple de l'issue (rangé, échec en fond, « Brouillon
   enregistré ») montre l'échec après les 5 s, en ton `danger` ; une erreur arrivée après une information prend sa
   place ; une erreur en attente survit à une information arrivée pendant que « Annuler » tourne. Rouges sur le code
   d'aujourd'hui, verts après, joués dans lun-anima (tâche 5).

   **Fait :** `errorWaits` dans `toast()` : une erreur en attente n'est remplacée que par une erreur, dans la branche
   qui met en attente et dans celle qui vide l'attente. Quatre tests (l'exemple de l'issue, une erreur après une
   information, deux erreurs, une erreur pendant « Annuler ») ; deux étaient rouges sur l'ancienne copie de lun-anima,
   29 verts après. `shortcut:` sur l'attente sans limite ; issue lun-docs#124 pour l'erreur à l'écran.
2. - [x] La spec `2026-11-02-natsume-au-centre-design.md`, § 4.3 : la ligne « Mise en route » du tableau prend le nouveau
   texte et son bouton (tâche 3). `npm run check` et `npm run sync:check` verts.

   **Fait :** la ligne « Mise en route » du tableau du § 4.3 : le nouveau texte, et « Mise en route, caché sur ce lieu
   ».

### Le core (lun-anima#82, #83)

3. - [x] Le bandeau de la mise en route (`ui/src/shell/bande.ts`) dit ce qui attend vraiment, à partir de `state.route`
   que l'écran reçoit déjà (`types.ts`, `CoreState.route`). Deux variantes, vraies dans tous les cas : toujours
   « Mise en route : le Bureau s'ouvre quand elle est finie. » ; sans la clé, la phrase continue : « Natsume ne converse
   pas encore et ses routines tournent sans le modèle. » Le bouton « Mise en route » mène à `/app/mise-en-route`, et ne
   paraît pas quand ce lieu est déjà ouvert (`Bande.svelte` a `nav`). Le pied de `MiseEnRoute.svelte` (« Le Bureau et
   ses cartes arrivent avec le premier poste ») dit la même chose : « Le Bureau s'ouvre quand la mise en route est finie ;
   ses cartes arrivent avec le premier poste. » **[choix Claude]** Les routines continuent de tourner (contraintes).
   Tests dans `bande.test.ts` : avec et sans clé, le bouton et son absence sur son propre lieu.

   **Fait :** `bande.ts` lit `state.route.key` : deux variantes, le bouton « Mise en route » vers `/app/mise-en-route`,
   caché sur ce lieu seulement (`Bande.svelte`, resserré après la relecture : la règle valait d'abord pour tous les
   bandeaux). Le pied de la mise en route dit la même chose. Captures avant et après dans lun-anima#92.
4. - [x] La région `status` de `Bande.svelte` ne réannonce qu'au changement de `kind:post` : la clé ajoutée, elle dirait
   encore « ne converse pas ». La clé d'annonce prend l'état de la route (`mise-en-route:` plus `route.key`). Test dans
   `Bande.svelte.test.ts` : la clé posée, la région dit le nouveau texte.

   **Fait :** la clé d'annonce ajoute `route.key` pour le bandeau de la mise en route ; test dans `Bande.svelte.test.ts`
   : la clé posée, la région dit le nouveau texte.
5. - [x] Le rang des plafonds au téléphone (`ui/src/lieux/MiseEnRoute.svelte`) : le repli existe déjà sous 768 px
   (`flex-wrap: wrap`) mais ne joue jamais, `.lib` partant d'une largeur de base nulle. Dans cette même règle, les gestes
   prennent toute la largeur sous le texte, alignés sous le titre (`flex-basis: 100%`, retrait de 34 px : la coche de
   20 px et l'écart de 14 px, `justify-content: flex-start`). Tous les rangs, pas seulement celui à deux boutons.
   Preuve par capture à 390 px et à 1440 px, avant et après, sur un core jetable sans clé.

   **Fait :** dans la media query existante, `.gestes` prend toute la largeur sous le texte, retrait de 34 px ; capture
   à 390 px avant et après, 1440 px inchangé. Au Journal à 390 px, le bandeau sur quatre lignes avec son bouton reste
   lisible : pas d'issue.
6. - [x] La copie du kit : `node <lun-docs>/tools/sync-kit.mjs ui/src/lib/ui` depuis la branche de lun-docs, un commit
   `chore(kit): …`. C'est ici que le kit se prouve : les trois tests de la tâche 1 rouges avant la synchro, verts après ;
   puis les barrières complètes (`format:check`, `lint`, `typecheck`, `test`, `build`). La PR reste en brouillon jusqu'à la
   fusion de lun-docs, puis `gh run rerun`.

   **Fait :** `sync-kit.mjs ui/src/lib/ui`, `kit: OK` contre la branche ; barrières complètes vertes (140 fichiers, 2009
   tests). lun-anima#92 en brouillon jusqu'à la fusion de lun-docs#123.

### Les trois autres copies

7. - [x] lun-luxuria (`src/lib/ui`) : la même commande, un commit, une PR brouillon, les barrières complètes
   (`svelte-check --fail-on-warnings` compris), prête après la fusion de lun-docs.

   **Fait :** lun-luxuria#45 : copie entière, `kit: OK`, barrières complètes vertes (27 fichiers, 269 tests).
8. - [x] lun-acedia (`views/src/lib/ui`) et lun-avaritia (`app/src/lib/ui`) : `toasts.svelte.ts` recopié à l'identique,
   sans en-tête, et le bloc `describe('toast')` de leur `overlays.test.ts` repris du kit ; rien d'autre. `npm test` et
   `npm run typecheck` verts dans chacune. Une PR brouillon chacune.

   **Fait :** lun-acedia#65 et lun-avaritia#32 : `toasts.svelte.ts` et le bloc `describe('toast')` seuls ; format, lint,
   typage et tests verts (742 et 514 tests).

### La doc

9. - [x] Ce plan coché, et la feuille de route (§ 1) qui dit P livré ; dans la même PR lun-docs que les tâches 1 et 2.

   **Fait :** coché dans lun-docs#123, avec la feuille de route.

## Preuves

- lun-docs : `npm run check`, `npm run sync:check` ; le kit se prouve dans lun-anima (tâche 6).
- lun-anima : les barrières complètes ; les captures du bandeau et du rang à 390 px et à 1440 px, avant et après, sur un
  core jetable sans clé (`DB_PATH` à part, retiré ensuite avec son `backups/`), dans Chrome sans interface ; le test de
  la région `status`.
- Les copies : `node tools/sync-kit.mjs --check <dir>` sort 0 contre la branche de lun-docs pour lun-anima et lun-luxuria ;
  `npm test` et `npm run typecheck` pour Acedia et Avaritia ; puis la CI de lun-anima et de lun-luxuria verte après la
  fusion de lun-docs.

## Hors périmètre

- Une erreur **à l'écran** remplacée tout de suite par un toast plus récent (kit, « a new toast replaces the one on
  screen ») : issue `inbox` lun-docs, ouverte à la tâche 1.
- `SettingsRow` du kit a la même construction que le rang (`flex: 1` et repli sous 768 px) : issue `inbox` si une ligne
  s'y écrase, rien vu à ce jour.
- Ce que le bandeau pourrait dire des manques facultatifs (notifications, second appareil) : il n'en parle pas.
- Le contrôle de la copie du kit dans la CI d'Acedia et d'Avaritia (lun-docs#43).
