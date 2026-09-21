import React, { useState } from 'react';
import { User, Lock, AlertCircle, ArrowRight, Info, KeyRound, Check, GraduationCap, School } from 'lucide-react';
import { AdminAccount, TeacherAccount } from '../../types';
import { StorageService } from '../../services/storage';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onSwitchToStudent: () => void;
  adminAccount: AdminAccount;
  appLogo?: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onSwitchToStudent,
  appLogo,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const registeredTeachers = StorageService.getTeachers();
  const activeLogo = appLogo || StorageService.getAppLogo();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Silakan masukkan username dan password akun guru.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const teacher = StorageService.verifyTeacherLogin(username, password);
      setIsLoading(false);

      if (teacher) {
        onLoginSuccess();
      } else {
        setErrorMessage(
          'Username atau password salah. Pastikan Anda memasukkan username dan password guru yang terdaftar.'
        );
      }
    }, 300);
  };

  const handleSelectTeacher = (teacher: TeacherAccount) => {
    setUsername(teacher.username);
    setPassword(teacher.password);
    setErrorMessage('');
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-4 py-8 max-w-md mx-auto w-full">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-3.5">
          <div className="w-22 h-22 rounded-3xl bg-white p-2.5 shadow-xl shadow-indigo-500/10 ring-1 ring-slate-900/5 border border-slate-100 flex items-center justify-center mx-auto transition-transform hover:scale-105 overflow-hidden">
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
          <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-indigo-700 to-violet-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md ring-2 ring-white">
            GURU
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">Portal Guru Spensadil</h1>
        <p className="text-sm font-semibold text-slate-700 mt-1">
          SMP N 1 Adiluwih Pringsewu
        </p>
        <p className="text-xs text-indigo-600 font-medium mt-0.5">
          Kelola Folder Tugas, Penilaian, dan Akun Guru
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xl shadow-slate-200/50">
        {/* Multi-teacher note */}
        <div className="mb-4 bg-gradient-to-r from-indigo-50 to-purple-50/50 border border-indigo-100/80 rounded-2xl p-3.5 text-xs text-indigo-950 flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Info className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-bold text-indigo-950">Dukungan Multi-Akun Guru:</p>
            <p className="mt-0.5 text-indigo-800 leading-relaxed">
              Setiap guru dapat masuk dengan username & password masing-masing untuk mengelola folder tugas mata pelajaran sendiri.
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
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Username Guru / Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: admin / budi / siti"
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4 text-indigo-600" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password akun guru"
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Masuk ke Portal Guru</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick select teacher demo account */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pilih Cepat Akun Guru untuk Demo:</span>
          </p>
          <div className="grid grid-cols-1 gap-1.5 max-h-52 overflow-y-auto pr-1">
            {registeredTeachers.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTeacher(t)}
                className={`text-left p-2.5 rounded-2xl border transition flex items-center justify-between cursor-pointer group ${
                  username.toLowerCase() === t.username.toLowerCase()
                    ? 'border-indigo-500 bg-indigo-50/80 text-indigo-950 font-bold shadow-xs'
                    : 'border-slate-200/80 hover:border-indigo-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`w-8 h-8 rounded-xl ${
                      t.avatarColor || 'bg-indigo-600'
                    } text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-xs text-slate-900 group-hover:text-indigo-950 truncate leading-tight">{t.name}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {t.subject} • User: <span className="font-mono text-indigo-600 font-semibold">{t.username}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-indigo-600 shrink-0 ml-1 shadow-2xs group-hover:border-indigo-300">
                  Pilih
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Switch to Student link */}
      <div className="text-center mt-5">
        <p className="text-xs text-slate-500">
          Ingin mengumpulkan tugas sebagai siswa?{' '}
          <button
            onClick={onSwitchToStudent}
            className="text-indigo-600 font-bold hover:underline cursor-pointer"
          >
            Buka Portal Siswa di sini
          </button>
        </p>
      </div>
    </div>
  );
};
