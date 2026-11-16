# Le premier contact sans terminal : le premier appareil de chaque app, appairé depuis sa page. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issues :** lun-anima#72 (privée, la source) ; le chapeau dans lun-docs, une issue dans lun-acedia et une dans
> lun-avaritia, à ouvrir.
>
> **À valider par CrOliX**, avec les points de « À trancher ». Écrit le 16/11 depuis lun-anima#72, la
> [feuille de route](2026-11-07-feuille-de-route-mvp.md) (§ 3, « Le premier contact sans terminal ») et
> l'[état cible](../specs/2026-11-10-etat-cible-cadrage.md) (§ 6, point 6). Code relu sur `main` : lun-anima `cf1dde5`,
> lun-acedia `52742d1`, lun-avaritia `64f9646`, lun-docs `b61b600`. Relu le même jour par le plan-challenger : ses
> trois bloquants et ses quatorze remarques sont repris, chacun vérifié dans le code.

**But :** sur une installation en service neuve, le premier appareil du core, d'Acedia et d'Avaritia s'appaire sans
terminal ni journal. Le reste du point 6 de l'état cible (Google depuis l'interface, la liaison d'un poste) vient
après le MVP (feuille de route, § 3).

**Source :** lun-anima#72, relevée à la recette du 08/11 sur le desktop : chaque serveur n'écrit le code de son premier
appareil que dans son journal, l'installation ne le dit pas, l'écran du core dit que le code est « donné à
l'installation », et les écrans d'Acedia et d'Avaritia renvoient à une commande du terminal. Le contournement d'alors :
lire les trois codes dans les journaux, dans les 10 minutes. La décision de CrOliX du 08/11, dite pendant cette mise en
service : en recette, tout se règle par les écrans, dans Chrome ; les commandes ne sont qu'un recours.

**Critères de fin**, tous prouvés sur le laptop. Les trois premiers viennent de l'issue ; le quatrième est la
sécurité ; le cinquième, les barrières et la doc.

1. Trois bases neuves, les trois serveurs lancés depuis leurs builds, sur leurs ports habituels : le premier appareil
   du core, d'Acedia et d'Avaritia s'appaire, puis Acedia et Avaritia se relient au core, sans commande après le
   lancement, en suivant seulement ce que disent l'installation et les écrans.
2. L'écran d'entrée du core, et sa page d'accueil, disent ce qui se passe réellement. Les écrans d'Acedia et
   d'Avaritia ne renvoient plus d'abord au terminal ; la commande y reste, en dernier, comme recours.
3. Un code expiré avant le premier appareil a son chemin de reprise sans terminal : refusé, il offre « Nouveau code »,
   sur la page ouverte sur la machine qui héberge. Un test par app.
4. Le code du premier appareil n'est donné qu'à une page de la machine qui héberge, à l'adresse locale de l'app, tant
   qu'aucun client vivant n'existe. Toute autre demande reçoit le même refus et ne crée aucun code ; chaque cas de
   refus a son test. Le verrou des 5 échecs ne crée aucun code.
