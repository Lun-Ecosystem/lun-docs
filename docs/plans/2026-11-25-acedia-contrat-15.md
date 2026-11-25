# Acedia au contrat 1.5 : propositions en cartes, synthèse masquée, bilan par boîte. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-acedia#107, `niveau:critique`, validé par CrOliX. Chantier de la carte des flux,
> étape 3 du § 11 de la [spec](../specs/2026-11-25-carte-des-flux-design.md). Ses critères de fin sont figés.
>
> **État : rédigé le 25/11.** À contester (`plan-challenger`), puis à valider par CrOliX, question par question.
>
> Code relu sur `main` : lun-acedia `0386afa`, lun-avaritia `origin/main` du 25/11, lun-docs `5437b6f`. Le graphe
> d'abord, puis chaque ligne citée. Lun'Acedia est public : rien du core ici, ni chemin ni comportement.

**But :** Acedia parle le contrat 1.5. Une proposition de tri qui attend CrOliX devient une carte, avec son palier, sa
place dans la validation groupée et sa correction. Elle porte une synthèse de deux lignes, masquée des secrets. Le
bilan du jour se filtre par boîte, chaque mail avec sa boîte et sa synthèse. Le corps d'un mail ne sort jamais par
les cartes, le bilan ni les événements, et des tests de fuite le prouvent.

**Source :**

- Le [contrat satellite](../../standards/contrat-satellite.md) v1.5, qui fait foi : « Délégation et cartes »,
  « Propositions », « Correction », « Bilan du jour », « Filtre par boîte », « Erreurs ».
- [`ecriture.md`](../../standards/ecriture.md) (la voix), [`notifications.md`](../../standards/notifications.md)
  (P2 pour « ce qui attend un geste », P1 si le tri la juge urgente),
  [`dictionnaire.md`](../../standards/dictionnaire.md)
  (« la synthèse », « la validation groupée », « le seuil de validation groupée »).
- La spec de la carte des flux : § 5.1 (D1, D5, D9 : la synthèse dans l'appel existant, le masquage dans Acedia),
  § 5.4 (l'accord de CrOliX, B1), § 10.
- Le plan des textes, [2026-11-25-textes-carte-des-flux](2026-11-25-textes-carte-des-flux.md) : les écarts A1 à A10
  et les phrases en « je » d'Acedia, relus ici un à un.

## Critères de fin

Ceux de l'issue, recopiés sans changement. Chaque tâche dit lesquels elle tient.

1. **A1.** `health.contract` vaut `1.5`. Tâche 11.
2. **A2.** `/cards` est servi même sans agent. Il sert chaque proposition de tri en attente comme une carte. Une
   proposition servie en carte n'émet plus `mail.pending`. Une proposition rangée seule par le tri garde seulement
   `mail.triaged`. Tâches 5, 6.
3. **A3.** Les gestes du contrat (`accept`, `refuse`) tranchent une proposition servie en carte. Les actions
   `mail.validate`, `mail.correct` et `mail.refuse` restent. Tâche 7.
4. **A4.** La carte d'une proposition porte `importance` : `low`, ou `normal` si le tri la juge urgente. Tâche 6.
5. **A5.** La carte porte `bulk: true` quand la confiance atteint le seuil de validation groupée et le seuil de tri.
   C'est le serveur qui le calcule. Jamais avec `sends` ni `options`. Tâches 6, 8.
6. **A6.** La carte porte `fields` (la boîte, les étiquettes), avec la valeur proposée et les choix. `accept
   { values }` range selon ces valeurs. Les erreurs `400` du contrat sont respectées. Tâches 6, 7.
7. **A7.** Le tri écrit une synthèse de deux lignes au plus, masquée des secrets, servie dans `lines`. Le corps d'un
   mail ne quitte jamais le poste. Des tests de fuite le prouvent : aucun secret et aucun extrait du corps dans
   `/cards`, dans le bilan ni dans les événements. Tâches 2, 3, 4, 5, 6.
8. **A8 et A9.** `day.digest` accepte `boxes`. Il ne garde alors que les mails dont la boîte actuelle est l'une
   d'elles et qui y ont été rangés avec l'accord de CrOliX. Chaque élément porte `box` et `synthesis`. Tâche 9.
9. **A10.** Avec `boxes`, la synthèse manquante se calcule à la demande ; jamais en pause, en mode dégradé ni au
   plafond ; chaque appel compté ; un nombre borné par appel, l'appel suivant reprend ; sans `boxes`, aucun appel.
   Tâche 10.
10. **La voix.** Les phrases fixes de l'agent qui disent « je » ou « tu » deviennent neutres. Tâche 1.
11. **Barrières vertes, et l'écran des propositions marche toujours**, vérifié dans Chrome sur la démo. Tâches 8, 11.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-acedia` : le serveur, l'écran, la démo | `feat/acedia-contrat-15` | lun-acedia#107 | `critique` |
| `lun-docs` : ce plan, ses coches | `docs/plan-acedia-contrat-15` | lun-acedia#107 | `trivial` |

**Le niveau.** `critique` : le contrat change de version, et le contenu des mails sort du poste par la synthèse. Le
standard demande les cas limites testés et une preuve de bout en bout décrite dans la PR (`workflow.md:39`). Les tests
de fuite (tâche 3) sont la pièce propre à ce niveau.

## Ce que le code fait aujourd'hui

Chemins sous `lun-acedia/server/src/` sauf mention.

### Le contrat

- **A1.** `CONTRACT = '1.4'` (`identity.ts:2`), servi par `/health` (`contract/routes.ts:120`).
- **A2, `/cards` sans agent : déjà vrai.** `/health` pose `agent: true` en dur (`contract/routes.ts:121`) et `/cards`
  ne teste rien (`:193-201`). Il ne lit que `pina_cards` (`:198`). Rien à changer pour la route ; un test le fige.
- **Les cartes du contrat** sont écrites par `toContractCard` (`contract/routes.ts:41-58`) : ni `importance`, ni
  `bulk`, ni `fields`, ni `reason`. Le type est `ContractCard` (`types.ts:271-290`).
- **Le geste.** `Accept = Decision.pick({ input: true })` (`contract/routes.ts:31`). Un objet `zod` non strict :
  `values` et `answer` sont retirés sans erreur. `decide` passe l'id en `Number(id)` à `decideCard`
  (`:205-217`, `pina/agent.ts:169-176`) : un id qui n'est pas un nombre rend « Carte inconnue ».

### Le tri

- **L'appel de tri** (`triage/llm-classifier.ts`) : un seul appel `provider.json` par mail (`:78-84`,
  `maxTokens: 512`), le corps coupé à 4 000 signes (`gmail/body.ts:190`). La réponse a cinq champs (`:14-20`) ;
  `reason` est une phrase de 160 signes (`:23`, `:102`). La consigne demande déjà de ne recopier « aucune donnée
  personnelle (adresse, numéro, montant) » (`:51-52`). Rien ne le vérifie après coup.
- **Le coût** est compté par appel, `purpose = 'triage'` (`triage/pipeline.ts:160-165`, `contract/costs.ts:19`).
  Prix de Haiku 5.5 : 0,10 $ et 0,50 $ le million de jetons, en entrée et en sortie (`llm/models.ts:23`).
- **Le stockage.** Table `proposals` (`db.ts:80-89`, plus `reason` à `:140`). `saveProposal` écrit la raison
  (`triage/proposals.ts:45-64`). Aucune colonne de synthèse. Les migrations s'ajoutent en fin de liste (`db.ts:6-7`).
- **Les événements d'une proposition IA** (`triage/pipeline.ts:296-308`) : `mail.pending` si elle attend,
  `mail.triaged` si elle est rangée seule ; `low`, `info`, ou `normal` si le tri la juge urgente ; rien pour une
  importance `none`.
- **Une fuite qui existe déjà.** Un mail rangé par une règle qui porte l'étiquette Urgent émet `mail.triaged` avec
  `lines : ["De : …", "Extrait : <snippet>"]` (`triage/pipeline.ts:235-253`). Le snippet de Gmail est un extrait du
  corps : le critère 7 l'interdit dans les événements.
- **Les titres.** Un événement, une carte, un élément du bilan prennent l'objet du mail tel quel
  (`pipeline.ts:240`, `contract/catalog.ts:440`). Un objet peut porter un code (« Votre code 482917 »).
- **Le seuil de validation groupée** : `bulkThreshold`, 85 par défaut, jamais au-dessus du seuil de tri
  (`triage/pipeline.ts:64`, `triage/routes.ts:41-45`, `:119-138`). Le serveur ne s'en sert pas : seul l'écran
  calcule le groupe.
- **L'accord de CrOliX** se lit dans `proposals` : `source` (`rule`, `ai`) et `status` (`auto`, `accepted`,
  `corrected`, `refused`, `pending`, `types.ts:16`). Une règle écrit `rule` + `auto` (`pipeline.ts:224-232`).
  `correct` passe à `corrected`, même depuis `auto` (`pipeline.ts:466-489`). Un rangement à la main ne change le
  statut que d'une proposition `pending` (`onManualFile`, `pipeline.ts:495-501`) : un mail rangé seul par l'IA puis
  rangé à la main reste `ai` + `auto`.

