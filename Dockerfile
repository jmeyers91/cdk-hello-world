FROM node:10.16.0-alpine

WORKDIR /app
COPY . .

RUN npm ci --only=production

EXPOSE 3000

CMD ["node", "./lib/app.js"]
