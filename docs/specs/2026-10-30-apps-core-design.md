# Apps du core : mobile et desktop

> Spec de cadrage rédigée le 2026-10-30 pour le chantier 6 de la
> [spec de liaison core ↔ satellites](2026-10-27-liaison-core-satellites-design.md) (« Apps du core :
> mobile d'abord, puis desktop »), après un échange avec CrOliX et deux planches de maquettes
> ([`docs/maquettes/2026-10-30-apps-core/`](../maquettes/2026-10-30-apps-core/)). Ce qui est marqué
> **[choix Claude]** est une décision prise par l'agent, à contester librement ; tout le reste a été
> dit ou validé par CrOliX.

## 1. Intention

L'app du core est le **poste de pilotage** de l'écosystème. Sa fonction première n'est pas la
conversation, comme chez Claude ou Gemini, mais **le pilotage et la décision assistée par l'IA** :
voir ce qui attend, valider ce que les postes ont préparé, savoir si tout tourne, régler.

- **Mobile** : une version de poche de l'accès complet core + satellites, au minimum vital. De 9 h à
  17 h, CrOliX est loin de son PC fixe ; le mobile compense. Tout ce que fait le core aujourd'hui y est,
  sauf ce qui est propre au desktop.
- **Desktop** : l'usage premier y sera la **voix** (chantier 7) : Natsume entend, comprend et croise
  la perception de l'instant, la mémoire vive, la recherche et les satellites. L'app y sert au
  **contrôle et au secours** : consulter et valider les traitements. Elle n'est pas pour autant
  secondaire.

Les deux sont **conçues ensemble**, pour qu'elles ne divergent ni en comportement ni en design. Le
mobile est construit en premier, sur des composants déjà pensés pour le desktop.

## 2. L'état de départ

- Le core n'a **aucun écran** en dehors de sa page d'accueil publique (`GET /`, version et commandes).
  Tout passe par le terminal (`npm run chat`, `pair-code`, `clients`, `revoke`, `connect`,
  `set-key`, `night`, `morning`) et par le `.env`.
- **L'API des apps existe** (`README.md` de lun-anima) : appairage par code, santé, postes, actions
  relayées, événements, fils et messages en SSE, cartes en attente avec accept et refuse, coûts,
  lancement des routines. Les réglages (plafonds, modèle, longueur des réponses) n'ont pas de route :
  ils vivent dans le `.env`.
- **Le kit de front** (`lib/ui`, Svelte 5, Bits UI, Lucide, jetons) existe dans Lun'Acedia et
  Lun'Avaritia, copié et déjà divergent (lun-docs#43).
- **Aucune notification** n'atteint un appareil. Le standard [`notifications.md`](../../standards/notifications.md)
  fixe les paliers P0 à P4 et leur rendu, sans implémentation.
- Les dossiers `ui/`, `desktop/` et `mobile/` prévus par l'ADR 0002 n'existent pas.

## 3. Ce que fait le chantier

### 3.1 Une seule app, servie par le core

- **Un seul front Svelte 5** dans le workspace `ui/` de lun-anima, servi par le core sous `/app`
  **[choix Claude]**. La mise en page s'adapte au seul seuil du standard, 768 px.
- **Mobile : une PWA installable depuis Chrome sur Android**, à la place de Capacitor (validé par
  CrOliX après comparaison, ADR 0007). Raisons : aucune chaîne Android à installer, aucun projet
  Firebase ni clé de compte de service Google, une mise à jour du core met l'app à jour, et les
  notifications Web Push d'Android suffisent aux paliers du standard. Limite acceptée : un P0 sonne
  et vibre, mais ne perce pas le mode Ne pas déranger. Capacitor reste la porte de sortie si une
  limite réelle se montre (P0 en alarme, empreinte digitale, coffre-fort du jeton, arrière-plan) ; le
  front ne change pas, seul l'emballage.
- **Desktop : la même app** dans le navigateur ou installée en PWA. La coque Tauri 2 de l'ADR 0002
  arrive avec la voix et les capacités PC, au chantier 7.
- **Accès** : au MVP, le téléphone teste sur le **même réseau** que le core. L'accès depuis
  l'extérieur (9 h à 17 h) viendra avec la liaison NAS, après le MVP ; CrOliX n'a pas de raison
  d'utiliser le mobile avant. Une PWA demande un contexte sûr (HTTPS) : en local, le constructeur
  choisit le moyen le plus simple (voir §9).
- **Exposition au réseau local** **[choix Claude]** : le core n'écoute hors de `127.0.0.1` que si
  `HOST` le dit. Dans ce cas, l'app n'est servie qu'en **HTTPS** (certificat local) : ni le jeton
  d'appareil, ni une clé saisie dans Écosystème ne passent en clair. Toutes les routes gardent le
  jeton d'appareil ; un appareil révoqué est refusé à l'appel suivant.
- **Appairage** : l'app demande le code à 6 chiffres du core (`pair-code`) au premier lancement et
  garde son jeton d'appareil. Écran « page seule » du kit (carte centrée sur fond encre).

### 3.2 La navigation

**Quatre sections, pas une de plus** (limite fixée par CrOliX) :

| Section | Question à laquelle elle répond |
|---|---|
| **Accueil** | Qu'est-ce qui m'attend, et est-ce que tout tourne ? |
| **À valider** | Qu'est-ce que les postes ont préparé pour moi ? |
| **Journal** | Qu'est-ce qui a été fait, par qui, quand ? **[choix Claude]** |
| **Écosystème** | Combien ça coûte, et comment je le règle ? |

Desktop : la colonne de Natsume à gauche (§3.3) ; à droite, une barre haute porte les quatre
sections, la recherche et la palette de commandes (Ctrl K), et le lanceur des postes. Pas de rail de
satellite : la gauche est à Natsume **[choix Claude]**. Mobile : la barre de navigation du kit en bas,
avec compteur sur À valider.

### 3.3 Natsume, au centre du core

Le core n'est pas un satellite de plus. Dans un satellite, le travail (les mails, les fiches) tient le
centre et l'agent aide depuis un coin ; dans le core, **Natsume tient le centre et l'écosystème est
autour d'elle** (cadrage revu avec CrOliX le 2026-10-30). Les deux appareils n'ont pas le même rôle :

- **Desktop : l'environnement complet de Natsume, et celui par défaut** (le PC est au réseau du NAS).
  Une colonne de Natsume, à gauche, **sur toutes les sections** : sa présence en tête (nom, état,
  phrase du jour), puis la conversation, attachée et non dans une bulle. La place de la présence est
  celle que prendront l'avatar, la voix et plus tard le stream (chantier 7), sans refaire l'écran. Le
  reste de la largeur montre la section. La colonne se replie (Ctrl J) pour qui veut toute la place.
- **Mobile : la version compagnon, le strict nécessaire.** Ni avatar ni voix : Natsume est présente
  par ses mots, avec son contexte et sa mémoire. Une barre « Écrire à Natsume » se tient au-dessus de
  la barre de navigation, sur tous les écrans ; elle ouvre une **feuille** qui monte par-dessus
  l'écran en cours. Le **micro du téléphone** y est à portée : c'est la dictée d'Android, qui donne du
  texte ; rien n'est transcrit par le core avant le chantier 7 **[choix Claude]**.
- **Son état** se lit en un mot à côté de son nom : à l'écoute, réfléchit, en pause (plafond atteint,
  clé absente). Le seul mouvement voulu de l'app est celui de ce point d'état. Son **humeur**
  viendra avec sa personnalité, au chantier 7 : le core ne la tient pas encore **[choix Claude]**.
