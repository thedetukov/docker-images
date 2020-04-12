[![Docker Image Version](https://img.shields.io/docker/v/theanurin/sqlmigration?sort=date&label=Version)](https://hub.docker.com/r/theanurin/sqlmigration/tags)
[![Docker Image Size](https://img.shields.io/docker/image-size/theanurin/sqlmigration?label=Image%20Size)](https://hub.docker.com/r/theanurin/sqlmigration/tags)
[![Docker Pulls](https://img.shields.io/docker/pulls/theanurin/sqlmigration?label=Pulls)](https://hub.docker.com/r/theanurin/sqlmigration)
[![Docker Stars](https://img.shields.io/docker/stars/theanurin/sqlmigration?label=Docker%20Stars)](https://hub.docker.com/r/theanurin/sqlmigration)

# Database Migration

This is migration runtime that allows to install/rollback SQL scripts.

Public Image:
	https://hub.docker.com/r/theanurin/sqlmigration

## Migration directory tree (example)
```
.
├── v0000
│   ├── install
│   │   ├── 00-begin.js
│   │   ├── 10-user-install.sql
│   │   ├── 20-uuid-ext-install.sql
│   │   └── 99-end.js
│   └── rollback
│       ├── 00-begin.js
│       ├── 10-user-rollback.sql
│       ├── 20-uuid-ext-rollback.sql
│       └── 99-end.js
├── v0001
│   ├── install
│   │   └── 50-schemas-install.sql
│   └── rollback
│       └── 50-schemas-rollback.sql
└── v0002
    ├── install
    │   └── 50-tr_block_any_updates.sql
    └── rollback
        └── 50-tr_block_any_updates.sql
```

Where `v0000`, `v0001` and `v0002` versions of a database. Choose version naming by your own. `MigrationManager` used alpha-number sorting to build install/rollback sequence.


## Use this container directly

### Install

```shell
docker run --rm --tty --interactive \
  --volume /PATH/TO/YOUR/MIGRATION/DIRECTORY:/var/local/sqlmigration/ \
  --env POSTGRES_URL="postgres://postgres@host.docker.internal:5432/emptytestdb" \
  --env TARGET_VERSION="v0042" \
  theanurin/sqlmigration install
```

Note: `TARGET_VERSION` is optional. Install latest version, if omitted.


### Rollback

```shell
docker run --rm --tty --interactive \
  --mount /PATH/TO/YOUR/MIGRATION/DIRECTORY:/var/local/sqlmigration/ \
  --env POSTGRES_URL="postgres://postgres@host.docker.internal:5432/emptytestdb" \
  --env TARGET_VERSION="v0042" \
  theanurin/sqlmigration rollback
```

Note: `TARGET_VERSION` is optional. Rollback all versions, if omitted.

### Advanced (use secret files instead env vars)

Instead passing `POSTGRES_URL` via `--env` you may bind a volume with [secret files](https://docs.docker.com/engine/swarm/secrets/) named `postgres.url` to `/run/secrets`. 

Expected secrets directory tree:

```
/run/secrets
├── ...
├── postgres.url
└── ...
```


## Use this container to build standalone SQL release container

TBD
