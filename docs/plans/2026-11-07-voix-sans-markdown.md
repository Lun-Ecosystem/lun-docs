# Ce qu'elle dit à voix haute : sans markdown ni repère de carte. Plan

> **Pour les agents d'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** que la voix et les sous-titres ne lisent plus le markdown ni les repères de carte qu'une réponse écrite peut
porter (Lun-Ecosystem/lun-anima#58). Le fil garde le texte tel quel.

**Cadre :** recette du desktop du 07/11 (`luxuria-essai/RECETTE.md`, hors dépôt), écart n° 7. Niveau `standard`,
posé au tri du 07/11 (lun-docs#73).

**Où :** `core/src/natsume/speech.ts`. Toute phrase dite passe par `speaker`, qui la coupe, la masque et la publie
(`speech` sur `GET /api/live`) : réponses, carte lue, rituel, P0, parole spontanée (`service.ts`, l. 340, 354 et 709).
Les repères viennent de la liste des cartes donnée au modèle, `Titre (poste, c1a2b3)` (`situation.ts`, `cardsRule`),
et le modèle les recopie. Le texte arrive en flux, morceau par morceau.

**Dépôt :** `lun-anima` seul, branche `fix/voix-sans-markdown`, une PR. Luxuria reliée ne change pas : elle dit ce que
le core publie.

## Critères de fin

1. **La coupe attend ce qui est ouvert.** Tant qu'une `(` ou un `[` est ouvert dans le tampon, `speaker` ne coupe ni à
   la virgule ni en fin de phrase. Garde : au-delà de 80 caractères depuis l'ouverture, ou à un retour à la ligne, la
   coupe reprend. Les marques `*`, `_` et `` ` `` qui suivent une fin de phrase restent avec elle, et une phrase peut
   s'ouvrir sur `*`, `_`, `` ` ``, `#` ou `[`. Preuve : `speech.test.ts`, avec `Resto (lunacedia, c1a` puis
   `2b3) attend.` en deux fragments, et `**Oui.** Va.`
2. **Le nettoyage.** Chaque morceau est nettoyé **avant** le masquage des secrets (`[masqué]` porte des crochets : le
   nettoyer après le prendrait pour un lien) :
   - l'emphase `*x*`, `**x**`, `***x***`, `_x_`, `__x__` garde son texte. Un `_` dans un mot reste
     (`mot_de_passe`, `jean_dupont@x.fr`), et un `*` isolé aussi (`5 * 2`) ;
   - les `` ` `` disparaissent ;
   - en début de ligne ou de morceau, indentation comprise : `#` à `######` suivis d'une espace, `> `, les puces `- `,
     `* `, `• ` et les numéros `1. ` ou `1) ` disparaissent. `#1`, `-3 °C` et `> 5` restent ;
   - un lien `[texte](adresse)` devient `texte` ;
   - un repère de carte disparaît dans ses formes connues : `(poste, c1a2b3)`, `(c1a2b3)`, et après « carte » ou
     « repère » (`la carte c1a2b3 attend` devient `la carte attend`). Un mot seul comme `c0ffee` reste ;
   - les espaces doublés par ces retraits sont réduits, et l'espace laissé avant `,` ou `.` est retiré.
   Un morceau vide après nettoyage n'est pas publié, comme aujourd'hui. Preuve : `speech.test.ts`.
3. **La carte lue aussi** **[choix Claude]**. Ses lignes passent par le même nettoyage : à l'oral, une puce ou une
   emphase ne se dit pas non plus. Ses données restent : `De : jean_dupont@x.fr` et `Objet : 3. Facture` sont dits
   tels quels. Preuve : `speech.test.ts`.
4. **Le fil ne change pas.** Le message stocké garde son markdown et ses repères. Preuve : `service.test.ts`, une réponse
   en plusieurs deltas (`**Ou` / `i**, la carte Resto (luna` / `cedia, c1a2b3) attend.`) avec `speak` : le message
   stocké est intact, les `speech` disent `Oui, la carte Resto attend.`
5. Le découpage ne change pas pour un texte sans markdown ni parenthèse : les tests existants de `speech.test.ts` restent
   verts sans retouche.
6. Barrières vertes : `npm run format:check`, `lint`, `typecheck`, `test`, `build`.

**Hors périmètre :** la consigne au modèle (lui demander de ne pas écrire de markdown à l'oral touche à sa voix, qui ne
s'écrit pas sans CrOliX), les émojis, les adresses web nues, les tableaux, un `*` de multiplication collé (`3*4`, rare,
laissé tel quel), `FIRST_MIN` mesuré sur le texte brut (`**a**,` peut donner un premier morceau d'une syllabe, accepté).
Le mode seul de Luxuria (`lun-luxuria/src/local.ts:199`) publie sa parole sans `speaker` : même défaut, issue `inbox`.

## Tâches

### 1. La coupe (`core/src/natsume/speech.ts`)

- [ ] Tests d'abord : parenthèse et crochet ouverts en flux, garde des 80 caractères, garde du retour à la ligne,
      `**Oui.** Va.`, `Fini. **Maintenant** oui.`
- [ ] `cut()` ne coupe pas dans une `(` ou un `[` ouvert, sauf garde. `sentenceEnd` garde `*_\`` avec la fin de phrase,
      et `OPENS` accepte `*`, `_`, `` ` ``, `#`, `[`.

### 2. Le nettoyage (`core/src/natsume/speech.ts`)

- [ ] Tests d'abord : chaque forme du critère 2, et ce qui reste (`mot_de_passe`, `jean_dupont@x.fr`, `5 * 2`, `#1`,
      `-3 °C`, `> 5`, `c0ffee`), un morceau fait de markdown seul (rien de publié), un secret entre `**` qui reste
      masqué, les lignes de carte du critère 3.
- [ ] `spoken(text)`, appliquée dans `out` avant `maskSecrets`. Commentaire d'une ligne : ce que le fil montre reste
      écrit, ce qui se dit se nettoie.

### 3. Le fil intact (`core/src/chat/service.test.ts`)

- [ ] Le test du critère 4, sur le harnais de `speak` existant (l. 108 à 140).

### 4. Livrer

- [ ] Issue `inbox` dans lun-luxuria pour le mode seul.
- [ ] Relecture (agent reviewer), PR avec `lun-livrer`, critères cochés et preuves.
