# Deux fournisseurs de modèle pour le core : Anthropic en plus d'OpenAI, au choix dans l'écran. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** le chapeau Lun-Ecosystem/lun-anima#116 (`niveau:standard`, privé), décidé par CrOliX le 20/11.
>
> **État : rédigé le 20/11 ; contesté le 20/11 (« à amender ») ; amendé le 20/11 ; les sept points tranchés par
> CrOliX le 20/11, un à un** (« Décisions de CrOliX, le 20/11 »). Son accord sur le budget vaut pour toutes les mesures
> du plan, sans redemander à chacune.
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
   tests actuelle passe telle quelle, **diff des fichiers de test nul**. Tâches 2 à 6.
6. **Les quatre mesures se rejouent sur l'un ou l'autre** : le premier mot, la phrase d'attente, les scènes de la
   barre de personnalité, et les consignes relues. « Les consignes relues » est le respect des règles de la voix par
   le modèle : pas de mise en forme, des réponses courtes, la phrase d'attente, le français ; un compteur d'écarts de
   forme ajouté aux scènes le mesure. Si un écart apparaît, les consignes se corrigent et la mesure se rejoue. Les
   chiffres sur Anthropic sont écrits ici, à côté de ceux d'OpenAI. Tâches 5 et 8.
7. **Le choix du modèle** est posé à CrOliX sur ces chiffres, dans l'ordre de la décision (a) ; il lui revient.
   Tâche 9.
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

1. - [ ] **La mesure réelle, avant tout code** (`dev-core`, hors dépôt ; dans le budget de la décision (d)). Un script
   jetable, hors du dépôt, sur le SDK officiel, la clé dans une variable propre au script, jamais affichée ni écrite.
   Sur Claude Haiku 5.5, Claude Sonnet 5.5, et le modèle d'OpenAI en service pour comparer le même jour :
   - un appel en flux, puis vingt pour le **premier mot et la fin de la première phrase**, prompt de la taille d'un
     vrai tour (environ 3 000 jetons), au raisonnement le plus bas que le modèle accepte pour la voix ;
   - les formes réelles du fil : il commence par l'assistant, deux tours du même rôle, un texte vide ;
   - les vrais outils de la conversation : confier à un poste, relire sa journée, lire une carte, trancher une carte
     (une permission : l'appel doit sortir intact) ;
   - une annulation au milieu d'un flux, et ce qui est rendu ;
   - les limites de jetons du core, raisonnement compris ;
   - chaque schéma structuré du core, mots-clés retirés comme le fera le module, et la réponse passée à la validation
     du core ;
   - une clé fausse ; les noms exacts des réglages de raisonnement et d'effort acceptés ; le décompte des jetons
     d'entrée, lus et écrits en cache ; le rapport des jetons comptés entre les deux fournisseurs sur le même prompt.

   Il enregistre un flux de chaque sorte pour le faux de la tâche 4. **Coût attendu : moins de 2 dollars.**
   **Seuil d'arrêt** : si, pour chaque modèle de Claude, la médiane du premier mot ou celle de la fin de la première
   phrase dépasse celle d'OpenAI du même jour de plus de 0,2 s, le plan revient à CrOliX. Un schéma refusé n'arrête
   pas le plan : la tâche 4 le traite. Résultat écrit ici, « La mesure réelle ».
2. - [ ] **La liste, la paire, la clé par fournisseur, le crédit** (`dev-core` ; en parallèle de 4). La liste à un
   seul endroit ; la paire fournisseur et modèle, validée d'un bloc côté serveur, lue d'une seule lecture à chaque
   appel ; la clé de chaque fournisseur (rangée chiffrée, vérifiée, échéance et alertes, refus et retour, nouvelle clé
   prise sans redémarrage) ; la commande de la clé prend le fournisseur, OpenAI à défaut ; l'événement de crédit
   épuisé et de crédit revenu, qui nomme le fournisseur, une fois par changement d'état, même après un redémarrage.
   Les textes vus de l'utilisateur prennent le nom affiché : avec OpenAI, mot pour mot ceux d'aujourd'hui. **Le garde
   de la tâche 7 s'écrit ici, rouge** (`testeur`), et passe au vert au fil des tâches 2, 3, 5 et 6. Tests nouveaux :
   une base d'aujourd'hui s'ouvre, sert OpenAI, garde sa clé, son modèle et ses coûts ; deux clés, chacune avec son
   échéance et son alerte ; un refus et un crédit épuisé nomment leur fournisseur ; changer la paire pendant une nuit
   ne mélange jamais l'un et l'autre. **Exclu** : les prix (3), l'écran (6), tout retour automatique (décision (e)).
3. - [ ] **Les prix et les réglages des modèles** (`dev-core` ; après 2 et 4). La table de chaque fournisseur dans la
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
4. - [ ] **Le module d'Anthropic, son faux, et le service par lui** (`testeur` pour le faux et les tests, `dev-core`
   pour le module ; en parallèle de 2). Derrière l'interface existante : le flux (texte, outils en texte JSON, bilan
   de jetons, réponse coupée, annulation), la réponse structurée par format de sortie, les mots-clés de schéma non
   pris en charge retirés, les trois sortes d'erreur, la réponse refusée, le système à part, les formes réelles du
   fil, aucune relance du SDK, sa clé et son adresse passées par lui. Seul changement de l'interface : un champ
   facultatif au bilan, les jetons écrits en cache. Le faux rejoue les flux de la tâche 1. Tests : chacun de ces
   comportements ; puis, sur ce faux, une réponse phrase par phrase, une délégation avec sa phrase d'attente et son
   second appel, relire sa journée, lire puis trancher une carte, l'annulation, la coupure, une étape de la nuit et la
   lettre du matin en réponse structurée, puis en échec dit. **Exclu** : le cache, tout effort hors de la table.
