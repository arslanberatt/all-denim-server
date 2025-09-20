const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:8085"],
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
