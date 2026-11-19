# Trois promesses tenues : les chevauchements d'agenda, l'agent sans nom en dur, l'export qui se télécharge. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** le chapeau Lun-Ecosystem/lun-docs#185 (`niveau:standard`), décidé par CrOliX le 19/11 ; aucune issue
> ouverte dans lun-acedia ni dans lun-avaritia sur ces trois points (cherché le 19/11).
>
> **État : rédigé le 19/11, à contester puis à valider par CrOliX.** Les points de « À trancher » se valident avec
> le plan ; aucune tâche de code ne part avant.
>
> Code relu sur `main` : lun-acedia `40f529b`, lun-avaritia `9602d13`, lun-docs `167e8a4`. Le graphe d'abord (ceux
> d'Acedia et d'Avaritia datent du 16/11, un commit de retard), puis chaque ligne citée relue dans le code.

**But :** les trois petites promesses que le recadrage fait entrer dans le VIP sont tenues et prouvées sur le
laptop. Acedia repère deux événements qui se chevauchent et propose, par une carte, d'en déplacer un. Aucun texte
vu de l'utilisateur ne porte « Pina ». L'export d'Avaritia se télécharge depuis l'écran.

**Source :** le [recadrage du VIP](../specs/2026-11-19-recadrage-vip.md) : § 3.1 (« Repérer les événements qui se
chevauchent et proposer de les déplacer : **Absent** » ; « "Pina" reste écrit en dur dans un message visible »),
§ 3.2 (« l'export écrit sur le disque du serveur, sans téléchargement »), § 6.1, § 7 point 3 ; `vision.md`, « Ce que
le VIP tient », point 1 ; la ligne d'arrivée d'Acedia, point 3 (« son agent n'a plus aucun nom en dur »,
[état cible](../specs/2026-11-10-etat-cible-cadrage.md), § 4.4) ; `standards/workflow.md:66-68` : « En parallèle,
seulement ce qui est indépendant (deux dépôts, deux tâches sans fichier commun) ».

**Critères de fin**, ceux du chapeau, chacun prouvé en local :

1. **Les chevauchements (Acedia).** Deux événements qui se chevauchent donnent une carte qui propose d'en déplacer
   un. Acceptée, elle déplace l'événement dans Google ; refusée, elle ne change rien et ne revient pas pour la même
   paire. Rien n'est déplacé sans validation, quel que soit le mode de l'agent. Tâches 1 à 3, preuve tâche 5.
2. **« Pina » hors des textes visibles (Acedia).** Aucun texte vu de l'utilisateur ni envoyé par le contrat ne
   porte un nom d'agent en dur : il lit le nom réglé, « Agent » par défaut. Tables, routes, dossiers, types et clés
   de réglage ne changent pas. Tâches 3 et 4, preuve tâche 5.
3. **L'export qui se télécharge (Avaritia).** L'export se récupère depuis l'écran, sans accès au disque du serveur,
   jusqu'aux 20 000 fiches de la démo. Tâches 6 à 9.
4. **Les textes.** Les README et les docs des deux dépôts disent ce qui est tenu (tâches 5 et 9) ; la feuille de
   route et le site, à la fermeture (tâche 10).

| Dépôt, branche                          | Issue                    | Niveau     |
| --------------------------------------- | ------------------------ | ---------- |
| `lun-acedia`, `feat/trois-promesses`    | lun-docs#185             | `standard` |
| `lun-avaritia`, `feat/trois-promesses`  | lun-docs#185             | `standard` |
| `lun-docs`, `docs/trois-promesses`      | lun-docs#185, ce plan    | `trivial`  |

**Une PR par dépôt.** Les deux PR de code citent le chapeau ; la PR de lun-docs le ferme, une fois les deux autres
fusionnées. Aucune ne touche au contrat satellite : le type d'un événement est une chaîne libre
(`standards/contrat-satellite.md:44`), et aucune route ne change.

## Ce que le code fait aujourd'hui

### Acedia, l'agenda

- **Le cache.** `calendar_events` garde, par événement : agenda, id, titre, début, fin (en ISO et en ms), journée
  entière, lieu, rappels (`server/src/db.ts:100-113`). Ni la disponibilité (« libre » ou « occupé »), ni la réponse
  à une invitation, ni l'id de la récurrence : `GoogleEvent` ne les lit pas (`server/src/agenda/calendar.ts:18-26`).
- **Les récurrences** arrivent dépliées : `singleEvents: 'true'` (`calendar.ts:158`). Chaque occurrence a son id ;
  un `PATCH` sur cet id ne déplace qu'elle.
- **Les agendas** synchronisés sont ceux cochés dans Google Agenda ; `writable` vaut 0 pour un agenda en lecture
  seule, fêtes ou anniversaires (`calendar.ts:209-232`). La fenêtre va de -30 jours à +365 jours (`:160-163`).
- **Le passage régulier.** `main.ts:103-106` lance `syncAgenda` toutes les 60 s (`SYNC_INTERVAL_MS`), seulement
  quand Google est configuré. `syncAgenda` émet `agenda.changed` quand le cache change, puis lève une
  `AggregateError` si un agenda n'a pas pu être lu (`server/src/agenda/unified.ts:36-50`). Les rappels ont leur
  propre boucle à la minute, sur le cache seul (`server/src/agenda/reminders.ts:103-119`, lancée `main.ts:108`) ;
  ils ne sont émis qu'une fois par clé (`reminders_sent`, `:29-30`, `:83`).
- **« Chevauchement »** n'existe que dans l'affichage côte à côte (`views/src/lib/agenda/dates.ts:126-131`,
  `CalendarGrid.svelte:9`) et dans les filtres de plage (`eventsBetween`, `calendar.ts:87-93`). Aucune détection.
- **Déplacer** : l'action `event.update` du catalogue (`server/src/contract/catalog.ts:175-181`), effet `write`,
  appelle `updateEvent` (`calendar.ts:314-325`), qui fait le `PATCH` puis met le cache à jour. Son inverse existe :
  l'ancien événement est relu avant (`server/src/pina/inverse.ts:17`, `:28`), « Annuler » le remet.

### Acedia, les cartes de l'agent

- **La table** `pina_cards` : jour, tour, `call_id`, action, entrée, effet, statut (`pending`, `done`, `refused`,
  `failed`, `expired`), résultat, erreur, inverse, date de décision, `edited` (`db.ts:151-168`).
- **Une carte naît** dans la boucle du modèle seulement : une écriture demandée par le modèle devient une carte
  (`server/src/pina/agent.ts:399-421`, `addCard`, `server/src/pina/store.ts:58-69`). En mode « Faire tout de
  suite », une écriture s'exécute aussitôt (`agent.ts:417-418`).
- **Elle se décide** par `decideCard` (`agent.ts:168-196`), depuis l'écran (`POST /api/pina/cards/:id`,
  `server/src/pina/routes.ts:50-57`) ou depuis le core (`server/src/contract/routes.ts:205-216`). Une carte d'un
  autre jour est expirée et ne s'exécute pas (`agent.ts:178-183`) ; les cartes `pending` d'hier expirent à l'heure
  (`main.ts:115-122`) ; les cartes de plus de 30 jours sont effacées (`store.ts:149-158`).
