# Le banc de présence, réduit : le délai par étape, les toux, les sorties, la CI. Plan

> **Réduit le 19/11 par le [recadrage du VIP](../specs/2026-11-19-recadrage-vip.md)** (§ 4, § 6.1, § 6.3, § 7) :
> « réduit à quatre ou cinq tâches, le délai par étape lu à la chaîne, les sons de toux posés, les résumés visibles,
> les tests du service de voix en CI. Le reste passe après le VIP. »
>
> **PR qui livre :** Lun-Ecosystem/lun-luxuria#105 (brouillon). Tâches 1 à 5 faites le 19/11, détail dans chaque tâche.
>
> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** lun-luxuria#104 (chapeau, `niveau:standard`) ; ce plan reprend #68, #75, #85 et la part de #101 sur
> les sons de toux. Le reste des issues du chapeau va dans « Reporté après le VIP ».
>
> **État : rédigé le 18/11, contesté et amendé le 18/11, réduit le 19/11, validé par CrOliX le 19/11 ; tâches 1 à 5
> faites le 19/11.** PR du plan : lun-docs#183.
>
> Code relu sur `main` de lun-luxuria (`1d07678`), par le graphe d'abord ; chaque ligne citée y a été relue. Le banc
> de sons (`banc-sons`, hors dépôt) lu par noms de dossiers et de fichiers seulement.

**But :** avant la semaine de rodage, la chaîne dit combien de temps prend chaque étape d'un tour, à côté du budget
de la veille et de la cible du VIP. Elle joue aussi les sept scénarios de toux. Les résumés du banc se lisent sous un
agent, et les tests du service de voix tournent en CI. Rien de ce que fait Luxuria ne change.

**Source :** le recadrage du 19/11, cité plus haut ; la cible du VIP, « 2,5 s en médiane sur le desktop actuel »
(recadrage, § 7, point 6 ; [ADR 0011](../../adr/0011-chaine-vocale-mvp.md), `:16`) ; le budget par étape de la veille
de CrOliX (`perplexity/lun-flux/05-instructions.md:60-67`, hors dépôt) et son « p50 < 1,5 s sur le PC » (`:76`) ;
lun-luxuria#104 ; le `CLAUDE.md` de Lun'Luxuria : « L'écoute se rejoue », « La latence se mesure sur la machine
réelle. Un chiffre pris ailleurs ne compte pas. », « Aucun son dans le dépôt » ; `standards/workflow.md:66-68` : « En
parallèle, seulement ce qui est indépendant (deux dépôts, deux tâches sans fichier commun) ».

**Critères de fin** de ce plan, chacun vérifiable par une commande :

1. **Le délai par étape** : `releve-chaine.md`, et `releve-taux.md` d'une suite répétée, finissent par une table
   « Budget » : pour chaque étape, la médiane et le 95e centile sur les parties jouées, à côté du budget de la veille
   et de la cible du VIP. C'est une mesure : elle ne fait jamais échouer. Tâche 3.
2. **Les sons de toux** : la chaîne joue les sept scénarios de toux depuis le dossier de référence. Un son de toux qui
   manque est dit « son manquant » dans le relevé, comme aujourd'hui. Tâche 4.
3. **Les sorties** : `npm run banc` et `npm run scenarios` montrent leur résumé sous un agent ; `npm run banc` saute
   `chaine/` et `scenarios/`. Tâche 1.
4. **La CI** : `voix/test_service.py` tourne en CI. Tâche 2.
5. **La chaîne** : une partie par scénario avec Hortense, lue selon « La règle de la chaîne ». Tâche 5.

Barrières à la fin : `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run scenarios`,
`npm run mutations` ; `npm run chaine` selon « La règle de la chaîne ».

| Dépôt, branche                         | Issue                         | Niveau     |
| -------------------------------------- | ----------------------------- | ---------- |
| `lun-luxuria`, `test/banc-de-presence` | lun-luxuria#104               | `standard` |
| `lun-docs`, `docs/banc-de-presence`    | lun-luxuria#104, pour ce plan | `trivial`  |

