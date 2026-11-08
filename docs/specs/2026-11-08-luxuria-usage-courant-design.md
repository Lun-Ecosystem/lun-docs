# Lun'Luxuria prête pour l'usage courant : l'arrivée, la scène vide, les réglages

> Cadrage du 08/11, à valider par CrOliX **avant tout code** (méthode : cadrage, maquettes, puis plan). Issues :
> lun-luxuria#36, #37, #38. Retour de CrOliX à l'audit du 08/11 : « l'outil semble en état bêta et pas prêt à l'usage
> courant ». Maquettes : [`docs/maquettes/2026-11-08-luxuria-usage/`](../maquettes/2026-11-08-luxuria-usage/). Les choix
> marqués **[choix Claude]** se changent avant le plan.

## 1. Ce qui ne va pas

Luxuria a été construite comme un banc d'essai, et ça se voit :

- **L'arrivée** ne dit ni ce que sont « Seul » et « Relié à un serveur », ni ce qu'il faut avant, ni où trouver le code
  (#36).
- **La scène et le fil vides** ne disent pas comment lui parler, et les contrôles sont minuscules (#37).
- **Les réglages** mettent au même rang le ton de l'agent et le seuil du silence en décibels (#38).

Ce qui ne change pas : la DA (socle Lun' commun, magenta de Luxuria en accent seulement), la scène sombre, le fil comme
vue du fil principal, l'interrupteur par mécanique (spec Luxuria § 6.8). Le dépôt est public : l'écran ne nomme ni le
core ni ce à quoi Luxuria peut être reliée (`noCore.test.ts`).

## 2. L'arrivée (#36)

Une seule page, qui reste celle d'avant l'entrée. Maquette `01-arrivee.html`.

1. **Le nom en titre**, puis une ligne qui dit ce qu'est l'appli : « Un compagnon qui t'écoute et te répond à voix
   haute, sur ce poste. » Le nom par défaut reste « Agent » (agent neutre, réglage).
2. **Deux cartes au lieu d'un sélecteur**, chacune avec ce qu'elle demande **[choix Claude]** :
   - **Seul** : « Il répond avec un modèle que tu choisis : un modèle local, ou un service en ligne avec sa clé. Le coût
     est celui du modèle. »
   - **Relié à un serveur** : « Un serveur pense pour lui : la mémoire et les décisions restent là-bas. Il faut son
     adresse et un code d'appairage. »
3. **Les champs de la carte choisie, sur la page même** :
   - Seul : adresse du modèle (« Compatible OpenAI, souvent terminée par /v1 »), nom du modèle (exemple en
     placeholder), clé facultative.
   - Relié : adresse du serveur, dans la fenêtre seulement (le navigateur passe par son proxy), puis le code, avec « Le
     code s'affiche sur le serveur, là où il ajoute un appareil. »
4. **« Entrer » attend ce qui manque**, et le dit : « Il manque le nom du modèle. » Relié, le code complet fait entrer,
   comme aujourd'hui.

Corrige aussi le détour actuel (passer par « Seul » pour changer l'adresse du serveur).

## 3. La scène et le fil vides (#37)

Maquette `02-scene.html`.

1. **Une consigne sous le halo**, tant que rien n'a été dit dans la session, et qui suit la façon de parler réglée
   **[choix Claude]** :
   - micro ouvert : « Parle-lui : dis son nom, ou parle juste après lui. »
   - touche : « Tiens F9 pour lui parler. »
   - micro coupé : « Micro coupé. Écris-lui, ou rallume le micro. », avec le bouton.
   Elle s'efface au premier tour et ne revient qu'au lancement suivant.
2. **L'état en haut à gauche** passe de l'étiquette minuscule à une pastille lisible (13 px, point de couleur).
3. **Les contrôles en haut à droite** : 36 px de cible, une infobulle avec le raccourci, dans l'ordre d'aujourd'hui :
   sourdine, micro, fil, petit mode, réglages. « Faire taire » reste réservé au moment où il parle.
4. **Le fil vide** : « Rien encore aujourd'hui. Ce que vous vous dites s'écrit ici, à la voix comme à l'écrit. » Le fil
   ouvert décale les contrôles au lieu de passer dessous.
5. **Dans le navigateur, pas de petit mode** : le bouton n'existe que dans la fenêtre, où il a un sens.

## 4. Les réglages (#38)

Maquette `03-reglages.html`. Les thèmes restent (L'agent, Corps, Écoute, Voix, Fenêtre).

1. **Courant d'abord, avancé ensuite** : chaque thème montre ce qu'on change au quotidien. Le reste passe sous « Réglages
   avancés », replié, et toujours là : rien n'est figé (§ 6.8) **[choix Claude]**.

   | Thème | Courant | Avancé |
   |---|---|---|
   | L'agent | nom, ton et contexte, fonctionnement (seul ou relié) | modèle et clé, plafond |
   | Écoute | façon de parler (scène, petit mode), prénom et mots reconnus, touche | silence, pause, seuil, durée minimale, tolérance, fenêtre après sa parole, interruption, applis ignorées |
   | Voix | volume, ce qui est dit à voix haute, état du service | le service et ses programmes (#35), écho et bruit |
   | Corps, Fenêtre | inchangés | |

2. **Écoute, trois préréglages** : « Pièce calme », « Normal », « Bruit autour ». Ils remplissent les valeurs avancées ;
   une valeur touchée à la main affiche « Personnalisé » **[choix Claude, valeurs à prendre sur le desktop]**.
3. **Des unités qu'on lit** : « 0,8 s » au lieu de 800 ms ; le seuil en décibels reste dans l'avancé, avec sa valeur
   conseillée. Le volume devient un curseur.
4. **Ton et contexte** : une vraie zone (8 lignes), et ce qu'elle fait selon le fonctionnement : seul, elle définit
   chaque réponse ; relié, c'est le serveur qui décide du ton, la zone est grisée et le dit.
5. **Textes d'usage, plus de textes de banc** : retirer « Rien ne reste figé dans le code », les commandes de terminal
   (elles vont dans le README), et les titres répétés (le thème « L'agent » n'a plus de carte « L'agent »).
6. **« Mesures de cette session »** sort des réglages courants : en bas de l'avancé de l'Écoute.
7. **Grand écran** : la colonne de contenu passe à 720 px, le texte de base à 14 px, la liste des thèmes reste à gauche.

## 5. Hors périmètre

Les écrans propres à l'exe (thème Fenêtre, icône, petit mode réel) déjà repris en #33 ; la personnalité (#39, recette
avec CrOliX) ; le mot d'éveil ; un sélecteur de fichier.

## 6. À trancher par CrOliX

1. Les deux cartes de l'arrivée, ou un sélecteur avec une ligne d'explication sous chaque choix ?
2. La consigne de la scène : s'efface au premier tour (proposé), ou reste discrète tant que le fil est vide ?
3. Les préréglages d'Écoute : oui, ou seulement des valeurs conseillées affichées à côté de chaque champ ?
4. Le partage courant / avancé du tableau du § 4.
