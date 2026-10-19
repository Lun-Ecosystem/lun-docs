# J1 Acedia : cahier des attendus

> Date : 2026-10-19. Cadré avec CrOliX au début du chantier J1. Découle de la spec de l'écosystème
> (`2026-10-19-ecosysteme-design.md`) et du standard `contrat-satellite.md`. Les choix faits par Claude
> sans validation explicite sont marqués **[choix Claude]**.

## 1. Pourquoi ce document

L'ancien Acedia a échoué sur un point : le besoin a été trop simplifié et aucun contrat clair des
attendus n'existait au départ. Il n'est devenu « correct » que bien trop tard. Symptômes relevés par
CrOliX :

- tout arrivait comme une urgence (mails et tâches en notifications), impossible de gérer à la
  semaine ou au mois ;
- ouvrir un mail poussait les autres mails de la liste ;
- le HTML n'était pas interprété : certains mails illisibles ;
- le tri automatique (pré-tri, corbeille, indésirables) n'était ni clair ni regroupé ;
- les deux apps (web et Avaritia) n'avançaient pas au même rythme.

Ce document est ce contrat. **J1 n'est terminé que quand chaque critère du §9 est prouvé.**

## 2. Le mot d'ordre

**Ne plus passer par une autre appli que l'écosystème.** Acedia remplace Gmail, Google Agenda et
Google Tasks au quotidien, en autonome comme depuis les apps de Lun'Anima. La priorité absolue du MVP
est le **tri automatique des mails avec validation**.

## 3. Périmètre

