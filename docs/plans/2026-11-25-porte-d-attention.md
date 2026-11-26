# La porte d'attention : un seul endroit du core décide de ce qui parvient à CrOliX. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **PR :** à ouvrir dans Lun'Anima, en brouillon. **À valider par CrOliX.**
>
> **Issue :** Lun-Ecosystem/lun-anima#152, `niveau:critique`, privée. Chantier 4 du découpage de la carte des flux.
>
> **État : rédigé le 25/11 ; contesté le 25/11 ; amendé le 25/11** (« Ce que la contestation a changé »). **CrOliX
> a répondu le 25/11** (« Réponses de CrOliX, le 25/11 ») : les tâches sont écrites ainsi. **Relu contre le code le
> 26/11**, version amendée comprise (« Ce que la relecture du 26/11 a changé »).
>
> Code relu sur `main` de Lun'Anima (`d3afbf5`). Le graphe d'abord, puis chaque point dans le code. Lun'Anima est
> privé : ce plan dit le comportement, les critères, les tâches et les preuves. Les fichiers, les lignes, les noms,
> les bornes, la forme du registre, les textes du core et le détail des tests sont dans un commentaire de l'issue
> privée ([`securite.md`](../../standards/securite.md), « Dépôts publics »).

**But :** un seul endroit du core, en code et sans modèle, décide de ce qui parvient à CrOliX quand quelque chose
arrive. L'annonce à voix haute, la file des notifications, le Journal des événements et le rituel d'accueil lui
demandent leur sortie, et chaque arrivée laisse une ligne de trace. Le core lit enfin le palier et le regroupement
d'une carte. Aucun texte rendu ne change.

**Un seul endroit, pas encore tout.** La porte décide pour les événements des postes et du core, pour les cartes, et
pour la voix du rituel. Trois choses restent dehors, nommées, chacune avec le chantier qui la prendra : la parole
spontanée (chantier 8), les échéances lues par le core (chantier 6) et les écritures au Journal d'un acte, le sien ou
celui de Natsume (chantier 7). Deux réponses à un geste de CrOliX restent directes aussi : la phrase du retour rapide
et l'essai de notification. Et la porte décide la voix et la notification, pas l'affichage : l'accueil liste toujours
une urgence.

**Source :** l'issue, avec les réponses de CrOliX du 25/11 et les choix de la session. Le
[standard des notifications](../../standards/notifications.md), corrigé dans cette PR. Le
[contrat satellite](../../standards/contrat-satellite.md) (`importance` et `bulk` sur une carte, version 1.5). La spec
de la [carte des flux](../specs/2026-11-25-carte-des-flux-design.md) : § 5.2, § 10 (questions 1 et 2), § 11 étape 4,
§ 12. La contestation du 25/11.

**Critères de fin**, figés dans l'issue et complétés par CrOliX le 25/11, chacun prouvé en local :

1. **Un module unique décide** : une fonction pure reçoit l'arrivée et les entrées (présence, appel, réglage « Dit à
   voix haute : P0 », sourdine, pause, plage de nuit, palier), et rend la sortie et l'entrée qui l'a décidée.
   Tâche 1.
2. **Un test fixe la sortie de chaque palier** (P0 à P4) pour chaque combinaison d'entrées : le tableau du standard
   et les réponses de CrOliX. P0 dit malgré la sourdine, jamais en appel ni pendant la plage de nuit ; P1 insensible
   à la sourdine ; P2 sans notification ; P3 à la lettre ; en pause, seules une urgence et une alerte de santé du core
   sortent. Tâche 1.
3. **Les sorties passent par la porte** : l'annonce, la file des notifications, le Journal des événements, et la voix
   du rituel d'accueil. Une garde échoue si l'une d'elles décide ailleurs. Les écritures directes qui restent sont
   listées avec leur raison. Tâches 3 à 8.
4. **Chaque arrivée laisse une ligne de trace** : ce qui est arrivé, la sortie choisie, l'entrée décisive. Un test de
   rejeu la lit. Tâches 2 et 9.
5. **Le core lit `importance` et `bulk` sur les cartes** : une carte `low` ne notifie pas et compte dans la pastille ;
   `normal`, `urgent` ou sans `importance`, elle suit son palier (P1 par défaut) ; `bulk` la rend groupable, jamais
   si elle a `sends` ou `options`. Tâche 6.
6. **Une urgence déjà notifiée ne l'est pas de nouveau après un redémarrage.** Tâches 0 et 9.
7. **Une urgence ancienne au bureau** s'écrit au fil sans être dite, et la trace dit pourquoi. Tâches 1 et 4.
8. **Le rituel d'accueil**, pendant la plage de nuit, ne dit pas une urgence à voix haute et compte les cartes P2 au
   lieu de les nommer. Le jour, rien ne change. Tâche 7.
9. **Aucun texte rendu ne change.** Toutes les tâches.
10. **Toutes les barrières de Lun'Anima sont vertes à chaque tâche**, et le comportement existant hors de ces règles
    est inchangé. Tâche 0, puis chaque tâche.
11. **Preuve sans NAS** : un rejeu local, sans réseau, montre la trace d'un lot d'arrivées de P0 à P4 et de cartes
    `low`, `normal` et sans `importance`. Tâche 9.
12. **Le standard des notifications dit ce que fait le code** : les deux cas où le code l'emporte, la plage de nuit,
    la pause et « attendre ». Dans la PR lun-docs.

| Dépôt                                                  | Branche                     | Issue                       | Niveau     |
| ------------------------------------------------------ | --------------------------- | --------------------------- | ---------- |
| `lun-anima` : 11 tâches (0 à 10), une PR               | dans l'issue privée         | Lun-Ecosystem/lun-anima#152 | `critique` |
| `lun-docs` : ce plan, le standard, la feuille de route | `docs/plan-porte-attention` | la même                     | `standard` |

**Le niveau.** `critique`, celui de l'issue. Le core tourne en continu sur le NAS : une régression empêcherait une
urgence de partir, ou ferait sonner le téléphone pendant la plage de nuit. Chaque comportement changé a son test,
écrit d'abord par le testeur ; chaque comportement gardé a sa garde, verte sur `main`
([`workflow.md`](../../standards/workflow.md)). Une base change : une table de plus, sans toucher aux autres. Aucun
écran, aucune route, aucun contrat ne change. Pas de Chrome. La PR lun-docs passe en `standard` : elle corrige un
standard.

