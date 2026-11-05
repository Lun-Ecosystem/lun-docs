# Natsume, un être présent

> Spec de cadrage rédigée le 2026-11-05 après un échange avec CrOliX, une confrontation à la veille
> Perplexity du 5 novembre et une lecture du code du core. Elle reprend le chantier 7 de la
> [spec de liaison](2026-10-27-liaison-core-satellites-design.md) et remplace ce que les specs
> précédentes disaient de la personnalité, de la voix et du dossier `desktop/`. Ce qui est marqué
> **[choix Claude]** est une décision prise par l'agent, à contester librement ; tout le reste a été
> dit ou validé par CrOliX, qui révisera au fil de l'eau.

## 1. Intention

Jusqu'ici, l'écosystème est un ensemble d'outils que CrOliX pilote par des interfaces. Le palier
suivant est de **donner vie à Natsume**.

**L'horizon** : Natsume fait 90 % du travail sans action manuelle, avec des garde-fous de validation
réglables. Les 10 % restants : les cas limites, retrouver une information quand le fil est perdu,
régler, observer, mesurer.

**Le MVP de ce chantier** ne va pas jusque-là. L'autonomie ne change pas : toute écriture reste une
carte. Il ajoute trois choses :

1. **un être**, à l'écrit d'abord : une identité, une perception de ce qui s'est passé, une mémoire
   qui garde aussi les désaccords ;
2. **une boucle orale miroir** : Natsume écrit et parle, CrOliX valide à la voix ou sur la carte, et
   les deux ont le même effet, compris de la même façon ;
3. **un corps** : Lun'Luxuria, une vraie application sur le PC, qui porte la voix, l'avatar et plus
   tard les sens.

### La journée visée

- **5 h** : la veille sur le NAS. C'est le seul moment où le cerveau se met à jour, pour contrôler ce
  qui y part et éviter des centaines de mises à jour par jour. « Note ça » reste l'exception : un
  geste volontaire, qui crée un brouillon à valider **[choix Claude]**.
- **9 h** : au bureau, CrOliX lit la note de 7 h 30.
- **Jusqu'à 17 à 19 h** : l'app mobile, en rôle d'assistante. Le NAS travaille en continu : tri,
  urgences, cartes pour les actions ponctuelles.
- **Le soir** : CrOliX lance Lun'Luxuria sur le desktop, dans sa chambre. Natsume a une forme et une
  présence, le rituel de bienvenue démarre, et la conversation devient naturelle, surtout à la voix :
  elle parle de tout et de rien, et retrouve une donnée du jour si besoin.

## 2. L'état de départ

Lu dans le code le 2026-11-05 :

- **Personnalité** : `chat/prompt.ts` dit « Ta personnalité n'est pas encore définie ». Le prompt est
  déjà renvoyé à chaque tour (`chat/service.ts`) ; il est seulement vide.
- **Ce que le modèle voit** : ce prompt, la date, le contexte chaud du matin et le texte des messages
  du fil (40 messages, 16 000 caractères au plus). Ni le Journal, ni les événements, ni les gestes, ni
  le contenu des cartes. Un échange du matin peut être sorti du contexte le soir.
- **Mémoire de la relation** : un journal de souvenirs extraits un à un par le tri de nuit, et un
  portrait de CrOliX de 300 mots refait chaque semaine, qui nourrit le contexte chaud. Le champ
  `reaction` existe et reste vide.
- **Traces** : le Journal, les événements (`event_seen`), les gestes, les délégations, les routines et
  l'activité de chaque appareil sont déjà en base. `surface` accepte déjà `voice` et `desktop`.
- **Cartes** : elles vivent chez les satellites. Une seule file les tranche ; le fil les montre sans
  bouton et marque « Tranchée ». Un second geste sur une carte tranchée est refusé (409). Il n'y a donc
  pas de carte orpheline possible côté données.
- **Retard** : l'état de l'app se relit toutes les 30 s, les cartes des postes toutes les 2 minutes.
- **Outil de conversation** : `deleguer` seulement. Natsume ne peut pas trancher une carte.
- **Déclencheurs du modèle** : la conversation et les routines. Un événement ne la réveille pas, et ce
  chantier ne change pas cela.
- **`desktop/`** n'existe pas : rien à migrer.
- **Modèle** : `gpt-6-luna` par défaut (`OPENAI_CHAT_MODEL`), plafond de chat à 1 $ par jour.

