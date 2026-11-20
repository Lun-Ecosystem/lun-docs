# La version VIP, bornée par ce que chaque outil promet. Recadrage

> Recadrage du 19/11, demandé par CrOliX après un tour sur sa veille : « éviter de partir en roue libre », puis
> « reprendre le contexte du projet au complet et re-borner », pour une version VIP « fonctionnelle vis-à-vis des
> promesses des outils » ; après elle, de la maintenance, des ajouts et le retravail du design. Ce document relit les
> promesses écrites contre le code (§ 3), la voix contre la veille (§ 4), et propose des bornes et un ordre (§ 6).
> Les choix marqués **[avis Claude]** étaient des propositions.
>
> **Tranché par CrOliX le 19/11** : les six décisions sont au § 7, et le § 6 est mis d'accord avec elles.
>
> **Corrigé par CrOliX le 20/11** ([ADR 0014](../../adr/0014-mvp-sur-le-nas.md)) : ce recadrage reprenait « la
> semaine de rodage sur le desktop » sans voir que le desktop ne reste pas allumé. Le MVP tourne sur le NAS, sauf
> Lun'Luxuria ; la semaine s'y joue, après sa mise en service. « La session du desktop » (§ 6.1, § 6.4, § 7 point 5)
> ne garde que la voix ; l'ordre à jour est dans la feuille de route, « Le recadrage du 20/11 ».

## 1. La borne

[`vision.md`](../../vision.md) la donne : « utilisable de bout en bout sur une semaine sans point de tension »,
échéance le 31 décembre 2026. Depuis le 12/11, cette semaine, jouée sur le desktop, est la porte du MVP
([état cible](2026-11-10-etat-cible-cadrage.md), § 3). Au 19/11 il reste six semaines, dont une de rodage et une
marge pour la rejouer.

Ce que CrOliX ajoute le 19/11 : la version VIP tient **ce que les outils promettent**. Un chantier qui ne se
rattache ni à une promesse ni à la semaine passe après elle.

Une règle pour lire le reste, validée par CrOliX le 19/11 : une promesse écrite est soit **tenue et prouvée**, soit
**retirée du texte** et inscrite « après le VIP ». Il n'y a pas de troisième état.

## 2. Ce qui a été lu, et comment

- Les promesses : `vision.md`, le README de chaque dépôt, sa page sur le site, sa ligne d'arrivée (état cible, § 4).
- Le code sur `main` au 19/11, par cinq relevés : un par application, et un sur la chaîne vocale. **Aucun test n'a
  été lancé ni aucun écran ouvert** : « fait » veut dire que le code existe et qu'un test le couvre, pas qu'il a servi.
- La veille de CrOliX (dossier `perplexity/` de son poste, hors dépôt), lue en entier pour la voix et la présence.

## 3. Les promesses, outil par outil

### 3.1 Lun'Acedia, la journée

| Promesse | État |
|---|---|
| Lire les mails ; préparer des réponses, sans jamais envoyer | Fait, testé |
| Pré-trier : corbeille, indésirables, archive, boîtes selon l'expéditeur | Fait, testé |
| Ranger selon l'urgence | Partiel : l'importance ne sert qu'à poser une étiquette |
| Sous le seuil il propose, au-dessus il range | Fait, testé |
| Suivre l'agenda ; gérer les tâches | Fait, testé |
| Repérer les événements qui se chevauchent et proposer de les déplacer | **Absent** : seul l'affichage côte à côte existe |
| La veille tech | **Absent** |
| Les notifications GitHub traitées à la source | **Absent** |
| Un agent borné par des cartes, neutre par défaut | Fait ; « Pina » reste écrit en dur dans un message visible |
| « Il remplace Gmail, Agenda et Tasks au quotidien » | **Jamais éprouvé** : aucune semaine d'essai |

### 3.2 Lun'Avaritia, la bibliothèque

