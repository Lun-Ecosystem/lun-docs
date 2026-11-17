# L'IPC de la fenêtre : ce que la page peut encore faire faire à Rust. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** lun-luxuria#78 (`niveau:critique`) ; trois points de lun-luxuria#79, rattachés au tri du 16/11.
>
> **PR livrant :** Lun-Ecosystem/lun-luxuria#87 (brouillon ; tâches 1 à 12 et 16 faites, restent la 13 et la 15).
>
> **État : contesté le 16/11, amendé, validé par CrOliX le 16/11** (« validé »), avec les recommandations marquées
> **[choix Claude]** pour les cinq choix (« Les choix ouverts »), les deux premiers ensemble. La dernière section dit ce
> que la contestation a changé, objection par objection.
>
> Écrit le 16/11 depuis lun-luxuria#78. Code relu sur `main` de lun-luxuria (`30e02c4`), par le graphe d'abord. Sources
> tierces lues dans le cache de Cargo, sans rien en lancer : tauri 2.12.5, tauri-plugin-http 2.8.3,
> tauri-plugin-dialog 2.8.4, rfd 0.17.2, urlpattern 0.6.0, tauri-codegen et tauri-macros 2.7.4, tauri-utils 2.10.2 ;
> reqwest 0.12.28 et hyper-util 0.1.21 en partie.

**But :** si la page de la fenêtre était un jour compromise, elle ne doit plus faire tourner le code d'un dossier de son
choix, ni faire joindre par le service voix une adresse hors de la boucle locale. Ce qui reste ouvert est tranché par
CrOliX, fait ou renvoyé à une issue, et le `CLAUDE.md` de Lun'Luxuria le dit tel quel.

**Source :** lun-luxuria#78 : le constat (neuf sorties), les pièges, la variante la moins chère, les critères. Le tri du
16/11 y rattache trois points de lun-luxuria#79 : l'exemple de chemin de `src-tauri/src/voice.rs` (`:284`, `:298`) à
rendre neutre ; le `CLAUDE.md` qui doit dire que c'est le code Rust qui sonde l'adresse d'un programme ; le `CLAUDE.md`
qui doit citer la défense « aucune permission `dialog:` ».

**Critères de fin**, ceux de l'issue, figés :

- La première tâche est un test qui prouve le mécanisme avant tout changement : une entrée de portée pour la boucle
  locale (`127.0.0.1`, `localhost`, `[::1]`, avec et sans port) lue par le plugin, et ce qu'elle refuse ; une
  redirection hors de la portée refusée avec `scopeRedirects`.
- Aucune commande de la fenêtre ne prend un dossier de la page.
- Aucune adresse passée au service ne sort de la boucle locale ; `--origin` refusé ; un test par cas.
- Les choix de la variante tranchés par CrOliX pour le reste de la liste, et faits ou renvoyés à une issue.
- Le `CLAUDE.md` dit ce que fait le code, avec les sorties qui restent.
- Barrières de la page et de Rust vertes. La preuve dans l'exe, lancé depuis l'Explorateur, par CrOliX : une boîte
  du système ne se clique pas par un agent.

| Dépôt, branche                          | Issue                                           | Niveau     |
| --------------------------------------- | ----------------------------------------------- | ---------- |
| `lun-luxuria`, `feat/ipc-de-la-fenetre` | lun-luxuria#78 ; trois points de lun-luxuria#79 | `critique` |
| `lun-docs`, `docs/ipc-de-la-fenetre`    | lun-luxuria#78, pour ce plan                    | `trivial`  |

_Ask_ ([`git.md`](../../standards/git.md), lignes 40 à 42) : la fenêtre Tauri ne se prouve que dans l'exe, par CrOliX.
La PR de Lun'Luxuria reste en brouillon jusque-là.

**Hors périmètre**, celui de l'issue : la CSP ; le contenu de `service.py` au-delà de ses arguments ; Lun'Anima. En
plus : le troisième point de lun-luxuria#79, l'interface du serveur compatible dans `docs/README.md`, qui reste à #79 ;
la dépendance de kokoro qui manque au script (`voix/service.py:1-4`), qui est son contenu ; retirer plugin-http (choix
2 (b), écarté).

## Ce que le code fait aujourd'hui

Les chemins sont ceux de lun-luxuria, sauf mention d'un paquet tiers. Les lignes citées par l'issue (relue sur
`11eb3d1`) sont les mêmes sur `30e02c4`.

### Les défenses en place

- **Aucune permission `dialog:` pour la page** : `src-tauri/capabilities/default.json:6-45` n'en a pas. Le plugin sert
  à Rust seul (`src-tauri/src/lib.rs:23-24`).
- **Les programmes** : le `.exe` se choisit dans la boîte de dialogue du système, ouverte par Rust, modale
  (`src-tauri/src/programs.rs:209-235`), gardé dans `programmes.json` au dossier de configuration (`:195-202`).
- **Le corps** : la lecture est bornée au dossier donné, aux noms simples d'images et à une taille
  (`src-tauri/src/body.rs:17-73`).
- **Le service voix** : programme fixe, `uv run service.py`, sans shell (`src-tauri/src/voice.rs:49-62`).
- **La page** : aucun sink HTML ; la CSP (`src-tauri/tauri.conf.json:24`).

### Le réseau (sorties 1 à 5)

1. **Tout hôte** : la portée de `http:default` admet `http://*:*/*`, `https://*:*/*`, `http://*/*` et `https://*/*`
   (`default.json:8-24`).
2. **Le proxy de la page** : tauri-plugin-http vérifie la portée sur l'adresse demandée (`src/commands.rs:290`), puis
   attache le proxy que la page passe (`:323-325`, `attach_proxy` `:157-179`). Un proxy explicite de reqwest prend une
   liste d'exclusions vide (reqwest `src/proxy.rs:265-274`, `:376-386`), et le `Matcher` de hyper-util n'exclut alors
   aucun hôte, la boucle locale comprise (hyper-util `src/client/proxy/matcher.rs:122-133`, `:315-319`).
3. **Les redirections** : `scopeRedirects` vaut `false` par défaut (plugin `src/config.rs:10-26`) ; sans lui, la
   politique suit dix redirections sans regarder la portée (`commands.rs:191-200`, `:320-321`). Avec
   `maxRedirections` à 0, aucune n'est suivie (`:192-194`). `tauri.conf.json` n'a pas de section `plugins`.
4. **Le modèle** : une adresse absolue part telle quelle par plugin-http, sans `serverWarning`
   (`src/desktop/net.ts:22`). Le modèle en http hors de la boucle locale n'est refusé que s'il a une clé
   (`src/local.ts:58-68`).
5. **La sonde** : `program_state` et `program_start` reçoivent `addr` de la page (`programs.rs:242-266`), que la page
   tire du champ (`src/desktop/voix.ts:252-259`, appels `:319`, `:372`). `listening` ouvre une connexion TCP vers
   cette adresse, quelle qu'elle soit (`programs.rs:93-97`).

**Ce que la lecture ajoute à l'issue.** Tant que la portée admet tout hôte, le proxy et les redirections n'ajoutent
rien : la page joint déjà tout hôte, et `scopeRedirects` ne refuse qu'une redirection hors d'une portée qui n'a pas de
dehors. Resserrer la portée est le seul geste qui change quelque chose, et le proxy le défait : une adresse admise peut
passer par un proxy choisi par la page, qui lit alors la requête entière en http, au moins l'hôte en https. Les choix 1
et 2 se tranchent donc ensemble.

Autres faits lus, utiles aux choix :

- **Un plugin peut en envelopper un autre.** Le trait `Plugin` est public (tauri `src/plugin.rs:37-113`), et
  `Builder::plugin` prend tout type qui l'implémente (`src/app.rs:1962`). Un appel `plugin:http|fetch` passe d'abord
  l'ACL, puis va au plugin dont `name()` vaut `http`, par son `extend_api` (`src/webview/mod.rs:2051-2121`,
  `src/plugin.rs:986-996`). Le nom de la commande et ses arguments s'y lisent (`Invoke`, `src/ipc/mod.rs:211-219` ;
  `command()` et `payload()`, `:538-558`). `Invoke` est dit « explicitly NOT stable » (`:207-209`), et `extend_api`
  doit changer de nom en v3 (`src/plugin.rs:107`). La section `plugins.<nom>` de la configuration va au plugin par son
  nom (`:1005-1008`).
- **Les commandes de plugin-http** : `fetch`, `fetch_cancel`, `fetch_send`, `fetch_read_body`, `fetch_cancel_body`
  (plugin `src/lib.rs:152-158`). Seul `fetch` crée une requête ; les autres travaillent sur le numéro qu'il rend.
  `fetch` lit `clientConfig` : `method`, `url` (un `url::Url`), `headers`, `data`, `connectTimeout`,
  `maxRedirections`, `proxy`, `danger` (`commands.rs:90-101`). Il sert aussi `data:` (`:387-406`).
- **Le module `scope` du plugin est privé** (plugin `src/lib.rs:71-76`) : un test de Lun'Luxuria ne lit pas les motifs
  lui-même. Il passe par une appli de test et l'IPC (tâche 1).
- **`danger` est refusé** sans la fonction `dangerous-settings` (`commands.rs:296-307`), qui n'est pas activée. Les
  fonctions par défaut du plugin comprennent `system-proxy` et `cookies` (plugin `Cargo.toml:67-73`).
- **Les cookies** : le plugin ouvre `.cookies` au dossier de cache de l'appli, et le crée s'il manque (plugin
  `src/lib.rs:106-123`). Il le réécrit en entier à chaque `Set-Cookie` reçu (`src/reqwest_cookie_store.rs:86-118`) et
  à la sortie (`lib.rs:136-151`). L'appli n'envoie aucun cookie : un jeton `Bearer` seulement (`src/core.ts:55`,
  `:129`, `src/local.ts:208`).
