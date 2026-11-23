# Journal du tri : dire l'action et qui l'a décidée. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-acedia#86 (`niveau:standard`, public). Périmètre figé par CrOliX le 23/11, dans les
> commentaires de l'issue.
>
> **État : rédigé le 23/11 ; contesté le 23/11 (« à amender ») ; amendé le 23/11 avec deux décisions de CrOliX.**
> Les textes du tableau sont validés par CrOliX (décision 1).
>
> Code relu sur `main` de Lun'Acedia (`f00c2a8`) ; le graphe d'abord, puis chaque point dans le code. Lun'Acedia est
> public : ce plan ne porte ni adresse, ni compte, ni nom d'hôte.

**But :** chaque ligne du Journal dit ce qui est arrivé au mail et qui l'a décidé. Une validation ne se confond plus
avec un rangement automatique, une correction ou un geste vers la corbeille ne s'affiche plus « Archivé ». Les filtres
suivent ce découpage.

**Source :** l'issue, son cadrage et ses deux décisions du 23/11 (le refus d'une proposition sort du chantier, vers
Lun-Ecosystem/lun-acedia#88 ; l'agent a son propre filtre, à son nom). Les sept lignes vues par la session sur une
vraie base, toutes en `origin='user'` pour `validate`, `correct` et les gestes directs. La contestation du 23/11.

**Critères de fin**, ceux de l'issue, chacun prouvé en local :

1. **Chaque ligne dit l'action et qui l'a décidée**, avec un texte distinct pour chacun des sept cas : rangé seul par
   l'IA, proposition validée, proposition corrigée, geste direct, règle, agent, et la mention « annulé ». Tâches 1, 2.
2. **« Mis à la corbeille » et « Envoyé en Spam » dès que le mail y va**, quel que soit le geste : plus de faux
   « Archivé ». Tâches 1, 2.
