# Google en mode Personnel, sans l'écran « application non validée ». Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-acedia#83 (`niveau:standard`, public). Périmètre figé par l'issue ; son critère 2 a
> été reformulé le 23/11.
>
> **État : rédigé le 23/11 ; contesté le 23/11 (« à amender ») ; amendé le 23/11 avec deux décisions de CrOliX ;
> validé par CrOliX le 23/11.**
> **PR qui livre : Lun-Ecosystem/lun-acedia#85.** Tâches 1 à 4, 6 et 7 faites le 23/11 (client de l’essai reconnecté à 15 h 43 ; envoi et adresses d’envoi constatés par CrOliX). Tâche 5 à constater à partir du 01/12, 15 h 43.
>
> Code relu sur `main` de Lun'Acedia (`46aff46`, la 0.2.0) ; le graphe d'abord, puis chaque point dans le code. Le
> plan du NAS relu sur `main` de lun-docs (`d59451a`). Lun'Acedia est public : ce plan ne porte ni identifiant de
> client, ni adresse mail, ni nom de projet, ni nom d'hôte.

**But :** brancher Google sur un projet en **mode Personnel**, qui n'affiche pas l'écran « Google n'a pas validé cette
application ». La page « Brancher Google » le décrit. La carte du compte dit d'avance quel compte est attendu. Le plan
du NAS crée le projet de prod de cette façon.

**Source :** l'issue et son essai du 23/11 (projet neuf en mode Personnel, créé par le compte de test ; aucun écran
d'avertissement ; les cinq droits accordés ; mail, agenda et tâches synchronisés ; l'envoi et les adresses d'envoi non
vus à l'œuvre). L'aide de Google sur le mode Personnel, relue le 23/11 (plus bas). La contestation du 23/11.

**Critères de fin**, ceux de l'issue, chacun prouvé en local :

1. **`docs/brancher-google.md` décrit le mode Personnel** : sa page de création, le client Web et son adresse de
   retour, les trois API, le projet lié au compte qui le crée, le choix définitif ; l'ancienne voie (Externe,
   production non vérifiée) reste en repli, dite comme telle. Tâche 1.
2. **Avant la connexion, la carte du compte Google dit quel compte est attendu** (le compte qui a créé le projet) ;
   prouvé par un test. Tâche 2. Acedia ne code rien pour un retour `client_user_mismatch` qu'on n'a pas vu.
3. **L'envoi d'un mail et la lecture des adresses d'envoi prouvés avec un projet en mode Personnel.** Tâches 3 et 4.
4. **La tâche Google du plan du NAS dit** : projet de prod en mode Personnel, créé par le vrai compte dans la console
   à la tâche 4, avant l'arrêt B (décision du 23/11) ; le vrai compte n'entre dans Acedia qu'après l'arrêt C.
   Tâche 6. *Reformulé dans l'issue le 23/11, dans le sens de la décision 1.*

La tâche 5 (les jetons au-delà de 7 jours) prouve une phrase de la page (critère 1). La tâche 7 ouvre l'issue de suite.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-acedia` : page, carte du compte | `feat/google-mode-personnel` | Lun-Ecosystem/lun-acedia#83 | `standard` |
| `lun-docs` : ce plan, ses coches, le plan du NAS | `docs/google-mode-personnel` | la même | `trivial` |

Une PR par dépôt. Celle de Lun'Acedia ferme l'issue ; celle de lun-docs porte `Refs`.

## Les décisions de CrOliX, le 23/11

1. **Le projet de prod se crée tôt, à la tâche 4 du plan du NAS**, comme dans le plan validé. Le vrai compte crée le
   projet Personnel de prod et son client dans la **console Google seulement**, avec l'adresse de retour HTTPS du NAS,
   avant l'arrêt B. L'identifiant et le secret attendent la tâche 13. Le vrai compte n'entre pas dans Acedia avant
   l'arrêt C. La décision 4 du plan du NAS (« Production » non validé) est réécrite, datée du 23/11. Si la console
   refuse le mode Personnel au vrai compte (compte Workspace, protection avancée), c'est un seuil d'arrêt de la
   tâche 4.
2. **Pas de second compte Google.** Le constat de `client_user_mismatch` est retiré. Le critère 2 devient : avant la
   connexion, la carte du compte dit quel compte est attendu ; un test. Aucun code pour un retour qu'on n'a pas vu.

## Ce que le code fait aujourd'hui

- **Les droits** sont fixés dans `server/src/google/oauth.ts:19-25` : Gmail en modification, en envoi, en réglages de
  base ; l'Agenda ; Tasks. Rien ne change ici.
- **L'adresse de retour** vaut `GOOGLE_REDIRECT_URI`, sinon `http://localhost:<PORT>/oauth/callback`, 8787 par défaut
  (`oauth.ts:53-54`).
