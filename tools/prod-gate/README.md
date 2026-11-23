# La porte de l'hôte de prod

`prod-gate.sh` est la garde des commandes qu'une session d'agent joue sur la prod
([`standards/environnements.md`](../../standards/environnements.md), « Jouer une commande sur la prod »).
La clé SSH de la session n'autorise qu'un programme sur l'hôte : cette porte. Elle lit la demande comme le
nom d'un **geste** suivi d'arguments, ne l'évalue jamais, cherche le geste dans la table écrite dans son
propre texte, vérifie chaque argument et lance la commande écrite là. Tout le reste est refusé sans rien
exécuter, avec une ligne au journal.

**Ce qu'elle borne, et ce qu'elle ne borne pas.** Le compte de la session peut lancer le moteur de
conteneurs, ce qui vaut tous les droits sur l'hôte. La porte borne ce que la clé peut demander par SSH, pas
le compte. Le dossier du déploiement est inscriptible par ce compte (le script de déploiement y écrit) :
ses fichiers ne sont pas protégés par la porte.

Sur le laptop, le lanceur `plugin/hooks/prod-run.mjs` et le hook du plugin ne sont qu'un **filet** contre
l'erreur : ils tournent sous le même utilisateur que la session, qui peut les défaire. La garde, c'est la
porte, parce qu'elle est posée **hors d'atteinte** du compte de la session.

## Ce qu'elle joue

`gestes` donne la liste, avec ce que rend chaque geste ; `version` le numéro de la porte. Lecture : `ps`,
`health <app>`, `volumes`, `versions`, `memory`, `container-memory`, `space`, `services`, `copy-line <app>`,
`copies <app>`, `node-time <app>`, `image-digest <app>`, `env-length <app> <name>`. Action : `up`,
`start <app>`, `stop <app>`, `restart <app>`, `pull`, `volumes-create`, `deploy <app> <version|rollback>`,
`trial-load <app> <date>`, `trial-up <app>`, `trial-health <app>`. Chaque geste est un bloc court de
`prod-gate.sh`, avec sa commande en clair.

Une demande tient en 200 caractères et quatre mots, séparés par une seule espace, dans `[A-Za-z0-9./_ -]`.

| Code | Sens |
|---|---|
| celui de la commande | un geste a été joué |
| 64 | demande illisible : vide (une session interactive), un caractère hors du jeu, trop longue |
| 65 | geste inconnu (toute commande ordinaire, une copie de fichier) |
| 66 | argument hors de sa forme, ou leur nombre |
| 67 | le journal ne s'écrit pas : rien n'est joué |
| 68 | le dossier de déploiement est inaccessible : rien n'est joué |
| 69 | une valeur de l'en-tête est hors de sa forme : rien n'est joué |

- **Le journal** reçoit une ligne par demande : la date en UTC, le premier mot (32 caractères au plus, ses
  caractères inattendus masqués), `accepted` ou `refused` ; jamais la demande entière.
- **Les erreurs** de l'outil de pile et du script de déploiement peuvent citer une ligne d'un fichier
  d'environnement ou d'un journal : elles restent sur l'hôte, dans `<journal>.errors`. La session reçoit le
  code de sortie et une ligne fixe ; c'est CrOliX qui lit ce fichier. Rien ne borne ces deux fichiers : les
  faire tourner à la main ou par l'outil de l'hôte.
- **L'environnement** : la porte se relance sous un environnement vide (la demande et le dossier personnel
  seuls), fixe son chemin de recherche et coupe l'entrée de la session.
- **Une connexion coupée** pendant un geste ne tue rien : le script de déploiement sort par son chemin
  d'erreur à sa prochaine écriture, donc avec son rattrapage ; un tirage est toujours suivi de la
  déconnexion du registre.

## La poser

C'est CrOliX qui la pose, avec un compte d'administration de l'hôte, jamais la session.

