# Audit de l'écosystème avant le MVP, au 08/11

> Demande de CrOliX, le 08/11 : une rétrospective complète (le projet, les méthodes de travail, les erreurs, les
> questions en suspens), un inventaire face au MVP décrit, ce qui n'est pas normalisé, ce qui fait brouillon dans la
> forme, le comportement et la navigation, avec challenge et remise en question. Ce document propose ; il n'ouvre aucune
> issue et ne change aucun réglage. Chaque chantier proposé attend la validation de CrOliX.

**Sources.** lun-docs (vision, standards, ADR 0001 à 0011, 19 specs, 43 plans, registre) et les cinq dépôts à
`origin/main` le 08/11 au soir ; GitHub (184 PR, 22 issues ouvertes, le Project « Lun'Ecosystem ») ; la mémoire de
l'agent (décisions et erreurs depuis le 19/10) ; les démos sur données inventées d'Acedia, d'Avaritia, du core (base de
recette jetable) et de la page de Luxuria, rendues dans un Chrome sans interface à 1440 et 390 px.

**Lu, mesuré, jugé.** Les chiffres sont mesurés (commandes `git`, `gh`, sondes sur 27 écrans). Les écarts entre
textes sont lus. Les gravités et les recommandations sont jugées. Rien n'a été vu sur le desktop ni sur de vraies
données (§ 9).

## 1. Verdict

- **Le fond est presque là.** Le code couvre le périmètre du MVP (§ 10.1 de la
  [spec écosystème](../specs/2026-10-19-ecosysteme-design.md)), sauf l'avatar, sorti du MVP. Le MVP n'est pas atteint
  pour autant : son critère est une semaine sans point de tension, et le rodage n'a pas commencé.
- **La forme est inégale.** Acedia et Avaritia ont un rendu de produit. Le core tient au bureau, mais sa mise en route
  et sa largeur téléphone montrent des défauts. Luxuria est la surface la plus brouillon : une porte à chaque
  lancement, une scène vide, des réglages de banc.
- **Les normes se contredisent.** lun-docs se contredit lui-même sur sept points ; le kit commun n'est vérifié que dans
  un front sur quatre ; l'avancement vit dans un fichier que les standards interdisent, pendant que le Project qu'ils
  imposent n'est plus tenu.
- **La méthode va plus vite que la preuve.** 162 PR fusionnées en 21 jours, en 6 à 24 minutes après leur ouverture ;
  la recette sur le desktop arrive après le merge. Les erreurs de méthode se répètent alors que les règles sont
  écrites, parce que les garde-fous ne sont pas chargés là où la session travaille.
- **Ce qui retient la semaine** n'est pas une fonction de plus : le compte Google du rodage, un premier contact sans
  terminal, une Luxuria qui démarre seule, des états qui disent vrai, et trois questions de voix à trancher à l'oreille.

## 2. Le MVP, élément par élément

### 2.1 Le périmètre (spec écosystème, § 10.1)

