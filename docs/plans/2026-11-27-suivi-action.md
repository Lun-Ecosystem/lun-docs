# Le suivi d'une action, de la demande au résultat. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-docs#238 (`niveau:critique`) ; la part privée dans Lun-Ecosystem/lun-anima#169.
>
> **État :** rédigé puis contesté le 27/11 (voir « La contestation »). Réponses de CrOliX du 27/11 intégrées : les
> noms d'agent, les pastilles « Refusée » et « Retirée », la limite du critère 6 acceptée. Exécution lancée avec son
> accord (« tu peux lancer »).
>
> **Source :** la [carte des flux relevée](../specs/2026-11-27-carte-des-flux-relevee.md), décisions F1 et F5 (§ 9),
> trous T1, T2, T5, T6, T17, T18, T35, T39 ; le constat de prod du 27/11 (Lun-Ecosystem/lun-anima#166).
>
> Code relu sur `main` : Lun'Anima `dc130d9` (0.4.1), lun-acedia `40c293f`, lun-avaritia `bd6f7cf`, lun-docs
> `06b28b4`. Le graphe d'abord, puis chaque point dans le code. Lun'Anima est privé : ce plan dit son comportement ;
> ses fichiers et ses lignes sont dans un commentaire de lun-anima#169
> ([`securite.md`](../../standards/securite.md), « Dépôts publics »).

**But :** CrOliX suit une action dans une seule entrée du Journal, de sa demande à son résultat. La chaîne dit vrai
sur qui a tranché et où.

## Critères de fin

Validés le 27/11, périmètre figé.

1. Une demande confiée à un poste qui rend une carte laisse une seule entrée au Journal. Sa chaîne porte, dans
   l'ordre : demandé (voix ou conversation), confié au poste, proposé, le geste avec son lieu, puis fait, ou échec
   avec son motif.
2. Une carte née sans demande (proposition de tri, fiche de la bibliothèque) a une seule entrée, avec les mêmes
   dernières étapes.
3. « Tranchée dans Lun'Acedia » ne s'écrit plus pour une carte validée depuis le core, même si le core relit le poste
   avant sa réponse. Un test rejoue la course de lun-anima#166.
4. Une carte tranchée dans l'écran de Lun'Acedia ou de Lun'Avaritia déclenche un signal ; le core relit aussitôt et
   écrit « Validée dans… » ou « Refusée dans… ».
5. Une carte qui disparaît sans décision (le mail a quitté la boîte par Gmail) n'écrit plus « Tranchée » : la chaîne
   dit qu'elle a été retirée par le poste.
6. L'échec d'un geste revient dans la conversation, sur toutes les surfaces. Un succès n'y écrit rien.
7. « Confié à » ne s'affiche que si la demande est partie, et un échec nomme le poste par son nom, pas par son
   identifiant.
8. La pastille de l'entrée dit son état (à trancher, en cours, fait, échec), prouvé par une capture du panneau au
   bureau et à 390 px.

## Dépôts, branches, issues

| Dépôt | Branche | Issue | Niveau | Tâches |
|---|---|---|---|---|
| lun-docs | `docs/suivi-action` | #238 | `critique` | D1 à D4 |
| Lun'Anima | `feat/suivi-action` | lun-anima#169 | `critique` | Lun'Anima : 7 tâches, lun-anima#169 |
| lun-acedia | `feat/suivi-action` | Lun-Ecosystem/lun-acedia#126 | `critique` | A1 |
| lun-avaritia | `feat/suivi-action` | Lun-Ecosystem/lun-avaritia#54 | `critique` | V1 |

Une PR par dépôt, en brouillon. Ordre de fusion : lun-docs (le contrat 1.6), les deux satellites, puis le core.

**Ordre de déploiement : le core d'abord, ou le même soir que Lun'Acedia. Jamais Lun'Acedia 1.6 seule** (voir « Le
contrat change »). Seul `main` fusionné se déploie : ce chantier et #239 ajoutent chacun au schéma du core, et la
seconde PR se rebase sur la première.

## Ce que le code fait aujourd'hui

