FROM node

COPY . /www
WORKDIR /www

RUN npm install
RUN npm install -g nodemon

EXPOSE 80

ENV PORT 80
ENTRYPOINT ["./entrypoint.sh"]