| Élément | État | Ce qui manque pour la semaine |
|---|---|---|
| Tri de nuit, briefing du matin | fait (routines du core, lettre et point du matin) | jamais vécu sur le vrai compte ; sur une base sans clé, l'écran dit « Fait » (lun-anima#74) |
| Rappels par urgence | fait (paliers P0 à P4, Web Push) | push sur le téléphone jamais constaté de bout en bout (recette du 07/11 : reporté) |
| Cerveau (nuit, questions, dépôts) | fait (Avaritia v1) | aucune copie de sa base (seule `anima.db` est copiée la nuit) |
| Boîte et gestes à la source | fait (Acedia) | Google se branche par le `.env` (lun-acedia#55) |
| Fil sur mobile | fait (PWA du core) | rien |
| Pause, interrupteur, coûts | fait (contrat v1.4, plafonds) | plafond de 1 $ par jour à décider après une soirée réelle (B6) |
| Autorisations Google | dans Acedia (« Compte Google : Connecté ») | rien, si l'on accepte qu'elles se règlent au poste et non au panel |
| Mute du bureau | fait (lun-luxuria#22) | recette B9 sur le desktop |
| App desktop propre | Luxuria remplace l'app du core ; services en tâches planifiées (G), programmes de voix lancés par l'app (lun-luxuria#40) | un clic « Entrer » à chaque lancement (§ 4.2, point 2) |
| Personnalité | graine de tempérament provisoire | aucune barre de réussite écrite ; voix jugée neutre le 05/11, lun-luxuria#39 |
| Voix (parler, entendre, RVC) | chaîne complète, 2,78 s en médiane contre 2,5 s visés (ADR 0011) | langue parlée (B2), confiance réelle (B1, lun-luxuria#6), RVC en flux (B3) |
| Avatar | sorti du MVP (lun-docs#62) ; corps en images dans Luxuria | rien au MVP |

### 2.2 Le critère de la semaine (§ 10.2), phrase par phrase

| La phrase | Où on en est |
|---|---|
| « chaque matin le briefing est là » | le code y est ; aucun matin vécu sur de vraies données, et le compte Google du rodage n'est écrit nulle part (Q1) |
| « la journée se suit depuis le mobile » | PWA faite, accès HTTPS par le tailnet décrit dans la [mise en service](../mise-en-service-desktop.md) ; notification du téléphone non constatée |
| « le soir le panel démarre sans fenêtre cmd et répond à la voix » | services sans console (G) ; Luxuria attend un clic, puis répond en 2,8 s, dans une langue encore ouverte |
| « rien n'a demandé d'intervention technique » | faux aujourd'hui : appairages et liaisons au terminal (`pair-code`, `connect`), Google par `.env`, pare-feu et notifications de Windows à la main (B7) |

## 3. Ce qui n'est pas normalisé

### 3.1 lun-docs contre lun-docs

| Sujet | Ce que dit le texte | Ce qui se fait | Proposition |
|---|---|---|---|
| Plan d'un chantier | `essentiel.md` § 2 : « dans l'issue ou la PR du chantier » ; `structure-projet.md` : « il vit dans `lun-docs/docs/plans/` » | 43 plans dans lun-docs | garder `docs/plans/`, corriger `essentiel.md` |
| Avancement | `essentiel.md` § 2 et `structure-projet.md` : le Project, « jamais recopié dans une doc » ; pas de roadmap en Markdown | la [feuille de route](2026-11-07-feuille-de-route-mvp.md) et le tableau de recalage de la spec § 10.3 ; 16 des 22 issues ouvertes absentes du Project, lun-docs#61 encore « In Progress » | un seul lieu (Q8) |
| Agents par niveau | `workflow.md` : `dev-haiku` à `dev-fable`, `reviewer` sur Sonnet, `plan-challenger`, mesure de consommation | la session principale code, la relecture tourne sur Opus ; la mesure a été fermée sans décision le 07/11 (lun-docs#8), le texte la décrit encore | réécrire à la pratique (Q9) |
| Environnements | prod = NAS ; le vrai compte Google seulement en prod ; toute la pile démarre en une commande | rodage sur le desktop (décision du 08/11) ; compte du rodage non écrit ; trois serveurs et trois appairages | le desktop, prod du rodage ; trancher Q1 |
| Fusion | `git.md` : squash | lun-anima fusionne par commit de fusion (46) ; quatre dépôts sur cinq acceptent encore fusion et rebase | squash seul dans les réglages (Q12) |
| Composants | `design.md` liste menus, onglets, bouton flottant, carte de proposition, groupe par jour | le kit n'en a aucun : ils n'existent que dans la copie d'Acedia | les verser au kit, ou les retirer de la liste |
| Spec de référence | la spec écosystème fait foi pour le MVP | son corps décrit `desktop/` et `mobile/` dans lun-anima, Capacitor, le paquet de vues aux J1 et J3, Avaritia en réserve, les modes, VTube Studio et le NAS en prod ; seules des notes de recalage la corrigent | une page courte « Architecture actuelle » qui fait foi, la spec y renvoie |
| ADR 0011 | « synthèse Piper en français » | l'écoute du 07/11 a écarté le français sur le modèle de voix retenu ; la langue reste ouverte (B2) | un ADR qui remplace 0011 quand B2 est tranchée |

Plus petits : les README demandent deux terminaux (`dev` puis `pair-code`) là où `structure-projet.md` promet une
commande ; `docs/` doit dire ce qui est, mais garde des rapports datés (`lun-luxuria/docs/essai-2026-11-07.md`, cité par
l'ADR 0011, ce qui se défend) ; lun-docs n'applique pas son propre gabarit (ni `CLAUDE.md`, ni hooks) ; le registre
ignore `lun-sandbox` (archivé) et mêle deux formes d'identifiant (`lun-docs`, `lunanima`).

### 3.2 D'un dépôt à l'autre

| Point | lun-anima | lun-luxuria | lun-acedia | lun-avaritia |
|---|---|---|---|---|
| Kit commun | copie générée, vérifiée en CI | copie générée, non vérifiée | copie à part : 20 fichiers diffèrent, 3 manquent, 8 en plus | copie à part : 12 fichiers diffèrent |
| Jetons vérifiés en CI | oui | non | oui | non |
| Adresse locale | `127.0.0.1:8788` | `127.0.0.1:5180` (page) | `localhost:8787` | `127.0.0.1:8789` |
| Routage | chemins `/app/…` | une page | ancres `#/…` | chemins |
| Marque | « Lun'*Anima* » | aucune | « Lun'Acedia », droit | « Lun'*Avaritia* » dans le rail, droit au catalogue |
| Fusion des PR | commit de fusion | squash | squash | squash |
| Release | v0.1.0 | aucune | v0.1.0 | v0.1.0 |
| Paquet JS principal | 395 kB | | 570 kB, seuil de 500 dépassé (lun-acedia#38) | 74 kB |
| Nom de l'agent | neutre | neutre | neutre à l'écran, mais « Pina » 445 fois dans le code, le README et `.env.example` (lun-docs#42 fermée) | neutre |
| Reste d'architecture | | | paquet de vues publié par un workflow, alors que l'ADR 0004 a mis fin au paquet | |
| Fichiers attendus | `LICENSE` absente (privé, normal) | complets | `.graphifyignore` absent | `docs/decisions/` et `.graphifyignore` absents |

Ce qui pèse vraiment :

- **Les toasts divergent.** Dans Acedia comme dans Avaritia, `toasts.svelte.ts` diffère du kit d'une centaine de lignes
  et `Toaster.svelte` d'une quarantaine : l'annulation (« toast avec annulation », `design.md`) n'est pas le même code
  d'une app à l'autre.
- **`localhost` contre `127.0.0.1`.** Le jeton d'appareil est rangé par origine : Acedia ouverte sur `127.0.0.1:8787`
  redemande un code. C'est déjà arrivé pendant une inspection.
- **Deux formes d'adresse profonde** (`/…` et `#/…`) : le contrat les accepte toutes deux dans `link`, ce qui entérine
  l'écart au lieu de le fermer.

### 3.3 Le suivi

- 22 issues ouvertes, dont 16 hors du Project.
- Deux conventions de titre : « [inbox] » dans le titre en plus de l'étiquette, parfois avec une étiquette `niveau:*`
  (lun-luxuria#6, #7) ; « [chantier] » sur lun-anima#72 et #73.
- Le tri hebdomadaire de l'inbox (`workflow.md`) n'a eu lieu qu'une fois, le 07/11 (lun-docs#73), et son résultat est
  dans un fichier Markdown. Des issues `inbox` du 19 au 29/10 restent ouvertes sans jalon (lun-docs#21, #25, #41, #43 ;
  lun-acedia#33, #34, #38).
- Sur le laptop, les copies principales restent sur des branches fusionnées (lun-docs sur `docs/modes-apres-mvp`,
  lun-anima sur `fix/luxuria-device-post`), lun-luxuria a quatre commits de retard, et quatre anciens worktrees
  fusionnés traînent. Sans effet sur le desktop, qui clone depuis `origin` ; mais une session qui lit ces copies lit du
  code périmé.

## 4. Forme, comportement, navigation

### 4.1 Ce qui tient

- **Acedia et Avaritia partagent une coquille de produit** : rail avec compteurs, barre de commande (`Ctrl K`), agent
  ancré en bas à droite (`Ctrl J`), carte d'état du service, barre du bas et pastilles au téléphone. Les écrans denses
  (À valider, Agenda, Tâches) restent lisibles.
- **Le core a une identité forte** au bureau : le carnet, la colonne de Natsume, un Journal filtrable, l'Atelier.
- **Sondes sur 27 écrans** : aucun débordement horizontal à 390 px, aucun tiret cadratin, aucun « core », « Anima » ou
  « Natsume » sur un écran de satellite. Aucune alerte native ; la confirmation est réservée aux gestes destructeurs ;
  les toasts portent l'annulation (`Ctrl Z`) ; chaque écran a son adresse, et le retour arrière ferme les feuilles du
  téléphone.

### 4.2 Ce qui fait brouillon, du plus grave au moins grave

1. **Le premier contact passe par un terminal.** Le code du premier appareil du core se lit dans la console du serveur ;
   chaque satellite demande `npm run pair-code` dans un autre terminal ; la liaison passe par `npm run connect` ; Google
   par le `.env`. Tolérable une fois, contraire au critère « rien n'a demandé d'intervention technique », et à refaire à
   chaque téléphone ou réinstallation (lun-anima#72, #73 ; lun-acedia#55 ; lun-luxuria#36).
2. **Luxuria démarre derrière une porte.** `entered` part à faux à chaque lancement, dans la fenêtre comme au démarrage
   de Windows : tant que personne n'a cliqué « Entrer », elle n'écoute pas et ne dit rien, P0 et parole spontanée
   compris. La raison écrite (un navigateur ne joue aucun son sans clic) vaut pour un onglet ; la fenêtre peut autoriser
   la lecture automatique (WebView2), à vérifier sur le desktop. Changer « Seul / Relié » ou le serveur recharge la
   page.
   La scène vide ne dit pas comment lui parler (lun-luxuria#37) ; les réglages sont ceux du banc (lun-luxuria#38),
   « Ton et contexte » tient dans une petite zone à droite d'une ligne.
3. **Des états qui ne disent pas vrai** (`design.md`, « Honnêteté ») : « Lettre du matin · Fait » et « Le point du
   matin est posté » sur une base sans clé, vus dans la démo (lun-anima#74) ; « Tri par l'IA actif » et « Traitement
   actif » sans fournisseur (lun-acedia#56, lun-avaritia#21) ; « 3 réglages avant de commencer » au-dessus de « Mise en
   route 1 sur 6 » ; un même échec dit deux fois dans le Journal (« Veille de la nuit : en échec », puis « Veille de la
   nuit · Échoué »).
4. **Des éléments flottants qui couvrent le contenu.** Le bouton « Agent » d'Acedia couvre le « Valider » du dernier
   groupe (1440 × 900) ; « + Nouveau » couvre l'heure du dernier mail (390) ; la barre de saisie de Natsume recouvre la
   dernière ligne de la mise en route (390). Le kit tient compte de la zone sûre du téléphone pour la barre du bas et
   les toasts, mais rien ne réserve de place, au bas d'une liste, sous un élément flottant.
5. **Une mise en page serrée au téléphone.** Dans la mise en route du core, deux boutons écrasent « Les plafonds du jour
   et du mois », un mot par ligne ; les lignes du Journal ont des hauteurs inégales.
6. **Une aide sans mots.** La bande d'aide du bureau montre des touches (« Ctrl K », « E ») sans leur action, alors que
   la palette les nomme.
7. **Une recherche en double.** La Mémoire d'Avaritia empile la barre de commande et une recherche locale.
8. **Une marque et un poids qui dérivent.** La marque est en italique ici, droite là ; le paquet principal d'Acedia
   pèse 570 kB (508 le 26/10, lun-acedia#38) : il grossit.

### 4.3 Une navigation qui ne bloque pas ?

Oui pour l'essentiel : pas de fenêtre native, des confirmations seulement pour supprimer, l'annulation plutôt que la
question, une file unique « À trancher ». Restent trois portes :

- le seuil de Luxuria (§ 4.2, point 2) ;
- la mise en route du core, qui détourne le Bureau et « À trancher » vers `/app/mise-en-route` tant qu'elle n'est pas
  finie (vu). À vérifier : que montre le Bureau si plus aucun poste n'est relié en cours de vie ?
- le rechargement de page de Luxuria quand on change de fonctionnement ou de serveur.

## 5. La méthode

### 5.1 Les chiffres (au 08/11, mesurés)

| Mesure | Valeur |
|---|---|
| PR ouvertes en 21 jours | 184 : 162 fusionnées, 22 fermées sans fusion (12 %) |
| PR fermées sans fusion | 11 d'Acedia le 19/10 (une par tâche), 8 de la pile de lun-anima le 06/11, 3 refusées le 07/11 (une PR par issue) |
| Délai médian entre ouverture et fusion | 6 à 24 minutes selon le dépôt |
| PR de plus de 3 000 lignes | 16 (maquettes et verrous compris), jusqu'à 25 000 |
| Pic | 37 PR fusionnées le 07/11 |
| lun-anima | 166 commits `fix` pour 150 `feat` |
| Écrit | 43 plans et 19 specs, environ 22 000 lignes de Markdown dans lun-docs |
| Code | environ 148 000 lignes (TypeScript, Svelte, Rust, Python), tests compris ; 323 fichiers de test |

### 5.2 Ce qui a marché

- Le contrat satellite tient (v1.4, versionné sans rupture) : les satellites marchent seuls, le core ne refait pas leur
  métier, deux satellites ne se parlent jamais.
- Les tests d'abord sur le code qui compte, jusqu'au contrôle par mutation (programmes lancés, job Windows), et
  plusieurs passes de relecture sur les chantiers critiques.
- Les barrières sans IA (format, lint, typage, adresses internes) et les rulesets des dépôts publics.
- Les décisions structurantes sont écrites : ADR courts, recalage du 07/11, rodage sur le desktop.
- graphify depuis le 07/11.

### 5.3 Ce qui coûte

1. **La preuve arrive après le merge.** `workflow.md` veut la preuve de CrOliX en local avant « prête ». En pratique, la
   PR se fusionne en minutes et la recette se joue ensuite sur le desktop (lun-luxuria#40 l'écrit). D'où les chaînes de
   correctifs : sur le core, plus de `fix` que de `feat`.
2. **Les règles écrites ne sont pas chargées là où l'agent travaille.** Le plugin `lun` (la garde, `lun-chantier`,
   `lun-livrer`) n'est activé que dans le `.claude/settings.json` de chaque dépôt. Les sessions partent de la racine
   `LunEcosystem`, pour le graphe global : la garde n'y bloque rien et les skills n'y sont pas proposés. Les erreurs qui
   se répètent (§ 5.4) sont précisément celles que la garde et `lun-livrer` couvrent.
3. **Trop d'écrit pour être lu.** 43 plans cochés à 100 %, une spec de référence périmée, un état réparti entre la
   feuille de route, le Project, les issues et la mémoire de l'agent. Aucun lieu ne répond à « quelle est l'architecture
   aujourd'hui ? ».
4. **Des décisions d'abord dans la mémoire de l'agent.** Le 07/11, la langue, la RTX et le SOCLE n'étaient écrits nulle
   part ; l'ADR 0011 en a repris une partie. Ce qui ne peut pas être public (réglages de voix) a sa place dans
   `lun-anima/docs/decisions/`, qui est privé.
5. **Le rythme dépasse la recette.** 7,7 PR fusionnées par jour en moyenne. Acedia et Avaritia n'ont rien reçu depuis le
   06/11 pendant que leurs issues s'accumulent : se concentrer sur le core et Luxuria se défend pour le MVP, mais
   « avancer par paliers sur tous les dépôts » n'est plus la règle depuis le 06/11, et rien ne le dit.
6. **Le tri de l'inbox** n'a eu lieu qu'une fois (§ 3.3).

### 5.4 Les erreurs déjà vécues

| Date | Ce qui s'est passé | La règle existait ? | Suite |
|---|---|---|---|
| 19/10 | 11 PR d'Acedia, une par tâche | oui, `git.md` | fermées, refaites |
| 21/10 | fronts livrés comme des squelettes sans le dire | en partie, `design.md` | recadrage du design |
| 26/10 | titres et corps de PR hors norme | oui, `lun-livrer` et la CI | CI rouge, rappel |
| 29/10 | réponses en anglais après une reprise | oui | rappel |
| 30/10 | front du core rejeté après le palier 2 | en partie, maquettes avant le code | révision |
| 06/11 | 9 PR sur lun-anima, dont une pile en conflit | oui, `git.md` | regroupées dans lun-anima#46 |
| 06/11 | verdict biaisé sur un projet tiers | non | règle « confronter sans biais » |
| 07/11 | une PR par issue, plus une PR de plan et une de coche | oui, `git.md` | 3 PR refusées |
| 07/11 | push sur une PR déjà fusionnée | non | rattrapé par lun-docs#75 |
| 07/11 | chantiers sans issue, écarts de recette hors dépôt | oui, `lun-chantier` | cadrage du 07/11 |

Six erreurs sur dix enfreignent une règle déjà écrite, deux autres en partie : le problème n'est pas l'absence de
règle, c'est qu'elle n'est pas devant l'agent au bon moment (§ 5.3, point 2).

## 6. Remises en question

1. **Le MVP mêle deux paris de nature différente.** L'assistante et le contrôle sont prêts à vivre une semaine ; la
   présence dépend de jugements à l'oreille encore ouverts (langue, voix, personnalité). La ligne de coupe de la spec
   dit déjà que l'assistante et le contrôle ne sont jamais coupés. Proposition : commencer leur rodage sur le desktop dès
   que Q1 est tranchée, et juger la présence à part, avec sa propre barre. Sinon une voix non tranchée retient tout le
   reste.
2. **La personnalité n'a pas de barre de réussite.** Elle est dans le périmètre, mais rien ne dit quand elle est assez
   bonne. Sans critère jugeable (par exemple une série de scènes réelles notées par CrOliX), ce point ne se ferme pas.
3. **Plans et specs : utiles pour cadrer, chers à tenir.** Un plan de 160 cases coché à 100 % n'en dit pas plus qu'une
   PR bien décrite. Proposition à discuter : un plan dans lun-docs pour un chantier `critique` ou à plusieurs dépôts,
   le plan dans la PR pour les autres.
4. **Le kit copié ne tient que là où la CI le vérifie.** Deux copies ont dérivé. Avant tout paquet partagé, brancher la
   vérification partout : c'est le plus petit pas.
5. **Quatre fenêtres le soir.** Luxuria, l'app du core, et les fronts d'Acedia et d'Avaritia pour agir à la source. La
   vision parle d'« un panel desktop complet ». À écrire : quelle fenêtre est l'entrée, lesquelles ne servent qu'en
   secours.
6. **Fusionner en minutes est un choix.** À cette vitesse, la relecture humaine porte sur le titre et la CI ; les tests
   et la relecture par IA portent la qualité. Soit on l'écrit et on l'assume, soit, pour ce qui touche le desktop, la PR
   ne passe « prête » qu'après la recette (Q7).

## 7. À trancher par CrOliX

| # | Question | Recommandation |
|---|---|---|
| Q1 | Le compte Google du rodage : le vrai, ou celui de test ? | le vrai, sur le desktop, qui devient la prod du rodage dans `environnements.md` ; le laptop reste le local, avec le compte de test |
| Q2 | La langue parlée (B2) | à l'oreille sur le desktop avant la semaine, puis un ADR qui remplace 0011 |
| Q3 | lun-acedia#30 (C2) : révocation douce ou doublons affichés ? | révocation douce |
| Q4 | La barre de la personnalité au MVP | un critère jugeable écrit, ou sa sortie explicite du MVP |
| Q5 | Les cinq questions de la [spec Luxuria au quotidien](../specs/2026-11-08-luxuria-usage-courant-design.md) (§ 6) | à trancher avant de coder lun-luxuria#36 à #38 |
| Q6 | Copier les bases d'Acedia et d'Avaritia pendant le rodage ? | oui : étendre la copie de nuit aux trois bases ; le wiki d'Avaritia est le second cerveau |
| Q7 | La preuve de CrOliX : avant ou après le merge ? | avant, pour tout ce qui touche le desktop |
| Q8 | Un seul lieu pour l'avancement | la feuille de route dans lun-docs, écrite dans les standards ; le Project archivé |
| Q9 | `workflow.md` : appliquer la grille d'agents, ou la réécrire ? | la réécrire à la pratique |
| Q10 | Le plugin `lun` à la racine `LunEcosystem` (et sur le desktop) | oui, réglage local de CrOliX |
| Q11 | Le paquet de vues d'Acedia et son workflow de publication | retirer la publication ; garder le dossier tant que l'app l'importe |
| Q12 | Squash seul sur les cinq dépôts (réglage GitHub) | oui |

## 8. Proposition de suite, dans l'ordre

1. **Sans code** : Q1, Q7, Q8, Q10, Q12.
2. **N1, les normes à jour** (lun-docs) : `essentiel.md`, `structure-projet.md`, `workflow.md`, `environnements.md`,
   `git.md`, la liste de `design.md` ; une page « Architecture actuelle » vers laquelle renvoie la spec écosystème ;
   l'ADR qui remplace 0011 dès que Q2 est tranchée.
3. **N2, des états vrais** (lun-anima#74, lun-acedia#56, lun-avaritia#21, compteurs de la mise en route, échec dit deux
   fois) : petit, trois dépôts.
4. **N3, le premier contact sans terminal** (lun-anima#72 et #73, lun-acedia#55, lun-luxuria#36) : c'est lui qui rend
   vraie la phrase « rien n'a demandé d'intervention technique ».
5. **N4, Luxuria au quotidien**, après les réponses à Q5 : entrer seule dans la fenêtre une fois réglée, une scène qui
   dit comment lui parler, des réglages d'usage (lun-luxuria#36 à #38).
6. **N5, le kit vérifié partout**, pour sa petite part : vérification des jetons et du kit dans la CI de Luxuria et
   d'Avaritia, espace réservé aux éléments flottants. La migration d'Acedia et d'Avaritia vers le kit (lun-docs#43)
   reste après le MVP.
7. **Une session sur le desktop** : B1, B4, B5, B9, puis B6, une soirée réelle.
8. **J5, la semaine de rodage** : l'assistante et le contrôle d'abord, la présence jugée à part.

Après le MVP, inchangé : la liste D de la feuille de route, la migration complète du kit, une marque en composant.

## 9. Ce que cet audit n'a pas vu

- **Pas vu** : la fenêtre Tauri, le desktop, de vraies données, le téléphone par le tailnet, le dépôt du site (privé),
  plusieurs jours de routines, les coûts en usage réel.
- **Pas fait** : une revue de sécurité du code, des mesures de performance, un audit d'accessibilité au-delà des tests
  du kit.
- **À confirmer avant d'agir** : la lecture automatique dans WebView2 (§ 4.2, point 2) ; l'effet visible des toasts
  divergents (§ 3.2) ; l'écran du Bureau quand plus aucun poste n'est relié (§ 4.3).