### Le bilan du jour

- `day.digest` (`contract/catalog.ts:418-482`) : schéma à deux clés, non strict (`:422-425`), donc `boxes` est
  ignoré sans erreur. Les éléments sont `{ type, title, at, ref }` (`:440`, `:456-461`) ; ceux des cartes de l'agent
  n'ont pas de `ref` (`:470`). 200 éléments par liste au plus (`:430-431`).
- `registerCatalog` ne reçoit ni le classeur ni l'état du coût (`app.ts:61`, `contract/catalog.ts:56-59`).

### Les plafonds

- **Seul l'agent a un plafond** : `dailyCapUsd`, 1 $ par défaut (`pina/store.ts:172`, `:184`), testé avant chaque
  tour (`pina/agent.ts:376`). Le tri n'en a pas. `spentToday` ne connaît que `triage` et `pina`
  (`llm/models.ts:137-142`) ; la colonne `purpose` est un texte libre (`db.ts:142`), sans contrainte.
- **Les pauses** : `getState` (`contract/state.ts:19-31`). Sous une pause du core, le tri ne passe pas par le modèle
  (`pipeline.ts:360`) ; sous une pause locale, il s'arrête (`:352`). Le mode dégradé : `degraded` non vide.

### L'écran des propositions

- `views/src/lib/mail/Pending.svelte` lit les réglages (`:139-149`) et calcule le groupe lui-même :
  `above = items.filter((m) => raw(m) >= bulk)` (`:98`), `bulk = Math.min(s.bulkThreshold, s.threshold)` (`:144`).
  « Tout valider au-dessus de {bulk} % » valide `above` (`:450-454`).
- **Il se relit sur chaque événement `mail.*`** (`:150-156`), comme les compteurs de l'app
  (`app/src/App.svelte:157-162`).
  La synchro émet `mail.changed` avant le tri (`gmail/sync.ts:222-228`, `main.ts:116`) : sans `mail.pending`, une
  nouvelle proposition n'arriverait plus à l'écran avant le geste suivant.
- Le type `ProposalView` (`types.ts:11-18`) est recopié dans `views/src/lib/types.ts` par `npm run sync-types`.

### Le masquage

- **Aucun, nulle part en public.** Recherche dans lun-acedia, lun-avaritia et lun-luxuria : `redact`, `mask`,
  `masqu`, `IBAN`, `secret`. Seul l'affichage d'une adresse de fournisseur retire son mot de passe
  (`llm/keys.ts:307-316`, le même à `lun-avaritia/server/src/llm/keys.ts:278-286`). Avaritia ne reçoit pas de mail :
  elle recevra la synthèse, déjà masquée par Acedia.

### Les phrases en « je » ou en « tu »

