#!/bin/bash

if [[ $1 == "debug" ]]; then
    npm install
    nodemon bin/www
elif [[ $1 == "test" ]]; then
    # wait until web server has started before running tests
    attempts=0;
    while [[ $(curl -o /dev/null -s -w "%{http_code}" http://web) != "200" ]]; do
        if [[ attempts -gt 20 ]]; then
            echo "server did not respond with 200 OK after 20 attempts"
            exit 1
        fi
        sleep 1
        ((attempts += 1))
    done
    mocha -R spec --exit
else
    node initdb.js
    node bin/www
fi
