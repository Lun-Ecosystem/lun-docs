# Les scénarios écrits et le niveau exact : jouer, juger, ranger les échecs. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.
>
> **Validé par CrOliX le 11/11**, par écrit, avec les choix marqués **[avis]** et la voie 2 pour le point 10.
>
> **PR :** [lun-luxuria#64](https://github.com/Lun-Ecosystem/lun-luxuria/pull/64), en brouillon.

**But :** qu'un point de la liste d'écoute devienne un fichier qu'une machine joue et juge. Le fichier dit ce que la
personne dit et quand, ce qu'il y a autour, ce que le modèle et sa voix font, et ce qui est attendu, en événements
et en délais du déroulé, avec leurs bornes. Un joueur le rejoue contre les vrais mécanismes de la page, avec des
briques fausses réglées à la milliseconde, dans la CI et en quelques secondes. Un juge à règles lit le déroulé et rend,
pour chaque attente : tenue ou ratée, son espèce, et le premier maillon de la chaîne qui n'a pas joué.

**Ce que cette étape règle, et ce qu'elle ne règle pas.** Le doute de CrOliX sur nos tests de bout en bout se règle
à l'étape 3 : la page construite, le vrai serveur, un son pour micro. Cette étape-ci pose le format que les étapes 3
à 5 rejoueront, le juge qu'elles reprendront, et les fausses briques qu'elles réutiliseront. Elle doit rester courte
pour y arriver vite : chaque scénario dit en une ligne ce qu'il prouve de plus que les tests de la conversation, et
ceux qui n'ajoutent rien sont sortis.

**Source :** le cadrage [« Prouver la présence sans l'oreille »](../specs/2026-11-11-banc-presence-cadrage.md),
validé par CrOliX le 11/11 (lun-docs#161), § 4 pièces 2 et 3 (niveau « exact ») et § 5 étape 2. La liste d'écoute
de la [feuille de route](2026-11-07-feuille-de-route-mvp.md), § 4, étape 4. Le déroulé, fusionné le 11/11
([plan](2026-11-11-deroule-tour.md), lun-luxuria#61). Ce que CrOliX a redit le 11/11 : son oreille n'ajoute rien sur
cet axe ; il veut chaque écart, sa source, et si le mécanisme a joué ; il doute des tests de bout en bout actuels.
Code relu sur `main` de Lun'Luxuria (`3f69d3c`) et de Lun'Anima (`84618a3`). Références relues, rien lancé : Pipecat
(`evals/`, `src/pipecat/evals/`), LiveKit Agents (`tests/fake_*.py`), AIRI (`packages/testing-audio`). Plan relu par
le plan-challenger le 11/11 : « à amender », ses dix objections sont reprises ici (voir la fin).

**Critères de fin :**

- Un scénario est un fichier du dépôt, typé, fait de données seules : ce qui est dit et quand, les bruits, son écho,
  ce que dit le faux modèle, sa voix, les réglages, les attentes. Il passe tel quel par `JSON.stringify`. Un scénario
  mal écrit est refusé au chargement, avec la raison.
- Chaque attente porte son niveau : `exact` seul, ou `tous` (rejouée aux étapes 3 à 5).
- Le joueur fait passer le scénario par le vrai `Endpointer`, la vraie `Conversation` et le vrai `Speaker`, branchés
  comme dans la session. Seuls sont faux : la probabilité de voix de chaque trame, la transcription, le serveur, la
  synthèse et la sortie du son. Ces briques fausses sont exportées, pour les tests et les étapes suivantes.
- Le temps est virtuel et exact : deux parties du même scénario rendent le même déroulé, ligne pour ligne.
- Le juge ne lit que le déroulé de la page (format 2, il refuse un plus ancien) et le journal du joueur. Il ne
  connaît aucun modèle. Pour chaque attente : `tenue`, `ratee` ou `non_jouee`, l'espèce de l'échec, la valeur
  trouvée, et la source : le premier maillon de la chaîne qui n'a rien écrit dans la fenêtre de l'attente.
- Le relevé range les échecs par espèce et par source, et donne pour chaque attente la couverture de sa fenêtre :
  les mécanismes qui y ont écrit.
- Chaque point de la liste d'écoute est un scénario, ou le plan dit pourquoi il ne se convertit pas à ce niveau.
- `npm test` joue toute la suite en moins de cinq secondes de plus sur la CI. Rien n'y est masqué : une attente
  ratée ou non jouée fait échouer la CI, sauf un défaut connu, qui fixe son espèce et sa valeur ; si elles changent,
  ou s'il tient, la CI échoue aussi.

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-luxuria`, `feat/scenarios-presence` | lun-luxuria#62 | `standard` |
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
  `Conversation.onEndpoint` (`session.svelte.ts:478-533`). Les trames sont jugées une à une, chacune après la
  précédente et après le modèle de voix (`#frames`, `:486-494`) : un modèle lent retarde toutes les décisions.
  `brain.live` → `onLive` (`:369`) ; `Speaker` → `onSpeaker` (`:374`). Les seuils de l'écoute viennent des réglages
  (`#params`, `:187-196`). L'horloge de la page est `performance.now()`.
- **Les tests de la conversation** (`src/conversation.test.ts`, 718 lignes ; `src/turns.test.ts`) appellent
  `onEndpoint` à la main, avec une horloge qu'ils avancent eux-mêmes, et attendent des `setTimeout` vides (`tick`).
  Ils prouvent chaque mécanisme isolé ; aucun ne fait passer une parole datée par l'`Endpointer`, aucun ne fait
  durer une synthèse ou un son. Le même montage (faux serveur, fausse sortie, `Speaker`) est recopié trois fois :
  `conversation.test.ts:21-72`, `turns.test.ts:17-78`, `banc.test.ts:124-144` et `:283-302`.
- **Le banc** (`src/listen/banc.test.ts`, `npm run banc`) rejoue de vrais fichiers par `replay()`
  (`src/listen/replay.ts:87`), sur le temps du son, hors CI : les sons vivent dans `banc-sons`, hors dépôt.
- **Ce que le déroulé ne dit pas encore**, et qu'un juge doit pouvoir lire :
  - la retenue d'une réponse quand il reparle, sa sortie, son oubli (`#holdBack`, `#letGo`, `#forget`,
    `conversation.ts:256-304`) n'écrivent rien ; on ne les voit qu'en creux, par un son qui ne vient pas ;
  - le verdict du filtre dit `pour_elle`, pas pourquoi : réglage coupé, touche, nom, ou fenêtre de 15 s
    (`filter.ts`, `decide` ; `conversation.ts:361`) ;
  - `son` ne dit pas quelle phrase de la réponse sonne (`speaker.ts:197`) : « elle redit sa phrase » ne se lit pas.
- **La synthèse** abandonne une phrase après 5 s (`SYNTH_TIMEOUT_MS`, `speaker.ts:42`, non exporté).
- **Le serveur** (Lun'Anima) joint ses durées à la réponse finie (`core/src/chat/service.ts:559-562`) ; la page les
  écrit sous `durees` (`conversation.ts:417`). Au niveau exact, le faux serveur les tire de ce que dit le faux modèle.
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
Il ne contient que des données : ni fonction, ni calcul, ni import de valeur ; un test le vérifie en le faisant passer
par `JSON.stringify`. Le TypeScript ne sert qu'à deux choses : les types font le schéma, et les commentaires disent
pourquoi une borne vaut ce qu'elle vaut. Le JSON obligerait à écrire un validateur et interdirait les commentaires.

Le format vit dans Lun'Luxuria seule, à côté du déroulé qu'il lit. Il ne passera en spec de lun-docs que le jour où
Lun'Anima aura son propre joueur. Le dépôt est public : aucun scénario n'a besoin du nom de l'instance (en scène, le
filtre est coupé ; en petit mode, les scénarios parlent justement sans le nom).

Les temps sont en millisecondes depuis le début de la partie.

```ts
interface Scenario {
  nom: string;
  /** Le point de la liste d'écoute qu'il remplace, mot pour mot. */
  source: string;
  /** Ce qu'il prouve de plus que conversation.test.ts et turns.test.ts, en une ligne. */
  apport: string;
  /** Les maillons qu'il fait jouer, dans l'ordre de la chaîne : le juge y cherche la source d'un échec. */
  mecanismes: Mecanisme[];
  disposition?: Layout;                 // 'scene' par défaut
  reglages?: DeepPartial<Settings>;     // sur DEFAULTS
  /** Le temps du modèle de voix par trame, 0 par défaut : une trame est décidée à `at + modeleMs`. */
  modeleMs?: number;
  personne: Parole[];                   // ce qu'elle entend de la personne
  bruits?: { a: number; duree: number; voix: number }[];  // un son sans paroles : la transcription rend ''
  /** Son propre son repris par le micro, à cette probabilité de voix, tant qu'il sonne. */
  echo?: { voix: number };
  /** Ce que dit le faux modèle. Au niveau exact, le faux serveur en tire phrases et durées ; à l'étape 3, le même
   *  objet pilote un faux modèle derrière le vrai serveur. */
  modele?: { reponses?: Reponse[]; parle?: { a: number; pourquoi: SpeechWhy; phrases: string[] }[] };
  voix?: { syntheseMs?: number; msParCaractere?: number; echoue?: string[] };
  /** Fin de la partie ; par défaut cinq secondes après le dernier événement prévu. */
  jusqua?: number;
  attendus: Attendu[];
  /** Un défaut connu : l'espèce et la valeur qu'il rend aujourd'hui. Tout autre résultat casse la CI. */
  connus?: { issue: string; attendu: string; espece: Espece; trouve?: TraceValue }[];
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

interface Reponse {
  si?: string;                          // contenu dans le texte reçu, sans accents ni casse
  premierMotMs?: number;                // du texte reçu au premier mot, 400 par défaut
  phrases: string[];                    // ce que le modèle écrit, phrase par phrase
  entrePhrasesMs?: number;              // 300 par défaut
  poste?: { apres: number; ms: number };  // un appel à un poste après la phrase `apres`, et sa durée
  erreur?: string;
}

type Niveau = 'exact' | 'tous';

type Attendu = { id: string; niveau: Niveau; mecanisme: Mecanisme; dit: string } & (
  | { evenement: TraceName | BancNom; ou?: Filtre; depuis?: Ancre; entre?: [number, number]; absent?: true }
  | { delai: DelayName; tour: Tour; entre: [number, number] }
  | { mesure: 'chevauchement'; entre: [number, number] }
);

/** La phrase du déroulé ouverte par la n-ième parole, la réponse à la n-ième phrase envoyée, ou la n-ième parole
 *  du modèle sans phrase de la personne. */
type Tour = { parole: number } | { reponse: number } | { parle: number };

/** Le tour, et des valeurs que l'événement doit porter (`etape`, `resultat`, `par`, `texte`…). */
type Filtre = Partial<Tour> & { essai?: number; valeurs?: Record<string, TraceValue> };

/** Depuis le début de la partie par défaut. */
type Ancre =
  | { attendu: string }
  | { parole: number; bord: 'debut' | 'fin' };
```

**Les mécanismes**, dans l'ordre de la chaîne, chacun avec les événements qui disent qu'il a joué. La page les écrit
dans le déroulé ; le joueur écrit les siens dans son journal.

| Mécanisme | Pièce du code | Dans le déroulé de la page | Dans le journal du joueur |
|---|---|---|---|
| `ecoute` | `Endpointer` | `voix`, `tenue`, `pause`, `reprise`, `fin`, `bruit` | `parole`, `bruit_joue` |
| `essai` | la phrase envoyée avant sa fin | `essai`, `retiree`, `confirmee` | |
| `transcription` | la transcription | `transcrite` | |
| `filtre` | `decide` | `verdict` (valeurs `pour_elle`, `ecartee`, `bruit` ; `par`) | |
| `retenue` | `#holdBack`, `#letGo`, `#forget` | `retenue`, `relachee`, `oubliee` | |
| `suspension` | `Speaker.suspend`, `resume` | `suspendue`, `reprise_voix`, `son` arrêté | |
| `coupure` | `cutSuspended`, `stop` | `coupee`, `arretee` | `coupure_recue` |
| `serveur` | faux serveur | `envoyee`, `numero`, `phrase_recue`, `fin_recue`, `durees` | `envoi_recu`, `retrait_recu` |
| `voix` | `Speaker`, la sortie | `synthese`, `son`, `premier_son`, `silence` | `joue`, `arrete`, `echo` |

`retenue` et `suspension` sont au même rang : l'une vaut quand elle se tait, l'autre quand elle parle.

**Le journal du joueur** est écrit sur la même horloge que le déroulé, et fondu avec lui dans le même fichier, chaque
ligne marquée `de: 'banc'` : ce que le monde a fait, que la page ne sait pas. `parole` (début, fin, son numéro),
`bruit_joue`, `echo` (début, fin), `envoi_recu` (le texte reçu), `coupure_recue` (la réponse, les mots entendus),
`retrait_recu`, `joue` (le texte de la phrase que la sortie commence), `arrete` (quand elle s'arrête). Rien n'est
recollé par l'heure : une seule horloge, un seul fichier (la mise en garde d'EVA, cadrage § 3).

**Le juge** cherche, pour chaque attente, le premier événement qui convient après son ancre :

- `evenement` seul : tenu si trouvé dans `entre` (par défaut, n'importe quand après l'ancre) ;
- `absent: true` : tenu si rien ne convient dans la fenêtre (par défaut, jusqu'à la fin de la partie) ;
- `delai` : lu dans `delays()` pour le tour désigné ;
- `mesure: 'chevauchement'` : le temps où une `parole` et un `joue` se recouvrent, lu dans le journal du joueur.

**Les espèces d'échec** : `absent` (rien ne convient), `hors_bornes` (trouvé, hors de `entre` : la valeur est
rendue), `en_trop` (un `absent` a trouvé), `delai_manquant` (une borne du délai manque), `non_jouee` (son ancre n'est
pas venue), `scenario` (refusé au chargement), `joueur` (une exception pendant la partie). Toutes font échouer la CI.

**La source d'un échec** est trouvée, pas étiquetée : le juge parcourt les `mecanismes` du scénario dans l'ordre de
la chaîne, et rend le premier qui n'a rien écrit dans la fenêtre de l'attente. Si tous ont écrit, la source est le
`mecanisme` de l'attente : il a joué, mais faux, et la valeur trouvée le dit. Une attente ratée porte aussi les
événements de la seconde qui entoure sa fenêtre.

## Les scénarios de départ

Les points de la liste d'écoute (feuille de route, § 4, étape 4), dans leur ordre. Les bornes sont celles que le code
donne avec les briques fausses par défaut (transcription 150 ms, numéro 20 ms, premier mot 400 ms, synthèse 150 ms,
60 ms par caractère) ; le développeur les calcule à la trame près et écrit le calcul en commentaire. « Apport » dit ce
que le scénario prouve de plus que `conversation.test.ts` et `turns.test.ts`.

1. **Deux phrases à trois secondes d'écart pendant qu'elle réfléchit.** `deux-phrases` : le modèle met 4 s à
   répondre à la première ; sa phrase arrive au milieu de la parole 2. Attend : `retenue` de la réponse 1 à la tenue
   de la parole 2 ; `oubliee` et `coupure_recue` de la réponse 1, mots vides ; aucun `joue` de la réponse 1 ; un
   seul `premier_son`, celui de la réponse 2. Apport : la phrase du serveur arrive pendant que la parole 2 se tient,
   à un instant daté (`conversation.test.ts:416` la donne avant ou après, jamais pendant). Hors niveau : « qui a lu
   les deux », le contexte du serveur.
2. **Une toux, ou une phrase pas pour elle, pendant qu'elle réfléchit.** `toux-reflexion` (450 ms, `entendu: ''`).
   Attend : `retenue`, verdict `resultat: 'bruit'`, `relachee` ; la réponse 1 sonne ; aucune `coupure_recue`.
   Apport : une toux de 450 ms n'est pas un `noise` de l'écoute (plus de 250 ms) mais une phrase transcrite vide ;
   `conversation.test.ts:435` lui donne un `noise` à la main. L'aparté est sorti : `conversation.test.ts:435` et
   `:515` le prouvent déjà.
3. **La couper au milieu d'une réponse longue, entre deux phrases**, et **15, la couper pendant le blanc d'une
   demande qui prépare une carte.** Un seul scénario, `couper-le-blanc` : une phrase d'attente, un poste de 2 s, le
   résultat ; « arrête » dans le blanc. Attend : `suspendue` dans le blanc ; `coupee` avec la phrase d'attente
   entière ; `coupure_recue` ; aucun `joue` du résultat. Apport : le blanc vient de vraies durées (poste, synthèse),
   pas d'un état posé (`conversation.test.ts:553`). Hors niveau : « la carte reste, pas redemandée », le serveur.
4. **Une carte seule en attente, à la voix.** Non converti : la page n'a aucune logique de carte, le serveur tranche.
5. **« Oui » sur une carte, puis reparler avant « tu as 5 secondes ».** `oui-puis-reparler` : la phrase du serveur
   est arrivée, sa synthèse est en cours. Attend : `retenue`, puis `oubliee` et `coupure_recue` de la réponse au
   « oui », mots vides ; aucun `joue` d'elle. Apport : une synthèse qui dure pendant la retenue (`speaker.ts:181`) ;
   les tests la font instantanée. Hors niveau : « rien n'est tranché », ce que le serveur fait de la coupure.
6. **L'heure, `relire` appelé.** Non converti : la base et les outils du serveur.
7. **Le délai de réponse avec 0,7 s de silence de fin.** `delai-de-reponse` (essai coupé) et `delai-a-l-essai` (essai
   en service, une pause de 300 ms dans la parole). Attend : `attente_fin` dans [700, 736] ; `blanc_de_tour` égal à
   la somme des briques fausses à une trame près ; plus court à l'essai. Une variante, `delai-modele-lent`
   (`modeleMs: 40`), montre le retard du modèle de voix dans `attente_fin`. Apport : le blanc passe par la vraie
   écoute ; il prouve que la page n'attend rien qu'on ne voie. Hors niveau : les vingt tours et les vrais
   délais, au desktop (étape 5).
8. **Une toux pendant qu'elle parle : elle se tait, redit sa phrase, continue.** `toux-parole` (450 ms) et
   `toux-courte` (300 ms). Attend, à 450 ms : `suspendue` à 400 ms du début de la toux, à une trame près ;
   `reprise_voix` ; le `joue` suivant porte le texte de la phrase coupée ; le blanc entre `arrete` et ce `joue` est
   borné. À 300 ms : aucune `tenue`, aucune `suspendue`. Apport : le seuil de 400 ms joué de part et d'autre, et la
   phrase redite lue dans ce qui sonne ; les tests posent `held` à la main.
9. **« Arrête » ou « non » pendant une longue réponse**, avec **16, la couper tout de suite, et ce qu'elle dit avoir
   entendu.** `arrete-net` (600 ms) et `non-court` (300 ms). Attend : `son` arrêté à la `tenue` ; `coupee` et
   `coupure_recue` avec les mots au prorata du son écoulé ; `silence` coupé ; plus aucun `joue` de cette réponse ;
   « non » coupe sans `tenue`, à son verdict. Apport : les mots entendus calculés sur un son qui dure, à l'instant
   daté de la coupure. La coupure « en fin de phrase » (mode doux) est sortie : `conversation.test.ts:375` la prouve,
   et le niveau exact n'y ajoute rien.
10. **Une phrase dite à quelqu'un d'autre, au-delà de quinze secondes de réponse.** `aparte-parole-longue` : une
    réponse de cinq phrases sur 25 s, un aparté sans son nom à 20 s, disposition `small`. Attend ce que fait le
    code : verdict `pour_elle` avec `par: 'fenetre'`, puis `coupee`. Voir « À trancher ». Apport : la fenêtre
    rafraîchie phrase par phrase, sur des phrases qui durent (`conversation.test.ts:286` avance l'horloge à la main),
    écrit à côté du 9, dont il est le revers.
11. **Son propre son repris par le micro.** `echo-fort` (voix 0,7 tant qu'elle sonne). Attend, comme une mesure de
    ce que fait le code : `tenue`, `suspendue`, `transcrite` avec ses propres mots, verdict `pour_elle` par la
    fenêtre, `coupure_recue`, `envoi_recu` de ses mots. Apport : aucun test ne fait entrer sa voix dans le micro.
    L'écho sous le seuil est sorti : il ne prouve que le seuil de l'écoute. Hors niveau : l'annulation d'écho du
    navigateur, qui seule décide si l'écho passe (étapes 3 à 5).
12. **Recommencer à parler juste après une toux.** `toux-puis-parole` : une parole 200 ms après la fin de la toux.
    Attend : un `chevauchement` dans [0, 432], ce que le code garantit (une tenue, plus une trame). Et un
    chevauchement nul, dans `connus`, avec son espèce (`hors_bornes`) et la valeur trouvée. Apport : la course entre
    le verdict de la toux et la nouvelle parole, que seul le temps produit.
13. **« J'ai des mails ? » : ce qu'elle fait, puis le résultat**, avec **14, le blanc entre les deux.**
    `phrase-attente` : une phrase, un poste de 2,5 s, le résultat. Attend : les deux `joue` dans l'ordre ; le délai
    `poste` lu dans `durees` ; le blanc entre la fin du premier `joue` et le second égal au poste plus le premier mot
    et la synthèse, moins le son de la phrase 1. Apport : le blanc que CrOliX entendrait, tiré du déroulé. Hors
    niveau : « sans redire la phrase », le serveur ; les vrais délais du poste, au desktop.

Points non convertis : 4 et 6 en entier ; la moitié serveur de 1, 3, 5 et 13 ; la coupure en mode doux (16), déjà
prouvée. Les vrais délais (7, 13) attendent la chaîne. Sortis faute d'apport : l'aparté pendant qu'elle réfléchit,
l'écho sous le seuil, la coupure douce. Restent quinze fichiers.

## À trancher par CrOliX

- **Le point 10 contre le point 9.** En petit mode, sans son nom, pendant qu'elle parle, un « arrête » et un aparté
  sont la même chose pour la page : une phrase dans la fenêtre de 15 s. Seul le sens les sépare. Faire tenir le 10
  (« elle reprend ») casse le 9 (« elle se tait pour de bon »). Trois voies :
  1. renoncer à « arrête » sans son nom pendant qu'elle parle : le 10 tient, il faut dire son nom pour la couper ;
  2. accepter le 10 tel qu'il est : un aparté la coupe, il faut redemander ;
  3. renvoyer au sens de la phrase, plus tard (la piste Pipecat du cadrage, § 3 « Au passage »).

  **Je recommande la 2 pour le MVP**, puis la 3. Pouvoir la faire taire d'un mot est ce qui compte le plus pendant
  qu'elle parle ; un aparté qui la coupe coûte une redemande, un « arrête » ignoré coûte sa confiance. Le scénario
  10 attend donc ce que fait le code, sans `connus`, et le point sort de la liste d'écoute.

## Tâches

Les tâches 2 et 3 partent en parallèle une fois la tâche 1 faite : elles ne partagent que ses types. La tâche 4
peut s'écrire en même temps qu'elles, et se jouer après.

1. - [x] **Le déroulé, version 2, et le format** (Lun'Luxuria, `dev-luxuria`). Seul, d'abord : les autres le lisent.
   - `src/conversation.ts` : `retenue` dans `#holdBack`, une fois la réponse vraiment retenue (la réponse, la phrase
     qui la retient) ; `relachee` dans `#letGo`, seulement quand une réponse retenue sort (après le
     `if (waiting === by) return`, `:275`) ; `oubliee` dans `#forget` (`:301`), qui couvre l'oubli par
     `#supersede` (`:298`) et la réponse oubliée à son numéro (`:399`).
   - `src/listen/filter.ts` : `decide` rend aussi la règle qui a laissé passer (`off`, `touche`, `nom`, `fenetre`) ;
     le `verdict` l'écrit sous `par`. Les appels existants ne changent pas de sens.
   - `src/speech/speaker.ts` : `son` début porte `rang`, la phrase de la réponse qui sonne ; `SYNTH_TIMEOUT_MS`
     exporté.
   - `TRACE_FORMAT` passe à 2 (des noms ajoutés, `son` qui change de valeurs) ; le commentaire le dit.
   - `src/presence/scenario.ts` : les types du format, et `charger(s)` qui refuse un scénario mal écrit : une ancre
     vers un attendu inconnu, des bornes inversées, deux attendus du même id, un `connus` qui nomme un id absent,
     deux paroles qui se chevauchent, une `syntheseMs` d'au moins `SYNTH_TIMEOUT_MS`, un `mecanismes` hors de
     l'ordre de la chaîne.
   - Corriger `turns.test.ts:245` (`'Arrête'`).
   - Tests : `turns.test.ts` gagne la retenue, sa sortie, son oubli (et l'absence de `relachee` quand la phrase
     retenue est celle qui retient) et le `par` du verdict ; `filter.test.ts`, la règle rendue ; `scenario.test.ts`,
     chaque refus de `charger`. Les tests existants passent sans autre changement.
   - Exclu : la session, l'écran, le banc.
2. - [x] **Les briques fausses et le joueur** (`src/presence/fakes.ts`, `src/presence/player.ts`, `dev-luxuria`).
   *Parallélisable avec 3.*
   - `fakes.ts`, exporté pour les tests et les étapes suivantes :
     - la transcription : le son reçu couvre sa durée, jusqu'à maintenant ; elle rend, joints par un espace, les
       `entendu` des paroles commencées dans cet intervalle ; l'écho rend la phrase qu'elle disait ; un bruit rend
       `''`. Elle répond après le `transcriptionMs` de la dernière de ces paroles, ou échoue sur `echec` ;
     - le serveur : `send` rend `user` puis `reply` après 20 ms ; numéros 101, 102… pour les réponses, 51, 52… pour
       `parle`. La première phrase arrive après `premierMotMs`, les suivantes après `entrePhrasesMs`, un poste
       ajoute ses `ms` ; puis `speech-end` et `done`, avec les `durees` qu'Anima rendrait (`firstWordMs`, `postMs`,
       `secondWordMs`), ou `erreur`. Une réponse coupée n'envoie plus rien. `cut` et `withdraw` vont au journal ;
     - la voix : la synthèse prend `syntheseMs`, échoue sur un texte de `echoue` ; un son dure
       `msParCaractere × longueur`, `heard()` rend la part écoulée, `stop()` l'arrête ; `joue` et `arrete` au
       journal.
   - `player.ts` : `jouer(s)` rend `{ page, banc }`, le déroulé et le journal. Monte un `Endpointer` (seuils tirés
     des réglages comme `session.svelte.ts:187-196`), une `Conversation` et un `Speaker` sur un `Trace`, branchés
     comme la session (`:245-273`, `:369-385`, `:522-533`).
   - Le temps **[avis]** : les minuteries fausses de vitest (`vi.useFakeTimers({ toFake: ['setTimeout',
     'clearTimeout', 'Date'] })`, l'heure posée à zéro), avancées par `vi.advanceTimersByTimeAsync`. Le joueur
     donne `() => Date.now()` comme horloge à la `Conversation` et au `Trace`, et ne lit jamais `performance`. Les
     briques fausses attendent par `setTimeout`, comme le `Speaker` (`speaker.ts:147`, `:186`). Rien ne change dans le
     code de la page. Parce qu'il importe `vi`, le joueur ne sert pas en temps réel : l'étape 3 reprendra les
     scénarios, le juge et les briques fausses, pas lui.
   - Chaque trame : probabilité de voix = le maximum des paroles, bruits et écho actifs à son instant `at`. Elle est
     décidée à `at + modeleMs`, après la précédente, une à la fois comme dans la session : un modèle plus lent que
     32 ms accumule son retard, et ce retard sort dans `attente_fin`.
   - Tests (`player.test.ts`) : une parole seule donne `voix`, et `fin` 704 ms après sa dernière trame de voix ;
     avec `modeleMs: 40`, le retard s'accumule ; deux parties du même scénario rendent les mêmes lignes ; la
     transcription d'un essai à une pause ne rend que la parole commencée ; l'écho suit le son et s'arrête avec lui ;
     un scénario de 60 s virtuelles se joue en moins d'une seconde.
   - Exclu : le son, Silero, la page construite, le vrai serveur.
3. - [x] **Le juge et le relevé** (`src/presence/judge.ts`, `src/presence/releve.ts`, `dev-luxuria`).
   *Parallélisable avec 2.*
   - `juger(s, partie)` : refuse un déroulé d'un format plus ancien que 2. Rend un verdict par attendu :
     `{ id, niveau, mecanisme, etat, espece?, trouve?, source?, couverture, extrait }`, selon les règles, les espèces
     et la source de « Le format ». `couverture` : les mécanismes qui ont écrit dans la fenêtre de l'attente. Résout
     `parole`, `reponse` et `parle` par le journal du joueur. Compare chaque `connus` à ce qu'il a trouvé.
   - `releve(parties)` en Markdown : en tête, le compte des attentes tenues, ratées, connues, non jouées ; les échecs
     par espèce, puis par source. Puis un tableau par scénario : l'attendu, son état, l'espèce, la source, la valeur
     trouvée, la borne ; sous chaque échec, l'extrait du déroulé en lignes datées et la couverture. Le même texte,
     réduit au scénario qui échoue, sert de message d'échec dans la CI.
   - Tests (`judge.test.ts`), sur des déroulés écrits à la main : chaque espèce au moins une fois ; un attendu ancré
     sur un attendu raté est `non_jouee` ; `absent` sans fenêtre court jusqu'à la fin ; un délai dont une borne
     manque est `delai_manquant`, jamais zéro ; la source est le premier maillon muet, et le mécanisme de l'attente
     quand tous ont écrit ; un `connus` dont l'espèce change ne passe pas ; le chevauchement de deux intervalles
     connus ; un déroulé de format 1 refusé. Un relevé tiré de verdicts écrits à la main, comparé ligne à ligne.
   - Exclu : tout modèle, tout texte jugé autrement que par égalité ou inclusion.
4. - [x] **Les scénarios de départ** (`src/presence/scenarios/*.ts`, `testeur`). Écriture parallélisable avec 2 et 3.
   - Les quinze fichiers de « Les scénarios de départ », chacun avec `source` mot pour mot, son `apport`, chaque
     borne avec son calcul en commentaire, et le `niveau` de chaque attente : `tous` pour ce que la chaîne doit
     tenir aussi, `exact` pour une borne qui ne vaut qu'avec les briques fausses. La moitié serveur d'un point est
     écrite en tête de son fichier.
   - Un seul défaut connu au départ : le chevauchement nul de `toux-puis-parole`, avec son issue.
   - Exclu : changer un mécanisme pour qu'un scénario tienne. Un écart trouvé devient une issue.
5. - [x] **La suite** (`src/presence/scenarios.test.ts`, `dev-luxuria`). Après 1 à 4.
   - Charge chaque scénario, vérifie qu'il passe tel quel par `JSON.stringify`, le joue deux fois (les déroulés
     doivent être égaux) et échoue sur toute attente ratée ou non jouée, et sur un `connus` qui ne rend plus son
     espèce ou sa valeur.
   - `npm run scenarios` : la même suite en mode `scenarios`, qui écrit `releve-scenarios.md` et un
     `deroule-<nom>.jsonl` par scénario dans `BANC_DIR/scenarios` (par défaut `../banc-sons/scenarios`), hors dépôt.
     Une ligne au `.gitignore` pour `releve-scenarios.md`. Une ligne au `CLAUDE.md` du dépôt.
   - Critère : `npm test` ne prend pas plus de cinq secondes de plus sur la CI.
6. - [x] Relecture séparée du diff, la PR en brouillon, ce plan coché avec « Ce que l'exécution a trouvé » ; le point
   10 retiré de la liste d'écoute de la feuille de route si CrOliX suit la recommandation. Fait : la PR en
   brouillon, le plan coché, le point 10 retiré (voie 2). La seconde relecture a trouvé un fichier mal encodé et une
   coupure franche qui n'arrêtait plus le son sans aucun échec : corrigés (`sortie-arretee` dans `arrete-net` et
   `non-court`, le maillon propre gardé dans le verdict). Trou connu : le bouton « silence » qui n'arrête plus le
   son ne casse rien, aucun scénario ne joue ce bouton.

## Hors périmètre

- La chaîne sur le laptop (étape 3), les données synthétisées et les taux par répétition (étape 4), le desktop
  (étape 5) : chacun son plan. Ils rejouent les mêmes fichiers, leurs attentes de niveau `tous` : une `Parole` aura
  un son à la place de sa probabilité de voix, et `modele` pilotera un faux modèle derrière le vrai serveur.
- La synthèse de sa voix, et la langue.
- Les scénarios de Lun'Anima : les cartes, `relire`, la phrase d'attente non redite, ce que le serveur fait d'une
  coupure. Ils demandent un joueur côté serveur ; le format passera alors en spec de lun-docs.
- Réécrire `conversation.test.ts` et `turns.test.ts` sur les briques fausses : possible ensuite, pas ici.
- Corriger ce que les scénarios trouvent : une issue par écart.
- Un modèle juge, même en signal. Un `compte` d'événements : aucun scénario n'en a besoin.

## Limites

- Au niveau exact, la voix est une probabilité écrite, pas un son : la détection elle-même est prouvée par le banc,
  pas ici.
- Les délais sont ceux des briques fausses : le niveau prouve que la page n'ajoute rien qu'on ne voie pas, pas
  qu'elle est rapide.
- L'écho n'est pas annulé à ce niveau : `echo-fort` dit ce que la page fait si l'annulation du navigateur laisse
  passer, pas si elle le laisse passer.
- Le faux serveur tire ses phrases de ce que dit le faux modèle, à sa façon : le découpage du vrai serveur ne sera
  éprouvé qu'à l'étape 3.
- Le premier son du déroulé reste l'instant où la page donne le son, comme dans le plan du déroulé.
- Non vérifié : que `vi.advanceTimersByTimeAsync` de vitest 5 vide assez les promesses entre deux échéances pour
  la chaîne `then` du `Speaker` (`speaker.ts:178`) ; la tâche 2 le teste d'abord. Unmute (son client de charge) n'a
  pas été relu : il sert les taux, à l'étape 4.

## Ce que l'exécution a trouvé

**Les écarts au plan.**

- Seize scénarios au lieu de quinze : `phrase-ecartee` est ajouté, car aucun scénario n'exerçait le refus du filtre.
- La phrase qui suit un poste arrive `poste.ms + premierMotMs` après la précédente, comme dans Anima. D'où la borne
  `phrase-attente/blanc` : [1640, 1672].
- La parole de `toux-puis-parole` est placée 192 ms après la reprise, soit 894 ms après la toux. Plus tôt, elle
  continuerait la phrase de la toux.
- `non-court` coupe à la fin de phrase (`confirmee`), pas au verdict.

**Le contrat, retouché au rapprochement** du joueur et du juge. `Partie` porte sa `fin`. Une `erreur` du joueur est
rendue dans la partie. `envoi_recu` est numéroté. Un mécanisme hors de la chaîne du scénario n'est admis que dans une
attente `absent`.

**La règle de la source, réécrite.** Chaque attente cherche d'abord dans la fenêtre de son propre maillon. Une
`non_jouee` prend la source de l'attente qui lui sert d'ancre. Un défaut ne nomme qu'un maillon. Le risque : deux
défauts dans une même partie ne nomment que le premier.

**Les mutations**, faites par la relecture séparée, chacune remise ensuite. Les scénarios en échec, et la source
nommée avant et après la correction du juge :

| Mutation | Scénarios en échec | Source avant | Source après |
|---|---|---|---|
| a. tenue doublée | 9 | ecoute 12, suspension 6, voix 3, coupure 2, retenue 1, essai 1 | ecoute 25 |
| b. suspension coupée | 6 | suspension 8, essai 5, ecoute 3, coupure 2, voix 2 | suspension 20 |
| c. retenue coupée | 3 | retenue 9, essai 4 | retenue 13 |
| d1. filtre qui laisse tout passer | 7 | 16 échecs sur sept sources | filtre 22 |
| d2. phrase écartée qui passe | aucun avant | aucun échec | `phrase-ecartee`, filtre 3 |
| e. silence de 500 ms | 6 | ecoute 6, voix 3, coupure 2 | ecoute 10, voix 1 |

Avant la correction, une mutation dispersait ses échecs sur plusieurs maillons. Après, elle nomme le sien. Le d2
montre le trou que `phrase-ecartee` comble.

**Le défaut connu.** Le chevauchement nul de `toux-puis-parole/chevauchement-nul` : 384 ms aujourd'hui, suivi dans
lun-luxuria#63.

## Ce que le plan-challenger a changé

1. Rien n'est masqué : `non_jouee` fait échouer la CI, et un défaut connu fixe son espèce et sa valeur.
2. La source d'un échec est trouvée, pas étiquetée : le premier maillon de la chaîne muet dans la fenêtre de
   l'attente ; la couverture se calcule par fenêtre.
3. Chaque scénario dit ce qu'il prouve de plus que les tests de la conversation ; l'aparté pendant qu'elle réfléchit
   et la coupure douce sont sortis, deux paires de points fusionnées. Le doute sur le bout en bout se règle à
   l'étape 3, et celle-ci reste courte. Les briques fausses sont exportées.
4. Chaque attente porte son niveau ; le serveur du scénario devient ce que dit le faux modèle, pour piloter Lun'Anima
   à l'étape 3 ; un scénario est fait de données seules, vérifiées par `JSON.stringify`.
5. Le point 10 attend ce que fait le code, et la vraie question est posée : il est le revers du 9.
6. L'écho sous le seuil est sorti ; l'écho fort attend la chaîne que le code joue, comme une mesure.
7. `oubliee` s'écrit dans `#forget`, qui couvre les deux oublis ; `relachee` seulement pour une réponse vraiment
   retenue.
8. Le déroulé passe en version 2, et le juge refuse un plus ancien.
9. Le retard du modèle de voix se règle (`modeleMs`) et peut sortir comme cause ; le joueur ne lit jamais
   `performance` ; une synthèse trop longue est refusée au chargement ; le joueur ne sert pas en temps réel.
10. Les ancres sont des objets typés ; `compte` est retiré ; le tableau des mécanismes sépare la page du journal du
    joueur, et `ecartee` y est une valeur du verdict.
