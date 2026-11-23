# Journal du tri : dire l'action et qui l'a décidée. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-acedia#86 (`niveau:standard`, public). Périmètre figé par CrOliX le 23/11, dans les
> commentaires de l'issue.
>
> **État : rédigé le 23/11, à contester puis à valider par CrOliX.** Les textes du tableau plus bas attendent sa
> relecture.
>
> Code relu sur `main` de Lun'Acedia (`f00c2a8`) ; le graphe d'abord, puis chaque point dans le code. Lun'Acedia est
> public : ce plan ne porte ni adresse, ni compte, ni nom d'hôte.

**But :** chaque ligne du Journal dit ce qui est arrivé au mail et qui l'a décidé. Une validation ne se confond plus
avec un rangement automatique, une correction ou un geste vers la corbeille ne s'affiche plus « Archivé ». Les filtres
suivent ce découpage.

**Source :** l'issue, son cadrage et ses deux décisions du 23/11 (le refus d'une proposition sort du chantier, vers
Lun-Ecosystem/lun-acedia#88 ; l'agent a son propre filtre, à son nom). Les sept lignes vues par la session sur une
vraie base, toutes en `origin='user'` pour `validate`, `correct` et les gestes directs.

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
  `reportSpam` qui ajoute `SPAM` et retire `INBOX` (`server/src/gmail/actions.ts:98`), vers une boîte par `fileMail`
  qui retire toujours `INBOX` (`actions.ts:76-82`). Une proposition sans boîte ne touche que les étiquettes
  (`applyTarget`, `pipeline.ts:83-104`).
- **Le verbe affiché.** `where()` (`views/src/lib/mail/Journal.svelte:121-131`) ne reconnaît la corbeille que pour
  `action === 'trash'` et le spam que pour `action === 'spam'` (`:122-123`). Une validation ou une correction vers la
  corbeille ou le spam garde l'action `validate` ou `correct` : sans boîte ajoutée, `INBOX` retiré, elle tombe sur
  « Archivé » (`:126-127`). **Constat vérifié.** Vers une boîte, elle s'affiche « Rangé dans … » (`:124-125`) ;
  « Proposition validée » et « Proposition corrigée » (`:128-129`) ne se lisent que si le mail n'a pas bougé.
- **Qui l'a décidé.** `ORIGINS` (`Journal.svelte:54-59`) ne lit que `origin` : une validation dit « à la main », avec
  l'icône de la main. **Constat vérifié.** Le nom de l'agent suit ses réglages (`agentIdentity`, neutre « Agent » par
  défaut, `views/src/lib/pina/identity.svelte.ts:17`).
- **Les filtres.** `FILTERS` (`Journal.svelte:61-66`) : Tout, IA (`origin === 'ai'`), Règles, Annulés. Ni la main, ni
  l'agent n'ont de filtre. Les puces défilent en largeur sur un téléphone (`.filtres`, `:361-366`).
- **La lecture d'écran.** `rowLabel` (`:134-138`) reprend le verbe et `ORIGINS[…].by` ; il suit donc les mêmes
  textes. **L'annulation** : `undoneText` (`:141-145`) écrit « annulé à 18:41 » ou « annulé le 21 oct. », et la ligne
  montre le badge « Annulé » (`:276-277`). Rien à changer ici.
- **Les compteurs.** `todayStats` (`journal.ts:222-241`) compte `validated` et `corrected` sur `origin='user'`, et
  `autoFiled` sur les règles et l'IA. Ils servent à « À valider » (`views/src/lib/mail/Pending.svelte:438-441`) et à
  la boîte (`Mailbox.svelte:119-120`). Ils ne passent pas par le Journal et ne changent pas (plus bas, Limites).
- **La démo** (`server/src/demo/demo.ts:510-517`) : des rangements par règle et par l'IA (dont un spam à 98), un
  archivage à la main (`m07`), un rangement de l'agent (`m12`). **Il manque** une validation, une correction, un geste
  vers la corbeille ou le spam, une ligne annulée. `demo.test.ts:11` attend six propositions en attente, `:13` plus de
  quatre lignes au Journal.
- **Les tests du Journal** (`views/src/lib/mail/Journal.test.ts`) : la fabrique `entry()` (`:17-28`) ; les textes
  (`:56-73`) ; les filtres (`:75-93`). Aucun ne couvre `validate`, `correct` ni l'agent.

**Le front suffit.** `origin`, `action` et les étiquettes avant et après distinguent déjà chaque cas. **Côté serveur :
rien**, hors la démo. Le schéma, la route et le contrat ne bougent pas.

## Qui décide, et quel texte

Une seule fonction du front classe chaque ligne : **qui a décidé**.