**Ce que la PR ferme :** #68, #75, #85. Elle laisse ouverts #104 (ses critères reportés), #101 (tout sauf les toux),
et les issues de « Reporté après le VIP ».

**Hors périmètre :**

- tout ce que liste « Reporté après le VIP » ;
- le comportement de la conversation : lun-luxuria#97 à #100, #102, #48, #63, et tout nouveau chantier sur les cas
  limites du tour de parole (recadrage, § 6.3) ;
- un échec sur un délai : la table « Budget » mesure, elle ne juge pas ;
- tout son dans le dépôt ;
- la fenêtre Tauri, l'IPC, et #60 (point (a)).

## La règle de la chaîne

La chaîne du 18/11 est la référence : `banc-sons/chaine/le-tour-1811/chaine/releve-chaine.md`, 14 scénarios joués,
tous tenus au niveau `tous`, 16 non joués. Avec une partie par scénario, une attente qui rate fait échouer son test
(`chaine.test.ts:827-829`). La barrière se lit sur le relevé, pas sur le code de sortie :

- **les 14 scénarios joués le 18/11** : aucun verdict `tous` ne change. Un changement bloque la PR ;
- **les scénarios jamais joués à la chaîne** (les sept de toux) : une attente `tous` qui rate s'écrit dans la tâche
  5, avec l'issue ouverte pour elle et la ligne du relevé. Elle ne bloque pas la PR. Elle ne devient pas un `connus` :
  au niveau exact, l'attente tient, et un `connus` qui tient n'est plus conforme (`src/presence/judge.ts:343-347`), ce
  qui casserait `npm test`.

## Le dossier du banc

- Le défaut `../banc-sons` se résout depuis le dossier de lancement (`chaine.test.ts:464`) : depuis un worktree sous
  `wt/`, il vise un dossier qui n'existe pas, comme le défaut de `CHAINE_TTS` (`:466-467`). Les commandes de ce plan
  règlent donc les deux.
- La chaîne du 18/11 a tourné avec `BANC_DIR` réglé sur `banc-sons/chaine/le-tour-1811` : son `chaine/sons/` tient
  `non.wav` et le cache `sapi/`, son `chaine/serveur/` le code et le journal.
- **Le `BANC_DIR` des parties de référence** : `banc-sons/chaine/banc-de-presence`. La tâche 4 le crée depuis le
  dossier du 18/11 et y pose les trois toux. Le serveur de la chaîne est lancé sur
  `banc-sons/chaine/banc-de-presence/chaine`, le même dossier que la chaîne lit : sinon `beforeAll` crée un dossier
  vide (`:564`) et échoue en lisant `serveur/code` (`:583`).

## Ce que le code fait aujourd'hui

Chemins de lun-luxuria, sur `main` (`1d07678`).

### Les délais d'un tour

