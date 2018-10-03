FROM node

COPY . /front-end
WORKDIR /front-end

RUN npm install
RUN npm install -g @angular/cli

EXPOSE 80

ENTRYPOINT ["ng", "serve", "--host=0.0.0.0", "--port=80"]
