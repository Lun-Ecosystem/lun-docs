# La porte d'attention : un seul endroit du core décide de ce qui parvient à CrOliX. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **PR :** à ouvrir dans Lun'Anima, en brouillon. **À valider par CrOliX.**
>
> **Issue :** Lun-Ecosystem/lun-anima#152, `niveau:critique`, privée. Chantier 4 du découpage de la carte des flux.
>
> **État : rédigé le 25/11, à contester.** Les points à trancher par CrOliX sont dans « Questions à CrOliX ».
>
> Code relu sur `main` de Lun'Anima (`d3afbf5`). Le graphe d'abord, puis chaque point dans le code. Lun'Anima est
> privé : ce plan dit le comportement, les critères, les tâches et les preuves. Les fichiers, les lignes, les noms,
> les bornes et les textes du core sont dans un commentaire de l'issue privée
> ([`securite.md`](../../standards/securite.md), « Dépôts publics »).

**But :** un seul endroit du core, en code et sans modèle, décide de ce qui parvient à CrOliX. L'annonce à voix haute,
la file des notifications et le Journal des événements lui demandent leur sortie, et chaque décision laisse une ligne
de trace. Le core lit enfin le palier et le regroupement d'une carte. Aucun texte rendu ne change.

**Source :** l'issue, avec les réponses de CrOliX du 25/11 et les choix de la session. Le
[standard des notifications](../../standards/notifications.md) (« La porte d'attention », les paliers, le rendu). Le
[contrat satellite](../../standards/contrat-satellite.md) (`importance` et `bulk` sur une carte, version 1.5). La spec
de la [carte des flux](../specs/2026-11-25-carte-des-flux-design.md) : § 5.2, § 10 (questions 1 et 2), § 11 étape 4,
§ 12.

**Critères de fin**, figés dans l'issue, chacun prouvé en local :

1. **Un module unique décide** : une fonction pure reçoit l'arrivée et les entrées (présence, appel, réglage « Dit à
   voix haute : P0 », sourdine, pause, plage de nuit, palier), et rend la sortie et l'entrée qui l'a décidée.
   Tâche 1.
2. **Un test fixe la sortie de chaque palier** (P0 à P4) pour chaque combinaison d'entrées : le tableau du standard
   et les trois réponses de CrOliX. P0 dit malgré la sourdine, jamais en appel ni pendant la plage de nuit ; P1
   insensible à la sourdine ; P2 sans notification ; P3 à la lettre ; en pause, seule une urgence sort. Tâche 1.
3. **Les trois sorties passent par la porte** : l'annonce, la file des notifications, le Journal des événements. Une
   garde échoue si l'une d'elles décide ailleurs. Les écritures directes qui restent sont listées avec leur raison.
   Tâches 3 à 7.
4. **Chaque arrivée laisse une ligne de trace** : ce qui est arrivé, la sortie choisie, l'entrée décisive. Un test de
   rejeu la lit. Tâches 2 et 8.
5. **Le core lit `importance` et `bulk` sur les cartes** : une carte `low` ne notifie pas et compte dans la pastille ;
   `normal`, `urgent` ou sans `importance`, elle suit son palier (P1 par défaut) ; `bulk` la rend groupable, jamais
   si elle a `sends` ou `options`. Tâche 6.
6. **Une urgence déjà notifiée ne l'est pas de nouveau après un redémarrage.** Tâches 0 et 8.
7. **Aucun texte rendu ne change.** Toutes les tâches.
8. **Toutes les barrières de Lun'Anima sont vertes**, et le comportement existant hors de ces règles est inchangé.
   Tâche 0, puis chaque tâche.
