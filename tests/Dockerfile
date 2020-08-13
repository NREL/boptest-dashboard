FROM golang:alpine

ENV GO111MODULE=auto \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# add bash to run test scripts
RUN apk add --no-cache bash

# app dir
# WORKDIR /usr/src/app

# bundle source app
COPY . .
RUN chmod -R 755 .

COPY integration_test.sh /

# EXPOSE 8080
