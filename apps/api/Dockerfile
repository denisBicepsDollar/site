FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install --omit=dev --fetch-retries=5 --fetch-retry-mintimeout=20000

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
