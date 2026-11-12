# ADR 0012 : la prod sur une machine dédiée, le NAS pour les copies

Statut : acceptée
Date : 2026-11-12

## Contexte

L'ADR 0008 mettait tout sur le NAS (UGREEN DXP2800). Le 10/11, CrOliX vise une machine dédiée pour la prod, le NAS au
stockage (cadrage de l'état cible, § 6, point 5).

## Décision

- La prod ne tourne pas sur le NAS : une machine dédiée, à la maison, choisie à l'achat, porte les apps et leurs
  bases.
- Le NAS garde les copies et les fichiers.
- L'accès depuis l'extérieur est celui de 0008, déchiffré sur la machine de prod : Tailscale au MVP ; la cible
  (un domaine, Caddy, un VPS qui relaie le flux encore chiffré, les passkeys) inchangée. La porte vit dans le
  déploiement, jamais dans le code.

## Conséquences

Restent vraies celles de 0008 : l'adresse publique en configuration, le battement des flux SSE, le TLS hors boucle
locale sans porte, les PWA et Web Push par l'adresse HTTPS, les jetons d'appareil, le coût de la cible. Le plan de
bascule se refait quand la machine s'achète.

## Alternatives écartées

Tout sur le NAS (0008). Celles que 0008 écartait, pour les mêmes raisons.
