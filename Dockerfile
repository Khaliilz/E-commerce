FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ARG PORT=3000
ENV APP_PORT=${PORT}
EXPOSE ${port}

CMD ["npm", "start"]