3. **Filtres** : Tout, IA (rangé seul par l'IA et propositions validées), À la main (corrections et gestes directs),
   Règles, l'agent à son nom, Annulés. Tâches 1, 2.
4. **Un test par cas ; l'écran vérifié dans Chrome sur la démo**, bureau et téléphone. Tâches 1 à 4.
5. **Le refus d'une proposition ouvert en issue à part** : fait, Lun-Ecosystem/lun-acedia#88 (ouverte).

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-acedia` : le Journal, ses tests, la démo | `fix/journal-qui-decide` | Lun-Ecosystem/lun-acedia#86 | `standard` |
| `lun-docs` : ce plan et ses coches | `docs/journal-acedia` | la même | `trivial` |

Une PR par dépôt. Celle de Lun'Acedia ferme l'issue ; celle de lun-docs porte `Refs`.

## Les décisions de CrOliX, le 23/11

1. **Une proposition validée ou corrigée suit la règle courte** : `{verbe} {boîte}, proposition de l’IA
   validée|corrigée[ par {agent}]`, sans « par l’IA » ni « à la main ». Exemples validés : « Rangé dans Factures,
   proposition de l’IA validée » ; « Mis à la corbeille, proposition de l’IA corrigée » ; « Rangé dans Perso,
   proposition de l’IA corrigée par Agent » ; « Laissé en boîte de réception, proposition de l’IA validée ».
   Inchangés : « Rangé dans Voyages par l’IA », « Archivé à la main », « Rangé dans Newsletters par une règle ».
2. **Un seul filtre par ligne, celui du décideur.** Une validation ou une correction de l'agent est sous le filtre de
   l'agent seulement, ni sous IA, ni sous À la main.

## Ce que le code fait aujourd'hui

- **Qui écrit le Journal.** `logAuto` (`server/src/triage/journal.ts:44-62`) écrit les règles (`origin='rule'`,
  action `file`, `pipeline.ts:222`) et l'IA (`origin='ai'`, action `file`, `trash` ou `spam`, `pipeline.ts:283` et
  `actionOf`, `:106`). `logUser` (`journal.ts:70-91`) écrit **toujours** `origin='user'`, avec l'action `validate`
  (`pipeline.ts:404`), `correct` (`:447`), ou `file`, `archive`, `trash`, `spam` pour un geste direct
  (`afterUserAction`, `:475-481`). `markPina` (`journal.ts:65-67`) repasse en `origin='pina'` une ligne que l'agent
  vient d'écrire par le catalogue (`server/src/pina/agent.ts:116`). L'agent peut aussi valider et corriger
  (`server/src/contract/catalog.ts:140-148`) : sa ligne garde alors l'action `validate` ou `correct`.
- **Ce que renvoie la liste.** `toEntry` (`journal.ts:105-117`) : `origin`, `action`, `before`, `after`, `undoneAt`,
  et l'objet du mail. Tout ce qu'il faut pour distinguer les sept cas est déjà là.
- **Où va le mail, côté Gmail.** Une proposition vers la corbeille passe par `trashMail`, vers le spam par
  `reportSpam` qui ajoute `SPAM` et retire `INBOX` (`server/src/gmail/actions.ts:98`), vers une boîte par `fileMail`.
  `fileMail` retire toujours `INBOX`, et n'ajoute pas la boîte si le mail y est déjà (`actions.ts:76-82`). Une
  proposition sans boîte ne touche que les étiquettes (`applyTarget`, `pipeline.ts:83-104`). La corbeille garde
  `INBOX`, dans le faux Gmail de la démo (`server/src/testing/fake-gmail.ts:297-304`).
- **Le verbe affiché.** `where()` (`views/src/lib/mail/Journal.svelte:121-131`) ne reconnaît la corbeille que pour
  `action === 'trash'` et le spam que pour `action === 'spam'` (`:122-123`). Une validation ou une correction vers la
  corbeille ou le spam garde l'action `validate` ou `correct` : sans boîte ajoutée, `INBOX` retiré, elle tombe sur
  « Archivé » (`:126-127`). **Constat vérifié.** La boîte n'est lue que si elle est ajoutée (`:124`) : une correction
  vers la boîte où le mail était déjà dit aussi « Archivé ». Vers une boîte ajoutée, la ligne dit « Rangé dans … »
  (`:124-125`) ; « Proposition validée » et « Proposition corrigée » (`:128-129`) ne se lisent que si rien n'a bougé.
- **Qui l'a décidé.** `ORIGINS` (`Journal.svelte:54-59`) ne lit que `origin` : une validation dit « à la main », avec
  l'icône de la main. **Constat vérifié.** Le nom de l'agent suit ses réglages (`agentIdentity`, neutre « Agent » par
  défaut, `views/src/lib/pina/identity.svelte.ts:17`).
- **Les filtres.** `FILTERS` (`Journal.svelte:61-66`) est une constante : Tout, IA (`origin === 'ai'`), Règles,
  Annulés. Ni la main, ni l'agent n'ont de filtre. Les puces défilent en largeur sur un téléphone (`.filtres`,
  `:361-366`).
- **La lecture d'écran.** `rowLabel` (`:134-138`) reprend le verbe et `ORIGINS[…].by` ; il suit donc les mêmes
  textes. **L'annulation** : `undoneText` (`:141-145`) écrit « annulé à 18:41 » ou « annulé le 21 oct. », et la ligne
  montre le badge « Annulé » (`:276-277`). Une annulation n'écrit pas de ligne : elle date la ligne annulée
  (`journal.ts:175`).
- **Les gestes en lot** écrivent une ligne par mail (`afterUserAction` par mail ; `journal.test.ts:234-270`). Un geste
  `file` règle la proposition en attente (`onManualFile`, `pipeline.ts:455-461`) ; les autres gestes la laissent en
  attente.
- **La démo** (`server/src/demo/demo.ts:510-517`), relue en la lançant : six propositions en attente (`m01`, `m02`,
  `m03`, `m06`, `m11`, `m15`) ; au Journal, trois règles (`m05`, `m08`, `m14`), quatre lignes de l'IA (`m04`, `m09`,
  `m10` en spam, `m13`), l'archivage à la main de `m07`, le rangement de l'agent sur `m12`. **Il manque** une
  validation, une correction, une corbeille à la main, une ligne annulée. `demo.test.ts:11` attend six propositions
  en attente, `:13` plus de quatre lignes.
- **Ce que la démo ne doit pas toucher.** `seedPina` sert `m12` et `m06` (`demo.ts:291-330`). Les scénarios de
  l'évaluation de l'agent (`server/src/pina/eval/scenarios.ts`) servent `m02`, `m03`, `m04`, `m06`, `m11`, et
  ajoutent `m90` à `m93` ; `server/scripts/pina-eval.ts:83-93` refuse un scénario dont un mail de `inbox` (`m02`,
  `m03`, `m11`) n'a plus `INBOX`. Les mails ajoutés après la synchronisation n'ont pas de proposition
  (`pina-eval.ts:70-81` fait de même).
- **Les tests du Journal** (`views/src/lib/mail/Journal.test.ts`) : la fabrique `entry()` (`:17-28`) ; les textes
  (`:56-73`) ; les filtres (`:75-93`). Aucun ne couvre `validate`, `correct` ni l'agent.

**Le front suffit.** `origin`, `action` et les étiquettes avant et après distinguent déjà chaque cas. **Côté serveur :
rien**, hors la démo et deux tests de garde. Le schéma, la route et le contrat ne bougent pas.

## Qui décide, et quel texte

Une seule fonction du front classe chaque ligne : **qui a décidé**. Une ligne a un seul filtre, celui de son décideur
(décision 2), plus Annulés si elle est annulée.

| `origin` | `action` | Qui a décidé | Icône | Filtre |
|---|---|---|---|---|
| `ai` | toutes | l'IA | IA | IA |
| `user` | `validate` | l'IA, CrOliX a dit oui | IA | IA |
| `user` | `correct` | CrOliX | main | À la main |
| `user` | `file`, `archive`, `trash`, `spam` | CrOliX | main | À la main |
| `rule` | `file` | une règle | entonnoir | Règles |
| `pina` | toutes, `validate` et `correct` compris | l'agent | celle de l'agent | l'agent, à son nom |

**Où va le mail** se lit dans `after`, dans cet ordre :

1. `TRASH` ajouté : « Mis à la corbeille » (avant tout le reste : la corbeille peut garder `INBOX`).
2. `SPAM` ajouté : « Envoyé en Spam ».
3. Une boîte ajoutée, **ou** une boîte déjà présente quand `INBOX` part : « Rangé dans … ».
4. `INBOX` retiré, sans boîte : « Archivé ».
5. `INBOX` encore dans `after` : « Laissé en boîte de réception ». Jamais sur la seule action.

### Les textes, validés par CrOliX

Les boîtes sont inventées. « Agent » est le nom neutre par défaut : la ligne prend le nom réglé. Les textes ajoutés ne
recopient aucune valeur de Google : seuls l'objet et le nom de la boîte, déjà affichés, viennent du mail.

| Cas | Exemple de ligne |
|---|---|
| 1. Rangé seul par l'IA | Rangé dans **Voyages** par l’IA |
| | Envoyé en **Spam** par l’IA |
| | Mis à la corbeille par l’IA |
| 2. Proposition validée | Rangé dans **Factures**, proposition de l’IA validée |
| | Envoyé en **Spam**, proposition de l’IA validée |
| | Laissé en boîte de réception, proposition de l’IA validée |
| 3. Proposition corrigée | Rangé dans **Perso**, proposition de l’IA corrigée |
| | Mis à la corbeille, proposition de l’IA corrigée |
| 4. Geste direct | Rangé dans **Perso** à la main |
| | Archivé à la main |
| | Mis à la corbeille à la main |
| | Envoyé en **Spam** à la main |
| 5. Règle | Rangé dans **Newsletters** par une règle |
| 6. Agent | Rangé dans **Perso** par Agent |
| | Rangé dans **Factures**, proposition de l’IA validée par Agent |
| | Rangé dans **Perso**, proposition de l’IA corrigée par Agent |
| 7. Annulé | Rangé dans **Factures**, proposition de l’IA validée · annulé à 18:41, badge « Annulé » |
| | Le lendemain ou plus tard : « · annulé le 21 oct. » |

**La lecture d'écran** (`aria-label` de la ligne) suit le même texte, en minuscule après l'objet :

- « Facture d’octobre : rangé dans Factures, proposition de l’IA validée, annulé à 18:41 » ;
- « Nouveautés d’octobre : mis à la corbeille, proposition de l’IA corrigée » ;
- « Photos du week-end : rangé dans Perso par Agent ».

| Filtre | Libellé | Icône | Garde |
|---|---|---|---|
| 1 | Tout | aucune | toutes les lignes |
| 2 | IA | IA | cas 1 et 2 |
| 3 | À la main | main | cas 3 et 4 |
| 4 | Règles | entonnoir | cas 5 |
| 5 | le nom de l'agent (« Agent » par défaut) | celle de l'agent | cas 6, ses validations et corrections comprises |
| 6 | Annulés | aucune | les lignes annulées, quel que soit leur cas |

Une ligne annulée reste aussi sous le filtre de son décideur, comme aujourd'hui.

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit échouer ; un développeur écrit le code ; le
**reviewer** relit le diff. Elle se ferme sur les barrières de Lun'Acedia au vert : `npm test`, `npm run lint`,
`npm run typecheck`, `npm run format:check`, `npm run check:colors`.

**Qui écrit le code.** `dev-front` fait les écrans (`lun-docs/plugin/agents/dev-front.md`) : la tâche 2 et la
vérification de la tâche 4. `dev-core` est le développeur du core privé, pas d'Acedia. **Aucun agent de métier ne
couvre le serveur d'Acedia** : la tâche 3 (`server/src/demo/`) revient à la session, ou à un agent général à qui l'on
donne ce plan.

**L'ordre.** **1 et 3 partent en parallèle** (aucun fichier commun : 1 les tests du Journal et `journal.test.ts`, 3
la démo et `demo.test.ts`). 2 attend 1. 4 attend 2 et 3.

1. - [ ] **Les tests du Journal, rouges** (testeur ; `views/src/lib/mail/Journal.test.ts` et
   `server/src/triage/journal.test.ts`).
   - Avec la fabrique `entry()` (`:17-28`), un test par ligne du tableau des textes, sur le texte de la ligne
     (`toHaveTextContent`) et le nom de l'icône (`getByRole('img', { name })`).
   - **Le faux « Archivé »** : `user` `correct`, `before: ['INBOX']`, `after: ['INBOX', 'TRASH']`, dit « Mis à la
     corbeille, proposition de l’IA corrigée » ; `validate`, `after: ['SPAM']`, dit « Envoyé en Spam, proposition de
     l’IA validée » ; `correct` vers la boîte d'origine (`before: ['INBOX', 'L-ecole']`, `after: ['L-ecole']`) dit
     « Rangé dans École, proposition de l’IA corrigée ».
   - **« Laissé en boîte de réception »** seulement quand `INBOX` reste dans `after` ; une ligne `validate` qui l'a
     perdue sans boîte dit « Archivé, proposition de l’IA validée ».
   - **Un geste `file` vers la boîte proposée** reste un geste direct : « Rangé dans École à la main », icône main.
   - **Les filtres** : les six puces dans l'ordre du tableau ; chaque filtre garde ses cas ; une validation et une
     correction de l'agent ne sont que sous la puce de l'agent ; la puce porte le nom réglé (régler
     `agentIdentity.name` dans le test, puis le remettre).
   - **La lecture d'écran** : les trois `aria-label` donnés plus haut, mot pour mot.
   - **Deux tests de garde côté serveur** (`journal.test.ts`, verts dès l'écriture) : un lot de deux mails écrit deux
     lignes ; une annulation n'ajoute aucune ligne au Journal.
   - Les tests d'aujourd'hui (`Journal.test.ts:56-93`) gardent leurs attendus, sauf la liste des filtres.
   - **Exclu** : le code ; tout autre fichier de test.
   - **Preuve** : les nouveaux tests du front échouent sur `main` pour la bonne raison (texte ou filtre absent).

2. - [ ] **Le Journal dit qui a décidé** (`dev-front` ; `views/src/lib/mail/Journal.svelte` seulement). Après 1.
   - Une fonction qui rend **qui a décidé** d'après `origin` et `action` (tableau « Qui décide »). `ORIGINS` devient
     indexé par elle : libellé, « par … », icône. La classe de l'icône (`origine`, `:248`) suit, pour la couleur de
     l'IA et de l'agent (`:404-405`).
   - `where()` suit l'ordre des cinq règles plus haut ; les branches « Proposition validée / corrigée » (`:128-129`)
     partent.
   - Une ligne `validate` ou `correct` prend la règle courte (décision 1) : le verbe, la boîte, puis
     « , proposition de l’IA validée » ou « corrigée », puis « par {agent} » pour l'agent ; ni « par l’IA », ni « à
     la main ». Même texte dans la ligne (`:270`) et dans `rowLabel`.
   - **`FILTERS` devient dérivé** (`$derived`), comme `ORIGINS` : la puce de l'agent suit `agentIdentity`. Chaque
     filtre garde les lignes de son décideur (décision 2).
   - **Exclu** : le serveur ; les compteurs ; l'archivage du Journal ; tout nouveau composant.
   - **Preuve** : les tests de la tâche 1 au vert ; les barrières au vert.

3. - [ ] **La démo montre chaque cas** (testeur pour `demo.test.ts`, puis la session pour `server/src/demo/demo.ts`).
   - **Deux mails ajoutés** à la démo : `m16`, livré et synchronisé **après** le tri (`syncGmail` sans `triageNew`,
     comme `pina-eval.ts:70-81`), donc sans proposition ; `m17`, un spam proposé à confiance moyenne (80), livré avec
     les autres, donc en attente.
   - Après les gestes d'aujourd'hui (`demo.ts:512-517`), par les routes de la démo :
     - **valider** `m01` vers sa boîte (`POST /api/mail/m01/validate`) : « Rangé dans Factures, proposition de l’IA
       validée » ;
     - **valider** `m17` (spam) : « Envoyé en Spam, proposition de l’IA validée » ;
     - **corriger** `m15` vers la corbeille (`POST /api/mail/m15/correct`, `boxId: 'trash'`) : « Mis à la corbeille,
       proposition de l’IA corrigée » ;
     - **mettre à la corbeille** `m16` à la main (`POST /api/mail/batch`, `kind: 'trash'`) : sans proposition, il ne
       reste pas dans « À valider » alors que la corbeille garde `INBOX` ;
     - **annuler** la ligne de règle de `m08` (`POST /api/journal/:id/undo`), sa seule ligne.
   - **Aucun mail de `seedPina` (`m06`, `m12`) ni des scénarios (`m02`, `m03`, `m04`, `m06`, `m11`, `m90` à `m93`)**
     n'est touché.
   - **Les propositions en attente** : sept au départ avec `m17` ; `m01`, `m15` et `m17` réglées ; il en reste
     **quatre** (`m02`, `m03`, `m06`, `m11`). `demo.test.ts:11` passe de six à quatre ; le test vérifie aussi une
     ligne `validate` vers une boîte, une `validate` vers le spam, une `correct` vers la corbeille, une `trash` à la
     main, une ligne annulée.
   - **Exclu** : toute ligne de l'agent en plus (les tests de la tâche 1 la couvrent) ; le reste de la démo.
   - **Preuve** : `npm test` au vert ; `npm run demo` démarre ; **les préconditions de l'évaluation** : `m02`, `m03`
     et `m11` portent encore `INBOX` après la démo (une assertion dans `demo.test.ts`). Si la clé de l'évaluation est
     dans le `.env`, `npm run pina:eval -w @lun-acedia/server` en plus, sans jamais afficher la clé ; sinon, le dire.

4. - [ ] **L'écran vérifié dans Chrome sur la démo** (`dev-front`). Après 2 et 3.
   - `npm run demo`, puis Chrome sur le Journal : **au bureau** (largeur par défaut) et **au téléphone**, par
     l'émulation d'appareil des DevTools ou Chrome sans interface à 390 px de large. Pas une fenêtre redimensionnée.
   - **On attend** : chaque ligne de la démo sous son texte du tableau ; aucun « Archivé » pour `m15` ni `m17` ; les
     six puces, celle de l'agent à son nom ; chaque filtre garde ses lignes ; au téléphone, les puces défilent sans
     déborder de la page et la ligne garde son complément lisible.
   - **Relevé** dans la PR : deux captures par largeur (filtre Tout, filtre À la main), sans donnée réelle.
   - **Exclu** : une vraie base ; tout réglage de la DA.

## Risques

- **La ligne s'allonge.** « …, proposition de l’IA corrigée par Agent » reste long au téléphone. La tâche 4 le
  regarde ; si elle déborde, la ligne passe à la ligne, sans nouveau composant ni nouveau texte sans CrOliX.
- **La boîte de réception de la démo** compte deux mails de plus portant `INBOX` (`m15` et `m16`, à la corbeille) et
  `m08` y revient. Les scénarios « boîte de réception » de l'évaluation les voient. La précondition `inbox` tient ;
  le comportement de l'agent n'est prouvé que si `pina:eval` tourne.
- **Les vieilles lignes** gardent leurs étiquettes : elles prennent les nouveaux textes sans migration. Une ligne
  `validate` déjà écrite passe de « À la main » au filtre IA.

## Hors périmètre

Le refus d'une proposition (Lun-Ecosystem/lun-acedia#88). Les compteurs du jour (Lun-Ecosystem/lun-acedia#89).
L'archivage et l'affichage borné du Journal (Lun-Ecosystem/lun-acedia#33). Le retour de Google
(Lun-Ecosystem/lun-acedia#84). La planche 07 de la maquette
(`docs/maquettes/2026-10-21-recadrage-front/07-journal.html`),
qui n'est pas réécrite.

## Limites

- Non vérifié ailleurs que dans le code : les sept lignes de la vraie base (constat de la session, pas relu ici) ;
  ce que fait la vraie corbeille de Gmail à `INBOX` (la règle 1 de « Où va le mail » vaut dans les deux cas).
- L'évaluation de l'agent n'a pas été lancée pour ce plan.
