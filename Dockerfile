FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

RUN npm install --omit=dev --ignore-scripts

COPY src/ ./src/

EXPOSE 8080

CMD ["node", "src/server.js"]