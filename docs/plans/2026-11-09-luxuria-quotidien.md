# Luxuria au quotidien. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** Luxuria s'ouvre avec Windows et se comprend sans aide. La fenêtre entre sans clic, l'arrivée dit ce que
demande chaque fonctionnement, la scène dit comment lui parler, les réglages du quotidien passent avant ceux du banc.

**Source :** spec [`2026-11-08-luxuria-usage-courant-design.md`](../specs/2026-11-08-luxuria-usage-courant-design.md),
ses cinq questions tranchées par CrOliX (audit, Q5) ; [audit du 08/11](2026-11-08-audit-ecosysteme.md), § 4.2 point 2
et § 8.3 ; [feuille de route](2026-11-07-feuille-de-route-mvp.md), chantier L. Maquettes :
[`2026-11-08-luxuria-usage/`](../maquettes/2026-11-08-luxuria-usage/).

**Cadre :** aucun code avant la validation de ce plan par CrOliX. Niveau `standard`. *Ask* : la PR reste en brouillon
jusqu'à la recette du desktop (feuille de route, § 4, étape 4). Le laptop, sous Windows 11 avec Rust et WebView2,
prouve presque tout, l'exe compris ; seuls la vraie chaîne de la voix au démarrage, les valeurs des préréglages et le
second écran attendent le desktop. Une PR.

| Dépôt, branche | Issues | Niveau |
|---|---|---|
| `lun-luxuria`, `feat/usage-courant` | lun-luxuria#36, #37, #38 ; la fenêtre qui entre seule, issue ouverte au départ | `standard` |

## Contraintes

- La DA ne change pas : socle commun, magenta en accent seulement, scène sombre (spec, § 1). Les maquettes font foi
  pour la forme.
- Dépôt public : l'écran ne nomme ni le core ni ce à quoi Luxuria se relie (`src/noCore.test.ts`). L'agent reste
  neutre à l'écran (spec, § 4.8).
- Dans un onglet, la page reste entière et garde son seuil « Entrer » : un onglet ne joue aucun son sans clic. Ce qui
  n'existe que dans la fenêtre vit dans `src/desktop/`, ou derrière `inWindow` (`CLAUDE.md` du dépôt).
- Côté Rust, le moins possible, sans dépendance nouvelle. Une permission du micro ne vaut que pour l'origine de l'app.
- Chaque mécanisme de perception garde son interrupteur. Un préréglage remplit des valeurs, il n'en cache aucune.
- `src/lib/ui` et `src/lib/tokens.css` restent des copies générées, jamais retouchées. Les composants du kit servent
  tels qu'ils sont (tailles, pastille) ; ce que le kit n'a pas (une carte à choisir, un bloc replié) se compose dans
  `src/` avec ses pièces.

## Tâches

### La fenêtre qui entre seule

1. - [x] **Le son, un constat d'abord.** wry passe déjà `--autoplay-policy=no-user-gesture-required` quand on ne lui
   donne aucun argument, et Tauri ne lui en donne pas (wry 0.57, `src/webview2/mod.rs`). Dans l'exe compilé à
   `origin/main`, `new AudioContext().state` vaut-il `running` sans clic ?
   - Oui : rien à ajouter dans `tauri.conf.json`, recopier les arguments par défaut les figerait. Le commentaire
     « A click starts it » (`session.svelte.ts`) et le README se corrigent.
   - Non : `additionalBrowserArgs` sur la fenêtre `main`, avec les arguments par défaut de wry recopiés.

   **Fait :** dans l'exe compilé sur le laptop, `new AudioContext().state` vaut `running` sans aucun clic (lu par le
   protocole de débogage de WebView2, `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port`). Aucun code : le
   commentaire de `session.svelte.ts` et les README le disent.
