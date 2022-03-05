#!/usr/bin/env bash

echo "::: Running NPM INSTALL"
npm install

npm run sandbox-manager:build:local

cd ..
docker build --build-arg TARGET_ENV=local -t sandbox-manager-v3/node-web-app -f ./Dockerfile .
docker run -p 3001:3000 sandbox-manager-v3/node-web-app