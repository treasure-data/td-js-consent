#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
VERSION=$(cat $ROOT_DIR/package.json | jq -r '.version')
TO_VERSION=$(echo $VERSION | sed 's/\.[-a-zA-Z0-9]*$//g')

URL="https://cdn.treasuredata.com/cm/${TO_VERSION}/td-cm.min.js"

$ROOT_DIR/node_modules/.bin/rollup --config

sed -i.backup "s#https\:\/\/cdn\.treasuredata\.com\/cm.*js#${URL}#g" $ROOT_DIR/README.md && rm $ROOT_DIR/README.md.backup

