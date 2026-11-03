#!/bin/bash
# Writes the Google Maps API key from the build environment into brizy.php.
set -e
: "${GOOGLE_MAP_API_KEY:?GOOGLE_MAP_API_KEY is not set}"
sed -i "s/'BRIZY_GOOGLE_MAP_API_KEY',\s*'[^']*'/'BRIZY_GOOGLE_MAP_API_KEY', '$GOOGLE_MAP_API_KEY'/" brizy.php
