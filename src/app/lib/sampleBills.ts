import { UtilityBillData } from "./types";

export interface SampleBillOption {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  data: UtilityBillData;
}

export const SAMPLE_BILLS: SampleBillOption[] = [
  {
    id: "tnb-penang-smt",
    title: "TNB Bill — Penang SMT Plant",
    subtitle: "Medium E&E Factory · Bayan Lepas FIZ",
    location: "Penang, Malaysia",
    data: {
      provider: "Tenaga Nasional Berhad (TNB)",
      providerConfidence: "High confidence",
      providerSnippet: "TENAGA NASIONAL BERHAD (230802-X)",

      accountNumber: "2204 8839 1022",
      accountNumberConfidence: "High confidence",
      accountNumberSnippet: "No. Akaun: 2204 8839 1022",

      meterNumber: "M-7739102",
      meterNumberConfidence: "High confidence",
      meterNumberSnippet: "No. Meter: M-7739102",

      billingDate: "2025-07-15",
      rawBillingDate: "15/07/2025",
      billingDateConfidence: "High confidence",
      billingDateSnippet: "Tarikh Bil: 15/07/2025",

      billingPeriod: "01 Jun 2025 – 30 Jun 2025",
      billingPeriodConfidence: "High confidence",
      billingPeriodSnippet: "Tempoh Bil: 01/06/2025 - 30/06/2025",

      previousMeterReading: "182,500",
      previousMeterReadingConfidence: "High confidence",
      previousMeterReadingSnippet: "Bacaan Dahulu: 182,500",

      currentMeterReading: "196,750",
      currentMeterReadingConfidence: "High confidence",
      currentMeterReadingSnippet: "Bacaan Semasa: 196,750",

      kwhConsumption: 14250,
      kwhConsumptionText: "14,250 kWh",
      kwhConsumptionConfidence: "High confidence",
      kwhConsumptionSnippet: "Jumlah Kegunaan (kWh): 14,250",
      consumptionDerived: false,

      peakDemandKw: 185,
      peakDemandKwText: "185 kW",
      peakDemandKwConfidence: "High confidence",
      peakDemandKwSnippet: "Kehendak Maksimum (kW): 185",

      totalAmountMyr: 6840.0,
      totalAmountMyrText: "RM 6,840.00",
      totalAmountMyrConfidence: "High confidence",
      totalAmountMyrSnippet: "Jumlah Perlu Dibayar: RM 6,840.00",

      otherUsageInfo: "Tarif C1 - Perdagangan Voltan Sederhana",
      otherUsageInfoSnippet: "Tarif: C1 Perdagangan",

      confidence: {
        accountNumber: "high",
        billingDate: "high",
        kwhConsumption: "high",
        peakDemandKw: "high",
      },
      uncertainFields: [],
    },
  },
  {
    id: "tnb-kulim-pcb",
    title: "TNB Bill — Kulim Semiconductor Assembly",
    subtitle: "High-Volume Packaging · Kulim Hi-Tech",
    location: "Kedah, Malaysia",
    data: {
      provider: "Tenaga Nasional Berhad (TNB)",
      providerConfidence: "High confidence",
      providerSnippet: "TENAGA NASIONAL BERHAD",

      accountNumber: "2109 4482 9011",
      accountNumberConfidence: "High confidence",
      accountNumberSnippet: "No. Akaun: 2109 4482 9011",

      meterNumber: "M-9918234",
      meterNumberConfidence: "High confidence",
      meterNumberSnippet: "No. Meter: M-9918234",

      billingDate: "2025-07-18",
      rawBillingDate: "18/07/2025",
      billingDateConfidence: "High confidence",
      billingDateSnippet: "Tarikh Bil: 18/07/2025",

      billingPeriod: "01 Jun 2025 – 30 Jun 2025",
      billingPeriodConfidence: "High confidence",
      billingPeriodSnippet: "Tempoh Bil: 01/06/2025 - 30/06/2025",

      previousMeterReading: "420,100",
      previousMeterReadingConfidence: "High confidence",
      previousMeterReadingSnippet: "Bacaan Dahulu: 420,100",

      currentMeterReading: "459,000",
      currentMeterReadingConfidence: "High confidence",
      currentMeterReadingSnippet: "Bacaan Semasa: 459,000",

      kwhConsumption: 38900,
      kwhConsumptionText: "38,900 kWh",
      kwhConsumptionConfidence: "High confidence",
      kwhConsumptionSnippet: "Jumlah Kegunaan (kWh): 38,900",
      consumptionDerived: false,

      peakDemandKw: 420,
      peakDemandKwText: "420 kW",
      peakDemandKwConfidence: "Needs verification",
      peakDemandKwSnippet: "Kehendak Maksimum: 420? kW (cetakan agak pudar)",

      totalAmountMyr: 18672.0,
      totalAmountMyrText: "RM 18,672.00",
      totalAmountMyrConfidence: "High confidence",
      totalAmountMyrSnippet: "Jumlah Perlu Dibayar: RM 18,672.00",

      otherUsageInfo: "Tarif E1 - Perindustrian Voltan Sederhana",
      otherUsageInfoSnippet: "Tarif: E1 Perindustrian",

      confidence: {
        accountNumber: "high",
        billingDate: "high",
        kwhConsumption: "high",
        peakDemandKw: "medium",
      },
      uncertainFields: ["peakDemandKw"],
    },
  },
  {
    id: "sarawak-kuching-electronics",
    title: "Sarawak Energy — Kuching Electronics",
    subtitle: "Component Testing Facility · Sama Jaya",
    location: "Sarawak, Malaysia",
    data: {
      provider: "Sarawak Energy",
      providerConfidence: "High confidence",
      providerSnippet: "SARAWAK ENERGY BERHAD",

      accountNumber: "5011 2938 4811",
      accountNumberConfidence: "High confidence",
      accountNumberSnippet: "Account No: 5011 2938 4811",

      meterNumber: "SE-338291",
      meterNumberConfidence: "High confidence",
      meterNumberSnippet: "Meter No: SE-338291",

      billingDate: "2025-07-10",
      rawBillingDate: "10/07/2025",
      billingDateConfidence: "High confidence",
      billingDateSnippet: "Bill Date: 10/07/2025",

      billingPeriod: "01 Jun 2025 – 30 Jun 2025",
      billingPeriodConfidence: "High confidence",
      billingPeriodSnippet: "Billing Period: 01/06/2025 - 30/06/2025",

      previousMeterReading: "110,000",
      previousMeterReadingConfidence: "High confidence",
      previousMeterReadingSnippet: "Prev Reading: 110,000",

      currentMeterReading: "132,100",
      currentMeterReadingConfidence: "High confidence",
      currentMeterReadingSnippet: "Curr Reading: 132,100",

      kwhConsumption: 22100,
      kwhConsumptionText: "22,100 kWh",
      kwhConsumptionConfidence: "High confidence",
      kwhConsumptionSnippet: "Total Usage (kWh): 22,100",
      consumptionDerived: false,

      peakDemandKw: 240,
      peakDemandKwText: "240 kW",
      peakDemandKwConfidence: "High confidence",
      peakDemandKwSnippet: "Peak Demand (kW): 240",

      totalAmountMyr: 9503.0,
      totalAmountMyrText: "RM 9,503.00",
      totalAmountMyrConfidence: "High confidence",
      totalAmountMyrSnippet: "Total Payable: RM 9,503.00",

      otherUsageInfo: "Commercial Industrial Schedule I1",
      otherUsageInfoSnippet: "Tariff: I1 Commercial",

      confidence: {
        accountNumber: "high",
        billingDate: "high",
        kwhConsumption: "high",
        peakDemandKw: "high",
      },
      uncertainFields: [],
    },
  },
];
