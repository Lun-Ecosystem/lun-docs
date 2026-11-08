# La voix de Luxuria au quotidien : relancer, lancer ses programmes, la page de mise en service

> Chantier du 08/11, validé par CrOliX (« je valide, planifie et exécute en autonomie »), après la recette du desktop.
> Issues : lun-luxuria#34, lun-luxuria#35, lun-docs#97 ; avec lun-anima#75 et #76 pour l'astre de Luxuria. Niveau
> `standard`.

## Le choix

En #25, l'appli vérifiait whisper-server et RVC sans les lancer : lancer un programme nommé par un réglage ouvrait la
porte à n'importe quel exécutable. CrOliX a demandé le lancement (#35) au risque d'oublier de les démarrer. Garde-fous
retenus : deux noms fixes (`whisper-server`, `rvc`) ; un `.exe` existant, choisi par la personne dans la boîte de
dialogue du système et gardé côté Rust, si bien que la page ne nomme jamais de chemin ; aucun shell ; rien lancé si
quelque chose répond déjà à l'adresse ; chaque programme lancé rattaché à un job Windows, qui l'arrête avec l'appli,
même si elle plante.

La relecture a écarté le premier jet, un chemin tapé dans les réglages : une page compromise aurait pu y écrire
n'importe quel `.exe` et le lancer.

## Étapes

- [x] lun-anima : l'astre de Luxuria suit la présence de l'appareil ; « Ajouter un appareil » dit le parcours de
  l'appli de bureau (lun-anima#77).
- [x] lun-luxuria, Rust : `voice_restart` (les champs vérifiés et le journal ouvert avant tout arrêt) et `voice_running`
  (le service lancé par l'appli garde ses arguments) ; `programs.rs` : le `.exe` choisi par `program_pick`, gardé
  dans `programmes.json`, lancé par `program_start`, suivi par `program_state` (sonde TCP) ; un arrêt aussitôt dit avec
  son journal ; `job.rs` pour l'arrêt avec l'appli.
- [x] lun-luxuria, page : « Lancer ou vérifier » en cours puis son résultat ; « Des réglages attendent » et « Relancer
  le service » ; chaque carte dit ce qu'utilise le service en marche et ce qui attend sa relance ; le programme choisi,
  ses arguments et son interrupteur pour whisper-server et RVC, suivis jusqu'à ce qu'ils répondent ; au démarrage, les
  programmes avant le service.
- [x] lun-docs : § 5 de `mise-en-service-desktop.md` (l'exe posé avant « Démarrer avec Windows », l'appairage par
  l'écran, la voix et ses programmes).
- [ ] Sur le desktop : choisir et lancer whisper-server et RVC par l'appli, relancer le service après un changement de
  moteur, quitter et constater qu'aucun des trois ne reste.

## Hors périmètre

Un `.bat` ou un script comme programme, et la reprise d'un programme qui s'arrête seul.
