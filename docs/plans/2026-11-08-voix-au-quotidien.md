# La voix de Luxuria au quotidien : relancer, lancer ses programmes, la page de mise en service

> Chantier du 08/11, validé par CrOliX (« je valide, planifie et exécute en autonomie »), après la recette du desktop.
> Issues : lun-luxuria#34, lun-luxuria#35, lun-docs#97 ; avec lun-anima#75 et #76 pour l'astre de Luxuria. Niveau
> `standard`.

## Le choix

En #25, l'appli vérifiait whisper-server et RVC sans les lancer : lancer un programme nommé par un réglage ouvrait la
porte à n'importe quel exécutable. CrOliX a demandé le lancement (#35) au risque d'oublier de les démarrer. Garde-fous
retenus : deux noms fixes (`whisper-server`, `rvc`), un `.exe` existant par son chemin complet, aucun shell, rien lancé
si quelque chose répond déjà à l'adresse, arrêt à la sortie de ce que l'appli a lancé, et rien d'autre.

## Étapes

- [x] lun-anima : l'astre de Luxuria suit la présence de l'appareil ; « Ajouter un appareil » dit le parcours de
  l'appli de bureau (lun-anima#77).
- [x] lun-luxuria, Rust : `voice_restart` et `voice_running` (le service lancé par l'appli garde ses arguments) ;
  `programs.rs` (`program_start`, sonde TCP, arrêt à la sortie).
- [x] lun-luxuria, page : « Lancer ou vérifier » en cours puis son résultat ; « Des réglages attendent » et « Relancer
  le service » ; chemin, arguments et interrupteur de whisper-server et de RVC ; au démarrage, les programmes avant le
  service.
- [x] lun-docs : § 5 de `mise-en-service-desktop.md` (l'exe posé avant « Démarrer avec Windows », l'appairage par
  l'écran, la voix et ses programmes).
- [ ] Sur le desktop : lancer whisper-server et RVC par l'appli, relancer le service après un changement de moteur,
  quitter et constater qu'aucun des trois ne reste.

## Hors périmètre

Un sélecteur de fichier (plugin de dialogue), un `.bat` ou un script comme programme, et la reprise d'un programme
qui s'arrête seul.
