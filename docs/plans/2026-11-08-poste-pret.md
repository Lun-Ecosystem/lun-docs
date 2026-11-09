# Le poste prêt pour la semaine. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** les trois bases copiées chaque nuit, une restauration écrite puis essayée, et rien qui force le terminal
pendant la semaine de rodage.

**Source :** [audit du 08/11](2026-11-08-audit-ecosysteme.md), Q6, § 7 et § 8.6 ;
[feuille de route](2026-11-07-feuille-de-route-mvp.md), chantier K.

**Livré :** lun-acedia#61 et lun-avaritia#29 (le code), lun-docs#111 puis lun-docs#112 (la procédure, reprise
après sa relecture). Reste : la restauration essayée sur le desktop (feuille de route, § 4, étape 5).

**Cadre :** aucun code avant la validation de ce plan par CrOliX. Niveau `standard`. *Show* pour le code, prouvé par
ses tests ; la restauration s'essaie sur le desktop (feuille de route, § 4). Trois PR, séparées de celles de J même
dans les mêmes dépôts, jamais empilées.

| Dépôt, branche | Issues | Niveau |
|---|---|---|
| `lun-acedia`, `feat/copie-de-nuit` | lun-acedia#57 | `standard` |
| `lun-avaritia`, `feat/copie-de-nuit` | lun-avaritia#22 | `standard` |
| `lun-docs`, `docs/restaurer-et-terminal` | lun-docs#106 | `standard` |

## Contraintes

- Le modèle est `backupDatabase` du core (`core/src/memory/backup.ts`) : `VACUUM INTO` vers un fichier temporaire,
  renommé, sept copies gardées. Recopié dans chaque satellite : pas de paquet commun pour vingt lignes.
- **[choix Claude]** Chaque satellite copie sa propre base : le core ne lit pas les fichiers d'un satellite, et sur le
  NAS chacun aura son volume.
- Une copie ratée ne coupe jamais le serveur, ni ne retarde son démarrage.

## Tâches

### lun-acedia, puis lun-avaritia, sous la même forme

1. - [x] `server/src/backup.ts` : `backupDatabase(db, path, now, keep = 7)`, copies nommées `acedia-AAAA-MM-JJ.db`
   (`avaritia-…` chez Avaritia), du nom de la base : une autre base ne fait pas tourner ses copies. Tests d'abord :
   copie lisible et complète, rotation à sept, fichier temporaire nettoyé, échec sans perte des copies précédentes.
2. - [x] La cadence, sans horloge nouvelle : au démarrage puis chaque heure, avec les `setInterval` d'une heure qui
   existent déjà dans `main.ts`, une copie si celle du jour manque. **[choix Claude]** Pas d'heure fixe : un poste
   éteint la nuit se rattrape dès qu'il revient.
3. - [x] Le dossier : `backups/` à côté de la base (`DB_PATH`), comme le core, donc sous `data/`, déjà hors de
   git ; dit dans le README.
4. - [x] Une copie ratée laisse une ligne au journal du serveur et se retente à l'heure suivante.

### lun-docs

5. - [x] `mise-en-service-desktop.md`, « Restaurer une copie » : arrêter le service, mettre la base de côté avec ses
   fichiers `-wal` et `-shm` (rien ne se supprime : la relecture de lun-docs#111 l'a montré), copier la copie à sa
   place, redémarrer, relier de nouveau un satellite. Une copie s'ouvre sans clé ; seuls ses secrets demandent la même
   (`ANIMA_SECRET_KEY`, `ACEDIA_SECRET_KEY`, `AVARITIA_SECRET_KEY`), à garder hors du dossier de service.
6. - [x] « Rien ne force le terminal pendant la semaine » : chaque cas et sa réponse, en place ou à mettre.
   - le jeton Google en Test, qui expire au septième jour : Production avant la semaine (B10) ;
   - un redémarrage ou une mise à jour de Windows : les services en tâches planifiées (G), constaté en B12 ;
   - un nouveau téléphone : l'ajout d'appareil depuis l'Atelier ;
   - un code d'appairage expiré : un nouveau code depuis l'écran du poste ;
   - la clé d'un fournisseur qui expire : son échéance déclarée, changée depuis l'écran.

## Preuves

- Les tests et barrières de chaque dépôt ; une copie faite par un serveur de démo, ouverte avec `node:sqlite`.
- Sur le desktop, à la session du § 4 de la feuille de route : la liste parcourue et une restauration essayée.
