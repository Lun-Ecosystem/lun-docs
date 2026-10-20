# Relier et alerter : palier Lun'Acedia et Lun'Anima

> Date : 2026-10-20. Cadré avec CrOliX. Découle de la preuve de bout en bout du palier 1 de
> Lun'Anima (Lun-Ecosystem/lun-anima#4), du standard `contrat-satellite.md` et de `design.md`.
> Ce qui est marqué **[choix Claude]** est une décision de l'agent, à contester librement ; le reste
> a été dit ou validé par CrOliX.

## 1. Intention

La preuve de bout en bout a marché, mais elle a montré trois irritants :

- **Relier les projets est trop compliqué.** Trois codes différents, une commande avec un code
  recopié, un front Acedia bloqué une fois son unique code consommé par le core, et un core qui
  répond 404 dans le navigateur. CrOliX : « le système de pair est assez complexe et pas intuitif ».
- **L'appairage d'Acedia se force.** `/lun/v1/pair` accepte un nombre illimité d'essais, et le
  serveur écoute sur toutes les interfaces.
- **Une clé d'API morte passe inaperçue.** Une clé révoquée ou expirée n'est pas distinguée des autres
  erreurs, rien ne prévient avant l'échéance, et la remplacer impose d'éditer un `.env` et de
  redémarrer.

Ce palier règle les trois, sur Lun'Acedia surtout et sur le core de Lun'Anima pour sa part.

### Ce qu'est Acedia, et ce qu'est le core

Dit par CrOliX, et qui guide tout le palier : **Acedia est la machine**, avec ou sans le core. Le
core n'est qu'une interface qui s'y branche pour apporter l'assistante personnelle et sa mémoire.
Une fois reliée, Acedia se pilote depuis Lun'Anima (voix, à la main, assisté) ; le front autonome
d'Acedia ne sert plus au quotidien, il reste le mode de secours.

Conséquence : **le front autonome d'Acedia ne parle jamais d'Anima.** Le texte actuel des Réglages
(« Un code à usage unique pour relier un nouvel appareil ou le core Lun'Anima à Lun'Acedia ») est à
corriger. Le nom « Lun'Anima » n'y apparaît que comme une donnée : le nom d'une application qui s'est
reliée.

## 2. Ce que CrOliX a décidé

### 2.1 Relier comme une autorisation Google

Validé sur maquette (`.superpowers/brainstorm/…/flux-connexion.html`). Le geste part de **Lun'Anima**,
comme on autorise Claude à accéder à un Google Drive depuis Claude :

1. Dans Lun'Anima, CrOliX donne l'adresse du satellite et lance la liaison. Tant que le panel n'existe
   pas : `npm run connect -- <url du satellite>`, qui ouvre le navigateur.
2. Le navigateur arrive sur la **page d'autorisation** d'Acedia : « Lun'Anima demande l'accès à
   Lun'Acedia », la liste de ce que l'application pourra faire, **Autoriser** ou **Refuser**.
3. Après « Autoriser », le navigateur revient vers Lun'Anima, qui reçoit son jeton. Acedia apparaît
   reliée et en ligne. Aucun code recopié entre les deux.

Garde-fou : la page d'autorisation n'accepte que depuis un **appareil déjà relié** à Acedia. Si le
navigateur ne l'est pas, elle demande d'abord un code à 6 chiffres, donné par `npm run pair-code` sur
la machine qui héberge Acedia (étape « 2 bis » de la maquette), qui relie ce navigateur comme appareil
puis reprend l'autorisation.

### 2.2 Les Réglages d'Acedia : « Appareils et applications »

La rubrique Appairage devient **Appareils et applications** : la liste de ce qui a accès à Acedia
(nom, appareil ou application, date de liaison), un bouton **Retirer** par ligne, et **Relier un
appareil** qui affiche un code à usage unique. Texte en voix technique neutre, sans citer Anima.

### 2.3 La DA est une contrainte de fin, pas une option

