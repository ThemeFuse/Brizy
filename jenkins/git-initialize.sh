#!/usr/bin/env bash
set -e

# Deatached head fix.
echo -e "\nGiT Cleanup"
echo -e "-----------------------------------------------------------------------------"

git fetch;
git checkout .;
git clean -fd;

echo -e "\nCheckout: $1"
echo -e "-----------------------------------------------------------------------------"

git checkout master
git branch -d $1
git checkout -t origin/$1;
git reset --hard origin/$1;
