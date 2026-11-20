# Deux fournisseurs de modèle pour le core : Anthropic en plus d'OpenAI, au choix dans l'écran. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** le chapeau Lun-Ecosystem/lun-anima#116 (`niveau:standard`, privé), décidé par CrOliX le 20/11.
>
> **État : rédigé le 20/11, à contester par le plan-challenger, puis à valider par CrOliX.** Rien ne part avant sa
> validation, et aucun appel payant avant son accord (« À trancher », point (d)).
>
> Code relu sur `main` de Lun'Anima (`7cfd192`), de Lun'Acedia et de Lun'Avaritia ; le graphe d'abord, puis chaque
> point du relevé du 20/11 relu dans le code. Lun'Anima est privé : ce plan dit le comportement, les tâches, leurs
> critères et leurs preuves en mots. Les fichiers à toucher, tâche par tâche, sont dans le chapeau privé
> (`standards/securite.md`, « Dépôts publics »).

**But :** le core sait appeler un modèle d'Anthropic en plus d'OpenAI, au choix dans l'écran, avec une clé par
fournisseur. Revenir à OpenAI ne demande aucun code. Le choix du modèle se fait sur des mesures, pas d'avance. Et le
core cesse de nommer un fournisseur en dur hors de ses modules : fournisseur, modèle, clé, prix et réglages du modèle
deviennent des données de l'instance.

