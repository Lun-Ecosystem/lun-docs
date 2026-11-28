# La route jusqu'au MVP : l'état et les chantiers

> Demande de CrOliX, le 07/11 : « reprendre l'état global actuel de l'écosystème, identifier les points à traiter au vu
> du MVP, les classer et préparer les prochains chantiers complets en autonomie ». Depuis le 08/11, ce document fait foi
> pour l'avancement (décision de CrOliX après l'[audit](2026-11-08-audit-ecosysteme.md), Q8) : le Project GitHub est
> fermé depuis le 09/11 (chantier I), les issues gardent leurs étiquettes et leurs niveaux.

## 1. Où on en est

**Au 28/11.** La carte des flux est relevée source par source
([carte](../specs/2026-11-27-carte-des-flux-relevee.md), [document des échanges](../flux/README.md), lun-docs#237) :
41 trous, onze décisions de CrOliX (F1 à F11), et le reste trié en cinq chantiers (lun-docs#238 à #242) et sept
issues `inbox`. CrOliX fixe l'ordre le 27/11 : deux chantiers entrent avant la semaine de rodage, le gel du 26/11
est rouvert pour eux (§ 3, rang 2, points 7 et 8). Le premier,
[le suivi d'une action](2026-11-27-suivi-action.md), est en cours : son plan est validé, le contrat des satellites
passe en 1.6.

**Au 27/11.** « Trancher depuis le core » est fusionné (lun-anima#162, lun-docs#232) et le core 0.4.1 est en service
sur le NAS depuis le 26/11 à 22 h 37, les trois applis saines. Première nuit avec la porte d'attention : la lettre du
matin est écrite à 7 h 30. Elle dit une nuit sans urgence, trois cartes proposées par Lun'Acedia, rien d'urgent, et
les deux rendez-vous du jour ; CrOliX confirme que les trois cartes sont des propositions de tri, sur des promotions
et des annonces de jeu. Ce que la lettre ne prouve pas : elle se tait quand la veille de la nuit a réussi, et aussi
quand elle n'a pas tourné ; sa ligne se lit au Journal du core. Restent à relire, chez lui : cette ligne, les copies
du jour par la porte, et ses trois gestes sur la carte (voir, corriger, trancher par le chat). Le
[plan du NAS](2026-11-22-mise-en-service-nas.md) est coché de ce qui a été joué le 26/11.

Le même jour, CrOliX constate dans Lun'Acedia que « Non lus » est vide au téléphone hors d'une boîte qui en a, que
« Proposés » ne se comprend pas, et que les boîtes ne disent pas leurs non lus. Il demande un tour d'ensemble avant
tout plan : il est dans Lun-Ecosystem/lun-acedia#120, avec ses quatre décisions. Le gel est rouvert sur ce point,
[les filtres et les compteurs de Lun'Acedia](2026-11-27-acedia-filtres-compteurs.md), au rang 2.

**Au 26/11.** La porte d'attention est fusionnée (lun-anima#157, lun-docs#225), pas publiée. CrOliX gèle le
périmètre : les chantiers de flux qui restent passent après le VIP, et l'ordre à jour est au § 3,
« La replanification du 26/11 ».

**Au 26/11, le soir.** Les trois versions sont publiées et en service sur le NAS : le core 0.4.0, Lun'Acedia 0.4.0
(après le core), Lun'Avaritia 0.3.1. Sur le NAS, le retour arrière et la restauration à part sont joués, le
fournisseur de modèle est réglé par l'écran. En essayant, CrOliX constate que la carte d'une proposition de tri ne
dit pas ce qui est proposé, ne se corrige pas, et que le chat écrit ne la tranche pas. Il rappelle son usage : sur
le desktop tout passe par Natsume, par la voix d'abord et le panneau en secours ; en déplacement, sans voix, tout
passe par le panneau. Le gel est rouvert sur ce point :
[trancher depuis le core](2026-11-26-trancher-depuis-le-core.md) (Lun-Ecosystem/lun-docs#231), codé le soir même, en
brouillon.

**Au 20/11, le soir.** CrOliX corrige l'hôte du MVP ([ADR 0014](../../adr/0014-mvp-sur-le-nas.md)) : le core, Acedia et
Avaritia tournent sur le NAS, en continu ; Lun'Luxuria est une application du desktop. L'ADR 0012 (12/11) avait pris
son « à terme, un serveur dédié » pour une décision présente, et tout ce qui suit dans ce document entre le 12 et le
20/11 s'y était aligné : la « prod du rodage » sur le desktop, la bascule vers la machine dédiée. L'ordre à jour est au
§ 3, « Le recadrage du 20/11 ».

**Au 20/11.** Les trois petites promesses sont faites ([plan](2026-11-19-trois-promesses.md), lun-docs#186) :
l'export d'Avaritia se télécharge (lun-avaritia#42, fusionnée) ; les conflits d'agenda et l'agent sans nom en dur
sont en PR (lun-acedia#75, brouillon, CI verte). Ce qui reste demande le vrai Google, au § 4.

**Au 19/11.** « Le tour » est fusionné (lun-luxuria#96, lun-docs#182). CrOliX demande un
[recadrage](../specs/2026-11-19-recadrage-vip.md) : la version VIP tient ce que chaque outil promet, et six décisions
la bornent (son § 7). L'ordre qui en sort est au § 3, « Le recadrage du 19/11 » ; il remplace, pour la suite, l'ordre
du 16/11. `vision.md` est réécrite avec lui.

**Au 09/11.** I et J sont faits : lun-docs#108 et Lun-Ecosystem/.github#3, lun-anima#81, lun-acedia#59,
lun-avaritia#24 ; le Project est fermé. K : la procédure (lun-docs#111, reprise par lun-docs#112) et les copies
d'Acedia et d'Avaritia (lun-acedia#61, lun-avaritia#29) ; reste la restauration, à essayer au § 4. N : le
brouillon de la barre est sur `main` (lun-anima#88), ses scènes se jouent au § 4. O : lun-anima#91, lun-acedia#63,
lun-avaritia#30. M : lun-luxuria#41, lun-avaritia#31, lun-acedia#64 et la règle de `design.md` ; pas de PR pour le
core, les recouvrements de l'audit ne se voyant qu'en cours de défilement. L : lun-luxuria#44, prouvée sur le laptop
jusqu'à l'exe, fusionnée le 10/11 ; sa fenêtre se constate sur le desktop (§ 4). Tout le reste est sur `main`.

Le même jour : la session sur le desktop (§ 4) est décalée, CrOliX n'étant pas chez lui. Les plans de L et M sont
écrits, et un chantier O s'ajoute, validé par CrOliX : les écarts vus en route que la semaine de rodage peut
rencontrer. Les autres restent en `inbox`.

**Au 10/11.** P fusionné : lun-docs#123 (le kit et la spec, le 09/11), lun-anima#92, puis les copies lun-luxuria#45,
lun-acedia#65 et lun-avaritia#32. L fusionné (lun-luxuria#44) ; sa fenêtre se constate sur le desktop (§ 4). Les autres
chantiers du jour, tous fusionnés :

- l'état cible et ses quatre lignes d'arrivée : lun-docs#128, #148 ;
- le [dictionnaire](../../standards/dictionnaire.md) : lun-docs#131 ;
- la galerie du kit, puis la carte et la permission : lun-docs#133, #138, #140, #142 ; les copies lun-anima#93, #94,
  lun-luxuria#46, #47 ;
- l'étude d'OpenAmika, puis sa correction contre notre code : lun-docs#146, #149 ;
- le [premier mot](2026-11-10-premier-mot.md) mesuré : lun-anima#96, lun-docs#150 ;
- les relevés de B1 sur le desktop : lun-luxuria#49, lun-docs#152 ;
- [le tour de parole](2026-11-10-tour-de-parole.md) : lun-luxuria#51, lun-anima#99, lun-docs#153 ;
- l'étude de la présence et le plan de [l'écoute](2026-11-10-ecoute.md) : lun-docs#154.

**Au 11/11.** Tous fusionnés :

- [l'écoute](2026-11-10-ecoute.md) : lun-luxuria#54, lun-docs#155 ; puis
  [la fin de phrase](2026-11-11-fin-de-phrase.md), arrêtée par un relevé, et 700 ms de silence de fin à la place :
  lun-luxuria#56, lun-docs#156 ;
- [la coupure qui se reprend](2026-11-11-coupure-reprise.md) : lun-luxuria#58, lun-docs#157, #158 ;
- [la phrase d'attente](2026-11-11-phrase-attente.md) : lun-anima#102, lun-docs#159, #160 ;
- le banc de présence, étapes 1 et 2 : [le déroulé du tour](2026-11-11-deroule-tour.md) (lun-luxuria#61,
  lun-anima#104, lun-docs#161 pour le cadrage du banc), puis [les scénarios](2026-11-11-scenarios-presence.md)
  (lun-luxuria#64) ;
- un manager et dix agents par métier : lun-docs#163.

Le banc, étape 3 ([la chaîne sur le laptop](2026-11-11-chaine-laptop.md)) : faite, fusionnée le 12/11 (lun-luxuria#66,
lun-anima#106 ; lun-docs#162 pour l'axe). Les scénarios rejoués par la page construite, la vraie transcription et le
serveur sur un faux modèle tiennent leurs 25 attentes `tous`, trois fois ; aucun écart de mécanisme, six observations
en `inbox` (lun-luxuria#67 à #72). Les trois scénarios ajustés sont validés par CrOliX.

**Au 12/11.** Étape 4 ([les données et les taux](2026-11-12-donnees-et-taux.md)) : codée et fusionnée (lun-luxuria#76). La
course d'Hortense rate 1 partie sur 300, par la transcription ; aucun défaut du mécanisme ; la toux attend ses prises.

Le même jour, CrOliX tranche ([état cible](../specs/2026-11-10-etat-cible-cadrage.md)) : la semaine de rodage est la
porte du MVP ; le premier appareil sans terminal y entre (lun-anima#72) ; la langue se tranche sur le desktop (B2) ;
aucune vraie carte avant les mots des gestes (B1) ; la prod ira sur la machine dédiée, le NAS au stockage
([ADR 0012](../../adr/0012-prod-machine-dediee.md)). L'ordre qui en sort est au § 3. Trois chantiers partent en
parallèle, aucun fusionné : « tenir en continu » (lun-docs#164, en brouillon), « écoute et parole » (lun-luxuria#77,
son plan fusionné par lun-docs#162), « remettre les textes d'accord » (lun-docs#165, en brouillon).

**Au 08/11 au soir, après l'audit.** L'[audit](2026-11-08-audit-ecosysteme.md) a posé douze questions ; CrOliX les a
tranchées (audit, § 7), sauf la langue parlée (B2, à l'oreille) et lun-acedia#30 (après le MVP). Appliqué le jour même,
hors dépôt : squash seul sur les cinq dépôts, plugin `lun` à la racine du laptop. Confronté aux sources (audit, § 8), le
premier contact au terminal sort alors du MVP : l'installation passe par le terminal une fois, avant la semaine, et rien
ne doit l'exiger pendant. Restaient ce jour-là les chantiers I à N (§ 3), la session sur le desktop (§ 4), puis la
semaine de rodage (B8). Le 12/11, CrOliX fait entrer au MVP le premier appareil sans terminal (lun-anima#72, § 3).

**Au 08/11.** La liste A est faite côté laptop : F (lun-anima, lun-luxuria#22), G (lun-anima#69 et #71,
lun-luxuria#24, la page [`mise-en-service-desktop.md`](../mise-en-service-desktop.md)), H sans ses relevés
(lun-luxuria#10), A4. La première mise en service du desktop a fait remonter huit écarts de Luxuria (lun-luxuria#25 à
#32), corrigés en un chantier : lun-luxuria#33 et lun-docs#98 (voix réglée par l'écran, réglages par thèmes, quitter,
icône lisible). Décision de CrOliX le 08/11 : **le rodage se fait sur le desktop**, le NAS passe après (§ D) ; son
chantier peut se préparer en parallèle. Du 12 au 20/11, ce document a dit la bascule vers la machine dédiée (ADR
0012) ; depuis le 20/11, le MVP tourne sur le NAS et s'y rode directement (ADR 0014).

Le tableau ci-dessous garde l'état du 07/11.

| Jalon (spec écosystème §10.3) | État au 07/11 |
|---|---|
| J0, J1, J2 | faits |
| J3 Apps v1 | mobile fait ; Lun'Luxuria remplace l'app desktop, dans sa fenêtre Tauri (lun-luxuria#20) |
| J4 Nuit, voix, contrôle | nuit, matin, notifications, voix et corps en images faits ; relevés du desktop en attente ; avatar animé après le MVP (lun-docs#62) ; **modes remplacés par le mute du bureau** (décision du 07/11) |
| J5 Rodage | pas commencé : rien ne permet encore une semaine sans intervention (§2, A2) |

Dépôts, au 07/11 : aucune PR ouverte, tout est sur `main` ; lun-anima était resté sur une branche déjà fusionnée (#65),
remis sur `main`. Plans du 07/11 : tous cochés sauf `voix-confiance-blocs` (pas commencé) ; `luxuria-essai-chronometre`
reste en partie vide, son relevé est fait (lun-luxuria#9).

## 2. Ce qui reste, classé

### A. Bloque le MVP, faisable sur le laptop

| # | Point | Où | Chantier |
|---|---|---|---|
| A1 | **Le mute du bureau** : couper ses sens, urgences en exception réglable | lun-luxuria, lun-anima | [F](#f-le-mute-du-bureau) ; fait : lun-luxuria#22 |
| A2 | **Le poste qui tourne seul** : serveurs sans console qui redémarrent, journaux, sauvegarde de la base, Luxuria avec Windows et dans la zone de notification, téléphone par Tailscale | les cinq dépôts | [G](#g-le-poste-qui-tourne-seul) ; côté laptop : lun-anima#69, lun-luxuria#24, la page [`mise-en-service-desktop.md`](../mise-en-service-desktop.md) ; l'installation est B8 ; fait côté laptop, mise en service du desktop le 08/11 |
| A3 | **La confiance de whisper-server** fixée à 0,9 : un « Oui » a validé une carte (lun-luxuria#6, critique), et RVC par blocs (lun-luxuria#7, première étape). La partie code se prouve sur le laptop contre des faux ; seuls les relevés demandent le desktop | lun-luxuria | [H](#h-la-confiance-de-la-voix) ; code fait (lun-luxuria#10), relevés en B1 |
| A4 | Les specs qui se contredisent sur les modes (J4, notifications, Luxuria §6.6), et l'app desktop du §8 de la spec écosystème (mises à jour) | lun-docs | fait : lun-docs#95, la PR qui le ferme (le §8 disait déjà « sans mise à jour automatique au MVP ») |
| A5 | **Ce que l'audit du 08/11 ajoute** : les normes à jour, des états vrais, les trois bases copiées, Luxuria au quotidien, le kit tenu, la barre de la personnalité | les cinq dépôts | [I](#i-les-normes-à-jour) à [N](#n-la-barre-de-la-personnalité), puis [O](#o-les-écarts-avant-la-semaine) |

### B. Bloque le MVP, attend le desktop ou CrOliX

| # | Point | Qui |
|---|---|---|
| B1 | Relevés de confiance et de latence (critère 4 du plan `voix-confiance-blocs`), puis levée du verrou de l'ADR 0011. **Relevés faits le 10/11** (`lun-luxuria/docs/essai-2026-11-07.md`, et le [premier mot](2026-11-10-premier-mot.md) rejoué). Le verrou ne se lève qu'après le chantier des mots des gestes : cinq voix au banc, puis la règle ; aucune vraie carte avant (tranché le 12/11, § 3) | CrOliX |
| B2 | La langue parlée : français direct contre réponse en anglais sous-titrée ; puis un ADR qui remplace 0011 (la langue, la mesure de la latence, une cible d'après le MVP) | CrOliX, sur le desktop, à l'oreille |
| B3 | Le flux RVC dès le premier bloc (reste de lun-luxuria#7), décidé après B1 | desktop |
| B4 | Preuve manuelle des touches globales de l'exe (critère 4 du plan Tauri) : `Ctrl+Maj+L` depuis une autre fenêtre, F9 tenue puis lâchée. **Constaté par CrOliX le 10/11** | fait |
| B5 | Rejoindre un salon Discord passe en `occupée` (écart 2 de la recette, corrigé sur le laptop, à constater). **Non constaté le 10/11** : en salon vocal, `/micro` ne voit personne (lun-luxuria#50) | desktop |
| B6 | Une soirée réelle : latence par tour et coût, puis décision sur le plafond de 1 $ par jour (spec Luxuria §6.7) ; noter le silence pendant une délégation à un poste (veille C2) | desktop |
| B7 | Notifications Windows coupées (`ToastEnabled = 0`) ; vcclient sur `0.0.0.0:18000` et règles du pare-feu | CrOliX : réglages système |
| B8 | La semaine de rodage elle-même (J5), la porte du MVP (tranché le 12/11), sur le poste mis en service par G ; noter la lassitude des cartes du matin (veille C9). Proposition : juger l'assistante et le contrôle sur la semaine, la présence à part, par la barre de N | CrOliX |
| B9 | Recette de la sourdine, points 1, 3 et 5 : aucune capture en sourdine, la parole spontanée repart à son heure, en appel un P0 n'est pas dit. **Le 10/11 : points 1 et 3 constatés** (lun-anima#98 pour un message vide après la levée) ; le point 5 attend B5 | desktop |
| B10 | Google en Production sur le vrai compte, consentement refait : en Test, le jeton tombe au bout de 7 jours (audit, Q1 et § 8.2) | CrOliX, sur le desktop |
| B11 | Le téléphone Android : la PWA du core par le HTTPS du tailnet, une notification reçue de bout en bout (reportée à la recette du 07/11) | CrOliX, desktop |
| B12 | Redémarrer le desktop : les services repartent seuls, la nuit manquée (5 h) est rattrapée (rattrapage par défaut, veille C5) | desktop |

### C. Petit, à glisser dans un chantier qui passe par le dépôt

| # | Point | Dépôt | Rangé dans |
|---|---|---|---|
| C1 | Test instable « Logged once, not at each retry » (lun-anima#7, trivial) | lun-anima | F ; fermé |
| C2 | Une nouvelle liaison du core remplace l'ancienne au lieu d'en ajouter une (lun-acedia#30) | lun-acedia | après le MVP (audit, Q3) |
| C3 | Le lien du site rend une 404 dans les README et le profil de l'organisation (veille C14) : le retirer tant que l'hébergement du site n'est pas tranché (lun-docs#21) ; là où `structure-projet.md` exige le badge « écosystème » (README d'un dépôt public), le pointer vers l'organisation **[choix Claude]** | lun-docs, `.github`, lun-acedia, lun-avaritia, lun-luxuria | I pour lun-docs et `.github` ; J, K ou M pour les autres |

### D. Après le MVP

Les rôles de Natsume façon assistants de Mia (spec du mute, §2) ; l'avatar animé (lun-docs#62) ; une machine
dédiée, à terme ([ADR 0014](../../adr/0014-mvp-sur-le-nas.md) : la mise en service du NAS, elle, est avant le MVP, § 3) et
l'accès sans client ; les mises à jour automatiques de
Luxuria ; la trajectoire de Luxuria (§11) ; le confort d'Acedia (#33, #34, #38) ; la forme des dépôts (lun-docs#41)
et la migration complète vers le kit commun (lun-docs#43) ; le site (#21, #25) ; la sandbox. La sauvegarde d'Avaritia
passe au MVP (K).

Ajouts du 08/11, après l'audit :

- Google branché depuis l'interface (lun-acedia#55) ; la liaison qui remplace l'ancienne (lun-acedia#30, C2) ; le
  premier appareil sans terminal (lun-anima#72) en est sorti le 12/11 : il entre dans le MVP (§ 3) ;
- « Pina », le nom de l'agent, écrit en dur dans le code d'Acedia, son README et `.env.example` ;
- les propositions P7 à P14 de la veille : budget de parole, porte « Inner Thoughts », brouillons et validation par lot
  à la lettre du matin, point du soir, humeur calculée, Gmail en push, la nuit en Batch API ;
- exposer les satellites en serveurs MCP, et étudier Rowboat (audit, § 8.9).

Ajouts du 16/11, par [le tri](#le-tri-du-1611) : relier de nouveau un poste déjà relié (lun-anima#90) ; les files de
cartes bornées côté serveur (lun-docs#144) ; l'absence qui voit la manette (lun-luxuria#43) ; un lot d'Avaritia qui
attend son jour sans le dire (lun-avaritia#34, point 2).

## 3. Les chantiers, dans l'ordre

Une PR par dépôt et par chantier, brouillon dès le premier push. Un plan est relu par le plan-challenger, puis CrOliX le
valide par écrit (« validé ») ; fusionner n'est pas valider, et rien ne se code avant
([`workflow.md`](../../standards/workflow.md), étape 2). Les specs F et G sont fusionnées depuis le 08/11 : un de leurs
choix marqués **[choix Claude]** se change désormais par un nouveau chantier.

### F. Le mute du bureau

Spec : [`2026-11-07-mute-du-bureau-design.md`](../specs/2026-11-07-mute-du-bureau-design.md). Plan :
[`2026-11-07-mute-du-bureau.md`](2026-11-07-mute-du-bureau.md). lun-anima (le champ `muted`, puis C1), puis lun-luxuria.
Niveau `standard`.

### G. Le poste qui tourne seul

Spec : [`2026-11-07-poste-autonome-design.md`](../specs/2026-11-07-poste-autonome-design.md). Plan :
[`2026-11-07-poste-autonome.md`](2026-11-07-poste-autonome.md). Niveau `standard`. Après F pour Luxuria (le menu de
l'icône porte le mute).

### H. La confiance de la voix

Plan : [`2026-11-07-voix-confiance-blocs.md`](2026-11-07-voix-confiance-blocs.md), déjà écrit. Critères 1 à 3, 5 et 6
sur le laptop ; le critère 4 attend le desktop, et la PR le dit. Niveau `critique`. Indépendant de F et G : il ne touche
que `voix/`.

**Ordre de F, G et H** (07/11) : H et F en parallèle (dépôts ou dossiers séparés), puis G. Au bout : le poste prêt pour
la semaine de rodage, et la liste B pour le desktop.

### Les chantiers de l'audit (08/11)

Ce qui change pour I à N :

- **Fusion** (audit, Q7) : *Show* pour la doc et le code prouvé sur le laptop, la PR passe « prête » dès ses critères
  prouvés ; *Ask* pour ce que seul le desktop prouve, la PR reste en brouillon jusqu'à la recette de CrOliX.
- **Départ** : un chantier part quand CrOliX a validé ce plan, par la méthode (`lun-chantier`) ; son issue s'ouvre alors
  s'il n'en a pas. Rien n'est codé avant.

### I. Les normes à jour

Plan : [`2026-11-08-normes-a-jour.md`](2026-11-08-normes-a-jour.md) ; issue lun-docs#104.

lun-docs, et `.github` pour son lien mort (C3). Niveau `trivial`. *Show*. Corrige les contradictions de l'audit
(§ 3.1) :

- `essentiel.md` et `structure-projet.md` : le plan d'un chantier vit dans `docs/plans/`, l'avancement dans cette
  feuille de route ; la mise en route décrit ce qui se fait, pas une commande promise. À proposer à CrOliX dans la PR :
  un plan dans lun-docs pour un chantier `critique` ou à plusieurs dépôts, le plan dans la PR pour les autres (audit,
  § 6, point 3) ;
- `workflow.md` réécrit à la pratique (Q9) : la grille d'agents par niveau et la mesure de consommation (lun-docs#8,
  fermée) sortent ;
- `environnements.md` : le desktop, prod du rodage, avec le vrai compte Google ; le laptop, local, avec le compte de
  test ; le NAS après (Q1). Une origine par app, tenue partout : Acedia reste sur `localhost`, l'adresse de retour
  enregistrée chez Google ;
- `git.md` : *Show* et *Ask* (Q7), squash seul (Q12, déjà réglé) ; la feuille de route fait foi (Q8) et le Project est
  archivé ;
- `design.md` : la liste des composants dit ce que le kit a ; menus, onglets, bouton flottant, carte de proposition et
  groupe par jour y sont marqués « à verser au kit » ;
- une page courte, « Architecture actuelle », vers laquelle renvoie la spec écosystème ; elle dit aussi quelle fenêtre
  est l'entrée du soir et lesquelles servent en secours (audit, § 6, point 5) ;
- le registre : `lun-sandbox` (archivé) et une seule forme d'identifiant ; lun-docs reçoit son `CLAUDE.md` (lun-docs#41,
  pour lui seul).

Preuve : `npm run check` et `npm run sync:check` verts ; aucune des contradictions du § 3.1 de l'audit ne reste.

### J. Des états qui disent vrai

Plan : [`2026-11-08-etats-vrais.md`](2026-11-08-etats-vrais.md) ; issues lun-anima#74 et #73, lun-acedia#56,
lun-avaritia#21.

lun-anima, lun-acedia, lun-avaritia : une PR par dépôt. Niveau `standard`. *Show* : se prouve sur le laptop, sur des
bases de démo. Chaque écran dit ce qui est (`design.md`, « Honnêteté ») :

- lun-anima#74 : les routines notées « Fait » sur une base sans clé ;
- lun-anima#73 : les libellés, la durée du code et les étapes de « Relier un poste » ;
- dans le core encore, sans issue (à joindre à lun-anima#74) : « 3 réglages avant de commencer » au-dessus de « Mise en
  route 1 sur 6 », et un même échec dit deux fois dans le Journal ;
- lun-acedia#56 et lun-avaritia#21 : « Tri par l'IA actif » et « Traitement actif » sans fournisseur.

Preuve : les démos de l'audit rejouées, une capture par écran corrigé.

### K. Le poste prêt pour la semaine

Plan : [`2026-11-08-poste-pret.md`](2026-11-08-poste-pret.md) ; issues lun-acedia#57, lun-avaritia#22, lun-docs#106.

lun-acedia et lun-avaritia (le code), lun-docs (la procédure). Niveau `standard`. *Show* pour le code, prouvé par ses
tests ; la restauration se constate sur le desktop (§ 4).

- Chaque nuit, une copie cohérente de `acedia.db` et de `avaritia.db`, sept gardées, sur le modèle de celle du core
  (`VACUUM INTO`). **[choix Claude]** Chaque satellite copie sa propre base : le core ne lit pas les fichiers d'un
  satellite, et sur la machine dédiée chacun aura son volume.
- La restauration, écrite dans [`mise-en-service-desktop.md`](../mise-en-service-desktop.md) pour Acedia et
  Avaritia, et dans le dépôt du core (privé) pour la sienne : une copie garde les secrets chiffrés, elle ne se
  restaure qu'avec la même clé.
- La liste « rien ne force le terminal pendant la semaine », dans la même page : ce qui pourrait le redemander (un jeton
  Google en Test, un redémarrage, une mise à jour de Windows, un nouveau téléphone, un code d'appairage expiré) et, pour
  chacun, la réponse en place ou à mettre.

### L. Luxuria au quotidien

Plan : [`2026-11-09-luxuria-quotidien.md`](2026-11-09-luxuria-quotidien.md).

lun-luxuria. Niveau `standard`. *Ask* : la fenêtre ne se prouve que sur le desktop. Spec :
[`2026-11-08-luxuria-usage-courant-design.md`](../specs/2026-11-08-luxuria-usage-courant-design.md), ses cinq questions
tranchées (audit, Q5).

- La fenêtre entre seule : le son sans geste, que wry permet déjà, et la demande d'accès au micro se constatent
  d'abord dans l'exe ; le micro se règle pour la seule origine de l'app s'il le faut ; le seuil « Entrer » ne reste
  que dans un onglet (audit, § 8.3). Sans le seuil, une absence simple arrête la présence (tranché par CrOliX le
  09/11). Une issue à ouvrir au départ.
- L'arrivée en deux cartes (lun-luxuria#36) ; la consigne qui s'efface au premier tour (#37) ; les réglages partagés
  comme au § 4 de la spec, trois préréglages d'Écoute et « Personnalisé », l'agent neutre, « Identité » (#38).
- Les valeurs des préréglages se mesurent sur le desktop (§ 4).

### M. Le kit tenu partout

Plan : [`2026-11-09-kit-tenu.md`](2026-11-09-kit-tenu.md).

lun-luxuria, lun-avaritia, lun-acedia, lun-anima (la barre de saisie de Natsume), et lun-docs pour le kit : une PR par
dépôt. Niveau `standard`. *Show*.

- La vérification des variables de design dans la CI de Luxuria et d'Avaritia, comme dans celles du core et d'Acedia ;
  celle du kit dans la CI de Luxuria, dont la copie est générée. Acedia et Avaritia gardent leur copie à part jusqu'à
  lun-docs#43.
- Les recouvrements sous un élément flottant (audit, § 4.2, point 4) : la place existe déjà dans les trois apps, la
  cause se cherche d'abord ; la règle s'écrit dans `design.md`, sans variable de design nouvelle.
- Les toasts d'Acedia et d'Avaritia ramenés au code du kit, annulation comprise.
- La publication du paquet de vues d'Acedia retirée (Q11) ; le dossier reste tant que l'app l'importe.

### N. La barre de la personnalité

Plan : [`2026-11-08-barre-personnalite.md`](2026-11-08-barre-personnalite.md) ; issue lun-anima#78.

lun-anima, dépôt privé : les scènes viennent de la vie de CrOliX. lun-luxuria#39 porte la recette. Niveau `standard`.
*Ask* : les scènes se jouent sur le desktop.

- 10 à 12 scènes et une grille de 1 à 5 (audit, Q4). Claude en propose un brouillon, des situations et non des
  répliques ; CrOliX les complète.
- Jouées sur le desktop, notées par CrOliX ; la barre est atteinte si la moyenne vaut 4 au moins et qu'aucune scène
  n'est à 2 ou moins.
- Sous la barre, la piste de la veille (C7, une fiche de personnage) se travaille avec CrOliX : ni le SOCLE, ni la voix
  de Natsume, ni la graine du tempérament ne s'écrivent sans lui.

### O. Les écarts avant la semaine

Plan : [`2026-11-09-ecarts-avant-semaine.md`](2026-11-09-ecarts-avant-semaine.md). Ajouté le 09/11.

lun-anima, lun-acedia, lun-avaritia : une PR par dépôt. Niveau `standard`. *Show*. Les issues `inbox` des chantiers
I, J et K que la semaine peut rencontrer :

- un passage sauté affiché « faite », une lettre du matin sans son contexte du jour, une recherche du Journal par
  « échec » (lun-anima#80, #85, #84) ;
- la copie du core détachée de la nuit, sous la forme de celles des satellites (lun-anima#86, #87) ;
- la barre d'Acedia et celle d'Avaritia, qui disent faux sur une clé, une pause ou un plafond (lun-acedia#60,
  lun-avaritia#25, #27, #28) ;
- la carte d'Avaritia en pause, qui dit les lots arrêtés et les dépôts qui passent (lun-avaritia#26) ;
- la copie ratée de chacune des trois bases, dite au Journal du core, qu'aucun écran ne montre aujourd'hui
  (lun-docs#110) ;
- le test qui rougit au hasard (lun-acedia#58, lun-avaritia#23).

**Ordre de I à O** : I et J en parallèle, K en même temps que J (dépôts communs, mais deux PR séparées, jamais
empilées) ; le brouillon des scènes de N dès le début ; L, M et O ensuite. Tout s'écrit sur le laptop ; L, N et la
restauration de K se prouvent sur le desktop.

### P. Trois écrans qui mentent encore

Plan : [`2026-11-09-ecrans-qui-mentent.md`](2026-11-09-ecrans-qui-mentent.md). Ajouté le 09/11 ; ordre validé par CrOliX : L,
puis P, puis le cadrage d'un nouvel axe.

lun-docs (le kit et la spec), lun-anima, puis les copies du kit (entière dans lun-luxuria, les toasts seuls dans
lun-acedia et lun-avaritia, qui gardent leur kit jusqu'à #43) : une PR par dépôt. Niveau `standard`. *Show*. Les trois écarts vus pendant J et M :

- le bandeau de la mise en route qui dit « Rien ne tourne encore » pendant que les routines tournent (lun-anima#82) ;
- le rang des plafonds qui se replie mot par mot au téléphone (lun-anima#83) ;
- une erreur en attente derrière un toast annulable, écrasée par une information (lun-docs#119).

### L'ordre du 12/11

Tranché par CrOliX le 12/11 ([état cible](../specs/2026-11-10-etat-cible-cadrage.md), § 6) : la semaine de rodage est
la porte du MVP, et la révision de l'état cible vient après elle. D'abord trois chantiers en parallèle ; puis le banc et
les mots des gestes ; le premier contact sans terminal ; la session sur le desktop ; le rodage, puis la bascule.
Complété le 16/11 par [le tri du 16/11](#le-tri-du-1611) : l'IPC, « le tour » et le banc de présence, sur le laptop,
en attendant le desktop.

### Tenir en continu

Fait : lun-anima#109, lun-acedia#68, lun-avaritia#35 et le plan, lun-docs#164, fusionnés ; lun-docs#166 est fermée.
Le core, Acedia et Avaritia tiennent des jours sans s'arrêter. Les suites (lun-docs#171, lun-acedia#67,
lun-avaritia#34, lun-anima#108) sont rangées par [le tri du 16/11](#le-tri-du-1611).

### Écoute et parole

Plan : [`2026-11-12-ecoute-et-parole.md`](2026-11-12-ecoute-et-parole.md), validé le 12/11 ; issue lun-luxuria#77.
lun-luxuria seul. Fait : lun-luxuria#82 et le plan coché, lun-docs#172, fusionnés ; la preuve à la main (tâche 8) est
jouée avec CrOliX le 16/11. Les suites, lun-luxuria#81, sont rangées par [le tri du 16/11](#le-tri-du-1611).

### Remettre les textes d'accord

Plan : [`2026-11-12-textes-d-accord.md`](2026-11-12-textes-d-accord.md), validé le 12/11 ; issue lun-docs#167. Fait :
lun-docs#165 et les trois satellites (lun-luxuria#80, lun-acedia#70, lun-avaritia#37), fusionnés ; la doc, les règles et
la surface publique disent le code et les décisions du 12/11. Les suites (lun-docs#168, #169, #170, lun-luxuria#79,
lun-acedia#69, lun-avaritia#36) sont rangées par [le tri du 16/11](#le-tri-du-1611).

### L'IPC de Lun'Luxuria

Issue lun-luxuria#78, niveau `critique`, pas encore de plan. Ce que la page de la fenêtre peut encore faire faire à
Rust. Le prochain chantier, par l'ordre du 16/11 ([le tri du 16/11](#le-tri-du-1611)). Il récrit le `CLAUDE.md` de
Lun'Luxuria quand ses sorties se ferment.

### Le banc et les mots des gestes

Deux chantiers en parallèle depuis le 16/11 (tranché par CrOliX).

- **Les mots des gestes** : [plan](2026-11-16-mots-des-gestes.md), chapeau lun-luxuria#83. La confiance est réelle
  depuis lun-luxuria#10, mais à la barre de 0,7 le relevé du 10/11 perd « oui », « annule » et « envoie »
  (lun-luxuria#6). Le banc des gestes mesure ce que la page envoie, sur les prises de CrOliX, cinq voix et des
  non-paroles ; puis la règle se tranche (B1). Le verrou de l'ADR 0011 se lève ensuite, à trois conditions. Aucune
  vraie carte avant. Fait : le banc (lun-luxuria#84, et sa garde de 20 s, lun-luxuria#86) et le plan (lun-docs#175),
  fusionnés ; la mesure qui décide se joue sur le desktop (§ 4).
- **Le banc de présence** : `standard`, chapeau lun-luxuria#104. Son plan de treize tâches (lun-docs#183) est
  **réduit** par le recadrage du 19/11 : voir plus bas. Ses observations (lun-luxuria#60, #67 à #70, #73 à #75, #85,
  #101), l'outillage de lun-luxuria#81 et les scénarios de toux.

### Le premier contact sans terminal

Plan : [`2026-11-16-premier-contact.md`](2026-11-16-premier-contact.md), validé le 16/11 ; issue lun-docs#177. Fait :
lun-anima#113, lun-acedia#73, lun-avaritia#40, fusionnés : sur une installation neuve, la page de chaque app, ouverte
sur la machine qui l'héberge, montre le code de son premier appareil, déjà saisi ; la
[page de mise en service](../mise-en-service-desktop.md) le dit. Ce qui reste se vérifie sur le desktop (§ 4). Les
suites (lun-docs#178, lun-acedia#74, lun-avaritia#41, lun-anima#112) sont rangées par
[le tri du 16/11](#le-tri-du-1611). Le reste du point 6 de l'état cible (Google depuis l'interface, la liaison d'un
poste) vient après le MVP.

### Le tri du 16/11

L'ordre, tranché par CrOliX le 16/11 : le tri de l'inbox, puis l'IPC de Lun'Luxuria, puis « le tour », puis le banc de
présence. Le tri range les 53 issues de l'inbox ainsi.

- **L'IPC** (lun-luxuria#78) : de lun-luxuria#79, le chemin d'exemple de `voice.rs` et les deux retouches de
  `CLAUDE.md` (la sonde, la défense « aucune permission `dialog:` »).
- **Le tour**, fait et fusionné le 18/11 ([plan](2026-11-17-le-tour.md), lun-docs#182 ; code lun-luxuria#96 ; chapeau
  lun-luxuria#95) : ne pas reprendre par-dessus (lun-luxuria#63, I8) ; le fragment envoyé avant l'annonce du retour
  (lun-luxuria#53) ; les erreurs qui restent à l'écran ; le point `#letGo` de lun-luxuria#81. Reste ouvert : deux
  réponses qui se chevauchent (lun-luxuria#48, dont la latence se mesure au § 4) ; lun-anima#97 se réentend d'abord
  au § 4. Deux gestes dans la fenêtre sont au § 4 (décision de CrOliX du 18/11).
- **Le banc de présence** : ses observations, plus haut, et l'interface du serveur compatible de la chaîne, à écrire
  dans le `docs/README.md` de Lun'Luxuria (lun-luxuria#79).
- **Au desktop** (§ 4) : lun-luxuria#39 (avec N) ; lun-luxuria#50 (B5) ; le 403 Google et le démarrage rapide de
  lun-docs#171 (B12) ; l'application non validée de lun-acedia#55 (B10).
- **Après le MVP** (§ 2 D) : lun-acedia#33, #34, #38 et #55 ; lun-anima#90 ; le deuxième point de lun-avaritia#34 ;
  lun-docs#21, #25, #41, #43 et #144 ; lun-luxuria#43, la manette.
- **À la révision de l'ADR 0008** : la case de lun-docs#169 sur la ligne fausse de l'ADR 0007.
- **Jetés** : lun-luxuria#71, fermée comme doublon de #70 ; le troisième point de lun-avaritia#34 (la décision du
  13/11). lun-sandbox est archivé : ses issues restent, et le tri ne le lit plus.
- **À trancher par CrOliX** : les points 2 à 4 de lun-acedia#67, quand « les tests instables » passent par Acedia.

Le tri ouvre aussi des chantiers, dans le tableau ci-dessous. Les points 1 et 3 des filets du core et le jeton Google
illisible passent avant le rodage (B8) ; les erreurs qui restent à l'écran vont avec « le tour », qui touche la même
file ; l'adresse des commits (lun-docs#170) passe tôt. Les deux chantiers `critique` n'ont pas encore leur place dans
l'ordre : CrOliX la leur donne.

| Niveau | Chantier | Issues | Fini quand |
|---|---|---|---|
| `critique` | Le core relié par l'écran d'un satellite | lun-docs#178, point 1 | le core reçoit un jeton d'application, pas un jeton d'appareil, ou `standards/contrat-satellite.md` dit ce qui se fait |
| `critique` | Ses sens dans son contexte | lun-anima#114, point 1 | un cadrage écrit avant tout code, avec celui de « Natsume, être présent » |
| `standard` | Les erreurs qui restent à l'écran | lun-luxuria#81 : Q7, Q8 et R2, `attempt.dropped`, la phrase remplacée, le message de la garde de 60 s, les cinq cases du 16/11, la garde désarmée, le sondage tardif, `#micChanges` | une erreur ne bloque plus la file, ne donne qu'un message, et s'efface quand le service revient |
| `standard` | Une réponse coupée | lun-anima#101, et le point 2 de #114 | les cas des deux issues réglés |
| `standard` | Les filets du core, suites | lun-anima#108 | les six points faits ou écartés ; les points 1 et 3 avant B8 |
| `standard` | Un jeton Google illisible | lun-acedia#62 | il compte comme « Non connecté » et l'écran propose de connecter de nouveau ; avant la restauration essayée (§ 4) ; plan : [acedia-comptes-google](2026-11-24-acedia-comptes-google.md) |
| `standard` | L'appairage, suites | lun-acedia#74, lun-avaritia#41, lun-anima#112, lun-docs#178 point 2 | chaque point fait ; la route des satellites refuse un corps qui n'est pas du JSON ; leur module d'appairage se recopie comme le kit |
| `standard` | La carte du kit, ses gestes et son accessibilité | lun-docs#143 | une ancre `data-` stable, le focus gardé, la permission annoncée ; au branchement de la permission |
| `standard` | La CI épinglée | lun-docs#168 | les actions épinglées par SHA, Dependabot réglé par CrOliX |
| `trivial` | Les textes et les standards | lun-docs#130, #169 (l'ADR 0007 par une note de statut, l'ADR 0008 étant remplacée par 0014), #170, #171 (les textes) ; lun-acedia#69, lun-avaritia#36, lun-anima#79 | chaque case faite, lun-docs#170 d'abord ; `vision.md` dit la bibliothèque et le MVP (lun-docs#130) |
| `trivial` | Le kit, retouches | lun-docs#124, #134 (avec #207), #135, #181, #215 | une erreur garde ses 5 s, `box-sizing` commun, le format fixé ; `SettingsRow` : aide qui se coupe, aide gardée sous l'erreur, `aria-invalid` et `aria-describedby` ; les copies resynchronisées |
| `trivial` | Le libellé « Relier un appareil » | lun-acedia#71, lun-avaritia#38 | le libellé choisi par CrOliX, repris dans les deux apps et les pages de mise en service |
| `trivial` | Les tests instables | lun-acedia#67 et lun-avaritia#34, le premier point de chacune | stables sur 50 passages |

### Le recadrage du 19/11

Tranché par CrOliX le 19/11 ([recadrage](../specs/2026-11-19-recadrage-vip.md), § 7). Une promesse est tenue et
prouvée, ou retirée du texte et inscrite « après le VIP ». L'ordre, jusqu'à la porte :

1. **Les textes d'accord avec la borne**, faits le 20/11 : `vision.md` (avec le recadrage) ; la règle des modèles
   d'Acedia (lun-acedia#78, qui ferme lun-acedia#69 ; son commentaire de Dockerfile, passé à tort à « la machine
   dédiée », est à remettre au NAS, comme les pages du site) ; le README du core (lun-anima#115) ; les quatre pages
   du site, en brouillon dans son dépôt ; lun-luxuria#6 mise au point, ouverte jusqu'à la règle des gestes.
2. **Trois petites promesses**, faites le 20/11 ([plan](2026-11-19-trois-promesses.md), lun-docs#186) : Acedia
   repère les vrais conflits de l'agenda et propose d'en déplacer un, ou les signale ; « Pina » sort des textes
   visibles (lun-acedia#75, en PR) ; l'export de la bibliothèque se télécharge (lun-avaritia#42, fusionnée). Les
   suites : lun-acedia#77, lun-avaritia#43. **À placer par CrOliX avant le rodage** : lun-acedia#76 (trois onglets
   d'Acedia ouverts sur la même adresse, plus rien ne répond).
3. **Le banc réduit**, fait le 19/11 ([plan](2026-11-18-banc-de-presence.md), lun-docs#183 ; code lun-luxuria#105 ;
   chapeau lun-luxuria#104, qui reste ouvert pour ce qui est reporté) : le délai par étape lu à la chaîne et comparé au
   budget de la veille, les sons de toux posés, les résumés visibles, les tests du service de voix en CI. Le reste
   des treize tâches passe après le VIP, comme tout nouveau chantier sur les cas limites du tour de parole
   (lun-luxuria#97 à #100, #102, #48, #63). La course du 19/11 sur le laptop ne change aucun verdict des 14 scénarios
   du 18/11 ; seule la toux courte a une prise qui convient (lun-luxuria#101). Le délai par étape se lit désormais en
   fin de relevé : la fin de tour y pèse 700 ms, le silence fixe ; la mesure qui compte est celle du desktop.
4. **La session du desktop, resserrée** : remplacée par les points 1 et 2 du recadrage du 20/11, ci-dessous.
5. **La semaine de rodage** (B8) : sur le NAS, point 3 du recadrage du 20/11. Cible de délai du VIP : 2,5 s en
   médiane du dernier mot au premier son (ADR 0011) ; au-dessus, un seul chantier, sur l'étape la plus lente.
6. **En toute fin de VIP** : l'installation, ce qui peut encore quitter le terminal et à quel palier.

Après le VIP, dans cet ordre : la recherche par le sens d'Avaritia (hybride, sans carte graphique), puis ce que
`vision.md` range sous « Après le VIP ». Le kit reste tel quel d'ici là.

### Le recadrage du 20/11 : le MVP sur le NAS

Tranché par CrOliX le 20/11 ([ADR 0014](../../adr/0014-mvp-sur-le-nas.md)) : le core, Acedia et Avaritia tournent en
continu sur le NAS ; Lun'Luxuria est une application du desktop ; la semaine de rodage se joue sur le NAS,
directement ; il démarre sur des bases neuves, avec le vrai compte Google ; une machine dédiée est une évolution à
terme, sans date. L'ordre, jusqu'à la porte :

1. **La mise en service du NAS** : chantier `critique`, Lun-Ecosystem/lun-docs#190 ; son
   [plan](2026-11-22-mise-en-service-nas.md), rédigé le 22/11, est à contester puis à valider avant toute installation.
   Sa base est le
   [plan du 08/11](2026-11-08-bascule-nas.md) et ce qui existe dans le dépôt du core (un conteneur par app, un nom
   par app dans le réseau privé). S'y vérifie tout ce qui conditionne la semaine et que ce document rangeait au
   desktop : Google en production sur le vrai compte (B10), le téléphone et une notification de bout en bout (B11),
   le redémarrage et la nuit rattrapée (B12), une restauration (K), le premier appareil par les écrans, et les trois
   vérifications d'après les trois promesses (une carte de conflit validée sur le vrai compte, un agenda secondaire
   qui donne une carte qui signale, l'export téléchargé). **Avant elle, à placer par CrOliX** : lun-acedia#76 (trois
   onglets ouverts, plus rien ne répond). **En parallèle** : les deux fournisseurs de modèle pour le core
   ([plan](2026-11-20-core-deux-fournisseurs.md), Lun-Ecosystem/lun-anima#116), fusionné et livré avant la semaine de
   rodage. **Le 20/11** : codé et mesuré, la PR du core en brouillon ; modèle du rodage choisi par CrOliX, Claude
   Haiku 5.5, raisonnement coupé pour la voix. **Reste avant le rodage** : les consignes de la voix corrigées sur ses
   deux défauts mesurés puis remesurées (lun-anima#118), la PR fusionnée et livrée en image, la clé d'Anthropic rangée
   par l'écran du NAS.
   **Puis, avant le rodage** : l'historique rejoué au modèle garde les appels d'outil
   ([plan](2026-11-20-historique-outils.md), Lun-Ecosystem/lun-anima#118), à la place des consignes corrigées. **Le
   20/11** : codé et mesuré, la forme complète retenue (Haiku de 28 à 62 délégations sur 65 en fil long) ; la PR du
   core est en brouillon ; CrOliX a choisi Haiku 5.5, raisonnement coupé, pour le rodage, à régler par l'écran après
   la fusion.
2. **La session du desktop, pour la voix seule** (§ 4) : Luxuria reliée au core du NAS ; la mesure des gestes puis
   leur règle (B1) ; la langue (B2) ; le délai mesuré contre les 2,5 s ; l'exe, le corps, le service voix. Les gestes
   à réentendre se notent pendant la semaine.
3. **La semaine de rodage** (B8), sur le NAS, puis sa marge : la porte du MVP.
4. **En toute fin de VIP** : l'installation, ce qui peut encore quitter le terminal et à quel palier.

Le § 4 ci-dessous garde sa liste telle qu'elle a été écrite, au fil des chantiers, pour une session sur le desktop :
ce qui y touche l'hôte (B10, B11, B12, K, la mise en service sur des bases neuves) se lit maintenant pour le NAS.

### Le recadrage du 24/11 : après la première nuit

Tranché par CrOliX le 24/11 ([recadrage](../specs/2026-11-24-recadrage-premiere-nuit.md)), après la première nuit de
la prod sur le NAS et l'audit des trois apps. Les jours depuis le 23/11 sont une répétition ; la semaine de rodage
part d'un jour fixe, après ce panier :

1. **Trois chantiers en parallèle** : la nuit et la mémoire (le contexte chaud, Lun-Ecosystem/lun-anima#133 ; la
   bibliothèque nourrie par la conversation seule, Lun-Ecosystem/lun-avaritia#46) ; trancher sans risque (la fiche
   ouverte depuis sa carte dans le core, un refus qui s'annule dans Avaritia, la pause d'Acedia cohérente) ; les
   écrans qui gênent (Lun-Ecosystem/lun-docs#201, Lun-Ecosystem/lun-anima#134).
2. **À la main de CrOliX, en parallèle** : Acedia 0.2.1 publiée et déployée ; les tâches 10 à 12 de la mise en
   service.
3. **Puis** les versions publiées et déployées, la session du desktop pour la voix (point 2 de l'ordre du 20/11), et
   la semaine de rodage (B8), d'un jour fixe : elle juge les cinq promesses d'un coup.

Le reste de l'audit (design, finitions, vocabulaire, l'urgence et ce qui remonte d'Acedia, Lun-Ecosystem/lun-anima#135,
les mails dans la bibliothèque) passe après le VIP.

**L'ordre de déploiement de la porte d'attention** (CrOliX, le 25/11, [plan](2026-11-25-porte-d-attention.md)) : le
core d'abord (Lun-Ecosystem/lun-anima#152), Acedia 1.5 ensuite. Sinon, chaque proposition de tri notifierait. La
porte est livrée en brouillon le 26/11 (Lun-Ecosystem/lun-anima#157), son plan coché et le standard dans
Lun-Ecosystem/lun-docs#225.

### La replanification du 26/11 : le périmètre gelé

Validée par CrOliX le 26/11. Elle fait foi pour l'ordre jusqu'à la porte, et remplace sur ce point les recadrages du
24/11 et du 25/11.

**Le constat.** Il reste 35 jours avant le 31/12. La semaine de rodage et sa marge en prennent quatorze : elle part
le 08/12, le 15/12 au plus tard. Depuis le 24/11 le périmètre grossissait : la
[carte des flux](../specs/2026-11-25-carte-des-flux-design.md) a ajouté dix chantiers (§ 11), dont quatre sont faits
(les textes, les gestes de présence, Acedia au contrat 1.5, la porte d'attention), et rouvert deux points rangés
« après le VIP » le 24/11. Aucune des cinq promesses de [`vision.md`](../../vision.md) ne demande les six autres.

**Le gel.** Les six chantiers de flux restants passent après le VIP. Tout le reste se classe par une question : est-ce
que cela casse la semaine ?

**Rang 1, le chemin critique, quand CrOliX est chez lui.** Rien ne le remplace, et c'est lui qui fixe la date.

1. Publier et déployer le core avec la porte d'attention, puis Lun'Acedia depuis `main` (l'ordre du 25/11). Les
   propositions de tri arrivent alors au core en cartes d'importance basse, une par une ; la validation par lot reste
   dans l'écran d'Acedia. **Fait le 26/11** : le core 0.4.0 puis 0.4.1, Lun'Acedia 0.4.0, Lun'Avaritia 0.3.1 ; la
   lettre du 27/11 compte ces cartes sans urgence.
2. Finir la [mise en service du NAS](2026-11-22-mise-en-service-nas.md) : le fournisseur de modèle par l'écran, les
   copies hors du NAS et une restauration essayée, une mise à jour et un retour arrière, Google en production, le
   téléphone, un redémarrage et une nuit rattrapée, les trois vérifications de #185, l'accès refermé.
3. La session du desktop, pour la voix seule (§ 4, resserrée) : l'essai d'une synthèse française sur le processeur
   avec clonage de voix (Pocket TTS, relevé par la veille du 26/11), en premier, car il peut faire tomber l'étage RVC
   (B3) et peser sur la langue (B2) ; puis le délai mesuré contre les 2,5 s ; l'exe, le corps, le service voix.
4. La semaine de rodage (B8), d'un jour fixe.

**Rang 2, sur le laptop, avant la semaine.** Dans cet ordre :

1. **La garde** ([plan](2026-11-26-garde-avant-la-semaine.md), Lun-Ecosystem/lun-docs#226), avant que les images
   soient publiées : le texte d'un mail nettoyé avant le modèle, la quarantaine npm, les actions épinglées, Hono.
2. **La voix ne tranche aucune carte pendant le VIP.** Le verrou de l'ADR 0011 reste : les cartes se tranchent à
   l'écran et au téléphone. La règle des mots des gestes (B1, lun-luxuria#6) passe après le VIP, et la mesure des
   gestes sort de la session du desktop. La veille du 26/11 conteste d'ailleurs la voie prévue, une barre de
   confiance par brique : la confiance d'une transcription n'est pas calibrée sur les mots courts, et le relevé du
   10/11 perdait déjà « oui », « annule » et « envoie » à 0,7. La règle d'après partira d'une liste fermée de mots.
   Le garde-fou des cartes qui répondait en boucle (lun-anima#97, recette du 10/11) a été relu contre `main` le
   26/11 : l'heure est donnée et sa phrase a changé depuis ; ce qui reste se réentend sur le desktop, sans chantier
   avant. Ce point change le § 6.1 du [recadrage du 19/11](../specs/2026-11-19-recadrage-vip.md).
3. **Le tri des issues en `inbox`**, contre la seule question de la semaine : fait le 26/11, en lecture seule, sur
   les 50 issues étiquetées et trois autres. **Proposé, à trancher par CrOliX** :
   - à corriger avant la semaine : lun-acedia#112 (« Ranger dans », au survol d'un mail, ne répond pas et bloque le
     survol), un geste de chaque jour ;
   - à constater chez lui : lun-docs#199 (les points restants de la mise en service), lun-acedia#87 (les jetons
     Google au-delà de sept jours, à partir du 01/12), lun-luxuria#88 (le service voix passe par le proxy du système
     pour la boucle locale : une ligne à corriger sur le laptop, le risque à lire sur le desktop) ;
   - à observer pendant la semaine, sans corriger avant : lun-anima#101, #135 et #154, lun-acedia#104 et #113,
     lun-luxuria#97 à #100 ;
   - après le VIP : les 40 autres. Aucune n'est à fermer.
4. **Cette replanification**, écrite ici.
5. **Trancher depuis le core** ([plan](2026-11-26-trancher-depuis-le-core.md), Lun-Ecosystem/lun-docs#231), ajouté le
   26/11 au soir après l'essai sur le NAS : la carte du core montre ce qui est proposé et se corrige, le chat écrit
   tranche une carte nommée par son titre. La version 0.4.1 du core est en service depuis le 26/11 au soir. Le
   verrou de la voix (point 2) reste ; sa levée se décide à la session du desktop, sur les mesures des gestes, et
   non plus après le VIP d'office : la voix est le premier chemin sur le desktop.
6. **Les filtres et les compteurs de Lun'Acedia** ([plan](2026-11-27-acedia-filtres-compteurs.md),
   Lun-Ecosystem/lun-acedia#120), ajouté le 27/11 après ses constats en prod : une zone et un filtre « Tout / Non
   lus », les mêmes au bureau et au téléphone, filtrés par le serveur ; « Proposés » retiré ; le nombre de non lus sur
   chaque boîte. Une version 0.4.1 de Lun'Acedia à publier et déployer avant la semaine. Le reste du tour attend
   l'après-VIP (Lun-Ecosystem/lun-acedia#121).
7. **Le suivi d'une action** ([plan](2026-11-27-suivi-action.md), Lun-Ecosystem/lun-docs#238), ajouté le 27/11
   après la carte des flux : une seule entrée du Journal par action, de la demande au résultat, et une chaîne qui
   dit vrai sur qui a tranché et où. Le contrat passe en 1.6 ; le core, Lun'Acedia et Lun'Avaritia sont touchés. Au
   déploiement : le core d'abord, ou le même soir que Lun'Acedia.
8. **La nuit et la lettre du matin** (Lun-Ecosystem/lun-docs#239), à ouvrir après le point 7 : la lettre écrite par
   le modèle, le bilan du lot de la nuit lu chez Lun'Avaritia, l'urgent resté non lu. Il reprend, avant la semaine,
   deux points du rang 4 : la lettre écrite par le modèle et la nuit vers Lun'Avaritia.
9. **La nuit nourrit la bibliothèque depuis la journée complète** (Lun-Ecosystem/lun-docs#247), collé au point 8,
   avant la semaine (validé le 28/11) : les règles de forme d'abord (une fiche pour ce qui dure, un fait pour ce
   qui a eu lieu), puis la source rouverte aux mails des boîtes gardées, les rendez-vous qui ont eu lieu, un refus
   qui apprend. La règle du 24/11 (la conversation seule) valait pour le VIP ; elle bloque trop d'usage.

**En parallèle, sans code.** Le cadrage de « ce qu'il faut pour lancer une action » (Lun-Ecosystem/lun-docs#242) :
les prérequis, les droits, la table des ordres.

**Avec le desktop.** « L'attention sur plusieurs surfaces » (Lun-Ecosystem/lun-docs#240) et « la parole rend
compte » (Lun-Ecosystem/lun-docs#241) : la présence et la parole ne se prouvent que là.

**Rang 3, pendant la semaine.** Aucun code. Les tensions se notent, les questions restées sans fiche aussi ; la part
de propositions validées sans correction s'accumule par boîte.

**Rang 4, après le VIP.** Dans l'ordre :

1. les propositions au core : la validation par lot, corriger par le chat, et les piles (deux propositions de même
   sujet peuvent proposer deux boîtes, et « valider tout » les tranche sans les montrer). Voir et corriger sur la
   carte sont faits par le chantier du 26/11 au soir ;
2. l'écriture du core, puis la lettre du matin écrite par le modèle ;
3. la parole spontanée et son ouverture (P2), avec un garde-fou en code : se taire après deux relances sans
   réponse ;
4. la nuit vers Avaritia, puis le seuil par boîte ;
5. la recherche par le sens, que `vision.md` place en premier : l'ordre avec les flux reste à trancher ;
6. l'installation et la mise à jour de Lun'Luxuria.

**Sans date, hors chantier.** Écrire à Live2D sur la licence d'une application publique qui charge le modèle de
chacun (l'avatar vient après le VIP, la réponse peut être longue). Lire en janvier l'avenant de Google sur les agents,
qui s'applique le 01/02/2027. La RTX, quand elle viendra : les modèles de voix récents demandent 16 Go, ce qui écarte
une carte de 12 Go.

### La session sur le desktop, puis le rodage et la bascule

Remplacé par le recadrage du 20/11, ci-dessus. Ce paragraphe disait, du 12 au 20/11 : la session du § 4, puis la
semaine de rodage sur le desktop, puis la bascule vers la machine dédiée (ADR 0012).

## 4. La session sur le desktop

Quand CrOliX y est ; aucun relevé n'est demandé avant. Proposition d'ordre, en une ou plusieurs fois :

**D'abord, l'essai de Pocket TTS** ([replanification du 26/11](#la-replanification-du-2611--le-périmètre-gelé)). Un
essai à part, hors de Lun'Luxuria et sans code : il dit seulement si la piste vaut un chantier. La marche est lue
dans le README du dépôt `kyutai-labs/pocket-tts` le 26/11 (version 4.0.1 du 21/10/2026, code sous licence MIT) ; rien
n'a été lancé. C'est CrOliX qui télécharge et lance.

1. Depuis la page des versions du dépôt, prendre l'archive Windows (`…-x86_64-pc-windows-msvc.zip`) et le fichier
   `SHA256SUMS`, comparer l'empreinte (`Get-FileHash`), puis décompresser à côté des dépôts, comme Piper. Le binaire
   n'a besoin ni de Python ni de PyTorch ; il lui faut un processeur avec AVX2, sinon l'archive `-v2`.
2. Le français, avec la voix fournie : `pocket-tts generate --language french --voice estelle --text "…"`. La commande
   écrit `tts_output.wav` et affiche ses temps ; le premier lancement télécharge le modèle. Rejouer avec
   `--language french_24l`, la variante plus lente et de meilleure qualité.
3. Écouter contre la chaîne d'aujourd'hui (Piper puis RVC), sur les trois mêmes phrases : une courte, une longue,
   une avec un chiffre, une date et un mot anglais.
4. Le clonage : `--voice chemin\vers\voix.wav` ; `export-voice` en fait un fichier qui se charge vite. Le dépôt
   interdit de cloner une voix sans consentement explicite : l'essai se fait sur une voix dont CrOliX a le droit, et
   la voix du personnage d'aujourd'hui se tranche avant, pas après.
5. Noter le temps jusqu'au premier son et la vitesse affichés (le dépôt annonce environ 200 ms et six fois le temps
   réel, sur un autre processeur et deux cœurs), puis le français à l'oreille et la voix clonée contre celle de RVC.

Si le français et la voix clonée conviennent, l'étage RVC peut tomber (B3) et la question de la langue se repose
(B2) : le brancher dans le service voix serait un chantier à cadrer, mesuré contre les 2,5 s, et le périmètre est
gelé jusqu'à la porte. Sinon la chaîne d'aujourd'hui reste, et la session continue. Non vérifié : la licence des
poids et des voix (à lire sur leur fiche avant tout usage public), et le français, que personne n'a écouté.

1. Mettre le poste à jour depuis `origin` ; activer le plugin `lun` à la racine (Q10), et le mettre à jour (les
   agents de dev y sont depuis lun-docs#163 : un manager et dix agents par métier). Reprendre la mémoire de la session
   du laptop, déposée le 10/11 sur le Drive de CrOliX (`memoire-lun-2026-11-10.zip`), dans le dossier de mémoire du
   projet sur ce poste.
2. B1 : les relevés de confiance et de latence (faits le 10/11, comme les trois mesures ci-dessous), puis le verrou
   de l'ADR 0011. Depuis le 10/11, trois mesures de plus :
   - vingt tours avec le tour à l'essai coupé, puis vingt avec lui : il est en service par défaut, et n'a jamais été
     mesuré (l'essai du 07/11 l'avait coupé) ;
   - la mesure du premier mot, rejouée sur le desktop et comparée au laptop : là-bas, le premier mot attend environ
     1,1 s quel que soit le prompt, et le cache du fournisseur n'y change rien
     ([relevé](2026-11-10-premier-mot.md)) ;
   - le temps du premier mot, que le core garde pour chaque appel, à lire après les tours.
3. B4, B5, B9 : les touches globales, Discord, la sourdine.
4. L : la fenêtre qui entre seule, le micro, le son ; les trois préréglages mesurés. Avec elle, deux points de la
   [ligne d'arrivée](../specs/2026-11-10-etat-cible-cadrage.md) de Lun'Luxuria à éprouver, déjà codés : la couper en
   cours de phrase (tout de suite, puis en fin de phrase) et vérifier ce qu'elle dit avoir été entendue ; la file du
   core avec la carte du kit sur des cartes d'essai tant que le verrou de l'ADR 0011 tient (tranché le 16/11), et la
   bande restée au-dessus de la feuille (lun-docs#143).
   Après le chantier [« le tour de parole »](2026-11-10-tour-de-parole.md) (lun-luxuria#51, lun-anima#99), à
   réentendre :
   - deux phrases à trois secondes d'écart pendant qu'elle réfléchit : une seule réponse, qui a lu les deux ;
   - une toux, ou une phrase qui n'est pas pour elle, pendant qu'elle réfléchit : sa réponse sort quand même ;
   - la couper au milieu d'une réponse longue, entre deux phrases ;
   - une carte seule en attente, à la voix : une question sans rapport reçoit une vraie réponse ; « montre-moi la
     carte » puis « oui » la tranche ;
   - dire « oui » sur une carte, puis reparler avant d'entendre « tu as 5 secondes » : rien n'est tranché ;
   - l'heure : si elle répond encore « je n'ai pas retrouvé l'heure », compter les appels au modèle de cette
     réponse dans les coûts que garde le core (deux : elle a relu avant de répondre) et le noter dans lun-anima#97.
   Après [« le tour »](2026-11-17-le-tour.md) (lun-luxuria#96, lun-docs#182 ; preuve dans un onglet, la chaîne et la
   relecture faites sur le laptop le 18/11, ce qui demande la fenêtre ou un poste est ici), à voir. CrOliX a gardé ces
   gestes de côté le 18/11, pour ne pas bloquer la suite :
   - une toux, puis reparler : noter le blanc avant que sa voix reprenne, et dire si les 300 ms de
     `bargeIn.resumeMs` conviennent (pour noter, pas pour juger) ;
   - l'absence réglée à une minute, puis une phrase avec le nom : la réponse arrive, sans retard gênant (l'envoi
     attend l'annonce du retour, 3 s au plus) ;
   - des sons de toux à poser au banc (`bruit.wav`, `toux.wav`, `toux-courte.wav`) pour jouer à la chaîne les six
     scénarios de toux, dont `toux-verdict-tardif`, `toux-puis-parole-tard` et `reponse-vide-puis-toux` ;
   - la garde de 60 s sur une phrase parlée (non jouée dans l'onglet : pas de voix) ;
   - un service de voix suspendu (processus gelé) : « Le service voix ne répond plus. », effacé à la reprise.
   Après les chantiers de l'écoute (lun-luxuria#54, #56) et de
   [« la coupure qui se reprend »](2026-11-11-coupure-reprise.md) (lun-luxuria#58), à réentendre. D'abord choisir de
   nouveau la pièce « normale » dans les réglages : une installation déjà réglée garde 0,5 s de silence de fin.
   - le délai de réponse avec 0,7 s de silence de fin, sur vingt tours, comparé aux 3,4 s du 10/11 ;
   - une toux pendant qu'elle parle : elle se tait, puis redit sa phrase et continue ; compter le blanc ;
   - « arrête » ou « non » pendant une longue réponse : elle se tait pour de bon ;
   - son propre son repris par le micro : elle ne doit pas se suspendre en boucle ;
   - recommencer à parler juste après une toux : noter si elle reprend par-dessus.
   L'aparté pendant qu'elle parle est sorti de la liste : CrOliX a choisi le 11/11 qu'il la coupe (voie 2 du
   [plan des scénarios](2026-11-11-scenarios-presence.md)), et le scénario `aparte-parole-longue` le prouve.
   Après [« la phrase d'attente »](2026-11-11-phrase-attente.md) (lun-anima#102), à entendre :
   - « j'ai des mails ? » à la voix : elle dit d'abord ce qu'elle fait, puis le résultat, sans redire la phrase ;
   - le blanc entre la phrase et le résultat, sur cinq demandes ; le core garde la durée de chaque délégation ;
   - la couper pendant ce blanc, sur une demande qui prépare une carte : la carte reste et elle ne la redemande pas.
   Après [« l'IPC de la fenêtre »](2026-11-16-ipc-de-la-fenetre.md) (lun-luxuria#87, preuve faite sur le laptop le
   17/11, ce qui demande le desktop est ici), à voir :
   - un vrai lancement de whisper-server et de RVC, avec leurs arguments confirmés ;
   - le corps avec ses images, et « Oublier » qui rend le souffle ;
   - le service voix lancé avec une voix Piper : `--origin` refusé, une adresse hors de la boucle locale refusée ;
   - une adresse https hors du poste, confirmée puis oubliée.
   Après [« les trois promesses »](2026-11-19-trois-promesses.md) (lun-acedia#75, lun-avaritia#42), à voir :
   - valider une carte de conflit sur le vrai compte, et voir l'événement déplacé chez Google ;
   - un événement d'un agenda secondaire ou partagé donne bien une carte qui signale ;
   - l'export d'Avaritia téléchargé depuis le desktop.
5. K : la liste « rien ne force le terminal » parcourue, une restauration essayée.
6. B10 : Google en Production, consentement refait sur le vrai compte ; l'avertissement « application non validée »
   à la connexion d'Acedia (lun-acedia#55).
7. B11 : le téléphone Android, une notification reçue.
8. N : les scènes jouées et notées ; elles servent aussi l'écoute de B2. La personnalité « limitée » de la recette du
   08/11 s'y réentend (lun-luxuria#39).
9. B2 : la langue, à l'oreille ; puis l'ADR qui remplace 0011.
10. B3 : le flux RVC, décidé après B1.
11. B12 : redémarrer ; les services repartent, la nuit manquée est rattrapée ; le 403 Google et le démarrage rapide de
    Windows (lun-docs#171).
12. B6 : une soirée réelle.

La mise en service elle-même, sur des bases neuves, est la recette du
[premier contact](2026-11-16-premier-contact.md) (« Ce que le desktop vérifiera ») :

- l'installation et les écrans seuls, sans terminal, jusqu'aux deux postes reliés ;
- avant le premier appareil, une requête forgée par le tailnet vers l'app du core puis vers Acedia, `Host` et `Origin`
  réglés sur l'adresse locale de l'app : on attend le 404 ; un 200 se tranche avant le rodage ;
- le téléphone, dans un onglet privé, par le tailnet, avant le premier appareil : aucune page n'y montre de code.

B7 reste à CrOliX (réglages de Windows et du pare-feu), avant la soirée. Puis B8, la semaine de rodage.

## 5. Calendrier

Pas de dates : l'ordre du recadrage du 20/11 (§ 3) fait foi. Restent deux repères.

| Quand | Quoi |
|---|---|
| quand les prix le permettent | la RTX (5070 ou 5070 Ti, visée pour début 2027, selon les prix) : la latence se remesure, sans rien bloquer ; le VIP ne l'attend pas |
| avant le 31/12 | une marge pour rejouer la semaine de rodage (B8) si un point de tension la casse |
