# Lun'Luxuria, l'essai chronométré. Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Un seul exécutant, sur le poste lui-même. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** mesurer sur le desktop de CrOliX ce que Luxuria devra tenir, et fixer les briques de la voix, du rendu et de la détection du micro.

**Architecture :** du code **jetable**, sans tests ni finitions : un banc de voix Python, une petite fenêtre Tauri avec un modèle Live2D, une sonde du micro. Le seul livrable durable est le relevé `RELEVE.md`. Les plans du core et de l'app s'écrivent ensuite, à partir de lui.

**Stack :** Python 3.12 et `uv`, Rust et Tauri 2, Node, ce que l'inventaire trouve déjà.

**Spec :** [`docs/specs/2026-11-06-lun-luxuria-design.md`](../specs/2026-11-06-lun-luxuria-design.md), §7, §6.2, §6.3, §5.2. Issue : Lun-Ecosystem/lun-docs#61.

## Contraintes globales

- **Le poste :** le desktop seul. Vérifier la carte avant toute mesure et l'écrire en tête du relevé. Un chiffre pris ailleurs ne compte pas.
- Dossier de travail hors de tout dépôt, noté dans le relevé.
- Chiffre principal : du **dernier son de voix au premier son joué**, mesuré sur l'horloge du PC seule. Ne jamais additionner des horodatages de deux machines.
- Toujours la médiane et le 95ᵉ centile, sur 20 tours au moins, par segment.
- L'audio ne quitte pas le PC. Seul le texte part au modèle.
- Le core de l'essai est jetable : `DB_PATH`, `PORT` et `ANIMA_SECRET_KEY` à part, jamais `data/anima.db` ni `data/cli.token`. Ne jamais arrêter un core existant. Lire la clé OpenAI sans jamais l'afficher.
- **CrOliX fait lui-même :** accepter une licence (Cubism SDK), fournir les fichiers privés, juger à l'oreille et à l'œil. L'exécutant demande, il n'accepte rien à sa place.
- Aucune dépense cloud : un repli payant se propose dans le relevé, il ne se branche pas.
- Barre d'arrêt : si une brique bloque plus de 2 h, l'écrire dans le relevé et passer à la suivante. On cherche des chiffres, pas un produit.

## À fournir par CrOliX

Un modèle de test Live2D (dossier avec son `.model3.json`), le Cubism SDK for Web (téléchargé et licence acceptée par lui), le modèle de voix RVC, un jeu représentatif de sa carte, Discord connecté, un casque.

## Points de vigilance

1. **Prendre le temps de synthèse pour la latence :** le chiffre s'arrête au premier son joué, pas à la fin de la phrase ni au fichier prêt (erreur de l'ancien écosystème, ADR-016).
2. **Mesurer à vide puis jeu lancé :** un chiffre à vide ne dit rien de la soirée où il joue.
3. **La transcription sur du silence :** Whisper invente des phrases ; compter ces hallucinations sur 5 minutes de micro ouvert, casque posé.
4. **Une appli qui garde le micro :** relever OBS et les jeux à chat vocal, sinon la détection rend Natsume muette à tort.
5. **Le français :** l'ancienne Natsume parlait anglais ; le rendu du modèle RVC en français n'est pas acquis.

---

### Tâche 1 : l'inventaire

**Fichiers :** créer `RELEVE.md`.

- [ ] Relever carte, pilote, processeur, mémoire, écrans, version de WebView2, et les outils présents ou non : Node, Python, `uv`, Rust, ffmpeg, Git.
- [ ] Chercher l'ancien environnement sur les disques : w-okada Voice Changer, RVC, modèles `.pth`, `.onnx`, `.index`, modèles Whisper, whisper.cpp, Kokoro, Piper, VTube Studio. Écrire les chemins et les versions, sans rien déplacer.
- [ ] Installer ce qui manque pour l'essai (Rust, ffmpeg), en notant ce qui a été installé. Terminé quand `cargo --version` et `ffmpeg -version` répondent.

### Tâche 2 : le banc de voix

**Fichiers :** créer `banc/` (`uv`), et un core jetable lancé depuis un clone de `lun-anima`.

**Produit :** `banc.py --phrases phrases.txt --stt <brique> --tts <brique> [--rvc]`, une ligne JSON par tour avec les segments ci-dessous. Elle sert aux tâches 3, 5 et 7.

Chaîne, dans l'ordre : Silero VAD, transcription, `POST /api/threads/main/messages` avec `surface: 'voice'` et `confidence`, découpe du flux en phrases, synthèse, RVC, lecture. Synthétiser la phrase suivante pendant que la précédente joue, et jeter l'audio d'un énoncé dépassé.

Segments : `vadFin`, `stt`, `premiereCoreOctet`, `premierePhrase`, `synthese`, `rvc`, `premierSon`, `trouEntrePhrases`.

- [ ] Monter le core jetable avec un satellite factice, et noter le temps du premier mot en passant par le core.
- [ ] Si le NAS répond sur le réseau, mesurer un aller-retour vers lui et le noter à part ; le core de l'essai tourne sur le PC, et le relevé le dit.
- [ ] Rejouer 20 phrases enregistrées par CrOliX en WAV, pour comparer les briques sur la même entrée.

