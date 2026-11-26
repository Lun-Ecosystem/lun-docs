# Trancher depuis le core : voir ce qui est proposé, corriger, trancher par le chat. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** le chapeau Lun-Ecosystem/lun-docs#231 (`niveau:standard`) ; la part privée dans
> Lun-Ecosystem/lun-anima#161. **PR du plan :** Lun-Ecosystem/lun-docs#232.
>
> **État : rédigé, contesté (« à amender ») et amendé le 26/11 (« Ce que la contestation a changé »). **Validé par
> CrOliX le 26/11** : A, B et C ; les décisions 2 à 4 selon l'avis proposé, qu'il n'a pas commentées.
>
> Code relu sur `main` le 26/11 : Lun'Anima `510f4d8` (0.4.0), lun-acedia `0.4.0`, lun-docs `802c770`. Le graphe
> d'abord, puis chaque point dans le code. Lun'Anima est privé : ce plan dit le comportement, les critères, les tâches
> et les preuves ; ses fichiers et ses fonctions sont dans un commentaire de son issue privée
> ([`securite.md`](../../standards/securite.md), « Dépôts publics »).

**But :** depuis le core, CrOliX voit ce qu'une carte propose, la corrige d'un geste, et la tranche par le chat
écrit sans s'y reprendre à quatre fois.

**Source :** ses constats du 26/11 au soir, sur l'instance en service (core 0.4.0, Lun'Acedia 0.4.0), une heure après
le déploiement. Et le cadre qu'il a rappelé le même soir, à garder pour juger chaque geste :

- **sur le desktop**, tout passe par Natsume : par la voix d'abord, par le panneau en secours (une phrase manquée,
  la voix indisponible) ;
- **en déplacement** (laptop, téléphone), pas de voix : tout passe par le panneau.

Deux conséquences. Le panneau doit suffire seul à tout faire : voir, valider, corriger, refuser. Et la règle qui
laisse le chat écrit trancher est la même que celle de la voix : ce qui se corrige ici vaudra pour elle.

**Ce que ce chantier ne promet pas.** Il ne lève pas le verrou de la voix (décision 2). Il ne garantit pas que le
modèle appelle l'outil au premier message : c'est mesuré, pas promis (tâche 8).

## Ce que le code fait aujourd'hui

### La carte ne dit pas ce qui est proposé

Lun'Acedia sert une proposition de tri au contrat 1.5 : le sujet en `title`, la synthèse en `lines`, la raison en
`reason`, et **ce qui est proposé** dans `fields` : `box` (« Boîte », un choix parmi les boîtes, « Corbeille » et
« Spam ») et `tags` (« Étiquettes », plusieurs choix), chacun avec sa valeur proposée et ses choix
(`lun-acedia/server/src/contract/routes.ts`, `proposalCard`).

Le core lit les cartes d'un poste par un schéma fermé : il n'y connaît pas `fields`, qui tombe à la lecture. Rien
n'en arrive donc à l'écran, ni à ce que Natsume lit d'une carte dans le chat. La carte du kit
(`design/kit/DecisionCard.svelte`) sait pourtant montrer ces valeurs (« Boîte : Corbeille ») dès qu'on les lui
passe : la file du core ne lui passe que `lines` et `reason`.

Constaté le 26/11 : une proposition faite avant le déploiement n'a ni synthèse ni raison servie, d'où une carte
réduite à un sujet et deux boutons. Celles faites depuis ont leurs deux lignes et leur « Pourquoi », mais toujours
pas l'action : ici, la corbeille.

### La carte ne se corrige pas

Lun'Acedia reçoit déjà une correction : `accept { values }`, avec les seuls champs changés, vérifiés contre les
choix de la carte (un choix inconnu est un 400). La carte du kit sait déjà « Corriger » en place, dès qu'on lui
donne `oncorrect`. Entre les deux, le geste du core ne porte qu'une réponse (`answer`, pour une carte à choix) :
ni l'écran ni la route des gestes ne connaissent `values`.

### Le chat écrit n'aboutit pas

Le core ne tranche une carte par la conversation que si **le message de CrOliX** dit le geste et désigne la carte :
le modèle propose, le code vérifie ses mots. Ses quatre messages du 26/11, rejoués contre cette règle :

