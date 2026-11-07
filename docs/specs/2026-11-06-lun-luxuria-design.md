# Lun'Luxuria, le corps de Natsume : design

Date : 2026-11-06. Issue : lun-docs#61 (étape 3 du chantier
[Natsume, être présent](2026-11-05-natsume-etre-presence-design.md)). Décision d'architecture :
[ADR 0009](../../adr/0009-lun-luxuria-corps.md).

Ce document complète la spec du 05/11. **Il la remplace sur trois points** : le §7.3 (VTube Studio sort),
l'étape 4 du §8 et le §10.4 (l'avatar animé passe après le MVP, sous forme Live2D). Le reste de cette spec
tient, en particulier la frontière du §3, le rituel du §7.1, la voix du §7.2 et la recette du §10.3.

**Depuis l'[ADR 0010](../../adr/0010-lun-luxuria-publique.md)**, Luxuria est publique et fonctionne seule : ce document décrit
son usage relié au core, qui reste celui de Natsume. Le mode seul et l'agent neutre sont décrits au §3.

Les décisions sans mention sont de CrOliX. **[choix Claude]** marque un choix à relire.

**Reprise du 06/11**, après la confrontation à la veille et à OpenAmika : la cible de latence passe à 1,5 s, la parole
spontanée bornée entre au MVP, la langue parlée reste ouverte à l'écoute, le `SOCLE` est recadré (proposition en revue,
lun-anima#35), et une réponse peut se préparer avant la fin réelle de sa phrase (§6.9).

**Depuis l'[ADR 0011](../../adr/0011-chaine-vocale-mvp.md)**, après l'essai du 07/11 : la cible passe à 2,5 s en médiane
sur le desktop, les briques de la chaîne sont fixées, et aucune vraie carte ne se valide à la voix sans confiance réelle
de la transcription. Les chiffres de 1,5 s plus bas sont remplacés par cet ADR.

## 1. L'intention

Luxuria est la porte de sortie de Natsume hors de l'app : ce qui lui permet de vivre sur le desktop de
CrOliX. On ne construit pas une fenêtre de chat avec un personnage, mais **l'espace de Natsume** : un lieu
où elle est, qu'il voit et à qui il parle le soir. Ouvrir Luxuria est une rencontre.

CrOliX préfère une base fidèle à cette vision plutôt qu'une reconception dans quelques mois. La structure
vise donc la cible dès le MVP (une scène en couches, un corps remplaçable), même si le contenu du MVP reste
modeste. Échéance du MVP : 31/12.

## 2. Les buts, les non-buts, les anti-buts

**Buts du MVP**

- Elle a un lieu, un corps et une voix sur le deuxième écran.
- Il lui parle naturellement, casque sur la tête, et peut la couper.
- Elle l'accueille au lancement sans répéter ce qu'il a vu sur mobile.
- Il valide à la voix ce qui attend.
- Il garde sa présence quand il joue, en petit mode.

**Hors MVP**, à ne pas bâtir maintenant :

- l'avatar animé Live2D (premier chantier après le MVP) ;
- la mascotte et le compagnon de bureau (sous-agent du satellite : ouvrir des fenêtres, parcourir, lancer
  des scripts) ;
- l'accès au PC, qui passera par les routes du contrat satellite et des cartes ;
- la vision de l'écran et la perception ;
- le stream : OBS, Twitch, mode scène ;
- les enceintes et l'annulation d'écho, le mot d'éveil ;
- les pensées non dites et les relances (la parole spontanée bornée, elle, en fait partie : §6.4) ;
- la détection automatique d'un jeu ;
- le démarrage automatique et les mises à jour.

**Anti-buts**, échecs même si tout marche, en plus de ceux du §11 de la spec :

- un écran qui ressemble à ChatGPT ;
- une logique de carte, de geste ou de décision dans Luxuria ;
- une capture de la scène qui montre du privé en direct, le jour où le stream arrive ;
- une image figée qui continue de parler après qu'il l'a coupée.

## 3. Les contraintes

