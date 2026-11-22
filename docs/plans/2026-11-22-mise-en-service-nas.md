# Mettre l'écosystème en service sur le NAS. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche, dans l'ordre et avec ses points d'arrêt.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-docs#190 (`niveau:critique`).
>
> **État : rédigé le 22/11 ; contesté le même jour (« à amender », quatre bloquants) ; amendé le 22/11.** À valider
> par CrOliX avant toute installation. C'est la prod, avec les vraies données de CrOliX.
>
> Code relu sur `main` : Lun'Anima `365c7e6`, Lun'Acedia `bf724e3`, Lun'Avaritia `9c53768` ; le graphe d'abord, puis
> les fichiers. Lun'Anima est privé : ce plan dit les gestes, les critères, les risques et les décisions, en
> comportement. Ses fichiers, ses commandes, ses variables, son déploiement et ses lignes sont dans la part privée du
> chantier, postée dans une issue privée ([`securite.md`](../../standards/securite.md), « Dépôts publics »). Aucun nom
> du réseau privé, aucune adresse, aucun compte n'entre ici : ils s'écrivent « le nom du NAS », « l'adresse d'Acedia
> dans le réseau privé ». Le relevé brut de l'état des lieux va dans l'issue privée ; ce plan n'en garde qu'un résumé.

**But :** le core, Lun'Acedia et Lun'Avaritia tournent en continu sur le NAS, chacun dans son conteneur avec sa base
neuve, joints en HTTPS par le réseau privé, avec le vrai compte Google. Tout ce qui conditionne la semaine de rodage
y est vérifié par un geste et une preuve. Lun'Luxuria reste sur le desktop : c'est la session suivante.

**Source :** l'issue et ses critères ; l'[ADR 0014](../../adr/0014-mvp-sur-le-nas.md) ;
l'[ADR 0008](../../adr/0008-acces-exterieur.md) pour l'accès ;
[`environnements.md`](../../standards/environnements.md), « Prod : le NAS » et « Interdit » ;
[`securite.md`](../../standards/securite.md) ; la [feuille de route](2026-11-07-feuille-de-route-mvp.md), « Le
recadrage du 20/11 » ; le [recadrage du VIP](../specs/2026-11-19-recadrage-vip.md) (une semaine d'usage sans point de
tension) ; le [plan du 08/11](2026-11-08-bascule-nas.md), la base ; la [mise en service du
desktop](../mise-en-service-desktop.md), la recette du 07 au 10/11 ; le plan
[tenir en continu](2026-11-12-tenir-en-continu.md) ; le chapeau Lun-Ecosystem/lun-docs#185. Deux décisions de CrOliX
du 22/11 : les commandes sur le NAS se jouent depuis le laptop, par SSH, avec un compte limité ;
Lun-Ecosystem/lun-acedia#76 est corrigé avant.

**Critères de fin**, ceux de l'issue, chacun avec ses tâches :

1. **Un état des lieux du NAS est écrit** avant toute installation : Docker et Compose, le réseau privé, la place,
   l'accès SSH par un compte limité à ce qu'il faut, rien d'ouvert sur la box. Tâche 1.
2. **Une version de chaque serveur est publiée** depuis `main`, et la page d'installation est relue contre le code
   d'aujourd'hui. Tâches 2 et 3.
3. **Les trois serveurs tournent sur le NAS**, chacun dans son conteneur avec sa base, joignables par le réseau privé
   en HTTPS ; les satellites sont reliés au core ; les secrets ne sont dans aucun dépôt. Tâches 5 à 9.
4. **Ce qui conditionne la semaine est vérifié sur le NAS** : Google en production ; le téléphone ; le premier
   appareil relié sans terminal ; un redémarrage et une nuit rattrapée ; une copie de chaque base et une restauration
   essayée ; une mise à jour et un retour arrière ; le fournisseur de modèle réglé par l'écran. Tâches 4, 5 et 9 à 15.
5. **Les vérifications en attente de #185** sont faites : les chevauchements d'agenda sur de vrais événements,
   l'export téléchargé depuis le téléphone, l'agent sans nom en dur. Tâche 16.
6. **La page de mise en service est à jour** et dit comment refaire chaque geste ; ce qui a surpris est écrit.
   Tâche 17. L'accès ouvert pour le chantier est refermé ou justifié : tâche 18.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-docs` : le plan, la page du NAS | `docs/mise-en-service-nas` | Lun-Ecosystem/lun-docs#190 | `critique` |
| `lun-anima` : la PR de version, la pile et sa page relues | à créer | une issue privée, à ouvrir | `critique` |
| `lun-acedia` : la PR de version, le `.env.example`, le lien de restauration | à créer | à ouvrir | `standard` |
| `lun-avaritia` : la PR de version, le `.env.example`, le lien de restauration | à créer | à ouvrir | `standard` |

**Le niveau.** `critique` : la prod, les vraies données, les vrais secrets, un accès au NAS. Le code applicatif ne
change pas. La pile change par une PR relue (tâche 3), puis tourne en entier sur le laptop (tâche 5) avant d'entrer
sur le NAS.

## Ce que l'interdit demande, et comment ce plan le tient

`environnements.md`, « Interdit » : pas de « tests à faire une fois sur la prod » ; pas de version non fusionnée sur
la prod ; le vrai compte Google seulement sur la prod. L'ADR 0014 : tout se prouve d'abord en local.

- **La pile entière tourne d'abord sur le laptop** (tâche 5) : les nœuds du réseau privé à côté de chaque app, le
  HTTPS, le premier appareil, la liaison, la copie et la restauration, la mise à jour et le retour arrière, le fuseau,
  le chemin des bases. Le NAS ne rejoue ensuite que ce qui dépend de lui : son système, sa mémoire, un redémarrage, la
  sauvegarde hors du NAS.
- **L'image prouvée est l'image publiée.** La répétition tire les images du registre après leur release, pas un build
  du laptop. Le premier démarrage sur le NAS compare leur empreinte à celle de la répétition.
- **Aucun code non fusionné n'entre sur le NAS.** Le NAS ne reçoit que des images publiées par l'organisation et la
  pile copiée depuis `main`.
- **Un écart trouvé sur le NAS ne se corrige pas sur le NAS.** Il s'écrit, le geste s'arrête, CrOliX tranche ; un
  correctif passe par un chantier sur le laptop, une PR, une version.
- **Le vrai compte Google n'entre que sur le NAS**, à la tâche 13, après l'arrêt C. La répétition tourne sans Google.

## Ce que le code fait aujourd'hui

### Le déploiement du core (privé), en comportement

Le dépôt du core porte la pile des trois serveurs (ADR 0008) : un conteneur par app, à côté d'un conteneur du réseau
privé qui lui donne son nom et son HTTPS ; l'app n'écoute que dans ce conteneur, rien n'est publié sur le NAS. Un
geste déploie une version, attend que l'app réponde, et remet seul la version d'avant si elle ne répond pas ; un autre
revient à la version d'avant. Chaque base vit dans un volume Docker nommé, ses copies à côté d'elle, dans le même
volume. La pile ne règle ni le fuseau des conteneurs, ni la taille de leurs journaux. Le détail est dans la part
privée.

