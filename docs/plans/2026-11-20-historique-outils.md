# L'historique rejoué au modèle garde les appels d'outil et ce qu'ils ont rendu. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-anima#118 (`niveau:standard`, privé), recadrée par CrOliX le 20/11 au soir.
>
> **État : rédigé le 20/11 ; contesté le 20/11 (« à amender », trois bloquants) ; amendé le 20/11.** Reste à valider
> par CrOliX les points de « À valider par CrOliX », un à un.
>
> Code relu sur `main` de Lun'Anima (`eb7ae40`, le chantier des deux fournisseurs fusionné) ; le graphe d'abord,
> puis chaque point dans le code, et chaque objection de la contestation vérifiée dans le code avant d'être écrite.
> Lun'Anima est privé : ce plan dit les critères, les tâches en comportement, les mesures, les risques et les
> décisions. Ce qui décrit l'intérieur du core est dans l'issue privée ([`securite.md`](../../standards/securite.md),
> « Dépôts publics »).

**But :** quand Natsume a appelé un outil, le fil qu'on rejoue ensuite au modèle le montre comme un tour d'outil :
l'appel, puis ce que l'outil a rendu. Haiku 5.5 cesse de recopier une forme sans appel, et d'inventer un résultat.
Rien de ce que voit l'utilisateur ne change. Le modèle de la semaine de rodage se redécide sur la mesure.

**Source :** l'issue et son commentaire du 20/11 (la mesure qui écarte trois formulations des consignes et met en
cause la forme de l'historique). La décision de CrOliX du 20/11 au soir : corriger l'historique, puis décider du modèle
du rodage sur la mesure ; **d'ici là, OpenAI reste en service**. Le
[plan des deux fournisseurs](2026-11-20-core-deux-fournisseurs.md) pour la méthode, les chiffres de départ et sa
leçon : mesurer avec les vraies consignes, dans les vraies conditions.

**Le calendrier.** Ce chantier n'est pas sur le chemin critique du rodage, qui attend la mise en service du NAS ; il
ne profite qu'à Haiku. S'il s'arrête au seuil de la tâche 2, le rodage se joue sur le modèle d'OpenAI en service.
S'il va au bout, il est fusionné et livré en image avant la semaine de rodage, jamais pendant.

**Critères de fin**, ceux de l'issue, chacun prouvé en local par une commande ou une capture :

1. **L'historique rejoué garde, pour un tour où un outil a été appelé, l'appel et ce que l'outil a rendu**, dans la
   forme que chaque fournisseur attend : confier à un poste, relire sa journée, lire et trancher une carte. Tâches 3
   à 5. Si la tâche 2 retient la forme minimale, ce critère se lit pour elle, et la PR le dit.
2. **Une conversation d'avant ce changement se rejoue sans erreur**, et rien de ce que l'utilisateur voit ne change :
   l'annonce, le résultat, le journal. Tâches 3 et 5.
3. **Mesuré dans des conversations longues**, sur Haiku 5.5 et sur le modèle d'OpenAI en service, avant et après,
   coût annoncé : les délégations faites quand elles sont attendues, les appels non voulus quand elles ne le sont pas,
   les résultats inventés, les annonces sans appel. Sur OpenAI, rien ne se dégrade par rapport à sa forme
   d'aujourd'hui mesurée le même jour. Tâches 1 et 6.
4. **Les autres mesures ne bougent pas en mal** sur les deux : le premier mot, la phrase d'attente en fil neuf, les
   scènes, le coût d'un tour (l'historique grossit : de combien). Tâche 6, en partie par des preuves à sec.
5. **Le choix du modèle du rodage est reposé à CrOliX** sur ces chiffres. Tâche 7.

| Dépôt | Issue | Niveau |
|---|---|---|
| `lun-anima` : 7 tâches (6 si la forme minimale est retenue) | Lun-Ecosystem/lun-anima#118 | `standard` |
| `lun-docs`, `docs/historique-outils` : ce plan, ses coches et ses chiffres | la même | `trivial` |

