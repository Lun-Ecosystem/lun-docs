# Petits gestes de présence : voix neutre, coupure, temps écoulé, citation, souvenirs. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-anima#147, `niveau:standard`, privée. Chantier de la carte des flux, étape 2 du
> découpage.
>
> **État : rédigé le 25/11.** À contester, puis à valider par CrOliX (« Questions à CrOliX »).
>
> Code relu sur `main` de Lun'Anima (`7595342`). Le graphe d'abord, puis chaque point dans le code. Lun'Anima est
> privé : ce plan dit le comportement, les critères, les tâches et les preuves. Les fichiers, les lignes, les noms et
> les textes du core sont dans un commentaire de l'issue privée ([`securite.md`](../../standards/securite.md),
> « Dépôts publics »).

**But :** cinq petits gestes du core, sans toucher aucun flux entre les dépôts. Le code ne dit plus « je ». Une
réponse coupée se sait coupée. Natsume sait le temps passé entre deux messages. Un souvenir dit « dit » cite vraiment.
À chaque tour, quelques souvenirs proches des mots de CrOliX lui reviennent.

**Source :** la spec de la [carte des flux](../specs/2026-11-25-carte-des-flux-design.md) (Lun-Ecosystem/lun-docs#216,
validée le 25/11, le lien vit à sa fusion) : § 5.3 (une seule voix), § 6 (P1, P3, P4, P5, P6), § 11 étape 2. La
confrontation du 25/11 avec OpenAmika, lue sur le code des deux côtés : la ligne de temps écoulé au-delà de 20 min, la
marque d'un tour coupé, l'en-tête du bloc de mémoire et la citation vérifiée par le code viennent de là, réécrits chez
nous.

**Critères de fin**, figés dans l'issue, chacun prouvé en local :

1. **P4, une seule voix** : les quatre phrases fixes du code qui disent « je » deviennent neutres (le code dit « tu »
   ou nomme). Un test garde chacune. Tâche 1.
2. **P3, la coupure** : une réponse coupée entre dans l'historique avec la seule marque « (coupée ici) », sans le
   texte non dit. Un test le prouve. Tâche 2.
3. **P5, le temps écoulé** : quand deux messages sont à plus de 20 min l'un de l'autre, une ligne de temps écoulé
   s'insère dans l'historique envoyé au modèle. Des tests couvrent la borne. Tâche 3.
4. **P6, la citation** : la nuit refuse un souvenir marqué « dit » dont la citation ne se retrouve pas mot pour mot
   dans les messages du jour, ou le passe en « déduit ». Des tests couvrent les deux cas. Tâche 4.
5. **P1, les souvenirs à chaque tour** : à chaque tour, le code rappelle au plus 5 souvenirs par une recherche de mots
   en base, sans appel au modèle, sous la consigne « réponds depuis ceci ou dis que tu ne t'en souviens pas ». Des
   tests couvrent un tour sans souvenir et un tour avec. Tâche 5.
6. **La forme envoyée au modèle est gardée en entier par les tests** : ce qui change est voulu, rien d'autre ne bouge.
   Tâche 0, puis chaque tâche.