- `contract/routes.ts:39` : « je ne fais rien tant qu'elle n'est pas reprise ».
- `pina/agent.ts:51-52` (`CAP`) : « J'ai atteint mon plafond […] ou tu peux le relever ».
- `pina/agent.ts:53-54` (`TOO_LONG`) : « Je m'arrête là […] Dis-moi par où reprendre ».
- `pina/agent.ts:55` (`EMPTY`) : « Je n'ai rien de clair à te répondre […] Tu peux reformuler ? ».
- `pina/agent.ts:57` (`FAILED.key`) : « refuse ma clé ».
- `pina/agent.ts:61` (`FAILED.format`) : « m'a renvoyé […] Réessaie ».
- **Deux de plus**, que le plan des textes n'a pas listées : `pina/agent.ts:59` (`FAILED.credit`, « choisis un autre
  modèle ») et `:60` (`FAILED.unavailable`, « Réessaie dans un instant ») tutoient aussi. Voir la question 7.
- `REFUSED`, `LATE` et les autres (`:63-68`) parlent au modèle : ce sont des consignes, le « tu » y est permis
  (`ecriture.md`, « La voix »).

## Les choix retenus

### 1. Où naît la synthèse : dans l'appel de tri

D9 le dit (« dans son appel existant, pas d'appel de plus »). Le chiffre le confirme. Estimations, pas des mesures :
un appel de tri coûte environ 1 800 jetons en entrée (consigne, boîtes, exemples, corps de 4 000 signes) et 80 en
sortie, soit 0,00022 $ avec Haiku 5.5.

| Façon | Jetons en plus par mail | Coût en plus par mail | Pour 100 propositions par jour |
|---|---|---|---|
| **Un champ de plus dans l'appel de tri (retenu)** | ~80 en entrée, ~80 en sortie | ~0,00005 $ | ~0,005 $ par jour |
| Un second appel, le corps renvoyé | ~1 600 en entrée, ~80 en sortie | ~0,0002 $ | ~0,02 $ par jour |

- Le champ `synthesis` : un tableau de chaînes, deux au plus, 140 signes chacune au plus, coupé dans le code (pas de
  `maxItems` dans le schéma : tous les fournisseurs ne le prennent pas en mode strict). Absent ou illisible, il vaut
  `[]` : une synthèse manquée ne fait pas échouer le tri.
- La consigne : ce que dit le mail et ce qu'il demande, au registre neutre, sans « je » ni « tu », sans code, mot de
  passe, numéro, lien, adresse ni montant recopié. La consigne ne suffit pas : le masque passe après.
- La synthèse est **masquée avant d'être écrite** en base (colonne `proposals.synthesis`), comme la raison. Le texte
  du modèle en clair n'est jamais gardé.
- **B1, la synthèse à la demande** d'un mail rangé par une règle, est un petit appel à part (tâche 10) : la règle n'a
  pas lu le mail. ~1 300 jetons en entrée, ~80 en sortie, ~0,00017 $ par mail.

### 2. Le masque : une liste de motifs, dans Acedia seulement

Un module pur, `triage/mask.ts`, une fonction `mask(text: string): string`. Chaque motif trouvé devient `[masqué]`.
Le résultat est stable : masquer deux fois rend la même chose. Les motifs, dans cet ordre :

- **Lien** (lien de réinitialisation, lien à jeton) : `https?://` puis tout ce qui n'est pas une espace.
- **IBAN**, avec ou sans espaces : deux lettres, deux chiffres, puis 11 à 30 lettres ou chiffres.
- **Mot-clé** (mot de passe, code, PIN, identifiant) : le mot qui suit `code`, `pin`, `otp`, `mot de passe`,
  `mdp`, `password`, `identifiant`, `login`, `clé`, `jeton` ou `token`, avec `:` ou `=` facultatif.
- **Longue suite de chiffres** (carte bancaire, téléphone, numéro de dossier) : 9 chiffres ou plus, séparés au plus
  par une espace, un point ou un tiret.
- **Code seul** (code à usage unique) : 6 à 8 chiffres collés, entre deux limites de mot.
- **Jeton** (clé d'API, JWT par morceaux) : 20 signes ou plus parmi lettres, chiffres, `_` et `-`, avec au moins
  un chiffre et une lettre.

- **Ce qui reste** : les dates (`25/11/2026`, `2026-11-25`), les heures, les montants courts (`12,50 €`), les années,
  les adresses mail. Une adresse n'est pas un secret, et l'urgence d'une règle dit « De : … ». La consigne du modèle
  demande déjà de ne pas la recopier.
- **Où il passe** : à l'écriture (la synthèse, la raison) et aux trois sorties, sur tout texte qui sort. Les sorties :
  `emitEvent` (`title`, `lines`), `toContractCard` (`title`, `lines`, `reason`, pour toutes les cartes, celles de
  l'agent comprises), `day.digest` (`title`, `ref.title`, `synthesis`). Trois points de passage, et les tests de fuite
  les couvrent tous. Voir la question 3.
- **Pas partagé avec Avaritia.** Le contrat ne crée un paquet commun que si deux projets en ont réellement besoin
  (« Types »). Avaritia ne lit aucun mail : elle reçoit la synthèse déjà masquée. Si elle masque un jour ses propres
  textes, la liste se recopie avec ses tests. Voir la question 9.

### 3. La borne de A10, et le plafond

- **Un usage à part, `digest`** : chaque synthèse à la demande est comptée par `recordCost` avec
  `purpose = 'digest'`. `spentToday` prend ce troisième usage. Pas de migration : la colonne est un texte libre.
- **Deux réglages d'instance**, dans la table `settings`, servis et changés par `GET` et `PUT /api/settings`
  (`triage/routes.ts:118-138`), à côté des deux seuils :
  - `digestPerCall` : le nombre de synthèses écrites par appel du bilan. **20 par défaut**, de 0 à 100 ; 0 coupe la
    synthèse à la demande. Vingt mails couvrent une journée ordinaire ; un reste passe à l'appel suivant.
  - `digestDailyCapUsd` : le plafond du jour pour cet usage. **0,05 $ par défaut** (~290 synthèses), de 0 à 5.
- Les défauts vivent dans le code, comme `DEFAULT_BULK_THRESHOLD` ; la valeur est une donnée de l'instance. Voir les
  questions 1 et 2.

### 4. L'écran lit `bulk` du serveur

- Une seule fonction, `isBulk(db, proposal)` dans `triage/proposals.ts` : vrai quand la proposition est `pending` et
  que sa confiance atteint `Math.min(bulkThreshold, threshold)`. C'est la lecture du critère 5 : le seuil de
  validation groupée, borné par le seuil de tri, comme `triage/routes.ts:44` et le plan des textes (§ 2). Voir la
  question 8.
- Elle sert deux fois : `bulk: true` sur la carte du contrat, et `bulk?: true` sur `ProposalView`, que la liste des
  mails sert déjà à l'écran (`withProposal`, `pipeline.ts:524-527`). L'écran garde les réglages pour ses phrases
  (« sous le seuil de 95 % », « Tout valider au-dessus de 85 % ») ; il ne calcule plus le groupe.

### 5. La carte d'une proposition

| Champ | Valeur |
|---|---|
| `id` | `mail:<id du mail>`, distinct des cartes de l'agent (des nombres) |
| `action`, `effect` | `mail.validate`, `write` |
| `kind` | « Proposition de tri » |
| `title` | l'objet du mail, masqué |
| `lines` | la synthèse, masquée, deux lignes au plus ; `[]` pour une proposition d'avant ce chantier |
| `reason` | la raison du tri, masquée |
| `importance` | `normal` si le tri la juge urgente (`proposals.importance = 'urgent'`), sinon `low` |
| `bulk` | `true` selon `isBulk`, sinon absent ; jamais `sends`, jamais `options` |
| `fields` | `box` (« Boîte », un choix) et `tags` (« Étiquettes », `multiple`), détaillés sous le tableau |
| `status`, `at`, `link` | `pending` ; `proposals.created_at` ; `mailLink(id)` |

- **`fields`** : `box` a pour choix les boîtes, `trash` « Corbeille » et `spam` « Spam », et pour `value` la boîte
  proposée (`[]` si aucune) ; `tags` a pour choix les étiquettes, et pour `value` les étiquettes proposées.
- **Les propositions servies** : celles que montre l'À valider, par le même filtre (`viewFilter('pending')`,
  `gmail/store.ts:136-140`) : `pending`, et le mail encore en boîte de réception.
- **Seulement pour `status=pending`.** `/cards?status=done` ou `refused` ne sert que les cartes de l'agent :
  `proposals` n'a pas l'heure de la décision. `accept` et `refuse` rendent la carte tranchée, avec son statut. Un
  `shortcut:` le dit dans le code.
- L'ordre : toutes les cartes par `at`, la plus récente d'abord.

### 6. Le geste

- **Le corps est strict** : `{ input?, values?, answer? }`, toute autre clé vaut `400`. `answer` vaut toujours `400`
  chez Acedia : aucune de ses cartes n'a d'`options`.
- **Une carte `mail:<id>`** : `accept` sans corps appelle `validate` ; `accept { values }` appelle `correct` avec la
  boîte et les étiquettes résolues (une clé absente garde `value`) ; `refuse` appelle `refuse`. Les erreurs du
  domaine : `NotFoundError` 404, `ConflictError` 409 (déjà tranchée, geste en cours), `BadRequestError` 400.
- **Les `400` du contrat** : clé inconnue ; choix hors des `choices` ; `box` sans exactement un choix ; `values` avec
  `input` ; `values` avec `answer` ; `values` sur une carte de l'agent (sans `fields`) ; `input` sur une proposition.
  Une proposition sans boîte, corrigée sans clé `box` : 400, « Choisir une boîte ».
- **Une carte de l'agent** : rien ne change, sauf le corps strict.

### 7. Le bilan filtré

- `boxes` : un tableau d'identifiants, 50 au plus. `[]` ne garde rien et n'appelle rien. Schéma strict : une clé
  inconnue vaut `400`.
- **Sans `boxes`**, le bilan rend exactement ce qu'il rend aujourd'hui : ni `box`, ni `synthesis`, aucun appel.
- **Avec `boxes`**, un mail est gardé si, au moment du bilan :
  - sa boîte actuelle (la première de ses étiquettes qui a le rôle `box`) est dans `boxes`, et il n'est ni dans la
    corbeille ni dans le spam ;
  - sa proposition dit l'accord : `source = 'rule'` et `status = 'auto'`, ou `status` `accepted` ou `corrected`.
- `received` et `done` ne gardent que ces mails ; les éléments des cartes de l'agent sortent (ce ne sont pas des
  mails). `pending` ne change pas. Le filtre s'applique avant la limite de 200.
- Chaque élément gardé porte `box: { id, name }` et `synthesis` (les lignes jointes par un saut de ligne) quand elle
  existe.
- **Rangé seul par l'IA, puis rangé à la main** : `onManualFile` passe aussi une proposition `ai` + `auto` à
  `corrected`, quelle que soit la boîte. Le geste de CrOliX vaut accord. L'annulation remet le statut d'avant (le
  `snapshot`, `pipeline.ts:387-389`). Voir la question 5.

### 8. Un seul signal par proposition

- Une proposition qui attend n'émet plus rien à elle seule. Une proposition rangée seule garde `mail.triaged`.
- **Pour que l'écran suive**, la passe du tri émet à sa fin un seul `mail.changed`, `log`, `data: { proposed: n }`,
  sans objet ni ligne, quand elle a créé au moins une proposition en attente. C'est le type que la synchro émet déjà
  (`gmail/sync.ts:226`) : un poste mis à jour, pas une carte doublée. Voir la question 4.
- **L'urgence d'une règle perd son extrait** : `lines` ne garde que « De : … ». Voir la question 6.

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit rouges ; le développeur écrit le code ; le
**reviewer** relit le diff. Le serveur d'Acedia est confié à `dev-core`, comme au chantier précédent : il n'y a pas
d'agent propre à Acedia. Une tâche se ferme sur les barrières d'Acedia au vert : `npm test`, `npm run lint`,
`npm run typecheck`, `npm run format:check`, `npm run check:colors`, et le contrôle public
`node ../lun-docs/tools/check-repo.mjs --public .`. lun-docs : `npm run check`.

**L'ordre et le parallèle.**

- **1, 2 et 3 partent ensemble** : aucun fichier commun.
- **4** attend 2. **5 et 6** attendent 4, et partent ensemble (5 : `pipeline.ts`, `events.ts` ; 6 :
  `contract/routes.ts`, `proposals.ts`, `types.ts`).
- **7** attend 6. **8** attend 6. **9** attend 5. **7, 8 et 9 partent ensemble** (7 : `contract/routes.ts` ; 8 :
  `views/` ; 9 : `contract/catalog.ts`, `pipeline.ts`).
- **10** attend 9. **11** attend tout. **12** ferme.

1. - [ ] **La voix neutre** (`testeur`, puis `dev-core` ; `contract/routes.ts:39`, `pina/agent.ts:51-61`). Parallèle.
   - **Tests d'abord** : un test lit les huit constantes (`PAUSED`, `CAP`, `TOO_LONG`, `EMPTY`, les quatre de
     `FAILED`) et refuse `je`, `j'`, `me`, `m'`, `ma`, `mon`, `mes`, `tu`, `te`, `t'`, `ton`, `ta`, `tes`, et les
     impératifs `dis-moi`, `réessaie`, `choisis`, `reformule` (mots entiers, apostrophe droite ou courbe). Les
     constantes sont exportées pour ce test. Les tests qui citent ces textes (`pina/agent.test.ts`,
     `contract/agent.test.ts`, `contract/pause.test.ts`) suivent.
   - **Le code**, au registre neutre (`ecriture.md`) ; les mots du dictionnaire :
     - `PAUSED` : « Acedia est en pause : rien ne se fait tant qu'elle n'est pas reprise. »
     - `CAP` : « Plafond de dépense du jour atteint : reprise demain, ou plafond à relever dans Réglages › Agent. »
     - `TOO_LONG` : « Arrêt : trop d'allers-retours pour cette demande. À reprendre par une partie, ou à découper. »
     - `EMPTY` : « Aucune réponse claire à cette demande. À reformuler. »
     - `FAILED.key` : « Le fournisseur d'IA refuse la clé : à vérifier dans Réglages › Fournisseurs d'IA. »
     - `FAILED.credit` : « Plus de crédit chez le fournisseur d'IA : à recharger, ou un autre modèle à choisir dans
       Réglages › Agent. »
     - `FAILED.unavailable` : « Le fournisseur d'IA ne répond pas pour le moment. Nouvel essai dans un instant. »
     - `FAILED.format` : « Le fournisseur d'IA a renvoyé une réponse illisible. Nouvel essai dans un instant. »
   - **Exclu** : les consignes au modèle (`REFUSED`, `LATE`…, `pina/prompt.ts`) ; les écrans ; Avaritia.
   - **Preuve** : le test de la voix rouge sur `main`, vert après.

