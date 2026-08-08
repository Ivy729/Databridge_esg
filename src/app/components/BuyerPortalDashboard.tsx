import React, { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  ShieldCheck,
  Zap,
  FileCheck2,
  Search,
  Filter,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Download,
  Lock,
  Layers,
  BarChart3,
  Globe,
  Bell,
  User,
  X,
  FileText,
  BadgeCheck,
  Cpu,
  RefreshCw,
  Sparkles,
  Check,
  Factory,
  ArrowRight,
  CheckSquare,
  Share2,
  Eye,
  Smartphone,
  LogOut,
} from "lucide-react";

// ─── MOCK DATA FOR E&E SME SUPPLIERS ──────────────────────────────────────────

export interface Supplier {
  id: string;
  name: string;
  sector: string;
  subSector: string;
  location: string;
  verificationStatus: "verified" | "pending";
  gridDependency: string;
  carbonIntensity: string; // e.g., "0.584 kg CO₂e/kWh"
  annualEmissions: string; // e.g., "3,420 t CO₂e"
  tnbAccountNo: string;
  lastAuditDate: string;
  cryptographicHash: string;
  cbamCompliance: number; // percentage
  issbCompliance: boolean;
  appleRE100Score: number;
  intelScope3Verified: boolean;
  description: string;
  capabilities: string[];
  monthlyPowerKWh: string;
  approvedVendor: boolean;
  contactEmail: string;
}

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "EE-MY-01",
    name: "Penang Precision Tech",
    sector: "Semiconductor Packaging & Testing",
    subSector: "IC Substrates & Flip-Chip Assembly",
    location: "Bayan Lepas FTZ, Penang",
    verificationStatus: "verified",
    gridDependency: "100% TNB Grid",
    carbonIntensity: "0.584 kg CO₂e/kWh",
    annualEmissions: "3,420 t CO₂e",
    tnbAccountNo: "2204-8910-4412",
    lastAuditDate: "Aug 02, 2025",
    cryptographicHash: "0x8f3b92a10c94e8271a9f0284b37d6e1940a2c51982b1c",
    cbamCompliance: 98,
    issbCompliance: true,
    appleRE100Score: 92,
    intelScope3Verified: true,
    description:
      "Tier-2 semiconductor packaging supplier based in Bayan Lepas FTZ. Specialising in high-density BGA substrates and micro-electronic testing for automotive and mobile ICs.",
    capabilities: [
      "ISO Class 5 Cleanrooms (3x)",
      "Automated Wire-Bonding Lines",
      "Cryptographically Verified TNB Utility OCR Logs",
      "Direct VFD HVAC Chiller Sub-metering",
    ],
    monthlyPowerKWh: "488,000 kWh",
    approvedVendor: true,
    contactEmail: "procurement@penangprecision.com.my",
  },
  {
    id: "EE-MY-02",
    name: "Batu Kawan Micro-Assembly",
    sector: "SMT PCB Electronics Assembly",
    subSector: "High-Speed Surface Mount & Testing",
    location: "Batu Kawan Industrial Park, Penang",
    verificationStatus: "verified",
    gridDependency: "78% TNB / 22% Solar",
    carbonIntensity: "0.492 kg CO₂e/kWh",
    annualEmissions: "2,150 t CO₂e",
    tnbAccountNo: "2109-3382-9011",
    lastAuditDate: "Aug 05, 2025",
    cryptographicHash: "0x3a7e91d04b82c9e10f44a839d01e227a911c4021b8",
    cbamCompliance: 94,
    issbCompliance: true,
    appleRE100Score: 88,
    intelScope3Verified: true,
    description:
      "Contract electronics manufacturer delivering high-volume PCBA for telecom and industrial controllers. Equipped with 120kW rooftop solar PV array and automated SMT lines.",
    capabilities: [
      "8x High-Speed SMT Reflow Lines",
      "120kW On-site Rooftop Solar PV Integration",
      "Auto-standby Thermal Energy Recovery Profiles",
    ],
    monthlyPowerKWh: "320,000 kWh",
    approvedVendor: false,
    contactEmail: "info@batukawan-micro.my",
  },
  {
    id: "EE-MY-03",
    name: "Kulim Silicon Wafer Tooling",
    sector: "Precision E&E Tooling & Dies",
    subSector: "Photolithography Mask Carriers & Mold Dies",
    location: "Kulim Hi-Tech Park, Kedah",
    verificationStatus: "verified",
    gridDependency: "85% TNB / 15% Biomass RE",
    carbonIntensity: "0.520 kg CO₂e/kWh",
    annualEmissions: "4,890 t CO₂e",
    tnbAccountNo: "2501-1192-3304",
    lastAuditDate: "Jul 28, 2025",
    cryptographicHash: "0x91d84b2c01e3892740fa1839d48b11c902e88a31",
    cbamCompliance: 91,
    issbCompliance: true,
    appleRE100Score: 85,
    intelScope3Verified: true,
    description:
      "Ultra-precision CNC machining and electro-discharge tooling supplier catering to Tier-1 wafer foundries in Malaysia and Singapore.",
    capabilities: [
      "5-Axis Nano CNC Tooling",
      "PFC Fluorinated Gas Abatement Traps",
      "Real-time TNB Tariff Smart Metering",
    ],
    monthlyPowerKWh: "640,000 kWh",
    approvedVendor: true,
    contactEmail: "sales@kulimsilicon.com",
  },
  {
    id: "EE-MY-04",
    name: "Kinta Valley Metal Stamping",
    sector: "Precision Metal Enclosures & Shielding",
    subSector: "RF Shielding & Heat Sinks",
    location: "Kinta Free Industrial Zone, Perak",
    verificationStatus: "pending",
    gridDependency: "100% TNB Grid",
    carbonIntensity: "0.740 kg CO₂e/kWh",
    annualEmissions: "1,850 t CO₂e",
    tnbAccountNo: "1902-8841-2099",
    lastAuditDate: "Pending Verification",
    cryptographicHash: "Pending OCR Verification",
    cbamCompliance: 62,
    issbCompliance: false,
    appleRE100Score: 54,
    intelScope3Verified: false,
    description:
      "Precision metal stamping supplier providing aluminum heat sinks and RF shielding enclosures for automotive sensor modules.",
    capabilities: [
      "Automated Servo Stamping Presses",
      "Anodising & Electroplating Water Recovery",
    ],
    monthlyPowerKWh: "210,000 kWh",
    approvedVendor: false,
    contactEmail: "admin@kintastamping.my",
  },
  {
    id: "EE-MY-05",
    name: "Malacca Opto-Sensors",
    sector: "Optoelectronics & Optical Sensors",
    subSector: "Photodiode Packaging & Camera Lens Modules",
    location: "Ayer Keroh Industrial Area, Malacca",
    verificationStatus: "verified",
    gridDependency: "90% TNB / 10% Solar",
    carbonIntensity: "0.495 kg CO₂e/kWh",
    annualEmissions: "2,840 t CO₂e",
    tnbAccountNo: "2803-4410-9921",
    lastAuditDate: "Aug 01, 2025",
    cryptographicHash: "0x7c2b01d948e22f019a84b392e1048b19280c4821",
    cbamCompliance: 96,
    issbCompliance: true,
    appleRE100Score: 90,
    intelScope3Verified: true,
    description:
      "High-precision optical sensor module packaging provider serving global smartphones, wearable health devices, and lidar sensors.",
    capabilities: [
      "Class 10 Cleanroom Optical Alignment",
      "Cryptographic Ledger Hash Verification",
      "Closed-Loop Chiller Water Cooling",
    ],
    monthlyPowerKWh: "390,000 kWh",
    approvedVendor: true,
    contactEmail: "contact@malaccaopto.com",
  },
  {
    id: "EE-MY-06",
    name: "Johor Rigid-Flex Circuits",
    sector: "Multi-Layer PCB Manufacturing",
    subSector: "High-Density Interconnect (HDI) Rigid-Flex",
    location: "PTP Industrial Area, Johor",
    verificationStatus: "pending",
    gridDependency: "100% TNB Grid",
    carbonIntensity: "0.680 kg CO₂e/kWh",
    annualEmissions: "5,120 t CO₂e",
    tnbAccountNo: "1104-9281-0044",
    lastAuditDate: "In Audit Review",
    cryptographicHash: "Pending OCR Verification",
    cbamCompliance: 68,
    issbCompliance: false,
    appleRE100Score: 61,
    intelScope3Verified: false,
    description:
      "Specialised rigid-flex circuit board manufacturer serving medical robotics and aerospace electronics assembly.",
    capabilities: [
      "Laser Direct Imaging (LDI)",
      "Chemical Copper Plating Recycling",
    ],
    monthlyPowerKWh: "710,000 kWh",
    approvedVendor: false,
    contactEmail: "sales@johorcircuits.my",
  },
];

