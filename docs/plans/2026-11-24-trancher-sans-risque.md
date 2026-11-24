# Trancher sans risque : la fiche depuis sa carte, un refus annulable, la pause cohérente. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** le chapeau Lun-Ecosystem/lun-docs#203 (`niveau:standard`), chantier 2 du
> [recadrage du 24/11](../specs/2026-11-24-recadrage-premiere-nuit.md) (§ 3 « Trancher sans risque », § 4 point 2).
> La part privée du core est dans Lun-Ecosystem/lun-anima#137 (privé).
>
> **État : rédigé le 24/11 ; contesté le 24/11 ; amendé le 24/11 avec les décisions de CrOliX et les objections du
> contradicteur** (« Les décisions de CrOliX, le 24/11 »).
>
> Code relu sur `main` de Lun'Anima (`cb075d4`), de Lun'Avaritia (`adef252`) et de Lun'Acedia (`b255045`) ; le
> graphe d'abord, puis chaque point des audits du 24/11 relu dans le code et dans les specs. Trois points des audits
> sont corrigés plus bas. Lun'Anima est privé : ce plan dit le comportement du core, ses critères et ses tâches. Ses
> fichiers, ses tests et ses commandes sont dans l'issue privée ([`securite.md`](../../standards/securite.md),
> « Dépôts publics »). Lun'Avaritia et Lun'Acedia sont publics : leurs chemins restent ici.

**But :** CrOliX tranche une carte en sachant ce qu'il tranche, et peut revenir sur un refus. Depuis la carte d'une
nouvelle fiche dans le core, le brouillon s'ouvre dans Lun'Avaritia. Dans Lun'Avaritia, un refus s'annule et aucune
touche ne tranche une carte qui n'a pas le focus. La pause de Lun'Acedia suit sa spec, d'où qu'elle vienne, et des
tests le tiennent.

**Source :** le chapeau, ses critères et son hors périmètre ; le recadrage du 24/11 et son choix « le lien vers la
fiche plutôt que Modifier dans le core » ; les audits du 24/11 du core, d'Avaritia (E1, B2, B3) et d'Acedia (la
pause), données de session non publiées ; la spec du core
[Natsume au centre](../specs/2026-11-02-natsume-au-centre-design.md) (§ 2, § 4.6, § 9.4, § 9.8) ; la spec
[J1 d'Acedia](../specs/2026-10-19-j1-acedia-design.md) (§ 6.2, § 9) ; la spec de
[Pina](../specs/2026-10-26-agent-acedia-design.md) (§ 4.4, § 5) ; la spec
d'[Avaritia](../specs/2026-10-28-lun-avaritia-v1-design.md) (§ 3.3, § 4.3) ;
[`contrat-satellite.md`](../../standards/contrat-satellite.md).

## Critères de fin

Ceux du chapeau, recopiés, puis ceux de la session.

1. **Depuis la carte d'une nouvelle fiche dans le core (À trancher et Bureau), un lien ouvre ce brouillon dans
   Lun'Avaritia** : vérifié dans Chrome. Tâches 1, 3, 5, 6 et 9.
2. **Dans Lun'Avaritia, un refus s'annule, comme dans le core** : test et vérification dans Chrome. Tâches 1 à 4
   et 9.
3. **Dans Lun'Avaritia, aucune touche ne tranche une carte qui n'a pas le focus** : test. Tâches 2 et 4.
4. **La pause de Lun'Acedia se comporte comme sa spec le dit, qu'elle vienne de Natsume, de Pina ou de l'écran** :
   tests pour les trois origines. Lu selon la décision 2. Tâches 7 et 8.
5. **Chaque tâche de code a ses tests, écrits avant le code** par le testeur et vus rouges (ceux de la tâche 7
   figent un comportement déjà conforme : verts) ; la preuve dans Chrome, au bureau et au téléphone. Toutes les
   tâches.
6. **Des tâches courtes, chacune avec son dépôt et ses fichiers** ; une PR par dépôt de code ; ce plan dans la PR
   lun-docs du chantier ; l'ordre et le parallèle dits plus bas. Tâche 10.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-avaritia` : lien du brouillon, refus annulable, focus | `feat/trancher-sans-risque` | lun-docs#203 | `standard` |
| `lun-anima` : 2 tâches (5, 6) | dans l'issue privée | lun-anima#137 (privé) | `standard` |
| `lun-acedia` : les tests de la pause, son `CLAUDE.md` | `test/pause-trois-origines` | lun-docs#203 | `standard` |
| `lun-docs` : ce plan, ses coches, la spec J1 | `docs/plan-trancher-sans-risque` | lun-docs#203 | `trivial` |

**Le niveau.** `standard`, celui du chapeau : une route ajoutée au front d'Avaritia, un comportement du clavier
changé, un lien ajouté dans le core. Rien de sécurité, pas de migration : `drafts.status` et `decided_at` existent
(`lun-avaritia/server/src/db.ts:87-89`), l'annulation y remet des valeurs déjà permises. Le contrat ne change pas.

## Ce que les audits disent, relu dans le code

Trois points des audits sont faux ou incomplets. Le plan part du code.

1. **« Le Journal du core a déjà « Ouvrir dans Lun'Avaritia » pour la même carte. »** Le bouton existe, mais il
   ouvre l'**accueil** du front du poste, pas la carte ni le brouillon. On reprend sa forme (nouvel onglet, sans
   référent, icône de lien sortant), ni son libellé ni sa cible : le libellé d'une carte nomme ce qu'il ouvre.
