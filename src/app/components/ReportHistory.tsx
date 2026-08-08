import React from "react";
import { GeneratedReport } from "../lib/types";
import { downloadPDFReport } from "../lib/pdf";
import { Download, FileText, ShieldCheck, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ReportHistoryProps {
  reports: GeneratedReport[];
  onCreateNew: () => void;
}

export default function ReportHistory({ reports, onCreateNew }: ReportHistoryProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Carbon Reports</h2>
          <p className="text-xs text-slate-400">Traceable ISSB S1/S2 PDF Statements</p>
        </div>
        <button
          onClick={onCreateNew}
          className="py-2 px-3 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
        >
          + New Report
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 px-4 bg-slate-950/50 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <FileText size={24} />
          </div>
          <h3 className="text-sm font-bold text-white">No Carbon Reports Yet</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Scan your first TNB or Sarawak electricity bill to generate an audit-ready carbon report in under 2 minutes.
          </p>
          <button
            onClick={onCreateNew}
            className="py-2.5 px-4 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-emerald-400 transition-colors"
          >
            Create Carbon Report
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.reportId}
              className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 space-y-3 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{report.reportId}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                      <ShieldCheck size={10} /> Verified
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{report.reportingPeriod}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-400 font-mono">
                    {report.totalEmissionsTonnes.toFixed(3)} tCO2e
                  </div>
                  <div className="text-[10px] text-slate-500">{report.kwhConsumption.toLocaleString()} kWh</div>
                </div>
              </div>

              {/* SHA-256 Hash */}
              <div className="bg-slate-900/90 p-2 rounded-xl text-[10px] font-mono text-slate-400 flex items-center justify-between border border-slate-800">
                <span className="truncate max-w-[200px]">SHA-256: {report.integrityHash}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(report.integrityHash);
                    toast.success("SHA-256 Hash copied to clipboard!");
                  }}
                  className="text-emerald-400 font-sans hover:underline shrink-0 ml-2"
                >
                  Copy
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-slate-800/80">
                <button
                  onClick={() => downloadPDFReport(report)}
                  className="flex-1 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-emerald-500/20"
                >
                  <Download size={13} /> Download PDF
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Report: ${report.reportId} | Total: ${report.totalEmissionsTonnes} tCO2e | Hash: ${report.integrityHash}`);
                    toast.success("Report reference copied!");
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-slate-800"
                >
                  <Share2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