## Ce que le code fait aujourd'hui

### Cinq endroits décident chacun de leur côté

- **L'annonce à voix haute.** Une urgence d'un poste, neuve et récente, est écrite au fil de la conversation si
  CrOliX est à son bureau. Elle y est dite, sauf en appel ou si le bureau a coupé « Dit à voix haute : P0 ». La
  sourdine ne l'arrête pas. Absent, rien n'est écrit. Une urgence qui arrive en retard, au rejeu d'un poste, n'est ni
  dite ni écrite. **La plage de nuit n'est pas lue** : une urgence à 2 h du matin, bureau ouvert, est dite.
- **La file des notifications.** Elle prend les événements `urgent` et `normal` et **toutes les cartes en attente**,
  une fois chacun, sous une clé qui ne revient jamais. À l'envoi, elle relit la présence : au bureau, une urgence dite
  ne part pas, et rien de `normal` ne part. Une urgence part seule ; le reste se groupe par type après quelques
  minutes, toujours sans son. La plage de nuit ne règle que le son d'une urgence. Un réglage par poste, « les alertes
  urgentes en direct », retire ses urgences de la file.
- **Le Journal des événements.** Tout événement reçu ou émis par le core y entre, sauf `log`, dans la même écriture
  que l'événement. Un échec de routine n'y entre pas : la ligne de la routine le porte déjà.
- **Le rituel d'accueil.** Quand CrOliX arrive à son PC, Natsume lui parle d'elle-même, à voix haute. Le core lui
  donne les urgences et les cartes en attente : celles arrivées depuis ce qu'elle a dit en dernier sont nommées, les
  autres comptées. Il ne lit ni la plage de nuit, ni le palier d'une carte. Une ligne d'urgence écrite au fil compte
  comme ce qu'elle a dit en dernier.
- **La parole spontanée.** Elle relit la présence, l'appel et la sourdine, au battement du bureau.

**Aucun ne trace son choix.** Ce qui a été dit, notifié ou retenu ne se lit qu'en recoupant le fil, la file et le
Journal.

### Trois écarts au standard

- **Le core ignore `importance` et `bulk` sur une carte.** Le type de la carte ne les porte pas, et la lecture des
  cartes les retire en silence. Toute carte en attente notifie, y compris les propositions de tri que Lun'Acedia 1.5
  marque `low`.
- **La plage de nuit ne règle que le son du téléphone.** Elle ne retient pas la voix.
- **La pause n'est lue par aucune sortie.** Elle n'est lue que par l'état affiché, la bande et le relais vers les
  postes.

### Ce qui tient déjà

- **Une seule fois.** Un événement s'insère une fois ; un rejeu à la reconnexion n'est ni « neuf », ni dit, ni écrit
  deux fois au Journal. La file ne remet jamais une clé déjà envoyée : un redémarrage ne renvoie rien. Des tests le
  gardent déjà.
- **Les cartes au Journal.** Une carte en attente entre au Journal une fois, à sa première lecture, quel que soit ce
  qu'elle porte.
- **La pastille.** Elle compte toutes les cartes en attente, quel que soit leur palier.
- **Les événements du core** ne sont jamais `urgent` aujourd'hui : aucun n'est dit.

### Les écritures directes au Journal

Hors des événements et des cartes, neuf endroits créent une ligne au Journal sans rien décider de ce qui parvient à
CrOliX. Ils notent un acte, le sien ou celui de Natsume : un changement de pause, une routine passée ou sautée, un
geste « plus tard », une délégation, un réglage, une liaison ou une déliaison, un geste ignoré, un geste sur une carte
sans entrée, la reprise de l'historique.

Quatre autres **ajoutent une étape** à une ligne qui existe : une carte tranchée dans le front de son poste, les
cartes rendues par une délégation, un geste sur une carte, une urgence vue. Aucun de ces treize endroits ne notifie,
aucun ne parle.

## Les choix

### La fonction pure

Elle reçoit **une arrivée** et **un relevé des entrées**, et rend **une décision**. Rien d'autre : ni base, ni
horloge, ni réseau.

- **L'arrivée** : sa nature (un événement ou une carte), sa source (un poste, ou le core), son type, son
  `importance`, **son âge**, et pour une carte `bulk`, `sends` et `options`. L'âge est calculé par l'appelant, qui
  seul connaît l'heure de réception.
- **Le relevé des entrées** : la présence au bureau, l'appel, la sourdine, le réglage « Dit à voix haute : P0 », la
  pause, la plage de nuit, et le réglage « les alertes urgentes en direct » du poste source. Il est lu en un seul
  endroit, à côté de la fonction, et passé tel quel.
- **La décision** : le palier ; la voix (à voix haute, écrite au fil sans voix, ou rien) ; la notification (avec son,
  sans son, ou rien) ; attendre le bon moment ; la lettre ; le Journal ; groupable ; la façon dont le rituel la
  mentionne (nommée ou comptée) ; et **l'entrée décisive**.
- **Une seule entrée décisive suffit** : celle qui a fixé la voix et la notification. Le relevé entier est gardé avec
  elle dans le registre : ce qu'auraient fait les autres entrées se reconstitue.

**Le palier** vient de `importance` : `urgent` P0, `normal` P1, `low` P2, `info` P3, `log` P4. Une carte sans
`importance`, ou avec une valeur inconnue, vaut P1.

### Le tableau de la porte

Lu de haut en bas : la première ligne qui s'applique décide.

