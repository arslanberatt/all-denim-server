-- CreateEnum
CREATE TYPE "public"."PackageType" AS ENUM ('PACKAGE_050', 'PACKAGE_51100', 'PACKAGE_101200');

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "contactPerson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Calculation" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "packageType" "public"."PackageType" NOT NULL,
    "fabricPrice" DOUBLE PRECISION NOT NULL DEFAULT 3.16,
    "fabricMeter" DOUBLE PRECISION NOT NULL DEFAULT 1.5,
    "fabricUnitPrice" DOUBLE PRECISION NOT NULL,
    "cutProcess" DOUBLE PRECISION NOT NULL,
    "sationProcess" DOUBLE PRECISION NOT NULL,
    "washProcess" DOUBLE PRECISION NOT NULL,
    "printProcess" DOUBLE PRECISION NOT NULL,
    "wearProcess" DOUBLE PRECISION NOT NULL,
    "accessoryProcess" DOUBLE PRECISION NOT NULL,
    "buttonProcess" DOUBLE PRECISION NOT NULL,
    "laborCost" DOUBLE PRECISION NOT NULL,
    "materialCost" DOUBLE PRECISION NOT NULL,
    "overheadCost" DOUBLE PRECISION NOT NULL,
    "profitMargin" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Calculation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Settings" (
    "id" SERIAL NOT NULL,
    "overhead050" DOUBLE PRECISION NOT NULL DEFAULT 12.5,
    "overhead51100" DOUBLE PRECISION NOT NULL DEFAULT 12.5,
    "overhead101200" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "profit050" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "profit51100" DOUBLE PRECISION NOT NULL DEFAULT 25,
    "profit101200" DOUBLE PRECISION NOT NULL DEFAULT 15,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "commRate" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Calculation" ADD CONSTRAINT "Calculation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
