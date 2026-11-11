# La coupure qui se reprend, l'urgence devant, le tour à l'essai borné. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** qu'un bruit ne coûte plus une réponse. Aujourd'hui, 400 ms de son pendant qu'elle parle arrêtent sa réponse
pour de bon, que ce soit une phrase pour elle, une toux ou un mot dit à quelqu'un d'autre. Et deux petits défauts de la
même file : une urgence attend derrière toute la réponse en cours, et le tour à l'essai repart à chaque pause sans
limite.

**Source :** l'étude [« La présence : où nous en sommes »](../specs/2026-11-10-presence-etat-comparaison.md), § 3.3,
3.4 et 3.6 (écarts 4, 5 et 7) ; le chantier [« le tour de parole »](2026-11-10-tour-de-parole.md), qui a déjà traité
la réponse pas encore commencée. Code relu sur `main` de Lun'Luxuria après lun-luxuria#56 : `src/conversation.ts`,
`src/speech/speaker.ts`, `src/listen/endpoint.ts`, `src/listen/filter.ts`. Plan relu par le plan-challenger le
11/11 : « à amender », ses sept objections sont reprises ici (voir la fin).

**Critères de fin :**

- Un son tenu pendant qu'elle parle **suspend** sa réponse au lieu de la jeter. Si ce qui a été dit était pour elle,
  la coupure devient réelle, comme aujourd'hui. Sinon (bruit, rien de transcrit, phrase écartée par le filtre, micro
  arrêté), elle reprend à la phrase interrompue.
- Le serveur n'apprend une coupure que si elle est réelle, avec les mots entendus.
- « Arrête », dit sans son nom au milieu d'une longue réponse, coupe toujours.
- Une urgence (P0) passe devant ce qui attend : elle sonne après la phrase en cours, et la réponse reprend ensuite.
- Le tour à l'essai est borné, si le banc montre que la borne sert.
- La coupure a toujours son interrupteur ; le bouton « la faire taire » reste définitif.

**À valider par CrOliX.**

| Dépôt, branche | Issue | Niveau |
|---|---|---|
| `lun-luxuria`, `feat/coupure-reprise` | à ouvrir à la validation | `standard` |
| `lun-docs`, `docs/coupure-reprise` | la même | `trivial` |

## Ce que le code fait aujourd'hui

- **La coupure** (`conversation.ts`, `onEndpoint`, cas `held`) : après 400 ms de voix (`holdMs`), si elle parle,
  `#cutOff` arrête le son (`speaker.stop()`, ou la fin de la phrase en mode doux) et dit tout de suite au serveur ce
  qui a été entendu (`brain.cut`). Rien ne revient en arrière. Cela arrive **avant** de savoir ce qui a été dit : la
  transcription ne vient qu'à la fin de la phrase.
