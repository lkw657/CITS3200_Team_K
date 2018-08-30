#!/bin/bash

if [[ $1 == "true" ]]; then
    nodemon bin/www
else
    node bin/www
fi
