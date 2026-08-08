export type ConfidenceStatus = "High confidence" | "Medium confidence" | "Needs verification" | "Not detected";

export interface FieldExtraction<T = string> {
  value: T;
  rawText?: string;
  confidence: ConfidenceStatus;
  snippet?: string; // exact text snippet or label supporting why value was extracted
}

export interface UtilityBillData {
  provider: string; // e.g. "Tenaga Nasional Berhad (TNB)" | "Sarawak Energy" | "Air Selangor"
  providerConfidence: ConfidenceStatus;
  providerSnippet?: string;

  accountNumber: string; // "Not detected" or exact value
  accountNumberConfidence: ConfidenceStatus;
  accountNumberSnippet?: string;

  meterNumber: string; // "Not detected" or exact value
  meterNumberConfidence: ConfidenceStatus;
  meterNumberSnippet?: string;

  billingDate: string; // YYYY-MM-DD or raw string or "Not detected"
  rawBillingDate?: string;
  billingDateConfidence: ConfidenceStatus;
  billingDateSnippet?: string;

  billingPeriod: string; // e.g. "01 Jul 2025 - 31 Jul 2025" or "Not detected"
  billingPeriodConfidence: ConfidenceStatus;
  billingPeriodSnippet?: string;

  previousMeterReading: string; // e.g. "14200" or "Not detected"
  previousMeterReadingConfidence: ConfidenceStatus;
  previousMeterReadingSnippet?: string;

  currentMeterReading: string; // e.g. "28450" or "Not detected"
  currentMeterReadingConfidence: ConfidenceStatus;
  currentMeterReadingSnippet?: string;

  kwhConsumption: number; // numeric value
  kwhConsumptionText: string; // e.g. "14,250 kWh" or "Not detected"
  kwhConsumptionConfidence: ConfidenceStatus;
  kwhConsumptionSnippet?: string;
  consumptionDerived: boolean; // whether derived from current - previous reading or directly extracted

  peakDemandKw: number | null; // numeric value or null
  peakDemandKwText: string; // e.g. "185 kW" or "Not detected"
  peakDemandKwConfidence: ConfidenceStatus;
  peakDemandKwSnippet?: string;

  totalAmountMyr: number | null; // numeric value or null
  totalAmountMyrText: string; // e.g. "RM 6,840.00" or "Not detected"
  totalAmountMyrConfidence: ConfidenceStatus;
  totalAmountMyrSnippet?: string;

  otherUsageInfo?: string; // any other clearly labelled electricity-usage information
  otherUsageInfoSnippet?: string;

  billImageName?: string;
  billImageDataUrl?: string; // source image maintained for traceability

  uncertainFields: string[]; // list of field keys that need verification
  confidence: {
    accountNumber: "high" | "medium" | "low" | "not_detected";
    billingDate: "high" | "medium" | "low" | "not_detected";
    kwhConsumption: "high" | "medium" | "low" | "not_detected";
    peakDemandKw: "high" | "medium" | "low" | "not_detected";
  };
}

export interface FuelRecord {
  id: string;
  date: string;
  fuelType: "Diesel" | "Petrol" | "Natural Gas" | "LPG";
  quantity: number;
  unit: "Litres" | "kg" | "m3";
}

export interface AppConfig {
  companyName: string;
  registrationNumber: string;
  facilityLocation: string; // e.g. "Bayan Lepas Free Industrial Zone, Penang"
  sector: string; // "E&E Manufacturing - Semiconductor / SMT"
  gridEmissionFactor: number; // default 0.740 kg CO2e/kWh (Peninsular Malaysia)
  dieselFactor: number; // kg CO2e / Liter (default 2.68)
  petrolFactor: number; // kg CO2e / Liter (default 2.31)
  gasFactor: number; // kg CO2e / m3 (default 1.90)
}

export interface CalculationResult {
  scope2EmissionsKg: number; // kg CO2e
  scope2EmissionsTonnes: number; // tCO2e
  scope1EmissionsKg: number; // kg CO2e
  scope1EmissionsTonnes: number; // tCO2e
  totalEmissionsTonnes: number; // tCO2e
  kwhConsumption: number;
  gridFactorUsed: number;
  fuelBreakdown: { type: string; quantity: number; unit: string; emissionsTonnes: number }[];
  calculationDate: string;
}

export interface GeneratedReport {
  reportId: string; // e.g. "REP-MY-2025-8839"
  companyName: string;
  registrationNumber: string;
  facilityLocation: string;
  reportingPeriod: string;
  utilityProvider: string;
  accountNumber: string;
  meterNumber: string;
  billingDate: string;
  peakDemandKw: number | null;
  kwhConsumption: number;
  totalAmountMyr: number | null;
  gridFactorUsed: number;
  scope1Tonnes: number;
  scope2Tonnes: number;
  totalEmissionsTonnes: number;
  generatedAt: string;
  verificationStatus: "Verified by User" | "Pending Review";
  integrityHash: string; // SHA-256 hash string
  issbFramework: string; // "ISSB S1/S2 Disclosure Ready"
  fuelRecordsCount: number;
}
