#!/usr/bin/env bash

echo -e "\Add github token in composer $1"
echo -e "-----------------------------------------------------------------------------"

# add the github token
/usr/bin/composer config -g github-oauth.github.com $1

echo -e "\Clear composer cache"
echo -e "-----------------------------------------------------------------------------"
/usr/bin/composer clearcache

echo -e "\Install composer dependencies"
echo -e "-----------------------------------------------------------------------------"
rm -rf vendor
/usr/bin/composer install --ignore-platform-reqs --prefer-dist --no-interaction --no-progress --optimize-autoloader --no-scripts  --no-dev || { exit 1; }