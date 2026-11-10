# Le nouvel axe : le travail de dev. Cadrage

> Cadrage du 10/11, à discuter avec CrOliX **avant toute spec**. Il ouvre des possibilités et n'en tranche aucune. Demande
> de CrOliX le 09/11 : partir des besoins d'aujourd'hui, challenger [`vision.md`](../../vision.md), dire comment le satellite
> s'intègre aux autres, revoir le nom. Le 10/11 : « mon travail de dev est un axe évident » ; « un outil de veille, c'est
> intéressant, mais en faire un satellite, peut-être pas ; qui doit porter cette tâche, ça se discute ». Les avis marqués
> **[avis Claude]** sont des recommandations, pas des décisions. Cet axe vient après le MVP : rien ici n'entre dans ce que
> la semaine de rodage juge.

## 1. Ce que dit la vision, et ce qu'elle ne dit pas

- Surface 1, « assistante de travail » : elle « traite les notifications GitHub directement à la source » et gère « la
  veille tech ». **Aucun projet ne possède ces deux promesses aujourd'hui** : Acedia a le mail, l'agenda et les tâches ;
  Avaritia le savoir ; Luxuria le corps.
- « Hors VIP » : « le pipeline de développement multi-agents ». La vision écarte donc la *fabrication* de code du VIP,
  mais pas le *suivi* du travail de dev, qu'elle range déjà dans la surface 1.
- **À corriger dans la vision, quelle que soit l'option** : dire qui possède le suivi des dépôts, et séparer ce suivi
  (dans le périmètre) de la fabrication de code par des agents maison (hors périmètre).

## 2. Les besoins, tels qu'ils se voient aujourd'hui

Le dev de l'écosystème se fait avec un agent de code et le plugin `lun`, sur cinq dépôts et une méthode écrite. Ce qui
coûte à CrOliX n'est pas d'écrire le code. C'est de **garder le fil** :

| Ce qui se passe | Ce que ça coûte |
|---|---|
| Un chantier vit dans plusieurs dépôts : cinq PR pour P, deux pour L | savoir laquelle fusionner d'abord, lesquelles attendent |
| Une CI rouge peut être attendue (la copie du kit) ou réelle | il faut ouvrir le run pour le savoir |
| L'avancement s'écrit à la main dans la feuille de route | elle retarde dès qu'une PR fusionne |
| Les issues `inbox` s'empilent d'un chantier à l'autre | personne ne les relit ensemble |
| Une session d'agent se perd (le 09/11, après la fusion des partitions) | l'état se reconstruit depuis la mémoire, les PR et les plans |
| Les brouillons qui attendent le desktop (*Ask*) | rien ne les rappelle au bon moment |

Tout cela est déjà dans GitHub ; rien ne le rassemble ni ne le dit à Natsume. Au point du matin, elle parle des mails et
de l'agenda, pas des chantiers.

## 3. Ce que l'ancien essai apprend

L'ancien Lun'Ira (archivé, référence seulement) était une forge : une intention en texte, quatre agents en chaîne (PO,
planification, dev, QA), du code en sortie, avec ses propres clés de modèles. Deux leçons :

- les agents de code du marché font ce travail, mieux, et CrOliX en utilise un tous les jours ; refaire une forge, c'est
  concurrencer son propre outil ;
- ce qui manquait autour n'a pas changé : le budget, la trace, savoir où on en est. C'est là qu'est le besoin.

## 4. Les possibilités pour l'axe dev

| | Ce que c'est | Ce que ça demande | Ce que ça laisse de côté |
|---|---|---|---|
| **A. Un poste qui lit** | Un satellite relié à GitHub : dépôts, issues, PR, CI, notifications. Un bilan du jour, des alertes (« CI rouge sur `main` », « PR verte depuis hier »), et l'agent du poste répond à Natsume : « où en est P ? » | Le contrat v1.4 suffit : `health`, `events`, `agent`, bilan. Un jeton GitHub en lecture | Agir : tout se fait encore à la main |
| **B. A, puis des gestes** | Les mêmes lectures, plus des cartes : fusionner dans l'ordre, relancer une CI, ouvrir une issue `inbox` depuis une phrase, cocher la feuille de route à la fusion | Des droits d'écriture sur GitHub, donc des cartes pour chaque geste (les bretelles) | Lancer du travail |
| **C. L'atelier des agents** | Lancer et suivre des sessions d'agent de code : laquelle tourne, sur quel chantier, ce qu'elle attend ; reprendre après une perte | Dépend de ce que l'outil d'agent expose ; le coût et les droits sont d'un autre ordre | Rien, mais c'est le plus gros et le moins stable |
| **D. La forge maison** | L'ancien Ira : des agents à soi qui écrivent le code | Tout refaire | Écarté par la vision, et par la leçon du § 3 |
| **E. Pas de satellite** | Acedia prend les notifications GitHub comme une boîte de plus | Peu de code | Les chantiers, la CI, la feuille de route : une notification n'est pas un état |

