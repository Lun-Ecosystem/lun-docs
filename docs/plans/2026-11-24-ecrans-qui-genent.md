# Les écrans qui gênent : la barre latérale du kit, le core au téléphone, la hauteur courte. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** le chapeau Lun-Ecosystem/lun-docs#204 (`niveau:standard`), chantier 3 du
> [recadrage du 24/11](../specs/2026-11-24-recadrage-premiere-nuit.md) (§ 4). Il ferme Lun-Ecosystem/lun-docs#201 ;
> la part du core est Lun-Ecosystem/lun-anima#134 (privée).
>
> **État : rédigé le 24/11 ; contesté le 24/11 ; amendé le 24/11** avec trois décisions de CrOliX et les points
> tranchés par la session après la contestation (« Les décisions de CrOliX, le 24/11 »). Validé par CrOliX le 24/11.
>
> Code relu sur `main` : lun-docs `41fd6f3`, lun-acedia `b255045`, lun-avaritia `adef252`, lun-luxuria `c99f96f`,
> Lun'Anima `cb075d4`. La prod tourne sur les 0.2.0 : aucun fichier touché ici n'a changé depuis, sauf `Icon.ts` dans
> la copie du kit d'Acedia (une ligne, hors du chantier). Le graphe d'abord, puis chaque point dans le code ; trois
> mesures prises dans Chrome le 24/11, en lecture seule. Lun'Anima est privé : ce plan dit son comportement, ses
> tâches et ses preuves ; ses fichiers, lignes, tests et commandes sont dans un commentaire de l'issue privée
> ([`securite.md`](../../standards/securite.md), « Dépôts publics »).

**But :** sur un portable, la barre latérale des apps garde des liens lisibles quand elle déborde : elle défile. Au
téléphone, les filtres du Journal du core s'ouvrent par-dessus la liste ; le Bureau ne déborde plus et finit au-dessus
de la barre « Écrire à Natsume » ; une ligne du Journal n'a plus de vide sous son texte. Les standards font vérifier
la hauteur courte et disent comment prendre la largeur d'un téléphone. Rien n'est redessiné : le design se reprend
après le VIP.

**Source :** le chapeau et ses critères ; les constats de lun-docs#201 et de lun-anima#134, vus dans Chrome le 24/11
avec leur cause lue ; le recadrage du 24/11, § 4 point 3 ; `standards/design.md:88-89` (le seuil unique de 767,98 px),
`:90-92` (la place sous un élément flottant), `:142-147` (la vérification dans Chrome) ; le skill `lun-design` ; les
audits du 24/11 du front du core et de Lun'Acedia, dont le mini-calendrier de l'Agenda qui réduit les liens du rail ;
la contestation du 24/11 et les décisions de CrOliX du même jour.

**Critères de fin**, ceux du chapeau :

1. **Un lien de navigation garde sa hauteur dans une barre qui déborde**, dans le kit et ses copies : vérifié dans
   Chrome à 1366 × 720, Réception et Agenda d'Acedia. Tâches 1, 3, 4, 5, 11.
2. **Sur téléphone, les filtres du Journal du core s'ouvrent par-dessus la liste**, sans la pousser : vérifié dans
   Chrome en largeur de téléphone. Tâches 8, 11.
3. **Sur téléphone, le Bureau du core ne déborde plus**, et la fin de son contenu n'est plus couverte par la barre de
   saisie. Tâches 7, 9, 11.
