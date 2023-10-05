#!/usr/bin/env bash

BUILD_VERSION=$1
EDITOR_VERSION=$2
RELEASE_BRANCH=$3

echo -e "\nPublishing the release in GIT"
echo -e "-----------------------------------------------------------------------------"
git add ./public/editor-build/$EDITOR_VERSION
git add ./public/editor-client/*
git add ./readme.txt
git add ./README.md
git add ./brizy.php
git commit -a -m "Build $BUILD_VERSION"
echo -e "\nPublishing the release branch: $RELEASE_BRANCH"
echo -e "-----------------------------------------------------------------------------"
git push origin $RELEASE_BRANCH

echo -e "\nMerge the $RELEASE_BRANCH in master"
echo -e "-----------------------------------------------------------------------------"


git branch -d master
git checkout -t origin/master
git reset --hard origin/master
# shellcheck disable=SC2086
git merge --no-ff -m "Merge [$RELEASE_BRANCH] in master" $RELEASE_BRANCH
git push origin master

echo -e "\Creating the release tag: $BUILD_VERSION"
echo -e "-----------------------------------------------------------------------------"
git tag -d $BUILD_VERSION
git push --delete origin $BUILD_VERSION
git tag $BUILD_VERSION

echo -e "\nPublishing the master branch and tags"
echo -e "-----------------------------------------------------------------------------"
git push origin  --tags

git branch -d develop
git checkout -t origin/develop
git reset --hard origin/develop
git merge --no-ff -m "Merge [$RELEASE_BRANCH] in develop" $RELEASE_BRANCH
git push origin develop