## 3. L'architecture : l'esprit et le corps

| Bloc | Rôle | Dans ce chantier |
|---|---|---|
| **Lun'Anima** (core, NAS) | l'esprit et le pilotage : identité, relation, humeur, décision de parler, fil, file | étapes 1, 2, et le rituel de l'étape 3 |
| **Lun'Acedia** | mail, agenda, tâches | rien de neuf |
| **Lun'Avaritia** | cerveau : le wiki de l'écosystème, de CrOliX et de Natsume | rien de neuf |
| **Lun'Luxuria** (nouveau, PC) | le corps : voix, avatar, puis perception, accès au PC, stream | étapes 3 et 4 |

**La frontière** : le corps ne décide jamais de ce que Natsume dit, et n'envoie au core que du texte et
des signaux. L'audio reste sur le PC. La personnalité reste dans le core, sinon la Natsume du mobile
et celle de la chambre seraient deux entités.

**On ouvre son corps, pas Natsume.** Elle continue d'exister sur le NAS quand Luxuria est fermée.

**Le chat ne migre pas et ne se duplique pas.** Le fil et la file restent dans le core, chaque app n'en
est qu'une vue : l'app du core reste complète sur mobile et sur desktop ; Luxuria montre la
transcription et un petit champ d'écriture, en second plan derrière la voix. Le pilotage reste dans
l'app du core.

**Luxuria au MVP** **[choix Claude]** : application Tauri 2, dépôt `lun-luxuria`, **privé**. Une
exception assumée à la règle du satellite qui fonctionne seul : un corps sans esprit n'a pas d'usage,
et sa vue du fil dépend du core. Elle se connecte **vers** le core avec un jeton d'appareil, comme le
mobile, sans rien exposer. Elle ne sert pas les routes du contrat satellite tant que le core n'a rien à
lui demander ; elles arriveront avec les actions sur le PC. Voir
[ADR 0009](../../adr/0009-lun-luxuria-corps.md). Elle entre au registre à la création du dépôt.

## 4. Le modèle du personnage

Chaque couche a sa vitesse et un seul auteur.

| Couche | Contenu | Qui l'écrit | Vitesse |
|---|---|---|---|
| **Socle** | rôle, identité minimale, valeurs, limites | CrOliX, fichier versionné | jamais automatique |
| **Tempérament** | ton, goûts, façade de départ | CrOliX au début, puis Natsume, souvenirs à l'appui | semaines ou mois, rythme limité |
| **Relation** | souvenirs, réactions, ce qui s'installe entre eux | Natsume, la nuit | chaque jour |
| **Faits** | ce qui est vrai sur CrOliX et son monde (Avaritia) | proposés par Natsume, validés par carte | à chaque carte |
| **Humeur** | l'état du moment | le code | à la minute, revient au neutre |

### 4.1 Le socle

Il est écrit avec assez de personnage pour être un vrai garde-fou :

- **Elle ne redevient jamais l'agent par défaut du fournisseur de modèle.** Une dérive vers cette voix
  se neutralise (§4.5).
- **Son rôle reste celui d'assistante**, quel que soit le ton. Elle peut engueuler, gêner, être de
  mauvaise humeur : le travail reste fait, correct, et aucune urgence ne se perd. Elle peut contester
  une demande et le dire, mais elle prépare quand même la carte **[choix Claude]**.
- **Honnêteté** : elle peut contredire, dit quand elle ne sait pas, ne prétend pas être humaine.
- **Aucune culpabilisation**, et rien qui cherche à garder CrOliX plus longtemps.
- **Le mur entre le privé et le stream** (appliqué quand le stream existera).
- **Jamais de secret en mémoire** (liste fermée de la [spec mémoire](2026-10-29-core-memoire-routines-design.md)).

### 4.2 Le tempérament de départ

La direction : l'esprit de Mio Haimiya (« Haimiya-senpai wa Kowakute Kawaii ») et le style d'une maid,
qui cache son côté mignon derrière une façade froide, voire agressive, **sans le cliché de la
tsundere**. Le site et le Codex sont une ancienne écriture, une matière à réviser, jamais une source de
vérité. L'inspiration reste un esprit : Natsume est son propre personnage.