- **La réponse pas encore commencée** (`#holdBack`, `#letGo`, `#supersede`, depuis lun-luxuria#51) : retenue pendant
  qu'il parle ; relâchée si sa phrase n'était pas pour elle, jetée si elle l'était. La règle est celle qu'on veut
  pour la réponse en cours, mais ce chemin ne la porte pas : il suit `#unheard`, vidé au premier son, et ne connaît
  ni un rituel, ni une parole spontanée, ni une urgence, ni la réponse à un message écrit.
- **`speaker.stop()`** jette tous les tours, y compris celui que le tour à l'essai de la phrase en cours vient de
  réserver. Aujourd'hui sans effet, parce que `stop()` part avant que ce tour existe.
- **La file** (`speaker.ts`) : les tours sonnent dans l'ordre d'arrivée, et le tour qui sonne est toujours le
  premier. `onLive` connaît la raison d'une parole (`why`) mais ne s'en sert que pour la sourdine.
- **Le tour à l'essai** : à chaque `pause` sans essai en cours, la phrase entière est transcrite et envoyée ; à chaque
  `resume`, l'essai est retiré.
- **Le filtre** (`filter.ts`) : pendant 15 s après sa parole, toute phrase passe sans son nom. Ce moment est noté au
  premier son d'un tour, pas à chaque phrase : au-delà de 15 s d'une longue réponse, « arrête » sans son nom serait
  écarté. Aujourd'hui cela ne se voit pas, puisque la coupure précède le filtre.

## Ce qui change

1. **`Speaker` sait suspendre le tour qui sonne.** Suspendre : le son s'arrête, la phrase interrompue redevient la
   prochaine, le tour est retenu (le `held` qui existe). `speaking` devient donc faux, et `release` le reprend à
   cette phrase, depuis son début. Une méthode de plus rend les mots entendus avant la suspension et ne retire **que
   ce tour**. L'état vit dans `Speaker` seul : le bouton et la sourdine appellent `stop()` sans passer par
   `Conversation`.
2. **`Conversation` suspend au lieu de couper.** Sur `held`, si elle parle : suspension, rien au serveur. Reprendre
   et couper pour de bon sont appelés en tête de `#letGo` et de `#supersede`, avant leurs sorties, et ne font rien
   s'il n'y a pas de tour suspendu. La reprise ne rallume pas « elle réfléchit ». En mode doux, la phrase en cours se
   finit, puis le tour est retenu de la même façon.
3. **La fenêtre du filtre suit sa parole** : le moment de sa dernière parole est rafraîchi à chaque phrase qui
   sonne, et à la suspension.
4. **L'urgence devant.** Une parole `p0` entre après la phrase qui sonne et après les urgences déjà en file, avant
   le reste. `stop()` et `stopAfterSentence()` lisent le tour qui sonne, plus le premier de la file.
5. **Les bornes de l'essai**, si le banc dit qu'elles servent : pas de quatrième essai dans une phrase ; pas d'essai
   au-delà de dix secondes depuis son début.

## Tâches

1. - [ ] **Compter d'abord, sur le banc** : les pauses par phrase au silence de 700 ms, sur les 163 fichiers. Si
   moins d'une phrase sur vingt dépasse trois pauses et qu'aucune ne dépasse dix secondes, la tâche 6 est retirée et
   le plan le dit.
2. - [ ] **Suspendre, dans `Speaker`.** Tests d'abord (`speaker.test.ts`) : suspendu au milieu d'une phrase, le son
   s'arrête et `speaking` est faux ; relâché, la même phrase resonne depuis son début, puis la suite ; coupé pour de
   bon pendant la suspension, il rend les mots entendus avant elle, et un autre tour déjà réservé sonne ensuite ;
   une phrase en fabrication au moment de la suspension ne sonne pas avant la reprise ; `stop()` pendant une
   suspension reste définitif.
3. - [ ] **La coupure en deux temps, dans `Conversation`.** Tests d'abord (`conversation.test.ts`) :
   - phrase pour elle, essai en service : la réponse suspendue est coupée, `brain.cut` reçoit les mots entendus une
     seule fois, et **la réponse à la phrase qui coupe sonne** ;
   - phrase filtrée, transcription vide, transcription en échec, micro arrêté, sourdine : elle reprend, le serveur
     n'entend rien ;
   - la parole suspendue n'est pas une réponse à la voix (rituel, parole spontanée, réponse à un message écrit) :
     mêmes issues ;
   - une seconde phrase commence pendant la transcription de la première : la réponse à la première ne sonne pas
     par-dessus ;
   - mode doux ; coupure éteinte (rien ne change) ; bouton « la faire taire » pendant une suspension.
4. - [ ] **La fenêtre du filtre.** Test : coupée à vingt secondes d'une longue réponse par une phrase sans son nom,
   la coupure est réelle.
5. - [ ] **L'urgence devant.** Tests : arrivée pendant une réponse de trois phrases, elle sonne après la première et
   les deux autres suivent ; deux urgences sonnent dans leur ordre d'arrivée ; arrivée pendant une suspension, elle
   sonne ; le bouton, pendant qu'une urgence attend, rend le tour qui sonnait et ses mots. Raccourci noté dans le
   code : la synthèse reste dans l'ordre d'arrivée, donc l'urgence attend les phrases déjà en fabrication.
6. - [ ] **Les bornes de l'essai** (si la tâche 1 les garde). Tests : quatre pauses dans une phrase, trois essais ;
   une phrase de douze secondes, aucun essai après dix ; la fin de phrase répond dans les deux cas.
7. - [ ] **La chaîne entière sur le banc** : un mot court et un silence de `banc-sons`, rejoués comme « son pendant
   qu'elle parle » à travers la détection, la fin de phrase et la conversation, transcription simulée : l'un coupe,
   l'autre reprend.
8. - [ ] Relecture séparée du diff, PR en brouillon, ce plan coché, et la liste d'écoute du desktop complétée dans la
   feuille de route (§ 4).

## À trancher par CrOliX

- **Reprendre au début de la phrase interrompue**, et non au milieu du son (LiveKit reprend au milieu). Je
  recommande le début : une demi-phrase ne se comprend pas, et le code n'a pas à garder une position dans un son.
- **L'urgence ne coupe pas la phrase en cours** : elle attend sa fin, quelques secondes au plus. Je recommande cela ;
  l'autre choix est qu'elle coupe net.

## Hors périmètre

- La phrase d'attente pendant une délégation (§ 3.5) : c'est une décision de ce qu'elle dit, donc du serveur ; à
  cadrer à part.
- Dire d'attendre par le sens (« attends, laisse-moi réfléchir ») : au serveur.
- Ignorer un « hm hm » par les mots (LiveKit) : demande une transcription pendant qu'on parle, que nous n'avons pas.
- Le fragment à l'essai qui part avant l'annonce du retour (lun-luxuria#53).

## Limites

- Le temps de la suspension est celui de la phrase entendue, plus 700 ms de silence, plus la transcription : pour une
  toux, environ 1,5 s de blanc avant la reprise. LiveKit attend 2 s.
- Dans les 15 s qui suivent sa parole, une phrase dite à quelqu'un d'autre passe le filtre : elle coupera pour de
  bon. Seul le sens pourrait le savoir.
- Après une toux, elle peut reprendre alors qu'une nouvelle phrase a déjà commencé : `held` n'est émis qu'une fois
  par phrase. Le défaut existe déjà pour une réponse retenue ; il devient audible. Elle sera suspendue de nouveau
  400 ms plus tard. À entendre avant de le corriger.
- Son propre son repris par le micro peut encore déclencher une suspension ; l'annulation d'écho du navigateur est la
  seule garde. Elle reprendrait d'elle-même, mais en boucle si l'écho est constant : à entendre sur le desktop.
- Rien de ce plan ne s'entend sur le laptop : les preuves sont des tests et le banc.

## Ce que le plan-challenger a changé

1. La coupure réelle ne retire que le tour suspendu : `stop()` aurait jeté aussi la réponse à la phrase qui coupe.
2. L'état suspendu vit dans `Speaker`, et la reprise comme la coupure sont appelées avant les sorties de `#letGo` et
   `#supersede` : le chemin existant ne connaît pas une réponse qui sonne, ni une parole sans phrase d'origine.
3. La fenêtre du filtre est rafraîchie à chaque phrase : sinon « arrête » après 15 s ne coupait plus.
4. Suspendre passe par le `held` du tour, donc `speaking` devient faux : une seconde phrase retient la réponse
   suivante au lieu de la laisser sonner par-dessus.
5. L'urgence entre après les urgences en file, et l'arrêt lit le tour qui sonne.
6. La reprise sur une phrase déjà commencée est écrite en limite.
7. Le comptage du banc passe en tête et décide des bornes de l'essai.
