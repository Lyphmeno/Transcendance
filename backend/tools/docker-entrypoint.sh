#!/bin/bash

set -e

for attempt in {1..30}; do
	if npx prisma migrate deploy; then
		break
	fi

	if [ "$attempt" -eq 30 ]; then
		echo "Prisma migrations failed after $attempt attempts."
		exit 1
	fi

	echo "Database is not ready yet, retrying Prisma migrations in 2s..."
	sleep 2
done

exec "$@"
