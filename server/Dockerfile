FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN npm install
# Create build dir
RUN mkdir /usr/src/build
# Symlink src to build dir for nodemon compatability 
RUN ln -s /usr/src/app/node_modules/ /usr/src/build/

EXPOSE 8080
