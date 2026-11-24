# La nuit tient : des réponses trop longues coupées, le coût de la nuit complet. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** Lun-Ecosystem/lun-anima#139 (porteuse) et Lun-Ecosystem/lun-anima#119, `niveau:standard`, privées.
> Chantier choisi par CrOliX le 24/11 au soir, après « [La nuit et la mémoire](2026-11-24-nuit-et-memoire.md) ».
>
> **État : rédigé le 24/11 ; contesté le 24/11 ; amendé le 24/11** (« Ce que la contestation a changé »). **Une
> décision attend CrOliX** : le tempérament trop long (« La décision de CrOliX »). À valider par CrOliX.
>
> Code relu sur `main` de Lun'Anima (`164e794`, la 0.3.0 en service sur le NAS). Le graphe d'abord, puis chaque point
> dans le code ; les six formes de réponse du core relues une à une, et chaque point de la contestation vérifié dans
> le code. Lun'Anima est privé : ce plan dit le comportement, les critères, les tâches et les preuves. Les fichiers,
> les lignes, les tests et les commandes du core sont dans un commentaire de l'issue privée
> ([`securite.md`](../../standards/securite.md), « Dépôts publics »).

**But :** une nuit ne perd plus son portrait parce que le modèle a écrit trop long, tant que la réponse tient dans son
budget de jetons. Un tempérament trop long ne passe jamais coupé, et son refus se voit. Le total d'un passage de la
veille dit ce que ce passage a payé.

**Source :** les deux issues et leurs constats. Lun-Ecosystem/lun-anima#139 : sur Haiku 5.5, raisonnement coupé, une
réponse structurée ne respecte pas sa longueur maximale (mesure du 24/11 : borne de 5 signes, réponse de 32 ; borne de
240, réponse de 446). Le chantier 1 du 24/11 a couvert le contexte chaud et le tri ; restent les autres réponses
bornées, et « une règle commune plutôt qu'un correctif par forme ». Lun-Ecosystem/lun-anima#119 : le total d'un
passage ne compte que le tri (une nuit de 0,0112 $ affichée 0,0012 $), constaté le 20/11
([plan des deux fournisseurs](2026-11-20-core-deux-fournisseurs.md), « Les mesures (tâche 8) », surprise 5). La
contestation du 24/11.

**Critères de fin**, chacun prouvé en local, écrits pour l'option (c) recommandée :

1. **Un portrait trop long est coupé, et l'étape réussit** : test rouge sur `main`, sur le fournisseur Anthropic (son
   faux serveur), une réponse de plus de 4 000 signes qui tient dans le budget de jetons. Le portrait gardé tient dans
   4 000 signes, finit par « … », et un secret coupé par la borne reste masqué. Un portrait de blancs reste refusé.
   Sur OpenAI, la forme envoyée ne change pas, comparée en entier : garde verte sur `main`. Tâche 1.
2. **Un tempérament trop long ne met jamais en service un texte coupé** : test sur un tempérament trop long dont la
   fin est le bloc d'exemples. Rien ne change en service, aucun bloc ne reste ouvert, et un événement dit au Journal
   que la pesée est perdue, sans le texte. Tâche 1.
3. **Le total d'un passage de la veille égale ce que ce passage a inscrit** : test rouge sur `main`, une nuit où le
   tri, le portrait, le tempérament et les scènes paient chacun, sur un jour qui porte déjà un coût du matin et un
   coût de conversation. Le total rendu, celui que garde le passage et celui de son entrée au Journal égalent le tri
   et les trois étapes, rien de plus. Ce que Lun'Avaritia paie de son côté n'y entre pas. Tâche 2.