| Palier                                       | Entrées                                    | Voix          | Notification | Autres sorties    | Entrée décisive  |
| -------------------------------------------- | ------------------------------------------ | ------------- | ------------ | ----------------- | ---------------- |
| P4                                           | toutes                                     | rien          | rien         | rien              | le palier        |
| P1, P2, P3, sauf une alerte de santé du core | pause                                      | rien          | rien         | Journal           | la pause         |
| P0                                           | plage de nuit                              | écrite au fil | sans son     | Journal           | la plage de nuit |
| P0                                           | au bureau, en appel                        | écrite au fil | avec son     | Journal           | l'appel          |
| P0                                           | au bureau, « Dit à voix haute : P0 » coupé | écrite au fil | avec son     | Journal           | le réglage P0    |
| P0                                           | au bureau, arrivée ancienne                | écrite au fil | rien         | Journal           | l'ancienneté     |
| P0                                           | au bureau, sourdine ou non                 | dite          | rien         | Journal           | la présence      |
| P0                                           | absent                                     | rien          | avec son     | Journal           | l'absence        |
| P1                                           | au bureau, sourdine ou non                 | rien          | rien         | Journal           | la présence      |
| P1                                           | absent                                     | rien          | sans son     | Journal           | le palier        |
| P2                                           | toutes                                     | rien          | rien         | attendre, Journal | le palier        |
| P3                                           | toutes                                     | rien          | rien         | lettre, Journal   | le palier        |

**Une alerte de santé du core** : un crash, une sauvegarde ratée, une clé refusée ou un crédit épuisé, une
conversation qui ne peut plus répondre, une clé qui expire, un poste injoignable, un plafond atteint. En pause, elle
suit le tableau comme hors pause. **Il n'y a qu'une pause**, posée par CrOliX ou par le plafond. La conversation qui
ne peut plus répondre s'ajoute à la liste de CrOliX du 25/11 : le core la range déjà avec la clé refusée (relecture
du 26/11, à valider avec le plan).

**Une arrivée ancienne** : une urgence reçue plus de quelques minutes après son heure, au rejeu d'un poste par
exemple, ou dont l'heure ne se lit pas. La borne est celle de l'annonce d'aujourd'hui.

Quatre règles s'ajoutent, après le tableau :

- **« Les alertes urgentes en direct » coupé** pour le poste source : une urgence ne notifie pas, événement ou carte ;
  l'entrée décisive devient ce réglage. La voix ne change pas, comme aujourd'hui.
- **Une carte n'est jamais dite** : elle attend un geste, et ses mots sont sur la carte. Une carte P0 notifie seule,
  sans son pendant la plage de nuit, avec son sinon, **au bureau compris** ; l'entrée décisive est « la carte », ou la
  plage de nuit.
- **Toute carte entre au Journal**, quel que soit son palier, comme aujourd'hui.
- **Un échec de routine du core** n'entre pas au Journal : la ligne de la routine le porte déjà, comme aujourd'hui.

**Groupable** veut dire : entre dans la validation groupée. Une carte `bulk` sans `sends` ni `options` l'est ; rien
d'autre. Ce chantier le décide et le trace ; le chantier 5 lira cette valeur de la porte, sans en définir une autre.
Le regroupement des notifications par type ne change pas.

**Le rituel.** Le jour, il nomme et compte comme aujourd'hui. Pendant la plage de nuit, une urgence est comptée, pas
nommée : elle est déjà écrite au fil. Une carte P2 ou plus bas est comptée, pas nommée.

**Ce que le tableau change**, et rien d'autre :

- une urgence pendant la plage de nuit n'est plus dite ; elle s'écrit au fil même absent, et part sans son, au
  bureau compris, où rien ne partait ;
- **un rappel d'agenda suit la même règle** : pendant la plage de nuit, il n'est plus dit, même au bureau ;
- une urgence ancienne au bureau s'écrit au fil, sans être dite ;
- en pause, seules une urgence et une alerte de santé du core notifient ;
- une carte `low`, `info` ou `log` ne notifie plus ; une carte `urgent` notifie seule, avec son, sauf la nuit ;
- pendant la plage de nuit, le rituel compte les urgences et les cartes P2 ;
- au matin, le rituel nomme encore une urgence **arrivée depuis 5 h**, le début de la journée de Natsume : la ligne
  écrite au fil la nuit ne compte pas comme ce qu'elle a dit en dernier. Une urgence d'avant 5 h n'est plus dans ce
  que lit le rituel, comme aujourd'hui : elle reste écrite au fil (« Limites »).

Tout le reste est le comportement d'aujourd'hui, ligne à ligne.

### Comment les sorties l'appellent

- **Le Journal des événements.** À l'insertion d'un événement, d'un poste ou du core, dans la même écriture et sous
  un point de sauvegarde : le relevé, la décision, la ligne de trace, puis la ligne du Journal si la décision la
  demande. Un rejeu ne décide rien : il n'insère rien.
- **L'annonce.** Elle reçoit la voix décidée à l'insertion, par le signal qui la prévient déjà d'une urgence neuve,
  et l'exécute. Elle ne lit plus ni la présence, ni l'appel, ni le réglage, ni l'âge.
- **La file des notifications.** Elle prend ce dont le palier peut notifier (P0 et P1). À chaque passage, elle
  redemande la décision avec le relevé du moment : la présence change entre l'arrivée et l'envoi, et c'est le
  comportement d'aujourd'hui. Le relevé se lit une fois par poste et par passage, et la même décision sert à retirer
  puis à envoyer. Elle garde ses contrôles de validité : trop ancienne, déjà vue, déjà tranchée, cachée,
  disparue. Le son d'un envoi vient de la décision. Quand une ligne de la file se termine, elle laisse sa ligne de
  trace d'envoi, avec **sa propre raison** : envoyée, ou retirée par la porte (et l'entrée), ou retirée parce que
  trop ancienne, vue, tranchée, cachée ou disparue.
- **Les cartes.** À la première lecture d'une carte en attente, là où elle entre au Journal comme aujourd'hui : la
  décision et sa trace. La file prend les cartes que la porte classe P0 ou P1.
- **Le rituel d'accueil.** Pour chaque urgence et chaque carte qu'il va mentionner, il demande à la porte si elle est
  nommée ou comptée. Ce qu'elle a dit en dernier ne compte plus les lignes d'urgence écrites au fil pendant la plage de
  nuit. Le rituel n'est pas une arrivée : il ne laisse pas de trace.

**Les textes ne bougent pas** : les deux phrases de l'annonce, les titres, les corps et les liens des notifications,
les lignes du Journal et le bloc du rituel restent ceux d'aujourd'hui. La porte ne rend aucun texte.

