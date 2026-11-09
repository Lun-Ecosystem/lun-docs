# Luxuria au quotidien. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** Luxuria s'ouvre avec Windows et se comprend sans aide. La fenêtre entre sans clic, l'arrivée dit ce que
demande chaque fonctionnement, la scène dit comment lui parler, les réglages du quotidien passent avant ceux du banc.

**Source :** spec [`2026-11-08-luxuria-usage-courant-design.md`](../specs/2026-11-08-luxuria-usage-courant-design.md),
ses cinq questions tranchées par CrOliX (audit, Q5) ; [audit du 08/11](2026-11-08-audit-ecosysteme.md), § 4.2 point 2
et § 8.3 ; [feuille de route](2026-11-07-feuille-de-route-mvp.md), chantier L. Maquettes :
[`2026-11-08-luxuria-usage/`](../maquettes/2026-11-08-luxuria-usage/).

**Cadre :** aucun code avant la validation de ce plan par CrOliX. Niveau `standard`. *Ask* : la PR reste en brouillon
jusqu'à la recette du desktop (feuille de route, § 4, étape 4), car le son, le vrai micro et les préréglages ne s'y
prouvent qu'en vrai. Une PR.

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
- Côté Rust, le moins possible. Une permission du micro ne vaut que pour l'origine de l'app, jamais pour une autre.
- Chaque mécanisme de perception garde son interrupteur. Un préréglage remplit des valeurs, il n'en cache aucune.
- `src/lib/ui` et `src/lib/tokens.css` restent des copies générées. Un composant qui manque passe par le kit de
  lun-docs (chantier M), jamais par une copie modifiée ici.

## Tâches

### La fenêtre qui entre seule

1. - [ ] `src-tauri/tauri.conf.json`, fenêtre `main` : `additionalBrowserArgs` porte
   `--autoplay-policy=no-user-gesture-required`, et recopie les arguments que wry met par défaut et que cette clé
   remplace (`--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection`, audit § 8.3). Une seule fenêtre, donc un
   seul dossier de données.
2. - [ ] Le micro. D'abord un constat sur le laptop, avec `npm run tauri dev` : la demande d'accès revient-elle après
   un « Autoriser » et une relance ?
   - Si elle ne revient pas, aucun code. Le README dit qu'une installation la pose une fois **[choix Claude]**.
   - Si elle revient, un gestionnaire de `PermissionRequested` de WebView2, par `webview2-com` à la version que wry
     utilise déjà. Il accorde le micro aux seules demandes de l'origine de l'app (`http://tauri.localhost`, et le
     `devUrl` en développement), et laisse tout le reste au comportement par défaut. Le test de l'origine est une
     fonction pure, vérifiée par `cargo test`.
3. - [ ] `App.svelte` : dans la fenêtre, la page entre seule quand rien ne manque. Relié : un jeton ; seul : l'adresse
   et le nom du modèle. Sinon, elle montre l'arrivée de la tâche 4. Dans un onglet, rien ne change. Un changement de
   fonctionnement ou de serveur recharge la page, qui entre de nouveau seule. Tests (`App.test.ts`) :
   - fenêtre et réglages complets : la scène, sans « Entrer » ;
   - fenêtre et réglages incomplets : l'arrivée ;
   - onglet : « Entrer », comme aujourd'hui.

   Au démarrage de Windows, elle écoute donc et peut parler sans attendre de clic : une urgence ou une parole
   spontanée arrive comme à toute autre heure (audit, § 4.2 point 2). La sourdine reste à un clic dans l'icône.

### L'arrivée (lun-luxuria#36)

4. - [ ] La page d'arrivée de la maquette `01-arrivee.html` (spec, § 2) :
   - le nom en titre, et la ligne qui dit ce qu'est l'appli ;
   - deux cartes, « Seul » et « Relié à un serveur », chacune avec ce qu'elle demande ;
   - les champs de la carte choisie, sur la page même. Seul : l'adresse du modèle, avec son aide, le nom du modèle et
     la clé facultative. Relié : l'adresse du serveur, dans la fenêtre seulement, puis le code et l'endroit où il
     s'affiche ;
   - « Entrer » attend ce qui manque, et le dit (« Il manque le nom du modèle. »). Relié, un code complet fait entrer.

   Le détour par « Seul » pour changer l'adresse du serveur disparaît. Tests : chaque carte, chaque manque dit, le
   code qui fait entrer.

