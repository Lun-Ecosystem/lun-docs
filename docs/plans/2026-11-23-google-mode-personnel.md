# Google en mode Personnel, sans l'écran « application non validée ». Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-acedia#83 (`niveau:standard`, public). Périmètre figé par l'issue.
>
> **État : rédigé le 23/11, à contester puis à valider par CrOliX.**
>
> Code relu sur `main` de Lun'Acedia (`46aff46`, la 0.2.0) ; le graphe d'abord, puis chaque point dans le code. Le
> plan du NAS relu sur `main` de lun-docs (`d59451a`). Lun'Acedia est public : ce plan ne porte ni identifiant de
> client, ni adresse mail, ni nom de projet, ni nom d'hôte.

**But :** brancher Google sur un projet en **mode Personnel**, qui n'affiche pas l'écran « Google n'a pas validé cette
application ». La page « Brancher Google » le décrit. Un autre compte que le créateur reçoit une réponse claire. Le
plan du NAS crée le projet de prod de cette façon.

**Source :** l'issue et son essai du 23/11 (projet neuf en mode Personnel, créé par le compte de test ; aucun écran
d'avertissement ; les cinq droits accordés ; mail, agenda et tâches synchronisés ; l'envoi et les adresses d'envoi non
vus à l'œuvre). L'aide de Google sur le mode Personnel, relue le 23/11 (plus bas).

**Critères de fin**, ceux de l'issue, chacun prouvé en local :

1. **`docs/brancher-google.md` décrit le mode Personnel** : sa page de création, le client Web et son adresse de
   retour, les trois API, le projet lié au compte qui le crée, le choix définitif ; l'ancienne voie (Externe,
   production non vérifiée) reste en repli, dite comme telle. Tâche 1.
2. **Un autre compte que le créateur voit dans Acedia un message clair** (Google répond `client_user_mismatch`), pas
   une erreur brute ; prouvé par un test. Tâches 2 et 3. Voir « Ce que Google écrit » : la forme de ce refus n'est pas
   documentée, la tâche 2 la constate.
3. **L'envoi d'un mail et la lecture des adresses d'envoi prouvés avec un projet en mode Personnel.** Tâche 4.
4. **La tâche Google du plan du NAS dit** : projet de prod en mode Personnel, créé par le vrai compte, à l'arrêt C.
   Tâche 5.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-acedia` : page, retour, écran | `feat/google-mode-personnel` | Lun-Ecosystem/lun-acedia#83 | `standard` |
| `lun-docs` : ce plan, ses coches, le plan du NAS | `docs/google-mode-personnel` | la même | `trivial` |

Une PR par dépôt. Celle de Lun'Acedia ferme l'issue ; celle de lun-docs porte `Refs`.

## Ce que le code fait aujourd'hui

- **Les droits** sont fixés dans `server/src/google/oauth.ts:19-25` : Gmail en modification, en envoi, en réglages de
  base ; l'Agenda ; Tasks. Rien ne change ici.
- **L'adresse de consentement** est construite par `authUrl` (`oauth.ts:30-43`) : `access_type=offline`,
  `prompt=consent`, un `state` tiré au hasard et rangé par `GET /api/google/auth-url` (`oauth.ts:111-118`).
- **L'adresse de retour** vaut `GOOGLE_REDIRECT_URI`, sinon `http://localhost:<PORT>/oauth/callback`, 8787 par défaut
  (`oauth.ts:53-54`).
- **Le retour de Google** (`oauth.ts:133-169`) efface le `state`, puis exige un `state` frais et un `code`. **Sans
  `code`, il répond un JSON brut** `{"error":"Retour Google invalide ou expiré, recommencer"}` en 400 (`oauth.ts:140`).
  Le paramètre `error` n'est pas lu. Un `?error=access_denied` (refus de l'utilisateur, documenté par Google), ou un
  `?error=client_user_mismatch` s'il revient ainsi, affiche donc ce JSON dans l'onglet ouvert par Google.
- **Un échange de code refusé** répond aussi un JSON brut, `Google a refusé l'autorisation` (`oauth.ts:154-156`).
- **La réussite** redirige vers `/?google=connected` (`oauth.ts:168`). L'app voit `google` dans l'adresse, l'efface et
  ouvre les Réglages (`app/src/App.svelte:33-35`). La valeur n'est pas lue.
- **L'écran Réglages › Compte Google** (`views/src/lib/settings/GoogleAccount.svelte`) : « Connecter un compte
  Google » ouvre le consentement dans un nouvel onglet (`:30-38`) ; l'état se relit au retour du focus (`:46`). Une
  erreur s'affiche en `role="alert"` sous la carte (`:72`), mais seules les erreurs de l'appel à `auth-url` y
  arrivent. Rien ne dit d'avance quel compte est attendu (`:66`).
