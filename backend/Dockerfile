FROM node:20-slim

# Install OpenSSL 1.1 which is required by Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 8001

CMD ["npm", "run", "dev"]
