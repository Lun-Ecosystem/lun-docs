# ADR 0006 : le graphe d'Avaritia s'affiche avec Sigma.js et graphology

Statut : acceptée
Date : 2026-10-28

## Contexte

L'écran du graphe de la [spec d'Avaritia v1](../docs/specs/2026-10-28-lun-avaritia-v1-design.md)
(§5) doit rester fluide avec des milliers de fiches : déplacement, zoom, filtres, centrage sur une
fiche. Les services tournent sur un serveur, comme le NAS, et sont servis au navigateur. Le rendu est
donc côté client. Le serveur ne calcule rien.

## Décision

- **Sigma.js 3 + graphology** pour le rendu (WebGL) et la structure du graphe.
- Mise en page par **graphology-layout-forceatlas2**, dans un worker, pour ne pas bloquer l'écran.
- Les positions ne sont pas stockées en v1. Elles sont recalculées à l'ouverture.

## Conséquences

- Sigma est chargé à part, par `import()`, seulement sur l'écran du graphe.
- Sans WebGL, pas de rendu : l'écran affiche un message d'état vide.
- L'habillage passe par les jetons : les couleurs sont lues sur `:root`.
- Mémoriser les positions, si le recalcul gêne, demandera un nouvel ADR.

## Alternatives écartées

- **Cytoscape.js** (Canvas) : complet, mais il ralentit au-delà de quelques milliers de nœuds.
- **d3-force + SVG** : lent au-delà de quelques centaines de nœuds.
- **vis-network** (Canvas) : maintenance faible.