7. `npm run check` est vert. Toutes les tâches.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-anima` : 6 tâches (0 à 5), une PR | dans l'issue privée | Lun-Ecosystem/lun-anima#147 | `standard` |
| `lun-docs` : ce plan et ses coches | `docs/plan-gestes-presence` | la même | `trivial` |

**Le niveau.** `standard`, celui de l'issue. Du code du core seul, sans dépendance au contrat 1.5. Aucun écran ne
change de forme, aucune route, aucun contrat. Une seule migration possible, et seulement si CrOliX choisit de garder
la marque de coupure hors de l'écran (question 3). Chaque comportement changé a son test, écrit d'abord par le
testeur ([`workflow.md`](../../standards/workflow.md)). Une PR dans Lun'Anima ; ce plan va dans la PR lun-docs du
chantier. Pas de Chrome.

## Ce que le code fait aujourd'hui

### Ce que reçoit le modèle à chaque tour

- **Un tour** envoie un tour système, puis le fil. Le tour système met bout à bout le préfixe stable (le socle et le
  tempérament), les règles des outils et le contexte du tour : la date, le contexte chaud du matin, l'heure, puis la
  situation (fil principal seulement, 1 500 signes au plus).
- **Le fil** : les messages réussis du fil, avant le tour en cours, 40 au plus et 24 000 signes au plus. Le fil
  principal repart chaque matin à 5 h, avec les six messages d'avant. Un sujet garde son historique, sur plusieurs
  jours. Chaque message est rejoué dans son rôle natif ; un message à outil devient l'appel, son résultat, puis la
  suite de la réponse.
- **Un tour à outil** fait deux appels, qui lisent le même contexte. **Un tour qu'elle prend d'elle-même** (le
  rituel d'arrivée, la parole spontanée) passe par un autre chemin, sans message de CrOliX à lire.
- **Aucune garde ne compare la requête entière.** Les tests lisent ce que reçoit le faux fournisseur, mais n'y
  cherchent qu'un morceau. Le critère 6 demande plus : la tâche 0 pose cette garde.

### Les phrases fixes en « je » (P4)

- Le code écrit quatre phrases à la première personne, et chacune devient **son message** : stocké, dit à voix haute,
  rejoué au modèle comme ses propres mots. Un poste injoignable ; une carte qu'elle n'a pas pu relire ; sa journée
  qu'elle n'a pas pu relire ; une carte que son message ne tranche pas. La première sert aussi de raison sur l'accueil.
- **Deux autres phrases** parlent à la première personne, hors des quatre de l'issue : une carte qui attend un choix
  (« dis-moi »), une carte qui a changé depuis qu'elle l'a lue (« je »). Voir la question 2.
- L'annonce d'une urgence est déjà neutre. Les « je » des commandes de recette, des scènes, des tics et des exemples
  du socle ne sont pas des phrases du code : ils sont hors de la règle.

### La coupure (P3)

- Quand CrOliX coupe une réponse, le core réécrit le message à ce qu'il a entendu, et efface les données d'outil dans
  la même écriture : le non-dit ne revient jamais au modèle. Rien d'entendu : le message sort du fil.
- **Aucune marque ne dit qu'elle a été coupée.** Au tour suivant, sa réponse revient comme si elle s'était arrêtée là
  d'elle-même. Une seule fonction fait cette réécriture, pour les cinq chemins d'une coupure.
- Cas à part : coupée pendant la phrase d'avant un poste qui a déjà préparé des cartes, la réponse reste entière, pour
  qu'elle ne redemande pas au poste. Ce cas ne change pas (« Hors périmètre »).
- Le texte stocké est relu par le rejeu, par la situation, par l'outil qui relit sa journée, par le tri de nuit et par
  l'écran de conversation.

### Le temps entre deux messages (P5)

- Le contexte donne l'heure du tour. La situation dit depuis quand CrOliX n'a rien écrit : son absence au-delà de 12 h,
  ou l'heure de son dernier message en deçà.
- **Rien ne dit le temps passé à l'intérieur du fil.** Deux messages à trois heures d'écart se suivent comme deux
  messages à une seconde. Chaque message porte pourtant l'heure de sa création.

### La provenance d'un souvenir (P6)

- Le tri de nuit rend, pour chaque souvenir, un texte du point de vue de Natsume, sa réaction, une référence à
  l'élément de la journée qui le source, et une provenance : « dit » pour ce que CrOliX ou Natsume ont dit eux-mêmes,
  « déduit » pour le reste. La forme est stricte sur OpenAI.
- **Le code vérifie que la référence existe, rien de plus.** Aucune citation n'est demandée : un souvenir « dit » peut
  prêter à CrOliX une phrase qu'il n'a pas dite. Le portrait et le contexte chaud lisent la provenance, et tiennent un
  « déduit » pour une hypothèse.
- Le tri d'une part est gardé avant que ses souvenirs s'écrivent : une nuit reprise relit ce tri gardé. Un souvenir
  écrit n'est jamais réécrit.

### Les souvenirs dans le tour (P1)

- **Les souvenirs ne reviennent que par le contexte chaud du matin** : les 30 derniers sur 7 jours, résumés par le
  modèle à 5 h. Un souvenir de trois semaines ne revient que si le résumé le reprend.
- **Le core n'a aucune recherche de mots sur les souvenirs.** Il les lit tous, dans l'ordre. Il n'utilise pas la
  recherche plein texte de SQLite ; elle marche sur la version de Node de l'image (essayée le 25/11).
- **Une recherche de mots existe déjà**, celle de l'outil qui relit sa journée : mots repliés (casse, accents,
  apostrophes), de trois signes au moins, rangés par nombre de mots touchés, puis par le mot le plus rare, puis par le
  plus récent. Elle lit les messages et le Journal d'une journée, pas les souvenirs.
- Un souvenir tient en 2 000 signes au plus, sa réaction aussi ; la consigne du tri en demande une phrase chacun. Le
  contexte chaud coupe la réaction à 400 signes.

## Les choix

### P3 : où poser la marque

- **A. Dans le texte gardé (recommandé).** La réécriture d'une coupure ajoute « (coupée ici) » après ce qui a été
  entendu. Une ligne, pour les cinq chemins. Le rejeu, la relecture de sa journée et le tri la lisent sans changer.
  Ce qu'elle laisse : la marque se lit aussi dans l'écran de conversation (question 3).
- **B. Au rejeu seulement.** Le message garde le texte entendu ; une marque de coupure est gardée à part, et le rejeu
  l'ajoute. Une migration, un champ, et le tri ne la voit pas.

### P5 : où poser la ligne de temps écoulé

- **A. En tête du message qui suit l'écart (recommandé).** Message de CrOliX : la ligne ouvre son contenu. Message de
  Natsume (parole spontanée, rituel, point du matin) : la ligne part dans un tour à part, au rôle de CrOliX, juste
  avant. Jamais dans un tour à son nom : elle pourrait la recopier et la dire à voix haute.
- **B. Toujours dans un tour à part.** Un tour de plus par écart, même devant un message de CrOliX.
- **C. Dans le contexte du tour.** Il ne dirait que le dernier écart, pas où il tombe dans le fil. Écarté.

La ligne ne dépend que des heures des deux messages : d'un tour à l'autre, le même fil donne la même ligne. Les
fournisseurs qui gardent en cache le début de la requête ne perdent rien.

### P6 : refuser ou passer en « déduit »

- **A. Passer en « déduit » (recommandé).** Le souvenir reste, comme hypothèse.
- **B. Refuser.** Le souvenir n'est pas écrit.

**La raison de A.** La nuit ne trie une part qu'une fois, et un souvenir n'est jamais réécrit : un refus le perd pour
toujours, sans que personne le voie, ni le corrige (la relation n'est pas supervisée). Or la cause la plus probable
d'un échec n'est pas l'invention, c'est une citation à peine reformulée : un mot changé, une transcription de la voix
recopiée de travers. « Déduit » existe pour ce cas, et tout ce qui lit les souvenirs le tient déjà pour une hypothèse.
Le risque de A : un souvenir inventé survit, marqué hypothèse. Le risque de B : des souvenirs vrais disparaissent.
Question 1.

**Où vérifier.** Au moment où les souvenirs s'écrivent, depuis les messages de la journée gardés avec la part. Une
part triée avant la mise à jour n'a pas de citation : ses « dit » passent en « déduit ».

### P1 : quelle recherche de mots

- **A. La recherche de l'outil de relecture, appliquée aux souvenirs (recommandé).** Une requête lit les souvenirs en
  base, le code les classe comme la relecture le fait déjà, avec les mêmes mots repliés. Aucune migration. Les
  souvenirs se comptent en centaines par an : les lire à chaque tour ne coûte rien de mesurable.
- **B. La recherche plein texte de SQLite.** Une table virtuelle, sa migration, son remplissage depuis les souvenirs
  existants, et la purge des secrets à tenir sur deux tables. Un rang meilleur sur de gros volumes, que nous n'avons
  pas. Gardée pour quand le rappel par le sens arrivera (Lun-Ecosystem/lun-anima#146).

**Les mots vides.** Avec trois signes au moins, « les », « pas » ou « que » touchent presque chaque souvenir : cinq
souvenirs reviendraient à chaque tour, sans lien. La liste de mots vides français que le core a déjà, partagée avec
la relecture plutôt que copiée, les écarte.

### P1 : le coût en jetons ajouté à chaque tour

Estimation depuis les bornes, à mesurer par la tâche 5 : la base locale ne porte qu'un souvenir, pas assez pour un
relevé. Environ 3,5 signes par jeton, en français avec la forme de données.

| Cas | Signes | Jetons |
|---|---|---|
| Aucun souvenir ne répond | 0 | 0 |
| L'en-tête et sa consigne | environ 150 | environ 40 |
| Un souvenir d'une phrase, avec sa réaction et sa forme | environ 300 | environ 85 |
| Cinq souvenirs d'une phrase (le cas courant quand ça répond) | environ 1 650 | environ 470 |
| Cinq souvenirs aux bornes (texte coupé à 400 signes, réaction à 200) | environ 3 500 | environ 1 000 |

- Ces jetons s'ajoutent après le préfixe gardé en cache : ils se paient au prix plein à chaque tour.
- Un tour à outil fait deux appels avec le même contexte : il les paie deux fois.
- Un tour qu'elle prend d'elle-même n'a pas de rappel : aucun coût.
- À comparer : le fil seul va jusqu'à 24 000 signes, la situation jusqu'à 1 500. Le cas courant ajoute environ un
  quinzième d'un fil plein.

## Tâches

**Barrières de chaque tâche** : celles de Lun'Anima, dans l'issue privée. Les tests de comportement s'écrivent
d'abord et sont rouges sur `main` ; les gardes, vertes sur `main`, fixent ce qui ne doit pas bouger. Chaque test dit
lequel il est. Les fichiers et les noms sont dans l'issue privée.

0. - [ ] **La garde de la forme envoyée** (`testeur`). **D'abord, avant toute autre tâche.**
   - Gardes, vertes sur `main`, à heure fixe : la requête entière (tour système et fil), comparée en entier, pour un
     tour écrit, un tour dit, un tour à outil (ses deux appels), un tour qu'elle prend d'elle-même, et l'appel du tri.
     Sur les deux fournisseurs, avec leurs faux serveurs.
   - Le fil de ces gardes porte deux messages à plus de 20 min d'écart et un mot d'un souvenir en base : sans quoi les
     tâches 3 et 5 ne changeraient rien à la forme gardée, et la garde ne prouverait rien.
   - Ensuite, chaque tâche change cette attente de ce qu'elle veut, et de rien d'autre ; le diff de l'attente se relit
     à la revue.
   - Exclu : tout code de production.
1. - [ ] **P4, une seule voix** (`testeur`, puis `dev-core`). **En parallèle de la tâche 4.**
   - Tests rouges sur `main` : pour chacune des quatre phrases, son texte exact, et aucune première personne (« je »,
     « moi », « me », « mon »…) dans le texte replié. Les textes proposés sont dans l'issue privée.
   - Gardes : les tests existants qui importent ces phrases restent verts ; ceux qui en gardent une copie littérale
     la suivent. L'annonce d'une urgence ne change pas.
   - Code : les quatre phrases nomment le poste ou disent « tu ». Leur emploi ne change pas.
   - Exclu : les deux autres phrases (question 2), le standard de la voix (étape 1 du découpage), la lettre du matin,
     le Journal, « Ce que j'ai fait ».
2. - [ ] **P3, la coupure** (`testeur`, puis `dev-core`). **Après la tâche 1, dans le même worktree.** Écrite pour A.
   - Tests rouges sur `main` : une réponse coupée en cours de route, puis un tour : le fil envoyé porte ce qui a été
     entendu, suivi de « (coupée ici) », et aucun mot du non-dit. Le même pour une réponse finie avant la fin de la
     voix, et pour un tour coupé pendant un outil.
   - Gardes : rien d'entendu, le message sort du fil, sans marque ; une réponse entière n'a pas de marque ; le cas des
     cartes déjà préparées reste entier.
   - Code : la réécriture d'une coupure ajoute la marque après le texte entendu. Une seule fonction, pour les cinq
     chemins.
   - Exclu : la coupure côté Luxuria, le cas des cartes déjà préparées, le tri de nuit.
3. - [ ] **P5, le temps écoulé** (`testeur`, puis `dev-core`). **Après la tâche 2, dans le même worktree.** Écrite
   pour A.
   - Tests rouges sur `main`, sur la forme seule (fonction pure), puis sur le fil envoyé :
     - deux messages à 20 min et 1 s : une ligne ; à 20 min tout juste : aucune ; à 19 min : aucune ;
     - la ligne dit l'heure du message et l'écart (minutes, heures et minutes, jours au-delà de 24 h), à l'heure de
       Paris, changement d'heure compris ;
     - devant un message de CrOliX, en tête de son contenu ; devant un message de Natsume, dans un tour à part au rôle
       de CrOliX ; jamais dans un tour à son nom ;
     - le fil principal après 5 h : la ligne entre les messages de la veille et ceux du jour.
   - Gardes : le même fil rejoué deux fois donne la même requête ; un fil sans écart ne change pas ; un message à
     outil garde ses trois tours.
   - Code : le rejeu du fil ajoute la ligne là où deux messages consécutifs sont à plus de 20 min. La situation ne
     change pas.
   - Exclu : l'heure du tour, la situation, le temps depuis la fin de sa voix.
4. - [ ] **P6, la citation** (`testeur`, puis `dev-core`). **En parallèle des tâches 1 à 3 et 5 : aucun fichier
   commun.** Écrite pour A ; avec B, « passe en déduit » devient « n'est pas écrit ».
   - Tests rouges sur `main`, sur une nuit au tri scripté :
     - un souvenir « dit » dont la citation se trouve mot pour mot dans un message du jour (casse, accents, apostrophes
       et blancs près) : il reste « dit » ;
     - un souvenir « dit » dont la citation change un mot, ou ne se trouve que dans une alerte ou le bilan : il passe en
       « déduit » ;
     - un souvenir « dit » sans citation : « déduit » ; une part triée avant la mise à jour, sans citation : ses « dit »
       passent en « déduit » ;
     - la forme du tri envoyée porte la citation, et sa consigne la demande.
   - Gardes : un souvenir « déduit » ne change pas ; une citation n'est jamais gardée en base ; le reste de la nuit
     (observations, récit, masquage des secrets) ne change pas.
   - Code : la forme du tri gagne une citation par souvenir, vide pour « déduit ». La consigne gagne une phrase. Au
     moment d'écrire les souvenirs, le code vérifie la citation contre les messages de la journée gardés avec la part,
     et compte au journal du core les souvenirs passés en « déduit ».
   - Exclu : garder la citation, réécrire les souvenirs déjà écrits, le portrait, le tempérament.
5. - [ ] **P1, les souvenirs à chaque tour** (`testeur`, puis `dev-core`). **Après la tâche 3, dans le même
   worktree.** Écrite pour A.
   - Tests rouges sur `main` :
     - la recherche seule : les souvenirs qui touchent le plus de mots d'abord, puis le mot le plus rare, puis le plus
       récent ; 5 au plus ; un mot vide ne touche rien ; casse et accents repliés ;
     - un tour avec : un souvenir ancien d'un mois, hors du contexte chaud, entre dans le tour système sous l'en-tête et
       sa consigne, avec son jour et sa provenance ;
     - un tour sans : aucun mot ne touche, aucun bloc, aucun en-tête ;
     - un tour à outil : les deux appels portent le même bloc ; un tour qu'elle prend d'elle-même : aucun bloc ;
     - le nombre de signes du bloc, relevé sur cinq souvenirs d'une phrase et sur cinq aux bornes, écrit dans la PR.
   - Gardes : aucun appel au modèle de plus ; le préfixe gardé en cache ne change pas ; un souvenir long est coupé à
     ses bornes ; un secret masqué le reste.
   - Code : une recherche de mots sur les souvenirs en base, qui partage les mots repliés et les mots vides de la
     relecture. Son bloc s'ajoute à la fin du contexte du tour, sur les mots du message de CrOliX auquel le tour
     répond.
   - Exclu : la recherche par le sens (Lun-Ecosystem/lun-anima#146), un rappel ancré sur les tours d'avant, la
     relecture de sa journée, le contexte chaud.
6. - [ ] **La revue et la livraison** (`reviewer`, puis `livreur`). **Après 0 à 5.** Le diff relu contre ce plan et les
   standards, et le diff des gardes de la tâche 0 relu ligne à ligne. Une PR Lun'Anima en brouillon, qui ferme
   Lun-Ecosystem/lun-anima#147, avec la sortie des tests rouges devenus verts, la suite entière, les barrières et le
   relevé de la tâche 5. Ce plan coché dans la PR lun-docs du chantier. Après la fusion, le graphe mis à jour.

**L'ordre et le parallèle.**

- La tâche 0 part seule, d'abord : toutes les autres changent son attente.
- Le testeur peut ensuite écrire les tests des tâches 1 à 5 en parallèle : ils vivent dans des fichiers de test
  distincts, sauf l'attente de la tâche 0, que chaque tâche change à son tour.
- Pour le code, deux voies en parallèle. **La tâche 4** (la nuit) ne partage aucun fichier : un `dev-core` à part.
  **Les tâches 1, 2, 3 et 5** touchent toutes le tour de conversation : un seul `dev-core` les enchaîne dans un même
  worktree, de la plus simple à la plus lourde, pour ne pas fusionner quatre fois le même fichier.
- Puis la revue, puis le livreur.

## Ensuite, hors du chantier

- La version du core publiée, puis déployée par la porte, par CrOliX.
- Sur le NAS, après quelques jours : le nombre de souvenirs passés en « déduit » au journal du core, et le coût d'un
  tour avant et après, lus sur l'écran des dépenses.

## Hors périmètre

- P2 : l'ouverture, la règle de fluidité, le budget commun.
- La recherche par le sens (Lun-Ecosystem/lun-anima#146).
- L'écriture du Journal et de « Ce que j'ai fait » (chantier 7 du découpage), la porte d'attention.
- Le standard où s'écrit la règle de la voix : étape 1 du découpage, les textes.
- La marque sur une réponse coupée avant un poste qui a déjà préparé des cartes : elle reste entière, sans marque.
- Garder la citation d'un souvenir, ou la montrer.
- Les souvenirs déjà écrits : leurs « dit » ne sont pas revérifiés.
- Un rappel ancré sur les tours d'avant, comme OpenAmika le fait pour les relances.

## Limites

- **La recherche de mots ne trouve que les mots.** « voiture » ne rappelle pas « auto ». Le rappel par le sens le
  réglera (Lun-Ecosystem/lun-anima#146).
- **Un mot fréquent mais plein** (un prénom, « projet ») peut rappeler des souvenirs sans lien. Le rang par mot rare
  le limite ; la consigne laisse Natsume dire qu'elle ne s'en souvient pas.
- **Le rappel ne lit que la dernière phrase de CrOliX.** « Et lui, il en pensait quoi ? » ne rappelle rien.
- **Avec A en P6, un souvenir inventé survit**, marqué hypothèse. Avec B, un souvenir vrai mal cité est perdu.
- **Une citation peut être exacte et le souvenir faux** : le code vérifie les mots, pas ce que le souvenir en tire.
- **Avec A en P3, la marque se lit dans l'écran de conversation**, et dans ce que la relecture de sa journée rend.
- **Le coût de P1 est estimé**, pas mesuré : la tâche 5 le relève.
- **La ligne de temps écoulé suit l'heure de création des messages**, pas la fin de sa voix. À 20 min, l'écart est
  négligeable.

## Questions à CrOliX

1. **P6 : un « dit » mal cité passe en « déduit » (recommandé), ou il est refusé ?** La raison : un refus perd un
   souvenir vrai pour toujours, et la cause probable d'un échec est une citation à peine reformulée (« Les choix »).
2. **P4 : deux autres phrases du code parlent à la première personne**, une carte qui attend un choix et une carte qui
   a changé depuis sa lecture. Les rendre neutres dans ce chantier, avec le même test (recommandé : deux lignes), ou
   les laisser au chantier de l'écriture du core ?
3. **P3 : la marque « (coupée ici) » se lira aussi dans l'écran de conversation.** L'accepter (recommandé : une ligne,
   et l'écran dit vrai), ou la garder hors de l'écran (une migration et un champ) ?
4. **P4 : les quatre phrases neutres proposées**, dans l'issue privée : à valider telles quelles, ou à reprendre ?
