# La nuit tient : des réponses trop longues coupées, le coût de la nuit complet. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** Lun-Ecosystem/lun-anima#139 (porteuse) et Lun-Ecosystem/lun-anima#119, `niveau:standard`, privées.
> Chantier choisi par CrOliX le 24/11 au soir, après « [La nuit et la mémoire](2026-11-24-nuit-et-memoire.md) ».
>
> **État : rédigé le 24/11.** À contester, puis à valider par CrOliX.
>
> Code relu sur `main` de Lun'Anima (`164e794`, la 0.3.0 en service sur le NAS). Le graphe d'abord, puis chaque point
> dans le code ; les six formes de réponse du core relues une à une. Lun'Anima est privé : ce plan dit le comportement,
> les critères, les tâches et les preuves. Les fichiers, les lignes, les tests et les commandes du core sont dans un
> commentaire de l'issue privée ([`securite.md`](../../standards/securite.md), « Dépôts publics »).

**But :** une nuit ne perd plus son portrait ni la pesée du tempérament parce que le modèle a écrit trop long. Le
total d'un passage de la veille dit ce que la nuit a vraiment payé.

**Source :** les deux issues et leurs constats. Lun-Ecosystem/lun-anima#139 : sur Haiku 5.5, raisonnement coupé, une
réponse structurée ne respecte pas sa longueur maximale (mesure du 24/11 : borne de 5 signes, réponse de 32 ; borne de
240, réponse de 446). Le chantier 1 du 24/11 a couvert le contexte chaud et le tri ; restent les autres réponses
bornées, et « une règle commune plutôt qu'un correctif par forme ». Lun-Ecosystem/lun-anima#119 : le total d'un
passage ne compte que le tri (une nuit de 0,0112 $ affichée 0,0012 $), constaté le 20/11
([plan des deux fournisseurs](2026-11-20-core-deux-fournisseurs.md), « Les mesures (tâche 8) », surprise 5).

**Critères de fin**, chacun prouvé en local :

1. **Un portrait ou un tempérament trop long est coupé, et l'étape réussit** : tests rouges sur `main`, sur le
   fournisseur Anthropic (son faux serveur), une réponse de plus de 4 000 signes pour chacun. La version écrite tient
   dans sa borne et finit par « … ». Sur OpenAI, la forme envoyée ne change pas : garde verte sur `main`. Tâche 1.
2. **Le total d'un passage de la veille compte tout ce que la nuit a payé** : test rouge sur `main`, une nuit où le
   tri, le portrait, le tempérament et les scènes paient chacun. Le total du passage, celui que rend sa commande et
   celui de son entrée au Journal égalent la somme de la table des coûts pour cette nuit. Tâche 2.
