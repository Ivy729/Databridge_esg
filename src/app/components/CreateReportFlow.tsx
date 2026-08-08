import React, { useState, useRef } from "react";
import {
  Camera, Upload, AlertTriangle, CheckCircle2, FileText, ArrowRight,
  RefreshCw, Download, Share2, Sparkles, Shield, ChevronRight, Plus, Fuel, Info, Eye, X, ZoomIn
} from "lucide-react";
import { toast } from "sonner";
import { UtilityBillData, FuelRecord, AppConfig, GeneratedReport } from "../lib/types";
import { SAMPLE_BILLS, SampleBillOption } from "../lib/sampleBills";
import { performAIOCR } from "../lib/ocr";
import { validateBillData, calculateEmissions, generateSHA256Hash } from "../lib/emissions";
import { downloadPDFReport } from "../lib/pdf";

interface CreateReportFlowProps {
  config: AppConfig;
  onReportCreated: (report: GeneratedReport) => void;
  onCancel: () => void;
}

type Step = "capture" | "scanning" | "verify" | "fuel" | "summary" | "completed";

export default function CreateReportFlow({
  config,
  onReportCreated,
  onCancel,
}: CreateReportFlowProps) {
  const [step, setStep] = useState<Step>("capture");
  const [scanStatusText, setScanStatusText] = useState("Scanning your electricity bill…");
  
  // Bill state
  const [billData, setBillData] = useState<UtilityBillData | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Fuel records state (Scope 1)
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [showFuelForm, setShowFuelForm] = useState(false);
  const [newFuelType, setNewFuelType] = useState<"Diesel" | "Petrol" | "Natural Gas">("Diesel");
  const [newFuelQty, setNewFuelQty] = useState<string>("500");

  // Report state
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);

  // File input refs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // 1. Process Uploaded Image / Photo
  const handleProcessImage = async (file: File) => {
    // Show image preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target?.result as string);
    reader.readAsDataURL(file);

    setStep("scanning");
    try {
      const extracted = await performAIOCR(file, (msg) => setScanStatusText(msg));
      setBillData(extracted);
      setStep("verify");
      toast.success("Bill information extracted via AI Vision!");
    } catch (err) {
      toast.error("Failed to scan image. Please try again or select a sample bill.");
      setStep("capture");
    }
  };

  // 2. Select Pre-packaged Sample Bill
  const handleSelectSample = async (sample: SampleBillOption) => {
    setPreviewImage(null);
    setStep("scanning");
    const extracted = await performAIOCR("sample-bill", (msg) => setScanStatusText(msg));
    setBillData({ ...sample.data });
    setStep("verify");
    toast.success(`Loaded ${sample.title}`);
  };

  // 3. Confirm Verified Bill Data
  const handleConfirmVerification = async () => {
    if (!billData) return;

    if (!billData.kwhConsumption || billData.kwhConsumption <= 0) {
      toast.error("Electricity Consumption (kWh) is required and must be greater than 0.");
      return;
    }

    const validation = validateBillData(billData);
    if (!validation.isValid) {
      toast.error(validation.errors[0] || "Please fix validation errors before continuing.");
      return;
    }

    if (validation.warnings.length > 0) {
      toast.warning(validation.warnings[0]);
    }

    // Proceed to summary & emission calculation
    const calc = calculateEmissions(billData, fuelRecords, config);

    // Build unique data string for SHA-256 tamper-evident hash
    const rawDataStr = `${config.companyName}|${billData.provider}|${billData.accountNumber}|${billData.billingDate}|${billData.kwhConsumption}|${calc.totalEmissionsTonnes}|${Date.now()}`;
    const hash = await generateSHA256Hash(rawDataStr);

    const report: GeneratedReport = {
      reportId: `REP-MY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      companyName: config.companyName,
      registrationNumber: config.registrationNumber,
      facilityLocation: config.facilityLocation,
      reportingPeriod: billData.billingPeriod || "Monthly Electricity Report",
      utilityProvider: billData.provider,
      accountNumber: billData.accountNumber,
      meterNumber: billData.meterNumber,
      billingDate: billData.billingDate,
      peakDemandKw: billData.peakDemandKw,
      kwhConsumption: billData.kwhConsumption,
      totalAmountMyr: billData.totalAmountMyr,
      gridFactorUsed: config.gridEmissionFactor,
      scope1Tonnes: calc.scope1EmissionsTonnes,
      scope2Tonnes: calc.scope2EmissionsTonnes,
      totalEmissionsTonnes: calc.totalEmissionsTonnes,
      generatedAt: new Date().toISOString().split("T")[0],
      verificationStatus: "Verified by User",
      integrityHash: hash,
      issbFramework: "ISSB S1/S2 & GRI 302/305 Disclosure Ready",
      fuelRecordsCount: fuelRecords.length,
    };

    setGeneratedReport(report);
    setStep("summary");
  };

  // 4. Finalize & Generate PDF Report
  const handleGenerateFinalPDF = () => {
    if (!generatedReport) return;
    onReportCreated(generatedReport);
    setStep("completed");
    downloadPDFReport(generatedReport);
    toast.success("PDF Carbon Report downloaded!");
  };

  // Add fuel record manually
  const handleAddFuel = () => {
    const qty = parseFloat(newFuelQty);
    if (isNaN(qty) || qty <= 0) {
      toast.error("Please enter a valid fuel quantity.");
      return;
    }
    const newRecord: FuelRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      fuelType: newFuelType,
      quantity: qty,
      unit: "Litres",
    };
    setFuelRecords([...fuelRecords, newRecord]);
    setNewFuelQty("");
    setShowFuelForm(false);
    toast.success("Fuel consumption record added!");
  };

  // CSV Upload for Fuel Records
  const handleFuelCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      const parsed: FuelRecord[] = [];
      lines.slice(1).forEach((line, idx) => {
        const parts = line.split(",");
        if (parts.length >= 3) {
          const qty = parseFloat(parts[2]);
          if (!isNaN(qty)) {
            parsed.push({
              id: `csv-${idx}`,
              date: parts[0]?.trim() || new Date().toISOString().split("T")[0],
              fuelType: (parts[1]?.trim() as any) || "Diesel",
              quantity: qty,
              unit: "Litres",
            });
          }
        }
      });

      if (parsed.length > 0) {
        setFuelRecords([...fuelRecords, ...parsed]);
        toast.success(`Imported ${parsed.length} fuel records from CSV!`);
      } else {
        toast.error("Could not parse fuel records. Ensure CSV format: Date,FuelType,Quantity");
      }
    };
    reader.readAsText(file);
  };

  const renderConfidenceBadge = (confidence?: string) => {
    if (confidence === "High confidence" || confidence === "high") {
      return (
        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          <CheckCircle2 size={10} /> High Confidence
        </span>
      );
    } else if (confidence === "Needs verification" || confidence === "medium" || confidence === "low") {
      return (
        <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          <AlertTriangle size={10} /> Needs Verification
        </span>
      );
    } else if (confidence === "Not detected") {
      return (
        <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full font-bold">
          Not Detected
        </span>
      );
    }
    return (
      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
        <CheckCircle2 size={10} /> High Confidence
      </span>
    );
  };

  const activeImage = previewImage || billData?.billImageDataUrl;

  return (
    <div className="p-4 space-y-4 min-h-full flex flex-col justify-between">
      {/* Hidden Inputs for Camera and File Uploads */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleProcessImage(file);
        }}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleProcessImage(file);
        }}
      />
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFuelCSVUpload}
      />

      {/* Bill Image Full Zoom Modal */}
      {isZoomModalOpen && activeImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 flex flex-col justify-between animate-in fade-in">
          <div className="flex items-center justify-between text-white border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-emerald-400" />
              <span className="text-xs font-bold truncate max-w-[200px]">
                {billData?.billImageName || "Original Scanned Electricity Bill"}
              </span>
            </div>
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 my-auto overflow-auto flex items-center justify-center p-2">
            <img
              src={activeImage}
              alt="Original Electricity Bill"
              className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain border border-slate-700 shadow-2xl"
            />
          </div>

          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="w-full py-3 bg-slate-800 text-white rounded-xl text-xs font-bold"
          >
            Close Full Image Preview
          </button>
        </div>
      )}

      {/* STEP 1: CAPTURE / UPLOAD BILL */}
      {step === "capture" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                Step 1 of 4
              </span>
              <h2 className="text-xl font-black text-white">Scan Electricity Bill</h2>
            </div>
            <button onClick={onCancel} className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg">
              Cancel
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Snap a clear photo or upload your monthly electricity bill (TNB / Sarawak Energy / Air Selangor). Our AI vision reads the details in seconds.
          </p>

          {/* Action Buttons: Camera & Upload */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-5 rounded-2xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-950/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Camera size={24} className="text-slate-950" />
              </div>
              <span className="text-sm">Take Photo</span>
              <span className="text-[10px] font-normal opacity-80">Use Mobile Camera</span>
            </button>

            <button
              onClick={() => uploadInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-800 border border-slate-700 text-white font-bold hover:bg-slate-750 transition-all active:scale-95 group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload size={22} className="text-emerald-400" />
              </div>
              <span className="text-sm">Upload Bill</span>
              <span className="text-[10px] font-normal text-slate-400">JPG, PNG, WebP</span>
            </button>
          </div>

          {/* Hackathon Demo / Quick Sample Bills Section */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                Demo Mode — Quick Test Bills
              </span>
              <span className="text-[10px] text-slate-500">1-Tap Testing</span>
            </div>

            <div className="space-y-2">
              {SAMPLE_BILLS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {sample.title}
                    </div>
                    <div className="text-[11px] text-slate-400">{sample.subtitle}</div>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 group-hover:text-emerald-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: AI OCR SCANNING STATE */}
      {step === "scanning" && (
        <div className="py-12 px-4 text-center space-y-6 my-auto animate-in fade-in duration-200">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center shadow-xl">
              <Sparkles size={36} className="text-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">{scanStatusText}</h3>
            <p className="text-xs text-slate-400">
              Extracting utility provider, kWh, billing date, and account details…
            </p>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
            <div className="bg-emerald-500 h-full rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* STEP 3: VERIFY & EDIT EXTRACTED DATA (MANDATORY VERIFICATION SCREEN) */}
      {step === "verify" && billData && (
        <div className="space-y-4 animate-in fade-in duration-200 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                Step 2 of 4
              </span>
              <h2 className="text-xl font-black text-white">Verify Extracted Data</h2>
            </div>
            <button
              onClick={() => setStep("capture")}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl"
            >
              <RefreshCw size={12} /> Rescan Bill
            </button>
          </div>

          {/* Mandatory Verification Banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white">Please check the information below against your bill before continuing.</h4>
              <p className="text-[11px] text-slate-300 leading-snug">
                You must confirm or edit all values. Emissions calculation will run on your verified numbers.
              </p>
            </div>
          </div>

          {/* Source Bill Image Traceability Card */}
          {activeImage && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-900">
                  <img src={activeImage} alt="Scanned Bill" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white truncate max-w-[170px]">
                    {billData.billImageName || "Electricity Bill Image"}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Shield size={10} /> Source Image Linked for Audit
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsZoomModalOpen(true)}
                className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <ZoomIn size={14} /> View Image
              </button>
            </div>
          )}

          {/* Form Fields & Label Snippets */}
          <div className="space-y-4 bg-slate-950/80 p-4 rounded-3xl border border-slate-800">
            {/* 1. Utility Provider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  1. Utility Provider
                </label>
                {renderConfidenceBadge(billData.providerConfidence)}
              </div>
              {billData.providerSnippet && (
                <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800/80 font-mono truncate">
                  Snippet: "{billData.providerSnippet}"
                </div>
              )}
              <select
                value={billData.provider}
                onChange={(e) => setBillData({ ...billData, provider: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-medium"
              >
                <option value="Tenaga Nasional Berhad (TNB)">Tenaga Nasional Berhad (TNB)</option>
                <option value="Sarawak Energy">Sarawak Energy</option>
                <option value="Air Selangor">Air Selangor</option>
                <option value="Sabah Electricity Sdn Bhd">Sabah Electricity Sdn Bhd</option>
              </select>
            </div>

            {/* 2. Account Number */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  2. Account Number *
                </label>
                {renderConfidenceBadge(billData.accountNumberConfidence)}
              </div>
              {billData.accountNumberSnippet && (
                <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800/80 font-mono truncate">
                  Snippet: "{billData.accountNumberSnippet}"
                </div>
              )}
              <input
                type="text"
                value={billData.accountNumber}
                onChange={(e) => setBillData({ ...billData, accountNumber: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono font-bold"
              />
            </div>

            {/* 3. Electricity Consumption (kWh) - CORE EMISSIONS FIELD */}
            <div className="space-y-1 bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <span>3. Electricity Consumption (kWh) *</span>
                </label>
                {renderConfidenceBadge(billData.kwhConsumptionConfidence)}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-medium">
                  {billData.consumptionDerived ? "Derived from Meter Readings" : "Direct Extraction"}
                </span>
              </div>

              {billData.kwhConsumptionSnippet && (
                <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800/80 font-mono truncate">
                  Snippet: "{billData.kwhConsumptionSnippet}"
                </div>
              )}

              <div className="relative">
                <input
                  type="number"
                  value={billData.kwhConsumption || ""}
                  onChange={(e) => setBillData({ ...billData, kwhConsumption: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-emerald-500/60 rounded-xl px-3 py-2.5 text-base font-black text-emerald-400 focus:border-emerald-400 outline-none font-mono"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 font-mono pointer-events-none">
                  kWh
                </span>
              </div>
            </div>

            {/* 4. Peak Demand (kW) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  4. Peak Demand (kW)
                </label>
                {renderConfidenceBadge(billData.peakDemandKwConfidence)}
              </div>
              {billData.peakDemandKwSnippet && (
                <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800/80 font-mono truncate">
                  Snippet: "{billData.peakDemandKwSnippet}"
                </div>
              )}
              <div className="relative">
                <input
                  type="number"
                  value={billData.peakDemandKw ?? ""}
                  placeholder="Not detected / Optional"
                  onChange={(e) =>
                    setBillData({ ...billData, peakDemandKw: e.target.value ? parseFloat(e.target.value) : null })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400 font-mono pointer-events-none">
                  kW
                </span>
              </div>
            </div>

            {/* 5. Meter Number */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  5. Meter Number
                </label>
                {renderConfidenceBadge(billData.meterNumberConfidence)}
              </div>
              {billData.meterNumberSnippet && (
                <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800/80 font-mono truncate">
                  Snippet: "{billData.meterNumberSnippet}"
                </div>
              )}
              <input
                type="text"
                value={billData.meterNumber}
                onChange={(e) => setBillData({ ...billData, meterNumber: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
              />
            </div>

            {/* 6. Billing Date & Period */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    6. Billing Date *
                  </label>
                </div>
                {billData.billingDateSnippet && (
                  <div className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono truncate">
                    Snippet: "{billData.billingDateSnippet}"
                  </div>
                )}
                <input
                  type="date"
                  value={billData.billingDate}
                  onChange={(e) => setBillData({ ...billData, billingDate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  7. Billing Period
                </label>
                {billData.billingPeriodSnippet && (
                  <div className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono truncate">
                    Snippet: "{billData.billingPeriodSnippet}"
                  </div>
                )}
                <input
                  type="text"
                  value={billData.billingPeriod}
                  onChange={(e) => setBillData({ ...billData, billingPeriod: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* 8. Previous & Current Meter Readings */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  8. Previous Reading
                </label>
                {billData.previousMeterReadingSnippet && (
                  <div className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono truncate">
                    "{billData.previousMeterReadingSnippet}"
                  </div>
                )}
                <input
                  type="text"
                  value={billData.previousMeterReading || ""}
                  onChange={(e) => setBillData({ ...billData, previousMeterReading: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  9. Current Reading
                </label>
                {billData.currentMeterReadingSnippet && (
                  <div className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono truncate">
                    "{billData.currentMeterReadingSnippet}"
                  </div>
                )}
                <input
                  type="text"
                  value={billData.currentMeterReading || ""}
                  onChange={(e) => setBillData({ ...billData, currentMeterReading: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                />
              </div>
            </div>

            {/* 10. Total Bill Amount (MYR) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  10. Total Bill Amount (MYR)
                </label>
                {renderConfidenceBadge(billData.totalAmountMyrConfidence)}
              </div>
              {billData.totalAmountMyrSnippet && (
                <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800/80 font-mono truncate">
                  Snippet: "{billData.totalAmountMyrSnippet}"
                </div>
              )}
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400 font-mono pointer-events-none">
                  RM
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={billData.totalAmountMyr ?? ""}
                  onChange={(e) => setBillData({ ...billData, totalAmountMyr: parseFloat(e.target.value) || null })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                />
              </div>
            </div>

            {/* 11. Other Electricity Usage Details */}
            {billData.otherUsageInfo && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  11. Tariff / Other Usage Info
                </label>
                <input
                  type="text"
                  value={billData.otherUsageInfo || ""}
                  onChange={(e) => setBillData({ ...billData, otherUsageInfo: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>
            )}
          </div>

          {/* Optional Fuel Usage Collapsible (Scope 1) */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fuel size={16} className="text-amber-400" />
                <span className="text-xs font-bold text-white">Add Direct Fuel Usage (Scope 1)</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Optional</span>
            </div>

            {fuelRecords.length === 0 ? (
              <p className="text-[11px] text-slate-400">
                No fuel consumption data provided. Scope 1 will calculate as 0.00 tCO2e.
              </p>
            ) : (
              <div className="space-y-1.5">
                {fuelRecords.map((r) => (
                  <div key={r.id} className="text-xs text-slate-300 bg-slate-900 p-2 rounded-lg flex justify-between">
                    <span>{r.fuelType} ({r.quantity} {r.unit})</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {((r.quantity * (r.fuelType === "Diesel" ? config.dieselFactor : config.petrolFactor)) / 1000).toFixed(3)} tCO2e
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowFuelForm(!showFuelForm)}
                className="py-1.5 px-3 rounded-xl bg-slate-800 text-[11px] font-bold text-slate-300 hover:bg-slate-700 flex items-center gap-1"
              >
                <Plus size={12} /> Add Fuel Entry
              </button>
              <button
                onClick={() => csvInputRef.current?.click()}
                className="py-1.5 px-3 rounded-xl bg-slate-800 text-[11px] font-bold text-slate-300 hover:bg-slate-700 flex items-center gap-1"
              >
                <Upload size={12} /> Import CSV
              </button>
            </div>

            {showFuelForm && (
              <div className="pt-2 border-t border-slate-800 space-y-2 animate-in fade-in">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newFuelType}
                    onChange={(e) => setNewFuelType(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Natural Gas">Natural Gas</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Litres / Qty"
                    value={newFuelQty}
                    onChange={(e) => setNewFuelQty(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <button
                  onClick={handleAddFuel}
                  className="w-full py-2 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500/30"
                >
                  Save Fuel Record
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleConfirmVerification}
            className="w-full py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            Confirm Extracted Values & Calculate Carbon Footprint <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 4: EMISSIONS SUMMARY & CALCULATION BREAKDOWN */}
      {step === "summary" && generatedReport && billData && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
              Step 3 of 4
            </span>
            <h2 className="text-xl font-black text-white">Emissions Summary</h2>
          </div>

          {/* Main Calculation Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Scope 2 Electricity */}
            <div className="bg-slate-950/80 border border-emerald-500/30 p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Scope 2 (Electricity)
              </span>
              <div className="text-2xl font-black text-white font-mono">
                {generatedReport.scope2Tonnes.toFixed(3)}
              </div>
              <span className="text-[10px] text-slate-400">tCO2e (Indirect)</span>
            </div>

            {/* Scope 1 Direct */}
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Scope 1 (Fuel / Gas)
              </span>
              <div className="text-2xl font-black text-white font-mono">
                {generatedReport.scope1Tonnes.toFixed(3)}
              </div>
              <span className="text-[10px] text-slate-400">
                {generatedReport.scope1Tonnes === 0 ? "No fuel logged" : "tCO2e (Direct)"}
              </span>
            </div>
          </div>

          {/* Total Carbon Footprint Banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Total Carbon Footprint
            </span>
            <div className="text-3xl font-black text-white font-mono">
              {generatedReport.totalEmissionsTonnes.toFixed(3)}{" "}
              <span className="text-base font-normal text-emerald-400">tCO2e</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Reporting Period: {generatedReport.reportingPeriod}
            </p>
          </div>

          {/* Transparent Calculation Breakdown */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-white mb-2 flex items-center justify-between">
              <span>Calculation Methodology</span>
              <span className="text-[10px] text-emerald-400">ISSB S1/S2 Aligned</span>
            </div>

            <div className="text-slate-300 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Electricity Usage:</span>
                <span className="text-white">{billData.kwhConsumption.toLocaleString()} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">TNB Grid Emission Factor:</span>
                <span className="text-white">{config.gridEmissionFactor} kg CO2e/kWh</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                <span className="text-slate-300">Scope 2 Formula:</span>
                <span className="text-emerald-400">
                  {billData.kwhConsumption.toLocaleString()} × {config.gridEmissionFactor} ÷ 1,000
                </span>
              </div>
            </div>
          </div>

          {/* Tamper-Evident SHA-256 Hash Preview */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              🔒 SHA-256 Integrity Hash Reference
            </span>
            <p className="text-[10px] font-mono text-emerald-400 truncate">
              {generatedReport.integrityHash}
            </p>
            <p className="text-[10px] text-slate-500">
              Tamper-evident cryptographic reference linking activity data to report.
            </p>
          </div>

          <button
            onClick={handleGenerateFinalPDF}
            className="w-full py-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <Download size={18} /> Generate & Download PDF Report
          </button>
        </div>
      )}

      {/* STEP 5: COMPLETED STATE & REAL PDF DOWNLOAD */}
      {step === "completed" && generatedReport && (
        <div className="py-6 space-y-5 animate-in fade-in duration-200 text-center my-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Report Generated!</h2>
            <p className="text-xs text-slate-400">
              Traceable ISSB S1/S2 carbon report created & downloaded.
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Report ID:</span>
              <span className="font-mono text-white font-bold">{generatedReport.reportId}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Carbon Emissions:</span>
              <span className="font-mono text-emerald-400 font-black text-sm">
                {generatedReport.totalEmissionsTonnes.toFixed(3)} tCO2e
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">SHA-256 Hash:</span>
              <span className="font-mono text-[10px] text-slate-300 max-w-[180px] truncate">
                {generatedReport.integrityHash}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => downloadPDFReport(generatedReport)}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Download size={16} /> Re-download PDF Report
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Carbon Report - ${generatedReport.companyName}`,
                    text: `Carbon Emissions Report (${generatedReport.reportingPeriod}): ${generatedReport.totalEmissionsTonnes} tCO2e. Integrity Hash: ${generatedReport.integrityHash}`,
                  });
                } else {
                  navigator.clipboard.writeText(`Report ID: ${generatedReport.reportId} | Total: ${generatedReport.totalEmissionsTonnes} tCO2e | Hash: ${generatedReport.integrityHash}`);
                  toast.success("Report summary & hash copied to clipboard!");
                }
              }}
              className="w-full py-3 rounded-2xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 size={16} /> Share Report Reference
            </button>

            <button
              onClick={() => {
                setBillData(null);
                setPreviewImage(null);
                setGeneratedReport(null);
                setStep("capture");
              }}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white"
            >
              + Generate Another Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
