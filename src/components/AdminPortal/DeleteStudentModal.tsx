import React from 'react';
import { Trash2, AlertTriangle, X, CheckCircle2, User, FileText } from 'lucide-react';
import { Student } from '../../types';
import { StorageService } from '../../services/storage';

interface DeleteStudentModalProps {
  student: Student;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export const DeleteStudentModal: React.FC<DeleteStudentModalProps> = ({
  student,
  onClose,
  onConfirmDelete,
}) => {
  const submissions = StorageService.getSubmissions().filter((s) => s.studentId === student.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-rose-950">
                Hapus Akun Siswa
              </h2>
              <p className="text-[11px] text-rose-700">
                Konfirmasi penghapusan data siswa terdaftar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Warning banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-[11px] leading-relaxed">
              <p className="font-bold text-amber-950">
                Tindakan ini tidak dapat dibatalkan!
              </p>
              <p>
                Akun siswa <strong>{student.name}</strong> akan dihapus permanen. Siswa tidak akan dapat login lagi menggunakan nama dan tanggal lahirnya.
              </p>
            </div>
          </div>

          {/* Student details card */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl ${
                  student.avatarColor || 'bg-slate-700'
                } text-white flex items-center justify-center font-bold text-base shrink-0`}
              >
                {student.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{student.name}</h4>
                <p className="text-[11px] text-slate-500">
                  NISN: {student.nisn} • Kelas: {student.class}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Status Akun:</span>
                <span
                  className={`font-semibold inline-flex items-center gap-1 ${
                    student.status === 'active' ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {student.status === 'active' ? '● Aktif' : '● Tidak Aktif'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Tugas Terkumpul:</span>
                <span className="font-bold text-indigo-900 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-indigo-600" />
                  {submissions.length} Pengumpulan
                </span>
              </div>
            </div>
          </div>

          {student.status === 'inactive' && (
            <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Akun ini saat ini berstatus tidak aktif dan aman untuk dibersihkan.</span>
            </p>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirmDelete}
              className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
            >
              <Trash2 className="w-4 h-4" />
              <span>Ya, Hapus Akun</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
