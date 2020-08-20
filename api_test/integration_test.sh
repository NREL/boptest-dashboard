#!/bin/bash
set -e

# PG_HOST=${POSTGRES_HOST}
# while ! nc -w 1 -z $PG_HOST 5432
#   do sleep 0.1
# done

SERVER_HOST=${SERVER_HOST}
while ! nc -w 1 -z $SERVER_HOST 8080
  do sleep 0.1
done

sleep 5 && npm test
