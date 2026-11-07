# Le poste qui tourne seul : l'écosystème en service sur le desktop pour la semaine de rodage. Spec

Date : 07/11/2026. Statut : à relire par CrOliX. Dépôts : `lun-anima`, `lun-acedia`, `lun-avaritia`, `lun-luxuria`,
`lun-docs`.

## 1. L'intention

Le critère du MVP (spec écosystème §10.2) : une semaine complète **sans point de tension**. Le briefing est là chaque
matin, la journée se suit depuis le téléphone, le soir l'app du bureau démarre sans fenêtre cmd et répond à la voix,
et **rien n'a demandé d'intervention technique**.

Le NAS n'est pas possible pour l'instant, et le MVP se valide en local (décision du 07/11, spec « être présente »
§10.3). Aujourd'hui, chaque serveur se lance à la main, en mode développement, dans un terminal. Rien ne redémarre
après un plantage ou un redémarrage de Windows, rien n'est sauvegardé, et le téléphone ne joint le core que sur le
réseau de la maison. Ce chantier met l'écosystème **en service sur le desktop**, pour que la semaine de rodage (J5)
puisse commencer.

## 2. Ce qui est décidé

- **Le poste** : le desktop de CrOliX. Le laptop sert à préparer et à tester, jamais de mesure présentée comme celle du
  desktop.
- **Pas de Docker sous Windows** : les trois serveurs tournent avec Node, depuis leur build **[choix Claude]**. Le
  `Dockerfile` et `deploy/` de lun-anima restent pour le NAS, plus tard.
- **Ce qui touche au système est fait par CrOliX** : tâches planifiées, pare-feu, installation de Tailscale, réglages
  de veille et de notifications de Windows. Le chantier fournit des scripts relus et une page qui dit quoi lancer, dans
  quel ordre, et comment tout retirer.
- **Les mises à jour automatiques de Luxuria passent après le MVP** **[choix Claude]**. La spec écosystème (§8) les
  demandait, la trajectoire de Luxuria (§11) les plaçait plus tard ; pendant le rodage, une mise à jour se fait par un
  nouveau build lancé par CrOliX. Le §8 est annoté dans ce sens.

## 3. Ce que fait le chantier

### 3.1 Les serveurs en service (`lun-anima`, `lun-acedia`, `lun-avaritia`)

- Chaque serveur a une commande `start` qui lance son build (`node dist/main.js`). Acedia et Avaritia l'ont déjà ; le
  core l'ajoute, avec l'app (`ui/`) construite et servie comme aujourd'hui.
- **Le service n'est pas le dossier de développement** **[choix Claude]**. Il tourne depuis ses propres copies des
  trois dépôts, sur `main`, dans un dossier de service choisi à l'installation, avec ses bases et ses ports. Un
  `npm run dev`, un changement de branche ou un build dans le dossier de travail ne touchent jamais le service. Une
  commande de mise à jour récupère `main`, reconstruit et relance ; elle refuse une copie modifiée à la main.
- **Un script d'installation par poste Windows**, dans `lun-anima/deploy/windows/` **[choix Claude]** : le core est le
  centre, et ce dossier sait où sont les dépôts voisins. Ce script :
  - prépare le dossier de service et construit les trois dépôts ;
  - crée une tâche planifiée par serveur, **au démarrage de Windows**, sans attendre l'ouverture de session et sans
    aucune fenêtre visible **[choix Claude]**. Un redémarrage de Windows Update la nuit ne laisse donc ni le matin ni
    les P0 du téléphone sans core. La tâche tourne sous le compte de CrOliX, en ouverture S4U, sans mot de passe
    enregistré. Le lanceur redémarre le serveur s'il s'arrête : trois essais. Ensuite, un satellite arrêté se voit
    dans la Constellation, et un core arrêté se voit dans Luxuria (`injoignable`, icône comprise) et dans l'app du
    téléphone ;
  - écrit la sortie de chaque serveur dans un fichier de journal par jour, sous `data/logs/`, gardé 14 jours ;
  - a son inverse, qui retire toutes les tâches ;
  - n'écrit aucune clé et aucun secret : les `.env` existent déjà, saisis par CrOliX.
  Le choix exact du mécanisme sans fenêtre est laissé au constructeur, avec une preuve : aucune fenêtre au lancement de
  session, vérifié sur le laptop.
- **La nuit et le matin** : le rattrapage existe (le core joue au réveil une routine manquée). Si le PC dort à 5 h, le
  briefing est prêt au réveil. La page dit les deux choix (laisser le PC allumé la nuit, ou accepter le rattrapage),
  sans réglage système fait à sa place.

### 3.2 La sauvegarde (`lun-anima`)