### Les versions

- Les trois serveurs sont en `v0.1.0`, publiées le 06/11. Chaque dépôt publie son image `linux/amd64` sur GHCR quand
  CrOliX publie une release dont le tag vaut la version ; la CI de chaque PR construit déjà l'image. Rien ne vérifie
  que le tag est posé sur `main` : c'est à CrOliX de choisir `main` en publiant. Sur `main`, les trois CI sont vertes.
- `git.md`, « Release » : la PR `chore(release): <projet> x.y.z` est fusionnée par CrOliX, le tag posé par CrOliX
  seul ; l'agent prépare la PR, ne pose jamais de tag et ne crée jamais de release (le hook de garde bloque
  `gh release create`).
- Depuis le 06/11 : dans le core, deux fournisseurs de modèle au choix dans l'écran, une clé par fournisseur chiffrée
  en base, une migration, l'historique qui garde les appels d'outil ; dans Acedia, les chevauchements d'agenda et
  l'agent sans nom en dur ; dans Avaritia, l'export téléchargé. Avaritia a deux migrations depuis `v0.1.0`, toutes deux
  des ajouts (une colonne, deux index : `server/src/db.ts`).

### Ce que chaque app sait déjà faire pour tenir en continu

- **La copie de la base** : chaque serveur copie la sienne dans `backups/`, à côté d'elle, dès qu'il écoute puis chaque
  heure si celle du jour manque ; sept au plus. Chaque copie écrite laisse au journal « Base copiée : » suivi de son
  **chemin réel** (Acedia et Avaritia `server/src/backup.ts:73`, le core de même) : c'est la preuve bon marché qu'une
  base est bien dans son volume. Aucune commande ne fait une copie à la demande.
- **La nuit manquée** : jouée une fois dans la minute qui suit le démarrage, comme la lettre du matin (mise en service
  du desktop, § 7). La nuit et le matin du core tournent à l'heure de Paris quel que soit le fuseau du conteneur
  (plan de bascule, § 1). **Cela ne vaut que pour eux** (fuseau, ci-dessous).
- **Les notifications** : seul le core envoie des Web Push, avec des clés qu'il crée et garde lui-même : aucune clé de
  notification à créer à la main. Côté téléphone : la PWA installée depuis l'adresse HTTPS du core, les notifications
  autorisées. Une origine qui change oblige à se réabonner. **Si le core tombe, personne n'est prévenu** : c'est lui qui
  prévient.
- **Le premier appareil** : sur une base neuve, la page de chaque app montre le code du premier appareil, déjà saisi,
  seulement sur la machine qui l'héberge, à son adresse locale, sans en-tête de relais (lun-anima#113, lun-acedia#73,
  lun-avaritia#40). Derrière le relais HTTPS du réseau privé, **aucune page ne montre ce code**, et le NAS n'a pas
  d'écran. Le code part au journal de chaque serveur au démarrage. Il expire en dix minutes ; un redémarrage de l'app
  en donne un neuf tant qu'aucun appareil n'est appairé.
- **Les gardes d'Acedia au premier jour**, lues dans le code : l'IA ne range rien seule tant que le seuil reste à 100,
  sa valeur par défaut (`server/src/triage/pipeline.ts:57-58,274-280`) ; une base neuve n'a aucune règle (aucune n'est
  créée au démarrage, seulement par l'écran, `server/src/triage/rules.ts:85-92`) ; la première synchronisation lit les
  500 derniers mails sans les mettre en file de tri : seuls ceux arrivés après la connexion sont triés
  (`server/src/gmail/sync.ts:18,97-140`, la condition à la ligne 118).

### Le fuseau horaire, faux dans les conteneurs aujourd'hui

Une image tourne en temps universel tant qu'on ne lui donne pas de fuseau, et la pile n'en donne aucun.

- **Acedia** écrit l'heure des cartes avec l'heure locale du serveur (`server/src/pina/wording.ts:51-63`,
  `getHours()` et `toLocaleTimeString` sans fuseau) et place minuit d'un jour sans heure en heure locale
  (`server/src/agenda/time.ts:1-9`). En temps universel, chaque « à 10 h » serait faux d'une à deux heures selon la
  saison, et les événements sur la journée décalés. Les chevauchements, eux, écartent les journées entières et
  calculent leur créneau à l'heure de Paris (`server/src/agenda/overlaps.ts:44-55`) : l'heure de leur carte reste
  pourtant écrite par le texte commun, donc fausse.
- **Les trois apps** datent leurs copies du jour local du conteneur (`ymd`, `server/src/backup.ts:11-12` des
  satellites, de même dans le core) : en temps universel, la copie de 0 h 30 porte la date de la veille.
- **La parade** : le fuseau réglé pour chaque app dans la pile, par la PR de la tâche 3 ; Node lit le fuseau par ses
  propres données horaires, à prouver dans la répétition (tâche 5), puis sur le NAS par l'heure d'un événement réel
  (tâche 13).

### Ce que la page d'installation dit encore, et le code ne fait plus ou pas

Relu le 22/11, confirmé par la contestation, sans rien jouer. Les lignes du core sont dans la part privée.

1. **Le chemin de la base laissé vide fait tomber les trois serveurs.** La page dit de le laisser vide. Une ligne vide
   dans un fichier d'environnement de Compose donne une chaîne vide, pas une variable absente : Acedia
   (`server/src/main.ts:41`) et Avaritia (`server/src/main.ts:22`) font `resolve(root, process.env.DB_PATH ?? …)`, la
   chaîne vide passe le `??`, la base devient le dossier de l'app ; le core fait de même. **Pire, un chemin faux mais
   non vide** crée la base hors du volume, sans erreur, puisque le dossier de l'app appartient à l'utilisateur du
   conteneur : elle disparaîtrait à la recréation du conteneur. La preuve : la ligne « Base copiée : » au journal,
   dont le chemin doit être dans le volume (tâches 5 et 8).
2. **Le premier appareil** n'a de code qu'au journal sous Docker : la page ne dit pas comment l'obtenir sans terminal.
3. **Relier un satellite par la commande sans code** ouvre un navigateur : impossible dans un conteneur. Le chemin qui
   marche est l'écran (Atelier › Postes, le code donné par le satellite), règle de la maison.
4. **Les deux fournisseurs** : la page ne dit ni la clé d'Anthropic, ni que la clé et le modèle se règlent par
   l'écran, chiffrés en base.
5. **La clé du réseau privé** : la page demande une clé réutilisable et préapprouvée, sans étiquette. Un nœud sans
   étiquette voit sa clé de nœud expirer (180 jours par défaut chez Tailscale, à vérifier dans la console) : les trois
   apps deviendraient injoignables un jour, sans erreur de leur côté.
6. **Les copies et la restauration** : la page ne dit ni où sont les copies sur le NAS, ni comment en restaurer une ;
   les README d'Acedia et d'Avaritia renvoient à la page du desktop.
