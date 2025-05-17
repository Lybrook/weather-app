#!/bin/sh
export SERVER_NAME=":$PORT"
exec /usr/local/bin/docker-php-entrypoint "$@"