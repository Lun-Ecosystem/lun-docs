# Les textes de la carte des flux : contrat 1.5, voix, notifications. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-docs#217, `niveau:standard`. Premier chantier de la carte des flux (§ 11, étape 1).
>
> **État : rédigé le 25/11.** À contester, puis à valider par CrOliX. Les questions sont en fin de plan, une à une.
>
> Relu sur `main` : lun-docs (`origin/main` de la branche), Lun'Acedia (`0386afa`), Lun'Avaritia (`e51132d`),
> Lun'Luxuria (`98eaf36`). Le graphe d'abord, puis chaque fichier. Le core est décrit par ses comportements, comme
> dans la spec : aucun chemin du core ici.

**But :** les textes qui font foi disent ce que la carte des flux a décidé, avant tout code. Le contrat passe en 1.5 :
les propositions de tri deviennent des cartes, avec un palier, une éligibilité à la validation groupée et une
correction générique ; le bilan du jour se filtre par boîte. Un standard écrit la voix. Le standard des notifications
décrit la porte d'attention. Les chantiers d'Acedia, de la porte, des propositions au core et de l'écriture du core
partent de ces textes.

**Source :**

- La spec [carte des flux](../specs/2026-11-25-carte-des-flux-design.md), lun-docs#216, validée par CrOliX le 25/11,
  pas encore fusionnée : D1 à D16, B1, § 5.1 à 5.5, § 9 (« le contrat satellite »), § 10 (questions 1 à 3, 8 à 10
  et 13, avec leurs pistes), § 11 étape 1.
- Le [dictionnaire](../../standards/dictionnaire.md) de la même branche : la porte d'attention, le registre neutre,
  la synthèse, la validation groupée, le seuil de validation groupée, le seuil par boîte, la carte élargie.
- Sur `main` : [`contrat-satellite.md`](../../standards/contrat-satellite.md) (v1.4),
  [`notifications.md`](../../standards/notifications.md), [`design.md`](../../standards/design.md) (« Ton des
  textes »), `tools/standards-map.json`, `tools/sync-standards.mjs`.
- Le code public des trois satellites, pour leurs écarts au contrat 1.5 (« Les écarts, satellite par satellite »).

