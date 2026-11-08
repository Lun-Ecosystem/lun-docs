# Les normes à jour. Plan

> **Pour l'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** lun-docs ne se contredit plus et décrit la pratique : où vivent le plan et l'avancement, comment on code,
relit et fusionne, à quoi ressemble l'écosystème aujourd'hui.

**Source :** [audit du 08/11](2026-11-08-audit-ecosysteme.md), § 3.1 et § 6 ; décisions Q1, Q7, Q8, Q9 et Q12 ;
[feuille de route](2026-11-07-feuille-de-route-mvp.md), chantier I.

**Cadre :** aucune modification avant la validation de ce plan par CrOliX. Niveau `trivial`, *Show* : la PR passe
« prête » quand ses critères sont prouvés.

| Dépôt, branche | Issues | Niveau |
|---|---|---|
| `lun-docs`, `docs/normes-a-jour` | lun-docs#104 ; lun-docs#41 pour le seul `CLAUDE.md` de lun-docs | `trivial` |
| `.github`, `docs/lien-du-site` | lun-docs#104 (le lien du profil) | `trivial` |

## Contraintes

- Les standards restent sous 150 lignes et le gabarit `CLAUDE.md` sous 100 (`npm run check`).
- `npm run sync` recopie les standards dans le plugin : jamais d'édition directe de `plugin/skills/*/references/`.
- Une règle se cite depuis son texte d'origine ; une décision renvoie à l'audit, § 7.
- Dépôt public : aucune adresse interne, rien des dépôts privés au-delà de leur nom.

## Tâches

### 1. Le plan et l'avancement (`essentiel.md`, `structure-projet.md`)

- [ ] Le plan d'un chantier vit dans `lun-docs/docs/plans/` ; l'avancement, dans la feuille de route du MVP, qui fait
  foi (Q8). Plus de Project.
- [ ] La mise en route d'un dépôt décrit ce qui se fait aujourd'hui (deux terminaux), pas une commande promise.
- [ ] Dans la PR, la proposition de l'audit (§ 6, point 3) : un plan dans lun-docs pour un chantier `critique` ou à
  plusieurs dépôts, le plan dans la PR pour les autres. Écrite comme proposition jusqu'à la réponse de CrOliX.

### 2. La méthode (`workflow.md`, `lun-chantier`, agents, étiquettes)

- [ ] `workflow.md` réécrit à la pratique (Q9) : la session principale cadre, planifie et code ; `plan-challenger`
  attaque le plan ; `reviewer` relit chaque diff ; CrOliX valide le plan et fusionne. La grille d'agents par niveau et
  la mesure de consommation sortent (lun-docs#8, fermée).
- [ ] `lun-chantier` suit : plus de routage vers les agents `dev-*`.
- [ ] **À valider par CrOliX :** retirer du plugin `dev-haiku`, `dev-sonnet`, `dev-opus` et `dev-fable`, que plus rien
  n'appelle, et passer `reviewer` sur Opus, le modèle de la pratique.
- [ ] Les étiquettes `niveau:*` décrivent le niveau, plus l'agent, dans les quatre dépôts qui les ont (créées le 08/11
  dans lun-avaritia, qui n'en avait pas).

### 3. La fusion (`git.md`)

- [ ] *Show* et *Ask* (Q7, audit § 8.5) : ce qui se prouve sur le laptop passe « prête » dès ses critères prouvés ; ce
  que seul le desktop prouve (voix, fenêtre Tauri, services) reste en brouillon jusqu'à la recette de CrOliX.
- [ ] Squash seul, réglé dans les cinq dépôts (Q12).

### 4. Les environnements (`environnements.md`)

- [ ] Le desktop, prod du rodage, avec le vrai compte Google ; le laptop, local, avec le compte de test ; le NAS après
  (Q1).
- [ ] Une origine par app, tenue partout : Acedia sur `localhost`, l'adresse de retour enregistrée chez Google ; les
  autres sur `127.0.0.1`.

### 5. Le design (`design.md`)

- [ ] La liste des composants dit ce que le kit a ; menus, onglets, bouton flottant, carte de proposition et groupe par
  jour y sont marqués « à verser au kit ».

### 6. L'architecture actuelle

- [ ] Une page courte, `docs/architecture-actuelle.md` : les dépôts, ce qui tourne où, les ports, les liaisons, la
  fenêtre d'entrée du soir et celles de secours (audit, § 6, point 5).
- [ ] La spec écosystème y renvoie dès sa première ligne.

### 7. Le registre et lun-docs lui-même

- [ ] `lun-sandbox` (archivé) entre au registre.
- [ ] Une seule forme d'identifiant : seul `lun-docs` porte un trait d'union. Le site lit les id au build : vérifier
  dans `website` avant de renommer ; s'il s'en sert, garder et écrire la règle à la place.
- [ ] lun-docs reçoit son `CLAUDE.md`, depuis le gabarit.

### 8. Le lien mort (feuille de route, C3)

- [ ] `https://crolix-website.vercel.app` rend 404 (vérifié le 08/11). Retirer son badge du README de lun-docs et de
  `profile/README.md` dans `.github`, tant que l'hébergement n'est pas tranché (lun-docs#21). Les autres dépôts : J
  pour Acedia et Avaritia, L pour Luxuria.

### 9. Le Project

- [ ] Après le merge, fermer le Project « Lun'Ecosystem » (`gh project close`), comme tranché (Q8).

### 10. Preuves

- [ ] `npm run check` et `npm run sync:check` verts ; plus aucune contradiction du § 3.1, ligne par ligne, dans la PR.
- [ ] Relecture du diff par `reviewer` ; graphe mis à jour (`/graphify . --update`, puis le global).
