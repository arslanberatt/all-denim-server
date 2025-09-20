# Denim Backend API

Denim fiyat hesaplama sistemi backend API'si.

## 🚀 Hızlı Kurulum

### Docker ile

```bash
# 1. Projeyi klonla
git clone https://github.com/arslanberatt/all-denim-server.git
cd all-denim-server

# 2. Docker ile çalıştır
docker-compose up -d

# 3. Test et
curl http://localhost:8085/api/db-test
```

**Docker Komutları:**

```bash
docker-compose up -d    # Başlat
docker-compose down     # Durdur
docker-compose logs -f  # Logları gör
```

---

### Manuel Kurulum (Docker olmadan)

**Gereksinimler:**

- PostgreSQL 15+

```bash
npm install
```

2. **Veritabanını ayarla:**

```bash
# PostgreSQL'de veritabanı oluştur
createdb denim_db

# Prisma migration çalıştır
npx prisma migrate dev

# Örnek verileri yükle
node seed.js
```

3. **Sunucuyu başlat:**

```bash
npm start
```

---

**Base URL:** `http://localhost:8085`

## 🔧 Environment Variables

Local kullanım için `.env` dosyası oluşturun:

```env
# Database
DATABASE_URL="postgresql://berat:Berat123.@localhost:5432/denim_db"

# Server
PORT=8085
NODE_ENV=development

# CORS (isteğe bağlı)
BACKEND_URL="http://localhost:8085"
FRONTEND_URL="http://localhost:3000"
```

## 🚀 Local Kurulum

### 1. Gereksinimler

- Node.js 18+
- PostgreSQL 15+ (Docker ile)

### 2. Kurulum Adımları

```bash
# Repository'yi klonlayın
git clone https://github.com/arslanberatt/all-denim-server.git
cd all-denim-server

# Bağımlılıkları yükleyin
npm install

# .env dosyası oluşturun
touch .env
```

### 3. .env Dosyası Oluşturun

```env
DATABASE_URL="postgresql://berat:Berat123.@localhost:5432/denim_db"
PORT=8085
NODE_ENV=development
```

### 4. PostgreSQL'i Başlatın

```bash
# Docker ile PostgreSQL başlatın
docker-compose up -d postgres

# Veya manuel PostgreSQL kurulumu yapın
```

### 5. Veritabanını Hazırlayın

```bash
# Migration'ları çalıştırın
npm run db:migrate

# Seed data yükleyin (isteğe bağlı)
node seed.js
```

### 6. Uygulamayı Başlatın

```bash
# Development modunda
npm run dev

# Production modunda
npm start
```

### 7. Test Edin

- API: http://localhost:8085/api
- DB Test: http://localhost:8085/api/db-test
