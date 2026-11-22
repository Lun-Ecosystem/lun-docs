# Mettre l'écosystème en service sur le NAS. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche, dans l'ordre et avec ses points d'arrêt.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-docs#190 (`niveau:critique`).
>
> **État : rédigé le 22/11, à contester puis à valider par CrOliX avant toute installation.** Rien ne s'installe tant
> qu'il n'est pas validé. C'est la prod, avec les vraies données de CrOliX.
>
> Code relu sur `main` : Lun'Anima `365c7e6`, Lun'Acedia `bf724e3`, Lun'Avaritia `9c53768` ; le graphe d'abord, puis
> les fichiers. Lun'Anima est privé : ce plan dit les gestes, les critères, les risques et les décisions. Ses fichiers
> de déploiement, ses commandes, ses variables et ses lignes sont dans la part privée du chantier, postée à part
> ([`securite.md`](../../standards/securite.md), « Dépôts publics »). Aucun nom du réseau privé, aucune adresse,
> aucun compte n'entre ici : ils s'écrivent « le nom du NAS », « l'adresse d'Acedia dans le réseau privé ».

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
[tenir en continu](2026-11-12-tenir-en-continu.md) ;
le chapeau Lun-Ecosystem/lun-docs#185. Deux décisions de CrOliX du 22/11 : les commandes sur le NAS se jouent depuis
le laptop, par SSH, avec un compte limité ; Lun-Ecosystem/lun-acedia#76 est corrigé avant.

**Critères de fin**, ceux de l'issue, chacun avec sa tâche :

1. **Un état des lieux du NAS est écrit** avant toute installation : Docker et Compose, le réseau privé, la place,
   l'accès SSH par un compte limité à ce qu'il faut, rien d'ouvert sur la box. Tâche 1.
2. **Une version de chaque serveur est publiée** depuis `main`, et la page d'installation est relue contre le code
   d'aujourd'hui. Tâches 2 et 3.
3. **Les trois serveurs tournent sur le NAS**, chacun dans son conteneur avec sa base, joignables par le réseau privé
   en HTTPS ; les satellites sont reliés au core ; les secrets ne sont dans aucun dépôt. Tâches 4 à 7.
4. **Ce qui conditionne la semaine est vérifié sur le NAS** : Google en production ; le téléphone ; le premier
   appareil relié sans terminal ; un redémarrage et une nuit rattrapée ; une copie de chaque base et une restauration
   essayée ; une mise à jour et un retour arrière ; le fournisseur de modèle réglé par l'écran. Tâches 7 à 13.
5. **Les vérifications en attente de #185** sont faites : les chevauchements d'agenda sur de vrais événements,
   l'export téléchargé depuis le téléphone, l'agent sans nom en dur. Tâche 14.
6. **La page de mise en service est à jour** et dit comment refaire chaque geste ; ce qui a surpris est écrit.
   Tâche 15. L'accès ouvert pour le chantier est refermé ou justifié : tâche 16.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-docs` : le plan, la page du NAS | `docs/mise-en-service-nas` | Lun-Ecosystem/lun-docs#190 | `critique` |
| `lun-anima` : la PR de version, la page d'installation relue | à créer | une issue privée, à ouvrir | `critique` |
| `lun-acedia` : la PR de version, le `.env.example`, le lien de restauration | à créer | à ouvrir | `standard` |
| `lun-avaritia` : la PR de version, le `.env.example`, le lien de restauration | à créer | à ouvrir | `standard` |

**Le niveau.** `critique` : la prod, les vraies données, les vrais secrets, un accès au NAS. Le code ne change presque
pas : la mise en service vérifie des gestes d'exploitation sur des versions déjà prouvées en local. Ce qui touche le
code (la page d'installation du core, les deux `.env.example`) passe par une PR relue, avant l'installation.

## Ce que l'interdit demande, et comment ce plan le tient

`environnements.md`, « Interdit » : pas de « tests à faire une fois sur la prod » ; pas de version non fusionnée sur
la prod ; le vrai compte Google seulement sur la prod.

- **Aucun code non prouvé n'entre sur le NAS.** Chaque image est publiée depuis `main`, CI verte, et démarrée d'abord
  sur le laptop sur une base neuve (tâche 2). Le NAS ne reçoit que des images publiées par CrOliX.
- **La mise en service vérifie des gestes, pas du code** : démarrer, relier, redémarrer, copier, restaurer, mettre à
  jour, revenir en arrière. Chacun de ces comportements est déjà couvert par les tests de son dépôt ; ce qui se
  vérifie ici, c'est qu'il tient sur cette machine, avec ce Docker et ce réseau.
- **Un écart trouvé sur le NAS ne se corrige pas sur le NAS.** Il s'écrit, le geste s'arrête, le correctif passe par
  un chantier sur le laptop, une PR, une version. Le NAS ne porte jamais un fichier modifié à la main hors de sa
  configuration.
- **Le vrai compte Google n'entre que sur le NAS**, à la tâche 9, après le point d'arrêt C. Le laptop garde le compte
  de test ; le client OAuth de la prod est distinct de celui du laptop (« À trancher », point 4).

## Ce que le code fait aujourd'hui

### Le déploiement du core (privé)

Le dépôt du core porte le déploiement des trois serveurs (ADR 0008) : un conteneur par app, chacun à côté de son
conteneur Tailscale qui lui donne son nom dans le réseau privé et son HTTPS, l'app écoutant sur la boucle locale de
ce conteneur. Rien n'est publié sur le NAS lui-même. Un script déploie une version, attend le contrôle de santé, et
remet la version d'avant si la nouvelle ne répond pas en deux minutes ; il sait aussi revenir à la version d'avant en
une commande. Les bases vivent dans un volume Docker par app ; l'état de chaque nœud du réseau privé dans le sien.
Le détail, fichiers et lignes, est dans la part privée.

### Les images et les versions

- Les trois serveurs sont en `v0.1.0`, publiées le 06/11. Leur version vit dans `core/package.json` (le core) ou
  `server/package.json` (les satellites), toujours à `0.1.0`.
- Le workflow « Release image » de chaque dépôt (`.github/workflows/release.yml`) se déclenche sur une release
  publiée, vérifie que le tag vaut `v<version>`, construit l'image `linux/amd64` et la pousse sur GHCR sous la version
  et `latest`. Il ne vérifie pas que le tag est posé sur `main` : c'est à CrOliX de choisir `main` en publiant.
- La CI de chaque dépôt construit déjà l'image à chaque PR (`docker build`, `ci.yml`). Sur `main`, les trois CI sont
  vertes aux commits relus.
- Chaque image a son contrôle de santé : la page d'accueil répond (`Dockerfile`, `HEALTHCHECK`, toutes les 30 s après
  20 s). Chacune tourne sous l'utilisateur `node`, sa base dans `/app/data`.
