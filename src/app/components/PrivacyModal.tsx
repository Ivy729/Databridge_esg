import React, { useState } from "react";
import { ShieldCheck, Lock, CheckCircle2, Server, FileText } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function PrivacyModal({ isOpen, onAccept, onDecline }: PrivacyModalProps) {
  const [agreed, setAgreed] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Privacy & Bill Data Consent</h3>
            <p className="text-xs text-slate-400">Malaysian SME Carbon Protocol</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80 mb-4">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Minimal Data Processing:</strong> Only electricity bill details (kWh, billing date, account number) are extracted to calculate Scope 1/2 emissions.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <Lock size={15} className="text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Encrypted Data in Transit:</strong> All data is transmitted over secure HTTPS/TLS and processed in-memory for AI OCR extraction.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <Server size={15} className="text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Malaysia Cloud Ready:</strong> Architecture designed for future hosting on AWS ap-southeast-3 (Malaysia Region).
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer mb-5 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500/20 w-4 h-4"
          />
          <span>I agree to process bill data for carbon calculation & PDF report generation.</span>
        </label>

        <div className="flex gap-2">
          <button
            onClick={onDecline}
            className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!agreed}
            onClick={onAccept}
            className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-500/20"
          >
            Proceed to Scan
          </button>
        </div>
      </div>
    </div>
  );
}