### Dans le core (le comportement ; le détail est dans lun-anima#169)

- **Deux entrées pour une action.** Une délégation écrit son entrée après la réponse du poste : « Confié à… », puis
  « Carte rendue : <titre>. », issue « Fait ». L'identifiant de la carte rendue n'est pas gardé. À la lecture
  suivante, la carte n'a pas d'entrée : une seconde naît, « Lun'Acedia propose. », à trancher. Le geste s'écrit sur
  la seconde.
- **« Tranchée dans » est déduit.** Toute carte en attente à une lecture et absente de la suivante reçoit
  « Tranchée dans <poste>. ». Le core ne regarde ni si un de ses gestes est en vol, ni pourquoi la carte est partie :
  il ne lit que les cartes en attente et ne connaît jamais l'état final.
- **La course du 27/11.** Un événement du poste déclenche une lecture 50 ms après. Le relais du geste attend la
  réponse du poste, jusqu'à 15 s. Lun'Acedia émet pendant l'exécution, avant de répondre : la lecture écrit
  « Tranchée dans Lun'Acedia. », puis la réponse ajoute « Validée depuis la file. ». Le core sait pourtant, à ce
  moment, qu'un geste est en vol sur cette carte : il s'en sert déjà pour la cacher de la file.
- **Le lieu est perdu.** Le geste garde son origine (le Bureau, À trancher, la conversation, la voix), mais le
  Journal ramène les deux premières à « depuis la file ». Une seule étape dit le geste et son effet.
- **L'échec du geste** n'est dit qu'à l'écran qui a cliqué. Sur un délai dépassé, rien n'est écrit au Journal et
  la raison affirme « rien n'a été fait » alors que le délai coupe l'attente, pas le travail.
- **« Confié à »** s'affiche aussi quand la délégation a échoué, et la phrase d'échec nomme le poste par son
  identifiant (« lunacedia injoignable »).
- **La pastille** connaît six issues : à trancher, tranchée, vue, fait, échoué, sautée. Aucune ne dit « en cours ».

### Dans Lun'Acedia

- **Ce qui part déjà vers le core.** Un geste du core sur une proposition de tri émet un événement `log`
  `mail.changed` avant de répondre (`server/src/contract/routes.ts:166-178`). Un geste sur une carte de l'agent
  passe par `decideCard`, qui exécute, puis relance le modèle (`resume`) dans la même requête
  (`server/src/pina/agent.ts:169-197`, `:196`). Il n'émet rien lui-même ; l'action exécutée peut émettre (l'agenda,
  `server/src/agenda/calendar.ts:307`) : c'est ce signal, parti avant la réponse, qui a fait la course du 27/11.
- **Ce qui ne part pas.** Une proposition tranchée dans l'écran passe par `/mail/:id/validate|refuse|correct`
  (`server/src/triage/routes.ts:92-110`) vers `validate`, `refuse`, `correct` (`server/src/triage/pipeline.ts:450`,
  `:463`, `:505`) : aucun événement. Une carte de l'agent tranchée dans l'écran (`server/src/pina/routes.ts:54`) :
  aucun événement.
- **Le mail parti par Gmail.** La synchronisation émet `mail.changed` (`server/src/gmail/sync.ts:223-229`). La
  proposition sort des cartes en attente, qui ne servent que les mails encore en réception
  (`server/src/contract/routes.ts:118-125`). Son statut reste « en attente » : c'est le T35.
- **L'état final.** `GET /lun/v1/cards?status=done|refused` ne sert que les cartes de l'agent : une proposition
  tranchée n'y est pas (`server/src/contract/routes.ts:316-328`, et son `shortcut`). Aucune route ne lit une carte
  seule. Une proposition porte son statut (`pending`, `auto`, `accepted`, `corrected`, `refused`,
  `server/src/types.ts:16`).
- **La réponse au geste** ne porte que `{ card }` (`server/src/contract/routes.ts:346-379`) : la phrase de l'agent
  après la décision reste chez lui (T1).
- Contrat déclaré : `1.5` (`server/src/identity.ts:2`).

