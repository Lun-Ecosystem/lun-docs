# Les échanges de l'écosystème Lun'

> Tous les échanges du système, rangés par scénario : qui parle à qui, par quoi, avec quelles données, ce qui
> revient, ce que CrOliX en voit. Relevé dans le code le 27/11/2026, à la demande de CrOliX (lun-docs#236), pour
> avoir une version unique et structurée des flux, et non une partie ciblée.
>
> **Ce document décrit ce que le code fait, pas ce qui est voulu.** Les décisions prises le même jour (F1 à F7,
> [carte des flux relevée](../specs/2026-11-27-carte-des-flux-relevee.md), § 9) ne sont pas codées : chaque fiche dit
> où l'existant s'en écarte.

## Comment le lire

307 scénarios en treize familles. Un scénario a un déclencheur précis, une suite d'échanges et une fin. Chaque
fiche a la même forme :

- **Déclencheur**, **Acteurs**, **Avant** : ce qui lance le scénario et ce qui doit être vrai.
- **Le schéma** de l'échange, puis **le tableau** des étapes : de qui vers qui, par quelle route ou quel événement,
  avec quels champs, et ce qui revient.
- **Ce que CrOliX voit, et où** ; **ce qui s'écrit** ; **qui décide** (du code, un modèle, CrOliX).
- **Erreurs et cas limites**.
- **Écart avec les décisions** : F1 à F7, la direction « prérequis », ou un trou T1 à T31 de la carte.
- **Non vérifié** : ce qui n'a pas pu être lu ou confirmé dans le code.

Les identifiants (`S3.7`) sont stables : ils servent à citer un scénario dans une issue ou un plan.

## Les familles

| # | Famille | Scénarios |
|---|---|---|
| 1 | [La conversation, écrite et parlée](01-conversation.md) | 28 |
| 2 | [La demande confiée à un poste et sa carte](02-demande-a-un-poste.md) | 18 |
| 3 | [Trancher une carte](03-trancher.md) | 21 |
| 4 | [Les mails entrants : règle, tri, urgence](04-mails-entrants.md) | 28 |
| 5 | [L'agenda, les tâches, les rappels](05-agenda-taches-rappels.md) | 25 |
| 6 | [La nuit et la lettre du matin](06-nuit-et-lettre.md) | 20 |
| 7 | [La bibliothèque](07-bibliotheque.md) | 24 |
| 8 | [La présence et la parole](08-presence-et-parole.md) | 21 |
| 9 | [Plusieurs surfaces en même temps](09-plusieurs-surfaces.md) | 18 |
| 10 | [La pause, les plafonds, les coûts](10-pause-plafonds-couts.md) | 25 |
| 11 | [Les pannes](11-pannes.md) | 20 |
| 12 | [L'appairage et la santé des postes](12-appairage-et-sante.md) | 27 |
| 13 | [Chaque satellite utilisé seul](13-satellite-seul.md) | 32 |

## D'où il vient, et ses limites

- **Lu sur `origin/main`** : le core à `dc130d9`, Lun'Acedia à `40c293f`, Lun'Avaritia à `bd6f7cf`, Lun'Luxuria à
  `8afe402`. Un commit postérieur peut le contredire : le code a raison.
- **Rien n'a été rejoué.** Aucun serveur lancé, aucun test, aucune trace de la prod : tout vient de la lecture du code
  et de ses tests. Un ordre d'arrivée entre deux machines est donc déduit, jamais observé.
- **Écrit puis vérifié.** Un agent a rédigé chaque famille depuis le code ; un second, qui ne l'avait pas vu
  travailler, a repris chaque affirmation contre le code : 2 311 affirmations relues, 140
  corrigées, 82 ni prouvées ni réfutées et rangées sous « Non vérifié » de leur fiche.
- **Le core est privé.** Il est décrit ici par son comportement. Ses références (fichiers, routes, champs exacts) sont
  dans une annexe par famille, sous les mêmes identifiants, sur l'issue privée lun-anima#135.
- **Couverture contrôlée par recherche** : chaque route du contrat `/lun/v1` des satellites, chaque événement qu'ils
  émettent, chaque appel de Lun'Luxuria au serveur et chaque route du core figure dans au moins une fiche ou son
  annexe. Deux manques connus : le téléchargement d'une pièce jointe dans l'écran de Lun'Acedia n'a pas de fiche, et
  sept actions du catalogue de Lun'Acedia ne sont nommées dans aucun scénario (elles sont dans la table plus bas).
- **Les exemples sont inventés** : aucun mail, nom ou événement réel.

## Tous les scénarios

### 1 · La conversation, écrite et parlée

[01-conversation.md](01-conversation.md)

- `S1.1` Écrire à Natsume depuis le panneau
- `S1.2` Assembler le tour et appeler le fournisseur du modèle
- `S1.3` Écrire dans un sujet
- `S1.4` Deux messages coup sur coup
- `S1.5` Écrire depuis le terminal
- `S1.6` Écrire dans le fil de Lun'Luxuria
- `S1.7` Le tour parlé
- `S1.8` L'émotion par phrase
- `S1.9` Envoyer à une pause, puis retirer
- `S1.10` Une phrase qui n'est pas pour elle
- `S1.11` Parler par-dessus sa réponse
- `S1.12` Faire taire
- `S1.13` Reparler avant d'avoir entendu la réponse
- `S1.14` Le service voix en défaut
- `S1.15` La réponse qui ne vient pas, vue de Lun'Luxuria
- `S1.16` Relire sa journée
- `S1.17` Lire une carte
- `S1.18` Trancher une carte par un message
- `S1.19` Dire « annule »
- `S1.20` Confier une demande à un poste
- `S1.21` La conversation non configurée
- `S1.22` Clé refusée ou crédit épuisé
- `S1.23` Fournisseur injoignable ou flux cassé
- `S1.24` Réponse refusée, vide, ou historique refusé
- `S1.25` Plafond atteint
- `S1.26` Le client part, le core redémarre
- `S1.27` Ce qui reste d'un tour
- `S1.28` Un outil appelé sans avoir été offert

### 2 · La demande confiée à un poste et sa carte

[02-demande-a-un-poste.md](02-demande-a-un-poste.md)

- `S2.1` Confier une action à Lun'Acedia : une carte
- `S2.2` Demander une lecture à Lun'Acedia : aucune carte
- `S2.3` Une demande, plusieurs cartes
- `S2.4` Répondre à un mail : la carte qui envoie
- `S2.5` Demande incomplète ou ambiguë : la question de l'agent
- `S2.6` « Note ça » : confier une note à Lun'Avaritia
- `S2.7` Interroger la bibliothèque : aucune carte
- `S2.8` La carte à options de Lun'Avaritia
- `S2.9` Demande dite à voix haute : la phrase d'attente
- `S2.10` Le poste est en pause
- `S2.11` L'agent du poste ne peut pas travailler
- `S2.12` Plafond du jour d'un poste, tenu par le core
- `S2.13` Délai dépassé
- `S2.14` Poste injoignable ou liaison à refaire
- `S2.15` Appel ou réponse illisible
- `S2.16` Le core ne peut pas redire le résultat
- `S2.17` Lire le catalogue d'un poste
- `S2.18` Invoquer une action directe

### 3 · Trancher une carte

[03-trancher.md](03-trancher.md)

- `S3.1` Valider ou refuser une carte à la main
- `S3.2` Ce que Lun'Acedia fait d'une carte de son agent
- `S3.3` Trancher une proposition de tri depuis le core
- `S3.4` Trancher une carte de Lun'Avaritia depuis le core
- `S3.5` La carte qui envoie
- `S3.6` Annuler dans les 5 secondes, à la main
- `S3.7` Valider ensemble, et la pile de cartes de même nom
- `S3.8` Lire une carte dans la conversation
- `S3.9` Trancher dans la conversation écrite
- `S3.10` Trancher à la voix
- `S3.11` Le geste que les mots ne portent pas
- `S3.12` Annuler par la parole, ou par une coupure
- `S3.13` La carte déjà tranchée ailleurs
- `S3.14` La carte disparue ou expirée
- `S3.15` L'exécution échoue chez le poste
- `S3.16` Le poste est muet ou injoignable
- `S3.17` Le core redémarre pendant un geste
- `S3.18` Trancher une proposition dans l'écran de Lun'Acedia
- `S3.19` Trancher une carte de l'agent dans l'écran de Lun'Acedia
- `S3.20` Trancher un brouillon dans l'écran de Lun'Avaritia
- `S3.21` Les autres gestes tenus : Vu, C'est fait, Plus tard

### 4 · Les mails entrants : règle, tri, urgence

[04-mails-entrants.md](04-mails-entrants.md)

- `S4.1` Synchroniser la boîte avec Gmail
- `S4.2` Première connexion et relecture complète
- `S4.3` Mail qui n'entre pas dans le tri
- `S4.4` Créer une règle
- `S4.5` Ranger un mail par une règle
- `S4.6` Urgence par une règle, CrOliX au bureau
- `S4.7` Urgence, CrOliX absent
- `S4.8` Urgence pendant la plage de nuit
- `S4.9` Urgence au bureau, non dite
- `S4.10` Alertes urgentes coupées pour le poste
- `S4.11` « Vu » sur une urgence
- `S4.12` Proposition de tri du modèle
- `S4.13` Mail jugé urgent par le modèle
- `S4.14` Rangement seul par le modèle
- `S4.15` Mail sans règle et sans modèle
- `S4.16` Tri en pause
- `S4.17` Crédit épuisé ou clé refusée pendant le tri
- `S4.18` Échec du tri d'un mail
- `S4.19` Autorisation Google à renouveler, compte absent
- `S4.20` Le flux d'événements vers le core
- `S4.21` Les lectures du core chez Lun'Acedia
- `S4.22` Événement « à prévenir »
- `S4.23` Lire un mail, marquer lu ou non lu
- `S4.24` Ranger, archiver, corbeille, spam à la main
- `S4.25` Écrire et envoyer un mail depuis l'écran
- `S4.26` Reprendre un brouillon et l'envoyer
- `S4.27` Un compte Google, plusieurs adresses
- `S4.28` Première liaison au core : rejeu des événements gardés

### 5 · L'agenda, les tâches, les rappels

[05-agenda-taches-rappels.md](05-agenda-taches-rappels.md)

- `S5.1` Synchroniser l'agenda et les tâches avec Google
- `S5.2` Un événement ou une tâche modifiés chez Google
- `S5.3` Les agendas agrégés, l'agenda par défaut, les listes
- `S5.4` Une synchro qui échoue
- `S5.5` Changer de compte Google
- `S5.6` Afficher l'agenda et les tâches dans l'écran de Lun'Acedia
- `S5.7` Créer ou modifier un événement depuis l'écran de Lun'Acedia
- `S5.8` Créer ou modifier une tâche depuis l'écran de Lun'Acedia
- `S5.9` Cocher ou décocher une tâche
- `S5.10` Supprimer un événement ou une tâche depuis l'écran de Lun'Acedia
- `S5.11` Demander à l'agent de Lun'Acedia, dans son écran
- `S5.12` Le core lit l'agenda et les tâches
- `S5.13` « Ce qui vient » : le Bureau, l'accueil, la lettre du matin
- `S5.14` Le rappel d'un événement, CrOliX au bureau
- `S5.15` Le rappel d'une tâche due aujourd'hui
- `S5.16` Le rappel quand CrOliX est absent
- `S5.17` Le rappel pendant la plage de nuit
- `S5.18` Le rappel pendant un appel, ou quand l'annonce à voix haute est coupée
- `S5.19` Le rappel pendant une pause
- `S5.20` Voir un rappel dans À trancher, et le marquer « Vu »
- `S5.21` Un rappel manqué : Lun'Acedia arrêtée
- `S5.22` Un rappel reçu en retard par le core
- `S5.23` Un conflit d'agenda détecté : la carte
- `S5.24` Déconnecter Google depuis les Réglages d'Acedia
- `S5.25` Annuler une action faite par l'agent d'Acedia

### 6 · La nuit et la lettre du matin

[06-nuit-et-lettre.md](06-nuit-et-lettre.md)

- `S6.1` La nuit de 5 h, cas nominal
- `S6.2` Le bilan du jour lu chez Lun'Acedia
- `S6.3` L'envoi des observations à la bibliothèque
- `S6.4` Le traitement du lot par Lun'Avaritia
- `S6.5` Un lot retenu ou en échec chez Lun'Avaritia
- `S6.6` Les dernières étapes de la nuit
- `S6.7` Nuit incomplète : un poste absent ou éteint
- `S6.8` Nuit en échec
- `S6.9` Jour sans rien
- `S6.10` La lettre du matin, cas nominal
- `S6.11` Lettre déjà écrite : la relance et sa note
- `S6.12` Nuit encore en cours à l'heure de la lettre
- `S6.13` Lettre en échec ou écrite sans le modèle
- `S6.14` Routine sautée sous une pause
- `S6.15` Core arrêté ou redémarré
- `S6.16` Lancer une routine à la main
- `S6.17` Lire la lettre et l'état des routines
- `S6.18` L'entretien à intervalle fixe
- `S6.19` Routine lancée à la main qui tourne encore au créneau
- `S6.20` Poste qui accepte l'appel sans jamais répondre

### 7 · La bibliothèque

[07-bibliotheque.md](07-bibliotheque.md)

- `S7.1` Recevoir le lot de la nuit
- `S7.2` Traiter un lot : le tri, puis la rédaction
- `S7.3` Un lot retenu, puis repris
- `S7.4` Un lot en échec
- `S7.5` Observation écartée, fait déjà connu, question déjà posée
- `S7.6` Une carte de la bibliothèque arrive au core
- `S7.7` Valider une fiche dans l'écran de Lun'Avaritia
- `S7.8` Refuser un brouillon, puis le rétablir
- `S7.9` Répondre à une question
- `S7.10` Une note ou un document déposé par CrOliX
- `S7.11` Importer un coffre Obsidian
- `S7.12` Natsume dit « note ça »
- `S7.13` Natsume cherche dans la bibliothèque en conversation
- `S7.14` Le contexte du matin : la recherche par mots-clés
- `S7.15` Une échéance : le core la lit
- `S7.16` « C'est fait » ou « Plus tard » sur une échéance
- `S7.17` Parcourir, corriger et exporter dans l'écran
- `S7.18` L'agent de l'écran de Lun'Avaritia
- `S7.19` Le bilan et le Tableau
- `S7.20` Le plafond mensuel de coût
- `S7.21` Une clé de fournisseur refusée, qui expire, rétablie
- `S7.22` La copie de la base échoue
- `S7.23` La pause, du core ou locale
- `S7.24` La bibliothèque ne répond pas

### 8 · La présence et la parole

[08-presence-et-parole.md](08-presence-et-parole.md)

- `S8.1` Arrivée : la présence et l'accueil
- `S8.2` Retour rapide : « Te revoilà. »
- `S8.3` Le battement de 30 s
- `S8.4` Départ, absence et retour
- `S8.5` Un appel en cours
- `S8.6` Une urgence dite à voix haute
- `S8.7` Une urgence qui n'est pas dite
- `S8.8` La parole spontanée
- `S8.9` Ce que Lun'Luxuria dit ou jette
- `S8.10` La sourdine
- `S8.11` CrOliX parle par-dessus
- `S8.12` « Faire taire »
- `S8.13` Le micro coupé ou qui ne s'ouvre pas
- `S8.14` Le flux coupé, puis repris
- `S8.15` « Annule » dit à la voix
- `S8.16` Un « oui » ou un « non » dit à la voix
- `S8.17` La transcription
- `S8.18` La synthèse et la conversion de voix
- `S8.19` Démarrer et surveiller le service voix
- `S8.20` L'émotion par phrase
- `S8.21` La fenêtre et ses états

### 9 · Plusieurs surfaces en même temps

[09-plusieurs-surfaces.md](09-plusieurs-surfaces.md)

- `S9.1` Ouvrir une surface : s'abonner au flux en direct
- `S9.2` Ce que le flux en direct porte
- `S9.3` Écrire sur le téléphone, Lun'Luxuria ouverte
- `S9.4` Parler à Lun'Luxuria, le panneau ouvert
- `S9.5` Un tour parlé en cours, vu du téléphone
- `S9.6` Deux surfaces écrivent en même temps
- `S9.7` Une carte tranchée sur une surface, vue sur les autres
- `S9.8` Une décision prise dans l'écran d'un poste
- `S9.9` Une phrase dite à voix haute : qui l'entend
- `S9.10` La présence de Lun'Luxuria pendant que le téléphone est en main
- `S9.11` Abonner un téléphone aux notifications
- `S9.12` Envoyer une notification
- `S9.13` Une notification retenue ou close
- `S9.14` Ouvrir une notification sur le téléphone
- `S9.15` Les compteurs et pastilles communs
- `S9.16` Le retour au PC après le téléphone
- `S9.17` Une surface revient après une coupure du flux
- `S9.18` Un appareil révoqué

### 10 · La pause, les plafonds, les coûts

[10-pause-plafonds-couts.md](10-pause-plafonds-couts.md)

- `S10.1` Mettre Natsume en pause à la main
- `S10.2` Reprendre, et reprendre sous un plafond
- `S10.3` Ce que la pause arrête et laisse passer, chez le core
- `S10.4` Le relais de la pause aux postes
- `S10.5` Ce qu'un poste fait sous la pause du core
- `S10.6` La pause propre d'un poste
- `S10.7` Une demande confiée à un poste en pause
- `S10.8` Le tri des mails pendant une pause
- `S10.9` Les lots de la bibliothèque, en pause ou au plafond
- `S10.10` Compter le coût d'un tour de conversation
- `S10.11` Le coût d'un tour coupé ou en échec
- `S10.12` Le coût d'une demande confiée à un poste
- `S10.13` La lecture des dépenses des postes
- `S10.14` Voir les dépenses
- `S10.15` D'où viennent les prix
- `S10.16` Régler les plafonds
- `S10.17` Plafond du jour atteint, avec pause
- `S10.18` Plafond du mois atteint
- `S10.19` « Prévenir seulement » et l'alerte à 80 %
- `S10.20` Le plafond d'un poste, fixé par le core
- `S10.21` Les plafonds propres aux postes
- `S10.22` La nuit : son plafond, la pause, le plafond atteint
- `S10.23` Lun'Luxuria : plafond seule, plafond du core relié
- `S10.24` Le changement de jour et de mois
- `S10.25` Crédit épuisé chez Lun'Acedia : le tri par l'IA s'arrête

### 11 · Les pannes

[11-pannes.md](11-pannes.md)

- `S11.1` Une alerte, de l'événement à CrOliX
- `S11.2` Un poste injoignable : le flux coupé, puis repris
- `S11.3` Un poste muet depuis 15 minutes : l'alerte
- `S11.4` Liaison à refaire : jeton refusé ou illisible
- `S11.5` Un poste qui répond mais dont les lectures échouent
- `S11.6` Le core arrêté ou redémarré, vu des postes et des réponses
- `S11.7` Le core injoignable, vu du panneau
- `S11.8` Le core injoignable, vu de Lun'Luxuria
- `S11.9` Le core tombe sur une erreur imprévue
- `S11.10` La base refuse d'écrire
- `S11.11` La clé du fournisseur du modèle est refusée (core)
- `S11.12` Le crédit du fournisseur est épuisé (core)
- `S11.13` Le fournisseur est injoignable, lent ou refuse une requête
- `S11.14` La conversation ne peut plus être configurée
- `S11.15` Une clé qui va expirer
- `S11.16` Clé refusée ou crédit épuisé chez un poste
- `S11.17` Google : l'autorisation est à renouveler
- `S11.18` Google : compte non branché, jeton illisible, quota, panne
- `S11.19` La copie de la base rate
- `S11.20` La voix de Lun'Luxuria en panne

### 12 · L'appairage et la santé des postes

[12-appairage-et-sante.md](12-appairage-et-sante.md)

- `S12.1` Relier un satellite par sa page d'autorisation
- `S12.2` Relier un satellite par un code, depuis le panneau
- `S12.3` Le verrou du satellite
- `S12.4` Le premier appareil du panneau
- `S12.5` Ajouter un appareil depuis un appareil reconnu
- `S12.6` Relier Lun'Luxuria au serveur
- `S12.7` Un code d'appareil refusé, et le verrou du core
- `S12.8` Chaque appel, authentifié
- `S12.9` Révoquer un appareil
- `S12.10` Le satellite retire le core : « Liaison à refaire »
- `S12.11` Délier un poste
- `S12.12` Ouvrir le flux d'événements d'un poste
- `S12.13` Flux coupé, puis repris
- `S12.14` La santé d'un poste et ce que le core en déduit
- `S12.15` Vérifier un poste maintenant
- `S12.16` Ce que le panneau montre de la liaison
- `S12.17` La version annoncée et la compatibilité
- `S12.18` Démarrer le core
- `S12.19` Jetons illisibles : la clé de chiffrement manque ou a changé
- `S12.20` La santé du core lui-même
- `S12.21` Connecter le compte Google de Lun'Acedia
- `S12.22` Déconnecter le compte Google
- `S12.23` L'autorisation Google est à renouveler
- `S12.24` Le flux du serveur côté Lun'Luxuria
- `S12.25` Relier à nouveau un poste déjà lié
- `S12.26` Relier un satellite par un code, depuis le terminal du core
- `S12.27` Donner au core l'adresse du front d'un poste

### 13 · Chaque satellite utilisé seul

[13-satellite-seul.md](13-satellite-seul.md)

- `S13.1` Première connexion d'un satellite seul
- `S13.2` Lun'Acedia seule : ouvrir ses écrans
- `S13.3` Lun'Acedia seule : demander à l'agent, mode « à valider »
- `S13.4` Lun'Acedia seule : l'agent en mode « faire tout de suite »
- `S13.5` Lun'Acedia seule : trancher une carte de l'agent
- `S13.6` Lun'Acedia seule : annuler une action faite
- `S13.7` Lun'Acedia seule : l'agent ne peut pas répondre
- `S13.8` Lun'Acedia seule : la carte de conflit d'agenda
- `S13.9` Lun'Acedia seule : la pause
- `S13.10` Lun'Acedia seule : ses notifications
- `S13.11` Lun'Acedia seule : ses réglages
- `S13.12` Lun'Acedia seule : les droits de l'agent
- `S13.13` Lun'Avaritia seule : ouvrir ses écrans
- `S13.14` Lun'Avaritia seule : écrire une note ou déposer un document
- `S13.15` Lun'Avaritia seule : importer un coffre Obsidian
- `S13.16` Lun'Avaritia seule : valider un brouillon ou répondre à une question
- `S13.17` Lun'Avaritia seule : refuser, puis annuler dans les 30 secondes
- `S13.18` Lun'Avaritia seule : modifier une fiche à la main
- `S13.19` Lun'Avaritia seule : interroger l'agent
- `S13.20` Lun'Avaritia seule : le traitement ne va pas au bout
- `S13.21` Lun'Avaritia seule : la pause
- `S13.22` Lun'Avaritia seule : ses réglages, ses types, son export
- `S13.23` Lun'Luxuria seule : arriver et entrer
- `S13.24` Lun'Luxuria seule : une phrase dite, un tour
- `S13.25` Lun'Luxuria seule : écrire dans le fil
- `S13.26` Lun'Luxuria seule : reprendre la parole, couper la réponse
- `S13.27` Lun'Luxuria seule : le modèle ne répond pas
- `S13.28` Lun'Luxuria seule : le fil du jour et le plafond
- `S13.29` Lun'Luxuria seule : ce qui manque par rapport au mode relié
- `S13.30` Lun'Acedia reliée : ce qui change
- `S13.31` Lun'Avaritia reliée : ce qui change
- `S13.32` Lun'Luxuria reliée : ce qui change

## Référence : les catalogues d'actions

Ce que chaque satellite sert par `GET /lun/v1/actions` et exécute par `POST /lun/v1/actions/:name`. Tables tirées
du code (`server/src/contract/catalog.ts` de chaque satellite), aux commits ci-dessus. Les mêmes actions sont les
outils de l'agent du poste (familles 2 et 13).

### Lun'Acedia : 39 actions

| Action | Effet | Ce que le code en dit |
|---|---|---|
| `mail.search` | lecture | Cherche des mails (même syntaxe que la recherche Gmail) ; renvoie leurs résumés. |
| `mail.read` | lecture | Lit un mail : en-têtes et texte. |
| `mail.file` | écriture | Range un mail dans une boîte (il quitte la boîte de réception). |
| `mail.trash` | écriture | Met un mail à la corbeille (jamais de suppression définitive). |
| `mail.archive` | écriture | Archive un mail (il quitte la boîte de réception). |
| `mail.tags` | écriture | Ajoute ou retire des étiquettes à un mail. |
| `mail.validate` | écriture | Accepte la proposition de tri d’un mail. |
| `mail.correct` | écriture | Range un mail autrement que proposé (boîte, `trash` ou `spam`, et étiquettes). |
| `mail.refuse` | écriture | Refuse la proposition de tri d’un mail : il reste en boîte de réception. |
| `agenda.list` | lecture | Événements et tâches datées d’une période [from, to). |
| `event.create` | écriture | Crée un événement (dans l’agenda principal par défaut). |
| `event.update` | écriture | Modifie un événement (seuls les champs donnés changent). |
| `event.delete` | suppression | Supprime un événement. |
| `task.create` | écriture | Crée une tâche (dans la liste principale par défaut). |
| `task.update` | écriture | Modifie une tâche (seuls les champs donnés changent). |
| `task.complete` | écriture | Coche une tâche. |
| `task.delete` | suppression | Supprime une tâche. |
| `mail.list` | lecture | Liste une page d’une vue (inbox, pending, trash, spam, sent) ou d’une boîte (son id), du plus récent au plus ancien. |
| `mail.untrash` | écriture | Sort un mail de la corbeille. |
| `mail.spam` | écriture | Signale un mail comme indésirable. |
| `mail.markRead` | écriture | Marque un mail comme lu ou non lu. |
| `draft.read` | lecture | Lit un brouillon : destinataires, objet et texte. |
| `draft.create` | écriture | Prépare un brouillon de mail (jamais envoyé : l’utilisateur le relit et l’envoie lui-même). |
| `draft.update` | écriture | Remplace le contenu d’un brouillon. |
| `draft.delete` | suppression | Supprime un brouillon. |
| `label.list` | lecture | Liste les étiquettes avec leur rôle (boîte, étiquette ou aucun). |
| `label.create` | écriture | Crée une boîte ou une étiquette. |
| `label.setRole` | écriture | Change le rôle d’une étiquette (`box`, `tag`, ou null pour aucun). |
| `calendar.list` | lecture | Liste les agendas synchronisés. |
| `tasklist.list` | lecture | Liste les listes de tâches. |
| `task.list` | lecture | Liste les tâches, faites ou non (d’une liste si listId est donné). |
| `journal.list` | lecture | Journal du tri, du plus récent au plus ancien. |
| `journal.undo` | écriture | Annule une entrée du journal du tri. |
| `rule.list` | lecture | Liste les règles de tri. |
| `rule.create` | écriture | Crée une règle de tri. |
| `rule.update` | écriture | Modifie une règle (seuls les champs donnés changent). |
| `rule.delete` | suppression | Supprime une règle de tri. |
| `stats.today` | lecture | Ce que le tri a fait aujourd’hui. |
| `day.digest` | lecture | Bilan d’une période [since, until[ : mails reçus, ce qui a été fait, et ce qui attend. |

### Lun'Avaritia : 6 actions

| Action | Effet | Ce que le code en dit |
|---|---|---|
| `brain.ingest` | écriture | Reçoit le lot de la nuit : des observations à trier en brouillons de fiches. |
| `brain.search` | lecture | Cherche des fiches par mots-clés (20 au plus) ; extraits de 300 caractères. |
| `brain.read` | lecture | Lit une fiche : synthèse (4 000 caractères au plus), faits actifs sourcés, liens. Une fiche fusionnée renvoie la fiche gardée. |
| `brain.due` | lecture | Les faits actifs dont l’échéance tombe au plus tard ce jour (AAAA-MM-JJ), la plus ancienne d’abord. |
| `brain.neighbors` | lecture | Les fiches liées à une fiche, avec la relation et le sens. |
| `day.digest` | lecture | Le bilan d’une période : ce qui est arrivé, ce qui a été décidé, ce qui attend. |
