# Environnements

> Deux environnements, pas trois : pour un développeur solo, une recette n'apporte rien si le local
> est complet.

| Env | Où | Rôle |
|---|---|---|
| **Local** | Le PC ou un portable, **sans aucune dépendance au NAS** | Développer et prouver chaque chantier de bout en bout |
| **Prod** | Le NAS | Usage quotidien, **jamais pour tester** |

## Local

- Toute la pile (core et satellites utiles au chantier) démarre en **une commande**, documentée dans
  le README du projet.
- Fonctionne en déplacement : aucune ressource du réseau local de la maison n'est requise.
- Google en local : **un compte Google de test dédié**. Le vrai compte n'est utilisé qu'en prod, pour
  qu'un tri mal codé ne touche jamais les vrais mails.
- Les services externes (LLM, Google) sont appelés directement depuis le poste, avec des clés de
  développement dans un `.env` non versionné.
- Un chantier n'est pas terminé tant que ses critères de fin n'ont pas été vérifiés de bout en bout en
  local.

## Prod

1. Merge sur `main`, puis release.
2. Image Docker versionnée publiée sur GHCR.
3. Le NAS récupère l'image.
4. Contrôle de santé automatique juste après le déploiement.
5. En cas de problème : retour à l'image précédente en une commande.

## Interdit

- Toute doc du type « tests à faire une fois sur le NAS ».
- Tester une version non mergée sur le NAS.
- Utiliser le vrai compte Google en local.
