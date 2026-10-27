# Stack

> Choix communs de l'écosystème, décidés à l'étape 2 : [ADR 0002](../adr/0002-stack.md). Un projet
> qui s'en écarte le justifie par un ADR dans `docs/decisions/`.

## Langages

- **TypeScript** partout côté serveur et front, en mode strict.
- **Node.js** : `^22.13.0 || >=24` ; la CI et les images de prod utilisent la LTS 24.
- **Python** seulement pour les services externes qui l'imposent (RVC). Lun'Gula, existant, reste en
  Python.

## Frameworks

| Usage | Choix |
|---|---|
| Serveurs (core, satellites) | Node + TypeScript ; le framework HTTP est choisi par le premier projet qui en a besoin, par un ADR |
| Front (apps de Lun'Anima, fronts autonomes des satellites) | Svelte 5 + Vite, tokens de [`design.md`](design.md) |
| App desktop | Tauri 2 (zone de notification, démarrage, mises à jour, services lancés sans console) |
| App mobile | Capacitor, Android |
| Website | Astro |
| Écrans | chaque produit a les siens ; les apps du core n'intègrent pas les écrans d'un satellite (contrat satellite, « Fronts ») |

## Données

- **SQLite** pour l'état de chaque service : un utilisateur, une instance. Pas de fichiers JSON comme
  stockage.
- **Cerveau** (le satellite Lun'Avaritia) : fichiers Markdown (convention Obsidian) indexés dans SQLite ; la recherche sémantique
  passe par une API ou un modèle très léger (le NAS n'héberge rien de lourd).

## Outillage qualité

Tout projet TypeScript part de [`templates/ts/`](../templates/ts/), par-dessus `templates/project/` :

| Barrière | Outil | Script |
|---|---|---|
| Format | Prettier (`printWidth` 110, guillemets simples ; Markdown exclu) | `format:check` |
| Lint | ESLint, config plate, `typescript-eslint` recommandé | `lint` |
| Typage | `tsc --noEmit`, `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` | `typecheck` |
| Tests | Vitest | `test` |
| Commits | hook `commit-msg` (Conventional Commits) ; titre de PR vérifié en CI | — |
| Adresses internes | `tools/check-repo.mjs --addresses .` de lun-docs, en CI | — |

Les hooks s'activent avec `git config core.hooksPath hooks` : `pre-commit` (format et lint),
`commit-msg`, `pre-push` (refuse `main`). TypeScript reste en 6.0 tant que `typescript-eslint` ne
prend pas en charge la 7. L'outillage de lun-docs lui-même reste sans dépendance (`node:test`).

## Déploiement

Dans le cadre de [`environnements.md`](environnements.md) : image Docker **amd64** publiée sur GHCR
au tag de version, récupérée par le NAS (UGREEN DXP2800, Intel N100). Les apps desktop et mobile se
distribuent par les releases GitHub de leur dépôt.
