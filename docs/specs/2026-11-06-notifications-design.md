# Les notifications de l'écosystème : design

Date : 2026-11-06. Issue : lun-acedia#37. Part du standard [`notifications.md`](../../standards/notifications.md),
de l'[ADR 0007](../../adr/0007-stack-mobile-pwa.md) (PWA, Web Push) et du §3.8 de la
[spec des apps du core](2026-10-30-apps-core-design.md), qu'il complète et corrige sur les points du §8.

CrOliX a demandé de partir directement du standard. Ce qu'il a décidé en relisant est au §1. Le reste, quand le standard
ne le dit pas, est marqué **[choix Claude]**.

## 1. Intention

Rien ne prévient CrOliX aujourd'hui quand il est loin du bureau. Un rappel d'agenda, un mail qu'une de ses règles dit
urgent ou une clé refusée n'existent que pour qui ouvre l'app. L'écran du core le reconnaît : « Notifications non
activées. »

Décidé par CrOliX :

- **Annoncer est le rôle de Natsume.** Au bureau, elle le fait par la voix, dans Luxuria. **La notification push est sa
  version simplifiée sur le téléphone.** Le desktop n'en a pas besoin.
- **Les indicateurs sont communs** : l'app web et l'app mobile sont la même PWA. Une fiche validée sur le téléphone fait
  baisser le compteur sur le desktop.
- **Les notifications push restent indépendantes d'un support à l'autre** : rien n'a à les synchroniser.

## 2. Objectifs et non-objectifs

**Objectifs**

- Loin du bureau, un P0 ou un P1 atteint le téléphone, app fermée.
- Au bureau, c'est la voix qui annonce, et le téléphone se tait.
- Les règles du standard tiennent : regroupement, pas de chevauchement, une seule fois.

**Non-objectifs au MVP**

- Le push sur le desktop.
- Retirer une notification du téléphone parce que son sujet a été réglé ailleurs.
- Les actions directes sur la notification : un toucher ouvre l'app, et le geste s'y fait.
- Les modes focus et silence.
- Les notifications du front autonome d'un satellite : le standard les permet, ce n'est pas le parcours de CrOliX.
- Capacitor, et percer le mode Ne pas déranger : limite acceptée par l'ADR 0007.

**Anti-buts**, échecs même si tout marche :

- un même événement notifié deux fois, ou une rafale après un redémarrage ;
- une urgence dite à voix haute et poussée sur le téléphone en même temps ;
- une urgence que personne n'annonce : ni la voix, ni le téléphone ;
- un P0 décidé par le modèle, ou un appel au modèle pour décider d'une notification ;
- un compteur différent entre le téléphone et le desktop ;
- un rappel qui insiste, ou qui reste affiché pour un rendez-vous terminé.

## 3. Ce qui annonce quoi

| CrOliX | P0 | P1 | P2 à P4 |
|---|---|---|---|
| **Au bureau**, présence active | la voix, jamais le téléphone | rien, le compteur suffit | comme ailleurs |
| **Au bureau, occupé** : la voix ne peut pas parler | le téléphone, avec son | rien, le compteur suffit | comme ailleurs |
| **Loin**, pas de présence | le téléphone, avec son | le téléphone, silencieuse et regroupée | compteur, point du matin, Journal |

Une seule règle à l'envoi : **une notification part seulement si aucune présence ne l'a déjà prise en charge**. Un P1 né
au bureau ne repart pas plus tard : le compteur le porte **[choix Claude]**.

**Les rappels d'agenda et de tâches passent à la voix**, décidé par CrOliX. `announceP0` les exclut aujourd'hui : le core
dit désormais `agenda.reminder`, qui couvre les deux, avec une phrase sans « Urgent : ».

**Occupé, le téléphone sert de relais**, décidé par CrOliX : aucun mécanisme propre à ce cas.

## 3 bis. Les rappels dans la file

Proposé par CrOliX, à challenger : ce qui remonte au core pour son urgence reste visible, à marquer comme lu, avec le temps
restant. Le filet vaut surtout pour un rappel dit à voix haute et manqué, ou une notification balayée.

**Pas de nouveau type de carte [choix Claude]** : la file a déjà cet objet. Une urgence (`QueueUrgent`) a son bouton « Vu »,
son lien, sa date `due` et son entrée au Journal. Seuls les rappels en sont exclus. Le chantier retire cette exclusion
d'`urgentOf`, et le rappel prend le rendu d'une urgence.

- **Le temps restant** : calculé à l'affichage depuis `data.due` (« dans 12 min »). Le titre d'Acedia fige « dans 1 h » au
  moment de l'émission : Acedia ajoute à l'événement le nom seul du rendez-vous, que l'écran utilise. Sans lui, le titre sert.
- **Le départ de la file** : un rappel de rendez-vous part une fois l'heure passée. Un rappel de tâche, à la fin de la journée
  de Natsume, comme une urgence. Il n'attend pas un « Vu » pour un rendez-vous déjà terminé.
