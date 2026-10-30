# ADR 0008 : l'accès depuis l'extérieur, déchiffré sur le NAS seulement

Statut : acceptée
Date : 2026-10-30

## Contexte

L'écosystème tourne sur le NAS (UGREEN DXP2800). Le core est le centre de contrôle et la présence de
Natsume ; il renvoie vers les écrans des satellites sans les dupliquer. Il faut un accès protégé
depuis le téléphone, hors de la maison. Le contenu qui passe (mails, mémoire) ne doit être lu en
clair par aucun tiers. Le MVP n'a qu'un utilisateur ; les satellites visent ensuite l'open source.

## Décision

- **Tout tourne sur le NAS**, front et back de chaque projet dans son conteneur ; chaque app sert ses
  propres écrans, **à la racine de son propre nom d'hôte**, et écoute en local.
- **MVP : Tailscale.** Chaque app a son nom dans le tailnet (un conteneur Tailscale à côté d'elle) ;
  `tailscale serve` fait le HTTPS avec un certificat valide (`*.ts.net`), sur le NAS. Le téléphone a
  le client Tailscale. Rien n'est ouvert sur la box.
- **Cible, quand un accès sans client devient nécessaire** : un domaine, Caddy sur le NAS (HTTPS et
  aiguillage par sous-domaine), un VPS loué qui relaie le flux **encore chiffré** dans un tunnel
  WireGuard ouvert par le NAS, et une connexion par passkeys vérifiée sur le NAS.
- Dans les deux cas, **le HTTPS se termine sur le NAS** ; aucun tiers ne voit le contenu.
- **La porte vit dans le déploiement, jamais dans le code** : passer de Tailscale à la cible ne
  change que la configuration (adresses publiques) et le compose.

## Conséquences

- Chaque app lit son **adresse publique** en configuration ; le core connaît celle de chaque
  satellite pour ses liens profonds (un mail précis s'ouvre chez Acedia). Aucun lien du front public
  d'un satellite vers le core.
- Les flux SSE envoient un **battement** régulier : un relais coupe une connexion muette.
- En prod, l'app écoute en local derrière la porte ; l'obligation de TLS hors loopback reste pour
  qui expose une app sans porte.
- La preuve sur téléphone passe par l'adresse du tailnet, plus par le réseau local.
- Les PWA s'installent depuis cette adresse HTTPS ; Web Push en a besoin.
- Les apps gardent leur propre jeton d'appareil, quelle que soit la porte.
- La cible coûte un domaine (une dizaine d'euros par an) et un petit VPS (4 à 5 € par mois).

## Alternatives écartées

- **Cloudflare Tunnel + Access** : gratuit et simple, mais Cloudflare déchiffre et voit les mails.
- **Pangolin sur le VPS** : déchiffre sur le VPS, une machine de plus qui voit tout en clair.
- **Ports ouverts sur la box** : IP de la maison exposée, impossible en CGNAT.
- **Front sur un VPS, back sur le NAS** : une pièce de plus, et le front doit quand même joindre le
  NAS par un tunnel.
