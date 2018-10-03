#!/bin/bash
echo "1: $1"
if [[ $1 == "debug" ]]; then
    npm install
    npm install -g @angular/cli
    echo doing debug
fi

ng serve --host=0.0.0.0 --port=80