- **`add_capability`** existe à l'exécution (tauri `src/lib.rs:840-848`, fonction `dynamic-acl`, active par défaut).
  Il résout la capacité avec un `.unwrap()` (`src/ipc/authority.rs:174-180`) et n'ajoute que : aucune fonction ne
  retire (`:183-216`). À chaque appel, les portées de toutes les capacités se lisent ensemble, et une seule entrée
  illisible fait échouer l'appel (`CommandScope::resolve`, `:526-551`, le `?` de `:540`).
- **L'appli de test de tauri** : `mock_builder` (`src/test/mod.rs:166`), construite sur `generate_context!()` comme sa
  doc le montre (`:157-165`, `:264-268`), et `get_ipc_response` (`:297`), derrière la fonction `test`. `mock_context`
  a une ACL vide (`:143`). Sous `cargo test`, sans `custom-protocol`, le contexte est celui du dev (tauri-macros
  `src/context.rs:155`) et, `devUrl` donné, n'embarque pas la page (tauri-codegen `src/context.rs:176-180`).
- **Les boîtes de message** : rfd, compilé avec `common-controls-v6` (dialog `Cargo.toml:111-114`), passe
  `nDefaultButton: 0` (rfd `src/backend/win_cid/message_dialog.rs:155`) : le premier bouton est celui d'Entrée. Échap
  rend `Cancel` (`:137`, `:174-181`), que le plugin traduit par le texte du bouton d'annulation (dialog
  `src/desktop.rs:236-251`). `blocking_show` rend vrai sur le premier bouton (dialog `src/lib.rs:338-357`, `:372`) ;
  `blocking_show_with_result` rend le texte du bouton pressé (`:382`).
- **Deux boîtes à la fois** : `program_pick` est modale à la fenêtre (`programs.rs:209-213`). Un second clic ne passe
  pas ; un second appel de la page ouvre une autre boîte.

### Les dossiers et les arguments (sorties 6 à 9)

6. **Le dossier du corps** : un champ de texte (`src/desktop/DossierCorps.svelte:17-25`), gardé dans les réglages de la
   page (`src/settings.ts:46-47`), relu à chaque changement (`src/desktop/corps.svelte.ts:119-127`) et passé à chaque
   lecture (`:80`, `:88`, `:96`). Rust le prend tel quel (`body.rs:75-83`).
7. **Le dossier du service** : un champ (`src/desktop/ServiceVoix.svelte:253-260`, `settings.ts:63`), passé à
   `voice_start` et `voice_restart` (`voix.ts:152`, `:225`). Rust lance `uv run service.py` dans tout dossier qui
   contient un `service.py` (`voice.rs:27-33`, `:219-241`) : c'est du code, choisi par la page. `checked_dir` passe le
   dossier par `fs::canonicalize` (`voice.rs:28`), qui rend sous Windows un chemin en `\\?\` ; `checked_exe` garde le
   chemin tel qu'écrit (`programs.rs:54-67`). `voice_running` ne rend que les arguments (`voice.rs:20`, `:243-246`) :
   `changes` ne compare qu'eux (`voix.ts:194-201`).
8. **Les arguments du service** : tirés des champs (`voix.ts:18-26`), puis les lignes libres, tapées à l'écran
   (`ServiceVoix.svelte:372-387`). Rust ne borne que leur nombre (32) et leur longueur (1 024) (`voice.rs:35-46`). Le
   service :
   - joint l'adresse de whisper-server (`voix/service.py:56-63`) et de RVC (`:116`), et les sonde (`:126-141`) ;
   - ouvre une page de plus à son CORS par `--origin` (`:324`, `:331-332`) ;
   - charge un fichier par `--tts piper:<chemin>` (`:79-82`), que les lignes libres peuvent porter (`voix.ts:31`) ;
   - prend `--tts kokoro:<modèle>:<voix>` (`:89-94`), mais `kokoro_onnx` manque aux dépendances du script (`:1-4`) :
     sous `uv run`, cette voix ne se charge pas (lu, pas essayé) ;
   - passe `faster:<nom>` à faster-whisper tel quel (`:47`).

   Le parseur est créé sans `allow_abbrev` (`:317`) : argparse accepte alors une abréviation, `--orig` vaut `--origin`.
   Une liste de refus ne suffit pas. `--origin` et `--port` ne servent qu'aux bancs, lancés par Node, hors de Rust
   (`src/presence/chaine.test.ts:574`, `src/listen/gestes.test.ts:414`).

9. **Les arguments des programmes** : libres, un par ligne (`ServiceVoix.svelte:157-167`), bornés comme ceux du service
   (`programs.rs:124`), passés à `program_start(name, args, addr)` (`:243-257`). L'exe est celui de la personne ; ses
   options sont libres.

### Ce que l'écran dit aujourd'hui

- La scène dit « Sa voix ne répond pas : ni écoute ni parole pour l'instant. », avec « Régler la voix »
  (`src/Scene.svelte:131-135`). Ce qui manque au service (`missing`, `voix.ts:29-35`) ne s'affiche que dans les
  réglages avancés, sur l'interrupteur « Lancer le service voix avec l'appli » (`ServiceVoix.svelte:238-251`), et le
  champ du dossier n'y paraît que s'il est actif (`:252-261`).
- Un dossier du corps illisible donne le souffle (`corps.svelte.ts:70-102`), sans rien dire sur la scène.
- `merged` ne garde que les clés de `DEFAULTS` (`settings.ts:135-145`) : une clé renommée qui n'y entre pas se perd au
  premier chargement. `fromArgs` reporte `folder` (`:171`).
- Le suivi d'un programme prend toute erreur de `program_state` pour « il démarre » (`voix.ts:372`).

### Les points de lun-luxuria#79

- L'exemple de chemin de `voice.rs:284` et `:298` nomme un dossier d'un poste. Il devient inventé (tâche 3).
- `CLAUDE.md:36-41` dit « l'adresse que sonde un programme » : c'est Rust qui sonde (`programs.rs:93-97`). Et il ne cite
  pas l'absence de permission `dialog:`. Les deux entrent à la tâche 13.

## Les choix ouverts

Chacun avec ses options, leur coût, leur risque, et ma recommandation. CrOliX tranche par écrit.

### 1 et 2. Le réseau de la fenêtre : par où passe le filtre, et ce qu'il admet

Ils se tranchent ensemble : resserrer la portée ne sert à rien tant que la page choisit son proxy.

**2. Par où passe le filtre.**

- **(a) Nulle part, dit dans `CLAUDE.md`.** Coût : rien. Conséquence : le choix 1 ne protège pas d'une page compromise.
- **(b) Une commande Rust à la place de plugin-http.** `net_fetch` et `net_cancel` avec reqwest, sans proxy ni
  cookies ; le corps en flux par un `Channel`, et dans la page une `Response` sur un `ReadableStream` (le serveur et le
  modèle répondent par morceaux, `src/brain.ts:57`). Coût : élevé, trois tâches, de l'ordre de 250 lignes de Rust et
  100 de page. Risque : le premier mot passe par ce nouveau flux et se réentend sur le desktop. Écarté par (d).
- **(c) plugin-http recopié et corrigé**, par `[patch.crates-io]`. Coût : chaque mise à jour reportée à la main.
  Écarté.
- **(d) Une enveloppe de plugin-http.** Notre type, nommé `http`, garde `tauri_plugin_http::init()` et lui passe les
  dix méthodes du trait. Dans `extend_api`, l'appel `fetch` se vérifie avant de passer : pas de `proxy` ;
  `maxRedirections` à 0 ; l'adresse lue par `tauri::Url`, l'analyseur du plugin (`commands.rs:94`), et admise par la
  règle du choix 1. Refusé : le message, et rien n'est créé. Les quatre autres commandes passent telles quelles. L'ACL,
  la configuration `plugins.http` et le flux du corps restent ceux du plugin : rien à réécouter. Côté page, une ligne :
  `maxRedirections: 0` (`net.ts:22`, `:26`). Coût : deux tâches (Rust, page), de l'ordre de 150 lignes de Rust et 60
  de page, tests compris. Risques : `Invoke` n'est pas stable et `extend_api` change de nom en v3 ; `Cargo.lock` fige
  tauri, et le test de la tâche 7 casse si le chemin change. Une erreur de l'enveloppe coupe tout le réseau de la
  fenêtre : ses tests couvrent l'admis autant que le refusé.

**1. Ce que le filtre admet**, avec 2 (d).

- **(a) Tout hôte.** L'enveloppe ne ferme que le proxy et les redirections. Coût : la tâche 7 sans hôtes, la 12 à une
  ligne. Gain : la page ne fait plus lire ses requêtes par un tiers ; elle joint encore tout hôte.
- **(b) La boucle locale seule** : `127.0.0.1`, `localhost`, `[::1]`. Coût : celui de (a), plus une fonction. Risque :
  la fenêtre ne joint plus un serveur ni un modèle sur une autre machine. Le relié casse quand le serveur quitte le
  poste ([ADR 0012](../../adr/0012-prod-machine-dediee.md)), comme un modèle en ligne. L'onglet du navigateur le peut
  encore.
- **(c) La boucle locale, plus les hôtes confirmés par la personne**, dans une boîte de message du système, au réglage
  de l'adresse, jamais à l'appel. Un hôte est une origine, `schéma://hôte:port`. Gardés côté Rust dans `hotes.json`,
  relus à chaque `fetch`, comme `programmes.json` à chaque lancement (`programs.rs:253`) : un hôte oublié l'est sur le
  moment, et aucun ordre de démarrage n'est à tenir. Sans confirmation, aucun gain : une page compromise réglerait son
  propre hôte. Coût : les tâches 7 et 12 entières. Risque : une boîte de plus, au réglage d'une adresse hors du poste.

