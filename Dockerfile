# Dockerfile
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm ci --only=production

# Uygulama dosyalarını kopyala
COPY . .

# Prisma generate
RUN npx prisma generate

# Uploads klasörünü oluştur
RUN mkdir -p uploads/exports

# Port'u expose et
EXPOSE 8085

# Uygulamayı başlat
CMD ["npm", "start"]