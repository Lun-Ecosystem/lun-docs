# Suites du Journal : refuser une proposition, des compteurs justes, la corbeille hors de la réception. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** Lun-Ecosystem/lun-acedia#88 (refuser une proposition), Lun-Ecosystem/lun-acedia#89 (les compteurs du
> tri), Lun-Ecosystem/lun-acedia#90 (la corbeille reste en réception dans la démo). Toutes trois nées du chantier du
> Journal (Lun-Ecosystem/lun-acedia#86, fusionné le 23/11 par Lun-Ecosystem/lun-acedia#91). Dépôt public.
>
> **État : rédigé le 23/11 ; périmètre à figer par CrOliX** (critères, niveau et six décisions ci-dessous, une à une).
>
> Code relu sur `main` de Lun'Acedia (`1cd0c56`) ; le graphe d'abord, puis chaque point dans le code. Lun'Acedia est
> public : ce plan ne porte ni adresse, ni compte, ni nom d'hôte.

**But :** dans « À valider », CrOliX peut laisser un mail où il est sans le ranger, et le Journal le dit. Les
compteurs du jour suivent le découpage du Journal. Un mail mis à la corbeille ne s'affiche plus en boîte de réception.

**Source :** les trois issues ; le plan fusionné du Journal (`docs/plans/2026-11-23-journal-acedia.md`) et ses deux
décisions : la règle courte des textes (`{verbe} {boîte}, proposition de l’IA validée|corrigée[ par {agent}]`) et un
seul filtre par ligne, celui du décideur, l'agent sous son nom ; la documentation officielle de l'API Gmail.

## Critères de fin proposés

Chacun se prouve en local, sur la démo et par les tests.

1. **Refuser une proposition** depuis « À valider » : le mail ne bouge pas dans Gmail, la proposition sort de la file,
   un toast offre d'annuler, l'annulation la remet en attente. Tâches 1 à 4.
2. **Le Journal dit le refus** sous la règle courte, sous le filtre de son décideur (décisions 1 et 2), et la ligne
   s'annule comme les autres. Tâches 1 à 4.
3. **Les compteurs de « Rien à valider »** suivent le découpage du Journal : « rangés seuls » ne compte plus les règles,
   les gestes de l'agent sont comptés à son nom (décision 5). Tâches 1 à 4.
4. **Un mail à la corbeille ou en spam n'est plus listé en boîte de réception ni dans « À valider »**, dans la démo
   comme dans les tests (décision 6). Les préconditions de l'évaluation de l'agent tiennent. Tâches 1, 3.
5. **Un test par cas, rouge puis vert ; l'écran vérifié dans Chrome sur la démo**, bureau et téléphone en émulation à
   390 px. Tâches 1 à 5.

**Niveau proposé : `standard`.** Une action nouvelle de bout en bout (statut, route, parité, Journal, écran), un champ
de plus au contrat (`stats.today`), une vue de la boîte corrigée. Rien de sécurité, pas de schéma de base touché
(`proposals.status` est un `TEXT` sans contrainte, `server/src/db.ts:80-87`).

| Dépôt | Branche | Issues | Niveau |
|---|---|---|---|
| `lun-acedia` : le refus, les compteurs, la vue, la démo | `feat/suites-journal` | #88, #89, #90 | `standard` |
| `lun-docs` : ce plan et ses coches | `docs/suites-journal` | les mêmes | `trivial` |

Une PR par dépôt. Celle de Lun'Acedia ferme les trois issues ; celle de lun-docs porte `Refs`.

**Les trois issues tiennent ensemble.** Chacune est petite, elles touchent les mêmes fichiers (`types.ts`,
`journal.ts`, `Pending.svelte`, la démo) et la même preuve dans Chrome. Aucune n'est à sortir.

## Les décisions à poser à CrOliX, une à une

1. **Le filtre d'une ligne de refus.** *Recommandé : À la main ; celui de l'agent quand c'est lui.* Refuser, c'est
   dire non à l'IA : c'est CrOliX qui décide, comme pour une correction. La décision 2 du Journal (un seul filtre,
   celui du décideur) s'applique telle quelle. Le code n'a rien à ajouter : `decider()` rend déjà `origin` pour toute
   action autre que `validate` (`views/src/lib/mail/Journal.svelte:62`). Autre choix possible : le filtre IA, mais il
   mêlerait ce que l'IA a fait et ce qu'on lui a refusé.
2. **Le texte de la ligne de refus.** *Recommandé : « Laissé en boîte de réception, proposition de l’IA refusée » ;
   pour l'agent, « …, proposition de l’IA refusée par Agent ».* C'est la règle courte avec un troisième mot. Le verbe
   « Laissé en boîte de réception » sort déjà de `where()` quand `INBOX` reste dans `after` (`Journal.svelte:143`) ;
   seul `by()` (`:148-152`) prend `refusée`. La lecture d'écran suit (`rowLabel`, `:155-159`).
3. **Ce qu'un refus fait au mail.** *Recommandé : rien dans Gmail ; la proposition passe à `refused` ; le mail
   devient un exemple « aucune boîte ».* Pas de libellé : ce serait une trace dans Gmail que rien d'autre ne lit, et
   le Journal la porte déjà. L'exemple, c'est ce que fait déjà une validation d'une proposition sans boîte
   (`remember(…, 'none', …)`, `pipeline.ts:380-383`) : sans lui, l'IA reproposera la même boîte pour ce genre de mail.
   L'annulation le retire avec le reste (`snapshot`, `pipeline.ts:386-388` ; `restoreExample`, `journal.ts:172`).
   Autre choix : pas d'exemple, si CrOliX veut pouvoir refuser « par doute » sans rien apprendre à l'IA.
4. **L'agent peut-il refuser ?** *Recommandé : oui, par une action `mail.refuse` du catalogue.* Il valide et corrige
   déjà (`server/src/contract/catalog.ts:140-148`) ; sans le refus, il ne peut vider la file qu'en rangeant quelque
   part. Le geste ne déplace rien et s'annule : la carte reste le garde-fou (bretelles par les cartes). L'inverse
   vient seul : toute réponse qui porte un `journalId` s'annule par `journal.undo` (`server/src/pina/agent.test.ts:404`)
   et `markPina` passe la ligne à son nom (`server/src/pina/agent.ts:114-116`). Coût : la ligne du catalogue, son
   texte de carte (`server/src/pina/wording.ts`, recopié dans les vues), son icône (`views/src/lib/pina/cards.ts`).
   Autre choix : non, et la route est marquée « à la main seulement » dans `PARITY`.
5. **Le découpage et les libellés des compteurs.** *Recommandé : six tuiles dans « Rien à valider », dans cet ordre :
   « rangés seuls par l’IA », « par une règle », « validés », « corrigés », « refusés », « par Agent » (le nom réglé).*
   Les validations, corrections et refus de l'agent ne comptent que sous sa tuile (décision 2 du Journal). Les gestes
   directs ne sont pas comptés ici : l'écran parle des propositions. Le champ `autoFiled` (règles et IA) reste, car la
   phrase de la boîte de réception le lit (« Le tri a rangé N mails aujourd’hui », `Mailbox.svelte:437-441`) et il
   est juste pour « le tri ». Autre choix : quatre tuiles, une par filtre du Journal (IA, À la main, Règles, agent),
   plus courtes mais sans « validés » ni « corrigés », qui sont le sujet de l'écran.
6. **Où se règle la corbeille en réception.** *Recommandé : dans la vue, pas dans le faux Gmail.* Les vues `inbox` et
   `pending` excluent `TRASH` et `SPAM` (`server/src/gmail/store.ts:125-137`). La documentation de Gmail ne dit pas si
   `messages.trash` retire `INBOX` (voir plus bas) ; elle dit en revanche que la liste exclut la corbeille et le spam
   par défaut. La vue suit donc la liste de Gmail, quel que soit le sort d'`INBOX`. Le faux Gmail garde `INBOX` à la
   corbeille : c'est le cas difficile, les tests le gardent. Autre choix : retirer `INBOX` dans le faux Gmail, mais ce
   serait affirmer un comportement que la documentation ne donne pas.

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
  plus. `UserAction` (`journal.ts:19`) n'a pas `refuse`.
- **Les routes.** `POST /api/mail/:id/validate` et `/correct` (`server/src/triage/routes.ts:95-114`). Chaque route
  d'écran doit figurer dans `PARITY` (`server/src/contract/parity.ts:13-75`), servie par une action ou exclue avec sa
  raison ; `missingFromParity` (`:85-87`) le vérifie.
- **L'agent** valide et corrige par le catalogue (`catalog.ts:140-148`, `catalog.test.ts:7-24`) ; ses cartes ont un
  texte (`server/src/pina/wording.ts:132-162`, copie dans `views/src/lib/pina/wording.ts`) et une icône
  (`views/src/lib/pina/cards.ts:18-23`).
- **« À valider »** (`views/src/lib/mail/Pending.svelte`). Une carte a « Valider » et « Corriger » (`:549-565`) ; un
  lot a « Valider les N » et « Tout corriger… » (`:469-482`). `act()` (`:196-233`) retire les mails de la file, puis
  offre d'annuler par le toast, ligne par ligne du Journal. Le toast d'une validation sans boîte dit déjà « Gardé en
  réception » (`done()`, `:184-190`). Au téléphone, la carte montre la pastille, « Corriger » et « Valider »
  (`:962-985`) ; glisser à droite valide, à gauche ouvre la correction (`:281-300`).
- **Les compteurs.** `todayStats` (`journal.ts:222-241`) rend `{ autoFiled, validated, corrected }` : `autoFiled`
  compte toute ligne qui n'est ni de CrOliX ni de l'agent, donc les règles et l'IA (`:238`) ; `validated` et
  `corrected` ne comptent que CrOliX (`:235-237`) ; l'agent n'est compté nulle part. « Rien à valider » affiche
  `autoFiled` sous « rangés seuls aujourd’hui » (`Pending.svelte:435-443`). La même donnée sert la route
  `GET /api/stats/today` (`routes.ts:93`) et l'action `stats.today` du contrat (`catalog.ts:407-409`). Tests :
  `server/src/triage/journal.test.ts:293-318`, `views/src/lib/mail/Pending.test.ts:141-152`,
  `views/src/lib/mail/Mailbox.test.ts:40`, la fabrique `views/src/testing/fake-client.ts:159`.
- **Les vues de la boîte.** `viewFilter` (`server/src/gmail/store.ts:123-154`) : `inbox` garde tout mail portant
  `INBOX`, `pending` tout mail portant `INBOX` avec une proposition en attente. Les vues `box:` et `sent` excluent déjà
  `TRASH`. Le faux Gmail ajoute `TRASH` sans retirer `INBOX` (`fake-gmail.ts:297-306`). La même vue sert l'écran
  (`server/src/gmail/read.ts:153`) et l'action `mail.list` de l'agent (`catalog.ts:237`).
- **La démo** (`server/src/demo/demo.ts:535-556`), en mode écrans seulement : `m16` livré après le tri ; validations
  de `m01` et `m17`, correction de `m15` vers la corbeille, corbeille à la main de `m16`, annulation de la règle de
  `m08`. Il reste quatre propositions en attente : `m02`, `m03`, `m06`, `m11` (`demo.test.ts:11`). `m15` et `m16`
  restent listés en boîte de réception : c'est #90.
- **L'évaluation de l'agent** (`server/scripts/pina-eval.ts:66-95`) part de `createDemo({ pina: false })` : aucun geste
  du Journal n'y est joué (`demo.test.ts:76`). Sa précondition lit `label_ids` en base, pas la vue `inbox`
  (`pina-eval.ts:84-95`). Exclure la corbeille de la vue ne change donc ni la précondition ni le départ des scénarios.

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit échouer ; un développeur écrit le code ; le
**reviewer** relit le diff. Elle se ferme sur les barrières de Lun'Acedia au vert : `npm test`, `npm run lint`,
`npm run typecheck`, `npm run format:check`, `npm run check:colors`.

**Qui écrit le code.** `dev-front` fait les écrans (tâches 4 et 5). **Aucun agent de métier ne couvre le serveur
d'Acedia** : la tâche 3 revient à la session, ou à un agent général à qui l'on donne ce plan.

**L'ordre.** **1 et 2 partent en parallèle** (aucun fichier commun : 1 les tests du serveur, 2 ceux des vues). 3
attend 1. 4 attend 2 et 3 (les types recopiés). 5 attend 3 et 4.

Les tâches suivent les recommandations. Une décision tranchée autrement change la tâche qu'elle nomme, avant le code.

1. - [ ] **Les tests du serveur, rouges** (testeur ; fichiers de test du serveur seulement).
   - `server/src/triage/pipeline.test.ts` ou `journal.test.ts`, avec le harnais existant :
     - `POST /api/mail/:id/refuse` sur une proposition en attente : 200 ; les libellés du mail inchangés dans le faux
       Gmail ; la proposition en `refused` ; une ligne `origin: 'user'`, `action: 'refuse'`, `before` égal à `after`,
       `INBOX` dedans ; un exemple « aucune boîte » (décision 3) ;
     - 404 sans proposition ; 409 sur une proposition déjà traitée ; 409 si le mail n'est plus en boîte de réception
       (le texte « Laissé en boîte de réception » doit rester vrai) ;
     - l'annulation de la ligne : la proposition repasse en `pending`, l'exemple disparaît, aucun appel de
       modification à Gmail.
   - **La parité** : le test qui appelle `missingFromParity` échoue tant que la route manque.
   - **Le catalogue** (décision 4) : `mail.refuse` dans `NAMES` de `catalog.test.ts` ; l'action rend un `journalId` ;
     `inverseOf('mail.refuse', …)` rend `journal.undo` (`agent.test.ts:404-410`, ajouter l'action à la boucle) ; une
     carte de l'agent passée par `runCard` laisse une ligne `origin: 'pina'`.
   - **Les compteurs** (`journal.test.ts:293-318`) : le même jeu de lignes, plus une ligne `refuse` de CrOliX et des
     lignes `pina` (`file`, `validate`, `refuse`), rend
     `{ autoFiled, ai, rule, validated, corrected, refused, agent }` ; `autoFiled` garde sa valeur d'aujourd'hui (2) ;
     une ligne annulée ne compte pas ; un geste direct (`archive`) n'est dans aucun champ.
   - **Les vues** (`server/src/gmail/routes.test.ts:48-65`) : un mail `['INBOX', 'TRASH']` et un `['INBOX', 'SPAM']`
     ne sont ni dans `inbox` ni dans `pending` (même avec une proposition en attente), et restent dans `trash` et
     `spam`.
   - **La démo** (`server/src/demo/demo.test.ts`) : une ligne `refuse` pour `m18` ; `m18` n'est plus en attente ; la
     file reste `m02`, `m03`, `m06`, `m11` ; `m15` et `m16` absents de `GET /api/mail?view=inbox` ; `m02`, `m03`, `m11`
     portent encore `INBOX` (`:73`, inchangé).
   - **Exclu** : le code ; les tests des vues.
   - **Preuve** : chaque nouveau test échoue sur `main` pour la bonne raison (route absente, champ absent, mail listé).

2. - [ ] **Les tests des vues, rouges** (testeur ; `views/src/lib/mail/Pending.test.ts`, `Journal.test.ts`,
   `views/src/testing/fake-client.ts`).
   - **Le bouton** : chaque carte a un bouton de refus, nommé « Laisser en boîte de réception » pour la lecture
     d'écran ; un clic appelle `client.refuse(id)`, retire la carte, montre le toast « Laissé en boîte de réception :
     {expéditeur} » ; « Annuler » appelle `client.undo(journalId)` et recharge la file. Le clavier passe à la carte
     suivante, comme après V (`Pending.test.ts`, le test « after V »).
   - **Au téléphone**, le bouton existe aussi (le test vérifie qu'il est dans la carte ; la largeur se voit en tâche 5).
   - **Les compteurs** (`Pending.test.ts:141-152`) : les six tuiles de la décision 5, dans l'ordre, au singulier et au
     pluriel ; la dernière porte le nom réglé de l'agent (régler `agentIdentity.name` dans le test, puis le remettre).
   - **Le Journal** (`Journal.test.ts`, fabrique `entry()`) : `user` `refuse`, `before` et `after` à `['INBOX']`, dit
     « Laissé en boîte de réception, proposition de l’IA refusée », icône main, sous À la main seulement ; `pina`
     `refuse` dit « …, proposition de l’IA refusée par Agent », sous la puce de l'agent seulement ; l'`aria-label` mot
     pour mot ; une ligne annulée reste sous son filtre et sous Annulés.
   - `fake-client.ts` : `refuse` dans le faux client, `todayStats` rend la nouvelle forme.
   - **Exclu** : le code ; `Mailbox.test.ts` sauf la forme de `todayStats` (`:40`) ; le lecteur de mail.
   - **Preuve** : les nouveaux tests échouent sur `main` pour la bonne raison.

3. - [ ] **Le serveur** (la session ou un agent général). Après 1.
   - `server/src/types.ts` : `'refused'` dans `ProposalView.status` ; `TodayStats` prend `ai`, `rule`, `refused`,
     `agent`, garde `autoFiled`, `validated`, `corrected` avec leur doc. Puis `npm run sync-types -w
     @lun-ecosystem/lunacedia-views`.
   - `server/src/triage/journal.ts` : `'refuse'` dans `UserAction` ; `todayStats` compte par `origin` et `action` :
     `ai`, `rule`, `autoFiled = ai + rule`, `validated`, `corrected`, `refused` pour CrOliX, `agent` pour toute ligne
     `pina`.
   - `server/src/triage/pipeline.ts` : `refuse(deps, id)` sur le modèle de `validate` : `pendingProposal`, le mail en
     boîte de réception sinon `ConflictError`, `snapshot`, statut `refused`, `remember(…, null, tags actuels)`,
     `logUser(changeOf(deps, id, undefined), 'refuse', …)`, rend la proposition et son `journalId`. Aucun appel à Gmail.
   - `server/src/triage/routes.ts` : `POST /mail/:id/refuse`. `parity.ts` : `{ action: 'mail.refuse' }`.
   - `server/src/contract/catalog.ts` : `mail.refuse` (`write`), « Laisse un mail en boîte de réception et refuse la
     proposition de tri. » ; `server/src/pina/wording.ts` : titre « Refuser la proposition de tri », fait
     « Proposition refusée » ; `npm run sync-types` recopie le texte.
   - `server/src/gmail/store.ts` : `inbox` et `pending` ajoutent `NOT has('TRASH') AND NOT has('SPAM')`. `viewQuery`
     ne change pas (Gmail exclut déjà la corbeille de la liste).
   - `server/src/demo/demo.ts` : un mail `m18` livré avec les autres, proposé à confiance moyenne par le classeur
     scripté, puis `POST /api/mail/m18/refuse` en mode écrans. Aucun mail de `seedPina` ni des scénarios touché.
   - **Exclu** : le front ; un libellé Gmail ; le refus en lot ; le bilan `day.digest` (`catalog.ts:468`).
   - **Preuve** : les tests de la tâche 1 au vert ; les barrières au vert ; `npm run demo` démarre. Si la clé de
     l'évaluation est dans le `.env`, `npm run pina:eval -w @lun-acedia/server`, sans jamais afficher la clé ; sinon,
     le dire.

4. - [ ] **Les écrans** (`dev-front` ; `views/src/lib/client.ts`, `Pending.svelte`, `Journal.svelte`,
   `views/src/lib/pina/cards.ts`). Après 2 et 3.
   - `client.ts` : `refuse(id)` vers `POST /api/mail/:id/refuse`, à côté de `validate` (`:338` et alentour).
   - `Pending.svelte` : un `IconButton` (icône `X` du kit, libellé « Laisser en boîte de réception ») dans `.actions`
     de chaque carte, avant « Corriger » ; il passe par `act()` avec le message de `done(m, null)` ramené à « Laissé en
     boîte de réception : … ». Au téléphone, il reste dans la rangée, icône seule. Pas de raccourci ni de geste de
     glisse nouveau.
   - `Pending.svelte` : les six tuiles de la décision 5 avec `plural()` ; la tuile de l'agent suit `agentIdentity`.
   - `Journal.svelte` : `by()` (`:148-152`) prend `refuse` → « refusée ». Rien d'autre : `where()` et `decider()` en
     donnent déjà le verbe et le filtre.
   - `cards.ts` : une icône pour `mail.refuse`, celle du bouton.
   - **Exclu** : le serveur ; le lecteur de mail et la boîte (`MailReader.svelte`, `Mailbox.svelte`) ; tout nouveau
     composant ; la DA.
   - **Preuve** : les tests de la tâche 2 au vert ; les barrières au vert.

5. - [ ] **La preuve dans Chrome sur la démo** (`dev-front`). Après 3 et 4.
   - `npm run demo`, puis Chrome : **au bureau** (largeur par défaut) et **au téléphone**, par l'émulation d'appareil
     des DevTools ou Chrome sans interface à 390 px de large. Pas une fenêtre redimensionnée.
   - **On attend** : dans « À valider », le bouton sur chaque carte ; un refus de `m02` retire la carte, le toast
     l'annule et la carte revient ; au Journal, la ligne de `m18` sous son texte et sous À la main ; « Rien à valider »
     (après avoir vidé la file) montre les six tuiles ; la boîte de réception ne liste plus `m15` ni `m16`, la corbeille
     les liste ; au téléphone, la rangée de la carte tient sans déborder et les tuiles passent à la ligne.
   - **Relevé** dans la PR : captures à chaque largeur (« À valider », Journal filtre À la main, « Rien à valider »,
     boîte de réception), sans donnée réelle.
   - **Exclu** : une vraie base ; un vrai compte Gmail.

## Risques

- **La rangée de la carte au téléphone.** Pastille, « Corriger », « Valider » et un bouton de plus à 390 px. La tâche 5
  le regarde ; si elle déborde, « Corriger » perd son texte au profit de l'icône, sans nouveau composant sans CrOliX.
- **Le contrat `stats.today` change de forme.** Les champs gardés gardent leur sens, les nouveaux s'ajoutent : un
  lecteur d'aujourd'hui ne casse pas. `validated` et `corrected` comptaient déjà CrOliX seul.
- **L'agent voit moins de mails en réception.** `mail.list` sur `inbox` ne rend plus la corbeille ni le spam : c'est
  plus juste, mais c'est un changement de ce qu'il lit. L'évaluation ne joue pas ces gestes ; son comportement n'est
  prouvé que si `pina:eval` tourne.
- **Une action de plus pour l'agent** (décision 4) allonge la liste de ses outils et peut changer ses choix dans les
  scénarios de la file.
- **Un refus apprend à l'IA** (décision 3) : refuser « par doute » la pousse vers « aucune boîte » pour ce genre de
  mail. L'annulation l'efface.

## Hors périmètre

Le refus depuis le lecteur de mail et la boîte (`MailReader.svelte:51`, `Mailbox.svelte:267`), et le refus d'un lot
(« Tout refuser »). Un raccourci clavier ou un geste de glisse pour le refus. Le compte des propositions en attente de
`day.digest` (`catalog.ts:468`), qui compte aussi celles d'un mail sorti de la réception. La planche 04 de la maquette,
qui n'est pas réécrite. L'archivage du Journal (Lun-Ecosystem/lun-acedia#33).

## Limites

- **Non vérifié sur un vrai compte** : ce que `messages.trash` fait à `INBOX`. La documentation ne le dit pas ; la
  décision 6 tient dans les deux cas.
- **Non lu** : le classeur scripté de la démo, pour l'entrée de `m18` (la tâche 3 la pose à côté des autres).
- L'évaluation de l'agent n'a pas été lancée pour ce plan.
