import React, { useState } from 'react';
import { User, Calendar, Lock, AlertCircle, ArrowRight, Sparkles, CheckCircle2, Info, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Student } from '../../types';
import { StorageService } from '../../services/storage';

interface StudentLoginProps {
  onLoginSuccess: (student: Student) => void;
  onSwitchToAdmin: () => void;
  appLogo?: string;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({
  onLoginSuccess,
  onSwitchToAdmin,
  appLogo,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [birthDateInput, setBirthDateInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const registeredStudents = StorageService.getStudents();
  const activeLogo = appLogo || StorageService.getAppLogo();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nameInput.trim()) {
      setErrorMessage('Silakan masukkan nama lengkap siswa.');
      return;
    }

    if (!birthDateInput.trim()) {
      setErrorMessage('Silakan masukkan password atau tanggal lahir.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const authResult = StorageService.verifyStudentAuth(nameInput, birthDateInput);
      setIsLoading(false);

      if (authResult.status === 'success' && authResult.student) {
        StorageService.setActiveStudent(authResult.student);
        onLoginSuccess(authResult.student);
      } else if (authResult.status === 'inactive') {
        setErrorMessage(
          'Login ditolak: Akun siswa atas nama ini berstatus TIDAK AKTIF. Hubungi guru atau administrator sekolah untuk mengaktifkan kembali akun Anda.'
        );
      } else {
        setErrorMessage(
          'Login gagal: Nama siswa atau password tidak cocok. Pastikan nama lengkap dan password/tanggal lahir sesuai dengan data yang didaftarkan guru.'
        );
      }
    }, 300);
  };

  const fillQuickStudent = (student: Student) => {
    setNameInput(student.name);
    setBirthDateInput(student.customPassword || student.birthDate);
    setErrorMessage('');
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-4 py-8 max-w-md mx-auto w-full">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-3.5">
          <div className="w-22 h-22 rounded-3xl bg-white p-2.5 shadow-xl shadow-blue-500/10 ring-1 ring-slate-900/5 border border-slate-100 flex items-center justify-center mx-auto transition-transform hover:scale-105 overflow-hidden">
            <img
              src={activeLogo}
              alt="Logo SMP N 1 Adiluwih Pringsewu"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/spensadil_logo.png';
              }}
            />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md ring-2 ring-white">
            SISWA
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">Portal Siswa Spensadil</h1>
        <p className="text-sm font-semibold text-slate-700 mt-1">
          SMP N 1 Adiluwih Pringsewu
        </p>
        <p className="text-xs text-blue-600 font-medium mt-0.5">
          Aplikasi Pengumpulan Tugas Siswa Berbasis Android
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xl shadow-slate-200/50">
        <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/80 rounded-2xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Info className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-bold text-blue-950">Petunjuk Masuk Siswa:</p>
            <p className="mt-0.5 text-blue-800 leading-relaxed">
              Username: <strong className="text-blue-950">Nama Siswa</strong> • Password:{' '}
              <strong className="text-blue-950">Tanggal Lahir</strong> (YYYY-MM-DD) atau <strong className="text-blue-950">Password Baru</strong> dari guru.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-800 flex items-start gap-2.5 animate-shake">
            <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username (Nama Siswa) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Username (Nama Lengkap Siswa)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Contoh: Ahmad Fauzi"
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Password (Tanggal Lahir / Password Kustom) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password Siswa
              </label>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Tgl Lahir / Password Guru
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4 text-indigo-600" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={birthDateInput}
                onChange={(e) => setBirthDateInput(e.target.value)}
                placeholder="Tanggal lahir (YYYY-MM-DD) atau password baru"
                className="w-full pl-10 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
              Format default tanggal lahir: <span className="font-mono text-slate-700 font-semibold">2011-05-15</span>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Masuk ke Portal Siswa</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Fill Student Chips for Easy Evaluation */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilih Cepat Siswa Terdaftar (Uji Coba):</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {registeredStudents.slice(0, 3).map((std) => (
              <button
                key={std.id}
                type="button"
                onClick={() => fillQuickStudent(std)}
                className="w-full p-2.5 bg-slate-50 hover:bg-blue-50/80 hover:border-blue-200 border border-slate-200/80 rounded-2xl text-left transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className={`w-8 h-8 rounded-xl ${std.avatarColor || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                    {std.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-blue-900 truncate">
                      {std.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Kelas {std.class} • Pass: <span className="font-mono text-slate-700 font-semibold">{std.customPassword || std.birthDate}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-blue-600 rounded-lg shrink-0 shadow-2xs group-hover:border-blue-300">
                  Gunakan
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Switch to Teacher portal link */}
      <div className="text-center mt-5">
        <p className="text-xs text-slate-500">
          Anda seorang Guru atau Admin sekolah?{' '}
          <button
            onClick={onSwitchToAdmin}
            className="text-blue-600 font-bold hover:underline cursor-pointer"
          >
            Masuk Portal Guru di sini
          </button>
        </p>
      </div>
    </div>
  );
};
