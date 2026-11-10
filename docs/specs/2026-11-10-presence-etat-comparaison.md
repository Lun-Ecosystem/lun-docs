# La présence : où nous en sommes, face à quatre projets voisins

> Étude du 10/11/2026, demandée par CrOliX après le chantier « le tour de parole ». Elle répond à trois questions :
> où en est la présence de Natsume, où nous péchons face à des projets similaires, et si notre approche et notre
> méthode sont les bonnes pour cet axe. Rien n'est décidé ici : le § 5 propose, CrOliX tranche.

## 1. Ce qui a été lu, et comment

Notre code sur `main` (Lun'Luxuria 4871a23, le core ae70fae), relu avant d'écrire une ligne de comparaison. Puis quatre
dépôts publics, clonés et lus sans rien lancer, par la session elle-même et non par des sous-agents :

| Projet | Ce que c'est | Licence | Lu |
|---|---|---|---|
| [Pipecat](https://github.com/pipecat-ai/pipecat) | Le cadre de référence pour un agent vocal en cascade | BSD 2 | Les stratégies de tour (`turns/`), la détection de voix, le modèle de fin de tour, la porte du tour à l'essai |
| [LiveKit Agents](https://github.com/livekit/agents) | L'autre cadre de référence | Apache 2 | Les options de tour (`voice/turn.py`), l'interruption, les phrases d'attente |
| [Open-LLM-VTuber](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber) | Une compagne vocale à avatar, locale | MIT | La configuration, la conversation, l'interruption, la file de synthèse |
| [AIRI](https://github.com/moeru-ai/airi) | Une compagne à avatar, dans le navigateur et en fenêtre | MIT | La détection de voix, la file de parole, l'interruption, les tests audio |

Avec l'[étude d'OpenAmika](2026-11-10-etude-openamika.md), cela fait cinq projets. **Non lu** : le reste de ces dépôts
(mémoire, outils, avatars, serveurs), et rien n'a été entendu. Ce que cette note dit d'eux vient de leur code et de
leurs réglages par défaut, pas d'un essai.

## 2. L'état de notre présence

La ligne d'arrivée de Lun'Luxuria a huit points ([cadrage](2026-11-10-etat-cible-cadrage.md), § 4.1). Six sont « mis de
côté » et n'ont pas une ligne de code : le visage qui vit, la perception du poste, l'écran, les mains, le jeu, le
stream. Ce qui existe, c'est le socle sous eux : **une conversation à la voix**. C'est lui que cette étude regarde,
maillon par maillon.

| Maillon | Ce que nous faisons | État |
|---|---|---|
| Savoir qu'on parle | Le **niveau sonore** du micro, comparé à un plancher (`listen/endpoint.ts:128`). Le code le dit : un raccourci posé pour l'essai. | Codé. Trois préréglages de pièce, **devinés, jamais mesurés** (`presets.ts`). |
| Savoir que la phrase est finie | Un silence fixe : 500 ms, 600 à l'essai du desktop. | Codé. Coupe la parole à qui hésite, fait attendre qui a fini. |
| Transcrire | Whisper, **après** la fin de la phrase. | Codé. 563 ms sur le desktop ; des mots mal entendus (lun-luxuria#48) ; une confiance fixe à 0,9 (lun-luxuria#6). |
| Savoir si c'est pour elle | Son nom, une fenêtre après sa dernière parole, ou une touche tenue. | Codé, constaté le 10/11. |
| Prendre de l'avance | À la première pause (160 ms), la phrase part « à l'essai » ; ses mots restent muets jusqu'à la fin. | Codé. Gain mesuré le 10/11 : 300 ms sur 3,4 s. |
| Répondre | Le core ; premier mot du modèle en 1,1 s, quel que soit le prompt. | Mesuré sur les deux postes : un plancher. |
| Dire | Piper puis RVC, une phrase à la fois, dans l'ordre. | Codé. Une file simple : une urgence attend son tour. |
| Se laisser couper | 400 ms de niveau sonore ; coupe net ou en fin de phrase ; rend au core les mots entendus. Depuis le 10/11, reparler reprend une réponse non entendue. | Codé, **jamais entendu marcher** sur une réponse longue. |
| Parler d'elle-même | Après un silence, deux fois sans réponse au plus ; elle peut se taire. | Codé, constaté le 10/11. |
| Percevoir | L'absence (ni touche ni souris), le micro pris par une autre appli, la sourdine. | L'absence et la sourdine constatées ; le micro pris ne marche pas (lun-luxuria#50). |
| Le visage | Deux images, bouche ouverte ou fermée, sur le son joué. | Codé. |
| Prouver | Des tests unitaires avec des faux ; la voix ne s'entend que sur le desktop. | **Aucun test ne rejoue un vrai son.** |

Deux chiffres résument l'écart : 3,4 s de la dernière syllabe au premier son, dont 1,1 s que nous ne pouvons pas
réduire ; et, le 10/11, quatre issues ouvertes en une soirée d'écoute, aucune par un test.

## 3. Ce que les autres font, que nous ne faisons pas

### 3.1 Tous détectent la voix par un modèle, aucun par le niveau

Les quatre projets, et OpenAmika, utilisent **Silero**, un petit modèle (2,3 Mo chez Pipecat) qui rend la probabilité
qu'une trame soit de la voix. Pipecat exige 0,7 de confiance pendant 200 ms pour ouvrir, 200 ms pour fermer, et garde
le volume comme second critère. AIRI le fait tourner **dans le navigateur**, comme le ferait Luxuria : seuil 0,3 pour
entrer, 0,1 pour sortir, 400 ms de silence, 250 ms de parole au moins.

Chez nous, une musique, un clavier ou sa propre voix dans les enceintes sont « de la voix ». C'est la cause la plus
probable des fins de phrase ratées en pièce bruyante, et elle rend la coupure fragile : 400 ms de bruit suffisent.

### 3.2 La fin de phrase est une décision, pas un délai

- **Pipecat** : par défaut, un second modèle (`smart-turn`, 8,7 Mo, tourne sur un processeur) écoute **comment** la
  phrase sonne et dit si elle est finie. Le silence ne sert plus que de filet : 3 s.
- **LiveKit** : deux délais au lieu d'un. 0,5 s si le détecteur juge la phrase finie, jusqu'à 3 s sinon.
- **En option chez Pipecat, et chez OpenAmika** : le modèle de langage lui-même dit, en tête de réponse, si la phrase
  était complète ; sinon il se tait et attend.

Chez nous : un seul silence, le même pour « oui » et pour « alors, je me disais que… ».

### 3.3 Une coupure peut être une fausse alerte

LiveKit ne jette pas la parole coupée : il la **met en pause**. Si rien de sensé ne suit dans les 2 s, il la reprend
où elle en était. Il demande 0,5 s de parole pour couper, peut exiger un nombre de mots, et sait ignorer un « hm hm »
qui n'est pas une prise de parole.

Chez nous : couper est définitif. Une toux de 400 ms tue la réponse en cours. Seule la réponse pas encore commencée
est retenue puis relâchée, depuis le 10/11.

### 3.4 La file de parole a des priorités

AIRI donne à chaque prise de parole une priorité et un comportement : attendre son tour, couper ce qui joue, ou
remplacer. Chez nous, la file est dans l'ordre d'arrivée : une urgence attend la fin de la phrase d'avant.

### 3.5 Pendant qu'un outil travaille, on ne laisse pas un blanc

- **LiveKit** : une phrase d'attente part si l'étape dure, puis d'autres à intervalle.
- **Pipecat** : peut rendre la personne « muette » le temps d'un appel d'outil, pour qu'une phrase dite pendant
  l'attente ne relance pas tout.

Chez nous : le silence pendant une délégation à un poste, déjà noté par la veille (C2), et le risque de double
délégation que le chantier du 10/11 a dû traiter.

### 3.6 Le tour à l'essai est borné

Pipecat le retire s'il reste sans verdict 5 s ; LiveKit ne l'essaie pas au-delà de 10 s de parole ni plus de trois fois
par tour, et ne lance pas la synthèse avant la confirmation. Le nôtre n'a aucune de ces bornes ; son principe est le
même.

### 3.7 On teste avec de vrais sons

AIRI a un paquet entier pour cela : un fichier son devient un **faux micro**, et traverse la vraie chaîne — détection
de voix, transcription, modèle, synthèse, lecture. Ses cas portent des noms que nous reconnaissons : deux phrases
enchaînées, un long silence avant de parler, la latence de fin de voix.

C'est la réponse à nos allers-retours : un défaut entendu une fois sur le desktop devient un fichier, rejoué partout.

### 3.8 Trois idées pour plus tard

- **Parler dans une langue, s'afficher dans une autre** (Open-LLM-VTuber) : le texte est traduit avant la synthèse.
  C'est la question de la langue de la voix, laissée ouverte le 06/11.
- **L'expression dans la réponse** : le modèle glisse un mot-clé d'émotion que le visage joue (Open-LLM-VTuber) ; un
  pilote de lèvres à part (AIRI). Pour le point 1 de la ligne d'arrivée.
- **La synthèse en parallèle, la lecture dans l'ordre** (Open-LLM-VTuber). Sans objet pour nous tant que RVC ne prend
  qu'un appel à la fois.

## 4. Le verdict

### 4.1 Notre approche tient

- **La cascade** (transcrire, répondre, dire) est celle des cinq projets. L'alternative, un modèle qui écoute et parle
  d'un seul bloc, existe chez Pipecat et LiveKit ; elle nous ôterait sa voix (RVC), le garde-fou des cartes et le
  plafond de coût. À ne pas prendre.
- **Le corps d'un côté, le cerveau de l'autre** : aucun des cinq ne le fait aussi nettement, et c'est ce qui permet au
  téléphone et au bureau de parler à la même Natsume. À garder.
- **Ce que nous avons et qu'ils n'ont pas** : les mots réellement entendus rendus au cerveau, la phrase retirée sans
  laisser de trace, une parole d'elle-même bornée, un geste autorisé par les seuls mots de CrOliX.
- **Ne pas adopter un cadre.** Pipecat et LiveKit sont des serveurs Python faits pour la téléphonie et le WebRTC ; les
  prendre, c'est réécrire l'écoute de Luxuria. Ce qu'ils ont de mieux se reprend pièce par pièce : deux petits modèles
  et une façon de nommer les décisions.

### 4.2 Où nous péchons, par ordre de gravité

| # | Écart | Verdict | Prouvable sur le laptop |
|---|---|---|---|
| 1 | Aucun test ne rejoue un vrai son | **À construire d'abord** : tout le reste se mesure avec | Oui |
| 2 | La voix lue au niveau sonore | **À remplacer** par Silero, dans la page | Oui |
| 3 | Un silence fixe pour la fin de phrase | **À remplacer** par deux délais, puis un modèle si la mesure le veut | Oui, sur enregistrements |
| 4 | Une coupure toujours définitive | **À ajouter** : pause, puis reprise si fausse alerte | Oui |
| 5 | Une file de parole sans priorité | **À ajouter**, petit | Oui |
| 6 | Le blanc pendant une délégation | **À ajouter** : une phrase d'attente | Oui |
| 7 | Le tour à l'essai sans borne | **À borner**, petit | Oui |
| 8 | La transcription attend la fin de la phrase | **À étudier à part** : voir les limites | En partie |

### 4.3 Les limites, qui ne sont pas des défauts

- **1,1 s de premier mot** : mesuré sur les deux postes, indépendant du prompt. Seul un autre modèle le change.
- **La transcription locale n'est pas continue.** Whisper travaille sur une phrase entière. Les cadres comptent sur
  des services en ligne qui transcrivent au fil de l'eau ; OpenAmika sur un moteur sans français. Un moteur local,
  continu et français reste à trouver : non vérifié.
- **Le matériel** : sans carte NVIDIA, Whisper « medium » prend une demi-seconde par phrase, et RVC parle par blocs
  d'une demi-seconde.
- **Estimation, non mesurée** : avec les écarts 2 et 3 comblés, le tour passerait de 3,4 s vers 2,5 s. En dessous, il
  faut toucher au modèle, à la transcription ou au matériel.
- **Le modèle de fin de tour** de Pipecat : ni ses langues ni sa tenue en français n'ont été vérifiées.

### 4.4 Notre méthode, pour cet axe

Ce qui a marché : le plan attaqué avant le code, le diff relu à part (quatre défauts bloquants trouvés le 10/11), le code
confronté avant de comparer. Ce qui n'a pas marché :

- **On prouve par des faux, on découvre à l'oreille.** Les tests de la conversation injectent des événements
  (« une pause », « une voix tenue ») que rien ne produit à partir d'un son. Tout ce qui se joue entre le micro et ces
  événements n'a aucun test.
- **Les réglages sont devinés.** Les préréglages de pièce, le silence de fin, les 400 ms de coupure : aucun ne vient
  d'une mesure.
- **Un défaut coûte un voyage.** Le desktop sert à la fois de banc d'essai et de lieu d'écoute.
- **On corrige par symptôme.** Trois chantiers ont touché la conversation sans tableau d'ensemble ; ce document est le
  premier.

## 5. Ce que je propose

Un chantier, « l'écoute », mené sur le laptop, dans cet ordre. Chaque marche se mesure avec la première.

1. **Le banc.** Des enregistrements de CrOliX — pris sur le laptop, avec Luxuria dans le navigateur — rejoués par les
   tests dans la vraie chaîne d'écoute : du son jusqu'à ce que la conversation décide. Les cas du 10/11 d'abord : deux
   phrases à trois secondes d'écart, une toux, une coupure sur une réponse longue, une hésitation, de la musique.
2. **La voix par Silero**, à la place du niveau. Les préréglages devinés disparaissent ou sont mesurés sur le banc.
3. **La fin de phrase** : deux délais, courts quand la phrase sonne finie. Le modèle de fin de tour n'entre que si le
   banc montre qu'il fait mieux en français.
4. **La coupure qui se reprend**, les priorités de la file, la phrase d'attente pendant une délégation, les bornes du
   tour à l'essai.
5. **Une seule écoute sur le desktop**, à la fin, avec la liste déjà écrite dans la feuille de route.

À part, sans code : chercher un moteur de transcription local, continu et français.

**Ce qu'il faut de CrOliX** : valider cet ordre, et une demi-heure d'enregistrements sur le laptop, à faire quand le
banc existera.
