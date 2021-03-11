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

find . -type f -name "*.dev.php" -delete
rm -rf ./public/editor-src
rm -rf ./.phpunit*
rm -rf ./.env*  .idea
rm -rf ./.github
rm -rf ./bin ./tests *.dist *.xml *.lock *.json *.yml *.sh ./vendor/twig/twig/test
rm -rf ./vendor/twig/twig/ext/twig ./vendor/twig/twig/doc
rm -rf ./vendor/imagine/imagine/lib/Imagine/resources/Adobe/*.pdf
rm -rf ./vendor/select2/select2/docs
rm -rf ./vendor/select2/select2/tests
rm -rf ./vendor/shortpixel/shortpixel-php/test
rm -rf ./vendor/shortpixel/shortpixel-php/examples
rm -rf ./vendor/enshrined/svg-sanitize/tests/
rm -rf ./vendor/bagrinsergiu/brizy-migration-utils/tests/
( find ./ -type d -name ".git" && find ./ -name ".gitignore" && find ./ -name ".gitmodules" && find ./vendor -name "*.md" && find ./ -name "composer.json" && find ./ -name "composer.lock" && find ./ -name ".travis.yml" && find ./ -name "phpunit.xml.dist" ) | xargs rm -rf
find . -type d -name ".git"  | xargs rm -rf
find . -name ".gitignore" | xargs rm -rf
find . -name ".gitmodules" | xargs rm -rf
rm -rf ./Jenkinsfile




