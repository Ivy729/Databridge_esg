import React, { useState } from "react";
import { AppConfig } from "../lib/types";
import { Settings, Shield, Server, Lock, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface SettingsViewProps {
  config: AppConfig;
  onSaveConfig: (newConfig: AppConfig) => void;
}

export default function SettingsView({ config, onSaveConfig }: SettingsViewProps) {
  const [formConfig, setFormConfig] = useState<AppConfig>({ ...config });

  const handleSave = () => {
    onSaveConfig(formConfig);
    toast.success("Settings saved successfully!");
  };

  const handleResetDefaults = () => {
    const defaultConfig: AppConfig = {
      companyName: "Precision Microtech (M) Sdn Bhd",
      registrationNumber: "201801048821 (1298834-X)",
      facilityLocation: "Bayan Lepas Free Industrial Zone, Phase 4, 11900 Penang",
      sector: "E&E Manufacturing — SMT & PCB Assembly",
      gridEmissionFactor: 0.740,
      dieselFactor: 2.68,
      petrolFactor: 2.31,
      gasFactor: 1.90,
    };
    setFormConfig(defaultConfig);
    onSaveConfig(defaultConfig);
    toast.info("Reset to default grid emission factors (0.740 kg CO2e/kWh).");
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-xl font-black text-white">App Settings</h2>
        <p className="text-xs text-slate-400">Emission Factors & Company Profile</p>
      </div>

      {/* Grid Emission Factor Setting */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Grid Emission Factor Configuration</h3>
          </div>
          <button
            onClick={handleResetDefaults}
            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw size={10} /> Reset
          </button>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Update the grid emission factor when official Energy Commission Malaysia (ST) or SEDA figures change.
        </p>

        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Peninsular Malaysia TNB Grid Factor (kg CO2e / kWh)
          </label>
          <input
            type="number"
            step="0.001"
            value={formConfig.gridEmissionFactor}
            onChange={(e) =>
              setFormConfig({ ...formConfig, gridEmissionFactor: parseFloat(e.target.value) || 0.74 })
            }
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold font-mono text-emerald-400 focus:border-emerald-500 outline-none"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Default: 0.740 kg CO2e/kWh (Standard Peninsular Grid)
          </p>
        </div>
      </div>

      {/* Company Profile Settings */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-white">SME Company Profile</h3>

        <div className="space-y-2.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={formConfig.companyName}
              onChange={(e) => setFormConfig({ ...formConfig, companyName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Registration / SST Number
            </label>
            <input
              type="text"
              value={formConfig.registrationNumber}
              onChange={(e) => setFormConfig({ ...formConfig, registrationNumber: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Facility Address & Location
            </label>
            <input
              type="text"
              value={formConfig.facilityLocation}
              onChange={(e) => setFormConfig({ ...formConfig, facilityLocation: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2.5 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
        >
          <Save size={14} /> Save Profile Settings
        </button>
      </div>

      {/* Security & Data Residency Notice */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <Shield size={16} />
          <span>Security & Data Residency Architecture</span>
        </div>

        <div className="space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
          <div className="flex items-center gap-1.5">
            <Lock size={12} className="text-emerald-400 shrink-0" />
            <span>Encrypted in transit via HTTPS/TLS 1.3 protocol.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Server size={12} className="text-emerald-400 shrink-0" />
            <span>Designed for deployment on AWS ap-southeast-3 (Malaysia Region).</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield size={12} className="text-emerald-400 shrink-0" />
            <span>Malaysian PDPA compliance readiness architecture.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