| Message                                                     | Sans carte montrée | Carte montrée |
| ----------------------------------------------------------- | ------------------ | ------------- |
| « tu peux valider la carte de proposition de trie »         | refusé             | refusé        |
| « oui valide là »                                           | refusé             | passe         |
| « oui »                                                     | refusé             | passe         |
| « valide la carte À ajouter à vos achats » (le titre exact) | refusé             | refusé        |
| « valide la carte ajouter vos achats »                      | passe              | passe         |
| « valide la carte » suivi de son repère                     | passe              | passe         |

Quatre défauts :

1. **Le titre exact est refusé** dès qu'il contient un mot de moins de trois lettres (« à »). C'est un défaut, pas un
   choix : la règle veut des mots du titre assez longs pour désigner, et rejette tout le message pour un mot court.
2. **Une demande naturelle est refusée** : rien ne peut précéder le verbe, sauf « je », « alors », « bon »,
   « allez ». « Tu peux valider… » ne passe pas.
3. **Un refus ne mène nulle part.** Un « oui » seul ne passe que si la carte vient d'être montrée par l'outil de
   lecture. Le modèle a nommé la carte sans la montrer ; la phrase fixe du refus dit quoi faire sans le faire ; au
   troisième message le modèle a relu la carte au lieu de trancher.
4. **La consigne et la règle se contredisent.** La consigne dit de trancher sans jamais demander de confirmation ; la
   règle rend le premier message presque toujours insuffisant. Le modèle a demandé une confirmation.

Un cinquième, lu en passant : l'empreinte qui dit qu'une carte a changé depuis sa lecture ne compte pas `fields`. Une
proposition dont la boîte change resterait « la même carte ».

## Les choix

### A. Voir ce qui est proposé

Le core lit `fields` à la forme du contrat 1.5 (nom, libellé, valeur, choix, `multiple`). Un `fields` mal formé tombe
seul : la carte reste, comme pour `importance`. Il va à l'écran, où la carte dépliée de la file le passe à la carte
du kit. Et la lecture d'une carte par Natsume le dit, une ligne par champ (« Boîte : Corbeille »), entre la synthèse
et la raison.

L'empreinte de la carte compte **les valeurs proposées, pas les choix** : les choix listent toutes les boîtes et
toutes les étiquettes, et en créer une ferait dire « changée » à chaque proposition.

### B. Corriger sur la carte

La carte de la file reçoit `oncorrect` : « Corriger » déplie les choix, « Valider » envoie les seuls champs changés.

Le geste `accept` du core porte alors `values`, **une clé à part de la réponse d'une carte à choix** : le poste
l'attend au premier niveau du corps (`standards/contrat-satellite.md`, contrat 1.5) et refuse une proposition qui
arrive avec autre chose. Le geste du core, sa retenue, son relais et son Journal ne connaissent aujourd'hui que la
réponse : chacun apprend `values`.

Le core borne la forme et la taille, rien de plus : **il relaie, il ne revérifie pas les choix**, c'est le poste qui
le fait, et son refus revient déjà comme la raison de l'échec. Le geste est retenu et annulable comme tout geste. Le
Journal dit « Corrigée » et ce qui a changé. Une carte corrigée ne part jamais dans un lot.

### C. Trancher par le chat écrit

1. **Le titre.** Un mot court **qui est dans le titre** est ignoré au lieu de faire refuser le message ; un mot
   court hors du titre fait toujours refuser (« valide ajouter achats si ok » reste refusé). Le reste tient : deux
   mots du titre au moins, propres à cette carte, dont un de cinq lettres.
2. **La demande.** « Tu peux » et « peux-tu » peuvent précéder le verbe, sauf pour une carte qui envoie. Une question
   (un « ? ») et une négation restent refusées.
3. **Le refus mène à la carte.** Quand le modèle désigne une carte en attente et que le message de CrOliX ne suffit
   pas à la trancher, le code rend **la lecture de cette carte**, par le chemin de l'outil de lecture : son texte
   tel que le poste l'a écrit, ce qui est proposé, ses choix si elle en a, sa règle si elle envoie ou si elle est en
   lecture seule. Elle devient la carte dont on parle, pour le message suivant seulement. La phrase qui suit nomme
   les gestes (« Pour la trancher : valide ou refuse »), jamais « oui ou non » : après un « refuse » mal compris, un
   « oui » voudrait dire le contraire de ce qu'il tranche. Le modèle n'y gagne aucun pouvoir : il peut déjà montrer
   la carte de son choix par l'outil de lecture. Ce texte est rangé comme une lecture, donc rejoué au modèle comme
   une donnée, jamais comme ses propres mots : le sujet d'un mail est un texte étranger.
