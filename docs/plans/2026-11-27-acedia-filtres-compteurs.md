# Lun'Acedia : les filtres « Tout / Non lus » et les nombres de non lus. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-acedia#120 (`niveau:standard`). Les suites, hors périmètre : lun-acedia#121.
>
> **État :** rédigé, contesté et amendé le 27/11, **validé par CrOliX le 27/11** avec les trois avis de « À
> trancher ». Exécuté le même jour : Lun-Ecosystem/lun-acedia#123 (voir « Exécution »). Reste la tâche 7.
>
> **Source :** le tour des filtres et des compteurs du 27/11 et les quatre décisions de CrOliX du même jour, dans
> les commentaires de #120. Elles ne se rouvrent pas ici.
>
> Code relu sur `main` de lun-acedia, `0fa1c06` (0.4.0, en service). Le graphe d'abord, puis chaque point dans le
> code. Les lignes citées sont à ce commit.

**But :** dans la liste des mails, on choisit une zone (la Réception ou une boîte), puis « Tout » ou « Non lus »,
de la même façon au bureau et au téléphone. Le serveur filtre les non lus et les compte dans la base de
Lun'Acedia. Chaque boîte porte son nombre de non lus.

## Critères de fin

Ceux de #120, à jour de la validation du 27/11 (les critères 2 et 5 ont changé avec le point 2 de « À trancher »).

- [x] Les filtres de la liste des mails sont « Tout / Non lus », les mêmes au bureau et au téléphone. « Proposés »
      n'existe plus.
- [x] « Non lus » filtre la zone ouverte (la Réception ou une boîte), et c'est le serveur qui filtre : un non lu
      de la base situé au-delà de la première page de la zone s'affiche sans charger la suite.
- [x] Au téléphone, « Non lus » n'est plus dans la rangée des zones, et une seule zone est allumée à la fois.
- [x] Chaque boîte porte son nombre de non lus, dans le rail et en pastille ; pas de nombre à zéro. Le nombre suit
      une lecture, un « marquer non lu » et l'arrivée d'un mail.
- [x] Les nombres de la Réception, de « Non lus » et des boîtes sont comptés dans la base de Lun'Acedia, sans « + ».
- [x] Prouvé en local : les tests, et la démo rejouée au bureau et à 390 px.

| Dépôt | Branche | Issue | Niveau |
| --- | --- | --- | --- |
| lun-acedia | `feat/filtres-compteurs` | #120 | standard |
| lun-docs | `docs/acedia-filtres-compteurs` | #120 (ce plan) | standard |

## Ce que le code fait aujourd'hui

**Le serveur.**

- `server/src/gmail/store.ts:126` : `viewFilter(view)` rend la condition SQL de chaque zone ; `box:<id>` exclut
  la corbeille (l. 149-153). `viewQuery(view)` (l. 160) rend la requête Gmail de la même zone, au-delà du cache.
- `store.ts:118` : `PAGE_SIZE = 50`. `listView` (l. 194) pagine par `(internal_date, id)`.
- La colonne `messages.unread` existe (`store.ts:29`), tenue à chaque écriture (l. 87 et 96). Aucune requête ne
  filtre ni ne compte par non lu.
- `server/src/gmail/read.ts:147` : `listMail(db, google, view, cursor)` lit le cache, puis Gmail par `gmailPage`
  (l. 116) quand le cache est épuisé, sauf si `gmail.complete` vaut `1` (l. 159).
