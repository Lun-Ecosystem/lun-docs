# Pina, l'assistante de Lun'Acedia : palier « Agent Acedia », partie 1

> Date : 2026-10-26. Cadré avec CrOliX, sur la maquette
> `docs/maquettes/2026-10-26-agent-acedia/01-assistant.html`. Ce qui est marqué **[choix Claude]** est
> une décision de l'agent, à contester librement ; le reste a été dit ou validé par CrOliX.

## 1. Intention

Acedia trie déjà seul et propose des rangements, mais rien ne permet de **parler** à un agent : lui
demander de créer un événement ou une tâche, de rédiger un brouillon, de dire ce qui attend. Il manque
la fenêtre de chat flottante annoncée pendant le recadrage (observation O6).

Le but final de CrOliX : Natsume, dans le core, remplace à la voix ou à l'écrit tout ce qu'il fait
dans Acedia. L'ordre retenu est pourtant **Acedia d'abord** (choix A) :

- Acedia seul doit être complet, et le satellite reste garant de sa logique métier.
- La seule source de capacités est le **catalogue d'actions** d'Acedia (`/lun/v1/actions`). Pina et,
  plus tard, Natsume en sont deux clients. Aucune logique n'est écrite deux fois.
- Pina sert de modèle de ce que Natsume devra savoir faire.

Le palier est coupé en deux. **Ce document couvre la partie 1** : le catalogue complet, Pina dans sa
fenêtre, les cartes à valider, les brouillons. La partie 2 (§9) suivra.

## 2. Ce qui ferait échouer le palier, même si tout marche

Dit par CrOliX :

1. **Pina agit sans sa validation**, alors que le réglage demande de valider.
2. **Pina envoie un mail toute seule.** Jamais, dans aucun mode.
3. **Pina répond qu'elle ne peut pas faire « x »** alors que l'écran d'Acedia sait le faire.
4. **Pina répond à côté** : cadre métier mal posé, elle ne comprend pas ce qu'elle a sous les yeux.

Chacun a sa preuve au §8.

## 3. Pina

- **Nom** : Pina-co-lada, le tout premier servant de CrOliX dans FF14. Graphie affichée : « Pina »
  dans l'interface, « Pina-co-lada » dans sa présentation **[choix Claude, stylisation à revoir]**.
  Pas d'apparence pour l'instant : l'icône IA (étincelle violette) la représente.
- **Caractère** : une viera chaleureuse, avenante, de bonne humeur. Elle tutoie CrOliX. Le ton porte
  la bonne humeur ; le contenu reste exact : dates, montants, destinataires et noms de boîtes ne sont
  jamais arrondis ni inventés. Réponses courtes par défaut.
- **Domaine** : les mails, l'agenda, les tâches et le tri d'Acedia. Elle peut échanger quelques mots
  hors sujet avec son ton, sans prétendre agir hors de son domaine.
- **Acedia seul** : Pina appartient à Acedia. Le front ne mentionne jamais Anima.
- **Plus tard, avec le core** : quand Natsume prend le relais, savoir si Pina se retire ou reste « la
  voix d'Acedia » est une question ouverte, hors palier.

## 4. Le catalogue complet

### 4.1 Règle de parité

**Tout ce que l'écran d'Acedia permet de faire existe dans le catalogue**, sauf une liste
d'exclusions écrite, chacune avec sa raison. Un test compare les deux : la liste des capacités de
l'écran (tenue dans le code, à côté du catalogue) contre les actions publiées et les exclusions. Une
fonction ajoutée à l'écran sans action ni exclusion fait échouer le test.

### 4.2 Existant (16 actions)

`mail.read`, `mail.search`, `mail.file`, `mail.archive`, `mail.trash`, `mail.tags`, `mail.validate`,
`mail.correct`, `agenda.list`, `event.create`, `event.update`, `event.delete`, `task.create`,
`task.update`, `task.complete`, `task.delete`.

### 4.3 À ajouter

Inventaire fait contre les routes de l'API (liste exacte à confirmer action par action au plan) :

| Domaine | Actions |
|---|---|
| Mails | sortir de la corbeille, signaler spam, marquer lu ou non lu, lister une boîte (réception, une boîte, non lus) |
| À valider | lister les propositions en attente |
| Boîtes | lister, créer, changer le rôle (boîte ou étiquette) ; l’écran ne renomme pas |
| Brouillons | créer un brouillon (nouveau ou réponse dans un fil), le modifier, le jeter |
| Journal | lister les dernières actions, annuler une action |
| Règles de tri | lister, créer, modifier, supprimer |
| Lecture du jour | « aujourd'hui » : reçus, rangés seul, validés, corrigés, en attente (la route `stats/today`) |

Les brouillons passent par l'API Gmail des brouillons ; le droit `gmail.modify` déjà accordé suffit,
sans nouveau consentement.

### 4.4 Exclusions (jamais dans le catalogue)

