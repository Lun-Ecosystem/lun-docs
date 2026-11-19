# Trois promesses tenues : les chevauchements d'agenda, l'agent sans nom en dur, l'export qui se télécharge. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** le chapeau Lun-Ecosystem/lun-docs#185 (`niveau:standard`), décidé par CrOliX le 19/11 ; aucune issue
> ouverte dans lun-acedia ni dans lun-avaritia sur ces trois points (cherché le 19/11).
>
> **État : rédigé le 19/11, contesté le 19/11 (« à amender »), amendé le 19/11 ; quatre choix tranchés par CrOliX
> le 19/11 (« Tranché par CrOliX »).** **Validé par CrOliX le 19/11** (« Validé, rien en pause ») : les avis de
> « À trancher » sont retenus, sauf la pause, où il tranche l'inverse (point (a)). Le code peut partir.
>
> Code relu sur `main` : lun-acedia `40f529b`, lun-avaritia `9602d13`, lun-docs `167e8a4`. Le graphe d'abord (ceux
> d'Acedia et d'Avaritia datent du 16/11, un commit de retard), puis chaque ligne citée relue dans le code.

**But :** les trois petites promesses que le recadrage fait entrer dans le VIP sont tenues et prouvées sur le
laptop. Acedia repère les vrais conflits de l'agenda et les dit par une carte, qui propose de déplacer un événement
quand c'est possible sans toucher à celui d'un autre. Aucun texte vu de l'utilisateur ne porte « Pina ». L'export
d'Avaritia se télécharge depuis l'écran.

**Source :** le [recadrage du VIP](../specs/2026-11-19-recadrage-vip.md) : § 3.1 (« Repérer les événements qui se
chevauchent et proposer de les déplacer : **Absent** » ; « "Pina" reste écrit en dur dans un message visible »),
§ 3.2 (« l'export écrit sur le disque du serveur, sans téléchargement »), § 6.1, § 7 point 3 ; `vision.md`, « Ce que
le VIP tient », point 1 ; la ligne d'arrivée d'Acedia, point 3 (« son agent n'a plus aucun nom en dur »,
[état cible](../specs/2026-11-10-etat-cible-cadrage.md), § 4.4) ; `standards/workflow.md:66-68` : « En parallèle,
seulement ce qui est indépendant (deux dépôts, deux tâches sans fichier commun) ».

**Critères de fin**, ceux du chapeau, chacun prouvé en local :

1. **Les chevauchements (Acedia).** Un vrai conflit (« Tranché », choix 1) donne une carte. Quand l'un des deux
   événements est à CrOliX seul et qu'un créneau existe, elle propose de le déplacer : acceptée, elle le déplace
   dans Google ; sinon elle signale le conflit sans rien proposer. Refusée ou laissée sans réponse, elle ne change
   rien et la paire ne revient jamais. Rien n'est déplacé sans validation, quel que soit le mode de l'agent.
   Tâches 1 et 2, écran tâche 3, preuve tâche 4.
2. **« Pina » hors des textes visibles (Acedia).** Aucun texte vu de l'utilisateur ni envoyé par le contrat ne
   porte un nom d'agent en dur : il lit le nom réglé, « Agent » par défaut. Tables, routes, dossiers, types et clés
   de réglage ne changent pas. Tâche 3 (le test), tâche 2 (le journal), preuve tâche 4.
3. **L'export qui se télécharge (Avaritia).** L'export se récupère depuis l'écran, sans accès au disque du serveur,
   jusqu'aux 20 000 fiches de la démo. Tâches 5 à 8.
4. **Les textes.** `vision.md` dit déjà les chevauchements (point 1). L'agent sans nom en dur est le point 3 de la
   ligne d'arrivée d'Acedia ; l'export qui se télécharge est une réserve du recadrage (§ 3.2) ; ni l'un ni l'autre
   n'est dans `vision.md`, et n'a à y entrer. Les README et les docs des deux dépôts disent ce qui est tenu (tâches
   4 et 8) ; la feuille de route et le site, à la fermeture (tâche 9). Rien ne vérifie qu'un texte dit vrai : c'est
   accepté pour de la doc, la relecture en répond.

| Dépôt, branche                          | Issue                    | Niveau     |
| --------------------------------------- | ------------------------ | ---------- |
| `lun-acedia`, `feat/trois-promesses`    | lun-docs#185             | `standard` |
| `lun-avaritia`, `feat/trois-promesses`  | lun-docs#185             | `standard` |
| `lun-docs`, `docs/trois-promesses`      | lun-docs#185, ce plan    | `trivial`  |

**Une PR par dépôt.** Les deux PR de code citent le chapeau ; la PR de lun-docs le ferme, une fois les deux autres
fusionnées. Aucune ne touche au contrat satellite : le type d'un événement est une chaîne libre
(`standards/contrat-satellite.md:44`), et aucune route ne change.

## Tranché par CrOliX le 19/11

Quatre choix de produit, posés un à un.

1. **Ce qui compte comme un conflit : seulement les vrais.** Ne comptent pas : les journées entières ; les
   événements que CrOliX a refusés ; ceux marqués « disponible » ; les événements passés ou déjà commencés ; deux
   événements qui se touchent sans se recouvrir. La synchro lit donc trois informations de plus : la disponibilité,
   sa réponse, l'organisateur (avec les invités).
2. **Lequel déplacer : seulement un événement dont CrOliX est l'organisateur et qui n'a pas d'autres invités.** Si
   aucun des deux ne convient, la carte signale le conflit sans proposer de déplacement. Personne d'autre ne voit
   jamais une heure changer.
3. **Vers quand : le premier créneau libre de même durée, le même jour, après le conflit.** Début au quart d'heure,
   jamais dans le passé, entre 8 h et 22 h, heure de Paris ; une plage fixe, sans réglage. Ce sont les règles des
   créneaux libres de myLLM, la référence de CrOliX, avec une journée élargie : myLLM prend 9 h à 18 h, jours
   ouvrés seulement ; ici 8 h à 22 h, tous les jours, parce qu'un conflit du soir ou du week-end est un conflit
   (`vision.md` promet de les repérer, et les événements de la démo sont pour moitié du soir,
   `server/src/demo/demo.ts:250-252`). Sans créneau : la carte signale, sans proposition.
4. **Contre la lassitude, quatre garde-fous ensemble.**
   - Une paire traitée, refusée ou ignorée (carte expirée) ne revient jamais.
   - Deux séries récurrentes qui se chevauchent font une seule carte : la série est la clé, pas l'occurrence.
   - Trois cartes de conflit au plus par jour, les plus proches d'abord.
   - L'événement envoyé au core reste hors de son Journal (importance `log`) : la carte suffit.
   - La carte disparaît d'elle-même si le conflit est réglé à la main.

## Ce que le code fait aujourd'hui

### Acedia, l'agenda

- **Le cache.** `calendar_events` garde, par événement : agenda, id, titre, début, fin (en ISO et en ms), journée
  entière, lieu, rappels (`server/src/db.ts:100-113`). `GoogleEvent` ne lit de Google que `id`, `status`, le titre,
  le lieu, le début, la fin et les rappels (`server/src/agenda/calendar.ts:18-26`) : ni `transparency` (la
  disponibilité), ni `attendees` (les invités et la réponse de CrOliX), ni `organizer`, ni `recurringEventId`.
- **Les migrations** sont une liste d'instructions SQL, chacune passée par `db.exec` dans une transaction
  (`db.ts:9`, `:140-171`, `:183-192`) : une entrée peut ajouter des colonnes et effacer des lignes.
- **Une synchro complète repart seule** : sans jeton, `pullCalendar` relit toute la fenêtre (-30 jours, +365
  jours, `calendar.ts:159-163`) puis retire ce que Google n'a pas rendu (`:182-189`). Les jetons vivent dans
  `sync_state`, sous `cal:<agenda>` (`:179`, `:233`) : les effacer suffit à tout relire.
- **Les récurrences** arrivent dépliées : `singleEvents: 'true'` (`calendar.ts:158`). Chaque occurrence a son id ;
  un `PATCH` sur cet id ne déplace qu'elle. L'id de la série, `recurringEventId`, n'est pas lu aujourd'hui ; c'est
  lui qu'on lira : la forme de l'id d'une occurrence (la série, puis `_` et une date) est une habitude de Google,
  pas un champ documenté.
- **`writable`** ne regarde que le rôle de CrOliX sur l'agenda (`calendar.ts:231`) : dans un agenda partagé en
  écriture, il pourrait déplacer l'événement d'un autre. D'où le choix 2 (l'organisateur).
