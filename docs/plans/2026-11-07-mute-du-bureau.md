# Le mute du bureau. Plan

> **Pour les agents d'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** en un geste, Natsume au bureau n'écoute plus, ne parle plus d'elle-même et ne répond plus. Seuls les P0 et
les rappels passent, selon le réglage existant « Dit à voix haute : P0 ». Un P0 qui n'est pas dit part toujours sur le
téléphone.

**Architecture :** l'état vit dans Luxuria, stocké comme le micro et jamais rallumé seul. Le core reçoit deux champs
nouveaux, sur le `started` comme sur le battement :
- `muted` ferme la garde de la parole spontanée ;
- `silentAnnounce` envoie un P0 non dit sur le téléphone.

`busy` garde son sens, un appel, et `ritual` coupe l'accueil comme aujourd'hui.

**Stack :** Node 24, Hono, zod, `node:sqlite` (core) ; Svelte 5, Vitest, Tauri 2 plugin global-shortcut (Luxuria).

**Spec :** [`../specs/2026-11-07-mute-du-bureau-design.md`](../specs/2026-11-07-mute-du-bureau-design.md). Feuille de
route : [`2026-11-07-feuille-de-route-mvp.md`](2026-11-07-feuille-de-route-mvp.md), chantier F.

**Cadre :** autonomie donnée par CrOliX le 07/11. Le plan s'exécute après la relecture du plan-challenger. Les
**[choix Claude]** de la spec se changent avant le merge.

| Dépôt, branche | Issues | Niveau |
|---|---|---|
| `lun-anima`, `feat/presence-muette` | issue à ouvrir (le champ `muted`) ; lun-anima#7 | `standard` |
| `lun-luxuria`, `feat/mute-du-bureau` | issue à ouvrir (le mute) | `standard` |

**Ordre de merge :** lun-anima avant lun-luxuria, et un core redémarré avant le premier lancement. Le core refuse un
champ inconnu (`z.strictObject`) : un Luxuria muette, ou avec « P0 » coupé, reçoit 400 d'un vieux core. Hors de ces
deux cas, aucun champ nouveau ne part.

## Contraintes globales

- Dépôt public lun-luxuria : aucun nom d'instance, et l'écran ne parle ni de core ni de serveur (`src/noCore.test.ts`).
- Muette, **aucune capture ne tourne** : l'état affiché correspond à la réalité (spec Luxuria §5.3).
- Le mute ne se lève jamais seul : il survit au relancement, comme `luxuria.mic`.
- Aucun appel au modèle déclenché par Luxuria pendant le mute.
- Pas de tiret cadratin, textes de l'écran en français, code et commits en anglais.
- Barrières : lun-anima `npm run format:check`, `lint`, `typecheck`, `test` ; lun-luxuria la même chose plus `build`,
  `cargo fmt --check`, `cargo clippy -D warnings`, `cargo test` si `src-tauri/` change.

## Points de relecture

1. **Le mute posé pendant qu'elle parle** : la phrase en cours s'arrête comme une coupure (`session.silence()`), sinon
   une réponse continue à sortir alors que l'étiquette dit « Muette ». Test en tâche 3.
2. **« P0 » changé dans les réglages, ou Luxuria qui s'annonce** : le core a le nouvel état tout de suite, par un
   battement immédiat ou par le `started` lui-même, sinon une urgence peut tomber dans un trou de 30 s. Tests en
   tâches 1 et 3.
3. **Le mute levé pendant un appel** : le micro reste coupé par `occupée` ; le mute ne rouvre rien par lui-même. Test
   en tâche 3.
4. **Deux onglets, un seul muet** : le core tient la présence muette tant qu'un onglet vivant l'est, comme `busy`. Test
   en tâche 1.
5. **Une phrase `spontaneous` ou `reply` reçue pendant le mute** (envoyée juste avant, ou par un vieux core) : elle
   n'est pas dite. Seule `p0` l'est, si « P0 » est activé. Test en tâche 3.

---

## lun-anima

### Tâche 1 : `muted` et `silentAnnounce`, dès le `started`

**Fichiers :** `core/src/natsume/presence.ts`, `core/src/natsume/presence-routes.ts`,
`core/src/natsume/spontaneous.ts`, `core/src/natsume/announce.ts`, `core/src/push/queue.ts` (`#stale`), leurs tests et
le test de route existant ; `README.md` (ligne de la route de présence). `core/src/natsume/situation.ts` ne change pas :
sa phrase « en vocal » lit `busy`, qui garde son sens.

**Interfaces :**
- `type Flags = { busy: boolean; muted: boolean; silentAnnounce: boolean }`, exporté de `presence.ts` ;
- `presenceStart(db, clientId, now, tab?, flags?: Partial<Flags>)` range les trois drapeaux reçus. Aujourd'hui il écrit
  `busy: false` ;
- `presenceBeat(db, flags: Partial<Flags>, now, tab?)` remplace le paramètre `busy: boolean`. On met à jour ses appelants
  (la route et les tests) ;
