# La porte de l'hôte de prod

`prod-gate.sh` est la garde des commandes qu'une session d'agent joue sur la prod
([`standards/environnements.md`](../../standards/environnements.md), « Jouer une commande sur la prod »).
La clé SSH de la session n'autorise qu'un programme sur l'hôte : cette porte. Elle lit la demande comme le
nom d'un **geste** suivi d'arguments, ne l'évalue jamais, cherche le geste dans la table écrite dans son
propre texte, vérifie chaque argument et lance la commande écrite là. Tout le reste est refusé sans rien
exécuter, avec une ligne au journal.

Sur le laptop, le lanceur `plugin/hooks/prod-run.mjs` et le hook du plugin ne sont qu'un **filet** contre
l'erreur : ils tournent sous le même utilisateur que la session, qui peut les défaire. La garde, c'est la
porte, parce qu'elle est posée **hors d'atteinte** du compte de la session.

## Ce qu'elle joue

`gestes` donne la liste, `version` le numéro de la porte. Lecture : `ps`, `health <app>`, `volumes`,
`versions`, `memory`, `space`, `services`, `copy-line <app>`, `copies <app>`, `node-time <app>`,
`image-digest <app>`, `env-length <app> <name>`. Action : `up`, `start <app>`, `stop <app>`, `restart <app>`,
`pull`, `volumes-create`, `deploy <app> <version|rollback>`, `trial-load <app> <date>`, `trial-up <app>`,
`trial-health <app>`. Chaque geste est un bloc court de `prod-gate.sh`, avec sa commande en clair.

Une demande tient en 200 caractères et quatre mots, séparés par une seule espace, dans `[A-Za-z0-9./_ -]`.

| Code | Sens |
|---|---|
| celui de la commande | un geste a été joué |
| 64 | demande illisible : vide (une session interactive), un caractère hors du jeu, trop longue |
| 65 | geste inconnu (toute commande ordinaire, une copie de fichier) |
| 66 | argument hors de sa forme, ou leur nombre |
| 67 | le journal ne s'écrit pas : rien n'est joué |
| 68 | le dossier de déploiement est inaccessible : rien n'est joué |

Le journal reçoit une ligne par demande : la date en UTC, le premier mot (32 caractères au plus, ses
caractères inattendus masqués), `accepted` ou `refused` ; jamais la demande entière. Rien ne le borne : le
faire tourner à la main ou par l'outil de l'hôte.

## La poser

C'est CrOliX qui la pose, avec un compte d'administration de l'hôte, jamais la session.

1. **Le script.** Le copier dans un dossier qui appartient à un autre compte que celui de la session (root),
   non inscriptible par lui, comme tous ses dossiers parents : `chown root:root`, `chmod 755` sur le dossier
   et sur le script. Le compte de la session le lit et l'exécute, il ne peut ni le modifier ni le remplacer.
2. **L'en-tête.** Remplir les huit valeurs en tête du script, entre guillemets simples ; rien d'autre ne les
   change, l'environnement de la session non plus :
   `LUN_PATH` (les dossiers où chercher les commandes, celui du moteur de conteneurs compris),
   `LUN_DEPLOY_DIR` (le dossier de la pile), `LUN_COPIES` (le dossier des copies des bases), `LUN_APPS` (les
   noms des apps, séparés par une espace), `LUN_VOLUMES` (les volumes des bases), `LUN_ENV_NAMES` (les seuls
   noms dont `env-length` donne la longueur), `LUN_REGISTRY` (le registre à quitter après un tirage),
   `LUN_GATE_LOG` (le journal). Les gestes `trial-*` nomment le fichier de la pile d'essai et ses services
   dans leur bloc : les ajuster là si la pile les nomme autrement.
3. **Le journal.** Créer le fichier dans un dossier de root, puis le donner au compte de la session
   (`chmod 600`) : il doit pouvoir y ajouter une ligne, pas remplacer le dossier.
