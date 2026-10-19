# <Nom affiché : Lun'Xxx>

<Une phrase : ce que fait le projet, pour qui.>

**Rôle dans l'écosystème** : <core | satellite>. <Ce qu'il possède, ce qu'il consomme.>

## Démarrer en local

```bash
cp .env.example .env    # renseigner les clés de développement et le compte Google de test
<la commande unique qui démarre tout>
```

Aucune dépendance au NAS : tout tourne sur le poste.

## Documentation

- [`docs/`](docs/) : ce que fait le projet aujourd'hui (utilisateur, technique, exploitation).
- [`docs/decisions/`](docs/decisions/) : les décisions propres au projet.
- Règles communes : [lun-docs](https://github.com/Lun-Ecosystem/lun-docs).

## Contribuer

Une branche, une PR avec critères de fin et preuves, CI verte. Seul CrOliX merge.

<!-- Core privé uniquement : activer le hook qui refuse tout push vers main -->
<!-- git config core.hooksPath hooks -->
