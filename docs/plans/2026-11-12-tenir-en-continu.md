# Tenir en continu : le core, Acedia et Avaritia, des jours sans s'arrêter. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **État : à valider par CrOliX.** Le chantier est validé (« ok je valide », 12/11) ; ce plan ne l'est pas encore.
> Écrit le 12/11 depuis l'audit du même jour, code relu sur `main` : lun-anima `b457668`, lun-acedia `1ae4457`,
> lun-avaritia `424c4ec`. Pas encore relu par le plan-challenger. Aucune issue ouverte (voir « Les issues »).
>
> **Deux paliers.** Palier 1 : la tâche 0, une mesure jetable de ce que les bases deviennent en un an. Palier 2 :
> les tâches 1 à 20. Seules les purges (6 et 18) attendent la tâche 0 et les durées que CrOliX tranche sur ses
> chiffres ; les autres partent dès la validation.

**But :** que le core, Acedia et Avaritia tournent des jours sans s'arrêter, sans perdre de données en silence et
sans grossir sans fin. C'est le préalable à la semaine de rodage (feuille de route, B8), porte du MVP.

**Source :** l'audit de l'écosystème du 12/11, section « 1. Tenir en continu », et ses rapports sur Acedia et
Avaritia. Chaque constat y a été lu par un agent, pas rejoué : chacun est relu ici dans le code ; ceux qui ne
tiennent pas sont écartés, avec la raison (« Ce que l'audit disait et qui ne tient pas »). Les pages
[`mise-en-service-desktop.md`](../mise-en-service-desktop.md) (§ 6 à 9) et le plan
[« plafonds et pause »](2026-11-02-natsume-centre-tranche-5-plafonds-pause.md) pour ce qui est déjà décidé.

**Critères de fin**, tous vérifiables sur le laptop, sans appel payant ni vraie base :

1. Aucune minuterie des trois serveurs ne peut les arrêter : chaque boucle a son filet, et un test par boucle la
   fait lever puis la voit repasser.
2. Une erreur restée hors de tout filet laisse une trace avant la sortie : une entrée au Journal du core, ou un
   événement du satellite que le core reçoit à la relance. Un test le prouve dans un processus enfant.
3. Le lanceur du desktop ne laisse plus un serveur arrêté pour de bon (selon « À trancher », point 3) : son test le
   montre relancer après la troisième chute.
4. Le flux en direct et la lecture du flux d'un poste ont une borne : un client qui ne lit plus ne fait plus grossir
   le core. Un test le prouve.
5. Avec les durées tranchées, une base nourrie sur 400 jours simulés cesse de grossir (un test par service purgé),
   le Journal du core et la mémoire de la relation n'y perdent rien (même compte avant et après), et la tâche 20
   rejoue la mesure de la tâche 0 avec le vrai code.
6. Chaque copie du jour part aussi dans un second dossier, réglable, avec la même rotation (sept) ; son échec est
   dit une fois par jour, comme une copie ratée ; une copie de ce dossier s'ouvre et passe le contrôle d'intégrité.
7. Acedia : une action groupée qui échoue à mi-chemin laisse au journal, annulables, les mails déjà touchés ; un mail
   en erreur n'arrête plus le tri des suivants ; une règle vers une boîte retirée est sautée ; un calendrier en
   erreur n'arrête plus les autres ni les tâches. Un test chacun.
8. Avaritia : un lot de 500 observations se traite par paquets ; un lot en attente repart dans l'heure ; un lot en
   échec est repris une fois, puis dit au core ; un envoi rejoué ne crée rien de plus ; un brouillon en attente sur
   une fiche fusionnée s'applique à la fiche gardée ; un modèle sans prix n'est jamais appelé sans être compté. Un
   test chacun.
9. Le core : des observations retenues par le plafond du jour d'Avaritia partent la nuit suivante (si « À trancher »,
   point 8, le garde). Un test.