interface BuyerPortalDashboardProps {
  onSwitchToSMEApp?: () => void;
  onLogout?: () => void;
}

export default function BuyerPortalDashboard({ onSwitchToSMEApp, onLogout }: BuyerPortalDashboardProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [selectedVerification, setSelectedVerification] = useState<string>("All");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showHashInspector, setShowHashInspector] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "suppliers" | "reports">("dashboard");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Filtering suppliers
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector =
      selectedSector === "All" || supplier.sector.includes(selectedSector);

    const matchesVerification =
      selectedVerification === "All" ||
      (selectedVerification === "Verified" && supplier.verificationStatus === "verified") ||
      (selectedVerification === "Pending" && supplier.verificationStatus === "pending");

    return matchesSearch && matchesSector && matchesVerification;
  });

  // Calculate statistics
  const totalSuppliers = suppliers.length;
  const verifiedCount = suppliers.filter((s) => s.verificationStatus === "verified").length;
  const cbamCompliantPercent = Math.round((verifiedCount / totalSuppliers) * 100);

  const toggleApprovedVendor = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStatus = !s.approvedVendor;
          toast.success(
            newStatus
              ? `${s.name} added to Approved Vendor List (AVL)`
              : `${s.name} removed from Approved Vendor List`
          );
          return { ...s, approvedVendor: newStatus };
        }
        return s;
      })
    );
    if (selectedSupplier && selectedSupplier.id === id) {
      setSelectedSupplier((prev) => prev ? { ...prev, approvedVendor: !prev.approvedVendor } : null);
    }
  };

  const handleInitiateContract = (supplier: Supplier) => {
    toast.success(
      `Procurement Contract Request sent to ${supplier.name}. Cryptographic TNB verification proof attached.`
    );
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-[#0B132B]">
      {/* ─── 1. TOP NAVIGATION HEADER (Row 1: Brand & Actions, Row 2: Navigation Tabs) ─── */}
      <header className="sticky top-0 z-40 bg-[#0F172A] border-b border-slate-800">
        {/* Row 1: Brand Logo & User Actions */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 border-b border-slate-800/80">
          <div className="flex items-center justify-between w-full">
            {/* Left: Brand Logo & Enterprise Badge */}
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                <Cpu className="text-[#0F172A]" size={18} />
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <span className="font-extrabold text-white text-xs sm:text-sm tracking-tight truncate">
                  DataBridge
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 flex-shrink-0">
                  Enterprise
                </span>
              </div>
            </div>

            {/* Right: Notifications & Profile Menu */}
            <div className="flex items-center gap-2 flex-shrink-0 relative">
              <button
                onClick={() => toast.info("No new notifications")}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors relative flex-shrink-0"
              >
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </button>

              {/* Profile Avatar Button */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="flex items-center gap-1.5 pl-2 border-l border-slate-800 hover:opacity-90 transition-opacity focus:outline-none"
                  title="Click to view account menu"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400 flex-shrink-0">
                    INT
                  </div>
                  <div className="text-left max-w-[85px] sm:max-w-none">
                    <div className="text-xs font-bold text-white leading-tight truncate">
                      Intel Penang
                    </div>
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute right-0 top-10 z-50 w-52 bg-[#1E293B] rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3.5 py-3 border-b border-slate-700/80 bg-slate-900/60">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-xs font-black text-[#0F172A] flex-shrink-0">
                            INT
                          </div>
                          <div className="min-w-0">
                            <div className="text-white text-xs font-bold truncate">
                              Intel Penang
                            </div>
                            <div className="text-emerald-400 text-[10px] font-medium truncate">
                              Enterprise Sourcing
                            </div>
                          </div>
                        </div>
                      </div>

                      {onLogout && (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-left text-xs font-semibold"
                        >
                          <LogOut size={14} className="flex-shrink-0" />
                          <span>Sign Out</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Navigation Tabs (Horizontal scroll strip for clean mobile app feel) */}
        <div className="w-full bg-[#090D16] px-3 py-2 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex-shrink-0 ${
                activeTab === "dashboard"
                  ? "bg-emerald-500 text-[#0F172A] border-emerald-400 shadow-sm shadow-emerald-500/20"
                  : "bg-slate-800/90 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("suppliers")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border flex-shrink-0 ${
                activeTab === "suppliers"
                  ? "bg-emerald-500 text-[#0F172A] border-emerald-400 shadow-sm shadow-emerald-500/20"
                  : "bg-slate-800/90 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700"
              }`}
            >
              <span>My E&E Suppliers</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === "suppliers" ? "bg-[#0F172A] text-emerald-400" : "bg-emerald-950 text-emerald-300"
              }`}>
                {verifiedCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex-shrink-0 ${
                activeTab === "reports"
                  ? "bg-emerald-500 text-[#0F172A] border-emerald-400 shadow-sm shadow-emerald-500/20"
                  : "bg-slate-800/90 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700"
              }`}
            >
              CBAM / ISSB Reports
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-3 sm:space-y-6 pb-20">
        
        {/* TAB 1: OVERVIEW / DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-3 sm:space-y-6">
            {/* Banner Announcement */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0F2942] rounded-2xl p-3.5 sm:p-5 border border-slate-700/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex-shrink-0 mt-0.5">
                  <ShieldCheck size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h2 className="text-xs sm:text-base font-bold text-white leading-snug">
                      EU CBAM Scope 3 Compliance Engine
                    </h2>
                    <span className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                      TNB OCR Active
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-normal">
                    Verifying Malaysian E&E electricity usage directly from Tenaga Nasional Berhad utility bills for immutable EU CBAM customs filings.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
                <button
                  onClick={() => {
                    setActiveTab("reports");
                    toast.success("Downloading EU CBAM Compliance Audit Summary (PDF)");
                  }}
                  className="w-full md:w-auto px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
                >
                  <Download size={14} />
                  <span>Export CBAM Report</span>
                </button>
              </div>
            </div>

            {/* ─── HIGH-LEVEL ANALYTICS ROW (Compact 2x2 on Mobile) ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              {/* Card 1 */}
              <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-2.5 sm:p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                    Active Suppliers
                  </span>
                  <div className="p-1 bg-slate-800 rounded text-slate-300 flex-shrink-0">
                    <Building2 size={13} />
                  </div>
                </div>
                <div>
                  <div className="text-base sm:text-3xl font-extrabold text-white tracking-tight">
                    148
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-0.5 font-medium truncate">
                    <ArrowUpRight size={11} className="flex-shrink-0" />
                    <span className="truncate">+12 this month</span>
                  </div>
                </div>
              </div>

              {/* Card 2 - Highlighted in Green */}
              <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-xl p-2.5 sm:p-5 shadow-lg shadow-emerald-950/30 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between text-emerald-300 mb-1">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                    CBAM Compliant
                  </span>
                  <div className="p-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-400 flex-shrink-0">
                    <BadgeCheck size={13} />
                  </div>
                </div>
                <div>
                  <div className="text-base sm:text-3xl font-black text-emerald-400 tracking-tight">
                    {cbamCompliantPercent}%
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-300 mt-0.5 font-medium truncate">
                    <CheckCircle2 size={11} className="text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{verifiedCount} of {totalSuppliers} verified</span>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-2.5 sm:p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                    Scope 3 CO₂e
                  </span>
                  <div className="p-1 bg-slate-800 rounded text-slate-300 flex-shrink-0">
                    <Zap size={13} />
                  </div>
                </div>
                <div>
                  <div className="text-base sm:text-3xl font-extrabold text-white tracking-tight">
                    24,850 <span className="text-[9px] sm:text-xs font-normal text-slate-400">tCO₂e</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 truncate">
                    <span className="text-emerald-400 font-medium flex-shrink-0">0.584 kg/kWh</span>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-2.5 sm:p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                    Audit Integrity
                  </span>
                  <div className="p-1 bg-slate-800 rounded text-slate-300 flex-shrink-0">
                    <Lock size={13} />
                  </div>
                </div>
                <div>
                  <div className="text-base sm:text-3xl font-extrabold text-white tracking-tight">
                    100%
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-0.5 font-medium truncate">
                    <FileCheck2 size={11} className="flex-shrink-0" />
                    <span className="truncate">SHA-256 Validated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Supplier Highlights Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                    <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
                    <span className="truncate">Verified SME Spotlight</span>
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Recent Malaysian SMEs with authenticated TNB bill audits.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("suppliers")}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors flex-shrink-0"
                >
                  <span>View All ({verifiedCount})</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Top 2 Suppliers Preview */}
              <div className="grid grid-cols-1 gap-2.5">
                {suppliers.slice(0, 2).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSupplier(s)}
                    className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-2.5 overflow-hidden"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-extrabold text-emerald-400 text-xs flex-shrink-0 shadow-inner">
                        {s.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate leading-snug">{s.name}</div>
                        <div className="text-[10px] text-slate-400 truncate leading-snug">{s.sector} · {s.location}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
                      <div className="text-[11px] font-mono font-bold text-emerald-400 whitespace-nowrap">{s.carbonIntensity}</div>
                      <div className="text-[9px] text-slate-400 whitespace-nowrap leading-none mt-0.5">{s.cbamCompliance}% CBAM</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VERIFIED SMES DIRECTORY */}
        {activeTab === "suppliers" && (
          <section className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-3.5 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-xs sm:text-base font-bold text-white flex items-center gap-2 flex-wrap">
                  <span className="truncate">E&E SME Supplier Directory</span>
                  <span className="text-[9px] sm:text-xs font-normal text-slate-400 px-2 py-0.5 bg-slate-800 rounded-full flex-shrink-0">
                    Malaysia
                  </span>
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-snug">
                  Scope 3 emissions derived from OCR-scanned Tenaga Nasional Berhad electricity bills.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                {/* Search Bar */}
                <div className="relative w-full sm:w-48">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search SME..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                  {/* Sector Filter */}
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All">All Sectors</option>
                    <option value="Semiconductor">Semiconductor</option>
                    <option value="SMT">SMT Assembly</option>
                    <option value="Tooling">Precision Tooling</option>
                    <option value="Metal">Metal Stamping</option>
                    <option value="Opto">Optoelectronics</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={selectedVerification}
                    onChange={(e) => setSelectedVerification(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending Audit</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MOBILE CARDS VIEW */}
            <div className="divide-y divide-slate-800/80">
              {filteredSuppliers.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No suppliers matching search criteria.
                </div>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    onClick={() => setSelectedSupplier(supplier)}
                    className="p-3 bg-slate-900/90 hover:bg-slate-800/50 space-y-2.5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-extrabold text-emerald-400 text-xs flex-shrink-0">
                          {supplier.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-white text-xs flex items-center gap-1 min-w-0">
                            <span className="truncate">{supplier.name}</span>
                            {supplier.approvedVendor && (
                              <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-bold border border-emerald-500/30 flex-shrink-0">
                                AVL
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{supplier.sector} · {supplier.location}</div>
                        </div>
                      </div>
                      {supplier.verificationStatus === "verified" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full font-bold text-[9px] flex-shrink-0">
                          <ShieldCheck size={10} />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-full font-medium text-[9px] flex-shrink-0">
                          <Clock size={10} />
                          Pending
                        </span>
                      )}
                    </div>

                    {/* Compact Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950/70 rounded-xl p-2 border border-slate-800/80 text-[10px]">
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase font-semibold">Carbon Intensity</div>
                        <div className="font-mono text-xs font-bold text-emerald-400 mt-0.5">{supplier.carbonIntensity}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase font-semibold">Annual Scope 3</div>
                        <div className="font-semibold text-slate-200 mt-0.5">{supplier.annualEmissions}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase font-semibold">Grid Dependency</div>
                        <div className="text-slate-300 mt-0.5 truncate">{supplier.gridDependency}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase font-semibold">CBAM Compliance</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-10 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${supplier.cbamCompliance}%` }} />
                          </div>
                          <span className="font-bold text-white text-[9px]">{supplier.cbamCompliance}%</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSupplier(supplier);
                      }}
                      className="w-full py-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-[#0F172A] text-slate-200 font-bold rounded-xl text-xs transition-all border border-slate-700 flex items-center justify-center gap-1"
                    >
                      <span>View Profile & TNB Audit</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* DESKTOP DATA TABLE */}
            <div className="hidden overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Supplier Name & Sub-sector</th>
                    <th className="py-3.5 px-4">Verification Status</th>
                    <th className="py-3.5 px-4">Grid Dependency</th>
                    <th className="py-3.5 px-4">Carbon Intensity</th>
                    <th className="py-3.5 px-4">Annual Emissions</th>
                    <th className="py-3.5 px-4">CBAM Ready</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSuppliers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-500">
                        No suppliers matching search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredSuppliers.map((supplier) => (
                      <tr
                        key={supplier.id}
                        onClick={() => setSelectedSupplier(supplier)}
                        className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 flex-shrink-0 group-hover:border-emerald-500/50 transition-colors">
                              {supplier.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                                {supplier.name}
                                {supplier.approvedVendor && (
                                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-medium border border-emerald-500/30">
                                    AVL
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-400 text-[11px] mt-0.5">
                                {supplier.sector}
                              </div>
                              <div className="text-slate-500 text-[10px]">
                                {supplier.location}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          {supplier.verificationStatus === "verified" ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full font-semibold text-[11px]">
                              <ShieldCheck size={13} className="text-emerald-400" />
                              <span>Verified</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full font-medium text-[11px]">
                              <Clock size={13} />
                              <span>Pending OCR</span>
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4 font-medium text-slate-200">
                          {supplier.gridDependency}
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-mono text-xs font-semibold text-white bg-slate-800 px-2 py-1 rounded border border-slate-700">
                            {supplier.carbonIntensity}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-semibold text-slate-200">
                          {supplier.annualEmissions}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  supplier.cbamCompliance > 90
                                    ? "bg-emerald-500"
                                    : "bg-amber-500"
                                }`}
                                style={{ width: `${supplier.cbamCompliance}%` }}
                              />
                            </div>
                            <span className="font-bold text-white text-[11px]">
                              {supplier.cbamCompliance}%
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSupplier(supplier);
                            }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-[#0F172A] text-slate-200 font-semibold rounded-lg text-xs transition-all border border-slate-700 flex items-center gap-1 ml-auto"
                          >
                            <span>View Profile</span>
                            <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 sm:p-4 bg-slate-950/40 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
              <div>
                Showing <span className="text-white font-bold">{filteredSuppliers.length}</span> of{" "}
                <span className="text-white font-bold">{suppliers.length}</span> registered E&E suppliers
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">
                  Cryptographic TNB Bill Verification Engine · Powered by DataBridge
                </span>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: REPORTS & COMPLIANCE SECTION */}
        {activeTab === "reports" && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5">
            <div>
              <h3 className="text-xs sm:text-base font-bold text-white flex items-center gap-2">
                <FileText size={18} className="text-emerald-400 flex-shrink-0" />
                <span>EU CBAM & ISSB S2 Corporate Reports</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
                Automated corporate disclosures for European Union Customs authorities and global stock exchanges.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-1">
              {[
                {
                  title: "EU CBAM Semiconductor Declaration 2025",
                  desc: "Includes verified TNB electricity grid factors and embedded carbon per unit.",
                  format: "XML / PDF Audit Package",
                  size: "4.2 MB",
                },
                {
                  title: "ISSB S2 Scope 3 E&E Supply Chain Report",
                  desc: "Complete Category 1 purchased goods inventory across all Malaysian Tier-2 SMEs.",
                  format: "XBRL / PDF",
                  size: "8.1 MB",
                },
                {
                  title: "Apple Clean Energy / RE100 Audit Log",
                  desc: "Renewable energy certificates and rooftop solar generation logs.",
                  format: "CSV / PDF Package",
                  size: "2.9 MB",
                },
              ].map((rep, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white mb-1 leading-snug">{rep.title}</div>
                    <div className="text-[11px] text-slate-300 leading-relaxed">{rep.desc}</div>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-700/60">
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-950/60 px-2 py-0.5 rounded border border-slate-700/50 truncate max-w-[160px]">
                      {rep.format}
                    </span>
                    <button
                      onClick={() => toast.success(`Downloading ${rep.title}`)}
                      className="px-3 py-1.5 bg-emerald-500 text-[#0F172A] font-extrabold text-xs rounded-lg flex items-center gap-1.5 hover:bg-emerald-400 transition-colors shadow-sm shadow-emerald-500/20 flex-shrink-0"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ─── 4. SUPPLIER DETAIL MODAL / SLIDE-OUT PANEL ─── */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div
            className="bg-[#0F172A] border border-slate-700 rounded-2xl sm:rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-4 sm:my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 to-[#0F2942] border-b border-slate-800 flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-base sm:text-lg flex-shrink-0">
                  {selectedSupplier.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-base sm:text-xl font-extrabold text-white truncate">
                      {selectedSupplier.name}
                    </h3>
                    {selectedSupplier.verificationStatus === "verified" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-bold rounded-full border border-emerald-500/30 whitespace-nowrap">
                        <ShieldCheck size={11} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-medium truncate">
                    {selectedSupplier.sector} · {selectedSupplier.location}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                    TNB Account No: {selectedSupplier.tnbAccountNo}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSupplier(null)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-full hover:bg-slate-700 transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[70vh] sm:max-h-[75vh] overflow-y-auto">
              {/* Overview */}
              <div>
                <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                  Company Overview & E&E Capabilities
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  {selectedSupplier.description}
                </p>
              </div>

              {/* Grid Metrics & Intensity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-medium">
                    Carbon Intensity
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">
                    {selectedSupplier.carbonIntensity}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    12% below grid benchmark
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-medium">
                    Monthly Power Usage
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                    {selectedSupplier.monthlyPowerKWh}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    TNB Smart Sub-metered
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-medium">
                    Grid Dependency
                  </div>
                  <div className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5">
                    {selectedSupplier.gridDependency}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Direct TNB Tariff E1/E2
                  </div>
                </div>
              </div>

              {/* Cryptographic Proof Section */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Lock size={15} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-white truncate">
                      Immutable TNB Utility Bill Audit Trail
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded flex-shrink-0">
                    SHA-256
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] sm:text-[11px] text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="min-w-0 break-all">
                    <span className="text-slate-500">Hash: </span>
                    <span className="text-emerald-400 font-semibold">
                      {selectedSupplier.cryptographicHash}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowHashInspector(true)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-sans font-bold rounded flex items-center gap-1 transition-colors flex-shrink-0 self-end sm:self-auto"
                  >
                    <Eye size={12} />
                    Inspect Bill
                  </button>
                </div>

                <div className="text-[10px] sm:text-[11px] text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                  <span>Last verified via WhatsApp OCR: {selectedSupplier.lastAuditDate}</span>
                  <button
                    onClick={() =>
                      toast.success(
                        `TNB Verification Certificate for ${selectedSupplier.name} downloaded.`
                      )
                    }
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Download size={12} /> Download TNB Proof
                  </button>
                </div>
              </div>

              {/* Capabilities List */}
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Verified Manufacturing Infrastructure
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedSupplier.capabilities.map((cap, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800/80"
                    >
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer CTAs */}
            <div className="p-6 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={(e) => toggleApprovedVendor(selectedSupplier.id, e)}
                className={`w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-2 ${
                  selectedSupplier.approvedVendor
                    ? "bg-slate-800 border-emerald-500/40 text-emerald-400 hover:bg-slate-700"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <CheckSquare size={16} />
                <span>
                  {selectedSupplier.approvedVendor
                    ? "On Approved Vendor List"
                    : "Add to Approved Vendor List"}
                </span>
              </button>

              <button
                onClick={() => handleInitiateContract(selectedSupplier)}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Sparkles size={16} />
                <span>Initiate Procurement Contract</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CRYPTOGRAPHIC HASH INSPECTOR DIALOG ─── */}
      {showHashInspector && selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="text-emerald-400" size={18} />
                <h4 className="text-sm font-bold text-white">
                  TNB Bill Cryptographic Verification Block
                </h4>
              </div>
              <button
                onClick={() => setShowHashInspector(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">Issuer</div>
                <div className="text-white font-bold">Tenaga Nasional Berhad (TNB) Malaysia</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">TNB Account Number</div>
                <div className="text-emerald-400 font-mono font-bold">
                  {selectedSupplier.tnbAccountNo}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">SHA-256 Block Digest</div>
                <div className="text-xs text-emerald-400 font-mono break-all mt-1">
                  {selectedSupplier.cryptographicHash}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase">OCR Extraction Score</div>
                  <div className="text-white font-bold">99.8% High Confidence</div>
                </div>
                <div className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                  Validated
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHashInspector(false)}
                className="px-4 py-2 bg-emerald-500 text-[#0F172A] font-bold text-xs rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