| Promesse | État |
|---|---|
| Une mémoire vectorielle | **Absent**, par choix écrit : recherche plein texte (ADR 0005, « pas dans la v1 ») |
| Des fiches à la façon d'Obsidian ; import et export | Fait ; l'export écrit sur le disque du serveur, sans téléchargement |
| Rien n'entre sans validation ; un fait démenti est barré, jamais effacé | Fait, testé |
| Contradictions et doublons soumis | Fait, testé |
| Ce qu'elle apprend en conversation y entre | Partiel : par le lot de la nuit, puis la validation ; aucun test de bout en bout |
| Un fait cite mot pour mot une parole entendue (ligne d'arrivée) | **Absent** |
| Tenir des milliers de fiches sans ralentir | Non mesuré |

### 3.3 Lun'Anima, le core

| Promesse | État |
|---|---|
| Elle fait le travail, sous des garde-fous réglables | Partiel : toute écriture est une carte ; aucun niveau d'autonomie réglable |
| Une humeur qui colore ses réponses | Partiel : un seul état, « tendue », tiré des urgences et des cartes ; rien vers la voix ni le corps |
| Une personnalité qui évolue | Fait, sous garde-fous ; la barre se juge par CrOliX (N) |
| Mobile : une app avec mail, agenda et le reste | Partiel : l'app converse, montre les cartes et la file ; ni boîte ni agenda consultables |
| Couper les services ; voir les coûts | Fait, testé : une pause globale, par poste, des plafonds par jour et par mois |
| Régler les variables en direct | Partiel : plafonds, modèle, parole, postes ; pas les heures des routines ni le plafond de la nuit |
| Contrôler les accès Google (Gmail, Agenda, Drive, Tasks) | **Absent** de l'app du core ; Drive nulle part |
| Parler d'elle-même, à propos | Fait, éteint par défaut : après un silence, trois fois par jour, se tait après deux phrases sans réponse |
| Une urgence dite sans modèle | Fait, testé |
| Une carte tranchée à la voix | Fait dans le code ; **verrouillé par décision** (ADR 0011) jusqu'à la règle des mots des gestes |
| La nuit et la lettre du matin, rattrapées si la machine dormait | Fait, testé ; jamais observé sur une vraie nuit manquée |

### 3.4 Lun'Luxuria, le corps

| Promesse | État |
|---|---|
| Elle réagit à voix haute ; une vraie conversation, qu'on peut couper | Fait ; § 4 pour l'écart de délai |
| Le micro t'appartient ; la sourdine, l'absence | Fait, testé |
| Seule ou reliée ; la scène, le petit mode, l'icône, le démarrage avec Windows | Fait, testé |
| Elle voit l'écran | **Absent** |
| Un avatar dans VTube Studio | **Absent** : deux images fixes, ou un souffle |
| Elle s'accorde à ce que fait CrOliX | Partiel : le clavier, la souris, le micro pris ; ni fenêtre active ni manette |
| Compagne de jeu ; agir sur le poste ; être vue par d'autres | **Absent** (lignes d'arrivée, après le MVP) |

### 3.5 Ce qui traverse les quatre