10. Les barrières des trois dépôts vertes ; `mise-en-service-desktop.md` dit le nouveau lanceur, le second dossier et
    les purges ; les données de mesure restent dans `banc-continu/`, hors des dépôts.

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-anima`, `fix/tenir-en-continu` | à ouvrir (voir « Les issues ») | `critique` |
| `lun-acedia`, `fix/tenir-en-continu` | à ouvrir | `standard` (`critique` si une purge y est tranchée) |
| `lun-avaritia`, `fix/tenir-en-continu` | à ouvrir | `critique` |
| `lun-docs`, `docs/tenir-en-continu` | l'issue chapeau, à ouvrir | `trivial` |

**Le niveau** (« À trancher », point 1). `critique` est proposé pour tout le chantier. Je le garde pour le core et
Avaritia : on y supprime des données, sans retour, et on change ce que fait un processus qui rencontre une erreur ;
le standard [`workflow.md`](../../standards/workflow.md) range la mémoire et le bug difficile en `critique`. Je le
conteste pour Acedia : sans purge (point 5), chaque tâche y suit un modèle déjà là (`startLoop`, le journal des
gestes), et `standard` demande un test par comportement changé, ce que chaque tâche a déjà.

**Les issues.** Une issue chapeau dans **lun-docs**, « Tenir en continu », qui porte ce plan et la liste des trois
autres ; une issue dans chacun de **lun-anima**, **lun-acedia** et **lun-avaritia**, qui renvoie au chapeau. Chaque
PR de code ferme l'issue de son dépôt ; la PR de lun-docs (le plan coché, la page de mise en service) ferme le
chapeau, une fois les trois autres fusionnées.

## Ce que le code fait aujourd'hui

### Lun'Anima (dépôt privé : décrit par ses fonctions)

- **Aucun filet au niveau du processus.** Une exception levée hors d'un `catch`, dans une minuterie ou une promesse
  laissée sans suite, arrête le core : c'est le comportement de Node par défaut, et rien ne le change. La plupart des
  boucles ont leur filet : les routines, les notifications, la pause, l'échéance de la clé, la lecture des postes, le
  relais des gestes, la copie. **Deux n'en ont pas** : le rafraîchissement de la liste des postes, toutes les 15 s,
  et la relance d'un geste tenu dont la minuterie a sonné trop tôt. Une erreur y est peu probable (une lecture de la
  base), mais rien ne la rattrape.
- **Le lanceur du desktop** (dans le dépôt du core, pour les trois serveurs) relance un serveur tombé en erreur 60 s
  plus tard, trois fois ; une course de plus de 10 min remet le compte à zéro ; après la troisième chute, il le laisse
  arrêté (`mise-en-service-desktop.md`, § 9 et son tableau). **Une erreur qui revient chaque minute arrête donc le
  serveur pour de bon en sept minutes** (quatre lancements, trois attentes), jusqu'à ce que CrOliX le relance au
  Planificateur ou que Windows redémarre.
  Il est hors de chez lui les trois quarts du temps.
- **Le flux en direct des apps** garde, pour chaque client, une file sans borne. Un client qui ne lit plus, un
  téléphone en veille dont la connexion n'est pas encore tombée, la fait grossir à chaque événement, les mots d'une
  réponse dite compris. **La lecture du flux d'un poste** accumule sans borne une ligne sans fin de ligne et un
  message sans ligne vide.
- **Les événements des postes ne partent jamais.** Le core garde chaque événement reçu, ceux d'importance `log`
  compris (le bruit de fond, qui n'entre pas au Journal) ; Acedia et Avaritia n'en gardent que sept jours chez eux.
  L'accueil et la file des urgences cherchent les urgences de la journée **en parcourant tous les événements** :
  aucun index sur leur date ni leur importance. Chaque mail trié par Acedia en est un (`info`).
- **Ne partent jamais non plus** : les lignes de coût (chaque appel, avec ses jetons et le temps de son premier mot),
  les délégations, les gestes tenus, les passages des routines, les évaluations des scènes, les marques « vu ».
- **Ce que le core purge déjà** : la conversation une fois couverte par la nuit, la matière du jour une fois traitée,
  les notifications terminées, les codes d'appairage expirés ou servis. Le tri de chaque nuit, lui, reste.
- **Le Journal est permanent, par choix** : aucune fonction ne change ni ne retire une entrée. Il garde son titre,
  sa date, son coût et ses étapes. Pour le détail d'une délégation, il relit encore la demande dans les délégations :
  les purger retirerait ce détail du Journal. Une urgence encore « à trancher » y renvoie à son événement.
- **La copie de la base** : au démarrage puis chaque heure si celle du jour manque, sept gardées, dans un dossier à
  côté de la base, **sur le même disque**. Une copie ratée va à la santé et au Journal, une fois par jour. La copie
  tient le serveur pendant qu'elle s'écrit (synchrone). Ses tests l'ouvrent et passent le contrôle d'intégrité.
- **La nuit envoie ses observations** à Avaritia par paquets de 500. **Quand le plafond du jour d'Avaritia est
  atteint**, ou sa nuit coupée, rien ne part et l'étape compte faite (décidé au plan « plafonds et pause ») : ces
  observations n'atteignent jamais la bibliothèque. Un envoi raté (Avaritia injoignable, réponse perdue) n'est pas
  marqué et repart en entier à la nuit suivante, même si Avaritia l'avait reçu.
- **Le plafond du jour du core compte les postes** : il lit leurs coûts toutes les 2 min et les met en pause une
  fois atteint. Le tri d'Acedia par l'IA s'y arrête aussi.
- **Sur Windows, arrêter une tâche coupe le serveur net** : Node n'y envoie pas de signal, et l'arrêt propre du core
  (finir les réponses, fermer la base) n'y joue pas. Une nuit coupée est reprise au démarrage suivant (« Limites »).

### Lun'Acedia

- **Minuteries sans filet** : l'échéance des clés (`server/src/main.ts:77`, chaque heure), la purge des événements
  (`:102`), le fil de l'agent (`:105-111`), les rappels (`server/src/agenda/reminders.ts:97-107`, chaque minute, avec
  une écriture). Aucun `uncaughtException`. La synchro Gmail et l'agenda passent par `startLoop`
  (`server/src/util.ts:12-33`), qui attrape ; la copie aussi (`server/src/backup.ts:64-89`). Une écriture des rappels
  qui lève (base tenue plus de 5 s par une commande, disque plein) arrête Acedia ; si elle revient, le lanceur
  l'abandonne en sept minutes.
- **L'action groupée** fait un mail après l'autre (`server/src/gmail/actions.ts:122-127`) et ne rend ses changements
  qu'à la fin ; la route ne les journalise qu'après (`server/src/gmail/routes.ts:88-95`). Si le 12e de 20 échoue,
  les 11 premiers sont faits dans Gmail, absents du journal : ni annulables, ni appris.
- **Le tri** (`server/src/triage/pipeline.ts:289-312`) : le premier mail qui lève arrête la passe (`:306`), ceux de
  derrière attendent la minute suivante. Au troisième échec d'un mail, il sort de la file sans trace
  (`server/src/triage/queue.ts:30-34`). Une règle qui mène à une boîte retirée lève à chaque mail qu'elle prend :
  `setRole(null)` ne touche pas aux règles (`server/src/triage/labels.ts:33-44`), la boîte n'est vérifiée qu'à la
  création et à la modification d'une règle (`server/src/triage/rules.ts:82-87`, `:114`), et `fileMail` refuse une
  cible qui n'est plus une boîte (`server/src/gmail/actions.ts:76-78`).
- **L'agenda** : les calendriers puis les tâches, en série (`server/src/agenda/unified.ts:33-35`) ; un calendrier en
  erreur autre qu'un 410 lève (`server/src/agenda/calendar.ts:233`) et arrête les suivants et toutes les tâches,
  rappels de tâches compris.
- **La copie** : comme celle du core, à côté de la base (`server/src/backup.ts:18-22`, `:29-57`).
- **Ce qui part déjà** : les événements après sept jours (`server/src/contract/events.ts:9`, `:73-75`), le fil de
  l'agent (`server/src/pina/store.ts:152-158`), les rappels envoyés après 30 jours (`reminders.ts:103`), les mails
  retirés de Gmail (`server/src/gmail/store.ts:102`). **Ce qui reste** : le journal des gestes (lun-acedia#33), les
  propositions, les exemples appris, les coûts, les événements d'agenda passés, les tâches faites. Le cache des mails
  ne garde ni corps ni pièce (`server/src/db.ts:44-57`) : quelques centaines d'octets par mail.

### Lun'Avaritia

- **Minuteries sans filet** : l'échéance des clés et la purge des événements (`server/src/main.ts:64-65`). Les lots
  ne passent qu'au démarrage (`:51`) et à chaque envoi du core (`server/src/contract/routes.ts:136`).
- **Un lot en échec n'est jamais repris** : `runPending` remet en file les lots `running` et `held`, jamais `failed`
  (`server/src/brain/ingest.ts:63-66`). Un lot `held` (fournisseur absent, plafond) n'attend que l'envoi suivant ou
  un redémarrage, raccourci assumé (`:53-56`) : une panne de 3 h attend 24 h. Le tableau de bord dit « Lot en
  échec » (`server/src/brain/dashboard.ts:45`) ; **le core n'en sait rien** : Avaritia ne lui envoie que les
  événements de clé et de copie.
- **Un lot passe en deux appels, quelle que soit sa taille** : le tri à 2 000 jetons de sortie, la rédaction à
  8 000 (`server/src/brain/process.ts:292`, `:342`), le plafond vérifié entre les deux seulement (`:298`). Les
  candidats cherchent jusqu'à 12 mots par observation, en synchrone (`:93-100`), et sont coupés à 30. La nuit du core
  sort au plus ce que ses 8 000 jetons permettent, soit de l'ordre d'une centaine d'observations, pas 500 ; mais une
  nuit chargée donne beaucoup de groupes, et la rédaction de chacun tient mal dans 8 000 jetons : deux réponses
  tronquées, le lot passe `failed`, payé deux fois.
- **Un groupe peut disparaître** : rien ne vérifie que la rédaction rende une fiche par groupe
  (`process.ts:170-198`). Un groupe oublié laisse le lot `done`, ses observations sans brouillon.
- **Un modèle sans prix n'est pas compté** : `priceOf` rend `undefined`, le coût vaut 0 (`process.ts:229-230`,
  `server/src/brain/agent.ts:237-243`). Mistral Small et Medium sont listés sans prix
  (`server/src/llm/models.ts:81-82`). Le plafond du mois ne les voit pas, et le core non plus : il compte ce
  qu'Avaritia lui rend.
- **L'envoi n'est pas idempotent** : chaque `brain.ingest` crée un lot (`ingest.ts:31-48`). Le même envoi rejoué
  par le core fait deux lots, deux fois les mêmes brouillons.
- **Un brouillon en attente sur une fiche fusionnée** devient inapplicable : « Fiche absente. »
  (`server/src/brain/drafts.ts:192`) ; il ne reste que « Refuser », et ses faits sourcés partent avec. Même sort
  pour un fait à remplacer déjà barré (`:205`). La fusion (`:262-278`) ne réécrit pas les brouillons en attente, et
  la synthèse de la fiche fusionnée sort de toute vue.
- **Ce qui part déjà** : les événements après sept jours (`server/src/contract/events.ts:6`, `:62`). **Ce qui
  reste** : les observations brutes, les lots, les passages, les coûts, les versions de fiche, les brouillons
  décidés. Un fait garde sa source (origine, référence, date : `process.ts:350-356`), pas l'observation : retirer
  une observation ne retire la source d'aucun fait.
- **La copie** : le même module qu'Acedia, mot pour mot (`server/src/backup.ts`).

### Ce que l'audit disait et qui ne tient pas

- **« L'image Docker d'Acedia est injoignable depuis le NAS, faute de `ENV HOST` »** : le déploiement prévu publie
  chaque serveur par Tailscale depuis la boucle locale, sur le desktop (`mise-en-service-desktop.md`, § 6) comme dans
  la configuration du NAS. `127.0.0.1` y est voulu. Seul un `docker run -p` nu ne répondrait pas, et rien ne le
  prévoit. Écarté.
- **« Le tri d'Acedia par l'IA n'a pas de plafond »** : il n'en a pas à lui, mais le plafond du jour du core compte
  ses coûts, lus toutes les 2 min, et le met en pause une fois atteint. Le dépassement tient en deux minutes de tri.
  Sans core, il n'a pas de borne, mais le rodage tourne avec le core. Écarté.
- **« La copie `VACUUM INTO` est synchrone »** : vrai, et assumé par un commentaire `shortcut:` chez Acedia et
  Avaritia (0,1 s pour 30 Mo ; passer à la copie asynchrone à quelques centaines de Mo). Les bases font quelques Mo.
  La tâche 0 mesure ce temps à un an ; écarté si la mesure reste sous la seconde.
- **« Un lot de 500 observations »** : la nuit n'en sort pas 500 (voir plus haut). Le risque vrai est la rédaction
  d'une grosse nuit en un seul appel ; il est gardé (tâche 13).
- **« Un lot déjà écrit est rejoué après un arrêt brutal »** (Avaritia) : aucune attente entre l'écriture des
  brouillons et le statut du lot, seulement quelques microsecondes. Écarté.
- **« Le healthcheck des images ne lit que `/` »** : vrai, mais Docker ne relance pas un conteneur malade, et la
  cible est un serveur dédié. Hors périmètre : à revoir avec la bascule.
- **Les purges de l'audit** pour le core : les délégations ne peuvent pas partir (le Journal les relit) ; les gestes
  tenus, les passages des routines et les évaluations des scènes font quelques lignes par jour. Écartées, la tâche 0
  le vérifie.

## Palier 1 : la tâche 0

0. - [ ] **Ce que les bases deviennent en un an, mesuré** (`testeur`, des scripts jetables dans `banc-continu/`, à
   la racine de l'écosystème, hors de tout dépôt). Seule au palier 1 ; elle ne bloque que les tâches 6 et 18.
   1. Pour chaque service, une base ouverte par le service lui-même (ses migrations, depuis sa copie sur `main`), à
      un chemin jetable de `banc-continu/`, jamais `data/`. Nourrie sur 365 jours simulés, sans réseau ni modèle,
      aux débits de la liste ci-dessous : ce sont des hypothèses, écrites comme telles au relevé.
   2. À 7, 30, 90 et 365 jours : la taille du fichier ; la part de chaque sorte de données (par `dbstat` s'il est
      compilé dans `node:sqlite`, sinon le nombre de lignes fois leur taille moyenne) ; le temps de l'accueil et de
      la file des urgences du core, d'une fiche et du graphe d'Avaritia (médiane de 20 lectures) ; le temps de la
      copie du jour.
   3. Les mêmes, avec les purges recommandées (« À trancher », points 4 à 6) jouées par le script chaque jour
      simulé : le jour où la taille cesse de monter, et sa valeur. Le fichier ne rétrécit pas sans `VACUUM` : on
      vérifie que SQLite réutilise les pages libérées.
   4. Elle rend « Ce que la tâche 0 a mesuré » dans ce plan, et pour chaque durée recommandée si elle tient. Le core
      s'y décrit par ses fonctions (dépôt public : aucun nom de table) ; les fichiers bruts restent dans
      `banc-continu/`.
   - Exclu : toucher un dépôt, ouvrir une vraie base, tout appel payant.

Les débits, par jour simulé (des hypothèses) :

- **Acedia** : 100 mails reçus, triés et journalisés, dont 20 rangés à la main ; 100 appels de tri comptés ;
  60 synchros avec changement ; 10 changements d'agenda, 5 rappels, 4 événements de calendrier, 3 tâches.
- **Le core** : les événements reçus d'Acedia et d'Avaritia (environ 180) ; une entrée au Journal par événement qui
  n'est pas du bruit de fond, plus 30 ; 60 lignes de coût ; 5 délégations ; 10 gestes tenus ; la nuit et le matin.
- **Avaritia** : une nuit de 30 observations de 500 caractères ; 10 brouillons, 20 faits, 5 versions de fiche ;
  4 lignes de coût.

## Ce que la tâche 0 a mesuré

À remplir par la tâche 0.

## Palier 2 : les tâches

**Pour chaque tâche.** Les tests d'abord, vus échouer avant le code. Le `testeur` les écrit pour les tâches qui
suppriment ou qui arrêtent un processus (1, 6, 7, 12, 18) ; ailleurs, le développeur les écrit lui-même. Le
`reviewer` relit chaque diff contre sa tâche avant la PR de son dépôt. Les serveurs des satellites n'ont pas d'agent
à eux : `dev-core` les code, le `CLAUDE.md` du satellite en main (« À trancher », point 12). `dev-luxuria` n'a rien
ici. Les fichiers d'Anima sont donnés au développeur dans son brief, pas dans ce plan public.

**En parallèle.** Les trois dépôts dès la validation, un développeur et un worktree chacun, créés depuis la branche
du chantier. Dans un dépôt, un fichier n'a qu'une tâche à la fois :

- **Anima** : 1, 2, 3 et 5 d'emblée ; 4 après 1 (le même démarrage du serveur) ; 6 après 0, les durées tranchées,
  et 4.
- **Acedia** : 7, 8, 9 et 10 d'emblée ; 11 après 7 (`server/src/main.ts`).
- **Avaritia** : 12, 13 et 15 d'emblée ; 14 et 16 après 13 (`ingest.ts`, `process.ts`) ; 17 après 12
  (`server/src/main.ts`) ; 18 après 0, les durées tranchées, 13, 14 et 17.
- **lun-docs** : 19 au fil des fusions ; 20 en dernier.

### Lun'Anima (`dev-core`)

1. - [ ] **Les filets du core.** *Parallélisable d'emblée.*
   - Les deux boucles sans filet en reçoivent un : le rafraîchissement de la liste des postes, et la relance d'un
     geste tenu sonné trop tôt. Une erreur y est écrite au journal du jour, une fois par message tant qu'elle dure,
     et la boucle repasse au tour suivant.
   - Un filet au niveau du processus, pour une exception ou une promesse rejetée restée hors de tout filet, selon la
     règle tranchée (« À trancher », point 2 ; recommandé : écrire l'erreur et son origine au journal du jour,
     porter un événement du core « arrêt sur erreur » au Journal et au téléphone, comme une copie ratée, puis sortir
     en code 1 pour que le lanceur relance). Si l'écriture de l'événement échoue (disque plein, base illisible), il
     sort quand même.
   - Tests : chaque boucle, sa lecture rendue fausse, écrit l'erreur et repasse ; aucune promesse rejetée ne
     s'échappe (le motif des tests des routines, qui écoutent les rejets non traités) ; un processus enfant qui pose
     le filet puis lève dans une minuterie sort en code 1, et sa base porte l'événement.
   - Exclu : changer les filets qui existent ; relancer le core de l'intérieur.
2. - [ ] **Le lanceur ne lâche plus un serveur.** *Parallélisable d'emblée.* Le lanceur du desktop, dans le dépôt du
   core, qui lance aussi Acedia et Avaritia.
   - Selon « À trancher », point 3 (recommandé) : après ses trois relances à 60 s, une relance toutes les 15 min,
     sans fin ; chaque relance dite au journal du jour, avec le délai de la suivante. Une course de plus de 10 min
     remet toujours le compte à zéro ; un arrêt demandé arrête toujours tout.
   - Tests, dans ceux du lanceur, avec des délais courts : un serveur qui tombe toujours est relancé au-delà de la
     troisième chute, au délai lent ; un arrêt demandé pendant l'attente lente arrête le lanceur.
   - Exclu : le Planificateur de tâches, les scripts d'installation, l'arrêt propre sous Windows.
3. - [ ] **Des files bornées.** *Parallélisable d'emblée.*
   - Le flux en direct : au-delà d'une borne d'événements en attente pour un client (de l'ordre de 1 000), son flux
     est fermé ; le client se reconnecte de lui-même, comme après une coupure. Le développeur vérifie que l'app relit
     son état à la reconnexion ; sinon, il le dit avant de coder.
   - La lecture du flux d'un poste : au-delà d'une borne de taille pour une ligne ou un message (de l'ordre de
     1 Mo), le flux est coupé et l'écoute du poste reprend comme après une coupure, avec une ligne au journal.
   - Tests : un client qui ne lit jamais, 10 000 événements publiés, sa file ne dépasse pas la borne et son flux se
     ferme ; un poste qui envoie 2 Mo sans fin de ligne voit son flux coupé, puis repris.
   - Exclu : changer le format du flux ou des événements.
4. - [ ] **Le second dossier de copies, côté core.** Après 1.
   - Un réglage d'installation, une variable du `.env` comme le chemin de la base : un second dossier. Vide, rien ne
     change. Donné, la copie du jour y est recopiée après son écriture, sous le même nom, avec la même rotation
     (sept). Une copie à moitié écrite n'y paraît jamais sous son nom final.
   - Son échec (dossier absent, partage injoignable, disque plein) est dit comme une copie ratée : à la santé, au
     Journal une fois par jour, sous son propre titre (« La copie hors machine a échoué ») et avec sa propre marque
     du jour, pour qu'un échec local le même jour ne la cache pas. La copie locale n'en dépend pas.
   - Tests : le second dossier reçoit la copie, en garde sept ; un second dossier en lecture seule n'empêche pas la
     copie locale et le dit une fois par jour ; une copie du second dossier s'ouvre et passe le contrôle d'intégrité.
   - Exclu : chiffrer les copies ; copier autre chose que la base.
5. - [ ] **La nuit qui n'a pas pu envoyer.** *Parallélisable d'emblée.* Selon « À trancher », point 8.
   - Recommandé : quand le plafond du jour d'Avaritia est atteint, l'envoi ne compte plus fait ; il repart à la nuit
     suivante, avec une ligne au Journal (« observations retenues : plafond du jour »). La nuit coupée par CrOliX
     reste comme aujourd'hui : rien ne part, l'étape compte faite.
   - Tests : un plafond atteint laisse l'étape à faire, et la nuit suivante envoie les deux jours ; une nuit coupée
     compte toujours faite, sans envoi.
   - Exclu : le plafond lui-même ; la forme de l'envoi.
6. - [ ] **Les événements des postes et les coûts ne grossissent plus sans fin.** Après 0, les durées tranchées
   (« À trancher », point 4), et 4.
   - Un index sur la date et l'importance des événements reçus, pour l'accueil et la file des urgences (une
     migration ajoutée, jamais une migration réécrite).
   - Une purge, à côté de la copie (chaque heure, même en pause : elle n'agit sur aucun poste), avec un filet. Elle
     retire, selon les durées tranchées : les événements de bruit de fond ; les autres événements, sauf ceux dont
     l'entrée au Journal est encore « à trancher » ; leurs marques « vu » ; les lignes de coût. Elle garde toujours
     le dernier événement de chaque poste (sa date dit quand il a parlé pour la dernière fois).
   - Elle ne touche jamais au Journal ni à ses étapes, ni à la mémoire de la relation (souvenirs, portrait,
     tempérament, récits, lettres), ni aux délégations.
   - Tests : une base nourrie sur 400 jours simulés cesse de grossir, en lignes et en taille ; le Journal, ses
     étapes et la mémoire de la relation ont le même compte avant et après ; une urgence « à trancher » de 200 jours
     reste ; le dernier événement d'un poste muet depuis un an reste ; le plafond du mois et la vue des sept jours
     rendent les mêmes totaux avant et après.
   - Exclu : `VACUUM` ; purger quoi que ce soit d'autre ; un écran.

### Lun'Acedia (`dev-core`)

7. - [ ] **Les filets d'Acedia.** *Parallélisable d'emblée.* `server/src/main.ts`, `server/src/agenda/reminders.ts`,
   leurs tests.
   - L'échéance des clés, la purge des événements, le fil de l'agent et les rappels passent par `startLoop`
     (`server/src/util.ts:12`) ou un `try/catch` au même effet : l'erreur va au journal du serveur, la boucle
     continue.
   - Le filet du processus, la même règle que le core (tâche 1) : l'erreur au journal du jour, un événement
     `server.crashed` (`normal`, la raison dans `data`, sans chemin ni secret) que le core reçoit à la relance, puis
     la sortie en code 1.
   - Tests : `startReminderLoop` dont l'écriture lève continue et le dit (aucun test ne couvre cette boucle
     aujourd'hui) ; chaque minuterie horaire de même ; un processus enfant qui lève dans une minuterie sort en code 1
     et sa base porte `server.crashed`.
   - Exclu : changer `startLoop`, la synchro Gmail ou l'agenda.
8. - [ ] **L'action groupée journalise au fil.** *Parallélisable d'emblée.* `server/src/gmail/actions.ts`,
   `server/src/gmail/routes.ts`, leurs tests.
   - Chaque mail touché est journalisé (et appris, comme aujourd'hui) dès que Google l'a fait, pas à la fin ; au
     premier échec, la route rend l'erreur comme aujourd'hui, mais les mails déjà faits sont au journal, annulables.
   - Tests : 20 mails dont le 12e rend 404 : les 11 premiers au journal, chacun annulable, les exemples appris ; la
     réponse dit l'erreur. Une action qui passe en entier ne change pas.
   - Exclu : changer la forme de la réponse ou l'écran ; reprendre les mails après l'échec.
9. - [ ] **Le tri continue.** *Parallélisable d'emblée.* `server/src/triage/pipeline.ts`, `server/src/triage/queue.ts`,
   `server/src/triage/rules.ts`, leurs tests.
   - Un mail qui lève compte son essai raté et laisse passer les suivants, au lieu d'arrêter la passe.
   - Selon « À trancher », point 11 (recommandé) : au tri, une règle dont la cible n'est plus une boîte est sautée,
     la règle suivante ou l'IA décide, et une ligne au journal du serveur le dit, une fois par règle et par jour.
   - Un mail qui sort de la file au troisième échec laisse une ligne au journal du serveur, avec son id et la raison.
   - Tests (`failedAttempt` n'en a aucun aujourd'hui) : trois mails, le premier lève, les deux autres sont triés ;
     une règle vers une boîte retirée ne lève plus, le mail est trié par la suite ; le troisième échec laisse la
     ligne.
   - Exclu : désactiver les règles à l'écran ; un écran « non trié ».
10. - [ ] **L'agenda, calendrier par calendrier.** *Parallélisable d'emblée.* `server/src/agenda/calendar.ts`,
    `server/src/agenda/tasks.ts`, `server/src/agenda/unified.ts`, leurs tests.
    - Une erreur sur un calendrier ou une liste de tâches est écrite au journal du serveur, une fois par conteneur tant
      qu'elle dure, et les autres continuent ; les tâches passent même si un calendrier échoue. Le 410 garde son
      traitement.
    - Tests : deux calendriers, le premier rend 403, le second et les tâches sont synchronisés ; une liste de tâches
      en erreur n'empêche pas les autres.
    - Exclu : la fenêtre de la première synchro (hors périmètre) ; les reprises de Google.
11. - [ ] **Le second dossier de copies, côté Acedia.** Après 7. `server/src/backup.ts`, `server/src/main.ts`,
    `server/src/backup.test.ts`, `.env.example`.
    - Le même comportement que la tâche 4 ; l'échec est dit par un événement `backup.failed` dont la raison nomme
      le second dossier, une fois par jour, que le core porte au Journal et au téléphone.
    - Tests : ceux de la tâche 4, dans `backup.test.ts`.
    - Exclu : ce que la tâche 4 exclut.

### Lun'Avaritia (`dev-core`)

12. - [ ] **Les filets d'Avaritia.** *Parallélisable d'emblée.* `server/src/main.ts`, ses tests.
    - L'échéance des clés et la purge des événements avec un filet ; le filet du processus et `server.crashed`,
      comme la tâche 7.
    - Une passe des lots chaque heure (`runPending`, qui sait déjà sauter en pause), pour qu'un lot `held` reparte
      dans l'heure où son fournisseur revient ou son plafond se lève.
    - Tests : ceux de la tâche 7 ; un lot `held` repart à la passe horaire une fois le fournisseur revenu.
    - Exclu : le traitement d'un lot (tâche 13).
13. - [ ] **Les lots, par paquets, repris, dits au core.** *Parallélisable d'emblée.* `server/src/brain/ingest.ts`,
    `server/src/brain/process.ts`, `server/src/db.ts`, leurs tests.
    - **Par paquets** : un envoi est rangé en lots de 25 observations au plus, chacun traité seul ; l'accusé de
      `brain.ingest` garde sa forme (le premier lot, toutes les observations acceptées). Le plafond est vérifié avant
      chaque lot ; un lot raté n'empêche pas les autres.
    - **Un groupe oublié** fait rejeter la réponse de la rédaction, comme une réponse invalide (la seconde tentative
      comprise) : chaque groupe a sa fiche, ou le lot échoue.
    - **Repris une fois** : selon « À trancher », point 9 (recommandé), un lot `failed` repart une seule fois, le
      lendemain, à la passe horaire de la tâche 12 ; il reste en échec ensuite. Une migration ajoute le compte des
      reprises. Le test appelle la passe lui-même : il n'attend pas la tâche 12.
    - **Dit au core** : `lot.failed` (`normal`) quand un lot échoue pour de bon, et `lot.held` (`normal`) quand le
      plafond du mois retient un lot ; chacun au plus une fois par jour, comme `backup.failed`.
    - Tests : 500 observations deviennent 20 lots ; un paquet dont la rédaction échoue deux fois laisse les autres
      `done` ; une rédaction qui oublie un groupe est rejetée ; un lot `failed` repart une fois, pas deux ; les deux
      événements, une fois par jour.
    - Exclu : changer le schéma de `brain.ingest` ou le contrat ; un bouton « Rejouer ».
14. - [ ] **Un envoi rejoué ne crée rien.** Après 13. `server/src/brain/ingest.ts`, `server/src/db.ts`, leurs tests.
    - Une observation déjà reçue (le même texte, la même origine, la même référence, la même date) est ignorée à
      l'envoi ; un envoi dont tout est déjà là ne crée aucun lot. Une migration ajoute la clé et un index, sans unicité
      imposée : une base qui a déjà des doublons migre sans rien perdre.
    - Tests : le même envoi deux fois donne un seul jeu de lots et de brouillons ; un envoi à moitié nouveau ne garde
      que la moitié nouvelle ; une base avec doublons migre.
    - Exclu : une clé dans le contrat ; le côté du core.
15. - [ ] **Les brouillons survivent à une fusion.** *Parallélisable d'emblée.* `server/src/brain/drafts.ts`, ses
    tests.
    - Accepter un brouillon sur une fiche fusionnée l'applique à la fiche gardée (en suivant la fusion, en chaîne si
      elle-même l'est) ; un fait à remplacer déjà barré par une contradiction acceptée devient un fait ajouté, avec
      un avertissement, au lieu de bloquer le brouillon.
    - La fusion garde la synthèse de la fiche fusionnée en version de la fiche gardée.
    - Tests (aucun ne couvre « Fiche absente. » aujourd'hui) : deux brouillons sur B, B fusionnée dans A, le second
      accepté enrichit A ; un remplacement déjà barré passe avec son avertissement ; la synthèse de B est une version
      de A.
    - Exclu : le détecteur de doublons ; la fiche proposée deux fois.
16. - [ ] **Un modèle sans prix n'est pas appelé sans être compté.** Après 13. `server/src/brain/process.ts`,
    `server/src/brain/agent.ts`, `server/src/llm/models.ts`, leurs tests.
    - Selon « À trancher », point 10 (recommandé) : un modèle d'un fournisseur payant sans prix connu (ni dans la
      liste, ni dans `LLM_PRICES`) n'est pas appelé. Le lot attend (`held`, raison « modèle sans prix »), l'agent le
      dit dans sa réponse, et `lot.held` le dit au core. Le point d'accès personnalisé, un modèle local, compte 0
      comme aujourd'hui.
    - Tests : Mistral Small sans prix retient le lot et ne l'appelle pas ; avec un prix dans `LLM_PRICES`, il est
      appelé et compté ; le point d'accès personnalisé est appelé à 0.
    - Exclu : inventer les prix manquants ; changer l'écran des modèles.
17. - [ ] **Le second dossier de copies, côté Avaritia.** Après 12. Comme la tâche 11, dans les mêmes fichiers
    d'Avaritia.
18. - [ ] **Les observations traitées ne restent pas.** Après 0, les durées tranchées (« À trancher », point 6), 13,
    14 et 17. `server/src/brain/ingest.ts` ou un module à côté, `server/src/main.ts`, leurs tests.
    - Une purge horaire, même en pause, avec un filet : les observations des lots `done` plus vieilles que la durée
      tranchée. Jamais celles d'un lot `queued`, `held`, `running` ou `failed`.
    - Tests : 400 jours simulés d'un lot par nuit cessent de grossir ; un lot `failed` de 200 jours garde ses
      observations ; les faits gardent leur source ; un envoi rejoué d'une observation purgée est accepté de nouveau
      (connu, voir « Limites »).
    - Exclu : retirer une fiche, un fait, une version, un brouillon ; l'oubli d'un tiers.

### lun-docs et la fin

19. - [ ] **La page de mise en service à jour** (la session, `trivial`). `docs/mise-en-service-desktop.md` : le
    lanceur qui ne lâche plus (§ 9 et le tableau), le second dossier (§ 3 et § 8), les purges et leurs durées. Au
    fil des fusions. Rien dans la feuille de route ni les ADR (le chantier « textes d'accord »).
20. - [ ] **Le relevé final** (`testeur`). Après tout. La mesure de la tâche 0 rejouée avec le vrai code de chaque
    service (ses purges, ses index) : la taille à un an, le jour du plateau, les lectures de l'accueil et d'une
    fiche. Les barrières des trois dépôts. Un tableau : chaque critère de fin, sa preuve (test ou mesure). Le
    `livreur` coche ce plan et ouvre les PR en brouillon.

## Ce que le desktop vérifiera

Rien de ce qui suit ne se prouve sur le laptop ; la semaine de rodage le regarde.

- **Une tâche S4U peut-elle écrire sur le partage du NAS ?** Les tâches tournent sans mot de passe gardé (S4U) ; à
  ma connaissance, une telle tâche n'a accès qu'aux ressources de la machine. À essayer avant de régler le second
  dossier sur le NAS (« À trancher », point 7).
- Les vrais débits : le nombre de lignes par jour dans les bases du desktop, sans en lire le contenu, contre les
  hypothèses de la tâche 0.
- Chaque jour : la mémoire des trois serveurs, les lignes « sorti avec le code » du lanceur, la taille des bases.
- La restauration d'une copie prise dans le second dossier (feuille de route, § 4).

## Hors périmètre

- Le premier contact sans terminal : lun-acedia#62 (jeton illisible), #55, lun-anima#72 ; le verrou d'appairage
  global et les jetons sans expiration, des trois.
- Le journal des gestes d'Acedia et son archivage (lun-acedia#33), et toute purge d'Acedia si CrOliX suit le point 5.
- La fenêtre de l'agenda figée à la première synchro (Acedia) : à vérifier sur le compte de test, effet en mois.
- Le tri qui retarde la synchro Gmail, les reprises de Google, `updatedMin` pris sur l'horloge, les trois « jours »
  d'Acedia : mineurs, sans perte.
- Avaritia : les index de la ligne d'arrivée 3 (2,7 ms à 50 000 faits, mesuré par l'audit), l'écran Dépôts, les
  brouillons qui s'accumulent pendant une absence (l'affichage est borné, rien ne se perd), la fiche proposée deux
  fois, l'import Obsidian, `lower()`, l'oubli d'un tiers, la recherche par le sens, la citation mot pour mot.
- Un bouton « Rejouer » pour un lot en échec ; un écran « non trié » chez Acedia.
- Le healthcheck des images ; la copie asynchrone ; le chiffrement des copies ; l'arrêt propre sous Windows.
- Inscrire `server.crashed`, `lot.failed` et `lot.held` au contrat satellite : avec les textes d'accord.
- Lun'Luxuria : son chantier « Écoute et parole ».

## Limites

- **Les débits de la tâche 0 sont des hypothèses** : 100 mails par jour, une nuit de 30 observations. Le desktop
  donnera les vrais.
- **Sur Windows, l'arrêt d'une tâche coupe le serveur net** (Node n'y a pas de signal) : l'arrêt propre du core ne
  joue que sous Docker ou au Ctrl+C. Lu dans la doc de Node, pas essayé ici. Une nuit coupée reprend au démarrage.
- **La sortie sur erreur reste un redémarrage** : le filet le rend visible et le lanceur le rend court, il ne
  l'évite pas. Ce qui l'évite, ce sont les filets des boucles.
- **Une observation purgée puis renvoyée est acceptée de nouveau** : la clé d'un envoi rejoué ne vit que le temps de
  la rétention. Le core ne renvoie que les nuits récentes.
- **Le second dossier n'est pas « hors machine » s'il vise un disque du même poste.** Le NAS l'est, si une tâche S4U
  peut y écrire (non vérifié).
- Les copies, locales et hors machine, ne sont pas chiffrées : la base et ses copies gardent sujets, extraits,
  fiches et observations en clair. La clé de chaque base n'est pas dans sa copie.
- Un lot de 25 observations est une borne choisie, pas mesurée : aucun vrai lot n'a été pesé
  (`docs/prouver-avaritia.md`, « à renseigner »).

## À trancher par CrOliX

1. **Le niveau.** Je recommande `critique` pour le core et Avaritia (des suppressions de données, la sortie d'un
   processus), `standard` pour Acedia tant qu'aucune purge n'y entre, `trivial` pour lun-docs.
2. **Ce que fait un serveur sur une erreur restée hors de tout filet** (les trois). (a) L'écrire au journal du jour,
   la porter au Journal (un événement), puis sortir en code 1 : le lanceur relance en 60 s. (b) La même chose, mais
   rester debout sur une promesse rejetée et ne sortir que sur une exception. (c) Rester debout toujours. **Je
   recommande (a)** : une erreur hors filet peut laisser une écriture à moitié faite, et rester debout la cacherait ;
   la relance coûte une minute, et les filets des boucles (tâches 1, 7, 12) rendent le cas rare. Le core redémarré
   reste l'exception : c'est ce que ces filets protègent.
3. **Le lanceur.** (a) Après ses trois relances à 60 s, une toutes les 15 min, sans fin. (b) Comme aujourd'hui, il
   abandonne. **Je recommande (a)** : un abandon arrête le service jusqu'au retour de CrOliX, des jours parfois. Le
   coût : une ligne au journal par quart d'heure tant que le serveur tombe.
4. **Les purges du core**, chacune avec ce qui reste (la tâche 0 confirme ou révise ces durées) :
   - les événements de bruit de fond (`log`) : **7 jours**, comme les satellites chez eux. Il reste le dernier de
     chaque poste. Rien de visible ne part : ils n'entrent pas au Journal ;
   - les autres événements, des postes et du core, et leurs marques « vu » : **90 jours**. Il reste leur entrée au
     Journal (titre, date, étapes), permanente ; une urgence encore « à trancher » est gardée, quel que soit son âge.
     Part : le détail que le poste avait joint (ses lignes, son lien), qu'aucun écran du Journal ne relit ;
   - les lignes de coût : **13 mois**. Le plafond du mois et la vue des sept jours n'en lisent pas plus ; le Journal
     garde le coût de chaque entrée. Part : le détail par appel (modèle, jetons, temps du premier mot) au-delà ;
   - **jamais** : le Journal et ses étapes (permanent par choix), la mémoire de la relation (non supervisée, sans
     validation ni correction, voulu), les délégations (le Journal les relit). Les gestes tenus, les passages des
     routines et les évaluations des scènes : quelques lignes par jour, sans purge, sauf si la tâche 0 dit le
     contraire.
5. **Acedia.** **Je recommande de n'y rien purger dans ce chantier** : son cache suit Gmail, ses tables grossissent
   de quelques centaines d'octets par mail, et son journal a son issue (lun-acedia#33, chantier « Confort »). Si la
   tâche 0 donne plus de quelques dizaines de Mo par an, une purge des coûts (13 mois) et des événements d'agenda
   passés (90 jours, Google en reste la source) revient ici, et Acedia passe en `critique`.
6. **Avaritia** : les observations des lots traités, **30 jours**. Il reste les fiches, les faits avec leur source,
   les brouillons, les lots et leurs passages. Part : le texte brut de l'observation, déjà masqué par le core. Aucune
   fiche, aucun fait, aucune version ne part : un fait démenti reste barré, jamais effacé.
7. **La copie hors machine.** (a) Un second dossier réglable dans chaque service (tâches 4, 11, 17) ; sur le serveur
   dédié, un dossier du NAS monté, le NAS servant au stockage (décision du 10/11) ; sur le desktop, le partage du NAS
   si une tâche S4U peut y écrire (« Ce que le desktop vérifiera »), sinon rien pendant le rodage. (b) Le NAS tire
   lui-même les dossiers `backups/`, sans code ; un échec n'est alors dit que par le NAS. (c) Rien avant le serveur
   dédié. **Je recommande (a)** : l'échec est dit par le service, au Journal et au téléphone comme aujourd'hui, et se
   prouve sur le laptop ; il sert tel quel au serveur dédié.
8. **La nuit et le plafond d'Avaritia** (revient sur le plan « plafonds et pause »). (a) Un envoi retenu par le
   plafond du jour d'Avaritia ne compte plus fait et repart la nuit suivante, avec une ligne au Journal. (b) Comme
   aujourd'hui : ces observations n'atteignent jamais la bibliothèque. **Je recommande (a)** : sinon le plafond
   perd des données en silence. La nuit coupée par CrOliX ne change pas.
9. **Un lot d'Avaritia en échec.** (a) Repris une seule fois, le lendemain, puis `lot.failed` au core. (b) Un bouton
   « Rejouer » dans son tableau de bord. (c) Les deux. **Je recommande (a)** : CrOliX est souvent absent, un lot raté
   a déjà payé deux appels, et les paquets de 25 rendent une reprise petite. Le bouton peut venir après.
10. **Un modèle sans prix chez Avaritia.** (a) Ne pas l'appeler : le lot attend, et l'événement le dit. (b) Le
    compter à un prix de repli, le plus cher connu. (c) Un bandeau « plafond inopérant ». **Je recommande (a)** : pas
    de chiffre faux, un seul endroit à changer, et `LLM_PRICES` le rend utilisable. Le point d'accès personnalisé
    garde 0.
11. **Une règle d'Acedia vers une boîte retirée.** (a) Au tri, la sauter, avec une ligne au journal. (b) Retirer le
    rôle de boîte désactive ses règles. (c) Refuser de retirer le rôle tant qu'une règle y mène. **Je recommande
    (a)** : il couvre toutes les façons dont une boîte disparaît, Gmail compris, sans toucher l'écran.
12. **Qui code les serveurs des satellites** : aucun agent n'en a le métier. **Je recommande `dev-core`**, le plus
    proche (Node, SQLite, contrat), avec le `CLAUDE.md` du satellite dans son brief.
