# Acedia, trancher sans risque, la suite : le focus décide, un geste à la fois. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** Lun-Ecosystem/lun-acedia#95 (le clavier de l'À valider) et Lun-Ecosystem/lun-acedia#93 (un geste qui
> se glisse pendant l'appel à Gmail), `niveau:standard`. Pas de chapeau : tout le code est dans Lun'Acedia. Le
> chantier prolonge [Trancher sans risque](2026-11-24-trancher-sans-risque.md) (lun-docs#203, fusionné), qui a
> corrigé le même clavier dans Lun'Avaritia (lun-avaritia#47) et rangé ce défaut-ci dans son hors périmètre.
>
> **État : rédigé le 24/11 ; contesté le 24/11 ; amendé le 24/11** avec les objections du contradicteur, relues
> dans le code (« Ce que la contestation a changé »). Choisi par CrOliX le 24/11 au soir, en attendant la preuve de
> la première nuit avec la 0.3.0.
>
> Code relu sur `main` : lun-acedia `864b6b6` (la 0.3.0), lun-avaritia `7e2c1b5` (le précédent, #47), lun-docs
> `b49ac9c`. Le graphe d'abord, puis chaque ligne citée. Lun'Acedia est public : rien du core ici.

**But :** pendant la semaine de rodage, CrOliX tranche chaque jour ses vrais mails. Aucune touche ne tranche une
proposition qu'il ne regarde pas. Un second geste sur la même proposition ne laisse ni deux lignes au Journal, ni de
faux compteurs, ni un mail rangé sans trace. C'est la promesse du contrôle ([`vision.md`](../../vision.md), point 5).

**Source :** les deux issues ; le plan précédent (son choix 3, « le focus décide ») ; le code d'Avaritia après #47 ;
le test du refus qui se glisse pendant la lecture de Gmail (`lun-acedia/server/src/triage/journal.test.ts:437-453`) ;
la contestation du 24/11.

## Critères de fin

1. **Sans carte au focus, V, Maj+V et C ne tranchent rien** et n'ouvrent rien ; V tenu enfoncé ne tranche qu'une
   fois. J et K donnent le focus à la file sans rien trancher. Avec une carte au focus, rien ne change. Tests.
   Tâches 2, 4, 5.
2. **Les indications disent vrai** : une touche n'est annoncée que là où elle agit. Tests et Chrome. Tâches 2, 4, 5.
3. **Un geste qui se glisse pendant l'appel à Gmail reçoit 409 avant de toucher Gmail** : une seule ligne au
   Journal, des compteurs du jour justes, aucun mail rangé sans ligne. Un test par geste (`validate`, `correct`),
   Gmail retenu pendant l'appel. Tâches 1, 3.
4. **Rien ne s'écrit avant la réponse de Gmail** : Gmail en échec, ou le serveur arrêté pendant l'appel, laisse la
   proposition en attente, sans ligne. Test. Tâches 1, 3.
5. **Sur un 409, l'écran dit le message du serveur et retire la carte.** Test et Chrome. Tâches 2, 5.
6. **Le reste ne bouge pas** : le refus, l'annulation, « Tout valider », les boutons des cartes et des groupes, le
   glissé tactile, l'agent, la correction d'un mail rangé seul par l'IA. Les tests d'aujourd'hui restent verts, sauf
   ceux que les tâches 1 et 2 réécrivent. Toutes.
7. **Barrières d'Acedia vertes** ; preuve dans Chrome sur la démo, jamais sur la prod. Tâche 5.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-acedia` : le clavier, le verrou | `fix/trancher-sans-risque-suite` | #95, #93 | `standard` |
| `lun-docs` : ce plan, ses coches | `docs/acedia-trancher-suite` | #95, #93 | `trivial` |

Les deux issues sont celles de Lun'Acedia.

**Le niveau.** `standard` : un comportement du clavier change, et deux gestes du serveur prennent un verrou. Rien
de nouveau en base, pas de migration, le contrat ne change pas.

## Ce que le code fait aujourd'hui

Chemins relatifs à `lun-acedia/`.

### L'À valider, le clavier (#95)

- **`current`** (`views/src/lib/mail/Pending.svelte:67`) est la carte du clavier. Il est posé quand la carte
  elle-même prend le focus (`onfocus`, `:539`, qui ne remonte pas d'un bouton), au clic (`:540-543`), par un geste
  qui passe à la suivante (`:214-218`) et par J ou K (`:294`). Rien ne l'efface quand le focus sort.
- **`active`** vaut cette carte, sinon **la première** (`:92`). Il sert à cinq choses : la cible des raccourcis
  (`:302-305`), le départ de J et K (`:292`), le passage à la suivante après un geste (`:214`), le fond et
  `aria-current` (`:534-535`), le seul arrêt de Tab de la file (`tabindex`, `:537`).
- **Les raccourcis sont posés sur la fenêtre** (`:301-313`, par `bindShortcuts`, `views/src/lib/ui/shortcuts.ts:53-75`,
  qui ne filtre pas `event.repeat`, `:61-71`). Au chargement, le focus sur la page : V valide la première
  proposition, Maj+V tout son groupe, C ouvre « Corriger » sur elle ; V tenu enfoncé valide la file à la suite. J
  part de la première et donne le focus à la deuxième.
- **Un bouton au focus ne pose pas l'arrêt de Tab.** Le focus sur le « Valider » de la carte C, la carte A restant
  `current` : V valide A, et non C.
- **La carte écoute déjà ses touches** (`:544-551`) : Entrée ouvre le mail, les flèches bougent, seulement quand la
  touche vient de la carte elle-même. Le motif d'une touche venue d'un des boutons d'une carte existe :
  `views/src/lib/pina/ActionCard.svelte:63-64` (`bindShortcuts` posé sur la carte).
- **Les indications sont sur toutes les cartes** : `aria-keyshortcuts="V"` sur chaque « Valider » (`:589`) ; « C »
  sur chaque « Corriger », dans l'infobulle et en `aria-keyshortcuts` (`:601`, `:613`) ; « ↵ » sur chaque œil
  (`:629`), que `IconButton` met aussi en `aria-keyshortcuts` (`views/src/lib/ui/IconButton.svelte:38`) ; « Shift+V »
  sur le « Valider » de chaque groupe (`:512`), un bouton hors des cartes.
- **Ce qui ne passe pas par `active`** : « Tout valider au-dessus de … » valide `above` (`:428`) ; le « Valider »
  d'un groupe, son groupe (`:513`) ; les boutons d'une carte, cette carte (`:590`, `:598`, `:606`) ; le glissé, la
  carte glissée (`:328-333`). Au téléphone, le fond de la carte active est déjà retiré (`:993-996`).
- **Le précédent d'Avaritia.** La carte choisie suit le focus : `focusin`, et `focusout` hors de la carte
  (`lun-avaritia/app/src/valider/DraftItem.svelte:68-70`) ; la carte porte ses touches en `aria-keyshortcuts`
  (`:36-40`).
- **Les tests qui figent le défaut** (`views/src/lib/mail/Pending.test.ts`) : « V validates the active card… »
  (`:103-115`) part d'une carte active au chargement ; la première ligne de « leaves the keyboard on the next card »
  (`:256-262`) et le premier V de « after V the keyboard is on the next card… » (`:286-293`) aussi.

### Les gestes, côté serveur (#93)

- **`validate`** (`server/src/triage/pipeline.ts:399-407`) lit la proposition en attente (`:374-379`), garde l'état
  d'avant pour l'annulation (`snapshot`, `:387-389`), attend `applyTarget` (`:84-105`), **qui déplace déjà le mail
  dans Gmail**, puis écrit le statut, l'exemple et la ligne du Journal.
- **`correct`** (`:448-469`) fait de même, avec la règle de l'expéditeur en plus (`:465`). Il accepte une proposition
  de tout statut (`:455`) : **voulu**. Une proposition `auto` existe (`:231`, `:294`), et `mail.correct` est l'outil
  de l'agent pour ranger autrement un mail rangé seul par l'IA (`server/src/contract/catalog.ts:146`,
  `server/src/pina/wording.ts:134`).
- **`refuse`** (`:410-426`) ne fait que lire Gmail, puis relit la proposition avant d'écrire (`:420-421`). Un test le
  tient : un second refus glissé pendant la lecture gagne, le premier reçoit `ConflictError`
  (`journal.test.ts:437-453`, par un enrobage de `google.request`).
- **Donc** un second `validate` ou `correct` glissé pendant l'appel passe aussi : deux déplacements dans Gmail, deux
  lignes au Journal, deux comptes du jour (`todayStats` compte les lignes, `server/src/triage/journal.ts:222-253`),
  et l'annulation de l'une remet un état que l'autre a changé.
- **Le motif d'un verrou en mémoire existe** : `running`, les cartes de l'agent en cours (`server/src/pina/agent.ts:99`,
  `:106-130`).
- **Le serveur ne gère pas l'arrêt** : aucun `SIGTERM` ni `process.on` dans `server/src`. Un arrêt coupe un geste où
  qu'il en soit.
- **La synchro ne règle aucune proposition.** Elle met à jour les étiquettes du cache (`server/src/gmail/sync.ts:115`,
  `:134`, `:192`) et met en file les mails nouveaux (`:137`, `:204`) ; le serveur ne lui branche que le tri
  (`server/src/main.ts:102`). `onManualFile` (`pipeline.ts:475-481`) n'est appelé que par `afterUserAction` (`:499`),
  donc par un geste de la boîte (`server/src/app.ts:128`) ou de l'agent (`catalog.ts:90`).
- **Les routes** rendent déjà 409 sur `ConflictError` (`server/src/triage/routes.ts:25-34`). **L'agent** passe par
  les mêmes fonctions (`catalog.ts:140-156`) : une erreur y devient une carte `failed` avec son message
  (`agent.ts:86-95`, `:117-123`), ou `{ ok: false, error }` sur la route d'action du contrat
  (`server/src/contract/routes.ts:276-282`).
- **L'écran sur une erreur** (`views/src/lib/mail/Pending.svelte:211-248`) : la carte quitte la file dès le geste ;
  le bandeau du haut dit le message du serveur (`:96`, `:439-445`) ; la file est relue (`:242`, `:156-160`).

## Ce que la contestation a changé

1. **#93 : un verrou en mémoire, pas une réservation en base.** Réserver écrivait le statut final avant Gmail. Le
   serveur ne gère pas l'arrêt : un arrêt en plein geste laissait un `accepted` sans ligne ni exemple ; si Gmail
   n'avait rien rangé, le mail restait en réception et n'était plus jamais proposé (`claim` le saute,
   `pipeline.ts:353-356`). Le verrou n'écrit rien avant la réponse de Gmail.
2. **La décision 1 tombe** : `correct` garde les statuts qu'il accepte (plus haut). Le verrou suffit contre la course.
3. **#95 : V, Maj+V et C liés à la carte, pas à la fenêtre.** Sans focus, rien n'est tranché, sans état à tenir. Une
   carte retirée sans `focusout`, puis rendue, n'est pas tranchée par erreur. Et la touche répétée s'ignore là, sans
   toucher au kit.
4. **`focusin` pose l'arrêt de Tab**, pour qu'un V venu d'un bouton passe ensuite à la bonne carte.

## Les choix retenus

1. **Les touches qui tranchent vivent sur la carte (#95).**
   - Le `onkeydown` de la carte (`:544`) traite V, Maj+V et C, **venus de la carte ou d'un de ses boutons**, comme
     `ActionCard.svelte:63-64`. Il lit la touche par `comboOf` (`shortcuts.ts:38-46`, déjà exporté) et ignore
     `event.repeat`. Ni un menu ni la fenêtre « Corriger » ouverts : rien, comme aujourd'hui (`:299`, `:304`).
     Entrée et les flèches gardent leur règle : seulement depuis la carte elle-même.
   - **J et K restent sur la fenêtre** : déplacer ne tranche rien. Avec le focus dans une carte, ils passent à la
     suivante ou à la précédente. **Sans**, ils donnent le focus à la carte de l'arrêt de Tab (la dernière qui a eu
     le focus, sinon la première), sans bouger. J puis V reste le geste le plus court ; Tab et J mènent au même
     endroit.
   - **`focusin` sur la carte pose `current`**, à la place de `onfocus` (`:539`) : un bouton au focus fait de sa
     carte l'arrêt de Tab. Après un geste, le passage à la suivante part donc de la bonne carte.
   - **Le fond et `aria-current` suivent le focus** : la carte qui le contient, aucune au chargement. C'est de
     l'affichage seulement : rien ne tranche d'après lui.
   - **Les indications.** `aria-keyshortcuts` « V » sur le « Valider » de la carte, « C » sur son « Corriger », « ↵ »
     sur l'œil restent : ils ne s'annoncent qu'au focus, donc dans la carte, où la touche agit. La carte porte
     « V Shift+V C » en `aria-keyshortcuts`, comme dans Avaritia. Le « Valider » du groupe perd « Shift+V » : le
     focus sur lui, la touche n'agit pas. Les infobulles de « Corriger » et de l'œil ne montrent leur touche que si
     leur carte contient le focus.
   - « Tout valider », les boutons des groupes et des cartes, le glissé : inchangés, et des tests le tiennent.
2. **Un verrou par mail pour les gestes (#93).** Un `Set` des mails en cours dans `pipeline.ts`, comme `running`.
   `validate`, `correct` et `refuse` le prennent avant leur premier `await` et le rendent dans un `finally`. Un
   second geste sur le même mail reçoit `ConflictError` : « Un geste est déjà en cours sur ce mail ». Rien ne
   s'écrit avant la réponse de Gmail ; Gmail en échec, rien n'a changé. `refuse` garde sa relecture après l'appel :
   un rangement à la main ou une annulation ne prennent pas le verrou.
3. **L'écran sur un 409 ne change pas** : la carte part, le bandeau dit le message du serveur, la file est relue. Un
   test le fige.

### Ce qui se passe pendant l'appel, et après un arrêt

| Qui | Pendant l'appel d'un geste |
|---|---|
| Un second geste (onglet, double clic, la boîte) | 409 du verrou, sans Gmail |
| L'agent, même en mode immédiat | les mêmes fonctions : une carte `failed`, ou `ok: false` |
| La synchro | elle voit le déplacement du geste et met le cache à jour ; elle ne règle pas la proposition |
| Le tri | `claim` saute un mail qui a une proposition (`pipeline.ts:353-356`) |
| La file d'un autre onglet, le bilan du core | la proposition y est encore `pending` jusqu'à l'écriture |
| Un rangement à la main, une annulation | sans verrou : voir « Limites » |

**Un arrêt pendant l'appel** ne laisse rien d'écrit. Gmail n'avait rien rangé : la proposition attend, le mail reste
en réception et dans À valider ; CrOliX refait le geste. Gmail avait rangé : la synchro met le cache à jour, et le
mail quitte À valider, qui ne garde que la réception (`server/src/gmail/store.ts:123`, `:136-139`). **La proposition
reste `pending` : ni `onManualFile` ni la synchro ne la règlent**, aucune ligne, aucun exemple, et le core la compte
encore (`catalog.ts:475`). C'est déjà le cas sur `main`.

## La décision de CrOliX

Aucune : la contestation a retiré la seule (`correct` et les statuts). Le comportement après un arrêt est noté plus
haut et dans les limites, sans changement.

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit rouges ; un développeur écrit le code ; le
**reviewer** relit le diff. Une tâche se ferme sur les barrières d'Acedia au vert : `npm test`, `npm run lint`,
`npm run typecheck`, `npm run format:check`, `npm run check:colors`. lun-docs : `npm run check`.

**L'ordre.** **1 et 2 partent en parallèle** (serveur, écran : aucun fichier commun). 3 attend 1, 4 attend 2 ; **3 et
4 partent en parallèle** (aucun fichier commun). 5 attend 3 et 4. 6 ferme le chantier.

1. - [ ] **Les tests du serveur, rouges** (`testeur` ; `server/src/triage/journal.test.ts`, dans « refuse a
   proposal » (`:356`) ou un bloc voisin qui reprend son `pending()`, `writes` et `lines` (`:362-379`)).
   - **Gmail retenu pendant l'appel** : l'enrobage de `google.request` du test du refus (`:437-453`), devant le faux
     Gmail (`server/src/testing/fake-gmail.ts`). Au premier appel du geste A, il attend le geste B, puis laisse
     passer l'appel. Pas de nouvel outil de test.
   - **`validate` glissé dans `validate`** : B rend 409 ; A rend 200 ; une seule ligne `validate` ; une seule
     écriture à Gmail (`writes`) ; le mail dans la boîte proposée ; `GET /api/stats/today` dit `validated: 1` ; le
     statut est `accepted`.
   - **`correct` glissé dans `correct`** : B, vers une autre boîte et avec `rememberSender`, rend 409 ; une ligne
     `correct` ; le mail dans la boîte de A ; aucune règle créée par B ; `corrected: 1`.
   - **Les gestes croisés** : un `correct`, puis un refus, glissés dans un `validate` : 409, une ligne, rien de B
     dans Gmail.
   - **Le test du refus change** (`:437-453`) : le refus glissé reçoit 409 du verrou, le premier passe, une ligne
     `refuse`. La relecture garde son test : pendant la lecture, l'enrobage règle la proposition en base
     (`setProposalStatus`), et le refus rend `ConflictError`, sans ligne.
   - **Gmail en échec** (l'enrobage rejette au premier appel), pour `validate` et pour `correct` : l'erreur repart ;
     la proposition est `pending` ; aucune ligne ; elle est dans `GET /api/mail?view=pending` ; un nouveau geste
     passe, le verrou rendu. Vert sur `main`, attendu.
   - **Une correction d'un mail `auto` passe toujours** : une proposition `auto` (`saveProposal`), `correct` vers une
     autre boîte rend 200, le statut devient `corrected`, une ligne. Vert sur `main`, attendu.
   - **Exclu** : le code ; l'écran ; un test propre de l'agent (il appelle les mêmes fonctions).
   - **Preuve** : chaque test de course échoue sur `main` pour la bonne raison (un 200 au lieu de 409, deux lignes).

2. - [ ] **Les tests de l'écran, rouges** (`testeur` ; `views/src/lib/mail/Pending.test.ts`).
   - **Au chargement** : aucune carte n'a `aria-current` ; V, Maj+V et C n'appellent rien et n'ouvrent pas
     « Corriger ».
   - **J et K sans focus** : J donne le focus à la première carte de la file (Sujet 2) sans rien appeler ; K de même.
     Après un geste puis un clic hors des cartes, J ramène à la carte de l'arrêt de Tab.
   - **Avec une carte au focus** : V la valide, Maj+V son groupe, C ouvre « Corriger » sur elle ; J et K bougent
     comme aujourd'hui. Le focus sorti des cartes (clic sur le titre), V n'appelle rien.
   - **Le test du contradicteur** : le focus sur le « Valider » de la carte C, la carte A ayant eu le focus avant ;
     V valide C ; un second V valide la carte qui suit C, jamais A.
   - **La touche répétée** : un V avec `repeat: true` n'appelle rien ; V tenu ne valide qu'une carte.
   - **Une carte rendue par Annuler**, après une relecture qui l'avait retirée, n'est pas tranchée par V tant que le
     focus n'y est pas.
   - **Les indications** : chaque carte porte `aria-keyshortcuts` « V Shift+V C » ; ses « Valider » et « Corriger »
     gardent « V » et « C » ; le « Valider » d'un groupe n'a plus d'`aria-keyshortcuts`.
   - **Inchangés, verts sur `main`** : « Tout valider » (`:93`, `:278`) ; le « Valider » d'un groupe et d'une carte,
     cliqués sans focus avant ; le refus (`:213-263`) ; le glissé à droite qui valide (`pointerType: 'touch'`, si
     jsdom le permet ; sinon la tâche 5).
   - **Le 409** : `validate` rejette `new ApiError(409, 'Un geste est déjà en cours sur ce mail')` ; le bandeau dit
     ce message ; la carte est retirée. Vert sur `main`.
   - **Réécrits** : `:103-115` (la carte prend le focus avant V), la première ligne de `:256-262`, le premier V de
     `:286-293`. `:117-123` reste vert : J donne le focus à Sujet 2, du groupe Perso.
   - **Exclu** : le code ; le serveur ; la boîte (`Mailbox.svelte`) ; les infobulles (cachées dans jsdom,
     `Pending.test.ts:57`) : Chrome.
   - **Preuve** : les nouveaux tests du clavier et des indications échouent sur `main` pour la bonne raison.

3. - [ ] **Le serveur** (`dev-core`, ici pour le serveur d'Acedia ; `server/src/triage/pipeline.ts` seul). Après 1.
   - Un `Set` des mails en cours, au niveau du module, avec une ligne qui dit pourquoi (comme `agent.ts:97-99`).
   - `validate` (`:399-407`), `correct` (`:448-469`) et `refuse` (`:410-426`) : si le mail est dans le `Set`,
     `ConflictError('Un geste est déjà en cours sur ce mail')` ; sinon l'y mettre, avant le premier `await`, et l'en
     retirer dans un `finally`. Les contrôles et l'ordre des écritures ne changent pas ; `refuse` garde sa relecture
     (`:420-421`) ; `correct` garde son test d'existence (`:455`).
   - **Exclu** : `proposals.ts` ; `undo` ; `afterUserAction` ; le tri ; le catalogue et les routes (le 409 y est
     déjà) ; le contrat ; l'arrêt du serveur ; l'écran.
   - **Preuve** : les tests de la tâche 1 au vert ; les barrières au vert.

4. - [ ] **L'écran** (`dev-front` ; `views/src/lib/mail/Pending.svelte` seul). Après 2.
   - `bindShortcuts` (`:306-312`) ne garde que J et K. Avec le focus dans une carte, `move` en part ; sans, le focus
     à la carte de l'arrêt de Tab (`current`, sinon la première), rien d'autre.
   - Le `onkeydown` de la carte (`:544`) : V, Maj+V et C par `comboOf`, d'où qu'ils viennent dans la carte, sauf
     `event.repeat`, un menu ou « Corriger » ouverts ; `preventDefault`. Entrée et les flèches, comme aujourd'hui.
   - `onfocusin` à la place de `onfocus` (`:539`). Un état d'affichage, la carte qui contient le focus, posé par
     `focusin` et effacé par `focusout` hors d'elle (comme `DraftItem.svelte:68-70`) : il donne le fond,
     `aria-current` et la touche des infobulles (`:601`, `:629`). Il ne décide rien.
   - `aria-keyshortcuts="V Shift+V C"` sur la carte ; retiré du « Valider » du groupe (`:512`).
   - Les commentaires de `:38-43` et de `:530` disent la nouvelle règle.
   - **Exclu** : le kit (`views/src/lib/ui/*`, `shortcuts.ts` compris) ; « Tout valider », les boutons, le glissé,
     `CorrectPanel` ; la boîte ; le serveur ; le texte du 409.
   - **Preuve** : les tests de la tâche 2 au vert ; les barrières au vert.

5. - [ ] **La preuve dans Chrome** (`dev-front`). Après 3 et 4.
   - **La démo**, dans le worktree d'Acedia : `npm run build`, puis `npm run demo` (`README.md:42-50`,
     `server/src/demo/main.ts`). Base en mémoire, faux Gmail, aucun réseau, port 8797 ; coller dans la console le
     jeton qu'elle affiche. **Jamais la prod** : elle a les vrais mails de CrOliX.
   - **Au bureau**, À valider (quatre propositions dans la démo, `server/src/demo/demo.test.ts:81`). Au chargement,
     V, Maj+V et C ne font rien et aucune carte n'est éclairée. J éclaire la première ; V la valide et le focus passe
     à la suivante ; V tenu ne valide qu'une carte. Après un clic sur le titre, V ne fait rien. L'infobulle de
     « Corriger » d'une carte sans focus n'a pas de touche. « Tout valider au-dessus de … » marche.
   - **L'onglet quitté puis revenu** : le focus dans la page, pas dans la console des DevTools (elle garderait les
     touches). Revenu sur une carte, V tranche cette carte, éclairée ; revenu hors des cartes, V ne fait rien.
   - **Au téléphone** (émulation des DevTools à 390 px, toucher émulé) : le glissé à droite valide, à gauche il ouvre
     « Corriger ».
   - **Le 409** : deux onglets sur À valider. Valider une carte dans le premier, puis la même dans le second, qui la
     montre encore (un geste n'émet pas d'événement) : le bandeau dit « Cette proposition a déjà été traitée », la
     carte part. Le verrou lui-même ne se voit pas ici : le faux Gmail répond tout de suite. Les tests de la tâche 1
     le tiennent.
   - **Relevé** dans la PR : captures à chaque largeur, données de la démo seulement.

6. - [ ] **La livraison** (`livreur`). Une PR en brouillon par dépôt, au gabarit de `lun-livrer` : Lun'Acedia (ferme
   lun-acedia#95 et lun-acedia#93) et lun-docs (ce plan, ses coches).

## Hors périmètre

- **La boîte** (`views/src/lib/mail/Mailbox.svelte:339-392`) : V, C, E et # visent le mail ouvert ou la dernière
  ligne choisie, sans repli sur la première. Pas le même défaut.
- **Un lot arrêté par un 409** (« Tout valider », Maj+V, « Tout corriger… ») : les mails après l'erreur reviennent
  dans la file ; ceux déjà faits ne s'annulent que depuis le Journal (`Pending.svelte:225-247`). Inchangé.
- **L'arrêt propre du serveur** (`SIGTERM`) ; une proposition réglée quand la synchro voit son mail rangé.
- Le refus, l'annulation, les cartes de l'agent, le contrat, Lun'Avaritia.

## Limites

- **Rien n'a été lancé** pour ce plan : ni test, ni démo, ni Chrome.
- **Après un rangement partiel** (Gmail range, puis refuse les étiquettes, `pipeline.ts:91-104`), ou un arrêt après
  le rangement : le mail est rangé sans ligne, la proposition reste `pending`, et le core la compte encore
  (`catalog.ts:475`). Déjà le cas sur `main`.
- **Une vue de la boîte qui n'est plus à jour** (`Mailbox.svelte:267-272`) recevra un 409 : un geste en cours sur le
  mail, ou une proposition tranchée ailleurs.
- **Un 409 du verrou relit la file pendant que l'autre geste court** : la carte peut revenir jusqu'à la relecture
  suivante ; un V dessus rend alors « Cette proposition a déjà été traitée ».
- **Un rangement à la main et une annulation ne prennent pas le verrou.** Un rangement du même mail pendant l'appel
  est un autre geste : il range, apprend et laisse sa ligne. Une annulation d'une ligne plus ancienne relit Gmail
  d'abord et refuse un mail changé (`journal.ts:151-155`) ; la fenêtre qui reste est étroite. Pas de test.
- **Le verrou vaut pour un seul processus** : Acedia n'en lance qu'un.
- **L'agent n'a pas de test à lui** : il appelle les mêmes fonctions (`catalog.ts:140-156`), et une erreur y devient
  une carte `failed` (`agent.ts:86-95`).
- Les quatre propositions de la démo sont lues dans son test, pas vues.