4. **Le reste ne bouge pas** : les tests existants restent verts ; les barrières du core sont vertes. Tâches 1 à 3.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-anima` : 2 tâches (1 et 2), une PR | dans l'issue privée | Lun-Ecosystem/lun-anima#139 et #119 | `standard` |
| `lun-docs` : ce plan et ses coches | `docs/nuit-tient` | la même | `trivial` |

**Le niveau.** `standard`, celui des issues. Le chantier suit la règle posée par le chantier 1 et le compte que le
matin fait déjà de son propre coût. Aucun écran ne change : le Journal affiche le même champ, juste, et un événement
de plus, comme celui d'une nouvelle version. Aucun contrat ne change. Chaque comportement changé a son test, écrit
d'abord par le testeur ([`workflow.md`](../../standards/workflow.md)). Une PR dans Lun'Anima, qui ferme les deux
issues ; ce plan va dans la PR lun-docs du chantier. Pas de Chrome.

## La décision de CrOliX : le tempérament trop long

Le tempérament n'est pas un résumé comme le portrait : c'est une part de son identité, lue en tête de chaque tour. La
graine finit par son bloc d'exemples (936 signes sur 1 795), et une version entière les reprend, comme la consigne le
demande. Couper la fin enlève les exemples, ou laisse le bloc ouvert : les règles et le contexte du jour, écrits juste
après dans chaque tour, tombent alors dans un bloc dit « fictif ».

- **(a) Couper, et le dire.** Le journal du core et l'événement de la version disent « coupée ». Coût : la coupe, deux
  lignes de texte, leurs tests. Ce qu'elle laisse : une version sans ses exemples, ou au bloc ouvert, en service une
  semaine (le frein de sept jours) ; la réponse entière n'est gardée nulle part ; la restauration ne se fait qu'au
  terminal ; le juge des scènes note le comportement, pas le ton. Avec elle, le critère 2 changerait : un bloc ouvert
  pourrait entrer en service.
- **(b) Couper seulement si les blocs restent fermés, sinon refuser.** Coût : la coupe, une vérification des balises,
  leurs tests. Ce qu'elle laisse : les exemples sont à la fin, donc une coupe tombe dans le bloc (refus) ou avant lui
  (tous les exemples perdus, sans bloc ouvert, et acceptée). Plus de code, et le pire cas reste possible.
- **(c) Garder le refus (recommandé).** Zéro code pour le refus : rien ne change en service, la pesée est perdue pour
  la semaine. L'identité ne se coupe jamais. Le risque est faible : la graine fait 1 795 signes pour une borne de
  4 000.

**Le refus, aujourd'hui, ne se voit pas.** Il n'écrit qu'une ligne au journal du core (« réponse illisible », avec sa
longueur), que personne ne lit ; ni événement, ni entrée au Journal, et la veille se dit réussie. Une semaine de
tempérament figé passe donc inaperçue. **Le plus petit ajout utile est un événement normal**, levé là où le refus se
décide aujourd'hui, sans le texte : il arrive au Journal comme celui d'une nouvelle version. Quelques lignes,
recommandées avec (b) comme avec (c) ; avec (a), c'est l'événement « coupée ». Il dit toute pesée perdue sur une
réponse illisible, trop longue ou tronquée.

Les tâches sont écrites pour (c) avec l'événement. Si CrOliX choisit (b), la tâche 1 ajoute la coupe du tempérament et
la vérification des balises, et le test du critère 2 reste le même.

## Ce que le code fait aujourd'hui

### Les textes bornés des réponses structurées

Le core demande six formes de réponse au modèle, toutes à la nuit ou au matin. Rien d'autre n'appelle le modèle avec
une forme imposée. Chaque texte borné l'est deux fois : dans la forme envoyée, et à la vérification de la réponse.

| Forme | Texte borné | Borne | Quand | Réponse trop longue, aujourd'hui |
|---|---|---|---|---|
| Recherches du matin | chaque nom | 60 | le matin, chaque jour | coupée (chantier 1) |
| Contexte chaud | le contexte | 4 000 | le matin, chaque jour | coupée (chantier 1) |
| Contexte chaud | la phrase du jour | 240 | le matin, chaque jour | coupée (chantier 1) |
| Tri | observation, souvenir, réaction, récit | 2 000 | la nuit, chaque jour | coupée (chantier 1) |
| Portrait | le portrait | 4 000 | la nuit, voir plus bas | **l'étape échoue** |
| Tempérament | le texte de la version | 4 000 | la nuit, une pesée par semaine | **la pesée échoue** |
| Verdict des scènes | la note du juge | aucune | la nuit, voir plus bas | sans objet |

- **OpenAI** reçoit la forme telle quelle, en mode strict. **Anthropic** l'accepte avec ses longueurs (son module ne
  retire que les bornes de tableau et de nombre), mais ne les impose pas : mesuré le 24/11.
- **Le chantier 1** coupe avant la vérification : un texte trop long est coupé au dernier espace avant sa borne,
  suivi de « … » (un nom de recherche est coupé net à 60). Les longueurs se comptent en signes, comme la
  vérification. La forme envoyée ne change pas (relevé le 24/11, forme entière). La coupe est partagée par le matin
  et la nuit. **Deux défauts** : les secrets se masquent après la coupe, et un texte de blancs coupé devient « … ».
- **Le portrait** se réécrit quand le dernier a plus d'une semaine et que le journal de la relation a grandi. Un
  échec n'écrit rien : la nuit suivante, le dernier portrait est toujours vieux d'une semaine, et l'étape refait
  l'appel. **Tant qu'il échoue, il se retente et se paie chaque nuit.** La consigne demande 300 mots au plus. Son
  budget est de 1 500 jetons : une réponse plus longue revient tronquée, JSON illisible, et l'étape échoue aussi.
- **Le tempérament** se pèse une fois par semaine. La pesée est notée faite avant la vérification de la réponse : une
  réponse hors forme est « illisible », la pesée est perdue pour la semaine, rien ne s'écrit. La consigne demande le
  texte entier, 4 000 signes au plus. Un test existant fixe ce refus d'un tempérament trop long.
- **Le verdict des scènes** n'a pas de borne dans sa forme ; sa note est coupée à 300 signes quand elle est gardée.
  Les scènes se jouent au premier passage, sur un autre modèle, après une nouvelle version du tempérament, ou tous
  les 30 jours. Leur juge note le comportement, pas le ton.
- Hors des réponses structurées, **l'outil de délégation** de la conversation borne sa demande à 4 000 signes. Une
  demande plus longue est lue comme inutilisable : Natsume dit que la demande est illisible, rien ne part. Ce n'est
  pas la nuit (voir « Hors périmètre »).

### Le coût d'un passage de la veille

- Un passage couvre les jours en attente, puis la période, jour par jour. Chaque jour rend son coût : celui du tri,
  que la nuit additionne au total du passage.
- Puis trois dernières étapes, sur le jour tout juste couvert : le portrait, le tempérament, les scènes. Le core
  inscrit chaque appel à ce jour-là, pour la nuit (les plafonds et l'écran des dépenses le comptent donc).
  **Aucune ne rend son coût au passage** : le total les ignore.
- Ce total est gardé avec le passage, repris par son entrée au Journal, rendu par la route qui lance la veille, et
  affiché par sa commande. Le même chiffre faux partout.
- **Le matin compte déjà juste** : il lit la dépense de la nuit sur son jour avant de commencer, puis après, et garde
  l'écart. Le contexte chaud est payé sur le jour du matin : **le jour couvert par une veille porte donc déjà le coût
  de son matin.**
- Pendant les trois dernières étapes, rien d'autre ne paie la nuit sur le jour couvert : une seule veille tourne à la
  fois ; le matin paie sur le jour en cours ; la conversation a son propre compte ; les scènes jouées à la demande
  s'écrivent dans une base en mémoire, jamais dans la vraie.
- **L'écran des dépenses** ne détaille la part des routines que pour le jour en cours, sous le nom « lettre du
  matin » ; ses barres de la semaine additionnent tout, conversation et postes compris. Il ne dit pas le coût d'une
  nuit.

## Les choix

### 1. La règle commune : couper avant de vérifier, forme par forme

- **A. Étendre la règle du chantier 1 au portrait (recommandé).** Le portrait passe par la même coupe, avant la
  vérification. Un champ, la coupe et son commentaire existent déjà. La forme envoyée ne change pas : OpenAI reçoit
  la même requête. Le tempérament suit la décision de CrOliX.
- **B. Un seul endroit, dans le module d'Anthropic** : couper chaque texte de la réponse à la borne lue dans la
  forme. Il couvrirait les formes à venir. Mais il réécrit la réponse sans que l'appelant le sache (écarté pour les
  tableaux au chantier 1), laisse OpenAI sans coupe, et couperait le tempérament. Plus de code qu'un champ.
- **C. Un seul endroit, à la lecture** : une aide commune qui lit la forme et coupe avant chaque vérification. Six
  lectures à changer au lieu d'un champ, et la même exception à faire pour le tempérament.
- **D. Retirer la borne de la vérification** (l'autre voie de l'issue). La forme envoyée naît de la même description
  que la vérification : elle perdrait sa borne, et la requête d'OpenAI changerait. Un texte sans borne entrerait dans
  les consignes du lendemain. Écarté.

Un seul endroit n'est pas plus court que forme par forme. **La coupe partagée se corrige, une fois pour toutes les
formes** : elle masque les secrets avant de couper, et une coupe qui ne garde que des blancs rend un texte vide, que
la vérification juge comme tel.

### 2. Le total : mesurer ce que les dernières étapes ont payé

- **A. Mesurer l'écart, comme le matin (recommandé).** Le passage lit la dépense de la nuit sur le jour couvert avant
  les trois dernières étapes, puis après, et ajoute l'écart au total des jours. Un seul endroit, les étapes ne
  changent pas. Exact, puisque rien d'autre ne paie la nuit sur ce jour pendant ces étapes ; le coût du matin, déjà
  inscrit avant, reste hors de l'écart. Un appel refusé mais payé y entre aussi.
- **B. Chaque étape rend son coût.** Trois étapes changent de forme de retour, et leurs tests avec. Plus de code pour
  le même chiffre.
- **C. Mesurer l'écart sur tout le passage, tri compris.** Il remplacerait la somme des jours. Les tests existants du
  passage simulent des jours qui rendent un coût sans l'inscrire : ils changeraient. Rien à y gagner.

## Ce que la contestation a changé

Chaque point relu sur `main` (`164e794`) avant d'entrer ici. Aucun n'est réfuté ; deux sont précisés.

1. **Le tempérament coupé perd ses exemples** (bloquant) : vérifié. Les chiffres sont 936 signes d'exemples sur 1 795
   (la contestation disait environ 750 sur 1 700). Le choix devient la décision de CrOliX, (c) recommandée ; le
   critère 2 porte le test demandé.
2. **Un texte de blancs coupé devient « … » et passe** : vérifié, et plus large que le tempérament. Le portrait et
   quatre formes du chantier 1 ont le même défaut. Corrigé dans la coupe partagée, avec une garde.
3. **La preuve « Ensuite » sur l'écran des dépenses est impossible** : vérifié. Remplacée par une lecture seule de la
   copie du jour, décrite dans l'issue privée.
4. **Le test du total ne reproduisait pas la vraie nuit** : vérifié. Le jour couvert porte le coût de son matin. Le
   test sème un coût du matin et un de conversation ; le critère 3 dit « ce que ce passage a inscrit ».
5. **Les scènes à la demande** s'écrivent dans une base en mémoire : vérifié. La limite fausse est retirée, la puce
   corrigée.
6. **Un portrait au-delà de son budget de jetons** revient tronqué et échoue : vérifié. Le but est borné, la limite
   écrite.
7. **La garde OpenAI** compare désormais la forme envoyée en entière, relevée sur `main` (dans l'issue privée).
8. **Le masquage après la coupe** laisse des groupes d'un numéro en clair : vérifié, et présent depuis le chantier 1.
   Précisé : plutôt qu'une limite, la coupe partagée masque avant de couper (une ligne), avec un test.
9. **Un nom de l'intérieur du core**, cité six fois : remplacé par « ce que le core inscrit de chaque appel ».
10. **Un passage coupé par un arrêt du core** finit en échec sans total : vérifié, écrit dans les limites.

Ce qui tient sans changement : la liste des six formes, la forme OpenAI inchangée, la coupe en signes, la pesée notée
avant la vérification, la mesure de l'écart pour le total, les tâches 1 et 2 sans fichier commun.

## Tâches

**Barrières de chaque tâche** : celles de Lun'Anima, dans l'issue privée. Les tests de comportement s'écrivent
d'abord et sont rouges sur `main` ; les gardes, vertes sur `main`, fixent ce qui ne doit pas bouger. Chaque test dit
lequel il est.

1. - [ ] **Le portrait coupé, le tempérament refusé à voix haute** (`testeur`, puis `dev-core` ; Lun'Anima, fichiers
   dans l'issue privée). **Après la décision de CrOliX ; en parallèle de la tâche 2.** Écrite pour (c).
   - Tests rouges sur `main` :
     - la coupe partagée : un secret qui chevauche la borne est masqué en entier ; une coupe qui ne garde que des
       blancs rend un texte vide ;
     - sur Anthropic, un portrait de plus de 4 000 signes avec des espaces, dans le budget de jetons : l'étape réussit,
       le portrait tient dans 4 000 signes et finit par « … » ; avec un numéro bancaire inventé à cheval sur la borne,
       aucun de ses groupes n'est gardé en clair ;
     - sur Anthropic, un tempérament trop long dont la fin est le bloc d'exemples : un événement normal dit la pesée
       perdue, sans le texte.
   - Gardes, vertes sur `main` : dans ce même cas, rien ne change en service et aucun bloc ne reste ouvert dans ce
     qu'elle lit en tête d'un tour ; un portrait de plus de 4 000 blancs reste refusé ; un texte dans sa borne passe
     tel quel ; sur OpenAI, la forme envoyée pour le portrait et pour le tempérament est la même, comparée en entier.
   - Code : le portrait passe par la coupe partagée avant la vérification. La coupe masque avant de couper, et rend un
     texte vide quand elle ne garderait que des blancs. Le refus d'une réponse illisible du tempérament lève un
     événement, sans le texte. La forme envoyée ne change pas.
   - Exclu : le module d'Anthropic, les consignes, le budget de jetons du portrait, le verdict des scènes, l'outil de
     délégation. Aucune attente existante ne change.
2. - [ ] **Le total d'un passage compte ce qu'il a payé** (`testeur`, puis `dev-core` ; Lun'Anima, fichiers dans
   l'issue privée). **Tout de suite ; en parallèle de la tâche 1.**
   - Test rouge sur `main` : avant le passage, un coût du matin sur le jour couvert et un coût de conversation. Puis
     une nuit jouée en vrai, sur un faux fournisseur qui répond à chaque forme, où le tri, le portrait, le tempérament
     et les scènes paient chacun. Le total rendu, celui gardé avec le passage et celui de son entrée au Journal
     égalent ce que ce passage a inscrit : le tri et les trois étapes, sans le matin ni la conversation.
   - Gardes, vertes sur `main` et inchangées : les tests existants du passage (jours simulés, étapes injectées)
     gardent leur total.
   - Code : le passage mesure la dépense de la nuit sur le jour couvert avant et après ses trois dernières étapes,
     comme le matin, et ajoute l'écart à son total. Les étapes ne changent pas.
   - Exclu : les passages déjà notés, le matin, ce que le core inscrit de chaque appel, les plafonds, l'écran des
     dépenses.
3. - [ ] **La revue et la livraison** (`reviewer`, puis `livreur`). **Après 1 et 2.** Le diff relu contre ce plan et
   les standards. Une PR Lun'Anima en brouillon, qui ferme Lun-Ecosystem/lun-anima#139 et
   Lun-Ecosystem/lun-anima#119, avec la sortie des tests rouges devenus verts, la suite entière et les barrières.
   Ce plan coché dans la PR lun-docs du chantier. Après la fusion, le graphe mis à jour.

**L'ordre.** La tâche 2 part tout de suite : elle ne dépend pas de la décision. La tâche 1 attend la décision de
CrOliX sur le tempérament. Le testeur écrit les tests de chaque tâche avant son code ; elles ne partagent aucun
fichier. Dans un même worktree, un seul `dev-core` les enchaîne, plus simple que deux worktrees pour quelques lignes.
Puis la revue, puis le livreur.

## Ensuite, hors du chantier

- La version du core publiée, puis déployée par la porte, par CrOliX.
- Après la première nuit sur le NAS : une lecture seule de la copie du lendemain, sur l'essai de la porte (dans
  l'issue privée). Le total du passage doit égaler ce que la nuit a inscrit sur le jour couvert, moins ce qu'y ont
  payé les matins. L'écran des dépenses ne permet pas ce constat.

## Hors périmètre

- Recalculer le total des passages déjà notés : ils gardent leur chiffre faux ; ce que le core inscrit de chaque appel
  a toujours été juste.
- Le budget de jetons du portrait : il ne change pas (voir « Limites »).
- L'outil de délégation de la conversation : une demande de plus de 4 000 signes est dite illisible, rien ne part.
  Qu'Anthropic tienne cette borne pour un outil n'est pas mesuré. Si le cas se voit, une issue à part.
- Une garde générale contre une forme bornée à venir qui oublierait la coupe : aucune n'est prévue.
- Les consignes du portrait et du tempérament : elles ne changent pas.
- Ce que Lun'Avaritia paie quand il traite ce que la nuit lui envoie : c'est sa dépense, lue par ses coûts.

## Limites

- **Un portrait coupé finit en pleine pensée.** La version suivante le remplace une semaine plus tard.
- **La coupe ne sert que dans le budget de jetons.** Un portrait de plus de 1 500 jetons revient tronqué, illisible :
  l'étape échoue et se repaie chaque nuit, comme aujourd'hui. Quatre mille signes en font environ 1 200 : la marge
  couvre un dépassement modéré, pas un portrait deux fois trop long.
- **Avec (c), un tempérament trop long perd sa semaine.** L'événement le dit ; le risque est faible pour une borne
  plus de deux fois plus grande que la graine.
- **Une forme bornée à venir** reviendra au même défaut si elle oublie la coupe. Le commentaire de la coupe le dit.
- **Un passage coupé par un arrêt du core** finit en échec, sans total : ses appels sont inscrits un à un, mais aucun
  total ne les compte.

## Questions à CrOliX

1. **Le tempérament trop long** : (a), (b) ou (c) ? Recommandé : (c), avec l'événement qui dit la pesée perdue. La
   tâche 1 l'attend ; la tâche 2 part sans elle.
