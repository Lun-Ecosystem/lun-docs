# Acedia, trancher sans risque, la suite : le focus décide, un geste à la fois. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** Lun-Ecosystem/lun-acedia#95 (le clavier de l'À valider) et Lun-Ecosystem/lun-acedia#93 (un geste qui
> se glisse pendant l'appel à Gmail), `niveau:standard`. Pas de chapeau : tout le code est dans Lun'Acedia. Le
> chantier prolonge [Trancher sans risque](2026-11-24-trancher-sans-risque.md) (lun-docs#203, fusionné), qui a
> corrigé le même clavier dans Lun'Avaritia (lun-avaritia#47) et rangé ce défaut-ci dans son hors périmètre.
>
> **État : rédigé le 24/11**, à contester, puis à valider par CrOliX. Choisi par CrOliX le 24/11 au soir, en
> attendant la preuve de la première nuit avec la 0.3.0.
>
> Code relu sur `main` : lun-acedia `864b6b6` (la 0.3.0), lun-avaritia `7e2c1b5` (le précédent, #47), lun-docs
> `b49ac9c`. Le graphe d'abord, puis chaque ligne citée. Lun'Acedia est public : rien du core ici.

**But :** pendant la semaine de rodage, CrOliX tranche chaque jour ses vrais mails. Aucune touche ne tranche une
proposition qu'il ne regarde pas. Un second geste sur la même proposition ne laisse ni deux lignes au Journal, ni de
faux compteurs, ni un mail rangé sans trace. C'est la promesse du contrôle ([`vision.md`](../../vision.md), point 5).

**Source :** les deux issues ; le plan précédent (son choix 3, « le focus décide ») ; le code d'Avaritia après #47 ;
le test du refus qui se glisse pendant la lecture de Gmail (`lun-acedia/server/src/triage/journal.test.ts:437-453`).

## Critères de fin

1. **Sans carte au focus, V, Maj+V et C ne tranchent rien** et n'ouvrent rien ; J et K donnent le focus à la file
   sans rien trancher. Avec une carte au focus, rien ne change. Tests. Tâches 2, 4, 5.
2. **Les indications disent vrai** : `aria-keyshortcuts` et la touche des infobulles ne sont que sur la carte au
   focus et sur le bouton de son groupe. Tests et Chrome. Tâches 2, 4, 5.
3. **Un geste qui se glisse pendant l'appel à Gmail reçoit 409 avant de toucher Gmail** : une seule ligne au
   Journal, des compteurs du jour justes, aucun mail rangé sans ligne. Un test par geste (`validate`, `correct`),
   Gmail retenu pendant l'appel. Tâches 1, 3.
4. **Gmail en échec remet la proposition en attente** : aucune ligne, elle revient dans la file. Test. Tâches 1, 3.
5. **Sur un 409, l'écran dit le message du serveur et la carte reste retirée.** Test et Chrome. Tâches 2, 5.
6. **Le reste ne bouge pas** : le refus, l'annulation, « Tout valider », les boutons des cartes et des groupes, le
   glissé tactile, l'agent. Les tests d'aujourd'hui restent verts, sauf ceux que la tâche 2 réécrit. Toutes.
7. **Barrières d'Acedia vertes** ; preuve dans Chrome sur la démo, jamais sur la prod. Tâche 5.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-acedia` : le clavier, la réservation | `fix/trancher-sans-risque-suite` | #95, #93 | `standard` |
| `lun-docs` : ce plan, ses coches | `docs/acedia-trancher-suite` | #95, #93 | `trivial` |

Les deux issues sont celles de Lun'Acedia.

**Le niveau.** `standard` : un comportement du clavier change, et l'ordre des écritures d'un geste. Pas de
migration : `proposals.status` est un texte sans contrainte (`server/src/db.ts:80-89`) et ne prend que des valeurs
qu'il a déjà. Pas de nouveau statut ; le contrat ne change pas.

## Ce que le code fait aujourd'hui

Chemins relatifs à `lun-acedia/`.

### L'À valider, le clavier (#95)

- **`current`** (`views/src/lib/mail/Pending.svelte:67`) est la carte du clavier. Il est posé quand le focus entre
  dans la carte (`:539`), au clic (`:540-543`), par un geste qui passe à la suivante (`:214-218`) et par J ou K
  (`:294`). Rien ne l'efface quand le focus sort.
- **`active`** vaut cette carte, sinon **la première** (`:92`). Il sert à cinq choses : la cible des raccourcis
  (`:302-305`), le départ de J et K (`:292`), le passage à la suivante après un geste (`:214`), le fond et
  `aria-current` (`:534-535`), le seul arrêt de Tab de la file (`tabindex`, `:537`).
- **Les raccourcis sont posés sur la fenêtre** (`:301-313`, par `bindShortcuts`, `views/src/lib/ui/shortcuts.ts:53-75`).
  Au chargement, le focus sur la page : V valide la première proposition, Maj+V tout son groupe, C ouvre « Corriger »
  sur elle. J part de la première et donne le focus à la deuxième.
- **Les indications sont sur toutes les cartes** : `aria-keyshortcuts="V"` sur chaque « Valider » (`:589`) ; « C »
  sur chaque « Corriger », dans l'infobulle et en `aria-keyshortcuts` (`:601`, `:613`) ; « ↵ » sur chaque œil
  (`:629`), que `IconButton` met aussi en `aria-keyshortcuts` (`views/src/lib/ui/IconButton.svelte:38`) ; « Shift+V »
  sur le « Valider » de chaque groupe (`:512`).
- **Ce qui ne passe pas par `active`** : « Tout valider au-dessus de … » valide `above` (`:428`) ; le « Valider »
  d'un groupe, son groupe (`:513`) ; les boutons d'une carte, cette carte (`:590`, `:598`, `:606`) ; le glissé, la
  carte glissée (`:328-333`).
- **Au téléphone**, le fond de la carte active est déjà retiré (`:993-996`).
- **Le précédent d'Avaritia.** La carte choisie suit le focus : `focusin`, et `focusout` hors de la carte
  (`lun-avaritia/app/src/valider/DraftItem.svelte:68-70`). Pas de repli (`app/src/screens/Valider.svelte:69`). Une
  carte au focus qui quitte la page n'envoie pas de `focusout` : elle est déchoisie à la main (`:88-89`). Les touches
  ne sont dites que sur la carte au focus (`DraftItem.svelte:36-40`).
- **Les tests qui figent le défaut** (`views/src/lib/mail/Pending.test.ts`) : « V validates the active card… »
  (`:103-115`) part d'une carte active au chargement ; la première ligne de « leaves the keyboard on the next card »
  (`:256-262`) et le premier V de « after V the keyboard is on the next card… » (`:286-293`) aussi.

### Les gestes, côté serveur (#93)

- **`validate`** (`server/src/triage/pipeline.ts:399-407`) lit la proposition en attente (`:374-379`), garde l'état
  d'avant pour l'annulation (`snapshot`, `:387-389`), attend `applyTarget` (`:84-105`), **qui déplace déjà le mail
  dans Gmail**, puis écrit le statut, l'exemple et la ligne du Journal.
- **`correct`** (`:448-469`) fait de même, avec la règle de l'expéditeur en plus (`:465`). Il vérifie seulement
  qu'une proposition existe (`:455`), pas qu'elle attend.
- **`refuse`** (`:410-426`) ne fait que lire Gmail, puis relit la proposition avant d'écrire (`:420-421`). Un test le
  tient : un second refus glissé pendant la lecture, par un enrobage de `google.request` (`journal.test.ts:437-453`).
- **Donc** un second `validate` ou `correct` glissé pendant l'appel trouve encore `pending` : deux déplacements dans
  Gmail, deux lignes au Journal, deux comptes du jour (`todayStats` compte les lignes,
  `server/src/triage/journal.ts:222-253`), et l'annulation de l'une remet un état que l'autre a changé.
- **Les routes** rendent déjà 409 sur `ConflictError` (`server/src/triage/routes.ts:25-34`). **L'agent** passe par
  les mêmes fonctions (`server/src/contract/catalog.ts:140-156`) : une erreur y devient une carte `failed` avec son
  message (`server/src/pina/agent.ts:86-95`, `:117-123`), ou `{ ok: false, error }` sur la route d'action du contrat
  (`server/src/contract/routes.ts:276-282`).
- **L'écran sur une erreur** (`views/src/lib/mail/Pending.svelte:211-248`) : la carte quitte la file dès le geste ;
  le bandeau du haut dit le message du serveur (`:96`, `:439-445`) ; la file est relue (`:242`, `:156-160`). Sur un
  409, la carte reste donc retirée, avec « Cette proposition a déjà été traitée » (`pipeline.ts:377`).

### Qui lit le statut pendant l'appel

Si le statut final s'écrit avant l'appel à Gmail :

| Lecteur | Ce qu'il lit | Ce qu'il voit pendant l'appel |
|---|---|---|
| Un second geste (onglet, double clic) | `pendingProposal` (`pipeline.ts:374-379`) | 409 tout de suite, sans Gmail |
| L'agent en mode immédiat | le même `validate` ou `correct` | une carte `failed`, ou `ok: false` |
| Le même mail rangé à la main | `onManualFile` (`pipeline.ts:475-481`) | statut intact ; exemple et ligne restent |
| Les compteurs du jour | les lignes du Journal (`journal.ts:222-253`) | une ligne par geste |
| Le bilan pour le core | `status = 'pending'` (`catalog.ts:475`) | la proposition n'y est plus |
| La file d'un autre onglet | `status = 'pending'` (`gmail/store.ts:138`) | absente ; Gmail en échec, elle revient |
| L'annulation | la ligne du geste, écrite après l'appel | rien à annuler encore |
| Le tri | `claim` saute un mail qui a une proposition (`pipeline.ts:353-356`) | rien ne change |

### `correct` sans `pending` : un oubli

- Aucun écran ne corrige une proposition tranchée. La file ne garde que les propositions en attente
  (`Pending.svelte:122`) ; la boîte ne corrige que si la proposition attend, sinon elle range
  (`views/src/lib/mail/Mailbox.svelte:265-274`).
- Aucun test ne corrige une proposition tranchée. La démo corrige une proposition en attente
  (`server/src/demo/demo.ts:564` : m15 à 91 %, `:189`, sous un seuil de 95, `:511`).
- Seul l'agent peut aujourd'hui corriger une proposition `auto`, `accepted`, `corrected` ou `refused`
  (`catalog.ts:143-149`) ; la ligne compte alors un « corrigé » du jour.
- `validate` et `refuse` passent par `pendingProposal` ; `correct` n'a qu'un test d'existence depuis le J1
  (`9c4e521`). Son commentaire dit « elsewhere than proposed » (`pipeline.ts:447`) : une proposition qui attend.

## Les choix retenus

1. **Le focus décide (#95), comme dans Avaritia.**
   - V, Maj+V et C n'agissent que sur la carte qui contient le focus : la carte elle-même ou un de ses boutons. Sans
     elle, rien.
   - **J et K sans carte au focus** donnent le focus à la carte de l'arrêt de Tab (la dernière utilisée, sinon la
     première), sans bouger ni trancher. Avec une carte au focus, ils passent à la suivante ou à la précédente, comme
     aujourd'hui. J puis V reste le geste le plus court ; Tab et J mènent au même endroit.
   - **L'arrêt de Tab ne change pas** : une seule carte, la dernière utilisée, sinon la première. Le passage à la
     suivante après un geste non plus. Seuls la cible des raccourcis, le fond, `aria-current` et les indications
     suivent le focus.
   - **Les indications ne se lisent que là où la touche agit.** Sur la carte au focus seulement :
     `aria-keyshortcuts` « V » et « C », la touche « C » de l'infobulle de « Corriger », « ↵ » sur l'œil. Sur le
     « Valider » du groupe de cette carte seulement : « Shift+V ». Les libellés des boutons ne changent pas.
   - **Une carte au focus retirée par un geste n'est plus la cible.** Rendue par Annuler, elle revient sans fond, et
     V ne la valide pas tant que le focus n'y est pas.
   - « Tout valider », les boutons des groupes et des cartes, le glissé : inchangés, et des tests le tiennent.
2. **Réserver la proposition avant l'appel (#93).** Le geste passe la proposition de `pending` à son statut final
   (`accepted`, `corrected`) par un seul `UPDATE … WHERE status = 'pending'`, avant d'appeler Gmail. Aucune ligne
   changée : 409, sans appel. Gmail échoue : la proposition revient à `pending` et l'erreur repart. L'exemple, la
   règle et la ligne s'écrivent ensuite, comme aujourd'hui.
   - **Écarté : relire après l'appel et défaire le déplacement.** Défaire demande un second appel à Gmail, qui peut
     échouer : le mail reste rangé sans ligne, le défaut même de l'issue. Deux validations rangent le mail au même
     endroit : défaire celle qui perd remet en réception le mail que l'autre vient de ranger, et le Journal dit le
     contraire. Et le geste qui perd a déjà appelé Gmail.
   - **Ce que la réservation coûte** : le statut final se lit pendant l'appel (tableau plus haut), sans gêne
     trouvée ; un arrêt du serveur pendant l'appel la laisse posée (« Limites »).
   - **Le statut final, pas un statut « en cours »** : il existe déjà dans la vue et le contrat. Un nouveau statut
     toucherait `ProposalView` (`server/src/types.ts:16`), les écrans et l'agent, pour un état d'une seconde.
3. **L'écran sur un 409 ne change pas** : la carte est déjà retirée, le bandeau dit le message du serveur, la file
   est relue. Un test le fige.

## La décision à prendre par CrOliX

1. **`correct` exige une proposition en attente, comme `validate`.** Avis : oui. C'est un oubli (plus haut). Et une
   correction d'une proposition déjà tranchée ne se réserve pas à bon compte : un statut qui ne change pas
   (`corrected` vers `corrected`) ne dit pas qu'un autre geste est passé. Pour ranger ailleurs un mail déjà tranché,
   l'agent garde `mail.file` (`catalog.ts:112-118`), qui apprend l'exemple et laisse sa ligne. **Si non** : `correct`
   ne réserve que la proposition qui attend, les autres restent sans protection ; la tâche 1 perd son test
   « `correct` sur une proposition tranchée » et la tâche 3 garde le test d'existence.

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
   - **Gmail en échec** (l'enrobage rejette au premier appel), pour `validate` et pour `correct` : l'erreur repart ;
     la proposition est `pending` ; aucune ligne ; elle est dans `GET /api/mail?view=pending` ; un nouveau geste
     passe. Vert sur `main`, attendu : il tient la remise en attente.
   - **`correct` sur une proposition tranchée** (décision 1) : après un `validate`, `correct` rend 409, sans écriture
     à Gmail ni ligne.
   - **Exclu** : le code ; l'écran ; un test propre de l'agent (il appelle les mêmes fonctions).
   - **Preuve** : chaque nouveau test échoue sur `main` pour la bonne raison (un 200 au lieu de 409, deux lignes),
     sauf ceux de Gmail en échec.

2. - [ ] **Les tests de l'écran, rouges** (`testeur` ; `views/src/lib/mail/Pending.test.ts`).
   - **Au chargement** : aucune carte n'a `aria-current` ; V, Maj+V et C n'appellent rien et n'ouvrent pas
     « Corriger » ; aucun bouton n'a `aria-keyshortcuts`.
   - **J et K sans focus** : J donne le focus à la première carte de la file (Sujet 2) sans rien appeler ; K de même.
     Après un geste puis un clic hors des cartes, J ramène à la carte de l'arrêt de Tab.
   - **Avec une carte au focus** : V la valide, Maj+V son groupe, C ouvre « Corriger » sur elle ; J et K bougent
     comme aujourd'hui. Le focus sorti des cartes (clic sur le titre), V n'appelle rien.
   - **Les indications** : `aria-keyshortcuts` « V » et « C » sur les boutons de la seule carte au focus, « ↵ » sur
     son œil, « Shift+V » sur le « Valider » de son seul groupe.
   - **Une carte rendue par Annuler** revient sans `aria-current`, et V ne la valide pas tant que le focus n'y est
     pas.
   - **Inchangés, verts sur `main`** : « Tout valider » (`:93`, `:278`) ; le « Valider » d'un groupe et d'une carte,
     cliqués sans focus avant ; le refus (`:213-263`) ; le glissé à droite qui valide (`pointerType: 'touch'`, si
     jsdom le permet ; sinon la tâche 5).
   - **Le 409** : `validate` rejette `new ApiError(409, 'Cette proposition a déjà été traitée')`, et le faux client
     marque la proposition `accepted` ; le bandeau dit ce message ; la carte n'est plus dans la file après la
     relecture. Vert sur `main`.
   - **Réécrits** : `:103-115` (la carte prend le focus avant V), la première ligne de `:256-262`, le premier V de
     `:286-293`. `:117-123` reste vert : J donne le focus à Sujet 2, du groupe Perso.
   - **Exclu** : le code ; le serveur ; la boîte (`Mailbox.svelte`).
   - **Preuve** : les nouveaux tests du clavier et des indications échouent sur `main` pour la bonne raison.

3. - [ ] **Le serveur** (`dev-core`, ici pour le serveur d'Acedia ; `server/src/triage/proposals.ts`,
   `server/src/triage/pipeline.ts`). Après 1.
   - `proposals.ts` : `setProposalStatus` (`:66-71`) prend un `from` facultatif. Donné, l'`UPDATE` porte
     `AND status = ?`. La fonction rend `true` si une ligne a changé. Ses appels d'aujourd'hui (`journal.ts:171`,
     `pipeline.ts:480`) ne changent pas.
   - `validate` (`pipeline.ts:399-407`) : lire, prendre `snapshot` **avant** la réservation (l'annulation doit
     remettre `pending` ; `journal.test.ts:127-136` le tient), puis réserver `pending` vers `accepted`. `false` :
     `ConflictError`, avec le message de `:377`. `applyTarget` dans un `try` ; en échec, `accepted` vers `pending`,
     puis l'erreur repart. Plus d'écriture du statut après l'appel. Une ligne de commentaire dit pourquoi : réservé
     avant Gmail, un geste glissé reçoit 409 sans rien déplacer.
   - `correct` (`:448-469`) : `pendingProposal` à la place du test d'existence (`:455`, décision 1) ; puis les
     contrôles de boîte et d'étiquettes, `snapshot`, la réservation `pending` vers `corrected`, le même `try`. La
     règle et la ligne ensuite, comme aujourd'hui.
   - **Exclu** : `refuse` ; `undo` ; le tri ; le catalogue et les routes (le 409 y est déjà) ; le contrat ; un
     nouveau statut ; l'écran.
   - **Preuve** : les tests de la tâche 1 au vert ; les barrières au vert.

4. - [ ] **L'écran** (`dev-front` ; `views/src/lib/mail/Pending.svelte` seul). Après 2.
   - L'`active` d'aujourd'hui (`:92`) devient l'arrêt de Tab, sous un autre nom. Il garde `tabindex` (`:537`), le
     passage à la suivante après un geste (`:214-218`) et le départ de J et K.
   - Une carte au focus, posée par `focusin` sur la carte et effacée par `focusout` hors d'elle (comme
     `lun-avaritia/app/src/valider/DraftItem.svelte:68-70`). `act()` l'efface quand il retire cette carte (comme
     `lun-avaritia/app/src/screens/Valider.svelte:88-89`).
   - `active` devient cette carte, sans repli. Il sert la cible de V, Maj+V et C (`:302-311`), le fond et
     `aria-current` (`:534-535`), et les indications (`:512`, `:589`, `:601`, `:613`, `:629`) : présentes sur la
     carte au focus et sur le bouton de son groupe, absentes ailleurs (`shortcut` et `aria-keyshortcuts` à
     `undefined`).
   - J et K : avec `active`, `move` comme aujourd'hui ; sans, le focus à la carte de l'arrêt de Tab, rien d'autre.
   - Les commentaires de `:38-43` et de `:530` disent la nouvelle règle.
   - **Exclu** : le kit (`views/src/lib/ui/*`) ; « Tout valider », les boutons, le glissé, `CorrectPanel` ; la
     boîte ; le serveur ; le texte du 409.
   - **Preuve** : les tests de la tâche 2 au vert ; les barrières au vert.

5. - [ ] **La preuve dans Chrome** (`dev-front`). Après 3 et 4.
   - **La démo**, dans le worktree d'Acedia : `npm run build`, puis `npm run demo` (`README.md:42-50`,
     `server/src/demo/main.ts`). Base en mémoire, faux Gmail, aucun réseau, port 8797 ; coller dans la console le
     jeton qu'elle affiche. **Jamais la prod** : elle a les vrais mails de CrOliX.
   - **Au bureau**, À valider (quatre propositions dans la démo, `server/src/demo/demo.test.ts:81`). Au chargement,
     V, Maj+V et C ne font rien et aucune carte n'est éclairée. J éclaire la première ; V la valide et le focus passe
     à la suivante. Après un clic sur le titre, V ne fait rien. L'infobulle de « Corriger » d'une carte sans focus
     n'a pas de touche. « Tout valider au-dessus de … » marche.
   - **Au téléphone** (émulation des DevTools à 390 px, toucher émulé) : le glissé à droite valide, à gauche il ouvre
     « Corriger ».
   - **Le 409** : deux onglets sur À valider. Valider une carte dans le premier, puis la même dans le second, qui la
     montre encore (un geste n'émet pas d'événement) : le bandeau dit « Cette proposition a déjà été traitée », la
     carte part. Le conflit pendant l'appel ne se voit pas ici : le faux Gmail répond tout de suite. Les tests de la
     tâche 1 le tiennent.
   - **Relevé** dans la PR : captures à chaque largeur, données de la démo seulement.

