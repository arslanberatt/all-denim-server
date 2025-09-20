const axios = require("axios");

async function getEurRate() {
  try {
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/EUR"
    );

    return {
      eurRate: response.data.rates.TRY, 
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("Euro kuru alınamadı:", error);

    return {
      eurRate: 37.99,
      lastUpdated: new Date(),
    };
  }
}

async function convertTryToEur(tryAmount) {
  try {
    const rateData = await getEurRate();
    return tryAmount / rateData.eurRate;
  } catch (error) {
    console.error("TRY'den EUR'ya çevirme hatası:", error);
    return tryAmount / 37.99;
  }
}

module.exports = {
  getEurRate,
  convertTryToEur,
};