### La scène et le fil vides (lun-luxuria#37)

5. - [ ] La scène de la maquette `02-scene.html` (spec, § 3) :
   - la consigne sous le halo suit la façon de parler réglée : micro ouvert, touche ou micro coupé, avec son bouton.
     Elle s'efface au premier tour, et ne revient qu'au lancement suivant ;
   - l'état en haut à gauche devient une pastille lisible, de 13 px, avec son point de couleur ;
   - les contrôles en haut à droite gardent leur ordre, avec une cible de 36 px et une infobulle qui donne le
     raccourci. « Faire taire » ne paraît que pendant qu'il parle ;
   - le fil vide dit ce qui s'y écrit. Ouvert, il décale les contrôles au lieu de passer dessous ;
   - dans un onglet, pas de bouton du petit mode.

   Tests (`Scene.test.ts`) : les trois consignes, leur effacement, l'absence du petit mode dans un onglet.

### Les réglages (lun-luxuria#38)

6. - [ ] Le quotidien d'abord : chaque thème montre ce qui se change au jour le jour, et le reste passe sous « Réglages
   avancés », replié, selon le tableau de la spec (§ 4.1). Rien ne disparaît : un test passe chaque champ
   d'aujourd'hui et le retrouve.
7. - [ ] Écoute, trois préréglages : « Pièce calme », « Normal », « Bruit autour ». Une valeur touchée à la main
   affiche « Personnalisé ».
   - « Normal » reprend les valeurs par défaut d'aujourd'hui.
   - Les deux autres ont des valeurs provisoires, marquées `shortcut:` dans le code : elles se mesurent sur le desktop
     (feuille de route, § 4, étape 4).
   - Tests : un préréglage remplit les valeurs ; une valeur touchée montre « Personnalisé ».
8. - [ ] Le reste de la spec (§ 4.3 à 4.8) :
   - des unités qui se lisent (« 0,8 s ») ; les décibels restent dans l'avancé, avec la valeur conseillée ; le volume
     devient un curseur ;
   - « Ton et contexte » sur huit lignes. Relié, la zone est grisée et dit que le serveur décide du ton ;
   - plus de textes de banc ni de titres répétés : les commandes du terminal vont au README ;
   - « Mesures de cette session » au bas de l'avancé de l'Écoute ;
   - sur un grand écran, une colonne de 720 px et un texte de base de 14 px ;
   - « Identité » à la place de « Lui », et des textes neutres partout.

   Tests : `noCore.test.ts` vert. Aucun texte genré ne reste (« Lui », « ce qu'il sait de lui »).

### La doc

9. - [ ] README : les commandes retirées de l'écran ; la fenêtre entre seule, l'onglet attend un clic ; la demande du
   micro, selon le constat de la tâche 2.

## Preuves

- Les barrières de la CI du dépôt : format, lint, typage, tests, build, `cargo fmt`, `cargo clippy`, `cargo test`.
- Les trois écrans dans Chrome (`127.0.0.1:5180`), à 1440 et à 2560 px, une capture par écran à côté de sa maquette.
- Sur le laptop, avec `npm run tauri dev` :
  - réglée, la fenêtre s'ouvre sur la scène sans clic ;
  - un `AudioContext` y vaut `running` sans geste ;
  - le micro s'ouvre selon le constat de la tâche 2.
- Sur le desktop (feuille de route, § 4, étape 4) : la fenêtre entre avec Windows, avec le son et le vrai micro, et
  les trois préréglages sont mesurés. La PR passe « prête » ensuite.

## Hors périmètre

- La personnalité (lun-luxuria#39, chantier N), le mot d'éveil, et un sélecteur de fichier pour les autres chemins.
- Les écrans propres à l'exe, déjà repris par lun-luxuria#33 : thème Fenêtre, icône, petit mode réel.
