#!/usr/bin/env bash

# Deatached head fix.
echo -e "\nGiT Cleanup"
echo -e "-----------------------------------------------------------------------------"
git clean -fd

echo -e "\nCheckout: $1"
echo -e "-----------------------------------------------------------------------------"
git config --add remote.origin.fetch +refs/heads/$1:refs/remotes/origin/$1
#git fetch --no-tags --force --progress --depth=1 -- https://github.com/ThemeFuse/Brizy/ +refs/heads/$1:refs/remotes/origin/$1
git checkout -t origin/$1