2. - [ ] **Le masque** (`testeur`, puis `dev-core` ; nouveau `triage/mask.ts` et son test). Parallèle.
   - **Tests d'abord**, un corpus fixe et un générateur à graine fixe (pas de dépendance nouvelle : une boucle et un
     petit générateur pseudo-aléatoire dans le test) :
     - chaque motif du choix 2 : au moins trois cas vrais (« Code de vérification : 482917 », « IBAN FR76 3000 6000
       0112 3456 7890 189 », « 4970 1012 3456 7890 », « 06 12 34 56 78 », « mot de passe : Hibou-Lune-42 »,
       « https://exemple.test/reset?token=abc », « sk-test-AAAABBBBCCCC1111DDDD ») ; aucun ne survit, ni en entier,
       ni ses chiffres collés ;
     - 500 secrets tirés par famille (chiffres groupés par 2, 3 ou 4 ; IBAN ; jetons) : aucun ne survit ;
     - **ce qui reste** : `25/11/2026`, `2026-11-25`, `14 h 30`, `12,50 €`, `2026`, « 3 mails », une adresse
       `nom@exemple.test`, une phrase sans chiffre ;
     - `mask(mask(x)) === mask(x)` sur tout le corpus ; une chaîne vide rend une chaîne vide.
   - **Le code** : les six motifs, dans l'ordre du choix 2, une ligne de commentaire par motif pour dire ce qu'il
     attrape.
   - **Exclu** : tout appel du masque ailleurs (tâches 4 à 6, 9) ; Avaritia.
   - **Preuve** : le test vert ; aucun faux positif du corpus « ce qui reste ».

3. - [ ] **Les tests de fuite, rouges** (`testeur` seul ; nouveau `contract/leak.test.ts`). Parallèle. Ils restent
   rouges jusqu'à la tâche 10 ; chaque tâche suivante en passe une partie au vert.
   - **Le mail canari**, dans le faux Gmail (`testing/fake-gmail.ts`, `testing/harness.ts`) : un objet « Votre code
     482917 » ; un corps qui porte les secrets du corpus de la tâche 2 et une phrase unique (« Le canari bleu chante
     sous la lune de novembre près du vieux moulin »).
   - **Un classeur désobéissant**, écrit dans le test : sa `reason` et sa `synthesis` recopient les secrets et la
     phrase ; sa `summarize` (tâche 10) aussi. Deux mails : l'un laissé en attente, l'autre rangé par une règle avec
     l'étiquette Urgent, dans une boîte `b1`.
   - **Les sorties lues**, en JSON : `GET /lun/v1/cards` ; `POST /lun/v1/actions/day.digest` sans `boxes`, puis avec
     `boxes: ['b1']` (la synthèse à la demande passe) ; `eventsSince` et le rejeu de `GET /lun/v1/events` ; la carte
     rendue par `accept` et par `refuse`.
   - **Les assertions** : aucun secret du corpus, ni ses chiffres collés ; aucune fenêtre de six mots du corps
     (casse et espaces ramenées) ; aucun `Extrait :`. Plus une boucle de 50 mails tirés (secrets du générateur de la
     tâche 2 dans le corps et recopiés par le classeur) sur les mêmes sorties.
   - **Exclu** : `mail.read`, `mail.list` et `mail.search`, qui servent le mail au core par une lecture demandée (la
     spec, § 5.1 : « On ne retire rien ») ; le code.
   - **Preuve** : rouges sur `main` pour la bonne raison (le snippet dans l'événement, l'objet en clair, l'absence de
     carte).

4. - [ ] **La synthèse dans l'appel de tri** (`testeur`, puis `dev-core` ; `triage/classifier.ts`,
   `triage/llm-classifier.ts`, `triage/proposals.ts`, `triage/pipeline.ts:286-294`, `db.ts`, `demo/demo.ts`). Après 2.
   - **Tests d'abord** (`triage/llm-classifier.test.ts`, `triage/pipeline.test.ts`) : le schéma envoyé porte
     `synthesis`, requis ; la consigne la demande ; trois lignes rendues en gardent deux ; une ligne de 300 signes est
     coupée à 140 ; une `synthesis` absente ou d'un autre type vaut `[]` sans faire échouer le tri ; la synthèse et
     la raison sont écrites masquées (lues en base) ; une proposition de règle n'a pas de synthèse ; la migration
     passe sur une base qui a déjà des propositions (`synthesis` nulle).
   - **Le code** : `Classification.synthesis: string[]` ; `Answer` avec `synthesis` (`.catch([])`) ; la consigne
     (`SYSTEM`, `:43-53`) et le schéma (`schemaFor`, `:25-41`) ; la coupe à 2 × 140 ; la migration
     `ALTER TABLE proposals ADD COLUMN synthesis TEXT` (un tableau JSON), en fin de `MIGRATIONS` ; `saveProposal` et
     `getProposal` la portent, `mask` appliqué à la raison et à la synthèse avant `saveProposal`. Le classeur de la
     démo (`demo/demo.ts:235-250`) rend une synthèse par mail, et un mail de la démo porte un faux code à masquer.
   - **Exclu** : `ProposalView` (l'écran n'affiche pas la synthèse) ; les sorties ; la synthèse à la demande.
   - **Preuve** : tests verts ; une proposition de la démo a sa synthèse masquée en base.

