const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      overhead050: 12.5,
      overhead51100: 12.5,
      overhead101200: 10,
      profit050: 30,
      profit51100: 25,
      profit101200: 15,
      taxRate: 20,
      commRate: 5,
    },
  });

  console.log("Settings oluşturuldu:", settings);

  // Örnek şirketler ekle
  const companies = [
    {
      name: "Örnek Denim Şirketi",
      email: "info@denim.com",
      address: "İstanbul, Türkiye",
      contactPerson: "Berat Arslan",
    },
    {
      name: "Modern Tekstil A.Ş.",
      email: "info@moderntekstil.com",
      address: "Bursa, Türkiye",
      contactPerson: "Ayşe Yılmaz",
    },
    {
      name: "Elite Denim Ltd.",
      email: "contact@elitedenim.com",
      address: "İzmir, Türkiye",
      contactPerson: "Mehmet Kaya",
    },
    {
      name: "Premium Jeans Co.",
      email: "info@premiumjeans.com",
      address: "Ankara, Türkiye",
      contactPerson: "Fatma Demir",
    },
    {
      name: "Blue Denim Factory",
      email: "sales@bluedenim.com",
      address: "Gaziantep, Türkiye",
      contactPerson: "Ali Özkan",
    },
  ];

  for (const companyData of companies) {
    const company = await prisma.company.create({
      data: companyData,
    });
    console.log("Şirket oluşturuldu:", company.name);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
