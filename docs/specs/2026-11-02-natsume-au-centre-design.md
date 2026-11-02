# Natsume au centre : le front du core en lieux (chantier 6, palier 3)

Date : 2 novembre 2026. Remplace, pour le bureau et le téléphone, la carte du palier 2 bis
(`2026-10-30-carte-ecosysteme-design.md`) et la navigation de `2026-10-30-apps-core-design.md`
(§3.2 à §3.7). Référence qui fait foi : le prototype cliquable validé,
`.superpowers/brainstorm/natsume-centre-2026-11-02/maquettes/` (entrée `bureau.html`, notes et
inventaire des 110 points dans `notes.html`). Sources de travail dans le même dossier :
`inventaire-tensions.md`, `critique-fonctionnelle.md`, `rapport-recherche.md`, `direction-jeu.md`,
`references-jeux.md`.

Tout ce qui n'est pas marqué est décidé par CrOliX ou montré par le prototype. Ce qui est marqué
**[choix de rédaction]** a été tranché en écrivant cette spec, à contester librement. Là où le
prototype et cette spec diffèrent, la spec l'emporte seulement sur les points listés au §2 (décisions
prises après le prototype) et sur les choix de rédaction ; partout ailleurs, le prototype fait foi.

## 1. Pourquoi

Le front du palier 2 a été rejeté en recette (30 octobre) ; la carte du palier 2 bis a corrigé
l'empilement, mais elle mélange trois rôles dans un seul écran : agir (trancher), comprendre (l'état
des postes) et se souvenir (revoir un jour passé). Elle tranche la même carte à plusieurs endroits,
ses compteurs n'ont pas une source unique, la pause n'existe pas, et la conversation reste une barre
posée sur le contenu.

CrOliX veut l'inverse d'un tableau de bord : **Natsume au centre du pilotage**. Le core, c'est
Natsume ; l'accueil est ce qu'elle a à te dire et ce qui attend ton geste ; la carte devient un
panneau de contrôle pour comprendre ; le Journal garde l'histoire. Le monde habille l'outil sans le
ralentir : des lieux nommés comme dans un jeu, des gestes sobres et littéraux.

## 2. Ce qui est décidé

- **Cinq lieux.** **Bureau** (le hub ; son centre est la seule file **À trancher**),
  **Constellation** (l'heptagramme à places fixes, panneau de contrôle ; on y comprend, on n'y
  tranche pas : elle renvoie à la file du Bureau), **Journal** (absorbe l'historique ; la carte d'un
  jour passé disparaît), **Atelier** (les réglages, remplace Écosystème), **Natsume** (fiche de
  personnage, hors du menu tant qu'elle est « bientôt »).
- **Marques en ivoire.** L'or reste à Lun'Avaritia. Nouveau jeton `--anima` `#6B2D4F` (grenat
  prune), distinct de `--danger-plein` `#7A1818`. Compteurs en neutre.
- **La colonne de Natsume**, à droite de chaque lieu au bureau, se comporte comme le panneau du
  terminal de VS Code (§4.4). Au téléphone : une barre au-dessus de la navigation du bas, qui ouvre
  une feuille de conversation.
- **Les détails** (un poste de la Constellation, une entrée du Journal) recouvrent la page avec une
  ombre, par-dessus la colonne de Natsume ; la carte du ciel se recentre à gauche ; Échap ou la croix
  ferme et rend le focus. Au Bureau, la carte choisie se déplie sur place, dans la file.
- **Gestes à l'unité et en lot**, avec des exceptions dans le lot (une fiche décochée reste à
  trancher). La file est groupée par poste, puis par heure. **Annuler pendant 5 s, tenu par le
  core** : toast d'une ligne, bouton Annuler, Ctrl Z. Touches sûres en AZERTY, idéalement
  configurables.
- **La lettre du matin** : un seul traitement par jour, jamais réécrite, seulement corrigée par les
  traitements suivants ; datée.
- **La pause** est globale : elle arrête tout l'automatique de l'écosystème et la remontée des
  erreurs ; les urgences remontent toujours ; les demandes spontanées restent possibles. Contrat
  satellite **v1.4** : le core tient l'état de pause et le relaie, chaque poste l'applique. Sous une
  pause du core, un poste garde son tri par règles seules (sans modèle, gratuit), donc les urgences
  issues de règles remontent ; il continue de répondre à `/agent` pour les demandes de CrOliX et pour
  les gestes, « C'est fait » compris ; tout ce qui est automatique et passe par le modèle s'arrête.
  Une pause posée dans le front d'un poste reste un arrêt local complet de ce poste. La portée pourra
  devenir réglable plus tard.
- **Chiffres** : une seule source pour les compteurs ; dollars ; formats fixes ; une bande d'état.
- **Noms** : le poste signe (« Lun'Acedia propose ») ; un nom d'agent seulement si le poste en
  déclare un ; « Natsume » pour ce que fait le core ; jamais « core » ni vocabulaire de projet à
  l'écran ; jamais « Pina ».
- **Ton** : textes fixes simples, concis, directs ; lexique de jeu léger réservé aux noms de lieux,
  aux mots de menu et aux mots d'état, jamais dans un geste ni une carte de sécurité. La voix
  dynamique de Natsume reste neutre et factuelle (sa personnalité est un chantier à part). Les 10
  règles d'écriture s'appliquent (§3).
- **Journal au palier 3** : périodes Aujourd'hui, 7 jours, Tout (à la place de « Depuis le 12
  octobre ») ; calendrier, travail de volume sur la pagination et affinage de la recherche au
  palier 4.
- **Sécurité = cartes** Valider ou Refuser, jamais de confirmation dans la conversation.
- **Paliers** : 3 Natsume au centre (cette spec), 4 Journal, 5 rodage (MVP), 6 voix, 7 scène et
  relais, 8 régie de live. OBS, RVC et le PC qui streame sont hors de cette spec (§13).
- **Les trois points partiels de l'inventaire** : n° 64, n° 68 et n° 84, tranchés au §11.

## 3. Règles d'écriture

Elles s'appliquent à tout texte fixe et à tout texte calculé par le core.

1. **Un fait, une fois.** Une information figure à un seul endroit de l'écran.
2. **Le fait d'abord, sans narration.** « Lun'Avaritia propose 10 cartes. »
3. **Pas d'explication de l'interface dans l'interface** : ni tri décrit, ni place d'un bouton, ni
   mécanique interne (« le core garde ce geste »).
4. **Un mot par chose** : À trancher, Confié, Relier, Reconnaître, Mettre en pause, Reprendre. Le
   même verbe sur le bouton et dans le toast qui suit.
5. **L'acteur est le poste.** Jamais de pronom genré pour un agent.
6. **Le lore reste dans les noms** de lieux et de menus, jamais dans un geste, une carte de
   sécurité, une erreur ni un réglage.
7. **Pas de vocabulaire de projet** : ni core, chantier, entité, front, persona, RVC, heptagramme,
   Desktop Agent.
8. **Chiffres vrais, formats fixes.** Heures « 14:20 » ; dates « lundi 2 novembre », « hier,
   14:10 », jour en minuscule dans une phrase, « 1er » pour le premier du mois ; montants « 0,42 $ »,
   deux décimales, « moins de 0,01 $ » sous un cent ; jamais un nombre écrit en lettres dans un texte
   figé.
9. **Un état dit ce qui ne marche pas et quoi faire**, en deux phrases au plus, plus un bouton.
10. **Quand tout va bien, on se tait** : pas de bande, de toast ni de réplique pour dire que rien ne
    se passe.

Plus la DA : pas de libellé en capitales, pas de « · », pas de « → » dans un bouton, pas de tiret
cadratin. Le prototype donne les textes de référence ; un texte nouveau suit ces règles.

## 4. Le cadre commun

### 4.1 La grille du bureau (768 px et plus)

De haut en bas : la **bande d'état** sur toute la largeur quand il y en a une, puis trois colonnes :
le **menu des lieux** (240 px), la **page du lieu**, la **colonne de Natsume** (360 px). Les deux
colonnes latérales se resserrent avec la fenêtre (environ 180 et 280 px au plus étroit) plutôt que
d'ajouter un point de rupture **[choix de rédaction]**. Lisible de 1024 à 1920 px, vérifiée à 1280 et
1440.

### 4.2 Le menu des lieux