5. - [ ] **Un seul signal, des événements sans fuite** (`testeur`, puis `dev-core` ; `triage/pipeline.ts`,
   `contract/events.ts`). Après 4, en parallèle de 6.
   - **Tests d'abord** (`triage/pipeline.test.ts`, `contract/events.test.ts`) : une proposition qui attend n'émet
     aucun événement à elle seule, quelle que soit son importance ; une passe qui en crée émet un seul `mail.changed`
     `log`, `data: { proposed: n }`, sans `lines` ; une passe sans proposition nouvelle n'en émet pas ; une proposition
     rangée seule émet `mail.triaged` comme aujourd'hui ; l'urgence d'une règle n'a plus que « De : … » ;
     `emitEvent` masque `title` et `lines`. Les tests de `mail.pending` (`pipeline.test.ts:191-201`, `:219`,
     `:524-526`) sont réécrits.
   - **Le code** : `pipeline.ts:296-308` n'émet plus que pour `auto` ; `triageNew` compte les propositions en attente
     de la passe et émet `mail.changed` à la fin, même quand la passe s'arrête sur une pause ; `:245` retiré ;
     `mask` dans `emitEvent` (`events.ts:37-56`).
   - **Exclu** : la synchro ; les autres événements, sauf le masque commun ; l'écran (il suit déjà `mail.*`).
   - **Preuve** : tests verts ; la partie « événements » de la tâche 3 au vert.

