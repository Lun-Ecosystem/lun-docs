# Luxuria dans une fenêtre Tauri. Plan

> **Pour les agents d'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** Luxuria quitte l'onglet du navigateur pour une vraie appli Windows : une fenêtre sans console, la scène sur
l'écran mémorisé, le petit mode au premier plan, le raccourci global, la touche à maintenir hors de la fenêtre, le
corps lu dans un dossier d'assets, le service voix lancé avec elle. C'est le chantier E du plan
`2026-11-07-recette-laptop-et-outillage.md`, préparé là, lancé le 07/11 : CrOliX a installé Rust et les Build Tools.

**Sources :** spec `2026-11-06-lun-luxuria-design.md` §3, §4, §5.1, §6.1, §6.8, §9 ; ADR 0009 ; `lun-luxuria/CLAUDE.md`
et la section « Limites connues » de son `docs/README.md`. Plan relu par l'agent plan-challenger le 07/11 : ses points
sont intégrés ci-dessous.

| Chantier | Dépôt, branche | Issues | Niveau |
|---|---|---|---|
| E. Luxuria dans une fenêtre Tauri | `lun-luxuria`, `feat/fenetre-tauri` ; ce plan dans `lun-docs`, `docs/plan-luxuria-tauri` | lun-docs#61 (Tauri) | `critique` |

## Le point dur : la page n'a plus de proxy

Dans le navigateur, la page appelle `/api/...` (le core) et `/voix/...` (le service voix) ; c'est Vite qui les relaie.
Dans Tauri, la page est servie par l'appli (`http://tauri.localhost`) : ces chemins ne mènent nulle part, et ni le core
ni le service voix n'envoient d'en-tête CORS.

| Approche | Pour | Contre |
|---|---|---|
| **A. Le `fetch` de `@tauri-apps/plugin-http` (côté Rust) pour le core et le modèle ; le `fetch` natif pour la voix, avec CORS dans le service** | `CoreClient`, `LocalBrain` et les fonctions de `voice.ts` prennent déjà un `fetch` ; le core ne change pas ; l'audio ne traverse pas l'IPC | le flux `/api/live`, son arrêt et la portée reposent sur le plugin : à prouver d'abord (tâche 0) |
| B. Un petit proxy local en Rust (un port de plus) | la page garde ses chemins | un serveur de plus à écrire, sécuriser, garder en vie ; un port pris |
| C. CORS dans le core aussi | rien côté Tauri pour le core | ouvre le core privé aux origines d'une webview ; touche un dépôt hors chantier |

**Choix : A [choix Claude], sous condition de la tâche 0.** Si le flux ou son arrêt échouent, B reprend la main et le
plan est amendé avant la suite.

- `src/desktop/fetch.ts` réécrit `/api/x` en `<adresse du serveur>/api/x` pour le `fetch` du plugin. La version du
  plugin est fixée exactement.
- `voice.ts` reçoit la base `http://127.0.0.1:8793` dans l'appli. `voix/service.py` répond `Access-Control-Allow-Origin`
  aux seules origines qu'il accepte déjà, et à la requête préalable (`OPTIONS`, y compris l'en-tête « réseau privé » si
  WebView2 le demande). Tests dans `voix/test_service.py`.
- La portée du plugin couvre `http://*:*/*` et `https://*:*/*` **[choix Claude]** : l'adresse du serveur et celle du
  modèle sont des réglages, inconnues à la construction. Sans CORS, la page lit toute réponse de cette portée : **la
  page est la frontière de confiance**, et la CSP (plus bas) en est la défense.

## Les autres choix