- `Tab` et `Presence` gagnent `muted?` et `silentAnnounce?`. On les agrège comme `busy` : vrai si un onglet vivant l'est
  (une fonction `flagOf(tabs, now, key)` remplace `busyOf`) ;
- `presenceNow(...)` rend `{ present, busy, muted, silentAnnounce, startedAt? }`, avec les drapeaux faux hors présence ;
- `Body` accepte `muted` et `silentAnnounce` (`z.boolean().optional()`), et le message 400 les cite ;
- `announceP0` : la phrase part sans raison `p0` si `busy || silentAnnounce`. `#stale` de la file des notifications
  applique la même règle. `spontaneousDue` : `if (!present || busy || muted) return false`.

- [x] Branche depuis `main`, issue ouverte (critères de la spec §4 et §5), PR en brouillon au premier push.
- [x] Tests d'abord :
  - `presence.test.ts` :
    - un `started` avec `busy: true` donne `presenceNow().busy` vrai **avant** tout battement (le trou de 30 s) ;
    - pareil pour `muted` et `silentAnnounce` ;
    - deux onglets, l'un muet : muette. L'onglet muet part (`stopped`) : plus muette ;
    - un onglet muet sans battement depuis plus de 90 s ne compte plus ;
    - une présence sans onglet garde les drapeaux du dernier battement.
  - `spontaneous.test.ts` : avec tout ce qu'il faut pour parler, `muted` donne faux, le même état sans lui donne vrai, et
    `silentAnnounce` seul ne la coupe pas.
  - `announce.test.ts` : présent, libre, `silentAnnounce` : la phrase est dans le fil sans raison `p0`. Dans la file des
    notifications, l'entrée part (`sent`) au lieu d'être retirée (`dropped`).
  - `situation.test.ts` : `silentAnnounce` ou `muted` seuls ne produisent pas la phrase « en vocal ».
  - Route : `{ state: 'beat', muted: true }` rend 204 ; `muted: 'oui'` rend 400 et le message cite `muted?` et
    `silentAnnounce?` ; `{ state: 'started', silentAnnounce: true }` est rangé.
- [x] Code : les signatures ci-dessus.
- [x] `README.md` : la route de présence dit les deux champs et ce qu'ils coupent.

### Tâche 2 : le test instable (lun-anima#7), en dernier

**Fichiers :** `core/src/satellites/listener.test.ts`, et `listener.ts` seulement si la cause y est.

Elle ne sert aucun critère de la spec : elle passe par ce dépôt, rien de plus. Elle ne bloque pas la PR. Si la cause
résiste plus d'une heure, l'issue reçoit ce qui a été trouvé et la tâche sort du chantier.

- [x] Reproduire : `npx vitest run core/src/satellites/listener.test.ts --repeat 50` (ou une boucle), noter le taux
  d'échec dans l'issue.
- [x] Trouver la cause (horloge réelle, ordre des promesses, minuterie non avancée) et la corriger à la racine, sans
  `retry` ni délai allongé.
- [x] Preuve : 200 passages verts d'affilée, notés dans la PR. `Closes #7`.

- [x] Relecture (agent reviewer), critères cochés et preuves dans la PR, passage en « prête ».

## lun-luxuria

### Tâche 3 : l'état muette dans la session

**Fichiers :** `src/session.svelte.ts`, `src/body/body.ts`, `src/core.ts`, `src/brain.ts` (type des options de
présence), `src/local.ts` si le type l'exige, `src/conversation.ts` ; tests `session` existants ou nouveau
`src/mute.test.ts`, `src/body/body.test.ts`, `src/core.test.ts`.

**Interfaces :**
- `Session.silenced: boolean` (`$state`), lu au chargement depuis la clé `luxuria.mute` (`'on'` ou absente) ;
  `Session.toggleMute(): void` l'inverse, le stocke et applique ;
- `BodyState` gagne `'silenced'`, libellé `Muette`. Attention, `'muted'` existe déjà et veut dire « Micro coupé ». Dans
  `stateOf`, après `capped` et avant `busy` : `injoignable`, `parle` et `plafond atteint` passent devant. Chaque `Record`
  indexé par `BodyState` gagne sa clé : `STATE_LABELS`, et ce que le compilateur signale (souffle, scène) ;
- `Brain.presence(state, opts: { busy?: boolean; ritual?: boolean; muted?: boolean; silentAnnounce?: boolean })`.
  `CoreClient` n'envoie `muted` et `silentAnnounce` **que s'ils valent vrai** : hors mute, un vieux core ne voit aucun
  champ inconnu. `LocalBrain` ne fait rien, comme aujourd'hui ;
- le lambda de `#presence` calcule, **à chaque `started` comme à chaque battement** : `ritual: speak.ritual &&
  !silenced`, `busy` réel, `muted: silenced`, `silentAnnounce: !speak.p0`. Le `started` porte donc les mêmes drapeaux
  que le battement ;
