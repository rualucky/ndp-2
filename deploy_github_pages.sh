#!/usr/bin/env sh

# abort on errors
set -e

# build
pnpm run build

git add dist -f

git commit -m "Adding dist"

git subtree push --prefix dist origin gh-pages

# if you are deploying to https://<USERNAME>.github.io/<REPO>
#git push -f git@github.com:rualucky/ndp-2.git main:gh-pages