- **L'envoi** : `sendMail` (`server/src/gmail/compose.ts:123-125`) poste `messages/send`. Il passe par `POST /api/send`
  (`server/src/gmail/routes.ts:102-105`) et par l'envoi d'un brouillon, `POST /api/drafts/:id/send` (`routes.ts:157`).
- **Les adresses d'envoi** : `listSendAs` (`compose.ts:77-86`) lit `settings/sendAs` (droit `gmail.settings.basic`).
  Elle sert `GET /api/send-as` (`routes.ts:123-131`), que le champ « De » de l'éditeur appelle
  (`views/src/lib/mail/Composer.svelte:81`), et chaque envoi, qui vérifie l'expéditeur (`compose.ts:108-121`).
- **Les tests du parcours** : `server/src/google/oauth.test.ts` (un faux `fetch`, le harnais, `h.app.request` sur
  `/oauth/callback?...`) ; `app/src/App.test.ts:267` pose déjà `/?google=1` dans l'adresse ;
  `views/src/lib/settings/Settings.test.ts:385` couvre la carte Compte Google. Les nouveaux tests suivent ces formes.

## Ce que Google écrit, et ce qu'il n'écrit pas

- **Écrit** ([aide de Google, « Personal »](https://support.google.com/cloud/answer/15549945)) : le mode Personnel
  limite l'autorisation au seul compte qui a créé l'application ; « client_user_mismatch authorization error is
  displayed when authorization is requested from any Google Account » autre que lui. Les applications Externe ou
  Interne existantes ne passent pas en Personnel, et un projet Personnel ne repasse ni Externe ni Interne.
- **Non écrit** : si ce refus revient à l'adresse de retour avec `error=`, ou s'il reste sur une page d'erreur de
  Google. Le mot « displayed » penche pour une page de Google, sans le dire. La
  [doc des serveurs Web](https://developers.google.com/identity/protocols/oauth2/web-server) ne nomme pas
  `client_user_mismatch`. Elle montre le retour `?error=access_denied` quand l'utilisateur refuse, et range d'autres
  erreurs (`org_internal`, `redirect_uri_mismatch`) parmi les messages « user-facing », montrés par Google.
- **Donc** : la tâche 2 constate la forme à l'essai, avec un second compte. Acedia lit `error=` dans tous les cas
  (il sert déjà pour `access_denied`). Et l'écran dit **d'avance** quel compte est attendu, ce qui vaut même si Google
  ne revient jamais vers Acedia.

## Le projet Google de l'essai du 23/11

**Recommandation** : le projet Personnel de l'essai, lié au compte de test, **remplace** l'ancien projet « Externe »
pour le développement et pour les preuves de ce chantier. Il a déjà les trois API, le client Web et les cinq droits ;
il prouve le chemin même que suivra la prod. L'ancien projet reste dans la console jusqu'à la fin du chantier, en
repli ; CrOliX le supprime ensuite, ou le garde pour prouver la voie de repli. **CrOliX tranche.**

## Tâches

Chaque tâche de code : le **testeur** écrit d'abord les tests et les voit échouer ; le développeur écrit le code ; le
**reviewer** relit le diff. Elle se ferme sur les barrières de Lun'Acedia au vert : `npm test`, `npm run lint`,
`npm run typecheck`, `npm run format:check`, `npm run check:colors`.

**L'ordre.** **1, 2, 3 et 5 partent en parallèle** (aucun fichier commun : 1 la page, 2 la console, 3 le code, 5 le
plan du NAS). 4 attend que CrOliX ait mis le client de l'essai dans le `.env` (tâche 2, premier geste). La tâche 3
garde sa forme quel que soit le constat de la tâche 2 ; seul son test de bout en bout en dépend.

1. - [ ] **La page « Brancher Google »** (la session, `docs/brancher-google.md` de Lun'Acedia ; pas de code).
   - **La section 1 devient le mode Personnel**, dans l'ordre des gestes de l'essai du 23/11 : se connecter à la
     console avec le compte qu'Acedia servira (en développement, le compte de test) ; créer le projet depuis la page
     `https://console.cloud.google.com/auth/overview/personal` ; activer les API Gmail, Google Calendar et Google
     Tasks ; créer un client OAuth **Application Web**, adresse de retour `http://localhost:<port>/oauth/callback`
     (8787 par défaut, ou la valeur de `GOOGLE_REDIRECT_URI`) ; déclarer les cinq droits dans « Accès aux données ».
   - **Ce que le mode engage**, dit en clair : le projet est lié au compte qui le crée, et lui seul peut se connecter ;
     le choix est définitif (un projet Personnel ne devient pas Externe, un projet Externe ne devient pas Personnel) ;
     ni vérification, ni écran d'avertissement, ni expiration des jetons à 7 jours. Le lien vers l'aide de Google.
   - **Le repli**, en section à part, titrée comme telle : l'ancienne voie (Externe, publiée en production sans
     vérification, avec son avertissement au consentement). Le texte d'aujourd'hui (`:8-17`) y passe, raccourci.
   - **Les sections 2 et 3** gardent leur fond. La 3 dit ce qu'affiche Acedia quand Google refuse un autre compte
     (le texte de la tâche 3). « Si Google refuse le renouvellement » garde « app restée en Test » pour le repli.
   - **Exclu** : l'écran de réglage de Google (lun-acedia#55) ; toute capture de la console (elles porteraient des
     noms réels).
   - **Preuve** : la page relue contre le critère 1, phrase par phrase ; `npm run format:check` au vert.

2. - [ ] **Le constat du refus d'un autre compte** (CrOliX dans la console et le navigateur ; la session lit).
   - **Premier geste** : CrOliX met l'identifiant et le secret du client de l'essai dans le `.env` de son Acedia
     locale (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`), puis la relance. Ces valeurs ne sortent pas du `.env`.
   - **Le constat** : Acedia locale, Réglages › Compte Google, « Connecter », puis **un second compte**, autre que le
     créateur. On note **où finit l'onglet** : une page de Google (et son texte), ou l'adresse de retour d'Acedia avec
     `error=` (et sa valeur exacte). Puis on se reconnecte avec le compte de test.
   - **Relevé**, sans adresse ni identifiant : la forme du refus, écrite dans ce plan (« Ce que Google écrit ») et
     dans la PR de Lun'Acedia.
   - **Exclu** : le vrai compte de CrOliX (il n'entre qu'au NAS, à l'arrêt C).

3. - [ ] **Le retour de Google lit `error`, l'écran dit le compte attendu** (testeur, puis un développeur serveur et
   `dev-front` ; `server/src/google/oauth.ts`, `app/src/App.svelte`, `views/src/lib/settings/GoogleAccount.svelte`,
   et leurs tests).
   - **Le serveur.** Quand le retour porte `error`, le `state` est effacé comme aujourd'hui, **aucun échange de code
     n'a lieu**, et la réponse est une redirection 302 vers `/?google=<raison>` : `mismatch` pour
     `client_user_mismatch`, `denied` pour `access_denied`, `failed` pour toute autre valeur. La valeur de Google
     n'est jamais recopiée dans l'adresse ni dans la page : seules ces trois raisons sortent. La redirection se fait
     même si le `state` est inconnu : rien n'est accordé, il n'y a rien à protéger.
   - **L'app.** `/?google=<raison>` mène aux Réglages comme aujourd'hui (`App.svelte:33-35`), et la raison arrive à
     la carte Compte Google, qui l'affiche dans son `role="alert"` existant (`GoogleAccount.svelte:72`). Le moyen
     (une prop, un état partagé) est le plus court qui suit l'existant. `connected` ne montre rien de nouveau.
   - **Les textes**, à relire par CrOliX dans la PR :
     `mismatch` : « Google a refusé ce compte : seul le compte qui a créé le projet Google d'Acedia peut s'y
     connecter. » ; `denied` : « La connexion à Google a été annulée. » ; `failed` : « Google n'a pas autorisé la
     connexion. Recommencer depuis ce bouton. »
   - **Dit d'avance.** La ligne « Aucun compte » (`GoogleAccount.svelte:66`) ajoute à son indice : « Seul le compte
     Google qui a créé le projet d'Acedia peut se connecter. » Ce texte tient lieu de message si la tâche 2 montre
     que Google ne revient pas vers Acedia.
   - **Tests, écrits d'abord**, dans les formes d'aujourd'hui :
     - `oauth.test.ts` : `/oauth/callback?error=client_user_mismatch&state=<frais>` rend 302 vers
       `/?google=mismatch`, aucun appel à `TOKEN_URL`, aucun jeton rangé, le `state` consommé ;
       `error=access_denied` donne `denied` ; une valeur inconnue (avec des caractères à échapper) donne `failed` et
       n'apparaît pas dans `location` ; `error` avec un `state` inconnu redirige aussi ; les tests d'aujourd'hui
       restent tels quels (le `state` forgé sans `error` rend toujours 400).
     - `App.test.ts` : avec `/?google=mismatch` dans l'adresse, les Réglages s'ouvrent, la carte Compte Google montre
       le texte de `mismatch` en alerte, et `google` a quitté l'adresse.
     - `Settings.test.ts` : sans compte, la ligne « Aucun compte » dit le compte attendu.
   - **Exclu** : le JSON brut du `state` invalide sans `error` et celui de l'échange refusé (`oauth.ts:140`, `:155`),
     inchangés ; les droits ; tout réglage de Google à l'écran (lun-acedia#55).
   - **Preuve** : les barrières au vert ; une capture de la carte avec le message `mismatch`, prise dans Chrome sur
     Acedia locale ouverte à `/?google=mismatch`. Si la tâche 2 a montré un retour `error=`, le geste réel du second
     compte se rejoue et la capture vient de lui.

4. - [ ] **L'envoi et les adresses d'envoi, prouvés** (CrOliX connecte le compte de test ; la session lit l'écran dans
   Chrome, en lecture, et ne clique « Envoyer » que sur son accord). Après le premier geste de la tâche 2.
   - **Les adresses d'envoi** : l'éditeur ouvert, le champ « De » liste les adresses du compte (`GET /api/send-as` en
     200 dans le réseau de l'onglet). C'est `gmail.settings.basic` à l'œuvre.
   - **L'envoi** : un mail du compte de test **vers lui-même**, sujet daté, envoyé depuis l'éditeur. On attend
     `POST /api/drafts/:id/send` ou `POST /api/send` en 200, puis le mail reçu dans la boîte d'Acedia après la
     synchronisation. C'est `gmail.send` à l'œuvre.
   - **Relevé** dans la PR : les deux statuts, l'heure, la capture du champ « De » et du mail reçu, les adresses
     masquées.
   - **Exclu** : aucun destinataire autre que le compte de test ; le vrai compte.

5. - [ ] **Le plan du NAS** (la session, `docs/plans/2026-11-22-mise-en-service-nas.md` de lun-docs, sur cette
   branche).
   - **Tâche 13** : avant de saisir l'identifiant et le secret, **le vrai compte crée le projet de prod en mode
     Personnel**, après l'arrêt C, par les gestes de `brancher-google.md` ; l'adresse de retour est celle du réseau
     privé. La phrase sur l'avertissement « application non validée » est retirée : il ne doit plus s'afficher, et
     « Vérifier » le constate.
   - **Tâche 4** : elle ne crée plus le projet de prod (il serait lié au mauvais compte, et le mode ne se change pas).
     Elle essaie l'adresse de retour du réseau privé sur le client du projet de l'essai, lié au compte de test.
     L'arrêt reste le même si la console la refuse.
   - **Décision 4** et la section des secrets (l'identifiant et le secret « du client de la tâche 4 ») suivent : le
     client de prod naît à la tâche 13.
   - **Preuve** : le diff relu contre le critère 4 ; `npm run check` de lun-docs au vert.

## Risques

- **Google ne revient pas vers Acedia** pour `client_user_mismatch`. Alors aucun message dans Acedia n'est possible
  après coup : seul le texte dit d'avance tient. Le critère 2 se lit pour lui et pour le test du retour `error=` ;
  la PR le dit, et CrOliX dit si le critère est tenu ainsi.
- **Le choix est définitif.** Un projet Personnel créé par le mauvais compte est à refaire. La tâche 13 du NAS le
  rappelle avant le geste.
- **Un droit restreint** (`gmail.modify`) : accepté à l'essai du 23/11 en mode Personnel. S'il était refusé sur le
  vrai compte, la tâche 13 s'arrête et revient à CrOliX ; la voie de repli reste écrite.
- **Le texte d'aide** de Google peut changer. La page cite la source et sa date de lecture.

## Hors périmètre

Régler Google depuis l'écran plutôt que le fichier d'environnement (lun-acedia#55). Réduire les droits d'Acedia. La
validation de l'app par Google. Les JSON bruts du retour hors `error` (`state` invalide, échange refusé) : une suite
possible, pas ce chantier.

## Limites

- Non vérifié dans le code : rien. Non vérifié ailleurs : la forme du refus `client_user_mismatch` (tâche 2), et le
  statut de publication d'un projet Personnel dans la console (la page n'en parle pas ; l'essai n'en a pas eu besoin).
- La recommandation sur le projet de l'essai et les trois textes de la tâche 3 attendent CrOliX.