- **Contenu** : le fil principal par défaut, et les sujets accessibles depuis la conversation. Les
  cartes d'une délégation s'affichent dans le fil, avec leurs actions, à la couleur de leur poste.

### 3.4 L'accueil

L'écran d'ouverture, et le point névralgique de la navigation. Il structure la prise d'information
**sans passer par le chat** : pas de session à ouvrir ni d'appel au modèle pour savoir si un mail
urgent attend.

- **Il s'ouvre sans aucun appel au modèle** et **sans attendre un poste lent** : ce que le core a en
  base (événements, routines, dépense, état) s'affiche tout de suite ; la part de chaque poste
  (cartes, échéances) se charge à côté, bloc par bloc, avec un squelette puis « Lun'Xxx ne répond
  pas » s'il tarde **[choix Claude]**.
- **Ce qu'elle t'apporte** : l'accueil est le briefing de Natsume, pas un tableau de bord. Au
  desktop, il occupe la largeur à côté de sa colonne ; au mobile, il est l'écran.
- **La journée** : la date en titre, et une ligne dans la voix de Natsume. La routine de 7 h 30 l'écrit
  dans **le même appel** que le contexte chaud (un champ court de plus dans sa réponse) et la garde à
  côté ; sans elle, l'accueil n'affiche que la date **[choix Claude]**.
