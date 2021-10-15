#!/usr/bin/env bash

rm -rf $1
mkdir -p $1

cp -a ./. $1

cd $1

echo -e "\nInstall composer dependencies"
echo -e "-----------------------------------------------------------------------------"

rm -rf vendor
/usr/local/bin/composer install --no-dev

# delete all files that are not needed in the final build
echo -e "\nDelete all dev files"
echo -e "-----------------------------------------------------------------------------"
echo -e "Clean vendor folder"
(  find ./vendor -type d -iname "docs" &&
   find ./vendor -type d -name "doc" &&
   find ./vendor -type d -name ".git" &&
   find ./vendor -name "*.md" &&
   find ./vendor -name "composer.json" &&
   find ./vendor -name "composer.lock" &&
   find ./vendor -name "changelog.txt" &&
   find ./vendor -name "changelog.md" &&
   find ./vendor -name "phpcs.*" &&
   find ./vendor -name "*.dist" &&
   find ./vendor -name ".github" &&
   find ./vendor -name "Dockerfile" &&
   find ./vendor -name ".travis.yml" &&
   find ./vendor -name ".gitignore" ) | xargs --no-run-if-empty rm -rf

echo -e "Clean plugin root folder"
rm -rf ./public/editor-src \
       ./.phpunit* \
       ./.env* \
       .idea \
       ./.github \
       ./bin ./tests *.dist *.xml *.lock *.json *.yml *.sh ./vendor/twig/twig/test \
       ./vendor/twig/twig/ext/twig ./vendor/twig/twig/doc \
       ./vendor/imagine/imagine/lib/Imagine/resources/Adobe/*.pdf \
       ./vendor/shortpixel/shortpixel-php/examples \
       ./vendor/bagrinsergiu/brizy-migration-utils/tests/ \
       ./Jenkinsfile \
       ./.gitignore \
       ./.gitmodules \
       ./.git \
       ./composer.* \
       ./.travis.yml \
       ./*.dev.php \
       ./jenkins