### Les replis : une panne de la porte ne coûte jamais une urgence

- **À l'insertion.** Le relevé, la décision et la trace s'écrivent sous un point de sauvegarde, pour un événement
  d'un poste comme du core, sur le modèle de ce que fait déjà l'entrée des cartes au Journal. S'ils échouent, le point
  est annulé, l'événement est gardé et écrit au Journal comme aujourd'hui (un échec de routine du core reste dehors),
  l'échec va au journal du core, et une urgence s'écrit au fil sans voix. Le flux du poste ne s'arrête jamais pour la
  porte.
- **À la file.** Si le relevé ne se lit pas, une urgence part quand même : avec son, sauf si la plage de nuit, elle,
  se lit et dit qu'elle y est. Le reste attend le passage suivant. L'échec est écrit une seule fois au journal du
  core, jusqu'à ce que le relevé se lise de nouveau.
- **À la fin d'un envoi.** La fin de chaque ligne s'écrit d'abord, sa trace d'envoi ensuite. Une panne de cette trace
  va au journal du core et ne remet aucune ligne en file : une urgence envoyée ne repart pas au passage suivant.

### Le registre de trace

**Une table technique à part**, ajoutée par une migration, sans toucher aux autres (choix de la session, gardé).

- **Une ligne par arrivée et par étape** : l'arrivée, puis la fin de son envoi quand elle est passée par la file. Une
  clé unique sur la paire : un redémarrage ou un rejeu n'en ajoute pas.
- **Ce qu'elle dit** : ce qui est arrivé (sa clé, sa source, son type, son palier), la décision, l'entrée décisive et
  le relevé des entrées ; à l'envoi, la raison de la fin. La forme exacte est dans l'annexe privée.
- **Ce qu'elle ne porte pas** : ni titre, ni texte, ni ligne d'une carte. Un titre peut être l'objet d'un mail ; il
  se lit à sa source, par la clé.
- **Une borne de durée** : les lignes trop anciennes partent à l'écriture suivante.
- **Comment elle se lit en prod** : une commande du core, en lecture seule, lancée dans son conteneur comme les
  autres commandes du core sur le NAS, liste les dernières lignes. Aucun écran ne la lit ; le Journal reste la forme
  lue par CrOliX, et sa forme est le chantier 7.

### La garde

Un test parcourt les sources du core, comme la garde des noms de fournisseurs. **Elle vise la décision** : qui lit
les entrées de rendu, et qui écrit au Journal.

- **Les entrées de rendu** (la présence et ses drapeaux, la plage de nuit, la pause, le réglage des urgences en
  direct) ne se lisent que dans une liste de fichiers permis, chacun avec sa raison : la porte, les sources de ces
  entrées, les écrans d'état, la situation donnée au modèle, la parole spontanée. L'annonce, la file, le Journal des
  événements, les cartes et le rituel n'y sont pas. Chacun appelle la porte, sauf l'annonce : elle exécute la voix
  décidée à l'insertion et ne lit plus aucune entrée, ce que la garde vérifie.
- **La création d'une ligne au Journal** ne se fait que depuis une liste de fichiers permis : la porte, les cartes et
  les exceptions nommées ci-dessous. L'écriture d'un événement au Journal n'est appelée qu'après une décision.
- **Elle ne peut pas passer à tort** : une liste vide, un fichier permis qui n'existe plus, aucun fichier lu, la font
  échouer.
- **Elle s'écrit en dernier**, quand les sorties passent déjà par la porte : les barrières restent vertes à chaque
  tâche.

### Les exceptions nommées

Toutes passent au chantier 7, qui récrit le Journal. Aucune ne notifie ni ne parle.

| Écriture                                      | Pourquoi elle reste directe                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Un changement de pause                        | Un état du core, souvent un geste de CrOliX ; rien n'arrive de dehors              |
| Une routine passée ou sautée                  | Le travail de Natsume, pour « Ce que j'ai fait »                                   |
| Un geste « plus tard »                        | Le geste de CrOliX lui-même                                                        |
| Une délégation, et les cartes qu'elle rend    | Le travail de Natsume, avec son coût                                               |
| Un réglage                                    | Le geste de CrOliX lui-même                                                        |
| Une liaison, une déliaison                    | Le geste de CrOliX lui-même                                                        |
| Un geste ignoré                               | La trace d'un geste de CrOliX, sans un mot de son message                          |
| Un geste sur une carte, avec ou sans entrée   | Le geste de CrOliX ; l'entrée de la carte se crée avec lui au besoin               |
| Une carte tranchée dans le front de son poste | Une étape de la carte, pas une arrivée                                             |
| Une urgence vue                               | Une étape de l'urgence, son geste à lui                                            |
| La reprise de l'historique                    | Une reprise unique d'anciennes lignes, à l'installation                            |
| La parole spontanée                           | Pas une arrivée : elle vient de Natsume ; elle passe à la porte au chantier 8 (P2) |

**P4 reste hors du Journal**, comme aujourd'hui, sauf pour une carte (choix de la session, gardé).

### Le rejeu local

Il **reprend le banc de la tâche 0** : une base en mémoire, les vrais chemins d'arrivée, un faux service de
notifications, sans réseau ni NAS. Un lot (un événement par palier de P0 à P4, d'un poste et du core, dont une alerte
de santé ; une urgence ancienne ; des cartes `low`, `normal`, `urgent` et sans `importance`, dont une `bulk` avec
`sends`) passe sous cinq relevés : absent le jour, au bureau, en appel, plage de nuit, pause. La file passe. Le
registre est lu par la commande de prod et comparé à un tableau écrit en toutes lettres, qui se lit dans la PR. Puis
un redémarrage de la file et un rejeu du flux : aucune ligne nouvelle.

### L'ordre de déploiement

**Le core d'abord, Lun'Acedia 1.5 ensuite** (tranché par CrOliX le 25/11). Un core d'avant ce chantier ignore
`importance` : chaque proposition de tri d'Acedia 1.5 y notifierait. La feuille de route le dit aussi.

## Tâches

