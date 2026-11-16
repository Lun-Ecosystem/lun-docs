# L'IPC de la fenêtre : ce que la page peut encore faire faire à Rust. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** lun-luxuria#78 (`niveau:critique`) ; trois points de lun-luxuria#79, rattachés au tri du 16/11.
>
> **État : à challenger, puis à valider par CrOliX.** Cinq choix restent à trancher (« Les choix ouverts »). Les
> tâches suivent les recommandations marquées **[choix Claude]**, et chaque choix dit ce qui change si CrOliX en prend
> une autre.
>
> Écrit le 16/11 depuis lun-luxuria#78. Code relu sur `main` de lun-luxuria (`30e02c4`), par le graphe d'abord. Sources
> tierces lues dans le cache de Cargo, sans rien en lancer : tauri 2.12.5, tauri-plugin-http 2.8.3,
> tauri-plugin-dialog 2.8.4, et reqwest 0.12.28 en partie.

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

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-luxuria`, `feat/ipc-de-la-fenetre` | lun-luxuria#78 ; trois points de lun-luxuria#79 | `critique` |
| `lun-docs`, `docs/ipc-de-la-fenetre` | lun-luxuria#78, pour ce plan | `trivial` |

*Ask* ([`git.md`](../../standards/git.md), lignes 40 à 42) : la fenêtre Tauri ne se prouve que dans l'exe, par CrOliX.
La PR de Lun'Luxuria reste en brouillon jusque-là.

**Hors périmètre**, celui de l'issue : la CSP ; le contenu de `service.py` au-delà de ses arguments ; Lun'Anima. En
plus : le troisième point de lun-luxuria#79, l'interface du serveur compatible dans `docs/README.md`, qui reste à #79 ;
et, si CrOliX suit le choix 2, la commande réseau à règles fixes, qui aura son chantier (tâche 9).

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
   attache le proxy que la page passe (`:323-325`, `attach_proxy` `:157-179`). Un proxy explicite de reqwest n'exclut
   pas la boucle locale de lui-même (reqwest `src/proxy.rs:265-274`, `no_proxy: None`) ; la décision finale passe par
   le `Matcher` de hyper-util (`:528-538`), que je n'ai pas lu.
3. **Les redirections** : `scopeRedirects` vaut `false` par défaut (plugin `src/config.rs:10-26`) ; sans lui, la
   politique suit dix redirections sans regarder la portée (`commands.rs:191-200`, `:320-321`). `tauri.conf.json` n'a
   pas de section `plugins`.
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

- **Le module `scope` du plugin est privé** (plugin `src/lib.rs:71-76`) : un test de Lun'Luxuria ne peut pas appeler sa
  lecture des motifs. Il doit passer par une appli de test et l'IPC (tâche 1).
- **`danger` est refusé** sans la fonction `dangerous-settings` (`commands.rs:296-307`), qui n'est pas activée (plugin
  `Cargo.toml:66-73`) : la page ne peut pas désactiver la vérification TLS. Les fonctions par défaut du plugin
  comprennent `system-proxy` et `cookies`.
- **`add_capability`** existe à l'exécution (tauri `src/lib.rs:840-848`), par la fonction `dynamic-acl`, active par
  défaut (tauri `Cargo.toml:84-91`). Il résout la capacité avec un `.unwrap()` (`src/ipc/authority.rs:174-180`) et
  n'ajoute que : aucune fonction ne retire (`:183-216`). À chaque appel, les portées de toutes les capacités se lisent
  ensemble, et une seule entrée illisible fait échouer l'appel (`CommandScope::resolve`, `:526-551`, le `?` de `:540`).
- **L'appli de test de tauri** : `mock_builder` (`src/test/mod.rs:166`) et `get_ipc_response` (`:297`), derrière la
  fonction `test`. `mock_context` a une ACL vide (`:143`) : une capacité `http:` n'y résout pas.

### Les dossiers et les arguments (sorties 6 à 9)

6. **Le dossier du corps** : un champ de texte (`src/desktop/DossierCorps.svelte:17-25`), gardé dans les réglages de la
   page (`src/settings.ts:46-47`), relu à chaque changement (`src/desktop/corps.svelte.ts:119-127`) et passé à chaque
   lecture (`:80`, `:88`, `:96`). Rust le prend tel quel (`body.rs:75-83`).
7. **Le dossier du service** : un champ (`src/desktop/ServiceVoix.svelte:253-260`, `settings.ts:63`), passé à
   `voice_start` et `voice_restart` (`voix.ts:152`, `:225`). Rust lance `uv run service.py` dans tout dossier qui
   contient un `service.py` (`voice.rs:27-33`, `:219-241`) : c'est du code, choisi par la page.
8. **Les arguments du service** : tirés des champs (`voix.ts:18-26`), puis les lignes libres, tapées à l'écran
   (`ServiceVoix.svelte:372-387`). Rust ne borne que leur nombre (32) et leur longueur (1 024) (`voice.rs:35-46`). Le
   service :
   - joint l'adresse de whisper-server (`voix/service.py:56-63`) et de RVC (`:116`), et les sonde (`:126-141`) ;
   - ouvre une page de plus à son CORS par `--origin` (`:324`, `:331-332`) ;
   - charge un fichier par `--tts piper:<chemin>` (`:79-82`) ou `--tts kokoro:<modèle>:<voix>` (`:89-94`), que les
     lignes libres peuvent porter (`voix.ts:31`, `docs/README.md:5-6`) ;
   - passe `faster:<nom>` à faster-whisper tel quel (`:47`).

   Le parseur est créé sans `allow_abbrev` (`:317`) : argparse accepte alors une abréviation, `--orig` vaut `--origin`.
   Une liste de refus ne suffit pas.
9. **Les arguments des programmes** : libres, un par ligne (`ServiceVoix.svelte:157-167`), bornés comme ceux du service
   (`programs.rs:124`), passés à `program_start(name, args, addr)` (`:243-257`). L'exe est celui de la personne ; ses
   options sont libres.

### Les points de lun-luxuria#79

- L'exemple de chemin de `voice.rs:284` et `:298` nomme un dossier d'un poste. Il devient inventé (tâche 3).
- `CLAUDE.md:36-41` dit « l'adresse que sonde un programme » : c'est Rust qui sonde (`programs.rs:93-97`). Et il ne cite
  pas l'absence de permission `dialog:`. Les deux entrent à la tâche 8.

## Les choix ouverts

Chacun avec ses options, leur coût, leur risque, et ma recommandation. CrOliX tranche par écrit.

### 1. La portée réseau

- **(a) Tout hôte, comme aujourd'hui.** Coût : rien. Risque : la sortie reste ouverte, et `CLAUDE.md` le dit.
- **(b) La boucle locale seule.** Coût : les six entrées que prouve la tâche 1, dans `default.json`. Risque : la fenêtre
  ne joint plus un serveur ni un modèle sur une autre machine. Le relié casse quand le serveur quitte le poste
  ([ADR 0012](../../adr/0012-prod-machine-dediee.md)), comme un modèle en ligne. L'onglet du navigateur le peut encore.
- **(c) La boucle locale, plus l'hôte réglé, confirmé par la personne** dans une boîte de message du système, au
  réglage de l'adresse, jamais à l'appel. Sans confirmation, aucun gain : une page compromise réglerait son propre
  hôte. Avec plugin-http, cela demande :
  - une capacité au modèle fixe, `http:default` et une seule entrée `<schéma>://<hôte>:<port>/*`, pour `main`, ajoutée
    par `add_capability` à la confirmation, puis au démarrage pour chaque hôte gardé (`hotes.json`, côté Rust) ;
  - contre le `.unwrap()` : le modèle ne varie que par l'hôte, et l'appli de test de la tâche 1 l'ajoute en CI ;
  - contre le motif illisible, qui coupe tout le réseau jusqu'au redémarrage : l'hôte se valide avant (des lettres,
    chiffres, `.` et `-`, ou une IPv4 ; un port), et la tâche 1 prouve la lecture du même modèle ;
  - un hôte retiré ne l'est qu'au prochain lancement : l'écran le dit ;
  - pas lu : si la page peut appeler le réseau avant que `setup` ait remis les hôtes gardés.

  Coût : deux tâches (Rust, page). Risque : ceux plus haut ; et, sans 2 (b), aucun gain contre une page compromise.