- **Le retour de Google** (`oauth.ts:133-169`) efface le `state`, puis exige un `state` frais et un `code`. Sans
  `code`, il répond un JSON brut en 400 (`oauth.ts:140`) ; le paramètre `error` n'est pas lu. Un refus de
  l'utilisateur (`?error=access_denied`, documenté par Google) affiche donc ce JSON. Un échange de code refusé répond
  aussi un JSON brut (`oauth.ts:154-156`). **Ce chantier n'y touche pas** : tâche 7.
- **Les jetons rangés** appartiennent au client qui les a émis (`oauth.ts:142-161`). Changer de client dans le `.env`
  exige de déconnecter puis de reconnecter le compte.
- **Un renouvellement refusé** met Acedia en état dégradé `google-reauth` (`server/src/google/client.ts:7`).
- **L'écran Réglages › Compte Google** (`views/src/lib/settings/GoogleAccount.svelte`) : sans compte, la ligne
  « Aucun compte » dit seulement « Gmail, Agenda et Tâches sont inaccessibles. » (`:66`) ; rien ne dit quel compte
  est attendu. Connecté, l'indice « Autorisations » dit « Gmail (lecture, modification) · Agenda · Tâches » (`:58`) :
  il ne nomme ni l'envoi, ni les adresses d'envoi.
- **L'envoi** : `sendMail` (`server/src/gmail/compose.ts:123-125`) poste `messages/send`. Il passe par `POST /api/send`
  (`server/src/gmail/routes.ts:102-105`) et par l'envoi d'un brouillon, `POST /api/drafts/:id/send` (`routes.ts:157`).
- **Les adresses d'envoi** : `listSendAs` (`compose.ts:77-86`) lit `settings/sendAs` (droit `gmail.settings.basic`).
  Elle sert `GET /api/send-as` (`routes.ts:123-131`), que le champ « De » de l'éditeur appelle
  (`views/src/lib/mail/Composer.svelte:81`), et chaque envoi, qui vérifie l'expéditeur (`compose.ts:108-121`).