- `delays` (`src/trace.ts:167-215`) donne, pour chaque tour de la trace : `attente_fin` (du dernier son de voix à la
  fin de phrase), `transcription` (de l'essai à sa transcription), `premiere_phrase` (de l'envoi à la première phrase
  reçue), `blanc_de_tour` (du dernier son de voix au premier son, la mesure de bout en bout de l'ADR 0011),
  `arret_coupure`, ce que le serveur dit de sa réponse (`file_serveur`, `premier_mot`, `poste`, `second_mot`,
  `:159-164`), et la durée de synthèse de chaque phrase (`synthese`).
- Chaque partie de la chaîne écrit ces délais dans `resultats.jsonl`, par tour (`src/presence/taux.ts:32`, `:80`).
- `releve-chaine.md` les montre par partie, tour par tour, au niveau exact et à la chaîne, avec leur écart
  (`src/presence/releve.ts:236-252`). Aucune médiane, aucune référence.
- `releve-taux.md`, écrit pour une suite répétée seulement (`chaine.test.ts:601`), donne par scénario la médiane, le
  95e centile, le min et le max de chaque délai, tour par tour (`taux.ts:301-322`), puis la dérive du premier passage
  au dernier, tous scénarios mêlés (`:350-374`). Aucune référence non plus.
- `taux.ts` a déjà `mediane` et `centile95` (`:146-152`, ce dernier à partir de vingt valeurs) et `delaisDe`
  (`:165-168`).
- `taux.test.ts:272-391` fixe `releveTaux` ligne à ligne : y ajouter une section changerait ce test.
- Ni le temps de Silero par trame, ni RVC n'ont de délai. La trace date la décision de voix et l'instant du son
  qu'elle juge (`voix`, champ `son`), sans en faire un délai.

### Ce que la chaîne du laptop peut mesurer, et ce qu'elle ne peut pas

Chaque étape du budget de la veille, le délai de la trace qui la mesure, et ce qu'il vaut à la chaîne du laptop :

- **Détection de voix**, < 30 ms : aucun délai ; non mesurée.
- **Fin de tour**, < 100 ms (repli : 700 ms de silence) : `attente_fin` ; réelle, Silero et la fin de phrase de la
  page.
- **Transcription**, < 300 ms : `transcription` ; réelle, mais faster-whisper `tiny` au processeur du laptop.
- **Première phrase du modèle**, < 700 ms : `premiere_phrase` et `premier_mot` ; le faux modèle, dont le premier mot
  est celui que le scénario lui donne.
- **Synthèse**, < 400 ms : `synthese 1` ; réelle, Piper au processeur du laptop.
- **Voix de Natsume (RVC)**, < 100 ms : aucun délai ; non mesurée, pas de RVC dans la chaîne.
- **Bout en bout**, 1,5 s (la veille) et 2,5 s (le VIP) : `blanc_de_tour` ; la somme, le faux modèle dedans.

À la chaîne du laptop, `file_serveur` et l'écart entre `premiere_phrase` et `premier_mot` (le transport) sont aussi
réels. Rien de cette table ne vaut pour le desktop : elle se compare d'une course à l'autre, sur un même poste. Le
desktop donne les vrais chiffres, avec le vrai modèle, whisper-server et RVC (feuille de route, § 4).

### Les sons de la chaîne

- Une parole entre parenthèses (une toux) lit toujours son fichier `sons/<nom>.wav`, rogné de ses bords puis coupé à
  sa durée et refusé plus court ; absent, la partie n'est pas jouée et le relevé dit « son manquant »
  (`src/presence/chaine/sons.ts:129-144`). Les silences entre deux quintes restent. Un bruit lit `bruit.wav` de même
  (`:170-174`).
- **Sept scénarios** demandent un son de toux ou de bruit : `reponse-vide-puis-toux`, `toux-courte`, `toux-parole`,
  `toux-reflexion`, `toux-verdict-tardif` (une parole `(toux)` ou `(toux courte)`), `toux-puis-parole`,
  `toux-puis-parole-tard` (un `bruits`). Le relevé du 18/11 les liste tous les sept en « son manquant ». Les scénarios
  supposent une voix continue d'au moins 384 ms (`toux-puis-parole.ts:11`) et une transcription vide.
- Le banc des gestes a des toux réelles : `gestes/prises/toux-longue-1.wav`, `-2.wav` (« toux d'au moins 450 ms »,
  `gestes/mots.json`), `toux-courte-1.wav`, `-2.wav` (« au moins 300 ms »). Ce que la détection en fait n'est pas
  vérifié.

### Les sorties, la CI

- `npm run banc` saute `gestes/` seul, au premier niveau (`src/listen/banc.test.ts:182-188`, test `:194-205`).
- `npm run banc` et `npm run scenarios` n'ont pas de `--reporter` (`package.json:21`, `:23`) ; `gestes` et `chaine`
  ont `--reporter=default` (`:22`, `:25`). Sous un agent, Vitest prend `minimal`, qui tait leurs `console.log`
  (`banc.test.ts:275`, `:356`, `scenarios.test.ts:137`). Ni `banc` ni `scenarios` ne tournent en CI.
- La CI ne lance pas Python (`.github/workflows/ci.yml`). `voix/test_service.py` dit sa commande en tête (`:1-5`) et
  finit par `print("ok")` ; `voix/service.py` demande Python 3.12 ou plus (`:2`).
- Le `CLAUDE.md` de Lun'Luxuria fait 98 lignes sur 100 : chaque ligne ajoutée en remplace une.

## Ce que les issues disent et que le code contredit

- **#85** nomme `src/listen/banc.ts` : ce fichier n'existe pas. Le saut est dans `src/listen/banc.test.ts:182-188`.
- **#75** cite `banc.test.ts:256` et `:337`, aujourd'hui `:275` et `:356`. Sa raison de ne pas mettre
  `--reporter=default`, « garder le reporter `github-actions` en CI », ne tient pas : ni `banc` ni `scenarios` ne
  tournent en CI, et les mutations lancent Vitest sans le script (`tools/mutations.mjs:47-52`).
- **#101** et le plan « le tour » (tâche 9) comptent six scénarios de toux non joués : le code et le relevé du 18/11
  en donnent sept.

## Les points à trancher par CrOliX

### (a) #60 : le déroulé depuis la fenêtre

**[avis] À la session du desktop (§ 4).** L'export y demande une boîte d'enregistrement côté Rust, dans le chemin que
lun-luxuria#87 vient de borner (aucune permission `dialog:` pour la page). La chaîne n'en a pas besoin : elle exporte
par le bouton, dans Chrome (`chaine.test.ts:938-946`). #60 reste ouverte.

### (b) D'où viennent les trois sons de toux

**[avis] Des prises qui existent déjà, passées d'abord au banc, puis copiées dans le dossier de référence.**
`toux.wav` depuis `gestes/prises/toux-longue-1.wav`, `toux-courte.wav` depuis `toux-courte-1.wav`, `bruit.wav` depuis
`toux-longue-2.wav` : les deux `bruits` des scénarios sont une toux de 450 ms (`toux-puis-parole.ts:26`). Ce sont de
vraies toux de CrOliX ; elles restent hors dépôt. Une prise qui ne tient pas cède la place à l'autre prise du même
mot. L'autre voie : une prise neuve pour chacun.

### (c) #75 : le résumé sous un agent

**[avis] `--reporter=default` dans les deux scripts**, comme `chaine` et `gestes`. L'autre voie, un reporter choisi
selon l'environnement dans `vite.config.ts`, ajoute une règle pour un cas que la CI ne connaît pas.

## Les tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests, les voit rater sur `main` et colle le message d'échec
dans la tâche ; puis **dev-luxuria** écrit le code dans le worktree qu'on lui donne. Les tâches 4 et 5 sont au
testeur seul. Barrières de chaque tâche de code, une commande par ligne :

```
npm test
npm run lint
npm run typecheck
npm run format:check
```

**L'ordre.** Les tâches 1, 2, 3 et 4 partent ensemble, sans fichier commun : la 1 touche `package.json`,
`banc.test.ts` et le `CLAUDE.md` ; la 2, `ci.yml` ; la 3, `taux.ts`, `taux.test.ts` et `chaine.test.ts` ; la 4,
`banc-sons` seul. Chacune dans son worktree, parti de `test/banc-de-presence`. La tâche 5 vient après les quatre.
Une seule PR.

### Tâche 1. Les sorties du banc (#85, #75)

- [x] **Faite, relue, approuvée.** `npm run banc` saute `gestes/`, `chaine/` et `scenarios/` au premier niveau, et son
  résumé s'affiche sous un agent ; un test fixe que seul le premier niveau est sauté. Sur les 163 fichiers du banc :
  le niveau 159 justes, le modèle 159 justes.
- **Fichiers** : `src/listen/banc.test.ts` (`:182-188`, test `:194-205`), `package.json` (`:21`, `:23`), le
  `CLAUDE.md` de Lun'Luxuria (« L'écoute se rejoue », et la phrase « Son `--reporter=default` est voulu »).