5. - [ ] **Les outils de mesure sur l'un ou l'autre** (`dev-core` ; après 3, en parallèle de 6). Le premier mot, la
   phrase d'attente et les scènes prennent le fournisseur, la clé et le modèle de variables propres à chaque outil, et
   créent le module par la liste ; aucun ne nomme plus un fournisseur ni un modèle par défaut. Le premier mot mesure
   aussi la fin de la première phrase, coupée comme la voix la coupe ; sur un fournisseur sans cache rendu, il ne joue
   que les mesures qui ne dépendent pas du cache. Les scènes gagnent le compteur d'écarts de forme du critère 6, à
   côté de celui des tics. Chaque outil garde son essai à blanc. Tests : l'essai à blanc de chaque outil sur chacun
   des deux fournisseurs ; le compteur sur des réponses inventées.
6. - [ ] **L'écran** (`dev-front` ; après 3, en parallèle de 5). Dans l'Atelier, le choix du fournisseur parmi la
   liste que rend le core ; une carte de clé par fournisseur, comme les postes montrent la leur ; le modèle, champ
   libre, prérempli au changement de fournisseur, envoyé avec lui. L'écran des dépenses dit le fournisseur et le
   modèle de la dépense de Natsume du jour, et une ligne par fournisseur s'il y en a eu deux. Aucun nom de fournisseur
   écrit dans l'écran. Vérifié dans Chrome sur le laptop, à la DA du kit ([`design.md`](../../standards/design.md)).
   Tests nouveaux : un et deux fournisseurs, une clé refusée, une paire refusée. **Exclu** : une liste de modèles.
7. - [ ] **Le garde au vert** (`testeur` ; après 5 et 6). Écrit à la tâche 2, il échoue sur `main` et passe sur la
   branche ; sa liste de fichiers permis est courte et chaque entrée dit pourquoi.
8. - [ ] **Les mesures sur les vrais modèles, et une nuit réelle** (`testeur`, depuis le laptop ; dans le budget de
   la décision (d)). Les quatre mesures sur Claude Haiku 5.5, Claude Sonnet 5.5 et OpenAI, le même jour, à réseau
   égal. Le premier mot y est celui de l'outil : pas de nouvelle série à part de celle de la tâche 1. Puis une nuit et
   une lettre du matin jouées contre Anthropic sur une base de test amorcée. **Coût attendu**, aux prix lus le 20/11 à
   vérifier : de l'ordre de 0,30 dollar pour Haiku, de 3 pour Sonnet, de 0,30 pour OpenAI, la nuit comprise.