4. **Le vide sous « Le point du matin est posté »** dans le Journal du core est expliqué (« Ce que le code fait
   aujourd'hui ») et corrigé. Tâches 7, 10, 11.
5. **`standards/design.md` fait vérifier aussi un écran de hauteur courte.** Tâche 2.

Chaque point se prouve dans Chrome à la hauteur réelle d'une fenêtre de 1366 × 720, une page de 1366 × 630, et à
390 × 844, sur une page locale et des données fictives (« Les choix », point 6).

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-docs` : le lien du kit, le standard, ce plan | `docs/plan-ecrans-qui-genent` | #204, #201 | `standard` |
| `lun-acedia` : sa copie du lien | `fix/ecrans-qui-genent` | lun-docs#204 | `trivial` |
| `lun-avaritia` : sa copie du lien | `fix/ecrans-qui-genent` | lun-docs#204 | `trivial` |
| `lun-luxuria` : sa copie du kit, régénérée | `chore/sync-kit-navlink` | lun-docs#204 | `trivial` |
| `lun-anima` : 6 tâches (6 à 11), une PR | dans l'issue privée | Lun-Ecosystem/lun-anima#134 | `standard` |

**Une PR par dépôt.** Lun'Luxuria entre dans le chantier, absente du chapeau : elle emploie `NavLink` dans
`src/Reglages.svelte`, sa copie du kit est générée, et sa CI la compare au kit de lun-docs. Sans sa PR, sa CI casse dès
la fusion du kit. Le core n'emploie pas `NavLink` hors de sa copie du kit : chez lui, la copie ne coûte qu'un passage
de CI. La PR du core ferme lun-anima#134 ; celle de lun-docs ferme #201 et le chapeau (« L'ordre des fusions »). Le
semis du core local (tâche 6) n'entre dans aucun dépôt.

**Le niveau.** `standard`, celui du chapeau. Un composant du kit employé par les quatre apps, un comportement neuf au
téléphone dans le core (la feuille des filtres, son historique, son focus). Ni contrat, ni donnée, ni sécurité.

## Les décisions de CrOliX, le 24/11

1. **Retour, feuille des filtres ouverte : la feuille se ferme, les choix restent.** C'est le code le plus fragile du
   chantier. Il a ses tests dédiés (tâche 8) : un Retour suivi d'un nouvel ajout à l'historique ; la réponse tardive de
   l'adresse d'avant, jetée ; un remplacement d'adresse qui effacerait la marque de la feuille ; l'avant perdu. Les
   mêmes cas sont rejoués dans Chrome (tâche 11).
2. **Le type directement dans la feuille**, sans « Plus de filtres ». Au téléphone seulement : le bureau ne change pas.
3. **Une ligne du standard sur la prise des 390 px** : oui (choix de la session, de méthode).

### Tranché par la session, après la contestation

- **Le remplissage du core local** (objection bloquante du contradicteur). Une base jetable, hors du dépôt. Le jeton
  d'appareil par un code d'appairage sur cette base : l'app l'exige. Puis un semis de données fictives, écrit hors du
  dépôt, qui passe par les fonctions du core lui-même : quelques entrées du Journal, dont un événement sans issue comme
  « Le point du matin est posté », et plus de cartes à trancher que la hauteur d'écran n'en montre. Rien de réel, rien
  de commité. La tâche qui l'écrit (6) précède toutes les mesures du core.
- **Mesurer `main` d'abord** (tâche 7, avant la 9). Si l'écart de 8 px relevé dans #134 vient d'un autre élément que
  « Voir les N », `border-box` ne ferme pas le critère 3. Les mesures se prennent sur l'app construite, servie par le
  core, pas sous le serveur de développement, dont l'ordre des feuilles de style peut différer.
- **L'ordre des fusions** : la PR lun-docs reste en brouillon (« L'ordre des fusions »).
- **La ligne du standard** dit une hauteur de page réaliste : la page d'une fenêtre de 1366 × 720 fait environ 630 px,
  et l'audit d'Acedia a mesuré 536 px.
- **« Voir les N »** garde son correctif local. L'autre voie, `box-sizing: border-box` sur `.btn` du kit, touche les
  quatre apps : elle part en issue `inbox`.
- **La hauteur libre** se pose sur trois lieux nommés, le Bureau, À trancher et le Journal, pas sur « tout sauf la
  Constellation ».

## Ce que le code fait aujourd'hui

### Le lien du kit, dans une barre qui déborde

- `design/kit/NavLink.svelte:51-65` : `.lien` est une rangée flex de 34 px de haut, sans règle de `flex`. Son texte
  (`.texte`, `:100-104`) tient sur une ligne, environ 16 px.
- `design/kit/Rail.svelte:35-43` : `.rail` est une colonne flex à `min-height: 0`. `.liens` (`:69-75`) est elle-même une
  colonne flex, `min-height: 0` et `overflow-y: auto` : c'est elle qui cède quand la hauteur manque. `.tete` (`:63-68`)
  et `.bas` (`:76-83`) gardent la hauteur de leur contenu.
- **La cause**, celle de #201, relue : un élément flex de hauteur fixe peut rétrécir jusqu'à son contenu, ici la ligne
  de texte. Quand `.liens` est plus courte que ses liens, chacun passe de 34 à 16 px au lieu que la liste défile. Seuls
  les liens posés directement dans `.liens` rétrécissent : un `NavGroup` (`design/kit/NavGroup.svelte`) n'a pas de
  hauteur fixe et garde la sienne, ses liens aussi. D'où le relevé de #201 : Réception, À valider, Agenda et Tâches à
  16 px, les groupes « Boîtes » et « Gmail » intacts.
- Le kit écrit déjà `flex: none` pour ce qui ne doit pas céder : l'icône du lien (`NavLink.svelte:66-68`), sa
  pastille (`:93-99`).
- Dans la galerie, la pièce « Rail, principal, avec NavGroup » (`design/galerie/sections/Navigation.svelte:58-72`)
  tient dans un cadre de 380 px (`:120-128`) : elle ne déborde pas, le défaut ne s'y voit pas.

### Les copies du kit

- **Lun'Acedia** (`views/src/lib/ui/NavLink.svelte`) et **Lun'Avaritia** (`app/src/lib/ui/NavLink.svelte`) : copies à
  la main, identiques au kit ligne pour ligne (diff vide le 24/11), sans l'en-tête « ne pas modifier ici ». Leur dossier
  entier diffère du kit (`node tools/sync-kit.mjs --check` le liste) : elles restent à la main jusqu'à lun-docs#43, et
  leur CI ne les compare à rien. Le `Rail` d'Acedia diffère du kit d'une ligne (`font-variant-numeric`) : non touché.
- **Lun'Luxuria** (`src/lib/ui/NavLink.svelte`, employé par `src/Reglages.svelte`) et **le core** : copies générées par
  `tools/sync-kit.mjs` (`:26-44`), à jour le 24/11 (`--check` : « kit: OK »). La CI de chacun clone lun-docs, sa
  branche par défaut, et compare la copie au kit (`lun-luxuria/.github/workflows/ci.yml:33` ; la même étape dans le
  core). Dès que la correction du kit est sur `main`, toute PR de ces deux dépôts échoue à cette étape tant que sa
  copie n'est pas régénérée ; une copie régénérée avant échoue aussi, puisqu'elle devance le kit.
- Le core n'emploie `NavLink` dans aucun de ses écrans (cherché le 24/11) : sa copie suit le kit, rien ne s'y voit.

### Le rail d'Acedia : Réception et Agenda

- `app/src/shell/Shell.svelte:160-209` (lun-acedia) : en tête du rail, la marque et l'action de l'écran ; puis quatre
  liens directs (Réception, À valider, Agenda, Tâches) ; puis ce que l'écran ajoute (`parts.rail`) ; en bas, Journal,
  Réglages et la carte du service.
- Réception ajoute les groupes « Boîtes » et « Gmail » (`views/src/lib/mail/MailboxNav.svelte`) : la colonne déborde
  quand la fenêtre est basse.
- L'Agenda pose en tête le bouton Créer et le mini-calendrier (`views/src/lib/agenda/Agenda.svelte:217`, `:233-236`),
  puis le groupe « Agendas » dans la liste. L'en-tête garde sa hauteur, la liste reçoit ce qui reste : l'audit d'Acedia
  l'a vue réduite à environ 40 px dans une page de 536 px de haut, le lien de l'Agenda caché.
- **Lun'Avaritia** : sa barre ne déborde pas aujourd'hui (#201). `NavLink` y sert dans `app/src/shell/Shell.svelte`,
  `app/src/screens/Reglages.svelte` et `app/src/catalogue/Catalogue.svelte`.

### Les surfaces superposées qui existent

- Le kit : `Dialog` (une fenêtre centrée, avec titre, corps et pied ; au téléphone ses boutons passent en colonne,
  `design/kit/Dialog.svelte:183-190`), `ConfirmDialog`, `CommandPalette`, `Tooltip`, `Toaster`, `Banner`. Ni feuille ni
  tiroir. `Menu` et `Popover` n'existent que dans la copie d'Acedia (`design/galerie/inventaire.ts:109-110` :
  « propre »).
- Le core a sa feuille : le panneau de détail. Au bureau, un panneau fixe à droite, non modal ; au téléphone, une
  feuille modale en bas de l'écran, avec sa poignée, son titre et « Replier ». Elle s'ouvre dans un portail, hors de
  la page. Échap et le voile la ferment, le focus y entre et revient. Elle sert déjà à une entrée du Journal, à un
  poste et à la conversation. Celle de la conversation ajoute une entrée d'historique à l'ouverture : Retour la ferme
  d'abord (testé). #134 la range « sans défaut relevé ».

### Le Journal du core au téléphone

- Les filtres. Au bureau : la recherche, la période (une commande segmentée), les pastilles de poste, et « Plus de
  filtres » pour le type. Au téléphone, la recherche reste, et un bouton « Filtres » (« 2 filtres » quand deux sont
  posés) déplie dans la page la période et les postes ; « Plus de filtres » y ajoute le type. La liste descend
  d'environ 165 px (#134). Les rangées tiennent dans une enveloppe en grille, à 10 px d'écart.
- Chaque choix change l'adresse et ajoute une entrée d'historique : Retour rend le filtre d'avant (testé). Le
  remplacement d'une adresse, que le core sait faire, efface l'état attaché à l'entrée. Une réponse qui arrive pour
  une adresse déjà quittée est jetée.
- Les flèches parcourent les lignes de la liste, y compris quand le focus est dans une fenêtre modale : c'est ainsi
  qu'on les parcourt depuis la feuille d'une entrée. Une feuille de filtres serait aussi une fenêtre modale : ses
  flèches (celles de la période) partiraient vers la liste. La tâche 8 l'empêche.

### Le vide sous « Le point du matin est posté »

- La ligne vient de la routine du matin : un événement de Natsume, d'importance normale, écrit au Journal comme un
  événement **sans issue** (ni « Fait », ni « Tranchée »). Les cartes, routines, délégations et urgences en ont une ;
  un événement non urgent n'en a pas.
- Une ligne du Journal est une `ListRow` du kit. Au téléphone, `ListRow` pose son contenu en haut et demande 72 px au
  moins (`design/kit/ListRow.svelte:118-124`). Le core ne pose pas `box-sizing: border-box` partout
  (`design/galerie/base.css:1-4` le dit) : ce minimum compte sans la marge intérieure, une ligne fait au moins
  72 + 20 + 1 = 93 px.
- Le Journal y range deux lignes de texte (le titre, puis la source), 32 px, et l'issue en pastille sur une seconde
  rangée (22 px, après 10 px d'écart) : une ligne avec issue remplit 64 px des 72, une ligne sans issue 32. **Il reste
  40 px de vide sous le texte d'une ligne sans issue**, plus la marge du bas : c'est le vide relevé. Toute ligne sans
  issue l'a ; celle du matin est la plus fréquente.
- Mesuré au bureau le 24/11 dans Chrome : deux lignes « Le point du matin est posté » de 76,8 px pour 32,2 px de
  contenu (60 px de minimum, 16 px de marge, la bordure). Au bureau le contenu est centré : le vide se partage et ne se
  voit pas. **Au téléphone, le chiffre est calculé** ; la tâche 7 le mesure.

### Le Bureau du core au téléphone

- « Voir les N » : le bouton du kit en grande taille, rendu en lien (il mène à À trancher), étiré à toute la largeur
  (`width: 100%`). Le kit lui donne 20 px de marge de chaque côté et une bordure de 1 px
  (`design/kit/Button.svelte:61-68`, `:92-95`), sans `box-sizing`. Un `<button>` est en `border-box` par défaut dans le
  navigateur, un lien ne l'est pas, et le core ne le pose pas partout : **le lien dépasse sa colonne de ses marges et
  de ses bordures.** Mesuré le 24/11 dans Chrome : un lien aux classes du bouton, dans une colonne de 358 px, fait
  399,6 px de large, 41,6 px de trop. #134 relève 8 px : l'écart n'est pas expliqué, la tâche 7 mesure d'abord.
- La place sous la barre. La coque du téléphone garde, en bas de ce qui défile, une place de 138 px plus la zone sûre.
  La barre « Écrire à Natsume » est à 78 px du bas et fait environ 42 px : sur le papier, la règle de `design.md:90-92`
  tient (78 + 42, plus 18 d'écart). Mais cette place est la marge du bas d'un conteneur qui défile, et la page du lieu
  y est une boîte de toute sa hauteur, que le Bureau dépasse. Chrome ajoute la marge du bas après la boîte, pas après
  ce qui la dépasse : **la place tombe**, et la fin du Bureau (« Ce qui vient ») passe sous la barre. Reproduit le 24/11
  dans Chrome 157 sur une page locale : un enfant à 100 % de hauteur avec 900 px de contenu, dans un conteneur à 138 px
  de marge basse, donne 900 px à faire défiler ; le même enfant à hauteur libre, 1 038 px.
- Même cause pour le Journal et À trancher au téléphone : leur fin passe aussi sous la barre (non relevé dans #134, à
  mesurer à la tâche 7). L'Atelier, la fiche de Natsume et la mise en route ont déjà une boîte à hauteur libre. La
  Constellation garde une boîte de toute la hauteur : son ciel place les postes en pourcentage de la hauteur.
- Le Bureau du téléphone et À trancher finissent en plus par leur propre marge de 72 px. Une fois la place rendue,
  elles s'y ajouteraient : 210 px de vide en fin de page.

### La vérification dans Chrome, aujourd'hui

- `standards/design.md:142-147` : 1440 et 390 px de large, contre la planche ou la galerie. Rien sur la hauteur.
- Une fenêtre de Chrome ne descend pas sous 528 px de large : le mode téléphone des apps s'y applique (sous 768 px),
  mais pas la largeur d'un téléphone. Les apps refusent d'être affichées dans un cadre : le core répond
  `frame-ancestors 'none'` et `X-Frame-Options: DENY` (lu le 24/11), Acedia de même d'après son audit. Les plans récents
  prouvent les 390 px par l'émulation d'appareil des DevTools ou par Chrome sans interface, piloté par le protocole de
  débogage ([suites du Journal](2026-11-23-suites-journal-acedia.md), [trois promesses](2026-11-19-trois-promesses.md)).
- L'app du core exige un jeton d'appareil, obtenu par un code d'appairage.

## Les choix

1. **Le lien du kit : `flex: none` sur `.lien`**, une ligne. Le défaut est celui du lien, qui a une hauteur fixe. Le
   rail reste tel quel : une règle sur tous les enfants de `.liens` toucherait aussi les groupes et ce que les apps y
   posent. Rien d'autre du kit ne change.
2. **Les filtres du Journal au téléphone : la feuille du panneau de détail du core.** Ni le `Dialog` du kit, une
   fenêtre centrée faite pour une question et ses boutons ; ni un composant neuf, qui voudrait sa vitrine dans la
   galerie, sa ligne d'inventaire et quatre copies pour un seul écran. La feuille est déjà le calque du téléphone dans
   le core (entrée, poste, conversation), et #134 la juge sans défaut. Le comportement attendu :
   - **Ouvrir** : « Filtres » ouvre la feuille, titrée « Filtres », par-dessus la liste, avec son voile. La liste ne
     bouge pas. La recherche reste dans la page. Le focus entre dans la feuille.
   - **Dedans** : la période, les postes et le type, sans « Plus de filtres » (décision 2). Les rangées gardent leur
     enveloppe en grille et ses 10 px d'écart dans le portail de la feuille. Chaque choix s'applique tout de suite :
     l'adresse et la liste suivent, le bouton dit le compte (« 1 filtre »), la feuille reste ouverte. Les flèches
     restent aux commandes de la feuille.
   - **Fermer** : « Replier », le voile, Échap ou Retour. Les choix restent (décision 1), le focus revient au bouton
     « Filtres ».
   - **L'historique** : la feuille compte pour un pas. Ouverte puis fermée, un Retour rend le filtre d'avant la
     feuille. Retour, feuille ouverte, la ferme sans quitter le Journal ni défaire les choix : l'adresse des choix est
     remise par un nouvel ajout à l'historique, et ce qui suivait l'entrée est perdu. Ouverte et fermée sans choix,
     l'historique est celui d'avant.
   - **Au bureau** : rien ne change, « Plus de filtres » compris. Une fenêtre qui s'élargit, feuille ouverte, ne montre
     pas les filtres en panneau.
3. **« Voir les N » : `box-sizing: border-box` sur ce bouton**, dans le Bureau du core, si la tâche 7 montre que c'est
   lui qui déborde. Le kit ne change pas (critère 1). L'autre voie, la même règle sur `.btn` du kit, touche les quatre
   apps : issue `inbox`.
4. **La place sous la barre : au téléphone, le Bureau, À trancher et le Journal suivent leur contenu**, à hauteur
   libre comme l'Atelier ; la place de la coque redevient la fin de ce qui défile. Les trois lieux sont nommés ; la
   Constellation et les autres ne changent pas. Au téléphone, la marge propre du bas du Bureau et d'À trancher passe
   de 72 à 24 px, celle du Journal : la place est tenue une fois, par la coque.
5. **Le vide : au téléphone, les lignes du Journal n'ont plus de hauteur minimale.** Celle de `ListRow` est faite pour
   les trois lignes d'un mail. Une ligne a la hauteur de ce qu'elle dit : environ 53 px sans issue, 85 px avec,
   au-dessus des 44 px d'une cible tactile. Le Journal le pose sur ses lignes ; `ListRow` ne change pas (critère 1).
   Compilé le 24/11, le sélecteur du Journal porte trois classes, celui de `ListRow` deux : il l'emporte quel que soit
   l'ordre des feuilles. La mesure se prend quand même sur l'app construite.
6. **La preuve dans Chrome**, pour chaque point : **Chrome sans interface**, piloté par le protocole de débogage, sur
   des pages locales et des données fictives : la galerie (`npm run galerie`, dans `design/`), les démos d'Acedia et
   d'Avaritia (`npm run demo`), le core local de la tâche 6, son app construite et servie par lui. Trois tailles :
   **1366 × 630**, la page d'une fenêtre de 1366 × 720 (le critère 1) ; **1366 × 536**, la page mesurée par l'audit
   d'Acedia ; **390 × 844**. Une mesure par script, sur `main` puis sur la branche : le défaut se voit avant, plus
   après. Une capture par point, sans donnée réelle. Pas une fenêtre redimensionnée, pas un cadre. CrOliX peut refaire
   le constat dans l'émulation d'appareil des DevTools.
7. **Deux lignes du standard**, dans « Vérification avant toute PR de front », après la phrase des captures :

   > Il l’est aussi en hauteur courte, une page de 630 px (une fenêtre de 1366 × 720) : ce qui déborde y défile.
   > Les 390 px se prennent par l’émulation d’appareil ou Chrome sans interface : une fenêtre ne descend pas si bas.

   Le standard passe de 147 à 149 lignes, sous les 150 (`tools/check-repo.mjs:201`). `npm run sync` régénère sa copie
   dans le plugin (`plugin/skills/lun-design/references/design.md`).

## L'ordre des fusions

La CI du core et celle de Lun'Luxuria comparent leur copie du kit au `main` de lun-docs, au moment où elles tournent.

- **La PR lun-docs du chantier reste en brouillon, marquée « Ne pas fusionner », tant que les PR du core et de
  Lun'Luxuria ne sont pas vertes hors l'étape du kit.** Les PR du core des chantiers 1 et 2 prêtes à ce moment-là se
  fusionnent avant.
- Puis la PR lun-docs est fusionnée (le lien du kit, le standard, ce plan coché). La CI des PR du core et de
  Lun'Luxuria est relancée ; verte, elles sont fusionnées dans la foulée. Acedia et Avaritia, dans n'importe quel ordre.
- Entre les deux, toute autre PR du core ou de Lun'Luxuria échoue à l'étape du kit : elle reprend `main` de son dépôt
  après la fusion de la PR du chantier.

## Les tâches

**Les barrières**, depuis le worktree, une commande par ligne :

- lun-docs : dans `design/`, `npm run typecheck`, `npm test`, `npm run format:check`, `npm run build` ; à la racine,
  `npm test`, `npm run check`, `npm run sync:check`.
- Lun'Acedia, Lun'Avaritia, Lun'Luxuria : `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check`,
  `node <lun-docs>/tools/check-repo.mjs --public .` ; pour Lun'Luxuria, en plus,
  `node <lun-docs>/tools/sync-kit.mjs --check src/lib/ui`.
- Lun'Anima : dans l'issue privée.

`<lun-docs>` est le clone de lun-docs (`..\..\lun-docs` depuis un worktree sous `wt\`), sur la branche de la tâche 1
tant qu'elle n'est pas fusionnée.

Un comportement neuf a ses tests, écrits d'abord par le testeur, rouges sur `main`. Une règle CSS seule n'a pas de
test unitaire : jsdom ne calcule aucune mise en page. Sa garde est la mesure dans Chrome, avant puis après.

1. - [x] **Le lien du kit garde sa hauteur** (`dev-front` ; lun-docs). **En parallèle de 2, 3, 4, 6 et 8.**
   - Fichier : `design/kit/NavLink.svelte`. Dans `.lien`, `flex: none;`, avec un commentaire d'une ligne : un lien
     garde sa hauteur quand le rail déborde, la liste défile.
   - Preuve dans la galerie, Chrome sans interface, à 1440 et à 390 px de large : la pièce « Rail, principal, avec
     NavGroup », son cadre ramené à 200 px de haut par le script de la preuve. Chaque `.lien` du rail mesure 34 px ;
     `.liens` défile (`scrollHeight` plus grand que `clientHeight`). Sur `main`, le même script donne des liens sous
     34 px. Capture avant et après.
   - Exclu : `Rail`, `NavGroup`, `ListRow`, `Button`, le code de la galerie et son inventaire.
2. - [x] **La hauteur courte et les 390 px dans le standard** (la session ; lun-docs). **En parallèle de tout.**
   - `standards/design.md:142-147` : les deux lignes du choix 7.
   - `npm run sync`, puis `npm run check` et `npm run sync:check` au vert.
   - Exclu : toute autre règle du standard.
3. - [x] **La copie d'Acedia** (`dev-front` ; lun-acedia). **En parallèle de 1.**
   - Fichier : `views/src/lib/ui/NavLink.svelte`, la même déclaration et le même commentaire, à la main. À la fin, le
     diff avec `design/kit/NavLink.svelte` de la branche de la tâche 1 est vide.
   - Preuve : `npm run demo`, Chrome sans interface à 1366 × 630 puis à 1366 × 536, sur Réception puis sur l'Agenda :
     les quatre liens directs à 34 px, la liste qui défile quand elle déborde. Sur `main`, la même mesure montre le
     défaut là où la colonne déborde ; si elle ne déborde à aucune des deux hauteurs avec la démo, la PR le dit et
     descend jusqu'à ce qu'elle déborde. Sur l'Agenda, relever si le lien courant reste en vue (« Limites »).
   - Exclu : la place du mini-calendrier, le `Rail` d'Acedia, la barre du bas au téléphone.
4. - [x] **La copie d'Avaritia** (`dev-front` ; lun-avaritia). **En parallèle de 1.**
   - Fichier : `app/src/lib/ui/NavLink.svelte`, à la main ; diff vide avec le kit de la tâche 1.
   - Preuve : `npm run demo`, à 1366 × 630, la barre inchangée ; puis la barre forcée plus courte par le script : les
     liens à 34 px, la liste défile.
   - Exclu : tout autre fichier.
5. - [x] **La copie de Lun'Luxuria** (`dev-front` ; lun-luxuria). **Après 1, relue.**
   - `node <lun-docs>/tools/sync-kit.mjs src/lib/ui`, lun-docs sur la branche de la tâche 1 : le diff ne porte que
     `src/lib/ui/NavLink.svelte`. `--check` répond « kit: OK » contre cette branche.
   - Preuve : la page des réglages (`npm run dev`), à 1366 × 630, inchangée. La CI passe au vert après la fusion de la
     PR lun-docs (« L'ordre des fusions »).
   - Exclu : tout autre fichier.
6. - [ ] **Le semis du core local** (`dev-core` ; Lun'Anima, hors du dépôt, commandes dans l'issue privée).
   **En parallèle de 1 à 4 et de 8 ; avant 7.**
   - Une base jetable, hors du dépôt. Le jeton d'appareil de l'app par un code d'appairage sur cette base.
   - Un semis écrit hors du dépôt, dans le dossier de travail de la session, qui passe par les fonctions du core : des
     entrées du Journal avec et sans issue, dont un événement de Natsume « Le point du matin est posté », sur deux
     jours au moins ; plus de cartes à trancher que la hauteur d'écran n'en montre au téléphone, assez pour que le
     Bureau, À trancher et le Journal défilent. Données inventées, rien de réel.
   - Rend : le chemin du semis et la suite de commandes, qui rejouent la base depuis zéro.
   - Exclu : tout fichier du dépôt ; un vrai satellite ; une vraie base.
7. - [ ] **La mesure de `main`** (`dev-front` ; Lun'Anima). **Après 6 ; avant 9 et 10.**
   - Sur `main`, l'app construite et servie par le core local, Chrome sans interface à 390 × 844 :
     - le Bureau : chaque élément qui dépasse la largeur de la page, et de combien ; « Voir les N » parmi eux ou non ;
     - en fin de défilement du Bureau, d'À trancher et du Journal : ce que la barre « Écrire à Natsume » couvre ;
     - le Journal : la hauteur de chaque ligne et le vide sous son contenu, avec et sans issue ;
     - les filtres dépliés : de combien la liste descend.
   - À 1366 × 630 : les mêmes lieux au bureau, en capture, pour la comparaison de la tâche 11.
   - Les chiffres et les captures vont dans la tâche, avant tout code.
   - **Si ce qui déborde n'est pas « Voir les N »**, ou pas seulement lui, la tâche 9 attend : la session complète le
     plan, puisque `border-box` ne ferme pas alors le critère 3.
8. - [ ] **Les filtres du Journal en feuille, au téléphone** (`testeur`, puis `dev-front` ; Lun'Anima, fichiers dans
   l'issue privée). **En parallèle de 6 et 7.**
   - Tests d'abord, en mode téléphone :
     - « Filtres » ouvre une fenêtre modale nommée « Filtres » ; la période, les postes et le type y sont, sans « Plus
       de filtres », et plus dans la page ; la liste est la même avant et après l'ouverture ;
     - un choix dans la feuille change l'adresse et la requête, la feuille reste ouverte, le bouton dit « 1 filtre » ;
     - « Replier », puis Échap, ferment la feuille ; le focus revient au bouton ; l'adresse garde les choix ;
     - deux choix, « Replier », puis Retour : le filtre d'avant la feuille ; ouverte puis fermée sans choix, Retour
       fait ce qu'il faisait sans elle.
   - **Les tests dédiés de la décision 1** :
     - Retour après deux choix, feuille ouverte : la feuille se ferme, le Journal reste, l'adresse est celle des
       choix, remise par un nouvel ajout à l'historique ; un second Retour rend le filtre d'avant la feuille ;
     - la réponse tardive de l'adresse d'avant, relue au passage par ce Retour, est jetée : la liste montre les choix ;
     - un choix dans la feuille remplace l'adresse sans effacer la marque de la feuille : après lui, Retour ferme
       encore la feuille au lieu de quitter le Journal ;
     - l'avant perdu : après ce Retour, Suivant ne mène plus à rien ; c'est voulu, le test l'écrit ;
     - Retour sans choix, feuille ouverte : la feuille se ferme, l'adresse et l'historique sont ceux d'avant.
   - Les flèches dans la feuille ne déplacent pas le focus vers la liste ; depuis la feuille d'une entrée, elles
     parcourent encore les lignes.
   - Au bureau : aucune feuille, les filtres en place avec « Plus de filtres », les tests existants inchangés ; repassé
     au bureau feuille ouverte, aucun panneau de filtres.
   - Code : la feuille du panneau de détail, au téléphone seulement. Elle reçoit les trois rangées dans leur
     enveloppe en grille ; « Plus de filtres » n'y est pas. Rien de neuf dans le kit.
   - Exclu : la recherche, les filtres au bureau, leurs textes, la feuille elle-même.
9. - [ ] **Le Bureau du téléphone : « Voir les N » et la place sous la barre** (`dev-front` ; Lun'Anima, fichiers dans
   l'issue privée). **Après 7.**
   - « Voir les N » ne dépasse plus sa colonne (choix 3), si la tâche 7 l'a désigné.
   - Au téléphone, le Bureau, À trancher et le Journal à hauteur libre ; la marge propre du bas du Bureau et d'À
     trancher à 24 px (choix 4).
   - Des règles CSS : pas de test unitaire, les tests du téléphone restent verts. La mesure est à la tâche 11.
   - Exclu : la barre « Écrire à Natsume » (sa place, sa hauteur, ses textes), la navigation du bas, la Constellation.
10. - [ ] **Le vide sous une ligne du Journal** (`dev-front` ; Lun'Anima). **Après 7 et 8**, même fichier que la 8.
    - Au téléphone, les lignes du Journal sans hauteur minimale (choix 5). Au bureau, rien ne change.
    - Exclu : `ListRow`, le texte des lignes, la densité du Journal au bureau.
11. - [ ] **La copie du kit du core, et la preuve dans Chrome** (`dev-front` ; Lun'Anima, commandes dans l'issue
    privée). **Après 1 relue, 8, 9 et 10.**
    - La copie du kit régénérée par `sync-kit` depuis la branche de la tâche 1 : le diff ne porte que `NavLink.svelte`.
    - La base du semis rejouée depuis zéro ; l'app construite, servie par le core local.
    - Chrome sans interface à 390 × 844, mesuré par le script de la tâche 7, sur la branche :
      - le Journal : la feuille s'ouvre par-dessus, la liste ne bouge pas ; les gestes de la tâche 8 joués à la
        souris et au clavier, **les cas de la décision 1 compris**, avec le Retour du navigateur ; aucune ligne n'a plus
        que sa marge sous son contenu ;
      - le Bureau : aucun élément ne dépasse la largeur de la page ;
      - en fin de défilement, le bas du dernier contenu du Bureau, d'À trancher et du Journal est au-dessus du haut de
        la barre « Écrire à Natsume », avec un écart ;
      - la feuille d'une entrée et celle de la conversation s'ouvrent et se ferment comme avant.
    - À 1366 × 630 : le Journal et le Bureau du bureau comme aux captures de la tâche 7 ; un coup d'œil à la
      Constellation et à l'Atelier.
    - Captures dans la PR, sans donnée réelle.
12. - [ ] **La revue et la livraison** (`reviewer`, puis `livreur`). **À la fin.** Chaque diff relu contre sa tâche et
    les standards ; une PR en brouillon par dépôt ; les fusions dans « L'ordre des fusions ». Ce plan coché dans la PR
    lun-docs avant sa fusion. Les issues `inbox` de « Hors périmètre » ouvertes par la session. Après la dernière
    fusion, le graphe mis à jour, la base et le semis jetables effacés.

**Parallèle.** Partent ensemble : 1, 2, 3 et 4 (quatre fichiers, trois dépôts), avec 6 et 8 (le semis, hors du dépôt ;
les filtres, dont les tests ne demandent pas de base). La 7 suit la 6 ; la 9 suit la 7 ; la 10 suit la 7 et la 8 (même
fichier que la 8). Les tâches 5 et 11 attendent la 1 relue ; la 11 attend aussi 8, 9 et 10. La 12 ferme.

## Hors périmètre

- Le reste des audits du 24/11 : design, finitions, fonctions absentes du téléphone (après le VIP, selon le chapeau).
- La place du mini-calendrier dans le rail de l'Agenda, et un rail qui garde le lien courant en vue : une issue
  `inbox` dans Lun'Acedia, ouverte par la session.
- `box-sizing: border-box` sur `.btn` du kit, pour qu'un `Button` rendu en lien ait la boîte d'un bouton : une issue
  `inbox` dans lun-docs, ouverte par la session ; elle touche les quatre apps.
- « Le point du matin est posté » à côté de « Lettre du matin, Fait » : un fait dit deux fois, et un mot que le
  dictionnaire écarte (audit du core). Le texte ne change pas ici.
- La densité du Journal au bureau.
- Une règle des standards pour un filtre qui s'ouvre par-dessus au téléphone : pas dans les critères.
- Un composant de feuille dans le kit ; la feuille du core dans l'inventaire de la galerie.
- La barre « Écrire à Natsume » elle-même.

## Limites

- **Le vide et l'écart de « Voir les N » au téléphone sont calculés** : 40 px sous une ligne sans issue ; 41,6 px de
  trop au calcul et à la mesure simulée, 8 px dans #134. La tâche 7 les mesure sur `main` avant tout code.
- **Le semis et les cartes.** Le core ne montre les cartes que d'un poste relié ; un poste qui ne répond pas les montre
  en lecture seule. Le semis doit donc écrire aussi un poste ; ce qu'il faut pour que la file paraisse n'a pas été
  essayé.
- **La barre qui grandit.** Quand le champ est fermé, la barre dit pourquoi ; un texte sur deux lignes la porte vers
  60 px, et 78 + 60 atteint la place de 138 px, sans écart. Non vu ; hors du chantier.
- **À 536 px de haut**, sur l'Agenda, le lien courant peut sortir de la vue : la liste défile et rien ne rétrécit, mais
  le mini-calendrier garde la place.
- **Aucun test unitaire ne garde ces règles CSS** : jsdom ne calcule pas de mise en page. La garde est la mesure dans
  Chrome, et le standard pour les écrans à venir.
- Non vérifié : la barre d'Avaritia quand elle déborde (elle ne déborde pas) ; la page des réglages de Lun'Luxuria à
  630 px de haut.
