const cors = require("cors");

const corsOptions = {
  origin: [
    "http://localhost:8085",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.BACKEND_URL,
    process.env.FRONTEND_URL,
    "https://all-denim-client.vercel.app",
    "https://all-denim-client-production.up.railway.app"
  ].filter(Boolean), // undefined değerleri filtrele
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
