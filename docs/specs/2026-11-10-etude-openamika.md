# OpenAmika, lue pour Lun'Luxuria. Étude

> Étude du 10/11, demandée par CrOliX au moment d'écrire la ligne d'arrivée de Lun'Luxuria
> ([état cible](2026-11-10-etat-cible-cadrage.md), § 4.1). Elle dit ce que fait un dépôt voisin, ce qui s'en transpose
> chez nous, et ce qui ne se reprend pas. Ce n'est ni une spec ni un plan : rien ici n'est décidé. Les propositions
> marquées **[avis Claude]** sont à trancher par CrOliX.

**Le dépôt :** [OpenAmika](https://github.com/zeekk0/OpenAmika), de MekaHime Inc. : une compagne vocale avec un avatar
Live2D, en Python, pour Windows avec une carte NVIDIA. Code sous licence MIT. Lu au commit `5bb437d` (10/11) : 208
fichiers, environ 35 000 lignes.

**Comment il a été lu :** trois lectures en parallèle (la voix ; le cerveau ; les serveurs, la vision, l'avatar et
l'exploitation), en lecture seule. **Rien n'a été lancé** : le dépôt demande une carte NVIDIA RTX avec 8 Go de mémoire
vidéo, que ni le laptop ni le desktop n'ont. Les renvois `fichier:ligne` viennent de ces lectures et n'ont pas été
revérifiés un par un ; les chiffres de latence sont ceux de l'auteur, sur sa machine. Voir § 7.

## 1. Ce que c'est, en une page

```
navigateur (réglages, outils, scène)           WebSocket : texte + audio
      │
COUCHE VOIX   speech/api.py     écoute locale (SenseVoice), fin de parole (Silero), interruption,
      │                         découpage en phrases, synthèse phrase par phrase, registre des avatars
      ├──► CERVEAU  brain/webui.py   premier jet, réponse, réflexion ; mémoire par preuve ; coût ; outils
      │        └──► modèles de langage (OpenRouter, Alibaba, Ollama) et serveurs d'outils (MCP)
      └──► SYNTHÈSE  vendor/tts-engine (GPT-SoVITS), une requête par phrase
```

Les mêmes rôles que chez nous, découpés autrement : leur couche voix est notre Lun'Luxuria, leur cerveau est le core,
leur mémoire tient dans le cerveau (chez nous, la bibliothèque est un poste à part), et leurs « aides » (des agents de
tâches extérieurs, pilotés par un pont) tiennent la place de nos postes.

## 2. Ce qui se transpose à Lun'Luxuria

| Idée | Ce qu'ils font | Ce que cela demande chez nous |
|---|---|---|
| **Le tour à l'essai** | Dès la première trame de silence (32 ms), la parole est transcrite et envoyée au cerveau « à l'essai ». Si le silence tient environ 480 ms, le tour est confirmé et reprend la génération déjà lancée (`speech/api.py:3099-3109`, `3252-3260`). | Que le core accepte un message à l'essai, puis sa confirmation ou son abandon. Le prix : des appels au modèle perdus quand la parole reprend. À chiffrer avant tout. |
| **La première phrase courte** | La première phrase part en synthèse dès 2 caractères utiles ; les suivantes entre 5 et 40 (`speech/sentence_splitter.py:39-45`). | Un réglage du découpage, côté voix. Aucun coût, aucune dépendance. |
| **La porte d'interruption** | Couper demande 400 ms de parole continue, dans une fenêtre de 400 à 600 ms (`speech/api.py:4112-4143`). Écarte une toux et une partie de l'écho. | De la logique seule, sans matériel. Luxuria n'a pas d'interruption aujourd'hui. |
| **L'ancrage** | L'écran accuse le début et la fin réels de chaque phrase jouée ; à l'interruption, le cerveau reçoit où elle en était (`speech/api.py:4155-4192`, `ui/use.js:140-155`). La position est estimée par la durée, sans alignement. | Deux accusés de lecture de Luxuria vers le core, et un champ « entendu jusqu'ici » dans le message suivant. |
| **Un message par phrase** | L'audio, le texte, l'émotion et la pause d'une phrase partent ensemble ; l'expression se joue au début réel de la lecture (`speech/api.py:3875-3892`, `ui/live2d-engine.js:740`). | Que la réponse du core porte une émotion par phrase. C'est la couture entre le visage et la voix. |
| **Les lèvres tirées du son** | Le volume et trois bandes de fréquences de l'audio joué donnent A, I, U, E, O (`ui/live2d-engine.js:400-441`). Aucun phonème demandé à la synthèse. | Rien que la fenêtre de Luxuria ne puisse faire. Marche avec toute voix, donc après la conversion RVC. |
| **L'émotion du visage n'est pas celle de la voix** | Un adaptateur réécrit l'étiquette pour la voix ; le visage garde l'étiquette d'origine (`docs/TTS.md:79-87`). | Une table par voix, en réglage : conforme à « le lore est une configuration ». |
| **Le texte reporté** | Une parole coupée de force à 30 s est reprise en tête du message suivant, tant que le tour n'est pas confirmé (`speech/stt_carry.py:12-39`). | Une fonction pure, facile à porter. Aucune perte sur un long monologue. |
| **Un chien de garde par étape** | 2 s pour le premier audio, 5 s par phrase, sinon la file est vidée (`speech/api.py:3963-4010`). | À reprendre, mais en le disant à l'écran : chez eux la parole se perd sans un mot. |
| **Le filtre avant de voir** | Une description par seconde au plus, et seulement si l'image a changé (signature 64×48 en gris) ; seul le texte part au cerveau, l'image reste sur le poste (`vision/vlm_service.py:302-307`, `379-382`, `420-423`). | Le même principe pour « voir l'écran ». Leur modèle (Qwen3-VL, 4,3 Go de mémoire vidéo) demande une carte NVIDIA. |

**La parole d'elle-même.** Elle ouvre un tour après 30 s de silence, une seule fois par silence, et au plus deux fois
sans réponse (`brain/webui.py:2814-2903`). Elle ne parle que si rien n'est en cours et qu'un écran est relié. C'est un
budget de parole écrit en trois nombres : la forme la plus simple de « à propos, sans lasser ».

## 3. Ce qui se transpose au core

- **Le cache par paliers.** Le prompt est coupé en deux : ce qui ne change pas (personnage, format, vocabulaire) avant,
  ce qui change (contexte du jour, mémoire) après. L'historique garde entre 15 et 20 tours et glisse par paliers de 5,
  pour que le début reste identique d'un appel à l'autre (`brain/f_bridge.py:39-54`, `brain/po_contract.py:848-870`).
  C'est l'idée la plus directement rentable sur le coût.
- **Le premier jet, puis la réponse.** Un premier jet court répond vite ; la réponse vient ensuite et sait ce qui a déjà
  été dit. Les deux s'enchaînent, ils ne tournent pas en parallèle (`brain/webui.py:3268-3291`).
- **La mémoire après la parole entendue.** Un tour n'entre en mémoire que s'il est complet, entendu et non interrompu
  (`brain/f_bridge.py:966-969`). Un fait doit citer mot pour mot la parole de celui à qui on l'attribue ; sinon il part en
  quarantaine (`brain/f_method.py:195-213`).
- **Réserver avant, régler après.** Le coût d'un appel est réservé avant l'envoi, avec 10 % de marge, puis réglé au réel ;
  un flux annulé est retrouvé après coup par son identifiant (`brain/f_openrouter.py:296-305`, `brain/f_settle.py`).
- **Le greffier.** Elle parle d'abord ; un second appel au modèle ne fait que transcrire en actions ce qu'elle a accepté,
  et chaque action doit citer les mots de l'utilisateur, vérifiés par le code (`brain/f_tools.py:873-878`,
  `1018-1110`). Trois actions par tour au plus ; par serveur d'outils : automatique, à confirmer, ou interdit.
- **Le travail à curseur.** Une tâche confiée à une aide rend tout de suite un numéro ; son état se lit par curseur :
  en cours, attend une approbation, attend une réponse, fini, échoué, arrêté. Les étapes internes du pont sont tenues à
  part de ce qui se dit (`servers/openamika-agents/openamika_agents/jobs.py:8-9`, `43-56`, `86-99`).
- **La santé dite en mots fixes.** Une aide en panne s'affiche en rouge et entre dans le prompt : elle ne lui promet rien.
  Un refus est retenu dix minutes (`adapters/hermes.py:269-274`).

## 4. Ce qu'ils font moins bien que ce que nous avons posé

- **Pas de « toujours ».** Leurs approbations ne connaissent que « une fois » et « refuser »
  (`adapters/hermes.py:443`). Notre [permission](../../standards/dictionnaire.md) va plus loin.
- **Une approbation qui vaut « oui » par défaut** quand la réponse n'en dit rien
  (`servers/openamika-agents/openamika_agents/server.py:45`). Chez nous, l'absence de réponse est « rien n'a eu lieu ».
- **La citation ne prouve pas la demande.** Elle prouve que les mots ont été dits, pas qu'ils demandaient l'action ; le
  message précédent est accepté lui aussi.
- **Aucun plafond de coût par défaut**, ni par jour ni par mois (`config/build_f.json:20`). Le core en a.
- **Aucune humeur calculée** : un texte fixe par scène (`brain/f_persona.py:239`). Notre marche 2 de la présence reste à
  inventer.
- **Des souvenirs inventés.** Leurs propres notes disent que le modèle invente un passé commun et que la mémoire l'a
  parfois enregistré (`config/llm_roles.json`).
- **Tout l'écran d'administration exposé.** L'accès distant (Tailscale Serve) sert toute l'interface à tous les
  appareils du réseau privé, clés comprises (`docs/TOOLS.md:470-472`).
- **Des pertes sans un mot** : le cerveau ou la synthèse hors ligne, et la parole est abandonnée avec un simple
  avertissement dans le journal (`speech/api.py:1389-1391`, `3686-3690`).
- **Des réglages non éprouvés** : toutes les pauses à 0,2 s ; aucun test sur les seuils d'écoute ni sur la porte
  d'interruption.

## 5. Ce qui ne se reprend pas

| Élément | Pourquoi |
|---|---|
| Le modèle Live2D et la voix d'Amika, la « poupée de papier » | Usage personnel seulement, pas de redistribution ; absents du dépôt |
| Live2D Cubism Core (`ui/vendor/live2dcubismcore.min.js`) | Licence propriétaire de Live2D, pas MIT : à lire avant tout avatar Live2D |
| SenseVoice, leur écoute | Chinois, anglais, cantonais, japonais, coréen : **pas de français** |
| Leur vision (Qwen3-VL) et leur synthèse (GPT-SoVITS) telles quelles | Une carte NVIDIA ; Qwen2.5-VL est sous licence de recherche, non commerciale |
| La fenêtre de bureau (`pet.py`) et le lanceur (`launch.py`) | Python et Windows ; Luxuria est une application Tauri |
| Leurs chiffres de latence | Mesurés sur une RTX 5070 (synthèse : 0,75 s de médiane par phrase) ; ils ne disent rien de la RX 6650 XT |

Le code lui-même est sous licence MIT : une idée ou un algorithme se reprend, en le réécrivant chez nous.

## 6. Ce que cela propose pour la ligne d'arrivée de Lun'Luxuria **[avis Claude]**

La ligne proposée dans l'état cible (§ 4.1) a cinq points : un visage qui vit ; elle perçoit ce que fait CrOliX et s'y
accorde ; elle parle d'elle-même, à propos, sans lasser ; elle peut faire sur le poste ; elle peut être vue et entendue
par d'autres. OpenAmika montre deux choses qui n'y sont pas, et qui font la présence :

- **Elle se laisse couper, et sait où elle en était.** Sans cela, la conversation reste un échange de tours.
- **Son visage suit sa voix, phrase par phrase.** Un avatar animé qui ne suit pas ce qui est dit n'est qu'un décor.

Et elle précise le troisième point par un garde-fou simple : elle parle d'elle-même après un silence, une fois, et se
tait si on ne lui répond pas.

Deux gains sont à part, parce qu'ils ne demandent ni avatar ni matériel : la première phrase courte, et le cache par
paliers côté core. Ils peuvent se mesurer dès la recette du desktop.

## 7. Ce qui n'a pas été vérifié

- Rien n'a tourné : aucune latence réelle, ni chez eux ni chez nous ; ni le clic à travers la fenêtre de bureau, ni la
  portée réelle de l'accès distant, ni le comportement de leur courtier d'objets connectés.
- La lecture n'est pas exhaustive : dans `speech/api.py` (4 749 lignes), le suivi de la latence et les événements du
  cerveau ont été survolés ; dans `brain/`, `f_controls.py`, `f_reset.py`, le transport de `f_openrouter.py`,
  `pricing.json` et le corps des tests n'ont pas été lus.
- Non établi : qu'un fonctionnement tout local marche vraiment (le code pour Ollama existe, aucune configuration n'est
  fournie) ; le coût réel d'un tour ; l'absence de tout oubli dans leur mémoire.
- Aucune comparaison ligne à ligne avec le code de Luxuria et du core : les colonnes « ce que cela demande chez nous »
  sont des estimations, à reprendre au cadrage de chaque marche.
- À essayer pour de bon quand la RTX arrive.
