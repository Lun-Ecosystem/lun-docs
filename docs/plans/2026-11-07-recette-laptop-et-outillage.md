# La recette de Luxuria jouée sur le laptop, l'outillage de lun-docs, Tauri préparé. Plan

> **Pour les agents d'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** faire avancer le MVP sur le laptop autant que possible, par chantiers larges, contrôlés et testés à chaque
étape. CrOliX, le 07/11, après le merge des trois chantiers précédents : « élargis au max la taille des chantiers sans
foncer tête baissée », en pleine autonomie.

**Cadre :** l'état de lun-docs#61 au 07/11 liste ce qui reste avant la recette : #6 et #7 (desktop), la réponse préparée
mesurée (desktop), Tauri, une soirée réelle. Plusieurs lignes de la recette (spec Luxuria §9) sont « à vérifier » et se
jouent sans voix réelle : c'est le chantier D. Le laptop n'a ni Rust ni voix Piper (relevé du 07/11) : Tauri attend
l'accord de CrOliX pour installer Rust (chantier E, préparé seulement), et ce qui s'entend reste au desktop.

| Chantier | Dépôt, branche | Issues | Niveau |
|---|---|---|---|
| D. La recette de Luxuria jouée sur le laptop | `lun-luxuria`, `fix/recette-laptop` ; `lun-anima`, `fix/battement-refuse` | lun-luxuria#18, lun-docs#61 (lignes « à vérifier ») | `standard` |
| G. L'outillage de lun-docs | `lun-docs`, `chore/outillage-et-plans` | lun-docs#3, #4, #5, #6 ; ce plan et ses coches | `standard` |
| E. Luxuria dans une fenêtre Tauri | `lun-luxuria`, plus tard | lun-docs#61 (Tauri) | `critique` |

## D. La recette de Luxuria jouée sur le laptop

**Comment :** un core jetable, dans **une seule session Git Bash** qui pose tout puis vérifie avant de lancer :
`DB_PATH` dans le dossier temporaire de la session (jamais `data/anima.db`), `PORT=8799`, `HOST=127.0.0.1`,
`ROUTINES_CATCHUP=0`, et `OPENAI_API_KEY` posée à une valeur factice non vide **[choix Claude]** : une variable posée
gagne sur `.env` (`core/src/env.ts`), un appel au modèle reçoit 401 et ne coûte rien, et la base neuve n'a pas de clé
`set-key`. Le script vérifie `DB_PATH` et la clé dans l'environnement du processus avant de lancer, et refuse si l'un
des ports 8799, 8791 (satellite factice) ou 5180 (Vite) est déjà pris, comme 8787, 8788 et 8789, qui restent à CrOliX.
`connect` et `pair-code` ne tournent que dans cette même session, donc sur la base jetable. Le satellite factice de
`luxuria-essai/banc` sert le P0. Luxuria sur `npm run dev` avec `CORE_URL` vers ce core, appairée par le code tiré de
la base jetable. Vérification dans Chrome, onglets ouverts pour l'occasion et refermés ensuite. Seuls les processus
lancés par ce script sont arrêtés à la fin. Chaque ligne donne une preuve : capture, sortie de commande, ou événement
lu sur `/api/live`.

Sans voix ni micro réel, « dit » se prouve par l'événement `speech` lu sur `/api/live`, jamais à l'oreille.

### Lignes jouées

1. **Les images** : deux images dans les Réglages, le corps passe en niveau 2 dans la scène et dans la vignette, sans
   recharger. Une adresse d'image fausse donne le souffle, sans exception JavaScript (l'erreur réseau du 404, que Chrome
   affiche toujours, ne compte pas). Note : le « dossier d'assets » de la spec n'existe qu'avec Tauri ; ici, des adresses.
2. **Micro coupé puis relancé** : coupé, la page rechargée, l'état dit « Micro coupé » et `getUserMedia` n'est pas
   appelé (espionné dans la page). Ouvrir le micro demande l'autorisation de Chrome, qu'un agent ne donne pas : le
   relevé est partiel et le dit.