**[choix Claude]** : se décide avec le choix 2, plus bas.

### 2. Le proxy fourni par la page

- **(a) Laissé ouvert, dit dans `CLAUDE.md`.** Coût : rien. Conséquence : 1 (b) et 1 (c) ne protègent pas d'une page
  compromise.
- **(b) Une commande Rust à règles fixes à la place de plugin-http pour la page.** Ce qu'elle demande :
  - `net_fetch` et `net_cancel`, avec reqwest, déjà dans l'arbre (0.12.28, par plugin-http) : il devient une dépendance
    directe, sans `system-proxy` ni `cookies`, avec `.no_proxy()`, et aucune redirection suivie (`Policy::none()`), ou
    seulement vers la même origine ;
  - les règles dans Rust : la boucle locale, plus les hôtes confirmés de 1 (c), gardés et retirés côté Rust, sur le
    moment, sans `add_capability` ;
  - le corps en flux : le serveur et le modèle répondent par morceaux (`frames`, `src/brain.ts:57`, lu par
    `src/local.ts:224` et `src/core.ts:98`, `:134`). Le plugin lit le corps par une commande, morceau par morceau
    (`fetch_read_body`, `commands.rs:497`). La nôtre : un `Channel` de tauri, et dans la page une `Response` sur un
    `ReadableStream`, annulée par le `signal` ;
  - retirés : `tauri-plugin-http` (`src-tauri/Cargo.toml:24`, `lib.rs:22`), `http:default` (`default.json:8-24`),
    `@tauri-apps/plugin-http` (`net.ts:2`).

  Coût : élevé, trois tâches, de l'ordre de 250 lignes de Rust et 100 de page, tests compris. Risque : le premier mot
  passe par ce flux et se réentend sur le desktop (`npm run chaine` joue la page dans Chrome, pas la fenêtre) ; Rust
  grandit, contre « Côté Rust, le moins possible » (`CLAUDE.md:32`).
