# L'historique rejoué au modèle garde les appels d'outil et ce qu'ils ont rendu. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-anima#118 (`niveau:standard`, privé), recadrée par CrOliX le 20/11 au soir.
>
> **État : rédigé le 20/11.** À contester, puis les points de « À trancher par CrOliX » un à un.
>
> Code relu sur `main` de Lun'Anima (`eb7ae40`, le chantier des deux fournisseurs fusionné) ; le graphe d'abord,
> puis chaque point dans le code. Lun'Anima est privé : ce plan dit les critères, les tâches en comportement, les
> mesures, les risques et les décisions. Les fichiers, les lignes et tout ce qui décrit l'intérieur du core sont dans
> l'issue privée ([`securite.md`](../../standards/securite.md), « Dépôts publics »).

**But :** quand Natsume a appelé un outil, le fil qu'on rejoue ensuite au modèle le montre comme un tour d'outil :
l'appel, puis ce que l'outil a rendu. Haiku 5.5 cesse de recopier une forme sans appel, et d'inventer un résultat.
Rien de ce que voit l'utilisateur ne change. Le modèle de la semaine de rodage se redécide sur la mesure.

**Source :** l'issue et son commentaire du 20/11 (la mesure qui écarte trois formulations des consignes et met en
cause la forme de l'historique). La décision de CrOliX du 20/11 au soir : corriger l'historique, puis décider du modèle
du rodage sur la mesure ; **d'ici là, OpenAI reste en service**. Le
[plan des deux fournisseurs](2026-11-20-core-deux-fournisseurs.md) pour la méthode, les chiffres de départ et sa
leçon : mesurer avec les vraies consignes, dans les vraies conditions.

**La date.** Fusionné et livré en image **avant la semaine de rodage**, comme le chantier des deux fournisseurs.

**Critères de fin**, ceux de l'issue, chacun prouvé en local par une commande ou une capture :

1. **L'historique rejoué garde, pour un tour où un outil a été appelé, l'appel et ce que l'outil a rendu**, dans la
   forme que chaque fournisseur attend : confier à un poste, relire sa journée, lire et trancher une carte. Tâches 3
   à 5. Si la mesure de la tâche 1 retient la forme minimale (« La conception »), ce critère se lit pour elle, et
   la PR le dit.
2. **Une conversation d'avant ce changement se rejoue sans erreur**, et rien de ce que l'utilisateur voit ne change :
   l'annonce, le résultat, le journal. Tâches 3 et 5.
3. **Mesuré dans des conversations longues**, sur Haiku 5.5 et sur le modèle d'OpenAI en service, avant et après,
   coût annoncé : les délégations faites sur les demandes qui en attendent une, les résultats inventés (une réponse qui
   affirme un résultat sans appel), les annonces sans appel. Sur OpenAI, rien ne se dégrade. Tâches 1 et 6.
4. **Les autres mesures ne bougent pas en mal** sur les deux : le premier mot, la phrase d'attente en fil neuf, les
   scènes, le coût d'un tour (l'historique grossit : de combien). Tâche 6.
5. **Le choix du modèle du rodage est reposé à CrOliX** sur ces chiffres. Tâche 7.

| Dépôt | Issue | Niveau |
|---|---|---|
| `lun-anima` : 7 tâches (5 si la forme minimale est retenue) | Lun-Ecosystem/lun-anima#118 | `standard` |
| `lun-docs`, `docs/historique-outils` : ce plan, ses coches et ses chiffres | la même | `trivial` |

**Le niveau.** `standard`. Le chantier touche ce que le modèle lit à chaque tour, pas ce que voit l'utilisateur ; il
ajoute une donnée facultative au message, sans réécrire une ligne existante. Chaque comportement changé a son test,
écrit d'abord par le testeur ([`workflow.md`](../../standards/workflow.md)). Une PR par dépôt ; celle du core ferme
l'issue.

## Ce que le core fait aujourd'hui, en comportement

