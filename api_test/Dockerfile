FROM node:12

RUN apt-get update || : && apt-get install netcat -y

COPY . .

RUN npm install
