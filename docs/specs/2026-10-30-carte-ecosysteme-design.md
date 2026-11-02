# La carte de l'écosystème : révision du front du core (chantier 6, palier 2 bis)

Date : 30 octobre 2026. Révise le bureau défini par `2026-10-30-apps-core-design.md` (planches 05 et
06). Maquette de référence : planche 07, `docs/maquettes/2026-10-30-apps-core/07-carte.html`.

## Pourquoi

En recette, CrOliX rejette le front du core livré au palier 2 : les informations s'empilent en
listes, avec de grands vides à droite ; la colonne de conversation à gauche n'est pas fluide ; le
menu d'Écosystème affiche la même chose quel que soit le thème ; la phrase du jour, affichée en
permanence, gêne la lecture rapide. Ce qu'il veut voir au bureau, dans ses mots : « la relation agent
manager et sous-agents, un peu comme une cartographie interactive de l'écosystème, et pas un simple
dashboard avec colonne 1 et 2 KPIs ».

Le core fait encore peu (Natsume, deux postes reliés, deux routines) : la carte doit être riche avec
ce peu-là, et tenir quand l'écosystème grandira.

## Objectifs

- Au bureau, une seule vue principale, la **Carte** : Natsume au centre, manager ; les postes autour,
  chacun son agent ; ce qui circule entre eux ; ce qui attend un geste de CrOliX.
- Tout geste du palier 2 reste possible depuis la carte (Valider, Refuser, Vu, C'est fait, Plus tard,
  Ouvrir le mail, Voir la fiche, Ouvrir le poste).
- Écosystème montre un thème à la fois.
- Le téléphone garde son format, avec un seul ajout.

## Non-objectifs

- Pas de nouvelle fonction du core (ni module bureau, ni nouveau poste).
- Pas de zoom animé sur le cadran (évolution notée, voir « Plus tard »).
- Pas de refonte du Journal : il reste tel quel, onglet à part.
- Pas d'écran d'un poste intégré au core : « Ouvrir » mène toujours au front du poste.

## Anti-objectifs (échec même si « ça marche »)

- Un tableau de bord : tuiles de KPI, colonnes de cartes identiques.
- Une colonne de conversation permanente, à gauche ou à droite.
- Une carte surchargée : marques qui se superposent, étiquettes qui se chevauchent, mouvement
  continu qui distrait.

## Ce qui est décidé

### Navigation (bureau)

Trois onglets : **Carte**, **Journal**, **Écosystème**. Accueil et À valider disparaissent au bureau :
leur contenu vit dans la carte. La recherche et la palette de commandes (Ctrl K) restent dans la
tétière. Le téléphone garde sa navigation du bas actuelle.

### La carte

