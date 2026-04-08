FROM node:24.13.1-alpine

WORKDIR /app

# Instalar dependências para o Prisma e build no Alpine
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Gerar o cliente e iniciar o servidor
CMD npx prisma generate && npm run dev
