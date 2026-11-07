# Le micro tenu : sans les entrées périmées du registre. Plan

> **Pour les agents d'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** qu'une entrée ancienne du registre Windows ne rende plus Luxuria « occupée » en permanence
(Lun-Ecosystem/lun-luxuria#5). `GET /micro` (`voix/service.py`, `apps_on_microphone`) compte comme micro tenu toute
entrée dont `LastUsedTimeStart` n'est pas nul et `LastUsedTimeStop` vaut 0. Sur le desktop, Discord arrêté laissait des
entrées de février et de juillet dans cet état.

**Cadre :** recette du desktop du 07/11 (`luxuria-essai/RECETTE.md`, hors dépôt), écart n° 2. Niveau `standard`, posé
au tri du 07/11 (lun-docs#73). Sur le laptop, aucune entrée n'est dans cet état (relevé du 07/11, 25 entrées, toutes
fermées) : la logique se prouve par entrées factices, la lecture réelle au desktop.

**Dépôt :** `lun-luxuria` seul, branche `fix/micro-entrees-perimees`, une PR. Le client ne change pas.

## Critères de fin

1. Une entrée ouverte ne compte comme micro tenu que si son début date de moins de 12 h **[choix Claude]**. Le début
   est un FILETIME en UTC (intervalles de 100 ns depuis 1601), comparé à `time.time()` : pas d'heure locale, pas de
   piège d'heure d'été. Preuve : `voix/test_service.py`, sur une fonction pure qui reçoit les entrées déjà lues des
   deux ruches, `(nom, début)`, et l'heure, avec une vraie valeur FILETIME.
2. Le nom rendu garde sa casse et sa forme d'aujourd'hui (`Discord.exe`, le dernier morceau après `#`), pour que les
   applis ignorées des Réglages marchent comme avant. Preuve : même test, avec un chemin qui contient lui-même `#`.
3. Sans Windows (`winreg` absent), `/micro` rend toujours une liste vide. Preuve : même test.
4. `docs/README.md`, section du service voix : la règle et ce qu'elle laisse passer. Dans le même commit.
5. Barrières vertes : `npm run format:check`, `lint`, `typecheck`, `test`, `build`, et `voix/test_service.py`.
6. **Au desktop, après le merge** : Discord arrêté, `/micro` rend `[]`. Case laissée vide dans la PR et notée dans la
   recette.

**Ce que la règle laisse passer, écrit dans la doc et en `shortcut:` dans le code :** une entrée périmée de moins de
12 h (un plantage pendant un appel) compte encore, au plus 12 h ; un appel de plus de 12 h ne compte plus. Les applis
ignorées des Réglages restent le recours.

**Hors périmètre :** la liste des programmes (`tasklist` : 380 ms par appel toutes les 3 s, encodage, noms tronqués), et
la date de démarrage du programme qui tourne (une entrée plus ancienne que lui est périmée) : à reprendre seulement si le
desktop montre le cas du plantage récent. Le démarrage de Windows (le démarrage rapide le rend très ancien : 554 h sur
le laptop). Le nettoyage du registre (une modification système, qui revient à CrOliX). Le client.

## Décision à valider

L'âge seul, à 12 h **[choix Claude]**. Il règle le cas observé sans sous-processus. La double règle (âge et programme
qui tourne) coûte un `tasklist` toutes les 3 s pour un cas que rien n'a encore montré.

## Tâches

- [ ] Test d'abord, `voix/test_service.py` : entrée ouverte récente (tenue), ouverte de 13 h (libre), fermée (libre),
      une ruche et l'autre fusionnées, casse et `#` du nom, conversion FILETIME sur une valeur réelle, `winreg` absent.
- [ ] `apps_on_microphone` : la lecture du registre rend `(nom, début)` des entrées ouvertes ; une fonction pure garde
      celles de moins de 12 h. Commentaire d'une ligne pour FILETIME, `shortcut:` pour la limite.
- [ ] `docs/README.md`.
- [ ] Relecture (agent reviewer), PR avec `lun-livrer`, critères cochés et preuves, critère 6 vide ; ligne dans la
      recette.