- **Un tour avec un outil se joue en deux appels.** Le premier appel offre les outils du moment : confier à un poste
  (s'il y a un poste joignable), relire sa journée (toujours), lire une carte (au fil principal), trancher une carte
  (seulement si son message peut être un geste). Les outils offerts changent donc d'un tour à l'autre. Le modèle
  annonce, ou non, puis appelle ; le code ne garde que le premier appel et l'exécute.
- **Le second appel dit le résultat**, après une délégation ou une relecture : **sans outils**, avec l'annonce en tour
  de l'assistant, puis le résultat passé en tour ordinaire de l'utilisateur, avec ses consignes (« Voici ce que tu
  viens d'obtenir… »). Lire une carte et trancher une carte n'ont pas de second appel : le texte de la carte, ou une
  phrase fixe, est la réponse.
- **À la fin, un seul message est rangé** : l'annonce, une ligne vide, la réponse. Ni l'appel, ni ses arguments, ni ce
  que l'outil a rendu ne sont rangés avec lui ; la frontière entre l'annonce et la réponse non plus.
- **Le fil rejoué** : les messages réussis seuls, plafonnés en nombre et en signes ; au fil principal, depuis le début
  du jour de Natsume plus quelques messages d'avant ; un sujet garde tout. Chaque message repasse comme un rôle et un
  texte. Un tour délégué se rejoue donc comme un seul texte de l'assistant, l'annonce puis le résultat, **sans
  appel** : la forme que Haiku recopie. La parole d'elle-même et le rituel rejouent le même fil, sans outils.
- **L'interface du fournisseur** ne connaît que des tours faits d'un rôle et d'un texte ; un appel d'outil reçu n'a pas
  d'identifiant (les deux modules jettent celui de l'API). Le module d'Anthropic retire les tours vides.
- **Ce que la base garde d'une délégation**, à part du message : le poste, la demande masquée et coupée court, le
  résumé du poste masqué et coupé, l'issue, le coût, la durée, l'entrée du journal. **Aucun lien vers le message**, et
  l'heure est celle de l'enregistrement. La relecture, la lecture et le geste sur une carte ne laissent ni leurs
  arguments ni leur résultat.
- **Qui lit les messages** : l'écran du fil, la relecture de la journée, la situation, la nuit (le tri, les souvenirs,
  l'envoi à la mémoire), le rituel, la parole d'elle-même, l'état du core, la purge. Chacun lit le texte et les
  colonnes qu'il nomme, rien d'autre.

## Ce que les API imposent : à lire, pas à deviner

Le développeur lit la documentation à jour de chaque fournisseur et les types des SDK installés **avant d'écrire**,
et vérifie sur un appel réel (tâche 1). Ce qui pèse sur le plan, à confirmer :

- **La forme d'un tour d'outil rejoué** chez chacun : l'appel dans le tour de l'assistant (son identifiant, son nom,
  ses arguments, à côté d'un texte ou seul) ; le résultat (un rôle propre chez l'un, un bloc dans un tour de
  l'utilisateur chez l'autre) ; leur appariement par identifiant ; le format d'identifiant accepté, pour un
  identifiant construit par le core et stable d'un rejeu à l'autre.
- **L'ordre** : chez Anthropic, un appel doit être suivi de son résultat au tour suivant ; ce qui arrive à un appel
  sans résultat, à un résultat sans appel.
- **Les outils déclarés** : une requête dont l'historique porte des tours d'outil doit en général déclarer ces outils.
  Ce qui arrive quand un outil rejoué n'est pas offert dans la requête, ou qu'aucun ne l'est (le second appel, la
  parole d'elle-même).
- **Deux tours de l'assistant à la suite** : Anthropic les fusionne (vu le 20/11) ; une forme qui sépare l'annonce de
  la réponse en deux tours n'a donc pas le même sens chez les deux.
- **Le raisonnement** : coupé à la voix, aucun bloc de raisonnement n'est à rejouer ; à confirmer pour un tour d'outil.
- **Le décompte** : ce que pèse un tour d'outil rejoué, en jetons, chez chacun.

## La conception : le plus petit changement

**Deux formes candidates**, départagées par la tâche 1 :

- **(a) Les tours d'outil complets.** Un tour délégué se rejoue en trois temps : l'annonce avec l'appel ; le résultat
  rendu par l'outil, comme donnée, sans les consignes du second appel ; la réponse dite.
- **(b) Le minimum : l'annonce retirée de ce qui est rejoué.** Le tour se rejoue comme sa seule réponse. Déjà mesuré :
  20 délégations sur 24 au lieu de 15. Séparer l'annonce en un tour à part n'est pas retenu comme candidat : Anthropic
  fusionne deux tours de l'assistant, la forme ne vaudrait que chez un fournisseur.

**La règle du choix.** Si (a) ne fait pas nettement mieux que (b) (« Tâche 2 »), le plan retient (b) : pas de
changement de l'interface, pas de module touché, aucun refus possible d'un fournisseur. Si aucune forme ne ramène
Haiku près d'OpenAI, le plan s'arrête et revient à CrOliX : le rodage se jouerait sur OpenAI.

**Ce qui se range.** Une donnée facultative de plus sur le message réussi d'un tour où un outil a été exécuté. Pour
(a) : l'outil, ses arguments, ce qu'il a rendu, la longueur de l'annonce. Pour (b) : la longueur de l'annonce seule.
Le résultat est masqué et coupé comme le résumé d'une délégation l'est déjà. La donnée n'entre ni dans ce que rendent
les routes, ni dans ce que lit la nuit : **les autres lecteurs ne la voient pas**, le texte du message ne change pas.
Une migration qui **ajoute** une colonne vide, sans réécrire une ligne : aucune migration risquée.

**Les tours d'avant restent dans la forme d'aujourd'hui.** La base ne permet pas de les reconstruire fidèlement : la
trace d'une délégation n'a aucun lien vers son message, sa demande est coupée court, la relecture et la carte ne
laissent rien, et la frontière entre l'annonce et la réponse n'est rangée nulle part. Le fil principal repart chaque
matin : la forme d'avant y disparaît en un jour ; un sujet la garde, sans erreur.

**Le rejeu.** Un message qui porte la donnée se rejoue dans la forme retenue ; sans elle, comme aujourd'hui. Pour (a),
**seulement si l'outil est déclaré dans la requête en cours** ; sinon, la forme d'aujourd'hui. La règle vit dans le
service, pas dans un module : les deux fournisseurs sont traités pareil, et aucune requête n'envoie un tour d'outil
qu'un fournisseur pourrait refuser. Le second appel et la parole d'elle-même, qui ne déclarent aucun outil, gardent
donc leur forme d'aujourd'hui. Le plafond de signes du fil rejoué compte aussi ce qui est rejoué en plus.

**L'interface, au plus petit** (pour (a) seulement) : un tour de l'assistant peut porter un appel (identifiant, nom,
arguments), et un tour de résultat s'ajoute (identifiant, texte). L'identifiant se construit depuis le message, stable
d'un rejeu à l'autre : le morceau d'appel reçu du flux n'a pas à changer. Chaque module traduit ces tours dans la forme
de son API ; un tour de l'assistant vide qui porte un appel n'est pas retiré. Aucun nom de fournisseur hors des modules
([`qualite.md`](../../standards/qualite.md), « Rien en dur ») : le garde du core reste vert.

**Le second appel ne change pas** : sans outils, le résultat en tour ordinaire, comme aujourd'hui. Le défaut mesuré
vient du premier appel des tours suivants, pas de lui.

**Les faux serveurs** apprennent les refus vus à la tâche 1 (un appel sans résultat, un outil non déclaré si c'est un
refus) : un module qui enverrait une forme refusée échoue en test comme il échouerait en vrai.

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit échouer ; `dev-core` écrit le code ; le
**reviewer** relit le diff. Chaque tâche se ferme sur les barrières du core au vert, le garde « rien en dur »
compris, et sur un diff des fichiers de test d'aujourd'hui nul, ou chaque attente changée nommée dans la PR. Les
fichiers et les lignes sont dans l'issue privée.

**L'ordre.** 1, puis 2. Puis **3 et 4 en parallèle** (aucun fichier commun : 3 touche le rangement, 4 l'interface et
les modules ; avec (b), la 4 tombe). Puis 5. Puis 6, puis 7.