3. **Les réglages** : chaque ligne de l'écran se change, survit à un rechargement, et l'écran dit si elle agit tout de
   suite. L'inactivité réelle d'une mécanique éteinte n'est vérifiée que là où le laptop la voit sans parler ni service
   voix (la touche, le petit mode) ; la détection d'une autre appli passe par le service voix : « non vérifiable ici ».
4. **Core coupé** : le core jetable arrêté, l'état passe à « Injoignable », la page reste ouverte ; relancé, elle se
   reconnecte seule, sans clic, et se ré-annonce (présence vivante côté core).
5. **Le P0** : pendant une présence, un événement urgent du satellite factice donne un `speech` de raison `p0` sur
   `/api/live`, sans appel au modèle, et apparaît dans le front mobile du core ; avec `busy`, aucun `speech`.
6. **Le direct sur mobile** : un message posté au fil par Luxuria apparaît en direct dans le front du core ouvert à côté
   (sans voix, par le même appel que la voix).
7. **Deux onglets** (lun-anima#63, livré) : fermer l'un garde la présence, fermer l'autre la finit, lu sur la base
   jetable. #18 se prouve par ses tests ; à l'écran, seulement le cas où la présence a fini pendant que la page vit (un
   battement refusé, puis l'annonce).

### Critères de fin

1. Chaque ligne 1 à 7 a son verdict (tient, écart corrigé, écart en issue) et sa preuve, dans la PR et dans
   `luxuria-essai/RECETTE.md` (hors dépôt), section « Recette laptop du 07/11 ».
2. **#18, sans faire parler Natsume à chaque retour d'onglet.** Renvoyer `started` au retour visible ferait dire « Te
   revoilà. » à chaque alt-tab : le core la dit à voix haute dès que la présence vit. À la place :
   - **lun-anima** : `POST /api/presence` répond 204 à un `beat` pris, et **410** à un `beat` qu'il ne prend pas (aucune
     présence ouverte, ou onglet inconnu quand d'autres sont connus). `started` et `stopped` ne changent pas. Un client
     qui ignore la réponse, comme l'actuel, ne voit aucune différence. Preuve : `presence.test.ts`.
   - **lun-luxuria** : un `beat` qui reçoit 410 déclenche l'annonce (`started`, avec le réglage de l'accueil) ; au
     retour visible (`visibilitychange` vers `visible`), Luxuria envoie un `beat`, jamais un `started`. Une annonce en
     cours n'en lance pas une seconde : un 410, un retour visible et la reconnexion du flux qui tombent ensemble ne
     donnent qu'un `started`. Preuve : tests, dont deux retours visibles rapprochés avec une présence vivante (aucun
     `started`) et un 410 qui tombe pendant une annonce (un seul `started`).
   - Ordre de merge : compatible dans les deux sens ; lun-anima d'abord, conseillé.
3. Un écart de niveau `trivial` ou `standard` qui empêche une ligne de tenir se corrige dans ce chantier, avec son test.
   Un écart plus lourd, ou hors de ces lignes, devient une issue `inbox` et la ligne reste « écart en issue » **[choix
   Claude]**. Le périmètre ne grandit pas en cours de route au-delà de ces sept lignes.
4. `docs/README.md` à jour de ce qui change.
5. Barrières vertes dans chaque dépôt touché ; dans lun-luxuria, plus `voix/test_service.py`.

### Tâches

- [ ] Branche depuis `main`, PR en brouillon au premier push.
- [ ] Core jetable et satellite factice, avec les garde-fous ci-dessus ; Luxuria reliée ; Chrome.
- [ ] Lignes 1 à 6, une à une : verdict et preuve ; correctif et test si l'écart est dans le périmètre.
- [ ] #18 : tests d'abord ; le 410 dans lun-anima (`presence.ts`, `presence-routes.ts`), puis `src/page.ts`,
      `src/core.ts` et `src/session.svelte.ts` ; ligne 7.
- [ ] Arrêt du core jetable (seulement ses processus), relecture (agent reviewer), recette notée, PR prête.

