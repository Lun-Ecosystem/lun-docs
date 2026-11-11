# Prouver la présence sans l'oreille : un banc qui joue, mesure et explique. Cadrage

> Cadrage du 11/11, à discuter avec CrOliX **avant tout plan**. Il part de ce qu'il a dit ce jour-là (§ 1), relit ce
> que nous avons (§ 2) et ce que font trois projets voisins pour tester un agent vocal (§ 3), et propose une cible
> (§ 4) et un ordre (§ 5). Les choix marqués **[avis Claude]** sont des propositions. Rien n'est codé.

## 1. Ce que CrOliX a dit, le 11/11

- Sur l'axe de la présence, **son oreille n'ajoute rien** : lors de ses essais, les délais et ce qui est vraiment
  envoyé lui échappaient. Le seul défaut qui s'entend est ailleurs : la synthèse en français sur un modèle anglais.
- Il veut **automatiser les tests de présence au maximum**, quitte à passer par le desktop : un environnement avec
  assez de données, qui mesure le moindre écart, dit sa source, et dit si chaque mécanisme a joué.
- Il veut **tirer parti des sources exploitables** : les projets GitHub, la veille Perplexity.
- Tels quels, il doute de l'efficacité de nos tests de bout en bout.

Conséquence : la « liste d'écoute » de la [feuille de route](../plans/2026-11-07-feuille-de-route-mvp.md) (§ 4) n'est
plus une preuve. Chacun de ses points doit devenir un scénario joué par une machine.

## 2. Ce que nous avons, et ce qui manque