6. - [ ] **Les propositions dans `/cards`** (`testeur`, puis `dev-core` ; `contract/routes.ts:41-58`, `:193-201`,
   `triage/proposals.ts`, `types.ts`, `views/src/lib/types.ts` par `npm run sync-types`). Après 4, en parallèle de 5.
   - **Tests d'abord** (`contract/cards.test.ts`) : `/cards` répond sans agent (le test fige l'existant) ; chaque
     proposition de l'À valider sort en carte, avec le tableau du choix 5 ; un mail sorti de la boîte de réception
     n'y est plus ; une proposition `auto` ou `refused` non plus ; `importance` `normal` pour une urgente, `low`
     sinon, `none` compris ; `bulk` à 84, 85 et 86 contre `bulkThreshold` 85, et quand `threshold` passe sous
     `bulkThreshold` ; `bulk` absent d'une carte qui a `sends` ; `fields` : choix des boîtes, Corbeille, Spam, des
     étiquettes, `multiple` sur `tags` seulement ; `title`, `lines`, `reason` masqués, et ceux d'une carte de l'agent
     aussi ; l'ordre par `at` ; `status=done` ne sert que l'agent ; `ProposalView.bulk` dans
     `GET /api/mail?view=pending`.
   - **Le code** : `isBulk` dans `proposals.ts` ; `proposalView` pose `bulk` ; un `proposalCard(db, proposal)` à côté
     de `toContractCard` ; `ContractCard` gagne `reason`, `importance`, `bulk`, `fields` ; `toContractCard` masque ;
     `/cards` fusionne les deux listes pour `pending`.
   - **Exclu** : le geste (tâche 7) ; l'écran (tâche 8) ; le Journal.
   - **Preuve** : tests verts ; la partie « `/cards` » de la tâche 3 au vert.

7. - [ ] **Le geste sur une proposition** (`testeur`, puis `dev-core` ; `contract/routes.ts:31`, `:203-237`). Après 6.
   - **Tests d'abord** (`contract/cards.test.ts`) : `accept` sans corps range comme `mail.validate` (statut
     `accepted`, une ligne au Journal, la carte rendue `done`) ; `accept { values: { box: ['b2'] } }` range comme
     `mail.correct` (statut `corrected`, étiquettes gardées) ; `values: { tags: [] }` retire les étiquettes et garde
     la boîte ; `refuse` comme `mail.refuse` ; un second geste rend 409 ; `mail:inconnu` rend 404. **Chaque `400`** du
     choix 6, un test par cas, rien d'écrit à Gmail. Une carte de l'agent garde `accept`, `accept { input }` et
     `refuse` comme aujourd'hui, et `values` y vaut 400. Les actions `mail.validate`, `mail.correct`, `mail.refuse`
     répondent comme avant.
   - **Le code** : `Accept` strict avec `values: z.record(z.string(), z.array(z.string()))` et `answer` ; `decide`
     choisit par le préfixe `mail:` ; un `answer(…)` pour les erreurs du domaine, comme `triage/routes.ts:25-34`.
   - **Exclu** : `rememberSender` (pas dans le contrat) ; la validation groupée (côté core) ; l'écran.
   - **Preuve** : tests verts.