## G. L'outillage de lun-docs

### Critères de fin

1. **#3** : `npm run sync:check` signale une copie orpheline, un fichier de `plugin/skills/*/references/` qui n'a plus de
   source dans `tools/standards-map.json`, et `npm run sync` la retire. Preuve : `tools/sync-standards.test.mjs`.
2. **#5** : `npm run check` signale une dérive entre `.github/pull_request_template.md` et
   `templates/project/.github/pull_request_template.md`. Preuve : `tools/check-repo.test.mjs`.
3. **#4** : le scan d'adresses voit aussi les noms en `.lan` et `.home.arpa`, et les IPv6 ULA (`fd` suivi de deux
   chiffres hexadécimaux puis `:`, avec au moins trois groupes). `.local` et `.internal` restent hors de la règle
   **[choix Claude]** : les fixtures et les plans s'en servent comme domaine d'exemple (`nas.local`, `acedia.local`),
   et `.internal` attrape des propriétés JavaScript. L'exclusion des fichiers de test s'étend de `*.test.mjs` à
   `*.test.*` et `*.spec.*`. Les CI de projet clonent `lun-docs` à chaque passage : avant le merge, le nouveau scan
   tourne sur un clone frais de `main` de chacun des six dépôts (`lun-acedia`, `lun-anima`, `lun-avaritia`,
   `lun-luxuria`, `website`, `lun-docs`), avec zéro erreur. Sinon la règle s'ajuste. Preuve : tests et sortie sur les
   six clones.
4. **#6** : le gabarit `templates/project/.claude/settings.json` couvre `git push origin HEAD:main`, et le gabarit dit,
   en une ligne de `CLAUDE.md` du gabarit ou de `standards/git.md`, que le hook de garde reste la barrière : les règles
   par préfixe ne voient pas toutes les formes. Preuve : `npm run check`.
5. Ce plan coché, avec les liens des PR, dans le dernier commit.
6. Barrières : `npm test`, `npm run check`, `npm run sync:check`.

### Tâches

- [ ] Branche depuis `main`, ce plan, PR en brouillon.
- [ ] #3, #5 : tests et outils (faits avant la relecture du plan ; les tests sont rejoués en échec sur le code d'avant).
- [ ] #4 : tests d'abord, scan des six clones frais, puis la règle.
- [ ] #6, relecture (agent reviewer), coches quand D est prêt, PR prête.

## E. Luxuria dans une fenêtre Tauri (préparé, pas lancé)

**Attend** : l'accord de CrOliX pour installer la chaîne Rust sur le laptop (`rustup`, cible MSVC ; Visual Studio 2022
et WebView2 sont déjà là). Sinon, le chantier se joue au desktop.

**Critères, tirés de la spec Luxuria (§4, §6.8, §9) et de `lun-luxuria/CLAUDE.md` :**

1. Démarrage sans console ; la scène s'ouvre sur le deuxième écran mémorisé ; une seule instance.
2. Le raccourci global passe de la scène au petit mode et retour, même fenêtre inactive, sans couper la voix.
3. La vignette du petit mode reste au premier plan.
4. Le dossier d'assets et son petit fichier de réglage remplacent les adresses d'images ; un fichier manquant donne le
   souffle.
5. `src/` ne change que dans `audio.ts`, le raccourci et la fenêtre ; la page Vite continue de marcher seule.
6. Le service voix se lance avec l'app ou se trouve déjà lancé ; l'origine `tauri://localhost` ou
   `http://tauri.localhost` est déjà acceptée.

Le plan détaillé (plugins, mesures, preuves) s'écrit au lancement du chantier, quand l'outillage est là : un plan écrit
sans pouvoir construire une fenêtre se tromperait sur ses détails.

## Hors périmètre

Tout ce qui s'entend (bouche et audio coupés ensemble, RVC, latence), lun-luxuria#6 et #7, la soirée réelle : au desktop.
lun-docs#41 (licences des dépôts publics : un choix de CrOliX). Le front d'Acedia et du core (cadrage design avec
CrOliX d'abord). La prod.
