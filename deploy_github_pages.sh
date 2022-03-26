#!/usr/bin/env sh

# abort on errors
set -e

# build
 pnpm run build

# navigate into the build output directory
cd dist 

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:rualucky/ndp-2.git main:gh-pages

cd -