- **Après chaque décision, `resume` relance le modèle** (`agent.ts:194`, `:309-328`) : il écrit le résultat des
  cartes du tour dans le fil, puis appelle le fournisseur. Pour une carte que personne n'a demandée, il relancerait
  le modèle sur un tour sans demande, avec le contexte `mail` par défaut (`:324-326`) : c'est un appel payant, et
  une réponse sur une carte que le modèle n'a pas proposée.
- **Ce que la carte dit** vient de `describe` (`server/src/pina/wording.ts`, copiée dans
  `views/src/lib/pina/wording.ts` par `npm run sync-types -w @lun-ecosystem/lunacedia-views`). Pour
  `event.update` : « Modifier un événement », le nom de l'événement s'il est dans le fil du jour, sinon
  « Identifiant », puis Titre, Début, Fin, Lieu de l'entrée (`wording.ts:91-94`, `:105-110`, `:182-187`).
- **Où on la voit.** Le fil place une carte sans message à la fin (« Never lost », `Thread.svelte:46-48`). Le
  compteur du lanceur vient du fil, lu au montage du panneau et à son ouverture (`PinaPanel.svelte:83-100`) ; rien
  ne le relit ensuite. App relit son état sur `agenda.*` (`app/src/App.svelte:155-158`), pas le fil de l'agent.
- **Le core** voit les cartes en attente par `GET /lun/v1/cards` (`contract/routes.ts:193-201`) et leur nombre dans
  le résumé du jour (`catalog.ts:466-470`). Aucune création de carte n'émet d'événement aujourd'hui.

### Acedia, le nom de l'agent

Le nom réglé vit dans `pina.name`, « Agent » par défaut (`store.ts:162-170`) ; l'écran le lit par
`agentIdentity`, « Agent » tant que les réglages ne sont pas lus (`views/src/lib/pina/identity.svelte.ts:17`). Le
lanceur, le panneau, le journal (« par … ») et le bandeau du brouillon l'emploient déjà (`Launcher.svelte:27`,
`PinaPanel.svelte:294`, `:303`, `Journal.svelte:57`, `Composer.svelte:176`).

Toutes les occurrences de « Pina » (recherche sans la casse, `git grep -n -i pina`), rangées :

- **Visible de l'utilisateur, à changer : une seule.** `views/src/lib/pina/pina.svelte.ts:44`, `'Pina ne répond
  pas'`, le texte d'un toast quand l'erreur n'est pas une `Error`.
- **Envoyé par le contrat : aucune.** `toContractCard` (`contract/routes.ts:41-59`), les événements et le résumé du
  jour n'en portent pas. Le relevé du 19/11 rangeait ici `server/src/contract/parity.ts:6`, `:9`, `:11` : ces trois
  textes ne sortent pas du serveur, seul `parity.test.ts` lit `PARITY`. Ils sont rangés avec le journal (point (i)).
- **Journal du serveur, à trancher (point (i)).** `server/src/main.ts:121` (« Fil de Pina », fixé par
  `server/src/main.test.ts:49`, `:54`) ; `server/src/pina/agent.ts:124` (« Pina : carte … décidée pendant son
  exécution ») ; `server/src/contract/routes.ts:210` (« Pina : reprise après la carte … ») ; le titre du rapport de
  l'outil d'évaluation, `server/scripts/pina-eval.ts:169`.
