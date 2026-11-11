# Le blanc pendant qu'un poste travaille. Cadrage

> Cadrage du 11/11, à discuter avec CrOliX **avant tout plan**. Suite de l'étude
> [« La présence : où nous en sommes »](2026-11-10-presence-etat-comparaison.md), § 3.5. Les choix marqués
> **[avis Claude]** sont des propositions. Rien n'est codé.

## 1. Le besoin

À la voix, quand Natsume confie une demande à un poste (les mails, l'agenda, la mémoire), on n'entend rien jusqu'à ce
qu'elle dise le résultat. C'est le plus long silence d'une conversation : le poste fait lui-même un appel à un modèle,
puis elle en fait un second pour dire ce qu'il a rendu. La veille l'avait déjà noté (C2).

## 2. Ce que le serveur fait aujourd'hui

Relu le 11/11 sur `main` de Lun'Anima.

1. Son premier appel au modèle peut rendre du texte et un appel d'outil. Le texte rendu à côté de l'appel part déjà
   à la voix, phrase par phrase : rien ne l'empêche de dire un mot avant de déléguer.
2. Rien ne le lui demande. La consigne dit seulement d'appeler l'outil avec une demande complète, sans demander de
   confirmation. En pratique elle appelle l'outil sans un mot.
3. Le serveur attend le poste, jusqu'à 120 s au plus.
4. Un second appel au modèle lui fait dire le résultat, à sa façon.
5. La durée d'une délégation n'est écrite nulle part : on sait qu'elle a eu lieu, pas combien de temps elle a pris.
   **Nous n'avons donc aucun chiffre sur ce blanc.**

Côté Lun'Luxuria, pendant ce temps : l'indicateur « elle réfléchit » reste allumé, et depuis le 11/11 une phrase dite
pendant l'attente retient ou reprend la réponse au lieu de lancer une seconde délégation.

## 3. Ce que font les autres

- **LiveKit Agents** : si une étape dure, une phrase d'attente part, puis d'autres à intervalle régulier. Les
  phrases sont fixes ou produites par un petit modèle.
- **Pipecat** : peut rendre la personne « muette » le temps de l'appel, pour qu'une phrase dite pendant l'attente ne
  relance pas tout. Ce cas est déjà traité chez nous autrement (le tour de parole, 10/11).
- **Open-LLM-VTuber, AIRI** : rien de particulier ; l'avatar garde une pose d'attente.

## 4. Les quatre façons de combler le blanc

| | Façon | Pour | Contre |
|---|---|---|---|
| A | **Elle le dit elle-même** : la consigne lui demande une courte phrase avant d'appeler un poste (« Je regarde tes mails. ») | Ses mots, son ton. Aucun minuteur, aucun appel de plus : la phrase sort du premier appel, avant l'outil. Rien à changer dans Lun'Luxuria. Le premier son arrive plus tôt. | Le modèle peut l'oublier, ou la dire même quand le poste répond en une seconde. À mesurer sur le vrai modèle. |
| B | **Une phrase fixe du code**, si le poste dépasse un délai | Sûr : elle part toujours, et seulement si l'attente dure. | Une phrase de nous dans sa bouche, toujours la même. Contraire à ce qui a été tenu jusqu'ici : son écriture n'est pas figée, et le code ne parle à sa place que pour trancher une carte. |
| C | **Des phrases de relance à intervalle** (LiveKit), pour une attente longue | Couvre les postes lents. | Mêmes défauts que B, en pire ; inutile tant qu'on ne sait pas combien dure une délégation. |
| D | **Sans mots** : l'avatar et l'écran montrent qu'un poste travaille, et lequel | Rien à faire dire. | Ne comble pas le blanc pour qui n'a pas l'écran sous les yeux ; l'avatar n'existe pas encore. |

## 5. Proposition **[avis Claude]**

1. **Mesurer d'abord** : écrire la durée de chaque délégation (elle manque aussi au Journal et au coût). Une ligne.
2. **A, par la consigne** : une courte phrase avant tout appel à un poste, qui dit ce qu'elle va faire, sans promettre
   le résultat. Prouvé d'abord sur le laptop, sur le vrai modèle : vingt demandes qui relèvent d'un poste, vingt qui
   n'en relèvent pas ; compter les phrases d'attente dites, oubliées, et dites à tort. Si elle l'oublie plus d'une
   fois sur cinq, on le dit et on passe au point 3.
3. **B seulement en filet**, si A ne tient pas : une phrase du code après un délai tiré des durées mesurées, choisie
   parmi quelques-unes que CrOliX aura écrites lui-même.
4. **C et D attendent** : C les chiffres du point 1, D l'avatar.

Tout se passe dans Lun'Anima ; Lun'Luxuria ne change pas.

## 6. À trancher par CrOliX

- **Une phrase d'elle (A) ou une phrase fixe (B) ?** Je recommande A, avec B en filet seulement si la mesure le
  demande.
- **À l'écrit aussi ?** La consigne vaudrait pour toute surface : dans le fil d'Acedia ou du core, « Je regarde tes
  mails. » s'afficherait avant le résultat. Je recommande de la limiter à la voix : à l'écrit, l'écran montre déjà
  qu'elle travaille.

## 7. Hors périmètre

- « Attendre par le sens » (« attends, laisse-moi réfléchir ») : le cadrage suivant.
- Raccourcir la délégation elle-même (le poste, le second appel) : c'est la latence, lun-luxuria#48.

## 8. Limites

- Aucune durée de délégation n'est mesurée à ce jour : l'ampleur du blanc est une impression, pas un chiffre.
- Ce que dit ce cadrage du comportement du modèle (« elle appelle l'outil sans un mot ») vient de la lecture de la
  consigne et des essais passés, pas d'un comptage.