- **À traiter** : une seule liste, de la plus pressante à la plus ancienne. D'abord les urgences
  (P0), puis les échéances ouvertes, puis les cartes en attente. Chaque ligne porte une action directe
  **[choix Claude]** :
  - une carte : son accept ou son refuse, relayés tels quels (Envoyer, Valider, Ajouter) ; Trancher
    ou Modifier ouvrent son détail ;
  - une échéance : « C'est fait » confie « c'est fait : <le fait> » à Lun'Avaritia, comme une demande
    à Natsume, et la carte de remplacement suit le chemin habituel ; « Plus tard » la masque de
    l'accueil jusqu'au lendemain, côté core, sans toucher Avaritia ;
  - une urgence : « Vu » la retire de l'accueil (voir le cycle d'une alerte, §3.8).
- **Ce qui circule** : les dernières délégations de Natsume, en une ligne chacune (« J'ai demandé à
  Pina … », et ce qui en est revenu). C'est le trafic réel du pont entre les postes **[choix Claude]**.
- **À côté** : la nuit et le matin (veille, point du matin, leur résultat en une ligne), l'état des
  postes, la dépense du jour face au plafond, l'échéance de la clé.
- **La couleur dit d'où vient la chose** : chaque ligne, carte ou bandeau porte `data-monde` de son
  poste. Le filet, le nom du poste et le bouton principal prennent l'accent du monde : bleu
  Lun'Acedia, or Lun'Avaritia, rouge Lun'Anima (jamais en texte, règle B).
- **Point ouvert** : la disposition des blocs est à valider sur la planche
  [`05-accueil-centre.html`](../maquettes/2026-10-30-apps-core/05-accueil-centre.html) (§10).

### 3.5 À valider

Toutes les cartes en attente des postes reliés (`GET /api/cards`), groupées par poste, à la couleur
de chacun. Accepter ou refuser se relaie tel quel ; un poste injoignable est nommé sans faire échouer
la liste. Une carte qui demande plus que « oui ou non » (modifier un brouillon) s'ouvre en détail.
L'ergonomie de validation en série reprend celle de Lun'Avaritia (raccourcis au desktop).

### 3.6 Journal

Ce qui a été traité, du plus récent au plus ancien, groupé par jour : passages des routines,
cartes validées ou refusées, alertes passées, événements P3 et P4 **[choix Claude]**. Filtre par poste.
Lecture seule. Le core **note désormais chaque geste qu'il relaie** (carte, poste, geste, heure) ; une
carte décidée dans le front d'un satellite n'y paraît que par ses événements.

### 3.7 Écosystème

Tout ce qui se règle aujourd'hui dans le terminal ou le `.env` du core. Les réglages propres à un
satellite restent dans son front, ouvert depuis la ligne du poste.

| Thème | Contenu | Remplace |
|---|---|---|
| **Postes** | état, rôle, dernier contact, ouvrir son front ; relier un poste (adresse puis code) | `npm run connect` |
| **Dépenses et plafonds** | sept derniers jours ; plafond de la conversation et des routines, modifiables | `CHAT_DAILY_CAP_USD`, `NIGHT_DAILY_CAP_USD` |
| **Modèle et clé** | état et échéance de la clé, la remplacer ; modèle ; longueur maximale d'une réponse | `npm run set-key`, `OPENAI_CHAT_MODEL`, `CHAT_MAX_OUTPUT_TOKENS` |
| **Routines** | veille de 5 h et point de 7 h 30 : dernier passage, résultat, lancer maintenant | `npm run night`, `npm run morning` |
| **Appareils** | appareils appairés, révoquer ; appairer un appareil (code de 10 minutes) | `pair-code`, `clients`, `revoke` |
| **Notifications** | activées ou non, appareil par appareil | nouveau |

Desktop : une colonne de thèmes, chaque thème est une carte de lignes (kit : carte de réglages). Mobile :
la liste des thèmes avec leur état en une ligne, puis le thème ouvert avec les mêmes lignes.

Un réglage modifié dans l'app s'applique sans redémarrer le core. Le `.env` donne la valeur de
départ ; une valeur posée dans l'app l'emporte, comme la clé de `set-key` aujourd'hui **[choix
Claude]**. La clé saisie n'est jamais réaffichée.

### 3.8 Les alertes et leur rendu

Le satellite fixe le palier, le core fixe le rendu ([`notifications.md`](../../standards/notifications.md)).

**Les sources** :

