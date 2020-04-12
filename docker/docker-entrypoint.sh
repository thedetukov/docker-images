#!/bin/sh

case "$1" in
	help)
		echo
		echo "-------------------------------------------------------------------------------------"
		echo "    Following a content of README.md. See more details inside sources repository.    "
		echo "-------------------------------------------------------------------------------------"
		echo
		echo
		cat /usr/local/sqlmigration/README.md
		exit 1
		;;
	install)
		shift
		if [ ! -d /var/local/sqlmigration ]; then
			echo "Container does not have embedded migration scripts in /var/local/sqlmigration" >&2
			exit 1
		fi
		ENVARGS="migration.directory=/var/local/sqlmigration"
		if [ -n "${POSTGRES_URL}" ]; then
			ENVARGS="${ENVARGS} postgres.url=${POSTGRES_URL}"
		fi
		if [ -n "${TARGET_VERSION}" ]; then
			ENVARGS="${ENVARGS} migration.targetVersion=${TARGET_VERSION}"
		fi
		if [ -n "${LOG4JS_CONFIG}" ]; then
			ENVARGS="${ENVARGS} LOG4JS_CONFIG=${LOG4JS_CONFIG}"
		else
			ENVARGS="${ENVARGS} LOG4JS_CONFIG=/etc/sqlmigration/log4js.json"
		fi
		[ -f "/var/local/sqlmigration/BANNER" ] && cat /var/local/sqlmigration/BANNER
		exec env -i ${ENVARGS} /usr/local/sqlmigration/bin/install.js $*
		;;
	rollback)
		shift
		if [ ! -d /var/local/sqlmigration ]; then
			echo "Container does not have embedded migration scripts in /var/local/sqlmigration" >&2
			exit 1
		fi
		ENVARGS="migration.directory=/var/local/sqlmigration"
		if [ -n "${POSTGRES_URL}" ]; then
			ENVARGS="${ENVARGS} postgres.url=${POSTGRES_URL}"
		fi
		if [ -n "${TARGET_VERSION}" ]; then
			ENVARGS="${ENVARGS} migration.targetVersion=${TARGET_VERSION}"
		fi
		if [ -n "${LOG4JS_CONFIG}" ]; then
			ENVARGS="${ENVARGS} LOG4JS_CONFIG=${LOG4JS_CONFIG}"
		else
			ENVARGS="${ENVARGS} LOG4JS_CONFIG=/etc/sqlmigration/log4js.json"
		fi
		[ -f "/var/local/sqlmigration/BANNER" ] && cat /var/local/sqlmigration/BANNER
		exec env -i ${ENVARGS} /usr/local/sqlmigration/bin/rollback.js $*
		;;
	banner)
		shift
		if [ ! -d /var/local/sqlmigration ]; then
			echo "Container does not have embedded migration scripts in /var/local/sqlmigration" >&2
			exit 1
		fi
		if [ ! -f /var/local/sqlmigration/BANNER ]; then
			echo "Embedded migration scripts does not have banner file: /var/local/sqlmigration/BANNER" >&2
			exit 2
		fi
		exec cat /var/local/sqlmigration/BANNER
		;;
	*)
		exec /bin/sh
		;;
esac
