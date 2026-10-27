# Notifications

> Comment un événement de l'écosystème devient (ou non) une notification. Vaut pour le core et pour
> tous les satellites. Les événements eux-mêmes passent par le flux du
> [contrat satellite](contrat-satellite.md) ; ce standard fixe leur palier et leur rendu.

## Principe

- **Le satellite fixe le palier**, selon la nature de l'information, par des règles déterministes.
  Un LLM peut étiqueter (« urgent ») ; il ne fixe jamais le palier à lui seul.
- **Le core fixe le rendu**, selon le palier et le mode actif. Le satellite ne connaît pas les modes.
- **Le core est le seul à notifier** CrOliX sur ses appareils. Un front autonome peut notifier pour
  qui l'utilise sans Lun' ; ce n'est pas le parcours de CrOliX.

## Les paliers

| Palier | `importance` | Rendu | Modes |
|---|---|---|---|
| **P0 · Interrompre** | `urgent` | vibration et son, notification en haut de l'écran | passe en focus ; en silence ou la nuit, vibration seule |
| **P1 · Prévenir** | `normal` | notification silencieuse dans le tiroir et pastille | attend la fin du focus |
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