Le sceau et « Lun'Anima » en tête (lien vers le Bureau), puis Bureau, Constellation, Journal,
Atelier en Cormorant, sans sous-titre, le lieu actif marqué par le fil ivoire. Le Bureau porte le
compteur À trancher (« 13 », ou « 13, lu à 14:11 » quand une lecture est vieille). En bas, les
**présences** des postes reliés (pastille du monde, nom, ce qui attend sous la forme « 1 urgence + 2 »,
ou l'état quand il ne répond pas) ; un clic ouvre le poste dans la Constellation. Aucun poste relié :
une ligne « Aucun poste relié » qui mène à Relier un poste. Un poste à relier n'est pas une présence.
En pied : « Chercher » avec Ctrl K. La fiche de Natsume n'est pas dans le menu.

### 4.3 La bande d'état

Une seule bande à la fois, pleine largeur, au-dessus du menu, la plus grave l'emporte dans cet ordre
**[choix de rédaction]** : Natsume injoignable, clé refusée, plafond atteint, pause, poste
injoignable, poste muet, mise en route. Les états d'un poste sont définis au §9.7. Textes du
prototype :

| État | Texte | Bouton |
|---|---|---|
| Natsume injoignable | « Natsume ne répond pas depuis 14:16. Ce que tu vois date de 14:15, en lecture seule. » | Réessayer |
| Clé refusée | « Clé refusée à 14:10. Natsume ne peut plus répondre ni rien confier. » | Modèle et clé |
| Plafond atteint | « Plafond du jour atteint : 3,00 $ sur 3,00 $. Natsume est en pause jusqu'à 05:00, sauf les urgences. » | Relever le plafond |
| En pause | « Natsume est en pause depuis 14:15. Rien d'automatique ne tourne, sauf les urgences ; tu peux toujours lui écrire. » | Reprendre |
| Poste injoignable | « Lun'Acedia ne répond pas depuis 14:12. Ses cartes sont en lecture seule ; nouvel essai automatique. » | Voir le poste |
| Poste muet | « Lun'Acedia est en pause dans ses propres réglages. Ses cartes sont en lecture seule. » ou « Lun'Acedia doit être mis à jour pour que ses cartes arrivent ici. » **[choix de rédaction]** | Voir le poste |
| Mise en route | « Rien ne tourne encore : la mise en route n'est pas finie. » | aucun |

Plafond du mois : « Plafond du mois atteint : 40,00 $ sur 40,00 $. Natsume est en pause jusqu'au 1er
décembre, sauf les urgences. » Plafond atteint avec « Prévenir seulement » : la première phrase
seule, avec Relever le plafond. Pendant une pause, la bande d'un poste injoignable ou muet ne
s'affiche pas (la pause tait la remontée des erreurs) ; la Constellation montre toujours son état.

### 4.4 La colonne de Natsume

Présente sur tous les lieux du bureau (Bureau, Constellation, Journal, Atelier, fiche de Natsume,
mise en route), toujours au même endroit.

**La tête** (environ 52 px) : le portrait (le monogramme du sceau dans un petit cadre, lien vers la
fiche de Natsume), « Natsume », son état, et un seul bouton : Mettre en pause, Reprendre, ou, au
plafond, Relever le plafond (lien vers le champ du plafond dans l'Atelier). Désactivé quand Natsume
est injoignable.

**L'état**, une seule fonction pour tout l'écran (tête, astre de la Constellation, en-tête du
téléphone, feuille de conversation) : Disponible ; Réfléchit (une réponse est en cours) ; En pause
depuis 14:15 ; En pause jusqu'à 05:00 (plafond du jour) ou jusqu'au 1er décembre (plafond du mois) ;
Clé refusée ; En attente de la clé (mise en route) ; Injoignable depuis 14:16.

**Le mot du lieu**, au-dessus de la conversation, défile seul. Son contenu par lieu est au §6.

**La conversation**, un panneau ancré en bas de la colonne, comme le terminal de VS Code :

- **Trois états** : **rangé** (une barre fine qui ne contient que le champ « Écrire à Natsume » ; le
  mot du lieu a toute la colonne), **ouvert** (une hauteur partielle, par défaut environ 45 % du
  corps de la colonne **[choix de rédaction]**, jamais toute la colonne), **agrandi** (toute la
  colonne sous la tête).
- **Le mot ne bouge jamais** : ni à l'ouverture, ni au redimensionnement, ni au rangement, il ne se
  remet pas en page et ne saute pas. Sa largeur reste la même, sa position de défilement est gardée ;
  le panneau se pose simplement sur sa partie basse. Ce qu'il couvre reste atteignable en faisant
  défiler le mot (une marge basse égale à la hauteur du panneau), comme l'éditeur de VS Code sous le
  panneau du terminal.
- **S'ouvre** au clic dans le champ, à E, à un lien « Voir la conversation », à l'envoi d'un
  message : depuis l'état rangé, il prend la dernière hauteur partielle retenue, jamais l'état
  agrandi.
- **Se redimensionne** par une poignée entre le mot et le fil : séparateur atteignable au clavier
  (flèches haut et bas par pas de 24 px), double-clic pour revenir à la hauteur par défaut. Bornes :
  le fil garde au moins 160 px, et au moins 120 px du mot restent visibles hors de l'état agrandi
  **[choix de rédaction]**.
- **En-tête du panneau** : « Fil du jour » (ou le nom du sujet ouvert), Agrandir ou Restaurer,
  Ranger.
- **Retenu** sur l'appareil (préférence d'affichage) : la hauteur et l'état rangé, ouvert ou agrandi,
  remis au rechargement.
- **Le champ ne cache rien pour de bon** : il est en bas du panneau ou dans la barre fine, jamais
  posé sur la page du lieu ni sur la file. Entrée envoie, Maj Entrée va à la ligne. Échap dans le champ rend le focus à ce qui l'avait
  avant, sans changer l'état du panneau **[choix de rédaction]**.
- **Contenu du fil** : le fil principal du jour et les sujets (pastilles « Réponse à Paul 11:03 »
  entre le fil et le champ). Une délégation y paraît : « Confié à Lun'Acedia, 11:04 » à la couleur du
  poste, puis la carte qui en revient, réduite à son type, son poste, son heure et son titre, avec
  « Voir dans À trancher » (choisit la carte dans la file sans recharger) ou le badge « Tranchée ».
  Jamais de geste Valider ou Refuser dans le fil.
- **États du champ** : prêt ; Natsume réfléchit (on peut écrire la suite, l'envoi attend) ; erreur
  d'envoi (le texte revient dans le champ, une ligne dit pourquoi) ; désactivé avec sa raison, à la
  place du champ : « Clé refusée : Natsume ne peut pas répondre. », « Plafond du jour atteint :
  Natsume répond à nouveau à 05:00. », « Natsume est injoignable. », « Ajoute d'abord la clé du
  modèle. ». En pause manuelle, le champ reste actif.

### 4.5 Les panneaux de détail

Panneau de 400 px, à droite, pleine hauteur sous la bande, par-dessus la colonne de Natsume, avec
une ombre et un filet à la couleur du monde. Fil d'Ariane (« Constellation / Lun'Acedia »), croix,
contenu, pied d'actions. Il ne pousse rien : la page garde sa largeur, la carte du ciel décale son
centre vers la gauche. Un clic sur un autre astre ou une autre entrée change le contenu sans fermer.
Échap, la croix ou Retour du navigateur le ferment, rendent le focus à l'élément d'origine et
nettoient l'adresse. Rien n'est ouvert par défaut. E avec un panneau ouvert le ferme et met le focus
dans le champ de Natsume **[choix de rédaction]**.

### 4.6 Le toast et l'annulation

Un seul toast à la fois, centré sur la page du lieu (pas sur la fenêtre). Une ligne, puis « Annuler »
avec la touche Ctrl Z affichée, et le temps qui reste (5 s). Rien d'autre. Un nouveau geste remplace
le toast ; le geste précédent part à son heure et ne s'annule plus **[choix de rédaction]**. Ctrl Z
n'agit pas depuis un champ. Toast sans annulation (information) : 3 s.

Textes **[choix de rédaction pour la forme générique]** : « Validée : Paul Mercier. », « Refusée :
Adresse de Marion. », « Urgence vue : la banque demande un justificatif. », « Réponse envoyée dans
5 s : Réponse à Paul. », « Réponse donnée : Chez Lulu. », « 5 fiches validées. » (le type au pluriel
quand le lot n'a qu'un type, sinon « cartes »), « Les deux fiches validées. », « Une fiche validée,
l'autre refusée. », « Natsume en pause. », « Natsume reprend. », « Lun'Acedia répond. ».

### 4.7 La palette (Ctrl K, partout)

Une recherche, puis des groupes : Lieux (Bureau avec « 13 à trancher », Constellation, Journal,
Atelier, Fiche de Natsume), Postes (les postes reliés, avec ce qui attend ou leur état), Gestes
(Mettre en pause ou Reprendre, ou Relever le plafond ; Réessayer un poste seulement s'il est muet ;
Relier un poste ; Ajouter un appareil), Réglages par leur nom (Plafond par jour, Plafond par mois,
Modèle et clé, Raccourcis clavier), À trancher (les cinq plus pressantes, qui ouvrent la carte à sa
place). Flèches pour choisir, Entrée pour ouvrir. On ne tranche jamais depuis la palette.

### 4.8 La barre d'aide

En bas de la page, une ligne de touches qui suit le focus, sans message ni raison de carte (la
raison est sur la carte). Elle tait V et R pendant une saisie, et montre alors Entrée, Maj Entrée,
Échap.

### 4.9 Le clavier

| Touche | Où | Effet |
|---|---|---|
| Ctrl K | partout | palette |
| E | partout, hors d'un champ | ouvre la conversation et met le focus dans le champ |
| Échap | partout | ferme la couche du dessus, une par appui |
| Flèches haut et bas | file, Journal, palette | carte, entrée ou option suivante ou précédente |
| V | file | Valider, ou Vu pour une urgence ; jamais sur une carte qui envoie, une question ou une pile |
| R | file | Refuser |
| Ctrl Z | partout, hors d'un champ | Annuler le dernier geste encore tenu |
| Tab | partout | ordre naturel, jamais détourné ; dans la Constellation, les astres dans l'ordre de l'heptagramme |
| Entrée | astre, entrée du Journal | ouvre le détail |
| Flèches gauche et droite | onglets de l'Atelier | thème suivant ou précédent |
| Ctrl F | Journal seulement | met le focus dans sa recherche |

Plus de `/`, de `[` ni `]`, de Ctrl Maj P ni de Ctrl J. Aucune touche n'agit depuis un champ sauf
Ctrl K. Les associations vivent dans une seule table de données, pour devenir réglables sans
réécrire les écrans ; au palier 3, le thème Clavier les montre en lecture seule avec « Bientôt
modifiables. » **[choix de rédaction]**.

**Ordre d'Échap** : palette, bande de confirmation, lot ouvert, feuille du téléphone, panneau de
détail, champ de Natsume (rend le focus). Jamais de changement de lieu.

### 4.10 Le téléphone (moins de 768 px)

- **En-tête commun** à toutes les pages : le monogramme (lien vers la fiche de Natsume), le nom du
  lieu et l'état de Natsume dessous, la loupe (palette). La bande d'état sous l'en-tête.
- **Navigation du bas** : Bureau, À trancher (avec son compteur, en neutre), Journal, Atelier
  (n° 64, §11).
- **Conversation** : une barre « Écrire à Natsume » au-dessus de la navigation sur toutes les pages
  (ou sa raison quand elle est désactivée) ; elle ouvre une feuille (en-tête Natsume et état,
  Replier, fil, sujets, champ). Le retour d'Android ferme la feuille avant de quitter le lieu.
- **Détails** : deux formes (n° 84, §11).

## 5. L'arbre des adresses

| Adresse | Ce qu'elle montre |
|---|---|
| `/app/` | Bureau |
| `/app/?carte=avaritia:<id>` | Bureau, la carte choisie dépliée à sa place (lien d'une notification, de la palette, du Journal) |
| `/app/?poste=acedia&depuis=constellation` | la file filtrée sur un poste, avec son bandeau « Seulement Lun'Acedia » |
| `/app/trancher` | À trancher, onglet du téléphone ; mêmes paramètres. Au bureau, renvoie à `/app/` avec ses paramètres |
| `/app/constellation` | Constellation, aucun panneau |
| `/app/constellation/acedia` | le panneau d'un poste |
| `/app/constellation/natsume` | bureau : focus sur le mot de la colonne ; téléphone : feuille de Natsume |
| `/app/journal?periode=auj&poste=acedia&type=confie&q=paul` | le Journal filtré ; `periode` vaut `auj`, `7j` ou `tout` (défaut `7j` **[choix de rédaction]**) |
| `/app/journal/<n>` | une entrée et sa chaîne, par-dessus la liste |
| `/app/atelier` | renvoie à `/app/atelier/postes` |
| `/app/atelier/<theme>` | `postes`, `depenses`, `modele`, `routines`, `appareils`, `notifications`, `clavier` ; un fragment désigne un réglage (`#plafond-jour`) |
| `/app/atelier/postes/relier` | relier un poste |
| `/app/atelier/appareils?ajout=1` | le code d'un nouvel appareil, affiché |
| `/app/natsume` | fiche de Natsume |
| `/app/mise-en-route` | premier lancement |
| `/app/appareil` | navigateur non reconnu, aucune donnée ; `?revoque` pour un appareil révoqué |

Les identifiants de poste dans l'adresse de l'app sont ceux du monde (`acedia`, `avaritia`, `ira`),
seulement pour l'interface et la donnée de monde. Les routes de l'API et leurs corps emploient les
identifiants de satellite du core (`lunacedia`, `lunavaritia`) ; le passage de l'un à l'autre se fait
par le `worldOf` existant. Les
anciennes adresses mènent aux nouvelles : `/app/valider` vers `/app/trancher`, `/app/ecosysteme?theme=x`
vers `/app/atelier/x`. Toute ouverture ou fermeture de panneau, tout filtre et la carte choisie
passent dans l'adresse, et Retour revient à l'état précédent.

## 6. Les lieux

### 6.1 Bureau

**La page** : « À trancher » et son nombre en titre, puis la file. Rien d'autre au centre.

**La file**, une seule pour tout le core, un seul composant (Bureau au bureau, À trancher au
téléphone) :

- **Urgent** en tête (non repliable) : les urgences non vues, la plus ancienne d'abord. Un rappel
  d'agenda n'y entre pas : il vit dans Ce qui vient (n° 110). Le core écarte de la file les
  événements de type `agenda.reminder` **[choix de rédaction]**.
- **Un groupe par poste** ensuite, repliable à son titre (chevron, pastille du monde, nom, nombre),
  le groupe dont la plus vieille carte attend depuis le plus longtemps d'abord, la plus ancienne
  d'abord dans le groupe. Les échéances de Lun'Avaritia (« C'est fait », « Plus tard ») sont dans son
  groupe, à leur date.
- **Une rangée** : la marque du monde, le type (« Nouvelle fiche », « Brouillon », « Urgence »), le
  titre, l'heure et une méta courte (« deux sources », « Lun'Acedia propose »), le badge « Envoie un
  mail » pour une carte qui envoie.
- **La carte choisie se déplie sur place** : son contenu complet (les lignes que le poste donne),
  « Pourquoi » et la raison du poste à la troisième personne, puis ses gestes. Une seule carte
  choisie à la fois, identifiée par son id (elle survit à une relecture). Le survol ne choisit pas.
- **Gestes** : Valider et Refuser ; Urgence : Vu et « Ouvrir le mail » (nouvel onglet, vers le
  poste) ; Question : un bouton par réponse proposée et un champ « Autre réponse, Entrée envoie »,
  les deux relayés comme une acceptation avec `input` `{ answer }` (§9.8) ;
  carte qui envoie : « Envoyer la réponse », Refuser, « Modifier dans Lun'Acedia », jamais en lot, V
  sans effet ; échéance : C'est fait, Plus tard.
- **Pile** : deux cartes d'un même poste, du même type et du même titre forment une pile qui compte
  pour une rangée **[choix de rédaction : critère de la pile]**. Type « Deux fiches, même nom »,
  titre seul, les deux contenus côte à côte, chacun avec « Valider celle-ci » ; en pied « Valider les
  deux » et « Refuser les deux ». Jamais dans un lot.
- **Lot** : sur le titre d'un groupe joignable, « Valider les 5 fiches » quand au moins deux cartes
  du groupe s'y prêtent (§9.3). Le lot remplace le groupe le temps du choix : « Valider ensemble »,
  « Décoche une fiche pour la laisser à trancher. », une ligne par carte (case cochée, titre,
  contenu, raison), en pied Fermer et « Valider les 5 fiches » (qui suit le nombre coché : « Valider
  la fiche », « Aucune fiche cochée » désactivé). Le bouton du titre disparaît pendant ce temps. Un
  seul toast pour le lot ; Annuler reprend le lot entier.
- **Après un geste**, la rangée part tout de suite (le core tient le geste, §9.3) ; le focus va au
  premier geste de la carte suivante au même rang.
- **Bandeau de filtre** seulement en venant de la Constellation : « Seulement Lun'Acedia » et
  « Toute la file ».
- **Fin** : « Tout est tranché. » avec le sceau et un lien « Journal du jour » ; filtrée : « Plus rien
  à trancher pour Lun'Acedia. » et « Toute la file ». Le compteur du menu s'éteint.

**Le mot du Bureau**, dans la colonne de Natsume, de haut en bas :

1. **La lettre** : « Lundi 2 novembre, lettre de 07:30 », puis la lettre entière (« Nuit calme.
   Lun'Avaritia propose 10 cartes, rien d'urgent. Rappeler Paul à 19:00. »). Ses chiffres sont ceux
   de 07:30, elle le dit par sa date. Dessous, ses corrections datées (« Correction de 10:12 : la
   veille de la nuit a fini à 10:05 ; Lun'Avaritia propose 4 cartes de plus. »). Avant la lettre du
   jour, rien (la lettre de la veille n'est pas montrée) ; routine échouée : « Pas de lettre ce
   matin : la routine a échoué à 07:30. » **[choix de rédaction]**.
2. **Depuis ce matin** : « 3 nouvelles cartes, dont 2 à trancher » ou « toutes tranchées », calculé
   depuis la file sans appel au modèle ; absent s'il n'y a rien de nouveau.
3. **Ce qui vient** : heure et libellé, heure par heure jusqu'à la lettre du lendemain (« 18:00,
   Justificatif pour la banque, dernier délai » ; « 19:00, Rappeler Paul » ; « 05:00, Veille de la
   nuit, demain » ; « 07:30, Lettre du matin, demain »), puis les tâches du jour, sans heure. Vide :
   la section disparaît.
4. **Ce que j'ai fait** : les trois dernières entrées du Journal du jour, chacune lien vers son
   détail, puis « Journal du jour ».

**Téléphone** : présences en pastilles qui reviennent à la ligne (plus « Relier un poste » quand un
poste connu reste à relier), « À trancher » et
les trois plus pressantes (lien vers leur carte dans À trancher), « Voir les 13 », puis le mot du
Bureau. L'onglet À trancher montre la file entière, avec des pastilles de filtre par poste (« Tout »,
« Lun'Acedia 2 »).

### 6.2 Constellation

**La carte du ciel** : l'heptagramme du site, tracé très pâle, Natsume au centre, chaque monde à sa
**place fixe** dans le sens horaire depuis le haut : Ira, Avaritia, Gula, Superbia, Luxuria,
Invidia, Acedia. Seuls les postes reliés ou connus à relier ont un astre ; aucun point sans nom. Les
places viennent d'une donnée de monde, pas d'un composant (§12) **[choix de rédaction]**. Le core
connaît ainsi les mondes de l'écosystème : Lun'Ira et les autres sont « à relier » tant qu'ils ne
sont pas appairés.

- **Un astre** : un disque à la couleur du monde portant le nombre À trancher du poste (« + » pour
  un poste à relier), son nom, une ligne d'état (« Le cerveau, relié » ; « Ne répond pas depuis
  14:12 » ; « En pause dans ses réglages »). Le contour dit l'état (§9.7) : plein (relié), tirets
  (muet), pointillé barré (injoignable), pointillé clair (à relier, neutre, sans couleur). Tant que le
  core n'a aucune lecture d'un poste relié (démarrage, première lecture en cours), l'astre dit
  « Inconnu », sans nombre ; quand Natsume est injoignable, tous les astres disent « Inconnu »
  **[choix de rédaction]**.
- **Un lien** de Natsume à chaque poste, dans le même code de trait que le contour. Aucun libellé
  sur les liens.
- **L'astre de Natsume** : monogramme, son état et « 13 à trancher ». Le choisir met le focus sur le
  mot de sa colonne (pas de panneau).
- Légende discrète (Relié, Muet, Injoignable, À relier) et l'heure (« Maintenant, 14:20 »).
- Tab parcourt les astres dans l'ordre de l'heptagramme ; chaque astre a un nom accessible qui dit
  ce qu'il porte (« Lun'Avaritia, relié, 10 à trancher ») ; une liste lisible par un lecteur d'écran
  double la carte.

**Le panneau d'un poste** (§4.5) : nom et rôle, badge d'état ; **Diagnostic** (Dernier contact,
Dernier succès, Dernière erreur ; injoignable : Dernier succès, Dernière erreur, Nouvel essai
« automatique » ; muet : la raison, « En pause dans ses réglages » ou « Version du contrat trop
ancienne » ; Natsume injoignable : Dernière lecture) avec « Réessayer » s'il est injoignable, sinon
« Vérifier maintenant » (« Essai en cours », puis toast « Lun'Acedia répond. » ou « ne répond
toujours pas. ») ;
**Aujourd'hui** (Confié : « 2, à 09:12 et 11:04 » ; Coût) ; **« Voir ses 3 cartes »** vers la file
filtrée (avec « lu à 14:11 » si la lecture est vieille), ou « Rien à trancher » ; en pied « Régler ce
poste » et « Ouvrir Lun'Acedia » (nouvel onglet). Le nom d'agent, s'il est réglé dans le poste, en
ligne « Agent » du diagnostic ; vide, pas de ligne **[choix de rédaction pour la place]**. Lun'Ira à relier : « Pas encore relié. », « Une
fois relié, ses cartes arrivent dans À trancher. » et « Relier Lun'Ira ». Tout juste relié : « Ce que
Natsume peut lui confier : Lun'Ira n'a encore rien déclaré. », « Rien ne lui est confié tant que tu
ne l'as pas réglé. » et « Régler la veille de la nuit ».

**Le mot de la Constellation** : **Routines** (« 05:00, Veille de la nuit, faite » ; « 07:30, Lettre
du matin, faite » ; « 05:00, Veille de demain », « suspendue » en pause) et **Dépenses**
(Aujourd'hui « 0,42 $ sur 3,00 $ », Ce mois « 0,80 $ sur 40,00 $ », une jauge).

**Téléphone** : la page Constellation est une liste des astres (Natsume puis les postes dans
l'ordre de l'heptagramme, état et nombre) ; un poste ou Natsume ouvre sa feuille, avec le même
contenu que le panneau. On y vient par les présences du Bureau et la palette.

### 6.3 Journal

**La page** : « Journal », puis « 1 286 événements depuis le 12 octobre » (le total et la date de
la première entrée gardée). Une rangée de filtres : la recherche (« Chercher : Paul, banque,
veille », nombre de résultats quand un filtre agit), la période (Aujourd'hui, 7 jours, Tout), les
pastilles de poste (Tous, chaque poste relié, Natsume), et « Plus de filtres » qui ouvre les types
(Tous, Urgences, Cartes, Confiés, Routines). Tout filtre est dans l'adresse.

**La liste** : groupée par jour (coupe à 05:00, la journée de Natsume), titre « Aujourd'hui »,
« Hier », puis la date (« lundi 2 novembre, 6 événements »). Une rangée par entrée : heure, marque du
monde, titre, méta (« Confié, depuis la conversation »), badge d'issue (À trancher, Tranchée, Vue,
Fait, Échoué, Sautée). Le plus récent en haut. En bas, « Plus ancien » charge la page de jours
suivante. Aucune entrée ouverte par défaut. Rien ne correspond : « Rien ne correspond. », « Aucun
événement avec ces filtres. » et « Effacer les filtres ».

**Le panneau d'une entrée** : fil d'Ariane « Journal / Aujourd'hui, 11:04 » et « n° 1 284 », titre,
méta et issue ; **La chaîne** (les étapes datées, la dernière marquée ; « La carte est à trancher. »
pour une issue en attente) ; « Ce qui a été confié » pour une délégation ; Coût, Durée, Références ;
« Trancher la carte » quand l'issue attend ; en pied « Voir la conversation » (ouvre le panneau de
conversation sur ce sujet ou à cette heure) et « Ouvrir dans Lun'Acedia ». Flèches haut et bas
changent d'entrée, panneau ouvert.

**Le mot du Journal** : Aujourd'hui et Hier, une ligne par poste (« Lun'Acedia : 2 confiés, 3
cartes en retour, dont 1 urgence » ; « 2 confiés, 1 fait, 1 échoué »). Aucun total de coût (n° 68,
§11).

