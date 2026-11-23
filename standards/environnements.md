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

## Jouer une commande sur la prod

Une session d'agent ne joue sur la prod que des **gestes écrits d'avance**. Lui sont interdits : ce qui
efface, ce qui peut afficher un secret ou un code d'appairage, l'élévation de privilège, tout réglage du
système. Devant un imprévu elle s'arrête et CrOliX tranche.

**La garde est la porte, sur l'hôte** : la clé de la session n'y autorise qu'un programme, posé par CrOliX
hors d'atteinte du compte de la session, qui ne joue que les gestes de sa propre table. Comment la poser, la
vérifier, ce qu'elle ne ferme pas : [`tools/prod-gate/README.md`](../tools/prod-gate/README.md).

**Sur le laptop, un lanceur et un filet contre l'erreur, qui n'est pas la garde** : ils tournent sous le
même utilisateur que la session, qui peut les défaire.

- **Le lanceur** : `node <plugin>/hooks/prod-run.mjs <geste> [arguments]` (`gestes` en donne la liste). Il
  envoie le nom du geste et ses arguments, rien d'autre, par `ssh` lancé sans shell, sans la configuration
  SSH du poste, sans terminal ni transfert, vers le premier hôte déclaré. Sous Windows il prend le client
  SSH de Git quand il existe : c'est lui qui joint l'agent de clés de Git Bash, où la clé est chargée (la
  variable de l'agent doit être dans l'environnement de la session). La porte vérifie pour de bon. Un geste
  long (`deploy`, `pull`) se lance avec un délai long ou en arrière-plan : le lanceur ne coupe rien lui-même.
- **Le filet** : quand des hôtes de prod sont déclarés, le hook du plugin refuse une ligne de commande ou
  un texte écrit qui en nomme un, un client SSH dont la cible n'est pas lisible (une variable, une
  substitution), une commande encodée, un contexte distant du moteur de conteneurs. Ses refus sont fixes,
  sans un mot de la commande.
- **Son prix**, sur le poste où il est actif : citer un hôte de prod est refusé partout, même dans un
  message de commit ou une note ; un client SSH avec une variable ou une parenthèse sur sa ligne, même vers
  un autre hôte ; tout contexte du moteur de conteneurs, même local.
- **L'activer** : des variables d'environnement, posées avant d'ouvrir la session. `LUN_PROD_SSH_HOSTS` :
  les hôtes de prod sous tous leurs noms, le premier étant celui que le lanceur appelle ;
  `LUN_PROD_SSH_USER`, `LUN_PROD_SSH_IDENTITY` (le fichier de la clé de la session) et, au besoin,
  `LUN_PROD_SSH_PORT`. Un nom d'hôte de moins de 4 caractères ou trop commun fait refuser **tout** par le
  hook, qui dit quoi corriger : s'ouvrir en silence éteindrait le filet. Sans `LUN_PROD_SSH_HOSTS`, le filet
  est inactif et silencieux.

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
