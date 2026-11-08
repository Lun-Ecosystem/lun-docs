# Environnements

> Deux rôles, local et prod. Pendant le rodage du MVP, la prod est le desktop de CrOliX ; le NAS la
> reprend ensuite (audit du 08/11, Q1).

| Env | Où | Rôle |
|---|---|---|
| **Local** | Le laptop ou tout poste de développement, **sans dépendance au NAS ni au desktop** | Développer et prouver chaque chantier de bout en bout |
| **Prod du rodage** | Le desktop | Usage quotidien du MVP ; seul banc pour ce que lui seul prouve (voix, fenêtre Tauri, services) |
| **Prod ensuite** | Le NAS | Usage continu, après le rodage |

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
Chaque app garde la sienne, partout (README, docs, liens) : Acedia `http://localhost:8787`, l'adresse
de retour enregistrée chez Google ; le core `127.0.0.1:8788` ; Avaritia `127.0.0.1:8789` ; la page de
Luxuria `127.0.0.1:5180`.

## Prod du rodage : le desktop

- Il suit `main`, avec le vrai compte Google ; sa mise en service et ses mises à jour sont dans
  [`mise-en-service-desktop.md`](../docs/mise-en-service-desktop.md).
- Une PR *Ask* ([`git.md`](git.md)) s'y essaie dans une copie de travail à part, sur des bases de
  recette : les bases du rodage ne servent jamais à un essai.

## Prod ensuite : le NAS

1. Merge sur `main`, puis release.
2. Image Docker versionnée publiée sur GHCR.
3. Le NAS récupère l'image.
4. Contrôle de santé automatique juste après le déploiement.
5. En cas de problème : retour à l'image précédente en une commande.

## Interdit

- Toute doc du type « tests à faire une fois sur le NAS ».
- Tester une version non mergée sur une prod, hors du banc décrit pour le desktop.
- Utiliser le vrai compte Google ailleurs que sur la prod.