**Téléphone** : même liste, filtres repliés sous « Filtres » ; une entrée s'ouvre en feuille.

### 6.4 Atelier

Un thème à la fois, onglets de texte en tête (Postes, Dépenses et plafonds, Modèle et clé,
Routines, Appareils, Notifications, Clavier), sans en-tête d'explication. Pas d'état vivant ici
(pas de « ne répond pas », pas de Réessayer) : « État et diagnostic » renvoie au panneau du poste.
**Règle d'enregistrement** : les bascules et les choix s'enregistrent au clic et le disent
(« Activé, enregistré », « Éteint, enregistré », « Enregistré ») ; un champ s'enregistre à Entrée ou
par son bouton Enregistrer qui n'apparaît qu'une fois la valeur changée ; Échap dans un champ remet
sa valeur. La barre d'aide le dit en touches seulement.

- **Postes** : le même gabarit pour chaque poste relié : rôle et « Relié depuis le 27 octobre »,
  Agent (le nom réglé dans le poste, en lecture seule ; pas de ligne quand il est vide), Lui confier
  la veille de la nuit,
  Plafond du poste (« Au-delà, plus rien ne lui est confié jusqu'à 05:00 »), Délai de réponse,
  Alertes urgentes en direct, Bilan du jour, Délier (bande de confirmation pleine largeur, focus sur
  Fermer, texte du prototype). Un poste à relier : Relier. Le formulaire « Relier un poste » est une
  page seule : étapes (Le poste, Le code, Vérification), code à six chiffres affiché par le poste,
  compte à rebours, « Tu peux coller le code. », erreurs (« Il faut six chiffres. », code refusé,
  code expiré) ; à la réussite, la Constellation avec le panneau du poste ouvert et le toast
  « Lun'Ira est relié. ».
- **Dépenses et plafonds** : Aujourd'hui (remis à zéro à 05:00) par source (chaque poste « 0,05 $
  sur 1,00 $ », « Natsume seule » avec Conversation, lettre du matin), les sept derniers jours en
  barres, puis Plafonds : Par jour (« Pour Natsume et tous ses postes »), Par mois, « Quand un plafond
  est atteint » (Prévenir seulement, Mettre en pause), « Prévenir à 80 % du plafond » avec
  « Notifications non activées. » et un lien. Phrase de conséquence sous un champ qui passe sous la
  dépense : « Sous la dépense du jour (0,42 $) : pause jusqu'à 05:00. », « Sous la dépense du mois :
  pause jusqu'au 1er décembre. ».