2. - [x] **Le micro, un constat d'abord**, dans l'exe compilé, car une décision ne vaut que pour une origine : la
   demande d'accès revient-elle après un « Autoriser » et une relance ?
   - Non : aucun code. Le README dit qu'une installation la pose une fois, et comment revenir sur un « Bloquer »
     **[choix Claude]**.
   - Oui : `Builder::on_permission_request` de Tauri 2.12, sans dépendance nouvelle. Il accorde le micro quand la page
     (`webview.url()`) est celle de l'app, `http://tauri.localhost`, ou le `devUrl` en développement ; tout le reste
     garde le comportement par défaut. Le test de l'origine est une fonction pure, vérifiée par `cargo test`. Le
     gestionnaire n'est pas appelé quand une décision est déjà enregistrée : le README le dit.

   **Fait :** dans l'exe : `permissions.query` dit `prompt`, « Autoriser » dans la boîte de WebView2 (une page
   `edge://permission-request-dialog/`), relance, `granted` et `getUserMedia` passe sans boîte. La décision vit dans
   `EBWebView\Default\Preferences` du profil (`media_stream_mic`, origine `http://tauri.localhost`) ; ce fichier supprimé,
   appli fermée, elle redemande et les réglages restent. Aucun code ; `docs/README.md` dit comment revenir sur un «
   Bloquer ».
3. - [x] **Ce que vaut « présent » : une absence simple** (tranché par CrOliX le 09/11). Entrer annonce la présence au
   serveur relié. Une présence active fait dire une urgence à voix haute au lieu de l'envoyer au téléphone, et ouvre
   la parole spontanée. Le seuil « Entrer » était la seule chose qui remettait la présence à zéro après un
   redémarrage, et rien ne détectait l'absence (spec Luxuria, § 11). Désormais, dans la fenêtre :
   - sans saisie au clavier ni à la souris depuis un temps réglé, la présence s'arrête ; une session verrouillée ne
     reçoit aucune saisie, elle compte donc aussi ; la première saisie la reprend. Côté Rust, une commande lit le
     temps écoulé (`GetLastInputInfo`, par `windows-sys`, déjà là, avec ses features
     `Win32_UI_Input_KeyboardAndMouse` et `Win32_System_SystemInformation` en plus) ; la page la relit toutes les
     30 s ;
   - **[choix Claude]** 15 minutes par défaut, avec son interrupteur et son délai dans Réglages › Fenêtre, comme tout
     mécanisme de perception ;
   - l'absence ne change que ce qui est annoncé au serveur : l'écoute et la sourdine restent ce qu'elles sont ;
   - tests : la fonction qui passe d'une durée sans saisie à présent ou absent ; l'interrupteur coupé, toujours
     présent ; la reprise à la première saisie. Dans un onglet, rien ne change.

   **Fait :** `idle_ms` côté Rust (`GetLastInputInfo`, `windows-sys`, 40 lignes), `src/desktop/away.ts` décide, la page
   relit toutes les 30 s et toutes les 3 s pendant l'absence. Une phrase qui passe le filtre compte aussi comme une
   saisie : une vidéo ou une autre personne, filtre coupé, gardent la présence (README, limites). Relié seulement ; 15
   minutes par défaut, de 1 à 240, dans Réglages › La fenêtre. Tests dans `away.test.ts`. La manette ne compte pas :
   lun-luxuria#43.
4. - [x] **Entrer seule.** Une fonction pure dit si rien ne manque. Relié : un jeton ; seul : l'adresse et le nom du
   modèle. Dans la fenêtre, la page entre alors seule, une seule fois, après le premier verdict du service de la voix
   (prêt ou absent), pour que l'accueil ne parte pas dans un service qui démarre. Sinon, elle montre l'arrivée de la
   tâche 5. Dans un onglet, rien ne change.
   - Un jeton refusé par le serveur (401) est oublié, et l'arrivée revient avec le code et le dit. Aujourd'hui, la
     scène se dit « injoignable » et retente sans fin.
   - Un changement de fonctionnement ou de serveur recharge la page, qui entre de nouveau seule.
   - « L'accueil, à ton arrivée » devient « au lancement ».
   - Tests : la fonction pure, le refus du jeton, un seul `enter()`, l'onglet comme aujourd'hui.

   **Fait :** `arrival.ts` dit ce qui manque ; `enter.svelte.ts` entre une fois après le premier verdict du service
   voix, avec « Sa voix se prépare… » et « Entrer sans attendre » en attendant. Un 401 oublie le jeton et l'arrivée
   revient avec « Ce poste n'est plus reconnu par le serveur », gardé le temps d'un rechargement (`sessionStorage`). «
   Au lancement ». Tests dans `arrival.test.ts`, `enter.svelte.test.ts`, `core.test.ts`.

### L'arrivée (lun-luxuria#36)