| Outil | Ce qu'il prouve | Sa limite |
|---|---|---|
| `npm run banc` (Lun'Luxuria) | La détection de voix et la fin de phrase sur 174 enregistrements ; depuis le 11/11, ce qui coupe sa réponse | La transcription, le serveur et sa voix sont simulés. Un chiffre par fichier, pas de déroulé. |
| Tests de la conversation et de la voix | Chaque mécanisme, isolé, sur des événements fabriqués | Aucun son, aucun délai réel. |
| La preuve dans la page (un script hors dépôt) | La page construite entend un fichier joué comme micro | Un seul essai à la main, rien n'est vérifié après l'écoute. |
| `first-word`, `wait-phrase`, `natsume:eval` (Lun'Anima) | Ce que le vrai modèle fait d'une consigne | Le serveur seul, sans voix. |
| La mesure de l'écran (« Mesures de cette session ») | Un délai par tour, de la fin de phrase au premier son | Un seul nombre : il ne dit pas où le temps est passé. |

Ce qui manque :

1. **Un déroulé.** Aucun tour ne laisse la suite datée de ce qui s'est passé : la voix détectée, la pause, la
   phrase envoyée à l'essai puis retirée, le texte transcrit et sa confiance, le verdict du filtre, ce qui est parti
   au serveur, le premier mot du modèle, l'appel à un poste et sa durée, chaque phrase synthétisée, le premier son,
   la suspension, la reprise, la coupure. C'est exactement ce que l'oreille ne voit pas.
2. **Des scénarios.** Rien ne décrit une conversation à jouer avec ce qu'on en attend, et dans quel délai.
3. **La chaîne entière, sans personne.** Aucun essai ne fait tourner ensemble la page, le service de voix et le
   serveur.
4. **Des taux.** Un essai dit « ça a marché une fois ». Ce qui tient à une course (une coupure, une reprise, un
   essai retiré) passe une fois sur deux sans qu'on le voie.

## 3. Comment les autres testent

Lu le 11/11 dans les dépôts clonés pour l'étude du 10/11 ; rien n'a été lancé.

### Pipecat : des scénarios joués contre le vrai agent

- Un **banc d'évaluation** se connecte à l'agent comme un client, joue le côté de la personne, écoute ce que l'agent
  dit et le juge.
- Un **scénario écrit** est une liste de tours : ce que la personne dit, puis les événements attendus dans l'ordre
  (voix détectée, transcription contenant tel texte, appel d'outil, réponse), chacun avec un délai maximal. Un tour
  peut ne rien dire et seulement attendre ce que l'agent fait.
- **Deux modes** : en texte (rapide, silencieux), ou en son. En son, la phrase de la personne est synthétisée par
  un modèle local et gardée en cache, ou lue depuis un enregistrement ; la voix de l'agent est retranscrite par un
  modèle local avant d'être jugée. Tout tourne sans clé.
- **Répéter** : `--repeat 50` rend un taux de réussite par scénario, parce qu'« un agent peut réussir une fois sur
  deux et sembler aller bien à chaque essai ». Les échecs sont rangés par espèce (délai dépassé, appel d'outil
  manquant, refus du juge).
- **Ce qui reste d'un essai** : une ligne par essai dans un fichier de résultats, avec chaque attente et ce qu'elle
  a trouvé ; pour un échec, tous les événements vus ; l'enregistrement sonore de la conversation.
- **Une suite par mécanisme** : des centaines de conversations courtes, chacune une seule question, jouées contre
  chaque modèle. Chaque scénario existe deux fois : tel qu'écrit, et en minuscules sans ponctuation, « parce que
  c'est ce que le modèle voit d'une transcription ».
- Un scénario **simulé** remplace les tours écrits par un personnage joué par un modèle, avec un but ; un juge lit
  la conversation entière.

### AIRI : le fichier son dans la vraie appli

- Un enregistrement devient le micro d'un vrai Chromium, et traverse la vraie appli (dans le navigateur et dans la
  fenêtre de bureau) : détection de voix, transcription, modèle, synthèse, lecture, écran.
- **Le modèle est remplacé par une réponse écrite d'avance**, servie par un faux serveur compatible : la sortie ne
  dépend plus d'un modèle, et le test ne coûte rien.
- L'appli écrit des **traces datées** de chaque étape ; un test de délai lit ces traces, et en cas d'échec le
  message porte la chronologie mesurée.
- Chaque cas choisit lui-même ses briques : aucune configuration « chaîne complète » cachée.

### LiveKit Agents : une mesure par étape, et de fausses briques

- Chaque étape émet sa mesure : délai entre la fin de la voix et la décision de fin de tour, délai de transcription,
  premier jeton du modèle, premier son de la synthèse, coupures et relances comptées.
- La suite de tests remplace la transcription, le modèle, la synthèse et la détection de voix par de **fausses
  briques réglées à la milliseconde** : une conversation entière se joue de façon exacte, sans réseau.
- Une simulation rend deux verdicts : celui du juge, et un veto du développeur sur l'état réel (la base contient-elle
  bien ce qui a été demandé ?). Le veto peut faire échouer, jamais sauver.

### La veille de CrOliX

Relue le 11/11 : le dossier `perplexity/` de son poste, hors dépôt (195 entrées, les schémas du flux cible, les
règles testables). Ce qu'elle apporte à ce banc :

- **Un budget par étape**, qui donne ses seuils au déroulé : détection de voix sous 30 ms, fin de tour sous 100 ms,
  transcription sous 300 ms, première phrase du modèle sous 700 ms, synthèse sous 400 ms, conversion de voix sous
  100 ms ; du dernier mot au premier son, moins de 1,5 s en médiane sur le PC.
- **Des tests d'acceptation déjà écrits**, qui sont des scénarios tout faits : une urgence reçue en conversation
  est dite à la fin de la réplique, pas pendant ; deux relances ignorées font taire la parole spontanée vingt
  minutes ; une journée rejouée ne dépasse pas six prises de parole par heure.
- **Des règles de conception** (Cartesia) : parler avant l'outil, couper sur interruption, des blancs de 200 ms.
- **Des outils de traces** : Langfuse, OpenLIT, tous deux sur OpenTelemetry.

Ce qu'elle ne contient pas : **aucune source sur la façon de tester un agent vocal**. Ni banc d'évaluation, ni
jeu de données de prise de parole, ni outil d'appelant simulé. Les entrées « voix » portent sur les briques
(synthèse, transcription, fin de tour), pas sur leur preuve. Un écart à noter : elle donne le modèle de fin de tour
à moins de 100 ms ; nous l'avons mesuré à 500 ms dans la page (plan « la fin de phrase »).

### Les quatorze fiches du 11/11

Une seconde recherche de CrOliX, déposée dans le même dossier : assistants vocaux, IA VTubeuses, synthèse,
transcription, conversion de voix. Lues en entier. Ce qu'elles apportent à ce banc :

- **Des cibles plus dures que la première veille**, et une mesure que nous n'avons pas : la fin de parole détectée
  en moins de 150 ms, le premier jeton du modèle en moins de 300 ms, le premier son en moins de 500 ms, audible en
  0,8 à 1 s, et **une interruption effective en moins de 200 ms**. Chez nous, la voix doit tenir 400 ms avant de la
  suspendre : par construction, nous sommes au double. Le déroulé doit porter ce délai.
- **« L'IA ne doit pas s'écouter elle-même »** : annulation d'écho, fenêtre de silence après sa parole, détection de
  sa propre voix. C'est un scénario à écrire : sa voix rejouée dans le micro ne doit pas la suspendre.
- **Deux transcriptions** (Persona Engine) : une rapide pour décider d'une coupure, une précise pour le texte. Une
  piste pour « ignorer un hm hm », que nous avions écartée faute de transcription pendant qu'on parle.
- **Un vocabulaire d'états** pour le déroulé (à l'écoute, réfléchit, parle, interrompue, exécute un outil, attend
  une confirmation, en erreur) et l'ordre d'une file de priorités, l'interruption de la personne en tête.