7. **Avant une mise à jour**, rien ne copie la base, et un retour arrière remet une image plus ancienne sur une base
   déjà migrée : une migration ne se défait pas.
8. **Les `.env.example` d'Acedia et d'Avaritia** ne disent pas `LLM_PRICES`, que les deux lisent
   (`server/src/llm/models.ts:98-101`) et que la page du desktop (§ 11) demande pour un modèle sans prix.
9. **L'image du réseau privé** n'est pas épinglée : une mise à jour peut changer de version sans le dire.
10. **Le fuseau et les journaux** : ni l'un ni l'autre n'est réglé (ci-dessus) ; les journaux des conteneurs
    grossissent sans borne.

### Les droits que demande Acedia à Google

Fixés dans le code (`server/src/google/oauth.ts:17-23`) : Gmail en modification, en envoi et en réglages de base ;
l'Agenda entier ; Tasks. Ce n'est pas « au plus juste » au sens de `securite.md` (l'Agenda entier, par exemple, quand
Acedia lit et déplace des événements). **Écart connu**, à ouvrir en issue dans lun-acedia, pas à corriger ici.

## L'accès au NAS depuis le laptop

Décision de CrOliX du 22/11 : la session qui pilote joue les commandes depuis le laptop, par SSH, avec un compte
limité. Constaté sur le laptop : aucun accès SSH au NAS n'est configuré ; le client du réseau privé n'est pas en ligne
de commande ; le client Docker est installé, son moteur n'est pas démarré ; deux clients SSH, celui de Windows
(OpenSSH 9.5, dont le service d'agent est désactivé) et celui de Git Bash (OpenSSH 10.2).

**Ce que dit la documentation d'UGREEN**
([se connecter en SSH](https://ai.ugreen.com/blogs/how-to/connect-nas-ssh-root-access), lue le 22/11) :
SSH s'active dans UGOS, Panneau de configuration › Terminal ; un port, un niveau de sécurité, un accès limité au réseau
local au choix, une **désactivation automatique** à régler ; la connexion se fait **avec un compte administrateur**
d'UGOS, puis `sudo -i` pour root ; une clé Ed25519 se dépose dans `~/.ssh/authorized_keys`, après avoir activé le
dossier personnel du compte. Elle ne dit pas si un compte standard peut se connecter en SSH, ni comment UGOS range le
groupe `docker`. **À vérifier dans l'état des lieux.**

**Ce qu'un compte limité à Docker veut dire.** Appartenir au groupe `docker` vaut les droits de root (documentation de
Docker). Un compte qui pilote Docker n'est donc pas limité en pouvoir. Il l'est par : ce qu'il n'est pas (pas le
compte de CrOliX, pas `sudo`) ; une clé à lui seul ; le temps ; une liste fermée de commandes ; des interdits écrits ;
une fin écrite (tâche 18).

**Où.** Sur le réseau local, quand CrOliX est chez lui. Le réglage d'UGOS qui limite SSH au réseau local est mis.
Aucun nœud du réseau privé pour le NAS lui-même (option écartée, « À trancher »).

**La durée.** Le service d'agent SSH de Windows garde les clés chargées d'un redémarrage à l'autre (rangées dans le
registre de l'utilisateur) et n'accepte pas de durée de vie (`ssh-add -t` y échoue :
[Win32-OpenSSH#1487](https://github.com/PowerShell/Win32-OpenSSH/issues/1487),
[#1510](https://github.com/PowerShell/Win32-OpenSSH/issues/1510)) : il reste désactivé. La séance passe par l'agent de
Git Bash, un processus qui ne garde rien sur le disque, lancé par CrOliX sur un emplacement fixe. **CrOliX** y charge
la clé en tapant sa phrase de passe, dans son propre terminal, avec une durée de vie de la séance (`ssh-add -t`,
**à vérifier** sur ce client : essai en P5). Jamais la session, jamais par la conversation. À la fin de chaque séance :
la clé retirée (`ssh-add -D`), l'agent arrêté, et vérifié (`ssh-add -l` ne répond plus) ; SSH désactivé dans UGOS ou
laissé à sa désactivation automatique.

**Les commandes.** Une **liste fermée**, écrite d'avance dans la part privée, tâche par tâche, sans aucun outil que
l'état des lieux n'a pas trouvé sur le NAS. Devant une commande imprévue, ou un échec au milieu d'une tâche : arrêt,
et CrOliX tranche.

**Les interdits de la session**, noir sur blanc :

- **Tout ce qui efface** : un volume, un conteneur avec ses volumes, un nettoyage global de Docker, une suppression ou
  un déplacement dans un dossier de données ou de copies, l'arrêt de la pile avec effacement.
- **Tout ce qui peut afficher un secret** : une inspection de conteneur ou d'image sans format choisi ; l'environnement
  d'un conteneur ; l'affichage d'un fichier d'environnement, de la configuration d'accès au registre ou des clés SSH ;
  la configuration résolue de la pile sans filtre.
- **Tout ce qui peut afficher un code d'appairage** : le journal brut d'un conteneur. La session ne lit un journal qu'à
  travers un filtre fixe de la liste fermée, qui ne garde que les lignes attendues (« Base copiée », la nuit, le
  matin, une erreur) ; elle ne lit jamais le code du premier appareil.
- **L'élévation de privilège** : `sudo`, `su`, un conteneur lancé en root ou en mode privilégié.
- **Tout réglage du système du NAS** : comptes, partages, SSH, réseau, mises à jour, sauvegardes : ce sont les gestes de
  CrOliX, dans UGOS.

**Les sorties qui peuvent porter un secret ou un code**, et comment la liste les évite : le journal d'un conteneur
(le code du premier appareil) : filtré ; l'inspection d'un conteneur (son environnement) : seulement avec un format qui
ne lit que l'état de santé ou l'empreinte ; la configuration résolue de la pile (toutes les valeurs) : seulement la
liste des services ; un fichier d'environnement : jamais lu, seulement la longueur d'une ligne attendue.

**Ce que la clé n'empêche pas.** La clé de pilotage ne sert qu'à la session. CrOliX saisit ses secrets par son propre
chemin : l'éditeur de fichiers d'UGOS s'il atteint le dossier du déploiement, ou une session SSH à lui (tâche 7).
Une restriction de la clé par adresse casserait au premier changement d'adresse du laptop : elle n'est pas mise ; la
limite au réseau local est celle d'UGOS.

## Où vivent les secrets, les bases et leurs copies

- **Le dossier du déploiement**, avec les fichiers d'environnement (les clés maîtresses, les identifiants Google) :
  hors de tout partage réseau, de toute sauvegarde, des instantanés et de la corbeille, si UGOS le permet (à lire à
  l'état des lieux). Droits `600` pour les fichiers, au compte de pilotage.
- **Les bases** : dans leurs volumes nommés, tels que codés.
- **Les copies des bases** : le dossier des copies de chaque app est monté sur un dossier du stockage protégé du NAS
  (par la PR de la tâche 3), et **seul ce dossier** est sauvegardé hors du NAS. Ces copies sont cohérentes par
  construction. La sauvegarde ne prend que les fichiers `<nom>-AAAA-MM-JJ.db` (leçon du desktop, § 8 : une copie
  s'écrit d'abord dans un fichier temporaire du même dossier).
- **Les clés maîtresses** ont leur copie dans le gestionnaire de mots de passe de CrOliX, et nulle part ailleurs hors
  du NAS. Une copie de base volée sans sa clé ne rend ni les jetons Google, ni les clés des fournisseurs. **Une clé
  maîtresse perdue rend illisible ce qu'elle chiffre** : chez Acedia, les jetons Google et les clés d'IA (l'écran du
  compte Google reste alors sur « Vérification… », lun-acedia#62) ; chez Avaritia, les clés d'IA ; dans le core, les
  liaisons aux satellites, les clés des fournisseurs et les abonnements du téléphone. Tout se refait par les écrans ;
  les données elles-mêmes restent lisibles.

## Ce que CrOliX prépare avant la tâche 1

Dans l'ordre. Lui seul : cela touche ses comptes et ses accès. La session ne fait rien avant.

- [ ] **P1. Le compte de pilotage**, dans UGOS : un compte dédié qui n'est pas le sien, standard (point 1), son
  dossier personnel activé. *Bon quand* : le compte existe et n'est pas dans le groupe des administrateurs.
- [ ] **P2. Le dossier du déploiement**, dans UGOS : hors partage, hors sauvegarde, hors instantanés si possible ;
  écriture pour le compte de pilotage seul. *Bon quand* : il ne paraît dans aucun partage réseau ni aucune tâche de
  sauvegarde.
- [ ] **P3. SSH activé** dans UGOS : port choisi, niveau élevé, limité au réseau local, désactivation automatique.
  *Bon quand* : l'écran d'UGOS le montre.
- [ ] **P4. La clé SSH dédiée**, sur le laptop, dans son terminal : Ed25519, avec une phrase de passe ; la partie
  publique déposée par lui dans `authorized_keys` du compte de pilotage, avec les options de la part privée. *Bon
  quand* : la partie privée n'existe que sur le laptop.
- [ ] **P5. L'agent de la séance** : il lance l'agent de Git Bash sur l'emplacement de la part privée, charge la clé
  avec une durée de vie, puis essaie une connexion. *Bon quand* : `ssh-add -l` montre la clé avec sa durée, et une
  connexion au NAS ouvre le compte de pilotage sans mot de passe. Si la durée de vie est refusée, il le dit.
- [ ] **P6. Le moteur Docker du laptop**, démarré, pour la répétition. *Bon quand* : `docker info` répond.
- [ ] **P7. Le client du réseau privé sur le laptop**, connecté, pour joindre les apps en HTTPS. *Bon quand* :
  `tailscale status` répond.
- [ ] **P8. Les valeurs de l'instance**, dans la part privée : le nom du NAS, le compte de pilotage, le dossier du
  déploiement, le port SSH. Elles ne vont dans aucun dépôt.

## Les tâches

**Qui fait quoi.** CrOliX : ce qui touche ses comptes, ses secrets et les gestes irréversibles (publier une version,
entrer un secret, le vrai compte Google, régler UGOS, redémarrer le NAS, effacer ou mettre de côté une base). La
session qui pilote : les gestes de la liste fermée, par SSH depuis le laptop, et la répétition sur le laptop. Les
agents : le code et la doc, sur le laptop, par PR.

**L'ordre.** 1, 2, 3 et 4 partent ensemble (2 et 3 se croisent : la PR de la pile n'attend pas les versions). 5 attend
2 et 3 fusionnées et publiées. **Arrêt B**, puis 6 à 12 se suivent. **Arrêt C**, puis 13 à 16. 17 se tient tout du long.
18 en dernier, après l'**arrêt D**.

**Les points d'arrêt**, où CrOliX valide avant de continuer :

- **A**, après l'état des lieux (tâche 1) : il lit le relevé et dit « on continue » ou renvoie le plan.
- **B**, avant la première écriture sur le NAS (avant la tâche 6) : les versions sont publiées, la pile corrigée, la
  répétition faite et son relevé lu, l'adresse de retour acceptée par Google (tâche 4), la liste fermée relue.
- **C**, avant d'entrer le vrai compte Google (avant la tâche 13) : les trois serveurs tournent, les appareils et la
  liaison sont faits, la règle de copie hors du NAS est posée et vue, une restauration a été essayée, la mise à jour
  et le retour arrière joués.
- **D**, avant de refermer l'accès (tâche 18) : il dit ce qui reste ouvert et pourquoi.
- **E**, chaque fois qu'une base est effacée, remplacée ou mise de côté, même dans une tâche de la session : la
  session s'arrête, CrOliX dit « vas-y ».

**Pour chaque geste sur le NAS** : la commande, ce qu'on attend, comment on le vérifie, comment on revient en arrière.
Les commandes sont dans la liste fermée de la part privée, par numéro de tâche. Une sortie qui surprend arrête la tâche.

### Tâche 1. L'état des lieux, en lecture seule (la session, par SSH ; CrOliX pour UGOS et la box)

- [ ] Rien ne s'écrit sur le NAS. Seules les commandes de lecture de la liste fermée.

Ce qu'elle regarde, et ce qu'on attend :

- **Le système** : la version d'UGOS et du noyau ; l'architecture (`x86_64`, les images sont `amd64`) ; les outils
  présents dont la liste fermée a besoin (`grep`, `awk`, `sha256sum`, `sed` et sa variante).
- **Docker** : la version du moteur et de Compose v2 ; si le compte de pilotage parle au moteur sans `sudo` ; où Docker
  range ses données et si ce dossier est sur le stockage protégé (le groupe de disques, sa redondance).
- **La place et la mémoire** : l'espace libre ; la mémoire totale et libre.
- **Ce qui tourne déjà** : les conteneurs, les projets Compose, les ports écoutés par l'hôte.
- **`/dev/net/tun`** présent : les nœuds du réseau privé tournent en mode noyau.
- **L'heure** : synchronisée ; le fuseau de l'hôte.
- **Le réseau privé** : HTTPS et noms courts activés (console, par CrOliX) ; les noms `anima`, `acedia`, `avaritia`
  libres (aucun nœud existant ne les porte, sinon la prod prendrait un nom suffixé).
- **UGOS, par CrOliX dans ses écrans** : où mettre le dossier du déploiement hors sauvegarde, instantanés et corbeille ;
  les instantanés et la sauvegarde disponibles ; si UGOS notifie l'arrêt d'un conteneur ; si ses mises à jour
  automatiques (du système, de son app Docker) redémarrent le moteur, et quand ; si son écran Docker montre les
  conteneurs d'un projet Compose, leur journal, et sait les relancer ; si SSH est accepté pour un compte standard.
- **La box**, par CrOliX : rien n'est redirigé vers le NAS ; UPnP du NAS coupé.

**Seuil d'arrêt**, qui renvoie le plan à CrOliX : pas de Compose v2 ; une architecture autre que `x86_64` ; pas de
`/dev/net/tun` ; moins de 2 Go de mémoire libre ou 10 Go d'espace libre ; des données Docker hors du stockage protégé ;
un port ouvert sur la box ; SSH refusé au compte standard (point 1) ; aucun endroit hors sauvegarde pour le dossier du
déploiement ; un outil de la liste fermée absent (la liste se réécrit sans lui).

**Preuve** : le relevé brut dans l'issue privée ; un résumé sans valeur de l'instance dans la PR de lun-docs.
**Exclu** : installer, régler. **Point d'arrêt A.**

### Tâche 2. Les versions publiées (un agent prépare, CrOliX publie)

- [ ] **Dans l'ordre** : Avaritia, puis le core, puis Acedia, qui attend lun-acedia#76 (chantier à part, en cours).
  Avaritia et le core partent en parallèle de la tâche 1.
- [ ] **Depuis quel commit** : la tête de `main` le jour de la PR de version. Le SHA est écrit dans la PR.
- [ ] **Les numéros** : `0.2.0` pour les trois (point 8).

Pour chaque dépôt :

1. **Avant** : CI verte sur le commit, dont la construction de l'image.
2. **La PR de version** : `chore(release): <projet> 0.2.0`, préparée par l'agent `livreur`, qui monte la version et
   liste les chantiers regroupés. Fusionnée par CrOliX.
3. **La release** : publiée par CrOliX, tag `v0.2.0` **sur `main`**, notes générées par GitHub.
4. **Après** : le workflow vert ; l'image sur GHCR sous `0.2.0`. La preuve de l'image elle-même est la répétition.

**Retour arrière** : une release ratée se retire par CrOliX (la release et l'image), la version se republie en
`0.2.1` ; jamais un tag déplacé. Une faute trouvée par la répétition donne une `0.2.1`, et la répétition se rejoue.
**Exclu** : un correctif de code dans la PR de version.

### Tâche 3. La pile et sa page, relues contre le code (un agent, Lun'Anima et les deux satellites)

- [ ] **Lun'Anima**, une PR relue, la part privée en donne le détail : la page d'installation corrigée des écarts 1 à
  10 ; **le fuseau `Europe/Paris` pour chaque app** ; une borne à la taille des journaux de chaque conteneur ; le
  dossier des copies de chaque app monté sur un dossier du NAS donné en configuration ; l'image du réseau privé
  épinglée ; les noms des nœuds réglables, ceux de la prod par défaut (pour la répétition) ; la copie avant une mise à
  jour, décrite ; le chemin du premier appareil, tel que le point 3 le tranche.
- [ ] **Lun'Acedia et Lun'Avaritia** : `LLM_PRICES` dans le `.env.example`, commentée, sans valeur. Le lien de
  restauration de leur README passe à la tâche 17.
- **Preuve** : la PR relue, CI verte ; la configuration de la pile acceptée par Compose sur le laptop ; le reste dans la
  répétition.
- **Exclu** : changer un comportement du code applicatif. Si un écart demande du code (une valeur vide qui devrait
  valoir l'absence), c'est un correctif à part, `standard`, avant la version de son dépôt.

### Tâche 4. L'adresse de retour de Google, essayée dans la console (CrOliX, avant l'arrêt B)

- [ ] Dans la console Google, un projet propre à la prod (point 4), son écran de consentement en « Production », les
  API Gmail, Agenda et Tasks activées, les cinq droits du code déclarés.
- [ ] Un client OAuth « Application Web » dont l'adresse de retour autorisée est celle d'Acedia dans le réseau privé,
  suivie de `/oauth/callback`. Le nom est connu d'avance : le nom du nœud et celui du réseau. Aucun secret n'est copié
  ailleurs : l'identifiant et le secret restent dans la console jusqu'à la tâche 13.
- **On attend** : la console enregistre l'adresse (règles de Google : HTTPS, pas d'adresse IP, un domaine de la liste
  des suffixes publics, [règles](https://developers.google.com/identity/protocols/oauth2/web-server)).
- **Arrêt** si la console refuse l'adresse, ou si l'écran de consentement bloque l'app pour ses droits (Gmail en
  modification est un droit restreint) : le plan revient à CrOliX.

### Tâche 5. La répétition complète sur le laptop (la session ; CrOliX pour la clé et les codes)

La pile entière, avec les images **tirées du registre**, sur le moteur Docker du laptop. Un relevé écrit, lu à
l'arrêt B.

- [ ] **La clé d'inscription** : créée par CrOliX dans la console, **éphémère et étiquetée** ; des noms de nœuds
  distincts de ceux de la prod (préfixés d'`essai-`).
- [ ] **Le premier démarrage** : les six conteneurs, les trois apps répondent à leur contrôle de santé ; chaque app
  répond en HTTPS sur son nom d'essai depuis le navigateur du laptop ; la ligne « Base copiée : » donne un chemin dans
  le volume ; l'empreinte de chaque image notée.
- [ ] **Le fuseau** : l'heure lue dans chaque conteneur est celle de Paris ; une copie datée du jour de Paris. L'heure
  d'une carte sur un vrai événement se vérifie sur le NAS (tâche 13) : la répétition tourne sans Google.
- [ ] **Le premier appareil** : CrOliX lit le code dans l'écran du moteur Docker du laptop (le journal du conteneur),
  comme il le fera sur le NAS ; la session ne le lit pas. Puis un second appareil par un code de l'écran.
- [ ] **La liaison** : Acedia et Avaritia reliées au core par l'écran, par leurs adresses d'essai ; un événement du
  satellite arrive au Journal du core.
- [ ] **La copie et la restauration**, comme à la tâche 11 : repère, copie, restauration à part et à la place,
  déchiffrement vrai.
- [ ] **La copie avant mise à jour, la mise à jour et le retour arrière**, comme à la tâche 12.
- [ ] **Un nœud du réseau privé redémarré seul** : son app répond-elle encore au contrôle de santé, et par le réseau ?
  Le relevé le dit, et la parade s'écrit.
- [ ] **La mémoire** de chaque conteneur, relevée.
- [ ] **La fin** : la pile arrêtée, les volumes d'essai retirés (sur le laptop, rien de réel), **les nœuds d'essai
  retirés de la console**, la clé éphémère expirée. *Vérifié* : la console ne montre plus aucun nœud `essai-`.
- **Exclu** : Google (la répétition tourne sans lui) ; une clé de fournisseur réelle, sauf une clé de développement
  pour un seul tour.

### Tâche 6. Préparer le NAS, sans secret (la session, par SSH) ; **arrêt B avant**

- [ ] La pile copiée depuis `main` au commit de la PR de la tâche 3 dans le dossier du déploiement ; l'empreinte des
  fichiers comparée à celle du dépôt.
- [ ] Les fichiers d'environnement créés depuis leur modèle, **sans aucun secret** : les versions, le chemin des bases
  tel que la tâche 3 le fixe, le dossier des copies, l'adresse de retour Google d'Acedia. Droits `600`.
- [ ] Le dossier des copies de chaque app, sur le stockage protégé : préparé par **CrOliX** dans UGOS (il doit être à
  l'utilisateur de l'image, ce que la session ne peut pas régler sans élévation).
- **Vérifier** : les droits ; la liste des services de la pile, sans les valeurs.
- **Revenir en arrière** : le dossier du déploiement vidé, par CrOliX ; rien d'autre n'a bougé.
- **Exclu** : démarrer un conteneur, se connecter au registre.

### Tâche 7. Les secrets (CrOliX)

Chaque secret est saisi par CrOliX : sur le NAS, par l'éditeur de fichiers d'UGOS ou une session SSH à lui ; ou par
l'écran de l'app. **Jamais** dans la conversation, dans un dépôt, dans une ligne de commande (l'historique du shell),
ni dans un journal. Les clés maîtresses ont leur copie dans son gestionnaire de mots de passe.

- **La clé d'inscription du réseau privé.** Créée dans la console, préapprouvée, **étiquetée**, de courte durée.
  Saisie dans le fichier du déploiement ; vidée et révoquée dès les trois nœuds en ligne (tâche 8). L'état de chaque
  nœud reste dans son volume.
- **Le jeton de lecture des images.** Un jeton GitHub classique limité à `read:packages`, rangé dans son gestionnaire
  de mots de passe. Saisi par lui à la connexion au registre, par l'entrée standard, **juste avant un tirage** ; la
  session tire, puis se **déconnecte** du registre : le jeton ne reste pas en clair sur le NAS entre deux tirages.
  Échéance de 90 jours, rappel noté.
- **La clé maîtresse de chaque app.** Tirée sur le NAS par lui (32 octets en base64), écrite dans le fichier de l'app
  par une commande dont la ligne ne porte pas la valeur, copiée dans son gestionnaire. Sans échéance.
- **L'identifiant et le secret OAuth de Google.** Le client de la tâche 4, saisis dans le fichier d'Acedia à la tâche
  13 seulement.
- **La clé du fournisseur de modèle du core** et **les clés d'IA d'Acedia et d'Avaritia** : par leurs écrans, avec
  leur échéance (tâche 10), chiffrées en base.
- **Les clés de notification** : le core les crée lui-même.
- **Vérifier** (la session) : droits `600` ; chaque ligne attendue non vide, par sa seule longueur.
- **Revenir en arrière** : un secret mal saisi se ressaisit ; un secret qui a pu fuir se révoque et se remplace.

### Tâche 8. Le premier démarrage (la session, par SSH)

- [ ] CrOliX se connecte au registre ; la session tire les trois images à leur version, puis se déconnecte ; elle
  compare l'empreinte de chaque image à celle de la répétition ; puis tout démarre.
- **On attend** : les trois apps répondent à leur contrôle de santé ; trois nœuds en ligne, étiquetés, à leur nom de
  prod (pas un nom suffixé) ; depuis le laptop, chaque app en HTTPS avec un certificat valide ; « Base copiée : » au
  journal filtré, avec un chemin dans le dossier des copies.
- **Vérifier** : la mémoire de chaque conteneur, contre la tâche 1 et la répétition ; l'heure de Paris dans chaque
  conteneur.
- **Après** : la clé d'inscription vidée par CrOliX et révoquée dans la console.
- **Revenir en arrière** : la pile arrêtée **sans effacer les volumes**.

### Tâche 9. Les premiers appareils et la liaison (CrOliX)

- [ ] **Le premier appareil de chaque app** : CrOliX lit le code dans l'écran Docker d'UGOS, s'il montre le journal
  (tâche 1). Le navigateur du laptop d'abord : le core, Acedia, Avaritia, chacun à son nom HTTPS. Un code expiré (dix
  minutes) : un redémarrage de l'app, depuis l'écran d'UGOS, en donne un neuf. **Si aucun écran ne montre le code, le
  critère « sans terminal » n'est pas tenu sur le NAS** : c'est un écart ouvert, écrit dans la page et dans l'issue ;
  CrOliX lit alors le code par sa propre session SSH. La session ne le lit jamais.
- [ ] Le téléphone, par un code donné par l'appareil appairé (Atelier › Appareils, Réglages › Appareils et
  applications) : sans terminal.
- [ ] **Relier Acedia et Avaritia au core, par l'écran**, et l'adresse de leur page dans Atelier › Postes.
- **Vérifier** : la Constellation montre les deux satellites joignables ; un événement émis par un satellite après la
  liaison arrive au Journal du core.
- **Revenir en arrière** : révoquer un appareil ou une liaison par l'écran.
- **Exclu** : appairer Luxuria (la session du desktop).

### Tâche 10. Le fournisseur de modèle, par l'écran (CrOliX)

- [ ] **Avant la clé**, une phrase au core : l'écran dit qu'aucune clé n'est enregistrée pour le fournisseur. De même
  dans Acedia et Avaritia avant leur clé d'IA. C'est « l'alerte quand une clé manque ».
- [ ] **La clé d'Anthropic**, saisie dans l'écran du core, avec son échéance ; le fournisseur Anthropic et le modèle
  Claude Haiku 5.5 choisis dans l'écran (raisonnement coupé : le réglage par défaut du core pour ce modèle) ; les
  plafonds du jour et de la nuit relus.
- [ ] **Un premier tour de conversation** : une réponse en flux, puis un outil (« relis ma journée ») ; l'écran des
  dépenses dit le fournisseur et un coût non nul.
- [ ] Les clés d'IA d'Acedia et d'Avaritia, par leurs Réglages, avec un modèle qui a un prix.
- **Vérifier** : la mise à jour de la tâche 12, ou un redémarrage, garde la clé et le choix.
- **Revenir en arrière** : la clé retirée de l'écran et révoquée chez le fournisseur.

### Tâche 11. Copies, sauvegarde hors du NAS, restauration essayée (la session ; CrOliX valide ; arrêt E)

- [ ] **Les copies** : celle du jour de chaque base, dans son dossier de copies, avec sa ligne au journal filtré.
- [ ] **La copie hors du NAS** : la règle posée par CrOliX dans UGOS, sur les seuls dossiers des copies et les seuls
  fichiers `<nom>-AAAA-MM-JJ.db`, vers un autre support ; sa première exécution vue. Avant l'arrêt C.
- [ ] **Une restauration à part** : pour chaque app, **une entrée repère** créée par l'écran avant la copie (une règle
  nommée dans Acedia, une fiche dans Avaritia, une phrase dans le core) ; la copie faite ; la copie recopiée dans un
  volume jetable **avec l'image de l'app elle-même** ; l'app démarrée sur ce volume **sans aucun réseau**, par la pile
  (un fichier d'essai qui lit l'environnement comme elle, guillemets compris). On attend : elle répond à son contrôle
  de santé ; le contrôle d'intégrité de SQLite répond `ok` ; l'entrée repère est dans la base restaurée. Puis le
  conteneur et le volume jetables sont retirés (arrêt E).
- [ ] **Une restauration à la place, sur Acedia et Avaritia sans vraies données**, avant l'arrêt C : la base mise de
  côté (arrêt E), la copie remise, l'app redémarrée ; la clé d'IA saisie avant la copie **se vérifie** dans Réglages
  (le déchiffrement est vrai, avec la même clé maîtresse) ; le satellite relié de nouveau au core, un événement vu au
  Journal ; puis le retour à la base mise de côté.
- **Revenir en arrière** : la base mise de côté remise à sa place ; rien ne s'efface avant que la restauration soit
  vérifiée.
- **Exclu** : restaurer à la place une base qui porte de vraies données.

### Tâche 12. Une mise à jour, puis un retour arrière (la session ; arrêt E)

Avaritia a deux migrations depuis `v0.1.0`, deux ajouts. Le geste dit donc qu'un retour arrière tolère une migration
qui ajoute, rien de plus : **la vraie parade reste la copie d'avant la mise à jour**. Joué dans la répétition, puis
une fois sur le NAS, sur Avaritia, avant toute vraie donnée.

- [ ] **La copie d'avant** : Avaritia arrêtée ; sa base copiée entière, avec ses fichiers `-wal` et `-shm` s'il y en a,
  dans un dossier daté du dossier des copies, par l'image de l'app ; puis relancée.
- [ ] Le geste de déploiement passe Avaritia à `0.1.0`, puis le retour arrière la remet à `0.2.0`.
- **On attend** : ou `0.1.0` répond, puis le retour arrière remet `0.2.0` ; ou `0.1.0` ne répond pas et le geste remet
  seul `0.2.0`. Dans les deux cas la liaison tient et l'entrée repère est là.
- **Revenir en arrière** : la copie d'avant remise (arrêt E).

### Tâche 13. Google en production (CrOliX) ; **arrêt C avant**

- [ ] L'identifiant et le secret du client de la tâche 4 dans le fichier d'Acedia ; Acedia redémarrée.
- [ ] **Le vrai compte**, connecté par CrOliX dans Acedia, Réglages › Compte Google. L'avertissement « Google n'a pas
  validé cette application » s'affiche (lun-acedia#55) : il le passe, c'est son propre client. La validation par
  Google : hors du MVP.
- [ ] **Les gardes du premier jour**, tenues jusqu'à une date que CrOliX choisit (point 9) : le seuil reste à 100 ;
  aucune règle avant qu'il en crée une ; la première synchronisation ne trie pas l'historique.
- **Vérifier** : Acedia dit Google connecté ; aucun mail ancien n'entre en file ; un mail arrivé après la connexion
  donne une proposition qui attend ; **l'heure d'un vrai événement** est juste dans l'agenda et sur une carte.
- **Revenir en arrière** : déconnecter dans Acedia ; retirer l'accès de l'app dans le compte Google ; vider les deux
  valeurs.

### Tâche 14. Le téléphone (CrOliX)

- [ ] Le client du réseau privé ; la PWA du core installée depuis son adresse HTTPS ; les notifications autorisées.
  Acedia et Avaritia de même s'il les veut.
- [ ] **Une notification de bout en bout** : un événement qui en mérite une arrive sur le téléphone verrouillé, et son
  toucher ouvre le bon écran.
- **Revenir en arrière** : se désabonner ; révoquer l'appareil.

### Tâche 15. Un redémarrage du NAS, une nuit rattrapée, et la surveillance (CrOliX ; la session vérifie)

- [ ] Un soir, CrOliX éteint le NAS par UGOS et le rallume le lendemain après 5 h.
- **On attend** : sans rien taper, les six conteneurs repartent, chaque nœud avant son app ; les trois apps répondent ;
  la nuit manquée jouée dans la minute, puis la lettre du matin ; les copies du jour faites, datées du jour de Paris ;
  le téléphone joint les trois apps.
- **La surveillance** : si UGOS notifie l'arrêt d'un conteneur (tâche 1), CrOliX l'active ; sinon, **un coup d'œil
  quotidien** à la Constellation et à l'écran Docker d'UGOS, accepté par lui et écrit dans la page. La parade sans SSH :
  relancer le conteneur depuis l'écran d'UGOS. Les mises à jour automatiques d'UGOS qui redémarrent le moteur : une
  fenêtre choisie par lui, hors de 5 h.
- **Revenir en arrière** : rien à défaire ; un conteneur resté arrêté se relance depuis l'écran, et l'écart s'écrit.

### Tâche 16. Les trois vérifications de #185 (CrOliX, sur le téléphone et le vrai compte)

- [ ] **Les chevauchements** : deux vrais événements de son agenda principal qui se chevauchent, dont il est le seul
  organisateur ; la carte propose d'en déplacer un ; acceptée, l'événement bouge dans Google, à la bonne heure. Un
  conflit sur un agenda secondaire donne une carte qui signale.
- [ ] **L'export** de la bibliothèque d'Avaritia, téléchargé depuis le téléphone et ouvert.
- [ ] **L'agent sans nom en dur** : aucun texte d'Acedia, sur le téléphone ni au Journal du core, ne porte « Pina ».

### Tâche 17. La page de mise en service du NAS (un agent, tout du long)

- [ ] **`docs/mise-en-service-nas.md`**, publique : ce que CrOliX voit et fait, geste par geste, sans commande, chemin
  ni variable du core (renvoi à la page privée). Elle remplace celle du desktop pour l'usage ; l'en-tête de
  `mise-en-service-desktop.md` y renvoie. Elle dit comment refaire chaque geste, le coup d'œil quotidien, et l'écart du
  premier appareil s'il reste ouvert.
- [ ] **« Ce qui a surpris »**, tenue pendant les tâches 1 à 16.
- [ ] La page d'installation du core, ce que l'installation a appris, dans une PR privée ; les README d'Acedia et
  d'Avaritia, leur lien de restauration vers la nouvelle page ; l'issue des droits Google d'Acedia ouverte.
- [ ] La feuille de route : l'état du chantier.
- **Vérifier** : `npm run check`, `npm test`, `npm run sync:check` ; la page relue par le `reviewer`.

### Tâche 18. Refermer l'accès (CrOliX, après l'arrêt D)

- [ ] SSH désactivé dans UGOS ; la clé retirée de `authorized_keys` ; le compte de pilotage désactivé, ou gardé avec sa
  raison écrite (les mises à jour de la semaine) et une date de revue.
- [ ] L'agent de la séance arrêté ; la clé privée gardée ou détruite, selon ce choix.
- [ ] Le jeton de lecture des images : dans le gestionnaire seulement, aucune connexion au registre restée ouverte.
- **Vérifier** : depuis le laptop, la connexion SSH échoue ; la console du réseau privé ne montre que les nœuds voulus.

## À trancher par CrOliX

1. **Le compte de pilotage.** Un compte standard d'UGOS dans le groupe `docker`, si UGOS accepte SSH pour lui. S'il le
   refuse : un administrateur dédié, distinct du sien, ou renoncer au pilotage par SSH et jouer les gestes lui-même.
   Dans tous les cas le compte vaut root par Docker. **Recommandé : le compte standard ; sinon, revenir à lui avant
   de créer un administrateur.**
2. **Une garde technique en plus de la règle écrite** : un contrôle côté laptop (un crochet de la session) qui refuse
   vers le NAS les commandes des interdits. **Recommandé : oui**, dans un chantier à part du plugin, avant l'arrêt B ;
   la règle écrite reste la première garde.
3. **Le premier appareil sans terminal sur le NAS** : l'écran Docker d'UGOS s'il montre le journal ; sinon l'écart
   reste ouvert et CrOliX lit le code par sa propre session. **Recommandé : constater à la tâche 1, et ne rien coder
   avant le MVP.**
4. **Google en production** : un projet et un client propres à la prod, en « Production » non validé, l'avertissement
   passé une fois. **Recommandé : oui** : le secret du laptop ne donne rien sur le vrai compte.
5. **Qui publie** : `git.md` le dit, CrOliX ; le hook bloque l'agent. **Recommandé : il publie lui-même.**
6. **Les numéros** : `0.2.0` pour les trois. **Recommandé : oui.**
7. **La date jusqu'à laquelle tiennent les gardes d'Acedia** (seuil à 100, aucune règle d'office, pas de tri de
   l'historique). **Recommandé : la fin de la semaine de rodage**, puis un premier seuil choisi sur ce qu'il aura vu.

**Options écartées**, avec leur raison :

- **Un nœud du réseau privé pour le NAS lui-même**, pour les séances hors de chez lui : un changement du système du
  NAS, un accès durable, et une première règle d'accès dans le réseau privé peut couper le téléphone et le lien du
  core vers les satellites. Les séances se font sur le réseau local.
- **La session qui lit le code du premier appareil au journal** : le code ouvre l'app ; elle ne le lit jamais.
- **Les bases dans un dossier du NAS plutôt que dans les volumes** : un changement de conception du déploiement, des
  droits que la session n'a pas, une preuve sur le laptop qui n'en était pas une. Seul le dossier des copies est monté.
- **Attendre la première vraie mise à jour pour essayer le retour arrière** : le geste doit être connu avant d'en avoir
  besoin.

## Risques

- **Perdre une base.** Parade : aucun geste qui efface dans la liste de la session ; l'arrêt E ; les copies sur le
  stockage protégé et hors du NAS ; une copie d'avant chaque mise à jour ; les clés maîtresses dans le gestionnaire ;
  une restauration essayée avant les vraies données.
- **Une base hors de son volume, sans erreur** (écart 1). Parade : le chemin réel lu dans « Base copiée : » à la
  répétition et au premier démarrage.
- **Un secret qui fuit.** Parade : saisi par CrOliX seul ; les interdits d'affichage ; droits `600` ; le dossier du
  déploiement hors de toute sauvegarde ; le jeton du registre déconnecté après chaque tirage ; la clé d'inscription
  révoquée après usage ; `npm run check` sur chaque PR publique ; un secret qui a pu fuir se révoque et se remplace.
- **Un NAS qui redémarre mal**, ou un nœud qui repart après son app, qui garde un contrôle de santé vert sans réseau.
  Parade : la répétition et la tâche 15 le constatent ; le coup d'œil quotidien ; la relance depuis l'écran d'UGOS.
- **Le core tombé, personne prévenu.** Parade : la notification d'UGOS si elle existe, sinon le coup d'œil quotidien.
- **Un accès SSH laissé ouvert.** Parade : limité au réseau local ; la désactivation automatique d'UGOS ; la clé
  retirée de l'agent à chaque fin de séance, et vérifiée ; l'agent de Windows, qui garde les clés, désactivé ; la
  tâche 18.
- **Une release ratée.** Parade : la répétition sur l'image publiée ; une image introuvable ne change rien ; une
  version qui ne répond pas est remplacée seule par la précédente ; une release ratée se republie en version suivante.
- **Le NAS trop juste en mémoire.** Parade : le seuil de la tâche 1 ; la mémoire relevée à la répétition et au premier
  démarrage ; au-delà, une limite par conteneur, par PR.
- **Les nœuds du réseau privé qui expirent, ou un nom suffixé.** Parade : la clé étiquetée ; les nœuds d'essai retirés
  avant le premier démarrage sur le NAS ; les noms vérifiés à la tâche 8.
- **Les noms des apps publics.** Le HTTPS du réseau privé passe par des certificats publics : leurs noms, et celui du
  réseau, sont écrits dans les journaux publics de certificats (documentation de Tailscale, à relire). L'ADR 0008 ne
  le dit pas. Rien n'y est lisible du contenu ; CrOliX le sait avant la tâche 8.
- **Les journaux qui remplissent le disque.** Parade : la borne de la tâche 3.

## Hors périmètre

L'accès sans réseau privé (un domaine, un relais : la cible de l'ADR 0008). Une machine dédiée. Lun'Luxuria et la
voix : la session du desktop, juste après. L'installation pour quelqu'un d'autre : en fin de VIP. Brancher Google par
l'écran (lun-acedia#55, après le MVP). La validation de l'app par Google. Réduire les droits Google d'Acedia (une
issue s'ouvre). Tout correctif de code applicatif.

## Ensuite

- **La session du desktop, pour la voix** : Luxuria reliée au core du NAS, la mesure des gestes, la langue, le délai
  contre les 2,5 s (feuille de route, « Le recadrage du 20/11 », point 2).
- **La semaine de rodage**, sur le NAS : la porte du MVP. Ses mises à jour passent par une release, la copie d'avant
  et le geste de déploiement, jamais par un fichier changé sur le NAS.

## Limites

- **Non joué, lu seulement** : l'écart 1 ; le fuseau dans l'image ; la limite de six connexions derrière le HTTPS
  (lun-acedia#76 le note) ; le comportement d'une app quand son nœud redémarre. La répétition les joue.
- **Non confirmé dans la documentation d'UGREEN** : SSH pour un compte standard ; le groupe `docker` ; l'écran Docker
  d'UGOS (journal, relance, projets Compose) ; la notification d'un conteneur arrêté ; les mises à jour automatiques ;
  un dossier hors sauvegarde, instantanés et corbeille. Tout cela se lit à la tâche 1.
- **Non confirmé sur le laptop** : la durée de vie des clés dans l'agent de Git Bash (P5) ; les nœuds du réseau privé
  en mode noyau sous le moteur Docker du laptop (tâche 5).
- **Non confirmé chez les tiers** : l'expiration des nœuds sans étiquette chez Tailscale ; l'acceptation par la console
  Google de l'adresse du réseau privé (tâche 4).
- La visibilité des images d'Acedia et d'Avaritia sur GHCR n'a pas pu être lue (jeton sans `read:packages`).
