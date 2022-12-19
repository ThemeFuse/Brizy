#!/usr/bin/env bash

# Deatached head fix.
echo -e "\nGiT Cleanup"
echo -e "-----------------------------------------------------------------------------"
git reset --hard || true
git merge --abort || true
git clean -fd
git fetch origin

echo -e "\nCheckout: $1"
echo -e "-----------------------------------------------------------------------------"

git checkout $1
git reset --hard origin/$1