- `server/src/gmail/sync.ts:105` et `:139` : `gmail.complete` ne s'écrit qu'à une reprise entière (la première
  connexion, ou un point d'historique perdu chez Gmail). Il vaut `1` seulement si la messagerie tient sous 500
  mails récents et 100 mails de spam et de corbeille. Sur une vraie messagerie, il reste à `0`.
- Le cache n'est pas une fenêtre continue. La synchro y ajoute chaque mail reçu, et rien ne le purge. La
  recherche, la lecture d'un mail et la descente vers Gmail y déposent aussi des mails anciens, isolés
  (`read.ts:86`, `:174`). Relevé par la contestation, non rejoué.
- `server/src/gmail/routes.ts:45-64` : `GET /api/mail` lit `q`, `cursor`, `view` ; `q` l'emporte sur `view`.
  `GET /:id` est déclarée juste après (l. 66).
- `server/src/contract/parity.test.ts:6` : toute route `/api` doit avoir son entrée dans `PARITY`
  (`server/src/contract/parity.ts:13`), une action du catalogue ou une exclusion motivée. L'action `mail.list` du
  catalogue (`server/src/contract/catalog.ts:353-371`) appelle `listMail` sans filtre.
- Une lecture faite dans Acedia met le cache à jour tout de suite (`server/src/gmail/actions.ts:68` et `:90`). La
  synchro suivante n'y voit donc aucun changement et n'émet pas `mail.changed` (`sync.ts:223`). Déduit du code.

**Les écrans.**

- `views/src/lib/mail/Mailbox.svelte:79-85` : `shown` filtre « Non lus » et « Proposés » parmi les mails chargés.
- `Mailbox.svelte:464-474` : au téléphone, les pastilles « Réception », « Non lus », puis une par boîte.
  « Réception » s'allume si `filter === 'tout'` ; « Non lus » s'allume en plus de la boîte ouverte.
- `Mailbox.svelte:485-506` : au bureau, `Tabs` « Tout », « Non lus », « Proposés », comptés sur les mails chargés.
  Le CSS (l. 663-686) cache les onglets et montre les pastilles sous 768 px.
- `Mailbox.svelte:159` : `select()` remet le filtre à « Tout ». `Mailbox.svelte:207-211` : ouvrir un non lu le
  marque lu sans appeler `onchange`, donc sans rafraîchir le rail.
- `Mailbox.svelte:375-383` : le raccourci C se rabat sur `.onglets` quand la ligne n'est pas à l'écran.
- `views/src/lib/mail/MailboxNav.svelte:39-47` : les `NavLink` des boîtes ne reçoivent pas de `count`.
  `NavLink` l'accepte (`views/src/lib/ui/NavLink.svelte:18`) et le cache à zéro (l. 45). `MailboxNav` sert aussi
  au rail de « À valider » (`views/src/lib/mail/Pending.svelte:393`).
- `views/src/lib/ui/Chip.svelte:11` et `views/src/lib/ui/types.ts:79` (`TabItem`) : `count` est un nombre seul,
  affiché même à zéro. Le kit d'Acedia est le sien, pas une copie de lun-docs.
- `app/src/shell/status.ts:51-62` : le nombre du rail « Réception » compte les non lus de la première page, avec
  « + » s'il y a une page de plus. `app/src/App.svelte:134-157` relit ces nombres sur `mail.*`, `key.*`,
  `credit.*`, `google.*` et à chaque `onchange` d'un écran (l. 241-279).
- `views/src/testing/fake-client.ts:103` : le faux client ignore tout filtre. La démo
  (`server/src/demo/demo.ts:601`) livre ses mails lus ou non lus par le faux Gmail : sa messagerie est petite,
  `gmail.complete` y vaut `1`.

## Les choix

Écrits sur l'avis du point 2 de « À trancher » : sous « Non lus », la liste et les nombres ne lisent que la base.

1. **Le filtre est un paramètre** : `GET /api/mail?view=…&unread=1`. `listMail` ajoute `AND unread = 1` à la
   condition de la zone et ne descend pas vers Gmail : la liste s'arrête à la fin de la base. Le curseur reste le
   même ; le client renvoie `unread=1` avec chaque page.
2. **Les nombres ont leur route** : `GET /api/mail/counts` rend `{ inbox, boxes: { <id>: n } }`, en une seule
   requête groupée pour toutes les boîtes. Chaque nombre compte `viewFilter(zone)` plus `unread = 1` : la liste
   filtrée et le nombre ont la même condition et la même source. Une route à part plutôt qu'un champ de
   `/api/labels` : les boîtes se lisent une fois, les nombres à chaque geste.
3. **La parité** : la route est exclue du catalogue, motif « Nombres des écrans ; l'agent lit les mails par
   mail.list ». `mail.list` ne gagne pas de filtre : rien ne change au contrat lu par le core.
4. **Pas de « + »** : un nombre est un nombre. Un formateur unique, dans `views/`, rend `undefined` pour 0 (une
   chaîne vide ferait une pastille vide dans `Chip` et `Tabs`), sinon `n`. Le rail, les pastilles et l'onglet
   « Non lus » s'en servent. `count` reste un nombre dans le kit d'Acedia : rien ne s'y élargit.
5. **Qui lit les nombres** : l'écran des mails et celui de « À valider » lisent la route au montage, sur un
   événement `mail.*` (même pendant une lecture) et après chaque geste. Ouvrir un non lu appelle désormais
   `onchange`, **après** la réponse de `markRead` : avant, le nombre relu serait périmé. Le rail « Réception »
   (`status.ts`) lit la même route au lieu de la première page.
6. **Le nombre de « Non lus »** est celui de la zone ouverte. Sur un dossier Gmail (Archives, Envoyés…) et dans
   la zone « À valider » ouverte dans la liste, le filtre marche, l'onglet ne porte pas de nombre.
7. **Au téléphone** : les onglets « Tout / Non lus » du bureau (`Tabs`, déjà là) s'affichent aussi, sous la
   rangée des zones. La rangée ne garde que « Réception » et les boîtes ; « Réception » s'allume par la zone seule.
   Voir « À trancher », point 1.
8. **Ce qui sort** : l'onglet « Proposés », son filtre dans `shown`, et le filtre local de « Non lus ». `shown`
   devient `items`.
9. **Changer de zone remet « Tout »**, comme aujourd'hui (`select()`, `Mailbox.svelte:162`). Testé en tâche 3.
10. **Pendant une recherche**, les onglets « Tout / Non lus » ne s'affichent pas : la ligne « Résultats pour… »
    reste seule. La recherche lit tout Gmail, hors de la base. Voir « À trancher », point 3.

## À trancher par CrOliX

**Tranché le 27/11 : les trois avis sont retenus.**

1. **La place de « Non lus » au téléphone.** Avis : les mêmes onglets qu'au bureau, sous les pastilles des
   zones (choix 7). C'est le seul composant déjà là qui dise « filtre » et pas « destination ». L'autre voie :
   une pastille « Non lus » à part, au bout de la rangée, séparée par un trait.
2. **« Non lus » ne lit que la base de Lun'Acedia, et le « + » disparaît.** La décision 3 supposait une reprise
   qui finit. Elle ne finit pas : au-delà de 500 mails à la connexion, la base n'est jamais dite complète
   (`sync.ts:105`). Garder le « + », c'est le voir pour toujours sur chaque nombre, Réception comprise, sans qu'il
   dise rien : « 12+ » peut cacher trois non lus anciens ou trois mille. Avis : la liste « Non lus » et les
   nombres portent sur ce que la base tient, soit les 500 mails d'avant la connexion et tout ce qui est arrivé
   depuis. Le nombre et la liste sont alors toujours d'accord, sans aucun appel à Google. **Ce que cela enlève** :
   un non lu plus ancien que la base n'est ni compté ni listé sous « Non lus » ; il reste visible sous « Tout »,
   en descendant par « Mails plus anciens ». L'autre voie : garder le « + » et faire descendre « Non lus » vers
   Gmail. Elle coûte un filtre de plus côté Gmail, un faux Gmail à étendre pour les tests, et une incohérence
   qui reste : une boîte sans nombre dont « Non lus » liste pourtant des centaines de vieux mails.
3. **« Non lus » pendant une recherche.** Aujourd'hui l'onglet filtre les résultats sur place. Avis : pas de
   filtre pendant une recherche (choix 10). L'autre voie : ajouter « non lu » à la recherche Gmail.

## Tâches

Les tests d'abord, vus en échec, puis le code (`standards/qualite.md`, « Tests »). Les tâches 1 et 2 partent en
parallèle : la forme de la route est fixée par le choix 2. Les tâches 3 et 4 partent en parallèle après la 2.

- [x] **1. Le serveur : filtrer et compter.** Tests : agent `testeur`. Code : un agent développeur généraliste.
  - Fichiers : `server/src/gmail/store.ts`, `read.ts`, `routes.ts`, `server/src/contract/parity.ts`.
  - Comportement : `listMail(…, { unread })` ; `GET /api/mail` lit `unread=1` ; `GET /counts` déclarée avant
    `GET /:id` ; une fonction de comptage dans `store.ts`, une requête groupée, sur la condition de `viewFilter`.
  - Tests (`routes.test.ts`) : la Réception filtrée ne rend que des non lus ; un non lu au 51e rang sort en
    première page ; la liste filtrée s'arrête à la fin de la base, sans appel à Gmail, même reprise incomplète ;
    les nombres de la Réception et de chaque boîte, sans la corbeille ; `/counts` n'est pas lue comme un mail.
    `parity.test.ts` passe avec l'entrée exclue.
  - Exclu : le catalogue, `mail.list`, la recherche.
  - Preuve : `npm test` vert, sortie dans la PR.
- [x] **2. Le client, les types, le faux client, le formateur.** Agent `dev-front`, tests par `testeur`.
  - Fichiers : `views/src/lib/client.ts`, `views/src/lib/types.ts`, `views/src/testing/fake-client.ts`,
    `views/src/lib/mail/format.ts`, `views/src/lib/index.ts`.
  - Comportement : `listMail(view, { q, cursor, unread })`, `mailCounts()` ; le type `MailCounts` ; le faux
    client filtre et compte comme le serveur (ses boîtes excluent la corbeille, `fake-client.ts:92-99`) ; le
    formateur du choix 4, exporté pour `app/`. Sans `mailCounts` dans le faux client, chaque test qui monte
    `Mailbox`, `Pending` ou `readStatus` casse : il vient en premier.
  - Tests : le formateur (0 rend `undefined`, sinon le nombre) ; l'adresse appelée avec `unread=1`.
  - Preuve : `npm test` vert.
- [x] **3. L'écran des mails.** Agent `dev-front`, tests d'abord par `testeur` (`Mailbox.test.ts`).
  - Fichiers : `Mailbox.svelte`, `MailboxNav.svelte`, `Pending.svelte`, `MailList.svelte` si besoin.
  - Comportement : choix 5 à 10. Les onglets « Tout / Non lus » rechargent la zone par le serveur ; « Mails plus
    anciens » suit le curseur filtré. Les boîtes du rail et leurs pastilles portent leur nombre, la pastille
    « Réception » aussi. Une seule pastille allumée. La classe `.onglets` reste, pour le raccourci C.
  - Tests : « Proposés » absent ; « Non lus » appelle `listMail` avec `unread` ; un non lu hors des mails chargés
    s'affiche ; une boîte sans non lu n'a pas de nombre ; le nombre baisse après ouverture d'un non lu, une fois
    `markRead` répondu, et remonte après « marquer non lu » ; un événement `mail.changed` relit les nombres ;
    changer de zone remet « Tout » ; pendant une recherche, pas d'onglets.
  - Preuve : `npm test` vert ; la vérification à 390 px se fait en tâche 5.
- [x] **4. Le rail « Réception ».** Agent `dev-front`, tests par `testeur` (`app/src/shell/status.test.ts`).
  - Fichiers : `app/src/shell/status.ts`, son test.
  - Comportement : `counts.inbox` vient de `mailCounts()`, par le formateur. `counts.pending` et `counts.tasks`
    ne changent pas. Une lecture qui échoue garde la dernière valeur, comme aujourd'hui.
  - Tests : les deux premiers cas existants réécrits sur la route ; rien à zéro.
  - Preuve : `npm test` vert.
- [x] **5. La preuve sur la démo.** Agent `dev-front`.
  - `npm run build`, puis `npm run demo` (port 8797), dans Chrome, au bureau (1280 px) et à 390 px.
  - Rejouer : « Non lus » dans la Réception, puis dans une boîte sans non lu ; ouvrir un non lu et voir le nombre
    baisser ; « marquer non lu » ; changer de zone sous « Non lus ».
  - Captures dans la PR : les deux largeurs, un rail avec des nombres, une boîte sans nombre. Sur la démo du
    27/11, « Voyages » n'a aucun non lu et les quatre autres boîtes en ont un : à revérifier après le tri.
- [x] **6. La relecture** du diff contre ce plan et les standards (agent `reviewer`), puis la PR en brouillon.
- [ ] **7. La version 0.4.1**, préparée seulement à la demande de CrOliX. Il la publie et la déploie lui-même.

## Exécution

Le 27/11, dans Lun-Ecosystem/lun-acedia#123. Écarts avec les tâches écrites :

- **Pas d'agent `testeur` à part.** Chaque développeur a écrit ses tests d'abord, vus en échec, puis son code ;
  une seule relecture à la fin. Deux agents en parallèle : le serveur, puis le client, l'écran et le rail.
- **`MailCounts` vit dans `server/src/types.ts`**, et `views/src/lib/types.ts` en est la copie
  (`npm run sync-types`). La tâche 2 le rangeait parmi les fichiers écrits à la main : un test veut la copie
  exacte.
- **Les boîtes du faux client n'excluaient pas la corbeille**, contrairement à ce que dit la tâche 2 : corrigé.
- **Pendant une recherche**, la ligne « Résultats pour… » garde la place des onglets ; le raccourci C y trouve
  toujours son repli.
- **La relecture** n'a rien trouvé de bloquant. Corrigé : un clic sur « Mails plus anciens » pendant le
  chargement de « Non lus » renvoyait le curseur de « Tout » et mêlait deux listes (test ajouté) ; la lecture
  des nombres ne garde que la dernière demandée.
- **La preuve sur la démo** est un relevé du DOM à 1280 px et à 390 px, dans la PR, sans capture jointe.
  « Marquer non lu » n'y est pas rejoué : il tient par ses tests.
- Barrières : 1274 tests verts, lint, typage, format, couleurs, build.

## Ce qui casse si on se trompe

- **Le comptage lit `label_ids` en JSON**, par `json_each`, sans index, sur une base qui grossit de chaque mail
  reçu : des dizaines de milliers de lignes en un an. D'où une seule requête groupée, et non une par boîte. Lu à
  chaque geste et à chaque `mail.*`. Rien de mesuré.
- **Un mail ouvert sous « Non lus »** reste dans la liste jusqu'au prochain chargement. Voulu : la ligne ne saute
  pas sous la main. Il sort au changement de zone ou sur `mail.changed`.
- **`/counts` déclarée après `/:id`** serait lue comme un mail nommé « counts » : le test de la tâche 1 l'appelle.
- **Les tests qui comptent sur l'ancien filtre** : `status.test.ts` (l. 9 et 23) lit la première page, à
  réécrire. Aucun test ne vise « Proposés » ni les pastilles de `Mailbox` (revérifié par la contestation).
- **Le raccourci C** cherche `.onglets` (`Mailbox.svelte:382`) : ne pas renommer la classe, et garder un repli
  quand les onglets sont cachés par une recherche.
- **Des mails anciens isolés dans la base** (venus d'une recherche ou d'une lecture) sont comptés et listés sous
  « Non lus » s'ils sont non lus. La liste et le nombre restent d'accord ; c'est la limite du point 2.

## Ce que la contestation a changé

Contesté le 27/11 par l'agent `plan-challenger` : aucune objection bloquante, « plan à amender ». Les citations
du code sont confirmées ligne à ligne.

- **Repris.** « Rien ne complète le cache » était faux : corrigé dans « Ce que le code fait ». Le « + » ne part
  jamais, et le faux Gmail ne connaît pas « non lu » : d'où l'avis du point 2, qui retire le « + » et le repli
  vers Gmail sous « Non lus ». Le critère 2 ne tenait que dans la base : dit sous les critères. « Non lus »
  pendant une recherche et le filtre au changement de zone n'étaient pas décidés : choix 9 et 10, point 3. Le
  formateur rend `undefined`. `onchange` après la réponse de `markRead`. Le faux client d'abord. Une seule
  requête de comptage. La zone « À valider » sans nombre.
- **Réfuté.** Borner la lecture de la base à la date du bas de la fenêtre des 500 : c'est un changement de la
  reprise, hors des quatre décisions. Le trou qu'il vise existe déjà sous « Tout » ; il part dans #121.
- **Sans objet si le point 2 est retenu.** Élargir `count` à une chaîne dans `Chip` et `TabItem` ; étendre le faux
  Gmail ; l'appel à Gmail à chaque synchro sous « Non lus ».

## Hors périmètre

- Tout #121 : les dossiers Gmail au téléphone, le Journal hors de la barre du bas, la recherche qui ignore la
  zone, les nombres voisins de « À valider » et de l'agent, ceux des Tâches, le titre de l'onglet et le badge de
  l'icône, les trois textes d'état vide.
- Un filtre « non lu » dans l'action `mail.list` du catalogue, donc pour le core et l'agent.
- Compléter la base au-delà de 500 mails, et le trou de la liste « Tout » entre la base et Gmail quand la base
  tient des mails anciens isolés. À noter dans #121.
- Un nombre de non lus sur les dossiers Gmail.
- La vitrine du kit (`app/src/catalogue/Catalogue.svelte:176-177` et `:529-532`), qui montre encore des onglets
  « Non lus » et « Proposés par l'IA » d'exemple : ce n'est pas un écran en service. À noter dans #121.

## Limites

- Rien n'est rejoué sur l'instance : la démo a une petite messagerie. Une base incomplète ne se voit qu'en test.
- Qu'une lecture faite dans Acedia n'émette aucun `mail.changed` est déduit du code (`actions.ts:68`,
  `sync.ts:191-223`), pas rejoué.
- Le coût du comptage n'est pas mesuré.
- La mise en page des onglets à 390 px n'est vue qu'à la tâche 5.
- Le trou de la liste « Tout » est relevé par la contestation dans le code (`read.ts:160-162`), pas rejoué.
