#!/usr/bin/env bash

SVN_PATH=$1
ZIP_FILE_NAME=$2
WORKSPACEE_PATH=$(pwd)

# go in svn folder
cd $SVN_PATH

echo -e "\nSVN Cleanup"
echo -e "-----------------------------------------------------------------------------"
svn cleanup && svn revert . -R && svn up
# delete the trunk content
rm -rf trunk/*
echo -e "\nCreate new trunk"
echo -e "-----------------------------------------------------------------------------"
echo "${WORKSPACEE_PATH}/."
cp -a "${WORKSPACEE_PATH}/." ./trunk/
cd trunk

echo -e "\nInstall composer dependencies"
echo -e "-----------------------------------------------------------------------------"

rm -rf vendor
/usr/local/bin/composer install --no-dev

# delete all files that are not needed in the final build
echo -e "\nDelete all dev files"
echo -e "-----------------------------------------------------------------------------"

find . -type f -name "*.dev.php" -delete
rm -rf ./public/editor-src
rm -rf ./bin ./tests *.dist *.xml *.lock *.json *.yml *.sh .gitignore ./vendor/twig/twig/test
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
if svn st | grep "!" > /dev/null; then  svn st | grep "!" | cut -d! -f2 | xargs svn rm; fi
if svn st | grep "?" > /dev/null; then  svn st | grep "?" | cut -d? -f2 | xargs svn add; fi

cd ../


# create the build archive
rm -f *.zip
rm -rf brizy && mkdir brizy
cp -a ./trunk/. ./brizy/
zip -r $ZIP_FILE_NAME brizy/ -x .git -x .idea -x .gitignore
rm -rf ./brizy