- **Modèle et clé** : le modèle, la clé (« Enregistrée le 27 octobre, se termine par 4f2a »,
  « Refusée à 14:10. Colle une nouvelle clé. »), son échéance, la longueur des réponses. La clé n'est
  jamais réaffichée.
- **Routines** : veille de 05:00 et lettre de 07:30 : dernier passage, résultat, « Lancer
  maintenant » (la lettre relancée devient une correction, §9.5). En pause, Lancer reste possible :
  c'est une demande.
- **Appareils** : « Un appareil reconnu voit tout Lun'Anima. », la liste (badge « Cet appareil »),
  Révoquer (bande de confirmation), Ajouter un appareil (code « 731 506 », « Valable encore 4:59. Un
  seul usage. », « Annuler ce code »).
- **Notifications** : « Notifications non activées. » Rien d'autre au palier 3 (§13).
- **Clavier** : la table du §4.9 en lecture seule, groupée (Partout, À trancher, Ailleurs), bannière
  « Bientôt modifiables. ».

**Le mot de l'Atelier** : Derniers réglages, trois lignes datées tirées du Journal (« hier, 18:42 :
délai de réponse de Lun'Acedia, 8 s »).

**Téléphone** : la liste des thèmes avec leur état en une ligne, puis le thème ouvert.