- **Ce qui change** : au premier niveau, `chaine` et `scenarios` sont sautés comme `gestes` ; le commentaire `:182`
  dit pourquoi (les sons et les sorties d'autres bancs). `--reporter=default` au bout des scripts `banc` et
  `scenarios`. Le `CLAUDE.md` reste sous 100 lignes : les deux phrases sont récrites, aucune n'est ajoutée.
- **Test** : celui de `:194` gagne `chaine/sons/x.wav` et `scenarios/y.wav` dans son dossier, et attend toujours
  `['a.wav', 'sous/b.wav']`. Sur `main`, il rate.
- **Preuve**, depuis un agent : `npm test -- src/listen/banc.test.ts` ; `npm run scenarios` affiche « Relevé et
  déroulés écrits dans … » ; `npm run banc` affiche les cinq premières lignes du relevé, ou « Pas de dossier
  d'enregistrements ».
- **Exclu** : `vite.config.ts` ; tout autre dossier sauté.

### Tâche 2. `voix/test_service.py` en CI (#68)

- [x] **Faite, relue, approuvée.** Le job `voix` est vert sous Ubuntu sur lun-luxuria#105 (24 s) ; la même commande
  passe sous Windows.
- **Fichiers** : `.github/workflows/ci.yml` (un job neuf, `voix`, sur `ubuntu-latest`).
- **Ce qui change** : le job installe `uv` par l'action officielle d'Astral, à une version fixée, puis lance
  `uv run --python 3.12 --with numpy --with httpx --with soundfile python voix/test_service.py`.
- **Preuve** : en local, la même commande affiche `ok`, sous Windows. Sous Linux, la seule preuve est le job vert sur
  la PR.
- **Exclu** : faster-whisper et Piper (le test ne les charge pas) ; Windows en CI ; un `pyproject.toml`.

### Tâche 3. Le délai par étape, à côté du budget (le cœur du plan)

- [x] **Faite, relue.** Le relecteur a demandé de ne pas publier un commit intermédiaire qui portait un nom
  d'instance dans un test : la tâche est entrée dans la branche en un seul commit. Limite connue : les tours avec et
  sans envoi à l'essai sont comptés ensemble, et le résultat écrit ne garde pas cette distinction.
- **Fichiers** : `src/presence/taux.ts` (une fonction neuve, `releveBudget`, à côté de `releveTaux`),
  `src/presence/taux.test.ts`, `src/presence/chaine.test.ts` (`afterAll`, `:595-604`).
- **Ce qui change** :
  - `releveBudget(lignes)` rend une section « Budget » en Markdown, depuis les lignes de `resultats.jsonl` seules.
    Une ligne par étape et par voix, sur tous les tours de toutes les parties jouées : l'étape, son délai, la médiane,
    le 95e centile (`centile95`, à partir de vingt valeurs), le nombre de valeurs, le budget de la veille, la cible du
    VIP. Les étapes et leurs références sont celles de la table « Ce que la chaîne du laptop peut mesurer » ; la
    synthèse prend `synthese 1`, la première phrase, celle qui fait attendre. Une étape sans délai (la détection,
    RVC) a sa ligne, « non mesurée ». Sous la table, une phrase : mesure seulement ; sur le laptop et avec le faux
    modèle, ces chiffres ne valent que comparés à une autre course du même poste.
  - Les références vivent dans une constante de `taux.ts`, avec leur source en commentaire : « le budget de la
    veille » et l'ADR 0011 de lun-docs, sans chemin hors dépôt (Lun'Luxuria est public).
  - `afterAll` ajoute la section au bout de `releve-chaine.md`, toujours, et de `releve-taux.md` quand il l'écrit.
    `releveTaux` ne change pas : son test ligne à ligne (`taux.test.ts:272-391`) tient.
