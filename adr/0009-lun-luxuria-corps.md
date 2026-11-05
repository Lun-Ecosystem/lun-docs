# ADR 0009 : Lun'Luxuria, le corps de Natsume

Statut : acceptée
Date : 2026-11-05

## Contexte

L'[ADR 0007](0007-stack-mobile-pwa.md) prévoyait que l'app du core soit empaquetée par Tauri quand
la voix et l'avatar arriveraient, avec un dossier `desktop/` dans `lun-anima`. L'ancien écosystème
intégrait déjà ces modules au core, alors qu'ils dépendent du PC : le core tourne en continu sur un
NAS, sans micro, sans écran et sans GPU. Le cadrage du [chantier](../docs/specs/2026-11-05-natsume-etre-presence-design.md)
sépare l'esprit et le corps. `desktop/` n'existe pas : rien à migrer.

## Décision

- La présence physique de Natsume vit dans un satellite, **Lun'Luxuria** : voix, avatar, puis
  perception, accès au PC et stream. Application Tauri 2, dépôt `lun-luxuria`.
- **Le core garde l'esprit** : identité, relation, humeur, décision de parler, fil, file. Luxuria
  n'envoie au core que du texte et des signaux ; l'audio reste sur le PC.
- **Au MVP, Luxuria est un client du core**, connecté avec un jeton d'appareil comme le mobile, sans
  rien exposer. Les routes du contrat satellite (santé, pause, coûts, actions) arrivent quand le core
  aura quelque chose à lui demander.
- **Elle est privée au MVP** : exception assumée à la règle du satellite qui fonctionne seul, car un
  corps sans esprit n'a pas d'usage et sa vue du fil dépend du core.
- Le fil et la file restent dans le core : Luxuria en est une vue. L'app du core reste complète sur
  mobile et sur desktop, en PWA ; elle n'est plus empaquetée par Tauri. Seul ce point de l'ADR 0007
  change, le reste de la stack tient.

## Conséquences

- Le core ne dépend jamais du PC. Fermer Luxuria est un état normal, pas une panne.
- Les lancements et fermetures deviennent des signaux de présence pour Natsume.
- Le core doit ajouter un flux en direct vers ses clients : la voix ne peut pas attendre une relecture
  périodique.
- Un dépôt de plus à maintenir, avec des services locaux lourds à lancer sans console.
- Le rôle de satellite s'élargit : au MVP, Luxuria ne remplit pas le contrat complet.
- Un service Python reste possible sur le PC quand une brique l'impose (RVC), justifié dans le dépôt.

## Alternatives écartées

- **`desktop/` dans `lun-anima`** : mêle au dépôt du core des dépendances propres au PC, et reproduit
  l'erreur de l'ancien écosystème.
- **Migrer le chat dans Luxuria** : casse l'app mobile, qui est celle du core.
- **Dupliquer fil et validations dans Luxuria** : crée des états à synchroniser et des cartes orphelines.
- **Mettre la personnalité dans Luxuria** : deux Natsume, une sur mobile, une sur desktop.
- **Lun'Superbia** comme nom : évoque plutôt le stream ; **Lun'Invidia** évoque plutôt la veille.
