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

Une session d'agent ne joue sur la prod, par SSH, qu'une **liste fermée** de commandes écrite d'avance.
Lui sont interdits : ce qui efface, ce qui peut afficher un secret ou un code d'appairage, l'élévation de
privilège, une session interactive, tout réglage du système, toute copie de fichier vers la prod ou depuis
elle. Devant une commande imprévue ou un refus, elle s'arrête : CrOliX tranche, et joue lui-même ce qui
sort de la liste.

Le hook de garde du plugin fait tenir cette règle (`plugin/hooks/prod-ssh.mjs`), avant chaque commande
Bash ou PowerShell. **Une ceinture de plus, pas une preuve de sûreté.**

- **L'activer** : deux variables d'environnement, posées sur le poste avant d'ouvrir la session.
  `LUN_PROD_SSH_HOSTS` : les hôtes de prod, séparés par une virgule ou une espace, **sous tous leurs noms**
  (nom court, nom complet, adresse). `LUN_PROD_SSH_ALLOW_FILE` : le chemin de la liste, un fichier hors de
  tout dépôt ; son exemple est `plugin/hooks/prod-ssh-allow.example`.
- **Sans `LUN_PROD_SSH_HOSTS`, la garde est inactive et silencieuse** : rien ne dit qu'elle manque. Des
  hôtes déclarés sans liste lisible : tout SSH vers la prod est refusé.
- **Une ligne de la liste** est une commande écrite comme dans un shell : des mots littéraux, des
  guillemets pour grouper un mot, `|` pour un tube, et quatre jokers d'un seul mot : `<app>`, `<version>`
  (`1.2.3`), `<int>` (1 à 6 chiffres), `<path>` (un chemin absolu, sans `..`). Une commande ne passe que si
  elle correspond **en entier** à une ligne ; chaque morceau d'une chaîne (`;`, `&&`, `||`) à la sienne.
- **Une seconde barrière, dans le code**, refuse même ce qu'une ligne couvrirait : `sudo`, un shell ou un
  interpréteur, ce qui efface ou écrase, un `docker run`, un `exec` interactif ou d'environnement, une
  inspection sans format ou dont le format sort autre chose que des champs nommés, la configuration
  résolue d'une pile, un journal qui n'est pas borné et filtré, un fichier d'environnement, une clé, un
  transfert de port.
- **Ce qu'elle ne sait pas lire est refusé** quand la cible est la prod : une variable, une substitution,
  un échappement, un joker de fichier, une redirection, une cible SSH non résolue (`ssh $HOTE`), une option
  SSH hors de la courte liste admise, un tube ou un fichier qui alimente la commande. Sont refusés aussi,
  dès que les hôtes sont déclarés : tout contexte du moteur de conteneurs (`docker context`, `--context`,
  `DOCKER_CONTEXT`), **même local**, car la garde ne sait pas le résoudre ; et une ligne qui nomme un hôte
  de prod avec un heredoc, un accent grave ou un guillemet échappé, même dans un message de commit.
- Le refus nomme le premier mot de la commande, jamais ses arguments, et renvoie ici.

**Ce qu'elle ne voit pas** : une commande lancée par un autre outil que Bash ou PowerShell ; un script
déjà présent sur l'hôte (elle ne voit que son appel) et ce que fait une commande autorisée une fois lancée ;
un hôte de prod non déclaré, ou un alias de la configuration SSH qui y mène sous un autre nom ; un alias de
shell, une fonction ou une variable définis dans une session précédente ; un programme ou un script local
qui ouvre SSH sans nommer l'hôte, un dépôt git dont le distant est sur la prod ; une ligne maquillée exprès
pour tromper son découpage ; ce que CrOliX tape dans son propre terminal.

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