- **Tests** : `taux.test.ts`, sur des lignes écrites à la main : deux parties, deux voix, un tour avec `essai` et un
  sans ; la médiane par étape et par voix ; « non mesurée » pour la détection ; une partie non jouée (`raison`) ne
  compte pas ; pas de 95e centile sous vingt valeurs. Sur `main`, la fonction n'existe pas.
- **Exclu** : un nouveau délai dans `src/trace.ts` (la détection, RVC) ; tout échec sur un délai ; séparer les tours
  à l'essai des autres (`aLEssai`) : un `shortcut:` le dit, à faire si la table du desktop les montre différents.

### Tâche 4. Les sons de toux au banc (point (b) ; testeur, hors dépôt)

Sous PowerShell, une commande par ligne, depuis `banc-sons`, après l'accord de CrOliX sur (b).

- [x] **Faite en partie, par décision de CrOliX le 19/11.** Quatre prises réelles passées au banc : les deux courtes
  conviennent (coupées à 300 ms, aucune voix tenue) ; aucune longue ne convient pour `toux.wav` ni `bruit.wav` (dans
  les 450 premières ms jouées, la détection n'y voit que 0 à 96 ms de voix d'affilée, là où la voix tenue en demande
  environ 400). Seul `toux-courte.wav` est posé dans le dossier de référence. Détail dans
  Lun-Ecosystem/lun-luxuria#101.