| Quand | Contenu |
|---|---|
| **J1 (15/11)** | contrat satellite ; synchro double sens Gmail / Agenda / Tasks ; boîte, lecture, action « ranger », boîtes, étiquettes, règles ; tri IA avec seuil, « En attente », journal et annulation ; corrections utilisées comme exemples ; urgence émise vers le core ; agenda unifié jour / semaine / mois, création et modification manuelles, rappels ; front autonome PWA ; paquet de vues ; dépôt dans l'organisation |
| **Phase 2 (J2 à J5, jusqu'au 31/12)** | brouillons de réponse par Acedia ; propositions d'agenda depuis un mail ; détection des chevauchements, réorganisation et brouillon du mail de décalage ; règles suggérées après corrections répétées ; Drive en lecture ; notifications web du front autonome |
| **Hors MVP** | GitHub (autre métier : futur satellite, nom à choisir par CrOliX) ; veille tech (côté core, approche ouverte) ; plusieurs comptes Google ; agenda pro ; écriture dans Drive ; outil de tri de l'arriéré |

## 4. Le compte

- **Un seul compte Google branché : le compte perso courant de CrOliX.** C'est là que vit sa vie
  (agenda, Drive, historique).
- L'adresse dédiée à l'écosystème (celle du site, de Twitch et de X) **fait suivre ses mails** vers
  le compte perso. Une règle les range dans une boîte « Lun'Ecosystem ». Les réponses partent de
  l'adresse dédiée via « Envoyer en tant que » de Gmail : l'adresse perso n'est jamais exposée.
- Aucune adresse n'est écrite dans le code (dépôt public) : le compte se branche par l'autorisation
  Google, depuis le front.
- Développement et preuve de J1 : **compte Google de test**. Le branchement sur le compte perso
  vient après J1, seuil au maximum.

## 5. Principes de fonctionnement

1. **Google est la source de vérité.** Acedia reflète Google et agit dessus, dans les deux sens : un
   mail supprimé, archivé, relibellé, un événement déplacé, une tâche cochée d'un côté l'est de
   l'autre. Acedia ne garde jamais un état qui diverge. Sa base locale est un cache et un index,
   plus ses données propres (règles, seuil, propositions, exemples, journal, coûts).
2. **Contrôle manuel, toujours.** Tout ce que l'agente fait se fait à la main, et tout ce qu'elle
   fait se défait.
3. **Jamais de suppression définitive** : la corbeille seulement (récupérable 30 jours chez Google).
4. **Une seule action « ranger »**, quelle que soit l'origine : proposition validée, geste manuel,
   correction. Chacune sert d'exemple.
5. **L'apprentissage est un aspect majeur** : Acedia s'améliore avec les corrections de CrOliX.
6. **Crédit IA épuisé = dégradation propre** : les règles tournent, le reste attend, `health` passe
   en `degraded`.

## 6. Mails

### 6.1 Boîtes, étiquettes, destinations

- **Boîtes** : définies à la main par CrOliX (ex. Administratif, Pro, École, Perso, Lun'Ecosystem).
  Un mail est dans **une seule** boîte. Côté Gmail, une boîte est un libellé.
- **Étiquettes** : par-dessus, plusieurs par mail (ex. Urgent). Côté Gmail, des libellés aussi.
- Acedia marque dans ses réglages quels libellés sont des boîtes et lesquels des étiquettes.
  **[choix Claude]**
- **Ranger dans une boîte = déplacer**, comme « Déplacer vers » de Gmail : libellé ajouté, retiré de
  la boîte de réception. La navigation affiche chaque boîte avec son nombre de non-lus.
  **[choix Claude]**
- **Corbeille** : pub sans intérêt, mails traités à jeter.
- **Indésirables** (spam Gmail) : **seulement** le vrai spam et l'hameçonnage. Signaler entraîne le
  filtre de Google, qui arrêtera les suivants avant Acedia (zéro crédit IA). Acedia ne propose
  jamais une pub en indésirable et ne traite pas le contenu de ce dossier.
- **Promos** : boîte optionnelle si CrOliX veut garder la pub plutôt que la jeter.

### 6.2 Comment Acedia décide

1. **Règles de CrOliX d'abord** (ex. « expéditeur = école → École »). Confiance 100 %, gratuites,
   actives même crédit épuisé. En pause, comme tout l'automatique, elles s'arrêtent (contrat).
2. **L'IA pour le reste** : elle lit le mail et propose une boîte, des étiquettes, un niveau
   d'urgence et une confiance (0 à 100 %).
3. **Le seuil de confiance** (réglage de CrOliX) décide : au-dessus, Acedia range seule et l'inscrit
   au journal ; en dessous, la proposition attend validation. Seuil global en J1 ; **valeur par défaut
   : 100 %, tout passe en validation**. **[choix Claude]**
4. **Les corrections comme exemples** : chaque geste (validation, correction, rangement manuel) est
   gardé et réinjecté comme exemple quand l'IA traite un mail semblable (même expéditeur, même
   sujet…). La sélection des exemples est laissée au constructeur.
5. **Seuls les nouveaux mails** (arrivés après le branchement) sont triés automatiquement ; l'existant
   se range à la main. **[choix Claude]**
6. Ce qui part à l'IA : les en-têtes utiles et un extrait du texte, tronqué, jamais les pièces
   jointes. Modèle économique, chaque appel compté dans `/costs`. **[choix Claude]**

### 6.3 La validation

- **Pas d'écran de validation à part.** La proposition s'affiche **dans la boîte**, sur la ligne du
  mail, marquée « ? » avec la confiance, et des boutons ✓ (valider) et ✎ (changer).
- Un **filtre « En attente »** avec compteur regroupe les propositions (utile aussi au briefing).
- Un **journal d'Acedia** liste chaque action automatique avec **Annuler**.
- Actions groupées : sélection multiple, « tout ce qui vient de cet expéditeur ». C'est ainsi que
  l'arriéré se traite, à la main.

### 6.4 La lecture

Prototype de comportement validé (maquette du brainstorming, à affiner ; les écrans finaux suivent
`standards/design.md`, monde Lun'Acedia).

- **PC / tablette** : liste à gauche, mail à droite. Ouvrir un mail **ne pousse rien** dans la liste.
- **Mobile** : mail en plein écran.
- **Barre d'actions collée en haut**, qui reste visible quand on fait défiler le mail : proposition
  d'Acedia, Valider, Ranger dans…, Corbeille, Archiver, Étiquettes, Répondre (phase 2 : Brouillon par
  Acedia, proposition d'agenda).
- On traite **sans fermer le mail** ; après une action, retour à la liste **déjà à jour**.
- **HTML affiché fidèlement**, isolé (cadre sans scripts ni accès au reste de la page). **Images
  affichées par défaut, comme Gmail.**
- Accès manuel complet : lire, écrire, répondre (depuis l'adresse qui a reçu le mail), transférer, archiver, corbeille, libellés, envoyés,
  brouillons, recherche.

### 6.5 Urgence et notifications

- Acedia **qualifie** chaque mail ; le **core décide** selon le mode. Acedia ne connaît pas les modes.
- Niveaux du contrat v1 : `urgent` (rare, à savoir vite), `normal`, `info`. Un mail sans intérêt
  n'émet pas d'événement. **[choix Claude : on garde les trois niveaux du contrat plutôt que d'en
  créer quatre, pour ne pas rompre la v1]**
- Par défaut, presque tout passe par le briefing : c'est voulu.
- Le niveau d'urgence (pour le core) et l'étiquette « Urgent » (pour CrOliX) sont distincts ; si
  l'étiquette existe, Acedia la propose sur les mails qu'elle qualifie `urgent`. **[choix Claude]**
- Exigences pour le core (à reporter dans son chantier) : **mode streameuse = isolation totale**,
  aucune information privée ne sort, quelle que soit l'urgence ; **mode silencieux = rien ne passe** ;
  regroupement des notifications rapprochées, délai minimum entre deux interruptions, un fil ne
  notifie qu'une fois.
- En autonome (phase 2) : un seul réglage, « notifier à partir de tel niveau ».

## 7. Agenda et tâches

- On reprend le modèle de Google : **une vue unifiée** où se mêlent événements (Agenda) et tâches
  (Tasks), en **jour, semaine, mois**. Les tâches se cochent dans l'agenda.
- Création, modification, suppression à la main ; par l'agente sur demande explicite (via le core).
  Une action **demandée** s'exécute ; une action **proposée** par Acedia attend validation.
  **[choix Claude]**
- **Rappels** : ceux réglés sur l'événement ou la tâche, au moment prévu, émis comme événements
  d'urgence (donc filtrés par les modes).
- Phase 2 : **depuis un mail**, proposer de créer ou déplacer l'événement ou la tâche (barre
  d'actions) ; **chevauchements** détectés, réorganisation proposée, brouillon du mail de décalage.
  Rien ne bouge sans accord.

## 8. Technique (ce qui est décidé)

- **Réécriture** sur le gabarit `templates/ts/` de lun-docs (Node `^22.13.0 || >=24`, TypeScript
  strict, Vitest, SQLite, front Svelte 5 + Vite). L'ancien code sert de référence (OAuth Google,
  chiffrement des secrets, appels Gmail, notions de journal et de garde), pas de base : il ne
  synchronise pas par historique, stocke en fichiers et a grossi autour de connecteurs hors MVP.
  **[choix Claude, conformément à la spec §5 : « reprendre ou réécrire se décide au début de J1 »]**
- **Dépôt** : `CrOliX-AltF4/LunAcedia` transféré dans `Lun-Ecosystem` (historique conservé, renommé
  `lun-acedia` **[choix Claude]**), contenu remplacé par la réécriture via PR. Le transfert est fait
  par CrOliX. `registry.yaml` mis à jour.
- **Synchro** : rien n'est exposé sur internet, donc pas de push Google (Pub/Sub). Interrogation
  périodique incrémentale : historique Gmail, jetons de synchro de l'Agenda, date de mise à jour pour
  Tasks. Fréquence laissée au constructeur ; une action faite dans Acedia est visible tout de suite.
- **Autorisation Google** : jetons chiffrés au repos. Une app OAuth en statut « test » voit ses
  jetons expirer au bout de 7 jours : prévoir le statut « production » non vérifié (usage personnel)
  ou une reconnexion simple et signalée (`health` `degraded`, événement). Le parcours de connexion
  doit marcher sans exposer Acedia sur internet ; la méthode est laissée au constructeur.
- **Contrat** : routes `/lun/v1` du standard. Actions minimales exposées au core : chercher et lire
  des mails, ranger, corbeille, archiver, étiqueter, valider une proposition ; lister l'agenda sur une
  période ; créer, modifier, supprimer un événement ou une tâche. Événements : mail trié, proposition
  en attente, rappel, autorisation Google à renouveler, crédit épuisé.
- **Vues** : `@lun-ecosystem/lunacedia-views` publie la liste, la lecture, l'agenda, les réglages
  (boîtes, règles, seuil, autorisation Google). Le front autonome n'utilise que ce paquet : une vue,
  un exemplaire.
- **Front autonome** : PWA installable sur mobile, ne connaît que son serveur.

## 9. Critères d'acceptation de J1

Prouvés en local avec le compte de test, captures ou enregistrements dans la PR.

1. Un mail archivé, supprimé ou relibellé dans Gmail l'est dans Acedia à la synchro suivante, et
   inversement immédiatement.
2. Un événement ou une tâche créé, déplacé, coché ou supprimé d'un côté l'est de l'autre.
3. Un mail HTML riche (newsletter avec images et mise en forme) s'affiche comme dans Gmail, sans
   exécuter de script.
4. Ouvrir un mail ne déplace aucune ligne de la liste ; la barre d'actions reste visible en faisant
   défiler un long mail ; après « ranger », la liste est à jour sans recharger.
5. CrOliX crée une boîte et une étiquette ; elles apparaissent comme libellés dans Gmail.
6. Une règle range seule un mail correspondant, inscrite au journal, annulable.
7. Seuil à 100 % : aucun mail ne bouge seul ; chaque proposition apparaît avec « ? » et sa
   confiance, et dans le filtre « En attente ».
8. Seuil abaissé : un mail au-dessus est rangé seul, au journal, annulable ; un mail en dessous
   attend.
9. Une correction est réutilisée : un mail semblable reçu ensuite obtient la boîte corrigée.
10. Pause : aucun tri automatique, la lecture et les gestes manuels marchent.
11. Crédit IA épuisé (simulé) : `health` `degraded`, les règles tournent, le reste attend, rien ne
    plante.
12. Vue agenda jour / semaine / mois avec événements et tâches mêlés ; un rappel émet un événement.
13. Le core (ou un client de test) s'appaire, lit `health`, `costs`, reçoit les événements SSE avec
    reprise, invoque une action.
14. Le front autonome s'installe sur un téléphone Android (PWA) et fonctionne sur le réseau local.
15. Le paquet de vues est publié et importable par un projet tiers.
16. Le dépôt est dans l'organisation, CI verte, registre à jour.

## 10. Laissé au constructeur

Fréquence de synchro, schéma de la base, choix du modèle IA et forme du prompt, sélection des
exemples, méthode de connexion Google sans exposition, découpage du paquet de vues, raccourcis
clavier, détail visuel dans le cadre de `standards/design.md`.

## 11. Amendements à reporter dans la spec de l'écosystème

- Tableau des briques (§5) : Acedia couvre Gmail, Agenda, Tasks, Drive ; GitHub, RSS et Home
  Assistant sortent de son périmètre MVP (GitHub ira à un futur satellite).
- Tableau des frontières : la boîte ne contient plus les notifications GitHub.
- Ancien code d'Acedia : décision prise, réécriture (§8 ci-dessus).
