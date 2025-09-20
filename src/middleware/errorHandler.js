const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Hata:`, err);

  if (err.code === "P2002") {
    return res.status(400).json({
      success: false,
      message: "Bu kayıt zaten mevcut",
      error: err.message,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Kayıt bulunamadı",
      error: err.message,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Doğrulama hatası",
      error: err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Sunucuda bir hata oluştu",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Sayfa bulunamadı",
    path: req.originalUrl,
  });
};

module.exports = {
  errorHandler,
  notFound,
};
