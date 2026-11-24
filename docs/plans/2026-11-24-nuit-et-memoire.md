# La nuit et la mémoire : le contexte chaud tient, la bibliothèque n'apprend que de CrOliX. Plan

> **Pour l'exécution :** superpowers:subagent-driven-development ou superpowers:executing-plans, tâche par tâche.
> Cases à cocher (`- [ ]`) pour le suivi.
>
> **Issue :** Lun-Ecosystem/lun-anima#136 (`niveau:standard`, privé), chantier 1 du
> [recadrage du 24/11](../specs/2026-11-24-recadrage-premiere-nuit.md) (§ 4). Elle ferme Lun-Ecosystem/lun-anima#133
> et porte la part VIP de Lun-Ecosystem/lun-avaritia#46.
>
> **État : rédigé le 24/11 ; contesté le 24/11 ; amendé le 24/11 avec les décisions de CrOliX du 24/11** (« Les
> décisions de CrOliX, le 24/11 »). À valider par CrOliX.
>
> Code relu sur `main` de Lun'Anima (`cb075d4`). La prod tourne sur la 0.2.0, deux commits plus tôt ; aucun des
> fichiers que touche ce chantier n'a changé entre les deux. Lun'Avaritia relu sur sa 0.2.0 pour ce qu'il garde d'un
> envoi. Le graphe d'abord, puis chaque point dans le code ; les six formes de réponse du core produites telles
> qu'elles partent. Lun'Anima est privé : ce plan dit le comportement, les critères, les tâches et les preuves. Les
> fichiers, les lignes, les tests et les commandes du core sont dans un commentaire de l'issue privée
> ([`securite.md`](../../standards/securite.md), « Dépôts publics »).

**But :** le matin, le contexte chaud s'écrit même quand le modèle propose plus de trois recherches. La nuit, la
bibliothèque ne reçoit que ce que CrOliX a dit en conversation. Le bilan d'Acedia sert toujours au récit de la nuit,
et par lui au matin.

**Source :** l'issue et ses critères. Le recadrage du 24/11 : § 2 (la première nuit sur le NAS), § 3 (« La
bibliothèque »), § 4 point 1, § 5 décision 1. La promesse 2 de [`vision.md`](../../vision.md) : « ce qu'elle apprend
en conversation y arrive chaque nuit ». Le constat de Lun-Ecosystem/lun-avaritia#46 : quatre brouillons tirés des
sujets de mails du jour, dont des mails déjà jetés à la main. La mesure du 20/11 sur les réponses structurées
d'Anthropic ([plan des deux fournisseurs](2026-11-20-core-deux-fournisseurs.md), « Réponse structurée »). La
contestation du 24/11 et les décisions de CrOliX du même jour.

**Critères de fin**, ceux de l'issue, le 2 précisé et le 3 reformulé par les décisions du 24/11, chacun prouvé en
local :

1. **Une réponse du modèle à plus de trois recherches ne fait plus échouer le contexte chaud** : test qui rejoue une
   réponse à quatre noms sur le fournisseur Anthropic ; le comportement sur OpenAI ne change pas. Tâches 0 et 1.
2. **La nuit n'envoie à Lun'Avaritia aucune observation tirée du bilan d'Acedia** : test sur une journée qui a un
   bilan et une conversation, seules les observations qui citent un message de CrOliX partent. Tâche 2.
3. **Le bilan d'Acedia reste lu pour le récit de la nuit** : test. Il atteint le matin par le récit et le contexte
   chaud ; la lettre du matin ne l'a jamais lu. Tâches 2 et 3.
4. **Preuve de bout en bout en local** : une nuit rejouée avec un bilan d'Acedia ne donne aucun brouillon tiré d'un
   mail, et le contexte chaud s'écrit. Tâche 3.

| Dépôt | Branche | Issue | Niveau |
|---|---|---|---|
| `lun-anima` : 4 tâches (0 à 3), une PR | dans l'issue privée | Lun-Ecosystem/lun-anima#136 et #133 | `standard` |
| `lun-docs` : ce plan et ses coches | `docs/plan-nuit-memoire` | la même | `trivial` |

