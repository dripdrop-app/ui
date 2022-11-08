#!/bin/bash

mkdir -p build
\cp -r $HOME/build $HOME/dripdrop
cd $HOME/dripdrop
docker compose -f docker-compose.yml build --progress plain
docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml up -d