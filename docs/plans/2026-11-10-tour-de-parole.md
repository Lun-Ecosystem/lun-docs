# Le tour de parole : ce que la recette du desktop a cassé. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** à la voix, une conversation qui tient. Une phrase de CrOliX reprend la main sur une réponse que personne n'a
encore entendue, le garde-fou des cartes ne répond plus à la place de Natsume, et un silence qu'elle a choisi se
distingue d'une parole perdue.

**Source :** la recette du desktop du 10/11 (feuille de route, § 4, étapes 1 à 4), par ses issues : lun-luxuria#48,
lun-anima#97, lun-anima#98. L'[étude d'OpenAmika](../specs/2026-11-10-etude-openamika.md) pour deux des trois
solutions. Le code relu le 10/11 sur `main` (core 9089124, Luxuria 0f61b32). Plan relu par le plan-challenger le
10/11 : « à amender », ses dix objections sont reprises ici (voir la fin).

**Critères de fin :**

- Luxuria : quand CrOliX reparle pendant que Natsume réfléchit, et que sa phrase est bien pour elle, la réponse en
  route n'est jamais dite, le serveur le sait, et une seule réponse sort. Une toux ou une phrase écartée par le filtre
  ne lui fait rien perdre.
- Luxuria : sa voix tenue coupe aussi entre deux phrases d'une réponse longue.
- Core : la réponse suivante a lu ses deux phrases ; un geste tenu par une réponse que personne n'a entendue est
  annulé.
- Core : une phrase sans mot de geste ne peut plus recevoir la phrase du garde-fou ; la phrase du refus dit ce qui
  passe.
- Core : un silence choisi par Natsume laisse une trace distincte d'un échec.

**À valider par CrOliX.** Aucun appel payant. *Show* : tout se prouve par des tests sur le laptop ; l'oreille, elle, ne
se prouve que sur le desktop, à la prochaine recette.

| Dépôt, branche | Issue | Niveau proposé |
|---|---|---|
| `lun-luxuria`, `fix/tour-de-parole` | lun-luxuria#48 | `standard` |
| `lun-anima`, `fix/garde-fou-cartes` | lun-anima#97, lun-anima#98 | `critique` (touche à ce qui autorise un geste) |
| `lun-docs`, `docs/plan-tour-de-parole` | les mêmes | `trivial` |

## L'audit : ce que le code fait aujourd'hui

### Luxuria, la coupure (lun-luxuria#48)

- **Sa voix tenue ne coupe que ce qui sonne déjà.** `src/conversation.ts:119` : l'événement `held` (400 ms de voix)
  coupe seulement si `speaker.speaking`. Pendant les trois secondes où Natsume réfléchit, rien ne se passe : la
  première réponse arrive quand même, la seconde la suit. C'est le chevauchement du 10/11 : deux phrases à trois
  secondes d'écart, deux réponses.
- **`held` ne sonne qu'une fois par phrase** (`src/listen/endpoint.ts:102`), et il vient du niveau du micro, avant le
  filtre (`endpoint.ts:128-134`) : une toux tenue le déclenche aussi.
- **`speaking` est faux entre deux phrases** (`src/speech/speaker.ts:71`) : pendant qu'une phrase se fabrique
  (`#waiting`), rien ne joue. Une voix tenue qui tombe dans ce trou ne coupe pas. Avec RVC, ce trou dure. C'est une
  cause possible de « la coupure ne prend pas sur une réponse longue » ; elle n'est pas prouvée.
- **Luxuria ne sait pas dire « une réponse attend son premier son »** : `#waitingReply` n'est jamais remis à zéro
  (`conversation.ts:95-101`, `:205`), et il est vide tant que la transcription et l'envoi courent.
- **Le serveur sait déjà oublier une réponse non entendue** : `cut(id, '')` la range sans texte, et elle ne retourne
  jamais au modèle ; la réponse suivante relit les deux messages de CrOliX (`core/src/chat/service.ts:172`, `:400`,
  `store.ts:279`). Mais **un geste que cette réponse tenait reste tenu** (`service.ts:397-398`) : « Tu as 5 secondes
  pour dire annule » ne serait jamais entendu. Et une délégation déjà partie n'est pas arrêtée.

### Core, le garde-fou des cartes (lun-anima#97)

- **Dès que le modèle appelle `trancher_carte`, une phrase fixe remplace toute sa réponse** (`service.ts:655`,
  `:901`). Si le message de CrOliX n'était pas un geste, cette phrase est « Je n'ai rien tranché. Dis-moi clairement
  laquelle. » (`natsume/authorize.ts:43`).