2. **« Le `card.link` fourni par le serveur n'est rendu que pour les cartes urgentes ou qui envoient. »** Vrai, mais
   pour une **nouvelle fiche**, Avaritia ne donne aucun lien : `cardOf` n'en met un que si la carte vise une fiche
   existante (`lun-avaritia/server/src/brain/drafts.ts:377-385`, `:418`), et un test le fige (« a new fiche card has
   no link », `server/src/brain/drafts.test.ts:298-300`). Le core n'a rien à ouvrir : la tâche part d'Avaritia.
3. **« La pause d'Acedia a trois sens différents. »** En partie faux. Que les règles tournent sous une pause du core
   est une **décision de CrOliX** (spec du core, § 9.8 ; contrat, « Deux pauses »). Que Natsume soit refusée sous une
   pause locale est le **contrat**. Que Pina agisse en pause est **sa spec** (§ 5). Le code suit les trois. Seule la
   spec J1 dit encore le contraire pour les règles (§ 6.2), écrite avant le contrat v1.4. Ce qui manque : des tests
   pour Pina et pour l'écran sous chaque pause, et la spec J1 remise d'accord.

## Ce que le code fait aujourd'hui

### Le core, en comportement

- **La carte choisie se déplie sur place**, dans un seul composant pour le Bureau au bureau et À trancher au
  téléphone. Une nouvelle fiche y offre Valider et Refuser, rien d'autre.
