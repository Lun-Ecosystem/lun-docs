---
name: lun-inbox
description: Use for the weekly triage of inbox issues across all Lun' repositories, or when CrOliX asks what is waiting in the inbox. Proposes a decision per issue; CrOliX decides.
---

# Tri de l'inbox

Le tri a lieu **une fois par semaine**, à heure fixe (`references/workflow.md`). Il ne se fait pas
au fil de l'eau et n'ouvre aucun chantier de lui-même.

1. Liste les issues ouvertes :
   `gh search issues --owner Lun-Ecosystem --label inbox --state open --json repository,number,title,createdAt,url`
2. Pour chacune, lis-la (`gh issue view <n> -R <owner/repo>`) et propose **une** décision :
   - **Jeter** : plus d'actualité, doublon, ou contraire à la vision.
   - **Chantier futur** : avec un niveau proposé (`niveau:*`) et une phrase de critère de fin.
   - **Rattacher à un jalon** du GitHub Projects « Lun'Ecosystem » (un MVP).
3. Présente le tout à CrOliX dans un tableau (dépôt, n°, titre, proposition, raison).
4. Applique **uniquement** ce que CrOliX valide : fermer (`gh issue close`), retirer `inbox` et poser
   le niveau (`gh issue edit`), ajouter au projet (`gh project item-add`).
