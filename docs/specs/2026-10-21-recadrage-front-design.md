# Recadrage front et design : palier Lun'Acedia et pages du core Lun'Anima

> Date : 2026-10-21. Cadré avec CrOliX, sur maquettes validées écran par écran. Découle de l'état des
> lieux fait dans Chrome après le palier « Relier et alerter », de `standards/design.md` et des
> références MyAlfred (myBrain, MIA). Ce qui est marqué **[choix Claude]** est une décision de
> l'agent, à contester librement ; le reste a été dit ou validé par CrOliX.

## 1. Intention

L'état des lieux du front d'Acedia, fait dans Chrome, est sévère. Plusieurs défauts sont visibles :

- des boutons sans hiérarchie, et des Réglages en colonne étroite avec une moitié d'écran vide ;
- un objet de mail tronqué et un corps de mail blanc sur le thème sombre ;
- un agenda en petit serif sans grille horaire ;
- un journal vide ;
- un menu d'édition à moitié caché derrière la lecture, et une zone de lecture figée même sans mail
  ouvert.

CrOliX juge ce rendu « du niveau d'un projet étudiant de 1re année ». Il ne veut plus de vagues de
patchs qui ne règlent rien.

Ce qu'il a demandé :

- **Revoir le fond autant que la forme.** On produit des outils boostés et pilotés par l'IA : le
  front doit être moderne, intuitif, pratique, et permettre de tout contrôler.
- **Des maquettes obligatoires et complètes**, avec les écrans eux-mêmes et le détail des composants
  communs à normaliser.
- **S'inspirer des produits du marché** (Gmail, Google Agenda, les réglages Google) et de ce que les
  bibliothèques apportent.
- **Garder MyAlfred comme référence**, qui « fait bien son taff ».

Le front autonome d'Acedia reste le mode de secours : au quotidien, Acedia se pilote depuis
Lun'Anima. Mais ses vues sont publiées en paquet (`@lun-ecosystem/lunacedia-views`) et seront
reprises dans le panel d'Anima. Leur qualité compte donc pour tout l'écosystème.

## 2. Ce que CrOliX a décidé

### 2.1 La direction artistique : règle B, pour toutes les interfaces

CrOliX a choisi parmi trois variantes (planche `02-da-commune.html`) : « B me convient et devra
suivre sur toutes les interfaces de chaque projet ».

- **Le socle est commun.** Les surfaces et le texte viennent de l'identité Lun' : encre, encre 2,
  ivoire, lune. Ils sont identiques dans Acedia, dans Anima et dans les futurs satellites.
- **Le monde n'est qu'un accent.** La couleur du projet sert pour l'action principale, la sélection,
  le point de marque et le halo des pages seules. Elle ne teinte plus les surfaces : le « fond du
  monde » (`#070C14` pour Acedia, `#120A0A` pour Anima) ne sert plus de fond d'application.
- **Le rouge d'Anima ne sert jamais en texte**, seulement en fond et en point de marque. Une erreur
  (`--danger`) reste ainsi reconnaissable.

### 2.2 Les maquettes validées

Elles sont versionnées dans `docs/maquettes/2026-10-21-recadrage-front/`. Ce sont des pages HTML
statiques ; les annotations jaunes ne font pas partie des écrans. Chaque planche montre la vue bureau
et la vue mobile.