- **(c) plugin-http recopié et corrigé**, par `[patch.crates-io]`. Coût : chaque mise à jour du plugin, reportée à la
  main. Risque : la copie d'un tiers qui vieillit, dans un dépôt public. Écarté.

Je n'ai pas trouvé, dans ce que j'ai lu de tauri 2.12.5, de moyen de filtrer les arguments d'une commande de plugin
avant elle : seulement les permissions par commande et les portées (`src/ipc/authority.rs`).

**[choix Claude] pour 1 et 2** : 2 (b), avec la portée 1 (c) dedans, dans un chantier à part, renvoyé à une issue
(tâche 9). Ici : 1 (a), avec `scopeRedirects` et le test de la tâche 1. Seul 2 (b) ferme le bloc. 1 (b) casse le relié
hors du poste. 1 (c) seul coûte deux tâches et le piège de `add_capability`, pour aucun gain contre une page compromise.
2 (b) demande d'écouter le premier mot sur le desktop, ce que ce chantier n'a pas à faire.

*Si CrOliX prend 1 (c) avec 2 (a)* : deux tâches après la 7, « les hôtes confirmés, Rust » et « les hôtes, page »,
sur le modèle des tâches 5 et 7. *Si CrOliX prend 2 (b) ici* : trois tâches après la 7 (la commande, la page, le retrait
du plugin), et l'écoute du premier mot sur le desktop avant la PR.

### 3. Le chemin de piper

Aujourd'hui : un champ (`ServiceVoix.svelte:315-322`), passé en `--tts piper:<chemin>` (`voix.ts:22`). Un chemin
`\\hôte\partage\…` fait ouvrir par Windows une connexion SMB vers cet hôte (connu de Windows, pas essayé ici) : une
adresse hors de la boucle locale, que le critère 3 refuse.

- **(a) Choisi dans la boîte de dialogue du système**, gardé côté Rust comme les dossiers ; Rust écrit `--tts`, refusé
  dans les lignes libres. Coût : une commande et une ligne d'écran de plus, sur le modèle des tâches 4 et 6, et l'avis
  au chemin enregistré. Risque : kokoro, qui prend deux fichiers, ne se lance plus que hors de l'appli.
- **(b) Laissé à la page, borné par Rust** : un fichier de ce poste, par son chemin complet à lettre de lecteur, sans
  chemin réseau, existant, `.onnx`. De même pour les deux fichiers de kokoro. Coût : une fonction et ses tests, dans la
  tâche 3. Risque : la page fait encore charger tout `.onnx` du poste comme voix ; un lecteur réseau monté par la
  personne, sous une lettre, passe.
- **(c) Laissé tel quel.** Ne tient pas le critère 3.

**[choix Claude]** : (b). Le dossier du service fait tourner du code, d'où la boîte de dialogue ; le fichier de voix est
une donnée, la borne suffit. *Si CrOliX prend (a)* : une tâche Rust et une tâche page de plus, après la 4 et la 6.

### 4. Les arguments des programmes

Aujourd'hui libres (sortie 9). L'exe est celui de la personne, mais ses options peuvent changer ce qu'il fait : écouter
sur tout le réseau, servir un dossier, lire un fichier par un chemin réseau. Je n'ai lu ni les options de whisper-server
ni celles de RVC.

- **(a) Libres, dits dans `CLAUDE.md`.** Coût : rien.
- **(b) Confirmés par la personne** dans une boîte de message du système quand ils changent, gardés côté Rust avec
  l'exe ; `program_start` ne les prend plus. Coût : les tâches 5 et 7, moyen ; une confirmation par changement, rare.
  Risque : la boîte montre les arguments bruts, que la personne a tapés. Une page compromise qui en demande ouvre une
  boîte inattendue, que la personne refuse.
- **(c) Bornés par Rust** : aucun chemin réseau dans un argument, puis des règles par programme. Coût : faible pour le
  chemin réseau ; fragile pour le reste, les options d'un tiers changent sans nous.

**[choix Claude]** : (b), la suite de `program_pick` : ce que l'appli lance, exe et arguments, la personne l'a choisi.
*Si CrOliX prend (a)* : la tâche 5 garde `args` dans `program_start`, la 7 ne touche que la sonde. *(c)* : la tâche 5
refuse un argument qui commence par `\\` ou `//`, sans boîte.

### 5. La sonde de `program_state` et `program_start`

- **(a) L'adresse du champ, bornée par Rust** à la boucle locale par la règle de la tâche 3, qui en tire `hôte:port`.
  Coût : faible ; `addrOf` quitte la page. Risque : un programme sur une autre machine ne se suit plus ; l'appli ne le
  lance pas non plus.
- **(b) Le port seul, sondé sur `127.0.0.1`.** Coût : le plus faible. Risque : un programme qui n'écoute que sur
  `[::1]` se dit absent.
- **(c) Rust tire l'adresse des arguments confirmés.** Coût : lire les options de chaque programme. Fragile.

