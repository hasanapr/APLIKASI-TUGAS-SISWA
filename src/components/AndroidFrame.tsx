import React, { ReactNode } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface AndroidFrameProps {
  children: ReactNode;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  currentTime?: string;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isFrameMode,
  onToggleFrameMode,
  currentTime = '09:41',
}) => {
  if (!isFrameMode) {
    return (
      <div className="w-full min-h-screen bg-slate-950/60 flex flex-col items-center">
        <div className="w-full max-w-4xl min-h-screen bg-slate-50 shadow-2xl flex flex-col relative border-x border-slate-200/80">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black py-8 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background ambient lighting accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Device Frame Viewport - Modern Titanium Bezel */}
      <div className="relative w-full max-w-[412px] h-[870px] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 rounded-[52px] p-[10px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/15 ring-offset-4 ring-offset-slate-950 flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Android Physical Bezel Details - Top Speaker Ear-piece */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-700/80 rounded-full z-50 pointer-events-none"></div>

        {/* Android Screen Container */}
        <div className="w-full h-full bg-slate-50 rounded-[42px] overflow-hidden flex flex-col relative shadow-inner">
          
          {/* Android Status Bar */}
          <div className="h-10 bg-slate-950 text-slate-200 px-6 flex items-center justify-between text-xs font-semibold select-none z-40 shrink-0 border-b border-white/5">
            <span className="font-mono tracking-tight font-bold text-slate-100">{currentTime}</span>

            {/* Central Punch Hole Camera */}
            <div className="w-4 h-4 rounded-full bg-black ring-2 ring-slate-900/90 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-950"></div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold text-slate-200">98%</span>
                <BatteryMedium className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* App Content Area */}
          <div className="flex-1 overflow-y-auto relative flex flex-col bg-slate-50">
            {children}
          </div>

          {/* Android Navigation Bar / Gesture Pill */}
          <div className="h-6 bg-slate-950 flex items-center justify-center shrink-0 z-40 select-none border-t border-white/5">
            <div className="w-28 h-1 bg-slate-400/80 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Frame Mode Helper Caption */}
      <div className="mt-5 flex items-center gap-3 text-xs text-slate-400 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
        <span className="flex items-center gap-1.5 font-medium text-slate-300">
          <Smartphone className="w-4 h-4 text-blue-400" />
          Simulasi Layar Android Mobile (390 x 844 px)
        </span>
        <span className="text-slate-600">•</span>
        <button
          onClick={onToggleFrameMode}
          className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Beralih ke Layar Penuh
        </button>
      </div>
    </div>
  );
};
