# Database Migration

This is migration runtime that allows to install/rollback SQL scripts.

Public Image:
	https://hub.docker.com/r/theanurin/sqlmigration

## Migration directory tree (example)
```
.
├── v02.00
│   ├── install
│   │   ├── 00-begin.js
│   │   ├── 10-user-install.sql
│   │   ├── 20-uuid-ext-install.sql
│   │   ├── 80-setdbowner-install.sql
│   │   └── 99-end.js
│   └── rollback
│       ├── 00-end.js
│       ├── 10-user-rollback.sql
│       ├── 20-uuid-ext-rollback.sql
│       ├── 80-setdbowner-install.sql
│       └── 99-begin.js
├── v02.01
│   ├── install
│   │   └── 50-schemas-install.sql
│   └── rollback
│       └── 50-schemas-rollback.sql
└── v02.02
    ├── install
    │   └── 50-tr_block_any_updates.sql
    └── rollback
        └── 50-tr_block_any_updates.sql
```

Where `v02.00`, `v02.01` and `v02.02` versions of a database. Choose version naming by your own. `MigrationManager` used alpha-number sorting to build install/rollback sequence.


## Use this container directly

### Install

```bash
docker run --rm --tty --interactive --volume /PATH/TO/YOUR/MIGRATION/DIRECTORY:/var/local/sqlmigration/ --env POSTGRES_URL="postgres://postgres@host.docker.internal:5432/emptytestdb" --env TARGET_VERSION="v42" theanurin/sqlmigration install
```

Note: `TARGET_VERSION` is optional. Install latest version, if omited.


### Rollback

```bash
docker run --rm --tty --interactive --volume /PATH/TO/YOUR/MIGRATION/DIRECTORY:/var/local/sqlmigration/ --env POSTGRES_URL="postgres://postgres@host.docker.internal:5432/emptytestdb" --env TARGET_VERSION="v42" theanurin/sqlmigration rollback
```

Note: `TARGET_VERSION` is optional. Rollback all versions, if omited.

### Advanced (use secret files instead env vars)

Instead passing `--env` you may bind volume with [secret files](https://docs.docker.com/engine/swarm/secrets/) to `/etc/sqlmigration/secrets` or `/run/secrets`. The secrets directory tree:
```
.
├── migration.installTargetVersion
├── migration.rollbackTargetVersion
└── postgres.url
```


## Use this container to build standalone SQL release container

TBD
