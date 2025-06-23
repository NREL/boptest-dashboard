FROM node:13.12.0-alpine

WORKDIR /usr/client

COPY ./client .
COPY ./common ./common

RUN npm install
ENV DISABLE_ESLINT_PLUGIN=true
RUN npm run build
