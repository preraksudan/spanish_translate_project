FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install
# copy prisma file to docker container (so that no issues wihile npx prisma generate)
COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 4001

CMD ["npm", "run", "dev"]