**Barrières de chaque tâche** : celles de Lun'Anima, build compris, dans l'issue privée, vertes à la fin de chaque
tâche. Les tests
de comportement s'écrivent d'abord et sont rouges sur `main` ; les gardes, vertes sur `main`, fixent ce qui ne doit
pas bouger. Chaque test dit lequel il est. Chaque tâche passe par le `reviewer` avant la suivante. Les fichiers, les
noms et le détail des tests sont dans l'issue privée.

0. - [ ] **La matrice d'aujourd'hui** (`testeur`). **D'abord, avant toute autre tâche.**
   - **Une garde verte sur `main`**, sur les seuls relevés atteignables (l'appel, le réglage P0 et la sourdine
     n'existent qu'au bureau) : pour chaque palier, d'un poste et du core, elle relève la ligne du fil et sa voix, la
     notification (titre, corps, lien, son) et la ligne du Journal (titre, étapes). Les cartes, avec et sans présence.
     Le rituel, de jour et pendant la plage de nuit, puis le matin d'après. La garde de jour du rituel est neuve : les
     tests d'aujourd'hui ne fixent ni une urgence nommée, ni la coupe des nouveautés, ni les piles.
   - **Un fichier par sortie** : le fil, les notifications, le Journal, le rituel. Chaque voie ne change que les
     siens : deux voies en parallèle n'éditent jamais le même fichier.
   - **Ses attendus suivent le tableau de la porte.** Les cases où le code d'aujourd'hui en diffère portent sa valeur
     d'aujourd'hui, sont marquées, et nomment la tâche qui les change. Chaque tâche change ses cases et aucune autre ;
     leur diff se relit à la revue.
   - **Le redémarrage** : une urgence notifiée, puis une nouvelle file et un rejeu du flux : ni seconde notification,
     ni seconde annonce, ni seconde ligne au Journal.
   - **La plage de nuit** : sur une plage entière, une urgence neuve à chaque pas et la file qui passe : aucune
     notification avec son, au bureau comme absent. Absent, aucune annonce dite. Au bureau, l'annonce est encore dite
     aujourd'hui : cette case est marquée pour la tâche 4.
   - Le banc de cette tâche, rangé avec les aides de test, sert au rejeu de la tâche 9. Seule la voie A le retouche,
     pour le signal de l'annonce.
   - Exclu : tout code de production.
1. - [ ] **La fonction pure et son tableau** (`testeur`, puis `dev-core`). **En parallèle de la tâche 6a.**
   - Tests rouges sur `main` : chaque ligne du tableau de la porte, pour chaque combinaison atteignable des entrées,
     avec sa voix, sa notification, ses autres sorties, sa mention au rituel et son entrée décisive. Les quatre règles
     d'après le tableau. Une alerte de santé du core en pause. Une urgence ancienne, au bureau et absent. Le palier
     d'une carte sans `importance` ou à valeur inconnue. Groupable : `bulk` seul oui ; avec `sends` ou `options`, non.
   - Garde : la fonction ne lit ni base, ni horloge ; deux appels égaux rendent la même décision.
   - Code : la fonction pure et ses types, dans un module à elle. Rien ne l'appelle encore.
   - Exclu : le relevé, la trace, tout branchement.
2. - [ ] **Le relevé, le registre et sa lecture** (`testeur`, puis `dev-core`). **Après la tâche 1, même worktree.**
   - Tests rouges sur `main` : le relevé lit chaque entrée depuis la base, la plage de nuit comprise à cheval sur
     minuit, la pause quelle que soit sa cause ; la trace écrit une ligne par arrivée et par étape, une seule même
     appelée deux fois, sans titre ni texte ; les lignes trop anciennes partent ; la migration ajoute la table sur une
     base existante, sans toucher aux autres ; la commande de lecture liste les dernières lignes et n'écrit rien.
   - Gardes : la lecture de la plage de nuit garde ses tests d'aujourd'hui, déplacés avec elle ; les migrations
     d'avant ne changent pas. Un test d'aujourd'hui suppose que sa migration est la dernière : il est récrit pour la
     viser par son numéro d'ordre.
   - Code : le relevé des entrées, l'écriture de trace, la migration, la commande de lecture.
   - Exclu : tout branchement aux sorties.
3. - [ ] **Le Journal des événements par la porte** (`testeur`, puis `dev-core`). **Après la tâche 2. Voie A.**
   - Tests rouges sur `main` : un événement reçu et un événement du core laissent une ligne de trace d'arrivée ; en
     pause, un événement `normal` entre au Journal et la trace dit « la pause » ; une alerte de santé en pause dit
     autre chose ; une panne de la trace ne coûte ni l'événement, ni sa ligne au Journal, ni le flux du poste, et va
     au journal du core, pour un événement d'un poste comme du core ; dans cette panne, un échec de routine du core
     reste hors du Journal.
   - Gardes : les tests d'écriture au Journal restent verts tels quels ; la matrice de la tâche 0 ne bouge pas ; un
     échec de routine venu d'un poste entre au Journal comme aujourd'hui.
   - Code : l'insertion d'un événement, d'un poste ou du core, calcule l'âge et demande la décision sous un point de
     sauvegarde, puis écrit la ligne du Journal si la décision la demande. L'insertion rend la décision, ou rien pour
     un rejeu. Celui qui reçoit le flux d'un poste suit ce retour dans la même tâche, sans changer de comportement :
     le typage reste vert.
   - Exclu : l'annonce, la file, les cartes, les textes du Journal.
4. - [ ] **L'annonce par la porte** (`testeur`, puis `dev-core`). **Après la tâche 3, même worktree.**
   - Tests rouges sur `main` : une urgence pendant la plage de nuit, au bureau puis absent : écrite au fil, pas dite ;
     un rappel d'agenda pendant la plage de nuit, pareil ; une urgence ancienne au bureau : écrite au fil, pas dite ;
     une panne à l'insertion : écrite au fil, pas dite ; au matin, une urgence arrivée après 5 h et écrite au fil au
     bureau pendant la plage de nuit est nommée par le rituel.
   - Gardes : les tests de l'annonce d'aujourd'hui restent verts, sauf deux : celui de l'urgence ancienne change de
     sens par la réponse de CrOliX (marqué dans la matrice) ; celui de la panne d'annonce change de forme, son signal
     portant désormais la voix décidée. Au matin, une urgence arrivée après 5 h, CrOliX absent, reste nommée comme
     aujourd'hui.
   - Code : le signal d'une urgence neuve porte la voix décidée ; l'annonce l'exécute, sans plus rien relire. Ce que
     Natsume a dit en dernier écarte les lignes d'urgence écrites pendant la plage de nuit : sans cela, la ligne
     écrite la nuit ferait compter l'urgence au matin au lieu de la nommer. Le banc de la tâche 0 suit le signal.
   - Exclu : la parole spontanée, ce que le rituel nomme ou compte (tâche 7), la file, le texte des deux phrases.