**[avis Claude]** A puis B, par paliers, dans un satellite à part. A se prouve seul et sert dès le premier jour ; B
reprend ce que la méthode fait déjà à la main. C se cadre après, quand A et B disent ce qui manque vraiment. D non. E
règle la boîte de réception, pas le besoin du § 2 : le métier « chantier » n'est pas celui de la journée d'Acedia.

## 5. La veille : qui la porte

La veille se fait aujourd'hui à la main, avec Perplexity, dans `perplexity/` : des notes et une base de 133 sources.

| | Qui porte | Pour | Contre |
|---|---|---|---|
| **V1. Le satellite dev, pour la tech des dépôts** | Les sorties des dépendances, les dépôts suivis, les avis de sécurité : tout vient de GitHub | même source, même jeton que le § 4 | ne couvre que la tech liée au code |
| **V2. Avaritia** | Une source suivie devient une fiche sourcée ; son agent relit les sources et propose des fiches | « faits sourcés » est déjà son métier ; rien à créer | Avaritia range, elle ne cherche pas : il lui faudrait une collecte |
| **V3. Un satellite dédié** (la veille l'appelle « Invidia ») | Observer projets, sorties, communauté | un métier net si la veille dépasse la tech | un dépôt de plus pour un besoin encore flou |
| **V4. Rester à la main** | CrOliX et Perplexity, puis import dans Avaritia | zéro code ; la recherche est déjà bien faite par un outil | rien n'arrive seul au point du matin |
| **V5. Le core** | Une routine de nuit de plus | simple | contraire au principe : le core ne possède aucun métier |

**[avis Claude]** Pas de satellite. V1 pour ce qui vient de GitHub, V2 pour ranger ce qui mérite de rester, V4 pour la
recherche large tant qu'un besoin précis ne s'écrit pas. V5 non.

## 6. Comment il s'intègre

- **Il possède** : l'état des dépôts, des chantiers et de la CI ; plus tard, les gestes sur GitHub.
- **Il ne possède pas** : le code des autres projets ; la méthode (lun-docs) ; les fiches (Avaritia) ; les mails de GitHub
  (désactivés, selon la vision) ; la conversation (le core).
- **Avec le core** : un poste comme les autres, par le contrat v1.4. Son bilan entre au point du matin ; une CI rouge sur
  `main` est une alerte ; ses cartes passent par « À trancher ».
- **Avec Avaritia** : jamais en direct. Une décision de chantier qui mérite une fiche passe par le core.
- **Public** : un outil autonome, utilisable sans le core, comme Acedia et Avaritia.

## 7. Le nom

Pris : Acedia, Avaritia, Luxuria. Restent Ira, Gula, Superbia, Invidia. Les notes de veille (`04-propositions`, « septénaire ») proposaient Superbia pour la
scène et Invidia pour la veille, sans rien décider.

- **Ira** : la forge de l'ancien essai. Le nom convient si l'axe va jusqu'à C ; pour un poste qui suit et range (A, B),
  il promet plus qu'il ne fait.
- **Superbia** : l'orgueil de l'ouvrage, mais la piste « scène » le perdrait.
- **Invidia** : regarder ce que font les autres ; à garder pour la veille si elle devient un satellite (V3).

**[avis Claude]** Trancher le nom après le périmètre : Ira si C reste à l'horizon, sinon le garder libre.

## 8. Ce qui reste à trancher, dans l'ordre

1. Le périmètre de l'axe dev : A, B, C, ou E (§ 4).
2. Qui porte la veille (§ 5).
3. Le nom (§ 7).
4. La correction de `vision.md` (§ 1), dans la PR de la spec.

Ensuite : une spec de design pour le premier palier, puis son plan.