- [x] **D'abord ce que la détection fait des prises**, sur un dossier temporaire :

  ```powershell
  New-Item -ItemType Directory -Force essai-toux
  Copy-Item gestes\prises\toux-longue-1.wav essai-toux\toux.wav
  Copy-Item gestes\prises\toux-courte-1.wav essai-toux\toux-courte.wav
  Copy-Item gestes\prises\toux-longue-2.wav essai-toux\bruit.wav
  ```

  Puis, depuis lun-luxuria, `BANC_DIR` réglé sur ce dossier, `npm run banc`. `toux` et `bruit` doivent faire une
  tenue (au moins 384 ms de voix continue), `toux-courte` non, comme leurs scénarios le supposent. Une prise qui ne
  tient pas : l'autre prise du même mot. Le dossier temporaire est retiré ensuite.
- [x] **Le dossier de référence** (`toux-courte.wav` seul, voir plus haut), depuis celui du 18/11, puis les trois sons retenus :

  ```powershell
  New-Item -ItemType Directory -Force chaine\banc-de-presence\chaine
  Copy-Item -Recurse chaine\le-tour-1811\chaine\sons chaine\banc-de-presence\chaine\sons
  Copy-Item gestes\prises\toux-longue-1.wav chaine\banc-de-presence\chaine\sons\toux.wav
  Copy-Item gestes\prises\toux-courte-1.wav chaine\banc-de-presence\chaine\sons\toux-courte.wav
  Copy-Item gestes\prises\toux-longue-2.wav chaine\banc-de-presence\chaine\sons\bruit.wav
  ```

- **Rend** : ce que `npm run banc` a trouvé pour chaque prise, et les prises retenues.
- **Exclu** : tout son dans le dépôt ; une prise neuve ; un code qui refuse un son posé manquant (« Reporté »).

### Tâche 5. La course de la chaîne, et la fin (testeur, après les tâches 1 à 4)

- [x] **La partie complète** : le serveur de la chaîne lancé sur `banc-sons/chaine/banc-de-presence/chaine`, puis,
  depuis le worktree de la PR, une commande par ligne :

  ```powershell
  $env:BANC_DIR = '<banc-sons>\chaine\banc-de-presence'
  $env:CHAINE_TTS = 'piper:<piper>\fr_FR-siwis-medium.onnx'
  npm run chaine
  Remove-Item Env:CHAINE_TTS
  Remove-Item Env:BANC_DIR
  ```

