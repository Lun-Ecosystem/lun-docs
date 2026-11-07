# La route jusqu'au MVP : état au 07/11 et prochains chantiers

> Demande de CrOliX, le 07/11 : « reprendre l'état global actuel de l'écosystème, identifier les points à traiter au vu
> du MVP, les classer et préparer les prochains chantiers complets en autonomie ». Ce document est la liste de référence ;
> chaque chantier a sa spec et son plan.

## 1. Où on en est

| Jalon (spec écosystème §10.3) | État au 07/11 |
|---|---|
| J0, J1, J2 | faits |
| J3 Apps v1 | mobile fait ; Lun'Luxuria remplace l'app desktop, dans sa fenêtre Tauri (lun-luxuria#20) |
| J4 Nuit, voix, contrôle | nuit, matin, notifications, voix et corps en images faits ; relevés du desktop en attente ; avatar animé après le MVP (lun-docs#62) ; **modes remplacés par le mute du bureau** (décision du 07/11) |
| J5 Rodage | pas commencé : rien ne permet encore une semaine sans intervention (§2, A2) |

Dépôts : aucune PR ouverte, tout est sur `main` ; lun-anima était resté sur une branche déjà fusionnée (#65), remis sur
`main`. Plans du 07/11 : tous cochés sauf `voix-confiance-blocs` (pas commencé) ; `luxuria-essai-chronometre` reste en
partie vide, son relevé est fait (lun-luxuria#9).

## 2. Ce qui reste, classé

### A. Bloque le MVP, faisable sur le laptop

| # | Point | Où | Chantier |
|---|---|---|---|
| A1 | **Le mute du bureau** : couper ses sens, urgences en exception réglable | lun-luxuria, lun-anima | [F](#f-le-mute-du-bureau) |
| A2 | **Le poste qui tourne seul** : serveurs sans console qui redémarrent, journaux, sauvegarde de la base, Luxuria avec Windows et dans la zone de notification, téléphone par Tailscale | les cinq dépôts | [G](#g-le-poste-qui-tourne-seul) ; côté laptop : lun-anima#69, lun-luxuria#24, la page [`mise-en-service-desktop.md`](../mise-en-service-desktop.md) ; l'installation est B8 |
| A3 | **La confiance de whisper-server** fixée à 0,9 : un « Oui » a validé une carte (lun-luxuria#6, critique), et RVC par blocs (lun-luxuria#7, première étape). La partie code se prouve sur le laptop contre des faux ; seuls les relevés demandent le desktop | lun-luxuria | [H](#h-la-confiance-de-la-voix), plan déjà écrit |
| A4 | Les specs qui se contredisent sur les modes (J4, notifications, Luxuria §6.6), et l'app desktop du §8 de la spec écosystème (mises à jour) | lun-docs | fait : lun-docs#95, la PR qui le ferme (le §8 disait déjà « sans mise à jour automatique au MVP ») |

### B. Bloque le MVP, attend le desktop ou CrOliX

| # | Point | Qui |
|---|---|---|
| B1 | Relevés de confiance et de latence (critère 4 du plan `voix-confiance-blocs`), puis levée du verrou de l'ADR 0011 | desktop, puis CrOliX |
| B2 | La langue parlée : français direct contre réponse en anglais sous-titrée | CrOliX, à l'oreille |
| B3 | Le flux RVC dès le premier bloc (reste de lun-luxuria#7), décidé après B1 | desktop |
| B4 | Preuve manuelle des touches globales de l'exe (critère 4 du plan Tauri) : `Ctrl+Maj+L` depuis une autre fenêtre, F9 tenue puis lâchée | CrOliX |
| B5 | Rejoindre un salon Discord passe en `occupée` (écart 2 de la recette, corrigé sur le laptop, à constater) | desktop |
| B6 | Une soirée réelle : latence par tour et coût, puis décision sur le plafond de 1 $ par jour (spec Luxuria §6.7) | desktop |
| B7 | Notifications Windows coupées (`ToastEnabled = 0`) ; vcclient sur `0.0.0.0:18000` et règles du pare-feu | CrOliX : réglages système |
| B8 | La semaine de rodage elle-même (J5), sur le poste mis en service par G | CrOliX |
| B9 | Recette du mute, points 1, 3 et 5 : aucune capture en sourdine, la parole spontanée repart à son heure, en appel un P0 n'est pas dit | desktop |

### C. Petit, à glisser dans un chantier qui passe par le dépôt

| # | Point | Dépôt | Rangé dans |
|---|---|---|---|
| C1 | Test instable « Logged once, not at each retry » (lun-anima#7, trivial) | lun-anima | F |
| C2 | Une nouvelle liaison du core remplace l'ancienne au lieu d'en ajouter une (lun-acedia#30). Elle attend un choix de cadrage, révocation douce ou doublons affichés, et aucun critère de G ne l'exige avec des bases neuves | lun-acedia | à cadrer avec CrOliX |

### D. Après le MVP

Les rôles de Natsume façon assistants de Mia (spec du mute, §2) ; l'avatar animé (lun-docs#62) ; le NAS et l'accès sans
client (ADR 0008) ; les mises à jour automatiques de Luxuria ; la trajectoire de Luxuria (§11) ; le confort d'Acedia
(#33, #34, #38) ; le kit commun et la forme des dépôts (lun-docs#41, #43) ; le site (#21, #25) ; la sandbox ; la
sauvegarde d'Avaritia.

## 3. Les chantiers, dans l'ordre

Une PR par dépôt et par chantier, brouillon dès le premier push. Autonomie donnée par CrOliX le 07/11 : chaque plan
s'exécute après la relecture du plan-challenger. Les specs F et G sont **à relire par CrOliX** ; leurs choix marqués
**[choix Claude]** se changent avant le merge.

### F. Le mute du bureau

Spec : [`2026-11-07-mute-du-bureau-design.md`](../specs/2026-11-07-mute-du-bureau-design.md). Plan :
[`2026-11-07-mute-du-bureau.md`](2026-11-07-mute-du-bureau.md). lun-anima (le champ `muted`, puis C1), puis lun-luxuria.
Niveau `standard`.

### G. Le poste qui tourne seul

Spec : [`2026-11-07-poste-autonome-design.md`](../specs/2026-11-07-poste-autonome-design.md). Plan :
[`2026-11-07-poste-autonome.md`](2026-11-07-poste-autonome.md). Niveau `standard`. Après F pour Luxuria (le menu de
l'icône porte le mute).

### H. La confiance de la voix

Plan : [`2026-11-07-voix-confiance-blocs.md`](2026-11-07-voix-confiance-blocs.md), déjà écrit. Critères 1 à 3, 5 et 6
sur le laptop ; le critère 4 attend le desktop, et la PR le dit. Niveau `critique`. Indépendant de F et G : il ne touche
que `voix/`.

**Ordre** : H et F en parallèle (dépôts ou dossiers séparés), puis G. Au bout : le poste prêt pour la semaine de rodage,
et la liste B pour le desktop.
