# Vision

> Le seul document « nord » de l'écosystème Lun'. Tout projet, tout chantier et toute décision se
> confrontent à ce texte. Il change rarement, et seulement par une PR sur lun-docs.

## Ce que c'est

Natsume est une entité unique : une personnalité et une mémoire, présentes sur plusieurs surfaces.
Elle se situe à la frontière entre Jarvis (Iron Man) et Neuro-sama (Vedal) : une assistante qui suit
CrOliX au quotidien, dans le travail comme dans le jeu, et qui garde le fil d'une surface à l'autre.

## Les cinq surfaces

Les cinq sont indispensables au VIP.

**1. Assistante de travail.** Elle lit les mails, prépare des réponses et pré-trie ce qui peut l'être :
corbeille, indésirables, archive, rangement dans des boîtes selon l'expéditeur et l'urgence. Elle suit
l'agenda, repère les événements qui se chevauchent et propose de les déplacer. Elle gère les tâches et
la veille tech, et traite les notifications GitHub directement à la source (l'envoi de mails par
GitHub est désactivé).

**2. Second cerveau.** Une mémoire vectorielle organisée comme des fiches Obsidian, dans l'esprit de
myBrain. Elle range et enregistre tout ce qui entoure CrOliX comme information, et c'est cette mémoire
qui nourrit sa personnalité.

**3. Compagnon desktop et jeu.** Elle voit l'écran, réagit à voix haute (TTS) et est présente par un
avatar dans VTube Studio. Sa personnalité évolue selon la mémoire et les interactions, et un système
d'humeur colore ses réponses.

**4. Mobile.** Une application dans l'esprit des applications Claude ou Gemini, avec les fonctions
mail, agenda et le reste, pour suivre CrOliX en déplacement.

**5. Contrôle total.** Un panel desktop complet : couper les services, voir le coût des appels, régler
les variables en direct, contrôler les autorisations et les accès Google (Gmail, Agenda, Drive,
Tasks…). Ce contrôle est obligatoire : pas de surcoût inutile, pas de perte de contrôle.

## Le critère du VIP

> **Utilisable de bout en bout sur une semaine sans point de tension.**

Échéance : 31 décembre 2026. Sans application mobile, par exemple, l'information manque en
déplacement : le critère n'est pas rempli.

## Hors VIP

- Le streaming.
- L'apprentissage par imitation (ex-Lun'Gula, testé sur osu!).
- Le pipeline de développement multi-agents (ex-Lun'Ira).

## Principe d'architecture

Le core est privé. Les satellites sont des outils autonomes qui portent leur propre logique métier et
peuvent être câblés au core.

## Points noirs à ne pas reproduire

- Un panel lourd et peu ergonomique : une logique back peut-être propre, mais un usage qui ne suit pas.
- Des tests qui dépendent du NAS.
- Un front en dessous du niveau visé (référence de qualité : myBrain).