- Application Tauri 2, dépôt `lun-luxuria`, **public**, entrée au registre à sa création (ADR 0010). D'ici le desktop,
  une page Vite dans le navigateur, qui porte déjà toute la logique : Tauri n'ajoute que la fenêtre, le raccourci global
  et le vrai nom de l'appli sur le micro **[choix Claude]**.
  *Annoté le 07/11 (plan `2026-11-07-luxuria-tauri`) : sous WebView2, le micro est tenu par `msedgewebview2.exe`, pas
  par Luxuria. Le vrai nom n'est donc pas tenu, et une autre appli WebView2 (le nouveau Teams) échappe à la détection.*
- Reliée, Luxuria est un client du core avec un jeton d'appareil. Elle n'expose rien, et ne sert aucune route du
  contrat satellite au MVP.
- Seule, elle parle à un modèle compatible OpenAI choisi dans ses réglages, sous un nom et un ton neutres par défaut. Son
  fil ne garde que la journée en cours, et un plafond de jetons par jour coupe le modèle avant tout appel. Le rituel, les
  urgences et la parole spontanée n'existent que reliée.
- **Le corps ne décide jamais de ce qu'elle dit.** Seuls du texte et des signaux vont au core. L'audio ne
  quitte jamais le PC.
- Fermer Luxuria est un état normal. Le core ne dépend jamais du PC.
- Matériel visé : une carte sans CUDA doit suffire. Le serveur du core n'a pas de GPU.
- DA : socle commun Lun', jetons de `lun-docs/design/tokens.css`, magenta du monde en accent seulement
  (fond `#100409`, accent `#8A1E5A`). Le monde Luxuria n'a pas encore ses jetons : les ajouter à la source,
  puis les copier par `tools/sync-tokens.mjs`. Cormorant Garamond pour ses mots, Inter pour l'interface,
  pas de tiret cadratin.
- Le texte fixe reste simple. Le texte dynamique est sa voix. La voix écrite reste provisoire : `TEMPERAMENT_SEED` ne
  change pas, et toute formulation du `SOCLE` passe par la validation de CrOliX.
- Un service Python local est permis si une brique l'impose (RVC), lancé sans console et justifié dans le
  dépôt.

## 4. La forme

Maquettes validées le 06/11 ; à reprendre comme référence et à refaire dans le dépôt, car elles vivent dans
un dossier temporaire.

**La scène « plateau », sur le deuxième écran.** Natsume au centre sur un fond sombre, ses mots en
sous-titres. Le fil n'est pas visible par défaut. Trois contrôles en haut à droite : couper le micro, ouvrir
le fil, passer en petit mode. Une étiquette en haut à gauche donne l'état (§5.3).

La scène est faite de **couches séparées** : fond, corps, sous-titres, contrôles, fil. C'est ce qui permettra
plus tard de composer une sortie pour le stream, sans la câbler aujourd'hui.

**Le fil** s'ouvre à la demande avec un petit champ d'écriture. Il n'est qu'une vue du fil principal du core.

**Le petit mode : un panneau léger**, pour le jeu ou quand le deuxième écran est pris. Une vignette en coin,
toujours au premier plan, avec le visage et sa dernière phrase. Un clic ouvre, par-dessus l'écran, un panneau
léger avec le fil. Le passage de la scène au petit mode est **manuel** : un bouton et un raccourci clavier
global **[choix Claude]**.

Le panneau peut être opaque à bords droits si la transparence pose problème : des retours récents signalent
des défauts de fenêtre transparente sous WebView2. À vérifier dans l'essai (§7).

Écran, position et mode sont mémorisés d'un lancement à l'autre **[choix Claude]**.

## 5. Le corps

### 5.1 Trois niveaux, une seule interface

| Niveau | Contenu | Quand |
|---|---|---|
| 1. Le souffle | un cercle qui suit la voix, sans aucun fichier | MVP, repli |
| 2. Les images | une ou deux images : repos, parole | **MVP, la cible** |
| 3. L'avatar animé | Live2D : respiration, clignement, lèvres, expressions | premier après le MVP |

Tous les niveaux passent par la même interface, et la scène et la vignette en sont deux instances :
`setState(state)`, `setMouth(0..1)`, plus tard `setMood(...)`. Changer de niveau ne touche ni à la scène ni à
la voix.

