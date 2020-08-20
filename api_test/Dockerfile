FROM node:12

WORKDIR /usr/src/app

RUN apt-get update || : && apt-get install netcat -y

COPY . .

RUN npm install
