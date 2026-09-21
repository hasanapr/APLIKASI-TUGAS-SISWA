import React from 'react';
import { X, ShieldCheck, GraduationCap, Folder, CheckCircle2, ArrowRight, Smartphone, Sparkles, Copy, Users } from 'lucide-react';
import { StorageService } from '../services/storage';
import { TeacherAccount } from '../types';

interface QuickGuideModalProps {
  onClose: () => void;
  onSelectStudentDemo: (name: string, birthDate: string) => void;
  onSelectAdminDemo: (teacher?: TeacherAccount) => void;
  appLogo?: string;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({
  onClose,
  onSelectStudentDemo,
  onSelectAdminDemo,
  appLogo,
}) => {
  const teachers = StorageService.getTeachers();
  const activeTeacher = StorageService.getActiveTeacher();
  const students = StorageService.getStudents();
  const logoSrc = appLogo || StorageService.getAppLogo();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
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
            <div>
              <h2 className="text-xs sm:text-sm font-bold leading-tight">Panduan Portal Spensadil</h2>
              <p className="text-[10px] text-indigo-200">SMP N 1 Adiluwih Pringsewu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-700">
          {/* Flow Overview */}
          <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Alur Integrasi Portal Siswa & Portal Guru:</span>
            </h3>
            <div className="space-y-1.5 text-blue-800 leading-relaxed text-[11px]">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  <strong>Guru Mata Pelajaran</strong> masuk ke <strong>Portal Guru Spensadil</strong> dengan akun masing-masing untuk membuat folder tugas dan mengelola siswa.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  <strong>Siswa</strong> masuk ke <strong>Portal Siswa Spensadil</strong> menggunakan <strong>Nama Siswa</strong> (Username) dan <strong>Tanggal Lahir</strong> (Password, format DD-MM-YYYY).
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  Siswa memilih folder tugas sesuai kelas & mata pelajarannya, mengunggah berkas tugas (PDF/Foto), lalu menekan tombol <strong>Kirim Tugas</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <p>
                  Guru memeriksa berkas tugas siswa, memberikan nilai (0-100) dan catatan evaluasi, yang langsung otomatis tampil di dashboard siswa!
                </p>
              </div>
            </div>
          </div>

          {/* Teacher Credentials Quick Pick */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Akun Guru Spensadil ({teachers.length} Guru)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Klik untuk login langsung</span>
            </div>

            <div className="space-y-1.5">
              {teachers.map((t) => {
                const isCurrent = t.id === activeTeacher.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectAdminDemo(t);
                      onClose();
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between border ${
                      isCurrent
                        ? 'bg-indigo-50/70 border-indigo-300'
                        : 'bg-slate-50 hover:bg-indigo-50/50 border-slate-200/80 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl ${
                          t.avatarColor || 'bg-indigo-600'
                        } text-white flex items-center justify-center font-bold text-xs shrink-0`}
                      >
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900 text-xs">{t.name}</p>
                          {isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {t.subject} • User:{' '}
                          <strong className="text-indigo-900 font-mono">{t.username}</strong> | Pass:{' '}
                          <strong className="text-indigo-900 font-mono">{t.password}</strong>
                        </p>
                      </div>
                    </div>
                    <span className="text-indigo-600 font-semibold text-[11px] flex items-center gap-0.5 shrink-0">
                      Masuk <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Credentials Quick Pick */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Daftar Siswa untuk Login Cepat</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Klik nama untuk login</span>
            </div>

            <div className="space-y-1.5">
              {students.slice(0, 5).map((std) => (
                <div
                  key={std.id}
                  onClick={() => {
                    onSelectStudentDemo(std.name, std.birthDate);
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between border ${
                    std.status === 'inactive'
                      ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                      : 'bg-slate-50 hover:bg-blue-50 border-slate-200/80 hover:border-blue-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-slate-900 text-xs">{std.name}</p>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          std.status === 'inactive'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {std.status === 'inactive' ? 'Tidak Aktif' : 'Aktif'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Kelas: {std.class} • Tanggal Lahir (Password):{' '}
                      <span className="font-mono text-blue-700 font-semibold">{std.birthDate}</span>
                    </p>
                  </div>
                  <span className="text-blue-600 font-semibold text-[11px] flex items-center gap-0.5 shrink-0">
                    Masuk <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