**Source :** le chapeau Lun-Ecosystem/lun-anima#116 : sept critères de fin, le hors périmètre, deux décisions de
CrOliX (les deux fournisseurs restent ; le modèle se choisit sur une mesure) et un relevé du code du 20/11. Le même
jour, CrOliX ajoute : « on a trop inscrit en dur le fait d'utiliser OpenAI dans le core, ce qui est contraire à la
règle écrite de rendre tout paramétrable » ; d'où le critère 8. Place : **avant la semaine de rodage**, en parallèle
de la mise en service du NAS, jamais après. Les plans [premier mot](2026-11-10-premier-mot.md) et
[phrase d'attente](2026-11-11-phrase-attente.md) pour les chiffres d'OpenAI ; le
[recadrage du VIP](../specs/2026-11-19-recadrage-vip.md), § 6, pour la cible de 2,5 s.

**Critères de fin**, ceux du chapeau, chacun prouvé en local par une commande ou une capture :

1. **La conversation passe par Anthropic** : en flux, phrase par phrase à la voix, avec ses outils (confier à un
   poste, relire sa journée, lire et trancher une carte), l'annulation et la coupure ; puis le second appel qui dit le
   résultat d'une délégation. Tâches 4 et 7.
2. **La nuit et la lettre du matin passent par Anthropic** : chaque étape qui demande une réponse structurée la
   reçoit, ou échoue en le disant. Tâches 1, 4 et 7.
3. **Le fournisseur et le modèle se choisissent dans l'écran**, avec une clé par fournisseur : rangée chiffrée,
   vérifiée, avec son échéance et son alerte ; les textes nomment le bon fournisseur (une clé refusée, un crédit
   épuisé, un service injoignable). Tâches 2 et 6.
4. **Les coûts restent justes** : le prix du modèle choisi est connu, les jetons lus et écrits en cache sont comptés
   à leur prix, les plafonds par jour et par mois tiennent, l'écran des dépenses dit le fournisseur. Tâches 3 et 6.
5. **Revenir à OpenAI ne demande aucun code**, et rien de ce qui marche aujourd'hui avec lui ne change : la suite de
   tests actuelle passe sans qu'une attente change (« Limites », sur « telle quelle »). Tâches 2, 3 et 7.
6. **Les quatre mesures se rejouent sur l'un ou l'autre** : le premier mot, la phrase d'attente, les scènes de la
   barre de personnalité, et les consignes relues. Leurs chiffres sur Anthropic sont écrits ici, à côté de ceux
   d'OpenAI. Tâches 5 et 9.
7. **Le choix du modèle** est posé à CrOliX sur ces chiffres : délai du premier mot contre la cible de 2,5 s du VIP,
   scènes, coût d'une journée. Tâche 10.
8. **Aucun fournisseur en dur hors de ses modules** (ajouté par CrOliX le 20/11) : ni dans les textes vus de
   l'utilisateur, ni dans le rangement de la clé, ni dans les prix, ni au démarrage, ni dans les outils de mesure. La
   liste des fournisseurs vit à un seul endroit, tout le reste la lit ; ajouter un fournisseur plus tard ne demande
   qu'un module et une entrée dans cette liste. Un test qui parcourt les sources le garde. Tâches 2, 3, 5 et 8.

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-anima`, `feat/deux-fournisseurs` | Lun-Ecosystem/lun-anima#116 | `standard` |
| `lun-docs`, `docs/core-deux-fournisseurs` | la même, ce plan | `trivial` |

**Le niveau.** `standard`. Le chantier touche la clé et les coûts, mais ne retire aucune donnée et ne change pas le
contrat satellite : les coûts que le core rend portent déjà un fournisseur par ligne. Chaque comportement changé a son
test, écrit d'abord par le testeur ([`workflow.md`](../../standards/workflow.md)). **Une PR par dépôt** : celle du core
ferme le chapeau ; celle-ci porte le plan, ses coches et les chiffres.

## Ce que le code fait aujourd'hui (relevé du 20/11, relu)

Chaque point du relevé du matin a été relu dans le code. Ceux qui tiennent :

- **Une interface de fournisseur à deux méthodes** porte tous les appels : un flux qui rend du texte, puis les appels
  d'outils, puis un bilan de jetons (entrée, sortie, jetons relus du cache, réponse coupée) ; une réponse entière en
  JSON suivant un schéma strict. Les messages n'ont qu'un rôle (système, utilisateur, assistant) et un texte. Une
  erreur se range en trois sortes : clé refusée, crédit épuisé, indisponible. Les durées (le premier mot) sont
  mesurées par le service, pas par le fournisseur.
- **Un seul modèle sert partout**, lu dans les réglages à chaque appel : la conversation avec ses outils, le second
  appel après une délégation (sans outils, raisonnement coupé), la parole d'elle-même, le rituel d'arrivée, la nuit,
  la lettre du matin, le portrait et le contexte chaud (en réponse structurée), le tempérament, les scènes et leur
  juge.
- **Aucun résultat d'outil n'entre dans l'historique** : l'outil est exécuté par le code, son résultat repasse en
  texte dans un tour ordinaire. Aucun bloc propre à un fournisseur n'a donc à être rejoué d'un appel à l'autre.
- **Le système passe en tête, dans un tour à part.** Un seul cas en met un second au milieu du fil : un bras de
  l'outil du premier mot, qui déplace l'heure et la situation juste avant le dernier message.
- **Le raisonnement** se coupe par un jeu de noms de modèles écrit en dur dans le module d'OpenAI (un seul modèle).
- **Le modèle se saisit dans un champ libre**, sans liste ; un modèle sans prix connu bloque la conversation, la nuit
  et le réglage lui-même.
- **Écrits pour un seul fournisseur, hors de son module** : la clé (rangement chiffré, vérification gratuite par la
  liste des modèles, échéance et ses deux alertes, alerte de refus, surveillance d'une nouvelle clé, la commande et
  l'écran qui la règlent) ; la table des prix (deux modèles, un couple entrée et sortie ; les jetons relus du cache
  enregistrés mais comptés au prix plein) ; les textes vus de l'utilisateur (refus, crédit, injoignable, la raison
  d'une conversation non configurée, l'écran de la clé) ; le démarrage ; l'assemblage des tests ; les outils de
  mesure.
- **Ce qui facilite la suite** : les réglages de la clé portent déjà le nom du fournisseur en tête, comme ceux des
  satellites ; chaque coût enregistré porte déjà son fournisseur et son modèle. Une installation existante n'a donc
  rien à déplacer.
- **L'écran des dépenses ne dit pas le fournisseur** : une ligne pour Natsume, sans fournisseur ni modèle.

Ce qui ne tient pas, ou pas tout à fait :

- **Les outils de mesure** : trois créent leur fournisseur en dur et appellent le vrai modèle (le premier mot, la
  phrase d'attente, les scènes). Un quatrième, la chaîne du laptop, le crée aussi en dur, avec le faux modèle.
- **Les tests** : dix-neuf fichiers parlent directement au faux serveur au format d'OpenAI, mais l'assemblage des
  tests le prend par défaut : quarante-six fichiers passent par lui. Trois environ passent par un faux derrière
  l'interface.
- **« Les consignes relues »**, quatrième mesure du critère 6 : aucun outil de ce nom n'a été trouvé dans le code. À
  préciser avant la tâche 9 (« Limites »).

## Ce qui se reprend des satellites, et ce qui s'écrit

Lun'Acedia et Lun'Avaritia ont déjà plusieurs fournisseurs (lus le 20/11). **Se reprend** :

- **Le découpage par fournisseur** : une liste des fournisseurs avec leur nom affiché, une clé chiffrée par
  fournisseur sous son préfixe, son échéance, son état de refus, les variables d'environnement dérivées du nom.
- **La table des prix** par fournisseur et modèle, avec une surcharge par l'environnement.
- **La reconnaissance des erreurs** : refus par le statut, crédit épuisé par le code d'OpenAI ou le message
  d'Anthropic sur le solde ; la vérification gratuite d'une clé par la liste des modèles.

**S'écrit** : le module d'Anthropic du core. Celui des satellites ne fait ni flux ni cache, a une interface sans
rapport, et coupe le raisonnement d'une façon que certains modèles récents refusent selon la documentation
(« Risques »). **Ne se reprend pas** : leur liste de modèles à choisir, leur cinquième fournisseur, leur sorte
d'erreur « format ». La table des prix des satellites ne compte pas le cache non plus.

## Ce que l'API d'Anthropic impose : à lire, pas à deviner

Le développeur du module lit la documentation à jour et le SDK officiel pour TypeScript **avant d'écrire**, et
n'invente aucun nom de paramètre, d'événement ni de champ. Ce qui pèse sur le plan, à y vérifier :

- **Le système se passe à part des messages.** Un second tour système au milieu du fil n'a pas d'équivalent simple :
  certains modèles acceptent un message système en cours de fil, sous des règles de place à lire.
- **Le raisonnement** ne se coupe pas sur tous les modèles, ou seulement sous un certain niveau d'effort, et il
  allonge le délai avant le premier mot. Il se facture comme de la sortie, même quand il n'est pas montré. Le réglage
  d'effort et de raisonnement par modèle est donc un vrai sujet pour la voix (point (b)).
- **Le cache demande des marqueurs explicites** dans la requête ; sans eux, rien n'est relu. Les jetons lus et écrits
  en cache ont chacun leur prix, et le décompte d'entrée ne les compte peut-être pas comme celui d'OpenAI : à lire
  pour que le coût reste juste.
- **Une réponse refusée par le modèle** a sa propre raison d'arrêt, réponse reçue sans erreur : elle se traite sans
  planter (la conversation dit ce qui est venu ; une étape de la nuit échoue en le disant).
- **Une réponse structurée** se demande par un format de sortie, jamais en préremplissant la réponse ; chaque schéma
  du core doit y être accepté.
- **Les outils** rendent leurs arguments en objet, en morceaux dans le flux ; le core attend un texte JSON.
- **Le crédit épuisé** et la clé refusée se reconnaissent à leur statut et à leur message, à vérifier sur un vrai
  refus.
- **Le SDK relance de lui-même** par défaut : le module le coupe, comme celui d'OpenAI, et garde le même délai.

## La conception : le plus petit changement

- **La liste des fournisseurs, à un seul endroit.** Une entrée par fournisseur : son identifiant, son nom affiché,
  la fabrique de son module, la vérification de sa clé, et sa table de modèles connus (prix, cache, raisonnement).
  La première entrée est OpenAI : une base sans fournisseur réglé le lit, donc rien ne change sans geste. Tout le
  reste (clé, prix, textes, démarrage, écran, outils de mesure) lit cette liste. Aucune couche nouvelle : l'interface
  existante reste celle des deux modules.
- **La clé, découpée par fournisseur** à la façon des satellites. Les réglages d'OpenAI gardent leurs noms
  d'aujourd'hui, les variables d'environnement aussi : elles se dérivent de l'identifiant et donnent les mêmes noms.
  Rien à migrer.
- **Les prix, par fournisseur et modèle** : entrée, sortie, et quand l'entrée de la table le dit, lecture et écriture
  du cache. Sans prix de cache, un jeton relu compte au prix d'entrée, comme aujourd'hui : le coût d'OpenAI ne bouge
  pas. La surcharge par l'environnement se dérive aussi de l'identifiant.
- **Le raisonnement et l'effort, des données** de la table des modèles, plus un jeu de noms en dur dans un module.
  L'interface garde sa demande « le moins de raisonnement possible » ; chaque module la traduit selon la table.
- **Le modèle reste un champ libre**, validé contre les prix connus du fournisseur choisi. Choisir un fournisseur
  propose son premier modèle connu, modifiable.
- **Les tests.** La suite d'aujourd'hui reste sur le faux serveur d'OpenAI, sans changement d'attente. Le module
  d'Anthropic a **son propre faux serveur, au format d'Anthropic** : c'est la traduction du format qui est à
  prouver, et un faux derrière l'interface ne la verrait pas. Ses suites d'événements se calquent sur des flux
  réels enregistrés à la tâche 1, prompts inventés, sans clé ni en-tête. Un petit lot de tests de service se rejoue
  sur les deux fournisseurs pour les critères 1 et 2 ; les quarante-six autres ne se doublent pas, le service ne
  dépend pas du fournisseur.
- **Le garde** (critère 8), sur le modèle des tests des satellites qui cherchent un nom d'agent ou celui du core
  dans les sources : il parcourt les sources du core et de son écran, commentaires retirés, et échoue si un nom de
  fournisseur ou de modèle y paraît. Permis : les modules de fournisseur et la liste, les fichiers de test et le
  dossier des faux, la chaîne du laptop (elle porte le faux modèle au format d'OpenAI), et les noms de paquets
  importés par ces modules.

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests, les voit échouer sur la branche et colle le message
d'échec ; le **développeur** (`dev-core` pour le core, `dev-front` pour l'écran) écrit le code ; le **reviewer** relit
le diff. Chaque tâche se ferme sur les barrières du core au vert : format, lint, typage, toute la suite. Les commandes
exactes et les fichiers sont dans la part du core du chapeau.

**L'ordre.** 1 d'abord. Puis **2 et 4 en parallèle** (aucun fichier commun : la liste et la clé d'un côté, le
nouveau module et son faux de l'autre). Puis 3. Puis **5 et 6 en parallèle** (les outils de mesure, l'écran : aucun
fichier commun). Puis 7 et 8, puis 9 et 10 après l'accord de CrOliX sur le budget.

1. - [ ] **La mesure réelle, avant tout code** (`dev-core`, hors dépôt ; après l'accord de CrOliX). Un script jetable,
   hors du dépôt, sur le SDK officiel, la clé de développement dans l'environnement, jamais affichée ni écrite. Sur
   chacun des modèles du point (a) : un appel en flux ; un appel avec un outil, au schéma de celui qui confie à un
   poste ; un appel structuré par schéma du core (la nuit, le matin, le portrait, le contexte chaud, le tempérament,
   le juge des scènes) ; vingt appels pour le délai du premier mot, prompt de la taille d'un vrai tour (environ
   3 000 jetons), au réglage de raisonnement le plus bas que le modèle accepte. Il note, sans rien deviner : les
   noms exacts des réglages de raisonnement et d'effort acceptés par chaque modèle ; le décompte des jetons d'entrée,
   lus et écrits en cache ; la forme d'une clé refusée (une clé fausse) ; un schéma refusé, s'il y en a. Il enregistre
   un flux de chaque sorte pour le faux de la tâche 4. **Coût attendu : moins de 2 dollars** pour trois modèles.
   **Le plan s'arrête et revient à CrOliX** si un schéma du core est refusé sans contournement simple, ou si aucun
   modèle ne donne son premier mot sous 2 s en médiane depuis le laptop. Résultat écrit ici, « La mesure réelle ».
2. - [ ] **La liste et la clé par fournisseur** (`dev-core` ; en parallèle de 4). La liste à un seul endroit, OpenAI
   en tête ; le fournisseur en service, un réglage vivant, OpenAI à défaut. La clé : rangement chiffré, vérification,
   échéance et alertes, alerte de refus et de retour, surveillance d'une nouvelle clé, pour chaque fournisseur de la
   liste ; la commande de la clé prend le fournisseur, OpenAI à défaut. Le démarrage crée le module du fournisseur
   en service depuis la liste ; changer de fournisseur dans l'écran le remplace sans redémarrage, comme une nouvelle
   clé aujourd'hui. Les textes vus de l'utilisateur prennent le nom affiché du fournisseur : avec OpenAI, ils restent
   mot pour mot ceux d'aujourd'hui. Tests : une base d'aujourd'hui (clé, échéance, refus, modèle, coûts d'OpenAI)
   s'ouvre, sert OpenAI, garde sa clé et ses coûts ; deux clés rangées, chacune avec son échéance et son alerte ; un
   refus nomme son fournisseur ; changer de fournisseur change le module et rien d'autre. **Exclu** : les prix
   (tâche 3), l'écran (tâche 6), tout retour automatique d'un fournisseur à l'autre (point (e)).
3. - [ ] **Les prix par fournisseur, et le cache compté juste** (`dev-core` ; après 2 et 4). La table des modèles par
   fournisseur dans la liste : prix d'entrée et de sortie, de lecture et d'écriture du cache quand il y en a, réglage
   de raisonnement. Les prix d'Anthropic sont lus sur sa page de prix le jour même, et la date écrite à côté. Le
   bilan d'un appel porte aussi les jetons écrits en cache ; le coût d'un appel les compte à leur prix ; sans prix de
   cache, comme aujourd'hui. La surcharge par l'environnement se dérive du fournisseur. Le raisonnement coupé en dur
   dans le module d'OpenAI part dans sa table. Un modèle sans prix bloque encore, et la raison nomme le fournisseur.
   Tests : le coût d'OpenAI d'un appel avec jetons relus est le même qu'aujourd'hui, au millionième près ; un appel
   d'Anthropic avec lecture et écriture du cache compte chaque part à son prix ; les plafonds du jour et du mois
   tiennent sur un mélange des deux ; un modèle inconnu d'Anthropic est refusé au réglage. **Exclu** : poser des
   marqueurs de cache (point (c)).
4. - [ ] **Le module d'Anthropic et son faux** (`testeur` pour le faux et les tests, `dev-core` pour le module ; en
   parallèle de 2). Derrière l'interface existante, rien de plus : le flux (texte, outils en texte JSON, bilan de
   jetons, réponse coupée, annulation), la réponse structurée par format de sortie, les trois sortes d'erreur, la
   réponse refusée, le système à part, aucune relance du SDK et le même délai qu'OpenAI. Le seul changement de
   l'interface : un champ facultatif de plus au bilan, les jetons écrits en cache. Le faux serveur au format
   d'Anthropic rejoue les flux enregistrés à la tâche 1. Tests : chacun de ces comportements, dont une clé refusée,
   un crédit épuisé, un service en panne, un refus du modèle en flux et en réponse structurée, une annulation au
   milieu d'un flux. **Exclu** : le cache, la vérification de clé hors du module, tout réglage d'effort autre que ce
   que la table dit.
5. - [ ] **Les outils de mesure sur l'un ou l'autre** (`dev-core` ; après 3, en parallèle de 6). Le premier mot, la
   phrase d'attente et les scènes prennent le fournisseur, sa clé et son modèle de l'environnement, et créent le
   module par la liste ; aucun ne nomme plus un fournisseur ni un modèle par défaut. Le bras qui déplace un tour
   système au milieu du fil se joue sur Anthropic seulement si la tâche 1 l'a trouvé accepté ; sinon il est sauté,
   et le relevé le dit. Chaque outil garde son essai à blanc, sans clé. Tests : l'essai à blanc de chaque outil sur
   chacun des deux fournisseurs. **Exclu** : la chaîne du laptop, qui garde son faux modèle.
6. - [ ] **L'écran** (`dev-front` ; après 3, en parallèle de 5). Dans l'Atelier, le choix du fournisseur parmi la
   liste que rend le core ; une carte de clé par fournisseur, comme les postes montrent la leur (son état sur une
   ligne, son échéance, la vérifier avant de la ranger) ; le modèle, champ libre, prérempli au changement de
   fournisseur. L'écran des dépenses dit le fournisseur et le modèle de la dépense de Natsume du jour, et une ligne
   par fournisseur s'il y en a eu deux. Aucun nom de fournisseur écrit dans l'écran : il lit ceux du core. Vérifié
   dans Chrome sur le laptop, à la DA du kit ([`design.md`](../../standards/design.md)). Tests : les écrans avec un et
   deux fournisseurs, une clé refusée, un modèle sans prix refusé. **Exclu** : une liste de modèles à choisir.
7. - [ ] **Les comportements par Anthropic, sur le faux** (`testeur` ; après 3 et 4). Un petit lot de tests de
   service rejoué sur les deux fournisseurs : une réponse en flux, phrase par phrase ; une délégation, la phrase
   d'attente puis le second appel ; relire sa journée ; lire puis trancher une carte ; l'annulation ; la coupure ;
   une étape de la nuit et la lettre du matin en réponse structurée, puis la même en échec dit. La suite d'aujourd'hui
   passe sans qu'une attente change, et le diff des fichiers de test le montre.
8. - [ ] **Le garde** (`testeur` ; après 5 et 6). Le test qui parcourt les sources du core et de son écran, tel que
   décrit dans « La conception ». Il échoue sur `main`, passe sur la branche. Sa liste de fichiers permis est
   courte et chaque entrée dit pourquoi.
9. - [ ] **Les quatre mesures sur les vrais modèles** (`testeur`, depuis le laptop ; après l'accord de CrOliX sur le
   budget). Chaque mesure sur chaque modèle du point (a), et sur OpenAI le même jour, pour comparer à réseau égal.
   **Coût attendu**, aux prix lus le 20/11 et à vérifier : moins de 0,50 dollar par modèle léger, de l'ordre de
   3 dollars pour un modèle moyen, de 6 pour un grand ; le total s'arrête au budget du point (d). Les chiffres sont
   écrits ici, « Les mesures ».
10. - [ ] **Le choix posé à CrOliX, la doc et la livraison** (le manager, puis le livreur). Les chiffres de la tâche 9
    et le coût d'une journée par modèle, la recommandation, la décision de CrOliX écrite ici. Le README du core et son
    exemple d'environnement disent les deux fournisseurs ; la page de
    [mise en service du desktop](../mise-en-service-desktop.md) dit le prix du modèle retenu. Le fournisseur en
    service ne change qu'après la décision, par l'écran. PR en brouillon, ce plan coché.

## La mesure réelle (tâche 1)

À remplir.

## Les mesures (tâche 9)

À remplir. Une ligne par modèle, OpenAI rejoué le même jour.

| Modèle | Premier mot, médiane (écart) | Phrase d'attente | Scènes | Consignes relues | Une journée |
|---|---|---|---|---|---|
| OpenAI, modèle en service | | | | | |

**Une journée**, l'ordre de grandeur, prix lus le 20/11 à vérifier : cent tours de conversation d'environ
3 000 jetons d'entrée et 150 de sortie, hors raisonnement et hors cache, coûtent environ 0,04 dollar sur un petit
modèle (Claude Haiku 5.5, comme le modèle d'OpenAI en service), 0,75 sur un moyen (Claude Sonnet 5.5), 1,50 sur un
grand (Claude Opus 5.5). Le raisonnement s'y ajoute, facturé en sortie. Un grand modèle dépasserait le plafond par
jour de la conversation réglé par défaut.

## À trancher par CrOliX

**(a) Les modèles de Claude à mesurer.** Recommandation : **Claude Haiku 5.5 et Claude Sonnet 5.5 sur les quatre
mesures ; Claude Opus 5.5 sur le premier mot seulement**, pour voir ce que coûte un raisonnement qui ne se coupe pas
(selon la documentation, à vérifier). On juge sur trois choses, dans l'ordre : le premier mot, dont la part du modèle
doit laisser tenir les 2,5 s du VIP de bout en bout (sur OpenAI, cette part vaut un peu plus d'une seconde) ; les
scènes, au moins aussi bien qu'OpenAI ; le coût d'une journée, sous le plafond par jour. Le moins cher qui tient les
deux premiers l'emporte.

**(b) Le raisonnement et l'effort.** Fixés par modèle dans la table, ou réglables dans l'écran. Recommandation :
**dans la table, des données, sans réglage dans l'écran pour l'instant.** La valeur se règle une fois, sur la mesure
du premier mot ; un réglage d'écran se justifiera si deux usages (la voix et la nuit) demandent deux efforts.

**(c) Le cache du prompt.** Seulement compter juste ce que l'API renvoie, ou poser aussi les marqueurs. Recommandation :
**compter juste seulement**, comme le dit le hors périmètre. Sans marqueur, rien n'est relu ni écrit : le compte est
simple et vrai. La mesure du 10/11 a montré que le cache ne raccourcit pas le premier mot ; il ne ferait gagner que de
l'argent, de l'ordre de la moitié de l'entrée sur un modèle moyen. Un chantier à part, si le modèle retenu le vaut.

**(d) Le budget en argent des mesures.** Recommandation : **10 dollars au plus pour les tâches 1 et 9 ensemble**, la
tâche 1 sous 2. Le testeur s'arrête à 8 et revient à CrOliX. La clé de développement reste hors dépôt et ne s'affiche
jamais.

**(e) Le crédit mensuel épuisé.** Rien, l'erreur de crédit s'affiche ; ou un retour automatique à l'autre fournisseur.
Recommandation : **rien d'automatique.** L'erreur dit déjà le crédit épuisé et nomme le fournisseur ; revenir à
l'autre est un geste dans l'écran. Un retour automatique dépenserait en silence sur une autre clé, à un autre prix, et
ses textes, ses tests et son alerte en feraient un chantier.

**(f) La règle « rien en dur », à écrire une fois.** Elle n'est écrite nulle part comme une règle générale. On trouve :
[`vision.md`](../../vision.md), le contrôle (« régler en direct le modèle, sa parole et ses postes ») ;
[`dictionnaire.md`](../../standards/dictionnaire.md), l'agent du poste « neutre et réglable », jamais un nom en dur ;
[`design.md`](../../standards/design.md), aucune couleur en dur. Son absence explique comment le core a pu s'écrire
ainsi. Recommandation : une courte section de [`qualite.md`](../../standards/qualite.md), hors de ce chantier, sur sa
décision :

> **Rien en dur.** Ce qu'une instance peut vouloir changer est une donnée lue à l'exécution, jamais une valeur écrite
> dans le code : fournisseur, modèle, clé, prix, réglages d'un modèle, nom d'un agent, couleur. Le code en garde au
> plus un défaut, à un seul endroit. Un test qui parcourt les sources garde chacune de ces règles.

## Sur le laptop, et ce qui attend le NAS

- **Sur le laptop** : tout le code et ses tests, l'écran dans Chrome, les mesures contre les vraies API (le premier
  mot y vaut la part du modèle et du réseau, comme le 10/11).
- **Sur le desktop ou le NAS** : le délai de bout en bout contre les 2,5 s du VIP, une fois le modèle choisi. Sur le
  NAS, la clé d'Anthropic se range par l'écran à la mise en service, comme celle d'OpenAI. Rien de ce chantier
  n'attend le NAS pour être fini.

## Risques

- **Toucher la clé et les coûts juste avant la mise en service du NAS.** Une erreur ferait taire Natsume ou fausserait
  les plafonds le jour de la mise en route. Parades : OpenAI reste le fournisseur par défaut et en service jusqu'à la
  décision ; la tâche 2 se prouve sur une base d'aujourd'hui, puis sur une copie de la base du laptop ; le coût
  d'OpenAI d'un appel reste le même au millionième ; la PR se fusionne avant l'installation du NAS ou après sa
  première semaine, jamais pendant.
- **Un faux au format d'Anthropic qui se trompe** prouverait un module faux. Parade : la tâche 1 avant, ses flux réels
  comme modèle.
- **Le raisonnement qui ne se coupe pas** peut allonger le premier mot au-delà de la cible : c'est pourquoi le choix
  se fait sur la mesure, et la tâche 1 arrête le plan si aucun modèle ne tient.
- **Un schéma du core refusé** par le format de sortie d'Anthropic : la tâche 1 essaie chacun.
- **Les prix changent** : la table porte la date de lecture, la surcharge par l'environnement reste.
- **Les satellites** coupent le raisonnement d'une façon que la documentation dit refusée sur certains modèles récents.
  Hors de ce chantier : à vérifier, et une issue en inbox de chaque satellite si c'est vrai.
- **Deux fournisseurs, un seul plafond** : les plafonds comptent en dollars, pas par fournisseur. Le crédit mensuel
  d'Anthropic n'est pas un plafond du core ; il ne se voit qu'à son épuisement.

## Hors périmètre

Celui du chapeau : les satellites, qui ont déjà leurs fournisseurs ; le cache du prompt au-delà de ce qu'il faut pour
compter juste ; un troisième fournisseur ; un modèle local. Et, de ce plan : une liste de modèles à choisir dans
l'écran ; un modèle différent par usage (la voix, la nuit) ; le retour automatique d'un fournisseur à l'autre ; le
repli d'Anthropic vers un autre modèle sur un refus ; l'écriture de la règle « rien en dur » dans un standard, sans
la décision de CrOliX.

## Limites

- **« La suite passe telle quelle »** se lit : aucune attente de test ne change. Rendre la clé et les prix génériques
  renomme quelques fonctions ; leurs fichiers de test suivent par leurs imports et leurs noms seulement, et le diff des
  fichiers de test le montre à la relecture.
- **« Les consignes relues »** : aucun outil de mesure de ce nom dans le code au 20/11. Trois mesures existent (le
  premier mot, la phrase d'attente, les scènes et leur juge). À préciser avec CrOliX avant la tâche 9 ; si c'est une
  mesure à écrire, elle sort de ce chantier.
- **Les prix et les noms de réglage d'Anthropic** de ce plan viennent d'une table de référence du 03/11, non relue sur
  la page d'Anthropic : la tâche 1 et la tâche 3 les relisent.
- **Le premier mot mesuré du laptop** n'est que la part du modèle et du réseau ; la cible de 2,5 s se juge de bout en
  bout, sur le desktop.
