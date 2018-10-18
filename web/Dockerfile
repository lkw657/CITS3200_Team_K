FROM node

COPY . /www

RUN apt update && apt install -y nodejs \
    npm \
    wkhtmltopdf

#RUN wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.5/wkhtmltox_0.12.5-1.bionic_amd64.deb && dpkg -i wkhtmltox_0.12.5-1.bionic_amd64.deb

WORKDIR /www
RUN npm install

EXPOSE 3000
ENV PORT 3000

ENTRYPOINT ["./entrypoint.sh"]