- **Doc, à trancher (point (j)).** `README.md:99` ; `docs/pina.md` (19 lignes, dont « par Pina » à `:60`) ;
  `docs/prouver-pina.md` (6 lignes, dont « Réglages › Pina », un écran qui s'appelle « Agent »,
  `views/src/lib/settings/Settings.svelte:105-106`) ; le commentaire de `.env.example:29`.
- **Nom interne, ne change pas.** Les tables `pina_cards`, `pina_messages` ; les routes `/api/pina/*` ; le dossier
  `server/src/pina/`, `views/src/lib/pina/` ; les types `PinaCard`, `PinaSettings`, `PinaState`, `PinaPanel` ; les
  clés de réglage `pina.*` ; l'usage `'pina'` des coûts et des modèles ; l'origine `'pina'` du journal ; la clé
  `lunacedia.pina.size` du navigateur ; les variables `PINA_EVAL_*` et le script `pina:eval` ; les commentaires du
  code (`base.css:8`, `Composer.svelte:197`, `MailReader.svelte:274`, `Thread.svelte:11`, `types.ts`,
  `contract/routes.ts:32`, `agent.ts:377`).
- **Les tests** qui écrivent « Pina » le donnent comme nom réglé (`store.test.ts:113`, `fake-client.ts:227`,
  `PinaSettings.test.ts:15`…) : ils éprouvent le réglage, ils restent.

Un test existe déjà pour ce genre de règle : `app/src/noAnima.test.ts` parcourt `app/src` et `views/src`, hors
tests, et retire les commentaires avant de chercher (`:25-34`). Sur `main`, la même recherche de `\bPina\b` ne
trouve que `pina.svelte.ts`.

### Avaritia, l'export

- **La route** `POST /api/export` (`server/src/brain/routes.ts:175-180`) écrit dans `<dataDir>/export/<date>` et
  rend `{ dir, files }`. `dataDir` est le dossier de la base (`server/src/main.ts:42`) ; la démo en crée un
  temporaire (`server/src/demo/main.ts:133`). L'export est la seule chose qui lit `dataDir`.
- **Le fichier** : `exportMarkdown` (`server/src/brain/export.ts:28-84`) écrit un `.md` par fiche vivante (en-tête
  YAML, synthèse, faits, faits barrés et datés, liens en `[[…]]`), au nom unique et sûr pour Windows (`:10-21`).
  Le `shortcut:` est en tête (`:25-26`) : « a folder on the NAS volume rather than an archive to download ; an
  archive can come with the front if the need arises ».
- **L'écran** : Réglages › Import et export, carte « Données » (`app/src/reglages/Donnees.svelte`). « Exporter »
  appelle `api.send('POST', '/api/export')` et affiche « N fichiers dans <dossier du serveur> ».
- **Le client** n'a pas de téléchargement : `call` lit toujours la réponse en texte puis en JSON
  (`app/src/api.ts:38-56`), et le jeton passe par l'en-tête `authorization` (`:36`) : un simple lien `<a download>`
  vers `/api/export` serait refusé. App laisse les liens `download` au navigateur (`app/src/App.svelte:166-168`).
- **Les limites.** La démo va jusqu'à 20 000 fiches (`DEMO_FICHES`, `server/src/demo/main.ts:104`). L'export lit
  chaque fiche par `getFiche`, et chaque cible de lien encore une fois (`export.ts:48`, `:54`) : sa durée à 20 000
  fiches n'est pas mesurée. Aucune limite de taille ni de nombre.
- **Une archive sans dépendance** : rien dans le dépôt ne fait de ZIP. Node donne `zlib.crc32` depuis 22.2, et les
  moteurs demandent `^22.13.0 || >=24` (`package.json:6-7`). `app/scripts/icons.mjs:15` a son propre CRC pour les
  PNG ; il sert au build, pas au serveur.