**Le niveau.** `standard`, celui de l'issue. Le chantier change ce que la nuit envoie et une vérification du matin.
Aucun écran, aucun contrat : `brain.ingest` reçoit moins d'observations, dans la même forme. Chaque comportement
changé a son test, écrit d'abord par le testeur ([`workflow.md`](../../standards/workflow.md)). Une PR dans
Lun'Anima, qui ferme les deux issues ; ce plan va dans la PR lun-docs du chantier.

## Les décisions de CrOliX, le 24/11

1. **Seuls les messages de CrOliX nourrissent la bibliothèque.** Ni ce que dit Natsume, qui peut résumer un mail ou
   le résultat d'un poste, ni le bilan d'Acedia. Le filtre se fait à l'envoi, par la source citée et le rôle de son
   auteur ; les consignes du tri ne changent pas.
2. **Les alertes urgentes ne partent plus vers la bibliothèque** : ce sont des titres, pas des paroles. Elles restent
   dans le tri, donc dans le récit, et dans la lettre du matin.
3. **Mesurer d'abord si Anthropic impose les longueurs de texte**, par un vrai appel (tâche 0). La clé de mesure du
   core est refusée aujourd'hui : la mesure attend que CrOliX la remplace. Si la borne n'est pas imposée, CrOliX dit si
   la phrase du jour entre dans ce chantier.

## Ce que le code fait aujourd'hui

### Le contexte chaud, au matin

- La routine du matin compose le contexte chaud, puis écrit la lettre du matin. Une composition qui échoue garde le
  contexte de la veille et n'arrête pas la lettre.
- La composition fait deux appels au modèle, chacun avec une forme de réponse imposée. Le premier demande « jusqu'à
  trois » noms à chercher dans la bibliothèque, tirés des souvenirs et des observations de la nuit. La forme les borne
  à trois, chacun de 1 à 60 signes. La bibliothèque est interrogée pour chaque nom (`brain.search`, trois fiches au
  plus par nom). Le second appel écrit le contexte et la phrase du jour.
- Chaque réponse est vérifiée contre sa forme. Hors forme, elle est redemandée une fois ; une seconde réponse hors
  forme fait échouer la composition. Chaque appel est payé.