| Fonction de l'écran | Raison |
|---|---|
| Envoyer un mail | L'envoi est un clic de CrOliX dans l'écran de rédaction (§2.2). |
| Réglages, clés des fournisseurs d’IA, connexion Google | Configuration et secrets : à la main seulement. |
| Appareils et applications liées, codes d'appairage | Sécurité. |
| Pause et reprise du tri | Garde-fou : reste un geste de CrOliX. |

## 5. Comment Pina agit

- **Boucle d'agent côté serveur d'Acedia**, sur l'API Claude avec l'usage d'outils. Les outils sont
  exactement les actions du catalogue, décrites par leur schéma. Pas d'outil propre à Pina.
- **Modèle** : choisi dans les Réglages parmi les fournisseurs configurés (§5 bis). Chaque appel est
  compté dans les coûts d'Acedia ; sans clé ou crédit épuisé, la fenêtre le dit et propose les
  Réglages.
- **Lectures** : faites tout de suite, sans validation.
- **Écritures**, selon le réglage « Mode de Pina » :
  - **Valider avant (par défaut).** L'écriture devient une **carte** dans le fil : champs lisibles,
    boutons Valider, Modifier, Refuser. Rien n'est appelé avant Valider. Modifier ouvre les champs
    de la carte, ou l'écran habituel pour un brouillon.
  - **Faire tout de suite.** L'écriture est faite, la carte montre « fait » avec Annuler.
  - **Les suppressions demandent toujours la validation, quel que soit le mode** (événement, tâche,
    règle de tri, boîte, brouillon jeté) : leur « Annuler » n'est pas fiable. Chaque action du
    catalogue porte donc un marqueur « suppression ». Validé par CrOliX.
  - Dans les deux modes, l'action passe par le même chemin que l'écran et s'écrit au journal, marquée
    « par Pina ».
- **Écritures en chaîne** (créer une boîte puis y ranger trois mails) : la boucle **s'arrête à chaque
  carte** et reprend après Valider ou Refuser, avec le vrai résultat ; le tour en attente est gardé
  côté serveur. Plusieurs écritures indépendantes proposées ensemble forment une seule carte groupée,
  validable ligne par ligne ou d'un « Tout valider » **[choix Claude]**.
- **Carte en attente** : valable le jour même. À la fin du jour, elle passe « expirée » dans
  l'historique, sans effet. Au Valider, l'action revérifie l'état (mail déjà déplacé, événement
  supprimé) et échoue proprement avec la raison si besoin. La pastille compte les cartes en attente du jour
  (un brouillon à créer en est une) **[choix Claude]**.
- **Bornes** : au plus 8 allers-retours d'outils par demande ; un plafond de dépense quotidien pour
  Pina, réglable (1 $ par défaut) ; au-delà, elle le dit et s'arrête **[choix Claude]**.
- **Brouillons** : une demande de réponse donne une carte « Brouillon prêt, non envoyé ». Ouvrir le
  brouillon mène à l'écran de rédaction habituel, avec un bandeau « Brouillon préparé par Pina » ;
  l'envoi y est le seul possible. Le brouillon Gmail fait foi : l'écran de rédaction apprend à
  l'ouvrir par son identifiant, et une modification par Pina remplace le brouillon existant.
- **Contexte de l'écran** : la fenêtre transmet ce qui est ouvert (le mail, le jour d'agenda, la
  liste de tâches) et l'affiche en pastille. « Ce mail » désigne toujours ce contexte.
- **Pause** : la pause du tri arrête l'automatique, pas Pina : ce qu'elle fait est demandé.
- **Consignes pour Pina** : un texte libre dans les Réglages, écrit par CrOliX (« signe Natsume »,
  « je tutoie tout le monde »), ajouté à ses instructions. Rien d'appris automatiquement.

## 5 bis. Fournisseurs de LLM et choix du modèle

Demandé par CrOliX à la validation : la clé Anthropic imposée aujourd'hui par Acedia est un choix
arbitraire. On généralise, **pour le tri comme pour Pina**.

- **Fournisseurs** : Anthropic, OpenAI, Google (Gemini), Mistral, et un point d'accès compatible
  OpenAI à adresse libre (Ollama en local, OpenRouter…) **[choix Claude sur la liste]**.
- **Clés** : une par fournisseur, saisie dans les Réglages, chiffrée comme l'actuelle, affichée par
  ses 4 derniers caractères, avec les mêmes alertes (refusée, rétablie, échéance). Le `.env` reste
  possible ; la clé des Réglages l'emporte, comme aujourd'hui. Les clés et échéances déjà
  enregistrées pour Anthropic sont reprises sans rien ressaisir.
- **Choix du modèle par usage** : un modèle pour le tri, un pour Pina, chacun choisi dans une liste
  des modèles des fournisseurs configurés. Pour Pina, seuls les modèles qui savent utiliser des
  outils sont proposés.
- **Indication de coût** dans le choix : prix d'entrée et de sortie par million de jetons, et un
  repère rapide (€, €€, €€€) **[choix Claude sur la forme]**. Les prix viennent d'une table intégrée,
  datée, complétable par le `.env` comme dans le core ; un modèle sans prix connu l'indique au lieu
  d'afficher zéro.