**Critères de fin** (ceux de l'issue, figés), chacun prouvé en local :

1. `standards/contrat-satellite.md` passe en version 1.5, avec son historique : les propositions de tri servies
   comme des cartes (D1) ; `/cards` qui suit le tri, pas `health.agent` ; un champ d'importance et une éligibilité à
   la validation groupée sur la carte (D5) ; une correction par un mécanisme générique du geste, sans champ propre à
   Acedia ; un bilan du jour filtré par boîte, posé par le core, chaque élément avec sa boîte et sa synthèse (D9,
   B1) ; la phrase « ne retient du flux que urgent et le contrôle » reprise. Tâche 1.
2. Un standard écrit la règle de la voix (P4) : le code dit « tu » ou nomme, seul le modèle dit « je ». Il porte les
   huit règles du § 5.5 et le registre neutre. Tâche 2.
3. `standards/notifications.md` décrit la porte d'attention et ses entrées (D2, D11), le palier d'une proposition de
   tri et la nuit sans son. Tâche 3.
4. Les termes employés sont ceux du dictionnaire, fusionné avec lun-docs#216. Tâches 1 à 4.
5. `npm run check` et `npm run sync:check` sont verts ; les copies du plugin sont à jour. Tâche 4.
6. Les écarts entre le contrat 1.5 et chaque satellite sont listés dans ce plan, pour les chantiers suivants.
   Section « Les écarts, satellite par satellite ».

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-docs` : ce plan, trois standards, un nouveau, les copies | `docs/textes-carte-flux` | lun-docs#217 | `standard` |

**Le niveau.** `standard`, celui de l'issue. Aucun code ne change. Le contrat change de comportement pour `/cards`,
d'où une version mineure et son historique ; tous les champs ajoutés sont optionnels, donc pas de `/lun/v2`. Le plan
et les textes vivent dans la même PR. Pas de Chrome.

**L'ordre avec lun-docs#216.** Ce chantier part de `main`, où le dictionnaire n'a pas encore les mots du 25/11. La PR
de ce chantier ne fusionne qu'après lun-docs#216 : la branche se rebase alors sur `main`, et la tâche 4 vérifie les
termes contre le dictionnaire fusionné.

## Ce que les textes disent aujourd'hui

### Le contrat satellite (v1.4)

- La version est dite deux fois : en tête (`contrat-satellite.md:5`, « v1.4 ») et dans le commentaire de `Health`
  (`:41`, « `'1.4'` »). L'historique tient en un paragraphe (`:150`).
- **`/cards` dépend de l'agent** : « Délégation (`agent`, `cards` : seulement si `health` porte `agent: true`) »
  (`:108`), et un `404` répond à « `/agent` ou `/cards` sur un satellite sans agent » (`:134`). Le commentaire de
  `Health.agent` dit « sert agent et cards » (`:41`).
- **La carte** (`:52`) porte `id`, `action`, `effect`, `title`, `lines`, `status`, `at`, et en option `error`,
  `link`, `kind`, `reason`, `sends`, `options`. Aucun palier, aucune éligibilité au groupe. Le seul moyen de changer
  ce qu'une carte fait est « Modifier » : `accept { input }`, où `input` remplace l'entrée de l'action (`:32`). La
  carte ne publie pas son entrée : le core ne peut pas construire un `input` sans connaître l'action.
- **« Une carte qui a `sends` ou `options` ne se valide jamais en lot »** (`:112`). Le mot « lot » y désigne ce que le
  dictionnaire nomme désormais la validation groupée.
- **Le bilan du jour** : `day.digest { since, until }` rend un `Digest` (`:113-114`). `DigestItem` vaut
  `{ type, title, at, ref? }` (`:53`). Ni filtre, ni boîte, ni synthèse.
- **Les alertes** : « Le core ne retient du flux que `urgent` et les événements de contrôle (clé, état) » (`:116`).
  Le core retient déjà tout (spec, § 3) ; la phrase est fausse depuis longtemps.

### Le standard des notifications

- « Le core fixe le rendu, selon le palier, la sourdine du bureau et la plage de nuit » (`notifications.md:11`). Pas
  de porte unique, pas d'entrée « pause », « appel » ni « présence », pas de sorties nommées.
- La nuit sans son est écrite dans la ligne P0 (`:23`), seulement là.
- Une carte issue d'une délégation est P1 (`:41`) ; « tri à valider » est P2 (`:44`). Le standard ne dit pas le
  palier d'une carte : elle n'en a pas. Aujourd'hui, le core notifie toute carte en attente (spec, § 3).
- Le rendu (`:50-57`) dit regroupement, une seule file, une seule fois, la lettre du matin. Rien sur « attendre le
  bon moment » ni sur la trace de chaque choix.

### La voix

- Aucun standard n'écrit la règle « seul le modèle dit je ». Le dictionnaire de lun-docs#216 définit le registre
  neutre ; la spec écrit les huit règles (§ 5.5).
- `design.md`, « Ton des textes » (`:71-78`) : « Deux voix : CrOliX à la première personne […] ; Natsume dans son
  personnage. Les écrans d'outil […] parlent d'une voix technique neutre : phrases courtes, pas de « tu » ». Le
  registre neutre du dictionnaire, lui, « dit « tu » ou nomme ». Les deux se lisent ensemble : voir la question 1.
- Les standards copiés dans le plugin sont listés dans `tools/standards-map.json` ; `npm run sync` les écrit sous
  `plugin/skills/<skill>/references/`, `npm run sync:check` échoue sur une copie absente, différente ou orpheline.
  `lun-ecosysteme` reçoit `contrat-satellite.md`, `notifications.md`, `dictionnaire.md` ; `lun-design`, `design.md`.

## Les formes proposées

Chaque piste du § 10 retenue, avec la forme que la tâche 1 écrit. Tout ajout est optionnel : un client 1.4 l'ignore.

### 1. Le palier d'une carte (question 1 du § 10)

```ts
interface Card { /* … v1.4 … */ importance?: Importance }
// importance : palier de la carte, fixé par le poste selon notifications.md ; absent, il vaut `normal` (P1)
```

- **Absent vaut `normal`**, le rendu d'aujourd'hui : un poste 1.4 ne change pas de comportement.
- Une proposition de tri porte `low` (P2), ou `normal` (P1) si le tri la juge urgente : le palier de son événement
  `mail.pending` aujourd'hui (`lun-acedia/server/src/triage/pipeline.ts:301`). Jamais `urgent` : `urgent` reste aux
  règles.
- Un brouillon de la bibliothèque est une « proposition de la nuit », P2 au standard : Avaritia porterait `low`.
- Le champ s'appelle `importance` comme sur `LunEvent` : le dictionnaire nomme ainsi le palier.

### 2. L'éligibilité à la validation groupée (question 2 du § 10)

Deux pistes dans la spec. **Retenue : le drapeau posé par le poste.**

```ts
interface Card { /* … */ bulk?: true }
// bulk : présent seulement à true, la carte entre dans la validation groupée ; jamais avec `sends` ou `options`
```

- Le poste le calcule. Pour Acedia : une proposition de tri dont la confiance atteint le seuil de validation groupée,
  borné par le seuil par boîte quand il existera. Aujourd'hui, la borne est le seuil commun :
  `Math.min(bulkThreshold, threshold)` (`lun-acedia/server/src/triage/routes.ts:41-45`).
- La validation groupée est alors, côté core, une suite de `accept` sur les cartes `bulk`. Aucune route nouvelle.
- **Écartée : une action de validation groupée côté Acedia.** Elle ferait une route propre au métier, que le core
  devrait connaître, et le geste ne passerait plus par la carte.
- Le contrat reprend `:112` avec le mot du dictionnaire : « Une carte qui a `sends` ou `options` n'entre jamais dans
  la validation groupée ; un poste ne pose jamais `bulk` sur elle. »

### 3. La correction générique (question 3 du § 10)

```ts
interface CardField { name: string; label: string; value: string[]; choices: { value: string; label: string }[];
  multiple?: true }
interface Card { /* … */ fields?: CardField[] }
// fields : ce que CrOliX peut corriger avant de valider ; value : le choix proposé ; multiple : plusieurs choix
```

- Route : `POST /lun/v1/cards/:id/accept` accepte aussi `{ values: Record<string, string[]> }`. Chaque clé est le
  `name` d'un champ de la carte, chaque valeur est prise dans ses `choices`. Sinon `400`. `values` et `input` ne
  vont jamais ensemble (`400`).
- Le poste traduit `values` dans son métier. Pour Acedia : la boîte (un seul choix, avec `trash` et `spam`) et les
  étiquettes (`multiple`) d'une proposition ; valider avec `values` fait ce que fait `mail.correct`
  (`lun-acedia/server/src/contract/catalog.ts:143-149`).
- Le core n'a besoin de rien savoir d'Acedia : il affiche des champs et des choix, et renvoie ce que CrOliX a coché.
- `input` (« Modifier ») ne change pas : il remplace l'entrée de l'action, pour qui la connaît.
- La validation groupée s'ouvre pour corriger une carte (D5) : la carte corrigée part seule, par `values`.

### 4. `/cards` sans `health.agent`

- Un poste qui déclare `contract` `1.5` ou plus sert `/cards` toujours, même sans agent : une liste vide s'il n'a
  aucune carte. Le core lit `/cards` sur tout poste 1.5.
- Un poste qui déclare moins garde la règle de la v1.4 : `/cards` seulement avec `agent: true`.
- `Health.agent` ne dit plus que « sert `/agent` ». Le `404` de `/cards` sans agent ne vaut plus que pour un poste
  de contrat 1.4 ou moins.

### 5. Les propositions de tri comme cartes (D1)

- Le contrat : « Une proposition qui attend un geste de CrOliX est une carte, qu'elle vienne de l'agent du poste ou
  de son tri. Elle sort par `/cards` et se tranche par le même geste. La décision et son journal restent au poste. »
- La raison du tri va dans `reason` ; la synthèse (D9) dans `lines`, comme Avaritia y met déjà la sienne
  (`lun-avaritia/server/src/brain/drafts.ts:405`). Pas de champ de plus.
- `id` reste une chaîne unique dans le poste : Acedia choisit comment distinguer une proposition d'une carte de son
  agent (chantier d'Acedia).

### 6. Le filtre du bilan du jour (question 8 du § 10)

```ts
// day.digest { since, until, boxes?: string[] }
// boxes : identifiants de boîtes ; présent, le bilan ne garde que les mails rangés dans l'une d'elles avec l'accord
// de CrOliX (une règle, ou une proposition validée ou corrigée) ; un poste sans boîtes l'ignore
```

- **Le nom.** `boxes`, le mot du dictionnaire (« une boîte », Acedia). Un nom générique (`scope`, `filter`) cacherait
  ce qu'il filtre ; le contrat nomme déjà des objets de métier (`brain.due`). Le core prend les identifiants dans
  `label.list` d'Acedia (`catalog.ts:336`), pour le réglage de l'Atelier.
- **L'accord de CrOliX**, Acedia le sait déjà : chaque proposition garde sa `source` (`rule`, `ai`) et son statut
  (`auto`, `accepted`, `corrected`…) (`lun-acedia/server/src/types.ts:16`, `triage/proposals.ts`). Accord = `rule`
  rangé seul, ou `accepted`, ou `corrected`. Un mail rangé seul par le tri au-dessus d'un seuil n'en est pas (§ 5.4).
- **Avec le filtre**, `received` et `done` ne gardent que ces mails ; `pending` ne change pas. Sans le filtre, le
  bilan ne change pas.
- **Le danger.** Acedia 1.4 valide l'entrée par un objet `zod` qui retire les clés inconnues
  (`catalog.ts:422-425`) : elle ignorerait `boxes` sans erreur et rendrait tous les mails. Le contrat le dit : **le
  core ne passe `boxes` qu'à un poste qui déclare `contract` 1.5 ou plus.**

### 7. Le type d'un élément du bilan (question 9 du § 10)

```ts
interface DigestItem { type: string; title: string; at: string; ref?: Ref; box?: { id: string; name: string };
  synthesis?: string }
// box : la boîte d'un mail rangé ; synthesis : la synthèse, deux lignes au plus, masquée des secrets
```

- `box` porte l'identifiant (celui du filtre) et le nom (celui des textes : « Rangé en Facture »).
- `synthesis` est présente quand le poste l'a. **B1** : avec `boxes`, le poste écrit la synthèse qui manque à un
  mail rangé par une règle, par un petit appel, seulement pour ces mails. Sans `boxes`, aucun appel de plus.
- Le bilan reste la seule sortie d'une synthèse hors des cartes. Le corps du mail ne quitte jamais le poste (D9).

### 8. La phrase de la ligne 116

Remplacée par : « Le core reçoit tout le flux et le rend par sa porte d'attention
([`notifications.md`](notifications.md)) : le poste fixe le palier, la porte choisit la sortie. » La phrase d'avant,
« `urgent` est réservé aux alertes issues de règles déterministes » (`:115`), ne change pas.

### 9. Le standard de la voix (question 13 du § 10)

Trois places possibles :

- **(a) Un nouveau standard, `standards/ecriture.md` (recommandé).** La voix, le registre neutre, les huit règles.
  Copié dans le plugin pour `lun-ecosysteme` et `lun-design`. « Ton des textes » de `design.md` y renvoie. Une
  place pour une règle qui vaut pour le core, les écrans et la voix fixe.
- **(b) Dans `design.md`, « Ton des textes ».** Déjà la voix des écrans, mais un standard de design pour une règle
  qui vaut aussi pour les consignes du modèle et la voix fixe ; il n'est copié que pour `lun-design`.
- **(c) Dans `notifications.md`.** Ne couvre ni le Journal, ni « Ce que j'ai fait », ni les consignes.

La tâche 2 est écrite pour (a). La table « par famille » du § 5.5 n'y entre pas : la forme de chaque ligne est la
question 7 du § 10, laissée au chantier de l'écriture du core.

## Les écarts, satellite par satellite

Ce que le code de `main` fait, contre le contrat 1.5. Pour les chantiers suivants ; rien ne se corrige ici.

### Lun'Acedia (chantier « Acedia », § 11 étape 3)

Chemins sous `server/src/` sauf mention. Pour chaque écart : ce que dit le 1.5, puis ce que fait le code.

- **A1.** `contract` `'1.5'`. Le code : `CONTRACT = '1.4'` (`identity.ts:2`).
- **A2.** Les propositions de tri sont des cartes. Le code : `/cards` ne lit que les cartes de l'agent, `pina_cards`
  (`contract/routes.ts:193-201`) ; les propositions vivent dans `proposals`.
- **A3.** Le geste d'une proposition passe par la carte. Le code : `mail.validate`, `mail.correct` et `mail.refuse`
  existent en actions (`contract/catalog.ts:140-156`), pas en cartes.
- **A4.** `importance` sur la carte. Le code : `toContractCard` n'en pose pas (`contract/routes.ts:41-58`) ;
  l'événement `mail.pending` a déjà `low` ou `normal` (`triage/pipeline.ts:301`).
- **A5.** `bulk`, calculé par le poste. Le code : le groupe se calcule dans le front seul
  (`views/src/lib/mail/Pending.svelte:98`, `:144`) ; le serveur ne sert que les deux seuils
  (`triage/routes.ts:41-45`).
- **A6.** `fields` et `values` pour corriger. Le code : rien ; `accept` ne prend que `input`
  (`contract/routes.ts:31`, `pina/routes.ts:21-27`).
- **A7.** La synthèse dans `lines`, masquée. Le code : le tri n'écrit qu'une `reason` de 160 signes
  (`triage/classifier.ts`, `Classification`) ; aucun masquage (spec, § 5.1).
- **A8.** `boxes` dans `day.digest`. Le code : le schéma n'a que `since` et `until`, et retire les clés inconnues sans
  erreur (`contract/catalog.ts:422-425`).
- **A9.** `box` et `synthesis` sur un élément du bilan. Le code : les éléments sont `{ type, title, at, ref }`, par
  l'objet du mail (`contract/catalog.ts:440`, `:456-461`) ; ceux des cartes n'ont pas de `ref` (`:470`).
- **A10.** B1, la synthèse à la demande. Le code : absente.

Deux points touchent la porte, pas le contrat : une proposition donnera une carte **et** un événement `mail.pending`.
La porte (§ 11 étape 4) doit n'en faire qu'un fait (règle 2 du § 5.5). Et une proposition rangée seule par le tri
n'aura pas de carte : seul son événement `mail.triaged` reste.

### Lun'Avaritia

Chemins sous `server/src/`.

- **V1.** `contract` `'1.5'`. Le code : `CONTRACT = '1.4'` (`identity.ts:5`).
- **V2.** `importance` sur la carte ; un brouillon est P2. Le code : `cardOf` n'en pose pas (`brain/drafts.ts:389`) :
  absent vaudra P1, notifié comme aujourd'hui.
- **V3.** `/cards` sans dépendre de l'agent. Le code sert déjà `/cards` et `agent: true`
  (`contract/routes.ts:105`, `:174-184`) : rien à faire.
- **V4.** `boxes` ignoré par un poste sans boîtes. Le schéma retire les clés inconnues (`brain/digest.ts:5`) : rien à
  faire.
- **V5.** `bulk`, `fields`, `box`, `synthesis` : optionnels, aucun ne s'applique à un brouillon. Rien à faire.

Seul V1 et V2 font un petit chantier. Un écart au standard de l'écriture, hors contrat : le bilan écrit
« Lot de n observation(s) » (`digest.ts:22`), contre la règle 8 (pluriels en entier).

### Lun'Luxuria

Luxuria n'est pas un poste : elle ne sert aucune route `/lun/v1` (relu par recherche dans `src/` et `src-tauri/`).
Le contrat 1.5 ne lui demande rien. Elle affiche des cartes relayées par le core
(`src/lib/ui/DecisionCard.svelte:33-52` : `lines`, `sends`, `options`) : les champs nouveaux y sont ignorés, et la
correction par `fields` n'y apparaît pas tant que le chantier des propositions au core ne l'ajoute pas (§ 11 étape 5).

### Les phrases fixes en « je » des agents de poste

Si la règle de la voix vaut aussi pour les satellites (question 2) :

- Acedia : `server/src/contract/routes.ts:39` (« je ne fais rien »), `server/src/pina/agent.ts:52`, `:54`, `:55`.
- Avaritia : `server/src/brain/agent.ts:21-23`, `server/src/contract/routes.ts:215`.

Le résumé d'une délégation (`AgentReply.summary`) porte ces phrases jusqu'au core.

## Tâches

**Barrières de chaque tâche** : `npm run check`, `npm test`. La tâche 4 ajoute `npm run sync:check`. Chaque tâche
écrit ses preuves par `grep` dans le compte rendu. Le texte : français, phrases courtes, sans tiret long, 120 signes
par ligne au plus, les mots du dictionnaire.

1. - [ ] **Le contrat 1.5 et son historique** (`standards/contrat-satellite.md` seul). **En parallèle de 2 et 3.**
   - Écrire « v1.5 » en tête (`:5`) et `'1.5'` dans le commentaire de `Health` (`:41`) ; ce commentaire dit
     désormais « agent : sert `/agent` ».
   - Ajouter à `Card` `importance?`, `bulk?`, `fields?` et le type `CardField`, avec leurs commentaires (formes 1 à
     3). Ajouter `box?` et `synthesis?` à `DigestItem` (forme 7).
   - Routes : `accept` accepte `{ values }` (forme 3) ; `/cards` est servi par tout poste 1.5 (forme 4).
   - Comportements : la proposition de tri est une carte (forme 5) ; « Délégation » ne garde que `agent` ; la phrase
     du lot (`:112`) passe en validation groupée et dit `bulk` (forme 2) ; « Bilan du jour » dit `boxes`, l'accord de
     CrOliX, B1, et « le core ne passe `boxes` qu'à un poste 1.5 » (forme 6) ; la ligne 116 reprise (forme 8).
   - Erreurs : `400` pour un `values` hors des choix, ou avec `input` ; `404` de `/cards` réservé à un poste 1.4 sans
     agent.
   - Versionnement : une phrase pour la v1.5, à la suite de la v1.4. Elle liste les champs ajoutés et les deux
     changements de comportement (`/cards` sans agent, les propositions en cartes), puis la règle du filtre.
   - Preuves : `grep -n "1\.5"` montre la tête, `Health` et l'historique ; `grep -n "en lot"` ne rend plus rien ;
     `grep -n "ne retient du flux"` ne rend plus rien ; `grep -n "boxes"` montre la route et la règle du 1.5.
   - **La place.** Le contrat fait déjà 150 lignes, la limite d'un standard (`npm run check`). Chaque ajout se paie
     par une ligne regagnée : les commentaires des types restent sur la ligne de leur type, comme en v1.4 ;
     l'historique de la v1.5 remplace en une phrase le détail des v1.1 à v1.3, qui reste dans git. Si cela ne
     suffit pas, le tableau des clés de service passe en liste courte. Rien de la v1.4 ne se perd en sens.
   - Exclu : tout `/lun/v2` ; le masquage lui-même (il vit dans Acedia, spec § 5.1) ; la mesure par boîte (D3).
2. - [ ] **Le standard de l'écriture** (`standards/ecriture.md` nouveau, `standards/design.md`,
   `tools/standards-map.json`, `README.md`). **En parallèle de 1 et 3.** Écrite pour (a) (forme 9).
   - `ecriture.md`, avec la tête des autres standards (titre, une citation qui dit son champ) :
     - « La voix » : un texte est écrit par le modèle, à la première personne, ou par le code, dans le registre
       neutre. Le code dit « tu » ou nomme, jamais « je » ; seul le modèle dit « je » (P4). La crainte qu'elle
       prévient : une Natsume froide côté code et émotive côté modèle (§ 5.3).
     - Où va chaque texte : la lettre du matin au modèle (D6) ; le Journal, « Ce que j'ai fait », les notifications,
       la voix fixe au code. L'annonce d'une urgence reste une phrase fixe sans « je ».
     - « Le registre neutre » : la définition du dictionnaire, et la règle 5.
     - « Les huit règles », mot pour mot du § 5.5, avec leurs exemples.
     - La réponse aux questions 1 et 2 : où le « tu » s'emploie, et si la règle vaut pour les satellites.
   - `design.md`, « Ton des textes » : une ligne qui renvoie à `ecriture.md` pour la voix du code et du modèle. La
     règle des écrans d'outil reste.
   - `tools/standards-map.json` : `standards/ecriture.md` pour `lun-ecosysteme` et `lun-design`.
   - `README.md`, « Quoi fait foi » : une ligne « La voix et l'écriture des textes ».
   - Preuves : `grep -c "^[1-8]\. "` vaut 8 dans « Les huit règles » ; `grep -n "je"` sur la règle de la voix ;
     `grep -n "ecriture.md"` dans `design.md`, `README.md` et la carte des copies.
   - Exclu : la table « par famille » du § 5.5 (question 7) ; les quatre phrases fixes du core et celles des agents
     de poste (du code) ; la règle de fluidité (P2).
3. - [ ] **La porte d'attention dans les notifications** (`standards/notifications.md` seul). **En parallèle de 1
   et 2.**
   - « Principe » : « Le core fixe le rendu » devient « Le core rend tout par sa porte d'attention ». Le satellite
     fixe toujours le palier.
   - Une section « La porte d'attention » : un seul endroit du core, en code, sans modèle (D2). Elle reçoit les
     événements, les cartes et les échéances. Ses entrées de rendu : la sourdine, la pause, un appel en cours, la
     plage de nuit, la présence. Elle choisit une sortie parmi cinq : dire, notifier, attendre le bon moment, la
     lettre du matin, le Journal. Chaque choix est tracé. « Attendre » partage un budget avec la parole spontanée
     (P2) ; sa forme n'est pas écrite ici.
   - Une ligne sur ce que la spec marque **[lecture du rédacteur]** (ce que la porte reçoit), écrite comme lecture
     tant que CrOliX ne l'a pas confirmée (question 3).
   - « Classement » : la ligne P1 dit « carte à valider issue d'une délégation » ; la ligne P2 dit « proposition de
     tri, carte ou événement (P1 si le tri la juge urgente) ». Une phrase : une carte porte son palier dans
     `importance` ; absent, elle vaut P1.
   - « Rendu » : la nuit, une urgence part en notification sans son (D11), quelle que soit l'entrée qui la porte. Le
     regroupement dit « 5 propositions à trancher ».
   - Preuves : `grep -n "porte d'attention"`, `grep -n "sans son"`, `grep -n "importance"`.
   - Exclu : les paliers eux-mêmes ; le seuil par boîte ; le budget commun et son plafond (question 12 du § 10).
4. - [ ] **Les copies, les termes, les barrières** (session principale). **Après 1, 2 et 3, et après la fusion de
   lun-docs#216.**
   - Rebaser la branche sur `main` à jour.
   - Relire les trois textes contre le dictionnaire fusionné : « validation groupée », jamais « lot » pour un geste ;
     « la nuit », jamais « la veille » pour la routine ; « lettre du matin » ; « carte », « geste », « poste »,
     « synthèse », « registre neutre », « porte d'attention ».
   - `npm run sync`, puis `npm run sync:check`, `npm run check`, `npm test`, tous verts. Les copies attendues :
     `plugin/skills/lun-ecosysteme/references/{contrat-satellite,notifications,ecriture}.md`,
     `plugin/skills/lun-design/references/ecriture.md`.
   - Preuves : la sortie des quatre commandes ; `git diff --stat` qui montre les copies.
5. - [ ] **La revue et la livraison** (`reviewer`, puis `livreur`). **Après 4.** Le diff relu contre ce plan, les
   critères de l'issue et le dictionnaire. Une PR lun-docs en brouillon, qui ferme Lun-Ecosystem/lun-docs#217, avec
   ce plan coché et la sortie des barrières.

**L'ordre.** Les tâches 1, 2 et 3 partent ensemble : elles ne partagent aucun fichier, et ce plan fixe les formes
qu'elles se citent (le champ `importance` entre 1 et 3). Puis 4, qui attend lun-docs#216. Puis 5.

## Hors périmètre

- Tout code : Acedia, le core, Luxuria, Avaritia. Les écarts sont listés plus haut, pour leurs chantiers.
- La règle de fluidité (P2) et le seuil par boîte (D3).
- La forme de chaque ligne du Journal (question 7 du § 10), « Ce que j'ai fait » (question 5), la mesure par boîte
  (question 4), le budget commun (question 12), le repli de la lettre du matin (question 14).
- Un ADR : la v1.5 n'ajoute que des champs optionnels et change deux comportements bornés par `contract`, comme la
  v1.4, qui n'en a pas eu.
- La feuille de route du MVP : la carte des flux n'y est pas encore ; sa place se décide avec lun-docs#216.

## Limites

- **Le contrat est à sa limite de lignes** (150 sur 150), et `design.md` à 149 : la ligne de renvoi de la tâche 2
  l'amène à 150. Le prochain ajout à l'un ou l'autre devra en retirer.

- **Les choix d'un champ voyagent avec chaque carte.** Une boîte et ses étiquettes, une vingtaine de choix, se
  répètent sur chaque proposition. Assez pour une file courte ; une liste partagée viendra si la file grandit.
- **Absent vaut P1.** Un poste qui oublie `importance` sur une proposition la fait notifier. C'est le comportement
  d'aujourd'hui, pas une régression.
- **Le filtre ignoré par un poste 1.4** rend tous les mails. Seul le core l'empêche, en lisant `contract` avant
  d'envoyer `boxes`. Le chantier de la nuit vers Avaritia devra le tester.
- **L'accord de CrOliX exclut le rangement seul par seuil.** Le jour où CrOliX ouvre un seuil par boîte, ces mails
  n'entreront pas dans la bibliothèque. C'est la spec (§ 5.4) ; à rouvrir si CrOliX le veut.

## Ce que je n'ai pas pu vérifier

- Le comportement du core : il est décrit d'après la spec (§ 3), pas relu dans son code. En particulier, qu'il
  notifie toute carte en attente, et qu'il ne lit `/cards` qu'avec `agent: true`.
- Que la PR lun-docs#216 fusionne telle quelle : le dictionnaire et la spec sont lus sur sa branche (`8271453`).

## Questions à CrOliX

Une à la fois, chacune au moment où sa tâche part.

1. **Où le code dit « tu ».** Le registre neutre « dit « tu » ou nomme » ; `design.md` interdit « tu » sur les écrans
   d'outil. Recommandé : le code dit « tu » à Natsume dans ses consignes (le socle : « Tu tiens à lui… ») ; sur les
   écrans, les notifications et la voix fixe, il nomme ou écrit sans sujet (« Rangé dans Facture par une règle »),
   et la règle des écrans d'outil reste. (Tâche 2.)
2. **La règle de la voix vaut-elle pour les satellites ?** Les agents d'Acedia et d'Avaritia ont sept phrases fixes
   en « je » (« Acedia est en pause : je ne fais rien… »), que le résumé d'une délégation porte jusqu'au core.
   Recommandé : oui, le standard vaut pour tout l'écosystème ; ces phrases deviennent neutres dans le chantier de
   chaque satellite. (Tâche 2.)
3. **Ce que la porte reçoit.** La spec le marque comme une lecture : les événements, les cartes, les échéances, et
   les entrées sourdine, pause, appel, nuit, présence. Recommandé : l'écrire comme règle dans `notifications.md`.
   (Tâche 3.)
4. **La place du standard de la voix.** Recommandé : (a), un nouveau standard `standards/ecriture.md` (forme 9).
   (Tâche 2.)
