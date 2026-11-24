# Acedia : des comptes justes au core, un retour de Google propre. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** Lun-Ecosystem/lun-acedia#92 (une proposition comptée après le départ de son mail),
> Lun-Ecosystem/lun-acedia#84 (le retour de Google en JSON brut) et Lun-Ecosystem/lun-acedia#62 (un jeton Google
> illisible), `niveau:standard`. Pas de chapeau : tout le code est dans Lun'Acedia.
>
> **PR qui livre :** à ouvrir (tâche 7).
>
> **État : rédigé le 24/11**, à contester puis à valider. Choisi par CrOliX le 24/11 au soir. Une décision lui reste
> (#92, « La décision de CrOliX »).
>
> Code relu sur `main` : lun-acedia `c3ab7f1` (avec « trancher sans risque, la suite », fusionné le 24/11 ; la prod
> tourne en 0.3.0, `864b6b6`), lun-docs `e18f5e4`. Le graphe d'abord, puis chaque ligne citée. Lun'Acedia est
> public : rien du core ici, seulement le contrat `/lun/v1`.

**But :** pendant la semaine de rodage, ce qu'Acedia dit au core est juste, et brancher le compte Google ne laisse
jamais CrOliX devant du JSON brut ou un écran figé. Le bilan ne compte « en attente » que ce qu'« À valider » montre.
Un retour de Google en erreur ramène à Réglages › Compte Google, avec une phrase claire. Une base restaurée avec une
autre clé dit « Non connecté » et propose de connecter. C'est la journée ([`vision.md`](../../vision.md), point 1),
sans point de tension (le critère du VIP).

**Source :** les trois issues ; les « Limites » du plan précédent
([Trancher sans risque, la suite](2026-11-24-acedia-trancher-suite.md)) ; le plan
[Google en mode Personnel](2026-11-23-google-mode-personnel.md), qui a ouvert #84 ; la
ligne de #62 dans la [feuille de route](2026-11-07-feuille-de-route-mvp.md) ; RFC 6749, § 4.1.2.1.

## Critères de fin

1. **Le bilan ne compte plus une proposition dont le mail a quitté la réception** : archivé, en corbeille, en spam,
   supprimé, rangé hors d'Acedia. Revenu en réception, il compte de nouveau. `received` et `done` ne changent pas.
   Tests. Tâches 1, 3. (Selon le choix B ; avec A, voir la décision.)
2. **Chaque retour de Google en erreur ramène à Réglages › Compte Google** avec un message clair : un refus, un
   `state` inconnu, rejoué ou périmé, un échange refusé ou impossible, un profil illisible. La redirection est l'une de
   quatre adresses fixes ; rien de ce que Google envoie n'est recopié. Un retour en erreur ne change rien au compte
   branché. Tests ; Chrome sur la démo. Tâches 1 à 4, 6.
3. **Le succès ouvre aussi la carte Compte Google**, pas « Tri par l'IA ». Tests ; Chrome. Tâches 2, 4, 6.
4. **Un jeton illisible** : le statut dit « Non connecté » sans 500, l'écran propose « Connecter un compte Google »,
   la déconnexion répond 200, une reconnexion marche, et la synchro ne remplit plus le journal du serveur. Tests ;
   Chrome sur la démo. Tâches 1, 3, 6.
5. **Le reste ne bouge pas** : « À valider » et le compteur du rail, la connexion qui réussit, le changement de compte
   qui efface les données, la forme du contrat. Les tests d'aujourd'hui restent verts, sauf ceux que la tâche 1
   réécrit.
6. **Barrières d'Acedia vertes** ; preuve dans Chrome sur la démo, jamais sur la prod. Tâches 5, 6.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-acedia` : le bilan, le retour de Google, le jeton | `fix/comptes-retour-google` | #92, #84, #62 | `standard` |
| `lun-docs` : ce plan, ses coches | `docs/acedia-comptes-google` | #92, #84, #62 | `trivial` |

Les trois issues sont celles de Lun'Acedia.

**Le niveau.** `standard` : un nombre du contrat change de sens (sans changer de forme), une route publique change
ses réponses, et une erreur de déchiffrement devient un état. Rien de nouveau en base, pas de migration.

## Ce que le code fait aujourd'hui

Chemins relatifs à `lun-acedia/`.

### Le bilan (#92)

- **`day.digest`** (`server/src/contract/catalog.ts:418-479`) rend `{ since, until, received, done, pending }`.
- **`pending`** (`:473-476`) additionne **toutes** les propositions `pending` de la table, sans regarder le mail, et
  les cartes de l'agent en attente du jour (après `expireCards`, `:472`).
- **« À valider » ne montre que la réception** : la vue `pending` exige `INBOX`, sans `TRASH` ni `SPAM`
  (`server/src/gmail/store.ts:120-123`, `:136-140`). Le compteur du rail lit la même vue, une page de 50 au plus
  (`app/src/shell/status.ts:47-64`). L'outil `mail.list` de l'agent aussi (`catalog.ts:240-251`, par `viewFilter`,
  déjà importé, `:20`). Seul le bilan compte autrement.
- **Ce qui sort un mail de la réception sans régler sa proposition** :
  - un archivage, une corbeille, un spam faits dans Acedia : `afterUserAction` (`server/src/triage/pipeline.ts:515-521`)
    les journalise, mais ne règle la proposition que pour un rangement (`onManualFile`, `:495-501`, appelé `:519`) ;
  - un geste hors d'Acedia (Gmail sur le web, au téléphone, un filtre) : la synchro met à jour les étiquettes
    (`server/src/gmail/sync.ts:115`, `:134`, `:192`) et ne règle aucune proposition ;
  - un mail supprimé pour de bon : la synchro le retire du cache (`sync.ts:130`, `:200` ; `store.ts:101-103`), sa
    proposition reste ;
  - un rangement partiel, ou un arrêt pendant l'appel à Gmail (les « Limites » du plan précédent).
- **Le reste du bilan, sur ces mails.** `received` (`catalog.ts:432-441`) liste les mails par date d'arrivée, quoi
  qu'ils soient devenus : c'est juste. `done` (`:442-471`) liste les lignes du Journal : un archivage, une corbeille,
  un spam faits dans Acedia y sont (`journal.archive`, `journal.trash`, `journal.spam`) ; un geste hors d'Acedia n'y
  est pas, et rien ne l'y fait entrer. **Seul `pending` est faux.**
- **Un mail revenu en réception** (une annulation, `server/src/triage/journal.ts:144-182`, ou un geste dans Gmail)
  retrouve sa proposition, jamais réglée. Le tri ne le reprend pas : `claim` saute un mail qui a une proposition
  (`pipeline.ts:353-356`).
- **La puce de proposition** s'affiche sur un mail de toute vue (Archives, Corbeille, une boîte) : `withProposal`
  (`pipeline.ts:524-527`, `server/src/app.ts:126`), puis `views/src/lib/mail/MailRow.svelte:113-120`. V la valide
  depuis la boîte (`views/src/lib/mail/Mailbox.svelte:373`). Lu, pas vu dans Chrome.
- **Le test du bilan** (`server/src/contract/digest.test.ts:51-72`) compte une proposition d'un mail en réception
  (`message()` met `INBOX` par défaut, `server/src/testing/fake-gmail.ts:70`) et une carte : 2.

### Le retour de Google (#84)

- **`/oauth/callback` est publique** (`server/src/app.ts:120-121`) : Google y renvoie le navigateur.
- **Le `state`** est lu, effacé, puis jugé frais : dix minutes (`server/src/google/oauth.ts:27`, `:134-138`). Sans
  `state` frais ou sans `code` : un JSON 400, « Retour Google invalide ou expiré, recommencer » (`:139-140`). Le
  paramètre `error` n'est pas lu : un refus (`?error=access_denied&state=…`) tombe là.
- **L'échange du code** (`:142-153`) : refusé par Google, un JSON 400, « Google a refusé l'autorisation »
  (`:154-156`). Un réseau coupé, ou une réponse qui n'est pas du JSON, lève : la page affiche `{ error }` en 500 avec
  le message tel quel (`app.ts:139`).
- **Les jetons sont enregistrés avant la lecture du profil** (`oauth.ts:157-164`). Si cette lecture échoue (l'API
  Gmail non activée sur le projet, par exemple), la page affiche en 500 le message de Google (`GoogleApiError`,
  `server/src/google/client.ts:45-52`, `:172-181`). Les jetons nouveaux ont déjà remplacé ceux d'avant (une seule
  ligne, `client.ts:54-62`), sans adresse ; `google.account` n'a pas changé, donc les données d'un compte restent
  avec les jetons d'un autre (`oauth.ts:165-167`). Lu, pas constaté.