9. - [ ] **Le choix posé à CrOliX, la doc et la livraison** (le manager, puis le livreur). Les chiffres de la tâche 8,
   le coût d'une journée par modèle, la recommandation, le choix de CrOliX écrit ici. Le README du core et son
   exemple d'environnement disent les deux fournisseurs et le prix du modèle retenu ; la page de mise en service du
   NAS, qui viendra avec son chantier ([ADR 0014](../../adr/0014-mvp-sur-le-nas.md)), le reprendra. Le fournisseur en
   service ne change qu'après le choix, par l'écran. PR en brouillon, ce plan coché.

## La mesure réelle (tâche 1)

À remplir.

## Les mesures (tâche 8)

À remplir, OpenAI rejoué le même jour.

| Modèle | Premier mot | Fin de la 1re phrase | Phrase d'attente | Écarts de forme | Scènes | Une journée |
|---|---|---|---|---|---|---|
| OpenAI, modèle en service | | | | | | |
| Claude Haiku 5.5 | | | | | | |
| Claude Sonnet 5.5 | | | | | | |

**Une journée**, repricée depuis la base du laptop (une requête, sans code, le 20/11). Chaque appel y est compté, le
second appel d'une délégation, la parole d'elle-même et le rituel compris. La base est mince : deux jours de
conversation en octobre, avant l'identité et la situation (environ 980 jetons d'entrée par réponse, contre environ
2 950 pour un vrai tour mesuré le 10/11). Son jour le plus chargé : 14 réponses, 19 000 jetons d'entrée et 1 169 de
sortie, 0,0025 dollar ; sa nuit la plus chargée, 42 appels, 0,0039 dollar. Les prix lus le 20/11, à vérifier, donnent :

| Modèle | Prix par million, entrée et sortie | Ce jour-là, conversation et nuit | Cent tours d'un vrai prompt |
|---|---|---|---|
| OpenAI, modèle en service | 0,10 et 0,50 | 0,006 | 0,04 |
| Claude Haiku 5.5 | 0,10 et 0,50 | 0,006 | 0,04 |
| Claude Sonnet 5.5 | 2 et 10 | 0,13 | 0,75 |

La nuit est bornée par le rapport des prix de sortie. Trois inconnues s'y ajoutent, que la tâche 1 mesure : le
raisonnement, facturé en sortie ; le rapport des jetons comptés par les deux fournisseurs pour un même texte ; et une
base plus représentative, celle du rodage, sur laquelle la même requête se rejoue à la tâche 9.

## Décisions de CrOliX, le 20/11

Tranchées une à une, le 20/11.

**(a) Les modèles à mesurer et l'ordre du jugement.** **Claude Haiku 5.5 et Claude Sonnet 5.5, contre OpenAI le même
jour**, sans Opus. On juge dans cet ordre : le premier mot et la fin de la première phrase (au plus OpenAI du même
jour plus 0,2 s) ; le taux de phrase d'attente ; le respect des règles de la voix et le français ; les scènes ; le
coût d'une journée. **Le choix final revient à CrOliX, sur les chiffres** (tâche 9).

**(b) Le raisonnement et l'effort.** **Une donnée par modèle, une valeur pour la voix et une pour la nuit,
surchargeable par l'instance ; rien à l'écran.** La valeur de la voix se fixe sur la mesure du premier mot (tâche 1).

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

- **Les prix et les noms de réglage d'Anthropic** de ce plan viennent d'une table de référence du 03/11, non relue sur
  la page d'Anthropic : les tâches 1 et 3 les relisent.
- **Le coût d'une journée** vient d'une base mince ; il se rejoue sur une base du rodage.
- **Le premier mot mesuré du laptop** n'est que la part du modèle et du réseau ; la cible de 2,5 s se juge de bout en
  bout.