- **Les tests de la carte** : `views/src/lib/settings/Settings.test.ts:385` (la carte trouvée par
  `getByRole('region', { name: 'Compte Google' })`, l'état par `client.googleStatus`). Le nouveau test suit cette
  forme.

## Ce que Google écrit, et ce qu'il n'écrit pas

- **Écrit** ([aide de Google, « Personal »](https://support.google.com/cloud/answer/15549945), lue le 23/11) : le
  mode Personnel limite l'autorisation au seul compte qui a créé l'application. Ces applications « do not require
  OAuth app verification » et « are not subject to the OAuth user cap or 7-day test user token expiration ». Les
  applications Externe ou Interne existantes ne passent pas en Personnel, et un projet Personnel ne repasse ni
  Externe ni Interne. Pour un autre compte, « client_user_mismatch authorization error is displayed ».
- **Non écrit** : si ce refus revient à l'adresse de retour avec `error=`, ou s'il reste sur une page de Google. La
  [doc des serveurs Web](https://developers.google.com/identity/protocols/oauth2/web-server) ne nomme pas
  `client_user_mismatch`. **Non constaté** non plus : pas de second compte (décision 2). Acedia dit donc d'avance
  quel compte est attendu, ce qui vaut quelle que soit la réponse de Google.

## Le projet Google de l'essai du 23/11

**Recommandation** : le projet Personnel de l'essai, lié au compte de test, **remplace** l'ancien projet « Externe »
pour le développement et pour les preuves de ce chantier. Il a déjà les trois API, le client Web et les cinq droits ;
il prouve le chemin même que suivra la prod. L'ancien projet reste dans la console jusqu'à la fin du chantier, en
repli ; CrOliX le supprime ensuite, ou le garde pour prouver la voie de repli. **CrOliX tranche.**

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit échouer ; `dev-front` écrit le code ; le
**reviewer** relit le diff. Elle se ferme sur les barrières de Lun'Acedia au vert : `npm test`, `npm run lint`,
`npm run typecheck`, `npm run format:check`, `npm run check:colors`.

**L'ordre.** **1, 2, 3, 6 et 7 partent en parallèle** (aucun fichier commun : 1 la page, 2 la carte, 3 la console et
le `.env`, 6 le plan du NAS, 7 une issue). 4 attend 3. 5 se constate au moins 8 jours après 3, avant l'arrêt C.

1. - [x] **La page « Brancher Google »** (la session, `docs/brancher-google.md` de Lun'Acedia ; pas de code).
   - **La section 1 devient le mode Personnel**, dans l'ordre des gestes de l'essai du 23/11 : se connecter à la
     console avec le compte qu'Acedia servira (en développement, le compte de test) ; créer le projet depuis la page
     `https://console.cloud.google.com/auth/overview/personal` ; activer les API Gmail, Google Calendar et Google
     Tasks ; créer un client OAuth **Application Web**, adresse de retour `http://localhost:<port>/oauth/callback`
     (8787 par défaut, ou la valeur de `GOOGLE_REDIRECT_URI`) ; déclarer les cinq droits dans « Accès aux données ».
   - **Ce que le mode engage**, dit en clair : le projet est lié au compte qui le crée, et lui seul peut se connecter ;
     le choix est définitif (un projet Personnel ne devient pas Externe, un projet Externe ne devient pas Personnel) ;
     ni vérification, ni écran d'avertissement ; et, cité mot pour mot avec le lien : « are not subject to the OAuth
     user cap or 7-day test user token expiration ».
   - **Changer de client** : après un nouvel identifiant dans le `.env`, déconnecter puis reconnecter le compte ; les
     jetons rangés appartiennent à l'ancien client.
   - **Le repli**, en section à part, titrée comme telle : l'ancienne voie (Externe, publiée en production sans
     vérification, avec son avertissement au consentement). Le texte d'aujourd'hui (`:8-17`) y passe, raccourci.
   - **« Si Google refuse le renouvellement »** garde sa phrase sur le mot de passe changé et l'accès retiré ; seul
     « app restée en Test » quitte la voie principale (il reste dit dans le repli).
   - **Exclu** : l'écran de réglage de Google (lun-acedia#55) ; toute capture de la console (elles porteraient des
     noms réels) ; tout texte sur ce que Google montre à un autre compte (non constaté).
   - **Preuve** : la page relue contre le critère 1, phrase par phrase ; `npm run format:check` au vert.

2. - [x] **La carte du compte dit le compte attendu** (testeur, puis `dev-front` ;
   `views/src/lib/settings/GoogleAccount.svelte` et `Settings.test.ts`).
   - **Sans compte**, la ligne « Aucun compte » (`:66`) dit aussi, avant tout clic : « Seul le compte Google qui a
     créé le projet d'Acedia peut se connecter. » Texte à relire par CrOliX dans la PR.
   - **Connecté**, l'indice « Autorisations » (`:58`) nomme ce que les droits permettent vraiment : « Gmail (lecture,
     modification, envoi, adresses d'envoi) · Agenda · Tâches ». Même fichier, même ligne de travail.
   - **Tests, écrits d'abord**, dans la forme de `Settings.test.ts:385` : `googleStatus` à `{ connected: false }`, la
     carte Compte Google montre la phrase du compte attendu à côté du bouton « Connecter un compte Google » ;
     connecté, l'indice nomme l'envoi et les adresses d'envoi.
   - **Exclu** : le retour de Google (`oauth.ts`), aucun code pour `error=` ; les droits ; lun-acedia#55.
   - **Preuve** : les barrières au vert ; une capture de la carte sans compte, prise dans Chrome sur Acedia locale.

3. - [x] **Le client de l'essai en service** (CrOliX ; la session lit l'écran).
   - CrOliX met l'identifiant et le secret du client de l'essai dans le `.env` de son Acedia locale sur le laptop
     (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`), puis la relance. Ces valeurs ne sortent pas du `.env`.
   - **Déconnecter puis reconnecter le compte de test** dans Réglages › Compte Google : le jeton rangé appartient à
     l'ancien client. On attend : aucun écran d'avertissement, la carte « Connecté », la synchronisation qui reprend.
   - **Relevé** : la date et l'heure de la reconnexion (point de départ de la tâche 5).

4. - [x] **L'envoi et les adresses d'envoi, prouvés** (CrOliX ; la session lit l'écran dans Chrome, en lecture, et ne
   clique « Envoyer » que sur son accord). Après la tâche 3.
   - **Les adresses d'envoi** : l'éditeur ouvert, le champ « De » liste les adresses du compte (`GET /api/send-as` en
     200 dans le réseau de l'onglet). C'est `gmail.settings.basic` à l'œuvre.
   - **L'envoi** : un mail du compte de test **vers lui-même**, sujet daté, envoyé depuis l'éditeur. On attend
     `POST /api/drafts/:id/send` ou `POST /api/send` en 200, puis le mail reçu dans la boîte d'Acedia après la
     synchronisation. C'est `gmail.send` à l'œuvre. **On attend aussi qu'il n'ouvre aucune action de tri à valider**
     (rien de nouveau dans « À valider »).
   - **Relevé** dans la PR : les statuts, l'heure, la capture du champ « De » et du mail reçu, les adresses masquées.
   - **Exclu** : aucun destinataire autre que le compte de test ; le vrai compte.

5. - [ ] **Les jetons au-delà de 7 jours** (CrOliX relance ; la session lit). Au moins 8 jours après la tâche 3, avant
   l'arrêt C du NAS.
   - Acedia **n'a pas besoin de tourner en continu** : elle peut rester arrêtée entre-temps. Le constat se fait à la
     relance, au moins 8 jours après la reconnexion de la tâche 3, sur le laptop.
   - **On attend** : la synchronisation reprend, l'état n'est pas dégradé en `google-reauth`, aucun événement urgent
     de reconnexion.
   - **Relevé** dans la PR (ou en commentaire si elle est fusionnée avant) : les deux dates, l'état lu.
   - **Arrêt** si `google-reauth` apparaît : la phrase de la page est fausse pour nous ; le plan revient à CrOliX
     avant l'arrêt C.

6. - [x] **Le plan du NAS** (la session, `docs/plans/2026-11-22-mise-en-service-nas.md` de lun-docs, sur cette
   branche).
   - **Décision 4, réécrite et datée du 23/11** (décision nouvelle de CrOliX, pas une conséquence) : « Google : un
     projet en mode Personnel et son client propres à la prod, créés par le vrai compte dans la console à la tâche 4,
     avant l'arrêt B. L'identifiant et le secret attendent la tâche 13 ; le vrai compte n'entre dans Acedia qu'après
     l'arrêt C. » Elle remplace « en Production non validé ».
   - **Tâche 4** : le vrai compte crée le projet Personnel de prod dans la console seulement, par les gestes de
     `brancher-google.md`, avec le client Web dont l'adresse de retour est celle d'Acedia en HTTPS dans le réseau
     privé. **« Son écran de consentement en Production » est retiré.** Un seuil d'arrêt s'ajoute : la console refuse
     le mode Personnel au vrai compte (compte Workspace, protection avancée). L'arrêt sur l'adresse refusée reste.
   - **Tâche 13** : la phrase sur l'avertissement « application non validée » est retirée ; « Vérifier » constate
     qu'il ne s'affiche pas. Le reste tient.
   - **Preuve** : le diff relu contre le critère 4 ; `npm run check` de lun-docs au vert.

7. - [x] **L'issue de suite** (la session ouvre l'issue, label `inbox`, dans Lun-Ecosystem/lun-acedia). Ouverte le
   23/11 : [Lun-Ecosystem/lun-acedia#84](https://github.com/Lun-Ecosystem/lun-acedia/issues/84).
   - **Titre** : « Retour de Google : un refus affiche du JSON brut ». **Corps** : les trois cas, avec leurs lignes
     sur `main` : `?error=` non lu, donc un refus de l'utilisateur (`access_denied`) tombe sur « Retour Google invalide
     ou expiré » en JSON (`oauth.ts:140`) ; un `state` invalide, même JSON ; un échange de code refusé (`:154-156`).
     L'attendu : une redirection vers les Réglages avec un message, jamais la valeur de Google recopiée. Lien vers
     l'issue #83 et ce plan. Ni identifiant, ni adresse.
   - **Preuve** : le lien de l'issue dans la PR de lun-docs.

## Risques

- **On ne sait pas ce que Google montre à un autre compte** (`client_user_mismatch`) : une page de Google, ou un
  retour vers Acedia. Non écrit par Google, non constaté (décision 2). La phrase dite d'avance sur la carte est la
  seule parade ; un retour inattendu tomberait sur le JSON brut d'aujourd'hui (tâche 7).
- **Le choix est définitif.** Un projet Personnel créé par le mauvais compte est à refaire. La tâche 4 du NAS le
  rappelle avant le geste.
- **Le vrai compte peut se voir refuser le mode Personnel** (Workspace, protection avancée) : seuil d'arrêt de la
  tâche 4 du NAS ; la voie de repli reste écrite.
- **Un droit restreint** (`gmail.modify`) : accepté à l'essai du 23/11 en mode Personnel, pas encore sur le vrai
  compte. S'il était refusé, la tâche 4 du NAS s'arrête et revient à CrOliX.
- **La phrase sur les jetons** vient de l'aide de Google, qui peut changer ; la tâche 5 la constate pour nous.

## Hors périmètre

Régler Google depuis l'écran plutôt que le fichier d'environnement (lun-acedia#55). Réduire les droits d'Acedia. La
validation de l'app par Google. Un second compte Google. Tout code du retour de Google (`error=`, `state` invalide,
échange refusé) : l'issue de suite de la tâche 7.

## Limites

- Non vérifié ailleurs que dans le code : la forme du refus `client_user_mismatch` (ni écrite, ni constatée) ; le
  statut de publication d'un projet Personnel dans la console (la page n'en parle pas ; l'essai n'en a pas eu besoin).
- La recommandation sur le projet de l'essai et les deux textes de la tâche 2 attendent CrOliX.