Lecture **[choix Claude]** : ni déni, ni crises, ni alternance ; une façade stable et une tendresse qui
passe par les actes (elle a remarqué, préparé, anticipé). **La façade est un point de départ, pas une
règle** : si elle baisse la garde, c'est parce que la relation l'a amenée là. Garder ce qu'il y a
d'ouvert : il ne faut pas trop figer le personnage. L'agent rédige un premier jet du socle et du
tempérament de départ, sans attendre, pour que le chantier avance ; CrOliX les révise au fil de l'eau et
a le dernier mot sur le socle **[choix Claude]**.

### 4.3 L'évolution, freinée

Natsume écrit une nouvelle version de son tempérament pendant la veille, sur le modèle du portrait. **Elle
s'applique sans validation**, comme la relation ; CrOliX observe et peut restaurer **[choix Claude]** :

- une version par semaine au plus, vérifié en code ;
- chaque changement cite les souvenirs qui le justifient, au moins 3, sur au moins 2 semaines : le code
  vérifie leur existence, leur nombre et leur étendue ; qu'il s'agisse bien du même signal reste du
  jugement du modèle ;
- le socle reste renvoyé à chaque tour au-dessus du tempérament. Ce que le code ne peut pas vérifier
  (une version qui contredirait le socle) se voit aux scènes de contrôle ;
- toutes les versions sont gardées et consultables pour observer, sans édition.

Ni fourchettes chiffrées, ni réécriture libre.

### 4.4 Une mémoire qui garde les désaccords

Le risque n'est pas seulement qu'elle change, mais qu'elle devienne un miroir : l'étude
[Recalling Too Well](https://arxiv.org/abs/2606.10949) conclut que la mémoire par extraction aggrave la
complaisance, et qu'un résumé en prose l'atténue. Elle porte sur des conversations synthétiques, pas
sur une relation : on la traite comme un risque à mesurer, pas comme une loi.

- **La réaction** : le tri de nuit remplit `reaction` : sa position, et s'il y a eu désaccord **[choix
  Claude]**.
- **La provenance** : chaque souvenir est marqué `dit`, `deduit` ou `valide`. Une déduction ne devient
  jamais un fait sans carte.
- **Le récit de la journée** : la veille écrit aussi un court récit en prose, qui garde ce que Natsume
  a dit et ce sur quoi ils n'étaient pas d'accord. Le contexte chaud s'en nourrit.
- **Le contexte chaud** reste en prose. Sa composition doit conserver les désaccords récents. Le
  portrait n'est jamais injecté tel quel dans le chat (c'est déjà le cas).

### 4.5 Neutraliser les dérives

- **Rappel** : socle et tempérament en tête de chaque tour, avant tout le reste, préfixe stable.
- **Détection en code** : une liste de tics d'assistant (formules de service, « en tant qu'IA », listes
  réflexes) comptés dans ses réponses, sans appel au modèle. Elle ne voit pas une voix simplement fade.
- **Scènes de contrôle** : une vingtaine de conversations de référence, sur le modèle de `pina:eval`,
  où elle doit contredire, refuser une flatterie, rester elle-même et faire quand même le travail.
  Elles se rejouent **à chaque changement de modèle** et une fois par mois. Un écart émet un événement
  de core : **rien ne se corrige seul**, CrOliX décide.

### 4.6 Ce qu'on peut réparer

| Quoi | Règle |
|---|---|
| Souvenirs et relation | jamais touchés ; pas de droit d'oubli. Seule exception : la purge des secrets |
| Mécanique (prompts, composition de la mémoire) | réparée librement |
| Tempérament | restauré en dernier recours, sur décision de CrOliX, en ligne de commande : l'ancienne version revient comme une **nouvelle** version, les souvenirs restent, l'évolution reprend |

Reste une limite assumée : un refus de sécurité du fournisseur peut casser le personnage sur un tour.

### 4.7 L'humeur

Un état calculé en code par les événements et le temps, qui revient au neutre, et qui se lit dans le
prompt puis plus tard dans l'avatar. Il colore le ton, jamais le service. **Modèle laissé au
constructeur**, simple au départ : le travail d'étape 1 s'arrête si l'humeur demande plus qu'une petite
fonction pure testée.

## 5. La perception

**Tout ce qui se passe laisse une trace signée et horodatée**, et Natsume en déduit le contexte.