- **Un lien sortant n'existe que pour deux cartes** : l'urgence (« Ouvrir le mail ») et la carte qui envoie
  (« Modifier dans Lun'Acedia »). Le `link` des autres cartes est déjà lu, et le core le filtre déjà : seul un chemin
  du front du poste, sur sa propre origine, est suivi ; sinon il ouvre l'accueil du front. Il ne le montre pas.
- **Le libellé d'un lien sortant nomme déjà sa cible**, pour une urgence : « Ouvrir le mail », « Ouvrir l'agenda »,
  « Voir la fiche », sinon « Ouvrir ».
- **Le lien sortant garde une infobulle de prudence** quand le poste ne répond pas. Son texte parle du mail.
- **Le core relit les cartes de chaque poste toutes les 2 min au plus.** Une carte tranchée dans le poste reste
  visible dans le core jusqu'à la relecture ; un geste sur elle rend « Déjà tranchée ailleurs. ».
- **L'annulation est tenue par le core** (spec du core, § 2 et § 4.6) : il garde chaque geste 5 s avant de le
  relayer au poste ; Annuler et Ctrl Z le retirent avant le relais. **Rien n'arrive au poste pendant ces 5 s.** Le
  contrat n'a donc pas d'annulation et n'en a pas besoin : le critère 2 ne change rien dans le core.

### Lun'Avaritia

Chemins relatifs à `lun-avaritia/`.

- **Le lien d'une carte** : `/memoire?fiche=N` pour une fiche enrichie, une contradiction et un doublon ; aucun pour
  une nouvelle fiche et un import (`server/src/brain/drafts.ts:377-385`, `:418` ; tests `drafts.test.ts:290-314`).
  Le commentaire du champ le dit (`:97-98`).
- **Le refus** (`refuseDraft`, `server/src/brain/drafts.ts:322-328`) passe `pending` à `refused` et date
  `decided_at` ; une carte qui n'attend plus rend 409, une inconnue 404. **Aucun événement n'est émis** : le bilan du
  jour (`server/src/brain/digest.ts:29-39`) et l'activité du tableau de bord (`server/src/brain/dashboard.ts:41-43`)
  relisent `decided_at` à chaque lecture. Rien d'autre ne lit un refus.
- **Le même refus sert le core et l'écran** : route du contrat `POST /lun/v1/cards/:id/refuse`
  (`server/src/contract/routes.ts:208`), que l'écran appelle avec son jeton d'appareil
  (`app/src/screens/Valider.svelte:64`).
- **La file** est la même `queue()` plafonnée pour l'écran (`server/src/brain/routes.ts:59-65`) et pour le contrat
  (`server/src/contract/routes.ts:174-183`) : une carte que le core montre est dans la liste de l'écran, sauf si elle
  a été tranchée entre-temps.
- **Les routes `/api`** exigent un appareil (`server/src/app.ts:102`) ; celles de la bibliothèque (`brainRoutes`) y
  sont montées (`:141`).
- **À valider, le clavier.** `active` vaut la carte choisie, sinon **la première**
  (`app/src/screens/Valider.svelte:50`). V et R sont liés à la fenêtre et agissent sur `active` (`:78-83`). Une
  carte est choisie quand le focus entre dedans (`app/src/valider/DraftItem.svelte:53`) ; rien ne la déchoisit quand
  il en sort. Donc **au chargement, le focus sur la page, R refuse la première carte.** Après une décision, la carte
  part et rien ne donne le focus à la suivante (`Valider.svelte:65`).
- **À valider, le toast.** « Appliqué » ou « Refusé », sans Annuler (`Valider.svelte:67`). Le kit a déjà le toast
  annulable : `toast(message, { undo })`, 5 s (`UNDO_DURATION`, `app/src/lib/ui/toasts.svelte.ts:13`), « Annuler »
  et Ctrl Z hors d'un champ (`app/src/lib/ui/Toaster.svelte:20-23`). Un nouveau toast remplace l'ancien, dont le
  geste devient définitif. **Acedia s'en sert déjà** pour son À valider : le geste part au serveur, puis le toast
  rappelle le serveur pour le défaire et relit la file (`lun-acedia/views/src/lib/mail/Pending.svelte:211-246`).
- **L'adresse** ne connaît que `?filtre=` pour la file (`app/src/App.svelte:24-38`). Rien ne nomme un brouillon.
  L'autorisation retire déjà son paramètre de l'adresse une fois lue (`App.svelte:46`).
- **Chaque `api.send` relit les compteurs du rail** (`App.svelte:66`) : une annulation les remet à jour seule.
- **La démo n'a pas de nouvelle fiche à valider** : une fiche enrichie, une contradiction, un doublon
  (`server/src/demo/main.ts:64-101`).
- **Le test « V and R act on the active item »** (`app/src/screens/Valider.test.ts:169-188`) fige le comportement
  d'aujourd'hui : il change.

### Lun'Acedia : la pause

Chemins relatifs à `lun-acedia/`.

**Ce que disent les specs.**

- **Le contrat v1.4** ([`contrat-satellite.md`](../../standards/contrat-satellite.md), « Deux pauses ») et la spec du
  core (§ 9.8, « décision de CrOliX ») : **sous une pause du core**, le poste garde son tri par règles seules, sans
  modèle, et répond à `/agent` pour les demandes de CrOliX et les gestes. **Sous une pause locale**, arrêt complet de
  ce poste, muet pour le core ; `/agent` répond qu'il est en pause. Une pause locale ne se lève que dans le front.
- **Pina, § 4.4** : « Pause et reprise du tri : Garde-fou : reste un geste de CrOliX. » Elles ne sont pas au
  catalogue. **Pina, § 5** : « la pause du tri arrête l'automatique, pas Pina : ce qu'elle fait est demandé. »
- **J1, § 6.2, point 1** : « En pause, comme tout l'automatique, elles [les règles] s'arrêtent (contrat). » Écrit le
  19/10, avant la v1.4 : faux sous une pause du core. **J1, § 9, n° 10** : « Pause : aucun tri automatique, la
  lecture et les gestes manuels marchent. » Vrai pour une pause locale seulement.
- **Le dictionnaire** : la pause, « l'arrêt de toute action automatique de l'écosystème, sauf les urgences ;
  CrOliX peut toujours écrire ».

**Ce que fait le code.**

- **Qui pose la pause.** Natsume : `POST /lun/v1/pause` avec `by: 'core'`. L'écran (bouton du haut, Ctrl K,
  Réglages › Service) : la même route sans `by`, donc locale (`views/src/lib/client.ts:384-389`,
  `app/src/App.svelte:167-172`). Pina : aucune action ne le fait ; la liste exacte des actions est figée par un test
  (`server/src/contract/catalog.test.ts:96`). Deux réglages séparés, la pause locale l'emporte
  (`server/src/contract/state.ts:19-35`).
