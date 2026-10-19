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

## Couleurs « monde » par projet

Chaque projet a son monde (fond et accent), utilisé pour l'identifier dans le panel et le mobile.

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

Un nouveau projet de l'étape 2 reprend le monde du nom qu'il porte, ou en reçoit un par ADR.

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