Par l'ACL et sans enveloppe, (c) demandait `add_capability` : le `.unwrap()`, l'entrée illisible qui coupe tout le
réseau, l'hôte retiré au redémarrage seulement (plus haut). L'enveloppe ne s'en sert pas. `default.json` garde sa
portée : le filtre de l'enveloppe est plus étroit qu'elle.

**[choix Claude] pour 1 et 2** : 2 (d) avec 1 (c), dans ce chantier (tâches 7 et 12). (d) ferme le bloc pour deux
tâches, sans toucher au flux du corps ; (c) garde le relié hors du poste.

_Si CrOliX prend 1 (b) ou 1 (a)_ : la tâche 7 sans les hôtes, la 12 réduite à `maxRedirections` ; en (a), l'enveloppe
ne regarde pas l'hôte. _Si CrOliX prend 2 (a)_ : les tâches 7 et 12 tombent, et le `CLAUDE.md` dit le réseau ouvert.
_S'il renvoie 2 (d) à plus tard_ : la tâche 14 en fait une issue, avec les tâches 7 et 12 telles qu'écrites.

### 3. Le chemin de piper

Aujourd'hui : un champ (`ServiceVoix.svelte:315-322`), passé en `--tts piper:<chemin>` (`voix.ts:22`). Un chemin
`\\hôte\partage\…` fait ouvrir par Windows une connexion SMB vers cet hôte (connu de Windows, pas essayé ici) : une
adresse hors de la boucle locale, que le critère 3 refuse.

- **(a) Choisi dans la boîte de dialogue du système**, gardé côté Rust comme les dossiers ; Rust écrit `--tts`, refusé
  dans les lignes libres. Coût : une commande et une ligne d'écran de plus, sur le modèle des tâches 4 et 8, et l'avis
  au chemin enregistré.
- **(b) Laissé à la page, borné par Rust** : un fichier `.onnx` de ce poste, par son chemin complet à lettre de lecteur,
  sans chemin réseau, existant. Coût : une fonction et ses tests, dans la tâche 3. Risque : la page fait encore charger
  tout `.onnx` du poste comme voix ; un lecteur réseau monté par la personne, sous une lettre, passe.
- **(c) Laissé tel quel.** Ne tient pas le critère 3.

**[choix Claude]** : (b). Le dossier du service fait tourner du code, d'où la boîte de dialogue ; le fichier de voix est
une donnée, la borne suffit. _Si CrOliX prend (a)_ : une tâche Rust et une tâche page de plus, après la 4 et la 9.

kokoro n'est pas un choix : la fenêtre le refuse, il ne se charge pas sous `uv run` (sortie 8).

### 4. Les arguments des programmes

Aujourd'hui libres (sortie 9). L'exe est celui de la personne, mais ses options peuvent changer ce qu'il fait : écouter
sur tout le réseau, servir un dossier, lire un fichier par un chemin réseau. Je n'ai lu ni les options de whisper-server
ni celles de RVC.

- **(a) Libres, dits dans `CLAUDE.md`.** Coût : rien.
- **(b) Confirmés par la personne** dans une boîte de message du système quand ils changent, gardés côté Rust avec
  l'exe ; `program_start` ne les prend plus. Entrée et Échap refusent (tâche 6). Coût : les tâches 6 et 11, moyen ; une
  confirmation par changement, rare. Risque : la boîte montre les arguments bruts, que la personne a tapés. Une page
  compromise qui en demande ouvre une boîte inattendue, que la personne refuse.
- **(c) Bornés par Rust** : aucun chemin réseau dans un argument, puis des règles par programme. Coût : faible pour le
  chemin réseau ; fragile pour le reste, les options d'un tiers changent sans nous.

**[choix Claude]** : (b), la suite de `program_pick` : ce que l'appli lance, exe et arguments, la personne l'a choisi.
_Si CrOliX prend (a)_ : les tâches 6 et 11 tombent ; la sonde (5 et 10) reste. _(c)_ : la tâche 6 refuse un argument
qui commence par `\\` ou `//`, sans boîte, et la 11 tombe.

### 5. La sonde de `program_state` et `program_start`

- **(a) L'adresse du champ, bornée par Rust** à la boucle locale par la règle de la tâche 3, qui en tire `hôte:port`.
  Coût : faible ; `addrOf` quitte la page. Risque : un programme sur une autre machine ne se suit plus ; l'appli ne le
  lance pas non plus.
- **(b) Le port seul, sondé sur `127.0.0.1`.** Coût : le plus faible. Risque : un programme qui n'écoute que sur
  `[::1]` se dit absent.
- **(c) Rust tire l'adresse des arguments confirmés.** Coût : lire les options de chaque programme. Fragile.

**[choix Claude]** : (a). Une règle, une fonction, pour le service et la sonde. _Si CrOliX prend (b)_ : la tâche 5
prend un port, la 10 le tire du champ.

## Les tâches

**Pour chaque tâche.** Le `testeur` écrit les tests d'abord, les voit échouer, les commite ; puis `dev-luxuria` code,
dans le même worktree. Le `reviewer` relit chaque diff contre sa tâche. Le `livreur` coche ce plan et ouvre la PR en
brouillon. Chaque agent commence par le graphe ; aucun ne lit ni n'affiche un `.env`. Aucun son, aucun nom d'instance,
aucun chemin de poste dans le dépôt. Une boîte du système ne se teste que dans l'exe (tâche 15) : ce qui la précède,
oui, la boîte passée en paramètre pour que le test voie si elle s'ouvre.

**Les barrières**, une commande par ligne, à la racine de lun-luxuria.

- La page :

  ```
  npm run format:check
  npm run lint
  npm run typecheck
  npm test
  npm run mutations
  ```

- Rust, la page construite d'abord (l'appli l'embarque) :

  ```
  npm run build
  cargo fmt --check --manifest-path src-tauri/Cargo.toml
  cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
  cargo test --manifest-path src-tauri/Cargo.toml
  ```

- La surface publique, lun-docs cloné à côté : `node <lun-docs>/tools/check-repo.mjs --public .`

**L'ordre et le parallèle.** La 1 part seule. Ensuite, chaque piste dans son worktree, créé depuis la branche du
chantier :

- **La 2** quand on veut après la 1 : `tauri.conf.json` et `Cargo.toml` seulement.
- **Piste Rust**, dans l'ordre : 3, 4, 5, 6. Elles partagent `voice.rs`, `programs.rs` et `lib.rs`. **La 7** après la
  4, dont elle prend la garde des boîtes, _en parallèle de la 5 et de la 6_ ; dans `lib.rs`, chacune ajoute ses lignes,
  la dernière fusionnée se rebase.
- **Piste page**, après la 1, _en parallèle de la piste Rust_, dans l'ordre : 8, 9, 10, 11. Elles partagent `voix.ts`,
  `ServiceVoix.svelte`, `session.svelte.ts`, `settings.ts` et leurs tests. **La 12** _en parallèle d'elles_ : `net.ts`,
  `Reglages.svelte`, `Arrivee.svelte`. Les contrats des commandes sont écrits ici : la page se code contre eux, l'appel
  à Rust simulé.
- **La 13** après les deux pistes ; **la 14** dès la validation ; **la 15** en dernier.

### Le mécanisme

