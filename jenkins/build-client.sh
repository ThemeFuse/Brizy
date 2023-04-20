#!/usr/bin/env bash

echo -e "\nClean node modules in editor client"
sudo rm -rf ./public/editor-client/node_modules
sudo rm -rf ./public/editor-client/build

cd ./public/editor-client
echo -e "\nInstall dependencies"
npm install --silent

echo -e "\Build editor client dependencies"
npm run build:prod