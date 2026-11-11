# La phrase d'attente : elle dit ce qu'elle va faire avant de confier une demande. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** qu'à la voix, on n'entende plus un long blanc quand Natsume confie une demande à un poste. Elle dit
d'abord, avec ses mots, une courte phrase sur ce qu'elle va faire ; et la durée d'une délégation est enfin mesurée.

**Source :** le cadrage [« Le blanc pendant qu'un poste travaille »](../specs/2026-11-11-phrase-attente-cadrage.md),
dont CrOliX a validé les deux recommandations le 11/11 : une phrase d'elle plutôt qu'une phrase fixe ; à la voix
seulement. Code relu sur `main` de Lun'Anima. Plan relu par le plan-challenger le 11/11 : « à amender », ses neuf
objections sont reprises ici (voir la fin).

**Critères de fin :**

- Sur le vrai modèle, le comptage est écrit ici : phrases dites, oubliées, dites à tort, avec et sans la consigne.
  S'il ne tient pas, le plan s'arrête là et le dit ; la phrase fixe en filet serait un autre plan.
- Quand sa réponse est dite à voix haute et qu'un poste est offert, sa consigne lui demande une courte phrase avant
  l'appel. À l'écrit, la consigne ne change pas.
- Cette phrase sort à la voix **avant** que le poste ait répondu, même seule et sans rien derrière elle.
- Au second appel, elle sait qu'elle l'a déjà dite et ne la redit pas.
- Coupée pendant l'attente, après cette phrase, ce que le poste a préparé n'est pas perdu.
- La durée d'une délégation faite en conversation est écrite avec elle.

**À valider par CrOliX.**

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-anima`, `feat/phrase-attente` | à ouvrir à la validation | `standard` |
| `lun-docs`, `docs/phrase-attente` | la même | `trivial` |

## Ce que le code fait aujourd'hui

- Le premier appel au modèle peut rendre du texte et un appel d'outil. Ce texte part à la voix phrase par phrase,
  mais **une phrase n'est tenue pour finie que si une autre commence derrière elle**. Une phrase seule, « Je regarde
  tes mails. », reste donc en attente jusqu'au premier mot du second appel, c'est-à-dire après le poste. Le cadrage
  disait le contraire ; il est corrigé.
- Le second appel, qui lui fait dire le résultat, ne reçoit pas ce qu'elle a dit au premier.
- Le message gardé est le texte du premier appel, puis ce qu'elle dit du résultat ; il est rejoué tel quel au modèle
  aux tours suivants, sans trace de l'outil.
- Coupée sans qu'un mot ait été entendu, après un poste qui a préparé des cartes, le résumé du poste est gardé
  (chantier du 10/11). Si un mot a été entendu, seuls ses mots restent : avec une phrase d'attente, ce serait
  toujours le cas, et le résultat serait perdu.
- La consigne des postes ne demande aucun mot avant l'appel, et ne sait pas si la réponse sera dite : ce signal
  existe à l'entrée du tour, pas là où la consigne est écrite.
- Une délégation est enregistrée par trois chemins (la conversation, le geste « fait », la nuit), sans durée.

## Tâches

1. - [ ] **La consigne.** Savoir, là où elle est écrite, que la réponse sera dite. Alors, si au moins un poste est
   offert, une phrase de plus en fin de consigne des postes (pour ne pas défaire le cache du début) : avant
   d'appeler un poste, dire en quelques mots ce qu'elle va regarder ou faire, sans annoncer de résultat ni promettre
   de réussite ; rien de tel avant les autres outils. Tests : présente à la voix, absente à l'écrit, absente sans
   poste.
2. - [ ] **Le comptage sur le vrai modèle**, depuis le laptop, avant tout autre code. Le script importe la consigne et
   les outils du code, joue seulement le premier appel, n'appelle aucun poste, n'écrit jamais d'en-tête ; la clé
   reste dans l'environnement. Deux passes de chaque série, **avec la consigne et sans elle** :
   - vingt demandes qui relèvent d'un poste ;
   - vingt qui n'en relèvent pas : conversation, heure, avis, météo, relire un fil, voir une carte, trancher une
     carte, un poste injoignable ;
   - dix demandes de poste précédées de trois tours passés de la forme « phrase d'attente, puis résultat », pour
     voir si elle imite la phrase sans appeler l'outil.

   Compter : phrase puis appel ; appel sans un mot ; **phrase sans appel** (le pire : elle annonce et ne fait rien) ;
   phrase à côté d'un autre outil. **Le plan s'arrête ici** si, sur les deux passes, elle appelle sans un mot plus
   d'une fois sur quatre, ou annonce sans appeler ne serait-ce que deux fois, ou si le témoin sans consigne fait
   aussi bien.
3. - [ ] **Avant le poste.** Avant d'exécuter un outil, ce qu'elle a déjà dit part à la voix, même une phrase seule.
   Test, qui échoue aujourd'hui : avec le faux modèle, « Je regarde tes mails. » puis l'appel ; la phrase est
   publiée avant que le poste ait répondu, et une seule fois.
4. - [ ] **Le second appel sait.** Ce qu'elle a dit au premier appel lui est rendu comme sa propre parole avant le
   résultat. Test : le second appel reçoit la phrase ; le message gardé porte la phrase, puis le résultat.
5. - [ ] **Coupée pendant l'attente.** Si le poste a préparé des cartes et que rien du résultat n'a été dit, le
   message garde ses mots entendus puis le résumé du poste. Test : coupée après la phrase d'attente, le résumé et
   les cartes restent ; coupée au milieu du résultat, comme aujourd'hui.
6. - [ ] **La durée**, pour la conversation seulement : une colonne facultative, en millisecondes, du départ de la
   demande à la réponse du poste, échec compris. Test : une délégation faite, une échouée ; une base d'avant la
   colonne s'ouvre encore.
7. - [ ] Relecture séparée du diff, PR en brouillon, ce plan coché avec le comptage, et dans la feuille de route
   (§ 4) ce que le desktop doit entendre : une demande de mails à la voix, le blanc avant et après.

## Hors périmètre

- La phrase fixe du code en filet, les relances à intervalle : seulement si le comptage ou les durées le demandent.
- La durée des délégations de la nuit et du geste « fait » ; la montrer dans le Journal.
- « Attendre par le sens » : le cadrage suivant.

## Limites

- Le comptage se fait sans le contexte d'une vraie journée (mémoire, cartes, long fil) : un taux pris sur des
  demandes fabriquées, pas sur l'usage.
- Le blanc restant après la phrase (la durée du poste, plus le premier mot du second appel) ne se mesure que sur le
  desktop, où les postes tournent.
- Le comptage coûte une centaine d'appels au modèle, tous courts.
- Non vérifié : que Lun'Luxuria joue chaque phrase dès qu'elle la reçoit, sans attendre la fin du tour. Le code lu
  le 11/11 le fait ; à entendre.

## Ce que le plan-challenger a changé

1. Une phrase seule ne sortait pas avant le poste : la tâche 3 la fait partir, avec un test qui échoue d'abord.
2. Coupée après la phrase d'attente, le résultat du poste était perdu : tâche 5.
3. Le second appel ignorait la phrase : tâche 4.
4. Le rejeu du fil peut lui apprendre à annoncer sans faire : dix demandes du comptage le cherchent.
5. Ses tournures répétées ne sont pas relevées d'elles-mêmes : la ligne est retirée.
6. « À la voix » n'était pas dit au bon endroit du code : tâche 1.
7. La durée ne vaut que pour la conversation.
8. Le comptage a un témoin, deux passes, le pire cas compté à part, et des seuils plus stricts ; il passe avant le
   reste du code.
9. La phrase de consigne va en fin, pour le cache.