- **Le succès** redirige vers `/?google=connected` (`:168`). L'app remplace l'adresse par `#/reglages`
  (`app/src/App.svelte:33-35`). Les Réglages s'ouvrent alors sur « Tri par l'IA » : `start` vaut `'tri'` par défaut
  (`views/src/lib/settings/Settings.svelte:52-65`, `:123-127`), et l'app ne passe que `'pina'` (`App.svelte:59`,
  `:272-277`). Lu, pas vu dans Chrome.
- **Le parcours** : « Connecter un compte Google » ouvre la page de Google dans un nouvel onglet (`noopener`,
  `views/src/lib/settings/GoogleAccount.svelte:30-38`). Le retour arrive dans ce nouvel onglet ; le premier relit le
  statut quand il reprend le focus (`:46`).
- **Les tests qui figent le JSON** : `server/src/google/oauth.test.ts:59-63` (un `state` inconnu, 400) et `:79-87`
  (un `state` rejoué, 400). Le succès est tenu par `:65-77`, le changement de compte par `:108-120`.

### Le jeton illisible (#62)

- **`loadTokens`** (`server/src/google/client.ts:64-75`) déchiffre les deux jetons sans filet. `decrypt`
  (`server/src/crypto.ts:17-23`) lève sur une autre clé ou un texte abîmé.
