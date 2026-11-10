# Le temps du premier mot : mesurer avant d'ordonner le prompt. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** savoir, par une mesure, si le cache du fournisseur peut raccourcir l'attente du premier mot de Natsume. Le
prompt du core n'est réordonné que si la mesure le dit.

**Source :** l'[étude d'OpenAmika](../specs/2026-11-10-etude-openamika.md) (le cache par paliers), choisie par CrOliX le
10/11 comme première marche faisable sans le desktop. L'[ADR 0011](../../adr/0011-chaine-vocale-mvp.md) : sur 2776 ms du
dernier son de voix au premier son joué, l'attente du serveur en prend environ 1130. Plan relu par le plan-challenger
le 10/11 : « à amender », ses dix objections sont reprises ici (voir la fin).

**Critères de fin :**

- Chaque appel au modèle garde ce que le fournisseur a relu de son cache et le temps de son premier mot.
- Un relevé chiffré compare quatre prompts joués contre le vrai modèle, et dit ce que le cache change au premier mot.
- La décision est écrite : on réordonne, ou non, avec le chiffre qui la fonde.

**Validé par CrOliX le 10/11**, appels payants de la tâche 3 compris. Niveau `standard`. *Show* : tout se prouve sur le
laptop. Une PR dans le core, une ici pour le plan et le relevé.

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-anima`, `feat/premier-mot` | lun-anima#95 | `standard` |
| `lun-docs`, `docs/plan-premier-mot` | la même | `trivial` |

## Ce que le core fait aujourd'hui (relevé du 10/11, relu par le plan-challenger)

- **Le fournisseur est OpenAI** (`core/src/chat/openai.ts`) ; le modèle est un réglage (`chat.model`). Son cache est
  automatique : il relit un début de prompt identique, outils compris, à partir de 1 024 jetons, pendant au moins trente
  minutes (sa documentation, lue le 10/11).
- **L'ordre d'un appel** : les outils ; puis un tour système (l'identité et le tempérament, la règle des postes, le jour,
  les notes de la nuit, l'heure, la situation) ; puis l'historique (`service.ts:553`, `:663`).
- **Ce qui est stable** : l'identité, le tempérament, le jour et les notes ne changent qu'une fois par nuit. Les outils et
  la règle des postes changent quand un poste se relie ou se délie.
- **Ce qui casse le cache à chaque tour** : sur le fil principal, la situation, placée avant l'historique. Elle porte
  l'heure du dernier message et le compte des messages du jour (`natsume/situation.ts:171-176`, `:224-225`). L'historique
  n'est donc jamais relu du cache, à une seconde comme à une heure d'écart. Sur un fil de sujet, sans situation, c'est
  l'heure qui le casse, à chaque minute.
- **La fenêtre** : quarante messages ou 16 000 signes (`store.ts:268`). Le fil principal repart chaque matin, avec les six
  derniers messages d'avant 5 h ; un fil de sujet ne repart jamais.
- **Déjà mesuré** : les jetons d'entrée et le coût de chaque réponse. **Pas mesuré** : les jetons relus du cache, le
  temps du premier mot.
- **Le raisonnement du modèle est déjà coupé** sur tous les appels en flux (`openai.ts:56-57`) : rien à gagner là.

## Ce qui n'est pas su

- Ce que pèse le prompt d'un vrai tour. La base du laptop le dit sans code : `messages.input_tokens`.
- Ce que les 1130 ms contiennent : le relevé du 07/11 compte jusqu'au premier bout de phrase publié par le core, donc
  aussi l'écriture de ce bout par le modèle. Le cache ne raccourcit que la lecture du prompt.
- Si le modèle rend bien les jetons relus dans son décompte, en flux.
- **L'argent n'est pas l'enjeu** : à 0,10 dollar le million de jetons d'entrée, cent tours de 4 000 jetons coûtent 4
  centimes. Le coût reste compté au plein prix, ce qui surestime : c'est le sens prudent pour le plafond.

## Tâches

1. - [x] **Lire ce qui existe.** Une requête sur la base du laptop : les jetons d'entrée des réponses des derniers
   jours, et le nombre de jours où la fenêtre s'est remplie. Si un vrai prompt pèse moins de 1 024 jetons, le chantier
   s'arrête ici. Preuve : les chiffres, écrits dans ce plan.

   **Fait le 10/11, et la base ne répond pas.** Celle du laptop ne garde que vingt réponses, du 20 au 29 octobre :
   médiane de 997 jetons d'entrée, de 59 à 2 172, onze sous 1 024. Elles datent d'avant l'identité, la situation et les
   outils d'aujourd'hui : elles ne disent pas ce que pèse un prompt de novembre. Aucun jour n'a dépassé quarante
   messages (le plus chargé : 32). Deux choses en sortent. Le core n'a pas encore d'usage réel sur ce poste : ce que
   le cache ferait gagner ne servira qu'avec la semaine d'usage. Et le poids d'un vrai prompt d'aujourd'hui reste à
   lire : la tâche 3 le rend, par le décompte du fournisseur.
2. - [x] **Garder la mesure, par appel** (core). Le fournisseur rend les jetons relus avec son décompte ; le core note le
   temps entre l'envoi et le premier mot de texte. Les deux voyagent en champs facultatifs, pour ne casser aucun faux
   fournisseur des tests, et sont gardés sur la ligne de coût de l'appel, qui n'est jamais purgée (un tour avec outil
   fait deux appels : leurs temps ne s'additionnent pas). Preuve : tests sur un flux simulé ; les tests existants
   passent.
3. - [x] **Le relevé, à bras forcés** (core). Une commande joue quatre prompts contre le vrai modèle, en alternance,
   trente appels chacun, le premier de chaque bras jeté : (a) un prompt minuscule, le plancher du réseau ; (b) le vrai
   prompt avec un mot neuf en tête, donc jamais relu ; (c) le vrai prompt répété, donc relu ; (d) le vrai prompt, l'heure
   et la situation déplacées juste avant le dernier message de CrOliX. Le vrai prompt vient du vrai assemblage, postes
   déclarés reliés, fenêtre pleine, sans appel d'outil ; la commande réordonne elle-même, `service.ts` n'est pas touché.
   Elle rend la médiane et l'écart interquartile du premier mot, et les jetons relus. Moins de dix centimes, lancée
   par CrOliX ou avec son accord. Preuve : le relevé, écrit ici.
4. - [x] **La décision.** Écrite ici. On réordonne seulement si (d) gagne au moins 100 ms en médiane sur l'ordre
   actuel, et plus que l'écart interquartile. Sinon le chantier s'arrête, avec ce qu'il a appris : (a) contre (b) dit ce
   que pèse la lecture du prompt dans les 1130 ms.
5. - [ ] ~~**Réordonner, si la mesure le dit**~~ *(retirée : la mesure dit non, voir le relevé)* (core). L'heure et la situation passent juste avant le dernier message de
   CrOliX, qui reste le dernier lu, aux trois endroits où le core appelle le modèle (`service.ts:553`, `:620`, `:696`).
   Preuve : les tests qui fixent l'ordre sont repris (`service.test.ts`, `delegation.test.ts`, `situation.test.ts`) ;
   quelques dialogues de plusieurs tours, joués par la commande avec le vrai modèle, sont relus par CrOliX ; le relevé
   est refait.

## Le relevé du 10/11, et la décision

`npm run first-word` sur le laptop, modèle `gpt-6-luna`, vingt-neuf appels gardés par bras, joués en alternance.
Un bras de plus que prévu : « tel quel » rejoue l'ordre d'aujourd'hui avec l'heure et la situation qui changent à
chaque appel, pour le comparer à l'ordre proposé dans les mêmes conditions.

| Bras | Premier mot, médiane | Écart interquartile | Jetons d'entrée | Relus du cache |
|---|---|---|---|---|
| Minuscule (deux lignes, sans outil) | 1 095 ms | 317 ms | 20 | 0 |
| Neuf (le vrai prompt, un mot neuf en tête) | 1 193 ms | 313 ms | 2 956 | 0 |
| Répété (le vrai prompt, identique) | 1 311 ms | 392 ms | 2 945 | 2 942 |
| Tel quel (l'ordre d'aujourd'hui) | 1 231 ms | 417 ms | 2 950 | 0 |
| Réordonné (l'heure et la situation avant le dernier message) | 1 324 ms | 388 ms | 2 954 | 1 566 |

Ce que le relevé dit :

- **Le cache ne raccourcit pas le premier mot.** Un prompt entièrement relu (1 311 ms) n'arrive pas plus vite qu'un
  prompt entièrement neuf (1 193 ms) : l'écart est dans le bruit, et dans le mauvais sens.
- **Le prompt ne pèse presque rien dans l'attente.** Vingt jetons ou trois mille : 1 095 ms contre 1 193. Environ
  100 ms pour lire le prompt ; le reste, plus d'une seconde, est le plancher du modèle et du réseau.
- **Les 1 130 ms de l'essai du 07/11 sont ce plancher.** Aucun réglage du prompt ne les entame.
- **Aujourd'hui, rien n'est relu du cache** : dans l'ordre actuel, zéro jeton. Le fournisseur le rend bien dans son
  décompte en flux, et un vrai prompt pèse environ 2 950 jetons, fenêtre pleine.

**Décision : on ne réordonne pas.** Le gain mesuré de l'ordre proposé est de −93 ms en médiane, pour un écart
interquartile de 417 ms : la tâche 5 est retirée. Réordonner ferait relire 1 566 jetons au dixième du prix, soit
quelques centimes par mois : pas une raison de toucher à ce que Natsume lit en dernier.

**Ce que cela laisse comme leviers** pour le temps du premier mot, hors de ce chantier : le tour à l'essai (le modèle
travaille pendant le silence de fin de parole, jamais mesuré), un modèle ou une file plus rapides chez le fournisseur,
et le silence de fin lui-même. Tous se mesurent sur le desktop, avec la voix ; la mesure par appel livrée ici y servira.

Limites : un seul poste, une seule soirée, une seule connexion ; le prompt du relevé a deux postes reliés et une
fenêtre pleine de messages inventés, sans les outils de cartes ni les notes de la nuit.

## Hors périmètre

- **La fenêtre par paliers** : elle ne sert que les jours où la fenêtre se remplit (la tâche 1 dit combien), et elle
  touche ce que Natsume oublie. Un chantier à part, si la mesure le demande.
- **Compter les jetons relus à leur prix** : aucun critère ne le demande, et les jetons écrits ne se comptent pas.
- Le second appel d'une délégation, sans outils : il ne partage pas le début du premier, c'est voulu.
- Une file prioritaire du fournisseur (`service_tier`), une clé de cache : à essayer comme bras de la même commande si
  le relevé laisse une question.
- Le tour à l'essai et le silence de fin de parole (sur le desktop) ; changer de modèle ; Lun'Luxuria en mode seul.

## Ce que la relecture a changé

- Le diagnostic était faux : ce n'est pas l'heure qui casse le cache sur le fil principal, c'est la situation, à
  chaque tour.
- Après le relevé : la tâche 5 est retirée, et un bras « tel quel » a été ajouté à la commande.
- Le relevé prévu (vingt tours, deux espacements) ne pouvait pas distinguer un début relu d'un début neuf : quatre bras
  forcés, alternés.
- Le prompt d'une base vide n'est pas celui d'un vrai tour : postes reliés, fenêtre pleine.
- Les scènes de référence ne passent pas par l'assemblage du prompt : elles ne prouvaient rien pour la tâche 5.
- Un tour système après le dernier message de CrOliX changeait à qui elle répond : il passe juste avant.
- La fenêtre par paliers et le prix des jetons relus sortent du chantier.
- La mesure se garde par appel, pas par réponse.