1. - [ ] **La mesure, avant tout code de production** (`testeur`, hors dépôt). Un script jetable, hors du dépôt, sur
   les SDK officiels, les clés dans des variables propres au script, jamais affichées ni écrites. Il construit les
   requêtes avec les vraies consignes et les vrais outils du core (importés en lecture), et un poste factice qui rend
   des résumés inventés, fixes.
   - **Les règles des API**, sur quelques appels, avant les fils : la forme d'un tour d'outil rejoué, un identifiant
     construit par le core, un appel sans résultat, un outil rejoué non déclaré, aucun outil déclaré. Chaque refus est
     noté (statut, type, message) pour les faux de la tâche 4.
   - **Les fils longs** : trois fils de huit demandes, comme la mesure du 20/11, chacun rejoué tour par tour, ses
     réponses mises dans l'historique dans la forme essayée. Trois formes : aujourd'hui, (a), (b). Deux passes. Sur
     Haiku 5.5 (raisonnement coupé) et le modèle d'OpenAI en service, le même jour.
   - **Il compte**, sur les demandes qui attendent une délégation : les délégations faites, les résultats inventés,
     les annonces sans appel. Les tours sans appel se relisent un à un pour les classer. Et, par forme, les jetons
     d'entrée d'un tour en fin de fil, et ce qu'ajoute un tour délégué.
   - **Coût attendu** : de l'ordre de 0,05 $ par forme, par modèle et par passe (environ 50 appels de 5 000 à 8 000
     jetons), soit environ 0,60 $ ; **plafond de la tâche : 0,80 $**. Résultat écrit ici, « La mesure ».
   - **Exclu** : tout changement des consignes ; un appel d'outil forcé ; les marqueurs de cache.
