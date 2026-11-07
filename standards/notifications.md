# Notifications

> Comment un événement de l'écosystème devient (ou non) une notification. Vaut pour le core et pour
> tous les satellites. Les événements eux-mêmes passent par le flux du
> [contrat satellite](contrat-satellite.md) ; ce standard fixe leur palier et leur rendu.

## Principe

- **Le satellite fixe le palier**, selon la nature de l'information, par des règles déterministes.
  Un LLM peut étiqueter (« urgent ») ; il ne fixe jamais le palier à lui seul.
- **Le core fixe le rendu**, selon le palier, la sourdine du bureau et la plage de nuit. Le satellite ne connaît ni
  l'une ni l'autre. Les modes (assistante, focus, silence) viendront après le MVP, sous forme de rôles éditables qui
  diront ce qui passe ; jusque-là, il n'y en a pas.
- **Le core est le seul à notifier** CrOliX sur ses appareils. Un front autonome peut notifier pour
  qui l'utilise sans Lun' ; ce n'est pas le parcours de CrOliX.
- **Annoncer est le rôle de Natsume** : par la voix au bureau, par une notification sur le téléphone.
  Le desktop n'a pas de notification système. Les compteurs sont communs à tous les supports.

## Les paliers

| Palier | `importance` | Rendu | Au MVP |
|---|---|---|---|
| **P0 · Interrompre** | `urgent` | vibration et son, notification en haut de l'écran | dit malgré la sourdine si « Dit à voix haute : P0 » est activé (le défaut), sinon en silence dans le fil et sur le téléphone ; jamais dit en appel ; la nuit (23 h à 7 h, réglable), sans son |
| **P1 · Prévenir** | `normal` | notification silencieuse dans le tiroir et pastille | la sourdine ne la touche pas : le téléphone la reçoit |
| **P2 · Signaler** | `low` | pastille ou compteur dans l'app, pas de notification système | — |
| **P3 · Résumer** | `info` | seulement dans le point du matin ou du soir | — |
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
| Le point du matin, posté | `morning.posted` | P1 |
| Une décision attendue sur une demande de CrOliX | carte à valider issue d'une délégation | P1 |
| Un avis de l'IA, sans règle | mail jugé urgent par le tri | P1, jamais P0 |
| Ce qui est dû dans la journée | tâche à échéance aujourd'hui | P2, en tête du point du matin |
| Ce qui attend un geste, sans heure | tri à valider, question du cerveau, proposition de la nuit | P2 |
| Ce qui s'est fait seul | mail rangé par une règle, fiche créée, veille tech | P3 |
| Un état technique | boîte ou agenda mis à jour, clé rétablie, prix inconnu | P4 |

Un nouveau type d'événement se classe par sa **nature** dans ce tableau, jamais par son émetteur.

## Rendu

- **Regroupement** : plusieurs événements d'un même type et d'un même palier, à moins de quelques
  minutes d'écart, donnent une seule notification (« 5 tris à valider »).
- **Pas de chevauchement** : une seule file dans le core ; deux notifications ou deux prises de parole
  ne se recouvrent jamais.
- **Une seule fois** : un événement déjà notifié ne l'est pas de nouveau après un redémarrage.
- **Le point du matin** reprend les P3 de la nuit et rappelle les P2 encore en attente.