- **Le tri** : rien sous une pause locale (`server/src/triage/pipeline.ts:351-352`) ; les règles seules sous une
  pause du core (`:360`).
- **Une demande de Natsume** (`/agent`) : refusée sous une pause locale seulement (`server/src/contract/routes.ts:245`),
  avec le texte de `:39`.
- **Une demande à Pina** (`POST /api/pina/messages`, `server/src/pina/routes.ts:42-48`) et **un geste à l'écran**
  ne lisent jamais la pause.
- **L'écran** ne lève que sa propre pause ; sous une pause du core, il dit « Les règles seules rangent » et offre de
  mettre en pause (`app/src/shell/status.ts:85-101`).

**Ce que les tests tiennent.**

| Sous la pause | Le tri | Une demande de Natsume | Une demande à Pina | Un geste à l'écran |
|---|---|---|---|---|
| du core (par Natsume) | règles seules : `pipeline.test.ts:250` | servie : `agent.test.ts:90` | à tester | à tester |
| locale (à l'écran) | arrêté : `pipeline.test.ts:236`, `:275` | refusée : `agent.test.ts:81` | à tester | à tester |

L'écran qui pose et lève sa pause : `app/src/App.test.ts:393`, `views/src/lib/settings/Settings.test.ts:139`, `:153`,
`app/src/shell/status.test.ts:60`. Pina qui ne peut pas poser de pause : tenu par la liste exacte du catalogue.

**Le `CLAUDE.md` d'Acedia** dit « En pause, le tri s'arrête : rien n'est rangé seul » (`CLAUDE.md:28`) : faux sous
une pause du core, où les règles rangent encore. La détection des conflits de l'agenda, elle, s'arrête sous les deux
pauses (`server/src/agenda/overlaps.ts:173`, tests `overlaps.test.ts:480`, `:494`).

## Les décisions de CrOliX, le 24/11

1. **Le délai de relecture du core est accepté, écrit en limite.** Le core relit les cartes d'un poste toutes les
   2 min au plus. Après une décision prise dans Avaritia, la carte reste visible dans le core jusqu'à la relecture,
   et un geste sur elle rend « Déjà tranchée ailleurs. ». Après une annulation, la carte revient dans le core
   jusqu'à 2 min plus tard. La preuve (tâche 9) le joue. **Aucun événement n'est ajouté au contrat.**
2. **La pause d'Acedia reste telle quelle.** Le recadrage disait « pareil, qu'elle vienne de Natsume, de Pina ou de
   l'écran » ; CrOliX a retenu **« différent, voulu par le contrat »**. Le chantier écrit les tests des trois
   origines, corrige la spec J1 (§ 6.2 et § 9 n° 10) et la ligne du `CLAUDE.md` d'Acedia, dans la PR d'Acedia.
3. **Les trois questions de la contestation**, tranchées selon l'avis de la session et celui du contradicteur :
   - sous une pause locale, **une demande relayée par Natsume reste refusée** (contrat), même si la même demande à
     Pina passe (Pina § 5) : la servir donnerait des cartes que le core ne peut pas trancher, puisqu'il tient le
     poste pour muet ;
   - **pour une fiche enrichie, le lien ouvre la fiche**, sans changement ;
   - **pas d'annulation d'une validation** dans Avaritia dans ce chantier : défaire une fiche écrite est un chantier
     à lui seul. L'écart avec le core, qui annule aussi une validation, reste noté.

## Les choix retenus

1. **Le lien d'un brouillon.** Avaritia donne à chaque carte sans fiche cible (nouvelle fiche, import) le chemin
   `/valider?brouillon=<id>`. Les autres gardent `/memoire?fiche=<id>`, sans changement. Le core montre le lien sur
   **toute carte dont le poste donne un lien**, sauf une question et une carte qui envoie (celle-ci garde « Modifier
   dans … »). **Le libellé nomme la cible**, comme pour une urgence : « Ouvrir le brouillon » pour
   `/valider?brouillon=`, « Voir la fiche » pour une fiche enrichie, « Ouvrir le mail » pour une carte d'Acedia,
   sinon « Ouvrir ». La règle vaut pour tous les postes. **Ce que montre le lien** : À valider, ce brouillon au focus,
   avec son titre, sa synthèse, ses faits, ses liens, et Valider, Modifier, Refuser. Un brouillon tranché
   entre-temps : un toast le dit, la file reste.
2. **Le refus s'annule côté serveur, comme dans Acedia.** Le refus part tout de suite, comme aujourd'hui. Le toast
   « Refusé » offre Annuler et Ctrl Z pendant 5 s (le kit). L'annulation remet `refused` à `pending` et efface
   `decided_at`, **seulement si le refus a moins de 30 s** : les 5 s du toast et une marge pour un réseau lent. Au
   delà, 409. La route est celle du front, `POST /api/drafts/:id/restore`, **hors contrat** : le core tient ses gestes
   et n'en a pas l'usage. **Écarté** : retenir le refus 5 s dans l'écran, comme le core. Un onglet fermé ou un écran
   quitté le perdrait sans le dire, pour plus de code.
3. **Le focus décide.** V et R n'agissent que sur la carte qui contient le focus. Au chargement, aucune. La carte
   elle-même prend le focus (pas son bouton Valider : une Entrée de trop ne valide rien). Après une décision, le focus
   passe à la carte suivante, la file vide à son titre, comme le core et l'À valider d'Acedia. La carte au focus a
   un nom accessible : son titre.
4. **La pause** : les tests qui manquent, J1 et le `CLAUDE.md` d'Acedia remis d'accord (décision 2). Aucun code dans
   Acedia, sauf si un test rouge montre un écart.

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit échouer ; un développeur écrit le code ; le
**reviewer** relit le diff. Une tâche se ferme sur les barrières de son dépôt au vert. Lun'Avaritia : `npm test`,
`npm run lint`, `npm run typecheck`, `npm run format:check`. Lun'Acedia : les mêmes et `npm run check:colors`.
Lun'Anima : les siennes, dans l'issue privée. lun-docs : `npm run check`.

**Qui écrit le code.** `dev-front` fait l'écran d'Avaritia (tâche 4) et la preuve (tâche 9). `dev-core` fait le core
(tâche 6). **Aucun agent de métier ne couvre le serveur d'Avaritia** : la tâche 3 revient à la session, ou à un agent
général à qui l'on donne ce plan.

**L'ordre.** **1, 2, 5, 7 et 8 partent en parallèle** : aucun fichier commun (serveur d'Avaritia, écran d'Avaritia,
core, Acedia, lun-docs). 3 attend 1. 4 attend 2 et 3. 6 attend 5. 9 attend 3, 4 et 6. 10 ferme le chantier.