| `origin` | `action` | Qui a décidé | Icône | Filtre |
|---|---|---|---|---|
| `ai` | toutes | l'IA | IA | IA |
| `user` | `validate` | l'IA, CrOliX a dit oui | IA | IA |
| `user` | `correct` | CrOliX | main | À la main |
| `user` | `file`, `archive`, `trash`, `spam` | CrOliX | main | À la main |
| `rule` | `file` | une règle | entonnoir | Règles |
| `pina` | toutes | l'agent | celle de l'agent | l'agent, à son nom |

**Où va le mail** se lit dans les étiquettes, plus dans l'action : `TRASH` ajouté, « Mis à la corbeille » ; `SPAM`
ajouté, « Envoyé en Spam » ; une boîte ajoutée, « Rangé dans … » ; `INBOX` retiré sans boîte, « Archivé ». Une
validation sans boîte (étiquettes seules) dit « Laissé en boîte de réception ».

### Les textes proposés, à relire par CrOliX

Les boîtes sont inventées. « Agent » est le nom neutre par défaut : la ligne prend le nom réglé. Les textes ajoutés ne
recopient aucune valeur de Google : seuls l'objet et le nom de la boîte, déjà affichés, viennent du mail.

| Cas | Exemple de ligne |
|---|---|
| 1. Rangé seul par l'IA | Rangé dans **Voyages** par l’IA |
| | Envoyé en **Spam** par l’IA |
| | Mis à la corbeille par l’IA |
| 2. Proposition validée | Rangé dans **Factures** par l’IA, proposition validée |
| | Envoyé en **Spam** par l’IA, proposition validée |
| 3. Proposition corrigée | Rangé dans **Perso** à la main, proposition de l’IA corrigée |
| | Mis à la corbeille à la main, proposition de l’IA corrigée |
| 4. Geste direct | Rangé dans **Perso** à la main |
| | Archivé à la main |
| | Mis à la corbeille à la main |
| | Envoyé en **Spam** à la main |
| 5. Règle | Rangé dans **Newsletters** par une règle |
| 6. Agent | Rangé dans **Perso** par Agent |
| | Rangé dans **Factures** par l’IA, proposition validée par Agent |
| | Rangé dans **Perso** par Agent, proposition de l’IA corrigée |
| 7. Annulé | Rangé dans **Factures** par l’IA, proposition validée · annulé à 18:41, badge « Annulé » |
| | Le lendemain ou plus tard : « · annulé le 21 oct. » |

La lecture d'écran suit : « Facture d’octobre : rangé dans Factures par l’IA, proposition validée, annulé à 18:41 ».
Une validation sans boîte : « Laissé en boîte de réception par l’IA, proposition validée ».

| Filtre | Libellé | Icône | Garde |
|---|---|---|---|
| 1 | Tout | aucune | toutes les lignes |
| 2 | IA | IA | cas 1 et 2 |
| 3 | À la main | main | cas 3 et 4 |
| 4 | Règles | entonnoir | cas 5 |
| 5 | le nom de l'agent (« Agent » par défaut) | celle de l'agent | cas 6 |
| 6 | Annulés | aucune | les lignes annulées, quel que soit leur cas |

Une ligne annulée reste aussi sous le filtre de qui l'a décidée, comme aujourd'hui.

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit échouer ; `dev-front` écrit le code ; le
**reviewer** relit le diff. Elle se ferme sur les barrières de Lun'Acedia au vert : `npm test`, `npm run lint`,
`npm run typecheck`, `npm run format:check`, `npm run check:colors`.

**L'ordre.** **1 et 3 partent en parallèle** (aucun fichier commun : 1 `Journal.test.ts`, 3 la démo). 2 attend 1. 4
attend 2 et 3.

1. - [ ] **Les tests du Journal, rouges** (testeur ; `views/src/lib/mail/Journal.test.ts` seulement).
   - Avec la fabrique `entry()` (`:17-28`), un test par cas du tableau, sur le texte de la ligne
     (`toHaveTextContent`) et le nom de l'icône (`getByRole('img', { name })`) : IA seul (boîte, spam, corbeille) ;
     validée vers une boîte et vers le spam ; corrigée vers une boîte et vers la corbeille ; gestes directs (rangé,
     archivé, corbeille, spam) ; règle ; agent (geste, validation, correction) ; annulée.
   - **Le faux « Archivé »** : une ligne `user` `correct` avec `before: ['INBOX']`, `after: ['TRASH']` dit
     « Mis à la corbeille », jamais « Archivé » ; de même `validate` avec `after: ['SPAM']` dit « Envoyé en Spam ».
   - **Les filtres** : les six puces dans l'ordre du tableau ; chaque filtre garde les cas dits ; la puce de l'agent
     porte le nom réglé (régler `agentIdentity.name` dans le test, puis le remettre).
   - **La lecture d'écran** : l'`aria-label` d'une ligne validée et annulée, mot pour mot.
   - Les tests d'aujourd'hui (`:56-93`) gardent leurs attendus, sauf la liste des filtres.
   - **Exclu** : tout autre fichier de test ; le code.
   - **Preuve** : les nouveaux tests échouent sur `main` pour la bonne raison (texte ou filtre absent).

