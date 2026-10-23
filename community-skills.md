# Skills et outils communautaires

> Principe : les skills communautaires apportent **la méthode**, nos skills `lun-*` apportent **ce qui
> nous est propre**. On ne réécrit pas ce qui existe et marche ; on ne charge que ce qui sert.

## Retenus

| Skill / plugin | Pourquoi |
|---|---|
| **superpowers** (marketplace officielle Claude) | Moteur de la méthode : cadrage (brainstorming), plan (writing-plans), exécution par sous-agents, tests d'abord, revue, vérification avant de déclarer « fini », branches isolées. Les skills `lun-*` s'appuient dessus. |
| **frontend-design** (marketplace officielle Claude) | Qualité de l'interface, le point noir identifié. Utilisé avec `lun-design`, qui impose la DA. |
| **skill-creator** (Anthropic) | Écrire nos skills et **les tester** (évaluations), au lieu de les supposer efficaces. |
| **graphify** (Graphify-Labs, `uv tool install graphifyy` puis `graphify install --platform claude`) | Graphe de connaissances d'un dépôt (`/graphify`) : repérer les nœuds centraux et les liens entre docs, specs et code avant un cadrage. La sortie `graphify-out/` reste locale (ignorée par git). Mise à jour : `uv tool upgrade graphifyy` puis la même commande `install`. |
| **find-skills** (vercel-labs/skills, `npx skills add vercel-labs/skills --skill find-skills -g -a claude-code`) | Chercher un skill existant avant d'en écrire un. Toute trouvaille passe par ce fichier (PR avec la raison) avant d'être installée ; on retire ce qui ne sert plus (`npx skills remove`). |
| **svelte-core-bestpractices**, **svelte-code-writer** (sveltejs/ai-tools, équipe Svelte) | Svelte 5 et ses runes à jour, plutôt que des motifs Svelte 4 de mémoire. Le second appelle la documentation officielle via `npx @sveltejs/mcp`. |
| **hono** (honojs/skills, équipe Hono ; `hono-jsx` et `hono-void` non installés) | Le serveur d'Acedia et du core. |
| **vitest** (antfu/skills, Anthony Fu, équipe Vitest) | API Vitest à jour pour nos tests. |

## À évaluer

| Outil | Ce qu'on en attend | Quand |
|---|---|---|
| **Context7** (documentation à jour des bibliothèques) | Éviter que l'agent invente des API obsolètes | Au choix de la stack (étape 2) |
| **Caveman** | Moins de tokens dans les rapports des sous-agents et les fichiers mémoire. Jamais sur ce qui est destiné à CrOliX | Pendant les deux semaines de mesure |
| **web-design-guidelines** (vercel-labs/agent-skills) | Relecture accessibilité et ergonomie des écrans, en complément de `frontend-design` et `lun-design` ; à écarter s'il contredit la DA | Pendant le recadrage front, sur un ou deux écrans |
| **Revue de PR par l'API Claude en CI** | Une relecture automatique de chaque PR | À la CI du premier projet de l'étape 2 |

## Écartés

| Outil | Raison |
|---|---|
| **Ruflo** (ex-Claude Flow) | 300+ outils MCP et essaims d'agents qui gonflent le contexte et vident le quota Pro ; une partie des fonctions signalées comme non implémentées par un audit ; orchestration opaque, contraire à l'exigence de contrôle. Déjà essayé (LunArchive). |
| **watermarks-remover** (guillaumemeyer) | Son but principal est d'effacer les marques de provenance IA (SynthID, C2PA), avec un module qui réécrit le texte jusqu'à tromper les détecteurs : contraire à la transparence attendue. Il ajoute aussi un hook sur chaque écriture de fichier et un service Python local. Aucun besoin dans l'écosystème. |
| **Universal CLAUDE.md** | Une seule source, gain annoncé sur la sortie et non sur le contexte, sans méthode vérifiable. Les vrais leviers (CLAUDE.md court, skills à la demande, sous-agents) sont appliqués par construction. |

Ajouter ou retirer un outil passe par une PR sur ce fichier, avec la raison.