La mémoire de la relation n'a ni validation ni correction possible : la perdre est irréparable. **Chaque nuit, avant la
veille**, le core copie sa base (`VACUUM INTO`, cohérent pendant que le serveur tourne) dans `data/backups/`, en garde
7, et le dit dans le Journal **[choix Claude]**. Une copie ratée se voit dans la santé du core, sans arrêter la veille.

Les bases d'Acedia et d'Avaritia ne sont pas copiées par ce chantier **[choix Claude]**. Acedia se resynchronise depuis
Google ; Avaritia vaut d'être sauvée, mais c'est son métier (le core ne réimplémente pas un satellite) : une issue
s'ouvre chez elle, hors MVP.

### 3.3 Luxuria comme une vraie application (`lun-luxuria`)

- **Démarrer avec Windows**, réglable dans l'écran de réglages, éteint par défaut **[choix Claude]**.
- **Une icône dans la zone de notification**, avec un menu : Afficher, Muette (le mute de
  `2026-11-07-mute-du-bureau-design.md`, **prérequis** de cette partie : il est fusionné avant), Quitter. L'icône dit
  l'état : présente, muette, injoignable (le core ne répond pas). Fermer la fenêtre
  la quitte, comme aujourd'hui ; l'icône part avec elle **[choix Claude]**.
- Le service voix reste lancé et arrêté par Luxuria (déjà fait).

### 3.4 Le téléphone hors de la maison

Le téléphone joint le core par Tailscale, avec `tailscale serve` en HTTPS **sur le desktop**, comme au J1 pour Acedia.
L'ADR 0008 prévoit la même chose sur le NAS. Rien n'est ouvert sur la box, et `HOST` reste `127.0.0.1` : `serve`
relaie vers la boucle locale. Sans Docker, le desktop n'a qu'un nom dans le tailnet : **chaque appli a son propre port
HTTPS sur ce nom** **[choix Claude]**, donc sa propre origine pour l'installation de la PWA et Web Push. Acedia garde
l'adresse qu'elle a depuis le J1. Le core et Avaritia en prennent une chacun : Avaritia en a besoin pour les liens
« Voir la fiche ». La page dit les commandes et les adresses à régler dans Écosystème > Postes. Changer plus tard une
origine oblige le téléphone à se réabonner aux notifications, et la page le dit. Aucune adresse du tailnet n'entre dans
un dépôt.

### 3.5 La page de mise en service (`lun-docs`)

`docs/mise-en-service-desktop.md` : ce qu'il faut avant (Node, `uv`, Tailscale, les `.env`), l'ordre (installer,
appairer Luxuria construite sur le core en service, régler les adresses), comment voir que tout tourne, comment tout
arrêter et tout retirer, ce qui reste à faire à la main. C'est la liste que CrOliX suit le jour J.

## 4. Les buts, les non-buts, les anti-buts

**But.** Après un redémarrage de Windows, sans rien taper, le core et les deux satellites tournent, Luxuria s'ouvre si
c'est réglé, le téléphone joint le core en HTTPS, et la base est copiée chaque nuit.

**Non-buts** : le NAS et Docker ; les mises à jour automatiques ; un installateur signé ; la sauvegarde d'Acedia et
d'Avaritia ; une supervision au-delà de ce que montre déjà la Constellation.

**Anti-buts** :

- une fenêtre de console qui s'ouvre au démarrage ;
- un réglage système fait sans CrOliX ;
- un secret ou une adresse interne dans un dépôt ;
- un serveur arrêté sans que rien ne le montre ;
- un core de développement ou ses bases (`data/anima.db`, `data/cli.token`) touchés par l'installation sur le laptop :
  la preuve se fait sur des dossiers et des ports jetables.

## 5. La recette

Sur le laptop, avec des copies jetables (ports et bases à part) :

1. L'installation crée les tâches ; une ouverture de session lance les trois serveurs sans fenêtre ; l'inverse les
   retire toutes.
2. Un serveur tué redémarre seul ; arrêté trois fois, il reste arrêté et la Constellation le montre.
3. Les journaux s'écrivent par jour et les plus vieux que 14 jours partent.
4. La copie de nuit produit une base lisible, la huitième efface la plus vieille, une copie ratée se voit dans la santé.
5. Luxuria : démarrer avec Windows, réglé puis retiré ; l'icône suit l'état ; Muette depuis le menu.

Sur le desktop, par CrOliX, en suivant la page : la même chose, plus le téléphone en HTTPS hors du réseau de la maison,
et une notification P0 reçue.

## 6. Laissé au constructeur

Le mécanisme sans fenêtre, le format des journaux, le nom des tâches, la place du réglage de démarrage dans l'écran de
Luxuria, le dessin de l'icône d'état.
