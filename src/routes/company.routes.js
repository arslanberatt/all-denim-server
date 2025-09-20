// src/routes/companyRoutes.js
const express = require("express");
const CompanyController = require("../controllers/company.controller");
const { validateCompany } = require("../middleware/validation");

const router = express.Router();

// Şirket oluştur
router.post("/", validateCompany, CompanyController.createCompanyController);

// Tüm şirketleri getir
router.get("/", CompanyController.getAllCompaniesController);

// Tek şirket getir
router.get("/:id", CompanyController.getCompanyByIdController);

module.exports = router;