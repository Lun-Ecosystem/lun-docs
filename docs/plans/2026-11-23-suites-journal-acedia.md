# Suites du Journal : refuser une proposition, des compteurs justes, la corbeille hors de la réception. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** Lun-Ecosystem/lun-acedia#88 (refuser une proposition), Lun-Ecosystem/lun-acedia#89 (les compteurs du
> tri), Lun-Ecosystem/lun-acedia#90 (la corbeille reste en réception dans la démo). Toutes trois nées du chantier du
> Journal (Lun-Ecosystem/lun-acedia#86, fusionné le 23/11 par Lun-Ecosystem/lun-acedia#91). Dépôt public.
>
> **État : rédigé le 23/11 ; contesté le 23/11 (« à amender ») ; amendé le 23/11 avec quatre décisions de CrOliX et
> les objections du contradicteur. Pas encore validé.**
>
> Code relu sur `main` de Lun'Acedia (`1cd0c56`) ; le graphe d'abord, puis chaque point dans le code. Lun'Acedia est
> public : ce plan ne porte ni adresse, ni compte, ni nom d'hôte.

**But :** dans « À valider », CrOliX peut dire « non, pas ça » à une proposition sans ranger le mail, et le Journal le
dit. Les compteurs du jour suivent le découpage du Journal. Un mail mis à la corbeille ou en spam ne s'affiche plus en
boîte de réception ni dans « À valider ».

**Source :** les trois issues ; le plan fusionné du Journal (`docs/plans/2026-11-23-journal-acedia.md`) et ses deux
décisions (la règle courte des textes, un seul filtre par ligne, l'agent sous son nom) ; les décisions de CrOliX et
la contestation du 23/11 ; la documentation officielle de l'API Gmail.

## Critères de fin proposés

Chacun se prouve en local, sur la démo et par les tests.

1. **Refuser une proposition** depuis « À valider » : le mail ne bouge pas dans Gmail, la proposition passe à
   `refused` et sort de la file, **aucun exemple n'est écrit** pour le classeur. Un toast offre d'annuler ;
   l'annulation remet la proposition en attente. Une carte sans boîte proposée n'a pas le bouton. Tâches 1 à 4.
2. **Le Journal dit le refus** : « Laissé en boîte de réception, proposition de l’IA refusée », suivi de « par {agent} »
   quand c'est lui ; sous À la main, ou sous l'agent quand c'est lui. La ligne s'annule. Tâches 1 à 4.
3. **L'agent peut refuser** par `mail.refuse`, sous une carte comme ses autres gestes. Tâches 1, 3.
4. **Les compteurs de « Rien à valider »** : six tuiles, celles à zéro masquées, « aujourd’hui » gardé ; « rangés
   seuls » ne compte plus les règles ; l'agent compte ses validations, corrections et refus seulement. **CrOliX valide
   le rendu sur capture avant la fusion.** Tâches 1 à 5.
5. **Un mail à la corbeille ou en spam n'est plus listé** en boîte de réception ni dans « À valider », côté serveur
   comme dans le faux client des vues. **La boîte de `createDemo({ pina: false })`, celle de l'évaluation de l'agent,
   est inchangée, prouvé par un test.** Tâches 1 à 3.
6. **Un test par cas, rouge puis vert ; l'écran vérifié dans Chrome sur la démo**, bureau et téléphone en émulation à
   390 px ; l'icône du bouton validée par CrOliX sur capture. Tâches 1 à 5.

**Niveau proposé : `standard`.** Une action nouvelle de bout en bout (statut, route, parité, catalogue, Journal,
écran), des champs ajoutés au contrat (`stats.today`), deux vues de la boîte corrigées. Rien de sécurité, pas de
migration : `proposals.status` est un `TEXT` sans contrainte (`server/src/db.ts:80-87`), `refused` s'y écrit tel quel.

| Dépôt | Branche | Issues | Niveau |
|---|---|---|---|
| `lun-acedia` : le refus, les compteurs, la vue, la démo | `feat/suites-journal` | #88, #89, #90 | `standard` |
| `lun-docs` : ce plan et ses coches | `docs/suites-journal` | les mêmes | `trivial` |

Une PR par dépôt. Celle de Lun'Acedia ferme les trois issues ; celle de lun-docs porte `Refs`.

**Les trois issues tiennent ensemble.** Chacune est petite, elles touchent les mêmes fichiers (`types.ts`,
`journal.ts`, `Pending.svelte`, la démo) et la même preuve dans Chrome. Aucune n'est à sortir.

## Les décisions de CrOliX, le 23/11

1. **Refuser, c'est « non, pas ça », sans leçon.** Le mail ne bouge pas, la proposition passe à `refused` et sort de la
   file. **Aucun exemple n'est écrit** pour le classeur : l'annulation n'a rien à effacer, elle remet la proposition
   en attente. Texte du Journal : « Laissé en boîte de réception, proposition de l’IA refusée », et « …, proposition de
   l’IA refusée par {agent} » quand c'est l'agent. **Le bouton dit le refus** (« Refuser la proposition »), pas un
   ordre de rangement ; son icône est validée par CrOliX sur capture (un `X` peut se lire « fermer »).
2. **Le filtre** : À la main, ou celui de l'agent quand c'est lui. Un seul filtre par ligne, celui du décideur.
3. **L'agent peut refuser**, par une action `mail.refuse` du catalogue.
4. **Les compteurs** : six tuiles dans « Rien à valider », dans cet ordre : « rangés seuls par l’IA », « par une
   règle », « validés », « corrigés », « refusés », « par {agent} » (le nom réglé). **Les tuiles à zéro sont
   masquées**, « aujourd’hui » est gardé. CrOliX valide le rendu sur capture avant la fusion.

**Choix de la session, retenu avec l'accord du contradicteur** : #90 se règle dans les vues `inbox` et `pending`, qui
excluent `TRASH` et `SPAM`, pas dans le faux Gmail. La documentation de Gmail ne dit pas si la corbeille retire
`INBOX` ; elle dit que la liste de Gmail exclut la corbeille et le spam par défaut. La vue suit cette liste, quel que
soit le sort d'`INBOX`. Le faux Gmail garde `INBOX` à la corbeille : c'est le cas difficile, les tests le gardent.

### Les règles qui en découlent

- **Une proposition sans boîte n'a pas de bouton de refus.** La valider laisse déjà le mail en boîte de réception ;
  seules ses étiquettes l'en distinguent (`applyTarget`, `pipeline.ts:83-104`). Deux boutons qui font presque la même
  chose se confondraient. Le serveur refuse aussi un tel refus (400), pour l'agent.
- **Le compteur de l'agent** ne compte que ses lignes `validate`, `correct` et `refuse` : l'écran parle des
  propositions. Ses gestes directs (le rangement de `m12` dans la démo) ne comptent dans aucune tuile. De même, les
  gestes directs de CrOliX ne sont pas comptés.
- **« Plus en boîte de réception »** suit la définition des vues : `INBOX` sans `TRASH` ni `SPAM`. Le serveur relit
  le mail dans Gmail (`fetchMetadata`, comme l'annulation, `journal.ts:151-153`) avant d'écrire quoi que ce soit, et
  refuse (409) sinon.
- **`autoFiled`** (règles et IA) reste dans `stats.today` : la phrase de la boîte de réception le lit (« Le tri a rangé
  N mails aujourd’hui », `Mailbox.svelte:437-441`), et il est juste pour « le tri ».

## Ce que dit la documentation de Gmail

- `users.messages.trash`
  (<https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/trash>) : « Moves the specified
  message to the trash. » **Rien sur `INBOX` ni sur les autres libellés.**
- Le guide des libellés (<https://developers.google.com/workspace/gmail/api/guides/labels>) ne liste `INBOX` et `TRASH`
  que dans le tableau des libellés système, sans rien dire de ce que la corbeille fait aux autres.
- `users.messages.list` (<https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/list>),
  paramètre `includeSpamTrash` : « Include messages from `SPAM` and `TRASH` in the results. » Faux par défaut : la
  liste de Gmail avec `labelIds=INBOX`, que lit `viewQuery('inbox')` (`store.ts:159-160`), ne rend pas la corbeille.
  Le faux Gmail fait de même (`server/src/testing/fake-gmail.ts:258-262`).

Le code d'Acedia suppose déjà qu'`INBOX` peut survivre à la corbeille : `fileMail` sort de la corbeille puis retire
`INBOX`, « an untrash may put it back » (`server/src/gmail/actions.ts:80-82`). **Non vérifié sur un vrai compte.**

## Ce que le code fait aujourd'hui

- **Les statuts d'une proposition.** `ProposalView.status` : `'pending' | 'auto' | 'accepted' | 'corrected'`
  (`server/src/types.ts:16`, recopié dans `views/src/lib/types.ts` par `npm run sync-types`).
  `setProposalStatus` écrit n'importe quel statut (`server/src/triage/proposals.ts`). La base ne contraint pas la
  colonne (`server/src/db.ts:80-87`).
- **Valider et corriger.** `validate` (`server/src/triage/pipeline.ts:398-406`) et `correct` (`:428-449`) partent de
  `pendingProposal` (`:373-378`, 404 sans proposition, 409 si elle n'est plus en attente), prennent un `snapshot`
  (`:386-388`), appliquent, changent le statut, apprennent l'exemple (`remember`, `:380-383`), puis écrivent au Journal
  par `logUser` avec `previous` (`server/src/triage/journal.ts:70-91`). `changeOf` (`pipeline.ts:391-395`) rend un
  changement vide (mêmes libellés avant et après) quand rien n'a bougé : c'est ce que le refus écrira.
- **L'annulation** (`journal.ts:144-182`) relit Gmail, refuse si le mail a changé, remet les libellés, puis
  `previous.proposalStatus` et l'exemple. Pour une ligne vide, aucun libellé ne bouge : le refus s'annule sans code de
  plus. L'exemple remis est celui du `snapshot`, inchangé par un refus. `UserAction` (`journal.ts:19`) n'a pas
  `refuse`.
- **Les routes.** `POST /api/mail/:id/validate` et `/correct` (`server/src/triage/routes.ts:95-114`). Chaque route
  d'écran doit figurer dans `PARITY` (`server/src/contract/parity.ts:13-75`), servie par une action ou exclue avec sa
  raison ; `missingFromParity` (`:85-87`) le vérifie.
- **L'agent** valide et corrige par le catalogue (`catalog.ts:140-148`, `catalog.test.ts:7-24`) ; ses cartes ont un
  texte (`server/src/pina/wording.ts:132-162`, copie dans `views/src/lib/pina/wording.ts`) et une icône
  (`views/src/lib/pina/cards.ts:18-23`). Toute réponse qui porte un `journalId` s'annule par `journal.undo`
  (`server/src/pina/agent.test.ts:404-410`) ; `markPina` passe la ligne à son nom (`server/src/pina/agent.ts:114-116`).
- **Le bilan `day.digest`** (`catalog.ts:411-472`) liste chaque ligne non annulée du Journal sous `journal.{action}`
  (`:435-455`) et compte en attente toute proposition `pending` (`:467-469`).
- **« À valider »** (`views/src/lib/mail/Pending.svelte`). Une carte a « Valider » et « Corriger » (`:549-565`) ; un
  lot a « Valider les N » et « Tout corriger… » (`:469-482`). `act()` (`:196-233`) retire les mails de la file, puis
  offre d'annuler par le toast, ligne par ligne du Journal. Au téléphone, la carte montre la pastille, « Corriger » et
  « Valider » (`:962-985`) ; glisser à droite valide, à gauche ouvre la correction (`:281-300`).
- **Les compteurs.** `todayStats` (`journal.ts:222-241`) rend `{ autoFiled, validated, corrected }` : `autoFiled`
  compte toute ligne qui n'est ni de CrOliX ni de l'agent, donc les règles et l'IA (`:238`) ; `validated` et
  `corrected` ne comptent que CrOliX (`:235-237`) ; l'agent n'est compté nulle part. « Rien à valider » affiche les
  trois tuiles, même à zéro (`Pending.svelte:435-443`, style `.stats` `:855-874`). La même donnée sert la route
  `GET /api/stats/today` (`routes.ts:93`) et l'action `stats.today` du contrat (`catalog.ts:407-409`). Tests :
  `server/src/triage/journal.test.ts:293-318`, `views/src/lib/mail/Pending.test.ts:141-152`,
  `views/src/lib/mail/Mailbox.test.ts:40`, la fabrique `views/src/testing/fake-client.ts:159`.
- **Les vues de la boîte.** `viewFilter` (`server/src/gmail/store.ts:123-154`) : `inbox` garde tout mail portant
  `INBOX`, `pending` tout mail portant `INBOX` avec une proposition en attente. Les vues `box:` et `sent` excluent déjà
  `TRASH`. Le faux Gmail ajoute `TRASH` sans retirer `INBOX` (`fake-gmail.ts:297-306`). La même vue sert l'écran
  (`server/src/gmail/read.ts:153`) et l'action `mail.list` de l'agent (`catalog.ts:237`). Le faux client des vues a
  sa propre règle, sur `INBOX` seul (`views/src/testing/fake-client.ts:92-95`).
- **La démo** (`server/src/demo/demo.ts`). `JOURNAL_MAILS` (`:195-217`) ne sert qu'aux écrans : `m17` est livré avec
  les autres avant le tri (`:535`), `m16` après (`:538-540`). Le classeur scripté lit l'entrée `ai` d'un mail par son
  objet (`:223-235`). Gestes en mode écrans (`:549-556`) : validations de `m01` et `m17`, correction de `m15` vers la
  corbeille, corbeille à la main de `m16`, annulation de la règle de `m08`. Restent en attente `m02`, `m03`, `m06`,
  `m11` (`demo.test.ts:11`). `m15` et `m16` restent listés en boîte de réception : c'est #90. `m12` est rangé par
  l'agent (`:543-547`).
- **L'évaluation de l'agent** (`server/scripts/pina-eval.ts:66-95`) part de `createDemo({ pina: false })` : aucun geste
  du Journal n'y est joué (`demo.test.ts:76`). Sa précondition lit `label_ids` en base, pas la vue `inbox`
  (`pina-eval.ts:84-95`).
- **Deux noms déjà pris dans `Journal.svelte`.** `refused` (`:88`) et la classe `.refuse` (`:292`, `:494-497`)
  désignent une **annulation refusée** par le serveur, pas un refus de proposition.

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit échouer ; un développeur écrit le code ; le
**reviewer** relit le diff. Elle se ferme sur les barrières de Lun'Acedia au vert : `npm test`, `npm run lint`,
`npm run typecheck`, `npm run format:check`, `npm run check:colors`.

**Qui écrit le code.** `dev-front` fait les écrans (tâches 4 et 5). **Aucun agent de métier ne couvre le serveur
d'Acedia** : la tâche 3 revient à la session, ou à un agent général à qui l'on donne ce plan.

**L'ordre.** **1 et 2 partent en parallèle** (aucun fichier commun : 1 les tests du serveur, 2 ceux des vues et le
faux client). 3 attend 1. 4 attend 2 et 3 (les types recopiés). 5 attend 3 et 4.

1. - [ ] **Les tests du serveur, rouges** (testeur ; fichiers de test du serveur seulement).
   - `server/src/triage/pipeline.test.ts` ou `journal.test.ts`, avec le harnais existant :
     - `POST /api/mail/:id/refuse` sur une proposition en attente vers une boîte : 200 ; les libellés du mail
       inchangés dans le faux Gmail ; la proposition en `refused` ; une ligne `origin: 'user'`, `action: 'refuse'`,
       `before` égal à `after`, `INBOX` dedans ; **aucun exemple écrit** (`getExample` rend ce qu'il rendait avant) ;
     - 404 sans proposition ; 409 sur une proposition déjà traitée ; 400 sur une proposition sans boîte ;
     - 409 si Gmail dit le mail hors de la boîte de réception, **le cache local disant le contraire** : sans `INBOX`,
       ou avec `INBOX` et `TRASH`, ou avec `INBOX` et `SPAM` (changer les libellés dans le faux Gmail seulement) ;
       aucune ligne au Journal, la proposition toujours en attente ;
     - l'annulation de la ligne : la proposition repasse en `pending`, aucun appel de modification à Gmail.
   - **La parité** : le test qui appelle `missingFromParity` échoue tant que la route manque.
   - **Le catalogue** : `mail.refuse` dans `NAMES` de `catalog.test.ts` ; l'action rend un `journalId` ;
     `inverseOf('mail.refuse', …)` rend `journal.undo` (ajouter l'action à la boucle de `agent.test.ts:404-410`) ; une
     carte de l'agent passée par `runCard` laisse une ligne `origin: 'pina'`, `action: 'refuse'`.
   - **Les compteurs** (`journal.test.ts:293-318`) : le même jeu de lignes, plus une ligne `refuse` de CrOliX et des
     lignes `pina` (`file`, `archive`, `validate`, `correct`, `refuse`), rend
     `{ autoFiled, ai, rule, validated, corrected, refused, agent }` ; `autoFiled` garde sa valeur d'aujourd'hui (2) ;
     `agent` vaut 3 (ses gestes directs exclus) ; une ligne annulée ne compte pas ; un geste direct de CrOliX
     (`archive`) n'est dans aucun champ.
   - **Les vues** (`server/src/gmail/routes.test.ts:48-65`) : un mail `['INBOX', 'TRASH']` et un `['INBOX', 'SPAM']`
     ne sont ni dans `inbox` ni dans `pending` (même avec une proposition en attente), et restent dans `trash` et
     `spam`.
   - **La démo** (`server/src/demo/demo.test.ts`) : une ligne `refuse` pour `m18` ; `m18` n'est plus en attente ; la
     file reste `m02`, `m03`, `m06`, `m11` ; `m15` et `m16` absents de `GET /api/mail?view=inbox` et présents dans
     `view=trash` ; `m02`, `m03`, `m11` portent encore `INBOX` (`:73`, inchangé) ; **la boîte de
     `createDemo({ pina: false })` est inchangée** : le test de `:76-90` garde sa liste d'identifiants
     (`m01`, `m02`, `m03`, `m06`, `m11`, `m15`), sans `m18`, et attend aussi qu'aucune ligne `refuse` n'y soit.
   - **Exclu** : le code ; les tests des vues.
   - **Preuve** : chaque nouveau test échoue sur `main` pour la bonne raison (route absente, champ absent, mail listé).

2. - [ ] **Les tests des vues, rouges** (testeur ; `views/src/lib/mail/Pending.test.ts`, `Journal.test.ts`,
   `views/src/testing/fake-client.ts`).
   - **Le bouton** : chaque carte proposée vers une boîte, la corbeille ou le spam a un bouton « Refuser la
     proposition » (nom accessible) ; un clic appelle `client.refuse(id)`, retire la carte, montre le toast
     « Proposition refusée : {expéditeur} » ; « Annuler » appelle `client.undo(journalId)` et recharge la file. Le
     clavier passe à la carte suivante, comme après V (le test « after V »).
   - **Une carte sans boîte proposée n'a pas le bouton** ; « Valider » et « Corriger » y restent.
   - **Au téléphone**, le bouton existe aussi (le test vérifie qu'il est dans la carte ; la largeur se voit en tâche 5).
   - **Les compteurs** (`Pending.test.ts:141-152`) : les six tuiles dans l'ordre, au singulier et au pluriel ; une
     tuile à zéro n'est pas rendue ; « aujourd’hui » reste sur la première tuile rendue ; la tuile de l'agent porte le
     nom réglé (régler `agentIdentity.name` dans le test, puis le remettre) ; tout à zéro, aucune tuile.
   - **Le Journal** (`Journal.test.ts`, fabrique `entry()`) : `user` `refuse`, `before` et `after` à `['INBOX']`, dit
     « Laissé en boîte de réception, proposition de l’IA refusée », icône main, sous À la main seulement ; `pina`
     `refuse` dit « …, proposition de l’IA refusée par Agent », sous la puce de l'agent seulement ; l'`aria-label` mot
     pour mot ; une ligne annulée reste sous son filtre et sous Annulés.
   - `fake-client.ts` : `refuse` dans le faux client ; `todayStats` rend la nouvelle forme ; **`inView` suit les vues
     du serveur** : `inbox` et `pending` excluent `TRASH` et `SPAM`.
   - **Exclu** : le code ; `Mailbox.test.ts` sauf la forme de `todayStats` (`:40`) ; le lecteur de mail.
   - **Preuve** : les nouveaux tests échouent sur `main` pour la bonne raison.

3. - [ ] **Le serveur** (la session ou un agent général). Après 1.
   - `server/src/types.ts` : `'refused'` dans `ProposalView.status` ; `TodayStats` prend `ai`, `rule`, `refused`,
     `agent`, garde `autoFiled`, `validated`, `corrected`, chacun avec sa doc. Puis
     `npm run sync-types -w @lun-ecosystem/lunacedia-views`.
   - `server/src/triage/journal.ts` : `'refuse'` dans `UserAction` ; `todayStats` : `ai`, `rule`,
     `autoFiled = ai + rule`, `validated`, `corrected`, `refused` pour CrOliX, `agent` pour les lignes `pina` dont
     l'action est `validate`, `correct` ou `refuse`.
   - `server/src/triage/pipeline.ts` : `refuse(deps, id)` sur le modèle de `validate` : `pendingProposal` ;
     `BadRequestError` si `boxId` est nul ; `fetchMetadata` puis `upsertMessage`, et `ConflictError` (« Ce mail n’est
     plus en boîte de réception ») si les libellés relus n'ont pas `INBOX` ou ont `TRASH` ou `SPAM` ; `snapshot` ;
     statut `refused` ; **pas de `remember`** ; `logUser(changeOf(deps, id, undefined), 'refuse', …)`. Rend la
     proposition et son `journalId`. Aucun appel de modification à Gmail.
   - `server/src/triage/routes.ts` : `POST /mail/:id/refuse`. `parity.ts` : `{ action: 'mail.refuse' }`.
   - `server/src/contract/catalog.ts` : `mail.refuse` (`write`), « Refuse la proposition de tri d’un mail : il reste en
     boîte de réception. » ; `server/src/pina/wording.ts` : titre « Refuser la proposition de tri », fait « Proposition
     refusée » ; `npm run sync-types` recopie le texte dans les vues.
   - `server/src/gmail/store.ts` : `inbox` et `pending` ajoutent `NOT has('TRASH') AND NOT has('SPAM')`. `viewQuery`
     ne change pas (Gmail exclut déjà la corbeille de la liste).
   - `server/src/demo/demo.ts` : `m18` dans `JOURNAL_MAILS`, avec son entrée `ai` vers une boîte à une confiance sous
     95 (le seuil de la démo, `demo.test.ts:14`) ; livré explicitement pour les écrans avec `m17`, avant le tri
     (`:535`) ; puis `POST /api/mail/m18/refuse` avec les autres gestes (`:549-556`). Aucun mail de `seedPina` ni des
     scénarios touché.
   - **Exclu** : le front ; un libellé Gmail ; le refus en lot ; `day.digest` (Lun-Ecosystem/lun-acedia#92).
   - **Preuve** : les tests de la tâche 1 au vert ; les barrières au vert ; `npm run demo` démarre. Si la clé de
     l'évaluation est dans le `.env`, `npm run pina:eval -w @lun-acedia/server`, sans jamais afficher la clé ; sinon,
     le dire.

4. - [ ] **Les écrans** (`dev-front` ; `views/src/lib/client.ts`, `Pending.svelte`, `Journal.svelte`,
   `views/src/lib/pina/cards.ts`, `views/src/lib/ui/Icon.ts`). Après 2 et 3.
   - `client.ts` : `refuse(id)` vers `POST /api/mail/:id/refuse`, à côté de `validate`.
   - `Pending.svelte` : un `IconButton` du kit (nom « Refuser la proposition ») dans `.actions` de chaque carte dont
     la proposition a une boîte, avant « Corriger » ; il passe par `act()` avec le message « Proposition refusée :
     … ». Au téléphone, il reste dans la rangée, icône seule. Pas de raccourci ni de glisse nouveau. **L'icône est une
     proposition**, montrée à CrOliX sur capture en tâche 5 : plutôt qu'un `X`, une icône Lucide ajoutée à
     `views/src/lib/ui/Icon.ts` (par exemple `circle-slash`, une ligne d'export). `Ban`, le seul voisin déjà exporté
     (`Icon.ts:18`), sert au groupe du spam (`Pending.svelte:458`) : à ne pas reprendre.
   - `Pending.svelte` : les six tuiles avec `plural()`, celles à zéro masquées, « aujourd’hui » sur la première rendue ;
     la tuile de l'agent suit `agentIdentity`.
   - `Journal.svelte` : `by()` (`:148-152`) prend `refuse` → « refusée ». Rien d'autre : `where()` et `decider()` en
     donnent déjà le verbe et le filtre. **Attention aux noms** : `refused` et `.refuse` y désignent une annulation
     refusée ; ne pas les réutiliser pour le refus d'une proposition, ni les renommer dans ce chantier.
   - `cards.ts` : pour `mail.refuse`, l'icône du bouton.
   - **Exclu** : le serveur ; le lecteur de mail et la boîte (`MailReader.svelte`, `Mailbox.svelte`) ; tout nouveau
     composant ; la DA.
   - **Preuve** : les tests de la tâche 2 au vert ; les barrières au vert.

5. - [ ] **La preuve dans Chrome sur la démo** (`dev-front`). Après 3 et 4.
   - `npm run demo`, puis Chrome : **au bureau** (largeur par défaut) et **au téléphone**, par l'émulation d'appareil
     des DevTools ou Chrome sans interface à 390 px de large. Pas une fenêtre redimensionnée.
   - **On attend** : dans « À valider », le bouton sur chaque carte proposée vers une boîte ; un refus de `m02` retire
     la carte, le toast l'annule et la carte revient ; au Journal, la ligne de `m18` sous son texte et sous À la main ;
     « Rien à valider » (après avoir vidé la file) montre les tuiles non nulles ; la boîte de réception ne liste plus
     `m15` ni `m16`, la corbeille les liste ; au téléphone, la rangée de la carte tient sans déborder et les tuiles
     passent à la ligne.
   - **Relevé** dans la PR : captures à chaque largeur (« À valider » avec le bouton, Journal filtre À la main, « Rien
     à valider », boîte de réception), sans donnée réelle. **CrOliX valide l'icône du bouton et le rendu des tuiles
     sur ces captures avant la fusion.**
   - **Exclu** : une vraie base ; un vrai compte Gmail.

## Risques

- **Le core relaie le catalogue.** Une action ajoutée au catalogue d'Acedia est offerte à tout agent qui le lit :
  Natsume aura aussi `mail.refuse`.
- **La carte ne protège qu'en mode validation.** En mode immédiat, l'agent refuse seul, sans que CrOliX le voie avant
  (`runCard`, `server/src/pina/agent.ts`). Le geste ne déplace rien et s'annule depuis le Journal.
- **Le bilan de la nuit** : `day.digest` listera les refus sous `journal.refuse` (`catalog.ts:450`), un type qu'il ne
  rendait pas. Un lecteur qui ne connaît que les types d'aujourd'hui doit le laisser passer.
- **Une action de plus pour l'agent** allonge la liste de ses outils et peut changer ses choix dans les scénarios de la
  file. Prouvé seulement si `pina:eval` tourne.
- **La rangée de la carte au téléphone.** Pastille, « Corriger », « Valider » et un bouton de plus à 390 px. La tâche 5
  le regarde ; si elle déborde, « Corriger » perd son texte au profit de l'icône, sans nouveau composant sans CrOliX.
- **Le contrat `stats.today` change de forme.** Les champs gardés gardent leur sens, les nouveaux s'ajoutent : un
  lecteur d'aujourd'hui ne casse pas. `validated` et `corrected` comptaient déjà CrOliX seul.
- **L'agent voit moins de mails en réception.** `mail.list` sur `inbox` ne rend plus la corbeille ni le spam : c'est
  plus juste, mais c'est un changement de ce qu'il lit.
- **Un refus n'apprend rien** : l'IA peut reproposer la même boîte pour un mail semblable. C'est voulu (décision 1).

## Hors périmètre

- **Une proposition en attente d'un mail sorti de la réception par un geste direct** (archive, corbeille, spam) :
  invisible dans « À valider », mais comptée par `day.digest`. Ouvert en Lun-Ecosystem/lun-acedia#92.
- Le refus depuis le lecteur de mail et la boîte (`MailReader.svelte:51`, `Mailbox.svelte:267`), et le refus d'un lot
  (« Tout refuser »). Un raccourci clavier ou un geste de glisse pour le refus.
- Le renommage de `refused` et `.refuse` dans `Journal.svelte`.
- La planche 04 de la maquette, qui n'est pas réécrite. L'archivage du Journal (Lun-Ecosystem/lun-acedia#33).

## Limites

- **Non vérifié sur un vrai compte** : ce que `messages.trash` fait à `INBOX`. La documentation ne le dit pas ; le
  choix des vues tient dans les deux cas.
- L'évaluation de l'agent n'a pas été lancée pour ce plan.
