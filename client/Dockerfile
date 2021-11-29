FROM node:13.12.0-alpine

WORKDIR /usr/client

COPY ./client .
COPY ./common ./common

RUN npm install
RUN npm run build