- **Les tests** : `server/src/brain/export.test.ts` (le contenu des fichiers, les noms), `fiches.test.ts:93-101`
  (la route écrit sous `dataDir`), `app/src/screens/Reglages.test.ts:55`, `:257` (l'écran appelle la route).
- **Les textes** : `docs/prouver-avaritia.md:11`, `:23`, `:76` disent l'écriture sur le disque ; `README.md:27`
  dit « export Markdown d'un fichier par fiche », juste avec une archive de fichiers.

## Ce que les références ont donné

- **myLLM** (la référence d'ergonomie de CrOliX) ne repère pas les chevauchements. Il calcule les **créneaux
  libres** dans le code, sans le modèle, « trouver un moment libre obligeait le modèle à […] calculer les trous
  lui-même (chevauchements oubliés, heures fausses) ». Ses règles : la durée entière dans les heures de travail du
  jour (9 h à 18 h, jours ouvrés par défaut), un début au quart d'heure, jamais dans le passé ; un événement
  « disponible » ne bloque pas. L'action s'exécute au clic « Approuver », et la carte nomme le fuseau.
- **myBrain** (même référence) télécharge par le serveur : son export de données est un fichier joint
  (`content-disposition: attachment`, nom daté), et son extension se sert en ZIP assemblé à la demande par un
  écrivain de ZIP maison, « méthode stockée (sans compression), sans dépendance », d'une centaine de lignes. Une
  conversation s'exporte côté navigateur, par un `Blob` et un lien `download`.
- **La veille de CrOliX** : rien sur une règle de chevauchement ni sur un export à télécharger. Elle liste des
  projets voisins (une infrastructure de rendez-vous, un assistant mail et agenda avec l'humain dans la boucle, une
  boîte d'interruptions d'agents), lus par leur fiche seulement.

## À trancher par CrOliX

Des choix de produit. Chaque point a mon avis ; la tâche qui l'applique le cite.

### (a) Quels événements comptent

**[avis] Deux événements à heure (pas les journées entières), distincts, qui commencent dans l'horizon (point (c))
et dont les plages se recouvrent strictement (une fin à 10 h et un début à 10 h ne se chevauchent pas).** Tous les
agendas synchronisés comptent ; le même id dans deux agendas (une invitation vue deux fois) est un seul événement.
Une récurrence compte occurrence par occurrence : la carte ne déplace que celle-là. Les événements passés ne
comptent pas. **Un événement « libre » ou refusé compte encore** : le cache ne garde ni la disponibilité ni la
réponse (`calendar.ts:18-26`). Les écarter demande deux colonnes, leur lecture à la synchro et une synchro complète
de chaque agenda (le jeton incrémental ne renvoie que ce qui change). À faire si le bruit se voit au rodage.

### (b) Lequel la carte déplace, et vers quand

**[avis] Elle déplace celui qui commence le plus tard (à égalité, le plus court), vers le premier créneau libre de
même durée après la fin de l'autre, le même jour.** Un créneau commence au quart d'heure, finit au plus tard à 20 h
(heure du serveur, celle de l'agenda, `server/src/agenda/time.ts:1`) et ne recouvre aucun événement à heure du
cache. Si celui à déplacer est dans un agenda en lecture seule, elle propose l'autre ; si les deux le sont, ou s'il
n'y a pas de créneau ce jour-là, aucune carte. « Modifier » laisse choisir une autre heure (`agent.ts:137-152`).
L'autre voie, « à déplacer » sans créneau, n'a pas d'action : `event.update` demande un début et une fin.

### (c) Quand la détection passe, à quel horizon

**[avis] À chaque passage de la synchro de l'agenda (60 s), juste après elle, même si un agenda a échoué, sur les
sept jours qui viennent.** Elle lit le cache, sans appel à Google. Pas de boucle nouvelle. En pause, elle continue :
proposer une carte n'agit sur rien (`CLAUDE.md` d'Acedia, « ce qui n'agit sur rien continue »).

### (d) Ce qui empêche la carte de revenir

**[avis] La paire a une clé, gardée dans `call_id` : les deux événements (agenda, id, début), triés.** Une carte
`pending`, `refused`, `done` ou `failed` de même clé bloque la paire ; une carte `expired` (restée sans réponse
jusqu'au lendemain) la laisse revenir, une fois par jour. Si l'un des deux change d'heure, c'est une autre paire.
« Annuler » après « Valider » remet les heures d'avant : la carte `done` bloque encore. Les cartes s'effacent après
30 jours (`store.ts:149-158`) : avec un horizon de sept jours, la paire est passée bien avant. Aucune table neuve.

### (e) L'IA ou le code

**[avis] Tout dans le code, aucun appel au modèle**, comme les créneaux de myLLM : la détection, le choix et le
créneau se calculent sur le cache. La carte n'entre pas dans le fil du modèle, et sa décision ne le relance pas
(tâche 2). Limite : si CrOliX demande ensuite à l'agent « pourquoi cette carte ? », il ne la connaît pas.

### (f) Le core prévenu, ou la carte seule

**[avis] Un événement `agenda.overlap`, importance `low` (P2, « ce qui attend un geste, sans heure »,
`standards/notifications.md:44`), un par carte créée, lien `#/agenda`.** Il sert d'abord l'écran : le panneau
relit son fil et le compteur du lanceur se met à jour (tâche 3) ; sans lui, la carte reste invisible jusqu'au
prochain chargement. Le core le reçoit comme tout événement, et voit la carte par `GET /lun/v1/cards` comme
aujourd'hui. Le contrat ne change pas. Ce que le core fait d'un type qu'il ne connaît pas n'est pas vérifié ici.

### (g) L'export : une archive, ou un fichier par fiche

**[avis] Une archive ZIP, un `.md` par fiche dedans, comme aujourd'hui sur le disque.** Le site et le README disent
« un fichier par fiche » : ça reste vrai. Méthode stockée, sans compression, comme myBrain, avec `zlib.crc32` de
Node : une soixantaine de lignes, aucune dépendance. Le nom : `avaritia-export-AAAA-MM-JJ.zip`. Un seul gros
fichier Markdown perdrait les liens `[[…]]` entre fichiers, qu'Obsidian relit.

### (h) Ce que devient l'écriture sur le disque du serveur

**[avis] Retirée.** L'archive part au navigateur, rien n'est écrit sur le serveur. `dataDir` n'a plus d'usage : il
sort de `AppDeps`, de `main.ts`, de la démo et du harnais. L'autre voie, garder les deux, laisse un dossier qui
grossit sur le NAS sans que personne ne le voie.

### (i) « Pina » dans le journal du serveur et les textes de parité

**[avis] « agent » partout, sans lire le réglage** : « Fil de l'agent », « Agent : carte … », « Agent : reprise
… », « Envoi : l'agent n'envoie jamais … », « Pièce jointe : binaire, sans usage pour l'agent », « L'agent
lui-même », « Évaluation de l'agent ». Le journal se lit au terminal ; un nom en dur y contredit le défaut neutre,
et le relire en base dans un chemin d'erreur n'apporte rien. Un test serveur fixe la règle (tâche 4).

### (j) « Pina » dans la doc

**[avis] La doc dit « l'agent », et « pina » seulement comme nom interne** : `docs/pina.md` le dit déjà en tête
(`:6-7`), le reste suit ; « Réglages › Pina » devient « Réglages › Agent » ; « par Pina » devient « par son nom
réglé ». Les noms de fichiers (`docs/pina.md`, `docs/prouver-pina.md`) restent, comme le dossier. La phrase « Pina
est le nom donné par CrOliX en prod » sort : elle nomme un réglage personnel dans un dépôt public.

## Les tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests, les voit rater sur la branche et colle le message
d'échec dans la tâche ; puis le développeur écrit le code dans le worktree qu'on lui donne, parti de la branche du
chantier. Les serveurs des satellites n'ont pas d'agent à eux : **dev-core** les code, le `CLAUDE.md` du satellite
dans son brief ; les écrans sont à **dev-front**, vérifiés dans Chrome. Le **reviewer** relit chaque diff contre sa
tâche avant la PR de son dépôt.

Barrières de chaque tâche de code, depuis le worktree, une commande par ligne :

```
npm test
npm run lint
npm run typecheck
npm run format:check
node <lun-docs>/tools/check-repo.mjs --public .
```

`<lun-docs>` est le clone de lun-docs (`..\..\lun-docs` depuis un worktree sous `wt\`).

**L'ordre.**

- **Acedia et Avaritia partent ensemble** : deux dépôts.
- **Acedia** : 1, puis 2, puis 4, puis 5. La tâche 3 part en même temps que la 1 : elle touche `PinaPanel.svelte`,
  `PinaPanel.test.ts`, `pina.svelte.ts`, `views/src/lib/pina/pina.test.ts` (neuf) et `app/src/noAnima.test.ts` ;
  les tâches 1 et 2, `server/src/agenda/`, `server/src/main.ts`, `server/src/pina/agent.ts`,
  `agent.test.ts`, `wording.ts`, `wording.test.ts` et la copie `views/src/lib/pina/wording.ts`. Aucun fichier
  commun. La 4 vient après la 2 (`main.ts`, `agent.ts` en commun), la 5 après les quatre premières.
- **Avaritia** : 6, puis 7 et 8 ensemble (7 : `server/` seul ; 8 : `app/src/api.ts` et `Donnees.svelte` ; aucun
  fichier commun, les tests sont tous posés par la 6), puis 9.
- **lun-docs** : 10, à la fermeture.

### Tâche 1. Les tests de la détection (testeur, Acedia)

- [ ] **Fichiers** : `server/src/agenda/overlaps.test.ts` (neuf), `server/src/pina/agent.test.ts`,
  `server/src/pina/wording.test.ts`.
- **Ce que les tests fixent**, sur `makeAgendaHarness` (`server/src/testing/agenda-harness.ts:6`), son faux
  agenda et son horloge, selon les points (a) à (f) tels que CrOliX les a validés :
  - deux événements à heure qui se recouvrent demain donnent une carte `pending`, action `event.update`, sur celui
    qui commence le plus tard, vers le premier créneau libre après l'autre ; son entrée porte `calendarId`, `id`,
    `title` (le titre actuel), `start`, `end` ;
  - aucune carte pour : deux plages qui se touchent, une journée entière, un événement passé, un au-delà de
    l'horizon, le même id dans deux agendas, deux événements en lecture seule, une journée sans créneau ;
  - une occurrence de récurrence : la carte vise l'id de l'occurrence ;
  - deux passages de suite : une seule carte ; refusée, aucune nouvelle carte pour la paire ; expirée, une nouvelle
    le lendemain ; un des deux déplacé dans Google, une nouvelle paire ;
  - le mode « Faire tout de suite » réglé : la carte reste `pending`, rien n'est appelé chez Google ;
  - un événement `agenda.overlap`, importance `low`, par carte créée, aucun au passage suivant ;
  - acceptée par `decideCard`, la carte est `done` et le faux agenda a reçu le `PATCH` ; refusée, `refused`, aucun
    appel. Dans les deux cas, le faux fournisseur du harnais n'est pas appelé (`agent.test.ts`) ;
  - `describe` d'une carte de chevauchement (son `callId` commence par `chevauchement:`) : le titre « Déplacer un
    événement qui en chevauche un autre », les champs Titre, Début, Fin, sans « Identifiant » (`wording.test.ts`).
- **Rend** : le message d'échec sur la branche, collé ici.
- **Exclu** : la synchro elle-même (déjà testée, `calendar.test.ts`) ; l'écran.

### Tâche 2. La détection (dev-core, Acedia, après 1)

- [ ] **Fichiers** : `server/src/agenda/overlaps.ts` (neuf), `server/src/main.ts` (`:103-106`),
  `server/src/pina/agent.ts` (`resume`, `:309-328`), `server/src/pina/wording.ts` (`:182-187`), puis
  `npm run sync-types -w @lun-ecosystem/lunacedia-views`, qui récrit `views/src/lib/pina/wording.ts`.
- **Ce qui change** :
  - `proposeOverlaps(db, now)` lit les événements à heure de l'horizon (`eventsBetween`, `calendar.ts:88`), forme
    les paires, choisit l'événement et le créneau (points (a) et (b)), saute une clé déjà bloquée (point (d)), puis
    ajoute la carte par `addCard` (`store.ts:58`) avec le jour de l'agent (`dayOf` de `store.ts:12`), le tour `0`
    (aucun message n'a cet id, `AUTOINCREMENT`), la clé en `callId`, l'effet `write`. Jamais `runCard` : la carte
    attend, quel que soit le mode. Puis `emitEvent` `agenda.overlap` (point (f)), titre « « A » et « B » se
    chevauchent », `data` avec les deux événements. `writable` se lit par `listCalendars` (`calendar.ts:257`).
  - `main.ts` : la boucle de l'agenda appelle `proposeOverlaps` après `syncAgenda`, qu'elle réussisse ou non ; une
    erreur de l'une ne cache pas celle de l'autre (les deux vont à `logError`).
  - `resume` ne fait rien quand le tour de la carte n'a pas de demande dans le fil (`:324`) : ni résultat écrit, ni
    appel au fournisseur. Une ligne de commentaire dit pourquoi (une carte de la détection n'a pas de tour).
  - `describe`, cas `event.update` : un `callId` qui commence par `chevauchement:` donne le titre de la tâche 1 et
    les champs Titre, Début, Fin ; `done` : « Événement déplacé ».
  - `shortcut:` dans `overlaps.ts` : la clé repose sur les cartes gardées 30 jours ; un horizon plus long que 30
    jours demande une table à elle.
- **Preuve** : `npm test -- server/src/agenda/overlaps.test.ts server/src/pina` vert ; les barrières.
- **Exclu** : la disponibilité et la réponse aux invitations dans le cache (point (a)) ; un message dans le fil du
  modèle ; toute boucle neuve ; une table neuve ; le contrat.

### Tâche 3. Le panneau de l'agent : la carte se voit, le nom se lit (testeur puis dev-front, Acedia)

- [ ] **Fichiers** : `views/src/lib/pina/PinaPanel.svelte`, `views/src/lib/pina/PinaPanel.test.ts`,
  `views/src/lib/pina/pina.svelte.ts` (`:44`), `views/src/lib/pina/pina.test.ts` (neuf),
  `app/src/noAnima.test.ts`.
- **Ce qui change** :
  - le panneau s'abonne à `client.subscribe` et relit le fil (`pina.load()`) sur `agenda.overlap` : le compteur du
    lanceur suit, panneau fermé ou ouvert ;
  - `pina.svelte.ts:44` : « `${agentIdentity.name}` ne répond pas » ;
  - `noAnima.test.ts` gagne un cas : aucun `\bPina\b` (casse comprise) dans `app/src` et `views/src`, hors tests,
    commentaires retirés par le `strip` qui y est (`:26-31`), sorti de son cas pour servir aux deux.
- **Tests** : un événement `agenda.overlap` reçu relit le fil et le compteur passe à 1 ; un autre type ne relit
  rien ; un rejet qui n'est pas une `Error` dit « Agent ne répond pas », puis « Iris ne répond pas » après
  `takeIdentity({ name: 'Iris' })`. Sur la branche, le cas de `noAnima.test.ts` nomme `pina.svelte.ts`.
- **Preuve**, dans Chrome, Acedia lancé sur le laptop : la carte d'un chevauchement apparaît au compteur sans
  recharger (après la tâche 2).
- **Exclu** : le dessin de la carte (le kit, lun-docs#43) ; le serveur.

### Tâche 4. « Pina » hors du journal du serveur (dev-core, Acedia, après 2 ; selon le point (i))

- [ ] **Fichiers** : `server/src/main.ts:121`, `server/src/main.test.ts:49`, `:54`, `server/src/pina/agent.ts:124`,
  `server/src/contract/routes.ts:210`, `server/src/contract/parity.ts:6`, `:9`, `:11`,
  `server/scripts/pina-eval.ts:169`, et un test neuf `server/src/noName.test.ts`, sur le modèle de
  `noAnima.test.ts` : aucun `\bPina\b` dans `server/src` et `server/scripts`, hors tests, commentaires retirés.
- **Ce qui change** : les textes du point (i). Rien d'autre.
- **Tests** : le test neuf rate sur la branche en nommant les quatre fichiers ; `main.test.ts` suit le texte neuf.
- **Exclu** : les noms internes (voir la liste) ; si CrOliX garde « Pina » au journal, la tâche se réduit à
  `parity.ts` ou disparaît, et le test neuf avec elle.

### Tâche 5. La doc d'Acedia, et la preuve sur le laptop (testeur, puis la session)

- [ ] **La doc** (selon le point (j)) : `README.md:99`, `docs/pina.md`, `docs/prouver-pina.md`, `.env.example:29`.
  `docs/pina.md`, « Ce qu'elle fait », gagne une ligne : les chevauchements des sept jours qui viennent, la carte,
  ce qui la fait revenir ou non ; `docs/prouver-pina.md` gagne l'étape de la preuve ci-dessous.
- [ ] **La preuve, sur le laptop, avec le compte Google de test** (jamais le vrai) : `.env` d'Acedia relié à ce
  compte, `npm run build`, puis `npm run dev`, Acedia dans Chrome. Dans Google Agenda du compte de test, deux
  événements demain, 10 h à 11 h et 10 h 30 à 11 h 30. Dans la minute :
  1. le compteur du lanceur passe à 1, sans recharger ; la carte dit « Déplacer un événement qui en chevauche un
     autre », le second, vers 11 h à 12 h ;
  2. « Valider » : l'événement est à 11 h dans Google Agenda ; « Annuler » le remet à 10 h 30, et aucune nouvelle
     carte n'apparaît pour la paire ;
  3. une seconde paire, refusée : aucune nouvelle carte à la minute suivante, ni au redémarrage du serveur ;
  4. le mode « Faire tout de suite » réglé, une troisième paire : la carte attend ;
  5. aucun « Pina » à l'écran, nom réglé vide ou neutre ; le journal du serveur selon le point (i).
  Captures dans la PR. Si le laptop n'a pas Google branché, les étapes 1 à 4 attendent la session du desktop.
- **Exclu** : la feuille de route (tâche 10).

### Tâche 6. Les tests de l'export (testeur, Avaritia)

- [ ] **Fichiers** : `server/src/brain/export.test.ts`, `server/src/brain/fiches.test.ts` (`:93-101`),
  `app/src/api.test.ts`, `app/src/screens/Reglages.test.ts`
  (`:55`, `:257`).
- **Ce que les tests fixent**, selon (g) et (h) validés :
  - `exportMarkdown(db)` rend les fichiers en mémoire, `{ name, text }`, sans écrire nulle part ; les deux tests
    d'aujourd'hui gardent leurs attentes sur les noms et le contenu ;
  - l'archive : la signature `PK\x03\x04` en tête, la fin du répertoire central qui compte autant d'entrées que de
    fiches, chaque nom et chaque contenu retrouvés tels quels (méthode stockée), le CRC de chacun égal à
    `zlib.crc32`, un nom accentué marqué UTF-8 ;
  - la route : `content-type: application/zip` ; `x-avaritia-fiches`, le nombre de fiches ;
    `content-disposition: attachment; filename="avaritia-export-2026-11-02.zip"` à l'heure du harnais ; aucun
    fichier écrit ; sans fiche, une archive vide valide ;
  - au-delà de 65 535 fiches (la limite d'une archive sans ZIP64), une erreur 413 dite en français : le test
    remplace la limite par une petite valeur, sans créer 65 536 fiches ;
  - le client : une méthode `download` rend un `Blob` et le nom de la réponse ; un 401 appelle `onUnauthorized` ;
  - l'écran : « Exporter » appelle `download`, crée un lien `download` au bon nom, puis dit « N fiches
    téléchargées ».
- **Rend** : le message d'échec sur la branche, collé ici.
- **Exclu** : la compression ; l'import.

### Tâche 7. L'archive, côté serveur (dev-core, Avaritia, après 6)

- [ ] **Fichiers** : `server/src/brain/export.ts`, `server/src/brain/zip.ts` (neuf), `server/src/brain/routes.ts`
  (`:175-180`), `server/src/app.ts:56`, `server/src/main.ts:42`, `server/src/demo/main.ts:133`,
  `server/src/testing/harness.ts:17`.
- **Ce qui change** : `exportMarkdown(db)` rend `{ name, text }[]` au lieu d'écrire (même contenu, mêmes noms) ;
  `zip.ts` assemble une archive stockée (en-têtes locaux, répertoire central, fin ; noms UTF-8, bit 11 ;
  `zlib.crc32`) ; la route rend l'archive en pièce jointe, avec l'en-tête `x-avaritia-fiches`. `dataDir` sort
  partout (point (h)). Le `shortcut:` de `export.ts:25-26` part ; un autre le remplace dans `zip.ts` : « sans ZIP64, 65 535 fiches et 4 Go au plus ; à
  passer en ZIP64 si la bibliothèque s'en approche ».
- **Preuve** : les tests de la tâche 6, côté serveur ; les barrières.
- **Exclu** : la compression ; une dépendance ; un flux en continu (l'archive tient en mémoire, voir Risques).

### Tâche 8. Le téléchargement, côté écran (dev-front, Avaritia, après 6)

- [ ] **Fichiers** : `app/src/api.ts`, `app/src/reglages/Donnees.svelte`.
- **Ce qui change** : `Api` gagne `download(method, path)`, qui passe le jeton comme `call`, garde la même lecture
  des erreurs (JSON `error`, 401) et rend `{ blob, name }`, le nom lu dans `content-disposition`. `Donnees.svelte`
  crée l'URL du `Blob`, un lien `download`, le clique, libère l'URL ; le texte de la ligne dit « Une archive, un
  fichier par fiche » puis « N fiches téléchargées », le nombre lu dans l'en-tête `x-avaritia-fiches`.
- **Preuve** : dans Chrome, la démo lancée, l'archive arrive dans les téléchargements et s'ouvre dans
  l'Explorateur de Windows.
- **Exclu** : le dessin de la carte « Données » (le kit, lun-docs#43).

### Tâche 9. La mesure à 20 000 fiches, et la doc d'Avaritia (testeur, après 7 et 8)

- [ ] **La mesure**, sur le laptop, sous PowerShell, une commande par ligne :

  ```powershell
  $env:DEMO_FICHES = '20000'
  npm run demo
  Remove-Item Env:DEMO_FICHES
  ```

  Puis, dans Chrome, Réglages › Import et export › Exporter. **Rend** : la durée (de la demande à l'archive
  reçue, onglet Réseau), la taille de l'archive, le nombre d'entrées lu par l'Explorateur, et qu'un fichier ouvert
  dans Obsidian garde ses liens. Au-delà de 30 s, une issue, sans correction ici.
- [ ] **La doc** : `docs/prouver-avaritia.md:11` (la démo n'écrit plus rien sur le disque), `:23` (la route rend
  une archive), `:76` (la limite tombe ; la limite de l'archive la remplace). `README.md:27` reste juste.
- **Exclu** : la vitesse de l'export, s'il tient sous 30 s.

### Tâche 10. Les textes à la fermeture (la session, lun-docs, après les deux PR de code fusionnées)

- [ ] `vision.md` ne change pas : il dit déjà les chevauchements (point 1) ; il ne nomme ni l'export ni le nom de
  l'agent, et n'a pas à le faire.
- [ ] La feuille de route du MVP dit les trois promesses tenues, avec leurs PR ; le recadrage, § 3.1 et § 3.2, n'est
  pas récrit (c'est un relevé daté).
- [ ] Le dépôt du site : la page d'Acedia gagne les chevauchements dans ses fonctions ; celle d'Avaritia dit déjà
  « un fichier par fiche ». Une PR à part, dans ce dépôt.
- **Exclu** : tout ce que la tâche ne nomme pas.

## Ce qui se prouve sur le laptop, ce qui attend le desktop

- **Sur le laptop** : tout ce chantier. Les tests et les barrières ; la détection avec le compte Google de test
  (tâche 5), si son `.env` y est branché ; l'export de la démo à 20 000 fiches (tâche 9) ; « Pina » dans Chrome.
- **Au desktop** : rien n'est requis. La session du desktop voit la détection sur le vrai agenda de CrOliX, en
  service ; c'est là que le bruit des événements « libres » ou refusés se juge (point (a)).

## Risques

- **Une carte périmée.** Les deux événements ne se chevauchent plus (déplacés à la main dans Google), la carte
  attend encore : « Valider » déplacerait quand même. Parade : elle ne vit qu'un jour (`agent.ts:178-183`) ; la
  vérifier au moment de l'accepter demande un garde dans `runCard`, à ajouter si le rodage le montre.
- **Le titre dans l'entrée.** Pour que la carte nomme l'événement, son entrée porte le titre du moment ; s'il est
  renommé dans Google avant « Valider », le `PATCH` remet l'ancien. Parade : la même durée de vie d'un jour.
- **Le bruit.** Les événements « libres », refusés, ou un agenda partagé chargé donnent des cartes inutiles
  (point (a)). Parade : la clé (point (d)) ne propose chaque paire qu'une fois ; écarter ces événements est un
  chantier à part, mesuré au rodage.
- **Trois événements qui se chevauchent** donnent jusqu'à trois cartes. Accepter la première peut rendre les autres
  périmées (premier risque).
- **Le modèle relancé par erreur.** Sans le garde de `resume`, chaque décision d'une carte de la détection appelle
  le fournisseur. Parade : le test de la tâche 1 sur le faux fournisseur.
- **L'archive en mémoire.** Elle se construit entière avant d'être envoyée : quelques dizaines de Mo à 20 000
  fiches, non mesuré. Parade : la mesure de la tâche 9.
- **Le core et un type neuf.** `agenda.overlap` lui arrive en P2 ; ce qu'il en fait n'est pas vérifié ici.

## Hors périmètre

Repris du chapeau : le rangement selon l'urgence, la veille tech, les notifications GitHub, la recherche par le sens,
le kit commun et le design, après le VIP (`vision.md`) ; renommer les tables, les routes ou le dossier de l'agent
d'Acedia. Et pour ce plan :

- la disponibilité et la réponse aux invitations dans le cache d'Acedia (point (a)) ;
- un créneau sur un autre jour, ou plusieurs créneaux au choix (point (b)) ;
- la compression de l'archive, le ZIP64, l'export d'une partie de la bibliothèque ;
- le contrat satellite ;
- la feuille de route avant la fermeture.

## Limites

- Non vérifié : ce que le core fait d'un événement `agenda.overlap` ; que le `.env` du laptop est relié au compte
  Google de test ; la durée de l'export à 20 000 fiches ; que `zlib.crc32` est là sur la version de Node du
  desktop (les moteurs l'exigent).
- Le relevé du 19/11 rangeait les textes de `parity.ts` comme « envoyés par le contrat » : ils ne quittent pas le
  serveur. Il plaçait la route d'export dans `server/src/routes.ts` : elle est dans `server/src/brain/routes.ts`.