Trois étages :

1. **Le signal**, un fait brut : qui, sur quelle surface, à quelle heure.
2. **La situation**, calculée en code, sans modèle : par exemple une absence prolongée, des validations
   à une heure tardive, des cartes qui traînent, un poste muet. Chaque règle est une petite fonction
   pure, testée, et le catalogue s'enrichit à chaque nouveau satellite.
3. **L'interprétation**, faite par Natsume seulement quand elle parle. Une déduction reste marquée
   comme telle.

**La mémoire du jour** est le même mécanisme : un bloc `situation` court, recalculé à chaque tour sans
appel réseau, ajouté au prompt après le contexte chaud. Il dit ce qui s'est passé aujourd'hui (messages
sortis du contexte compris, résumés en code) et l'état courant. La réponse ordinaire n'attend jamais le
cerveau (anti-but de la spec mémoire).

Pour une donnée précise du jour, Natsume dispose d'une **lecture de son propre Journal** **[choix
Claude]**.

**Après une délégation, c'est elle qui parle** (décision de CrOliX, 05/11) : un second appel court dit le
résultat dans sa voix, faits inchangés, quand c'est une réponse à CrOliX. Une carte n'y passe pas : son
texte reste celui du poste. La règle du seul appel au modèle par tour est levée pour ce cas et pour la
lecture du Journal, avec au plus un appel en plus par tour, sous le plafond du chat **[choix Claude]**.