5. - [ ] **La file des notifications par la porte** (`testeur`, puis `dev-core`). **Après la tâche 2. Voie B, en
         parallèle de la voie A.**
   - Tests rouges sur `main` : une urgence pendant la plage de nuit, au bureau : part sans son ; en pause, un
     `normal` ne part pas, une urgence et une alerte de santé partent ; chaque ligne terminée laisse sa trace d'envoi
     avec sa propre raison ; **le repli** : relevé illisible, une urgence part avec son, ou sans son si la plage de
     nuit se lit et y est ; un `normal` attend le passage suivant ; l'échec n'est écrit qu'une fois ; **une panne de
     la trace d'envoi** après un envoi : rien ne repart au passage suivant.
   - Gardes : les tests de la file d'aujourd'hui restent verts tels quels.
   - Code : la file prend ce que la porte classe P0 ou P1, retire ce dont la décision du moment ne notifie plus, tient
     le son de la décision, et écrit sa trace d'envoi. Ses contrôles de validité ne bougent pas.
   - Exclu : le regroupement par type, les textes des notifications, le poste injoignable.
6. - [ ] **Les cartes lues avec leur palier** (`testeur`, puis `dev-core`). **6a en parallèle de la tâche 1 ; 6b
         après la tâche 5, voie B.**
   - **6a, la lecture.** Tests rouges sur `main` : une carte lue, puis relue là où le core la garde, porte
     `importance` et `bulk` ; une valeur inconnue ou mal formée de l'un d'eux est absente, sans faire échouer la
     lecture des autres cartes. Garde : une carte d'un poste 1.4, sans ces champs, se garde comme aujourd'hui. Code :
     le type et la lecture de la carte, et le type de la carte côté écran, avec ces deux champs facultatifs.
   - **6b, la trace et la file.** Tests rouges sur `main` : une carte `low` ne notifie pas et compte dans la pastille ;
     `normal` et sans `importance` notifient comme aujourd'hui ; `urgent` part seule, avec son au bureau compris, sans
     son la nuit, et n'est pas dite ; si « les alertes urgentes en direct » est coupé pour son poste, elle ne notifie
     pas ; `info` et `log` ne notifient pas ; une première lecture laisse une ligne de trace d'arrivée.
   - Gardes de 6b : les tests des cartes au Journal restent verts tels quels ; toute carte entre au Journal ; la
     pastille compte toutes les cartes en attente.
   - Code de 6b : la première lecture d'une carte demande la décision et la trace ; l'entrée au Journal ne change pas.
     La file prend les cartes que la porte classe P0 ou P1.
   - Exclu : la validation groupée et la correction (chantier 5), la forme des piles à l'écran.
7. - [ ] **Le rituel par la porte** (`testeur`, puis `dev-core`). **Après la tâche 4, même worktree, et après 6a.
         Voie A.**
   - Tests rouges sur `main` : pendant la plage de nuit, une urgence est comptée, pas nommée ; une carte P2 est
     comptée, pas nommée.
   - Gardes : de jour, le bloc du rituel est le même qu'aujourd'hui, mot pour mot, pour les urgences et les cartes de
     tous paliers ; le retour rapide ne change pas ; le matin de la tâche 4 ne bouge pas.
   - Code : le rituel demande à la porte, pour chaque urgence et chaque carte, nommée ou comptée.
   - Exclu : la consigne du rituel, son texte, les échéances à venir.
8. - [ ] **La garde de la porte** (`testeur`). **En dernier, après les tâches 3 à 7.**
   - La garde du § « La garde », sur les sources du core seules. Chaque fichier permis dit sa raison dans le test.
     Elle échoue sur une liste vide, un fichier permis disparu, aucun fichier lu. Pour l'annonce, elle vérifie
     qu'aucune entrée n'y est lue et que la voix vient du signal.
   - Exclu : tout code de production.
9. - [ ] **Le rejeu local** (`testeur`). **Après les tâches 3 à 7, en parallèle de la tâche 8.**
   - Le test du § « Le rejeu local », sur le banc de la tâche 0. Sa sortie, lisible, va dans la PR.
   - Exclu : tout code de production.
10. - [ ] **La revue et la livraison** (`reviewer`, puis `livreur`). **Après 0 à 9.** Le diff relu contre ce plan
          et les standards ; le diff de la matrice de la tâche 0 relu case par case, la case « urgence de nuit, au
          bureau » après la fusion des voies A et B. Une PR Lun'Anima en brouillon, qui
          ferme Lun-Ecosystem/lun-anima#152, avec les tests rouges devenus verts, la suite entière, les barrières et la
          sortie du rejeu. Ce plan coché, le standard et la feuille de route dans la PR lun-docs du chantier. Après la
          fusion, le graphe mis à jour.

**L'ordre et le parallèle.**

- La tâche 0 part seule, d'abord : toutes les autres changent ses cases, ou la gardent.
- Ensuite, en parallèle : la tâche 1 (la fonction pure) et la tâche 6a (la lecture des cartes). Aucun fichier commun.
- La tâche 2 suit la tâche 1, dans le même worktree.
- Après la tâche 2, **deux voies** :
  - **A** : les tâches 3, 4 puis 7, un seul `dev-core`, un worktree : l'insertion, son signal, puis le rituel. Le
    rituel suit l'annonce : la ligne qu'elle écrit au fil la nuit déplace ce que lit le rituel du matin.
  - **B** : la tâche 5 puis la tâche 6b, un `dev-core` à part : la file, puis les cartes qui y entrent.
