# Vision

> Le seul document « nord » de l'écosystème Lun'. Tout projet, tout chantier et toute décision se
> confrontent à ce texte. Il change rarement, et seulement par une PR sur lun-docs.

## Ce que c'est

Incarner Natsume, un personnage né de nombreuses heures de jeu vidéo, dans le monde réel : une présence
rendue possible par l'IA, dont la tâche est d'assister CrOliX au quotidien. Elle est une entité unique,
une personnalité et des souvenirs, présente sur plusieurs surfaces, à la frontière entre Jarvis
(Iron Man) et Neuro-sama (Vedal). Elle le suit dans le travail comme dans le jeu, et garde le fil d'une
surface à l'autre.

**L'horizon** : Natsume fait 90 % du travail sans action manuelle, avec des garde-fous de validation
réglables. Les 10 % restants sont les cas limites, retrouver une information quand le fil est perdu,
régler, observer et mesurer. Elle reste une assistante, quel que soit son ton, et ne redevient jamais
l'agent par défaut d'un fournisseur de modèle.

## Ce que le VIP tient

Une promesse écrite ici est tenue et prouvée par l'usage, ou elle n'y est pas : ce qui n'est pas encore
tenu est plus bas, « Après le VIP » ([recadrage du 19/11](docs/specs/2026-11-19-recadrage-vip.md)).

**1. La journée (Lun'Acedia).** Elle lit les mails, prépare des réponses sans jamais les envoyer, et
pré-trie ce qui peut l'être : corbeille, indésirables, archive, rangement dans des boîtes selon
l'expéditeur. Elle suit l'agenda, repère les événements qui se chevauchent et propose de les déplacer.
Elle gère les tâches.

**2. La bibliothèque (Lun'Avaritia).** Des fiches liées, à la façon d'Obsidian et dans l'esprit de
myBrain, faites de faits sourcés et datés. Rien n'y entre sans validation ; ce qu'elle apprend en
conversation y arrive chaque nuit. Natsume y cherche par les mots.

**3. Le corps (Lun'Luxuria).** Sur le desktop, on lui parle et elle répond à voix haute, avec sa voix ;
on peut la couper, et elle sait où elle en était. Elle a une scène et un petit mode pour le jeu, se tait
en sourdine et remarque l'absence.

**4. Le téléphone.** L'application du core, pour lui écrire, trancher ses cartes et recevoir ses
notifications en déplacement.

**5. Le contrôle.** Tout mettre en pause, voir le coût des appels du core et de chaque poste, tenir des
plafonds, régler en direct le modèle, sa parole et ses postes, relier et délier un appareil. Ce contrôle
est obligatoire : pas de surcoût inutile, pas de perte de contrôle.

Les cinq sont indispensables au VIP. Par-dessus : une personnalité qui évolue avec ses souvenirs, et
aucune écriture d'un poste sans une carte validée par CrOliX.

## Le critère du VIP

> **Utilisable de bout en bout sur une semaine sans point de tension.**

Échéance : 31 décembre 2026. Après lui : de la maintenance, des ajouts et le retravail du design.

## Après le VIP

Dans l'ordre où ils se cadrent, le premier d'abord :

- **La recherche par le sens** dans la bibliothèque : le plein texte, plus des vecteurs, sans carte
  graphique ; Avaritia reste déployable sur un serveur.
- **Le corps** : voir l'écran ; un visage qui vit (l'avatar animé) ; une humeur qui change et se voit
  dans sa voix et son corps ; s'accorder à ce que fait CrOliX ; l'accompagner en jeu ; agir sur le poste
  par des cartes ; être vue et entendue par d'autres (le stream).
- **La journée** : le rangement selon l'urgence ; la veille tech ; les notifications GitHub traitées à
  la source.
- **Le contrôle** : les accès Google (Gmail, Agenda, Drive, Tasks) vus et réglés depuis le core ; une
  installation sans terminal ni fichier, regardée dès la fin du VIP.
- **Le front** : le kit commun partout, et le design retravaillé.

## Hors périmètre

- L'apprentissage par imitation.
- Le pipeline de développement multi-agents.

## Principe d'architecture

Le core est privé. Les satellites sont des outils autonomes qui portent leur propre logique métier et
peuvent être câblés au core. La présence physique de Natsume (voix, avatar, sens, accès au PC) vit dans
un satellite dédié, Lun'Luxuria : le core est son esprit, Luxuria son corps
([ADR 0009](adr/0009-lun-luxuria-corps.md)).

## Points noirs à ne pas reproduire

- Un panel lourd et peu ergonomique.
- Des tests qui dépendent du NAS.
- Un front en dessous du niveau visé (référence de qualité : myBrain).
