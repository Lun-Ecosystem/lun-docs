# La fin de présence arrive même quand la page se ferme. Plan

> **Livré** par [lun-luxuria#13](https://github.com/Lun-Ecosystem/lun-luxuria/pull/13). Cases cochées le 07/11/2026.

> **Pour les agents d'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** quand l'onglet de Luxuria se ferme, le core apprend tout de suite que personne n'est plus là
(Lun-Ecosystem/lun-luxuria#8). Aujourd'hui `stopped` part à `pagehide` par un `fetch` ordinaire, que le navigateur
peut couper avec la page. La présence reste alors active jusqu'à `BEAT_LIMIT_MS` (90 s,
`lun-anima/core/src/natsume/presence.ts`), et un P0 pendant ce temps n'est annoncé par personne.

**Cadre :** recette du desktop du 07/11 (`luxuria-essai/RECETTE.md`, hors dépôt), écart n° 5. Niveau `standard`, posé
au tri du 07/11 (lun-docs#73).

**Dépôt :** `lun-luxuria` seul, branche `fix/presence-keepalive`, une PR. Le core ne change pas dans ce chantier.

**Risques écartés à la relecture :** `/api` est relatif, donc de même origine via le proxy Vite : pas de CORS ni de
pré-vol pour `keepalive` avec `Authorization`. Le corps fait une quarantaine d'octets, loin de la limite de 64 Ko. Une
erreur après la fermeture est absorbée par le `.catch` de `leave`.

## Critères de fin

1. `CoreClient.presence('stopped')` envoie sa requête avec `keepalive: true` ; `started` et `beat` sans. Méthode, chemin,
   jeton et corps inchangés. Preuve : `src/core.test.ts`, avec un `fetch` factice qui lit l'init reçu.
2. **Le retour par l'historique.** Une page mise en cache par le navigateur (`pagehide` avec `persisted`) envoie
   `stopped` ; à son retour (`pageshow` avec `persisted`), Luxuria se ré-annonce (`started`). Sinon, avec un `stopped`
   devenu fiable, l'onglet revenu bat sans présence, car un battement après une fin ne rouvre rien. Preuve : un test de
   la session, ou de la fonction qui pose ces écouteurs.
3. **L'effet, sur le laptop.** Dans Chrome, une page minimale servie par un petit serveur Node local envoie à `pagehide`
   un `fetch` `keepalive` avec un en-tête `Authorization` ; à la fermeture de l'onglet, le serveur le reçoit. Preuve :
   la sortie du serveur, dans la PR. Elle prouve le navigateur, pas Luxuria entière : la confirmation de bout en bout
   (fermer Luxuria, lire la fin de présence au core) reste pour la prochaine recette du desktop, notée dans #8.
4. Barrières vertes : `npm run format:check`, `lint`, `typecheck`, `test`, `build`.

**Hors périmètre :**
- Deux onglets reliés au même core : `presenceEnd` termine la présence unique sans regarder qui l'envoie
  (`lun-anima/core/src/natsume/presence-routes.ts`). Fermer un onglet coupe la présence de l'autre, et `keepalive` le
  rend certain. Issue `inbox` dans lun-anima ; il faudrait un identifiant d'onglet, le jeton désignant l'appareil.
- Un arrêt de session sans fermer la page : rien n'appelle `abort()` aujourd'hui, et `abort` retire l'écouteur sans
  envoyer `stopped`. À penser le jour où un arrêt existera.
- `navigator.sendBeacon` (pas d'en-tête `Authorization`), `visibilitychange`, le mode seul (sa présence ne fait rien),
  Tauri.

## Tâches

- [x] Test d'abord, `src/core.test.ts` : `keepalive` pour `stopped` seulement, le reste de l'init inchangé.
- [x] `presence` passe `...(state === 'stopped' ? { keepalive: true } : {})` à `#call`, qui garde l'option.
- [x] Test d'abord, le retour par l'historique : `pageshow` avec `persisted` rappelle l'annonce, sans `persisted` rien.
- [x] `session.svelte.ts` : un écouteur `pageshow` qui rappelle `#announce()` si `persisted`, retiré à `abort` comme les
      autres.
- [x] La preuve Chrome du critère 3, script dans le scratchpad, sortie dans la PR.
- [x] Issue `inbox` lun-anima pour les deux onglets ; commentaire dans #8 sur la confirmation au desktop.
- [x] Relecture (agent reviewer), PR avec `lun-livrer`, critères cochés et preuves.
