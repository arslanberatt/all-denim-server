# Dockerfile
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Uygulama dosyalarını kopyala
COPY . .

# Prisma generate
RUN npx prisma generate

# Uploads klasörünü oluştur
RUN mkdir -p uploads/exports

# Port'u expose et
EXPOSE 8085

# Prisma migration çalıştır
RUN npx prisma migrate deploy

# Uygulamayı başlat
CMD ["npm", "start"]