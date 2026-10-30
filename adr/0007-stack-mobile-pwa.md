# ADR 0007 : stack de l'écosystème, le mobile en PWA

Statut : acceptée
Date : 2026-10-30

## Contexte

L'[ADR 0002](0002-stack.md) empaquetait le front de Lun'Anima par Capacitor sur Android, avec des
notifications par FCM. Le cadrage du chantier 6 ([spec](../docs/specs/2026-10-30-apps-core-design.md))
a comparé ce choix à une PWA, avec le même front : seul l'emballage change. Cet ADR reprend l'ADR
0002 en entier ; seul le mobile change.

## Décision

- TypeScript sur Node (`^22.13.0 || >=24`) pour le core et les satellites ; SQLite pour l'état.
- Un seul front Svelte 5 + Vite pour les apps de Lun'Anima, servi par le core. Sur Android, c'est une
  **PWA** installée depuis Chrome, notifiée par **Web Push** (clés VAPID du core). Sur desktop, la
  même app, empaquetée par **Tauri 2** quand les capacités PC arrivent (voix, avatar). Les fronts
  autonomes des satellites sont aussi en Svelte.
- Astro pour le website. Python réservé aux services externes qui l'imposent.
- Outillage commun dans `templates/ts/` : Prettier, ESLint, `tsc` strict, Vitest, hooks git, CI
  avec vérification des adresses internes.
- Prod : images Docker amd64 sur GHCR, NAS Intel N100.

## Conséquences

- Une seule langue à maintenir, des types partagés entre serveur et écrans.
- Desktop et mobile partagent leurs écrans : une fonction s'écrit une fois.
- Pas de chaîne Android, pas de projet Firebase, pas de clé de compte de service Google dans le core.
- Une mise à jour du core met l'app mobile à jour, sans réinstallation.
- L'app mobile demande un contexte sûr (HTTPS), y compris en réseau local.
- Un P0 sonne et vibre, mais ne perce pas le mode Ne pas déranger ; le jeton reste dans le navigateur.
- L'app desktop lance ses services sans console et se met à jour seule.
- TypeScript est figé en 6.0 tant que `typescript-eslint` ne gère pas la 7.

## Alternatives écartées

- **Capacitor** (ADR 0002) : chaîne Android, projet Firebase et un APK à réinstaller à chaque
  version. Il reste la porte de sortie si une limite de la PWA se montre (P0 en alarme, empreinte,
  coffre-fort du jeton, arrière-plan) : le front ne change pas.
- **Electron** : plus lourd en mémoire à côté d'un jeu ou d'un stream.
- **Flutter** pour le mobile : une seconde langue et un second front à maintenir.
- **React Native / Expo** : un front différent de celui du desktop.
- **Fichiers JSON** comme stockage : pas de requêtes, pas de transactions.