- **Trois appelants** : le statut (`oauth.ts:101-104`), la déconnexion (`:120-131`) et chaque appel à Google
  (`accessToken`, `client.ts:141-143`). Le statut et la déconnexion répondent donc 500 (`app.ts:139`). La synchro
  lève à chaque passe, et `logError` ne tait que « non connecté » et « à renouveler » (`server/src/main.ts:85-90`) :
  une erreur au journal du serveur à chaque passe.
- **L'écran** n'affiche « Connecter un compte Google » que si le statut a été lu (`GoogleAccount.svelte:56-77`) ;
  sinon « Vérification… » et l'erreur dessous (`:22-28`, `:78`), sans issue.
- **Le précédent** : une clé d'IA illisible laisse la place à celle du `.env` (`server/src/llm/keys.ts:84-91`).
- **Ce qui suit un « non connecté » existe déjà** : `GoogleNotConnectedError` (`client.ts:38-43`) arrête le tri sans
  compter d'essai (`pipeline.ts:318-323`), et la synchro le tait (`main.ts:88`). Reconnecter réécrit la ligne
  (`client.ts:54-62`) ; la même adresse garde les données (`oauth.ts:165-167`).
- **La démo** range ses jetons avec sa clé du moment (`server/src/demo/demo.ts:452`, `:469-473`). Le précédent d'un
  état à la demande : `DEMO_KEY=refused` (`server/src/demo/main.ts:18-21`, `demo.ts:595`).

## Ce que la lecture du code ajoute au cadrage

1. **Le succès doit ouvrir la carte Compte Google lui aussi** : il ouvre « Tri par l'IA ». C'est la même ligne que
   pour les erreurs.
2. **Deux retours en erreur de plus** : un réseau coupé à l'échange, et un profil illisible, chacun avec un message
   brut en 500. Le second laisse en plus les jetons d'un compte sur les données d'un autre. Lire le profil avec le
   jeton reçu, avant de rien enregistrer, ferme les deux.
3. **#62 ferait taire le serveur** : un jeton illisible compté comme absent, la synchro se tait (`main.ts:88`). Une
   ligne au démarrage dit pourquoi le compte apparaît déconnecté.
4. **La puce d'une proposition hors réception** reste dans les autres vues. Elle pèse dans le choix de #92.

## La décision de CrOliX : #92