1. - [x] **Les tests du serveur d'Avaritia, rouges** (testeur ; `server/src/brain/drafts.test.ts`,
   `server/src/brain/fiches.test.ts`).
   - **Les liens** (`drafts.test.ts:290-314`) : une nouvelle fiche porte `link` `/valider?brouillon=<id>`, un import
     aussi ; une fiche enrichie, une contradiction et un doublon gardent `/memoire?fiche=<id>`. Le test « a new fiche
     card has no link » et la fin de celui de l'import changent.
   - **L'annulation** (`restoreDraft`, dans `drafts.test.ts`, horloge fixée) : un refus de moins de 30 s repasse en
     `pending`, sans `decidedAt`, et revient dans `queue()` à sa place ; à 30 s ou plus, `ConflictError`, le brouillon
     reste `refused` ; un brouillon `pending`, `done` ou `applying` : `ConflictError` ; un inconnu : `NotFoundError`.
     Le bilan du jour (`digestAction`, `server/src/brain/digest.ts:14`) ne cite plus le refus annulé.
   - **La route** (`fiches.test.ts`, à côté de `GET /api/drafts`, `:227`) : `POST /api/drafts/:id/restore` rend 200
     et le brouillon ; 404 ; 409 avec un message en clair. Un jeton de client (celui du core) est refusé, comme sur
     toute route `/api`.
   - **Exclu** : le code ; les tests de l'écran.
   - **Preuve** : chaque nouveau test échoue sur `main` pour la bonne raison (lien absent, fonction ou route absente).

