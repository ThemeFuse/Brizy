#!/usr/bin/env bash

sed -i "s/Version:\s.*$/Version: $1/" "brizy.php"
sed -i "s/^Stable tag:\s.*$/Stable tag: $1/" "readme.txt"
sed -i "s/^Stable tag:\s.[^<]*/Stable tag: $1/" "README.md"
sed -i "s/'BRIZY_VERSION',\s*'.[^']*'/'BRIZY_VERSION', '$1'/" "brizy.php"
sed -i "s/'BRIZY_MINIMUM_PRO_VERSION',\s*'.[^']*'/'BRIZY_MINIMUM_PRO_VERSION', '$2'/" "brizy.php"
sed -i "s/'BRIZY_EDITOR_VERSION',.[^)]+'/'BRIZY_EDITOR_VERSION', BRIZY_DEVELOPMENT ? 'dev' : '$3' /" "brizy.php"
sed -i "s/'BRIZY_SYNC_VERSION',\s'.[^']*'/'BRIZY_SYNC_VERSION', '$4'/" "brizy.php"
sed -i "s/'BRIZY_DEVELOPMENT',.[^\)]*/'BRIZY_DEVELOPMENT', false /" "brizy.php"
sed -i "s/'BRIZY_LOG',\s.[^\)]*/'BRIZY_LOG', false /" "brizy.php"