- **`updateEvent`** fait un `PATCH` sans `sendUpdates` (`calendar.ts:321-322`) : des invités ne seraient pas
  prévenus. Avec le choix 2, l'événement proposé n'a pas d'autres invités : le cas ne se pose pas.
- **Le passage régulier.** `main.ts:103-106` lance `syncAgenda` toutes les 60 s (`SYNC_INTERVAL_MS`), seulement
  quand Google est configuré. `syncAgenda` (`server/src/agenda/unified.ts:36-50`) émet `agenda.changed` quand le
  cache change, puis lève une `AggregateError` si un agenda n'a pas pu être lu. Ses appelants : `main.ts:103`, la
  démo (`demo.ts:531`, une fois au démarrage), le harnais des tests (`server/src/testing/agenda-harness.ts:11`).
- **Les heures.** L'agenda compte les jours à l'heure du serveur (`server/src/agenda/time.ts:1`, `:14-17`) ; le jour
  d'une carte est celui de Paris (`server/src/pina/store.ts:12-16`). La détection prend tout en `Europe/Paris`.
- **« Chevauchement »** n'existe que dans l'affichage côte à côte (`views/src/lib/agenda/dates.ts:126-131`,
  `CalendarGrid.svelte:9`) et dans les filtres de plage (`eventsBetween`, `calendar.ts:87-93`). Aucune détection.
- **Déplacer** : l'action `event.update` du catalogue (`server/src/contract/catalog.ts:175-181`), effet `write`,
  tous ses champs facultatifs sauf `calendarId` et `id` (`:179`), appelle `updateEvent` (`calendar.ts:314-325`),
  qui fait le `PATCH` puis met le cache à jour. Son inverse existe : l'ancien événement est relu avant
  (`server/src/pina/inverse.ts:17`, `:28`), « Annuler » le remet.
- **La démo** a un faux agenda qui se synchronise (`demo.ts:218-262`, `:530-531`, `npm run demo`), sans boucle
  ensuite (`server/src/demo/main.ts:16-18`). Aucun de ses événements ne se chevauche, aucun n'a d'organisateur ni
  d'invités ; le faux agenda rend tel quel ce qu'on lui donne (`server/src/testing/fake-agenda.ts:6-14`, `:78-84`).

### Acedia, les cartes de l'agent

- **La table** `pina_cards` : jour, tour, `call_id`, action, entrée, effet, statut (`pending`, `done`, `refused`,
  `failed`, `expired`), résultat, erreur, inverse, date de décision, `edited` (`db.ts:151-168`). `effect` est une
  chaîne libre (`server/src/types.ts:290`).
- **Une carte vit moins d'un jour.** Son jour est celui de Paris (`store.ts:12-16`, `:64`) ; les cartes `pending`
  d'un jour passé expirent (`store.ts:141-146`), à l'heure (`main.ts:115-122`) et à toute décision
  (`server/src/pina/agent.ts:178-183`). Les cartes de plus de 30 jours sont effacées (`store.ts:149-158`). Chaque
  carte en attente compte dans le résumé du jour envoyé au core (`catalog.ts:466-470`).
- **Une carte naît** dans la boucle du modèle seulement : une écriture demandée par le modèle devient une carte
  (`agent.ts:399-421`, `addCard`, `store.ts:58-69`). En mode « Faire tout de suite », une écriture s'exécute
  aussitôt (`agent.ts:417-418`). Les décisions passent par `runCard`, `refuseCard`, `expireCards` seulement
  (`agent.ts:97`).
- **Elle se décide** par `decideCard` (`agent.ts:168-196`), depuis l'écran (`POST /api/pina/cards/:id`,
  `server/src/pina/routes.ts:50-57`) ou depuis le core (`server/src/contract/routes.ts:205-216`). `runCard` relit
  l'entrée par le schéma de l'action (`agent.ts:88`), qui retire les clés inconnues ; « Modifier » aussi
  (`agent.ts:146-149`).
- **Après chaque décision, `resume` relance le modèle** (`agent.ts:194`, `:309-328`). Il compte les cartes en
  attente du tour par `pendingInTurn` (`:313`, `store.ts:133-137`), écrit leurs résultats dans le fil (`:323`),
  puis appelle le fournisseur (`:326`). Pour une carte que personne n'a demandée, ce serait un appel payant, et une
  réponse sur une carte que le modèle n'a pas proposée.
- **Une carte sans action à exécuter n'existe pas** : `runCard` exécute toujours son action (`agent.ts:111`), et une
  action inconnue donne une carte `failed` (`:87`). Mais une action de lecture s'exécute sans rien changer, et ne
  laisse pas d'inverse (`inverse.ts`, aucun cas pour une lecture), donc pas d'« Annuler »
  (`views/src/lib/pina/ActionCard.svelte:125-133`). « Modifier » n'apparaît que si la carte a des champs à clé
  (`ActionCard.svelte:50`, `:108-109`) ; « Valider » et « Refuser » toujours (`:104`, `:111`).
