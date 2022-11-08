#!/bin/bash

mkdir -p build
\cp -r $HOME/build $HOME/dripdrop
docker compose build --progress plain server 
docker compose down server
docker compose up server -d