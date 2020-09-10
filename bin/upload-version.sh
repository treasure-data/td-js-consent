#!/usr/bin/env bash

DRYRUN='--dryrun'
BUCKET='td-cdn-experiment'
REGION="--region us-east-2"
PACKAGE="cm"

while [ $# -gt 0 ]; do
  case "$1" in
    -f|--force)
      DRYRUN=""
      ;;
    --prod)
      BUCKET='td-cdn'
      REGION=''
      ;;
    *)
      printf "***************************\n"
      printf "* Error: Invalid argument.*\n"
      printf "***************************\n"
      exit 1
  esac
  shift
done
if [ "$1" == "-f" ] || [ "$1" == "--force" ]; then
  DRYRUN=''
fi

set -euo pipefail

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
VERSION=$(jq -r '.version' < "${ROOT_DIR}/package.json")

aws --profile dev-frontend                      \
  s3 sync ./dist/ "s3://${BUCKET}/${PACKAGE}/${VERSION}/" \
    ${DRYRUN}                                   \
    ${REGION}                                   \
    --acl 'public-read'                         \
    --cache-control 'public, max-age=315360000' \