**Le niveau 2** vient de CrOliX. Deux images : l'image 1 au repos, l'image 2 quand elle parle, échangées selon
le niveau du son **réellement joué**, avec une hystérésis pour éviter le scintillement. Si elle est coupée,
la bouche se ferme au même instant que l'audio. Avec une seule image, elle reste fixe et les sous-titres et
l'étiquette portent la parole. Dans la vignette, c'est le même échange, recadré sur le visage.

**Les assets sont de la configuration, pas du code** : un dossier hors dépôt et un petit fichier de réglage
(niveau, fichiers, recadrage de la vignette). Si un fichier manque ou est illisible, on retombe sur le niveau 1
sans bloquer le lancement **[choix Claude]**.

### 5.2 Le format : Live2D

Le format de l'avatar animé est **Live2D, rendu dans la fenêtre de Luxuria**, avec le SDK Web officiel de
Cubism, sauf si l'essai montre mieux **[choix Claude sur le SDK]**. Le choix est fait maintenant pour qu'aucune
commande ni modèle de test ne parte sur le mauvais format ; seule l'implémentation vient après le MVP.

- Pourquoi : un personnage illustré face à lui sert la scène et le stream ; une même illustration donne les
  images du niveau 2 et le modèle du niveau 3 ; une commande coûte moins cher qu'un modèle 3D de qualité
  comparable (sources commerciales, ordre de grandeur).
- Ce que ça coûte : un angle limité et un déplacement sur le bureau moins naturel. Le compagnon pourra avoir
  son propre format le moment venu.
- Écartés : **VTube Studio**, une application à part qui ne vit pas dans la scène ; **VRM**, dont l'avantage
  est le déplacement, hors MVP.
- Licence : le noyau Cubism est propriétaire. Live2D exempte les particuliers et petites structures sous
  10 M¥ de chiffre d'affaires annuel, sauf les « Expandable Applications ». À relire dans le contrat au moment
  du niveau 3, et avant toute sortie publique de Luxuria.

L'essai du §7 confronte ce choix au vrai PC. Il ne le rouvre que s'il échoue.

### 5.3 Les états

`présente`, `écoute`, `réfléchit`, `parle`, `attend`, `occupée`, `micro coupé`, `muette` (07/11, §6.6), `injoignable`,
`plafond atteint`.
Ils sont calculés dans Luxuria à partir du micro, de la lecture audio et du flux du core. Au MVP, ils
s'affichent par l'étiquette et par le souffle ; les images ne distinguent que le repos et la parole. Un état
affiché correspond à la réalité : `micro coupé` veut dire qu'aucune capture ne tourne.

## 6. Ce qu'elle fait

### 6.1 Le lancement

Comme au §7.1 de la spec : `presence.started`, un battement, fin de présence à l'arrêt ou sans battement
pendant 90 s, rituel composé par le core en un appel au modèle, courte phrase si relance sous 30 minutes.
Luxuria reçoit le rituel comme toute autre réponse et le dit.

Si le core est injoignable, l'état `injoignable` s'affiche et Luxuria réessaie seule. Aucune phrase n'est
inventée sur place, et le texte fixe reste neutre : « Natsume est injoignable. » **[choix Claude]**.

### 6.2 La voix