**Avant tout : sur un NAS, SSH se règle par l'interface du système.** Elle peut récrire la configuration du
serveur SSH à chaque changement (activer, couper, la coupure automatique) et à chaque mise à jour.
Recontrôler la configuration effective (étape 6) après chaque changement fait dans l'interface. Si le
système a un dossier d'inclusion qu'il ne récrit pas (Debian : `/etc/ssh/sshd_config.d/`, lu en tête de
`sshd_config` ; **à vérifier sur l'hôte**), y poser le bloc dans un fichier à lui. Garder une session
d'administration ouverte pendant toute la pose, et ne la fermer qu'après avoir rouvert une seconde session
avec son propre compte.

1. **Le script.** Le copier dans un dossier de root, non inscriptible par le compte de la session, comme
   tous ses dossiers parents (`chown root:root`, `chmod 755` sur le dossier et sur le script). Montrer le
   propriétaire et les droits de chaque dossier du chemin :

   ```
   namei -l /opt/example-gate/prod-gate.sh
   ```

2. **L'en-tête.** Remplir les valeurs en tête du script, entre guillemets simples ; rien d'autre ne les
   change. `LUN_SHELL` (le shell qui relance la porte), `LUN_PATH` (les dossiers où chercher les commandes,
   celui du moteur de conteneurs compris), `LUN_DEPLOY_DIR` et `LUN_DEPLOY_SCRIPT` (le dossier de la pile,
   le nom de son script de déploiement), `LUN_COPIES` (le dossier des copies des bases), `LUN_APPS`,
   `LUN_VOLUMES`, `LUN_ENV_FILE_PREFIX` (le début du nom du fichier d'environnement d'une app),
   `LUN_ENV_NAMES` (les seuls noms dont `env-length` donne la longueur), `LUN_REGISTRY`, `LUN_COPY_LINE` (le
   texte fixe, d'au moins trois caractères, que `copy-line` cherche tel quel dans le journal d'une app),
   `LUN_TRIAL_FILE`, `LUN_TRIAL_PREFIX`, `LUN_TRIAL_COPIES`, `LUN_BASE_DIR`, `LUN_BASE_EXT` (la pile
   d'essai : son fichier, le préfixe de ses services, où elle monte les copies, le dossier et l'extension
   d'une base), `LUN_GATE_LOG` (le journal).
3. **Le journal.** Créer le journal et `<journal>.errors` dans un dossier de root, puis les donner au
   compte de la session (`chmod 600`) : il y ajoute des lignes, il ne peut pas remplacer le dossier. En
   option, si le système de fichiers le permet, les passer en ajout seul (`chattr +a`).
4. **Le compte de la session.** Sans mot de passe utilisable (`passwd -l`). Son dossier personnel
   appartient à root et ne garde **aucun fichier de clés** ni fichier de démarrage du shell ; seul le dossier
   de configuration du moteur de conteneurs y appartient au compte (le tirage s'y connecte et s'en
   déconnecte). Son shell de connexion est un `sh` : c'est lui qui lance la porte.
5. **Le bloc du serveur SSH, pour ce compte seulement.** Ne pas changer le fichier des clés autorisées de
   tout le serveur : cela retirerait leurs clés à tous les autres comptes, celui de CrOliX compris.

   ```
   Match User session-example
       AuthorizedKeysFile /etc/ssh/keys-example/%u
       ForceCommand /opt/example-gate/prod-gate.sh
       AuthenticationMethods publickey
       PasswordAuthentication no
       KbdInteractiveAuthentication no
       PermitTTY no
       DisableForwarding yes
       PermitTunnel no
       PermitUserRC no
   ```

   Le fichier `/etc/ssh/keys-example/session-example` appartient à root (`chmod 644`, dossier `755`) et
   tient **une seule ligne**, la clé publique de la session précédée de ses options :

   ```
   restrict,command="/opt/example-gate/prod-gate.sh" ssh-ed25519 AAAA...example session-example
   ```

   La commande forcée est posée deux fois : dans le bloc, elle vaut pour toute clé du compte, même une
   seconde ajoutée sans options ; sur la ligne, elle tient encore si le bloc disparaît. Si le volume de la
   porte interdit l'exécution, les deux prennent la forme `/bin/sh /opt/example-gate/prod-gate.sh`.
6. **La configuration effective de ce compte**, pas la générale, puis recharger le serveur SSH :

   ```
   sshd -T -C user=session-example,host=example,addr=192.0.2.10 | grep -i -E '^(authorizedkeysfile|forcecommand|authenticationmethods|passwordauthentication|kbdinteractiveauthentication|permittty|disableforwarding|permittunnel|permituserrc|permituserenvironment|acceptenv)'
   ```

   Elle doit montrer les valeurs du bloc, et `permituserenvironment no`. La rejouer avec le compte de
   CrOliX : son `authorizedkeysfile` et ses droits n'ont pas changé.
7. **Les fichiers d'environnement.** CrOliX les contrôle lui-même avant le premier geste : une ligne mal
   formée ferait échouer l'outil de pile. Dans le dossier de la pile, cette commande ne doit rien afficher :
   `grep -n -v -E '^([A-Za-z_][A-Za-z0-9_]*=.*|#.*|)$' <chaque fichier d'environnement>`.
8. **Le laptop.** Les variables du lanceur et du filet : `standards/environnements.md`.

**Si le bloc disparaît** (une récriture par l'interface) : le serveur relit le fichier de clés par défaut,
dans le dossier personnel du compte. Il n'y en a pas : la clé n'ouvre plus rien, la porte reste fermée. C'est
le bon sens d'échec, et il tient à l'étape 4. L'inverse arriverait si une clé de la session était aussi
dans le dossier personnel sans options, ou si le compte avait un mot de passe et que le serveur les accepte.

Ce que dit la documentation d'OpenSSH (`sshd_config(5)`, `sshd(8)`, `ssh(1)`) : toutes les directives du
bloc sont admises après `Match` (`PermitUserEnvironment` ne l'est pas : il se contrôle dans la configuration
générale) ; `AuthorizedKeysFile` accepte un chemin absolu avec `%u` ; `ForceCommand` ignore la commande du
client et `~/.ssh/rc`, vaut pour un shell, une commande ou un sous-système, est lancée par le shell de
connexion du compte, et l'emporte sur `command=` ; `DisableForwarding` coupe tout transfert (X11, agent,
TCP, StreamLocal) ; `restrict` coupe le transfert, le terminal et `~/.ssh/rc`, et toute restriction ajoutée
plus tard ; la demande d'origine arrive dans `SSH_ORIGINAL_COMMAND` ; pour chaque directive, la première
valeur lue l'emporte ; `sshd -T` affiche la configuration effective, `-C` lui donne les critères d'un
`Match`. Elle ne dit pas ce que vaut la variable pour une session sans commande ni pour une copie : la porte
ne s'y fie pas, une demande absente ou vide est refusée (64), et ce qu'envoie un client de copie n'est pas
un geste (65). Elle ne dit pas non plus où finit un `Match` ouvert dans un fichier inclus : d'où le
contrôle avec le compte de CrOliX.

## Vérifier qu'elle tient

Depuis le terminal de CrOliX, avec la clé de la session :

- **un refus attendu** : `ssh -i <clé> <compte>@<hôte> id` sort en 65, sans rien afficher d'autre ;
- **une session interactive refusée** : `ssh -i <clé> <compte>@<hôte>` sort en 64, sans invite ;
- **une copie refusée** : `scp -i <clé> un-fichier <compte>@<hôte>:` échoue ;
- **un transfert refusé** : avec `-L 8080:localhost:80`, `gestes` répond mais le port n'est pas ouvert ;
- **la liste** : `node prod-run.mjs gestes`, puis `node prod-run.mjs version` ;
- **le journal** : sur l'hôte, une ligne par essai ci-dessus, `refused` ou `accepted`.

À refaire après chaque changement de la porte, des clés, du serveur SSH ou de l'interface du NAS.

## Ce qu'elle ne ferme pas

- **Ce que fait un geste autorisé une fois lancé** : `deploy` joue le script de déploiement de la pile, les
  gestes `trial-*` écrivent dans le volume d'essai ; la porte ne voit que leur appel. Ce que ce script
  écrit sur sa sortie ordinaire arrive à la session.
- **Un script déjà sur l'hôte**, et les fichiers de la pile : s'ils changent, les gestes changent de sens.
- **Une porte mal posée** : un dossier ou un fichier de clés que le compte peut écrire, une seconde clé
  ailleurs, un mot de passe, `PermitUserEnvironment` ouvert (une variable comme `LD_PRELOAD` agit avant que
  la porte lise une ligne), un fichier de démarrage du shell du compte, lu avant elle.
- **Le compte, s'il est atteint autrement** : voir en tête.
- La longueur d'une valeur (`env-length`) et les noms et dates des copies (`copies`) sont montrés : rien de
  secret, mais ce n'est pas rien.

## La retirer

Retirer la ligne du fichier des clés du compte : la clé n'ouvre plus rien. Puis retirer le bloc `Match`,
recharger le serveur SSH, supprimer le script et, si on ne les garde pas, le journal et son fichier
d'erreurs.

## Ajouter un geste

Un bloc dans `prod-gate.sh` (le nombre de mots, la vérification de chaque argument, `accept`, la commande en
clair avec ses arguments entre guillemets), sa ligne dans `gestes`, son test dans `prod-gate.test.mjs` (la
commande exacte, les entrées hostiles), puis la relecture de CrOliX, qui repose la porte. Un geste **à
venir** : le contrôle d'intégrité de la base chargée dans l'essai ; il attend de savoir avec quel outil il
se lance dans l'image.

**N'y seront jamais**, et restent à la main de CrOliX : ce qui efface ou remplace une base (retirer un
volume, arrêter une pile avec ses volumes, l'essai compris, remettre une copie), ce qui affiche un secret ou
un code d'appairage (un journal entier, un fichier d'environnement, la configuration résolue), la connexion
au registre, l'élévation de privilège, un shell, tout réglage du système.
