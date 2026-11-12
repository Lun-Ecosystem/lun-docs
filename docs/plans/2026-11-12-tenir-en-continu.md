# Tenir en continu : le core, Acedia et Avaritia, des jours sans s'arrêter. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** lun-docs#166 (chapeau), lun-anima#107, lun-acedia#66, lun-avaritia#33.
>
> **Validé par CrOliX le 12/11** (« je valide ») : les points de « À trancher » 1 à 3 selon leur recommandation
> (l'erreur écrite, au plus un événement de chute par jour, la sortie en code 1 ; le lanceur relance toutes les 15 min
> sans fin ; la règle vers une boîte retirée sautée, avec une ligne au journal). Point 4, selon la recommandation du
> manager : **aucun signal des satellites au core dans ce chantier**, donc pas de tâche 10 ni de changement du
> contrat ; le core prévient déjà d'un poste injoignable 15 min et le lanceur garde la trace de chaque chute ; les
> signaux viennent avec le chantier suivant. La tâche 3 reste en option, non faite sauf demande.
> Écrit le 12/11 depuis l'audit du même jour, code relu sur `main` : lun-anima `b457668`, lun-acedia `1ae4457`,
> lun-avaritia `424c4ec`. Relu le même jour par le plan-challenger : son alternative est retenue, **un seul palier
> avant le rodage**. Les purges et ce qui demande les vrais débits passent au chantier suivant.
>
> **Le palier.** Huit tâches, plus la 3 en option. La 10 n'entre pas (point 4). Sans événement à porter, le filet du
> processus d'Acedia et d'Avaritia est le comportement de Node lui-même : sur une exception ou une promesse rejetée
> sans traitement, il écrit l'erreur et sa pile sur la sortie d'erreur et sort en code 1 (vérifié le 12/11 sur
> Node 24). Leur module de chute et leurs événements sont retirés des tâches 4 et 8.

**But :** que le core, Acedia et Avaritia tournent des jours sans s'arrêter et sans perdre de données en silence.
C'est le préalable à la semaine de rodage (feuille de route, B8), porte du MVP. Qu'ils ne grossissent pas sans fin
se tranche sur les débits du desktop, au chantier suivant.

**Source :** l'audit de l'écosystème du 12/11, section « 1. Tenir en continu », et ses rapports sur Acedia et
Avaritia. Chaque constat y a été lu par un agent, pas rejoué : chacun est relu ici dans le code ; ceux qui ne
tiennent pas sont écartés, avec la raison. La page [`mise-en-service-desktop.md`](../mise-en-service-desktop.md)
(§ 6 à 9) et le plan [« plafonds et pause »](2026-11-02-natsume-centre-tranche-5-plafonds-pause.md) pour ce qui est
déjà décidé.

**Critères de fin**, tous vérifiables sur le laptop, sans appel payant ni vraie base :

1. Aucune minuterie des trois serveurs ne peut les arrêter : chaque boucle a son filet, et un test par boucle la fait
   lever puis la voit repasser. Chaque PR joint la liste relevée des minuteries de son serveur, chacune avec son filet.
2. Une erreur restée hors de tout filet est écrite sur la sortie d'erreur, que le lanceur garde au journal du jour,
   puis le serveur sort en code 1 (« À trancher », point 1). Le core laisse en plus au plus un événement de chute par
   jour à son Journal : un test le prouve dans un processus enfant. Chez Acedia et Avaritia, c'est le comportement de
   Node ; le développeur vérifie qu'aucun écouteur ne l'annule, dans leur code ni dans leurs dépendances.
3. Le lanceur du desktop ne laisse plus un serveur arrêté pour de bon (point 2) : son test le montre relancer après la
   troisième chute.
4. Acedia, un test chacun :
   - une panne passagère ne sort aucun mail de la file : cinq mails en file, le réseau coupé, trois passes, les cinq
     restent ;
   - un mail en erreur qui lui est propre n'arrête plus les suivants ;
   - un mail qui sort de la file laisse une ligne au journal du serveur ;
   - une règle vers une boîte retirée est sautée (point 3) ;
   - un calendrier en erreur n'arrête plus les autres ni les tâches ;
   - une action groupée qui échoue à mi-chemin laisse au journal des gestes, annulables, les mails déjà touchés.