2. - [x] **Les tests de l'écran d'Avaritia, rouges** (testeur ; `app/src/screens/Valider.test.ts`,
   `app/src/App.test.ts`).
   - **Le focus** : au chargement, V et R n'envoient rien et aucune carte ne montre les touches V R ; le focus dans
     la deuxième carte, R refuse la deuxième ; le focus sorti des cartes (clic sur la page), V n'envoie rien ;
     `aria-keyshortcuts` sur la seule carte au focus ; après un refus par R, le focus est sur la carte suivante, et R
     la refuse ; la file vidée, le focus est sur le titre « À valider » ; la carte au focus a pour nom accessible le
     titre du brouillon. Le test `:169-188` est réécrit ; celui du panneau de l'agent (`:190-200`) reste vert.
   - **L'annulation** : un refus montre « Refusé » avec Annuler ; Annuler envoie `POST /api/drafts/<id>/restore`,
     relit la file, le brouillon revient ; Ctrl Z fait de même ; un 409 de l'annulation devient le toast d'erreur du
     kit, avec le message du serveur. Le toast de Valider reste sans Annuler.
   - **L'adresse** : `/valider?brouillon=3` donne le focus au brouillon 3, et R le refuse ; l'adresse redevient
     `/valider` ; un brouillon absent de la file donne le toast « Ce brouillon n'attend plus de décision. », sans
     carte au focus.
   - **Exclu** : le code ; le serveur.
   - **Preuve** : les nouveaux tests échouent sur `main` pour la bonne raison.

3. - [x] **Le serveur d'Avaritia** (la session ou un agent général ; `server/src/brain/drafts.ts`,
   `server/src/brain/routes.ts`, `server/src/demo/main.ts`). Après 1.
   - `drafts.ts` : `cardOf` donne `/valider?brouillon=${d.id}` quand il n'y a pas de cible (`:418`) ; le commentaire
     de `Card.link` (`:97`) le dit. `restoreDraft(db, id, now)` : un seul `UPDATE … SET status = 'pending',
     decided_at = NULL WHERE id = ? AND status = 'refused' AND decided_at > ?`, à `now` moins `UNDO_MS` (strict) ;
     sans ligne changée, `ConflictError` ou `NotFoundError`, comme `refuseDraft`. `UNDO_MS = 30_000`, avec une ligne
     qui dit pourquoi (le toast de 5 s et le réseau).
   - `routes.ts` : `POST /drafts/:id/restore` rend `{ draft: draftView(…) }` ; 404 et 409 mappés, le 409 dit
     « Trop tard pour annuler : le refus est fait. ».
   - `demo/main.ts` : un brouillon de nouvelle fiche, inventé, d'un type que la démo a déjà, origine `core`.
   - **Exclu** : le contrat et ses routes ; Valider ; l'écran ; `contrat-satellite.md`.
   - **Preuve** : les tests de la tâche 1 au vert ; les barrières au vert ; `npm run demo` démarre.

4. - [x] **L'écran d'Avaritia** (`dev-front` ; `app/src/App.svelte`, `app/src/screens/Valider.svelte`,
   `app/src/valider/DraftItem.svelte`). Après 2 et 3.
   - `App.svelte` : lit `brouillon` comme `filtre` (`:24-38`) et le passe à Valider.
   - `Valider.svelte` : `active` est la carte au focus, sans repli sur la première (`:50`) ; V et R n'agissent que
     sur elle (`:78-83`). Après une décision, le focus va à la carte suivante, ou au titre si la file est vide. Le
     refus passe `undo` au toast : `api.send('POST', '/api/drafts/<id>/restore')`, puis `load()`. L'annulation ne
     déplace pas le focus. `brouillon` : après le premier chargement, focus sur ce brouillon et
     `scrollIntoView({ block: 'nearest' })`, puis `history.replaceState` retire le paramètre ; absent, le toast
     d'information.
   - `DraftItem.svelte` : le cadre de la carte prend le focus (`tabindex="-1"`, le cadre de focus du kit) et reçoit un
     nom accessible, son titre (`aria-labelledby` sur le titre de la carte, ou `aria-label`) ; quand le focus quitte
     la carte, elle n'est plus choisie.
   - **Exclu** : le kit et ses copies ; le serveur ; Modifier ; le tableau de bord ; les textes du plafond (audit B7).
   - **Preuve** : les tests de la tâche 2 au vert ; les barrières au vert.