- **Plusieurs rappels d'un même rendez-vous** : seul le plus récent reste affiché.
- **La répétition : aucune mécanique ajoutée [choix Claude]**. Les rappels multiples de Google Agenda répètent déjà, chacun
  avec sa propre annonce. Répéter en plus jusqu'au « Vu » tournerait au harcèlement, et le fil de Natsume ne doit pas culpabiliser.
- **Dit à voix haute, il reste affiché [choix Claude]** : le dire ne prouve pas que CrOliX l'a entendu.
- **À vérifier au plan** : le rituel et la situation de Natsume lisent `urgentOf`, et « À venir » liste déjà les rappels.
  Ils ne doivent ni répéter le rappel ni l'annoncer deux fois.

## 4. Les indicateurs

Déjà en place, à garder et à prouver à la recette : un seul état dans le core, le compteur de la file (`queueCount`), et
l'événement `queue` du flux `/api/live`, publié par un geste et par une lecture qui change quelque chose.

- Une carte tranchée dans l'app baisse le compteur de tous les supports en moins de 2 s.
- Une carte tranchée dans le front du poste le baisse à la lecture suivante, 2 minutes au plus.

Aucun code n'est prévu ici, sauf si la recette montre un écart.

## 5. La file, dans le core

**Une seule entrée [choix Claude]** : la file lit `events` au-delà d'un curseur, où `importance` vaut `urgent` ou
`normal`. Les événements des satellites et ceux du core arrivent ainsi par le même chemin, et un redémarrage reprend là
où elle en était. À la première activation, le curseur part de l'événement le plus récent : rien d'ancien ne sort.

La carte en attente n'est pas un événement : la lecture qui la voit pour la première fois l'ajoute à la même file.

**Une seule fois** : chaque entrée a une clé unique (`event:<id>`, `card:<poste>:<id>`) dans une table. Ajouter une clé
connue ne fait rien.

**À l'envoi, la file vérifie** que l'alerte a encore un sens : pas déjà vue, carte encore en attente, pas de présence qui
la prend en charge (§3). Sinon, elle l'abandonne sans rien envoyer.

**Le rendu** :

| Palier | Sur le téléphone | Quand |
|---|---|---|
| P0 | son et vibration, en haut de l'écran | tout de suite |
| P1 | silencieuse, regroupée | après 2 minutes **[choix Claude]** |
| P2 à P4 | rien | |

**Le regroupement** : les P1 de même type dans la fenêtre donnent une seule notification (« 3 cartes à valider »). Une
notification de même type remplace la précédente, par son `tag`. Deux P0 restent deux notifications, chacune avec son
titre **[choix Claude]** : un rappel ne doit pas en masquer un autre.

**L'expiration [choix Claude]** : au-delà d'une heure, un P0 ne sonne plus ; au-delà de 24 h, un P1 ne part plus.
L'alerte reste dans l'app, seule la notification est abandonnée. Le même délai sert de TTL pour le service de push.

**La nuit [choix Claude]** : le standard dit « vibration seule » en silence ou la nuit, et les modes ne sont pas au MVP.
Seule la plage de nuit entre : réglable, 23 h à 7 h heure de Paris par défaut, désactivable. Pendant cette plage, un P0
part sans son.

## 6. Web Push

- **La bibliothèque [choix Claude]** : le paquet `web-push`, seule dépendance ajoutée. Le chiffrement du contenu et la
  signature VAPID ne s'écrivent pas à la main. Licence à confirmer au plan (MPL-2.0 attendue).
- **Les clés VAPID** : créées à la première activation, gardées chiffrées comme les autres secrets du core. Leur sujet est
  une adresse du projet, jamais l'adresse mail de CrOliX.
- **Les abonnements** : une table liée à l'appareil appairé (`clients`). Révoquer un appareil supprime son abonnement. Un
  service qui répond 404 ou 410 fait supprimer l'abonnement ; une autre erreur est retentée jusqu'à l'expiration.
- **La frontière de confiance** : l'adresse d'un abonnement vient du client et le core l'appelle. Elle est validée :
  `https`, et un service de push connu (Google, Mozilla, Apple, Microsoft).
- **Le contenu** : titre, texte, lien, `tag`, chiffrés de bout en bout par Web Push. Le service de push voit l'appareil et
  l'heure, pas le contenu. Aucun jeton dans le message.
- **Le service worker** : le mode `generateSW` reste. Un petit `push-sw.js` s'y ajoute par `workbox.importScripts`, pour
  `push` et `notificationclick`.
- **App au premier plan sur le téléphone** : un P0 s'affiche quand même, un P1 non, le compteur bouge déjà
  **[choix Claude]**. Aucun bandeau à construire.
- **Le toucher** ouvre ou focalise l'app sur le lien : l'adresse de la carte ou de l'urgence dans l'app du core
  (`/app/?carte=…`), `/app/` à défaut. Le geste et l'état « vu » passent ainsi par le core.
- **À l'ouverture de l'app**, elle ferme les notifications de son appareil : l'écran dit déjà l'état réel.

