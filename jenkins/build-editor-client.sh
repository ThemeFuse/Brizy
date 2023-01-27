#!/usr/bin/env bash

CLIENTSRC=$1

# shellcheck disable=SC2164
cd "$CLIENTSRC"

npm install > /dev/null
npm run build:prod > /dev/null