- **Ce que la carte dit** vient de `describe` (`server/src/pina/wording.ts`). `npm run sync-types -w
  @lun-ecosystem/lunacedia-views` le recopie dans `views/src/lib/pina/wording.ts`, et récrit du même coup
  `views/src/lib/types.ts` depuis `server/src/types.ts` (`views/scripts/sync-types.mjs:8-11`). Pour
  `event.update` : « Modifier un événement », le nom de l'événement s'il est dans le fil du jour, sinon
  « Identifiant », puis Titre, Début, Fin, Lieu de l'entrée (`wording.ts:91-94`, `:105-110`, `:182-187`) ; une
  action sans cas à elle montre son nom (`:280-282`).
- **Où on la voit.** Le fil place une carte sans message à la fin (`Thread.svelte:46-48`), et offre « Tout
  valider » dès que ce groupe a deux cartes en attente (`:72`, `:88-98`, qui appelle `acceptAll`,
  `views/src/lib/pina/pina.svelte.ts:140-150`). Le compteur du lanceur vient du fil, lu au montage du panneau et à
  son ouverture (`PinaPanel.svelte:83-100`) ; rien ne le relit ensuite.
- **Le core** voit les cartes en attente par `GET /lun/v1/cards` (`contract/routes.ts:193-201`), où l'effet d'une
  carte qui n'est pas une suppression est dit `write` (`:47`). Aucune création de carte n'émet d'événement.

### Acedia, le nom de l'agent

Le nom réglé vit dans `pina.name`, « Agent » par défaut (`store.ts:162-170`) ; l'écran le lit par
`agentIdentity`, « Agent » tant que les réglages ne sont pas lus (`views/src/lib/pina/identity.svelte.ts:17`). Le
lanceur, le panneau, le journal (« par … ») et le bandeau du brouillon l'emploient déjà (`Launcher.svelte:27`,
`PinaPanel.svelte:294`, `:303`, `Journal.svelte:57`, `Composer.svelte:176`).

Toutes les occurrences de « Pina » (recherche sans la casse, `git grep -n -i pina`), rangées :

- **Visible de l'utilisateur, à changer : une seule.** `views/src/lib/pina/pina.svelte.ts:44`, `'Pina ne répond
  pas'`, le texte d'un toast quand l'erreur n'est pas une `Error`.
- **Envoyé par le contrat : aucune.** `toContractCard` (`contract/routes.ts:41-59`), les événements et le résumé du
  jour n'en portent pas. Les trois textes de `server/src/contract/parity.ts:6`, `:9`, `:11` ne sortent pas du
  serveur : seul `parity.test.ts` lit `PARITY`.
- **Journal du serveur et outillage.** `server/src/main.ts:121` (« Fil de Pina », fixé par
  `server/src/main.test.ts:49`, `:54`) ; `agent.ts:124` ; `contract/routes.ts:210` ; le titre du rapport de l'outil
  d'évaluation, `server/scripts/pina-eval.ts:169` ; et `parity.ts`.
