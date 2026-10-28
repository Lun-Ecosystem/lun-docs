<!-- Copie générée depuis standards/design.md : ne pas modifier ici -->
# Design

> La direction artistique du website (`CrOliX-AltF4/website`) est la contrainte visuelle de **toutes**
> les surfaces : panel desktop, application mobile, pages web. On garde l'identité, on refait
> l'ergonomie. Référence de qualité d'interface : le front de myBrain. Le skill `lun-design` applique
> ce standard.

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--encre` | `#0D0B09` | Fond principal (thème sombre par défaut) |
| `--encre-2` | `#1A1612` | Surfaces, cartes, panneaux |
| `--ivoire` | `#F0EBE1` | Texte principal |
| `--papier` | `#E8E2D6` | Fonds clairs, texte secondaire sur sombre |
| `--lune` | `#C8C0B0` | Texte atténué, bordures discrètes |
| `--lavis` | `#8A9BAE` | Accent froid, informations, états neutres |
| `--rouge` | `#7A1818` | Accent principal (Natsume, Lun'Anima), alertes |

Les noms des tokens sont repris tels quels dans chaque surface, quel que soit le framework.

## Règle B : socle commun, couleur du monde en accent

Toutes les interfaces partagent les mêmes surfaces, textes, bordures, tons, rayons et ombres (le socle
Lun’). Le monde d’un projet ne change que l’**accent** : `--accent`, `--accent-survol`,
`--accent-texte`, `--accent-doux`, `--accent-bord`.

- L’attribut `data-monde="acedia"` ou `data-monde="anima"` se pose sur la **racine de chaque vue**, pas
  sur la page. Une vue d’Acedia reprise dans le panel d’Anima garde ainsi son accent bleu.
- Le **rouge d’Anima n’est jamais utilisé en texte** : `--accent-texte` y reprend `--texte`. Le rouge
  sert de fond (bouton, pastille) ou de bordure.
- Un composant n’écrit **aucune couleur en dur** : il lit les jetons.

## Jetons de référence

La seule source est `design/tokens.css` (dans lun-docs) : le socle et le bloc d’accent de
chaque monde. Chaque dépôt garde une copie générée, avec l’en-tête « ne pas modifier ici »
(`node tools/sync-tokens.mjs <fichier>` pour l’écrire). L’option `--monde <nom>` ne garde que le socle
et le bloc de ce monde : un dépôt n’embarque pas l’accent des autres. La CI du dépôt compare la copie à la
référence avec `node tools/sync-tokens.mjs --check [--monde <nom>] <fichier>` et échoue au moindre écart.

## Couleurs « monde » par projet

Chaque projet a son monde. Le tableau sert à **identifier un projet** (une tuile du panel, par
exemple), plus comme fond d’application : le fond des interfaces est celui du socle.

| Projet | Fond | Accent |
|---|---|---|
| Lun'Anima | `#120A0A` | `#7A1818` |
| Lun'Acedia | `#070C14` | `#3A6080` |
| Lun'Ira | `#080F08` | `#2A5C2A` |
| Lun'Gula | `#110D05` | `#8A6020` |
| Lun'Avaritia | `#050810` | `#1A3070` |
| Lun'Invidia | `#080410` | `#5A1880` |
| Lun'Superbia | `#06080F` | `#5A6A90` |
| Lun'Luxuria | `#100409` | `#8A1E5A` |

Un nouveau projet de l’étape 2 reprend le monde du nom qu’il porte, ou en reçoit un par ADR.

## Typographie

| Police | Graisses | Usage |
|---|---|---|
| **Cormorant Garamond** (serif, normal et italique) | 300 à 600 (italique 300 à 500) | Titres, noms, citations, moments « Natsume » |
| **Inter** (sans serif) | 300 à 500 ; 300 par défaut | Texte courant, interface, données, étiquettes |

Polices auto-hébergées (pas d'appel à un CDN tiers). Repli : Georgia pour le serif, `system-ui` pour Inter.

## Ton des textes

- **Deux voix** : CrOliX à la première personne et décontracté ; Natsume dans son personnage. Les
  écrans d'outil (panel, réglages) parlent d'une **voix technique neutre** : phrases courtes, pas de
  « tu », pas de franglais inutile ; les termes techniques (LLM, WebSocket, OAuth2) restent.
- **Noms affichés** : toujours « Lun'Xxx ». Les devises des projets restent en anglais.
- **Pas de tiret cadratin** dans les textes.
- **Honnêteté** : un état affiché correspond à la réalité ; ce qui n'est pas vérifié n'est pas « fait ».

## Ergonomie

Le défaut à corriger est l'usage, pas l'identité.

- Chaque écran répond à une question claire ; l'action la plus fréquente est à un clic.
- Le contrôle (couper un service, voir un coût, changer une autorisation) est visible et immédiat,
  avec un retour d'état explicite.
- Desktop et mobile partagent les tokens, les noms et les icônes ; la mise en page s'adapte.
- Lisible en déplacement : contrastes du texte conformes WCAG AA sur les fonds `--encre`.
- Les effets du website (curseur personnalisé, transitions lourdes) restent au site vitrine ; les
  outils du quotidien privilégient la vitesse.

## Composants communs

Chaque écran ne s’assemble qu’avec ces briques, jamais avec une version refaite localement.

- **Jetons** : couleurs, échelle typographique, rayons, ombres, espacements, hauteurs, mouvement.
- **Boutons** : six niveaux (principal, doux, secondaire, fantôme, danger, `danger-plein` pour la
  confirmation d’un geste destructeur), trois tailles, variante icône seule ; une seule action
  principale par zone.
- **Champs** : texte (libellé au-dessus, aide en dessous, erreur à la place de l’aide), liste
  déroulante, curseur avec sa valeur, date, bascule, case, commande segmentée, saisie de code (une
  case par chiffre, collage accepté).
- **L’IA** : pastille de proposition, carte de proposition complète, marque « rangé seul », ton IA
  dédié (violet).
- **Calques** : menus avec filtre et raccourcis, bulle de détail, info-bulle, fenêtre de dialogue et de
  confirmation, toast avec annulation, bannière d’état.
- **Structures** : rangée de liste avec actions au survol, groupe par jour, carte de réglages faite
  de lignes, état vide qui explique, squelette de chargement, pastilles de filtre, badge d’état,
  touche de clavier.
- **Navigation** : rail avec groupes, compteurs et carte d’état du service, colonne de thèmes, onglets,
  palette de commandes (Ctrl K), barre de navigation mobile et bouton flottant.
- **Pages seules** : carte centrée sur fond encre avec halo du monde, indicateur d’étapes.

## Bibliothèques retenues

| Besoin | Choix |
|---|---|
| Comportements (menu, liste déroulante, bulle, dialogue, info-bulle, onglets, palette, date, curseur, bascule, case) | **Bits UI** (sans style, Svelte 5) : les menus passent par un calque au-dessus de la page, aucun n’est coupé par un conteneur |
| Icônes | **`@lucide/svelte`** |
| Grille d’agenda | **FullCalendar 7**, habillé par les jetons |
| Graphe de fiches | **Sigma.js 3 + graphology** (WebGL), ADR 0006 |
| Style | **Jetons CSS** ; ni Tailwind ni bibliothèque de composants stylés |

Aucune police ni ressource ne vient d’un CDN. Pas d’alerte native (`alert`, `confirm`, `prompt`).

## Vérification avant toute PR de front

Un écran ou un composant de front est **vérifié dans Chrome**, en largeur bureau (1440 px) et mobile
(390 px), contre sa planche ou le catalogue des composants, avant l’ouverture de la PR. Les captures
ne contiennent aucune donnée réelle.
