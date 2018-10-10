# CITS3200\_Team\_K

## Configuration
The config should be placed in `web/.env`
```
SMTP_EMAIL=<email address to send mail from>
SMTP_PASSWORD=<password for email account>
SMPT_HOST=<smtp server>
DB_URI=<URI for a mongo database connection (of the form mongo://...)
URI=<URI the front-end server is hosted at>
IT_PASSWORD=<administration password>
```
If DB\_URI is omitted a database started from docker will be used.
It should be omited when using docker

The location of the backend server (and port) also needs to be put in `web/front-end/src/app/config.ts`. This should be the same host as the front end.

## Running

### For production
Build the server with
```
docker-compose -f docker-compose.yml build
```
run with
```
docker-compose -f docker-compose.yml up
```

### For development
If you are hosting locally `URI` in `.env` should be set to `http://127.0.0.1` or `http://localhost` depending on which you want to use
To build the server with nodemon for development use
```
docker-compose build
```
Then run with
```
docker-compose up
```

## Reinitialising the database
The database will be inidialised with default questions if it doesn't exist
To reinitialise it you can delete the docker container it's stored in
The container can be found using
```
docker container ls -a
```
And deleted with
```
docker rm <container id>
```
`init.db` can also be forced to delete the database using
```
DESTROY=true node initdb.js
```