2. - [ ] **Le Journal dit qui a décidé** (`dev-front` ; `views/src/lib/mail/Journal.svelte` seulement). Après 1.
   - Une fonction qui rend **qui a décidé** d'après `origin` et `action` (tableau « Qui décide »). `ORIGINS` devient
     indexé par elle : libellé, « par … », icône. La classe de l'icône (`origine`, `:248`) suit, pour la couleur de
     l'IA et de l'agent (`:404-405`).
   - `where()` lit les étiquettes : `TRASH` ou `SPAM` ajouté avant toute boîte ; « Laissé en boîte de réception » pour
     une validation qui ne déplace rien. Les branches « Proposition validée / corrigée » (`:128-129`) partent.
   - Le complément « , proposition validée » ou « , proposition de l’IA corrigée » (suivi de « par {agent} » pour une
     ligne de l'agent), dans la ligne (`:270`) et dans `rowLabel`.
   - `FILTERS` : les six filtres du tableau ; le libellé de l'agent suit `agentIdentity`, comme `ORIGINS`.
   - **Exclu** : le serveur ; les compteurs ; l'archivage du Journal ; tout nouveau composant.
   - **Preuve** : les tests de la tâche 1 au vert ; les barrières au vert.

3. - [ ] **La démo montre chaque cas** (testeur pour `demo.test.ts`, puis `dev-front` pour `server/src/demo/demo.ts`).
   - Après les gestes d'aujourd'hui (`demo.ts:512-517`), par les routes de la démo : **valider** la proposition de spam
     sous le seuil (`m03`, `POST /api/mail/:id/validate`) ; **corriger** une autre proposition vers la corbeille
     (`POST /api/mail/:id/correct`, `boxId: 'trash'`) ; **mettre à la corbeille** à la main un mail sans proposition ;
     **annuler** une ligne de règle (`POST /api/journal/:id/undo`). Ne toucher à aucun mail que `seedPina` utilise
     (`:291-330`).
   - `demo.test.ts` : les propositions en attente passent de six à quatre (`:11`) ; le Journal porte une ligne
     `validate`, une `correct`, une `trash` à la main, une annulée.
   - **Exclu** : la validation d'une proposition vers une boîte, et toute ligne de l'agent en plus (les tests de la
     tâche 1 les couvrent) ; le reste de la démo.
   - **Preuve** : `npm test` au vert ; `npm run demo` démarre.

4. - [ ] **L'écran vérifié dans Chrome sur la démo** (`dev-front`). Après 2 et 3.
   - `npm run demo`, puis Chrome sur le Journal : **au bureau** (largeur par défaut) et **au téléphone** (fenêtre
     réduite à 390 px de large).
   - **On attend** : chacun des cas de la démo sous son texte ; plus aucun « Archivé » pour la corbeille ou le spam ;
     les six puces, celle de l'agent à son nom ; chaque filtre garde ses lignes ; au téléphone, les puces défilent sans
     déborder de la page et la ligne garde son complément lisible.
   - **Relevé** dans la PR : deux captures par largeur (filtre Tout, filtre À la main), sans donnée réelle.
   - **Exclu** : une vraie base ; tout réglage de la DA.

## Risques

- **La ligne s'allonge.** « …, proposition de l’IA corrigée » double presque la ligne au téléphone. La tâche 4 le
  regarde ; si elle déborde, CrOliX choisit un texte plus court dans le tableau, pas un nouveau composant.
- **Une ligne `correct` vers la même boîte** (le mail y était déjà) ne montre pas de boîte ajoutée : elle dirait
  « Rangé … à la main, proposition de l’IA corrigée » sans boîte. Rare ; le test de la tâche 1 fige ce texte.
- **Les vieilles lignes** gardent leurs étiquettes : elles prennent les nouveaux textes sans migration. Une ligne
  `validate` déjà écrite passe de « À la main » au filtre IA.

## Hors périmètre

Le refus d'une proposition (Lun-Ecosystem/lun-acedia#88). L'archivage et l'affichage borné du Journal
(Lun-Ecosystem/lun-acedia#33). Le retour de Google (Lun-Ecosystem/lun-acedia#84). Les compteurs du jour. La planche 07
de la maquette (`docs/maquettes/2026-10-21-recadrage-front/07-journal.html`), qui n'est pas réécrite.

## Limites

- **Les compteurs** ne suivent pas le découpage : « rangés seuls » compte aussi les règles, et une validation de
  l'agent n'est comptée nulle part (`journal.ts:233-239`). Le cadrage disait « s'il y en a, suivent le même
  découpage » ; les critères figés n'en parlent pas. **CrOliX tranche** : suite en issue, ou dans ce chantier.
- Non vérifié ailleurs que dans le code : les sept lignes de la vraie base (constat de la session, pas relu ici) ;
  qu'aucun mail de la démo choisi en tâche 3 ne serve à `seedPina` (le développeur le relit).
- Les textes du tableau attendent CrOliX.
