import React from "react";
import { Wifi, BatteryCharging, Home, Camera, FileText, Settings } from "lucide-react";

interface MobileContainerProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  reportCount?: number;
}

export default function MobileContainer({
  children,
  activeTab,
  onTabChange,
  reportCount = 0,
}: MobileContainerProps) {
  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const navTabs = [
    { id: "home", label: "Home", Icon: Home },
    { id: "scanner", label: "Scan Bill", Icon: Camera, highlight: true },
    { id: "reports", label: "Reports", Icon: FileText, badge: reportCount },
    { id: "settings", label: "Settings", Icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-0 md:p-6 font-sans">
      {/* Outer Shell for Desktop Preview (looks like a sleek mobile device) */}
      <div className="w-full max-w-md bg-slate-900 md:rounded-[40px] md:border-[8px] md:border-slate-800 md:shadow-2xl overflow-hidden flex flex-col h-screen md:h-[840px] relative">
        
        {/* Mobile Status Bar */}
        <div className="bg-slate-900 px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-400 font-medium select-none z-50 border-b border-slate-800/50">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <span>{currentTime}</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
              MY E&E
            </span>
          </div>

          {/* Notch / Camera Hole Indicator */}
          <div className="w-16 h-3 bg-slate-800 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-950" />
          </div>

          <div className="flex items-center gap-2">
            <Wifi size={13} className="text-slate-400" />
            <BatteryCharging size={14} className="text-emerald-400" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-900 scrollbar-none relative pb-20">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-4 py-2 flex items-center justify-around z-40">
          {navTabs.map((tab) => {
            const IconComponent = tab.Icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                  isActive
                    ? tab.highlight
                      ? "bg-emerald-500 text-slate-950 font-bold px-4 py-1.5 shadow-lg shadow-emerald-500/20 scale-105"
                      : "text-emerald-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <IconComponent
                  size={tab.highlight && isActive ? 20 : 18}
                  className={isActive && !tab.highlight ? "text-emerald-400" : ""}
                />
                <span className="text-[10px] tracking-tight mt-1">
                  {tab.label}
                </span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