- `git.md`, « Release » : la PR `chore(release): <projet> x.y.z` est fusionnée par CrOliX, le tag posé par CrOliX
  seul ; l'agent prépare la PR de version, ne pose jamais de tag et ne crée jamais de release (le hook de garde bloque
  `gh release create`).
- Depuis le 06/11, presque tout novembre est sur `main` : dans le core, deux fournisseurs de modèle au choix dans
  l'écran, une clé par fournisseur chiffrée en base, de nouvelles variables, une migration de base, l'historique qui
  garde les appels d'outil (59 commits depuis `v0.1.0`) ; dans Acedia, les chevauchements d'agenda et l'agent sans nom
  en dur ; dans Avaritia, l'export téléchargé.

### Ce que chaque app sait déjà faire pour tenir en continu

- **La copie de la base** : chaque serveur copie la sienne dans `backups/`, à côté d'elle, donc dans son volume, dès
  qu'il écoute puis chaque heure si celle du jour manque ; sept au plus. Une copie ratée va au journal, et au Journal
  du core pour un satellite relié (README d'Acedia et d'Avaritia, « Données »). Aucune commande ne fait une copie à la
  demande.
- **Le contrôle de santé** : celui de l'image, lu par le script de déploiement.
- **La nuit manquée** : jouée une fois dans la minute qui suit le démarrage, comme la lettre du matin, sauf réglage
  contraire pour une base jetable (mise en service du desktop, § 7). La nuit et le matin tournent à l'heure de Paris
  quel que soit le fuseau du conteneur (vérifié le 08/11, plan de bascule, § 1).
- **Les notifications** : seul le core envoie des Web Push. Ses clés VAPID sont créées par lui au premier besoin et
  rangées dans sa base, chiffrées par sa clé secrète : aucune clé de notification à créer à la main. Côté téléphone :
  la PWA installée depuis l'adresse HTTPS du core, les notifications autorisées. Une origine qui change oblige à se
  réabonner.
- **Le premier appareil** : sur une base neuve, la page de chaque app montre le code du premier appareil, déjà saisi,
  **seulement sur la machine qui l'héberge, à son adresse locale, sans en-tête de relais** (lun-anima#113,
  lun-acedia#73, lun-avaritia#40). Derrière `tailscale serve`, chaque requête porte un en-tête de relais : sur le NAS,
  **aucune page ne montre ce code**, et le NAS n'a pas d'écran. Le code part aussi au journal de chaque serveur au
  démarrage (`bootstrapPairing`, Acedia `server/src/contract/auth.ts`). Le plan du premier contact le disait déjà
  (§ « La machine dédiée ») : « sans écran, ou derrière un relais, aucune page n'y donne de code ». Le chemin sans
  terminal sur le NAS est donc à choisir (« À trancher », point 3).

### Ce que la page d'installation dit encore, et le code ne fait plus ou pas

Relu le 22/11, sans rien jouer. Les lignes du core sont dans la part privée.

1. **Le chemin de la base laissé vide fait tomber les trois serveurs.** La page dit de laisser vides l'adresse
   d'écoute et le chemin de la base. Une ligne vide dans un fichier d'environnement de Compose donne une chaîne vide,
   pas une variable absente. Pour le chemin de la base, Acedia (`server/src/main.ts:41`) et Avaritia
   (`server/src/main.ts:22`) font `resolve(root, process.env.DB_PATH ?? …)` : une chaîne vide passe le `??` et la base
   devient le dossier de l'app. Le core fait de même. Lu dans le code, pas joué : à prouver sur le laptop à la tâche 2.
   L'adresse d'écoute vide, elle, retombe bien sur la boucle locale (`HOST?.trim() ||`).
2. **Le premier appareil** n'a de code qu'au journal sous Docker (ci-dessus) : la page le dit, mais l'écran ne le
   donne pas, et « sans terminal » demande un chemin.
3. **Relier un satellite par la commande sans code** ouvre un navigateur : impossible dans un conteneur. Le chemin
   qui marche est l'écran (Atelier › Postes, code donné par le satellite), règle de la maison.
4. **Les deux fournisseurs** : la page ne dit ni la clé d'Anthropic, ni que la clé et le modèle se règlent par
   l'écran, chiffrés en base.
5. **La clé du réseau privé** : la page demande une clé réutilisable et préapprouvée, sans étiquette. Un nœud sans
   étiquette voit sa clé de nœud expirer (180 jours par défaut chez Tailscale, à vérifier dans la console) : les trois
   apps deviendraient injoignables un jour, sans erreur de leur côté.
6. **Les copies et la restauration** : la page ne dit ni où sont les copies sur le NAS, ni comment en restaurer une ;
   les README d'Acedia et d'Avaritia renvoient à la page du desktop.
7. **Avant une mise à jour**, rien ne copie la base. Une migration ne se défait pas : le core joue ses migrations en
   avant et n'en refuse aucune plus récente. Un retour arrière remet une image plus ancienne sur une base déjà migrée.
