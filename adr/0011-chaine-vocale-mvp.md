# ADR 0011 : la chaîne vocale du MVP, après l'essai du 07/11

Statut : acceptée
Date : 2026-11-07

## Contexte

La spec Luxuria du 06/11 visait moins de 1,5 s en médiane, du dernier son de voix au premier son joué. L'essai chronométré
du 07/11 sur le desktop (RX 6650 XT, sans CUDA) donne **2776 ms en médiane et 3754 au 95ᵉ centile**, à vide, sans jeu
(rapport : `lun-luxuria/docs/essai-2026-11-07.md`). L'attente du modèle jusqu'au premier mot en prend environ 1130 : sans
toucher au modèle, aucun réglage local ne ramène la chaîne sous 2,3 s. Comme le prévoit le §7 de la spec, le relevé est
revenu à CrOliX, qui a tranché le 07/11. Ces choix engagent lun-luxuria et lun-anima.

## Décision

- **Cible : 2,5 s en médiane** sur le desktop, chaîne complète, sans jeu. Elle remplace les 1,5 s de la spec. Moins de
  1 s reste l'horizon, avec un modèle plus rapide ou une autre carte. La chaîne mesurée ne tient pas encore cette cible :
  le premier levier est la réponse préparée avant la fin de phrase (§6.9 de la spec), à mesurer.
- **Tout tourne d'abord sur la RX.** Une RTX n'arrive que si une carte se trouve à 750 au plus pendant la Black Week,
  fin novembre 2026. Elle n'est jamais tenue pour acquise au 31/12.
- **Briques retenues** :
  - transcription whisper.cpp medium en Vulkan sur la carte (553 ms, 22 % de mots faux) **[choix Claude]** ;
  - synthèse Piper en français ;
  - RVC par vcclient sur la carte, en blocs de 0,5 s joués en continu, index 0,75, protection 0,33.
  Le modèle de voix reste de la configuration, hors des dépôts, et son nom n'entre pas dans un dépôt public (ADR 0010).
- **Pas de validation de vraie carte à la voix** tant que la transcription ne rend pas une confiance réelle :
  whisper-server n'en donne pas, et la valeur fixe de 0,9 a laissé un « Oui » valider une carte de test
  (lun-luxuria#6).
- **La langue parlée reste ouverte**, à trancher à l'oreille.
- **vcclient n'écoute que la machine** (`127.0.0.1`), sans règle de pare-feu entrante, comme le service voix de
  l'ADR 0010.
- La chaîne reste celle de lun-luxuria. D'OpenAmika, on reprend les mécanismes et les valeurs, pas le code
  **[choix Claude, à relire]**.

## Conséquences

- Les blocs RVC passent de la copie du banc à `voix/service.py` (lun-luxuria#7).
- Les mesures du MVP se prennent sur le desktop seulement. Un chiffre du laptop ne vaut pas pour la cible.
- Restent à mesurer : la chaîne avec un jeu lancé, les hallucinations sur silence, Live2D dans la fenêtre, la vignette
  au-dessus d'un jeu, la fenêtre de « annule » à la voix.
- Si la RTX arrive, la cible se remesure et peut redescendre : un nouvel ADR remplacera celui-ci.

## Alternatives écartées

- **Garder 1,5 s** : hors de portée sur la RX sans changer de modèle, elle bloquerait le MVP sur un achat incertain.
- **Transcription small** : 330 ms de moins, mais 27 % de mots faux, ce qui est trop pour valider à la voix.
- **Sans RVC** : 130 ms de moins, pour une voix qui n'est plus la sienne. RVC reste la deuxième coupe du calendrier.
- **Raccourcir le silence de fin** : 3 phrases sur 20 sont déjà coupées à 600 ms.