### Dans Lun'Avaritia

- Contrat déclaré : `1.4` (`server/src/identity.ts:5`).
- **Son écran tranche par les routes du contrat** : `POST /lun/v1/cards/:id/accept|refuse`
  (`app/src/screens/Valider.svelte:83`, `server/src/contract/routes.ts:205-208`). Il annule un refus de moins de
  30 s par `/api/drafts/:id/restore` (`server/src/brain/routes.ts:75-84`, `server/src/brain/drafts.ts:334-346`).
- **Aucun événement** pour une fiche tranchée, d'où que vienne le geste : `emitEvent` n'est appelé que pour la
  sauvegarde et les clés (`server/src/backup.ts:82`, `server/src/llm/keys.ts:226`, `:243`,
  `server/src/keys/expiry.ts:65`).
- **L'état final** se lit déjà par statut (`server/src/contract/routes.ts:174-184`), pas carte par carte. La file
  servie s'arrête au plafond de la file (15 par défaut) : une fiche au-delà n'est pas « en attente » pour le core.
- **Le corps du geste** n'est pas strict (`server/src/contract/routes.ts:36`) : un `values` est ignoré sans erreur,
  là où le contrat 1.5 veut un 400.

## Les choix

### Une entrée par action

Le core garde l'identifiant de chaque carte rendue par une délégation, et lie l'entrée de la délégation à ses
cartes. La lecture qui trouve ensuite la carte en attente reconnaît l'entrée : aucune seconde entrée ne naît. Le
passage de la carte par la porte d'attention, lui, reste une fois par carte, comme aujourd'hui.

**La lecture peut passer avant la réponse.** Une délégation attend son poste jusqu'à 120 s, et une lecture peut
tomber pendant ce temps : la carte a alors déjà son entrée « propose ». À sa réponse, la délégation reprend cette
entrée au lieu d'en ouvrir une seconde, et y écrit ses étapes à leur date.

Le lien est un ajout au schéma du core, par une migration qui ne réécrit rien. **Les entrées déjà écrites ne sont
pas réécrites** : les anciennes paires et les anciens « Tranchée dans » se lisent comme avant. Une exception, dite
ici : à la première lecture après le déploiement, une ancienne entrée encore à trancher dont la carte n'attend plus
reçoit l'étape de son état réel.

Le domaine des issues s'élargit (voir « La pastille ») : la migration reconstruit la table du Journal, entrées et
étapes gardées. Le retour à la version d'avant reste possible, l'ancien code ignorant les ajouts, mais il
afficherait mal une entrée « Refusée » ou « Retirée ». Une copie de la base avant le déploiement fait partie de la
marche.

Une délégation qui rend une carte est à trancher tant que sa carte attend. Une délégation qui rend plusieurs cartes
reste à trancher tant que l'une attend. Une délégation sans carte reste « Fait ».

### La carte qui disparaît

Le core ne déduit plus. Quand une carte attendue manque à sa lecture :

1. un geste du core est en vol sur elle : il ne fait rien, le relais écrira. Ce test se refait au moment d'écrire,
   après la lecture chez le poste, pas seulement en dressant la liste ;
2. sinon, il lit la carte chez le poste, par la route nouvelle du contrat 1.6, et écrit ce qu'elle est devenue :
   validée ou refusée dans le poste, en échec, retirée sans décision, ou encore en attente (cachée par le plafond de
   la file du poste) ;
3. un poste sous 1.6 : « Plus en attente chez <poste>. », sans pastille. Vrai, et sans rien affirmer.

La liste des cartes manquantes part des entrées encore à trancher, pas de la comparaison de deux lectures : une carte
laissée au relais pendant une lecture n'est pas perdue à la suivante. Une entrée retirée ou « plus en attente »
quitte « à trancher » : elle n'est pas relue à chaque passe. Les cartes encore en attente mais cachées par le plafond
du poste sont relues à tour de rôle, un nombre borné par passe.

### Le signal (F5)

