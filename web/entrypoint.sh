#!/bin/bash

if [[ $1 == "true" ]]; then
    npm install
    nodemon bin/www
else
    node bin/www
fi
