# ADR 0002 : stack de l'écosystème

Statut : acceptée
Date : 2026-10-19

## Contexte

La replanification de l'étape 2 ([spec](../docs/specs/2026-10-19-ecosysteme-design.md), §9) repart
de zéro. L'ancien écosystème mélangeait panel web lancé à coups de consoles, app mobile Flutter
séparée de son serveur, et stockage JSON. Le MVP doit tenir en dix semaines avec un seul développeur.

## Décision

- TypeScript sur Node (`^22.13.0 || >=24`) pour le core et les satellites ; SQLite pour l'état.
- Un seul front Svelte 5 + Vite pour les apps de Lun'Anima, empaqueté par **Tauri 2** sur desktop et
  par **Capacitor** sur Android ; les fronts autonomes des satellites sont aussi en Svelte.
- Astro pour le website. Python réservé aux services externes qui l'imposent.
- Outillage commun dans `templates/ts/` : Prettier, ESLint, `tsc` strict, Vitest, hooks git, CI
  avec vérification des adresses internes.
- Prod : images Docker amd64 sur GHCR, NAS Intel N100.

## Conséquences

- Une seule langue à maintenir, des types partagés entre serveur et écrans.
- Desktop et mobile partagent leurs écrans : une fonction s'écrit une fois.
- L'app desktop lance ses services sans console et se met à jour seule.
- Le code Flutter de LunAvaritia n'est pas repris.
- TypeScript est figé en 6.0 tant que `typescript-eslint` ne gère pas la 7.

## Alternatives écartées

- **Electron** : plus lourd en mémoire à côté d'un jeu ou d'un stream.
- **Flutter** pour le mobile : une seconde langue et un second front à maintenir.
- **React Native / Expo** : un front différent de celui du desktop.
- **Fichiers JSON** comme stockage : pas de requêtes, pas de transactions.
