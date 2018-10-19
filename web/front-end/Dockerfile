FROM node

COPY . /front-end
WORKDIR /front-end

RUN npm install
RUN npm install -g @angular/cli

EXPOSE 80

ENTRYPOINT ["./entrypoint.sh"]