6. - [ ] **La livraison** (`livreur`). Une PR en brouillon par dépôt, au gabarit de `lun-livrer` : Lun'Acedia (ferme
   lun-acedia#95 et lun-acedia#93) et lun-docs (ce plan, ses coches).

## Hors périmètre

- **La boîte** (`views/src/lib/mail/Mailbox.svelte:339-392`) : V, C, E et # visent le mail ouvert ou la dernière
  ligne choisie, sans repli sur la première. Pas le même défaut.
- **Un lot arrêté par un 409** (« Tout valider », Maj+V, « Tout corriger… ») : les mails après l'erreur reviennent
  dans la file ; ceux déjà faits ne s'annulent que depuis le Journal (`Pending.svelte:225-247`). Inchangé.
- **Un échec de Gmail après le déplacement** (les étiquettes refusées après le rangement, `pipeline.ts:91-104`) : le
  mail reste rangé sans ligne, comme aujourd'hui.
- Le refus, l'annulation, les cartes de l'agent, le contrat, Lun'Avaritia.

## Limites

- **Rien n'a été lancé** pour ce plan : ni test, ni démo, ni Chrome.
- **Un arrêt du serveur pendant l'appel** laisse la proposition tranchée sans ligne : elle quitte À valider. Si Gmail
  n'a rien rangé, le mail reste en réception et se range à la main. Le serveur tourne en continu : un arrêt est
  l'exception.
- **L'annulation d'une ligne plus ancienne du même mail, pendant l'appel**, remettrait le statut de cette ligne.
  `undo` relit Gmail d'abord et refuse un mail changé (`journal.ts:151-155`) ; la fenêtre qui reste est étroite. Pas
  de test.
- **L'agent n'a pas de test à lui** : il appelle les mêmes fonctions (`catalog.ts:140-156`), et une erreur y devient
  une carte `failed` (`agent.ts:86-95`).
- **Le glissé et les infobulles** se testent mal dans jsdom (un calque non mesuré y reste caché,
  `Pending.test.ts:57`) : Chrome les montre.
- Les quatre propositions de la démo sont lues dans son test, pas vues.
