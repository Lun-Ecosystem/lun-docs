# Écriture

> Qui écrit quoi, et comment le code écrit ce qu'il montre ou dit à CrOliX : le Journal, « Ce que j'ai fait », les
> notifications, la voix fixe. Vaut pour le core et pour tous les satellites. Les mots viennent du
> [dictionnaire](dictionnaire.md) ; le ton des écrans, de [`design.md`](design.md). Décidé par CrOliX le 25/11/2026
> ([carte des flux](../docs/specs/2026-11-25-carte-des-flux-design.md), § 5.3 et § 5.5).

## La voix

- **Un texte rendu par l'écosystème a un seul auteur** : le modèle, à la première personne, ou le code, dans le registre
  neutre.
- **Seul le modèle dit « je »** et s'adresse à CrOliX (P4). Le code prépare les faits : des comptes, des
  regroupements.
- **Le code ne dit jamais « je » ni « tu »** sur une surface : il nomme ou s'écrit sans sujet. Son seul « tu » est
  celui de ses consignes au modèle (« Tu tiens à lui… »).
- **Pourquoi** : éviter une Natsume froide côté code et émotive côté modèle.

## Qui écrit quoi

| Texte | Auteur |
|---|---|
| La lettre du matin | le modèle, une fois, à heure fixe, depuis les faits préparés par le code (D6) |
| La conversation, la parole spontanée | le modèle |
| Le Journal | le code, une ligne à l'instant de l'action, jamais d'un coup |
| « Ce que j'ai fait » | le code, depuis le Journal ; jamais le modèle |
| Les notifications, l'annonce d'une urgence, la voix fixe | le code ; l'urgence reste une phrase fixe |
| Les phrases fixes d'un satellite, son agent compris | le code du satellite |

L'intitulé du panneau « Ce que j'ai fait » reste ouvert, puisque le code ne dit pas « je » :
à trancher ([carte des flux](../docs/specs/2026-11-25-carte-des-flux-design.md), § 10, question 5).

## Le registre neutre

La façon d'écrire du code : il nomme ou s'écrit sans sujet, jamais « je » ni « tu ». C'est le registre d'un
assistant, un entre-deux entre le froid et le personnel : présent ou passé composé, phrases courtes, aucun sujet
inutile. On écrit « Rangé en Facture par une règle », pas « J'ai rangé ce mail » ni « Ton mail est rangé ».

## Les huit règles

1. **Une ligne dit le fait, pas l'état du système.** On écrit « Lettre du matin : 3 cartes, 1 échéance, 2 mails
   rangés », pas « La lettre du matin est postée ».
2. **Un fait, une ligne.** Une action en plusieurs étapes reste une seule ligne ; ses étapes vont dans le détail. La
   nuit fait une seule ligne : « Nuit du 24/11 : 2 souvenirs, 1 observation envoyée, lettre écrite ».
3. **Le détail n'est jamais vide** : ce qui a été couvert, le résultat, la raison d'un échec, le coût et la durée, les
   références, le lien vers la conversation ou le mail.
4. **Une seule forme par fait**, au Journal, en notification et à la voix. La notification reprend le titre de la
   ligne ; son corps est la première ligne du détail.
5. **Le registre neutre d'un assistant** : présent ou passé composé, sans « je » ni sujet inutile. On écrit « Rangé
   en Facture par une règle ».
6. **Le satellite donne le fait, le core le complète** avec ce qu'il sait : l'expéditeur, la boîte, la synthèse,
   l'échéance.
7. **Un échec dit toujours sa raison**, en une ligne, partout.
8. **Le même vocabulaire partout**, celui du dictionnaire : « lettre du matin », une seule apostrophe, des pluriels
   écrits en entier.