Comme au §7.2 de la spec : micro ouvert au casque, bouton pour le couper, phrase par phrase, cible de 2,5 s
en valeur médiane sur le desktop (ADR 0011 ; moins de 1 s reste l'horizon), identifiant d'énoncé pour jeter l'audio en retard, phrase d'attente avant une
délégation longue, secret masqué avant la synthèse. Le texte masqué sert aussi aux sous-titres : ce qu'on
voit à l'écran n'en dit pas plus que ce qu'on entend **[choix Claude]**.

RVC : modèle fourni par l'utilisateur, hors du dépôt. Sans lui, synthèse seule. **La langue parlée reste ouverte** :
la présence du français dans les voix est faible, et l'ancienne Natsume parlait anglais. On écoutera le français
direct contre une réponse dite en anglais avec sous-titres français. Si le 31/12
serre, on coupe dans l'ordre : le niveau 2 retombe sur le souffle, puis RVC.

**La couper.** Elle s'interrompt quand il parle, ou par un bouton qui n'existe que pendant qu'elle parle.
L'audio s'arrête aussitôt. Luxuria dit au core ce qui a été réellement dit : le core garde ce texte dans le fil,
mobile compris, arrête le flux du modèle si possible, et aucun nouvel outil ne part après la coupure. Un geste
déjà tenu reste annulable par « annule » **[choix Claude]**.

**Ce qu'elle dit à voix haute** : les réponses à une phrase dite ou écrite dans Luxuria, le rituel, les P0 et sa parole
spontanée, chacun avec sa bascule côté Luxuria.
Une réponse à un message du mobile et les routines restent silencieuses. Le core marque ce qui se dit ;
Luxuria ne fait que suivre **[choix Claude]**.

Les pièges déjà rencontrés sont des exigences : un filtre des hallucinations de transcription et une durée
minimale de phrase, la synthèse de la phrase suivante pendant que la précédente joue, une erreur de synthèse
visible et non avalée, et un chiffre de latence par tour sur l'horloge du PC, du dernier son de voix au premier
son joué. Rien de tout cela n'avait été mesuré en usage réel dans l'ancien écosystème : la mesure fait partie
de la livraison.

### 6.3 Ce qu'elle écoute

C'est le sujet qui a le plus coûté dans l'ancien écosystème (voir §12). Trois gardes, de la plus sûre à la plus
fine, **toutes locales, rien ne quitte le PC avant d'avoir passé la dernière** :

1. **Le bouton micro.** Coupé, aucune capture ne tourne. L'état survit à un relancement : un micro coupé ne se
   rallume jamais seul.
2. **Le mode « occupée »** (proposition de CrOliX). Quand une autre appli utilise le micro, Natsume n'écoute plus
   et se tait : la capture s'arrête avant toute transcription, donc rien n'est transcrit, stocké ni payé. Une liste
   d'applis à ignorer écarte celles qui gardent le micro sans conversation (OBS, par exemple). Un bouton reprend la
   main, et ce choix manuel prime sur la détection tant qu'il n'est pas relâché. Retour quelques secondes après que
   l'appli a lâché le micro. Un P0 ne se dit pas : il s'affiche et reste dans le fil, donc sur le téléphone. Le core
   reçoit un signal « occupé », jamais le nom de l'appli.
3. **Le filtre du petit mode**. En petit mode, par défaut, une phrase transcrite localement ne part que si elle
   contient son prénom, si elle arrive moins de 15 s après sa dernière parole, ou si la touche est maintenue. Le reste
   est ignoré : ni fil, ni coût, ni mémoire. Si la transcription en continu pèse trop en jeu, on retombe sur la touche
   seule. Dans la scène, par défaut, pas de filtre : tout part, c'est le micro ouvert décidé par CrOliX.

Ce sont des valeurs par défaut, pas des règles figées : **chacune de ces mécaniques se règle et se désactive depuis
l'app** (§6.8).

**Une phrase ignorée se voit** : une trace discrète et locale dans l'étiquette, sinon il croit qu'elle ne répond plus.

Hors MVP : le classifieur « me parle-t-il ? » pour les cas ambigus. Le coût n'est pas l'obstacle, ce sont la vie
privée (ce qu'il dit à d'autres partirait chez un fournisseur, sauf modèle local), la latence et les erreurs dans
les deux sens.

### 6.4 Parler sans qu'on lui demande

La règle de la spec tient : **un événement ne réveille pas le modèle**. Une exception orale au MVP : un
**P0** arrivé pendant une présence est annoncé à voix haute par une phrase fixe composée par le core à partir
du titre de l'événement, sans modèle, sauf s'il est `occupée` ou en petit mode muet. La phrase entre dans le fil
principal, donc apparaît sur mobile. Il répond s'il veut. Le reste attend qu'il parle ou le rituel suivant. C'est le
core qui compose ; Luxuria ne fait que dire.

**La parole spontanée, bornée** (décision du 06/11). Le battement de présence est la seule horloge. Une garde dans le code
décide avant tout appel : réglage actif, il est là et pas occupé, rien en cours, silence assez long, borne par jour, deux
phrases sans réponse au plus. Le modèle peut répondre RIEN : rien n'est dit ni montré. Réglage dans l'Atelier de l'app,
**éteint par défaut** tant qu'elle n'a pas été écoutée. Les premiers essais tiennent le ton mais radotent (« mange un
truc ») : les pensées d'un canal à part restent la vraie réponse, plus tard.

### 6.5 Valider à la voix

**Luxuria n'a aucune notion de carte.** Les cartes sont une fonction du core : pas de boutons, pas de vue, pas
de logique de geste dans ce dépôt. Natsume dit ce qui attend, CrOliX répond, et son texte part au core comme
n'importe quelle phrase, avec `surface: 'voice'`. Toute la mécanique du miroir, déjà livrée (lun-anima#33),
reste côté core : grammaire du geste, phrases fixes, 5 s, « annule ». Les boutons restent dans l'app du core.

Conséquence à garder en tête : sur une carte qui envoie, un « ok je valide » reçoit encore l'indice « dis
envoie », parce qu'une transcription peut se tromper et qu'un envoi ne se rattrape pas. Cette règle du miroir
ne change pas ici.

**À la voix, les 5 s démarrent quand elle a fini de dire sa phrase** : sinon,
la synthèse, la détection de fin de phrase et la transcription peuvent manger toute la fenêtre. L'effet reste celui
d'un clic ; seul le départ du compteur change.

### 6.6 Les modes

Les modes annoncés du core (assistante, focus, silence) **n'existent pas encore dans le code** (vérifié le 06/11).
Ce chantier ne les construit pas : au MVP, Luxuria n'a que ses états locaux (§6.3) et le core ne reçoit que les
signaux de présence **[choix Claude]**. L'échelle complète des modes de présence est au §11.

**07/11** : un seul état s'ajoute au MVP, `muette`, par le mute du bureau
([spec](2026-11-07-mute-du-bureau-design.md)). Les modes restent après le MVP.

### 6.7 Le plafond de dépense

Le plafond de chat (1 $ par jour) ne change pas ; on mesure d'abord le coût d'une vraie soirée. À l'atteinte,
l'état `plafond atteint` s'affiche, et le texte fixe est celui du core. L'ancien écosystème avait la règle
inverse (une dépense anormale alerte sans jamais la faire taire) : à revoir avec le chiffre de la soirée réelle.

### 6.8 Les réglages

**Le paramétrage est une exigence de premier rang, comme sur les autres projets** : aucune mécanique de perception
n'est figée dans le code. Tout se règle depuis un écran de réglages de Luxuria, puisque ces mécaniques vivent sur le
PC **[choix Claude sur l'emplacement]**. Les réglages restent sur le PC, survivent à un relancement, et l'écran dit
s'ils agissent tout de suite. Chaque mécanique a son interrupteur, et rien ne dépend d'une autre pour marcher.

| Réglage | Choix | Défaut |
|---|---|---|
| Façon de parler, par mode (scène, petit mode) | micro ouvert, touche à maintenir, micro coupé | ouvert dans la scène, ouvert filtré en petit mode |
| Filtre, par mode | activé ou non | scène : non ; petit mode : oui |
| Mention du prénom | activée ou non ; mots reconnus et tolérance aux erreurs de transcription | activée ; « Natsume » |
| Fenêtre après sa parole | activée ou non ; durée | activée ; 15 s |
| Touche à maintenir | activée ou non ; touche | activée ; à choisir |
| Détection d'une autre appli sur le micro | activée ou non ; applis ignorées ; délai de retour | activée ; quelques secondes |
| Trace d'une phrase ignorée | activée ou non | activée |
| Interruption à la voix | activée ou non ; douce ou immédiate | activée ; selon l'essai |
| Fin de phrase | durée de silence ; réponse préparée dès une courte pause, activée ou non, durée de la pause ; seuil du silence ; durée minimale | selon l'essai |
| Dit à voix haute | accueil, P0, parole spontanée : chacun activé ou non | activés |
| Voix | volume, annulation d'écho et suppression de bruit du micro, RVC au lancement du service, périphériques audio à venir | selon l'essai |
| Corps et affichage | niveau, dossier d'assets, raccourci, écran | §4 et §5 |

Le mot d'éveil dédié, hors MVP, entrera dans ce même écran. Le design de l'écran passe par le point de design.

### 6.9 Répondre avant la fin de sa phrase

Mécanique reprise d'OpenAmika, **activable et désactivable** : à une courte pause, la phrase part déjà au core et la réponse
se prépare **sans se dire**. À la vraie fin de phrase, elle sort aussitôt. S'il reprend, Luxuria retire le fragment : il
disparaît du fil et du contexte, un geste tenu depuis est annulé, et rien n'a été entendu. Le core ne connaît ni pause ni
spéculation : il ne reçoit qu'un message, un retrait ou une coupure. Le gain réel reste à mesurer, et chaque essai coûte un
appel.

Le contrat avec le core tient en quatre appels et deux événements (détail dans `lun-luxuria/docs/README.md`) : présence,
message (`user`, `reply`, `delta`, `done`), `withdraw`, `cut` ; et `speech`, `speech-end` sur `GET /api/live`. Une réponse
dont aucun son n'a démarré est coupée à vide : elle ne repart jamais au modèle.

## 7. L'essai chronométré, en premier

Avant tout le reste, un essai jetable sur le vrai PC, avec un modèle de test Live2D fourni par CrOliX et sa
carte actuelle. Il fixe les briques, et son rapport entre dans le dépôt.

| Mesure | Seuil |
|---|---|
| Fin de phrase → premier mot, chaîne complète | 2,5 s en valeur médiane (ADR 0011 ; 1,5 s à l'origine) |
| Idem avec un jeu lancé | à mesurer, et à présenter à CrOliX avec le repli proposé |
| Modèle Live2D dans une fenêtre Tauri | 30 images/s au moins, chaîne vocale active |
| Délai du son à la bouche | imperceptible à l'usage, jugé par CrOliX |
| Vignette au-dessus d'un jeu | visible en plein écran fenêtré, et noté pour l'exclusif |
| Détection d'une autre appli sur le micro | Discord détecté à l'entrée et à la sortie d'un salon, liste des faux positifs relevée |
| Fenêtre pour dire « annule » à la voix | temps restant mesuré, avec et sans le départ différé |
| RVC en français | rendu jugé par CrOliX |

STT, synthèse, RVC et rendu se disputent la même carte, sans CUDA : c'est le plus gros risque technique.
**Si le mode jeu ne tient pas**, le repli proposé est : pas de RVC en petit mode, puis synthèse cloud
seulement si CrOliX l'accepte, explicite et comptée. **Si les 1,5 s ne tiennent pas même sans jeu**, le relevé
revient à CrOliX avec les options chiffrées (modèle plus rapide, sans RVC, autre carte) ; rien n'est décidé seul.

Si le rendu Live2D ne tient pas les seuils, le niveau 2 reste la cible et le format revient à CrOliX, avec les
chiffres, avant toute commande.

**Résultat du 07/11** (rapport : `lun-luxuria/docs/essai-2026-11-07.md`). La chaîne complète, sans jeu, donne 2776 ms en
médiane, 3754 au 95ᵉ centile : au-dessus des 1,5 s. Le relevé est revenu à CrOliX, qui a assoupli la cible
([ADR 0011](../../adr/0011-chaine-vocale-mvp.md)). Restent à mesurer : la chaîne avec un jeu lancé, Live2D dans une
fenêtre Tauri, le délai du son à la bouche, la vignette au-dessus d'un jeu, la fenêtre de « annule » et le rendu de RVC
en français avec un modèle entraîné en français. La détection du micro tenu a relevé un faux positif durable : des entrées
périmées du registre (lun-luxuria#5).

## 8. Ce qui change dans le core

- `presence.started` et le battement, sur une route d'appareil.
- Le rituel de bienvenue (§7.1 de la spec) et la courte phrase de relance.
- L'annonce d'un P0 par phrase fixe (§6.4).
- Le signal « occupé » et ce qui se dit à voix haute (§6.2).
- La coupure : garder dans le fil ce qui a été dit, arrêter le flux. `ChatService` ne sait pas s'interrompre
  aujourd'hui, et le flux en direct (`GET /api/live`) ne porte qu'un identifiant de message : à étendre pour
  que Luxuria reçoive le texte en flux et une phrase qu'elle n'a pas demandée.
- Le départ différé des 5 s à la voix (§6.5), si CrOliX le valide.
- « non annule » et « annule tout » partent aujourd'hui au modèle et le geste part quand même (reste de
  lun-anima#33). Un client à la voix les dira : corrigé dans ce chantier.
- Une carte modifiée sous le même id entre la lecture et « envoie » (reste de lun-anima#33) devient plus
  sensible à la voix, sans écran pour relire : corrigé dans ce chantier, côté core, en refusant un geste si le
  contenu lu a changé, et sans toucher au contrat **[choix Claude]**.
- Un client voix peut envoyer un fragment dès une courte pause, puis le retirer (§6.9). L'origine « à la voix », déclarée par le client
  (reste de lun-anima#33), reste telle quelle au MVP : un seul utilisateur, et elle ne décide de rien
  **[choix Claude]**.

Les défauts d'usage des outils vus sur le vrai modèle (liste à trancher, réponse à une option, « valide tout »,
délégations de trop) sont traités à part, dans une petite PR avant ce chantier.

## 9. La recette

Celle du §10.3 de la spec, plus :

- La scène s'ouvre sur le deuxième écran mémorisé, sans fil visible, et aucune vue de carte n'existe dans
  l'app.
- Remplacer les images dans le dossier d'assets change le corps, dans la scène et la vignette, sans toucher au
  code. Un fichier manquant donne le souffle, sans erreur bloquante.
- Couper Natsume ferme la bouche et arrête l'audio au même moment.
- Le raccourci fait passer de la scène au petit mode et retour pendant qu'elle parle, sans couper la voix.
- Un P0 pendant une présence est dit par une phrase fixe, sans appel au modèle, et apparaît sur mobile ; en
  `occupée`, il n'est pas dit.
- Rejoindre un salon vocal Discord passe en `occupée` : plus de capture, plus de transcription, aucun message.
  Le quitter la ramène. Le bouton reprend la main sur la détection.
- Micro coupé puis Luxuria relancée : le micro reste coupé.
- En petit mode, une phrase sans son prénom, hors des 15 s et sans la touche n'atteint pas le core, et une trace
  locale le montre.
- Chaque ligne du §6.8 se change depuis l'écran de réglages, sans fichier à éditer ni redémarrage caché, et survit à
  un relancement. Chaque mécanique désactivée est réellement inactive : micro ouvert sans filtre, touche seule, sans
  prénom, sans fenêtre, sans détection.
- Une soirée d'usage réel donne le chiffre de latence par tour, médiane et 95ᵉ centile, et son coût.
- « C'est bon, je valide » puis « envoie » sur une carte à envoyer donne le même Journal qu'un clic, depuis
  Luxuria, à l'origine près.
- Core coupé : Luxuria dit « injoignable », reste ouverte et se reconnecte seule.
- Le relevé de l'essai du §7 est dans le dépôt, avec les choix qu'il a fixés.

## 10. Ce qui reste au constructeur

Découpage en PR par dépôt, nom exact des routes et des signaux, choix des bibliothèques audio, façon de lancer
le service Python, hystérésis de la bouche, disposition fine des écrans une fois en vraie fenêtre (le point de
design reste dû : maquette, critique, vérification à l'écran), raccourci par défaut, API Windows de détection du
micro.

## 11. La trajectoire

Ce que Luxuria deviendra, pour que le MVP ne le bloque pas. **Rien de ceci n'est à construire maintenant**, et cet
ordre reste à confirmer. La colonne de droite dit ce que le MVP doit seulement ne pas empêcher.

| Évolution | Ce que c'est | Vu où | Ce que le MVP prépare |
|---|---|---|---|
| Avatar animé | Live2D : lèvres, clignement, respiration, regard, humeur | US-33, US-34 de l'ancien écosystème | l'interface du corps (§5.1) |
| Illustration commandée | fond, images, modèle, peut-être plusieurs tenues | CrOliX | les assets en configuration |
| Modes de présence | compagne, jeu, travail, silence, absente, sommeil ; détection par jeu, fenêtre en avant-plan et inactivité, avec un choix manuel qui prime | ancien `session_mode`, `context_mode_detector` | les états locaux et les signaux |
| Filtre « me parle-t-il ? » | classifieur sur les cas ambigus, local si possible | ancien `addressing_filter` | le filtre local (§6.3) |
| Pensées et relances | pensées notées dans un canal à part, seuil, relance une fois, budget de parole | schéma E, ancien `idle_loop`, OpenAmika | la parole spontanée bornée (§6.4) |
| Enceintes, mot d'éveil | annulation d'écho, écoute locale | spec, ancien V-010 | la chaîne vocale |
| Démarrage auto, mises à jour | Tauri | spec | rien de spécial |
| Mascotte | corps sans fenêtre, posé sur l'écran | CrOliX | l'interface du corps |
| Compagnon sous-agent | ouvrir des fenêtres, parcourir, lancer des scripts, chaque action par une carte | CrOliX, ADR 0009 | aucune route ouverte d'ici là |
| Perception | fenêtre active, inactivité, puis vision de l'écran | ADR 0009, ancien `vision/` | rien : le signal reste du texte |
| Compagnon de jeu | commentaire de partie, intégrations par jeu (FF14 et osu! existaient) | US-29, ancien `game_hooks` | le petit mode |
| Stream | OBS, chat Twitch et YouTube sous quotas, mode scène à mémoire propre, mur vers le privé, en cas de doute elle se tait | schéma G, US-30 à 35, ancien `stream/` | les couches séparées (§4) |
| Voix apprise | LoRA de voix, nourrie par de vrais échanges | essai du 06/11, gardé dans `voix-essai` | le fil conservé |

Deux règles de l'ancienne piste stream à garder : un budget atteint met le chat en sourdine, jamais Natsume en
conversation avec CrOliX ; et rien de cette piste n'apparaît dans l'interface avant d'être commencé. Elle visait un
démarrage en janvier 2027 et une bêta utilisable en août 2027, dates de l'ancien cadrage, à reconfirmer.

## 12. Ce que l'ancien écosystème a appris

Lu dans `archive/LunAnima` le 06/11. C'est une référence, pas du code à reprendre tel quel.

| Sujet | Ce qui s'est passé | Ce qu'on en fait |
|---|---|---|
| Adressage | mot d'éveil, puis filtre par modèle, puis deux étages : indices locaux (15 s, prénom) et classifieur, plus un bouton qui force. Il a fini sans mot d'éveil | §6.3 reprend l'étage local, seulement en petit mode |
| Refus invisibles | une phrase rejetée ne se voyait pas : il croyait qu'elle ne répondait plus. Corrigé en la montrant | une trace locale (§6.3) |
| Filtre en panne | une panne du classifieur classait tout en « pas pour elle » sans le dire ; une erreur faisait taire au lieu d'ouvrir | pas de classifieur au MVP ; toute panne se voit |
| Elle dort, il transcrit | « endormie » coupait le modèle mais pas la transcription | `occupée` coupe avant la transcription |
| Modules rallumés | micro, voix et avatar coupés se rallumaient au lancement | un micro coupé reste coupé |
| Bouton d'interruption | toujours actif, même quand elle ne parlait pas | il n'existe que pendant qu'elle parle |
| Latence jamais vécue | la mesure a été livrée, mais la soirée de voix n'a jamais été faite ; plancher de 800 ms de détection, trou entre phrases | chiffre principal et soirée réelle dans la recette |
| Interruption | douce d'abord (la phrase se finit), puis coupe nette après 1,2 s, au casque seulement | à tester dans l'essai contre une coupe immédiate |
