const cors = require("cors");

// Development ve production için farklı CORS ayarları
const isDevelopment = process.env.NODE_ENV !== "production";

const corsOptions = {
  origin: isDevelopment
    ? [
        "http://localhost:8085",
        "http://localhost:3000",
        "http://localhost:5173",
      ]
    : [process.env.BACKEND_URL, process.env.FRONTEND_URL],
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  optionsSuccessStatus: 200,
};

const corsMiddleware = cors(corsOptions);

const corsPreflight = (req, res, next) => {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
};

module.exports = {
  corsMiddleware,
  corsPreflight,
};
