# Voix de Luxuria : une vraie confiance et la conversion RVC en blocs. Plan

> **Pour les agents d'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** que la transcription de whisper-server rende une confiance réelle, mesurée sur des énoncés de geste
(Lun-Ecosystem/lun-luxuria#6). Que RVC convertisse en blocs de 0,5 s, avec le rendu retenu à l'écoute
(Lun-Ecosystem/lun-luxuria#7, première étape).

**Cadre :** [ADR 0011](../../adr/0011-chaine-vocale-mvp.md), spec Luxuria §6.2 et §6.5, rapport
`lun-luxuria/docs/essai-2026-11-07.md`. Niveau `critique`, à cause de #6 : une confiance fausse laisse un mot mal entendu
valider une carte.

**Dépôt :** `lun-luxuria` seul, branche `fix/voix-confiance-blocs`, une PR. Le core ne change pas : il applique déjà la
barre de 0,7 (`lun-anima/core/src/natsume/authorize.ts`).

**Le flux, plus tard.** Jouer dès le premier bloc gagnerait environ (blocs − 1) × 130 ms sur la première phrase, soit à
peu près 500 ms pour 2 s de parole. Mais la relecture du plan a montré qu'un flux touche à l'abandon des phrases, au délai
de 5 s, aux erreurs en cours de réponse, au proxy Vite et au CORS de Tauri. Ce chantier convertit donc en blocs et rend la
phrase entière. Le flux reste ouvert dans #7, et sa décision vient après le relevé du critère 5 et la mesure du §6.9.

## Critères de fin

1. Avec `--stt whisper-server:<url>`, `/stt` demande `verbose_json` sans horodatage par jeton, et rend la moyenne
   géométrique des probabilités des jetons de texte. Sans aucun jeton, la confiance vaut 0. La valeur fixe de 0,9
   disparaît. Preuve : `voix/test_service.py`, contre un faux whisper-server local.
2. Avec `--rvc`, `/tts` ajoute 50 ms de silence devant, convertit par blocs de 0,5 s (24 000 échantillons à 48 kHz) et
   ramène chaque bloc rendu à 24 000 échantillons. Il rend la longueur utile seulement, sans le remplissage du dernier
   bloc, avec un `Content-Length`. Le gain de sortie se règle par `--rvc-gain`, à 2,0 par défaut, borné à [-1, 1]. Un bloc
   en échec fait échouer la phrase (500), comme aujourd'hui. Preuve : `voix/test_service.py`, avec un faux RVC qui compte
   ses appels, rend une taille fausse, puis échoue.
3. Le client ne change pas. Preuve : `npm test` vert sans toucher à `src/`.
4. Sur le desktop, deux relevés séparés, ajoutés à `docs/essai-2026-11-07.md` sans nom de modèle de voix :
   - **Confiance**, par `/stt` sur des wav : oui, non, ok, envoie, valide, annule, dits proprement, marmonnés et dans
     le bruit, plus du silence. Pour chaque énoncé : texte, moyenne géométrique et minimum des probabilités. On compte
     les faux acceptés (texte faux à 0,7 ou plus) et les faux rejets (bon geste sous 0,7).
   - **Latence**, 20 tours dans Luxuria avec les mêmes phrases, spéculation coupée et silence de fin à 600 ms. On donne
     la médiane et le 95ᵉ centile du premier son, avec l'écart de méthode au banc : Luxuria part de son propre détecteur
     de fin de phrase et compte jusqu'à l'appel de lecture.
5. Le verrou de l'ADR 0011 (« pas de validation de vraie carte à la voix ») tient jusqu'à ce que CrOliX le lève, après
   le relevé de confiance. Rien ne le lève automatiquement.
6. Barrières vertes : `npm run format:check`, `lint`, `typecheck`, `test`, `build`, et `voix/test_service.py`.

**Hors périmètre :** le flux dès le premier bloc (#7, après le relevé), la réponse préparée du §6.9, lun-luxuria#5 et #8,
le CORS du service pour Tauri, une autre brique de transcription.

## Tâches

### 1. Confiance de whisper-server (`voix/service.py`)

- [x] Test d'abord : un faux whisper-server local renvoie un `verbose_json` à deux segments. Attendu : la moyenne
      géométrique des `probability` de `segments[].words[]`, à 1e-6 près, et 0 sans aucun mot. La requête porte
      `response_format=verbose_json` et `token_timestamps=false`.
- [x] `make_stt` : la confiance vient des probabilités des jetons, pas d'`avg_logprob`. whisper.cpp v1.9.5 divise
      celui-ci par un nombre de jetons qui compte aussi les jetons spéciaux, ce qui gonfle la confiance
      (`examples/server/server.cpp`, l. 1110 à 1150). Une probabilité nulle est bornée à 1e-6 avant le log. Commentaire
      d'une ligne : ce n'est pas la même définition que faster-whisper, qui compte aussi horodatages et fin de texte.

### 2. RVC en blocs (`voix/service.py`)

- [x] Test d'abord : un faux RVC compte ses appels et rend un bloc de taille fausse. Une phrase de 1,2 s à 48 kHz donne
      3 appels, et une sortie de (0,05 + 1,2) × 48 000 = 60 000 échantillons, gain appliqué et borné. Un faux RVC qui
      échoue au 2ᵉ bloc donne un 500, et la phrase suivante passe.
- [x] `make_rvc` : rééchantillonnage à 48 kHz, 2400 zéros devant, remplissage au multiple de 24 000, un appel
      `convert_chunk` par bloc sous le verrou, chaque sortie coupée ou complétée à 24 000, concaténation, coupe à la
      longueur utile, gain puis bornage.
- [x] `--rvc-gain` (2,0 par défaut, comme l'alpha et le banc) **[choix Claude]**. La docstring et l'aide de `main()`
      suivent.

### 3. Doc et preuve

- [x] `docs/README.md`, section du service voix : la confiance de whisper-server et sa différence avec faster-whisper,
      les blocs RVC, `--rvc-gain`. Dans le même commit que le code.
- [x] Sur le desktop : les deux relevés du critère 4. Le script de relevé de confiance reste hors dépôt, dans
      `luxuria-essai/banc/`. Faits le 10/11 : 3 faux acceptés et 4 faux rejets sur 21 énoncés ; premier son à 3 379 ms
      en médiane sur 20 tours, spéculation coupée. Le 95ᵉ centile manque, l'écran ne le rend pas.
- [ ] Dans #7 : un commentaire qui dit ce qui reste (le flux) et ce qu'en dit le relevé. Le reste est posté ; le relevé suivra B1.
- [x] PR avec `lun-livrer`, critères cochés et preuves (lun-luxuria#10, fusionnée le 07/11).