- **Lue** selon « La règle de la chaîne » ; les sept scénarios de toux joués, ou leur raison.
- **Rend**, ici : la table « Budget » de `releve-chaine.md`, recopiée telle quelle, avec la date et le poste ; chaque
  attente neuve qui rate, avec son issue.

  **Course du 19/11**, sur le laptop : un seul tirage, voix de synthèse, une partie par scénario. 15 scénarios joués
  (les 14 du 18/11 et `toux-courte`), 15 non joués dont 6 « son manquant » (les toux longues et le bruit). Attentes :
  51 tenues, 0 ratée, 1 non jouée. Les 14 scénarios du 18/11 ne changent aucun verdict `tous`.
  `toux-courte / verdict-bruit` sort `non_jouee` (source `ecoute`) : écrit dans lun-luxuria#101, ne bloque pas, par
  « La règle de la chaîne ». Au niveau exact, deux lignes bougent d'une milliseconde autour d'une borne
  (`faire-taire / sortie-arretee` passe à tenue ; `non-court / sortie-arretee` passe hors bornes, 725 pour
  [692, 724]) : un seul tirage, à surveiller.

  **Table « Budget »** (valeurs en millisecondes) :

  | Étape | Délai | Voix | Médiane | 95e centile | Valeurs | Budget | Cible du VIP |
  |---|---|---|---|---|---|---|---|
  | Détection de voix |  |  | non mesurée |  | 0 | < 30 ms |  |
  | Fin de tour | attente_fin | hortense | 701 | 711 | 24 | < 100 ms |  |
  | Transcription | transcription | hortense | 326 | 709 | 24 | < 300 ms |  |
  | Première phrase du modèle | premiere_phrase | hortense | 425 | 733 | 23 | < 700 ms |  |
  | Synthèse | synthese 1 | hortense | 86 | 2020 | 23 | < 400 ms |  |
  | Sa voix (RVC) |  |  | non mesurée |  | 0 | < 100 ms |  |
  | Bout en bout | blanc_de_tour | hortense | 1007 | 3299 | 21 | 1,5 s | 2,5 s |

  C'est le laptop, avec un faux modèle dont le premier mot est fixé par le scénario et sans conversion de voix : ces
  chiffres ne valent que comparés à une autre course du même poste, et ne disent rien de la cible du VIP, qui se
  mesure sur le desktop. Le 95e centile de la synthèse (2 020 ms pour 86 de médiane) n'est pas expliqué.
- [ ] La relecture du diff entier (reviewer), contre ce plan et ses critères.
- [ ] Les issues : #68, #75, #85 fermées avec leur preuve ; #101 reçoit le relevé des toux ; #104 suit « Reporté après
  le VIP ».

## Risques

- **Les toux de CrOliX ne tiennent pas comme les scénarios le supposent.** `coupe` garde les premières ms après le
  rognage des bords seulement (`sons.ts:130-134`) : les silences entre quintes restent. Parade : la tâche 4 passe les
  prises au banc avant de les poser ; sinon une prise neuve.
- **Les scénarios de toux rateront peut-être à la chaîne.** Ils n'y ont jamais été joués ; `toux-puis-parole` a
  108 ms de marge au niveau exact, contre 43 à 82 ms de retard des tenues à la chaîne le 12/11 (plan « le tour »,
  tâche 4). Parade : « La règle de la chaîne », une issue par attente qui rate, sans correction ici.
- **La première chaîne avec les toux exerce `modele.parle` pour la première fois** : `reponse-vide-puis-toux`,
  `toux-puis-parole`, `toux-puis-parole-tard` et `toux-verdict-tardif` en ont une. Un refus du serveur fait échouer la
  partie (`chaine.test.ts:889-890`). Parade : la même règle.
- **Lire la table « Budget » comme un verdict sur le VIP.** Le faux modèle et `tiny` faussent le bout en bout. Parade :
  la phrase sous la table, et la colonne du nombre de valeurs ; la vraie lecture est au desktop.
- **La CI de Python** : `soundfile` demande `libsndfile`, que sa roue Linux embarque d'après sa documentation, non
  vérifié ici. Si le job rate pour cela, une ligne `apt-get`.

## Limites

- Non vérifié : ce que la détection fait des prises de toux (tâche 4) ; que le test Python passe sous Linux (la CI
  seule le dira).
- Les mesures de ce plan se prennent sur le laptop : aucune ne vaut pour la latence du desktop.

## Reporté après le VIP

Non fait par ce chantier : l'export du déroulé depuis la fenêtre (lun-luxuria#60), à la session du desktop ; et tout ce
que liste cette section.

Retiré par le recadrage (§ 6.3). Chaque point garde son issue ; il revient tel que le plan du 18/11 l'avait écrit
(`2eeb203`, sur cette branche).

Par tâche du plan du 18/11, ce qu'elle faisait, et son issue (lun-luxuria) :

