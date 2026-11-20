# Deux fournisseurs de modèle pour le core : Anthropic en plus d'OpenAI, au choix dans l'écran. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** le chapeau Lun-Ecosystem/lun-anima#116 (`niveau:standard`, privé), décidé par CrOliX le 20/11.
>
> **État : rédigé le 20/11 ; contesté le 20/11 (« à amender ») ; amendé le 20/11 ; les sept points tranchés par
> CrOliX le 20/11, un à un** (« Décisions de CrOliX, le 20/11 »). Son accord sur le budget vaut pour toutes les mesures
> du plan, sans redemander à chacune. **Codé et mesuré le 20/11** ; le modèle du rodage choisi par CrOliX le même jour
> (décision (h)) ; l'état tâche par tâche et critère par critère est à « L'état au 20/11 ».
>
> Code relu sur `main` de Lun'Anima (`7cfd192`), de Lun'Acedia et de Lun'Avaritia ; le graphe d'abord, puis chaque
> point du relevé et de la contestation relu dans le code. Lun'Anima est privé : ce plan dit les critères, les tâches
> en comportement, les mesures, les risques et les décisions. Les fichiers, les lignes, la branche et tout ce
> qui décrit l'intérieur du core sont dans le chapeau privé ([`securite.md`](../../standards/securite.md), « Dépôts
> publics »).

**But :** le core sait appeler un modèle d'Anthropic en plus d'OpenAI, au choix dans l'écran, avec une clé par
fournisseur. Revenir à OpenAI ne demande aucun code. Le modèle se choisit sur des mesures, pas d'avance. Et le core
cesse de nommer un fournisseur en dur : fournisseur, modèle, clé, prix et réglages du modèle deviennent des données
de l'instance.