Un poste 1.6 émet un événement d'importance `log` chaque fois qu'une carte quitte l'attente, que le geste vienne du
core, de son écran, d'une action du catalogue, ou qu'elle soit retirée. L'événement ne porte pas la décision. Le core
relit déjà tout poste dans les 50 ms qui suivent un événement : aucun flux nouveau, et un événement `log` n'entre
pas au Journal. Lun'Acedia réutilise `mail.changed` pour les propositions, comme aujourd'hui pour un geste du core.

Le signal part quand une carte a changé d'état, jamais à chaque lecture : sinon une lecture du core en déclencherait
une autre, sans fin.

### Le geste, son lieu, son résultat

Le Journal dit le lieu tel que le geste l'a gardé : le Bureau, À trancher, la conversation, la voix. Deux étapes : le
geste, daté du geste, puis le résultat, daté de la réponse. Sur un délai, une étape le dit sans conclure ; la
lecture suivante écrit le résultat, avec le lieu du geste du core, pas « dans le poste ».

Un échec part dans la conversation, une phrase par geste (un lot de trois cartes dont deux échouent : une phrase).
Écrite, sans voix, elle arrive dans le fil de chaque surface : le panneau, et le fil de la fenêtre de Lun'Luxuria
(`src/session.svelte.ts:470` recharge le fil à chaque message). Fil fermé, la scène de Lun'Luxuria ne montre que ce
qui est dit : l'échec dit à voix haute appartient à #241. Un succès n'écrit rien.

### La pastille

