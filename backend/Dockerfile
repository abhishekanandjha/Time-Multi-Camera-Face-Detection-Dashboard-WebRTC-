# Use node alpine
FROM node:20-alpine

WORKDIR /app

# install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production=false

# copy source
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# generate prisma client
RUN npx prisma generate

# build typescript
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]