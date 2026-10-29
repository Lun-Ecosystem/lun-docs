# Core : mémoire, routines et contexte chaud

> Spec de cadrage rédigée le 2026-10-29 pour le chantier 5 de la
> [spec de liaison core ↔ satellites](2026-10-27-liaison-core-satellites-design.md), après un audit de
> cette spec, de la [spec d'Avaritia v1](2026-10-28-lun-avaritia-v1-design.md) et du code, puis un
> échange avec CrOliX. Elle précise la spec de liaison sur les points listés au §10. Ce qui est marqué
> **[choix Claude]** est une décision prise par l'agent, à contester librement ; tout le reste a été
> dit ou validé par CrOliX.

## 1. Intention

Le core est le manager de l'écosystème. Ce chantier lui donne trois choses :

1. une **mémoire du jour** qui sert la réactivité, sans aller-retour vers le cerveau ;
2. des **routines** : la veille nocturne, qui trie la journée entre le wiki (Lun'Avaritia) et la
   relation, puis le point du matin, qui présente à CrOliX ce qui attend sa décision ;
3. un **contexte chaud** : chaque matin, la conversation repart propre, nourrie d'environ 500 mots
   recomposés pendant la nuit.

Il donne aussi à Natsume une **mémoire de la relation** qui évolue seule, comme une relation réelle.

Le chantier se fait dans `lun-anima`. Avaritia et Acedia ne changent pas : le core utilise ce qu'ils
exposent déjà (contrat satellite v1.1).

## 2. L'état de départ

L'audit du 29/10 a relevé :

- **Le core ne connaît pas Avaritia.** La table des rôles des postes (`chat/posts.ts`) n'a qu'Acedia,
  écrite en dur, et la règle de délégation du prompt ne parle que de mail, d'agenda et de tâches. Le
  chantier 4 a livré Avaritia sans son branchement côté core.
- **La mémoire vive existe déjà en base** : les messages des fils (`messages`) et les événements reçus
  des satellites (`events`, toutes importances, dont les alertes). Aucun nouveau stockage n'est
  nécessaire pour elle.
- **Le chat appelle le modèle une fois par tour.** Quand le modèle délègue, le core transmet la demande
  au poste et affiche son résumé, sans rappeler le modèle (`chat/service.ts`).
- **Le core n'a pas d'état de pause** : seuls les satellites ont `/pause`.
- **Le chat met dans le contexte du modèle les 40 derniers messages du fil** (16 000 caractères au
  plus), sans coupure de journée.
- **La journée de Natsume** (5 h à 5 h, heure de Paris) est déjà définie à un seul endroit
  (`chat/day.ts`), et le plafond de coût du chat est quotidien sur cette journée.
- Le core sait déjà agréger les cartes des postes (`GET /cards`) et les relayer.

## 3. Ce que fait le chantier, en trois paliers

Un palier = une branche = une PR, dans cet ordre.

### Palier 1 : Avaritia branchée au core

- **Avaritia devient un poste** que Natsume peut appeler : rôle « mémoire et fiches de l'écosystème »,
  règle de délégation étendue à ce rôle. Le rôle reste écrit dans la table des rôles du core, comme
  celui d'Acedia : le contrat ne porte pas de rôle et les satellites ne changent pas
  **[choix Claude]**.
- **« Note ça » part tout de suite** vers Avaritia, par délégation : c'est un geste volontaire de
  CrOliX, qui devient un brouillon sans attendre la nuit (règle de la spec d'Avaritia §3.3). Quand une
  délégation à Avaritia rend au moins une carte de brouillon, l'échange est **marqué comme déjà noté**,
  avec le résumé du poste **[choix Claude]**. La veille nocturne reçoit ces échanges avec leur marque et
  n'en tire pas d'observation ; elle peut en tirer un souvenir. Si un doublon passe quand même, la
  détection de doublons d'Avaritia le rattrape.
- **La lecture du savoir passe par la délégation** à l'agent d'Avaritia, qui cherche et lit lui-même
  ses fiches. Le chat garde un seul appel au modèle par tour : pas de boucle d'outils dans le core au
  MVP **[choix Claude]**. Les lectures directes (`brain.search`, `brain.read`) servent aux routines,
  pas au chat.
- Les cartes d'Avaritia (brouillons, contradictions, doublons) passent par le relais de cartes
  existant, comme celles de Pina.

### Palier 2 : la veille nocturne et la mémoire de la relation

- **Le moteur des routines** : un déclencheur générique (une heure, une suite d'appels), défini dans
  le code du core au MVP. Une table garde l'historique de chaque passage (début, fin, période couverte,
  coût, résultat).
- **La veille nocturne** tourne à 5 h, heure de Paris. Elle couvre la période qui va **de la fin de la
  dernière veille réussie** jusqu'à maintenant, jamais « les dernières 24 h ». La toute première veille
  part de la mise en service du chantier, sans reprendre l'historique d'avant **[choix Claude]**.
- **Le rattrapage** : si le core n'était pas lancé à 5 h (le MVP tourne sur le PC de CrOliX), il fait
  la veille manquée **une seule fois au démarrage**. Une période de plusieurs journées est traitée
  **journée par journée**, dans l'ordre, pour garder chaque appel à une taille normale : rien n'est
  perdu ni tronqué **[choix Claude]**.
- **Les étapes et les reprises** **[choix Claude]** : chaque journée passe par des étapes notées une à
  une (bilan d'Acedia, tri, envoi à Avaritia, écriture du journal). Une reprise ne refait que les
  étapes non faites, pour qu'un souvenir ne soit jamais écrit deux fois. Les souvenirs portent la
  journée d'où ils viennent. Un lot envoyé dont la réussite n'a pas pu être notée (arrêt brutal) peut
  repartir une fois : c'est accepté, la détection de doublons d'Avaritia le couvre.
- **Un poste injoignable** (Acedia ou Avaritia) ne bloque pas la veille : elle continue sans lui, et
  l'étape manquée est reprise au passage suivant, sur la même journée.
- **Le tri** : un seul appel au modèle lit la période (messages des fils, alertes reçues, bilan du jour
  d'Acedia par `day.digest`) et rend deux listes :
  - des **observations** : faits neutres et sourcés, envoyés à Avaritia par `brain.ingest` au format
    qu'elle définit ;
  - des **souvenirs** : ce qui touche à la relation, écrits dans le journal du core.

  Ce qui n'entre dans aucune des deux listes n'est pas retenu. Les messages marqués « déjà transmis »
  ne deviennent pas des observations. Côté Acedia, le volet nocturne se limite à faire remonter ses
  propositions de tri en attente (spec de liaison §5).
- **Le coût de la veille** est compté sur la journée qu'elle résume, sous son propre plafond, distinct
  de celui du chat **[choix Claude]**. Plafond atteint : la veille n'appelle pas le modèle, le
  passage est noté en échec avec la raison, et la période sera couverte au passage suivant.

### Palier 3 : le contexte chaud et le point du matin

- **Le contexte chaud** est composé par le core, une fois par jour, **par la routine du matin**, juste
  avant le point du matin **[choix Claude]**. Il peut ainsi tenir compte des cartes qu'Avaritia a
  produites dans la nuit. Entre 5 h et 7 h 30, le contexte chaud de la veille reste en place. Environ
  500 mots, tirés de trois sources :
  - la mémoire de la relation (le portrait et les souvenirs récents) ;
  - ce qui attend CrOliX ce matin (le point du matin) ;
  - les fiches d'Avaritia liées aux sujets de la veille, par `brain.search`.

  Il est gardé dans la base du core et lu à chaque échange, sans appel réseau : la voix ne l'attend
  jamais. La spec de liaison disait « recomposé depuis le cerveau » ; le cerveau n'en est qu'une
  source, car c'est un wiki neutre sans avis ni priorités.
- **Repartir propre** : le contexte du modèle devient le contexte chaud, puis les messages de la
  journée en cours seulement (coupée à 5 h). Pour ne pas couper une conversation qui déborde après
  5 h, les **six derniers messages** de la veille restent dans le contexte **[choix Claude]**.
  L'historique des fils reste consultable en entier : rien n'est effacé.
- **Le point du matin** est une routine séparée, à **heure fixe** (7 h 30 au MVP **[choix Claude]**).
  Elle ne dépend pas de la fin du traitement d'Avaritia, qui traite ses lots en différé : elle lit les
  cartes en attente à ce moment-là. Elle présente **cinq éléments au plus, tous postes confondus**,
  dans cet ordre : les alertes `urgent` de la journée écoulée, puis les contradictions et doublons
  d'Avaritia, puis les autres cartes, de la plus ancienne à la plus récente **[choix Claude]**. Le
  contrat ne portant ni échéance ni urgence sur une carte, le classement s'appuie seulement sur ces
  signaux, sans appel au modèle. Le surplus reste consultable dans le relais de cartes, sans être
  poussé.
- **Les propositions d'action** du matin sont, au MVP, les cartes déjà en attente chez les postes.
  La veille nocturne ne délègue rien : faire préparer un brouillon à Acedia pendant la nuit (exemple
  du mail urgent de la spec de liaison §5) vient plus tard (décision de CrOliX, 29/10).
- **La forme du point du matin au MVP** : un message de Natsume dans le fil principal, qui renvoie aux
  cartes. Les apps du core (chantier 6) en feront un écran et une notification.

## 4. La mémoire de la relation

Décision de CrOliX (29/10) : la relation est une **exception en dur** à la règle « rien n'entre sans
validation ».

- **Elle s'écrit sans carte.** Pour qu'une relation évolue naturellement, il faut une part d'action
  sans contrôle préalable.
- **Elle ne se corrige pas.** CrOliX ne peut ni modifier ni supprimer un souvenir pour corriger le
  tir : une remarque qui a déplu à Natsume reste. La superviser serait tricher.
- **Elle ne se compacte jamais avec la journée** (anti-but de la spec de liaison).
- **Le journal** : chaque souvenir garde le fait, la date, la source et la réaction de Natsume. On
  ajoute, on ne réécrit pas. Tant que la personnalité n'est pas définie (chantier 7), la réaction
  reste neutre.
- **Le portrait** : ce que Natsume sait des habitudes et préférences de CrOliX, régénéré chaque
  semaine depuis le journal **[choix Claude]**. Chaque version est gardée.
- **Pas d'écran qui l'affiche en clair** : la relation se lit à travers le comportement de Natsume
  **[choix Claude, à confirmer par CrOliX]**.
- Les garde-fous du MVP (plafonds de coût, historique des passages) servent à mesurer le coût en usage
  normal, pas à surveiller la relation. Plus d'indépendance pourra venir plus tard ; la relation, elle,
  ne sera jamais supervisée.

### La seule exception : les secrets

La relation ne garde jamais de secret. Cette sécurité est **bornée**, pour qu'aucune autre donnée ne
subisse de censure :

- **Liste fermée** : mots de passe et codes de connexion (2FA, codes reçus par SMS), clés d'API et
  jetons, numéros de carte bancaire et IBAN, numéros officiels (sécurité sociale, passeport, carte
  d'identité). Rien d'autre : ni la santé, ni les opinions, ni l'intime.
- **Détection par motifs fixes dans le code**, jamais par le jugement du modèle, qui élargirait de
  lui-même. Un test prouve que des données hors de la liste passent intactes.
- **On masque la valeur, pas le souvenir** : « CrOliX m'a donné le code du Wi-Fi » reste, sans le code.
- **Une purge en ligne de commande**, hors de l'app, limitée à cette même liste, pour le cas où un
  secret passerait quand même.

Le même masquage s'applique aux observations envoyées à Avaritia **[choix Claude]**.

## 5. Les frontières

- **Wiki ou relation** : un fait neutre et sourcé va dans une fiche d'Avaritia (validée par CrOliX).
  Un souvenir, un ressenti, une habitude vont dans la relation (jamais validée). Le tri nocturne
  applique cette règle.
- **Le core ne décide rien à la place d'un poste** : il relaie les cartes d'Acedia et d'Avaritia.
- **Deux satellites ne se parlent jamais** : le core fait le coursier, y compris pour le bilan d'Acedia
  envoyé au cerveau.
- **Les routines n'ont pas de métier** : elles appellent le tri, les postes et la composition du
  contexte, dans un ordre défini.

## 6. Hors périmètre

- Les écrans et notifications du point du matin : chantier 6 (apps du core).
- La personnalité, l'humeur, la voix et l'avatar : chantier 7. Ce chantier pose seulement la place de
  la réaction de Natsume dans le journal.
- Régler les routines depuis l'app : moyen terme.
- La préparation d'actions par les postes pendant la nuit : plus tard.
- La veille tech et la veille libre : elles appartiennent à Avaritia.
- La liaison sur le NAS : après le MVP local.

## 7. Non-buts et anti-buts

**Non-buts** : un nouveau stockage pour la mémoire vive ; une copie du wiki dans le core ; un tri
nocturne qui réapprend le métier d'Acedia.

**Anti-buts**, échecs même si tout marche :

- un « note ça » qui donne deux brouillons (un tout de suite, un la nuit) ;
- une nuit manquée dont la journée est perdue ;
- un matin de plus de cinq éléments poussés ;
- un souvenir modifié, supprimé ou validé par CrOliX ;
- une donnée hors de la liste des secrets censurée ;
- une réponse ordinaire, vocale ou écrite, qui attend le cerveau ou la composition du contexte. Seule
  une question sur le savoir attend Avaritia, puisqu'elle lui est déléguée.

## 8. Recette

- « Note ça » dans le chat donne un brouillon chez Avaritia tout de suite, et aucun la nuit suivante.
- Natsume répond à une question sur une fiche par délégation à Avaritia, en un seul appel au modèle
  côté core.
- Core éteint à 5 h, lancé à 9 h : la veille tourne une fois au démarrage et couvre toute la période.
  Core éteint trois nuits : trois journées traitées dans l'ordre, aucun souvenir en double après une
  reprise.
- Acedia éteinte pendant la veille : la veille se termine sans son bilan, qui est repris au passage
  suivant.
- Une veille sur une vraie journée (fictive mais réaliste) : observations reçues par Avaritia,
  souvenirs dans le journal, coût mesuré. C'est aussi la mesure du **coût d'un lot réel d'Avaritia**
  restée ouverte au chantier 4.
- Un mot de passe, une clé et un IBAN dits dans le chat sont masqués dans le journal et dans le lot ;
  une adresse, un nom, une information de santé ne le sont pas.
- Le matin, le contexte du modèle contient le contexte chaud et la journée en cours, pas la veille
  (sauf les six derniers messages).
- Le point du matin présente cinq éléments au plus, dans l'ordre prévu.

## 9. Le modèle et le coût

Le tri nocturne et la composition du contexte chaud utilisent le fournisseur déjà configuré pour le
chat **[choix Claude]**. Le choix du modèle (petit ou non) et le plafond de la veille se règlent après
la mesure de la recette.

## 10. Ce qui change dans la spec de liaison

- §5.1 : « note ça » ne passe pas par la mémoire vive pour aller au cerveau ; il part tout de suite.
- §5.4 : le contexte chaud est composé par le core depuis trois sources, dont le cerveau.
- §5.5 : la mémoire de la relation s'écrit sans validation et ne se corrige pas (§4 ci-dessus).
- §5 : la veille nocturne couvre la période depuis la dernière veille réussie, avec rattrapage au
  démarrage.
- §5 : cinq éléments au plus au point du matin, tous postes confondus ; au MVP, la nuit ne fait rien
  préparer aux postes.
- §11 : le chantier 5 commence par le branchement d'Avaritia au core, absent du chantier 4.

## 11. Laissé au constructeur

Le schéma exact du journal et du portrait, le format du prompt de tri, le stockage du contexte chaud,
le moteur des routines (minuterie dans le processus), les motifs de détection des secrets (dans la
limite de la liste fermée), la forme du message du point du matin. Chaque choix structurant donne un
ADR.
