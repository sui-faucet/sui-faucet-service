FROM node:20-alpine as builder

WORKDIR /app

COPY package.json ./
RUN npm install
COPY . .
RUN CI=false npm run build

RUN npm ci --only=production && npm cache clean --force

FROM node:20-alpine as runner

WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN npm install -g pm2

EXPOSE 8080

CMD ["pm2-runtime", "npm", "--", "run", "start:prod"]