| Événement | Source | Palier |
|---|---|---|
| Rappel d'agenda (`agenda.reminder`) | Lun'Acedia | P0 |
| Mail urgent selon une règle de CrOliX (`mail.new`) | Lun'Acedia | P0 |
| Mail jugé urgent par le tri, sans règle | Lun'Acedia | P1, jamais P0 |
| Carte à valider issue d'une demande | tout poste | P1 |
| Accès qui s'arrête : autorisation Google, clé refusée | tout poste, core | P1 |
| Clé qui expire | tout poste, core | P1 à J-3, P2 à J-14 |
| **Point du matin posté** | core, **à créer** | P1 **[choix Claude]** |
| **Routine en échec** | core, **à créer** | P1 |
| **Poste injoignable** | core, **à créer** | P1 |
| **Plafond du jour atteint** | core, **à créer** | P1 |
| Tri ou fiches à valider, question du cerveau | Lun'Acedia, Lun'Avaritia | P2 |
| Échéance du jour | Lun'Avaritia | P2, en tête du point |
| Ce qui s'est fait seul | Lun'Acedia, Lun'Avaritia | P3 |
| État technique | tous | P4 |

**Le rendu** :

| Palier | Téléphone | Desktop | Dans l'app |
|---|---|---|---|
| P0 | notification en haut de l'écran, son et vibration, actions directes | notification système avec son ; app au premier plan : bandeau qui reste jusqu'au geste | bloc Urgent en tête de l'accueil |
| P1 | notification silencieuse, regroupée (« 3 cartes à valider ») | bandeau discret qui s'efface ; app fermée : notification silencieuse | À traiter, compteur de À valider |
| P2 | rien | rien | compteur et ligne de l'accueil |
| P3 | rien | rien | point du matin, Journal |
| P4 | rien | rien | Journal |

- **Une seule file** dans le core ; regroupement, « une seule fois » et pas de chevauchement, comme le
  dit le standard.
- **Le cycle d'une alerte** **[choix Claude]** : le core garde pour chaque alerte P0 ou P1 son état
  « vue ». Elle est vue quand CrOliX l'ouvre, touche « Vu », ou fait le geste qu'elle demande (la
  carte liée acceptée ou refusée). Une alerte vue quitte l'accueil et le bandeau, et sa notification
  est retirée de tous les appareils. Une urgence non vue reste en tête de l'accueil jusqu'à la fin de
  la journée de Natsume, puis passe au Journal.
- **App au premier plan** : un bandeau dans l'app à la couleur du poste, pas de notification système
  **[choix Claude]**.
- **Sans modes** au chantier 6 : focus, silence et nuit arrivent au chantier 7 avec la voix ; un P0
  y sera dit par Natsume.

### 3.9 Le catalogue des postes

L'app du core **n'embarque aucun écran d'un satellite**, pas même un morceau (décision de CrOliX) :
pour lire un mail ou ouvrir une fiche, elle **ouvre le front du poste, au bon endroit**. C'est le rôle
de portail que le desktop devait déjà jouer, tenu aussi par le mobile.

- **Un lanceur, pas une section** : au desktop, un bouton « Postes » dans la barre haute ; au mobile, une
  icône en haut à droite qui ouvre les postes en tuiles. Chaque poste porte son monde, son rôle, son
  état et ce qui attend chez lui.
- **Un lien profond** : une carte ou une alerte peut dire où elle vit dans le front de son poste.
  « Ouvrir le mail » ouvre Lun'Acedia sur ce mail ; « Voir la fiche » ouvre Lun'Avaritia sur la fiche.
  Sans lien, le bouton ouvre l'accueil du front.
- **Une adresse de front par poste**, joignable depuis l'appareil (réseau local au MVP, Tailscale
  ensuite), réglée dans Écosystème > Postes. Sans elle, le poste reste dans le catalogue sans bouton
  d'ouverture.
- **Un appairage par appareil** : la première fois, le front du poste demande son propre code sur cet
  appareil, comme aujourd'hui, puis garde son jeton.
- **Rien du core dans le front** : le satellite ne sait pas d'où l'on vient. Au téléphone, le bouton
  retour ramène à Lun'Anima ; le front n'a aucun lien vers le core.

## 4. Les frontières

- Le core ne réimplémente aucun écran de satellite : il relaie ses cartes et ouvre son front.
- Le front public d'un satellite ne change pas et ne montre toujours rien du core.
- Aucune donnée n'est stockée côté app en dehors du jeton d'appareil et des préférences d'affichage.
- Le core reste le seul à notifier.

## 5. Le découpage

Un chantier, une PR par palier, dans l'ordre **[choix Claude]** :

1. **Le socle** : workspace `ui/`, kit repris (§9), service sous `/app`, appairage, coque (barre haute, barre
   mobile, colonne de Natsume au desktop et feuille au mobile, avec le fil en SSE), **Accueil** et **À valider**.
