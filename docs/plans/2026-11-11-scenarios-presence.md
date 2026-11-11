# Les scénarios écrits et le niveau exact : jouer, juger, ranger les échecs. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **À valider par CrOliX.** Les choix marqués **[avis]** sont des propositions. Rien n'est codé.

**But :** qu'un point de la liste d'écoute devienne un fichier qu'une machine joue et juge. Le fichier dit ce que la
personne dit et quand, ce qu'il y a autour, ce que le serveur et sa voix font, et ce qui est attendu, en événements
et en délais du déroulé, avec leurs bornes. Un joueur le rejoue contre les vrais mécanismes de la page, avec des
briques fausses réglées à la milliseconde, dans la CI et en quelques secondes. Un juge à règles lit le déroulé et rend,
pour chaque attente : tenue ou ratée, son espèce, et le mécanisme en cause.

**Source :** le cadrage [« Prouver la présence sans l'oreille »](../specs/2026-11-11-banc-presence-cadrage.md),
validé par CrOliX le 11/11 (lun-docs#161), § 4 pièces 2 et 3 (niveau « exact ») et § 5 étape 2. La liste d'écoute
de la [feuille de route](2026-11-07-feuille-de-route-mvp.md), § 4, étape 4. Le déroulé, fusionné le 11/11
([plan](2026-11-11-deroule-tour.md), lun-luxuria#61). Ce que CrOliX a redit le 11/11 : son oreille n'ajoute rien sur
cet axe ; il veut chaque écart, sa source, et si le mécanisme a joué ; il doute des tests de bout en bout actuels.
Code relu sur `main` de Lun'Luxuria (`3f69d3c`) et de Lun'Anima (`84618a3`). Références relues, rien lancé : Pipecat
(`evals/`, `src/pipecat/evals/`), LiveKit Agents (`tests/fake_*.py`), AIRI (`packages/testing-audio`).

**Critères de fin :**

- Un scénario est un fichier du dépôt, typé : ce qui est dit et quand, les bruits, son écho, le serveur, sa voix, les
  réglages, les attentes. Un scénario mal écrit est refusé au chargement, avec la raison.
- Le joueur fait passer le scénario par le vrai `Endpointer`, la vraie `Conversation` et le vrai `Speaker`, branchés
  comme dans la session. Seuls sont faux : la probabilité de voix de chaque trame, la transcription, le serveur, la
  synthèse et la sortie du son.
- Le temps est virtuel et exact : deux parties du même scénario rendent le même déroulé, ligne pour ligne.
- Le juge ne lit que le déroulé de la page et le journal du joueur. Il ne connaît aucun modèle. Pour chaque attente :
  `tenue`, `ratee` ou `non_jouee`, l'espèce de l'échec, le mécanisme, la valeur trouvée.
- Le relevé range les échecs par espèce et par mécanisme, et dit, scénario par scénario, quels mécanismes ont écrit
  au moins un événement.
- Chaque point de la liste d'écoute est un scénario, ou le plan dit pourquoi il ne se convertit pas à ce niveau.
- `npm test` joue toute la suite en moins de cinq secondes sur la CI. Un défaut déjà connu est marqué comme tel, avec
  son issue : il apparaît au relevé sans casser la CI, et le jour où il tient, la CI le signale.

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-luxuria`, `feat/scenarios-presence` | à ouvrir à la validation | `standard` |
| `lun-docs`, `docs/deroule-tour` | la même | `trivial` |

Lun'Anima n'est pas touché : ses scénarios viendront avec son propre joueur (voir « Hors périmètre »).

## Ce que le code fait aujourd'hui

- **Le déroulé** (`src/trace.ts`) : une liste d'événements datés sur une seule horloge, rangés par phrase, essai et
  réponse ; 25 noms arrêtés, version 1 du format (`trace.ts:2-33`). `delays()` (`trace.ts:156`) en tire neuf délais
  nommés ; un délai dont une borne manque est absent. `lines()` l'écrit, une ligne par événement.
- **L'écoute** (`src/listen/endpoint.ts`) : l'`Endpointer` reçoit une trame et sa probabilité de voix
  (`endpoint.ts:84`), et rend `start`, `held`, `pause`, `resume`, `end`, `noise`. Il ne lit pas le son lui-même : la
  probabilité vient de Silero ou du niveau, à part. Seuils par défaut : ouvre à 0,6, ferme à 0,45, pause 160 ms,
  fin 700 ms, voix tenue 400 ms, parole minimale 250 ms, trames de 32 ms (`endpoint.ts:18-28`).
- **La session** branche les pièces sans rien décider : trame → probabilité → `Endpointer.push` →
  `Conversation.onEndpoint` (`session.svelte.ts:478-533`) ; `brain.live` → `onLive` (`:369`) ; `Speaker` →
  `onSpeaker` (`:374`). Les seuils de l'écoute viennent des réglages (`#params`, `:187-196`).
- **Les tests de la conversation** (`src/conversation.test.ts`, 718 lignes ; `src/turns.test.ts`) appellent
  `onEndpoint` à la main, avec une horloge qu'ils avancent eux-mêmes, et attendent des `setTimeout` vides (`tick`).
  Ils prouvent chaque mécanisme isolé ; aucun ne fait passer une parole datée par l'`Endpointer`. Le même montage
  (faux serveur, fausse sortie, `Speaker`) est recopié trois fois : `conversation.test.ts:21-72`,
  `turns.test.ts:17-78`, `banc.test.ts:124-144` et `:283-302`.
- **Le banc** (`src/listen/banc.test.ts`, `npm run banc`) rejoue de vrais fichiers par `replay()`
  (`src/listen/replay.ts:87`), sur le temps du son, hors CI : les sons vivent dans `banc-sons`, hors dépôt.
- **Ce que le déroulé ne dit pas encore**, et qu'un juge doit pouvoir lire :
  - la retenue d'une réponse quand il reparle, sa sortie, son oubli (`#holdBack`, `#letGo`, `#supersede`,
    `conversation.ts:256-299`) n'écrivent rien ; on ne les voit qu'en creux, par un son qui ne vient pas ;
  - le verdict du filtre dit `pour_elle`, pas pourquoi : réglage coupé, touche, nom, ou fenêtre de 15 s
    (`filter.ts`, `decide` ; `conversation.ts:361`) ;
  - `son` ne dit pas quelle phrase de la réponse sonne (`speaker.ts:197`) : « elle redit sa phrase » ne se lit pas.
- **Le serveur** (Lun'Anima) joint ses durées à la réponse finie (`core/src/chat/service.ts:559-562`) ; la page les
  écrit sous `durees` (`conversation.ts:417`). Au niveau exact, le faux serveur les donne lui-même.
- **Au passage** : `turns.test.ts:245` fait dire `'ArrÃªte'` (UTF-8 encodé deux fois). Le test passe, le filtre
  étant coupé en scène, mais il ne dit pas ce qu'il croit dire.

## Ce que les références apportent

- **Pipecat** : un scénario est une suite de tours ; chaque attente nomme un événement, un délai maximal compté
  depuis l'envoi de la personne (`within_ms`), et peut être inversée (`absent: true`, rien de tel dans la fenêtre).
  Les échecs ont une espèce stable (`FAILURE_KINDS`, `results.py:22-41` : `timeout`, `unexpected_event`,
  `text_mismatch`…) pour compter « dix fois hors délai au tour 3 » sans lire de texte libre. Un tour qui n'a pas
  été joué est `not_run`, jamais compté comme tenu. Les fichiers sont commentés : chaque délai dit pourquoi il vaut ça.
- **LiveKit** : une parole fausse a son début, sa fin, sa transcription et le délai de celle-ci
  (`FakeUserSpeech`, `fake_stt.py:29-35`) ; le faux modèle répond selon le texte reçu, avec son premier jeton et sa
  durée (`FakeLLMResponse`, `fake_llm.py:28-41`). Le temps est réel, accéléré : nous prenons le temps virtuel, plus
  exact.
- **AIRI** : chaque cas choisit ses briques, sans configuration « chaîne complète » cachée ; un échec porte la
  chronologie mesurée dans son message.

## Le format **[avis]**

Un scénario est un module TypeScript, `src/presence/scenarios/<nom>.ts`, qui exporte un objet `satisfies Scenario`.
Les types font le schéma, les commentaires disent pourquoi une borne vaut ce qu'elle vaut, et rien n'est à parser. Le
JSON obligerait à écrire un validateur et interdirait les commentaires ; il ne vaudrait que pour un lecteur hors
TypeScript, et il n'y en a pas.

Le format vit dans Lun'Luxuria seule, à côté du déroulé qu'il lit. Il ne passera en spec de lun-docs que le jour où
Lun'Anima aura son propre joueur. Le dépôt est public : aucun texte de scénario ne porte le nom de l'instance ; le
nom vient de `DEFAULTS.agent.name`.

Les temps sont en millisecondes depuis le début de la partie.

```ts
interface Scenario {
  nom: string;
  /** Le point de la liste d'écoute qu'il remplace, mot pour mot. */
  source: string;
  mecanismes: Mecanisme[];
  disposition?: Layout;                 // 'scene' par défaut
  reglages?: DeepPartial<Settings>;     // sur DEFAULTS
  personne: Parole[];                   // ce qu'elle entend de la personne
  bruits?: { a: number; duree: number; voix: number }[];  // un son sans paroles : la transcription rend ''
  /** Son propre son repris par le micro, à cette probabilité de voix, tant qu'il sonne. */
  echo?: { voix: number };
  serveur?: {
    reponses?: Reponse[];               // une par phrase envoyée, la première qui convient
    parle?: { a: number; pourquoi: SpeechWhy; phrases: Phrase[] }[];  // rituel, urgence, parole spontanée
  };
  voix?: { syntheseMs?: number; msParCaractere?: number; echoue?: string[] };
  /** Fin de la partie ; par défaut cinq secondes après le dernier événement prévu. */
  jusqua?: number;
  attendus: Attendu[];
  /** Attentes qui échouent aujourd'hui, et pourquoi : au relevé, pas dans la CI. */
  connus?: { issue: string; attendus: string[] }[];
}

interface Parole {
  a: number; dit: string; duree: number;
  voix?: number;                        // probabilité de voix pendant la parole, 0,9 par défaut
  trous?: { a: number; duree: number }[];  // des silences à l'intérieur, relatifs à `a`
  entendu?: string;                     // ce que la transcription rend, `dit` par défaut
  confiance?: number;                   // 0,9 par défaut
  transcriptionMs?: number;             // 150 par défaut
  echec?: true;                         // la transcription échoue
}

interface Phrase { apresMs: number; texte: string }   // compté depuis l'envoi, ou depuis `a` pour `parle`

interface Reponse {
  si?: string;                          // contenu dans le texte reçu, sans accents ni casse
  numeroMs?: number;                    // 20 par défaut
  phrases: Phrase[];
  finMs?: number;                       // après la dernière phrase, 0 par défaut
  durees?: ReplyDurations;
  erreur?: string;
}

type Attendu = { id: string; mecanisme: Mecanisme; dit: string } & (
  | { evenement: TraceName | MondeNom; ou?: Filtre; depuis?: Ancre;
      entre?: [number, number]; absent?: true; compte?: [number, number] }
  | { delai: DelayName; parole?: number; reponse?: number; entre: [number, number] }
  | { mesure: 'chevauchement'; entre: [number, number] }
);

/** `parole: 2` : la phrase du déroulé ouverte par la deuxième parole ; `reponse: 1` : la réponse à la première
 *  phrase envoyée ; `parle: 1` : la première parole du serveur. Les autres champs filtrent les valeurs. */
type Filtre = { parole?: number; reponse?: number; parle?: number; essai?: number } & Record<string, TraceValue>;

/** Le début de la partie par défaut ; un autre attendu (`'#id'`), ou un bord de parole (`'parole:2:fin'`). */
type Ancre = string;
```

**Les mécanismes**, chacun avec les événements qui disent qu'il a joué :

| Mécanisme | Pièce du code | Ses événements |
|---|---|---|
| `ecoute` | `Endpointer` | `voix`, `tenue`, `pause`, `reprise`, `fin`, `bruit` |
| `essai` | la phrase envoyée avant sa fin | `essai`, `retiree`, `confirmee` |
| `transcription` | la transcription | `transcrite` |
| `filtre` | `decide` | `verdict` (et sa raison, tâche 1) |
| `retenue` | `#holdBack`, `#letGo`, `#supersede` | `retenue`, `relachee`, `oubliee` (tâche 1) |
| `suspension` | `Speaker.suspend`, `resume` | `suspendue`, `reprise_voix`, `son` arrêté |
| `coupure` | `cutSuspended`, `stop`, `brain.cut` | `coupee`, `arretee`, `coupure_recue` |
| `voix` | `Speaker` | `synthese`, `son`, `premier_son`, `silence` |
| `serveur` | le faux serveur | `envoyee`, `numero`, `phrase_recue`, `fin_recue`, `durees`, `retrait_recu` |

**Le journal du joueur** est écrit sur la même horloge que le déroulé, et fondu avec lui dans le même fichier, chaque
ligne marquée `de: 'banc'` : ce que le monde a fait, que la page ne sait pas. `parole` (début, fin, son numéro de
scénario), `bruit_joue`, `echo` (début, fin), `envoi_recu` (le texte reçu par le faux serveur), `coupure_recue` (la
réponse, les mots entendus), `retrait_recu`, `joue` (le texte de la phrase que la sortie commence ; `arrete` quand
elle s'arrête). Rien n'est recollé par l'heure : une seule horloge, un seul fichier (la mise en garde d'EVA,
cadrage § 3).

**Le juge** cherche, pour chaque attente, le premier événement qui convient après son ancre :

- `evenement` seul : tenu si trouvé dans `entre` (par défaut, n'importe quand après l'ancre) ;
- `absent: true` : tenu si rien ne convient dans la fenêtre ;
- `compte` : le nombre d'événements qui conviennent, dans la fenêtre ;
- `delai` : lu dans `delays()` pour le tour désigné ;
- `mesure: 'chevauchement'` : le temps où une parole de la personne et un `joue` de sa voix se recouvrent, lu dans
  le journal du joueur.

**Les espèces d'échec** : `absent` (rien ne convient), `hors_bornes` (trouvé, hors de `entre` : la valeur est
rendue), `en_trop` (un `absent` a trouvé), `compte`, `delai_manquant` (une borne du délai manque), `non_jouee` (son
ancre n'est pas venue : jamais comptée tenue ni ratée), `scenario` (refusé au chargement), `joueur` (une exception
pendant la partie). Une attente ratée porte son mécanisme, la valeur trouvée, et les événements de la seconde qui
entoure sa fenêtre.

## Les scénarios de départ

Les points de la liste d'écoute (feuille de route, § 4, étape 4), dans leur ordre. Les bornes ci-dessous sont celles
que le code donne avec les briques fausses par défaut (transcription 150 ms, numéro 20 ms, synthèse 150 ms,
60 ms par caractère) ; le développeur les calcule exactement à la trame près et écrit le calcul en commentaire.

Pour chacun : le point de la liste, le scénario, ce qu'il attend, et ce qui reste hors de ce niveau.

1. **Deux phrases à trois secondes d'écart pendant qu'elle réfléchit.** `deux-phrases` : le serveur met 4 s à
   répondre à la première. Attend : `retenue` de la réponse 1 à la tenue de la parole 2 ; `oubliee` et
   `coupure_recue` de la réponse 1, mots vides ; aucun `joue` de la réponse 1 ; un seul `premier_son`, celui de la
   réponse 2. Hors niveau : « qui a lu les deux », le contexte du serveur.
2. **Une toux, ou une phrase pas pour elle, pendant qu'elle réfléchit.** `toux-reflexion` (450 ms, `entendu: ''`)
   et `aparte-reflexion` (disposition `small`, sans son nom, avant toute parole d'elle). Attend : verdict `bruit`,
   puis `ecartee` ; `relachee` ; la réponse 1 sonne ; aucune `coupure_recue` ; pas de `blanc_de_tour` au tour de
   l'aparté.
3. **La couper au milieu d'une réponse longue, entre deux phrases.** `couper-entre-deux` : trois phrases, la
   deuxième synthétisée lentement. Attend : `suspendue` dans le blanc ; `coupee` avec la phrase 1 entière ; aucun
   `joue` de la phrase 2.
4. **Une carte seule en attente, à la voix.** Non converti : la page n'a aucune logique de carte, le serveur tranche.
5. **« Oui » sur une carte, puis reparler avant « tu as 5 secondes ».** `oui-puis-reparler` : la phrase du serveur
   est arrivée, sa synthèse n'est pas finie. Attend : `retenue`, puis `oubliee` et `coupure_recue` de la réponse au
   « oui », mots vides ; aucun `joue` d'elle. Hors niveau : « rien n'est tranché », ce que le serveur fait de la
   coupure.
6. **L'heure, `relire` appelé.** Non converti : la base et les outils du serveur.
7. **Le délai de réponse avec 0,7 s de silence de fin.** `delai-de-reponse`, l'essai coupé puis en service.
   Attend : `attente_fin` dans [700, 736] ; `blanc_de_tour` égal à la somme des briques fausses à une trame près, et
   plus court avec l'essai. Hors niveau : les vingt tours et les vrais délais, au desktop (étape 5).
8. **Une toux pendant qu'elle parle : elle se tait, redit sa phrase, continue.** `toux-parole` (450 ms) et
   `toux-courte` (300 ms). Attend, à 450 ms : `suspendue` à 400 ms du début de la toux, à une trame près ;
   `reprise_voix` ; le `joue` suivant porte le texte de la phrase coupée ; le blanc entre `arrete` et ce `joue` est
   borné. À 300 ms : aucune `tenue`, aucune `suspendue`.
9. **« Arrête » ou « non » pendant une longue réponse.** `arrete` (600 ms) et `non` (300 ms). Attend : `coupee`,
   `coupure_recue` avec les mots entendus, `silence` coupé, plus aucun `joue` de cette réponse ; « non » coupe sans
   `tenue`.
10. **Une phrase dite à quelqu'un d'autre, au-delà de quinze secondes de réponse : elle reprend.**
    `aparte-parole-longue` : une réponse de 25 s, un aparté à 20 s, sans son nom, disposition `small`. Voir « À
    trancher » : aujourd'hui elle est coupée, verdict `pour_elle` par la fenêtre. Hors niveau : le sens de la phrase.
11. **Son propre son repris par le micro.** `echo-sous-seuil` (voix 0,3) et `echo-fort` (voix 0,7). Attend : sous
    le seuil, aucune `voix` ; fort, aucune `voix` ni `envoi_recu` pendant qu'elle parle, marqué connu. Hors niveau :
    l'annulation d'écho du navigateur, qui seule décide si l'écho passe (étapes 3 à 5).
12. **Recommencer à parler juste après une toux.** `toux-puis-parole` : une parole 200 ms après la fin de la toux.
    Attend : le `chevauchement` mesuré et rendu, borné à 400 ms plus une trame (ce que le code garantit) ; zéro,
    marqué connu.
13. **« J'ai des mails ? » : ce qu'elle fait, puis le résultat.** `phrase-attente` : deux phrases du serveur, la
    seconde 2,5 s après, `durees.postMs` donné. Attend : les deux `joue` dans l'ordre ; le délai `poste` lu ; le
    blanc entre les deux `joue` égal à l'arrivée plus la synthèse, moins le son de la phrase 1. Hors niveau : « sans
    redire la phrase », le serveur.
14. **Le blanc entre la phrase et le résultat, sur cinq demandes.** Dans le 13. Hors niveau : les vrais délais du
    poste, au desktop.
15. **La couper pendant ce blanc, sur une demande qui prépare une carte.** `couper-le-blanc`. Attend : `suspendue`
    puis `coupee` dans le blanc, avec les mots de la phrase d'attente ; `coupure_recue`. Hors niveau : « la carte
    reste, pas redemandée », le serveur.
16. **La couper tout de suite, puis en fin de phrase, et ce qu'elle dit avoir entendu** (étape 4, L).
    `couper-net` et `couper-doux` (`bargeIn.mode: 'soft'`). Attend : net, `son` arrêté à la `tenue` et `coupee` avec
    les mots au prorata ; doux, la phrase finit et `coupee` porte la phrase entière.

Points non convertis : 4 et 6 en entier, et la moitié serveur de 1, 5, 13 et 15. Ce sont des comportements de
Lun'Anima ; la page n'en voit qu'une phrase envoyée comme une autre. Les vrais délais (7, 14) attendent la chaîne.

## À trancher par CrOliX

- **Le point 10 contredit le code.** Depuis « la coupure qui se reprend », la fenêtre de 15 s est rafraîchie à
  chaque phrase qu'elle dit : une phrase dite à quelqu'un d'autre pendant qu'elle parle passe toujours le filtre, et
  la coupe pour de bon. C'est écrit dans les limites de ce plan-là. Le scénario peut attendre ce que veut la liste
  (« elle reprend »), marqué connu ; ou ce que fait le code, et le point sort de la liste. Je propose le premier : le
  relevé garde l'écart en vue.

## Tâches

Les tâches 2, 3 et 4 partent en parallèle une fois la tâche 1 faite : elles ne partagent que les types de la tâche 1.
La tâche 5 peut s'écrire en même temps qu'elles, et se jouer après.

1. - [ ] **Ce que le déroulé ne dit pas encore** (Lun'Luxuria, `dev-luxuria`). Seul, d'abord : les autres le lisent.
   - Dans `src/conversation.ts` : `retenue` dans `#holdBack` (la réponse retenue, la phrase qui la retient),
     `relachee` dans `#letGo` quand une réponse sort, `oubliee` dans `#supersede` quand une réponse est oubliée.
   - Dans `src/listen/filter.ts` : `decide` rend aussi la règle qui a laissé passer (`off`, `touche`, `nom`,
     `fenetre`) ; le `verdict` l'écrit sous `par`. Les appels existants ne changent pas de sens.
   - Dans `src/speech/speaker.ts` : `son` début porte `rang`, la phrase de la réponse qui sonne.
   - Les noms s'ajoutent à `TraceName` ; aucun nom n'en sort et aucun ne change de sens : le format reste à 1
     **[avis]**, le commentaire de `TRACE_FORMAT` le dit.
   - `src/presence/scenario.ts` : les types du format ci-dessus, et `charger(s)` qui refuse un scénario mal écrit
     (une ancre vers un attendu inconnu, des bornes inversées, deux attendus du même id, un `connus` qui nomme un id
     absent, une parole qui en chevauche une autre).
   - Corriger `turns.test.ts:245` (`'Arrête'`).
   - Tests : `turns.test.ts` gagne les trois événements de la retenue et le `par` du verdict ; `filter.test.ts`, la
     règle rendue ; `scenario.test.ts`, chaque refus de `charger`. Les tests existants passent sans autre changement.
   - Exclu : la session, l'écran, le banc.
2. - [ ] **Le joueur** (`src/presence/player.ts`, `dev-luxuria`). *Parallélisable avec 3 et 4.*
   - `jouer(s: Scenario): Promise<{ page: readonly TraceEvent[]; banc: readonly BancEvent[] }>`. Monte un
     `Endpointer` (seuils tirés des réglages comme `session.svelte.ts:187-196`), une `Conversation` et un `Speaker`
     sur un `Trace`, branchés comme la session (`:245-273`, `:369-385`, `:522-533`).
   - Le temps **[avis]** : le joueur ne sert qu'aux tests, il prend les minuteries fausses de vitest
     (`vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })`, l'heure posée à zéro) et avance trame
     par trame par `vi.advanceTimersByTimeAsync(32)`. L'horloge de la conversation et du déroulé est `Date.now()` :
     une minuterie qui tombe entre deux trames est datée à sa milliseconde. Les briques fausses attendent par
     `setTimeout`, comme le `Speaker` (délai de synthèse, `speaker.ts:147` ; temps de lecture, `:186`). Rien ne
     change dans le code de la page.
   - Chaque trame : probabilité de voix = le maximum des paroles, bruits et écho actifs à cet instant ; `decidedAt`
     égal à `at` (le modèle de voix ne prend aucun temps à ce niveau).
   - La transcription fausse : le son reçu couvre sa durée, jusqu'à maintenant ; elle rend, joints par
     un espace, les `entendu` des paroles commencées dans cet intervalle, l'écho rend la phrase qu'elle disait, un
     bruit rend `''`. Elle répond après le `transcriptionMs` de la dernière de ces paroles, ou échoue sur `echec`.
   - Le faux serveur : `send` rend `user` puis `reply` après `numeroMs` ; numéros 101, 102… pour les réponses et 51,
     52… pour `parle` ; chaque phrase arrive par `onLive` après son `apresMs`, puis `speech-end` et `done` (avec
     `durees`, ou `erreur`). Une phrase oubliée par `cut` n'est plus envoyée. `cut` et `withdraw` sont écrits au
     journal.
   - La fausse voix : la synthèse prend `syntheseMs`, échoue sur un texte de `echoue` ; un son dure
     `msParCaractere × longueur` ; `heard()` rend la part écoulée ; `stop()` l'arrête.
   - Le journal du joueur : sa propre liste, sur la même horloge, avec ses noms (voir « Le format ») ; il ne passe
     pas par `Trace`, dont les noms restent ceux de la page. Le fichier les fond par instant, la page d'abord à
     instant égal.
   - Tests (`player.test.ts`) : une parole seule donne `voix`, `fin` 704 ms après sa dernière trame de voix ; deux
     parties du même scénario rendent les mêmes lignes ; la transcription d'un essai à une pause ne rend que la
     parole commencée ; l'écho suit le son et s'arrête avec lui ; un scénario de 60 s virtuelles se joue en moins
     d'une seconde.
   - Exclu : le son, Silero, la page construite, le vrai serveur.
3. - [ ] **Le juge** (`src/presence/judge.ts`, `dev-luxuria`). *Parallélisable avec 2 et 4.*
   - `juger(s: Scenario, partie): Verdict[]`, un par attendu : `{ id, mecanisme, etat, espece?, trouve?, extrait }`,
     selon les règles et les espèces de « Le format ». Résout `parole`, `reponse`, `parle` par le journal du joueur.
   - `couverture(events)` : les mécanismes qui ont écrit au moins un événement.
   - Tests (`judge.test.ts`), sur des déroulés écrits à la main : chaque espèce au moins une fois ; un attendu ancré
     sur un attendu raté est `non_jouee` ; `absent` sans fenêtre court jusqu'à la fin ; un délai dont une borne
     manque est `delai_manquant`, jamais zéro ; le chevauchement de deux intervalles connus.
   - Exclu : tout modèle, tout texte libre jugé autrement que par inclusion.
4. - [ ] **Le relevé** (`src/presence/releve.ts`, `dev-luxuria`). *Parallélisable avec 2 et 3.*
   - `releve(parties): string` en Markdown : en tête, le compte des attentes tenues, ratées, connues, non jouées ;
     les échecs par espèce, puis par mécanisme. Puis un tableau par scénario : l'attendu, son état, l'espèce, la
     valeur trouvée, la borne ; sous chaque échec, l'extrait du déroulé en lignes datées ; la couverture.
   - Le même texte sert de message d'échec dans la CI, réduit au scénario qui échoue.
   - Tests : un relevé tiré de verdicts écrits à la main, comparé ligne à ligne.
5. - [ ] **Les scénarios de départ** (`src/presence/scenarios/*.ts`, `testeur`). Écriture parallélisable avec 2 à 4.
   - Un fichier par ligne convertie du tableau « Les scénarios de départ », `source` mot pour mot, chaque borne avec
     son calcul en commentaire. Les points 4 et 6 n'ont pas de fichier ; la moitié serveur des autres est écrite en
     tête de leur fichier.
   - Les défauts déjà connus : `echo-fort`, le zéro de `toux-puis-parole`, le point 10 selon « À trancher », chacun
     sous `connus`, avec l'issue ouverte pour lui.
   - Exclu : changer un mécanisme pour qu'un scénario tienne. Un écart trouvé devient une issue.
6. - [ ] **La suite** (`src/presence/scenarios.test.ts`, `dev-luxuria`). Après 1 à 5.
   - Joue chaque scénario deux fois : les déroulés doivent être égaux. Échoue sur une attente ratée hors `connus`,
     ou sur un `connus` qui tient (le défaut est réparé, la marque doit partir).
   - `npm run scenarios` : la même suite en mode `scenarios`, qui écrit `releve-scenarios.md` et un
     `deroule-<nom>.jsonl` par scénario dans `BANC_DIR/scenarios` (par défaut `../banc-sons/scenarios`), hors dépôt.
     Une ligne au `.gitignore` pour `releve-scenarios.md`.
   - Le `CLAUDE.md` du dépôt gagne une ligne sur `npm run scenarios`.
   - Critère : `npm test` ne prend pas plus de cinq secondes de plus sur la CI.
7. - [ ] Relecture séparée du diff, la PR en brouillon, ce plan coché avec « Ce que l'exécution a trouvé ».

## Hors périmètre

- La chaîne sur le laptop (étape 3), les données synthétisées et les taux par répétition (étape 4), le desktop
  (étape 5) : chacun son plan. Le format est fait pour qu'ils rejouent les mêmes fichiers : une `Parole` aura un son à
  la place de sa probabilité de voix.
- La synthèse de sa voix, et la langue.
- Les scénarios de Lun'Anima : les cartes, `relire`, la phrase d'attente non redite, ce que le serveur fait d'une
  coupure. Ils demandent un joueur côté serveur ; le format passera alors en spec de lun-docs.
- Réécrire `conversation.test.ts` et `turns.test.ts` sur le joueur : ils restent tels quels.
- Corriger ce que les scénarios trouvent : une issue par écart.
- Un modèle juge, même en signal.

## Limites

- Au niveau exact, la voix est une probabilité écrite, pas un son : la détection elle-même est prouvée par le banc,
  pas ici. Le modèle de voix ne prend aucun temps ; dans la page, une trame est jugée après lui.
- Les délais sont ceux des briques fausses : le niveau prouve que la page n'ajoute rien qu'on ne voie pas, pas
  qu'elle est rapide.
- L'écho n'est pas annulé à ce niveau : un `echo-fort` dit ce que la page ferait si l'annulation du navigateur
  laissait passer, pas si elle le laisse passer.
- Le premier son du déroulé reste l'instant où la page donne le son, comme dans le plan du déroulé.
- Non vérifié : que `vi.advanceTimersByTimeAsync` de vitest 5 vide assez les promesses entre deux échéances pour
  la chaîne `then` du `Speaker` (`speaker.ts:178`) ; la tâche 2 le teste d'abord. Unmute (son client de charge) n'a
  pas été relu : il sert les taux, à l'étape 4.
