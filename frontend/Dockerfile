FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3100

CMD ["node", "server.js"]

LABEL name="frontend"