- **Des principes** qui disent la même chose que CrOliX : mesurer la latence de bout en bout, journaliser les
  décisions, construire l'observabilité dès le début.

Ce qu'elles ne contiennent pas : **toujours rien sur la façon de tester**. La grille d'évaluation (fiche 11) note
des projets de 1 à 5 sans dire comment la note se mesure ; la feuille de route (fiche 12) écrit « tests » en phase
6, sans contenu. Aucune source n'est citée au fil du texte : les chiffres de latence sont des cibles, pas des
mesures.

### Qui, parmi les projets cités, publie des tests

Vérifié le 11/11 sur GitHub, par les noms de fichiers seulement.

| Projet | Tests publiés |
|---|---|
| kimjammer/Neuro, AI-Vtube-Chat-Bot, Open-LLM-VTuber | Aucun |
| Amica | Deux tests unitaires de texte |
| Persona Engine | Un projet de tests unitaires (sept fichiers) |
| OpenAmika | Des tests unitaires, dont l'horloge du silence et le report de transcription |
| **Unmute** (Kyutai, MIT) | **Un client de charge** : il joue des fichiers son comme une personne, contre le vrai service, et rend la distribution des délais (médiane, 90e et 95e centile) ; un faux service de synthèse ; un module de mesures |
| Pipecat, AIRI, LiveKit Agents | Les bancs décrits plus haut |

Les compagnes à avatar ne testent presque pas leur voix. Les références utiles viennent des cadres d'agents vocaux
(Pipecat, LiveKit, Unmute) et d'AIRI. Unmute est à lire en entier avant le premier plan : survolé seulement.

### Au passage

Pipecat fait dire au modèle, en tête de chaque réponse, si la phrase de la personne était finie, coupée, ou si elle
demandait du temps. C'est une piste pour « attendre par le sens », à garder pour son cadrage.

## 4. La cible **[avis Claude]**

Un banc de présence fait de quatre pièces, chacune reprise d'un voisin.

1. **Le déroulé d'un tour** (LiveKit, AIRI). La page et le serveur écrivent chacun une suite d'événements datés,
   reliés par l'identifiant du message. Un tour se lit comme une ligne de temps, et chaque délai a un nom : fin de
   voix → fin de phrase, transcription, envoi, premier mot du modèle, poste, première phrase synthétisée, premier
   son. C'est la pièce qui manque le plus, et elle sert aussi en usage réel.
2. **Des scénarios écrits** (Pipecat). Un fichier par mécanisme : ce qui est dit et quand, ce qui est attendu, dans
   quel délai. Les neuf points de la liste d'écoute en sont les premiers : la toux pendant qu'elle parle, « arrête »
   à vingt secondes, deux phrases à trois secondes d'écart, la demande de mails et sa phrase d'attente…
