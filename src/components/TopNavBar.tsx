import React from 'react';
import { GraduationCap, ShieldCheck, HelpCircle, Smartphone, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { AppPortal, Student, AdminAccount } from '../types';

interface TopNavBarProps {
  currentPortal: AppPortal;
  onChangePortal: (portal: AppPortal) => void;
  activeStudent: Student | null;
  isAdminLoggedIn: boolean;
  adminAccount: AdminAccount;
  onOpenGuide: () => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  appLogo?: string;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentPortal,
  onChangePortal,
  activeStudent,
  isAdminLoggedIn,
  adminAccount,
  onOpenGuide,
  isFrameMode,
  onToggleFrameMode,
  appLogo,
}) => {
  const logoSrc = appLogo || '/spensadil_logo.png';

  return (
    <header className="bg-slate-950/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg z-30 sticky top-0">
      {/* Top micro bar for global switcher */}
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between text-xs border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-white p-1 shadow-sm ring-1 ring-white/20 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={logoSrc}
              alt="Logo Spensadil"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/spensadil_logo.png';
              }}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-white text-xs leading-none font-display">
                SPENSADIL
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
                OFFICIAL
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline leading-tight mt-0.5">
              SMP N 1 Adiluwih Pringsewu • Android Task Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 transition text-xs font-medium cursor-pointer shadow-xs active:scale-95"
            title="Petunjuk Penggunaan & Akun Demo"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">Panduan Akun</span>
          </button>

          <button
            onClick={onToggleFrameMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 transition text-xs font-medium cursor-pointer shadow-xs active:scale-95"
            title={isFrameMode ? 'Perbesar ke Layar Penuh' : 'Mode Frame Android HP'}
          >
            {isFrameMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden xs:inline">Layar Penuh</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden xs:inline">Frame HP</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Portal Switcher Segmented Control */}
      <div className="max-w-6xl mx-auto p-2.5 px-4 flex items-center justify-between gap-3">
        <div className="flex-1 max-w-lg bg-slate-900/90 p-1 rounded-2xl flex items-center gap-1 border border-white/10 shadow-inner">
          <button
            onClick={() => onChangePortal('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentPortal === 'student'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-blue-200 shrink-0" />
            <span className="truncate">Portal Siswa Spensadil</span>
            {activeStudent && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ring-2 ring-emerald-950 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => onChangePortal('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentPortal === 'admin'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-200 shrink-0" />
            <span className="truncate">Portal Guru Spensadil</span>
            {isAdminLoggedIn && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ring-2 ring-emerald-950 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Current status pill */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-900/70 px-3.5 py-2 rounded-xl border border-white/10 shadow-xs">
          {currentPortal === 'student' ? (
            activeStudent ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse"></span>
                <span>Siswa: <strong className="text-white font-semibold">{activeStudent.name}</strong> <span className="text-slate-400">({activeStudent.class})</span></span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span className="text-slate-400">Siswa belum login</span>
              </>
            )
          ) : isAdminLoggedIn ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse"></span>
              <span>Guru: <strong className="text-white font-semibold">{adminAccount.name || adminAccount.username}</strong></span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              <span className="text-slate-400">Guru belum login</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
