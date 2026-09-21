import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  BookOpen,
  KeyRound,
  Copy,
  CheckCircle2,
  Edit2,
  Trash2,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Phone,
  FolderCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import { TeacherAccount, AssignmentFolder } from '../../types';

interface TeacherListTabProps {
  teachers: TeacherAccount[];
  activeTeacher: TeacherAccount;
  folders: AssignmentFolder[];
  onOpenAddTeacher: () => void;
  onOpenEditTeacher: (teacher: TeacherAccount) => void;
  onSwitchTeacher: (teacher: TeacherAccount) => void;
  onDeleteTeacher: (teacher: TeacherAccount) => void;
  showToast: (msg: string) => void;
}

export const TeacherListTab: React.FC<TeacherListTabProps> = ({
  teachers,
  activeTeacher,
  folders,
  onOpenAddTeacher,
  onOpenEditTeacher,
  onSwitchTeacher,
  onDeleteTeacher,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const availableSubjects = Array.from(new Set(teachers.map((t) => t.subject)));

  const filteredTeachers = teachers.filter((t) => {
    if (subjectFilter !== 'all' && t.subject !== subjectFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.username.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      (t.nip && t.nip.toLowerCase().includes(q))
    );
  });

  const handleCopyCredentials = (teacher: TeacherAccount) => {
    const text = `Akun Guru Spensadil\nNama: ${teacher.name}\nMapel: ${teacher.subject}\nUsername: ${teacher.username}\nPassword: ${teacher.password}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(teacher.id);
    showToast(`Kredensial login ${teacher.name} disalin!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Search and Add Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama guru, mapel, atau username..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        <button
          onClick={onOpenAddTeacher}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 shrink-0 transition active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Guru</span>
        </button>
      </div>

      {/* Subject Filter Bar */}
      {availableSubjects.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSubjectFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              subjectFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Semua Mapel ({teachers.length})
          </button>
          {availableSubjects.map((sub) => {
            const count = teachers.filter((t) => t.subject === sub).length;
            return (
              <button
                key={sub}
                onClick={() => setSubjectFilter(sub)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  subjectFilter === sub
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {sub} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Multi-Teacher Info Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-3.5 text-xs text-indigo-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-bold text-indigo-950">Multi-Akun Guru SMP N 1 Adiluwih</p>
          <p className="mt-0.5 text-indigo-800 text-[11px]">
            Setiap guru mata pelajaran memiliki akun login tersendiri. Anda dapat berganti akun kapan saja dengan menekan tombol <strong>"Ganti ke Guru Ini"</strong> di bawah.
          </p>
        </div>
      </div>

      {/* Teachers List */}
      <div className="space-y-3">
        {filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada data guru yang cocok</p>
            <p className="text-xs text-slate-400 mt-1">
              Coba gunakan kata kunci pencarian lain atau klik "+ Tambah Guru" untuk mendaftarkan guru baru.
            </p>
          </div>
        ) : (
          filteredTeachers.map((teacher) => {
            const isCurrent = teacher.id === activeTeacher.id;
            const teacherFolderCount = folders.filter((f) => f.teacherId === teacher.id).length;

            return (
              <div
                key={teacher.id}
                className={`bg-white rounded-2xl border p-4 shadow-2xs transition space-y-3 ${
                  isCurrent
                    ? 'border-indigo-500 ring-2 ring-indigo-500/10'
                    : 'border-slate-200/90 hover:border-indigo-200 hover:shadow-xs'
                }`}
              >
                {/* Header: Avatar, Name, Subject, Role */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl ${
                        teacher.avatarColor || 'bg-indigo-600'
                      } text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0`}
                    >
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-900 leading-snug">
                          {teacher.name}
                        </h3>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Sedang Aktif
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded">
                          {teacher.subject}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                            teacher.role === 'admin'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {teacher.role === 'admin' ? 'Admin Sekolah' : 'Guru Mata Pelajaran'}
                        </span>
                      </div>

                      {teacher.nip && (
                        <p className="text-[11px] text-slate-500 mt-1">
                          NIP: <span className="font-mono text-slate-700">{teacher.nip}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onOpenEditTeacher(teacher)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                      title="Edit data guru"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTeacher(teacher)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Hapus akun guru"
                      disabled={isCurrent}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Login Credentials Box */}
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between text-xs font-mono">
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-slate-600">
                      User: <strong className="text-indigo-900">{teacher.username}</strong>
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Pass: <strong className="text-indigo-900">{teacher.password}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyCredentials(teacher)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition flex items-center gap-1 text-[11px] font-sans font-medium cursor-pointer"
                    title="Salin Kredensial Login"
                  >
                    {copiedId === teacher.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bottom stats and switch button */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <FolderCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{teacherFolderCount} Folder Tugas dibuat</span>
                  </span>

                  {!isCurrent ? (
                    <button
                      onClick={() => onSwitchTeacher(teacher)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>Ganti ke Guru Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Akun Aktif Sekarang
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
