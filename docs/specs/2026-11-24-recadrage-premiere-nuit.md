# Après la première nuit sur le NAS. Recadrage

> Recadrage du 24/11, demandé par CrOliX après la première nuit de la prod sur le NAS : « recadrer la suite du
> travail en gardant notre MVP en tête ». Ce document part de ce que la nuit et l'audit du 24/11 ont montré (§ 2),
> trie chaque constat contre les promesses du VIP (§ 3) et fixe trois chantiers et un ordre (§ 4). Les choix marqués
> **[avis Claude]** sont des propositions ; les décisions de CrOliX sont au § 5.

## 1. La borne

Inchangée depuis le [recadrage du 19/11](2026-11-19-recadrage-vip.md) : les cinq promesses de
[`vision.md`](../../vision.md), tenues et prouvées ou retirées, puis une semaine utilisable de bout en bout sans
point de tension, avant le 31 décembre 2026. Le design du front se retravaille après le VIP. Depuis l'[ADR
0014](../../adr/0014-mvp-sur-le-nas.md), la semaine se joue sur le NAS.

## 2. Ce que la première nuit a montré

La prod tourne sur le NAS depuis le 23/11 au soir. Le 24/11 : l'état des conteneurs relevé par la porte, les
journaux des six conteneurs lus par CrOliX puis passés à la session, les trois apps parcourues dans Chrome en largeur
de laptop et de téléphone, puis un audit par app (fonctions en direct et par le core, tensions visuelles et de
comportement, écarts aux specs).

- **L'hôte a tenu** : six conteneurs sains, aucun redémarrage, la copie du jour écrite par les trois apps, 3 % du
  disque, la mémoire large.
- **La lettre du matin est partie sans contexte** : la composition du contexte chaud échoue quand le modèle propose
  plus de trois recherches (Lun-Ecosystem/lun-anima#133).
- **La bibliothèque a reçu quatre brouillons hors de son rôle**, tirés des sujets de mails du jour, dont des mails
  déjà jetés à la main (Lun-Ecosystem/lun-avaritia#46 et son commentaire).
- **Ce qui remonte d'Acedia au core se voit à peine**, et aucune urgence n'existe sans règle
  (Lun-Ecosystem/lun-anima#135).
- **Des écrans gênent** : la barre latérale écrasée dans la Réception d'Acedia en hauteur de laptop
  (Lun-Ecosystem/lun-docs#201) ; sur téléphone, les filtres du Journal du core qui poussent la liste
  (Lun-Ecosystem/lun-anima#134).
- **L'audit par app** ajoute : une carte de fiche tranchée dans le core sans accès à la fiche ; un refus sans
  annulation dans Avaritia, et une touche qui refuse sans focus ; une pause d'Acedia qui ne se comporte pas pareil
  selon d'où elle vient ; puis des écarts de vocabulaire au dictionnaire, des fonctions absentes du téléphone et des
  finitions.
- **La prod d'Acedia a trois commits de retard** sur `main` (dont le Journal qui dit ce qui est arrivé au mail et le
  refus d'une proposition) : une partie de ce qui se voit est déjà corrigée, pas publiée.

## 3. Le tri, contre les promesses

| Panier | Ce qui y va | Pourquoi |
|---|---|---|
| **Avant la semaine** | le contexte chaud ; la bibliothèque nourrie par la conversation seule ; trancher sans risque ; la barre latérale ; le core sur téléphone ; Acedia 0.2.1 publiée | une tension connue casserait la semaine à coup sûr, ou une promesse n'est pas tenue (2. la bibliothèque, 4. le téléphone, 5. le contrôle) |
| **Pendant la semaine** | les tensions nouvelles, notées sans être corrigées au fil de l'eau | la semaine juge l'usage, pas un code qui change chaque jour |
| **Après le VIP** | le reste de l'audit : design, finitions, vocabulaire, fonctions absentes du téléphone hors promesse ; les mails dans la bibliothèque (source filtrée, refus qui apprennent) ; l'urgence et ce qui remonte d'Acedia (lun-anima#135) ; Modifier une fiche depuis le core | « après le VIP » dans `vision.md` (le rangement selon l'urgence, le design retravaillé), ou hors des promesses |

**La bibliothèque.** `vision.md` promet : « ce qu'elle apprend en conversation y arrive chaque nuit », et la ligne
d'arrivée d'Avaritia : « un fait n'entre que par citation exacte, après une parole entendue ». Le bilan d'Acedia
envoyé aux fiches dépasse la promesse. Pour le VIP, la nuit ne propose de fiches que depuis la conversation ; le bilan
d'Acedia sert toujours au récit de la nuit et à la lettre du matin.

**Trancher sans risque [avis Claude].** Le lien vers la fiche, déjà donné par le Journal du core, plutôt que Modifier
dans le core : avec la conversation seule, les brouillons seront peu nombreux, et Modifier dans le core est un
chantier à lui seul.

## 4. Trois chantiers, en parallèle

Chacun a son issue, son plan court dans `docs/plans/`, contesté puis validé, une PR par dépôt touché et ses preuves.

1. **La nuit et la mémoire** (core seul) : le contexte chaud ne tombe plus quand le modèle propose plus de trois
   recherches (lun-anima#133) ; la nuit n'envoie à la bibliothèque que ce qui vient de la conversation (part
   « VIP » de lun-avaritia#46). Preuve : une nuit rejouée avec un bilan d'Acedia ne donne aucun brouillon tiré d'un
   mail, et le contexte chaud s'écrit.
2. **Trancher sans risque** (core, Avaritia, Acedia) : depuis la carte d'une fiche dans le core, la fiche
   s'ouvre dans Avaritia ; dans Avaritia, un refus s'annule, et aucune touche ne tranche sans carte au focus ; la
   pause d'Acedia se comporte pareil qu'elle vienne de Natsume, de Pina ou de l'écran, comme sa spec le dit.
3. **Les écrans qui gênent** (kit, Acedia, core) : un lien de navigation garde sa hauteur dans une barre qui
   déborde (lun-docs#201, kit et copies) ; sur téléphone, les filtres du Journal du core s'ouvrent par-dessus la
   liste, et le Bureau ne déborde plus (lun-anima#134) ; une ligne des standards de design couvre la hauteur courte.

À la main de CrOliX, en parallèle : publier Acedia 0.2.1, puis la déployer par la porte (`deploy`) ; finir les
tâches 10 à 12 de la [mise en service](../plans/2026-11-22-mise-en-service-nas.md) (premier tour et dépenses,
copies et restauration, mise à jour).

**Ensuite** : les versions des trois chantiers publiées et déployées, la session du desktop pour la voix (point 2 de
l'ordre du 20/11), puis la semaine de rodage, d'un jour fixe.

## 5. Décisions de CrOliX, le 24/11

1. **Pour le VIP, la bibliothèque n'est nourrie que par la conversation.** Le bilan d'Acedia ne donne plus de
   fiches ; il sert toujours au récit et à la lettre du matin. Les mails dans la bibliothèque se cadrent après le VIP.
2. **La semaine de rodage part après le panier « avant la semaine »**, d'un jour fixe. Les jours depuis le 23/11
   sont une répétition. **Elle attend aussi la session du desktop** : l'ordre du 20/11 tient, et la semaine juge
   les cinq promesses d'un coup.
3. **Trois chantiers en parallèle, par thème** (§ 4), plutôt qu'un seul chantier ou un par dépôt.
