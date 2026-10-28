# ADR 0005 : le cerveau d'Avaritia vit dans SQLite

Statut : acceptée
Date : 2026-10-28

## Contexte

[`standards/stack.md`](../standards/stack.md) prévoyait pour le cerveau des fichiers Markdown
(convention Obsidian) indexés dans SQLite. Or les services tournent sur un serveur, comme le NAS de
CrOliX ou celui d'un autre utilisateur. La [spec d'Avaritia v1](../docs/specs/2026-10-28-lun-avaritia-v1-design.md)
(§3.2) en tire les conséquences.

## Décision

- **SQLite est la source de vérité.** Le corps des fiches est du Markdown, stocké dans la base.
- La recherche plein texte passe par FTS5, sans service en plus.
- Obsidian reste une porte : **import** d'un coffre (en brouillons) et **export** en dossier Markdown
  lisible, pour sortir ses données ou les sauvegarder.
- La recherche par le sens (vecteurs) n'est pas dans la v1. Elle pourra s'ajouter dans le même
  fichier.

## Conséquences

- Toute écriture passe par la validation d'Avaritia.
- Une sauvegarde est la copie d'un seul fichier, qui tient bien dans Docker.
- Éditer les fiches dans Obsidian en direct n'est plus possible. On importe puis on exporte.

## Alternatives écartées

- **Fichiers Markdown indexés** : des fichiers modifiés via un partage réseau contourneraient la
  validation, et la surveillance de fichiers n'y est pas fiable.
