#!/usr/bin/env bash

sed -i "s/Version:\s.\{1,\}\..\{1,\}\..\{1,\}/Version $1/" brizy.php
sed -i "s/^Stable tag:\s.\{1,\}\..\{1,\}\..\{1,\}/Stable tag: $1/" readme.txt
sed -i "s/^Stable tag:\s.\{1,\}\..\{1,\}\..\{1,\}/Stable tag: $1/" README.md
sed -i "s/'BRIZY_VERSION',\s'.\{1,\}\..\{1,\}\..\{1,\}'/'BRIZY_VERSION', '$1'/" brizy.php