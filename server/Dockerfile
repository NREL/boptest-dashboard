FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN mkdir /usr/src/build
RUN ln -s /usr/src/app/node_modules/ /usr/src/build/

EXPOSE 8080

CMD ["npm", "run", "start:dev"]