5. Avaritia : un lot retenu repart dans l'heure, sans attendre l'envoi suivant. Un test.
6. Si la tâche 3 est prise : un client du flux en direct qui ne lit plus ne fait plus grossir le core. Un test.
7. La page de mise en service dit le nouveau lanceur, le prix de chaque modèle utilisé, où vont les copies pendant le
   rodage, et ce que devient la nuit quand le desktop dort. Les barrières des trois dépôts sont vertes.

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-anima`, `fix/tenir-en-continu` | à ouvrir, privée : son corps est prêt, hors des dépôts | `standard` |
| `lun-acedia`, `fix/tenir-en-continu` | à ouvrir | `standard` |
| `lun-avaritia`, `fix/tenir-en-continu` | à ouvrir | `standard` |
| `lun-docs`, `docs/tenir-en-continu` | l'issue chapeau, à ouvrir | `trivial` |

**Le niveau.** `standard` pour les trois dépôts. Aucune donnée n'est retirée dans ce palier : les purges passent au
chantier suivant. Chaque tâche suit un modèle déjà là : `startLoop` pour les boucles, la marque du jour de
`backup.failed` pour l'événement de chute, le journal des gestes pour l'action groupée. Le standard
[`workflow.md`](../../standards/workflow.md) demande alors un test par comportement changé ; chaque tâche les a. La
sortie en code 1 change ce que fait un processus en erreur : elle est tranchée avant le code (point 1). Un changement
du contrat satellite serait `critique` (`workflow.md:39`) : la tâche 10 n'entre pas, le contrat ne change pas.

**Les issues.** Une issue chapeau dans **lun-docs**, « Tenir en continu », qui porte ce plan et la liste des trois
autres ; une issue dans chacun de **lun-anima** (privée), **lun-acedia** et **lun-avaritia**, qui renvoie au chapeau.
Chaque PR de code ferme l'issue de son dépôt ; la PR de lun-docs (le plan coché, la page de mise en service) ferme
le chapeau, une fois les trois autres fusionnées.

## Ce que le code fait aujourd'hui

### Lun'Anima

Le core est décrit dans son issue privée : lun-docs est public. Seul le lanceur du desktop est dit ici, comme la page
de mise en service le fait déjà.

- **Le lanceur** (`lun-anima/deploy/windows/run.mjs`, pour les trois serveurs) relance un serveur tombé en erreur 60 s
  plus tard, trois fois ; une course de plus de 10 min remet le compte à zéro ; après la troisième chute, il le laisse
  arrêté (`deploy/windows/LISEZMOI.md:9`, `mise-en-service-desktop.md` § 9 et son tableau). **Une erreur qui revient
  chaque minute arrête donc le serveur pour de bon en sept minutes** (quatre lancements, trois attentes), jusqu'à ce
  que CrOliX le relance au Planificateur ou que Windows redémarre. Il est hors de chez lui les trois quarts du temps.
- **Il garde déjà la sortie d'erreur** : la sortie et les erreurs du serveur vont au journal du jour
  (`run.mjs:92-93`), gardé 14 jours. Un filet de processus n'a qu'à écrire l'erreur sur la sortie d'erreur.
- **Sur Windows, arrêter une tâche coupe le serveur net** : Node n'y envoie pas de signal, et l'arrêt propre d'un
  serveur n'y joue pas (« Limites »).

### Lun'Acedia

- **Quatre minuteries sans filet** : l'échéance des clés (`server/src/main.ts:75-77`, au démarrage puis chaque heure),
  la purge des événements (`:102`), le fil de l'agent (`:105-111`), les rappels
  (`server/src/agenda/reminders.ts:99-109`, chaque minute, avec une écriture à `:103-105`). La synchro Gmail et
  l'agenda passent par `startLoop` (`server/src/util.ts:12-33`), qui attrape ; la copie a son propre filet
  (`server/src/backup.ts:71-88`). Aucun filet au niveau du processus. Une écriture des rappels qui lève (base tenue
  plus de 5 s par une commande, disque plein) arrête Acedia ; si l'erreur revient, le lanceur l'abandonne en sept
  minutes.
- **Le tri compte un essai sur toute erreur** (`server/src/triage/pipeline.ts:289-312`). Il ne passe qu'après une
  synchro Gmail réussie (`server/src/gmail/sync.ts:246-248`) : une coupure complète du réseau l'arrête avant lui. Mais
  toute erreur d'un mail, passagère ou non, compte un essai (`pipeline.ts:304-305`) puis arrête la passe (`:306`) ;
  au troisième, le mail sort de la file, sans trace (`server/src/triage/queue.ts:30-33`). Le commentaire de
  `triageNew` dit le contraire (« leaves the mail queued », `pipeline.ts:287`). Exemple : le fournisseur d'IA en
  panne une heure, Gmail joignable. Son erreur (`ProviderError` de sorte `unavailable`,
  `server/src/llm/types.ts:73-90`) remonte (`pipeline.ts:172`). Une passe par minute : un mail sort de la file toutes
  les trois passes, une vingtaine en une heure, jamais triés, sans une ligne.
- **Les erreurs se distinguent déjà** : `GoogleApiError` porte son statut (`server/src/google/client.ts:45-52`) ; le
  client relance lui-même 429 et 5xx avant de lever (`:168-171`) ; un rafraîchissement refusé devient
  `GoogleReauthError` (`:100`, `:130`) ; sans compte, `GoogleNotConnectedError` (`:143`). Un mail absent de Gmail
  donne `NotFoundError` (`server/src/gmail/actions.ts:40`, `:54`).
- **Une règle vers une boîte retirée lève à chaque mail** : `setRole(null)` ne touche pas aux règles
  (`server/src/triage/labels.ts:34-45`) ; la boîte n'est vérifiée qu'à la création et à la modification d'une règle
  (`server/src/triage/rules.ts:82-84`, `:87`, `:114`). Au tri, la règle est prise (`pipeline.ts:191-193`), et
  `fileMail` refuse une cible qui n'est plus une boîte (`server/src/gmail/actions.ts:76-78`). Trois passes plus tard,
  le mail sort de la file.
- **L'agenda, tout ou rien** : les calendriers puis les tâches, en série (`server/src/agenda/unified.ts:34`). Un
  calendrier en erreur autre qu'un 410 lève (`server/src/agenda/calendar.ts:233`), une liste de tâches aussi
  (`server/src/agenda/tasks.ts:142-148`) : les suivants et toutes les tâches attendent la minute d'après, et
  `agenda.changed` ne part pas.
- **L'action groupée** fait un mail après l'autre (`server/src/gmail/actions.ts:124-127`) et ne rend ses changements
  qu'à la fin ; la route ne les journalise qu'après (`server/src/gmail/routes.ts:95-103`). Si le 12e de 20 échoue,
  les 11 premiers sont faits dans Gmail, absents du journal : ni annulables, ni appris.
- **Un modèle sans prix compte 0** : Mistral Small et Medium n'en ont pas (`server/src/llm/models.ts:81-82`). Le
  `.env` les complète par `LLM_PRICES` (`:98-119`), que le `.env.example` ne cite pas. Le tri le dit par un
  événement `log` (`pipeline.ts:118-125`, `:153-157`), qui n'entre pas au Journal.

### Lun'Avaritia

- **Deux minuteries sans filet** : l'échéance des clés (`server/src/main.ts:62-64`) et la purge des événements
  (`:65`). La copie a son filet (`server/src/backup.ts`, le module d'Acedia mot pour mot). Aucun filet au niveau du
  processus.
- **Les lots ne passent qu'à trois moments** : au démarrage (`main.ts:51`), à chaque envoi du core
  (`server/src/contract/catalog.ts:22-24`) et à la reprise après une pause (`server/src/contract/routes.ts:131-138`).
  Chaque passe remet en file les lots `running` (`server/src/brain/ingest.ts:64`) et les lots `held` quand le plafond
  et les fournisseurs le permettent (`:65-66`), jamais `failed`. Un lot `held` attend donc la nuit suivante, raccourci
  assumé (`:53-56`) : une panne de 3 h en coûte 24.
- **Un lot en échec n'est dit qu'au tableau de bord** (`server/src/brain/dashboard.ts:45`, « Lot en échec ») :
  `runLot` le marque (`ingest.ts:91-99`), et Avaritia n'envoie au core que les événements de clé et de copie
  (`backup.ts:82`).
- **Un modèle sans prix compte 0** (`server/src/brain/process.ts:229-230`, `server/src/brain/agent.ts:238-241`) ;
  Mistral Small et Medium en sont (`server/src/llm/models.ts:81-82`). Le plafond du mois ne les voit pas, le core non
  plus : il compte ce qu'Avaritia lui rend.

### Le contrat satellite

- Un événement a un `type` libre (`standards/contrat-satellite.md:44`). Le contrat ne recommande des types que pour
  les clés (`:119-126`) : `key.invalid`, `key.restored`, `key.expiring`.
- Il dit que le core ne retient du flux que `urgent` et les événements de contrôle (`:116`). Le code fait plus : le
  core porte au Journal et au téléphone les événements `normal` d'un poste. C'est par là que `backup.failed`, émis par
  Acedia et Avaritia depuis le plan [« écarts avant la semaine »](2026-11-09-ecarts-avant-semaine.md), arrive déjà,
  sans être écrit au contrat.

### Ce que l'audit disait et qui ne tient pas

- **« L'image Docker d'Acedia est injoignable depuis le NAS, faute de `ENV HOST` »** : le déploiement prévu publie
  chaque serveur par Tailscale depuis la boucle locale, sur le desktop (`mise-en-service-desktop.md`, § 6) comme dans
  la configuration du NAS. `127.0.0.1` y est voulu. Seul un `docker run -p` nu ne répondrait pas, et rien ne le
  prévoit. Écarté.
- **« Le tri d'Acedia par l'IA n'a pas de plafond »** : il n'en a pas à lui, mais le plafond du jour du core compte
  ses coûts et le met en pause une fois atteint (plan « plafonds et pause »). Sans core, il n'a pas de borne, mais le
  rodage tourne avec le core. Écarté.
- **« La copie `VACUUM INTO` est synchrone »** : vrai, et assumé par un commentaire `shortcut:` chez Acedia et
  Avaritia (0,1 s pour 30 Mo ; passer à la copie asynchrone à quelques centaines de Mo). Les bases font quelques Mo.
  À revoir avec les vrais débits et le second dossier (« Le chantier suivant »).
- **« Un lot de 500 observations »** : la nuit du core n'en sort pas 500, de l'ordre d'une centaine au plus. Le risque
  vrai est la rédaction d'une grosse nuit en un seul appel ; il passe au chantier suivant.
- **« Un lot déjà écrit est rejoué après un arrêt brutal »** (Avaritia) : aucune attente entre l'écriture des
  brouillons et le statut du lot, seulement quelques microsecondes. Écarté.
- **« Le healthcheck des images ne lit que `/` »** : vrai, mais Docker ne relance pas un conteneur malade, et la
  cible est un serveur dédié. Hors périmètre : à revoir avec la bascule.

## Les tâches

**Pour chaque tâche.** Les tests d'abord, vus échouer avant le code, écrits par le développeur. Le `reviewer` relit
chaque diff contre sa tâche avant la PR de son dépôt. Les serveurs des satellites n'ont pas d'agent à eux : `dev-core`
les code, le `CLAUDE.md` du satellite dans son brief. `dev-luxuria` n'a rien ici. Le `livreur` coche ce plan et ouvre
les PR en brouillon.

**Chaque PR joint la liste des minuteries de son serveur** : chaque `setInterval`, `setTimeout` qui se réarme,
`startLoop` et promesse laissée à `void`, avec son fichier, sa ligne et son filet. C'est la preuve du critère 1 ; le
`reviewer` la refait avant d'approuver.

**En parallèle.** Un développeur par dépôt, chacun dans son worktree créé depuis la branche du chantier. Les trois
dépôts partent ensemble ; **dans un dépôt, les tâches passent en série**, dans l'ordre du plan :

- **lun-anima** : 1, puis 2, puis 3 si elle est prise.
- **lun-acedia** : 4, puis 5, 6 et 7.
- **lun-avaritia** : 8, d'emblée : sans module de chute, elle ne dépend plus d'Acedia.
- **lun-docs** : 9 au fil des fusions, en dernier.

**Les fichiers partagés**, raison de la série :

- `README.md` d'Acedia : les tâches 4 et 5 ; celui d'Avaritia : la tâche 8 seule.
- `deploy/windows/LISEZMOI.md` de lun-anima : la tâche 2 seule.
- `.env.example` d'Acedia et d'Avaritia : aucune tâche n'y touche. Un prix se règle dans le `.env` du service, et la
  page de mise en service le dit (tâche 9). Une tâche qui doit y toucher le dit avant.
- `docs/mise-en-service-desktop.md` : la tâche 9 seule. Le chantier « textes d'accord » la laisse à celui-ci jusqu'à
  la bascule.

### Lun'Anima (`dev-core`)

1. - [ ] **Tâches 1 à 3, dans lun-anima#N (privée)** : 1, les filets du core ; 2, le lanceur ne lâche plus un
   serveur ; 3, en option, le flux en direct borné. Leur détail, fichiers compris, est dans l'issue. Elles portent,
   pour le core, les critères 1, 2, 3 et 6. Le lanceur relance le core comme les satellites : la tâche 2 vaut pour
   les trois serveurs, et la tâche 9 la dit dans la page.

### Lun'Acedia (`dev-core`)

4. - [ ] **Les filets d'Acedia.** *Part d'emblée.* `server/src/main.ts`, `server/src/agenda/reminders.ts`, leurs
   tests.
   - Les quatre minuteries passent par `startLoop` (`server/src/util.ts:12-33`) : l'échéance des clés
     (`main.ts:75-77`), la purge des événements (`:102`), le fil de l'agent (`:105-111`) et les rappels
     (`reminders.ts:99-109`, qui garde son `stop`). L'erreur va au journal du serveur par un `onError` comme
     `logError` (`main.ts:78-84`), et la boucle repasse.
   - `startLoop` passe aussi tout de suite (`util.ts:31`) : les appels du démarrage (`main.ts:76`, `:110`) partent.
     Pour les rappels, qui passaient pour la première fois après une minute, vérifier qu'une passe au démarrage n'en
     double aucun.
   - Le filet du processus, selon « À trancher », points 1 et 4 : aucun code. Node écrit l'erreur et sa pile sur la
     sortie d'erreur, que le lanceur garde au journal du jour (`run.mjs:92-93`), puis sort en code 1. Le développeur
     vérifie qu'aucun écouteur `uncaughtException` ni `unhandledRejection` ne l'annule, dans `server/src` comme dans
     les dépendances, serveur démarré (`process.listenerCount`). S'il en trouve un, il le dit avant tout code.
   - Tests : chaque minuterie, sa fonction rendue fausse, écrit l'erreur et repasse (minuteries simulées de vitest) ;
     `startReminderLoop` dont l'écriture lève continue (aucun test ne couvre cette boucle aujourd'hui).
   - Exclu : changer `startLoop`, la synchro Gmail, l'agenda, la copie ; un événement de chute (point 4).
5. - [ ] **Le tri ne perd plus de mails.** Après 4. `server/src/triage/pipeline.ts`, `server/src/triage/queue.ts`,
   leurs tests, `README.md` si le tri y est décrit.
   - Dans le `catch` de `triageNew` (`pipeline.ts:303-307`), l'erreur est classée :
     - **propre au mail** : `GoogleApiError` 404 ou 400, `NotFoundError`, `BadRequestError` (une cible qui n'est pas
       une boîte). L'essai compte, et la passe continue au mail suivant ;
     - **passagère** : une erreur du réseau (`fetch` qui lève), `GoogleApiError` 429 ou 5xx (déjà relancée par le
       client), `GoogleReauthError`, `GoogleNotConnectedError`, une `ProviderError` sans statut HTTP ou de statut
       408, 429 ou 5xx, la base occupée (`node:sqlite` lève `code: 'ERR_SQLITE_ERROR'` et `errcode` 5, relevé le
       12/11 sur Node 24). Le mail est rendu à la file sans essai compté, et la passe s'arrête : l'erreur remonte à la
       boucle comme aujourd'hui. **Corrigé à la relecture** : `toProviderError` (`server/src/llm/types.ts:90`) range
       tout statut hors 401, 402 et 403 en `unavailable`, 400 compris ; la sorte seule aurait gardé en tête de file,
       pour toujours, un mail auquel l'IA répond 400. Le statut est donc gardé dans `ProviderError`, et ce fichier
       entre dans la tâche ;
     - **toute autre**, une inconnue, un 403 ou un autre 4xx de l'IA : comme aujourd'hui, l'essai compte et la passe
       s'arrête. Une erreur qui ne passe jamais ne bloque ainsi pas la file pour toujours : le mail sort au troisième
       essai, avec sa ligne.
   - Un mail qui sort de la file au troisième essai, sur erreur ou sur une réponse inutilisable de l'IA (`:309`),
     laisse une ligne au journal du serveur : son id et la raison. `failedAttempt` (`queue.ts:30-33`) dit s'il l'a
     retiré ; le `log` est injectable, comme celui de `backupIfMissing`.
   - Selon « À trancher », point 3 (recommandé (a)) : au tri, une règle dont la cible n'est plus une boîte est sautée
     (`pipeline.ts:191-193`). La règle suivante ou l'IA décide ; une ligne au journal du serveur le dit, au plus une
     fois par règle et par passe.
   - Le commentaire de `triageNew` (`:283-288`) dit ce qui se passe vraiment.
   - Tests (`failedAttempt` n'en a aucun aujourd'hui) :
     - cinq mails en file, le réseau coupé, trois passes : les cinq restent, sans essai compté ;
     - trois mails, le premier rend 404 : les deux autres sont triés ;
     - un mail qui sort au troisième essai laisse sa ligne ;
     - une règle vers une boîte retirée ne lève plus : le mail est trié par la règle suivante ou par l'IA, et une
       ligne le dit.
   - Exclu : désactiver les règles à l'écran ; un écran « non trié » ; changer le client Google ou ses relances.
6. - [ ] **L'agenda, calendrier par calendrier.** Après 5. `server/src/agenda/calendar.ts`,
   `server/src/agenda/tasks.ts`, `server/src/agenda/unified.ts`, leurs tests.
   - Une erreur sur un calendrier (`calendar.ts:233`, hors 410) ou sur une liste de tâches (`tasks.ts:142-148`)
     n'arrête plus les suivants : les autres calendriers, puis les tâches, passent, et `agenda.changed` part pour ce
     qui a changé (`unified.ts:34-36`). L'erreur remonte ensuite à la boucle, qui l'écrit au journal du serveur comme
     aujourd'hui (`main.ts:96-99`), en nommant le calendrier ou la liste.
   - `GoogleReauthError` et `GoogleNotConnectedError` arrêtent tout de suite, comme aujourd'hui : elles valent pour
     tous. Le 410 garde son traitement.
   - Tests : deux calendriers, le premier rend 403 : le second et les tâches sont synchronisés, `agenda.changed`
     part, l'erreur remonte ; une liste de tâches en erreur n'empêche pas les autres.
   - Exclu : la fenêtre de la première synchro ; les relances de Google.
7. - [ ] **L'action groupée journalise au fil.** Après 6. `server/src/gmail/actions.ts`, `server/src/gmail/routes.ts`,
   leurs tests.
   - Chaque mail touché est journalisé, et appris comme aujourd'hui par `journaled` (`routes.ts:34`), dès que Google
     l'a fait (`actions.ts:124-127`), pas à la fin (`routes.ts:100-101`). Au premier échec, la route rend l'erreur
     comme aujourd'hui ; les mails déjà faits sont au journal, annulables.
   - Tests : 20 mails dont le 12e rend 404 : les 11 premiers au journal, chacun annulable, leurs exemples appris ; la
     réponse dit l'erreur. Une action qui passe en entier rend la même réponse qu'aujourd'hui.
   - Exclu : changer la forme de la réponse ou l'écran ; reprendre les mails après l'échec.

### Lun'Avaritia (`dev-core`)

8. - [ ] **Les filets d'Avaritia, et ses lots qui repartent.** *Part d'emblée.* `server/src/main.ts`,
   `server/src/brain/ingest.ts`, leurs tests.
   - L'échéance des clés (`main.ts:62-64`) et la purge des événements (`:65`) passent par `startLoop`
     (`server/src/util.ts:12-33`), comme chez Acedia.
   - Le filet du processus : comme à la tâche 4, aucun code, la vérification des écouteurs.
   - **Une passe des lots chaque heure**, par `startLoop` (qui passe aussi au démarrage, à la place de `main.ts:51`).
     `runPending` sait déjà sauter en pause et ne jamais tourner deux fois (`ingest.ts:60`) : un lot `held` repart
     dans l'heure où son fournisseur revient ou son plafond se lève. Le commentaire `shortcut:` (`:53-56`) part.
   - Tests :
     - les deux minuteries, leur fonction rendue fausse, écrivent l'erreur et repassent ;
     - un lot `held`, son fournisseur revenu : la passe suivante le traite, sans envoi du core (minuteries simulées).
   - Exclu : reprendre un lot `failed` ; `lot.held` ; `lot.failed` (point 4) ; le traitement d'un lot (« Le chantier
     suivant »).

### lun-docs (la session)

9. - [ ] **La page de mise en service à jour** (`trivial`). En dernier, au fil des fusions.
   `docs/mise-en-service-desktop.md` :
   - le lanceur qui ne lâche plus (§ 9 et la ligne du tableau, `:262`), une fois la tâche 2 fusionnée ;
   - **un prix pour tout modèle utilisé** chez Acedia et chez Avaritia, à l'endroit où la page parle des clés des
     fournisseurs : Mistral Small et Medium n'en ont pas. Soit un autre modèle, soit son prix dans le `.env` du
     service, `LLM_PRICES={"mistral/mistral-small-latest":[entrée, sortie]}`, en dollars par million de jetons ;
   - **les copies pendant le rodage** (§ 8) : aucune ne quitte le desktop. Si CrOliX en veut une ailleurs, le NAS tire
     lui-même les dossiers `backups/`, sans code : un réglage du NAS, qui dit lui-même ses échecs ;
   - **la nuit et la veille du desktop** (§ 7, `:133`, que le chantier « textes d'accord » rend à celui-ci) : en
     veille, les trois serveurs s'arrêtent tous, tri, rappels et copies compris, et le rattrapage ne rejoue que la
     nuit. Pendant le rodage, le desktop reste allumé, veille prolongée désactivée ;
   - où se voit un arrêt sur erreur (§ 8, à côté de la copie ratée) : celui du core, au Journal et au téléphone ; celui
     d'un satellite, au journal du jour du lanceur, et au core s'il dure 15 min (le poste injoignable) ; un lot en
     échec, au tableau de bord d'Avaritia.
   - Rien dans la feuille de route ni les ADR (le chantier « textes d'accord »).
10. **Le contrat satellite dit les événements de fonctionnement** : n'entre pas, CrOliX ayant écarté tout signal des
    satellites au core dans ce chantier (point 4). Il part au chantier suivant.

## Le chantier suivant, sur les débits réels

Ce qui demande les vrais débits du desktop, ou le serveur dédié, part après le rodage. Rien n'y est simulé : la
mesure jetable de l'ancienne version de ce plan est retirée. Chaque point garde ce que le plan-challenger y a objecté.

- **Les purges**, du core et d'Avaritia, et leurs durées, tranchées sur les débits relevés. Trois règles :
  - la rétention du core au moins égale à celle des satellites (sept jours chez eux) plus une marge, pour qu'un
    événement qu'un poste garde encore ne manque jamais au core ;
  - la purge après la copie du jour, jamais avant ;
  - aucune observation purgée tant qu'un brouillon de son lot attend.
  Le Journal (permanent par choix) et la mémoire de la relation (non supervisée) n'y entrent jamais.
- **L'index de l'accueil** du core, qui cherche les urgences du jour dans tous les événements reçus.
- **La rédaction d'Avaritia découpée** : un seul tri par lot, la rédaction par paquets ; un groupe oublié ne fait pas
  échouer les autres. Aujourd'hui, un lot passe en deux appels quelle que soit sa taille
  (`server/src/brain/process.ts:292`, `:342`), et rien ne vérifie qu'un groupe ait sa fiche (`:170-198`).
- **L'envoi rejoué** : chaque `brain.ingest` crée un lot (`server/src/brain/ingest.ts:31-48`) ; le même envoi rejoué
  par le core fait deux fois les mêmes brouillons.
- **Les brouillons après une fusion** : « Fiche absente. » (`server/src/brain/drafts.ts:192`), le fait remplacé déjà
  barré (`:205`), la fusion qui ne réécrit pas les brouillons en attente (`:262-278`).
- **Les signaux des satellites au core** : `server.crashed` et `lot.failed`, au plus une fois par jour, et le contrat
  qui les écrit avec `backup.failed` (l'ancienne tâche 10, `critique`).
- **Un lot en échec repris une fois**, et `lot.held` quand le plafond du mois retient un lot.
- **Un modèle sans prix jamais appelé sans être compté** : ce palier ne fait que le dire dans la page.
- **La nuit retenue par le plafond d'Avaritia** : quand il est atteint, la nuit du core ne lui envoie rien et compte
  l'étape faite (plan « plafonds et pause ») ; ces observations n'atteignent jamais la bibliothèque.
- **La lecture du flux d'un poste**, côté core, bornée en taille.
- **Le second dossier de copies, avec le serveur dédié**, le NAS servant au stockage : une copie asynchrone, une à la
  fois, avec un délai de garde, pour qu'un partage figé ne tienne pas le serveur.

## Ce que le desktop vérifiera

Rien de ce qui suit ne se prouve sur le laptop ; la semaine de rodage le regarde.

- **Un partage réseau figé** : aucune base ni copie n'y vit pendant le rodage. Si le NAS tire les copies, un partage
  qui ne répond plus ne doit tenir aucun serveur.
- **Le téléphone qui se reconnecte** : après une relance du core, et après la fermeture d'un flux si la tâche 3 est
  prise.
- **« Un satellite tombe, le core reçoit l'événement à la relance »**, de bout en bout, jusqu'au téléphone.
- **La mémoire** des trois serveurs, sur plusieurs jours.
- **Les erreurs réelles de Google** : celles que le tri rencontre (un 403 de quota, des 5xx), et si le classement de
  la tâche 5 les range bien.
- **Les vrais débits** : le nombre de lignes par jour dans chaque base, sans en lire le contenu. Ils nourrissent le
  chantier suivant.
- Chaque jour : les relances du lanceur dans les journaux, la taille des bases.

## Hors périmètre

- Le premier contact sans terminal : lun-acedia#62 (jeton illisible), #55, lun-anima#72 ; le verrou d'appairage
  global et les jetons sans expiration, des trois.
- Le journal des gestes d'Acedia et son archivage (lun-acedia#33).
- La fenêtre de l'agenda figée à la première synchro (Acedia) : à vérifier sur le compte de test, effet en mois.
- Le tri qui retarde la synchro Gmail, `updatedMin` pris sur l'horloge, les trois « jours » d'Acedia : mineurs, sans
  perte.
- Avaritia : les index de la ligne d'arrivée 3 (2,7 ms à 50 000 faits, mesuré par l'audit), l'écran Dépôts, les
  brouillons qui s'accumulent pendant une absence (l'affichage est borné, rien ne se perd), la fiche proposée deux
  fois, l'import Obsidian, `lower()`, l'oubli d'un tiers, la recherche par le sens, la citation mot pour mot.
- Un bouton « Rejouer » pour un lot en échec ; un écran « non trié » chez Acedia.
- Le healthcheck des images ; le chiffrement des copies ; l'arrêt propre sous Windows.
- Lun'Luxuria : son chantier « Écoute et parole ».

## Limites

- **La sortie sur erreur reste un redémarrage** : le filet la rend visible et le lanceur la rend courte, il ne l'évite
  pas. Ce qui l'évite, ce sont les filets des boucles.
- **Sur Windows, l'arrêt d'une tâche coupe le serveur net** (Node n'y a pas de signal) : l'arrêt propre ne joue que
  sous Docker ou au Ctrl+C. Lu dans la doc de Node, pas essayé ici. Une nuit coupée reprend au démarrage.
- **Le classement des erreurs du tri** suit ce que le code lève, pas des erreurs réelles de Google : un 403 de quota
  est rangé avec les inconnues et compte un essai. Le desktop le dira.
- **Une panne passagère qui dure arrête le tri** à chaque passe, sans rien perdre : les mails attendent, et seule la
  ligne de la boucle le dit, chaque minute, comme aujourd'hui.
- **Un satellite tombé ne se lit qu'au journal du lanceur**, et au core s'il reste injoignable 15 min ; un lot en
  échec, qu'au tableau de bord d'Avaritia. Les signaux viennent au chantier suivant.
- **Les copies restent sur le disque du desktop** pendant le rodage, sauf si le NAS les tire : un disque perdu
  emporte la base et ses copies. Elles ne sont pas chiffrées.
- **Les rappels d'Acedia passent dès le démarrage**, sur le cache de l'agenda d'avant l'arrêt : un événement déplacé
  pendant l'arrêt, dû dans le quart d'heure, peut donner un rappel faux. Aucun n'est doublé ni perdu. Le cache a déjà
  ce retard en marche, jusqu'à une minute, et sans borne quand la synchro échoue.
- **Le prix d'un modèle se règle à la main** : un modèle choisi plus tard sans prix compte encore 0, jusqu'au chantier
  suivant.

## À trancher par CrOliX

1. **Ce que fait un serveur sur une erreur restée hors de tout filet** (les trois). (a) L'écrire sur la sortie
   d'erreur, porter au plus un événement de chute par jour, puis sortir en code 1 : le lanceur relance en 60 s.
   (b) La même chose, mais rester debout sur une promesse rejetée et ne sortir que sur une exception. (c) Rester
   debout toujours. **Je recommande (a)** : une erreur hors filet peut laisser une écriture à moitié faite, et rester
   debout la cacherait. La relance coûte une minute, et les filets des boucles (tâches 1, 4, 8) rendent le cas rare.
   Le core redémarré reste l'exception : c'est ce que ces filets protègent.
2. **Le lanceur.** (a) Après ses trois relances à 60 s, une toutes les 15 min, sans fin. (b) Comme aujourd'hui, il
   abandonne. **Je recommande (a)** : un abandon arrête le service jusqu'au retour de CrOliX, des jours parfois. Le
   coût : une ligne au journal par quart d'heure tant que le serveur tombe.
3. **Une règle d'Acedia vers une boîte retirée.** (a) Au tri, la sauter, avec une ligne au journal du serveur.
   (b) Retirer le rôle de boîte désactive ses règles. (c) Refuser de retirer le rôle tant qu'une règle y mène. **Je
   recommande (a)** : il couvre toutes les façons dont une boîte disparaît, Gmail compris, sans toucher l'écran.
4. **Les événements que les satellites portent au core** (`server.crashed`, `lot.failed`). Les porter est un
   changement du contrat satellite (`contrat-satellite.md:27`, `:116`), donc `critique`, et ce chantier en est le
   propriétaire : c'est lui qui les émet.
   - (a) La tâche 10 : le contrat les écrit, avec `backup.failed`, et corrige `:116`, dans la PR de lun-docs.
   - (b) Reprendre un type que le contrat a déjà : il n'y a alors plus de changement de contrat.
   - (c) Ne rien porter au core dans ce palier : la chute reste au journal du jour, le lot en échec au tableau de
     bord.

   **Je recommande (a).** (b) ne tient pas : le contrat n'a de types que pour les clés, et le core lit `key.invalid`
   comme l'état de la clé d'un poste. Une chute dite par `key.invalid` montrerait une clé refusée qui ne l'est pas.
   (c) laisse CrOliX sans rien savoir d'un serveur qui retombe pendant ses absences, ce que le lanceur sans fin rend
   plus probable. (a) ne demande aucun code au core : il porte déjà les événements `normal` d'un poste au Journal et au
   téléphone, et `backup.failed` y passe déjà sans être écrit au contrat.
