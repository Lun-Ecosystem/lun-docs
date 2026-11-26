# Notifications

> Comment un événement de l'écosystème devient (ou non) une notification. Vaut pour le core et pour
> tous les satellites. Les événements eux-mêmes passent par le flux du
> [contrat satellite](contrat-satellite.md) ; ce standard fixe leur palier et leur rendu.

## Principe

- **Le satellite fixe le palier**, selon la nature de l'information, par des règles déterministes.
  Un LLM peut étiqueter (« urgent ») ; il ne fixe jamais le palier à lui seul.
- **Le core rend tout par sa porte d'attention** (ci-dessous), selon le palier et les entrées de rendu. Le satellite ne
  connaît ni la porte ni ses entrées. Les modes (assistante, focus, silence) viendront après le MVP, sous forme de rôles
  éditables qui diront ce qui passe ; jusque-là, il n'y en a pas.
- **Le core est le seul à notifier** CrOliX sur ses appareils. Un front autonome peut notifier pour
  qui l'utilise sans Lun' ; ce n'est pas le parcours de CrOliX.
- **Annoncer est le rôle de Natsume** : par la voix au bureau, par une notification sur le téléphone.
  Le desktop n'a pas de notification système. Les compteurs sont communs à tous les supports.

## La porte d'attention

Un seul endroit du core, en code, sans modèle. **Tout ce qui peut parvenir à CrOliX y passe** : rien ne se dit, ne se
notifie ni ne s'écrit au Journal par un autre chemin.

- **Ce qu'elle reçoit** : les événements des postes et du core (contrôle compris), les cartes des postes avec leur
  palier, les échéances lues par le core (agenda, tâches, bibliothèque).
- **Ses entrées de rendu** : la sourdine, la pause, un appel en cours au bureau, la plage de nuit, la présence, le
  réglage « Dit à voix haute : P0 », le réglage « les alertes urgentes en direct » du poste source (coupé, une urgence
  de ce poste ne notifie pas) et l'ancienneté d'une urgence.
- **Ses cinq sorties** : dire (à voix haute au bureau), notifier (sur le téléphone), attendre le bon moment, la lettre
  du matin, le Journal. Elle choisit selon le palier (tableau ci-dessous) et ses entrées.
- **Chaque choix est tracé** : ce qui est arrivé, la sortie choisie et l'entrée qui l'a décidée.
- **Attendre** est nommé et tracé, sans budget au MVP. Son budget, partagé avec la parole spontanée, viendra avec
  elle : les deux se compteront ensemble.
- **En pause**, seules les urgences et les alertes de santé du core sortent : crash, sauvegarde ratée, clé refusée ou
  crédit épuisé, conversation qui ne peut plus répondre, clé qui expire, poste injoignable, plafond atteint. Le reste
  attend, au Journal et dans les compteurs. Il n'y a qu'une pause, quelle que soit la personne ou la règle qui l'a
  posée.
- **Au MVP, trois choses n'y passent pas encore** : la parole spontanée, les échéances lues par le core, et les
  écritures au Journal d'un acte de CrOliX ou de Natsume. « Attendre » et la lettre sont décidés et tracés, sans
  lecteur encore. Deux réponses à un geste de CrOliX restent directes : la phrase du retour rapide et l'essai de
  notification.

## Les paliers

| Palier | `importance` | Rendu | Au MVP |
|---|---|---|---|
| **P0 · Interrompre** | `urgent` | vibration et son, notification en haut de l'écran | dit malgré la sourdine si « Dit à voix haute : P0 » est activé (le défaut) ; sinon écrit au fil sans être dit, et il sonne quand même sur le téléphone ; jamais dit en appel ; ancien de quelques minutes au bureau, écrit au fil sans être dit ; pendant la plage de nuit (23 h à 7 h, réglable), écrit au fil sans être dit, et sans son |
| **P1 · Prévenir** | `normal` | notification silencieuse dans le tiroir et pastille | la sourdine ne la touche pas ; le téléphone la reçoit, sauf quand CrOliX est au bureau |
| **P2 · Signaler** | `low` | pastille ou compteur dans l'app, pas de notification système | — |
| **P3 · Résumer** | `info` | seulement dans la lettre du matin ou le point du soir | — |
| **P4 · Journal** | `log` | rien, visible dans l'historique | — |

Un client qui ne connaît pas `low` ou `log` les traite comme `info` : rien n'interrompt par erreur.

## Classement des événements

| Nature | Exemple | Palier |
|---|---|---|
| Ce que CrOliX a lui-même programmé, à son heure | rappel d'agenda (`agenda.reminder`) | P0 |
| Ce qu'une **règle** de CrOliX dit urgent | mail d'un expéditeur ou avec un mot-clé désignés | P0 |
| Un service qui s'arrête faute d'accès | autorisation Google à renouveler, crédit épuisé, clé refusée | P1 |
| Une échéance d'accès proche | clé qui expire : J-3 en P1, J-14 en P2 | P1 / P2 |
| Une routine qui échoue, un poste injoignable, un plafond atteint | `routine.failed`, `post.unreachable`, `cap.reached` | P1 |
| La lettre du matin, postée | `morning.posted` | P1 |
| Une décision attendue sur une demande de CrOliX | carte à valider issue d'une délégation | P1 |
| Un avis de l'IA, sans règle | mail jugé urgent par le tri | P1, jamais P0 |
| Ce qui est dû dans la journée | tâche à échéance aujourd'hui | P2, en tête de la lettre du matin |
| Ce qui attend un geste, sans heure | proposition de tri, carte ou événement (P1 si le tri la juge urgente), question de la bibliothèque, proposition de la nuit | P2 |
| Ce qui s'est fait seul | mail rangé par une règle, fiche créée, veille tech | P3 |
| Un état technique | boîte ou agenda mis à jour, clé rétablie, prix inconnu | P4 |

Un nouveau type d'événement se classe par sa **nature** dans ce tableau, jamais par son émetteur. Une carte porte son
palier dans `importance` ([contrat](contrat-satellite.md)) ; sans `importance`, elle vaut P1.

## Rendu

- **Regroupement** : plusieurs événements d'un même type et d'un même palier, à moins de quelques
  minutes d'écart, donnent une seule notification (« 5 propositions à trancher »).
- **Pas de chevauchement** : une seule file dans le core ; deux notifications ou deux prises de parole
  ne se recouvrent jamais.
- **La plage de nuit** (23 h à 7 h, réglable) : un événement urgent s'écrit au fil sans être dit, et part en
  notification sans son, quelle que soit la présence. Le rituel d'accueil ne le dit pas non plus.
- **Une carte urgente** n'est ni dite ni écrite au fil : elle sonne sur le téléphone, au bureau compris, sans son
  pendant la plage de nuit.
- **Une seule fois** : un événement déjà notifié ne l'est pas de nouveau après un redémarrage.
- **La lettre du matin** reprend les P3 de la nuit et rappelle les P2 encore en attente.
