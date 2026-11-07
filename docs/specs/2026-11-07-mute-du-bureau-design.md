# Le mute du bureau : Natsume en retrait quand il se concentre. Spec

Date : 07/11/2026. Statut : à relire par CrOliX. Dépôts : `lun-luxuria` (l'essentiel), `lun-anima` (un champ de
présence), `lun-docs` (les specs qui se contredisaient).

## 1. L'intention

Quand CrOliX lance l'app du bureau, Natsume ne doit pas être « grande ouverte » à chaque fois. Il veut pouvoir la mettre
en retrait quand il a besoin de se concentrer : elle reste là, mais **tous ses sens sont coupés** et plus rien ne
remonte, sauf les urgences, selon une exception qu'il règle.

Ses mots, le 07/11 : « couper tout ses sens, plus remonter sauf d'éventuel urgence (exception paramétrable) ». Et la
différence avec la pause : « la pause du core pour carrément couper la circulation des infos dans l'éco, et le mute qui
est dédié à l'app desktop pour laisser le core tourner mais limiter l'interruption de Natsume quand j'ai besoin d'être
focus ».

## 2. Ce qui est décidé, et ce qui ne l'est plus

- **Deux interrupteurs, deux portées.** La **pause** (existante, core) coupe la circulation dans tout l'écosystème. Le
  **mute** (nouveau) ne vit que dans Luxuria : le core, les satellites, la nuit, le matin et le téléphone continuent
  comme d'habitude.
- **Les modes et les rôles passent après le MVP** (décision du 07/11). L'idée gardée : des fiches de rôle que CrOliX
  crée et édite, sur le modèle des assistants de Mia dans myLLM. Chaque fiche fixe une ligne directive posée sur le
  socle, les postes et outils offerts, la mémoire et le contexte, le modèle, ce qui passe, la voix et un mur vers le
  privé pour le stream. But : ne pas faire coûter Natsume à 100 % pour 40 % d'usage. Rien de cela n'est construit ici.
- Conséquence sur les specs : la ligne « modes » du J4 de la spec écosystème devient « mute du bureau » ; le §7.3
  (assistante, focus, silence) passe après le MVP avec les rôles ; la spec des notifications et le §6.6 de la spec
  Luxuria, qui disaient déjà « pas de modes au MVP », restent vrais.

## 3. Ce que fait le mute

**Muette**, Natsume :

1. **n'écoute plus** : aucune capture ne tourne, rien n'est transcrit, stocké ni payé. C'est la garde du bouton micro
   (§6.3 de la spec Luxuria), sans toucher à la préférence de ce bouton : enlever le mute rend le micro dans l'état où
   il était **[choix Claude]** ;
2. **ne prend plus la parole d'elle-même** : pas de rituel d'accueil, pas de courte phrase de retour, pas de parole
   spontanée ;
3. **ne répond plus** : le champ pour lui écrire et la touche à maintenir sont inactifs. Pour lui parler, on enlève le
   mute. Le fil du téléphone et l'app du core restent ouverts comme d'habitude **[choix Claude]** : c'est un geste
   délibéré ailleurs, pas une interruption au bureau ;
4. **laisse passer l'exception**, selon le réglage (§4).

Ce qui ne change pas : son corps reste affiché (scène ou petit mode), au repos. L'état `muette` s'affiche dans
l'étiquette, et le souffle reste celui du repos. Le core reste joint : `injoignable` et `plafond atteint` continuent
de s'afficher par-dessus.

**Le geste.** Un bouton dans la fenêtre, et une touche globale, réglable comme les deux autres (défaut proposé :
`Ctrl+Maj+M`) **[choix Claude]**. L'entrée de la zone de notification viendra avec le chantier du poste autonome
(`2026-11-07-poste-autonome-design.md`), qui la branche sur le même état.

**Il dure** jusqu'à ce qu'on l'enlève, et il **survit à un relancement** : comme le micro coupé, Natsume ne se
rallume jamais seule **[choix Claude]**. Pas de minuterie au MVP.

**En revenant**, rien ne rattrape ce qui a été tu : les messages sont dans le fil, le téléphone a eu ses
notifications. Pas de rituel au moment où on enlève le mute **[choix Claude]** ; il parle s'il veut.

## 4. L'exception

Les « urgences et échéances » existent déjà dans le core : un P0 et un rappel d'agenda sont annoncés par une phrase
fixe, sans modèle (`announceP0`, raison `p0`). L'exception porte sur eux, et sur eux seuls.

**L'exception, c'est le réglage qui existe déjà** : « Dit à voix haute : P0 » (§6.8, `speak.p0`) **[choix Claude]**.
Activé, le défaut, un P0 ou un rappel est dit pendant le mute comme en dehors, et rien d'autre ne sort. Coupé, il n'est
pas dit : il entre dans le fil en silence et part en notification sur le téléphone, comme en `occupée`. Un seul réglage
pour les deux cas, pas de nouvel écran. L'aide du réglage dit qu'il vaut aussi pendant le mute.

