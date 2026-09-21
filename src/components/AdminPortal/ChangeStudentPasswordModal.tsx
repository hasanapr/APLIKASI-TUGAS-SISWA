import React, { useState } from 'react';
import { X, KeyRound, Eye, EyeOff, Sparkles, RotateCcw, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { Student } from '../../types';
import { StorageService } from '../../services/storage';

interface ChangeStudentPasswordModalProps {
  student: Student;
  onClose: () => void;
  onSuccess: (updatedStudent: Student, message: string) => void;
}

export const ChangeStudentPasswordModal: React.FC<ChangeStudentPasswordModalProps> = ({
  student,
  onClose,
  onSuccess,
}) => {
  const currentEffectivePassword = student.customPassword || student.birthDate;
  const isUsingCustom = Boolean(student.customPassword);

  const [passwordInput, setPasswordInput] = useState<string>(student.customPassword || '');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const generateRandomPassword = () => {
    // Generate simple readable password for middle school students
    const cleanFirstName = student.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomNum = Math.floor(100 + Math.random() * 900);
    const generated = `${cleanFirstName}${randomNum}`;
    setPasswordInput(generated);
    setShowPassword(true);
    setError('');
  };

  const handleResetToBirthDate = () => {
    setPasswordInput('');
    setError('');
  };

  const handleCopyCredentials = (passValue: string) => {
    const text = `KREDENSIAL LOGIN SISWA SPENSADIL\nNama/Username: ${student.name}\nPassword: ${passValue}\nKelas: ${student.class}\nNISN: ${student.nisn}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passwordInput.trim();

    if (cleanPass.length > 0 && cleanPass.length < 4) {
      setError('Password kustom minimal terdiri dari 4 karakter agar aman.');
      return;
    }

    // If empty, it means reset to birthDate default
    const newCustomPassword = cleanPass.length > 0 ? cleanPass : undefined;
    StorageService.updateStudentPassword(student.id, newCustomPassword);

    const updatedStudents = StorageService.getStudents();
    const updated = updatedStudents.find((s) => s.id === student.id) || {
      ...student,
      customPassword: newCustomPassword,
    };

    const successMsg = newCustomPassword
      ? `Password siswa ${student.name} berhasil diubah menjadi: "${newCustomPassword}"`
      : `Password siswa ${student.name} dikembalikan ke Tanggal Lahir (${student.birthDate})`;

    onSuccess(updated, successMsg);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-900 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-700/60 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-indigo-200" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">Ubah Password Siswa</h3>
              <p className="text-[11px] text-indigo-200">Manajemen Akses Kredensial Login</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Student Profile Card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl ${
                  student.avatarColor || 'bg-indigo-600'
                } text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs`}
              >
                {student.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="font-bold text-xs text-slate-900 truncate">{student.name}</p>
                <p className="text-[10px] text-slate-500">
                  Kelas: <span className="font-semibold text-slate-700">{student.class}</span> • NISN: {student.nisn}
                </p>
              </div>
            </div>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                student.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {student.status === 'active' ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>

          {/* Current Active Password status */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">Password Login Saat Ini:</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white text-indigo-700 border border-indigo-200">
                {isUsingCustom ? 'Password Kustom' : 'Tanggal Lahir Bawaan'}
              </span>
            </div>
            <div className="flex items-center justify-between font-mono font-bold text-slate-800 text-sm">
              <span className="tracking-wide">{currentEffectivePassword}</span>
              <button
                type="button"
                onClick={() => handleCopyCredentials(currentEffectivePassword)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-sans font-medium flex items-center gap-1 cursor-pointer"
                title="Salin kredensial"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* New Password Input Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Password Baru Siswa
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Buat Otomatis</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setError('');
                }}
                placeholder="Kosongkan untuk pakai Tanggal Lahir"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
              *Jika diisi, siswa akan masuk menggunakan password baru ini. Jika dikosongkan, password akan kembali ke format tanggal lahir ({student.birthDate}).
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleResetToBirthDate}
              className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>Reset ke Tgl Lahir</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const standard = `spensadil${student.class.replace(/\s+/g, '').toLowerCase()}`;
                setPasswordInput(standard);
                setShowPassword(true);
              }}
              className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <span>Format Kelas</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Simpan Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