4. **La consigne** dit la même chose que la règle : sur une demande de trancher, appeler l'outil avec le repère de
   la carte ; c'est le code qui répond.

## Décisions demandées à CrOliX

1. **Le périmètre.** A, B et C ensemble (avis proposé), ou A et C seulement. Corriger est plus probable que refuser :
   sans B, la semaine de rodage jugerait le panneau à moitié outillé. B est la plus grosse part, et ce point rouvre le
   gel du 26/11 : le rang 4 plaçait « les propositions au core (validation par lot, correction) » après le VIP. Sans
   B, la carte garde « Ouvrir le mail » : corriger se fait dans Lun'Acedia.
2. **La voix.** Avis proposé : le verrou de l'ADR 0011 reste dans ce chantier. La règle corrigée ici est celle que la
   voix emploiera ; sa levée se décide à la session du desktop, sur les mesures des gestes, et non plus « après le
   VIP » d'office, puisque la voix est le premier chemin sur le desktop.
3. **Le refus qui montre la carte** (choix C.3). Avis proposé : oui. À savoir avant de dire oui : la règle écrite du
   core est « elle ne demande jamais de confirmation en conversation ». Ici ce n'est pas Natsume qui demande : c'est
   le code qui montre la carte quand les mots de CrOliX n'en désignent aucune. Dès que ses mots suffisent (le titre,
   le repère), la carte est tranchée d'un seul message. L'autre voie garde la phrase fixe et lui demande de nommer la
   carte lui-même.
4. **Le niveau.** `standard` : une règle de garde est touchée, mais elle n'est qu'élargie sur trois points bornés,
   chacun tenu par un test, et un geste reste annulable.

## Critères de fin

1. Une proposition de tri montre « Boîte » et « Étiquettes » avec leur valeur, sur la carte dépliée de la file, à la
   largeur d'un téléphone comme sur le desktop.
2. « Corriger » sur cette carte, une autre boîte choisie, « Valider » : le corps envoyé au poste est exactement
   `{ values }` avec la seule boîte changée, à la forme du contrat 1.5 ; le Journal dit la correction ; « Annuler »
   dans les secondes qui suivent ne laisse rien partir.
3. Les messages du tableau, rejoués contre la règle : le titre exact passe ; « tu peux valider la carte » suivi du
   titre passe. Et quand l'outil est appelé avec le repère d'une carte sur un message qui ne suffit pas : la réponse
   est la lecture de la carte, et un « valide » au message suivant la tranche.
4. Restent refusés, comme aujourd'hui : une question, une négation, le titre d'une autre carte, un seul mot du titre,
   un « oui » sans carte montrée, une carte qui envoie sans « envoie », une phrase à condition (« si ok »).
5. Une carte dont la boîte proposée a changé depuis sa lecture est dite changée, pas tranchée ; une étiquette créée
   entre-temps ne la change pas.
6. La lecture d'une carte dans le chat dit ce qui est proposé.
7. Les barrières du core sont vertes.

## Tâches

- [ ] **1. Lire `fields`** (core). Le schéma, le type du core et celui de l'écran, l'empreinte sur les valeurs ; un
      champ mal formé tombe seul. Tests : lu, mal formé, empreinte qui change avec une valeur et pas avec un choix.
- [ ] **2. Le dire dans le chat** (core). La lecture d'une carte porte une ligne par champ. Test.
- [ ] **3. Le montrer** (écran). La carte dépliée passe `fields` à la carte du kit. Test, et une capture aux deux
      largeurs.
- [ ] **4. Relayer la correction** (core). `values` à part de la réponse, dans le geste reçu, sa retenue, son relais
      vers le poste et son Journal ; borné en forme et en taille ; jamais en lot. Tests : la forme exacte du corps
      envoyé (le faux poste des tests ne la vérifie pas : le test le fait), le refus du poste rendu comme raison,
      l'annulation.
- [ ] **5. « Corriger »** (écran). `oncorrect` sur la carte de la file, le geste de l'écran, les textes du bandeau
      d'annulation et du Journal. Test, et une capture.
- [ ] **6. La règle : le titre et la demande** (core). Les tests d'abord : le tableau, puis les refus du critère 4.
- [ ] **7. La règle : le refus montre la carte** (core). Les tests d'abord : une carte simple, une carte à choix, une
      carte qui envoie, une carte en lecture seule, une carte changée ; le texte rangé comme une lecture ; la
      consigne alignée.
- [ ] **8. La mesure** par le vrai service, avec les vraies consignes et Haiku 5.5 : cinq formulations, trois fois
      chacune ; le relevé dit combien aboutissent, en combien de messages. Aucun seuil : un constat.
