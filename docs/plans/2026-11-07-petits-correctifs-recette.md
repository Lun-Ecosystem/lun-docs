# Petits correctifs de la recette du 07/11. Plan

> **Pour les agents d'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** fermer trois écarts de la recette du desktop, tous prouvables sur le laptop : Luxuria lit son `.env`
(Lun-Ecosystem/lun-luxuria#4), une base jetable peut démarrer sans rattraper la veille et le matin
(Lun-Ecosystem/lun-anima#57), et `FakeSatellite.emit` peut dater ses événements à l'heure qu'on lui donne
(Lun-Ecosystem/lun-anima#59).

**Cadre :** rapport de recette `luxuria-essai/RECETTE.md` (hors dépôt), écarts n° 1, 6 et 8. Niveau `trivial` pour les
trois, posé au tri du 07/11 (lun-docs#73).

**Dépôts :** deux PR, une par dépôt. `lun-luxuria` sur `fix/vite-env`, `lun-anima` sur `fix/recette-base-neuve`.

## Critères de fin

1. **lun-luxuria#4.** `vite.config.ts` lit `.env` par `loadEnv` de Vite. Une variable déjà posée dans l'environnement
   l'emporte sur `.env`, donc `$env:CORE_URL` marche toujours. Preuve : avec un `.env` qui pose `CORE_URL` sur un autre
   port, la configuration résolue par Vite (`resolveConfig`) donne ce port au proxy `/api`, puis la variable
   d'environnement l'emporte. Commande dans la PR.
2. **lun-anima#57.** `ROUTINES_CATCHUP=0` : au démarrage, les créneaux déjà dus ne sont pas joués. Ils sont notés
   comme sautés (`skipped`, raison `sans rattrapage`), avec leur entrée au Journal, comme sous la pause. Sous la pause,
   la raison reste `en pause`. Les créneaux suivants tournent normalement. Le Bureau ne dit « en pause » que pour un
   matin sauté sous la pause. Sans la variable, rien ne change. Preuve : `core/src/routines/engine.test.ts` et le test
   de `core/src/word/word.ts`.
3. **lun-anima#59.** `new FakeSatellite({ clock })` : `emit` date l'événement à `clock()`. Sans `clock`, la date
   fixe du 02/11 reste, et aucun test existant ne bouge. Preuve : un test dans le fichier de test du faux satellite
   ou dans `events/routes.test.ts`.
4. Doc dans le même commit : `ROUTINES_CATCHUP` dans le tableau des variables du `README.md` de lun-anima (base
   jetable seulement, seul `0` coupe) et dans son `.env.example` en commentaire, et la ligne de `.env.example` de
   lun-luxuria qui dit que `.env` est lu.
5. Barrières vertes dans les deux dépôts : `npm run format:check`, `lint`, `typecheck`, `test`, `build`.

**Hors périmètre :** le banc (`luxuria-essai/banc/`, hors dépôt) : après le merge, `core-jetable` pose
`ROUTINES_CATCHUP=0` et `satellite-factice.mts` passe `clock` au lieu de réécrire `e.at`, sans PR. Les autres écarts
de la recette (lun-luxuria#5 et #8, lun-anima#58).

## Décision à valider

`ROUTINES_CATCHUP=0` est une option explicite, et pas un comportement de toute base neuve **[choix Claude]**. Une base
neuve en production (le NAS plus tard) garde le rattrapage d'aujourd'hui : on n'y change rien sans le décider. Posée
par erreur sur la vraie base, elle ferait sauter une lettre à un redémarrage : d'où « jetable seulement » dans le
README et une ligne au démarrage quand elle est active.

## Tâches

### 1. lun-luxuria#4 (`vite.config.ts`)

- [ ] `defineConfig(({ mode }) => …)` avec `const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }` ;
      `CORE_URL`, `VOIX_URL` et `PORT` viennent de `env`. Le bloc `test` ne change pas.
- [ ] `process.env.VITEST` reste lu directement pour les plugins.
- [ ] Preuve par `resolveConfig`, lancée depuis un dossier temporaire qui porte le `.env` d'essai (la config lit
      `process.cwd()`) : aucun `.env` n'est écrit dans le dépôt. Puis avec la variable posée, qui l'emporte.
- [ ] `.env.example` : la première ligne dit que Vite lit ce fichier.

### 2. lun-anima#57 (`core/src/routines/engine.ts`, `core/src/main.ts`)

- [ ] Tests d'abord, dans `engine.test.ts` : avec `catchUp: false`, un premier tick à 9:00 note la veille et le matin
      comme sautés (`sans rattrapage`), sans les jouer, avec leurs entrées au Journal ; le lendemain, les deux
      tournent. Sous la pause avec `catchUp: false`, la raison reste `en pause`. Un passage interrompu au démarrage
      reste noté en échec, puis son créneau est sauté.
- [ ] `startRoutines` prend `catchUp?: boolean` (vrai par défaut). Le saut passe par `tick`, pas par une seconde
      logique : un ensemble des routines encore à décider, vidé quand chacune est trouvée non due ou sautée. L'ordre
      reste celui de `tick` : `startedSince`, puis la pause (sa raison prime, et une pause illisible laisse le créneau
      dû, sans saut), puis le saut. `skipRun` prend la raison en paramètre.
- [ ] `word.ts` : `noLetter = 'pause'` seulement si la raison est `en pause`. Test dans le fichier de test du mot.
- [ ] `main.ts` lit `ROUTINES_CATCHUP` après `loadRootEnv()`, comme les autres. Seul `0` coupe, et une ligne au
      démarrage le dit.
- [ ] `README.md`, tableau des variables ; `.env.example`, la ligne en commentaire.

### 3. lun-anima#59 (`core/src/testing/fake-satellite.ts`)

- [ ] Test d'abord : avec une horloge qui avance, deux `emit` rendent chacun `at` égal à `clock()` en ISO. Sans
      `clock`, la date fixe et son pas d'une seconde restent.
- [ ] Le constructeur prend `clock?: () => Date`. Sans lui, la date fixe et son pas d'une seconde par événement restent.

### 4. Livrer

- [ ] Relecture (agent reviewer) sur chaque diff.
- [ ] Deux PR avec `lun-livrer`, critères cochés et preuves.