**[choix Claude]** : (a). Une règle, une fonction, pour le service et la sonde. *Si CrOliX prend (b)* : la tâche 5
prend un port, la 7 le tire du champ.

## Les tâches

**Pour chaque tâche.** Le `testeur` écrit les tests d'abord, les voit échouer, les commite ; puis `dev-luxuria` code,
dans le même worktree. Le `reviewer` relit chaque diff contre sa tâche. Le `livreur` coche ce plan et ouvre la PR en
brouillon. Chaque agent commence par le graphe ; aucun ne lit ni n'affiche un `.env`. Aucun son, aucun nom d'instance,
aucun chemin de poste dans le dépôt.

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

**L'ordre et le parallèle.** La 1 part seule. Ensuite, deux pistes, chacune dans son worktree créé depuis la branche du
chantier :

- **Rust**, dans l'ordre : 3, 4, 5. Elles partagent `voice.rs`, `programs.rs` et `lib.rs`.
- **Page**, dans l'ordre : 6, 7. Elles partagent `voix.ts` et ses tests. Le contrat des commandes est écrit ici : la
  page se code contre lui, l'appel à Rust simulé.
- **La 2** part quand on veut après la 1 : elle ne touche que `tauri.conf.json`.
- **La 8** après les deux pistes ; **la 9** dès la validation ; **la 10** en dernier.

### Le mécanisme

1. - [ ] **Le test du mécanisme, avant tout changement** (`testeur`). Critère 1.
   - Fichiers : `src-tauri/Cargo.toml` (en dev-dependencies, `tauri` avec la fonction `test`) ;
     `src-tauri/src/net_scope.rs`, nouveau, sous `#[cfg(test)]` ; `src-tauri/src/lib.rs`
     (`#[cfg(test)] mod net_scope;`).
   - L'appli de test : `tauri::test::mock_builder()`, avec `tauri_plugin_http::init()` seul, construite sur
     `tauri::generate_context!()` pour avoir les manifestes d'ACL et la configuration, `plugins` compris. Pas sur
     `mock_context` : son ACL est vide.
   - Une capacité d'essai, ajoutée par `app.add_capability`, pour une fenêtre `essai` seule : `http:default` et six
     entrées, `http://` et `https://` pour `127.0.0.1:*`, `localhost:*` et `[::1]:*`. La fenêtre `main` garde
     `default.json` ; `essai` ne voit que la capacité d'essai.
   - Les appels passent par l'IPC, comme la page : `get_ipc_response`, `plugin:http|fetch` puis
     `plugin:http|fetch_send`. La portée se vérifie au `fetch`, avant tout envoi : admis, il rend un numéro de
     ressource et n'envoie rien.
   - Admis : `http://127.0.0.1/`, `http://127.0.0.1:8080/v1`, `http://localhost/`, `http://localhost:11434/x`,
     `http://[::1]/`, `http://[::1]:8788/`, et les mêmes en https.
   - Refusés, par « url not allowed on the configured scope » (plugin `src/error.rs:38`) : `http://127.0.0.2/`,
     `http://127.0.0.1.example/`, `http://localhost.example/`, `http://example.com/`, `http://[::2]/`.
   - La redirection : un `TcpListener` sur `127.0.0.1:0` répond une fois `302` vers `http://192.0.2.1/`, une adresse
     de documentation. `fetch` vers lui, avec `connectTimeout` à 300 ms, puis `fetch_send` : on attend le refus de
     portée, pas une erreur de réseau.
   - La portée de `main`, écrite comme elle est : `https://example.com/` y est admis. Ce test change de sens le jour où
     la portée se resserre.
   - Échec attendu sur `main` : la redirection, suivie, finit en erreur de réseau. Le reste passe, sauf si `[::1]` ne se
     lit pas : la capacité d'essai entière tombe alors (le piège de l'issue), le test le montre, et CrOliX choisit une
     autre écriture ou l'absence de `[::1]`. Aucune entrée n'est écrite sans avoir été essayée ici.
   - Repli, si `generate_context!()` ne se construit pas sur le `MockRuntime` (pas essayé) : une copie de
     `parse_url_pattern` (plugin `src/scope.rs:17-34`), avec `urlpattern` 0.6 et `regex` en dev-dependencies, marquée
     comme copie. La redirection se prouve alors dans l'exe (tâche 10). Le testeur le dit dans son rapport.
   - Effet de bord : le plugin ouvre son fichier `.cookies` au dossier de cache de l'appli
     (plugin `src/lib.rs:106-114`), le vrai sur le poste ; il l'ouvre en ajout, sans l'écraser.
   - Barrières : Rust ; la surface publique.
   - Exclu : changer `default.json` ou `tauri.conf.json`.

2. - [ ] **Les redirections dans la portée** (`dev-luxuria`). *Après la 1, en parallèle du reste.*
   - `src-tauri/tauri.conf.json` : `"plugins": { "http": { "scopeRedirects": true } }`. Le plugin refuse une clé mal
     écrite (`deny_unknown_fields`, plugin `src/config.rs:9`) : l'appli ne démarrerait pas (lu, pas essayé).
   - Test : celui de la redirection, tâche 1, passe au vert.
   - Dit tel quel dans la PR : tant que `main` admet tout hôte, la clé ne change rien pour elle.
   - Barrières : Rust ; la surface publique.