### 6.5 Natsume (fiche)

Hors du menu ; on y vient par le portrait, l'en-tête du téléphone et la palette. « Retour au
Bureau », « Natsume », « Caractère, voix et apparence. Rien n'est encore réglable ici. ». À gauche,
le monogramme dans le cadre d'arcane fin, son nom et son état. À droite, « Ce qui est vrai
aujourd'hui » en lecture seule (Nom, Rôle « Comprend, confie aux postes, rapporte », Modèle avec un
lien vers Modèle et clé) et « Ce qui viendra » avec le badge « bientôt » (Ton et caractère, Mémoire
de la relation, Humeurs, Voix « Voix de synthèse, plus tard », Apparence). Pas d'onglets Voix et
Apparence tant qu'ils ne mènent à rien **[choix de rédaction]**. Le mot de la fiche : Lettre du
matin 07:30, Confié aujourd'hui, Dépense du jour.

### 6.6 Hors des lieux

- **Navigateur non reconnu** (`/app/appareil`) : page seule, « Ce navigateur n'est pas encore
  reconnu », code d'appareil, « Rien de Lun'Anima n'est affiché avant la reconnaissance. », Entrer ;
  révoqué : « Cet appareil a été révoqué ». Après reconnaissance : le Bureau, jamais la mise en route
  (n° 66).
- **Mise en route** (`/app/mise-en-route`), tout premier lancement seulement, tant que la clé et un
  premier poste manquent : la liste du prototype, chaque ligne cochée par l'état réel, jamais par un
  clic (Cet appareil est reconnu, La clé du modèle, Les plafonds avec « Garder ces valeurs »,
  Un premier poste relié, Les notifications, Un second appareil). Les notifications portent « bientôt »
  et un second appareil est facultatif : la mise en route est finie avec les quatre premières
  **[choix de rédaction]** ; la phrase d'en-tête donne le nombre restant (« Quatre réglages avant de
  commencer. »). `/app/` y mène tant qu'elle n'est pas finie.

## 7. États par lieu

| État | Bureau | Constellation | Journal | Atelier | Colonne de Natsume |
|---|---|---|---|---|---|
| Chargement | squelette des groupes ; ce que le core a en base s'affiche sans attendre un poste lent | heptagramme et astres sans nombre jusqu'à la première lecture | squelette de deux jours | squelette du thème | tête et mot en squelette, champ actif |
| Vide | « Tout est tranché. » | aucun poste : l'astre de Natsume seul et « Relier un poste » | « Rien ne correspond. » ou, sans aucune entrée, « Rien d'écrit encore. » | sans objet | mot réduit aux sections qui ont un contenu |
| Erreur de lecture | groupe du poste : « Lu à 14:11 », cartes en lecture seule | astre en tirets | « Le Journal ne s'est pas chargé. » et Réessayer | « Ce réglage ne s'est pas enregistré. » à la ligne | section qui échoue absente, une ligne dit pourquoi |
| Pause | file entière, gestes actifs | routines « suspendue » | entrées « Sautée, en pause » | tout réglable | bouton Reprendre, champ actif |
| Plafond atteint | gestes actifs | dépense « 3,00 $ sur 3,00 $ », jauge pleine | inchangé | conséquence affichée | Relever le plafond, champ remplacé par sa raison |
| Poste injoignable ou muet | ses cartes du dernier relevé grisées, gestes désactivés, « Indisponible tant que Lun'Acedia ne répond pas. » (muet : « … tant que Lun'Acedia est en pause. » ou « … n'est pas mis à jour. ») ; « Ouvrir le mail » garde une infobulle de prudence | panneau en diagnostic, Réessayer si injoignable | inchangé | inchangé | inchangé |
| Clé refusée | gestes actifs | inchangé | inchangé | Modèle et clé dit le refus | champ remplacé par sa raison |
| Natsume injoignable | dernière photo connue, en lecture seule, gestes désactivés « Natsume est injoignable : lecture seule. » | astres « Inconnu » | lecture seule de ce qui est chargé | lecture seule | « Injoignable depuis 14:16 », champ remplacé |

La dernière photo connue n'existe qu'en mémoire de la page : un rechargement pendant la panne
affiche l'erreur sans donnée. Hors ligne, on lit, on ne tranche pas ; aucun geste n'est mis en file
côté navigateur.

## 8. Objectifs, non-objectifs, anti-objectifs

**Objectifs**

- Trancher toute la file depuis un seul endroit, sans changer de lieu, avec le contenu sous les
  yeux et l'annulation réelle.
- Natsume présente et joignable de la même façon sur tous les lieux.
- Comprendre l'état d'un poste en un clic depuis le menu.
- Chaque compteur, montant et état vient d'un seul calcul du core.
- La pause et les plafonds sont visibles, compréhensibles et réversibles partout.

**Non-objectifs**

- Le Journal enrichi : calendrier, pagination par curseur, recherche plein texte, archive (palier 4).
- Les notifications système et Web Push (§13).
- La personnalité de Natsume, la voix, l'avatar, la scène, le relais du PC.
- Les raccourcis réellement modifiables, la pause par poste.
- Toute illustration ou animation au-delà du fondu de 180 ms au changement de lieu (instantané sous
  « réduire les animations »).

**Anti-objectifs** (échec même si « ça marche »)

- Une carte qui se tranche à deux endroits, ou un Valider sur une carte non dépliée.
- Un compteur ou un montant qui contredit un autre écran.
- Une conversation qui recouvre le contenu, ou un geste de sécurité dans le fil.
- Un texte qui explique l'interface, nomme le core ou un agent non déclaré.
- Une couleur écrite en dur, de l'or hors de Lun'Avaritia, l'accent d'Anima confondu avec le danger.
- Un accueil qui appelle le modèle à l'ouverture ou attend un poste lent.

## 9. Côté core

### 9.1 L'état unique : `GET /api/state`

Lu par le menu, la bande, la tête de la colonne, l'en-tête du téléphone, les astres et la palette ;
au chargement, après chaque geste et toutes les 30 s (page visible). Ne contacte aucun poste et
n'appelle pas le modèle : il ne lit que ce que le core garde (le cache du §9.2). Contenu **[choix de
rédaction pour la forme]** :