| Planche | Contenu | Validée |
|---|---|---|
| `02-da-commune.html` | Trois variantes de DA, choix B | oui |
| `03-mail.html` | Réception, mail ouvert avec menu « Ranger dans », mobile | oui, « adaptée à l'état actuel du MVP » |
| `04-a-valider.html` | File des propositions de l'IA, file vide, mobile | oui |
| `05-agenda.html` | Semaine, tâches, création ou modification, mobile | oui |
| `06-reglages.html` | Tri par l'IA, boîtes et règles, appareils, mobile | oui |
| `07-journal.html` | Journal du tri, journal vide, mobile | oui |
| `08-appairage.html` | Relier ce navigateur, autoriser une application, mobile | oui |
| `09-core.html` | Accueil du core et page de retour (Lun'Anima) | oui, avec les recommandations |
| `10-composants-b.html` | Briques communes, jetons B | dernière planche, présentée avec la série |

La planche 10 reprend la planche 1, validée « globalement », avec seulement les couleurs B. Les
maquettes font foi pour la mise en page, la hiérarchie et les états. Le texte qu'elles contiennent est
un brouillon (voir §6).

**Écart permis, et un seul [choix Claude].** Un élément dessiné sur une planche, mais classé hors
palier au §8, ou absent des données et non listé au §2.4, est retiré de l'écran sans autre
validation. Par exemple : « Plus tard », le lien d'une tâche vers son mail, la dernière activité
d'un appareil. Tout autre écart à une planche demande l'accord de CrOliX.

### 2.3 Décisions prises écran par écran

**Mail**

- La lecture n'existe que si un mail est ouvert. Sans mail ouvert, la liste prend toute la largeur.
- Les trois états de l'IA sont distincts sur chaque ligne :
  - proposé, à valider sur place ;
  - rangé seul, annulable ;
  - rien trouvé.
- Les actions sur une ligne apparaissent au survol. Une barre d'actions groupées apparaît quand des
  mails sont cochés.
- Le menu « Ranger dans » flotte au-dessus de tout, avec un filtre au clavier et le choix de l'IA en
  tête.
- La barre de lecture n'a qu'une action principale : Répondre.
- Le corps du mail est adapté au thème sombre.
- L'état du service est toujours visible en bas du rail : tri actif, en pause, ou clé refusée.

**À valider**

- Les propositions sont groupées par boîte proposée, avec une validation par lot.
- Un bouton « Tout valider au-dessus de N % » prend toutes les propositions au-dessus d'un seuil.
- Chaque action s'annule par un toast ou par la touche Z.
- La file vide résume l'activité du jour.
- Le menu « Corriger » contient une case « Retenir pour cet expéditeur », **décochée par défaut** :
  cochée, elle crée une règle.
- Le seuil de « Tout valider » est **réglable**.

**Agenda et tâches**

- Une vraie grille horaire, avec la ligne de l'heure courante.
- Les chevauchements s'affichent côte à côte.
- Les journées entières et les tâches sont dans un bandeau au-dessus de la grille.
- Un clic sur un événement ouvre une bulle de détail.
- Les tâches ont leur propre page, groupée par échéance, avec un ajout en une ligne.
- Une seule fenêtre sert à créer ou modifier un événement ou une tâche.
- Sur mobile, la vue Planning est la vue par défaut.
- La vue Mois reprend l'habillage de la semaine.

**Réglages**

- Une colonne de thèmes à gauche et un contenu centré, en cartes faites de lignes : libellé, aide,
  contrôle.
- Chaque carte montre l'état d'abord, puis les actions.
- Les deux seuils sont des curseurs, avec une échelle explicative.
- Boîtes et règles sont réunies sur une même page.
- Les règles se lisent et se créent comme des phrases.
- L'ordre des règles se modifie : le serveur le gère déjà (`position`, accepté par la mise à jour
  d'une règle). **[choix Claude]** Glisser par la poignée, plus « Monter » et « Descendre » dans le
  menu de la règle, pour le clavier.
- « Ignorée » remplace « Aucun » pour une étiquette que l'IA ne doit pas utiliser.
- Retirer un appareil, une application ou la clé passe par une fenêtre de confirmation de l'app,
  jamais par une alerte du navigateur.
- Un problème s'affiche en bannière en haut de la page concernée.

**Journal**

- Les lignes sont groupées par jour.
- L'origine se lit à l'icône : IA ou règle.
- Des filtres : Tout, IA, Règles, Annulés.
- Deux actions par ligne : ouvrir le mail et annuler.
- Une annulation refusée s'explique sous sa propre ligne.

**Appairage et autorisation**

- Seule la forme change : mêmes codes, mêmes étapes, mêmes droits.
- La saisie du code se fait dans une case par chiffre ; le collage est accepté.
- La page dit où trouver le code.
- Quand une application attend, les étapes sont affichées.
- L'autorisation se présente comme un consentement Google.
- Le code est affiché groupé par trois partout.
- La simplification de l'appairage reste un palier à part.

**Pages du core d'Anima**

- Elles restent sans script ni formulaire, sous la même politique de sécurité.
- L'accueil montre l'état et la version, puis deux étapes numérotées.
- La page de retour d'une liaison a trois cas : terminée, interrompue, adresse inconnue.
- « Lun'Acedia est relié » ne s'affiche que si le core connaît déjà le nom du satellite. Sinon, la
  page dit « Le satellite est relié ».

### 2.4 Les changements de fond retenus

Le palier refait surtout la forme. Voici ce qui touche aux données ou au serveur, tout validé :

1. **Le « pourquoi » de l'IA.** Le classifieur renvoie une courte justification, en une phrase,
   affichée dans la carte de proposition et dans la file À valider. Elle est stockée avec la
   proposition et exposée par l'API des mails.
2. **Un second seuil réglable**, celui de « Tout valider ». Il est enregistré avec le seuil
   d'auto-rangement et modifiable dans Réglages.
3. **Le bilan du jour.** L'API donne le nombre de mails rangés seuls, validés et corrigés aujourd'hui.
   La file À valider vide l'affiche.
4. **« Retenir pour cet expéditeur »** crée une règle sur l'expéditeur au moment d'une correction.
5. **Le rôle « Ignorée »** remplace le libellé « Aucun » à l'écran. La donnée ne change pas.
6. **Bug d'encodage des mails.** Il produit par exemple « Envoy家 該 partir de » pour
   « Envoyé à partir de ». Il est corrigé dans ce palier, cause trouvée et test de non-régression
   compris.
7. **Bug des événements en double au changement d'heure** dans l'agenda : corrigé dans ce palier.
8. **La vraie annulation des actions de l'utilisateur**, décidée par CrOliX après la relecture.
   Aujourd'hui, seules les actions automatiques (IA, règle) sont journalisées et annulables. Le
   serveur journalise aussi désormais :
   - valider et corriger une proposition ;
   - ranger, archiver, mettre à la corbeille ou en spam un mail.

   « Annuler » remet le mail dans son état d'avant. Pour une proposition, elle revient en attente
   dans la file À valider, et l'exemple appris par l'IA est oublié. Le journal montre ces actions
   avec une troisième origine, « à la main » (voix neutre, §6). Le changement de l'API est reporté dans le contrat satellite
   s'il touche une route du contrat.

Hors palier (§8) : le lien d'une tâche vers son mail d'origine, le glisser-déposer des événements,
la fonction « Plus tard » et la simplification de l'appairage.

## 3. Le socle technique

Les choix de bibliothèques ont été proposés à CrOliX pendant le cadrage. Les versions ont été
vérifiées sur npm le 2026-10-21.

| Besoin | Choix | Pourquoi |
|---|---|---|
| Comportements : menu, liste déroulante, bulle, dialogue, info-bulle, onglets, palette de commandes, sélecteur de date, curseur, bascule, case | **Bits UI** 2.20 (MIT, sans style, Svelte 5 ; dépendance `@internationalized/date`) | Accessibilité, clavier et calques déjà réglés : les menus passent par un calque au-dessus de la page, ce qui supprime le défaut du menu caché |
| Icônes | **`@lucide/svelte`** 1.61 (ISC) | Jeu complet et cohérent, trait fin proche des maquettes |
| Grille d'agenda | **FullCalendar 7** (paquet `fullcalendar` 7.1.3, MIT), vues semaine, jour, mois et liste, monté dans un composant Svelte | Chevauchements, ligne de l'heure, journées entières, bien maintenu ; habillé par nos jetons. **[choix Claude]** : Schedule-X est écarté, son adaptateur Svelte n'a pas bougé depuis 2025 et vise une ancienne version de son cœur |
| Style | **Nos jetons CSS**, sans Tailwind ni bibliothèque de composants stylés | Garder l'identité Lun' ; Bits UI ne fournit que le comportement |

Garde-fou sur FullCalendar **[choix Claude]** : la première tâche d'agenda du plan l'habille d'abord
aux couleurs B, avant de câbler les données. Si la ligne de l'heure, le bandeau des tâches ou les
couleurs par agenda ne se règlent pas proprement, on garde la grille actuelle, refaite à la main
selon la planche 5. Cet arbitrage est noté dans le plan, sans revenir vers CrOliX.

### 3.1 Un fichier de jetons unique

- La référence est `lun-docs/design/tokens.css`. Elle déclare le socle (surfaces, texte, bordures,
  tons, IA, rayons, ombres, polices) et le bloc d'accent de chaque monde, sous un attribut
  `data-monde="acedia"` ou `data-monde="anima"`.
- **[choix Claude]** L'attribut `data-monde` se pose sur la racine de chaque vue, pas sur la page.
  Une vue d'Acedia reprise dans le panel d'Anima garde donc son accent bleu : c'est le sens de la
  règle B (« reconnaissable par sa couleur de monde », surfaces communes). Le paquet de vues continue
  d'exporter ses jetons par `./styles.css`, désormais copie du fichier de référence.
- Les valeurs sont celles de la planche 10.
- **[choix Claude]** Chaque dépôt garde une copie générée de ce fichier, avec un en-tête « ne pas
  modifier ici ». Un outil de lun-docs, sur le modèle de `sync-standards.mjs --check`, vérifie en CI
  que la copie est identique à la référence.
- Les composants n'écrivent **aucune couleur en dur**. Une vérification automatique le contrôle dans
  `views/` et `app/`, sauf dans le fichier de jetons.

### 3.2 Le corps du mail

- L'isolement reste celui d'aujourd'hui : une frame sans script, sans accès à la page, sous une
  politique de sécurité posée par le serveur.
- **[choix Claude]** Pour l'adaptation au thème sombre :
  - Un mail en texte, ou en HTML peu stylé, prend les couleurs du thème grâce à une feuille de style
    injectée dans le document de la frame.
  - Un mail mis en page, avec des fonds et des couleurs à lui (lettre d'information, facture riche),
    garde ses couleurs. Il s'affiche sur une carte claire « papier » aux bords arrondis, dans
    l'interface sombre, au lieu d'un bloc blanc plein cadre.
  - La règle qui sépare les deux cas est décidée et testée dans le plan.

### 3.3 Le catalogue des composants

Une page de développement liste chaque composant commun dans tous ses états : normal, survol,
focus, désactivé, erreur, chargement, vide. Elle n'est pas servie en production. C'est elle qu'on
vérifie dans Chrome et dont on joint les captures aux PR. **[choix Claude]** Elle vit dans
l'application d'Acedia et n'est servie que par le serveur de développement de Vite.

## 4. Les composants à normaliser

Ils sont décrits en détail dans la planche 10. Chaque écran ne s'assemble qu'avec eux.

- **Jetons** : couleurs B, échelle typographique, rayons, ombres, espacements, hauteurs, mouvement.
- **Boutons** :
  - cinq niveaux : principal, doux, secondaire, fantôme, danger ;
  - trois tailles et la variante icône seule ;
  - une seule action principale par zone.
- **Champs** :
  - texte, avec libellé au-dessus, aide en dessous et l'erreur à la place de l'aide ;
  - liste déroulante, curseur avec sa valeur, date, bascule, case, commande segmentée ;
  - saisie de code (une case par chiffre).
- **L'IA** :
  - pastille de proposition compacte (validation sur place) et carte de proposition complète
    (confiance, pourquoi, actions) ;
  - marque « rangé seul » ;
  - ton IA dédié (violet).
- **Calques** :
  - menus avec filtre et raccourcis, bulle de détail, info-bulle ;
  - fenêtre de dialogue et fenêtre de confirmation ;
  - toast avec annulation, bannière d'état.
- **Structures** :
  - rangée de liste avec actions au survol, groupe par jour ;
  - carte de réglages faite de lignes ;
  - état vide qui explique, squelette de chargement, pastilles de filtre, badge d'état.
- **Navigation** :
  - rail avec groupes, compteurs et carte d'état du service ;
  - colonne de thèmes des Réglages, onglets ;
  - palette de commandes (Ctrl K) ;
  - barre de navigation mobile et bouton flottant.
- **Pages seules** : carte centrée sur fond encre avec halo du monde, et indicateur d'étapes.

## 5. Le comportement commun

- **Le clavier d'abord.** Les raccourcis des planches font partie du palier :
  - Mail : J, K, Entrée, Échap, V, C, R, E, #, X ;
  - À valider : J, K, V, C, Maj+V, Z ;
  - Agenda : T, J, K, D, W, M, A, C ;
  - partout : Ctrl K pour ouvrir la palette de commandes.
- **Tout s'annule, pour de vrai** (§2.4, point 8). Une action de tri ou de rangement affiche un
  toast « Annuler » pendant quelques secondes. L'annulation passe par le serveur, et reste possible
  ensuite depuis le journal. Ce qui coupe un accès passe par une confirmation.
- **Des états honnêtes.** Chargement, vide et erreur ont chacun un rendu prévu. Un état affiché
  correspond à la réalité, selon `design.md`.
- **Mobile.**
  - Sous 768 px **[choix Claude]**, la mise en page bascule : navigation en bas, liste et lecture en
    deux écrans, bouton flottant pour l'action principale, filtres en pastilles qui défilent.
  - Les gestes de balayage (archiver, valider, annuler) s'ajoutent aux boutons et ne les remplacent
    jamais.
- **Accessibilité.**
  - Les contrastes respectent WCAG AA (calculés sur la planche 10).
  - Le focus est visible.
  - Les calques suivent les rôles ARIA fournis par Bits UI.

## 6. Les textes

- Les textes suivent `design.md` : **voix technique neutre**, sans « tu », phrases courtes.
- **[choix Claude]** Les maquettes tutoient par endroits (« ton seuil », « Saisis le code ») : le
  standard l'emporte, et ces textes sont réécrits au neutre. Par exemple : « 3 propositions sous le
  seuil de 95 % », « Saisir le code à 6 chiffres ».
- La typographie française s'applique : apostrophe ’ dans les textes, mais « Lun'Xxx » avec une
  apostrophe droite, et pas de tiret cadratin.
- Les dates sont à la française et en minuscules : « 19 – 25 octobre 2026 », « mer. 21 oct. ».
- Le front autonome d'Acedia **ne parle jamais d'Anima**. « Lun'Anima » n'y apparaît que comme une
  donnée : le nom d'une application reliée, ou celle qui demande l'accès.

## 7. Le standard `design.md`

Il est mis à jour dans ce palier :

- la règle B (socle commun, accent du monde) ;
- le rouge d'Anima jamais en texte ;
- le fichier de jetons unique et sa vérification ;
- la liste des composants communs ;
- les bibliothèques retenues ;
- le catalogue vérifié dans Chrome avant chaque PR de front.

Le tableau des couleurs « monde » garde les fonds pour identifier un projet, sur une tuile du panel
par exemple, mais plus comme fond d'application. La copie du standard dans le plugin est régénérée
par `sync-standards.mjs`.

## 8. Hors palier

- La simplification de l'appairage (moins de codes, bouton de liaison, accueil du core) : palier
  dédié, déjà prévu.
- Le lien d'une tâche vers son mail d'origine, absent des données.
- Le glisser-déposer des événements dans l'agenda.
- « Plus tard » : mettre un mail en attente jusqu'à une date.
- Le panel d'Anima (chat, vues des satellites).
- Un thème clair.
- La dernière activité d'un appareil, que le serveur ne fournit pas : seule la date de liaison
  s'affiche.

## 9. Ce qui ferait échouer le palier, même si tout marche

- Un écran qui s'écarte de sa planche sans que CrOliX l'ait validé.
- Une couleur écrite en dur, ou un composant refait localement au lieu de la brique commune.
- Un menu ou une bulle coupé par un conteneur, ou une alerte native du navigateur.
- Un écran livré sans vérification dans Chrome, en largeur bureau et en largeur mobile.
- Des corrections empilées en vagues après la livraison : chaque écran est terminé contre sa planche
  avant de passer au suivant.

**Validation écran par écran**, décidée par CrOliX. Chaque écran (le catalogue des composants
compte comme le premier) est vérifié dans Chrome contre sa planche, en bureau et en mobile. Les
captures sont envoyées à CrOliX, et l'écran suivant ne commence qu'après son accord. Le plan
ordonne les écrans en étapes séparées par ces arrêts. Il reste une seule branche et une seule PR
par dépôt.

## 10. Critères de réussite

1. Le fichier de jetons de lun-docs existe, ses copies sont vérifiées en CI, et aucune couleur n'est
   écrite en dur dans les fronts.
2. Le catalogue montre chaque composant du §4 dans ses états. Il est vérifié dans Chrome, et ses
   captures sont dans la PR.
3. Chaque écran des planches 3 à 8 est conforme à sa planche, en bureau et en mobile. Les captures
   d'écran sont jointes à la PR d'Acedia.
4. Les pages du core sont conformes à la planche 9, et la politique de sécurité est inchangée
   (vérifiée par test).
5. Les changements de fond du §2.4 sont couverts par des tests, et l'API reste conforme au contrat
   satellite.
6. Les deux bugs (encodage, doublons au changement d'heure) ont un test qui échouait avant la
   correction.
7. `design.md` est à jour, et la copie du plugin est régénérée.
8. Chaque écran a été validé par CrOliX au fil de l'eau. Une recette finale dans Chrome, sur le
   compte Google de test, clôt le palier.
9. Toute action de l'utilisateur montrée annulable s'annule par le serveur, avec un test par type
   d'action.

## 11. Contraintes

- La stack est inchangée : Svelte 5, Vite, TypeScript strict, Vitest, avec les barrières qualité de
  `stack.md`. Les nouvelles dépendances sont celles du §3, et aucune autre sans le noter dans le
  plan.
- La sécurité est inchangée :
  - une clé n'est jamais montrée en entier (4 derniers caractères) ;
  - les dépôts publics ne contiennent ni secret, ni adresse réelle, ni adresse interne ;
  - les tests utilisent un compte Google de test, jamais le vrai compte ;
  - les pages du core restent sans script.
- Git : une branche et une PR par dépôt (lun-docs, lun-acedia, lun-anima), Conventional Commits en
  anglais, PR en français. Seul CrOliX fusionne.

## 12. Laissé au builder

- Le découpage des composants en fichiers, et l'emplacement exact de la page catalogue.
- La forme de la justification dans la sortie du classifieur, sa longueur maximale et son stockage.
- Le format du bilan du jour dans l'API.
- La règle qui sépare un mail « peu stylé » d'un mail « mis en page » (§3.2), à tester sur des
  échantillons.
- La durée d'affichage des toasts.
- Le mécanisme exact de copie et de vérification du fichier de jetons, tant qu'il suit le §3.1.