**Les sources à créer** : quatre événements du core, déjà prévus au §3.8, chacun émis au changement d'état, jamais à
chaque tentative.

| Événement | Palier | Une seule fois par |
|---|---|---|
| `morning.posted` : point du matin posté | P1 | jour |
| `routine.failed` : routine en échec | P1 | exécution |
| `post.unreachable` : poste injoignable depuis plus de 15 minutes **[choix Claude]** | P1 | panne |
| `cap.reached` : plafond du jour atteint | P1 | jour et plafond |

Et la carte à valider en attente, P1, par la lecture (§5).

## 7. L'écran

Atelier > Notifications, avec les briques du kit, dont le titre dit déjà « Les urgences sur ce téléphone » :

- **Au téléphone** : un interrupteur qui demande la permission du navigateur, avec une phrase pour la rétablir s'il refuse ;
  **Envoyer un essai**, une notification réelle ; **La nuit**, l'interrupteur et les deux heures.
- **Au desktop**, au-dessus du seuil de 768 px : une phrase dit que le bureau passe par la voix et les compteurs,
  sans interrupteur. Elle ne nomme aucune appli qui ne soit pas installée **[choix Claude]**.

Le texte « Notifications non activées. » dans Dépenses suit l'état réel.

## 8. Écarts avec le §3.8 de la spec des apps

| §3.8 | Ici | Pourquoi |
|---|---|---|
| Colonne Desktop : notification système, bandeau | Pas de push au desktop, pas de bandeau | Décision de CrOliX : au bureau, la voix annonce |
| Une alerte vue quitte tous les appareils | Les notifications push sont indépendantes | Décision de CrOliX ; les compteurs, eux, restent communs |
| P0 avec actions directes | Un toucher ouvre l'app | Le jeton de l'appareil n'est pas à portée du service worker, et l'y mettre n'en vaut pas le risque |
| Sans modes au MVP | La plage de nuit entre | Un P0 qui sonne à 3 h est un échec, avec le core en continu |

## 9. Recette

**Vérifiable sur un poste, sur `localhost`, sans NAS**, Chrome en fenêtre étroite (un contexte sûr, sous le seuil) :

1. Activer l'appareil, envoyer un essai : la notification arrive, app fermée.
2. Sans présence, un P0 : notification immédiate. Le toucher ouvre l'urgence, et le geste « vu » fonctionne.
3. Sans présence, 3 P1 de même type en moins de 2 minutes : une seule notification, qui les compte.
4. Présence active, un P0 : dit à voix haute, aucune notification. Présence occupée : une notification.
5. Présence active, un P1 : aucune notification, le compteur monte. La présence finie, rien ne repart.
6. Présence active, un rappel d'agenda : il est dit à voix haute.
7. Redémarrer le core après un envoi : rien ne repart. Rejouer le même événement : rien ne part.
8. Core coupé 2 h avec un P0 dedans : pas de notification au retour, l'alerte est dans la file.
9. Une carte en attente de regroupement, tranchée avant l'envoi : rien ne part.
10. Dans la plage de nuit : un P0 part sans son.
11. Un abonnement répondant 410 est supprimé. Révoquer un appareil supprime le sien.
12. Une adresse d'abonnement hors des services connus est refusée.
13. Deux fenêtres : une carte tranchée dans l'une baisse le compteur de l'autre en moins de 2 s.
14. Un rappel à venir : il est dans la file avec son temps restant, qui baisse. « Vu » le retire de tous les supports.
15. Un rendez-vous passé : son rappel quitte la file sans geste. Deux rappels du même rendez-vous : un seul affiché.
16. Le rituel et « À venir » ne répètent pas un rappel déjà dans la file.

**Sur le vrai téléphone**, quand le core lui est joignable en HTTPS :

17. PWA installée, écran verrouillé : un P0 sonne et vibre, un P1 reste silencieux.
18. **Le risque du chantier** : ce qu'Android respecte vraiment entre `silent` et `vibrate`. Il peut imposer les réglages
    du canal de l'app. Si « vibration seule » n'est pas possible, la nuit reste silencieuse.

## 10. Découpage

Trois tranches dans `lun-anima`, sur une seule branche et une seule PR. Chez les satellites, un seul ajout : le nom du
rendez-vous sur `agenda.reminder`, dans une PR de `lun-acedia`. Les événements portent déjà leur palier.

1. **La chaîne** : clés, abonnements, service worker, écran, essai. Recette 1, 11, 12.
2. **La file** : curseur, une seule fois, regroupement, présence, nuit, expiration, rappel à la voix, rappels dans la file. Recette 2 à 10, 13 à 16.
3. **Les sources** : les quatre événements et la carte en attente. Le classement du standard reçoit les lignes, déjà
   ajoutées avec cette spec.

## 11. Laissé au constructeur

- La cadence de lecture de la file et le découpage en fichiers.
- Le texte exact des notifications et de la phrase du rappel, selon la voix de l'écran et sans em dash.