2. **Journal, Écosystème et catalogue** : les routes de réglage manquantes côté core, les deux
   sections, le catalogue des postes et le contrat v1.3 (liens profonds, chez les satellites aussi).
3. **Les notifications** : les quatre événements du core à créer, la file de rendu, Web Push vers
   les appareils, le bandeau dans l'app.

## 6. Hors périmètre

- La voix, l'avatar, le portail, la coque Tauri et les capacités PC (chantier 7).
- La personnalité de Natsume et les modes focus, silence, nuit (chantier 7).
- L'accès depuis l'extérieur et la liaison NAS (après le MVP).
- Les écrans détaillés d'un satellite (boîte mail, agenda, graphe de fiches) : ils restent dans son front.
- Une publication sur le Play Store.

## 7. Non-buts et anti-buts

- **Non-but** : refaire Claude ou ChatGPT. La conversation est un outil du pilotage.
- **Anti-but** : un accueil qui appelle le modèle à l'ouverture, ou qui attend un satellite lent pour
  s'afficher.
- **Anti-but** : un écran « squelette » livré sans le dire ; un écran qui s'écarte de la DA (jetons,
  polices, composants du kit, ton) ou une couleur écrite en dur.
- **Anti-but** : une cinquième section.
- **Anti-but** : un mobile et un desktop qui divergent : même composant, même nom, même icône.

## 8. Ce qui change ailleurs

- **ADR 0002** : le mobile passe de Capacitor à une PWA. L'**ADR 0007** le remplace et l'acte, Capacitor en porte de
  sortie ; Tauri 2 reste pour le desktop au chantier 7. `standards/stack.md` suit.
- **Spec d'écosystème du 2026-10-19, §6** : les push partent du core par Web Push (VAPID), plus par FCM.
- **`notifications.md`** : les quatre événements du core (§3.8) entrent dans le tableau de classement.
- **Contrat satellite v1.3** : un champ facultatif `link` (chemin dans le front du poste) sur `Card` et
  sur `LunEvent`, et l'adresse publique du front dans le manifeste ; sans rupture. Lun'Acedia et
  Lun'Avaritia le remplissent pour le mail et la fiche (§3.9).
- **README de lun-anima** : le tableau « Organisation » (`mobile/` en Capacitor) est mis à jour.

## 9. Laissé au constructeur

- Le moyen d'avoir un contexte sûr en local pour tester la PWA sur le téléphone (drapeau de Chrome,
  certificat local, redirection USB).
- La façon de partager le kit : copie depuis Lun'Avaritia ou kit commun synchronisé (lun-docs#43). Le
  chantier ne doit pas créer une troisième copie divergente.
- Le stockage des réglages modifiables et des abonnements push dans la base du core.
- La forme exacte des routes nouvelles (réglages, journal, abonnements).
- Le seuil de « poste injoignable » et le regroupement fin des notifications.

Chaque choix structurant donne un ADR.

## 10. Points ouverts

- **La disposition de l'accueil** : reprise avec Natsume au centre (§3.3) sur la planche
  `05-accueil-centre.html`, que CrOliX valide avant le code de l'accueil et de la coque revue. La coque, l'appairage
  et À valider n'attendent pas **[choix Claude]**.

## 11. Recette

Vérifiée dans Chrome en 1440 px et 390 px, puis sur le téléphone de CrOliX en réseau local :

- Appairer le téléphone avec un code du core, installer l'app depuis Chrome.
- Ouvrir l'app : l'accueil s'affiche sans appel au modèle (aucun coût ajouté) ; urgence, échéance et
  cartes en tête, chaque ligne à la couleur de son poste.
- Valider une carte de Lun'Acedia et une de Lun'Avaritia depuis l'accueil, puis depuis À valider.
- Écrire à Natsume depuis trois sections différentes, dicter une demande au micro, recevoir une
  carte dans le fil, la valider ; au desktop, sa colonne reste à sa place d'une section à l'autre.
- Changer le plafond de la conversation dans Écosystème : pris en compte sans redémarrer le core.
- Révoquer un appareil : il est refusé à l'appel suivant.
- Un rappel d'agenda (P0) fait sonner le téléphone, app fermée ; trois cartes (P1) donnent une seule
  notification silencieuse ; traitée sur le desktop, la notification disparaît du téléphone.
- Couper Lun'Acedia : l'accueil le dit, une alerte « poste injoignable » arrive, le reste fonctionne.
- Depuis une urgence sur le téléphone, « Ouvrir le mail » ouvre Lun'Acedia sur ce mail ; le retour
  ramène à Lun'Anima ; le front d'Acedia ne montre rien du core.
