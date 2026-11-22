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

Une session d'agent ne joue sur la prod qu'une **liste fermée** de commandes écrite d'avance. Lui sont
interdits : ce qui efface, ce qui peut afficher un secret ou un code d'appairage, l'élévation de privilège,
tout réglage du système. Devant un imprévu elle s'arrête et CrOliX tranche. Une garde technique fait tenir
cette règle : un lanceur et le hook de garde du plugin. **Une ceinture de plus, pas une preuve de sûreté** :
la vraie borne est côté hôte (une clé qui n'autorise qu'une commande), hors de cette garde.

**Le lanceur**, `plugin/hooks/prod-run.mjs`, est le seul chemin vers la prod :

- `node <plugin>/hooks/prod-run.mjs --list` montre les lignes de la liste, chacune sous son numéro (celui de
  sa ligne dans le fichier) ; `<numéro> [arguments]` en joue une ; `--dry <numéro> [arguments]` montre la
  commande sans la jouer ; `--check` dit si la garde est configurée (`hosts: n`, `lines: n`).
- À chaque appel il relit et contrôle **toute** la liste : une ligne mal écrite, ou refusée par la barrière
  écrite dans son code, l'arrête, nommée par son numéro. Il valide chaque argument contre le joker de la
  ligne, compose la commande depuis la ligne et lance `ssh` lui-même : sans shell, par un chemin absolu
  (celui du système, ou `LUN_PROD_SSH_BIN`), avec des options fixes (ni terminal, ni saisie, ni agent, ni
  port transféré, un délai de connexion), vers le premier hôte déclaré. L'hôte n'est jamais sur la ligne de
  la session ni dans ce qu'il affiche.
- **Une ligne de la liste** : des mots simples, des guillemets simples pour grouper un mot, `|` vers `grep`
  ou `wc -c`, et quatre jokers seuls dans leur mot : `<app>`, `<version>` (`1.2.3`), `<int>` (1 à 6
  chiffres), `<path>` (un chemin absolu sans `..`, derrière `stat` seulement). Ni `;`, ni `&&`, ni
  redirection, ni variable. La barrière refuse `sudo`, un shell, ce qui efface ou écrase, un `docker run`,
  une inspection sans format de champs nommés, un journal ni borné ni filtré, un fichier d'environnement ou
  une clé, un réglage du système. Exemple : `plugin/hooks/prod-ssh-allow.example`.

**Le hook**, quand des hôtes de prod sont déclarés, refuse : une ligne de commande (Bash, PowerShell) qui
contient le nom d'un hôte de prod, où qu'il soit ; un texte écrit par un outil d'écriture qui le contient ;
un client SSH sans cible lisible (une variable, une substitution, une expression) ; une commande encodée ;
un contexte du moteur de conteneurs ; une ligne qui nomme un réglage de la garde, sa liste ou un chemin
protégé ; une écriture dans la liste, le dossier des crochets ou un chemin protégé. Ses refus sont fixes par
catégorie, sans un mot de la commande.

**L'activer** : des variables d'environnement, posées sur le poste **avant** d'ouvrir la session.

- `LUN_PROD_SSH_HOSTS` : les hôtes de prod sous **tous leurs noms** (nom court, nom complet, adresse),
  séparés par une virgule ou une espace ; le premier est celui que le lanceur appelle. Un nom de moins de
  4 caractères ou trop commun (`localhost`, `docker`…) est une configuration invalide : le hook **refuse
  alors tout**, en disant quoi corriger. C'est voulu : s'ouvrir en silence désactiverait la garde.
- `LUN_PROD_SSH_ALLOW_FILE` : le chemin de la liste, hors de tout dépôt, sous un nom qui ne sert qu'à elle.
- `LUN_PROD_SSH_PROTECT` (facultatif) : d'autres chemins à protéger, séparés comme un `PATH` : le fichier de
  réglages qui déclare le hook, la configuration SSH du poste (les options fixes n'y annulent pas un relais).

**Vérifier qu'elle est active** : `--check`, puis ouvrir la séance par un refus attendu : la session tente
`echo` suivi du nom de l'hôte, et doit recevoir le refus de `lun guard`. **Sans `LUN_PROD_SSH_HOSTS`, la
garde est inactive et silencieuse** : rien ne dit qu'elle manque.

**Son prix**, sur le poste où elle est active : toute ligne ou tout fichier écrit qui cite un hôte de prod
est refusé, même un message de commit ; un client SSH avec une variable, une parenthèse ou une accolade sur
sa ligne, même vers un autre hôte ; tout contexte du moteur de conteneurs, même local ; `powershell -e…` ;
toute écriture dans le dossier des crochets, donc le travail sur le plugin lui-même.

**Ce qu'elle ne voit pas** : un nom d'hôte construit sans que le nom entier paraisse ; un alias, une
fonction ou un script défini avant ; un programme qui lit l'hôte dans sa propre configuration (un alias de
la configuration SSH, un distant git) ; un autre outil que ceux que le hook couvre ; un script déjà présent
sur l'hôte, et ce que fait une commande autorisée une fois lancée ; un hôte non déclaré ; un fichier de la
garde écrit par un programme lancé, ou nommé par un chemin relatif ou un joker.

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
