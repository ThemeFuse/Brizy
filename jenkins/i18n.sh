#!/usr/bin/env bash

curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

php wp-cli.phar i18n make-pot . languages/brizy.pot --skip-js --allow-root
rm -rf languages/*~
rm -rf wp-cli.phar;