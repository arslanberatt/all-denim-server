const { PACKAGE_TYPES } = require("./constants");
const {
  convertTryToEur,
  getEurRate,
} = require("../services/exchangeRateService");

const getOverheadRate = (packageType, settings) => {
  switch (packageType) {
    case PACKAGE_TYPES.PACKAGE_050:
      return settings.overhead050;
    case PACKAGE_TYPES.PACKAGE_51100:
      return settings.overhead51100;
    case PACKAGE_TYPES.PACKAGE_101200:
      return settings.overhead101200;
    default:
      return 0;
  }
};

const getProfitRate = (packageType, settings) => {
  switch (packageType) {
    case PACKAGE_TYPES.PACKAGE_050:
      return settings.profit050;
    case PACKAGE_TYPES.PACKAGE_51100:
      return settings.profit51100;
    case PACKAGE_TYPES.PACKAGE_101200:
      return settings.profit101200;
    default:
      return 0;
  }
};

const calculatePricing = async (inputData, settings) => {
  const {
    fabricPrice, //default 3.16
    fabricMeter, //default 1.5
    cutProcess,
    sationProcess,
    washProcess,
    printProcess,
    wearProcess,
    accessoryProcess,
    buttonProcess,
    packageType,
  } = inputData;

  // Burada Normal kumaş birim fiyatı hesaplanıyor default olarak geliyor zaten
  const fabricUnitPrice = fabricPrice * fabricMeter;

  //Burada işçilik maliyeti hesaplanıyor
  const laborCost =
    cutProcess +
    sationProcess +
    washProcess +
    printProcess +
    wearProcess +
    accessoryProcess +
    buttonProcess;

  // Güncel Euro kurunu al ve TRY'yi EUR'ya çevir
  const rateData = await getEurRate();
  const laborCostInEUR = await convertTryToEur(laborCost);

  // Malzeme maliyeti İşçilik maliyeti ile kumaş birim fiyatının toplamı
  const materialCost = fabricUnitPrice + laborCostInEUR;

  // Genel gider paket enum'ına göre yüzdeliği alınıyor ve
  // Ham Maliyet, genel gider oranı(12,5%, 12,5%, 10%,) ile çarpılıyor
  const overheadRate = getOverheadRate(packageType, settings);
  const overheadCost = materialCost * (overheadRate / 100);

  // Kar marjı paket enum'ına göre yüzdeliği alınıyor ve
  // (Ham Maliyet + Genel Gider) kar oranı(30%, 25%, 15%) ile çarpılıyor
  const profitRate = getProfitRate(packageType, settings);
  const profitMargin = (materialCost + overheadCost) * (profitRate / 100);

  // Burada Ara toplam Ham Maliyet + Genel Gider + Kar Marjı şeklinde hesaplanıyor
  const subtotal = materialCost + overheadCost + profitMargin;

  // Komisyon ise Ara toplam üzerinden hesaplanıyor
  // Komisyon oranı ise default olarak 5% geliyor
  const commission = subtotal * (settings.commRate / 100);

  // KDV ise Ara toplam + Komisyon * 30% dan (default) üzerinden hesaplanıyor
  const tax = (subtotal + commission) * (settings.taxRate / 100);

  // Burada Toplam fiyat Ara toplam + Komisyon + KDV şeklinde hesaplanıyor
  const totalPrice = subtotal + commission + tax;

  return {
    fabricUnitPrice,
    laborCost,
    laborCostInEUR,
    materialCost,
    overheadCost,
    profitMargin,
    subtotal,
    commission,
    tax,
    totalPrice,
    eurRate: rateData.eurRate,
    eurRateUpdated: rateData.lastUpdated,
  };
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount, currency = "TRY") => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

module.exports = {
  getOverheadRate,
  getProfitRate,
  calculatePricing,
  formatDate,
  formatCurrency,
};