- **2** : les mutations lisent `verdicts.json` (#67).
- **3** : les fausses briques `syntheseMsPar`, `leve`, `fin` ; Q7, I12, Q8 en scénarios ; le commentaire du numéro
  au refus (#101, #81).
- **4** : l'absence au joueur ; l'urgence pendant un son (#101).
- **5** : `auPlus` ; `hesite-puis-demande` sans fenêtre fixe (#74).
- **7** : le retrait de `fins.length < plan.poses.length` (#73).
- **8** : les contrôles de `BANC_DIR` et de `CHAINE_TTS` ; la section « La chaîne » de `docs/README.md`, avec
  l'interface du serveur compatible et la recette « vu rater sur `main` » (#101, #79, #81).
- **9** : `Parole.pose`, un son posé manquant refusé ; deux attentes `coupure_recue` et les commentaires de #70
  (#81, #70).
- **10** : l'invariant tenu ou non ; la durée de `npm test` (#101, #81).
- **12** : le témoin Chromium ; la ligne de base sur trente parties ; les fenêtres proches d'un bord (#69, #101).

Ce qui reste de ce plan après le VIP : les points (c), (e) et (f) du 18/11 se rouvrent avec leur tâche.

**Les critères du chapeau lun-luxuria#104 que ce plan ne tient plus :**

- le critère 1, pour sa seconde moitié : « quand un son posé manque, elle le dit ou refuse de jouer ». Une toux
  manquante est dite ; un son posé à la main (le « non ») passe encore à la synthèse sans rien dire ;
- le critère 2, `CHAINE_TTS` (seules les commandes de ce plan le règlent) ;
- le critère 3, les fausses briques ;
- le critère 4, les scénarios manquants ;
- le critère 5, le juge, #70 et la ligne de base ;
- le critère 6, le lanceur ;
- le critère 7, pour les mutations en JSON ;
- le critère 9, le témoin Chromium ;
- le critère 10, l'outillage de #81 ;
- le critère 11, la doc du serveur compatible.

Le critère 12 (#60) reste tranché par le point (a).

## Contestation du 18/11

Le plan-challenger a fait dix-neuf objections au plan du 18/11, et une sur le critère 12. Toutes ont été retenues,
aucune réfutée. La réduction du 19/11 en rend une partie sans objet.

1. La barrière finale se contredisait : **intégrée**, « La règle de la chaîne ».
2. Le dossier du banc : **intégrée**, « Le dossier du banc » et la tâche 4 ; les contrôles de la tâche 8 du 18/11,
   **sans objet** (reportés), les commandes de la tâche 5 règlent `BANC_DIR`.
3. Le parallélisme partageait des fichiers : **intégrée**, « L'ordre » (quatre tâches sans fichier commun).
4. Le test des neuf refusés de `pourquoiPas` : **sans objet** (tâches 3 et 4 du 18/11 reportées).
5. L'urgence à la chaîne : **sans objet** (reportée).
6. Le retrait de `fins.length` : **sans objet** (reporté).
7. Les attentes `coupure_recue` de #70 : **sans objet** (reportées).
8. Les toux d'abord au banc : **intégrée**, tâche 4.
9. `tools/sur-main.mjs` : **intégrée** le 18/11 (l'outil retiré) ; la recette écrite, **sans objet** (reportée).
10. L'invariant et la durée de `npm test` : **sans objet** (reportés).
11. `auPlus` avec une attente tenue : **sans objet** (reporté).
12. L'absence copiée de la session : **sans objet** (reportée).
13. `syntheseMsPar` sans utilisateur : **sans objet** (reporté).
14. Le contrôle de `CHAINE_TTS` et l'interface du serveur : **sans objet** (reportés).
15. Python 3.12 : **intégrée**, tâche 2.
16. L'instant de `getUserMedia` : **sans objet** (le témoin, reporté).
17. Les mutations et `modele.parle` : **intégrée** pour `modele.parle` (Risques) ; la bascule d'une mutation sur cinq
    scénarios de plus, **sans objet** (aucun scénario neuf).
18. Le nombre de tâches : **intégrée**, cinq tâches.
19. Le commentaire du numéro au refus : **sans objet** (reporté avec la tâche 3 du 18/11).

Critère 12 : **intégrée**, une décision de CrOliX, point (a).
