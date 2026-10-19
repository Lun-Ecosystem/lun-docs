---
name: lun-design
description: Use when building or changing any user interface of the Lun' ecosystem (desktop panel, mobile app, web page). Applies the Lun' art direction - tokens, typography, tone - and the ergonomics rules.
---

# Design Lun'

Toute interface applique `references/design.md` : les tokens de couleur (noms et valeurs exacts),
les couleurs « monde » par projet, Cormorant Garamond et Inter, la charte de ton et les règles
d'ergonomie.

## Avec frontend-design

Utilise le skill `frontend-design` pour la qualité de l'interface, **dans les limites de la DA** :
pas de nouvelle palette, pas de nouvelles polices. Si frontend-design et `references/design.md`
divergent, la DA gagne.

## Vérifier avant de livrer

- Les couleurs viennent des tokens (`--encre`, `--ivoire`, `--rouge`…), jamais de valeurs en dur.
- Chaque écran répond à une question claire ; l'action fréquente est à un clic.
- Les contrôles (couper, coût, autorisation) sont visibles, avec un retour d'état explicite.
- Texte lisible sur fond `--encre` (WCAG AA).
- Pas de tiret cadratin, noms en « Lun'Xxx ».
- Une capture de l'écran figure dans la PR.