- La voie A change les fichiers du fil et du rituel de la matrice, et le banc pour le signal seul ; la voie B, celui
  des notifications. Aucun fichier commun.
- Les voies se fusionnent dans la branche du chantier. Puis les tâches 8 et 9 en parallèle, puis la revue et le
  livreur.
- Entre la fusion de la voie A et celle de la voie B, une urgence de nuit au bureau est écrite au fil sans partir
  encore sur le téléphone. L'état n'est juste qu'après les deux, et rien n'est livré avant.

**Comment chaque tâche garde le comportement vert.**

- **La matrice de la tâche 0** est la seule mesure de « rien d'autre ne bouge ». Chaque tâche ne change que les
  cases marquées pour elle ; une case de plus est un refus à la revue.
- **Les tests d'aujourd'hui restent tels quels.** Une tâche qui en change un dit lequel et pourquoi dans son rapport.
  Seuls changent : ceux qui lisent le retour de l'insertion d'un événement et celui de la panne d'annonce (de forme,
  pas de sens) ; celui qui rejoue la dernière migration (de forme) ; celui de l'urgence ancienne (de sens, par la
  réponse de CrOliX).
- **L'urgence d'abord.** Les trois replis ont leurs tests : à l'insertion dans les tâches 3 et 4, à la file et à la
  fin d'un envoi dans la tâche 5.
- **La plage de nuit** : le test de la tâche 0 tourne à chaque tâche ; aucune notification avec son, et, à partir de
  la tâche 4, aucune annonce dite.
- **La garde vient en dernier** : aucune tâche ne laisse une barrière rouge.
- **Le déploiement** : une seule version, une table de plus, aucune colonne changée. Les migrations du core sont
  comptées par leur rang : revenir à l'image d'avant laisse la table sans lecteur, sans rien casser ; mais la
  migration de ce chantier ne doit plus jamais être retirée ni déplacée du code, sinon la migration suivante serait
  sautée sur la base du NAS.

## Ce que la contestation a changé

Chaque point repris tel quel, et vérifié dans le code quand il en parle.

1. **Les replis** (B2) : la file a le sien, écrit et testé ; la trace s'écrit sous un point de sauvegarde, pour un
   événement d'un poste comme du core.
2. **L'âge entre dans l'arrivée**, calculé par l'appelant (I1) ; une urgence ancienne au bureau a sa ligne.
3. **Le rituel d'accueil** est le cinquième endroit qui décide ; il passe par la porte (réponse 1), avec sa tâche.
4. **Ce qu'elle a dit en dernier** n'est plus déplacé par une ligne d'urgence écrite la nuit (I2).
5. **Un seul endroit, nuancé** (I5) : ce qui reste dehors est nommé, avec son chantier ; les échéances lues par le
   core en font partie.
6. **Toute carte entre au Journal**, comme aujourd'hui (I6) : la tâche 6b se réduit à la trace et à la file.
7. **L'ordre de déploiement** est écrit, ici et dans la feuille de route (I7).
8. **Le dépôt public** (I8) : la forme du registre, les bornes chiffrées, les textes du core et le détail des tests
   sont partis dans l'annexe privée.
9. **Mineurs** : la garde en dernier et visant la décision ; la matrice aux seuls relevés atteignables, attendus
   déduits du tableau, avec titre, étapes, corps et lien ; une seule entrée décisive, le relevé gardé ; la raison
   propre d'une ligne retirée ; le risque des migrations comptées ; la carte relue là où le core la garde ; les
   ajouts d'étapes nommés ; le type de la carte côté écran ; la lecture du registre en prod ; aucune annonce de nuit ;
   le rejeu sur le banc de la tâche 0 ; la nature « événement du core » remplacée par la source.

## Ce que la relecture du 26/11 a changé

La version amendée a été relue contre le code par cinq lectures, chacune contredite ensuite : 53 constats, dont 2
bloquants et 6 importants ont tenu, doublons retirés. Aucun ne touche une réponse de CrOliX. L'amendement lui-même a
été relu avant d'être poussé. Le détail, avec les fichiers, est dans l'issue privée.

1. **Deux tâches laissaient une barrière rouge** (bloquants). La tâche 2 cassait un test qui rejoue la dernière
   migration ; la tâche 3 changeait le retour de l'insertion sans toucher celui qui le lit. Les deux sont écrits dans
   leur tâche.