3. **Trois niveaux pour les jouer**, du plus rapide au plus vrai :
   - **exact** : les vrais mécanismes, des briques fausses et réglées (transcription, serveur, voix). Dans la CI, en
     quelques secondes. Il existe en partie ;
   - **la chaîne sur le laptop** : la page construite dans un navigateur sans écran, le fichier son comme micro, le
     vrai serveur, un faux modèle qui rend une réponse écrite d'avance. Les mécanismes sont vrais, les délais sont
     ceux du laptop ;
   - **la chaîne sur le desktop** : la même suite, lancée par une seule commande, avec le vrai modèle, la vraie
     transcription et la vraie voix. C'est là que les délais comptent, et personne n'a besoin d'écouter.
4. **Des données et des taux** (Pipecat). Les phrases de la personne sont synthétisées depuis du texte, par
   plusieurs voix françaises, avec des hésitations et des bruits insérés à des instants choisis : la variété ne
   dépend plus de ses enregistrements. Chaque scénario est répété, et le relevé donne un taux, les échecs par
   espèce, et pour chaque échec le déroulé du tour.

Ce que cela ne prouve pas : que sa voix est agréable. C'est le seul point qui reste à l'oreille, et il est hors de
cet axe (la langue de la synthèse).

## 5. L'ordre proposé **[avis Claude]**

1. **Le déroulé**, dans Lun'Luxuria puis dans Lun'Anima : sans lui, les autres pièces mesurent sans expliquer.
2. **Le format des scénarios et le niveau exact**, avec les neuf points de la liste d'écoute.
3. **La chaîne sur le laptop.**
4. **Les données synthétisées et les taux.**
5. **La commande du desktop**, et la liste d'écoute retirée de la feuille de route.

Un plan par étape, chacun validé avant son code. L'étape 1 est petite et sert seule.

## 6. À trancher par CrOliX

- **Cette cible est-elle la bonne ?** En particulier : veut-il le niveau « desktop » dès maintenant, ou d'abord
  tout ce qui tient sur le laptop ?
- **Le faux modèle.** Sur le laptop, la chaîne peut tourner avec une réponse écrite d'avance (rien à payer, résultat
  stable) ou avec le vrai modèle (quelques centimes, résultat variable). Je recommande le faux modèle pour les
  mécanismes, le vrai pour les suites de consigne comme `wait-phrase`.
- **Les références.** CrOliX les élargit de son côté ; ce que la recherche devrait ramener est au § 7. Faut-il
  attendre ce retour avant le premier plan, ou commencer par le déroulé, qui n'en dépend pas ?

## 7. Élargir les références

CrOliX élargit lui-même les sources : les trois projets lus ici ne suffisent pas, et la veille ne couvre pas la
question. Ce qu'il faudrait qu'une recherche ramène, par ordre d'utilité pour ce banc :

1. **Des bancs d'évaluation d'agents vocaux, libres** : qui joue un appelant (écrit ou simulé) contre un agent, en
   son, et rend des délais par étape et des taux. Au-delà de Pipecat, AIRI et LiveKit.
2. **Des mesures publiées de la prise de parole** : comment la recherche chiffre une coupure, une relance, un
   silence trop long, une parole qui se chevauche ; avec quelles données, et s'il en existe en français.
3. **Des traces de bout en bout pour la voix** : comment un tour est tracé du micro au haut-parleur chez ceux qui
   exploitent des agents vocaux ; le vocabulaire d'OpenTelemetry pour ces étapes.
4. **Des voix françaises pour fabriquer des locuteurs** : synthèse locale et libre, plusieurs timbres, de quoi
   insérer hésitations et bruits.
5. **Des compagnes vocales à avatar qui publient leurs tests** : la moitié des projets de la veille n'en ont
   peut-être aucun ; savoir lesquels en ont.

Des noms que je connais sans les avoir vérifiés, à confirmer avant de s'en servir : Full-Duplex-Bench, Talking
Turns (prise de parole) ; les plateformes d'essai d'agents vocaux (Hamming, Coval, Cekura), qui sont payantes mais
publient leurs méthodes.

## 8. Limites de ce cadrage

- Les trois projets ont été lus, pas lancés : je décris ce que leurs documents et leur code disent faire.
- La chaîne sur le laptop suppose que le service de voix y tourne (transcription et synthèse locales) : fait une
  fois pour transcrire des fichiers, jamais pour une conversation entière.
- Le coût de construction n'est pas chiffré : chaque étape aura son plan.