8. - [ ] **L'écran lit `bulk`** (`testeur`, puis `dev-front` ; `views/src/lib/mail/Pending.svelte`,
   `views/src/lib/settings/Threshold.svelte`, `views/src/testing/fake-client.ts`, `app/src/catalogue/Catalogue.svelte`).
   Après 6, en parallèle de 7 et 9.
   - **Tests d'abord** (`views/src/lib/mail/Pending.test.ts`) : « Tout valider » ne valide que les mails dont
     `proposal.bulk` est vrai, même quand leur confiance dit autre chose ; désactivé sans aucun `bulk` ; le libellé
     garde le seuil des réglages. Les tests de `:40` et `:291` ajoutent `bulk` à leurs propositions. Si la question 2
     est acceptée : deux champs dans Réglages › Tri, « Synthèses par bilan » et « Plafond du jour des synthèses »,
     lus et écrits par `getSettings` et `putSettings`.
   - **Le code** : `above = items.filter((m) => m.proposal?.bulk)` (`:98`) ; `bulk` des réglages ne sert plus qu'au
     libellé (`:144`, `:453-454`). Le catalogue de la démo des vues pose `bulk` sur ses exemples.
   - **Exclu** : le clavier, les groupes, la correction, le glissé ; la synthèse à l'écran ; le kit.
   - **Preuve** : tests verts ; Chrome à la tâche 11.

