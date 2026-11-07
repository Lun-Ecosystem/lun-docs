# Service voix : un refus arrive comme un refus. Plan

> **Livré** par [lun-luxuria#17](https://github.com/Lun-Ecosystem/lun-luxuria/pull/17), avec le chantier A de
> `2026-11-07-chantiers-laptop-avant-mvp.md` (le commit de lun-luxuria#16, fermée, y est repris). Cases cochées le 07/11/2026.

> **Pour les agents d'exécution :** superpowers:executing-plans, tâche par tâche. Cases à cocher (`- [ ]`) pour le suivi.

**But :** qu'un `POST` refusé reçoive son 403 au lieu d'une connexion coupée (Lun-Ecosystem/lun-luxuria#14), et que
`voix/test_service.py` ne casse plus une fois sur huit. `_refused` (`voix/service.py`) répond sans lire le corps ;
sous Windows, fermer une connexion avec des octets non lus envoie un RST, parfois avant que le client ait lu la réponse.

**Cadre :** vu le 07/11 sur le laptop pendant lun-luxuria#5 et #10. Niveau `trivial`.

**Dépôt :** `lun-luxuria` seul, branche `fix/refus-sans-coupure`, une PR.

## Critères de fin

1. Avant de répondre 403, `_refused` lit le corps annoncé s'il fait au plus 1 Mo **[choix Claude]**, pour qu'aucun
   octet ne reste en attente. Au-delà, il ne le lit pas : une page refusée ne fait pas lire 64 Mo au service, et la
   coupure possible reste acceptable pour elle. Rien de ce qui est lu n'atteint la transcription ni la synthèse.
2. Un `Content-Length` illisible (`abc`) ou négatif ne fait rien lire, et la réponse reste 403 : ni plantage, ni
   lecture jusqu'à la fin de la connexion.
3. Un client qui annonce un corps sans l'envoyer ne bloque pas : `Handler.timeout = 5` s, une lecture expirée est
   ignorée, puis le 403 part **[choix Claude]**.
4. Preuve : dans un même lancement de `voix/test_service.py`, 30 `POST /stt` refusés d'affilée, un refus avec un corps
   d'environ 500 Ko, un avec `Content-Length: abc` et un avec `-1` reçoivent tous 403. Le fichier passe 10 lancements
   séparés de suite. Sans le correctif, 30 refus sans coupure n'arrivent qu'environ 2 fois sur 100, si l'aléa est
   d'une fois sur huit.
5. Barrières vertes : `npm run format:check`, `lint`, `typecheck`, `test`, `build`, et `voix/test_service.py`.

**Écarté :** `Connection: close` ou `close_connection`, déjà en vigueur en HTTP/1.0 (le serveur ferme après chaque
réponse), et qui ne règle rien : c'est la fermeture avec des octets non lus qui coupe. Une lecture par morceaux : elle
éviterait d'allouer 1 Mo d'un coup, ce qui ne pèse pas ici.

**Hors périmètre :** les `GET` (sans corps), le client, le même défaut d'un `Content-Length` illisible sur une page
autorisée (`_body`, déjà dans le `try` de `do_POST` : un 500, pas une coupure).

## Tâches

- [x] Test d'abord : les 30 refus, le corps de 500 Ko, `abc` et `-1`.
- [x] `_refused` : la lecture bornée et gardée, `Handler.timeout`, commentaire d'une ligne sur le RST de Windows.
- [x] Relecture (agent reviewer), PR avec `lun-livrer`, critères cochés et preuves.