CrOliX : « très attention au web design et à la contrainte de DA (on est au début mais je vois venir
les dérives) ». Chaque écran de ce palier applique `standards/design.md` et le skill `lun-design` :
tokens et polices de la DA seulement, monde Acedia (`#070C14` / `#3A6080`) pour les écrans d'Acedia,
monde Anima (`#120A0A` / `#7A1818`) pour ceux du core, voix technique neutre, pas de tiret cadratin.
La conformité DA est un critère de fin et un point de la revue, avec une capture de chaque écran dans
la PR.

## 3. Le périmètre

### 3.1 Contrat satellite : la liaison par autorisation

Ajout au contrat v1 (une route ajoutée n'est pas une rupture, `contrat-satellite.md` § Versionnement).
Le flux suit OAuth 2.0 « authorization code » avec PKCE (S256), en plus simple : un seul satellite,
un seul client à la fois.

- **Le client** (le core) choisit `state` et `code_verifier` au hasard, puis ouvre
  `GET <satellite>/lun/v1/authorize?client=<nom>&redirect_uri=<uri>&state=<state>&code_challenge=<S256>`.
- **Le satellite** répond par sa page d'autorisation (une page de son front, servie par son serveur).
  Elle affiche le nom du client, l'hôte de `redirect_uri`, et ce que le contrat permet (§2.1).
- **Autoriser** : le front, avec son jeton d'appareil, demande au serveur un **code d'autorisation**
  (usage unique, valable **2 minutes** [choix Claude]) lié à `client`, `redirect_uri` et
  `code_challenge`, puis redirige vers `redirect_uri?code=<code>&state=<state>`.
- **Refuser** : redirection vers `redirect_uri?error=access_denied&state=<state>`.
- **Le client** vérifie `state`, puis échange le code par `POST /lun/v1/pair`
  `{ code, code_verifier, client }`. Le satellite vérifie que le `code_verifier` correspond au
  `code_challenge`, et répond comme aujourd'hui `{ token, satellite }`. Le jeton est enregistré comme
  une **application** (et non un appareil) au nom de `client`.
- **`redirect_uri` en boucle locale seulement** pour ce palier : `http://127.0.0.1:<port>/…` ou
  `http://localhost:<port>/…` [choix Claude]. Tout autre `redirect_uri` est refusé sur la page, avant
  toute action. Le core distant (Tailscale) viendra avec le panel.
- L'échange actuel `POST /lun/v1/pair { code }` avec un code à 6 chiffres reste valable (appareils,
  et repli sans navigateur pour le core) : `npm run connect -- <url> <code>` continue de marcher
  [choix Claude].

`contrat-satellite.md` est mis à jour dans ce chantier : la route, le flux, la règle de boucle locale,
et la distinction appareil / application. La phrase « le code est affiché par le satellite (son front
autonome) » devient : le code est donné par le satellite, par son front ou par sa commande
`pair-code`.

### 3.2 Lun'Acedia : relier

- **`npm run pair-code`** : affiche un code d'appairage à 6 chiffres (10 minutes, usage unique) depuis
  la machine qui héberge Acedia, que des clients existent ou non. C'est le déblocage qui manquait
  pendant la preuve.
- **Page d'autorisation** (§2.1, §3.1), dans le monde Acedia, avec l'étape « appareil inconnu ».
- **Appareils et applications** dans les Réglages (§2.2) : routes pour lister et retirer les clients
  (appareils et applications), avec la distinction stockée en base. Retirer le jeton en cours de
  l'appareil qui consulte est possible, avec une confirmation, et le renvoie à l'écran d'appairage.
- **Texte du front** : plus aucune mention d'Anima en dur (§1).
- **Verrou d'appairage**, comme le core : après **5 échecs en 10 minutes** sur `/lun/v1/pair` (code
  faux, code d'autorisation faux ou `code_verifier` faux, quel que soit le code), tous les codes en
  cours sont annulés et un avertissement est journalisé. Le code de premier lancement affiché dans
  les journaux est réémis une fois les codes annulés, s'il n'existe toujours aucun client.
