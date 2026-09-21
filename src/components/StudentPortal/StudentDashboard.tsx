import React, { useState } from 'react';
import {
  Folder,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  Search,
  Filter,
  FileCheck,
  ChevronRight,
  BookOpen,
  Calendar,
  Award,
  Sparkles,
  Paperclip,
  TrendingUp,
} from 'lucide-react';
import { AssignmentFolder, Student, Submission } from '../../types';
import { StorageService } from '../../services/storage';
import { StudentSubmitModal } from './StudentSubmitModal';

interface StudentDashboardProps {
  student: Student;
  onLogout: () => void;
  appLogo?: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, onLogout, appLogo }) => {
  const [folders, setFolders] = useState<AssignmentFolder[]>(() => StorageService.getFolders());
  const [submissions, setSubmissions] = useState<Submission[]>(() => StorageService.getSubmissions());
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [activeFolderForSubmission, setActiveFolderForSubmission] = useState<AssignmentFolder | null>(null);

  const logoSrc = appLogo || StorageService.getAppLogo();

  const refreshData = () => {
    setFolders(StorageService.getFolders());
    setSubmissions(StorageService.getSubmissions());
  };

  // Filter folders relevant to this student's class (or "Semua Kelas")
  const studentFolders = folders.filter(
    (f) => f.targetClass === 'Semua Kelas' || f.targetClass === student.class
  );

  // Student's personal submissions
  const mySubmissions = submissions.filter((s) => s.studentId === student.id);
  const mySubmittedFolderIds = new Set(mySubmissions.map((s) => s.folderId));

  // Graded submissions calculation
  const gradedSubmissions = mySubmissions.filter((s) => s.grade !== undefined);
  const averageGrade =
    gradedSubmissions.length > 0
      ? (
          gradedSubmissions.reduce((acc, curr) => acc + (curr.grade || 0), 0) /
          gradedSubmissions.length
        ).toFixed(0)
      : '-';

  // Extract unique subjects
  const subjects = Array.from(new Set(studentFolders.map((f) => f.subject)));

  // Filter folders based on active tab and search
  const filteredFolders = studentFolders.filter((folder) => {
    const isSubmitted = mySubmittedFolderIds.has(folder.id);
    const sub = mySubmissions.find((s) => s.folderId === folder.id);
    const isGraded = sub && sub.grade !== undefined;

    if (activeFilter === 'pending' && isSubmitted) return false;
    if (activeFilter === 'submitted' && !isSubmitted) return false;
    if (activeFilter === 'graded' && !isGraded) return false;

    if (selectedSubject !== 'all' && folder.subject !== selectedSubject) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        folder.title.toLowerCase().includes(q) ||
        folder.subject.toLowerCase().includes(q) ||
        folder.description.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* Student Profile Card (Android style app header) */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white p-5 rounded-b-[32px] shadow-xl border-b border-white/10 relative overflow-hidden">
        {/* Subtle ambient light glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top school identity badge */}
        <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-xs overflow-hidden ring-1 ring-white/20">
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
            <span className="font-extrabold text-white tracking-tight font-display">Portal Siswa Spensadil</span>
            <span className="text-white/30">•</span>
            <span className="text-blue-200 text-[11px] hidden xs:inline">SMP N 1 Adiluwih</span>
          </div>

          <button
            onClick={onLogout}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-xl transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Keluar dari akun siswa"
          >
            <LogOut className="w-3.5 h-3.5 text-blue-300" />
            <span>Keluar</span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-13 h-13 rounded-2xl ${
                student.avatarColor || 'bg-blue-600'
              } text-white flex items-center justify-center font-black text-xl shadow-lg ring-2 ring-white/25`}
            >
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base text-white leading-tight font-display">{student.name}</h1>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold rounded-full">
                  Aktif
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                Kelas <span className="font-bold text-white bg-white/10 px-1.5 py-0.2 rounded-md">{student.class}</span> • NISN: {student.nisn}
              </p>
            </div>
          </div>
        </div>

        {/* KPI / Stats Row */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/10 hover:bg-white/10 transition">
            <span className="text-lg font-black text-white">{studentFolders.length}</span>
            <p className="text-[10px] font-semibold text-slate-300 leading-tight mt-0.5">Total Tugas</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/10 hover:bg-white/10 transition">
            <span className="text-lg font-black text-amber-400">
              {studentFolders.length - mySubmittedFolderIds.size}
            </span>
            <p className="text-[10px] font-semibold text-slate-300 leading-tight mt-0.5">Belum Kumpul</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/10 hover:bg-white/10 transition">
            <span className="text-lg font-black text-emerald-400">{mySubmittedFolderIds.size}</span>
            <p className="text-[10px] font-semibold text-slate-300 leading-tight mt-0.5">Sudah Kumpul</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/10 hover:bg-white/10 transition">
            <span className="text-lg font-black text-purple-300">{averageGrade}</span>
            <p className="text-[10px] font-semibold text-slate-300 leading-tight mt-0.5">Rata-Rata</p>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-3.5 flex-1">
        {/* Search & Subject Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tugas, judul, atau mata pelajaran..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              Semua ({studentFolders.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition cursor-pointer ${
                activeFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              Belum ({studentFolders.length - mySubmittedFolderIds.size})
            </button>
            <button
              onClick={() => setActiveFilter('submitted')}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition cursor-pointer ${
                activeFilter === 'submitted'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              Sudah Kumpul ({mySubmittedFolderIds.size})
            </button>
            <button
              onClick={() => setActiveFilter('graded')}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition cursor-pointer ${
                activeFilter === 'graded'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              Dinilai ({gradedSubmissions.length})
            </button>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-blue-600" />
            <span>Daftar Folder Tugas ({filteredFolders.length})</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Klik untuk buka & kirim tugas</span>
        </div>

        {/* Assignment Folders List */}
        {filteredFolders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Folder className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-800">Tidak ada tugas ditemukan</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {searchQuery || activeFilter !== 'all'
                ? 'Coba ubah kata kunci pencarian atau ganti filter status tugas.'
                : 'Bapak/Ibu Guru belum membuat folder tugas untuk kelas Anda saat ini.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-8">
            {filteredFolders.map((folder) => {
              const submission = mySubmissions.find((s) => s.folderId === folder.id);
              const isSubmitted = !!submission;
              const isGraded = submission && submission.grade !== undefined;
              const isDeadlinePassed = new Date() > new Date(folder.deadline);

              const deadlineDate = new Date(folder.deadline);
              const formattedDate = deadlineDate.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={folder.id}
                  onClick={() => setActiveFolderForSubmission(folder)}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400/80 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-lg uppercase tracking-wider border border-blue-100">
                          {folder.subject}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                          Kelas {folder.targetClass}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">
                        {folder.title}
                      </h3>
                    </div>

                    {/* Status Pill Badge */}
                    {isGraded ? (
                      <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-700 rounded-xl text-xs font-black shadow-2xs">
                        <Award className="w-3.5 h-3.5 text-purple-600" />
                        <span>Nilai: {submission.grade}</span>
                      </div>
                    ) : isSubmitted ? (
                      <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Terkumpul</span>
                      </div>
                    ) : (
                      <div
                        className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs ${
                          isDeadlinePassed
                            ? 'bg-rose-50 border border-rose-200 text-rose-700'
                            : 'bg-amber-50 border border-amber-200 text-amber-700'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{isDeadlinePassed ? 'Terlewat' : 'Belum Kumpul'}</span>
                      </div>
                    )}
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {folder.description}
                  </p>

                  {/* Teacher Feedback snippet if graded */}
                  {isGraded && submission.feedback && (
                    <div className="mt-3 p-3 bg-purple-50/80 rounded-xl border border-purple-100 text-xs text-purple-950">
                      <p className="font-bold text-[11px] text-purple-900 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        Catatan Evaluasi Guru:
                      </p>
                      <p className="italic text-[11px] mt-0.5 text-purple-800">
                        "{submission.feedback}"
                      </p>
                    </div>
                  )}

                  {/* Submission detail if submitted but not graded */}
                  {isSubmitted && !isGraded && (
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 flex items-center justify-between">
                      <span className="truncate max-w-[220px] flex items-center gap-1.5 font-medium">
                        <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{submission.fileName}</span>
                      </span>
                      <span className="text-amber-700 font-semibold text-[10px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Menunggu Penilaian
                      </span>
                    </div>
                  )}

                  {/* Card Footer Info */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Tenggat: {formattedDate}
                      </span>
                      {folder.teacherAttachmentName && (
                        <span className="flex items-center gap-1 text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">
                          <Paperclip className="w-3 h-3" />
                          Lampiran
                        </span>
                      )}
                    </div>

                    <div className="text-blue-600 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition">
                      <span>{isSubmitted ? 'Buka Detail' : 'Kirim Tugas'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {activeFolderForSubmission && (
        <StudentSubmitModal
          folder={activeFolderForSubmission}
          student={student}
          existingSubmission={mySubmissions.find(
            (s) => s.folderId === activeFolderForSubmission.id
          )}
          onClose={() => setActiveFolderForSubmission(null)}
          onSubmitSuccess={() => {
            refreshData();
            setActiveFolderForSubmission(null);
          }}
        />
      )}
    </div>
  );
};