**Source :** le chapeau : ses critères, son hors périmètre, deux décisions de CrOliX (les deux fournisseurs restent ;
le modèle se choisit sur une mesure) et le relevé du code du 20/11. Le même jour, CrOliX ajoute : « on a trop inscrit
en dur le fait d'utiliser OpenAI dans le core, ce qui est contraire à la règle écrite de rendre tout paramétrable » ;
d'où le critère 8. Les plans [premier mot](2026-11-10-premier-mot.md) et
[phrase d'attente](2026-11-11-phrase-attente.md) pour les chiffres d'OpenAI ; le
[recadrage du VIP](../specs/2026-11-19-recadrage-vip.md), § 6, pour la cible de 2,5 s.

**La date.** Fusionné et livré en image **avant la semaine de rodage**. Jamais pendant la mise en route du NAS,
jamais après.

**Critères de fin**, ceux du chapeau, chacun prouvé en local par une commande ou une capture :

1. **La conversation passe par Anthropic** : en flux, phrase par phrase à la voix, avec ses outils (confier à un
   poste, relire sa journée, lire et trancher une carte), l'annulation et la coupure ; puis le second appel qui dit le
   résultat d'une délégation. Tâches 1 et 4.
2. **La nuit et la lettre du matin passent par Anthropic** : chaque étape qui demande une réponse structurée la
   reçoit, ou échoue en le disant. Preuve : les tests de la tâche 4, puis une nuit réelle jouée contre Anthropic sur
   une base de test amorcée (tâche 8).
3. **Le fournisseur et le modèle se choisissent dans l'écran**, avec une clé par fournisseur : rangée chiffrée,
   vérifiée, avec son échéance et son alerte ; les textes nomment le bon fournisseur (une clé refusée, un crédit
   épuisé, un service injoignable). Tâches 2 et 6.
4. **Les coûts restent justes** : le prix du modèle choisi est connu, les jetons lus et écrits en cache sont comptés
   à leur prix quand le fournisseur en donne un, et rien d'autre ne change (décision (c)) ; les plafonds par jour et
   par mois tiennent ; l'écran des dépenses dit le fournisseur. Tâches 3 et 6.
5. **Revenir à OpenAI ne demande aucun code**, et rien de ce qui marche aujourd'hui avec lui ne change : la suite de
   tests actuelle passe telle quelle, **diff des fichiers de test nul**. Tâches 2 à 6. **Reformulé par CrOliX le
   20/11** (décision (i)) : aucune attente d'un test existant ne change, sauf quatre, par ajout, nommées dans la PR du
   core.
6. **Les quatre mesures se rejouent sur l'un ou l'autre** : le premier mot, la phrase d'attente, les scènes de la
   barre de personnalité, et les consignes relues. « Les consignes relues » est le respect des règles de la voix par
   le modèle : pas de mise en forme, des réponses courtes, la phrase d'attente, le français ; un compteur d'écarts de
   forme ajouté aux scènes le mesure. Si un écart apparaît, les consignes se corrigent et la mesure se rejoue. Les
   chiffres sur Anthropic sont écrits ici, à côté de ceux d'OpenAI. Tâches 5 et 8.
7. **Le choix du modèle** est posé à CrOliX sur ces chiffres, dans l'ordre de la décision (a) ; il lui revient.
   Tâche 9. Fait le 20/11 : décision (h).
8. **Aucun fournisseur en dur hors de ses modules** (ajouté par CrOliX le 20/11) : ni dans les textes vus de
   l'utilisateur, ni dans le rangement de la clé, ni dans les prix, ni au démarrage, ni dans les outils de mesure. La
   liste des fournisseurs vit à un seul endroit, tout le reste la lit ; ajouter un fournisseur plus tard ne demande
   qu'un module et une entrée dans cette liste. Un test qui parcourt les sources le garde. Tâches 2, 3, 5, 6 et 7.

| Dépôt | Issue | Niveau |
|---|---|---|
| `lun-anima` : 9 tâches | Lun-Ecosystem/lun-anima#116 | `standard` |
| `lun-docs`, `docs/core-deux-fournisseurs` : ce plan, ses coches et ses chiffres | la même | `trivial` |

**Le niveau.** `standard`. Le chantier touche la clé et les coûts, mais ne retire aucune donnée et ne change pas le
contrat satellite : les coûts que le core rend portent déjà un fournisseur par ligne. Chaque comportement changé a son
test, écrit d'abord par le testeur ([`workflow.md`](../../standards/workflow.md)). Une PR par dépôt ; celle du core
ferme le chapeau.

## Ce que le core fait aujourd'hui, en comportement

- **Un seul fournisseur, OpenAI, et un seul modèle partout** : la conversation et ses outils, le second appel d'une
  délégation, la parole d'elle-même, le rituel d'arrivée, la nuit, la lettre du matin, le portrait, le contexte chaud,
  le tempérament, les scènes. La nuit tourne au raisonnement par défaut du modèle ; la voix, raisonnement coupé.
- **Aucun résultat d'outil n'entre dans l'historique** : il repasse en texte dans un tour ordinaire. Aucun bloc propre
  à un fournisseur n'a donc à être rejoué d'un appel à l'autre.
- **Le modèle se saisit dans un champ libre** ; un modèle sans prix connu bloque la conversation, la nuit et le
  réglage.
- **La clé, ses alertes, les prix, les textes, le démarrage et les outils de mesure** sont écrits pour OpenAI seul.
- **Une clé refusée** donne un événement et une alerte ; **un crédit épuisé ne donne rien** : le message en erreur
  et l'état du core le disent, aucun événement ne part. Sur le NAS, une nuit sans crédit échouerait sans prévenir.
- **Les jetons relus du cache d'OpenAI** sont notés mais comptés au prix plein : un surcompte, du côté prudent.
- **L'écran des dépenses** ne dit ni le fournisseur ni le modèle.

## Ce qui se reprend des satellites, et ce qui s'écrit

Lun'Acedia et Lun'Avaritia ont déjà plusieurs fournisseurs (lus le 20/11). **Se reprend** : le découpage par
fournisseur (une liste avec leur nom affiché, une clé chiffrée par fournisseur, son échéance et son état de refus) ;
la table des prix par modèle, surchargeable ; la reconnaissance des erreurs (refus par le statut, crédit épuisé par le
code d'OpenAI ou le message d'Anthropic sur le solde) ; la vérification gratuite d'une clé par la liste des modèles.

**S'écrit** : le module d'Anthropic du core. Celui des satellites ne fait ni flux ni cache, a une interface sans
rapport, et coupe le raisonnement d'une façon que la documentation dit refusée par certains modèles récents
(« Risques »). **Ne se reprend pas** : leur liste de modèles à choisir, leur cinquième fournisseur, leur sorte d'erreur
« format ». Leur table des prix ne compte pas le cache.

## Ce que l'API d'Anthropic impose : à lire, pas à deviner

Le développeur du module lit la documentation à jour et le SDK officiel pour TypeScript **avant d'écrire**, et
n'invente aucun nom de paramètre, d'événement ni de champ. À y vérifier, puis sur un appel réel (tâche 1) :

- **Le système se passe à part des messages.** Les formes réelles du fil doivent passer : un fil qui commence par un
  tour de l'assistant, deux tours du même rôle à la suite, un texte vide.
- **Le raisonnement** ne se coupe pas sur tous les modèles, ou seulement sous un certain niveau d'effort ; il allonge
  le délai avant le premier mot, se facture comme de la sortie même quand il n'est pas montré, et compte dans la
  limite de jetons d'une réponse. Les limites de jetons du core doivent tenir avec lui.
- **La réponse structurée** se demande par un format de sortie, jamais en préremplissant la réponse. Les schémas du
  core viennent de formes bornées (longueurs, tailles de liste) ; une sortie structurée stricte peut en refuser des
  mots-clés. Le module retire ceux qu'elle ne prend pas, et la validation que le core fait déjà de chaque réponse
  reste le juge.
- **Le cache demande des marqueurs explicites** ; sans eux, rien n'est relu ni écrit. Les jetons lus et écrits ont
  chacun leur prix ; le décompte d'entrée ne les compte peut-être pas comme celui d'OpenAI.
- **Une réponse refusée par le modèle** a sa propre raison d'arrêt, sans erreur : la conversation dit ce qui est venu,
  une étape de la nuit échoue en le disant.
- **Les outils** rendent leurs arguments en objet, en morceaux dans le flux ; le core attend un texte JSON.
- **Le crédit épuisé** et la clé refusée se reconnaissent à leur statut et à leur message, vus sur un vrai refus.
- **Le SDK relance de lui-même** par défaut, et lit seul certaines variables d'environnement. Le module coupe les
  relances, garde le délai du module d'OpenAI, et passe lui-même sa clé et son adresse. Aucune clé du core, des
  outils de mesure ni de la tâche 1 ne porte un nom que le SDK ou un autre outil du poste lirait de lui-même.

## La conception : le plus petit changement

- **La liste des fournisseurs, à un seul endroit.** Une entrée par fournisseur : son identifiant, son nom affiché,
  son module, la vérification de sa clé, son modèle par défaut, sa table de modèles. OpenAI en tête : une base sans
  fournisseur réglé le lit, donc rien ne change sans geste. Tout le reste lit cette liste. Aucune couche nouvelle :
  l'interface existante reste celle des deux modules.
- **Le fournisseur et le modèle bougent ensemble.** Le réglage reçoit la paire d'un bloc et le serveur la valide
  (le modèle doit avoir un prix chez ce fournisseur). Le module se résout **à chaque appel**, depuis la paire lue
  d'une seule lecture des réglages : une étape de la nuit ne lit jamais le nouveau fournisseur avec l'ancien modèle.
- **La clé, découpée par fournisseur** à la façon des satellites. Celle d'OpenAI, son échéance et son état restent
  où ils sont : rien à migrer. Ce que l'écran lit aujourd'hui de la clé reste ce qu'il est, pour le fournisseur en
  service ; la liste des fournisseurs et l'état de chaque clé s'ajoutent à côté.
- **Le crédit épuisé** donne un événement au changement d'état, sur le modèle de la clé refusée, qui nomme le
  fournisseur ; et un retour à la normale. Le standard des notifications le classe déjà : « un service qui s'arrête
  faute d'accès », P1 ([`notifications.md`](../../standards/notifications.md)). Le contrat ne change pas : c'est un
  événement du core, pas d'un poste.
- **Les prix** restent une table plate par modèle (les noms des deux fournisseurs ne se recouvrent pas), lue comme
  aujourd'hui. Chaque entrée de modèle porte en plus, quand il y en a, le prix de lecture et d'écriture du cache, et
  deux réglages de raisonnement : **un pour la voix, un pour la nuit**. Pour OpenAI, ceux d'aujourd'hui : coupé à la
  voix, défaut du modèle la nuit ; la qualité de la nuit ne change pas sans qu'on l'ait choisi. La surcharge par
  l'instance porte toute l'entrée d'un modèle (prix, cache, raisonnement), pas seulement l'entrée et la sortie.
- **Le modèle reste un champ libre**, prérempli du modèle par défaut du fournisseur choisi.
- **Les tests.** La suite d'aujourd'hui reste sur le faux serveur d'OpenAI, sans changer un fichier de test. Le module
  d'Anthropic a **son propre faux serveur, au format d'Anthropic** : c'est la traduction du format qui est à prouver,
  et un faux derrière l'interface ne la verrait pas. Ses suites d'événements se calquent sur des flux réels
  enregistrés à la tâche 1, prompts inventés, sans clé ni en-tête. Un petit lot de tests du service se joue aussi sur
  ce faux, pour les critères 1 et 2 ; le reste de la suite ne se double pas, le service ne dépend pas du fournisseur.
- **Le garde** (critère 8), sur le modèle des tests des satellites qui cherchent un nom d'agent ou celui du core dans
  les sources. Les noms interdits se construisent **depuis la liste elle-même** (identifiants, noms affichés, modèles
  des tables), jamais une expression écrite à la main. Il permet une courte liste de fichiers, chacun avec sa raison,
  dans le chapeau. À l'inverse, il vérifie que l'exemple d'environnement et le README du core nomment chaque
  fournisseur de la liste (« Objections non appliquées »).

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit échouer ; le **développeur** (`dev-core`
pour le core, `dev-front` pour l'écran) écrit le code ; le **reviewer** relit le diff. Chaque tâche se ferme sur les
barrières du core au vert et sur un diff nul des fichiers de test d'aujourd'hui. Les commandes et les fichiers sont
dans le chapeau.

**L'ordre.** 1 d'abord. Puis **2 et 4 en parallèle** (aucun fichier commun ; la 2 ne touche pas à l'interface des
fournisseurs, que touche la 4). Puis 3. Puis **5 et 6 en parallèle** (aucun fichier commun). Puis 7, puis 8 et 9.

1. - [x] **La mesure réelle, avant tout code** (`dev-core`, hors dépôt ; dans le budget de la décision (d)). Un script
   jetable, hors du dépôt, sur le SDK officiel, la clé dans une variable propre au script, jamais affichée ni écrite.
   Sur Claude Haiku 5.5, Claude Sonnet 5.5, et le modèle d'OpenAI en service pour comparer le même jour :
   - un appel en flux, puis vingt pour le **premier mot et la fin de la première phrase**, prompt de la taille d'un
     vrai tour (environ 3 000 jetons chez OpenAI, 4 000 chez Anthropic avec les outils), au raisonnement le plus bas
     que le modèle accepte pour la voix ;
   - les formes réelles du fil : il commence par l'assistant, deux tours du même rôle, un texte vide ;
   - les vrais outils de la conversation : confier à un poste, relire sa journée, lire une carte, trancher une carte
     (une permission : l'appel doit sortir intact) ;
   - une annulation au milieu d'un flux, et ce qui est rendu ;
   - les limites de jetons du core, raisonnement compris ;
   - chaque schéma structuré du core, mots-clés retirés comme le fera le module, et la réponse passée à la validation
     du core ;
   - une clé fausse ; les noms exacts des réglages de raisonnement et d'effort acceptés ; le décompte des jetons
     d'entrée, lus et écrits en cache ; le rapport des jetons comptés entre les deux fournisseurs sur le même prompt.

   Il enregistre un flux de chaque sorte pour le faux de la tâche 4. **Coût attendu : moins de 2 dollars ; dépensé :
   1,45 $.** **Fait sur un prompt inventé** : le délai du raisonnement adaptatif mesuré là ne vaut pas pour le vrai
   prompt (« La leçon de méthode », à « Les mesures (tâche 8) »).
   **Seuil d'arrêt** : si, pour chaque modèle de Claude, la médiane du premier mot ou celle de la fin de la première
   phrase dépasse celle d'OpenAI du même jour de plus de 0,2 s, le plan revient à CrOliX. Un schéma refusé n'arrête
   pas le plan : la tâche 4 le traite. Résultat écrit ici, « La mesure réelle ».
2. - [x] **La liste, la paire, la clé par fournisseur, le crédit** (`dev-core` ; en parallèle de 4). La liste à un
   seul endroit ; la paire fournisseur et modèle, validée d'un bloc côté serveur, lue d'une seule lecture à chaque
   appel ; la clé de chaque fournisseur (rangée chiffrée, vérifiée, échéance et alertes, refus et retour, nouvelle clé
   prise sans redémarrage) ; la commande de la clé prend le fournisseur, OpenAI à défaut ; l'événement de crédit
   épuisé et de crédit revenu, qui nomme le fournisseur, une fois par changement d'état, même après un redémarrage.
   Les textes vus de l'utilisateur prennent le nom affiché : avec OpenAI, mot pour mot ceux d'aujourd'hui. **Le garde
   de la tâche 7 s'écrit ici, rouge** (`testeur`), et passe au vert au fil des tâches 2, 3, 5 et 6. Tests nouveaux :
   une base d'aujourd'hui s'ouvre, sert OpenAI, garde sa clé, son modèle et ses coûts ; deux clés, chacune avec son
   échéance et son alerte ; un refus et un crédit épuisé nomment leur fournisseur ; changer la paire pendant une nuit
   ne mélange jamais l'un et l'autre. **Exclu** : les prix (3), l'écran (6), tout retour automatique (décision (e)).
3. - [x] **Les prix et les réglages des modèles** (`dev-core` ; après 2 et 4). La table de chaque fournisseur dans la
   liste ; pour chaque modèle, ses prix, ceux du cache s'il y en a, son raisonnement pour la voix et pour la nuit. Les
   prix d'Anthropic sont lus sur sa page de prix le jour même, et la date écrite à côté. Le cache est compté à son
   prix quand le fournisseur en donne un ; sans prix de cache, comme aujourd'hui, et OpenAI n'en a pas (décision (c)).
   Un modèle nouveau s'ajoute par une mise à jour du core, ou par un réglage de l'instance qui déclare son entrée
   entière : prix, cache, raisonnement pour la voix et pour la nuit (décisions (b) et (g)). Le jeu de noms de modèles
   qui coupe le raisonnement chez OpenAI part dans sa table. Tests nouveaux : un appel d'Anthropic avec lecture et
   écriture du cache compte chaque part à son prix ; un appel d'OpenAI avec jetons relus coûte ce qu'il coûte
   aujourd'hui ; les plafonds tiennent sur un mélange des deux ; la nuit d'OpenAI garde son raisonnement par défaut ;
   un modèle déclaré par l'instance prend tous ses réglages. **Exclu** : poser des marqueurs de cache ; tout réglage
   des modèles à l'écran.
4. - [x] **Le module d'Anthropic, son faux, et le service par lui** (`testeur` pour le faux et les tests, `dev-core`
   pour le module ; en parallèle de 2). Derrière l'interface existante : le flux (texte, outils en texte JSON, bilan
   de jetons, réponse coupée, annulation), la réponse structurée par format de sortie, les mots-clés de schéma non
   pris en charge retirés, les trois sortes d'erreur, la réponse refusée, le système à part, les formes réelles du
   fil, aucune relance du SDK, sa clé et son adresse passées par lui. Seul changement de l'interface : un champ
   facultatif au bilan, les jetons écrits en cache. Le faux rejoue les flux de la tâche 1. Tests : chacun de ces
   comportements ; puis, sur ce faux, une réponse phrase par phrase, une délégation avec sa phrase d'attente et son
   second appel, relire sa journée, lire puis trancher une carte, l'annulation, la coupure, une étape de la nuit et la
   lettre du matin en réponse structurée, puis en échec dit. **Exclu** : le cache, tout effort hors de la table.
5. - [x] **Les outils de mesure sur l'un ou l'autre** (`dev-core` ; après 3, en parallèle de 6). Le premier mot, la
   phrase d'attente et les scènes prennent le fournisseur, la clé et le modèle de variables propres à chaque outil, et
   créent le module par la liste ; aucun ne nomme plus un fournisseur ni un modèle par défaut. Le premier mot mesure
   aussi la fin de la première phrase, coupée comme la voix la coupe ; sur un fournisseur sans cache rendu, il ne joue
   que les mesures qui ne dépendent pas du cache. Les scènes gagnent le compteur d'écarts de forme du critère 6, à
   côté de celui des tics. Chaque outil garde son essai à blanc. Tests : l'essai à blanc de chaque outil sur chacun
   des deux fournisseurs ; le compteur sur des réponses inventées.
6. - [x] **L'écran** (`dev-front` ; après 3, en parallèle de 5). Dans l'Atelier, le choix du fournisseur parmi la
   liste que rend le core ; une carte de clé par fournisseur, comme les postes montrent la leur ; le modèle, champ
   libre, prérempli au changement de fournisseur, envoyé avec lui. L'écran des dépenses dit le fournisseur et le
   modèle de la dépense de Natsume du jour, et une ligne par fournisseur s'il y en a eu deux. Aucun nom de fournisseur
   écrit dans l'écran. Vérifié dans Chrome sur le laptop, à la DA du kit ([`design.md`](../../standards/design.md)).
   Tests nouveaux : un et deux fournisseurs, une clé refusée, une paire refusée. **Exclu** : une liste de modèles.
7. - [x] **Le garde au vert** (`testeur` ; après 5 et 6). Écrit à la tâche 2, il échoue sur `main` et passe sur la
   branche ; sa liste de fichiers permis est courte et chaque entrée dit pourquoi.
8. - [x] **Les mesures sur les vrais modèles, et une nuit réelle** (`testeur`, depuis le laptop ; dans le budget de
   la décision (d)). Les quatre mesures sur Claude Haiku 5.5, Claude Sonnet 5.5 et OpenAI, le même jour, à réseau
   égal. Le premier mot y est celui de l'outil : pas de nouvelle série à part de celle de la tâche 1. Puis une nuit et
   une lettre du matin jouées contre Anthropic sur une base de test amorcée. **Coût attendu**, aux prix lus le 20/11 à
   vérifier : de l'ordre de 0,30 dollar pour Haiku, de 3 pour Sonnet, de 0,30 pour OpenAI, la nuit comprise.
   **Dépensé : 3,91 $** (2,50 puis 1,41 pour le complément du raisonnement coupé), bien au-delà de l'attendu pour
   Sonnet ; 5,36 $ avec la tâche 1, sous les 10 $ de la décision (d).
9. - [ ] **Le choix posé à CrOliX, la doc et la livraison** (le manager, puis le livreur). Les chiffres de la tâche 8,
   le coût d'une journée par modèle, la recommandation, le choix de CrOliX écrit ici. Le README du core et son
   exemple d'environnement disent les deux fournisseurs et le prix du modèle retenu ; la page de mise en service du
   NAS, qui viendra avec son chantier ([ADR 0014](../../adr/0014-mvp-sur-le-nas.md)), le reprendra. Le fournisseur en
   service ne change qu'après le choix, par l'écran. PR en brouillon, ce plan coché. **En partie au 20/11** : les
   chiffres et le choix sont écrits ici (décision (h)) ; le README du core dit les deux fournisseurs, Haiku 5.5 par
   défaut chez Anthropic et ses réglages de voix, pas encore le prix du modèle retenu ; la PR du core reste à livrer.

## La mesure réelle (tâche 1)

Le 20/11/2026, depuis le laptop, contre les API réelles, par un script jetable hors dépôt (SDK officiels, clé et adresse
passées explicitement, aucune relance). Prompt inventé de 2 957 jetons comptés par Anthropic hors outils, 4 022 avec les
quatre outils de la conversation. Vingt appels par modèle et par réglage, modèles en alternance, 2,5 s entre deux
appels, aucune limite de débit rencontrée. La fin de la première phrase est coupée comme la voix la coupe.

**Délais, série de référence (vingt questions de conversation sans outil), en ms.**

| Modèle et réglage | Premier mot, médiane | Premier mot, 90e centile | Fin de la 1re phrase, médiane | Fin de la 1re phrase, 90e centile |
|---|---|---|---|---|
| OpenAI, modèle en service, raisonnement coupé | 768 | 873 | 866 | 1 127 |
| Claude Haiku 5.5, raisonnement coupé, effort bas | 581 | 671 | 762 | 961 |
| Claude Haiku 5.5, raisonnement adaptatif, effort bas | 563 | 681 | 737 | 802 |
| Claude Sonnet 5.5, raisonnement au plus bas, effort bas | 1 366 | 1 829 | 1 502 | 2 218 |
| Claude Sonnet 5.5, raisonnement adaptatif, effort bas | 950 | 1 615 | 1 330 | 1 870 |

**Les lignes « adaptatif » : mesurées le matin sur un fil inventé ; contredites le soir avec les vraies consignes.**
Avec le vrai prompt du core, le raisonnement adaptatif part sur 11 appels de Haiku sur 20 et sur 5 de Sonnet sur 20 :
le premier mot de Haiku passe de 563 à 2 375 ms en médiane (« Les mesures (tâche 8) »). Ces lignes ne sont plus une
base de choix pour la voix ; elles restent pour la trace.

Minimum et maximum du premier mot : OpenAI 634 et 948 ; Haiku 490 et 791 (coupé), 497 et 870 (adaptatif) ; Sonnet 1 062
et 2 217 (au plus bas), 695 et 2 402 (adaptatif).

**Écart des médianes à OpenAI du même jour** (premier mot, fin de la première phrase) : Haiku −187 et −104 ms (coupé),
−205 et −129 ms (adaptatif) ; Sonnet +598 et +636 ms (au plus bas), +182 et +464 ms (adaptatif).

**Le seuil.** La règle du plan : si, pour chaque modèle de Claude, la médiane du premier mot ou de la fin de la première
phrase dépasse celle d'OpenAI de plus de 0,2 s, le plan revient à CrOliX. Fait brut : Haiku est sous OpenAI sur les deux
mesures ; Sonnet est au-dessus d'OpenAI de plus de 0,2 s sur la fin de la première phrase, dans les deux réglages, et
sur le premier mot dans l'un d'eux. Les modèles sont comparés à la fin du chantier ; le choix revient à CrOliX.
Le seuil a été jugé ici sur le prompt inventé ; rejugé le soir sur le vrai prompt, Haiku adaptatif le dépasse de
1,5 s, Haiku coupé reste sous OpenAI (522 contre 857 ms).

Une première série, avec des questions qui font parfois appeler un outil, donne les mêmes ordres de grandeur (premier
mot : OpenAI 819, Haiku 579 à 604, Sonnet 1 104 à 1 484). Dans cette série, OpenAI appelle un outil sur dix des vingt
questions, souvent sans dire un mot. OpenAI relit son cache automatique (environ 2 000 des 2 200 jetons) ; Anthropic,
sans marqueur, ne relit rien, et ses délais avec marqueurs n'ont pas été mesurés. Seul l'effort bas a été mesuré.

**Acquis, sur un appel réel.**

- **Formes du fil.** Un fil qui commence par l'assistant est accepté. Deux tours du même rôle à la suite sont acceptés
  et fusionnés. Un tour de l'assistant vide est ignoré. Un tour de l'utilisateur vide seul ou entre deux autres tours
  est refusé (400), comme un texte fait d'espaces. Un tour système au milieu est accepté seulement après un tour de
  l'utilisateur ; après un tour de l'assistant, il est refusé. Un fil qui finit par l'assistant est refusé (pas de
  préremplissage). Le système initial se passe à part.