5. Les barrières des quatre dépôts sont vertes. Les README et la page de mise en service disent le chemin des écrans.

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-anima`, `feat/premier-contact` | lun-anima#72, privée : la part du core s'y ajoute | `critique` (« Le niveau ») |
| `lun-acedia`, `feat/premier-contact` | à ouvrir | `critique` |
| `lun-avaritia`, `feat/premier-contact` | à ouvrir | `critique` |
| `lun-docs`, `docs/premier-contact` | l'issue chapeau, à ouvrir | `trivial` |

**Le niveau.** Une route sans jeton qui donne un code d'appairage touche l'accès : c'est la sécurité, `critique`
d'après [`workflow.md`](../../standards/workflow.md) (ligne 39), qui demande « les cas limites testés, une preuve bout
en bout décrite dans la PR ». Le contrat satellite ne change pas : la route est hors de `/lun/v1`, et le contrat dit
déjà que le code est « donné par le satellite, par son front ou par sa commande `pair-code` »
([`contrat-satellite.md`](../../standards/contrat-satellite.md), ligne 66). La part de lun-docs est de la doc :
`trivial`. Le niveau de lun-anima#72 se relève à la validation (« À trancher », point 2).

**Show** ([`git.md`](../../standards/git.md), lignes 39 à 42) pour les quatre PR : les critères se prouvent sur le
laptop. Fusionner ne change rien au service du desktop : la route ne donne rien à une installation qui a déjà un
client. L'installation en service neuve ne s'essaie qu'après la fusion : elle est dans « Ce que le desktop
vérifiera », comme pour le chantier [« tenir en continu »](2026-11-12-tenir-en-continu.md).

**Les issues.** Un chapeau dans **lun-docs**, « Le premier contact sans terminal », qui porte ce plan et la liste des
autres ; une issue dans **lun-acedia** et une dans **lun-avaritia**, qui renvoient au chapeau. La part du core
s'ajoute à lun-anima#72, privée. Chaque PR de code ferme l'issue de son dépôt ; la PR de lun-docs ferme le chapeau, une
fois les trois autres fusionnées.

## Ce que CrOliX voit, écran par écran

Une installation neuve, sur la machine qui héberge le service, avec son navigateur. Les textes entre guillemets sont
proposés : ils se valident avec le plan.

1. **La fin de l'installation**, dans le terminal de l'installation, qui sert une fois : « Premier appareil : ouvrir
   sur cette machine, dans cet ordre », puis l'adresse locale de l'app du core, d'Acedia et d'Avaritia, et « Chaque
   page affiche le code de son premier appareil, déjà saisi. »
2. **L'app du core**, à son adresse locale. La page « Ce navigateur n'est pas encore reconnu » montre le code déjà
   dans son champ : « Aucun appareil n'est encore reconnu. Le code du premier appareil est déjà saisi : seule cette
   page, ouverte sur la machine qui héberge Lun'Anima, l'affiche. » Sous le champ : « Code du premier appareil. Il
   expire à 14:32. » CrOliX appuie sur « Entrer ».
   - Le code a expiré entre-temps : « Entrer » le refuse, avec le message des codes refusés, et la page offre
     « Nouveau code », qui en remet un dans le champ.
   - La même page ailleurs (le téléphone, par le tailnet), ou une fois un client vivant : aucun code. Elle dit :
     « Pour entrer, saisis le code affiché sur un appareil déjà reconnu : Atelier, Appareils, Ajouter un appareil. Sur
     une installation neuve, ouvre cette page sur la machine qui héberge Lun'Anima : le code du premier appareil s'y
     affiche. » Ce texte remplace « le code est donné à l'installation de Lun'Anima ».
3. **Le premier lancement** (la mise en route) : « Cet appareil est reconnu » est coché ; restent la clé du modèle et
   les plafonds, par leurs écrans, sans changement.
4. **Relier Acedia.** Atelier › Postes propose « Relier » à Lun'Acedia, avec son adresse locale ; le formulaire demande
   « Dans Lun'Acedia, ouvre Réglages › Appareils et applications › Relier un appareil ». CrOliX ouvre Acedia :
   - sa page « Relier ce navigateur » montre de même le code de son premier appareil, déjà saisi, avec son heure
     d'expiration, et prévient : « Ce code est pour ce navigateur. Pour relier Lun'Anima : entrer, puis Réglages ›
     Appareils et applications › Relier un appareil. » « Relier », et Acedia s'ouvre ;
   - dans ses Réglages, « Relier un appareil » donne un code, comme aujourd'hui ;
   - ce code, collé dans le formulaire du core : « Lun'Acedia est relié. », et la Constellation.
5. **Relier Avaritia** : le même chemin.
6. **Les appareils suivants** (le téléphone, Luxuria) : Atelier › Appareils › Ajouter un appareil, comme aujourd'hui.

Le terminal n'apparaît plus qu'en recours : la commande `pair-code` d'Acedia et d'Avaritia, en dernière ligne de leur
page.

## Le code : montré, saisi, sa durée de vie

- **Montré** : seulement sur la page d'entrée de l'app, ouverte sur la machine qui héberge, tant qu'aucun client
  vivant n'existe. La page le demande une fois à son affichage, puis à chaque « Nouveau code » ; jamais en boucle,
  aucune minuterie.
- **Saisi** : déjà dans le champ. CrOliX valide par le bouton de la page, qui passe par l'échange de code qui existe
  déjà, avec son verrou.
- **Durée de vie** : celle de tout code, 10 minutes, à usage unique, l'heure d'expiration dite en texte fixe. Tant
  qu'il vaut, la page et un redémarrage du serveur redonnent le même ; ensuite, un nouveau, seulement à la demande de
  la page. Aucun refus n'en crée.

## Ce qui empêche un tiers de s'en servir

Les trois serveurs suivent les mêmes règles ([`securite.md`](../../standards/securite.md) : le contrôle d'accès se
vérifie côté serveur, sur chaque route).

- **Le réseau local ne les joint pas** : ils n'écoutent que la boucle locale.
- **Le tailnet les joint par `tailscale serve`**, qui relaie depuis la boucle locale : une requête relayée paraît
  locale. La route refuse donc toute requête qui porte un en-tête de relais (`X-Forwarded-For`, `X-Forwarded-Host`,
  `Forwarded`, ou un en-tête `Tailscale-…`), ou dont l'hôte demandé (`Host`) n'est pas l'adresse locale de l'app.
- **Une page d'un autre site, ou d'un autre port local, ne peut pas s'en servir** : la route exige l'origine de l'app
  elle-même (`Origin`) ; une page d'ailleurs, ou un nom qui pointe sur la boucle locale après coup, est refusée. Sans
  en-tête de partage entre origines, aucune ne lirait la réponse de toute façon.
- **La route ne donne de code que tant qu'aucun client vivant n'existe** : la fenêtre se ferme au premier appareil.
- **Pas de code de plus** : la page et les redémarrages reprennent le code qui vaut ; 10 minutes, usage unique.
- **Le verrou des 5 échecs reste, et redevient ce que dit le contrat.** Au verrou, Acedia et Avaritia recréent un code
  de premier appareil ; le contrat dit que le verrou bloque l'appairage
  ([`contrat-satellite.md`](../../standards/contrat-satellite.md), lignes 73 à 76). Ils ne le feront plus.
- **Le refus est le même pour tous** : un 404 au même corps, qui ne dit pas si un client existe. Une lecture qui
  échoue (l'adresse du socket introuvable) vaut refus, jamais une erreur 500.

Ce qui reste ouvert est dans « Limites ».

## Ce que le code fait aujourd'hui

### Lun'Anima

Le core : lun-anima#72.

### Lun'Acedia

- **Le code du premier appareil va au journal** : `bootstrapPairing` (`server/src/contract/auth.ts:165-169`), appelé au
  démarrage (`server/src/main.ts:66`), crée un nouveau code à chaque démarrage tant qu'aucun client n'est vivant, et
  l'écrit (« Code d'appairage du premier appareil (10 min) »). Il ne reprend pas un code encore valable.
- **Le verrou recrée ce code** : au cinquième échec en 10 minutes, `recordPairingFailure` (`auth.ts:75-98`) annule les
  codes en cours, puis rappelle `bootstrapPairing` (`:90`) quand aucun client n'existe. Son commentaire le dit
  (`:69-74`), et le test `re-issues the first-run code when no client exists` (`server/src/contract/auth.test.ts:57-67`)
  le tient. C'est l'écart au contrat du § précédent.
- **Les codes** : `issuePairingCode` (`auth.ts:24-34`), 10 minutes ; l'échange, `POST /lun/v1/pair`
  (`server/src/contract/routes.ts:66-98`), compte chaque échec au verrou (`:91`). Un appareil relié en demande par
  `POST /api/pairing-codes` (`server/src/app.ts:79-82`), sous la garde de toute la surface `/api`, réservée aux
  appareils (`:76`).
- **Une erreur inattendue** rend une 500 avec son message (`app.ts:134`).
- **L'écoute** : la boucle locale par défaut (`main.ts:125-126`) ; le front construit est servi par le même serveur,
  à la racine (`app.ts:132`), donc à la même origine. Aucun en-tête de politique de référent n'est posé.
- **L'écran** : `app/src/Pair.svelte`, montré par `app/src/App.svelte:282`. « Où trouver le code » (`:116-140`) met en
  premier « Sur la machine qui héberge Lun'Acedia », avec `npm run pair-code` et un bouton « Copier » (`:26`,
  `:118-133`), puis « Sur un appareil déjà relié » (`:134-139`). Ses tests : `app/src/Pair.test.ts:38`, `:118`. Un
  jeton refusé (401) est oublié par le front (`App.svelte:100`).
- **La doc** : `README.md:78` (un code refusé : « en redemander un avec `npm run pair-code` ») ;
  `docs/installer-sur-le-telephone.md:31-33` (« Au tout premier lancement, il est aussi dans les journaux du
  serveur »).

### Lun'Avaritia

Le même module, mot pour mot sauf un commentaire : `server/src/contract/auth.ts`, aux mêmes lignes ; l'appel au
démarrage (`server/src/main.ts:42`), l'écoute (`:60-61`), l'échange (`server/src/contract/routes.ts:50`, verrou
`:75`), la garde de `/api` (`server/src/app.ts:101`), le front servi (`:141`), l'erreur inattendue (`:143`). L'écran :
`app/src/Pair.svelte` (commande `:18`, « Où trouver le code » `:108-133`), montré par `app/src/App.svelte:239` ; ses
tests `app/src/Pair.test.ts:36`, `:116`. En développement, Vite relaie `/api` et `/lun` vers le serveur
(`README.md:57-58`).

### Lun'Luxuria

Rien à changer. Un jeton refusé (401) est oublié (`src/session.svelte.ts:220-225`) : c'est ce qui rend la recette du
desktop délicate (« À trancher », point 3).

### La page de mise en service

[`mise-en-service-desktop.md`](../mise-en-service-desktop.md) : le § 2 finit sur les tâches lancées, sans rien du
premier appareil ; le § 4 relie les satellites par une commande du terminal ; le § 5 appaire Luxuria par l'écran.

## Les issues voisines

- **lun-anima#90**, relier de nouveau un poste déjà relié : **n'entre pas**. C'est la liaison d'un poste, que la
  feuille de route (§ 3, 12/11) met après le MVP avec le reste du point 6. Elle n'empêche aucun critère : une
  installation neuve relie des postes « à relier », et l'Atelier leur propose « Relier » avec leur adresse locale.
- **lun-anima#79**, l'adresse des commandes du terminal : **n'entre pas**. Les commandes passent par un jeton, pas par
  l'origine du navigateur ; elle n'empêche aucun critère ([`workflow.md`](../../standards/workflow.md), « La règle
  anti-ajout infini »). Elle reste à l'inbox.
- **lun-acedia#30**, une nouvelle liaison qui remplace l'ancienne : **n'entre pas, et le classement tient**. L'audit
  l'avait reportée « après le MVP, avec l'appairage par code affiché » ([audit](2026-11-08-audit-ecosysteme.md),
  Q3). Le 12/11, seul le premier appareil est entré au MVP ; la liaison d'un poste en est restée dehors. Ce chantier
  ne crée qu'une liaison par poste, sur une base neuve : aucun doublon. Le doublon naît d'une liaison refaite,
  c'est-à-dire de lun-anima#90.

## Les tâches

**Pour chaque tâche.** Les tests d'abord, vus échouer avant le code, écrits par le développeur. Le `reviewer` relit
chaque diff contre sa tâche avant la PR de son dépôt. Les serveurs des satellites n'ont pas d'agent à eux : `dev-core`
les code, le `CLAUDE.md` du satellite dans son brief ; les écrans sont à `dev-front`, vérifiés dans Chrome. Le
`livreur` coche ce plan et ouvre les PR en brouillon. Aucune tâche ne lit ni n'affiche un `.env`.

**En parallèle.** Chaque développeur dans son worktree, créé depuis la branche du chantier.

- **D'emblée, ensemble** : 1 (les trois tâches du core), 4 et 5. La forme de la route est fixée ici ; l'écran se code
  contre elle.
- **Après** : 6 quand 4 est relue, 7 quand 5 est relue. Avaritia applique le diff d'Acedia ; le `reviewer` compare les
  deux diffs, ligne à ligne.
- **En dernier** : 8, au fil des fusions.

**Les fichiers partagés**, raison de cet ordre : le `README.md` d'Acedia est à la tâche 5 seule, celui d'Avaritia à
la 7 seule. Dans un dépôt, la route et l'écran ne partagent aucun fichier.

### Lun'Anima

1. - [ ] **Lun'Anima : 3 tâches, lun-anima#72 (privée).** Leur détail, fichiers compris, est dans l'issue. Elles
   portent, pour le core, les critères 1 à 5, et suivent les règles de ce plan.

### Lun'Acedia

4. - [ ] **La route du premier code** (`dev-core`). *Part d'emblée.* `server/src/contract/auth.ts`, un module de route
   à côté de `server/src/contract/routes.ts`, `server/src/app.ts`, `server/src/main.ts`, leurs tests.
   - **Le premier commit remet le verrou au contrat** : l'appel de `bootstrapPairing` dans `recordPairingFailure`
     (`auth.ts:90`) part ; le commentaire (`:69-74`) dit ce que fait le verrou, annuler et écrire sa ligne ; le test
     `auth.test.ts:57-67` est remplacé par son contraire : cinq codes faux sans client, la ligne du verrou, aucun code
     créé.
   - `firstPairingCode(db, now)` dans `auth.ts` : `undefined` si un client est vivant (la condition de
     `bootstrapPairing`, `:166`) ; sinon le dernier code en cours, non utilisé et non expiré, ou à défaut un nouveau
     par `issuePairingCode` (`:24-34`). `bootstrapPairing` passe par elle : un redémarrage redonne le code qui vaut.
   - `POST /first-code`, montée avant le front (`app.ts:132`), hors de `/api` (gardée, `:76`) et du contrat `/lun/v1`.
     Réponse 200 `{ code, expiresAt }`, la forme de `POST /api/pairing-codes`, avec `Cache-Control: no-store`.
   - Elle ne répond ainsi que si tout tient, dans cet ordre :
     - `localOrigin`, une nouvelle entrée des deps (`AppDeps`, `app.ts:30`), est posée. `main.ts` la pose à l'adresse
       locale d'Acedia ([`environnements.md`](../../standards/environnements.md), « Une origine par app »), avec le
       port où il écoute, et seulement quand il écoute sur la boucle locale, le défaut (`:125`) ;
     - l'adresse du socket appelant est de la boucle locale, en IPv4, en IPv6, ou en IPv4 écrite en IPv6. Elle se lit
       par `getConnInfo` de `@hono/node-server`, **dans un `try`** : sans socket (un `app.request` sans `env`), il
       lève, et l'erreur irait à l'`onError` (`app.ts:134`), une 500 avec son message. Un échec de lecture vaut
       refus. Le développeur vérifie le module dans sa version ; s'il ne se simule pas dans `app.request`, une
       fonction des deps ;
     - `Host` vaut l'hôte de `localOrigin`, et `Origin` vaut `localOrigin` : absent ou `null`, refus. Une ligne de
       commentaire le dit près de la vérification : une politique de référent `no-referrer` (celle que pose par
       défaut `secureHeaders()` de Hono, que les serveurs n'emploient pas aujourd'hui) fait envoyer `Origin: null`, et
       la page ne verrait plus de code ;
     - aucun en-tête `X-Forwarded-For`, `X-Forwarded-Host`, `Forwarded`, ni aucun dont le nom commence par
       `tailscale-` ;
     - `firstPairingCode` rend un code.
   - Sinon : 404, toujours `{ error: 'Pas de code ici' }`, et aucun code créé. Un refus ne compte pas au verrou : ce
     n'est pas un code essayé.
   - Tests :
     - depuis la boucle locale, `Host` et `Origin` justes, aucun client : 200, `Cache-Control: no-store`, et le code
       s'échange une fois par `POST /lun/v1/pair` ;
     - deux demandes de suite rendent le même code ; 10 minutes plus tard (horloge du harnais), un nouveau ;
     - refusé, même corps, aucun code en base, pour chacun : un client vivant (appareil, ou application reliée par
       autorisation) ; une adresse hors boucle locale ; le socket inconnu (aucun `env`) ; un `Host` du tailnet
       (inventé) ; `Host` à l'autre nom de la boucle locale (l'adresse IP au lieu du nom) ; `Origin` absent, `null`,
       d'un autre port local, d'un autre site ; chacun des en-têtes de relais ; `localOrigin` absent ;
     - le verrou atteint sans client : aucun code créé ; la demande suivante en donne un ;
     - deux `bootstrapPairing` dans les 10 minutes écrivent le même code ; les tests de `pair.test.ts:109-124`
       passent tels quels.
   - Exclu : le contrat `/lun/v1` ; le verrou lui-même (5 échecs, global) ; la lecture des corps de `/lun/v1/pair`
     (« Les suites ») ; la commande `pair-code` ; l'écran.
5. - [ ] **L'écran « Relier ce navigateur » montre le premier code** (`dev-front`). *Part d'emblée.*
   `app/src/Pair.svelte`, `app/src/session.ts`, `app/src/Pair.test.ts`, `README.md`,
   `docs/installer-sur-le-telephone.md`.
   - `firstCode(baseUrl)` dans `session.ts`, à côté de `pair` : `POST {baseUrl}/first-code`, rend `{ code, expiresAt }`
     sur un 200 qui porte un code à six chiffres, `null` sur tout le reste, panne comprise, sans message d'erreur.
   - À l'affichage, un seul appel. Un code :
     - le champ le tient déjà ; le titre de la carte reste ; son texte d'appui devient « Aucun appareil n'est encore
       appairé à Lun'Acedia. Le code du premier appareil est déjà saisi : seule cette page, ouverte sur la machine qui
       l'héberge, l'affiche. » ;
     - sous le champ, en texte fixe : « Code du premier appareil. Il expire à 14:32. », l'heure formée comme dans
       `views/src/lib/settings/Devices.svelte:113` ;
     - puis : « Ce code est pour ce navigateur. Pour relier Lun'Anima : entrer, puis Réglages › Appareils et
       applications › Relier un appareil. » Le formulaire du core demande le code « affiché par » le poste : sans
       cette phrase, le premier code y serait collé, et ce navigateur n'aurait plus de code à lui ;
     - « Relier » l'envoie par le chemin d'aujourd'hui. Le champ ne part pas seul : `CodeInput` n'envoie au sixième
       chiffre que sur une saisie (`views/src/lib/ui/CodeInput.svelte:67`, dans `onInput`). Refusé (401, un code
       expiré compris) : le message d'aujourd'hui, et « Nouveau code » (secondaire), qui rappelle la route une fois et
       remet le champ.
   - Aucune minuterie : ni compte à rebours, ni passage seul à « expiré », ni nouvelle demande. Aucun code gardé dans
     le stockage du navigateur.
   - Sans code : la page d'aujourd'hui, « Où trouver le code » dans cet ordre : « Sur un appareil déjà relié »
     (inchangé) ; « Sur une installation neuve » : « Cette page, ouverte sur la machine qui héberge Lun'Acedia,
     affiche le code du premier appareil. » ; « Recours, dans un terminal de cette machine », la commande et « Copier ».
   - Le même bloc en mode autorisation (les étapes « Relier le navigateur », « Autoriser »).
   - Doc : `README.md:78` dit « Nouveau code » sur la page de la machine qui héberge, pour une installation neuve,
     sinon un appareil relié, la commande en recours ; `docs/installer-sur-le-telephone.md:31-33` remplace « dans les
     journaux du serveur » par la page ouverte sur le poste qui fait tourner Acedia. Le README dit aussi la route et
     ses règles, en trois lignes.
   - Tests. Le faux serveur de `Pair.test.ts` (`server`, `:8-15`) rend ses réponses dans l'ordre, à tout appel, et
     `sent` lit l'appel par son rang (`:17-18`) : l'appel de l'affichage prendrait la réponse prévue pour le code, et
     les comptes (`:50`, `:58`, `:85`, `:96`) seraient faux. Il répond donc à `/first-code` à part (404, sauf un code
     donné par le test), et `sent` et les comptes ne regardent que `/pair` ; les assertions d'aujourd'hui restent.
     - la route rend un code : le champ le tient, l'heure et la phrase du core sont dites, « Relier » l'envoie ;
     - la route rend 200 sans code (la réponse par défaut du faux serveur, un jeton) : champ vide ;
     - la route rend 404, ou l'appel échoue : champ vide, les trois sources dans l'ordre, la commande en dernier (les
       tests de `Pair.test.ts:38` et `:118` passent) ;
     - le code refusé (401) : « Nouveau code » rappelle la route une fois et remplit le champ ;
     - un appel à l'affichage, un par clic, aucun autre, minuteries simulées avancées d'une heure.
   - Vérifié dans Chrome, sur une base neuve, à l'adresse locale d'Acedia, dans un profil à part (« Ce qui se prouve
     sur le laptop ») : capture des deux états dans la PR.
   - Exclu : renommer « Relier ce navigateur » et « Relier un appareil » en « appairer », comme le veut le
     [dictionnaire](../../standards/dictionnaire.md) (« Les suites ») ; les Réglages ; le serveur.

### Lun'Avaritia

6. - [ ] **La route du premier code** (`dev-core`). Après 4 relue. Le diff de la tâche 4 appliqué tel quel, premier
   commit compris : `server/src/contract/auth.ts`, la route, `server/src/app.ts` (avant le front, `:141` ; hors de
   `/api`, `:101` ; `onError`, `:143`), `server/src/main.ts` (`localOrigin` à l'adresse locale d'Avaritia, quand il
   écoute sur la boucle locale, `:60`), leurs tests. L'adresse locale d'Avaritia est une adresse IP : le test du
   `Host` refuse le nom au lieu de l'adresse. Exclu : ce qu'exclut la 4.
7. - [ ] **L'écran « Relier ce navigateur » montre le premier code** (`dev-front`). Après 5 relue. Le diff de la
   tâche 5 appliqué au nom de Lun'Avaritia : `app/src/Pair.svelte`, `app/src/session.ts`, `app/src/Pair.test.ts` (ses
   tests `:36` et `:116` passent), `README.md`. L'heure se forme comme dans `app/src/reglages/Appareils.svelte:131`.
   La route n'est pas relayée par Vite en développement : c'est voulu (hors périmètre). Exclu : ce qu'exclut la 5.

### lun-docs (la session)

8. - [ ] **La page de mise en service et la feuille de route** (`trivial`). En dernier, au fil des fusions.
   - [`mise-en-service-desktop.md`](../mise-en-service-desktop.md), § 2 : l'installation finit sur les trois pages à
     ouvrir sur la machine. Un nouveau passage « Le premier appareil », avant le § 4 : le chemin du § « Ce que CrOliX
     voit » ci-dessus, « Nouveau code » pour un code refusé.
   - § 4 : le chemin des écrans d'abord, Atelier › Postes › « Relier », le code donné par les Réglages du satellite.
     Aucune commande du core n'entre dans la page ; ce qu'elle en dit déjà est un sujet à part (« Hors périmètre »).
   - § 11 : rien à ajouter, le premier appareil sert à l'installation.
   - [La feuille de route](2026-11-07-feuille-de-route-mvp.md) : le chantier du § 3 renvoie à ce plan et à ses issues ;
     le § 4 gagne les points du desktop ci-dessous.
   - Aucune adresse nouvelle dans lun-docs : la page dit les adresses locales qu'elle dit déjà.

## Ce qui se prouve sur le laptop

- Les tests de chaque route et de chaque écran, cas de refus compris.
- **Le parcours**, décrit dans chaque PR : trois bases neuves de test, dans un dossier jetable ; les fronts construits ;
  les trois serveurs lancés depuis leurs builds, sur leurs ports habituels. Dans Chrome, aux adresses locales : le
  premier appareil de chacun, la mise en route, Acedia puis Avaritia reliés par les écrans, un code laissé expirer
  puis « Nouveau code ». Aucune commande après le lancement. Des captures dans les PR.
- **Dans un profil de Chrome à part**, une fenêtre privée, ou Chrome sans interface : à la même origine, une base neuve
  répond 401 aux jetons du profil habituel, et les fronts les oublient. Les jetons de développement du laptop restent.
- Une demande avec un `Host` ou un en-tête de relais du tailnet, faite à la main : le 404. Le tailnet lui-même n'est
  pas sur le laptop.
- L'installation en mode simulé dit les trois pages à ouvrir.
- Le dossier jetable et ses bases sont retirés à la fin.

## Ce que le desktop vérifiera

À la session du desktop (feuille de route, § 4), après la fusion, selon « À trancher », point 3. La marche du service
est dans lun-anima#72.

- **Une installation neuve, en service** : trois bases neuves, l'installation et les écrans seuls, jusqu'aux deux
  postes reliés.
- **Une requête forgée par le tailnet** : depuis le desktop, vers le nom du tailnet de l'app du core puis d'Acedia,
  avec `Host` et `Origin` réglés sur l'adresse locale de l'app, avant le premier appareil. On attend le 404. Un 200
  dirait que `tailscale serve` ne pose pas ses en-têtes de relais : CrOliX tranche avant le rodage.
- **Le téléphone**, dans un onglet privé, par le tailnet, avant le premier appareil : aucune page n'y montre de code.

## La machine dédiée

Le plan de bascule se refait à son achat ([ADR 0012](../../adr/0012-prod-machine-dediee.md)). Si elle a un écran et un
navigateur, le même chemin vaut. Sans écran, ou derrière un relais, aucune page n'y donne de code ; la bascule dit le
chemin.

## Les suites, en inbox

Une issue `inbox` chacune, ouverte par la session ; aucune n'entre ici.

- **Le core relié par l'écran devient un appareil du satellite**, pas une application : il obtient toute la surface
  `/api`. Le contrat ne prévoit le code pour le core qu'en repli sans navigateur
  ([`contrat-satellite.md`](../../standards/contrat-satellite.md), ligne 81).
- **Le module d'appairage d'Acedia et d'Avaritia**, tenu en double, mot pour mot : un module partagé.
- **Les routes d'appairage lisent un corps JSON quel que soit son type** (`server/src/contract/routes.ts:22-26` chez
  Acedia, `:38` chez Avaritia ; le core, à voir dans son issue) : une page d'un autre site peut y envoyer un code faux,
  qui compte au verrou global.
- **Les mots « relier » des écrans d'appareils** d'Acedia et d'Avaritia, que le dictionnaire veut « appairer ».

## Hors périmètre

- Le reste du point 6 de l'état cible, après le MVP : Google depuis l'interface (lun-acedia#55), le jeton Google
  illisible (lun-acedia#62), la liaison d'un poste (lun-anima#90, lun-acedia#30).
- lun-anima#79, à l'inbox.
- Le verrou global, qu'un tiers du tailnet peut déclencher pour annuler un code ; les jetons d'appareil sans
  expiration. Le plan [« tenir en continu »](2026-11-12-tenir-en-continu.md) les rangeait avec ce chantier (« Hors
  périmètre ») ; ils n'empêchent aucun critère.
- Les installations de développement, où le code est au terminal (l'issue) ; la route n'est pas relayée par Vite.
- Luxuria ou le téléphone comme premier appareil : ils s'appairent ensuite, par l'Atelier.
- La page d'autorisation des satellites : inchangée.
- Ce que la page de mise en service dit déjà de l'intérieur du core : un sujet à part, porté à CrOliX.

## Limites

- **Pendant la fenêtre**, entre l'installation et le premier appareil, un programme de la machine qui héberge peut
  demander le code. Il pouvait déjà le lire au journal ; la route n'élargit rien de notable.
- **Un programme du tailnet** qui écrit ses propres en-têtes ne s'arrête que si `tailscale serve` pose les siens : la
  requête forgée du desktop le dira. Le tailnet n'a que les appareils de CrOliX.
- **Sans navigateur sur la machine**, pas de chemin : la machine dédiée le dira.
- **Une seule adresse par app** : la page ouverte à un autre nom de la boucle locale ne montre pas de code. Le texte de
  l'écran et l'installation disent la bonne.
- **Un satellite qui n'a plus que le core pour client** (tous ses appareils retirés) ne donne pas de code : la commande
  en recours. De même si le premier code d'un satellite est collé dans le formulaire du core avant que le navigateur
  s'appaire : la page du satellite prévient, mais n'empêche pas.
- **Le core relié par l'écran a toute la surface `/api` du satellite** (« Les suites »).
- **L'heure d'expiration** se lit sur l'horloge du navigateur, comme dans les Réglages d'Acedia, et ne se met pas à
  jour : un code expiré se découvre au refus.
- **Un navigateur qui n'envoie pas `Origin`**, ou l'envoie `null`, ne voit pas de code. Chrome l'envoie sur un POST de
  même origine, tant qu'aucune politique `no-referrer` n'est posée.

## À trancher par CrOliX

1. **Le code montré, ou un bouton seul.** (a) Le code déjà saisi, avec son heure d'expiration ; CrOliX appuie sur
   « Entrer » ou « Relier ». (b) Un bouton « Appairer ce navigateur », sans code : la route rend le jeton. **Je
   recommande (a)** : le contrat dit « Appareil : navigateur relié par un code à 6 chiffres »
   ([`contrat-satellite.md`](../../standards/contrat-satellite.md), ligne 69). (b) appairerait un appareil sans code,
   donc changerait le contrat, `critique` aussi pour lun-docs.
2. **Le niveau.** `critique` pour les trois dépôts de code ; lun-anima#72 dit `standard`. **Je recommande
   `critique`** : une route sans jeton qui donne un code d'appairage, c'est l'accès (`workflow.md`, ligne 39).
3. **La recette du desktop.** Une base neuve à la même adresse répond 401 aux appareils du rodage, qui oublient alors
   leur jeton : l'app du core dans le navigateur, Luxuria, le téléphone, les fronts d'Acedia et d'Avaritia.
   - (a) Avant le rodage, une installation neuve à part, puis le service du rodage remis. Pendant la recette :
     Luxuria quitté, le téléphone en onglet privé, aucun onglet habituel ouvert sur les trois origines, l'essai dans
     une fenêtre privée. Un appareil qui oublie quand même son jeton s'appaire de nouveau par l'Atelier ensuite.
   - (b) La recette est l'installation du rodage elle-même, s'il repart sur des bases neuves : rien à remettre après.

   **Je recommande (b) si le rodage repart sur des bases neuves**, moins cher et sans risque pour les appairages ;
   sinon (a), avec ses précautions.
