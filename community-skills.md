# Skills et outils communautaires

> Principe : les skills communautaires apportent **la méthode**, nos skills `lun-*` apportent **ce qui
> nous est propre**. On ne réécrit pas ce qui existe et marche ; on ne charge que ce qui sert.

## Retenus

| Skill / plugin | Pourquoi |
|---|---|
| **superpowers** (marketplace officielle Claude) | Moteur de la méthode : cadrage (brainstorming), plan (writing-plans), exécution par sous-agents, tests d'abord, revue, vérification avant de déclarer « fini », branches isolées. Les skills `lun-*` s'appuient dessus. |
| **frontend-design** (marketplace officielle Claude) | Qualité de l'interface, le point noir identifié. Utilisé avec `lun-design`, qui impose la DA. |
| **skill-creator** (Anthropic) | Écrire nos skills et **les tester** (évaluations), au lieu de les supposer efficaces. |

## À évaluer

| Outil | Ce qu'on en attend | Quand |
|---|---|---|
| **Context7** (documentation à jour des bibliothèques) | Éviter que l'agent invente des API obsolètes | Au choix de la stack (étape 2) |
| **Caveman** | Moins de tokens dans les rapports des sous-agents et les fichiers mémoire. Jamais sur ce qui est destiné à CrOliX | Pendant les deux semaines de mesure |
| **Revue de PR par l'API Claude en CI** | Une relecture automatique de chaque PR | À la CI du premier projet de l'étape 2 |

## Écartés

| Outil | Raison |
|---|---|
| **Ruflo** (ex-Claude Flow) | 300+ outils MCP et essaims d'agents qui gonflent le contexte et vident le quota Pro ; une partie des fonctions signalées comme non implémentées par un audit ; orchestration opaque, contraire à l'exigence de contrôle. Déjà essayé (LunArchive). |
| **Universal CLAUDE.md** | Une seule source, gain annoncé sur la sortie et non sur le contexte, sans méthode vérifiable. Les vrais leviers (CLAUDE.md court, skills à la demande, sous-agents) sont appliqués par construction. |

Ajouter ou retirer un outil passe par une PR sur ce fichier, avec la raison.