5. - [x] La page d'arrivée de la maquette `01-arrivee.html` (spec, § 2) :
   - le nom en titre, et la ligne qui dit ce qu'est l'appli ;
   - deux cartes, « Seul » et « Relié à un serveur », chacune avec ce qu'elle demande ;
   - les champs de la carte choisie, sur la page même. Seul : l'adresse du modèle, avec son aide, le nom du modèle et
     la clé facultative. Relié : l'adresse du serveur, dans la fenêtre seulement, avec l'avertissement d'une adresse
     en `http` hors du poste (`serverWarning`), puis le code et l'endroit où il s'affiche ;
   - « Entrer » attend ce qui manque, et le dit (« Il manque le nom du modèle. »). Relié, un code complet fait entrer.

   Le détour par « Seul » pour changer l'adresse du serveur disparaît. Tests : chaque carte, chaque manque dit, le
   code qui fait entrer.

   **Fait :** `Arrivee.svelte` : les deux cartes en boutons radio, les champs de la carte choisie, l'adresse du serveur
   dans la fenêtre seulement avec `serverWarning`, le code en six cases qui fait entrer. L'écran dit ce qui manque dès
   que le champ est vide et « Entrer » reste éteint. Tests dans `Arrivee.test.ts`. Capture à côté de la maquette dans la
   page de preuves de la PR.

### La scène et le fil vides (lun-luxuria#37)

6. - [x] La scène de la maquette `02-scene.html` (spec, § 3) :
   - la consigne sous le halo suit ce qui l'atteint vraiment dans le mode affiché, pas seulement la façon de parler :
     filtre coupé, « Parle-lui. » ; filtre du nom, « Dis son nom, ou parle juste après sa réponse. » ; touche, la
     touche réglée ; micro coupé, « Écris-lui, ou rallume le micro. », avec le bouton ; en sourdine, la sourdine et
     son bouton, car rien ne l'atteint, l'écrit non plus ;
   - elle s'efface au premier tour de la personne (l'accueil ne l'efface pas), et ne revient qu'au lancement suivant ;
   - l'état en haut à gauche devient le `Badge` du kit, avec son point de couleur ;
   - les contrôles en haut à droite gardent leur ordre, en `IconButton` de 34 px, la taille du kit la plus proche de la
     maquette **[choix Claude]**, avec l'infobulle qui donne le raccourci réglé dans la fenêtre. « Faire taire » ne
     paraît que pendant qu'il parle ;
   - le fil vide dit ce qui s'y écrit : « Rien encore aujourd'hui. » seul, « Rien encore. » relié, où le fil n'est pas
     celui du jour. Ouvert, il décale les contrôles au lieu de passer dessous ;
   - dans un onglet, la scène toujours, même si un petit mode est enregistré, et pas de bouton du petit mode.

   Tests (`Scene.test.ts`) : chaque consigne, son effacement au premier tour de la personne, l'onglet sans petit mode.

   **Fait :** `Scene.svelte` : la consigne par ce qui atteint vraiment (filtre, nom, touche, micro coupé, sourdine,
   service voix absent), effacée au premier tour de la personne ; `Badge` et `IconButton` de 34 px avec le raccourci en
   infobulle dans la fenêtre ; « Faire taire » seulement pendant qu'il parle ; `Fil.svelte` vide dit « Rien encore
   aujourd'hui. » ou « Rien encore. » et décale les contrôles. Tests dans `Scene.test.ts`.

### Les réglages (lun-luxuria#38)

7. - [x] Le quotidien d'abord : chaque thème montre ce qui se change au jour le jour, et le reste passe sous « Réglages
   avancés », replié, selon le tableau de la spec (§ 4.1). Rien ne disparaît : un test passe chaque champ
   d'aujourd'hui et le retrouve.

   **Fait :** `Reglages.svelte` : chaque thème ouvre sur son quotidien, le reste sous `Avance.svelte` replié, selon le
   tableau de la spec. `reglages.test.ts` passe chaque champ d'aujourd'hui et le retrouve.
