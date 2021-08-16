#!/usr/bin/env bash

sed -i "/== Changelog ==/r $1" readme.txt
sed -i "/## Changelog/r $2" README.md



