# lun-docs

> Projet de l'écosystème Lun'. Les règles communes (méthode, git, qualité, design) viennent du plugin
> `lun` et de ce dépôt, qui font foi. Ce fichier ne garde que ce qui est propre à lun-docs. 100 lignes maximum.

## Ce projet

- **Rôle** : referentiel, inscrit dans `registry.yaml` (id `lundocs`).
- **Possède** : les normes (`standards/`), les ADR d'écosystème (`adr/`), le registre, les gabarits (`templates/`), le
  kit et les jetons de design (`design/`), le plugin `lun` (`plugin/`), les specs, les plans et la feuille de route
  (`docs/`).
- **Ne possède pas** : aucun code applicatif. Les apps recopient le kit et les jetons par `tools/sync-kit.mjs` et
  `tools/sync-tokens.mjs`, et leur CI vérifie la copie ; Acedia et Avaritia gardent leur propre kit jusqu'à #43.

## Lancer en local

```bash
npm test && npm run check && npm run sync:check
```

Prérequis : Node 22 ou plus, sans dépendance à installer. Pas de `.env` : rien de secret ici.

Le kit et sa galerie ont leurs propres dépendances, dans `design/` seulement (Node `^22.22.2 || >=24.15`) :

```bash
cd design && npm ci
npm run galerie                                  # la galerie locale : http://127.0.0.1:5190
npm run typecheck && npm test && npm run format:check && npm run build
```

## Spécificités

- **Dépôt public** : aucune adresse interne (`npm run check` les cherche), aucun secret (rien ne les cherche :
  c'est à la relecture), rien des dépôts privés au-delà de leur nom.
- **Les copies du plugin** : `plugin/skills/*/references/` sont générées depuis `standards/` et `vision.md`
  (`tools/standards-map.json`). Modifier l'original, puis `npm run sync` ; `npm run sync:check` échoue sur une
  copie retouchée à la main.
- **Le kit ne se retouche pas pour la galerie**, et rien de la galerie ne vit dans `design/kit/`, que
  `tools/sync-kit.mjs` recopie en entier dans les apps. Un composant ajouté au kit a sa vitrine dans
  `design/galerie/sections/` et sa ligne dans `design/galerie/inventaire.ts` : un test le vérifie.
- **Les limites** (`npm run check`) : un standard tient en 150 lignes, le gabarit `CLAUDE.md` en 100, un ADR en 60
  avec sa ligne « Statut : ».
- **Le registre est lu par le site** sur `main`, à son build : un rôle, une visibilité ou un état hors des listes de
  `tools/check-registry.mjs` casse ce build, comme renommer ou retirer un id qu'il présente (`lunanima`,
  `lunacedia`, `lunavaritia`, `lunluxuria`). Un id s'écrit en minuscules et chiffres.
- **L'avancement** vit dans la feuille de route du MVP (`docs/plans/2026-11-07-feuille-de-route-mvp.md`) ; un plan de
  chantier dans `docs/plans/`, une spec dans `docs/specs/`, la carte de ce qui tourne dans
  `docs/architecture-actuelle.md`.
