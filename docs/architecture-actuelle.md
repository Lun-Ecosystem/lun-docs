# L'architecture actuelle

> Ce qui tourne aujourd'hui, au 08/11/2026. Cette page fait foi là où la
> [spec écosystème](specs/2026-10-19-ecosysteme-design.md) a vieilli. Tout chantier qui change un dépôt, un poste, un
> port ou une liaison la met à jour dans sa PR. Les règles sont dans
> [`environnements.md`](../standards/environnements.md) et [`contrat-satellite.md`](../standards/contrat-satellite.md) ;
> ici, la carte.

## Les dépôts

Le [registre](../registry.yaml) fait foi pour la liste, le rôle et l'état.

| Dépôt | Rôle | Ce qu'il porte |
|---|---|---|
| `lun-docs` | référentiel | les normes, la méthode, le registre, le plugin `lun`, les specs et les plans |
| `lun-anima` | core | Natsume : sa mémoire, la conversation, les cartes, les routines de la nuit et du matin, son app |
| `lun-acedia` | satellite | la journée : mail, agenda et tâches Google, triés à la source, avec son agent et son front |
| `lun-avaritia` | satellite | le savoir : fiches reliées, faits sourcés, import et export Obsidian, avec son front |
| `lun-luxuria` | satellite | le corps de Natsume : sa scène, sa voix, ce qu'il écoute ; une fenêtre Tauri sur le desktop |
| `website` | vitrine | le site, qui lit le registre à son build ; son hébergement n'est pas tranché (lun-docs#21) |

`lun-sandbox`, l'essai à blanc de la méthode, est archivé.

## Les postes

- **Le laptop** : le local. On y code et on y teste, avec le compte Google de test. Aucun service n'y reste lancé.
- **Le desktop** : la prod du rodage, avec le vrai compte Google. Le core, Acedia et Avaritia y tournent en tâches
  lancées au démarrage de Windows ([mise en service](mise-en-service-desktop.md)) ; Luxuria et son service voix s'y
  ouvrent le soir. Les recettes *Ask* s'y jouent dans une copie de travail à part, sur des bases de recette.
- **Le téléphone** : l'app du core, installée depuis le navigateur, jointe en HTTPS par le réseau privé ; les push.
- **Le NAS** : après le rodage. Rien n'y tourne encore.

## Les adresses

Une origine par app, la même partout.

| App | Adresse |
|---|---|
| Acedia | `http://localhost:8787` (l'adresse de retour enregistrée chez Google) |
| Le core et son app | `http://127.0.0.1:8788`, l'app sous `/app/` |
| Avaritia | `http://127.0.0.1:8789` |
| Luxuria, la page (en local) | `http://127.0.0.1:5180` |
| Luxuria, le service voix | `127.0.0.1:8793`, appelé par la page ou la fenêtre seules |
| Les démos, sur données fictives | Acedia `http://localhost:8797`, Avaritia `http://127.0.0.1:8798` |

## Les liaisons

- **Le core et un satellite** : le core se relie au satellite par sa page d'autorisation (`npm run connect -- <url>`,
  depuis lun-anima) et garde son jeton, chiffré par la clé du core. Il lit, demande d'agir et écoute le flux
  d'événements du satellite ; il n'en retient que l'urgent et le contrôle.
- **Le core et Luxuria** : Luxuria se relie au core par un code d'appairage et écoute ce qu'il doit dire. Relié, il ne
  décide de rien.
- **Le core et ses clients** : l'app, au bureau comme au téléphone, s'appaire au core par un code.
- **Les copies** : la base du core est copiée chaque nuit, sept copies gardées. Celles d'Acedia et d'Avaritia viennent
  avec le chantier K.

## Le soir : quelle fenêtre

- **L'entrée : Luxuria**, sur le deuxième écran, ou en petit mode dans un coin quand un jeu le prend. On y parle à
  Natsume ; sa transcription et un petit champ d'écriture restent en second plan
  ([spec, être présent](specs/2026-11-05-natsume-etre-presence-design.md), § 1 et § 2).
- **Le pilotage : l'app du core**, au bureau comme au téléphone : les cartes et leurs boutons, le Journal, les
  réglages. Luxuria n'a aucune notion de carte ([spec Luxuria](specs/2026-11-06-lun-luxuria-design.md)).
- **En secours : les fronts d'Acedia et d'Avaritia** **[choix Claude, à valider]**, pour agir à la source (une
  règle de tri, une fiche) ou quand le core est arrêté : chaque satellite fonctionne seul (spec écosystème, § 3,
  principe 1).
