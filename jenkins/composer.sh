#!/usr/bin/env bash

echo -e "\Add github token in composer $1"
echo -e "-----------------------------------------------------------------------------"

# add the github token
/usr/local/bin/composer config -g github-oauth.github.com $1

echo -e "\Clear composer cache"
echo -e "-----------------------------------------------------------------------------"
/usr/local/bin/composer clearcache