1. - [x] **Le test du mécanisme, avant tout changement** (`testeur`). Critère 1.
   - Fichiers : `src-tauri/Cargo.toml` (en dev-dependencies, `tauri` avec la fonction `test`) ;
     `src-tauri/src/net_scope.rs`, nouveau, sous `#[cfg(test)]` ; `src-tauri/src/lib.rs`
     (`#[cfg(test)] mod net_scope;`).
   - L'appli de test, une fonction que les tâches 2 et 7 reprennent : `tauri::test::mock_builder()`, le plugin qu'on lui
     donne, construite sur `tauri::generate_context!()` pour les manifestes d'ACL et la configuration, `plugins`
     compris, comme la doc de tauri le montre. Pas sur `mock_context` : son ACL est vide.
   - Ses dossiers dans un dossier temporaire : `ctx.config_mut().app.app_directories_override =
Some(AppDirectoriesOverride::Root(<temp>))`, comme les tests de tauri (tauri `src/path/desktop.rs:374-378` ;
     tauri-utils `src/config.rs:3232-3242`). Sans cela, le plugin crée et réécrit le `.cookies` du vrai dossier de
     cache du poste (« Les cookies », plus haut).
   - Les appels passent par l'IPC, comme la page : `get_ipc_response`, avec l'adresse `http://tauri.localhost`
     (l'origine locale sous Windows, tauri `src/test/mod.rs:220-224`) et `tauri::test::INVOKE_KEY` ;
     `plugin:http|fetch` puis `plugin:http|fetch_send`. La portée se vérifie au `fetch`, avant tout envoi : admis, il
     rend un numéro de ressource et n'envoie rien.
   - Les capacités d'essai, par `app.add_capability`, chacune pour sa fenêtre, avec `http:default` et ses entrées :
     - `essai` : `http://` et `https://` pour `127.0.0.1:*` et `localhost:*` ;
     - `essai-v6` : `http://[::1]:*/*` et `https://[::1]:*/*` ;
     - `essai-v6e` : les mêmes, les `:` échappés, `http://[\:\:1]:*/*` (dans le JSON : `\\:`). urlpattern lit l'hôte en
       mode strict (urlpattern `src/parser.rs:377-379`), où un `:` sans nom derrière est une erreur
       (`src/tokenizer.rs:184-206`).

     Une fenêtre par écriture : une entrée illisible fait tomber sa capacité entière, pas les autres. La fenêtre `main`
     garde `default.json`.

   - Admis par `essai` : `http://127.0.0.1/`, `http://127.0.0.1:8080/v1`, `http://localhost/`,
     `http://localhost:11434/x`, et les mêmes en https. Par l'écriture de `[::1]` qui se lit : `http://[::1]/`,
     `http://[::1]:8788/`, et en https.
   - Refusés, par « url not allowed on the configured scope » (plugin `src/error.rs:38`) : `http://127.0.0.2/`,
     `http://127.0.0.1.example/`, `http://localhost.example/`, `http://example.com/`, `http://[::2]/`.
   - La redirection, sur `essai` : un `TcpListener` sur `127.0.0.1:0` répond une fois `302` vers `http://192.0.2.1/`,
     une adresse de documentation. `fetch` vers lui, avec `connectTimeout` à 300 ms, puis `fetch_send` : on attend le
     refus de portée, pas une erreur de réseau.
   - La portée de `main`, écrite comme elle est : `https://example.com/` y est admis. Ce test change de sens le jour où
     la portée se resserre.
   - Échec attendu sur `main` : la redirection, suivie, finit en erreur de réseau. Pour `[::1]`, on attend l'écriture
     brute illisible et l'échappée lue ; le testeur écrit ce qu'il constate et le dit dans son rapport. Aucune entrée
     n'entre dans `default.json` sans avoir été essayée ici.
   - Barrières : Rust ; la surface publique.
   - Exclu : changer `default.json`, `tauri.conf.json` ou les fonctions du plugin (tâche 2).

   Fait le 16/11 (lun-luxuria#87, `386a47f`, `8d0b468`, `b7bc151`, `c42f6a5`) : l'appli de test sur `generate_context!()`, dossiers
   en temporaire ; `[::1]` brut est illisible, échappé il est lu. `build.rs` et `app.manifest` s'ajoutent à la liste :
   sans eux le binaire de test sort en `STATUS_ENTRYPOINT_NOT_FOUND` (muda veut Common Controls v6).

2. - [x] **Le plugin : les redirections dans la portée, sans cookies** (`testeur`, puis `dev-luxuria`). _Après la 1,
         en parallèle du reste._
   - `src-tauri/tauri.conf.json` : `"plugins": { "http": { "scopeRedirects": true } }`. Une clé mal écrite empêche le
     démarrage : le plugin la refuse (`deny_unknown_fields`, plugin `src/config.rs:9`), tauri le dit à l'initialisation
     (`src/plugin.rs:801-806`), et `lib.rs:45-46` s'arrête. L'appli de test lit la même configuration : `cargo test`
     le voit.
   - `src-tauri/Cargo.toml:24` : `tauri-plugin-http = { version = "2.8.3", default-features = false, features =
["rustls-tls", "http2", "charset", "system-proxy"] }`, les fonctions par défaut moins `cookies`. L'appli n'en
     envoie aucun (« Les cookies », plus haut).
   - Tests : la redirection de la tâche 1 passe au vert ; après la construction de l'appli de test, aucun `.cookies`
     dans son dossier de cache. Échec attendu sur `main` : le plugin le crée (plugin `src/lib.rs:106-114`).
   - Dit tel quel dans la PR : tant que `main` admet tout hôte, `scopeRedirects` ne change rien pour elle ; avec 2 (d),
     la page ne demande plus aucune redirection.
   - Barrières : Rust ; la surface publique.
   - Exclu : `default.json`.

   Fait le 16/11 (lun-luxuria#87, `cc7ca32`, tests dans `b7bc151`) : `scopeRedirects`, `tauri-plugin-http` sans `cookies`,
   `Cargo.lock` perd 5 paquets.

### Piste Rust

3. - [x] **La boucle locale, et les arguments du service** (`testeur`, puis `dev-luxuria`). Critère 3 ; choix 3 (b) ;
         lun-luxuria#79, l'exemple de chemin.
   - Fichiers : `src-tauri/src/loopback.rs`, nouveau ; `src-tauri/src/voice.rs` ; `src-tauri/src/lib.rs`.
   - `loopback::addr(url)` : `http://` ou `https://`, puis `127.0.0.1`, `localhost` ou `[::1]`, puis un `:port`
     facultatif (1 à 65535), puis un `/` au plus. Schéma et hôte sans égard à la casse. Rien d'autre : ni nom
     d'utilisateur, ni chemin, ni requête, ni fragment. Écrite à la main, sans analyseur d'URL : le service relit
     l'adresse avec httpx, et deux analyseurs qui divergent laisseraient passer un hôte. Elle rend `hôte:port`, le
     port du schéma s'il manque, pour la sonde (tâche 5).
   - `checked_service_args(args)`, appelée par `start` (`voice.rs:128`) et `restart_with` (`:169`) à la place de
     `checked_args`, qui reste pour les programmes (`programs.rs:124`). Après `checked_args` :
     - `--drapeau=valeur` se lit comme `--drapeau valeur` ; chaque drapeau a une valeur, qui ne commence pas par `-` ;
     - les drapeaux admis, mot pour mot : `--stt`, `--tts`, `--rvc`, `--rvc-gain`, `--lang`. Tout autre est refusé,
       nommé : `--origin`, son abréviation (`--orig`), `--port`, `-h`, `--`, un mot seul ;
     - `--stt` : `faster:<nom>`, le nom vide ou en lettres, chiffres, `.`, `_` et `-` (ni chemin ni dépôt) ; ou
       `whisper-server:<adresse>`, par `loopback::addr` ;
     - `--rvc` : par `loopback::addr` ;
     - `--tts` : `aucun`, ou `piper:<fichier>` : un chemin absolu qui commence par une lettre de lecteur, sans `\\` ni
       `//` en tête, un fichier `.onnx` qui existe. `kokoro:` est refusé (sortie 8) ;
     - `--rvc-gain` : un nombre de 0 à 10, la borne de l'écran ; `--lang` : deux ou trois lettres minuscules ;
     - chaque occurrence se vérifie : argparse garde la dernière.
   - Chaque refus nomme le champ, comme l'écran le nomme, et l'argument : « Transcription : adresse refusée : …
     (127.0.0.1, localhost ou [::1] seulement). », « RVC : adresse refusée : … », « Voix : fichier refusé : … (un
     .onnx de ce poste, par son chemin complet). », « Voix : kokoro ne se lance pas depuis l'appli. », « Autres
     arguments : --origin refusé. » La page montre déjà le refus tel quel (`voix.ts:153-155`, `:226-230`).
   - Ce qui casse : rien de ce que la page envoie (`voix.ts:18-26`) ; `--port` est fixé par la CSP et `net.ts:8`.
     Perdus : un modèle de faster-whisper par chemin ou par dépôt, que l'écran n'offre pas (le champ prend un nom) ;
     kokoro, qui ne se chargeait pas.
   - L'exemple de chemin de `voice.rs:284` et `:298` devient un dossier inventé, qui garde une espace :
     `C:\voix\ma voix.onnx`.
   - Tests, un par cas :
     - adresses admises : les trois hôtes, avec et sans port, avec un `/` final ;
     - refusées : `http://127.0.0.1:8080@example.com`, `http://127.0.0.1.example:8080`, `http://127.0.0.2:8080`,
       `http://[::ffff:127.0.0.1]:8080`, `http://localhost:8080/inference`, les ports 0 et 65536, `ftp://127.0.0.1` ;
     - arguments admis : ceux que bâtit `serviceArgs` (`voix.ts:18-26`) avec les réglages par défaut, avec
       whisper-server, avec RVC, avec un fichier de voix créé dans un dossier temporaire ;
     - refusés : `--origin x`, `--origin=x`, `--orig x`, `--port 9`, `whisper-server:http://192.0.2.1:8080`,
       `--rvc http://example.com`, `piper:\\hote\partage\v.onnx`, `piper:v.onnx`, un `.onnx` absent,
       `kokoro:m.onnx:v.bin`, `faster:org/model`, `faster:C:\m`, `--rvc-gain inf`, deux `--stt` dont le dernier est
       refusé, un drapeau sans valeur ; chaque message nomme son champ ;
     - un argument refusé ne lance rien et n'arrête rien : sur le modèle de
       `a_running_service_survives_a_refused_restart_then_restarts` (`voice.rs:360-412`).
   - Échec attendu sur `main` : les tests ne compilent pas, `loopback` et `checked_service_args` n'existent pas.
   - Barrières : Rust ; la surface publique.
   - Exclu : `service.py` ; la page ; les programmes (tâche 5).

4. - [x] **Les dossiers choisis par la personne, et une boîte à la fois : Rust** (`testeur`, puis `dev-luxuria`).
         Critère 2. Après la 3.
   - Fichiers : `src-tauri/src/folders.rs` et `src-tauri/src/one_box.rs`, nouveaux ; `src-tauri/src/body.rs` ;
     `src-tauri/src/voice.rs` ; `src-tauri/src/programs.rs` ; `src-tauri/src/lib.rs`.
   - Le contrat, que la page suit (tâches 8 et 9) :
     - `folder_pick(name)` : `corps` ou `voix`, rien d'autre. Rend le chemin gardé, `null` si la personne annule, une
       erreur si le dossier est refusé ou si une boîte est déjà ouverte ;
     - `folder_paths()` : `{ corps?: string, voix?: string }`, un dossier absent omis, jamais `null`
       (`skip_serializing_if`) ; `folder_forget(name)` ;
     - `body_config()` et `body_image(name)` ; `voice_start(args)` et `voice_restart(args)` ;
     - `voice_running()` : `{ folder, args }`, ou `null`.
   - **Une boîte à la fois** (`one_box.rs`) : un `AtomicBool` de l'appli, pris par un garde qui le rend à sa fin, même
     sur erreur. `program_pick` (`programs.rs:213-235`) et `folder_pick` le prennent, et les boîtes des tâches 6 et 7.
     Déjà pris : « Une boîte est déjà ouverte. », et rien ne s'ouvre.
   - `folder_pick` sur le modèle de `program_pick` : la boîte de dialogue des dossiers du système
     (`blocking_pick_folder`, dialog `src/lib.rs:738`), modale à la fenêtre (`set_parent`), titrée « Le dossier du
     corps » ou « Le dossier du service voix ».
   - Le dossier se vérifie avant d'être gardé : `corps.json` dedans pour `corps` ; `voice::checked_dir` pour `voix`.
     Refusé : le message, rien d'écrit, l'ancien choix reste.
   - `checked_dir` (`voice.rs:27-33`) garde le chemin tel que choisi : absolu, un dossier, avec `service.py` ; plus de
     `fs::canonicalize`, qui rend `\\?\` sous Windows. Comme `checked_exe` (`programs.rs:54-67`).
   - Gardé dans `dossiers.json`, au dossier de configuration, à côté de `programmes.json`. Lu par `programs::read_paths`
     (`programs.rs:70-75`), qui ne dépend pas des noms ; écrit sur le modèle de `save_path` (`:78-90`).
   - `body_config` et `body_image` (`body.rs:75-83`) lisent le dossier gardé ; sans lui : « Aucun dossier du corps
     choisi. » `config` et `image` (`:63-73`) et leurs tests ne changent pas.
   - `voice_start` et `voice_restart` (`voice.rs:219-241`) lisent le dossier gardé ; `checked_dir` repasse au lancement,
     car le dossier a pu changer sur le disque. Sans lui : « Choisis d'abord le dossier du service. » `start`,
     `restart` et leurs tests gardent leur paramètre de dossier.
   - `Launched` (`voice.rs:20`) garde aussi le dossier, et `voice_running` (`:243-246`) le rend avec les arguments : la
     page voit un dossier changé (tâche 9).
   - Les commandes s'enregistrent dans `lib.rs:31-44`.
   - Tests : un nom hors liste refusé ; un dossier sans `corps.json`, ou sans `service.py`, refusé, rien d'écrit ; un
     dossier gardé, lu, puis oublié par son nom ; un fichier illisible vaut aucun choix ; le dossier gardé, présent ou
     absent, lu par une fonction qui prend le chemin du fichier ; `checked_dir` rend le chemin donné, sans `\\?\` ;
     `running` rend le dossier ; le garde pris refuse un second, et se rend à sa fin, même par une erreur.
   - Échec attendu sur `main` : les tests ne compilent pas, `folders.rs` et `one_box.rs` n'ont que leurs tests.
   - Barrières : Rust ; la surface publique.
   - Exclu : la page (tâches 8 et 9) ; reprendre les dossiers enregistrés par la page, qui ne suivent pas (le piège de
     l'issue).

5. - [x] **La sonde bornée : Rust** (`testeur`, puis `dev-luxuria`). Choix 5 (a), quel que soit le choix 4. Après la 4.
   - Fichiers : `src-tauri/src/programs.rs`, `src-tauri/src/lib.rs`.
   - Le contrat, que la page suit (tâche 10) : `program_state(name, url)` et `program_start(name, args, url)`.
   - `program_state` et `program_start` (`programs.rs:242-266`) prennent l'adresse du champ et la passent par
     `loopback::addr` (tâche 3). Refusée : « Adresse refusée : … (127.0.0.1, localhost ou [::1] seulement). », rien
     n'est sondé ni lancé. `listening` (`:93-97`) ne reçoit plus que `hôte:port` de la boucle locale.
   - Tests : `state` et `start` avec `http://192.0.2.1:8080` et `http://example.com:80`, refusés sans sonde ; les tests
     de `:344-449` passent avec une adresse (`http://127.0.0.1:9`, et `http://` devant `local_addr`).
   - Échec attendu sur `main` : `state` reçoit `http://192.0.2.1:8080` comme `hôte:port`, ne le résout pas, et rend
     `absent` au lieu d'un refus.
   - Barrières : Rust ; la surface publique.
   - Exclu : la page (tâche 10) ; les arguments (tâche 6).

6. - [x] **Les arguments confirmés : Rust** (`testeur`, puis `dev-luxuria`). Choix 4 (b). Après la 5.
   - Fichiers : `src-tauri/src/programs.rs`, `src-tauri/src/lib.rs`.
   - Le contrat, que la page suit (tâche 11) : `program_args(name, args)`, qui rend `true` (confirmés) ou `false`
     (refusés à la boîte) ; `program_arguments()`, les arguments confirmés par nom ; `program_start(name, url)`.
   - `program_args`, sans boîte : refusé si aucun exe n'est choisi pour ce nom (« Choisis d'abord son programme. ») ;
     `true` si les arguments sont ceux déjà confirmés ; refusé si une boîte est ouverte (le garde de la tâche 4).
   - Sinon `checked_args` (`voice.rs:35-46`), puis une boîte de message du système, modale
     (`MessageDialogBuilder::parent`, dialog `src/lib.rs:305`), titrée « Les arguments de <programme> » : l'exe en
     tête, puis chaque argument sur sa ligne, numéroté et entre « » sans espace ajoutée, ou « Aucun argument. ». Trois
     boutons, `YesNoCancelCustom("Annuler", "Confirmer", "Fermer")` (dialog
     `src/models.rs:66`) : le premier, celui d'Entrée, refuse ; Échap rend le troisième, qui refuse. Lue par
     `blocking_show_with_result` (`:382`), confirmée sur `Custom("Confirmer")` seulement ; jamais `blocking_show`, vrai
     sur le premier bouton. `#[tauri::command(async)]`, comme `program_pick` : la boîte ne tourne pas sur le fil de la
     fenêtre. Si la tâche 15 voit un autre ordre ou un autre bouton d'Entrée, le `CLAUDE.md` le dit.
   - Confirmés : gardés dans `arguments.json`, à côté de `programmes.json`. Une clé absente : jamais confirmés ; une
     liste vide : confirmée vide. Un autre exe choisi pour ce nom fait tomber sa confirmation ; le même exe rechoisi la
     garde (décidé pendant la tâche, côté prudent). `checked_args` refuse un caractère de contrôle ou de format bidi
     ou invisible dans un argument, et un fichier de configuration se lit puis s'écrit sous un seul verrou : la boîte
     doit montrer exactement ce qui part (vu pendant la tâche ; vaut aussi pour le service voix, dont le refus nomme le
     champ).
   - `program_start` ne prend plus `args` : il lance l'exe gardé avec les arguments confirmés ; jamais confirmés :
     « Confirme d'abord ses arguments. », et rien ne part. « Déjà lancé avec ces arguments » (`:132`) compare aux
     confirmés.
   - `program_forget` (`:237-240`) oublie aussi les arguments.
   - Tests : des arguments gardés, lus, oubliés par nom, avec l'exe ; jamais confirmés contre confirmés vides ; sans
     arguments confirmés, rien ne part ; sans exe, des arguments égaux, ou le garde pris : la boîte passée en paramètre
     n'est pas appelée ; seul `Custom("Confirmer")` confirme, `Custom("Annuler")` et `Custom("Fermer")` non.
   - Échec attendu sur `main` : les tests ne compilent pas, `program_args` n'existe pas.
   - Barrières : Rust ; la surface publique.
   - Exclu : la page (tâche 11) ; borner les arguments eux-mêmes (choix 4 (c)).

7. - [x] **Le filtre du réseau : Rust** (`testeur`, puis `dev-luxuria`). Choix 1 (c) et 2 (d). _Après la 4, en
         parallèle de la 5 et de la 6._
   - Fichiers : `src-tauri/src/net_guard.rs`, nouveau ; `src-tauri/src/lib.rs` (`:22`, et les commandes `:31-44`) ;
     les tests de `src-tauri/src/net_scope.rs`.
   - Le contrat, que la page suit (tâche 12) : `net_hosts()`, les origines confirmées, un tableau JSON de chaînes
     écrites par `ascii_serialization()` ; `net_host_confirm(url)`, qui rend `true` ou `false` ;
     `net_host_forget(origin)`. Un refus arrive à la page comme une chaîne : un `fetch` refusé rend son message.
   - `NetGuard` garde le plugin, `Box<dyn Plugin<R>>` fait de `tauri_plugin_http::init()`, et lui passe les dix
     méthodes du trait : `name`, `initialize`, `initialization_script`, `initialization_script_2`, `window_created`,
     `webview_created`, `on_navigation`, `on_page_load`, `on_event`, `extend_api`. `name()` rend `http` : l'ACL
     (`http:default`), la route `plugin:http|…` et la configuration `plugins.http` restent. `lib.rs:22` l'enregistre à
     la place du plugin.
   - `extend_api` : si `invoke.message.command()` vaut `fetch`, la vérification d'abord ; sinon, le plugin.
   - Les règles de `fetch`, lues dans `payload()` : du JSON (`InvokeBody::Json`, tauri `src/ipc/mod.rs:59-63`), sinon
     refusé ; `clientConfig.proxy` absent ou `null` ; `clientConfig.maxRedirections` égal à 0 ; `clientConfig.url` lue
     par `tauri::Url::parse`, en `http` ou `https`, son hôte `127.0.0.1`, `localhost` ou `::1` (`Url::host()`), ou son
     origine (`Url::origin()`, écrite par `ascii_serialization()`) dans `hotes.json`. Tout le reste est refusé :
     `invoke.resolver.reject(<message>)`, `extend_api` rend `true`, rien n'est créé.
   - Pourquoi `tauri::Url` et pas la règle de la tâche 3 : ici, le plugin et reqwest relisent l'adresse avec le même
     analyseur ; la règle écrite à la main sert là où un autre, httpx, la relit.
   - Les messages : « Proxy refusé. », « Redirections refusées. », « Adresse non confirmée pour la fenêtre :
     <origine>. » Le message ne dit pas où confirmer : Rust ne sait pas sur quel écran il s'affiche, et l'avis de la
     page, à côté du bouton, le dit (relecture de la tâche 12).
   - `hotes.json`, au dossier de configuration : relu à chaque `fetch`, comme `programmes.json` (`programs.rs:253`) ;
     écrit sur le modèle de `save_path` (`:78-90`) ; illisible, il vaut aucun hôte.
   - `net_host_confirm(url)` : une origine de la boucle locale, ou déjà confirmée, rend `true` sans boîte. Sinon le
     garde de la tâche 4, puis une boîte modale titrée « Une adresse hors de ce poste », qui dit « La fenêtre pourra
     joindre <origine>. », avec les trois boutons et la lecture de la tâche 6. Confirmée : gardée.
   - `default.json` ne change pas : sa portée admet tout hôte, le filtre est plus étroit qu'elle.
   - Tests, par l'appli de test de la tâche 1 avec `NetGuard`, dans ses dossiers temporaires :
     - `name()` vaut `http` ; le test de redirection de la tâche 2 passe encore, à travers l'enveloppe ;
     - refusés : un `proxy` ; `maxRedirections` absent, ou à 1 ; `http://example.com/` ;
       `http://127.0.0.1@example.com/` ; `data:text/plain,x` ; un corps qui n'est pas du JSON ;
     - admis : les adresses de la boucle locale de la tâche 1, qui rendent un numéro ;
     - `https://example.com/` admis une fois `https://example.com` écrit dans `hotes.json`, `https://example.com:8443/`
       refusé ; oublié, refusé au `fetch` suivant ;
     - `fetch_cancel` sur un numéro inconnu : l'erreur du plugin, pas celle de l'enveloppe ;
     - `net_host_confirm` sur la boucle locale ou un hôte confirmé : la boîte passée en paramètre n'est pas appelée.
   - Échec attendu sur `main` : les tests ne compilent pas, `net_guard` n'existe pas.
   - Barrières : Rust ; la surface publique.
   - Exclu : la page (tâche 12) ; `default.json` ; le flux du corps, qui reste celui du plugin.

16. - [x] **Les permissions du cœur, nommées** (`testeur`, puis `dev-luxuria`). Ajoutée le 17/11, choix A de CrOliX.
    Après la 7.
    - Fichiers : `src-tauri/capabilities/default.json` ; un test sur l'appli de test, au modèle de `net_guard.rs`.
    - `core:default` donne à la page `core:image:allow-from-path` (Tauri lit tout PNG ou ICO qu'elle nomme, sans
      borne, chemins UNC compris) et `core:tray:allow-new` (une icône de la barre depuis un chemin), dont elle ne se
      sert pas, ni de `core:menu:default` et `core:path:default`, ouverts aussi (vu par les tests). Il part. À sa
      place, ce dont la page se sert : `core:event:allow-listen` seul (`listen`, `tray.svelte.ts`, et `onMoved`,
      `onCloseRequested`, `window.svelte.ts` ; elle n'appelle ni `unlisten` ni `emit`) ; ses `core:window:allow-*`
      sont déjà nommés. Rien d'autre sans un appel de la page qui le demande (`@tauri-apps/api`, relu par grep).
      `core:window:allow-internal-toggle-maximize` part avec : un double-clic sur la zone de glissement n'agrandit plus
      la fenêtre ; la page a son plein écran.
    - Tests, sur l'appli de test avec `default.json` lu tel quel :
      - refusés : `plugin:image|from_path`, `plugin:tray|new`, `plugin:menu|new`, `plugin:path|resolve_directory`,
        `plugin:webview|create_webview_window` ;
      - admis : `plugin:event|listen` et chaque commande de fenêtre que la page appelle.
    - Échec attendu sur `main` : `from_path` et `tray|new` sont admis.
    - Barrières : Rust ; la page ; la surface publique.
    - Exclu : les permissions des plugins (`http`, `global-shortcut`, `autostart`), déjà nommées ou bornées par la 7.

### Piste page

8. - [x] **Le dossier du corps : la page, et son avis** (`testeur`, puis `dev-luxuria`). Critère 2. _Après la 1, en
         parallèle de la piste Rust_ : le contrat est celui de la tâche 4.
   - Fichiers : `src/desktop/dossiers.ts`, nouveau ; `src/desktop/corps.svelte.ts` ; `src/desktop/DossierCorps.svelte` ;
     `src/session.svelte.ts` ; `src/settings.ts` ; `src/App.svelte` s'il le faut. Leurs tests :
     `src/desktop/corps.test.ts`, `src/desktop/corps.svelte.test.ts`, `src/desktop/keys.svelte.test.ts`,
     `src/desktop/reglages.test.ts` (le corps), `src/settings.test.ts`.
   - `dossiers.ts` sur le modèle de `readProgramPaths`, `pickProgram` et `forgetProgram` (`voix.ts:268-291`), l'état
     dans `session.folders`, à côté de `programPaths` (`session.svelte.ts:120`).
   - `loadBody` (`corps.svelte.ts:70-102`) appelle `body_config` et `body_image` sans dossier ; le refus de Rust donne
     le souffle et dit pourquoi, comme aujourd'hui. Le corps se relit à l'ouverture de la fenêtre (`App.svelte:20`),
     après un choix et après « Oublier » ; il ne suit plus un champ (`corps.svelte.ts:119-127`).
   - L'écran : « Dossier du corps » (`DossierCorps.svelte:13-27`) prend la forme de « Son programme »
     (`ServiceVoix.svelte:132-155`) : le chemin en texte, « Choisir… », « Oublier ». « Relire » reste.
   - **L'ancien dossier.** `body.folder` quitte `DEFAULTS` et `body.formerFolder: ''` y entre, sans quoi `merged` le
     perd (`settings.ts:135-145`) ; `readSettings` y recopie un `folder` enregistré. Il ne part jamais vers Rust. Tant
     que Rust n'a pas de dossier du corps et qu'un ancien existe, la ligne dit : « Le dossier se choisit maintenant dans
     la boîte de dialogue du système. Choisis de nouveau celui-ci : <ancien>. », le chemin en texte sélectionnable, et
     « Copier » (`navigator.clipboard.writeText`), pour le coller dans la boîte. Le premier choix réussi le vide.
   - Tests :
     - aucune commande n'est appelée avec `folder` ;
     - « Choisir… » appelle `folder_pick` avec `corps` ; un refus s'affiche ; « Oublier » appelle `folder_forget` ;
     - un ancien dossier donne l'avis, n'est jamais envoyé, se copie, et se vide au premier choix ;
     - `readSettings` lit l'ancien `folder` sous `formerFolder`, et le garde au chargement suivant ;
     - les tests d'aujourd'hui qui posent un `folder` du corps (`corps.svelte.test.ts:25`, `:35`,
       `keys.svelte.test.ts:101`, `reglages.test.ts`) changent de forme, pas de sens.
   - Échec attendu sur `main` : `body_config` reçoit `folder` (`corps.test.ts:7-11`), et rien n'appelle `folder_pick`.
   - Barrières : la page ; la surface publique.
   - Exclu : le côté Rust (tâche 4) ; le service et la scène (tâche 9) ; la doc (tâche 13).

9. - [x] **Le dossier du service : la page, et l'avis sur la scène** (`testeur`, puis `dev-luxuria`). Critère 2. Après
         la 8.
   - Fichiers : `src/desktop/voix.ts` ; `src/desktop/ServiceVoix.svelte` ; `src/Scene.svelte` ;
     `src/session.svelte.ts` ; `src/settings.ts`. Leurs tests : `src/desktop/voix.test.ts`,
     `src/desktop/reglages.test.ts`, `src/Scene.test.ts`, `src/settings.test.ts`.
   - `startVoice` et `restartVoice` appellent `voice_start` et `voice_restart` avec `{ args }` seul (`voix.ts:152`,
     `:225`).
   - `runningArgs` (`voix.ts:68-71`) lit `{ folder, args }` de `voice_running` ; `changes` (`:194-201`) dit `restart`
     quand le dossier diffère de `session.folders.voix`, comme pour les arguments.
   - « Dossier du service » (`ServiceVoix.svelte:253-260`) prend la forme de « Son programme », comme à la tâche 8.
   - `voice.service.folder` devient `voice.service.formerFolder`, comme à la tâche 8 ; `fromArgs` (`settings.ts:171`)
     le reporte sous ce nom. Sa ligne dit le même avis, avec « Copier ».
   - `missing` (`voix.ts:29-35`) lit `session.folders.voix` ; avec un ancien dossier, il dit : « Le dossier du service
     se choisit de nouveau, dans les réglages avancés de la voix : <ancien>. » Ce texte va dans `voiceSaid` au démarrage
     (`voix.ts:148-149`).
   - La scène (`Scene.svelte:121-139`) : tant qu'un ancien dossier, du corps ou du service, attend, une ligne dit « Les
     dossiers se choisissent de nouveau, dans les réglages. », avec un bouton qui les ouvre, comme « Régler la voix »
     (`:134`). Elle part au dernier choix.
   - Tests : `voice_start` et `voice_restart` ne reçoivent jamais `dir` ; `changes` voit un dossier changé ; `missing`
     avec un ancien dossier donne l'avis ; la scène montre sa ligne tant qu'un ancien dossier attend, plus après ;
     `fromArgs` reporte `formerFolder` ; les tests d'aujourd'hui (`voix.test.ts:31`, `:150`, `reglages.test.ts:163-217`)
     changent de forme, pas de sens.
   - Échec attendu sur `main` : `voice_start` reçoit `dir` (`voix.test.ts:150`).
   - Repris des relectures de la tâche 8 : la ligne « Dossier du service » suit `DossierCorps.svelte`, un refus à côté
     du chemin, jamais à sa place, un chemin long coupé (`overflow-wrap`, `ServiceVoix.svelte:137` déborde
     aujourd'hui), une garde « en cours » contre le double clic ; « un ancien dossier attend » passe par
     `formerWaiting` (`dossiers.ts`). De la relecture de la tâche 3 : `fromArgs` (`settings.ts:164`) borne le gain
     repris de 0 à 10, comme l'écran, sans quoi Rust refuse le lancement. Après un « Oublier » réussi, le focus va à
     « Choisir… », sur la ligne du service comme sur celle du corps.
   - Barrières : la page ; la surface publique.
   - Exclu : les programmes (tâches 10 et 11) ; la doc (tâche 13).

10. - [x] **La sonde : la page** (`testeur`, puis `dev-luxuria`). Choix 5 (a), quel que soit le choix 4. Après la 9.
    - Fichiers : `src/desktop/voix.ts`, `src/desktop/voix.test.ts`.
    - `addrOf` (`voix.ts:251-259`) part. `launchProgram` (`:319`) et `followPrograms` (`:372`) passent `url`, l'adresse
      du champ. Une adresse vide ou refusée : le message de Rust.
    - Dans `followPrograms`, une erreur de `program_state` arrête le suivi de ce programme avec son message, au lieu de
      « il démarre » (`:372`).
    - Tests : `program_start` et `program_state` reçoivent `url`, jamais `addr` ; un refus de `program_state` arrête le
      suivi et s'affiche.
    - Échec attendu sur `main` : `voix.test.ts:281-290` et `:412` attendent `addr`.
    - Barrières : la page ; la surface publique.
    - Exclu : les arguments (tâche 11) ; le côté Rust (tâche 5).

11. - [x] **Les arguments confirmés : la page** (`testeur`, puis `dev-luxuria`). Choix 4 (b). Après la 10.
    - Fichiers : `src/desktop/voix.ts`, `src/desktop/ServiceVoix.svelte`, `src/session.svelte.ts`,
      `src/desktop/voix.test.ts`, `src/desktop/reglages.test.ts`.
    - `readProgramPaths` (`:269-272`) lit aussi `program_arguments`, dans `session.programArgs` ; `forgetProgram`
      (`:284-291`) le relit après l'oubli.
    - « Ses arguments » (`ServiceVoix.svelte:157-167`) reste le brouillon, tapé à l'écran et gardé dans les réglages.
      Dessous : « Confirmés : … » ou « Pas encore confirmés », et « Confirmer… », actif quand le brouillon diffère, qui
      appelle `program_args`. Un refus s'affiche sur la ligne.
    - `launchProgram` appelle `program_start` avec `{ name, url }` seul.
    - Au démarrage (`startPrograms`, `voix.ts:338-344`), un programme aux arguments jamais confirmés ne part pas, et
      aucune boîte ne s'ouvre seule (le piège de la boîte en plein tour). L'écran dit : « Ses arguments sont à
      confirmer, dans les réglages avancés de la voix. » La scène le dit aussi, comme les dossiers à rechoisir, tant
      qu'un programme lancé avec l'appli attend ses arguments (ajouté le 17/11 par CrOliX : tout poste mis à jour le
      rencontre).
    - Les arguments enregistrés aujourd'hui dans la page deviennent le premier brouillon : rien à migrer, une
      confirmation à faire.
    - Tests : `program_start` ne reçoit jamais `args` ; « Confirmer… » appelle `program_args` avec le brouillon ; le
      démarrage ne lance pas un programme non confirmé et n'appelle pas `program_args` ; un brouillon égal aux
      confirmés n'offre pas « Confirmer… » ; « Oublier » relit `session.programArgs`.
    - Échec attendu sur `main` : `voix.test.ts:281-290` attend `args`.
    - Repris des relectures des tâches 8 et 12 : une garde « en cours » sur « Choisir… » d'un programme
      (`pickProgram`), « Confirmer… » et « Oublier », contre le double clic ; le focus va au bouton qui remplace celui
      qu'on a cliqué.
    - Barrières : la page ; la surface publique.
    - Exclu : le côté Rust (tâche 6) ; la doc (tâche 13).

12. - [x] **Le réseau : la page** (`testeur`, puis `dev-luxuria`). Choix 1 (c) et 2 (d). _Après la 1, en parallèle des
          tâches 8 à 11_ : le contrat est celui de la tâche 7.
    - Fichiers : `src/desktop/net.ts` ; `src/desktop/hotes.ts`, nouveau ; `src/Reglages.svelte` ; `src/Arrivee.svelte` ;
      `src/session.svelte.ts`. Leurs tests : `src/desktop/net.test.ts`, `src/desktop/reglages.test.ts`,
      `src/Arrivee.test.ts`.
    - `routes` (`net.ts:18-33`) passe `{ ...init, maxRedirections: 0 }` à `http`, aux deux appels (`:22`, `:26`). La
      voix, par le `fetch` de la page, ne change pas.
    - `hotes.ts` sur le modèle de `voix.ts:268-291` : `readHosts`, `confirmHost`, `forgetHost` ; l'état dans
      `session.hosts`.
    - Dans la fenêtre seulement (`inWindow`), sous l'adresse du serveur (`Reglages.svelte:332`, `Arrivee.svelte:123`) et
      celle du modèle (`Reglages.svelte:345-347`, `Arrivee.svelte:93-95`) : hors de la boucle locale (`isLocalHost`,
      `src/local.ts:55`) et non confirmée, « Cette adresse est hors de ce poste : la fenêtre ne la joint qu'une fois
      confirmée. », et « Confirmer… », qui appelle `net_host_confirm` avec l'adresse du champ. Confirmée : « Confirmée
      pour la fenêtre. », et « Oublier ». Si la page et Rust divergent, Rust refuse et le message le dit.
    - Jamais `net_host_confirm` au moment d'une requête : une requête refusée montre le message de Rust là où l'erreur
      s'affiche aujourd'hui.
    - Ajouté à la relecture : la liste des origines confirmées, chacune avec son « Oublier », dans le thème « Fenêtre »
      des réglages. Sans elle, une adresse confirmée puis remplacée dans le champ resterait confirmée sans qu'on puisse
      l'oublier. Une adresse du modèle non confirmée ouvre le bloc « Réglages avancés » : il ne cache jamais ce qui
      bloque.
    - Tests : `maxRedirections: 0` sur les deux chemins du serveur ; la voix inchangée ; « Confirmer… » appelle
      `net_host_confirm` avec l'adresse ; une adresse de la boucle locale n'offre rien ; aucun chemin de requête
      n'appelle `net_host_confirm` ; dans un onglet, rien ne s'affiche.
    - Échec attendu sur `main` : `routes` passe `init` tel quel.
    - Barrières : la page ; la surface publique.
    - Exclu : le côté Rust (tâche 7) ; l'onglet du navigateur.

### La fin

13. - [ ] **Le `CLAUDE.md` et la doc** (`dev-luxuria`). Critère 5 ; lun-luxuria#79, deux points. Après les deux
          pistes.
    - `CLAUDE.md:32-42` dit ce que fait le code :
      - Rust lit le corps et lance le service dans les dossiers que la personne a choisis dans la boîte de dialogue du
        système ; il borne les arguments du service ; c'est lui qui sonde l'adresse d'un programme, sur la boucle
        locale seulement, que le champ lui donne ; il lance un programme avec les arguments que la personne a
        confirmés ; il vérifie chaque `fetch` de la fenêtre (`net_guard.rs`) : sans proxy ni redirection, vers la
        boucle locale ou un hôte confirmé ;
      - les défenses, dont « aucune permission `dialog:` pour la page : les boîtes s'ouvrent côté Rust, une à la fois,
        et Entrée refuse » ;
      - les sorties qui restent : la page lance encore le service dans le dossier choisi et les programmes confirmés ;
        le fichier de voix, un `.onnx` du poste ; la fenêtre joint les hôtes confirmés ; la portée de `default.json`
        admet tout hôte, derrière l'enveloppe. Un lecteur réseau, ou un lien vers un partage, sous une lettre de
        lecteur, passe encore pour le fichier de voix (relecture de la tâche 3). Une origine confirmée est un nom : son
        DNS peut pointer vers le réseau local (relecture de la tâche 7). À chaque mise à jour de tauri, vérifier que le
        trait `Plugin` a toujours dix méthodes, toutes transmises par `NetGuard`.
    - 100 lignes au plus ([`structure-projet.md`](../../standards/structure-projet.md)).
    - `docs/README.md:61-80` : les dossiers choisis dans la boîte, gardés dans `dossiers.json`, et l'avis aux dossiers
      enregistrés ; les arguments du service et leurs règles ; les arguments des programmes confirmés,
      `arguments.json` ; la sonde ; les hôtes confirmés, `hotes.json`. `docs/README.md:6` : kokoro est refusé par
      l'appli, et pourquoi. `README.md:48` : `--origin` vaut pour le service lancé à la main, l'appli le refuse.
    - La doc arrive dans la PR du code, dont le squash fait un seul commit.
    - Barrières : `npm run format:check` ; la surface publique.
    - Exclu : l'interface du serveur compatible (lun-luxuria#79, le troisième point).

14. - [x] **Ce qui est renvoyé** (la session). Critère 4. Dès la validation : pour chaque choix que CrOliX renvoie au
          lieu de le faire, une issue lun-luxuria, `niveau:critique`, qui reprend son option telle qu'écrite ici, ses tâches
          et leurs pièges. Son lien entre dans le `CLAUDE.md` (tâche 13) et dans la PR. Rien de renvoyé : la case se coche
          avec cette mention.

    Fait le 16/11 : rien de renvoyé, CrOliX a validé les cinq choix tels que recommandés.

15. - [ ] **La preuve dans l'exe** (CrOliX). Critère 6. En dernier.
    - L'exe : `npm run tauri build -- --no-bundle`, lancé depuis l'Explorateur. Lancé par un agent, ses données iraient
      ailleurs. Le laptop suffit si `uv` et un dossier du service y sont ; sinon le desktop, à la session du § 4 de la
      [feuille de route](2026-11-07-feuille-de-route-mvp.md).
    - Au premier lancement après la mise à jour : la scène dit que les dossiers se choisissent de nouveau ; les deux
      lignes de dossier disent l'avis, avec l'ancien chemin ; « Copier » le met dans le presse-papiers.
    - Le corps : « Choisir… » ; la boîte est modale, un second clic n'en ouvre pas une autre ; un dossier sans
      `corps.json` est refusé et l'écran le dit ; le bon montre les images ; « Oublier » rend le souffle.
    - Le service : un dossier sans `service.py` est refusé ; le bon s'affiche sans `\\?\`, et « Lancer ou vérifier » le
      lance. Un autre dossier choisi pendant qu'il tourne : « Relancer » est offert. Une ligne `--origin` dans « Autres
      arguments » : la relance est refusée, celui d'avant tourne encore. Une adresse de whisper-server hors de la
      boucle locale : refusée, le message nomme le champ.
    - Les programmes : « Pas encore confirmés » ; « Confirmer… » ouvre la boîte avec les arguments ; **Entrée** refuse,
      **Échap** refuse ; « Confirmer », puis un redémarrage de l'appli : le programme part, sans boîte.
    - Le réseau : le serveur et le modèle de ce poste répondent comme avant. Une adresse https hors du poste, celle d'un
      modèle en ligne par exemple : refusée tant qu'elle n'est pas confirmée ; « Confirmer… », Entrée refuse ;
      « Confirmer », puis une réponse ; « Oublier », puis un refus à la requête suivante.
    - Sans `core:default` (tâche 16) : la fenêtre se déplace, passe en plein écran et en revient, l'icône de la barre
      suit l'état, fermer la fenêtre la range et la position revient au lancement suivant ; un double-clic sur la
      scène n'agrandit plus la fenêtre.
    - CrOliX dit ce qu'il a vu dans la PR ; elle passe « prête » ensuite.

À la fusion : les trois points de lun-luxuria#79 cochés ; le graphe de lun-luxuria mis à jour ; les worktrees retirés.

## Risques

- **Les dossiers se choisissent de nouveau.** Tant que ce n'est pas fait, le service ne part pas avec l'appli et le
  corps est le souffle. La scène et chaque ligne le disent.
- **Les arguments des programmes se confirment de nouveau.** Au premier lancement après la mise à jour, whisper-server
  et RVC ne partent pas seuls.
- **Une ligne libre refusée refuse le lancement entier**, `--port` ou une abréviation par exemple. Le message dit
  laquelle.
- **La règle d'adresse refuse un chemin après l'hôte** : le service ajoute le sien (`service.py:60`, `:116`). Une
  adresse écrite avec un chemin, qui marchait par hasard, est refusée.
- **L'enveloppe tient à une interface dite instable** (`Invoke`). `Cargo.lock` fige tauri ; une mise à jour repasse
  les tests de la tâche 7, qui cassent si le chemin d'un appel change.
- **Une erreur de l'enveloppe coupe tout le réseau de la fenêtre.** Ses tests couvrent l'admis autant que le refusé.
- **Une adresse hors du poste demande une confirmation**, une fois, au réglage.

## Ce que le plan ne vérifie pas

- **`[::1]` dans une entrée de portée** : deux écritures, essayées à la tâche 1 avant tout.
- **L'ordre des boutons et celui d'Entrée à l'écran** : lus dans rfd (`nDefaultButton: 0`), constatés à la tâche 15.
- **Le paquet JS `@tauri-apps/plugin-http`** : installé dans aucun clone lu. Qu'il passe `maxRedirections: 0` tel quel
  dans `clientConfig` se voit dans l'exe. S'il ne le passait pas, l'enveloppe refuserait tout : l'échec est fermé, et
  visible au premier message.
- **`navigator.clipboard` dans la fenêtre** : pas essayé. Le chemin reste en texte sélectionnable.
- **Que `localhost` se résout toujours sur la boucle locale sous Windows** : pas lu.
- **kokoro sous `uv run`** : la dépendance manque au script, lu, pas essayé.
- **Les options de whisper-server et de RVC**, et ce que faster-whisper fait d'un dépôt ou d'un chemin à la place d'un
  nom de modèle.
- **Un chemin réseau qui ouvre une connexion SMB** : connu de Windows, pas essayé.
- **Une jonction du disque vers un partage** passe la règle du fichier de voix.
- **Les boîtes de dialogue** : seulement dans l'exe, par CrOliX.

## Ce qui reste ouvert après ce chantier

Si CrOliX suit les recommandations, et c'est ce que le `CLAUDE.md` dira :

- une page compromise lance encore le service, dans le dossier choisi et dans ses règles, et les programmes de la
  personne avec ses arguments confirmés ;
- elle fait encore lire au service tout `.onnx` du poste comme voix, et lit les images du dossier du corps choisi ;
- elle joint les hôtes que la personne a confirmés, par toute méthode et tout chemin.

## Ce que la contestation a changé

Le contradicteur a rendu « plan à amender » le 16/11 ; le cœur (les tâches des dossiers et des arguments du service)
tenait. Chaque objection a été relue dans les sources avant d'être reprise.

1. **Objection : un plugin peut filtrer les arguments d'un autre.** Le plan disait n'avoir trouvé aucun moyen de filtrer
   une commande de plugin avant elle. Une enveloppe de plugin-http le fait, sans remplacer le flux du corps.
   **Réponse : retenue.** Le plan se trompait : le trait est public, la route passe par `name()` puis `extend_api`, la
   commande et ses arguments s'y lisent (« Autres faits lus »). Aucune faille trouvée dans ce que j'ai lu ; la seule
   réserve, `Invoke` instable, est tenue par `Cargo.lock` et les tests. 2 (d) entre au choix 2 ; avec 1 (c), il devient
   la recommandation, dans ce chantier (tâches 7 et 12). L'ancienne issue de suite du réseau devient la tâche 14, ce
   qui est renvoyé. Le `Matcher` de hyper-util est lu : il n'exclut pas la boucle locale (sortie 2). Avec un proxy, la
   page aurait vu passer les cookies : le proxy est refusé, et les cookies retirés (tâche 2).
2. **Objection : la tâche 1 touchait des données réelles.** Le `.cookies` du poste n'est pas ouvert « sans l'écraser » :
   il est réécrit en entier.
   **Réponse : retenue.** Lu : réécrit à chaque `Set-Cookie` et à la sortie. L'appli de test vit dans un dossier
   temporaire (tâche 1), et la fonction `cookies` du plugin part (tâche 2) : l'appli n'en envoie aucun.
3. **Objection : Entrée confirmerait la boîte des arguments.** rfd fait du premier bouton celui d'Entrée ; avec
   « Confirmer » en premier, Entrée confirme. Deux boîtes peuvent s'ouvrir ensemble.
   **Réponse : retenue.** Lu, et pire : avec deux boutons, Échap rend le texte du bouton d'annulation. Mettre
   « Annuler » en premier ferait d'Échap une confirmation. D'où trois boutons, « Annuler » en premier, lus par leur
   texte, jamais par `blocking_show` (tâche 6). Une boîte à la fois, pour toutes (`one_box.rs`, tâche 4). Entrée et
   Échap se constatent dans l'exe (tâche 15).
4. **Objection : l'avis aux dossiers enregistrés ne se voit pas.** La scène dit seulement que la voix ne répond pas ;
   l'avis est caché dans les réglages avancés ; le corps passe au souffle sans rien dire ; `merged` perdrait la clé.
   **Réponse : retenue.** Lu (« Ce que l'écran dit aujourd'hui »). La tâche 9 met une ligne sur la scène et l'avis
   dans `missing` ; les tâches 8 et 9 ajoutent « Copier » et font entrer `formerFolder` dans `DEFAULTS`. La tâche 15
   regarde la scène.
5. **Objection : les arguments du service.** Rien d'utilisé ne casse ; kokoro est du code mort ; chaque refus doit
   dire son champ.
   **Réponse : retenue.** Vérifié : la page n'envoie que des drapeaux admis, `--origin` et `--port` ne servent qu'aux
   bancs (sortie 8). Perdu : un modèle de faster-whisper par chemin, que l'écran n'offre pas. kokoro est refusé avec
   son message, les règles à deux fichiers partent, `docs/README.md:6` le dit (tâche 13). Chaque message nomme son champ
   (tâche 3).
6. **Objection : le contrat a des trous, et le découpage mêle ce qui est requis et ce qui est un choix.**
   **Réponse : retenue.** Un refus de `program_state` arrête le suivi (tâche 10) ; « Oublier » relit les arguments
   (tâche 11) ; `program_args` sans exe, avec des arguments égaux ou une boîte ouverte, n'ouvre rien (tâche 6) ;
   `voice_running` rend le dossier (tâches 4 et 9) ; `checked_dir` garde le chemin sans `\\?\` (tâche 4). La page des
   dossiers est coupée en deux (tâches 8 et 9). La sonde (tâches 5 et 10) est séparée de la confirmation (tâches 6 et 11) : si CrOliX ne prend pas 4 (b), deux tâches tombent, le plan reste.
7. **Objection : des points mineurs.** Le repli sur une copie de `parse_url_pattern` est inutile ; l'appli de test
   n'embarque pas deux fois la page ; `[::1]` brut est sans doute illisible ; la clé mal écrite et le `Matcher` sont
   vérifiables.
   **Réponse : retenue.** Le repli part : `mock_builder` sur `generate_context!()` est l'usage documenté. Le risque des
   deux embarquements était faux et part : sous `cargo test`, la page n'est pas embarquée. `[::1]` s'essaie en deux
   écritures (tâche 1). La clé mal écrite arrête le démarrage, et l'appli de test le voit (tâche 2) ; elle quitte la
   liste de ce que le plan ne vérifie pas, comme le `Matcher` et l'ordre du démarrage, tombé avec `hotes.json` relu à
   chaque `fetch`.