- **OpenAI** reçoit la forme telle quelle, en mode strict : la borne de trois part avec elle.
- **Anthropic** refuse une taille maximale de tableau dans une forme imposée (400, mesuré le 20/11), comme les bornes
  d'un nombre et une taille minimale de tableau au-delà de 1. Le module d'Anthropic du core retire ces quatre
  mots-clés avant l'envoi, et seulement là. Le modèle peut alors rendre quatre noms. La vérification du core garde la
  borne : elle les refuse deux fois, et le contexte chaud tombe. C'est la première nuit sur le NAS
  (Lun-Ecosystem/lun-anima#133).

### Les autres formes de réponse

- Le core demande six formes au modèle : les recherches et le contexte du matin, le tri de la nuit, le portrait, le
  tempérament, le verdict des scènes. Produites telles qu'elles partent (relevé du 24/11), **seule celle des
  recherches porte un des quatre mots-clés retirés**. Le tempérament demande « au moins trois souvenirs » dans ses
  consignes et le vérifie en code ; sa forme n'en dit rien.
- Les six portent des **longueurs de texte**, minimale et maximale, que le code vérifie aussi : 60 signes pour un nom,
  240 pour la phrase du jour, 2 000 pour une observation, un souvenir, une réaction ou le récit, 4 000 pour le
  contexte, le portrait et le tempérament. Anthropic les accepte, alors que sa documentation les dit non prises en
  charge. S'il les impose n'est pas tranché (mesure du 20/11) : c'est la tâche 0. S'il ne les impose pas, une phrase
  du jour de 241 signes ferait tomber le contexte chaud de la même façon. Aucun cas vu en prod.

### La nuit et la bibliothèque

- Chaque jour se joue d'abord en une part « jour » : les messages des fils, chacun avec son auteur, CrOliX ou Natsume
  (sans le point du matin ni une carte lue à voix haute) ; les alertes urgentes reçues des postes ; le bilan du jour
  d'Acedia (`day.digest` : les mails reçus et ce qui a été fait, par sujet et par heure), avec le nombre de mails en
  attente. Si Acedia, relié, ne répond pas, une part « bilan » s'ouvre à part et se joue à une passe suivante, avec le
  bilan seul.
- Un appel au modèle, le tri, rend des observations (des faits neutres pour la bibliothèque), des souvenirs et un
  récit. **Chaque élément cite un seul élément de la journée** : un message, une alerte ou un élément du bilan. Une
  citation inconnue fait redemander le tri une fois, puis la journée échoue. Le tri est rangé, masqué.
- Puis l'envoi : **toutes les observations partent à Lun'Avaritia** (`brain.ingest`), quelle que soit leur source,
  avec leur origine (la conversation, le poste de l'alerte, Acedia). Puis les souvenirs et le récit vont au journal
  de la relation.
- Chaque étape d'une part se marque faite une fois. Une part envoyée ne se renvoie jamais. Une part dont l'envoi
  attendait Avaritia part à la passe suivante, depuis le tri rangé. Une part sans observation ne fait aucun envoi.
- Un échange déjà noté dans la bibliothèque pendant la journée ne donne pas d'observation : c'est une consigne du tri.
- **Seule la nuit envoie des observations à la bibliothèque** (un seul envoi dans le code).
- **Lun'Avaritia garde la source entière de chaque observation** (genre, origine, référence, heure), et chaque fait
  d'un brouillon reprend celle de l'observation qui le fonde. Il refuse un envoi sans observation. L'origine se lit
  donc sur chaque fait : les quatre brouillons tirés des mails s'y repèrent, et la preuve sur le NAS est réelle.

### Ce que le matin lit du bilan

- La lettre du matin se compose sans modèle : l'état de la nuit, les urgences, les cartes en attente et ce qui vient.
  Elle ne lit pas le bilan, aujourd'hui comme après ce chantier.
- Le bilan atteint le matin par deux voies : le **récit** de la nuit, que le contexte chaud relit (les deux derniers
  jours) ; les **observations du tri rangé**, toutes sources, où le contexte chaud choisit ses noms à chercher. Ce sont
  ces voies que le critère 3 garde.

## Les choix

### 1. Plus de trois noms : garder les trois premiers

- **A. Garder les trois premiers, à la vérification (recommandé).** La vérification des recherches garde les trois
  premiers noms, puis vérifie la forme comme aujourd'hui. La forme envoyée ne change pas : OpenAI reçoit la même
  requête, à l'octet (vérifié le 24/11 sur la version de la bibliothèque de formes du core). Une ligne, au seul
  endroit qui borne un tableau. Le quatrième nom est perdu, comme si la borne avait été tenue ; l'ordre est celui du
  modèle.
- **B. Le module d'Anthropic remet la borne**, en coupant dans la réponse chaque tableau trop long. Il couvrirait les
  formes à venir. Mais il réécrirait la réponse du modèle sans que l'appelant le sache ; « garder les premiers » n'est
  pas juste pour toute forme ; rien de pareil n'existe pour les bornes d'un nombre. Plus de code, pour une seule forme.
- **C. Retirer la borne de la forme, et couper après.** La requête d'OpenAI changerait : contraire au critère 1.
- **D. Chercher tous les noms proposés.** Plus de recherches, plus de fiches dans le second appel, un prompt qui
  grossit sans borne ; et OpenAI devrait suivre pour rester d'accord.
- **E. Redemander, comme aujourd'hui.** C'est ce qui a échoué : la même consigne rend la même réponse.

### 2. Les messages de CrOliX seuls : filtrer à l'envoi

- **A. Filtrer à l'envoi, par la source citée et son auteur (retenu, décision 1).** L'envoi ne garde que les
  observations qui citent un message de CrOliX. Le filtre vient **avant** le test « aucune observation » : une part
  dont rien ne reste ne fait aucun envoi, comme une journée vide. Sinon Avaritia refuserait l'envoi vide, et la
  journée resterait en attente. Le tri, ses consignes et ce qu'il range ne changent pas. Pour : le filtre tient quelle
  que soit la réponse du modèle ; il couvre une part rangée avant le changement et pas encore envoyée ; les consignes
  ne bougent pas, ni leur coût, ni leur instantané de test, ni ce qui a été mesuré sur elles ; le matin garde toutes
  les observations pour choisir ses recherches. Contre : le modèle écrit encore des observations qui ne partent pas,
  quelques dizaines de jetons par nuit.
- **B. Changer les consignes du tri** : n'écrire d'observations que depuis les messages de CrOliX. Rien ne garantit
  qu'un modèle suive la consigne : il faudrait filtrer quand même. Les consignes changeraient (instantané, mesures,
  coût) ; une part rangée en attente d'envoi partirait encore ; le matin perdrait des observations. Écarté.

**Ce qui ne part plus.** Les observations qui citent un message de Natsume : elle peut résumer un mail ou le résultat
d'un poste (l'objection de la contestation). Celles qui citent une alerte urgente (décision 2). Celles qui citent un
élément du bilan. Toutes restent dans le tri rangé, pour le récit, les souvenirs et le matin.