8. **Les `.env.example` d'Acedia et d'Avaritia** ne disent pas `LLM_PRICES`, que les deux lisent
   (`server/src/llm/models.ts:98-101`) et que la page du desktop (§ 11) demande pour un modèle sans prix.
9. **L'image de Tailscale** suit `stable`, sans version : une mise à jour du NAS peut changer de version sans le dire.

## L'accès au NAS depuis le laptop

Décision de CrOliX du 22/11 : la session qui pilote joue les commandes depuis le laptop, par SSH, avec un compte
limité. Constaté sur le laptop : aucun accès SSH au NAS n'est configuré ; le client du réseau privé n'est pas installé
en ligne de commande ; le client Docker est installé, pas son moteur.

**Ce que dit la documentation d'UGREEN**
([se connecter en SSH](https://ai.ugreen.com/blogs/how-to/connect-nas-ssh-root-access), lue le 22/11) :
SSH s'active dans UGOS, Panneau de configuration › Terminal ; un port, un niveau de sécurité, un accès
limité au réseau local au choix, une **désactivation automatique** à régler ; la connexion se fait **avec un compte
administrateur d'UGOS**, puis `sudo -i` pour root ; une clé Ed25519 se dépose dans `~/.ssh/authorized_keys`, après
avoir activé le dossier personnel du compte. Elle ne dit pas si un compte standard peut se connecter en SSH, ni comment
UGOS range le groupe `docker`. **À vérifier dans l'état des lieux.**

**Ce qu'un « compte limité à Docker » veut dire.** La documentation de Docker le dit : appartenir au groupe `docker`
vaut les droits de root sur la machine. Un compte qui pilote Docker n'est donc pas limité en pouvoir. Il l'est par :
ce qu'il n'est pas (pas le compte d'administration de CrOliX, pas `sudo`) ; une clé à lui seul, déposée par CrOliX,
avec des options qui coupent le reste (`no-port-forwarding`, `no-agent-forwarding`, `no-X11-forwarding`, et une
origine restreinte si UGOS l'accepte) ; le temps (SSH ouvert pour une séance, désactivé ensuite) ; et une fin écrite
(tâche 16). Si UGOS refuse SSH à un compte standard, le compte est un administrateur **dédié**, distinct de celui de
CrOliX, avec la même clé et les mêmes limites (« À trancher », point 1).

**Comment le laptop joint le NAS.** Chez lui : le réseau local. Ailleurs : le réseau privé, qui demande que le NAS
lui-même y ait un nœud (les trois nœuds du déploiement sont ceux des apps, pas celui du NAS), et le client sur le
laptop. Une règle du réseau privé limite le port SSH du NAS au seul laptop (« À trancher », point 2).

## Ce que CrOliX prépare avant la tâche 1

Lui seul, parce que cela touche ses comptes et ses accès ; la session ne fait rien avant.

- [ ] **P1. Le client du réseau privé sur le laptop**, connecté à son réseau : `tailscale status` y répond.
- [ ] **P2. Le compte de pilotage sur le NAS**, dans UGOS : un compte dédié, qui n'est pas le sien ; standard si UGOS
  accepte SSH pour lui, administrateur dédié sinon (à essayer, point 1) ; son dossier personnel activé ; un dossier
  partagé du chantier, sur le stockage protégé, où ce compte a l'écriture et où vivront le déploiement et ses
  fichiers d'environnement.
- [ ] **P3. SSH activé** dans UGOS pour la séance : port, niveau élevé, désactivation automatique réglée.
- [ ] **P4. La clé SSH dédiée** : créée sur le laptop par lui (Ed25519, avec phrase de passe, chargée dans l'agent SSH
  de Windows pour la séance), la partie publique déposée par lui dans `authorized_keys` du compte de pilotage, avec
  les options de restriction. La partie privée ne quitte pas le laptop.
- [ ] **P5. Le nœud du NAS dans le réseau privé**, si l'accès hors de chez lui est retenu (point 2), et sa règle qui
  ne laisse passer que le laptop sur le port SSH.
- [ ] **P6. Les valeurs de l'instance**, dans la part privée, à remplir par lui : le nom du NAS et du compte de
  pilotage, le dossier partagé, le port SSH. Elles ne vont dans aucun dépôt.

## Les tâches

**Qui fait quoi.** CrOliX : ce qui touche ses comptes, ses secrets et les gestes irréversibles (publier une version,
entrer un secret, le vrai compte Google, redémarrer le NAS, effacer). La session qui pilote, par SSH depuis le laptop :
le reste des gestes sur le NAS, en lecture d'abord. Les agents : le code et la doc, sur le laptop, par PR.

**L'ordre.** 1, 2 et 3 partent ensemble. 4 attend 1, 2 et 3 et l'arrêt A. 5 à 8 se suivent après l'arrêt B. 9 attend
l'arrêt C. 10, 11, 12 et 14 peuvent s'entrelacer après 9 ; 12 se joue avant toute vraie donnée dans Avaritia. 13
demande une nuit. 15 se tient tout du long et se ferme à la fin ; 16 en dernier.

**Les points d'arrêt**, où CrOliX valide avant de continuer :

- **A**, après l'état des lieux (tâche 1) : il lit le relevé et dit « on installe » ou renvoie le plan.
- **B**, avant la première installation (avant la tâche 5) : les versions sont publiées, la page d'installation est
  corrigée, les fichiers sont prêts sans secrets ; il relit ce que la tâche 6 va lancer.
- **C**, avant d'entrer le vrai compte Google (avant la tâche 9) : les trois serveurs tournent, les appareils et la
  liaison sont faits, une copie et une restauration ont été essayées sur Acedia vide.
- **D**, avant de refermer l'accès (tâche 16) : il dit ce qui reste ouvert et pourquoi.

**Pour chaque geste sur le NAS** : la commande, ce qu'on attend, comment on le vérifie, comment on revient en arrière.
Les commandes exactes sont dans la part privée, par numéro de tâche. Chaque sortie lue est collée dans le relevé du
chantier, **sans** secret : aucune commande ne lit ni n'affiche un fichier d'environnement. Une sortie qui
surprend arrête la tâche.

### Tâche 1. L'état des lieux, en lecture seule (la session, par SSH)

- [ ] Rien ne s'écrit sur le NAS ; aucune commande `sudo`, sauf si CrOliX la joue lui-même.

Ce qu'elle regarde, et ce qu'on attend :

- **Le système** : la version d'UGOS et du noyau ; l'architecture (`x86_64`, les images sont `amd64`).
- **Docker** : la version du moteur et de Compose v2 (`docker compose version`) ; si le compte de pilotage parle au
  moteur sans `sudo` ; où Docker range ses données (`docker info`, la racine de ses données) et si ce dossier est sur
  le stockage protégé du NAS (le groupe de disques, son niveau de redondance).
- **La place et la mémoire** : l'espace libre du volume qui portera les données ; la mémoire totale et libre. Repère :
  trois serveurs Node et trois nœuds du réseau privé, de l'ordre d'un gigaoctet à eux tous (à mesurer à la tâche 6).
- **Ce qui tourne déjà** : les conteneurs, les projets Compose, les ports écoutés par l'hôte. Le déploiement n'en
  publie aucun, mais un nœud du réseau privé déjà présent sur l'hôte change le point 2.
- **`/dev/net/tun`** présent : les nœuds du réseau privé tournent en mode noyau.
- **L'heure** : synchronisée, et le fuseau de l'hôte.
- **Le réseau privé** : depuis le laptop, `tailscale status` ; HTTPS et noms courts activés pour le réseau (console,
  par CrOliX) ; si l'hôte a déjà un nœud.
- **Les volumes** : où vivront les bases (« À trancher », point 5) et si ce dossier est couvert par les instantanés
  ou la sauvegarde du NAS.
- **Les copies du NAS lui-même** : ce qu'UGOS sauvegarde déjà, où, à quelle fréquence ; instantanés du système de
  fichiers disponibles ou non.
- **La box** : rien n'est redirigé vers le NAS, UPnP du NAS coupé (relu par CrOliX dans l'écran de sa box et d'UGOS).
- **L'accès** : le compte de pilotage, ses groupes, s'il a `sudo` ; SSH limité ou non au réseau local ; la
  désactivation automatique en place.
- **L'écran Docker d'UGOS** : s'il montre les conteneurs lancés par Compose et leur journal (point 3).

**Seuil d'arrêt**, qui renvoie le plan à CrOliX : pas de Compose v2 ; une architecture autre que `x86_64` ; pas de
`/dev/net/tun` ; moins de 2 Go de mémoire libre ou 10 Go d'espace libre ; des données Docker hors du stockage protégé
sans moyen de les y mettre ; un port ou un service déjà ouvert sur la box ; un compte de pilotage qui a l'administration
sans que le point 1 l'ait accepté.

**Preuve** : le relevé écrit dans la PR de lun-docs, valeurs de l'instance retirées (elles vont dans la part privée).
**Exclu** : installer quoi que ce soit, changer un réglage d'UGOS. **Point d'arrêt A.**

### Tâche 2. Les versions publiées (un agent prépare, CrOliX publie)

- [ ] **Dans l'ordre** : Avaritia, puis le core, puis Acedia, qui attend lun-acedia#76 (« trois onglets d'Acedia ouverts
  sur la même adresse, plus rien ne répond », chantier à part, en cours). Avaritia et le core peuvent partir en
  parallèle de la tâche 1.
- [ ] **Depuis quel commit** : la tête de `main` le jour de la PR de version, après la tâche 3 si elle touche le
  dépôt. Le SHA est écrit dans la PR de version.
- [ ] **Les numéros** : `0.2.0` pour les trois (des fonctions nouvelles, aucun contrat cassé), sauf avis de CrOliX.

Pour chaque dépôt :

1. **Avant** : CI verte sur le commit ; l'image construite **sur le laptop** depuis ce commit (le moteur Docker du
   laptop est à démarrer par CrOliX) et démarrée sur un volume neuf, sans réseau sortant ni secret réel : elle passe
   `healthy`, le code du premier appareil est au journal, la page répond. Pour Acedia, la même chose en ouvrant trois
   onglets derrière un relais HTTPS local si l'agent sait le monter, sinon la preuve de lun-acedia#76 fait foi. Le
   chemin de la base laissé vide est essayé ici (écart 1) : la preuve dit s'il tombe.
2. **La PR de version** : `chore(release): <projet> 0.2.0`, préparée par l'agent `livreur`, qui monte la version et
   liste les chantiers regroupés. Fusionnée par CrOliX.
3. **La release** : publiée par CrOliX, tag `v0.2.0` sur `main`, notes générées par GitHub. Le workflow pousse l'image.
4. **Après** : le workflow vert ; l'image présente sur GHCR sous `0.2.0` ; son empreinte notée.

**Qui publie** : `git.md` le dit déjà, CrOliX (« À trancher », point 6). **Retour arrière** : une release ratée se
retire par CrOliX (la release et l'image), la version se republie en `0.2.1` ; jamais un tag déplacé.
**Exclu** : un correctif de code dans la PR de version.

### Tâche 3. La page d'installation relue contre le code (un agent, Lun'Anima et les deux satellites)

- [ ] **Lun'Anima** : la page d'installation du core corrigée des écarts 1 à 7 et 9, et le choix des points 3 et 5
  appliqué. Le détail est dans la part privée, à porter dans l'issue privée. Preuve : la PR relue, CI verte, et pour
  ce qui touche le fichier de Compose, `docker compose config` sur le laptop sans erreur.
- [ ] **Lun'Acedia et Lun'Avaritia** : `LLM_PRICES` dans le `.env.example`, commentée, sans valeur ; le lien de
  restauration de leur README pointé vers la page du NAS (tâche 15) quand elle existe. Ces deux points peuvent entrer
  dans la PR de version de chacun.
- **Exclu** : changer un comportement du code. Si l'écart 1 se confirme et que la doc ne suffit pas (une valeur vide
  qui devrait valoir l'absence), c'est un correctif à part, `standard`, dans chaque dépôt, avant sa version.

### Tâche 4. Préparer le NAS, sans secret (la session, par SSH)

- [ ] Le dossier de déploiement du core copié depuis `main` au commit de sa version, dans le dossier partagé du
  chantier ; l'empreinte des fichiers comparée à celle du dépôt.
- [ ] Les fichiers d'environnement créés depuis leur modèle, **sans aucun secret** : les versions, l'adresse d'écoute
  et le chemin de la base tels que corrigés à la tâche 3, l'adresse de retour Google d'Acedia (`GOOGLE_REDIRECT_URI`,
  sur son nom dans le réseau privé). Droits `600`, au compte de pilotage.
- [ ] Les dossiers des données, si le point 5 retient des dossiers du NAS : créés, au propriétaire `node` de l'image
  (uid 1000), droits `700`.
- **Vérifier** : la liste des fichiers et leurs droits ; `docker compose config` sur le NAS, sortie relue sans les
  valeurs (seules les clés des variables).
- **Revenir en arrière** : effacer le dossier du chantier ; rien d'autre n'a bougé.
- **Exclu** : démarrer un conteneur, se connecter à GHCR. **Point d'arrêt B.**

### Tâche 5. Les secrets (CrOliX)

Chaque secret est saisi par CrOliX, sur le NAS, dans un éditeur ouvert par lui sur le fichier (par sa propre session
SSH ou l'éditeur de fichiers d'UGOS), ou par l'écran de l'app. **Jamais** dans la conversation, dans un dépôt, dans une
ligne de commande (l'historique du shell), ni dans un journal. Une copie de chaque clé de chiffrement va dans son
gestionnaire de mots de passe : sans elle, une copie de base ne rend plus ses secrets.

- **La clé d'authentification du réseau privé.** Créée dans la console Tailscale, préapprouvée, **avec une
  étiquette**, pour une durée courte. Saisie par CrOliX dans le fichier d'environnement du déploiement ; **vidée** et
  révoquée une fois les trois nœuds en ligne : l'état de chaque nœud reste dans son volume.
- **Le jeton de lecture des images.** Un jeton GitHub classique limité à `read:packages`. Saisi par CrOliX à la
  connexion Docker du compte de pilotage, par l'entrée standard. Vit dans la configuration Docker de ce compte, en
  clair, droits `600`. Échéance de 90 jours, rappel noté, remplacé avant.
- **La clé de chiffrement de chaque app.** Tirée sur le NAS par CrOliX (32 octets en base64), saisie dans le fichier
  d'environnement de l'app, une copie hors du NAS. Sans échéance : elle ne change pas tant que sa base vit.
- **L'identifiant et le secret OAuth de Google.** Le client de la prod, créé dans la console Google (tâche 9), saisis
  par CrOliX dans le fichier d'Acedia. Révoqués en cas de fuite.
- **La clé du fournisseur de modèle du core.** Créée chez le fournisseur, saisie par CrOliX **par l'écran** du core,
  avec son échéance (alerte à J-14 et J-3). Vit dans la base du core, chiffrée.
- **Les clés d'IA d'Acedia et d'Avaritia.** De même, **par l'écran** Réglages de chaque app, chiffrées dans sa base.
- **Les clés de notification.** Le core les crée lui-même, chiffrées dans sa base : personne ne les saisit.

- **Vérifier** (la session) : chaque fichier a ses droits `600` et la ligne de chaque secret attendu est non vide,
  sans afficher la valeur (un test sur la longueur).
- **Revenir en arrière** : un secret mal saisi se ressaisit ; un secret qui a pu fuir se révoque et se remplace
  (`securite.md`).
- **Exclu** : les secrets de Google avant l'arrêt C ; une clé de fournisseur dans un fichier quand l'écran la prend.

### Tâche 6. Le premier démarrage (la session, par SSH)

- [ ] Tirer les trois images à leur version, puis tout démarrer.
- **On attend** : les trois apps `healthy` en moins d'une minute ; trois nœuds en ligne dans la console du réseau
  privé, étiquetés ; depuis le laptop, chaque app répond en HTTPS sur son nom, avec un certificat valide ; Acedia dit
  au journal « Google non configuré » (normal avant la tâche 9).
- **Vérifier** : l'état des conteneurs ; la mémoire prise par chacun (relevée, comparée au repère de la tâche 1) ; les
  trois premières lignes de chaque journal, sans les codes d'appairage dans le relevé public.
- **Après** : la clé d'authentification vidée du fichier et révoquée dans la console (tâche 5).
- **Revenir en arrière** : tout arrêter **sans effacer les volumes** ; l'option qui les efface n'est jamais jouée sur
  le NAS. Les nœuds se retirent de la console si on abandonne.
- **Exclu** : relier quoi que ce soit, ouvrir un port.

### Tâche 7. Les premiers appareils et la liaison (CrOliX, la session en appui)

- [ ] **Le premier appareil de chaque app**, par le chemin retenu au point 3. Recommandé : CrOliX lit le code dans
  l'écran Docker d'UGOS (le journal du conteneur), s'il le montre (tâche 1) ; sinon la session le lit au journal et
  le lui dit. Le navigateur du laptop d'abord, dans l'ordre : le core, Acedia, Avaritia, chacun à son nom HTTPS.
  Puis le téléphone, par un code donné par l'appareil appairé (Atelier › Appareils, Réglages › Appareils et
  applications) : sans terminal.
- [ ] **Relier Acedia et Avaritia au core, par l'écran** : dans le satellite, « Relier un appareil » ; dans le core,
  Atelier › Postes, « Relier », l'adresse HTTPS du satellite dans le réseau privé, puis le code.
- [ ] **L'adresse de la page** d'Acedia et d'Avaritia dans Atelier › Postes, la même adresse HTTPS.
- **Vérifier** : la Constellation montre les deux satellites joignables ; un événement émis par un satellite **après**
  la liaison arrive au Journal du core (l'entrée « … relié. » que le core écrit lui-même ne le prouve pas).
- **Revenir en arrière** : révoquer un appareil ou une liaison par l'écran ; une base neuve se refait en effaçant son
  volume, geste de CrOliX, seulement avant l'arrêt C.
- **Exclu** : appairer Luxuria (la session du desktop).

### Tâche 8. Le fournisseur de modèle, par l'écran (CrOliX)

- [ ] **Avant la clé**, une phrase au core : l'écran dit qu'aucune clé n'est enregistrée pour le fournisseur, et le
  téléphone ne reçoit rien de faux. C'est la vérification de « l'alerte quand une clé manque ». De même dans Acedia et
  Avaritia avant leur clé d'IA : leur écran le dit.
- [ ] **La clé d'Anthropic**, saisie dans l'écran du core, avec son échéance ; le fournisseur Anthropic et le modèle
  Claude Haiku 5.5 choisis dans l'écran (raisonnement coupé, déjà le réglage de la table du core) ; les plafonds du
  jour et de la nuit relus.
- [ ] **Un premier tour de conversation** depuis le navigateur du laptop : une réponse en flux ; puis un outil (« relis
  ma journée ») ; l'écran des dépenses dit le fournisseur et un coût non nul.
- [ ] Les clés d'IA d'Acedia et d'Avaritia, par leurs Réglages, avec un modèle qui a un prix (ou son prix déclaré).
- **Vérifier** : un redéploiement du core (tâche 12, ou un simple redémarrage du conteneur) garde la clé et le choix.
- **Revenir en arrière** : retirer la clé dans l'écran, la révoquer chez le fournisseur.
- **Exclu** : mesurer le délai de la voix (la session du desktop).

### Tâche 9. Google en production (CrOliX) ; **point d'arrêt C avant**

- [ ] **Dans la console Google**, par CrOliX : le projet OAuth en « Production » (en « Test », le jeton tombe au bout de
  sept jours) ; un client OAuth « Application Web » propre à la prod (point 4), dont l'adresse de retour autorisée est
  celle d'Acedia dans le réseau privé, suivie de `/oauth/callback`. Les règles de Google : HTTPS, pas d'adresse IP, un
  domaine de premier niveau de la liste des suffixes publics
  ([règles des adresses de retour](https://developers.google.com/identity/protocols/oauth2/web-server)) ; le domaine du
  réseau privé y est, mais **si la console refuse cette adresse, on s'arrête** et le plan revient à CrOliX.
- [ ] L'identifiant et le secret dans le fichier d'Acedia (tâche 5), puis Acedia redémarrée (la session).
- [ ] **Le vrai compte**, connecté par CrOliX dans Acedia, Réglages › Compte Google. L'avertissement « Google n'a pas
  validé cette application » s'affiche (lun-acedia#55) : il le passe, c'est son propre client, pour son seul compte.
  La validation par Google des champs sensibles de Gmail est hors du MVP (point 4).
- **Vérifier** : Acedia dit Google connecté ; le premier tri passe sur de vrais mails sans erreur au journal ; une
  carte attend dans « À valider » sans rien envoyer.
- **Revenir en arrière** : déconnecter dans Acedia ; retirer l'accès de l'app dans le compte Google de CrOliX ; vider
  les deux valeurs du fichier.
- **Exclu** : le compte de test sur le NAS ; brancher Google par l'écran (après le MVP).

### Tâche 10. Le téléphone (CrOliX)

- [ ] Le client du réseau privé sur le téléphone ; la PWA du core installée depuis son adresse HTTPS ; les
  notifications autorisées. Celles d'Acedia et d'Avaritia de même, s'il les veut sur l'écran d'accueil.
- [ ] **Une notification de bout en bout** : un événement qui en mérite une (une urgence d'Acedia, ou le geste de
  test s'il existe dans l'écran) arrive sur le téléphone verrouillé, et son toucher ouvre le bon écran.
- **Vérifier** : la capture du téléphone, l'heure du Journal du core.
- **Revenir en arrière** : se désabonner dans l'app ; révoquer l'appareil.

### Tâche 11. Une copie de chaque base, et une restauration essayée (la session ; CrOliX valide)

- [ ] **Les copies** : la copie du jour de chaque base est dans son dossier de copies, le journal de chaque serveur dit
  « Base copiée ».
- [ ] **Une restauration essayée pour de vrai, sur une base à part** : pour chaque app, la dernière copie copiée (pas
  déplacée) dans un volume jetable, puis l'image de la même version démarrée sur elle **sans aucun réseau** et avec la
  même clé de chiffrement : sans réseau, elle ne peut ni joindre Google, ni trier, ni envoyer. On attend : elle passe
  `healthy`, son journal ne dit aucune erreur de déchiffrement, le contrôle d'intégrité de SQLite répond `ok`, et le
  compte des lignes des tables principales est celui de la base vivante au moment de la copie. Puis le conteneur et
  le volume jetables sont retirés.
- [ ] **Une restauration à la place, sur Acedia vide**, avant l'arrêt C : la base mise de côté avec ses fichiers `-wal`
  et `-shm`, la copie remise, le satellite relié de nouveau au core, un événement vu au Journal ; puis le retour à la
  base mise de côté. C'est le geste de la page du desktop (§ 9), refait pour le NAS.
- [ ] **Une copie hors du NAS** : la règle retenue au point 5 posée par CrOliX dans UGOS, et sa première exécution vue.
- **Revenir en arrière** : la base mise de côté se remet à sa place ; rien ne s'efface avant que la restauration soit
  vérifiée.
- **Exclu** : restaurer la base vivante d'Acedia une fois le vrai compte entré.

### Tâche 12. Une mise à jour, puis un retour arrière (la session)

- [ ] Sur **Avaritia, avant toute vraie donnée** (point 7) : une copie de sa base mise de côté ; le script de
  déploiement passe Avaritia à `0.1.0`, puis revient à la version en service par le retour arrière.
- **On attend** : l'un ou l'autre de deux résultats, chacun une preuve. Ou `0.1.0` passe `healthy` sur la base
  migrée, et le retour arrière remet `0.2.0`, `healthy`. Ou `0.1.0` ne passe pas, et le script remet de lui-même
  `0.2.0` : le retour automatique est prouvé, et l'on sait qu'un retour arrière sur une base migrée demande la copie
  d'avant. Dans les deux cas : la liaison au core tient, la base est entière.
- **Vérifier** : les deux fichiers de versions du déploiement ; l'état du conteneur ; la Constellation.
- **Revenir en arrière** : la copie mise de côté, remise comme à la tâche 11.
- **Exclu** : jouer ce geste sur le core ou sur Acedia une fois leurs vraies données entrées.

### Tâche 13. Un redémarrage du NAS, et une nuit rattrapée (CrOliX éteint, la session vérifie)

- [ ] Un soir, CrOliX éteint le NAS par UGOS et le rallume le lendemain **après 5 h**. La nuit de 5 h a donc été
  manquée.
- **On attend** : sans rien taper, les six conteneurs repartent, chaque nœud du réseau privé avant son app ; les trois
  apps `healthy` ; la nuit manquée jouée dans la minute qui suit, puis la lettre du matin ; les copies du jour faites ;
  le téléphone joint les trois apps.
- **Vérifier** : l'heure de démarrage de chaque conteneur ; le journal du core (la nuit, le matin) ; la Constellation.
  Un nœud du réseau privé reparti après son app laisse l'app sans réseau : à voir ici, et sa parade écrite s'il arrive
  (risques).
- **Revenir en arrière** : rien à défaire ; un conteneur resté arrêté se relance, et l'écart s'écrit.

### Tâche 14. Les trois vérifications de #185 (CrOliX, sur le téléphone et le vrai compte)

- [ ] **Les chevauchements** : deux vrais événements qui se chevauchent dans son agenda principal, dont il est le seul
  organisateur ; la carte propose d'en déplacer un ; acceptée, l'événement bouge dans Google. Un conflit sur un agenda
  secondaire donne une carte qui signale sans proposer.
- [ ] **L'export** : l'export de la bibliothèque d'Avaritia téléchargé depuis le téléphone, et ouvert.
- [ ] **L'agent sans nom en dur** : aucun texte d'Acedia, ni sur le téléphone ni au Journal du core, ne porte « Pina » ;
  il lit le nom réglé, « Agent » par défaut.
- **Vérifier** : les captures ; #185 cochée et fermée si sa page du site est faite.

### Tâche 15. La page de mise en service du NAS (un agent, tout du long)

- [ ] **lun-docs, `docs/mise-en-service-nas.md`**, publique : ce que CrOliX voit et fait, geste par geste, comme la page
  du desktop, sans commande, chemin ni variable du core (renvoi à la page privée). Elle remplace celle du desktop pour
  l'usage ; l'en-tête de `mise-en-service-desktop.md` y renvoie, le reste de cette page ne change pas. Elle dit
  comment refaire chaque geste : appairer, relier, restaurer, mettre à jour, revenir en arrière, redémarrer.
- [ ] **« Ce qui a surpris »**, une section de la page, tenue pendant les tâches 1 à 14.
- [ ] **La page d'installation du core** : ce que l'installation réelle a appris, dans la PR privée.
- [ ] **Les README d'Acedia et d'Avaritia** : leur lien de restauration vers la nouvelle page.
- [ ] La feuille de route : l'état du chantier au § 1 et dans « Le recadrage du 20/11 ».
- **Vérifier** : `npm run check`, `npm test`, `npm run sync:check` ; la page relue par le `reviewer`.

### Tâche 16. Refermer l'accès (CrOliX, après le point d'arrêt D)

- [ ] SSH désactivé dans UGOS ; la clé du chantier retirée de `authorized_keys` ; le compte de pilotage désactivé ou
  gardé **avec sa raison écrite** (les mises à jour de la semaine passent par lui) et une date de revue.
- [ ] Le nœud du NAS dans le réseau privé et sa règle : retirés, ou gardés avec leur raison.
- [ ] Le jeton de lecture des images : gardé (les mises à jour en ont besoin), son échéance notée.
- **Vérifier** : depuis le laptop, la connexion SSH échoue ; la console du réseau privé montre les seuls nœuds voulus.

## À trancher par CrOliX

1. **Le compte de pilotage.** (a) Un compte standard d'UGOS dans le groupe `docker`, si UGOS accepte SSH pour lui ;
   (b) un administrateur dédié, distinct du sien, si UGOS le refuse. Dans les deux cas le compte vaut root par Docker :
   la limite est la clé, le temps et la fin écrite. **Recommandé : (a), essayé à la tâche 1 ; (b) sinon.**
2. **L'accès hors de chez lui.** (a) Le réseau local seulement : les séances se jouent chez lui ; (b) un nœud pour le
   NAS lui-même dans le réseau privé, et une règle qui ne laisse que le laptop sur le port SSH. **Recommandé : (b)**,
   puisqu'il est hors de chez lui la plupart du temps ; retiré ou justifié à la tâche 16. Comment poser ce nœud
   (une app d'UGOS, s'il y en a une, ou un conteneur sur le réseau de l'hôte) : à voir à la tâche 1.
3. **Le premier appareil sans terminal sur le NAS.** Aucune page ne donne le code derrière le relais. (a) Le code lu
   dans l'écran Docker d'UGOS, qui montre le journal du conteneur : sans terminal, sans code nouveau ; (b) la session
   le lit au journal et le dit : un terminal, mais pas celui de CrOliX ; (c) un chantier de code qui donne le code
   autrement : avant le MVP, contraire à l'ordre du VIP. **Recommandé : (a) si la tâche 1 le confirme, (b) sinon**,
   et la page de mise en service le dit tel quel.
4. **Google en production.** (a) Un client OAuth propre à la prod, dans un projet propre à la prod, en « Production »
   non validé, l'avertissement passé une fois ; (b) le même projet que le compte de test, avec une seconde adresse de
   retour. La validation des champs sensibles par Google : après le MVP. **Recommandé : (a)** : le secret du laptop ne
   donne rien sur le vrai compte.
5. **Où vivent les bases et leurs copies.** (a) Les volumes Docker, tels que codés : leurs copies restent dans la
   racine des données de Docker, sur le même disque ; (b) un dossier du dossier partagé du chantier, monté dans chaque
   conteneur : les instantanés et la sauvegarde d'UGOS le couvrent, et la restauration se fait par fichiers.
   **Recommandé : (b)**, un changement du fichier de Compose, prouvé sur le laptop à la tâche 3, avant toute
   base. Dans les deux cas, une copie hors du NAS par la sauvegarde d'UGOS, vers un autre support, à choisir par lui.
6. **Qui publie.** `git.md` le dit : CrOliX fusionne la PR de version et pose le tag ; le hook bloque l'agent. La
   question est seulement s'il veut déléguer : il faudrait changer la règle. **Recommandé : il publie lui-même**, trois
   releases, quelques minutes.
7. **Le geste de mise à jour et de retour arrière.** (a) Avaritia passée à `0.1.0` puis revenue, avant toute vraie
   donnée (tâche 12) ; (b) attendre la première vraie mise à jour, pendant la semaine. **Recommandé : (a)** : le
   geste est prouvé avant qu'on en ait besoin, et l'on apprend ce que vaut un retour arrière sur une base migrée.
8. **Les numéros de version.** `0.2.0` pour les trois. **Recommandé : oui.**

## Risques

- **Perdre une base.** Un volume effacé par erreur, un disque perdu. Parade : l'option de Compose qui efface les
  volumes n'est jamais jouée ; les bases dans le stockage protégé (point 5) ; une copie hors du NAS ; une copie mise
  de côté avant chaque mise à jour ; les clés de chiffrement dans son gestionnaire de mots de passe ; une restauration
  essayée avant l'arrêt C.
- **Un secret qui fuit.** Parade : saisis par CrOliX seul, hors conversation et hors ligne de commande ; aucune
  commande n'affiche un fichier d'environnement ; droits `600` ; la clé du réseau privé vidée et révoquée après usage ;
  `npm run check` sur chaque PR publique ; un secret qui a pu fuir se révoque et se remplace.
- **Un NAS qui redémarre mal.** Les conteneurs ne repartent pas, ou un nœud repart après son app, qui perd son réseau.
  Parade : la tâche 13 le constate avant la semaine ; sa parade s'écrit (relancer l'app après son nœud) ; le core
  prévient d'un satellite injoignable 15 min, au Journal et au téléphone.
- **Un accès SSH laissé ouvert.** Parade : désactivation automatique d'UGOS ; une clé à part, retirée à la tâche 16 ;
  le port limité au laptop ; rien d'ouvert sur la box, relu à la tâche 1.
- **Une release ratée.** Image absente, ou qui ne démarre pas. Parade : l'image démarrée sur le laptop avant ; le script
  refuse une image introuvable et revient seul si la santé ne vient pas ; une release ratée se retire et se republie
  en version suivante.
- **Le NAS trop juste en mémoire.** Parade : le seuil de la tâche 1 ; la mémoire de chaque conteneur relevée à la
  tâche 6 ; au-delà, une limite de mémoire par conteneur dans le fichier de Compose, par PR.
- **Les nœuds du réseau privé qui expirent.** Parade : la clé d'authentification étiquetée (écart 5) ; la console dit
  la date d'expiration de chaque nœud, relue à la tâche 6.
- **Un retour arrière sur une base migrée.** Parade : la tâche 12 le mesure ; la copie d'avant la mise à jour.

## Hors périmètre

L'accès sans réseau privé (un domaine, un relais : la cible de l'ADR 0008). Une machine dédiée. Lun'Luxuria et la
voix : la session du desktop, juste après. L'installation pour quelqu'un d'autre : en fin de VIP. Brancher Google par
l'écran (lun-acedia#55, après le MVP). La validation de l'app par Google. Tout correctif de code qui n'est pas un écart
bloquant de la page d'installation.

## Ensuite

- **La session du desktop, pour la voix** : Luxuria reliée au core du NAS par un code d'appairage, son adresse réglée
  dans l'écran ; la mesure des gestes, la langue, le délai contre les 2,5 s (feuille de route, « Le recadrage du
  20/11 », point 2).
- **La semaine de rodage**, sur le NAS : la porte du MVP. Les mises à jour qu'elle demande passent par une release et
  le script de déploiement, jamais par un fichier changé sur le NAS.

## Limites

- **Non joué, lu seulement** : l'écart 1 (le chemin de base vide), la limite de six connexions derrière le HTTPS du
  réseau privé (lun-acedia#76 le note), l'ordre de redémarrage des nœuds et des apps sous le moteur Docker d'UGOS.
- **Non confirmé dans la documentation d'UGREEN** : SSH pour un compte standard ; le groupe `docker` sous UGOS ; le
  journal d'un conteneur lancé par Compose dans l'écran Docker d'UGOS ; une app Tailscale pour l'hôte ; les
  instantanés du DXP2800. Tout cela se lit à la tâche 1.
- **Non confirmé chez les tiers** : l'expiration par défaut des nœuds non étiquetés chez Tailscale ; l'acceptation par
  la console Google de l'adresse du réseau privé comme adresse de retour d'une app en « Production ».
- La visibilité des images d'Acedia et d'Avaritia sur GHCR n'a pas pu être lue (jeton sans `read:packages`) ; la page
  d'installation dit seule celle du core privée.
