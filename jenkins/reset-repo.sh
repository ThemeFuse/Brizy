#!/usr/bin/env bash

REPO_PATH=$1
REPO_BRANCH=$2


cd $REPO_PATH

# fetch all changes
git fetch origin

# unstage all files
git reset
git checkout .
git clean -fd

# reset all local branches to original state
git checkout develop
git reset --hard origin/develop

git checkout master
git reset --hard origin/master

# delete all local branches except for master/main and develop
if [[ $(git branch | grep -v "master$\|develop$") ]]; then
  git branch | grep -v "master$\|develop$" | xargs git branch -D
fi