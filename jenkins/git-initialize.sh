#!/usr/bin/env bash

# Deatached head fix.
echo -e "\nGiT Cleanup"
echo -e "-----------------------------------------------------------------------------"
git checkout .;
git fetch;
git clean -fd;
git checkout $1;
git reset --hard origin/$1;