**A. Régler la proposition au geste direct.** `afterUserAction` règle aussi la proposition d'un archivage, d'une
corbeille ou d'un spam, en `corrected` : `refused` veut dire « reste en réception », `accepted` « rangé là où l'IA
le disait ». L'annulation remet `pending` (l'état d'avant est pris avant le geste, `pipeline.ts:518`, puis remis,
`journal.ts:169-172`).

- Ne couvre que les gestes faits dans Acedia : ni Gmail sur le web, ni le téléphone, ni un filtre, ni un mail
  supprimé pour de bon, ni un rangement partiel.
- Un mail remis en réception depuis Gmail n'a plus de proposition, et le tri ne le reprend pas (`claim`).
- Pour ces gestes-là, la puce quitte les Archives et la Corbeille.

**B. Ne compter que les propositions d'un mail encore en réception (recommandé).** `pending` compte ce que compte
« À valider » : la vue `pending` de `viewFilter` (`store.ts:136-140`), en une requête sur `messages`.

- Couvre tous les cas : avec ou sans geste, dans Acedia ou non. Un mail supprimé n'est plus dans `messages`.
- Un mail revenu en réception revient dans le compte et dans « À valider », avec sa proposition.
- **« À valider » ne change pas** : elle ne montrait déjà que la réception, et le rail aussi. Le bilan rejoint ce que
  CrOliX voit à l'écran.
- Une ligne, sans écriture en base. La forme du contrat ne change pas : `pending` reste un nombre
  (`standards/contrat-satellite.md:54`).
- Reste la puce dans les autres vues (« Hors périmètre »), et des lignes `pending` en base pour des mails archivés,
  sans effet : un changement de compte les efface (`oauth.ts:66-92`).

**Recommandation : B.** C'est le seul choix qui tient sans geste, et il ne touche que le compte. Les tâches sont
écrites pour B. Avec A : la tâche 1 teste le statut après chaque geste et après son annulation ; la tâche 3 touche
`afterUserAction` (`pipeline.ts:515-521`) au lieu de `catalog.ts`. Le reste du plan ne dépend pas de ce choix.

## Les choix retenus

