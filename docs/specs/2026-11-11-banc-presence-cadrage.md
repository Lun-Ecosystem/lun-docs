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
- **La veille Perplexity.** Je ne peux pas la lancer. Trois questions à lui poser sont au § 7.

## 7. Pour la veille

Des pistes que je connais de nom, **non vérifiées** : à confirmer par la veille avant de s'en servir.

- Quels bancs publics mesurent la prise de parole d'un agent vocal (coupures, relances, silences), et leurs données
  sont-elles en français ? Noms à vérifier : Full-Duplex-Bench, Talking Turns.
- Quels outils libres jouent un appelant simulé contre un agent vocal et rendent des délais par étape ? Noms à
  vérifier : les évaluations de Pipecat (lues ici), le cadre de tests de LiveKit (lu ici), d'autres.
- Quelles voix de synthèse françaises, locales et libres, donnent des locuteurs variés pour fabriquer des phrases
  de test ?

## 8. Limites de ce cadrage

- Les trois projets ont été lus, pas lancés : je décris ce que leurs documents et leur code disent faire.
- La chaîne sur le laptop suppose que le service de voix y tourne (transcription et synthèse locales) : fait une
  fois pour transcrire des fichiers, jamais pour une conversation entière.
- Le coût de construction n'est pas chiffré : chaque étape aura son plan.