- [ ] **9. La relecture** du diff contre ce plan et les standards, puis la PR du core en brouillon.
- [ ] **10. La feuille de route** : le rang 4 dit ce qui reste (le lot, corriger par le chat, les piles), le verrou de
      la voix selon la décision 2. Ce plan coché.

## Preuves

Les tests du core et de son écran, leur sortie dans la PR. Deux captures de la carte (desktop, téléphone). Le relevé
de la tâche 8. Deux choses ne se prouvent pas sur le laptop : que le modèle appelle l'outil (la tâche 8 le mesure,
sans le promettre), et la chaîne réelle avec Lun'Acedia en service. Après la version 0.4.1 déployée, CrOliX refait
ses trois gestes du 26/11 (voir, corriger, trancher par le chat).

## Hors périmètre

- La validation par lot des propositions et corriger par le chat : rang 4, après le VIP.
- **Les piles** (plusieurs cartes de même sujet, tranchées ensemble) : elles restent comme aujourd'hui. Une carte
  d'une pile ne se désigne pas par son titre, et ne se corrige pas ici. À dire dans la feuille de route : deux
  propositions de même sujet peuvent proposer deux boîtes, et « valider tout » les tranche sans les montrer.
- La voix qui tranche une carte : décision 2.
- Lun'Acedia : inchangée. Une proposition d'avant sa version 0.4.0 reste sans synthèse.
- La formulation de « relis ma journée » (observation du 26/11) : l'écriture du core, rang 4.

## Risques

- **Le modèle n'appelle pas l'outil** et redemande une confirmation, comme le 26/11 : la tâche 8 le mesure ; le
  panneau reste le chemin sûr.
- **Une règle de garde élargie** : chaque élargissement a son test, et les refus d'aujourd'hui sont rejoués à
  l'identique (critère 4).
- **« Peux-tu valider… » tapé sans point d'interrogation passe**, alors que c'est une question. Accepté : le geste
  reste annulable, et une carte qui envoie est exclue.
- **Un « oui » après la carte montrée la valide**, même si CrOliX venait de demander de la refuser : la phrase nomme
  les gestes pour l'éviter, et le geste reste annulable.
- **Une carte montrée par erreur** (le modèle désigne la mauvaise) : CrOliX lit son texte avant de répondre.
- **Une version de plus à déployer** (core 0.4.1) avant la semaine de rodage.

## Ce que la contestation a changé

Contesté le 26/11, verdict « à amender ». Chaque point relu dans le code avant d'être repris.

- **B ne relaie pas « tel quel »** (bloquant, repris). Le core enveloppe aujourd'hui ce qu'il relaie, et refuse
  d'avance toute entrée sur une carte sans choix ; le poste attend `values` au premier niveau. B dit maintenant une
  clé à part, sur tout le chemin du geste (tâche 4).
- **Le faux poste ne prouve rien de la forme** (bloquant, repris) : le critère 2 et la tâche 4 demandent un test de
  la forme exacte du corps.
- **« Oui ou non » pouvait trancher à l'envers** (bloquant, repris) : la phrase nomme les gestes ; le reste du risque
  est écrit.
- **Le texte d'un poste rangé comme les mots de Natsume** (bloquant, repris) : C.3 passe par le chemin de la lecture.
- **C.3 réduit** (repris) : il rend la lecture de la carte, avec sa propre empreinte, au lieu d'un chemin neuf.
- **La règle « jamais de confirmation »** (repris) : dite dans la décision 3.
- **L'empreinte sur les choix** (repris) : sur les valeurs seules.
- **Les mots courts** (repris) : ignorés seulement s'ils sont dans le titre.
- **« Tu peux envoyer »** (repris) : les cartes qui envoient sont exclues de C.2.
- **Le core ne revérifie pas les choix** (repris) : il borne la forme, le poste vérifie.
- **Les piles** (réfuté pour ce chantier) : hors périmètre, écrit comme tel, avec ce que cela laisse.
- **Une version plus petite, sans B** (laissé à CrOliX) : décision 1.

## Limites

Rien n'a été rejoué sur l'instance : le diagnostic vient du code et des messages rapportés par CrOliX. La suite des
outils appelés par le modèle le 26/11 est déduite de ses réponses, le journal du core n'a pas été lu. L'écran de la
file et le texte du Journal d'un geste ont été lus en partie seulement : la tâche 5 commence par eux.
