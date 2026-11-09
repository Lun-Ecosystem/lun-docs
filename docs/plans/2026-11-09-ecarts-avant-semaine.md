# Les écarts avant la semaine. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** rien de ce que la semaine de rodage juge ne dit faux. Les écrans qui mentent encore sur une pause, une clé
ou un plafond ; une copie de base qui saute ou rate sans que personne ne le voie ; un test qui rougit au hasard.

**Source :** les issues `inbox` vues pendant les chantiers I, J et K ; proposition de Claude du 09/11, validée par
CrOliX ; [feuille de route](2026-11-07-feuille-de-route-mvp.md), chantier O.

**Livré :** lun-anima#91, lun-acedia#63 et lun-avaritia#30, le 09/11.

**Cadre :** aucun code avant la validation de ce plan par CrOliX. Niveau `standard`. *Show* : tout se prouve sur le
laptop, sur des bases de démo ou un core jetable. Une PR par dépôt ; elles ne dépendent pas l'une de l'autre, ni de
celles de L et M.

| Dépôt, branche | Issues | Niveau |
|---|---|---|
| `lun-anima`, `fix/ecarts-avant-semaine` | lun-anima#80, #84, #85, #86, #87, #89 ; lun-docs#110 pour le core | `standard` |
| `lun-acedia`, `fix/ecarts-avant-semaine` | lun-acedia#60, #58 ; lun-docs#110 pour Acedia | `standard` |
| `lun-avaritia`, `fix/ecarts-avant-semaine` | lun-avaritia#25 à #28, #23 ; lun-docs#110 pour Avaritia | `standard` |

## Le tri

Une issue entre ici si la semaine peut la rencontrer : une pause, une clé refusée, un plafond, une copie ratée, une
recherche au Journal. Celles qui ne se voient qu'à l'installation ou après une restauration restent en `inbox`,
jusqu'après le MVP (en fin de plan). lun-avaritia#28, lun-anima#89 et les deux tests instables ne servent pas la
semaine, mais coûtent peu et touchent les mêmes fichiers : elles suivent.

## Contraintes

- Un test d'abord pour chaque comportement changé. Les barrières de chaque dépôt restent vertes.
- Aucun changement du contrat entre le core et ses satellites : un événement porte déjà un `type` libre
  (`contrat-satellite.md`), et la santé d'un satellite ne connaît que `ok`, `degraded` et `paused`.