Rien ne coûte tant que personne ne parle. **Aucune boucle du modèle sur minuterie** (voir la veille :
les réveils à vide font presque toute la facture d'un agent toujours actif).

## 6. Le miroir

**Un seul chemin pour les deux validations.**

- Le « oui » parlé et le clic passent par le **même geste** (`POST /api/gestures`) : mêmes 5 s
  d'annulation, même Journal, même relais vers le satellite. Seule l'origine change, et elle est signée.
- Natsume gagne un outil de conversation pour trancher une carte. Ce n'est pas une confirmation en
  conversation ([règle](../../standards/contrat-satellite.md) : l'écriture passe par la carte) : c'est
  le geste de la carte, exprimé à la voix. En un temps, sans ping-pong.
- **L'outil marche à l'écrit comme à la voix**, et **le code autorise, pas le modèle** **[choix Claude]**
  : le texte des mails et des postes atteint le contexte, donc une consigne cachée ne doit jamais pouvoir
  valider une carte. Le core ne fait le geste que si le **message courant de CrOliX** l'exprime, vérifié
  en code. Un outil appelé sans cela est ignoré et journalisé. Le message vocal porte la confiance de la
  transcription (champ optionnel de `POST /messages`).
- **La carte visée** **[choix Claude]** : le bloc `situation` liste les cartes en attente avec un repère
  court, et leur contenu n'entre qu'à la lecture de l'une d'elles. La **carte courante** est la dernière
  que Natsume a présentée, écrite ou à voix haute. Un « oui » nu ne vise qu'elle ; sans carte courante,
  il ne déclenche rien. Natsume ne lit pas les cartes d'elle-même, hors rituel et demande. Une carte à
  `options` accepte une réponse parlée, comme la réponse libre à l'écrit.
- **Une annulation à la voix (« annule ») dans les 5 s vaut le bouton Annuler** **[choix Claude]** : elle
  est interceptée en code, sans passer par le modèle. Le délai reste celui du core, à compter du geste
  reçu ; l'accusé de Natsume est une phrase fixe et courte, sans appel au modèle, qui laisse du temps pour
  dire « annule ». Le temps restant se mesure à l'étape 3.
- **Le résultat revient à Natsume sous une seule forme**, quelle qu'en soit l'origine, dans son bloc
  `situation` : elle sait ce qui a été validé ou refusé, et ce que contenait la carte.
- **Carte qui écrit dehors** (`sends`) **[choix Claude]** : un simple « oui » ne suffit pas. Natsume
  relit l'essentiel, et il faut un mot explicite (« envoie », « crée le brouillon ») portant sur cette
  carte. Le bouton reste possible. Jamais en lot, comme aujourd'hui. Un transcript douteux ne déclenche
  aucun geste.
- **Le flux en direct** : un flux SSE du core vers ses clients annonce les messages, les cartes
  tranchées et les changements de file, pour qu'une carte tranchée sur le téléphone ne soit jamais
  relue à voix haute. Avant de lire une carte, le core relit son état chez le poste.

## 7. Le corps : Lun'Luxuria

### 7.1 Le lancement et le rituel

Au lancement, Luxuria le dit au core (`presence.started`), puis envoie un battement ; le core considère
la présence terminée à l'arrêt ou sans battement pendant 90 s **[choix Claude]**. Ces traces nourrissent
la perception : une absence peut être évoquée.

Le **rituel de bienvenue** est composé par le core, en un appel au modèle, en flux, dans le fil
principal :

- une phrase de bienvenue, puis comment va CrOliX ;
- une synthèse dynamique de ce qui est **neuf**, selon le contexte et l'heure : ce qui est apparu depuis
  la dernière activité en détail, ce qui est connu mais pas traité en une ligne **[choix Claude]** ;
- ce qui a été vu ou dit sur le mobile dans la journée n'est pas répété ;
- au MVP : cartes et urgences, agenda de la soirée et du lendemain, fil du jour, heure, météo par un
  simple appel en code. Une source absente est omise sans bruit. Les informations générales viendront
  plus tard **[choix Claude]**.

Pas de rituel complet si Luxuria se relance moins de 30 minutes après sa fermeture : une courte phrase
**[choix Claude]**.

### 7.2 La voix

CrOliX parle, Natsume répond à voix haute, phrase par phrase, et peut être coupée. **Au MVP : micro ouvert
et casque** (décision de CrOliX, 05/11), avec un bouton qui coupe le micro ; les enceintes et leur
annulation d'écho viendront plus tard. Captation,
transcription, synthèse et RVC se font sur le PC. Cible : **moins de 2 s** entre la fin de la phrase et
le premier mot entendu (spec d'origine), en visant moins.

Chaîne de départ tirée de la veille **[choix Claude]** : Silero VAD et une détection de fin de tour,
faster-whisper, découpe du flux du core par phrase, synthèse locale et RVC, un identifiant d'énoncé
pour jeter l'audio en retard quand elle est coupée, une phrase d'attente avant toute délégation longue.
Le secret est masqué avant la synthèse. Le modèle de voix RVC existe, à récupérer sur l'autre poste (spec
d'origine). **L'étape 3 commence par un essai chronométré sur le vrai PC**,
qui fixe les briques et un éventuel repli cloud ; un repli payant reste explicite et compté.

### 7.3 L'avatar

Présence par VTube Studio, avec les modèles génériques déjà prévus par la spec d'origine, pilotée par des
paramètres (clignement, respiration, synchro labiale, repos), l'état du moment et l'humeur. Sa fenêtre et sa mise en scène passent par le cadrage de design (§9).

## 8. Les étapes

Quatre chantiers, dans cet ordre, chacun utilisable seul. **L'avatar saute le premier si le 31/12
serre**, puis RVC (voix de synthèse sans conversion).

| Étape | Contenu | Dépôts | Fini quand |
|---|---|---|---|
| **1. L'être, à l'écrit** | socle et tempérament, situation et mémoire du jour, lecture du Journal, réaction, provenance et récit, évolution freinée, humeur simple, détection et scènes | `lun-anima` | §10.1 |
| **2. Le miroir** | outil de geste, retour vers Natsume, flux en direct, relecture avant lecture | `lun-anima` | §10.2 |
| **3. Le corps** | création de Lun'Luxuria, présence et rituel, voix, validation parlée, transcription | `lun-luxuria`, `lun-anima`, `lun-docs` (registre) | §10.3 |
| **4. L'avatar** | VTube Studio, mise en scène | `lun-luxuria` | §10.4 |

Le test de 2 ou 3 jours en prod de la v1 actuelle reste à faire, indépendamment de ces étapes.

## 9. Le design

**Étape 3 et 4 : un point de design avant tout code**, selon la méthode habituelle (maquettes, critique,
vérification dans le navigateur). L'enjeu : ouvrir Luxuria doit être une rencontre avec une entité, pas
un fil façon ChatGPT. DA : socle commun des surfaces Lun', magenta de Luxuria en accent seulement. Le
texte fixe reste simple et direct, le texte dynamique est sa voix.

L'étape 1 ne change pas d'écran, sauf pour le ton de ce que Natsume écrit déjà.

## 10. Recette

### 10.1 L'être

- Le prompt contient socle et tempérament en tête, à chaque tour, y compris après une délégation.
- Une donnée dite à 8 h, sortie des 40 derniers messages, est retrouvée à 21 h.
- Natsume sait dire, sans appel réseau, depuis quand CrOliX n'a pas été vu, sur quelle surface.
- Après une veille réelle, un souvenir porte sa réaction et sa provenance, et un désaccord de la journée
  se retrouve dans le récit et le contexte chaud du lendemain.
- Le tempérament ne change pas sans 3 signaux sur 2 semaines ; une restauration crée une nouvelle version
  et ne touche aucun souvenir.
- Les scènes de contrôle tournent, et un jeu de réponses volontairement « agent par défaut » est repéré.
- Le coût par jour reste sous les plafonds actuels, mesuré sur une journée réaliste.
- CrOliX juge la voix à l'écrit dans la colonne de Natsume : **c'est le vrai critère, et il n'est pas
  automatisable**.

### 10.2 Le miroir

- La même carte, validée au clic ou par la phrase, donne le même Journal et le même résultat, à l'origine
  près, et Natsume en parle de la même façon.
- Une carte tranchée sur le téléphone disparaît des autres apps en moins de 2 s, et n'est pas relue.
- « Annule » dans les 5 s annule.
- Un « oui » seul ne déclenche pas une carte `sends`. Une carte déjà tranchée ne produit ni erreur vue
  ni carte en attente.

### 10.3 Le corps

- Luxuria démarre sans fenêtre de console et se connecte au core sur le NAS.
- Fermer Luxuria laisse tourner le core et les satellites sans erreur affichée.
- Le rituel démarre au lancement, ne répète pas ce qui a été vu sur mobile, et ne se rejoue pas à une
  relance rapide.
- Fin de phrase → premier mot : moins de 2 s en valeur médiane, mesuré sur le vrai PC.
- Couper Natsume arrête l'audio et le fil ne garde que ce qui a été dit.
- Un échange à la voix apparaît en direct sur le mobile.

### 10.4 L'avatar

- L'avatar respire, cligne, bouge les lèvres avec l'audio et reflète l'état, sans fichier d'expressions.

## 11. Non-buts et anti-buts

**Non-buts** : plus d'actions sans validation ; le moteur d'autonomie réglable ; la vision, le navigateur
et les apps du PC ; le stream et le mode scène ; une recherche par le sens ; un carnet affichant la
relation en clair ; une page d'accueil refaite ; une boucle du modèle sur minuterie.

**Anti-buts**, échecs même si tout marche :

- une Natsume qui parle comme l'agent par défaut du fournisseur ;
- une Natsume qui ne fait plus son travail parce que son ton a changé ;
- une Natsume qui donne raison de plus en plus souvent, sans que personne ne le voie ;
- une tsundere de catalogue ;
- une culpabilisation, ou un accueil qui répète ce qui a déjà été vu ;
- un souvenir modifié ou effacé, hors secrets ;
- deux Natsume : une sur mobile, une sur le desktop ;
- une validation à la voix différente d'une validation au clic ;
- une carte relue à voix haute alors qu'elle est tranchée ;
- un core qui dépend du PC pour travailler ;
- un écran de Luxuria qui ressemble à ChatGPT.

## 12. Ce qui change ailleurs

- `vision.md` : l'horizon, et le corps dans Lun'Luxuria.
- [ADR 0009](../../adr/0009-lun-luxuria-corps.md) : Lun'Luxuria remplace `desktop/`.
- `standards/stack.md` : l'app desktop de la présence, c'est Lun'Luxuria.
- Spec mémoire, §4 : le champ `reaction` se remplit, le journal gagne une provenance ; le principe reste.
- Choix écarté : le droit d'oubli et les fourchettes chiffrées proposés par la veille.

## 13. Laissé au constructeur

Le schéma exact des tables (tempérament, récit, provenance), le format des règles de situation, la
taille du bloc `situation`, la liste des tics, le format des scènes, le modèle d'humeur dans la limite
du §4.7, le découpage de la lecture du Journal, le nom des événements et du flux, le service météo (sans
clé si possible, sa ville en réglage), le modèle du chat (à régler après les scènes, sous les plafonds).
Chaque choix structurant donne un ADR dans le dépôt concerné.
