# Environnements

> Deux rôles, local et prod. La prod est le NAS : le core, Lun'Acedia et Lun'Avaritia y tournent en continu.
> Lun'Luxuria est une application du desktop ([ADR 0014](../adr/0014-mvp-sur-le-nas.md)).

| Env | Où | Rôle |
|---|---|---|
| **Local** | Le laptop ou tout poste de développement, **sans dépendance au NAS ni au desktop** | Développer et prouver chaque chantier de bout en bout |
| **Prod** | Le NAS | Usage continu : le core, Acedia et Avaritia, chacun dans son conteneur, avec sa base |
| **Le desktop** | Le poste de CrOliX | Lun'Luxuria, reliée au core du NAS ; seul banc pour ce que lui seul prouve (voix, fenêtre Tauri) |

## Local

- La pile (core et satellites utiles au chantier) démarre comme le dit le README de chaque projet.
- Fonctionne en déplacement : aucune ressource du réseau local de la maison n'est requise.
- Google en local : **un compte Google de test dédié**, pour qu'un tri mal codé ne touche jamais les
  vrais mails.
- Les services externes (LLM, Google) sont appelés directement depuis le poste, avec des clés de
  développement dans un `.env` non versionné.
- Un chantier n'est pas terminé tant que ses critères de fin n'ont pas été vérifiés de bout en bout en
  local.

## Une origine par app

Le jeton d'un appareil est rangé par origine : une app ouverte à une autre adresse redemande un code.
En local, chaque app garde la sienne, partout (README, docs, liens) : Acedia `http://localhost:8787`, l'adresse
de retour enregistrée chez Google ; le core `127.0.0.1:8788` ; Avaritia `127.0.0.1:8789` ; la page de
Luxuria `127.0.0.1:5180`. En prod, chaque app a son nom dans le réseau privé (ADR 0008) : il reste dans la
configuration, jamais dans un dépôt.

## Prod : le NAS

1. Merge sur `main`, puis release.
2. Image Docker versionnée publiée sur GHCR.
3. Le NAS récupère l'image.
4. Contrôle de santé automatique juste après le déploiement.
5. En cas de problème : retour à l'image précédente en une commande.

Le vrai compte Google n'entre que là. Les copies de chaque base y restent, à côté d'elle.

## Le desktop

- Lun'Luxuria s'y installe et s'y ouvre ; elle se relie au core du NAS par un code d'appairage.
- Une PR *Ask* ([`git.md`](git.md)) qui demande la voix ou la fenêtre s'y essaie, contre des serveurs lancés en local
  sur une base de recette, jamais contre la prod ; sa PR dit comment (port, origine).
- Les trois serveurs y ont tourné en recette du 07 au 10/11
  ([`mise-en-service-desktop.md`](../docs/mise-en-service-desktop.md)) : ce n'est plus leur place en usage.

## Interdit

- Toute doc du type « tests à faire une fois sur la prod ».
- Tester une version non mergée sur la prod.
- Utiliser le vrai compte Google ailleurs que sur la prod.