5. - [x] **Les tests du core, rouges** (testeur, Lun'Anima ; fichiers dans l'issue privée). En parallèle de 1, 2,
   7 et 8.
   - La carte dépliée d'une nouvelle fiche de Lun'Avaritia, dont le lien est `/valider?brouillon=<id>`, offre
     « Ouvrir le brouillon » : un lien, nouvel onglet, sans référent, vers le front du poste à ce chemin. Le même
     composant sert le Bureau et À trancher : un test suffit.
   - Une fiche enrichie (`/memoire?fiche=<id>`) offre « Voir la fiche » ; une carte d'Acedia (`#/mail/<id>`)
     « Ouvrir le mail ». Le libellé de `/valider?brouillon=` est aussi testé à part, avec les autres libellés.
   - Une carte sans lien n'a pas de lien sortant. Une carte qui envoie n'a que « Modifier dans … ». Une question
     n'a pas de lien.
   - Un lien qui n'est pas un chemin du front ouvre l'accueil du front (règle d'aujourd'hui, testée si elle ne l'est
     pas sur une carte).
   - Le poste ne répond pas : le lien garde son infobulle de prudence, sans parler du mail. Natsume injoignable : le
     lien est désactivé, comme « Modifier dans … ».
   - **Exclu** : le code.
   - **Preuve** : les nouveaux tests échouent sur `main` pour la bonne raison.

6. - [x] **Le core** (`dev-core`, Lun'Anima ; étapes dans l'issue privée). Après 5.
   - La carte dépliée montre le lien sortant pour toute carte qui en a un, hors question et hors carte qui envoie.
     Son libellé nomme la cible, par la règle de l'urgence, avec « Ouvrir le brouillon » en plus pour
     `/valider?brouillon=`. L'infobulle de prudence dit le poste, pas le mail.
   - **Exclu** : Modifier dans le core ; les questions ; la pile ; le lot ; le Journal ; le contrat.
   - **Preuve** : les tests de la tâche 5 au vert ; les barrières du core au vert.

7. - [x] **Les tests de la pause d'Acedia** (testeur ; `server/src/pina/routes.test.ts`,
   `server/src/triage/pipeline.test.ts`). En parallèle.
   - **Pina sous chaque pause** : sous une pause du core, puis sous une pause locale, `POST /api/pina/messages` mène
     son tour (le modèle est appelé, la réponse ou la carte arrive).
   - **Un geste à l'écran sous chaque pause** : `POST /api/mail/:id/validate` range le mail sous une pause du core et
     sous une pause locale.
   - **Pina ne pose ni ne lève de pause** : déjà tenu par la liste exacte du catalogue (`catalog.test.ts:96`). Pas
     de test de plus.
   - Les noms des tests disent la case du tableau qu'ils tiennent (« core pause: Pina answers »…).
   - **Exclu** : tout changement de comportement. **Si un test est rouge sur `main`**, c'est un écart à la spec : on
     le dit à CrOliX avant de le corriger dans la même PR.
   - **Preuve** : les nouveaux tests passent sur `main` ; c'est attendu, ils figent la spec. Les barrières au vert.

8. - [x] **Les textes de la pause remis d'accord** (la session ; `docs/specs/2026-10-19-j1-acedia-design.md` dans
   lun-docs, `CLAUDE.md` dans Lun'Acedia). En parallèle.
   - § 6.2, point 1 : « En pause posée dans Lun'Acedia, comme tout l'automatique, elles s'arrêtent ; sous une pause du
     core, elles seules continuent, sans modèle (contrat v1.4, « Deux pauses »). »
   - § 9, n° 10 : « Pause posée dans Lun'Acedia : aucun tri automatique ; pause du core : les règles seules ; dans les
     deux, la lecture, les gestes manuels et Pina marchent. »
   - `CLAUDE.md` d'Acedia (`:28`), dans la PR d'Acedia : « En pause posée dans Lun'Acedia, le tri s'arrête : rien
     n'est rangé seul. Sous une pause du core, les règles seules rangent, sans modèle. Dans les deux, la détection
     des conflits de l'agenda ne crée aucune carte. » La suite de la ligne ne change pas.
   - **Exclu** : les autres specs ; le contrat.
   - **Preuve** : `npm run check` au vert dans lun-docs ; les barrières d'Acedia au vert.