### Piste Rust

3. - [ ] **La boucle locale, et les arguments du service** (`testeur`, puis `dev-luxuria`). Critère 3 ; choix 3 (b) ;
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
     - `--tts` : `aucun` ; `piper:<fichier>` ; `kokoro:<modèle>:<voix>`, coupé au dernier `:` comme `service.py:92`.
       Chaque fichier : un chemin absolu qui commence par une lettre de lecteur, sans `\\` ni `//` en tête, un fichier
       qui existe ; `.onnx` pour piper et pour le modèle de kokoro ;
     - `--rvc-gain` : un nombre fini ; `--lang` : deux ou trois lettres minuscules ;
     - chaque occurrence se vérifie : argparse garde la dernière.
   - Les messages disent l'argument : « Argument refusé : --origin. », « Adresse refusée : … (127.0.0.1, localhost ou
     [::1] seulement). », « Fichier de voix refusé : … (un fichier de ce poste, par son chemin complet). »
   - L'exemple de chemin de `voice.rs:284` et `:298` devient un dossier inventé, qui garde une espace :
     `C:\voix\ma voix.onnx`.
   - Tests, un par cas :
     - adresses admises : les trois hôtes, avec et sans port, avec un `/` final ;
     - refusées : `http://127.0.0.1:8080@example.com`, `http://127.0.0.1.example:8080`, `http://127.0.0.2:8080`,
       `http://[::ffff:127.0.0.1]:8080`, `http://localhost:8080/inference`, les ports 0 et 65536, `ftp://127.0.0.1` ;
     - arguments admis : ceux que bâtit `serviceArgs` (`voix.ts:18-26`) avec les réglages par défaut, avec
       whisper-server, avec RVC, avec un fichier de voix créé dans un dossier temporaire ;
     - refusés : `--origin x`, `--origin=x`, `--orig x`, `--port 9`, `whisper-server:http://192.0.2.1:8080`,
       `--rvc http://example.com`, `piper:\\hote\partage\v.onnx`, `piper:v.onnx`, un `.onnx` absent, `faster:org/model`,
       `faster:C:\m`, `--rvc-gain inf`, deux `--stt` dont le dernier est refusé, un drapeau sans valeur ;
     - un argument refusé ne lance rien et n'arrête rien : sur le modèle de
       `a_running_service_survives_a_refused_restart_then_restarts` (`voice.rs:360-412`).
   - Échec attendu sur `main` : les tests ne compilent pas, `loopback` et `checked_service_args` n'existent pas.
   - Barrières : Rust ; la surface publique.
   - Exclu : `service.py` ; la page, qui montre déjà le refus tel quel (`voix.ts:153-155`, `:226-230`) ; les programmes
     (tâche 5).

