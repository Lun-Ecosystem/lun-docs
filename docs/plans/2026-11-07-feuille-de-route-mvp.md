# La route jusqu'au MVP : l'état et les chantiers

> Demande de CrOliX, le 07/11 : « reprendre l'état global actuel de l'écosystème, identifier les points à traiter au vu
> du MVP, les classer et préparer les prochains chantiers complets en autonomie ». Depuis le 08/11, ce document fait foi
> pour l'avancement (décision de CrOliX après l'[audit](2026-11-08-audit-ecosysteme.md), Q8) : le Project GitHub est
> fermé depuis le 09/11 (chantier I), les issues gardent leurs étiquettes et leurs niveaux.

## 1. Où on en est

**Au 09/11.** I et J sont faits : lun-docs#108 et Lun-Ecosystem/.github#3, lun-anima#81, lun-acedia#59,
lun-avaritia#24 ; le Project est fermé. K : la procédure (lun-docs#111, reprise par lun-docs#112) et les copies
d'Acedia et d'Avaritia (lun-acedia#61, lun-avaritia#29) ; reste la restauration, à essayer au § 4. N : le
brouillon de la barre est sur `main` (lun-anima#88), ses scènes se jouent au § 4. O : lun-anima#91, lun-acedia#63,
lun-avaritia#30. M : lun-luxuria#41, lun-avaritia#31, lun-acedia#64 et la règle de `design.md` ; pas de PR pour le
core, les recouvrements de l'audit ne se voyant qu'en cours de défilement. Tout le reste est sur `main`.

Le même jour : la session sur le desktop (§ 4) est décalée, CrOliX n'étant pas chez lui. Les plans de L et M sont
écrits, et un chantier O s'ajoute, validé par CrOliX : les écarts vus en route que la semaine de rodage peut
rencontrer. Les autres restent en `inbox`.

**Au 10/11.** P livré, en brouillon jusqu'à la fusion de lun-docs#123 (le kit et la spec) : lun-anima#92, puis les copies
lun-luxuria#45, lun-acedia#65 et lun-avaritia#32. L (lun-luxuria#44) attend la recette du desktop.

**Au 08/11 au soir, après l'audit.** L'[audit](2026-11-08-audit-ecosysteme.md) a posé douze questions ; CrOliX les a
tranchées (audit, § 7), sauf la langue parlée (B2, à l'oreille) et lun-acedia#30 (après le MVP). Appliqué le jour
même, hors dépôt : squash seul sur les cinq dépôts, plugin `lun` à la racine du laptop. Confronté aux sources (audit,
§ 8), le premier contact au terminal sort du MVP : l'installation passe par le terminal une fois, avant la semaine, et
rien ne doit l'exiger pendant. Reste avant le MVP : les chantiers I à N (§ 3), la session sur le desktop (§ 4), puis
la semaine de rodage (B8).

**Au 08/11.** La liste A est faite côté laptop : F (lun-anima, lun-luxuria#22), G (lun-anima#69 et #71,
lun-luxuria#24, la page [`mise-en-service-desktop.md`](../mise-en-service-desktop.md)), H sans ses relevés
(lun-luxuria#10), A4. La première mise en service du desktop a fait remonter huit écarts de Luxuria (lun-luxuria#25 à
#32), corrigés en un chantier : lun-luxuria#33 et lun-docs#98 (voix réglée par l'écran, réglages par thèmes, quitter,
icône lisible). Décision de CrOliX le 08/11 : **le rodage se fait sur le desktop**, le NAS passe après (§ D) ; son
chantier peut se préparer en parallèle.

Le tableau ci-dessous garde l'état du 07/11.

| Jalon (spec écosystème §10.3) | État au 07/11 |
|---|---|
| J0, J1, J2 | faits |
| J3 Apps v1 | mobile fait ; Lun'Luxuria remplace l'app desktop, dans sa fenêtre Tauri (lun-luxuria#20) |
| J4 Nuit, voix, contrôle | nuit, matin, notifications, voix et corps en images faits ; relevés du desktop en attente ; avatar animé après le MVP (lun-docs#62) ; **modes remplacés par le mute du bureau** (décision du 07/11) |
| J5 Rodage | pas commencé : rien ne permet encore une semaine sans intervention (§2, A2) |

Dépôts : aucune PR ouverte, tout est sur `main` ; lun-anima était resté sur une branche déjà fusionnée (#65), remis sur
`main`. Plans du 07/11 : tous cochés sauf `voix-confiance-blocs` (pas commencé) ; `luxuria-essai-chronometre` reste en
partie vide, son relevé est fait (lun-luxuria#9).

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
| B1 | Relevés de confiance et de latence (critère 4 du plan `voix-confiance-blocs`), puis levée du verrou de l'ADR 0011. **Relevés faits le 10/11** (`lun-luxuria/docs/essai-2026-11-07.md`, et le [premier mot](2026-11-10-premier-mot.md) rejoué) ; le verrou reste à CrOliX | CrOliX |
| B2 | La langue parlée : français direct contre réponse en anglais sous-titrée ; puis un ADR qui remplace 0011 (la langue, la mesure de la latence, une cible d'après le MVP) | CrOliX, à l'oreille |
| B3 | Le flux RVC dès le premier bloc (reste de lun-luxuria#7), décidé après B1 | desktop |
| B4 | Preuve manuelle des touches globales de l'exe (critère 4 du plan Tauri) : `Ctrl+Maj+L` depuis une autre fenêtre, F9 tenue puis lâchée | CrOliX |
| B5 | Rejoindre un salon Discord passe en `occupée` (écart 2 de la recette, corrigé sur le laptop, à constater) | desktop |
| B6 | Une soirée réelle : latence par tour et coût, puis décision sur le plafond de 1 $ par jour (spec Luxuria §6.7) ; noter le silence pendant une délégation à un poste (veille C2) | desktop |
| B7 | Notifications Windows coupées (`ToastEnabled = 0`) ; vcclient sur `0.0.0.0:18000` et règles du pare-feu | CrOliX : réglages système |
| B8 | La semaine de rodage elle-même (J5), sur le poste mis en service par G ; noter la lassitude des cartes du matin (veille C9). Proposition : juger l'assistante et le contrôle sur la semaine, la présence à part, par la barre de N | CrOliX |
| B9 | Recette du mute, points 1, 3 et 5 : aucune capture en sourdine, la parole spontanée repart à son heure, en appel un P0 n'est pas dit | desktop |
| B10 | Google en Production sur le vrai compte, consentement refait : en Test, le jeton tombe au bout de 7 jours (audit, Q1 et § 8.2) | CrOliX, sur le desktop |
| B11 | Le téléphone Android : la PWA du core par le HTTPS du tailnet, une notification reçue de bout en bout (reportée à la recette du 07/11) | CrOliX, desktop |
| B12 | Redémarrer le desktop : les services repartent seuls, la veille de 5 h manquée est rattrapée (rattrapage par défaut, veille C5) | desktop |

### C. Petit, à glisser dans un chantier qui passe par le dépôt

| # | Point | Dépôt | Rangé dans |
|---|---|---|---|
| C1 | Test instable « Logged once, not at each retry » (lun-anima#7, trivial) | lun-anima | F ; fermé |
| C2 | Une nouvelle liaison du core remplace l'ancienne au lieu d'en ajouter une (lun-acedia#30) | lun-acedia | après le MVP (audit, Q3), avec l'appairage par code affiché (§ D) |
| C3 | Le lien du site rend une 404 dans les README et le profil de l'organisation (veille C14) : le retirer tant que l'hébergement du site n'est pas tranché (lun-docs#21) ; là où `structure-projet.md` exige le badge « écosystème » (README d'un dépôt public), le pointer vers l'organisation **[choix Claude]** | lun-docs, `.github`, lun-acedia, lun-avaritia, lun-luxuria | I pour lun-docs et `.github` ; J, K ou M pour les autres |

### D. Après le MVP

Les rôles de Natsume façon assistants de Mia (spec du mute, §2) ; l'avatar animé (lun-docs#62) ; le NAS et l'accès sans
client (ADR 0008, [bascule](2026-11-08-bascule-nas.md)) ; les mises à jour automatiques de Luxuria ; la trajectoire de
Luxuria (§11) ; le confort d'Acedia (#33, #34, #38) ; la forme des dépôts (lun-docs#41) et la migration complète vers
le kit commun (lun-docs#43) ; le site (#21, #25) ; la sandbox. La sauvegarde d'Avaritia passe au MVP (K).

Ajouts du 08/11, après l'audit :

- l'appairage par code affiché, façon Quick Connect, à la place de `pair-code` et de `connect` (lun-anima#72) ; Google
  branché depuis l'interface (lun-acedia#55) ; la liaison qui remplace l'ancienne (lun-acedia#30, C2) ;
- « Pina », le nom de l'agent, écrit en dur dans le code d'Acedia, son README et `.env.example` ;
- les propositions P7 à P14 de la veille : budget de parole, porte « Inner Thoughts », brouillons et validation par lot
  au point du matin, point du soir, humeur calculée, Gmail en push, veille de nuit en Batch API ;
- exposer les satellites en serveurs MCP, et étudier Rowboat (audit, § 8.9).

## 3. Les chantiers, dans l'ordre

Une PR par dépôt et par chantier, brouillon dès le premier push. Autonomie donnée par CrOliX le 07/11 : chaque plan
s'exécute après la relecture du plan-challenger. Les specs F et G sont **à relire par CrOliX** ; leurs choix marqués
**[choix Claude]** se changent avant le merge.

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
  (`backupDatabase`, `VACUUM INTO`). **[choix Claude]** Chaque satellite copie sa propre base : le core ne lit pas les
  fichiers d'un satellite, et sur le NAS chacun aura son volume.
- La restauration, écrite dans [`mise-en-service-desktop.md`](../mise-en-service-desktop.md) : une copie garde les
  secrets chiffrés, elle ne se restaure qu'avec la même clé.
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

- La vérification des jetons dans la CI de Luxuria et d'Avaritia, comme dans celles du core et d'Acedia ; celle du kit
  dans la CI de Luxuria, dont la copie est générée. Acedia et Avaritia gardent leur copie à part jusqu'à lun-docs#43.
- Les recouvrements sous un élément flottant (audit, § 4.2, point 4) : la place existe déjà dans les trois apps, la
  cause se cherche d'abord ; la règle s'écrit dans `design.md`, sans jeton nouveau.
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
- la copie du core détachée de la veille, sous la forme de celles des satellites (lun-anima#86, #87) ;
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

## 4. La session sur le desktop

Quand CrOliX y est ; aucun relevé n'est demandé avant. Proposition d'ordre, en une ou plusieurs fois :

1. Mettre le poste à jour depuis `origin` ; activer le plugin `lun` à la racine (Q10), et le mettre à jour (les
   agents de dev en sont retirés depuis lun-docs#108). Reprendre la mémoire de la session du laptop, déposée le 10/11
   sur le Drive de CrOliX (`memoire-lun-2026-11-10.zip`), dans le dossier de mémoire du projet sur ce poste.
2. B1 : les relevés de confiance et de latence, puis le verrou de l'ADR 0011. Depuis le 10/11, trois mesures de plus :
   - vingt tours avec le tour à l'essai coupé, puis vingt avec lui : il est en service par défaut, et n'a jamais été
     mesuré (l'essai du 07/11 l'avait coupé) ;
   - `npm run first-word` dans le core, à comparer au laptop : là-bas, le premier mot attend environ 1,1 s quel que
     soit le prompt, et le cache du fournisseur n'y change rien
     ([relevé](2026-11-10-premier-mot.md)) ;
   - le temps du premier mot gardé par appel (`costs.first_text_ms`), à lire après les tours.
3. B4, B5, B9 : les touches globales, Discord, le mute.
4. L : la fenêtre qui entre seule, le micro, le son ; les trois préréglages mesurés. Avec elle, deux points de la
   [ligne d'arrivée](../specs/2026-11-10-etat-cible-cadrage.md) de Lun'Luxuria à éprouver, déjà codés : la couper en
   cours de phrase (tout de suite, puis en fin de phrase) et vérifier ce qu'elle dit avoir été entendue ; la file du
   core avec la carte du kit sur de vraies cartes, et la bande restée au-dessus de la feuille (lun-docs#143).
5. K : la liste « rien ne force le terminal » parcourue, une restauration essayée.
6. B10 : Google en Production, consentement refait sur le vrai compte.
7. B11 : le téléphone Android, une notification reçue.
8. N : les scènes jouées et notées ; elles servent aussi l'écoute de B2.
9. B2 : la langue, à l'oreille ; puis l'ADR qui remplace 0011.
10. B3 : le flux RVC, décidé après B1.
11. B12 : redémarrer ; les services repartent, la veille manquée est rattrapée.
12. B6 : une soirée réelle.

B7 reste à CrOliX (réglages de Windows et du pare-feu), avant la soirée. Puis B8, la semaine de rodage.

## 5. Calendrier

Proposition de Claude, à corriger par CrOliX.

| Quand | Quoi |
|---|---|
| semaine du 09/11 | I et J en parallèle ; le code de K ; le brouillon des scènes de N |
| semaine du 16/11 | L, M et O |
| dès que CrOliX est sur le desktop | la session du § 4 |
| Black Week, fin novembre | la RTX si une carte passe à 750 au plus (ADR 0011) : la latence se remesure, sans rien bloquer |
| semaine du 30/11 ou du 07/12 | B8, la semaine de rodage (J5) |
| avant le 31/12 | une marge pour la rejouer si un point de tension la casse |