9. - [ ] **Le bilan filtré par boîte** (`testeur`, puis `dev-core` ; `contract/catalog.ts:418-482`,
   `triage/pipeline.ts:495-501`). Après 5, en parallèle de 7 et 8.
   - **Tests d'abord** (`contract/digest.test.ts`) : sans `boxes`, la réponse est identique à celle de `main`
     (instantané) ; avec `boxes`, un mail par cas : rangé par une règle (gardé), proposition validée (gardé), corrigée
     (gardé), rangé seul par l'IA (jeté), rangé seul par l'IA puis à la main (gardé), en attente (jeté), dans une
     autre boîte (jeté), déplacé depuis dans une boîte demandée (gardé, avec sa boîte d'arrivée), mis à la corbeille
     (jeté), rangé à la main sans proposition (jeté) ; `box: { id, name }` ; `synthesis` quand elle existe ; les cartes
     de l'agent sortent ; `pending` inchangé ; `boxes: []` ne garde rien ; une clé inconnue vaut 400 ; le filtre
     passe avant la limite de 200 ; une annulation remet le statut d'avant.
   - **Le code** : le schéma strict avec `boxes` ; le filtre en SQL (`json_each` sur `label_ids`, jointure sur
     `proposals`) ; `box` et `synthesis` ; `mask` sur `title`, `ref.title` et `synthesis` ; `onManualFile` passe
     `ai` + `auto` à `corrected`.
   - **Exclu** : la synthèse à la demande (tâche 10) ; la mesure par boîte (D3) ; les règles à plusieurs valeurs (#106).
   - **Preuve** : tests verts ; la partie « bilan » de la tâche 3 au vert, sauf la synthèse à la demande.

10. - [ ] **La synthèse à la demande, B1** (`testeur`, puis `dev-core` ; `triage/classifier.ts`,
    `triage/llm-classifier.ts`, `contract/catalog.ts`, `contract/costs.ts`, `llm/models.ts:137`, `triage/routes.ts`,
    `app.ts`, `main.ts`, `demo/demo.ts`). Après 9.
    - **Tests d'abord** (`contract/digest.test.ts`) : avec `boxes`, un mail de règle sans synthèse en reçoit une,
      masquée, écrite en base, servie ; le second appel n'en refait pas ; 25 mails et `digestPerCall` 20 : 20
      synthèses, puis 5 à l'appel suivant ; `digestPerCall` 0 : aucune ; **aucun appel** sans `boxes`, en pause du
      core, en pause locale, en mode dégradé, avec `spentToday('digest')` au plafond, sans classeur, sans Google ;
      chaque appel écrit une ligne de coût `digest` avec `calls: 1` ; le plafond est relu avant chaque appel ; un
      crédit épuisé passe en dégradé et arrête la boucle ; une clé refusée l'arrête ; une réponse illisible saute ce
      mail ; une panne passagère arrête la boucle et le bilan sort quand même ; deux bilans en même temps n'écrivent
      pas deux fois la même synthèse ; `GET` et `PUT /api/settings` lisent et bornent les deux réglages.
    - **Le code** : `Classifier.summarize?(mail)` rend `{ synthesis, usage }`, une consigne courte sans boîtes ni
      exemples ; `AppDeps.classifier?: () => Classifier | undefined`, par défaut `classifierFor` (`llm/keys.ts:296`),
      passé à `registerCatalog` ; `purpose` prend `digest` (`costs.ts:19`, `models.ts:137`) ; les deux réglages ; un
      verrou de module pour un bilan à la fois. Le classeur de la démo a sa `summarize`.
    - **Exclu** : un plafond pour le tri lui-même ; la mesure par boîte ; tout code du core.
    - **Preuve** : tests verts ; **toute la tâche 3 au vert**.

11. - [ ] **Le contrat 1.5 et la preuve** (`dev-core` pour `identity.ts`, puis `dev-front` pour Chrome). Après tout.
    - `CONTRACT = '1.5'` (`identity.ts:2`) ; `contract/health.test.ts` le dit. Le passage se fait en dernier : un core
      qui lit 1.5 passe `boxes` et lit les propositions dans `/cards`.
    - **La démo**, dans le worktree d'Acedia : `npm run build`, puis `npm run demo` (`README.md:42-50`). Base en
      mémoire, faux Gmail, aucun réseau, port 8797 ; le jeton d'appareil collé dans la console. **Jamais la prod, ni
      la vraie page de Google** : elles ont les vrais mails de CrOliX.
    - **À l'écran** : l'À valider montre ses propositions ; « Tout valider au-dessus de … » valide celles que le
      serveur marque `bulk`, pas les autres ; une correction et un refus marchent ; une nouvelle proposition arrive
      sans recharger la page (une synchro de la démo) ; au téléphone (390 px), le glissé marche.
    - **Par la console** de la démo, avec son jeton : `GET /lun/v1/cards` montre les cartes `mail:…`, leurs
      `fields`, `bulk`, `importance`, la synthèse et le faux code masqués ; `POST /lun/v1/actions/day.digest` avec
      et sans `boxes` ; `POST /lun/v1/cards/mail:…/accept` avec `values`, puis un `400` hors des choix.
    - **Relevé** dans la PR : captures à chaque largeur et réponses JSON, données de la démo seulement ; la preuve de
      bout en bout décrite, comme le demande le niveau.

12. - [ ] **La livraison** (`livreur`). Une PR en brouillon par dépôt, au gabarit de `lun-livrer` : Lun'Acedia (ferme
    lun-acedia#107) et lun-docs (ce plan, ses coches). Pas de release dans ce chantier.

## Les questions pour CrOliX

Une à une, chacune avec sa recommandation. Le plan est écrit pour la recommandation.

1. **Le plafond de la synthèse à la demande.** Acedia n'a de plafond que pour l'agent. Faut-il un usage `digest` à
   part, avec son plafond du jour ? **Recommandé : oui**, 0,05 $ par jour par défaut, et 20 synthèses par appel. Le
   critère « jamais au plafond » a alors un plafond à tester. Autre voie : le plafond de l'agent, mais il compte une
   autre dépense.
2. **Ces deux réglages à l'écran.** Faut-il deux champs dans Réglages › Tri, ou seulement la route ? **Recommandé :
   les deux champs** (tâche 8) : en recette, tout se règle par les écrans.
3. **Masquer aussi l'objet du mail, et toutes les cartes.** Un objet peut porter un code. Le masque passe sur les
   titres des événements, des cartes et du bilan, et sur les lignes des cartes de l'agent. **Recommandé : oui.** Le
   prix : un brouillon de l'agent qui cite un numéro le montre masqué au core ; l'écran d'Acedia le montre en clair.
4. **Le signal de l'écran.** Sans `mail.pending`, l'écran d'Acedia ne voit plus arriver une proposition. **Recommandé :
   un seul `mail.changed` en `log` en fin de passe**, sans objet, le type que la synchro émet déjà. Ce n'est pas une
   carte doublée : il ne dit rien de la proposition.
5. **Rangé seul par l'IA, puis rangé à la main.** Ce mail compte-t-il comme un accord pour le bilan filtré ?
   **Recommandé : oui**, la proposition passe à `corrected`. Le geste de CrOliX vaut accord, comme une correction.
6. **L'urgence d'une règle perd son extrait.** Le critère 7 interdit un extrait du corps dans les événements.
   **Recommandé : garder « De : … » seul.** La notification d'urgence montre l'expéditeur et l'objet, masqué.
7. **Les deux phrases de plus.** `FAILED.credit` et `FAILED.unavailable` tutoient (« choisis », « Réessaie »), sans
   dire « je ». **Recommandé : les rendre neutres aussi**, dans la tâche 1. Le critère dit « je » ou « tu ».
8. **La lecture du seuil de A5.** « Le seuil de validation groupée et le seuil de tri » se lit comme
   `min(bulkThreshold, threshold)`, ce que fait déjà l'écran. **Recommandé : cette lecture.** L'autre (atteindre les
   deux) ne mettrait rien en groupe tant que le seuil de tri vaut 100, le réglage par défaut.
9. **Le masque partagé avec Avaritia.** **Recommandé : non.** Avaritia ne lit aucun mail et reçoit la synthèse déjà
   masquée ; le contrat ne crée un paquet commun qu'au second vrai besoin.

## Hors périmètre

- La mesure par boîte (D3) et le seuil par boîte : au rodage.
- Les règles à plusieurs valeurs (lun-acedia#106).
- Tout code du core, et la carte de décision du kit (K1).
- `mail.read`, `mail.list` et `mail.search` : ils servent le mail au core par une lecture demandée (spec, § 5.1).
- La synthèse à l'écran d'Acedia ; une synthèse pour les propositions d'avant ce chantier.
- `/cards?status=done` ou `refused` pour les propositions.
- Lun'Avaritia (V1, V2 du plan des textes), Lun'Luxuria.

## Limites

- **Non mesuré** : les jetons du choix 1 sont estimés depuis la taille de la consigne et du corps coupé, pas relevés
  sur un vrai appel. La tâche 4 peut relever l'`usage` d'un appel de la démo, qui ne passe pas par un modèle :
  la mesure vraie viendra au rodage, par la ligne de coût `triage`.
- **Non vérifié dans le code** : ce que le core fait de `mail.pending` aujourd'hui (le core est privé, hors de ce
  plan) ; que le jeton d'appareil de la démo ouvre `/lun/v1` (lu : `requireToken` à `contract/routes.ts:107`, sans
  test de la démo) ; que tous les fournisseurs rendent un tableau `synthesis` en mode strict (Anthropic, OpenAI et
  Gemini ont des schémas différents : `.catch([])` couvre un refus).
- **Le masque est une liste** : il rate un secret qui ne ressemble à aucun motif (un mot de passe sans mot-clé, un
  code de 4 chiffres seul). La consigne du modèle est la première barrière, le masque la seconde.
- **Les adresses mail ne sont pas masquées** (choix 2). La consigne demande de ne pas les recopier dans la synthèse.
- **Une proposition d'avant ce chantier** sort en carte sans `lines`.
- **Le verrou du bilan vaut pour un seul processus** : Acedia n'en lance qu'un.