4. - [ ] **Les dossiers choisis par la personne : Rust** (`testeur`, puis `dev-luxuria`). Critère 2. Après la 3.
   - Fichiers : `src-tauri/src/folders.rs`, nouveau ; `src-tauri/src/body.rs` ; `src-tauri/src/voice.rs` ;
     `src-tauri/src/lib.rs`.
   - Le contrat, que la page suit (tâche 6) :
     - `folder_pick(name)` : `corps` ou `voix`, rien d'autre. Rend le chemin gardé, `null` si la personne annule, une
       erreur si le dossier est refusé ;
     - `folder_paths()` : `{ corps?: string, voix?: string }` ; `folder_forget(name)` ;
     - `body_config()` et `body_image(name)` ; `voice_start(args)` et `voice_restart(args)`.
   - `folder_pick` sur le modèle de `program_pick` (`programs.rs:209-235`) : la boîte de dialogue des dossiers du
     système (`blocking_pick_folder`, dialog `src/lib.rs:738`), modale à la fenêtre (`set_parent`), titrée « Le dossier
     du corps » ou « Le dossier du service voix ».
   - Le dossier se vérifie avant d'être gardé : `corps.json` dedans pour `corps` ; `voice::checked_dir`
     (`voice.rs:27-33`) pour `voix`. Refusé : le message, rien d'écrit, l'ancien choix reste.
   - Gardé dans `dossiers.json`, au dossier de configuration, à côté de `programmes.json`. Lu par `programs::read_paths`
     (`programs.rs:70-75`), qui ne dépend pas des noms ; écrit sur le modèle de `save_path` (`:78-90`).
   - `body_config` et `body_image` (`body.rs:75-83`) lisent le dossier gardé ; sans lui : « Aucun dossier du corps
     choisi. » `config` et `image` (`:63-73`) et leurs tests ne changent pas.
   - `voice_start` et `voice_restart` (`voice.rs:219-241`) lisent le dossier gardé ; `checked_dir` repasse au lancement,
     car le dossier a pu changer sur le disque. Sans lui : « Choisis d'abord le dossier du service. » `start`,
     `restart` et leurs tests gardent leur paramètre de dossier.
   - Les commandes s'enregistrent dans `lib.rs:31-44`.
   - Tests : un nom hors liste refusé ; un dossier sans `corps.json`, ou sans `service.py`, refusé, rien d'écrit ; un
     dossier gardé, lu, puis oublié par son nom ; un fichier illisible vaut aucun choix ; le dossier gardé, présent ou
     absent, lu par une fonction qui prend le chemin du fichier. La boîte elle-même ne se teste pas : tâche 10.
   - Échec attendu sur `main` : les tests ne compilent pas, `folders.rs` n'a que ses tests.
   - Barrières : Rust ; la surface publique.
   - Exclu : la page (tâche 6) ; reprendre les dossiers enregistrés par la page, qui ne suivent pas (le piège de
     l'issue).

5. - [ ] **Les programmes : la sonde et les arguments confirmés, Rust** (`testeur`, puis `dev-luxuria`). Choix 4 (b)
   et 5 (a). Après la 4.
   - Fichiers : `src-tauri/src/programs.rs`, `src-tauri/src/lib.rs`.
   - Le contrat, que la page suit (tâche 7) : `program_state(name, url)`, `program_start(name, url)`,
     `program_args(name, args)` qui rend `true` (confirmés) ou `false` (annulé), `program_arguments()` qui rend les
     arguments confirmés par nom.
   - `program_state` et `program_start` (`programs.rs:242-266`) prennent l'adresse du champ et la passent par
     `loopback::addr` (tâche 3). Refusée : rien n'est sondé ni lancé. `listening` (`:93-97`) ne reçoit plus que
     `hôte:port` de la boucle locale.
   - `program_args` : `checked_args` (`voice.rs:35-46`), puis une boîte de message du système, modale
     (`MessageDialogBuilder::parent`, dialog `src/lib.rs:305`), titrée « Les arguments de <programme> », les
     arguments un par ligne, « Confirmer » ou « Annuler ». `blocking_show` (`:372`) ne doit pas tourner sur le fil de
     la fenêtre : `#[tauri::command(async)]`, comme `program_pick`. Confirmés : gardés dans `arguments.json`, à côté de
     `programmes.json`.
   - Une clé absente de `arguments.json` : jamais confirmés ; une liste vide : confirmée vide.
   - `program_start` lance l'exe gardé avec les arguments confirmés ; jamais confirmés : « Confirme d'abord ses
     arguments. », et rien ne part. « Déjà lancé avec ces arguments » (`:132`) compare aux confirmés.
   - `program_forget` (`:237-240`) oublie aussi les arguments.
   - Tests : `state` et `start` avec `http://192.0.2.1:8080` et `http://example.com:80`, refusés sans sonde ; les tests
     de `:344-449` passent avec une adresse (`http://127.0.0.1:9`, et `http://` devant `local_addr`) ; des arguments
     gardés, lus, oubliés par nom ; jamais confirmés contre confirmés vides ; sans arguments confirmés, rien ne part.
   - Échec attendu sur `main` : `state` reçoit `http://192.0.2.1:8080` comme `hôte:port`, ne le résout pas, et rend
     `absent` au lieu d'un refus.
   - Barrières : Rust ; la surface publique.
   - Exclu : la page (tâche 7) ; borner les arguments eux-mêmes (choix 4 (c)).

### Piste page

6. - [ ] **Les dossiers : la page, et l'avis aux dossiers enregistrés** (`testeur`, puis `dev-luxuria`). Critère 2.
   *Après la 1, en parallèle de la piste Rust* : le contrat est celui de la tâche 4.
   - Fichiers : `src/desktop/dossiers.ts`, nouveau ; `src/desktop/corps.svelte.ts` ; `src/desktop/DossierCorps.svelte` ;
     `src/desktop/ServiceVoix.svelte` ; `src/desktop/voix.ts` ; `src/session.svelte.ts` ; `src/settings.ts` ;
     `src/App.svelte` s'il le faut. Leurs tests : `src/desktop/corps.test.ts`, `src/desktop/corps.svelte.test.ts`,
     `src/desktop/voix.test.ts`, `src/desktop/reglages.test.ts`, `src/desktop/keys.svelte.test.ts`,
     `src/settings.test.ts`.
   - `dossiers.ts` sur le modèle de `readProgramPaths`, `pickProgram` et `forgetProgram` (`voix.ts:268-291`), l'état
     dans `session.folders`, à côté de `programPaths` (`session.svelte.ts:120`). `startAll` (`voix.ts:392-404`) lit les
     dossiers avec les programmes.
   - `loadBody` (`corps.svelte.ts:70-102`) appelle `body_config` et `body_image` sans dossier ; le refus de Rust donne
     le souffle et dit pourquoi, comme aujourd'hui. Le corps se relit à l'ouverture de la fenêtre (`App.svelte:20`),
     après un choix et après « Oublier » ; il ne suit plus un champ (`corps.svelte.ts:119-127`).
   - `startVoice` et `restartVoice` appellent `voice_start` et `voice_restart` avec `{ args }` seul (`voix.ts:152`,
     `:225`). `missing` (`:29-35`) dit le dossier manquant d'après `session.folders.voix`.
   - L'écran : « Dossier du corps » (`DossierCorps.svelte:13-27`) et « Dossier du service »
     (`ServiceVoix.svelte:253-260`) prennent la forme de « Son programme » (`ServiceVoix.svelte:132-155`) : le
     chemin en texte, « Choisir… », « Oublier ». « Relire » reste pour le corps.
   - **L'avis aux dossiers enregistrés.** Les clés `body.folder` et `voice.service.folder` sont encore lues par
     `readSettings` (`settings.ts:174-188`), sous un nom qui dit ce qu'elles sont (`formerFolder`), et ne partent jamais
     vers Rust. Tant que Rust n'a pas de dossier pour ce nom et qu'un ancien existe, la ligne dit : « Le dossier se
     choisit maintenant dans la boîte de dialogue du système. Choisis de nouveau celui-ci : <ancien>. » Le premier
     choix réussi vide l'ancien. Au démarrage, un service à lancer sans dossier choisi ne part pas, et `missing` le dit.
   - Tests :
     - aucune commande n'est appelée avec `folder` ni `dir` ;
     - « Choisir… » appelle `folder_pick` avec son nom ; un refus s'affiche ; « Oublier » appelle `folder_forget` ;
     - un ancien dossier enregistré donne l'avis, n'est jamais envoyé, et se vide au premier choix ;
     - `readSettings` lit l'ancien `folder` sous son nouveau nom ;
     - les tests d'aujourd'hui qui posent un `folder` (`corps.svelte.test.ts:25`, `:35`, `keys.svelte.test.ts:101`,
       `reglages.test.ts:163-217`, `voix.test.ts:31`) changent de forme, pas de sens.
   - Échec attendu sur `main` : `voice_start` reçoit `dir` (`voix.test.ts:150`), `body_config` reçoit `folder`
     (`corps.test.ts:7-11`), et rien n'appelle `folder_pick`.
   - Barrières : la page ; la surface publique.
   - Exclu : le côté Rust (tâche 4) ; les programmes (tâche 7) ; la doc (tâche 8).

7. - [ ] **Les programmes : la page** (`testeur`, puis `dev-luxuria`). Choix 4 (b) et 5 (a). Après la 6.
   - Fichiers : `src/desktop/voix.ts`, `src/desktop/ServiceVoix.svelte`, `src/session.svelte.ts`,
     `src/desktop/voix.test.ts`, `src/desktop/reglages.test.ts`.
   - `addrOf` (`voix.ts:251-259`) part. `launchProgram` et `followPrograms` passent `{ name, url }` (`:319`, `:372`),
     l'adresse du champ.
   - `readProgramPaths` (`:269-272`) lit aussi `program_arguments`, dans `session.programArgs`.
   - « Ses arguments » (`ServiceVoix.svelte:157-167`) reste le brouillon, tapé à l'écran et gardé dans les réglages.
     Dessous : « Confirmés : … » ou « Pas encore confirmés », et « Confirmer… », actif quand le brouillon diffère, qui
     appelle `program_args`.
   - Au démarrage (`startPrograms`, `voix.ts:338-344`), un programme aux arguments jamais confirmés ne part pas, et
     aucune boîte ne s'ouvre seule (le piège de la boîte en plein tour). L'écran dit : « Ses arguments sont à confirmer,
     dans les réglages avancés de la voix. »
   - Les arguments enregistrés aujourd'hui dans la page deviennent le premier brouillon : rien à migrer, une
     confirmation à faire.
   - Tests : `program_start` et `program_state` reçoivent `url`, jamais `addr` ni `args` ; « Confirmer… » appelle
     `program_args` avec le brouillon ; le démarrage ne lance pas un programme non confirmé et n'appelle pas
     `program_args` ; un brouillon égal aux confirmés n'offre pas « Confirmer… ».
   - Échec attendu sur `main` : `voix.test.ts:281-290` et `:412` attendent `args` et `addr`.
   - Barrières : la page ; la surface publique.
   - Exclu : le côté Rust (tâche 5) ; la doc (tâche 8).

### La fin

8. - [ ] **Le `CLAUDE.md` et la doc** (`dev-luxuria`). Critère 5 ; lun-luxuria#79, deux points. Après les deux pistes.
   - `CLAUDE.md:32-41` dit ce que fait le code :
     - Rust lit le corps et lance le service dans les dossiers que la personne a choisis dans la boîte de dialogue du
       système ; il borne les arguments du service ; c'est lui qui sonde l'adresse d'un programme, sur la boucle
       locale seulement, que le champ lui donne ; il lance un programme avec les arguments que la personne a
       confirmés ;
     - les défenses, dont « aucune permission `dialog:` pour la page : les boîtes s'ouvrent côté Rust » ;
     - les sorties qui restent : le réseau de plugin-http (tout hôte, le proxy de la page, des redirections vérifiées
       contre une portée qui admet tout), avec le lien de l'issue de la tâche 9 ; la page qui lance encore le service
       dans le dossier choisi et les programmes confirmés ; le fichier de voix, un `.onnx` du poste.
   - 100 lignes au plus ([`structure-projet.md`](../../standards/structure-projet.md)).
   - `docs/README.md:61-80` : les dossiers choisis dans la boîte de dialogue, gardés dans `dossiers.json` ; l'avis aux
     dossiers enregistrés ; les arguments du service et leurs règles ; les arguments des programmes confirmés,
     `arguments.json` ; la sonde. La doc arrive dans la PR du code, dont le squash fait un seul commit.
   - Barrières : `npm run format:check` ; la surface publique.
   - Exclu : l'interface du serveur compatible (lun-luxuria#79, le troisième point).

9. - [ ] **L'issue de suite du réseau** (la session). Critère 4. Dès la validation, si CrOliX suit le choix 2 : une
   issue lun-luxuria, `niveau:critique`, « Le réseau de la fenêtre : une commande à règles fixes ». Elle reprend
   l'option 2 (b) et la portée 1 (c) telles qu'écrites ici, leurs pièges, et l'écoute du premier mot sur le desktop.
   Son lien entre dans le `CLAUDE.md` (tâche 8) et dans la PR.

10. - [ ] **La preuve dans l'exe** (CrOliX). Critère 6. En dernier.
    - L'exe : `npm run tauri build -- --no-bundle`, lancé depuis l'Explorateur. Lancé par un agent, ses données iraient
      ailleurs. Le laptop suffit si `uv` et un dossier du service y sont ; sinon le desktop, à la session du § 4 de la
      [feuille de route](2026-11-07-feuille-de-route-mvp.md).
    - Au premier lancement après la mise à jour : les deux lignes de dossier disent l'avis, avec l'ancien chemin.
    - Le corps : « Choisir… » ; la boîte est modale, un second clic n'en ouvre pas une autre ; un dossier sans
      `corps.json` est refusé et l'écran le dit ; le bon montre les images ; « Oublier » rend le souffle.
    - Le service : un dossier sans `service.py` est refusé ; le bon, « Lancer ou vérifier » le lance. Une ligne
      `--origin` dans « Autres arguments » : « Relancer le service » est refusé, celui d'avant tourne encore. Une
      adresse de whisper-server hors de la boucle locale : refusée au lancement.
    - Les programmes : « Pas encore confirmés » ; « Confirmer… » ouvre la boîte avec les arguments ; « Annuler » ne
      change rien ; « Confirmer », puis un redémarrage de l'appli : le programme part, sans boîte.
    - Le serveur et le modèle répondent comme avant : la portée n'a pas changé.
    - CrOliX dit ce qu'il a vu dans la PR ; elle passe « prête » ensuite.

À la fusion : les trois points de lun-luxuria#79 cochés ; le graphe de lun-luxuria mis à jour ; les worktrees retirés.

## Risques

- **Les dossiers se choisissent de nouveau.** Tant que ce n'est pas fait, le service ne part pas avec l'appli et le
  corps est le souffle. L'avis le dit, ligne par ligne.
- **Les arguments des programmes se confirment de nouveau.** Au premier lancement après la mise à jour, whisper-server
  et RVC ne partent pas seuls.
- **Une ligne libre refusée refuse le lancement entier**, `--port` ou une abréviation par exemple. Le message dit
  laquelle.
- **La règle d'adresse refuse un chemin après l'hôte** : le service ajoute le sien (`service.py:60`, `:116`). Une
  adresse écrite avec un chemin, qui marchait par hasard, est refusée.
- **La tâche 1 suppose que `generate_context!()` se construit sur le `MockRuntime`.** Le repli est écrit. Deux
  `generate_context!()` dans les tests embarquent deux fois la page.

## Ce que le plan ne vérifie pas

- **`[::1]` dans une entrée de portée** : la lecture est dans le plugin, pas essayée. La tâche 1 le dit avant tout.
- **Une clé mal écrite sous `plugins.http`** qui empêche le démarrage : lu (`deny_unknown_fields`), pas essayé.
- **Le proxy sur la boucle locale** : la décision passe par le `Matcher` de hyper-util, que je n'ai pas lu. Hors de la
  boucle locale, il s'applique.
- **L'ordre de `setup` et de la première requête de la page**, pour l'option 1 (c).
- **Les options de whisper-server et de RVC**, et ce que faster-whisper fait d'un dépôt ou d'un chemin à la place d'un
  nom de modèle.
- **Un chemin réseau qui ouvre une connexion SMB** : connu de Windows, pas essayé.
- **Une jonction du disque vers un partage** passe la règle du fichier de voix.
- **Les boîtes de dialogue** : seulement dans l'exe, par CrOliX.

## Ce qui reste ouvert après ce chantier

Si CrOliX suit les recommandations, et c'est ce que le `CLAUDE.md` dira :

- le réseau de la fenêtre, jusqu'à l'issue de la tâche 9 ;
- une page compromise lance encore le service, dans le dossier choisi et dans ses règles, et les programmes de la
  personne avec ses arguments confirmés ;
- elle fait encore lire au service tout `.onnx` du poste comme voix, et lit les images du dossier du corps choisi.
