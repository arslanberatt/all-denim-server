const validateCompany = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Şirket adı en az 2 karakter olmalıdır",
    });
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Geçerli bir email adresi giriniz",
    });
  }
  next();
};

const validateCalculation = (req, res, next) => {
  const {
    companyId,
    packageType,
    fabricPrice,
    fabricMeter,
    cutProcess,
    sationProcess,
    washProcess,
    printProcess,
    wearProcess,
    accessoryProcess,
    buttonProcess,
  } = req.body;

  if (!companyId || !packageType) {
    return res.status(400).json({
      success: false,
      message: "Şirket ID ve paket tipi zorunludur",
    });
  }

  const numericFields = [
    { name: "fabricPrice", value: fabricPrice },
    { name: "fabricMeter", value: fabricMeter },
    { name: "cutProcess", value: cutProcess },
    { name: "sationProcess", value: sationProcess },
    { name: "washProcess", value: washProcess },
    { name: "printProcess", value: printProcess },
    { name: "wearProcess", value: wearProcess },
    { name: "accessoryProcess", value: accessoryProcess },
    { name: "buttonProcess", value: buttonProcess },
  ];

  for (const field of numericFields) {
    if (field.value !== undefined && (isNaN(field.value) || field.value < 0)) {
      return res.status(400).json({
        success: false,
        message: `${field.name} geçerli bir sayı olmalıdır`,
      });
    }
  }

  const validPackageTypes = ["PACKAGE_050", "PACKAGE_51100", "PACKAGE_101200"];
  if (!validPackageTypes.includes(packageType)) {
    return res.status(400).json({
      success: false,
      message: "Geçersiz paket tipi",
    });
  }

  next();
};

const validateSettings = (req, res, next) => {
  const {
    eurRate,
    usdRate,
    gbpRate,
    overhead05100,
    overhead101200,
    profit05100,
    profit101200,
    vatRate,
    commRate,
  } = req.body;

  if (eurRate && (isNaN(eurRate) || eurRate <= 0)) {
    return res.status(400).json({
      success: false,
      message: "EUR kuru 0'dan büyük olmalıdır",
    });
  }

  if (usdRate && (isNaN(usdRate) || usdRate <= 0)) {
    return res.status(400).json({
      success: false,
      message: "USD kuru 0'dan büyük olmalıdır",
    });
  }

  if (gbpRate && (isNaN(gbpRate) || gbpRate <= 0)) {
    return res.status(400).json({
      success: false,
      message: "GBP kuru 0'dan büyük olmalıdır",
    });
  }

  const percentageFields = [
    { name: "overhead05100", value: overhead05100 },
    { name: "overhead101200", value: overhead101200 },
    { name: "profit05100", value: profit05100 },
    { name: "profit101200", value: profit101200 },
    { name: "vatRate", value: vatRate },
    { name: "commRate", value: commRate },
  ];

  for (const field of percentageFields) {
    if (
      field.value !== undefined &&
      (isNaN(field.value) || field.value < 0 || field.value > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: `${field.name} 0-100 arasında olmalıdır`,
      });
    }
  }

  next();
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateCompany,
  validateCalculation,
  validateSettings,
};
