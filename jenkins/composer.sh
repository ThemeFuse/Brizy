#!/usr/bin/env bash

echo -e "\Add github token in composer $1"
echo -e "-----------------------------------------------------------------------------"

# add the github token
/usr/bin/composer config -g github-oauth.github.com $1

echo -e "\Clear composer cache"
echo -e "-----------------------------------------------------------------------------"
/usr/bin/composer clearcache