**Ce qui est déjà rangé.**

- Une part déjà envoyée ne se renvoie jamais : rien ne change pour elle.
- Une part dont l'envoi attendait Avaritia part à la passe suivante depuis son tri rangé : le filtre s'y applique,
  puisqu'il est à l'envoi. Un test le tient (tâche 2).
- Les tris rangés gardent toutes leurs observations : le matin les relit pour ses recherches, ce qui est voulu.
- Les quatre brouillons déjà reçus restent dans la bibliothèque : le core ne retire rien de ce qu'il a envoyé. Leurs
  faits portent l'origine Acedia, qui les repère. CrOliX les refuse dans Avaritia ; un refus ne s'y annule pas encore
  (chantier 2 du recadrage).
- Toute nuit jouée avant le déploiement envoie encore le bilan, les alertes et les paroles de Natsume.

### 3. La preuve de bout en bout : rejouée, puis constatée sur le NAS

- **A. Rejouée dans les tests (recommandé pour le critère 4).** Un test joue la vraie nuit puis le vrai matin, dans
  l'ordre, sur le vrai module d'Anthropic face à son faux serveur. Un faux Acedia rend un bilan de mails inventés ; un
  faux Avaritia garde ce qu'il reçoit et répond aux recherches. Les réponses du modèle sont écrites d'avance, pour
  forcer les cas : le tri cite CrOliX, Natsume, une alerte et le bilan ; le matin propose quatre noms. Gratuit,
  rejouable, dans la suite. C'est la « nuit rejouée » du critère 4.
- **B. Une vraie nuit sur Haiku 5.5, sur une base de test amorcée**, comme le 20/11. Il faudrait un faux Acedia servi
  à côté d'un core lancé et relié : un outil de plus. Et un vrai modèle ne cite ni le bilan ni Natsume sur commande.
- **C. La première nuit sur le NAS après le déploiement.** Puisqu'Avaritia garde l'origine de chaque fait, le constat
  est réel : dans les brouillons nés de cette nuit, aucun fait d'une autre origine que la conversation. L'auteur se
  relit au core, par le message que le fait cite. Il se fait après la livraison, hors du chantier.

## Tâches

**Barrières de chaque tâche** : celles de Lun'Anima, dans l'issue privée. Les tests de comportement s'écrivent
d'abord et sont rouges sur `main` ; les gardes, vertes sur `main`, fixent ce qui ne doit pas bouger. Chaque test dit
lequel il est.

0. - [x] **Anthropic impose-t-il les longueurs de texte ?** (`testeur`, depuis le laptop ; appel et clé dans l'issue
   privée). **Préalable à la tâche 1. Attend que CrOliX remplace la clé de mesure**, refusée aujourd'hui (401).
   - Un vrai appel, une forme qui borne une chaîne à cinq signes, une consigne qui en demande quarante. Une réponse
     de plus de cinq signes dit que la borne n'est pas imposée. Moins d'un dixième de centime.
   - Le résultat s'écrit ici, sous la tâche. Imposée : rien de plus à faire. Pas imposée : CrOliX dit si la phrase du
     jour (240 signes) entre dans ce chantier ; les autres longueurs vont dans une issue.
   - Exclu : tout changement de code.
   - **Résultat, le 24/11** (Haiku 5.5, raisonnement coupé) : la borne n'est **pas** imposée. Borne de 5 signes,
     réponse de 32 ; borne de 240, réponse de 446. **Décision de CrOliX** : le chantier couvre les trois longueurs du
     contexte chaud (un nom de recherche, la phrase du jour, le contexte) ; les autres réponses bornées vont dans une
     issue, après le VIP.
