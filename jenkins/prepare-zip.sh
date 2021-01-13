#!/usr/bin/env bash

BUILD_PATH=$1
ZIP_FILE_NAME=$2

cd "$BUILD_PATH/../" || exit 1
rm -rf *.zip
zip -r "$ZIP_FILE_NAME" ./brizy