2. - [ ] **Le choix de la forme** (le manager, sur les chiffres de la tâche 1). Sur 48 demandes par forme et par
   modèle :
   - **Seuil d'arrêt** : si aucune forme ne donne à Haiku au moins 44 délégations sur 48 et au plus un résultat
     inventé, le plan s'arrête et revient à CrOliX.
   - **(a) est retenue** si elle tient le seuil et fait mieux que (b) d'au moins trois délégations ou de deux
     résultats inventés en moins ; sinon **(b)**. Entre les deux, CrOliX tranche (point 1 ci-dessous).
   - **OpenAI** reste à 48 sur 48 dans la forme retenue ; sinon le plan revient à CrOliX.
   - **Si un fournisseur refuse la forme (a)** d'une façon que la règle du rejeu ne couvre pas, (a) est écartée.
3. - [ ] **Le rangement** (`testeur` puis `dev-core` ; en parallèle de 4). La donnée facultative sur le message, par une
   migration qui ajoute une colonne vide ; remplie à la fin d'un tour réussi où un outil a été exécuté, pour chacun
   des quatre outils, une coupure et un appel illisible compris ; le résultat masqué et coupé. Elle ne sort ni par
   les routes, ni vers la nuit. Tests nouveaux : une base de la version d'avant s'ouvre et se relit à l'identique ; ce
   que rendent les routes d'un fil avec une délégation est identique avant et après ; ce que lisent la nuit et la
   relecture de la journée est identique ; un résultat qui porte un secret est rangé masqué. **Exclu** : le rejeu (5) ;
   reconstruire les tours d'avant.
4. - [ ] **L'interface et les deux modules** (forme (a) seulement ; `testeur` pour les faux et les tests, `dev-core`
   pour le code ; en parallèle de 3). Les deux ajouts de l'interface ; chaque module les traduit dans la forme de son
   API, lue dans sa documentation et les types de son SDK ; un tour vide qui porte un appel reste. Les faux serveurs
   refusent ce que la tâche 1 a vu refuser. Tests : sur chaque faux, un fil avec un tour d'outil de chacun des quatre
   outils est accepté et arrive dans la forme attendue ; un appel sans résultat est refusé par le faux qui le refuse en
   vrai. **Exclu** : le second appel ; tout outil déclaré en plus de ceux d'aujourd'hui.
5. - [ ] **Le rejeu** (`testeur` puis `dev-core` ; après 3 et 4). Un message qui porte la donnée se rejoue dans la forme
   retenue ; pour (a), seulement quand son outil est déclaré dans la requête ; sinon, et pour les messages d'avant,
   comme aujourd'hui. Le plafond de signes compte ce qui est rejoué en plus. Le second appel et la parole d'elle-même
   ne changent pas. Tests sur les deux faux : un fil avec une délégation, une relecture, une lecture puis un geste de
   carte ; un fil d'avant le changement ; un geste de carte rejoué alors que l'outil n'est plus offert ; un sujet sans
   poste joignable ; la parole d'elle-même ; le second appel d'une délégation ; un fil long qui atteint le plafond.
   **Exclu** : les consignes, l'identité, le ton ; un appel d'outil forcé ; une consigne propre à un fournisseur.
6. - [ ] **Les mesures finales** (`testeur`, depuis le laptop). Sur Haiku 5.5 (raisonnement coupé) et le modèle
   d'OpenAI en service, le même jour, avant (sur `main`) et après (sur la branche) :
   - les fils longs de la tâche 1, joués cette fois **de bout en bout par le vrai service**, sur une base en mémoire
     et un poste factice : la forme rejouée est celle que le code range ;
   - avec les outils de mesure du core : la phrase d'attente en fil neuf, le premier mot, les scènes ;
   - le coût d'un tour simple, d'une délégation, d'un tour en fin de fil long ; les jetons qu'ajoute un tour délégué ;
     le coût d'une journée refait sur le modèle du plan des deux fournisseurs.
   **Rien ne se dégrade** : le premier mot pas plus de 0,1 s au-dessus d'avant en médiane, la phrase d'attente et les
   scènes pas en dessous d'avant au-delà d'un cas. **Coût attendu** : environ 1,10 $ (fils longs 0,40 $, phrase
   d'attente 0,30 $, scènes avec leur juge 0,30 $, premier mot moins de 0,10 $). **Le testeur s'arrête** quand le
   chantier atteint 2,28 $, tâche 1 comprise, et revient à CrOliX.
7. - [ ] **Le choix du modèle reposé à CrOliX, la doc et la livraison** (le manager, puis le livreur). Les chiffres de
   la tâche 6, la recommandation, le choix de CrOliX écrit ici. Le fournisseur en service ne change qu'après ce choix,
   par l'écran. PR en brouillon, ce plan coché.

## À trancher par CrOliX

**1. La forme, si la mesure les départage mal.** Recommandation : **(b), l'annonce retirée**. C'est le plus petit
changement : rien dans l'interface ni les modules, aucun refus possible d'un fournisseur ; (a) ne vaut son coût que si
elle fait nettement mieux.

**2. Reconstruire les tours d'avant.** Recommandation : **non**. La base ne le permet pas fidèlement (« La
conception ») ; une reconstruction approchée rejouerait au modèle un appel qu'il n'a pas fait. Le fil principal repart
chaque matin : la forme d'avant y disparaît en un jour.

