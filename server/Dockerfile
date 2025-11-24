FROM node:25-slim

WORKDIR /app

ENV MONGODB=/

RUN npm install react 

COPY package*.json .
RUN npm install -r package.json

COPY . .

ENTRYPOINT ["node","src/app.js"]