**Un P0 qui n'est pas dit part toujours sur le téléphone.** Ce n'est pas le cas aujourd'hui, et c'est un défaut corrigé
par ce chantier. Avec « P0 » coupé et sans appel en cours, Luxuria envoie `busy: false`. Le core dit la phrase (raison
`p0`) et retire la notification, puisqu'il le croit présent et libre. Luxuria ne la dit pas. L'urgence est perdue.
Désormais, Luxuria dit au core qu'elle ne dira pas d'annonce, par un champ à part (§5). `busy` reste fidèle à la
réalité : le core en fait aussi une phrase de contexte (« en vocal avec quelqu'un »), qui ne doit jamais mentir.

Un appel d'une autre appli (`occupée`) passe avant l'exception : en appel, un P0 n'est jamais dit, même muette.

## 5. Ce que le core reçoit

Le core sait déjà presque tout faire. Le signal `busy` coupe la parole spontanée et la voix d'un P0, qui part alors en
notification. `ritual: false` coupe l'accueil. Il manque deux choses : la parole spontanée doit se taire **sans** couper
la voix d'un P0, pour le réglage par défaut ; et un P0 non dit doit partir sur le téléphone sans faire croire à un appel.

- **Deux champs de présence nouveaux**, booléens, facultatifs, envoyés seulement quand ils valent vrai.
  `POST /api/presence` les accepte sur `started` comme sur `beat`, et les range par onglet comme `busy`. L'état vaut vrai
  si au moins un onglet vivant l'a envoyé.
  - `muted` : la parole spontanée ne part pas, donc aucun appel au modèle ;
  - `silentAnnounce` : Luxuria ne dira pas d'annonce. Le core traite alors un P0 ou un rappel comme en appel : la phrase
    entre dans le fil sans raison `p0`, et la notification part. Luxuria l'envoie quand « P0 » est coupé.
  Sans ces champs, rien ne change. `busy` garde son sens, un appel, et ses quatre lecteurs aussi : l'annonce, la file des
  notifications, la parole spontanée et la phrase de contexte.
- **Dès le `started`** : `presenceStart` range `busy`, `muted` et `silentAnnounce` reçus avec lui. Aujourd'hui il écrit
  `busy: false` jusqu'au premier battement, 30 s plus tard. Un P0 tombé dans ce trou serait dit sans être entendu.
- **L'accueil** : muette, chaque `started` de Luxuria part avec `ritual: false`, au lancement comme à une reprise du flux
  ou à un retour de veille.
- Le core ne connaît pas le réglage de l'exception : il reste au PC, comme les autres mécaniques de perception.
- **En mode seul** (sans serveur), la présence ne fait rien : le mute y coupe le micro et le champ, c'est tout.
- **Ordre de merge** : le core avant Luxuria. Le core refuse un champ inconnu (`z.strictObject`) ; un Luxuria qui envoie
  `muted` à un core sans ce chantier reçoit 400 sur sa présence.

## 6. Les buts, les non-buts, les anti-buts

**But.** En un geste, Natsume ne l'interrompt plus et ne consomme plus rien, sans fermer Luxuria et sans arrêter le
core, et une vraie urgence passe quand même.

**Non-buts** : les modes et les rôles ; un mute qui suivrait une appli au premier plan, un jeu ou l'heure ; une
minuterie ; un mute du téléphone (c'est le rôle de la plage de nuit des notifications) ; un résumé de ce qui a été tu.

**Anti-buts**, ce qui serait un échec même si ça marche :

- un micro qui capte pendant le mute, ou un mute qui se lève seul ;
- une urgence perdue : muette ou pas, un P0 finit au bureau ou sur le téléphone ;
- un mute qui coûte : un appel au modèle déclenché par Luxuria pendant le mute ;
- un réglage caché : l'état `muette` se voit toujours.

## 7. La recette

1. Muette, aucune capture ne tourne (le service voix ne reçoit rien), et le champ et la touche sont inactifs.
2. Muette au lancement : pas d'accueil, pas d'appel au modèle pour le rituel.
3. Parole spontanée activée et due : muette, elle ne part pas ; enlever le mute la laisse repartir à son heure.
4. Muette avec « P0 » activé, un P0 et un rappel sont dits. Avec « P0 » coupé, muette ou pas, ils ne sont pas dits,
   restent dans le fil et partent en notification (`sent` dans la file des notifications, pas `dropped`).
5. Muette et en appel : un P0 n'est pas dit.
6. Le mute survit à un relancement de Luxuria ; l'enlever rend le micro dans son état d'avant.
7. Un core sans ce chantier : Luxuria sans le mute se présente toujours (pas de régression).

## 8. Laissé au constructeur

Le nom exact des réglages et de l'état côté code, la place du bouton (point de design léger, au socle commun et à
l'accent de Luxuria), le libellé de l'étiquette.