- **Le modèle appelle l'outil à tort**, et rien ne l'en empêche : l'outil lui est offert à chaque tour du fil
  principal (`service.ts:566`), même sur « Que penses-tu des Français en général ? ». La phrase fixe retourne ensuite
  dans l'historique comme sa propre parole, ce qui entretient la boucle.
- **La phrase ne dit pas ce qui passe.** Elle demande « laquelle » avec une seule carte. Et la carte dont on parle est
  oubliée à chaque message (`service.ts:301`, `:893`) : après un refus, un « oui » nu est refusé à son tour
  (`authorize.ts:133`).
- **« Ok, parfait pour moi. » est refusé** parce que « parfait pour moi » n'est ni un mot de remplissage ni le titre
  de la carte (`authorize.ts:127-142`). C'est voulu : le garde-fou n'accepte qu'un geste nu. Ce plan n'y touche pas.
- **L'heure : cause non établie.** Elle est dans le prompt à chaque tour (`chat/prompt.ts:106`), second appel compris
  (`service.ts:644`). La première demande avait été transcrite « tu peux me dire que j'ai le relay ».
- **Sans cause trouvée non plus** : la phrase « vas-y, la carte c17425 tu peux l'accepter » écrite par Natsume, et la
  carte qui revient dans des réponses qui ne la demandent pas. Le garde-fou a tenu dans les deux cas.

### Core, la parole spontanée (lun-anima#98)

- **Le message vide est le silence permis, ou un échec : rien ne dit lequel.** Quand le modèle répond « RIEN », le
  tour est rangé `partial`, sans texte (`service.ts:729`). Un échec du fournisseur sur ce même tour est rangé pareil
  (`service.ts:707-711`).
- L'interrupteur de Luxuria dit déjà « À activer aussi sur le serveur relié » (`src/Reglages.svelte:572`). Non repris.

## Ce que l'étude d'OpenAmika apporte

- **Toute nouvelle parole annule le tour en route**, réflexion comprise ; le flux annulé est soldé après coup
  (étude, § 3). Chez nous la moitié existe : le core sait oublier, Luxuria ne demande pas. Tâches 1 à 4.
- **Se taire est une issue du tour, pas un message** : leur modèle rend un état à côté du texte (étude, § 8).
  Tâche 7, en plus petit : on garde le tour vide, on écrit pourquoi.
- **Rien pour les cartes** : ils n'en ont pas. Les tâches 5 et 6 viennent de notre code seul.

## Tâches

### Luxuria

1. - [ ] **Reparler reprend la main sur une réponse non entendue, si la phrase est pour elle.**
   - `Conversation` sait qu'une réponse confirmée attend son premier son : remis à zéro au premier son, au sous-titre
     muet et à l'erreur ; si la réponse n'a pas encore d'identifiant, l'intention est gardée et appliquée à son
     arrivée (comme `conversation.ts:204`).
   - À `held`, si rien ne sonne et qu'une telle réponse attend : elle est **retenue** (`speaker.hold`), pas jetée.
   - Si la nouvelle phrase passe le filtre : `speaker.drop(id)` et `brain.cut(id, '')`. Si c'est du bruit ou une
     phrase écartée : `speaker.release(id)`, la réponse sort.
   - `Speaker` respecte une retenue posée pendant qu'une phrase se fabrique (`speaker.ts:145-148`).
   - Sous l'interrupteur de la coupure (`bargeIn.on`). La réflexion affichée et le chronomètre suivent.
   - Tests (`conversation.test.ts`, `speaker.test.ts`) : phrase pour elle ; toux ; phrase écartée ; réponse sans
     identifiant encore ; une réponse déjà entendue n'est jamais coupée après coup ; interrupteur coupé.
2. - [ ] **Sa voix coupe aussi entre deux phrases.** `Speaker.speaking` reste vrai tant qu'un tour qui a déjà sonné
   n'est pas fini (seul `conversation.ts:119` le lit). Test dans `speaker.test.ts`. Une parole qui n'est pas une
   réponse (accueil, urgence, spontanée) n'est pas touchée par ce chantier.

### Core

3. - [ ] **Une réponse que personne n'a entendue ne garde aucun geste.** `cut(id, '')` annule les gestes que ce tour
   tenait, comme `withdraw` le fait déjà (`service.ts:429`). Une coupure avec des mots entendus ne change pas. Test.
4. - [ ] **Deux phrases, une réponse : le test d'abord.** Dans `service.test.ts` : message A, message B, coupure vide
   de A ; on vérifie que l'appel de B porte A et B, et on compte les délégations quand A en demandait une. Si A et B
   délèguent deux fois la même chose, la correction se décide là, avec CrOliX si elle dépasse quelques lignes.