**3. Ce qu'on fait des annonces dans l'historique.** Recommandation : **elles restent dans le message, telles que
l'utilisateur les a vues et entendues** ; seul le rejeu change. Avec (a), l'annonce se rejoue à sa place, avec
l'appel ; avec (b), elle ne se rejoue plus.

**4. Le plafond du fil rejoué compte ce qui s'ajoute.** Recommandation : **oui**. Le coût d'un tour reste borné ; en
échange, un fil long rejoue moins de messages anciens. La tâche 6 dit de combien.

**5. Le second appel reste sans outils.** Recommandation : **oui**. Le défaut est au premier appel des tours suivants ;
déclarer des outils au second appel lui permettrait d'en rappeler un.

**6. Le modèle du rodage**, à la tâche 7, sur les chiffres de la tâche 6. Pas de recommandation avant eux.

## Risques

- **Toucher à l'historique juste avant le rodage.** Chaque tour de Natsume passe par lui. Parades : OpenAI reste en
  service jusqu'au choix ; la forme d'aujourd'hui reste la règle pour tout message sans la donnée nouvelle ; les tests
  d'une base d'avant ; le diff des tests d'aujourd'hui ; la PR fusionnée et livrée avant le rodage, jamais pendant.
- **Un historique que l'un des fournisseurs refuse : une Natsume muette.** Un tour d'outil rejoué sans son résultat,
  ou un outil rejoué non déclaré, peut faire refuser **chaque** requête du fil, pas une seule. Parades : la tâche 1
  voit ces refus sur l'API réelle ; les faux les reproduisent ; le rejeu n'envoie un tour d'outil que pour un outil
  déclaré ; avec (b), le risque disparaît.
- **Un résultat rejoué est une donnée d'un poste**, qui peut porter un texte qui se donne pour une consigne. Parade :
  il repasse comme résultat d'outil, jamais en système ; masqué comme la trace de la délégation.
- **L'historique grossit** : chaque tour délégué rejoue en plus ce que le poste a rendu, jusqu'à quelques milliers de
  signes pour une relecture. Le coût d'un tour en fin de journée monte, et le cache n'est pas marqué. Parades : le
  plafond de signes compte ce qui s'ajoute ; la tâche 6 le mesure ; avec (b), l'historique rétrécit.
- **Une mesure sur 48 demandes** reste petite : un écart de deux ou trois délégations peut être du bruit. La règle du
  choix penche vers le plus petit changement.
- **Un fil inventé qui ne ressemble pas au vrai** : la leçon du chantier précédent. Parade : les vraies consignes à la
  tâche 1, le vrai service à la tâche 6.

## Hors périmètre

Celui de l'issue : le texte des consignes, de l'identité et du ton ; un appel d'outil forcé ; une consigne propre à
un fournisseur ; les marqueurs de cache. Et, de ce plan : reconstruire les tours d'avant ; changer le second appel ;
les appels d'outil parallèles (le core garde le premier) ; l'annonce sans appel d'un fil neuf (4 sur 40), qui est le
modèle et non l'historique.

## Limites

- **Les règles des API** sur un tour d'outil rejoué ne sont pas vérifiées : la tâche 1 les lit et les essaie.
- **La taille des résultats rejoués** est estimée d'après les plafonds du core, pas lue sur une base réelle.
- **Le coût attendu** des mesures est un ordre de grandeur, aux prix lus le 20/11 dans le plan des deux fournisseurs.
- **Le délai de bout en bout** contre les 2,5 s du VIP se juge à la session du desktop, pas ici.