- **Écoute sur `127.0.0.1` par défaut** (`HOST`), comme le core [choix Claude]. Le déploiement sur
  le NAS donnera explicitement son adresse.

### 3.3 Lun'Acedia : la clé Anthropic

- **Clé refusée** : une réponse « clé invalide, révoquée ou expirée » d'Anthropic (401, ou 403 de
  permission) est distinguée du crédit épuisé et des autres erreurs. Effets :
  - le tri par IA s'arrête, le tri par règles continue (comme pour le crédit épuisé) ;
  - `health` passe en `degraded` avec la raison « Clé Anthropic refusée » ;
  - un événement `key.invalid`, importance `normal`, est émis **une seule fois** par passage à cet
    état (pas une fois par mail).
  - Dès qu'une clé fonctionne à nouveau : retour à `ok` et événement `key.restored`, importance
    `info`.
- **Échéance connue** : `ANTHROPIC_KEY_EXPIRES=AAAA-MM-JJ`, facultatif, dans le `.env` ou saisi avec la
  clé (ci-dessous). Les API ne donnent pas la date d'expiration d'une clé, c'est donc une date
  déclarée. Événement `key.expiring`, importance `normal`, à **J-14** puis à **J-3**, une fois chacun.
  Après la date, rien de plus : c'est le premier refus réel qui fait foi.
- **Remplacer la clé sans redémarrer** : section **Clé Anthropic** dans les Réglages. Elle montre l'état
  (en service, refusée, crédit épuisé, absente), la date d'échéance déclarée, et les 4 derniers
  caractères de la clé en service, jamais la clé entière. Un champ pour coller une nouvelle clé, un
  champ facultatif pour sa date d'échéance, et **Vérifier et enregistrer** :
  - vérification par un appel gratuit (liste des modèles) [choix Claude] ;
  - si elle passe, la clé est chiffrée en base avec `ACEDIA_SECRET_KEY`, prend effet tout de suite et
    l'emporte sur le `.env` ;
  - si elle échoue, rien ne change et le message dit pourquoi.
  Le tri reprend avec la nouvelle clé sans redémarrage.

### 3.4 Lun'Anima : le core

- **`npm run connect -- <url>`** sans code lance le flux d'autorisation (§3.1) : un écouteur
  temporaire sur `127.0.0.1` (port libre), ouverture du navigateur sur la page d'autorisation, attente
  du retour pendant **5 minutes** au plus [choix Claude], échange du code, puis message
  « Satellite branché : … » comme aujourd'hui. Si le navigateur ne s'ouvre pas, l'adresse est
  affichée pour l'ouvrir à la main. Avec un code (`connect -- <url> <code>`), comportement actuel.
- **Clé OpenAI refusée** : l'état dégradé existe déjà (règle H du palier 1). Il s'y ajoute une
  **alerte** : événement `key.invalid`, une fois par passage à l'état, et `key.restored` au retour,
  visibles dans `GET /api/events` avec la source `core` [choix Claude : le core émet ses propres
  événements dans le même flux que ceux des satellites].
- **Échéance** : `OPENAI_KEY_EXPIRES=AAAA-MM-JJ`, mêmes règles qu'Acedia (J-14, J-3).
- **`npm run set-key`** : demande la nouvelle clé OpenAI sans l'afficher à la frappe, et
  facultativement sa date d'échéance. Elle la vérifie par un appel gratuit, la chiffre en base avec
  `ANIMA_SECRET_KEY` et le core en cours la prend en compte sans redémarrage. Une clé enregistrée
  l'emporte sur le `.env`. [choix Claude : commande en attendant le panel, qui aura l'écran.]
- **Page d'accueil** `GET /`, publique, dans le monde Anima : ce qu'est le core (« API de Lun'Anima,
  sans interface pour l'instant »), sa version, qu'il est en ligne, comment relier un satellite et
  lancer le chat. **Rien de privé** : ni satellites, ni fils, ni coûts, ni état des clés, puisqu'elle
  n'exige pas de jeton [choix Claude : la liste des satellites prévue en cadrage est retirée pour cette
  raison]. Elle remplace le 404.