5. - [ ] **L'outil `trancher_carte` n'est offert que si son message peut être un geste.**
   - Dans `#generate`, l'outil et sa règle ne partent que si le message contient un mot de geste (`ACCEPT`, `REFUSE`,
     `SEND` de `authorize.ts`) ou l'un des choix d'une carte en attente.
   - « Tranche-la sans jamais demander de confirmation » (`prompt.ts:39`) passe dans le paragraphe de l'outil. Sans
     l'outil, une phrase dit : tu n'as rien tranché, ne dis jamais qu'une carte est acceptée ou refusée.
   - Le garde-fou lui-même (`speaksGesture`) ne change pas : on réduit quand l'outil existe, jamais ce qu'il accepte.
   - Tests : les six phrases de l'issue (trois sans mot de geste n'ont plus l'outil) ; un « oui » nu, « refuse-la »,
     « envoie » et un choix listé l'ont toujours.
6. - [ ] **La phrase du refus dit ce qui passe.** « Je n'ai rien tranché. Dis accepte ou refuse avec le nom de la
   carte, ou tranche-la à l'écran. », quel que soit le nombre de cartes. Les phrases propres aux cartes qui envoient
   et aux cartes à choix (`SEND_HINT`, `QUESTION`) restent. Test.
7. - [ ] **Le silence choisi laisse une trace.** Quand elle répond « RIEN », une ligne au journal de service du core
   (« parole spontanée : silence choisi »), écrite dans `#composed` ; un échec écrit la sienne. Pas de ligne au
   Journal de l'app : elle la relirait comme une donnée de sa journée (`reread.ts:93-107`). Test.

### Ici

8. - [ ] Cocher ce plan, lier les PR, et écrire dans la feuille de route ce que le desktop doit réentendre : deux
   phrases à trois secondes d'écart, une toux pendant qu'elle réfléchit, une coupure sur une réponse longue, une
   carte seule à la voix, et la requête de l'heure ci-dessous.

## Hors périmètre

- **L'heure** : sans cause, pas de correctif. À la prochaine recette, lire dans la base de service combien d'appels a
  coûté la réponse « Je n'ai pas retrouvé l'heure exacte » : deux lignes de coût disent que `relire` a été appelé.
- La latence (3,4 s de médiane) et les mots mal entendus : transcrire pendant qu'on parle est la piste de l'étude,
  elle demande un moteur à choisir. Un chantier à part.
- La confiance de la transcription et le verrou de l'ADR 0011 (lun-luxuria#6) : à CrOliX.
- Discord non vu (lun-luxuria#50), le petit mode sur le mauvais écran, l'accueil toujours identique, la « carte dans
  une carte » (lun-docs#143).
- Élargir ce que le garde-fou accepte (« ok, parfait pour moi »), ou garder la carte « dont on parle » après un
  refus : des décisions de sécurité, pas des correctifs.
- Les deux observations sans cause de lun-anima#97 : elles restent dans l'issue.

## Limites

- Les causes viennent d'une lecture du code ; aucune n'est reproduite avant la tâche qui la corrige.
- « La coupure ne prend pas sur une réponse longue » n'a ici qu'une cause possible (tâche 2). Si le desktop l'entend
  encore après, la cause est ailleurs (l'écho, le seuil du micro) et l'issue reste ouverte.
- La tâche 5 ne ferme pas la boucle à elle seule : « Ok, parfait pour moi » ou « Oui, justement… » portent un mot de
  geste et recevront encore la phrase du refus, mais celle de la tâche 6, qui dit quoi dire.
- Offrir l'outil selon le message fait varier le début du prompt d'un tour à l'autre. Sans effet aujourd'hui : rien
  n'est relu du cache ([le relevé du 10/11](2026-11-10-premier-mot.md)).
- Non relu : `src/local.ts` (le mode seul de Luxuria), et l'annulation d'écho du micro sur sa propre voix.

## Ce que le plan-challenger a changé

Verdict « à amender », dix objections, toutes reprises : l'état « une réponse attend » qui n'existait pas (tâche 1) ;
la toux et la phrase écartée qui auraient tué la réponse (retenir, puis jeter ou relâcher) ; le geste tenu jamais
entendu (tâche 3, ajoutée) ; la double délégation possible (tâche 4, ajoutée) ; la coupure des paroles qui ne sont pas
des réponses, dont une urgence (retirée de la tâche 2) ; la règle « sans confirmation » qui restait sans l'outil et
les choix qui le rouvraient à chaque tour (tâche 5) ; la phrase du refus qui recréait une boucle (tâche 6) ; le test de
série qui doublait la tâche 5 (fondu) ; l'heure, dont la cause n'était pas établie et que les scènes ne savent pas
rejouer avec les outils (sortie du chantier, avec une lecture à faire sur le desktop) ; le Journal, qu'elle relit
(remplacé par le journal de service).
