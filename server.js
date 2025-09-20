require("dotenv").config();
const express = require("express");
const { corsMiddleware, corsPreflight } = require("./src/middleware/cors");
const { errorHandler, notFound } = require("./src/middleware/error.handler");
const companyRoutes = require("./src/routes/company.routes");
const calculationRoutes = require("./src/routes/calculation.routes");
const settingsRoutes = require("./src/routes/settings.routes");
const { getEurRate } = require("./src/services/exchangeRate.service");
const prisma = require("./src/config/database");

const app = express();

app.use(corsMiddleware);
app.use(corsPreflight);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Denim Backend API çalışıyor!",
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({
      success: true,
      message: "Veritabanı bağlantısı başarılı",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Veritabanı bağlantı hatası",
      error: error.message,
    });
  }
});

app.get("/api/exchange-rate", async (req, res) => {
  try {
    const rateData = await getEurRate();
    res.json({
      success: true,
      data: rateData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Döviz kuru alınamadı",
      error: error.message,
    });
  }
});

app.use("/api/companies", companyRoutes);
app.use("/api/calculations", calculationRoutes);
app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 8085;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Denim Backend ${PORT} portunda çalışıyor`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(`DB Test: http://localhost:${PORT}/api/db-test`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

app.use(notFound);
app.use(errorHandler);
