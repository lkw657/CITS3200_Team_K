#!/bin/bash

if [[ $1 == "debug" ]]; then
    npm install
    nodemon bin/www
elif [[ $1 == "test" ]]; then
    npm install
    npm install -g mocha
    mocha -R spec --exit
else
    node bin/www
fi