1. **Le bilan (#92, choix B).** La première requête de `pending` compte les `messages` qui passent
   `viewFilter('pending')`. Les cartes, `received` et `done` ne changent pas.
2. **Le retour de Google (#84).** Le `state` est jugé d'abord ; puis `error`, le `code`, l'échange et le profil.

   | Cas | Redirection |
   |---|---|
   | `state` frais, jetons et profil lus | `/?google=connected` (inchangé) |
   | `state` frais, `error=access_denied` | `/?google=refused` |
   | `state` frais ; autre `error`, ou ni `code` ni `error` ; échange en échec ; profil illisible | `/?google=failed` |
   | `state` inconnu, déjà servi ou de plus de dix minutes, avec ou sans `error` | `/?google=expired` |

   - **Un message précis seulement pour un `state` frais** : Google renvoie le `state` avec son erreur (RFC 6749,
     § 4.1.2.1). Sans lui, n'importe qui peut forger l'adresse : le message générique.
   - **Les textes proposés**, dans la carte Compte Google. `refused` : « Connexion annulée sur la page de Google.
     Rien n'a changé. » `failed` : « Google n'a pas confirmé la connexion. Rien n'a changé : recommencer. »
     `expired` : « Ce retour de Google n'est plus valable. Rien n'a changé : recommencer la connexion. » `connected` :
     aucun, le badge dit « Connecté ». « Rien n'a changé » est vrai aussi quand un compte était déjà branché. La
     relecture et CrOliX peuvent reprendre ces textes.
   - **Le profil se lit avec le jeton reçu, avant `saveTokens`**, qui prend alors l'adresse (`client.ts:56-60`). Un
     échec n'enregistre rien : le compte d'avant reste branché, ses données aussi.
   - **Une ligne au journal du serveur** pour un échange ou un profil en échec : le code HTTP, ou « Google
     injoignable ». Jamais le corps, jamais les paramètres de l'adresse.
   - **L'app** lit le code une fois, ouvre Réglages › Compte Google (au téléphone, la page, pas la liste) et passe le
     code à la carte. La carte n'affiche que les trois codes d'erreur connus, par `Object.hasOwn` (un accès direct
     lirait `constructor`). Un code inconnu : la carte, sans message. Le message part au clic sur « Connecter un
     compte Google », et quand on quitte les Réglages.
   - **Le ton** : le refus en ton neutre (`role="status"`) ; l'échec et le retour périmé comme l'erreur d'aujourd'hui
     (`role="alert"`, `GoogleAccount.svelte:78`, `:89-95`).
3. **Le jeton illisible (#62).** `loadTokens` rend `undefined` quand un jeton ne se déchiffre pas, comme `currentKey`
   (`keys.ts:85-90`). Seul le déchiffrement est rattrapé : une erreur de la base remonte. Le statut dit
   `{ connected: false }` ; la déconnexion efface la ligne sans appeler Google ; un appel à Google lève
   `GoogleNotConnectedError`. Au démarrage, si la ligne existe et ne se lit pas, une ligne : « Jeton Google illisible
   avec cette ACEDIA_SECRET_KEY : reconnecter le compte (Réglages, Compte Google). » **L'écran ne change pas** :
   « Non connecté » et le bouton existent déjà.
4. **La démo** gagne `DEMO_GOOGLE=unreadable`, comme `DEMO_KEY=refused`, pour voir #62 dans Chrome.

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit rouges ; un développeur écrit le code ; le
**reviewer** relit le diff. Une tâche se ferme sur les barrières d'Acedia au vert : `npm test`, `npm run lint`,
`npm run typecheck`, `npm run format:check`, `npm run check:colors`. lun-docs : `npm run check`.

**L'ordre.** **1 et 2 partent en parallèle** (serveur, écran : aucun fichier commun). 3 attend 1, 4 attend 2 ; **3 et
4 partent en parallèle** (aucun fichier commun ; la table des codes plus haut est leur seul accord). 5 attend 3 et 4,
6 attend 5, 7 ferme le chantier. **Seuls les tests du bilan attendent la décision de CrOliX** : #84 et #62 peuvent
partir avant.

1. - [ ] **Les tests du serveur, rouges** (`testeur` ; `server/src/contract/digest.test.ts`,
   `server/src/google/oauth.test.ts`, `server/src/google/client.test.ts`, `server/src/demo/demo.test.ts`).
   - **Le bilan (#92)**, dans `digest.test.ts` (son `setup()`, `:8-34`, et l'`INSERT` de `:57-61`) : des propositions
     `pending` pour un mail en réception, un mail archivé (`labelIds` sans `INBOX`), un en corbeille (`INBOX` et
     `TRASH`), un en spam, et une dont le mail n'est pas dans le cache. Les trois premiers sont **dans le cache avec
     leurs étiquettes** (la synchro du faux Gmail, ou `upsertMessage`) : absents, ils passeraient sans le code.
     `pending` vaut 1 ; `received` et `done` comme avant. Rouge sur `main` : 5.
   - **Le geste réel** : un mail en réception et sa proposition ; `POST /api/mail/batch` avec
     `{ ids, op: { kind: 'archive' } }` (comme `server/src/triage/journal.test.ts:203-205`) ; `pending` baisse de 1 ;
     `POST /api/journal/<id>/undo` (comme `journal.test.ts:36-39`) le remet. Rouge sur `main` après l'archivage.
   - `:51-72` reste vert sans changement.
   - **Le retour de Google (#84)**, dans `oauth.test.ts` (son `harness()`, `:17-34` ; l'horloge par `advance`,
     `server/src/testing/harness.ts:51`) :
     - `error=access_denied` et un `state` frais : 302 vers `/?google=refused` ; aucun appel à `TOKEN_URL` ; le même
       `state` rejoué donne `expired`.
     - un `state` inconnu, rejoué, ou de plus de dix minutes, avec `code` ou avec `error=access_denied` : 302 vers
       `/?google=expired`. Réécrit `:59-63` et `:79-87`.
     - un `state` frais avec `error=invalid_scope`, ou sans `code` ni `error` : `failed`.
     - l'échange en 400, une réponse sans `refresh_token`, un échange qui lève (le gestionnaire jette) : `failed`, sans
       ligne `google_tokens` nouvelle.
     - le profil en 403, un compte déjà branché : `failed` ; `GET /api/google/status` dit toujours ce compte et son
       adresse ; ses règles restent.
     - **rien de recopié** : `error=<b>x</b>&error_description=<b>y</b>`, avec un `state` frais puis non frais :
       `location` vaut exactement l'une des quatre adresses, et le corps ne contient ni `x` ni `y` balisés.
     - verts sans changement : `:65-77` (le succès), `:108-120` (un autre compte efface les données).
   - **Le jeton illisible (#62)** :
     - jetons rangés avec une autre clé (`saveTokens(h.db, autreCle, …)`), puis un texte abîmé (`'x.y.z'` dans
       `access_token`) : `GET /api/google/status` rend 200 `{ connected: false }`.
     - `POST /api/google/disconnect` : 200 ; la ligne `google_tokens` a disparu ; aucun appel à la révocation.
     - reconnecter ensuite (le `connect()` du harnais, même adresse) : `connected: true`, les règles gardées.
     - `client.test.ts` : `request` avec un jeton illisible lève `GoogleNotConnectedError`, sans appel réseau.
     - `demo.test.ts` : `createDemo({ googleUnreadable: true })`, puis le statut : `{ connected: false }`.
   - **Exclu** : le code ; l'écran ; un test de `main.ts` (une ligne de journal).
   - **Preuve** : chaque nouveau test échoue sur `main` pour la bonne raison (un JSON 400 ou un 500 au lieu d'un 302,
     un 500 au lieu de `connected: false`, 5 au lieu de 1).

2. - [ ] **Les tests de l'écran, rouges** (`testeur` ; `app/src/App.test.ts`,
   `views/src/lib/settings/Settings.test.ts`).
   - **L'app** (son `fakeServer()`, le jeton posé comme `App.test.ts:266-267`) : `/?google=refused`, `failed`,
     `expired` ouvrent la page Compte Google (le `h2`) et son message, dans la carte « Compte Google » ;
     `window.location.search` est vide, le hash vaut `#/reglages`. `connected` : la page, sans message.
     `/?google=constructor` et `/?google=%3Cb%3Ex%3C%2Fb%3E` : la page, aucun message, rien de `x`. Aller au Mail puis
     revenir aux Réglages : plus de message.
   - **Les Réglages** (le `open()` de `Settings.test.ts:43-58` ne prend pas de props : l'étendre d'un argument) :
     `start: 'google'` ouvre la page Compte Google. `googleNotice: 'refused'` : le message en `role="status"` ;
     `failed`, `expired` : en `role="alert"`. Un clic sur « Connecter un compte Google » le retire.
   - **#62 à l'écran** : `{ connected: false }` montre le bouton, déjà tenu par `Settings.test.ts:403-413`. Rien à
     ajouter.
   - **Exclu** : le code ; le serveur ; le style et le téléphone (Chrome, tâche 6).
   - **Preuve** : les nouveaux tests échouent sur `main` (les Réglages s'ouvrent sur « Tri par l'IA », aucun message).

3. - [ ] **Le serveur** (`dev-core`, ici pour le serveur d'Acedia). Après 1. Trois parties sans fichier commun.
   - **#92** (`server/src/contract/catalog.ts`) : à `:474-476`, la première requête compte les `messages` qui passent
     `viewFilter('pending')!.where`. Rien d'autre dans le bilan.
   - **#84** (`server/src/google/oauth.ts`, le callback `:133-169`) : la table des choix. Le `state` est effacé avant
     tout, comme `:137`. L'échange et le profil dans un `try` ; le profil par `google.fetch(PROFILE_URL)` avec le jeton
     reçu en `authorization`, avant `saveTokens(…, { …, email })` ; l'`UPDATE` de `:164` disparaît, et
     `createGoogleClient` de ce fichier s'il ne sert plus. La ligne au journal du serveur, sans rien de reçu. Le reste
     (`forgetAccountData`, `google.account`) ne change pas.
   - **#62** (`server/src/google/client.ts`, `server/src/main.ts`) : `loadTokens` rattrape les deux `decrypt` et rend
     `undefined`, avec une ligne qui dit pourquoi. Dans `main.ts`, après `googleFromEnv` (`:45-48`), la ligne du
     démarrage : une requête sur `google_tokens` suffit, sans nouvelle fonction exportée.
   - **La démo** (`server/src/demo/demo.ts`, `server/src/demo/main.ts`) : l'option `googleUnreadable` range de
     nouveau les jetons avec une autre clé, à la fin, près de `:595` ; `DEMO_GOOGLE=unreadable` la donne, comme
     `DEMO_KEY` (`main.ts:18-21`).
   - **La doc** : `docs/pina.md:70-71` dit que `pending` compte les propositions d'un mail encore en réception et les
     cartes en attente du jour. `docs/brancher-google.md`, § 3 (`:38-41`) : le retour ouvre Réglages › Compte
     Google, avec un message s'il échoue ; un jeton rangé avec une autre `ACEDIA_SECRET_KEY` compte comme non
     connecté, et il suffit de reconnecter.
   - **Exclu** : `store.ts` ; `pipeline.ts` (avec B) ; l'annulation ; le contrat et `standards/contrat-satellite.md` ;
     le ménage de `oauth_states` ; les routes du mail quand Google n'est pas branché ; l'écran.
   - **Preuve** : les tests de la tâche 1 au vert ; les barrières au vert.

4. - [ ] **L'écran** (`dev-front` ; `app/src/App.svelte`, `views/src/lib/settings/Settings.svelte`,
   `views/src/lib/settings/GoogleAccount.svelte`). Après 2. Avec la DA de `lun-design`.
   - **L'app** : `:34-35` garde le code lu (`params.get('google')`) et pose `settingsStart = 'google'` ; le type de
     `:59` prend `'google'` ; le code s'efface avec `settingsStart` en quittant les Réglages (`:70`) ; il passe aux
     Réglages (`:272-277`). Le commentaire de `:33` dit la nouvelle règle.
   - **Les Réglages** : `start` prend `'google'` (`:60`) ; une prop facultative `googleNotice`, passée à la carte
     (`:318`). Facultative : rien ne casse pour qui importe le paquet.
   - **La carte** : une prop facultative ; les trois textes, `Object.hasOwn` et le ton de « Les choix retenus » ; le
     message part dans `connect()` (`:30-38`). Couleurs par les variables (`check:colors`).
   - **Exclu** : le kit (`views/src/lib/ui/*`) ; `GoogleStatus` ; « Vérification… » quand le statut échoue pour une
     autre raison ; les autres pages des Réglages ; le serveur.
   - **Preuve** : les tests de la tâche 2 au vert ; les barrières au vert.

5. - [ ] **La relecture** (`reviewer`). Après 3 et 4. Le diff entier contre ce plan et `standards/` : rien de ce que
   Google envoie dans une adresse, un corps ou le journal du serveur ; un code inconnu n'affiche rien ; aucun jeton
   enregistré avant le profil ; `loadTokens` ne rattrape que le déchiffrement ; #92 ne touche que le compte ; aucune
   couleur en dur. Les corrections reviennent au développeur de la tâche, tests relancés.

6. - [ ] **La preuve dans Chrome** (`dev-front`). Après 5.
   - **La démo**, dans le worktree d'Acedia : `npm run build`, puis `npm run demo` (`README.md:42-50`). Base en
     mémoire, faux Gmail, aucun réseau côté serveur, port 8797 ; coller dans la console le jeton qu'elle affiche.
     **Jamais la prod** : elle a les vrais mails de CrOliX. **Ne pas cliquer « Connecter un compte Google »** dans la
     démo : il ouvre la vraie page de Google avec un client inventé.
   - **Un `state` frais**, depuis la console de la page :
     ```js
     const t = localStorage.getItem('lunacedia.token');
     const { url } = await (await fetch('/api/google/auth-url', { headers: { authorization: `Bearer ${t}` } })).json();
     new URL(url).searchParams.get('state');
     ```
   - **Les retours joués à la main**, chacun à 1280 px et à 390 px (émulation des DevTools) :
     `/oauth/callback?error=access_denied&state=<frais>` ouvre Compte Google, « Connexion annulée… », le badge
     toujours « Connecté » (la démo l'est). La même adresse rejouée : le message générique. Un `state` neuf et
     `code=x` : `failed` (le faux `fetch` de la démo n'a pas de point d'échange, `server/src/testing/fake-fetch.ts:32`).
     Un `state` neuf et `error=%3Cb%3Egras%3C%2Fb%3E` : `failed`, rien de « gras » à l'écran. `/?google=constructor` :
     la page, sans message.
   - **Le jeton illisible** : arrêter la démo, puis dans PowerShell, une commande par ligne :
     `$env:DEMO_GOOGLE = 'unreadable'`, puis `npm run demo`. Compte Google : « Non connecté » et le bouton, pas de
     « Vérification… » ; dans l'onglet Réseau, `GET /api/google/status` en 200. `POST /api/google/disconnect` depuis la
     console : 200. Ensuite `Remove-Item Env:DEMO_GOOGLE`.
   - **Le bilan** : relever `pending` par `POST /lun/v1/actions/day.digest` depuis la console (même jeton, le corps
     `{ since, until }` du jour) ; archiver depuis le Mail un mail d'« À valider » (quatre dans la démo,
     `server/src/demo/demo.test.ts:81`) : `pending` et « À valider » baissent de 1 ; l'annulation depuis le Journal
     les remet.
   - **Relevé** dans la PR : captures à chaque largeur, données de la démo seulement.

7. - [ ] **La livraison** (`livreur`). Une PR en brouillon par dépôt, au gabarit de `lun-livrer` : Lun'Acedia (ferme
   lun-acedia#92, lun-acedia#84 et lun-acedia#62) et lun-docs (ce plan, ses coches ; la ligne de lun-acedia#62 dans
   la feuille de route, `2026-11-07-feuille-de-route-mvp.md:432`, renvoie à ce plan).

## Hors périmètre

- **La puce d'une proposition hors réception** (Archives, Corbeille, une boîte : `MailRow.svelte:113-120`), et V qui
  la valide depuis la boîte (`Mailbox.svelte:373`). Inchangé ; une issue si CrOliX le veut.
- **Régler une proposition quand la synchro voit son mail parti.** Avec B, le compte n'en a plus besoin.
- **« Vérification… » quand le statut échoue pour une autre raison** (le serveur injoignable) : l'erreur s'affiche
  dessous, et le focus relit le statut (`GoogleAccount.svelte:46`).
- **Les deux onglets après la connexion** : le retour arrive dans l'onglet ouvert pour Google. Inchangé.
- Ce que Google montre à un autre compte que le créateur d'un projet Personnel (`client_user_mismatch`) : pas
  constaté ; s'il revient par `error`, il tombe dans `failed`.
- Le ménage de `oauth_states`, le contrat, Lun'Avaritia, le déploiement sur le NAS.

## Limites

- **Lu dans le code, pas vu dans Chrome** : le succès qui ouvre « Tri par l'IA » ; la puce hors réception ; le profil
  qui échoue après l'enregistrement des jetons. Les tâches 2 et 6 les verront.
- **Jamais avec un vrai compte Google** : un refus réel, un échange réel, l'API Gmail non activée. Les retours sont
  joués à la main sur la démo, l'échange refusé et le profil en 403 seulement par les tests.
- **Le texte exact du refus côté Google** (`access_denied`) vient de la RFC et de la doc de Google, pas d'un essai.
- **Avec B, des propositions `pending` restent en base** pour des mails partis. Sans effet sur l'écran ni le
  bilan ; un mail revenu les retrouve.
- **Un jeton illisible ne se révoque pas chez Google** : la déconnexion efface la ligne seulement. L'ancien accès reste
  listé dans le compte Google de CrOliX jusqu'à ce qu'il le retire, ou qu'une reconnexion le remplace.
- **« Restaurer une copie »** (lun-docs, `docs/mise-en-service-desktop.md:204`, au § 9) dit de garder la même clé :
  c'est toujours vrai. Avec une autre, Google demande une reconnexion et les clés d'IA reviennent à celles du `.env`.
