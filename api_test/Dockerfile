FROM node:18

WORKDIR /usr/src/app

RUN apt-get update || : && apt-get install netcat-traditional -y

COPY . .

RUN npm install
