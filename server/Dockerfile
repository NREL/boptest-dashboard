FROM node:12

# app dir
WORKDIR /usr/src/app

# grab app dependencies and install them
COPY package*.json ./

RUN npm install

# bundle source app
COPY . .

EXPOSE 8080

CMD ["npm", "run", "start:dev"]