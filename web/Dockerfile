FROM ubuntu

COPY . /www

RUN apt-get update && apt-get install -y gdebi wget nodejs npm

RUN wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.5/wkhtmltox_0.12.5-1.bionic_amd64.deb && \
gdebi -n wkhtmltox_0.12.5-1.bionic_amd64.deb

WORKDIR /www
RUN npm install

EXPOSE 3000
ENV PORT 3000

ENTRYPOINT ["./entrypoint.sh"]
