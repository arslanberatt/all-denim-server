# Railway Deployment Rehberi

Bu dosya Railway'de API'yi canlıya alma işlemleri için hazırlanmıştır.

## 🚀 Railway'de Deploy Etme

### 1. Proje Oluşturma
1. [railway.app](https://railway.app) adresine gidin
2. GitHub hesabınızla giriş yapın
3. **"New Project"** → **"Deploy from GitHub repo"**
4. `arslanberatt/all-denim-server` repository'sini seçin
5. **"Deploy Now"** butonuna tıklayın

### 2. PostgreSQL Servisi Ekleme
1. Proje dashboard'unda **"New Service"** butonuna tıklayın
2. **"Database"** → **"PostgreSQL"** seçin
3. Servis otomatik olarak oluşturulacak

### 3. Environment Variables Ayarlama
Backend servisinizde **"Variables"** sekmesine gidin ve şunları ekleyin:

```
DATABASE_URL = postgresql://postgres:password@host:port/database
NODE_ENV = production
```

**DATABASE_URL'yi nereden alacaksınız:**
1. PostgreSQL servisinizi seçin
2. **"Variables"** sekmesine gidin
3. `DATABASE_URL` değerini kopyalayın
4. Backend servisinize yapıştırın

### 4. Build Ayarları
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 5. Deploy
Railway otomatik olarak deploy edecek ve Prisma migration'ları çalışacak.

## ✅ Kontrol Listesi

- [ ] Backend servisi oluşturuldu
- [ ] PostgreSQL servisi eklendi
- [ ] DATABASE_URL environment variable eklendi
- [ ] NODE_ENV=production eklendi
- [ ] Build başarılı
- [ ] API çalışıyor

## 🔗 API URL

Deploy edildikten sonra API'niz şu adreste çalışacak:
`https://your-project-name.up.railway.app/api`

## 🛠️ Sorun Giderme

### "Post-deploy not started" Hatası
- Environment variables'ları kontrol edin
- Build logs'larını inceleyin
- DATABASE_URL doğru mu kontrol edin

### Veritabanı Bağlantı Hatası
- PostgreSQL servisinin çalıştığını kontrol edin
- DATABASE_URL'nin doğru kopyalandığını kontrol edin

### CORS Hatası
- Frontend domain'inizi CORS ayarlarına ekleyin
- Environment variables'da FRONTEND_URL ekleyin