- `Conversation` reçoit `silenced: () => boolean` dans ses dépendances.

- [x] Branche depuis `main`, issue ouverte (critères de la spec §3, §4, §7), PR en brouillon.
- [x] Tests d'abord :
  - muette, `#applyMic` n'ouvre pas le micro même avec `micOn` (espion sur `openMicrophone`, jamais appelé) ; levée,
    le micro revient dans l'état de `micOn` ;
  - muette au lancement (`luxuria.mute = 'on'`) : `presence('started', { ritual: false, muted: true, ... })`, même avec
    `speak.ritual` activé ; une ré-annonce muette (flux revenu, 410, `pageshow`) aussi ;
  - le battement envoie `muted: true` muette, et aucun champ `muted` sinon (pas `false`) ;
  - « P0 » coupé : `silentAnnounce: true` sur le `started` et le battement, et `busy` reste celui de la détection ;
  - changer `speak.p0` par `saveSettings` envoie un battement tout de suite (point de relecture 2), et poser ou lever le
    mute aussi ;
  - poser le mute pendant qu'elle parle appelle `silence()` (point 1) ;
  - muette, `Conversation` ne dit pas une `speech` de raison `spontaneous`, `reply` ou `ritual`. Elle dit `p0` si
    `speak.p0` est activé (point 5) ;
  - muette, `write(text)` ne part pas et `holdKey(true)` ne compte pas ;
  - `stateOf` : `silenced` donne `silenced` ; `linked: false` donne `unreachable` même muette ; `speaking` passe devant ;
  - occupée puis mute levé : le micro reste fermé (point 3).
- [x] Code : les interfaces ci-dessus. Le calcul de `should` dans `#applyMic` gagne `&& !this.silenced`.

### Tâche 4 : le geste, l'écran et les réglages

**Fichiers :** `src/Scene.svelte` (bouton à côté de celui du micro), `src/Fil.svelte` (champ inactif muette, avec la
raison en clair), `src/settings.ts` (`display.muteShortcut`, défaut `'Control+Shift+M'`), `src/desktop/keys.svelte.ts`
(troisième raccourci global, même traitement que `display.shortcut` : `$derived`, refus et « déjà pris »),
`src/Reglages.svelte` (ligne du raccourci ; aide de « P0 » : « Vaut aussi quand elle est muette ») ; tests
`src/desktop/keys.svelte.test.ts`, `src/Scene.test.ts`, `src/desktop/reglages.test.ts`, et un `src/settings.test.ts`
nouveau pour `readSettings`.

- [x] Tests d'abord :
  - `readSettings` d'un ancien réglage sans `muteShortcut` donne le défaut ;
  - `keysFollow` enregistre le raccourci du mute et l'appel bascule `toggleMute` ; un autre réglage sauvé ne le
    réenregistre pas (comme le test du 07/11 pour les deux autres touches) ; un raccourci déjà pris est dit dans
    `keysSaid` ;
  - un raccourci du mute égal à celui de la scène ou à la touche maintenue n'est pas enregistré, et `keysSaid` dit qu'il
    double l'autre (pas « déjà pris par une autre appli ») ;
  - le bouton a un nom accessible qui suit l'état (« Rendre la parole » / « La rendre muette ») et `aria-pressed` ;
  - muette, le champ du fil est `disabled` et dit pourquoi ;
  - `noCore.test.ts` reste vert.
- [x] Code. **Point de design léger** avant le bouton : socle commun, magenta en accent seulement. Vérification à
  l'écran dans la page (Chrome) et dans la fenêtre (CDP), en scène et en petit mode, clair et sombre.
- [x] `docs/README.md` : le mute dans le tableau des états et des réglages, le champ `muted` dans le contrat de
  présence. `CLAUDE.md` si une règle change (a priori non).
- [x] Recette de la spec §7, sur le laptop, **points 2, 4, 6 et 7 joués** (lun-luxuria#22) ; 1, 3 et 5 au desktop (B9), contre un core jetable avec un satellite factice (`luxuria-essai/banc`) :
  points 1 à 7. Pour le point 4 :
  - le satellite factice émet, par `/ctl/emit`, un P0 d'importance `urgent` et un `agenda.reminder` d'importance
    `urgent`, datés de l'instant. Seuls les urgents de moins de 5 min (`P0_FRESH_MS`) sont annoncés ;
  - l'émission vient **après** un battement qui porte le nouvel état (Luxuria rechargée, ou un battement forcé par le
    réglage) ;
  - la file des notifications se lit en base jetable après le tick suivant de l'envoi (`sent` contre `dropped`). Le
    délai d'attente exact est relevé dans `push/queue.ts` au moment de l'écrire.
- [x] Relecture (agent reviewer), critères cochés et preuves dans la PR, passage en « prête ».

## lun-docs

- [x] Ce plan coché, dans une PR de coches (la feuille de route était fusionnée).