9. - [x] **La preuve dans Chrome** (`dev-front`). Après 3, 4 et 6.
   - **Avaritia**, `npm run demo`, au bureau puis au téléphone (émulation des DevTools à 390 px, pas une fenêtre
     redimensionnée). On attend : au chargement de À valider, R ne fait rien ; Tab jusqu'à une carte, elle s'éclaire
     avec V R ; R la refuse, le toast offre Annuler ; Ctrl Z la ramène ; le compteur du rail suit ;
     `/valider?brouillon=<id>` met ce brouillon au focus ; un brouillon déjà tranché le dit.
   - **Le core en local, relié à la démo d'Avaritia** (mise en route dans l'issue privée). On attend : au Bureau, la
     nouvelle fiche de la démo dépliée offre « Ouvrir le brouillon » ; le lien ouvre un onglet sur À valider, ce
     brouillon au focus ; de même dans À trancher à 390 px ; la fiche enrichie de la démo offre « Voir la fiche ».
   - **Le délai de relecture** (décision 1) : refuser le brouillon dans Avaritia, puis Valider dans le core avant sa
     relecture : « Déjà tranchée ailleurs. » ; la carte quitte le core en 2 min au plus. Annuler le refus dans
     Avaritia : la carte revient dans le core en 2 min au plus. Les heures sont relevées.
   - **Relevé** dans chaque PR : captures à chaque largeur, sans donnée réelle.
   - **Exclu** : la prod ; une vraie base. Acedia : rien à voir à l'écran, ses tests suffisent.

10. - [x] **La livraison** (livreur). Une PR en brouillon par dépôt, au gabarit de `lun-livrer` : Lun'Avaritia,
    Lun'Anima (ferme Lun-Ecosystem/lun-anima#137), Lun'Acedia (ses tests et son `CLAUDE.md`), et lun-docs (ce
    plan, ses coches, la spec J1). Chacune porte
    `Refs Lun-Ecosystem/lun-docs#203` ; la PR lun-docs ferme le chapeau.

## Risques

- **Une règle de lien commune à tous les postes** : les cartes d'Acedia qui ont un lien gagnent aussi le leur
  (« Ouvrir le mail »). Voulu ; la capture de la tâche 9 le montre à CrOliX.
- **Deux R de suite font perdre l'Annuler du premier refus** : le second toast le remplace (spec du core, § 4.6).
- **Un refus dans Avaritia pendant un geste tenu par le core** sur la même carte : le relais du core reçoit 409 et
  dit « Déjà tranchée ailleurs. ». Une annulation ensuite remet le brouillon en attente ; le core le relit au passage
  suivant (décision 1).
- **La fenêtre de 30 s** est plus large que les 5 s du toast. Seul l'écran appelle la route ; au pire, une
  annulation lente passe encore.
- **Le focus sur la carte suivante** rend R enchaînable, comme dans le core. C'est le prix d'un clavier qui reste
  utilisable après la règle du focus.

## Hors périmètre

- Modifier une fiche depuis le core ; les contradictions et doublons dans le core (audit E2) ; la pile et le lot du
  core ; le reste de l'audit, après le VIP (recadrage, § 3).
- **Une pile de deux nouvelles fiches au même titre n'a pas de lien dans le core** : la pile garde ses gestes.
- Annuler une validation dans Avaritia (décision 3).
- Un événement du contrat pour dire une décision prise dans le poste (décision 1).
- **Le même défaut de touche dans l'À valider d'Acedia** : V valide la première proposition sans focus
  (`lun-acedia/views/src/lib/mail/Pending.svelte:92`, `:300-313`). À garder en inbox.
- Le texte rendu à Natsume sous une pause locale, « Acedia est en pause : je ne fais rien… »
  (`lun-acedia/server/src/contract/routes.ts:39`), et son jumeau d'Avaritia
  (`lun-avaritia/server/src/contract/routes.ts:212-213`) : vocabulaire, après le VIP.
- Changer le contrat de la pause (décisions 2 et 3).
- La source d'un fait (audit B1) ; les textes du plafond (audit B7).

## Limites

- **Rien n'a été lancé** pour ce plan : ni test, ni démo, ni Chrome.
- **Le délai de relecture du core, accepté** (décision 1) : jusqu'à 2 min entre une décision ou une annulation dans
  Avaritia et ce que montre le core.
- **`?brouillon=` survit à l'appairage** : l'écran lit ses paramètres au démarrage et l'appairage ne touche pas
  l'adresse (`lun-avaritia/app/src/App.svelte:24-29`, `:176-180`). **Le vrai manque** : sur le vrai téléphone,
  Chrome doit être appairé à Avaritia pour que le lien du core y mène ; l'émulation à 390 px ne le montre pas.
- **Non vérifié** : que le core en local se relie à la démo d'Avaritia sans réglage de plus ; c'est à l'issue privée.
- Le téléphone du core est lu dans le code (même composant), pas vu.