### 3.5 Précisions de construction [choix Claude]

Issues de la relecture de la spec par un constructeur.

- **Reconnaître un appareil relié sur la page d'autorisation.** Pas de cookie ni de session : le
  jeton d'appareil reste là où le front le garde aujourd'hui. `GET /lun/v1/authorize` vérifie les
  paramètres (dont la boucle locale de `redirect_uri`), puis sert la route `autoriser` du front avec
  ces paramètres. Le front teste son jeton. La vraie garde est côté serveur : la route qui délivre le
  code d'autorisation exige un jeton d'appareil valide.
- **Contrefaçon.** N'importe qui peut fabriquer une URL avec `client=Lun'Anima`. Les protections :
  le retour vers la boucle locale seulement, l'hôte et le port de retour affichés sur la page, et
  PKCE. C'est jugé suffisant tant que tout reste en boucle locale. Plusieurs autorisations peuvent
  être en attente en même temps, chacune avec son code à usage unique valable 2 minutes.
- **Événements du core.** Ils entrent dans la même table que ceux des satellites, avec la source
  `core` à la place de l'id du satellite et une numérotation locale. `GET /api/events` les montre
  avec `satellite: "core"`, sans nouveau champ. Un `key.invalid` d'Acedia est relayé comme tout
  événement d'Acedia (déduplication actuelle).
- **Verrou d'appairage.** Il est global et compte seulement les échecs sur `POST /lun/v1/pair`, sur
  une fenêtre glissante de 10 minutes. Les refus volontaires (« Refuser ») ne comptent pas. Quand il
  se déclenche, il annule les codes d'appairage et les codes d'autorisation en cours, puis remet le
  compteur à zéro. Les codes demandés ensuite marchent normalement. Il ne bloque rien d'autre. Le
  code de premier lancement est réémis à chaque annulation tant qu'aucun client n'existe. Un tiers
  sur la même machine peut donc gêner l'appairage pendant 10 minutes : c'est accepté, puisque
  l'écoute est sur `127.0.0.1` par défaut.
- **`npm run pair-code`** tourne dans un autre processus que le serveur. Il lit le même `.env` et
  écrit dans la même base. Le verrou et ses compteurs vivent en base, pas en mémoire.
- **Retirer.** C'est une révocation douce (`revoked_at`), pas une suppression. Le core traduit déjà
  un 401 en « à réappairer » (palier 1). Retirer l'appareil qui consulte efface son jeton local et
  affiche l'écran d'appairage.
- **Clé Anthropic enregistrée.** Elle est stockée chiffrée dans une table de réglages. Sans
  `ACEDIA_SECRET_KEY` (déjà exigée pour les jetons Google), « Vérifier et enregistrer » refuse avec
  un message. Une clé en base l'emporte sur le `.env` jusqu'à son remplacement. L'état de la clé
  (en service, refusée, crédit épuisé) est conservé en base, pour qu'un redémarrage ne réémette pas
  `key.invalid`. Il est recalculé au premier appel réel.
- **Échéance.** Le calcul se fait en jours calendaires, heure de Paris, au démarrage puis toutes les
  heures. Il reste 14 jours ou moins : `key.expiring` (J-14), une fois. Il reste 3 jours ou moins :
  `key.expiring` (J-3), une fois. Si l'échéance est déclarée à moins de 3 jours, seul J-3 part. Les
  repères sont conservés en base et remis à zéro par une nouvelle clé ou une nouvelle date. Mêmes
  règles pour le core.
- **Accueil du core.** La version vient du `package.json`. « En ligne » est un texte fixe, puisque la
  page ne s'affiche que si le core répond. Rien n'y révèle la présence ou l'absence de satellites.

## 4. Hors périmètre

- Le panel Lun'Anima (l'écran « Satellites » de la maquette, l'écran des clés du core).
- Une liaison avec un core distant (`redirect_uri` hors boucle locale), avec Tailscale et le panel.
- Les événements pour les gestes faits par Acedia elle-même (action relayée ou front) : palier cerveau.
- L'agent IA propre au front autonome d'Acedia.
- La rotation automatique des clés, ou la lecture de leur échéance auprès des fournisseurs.

## 5. Contraintes

- Standards de lun-docs : `essentiel`, `git` (une branche et une PR par dépôt, brouillon dès le premier
  push), `qualite`, `securite`, `design`, `stack`. Node `^22.13.0 || >=24`, TypeScript strict.
- Lun'Acedia et lun-docs sont **publics** : aucun secret, aucune adresse réelle, aucune adresse
  interne, ni dans le code ni dans les captures.
- Une clé n'est jamais journalisée, renvoyée par une API ou affichée en entier ; seulement ses 4
  derniers caractères.
- Les gestes qui donnent ou retirent un accès disent clairement ce qu'ils font, avec un retour d'état
  explicite (`design.md` § Ergonomie).
- Tout se teste sans réseau : faux Anthropic, faux OpenAI, faux navigateur pour le flux d'autorisation
  (les tests appellent les routes, ils n'ouvrent rien).

## 6. Critères de fin

- [ ] `npm run connect -- http://localhost:8787` relie le core à Acedia par la page d'autorisation, sans
  code recopié, depuis un navigateur déjà relié ; « Refuser » ne relie rien et le core le dit.
