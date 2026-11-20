# ADR 0014 : le MVP tourne sur le NAS, Lun'Luxuria sur le desktop

Statut : acceptée
Date : 2026-11-20

## Contexte

L'ADR 0008 (30/10) faisait tourner l'écosystème en continu sur le NAS. L'ADR 0012 (12/11) l'en a retiré pour une
machine dédiée, à partir d'un mot de CrOliX du 10/11 qui visait un serveur dédié « à terme », sans achat ni date.
Écrite comme une décision présente, elle laissait l'écosystème sans hôte : ni le desktop ni le laptop ne restent
allumés, et la machine n'existe pas. CrOliX le corrige le 20/11 : « le but du MVP est de tourner sur le NAS, hors
Luxuria, qui est un exe sur le desktop ».

## Décision

- **Le core, Lun'Acedia et Lun'Avaritia tournent en continu sur le NAS**, chacun dans son conteneur, avec sa base.
- **Lun'Luxuria est une application du desktop**, reliée au core du NAS. Rien d'autre de l'écosystème ne tourne sur
  le desktop en usage.
- **Le MVP se valide là** : la semaine de rodage se joue sur le NAS, directement. Il démarre sur des bases neuves,
  avec le vrai compte Google.
- **L'accès depuis l'extérieur est celui de l'ADR 0008**, inchangé : Tailscale au MVP, le HTTPS terminé sur le NAS,
  la cible sans client (un domaine, Caddy, un VPS qui relaie le flux encore chiffré, les passkeys), et la porte dans
  le déploiement, jamais dans le code.
- **Le laptop reste le poste de développement**, sans dépendance au NAS ni au desktop. Le desktop reste le banc de
  ce que lui seul prouve : la voix et la fenêtre.
- **Une machine dédiée est une évolution possible, à terme**, sans date : le jour où le NAS ne suffit plus (des
  modèles en local, plus de puissance). Elle fera alors l'objet de son propre ADR.

## Conséquences

- Restent vraies celles de 0008 : l'adresse publique en configuration, le battement des flux SSE, le TLS hors boucle
  locale sans porte, les PWA et Web Push par l'adresse HTTPS, les jetons d'appareil.
- La mise en service du NAS est un chantier d'avant le MVP ; le [plan du 08/11](../docs/plans/2026-11-08-bascule-nas.md)
  en est la base, avec des bases neuves au lieu de celles d'un rodage.
- Ce qui conditionne la semaine se vérifie sur le NAS : Google en production, le téléphone, le redémarrage, une
  restauration. Sur le desktop : la voix.
- Une mise à jour : une release, une image publiée, le NAS la récupère, un contrôle de santé, un retour arrière en une
  commande.
- Aucun test ne dépend du NAS (`vision.md`, « Points noirs ») : tout se prouve d'abord en local.

## Alternatives écartées

- **Le rodage sur le desktop, puis le NAS** (08/11) : le desktop ne reste pas allumé ; deux mises en service.
- **La machine dédiée dès maintenant** (0012) : elle n'existe pas, et rien ne tourne en l'attendant.