4. **Les clés autorisées.** Par défaut le fichier est dans le dossier personnel du compte, qui peut donc le
   récrire. Le sortir de là : dans la configuration de `sshd`, `AuthorizedKeysFile` accepte un chemin absolu
   avec `%u` (par exemple un dossier de root, un fichier par compte) ; le fichier appartient à root, `chmod
   644`. Y mettre **une seule ligne**, la clé publique de la session précédée de ses options :

   ```
   restrict,command="/opt/example-gate/prod-gate.sh" ssh-ed25519 AAAA...example session-example
   ```

   Puis recharger `sshd`, et contrôler ce qu'il applique (`sshd -T`) : `authorizedkeysfile` est le chemin
   posé, `permituserenvironment no`, aucun `acceptenv`. Le compte n'a ni mot de passe utilisable ni autre
   clé ; son shell de connexion est un `sh` (c'est lui qui lance la porte). Une mise à jour du système de
   l'hôte peut récrire cette configuration : la recontrôler après.
5. **Le laptop.** Les variables du lanceur et du filet : `standards/environnements.md`.

Ce que dit la documentation d'OpenSSH (`sshd(8)`, « AUTHORIZED_KEYS FILE FORMAT » ; `sshd_config(5)` ;
`ssh(1)`) : `restrict` coupe le transfert de port, d'agent et de X11, le terminal et `~/.ssh/rc`, et toute
restriction ajoutée plus tard ; `command="…"` remplace ce que le client demande, pour un shell, une commande
ou un sous-système, et la demande d'origine arrive dans `SSH_ORIGINAL_COMMAND` ; les options se séparent par
des virgules, sans espace hors des guillemets ; la commande forcée est lancée par le shell de connexion du
compte. Elle ne dit pas ce que vaut la variable pour une session sans commande ni pour une copie : la porte
ne s'y fie pas, une demande absente ou vide est refusée (64), et ce qu'envoie un client de copie n'est pas
un geste (65).

## Vérifier qu'elle tient

Depuis le terminal de CrOliX, avec la clé de la session :

- **un refus attendu** : `ssh -i <clé> <compte>@<hôte> id` sort en 65, sans rien afficher d'autre ;
- **une session interactive refusée** : `ssh -i <clé> <compte>@<hôte>` sort en 64, sans invite ;
- **une copie refusée** : `scp -i <clé> un-fichier <compte>@<hôte>:` échoue ;
- **un transfert refusé** : avec `-L 8080:localhost:80`, `gestes` répond mais le port n'est pas ouvert ;
- **la liste** : `node prod-run.mjs gestes`, puis `node prod-run.mjs version` ;
- **le journal** : sur l'hôte, une ligne par essai ci-dessus, `refused` ou `accepted`.

À refaire après chaque changement de la porte, des clés ou de `sshd`.

## Ce qu'elle ne ferme pas

- **Ce que fait un geste autorisé une fois lancé** : `deploy` joue le script de déploiement de la pile, les
  gestes `trial-*` écrivent dans le volume d'essai ; la porte ne voit que leur appel. Si ce script affiche
  des lignes brutes d'un journal quand un déploiement échoue, elles arrivent à la session : c'est à lui de
  les filtrer.
- **Un script déjà sur l'hôte**, et les fichiers de la pile : s'ils changent, les gestes changent de sens.
- **Une porte mal posée** : un dossier ou un fichier de clés que le compte peut écrire, une seconde clé sans
  options, un mot de passe, `PermitUserEnvironment` ou `AcceptEnv` ouverts (la porte fixe son chemin de
  recherche, coupe l'entrée de la session et retire les variables qui détournent le moteur de conteneurs,
  pas toutes les autres), un fichier de démarrage du shell du compte, lu avant elle.
- **Le compte, s'il est atteint autrement**. La porte borne la clé, pas le compte : il lance le moteur de
  conteneurs, ce qui vaut tous les droits sur l'hôte par une autre voie.
- La longueur d'une valeur (`env-length`) et les noms et dates des copies (`copies`) sont montrés : rien de
  secret, mais ce n'est pas rien.

## La retirer

Retirer la ligne du fichier des clés autorisées : la clé n'ouvre plus rien. Puis supprimer le script et, si
on ne le garde pas, le journal. Remettre `AuthorizedKeysFile` comme avant s'il n'a servi qu'à cela.

## Ajouter un geste

Un bloc dans `prod-gate.sh` (un commentaire d'une ligne, le nombre de mots, la vérification de chaque
argument, `accept`, la commande en clair avec ses arguments entre guillemets), sa ligne dans `gestes`, son
test dans `prod-gate.test.mjs` (la commande exacte, les entrées hostiles), puis la relecture de CrOliX, qui
repose la porte. Un geste **à venir** : le contrôle d'intégrité de la base chargée dans l'essai ; il attend
de savoir avec quel outil il se lance dans l'image.

**N'y seront jamais**, et restent à la main de CrOliX : ce qui efface ou remplace une base (retirer un
volume, arrêter une pile avec ses volumes, l'essai compris, remettre une copie), ce qui affiche un secret ou
un code d'appairage (un journal entier, un fichier d'environnement, la configuration résolue), l'élévation
de privilège, un shell, tout réglage du système.
