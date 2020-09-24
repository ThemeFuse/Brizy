#!/usr/bin/env bash

SVN_PATH=$2
BUILD_PATH=$1
BUILD_VERSION=$3

# go in svn folder
cd $SVN_PATH || exit 1

echo -e "\nSVN Cleanup"
echo -e "-----------------------------------------------------------------------------"
svn cleanup && svn revert . -R && svn up
# delete the trunk content
rm -rf trunk/*
echo -e "\nCreate new trunk"
echo -e "-----------------------------------------------------------------------------"

cp -a ${BUILD_PATH}/. ./trunk/
svn cp trunk tags/$BUILD_VERSION

if svn st | grep "!" > /dev/null; then  svn st | grep "!" | cut -d! -f2 | xargs svn rm; fi
if svn st | grep "?" > /dev/null; then  svn st | grep "?" | cut -d? -f2 | xargs svn add; fi
