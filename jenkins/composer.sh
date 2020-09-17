#!/usr/bin/env bash

$GITHUB_TOKEN=$1

echo -e "\Add github token in composer $1"
echo -e "-----------------------------------------------------------------------------"

# add the github token
/usr/local/bin/composer config -g github-oauth.github.com '${GITHUB_TOKEN}'

echo -e "\Clear composer cache"
echo -e "-----------------------------------------------------------------------------"
/usr/local/bin/composer clearcache
