#!/bin/bash
if [[ $1 == "debug" ]]; then
    echo "Installing dependancies"
    npm install
    echo "Installing angular CLI"
    npm install -g @angular/cli
fi

ng serve --host=0.0.0.0 --port=80