2. **Le rituel du matin ne voit pas une urgence d'avant 5 h.** Il lit les urgences de la journée de Natsume, qui
   commence à 5 h. La promesse est bornée : il nomme une urgence arrivée depuis 5 h ; avant, elle reste écrite au
   fil, comme aujourd'hui. Élargir cette fenêtre toucherait aussi l'accueil : c'est signalé à part
   (Lun-Ecosystem/lun-anima#154), pas fait ici.
3. **La fin d'un envoi a son repli** : une panne de la trace d'envoi ne renvoie pas une urgence déjà partie.
4. **La liste des alertes de santé gagne une ligne** : la conversation qui ne peut plus répondre.
5. **La clé qui expire** part en P1 à J-14 comme à J-3 dans le code d'aujourd'hui ; le contrat dit P2 à J-14.
   L'annexe disait le contrat, pas le code. L'écart est signalé à part (Lun-Ecosystem/lun-anima#153), pas changé ici.
6. **La garde ne pouvait pas passer sur l'annonce**, qui n'appelle plus la porte : elle y vérifie que l'annonce ne
   lit aucune entrée et que la voix vient du signal.
7. **Deux voies en parallèle au lieu de trois.** Le rituel suit l'annonce dans la même voie : la ligne que l'annonce
   écrit au fil la nuit déplace ce que lit le rituel du matin, et deux voies séparées se seraient cassées l'une
   l'autre. **La matrice tient en un fichier par sortie**, pour que les deux voies ne s'y croisent pas ; son banc est
   rangé avec les aides de test, hors du build et de la garde.
8. **Ce que le tableau change** dit maintenant le rappel d'agenda pendant la plage de nuit, et la notification sans
   son au bureau la nuit.
9. **Mineurs** : une heure illisible vaut ancienne ; l'échec de routine exclu du Journal est celui du core seul,
   repli compris ; le réglage « urgences en direct » vaut aussi pour une carte urgente ; la décision de la file sert
   à retirer puis à envoyer ; le build entre dans les barrières ; la garde de jour du rituel est neuve ; la plage de
   nuit de la tâche 0 sépare le son de la voix ; ce qui reste dehors nomme le retour rapide, l'essai de notification
   et l'affichage ; une limite fausse est retirée, cinq sont ajoutées.

Les cinq points que l'annexe disait ne pas avoir vérifiés le sont : la lecture des cartes passe telle qu'écrite ; le
type de la carte s'élargit sans casser de test ; le rituel reçoit son heure ; la reprise de l'historique reste une
exception nommée ; la commande de lecture se lance sur le NAS comme les autres.

## Réponses de CrOliX, le 25/11

1. **Le rituel d'accueil passe par la porte.** Pendant la plage de nuit, il ne dit pas une urgence à voix haute,
   puisqu'elle est déjà écrite au fil. Les cartes P2 sont comptées au lieu d'être nommées. Le jour, rien ne change.
2. **En pause**, les urgences et les alertes de santé du core passent. Le reste attend, au Journal et dans les
   compteurs. Il n'y a qu'une pause, quelle que soit la personne ou la règle qui l'a posée.
3. **Une urgence ancienne au bureau** s'écrit au fil sans être dite, et la trace dit pourquoi.
4. **Le code l'emporte sur le standard dans deux cas** : « Dit à voix haute : P0 » coupé, l'urgence sonne quand même
   sur le téléphone ; CrOliX au bureau, une P1 ne part pas sur le téléphone. Le standard des notifications est
   corrigé dans cette PR, avec la plage de nuit, la pause et « attendre ».
5. **L'ordre de déploiement** : ce core d'abord, Acedia 1.5 ensuite.

Tranché le même jour, sur les questions du plan : **une carte `urgent`** notifie seule, avec son sauf la nuit, et
n'est jamais dite ; **« groupable »** veut dire la validation groupée, que le chantier 5 lira à la porte.

## Ensuite, hors du chantier

- La version du core publiée, puis déployée par la porte de mise en service, par CrOliX. **Puis seulement** la
  release de Lun'Acedia 1.5.
- Sur le NAS, après une plage de nuit : le registre relu par sa commande pour une urgence de nuit, s'il y en a eu une.

## Hors périmètre

- La validation groupée et la correction dans le core (chantier 5).
- Le budget « attendre » partagé avec la parole spontanée, et la parole spontanée à la porte (chantier 8, P2).
- **Les échéances lues par le core** (le flux 14 de la spec : agenda, tâches, échéances de la bibliothèque). Le
  standard les fait entrer à la porte ; elles n'y entrent pas ici. Elles viendront avec la lettre écrite par le
  modèle (chantier 6), qui met en tête ce qui est dû dans la journée.
- L'écriture du Journal et de « Ce que j'ai fait », les exceptions nommées (chantier 7).
- La lettre écrite par le modèle (chantier 6), les phrases en « je », la nuit vers Avaritia.
- Les modes, après le MVP.
- Un écran qui lit le registre.

## Limites

- **En pause, une P3 n'ira pas à la lettre** quand le chantier 6 la branchera : la pause retient tout ce qui n'est ni
  urgence ni alerte de santé.
- **« Attendre » et « la lettre » sont décidés et tracés, sans lecteur.** Rien ne parle plus tard d'un P2 ; la lettre
  du matin ne lit pas les P3. Les chantiers 8 et 6 les brancheront.
- **La décision de la file est prise au moment de l'envoi**, pas à l'arrivée : c'est le comportement d'aujourd'hui.
  La trace d'arrivée et la trace d'envoi peuvent donc différer ; le registre garde les deux.
- **Une urgence pendant la plage de nuit s'écrit au fil même absent** : il la retrouve le matin dans la conversation.
  Le rituel du matin ne la nomme que si elle est arrivée depuis 5 h, le début de la journée de Natsume. Avant 5 h, ni
  le rituel ni l'accueil ne la listent, comme aujourd'hui : signalé à part (Lun-Ecosystem/lun-anima#154).
- **Une urgence ancienne rejouée pendant la plage de nuit s'écrit au fil**, absent compris. Après une longue coupure
  d'un poste, chaque urgence rejouée écrit sa ligne, la nuit, ou le jour au bureau.
- **Une urgence ancienne reçue en appel** est tracée « l'appel », pas « l'ancienneté » : la première ligne qui
  s'applique décide.
- **Une carte `urgent` sonne au téléphone même quand CrOliX est au bureau**, puisque aucune carte n'est dite. Aucun
  poste n'en envoie aujourd'hui.
- **Les événements du core ne sont jamais dits** : aucun n'est `urgent` aujourd'hui. Un événement du core urgent, un
  jour, ne serait au bureau ni dit, ni écrit au fil, ni notifié : il ne resterait qu'au Journal. La garde ne le voit
  pas.
- **La porte décide la voix et la notification, pas l'affichage** : l'accueil liste une urgence pendant la plage de
  nuit ou en pause, et les écrans ouverts se rafraîchissent comme aujourd'hui.
- **Deux sorties répondent à un geste de CrOliX et restent directes** : la phrase du retour rapide, et l'essai de
  notification.
- **La clé qui expire part en P1 à J-14** dans le code d'aujourd'hui, quand le contrat dit P2. Ce chantier ne le
  change pas : signalé à part (Lun-Ecosystem/lun-anima#153).
- **« Les alertes urgentes en direct » coupé ne coupe pas la voix**, comme aujourd'hui. Le réglage ne retire que la
  notification et la liste de l'accueil.
- **Le rituel ne laisse pas de trace** : il relit la file, il ne reçoit pas d'arrivée.
- **Une carte vue avant la mise à jour** n'a pas de trace d'arrivée : elle est arrivée avant la porte.
- **Le registre ne dit pas le titre** : pour savoir de quel mail il s'agit, il faut remonter à l'événement par sa clé.
- **Revenir en arrière** se fait par l'image d'avant, jamais en retirant la migration du code.
