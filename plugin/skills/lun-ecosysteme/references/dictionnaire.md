<!-- Copie générée depuis standards/dictionnaire.md : ne pas modifier ici -->
# Dictionnaire

> Les mots de l'écosystème Lun' : ce que chacun désigne, et ce qu'il ne désigne pas. Vaut pour les textes, les écrans et
> la parole de Natsume. Un mot absent d'ici n'est pas un terme : il s'emploie dans son sens courant. Un mot qui porte une
> décision s'ajoute ici avant de s'écrire ailleurs. Arbitré par CrOliX le 10/11/2026 (lun-docs#129).

## Les règles

- **Un mot, un objet.** Deux mots ne désignent jamais la même chose, et un mot n'en désigne jamais deux.
- **Le dictionnaire décide des textes et des écrans, pas du code.** Un nom de fonction, de table ou de route ne se renomme
  que si le renommage vaut une rupture ; l'entrée dit alors le nom que porte le code.
- **Une entrée qui change** passe par une PR sur ce fichier, avant les textes qui l'emploient.

## L'anatomie

| Terme | Désigne | Ne désigne pas, ne s'écrit pas |
|---|---|---|
| **Natsume** | L'entité : une personnalité, des souvenirs, une voix, présente sur plusieurs surfaces | « l'agent manager » (c'est son rôle, pas son nom) ; l'agent par défaut d'un fournisseur de modèle |
| **le core** | Lun'Anima : le cœur et le cerveau de Natsume. Qui elle est, ses souvenirs, ses émotions ; la réflexion et la décision ; le centre de pilotage | la bibliothèque ; un métier de satellite |
| **le cerveau** | Le core, quand on parle de réfléchir et de projeter l'action | Avaritia (dans le code : `brain`, nom gardé) |
| **la bibliothèque** | Lun'Avaritia : ce qui se sait et se garde, en fiches liées et en faits sourcés | « le cerveau », « le second cerveau » ; les souvenirs de Natsume |
| **le corps** | Lun'Luxuria : lui parler et la voir ; ses sens et ses mains ; être vue et entendue par d'autres | ce qui est dit (le core le décide) |
| **la journée** | Lun'Acedia : les mails, l'agenda, les tâches, triés à la source | |
| **un satellite** | Un projet autonome, son dépôt et son outil, qui porte son propre métier et marche sans le core | « poste » quand il n'est pas relié |
| **un poste** | Un satellite une fois relié au core, vu par Natsume : elle lui délègue, lit son bilan, écoute ses alertes | le projet ou son dépôt |
| **un monde** | L'identité visuelle d'un satellite : sa couleur d'accent sur les surfaces communes | le satellite lui-même |
| **l'agent du poste** | L'agent d'un satellite, neutre et réglable, vrai seul comme relié | « sous-agent » ; un nom en dur |
| **CrOliX** | La personne que Natsume assiste | « l'utilisateur », dans les textes de l'écosystème |

## Ce que Natsume est

| Terme | Désigne | Ne désigne pas, ne s'écrit pas |
|---|---|---|
| **le socle** | Son identité fixe, écrite dans le code, en tête de chaque tour | le MVP |
| **le tempérament** | Sa façon d'être, qui évolue seule à partir de ses souvenirs, sans validation | un réglage |
| **l'humeur** | Ce qu'elle ressent maintenant, calculé de sa journée, jamais stocké | le tempérament |
| **un souvenir** | Un fait de la relation, avec sa réaction et sa provenance, gardé au core | une fiche ; « la mémoire » employé seul |
| **le portrait** | Ce qu'elle a compris de CrOliX, consolidé la nuit ; une déduction y reste une hypothèse | une fiche de la bibliothèque |
| **le contexte chaud** | Ce qu'elle a en tête pour la journée, composé le matin | l'historique de la conversation |
| **la présence** | Le fait qu'elle soit là pour CrOliX à son poste : annoncée par le corps, elle ouvre la voix et la parole spontanée | être connecté |
| **l'absence** | L'arrêt de la présence quand CrOliX n'est plus à son poste | la sourdine |

## Ce qui circule

| Terme | Désigne | Ne désigne pas, ne s'écrit pas |
|---|---|---|
| **une carte** | Une proposition de traitement préparée par un agent, qui attend dans une file que CrOliX la tranche. Elle appartient au poste qui l'a créée ; le core la relaie | la validation d'une action immédiate |
| **une permission** | La validation d'une action immédiate sur le poste : elle bloque l'action tant que CrOliX n'a pas répondu (une fois, toujours, refuser) | une carte ; les accès Google d'Acedia |
| **un geste** | Ce que CrOliX fait sur une carte : valider, modifier, refuser | une action d'un agent |
| **la délégation** | Natsume confie une demande à l'agent d'un poste, qui fait le travail et rend un résumé et des cartes | refaire le travail au core |
| **un événement** | Ce qu'un poste signale au core, avec son importance | une notification (son rendu) |
| **l'importance** | Le palier d'un événement, de P0 à P4 : interrompre, prévenir, signaler, résumer, journal ([`notifications.md`](notifications.md)) | |
| **une urgence** | Un événement de palier P0 : il interrompt, et se dit malgré la sourdine | tout ce qui presse |
| **le bilan du jour** | Ce qu'un poste a reçu, fait et laissé en attente dans la journée | la lettre du matin |
| **un plafond** | La dépense au-delà de laquelle un service s'arrête, par jour ou par mois | un budget indicatif |
| **la pause** | L'arrêt de toute action automatique de l'écosystème, sauf les urgences ; CrOliX peut toujours écrire | la sourdine |
| **la sourdine** | Le silence du corps seul : ses sens et sa voix coupés, sauf une urgence | « le mute » ; la pause |
| **le jeton** | Ce qu'un appareil ou un poste présente pour être reconnu | une valeur de design : dire « variable de design » |
| **appairer** | Faire reconnaître un appareil (téléphone, navigateur, Luxuria) par un code à 6 chiffres | relier un poste |
| **relier** | Brancher un satellite au core : il devient un poste | appairer un appareil (dans le code : `pair`, `connect`) |

## Le temps de Natsume

| Terme | Désigne | Ne désigne pas, ne s'écrit pas |
|---|---|---|
| **une routine** | Ce que le core fait seul à heure fixe | une action d'un poste |
| **la nuit** | La routine de 5 h : elle relit la journée, garde les souvenirs, consolide le portrait | « la veille », « la veille de nuit » (dans le code : `night`) |
| **la lettre du matin** | Le texte que Natsume écrit chaque matin, avec ce qui attend CrOliX : alertes, échéances, contradictions, cartes | « le point du matin » |
| **la veille** | Suivre des sources d'information par thème | la routine de nuit |

## Les objets de chaque surface

| Terme | Désigne | Où |
|---|---|---|
| **un lieu** | Un des six écrans du core : Bureau, À trancher, Constellation, Journal, Atelier, Natsume | core |
| **la bande** | La ligne d'état unique en haut de l'app : l'état le plus grave l'emporte | core |
| **le fil** | La conversation écrite avec Natsume | core, Luxuria |
| **une boîte** | Un rangement de mails, par expéditeur et par urgence | Acedia |
| **une règle** | Ce que CrOliX a dit de faire d'un mail, une fois pour toutes | Acedia |
| **une fiche** | Une page de la bibliothèque : une personne, un lieu, un projet, une idée, ses faits et ses liens | Avaritia |
| **un fait** | Une affirmation sourcée et datée d'une fiche ; démenti, il est barré, jamais effacé | Avaritia |
| **un brouillon** | Ce que l'agent propose d'écrire dans une fiche, avant validation | Avaritia |
| **le lot** | Ce que l'agent de la bibliothèque traite en une fois, chaque jour | Avaritia |
| **la scène** | La fenêtre de Luxuria en grand : le corps, l'état, le fil | Luxuria |
| **le petit mode** | Luxuria réduite à une vignette, toujours au premier plan | Luxuria |
| **seul, relié** | Les deux fonctionnements de Luxuria : sur un modèle choisi, ou corps de Natsume | Luxuria |

## La méthode

| Terme | Désigne | Ne désigne pas, ne s'écrit pas |
|---|---|---|
| **le MVP** | Le premier état utilisable : la journée, la bibliothèque, le pilotage par Natsume. Atteint quand une semaine de rodage sur le desktop passe sans point de tension (12/11) | « le VIP » |
| **un chantier** | Un travail borné, d'une issue à une PR fusionnée ([`workflow.md`](workflow.md)) | une tâche d'un plan |
| **un palier** | Une étape d'un projet, livrable et utilisable seule | un chantier |
| **le niveau** | Ce qu'un chantier exige : trivial, standard, critique, exceptionnel | l'importance d'un événement |
| **Show, Ask** | Show : se prouve sur le laptop, la PR passe prête. Ask : seul le desktop le prouve, elle reste en brouillon ([`git.md`](git.md)) | |
| **l'inbox** | Les observations hors périmètre, gardées en issues pour plus tard | un journal |
| **la recette** | L'essai d'un chantier par CrOliX, en conditions réelles | les tests |
| **le rodage** | Une période d'usage quotidien qui éprouve l'ensemble | une recette |
| **la machine dédiée** | La machine de la maison où tournera la prod après le rodage ([ADR 0012](../adr/0012-prod-machine-dediee.md)) ; le mot est choisi par CrOliX le 13/11 | « le serveur dédié » ; « le serveur » seul : celui auquel Lun'Luxuria est reliée, ou celui de la chaîne |
| **le NAS** | Le stockage de la maison : les copies et les fichiers | la prod |
| **le kit** | Les composants de front communs, tenus dans lun-docs et recopiés | un composant propre à un projet |