| État | Pastille | Quand |
|---|---|---|
| À trancher | « À trancher » | une carte attend |
| En cours | « En cours » | un geste du core est en vol (calculé à la lecture, rien n'est écrit) |
| Fait | « Fait » | validée, corrigée, réponse donnée, brouillon créé ; une délégation sans carte |
| Échec | « Échoué » | le poste a rendu un échec, avec son motif |
| Refusée | « Refusée » | refusée, au core ou dans le poste |
| Retirée | « Retirée » | retirée par le poste, sans décision |
| Inconnu | aucune | un poste sous 1.6 : « Plus en attente chez <poste>. » |

Décidé par CrOliX le 27/11 : « Refusée » et « Retirée » ont leur pastille. Le domaine des issues s'élargit donc, et
la table du Journal est reconstruite sur la base en service. Sa raison : la base du NAS sera nettoyée une fois le
MVP propre, avant une version 1.0.0 de chaque projet. « Tranchée » reste pour les entrées déjà écrites.

## Les mots, étape par étape

**Le registre** est neutre : le Journal et la phrase d'échec sont écrits par le code, qui ne dit jamais « je » ni
« tu » ([`ecriture.md`](../../standards/ecriture.md), décidé le 25/11).

**Les noms**, décidés par CrOliX le 27/11 : « plus nommer l'agent et non le satellite (si mon agent est John alors
c'est proposé par John) ». Qui agit porte le nom de son agent, tel que le poste le déclare dans sa santé
(`agentName`) ; sans nom déclaré, le nom du poste. Lu ainsi, à confirmer à la recette : un lieu garde le nom du
poste (« Validée dans Lun'Acedia » : c'est son écran), comme un poste injoignable.

| Étape | Mots |
|---|---|
| Demandé, à la voix | Demandé à la voix. |
| Demandé, par écrit | Demandé par écrit. |
| Demandé, « C'est fait » au Bureau | Demandé depuis le Bureau. |
| Confié | Confié à <agent>. |
| Proposé, après une demande | Proposé par <agent> : <titre>. |
| Proposé, sans demande | <agent> propose. |
| Geste au core | Validée depuis le Bureau. / … depuis À trancher. / … dans la conversation. / … à la voix. |
| Corrigée | Corrigée depuis le Bureau (Boîte : Factures). |
| Refusée | Refusée depuis le Bureau. |
| Réponse donnée | Réponse donnée depuis le Bureau : <réponse>. |
| Geste chez le poste | Validée dans <poste>. / Refusée dans <poste>. |
| Fait | Fait. / Brouillon créé. |
| Échec | Échec : <motif>. |
| Délai du geste | Sans réponse de <agent> à temps : résultat à relire. |
| Retirée | Retirée par <agent>, sans décision. |
| Poste sous 1.6 | Plus en attente chez <poste>. |
| Délégation, délai | <agent> n'a pas répondu à temps : rien n'est confirmé. |
| Conversation, un échec | Échec sur « <titre> » : <motif>. |
| Conversation, plusieurs | Échec sur 2 cartes : « <titre> » (<motif>) ; « <titre> » (<motif>). |

Les entrées déjà écrites gardent leurs mots (« Lun'Acedia propose. »).

Le motif est celui du poste quand il en donne un, sinon celui du core (« Lun'Acedia injoignable »), toujours avec le
nom du poste. « C'est noté », dit avant l'effet, ne change pas.

## Le contrat change : v1.6

Additif, sans rupture. Le texte à modifier dans [`contrat-satellite.md`](../../standards/contrat-satellite.md) :

- **En-tête** : « Version du contrat : **v1.6**. »
- **Routes**, une ligne après `GET /lun/v1/cards` : « `GET /lun/v1/cards/:id` | une carte, quel que soit son statut |
  `{ card: Card }` ».
- **Types**, commentaire de `Health` : « contract : version du contrat servie, `'1.6'` ».
- **Comportements**, à la fin de « Cartes » : « Un poste 1.6 émet un événement d'importance `log` chaque fois
  qu'une carte quitte l'attente, d'où que vienne la décision (le core, son écran, une action) ou quand il la retire.
  L'événement ne porte pas la décision : le core relit la carte par `GET /lun/v1/cards/:id`. Une carte retirée sans
  décision (son objet a disparu, son jour est passé) se lit `expired`. »
- **Erreurs**, 404 : « carte inconnue » vaut aussi pour `GET /lun/v1/cards/:id`.
- **Versionnement**, à la fin : « La v1.6 ajoute `GET /lun/v1/cards/:id` et l'événement `log` d'une carte qui quitte
  l'attente. Un poste qui déclare `1.6` tient aussi tout ce que demande la 1.5. »

**Un core plus ancien** face à un poste 1.6 : il ne connaît pas la route ; il relit à chaque événement et écrit
encore « Tranchée dans » quand la carte manque. **Cet ordre dégrade** : Lun'Acedia 1.6 signale chaque carte de son
agent avant de relancer son modèle, donc avant de répondre. Face à l'ancien core, la course de lun-anima#166
toucherait toutes les cartes de l'agent, plus seulement celles de l'agenda. D'où l'ordre de déploiement.

**Un poste plus ancien** face au core nouveau : le core ne l'appelle pas sur la route ; une carte qui manque écrit
« Plus en attente chez <poste>. ». La course de lun-anima#166 est réglée sans lui : le core ne regarde plus une carte
dont un de ses gestes est en vol. Lun'Avaritia déclare la 1.4 : elle passe à la 1.6 dans ce chantier, donc doit
tenir la 1.5 (V1 en fait la liste).

## Tâches

Les tests d'abord, vus en échec, puis le code (`standards/qualite.md`, « Tests »). **Partent en parallèle** : D1, D2,
D3, A1, V1 et les tâches C1 et C4 du core. A1 et V1 suivent le texte du contrat de ce plan, sans attendre la fusion de
D1. Le reste du core suit l'ordre dit dans lun-anima#169.

### lun-docs

- [x] **D1. Le contrat 1.6.** Agent ordinaire.
  - Fichiers : `standards/contrat-satellite.md`, puis `npm run sync` (la copie du plugin).
  - Comportement : le texte de « Le contrat change », mot pour mot ou mieux dit, sans changer le sens.
  - Exclu : toute autre retouche du contrat (la phrase sur `agent` et les événements, relevée le 25/11).
  - Preuve : `npm run check` et `npm run sync:check` verts.
- [x] **D2. La feuille de route.** Agent ordinaire.
  - Fichier : `docs/plans/2026-11-07-feuille-de-route-mvp.md`.
  - Comportement : au § 1, « Au 27/11 » dit la carte des flux relevée et le tri en cinq chantiers. Au § 3, une
    section de l'ordre décidé par CrOliX le 27/11 : ce chantier (#238) et « la nuit et la lettre du matin » (#239)
    passent avant la semaine de rodage ; « ce qu'il faut pour lancer une action » (#242) se cadre en parallèle ;
    « l'attention sur plusieurs surfaces » (#240) et « la parole rend compte » (#241) attendent le desktop.
  - Exclu : rouvrir un autre rang.
- [x] **D3. Les deux issues `inbox`** : #245 (T1) et Lun-Ecosystem/lun-anima#170 (T18).
  - T1, sur lun-docs : la phrase de l'agent du poste après une carte tranchée reste chez lui. Elle touche le contrat
    (la réponse au geste), Lun'Acedia et le core.
  - T18, sur Lun-Ecosystem/lun-anima (privée) : « valide » dit trop tôt sur une carte tout juste préparée.
  - Plus une ligne dans chacune des deux issues des satellites : la carte revenue en attente après une annulation
    (Lun'Acedia, l'annulation d'une décision ; Lun'Avaritia, le refus repris dans les 30 s).
- [ ] **D4. Le plan coché**, ses preuves et ce que l'exécution a trouvé, à la fin.

### Lun'Anima

Lun'Anima : 7 tâches, lun-anima#169. En bref : une entrée par action ; la carte qui disparaît ; le geste, son lieu,
son résultat, son échec dans la conversation ; « Confié à » et le nom du poste ; le Journal à l'écran (la pastille) ;
la preuve de bout en bout ; la relecture.

### lun-acedia

- [ ] **A1. Lire une carte, et signaler qu'elle part.** Agent ordinaire pour le serveur, tests par `lun:testeur`.
  - Fichiers : `server/src/contract/routes.ts`, `server/src/triage/pipeline.ts`, `server/src/pina/agent.ts`,
    `server/src/pina/store.ts` si l'expiration y vit, `server/src/identity.ts`, `server/src/contract/parity.ts`
    si la route y entre, leurs tests.
  - Comportement :
    - `GET /lun/v1/cards/:id`. `mail:<id>` : la proposition, `pending` si elle est servie en attente, `done` si
      acceptée ou corrigée, `refused` si refusée, `expired` si elle est encore en attente mais que son mail a quitté
      la réception. Un mail rangé seul (`auto`) n'est pas une carte : 404. Sinon la carte de l'agent, telle que
      `/cards` la sert. 404 pour une carte inconnue.
    - Le signal d'une proposition : `mail.changed`, `log`, émis par `validate`, `refuse` et `correct` après leur
      succès ; celui de `decideProposal` (`routes.ts:166-178`) est retiré, pour un seul signal par décision. L'écran,
      le catalogue et le core passent ainsi tous par lui.
    - Le signal d'une carte de l'agent : un événement `log`, émis par `decideCard` dès la décision prise, avant la
      relance du modèle (`agent.ts:191-196`). Titre neutre, sans la décision. Une carte exécutée en échec
      (`failed`) a quitté l'attente : elle signale. Un geste refusé par une erreur 4xx n'a rien changé : rien.
    - Un mail rangé à la main tranche sa proposition sans passer par `validate` (`onManualFile`,
      `pipeline.ts:534-541`, appelé par l'écran et par `mail.file` du catalogue) : le même signal, seulement si
      la proposition a changé d'état.
    - L'expiration (`expireCards`, au rangement du jour et dans `GET /lun/v1/cards`, `routes.ts:320`) : un signal
      seulement si une carte a réellement expiré. Jamais à chaque lecture : ce serait une boucle avec le core.
    - `CONTRACT = '1.6'`.
  - Tests : la route sur chaque statut, une proposition dont le mail est parti, une carte inconnue, un jeton
    absent ; une proposition validée, corrigée, refusée dans l'écran : un signal chacune ; la même par le contrat :
    un seul signal ; une carte de l'agent tranchée dans l'écran : un signal, émis avant la reprise du modèle ; un
    mail rangé à la main : un signal ; une carte exécutée en `failed` : un signal ; un geste en 4xx : aucun ; deux
    lectures de `/cards` de suite sans carte à expirer : aucun signal.
  - Cas limites : une carte de l'agent d'un autre jour se lit `expired` ; une proposition repassée en rangement
    seul se lit 404.
  - Exclu : T1 (la phrase de l'agent) ; l'annulation d'une décision ; le seuil de la validation groupée.
  - Preuve : `npm test` vert, sortie dans la PR.

### lun-avaritia

- [ ] **V1. Lire une fiche, signaler qu'elle part, déclarer la 1.6.** Agent ordinaire, tests par `lun:testeur`.
  - Fichiers : `server/src/contract/routes.ts`, `server/src/brain/drafts.ts`, `server/src/identity.ts`, leurs tests.
  - Comportement :
    - `GET /lun/v1/cards/:id` : la fiche par `cardOf`, quel que soit son statut ; 404 inconnue.
    - Un événement `log` à chaque fiche qui quitte l'attente : acceptée, refusée (`applyDraft`, `refuseDraft`,
      `drafts.ts:281`, `:322`). L'écran passe par les mêmes routes : un seul point d'émission. Un refus repris
      (`restoreDraft`, `:334`) émet aussi, la fiche revenant en attente.
    - Ce que la 1.5 demande, vérifié un à un : `values` au geste vaut 400 (aucune fiche n'a de `fields`) ; `/cards`
      ne dépend pas de `agent` ; `boxes` est ignoré par `day.digest` ; aucun événement « en attente » en double.
      C'est du périmètre que la 1.6 entraîne, nommé ici : petit (un corps de geste strict), pas un chantier.
    - `CONTRACT = '1.6'`.
  - Tests : la route ; une fiche acceptée et une refusée : un signal chacune ; une reprise : un signal ; `values` :
    400 ; `health` dit `1.6`.
  - Exclu : le plafond de la file (lun-avaritia#53) ; le plafond de coût (lun-avaritia#52).
  - Preuve : `npm test` vert, sortie dans la PR.

## T1, T6, T17, T18 : tranchés ici

- **T1 sort en `inbox`** (D3). La réponse au geste ne porte que la carte (`server/src/contract/routes.ts:346-379`
  chez Lun'Acedia) ; la phrase écrite par la reprise du modèle reste dans son fil. La rapporter demande un champ du
  contrat, un appel de plus chez Lun'Acedia et un affichage : aucun critère n'en dépend.
- **T6 tombe avec les critères 3 et 6.** Le motif d'un délai ne dit plus « rien n'a été fait », pour un geste comme
  pour une délégation ; après un délai, la lecture de l'état final écrit le vrai résultat, au lieu du geste. Reste
  hors périmètre : une relance après un délai peut faire un doublon chez le poste (dans « Limites »).
- **T17 tombe avec le critère 8.** La carte n'est cachée que pendant le geste en vol, puis jusqu'à la lecture
  relancée à la fin du geste (correction du § 10 de la carte). Cette fenêtre devient l'état « En cours », lu par la
  même requête : la pastille la montre au lieu de la taire.
- **T18 sort en `inbox`** (D3), sur Lun'Anima. Il touche la règle qui laisse la conversation trancher une carte,
  une règle de garde, et aucun critère ne la demande.

## La preuve de bout en bout, dans les PR

- **Le core** : la course de lun-anima#166 rejouée par un test, avec un faux poste 1.6 qui émet avant de répondre ;
  une action demandée par écrit, validée depuis le Bureau, relue au Journal : une entrée, ses étapes dans l'ordre ;
  une carte tranchée dans l'écran d'un poste ; une carte retirée ; un échec rendu dans le fil. Les captures du
  panneau au bureau et à 390 px : à trancher, en cours, fait, échec, refusée, retirée.
- **Les satellites** : leurs tests, et un relevé du flux d'événements pendant un geste fait dans leur écran.
- **Sur le NAS, après déploiement** (CrOliX) : demander un créneau à Natsume, le valider depuis le Bureau, lire
  l'entrée ; trancher une proposition dans l'écran de Lun'Acedia et une fiche dans celui de Lun'Avaritia, lire le
  Journal du core.

## La contestation, le 27/11

Le plan a été attaqué par `lun:plan-challenger`, code relu. Chaque objection est intégrée ou réfutée ici ; le
détail des objections qui touchent le core est dans lun-anima#169.

| Objection | Réponse |
|---|---|
| Une lecture pendant la délégation donne deux entrées | Intégrée : la délégation reprend l'entrée déjà née |
| Lun'Acedia 1.6 seule aggrave la course face à l'ancien core | Intégrée : ordre de déploiement |
| A1 n'émet pas partout où le contrat le promet | Intégrée : rangement à la main, expiration, carte en échec |
| La garde « geste en vol » doit se tester au moment d'écrire | Intégrée |
| Une entrée retirée serait relue et réécrite à chaque passe | Intégrée : elle quitte « à trancher » |
| La première passe touche d'anciennes entrées | Intégrée : dit dans « Une entrée par action » |
| Le plafond d'un poste cache toujours les mêmes cartes | Intégrée : relecture à tour de rôle ; limite nommée |
| Le contrat 1.6 n'est pas indispensable | Réfutée : lire les cartes tranchées par listes grossit sans fin, et |
| | Lun'Acedia ne sert pas ses propositions tranchées. La route d'une carte reste le plus petit ajout |
| Le critère 6 n'est tenu que dans le fil pour Lun'Luxuria | Intégrée, et posée à CrOliX : voir « Limites » |
| Deux chantiers, deux ajouts au schéma | Intégrée : seul `main` fusionné se déploie |
| La feuille de route (D2) peut sortir | Réfutée : promise à CrOliX avec ce plan, et c'est un texte |
| « Demandé depuis le Bureau » peut sortir | Réfutée : c'est une vraie troisième entrée, la taire serait faux |
| Le compte « depuis la lettre » appartient à #239 | Réfutée : sans lui, une carte liée sortirait du compte |
| | affiché aujourd'hui. Une ligne, que #239 reprendra |
| Un redémarrage pendant un geste attribue mal le lieu | Nommée dans « Limites » : le core ne redémarre pas |
| | en service courant |
| Dix tests de cas limites manquent | Intégrés dans les tâches |

## Hors périmètre

- La phrase de l'agent après une carte tranchée (T1) et « valide » dit trop tôt (T18) : en `inbox`.
- Une carte revenue en attente après une annulation chez le poste : la chaîne garde son dernier état. En `inbox`.
- Dire l'échec à voix haute : « la parole rend compte » (#241).
- Les entrées déjà écrites : pas réécrites.
- « C'est noté », dit avant que le poste agisse.
- Les prérequis avant l'action, les droits, l'envoi : #242.

## Limites

- Le Journal d'une délégation ne s'écrit qu'à la réponse du poste : « En cours » ne couvre pas l'attente d'une
  délégation, seulement celle d'un geste.
- Une relance après un délai peut toujours faire un doublon chez le poste.
- **Le critère 6 dans Lun'Luxuria** : l'échec arrive dans son fil. Fil fermé, la scène ne le montre pas, et il
  n'est pas dit : c'est #241. Limite acceptée par CrOliX le 27/11.
- Un redémarrage du core pendant un geste : le geste est rejoué ; si le poste l'avait déjà exécuté, la chaîne dit
  « dans le poste » pour un geste parti du core.
- Une carte en attente au-delà du plafond de la file d'un poste reste « À trancher » sans être visible dans la
  file (lun-avaritia#53).
- Après un rangement à la main ou une expiration, un poste resté sous 1.6 n'est relu qu'à la lecture suivante,
  deux minutes au plus.
- Une proposition qui sort de la file au-delà de son plafond chez Lun'Avaritia n'a jamais d'entrée : inchangé.
- Rien n'a été rejoué sur l'instance : la course du 27/11 vient du constat de CrOliX et du code.