- **Les quatre outils** (confier à un poste, relire sa journée, lire une carte, trancher une carte) sont appelés avec
  des arguments en JSON valide et conformes au schéma : 31 appels sur 31, relus par les lecteurs d'arguments du core.
  Les arguments arrivent en 28 à 55 morceaux de texte JSON, l'objet n'étant complet qu'à la fin du bloc ; la raison
  d'arrêt est celle de l'appel d'outil. Aucun appel parallèle (contredit le soir : voir les surprises de la tâche 8).
  Haiku, raisonnement coupé, n'a pas relu la journée quand il aurait fallu (0 sur 2). Sonnet dit parfois une phrase
  avant un outil qui n'est pas une délégation (4 appels sur 6), ce que la règle de la voix interdit.
- **Réponse structurée.** Les six schémas du core sont acceptés tels quels et leurs réponses passent la validation du
  core, sauf un : le mot-clé de taille maximale d'un tableau est refusé (400, `For 'array' type, property 'maxItems' is
  not supported`), comme les bornes d'un nombre et une taille minimale de tableau au-delà de 1. Les longueurs minimale
  et maximale d'une chaîne sont acceptées, malgré la documentation qui les dit non prises en charge ; si l'API les
  impose ou non n'est pas tranché.
- **Raisonnement.** Haiku 5.5 : le raisonnement se coupe, jusqu'à l'effort « élevé » (au-dessus, refusé) ; le mode «
  entre les outils » est refusé. Sonnet 5.5 : le raisonnement ne se coupe pas (400) ; le plus bas est le mode « entre
  les outils », jusqu'à l'effort « élevé ». Un budget de jetons de raisonnement est refusé sur les deux, comme toute
  température, même nulle. Un appel d'outil forcé est refusé sur Sonnet. **Le réglage par défaut vide les réponses
  courtes** : Sonnet à 60 jetons et Haiku à effort élevé rendent un seul bloc de raisonnement vide, sans texte ; à 1 500
  jetons, le contexte du matin est vide chez Haiku et tronqué chez Sonnet. Les réglages bas tiennent toutes les limites
  du core (60 à 8 000 jetons). La plus serrée : 1 500 jetons pour le contexte du matin, 1 252 utilisés par Haiku en
  raisonnement adaptatif.
- **Annulation.** Le flux brut s'arrête sans erreur et sans bilan de jetons ; avec l'assistant de flux du SDK,
  l'annulation lève une erreur d'annulation et garde le texte partiel et l'entrée seulement. La documentation lue ne dit
  rien de ce qui est facturé après une annulation.
- **Clé fausse** : 401, type `authentication_error`, message `invalid x-api-key`, identique en flux et hors flux. Un
  modèle inconnu : 404 `not_found_error`.
- **Crédit épuisé**, non provoqué. D'après la documentation : 402 `billing_error` ; une limite de dépense fixée par
  l'organisation, 400 ; le plafond mensuel du palier, 429 sans délai de reprise, qui ne se réessaie pas. Le texte du
  message de solde n'y est pas.
- **Cache** : seulement avec un marqueur (rien de lu ni d'écrit sans lui, sur deux appels identiques). Avec un marqueur
  : 2 970 jetons écrits au premier appel, relus au second. **Le décompte d'entrée d'Anthropic exclut le cache lu et
  écrit**, qui s'ajoutent ; celui d'OpenAI les inclut.
- **Champs d'usage.** Hors flux : entrée, sortie, cache lu, cache écrit (et sa durée), jetons de raisonnement. En flux :
  le début de message donne l'entrée et le cache, la fin donne le cumul.
- **Un même texte compte 1,7 à 1,8 fois plus de jetons chez Anthropic que chez OpenAI** (2 957 contre 1 785 sans outils,
  4 022 contre 2 223 avec). Les réponses sont aussi plus longues (59 à 84 jetons de sortie en médiane, contre 28).

**Prix lus le 20/11/2026** ([page de prix d'Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)), en
dollars par million de jetons :

| Modèle | Entrée | Sortie | Écriture du cache (5 min) | Lecture du cache |
|---|---|---|---|---|
| Claude Haiku 5.5, prompt de 100 000 jetons au plus | 0,10 | 0,50 | 0,125 | 0,01 |
| Claude Haiku 5.5, prompt plus long | 0,50 | 2,50 | 0,625 | 0,05 |
| Claude Sonnet 5.5 | 2 | 10 | 2,50 | 0,10 |

**Ce qui contredit le plan, et ce que ça change.**

- **Le prompt de 3 000 jetons** : avec les quatre outils, il en compte environ 4 000 chez Anthropic. Les tableaux de
  coût se recalculent à 4 000 jetons d'entrée.
- **Le coût d'une journée** : à prix égal par million, Haiku coûte plus qu'OpenAI, du fait du décompte (0,00043 $ la
  réponse contre 0,00024 $ mesurés). Le tableau de la tâche 8 se refait avec les jetons rendus.
- **« Le raisonnement ne se coupe pas sur tous les modèles »** : exact, et plus fin : la valeur à envoyer n'est pas un
  seul réglage mais un couple (mode, effort) propre à chaque modèle, et « rien envoyer » est exclu. Tâche 3 : l'entrée
  d'un modèle porte ce couple pour la voix et pour la nuit.
- **Une température** est refusée en entier, alors que la documentation parlait d'une seule valeur permise ; un appel
  d'outil forcé est refusé sur Sonnet.
- **Les mots-clés de schéma** : un seul est refusé pour les six schémas du core ; les longueurs de chaîne ne le sont
  pas. Tâche 4 : retirer au moins la taille maximale d'un tableau ; la validation du core reste le juge.
- **Le décompte** : tâche 4, le bilan d'entrée additionne entrée, cache lu et cache écrit ; tâche 3, chaque part se
  compte à son prix.
- **Le crédit** : tâche 2, le crédit épuisé se reconnaît à un statut 402, à une limite de dépense (400) ou au plafond du
  palier (429 non réessayé) ; le message de solde est à confirmer sur un vrai refus.
- **Le fil** : tâche 4, les tours vides se retirent avant l'envoi, aucun fil ne finit par l'assistant, et un système au
  milieu suit un tour de l'utilisateur.
- **L'annulation** : tâche 4, les jetons d'un flux annulé s'estiment, comme pour OpenAI.

**Non mesuré.** Crédit épuisé, limite de débit, surcharge, erreurs 500 et 504 ; un refus du modèle ; la facturation d'un
flux annulé ; les délais d'Anthropic avec marqueurs de cache et aux efforts moyen et élevé ; le second appel d'une
délégation et le rituel d'arrivée de bout en bout ; la part du réseau (un poste, un jour) ; la qualité du français, la
mise en forme et les scènes (tâche 8).

**Coût** : 1,45 $ sur les 10 $ du chantier (Haiku 0,08 $, Sonnet 1,36 $, OpenAI 0,01 $), compté d'après les jetons
rendus, non vérifié sur la console. Les flux enregistrés pour le faux de la tâche 4 sont gardés hors dépôt.

## Les mesures (tâche 8)

Le 20/11/2026, depuis le laptop, contre les API réelles. Environ 1 900 appels, aucun statut d'erreur, aucune limite de
débit. Les chiffres sont rendus tels quels ; le choix est celui de CrOliX (décision (h)).

**La méthode, en trois lignes.**

- Le code du chantier tel quel, ses outils de mesure lancés sans retouche ; là où un outil ne mesurait rien (surprise
  1), sa boucle rejouée hors dépôt, à la limite de jetons de la conversation.
- Les vraies consignes de Natsume et ses vrais outils, pas un fil inventé.
- Un seul juge pour les scènes, Claude Sonnet 5.5, une passe ; une série par candidat, deux passes pour la phrase
  d'attente sauf Sonnet (une).

**Cinq réglages comparés** : le modèle d'OpenAI en service, sans raisonnement ; Claude Haiku 5.5, raisonnement
adaptatif puis coupé ; Claude Sonnet 5.5, raisonnement adaptatif puis « entre les outils » (le plus bas qu'il
accepte). Chaque fois à l'effort bas. Les réglages déclarés sont vérifiés sur les requêtes envoyées.

| | OpenAI | Haiku adaptatif | **Haiku coupé** | Sonnet adaptatif | Sonnet entre les outils |
|---|---|---|---|---|---|
| Premier mot, médiane (ms) | 857 | 2 375 | **522** | 1 076 | 1 264 |
| Premier mot, 90e centile (ms) | 1 481 | 3 395 | **621** | 3 592 | 1 664 |
| Fin de la 1re phrase, médiane (ms) | 894 | 2 375 | **707** | 1 335 | 1 404 |
| Fin de la 1re phrase, 90e centile (ms) | 1 481 | 3 439 | **739** | 3 592 | 1 675 |
| Appels qui raisonnent | sans objet | 11/20 | 0/20 | 5/20 | 0/20 |
| Pour un poste, annonce puis appel | 30/40 | 9/40 | 32/40 | 17/20 | 19/20 |
| Pour un poste, annonce sans appel | 0 | 28 | 5 | 2 | 1 |
| Phrase avant un autre outil | 0 | 5 | 13 | 0 | 3 |
| Scènes, juge unique | 18/21 | 19/21 | 17/21 | 21/21 | non joué |
| Écarts de forme (tous « longueur ») | 0 | 7 | 5 | 8 | non joué |
| Mots par réponse, médiane (min, max) | 27 (6, 87) | 66 (1, 177) | 71 (25, 156) | 91 (12, 137) | non joué |
| Une journée, conversation et nuit | 0,036 $ | 0,077 $ | 0,065 $ | 1,43 $ | 1,37 $ |
| Un mois, scènes comprises | 1,1 $ | 2,3 $ | 2,0 $ | 43 $ | 41 $ |

Délais : vingt questions sans outil, vingt appels gardés. Phrase d'attente : vingt demandes pour un poste, à la voix.
Aucun tic chez aucun. Quand la demande fait appeler un outil, le premier signe de Haiku coupé arrive à 536 ms en
médiane (p90 635), contre 1 080 pour OpenAI ; Sonnet entre les outils n'y a pas été mesuré. Sans la consigne
d'attente, Haiku coupé et Sonnet entre les outils disent quand même une phrase avant l'appel (28/40 et 18/20) ; OpenAI
jamais.

**Les délégations de bout en bout**, sur le vrai service et un poste factice, huit demandes dans un même fil : OpenAI
8/8, Haiku adaptatif 7/8, Haiku coupé 3/8, Sonnet adaptatif 6/8, Sonnet entre les outils 8/8. Le 3/8 de Haiku coupé
n'est pas un taux : le fil gardait l'historique, et dès la troisième demande il a répondu de l'historique ou annoncé
sans appeler. La phrase d'attente, une demande par fil neuf, en est la mesure propre.

**Relire sa journée**, Haiku coupé, cinq questions : sur les trois dont la réponse n'est pas en contexte, l'outil est
appelé deux fois ; la réponse sans appel est fausse. Mesure faible, non rejouée sur les autres réglages.

**La leçon de méthode.** Le matin, sur un fil inventé (tâche 1), Haiku adaptatif donnait 563 ms au premier mot et
semblait le meilleur réglage pour la voix. Le soir, avec les vraies consignes, le raisonnement adaptatif part sur la
moitié des appels et le premier mot passe à 2,4 s en médiane. Haiku coupé retrouve le matin (522 contre 581 ms). Une
mesure de délai se fait sur les vraies consignes, jamais sur un prompt inventé.

**Une journée et un mois**, refaits avec les jetons mesurés. Cent tours par jour, dont dix délégations à deux appels ;
aucun cache lu. Chez Anthropic, un tour compte environ 4 900 jetons d'entrée, contre 2 950 chez OpenAI. La sortie
d'un tour simple : 37 jetons chez OpenAI, 171 chez Haiku coupé, 389 chez Haiku adaptatif. La nuit est mesurée pour
Haiku, estimée pour les autres. Le mois compte trente jours et une série de scènes.

| | OpenAI | Haiku adaptatif | Haiku coupé | Sonnet adaptatif | Sonnet entre les outils |
|---|---|---|---|---|---|
| Un tour simple | 0,00031 $ | 0,00068 $ | 0,00057 $ | 0,01204 $ | 0,01149 $ |
| Une délégation (deux appels) | 0,00060 $ | 0,00136 $ | 0,00110 $ | 0,02975 $ | 0,02867 $ |
| La conversation d'une journée | 0,034 $ | 0,075 $ | 0,063 $ | 1,381 $ | 1,321 $ |
| La nuit | 0,0015 $ (estimée) | 0,0023 $ | 0,0023 $ | 0,046 $ (estimée) | 0,046 $ (estimée) |
| **Une journée** | 0,036 $ | 0,077 $ | 0,065 $ | 1,43 $ | 1,37 $ |
| **Un mois** | environ 1,1 $ | environ 2,3 $ | environ 2,0 $ | environ 43 $ | environ 41 $ |
| Part du crédit de 100 $ par mois | 1 % | 2 % | 2 % | 43 % | 41 % |

Le tableau d'avant (repricé sur la base mince du laptop) donnait à Haiku le coût d'OpenAI par réponse. Faux : à prix
égal par million, Haiku coupé coûte environ 1,8 fois plus par jour, par le décompte et par des réponses plus
longues. Sonnet, à cent tours par jour, approche le plafond du chat de la base de test (1,50 $ par jour).

**La nuit réelle**, Claude Haiku 5.5 au réglage de nuit (raisonnement coupé), sur une base de test amorcée puis
remplie d'une journée inventée de 21 tours. La veille réussit en 87,5 s : trois jours, dont un « en attente d'un
poste » (tout est écrit, l'envoi à la mémoire attend un satellite). Le matin réussit en 5,3 s. 44 appels pour la
veille, tous réussis ; **0,0112 $ la veille, 0,0119 $ avec le matin.** Écrit : un récit du jour cohérent, huit
souvenirs à la première personne, un portrait lisible qui généralise trop vite à partir d'un seul jour, un contexte
chaud correct, la lettre « Nuit calme. Rien à trancher. ». Les scènes de la première nuit sur ce modèle : 20/21, aucun
tic. **Attend un poste** : l'envoi à la mémoire, faute de satellite relié.

**Les surprises.**

1. L'outil du premier mot ne mesurait rien sur Anthropic : sa limite de 60 jetons était prise entière par le
   raisonnement. Corrigé dans le chantier : il demande à la limite de la conversation et distingue un appel vide.
2. Le raisonnement adaptatif retarde le premier mot de 2 à 3 s sur la moitié des appels de Haiku, un quart de ceux de
   Sonnet. Corrigé : la voix de Haiku est coupée, celle de Sonnet « entre les outils » ; la nuit ne change pas.
3. Des réponses vides : à 800 jetons, le raisonnement a tout pris, sans un mot (un tour sur huit, Haiku et Sonnet
   adaptatifs). Corrigé : une réponse coupée avant tout mot est une erreur, plus une réponse vide.
4. Des appels d'outil parallèles, que la tâche 1 n'avait pas vus : deux tours sur sept chez Haiku adaptatif, quatre sur
   huit chez Sonnet entre les outils. Le core n'en garde que le premier, et le dit au journal.
5. Le coût affiché par la veille ne compte que son premier appel (0,0012 $), alors que la base compte juste
   (0,0112 $). Hors du chantier : Lun-Ecosystem/lun-anima#119.
6. OpenAI rend un champ nouveau, les jetons écrits en cache ; le core ne le lit pas. Sans effet sur ses coûts : OpenAI
   n'a pas de prix de cache dans la table (décision (c)).
7. Haiku coupé dit plus souvent une phrase avant un outil qui n'en veut pas (13 cas), et une annonce reste parfois sans
   appel (5 sur 40). Ce sont ses deux défauts mesurés : Lun-Ecosystem/lun-anima#118.

**Non mesuré.** Le vrai message d'un crédit épuisé, d'une limite de débit, d'une surcharge ; un refus du modèle ; le
cache avec marqueurs chez Anthropic ; la nuit d'OpenAI et de Sonnet de bout en bout (estimées) ; le rituel d'arrivée et
le second appel avec un vrai satellite ; Sonnet entre les outils sur les scènes, le premier signe avant un outil et
la relecture de la journée ; les scènes à plusieurs tirages et un juge répété ; la qualité du français, jugée sur les
réponses brutes, gardées hors dépôt.

**Le coût des mesures** : 3,91 $ pour la tâche 8 (OpenAI 0,09 $, Haiku 0,29 $, Sonnet 3,54 $), 5,36 $ avec la tâche
1, **sur les 10 $** de la décision (d). Compté d'après les jetons rendus, non vérifié sur la console.

## Décisions de CrOliX, le 20/11

Tranchées une à une, le 20/11.

**(a) Les modèles à mesurer et l'ordre du jugement.** **Claude Haiku 5.5 et Claude Sonnet 5.5, contre OpenAI le même
jour**, sans Opus. On juge dans cet ordre : le premier mot et la fin de la première phrase (au plus OpenAI du même
jour plus 0,2 s) ; le taux de phrase d'attente ; le respect des règles de la voix et le français ; les scènes ; le
coût d'une journée. **Le choix final revient à CrOliX, sur les chiffres** (tâche 9).

**(b) Le raisonnement et l'effort.** **Une donnée par modèle, une valeur pour la voix et une pour la nuit,
surchargeable par l'instance ; rien à l'écran.** La valeur de la voix se fixe sur la mesure du premier mot (tâche 1).
Fixée en fait sur la tâche 8 : la tâche 1, sur un fil inventé, laissait croire que le raisonnement adaptatif ne
retardait pas la voix ; avec les vraies consignes, il la retarde. La voix est coupée pour Haiku, « entre les outils »
pour Sonnet.

**(c) Le cache.** **Compté à son prix quand le fournisseur en donne un ; rien d'autre ne change.** OpenAI reste
compté comme aujourd'hui : ses jetons relus au prix plein. Sans marqueurs, Anthropic n'en rendra aucun ; s'il en
rend, chaque part est comptée à son prix. Le critère 5 tient au sens strict.

**(d) Le budget.** **10 dollars au plus pour tout le chantier**, la tâche 1 sous 2 ; le testeur s'arrête à 8 et
revient à CrOliX. **Cet accord vaut pour les mesures du plan**, sans redemander à chacune. La clé de développement reste
hors dépôt et ne s'affiche jamais.

**(e) Le crédit épuisé.** **Rien d'automatique.** Le core prévient : crédit épuisé, crédit revenu, le fournisseur
nommé ; CrOliX choisit, par un geste dans l'écran.

**(f) La règle « rien en dur ».** **Oui, ce texte exact, dans ce chantier**, dans
[`qualite.md`](../../standards/qualite.md), « Rien en dur » ; le reviewer la vérifie. Elle n'était écrite nulle part
comme règle générale ; on trouvait [`vision.md`](../../vision.md), le contrôle (« régler en direct le modèle, sa parole
et ses postes ») ; [`dictionnaire.md`](../../standards/dictionnaire.md), l'agent du poste « neutre et réglable » ;
[`design.md`](../../standards/design.md), aucune couleur en dur.

> **Rien en dur.** Ce qu'une instance peut vouloir changer est une donnée lue à l'exécution, jamais une valeur écrite
> dans le code : fournisseur, modèle, clé, prix, réglages d'un modèle, nom d'un agent, couleur. Le code en garde au
> plus un défaut, à un seul endroit. Chaque règle qui peut l'être a son garde, un test qui parcourt les sources.

**(g) Un nouveau modèle.** **Par une mise à jour du core, ou par un réglage de l'instance qui déclare l'entrée
entière** (prix, cache, raisonnement pour la voix et pour la nuit) ; **rien à l'écran au MVP**.

**Trois décisions de plus, le 20/11 au soir, sur les mesures de la tâche 8.**

**(h) Le modèle du rodage.** **Claude Haiku 5.5, raisonnement coupé pour la voix**, pour la semaine de rodage.
Claude Sonnet 5.5 et OpenAI restent à un clic, par l'écran. Avant le rodage : les consignes corrigées sur ses deux
défauts mesurés (une annonce sans appel, 5 sur 40 ; une phrase avant un outil qui n'en veut pas), puis remesurées.

**(i) Le critère 5, reformulé.** **Aucune attente d'un test existant ne change, sauf quatre, par ajout**, nommées dans
la PR du core : l'alerte de crédit épuisé, le fournisseur et la liste des fournisseurs dans les réglages,
l'identifiant du fournisseur dans deux envois de l'écran pour la clé.

**(j) La longueur.** **La borne de 100 mots est un repère de mesure**, pas une règle du core : les écarts « longueur »
des scènes se lisent avec elle.

## L'état au 20/11

Les tâches 1 à 8 sont faites ; la 9 en partie. Livré, en comportement, là où ça diffère du plan ou le précise :

- **Une conversation non configurée prévient** : sans clé ou sans modèle pour le fournisseur choisi, le core le dit
  une fois, en événement P1, avec la raison ; une clé posée sous le seul nom que lit le SDK d'Anthropic est signalée,
  pas ignorée en silence.
- **Une variable mal formée d'un fournisseur ne coupe que lui** : l'autre démarre et sert.
- **Le core retient le modèle de chaque fournisseur** : revenir à l'un reprend le dernier modèle choisi pour lui.
- **Un message vide est une erreur** : une réponse coupée à la limite avant tout mot n'est plus rendue comme vide ;
  une réponse coupée compte l'entrée que son flux a déjà donnée.
- **Un refus du modèle a sa propre sorte**, jamais prise pour une panne du fournisseur, et son coût est compté.
- **Les dépenses par fournisseur et par modèle** : l'écran des dépenses dit le fournisseur et le modèle de la dépense
  de Natsume du jour, une ligne par fournisseur s'il y en a eu deux.
- **La voix ne raisonne jamais avant son premier mot** chez Anthropic : coupée pour Haiku, « entre les outils » pour
  Sonnet, d'après la tâche 8 ; la nuit garde son réglage.

**Les critères de fin.**

| Critère | État | Preuve |
|---|---|---|
| 1. La conversation par Anthropic | tenu | tests sur le faux (flux, outils, annulation, coupure, second appel) ; vrais modèles, tâche 8, délégations vers un poste factice. Jamais avec un vrai satellite |
| 2. La nuit et le matin | tenu | nuit réelle sur Haiku, chaque étape structurée reçue (tâche 8) |
| 3. Le choix dans l'écran, une clé par fournisseur | tenu | tests de l'écran ; la capture dans Chrome est à joindre à la PR du core |
| 4. Les coûts justes | tenu | tests du cache à son prix, des plafonds sur un mélange, des dépenses par fournisseur. Le coût affiché par la veille reste faux (#119), celui de la base est juste |
| 5. Revenir à OpenAI sans code | tenu, au sens de la décision (i) | diff des fichiers de test : quatre attentes changées par ajout, le reste ajouté |
| 6. Les quatre mesures sur l'un ou l'autre | en partie | les quatre se rejouent sur chacun (tâche 8) ; les consignes ne sont pas encore corrigées sur les écarts mesurés (#118) ; l'outil des scènes ne joue pas le réglage de voix, d'où Sonnet entre les outils non joué |
| 7. Le choix du modèle | tenu | décision (h) |
| 8. Aucun fournisseur en dur | tenu | le garde, un test qui parcourt les sources, prouvé qu'il mord |

## Les suites

- **Avant le rodage** : corriger les consignes de la voix sur les deux défauts mesurés de Haiku (l'annonce sans appel,
  la phrase avant un outil qui n'en veut pas), puis remesurer la phrase d'attente :
  Lun-Ecosystem/lun-anima#118.
- **En tri** : les défauts relevés plus tôt, Lun-Ecosystem/lun-anima#117 (l'événement « clé rétablie » au mauvais
  niveau), #119 (le coût affiché par la veille), #120 (un modèle inconnu saisi à l'écran mal expliqué).
- **Jamais vu sur l'API réelle** : un crédit épuisé, un refus du modèle, une limite de débit. Leur traitement est
  écrit d'après la documentation et prouvé sur le faux ; le premier vrai cas se lit au journal.
- **Sur le NAS** : ranger la clé d'Anthropic par l'écran, à la mise en service, pas par une variable du poste.

## Sur le laptop, et ce qui attend le NAS

Selon l'[ADR 0014](../../adr/0014-mvp-sur-le-nas.md) et l'ordre du 20/11 de la
[feuille de route](2026-11-07-feuille-de-route-mvp.md) (§ 3, « Le recadrage du 20/11 ») :

- **Sur le laptop** : tout le code et ses tests, l'écran dans Chrome, les mesures contre les vraies API, la nuit
  réelle sur une base de test. Le premier mot y vaut la part du modèle et du réseau, comme le 10/11.
- **Sur le NAS** : le core livré en image, la clé d'Anthropic rangée par l'écran à la mise en service.
- **À la session du desktop, pour la voix** (Luxuria reliée au core du NAS) : le délai de bout en bout contre les
  2,5 s du VIP, une fois le modèle choisi.

Rien de ce chantier n'attend le NAS ni le desktop pour être fini.

## Risques

- **Toucher la clé et les coûts juste avant la mise en service du NAS.** Une erreur ferait taire Natsume ou fausserait
  les plafonds. Parades : OpenAI reste en service jusqu'au choix du modèle ; la tâche 2 se prouve sur une base
  d'aujourd'hui et sur une copie d'une base réelle ; diff nul des tests ; la PR fusionnée et livrée en image avant le
  rodage, jamais pendant la mise en route du NAS, jamais après.
- **Un faux au format d'Anthropic qui se trompe** prouverait un module faux. Parade : la tâche 1 avant, ses flux réels
  comme modèle.
- **Le raisonnement qui ne se coupe pas** peut allonger le premier mot, ou couper une réponse à la limite de jetons :
  la tâche 1 le mesure et arrête le plan au seuil dit.
- **Un schéma refusé ou une réponse mal formée** : les mots-clés retirés, la validation du core reste le juge ; une
  réponse qui ne passe pas fait échouer l'étape en le disant, jamais en silence.
- **Une clé lue par erreur** : un SDK lit seul des variables d'environnement, et un poste de développement en porte
  souvent. Parade : le module passe sa clé et son adresse ; les noms de variables du core et des outils ne sont pas
  ceux que lit un SDK, sauf la clé d'OpenAI, gardée sous son nom d'aujourd'hui pour les installations existantes.
- **Les prix changent** : la table porte la date de lecture ; la surcharge de l'instance reste.
- **Les satellites** coupent le raisonnement d'une façon que la documentation dit refusée par certains modèles récents.
  Hors de ce chantier : à vérifier, et une issue en inbox de chaque satellite si c'est vrai.
- **Deux fournisseurs, un seul plafond** : les plafonds comptent en dollars. Le crédit mensuel d'Anthropic n'est pas
  un plafond du core ; l'événement de crédit le dit à son épuisement.

## Hors périmètre

Celui du chapeau : les satellites ; le cache du prompt au-delà de ce qu'il faut pour compter juste ; un troisième
fournisseur ; un modèle local. Et, de ce plan : Claude Opus ; une liste de modèles dans l'écran ; un écran pour ajouter
un modèle ou régler le raisonnement (décisions (b) et (g)) ; un modèle par usage ; le retour automatique d'un
fournisseur à l'autre ; le repli d'Anthropic vers un autre modèle sur un refus.

## Objections non appliquées

- **Le garde ne cherche pas l'absence des noms dans l'exemple d'environnement, le README et le CLAUDE.md du core.** Ces
  fichiers doivent nommer les fournisseurs pour dire comment les régler. Le garde y vérifie l'inverse : chaque
  fournisseur de la liste y est nommé, donc la doc suit la liste.
- **Pas de faux de l'écran à permettre** : l'écran n'en a aucun hors de ses fichiers de test, déjà permis.

## Limites

- **Les prix et les noms de réglage d'Anthropic** ont été relus sur la page d'Anthropic le 20/11 (tâche 1) ; la
  tâche 3 écrit la date à côté de la table.
- **Le coût d'une journée** vient des jetons mesurés sur cent tours supposés, sans cache, la nuit estimée hors de
  Haiku ; il se rejoue sur une base du rodage.
- **Les mesures de la tâche 8** : un poste, un jour, une passe de juge ; Sonnet entre les outils n'a pas joué les
  scènes, et plusieurs chiffres de la phrase d'attente reposent sur vingt cas ou moins.
- **Le premier mot mesuré du laptop** n'est que la part du modèle et du réseau ; la cible de 2,5 s se juge de bout en
  bout.
