#!/usr/bin/env bash

SVN_PATH=$1

# go in svn folder
cd $SVN_PATH

# create the build archive
rm -f *.zip
rm -rf brizy && mkdir brizy
cp -a ./trunk/. ./brizy/
zip -r $ZIP_FILE_NAME brizy/ -x .git -x .idea -x .gitignore
rm -rf ./brizy