1. - [x] **Le contexte chaud tient plus de trois noms** (`testeur`, puis `dev-core` ; Lun'Anima, fichiers dans
   l'issue privée). **Après la tâche 0 ; en parallèle de la tâche 2.**
   - Test rouge sur `main` : sur Anthropic, une réponse à quatre noms. Le contexte chaud s'écrit ; trois recherches
     partent, les trois premiers noms, dans l'ordre. Le faux serveur d'Anthropic refuse une taille maximale de
     tableau : le test prouve aussi qu'elle reste retirée.
   - Gardes, vertes sur `main` : sur OpenAI, la requête des recherches reste la même, borne de trois comprise ; un nom
     vide parmi les trois premiers fait toujours échouer la vérification.
   - Code : la vérification des recherches garde les trois premiers noms avant de vérifier la forme. La forme
     envoyée ne change pas. Une ligne de commentaire dit pourquoi.
   - **Les longueurs** (décision de CrOliX après la tâche 0) : tests rouges sur `main`, sur Anthropic, un nom de
     recherche, une phrase du jour et un contexte plus longs que leur borne. Le contexte chaud s'écrit quand même.
     Code, choix de la session : avant la vérification, un nom trop long est coupé à sa borne ; la phrase du jour et
     le contexte sont coupés au dernier espace avant leur borne, suivis de « … ». Une garde : un texte dans sa borne
     passe tel quel.
   - **Le tri aussi** (décision de CrOliX, le 24/11, à la revue) : une observation, un souvenir, sa réaction ou le
     récit de la nuit plus long que sa borne (2000 signes) est coupé de la même façon, et la nuit réussit. Tests
     rouges d'abord, sur Anthropic ; la règle de coupe est partagée par le matin et la nuit ; les longueurs se
     comptent en signes, comme la vérification, jamais en unités de code.
   - Exclu : le module d'Anthropic, les consignes du matin et de la nuit, les autres formes (le portrait, dans
     Lun-Ecosystem/lun-anima#139).
2. - [x] **La nuit n'envoie que les messages de CrOliX** (`testeur`, puis `dev-core` ; Lun'Anima, fichiers dans
   l'issue privée). **En parallèle des tâches 0 et 1.**
   - Tests rouges sur `main` :
     - une journée avec un message de CrOliX, un message de Natsume, une alerte urgente d'Acedia et un bilan ; le tri
       cite chacun des quatre. L'envoi ne porte que l'observation du message de CrOliX ; la délégation de la nuit en
       compte une ; le tri rangé garde ses quatre observations ;
     - la part « bilan », arrivée tard, dont toutes les observations viennent du bilan : aucun envoi, aucune
       délégation notée, l'étape marquée faite, la journée faite. C'est le test existant de cette part, dont l'attente
       change ; la seule attente existante qui change, nommée dans la PR ;
     - une part rangée avant le changement, son envoi en attente d'Avaritia, qui cite un message de CrOliX et un
       élément du bilan : à la passe suivante, seule l'observation du message de CrOliX part.
   - Gardes, vertes sur `main` et inchangées : le tri reçoit le bilan, et le récit s'écrit (critère 3). Elles existent
     déjà dans les tests de la nuit ; l'instantané de la requête du tri reste identique.
   - Code : l'envoi ne garde que les observations qui citent un message de CrOliX, avant le test « aucune
     observation ». Le tri, ses consignes et ce qu'il range ne changent pas.
   - Exclu : les souvenirs et le récit, qui gardent toutes leurs sources ; Lun'Avaritia ; le matin ; le rejeu sur
     Anthropic, fait par la tâche 3.
3. - [x] **La preuve de bout en bout, rejouée** (`testeur` ; Lun'Anima, fichier et commande dans l'issue privée).
   **Il peut s'écrire dès le début ; il se joue vert après 1 et 2.**
   - Un test joue la vraie nuit d'un jour, puis le vrai matin du lendemain, sur le module d'Anthropic face à son faux
     serveur. Un faux Acedia rend le bilan de deux mails inventés ; un faux Avaritia garde ce qu'il reçoit et répond
     aux recherches. Le portrait, le tempérament et les scènes ne sont pas joués.
   - Les réponses du modèle sont écrites d'avance : le tri cite un message de CrOliX, un message de Natsume, un mail
     du bilan et une alerte, avec un récit qui parle d'un mail ; le matin propose quatre noms, puis écrit le contexte.
   - Attendu : la bibliothèque ne reçoit que l'observation du message de CrOliX ; la nuit est réussie ; le récit est
     rangé ; trois recherches partent ; le matin dit le contexte chaud composé, et le contexte s'écrit pour le jour.
     Rouge sur `main`, sur ses deux défauts.
   - La sortie du test va dans la PR comme preuve, avec la suite entière et les barrières au vert.
   - Exclu : un vrai modèle (option B), le NAS (option C).
4. - [x] **La revue et la livraison** (`reviewer`, puis `livreur`). **Après 3.** Le diff relu contre ce plan et les
   standards. Une PR Lun'Anima en brouillon, qui ferme Lun-Ecosystem/lun-anima#136 et Lun-Ecosystem/lun-anima#133.
   Ce plan coché dans la PR lun-docs du chantier. Après la fusion, le graphe mis à jour.

**Parallèle.** La tâche 2 part tout de suite, avec le test de la tâche 3. La tâche 1 attend la tâche 0, donc la clé
de mesure. Les tâches 1 et 2 ne touchent ni les mêmes fichiers ni les mêmes tests.

## Ensuite, hors du chantier

- La version du core publiée, puis déployée par la porte (`deploy`), par CrOliX.
- Le premier matin sur le NAS après le déploiement : la lettre et le contexte chaud écrits ; dans les brouillons nés
  de la nuit, aucun fait d'une autre origine que la conversation (option C).
- Les quatre brouillons tirés des mails, repérés par leur origine, refusés dans la bibliothèque par CrOliX.

## Hors périmètre

- Les mails comme source filtrée de la bibliothèque, les refus qui apprennent : après le VIP
  (Lun-Ecosystem/lun-avaritia#46).
- L'urgence et ce qui remonte d'Acedia (Lun-Ecosystem/lun-anima#135).
- Les souvenirs et le récit : ils vont au journal de la relation, pas à la bibliothèque ; ils gardent toutes leurs
  sources.
- L'auteur d'un message dans la source envoyée à Avaritia : sa forme est stricte, un champ de plus serait refusé.
- Retirer de la bibliothèque ce qui y est déjà entré.
- Une garde générale contre une borne qu'un module retire : une seule forme est concernée.

## Limites

- **Une observation ne cite qu'une source.** Un fait dit par CrOliX et aussi présent dans le bilan peut être cité sur
  l'élément du bilan : il est alors perdu pour la bibliothèque. De même, un fait que Natsume énonce et que CrOliX
  approuve d'un « oui » peut être cité sur le message de Natsume. Le filtre ne choisit pas la source à la place du
  tri ; ces faits reviendront à la prochaine fois que CrOliX les dira.
- **Le texte d'une observation** n'est pas lu par le filtre : un détail d'un mail peut voyager dans une observation
  qui cite un message de CrOliX. Le brouillon attend sa validation.
- **Une borne de tableau à venir** reviendrait au même défaut : le module d'Anthropic la retire sans le dire à
  l'appelant. Le commentaire de la tâche 1 le rappelle.
- **Les longueurs de texte** : la tâche 0 a montré qu'Anthropic ne les impose pas. Le contexte chaud et le tri de la
  nuit sont couverts (comptés en signes) ; le portrait et les autres formes bornées restent exposés. Suivi dans
  Lun-Ecosystem/lun-anima#139, après le VIP.

## Questions à CrOliX

1. **La clé de mesure** : la remplacer, pour que la tâche 0 joue. La tâche 1 l'attend.
2. **Après la tâche 0**, si Anthropic n'impose pas les longueurs : la phrase du jour entre-t-elle dans ce chantier ?
3. **La preuve du critère 4** : la nuit rejouée suffit-elle, le constat sur le NAS venant après la livraison ?
   Recommandé : oui.
