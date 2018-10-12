# CITS3200\_Team\_K

## Configuration
The config should be placed in web/.env
```
SMTP_EMAIL=<email address to send mail from>
SMTP_PASSWORD=<password for email account>
SMPT_HOST=<smtp server>
DB_URI=<URI for a mongo database connection (of the form mongo://...)
```
If DB\_URI is omitted a database started from docker will be used



## Running
To start the server use
```
docker-compose -f docker-compose.yml up --build
```

To start the server with nodemon for development use
```
docker-compose up --build
```
