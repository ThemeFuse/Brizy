#!/usr/bin/env bash
timestamp=$(date +%s)
sed -i "s/'BRIZY_RECOMPILE_TAG',.[^)]*/'BRIZY_RECOMPILE_TAG', $timestamp /" "brizy.php"



