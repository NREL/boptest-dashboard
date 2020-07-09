FROM node:13.12.0-alpine

WORKDIR /client

ENV PATH /client/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install react-scripts
RUN npm install

COPY . .

CMD ["react-scripts", "start"]