9. **Preuve sans NAS** : un rejeu local, sans réseau, montre la trace d'un lot d'arrivées de P0 à P4 et de cartes
   `low`, `normal` et sans `importance`. Tâche 8.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-anima` : 10 tâches (0 à 9), une PR | dans l'issue privée | Lun-Ecosystem/lun-anima#152 | `critique` |
| `lun-docs` : ce plan et ses coches | `docs/plan-porte-attention` | la même | `trivial` |

**Le niveau.** `critique`, celui de l'issue. Le core tourne en continu sur le NAS : une régression empêcherait une
urgence de partir, ou ferait sonner le téléphone pendant la plage de nuit. Chaque comportement changé a son test,
écrit d'abord par le testeur ; chaque comportement gardé a sa garde, verte sur `main`
([`workflow.md`](../../standards/workflow.md)). Une base change : une table de plus, sans toucher aux autres. Aucun
écran, aucune route, aucun contrat ne change. Pas de Chrome.

## Ce que le code fait aujourd'hui

### Quatre endroits décident chacun de leur côté

- **L'annonce à voix haute.** Une urgence d'un poste, neuve et récente (quelques minutes), est écrite au fil de la
  conversation si CrOliX est à son bureau. Elle y est dite, sauf en appel ou si le bureau a coupé « Dit à voix haute :
  P0 ». La sourdine ne l'arrête pas. Absent, rien n'est écrit au fil. **La plage de nuit n'est pas lue** : une urgence
  à 2 h du matin, bureau ouvert, est dite.
- **La file des notifications.** Elle prend les événements `urgent` et `normal` et **toutes les cartes en attente**,
  une fois chacun, sous une clé qui ne revient jamais. À l'envoi, elle relit la présence : au bureau, une urgence dite
  ne part pas, et rien de `normal` ne part. Une urgence part seule ; le reste se groupe par type après deux minutes,
  toujours sans son. La plage de nuit ne règle que le son d'une urgence. Un réglage par poste, « les alertes
  urgentes en direct », retire ses urgences de la file.
- **Le Journal des événements.** Tout événement reçu ou émis par le core y entre, sauf `log`, dans la même écriture
  que l'événement. Un échec de routine n'y entre pas : la ligne de la routine le porte déjà.
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
- **Les cartes au Journal.** Une carte en attente entre au Journal une fois, à sa première lecture.
- **La pastille.** Elle compte toutes les cartes en attente, quel que soit leur palier.
- **Les événements du core** ne sont jamais `urgent` aujourd'hui : aucun n'est dit.

### Les écritures directes au Journal

Hors des événements, neuf endroits écrivent au Journal sans rien décider de ce qui parvient à CrOliX. Ils notent un
acte, le sien ou celui de Natsume : un changement de pause, une routine passée ou sautée, un geste « plus tard », une
délégation, un réglage, une liaison ou une déliaison, un geste ignoré, un geste sur une carte sans entrée, la reprise
de l'historique. Aucun ne notifie, aucun ne parle.

## Les choix

### La fonction pure

Elle reçoit **une arrivée** et **un relevé des entrées**, et rend **une décision**. Rien d'autre : ni base, ni
horloge, ni réseau.

- **L'arrivée** : sa nature (événement d'un poste, événement du core, carte), son type, sa source, son `importance`,
  et pour une carte `bulk`, `sends` et `options`.
- **Le relevé des entrées** : la présence au bureau, l'appel, la sourdine, le réglage « Dit à voix haute : P0 », la
  pause, la plage de nuit, et le réglage « les alertes urgentes en direct » du poste source. Il est lu en un seul
  endroit, à côté de la fonction, et passé tel quel.
- **La décision** : le palier ; la voix (à voix haute, écrite au fil sans voix, ou rien) ; la notification (avec son,
  sans son, ou rien) ; attendre le bon moment ; la lettre ; le Journal ; groupable ; et **l'entrée décisive**, une
  seule, celle qui a fixé la voix et la notification.

**Le palier** vient de `importance` : `urgent` P0, `normal` P1, `low` P2, `info` P3, `log` P4. Une carte sans
`importance`, ou avec une valeur inconnue, vaut P1.

### Le tableau de la porte

Lu de haut en bas : la première ligne qui s'applique décide.

| Palier | Entrées | Voix | Notification | Autres sorties | Entrée décisive |
|---|---|---|---|---|---|
| P4 | toutes | rien | rien | rien | le palier |
| P1, P2, P3 | pause | rien | rien | Journal | la pause |
| P0 | plage de nuit | écrite au fil | sans son | Journal | la plage de nuit |
| P0 | au bureau, en appel | écrite au fil | avec son | Journal | l'appel |
| P0 | au bureau, « Dit à voix haute : P0 » coupé | écrite au fil | avec son | Journal | le réglage P0 |
| P0 | au bureau, sourdine ou non | dite | rien | Journal | la présence |
| P0 | absent | rien | avec son | Journal | l'absence |
| P1 | au bureau, sourdine ou non | rien | rien | Journal | la présence |
| P1 | absent | rien | sans son | Journal | le palier |
| P2 | toutes | rien | rien | attendre, Journal | le palier |
| P3 | toutes | rien | rien | lettre, Journal | le palier |

Trois règles s'ajoutent, après le tableau :

- **« Les alertes urgentes en direct » coupé** pour le poste source : une urgence ne notifie pas ; l'entrée décisive
  devient ce réglage. La voix ne change pas, comme aujourd'hui.
- **Une carte n'est jamais dite** : elle attend un geste, et ses mots sont sur la carte. Une carte P0 notifie avec son
  là où un événement P0 serait dit (question 2).
- **Un échec de routine** n'entre pas au Journal : la ligne de la routine le porte déjà, comme aujourd'hui.

**Groupable** : une carte `bulk` sans `sends` ni `options`. Rien d'autre ne l'est. Ce chantier le décide et le trace ;
la validation groupée qui s'en sert est le chantier 5. Le regroupement des notifications par type ne change pas
(question 3).

**Ce que le tableau change**, et rien d'autre : une urgence pendant la plage de nuit n'est plus dite au bureau, elle
s'écrit au fil même absent et part sans son ; en pause, rien d'autre qu'une urgence ne notifie ; une carte `low`,
`info` ou `log` ne notifie plus ; une carte `urgent` notifie seule, avec son. Tout le reste est le comportement
d'aujourd'hui, ligne à ligne.

### Comment les trois sorties l'appellent

- **Le Journal des événements.** À l'insertion d'un événement, d'un poste ou du core, dans la même écriture : le
  relevé, la décision, la ligne de trace, puis la ligne du Journal si la décision la demande. Un rejeu ne décide
  rien : il n'insère rien.
- **L'annonce.** Elle reçoit la voix décidée à l'insertion, par le signal qui la prévient déjà d'une urgence neuve.
  Elle garde son seul contrôle propre : une urgence trop ancienne n'est pas une nouvelle. Elle ne lit plus ni la
  présence, ni l'appel, ni le réglage.
- **La file des notifications.** Elle prend ce dont le palier peut notifier (P0 et P1). À chaque passage, elle
  redemande la décision avec le relevé du moment : la présence change entre l'arrivée et l'envoi, et c'est le
  comportement d'aujourd'hui. Elle garde ses contrôles de validité : trop ancienne, déjà vue, déjà tranchée, cachée,
  disparue. Le son d'un envoi vient de la décision. Quand une ligne de la file se termine, envoyée ou retirée par la
  porte, elle laisse sa ligne de trace d'envoi.
- **Les cartes.** À la première lecture d'une carte en attente, là où elle entre au Journal : la décision, la trace,
  puis l'entrée au Journal si la décision la demande.

**Les textes ne bougent pas** : les deux phrases de l'annonce, les titres et les corps des notifications, les lignes
du Journal restent ceux d'aujourd'hui. La porte ne rend aucun texte.

**Une panne de la porte ne coûte jamais une urgence.** Si le relevé ou la trace échoue à l'insertion, l'événement est
gardé et écrit au Journal comme aujourd'hui, l'échec va au journal du core, une urgence s'écrit au fil sans voix, et
la file la décide à son passage.

### Le registre de trace

**Une table technique à part**, ajoutée par une migration, sans toucher aux autres (choix de la session, gardé).

- **Une ligne par arrivée et par étape** : l'arrivée, puis la fin de son envoi quand elle est passée par la file.
  Une clé unique sur la paire : un redémarrage ou un rejeu n'en ajoute pas.
- **Ce qu'elle porte** : l'heure, la clé de l'arrivée (celle de la file), sa source, son type, son palier, les sorties
  choisies, l'entrée décisive et le relevé des entrées.
- **Ce qu'elle ne porte pas** : ni titre, ni texte, ni ligne d'une carte. Un titre peut être l'objet d'un mail. Le
  registre dit ce qui est arrivé par sa clé, son type et sa source ; le détail se lit à sa source.
- **Une borne de durée** : les lignes trop anciennes partent à l'écriture suivante (durée dans l'issue privée).
- **Aucun écran ne la lit.** Le Journal reste la forme lue par CrOliX ; sa forme est le chantier 7.

### La garde

Un test parcourt les sources du core, comme la garde des noms de fournisseurs.

- **Les entrées de rendu** (la présence et ses drapeaux, la plage de nuit, la pause, le réglage des urgences en
  direct) ne se lisent que dans une liste de fichiers permis, chacun avec sa raison : la porte, les écrans d'état, la
  situation donnée au modèle, la parole spontanée. L'annonce, la file et le Journal des événements n'y sont pas.
- **L'écriture au Journal** ne se fait que depuis une liste de fichiers permis : la porte et les exceptions nommées
  ci-dessous. L'écriture d'un événement au Journal n'est appelée qu'après une décision.
- **Elle ne peut pas passer à tort** : une liste vide, un fichier permis qui n'existe plus, aucun fichier lu, la font
  échouer.

### Les exceptions nommées

Toutes passent au chantier 7, qui récrit le Journal. Aucune ne notifie ni ne parle.

| Écriture | Pourquoi elle reste directe |
|---|---|
| Un changement de pause | Un état du core, souvent un geste de CrOliX ; rien n'arrive de dehors |
| Une routine passée ou sautée | Le travail de Natsume, pour « Ce que j'ai fait » |
| Un geste « plus tard » | Le geste de CrOliX lui-même |
| Une délégation | Le travail de Natsume, avec son coût |
| Un réglage | Le geste de CrOliX lui-même |
| Une liaison, une déliaison | Le geste de CrOliX lui-même |
| Un geste ignoré | La trace d'un geste de CrOliX, sans un mot de son message |
| Un geste sur une carte sans entrée | Le geste de CrOliX ; l'entrée de la carte se crée avec lui |
| La reprise de l'historique | Une reprise unique d'anciennes lignes, à l'installation |
| La parole spontanée | Pas une arrivée : elle vient de Natsume ; elle passe à la porte au chantier 8 (P2) |

**P4 reste hors du Journal**, comme aujourd'hui (choix de la session, gardé).

### Le rejeu local

Un test du core, sans réseau et sans NAS. Il ouvre une base en mémoire, fait arriver un lot par les vrais chemins
(un événement par palier de P0 à P4, d'un poste et du core ; des cartes `low`, `normal`, `urgent` et sans
`importance`, dont une `bulk` avec `sends`), sous cinq relevés : absent le jour, au bureau, en appel, plage de nuit,
puis en pause. Il fait passer la file avec un faux service de notifications. Il lit le registre et le compare à un
tableau écrit en toutes lettres, qui se lit dans la PR. Il recommence après un redémarrage de la file et un rejeu du
flux : rien de neuf.

## Tâches

**Barrières de chaque tâche** : celles de Lun'Anima, dans l'issue privée. Les tests de comportement s'écrivent
d'abord et sont rouges sur `main` ; les gardes, vertes sur `main`, fixent ce qui ne doit pas bouger. Chaque test dit
lequel il est. Chaque tâche passe par le `reviewer` avant la suivante. Les fichiers et les noms sont dans l'issue
privée.

0. - [ ] **La matrice d'aujourd'hui** (`testeur`). **D'abord, avant toute autre tâche.**
   - **Une garde verte sur `main`** : pour chaque palier de P0 à P4, d'un poste et du core, et pour chaque relevé
     (absent, au bureau, en appel, « Dit à voix haute : P0 » coupé, sourdine, plage de nuit, pause, urgences en direct
     coupées), elle relève ce qui sort : la ligne du fil et sa voix, la notification et son son, la ligne du Journal.
     Les cartes : une carte en attente, avec et sans présence.
   - **Le redémarrage** : une urgence notifiée, puis une nouvelle file et un rejeu du flux : ni seconde notification,
     ni seconde annonce, ni seconde ligne au Journal.
   - **La plage de nuit** : sur une plage entière, ticks de la file toutes les quelques minutes, aucune notification
     avec son.
   - Les cases que ce chantier change sont marquées dans le test, avec la tâche qui les change. Ensuite, chaque tâche
     change ces cases, et aucune autre ; leur diff se relit à la revue.
   - Exclu : tout code de production.
1. - [ ] **La fonction pure et son tableau** (`testeur`, puis `dev-core`). **En parallèle de la tâche 6a.**
   - Tests rouges sur `main` : chaque ligne du tableau de la porte, pour chaque combinaison des entrées, avec sa
     voix, sa notification, ses autres sorties et son entrée décisive. En particulier : P0 dit malgré la sourdine,
     jamais en appel ni pendant la plage de nuit ; P1 identique avec et sans sourdine ; P2 sans notification ; P3 à la
     lettre ; en pause, seule une urgence sort ; P4 rien. Les trois règles d'après le tableau. Le palier d'une carte
     sans `importance` ou à valeur inconnue : P1. Groupable : `bulk` seul oui ; `bulk` avec `sends` ou `options`, non.
   - Garde : la fonction ne lit ni base, ni horloge ; deux appels égaux rendent la même décision.
   - Code : la fonction pure et ses types, dans un module à elle. Rien ne l'appelle encore.
   - Exclu : le relevé, la trace, tout branchement.
2. - [ ] **Le relevé et le registre** (`testeur`, puis `dev-core`). **Après la tâche 1, dans le même worktree.**
   - Tests rouges sur `main` : le relevé lit chaque entrée depuis la base, la plage de nuit comprise à cheval sur
     minuit ; la trace écrit une ligne par arrivée et par étape, une seule même appelée deux fois ; elle ne porte ni
     titre ni texte ; les lignes trop anciennes partent ; la migration ajoute la table sur une base existante, sans
     toucher aux autres.
   - Gardes : la lecture de la plage de nuit garde ses tests d'aujourd'hui, déplacés avec elle ; les migrations
     d'avant ne changent pas.
   - Code : le relevé des entrées, l'écriture de trace, la migration. La lecture de la plage de nuit rejoint la porte.
   - Exclu : tout branchement aux sorties.
3. - [ ] **Le Journal des événements par la porte** (`testeur`, puis `dev-core`). **Après la tâche 2. Voie A.**
   - Tests rouges sur `main` : un événement reçu et un événement du core laissent une ligne de trace d'arrivée ; en
     pause, un événement `normal` entre au Journal, et la trace dit « la pause » ; une panne de la trace ne coûte ni
     l'événement, ni sa ligne au Journal, et va au journal du core.
   - Gardes : les tests d'écriture au Journal restent verts tels quels (une urgence une fois, même rejouée ; `log`
     jamais ; un événement du core sous Natsume ; l'échec de routine absent) ; la matrice de la tâche 0 ne bouge pas.
   - Code : l'insertion d'un événement, d'un poste ou du core, demande la décision dans sa propre écriture, la trace,
     puis la ligne du Journal si la décision la demande. L'insertion rend la décision, ou rien pour un rejeu.
   - Exclu : l'annonce, la file, les cartes, les textes du Journal.
4. - [ ] **L'annonce par la porte** (`testeur`, puis `dev-core`). **Après la tâche 3, dans le même worktree.**
   - Tests rouges sur `main` : une urgence pendant la plage de nuit, au bureau : écrite au fil, pas dite ; absent :
     écrite au fil aussi (réponse de CrOliX) ; un rappel d'agenda pendant la plage de nuit, pareil.
   - Gardes : tous les tests de l'annonce d'aujourd'hui restent verts (dite au bureau, écrite en appel, réglage P0
     coupé, sourdine seule dite, absent rien de jour, `normal` jamais, neuve une fois, trop ancienne rien, rappel, titre
     rejoué comme donnée, panne sans perte, phrase bornée).
   - Code : le signal d'une urgence neuve porte la voix décidée ; l'annonce l'exécute, avec son contrôle d'âge, sans
     plus lire la présence.
   - Exclu : la parole spontanée, la file, le texte des deux phrases.
5. - [ ] **La file des notifications par la porte** (`testeur`, puis `dev-core`). **Après la tâche 2. Voie B, en
   parallèle des voies A et C.**
   - Tests rouges sur `main` : une urgence pendant la plage de nuit, au bureau : part sans son ; en pause, un `normal`
     ne part pas, une urgence part ; une ligne retirée ou envoyée laisse sa trace d'envoi avec son entrée décisive.
   - Gardes : tous les tests de la file d'aujourd'hui restent verts (urgence à l'instant, panne puis reprise, rien
     sans abonnement, groupe après deux minutes, carte seule, silence quand la voix parle, appel, réglage P0 coupé, P1
     né au bureau, présence morte, redémarrage, premier abonnement, retour d'un appareil, expiration, vu ou tranché,
     urgences coupées, son de nuit, poste injoignable, nouvel essai).
   - Code : la file prend ce que la porte classe P0 ou P1, retire ce dont la décision du moment ne notifie plus, et
     tient le son de la décision. Ses contrôles de validité ne bougent pas.
   - Exclu : le regroupement par type, les textes des notifications, le poste injoignable.
6. - [ ] **Les cartes lues avec leur palier** (`testeur`, puis `dev-core`). **6a en parallèle de la tâche 1 ; 6b après
   les tâches 2 et 5, voie C.**
   - **6a, la lecture.** Tests rouges sur `main` : une carte lue garde `importance` et `bulk` ; une valeur inconnue
     ou mal formée de l'un d'eux est ignorée, sans faire échouer la lecture des autres cartes. Garde : une carte d'un
     poste 1.4, sans ces champs, se lit comme aujourd'hui. Code : le type et la lecture de la carte.
   - **6b, la porte.** Tests rouges sur `main` : une carte `low` ne notifie pas et compte dans la pastille ; `normal`
     et sans `importance` notifient comme aujourd'hui ; `urgent` part seule, avec son, et n'est pas dite ; `info` et
     `log` ne notifient pas ; une première lecture laisse une ligne de trace d'arrivée.
   - Gardes de 6b : les tests des cartes au Journal restent verts (une fois, à son heure, après un redémarrage rien,
     tranchée ailleurs, panne sans perte) ; la pastille compte toutes les cartes en attente.
   - Code de 6b : la première lecture d'une carte demande la décision, la trace, puis l'entrée au Journal si la
     décision la demande ; la file prend les cartes que la porte classe P0 ou P1.
   - Exclu : la validation groupée et la correction (chantier 5), la forme des piles à l'écran.
7. - [ ] **La garde de la porte** (`testeur`). **Écrite après la tâche 1, rouge jusqu'à la fin des tâches 3 à 6.**
   - La garde du § « La garde » : entrées de rendu lues seulement par les fichiers permis ; écriture au Journal
     seulement depuis la porte et les exceptions nommées ; écriture d'un événement au Journal seulement après une
     décision. Chaque fichier permis dit sa raison dans le test.
   - Elle échoue sur une liste vide, un fichier permis disparu, aucun fichier lu.
   - Exclu : tout code de production.
8. - [ ] **Le rejeu local** (`testeur`). **Après les tâches 3 à 6.**
   - Le test du § « Le rejeu local » : un lot par les vrais chemins, cinq relevés, la file passée, le registre comparé
     en toutes lettres ; puis un redémarrage et un rejeu, sans ligne nouvelle.
   - Sa sortie, lisible, va dans la PR.
   - Exclu : tout code de production.
9. - [ ] **La revue et la livraison** (`reviewer`, puis `livreur`). **Après 0 à 8.** Le diff relu contre ce plan et
   les standards ; le diff de la matrice de la tâche 0 relu case par case. Une PR Lun'Anima en brouillon, qui ferme
   Lun-Ecosystem/lun-anima#152, avec les tests rouges devenus verts, la suite entière, les barrières et la sortie du
   rejeu. Ce plan coché dans la PR lun-docs du chantier. Après la fusion, le graphe mis à jour.

**L'ordre et le parallèle.**

- La tâche 0 part seule, d'abord : toutes les autres changent ses cases, ou la gardent.
- Ensuite, en parallèle : la tâche 1 (la fonction pure) et la tâche 6a (la lecture des cartes). Aucun fichier commun.
- La tâche 2 suit la tâche 1, dans le même worktree. La tâche 7 s'écrit dès la tâche 1 finie.
- Après la tâche 2, **trois voies** :
  - **A** : les tâches 3 puis 4, un seul `dev-core`, un worktree : elles touchent l'insertion et son signal.
  - **B** : la tâche 5, un `dev-core` à part : la file seule.
  - **C** : la tâche 6b, après la tâche 5 : elle touche la file pour les cartes. Dans le worktree de la voie B.
- Les voies se fusionnent dans la branche du chantier avant la tâche 8. Puis la revue, puis le livreur.

**Comment chaque tâche garde le comportement vert.**

- **La matrice de la tâche 0** est la seule mesure de « rien d'autre ne bouge ». Chaque tâche ne change que les
  cases marquées pour elle ; une case de plus est un refus à la revue.
- **Les tests d'aujourd'hui restent tels quels.** Une tâche qui en change un dit lequel et pourquoi dans son rapport ;
  seuls les deux tests qui lisent le retour de l'insertion d'un événement changent de forme, pas de sens.
- **L'urgence d'abord.** Une panne de la porte à l'insertion garde l'événement, l'écrit au Journal, l'écrit au fil
  sans voix, et laisse la file la décider : un test le prouve dans la tâche 3, un autre dans la tâche 4.
- **La plage de nuit** : le test de la tâche 0 tourne à chaque tâche ; aucune notification avec son n'y passe.
- **Le déploiement** : une seule version, une table de plus, aucune colonne changée. Revenir à l'image d'avant laisse
  la table sans lecteur, sans rien casser.

## Questions à CrOliX

1. **La pause du plafond.** La lecture du plan : seule la pause qu'il pose lui-même retient les notifications. Une
   pause au plafond est un garde de dépense ; si elle retenait aussi les P1, la notification « plafond atteint »,
   émise au moment où la pause commence, ne partirait jamais. **Recommandé : la pause qu'il pose, seule.** Sinon,
   toute pause, et le plafond atteint ne se lit qu'à la bande et au Journal.
2. **Une carte `urgent`.** Aucun poste n'en envoie aujourd'hui : Lun'Acedia 1.5 marque ses propositions `normal` ou
   `low`. **Recommandé : une carte P0 notifie seule, avec son, et n'est jamais dite** : elle attend un geste, et ses
   mots sont sur la carte. Sinon, elle est dite comme un événement P0, ce qui ouvre un chemin de voix de plus.
3. **« Groupable ».** La lecture du plan : la validation groupée, que le chantier 5 branchera. Le regroupement des
   notifications par type, du standard, ne change pas : trois cartes en attente donnent toujours « 3 cartes à
   valider ». Sinon, une carte qui a `sends` ou `options` part aussi en notification à part.

## Ensuite, hors du chantier

- La version du core publiée, puis déployée par la porte de mise en service, par CrOliX.
- Sur le NAS, après une plage de nuit : le registre relu pour une urgence de nuit, s'il y en a eu une.
- La release de Lun'Acedia 1.5 devient possible : ses propositions `low` ne notifient plus.

## Hors périmètre

- La validation groupée et la correction dans le core (chantier 5).
- Le budget « attendre » partagé avec la parole spontanée, et la parole spontanée à la porte (chantier 8, P2).
- L'écriture du Journal et de « Ce que j'ai fait », les exceptions nommées (chantier 7).
- La lettre écrite par le modèle (chantier 6), les phrases en « je », la nuit vers Avaritia.
- Les modes, après le MVP.
- Un écran qui lit le registre.

## Limites

- **« Attendre » et « la lettre » sont décidés et tracés, sans lecteur.** Rien ne parle plus tard d'un P2 ; la lettre
  du matin ne lit pas les P3. Le chantier 8 et le chantier 6 les brancheront.
- **La décision de la file est prise au moment de l'envoi**, pas à l'arrivée : c'est le comportement d'aujourd'hui.
  La trace d'arrivée et la trace d'envoi peuvent donc différer ; le registre garde les deux.
- **Une urgence pendant la plage de nuit s'écrit au fil même absent** : il la retrouve le matin dans la conversation.
- **Les événements du core ne sont jamais dits** : aucun n'est `urgent` aujourd'hui. Un événement du core urgent, un
  jour, serait décidé « dit » sans que rien ne le dise ; la garde de la porte ne le voit pas.
- **« Les alertes urgentes en direct » coupé ne coupe pas la voix**, comme aujourd'hui. Le réglage ne retire que la
  notification et la liste de l'accueil.
- **Le réglage P0 coupé** laisse partir la notification avec son, comme aujourd'hui. Le standard dit « en silence dans
  le fil et sur le téléphone » ; la lecture du plan : en silence au bureau, la notification telle qu'aujourd'hui.
- **Une carte vue avant la mise à jour** n'a pas de trace d'arrivée : elle est arrivée avant la porte.
- **Le registre ne dit pas le titre** : pour savoir de quel mail il s'agit, il faut remonter à l'événement par sa clé.