**Le niveau.** `standard`. Le chantier touche ce que le modèle lit à chaque tour, pas ce que voit l'utilisateur ; il
ajoute une donnée facultative au message, sans réécrire une ligne existante. Chaque comportement changé a son test,
écrit d'abord par le testeur ([`workflow.md`](../../standards/workflow.md)). Une PR par dépôt ; celle du core ferme
l'issue.

## Ce que le core fait aujourd'hui, en comportement

- **Un tour avec un outil se joue en deux appels.** Le premier appel offre les outils du moment : confier à un poste
  (s'il y a un poste joignable), relire sa journée (toujours), lire une carte (au fil principal), trancher une carte
  (seulement si son message peut être un geste). Les outils offerts changent donc d'un tour à l'autre. Le modèle
  annonce, ou non, puis appelle ; le code exécute le premier appel.
- **Le second appel dit le résultat**, après une délégation ou une relecture : **sans outils**, sur le même fil que
  le premier, avec l'annonce, puis le résultat passé en tour ordinaire, avec ses consignes. Lire et trancher une carte
  n'ont pas de second appel : la réponse est le texte de l'outil.
- **Ce qui est rangé** : le message de sa réponse, tel que l'utilisateur l'a vu et entendu. L'appel et ce que l'outil
  a rendu n'y sont pas, comme tels.
- **Le fil rejoué** : les messages réussis seuls, plafonnés en nombre et en signes ; au fil principal, depuis le début
  du jour de Natsume plus quelques messages d'avant ; un sujet garde tout. **La même fenêtre** sert à la situation,
  qui dit à Natsume ce qui est sorti de son contexte. Un tour délégué se rejoue comme un seul texte de l'assistant,
  **sans appel** : la forme que Haiku recopie. La parole d'elle-même et le rituel rejouent le même fil, sans outils.
- **L'interface du fournisseur ne connaît que du texte** : un rôle et un texte par tour, aucun tour d'outil.
- **Un tour passé ne peut pas être reconstruit** : ce que la base garde d'un outil appelé ne suffit pas à refaire
  l'appel et son résultat, ni à séparer l'annonce de la réponse.
- **Une requête refusée par un fournisseur** est traitée comme un fournisseur indisponible. Comme le fil rejoué est le
  même au tour suivant, un historique refusé ferait échouer tout le fil : jusqu'au lendemain au fil principal, jusqu'à
  la purge pour un sujet.
- **Qui lit les messages** : l'écran du fil, la relecture de la journée, la situation, la nuit (le tri, les souvenirs,
  l'envoi à la mémoire), le rituel, la parole d'elle-même, l'état du core, la purge. Chacun lit le texte et ce qu'il
  nomme, rien d'autre.
- **Les outils de mesure** : la phrase d'attente et le premier mot passent par le vrai service, sur un fil fait de
  textes seuls ; les scènes n'ont ni historique ni outils.

## Ce que les API imposent : à lire, pas à deviner

Le développeur lit la documentation à jour de chaque fournisseur et les types des SDK installés **avant d'écrire**,
et vérifie sur un appel réel (tâche 1). Ce qui pèse sur le plan, à confirmer :

- **La forme d'un tour d'outil rejoué** chez chacun : l'appel dans le tour de l'assistant (identifiant, nom,
  arguments, à côté d'un texte ou seul) ; le résultat ; leur appariement ; le format d'identifiant accepté, pour un
  identifiant construit par le core, stable d'un rejeu à l'autre.
- **L'ordre** : chez Anthropic, un appel doit être suivi de son résultat au tour suivant. Ce qui arrive à un appel sans
  résultat ; à un résultat suivi directement du message suivant de l'utilisateur, sans réponse de l'assistant (le cas
  d'une carte lue ou tranchée).
- **Les outils déclarés** : une requête dont l'historique porte des tours d'outil doit en général déclarer ces outils.
  Ce qui arrive quand un outil rejoué n'est pas offert, ou qu'aucun ne l'est.
- **Deux tours de l'assistant à la suite** : Anthropic les fusionne (vu le 20/11).
- **Le raisonnement** : coupé à la voix, aucun bloc de raisonnement n'est à rejouer ; à confirmer pour un tour d'outil.
- **Le décompte** : ce que pèse un tour d'outil rejoué, en jetons, chez chacun.

## La conception : le plus petit changement

**Deux formes candidates**, départagées par la tâche 1 :

- **La forme complète.** Un tour délégué se rejoue en trois temps : l'annonce avec l'appel ; le résultat rendu par
  l'outil, comme donnée, sans les consignes du second appel, **coupé court** ; la réponse dite.
- **La forme minimale : l'annonce retirée de ce qui est rejoué.** Le tour se rejoue comme sa seule réponse. Déjà
  mesuré : 20 délégations sur 24 au lieu de 15. Elle garde dans le rejeu des résultats sans appel, la forme même qu'on
  soupçonne. Séparer l'annonce en un tour à part n'est pas candidat : Anthropic fusionne deux tours de l'assistant.

**Ce qui se range.** Une donnée facultative de plus sur le message réussi d'un tour où un outil a été exécuté. Forme
complète : l'outil, ses arguments, ce qu'il a rendu (coupé), la longueur de l'annonce. Forme minimale : un entier, la
longueur de l'annonce. **Pas de masquage en plus** : la donnée suit la règle du texte du message, qui porte déjà le
résultat en clair ; masquer l'une et pas l'autre ferait voir au modèle « masqué » dans le résultat et la valeur en
clair dans sa propre réponse. **Elle part avec le message à la purge.** Les autres lecteurs ne la voient pas : le texte
du message ne change pas. Aucune ligne existante n'est réécrite.

**Le résultat rejoué est coupé à 800 signes.** La réponse rangée juste après porte déjà son contenu ; ce qui compte est
la présence de l'appel. Sans coupe, quatre délégations longues rempliraient la fenêtre, et Natsume oublierait plus tôt
le reste de sa journée. 800 signes gardent un résumé de poste ordinaire entier et l'essentiel d'une relecture ; la
tâche 1 dit combien de résultats sont coupés.

**Les tours d'avant restent dans la forme d'aujourd'hui** : ils ne peuvent pas être reconstruits fidèlement, et une
reconstruction approchée rejouerait un appel que le modèle n'a pas fait. Le fil principal repart chaque matin : la
forme d'avant y disparaît en un jour ; un sujet la garde, sans erreur.

**Le rejeu.** Un message qui porte la donnée se rejoue dans la forme retenue ; sans elle, comme aujourd'hui. Pour la
forme complète, **seulement si l'outil est déclaré dans la requête en cours** : c'est la première barrière contre un
refus. Les cas qui gardent la forme d'aujourd'hui : un appel aux arguments illisibles ; une requête sans outils (la
parole d'elle-même, le rituel, le second appel). Quand la réponse est le texte même de l'outil (une carte lue ou
tranchée, un second appel qui a échoué), ce texte ne passe qu'une fois, comme résultat.

**Le filet.** Si un fournisseur refuse une requête qui rejoue des tours d'outil, avant tout mot : **une seule relance,
la même requête dans la forme d'aujourd'hui**, un mot au journal, la santé du core intacte. Le tour répond ; le
suivant retente la forme retenue et retombe sur le filet s'il le faut. Le défaut se lit au journal, pas dans le
silence de Natsume.

**Le plafond de signes du fil rejoué compte toujours la donnée**, qu'elle soit rejouée ou non dans cette requête : la
situation lit la même fenêtre pour dire ce qui est sorti du contexte, et les deux ne doivent pas diverger.

**L'interface, au plus petit** (forme complète seulement) : un tour de l'assistant peut porter un appel (identifiant,
nom, arguments), et un tour de résultat s'ajoute (identifiant, texte). Chaque module les traduit dans la forme de son
API. L'estimation des jetons, quand le fournisseur ne rend pas l'usage, compte aussi les appels et les résultats. Aucun
nom de fournisseur hors des modules ([`qualite.md`](../../standards/qualite.md), « Rien en dur ») : le garde du core
reste vert.

**Le second appel ne change pas** : sans outils, le résultat en tour ordinaire. Il garde son propre fil rejoué, dans
la forme d'aujourd'hui, puisqu'il ne déclare aucun outil.

**Le repli, si OpenAI se dégrade** dans la forme retenue : la forme du rejeu devient une donnée de l'entrée de chaque
modèle, comme son raisonnement, et OpenAI garde la forme d'aujourd'hui. Ce n'est pas une consigne propre à un
fournisseur : le texte ne change pas. **Codé seulement si la mesure le demande.**

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit échouer ; `dev-core` écrit le code ; le
**reviewer** relit le diff. Chaque tâche se ferme sur les barrières du core au vert, le garde « rien en dur »
compris, et sur un diff des fichiers de test d'aujourd'hui nul, ou chaque attente changée nommée dans la PR. Les
fichiers et les lignes sont dans l'issue privée.

**L'ordre.** 1, puis 2. Puis **3 et 4 en parallèle** (aucun fichier commun : 3 touche le rangement, 4 l'interface et
les modules ; avec la forme minimale, la 4 tombe). Puis 5. Puis 6, puis 7.

**Le budget.** 2,28 $ au plus pour tout le chantier (le reste des 10 $ accordés, sous l'arrêt général à 8 $) : la
tâche 1 attend 1,25 $ (plafond 1,40 $), la tâche 6 attend 0,40 $ (plafond 0,50 $) ; **marge : 0,38 $**. Le testeur
s'arrête à 2,28 $ cumulés et revient à CrOliX.

1. - [ ] **La mesure, avant tout code de production** (`testeur`, hors dépôt). Un script jetable, hors du dépôt, sur
   les SDK officiels, les clés dans des variables propres au script, jamais affichées ni écrites. Il envoie ce que le
   service enverra : les vraies consignes et les vrais outils de ce tour-là, pris du core en lecture ; seul le fil
   rejoué est écrit par le script, dans chaque forme.
   - **Les règles des API**, sur quelques appels, d'abord : un tour d'outil rejoué, un identifiant construit, un appel
     sans résultat, un résultat suivi directement de l'utilisateur, un outil rejoué non déclaré, aucun outil déclaré.
     Chaque refus est noté (statut, type, message) pour les faux de la tâche 4.
   - **Le dispositif : le tour suivant, sur des historiques fixés.** Les tours d'un même fil ne sont pas indépendants
     (une invention contamine la suite) : on ne joue pas des fils, on mesure la réponse à une demande nouvelle après un
     historique fixé et correct, écrit dans chaque forme (aujourd'hui, complète, minimale), à trois profondeurs : vers
     le 3e tour, le 8e, et plus de 20 (24, qui atteint la fenêtre des messages et le plafond de signes). Plus un
     **fil neuf**, sans historique, le même jour : la référence du seuil.
   - **Des historiques réalistes** : 30 à 50 % de demandes qui n'attendent pas de délégation ; des résultats de poste
     longs et différents à chaque demande ; les quatre outils offerts comme ils le seront au rodage, les outils de
     carte compris, avec des cartes dans la situation.
   - **Les cellules** : Haiku 5.5 (raisonnement coupé), à la voix, les trois formes aux trois profondeurs et le fil
     neuf (10 cellules) ; à l'écrit, les trois formes aux profondeurs 8 et 24 et le fil neuf (7) ; la consigne
     d'attente n'entre qu'à la voix. Le modèle d'OpenAI en service, à la voix : les trois formes aux trois profondeurs
     et le fil neuf (10). **60 tirages par cellule** : 40 demandes qui attendent une délégation, 20 qui n'en attendent
     pas, chacune un tirage indépendant. C'est assez pour voir les écarts qui comptent : celui du fil long au fil neuf,
     mesuré à une trentaine de points, et celui de 15 à 20 sur 24 ; un écart de moins de huit délégations sur 40 entre
     deux formes est du bruit (deux écarts-types), et la règle de la tâche 2 le traite comme une égalité.
   - **Trois compteurs** : la délégation faite quand elle est attendue ; **l'appel non voulu** quand elle ne l'est pas
     (un historique plein d'appels peut pousser à trop déléguer ou à relire pour rien) ; le résultat inventé. Et les
     annonces sans appel ; pour la forme minimale, l'annonce répétée mot pour mot d'un tour d'avant.
   - **Un juge mécanique, écrit et testé avant la mesure.** Le poste factice rend des résultats connus, chacun avec ses
     noms, dates et montants propres. Est inventée toute réponse sans appel qui affirme un fait (un nom, une date, un
     montant, ou une absence : « rien de prévu », « tu es libre ») absent de tous les résultats déjà rendus dans le
     fil. Une bonne réponse tirée de l'historique n'est pas une invention. **Restent relues à la main** : les réponses
     sans appel que le juge ne classe pas (ni fait connu, ni fait inconnu, ni refus) ; un tirage sur dix des autres,
     pour contrôler le juge.
   - **Et** : les jetons d'entrée par cellule ; ce qu'ajoute un tour délégué dans la forme complète ; la part des
     résultats coupés à 800 signes.
   - **Coût attendu** : environ 1 600 tirages, 0,0009 $ en moyenne chez Haiku, 0,0005 $ chez OpenAI : 1,25 $ ;
     **plafond 1,40 $**. Résultat écrit ici, « La mesure ».
   - **Exclu** : tout changement des consignes ; un appel d'outil forcé ; les marqueurs de cache ; la cascade réelle
     (le second appel, des fils joués de bout en bout), qui est la mesure de la tâche 6.
2. - [ ] **Le choix de la forme** (le manager, sur les chiffres de la tâche 1). Pour chaque cellule, les délégations
   sur 40, les appels non voulus sur 20, les inventions.
   - **Seuil d'arrêt, relatif au fil neuf du même jour.** La forme retenue doit ramener Haiku, à chaque profondeur, au
     niveau de son fil neuf **à un cas près** sur les délégations, avec au plus un résultat inventé par cellule. Sinon
     le plan s'arrête et revient à CrOliX : le rodage se joue sur OpenAI. Le défaut du fil neuf est le modèle, pas
     l'historique : 4 à 5 annonces sans appel sur 40 le 20/11 ; il reste **hors périmètre**, et CrOliX décide à la fin
     en le connaissant.
   - **La règle de la forme** (décision du manager, à valider par CrOliX) : **la forme complète est retenue, avec le
     filet et le résultat coupé court, sauf si la mesure montre qu'elle fait moins bien que la minimale** ; si les deux
     sont égales (au bruit près), la minimale l'emporte, parce qu'elle ne touche pas l'interface. Moins bien ou
     égale : sur les délégations, les appels non voulus ou les inventions, à une profondeur au moins, sans gain
     ailleurs.
   - **OpenAI** : pas en dessous de sa forme d'aujourd'hui du même jour, appels non voulus compris. S'il se dégrade
     dans la forme retenue, le repli (« La conception ») entre au plan, à la tâche 5.
   - **Si un fournisseur refuse la forme complète** d'une façon que la barrière et le filet ne couvrent pas, elle est
     écartée.
3. - [ ] **Le rangement** (`testeur` puis `dev-core` ; en parallèle de 4). La donnée facultative sur le message,
   ajoutée sans réécrire une ligne ; remplie à la fin d'un tour réussi où un outil a été exécuté, pour chacun des
   quatre outils, une coupure et un appel illisible compris ; le résultat coupé à 800 signes, sans masquage en plus.
   Elle ne sort ni par les routes, ni vers la nuit. Tests nouveaux : une base de la version d'avant s'ouvre et se
   relit à l'identique ; ce que rendent les routes d'un fil avec une délégation est identique avant et après ; ce que
   lisent la nuit et la relecture de la journée est identique ; le message et sa donnée partent ensemble à la purge.
   **Exclu** : le rejeu (5) ; reconstruire les tours d'avant.
4. - [ ] **L'interface et les deux modules** (forme complète seulement ; `testeur` pour les faux et les tests,
   `dev-core` pour le code ; en parallèle de 3). Les deux ajouts de l'interface ; chaque module les traduit dans la
   forme de son API, lue dans sa documentation et les types de son SDK. Les faux serveurs refusent ce que la tâche 1 a
   vu refuser. Tests : sur chaque faux, un fil avec un tour d'outil de chacun des quatre outils est accepté et arrive
   dans la forme attendue ; une forme refusée en vrai est refusée par le faux. **Exclu** : le second appel ; tout outil
   déclaré en plus de ceux d'aujourd'hui.
5. - [ ] **Le rejeu et le filet** (`testeur` puis `dev-core` ; après 3 et 4). Un message qui porte la donnée se rejoue
   dans la forme retenue ; pour la complète, seulement quand son outil est déclaré dans la requête ; sinon, et pour
   les messages d'avant, comme aujourd'hui. Un texte d'outil qui est aussi la réponse ne passe qu'une fois. Le second
   appel a son propre fil rejoué, dans la forme d'aujourd'hui. Le plafond de signes compte toujours la donnée. Le
   filet : une relance dans la forme d'aujourd'hui sur un refus avant tout mot, un mot au journal, la santé intacte.
   L'estimation des jetons compte les appels et les résultats. Le repli d'OpenAI seulement si la tâche 2 le demande.
   Tests sur les deux faux : un fil avec une délégation, une relecture, une lecture puis un geste de carte ; un fil
   d'avant le changement ; un geste de carte rejoué alors que l'outil n'est plus offert ; un sujet sans poste
   joignable ; la parole d'elle-même ; le second appel d'une délégation ; un fil long au plafond, et la situation qui
   dit la même fenêtre ; **le filet sur chaque faux** (refus, relance acceptée, journal, santé) ; **une requête sans
   la donnée nouvelle identique octet pour octet à celle d'aujourd'hui** (la phrase d'attente, le premier mot d'un
   fil neuf, les scènes, sur leur essai à blanc). **Exclu** : les consignes, l'identité, le ton ; un appel d'outil
   forcé ; une consigne propre à un fournisseur.
6. - [ ] **Les mesures finales** (`testeur`, depuis le laptop ; plafond 0,50 $). Sur Haiku 5.5 et le modèle d'OpenAI
   en service, le même jour, avant (sur `main`) et après (sur la branche) :
   - **la cascade réelle** : deux fils longs de 24 tours, joués de bout en bout par le vrai service, second appel
     compris, sur une base en mémoire et un poste factice ; mêmes compteurs et même juge qu'à la tâche 1 ;
   - **le premier mot en fin de fil long**, dans la forme retenue, contre la forme d'aujourd'hui ;
   - **le coût** d'un tour simple, d'une délégation, d'un tour en fin de fil long ; les jetons qu'ajoute un tour
     délégué ; le coût d'une journée refait sur le modèle du plan des deux fournisseurs.
   **Ne se paie pas** ce que le changement ne touche pas : la phrase d'attente en fil neuf, le premier mot d'un fil
   neuf et les scènes (sans historique ni outils) sont prouvés identiques à sec (tâche 5). **Rien ne se dégrade** : le
   premier mot en fin de fil pas plus de 0,1 s au-dessus d'avant en médiane ; la cascade pas en dessous d'avant.
   **Coût attendu** : 0,40 $ (cascade 0,32 $, premier mot 0,08 $).
7. - [ ] **Le choix du modèle reposé à CrOliX, la doc et la livraison** (le manager, puis le livreur). Les chiffres des
   tâches 1 et 6, le défaut du fil neuf rappelé, la recommandation, le choix de CrOliX écrit ici. Le fournisseur en
   service ne change qu'après ce choix, par l'écran. PR en brouillon, ce plan coché.

## À valider par CrOliX

**1. La règle de la forme** (décision du manager, tâche 2) : la complète, sauf si elle fait moins bien que la minimale ;
à égalité, la minimale. Ma recommandation : **la valider**. La minimale garde la forme soupçonnée, et son avantage
(« aucun refus possible ») tombe avec le filet. À lire en clair : la complète ne gagne que si elle fait mieux au-delà
du bruit.

**2. Le seuil relatif au fil neuf**, et son défaut hors périmètre (4 à 5 annonces sans appel sur 40, qui sont le
modèle). Recommandation : **le valider**, en lisant « à un cas près » avec le bruit (deux cas sur 40) : un écart de deux
ou trois cas revient à CrOliX avec les chiffres plutôt que d'arrêter le plan d'office.

**3. Reconstruire les tours d'avant.** Recommandation : **non** (« La conception »).

**4. Les annonces.** Recommandation : **elles restent dans le message, telles que vues et entendues** ; seul le rejeu
change.

**5. Le résultat rejoué coupé à 800 signes.** Recommandation : **oui** ; la tâche 1 dit combien de résultats la coupe
touche, et la coupe se règle sur ce chiffre si besoin.

**6. Le plafond du fil compte toujours la donnée.** Recommandation : **oui**, pour que la situation et le fil rejoué
disent la même fenêtre ; en échange, un fil long rejoue moins de messages anciens (la tâche 6 dit de combien).

**7. Le second appel reste sans outils**, avec son fil dans la forme d'aujourd'hui. Recommandation : **oui** : le
défaut est au premier appel des tours suivants ; des outils au second appel lui permettraient d'en rappeler un.

**8. Le filet : une seule relance dans la forme d'aujourd'hui.** Recommandation : **oui**. Un tour refusé coûte un
appel de plus, jamais le silence.

**9. Le repli d'OpenAI** (la forme du rejeu, donnée de l'entrée du modèle), codé seulement si la mesure le demande.
Recommandation : **oui**.

**10. Le modèle du rodage**, à la tâche 7. Pas de recommandation avant les chiffres.

## Risques

- **Toucher à l'historique juste avant le rodage.** Chaque tour de Natsume passe par lui. Parades : OpenAI reste en
  service jusqu'au choix ; la forme d'aujourd'hui reste la règle pour tout message sans la donnée nouvelle ; les tests
  d'une base d'avant ; les requêtes sans la donnée identiques octet pour octet ; le chantier hors du chemin critique.
- **Un historique que l'un des fournisseurs refuse : une Natsume muette.** Le même fil rejoué à chaque tour, un refus
  se répéterait jusqu'au lendemain. Parades : la tâche 1 voit ces refus sur l'API réelle ; les faux les reproduisent ;
  la barrière (un tour d'outil seulement pour un outil déclaré) ; le filet (une relance dans la forme d'aujourd'hui).
- **Trop déléguer** : un historique plein d'appels peut pousser à appeler pour rien. Parade : le compteur des appels non
  voulus, aux tâches 1 et 6, sur les deux fournisseurs.
- **Un résultat rejoué est une donnée d'un poste**, qui peut porter un texte qui se donne pour une consigne. Parade :
  il repasse comme résultat d'outil, jamais en système, coupé court.
- **L'historique grossit** et le cache n'est pas marqué. Parades : la coupe à 800 signes ; le plafond qui compte la
  donnée ; la tâche 6 mesure le coût d'un tour en fin de fil.
- **Un juge mécanique qui se trompe** fausserait le choix. Parade : écrit et testé avant la mesure, un tirage sur dix
  relu à la main.
- **Un historique inventé qui ne ressemble pas au vrai** : la leçon du chantier précédent. Parades : les vraies
  consignes et les vrais outils de chaque tour à la tâche 1, le vrai service à la tâche 6.

## Hors périmètre

Celui de l'issue : le texte des consignes, de l'identité et du ton ; un appel d'outil forcé ; une consigne propre à
un fournisseur ; les marqueurs de cache. Et, de ce plan : reconstruire les tours d'avant ; changer le second appel ;
les appels d'outil parallèles (le core garde le premier) ; **l'annonce sans appel d'un fil neuf** (4 à 5 sur 40 chez
Haiku), qui est le modèle et non l'historique.

## Limites

- **Les règles des API** sur un tour d'outil rejoué ne sont pas vérifiées : la tâche 1 les lit et les essaie.
- **La taille des résultats rejoués** est estimée d'après les plafonds du core, pas lue sur une base réelle.
- **Le coût attendu** des mesures est un ordre de grandeur, aux prix lus le 20/11 dans le plan des deux fournisseurs.
- **60 tirages par cellule** ne voient pas un écart de moins de huit délégations sur 40 : la règle de la tâche 2 le
  traite comme une égalité.
- **Le délai de bout en bout** contre les 2,5 s du VIP se juge à la session du desktop, pas ici.
