FROM node:13.12.0-alpine

WORKDIR /usr/client

ENV PATH /client/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "watch"]