- **Natsume** au centre, plus grande que les autres nœuds, avec son état (à l'écoute, mode) et une
  pastille du nombre de choses qu'elle te demande.
- **Le cadran** : un anneau de 24 h autour de Natsume, avec l'heure courante.
  - Ses **routines** (veille de la nuit, point du matin) y sont des losanges à leur heure ; leur état
    (faite, échouée, à venir) se lit sur le losange.
  - Les **événements du jour** d'une même heure se regroupent en **une seule marque** avec leur
    nombre ; jamais deux marques superposées. Un clic sur la marque ouvre une fiche ancrée qui les
    liste (quoi, de quel poste, à quelle heure, avec leur geste s'il en ont un).
- **Les postes** en orbite : un disque à la couleur de leur monde, leur nom, leur rôle en quelques
  mots, et **un nombre** sur le disque pour ce qui attend chez eux (cartes en attente, urgences non
  vues, échéances). Pas de trait par carte sur l'anneau.
  - La forme dit la nature, la couleur du monde dit à qui c'est, le contour dit l'état : plein
    (relié), tirets (ne répond pas), pointillé barré (injoignable), pointillé clair (à relier).
  - Un poste à relier (Lun'Ira aujourd'hui) est **neutre** : pointillé, sans couleur d'accent. Sa
    couleur se décidera par décision de DA quand il sera relié.
  - L'orbite **répartit automatiquement** n'importe quel nombre de postes (prévoir jusqu'à 7 sans
    surcharge) ; aucune position fixée à la main.
- **Les liens** entre Natsume et chaque poste ont deux voies : l'aller (ce que Natsume lui a confié
  aujourd'hui) et le retour (cartes et urgences remontées, épaisseur selon le volume, couleur du
  monde ; une urgence se distingue). Un libellé court dit le métier et ce qui revient (« 11 cartes en
  retour »). Au survol d'un lien, le détail de l'aller et du retour ; les autres liens s'estompent.
  Mouvement léger sur un lien actif seulement, coupé sous « réduire les animations ».
- **Les appareils** ne sont pas sur la carte (ils restent dans Écosystème).
- Les flèches de date permettent de revoir hier (le cadran et les liens se recalculent pour ce
  jour).

### Le détail : une fiche ancrée

Un clic sur un nœud (ou une marque du cadran) ouvre une fiche **ancrée contre lui**, sans colonne
permanente. Elle se ferme par Échap, la croix ou un clic sur la carte ; le focus y entre et revient
au nœud.
- **Fiche de Natsume** : ce qu'elle te demande (urgences, échéances, cartes à traiter, la plus
  pressante d'abord, comme l'ancien « À traiter »), son mode, **la phrase du jour** (elle ne vit plus
  qu'ici), les dépenses du jour face aux plafonds, ses routines avec « Lancer ».
- **Fiche d'un poste** : ce qui attend ton geste chez lui, avec les gestes du palier 2 (V et R en
  série comme l'ancien « À valider »), ce qu'il fait (dernier contact, rôle), « Ouvrir Lun'Xxx » dans
  un nouvel onglet, « Régler ce poste » (mène au thème Postes d'Écosystème).
- **Fiche d'une marque du cadran** : les événements de l'heure ; **fiche d'une routine** : dernier
  passage, coût, « Lancer ».

### La conversation : une barre en bas

« Écrire à Natsume » est une barre en bas de la carte (raccourci /), la même idée qu'au téléphone.
Elle se déplie vers le haut le temps d'un échange (fil, sujets, envoi) et se replie sans perdre le
fil. Quand Natsume confie quelque chose à un poste, une pastille à la couleur du poste le dit
(« Confié à Lun'Acedia ») et l'aller du lien s'en trouve compté. La colonne de gauche disparaît.

### Écosystème : un thème à la fois

Au bureau, le menu de gauche (Postes, Dépenses et plafonds, Modèle et clé, Routines, Appareils,
Notifications) **sélectionne** un thème ; la zone de droite ne montre que ce thème, à pleine
largeur utile. Le thème ouvert vit dans l'adresse (`?theme=`), comme au téléphone. Le contenu de
chaque thème est celui du palier 2.

### Téléphone

Le format actuel reste (accueil en liste, À valider, Journal, Écosystème, barre de Natsume au-dessus
de la navigation du bas, feuilles). Un ajout : sur Écosystème, la ligne « Postes » devient une
**rangée de présences** (Natsume et chaque poste, avec ce qui attend et qui ne répond pas) ; toucher
une présence ouvre la feuille du poste.

### Côté core

- Les délégations ne sont aujourd'hui lisibles que dans le texte des messages. Le core les
  **enregistre** (poste, demande résumée, heure, issue) au moment où Natsume délègue, et la carte
  peut les compter par poste et par jour. Choix de Claude : c'est le minimum pour que la voie
  « aller » dise vrai.
- La carte se compose des lectures existantes (`/home`, `/dues`, `/cards`, `/satellites`,
  `/journal`) et de cette lecture des délégations ; le découpage en routes (une route agrégée ou
  plusieurs) est laissé au plan.

### Précisions (choix de Claude, après relecture)

- **Un jour passé** (flèches de date) montre l'histoire de ce jour : routines passées, marques des
  événements, aller et retour comptés sur ce qui a été enregistré ce jour-là. Les nombres sur les
  disques et la pastille de Natsume disent ce qui attend **maintenant** : ils sont masqués sur un jour
  passé, comme les gestes.
- **Événements du cadran** : ceux que montre le Journal (P0 à P3, jamais les `log`), seulement ce
  qui a eu lieu ; pas de rappel futur placé en avance. **Retour** d'un lien : les événements que le
  poste a remontés ce jour-là (urgences distinguées) et les cartes qu'il a proposées ce jour-là.
- **Aller** : toute délégation, d'où qu'elle parte (outil `deleguer` dans la conversation, « C'est
  fait » confié à Lun'Avaritia, appels des routines aux postes). Issue : faite, échouée, sans
  réponse. Pas de reprise de l'historique : avant l'enregistrement, l'aller vaut zéro. La pastille
  « Confié à » lit le même enregistrement.
- **Routines** : leur heure prévue vient de la configuration du moteur de routines (exposée en
  lecture si elle ne l'est pas) ; un passage se place à son heure réelle, l'heure prévue marque ce
  qui est « à venir ».
- **États d'un poste** : relié et sain (plein) ; ne répond pas, quand sa dernière lecture a dépassé
  le délai de 8 s du palier 2 (tirets) ; injoignable, quand l'appel échoue (pointillé barré) ; à
  relier, un poste que `/satellites` donne non appairé (pointillé clair). Pas de catalogue nouveau.
- **Réemploi** : le téléphone garde Accueil et À valider ; les fiches du bureau réemploient les
  composants existants (cartes, échéances, gestes en série). Le bouton « Postes » de la tétière
  disparaît au bureau (les nœuds le remplacent) et reste au téléphone.
- **Pastille de Natsume** : le total, sans doublon, de ce que liste sa fiche ; une demande qui ne
  vient d'aucun poste n'apparaît que chez elle.
- **Liens et clavier** : les liens ne sont pas des éléments interactifs ; la fiche d'un poste donne
  le même détail (aller, retour, dernier échange). Sans survol (écran tactile), c'est la fiche qui
  le donne.

## Contraintes

- DA Lun' stricte : jetons de `design/tokens.css`, socle commun et couleur du monde en accent
  seulement, Cormorant Garamond et Inter, composants du kit, Bits UI et `@lucide/svelte`, pas de
  Tailwind ; pas de libellés en capitales, pas de « · », pas de « → » dans les boutons, pas de tiret
  cadratin. Point de rupture 767,98 px.
- Accessibilité : chaque nœud et chaque marque atteignable au clavier, avec un nom accessible qui
  dit ce qu'il porte (« Lun'Avaritia, 11 en attente ») ; la carte a une alternative lisible par un
  lecteur d'écran (la liste de ce qui attend).
- Vérification dans le navigateur à 1440 px et 390 px avant la PR, et à l'usage (gestes réels sur la
  recette), pas seulement des captures.
- La carte doit rester lisible de 1280 px à 1920 px de large.

## Laissé au constructeur

Le rendu (SVG ou HTML positionné), le calcul de l'orbite, la forme exacte des routes de lecture, les
animations dans la limite ci-dessus, le placement fin des fiches ancrées (elles ne sortent jamais
de l'écran).

## Plus tard

- Le zoom animé sur une heure du cadran (l'arc s'agrandit, les événements s'y déploient).
- Un trait par carte sur l'anneau d'un poste, si le nombre ne suffit pas à l'usage du MVP.
- La couleur de Lun'Ira, à son appairage.
