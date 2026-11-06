# ADR 0010 : Lun'Luxuria, un satellite public qui fonctionne seul

Statut : acceptée
Date : 2026-11-06

## Contexte

L'[ADR 0009](0009-lun-luxuria-corps.md) gardait Luxuria privée au MVP : un corps sans esprit n'a pas d'usage, et sa vue du
fil dépend du core. Le socle écrit montre le contraire de ce que cette exception supposait : l'identité de l'agent tient
en quelques textes, et le lien avec le core en quatre appels et un flux. Les évolutions après le MVP (avatar, stream,
compagnon de jeu, accès au PC par des cartes) sont utiles à d'autres. Garder l'outil privé les priverait de ce qui fait
la force des autres satellites : un outil générique, paramétrable, dont une instance sert l'écosystème.

## Décision

- **Luxuria est publique** et fonctionne seule, comme tout satellite : ce point remplace la phrase « Elle est privée au
  MVP » de l'ADR 0009. Le reste de cet ADR tient.
- **L'esprit est interchangeable**, derrière une interface : présence, message, retrait, coupure, fil et flux en direct.
  Deux branchements : **seul**, sur un modèle compatible OpenAI (Ollama compris) avec un nom, un ton et un contexte en
  réglages, un historique du jour et un plafond ; **relié**, à un core par un jeton d'appareil.
- **L'agent par défaut est neutre.** Son nom, ses mots d'appel, ses images et sa voix sont de la configuration. Rien de
  Natsume n'entre dans le dépôt : ni son lore, ni ses images, ni son modèle de voix. Natsume reste une seule personne,
  dans le core, et Luxuria en est le corps quand elle y est reliée.
- **L'interface ne nomme ni le core ni Natsume** ; un test le vérifie, comme sur Avaritia. Le code et la documentation
  peuvent nommer le core.
- **Licence MIT** pour le dépôt. Les briques tierces restent hors du dépôt, installées par l'utilisateur : Piper
  (GPL-3.0), les voix, RVC, et plus tard le SDK Cubism de Live2D, propriétaire, dont le contrat se relit avant toute
  sortie qui l'utilise.
- **Le service voix local refuse les autres origines** : il écoute sur `127.0.0.1`, et sans ce contrôle n'importe quelle
  page ouverte dans le navigateur pourrait l'appeler.
- Les routes du contrat satellite (santé, coûts, pause, actions) arrivent toujours quand le core aura quelque chose à lui
  demander. Elles restent nécessaires avant tout accès au PC, qui passera par des cartes.

## Conséquences

- N'importe qui peut avoir un compagnon vocal de bureau, sans l'écosystème.
- Le mode seul est à maintenir : appel au modèle, découpage en phrases, historique, plafond. Il reste volontairement
  minimal : le rituel, les urgences et la parole spontanée n'existent que relié.
- Dans une page web, la clé du mode seul vit dans le stockage du navigateur. Elle passera au trousseau du système avec
  Tauri.
- Un outil public qui écoute un micro et, plus tard, agit sur un PC demande plus de rigueur à chaque évolution.

## Alternatives écartées

- **Rester privée, documentation dans son dépôt** : perd l'usage public des évolutions après le MVP, pour un écart de
  code faible.
- **Public, mais sans fonctionner seul** : contredit la règle du satellite, et personne d'autre ne pourrait s'en servir.
- **Mettre l'appel au modèle dans le service Python** : garde la clé hors du navigateur, mais ajoute une logique de
  conversation hors de la pile TypeScript et de ses tests.
