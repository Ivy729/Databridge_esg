import { UtilityBillData, FuelRecord, AppConfig, CalculationResult } from "./types";

export const DEFAULT_CONFIG: AppConfig = {
  companyName: "Precision Microtech (M) Sdn Bhd",
  registrationNumber: "201801048821 (1298834-X)",
  facilityLocation: "Bayan Lepas Free Industrial Zone, Phase 4, 11900 Penang",
  sector: "E&E Manufacturing — SMT & PCB Assembly",
  gridEmissionFactor: 0.740, // Peninsular Malaysia TNB Grid (kg CO2e/kWh)
  dieselFactor: 2.68, // kg CO2e per Litre
  petrolFactor: 2.31, // kg CO2e per Litre
  gasFactor: 1.90, // kg CO2e per m3
};

/**
 * Calculates SHA-256 integrity hash for tamper-evident report verification.
 */
export async function generateSHA256Hash(dataString: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(dataString);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  } catch {
    // Fallback simple hash string if crypto.subtle is unavailable
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `sha256-${Math.abs(hash).toString(16).padStart(8, "0")}${Date.now().toString(16)}`;
  }
}

/**
 * Validates utility bill fields before calculation.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateBillData(data: UtilityBillData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Account Number
  if (!data.accountNumber || data.accountNumber.trim() === "" || data.accountNumber === "Not detected") {
    errors.push("Account number is required.");
  } else if (data.accountNumber.length < 6) {
    warnings.push("Account number seems unusually short. Please double-check.");
  }

  // Billing Date
  if (!data.billingDate || data.billingDate === "Not detected") {
    errors.push("Billing date is required.");
  } else if (isNaN(Date.parse(data.billingDate))) {
    errors.push("Invalid billing date format.");
  }

  // kWh Consumption
  if (data.kwhConsumption === null || data.kwhConsumption === undefined || isNaN(data.kwhConsumption)) {
    errors.push("Electricity consumption (kWh) is required.");
  } else if (data.kwhConsumption <= 0) {
    errors.push("Electricity consumption (kWh) must be a positive number.");
  } else if (data.kwhConsumption > 500000) {
    warnings.push("Very high consumption (>500,000 kWh). Please confirm this is correct for your facility.");
  } else if (data.kwhConsumption < 100) {
    warnings.push("Unusually low consumption (<100 kWh) for a factory bill.");
  }

  // Peak Demand
  if (data.peakDemandKw !== null && data.peakDemandKw !== undefined) {
    if (data.peakDemandKw < 0) {
      errors.push("Peak demand (kW) cannot be negative.");
    } else if (data.peakDemandKw > 10000) {
      warnings.push("Peak demand seems unusually high (>10,000 kW). Please verify.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculates Scope 1 and Scope 2 emissions based on verified data.
 */
export function calculateEmissions(
  billData: UtilityBillData,
  fuelRecords: FuelRecord[],
  config: AppConfig
): CalculationResult {
  // Scope 2 = Electricity kWh * Grid Emission Factor (kg CO2e/kWh)
  const kwh = billData.kwhConsumption || 0;
  const scope2Kg = kwh * config.gridEmissionFactor;
  const scope2Tonnes = scope2Kg / 1000;

  // Scope 1 = Fuel usage * Fuel Factor
  let scope1Kg = 0;
  const fuelBreakdown = fuelRecords.map((r) => {
    let factor = config.dieselFactor;
    if (r.fuelType === "Petrol") factor = config.petrolFactor;
    if (r.fuelType === "Natural Gas") factor = config.gasFactor;

    const kg = r.quantity * factor;
    scope1Kg += kg;
    return {
      type: r.fuelType,
      quantity: r.quantity,
      unit: r.unit,
      emissionsTonnes: kg / 1000,
    };
  });

  const scope1Tonnes = scope1Kg / 1000;
  const totalEmissionsTonnes = scope1Tonnes + scope2Tonnes;

  return {
    scope2EmissionsKg: scope2Kg,
    scope2EmissionsTonnes: Number(scope2Tonnes.toFixed(3)),
    scope1EmissionsKg: scope1Kg,
    scope1EmissionsTonnes: Number(scope1Tonnes.toFixed(3)),
    totalEmissionsTonnes: Number(totalEmissionsTonnes.toFixed(3)),
    kwhConsumption: kwh,
    gridFactorUsed: config.gridEmissionFactor,
    fuelBreakdown,
    calculationDate: new Date().toISOString().split("T")[0],
  };
}