8. - [x] Écoute, trois préréglages : « Pièce calme », « Normal », « Bruit autour ». Ils ne touchent que la fin de phrase
   et le seuil du silence : `endOfSpeech.silenceMs`, `pauseMs`, `minSpeechMs` et `floorDb`.
   - « Normal » reprend les valeurs par défaut d'aujourd'hui.
   - Les deux autres ont des valeurs provisoires, marquées `shortcut:` dans le code : elles se mesurent sur le desktop
     (feuille de route, § 4, étape 4).
   - « Personnalisé » se lit en comparant ces quatre valeurs aux trois préréglages, sans réglage de plus.
   - Tests : un préréglage remplit les valeurs ; une valeur touchée montre « Personnalisé » ; une appli ignorée
     ajoutée ne le montre pas.

   **Fait :** `src/listen/presets.ts` : les trois préréglages sur `silenceMs`, `pauseMs`, `minSpeechMs` et `floorDb`, «
   Normal » aux valeurs par défaut, les deux autres `shortcut:` à mesurer sur le desktop ; « Personnalisé » se lit par
   comparaison. Tests dans `presets.test.ts` et `reglages.test.ts`.
9. - [x] Le reste de la spec (§ 4.3 à 4.8) :
   - des unités qui se lisent (« 0,8 s ») ; les décibels restent dans l'avancé, avec la valeur conseillée ; le volume
     devient un curseur ;
   - « Ton et contexte » sur huit lignes. Relié, la zone est grisée et dit que le serveur décide du ton ;
   - plus de textes de banc ni de titres répétés : les commandes du terminal vont au README ;
   - « Mesures de cette session » au bas de l'avancé de l'Écoute ;
   - sur un grand écran, une colonne de 720 px et un texte de base de 14 px ;
   - « Identité » à la place de « Lui », et des textes neutres partout. « Seul » et « Relié à un serveur » restent les
     noms des deux fonctionnements, tranchés en Q5.

   Tests : `noCore.test.ts` vert. Un test refuse la liste des textes genrés relevés : « Lui », « ce qu'il sait de
   lui », « Qui il est », « Ce que la scène montre de lui », « quand il se tait », « il ne t'entend pas », « Ce qui le
   fait répondre ».

   **Fait :** Secondes et dB lisibles, le volume en curseur, « Ton et contexte » sur huit lignes et grisé relié, les
   commandes au README, « Mesures de cette session » au bas de l'avancé, 720 px et 14 px sur grand écran, « Identité »
   et des textes neutres. `noCore.test.ts` vert et un test refuse la liste des textes genrés.

### La doc

10. - [x] README : les commandes retirées de l'écran ; la fenêtre entre seule, l'onglet attend un clic ; le micro et le
    son selon les constats des tâches 1 et 2 ; la présence selon la tâche 3.

   **Fait :** README et `docs/README.md` : les commandes au README, l'arrivée qui demande ce qui manque, la fenêtre qui
   entre seule et l'onglet qui attend un clic, le son par wry, le micro gardé par le profil WebView2, l'absence et ses
   limites (manette, filtre coupé).

## Preuves

- Les barrières de la CI du dépôt : format, lint, typage, tests, build, `cargo fmt`, `cargo clippy`, `cargo test`.
- Les écrans dans Chrome (`127.0.0.1:5180`), à 1440 et à 2560 px, une capture par écran à côté de sa maquette.
- Sur le laptop, dans l'exe compilé, car `tauri dev` ne sert ni l'origine réelle ni `frontendDist` :
  - réglée, la fenêtre s'ouvre sur la scène sans clic, et un `AudioContext` y vaut `running` ;
  - le micro s'ouvre selon le constat de la tâche 2 ;
  - avec « Démarrer avec Windows », la session fermée puis rouverte : la fenêtre entre seule ; sans saisie pendant
    le délai réglé, la présence s'arrête, et la première saisie la reprend ;
  - les variantes propres à la fenêtre, en capture : l'adresse du serveur à l'arrivée, le petit mode, les raccourcis.
  - Piège : un exe déjà lancé au démarrage garde la main, `tauri dev` ne fait que le montrer (`single-instance`).
- Sur le desktop (feuille de route, § 4, étape 4) : la vraie chaîne de la voix au démarrage, les trois préréglages
  mesurés, l'état des permissions du profil WebView2 du desktop, le second écran. La PR passe « prête » ensuite.

## Hors périmètre

- La personnalité (lun-luxuria#39, chantier N), le mot d'éveil, et un sélecteur de fichier pour les autres chemins.
- Les écrans propres à l'exe, déjà repris par lun-luxuria#33 : thème Fenêtre, icône, petit mode réel.
