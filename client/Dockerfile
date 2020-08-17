FROM node:13.12.0-alpine

WORKDIR /usr/client

COPY . .

RUN npm install

CMD ["npm", "run", "watch"]