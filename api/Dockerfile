FROM node:12.16.1-slim

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

ENV PORT=4000

RUN yarn install

COPY . .

EXPOSE 4000
CMD [ "yarn", "start" ]