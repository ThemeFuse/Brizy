#!/usr/bin/env bash
cp -R . ../../brizy
cd ../../brizy
rm -rf vendor
composer install --no-dev
rm -rf .* *.dev.php ./bin ./tests phpunit.xml.dist phpcs.ruleset.xml export.sh composer.lock composer.json .travis.yml .gitignore
cd ../
zip -r brizy.zip ./brizy
rm -rf ./brizy