- **Sécurité de la page.** CSP de production : `default-src 'self'; connect-src 'self' ipc: http://ipc.localhost
  http://127.0.0.1:8793; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self'`, plus une
  `devCsp` pour Vite. `useHttpsScheme` reste éteint (l'origine reste `http://tauri.localhost`). Capacités nommées une
  par une : fenêtre (plein écran, premier plan, taille, position, décorations, `start-dragging`, écrans, fermeture),
  global-shortcut (enregistrer, retirer), http (la portée ci-dessus), et les commandes propres à l'appli.
- **L'adresse du serveur.** Réglage « Adresse du serveur », défaut `http://127.0.0.1:8788`, seulement dans l'appli et
  en mode relié (aucun mot « core » à l'écran, `noCore.test.ts`). La changer efface le jeton et recharge la page, comme
  `switchBrain` : un jeton ne part jamais vers une autre adresse. Une adresse `http` hors boucle locale est signalée
  par `unsafeAddress` (`src/local.ts`).
- **Une seule fenêtre, deux géométries** [choix Claude]. Deux fenêtres feraient deux pages, deux sessions, deux sorties
  audio. Scène : sans bordure, plein écran sur l'écran mémorisé. Petit mode : vignette sans bordure, au premier plan,
  déplaçable (`data-tauri-drag-region`), dans un coin ; le fil ouvert l'agrandit en panneau. L'ordre des appels sort du
  plein écran avant de redimensionner. La bascule ne recharge pas la page et n'appelle jamais `setFocus` : le focus reste
  à l'autre fenêtre.
- **Mémoire de la fenêtre** : par géométrie, l'écran (nom) et la position, dans le stockage local, mise à jour au
  déplacement. Nom introuvable (sous Windows, `\\.\DISPLAYn` peut changer) : la position seule si elle tombe sur un écran,
  sinon l'écran principal. Premier lancement : le premier écran non principal, sinon le principal.
- **Raccourci global** (`@tauri-apps/plugin-global-shortcut`) : `Ctrl+Shift+L` par défaut, réglable. **Touche à
  maintenir** globale par le même plugin (appui et relâche) sur le code déjà réglé (`F9`). Windows réserve une touche
  globale à l'appli qui la prend : une touche imprimable sans modificateur est refusée pour l'usage global, avec la
  raison à l'écran. Enregistrement impossible (touche prise) : l'écoute de la fenêtre reste, et l'écran le dit.
- **Une seule instance** (`tauri-plugin-single-instance`) : un second lancement montre la première.
- **Sans console** : `windows_subsystem = "windows"` hors debug ; le service voix lancé avec `CREATE_NO_WINDOW`.
- **Le dossier d'assets.** Réglage « Dossier du corps ». Dedans, `corps.json` :
  `{ "niveau": "images", "repos": "repos.png", "parole": "parole.png", "vignette": { "zoom": 2, "x": 50, "y": 30 } }`.
  Dans l'appli, **le fichier décide du niveau**, et les champs d'adresses du navigateur sont masqués. Une commande Rust
  lit ce fichier et les images qu'il nomme, seulement dans ce dossier : chemin canonique, puis contrôle qu'il reste dans
  le dossier canonique (liens et jonctions compris) ; noms simples (ni `..`, ni séparateur, ni `:`, ni nom réservé
  comme `CON` ou `NUL`) ; extensions `png`, `jpg`, `jpeg`, `webp`, `gif` ; 10 Mo au plus. Les octets bruts passent par
  `tauri::ipc::Response`, la page en fait une `blob:` URL (libérée au remplacement). Aucun accès large au disque pour la
  page. Fichier manquant, illisible ou refusé : le souffle, et Réglages dit pourquoi. Le dossier se relit à l'entrée et
  par « Relire ». Dans le navigateur, rien ne change.
- **Le service voix.** Réglages « Lancer le service avec l'appli », « Dossier du service », « Arguments » (un par ligne,
  passés tels quels à `Command::args`, jamais de shell : les chemins avec espace passent). Rust vérifie que le dossier
  canonique contient `service.py`, lance `uv run service.py <arguments>` sans console, stdout et stderr dans un fichier
  du dossier de journaux de l'appli (jamais un tuyau non lu). L'état « lancé par moi » vit dans Rust
  (`Mutex<Option<Child>>`) : la commande est idempotente, un rechargement ou une seconde entrée ne relance rien. La page
  attend `/ping` avec l'état « voix en démarrage » (les modèles se chargent avant le ping). À la sortie, l'arbre lancé
  est arrêté (`taskkill /T /F /PID`), port 8793 vérifié libre. Un service déjà lancé n'est jamais touché. `uv`
  introuvable : message clair, renvoi au journal.
- **La fermeture** : la fenêtre intercepte sa fermeture, envoie `stopped` (2 s au plus), puis ferme.
- **Le micro** : sous WebView2, il est tenu par `msedgewebview2.exe`, que `busyWith` ignore déjà ; la promesse « le
  vrai nom de l'appli sur le micro » (spec §3) n'est donc pas tenue, et une autre appli WebView2 (le nouveau Teams)
  échappe à la détection. Dit dans « Limites connues », note `shortcut:` de `voice.ts` corrigée, spec §3 annotée dans
  ce même PR de lun-docs. `audio.ts` ne change pas.
- **`npm run dev` intact** : Vite garde son proxy. `tauri dev` utilise `devUrl` `http://127.0.0.1:5180` avec
  `strictPort` (l'origine que le service accepte). Le stockage de `tauri dev` et celui du build sont distincts :
  réglages et appairage se refont, dit dans le README.
- **Dans `src/`** : un dossier `src/desktop/` (fetch, fenêtre, raccourcis, corps, service) et ses points d'appel derrière
  `isTauri()`. `CLAUDE.md` du dépôt mis à jour en conséquence.

## Critères de fin

0. **Preuve (tâche 0), avant le reste** : plugin-http à version fixée ; un événement de `/api/live` arrive avant la fin
   de la réponse ; l'arrêt du flux ferme la connexion côté core ; l'Origin envoyé est relevé ; un chemin profond avec
   paramètres (`/api/threads/main/messages?limit=50`) passe la portée ; le service voix répond au `fetch` natif de la
   webview (requête préalable comprise) ; appui et relâche d'une touche globale arrivent, entrées synthétiques
   comprises. Relevés écrits dans la PR.
1. `npm run tauri build -- --no-bundle` produit un `.exe` qui démarre sans console ; un second lancement ne crée pas
   de seconde fenêtre.
2. Reliée, l'appli parle au core par l'adresse réglée et au service voix : entrée, présence, `/api/live`, envoi d'un
   message, P0 (satellite factice). Changer l'adresse efface le jeton. Mode seul : un modèle local répond.
3. La scène s'ouvre à la position mémorisée ; le petit mode est une vignette au premier plan, déplaçable, et le fil
   ouvert l'agrandit. Le choix survit à un relancement.
4. Le raccourci global passe de la scène au petit mode et retour, fenêtre inactive, sans recharger la page (pas de
   nouvelle présence, la lecture en cours continue), et le focus reste à l'autre fenêtre. La touche à maintenir marche
   fenêtre inactive.
5. Un dossier d'assets avec `corps.json` donne le niveau 2 dans la scène et la vignette ; remplacer une image puis
   « Relire » change le corps ; un fichier manquant ou un nom hors du dossier donne le souffle, sans erreur bloquante.
6. Le service voix se lance avec l'appli, sans console, une seule fois même après un rechargement, ou se trouve déjà
   lancé et n'est pas touché ; lancé par elle, il s'arrête avec elle sans laisser de `python.exe` ni le port pris.
7. Fermer la fenêtre envoie `stopped` : la présence finit tout de suite côté core.
8. Chaque nouveau réglage est sur l'écran Réglages, survit à un relancement, et l'écran dit s'il agit tout de suite ; les
   réglages du bureau n'apparaissent que dans l'appli.
9. Tests : JS (`src/desktop/*.test.ts`, API Tauri simulée), Rust (dossier du corps : `..`, séparateurs, `:`, noms
   réservés, lien sortant, taille, extension ; arguments et dossier du service), Python (CORS du service). Barrières :
   celles de la page, plus `cargo fmt --check`, `cargo clippy -D warnings`, `cargo test` ; job CI Windows qui construit
   la page avant cargo (`generate_context!` veut `dist` et les icônes, versionnées).
10. `docs/README.md` (lancer, construire, réglages, limites : micro sous WebView2, jeu en plein écran exclusif qui
    cache le premier plan, stockage dev et build distincts) et `CLAUDE.md` à jour.

**Preuves sur le laptop** : core jetable et satellite factice comme la recette du 07/11 ; l'exe construit à côté. Un
seul écran : la mémoire se prouve par la position ; le premier écran non principal et l'écran mémorisé restent au
desktop. Les touches globales s'envoient par un petit script (`keybd_event`, qui tient une touche) pendant qu'une autre
fenêtre a le focus. La scène en plein écran couvre l'écran : la bascule par raccourci sert pendant l'essai.

**Latence** : sans mesure valable sur le laptop, le chiffre par tour reste au desktop ; la tâche 0 vérifie seulement
que la voix ne passe pas par l'IPC.

## Tâches

- [ ] Branche `feat/fenetre-tauri` depuis `main`, PR en brouillon au premier push.
- [ ] Tâche 0 : squelette Tauri minimal et preuves du critère 0 ; si le flux échoue, arrêt et plan amendé (B).
- [ ] CORS du service voix, tests d'abord ; `src/desktop/fetch.ts` et base de la voix, tests ; « Adresse du serveur ».
- [ ] Squelette complet : CSP, capacités, icônes (SVG du monde, sans nom d'instance), sans console, une seule instance.
- [ ] Fenêtre : géométries, mémoire, premier plan, déplacement, fil agrandi ; fermeture avec `stopped`. Tests.
- [ ] Raccourcis globaux : bascule et touche à maintenir, refus des touches imprimables, repli. Tests.
- [ ] Corps : commande Rust et ses tests, puis `src/desktop/corps.ts`, Réglages, Scene (vignette recadrée).
- [ ] Service voix : commande Rust et ses tests, lancement idempotent, journal, arrêt de l'arbre.
- [ ] CI Windows, `docs/README.md`, `CLAUDE.md`, spec §3 annotée, preuves sur le laptop, relecture (agent reviewer),
      PR prête.

## Hors périmètre

Zone de notification, démarrage avec Windows, mises à jour, installeurs (ADR 0009, après le MVP local). La clé du
modèle dans le trousseau du système (issue `inbox`). Le deuxième écran réel, la latence par tour, tout ce qui s'entend,
la soirée réelle : au desktop. Live2D. La transparence du petit mode : opaque à bords droits d'abord (spec §4).
