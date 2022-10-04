FROM node:12.22.1-alpine

RUN apk add --no-cache python3 g++ make

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "dev"]

EXPOSE 3000