### Tâche 3 : choisir les briques, à vide

**Fichiers :** modifier `RELEVE.md`.

Sans CUDA, comparer dans cet ordre, et s'arrêter dès qu'un couple tient : transcription whisper.cpp par Vulkan, puis faster-whisper sur processeur (modèles `small` et `medium`, français) ; synthèse Kokoro (voix française), puis Piper ; RVC par ce que l'inventaire a trouvé, sinon ONNX par DirectML.

- [ ] Tableau par couple : médiane et 95ᵉ centile du chiffre principal et de chaque segment, charge du processeur et de la carte.
- [ ] Compter les hallucinations sur 5 minutes de micro ouvert, casque posé. Noter le filtre qui les retire, et la durée minimale de phrase.
- [ ] Tester 5 fins de silence (400, 500, 600, 700, 800 ms) sur des phrases avec hésitation : phrases coupées et latence.
- [ ] Faire écouter à CrOliX 5 phrases en français avec et sans RVC, et noter son jugement mot pour mot.

Fini quand : une chaîne est retenue, ou le relevé montre qu'aucune ne tient 2 s, avec les options chiffrées (modèle plus rapide, sans RVC, autre carte). **Dans ce cas, s'arrêter ici et demander à CrOliX avant la suite.**

### Tâche 4 : Live2D dans une fenêtre Tauri

**Fichiers :** créer `fenetre/` (Tauri 2, page unique).

**Produit :** une fenêtre sur le deuxième écran qui affiche le modèle par le SDK Web officiel, avec un compteur d'images par seconde, et la bouche pilotée par le niveau du son joué, par `AnalyserNode`. Un second mode affiche deux images PNG échangées selon le même niveau, et le niveau 1 un simple cercle.

- [ ] Mesurer les images par seconde : modèle seul, puis banc de voix actif. Seuil : 30 au moins.
- [ ] Faire juger par CrOliX le délai du son à la bouche : « imperceptible à l'usage » ou non, mot pour mot.
- [ ] Noter si le SDK Web officiel suffit, et le temps qu'il a fallu pour afficher un modèle.
- [ ] Ouvrir une vignette toujours au premier plan, avec et sans transparence : noter tout défaut de la transparence sous WebView2.

Si les seuils ne tiennent pas, le niveau 2 reste la cible et le format revient à CrOliX, avec les chiffres.

### Tâche 5 : avec un jeu lancé

**Fichiers :** modifier `RELEVE.md`.

- [ ] Rejouer les 20 phrases sur la chaîne retenue, jeu lancé, en notant le jeu et ses images par seconde avec et sans la chaîne.
- [ ] Refaire sans RVC, et avec la touche seule (transcription à la demande) à la place de la transcription en continu.
- [ ] Vérifier la vignette au-dessus du jeu : plein écran fenêtré et plein écran exclusif.

Fini quand : le relevé propose un réglage pour le petit mode, ou le repli du §7 (pas de RVC, puis cloud si CrOliX l'accepte).

### Tâche 6 : la sonde du micro

**Fichiers :** créer `sonde/`.

**Produit :** un script qui écrit, chaque seconde, les applis qui utilisent le micro, par deux voies : les clés `CapabilityAccessManager\ConsentStore\microphone` (`LastUsedTimeStop` à 0 quand l'appli l'utilise), et les sessions de capture WASAPI. Lancé en lecture seule.

- [ ] Jouer : Discord entre et sort d'un salon, micro coupé dans Discord, appel navigateur, OBS ouvert, le jeu de la tâche 5.
- [ ] Noter pour chaque cas ce que disent les deux voies et le délai de détection, puis retenir une voie et dresser la liste initiale des applis à ignorer.
- [ ] Vérifier que le banc de voix ne se détecte pas lui-même.

### Tâche 7 : couper, et dire « annule » à temps

**Fichiers :** modifier `RELEVE.md`.

- [ ] Comparer une coupe immédiate et une coupe douce (la phrase se finit, coupe nette après 1,2 s) : jugement de CrOliX, et déclenchements sur du bruit ambiant.
- [ ] Chronométrer : phrase « C'est noté : Relance à Paul Mercier. Tu as 5 secondes pour dire annule. » jouée, puis « annule » dit aussitôt, jusqu'à la réception par le core. Écrire ce qu'il reste des 5 s, avec un départ à la réception et avec un départ à la fin de la phrase.

### Tâche 8 : la remise

**Fichiers :** finaliser `RELEVE.md`.

- [ ] En tête : le poste, la date, et les décisions proposées, une par ligne : briques, réglages par défaut du §6.8 (fin de phrase, interruption), Live2D confirmé ou non, voie de détection, repli en jeu.
- [ ] Une section « Non mesuré », sans enjoliver.
- [ ] Copier `RELEVE.md` là où la session de cadrage pourra le lire (dépôt `lun-luxuria` s'il existe, sinon le demander à CrOliX). Effacer les clés et les bases jetables.

Fini quand : CrOliX a relu le relevé. Les plans du core et de l'app partent de là.
