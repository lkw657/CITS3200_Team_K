FROM node

RUN npm install
RUN npm install -g nodemon

EXPOSE 80
WORKDIR /www

ENV PORT 80
ENTRYPOINT ["./entrypoint.sh"]
