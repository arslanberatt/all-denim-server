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

## 🚀 Kurulum

```bash
# Klonla ve kur
git clone https://github.com/arslanberatt/all-denim-server.git
cd all-denim-server
npm install

# .env dosyası oluştur
echo 'DATABASE_URL="postgresql://berat:Berat123.@localhost:5432/denim_db"
PORT=8085
NODE_ENV=development' > .env

# PostgreSQL başlat
docker-compose up -d postgres

# Migration çalıştır
npm run db:migrate

# Uygulamayı başlat
npm run dev
```

## 📡 API Endpoints

**Base URL:** `http://localhost:8085/api` (Local)  
**Production URL:** `https://all-denim-server-production.up.railway.app/api`

### Şirket Yönetimi
- `GET /companies` - Tüm şirketleri listele
- `POST /companies` - Yeni şirket ekle
- `GET /companies/:id` - Belirli şirketi getir
- `PUT /companies/:id` - Şirket güncelle
- `DELETE /companies/:id` - Şirket sil

### Hesaplama Sistemi
- `GET /calculations` - Tüm hesaplamaları listele
- `POST /calculations` - Yeni hesaplama yap
- `GET /calculations/:id` - Belirli hesaplamayı getir
- `DELETE /calculations/:id` - Hesaplama sil

### Ayarlar
- `GET /settings` - Sistem ayarlarını getir
- `PUT /settings` - Sistem ayarlarını güncelle

### Yardımcı Endpoints
- `GET /db-test` - Veritabanı bağlantı testi
- `GET /exchange-rate` - Güncel döviz kuru (EUR/TRY)

**API:** http://localhost:8085/api