3. **Le reste ne bouge pas** : les tests existants restent verts, sauf une attente nommée dans la PR (un tempérament
   trop long, refusé aujourd'hui, coupé ensuite) ; les barrières du core sont vertes. Tâches 1 à 3.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-anima` : 2 tâches (1 et 2), une PR | dans l'issue privée | Lun-Ecosystem/lun-anima#139 et #119 | `standard` |
| `lun-docs` : ce plan et ses coches | `docs/nuit-tient` | la même | `trivial` |

**Le niveau.** `standard`, celui des issues. Le chantier suit la règle posée par le chantier 1 et le compte que le
matin fait déjà de son propre coût. Aucun écran ne change : le Journal affiche le même champ, juste. Aucun contrat ne
change. Chaque comportement changé a son test, écrit d'abord par le testeur
([`workflow.md`](../../standards/workflow.md)). Une PR dans Lun'Anima, qui ferme les deux issues ; ce plan va dans la
PR lun-docs du chantier. Pas de Chrome.

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
  vérification. La forme envoyée ne change pas. La coupe est partagée par le matin et la nuit.
- **Le portrait** se réécrit quand le dernier a plus d'une semaine et que le journal de la relation a grandi. Un
  échec n'écrit rien : la nuit suivante, le dernier portrait est toujours vieux d'une semaine, et l'étape refait
  l'appel. **Tant qu'il échoue, il se retente et se paie chaque nuit.** La consigne demande 300 mots au plus.
- **Le tempérament** se pèse une fois par semaine. La pesée est notée faite avant la vérification de la réponse : une
  réponse hors forme est « illisible », la pesée est perdue pour la semaine, rien ne s'écrit. La consigne demande
  4 000 signes au plus. Un test existant fixe ce refus d'un tempérament trop long.
- **Le verdict des scènes** n'a pas de borne dans sa forme ; sa note est coupée à 300 signes quand elle est gardée.
  Les scènes se jouent au premier passage, sur un autre modèle, après une nouvelle version du tempérament, ou tous
  les 30 jours.
- Hors des réponses structurées, **l'outil de délégation** de la conversation borne sa demande à 4 000 signes. Une
  demande plus longue est lue comme inutilisable : Natsume dit que la demande est illisible, rien ne part. Ce n'est
  pas la nuit (voir « Hors périmètre »).

### Le coût d'un passage de la veille

- Un passage couvre les jours en attente, puis la période, jour par jour. Chaque jour rend son coût : celui du tri,
  que la nuit additionne au total du passage.
- Puis trois dernières étapes, sur le jour tout juste couvert : le portrait, le tempérament, les scènes. Chacune
  inscrit chaque appel dans la table des coûts, à ce jour-là (les plafonds et l'écran des dépenses sont donc justes).
  **Aucune ne rend son coût au passage** : le total les ignore.
- Ce total est gardé avec le passage, repris par son entrée au Journal, rendu par la route qui lance la veille, et
  affiché par sa commande. Le même chiffre faux partout.
- **Le matin compte déjà juste** : il lit la dépense de la nuit sur son jour avant de commencer, puis après, et garde
  l'écart.
- Pendant les trois dernières étapes, rien d'autre ne paie la nuit sur le jour couvert : une seule veille tourne à la
  fois ; le matin et les scènes jouées à la demande paient sur le jour en cours ; la conversation a son propre compte.

## Les choix

### 1. La règle commune : couper avant de vérifier, forme par forme

- **A. Étendre la règle du chantier 1 aux deux textes qui restent (recommandé).** Le portrait et le tempérament
  passent par la même coupe, avant la vérification. Deux champs, la coupe et son commentaire existent déjà. La forme
  envoyée ne change pas : OpenAI reçoit la même requête. Toutes les réponses bornées suivent alors une seule règle.
- **B. Un seul endroit, dans le module d'Anthropic** : couper chaque texte de la réponse à la borne lue dans la
  forme. Il couvrirait les formes à venir. Mais il réécrit la réponse sans que l'appelant le sache (écarté pour les
  tableaux au chantier 1), et laisse OpenAI sans coupe : deux règles au lieu d'une. Plus de code que deux champs.
- **C. Un seul endroit, à la lecture** : une aide commune qui lit la forme et coupe avant chaque vérification. Six
  lectures à changer au lieu de deux champs, pour la même règle.
- **D. Retirer la borne de la vérification** (l'autre voie de l'issue). La forme envoyée naît de la même description
  que la vérification : elle perdrait sa borne, et la requête d'OpenAI changerait. Un texte sans borne entrerait dans
  les consignes du lendemain. Écarté.

Un seul endroit n'est pas plus court que forme par forme. Le code n'impose aucune décision à CrOliX.

### 2. Un tempérament trop long : coupé, comme le reste

- **Retenu : coupé.** La version écrite finit par « … » et entre en service. C'est la règle commune. Une nouvelle
  version lève déjà un événement pour CrOliX, qui peut la relire et la restaurer. Et les scènes se rejouent la même
  nuit, puisque la version est plus récente que leur dernier passage : son comportement est jugé aussitôt.
- **L'autre voie : garder le refus.** Aucun code, mais la pesée reste perdue pour la semaine sur une réponse trop
  longue, ce que l'issue demande de corriger.
- Le test existant qui refuse un tempérament trop long change d'attente : la seule attente existante qui change,
  nommée dans la PR. Le refus d'un tempérament vide reste.

### 3. Le total : mesurer ce que les dernières étapes ont payé

- **A. Mesurer l'écart, comme le matin (recommandé).** Le passage lit la dépense de la nuit sur le jour couvert avant
  les trois dernières étapes, puis après, et ajoute l'écart au total des jours. Un seul endroit, les étapes ne
  changent pas. Exact, puisque rien d'autre ne paie la nuit sur ce jour pendant ces étapes. Un appel refusé mais
  payé y entre aussi, comme dans la table.
- **B. Chaque étape rend son coût.** Trois étapes changent de forme de retour, et leurs tests avec. Plus de code pour
  le même chiffre.
- **C. Mesurer l'écart sur tout le passage, tri compris.** Il remplacerait la somme des jours. Les tests existants du
  passage simulent des jours qui rendent un coût sans l'inscrire : ils changeraient. Rien à y gagner.

## Tâches

**Barrières de chaque tâche** : celles de Lun'Anima, dans l'issue privée. Les tests de comportement s'écrivent
d'abord et sont rouges sur `main` ; les gardes, vertes sur `main`, fixent ce qui ne doit pas bouger. Chaque test dit
lequel il est.

1. - [ ] **Le portrait et le tempérament coupés** (`testeur`, puis `dev-core` ; Lun'Anima, fichiers dans l'issue
   privée). **En parallèle de la tâche 2.**
   - Tests rouges sur `main`, sur Anthropic (son faux serveur, comme les tests du contexte chaud) :
     - un portrait de plus de 4 000 signes, avec des espaces : l'étape réussit ; le portrait gardé tient dans 4 000
       signes, finit par « … » et reste masqué ;
     - un changement de tempérament de plus de 4 000 signes, avec trois souvenirs valides : la version est écrite,
       tient dans 4 000 signes, finit par « … » ; l'événement de la nouvelle version est levé.
   - Gardes, vertes sur `main` : sur OpenAI, la forme envoyée pour le portrait et pour le tempérament garde sa borne
     de 4 000, à l'identique ; un texte dans sa borne passe tel quel ; un tempérament vide reste refusé.
   - L'attente qui change : le test existant du tempérament trop long attend une version coupée. Sa moitié « vide »
     ne change pas. Nommée dans la PR.
   - Code : les deux textes passent par la coupe partagée avant la vérification, comme le tri et le contexte chaud.
     La forme envoyée ne change pas.
   - Exclu : le module d'Anthropic, les consignes, le verdict des scènes, les formes déjà coupées, l'outil de
     délégation.
2. - [ ] **Le total d'un passage compte toute la nuit** (`testeur`, puis `dev-core` ; Lun'Anima, fichiers dans
   l'issue privée). **En parallèle de la tâche 1.**
   - Test rouge sur `main` : une nuit jouée en vrai, sur un faux fournisseur qui répond à chaque forme, où le tri, le
     portrait, le tempérament et les scènes paient chacun. Le total rendu par le passage, celui gardé avec lui et
     celui de son entrée au Journal égalent la somme de la table des coûts pour cette nuit.
   - Gardes, vertes sur `main` et inchangées : les tests existants du passage (jours simulés, étapes injectées)
     gardent leur total.
   - Code : le passage mesure la dépense de la nuit sur le jour couvert avant et après ses trois dernières étapes,
     comme le matin, et ajoute l'écart à son total. Les étapes ne changent pas.
   - Exclu : les passages déjà notés, le matin, la table des coûts, les plafonds, l'écran des dépenses.
3. - [ ] **La revue et la livraison** (`reviewer`, puis `livreur`). **Après 1 et 2.** Le diff relu contre ce plan et
   les standards. Une PR Lun'Anima en brouillon, qui ferme Lun-Ecosystem/lun-anima#139 et
   Lun-Ecosystem/lun-anima#119, avec la sortie des tests rouges devenus verts, la suite entière et les barrières.
   Ce plan coché dans la PR lun-docs du chantier. Après la fusion, le graphe mis à jour.

**L'ordre.** Le testeur écrit d'abord les tests des tâches 1 et 2, d'un même passage : ils ne partagent aucun
fichier. Puis `dev-core` fait les deux tâches. Elles sont parallèles, sans fichier commun ; dans un même worktree, un
seul `dev-core` les enchaîne, plus simple que deux worktrees pour quelques lignes. Puis la revue, puis le livreur.

## Ensuite, hors du chantier

- La version du core publiée, puis déployée par la porte, par CrOliX.
- La première nuit sur le NAS après le déploiement : le coût de son entrée au Journal égale la dépense de la nuit à
  l'écran des dépenses, pour ce jour.

## Hors périmètre

- Recalculer le total des passages déjà notés : ils gardent leur chiffre faux ; la table des coûts a toujours été
  juste.
- L'outil de délégation de la conversation : une demande de plus de 4 000 signes est dite illisible, rien ne part.
  Qu'Anthropic tienne cette borne pour un outil n'est pas mesuré. Si le cas se voit, une issue à part.
- Une longueur minimale non tenue : un portrait vide fait toujours échouer l'étape, ce qui est voulu (rien à garder).
- Une garde générale contre une forme bornée à venir qui oublierait la coupe : aucune n'est prévue.
- Les consignes du portrait et du tempérament : elles ne changent pas.

## Limites

- **Un texte coupé finit en pleine pensée.** Pour le portrait, la version suivante le remplace une semaine plus tard.
  Pour le tempérament, la version coupée sert à chaque tour jusqu'à la prochaine ; CrOliX la voit par l'événement et
  peut la restaurer, et les scènes la jugent la même nuit.
- **Le risque mesuré est faible pour ces deux textes** : le portrait est demandé en 300 mots, loin de sa borne. Le
  tempérament est demandé à 4 000 signes, c'est lui qui peut la passer. Le chantier ferme le cas, sans mesure de
  plus.
- **Une forme bornée à venir** reviendra au même défaut si elle oublie la coupe. Le commentaire de la coupe le dit.
- **Le total compte ce que la nuit paie sur le jour couvert.** Une série de scènes lancée à la demande juste avant
  5 h, qui tournerait encore pendant les dernières étapes de la veille, y entrerait : cas théorique.

## Questions à CrOliX

Aucune, hors la validation du plan. Le choix 2 est le seul qui change une attente existante : un tempérament trop
long sera coupé au lieu d'être refusé.