- **Coûts** : chaque appel est compté par fournisseur et par modèle, dans la route `costs` existante.
- **Un seul point d'appel par usage** : une couche « fournisseur » commune donne au tri la
  classification et à Pina la conversation avec outils ; ni le tri ni Pina ne connaissent le format
  d'un fournisseur. Le comportement du tri ne change pas pour un modèle Anthropic.

Ce bloc passe en premier dans le plan : Pina en dépend.

## 6. Le fil et sa mémoire

- **Un fil par jour.** Chaque jour s'ouvre sur un fil neuf. Pina ne relit que le fil du jour.
- **Historique** : les jours passés restent consultables en lecture, durée de conservation réglable
  (30 jours par défaut **[choix Claude]**), puis effacés. L'archivage plus long, si besoin, suivra la
  même décision que le journal (O3).
- **Pas de base enrichie par les conversations.** Acedia retient déjà son métier : le journal, les
  exemples du tri appris des validations et corrections, les Réglages. La mémoire au long cours est
  le rôle du cerveau du core.

## 7. L'écran

Selon la maquette `01-assistant.html`, avec « Assistant » remplacé par « Pina » :

- **Lanceur** en bas à droite, seul élément fixe dans ce coin ; `Ctrl J` ouvre et ferme ; une pastille
  compte ce qui attend CrOliX (les cartes en attente).
- **Fenêtre** flottante, **taille dynamique** : on tire son bord ou son coin, ou on l'agrandit d'un
  bouton ; la taille est retenue. **Elle survole l’interface sans jamais la redimensionner** :
  ce qu’elle couvre se dégage en la réduisant, en la déplaçant de taille ou en la fermant (CrOliX).
- En-tête : nom, rappel du mode (« Validation avant chaque action », lien vers les Réglages),
  historique des jours, agrandir, réduire.
- Cartes : en attente, faite (avec Annuler), refusée, en échec (avec la raison).
- Saisie avec suggestions selon le contexte ; `Ctrl ↵` valide la carte en cours, `Échap` la refuse,
  `↑` rappelle la dernière demande.
- **Mobile** : bouton violet dans la barre du haut ; la fenêtre devient une feuille qui monte du bas.
- **Réglages**, nouvelle section « Pina » : mode (valider avant, faire tout de suite), consignes,
  conservation du fil, modèle, plafond quotidien. La section « Clé Anthropic » devient
  « Fournisseurs d'IA » (§5 bis), et le tri gagne son choix de modèle.
- Socle Lun' commun, violet réservé à l'IA, bleu Acedia en accent seulement.

## 8. Preuves

1. **Parité** (§2.3) : le test du §4.1, au vert.
2. **Jamais d'envoi** (§2.2) : aucun outil d'envoi n'est donné au modèle ; un test l'affirme sur la
   liste des outils envoyée à l'API.
3. **Jamais d'écriture sans validation** (§2.1) : en mode « valider avant », une demande d'écriture
   produit une carte et zéro appel Google ; l'appel n'a lieu qu'au Valider. Testé avec un modèle
   simulé.
4. **Cadre métier** (§2.4) : un jeu d'au moins 20 demandes types en français (créer, déplacer,
   chercher, résumer, répondre, demandes floues, hors sujet), joué contre le vrai modèle sur des
   données de démo, avec l'outil attendu ou la réponse attendue pour chacune. Résultat noté dans le
   rapport du palier ; tout échec est corrigé ou expliqué.
5. **Recette dans Chrome** par CrOliX, compte Google de test, sur son instance.

## 9. Partie 2 (palier suivant)

- **Routine quotidienne** à l'heure choisie (6 h par exemple), une seule fois par jour, activable :
  récupère et trie, repère les mails qui attendent une réponse, prépare des brouillons (jamais
  envoyés), et ouvre le fil du jour avec le **résumé** des traitements.
- **Notifications** : à l'écran sur desktop, popup sur l'app mobile (push préparé, branché avec le
  https du NAS). Réglage fin : quels événements notifient (seulement les mails urgents, rien pour
  l'agenda…), combien à la fois, chaque automatisme activable.
- Les compteurs bornés dans le temps (O8) et l'archivage du journal (O3) s'y rattachent.

## 10. Hors palier

- Natsume relayant le catalogue d'Acedia (après Acedia) ; le sort de Pina à ce moment.
- La voix.
- Toute action critique en automatique : pas avant des tests en situation réelle.
- L'appairage et l'installation sur le NAS (en attente).

## 11. Laissé au constructeur

Le passage des routes de l'écran et du catalogue par une même couche de service, si ce n'est pas déjà
le cas (à vérifier en premier au plan : c'est ce qui garantit « le même chemin que l'écran »). La forme
exacte des schémas d'action, le stockage du fil, la façon de tenir la liste des capacités de
l'écran, le texte des instructions de Pina (son ton est fixé au §3), le découpage en tâches.