- **Doc.** `README.md:99` ; `docs/pina.md` (19 lignes, dont « par Pina » à `:60`) ; `docs/prouver-pina.md` (6
  lignes, dont « Réglages › Pina », un écran qui s'appelle « Agent », `views/src/lib/settings/Settings.svelte:105-106`)
  ; le commentaire de `.env.example:29`.
- **Nom interne, ne change pas.** Les tables `pina_cards`, `pina_messages` ; les routes `/api/pina/*` ; les dossiers
  `server/src/pina/`, `views/src/lib/pina/` ; les types `PinaCard`, `PinaSettings`, `PinaState`, `PinaPanel` ; les
  clés de réglage `pina.*` ; l'usage `'pina'` des coûts et des modèles ; l'origine `'pina'` du journal ; la clé
  `lunacedia.pina.size` du navigateur ; les variables `PINA_EVAL_*` et le script `pina:eval` ; les commentaires du
  code (`base.css:8`, `Composer.svelte:197`, `MailReader.svelte:274`, `Thread.svelte:11`, `types.ts`,
  `contract/routes.ts:32`, `agent.ts:377`).
- **Les fixtures** : `views/src/testing/fake-client.ts:227`, `:238` donnent `name: 'Pina'` au faux client ; ce n'est
  pas un `*.test.ts`, et le filtre de `app/src/noAnima.test.ts:12` le parcourt. Les tests qui écrivent « Pina »
  comme nom réglé (`store.test.ts:113`, `PinaSettings.test.ts:15`…) éprouvent le réglage et restent.

`app/src/noAnima.test.ts` parcourt `app/src` et `views/src`, hors `*.test.ts` (`:7-14`). Son cas « Anima » cherche
dans le texte entier, commentaires compris (`:16-23`) ; c'est son cas du tiret long qui retire d'abord les
commentaires (`:25-34`).

### Avaritia, l'export

- **La route** `POST /api/export` (`server/src/brain/routes.ts:175-180`) écrit dans `<dataDir>/export/<date>` et
  rend `{ dir, files }`. `dataDir` est le dossier de la base (`server/src/main.ts:42`) ; la démo en crée un
  temporaire (`server/src/demo/main.ts:133`). L'export est la seule chose qui lit `dataDir`.
- **Le fichier** : `exportMarkdown` (`server/src/brain/export.ts:28-84`) écrit un `.md` par fiche vivante (en-tête
  YAML, synthèse, faits, faits barrés et datés, liens en `[[…]]`), au nom ASCII, unique et sûr pour Windows
  (`:10-21`, `:76-78`). Le `shortcut:` est en tête (`:25-26`) : « a folder on the NAS volume rather than an archive
  to download ; an archive can come with the front if the need arises ».
- **La base est synchrone** (`node:sqlite`) : pendant l'export, le serveur ne répond à rien d'autre. Pour chaque
  lien, `getFiche` relit toute la fiche cible, ses faits et ses liens, seulement pour savoir si elle est fusionnée
  (`export.ts:54`, `server/src/brain/store.ts:49-67`) ; la requête des titres est déjà là (`export.ts:40-45`).
- **L'écran** : Réglages › Import et export, carte « Données » (`app/src/reglages/Donnees.svelte`). « Exporter »
  appelle `api.send('POST', '/api/export')` et affiche « N fichiers dans <dossier du serveur> ».
- **Le client** n'a pas de téléchargement : `call` lit toujours la réponse en texte puis en JSON
  (`app/src/api.ts:38-56`), et le jeton passe par l'en-tête `authorization` (`:36`) : un simple lien `<a download>`
  vers `/api/export` serait refusé. App laisse les liens `download` au navigateur (`app/src/App.svelte:166-168`).
  `app/src/api.test.ts` existe et teste `createApi` (`:7`, le 401 à `:36`).
- **Les limites.** La démo va jusqu'à 20 000 fiches (`DEMO_FICHES`, `server/src/demo/main.ts:104`) ; la durée de
  l'export à cette taille n'est pas mesurée.
- **Une archive sans dépendance** : rien dans le dépôt ne fait de ZIP. Node donne `zlib.crc32` depuis 22.2, et les
  moteurs demandent `^22.13.0 || >=24` (`package.json:6-7`).
- **Les tests** : `server/src/brain/export.test.ts` (le contenu des fichiers, les noms), `fiches.test.ts:93-101`
  (la route écrit sous `dataDir`), `app/src/screens/Reglages.test.ts:55`, `:257` (l'écran appelle la route).
- **Les textes** : `docs/prouver-avaritia.md:11`, `:23`, `:76` disent l'écriture sur le disque ; `README.md:27`
  dit « export Markdown d'un fichier par fiche ».
- **Les liens Obsidian de l'export sont déjà cassés**, hors de ce chantier : les fichiers portent un slug
  (`export.ts:10-21`), les liens le titre (`:72`), et un doublon finit en `-2` (`:77`).

## Ce que les références ont donné

- **myLLM** (la référence d'ergonomie de CrOliX) ne repère pas les chevauchements. Il calcule les **créneaux
  libres** dans le code, sans le modèle, parce que le modèle oubliait des chevauchements et se trompait d'heure.
  Ses règles : la durée entière dans les heures de travail du jour (9 h à 18 h, jours ouvrés par défaut), un début
  au quart d'heure, jamais dans le passé ; un événement « disponible » ne bloque pas. Le choix 3 les reprend, avec
  8 h à 22 h tous les jours.
- **myBrain** (même référence) télécharge par le serveur : son export de données est un fichier joint
  (`content-disposition: attachment`, nom daté), et son extension se sert en ZIP assemblé à la demande par un
  écrivain de ZIP maison, « méthode stockée (sans compression), sans dépendance », d'une centaine de lignes. Une
  conversation s'exporte côté navigateur, par un `Blob` et un lien `download`.
- **La veille de CrOliX** : rien sur une règle de chevauchement ni sur un export à télécharger. Elle liste des
  projets voisins (une infrastructure de rendez-vous, un assistant mail et agenda avec l'humain dans la boucle, une
  boîte d'interruptions d'agents), lus par leur fiche seulement.

## Les deux cartes de conflit

Les choix 2 et 3 demandent une carte qui signale sans proposer. **Elle tient avec l'existant, sans brique neuve.**

- **La carte qui propose** : action `event.update`, entrée `{ calendarId, id, start, end, conflit }`. `conflit`
  est hors du schéma : seul l'affichage le lit (les deux titres, la raison) ; `runCard` le retire avant le `PATCH`
  (`agent.ts:88`). Le titre de l'événement n'est pas dans l'entrée : le `PATCH` ne touche qu'aux heures.
  « Modifier » propose Début et Fin, les seuls champs à clé.
- **La carte qui signale** : action `agenda.list`, une lecture du cache (`catalog.ts:151-157`), entrée
  `{ from, to, conflit }` sur la plage du conflit, effet `read`. « Valider » acquitte : la lecture s'exécute, ne
  change rien, ne laisse pas d'inverse, donc pas d'« Annuler ». Aucun champ à clé : pas de « Modifier », donc aucune
  heure à saisir pour un événement qui n'est pas à CrOliX seul. « Refuser » vaut aussi acquittement.
- **Les deux** ont un `callId` qui commence par `chevauchement:`, que `describe` reconnaît : « Déplacer un événement
  qui en chevauche un autre » avec l'événement, l'autre, Début, Fin ; ou « Deux événements se chevauchent » avec
  les deux, leurs heures, et la raison (« aucun des deux n'est à toi seul », « aucun créneau libre ce jour-là, de
  8 h à 22 h »). Fait : « Événement déplacé », « Conflit vu ».
- **Le prix** : le bouton dit « Valider » et non « Vu » ; un libellé à lui demande une prop dans `ActionCard`,
  hors de ce chantier (le kit, lun-docs#43). Le core voit la carte qui signale comme une écriture (`effect` dit
  `write`, `contract/routes.ts:47`) ; ce que le core en fait n'est pas vérifié ici. Après « Modifier », la carte
  qui propose perd `conflit` (le schéma le retire, `agent.ts:146-149`) et montre l'identifiant au lieu des noms.

## À trancher par CrOliX

Ce que les quatre choix n'ont pas décidé. Chaque point a mon avis ; la tâche qui l'applique le cite.

### (a) L'horizon et le moment du passage

**[avis] À chaque passage de la synchro de l'agenda (60 s), à la fin de `syncAgenda`, même si un agenda a échoué,
sur les sept jours qui viennent.** Elle lit le cache, sans appel à Google, sans boucle nouvelle.

**Tranché par CrOliX le 19/11 : en pause, la détection ne crée aucune carte ; elle reprend à la levée.** L'avis
d'origine la laissait continuer (« ce qui n'agit sur rien continue », `CLAUDE.md` d'Acedia). Sa raison : la pause
est la promesse de contrôle, et une carte qui arrive seule, avec sa notification, la contredit, comme le tri qui
« ne range rien seul ». La tâche 2 lit donc la pause avant de proposer, garde le retrait des cartes dont le conflit
est réglé (il n'ajoute rien), a un test pour les deux, et met la ligne de `CLAUDE.md` sur la pause d'accord.

### (b) Deux séries qui se chevauchent

**[avis] La carte signale, sans proposer.** La série est la clé (choix 4) : la paire ne reviendra plus. Déplacer
une seule occurrence laisserait le conflit des semaines suivantes, sans carte ; déplacer toute la série est un autre
geste que `event.update` sur une occurrence. Une série contre un événement seul suit la règle commune : l'événement
seul se propose s'il est à CrOliX seul, sinon l'occurrence, sinon la carte signale.

### (c) L'IA ou le code

**[avis] Tout dans le code, aucun appel au modèle**, comme les créneaux de myLLM. La carte n'entre pas dans le fil
du modèle, et sa décision ne le relance pas (tâche 2). Limite : si CrOliX demande ensuite à l'agent « pourquoi
cette carte ? », il ne la connaît pas.

### (d) L'export : une archive, ou un fichier par fiche

**[avis] Une archive ZIP, un `.md` par fiche dedans.** C'est ce que le README et le site promettent (« un fichier
par fiche »), et un navigateur ne télécharge pas un dossier : une archive, c'est un clic, un fichier. Méthode
stockée, sans compression, comme myBrain, avec `zlib.crc32` de Node : une soixantaine de lignes, aucune dépendance.
Le nom : `avaritia-export-AAAA-MM-JJ.zip`.

### (e) Ce que devient l'écriture sur le disque du serveur

**[avis] Retirée.** L'archive part au navigateur, rien n'est écrit sur le serveur. `dataDir` n'a plus d'usage : il
sort de `AppDeps`, de `main.ts`, de la démo et du harnais. L'autre voie, garder les deux, laisse un dossier qui
grossit sur le NAS sans que personne ne le voie.

### (f) « Pina » dans le journal du serveur et les textes de parité

**[avis] « agent » partout, sans lire le réglage** : « Fil de l'agent », « Agent : carte … », « Agent : reprise
… », « Envoi : l'agent n'envoie jamais … », « Pièce jointe : binaire, sans usage pour l'agent », « L'agent
lui-même », « Évaluation de l'agent ». Le journal se lit au terminal ; un nom en dur y contredit le défaut neutre.
Pas de test dédié : le critère parle du texte vu de l'utilisateur.

### (g) « Pina » dans la doc

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

**Les barrières** d'une tâche de code, depuis le worktree, une commande par ligne :

```
npm test
npm run lint
npm run typecheck
npm run format:check
node <lun-docs>/tools/check-repo.mjs --public .
```

`<lun-docs>` est le clone de lun-docs (`..\..\lun-docs` depuis un worktree sous `wt\`). Une tâche du testeur ne
passe pas ces barrières : ses tests ratent, et `npm run typecheck` échoue tant que le code qu'ils appellent manque.
Elle rend le message d'échec de `npm test` sur ses fichiers.

**L'ordre.**

- **Acedia et Avaritia partent ensemble** : deux dépôts.
- **Acedia** : 1, puis 2, puis 4. La tâche 3 part en même temps que la 1. Fichiers de 1 et 2 : `server/` (dont
  `server/src/testing/`) et les deux copies que `sync-types` récrit, `views/src/lib/pina/wording.ts` et
  `views/src/lib/types.ts`. Fichiers de 3 : `views/src/lib/pina/PinaPanel.svelte`, `PinaPanel.test.ts`,
  `Thread.svelte`, `pina.svelte.ts`, `pina.test.ts` (neuf), `views/src/testing/fake-client.ts`, les tests de
  `views/src` qui lisent le nom du faux client, `app/src/noAnima.test.ts`. Aucun fichier commun.
- **Avaritia** : 5, puis 6 et 7 ensemble (6 : `server/` seul ; 7 : `app/src/api.ts` et `Donnees.svelte` ; aucun
  fichier commun, les tests sont tous posés par la 5), puis 8.
- **lun-docs** : 9, à la fermeture.

### Tâche 1. Les tests de la détection (testeur, Acedia)

- [ ] **Fichiers** : `server/src/agenda/overlaps.test.ts` (neuf), `server/src/agenda/calendar.test.ts`,
  `server/src/pina/agent.test.ts`, `server/src/pina/store.test.ts`, `server/src/pina/wording.test.ts`,
  `server/src/demo/demo.test.ts`, `server/src/testing/fake-agenda.ts` (le type `FakeEvent` gagne `transparency`,
  `organizer`, `attendees`, `recurringEventId`, tels que Google les rend).
- **Ce que les tests fixent**, sur `makeAgendaHarness` (`server/src/testing/agenda-harness.ts:6`), son faux agenda
  et son horloge ; les heures sont celles de Paris :
  - la synchro garde, par événement, s'il est « disponible », si CrOliX l'a refusé, s'il est à CrOliX seul
    (organisateur `self`, aucun invité autre que lui), et l'id de sa série ; après la migration, une base qui avait
    déjà des jetons relit toute la fenêtre (`calendar.test.ts`) ;
  - un vrai conflit demain, l'un des deux à CrOliX seul, un créneau libre : une carte `pending` `event.update` sur
    celui-là, vers le premier créneau libre de même durée après le conflit, au quart d'heure, entre 8 h et 22 h ;
    l'entrée porte `calendarId`, `id`, `start`, `end` et `conflit`, sans `title` ;
  - aucune carte pour : deux plages qui se touchent, une journée entière, un événement refusé, un « disponible », un
    passé, un déjà commencé, un au-delà de l'horizon, le même id dans deux agendas ;
  - une carte qui signale (`agenda.list`, sans champ à clé) : quand aucun des deux n'est à CrOliX seul (un invité de
    plus, un autre organisateur) ; quand aucun créneau ne tient avant 22 h ; pour deux séries (point (b)) ;
  - un créneau déjà proposé par une carte en attente compte comme occupé : deux conflits du même jour ne reçoivent
    pas la même heure ; un événement « disponible » ou refusé ne bloque pas un créneau ;
  - la clé : deux passages de suite, une seule carte ; refusée, acceptée, ou expirée le lendemain, plus jamais de
    carte pour la paire, même après 30 jours (`purge` garde les cartes de la détection) ; deux séries qui se
    chevauchent chaque semaine : une seule carte en tout ;
  - le plafond : cinq conflits, trois cartes le jour même, les plus proches ; les deux autres le lendemain ;
  - la carte disparaît : la paire ne se chevauche plus au passage suivant, la carte en attente n'existe plus ; une
    carte en cours d'exécution n'est pas touchée ;
  - le mode « Faire tout de suite » réglé : la carte reste `pending`, rien n'est appelé chez Google ;
  - un événement `agenda.overlap`, importance `log`, par carte créée, aucun au passage suivant ;
  - acceptée par `decideCard`, la carte qui propose est `done` et le faux agenda a reçu le `PATCH` des seules
    heures ; la carte qui signale, acceptée, est `done` sans aucun appel au faux agenda ni inverse ; refusées,
    `refused`, aucun appel. Dans tous les cas, le faux fournisseur du harnais n'est pas appelé (`agent.test.ts`) ;
  - `describe` des deux cartes (`wording.test.ts`) : leurs titres, leurs champs ; Début et Fin à clé pour la
    première, aucun champ à clé pour la seconde ;
  - la démo (`demo.test.ts`) : après `createDemo`, une carte qui propose et une carte qui signale.
- **Rend** : le message d'échec de `npm test` sur ces fichiers, collé ici.
- **Exclu** : l'écran.

### Tâche 2. La détection, et « Pina » hors du journal (dev-core, Acedia, après 1)

- [ ] **Fichiers** : `server/src/agenda/overlaps.ts` (neuf), `server/src/agenda/calendar.ts` (`GoogleEvent`,
  `upsertEvent`), `server/src/db.ts` (une migration), `server/src/agenda/unified.ts` (`syncAgenda`),
  `server/src/pina/store.ts` (`purge`, une suppression des cartes en attente), `server/src/pina/agent.ts`
  (`resume`, la suppression gardée par `running`, `:124`), `server/src/pina/wording.ts` (`:182-187`, un cas pour
  `agenda.list`), `server/src/demo/demo.ts` (`seedAgenda`), `server/src/demo/main.ts`, puis
  `npm run sync-types -w @lun-ecosystem/lunacedia-views`, qui récrit `views/src/lib/pina/wording.ts` et
  `views/src/lib/types.ts`. Pour le journal (point (f)) : `server/src/main.ts:121`, `server/src/main.test.ts:49`,
  `:54`, `server/src/contract/routes.ts:210`, `server/src/contract/parity.ts:6`, `:9`, `:11`,
  `server/scripts/pina-eval.ts:169`.
- **Ce qui change** :
  - **La synchro** : `GoogleEvent` lit `transparency`, `organizer`, `attendees`, `recurringEventId`. Une migration
    ajoute quatre colonnes à `calendar_events` (« disponible », « refusé par CrOliX », « à CrOliX seul », la série)
    et efface les jetons `cal:%` de `sync_state` : la synchro suivante relit tout. `upsertEvent` les remplit et les
    compte dans ce qui a changé. `AgendaEvent` ne change pas : `overlaps.ts` lit les colonnes par sa requête.
  - **La détection**, `proposeOverlaps(db, now)`, appelée à la fin de `syncAgenda`, après les deux synchros et
    avant de lever l'erreur d'un agenda. Elle lit les événements à heure de l'horizon (point (a)), écarte ce que le
    choix 1 écarte, forme les paires, les range par début. Puis, dans l'ordre :
    1. elle supprime ses cartes en attente dont la paire ne se chevauche plus ;
    2. elle saute une paire dont la clé a déjà une carte, de tout statut ; la clé est `chevauchement:` suivi des
       deux événements triés, chacun par son agenda et sa série, ou son id hors série ;
    3. elle s'arrête quand trois cartes de la détection sont nées ce jour-là ;
    4. elle choisit l'événement et le créneau (choix 2 et 3, point (b)), les créneaux des cartes en attente
       comptant comme occupés, puis crée la carte qui propose ou celle qui signale (« Les deux cartes de
       conflit ») par `addCard`, jour de Paris (`store.ts:12`), tour `0` (aucun message n'a cet id), clé en
       `callId`. Jamais `runCard` : la carte attend, quel que soit le mode ;
    5. `emitEvent` `agenda.overlap`, importance `log`, titre « « A » et « B » se chevauchent », lien `#/agenda`.
  - **La suppression** d'une carte en attente vit dans `agent.ts`, à côté de `expireCards`, et saute une carte de
    `running` (la règle de `agent.ts:97`) ; la requête est dans `store.ts`.
  - **`purge`** garde les cartes du tour `0` : la clé doit durer plus que 30 jours. `shortcut:` : elles s'ajoutent,
    trois par jour au plus ; une table à elles si la base s'en ressent.
  - **`resume`** s'arrête en tête quand `card.turn === 0` : ni résultat écrit, ni appel au fournisseur. Une ligne de
    commentaire dit pourquoi. `pendingInTurn(db, 0)` compterait toutes les cartes du tour 0, tous jours confondus
    (`store.ts:133-137`) : avec ce garde, il n'est jamais appelé pour elles, et le plafond par jour se compte à
    part, par le jour de la carte.
  - **`describe`** : les deux cartes, telles que « Les deux cartes de conflit » les décrit.
  - **La démo** : `seedAgenda` ajoute, relatifs à maintenant, un conflit de demain soir dont un événement est à
    CrOliX seul, et un conflit avec un invité ; `demo/main.ts` relance `syncAgenda` toutes les 60 s, comme le
    serveur, pour que la carte parte quand le conflit est réglé à la main.
  - **Le journal** : les textes du point (f).
- **Preuve** : les tests de la tâche 1 ; les barrières.
- **Exclu** : un message dans le fil du modèle ; toute boucle neuve dans le serveur ; un libellé « Vu » ; le
  contrat ; `sendUpdates` (aucun invité, choix 2).

### Tâche 3. Le panneau de l'agent : la carte se voit, le nom se lit (testeur puis dev-front, Acedia)

- [ ] **Fichiers** : `views/src/lib/pina/PinaPanel.svelte`, `views/src/lib/pina/PinaPanel.test.ts`,
  `views/src/lib/pina/Thread.svelte` (`:72`), `views/src/lib/pina/pina.svelte.ts` (`:44`),
  `views/src/lib/pina/pina.test.ts` (neuf), `views/src/testing/fake-client.ts` (`:227`, `:238`), les tests de
  `views/src` qui attendent le nom du faux client, `app/src/noAnima.test.ts`.
- **Ce qui change** :
  - le panneau s'abonne à `client.subscribe` et relit le fil (`pina.load()`) sur `agenda.overlap` : le compteur du
    lanceur suit, panneau fermé ou ouvert ;
  - « Tout valider » ne compte pas les cartes de la détection (`callId` qui commence par `chevauchement:`) ;
  - `pina.svelte.ts:44` : « `${agentIdentity.name}` ne répond pas » ;
  - le faux client prend un nom réglé qui n'est pas « Pina » (« Iris ») ; les tests qui l'attendaient suivent ;
  - `noAnima.test.ts` gagne un cas : aucun `\bPina\b`, sensible à la casse, dans `app/src` et `views/src`, hors
    `*.test.ts`, commentaires retirés par la fonction du cas du tiret long (`:26-31`), sortie de ce cas pour servir
    aux deux.
- **Tests** : un événement `agenda.overlap` reçu relit le fil et le compteur passe à 1 ; un autre type ne relit
  rien ; deux cartes de la détection en attente n'ont pas « Tout valider » ; un rejet qui n'est pas une `Error` dit
  « Agent ne répond pas », puis « Iris ne répond pas » après `takeIdentity({ name: 'Iris' })`. Sur la branche, le
  cas de `noAnima.test.ts` nomme `pina.svelte.ts` et `fake-client.ts`.
- **Preuve**, dans Chrome, sur la démo (après la tâche 2) : la carte d'un conflit apparaît au compteur sans
  recharger.
- **Exclu** : le dessin de la carte (le kit, lun-docs#43) ; le serveur.

### Tâche 4. La doc d'Acedia, et la preuve sur la démo (testeur, puis la session)

- [ ] **La doc** (point (g)) : `README.md:99`, `docs/pina.md`, `docs/prouver-pina.md`, `.env.example:29`.
  `docs/pina.md`, « Ce qu'elle fait », gagne les conflits de l'agenda : ce qui compte, les deux cartes, ce qui les
  fait partir ou ne jamais revenir, le plafond ; `docs/prouver-pina.md` gagne l'étape de la preuve ci-dessous.
- [ ] **La preuve, sur le laptop, sur la démo**, dans Chrome : `npm run build`, puis `npm run demo`, le jeton
  affiché collé dans la page.
  1. le compteur du lanceur montre les cartes de la démo ; celle qui propose dit « Déplacer un événement qui en
     chevauche un autre », vers le premier créneau libre après le conflit ; celle qui signale dit pourquoi, sans
     « Modifier » ;
  2. « Valider » sur la première : l'événement est déplacé dans l'agenda de la démo ; « Annuler » le remet, et
     aucune carte ne revient pour la paire ;
  3. « Refuser » sur la seconde : aucune carte nouvelle à la minute suivante ;
  4. un conflit réglé à la main dans l'agenda de la démo : sa carte part à la minute suivante ;
  5. plusieurs conflits ajoutés dans l'agenda de la démo : trois cartes au plus ce jour-là ;
  6. aucun « Pina » à l'écran ; le journal du serveur selon le point (f).
  Captures dans la PR.
- **Au desktop**, pendant sa session : le même conflit sur un agenda Google réel (le compte de test), pour voir le
  `PATCH` arriver chez Google et la synchro relire les quatre informations neuves. C'est la seule étape qui l'attend.
- **Exclu** : la feuille de route (tâche 9).

### Tâche 5. Les tests de l'export (testeur, Avaritia)

- [ ] **Fichiers** : `server/src/brain/export.test.ts`, `server/src/brain/fiches.test.ts` (`:93-101`),
  `app/src/api.test.ts`, `app/src/screens/Reglages.test.ts` (`:55`, `:257`).
- **Ce que les tests fixent**, selon (d) et (e) :
  - `exportMarkdown(db)` rend les fichiers en mémoire, `{ name, text }`, sans écrire nulle part ; les deux tests
    d'aujourd'hui gardent leurs attentes sur les noms et le contenu ;
  - l'archive : la signature `PK\x03\x04` en tête, la fin du répertoire central qui compte autant d'entrées que de
    fiches, chaque nom et chaque contenu retrouvés tels quels (méthode stockée), le CRC de chacun égal à
    `zlib.crc32` ;
  - la route : `content-type: application/zip` ; `x-avaritia-fiches`, le nombre de fiches ;
    `content-disposition: attachment; filename="avaritia-export-2026-11-02.zip"` à l'heure du harnais ; aucun
    fichier écrit ; sans fiche, une archive vide valide ;
  - le client : une méthode `download` rend un `Blob` et le nom de la réponse ; un 401 appelle `onUnauthorized` ;
  - l'écran : « Exporter » appelle `download`, crée un lien `download` au bon nom, puis dit « N fiches
    téléchargées ».
- **Rend** : le message d'échec de `npm test` sur ces fichiers, collé ici.
- **Exclu** : la compression ; l'import ; les liens Obsidian (« Hors périmètre »).

### Tâche 6. L'archive, côté serveur (dev-core, Avaritia, après 5)

- [ ] **Fichiers** : `server/src/brain/export.ts`, `server/src/brain/zip.ts` (neuf), `server/src/brain/routes.ts`
  (`:175-180`), `server/src/app.ts:56`, `server/src/main.ts:42`, `server/src/demo/main.ts:133`,
  `server/src/testing/harness.ts:17`.
- **Ce qui change** :
  - `exportMarkdown(db)` rend `{ name, text }[]` au lieu d'écrire (même contenu, mêmes noms). La requête des titres
    (`export.ts:40-45`) lit aussi `merged_into`, et le filtre des liens (`:54`) la lit au lieu de rappeler
    `getFiche` pour chaque lien.
  - `zip.ts` assemble une archive stockée : en-têtes locaux, répertoire central, fin ; `zlib.crc32`. `shortcut:` :
    sans ZIP64, 65 535 fichiers et 4 Go au plus ; à passer en ZIP64 si la bibliothèque s'en approche.
  - La route rend l'archive en pièce jointe, avec l'en-tête `x-avaritia-fiches`. `dataDir` sort partout (point
    (e)). Le `shortcut:` de `export.ts:25-26` part.
- **Preuve** : les tests de la tâche 5, côté serveur ; les barrières.
- **Exclu** : la compression ; une dépendance ; un flux en continu (l'archive tient en mémoire, voir « Risques ») ;
  les liens Obsidian.

### Tâche 7. Le téléchargement, côté écran (dev-front, Avaritia, après 5)

- [ ] **Fichiers** : `app/src/api.ts`, `app/src/reglages/Donnees.svelte`.
- **Ce qui change** : `Api` gagne `download(method, path)`, qui passe le jeton comme `call`, garde la même lecture
  des erreurs (JSON `error`, 401) et rend `{ blob, name }`, le nom lu dans `content-disposition`. `Donnees.svelte`
  crée l'URL du `Blob`, un lien `download`, le clique, libère l'URL ; le texte de la ligne dit « Une archive, un
  fichier par fiche » puis « N fiches téléchargées », le nombre lu dans l'en-tête `x-avaritia-fiches`.
- **Preuve** : dans Chrome, la démo lancée, l'archive arrive dans les téléchargements et s'ouvre dans
  l'Explorateur de Windows.
- **Exclu** : le dessin de la carte « Données » (le kit, lun-docs#43).

### Tâche 8. La mesure à 20 000 fiches, et la doc d'Avaritia (testeur, après 6 et 7)

- [ ] **La mesure**, sur le laptop, sous PowerShell, une commande par ligne :

  ```powershell
  $env:DEMO_FICHES = '20000'
  npm run demo
  Remove-Item Env:DEMO_FICHES
  ```

  Puis, dans Chrome, Réglages › Import et export › Exporter. **Rend** : la durée de la demande à l'archive reçue
  (onglet Réseau), qui est le temps où le serveur ne répond à rien d'autre ; la taille de l'archive ; le nombre
  d'entrées lu par l'Explorateur. **Seuil : 5 s sur le laptop.** Au-delà, une issue, sans correction ici.
- [ ] **La doc** : `docs/prouver-avaritia.md:11` (la démo n'écrit plus rien sur le disque), `:23` (la route rend
  une archive), `:76` (la limite tombe ; celle de l'archive la remplace). `README.md:27` reste juste.
- **Exclu** : ouvrir l'archive dans Obsidian pour éprouver les liens (déjà cassés, « Hors périmètre »).

### Tâche 9. Les textes à la fermeture (la session, lun-docs, après les deux PR de code fusionnées)

- [ ] `vision.md` ne change pas (critère 4).
- [ ] La feuille de route du MVP dit les trois promesses tenues, avec leurs PR ; le recadrage, § 3.1 et § 3.2, n'est
  pas récrit (c'est un relevé daté).
- [ ] Le dépôt du site : la page d'Acedia gagne les conflits de l'agenda dans ses fonctions ; celle d'Avaritia dit
  déjà « un fichier par fiche ». Une PR à part, dans ce dépôt.
- **Exclu** : tout ce que la tâche ne nomme pas.

## Ce qui se prouve sur le laptop, ce qui attend le desktop

- **Sur le laptop** : tout ce chantier, sauf une étape. Les tests et les barrières ; les conflits, les deux cartes,
  « Valider », « Annuler », le refus, la carte qui part, le plafond, sur la démo dans Chrome (tâche 4) ; l'export de
  la démo à 20 000 fiches (tâche 8) ; « Pina » dans Chrome.
- **Au desktop** : l'écriture réelle chez Google et la lecture des quatre informations neuves par une vraie synchro,
  sur le compte de test (tâche 4, « Au desktop »).

## Risques

- **La migration relit tous les agendas** au premier démarrage : une synchro complète de chaque agenda, puis un
  `agenda.changed` pour tous les événements. Parade : c'est ce que fait déjà un jeton perdu (`calendar.ts:235-240`).
- **Les tests existants de l'agenda** passent désormais par la détection, puisqu'elle est au bout de `syncAgenda` :
  un test qui compte les événements émis ou les cartes peut bouger. Parade : `npm test` entier à la tâche 2 ; un
  test qui change le dit dans son commit.
- **Un événement sans organisateur** (un faux agenda, un agenda importé) n'est pas à CrOliX seul : la carte signale.
  C'est le côté sûr du choix 2.
- **Trois événements qui se chevauchent** donnent jusqu'à trois paires. Accepter la première peut régler les autres :
  elles partent au passage suivant.
- **Le modèle relancé par erreur.** Sans le garde de `resume`, chaque décision d'une carte de la détection appelle
  le fournisseur. Parade : le test de la tâche 1 sur le faux fournisseur.
- **L'archive en mémoire, et le serveur sourd pendant l'export.** Parade : la requête des liens allégée (tâche 6) et
  le seuil de 5 s (tâche 8).

## Hors périmètre

Repris du chapeau : le rangement selon l'urgence, la veille tech, les notifications GitHub, la recherche par le sens,
le kit commun et le design, après le VIP (`vision.md`) ; renommer les tables, les routes ou le dossier de l'agent
d'Acedia. Et pour ce plan :

- un créneau sur un autre jour, plusieurs créneaux au choix, une plage horaire réglable ;
- déplacer toute une série ; prévenir des invités ;
- un libellé « Vu » sur la carte qui signale ;
- **les liens Obsidian de l'export**, déjà cassés (le slug des fichiers contre le titre des liens, `export.ts:10-21`,
  `:72`, `:77`) : une issue à part, ouverte par la session ;
- la compression de l'archive, le ZIP64, l'export d'une partie de la bibliothèque ;
- le contrat satellite ;
- la feuille de route avant la fermeture.

## Limites

- Non vérifié : ce que le core fait d'une carte qui signale ou d'un événement `agenda.overlap` ; la durée de
  l'export à 20 000 fiches ; que `zlib.crc32` est là sur la version de Node du desktop (les moteurs l'exigent) ; la
  forme exacte que Google donne à `organizer` dans un agenda secondaire (la synchro du desktop le montrera).
- Le relevé du 19/11 rangeait les textes de `parity.ts` comme « envoyés par le contrat » : ils ne quittent pas le
  serveur. Il plaçait la route d'export dans `server/src/routes.ts` : elle est dans `server/src/brain/routes.ts`.

## Contestation du 19/11

Le contradicteur a fait douze objections, trois bloquantes. Onze sont intégrées, une réfutée en partie.

1. **Une carte expirée qui laisse revenir la paire** : intégrée, choix 4 ; « Tâche 2 », la clé et le plafond ;
   `expired` bloque comme `refused` ; la série lue à la synchro (`recurringEventId`), pas déduite de l'id.
2. **`GoogleEvent` ne lit que `status`, coût de la synchro complète faux, `writable` et `sendUpdates`** : intégrée,
   choix 1 et 2 ; « Acedia, l'agenda » (les migrations, la synchro qui repart seule, `writable`, `sendUpdates`).
3. **« Avant 20 h » taisait les conflits du soir ; « passé » non défini ; heures du serveur** : intégrée, choix 3 ;
   tout en `Europe/Paris` ; « déjà commencé » exclu (choix 1).
4. **Cartes périmées, créneaux en double, « Tout valider »** : intégrée, « Tâche 2 » (suppression gardée par
   `running`, créneaux des cartes en attente occupés) et « Tâche 3 » (`Thread.svelte:72`).
5. **Le titre dans l'entrée** : intégrée, « Les deux cartes de conflit » ; le nom dans `conflit`, hors schéma ; le
   risque de l'ancien titre retiré.
6. **La preuve sur la démo, une seule version** : intégrée, « Tâche 4 » et « Ce qui se prouve… » ; la démo gagne
   ses conflits et sa boucle (« Tâche 2 »).
7. **Le faux client, la casse, le cas qui retire les commentaires** : intégrée, « Tâche 3 » et « Acedia, le nom de
   l'agent ».
8. **Les liens Obsidian déjà cassés** : intégrée, « Hors périmètre » et « Tâche 8 » ; le point (d) garde le ZIP pour
   une autre raison (un fichier par fiche, un seul téléchargement).
9. **`getFiche` par lien, seuil, branche 413, test UTF-8** : intégrée, « Tâche 6 » (une requête), « Tâche 8 » (5 s),
   branche 413 et test UTF-8 retirés (`shortcut:` dans `zip.ts`). **Réfutée pour `app/src/api.test.ts`** : le
   fichier existe sur `main` (`git ls-files app/src/api.test.ts` le rend ; `describe('createApi'`, `:7`) ; la
   tâche 5 l'étend.
10. **Le garde de `resume`** : intégrée, « Tâche 2 » (`card.turn === 0` en tête, `pendingInTurn` jamais appelé pour
    le tour 0, plafond compté par jour).
11. **La tâche 4 fondue dans la 2, sans test dédié ; les barrières ; `sync-types`** : intégrée, « Tâche 2 », point
    (f) et « Les barrières » ; `views/src/lib/types.ts` nommé.
12. **Rien ne vérifie les textes** : intégrée, critère 4.