- Aucun changement du kit : les fronts des satellites ne gagnent ni ligne ni carte, et rien ne croise le chantier M.
- La règle de la pause, écrite partout dans l'écosystème : une pause arrête l'automatique, pas ce qui est demandé à
  la main (spec J1 d'Acedia, spec de son agent, contrat).
- Textes de l'écran en français, et aucun « core » chez un satellite.

## Tâches

### Les copies ratées, au Journal du core (lun-docs#110)

Aucun écran ne lit la santé du core (`GET /api/health` n'est lue que par les tests) : sa copie ratée ne se voit nulle
part, pas plus que celle d'un satellite. Le chemin existe déjà : le core porte à son Journal tout événement qui n'est
pas `log`, le sien comme celui d'un satellite, et pousse au téléphone ceux en `normal`.

1. - [x] Dans chaque dépôt, une copie ratée émet un événement `backup.failed`, une fois par jour au plus, avec la
   raison. **[choix Claude]** En importance `normal` : un échec de copie est rare, et la semaine ne doit pas le cacher ;
   il arrive au Journal et au téléphone. Le core par `emitCoreEvent`, sur le modèle de `push.down`. Les satellites par
   leur `emitEvent`, dans le `catch` de `backupIfMissing`. À vérifier d'abord : un satellite en pause locale envoie-t-il
   encore ses événements ? Sinon, son échec arrive à la reprise. Tests dans chaque dépôt : un échec émet, un deuxième le
   même jour n'émet pas, une copie réussie ne dit rien.

### lun-anima

2. - [x] **La copie du core, sous la forme de celles des satellites** (lun-anima#86, #87 ; le code de lun-acedia#61) :
   - une copie au démarrage, puis chaque heure si celle du jour manque, détachée de la veille : une pause ne l'arrête
     plus. La copie du démarrage précède le premier passage du moteur (à 60 s) : une veille rattrapée au redémarrage
     (B12) suit toujours une copie. La première copie du jour tombe à la première heure après minuit, donc avant la
     veille de 5 h si le poste est allumé. « Lancer la veille » à la main ne copie plus ;
   - le nom vient du fichier de la base, et la rotation ne compte que ses propres copies. La base par défaut reste
     `data/anima.db` : les copies gardent leur nom `anima-AAAA-MM-JJ.db` ;
   - un ancien fichier non retiré laisse sa propre ligne au journal du serveur, « Ancienne copie non retirée », et se
     retente à la copie suivante ;
   - la santé `sauvegarde` reste : une copie ratée la pose, la suivante réussie la lève, un retrait raté ne la pose
     pas. Son test est gardé ;
   - tests repris des satellites : copie lisible et complète, rotation à sept, autre base dans le même dossier,
     fichier tenu ouvert.
3. - [x] **Un passage sauté ne s'affiche plus « faite »** (lun-anima#80). Le type `Run` de `Routines.svelte` connaît
   `skipped`, et `result()` dit `sautée, <raison>`, comme le Journal : « en pause » ou « sans rattrapage ». Test pour
   chacune.
4. - [x] **La lettre du matin dit le contexte du jour manqué** (lun-anima#85). Quand `composeWarm` rend `failed`
   alors qu'un fournisseur est en service, la routine reste `ok`, car la lettre est écrite. **[choix Claude]** Elle
   porte la raison « sans le contexte du jour ». L'Atelier, le Journal et la Constellation l'affichent comme « sans le
   modèle », car J les a fait parler tous les trois. Tests : l'échec avec un fournisseur, et rien de changé sans
   fournisseur. La capture passe par une clé fausse ou un modèle sans prix, car une base sans clé donne « sans le
   modèle ».
5. - [x] **La recherche du Journal trouve une exécution en échec par « échec »** (lun-anima#84). Test.
6. - [x] **Le README** (lun-anima#89) : la cadence de la tâche 2 ; une copie ratée se lit au Journal, et au journal du
   serveur ; la restauration renvoie à la page de mise en service de lun-docs, comme les README d'Acedia et
   d'Avaritia.

### lun-acedia

7. - [x] **La barre et Réglages ne disent plus « Tri en pause » pour la clé de l'agent** (lun-acedia#60). Dans la barre
   (`app/src/shell/status.ts`, `problem`) comme dans la bannière de Réglages (`views/src/lib/settings/Settings.svelte`),
   seule la clé du fournisseur du tri compte (`getModelChoice()`). La clé refusée de l'agent se dit dans Réglages, sur
   sa ligne, avec le nom réglé de l'agent ou « l'agent » s'il n'en a pas. Tests dans l'app et dans le paquet de vues :
   la clé de l'agent refusée, le tri actif. La démo refuse la clé du tri : ce cas-là se prouve par les tests.
8. - [x] **Le test « rejects a tampered blob » n'échoue plus au hasard** (lun-acedia#58). Le caractère altéré est
   toujours remplacé par un autre que lui-même, et le test le vérifie : la preuve tient en un passage.

### lun-avaritia

9. - [x] **Une note ou un dépôt pendant une pause** (lun-avaritia#26). **[choix Claude]** Ils passent : ils sont
   demandés à la main, et la règle de l'écosystème laisse passer ce qui est demandé. Ce qui change, ce sont les mots :
   en pause, la carte dit que les lots attendent et que les dépôts passent, au lieu de « Traitement en pause ». Tests :
   un dépôt pendant une pause locale puis pendant une pause du core, traité ; la carte dans les deux cas.
10. - [x] **La barre relit la santé** (lun-avaritia#25) : `readHealth()` dans le minuteur de 30 s, à côté des compteurs
    et des clés. Test avec le faux minuteur de `App.test.ts` : une pause posée pendant la session se lit sans
    recharger.
11. - [x] **Le plafond atteint se dit, et seulement lui** (lun-avaritia#27) :
    - la carte passe à « Plafond atteint » quand la dépense du mois atteint le plafond, avec les mots du Tableau ;
      la pause, puis le service dégradé, passent avant elle ;
    - la bannière du Tableau, « Plafond de coût atteint », ne compte plus que les lots gardés pour la raison
      `cost-cap`, et non ceux gardés sans fournisseur ou sur une panne ;
    - tests : le plafond, une panne de fournisseur qui ne dit pas « plafond ».
12. - [x] **Les réponses 409 et 503 disent vrai** (lun-avaritia#28) :
    - sans aucune clé, la réponse dit d'ajouter une clé dans Réglages, et non de choisir un modèle, comme la barre
      depuis lun-avaritia#24. `inputs.ts` lit pour cela les fournisseurs configurés (`configuredProviders`) ;
    - « le texte est gardé » ne promet plus un traitement que rien ne relance : la réponse dit ce qui arrive vraiment
      au texte gardé ;
    - tests.
13. - [x] **Le test « rejects a tampered blob »** (lun-avaritia#23), comme à la tâche 8.

### lun-docs, à la clôture

14. - [x] La cadence de la copie du core et l'endroit où se lit une copie ratée, au Journal :
    - `architecture-actuelle.md` ;
    - `mise-en-service-desktop.md`, au § 7 (la copie à 5 h, la veille sautée qui ne copie pas) et au § 8 (« un échec du
      core se lit aussi dans sa santé ») ;
    - le plan coché, dont la tête donne les PR qui livrent ; lun-docs#110 se ferme.

## Preuves

- Les barrières de chaque dépôt, et chaque test nommé ci-dessus.
- Sur des bases de démo, une capture par écran changé : l'Atelier, le Journal et la Constellation du core ; Réglages
  d'Acedia ; la carte, le Tableau et Dépôts d'Avaritia.
- Sur un core jetable, avec le rattrapage actif : une copie faite pendant une pause de la veille, ouverte avec
  `node:sqlite` ; une copie ratée exprès, qui arrive au Journal.

## Restent en `inbox`, après le MVP

- lun-anima#82 : le bandeau « Rien ne tourne encore » ne se voit qu'avant la fin de la mise en route, faite à
  l'installation.
- lun-anima#83 : la mise en route au téléphone, faite une fois, à l'installation.
- lun-anima#79 : `CORE_URL` et les commandes du terminal, qui ne servent qu'à l'installation.
- lun-anima#90 et lun-acedia#62 : ne gênent qu'après une restauration, que la page de mise en service contourne
  déjà.
- lun-docs#109 : le texte des ADR 0001 et 0008.