- `natsume` : l'état du §4.4 (`kind`, `since`, `until`) ;
- `pause` : `{ since, by: 'manuel' | 'plafond-jour' | 'plafond-mois', until? }` ou absent ;
- `key` : `ok`, `refusee` (avec l'heure), `absente` ;
- `spend` : jour et mois, plafonds, par source ;
- `queue` : total, urgences, et par poste `{ count, urgent, readAt, stale }` (une pile compte pour
  une, une carte tenue n'est plus comptée) ;
- `posts` : par poste, avec son id de satellite, `{ id, state: 'relie' | 'muet' | 'injoignable' |
  'a-relier' | 'inconnu', since?, reason?, agentName? }` (§9.7) ;
- `band` : la bande à montrer, avec ses chiffres ;
- `route` : la mise en route, ligne par ligne.

`GET /api/health` reste pour les sondes.

### 9.2 La file : `GET /api/queue`

Remplace la composition côté écran de `/home`, `/cards` et `/dues`.

**La boucle de lecture** **[choix de rédaction]** : le core garde la dernière liste lue de chaque
poste dans une table `card_reads` (id de satellite, heure de lecture, cartes en JSON), remplie par
une boucle de fond. Elle relit les cartes d'un poste dès qu'un événement de son flux SSE arrive, et
sinon toutes les 2 minutes ; elle relit aussi les échéances de Lun'Avaritia (`brain.due`) et Ce qui
vient au même rythme. Elle tourne pendant une pause : observer n'est pas une action automatique, la
pause arrête les actions, pas les lectures. `/api/state`, `/api/queue` et le Bureau ne lisent que ce
cache, jamais un poste en direct. Une lecture est **périmée** (`stale`) quand la dernière tentative
a échoué ou quand la dernière réussite date de plus de 5 minutes ; l'écran dit alors « lu à 14:11 ».
Un poste injoignable ou muet garde ainsi ses cartes visibles, en lecture seule. Une carte entre au
Journal à sa première lecture par cette boucle.

La route rend les groupes déjà ordonnés (§6.1), les piles formées, les cartes tenues retirées, les
événements `agenda.reminder` écartés par leur type, et pour chaque carte `batchable`, `sends`,
`options`, `readOnly` et sa raison. Les échéances (moins les « Plus tard » du jour) entrent dans le
groupe de Lun'Avaritia. `GET /api/cards` reste pour le fil et les clients existants.

**Ce qui vient** : `GET /api/upcoming`, servi depuis un cache du core rafraîchi par la boucle de
lecture, jamais en direct **[choix de rédaction]**. Il réunit les routines prévues, et ce que rend
l'action de lecture `agenda.list` de Lun'Acedia pour le reste du jour : des `AgendaItem[]`, soit des
événements, montrés avec leur heure, soit des tâches datées d'un jour seulement, montrées sans heure.
Les rappels n'en viennent pas : ce sont des événements urgents `agenda.reminder` à part, que le core
place à leur heure dans Ce qui vient et écarte de la file. S'y ajoutent les heures limites portées
par une urgence quand le poste les donne (`data.due`). Un poste absent n'y met rien.

### 9.3 Les gestes tenus

- `POST /api/gestures` `{ items: [{ satellite, card, gesture: 'accept' | 'refuse', input? }], from }`,
  ou pour une urgence `{ event, gesture: 'seen' }`, pour une échéance `{ due, gesture: 'done' | 'later', text? }`.
  Répond `202 { id, dueAt }`. Le core enregistre le geste (table `held_gestures`, persistée pour
  qu'un redémarrage ne le perde pas), le retire aussitôt de la file, et le relaie au poste 5 s plus
  tard.
- `DELETE /api/gestures/:id` : annule tant que le délai court (`204`) ; trop tard, `409`. Un lot est
  un seul geste : il s'annule en entier.
- `GET /api/gestures/:id` : `held`, `relayed`, ou par carte l'échec et sa raison. L'écran le lit une
  fois le délai passé ; une carte en échec revient dans la file avec « Lun'Acedia n'a pas répondu,
  rien n'a été fait. » et Réessayer ; une carte déjà décidée ailleurs (409 du poste) part avec le
  toast « Déjà tranchée ailleurs. ».
- Au démarrage, le core relaie les gestes tenus dont l'heure est passée.
- Tous les gestes de la file passent par là, « C'est fait » et « Plus tard » compris : une seule
  règle d'annulation **[choix de rédaction]**. Le geste relayé est noté au Journal à son relais ; un
  geste annulé n'y laisse rien.
- **Lot** : seulement des cartes d'un même poste, `effect: 'write'`, sans `sends` ni `options`,
  hors pile, d'un poste qui parle la v1.4 **[choix de rédaction]**. Le core refuse un lot qui contient
  autre chose (`400`).
- La route de geste directe actuelle (`POST /satellites/:id/cards/:card/accept|refuse`) reste pour
  le fil et les outils, sans délai.

### 9.4 La pause

- `POST /api/pause` et `POST /api/resume` ; l'état vit dans les réglages du core et survit à un
  redémarrage. Noté au Journal (type `pause`).
- **Ce qui s'arrête** : les routines prévues (notées « Sautée, en pause »), les délégations
  automatiques, et la **remontée des erreurs** : les événements d'erreur du core (routine en échec,
  poste injoignable, clé) sont écrits au Journal mais ne lèvent ni bande ni alerte **[choix de
  rédaction : écrits, pas levés]**.
- **Ce qui continue** : la boucle de lecture du §9.2 et l'écoute des flux SSE (observer n'est pas
  agir) ; les urgences des postes, qui entrent dans la file ; la conversation et les délégations
  qu'elle demande ; les gestes ; « Lancer maintenant » ; « Réessayer ».
- **Le relais** (contrat v1.4) : à la pause, le core appelle `POST /lun/v1/pause` avec `by: 'core'`
  sur chaque poste relié, puis `resume` avec `by: 'core'` à la reprise. Un poste qui n'a pas accusé
  reçoit l'état du core à chaque reconnexion de son flux ; un poste relié pendant une pause la reçoit
  aussitôt. Un `409` vaut accusé.
- **Plafond** : avec « Mettre en pause », atteindre le plafond du jour pose une pause `plafond-jour`
  jusqu'à 05:00, celui du mois une pause `plafond-mois` jusqu'au 1er du mois suivant, relayées comme
  la pause manuelle ; la conversation s'arrête aussi (elle coûte), les gestes continuent. Relever le
  plafond au-dessus de la dépense lève la pause tout de suite **[choix de rédaction]**. Avec
  « Prévenir seulement », la bande seule.

### 9.5 La lettre du matin

- Table `letters` (`day` clé, `written_at`, `text`, `items` en JSON) et table `letter_notes`
  (`day`, `at`, `text`). Écrite une fois par la routine de 07:30 ; une seconde écriture du même jour
  est refusée par la base.
- **Texte** : composé sans appel au modèle depuis le point déjà classé (`rankPoint`), le résultat de
  la veille et Ce qui vient, en phrases factuelles du §3 **[choix de rédaction]**. La personnalité
  pourra la réécrire plus tard sans changer le stockage.
- **07:30 sans attendre la veille** **[choix de rédaction]** : la lettre part à 07:30 même si la
  veille de 05:00 tourne encore ; la dépendance du moteur de routines (`routines/engine.ts`, ligne
  84 : « the morning waits for a night still under way ») change en ce sens. Les résultats de la
  veille arrivent ensuite en correction datée.
- **Corrections** : tout traitement plus tard dans la journée (veille finie après 07:30, routine
  relancée) ajoute une note datée qui dit ce qui a changé, jamais une nouvelle lettre.
- **Relance à la main** **[choix de rédaction]** : après un passage de 07:30 en échec, « Lancer
  maintenant » écrit la première lettre du jour s'il n'y en a pas encore ; sinon il ajoute une
  correction.
- Le point du matin n'est plus posté dans le fil principal : la lettre le remplace (règle 1)
  **[choix de rédaction]**. La phrase du jour n'est plus exposée par `/home` ni affichée ; sa
  génération reste en place pour le chantier de personnalité.
- Lue par `GET /api/word?place=bureau|constellation|journal|atelier|natsume`, qui rend le mot du
  lieu déjà calculé (lettre et notes, Depuis ce matin, Ce qui vient, Ce que j'ai fait ; routines et
  dépenses ; synthèse des jours ; derniers réglages) **[choix de rédaction : une route pour le mot]**.

### 9.6 Le Journal

- **Une table `journal`** (id, at, type, poste, titre, méta, issue, coût, durée, références, lien
  vers une carte, un fil ou un message, texte de recherche sans accents) et une table
  `journal_steps` (entrée, heure, texte) pour la chaîne **[choix de rédaction]**. Types stables :
  `urgence`, `carte`, `confie`, `routine`, `pause`, `reglage`, `liaison`. Un geste ou une vue met à
  jour l'issue de l'entrée de sa carte ou de son urgence et ajoute une étape. Une carte entre au
  Journal la première fois que le core la lit. La conversation n'y entre que par ses effets.
- La migration reprend l'historique des tables `events` (sauf `log`), `gestures`, `event_seen`,
  `delegations` et `routine_runs`, dans l'ordre des heures. Le coût d'une délégation vient de
  `AgentReply.cost` à partir de maintenant.
- `GET /api/journal?periode&poste&type&q&avant` : les jours, le total et la date de la première
  entrée, la page suivante par jours (comme aujourd'hui). Recherche par sous-chaîne sur le texte sans
  accents. `GET /api/journal/:n` : l'entrée, sa chaîne, et la carte encore en attente s'il y en a une.
- `GET /api/map` et `map.ts` disparaissent avec la carte d'un jour passé.

### 9.7 Postes, dépenses, réglages

- **États d'un poste** **[choix de rédaction]** :
  - **à relier** : un monde de la donnée de monde (une place de l'heptagramme) qui n'est pas
    appairé ; Lun'Ira et les autres le sont jusqu'à leur appairage ;
  - **injoignable** : aucun contact, c'est-à-dire le flux SSE coupé ou `health()` en échec ;
  - **muet** : joignable, mais il ne sert pas ses cartes : en pause dans son propre front
    (`pausedBy: 'local'`), ou contrat en dessous de la v1.4 ;
  - **relié** : tout va bien ;
  - **inconnu** : relié mais encore jamais lu depuis le démarrage du core.
- **Ce qui existe déjà, et sur quoi on s'appuie** : l'écoute SSE de chaque poste, qui se reconnecte
  avec un délai croissant jusqu'à 60 s, et `health()` borné à 8 s. Pas de nouvelle sonde périodique :
  la boucle de lecture du §9.2 et ces deux mécanismes suffisent.
- **Diagnostic stocké** **[choix de rédaction]** : pour chaque poste, le core garde l'heure du
  dernier contact (tout échange réussi, flux ou appel), du dernier succès (dernière lecture de cartes
  réussie, avec ce qui a été lu) et la dernière erreur (heure et raison), dans une table
  `post_status` mise à jour par l'écoute SSE, `health()` et la boucle de lecture.
- `GET /api/posts/:id` pour le panneau : ce diagnostic, les confiés du jour avec leurs heures, le
  coût du jour, sans appeler le poste ; `POST /api/posts/:id/check` pour Réessayer ou Vérifier
  maintenant (un `health()` et une lecture de cartes tout de suite).
- **Plafonds** : un plafond du jour sur le total de toutes les sources (le core, et chaque poste
  tel que `/costs` le donne, sa dernière valeur connue s'il ne répond pas) remplace les deux plafonds
  actuels (conversation, routines), semé à leur somme ; plus un plafond du mois, le comportement au
  plafond et le seuil d'avertissement **[choix de rédaction]**. Le budget interne de la veille par
  jour résumé reste dans `.env`.
- **Par poste**, rangés `post:<id>:<réglage>` dans `settings` : veille de la nuit (le core lui
  confie la journée ou lit son bilan), plafond du poste (le core ne lui confie plus rien au-delà,
  jusqu'à 05:00 ; Natsume le dit si on lui demande), délai de réponse, alertes urgentes en direct (le
  core retient ou non ses `urgent`), bilan du jour (lu ou non par la veille) **[choix de rédaction]**.
- `PATCH /api/settings` s'étend à ces champs ; chaque changement est noté au Journal (`reglage`).

### 9.8 Contrat satellite v1.4

À écrire dans `standards/contrat-satellite.md`. Les routes et les champs ne cassent rien (aucun
champ retiré ni rendu obligatoire), mais **le comportement d'un satellite en pause change** : la v1.4
n'est pas « sans rupture » pour les satellites, qui doivent être mis à jour. Tant qu'un poste parle
une version plus ancienne, il est **muet** pour le core (§9.7).

- **Deux pauses, distinguées** : `POST /lun/v1/pause` accepte `{ reason?, by?: 'core' }` et
  `resume` `{ by?: 'core' }` ; `Health.pausedBy?: 'core' | 'local'` dit qui l'a posée. `resume` avec
  `by: 'core'` ne lève qu'une pause du core ; une pause locale ne se lève que dans le front du poste.
- **Sous une pause du core** (décision de CrOliX) : le poste garde son tri par règles seules (sans
  modèle, gratuit), donc ses urgences issues de règles remontent ; il continue de répondre à
  `/agent` pour les demandes de CrOliX et pour les gestes, « C'est fait » compris, et de servir ses
  lectures, ses événements et les gestes sur ses cartes ; tout ce qui est automatique et passe par le
  modèle s'arrête.
- **Sous une pause locale** : arrêt complet de ce poste, comme aujourd'hui ; `/agent` répond qu'il
  est en pause.
- **Nom d'agent** : `Health.agentName?: string`, tiré d'un réglage du poste, **vide par défaut**
  (règle « agents neutres personnalisables ») ; vide ou absent, il n'est pas envoyé et aucune ligne
  Agent n'apparaît.
- **Cartes** : `Card.kind?` (libellé court du type, « Nouvelle fiche »), `Card.reason?` (la raison,
  à la troisième personne), `Card.sends?: true` (valider envoie quelque chose hors de chez CrOliX),
  `Card.options?: string[]` (réponses proposées d'une question). Sans `kind`, la rangée dit
  « Carte » ; sans `sends` déclaré par un poste v1.4, la carte n'entre pas dans un lot.
- **Réponse à une question** **[choix de rédaction]** : `accept` reçoit `input` `{ answer: string }`,
  pour une réponse choisie parmi `options` comme pour une réponse libre. Aucun satellite n'envoie
  `options` aujourd'hui : c'est nouveau côté satellite, comme la lecture de `answer`.
- **Événements** : `LunEvent.lines?: string[]` (contenu montré à l'urgence dépliée) et
  `data.due?` (heure limite ISO, pour Ce qui vient).

**Ce que Lun'Acedia doit changer** :
- le tri (`server/src/triage/pipeline.ts`, ligne 285) s'arrête aujourd'hui en entier dès que le
  poste est en pause : sous une pause du core, il ne garde que les règles et saute l'appel au modèle ;
  sous une pause locale, il s'arrête comme aujourd'hui ;
- `/agent` (`server/src/contract/routes.ts`, ligne 216) refuse tout en pause : il ne refuse plus que
  sous une pause locale ;
- ne plus déclarer « Pina » en dur : le nom d'agent devient un réglage du poste, vide par défaut, et
  ne part dans `health` que rempli ;
- remplir `kind`, `reason`, `sends` (brouillon de réponse), `lines` et `data.due` quand il les a ;
  servir la v1.4 dans `health`.

**Ce que Lun'Avaritia doit changer** :
- `/agent` (`server/src/contract/routes.ts`, ligne 192) refuse tout en pause : même règle, il ne
  refuse plus que sous une pause locale, « C'est fait » compris ;
- sous une pause du core, ses traitements automatiques par le modèle s'arrêtent, ses lectures
  continuent ;
- remplir `kind`, `reason` et `options` pour ses questions, lire `input.answer` à l'acceptation ;
  servir la v1.4 dans `health`.

Les deux gardent la règle « rien du core dans le front ».

## 10. Ce qui est repris, déplacé, retiré

| Production (`feat/core-app-palier-2`) | Sort au palier 3 |
|---|---|
| `ui/src/lib/ui` (kit) | repris : BottomNav, Button, Badge, Banner, Checkbox, Segmented, SettingsCard, SettingsRow, Switch, TextInput, TextArea, CodeInput, Steps, StandaloneCard, ConfirmDialog (bandes Délier et Révoquer), Dialog (feuilles), CommandPalette, EmptyState, Skeleton, Kbd, Tooltip, Chip ; `toasts` et Toaster modifiés à la source (§12) |
| `api.ts`, `session.ts`, `posts.ts`, `frontHref.ts` | repris |
| `Pair.svelte` | déplacé en écran `/app/appareil`, textes du prototype |
| `shell/Shell.svelte`, `shell/routes.ts`, `shell/icons.ts` | réécrits : menu des lieux, bande, colonne, arbre du §5 |
| `shell/Postes.svelte` (lanceur) | retiré : les présences du menu et la Constellation le remplacent |
| `natsume/fil.svelte.ts` | repris tel quel (fil, sujets, envoi en flux) |
| `natsume/Panneau.svelte` | réécrit en colonne de Natsume et feuille du téléphone ; `/` et Ctrl J retirés |
| `cards/CardItem.svelte`, `cards/decide.ts`, `cards/gestures.ts` | refondus en carte de file et appel aux gestes tenus ; le fil garde une carte réduite sans geste |
| `screens/Accueil.svelte` | retiré ; sa règle de focus après un geste passe à la file |
| `screens/Valider.svelte` | devient l'onglet À trancher du téléphone, même composant de file |
| `screens/Journal.svelte` | refondu : filtres, détail en panneau ou feuille ; « charger plus » repris en « Plus ancien » |
| `screens/ecosysteme/*` | déplacés en thèmes de l'Atelier (Postes, Dépenses, ModeleCle, Routines, Appareils, Notifications) ; Clavier ajouté ; Presences devient les présences du menu et du téléphone ; état vivant retiré des thèmes |
| `carte/geometry.ts`, `carte/Noeud.svelte` | repris pour les astres ; l'orbite automatique cède aux places fixes |
| `carte/Carte.svelte`, `Fiche*.svelte`, `Attente.svelte`, `map.ts` | retirés (cadran, fiches ancrées, flèches de date) ; le contenu de `FichePoste` passe au panneau d'un poste |
| `time.ts` | formats du §3 (« 09:42 », jour en minuscule, « 1er ») |
| `core/src/map/*`, `GET /api/map` | retirés |
| `core/src/journal/*`, `GET /api/journal` | refondus sur la table `journal` |
| `core/src/accueil/routes.ts` | `/home` réduit (plus de phrase), `/dues` et gestes directs gardés derrière la file ; `/events/:id/seen` gardé |
| `core/src/routines/morning*.ts` | écrit la lettre au lieu de poster le point ; `rankPoint` et `gatherPoint` repris |
| `core/src/delegations/store.ts` | repris, plus le coût et le lien vers l'entrée du Journal |
| `core/src/settings/*` | étendus (§9.7) |

## 11. Les trois points partiels

- **N° 64, navigation du téléphone** : gardée telle quelle, par choix de place : Bureau, À trancher,
  Journal, Atelier. La Constellation s'atteint par les présences du Bureau et la palette.
- **N° 68, coût de la conversation absent du Journal** **[choix de rédaction]** : le Journal n'entre
  pas la conversation, donc pas son coût ; il donne le coût de chaque entrée, jamais un total. Le
  seul total de la journée et du mois vit dans Atelier, Dépenses et plafonds, qui compte toutes les
  sources (conversation comprise). Aucun écran n'additionne le Journal, rien ne peut donc le
  contredire.
- **N° 84, formes du détail au téléphone** **[choix de rédaction]** : deux formes, comme au bureau.
  Une carte de la file se déplie sur place ; tout autre détail (un poste, Natsume, une entrée du
  Journal) s'ouvre en feuille par-dessus la page, avec la même fermeture (Replier, voile, retour
  d'Android). La page entière d'un poste du prototype devient une feuille.

## 12. Ce qui change ailleurs

- `lun-docs/design/tokens.css` : `[data-monde='anima']` passe à `--anima` `#6B2D4F` avec
  `--anima-survol` `#7C3A5E`, `--anima-doux`, `--anima-bord`, `--anima-texte` `#E2C3D3` (valeurs du
  prototype) ; `--danger-plein` reste `#7A1818`. Puis régénérer les copies.
- Kit (`lun-docs/design/kit/toasts.svelte.ts`, Toaster) : durée de 5 s pour un toast annulable avec
  décompte affiché, un seul toast à la fois, Ctrl Z à la place de Z, annulation déléguée à une
  fonction fournie (ici le `DELETE` du core). Les satellites suivent à leur prochaine copie.
- `standards/design.md` : les formats du §3 (heures, dates, montants) et la règle de l'or.
- `standards/contrat-satellite.md` : la v1.4 (§9.8), avec son changement de comportement en pause ;
  Lun'Acedia et Lun'Avaritia la servent (changements listés au §9.8).
- Les noms des lieux et les places de l'heptagramme vivent dans une seule donnée de monde côté
  front, avec un test qui charge un monde neutre et vérifie que l'outil reste complet
  **[choix de rédaction]**.

## 13. Ce que ce palier ne doit pas fermer

- **Notifications** (prévues au troisième palier de la spec des apps, absentes de la liste des
  paliers) : à replacer par CrOliX. Le palier 3 leur prépare les adresses du §5 et l'état « vue »
  d'une urgence ; le thème Notifications dit seulement qu'elles ne sont pas activées.
- **Palier 4, Journal** : la table `journal` et ses types stables portent les filtres, la recherche
  plein texte et la pagination par curseur sans nouvelle migration de fond.
- **Paliers 6 à 8, voix, scène, régie** : l'état de Natsume est une seule source dans le core
  (`/api/state`) qu'un avatar, une page Scène ou le relais du PC liront ; le portrait est un
  emplacement remplaçable ; les appareils gardent leur jeton propre, pour recevoir plus tard une
  portée réduite (scène, relais). Rien au palier 3 ne fait tourner du calcul sur le PC ni n'ouvre un
  port local (OBS, VTube Studio).
- **Raccourcis réglables, pause par poste** : la table des touches et la forme `by` de la pause les
  rendent possibles sans refaire les écrans.

## 14. Critères d'acceptation

Vérifiés dans le navigateur à 1440×900, 1280×720 et 390×844 (aucune erreur en console, aucun
défilement horizontal), puis à l'usage sur la recette, gestes réels compris.

**Partout**
- Le même nombre À trancher au menu, au titre de la file, à l'onglet du téléphone, à l'astre de
  Natsume et dans la palette, avant et après un geste, un lot et une annulation.
- E met le focus dans le champ de Natsume sur chaque lieu ; ouvert depuis l'état rangé, le panneau
  prend une hauteur partielle, jamais toute la colonne ; poignée, Agrandir, Restaurer et Ranger
  marchent à la souris et au clavier ; le rechargement remet hauteur et état ; le mot du lieu garde
  sa largeur et sa position de défilement quand le panneau s'ouvre, change de taille ou se range, et
  ce que le panneau couvre s'atteint en faisant défiler le mot.
- Chaque état de la bande se montre par un vrai état du core et dit quoi faire ; aucune bande quand
  tout va bien.
- Aucun texte ne contient « core », une capitale de libellé, « · », « → » dans un bouton ni un
  tiret cadratin ; aucune couleur en dur ; l'or n'apparaît que chez Lun'Avaritia.
- Aucun nom d'agent n'est écrit en dur, ni dans le core ni dans ce que déclarent les postes (« jamais
  Pina ») : avec le réglage du poste vide, aucune ligne Agent ; rempli, son nom paraît dans le
  panneau du poste et l'Atelier.
- Les routes de l'API ne parlent que d'identifiants de satellite (`lunacedia`), les adresses de
  l'app que d'identifiants de monde (`acedia`).
- Ctrl K ouvre la palette ; Échap ferme une couche par appui dans l'ordre du §4.9 ; aucune touche
  ne demande AltGr ni Maj sur un clavier AZERTY.

**Bureau**
- La file entière se tranche sans changer de lieu ; une carte non dépliée n'a pas de Valider ; V
  n'agit ni sur un brouillon, ni sur une question, ni sur une pile.
- Valider, puis Annuler ou Ctrl Z dans les 5 s : rien n'arrive au poste (vérifié dans son front) ;
  sans annulation, le geste y arrive après 5 s, même si l'onglet est fermé entre-temps.
- Un lot de 5 fiches dont une décochée en valide 4, un seul toast, et Annuler les remet toutes.
- Après un geste, le focus est sur le premier geste de la carte suivante.
- `/app/?carte=avaritia:<id>` ouvre la carte dépliée et focalisée.
- La lettre porte sa date et son heure, part à 07:30 même si la veille tourne encore, ne change pas
  dans la journée ; la fin de la veille et une relance ajoutent une correction datée ; une relance
  après un 07:30 en échec écrit la première lettre.
- Un poste coupé : ses cartes restent lisibles, grisées, avec la raison et l'heure de lecture ; le
  Bureau s'affiche sans attendre aucun poste (il ne lit que le cache).
- Une réponse à une question, choisie ou libre, arrive au poste comme `{ answer }`.
- Ce qui vient montre les rendez-vous du jour avec leur heure et les tâches du jour sans heure ;
  aucun rappel d'agenda n'entre dans la file.

**Constellation**
- Chaque monde est à sa place fixe ; un clic dans les présences ouvre le bon poste ; le panneau
  recouvre la colonne avec une ombre, la carte se recentre ; Échap le ferme, rend le focus à l'astre
  et nettoie l'adresse.
- « Voir ses 3 cartes » ouvre la file filtrée ; Réessayer sur un poste injoignable donne son
  résultat.
- Lun'Ira non appairé est « à relier » à sa place ; un poste coupé est injoignable ; un poste en
  pause dans son front, ou en contrat v1.3, est muet ; au démarrage du core, un poste encore jamais
  lu dit « Inconnu ».
- On ne peut rien trancher depuis la Constellation.

**Journal**
- Aujourd'hui, 7 jours et Tout, poste, type et recherche se combinent et vivent dans l'adresse ;
  Retour rend le filtre précédent.
- Une entrée en attente mène à sa carte par « Trancher la carte » ; la chaîne d'une délégation
  montre la demande, le poste et la carte rendue.
- Aucun total de coût n'y figure ; l'historique d'avant la migration y est.

**Atelier**
- Une bascule s'enregistre au clic et le dit ; un champ à Entrée ; Échap remet sa valeur.
- Un plafond baissé sous la dépense affiche sa conséquence, et l'enregistrer met Natsume en pause
  sur tous les lieux et chez chaque poste relié ; le relever lève la pause.
- Délier et Révoquer passent par la bande de confirmation, focus sur Fermer.

**Pause**
- Mettre en pause : la bande paraît partout, les routines sont sautées et notées, chaque poste
  relié reçoit la pause ; une urgence d'un poste entre quand même dans la file ; on peut écrire à
  Natsume et elle peut confier une demande ; une routine en échec ne lève aucune bande.
- Sous la pause du core, Lun'Acedia trie encore par ses règles (une urgence de règle remonte) sans
  appeler le modèle, et Lun'Acedia comme Lun'Avaritia répondent à `/agent` pour une demande et pour
  « C'est fait » ; la boucle de lecture continue, les compteurs restent frais.
- Reprendre lève la pause partout ; une pause posée dans le front d'un poste y reste, et ce poste
  est muet, `/agent` refusé.

**Natsume et hors lieux**
- La fiche s'atteint par le portrait, l'en-tête du téléphone et la palette, jamais par le menu.
- Un appareil révoqué voit l'écran sans donnée à son appel suivant ; un nouvel appareil arrive au
  Bureau.

**Téléphone**
- Barre de conversation sur toutes les pages, feuille qui se ferme au retour d'Android.
- Une entrée du Journal et un poste s'ouvrent en feuille ; une carte se déplie sur place.

## 15. Découpage suggéré

Une PR par tranche, dans cet ordre **[choix de rédaction]** :

1. **Les satellites en v1.4** : Lun'Acedia et Lun'Avaritia (pause du core contre pause locale,
   `/agent` en pause, tri par règles, nom d'agent en réglage, nouveaux champs de carte et
   d'événement, `answer`), plus le texte du contrat.
2. **La boucle de lecture et l'état** : `card_reads`, `post_status`, cache de Ce qui vient, états des
   postes, `GET /api/state`, `GET /api/queue`, `GET /api/upcoming`, `GET /api/posts/:id`.
3. **La table du Journal** : `journal`, `journal_steps`, reprise de l'historique, nouvelles routes,
   retrait de `/api/map`.
4. **Les gestes tenus et l'annulation** : `held_gestures`, routes, relais différé, toast et Ctrl Z
   dans le kit.
5. **Plafonds et pause** : plafond du jour unifié, plafond du mois, réglages par poste, pause et son
   relais, lettre du matin et changement du moteur de routines.
6. **Les lieux** : menu, bande, colonne de Natsume, Bureau, Constellation, Journal, Atelier, fiche,
   téléphone, jeton `--anima`.

## 16. Laissé au constructeur

- Le rendu de l'heptagramme (SVG ou HTML positionné) et le recentrage exact quand un panneau est
  ouvert.
- La forme exacte des réponses des routes nouvelles, le découpage des migrations, et l'endroit où
  vit la table des touches.
- La hauteur par défaut exacte du panneau de conversation, ses bornes et le pas de la poignée, dans
  l'esprit du §4.4.
- La manière dont l'écran apprend l'issue d'un geste tenu (lecture différée ou flux), tant que la
  carte en échec revient avec sa raison.
- Les textes calculés de la lettre, dans le respect du §3 et des exemples du prototype.
- Les largeurs fluides du menu et de la colonne entre 768 et 1280 px.
