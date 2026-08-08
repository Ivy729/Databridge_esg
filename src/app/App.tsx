import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import MobileContainer from "./components/MobileContainer";
import PrivacyModal from "./components/PrivacyModal";
import CreateReportFlow from "./components/CreateReportFlow";
import ReportHistory from "./components/ReportHistory";
import SettingsView from "./components/SettingsView";

import { AppConfig, GeneratedReport } from "./lib/types";
import { DEFAULT_CONFIG } from "./lib/emissions";
import { downloadPDFReport } from "./lib/pdf";
import { SAMPLE_BILLS } from "./lib/sampleBills";

import {
  Sparkles,
  Zap,
  ShieldCheck,
  FileText,
  ArrowRight,
  TrendingDown,
  Download,
  Share2,
  Building2,
  Lock,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  
  // Privacy Consent Modal State
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  // Flow State
  const [isCreatingReport, setIsCreatingReport] = useState(false);

  // Saved Reports List
  const [reports, setReports] = useState<GeneratedReport[]>([
    {
      reportId: "REP-MY-2025-9921",
      companyName: "Precision Microtech (M) Sdn Bhd",
      registrationNumber: "201801048821 (1298834-X)",
      facilityLocation: "Bayan Lepas Free Industrial Zone, Phase 4, 11900 Penang",
      reportingPeriod: "01 Jun 2025 – 30 Jun 2025",
      utilityProvider: "Tenaga Nasional Berhad (TNB)",
      accountNumber: "2204 8839 1022",
      meterNumber: "M-7739102",
      billingDate: "2025-07-15",
      peakDemandKw: 185,
      kwhConsumption: 14250,
      totalAmountMyr: 6840.0,
      gridFactorUsed: 0.740,
      scope1Tonnes: 0.0,
      scope2Tonnes: 10.545,
      totalEmissionsTonnes: 10.545,
      generatedAt: "2025-07-16",
      verificationStatus: "Verified by User",
      integrityHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      issbFramework: "ISSB S1/S2 & GRI 302/305 Disclosure Ready",
      fuelRecordsCount: 0,
    },
  ]);

  // Initiate Create Carbon Report
  const handleStartReportFlow = () => {
    if (!hasConsented) {
      setShowPrivacyModal(true);
    } else {
      setIsCreatingReport(true);
      setActiveTab("scanner");
    }
  };

  const handlePrivacyAccept = () => {
    setHasConsented(true);
    setShowPrivacyModal(false);
    setIsCreatingReport(true);
    setActiveTab("scanner");
    toast.success("Privacy consent acknowledged.");
  };

  const handlePrivacyDecline = () => {
    setShowPrivacyModal(false);
    toast.info("Privacy consent is required to process bill data.");
  };

  const handleReportCreated = (newReport: GeneratedReport) => {
    setReports([newReport, ...reports]);
  };

  const handleTabChange = (tab: string) => {
    if (tab === "scanner") {
      handleStartReportFlow();
    } else {
      setIsCreatingReport(false);
      setActiveTab(tab);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      <Toaster position="top-center" richColors theme="dark" />

      {/* Privacy Consent Modal */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onAccept={handlePrivacyAccept}
        onDecline={handlePrivacyDecline}
      />

      <MobileContainer
        activeTab={activeTab}
        onTabChange={handleTabChange}
        reportCount={reports.length}
      >
        {/* TAB 1: SCANNER / CREATE REPORT FLOW */}
        {activeTab === "scanner" || isCreatingReport ? (
          <CreateReportFlow
            config={config}
            onReportCreated={handleReportCreated}
            onCancel={() => {
              setIsCreatingReport(false);
              setActiveTab("home");
            }}
          />
        ) : activeTab === "reports" ? (
          /* TAB 2: REPORTS HISTORY */
          <ReportHistory
            reports={reports}
            onCreateNew={() => handleTabChange("scanner")}
          />
        ) : activeTab === "settings" ? (
          /* TAB 3: SETTINGS VIEW */
          <SettingsView
            config={config}
            onSaveConfig={(newCfg) => setConfig(newCfg)}
          />
        ) : (
          /* TAB 0: HOME SCREEN */
          <div className="p-4 space-y-4">
            {/* Header / SME Profile Badge */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                  Malaysian E&E SME App
                </span>
                <h1 className="text-lg font-black text-white flex items-center gap-1.5">
                  DataBridge <span className="text-xs text-emerald-400 font-bold">ESG</span>
                </h1>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-300 block truncate max-w-[140px]">
                  {config.companyName}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Penang FIZ</span>
              </div>
            </div>

            {/* Core Value Proposition Hero Card */}
            <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-5 space-y-4 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-1 relative z-10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  ⚡ 2-Minute Carbon Statement
                </span>
                <h2 className="text-xl font-black text-white leading-tight pt-1">
                  From one electricity bill to a traceable carbon report in minutes.
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  AI vision extracts TNB bill data, calculates Scope 1 & 2 emissions, and generates tamper-evident ISSB S1/S2 & GRI 302/305 PDF disclosures.
                </p>
              </div>

              {/* Main Action Callout */}
              <button
                onClick={handleStartReportFlow}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-98 group"
              >
                <span>Create Carbon Report</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* SME Impact Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Zap size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Latest Month Scope 2</span>
                </div>
                <div className="text-xl font-black text-white font-mono">
                  {reports[0]?.scope2Tonnes.toFixed(3) || "0.000"}{" "}
                  <span className="text-xs font-normal text-slate-400">tCO2e</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {reports[0]?.kwhConsumption.toLocaleString() || "0"} kWh
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Grid Factor</span>
                </div>
                <div className="text-xl font-black text-white font-mono">
                  {config.gridEmissionFactor}{" "}
                  <span className="text-xs font-normal text-slate-400">kg/kWh</span>
                </div>
                <div className="text-[10px] text-slate-400">Peninsular Malaysia</div>
              </div>
            </div>

            {/* Quick Demo Section / Sample Bill Trigger */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  <h3 className="text-xs font-bold text-white">Quick Hackathon Test</h3>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                  Demo Ready
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Test the full AI OCR scan, verification, carbon calculation, and PDF download flow in one tap using pre-loaded TNB bill data:
              </p>

              <button
                onClick={handleStartReportFlow}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-white text-xs font-bold flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-emerald-400" />
                  <span>Scan TNB Penang SMT Bill (14,250 kWh)</span>
                </div>
                <ChevronRight size={16} className="text-slate-500 group-hover:text-emerald-400" />
              </button>
            </div>

            {/* Compliance & Buyer Trust Standard */}
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Building2 size={16} className="text-emerald-400" />
                <span>E&E Corporate Supply Chain Readiness</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Reports include a SHA-256 tamper-evident integrity hash to support supplier ESG disclosure requirements for global tech buyers (Apple, Intel, Sony, Infineon, Dell).
              </p>
            </div>
          </div>
        )}
      </MobileContainer>
    </div>
  );
}
