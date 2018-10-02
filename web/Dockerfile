FROM node

COPY . /www
WORKDIR /www

RUN npm install

EXPOSE 3000

ENV PORT 3000
ENTRYPOINT ["./entrypoint.sh"]