- **L'installation passe par le terminal** : un fichier d'environnement, une clé à générer par une commande, un
  client Google créé à la main (lun-acedia#55) ; pour Luxuria, `uv`, une voix, whisper-server et RVC installés à part,
  sans installateur ni mise à jour. Le premier appareil, lui, se relie sans terminal depuis le 16/11. La décision du
  08/11 tient : le terminal une fois, avant la semaine, et rien ne l'exige pendant.
- **Les textes ne disent pas le code.** `vision.md` promet des choses jamais commencées (§ 3) ; le site range sous
  « à venir » des points déjà faits, tait la sourdine et l'absence, qui existent, et annonce encore le NAS
  (corrigé le 20/11 : cette ligne disait d'abord, à tort, qu'il annonçait un avatar et taisait la scène) ; lun-luxuria#6 reste ouverte
  alors que la confiance n'est plus fixe.
- **Rien n'a servi une semaine.** Ce que les README promettent est en grande partie écrit et testé ; aucune de ces
  promesses n'a été éprouvée par l'usage.

## 4. La voix, face à la veille

| Ce que la veille prescrit | Chez nous | Lecture |
|---|---|---|
| Une cascade locale : détecter, transcrire, répondre par phrases, dire, convertir la voix | Identique | Conforme |
| Silero pour détecter la voix | Silero, dans la page | Conforme |
| Un modèle de fin de tour, ou 700 ms de silence en repli | Le modèle mesuré puis écarté ; 700 ms | Conforme au repli |
| Un numéro par énoncé ; le texte gardé coupé à ce qui a été dit | Fait | Conforme |
| Une phrase d'attente avant un outil lent ; les secrets filtrés avant la synthèse | Faits | Conforme |
| « Elle ne doit pas s'écouter » | L'annulation d'écho du navigateur, seule | Jamais prouvé sur un vrai son |
| La voix traitée comme un flux | La synthèse et la conversion rendent la phrase entière (lun-luxuria#7) | **Écart** |
| Du dernier mot au premier son : 1,5 s en médiane | 2,8 s le 07/11, 3,4 s le 10/11 ; non remesuré depuis | **Écart** |
| Une mesure par étape, comparée à un budget | Les délais sont tracés ; aucun budget ne les juge | **Écart** |

**Pas de dérive sur l'architecture** : chaque choix vient de la veille ou d'une mesure. **Une dérive sur les
priorités** : la veille met le délai avant l'interruption ; depuis le 11/11, les chantiers de la voix ont travaillé
l'interruption, ses cas limites et leur preuve, et le délai n'a pas été remesuré.

Le banc de présence n'est pas en cause dans son principe : son [cadrage](2026-11-11-banc-presence-cadrage.md) le
fonde sur Pipecat, AIRI et LiveKit. Sa taille l'est : le dossier de la présence compte plus de lignes que le code de
Luxuria qu'il prouve, et le plan suivant ([lun-docs#183](https://github.com/Lun-Ecosystem/lun-docs/pull/183)) lui
ajoute treize tâches.

Le nouveau desktop (une RTX 5070 ou 5070 Ti, début 2027, selon les prix) sépare les écarts. Il ne concerne que
Luxuria, le poste : le core, Acedia et Avaritia visent un serveur, et aucune carte graphique n'est une condition
pour eux.

| Écart | Attend la RTX | Se traite sans elle |
|---|---|---|
| La vitesse de la transcription, de la conversion de voix, une synthèse plus riche | Oui | Non |
| La phrase entière rendue au lieu de blocs joués au fil de l'eau | Non | Oui, à décider sur une mesure (B3) |
| Le délai de fin de tour ; le premier mot du modèle | Non | Oui ; le second tient au modèle |
| Un budget par étape ; l'écho prouvé | Non | Oui |

D'ici là, rien ne se règle pour la carte actuelle : ce qui compte est que chaque brique se remplace sans toucher à
la conversation, et qu'une mesure par étape existe le jour du changement.

## 5. Ce que la relecture montre

1. **Les outils sont plus près du but que la vision ne le laisse croire.** L'essentiel de ce que promettent les
   README est écrit. Ce qui manque est de deux ordres : des promesses de `vision.md` jamais commencées, et la preuve
   par l'usage.
2. **Le chemin critique passe par le desktop.** La porte est la semaine de rodage, précédée d'une session dont la
   liste (feuille de route, § 4) a grossi à chaque chantier. Depuis le 12/11, « tenir en continu » et « le premier
   contact » ont préparé la semaine ; la session, elle, n'a pas eu lieu, et les chantiers de la voix l'ont allongée.
3. **Nous corrigeons encore par symptôme**, comme le disait déjà l'étude du 10/11 : « le tour » laisse sept issues de
   cas limites autour de la retenue et des verdicts.
4. **`vision.md` attend sa réécriture depuis le 10/11** (état cible, § 8, point 4). Tant qu'elle promet l'écran,
   l'avatar et la mémoire vectorielle « indispensables au VIP », la version VIP est par définition inatteignable.

## 6. Les bornes, après les décisions du 19/11

### 6.1 Dans le VIP

Ce qui est écrit, plus ce qui suit, et la semaine :

- **Les textes d'accord avec la borne** : `vision.md` réécrite (l'incarnation d'abord, ce que le VIP tient, ce qui
  vient après), le site, les README, les issues closes ou mises à jour.
- **Trois petites promesses, tenues** : les événements qui se chevauchent (Acedia les repère et propose par une
  carte d'en déplacer un ; l'action de déplacement existe déjà) ; « Pina » sorti des textes visibles ; l'export de
  la bibliothèque qui se télécharge.
- **La voix, au minimum** : la règle des mots des gestes, qui lève le verrou des cartes ; la langue (B2) ; un délai
  par étape lu à la chaîne et comparé au budget de la veille. Cible du VIP sur le desktop actuel : **2,5 s en
  médiane** du dernier mot au premier son (ADR 0011) ; si la mesure la dépasse, un seul chantier, sur l'étape la plus
  lente. Rien d'autre sur les cas limites avant la semaine.
- **La session du desktop, resserrée** : ce qui conditionne la semaine (Google en production, le téléphone, le
  redémarrage, une restauration, la mesure des gestes, la langue). Les gestes à réentendre se notent pendant la
  semaine au lieu de la précéder.

### 6.2 Après le VIP

Retirés de ce que le VIP promet, et inscrits comme la suite :

- **Le premier chantier : la recherche par le sens**, hybride, sur le modèle de myBrain, la référence de CrOliX : le
  plein texte reste, des vecteurs calculés par l'API d'un fournisseur à l'écriture s'y ajoutent, et sans clé ou en
  panne la recherche redevient du plein texte. Aucune carte graphique. Pendant la semaine, les questions restées
  sans fiche se notent : elles serviront à le mesurer.
- Le corps : voir l'écran ; l'avatar animé ; l'humeur qui se voit ; la compagne de jeu ; agir sur le poste ; le
  stream.
- La journée : la veille tech ; les notifications GitHub.
- Le contrôle : les accès Google vus depuis le core.
- Le front : le kit reste tel quel ; le kit commun partout et le retravail du design viennent après.

**L'installation reste telle quelle pour l'instant.** Le premier appareil, la liaison des postes et la clé du modèle
se font déjà par les écrans (chantier du 16/11). Ce qui passe encore par le terminal ou un fichier (la clé secrète de
chaque application, Google depuis l'écran, un script d'installation, l'installateur de Luxuria) se regarde **en toute
fin de VIP** : ce qui peut se mettre en place, et à quel palier.

### 6.3 Ce qui s'arrête

- Le plan du banc de présence tel qu'il est (lun-docs#183) : réduit à quatre ou cinq tâches, le délai par étape lu
  à la chaîne, les sons de toux posés, les résumés visibles, les tests du service de voix en CI. Le reste passe après
  le VIP.
- Tout nouveau chantier sur les cas limites du tour de parole : ses issues restent ouvertes, pour après la semaine.

### 6.4 L'ordre

1. Les textes d'accord avec la borne. Sur le laptop.
2. Les trois petites promesses, et le banc réduit. Sur le laptop, en parallèle.
3. La mise en service du NAS, puis la session du desktop pour la voix seule (corrigé le 20/11, ADR 0014).
4. La semaine de rodage, sur le NAS, puis sa marge, avant le 31 décembre.
5. En toute fin de VIP : l'installation.

## 7. Ce que CrOliX a tranché, le 19/11

1. **La règle** : une promesse est tenue et prouvée, ou retirée du texte et inscrite « après le VIP ».
2. **Ce qui sort du VIP** : tout le § 6.2. La recherche par le sens est le premier chantier d'après, sans carte
   graphique : Avaritia se déploie sur un serveur et reste libre. Le kit reste tel quel. L'installation, qu'il range
   dans le MVP, reste telle quelle pour l'instant et se regarde en toute fin de VIP.
3. **Les trois petites promesses** entrent dans le VIP : les chevauchements d'agenda, « Pina » hors des textes
   visibles, l'export téléchargeable.
4. **Le plan du banc** (lun-docs#183) : réduit.
5. **La session du desktop** : resserrée. Elle ne dépend pas de la RTX, dont l'achat suit les prix (« hors de
   question de claquer 1 k dans le GPU ») ; CrOliX peut être sur le desktop quand il veut, la date se fixe quand le
   laptop est prêt.
6. **La cible de délai du VIP** : 2,5 s en médiane sur le desktop actuel ; les 1,5 s de la veille restent l'horizon
   avec la RTX.