- [ ] Depuis un navigateur inconnu d'Acedia, la page demande un code de `npm run pair-code`, relie le
  navigateur, puis reprend l'autorisation.
- [ ] Un `redirect_uri` hors boucle locale, un `state` ou un `code_verifier` faux, un code expiré ou
  déjà utilisé : refusés, rien n'est relié.
- [ ] 5 échecs en 10 minutes sur `/lun/v1/pair` annulent les codes en cours et journalisent un
  avertissement ; Acedia écoute sur `127.0.0.1` par défaut.
- [ ] Réglages, Appareils et applications : la liste montre le navigateur et Lun'Anima (application) ;
  « Retirer » sur Lun'Anima fait passer le satellite en « à réappairer » côté core. Aucune mention
  d'Anima en dur dans le front.
- [ ] Clé Anthropic refusée : tri par règles maintenu, `degraded` avec la raison, un seul `key.invalid`
  relayé par le core ; nouvelle clé collée dans les Réglages : vérifiée, en service sans redémarrage,
  `key.restored`. Une clé fausse collée est refusée sans rien changer.
- [ ] Échéance déclarée : `key.expiring` à J-14 et à J-3, une fois chacun (Acedia et core).
- [ ] Core : clé OpenAI refusée, `key.invalid` dans `/api/events` (source `core`) ; `npm run set-key`
  remplace la clé sans redémarrage.
- [ ] `GET /` sur le core affiche la page d'accueil, sans aucune donnée privée.
- [ ] Les trois écrans (autorisation, Appareils et applications avec la clé Anthropic, accueil du core)
  respectent la DA : tokens et polices seulement, monde du projet, voix neutre, contraste WCAG AA ;
  une capture de chacun dans sa PR.
- [ ] `contrat-satellite.md` décrit la liaison par autorisation ; tests, lint, typecheck et format
  verts dans les deux dépôts.

## 7. Laissé au constructeur

- La forme exacte des routes internes d'Acedia (liste et retrait des clients, code d'autorisation,
  clé Anthropic) et leur schéma de base, dans le respect du contrat.
- La mise en page fine des trois écrans, dans les limites de la DA et de la maquette validée.
- Le moyen d'ouvrir le navigateur depuis `npm run connect` sur Windows, macOS et Linux.
- La façon dont le core en cours apprend qu'une clé a été changée par `npm run set-key` (base relue,
  signal), tant que c'est sans redémarrage.
- Les polices auto-hébergées de la page d'accueil du core (reprendre les fichiers d'Acedia est
  attendu), sans aucun CDN.
