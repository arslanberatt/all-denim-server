# Excel Hesaplama Mantığı

## Hesaplamalar

### 1. Kumaş Birim Fiyatı

```javascript
const fabricUnitPrice = fabricPrice * fabricMeter;
```

- **Kumaş Fiyatı (TL/m)** × **Kumaş Metresi** = Kumaş Birim Fiyatı
- Varsayılan: 3.16 TL/m × 1.5 m = 4.74 TL

### 2. İşçilik Maliyeti

```javascript
const laborCost =
  cutProcess +
  sationProcess +
  washProcess +
  printProcess +
  wearProcess +
  accessoryProcess +
  buttonProcess;
```

- **Kesim** + **Dikiş** + **Yıkama** + **Baskı** + **Giyim** + **Aksesuar** + **Düğme** = İşçilik Maliyeti

### 3. İşçilik Maliyeti (EUR)

```javascript
const laborCostInEUR = await convertTryToEur(laborCost);
```

- İşçilik maliyeti güncel EUR kuru ile EUR'ya çevrilir

### 4. Malzeme Maliyeti

```javascript
const materialCost = fabricUnitPrice + laborCostInEUR;
```

- **Kumaş Birim Fiyatı** + **İşçilik Maliyeti (EUR)** = Malzeme Maliyeti

### 5. Genel Gider

```javascript
const overheadRate = getOverheadRate(packageType, settings);
const overheadCost = materialCost * (overheadRate / 100);
```

- **0-50 Adet**: %12.5
- **51-100 Adet**: %12.5
- **101-200 Adet**: %10

### 6. Kar Marjı

```javascript
const profitRate = getProfitRate(packageType, settings);
const profitMargin = (materialCost + overheadCost) * (profitRate / 100);
```

- **0-50 Adet**: %30
- **51-100 Adet**: %25
- **101-200 Adet**: %15

### 7. Ara Toplam

```javascript
const subtotal = materialCost + overheadCost + profitMargin;
```

- **Malzeme Maliyeti** + **Genel Gider** + **Kar Marjı** = Ara Toplam

### 8. Komisyon

```javascript
const commission = subtotal * (settings.commRate / 100);
```

- **Ara Toplam** × **Komisyon Oranı** (%5) = Komisyon

### 9. KDV

```javascript
const tax = (subtotal + commission) * (settings.taxRate / 100);
```

- **(Ara Toplam + Komisyon)** × **KDV Oranı** (%20) = KDV

### 10. Toplam Fiyat

```javascript
const totalPrice = subtotal + commission + tax;
```

- **Ara Toplam** + **Komisyon** + **KDV** = Toplam Fiyat

## Varsayılan Değerler

- **Kumaş Birim fiyatı**: 4.74 m
- **Komisyon Oranı**: %5
- **KDV Oranı**: %20
- **Döviz Kuru**: Apiden çekiliyor

## Hesaplama Gdiş Yönü

```
Kumaş Fiyatı × Kumaş Metresi
           ↓
    Kumaş Birim Fiyatı
           ↓
    İşçilik Maliyeti (TL)
           ↓
    İşçilik Maliyeti (EUR)
           ↓
    Malzeme Maliyeti
           ↓
    Genel Gider (%12.5/12.5/10)
           ↓
    Kar Marjı (%30/25/15)
           ↓
    Ara Toplam
           ↓
    Komisyon (%5)
           ↓
    KDV (%20)
           ↓
    Toplam Fiyat
```
