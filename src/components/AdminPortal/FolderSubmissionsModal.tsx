import React, { useState } from 'react';
import {
  X,
  FolderCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Award,
  Save,
  MessageSquareQuote,
  Send,
  ExternalLink,
  Users,
  Search,
} from 'lucide-react';
import { AssignmentFolder, Student, Submission } from '../../types';
import { StorageService } from '../../services/storage';

interface FolderSubmissionsModalProps {
  folder: AssignmentFolder;
  allStudents: Student[];
  onClose: () => void;
  onRefreshData: () => void;
}

export const FolderSubmissionsModal: React.FC<FolderSubmissionsModalProps> = ({
  folder,
  allStudents,
  onClose,
  onRefreshData,
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>(() =>
    StorageService.getSubmissions().filter((s) => s.folderId === folder.id)
  );

  const [filterTab, setFilterTab] = useState<'all' | 'submitted' | 'pending' | 'needs_grading'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for active grading form
  const [activeGradingStudentId, setActiveGradingStudentId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<number | ''>('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [saveAlertMessage, setSaveAlertMessage] = useState('');

  // Determine target students for this folder
  const targetStudents = allStudents.filter(
    (s) => folder.targetClass === 'Semua Kelas' || s.class === folder.targetClass
  );

  const submissionMap = new Map<string, Submission>();
  submissions.forEach((s) => submissionMap.set(s.studentId, s));

  const submittedCount = targetStudents.filter((s) => submissionMap.has(s.id)).length;
  const pendingCount = targetStudents.length - submittedCount;
  const gradedCount = submissions.filter((s) => s.grade !== undefined).length;

  const averageGrade =
    gradedCount > 0
      ? (
          submissions
            .filter((s) => s.grade !== undefined)
            .reduce((acc, curr) => acc + (curr.grade || 0), 0) / gradedCount
        ).toFixed(1)
      : '-';

  const startGrading = (sub: Submission) => {
    setActiveGradingStudentId(sub.studentId);
    setGradeInput(sub.grade !== undefined ? sub.grade : 85);
    setFeedbackInput(sub.feedback || 'Tugas sudah sangat baik dan sesuai instruksi.');
  };

  const handleSaveGrade = (submissionId: string) => {
    if (gradeInput === '' || gradeInput < 0 || gradeInput > 100) {
      alert('Nilai harus berupa angka antara 0 hingga 100.');
      return;
    }

    StorageService.gradeSubmission(submissionId, Number(gradeInput), feedbackInput.trim());
    
    // Refresh local submissions
    const updated = StorageService.getSubmissions().filter((s) => s.folderId === folder.id);
    setSubmissions(updated);
    setActiveGradingStudentId(null);
    setSaveAlertMessage('Nilai dan feedback berhasil disimpan untuk siswa ini!');
    setTimeout(() => setSaveAlertMessage(''), 3000);
    onRefreshData();
  };

  // Filter students based on active tab and search
  const filteredStudents = targetStudents.filter((student) => {
    const sub = submissionMap.get(student.id);
    const isSubmitted = !!sub;
    const isGraded = sub && sub.grade !== undefined;

    if (filterTab === 'submitted' && !isSubmitted) return false;
    if (filterTab === 'pending' && isSubmitted) return false;
    if (filterTab === 'needs_grading' && (!isSubmitted || isGraded)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        student.name.toLowerCase().includes(q) ||
        student.nisn.toLowerCase().includes(q) ||
        student.class.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-t-[32px] sm:rounded-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-indigo-900 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-800 text-indigo-200 text-[10px] font-bold rounded uppercase">
                {folder.subject}
              </span>
              <span className="text-xs text-indigo-300">Kelas: {folder.targetClass}</span>
            </div>
            <h2 className="text-base font-bold mt-1 line-clamp-1">{folder.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick KPI Bar */}
        <div className="bg-indigo-50 border-b border-indigo-100 p-3 grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <span className="text-sm font-bold text-slate-700">{targetStudents.length}</span>
            <p className="text-[10px] text-slate-500">Total Siswa</p>
          </div>
          <div>
            <span className="text-sm font-bold text-emerald-600">{submittedCount}</span>
            <p className="text-[10px] text-slate-500">Mengumpulkan</p>
          </div>
          <div>
            <span className="text-sm font-bold text-amber-600">{pendingCount}</span>
            <p className="text-[10px] text-slate-500">Belum Kumpul</p>
          </div>
          <div>
            <span className="text-sm font-bold text-purple-700">{averageGrade}</span>
            <p className="text-[10px] text-slate-500">Rata-rata Nilai</p>
          </div>
        </div>

        {/* Filter and Search controls */}
        <div className="p-4 border-b border-slate-100 space-y-2.5">
          {saveAlertMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded-xl font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveAlertMessage}</span>
            </div>
          )}

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa atau NISN..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-0.5">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition ${
                filterTab === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({targetStudents.length})
            </button>
            <button
              onClick={() => setFilterTab('submitted')}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition ${
                filterTab === 'submitted'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sudah Kumpul ({submittedCount})
            </button>
            <button
              onClick={() => setFilterTab('needs_grading')}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition ${
                filterTab === 'needs_grading'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Perlu Dinilai ({submittedCount - gradedCount})
            </button>
            <button
              onClick={() => setFilterTab('pending')}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition ${
                filterTab === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Belum ({pendingCount})
            </button>
          </div>
        </div>

        {/* Student Submission Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Tidak ada siswa pada kategori ini</p>
            </div>
          ) : (
            filteredStudents.map((student) => {
              const sub = submissionMap.get(student.id);
              const isSubmitted = !!sub;
              const isGradingActive = activeGradingStudentId === student.id;

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3"
                >
                  {/* Top row: student info and status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${
                          student.avatarColor || 'bg-indigo-600'
                        } text-white flex items-center justify-center font-bold text-sm`}
                      >
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{student.name}</h3>
                        <p className="text-[11px] text-slate-500">
                          Kelas: {student.class} • NISN: {student.nisn}
                        </p>
                      </div>
                    </div>

                    {isSubmitted ? (
                      sub.grade !== undefined ? (
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-700 rounded-xl text-xs font-bold shrink-0">
                          <Award className="w-3.5 h-3.5 text-purple-600" />
                          <span>Nilai: {sub.grade}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Terkumpul</span>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-semibold shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Belum Kumpul</span>
                      </div>
                    )}
                  </div>

                  {/* If submitted: show submission details */}
                  {isSubmitted && (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span className="font-medium text-slate-800 truncate">
                            {sub.fileName}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            ({sub.fileSize})
                          </span>
                        </div>

                        {/* File preview / download simulated action */}
                        <button
                          type="button"
                          onClick={() => {
                            if (sub.fileData) {
                              const win = window.open();
                              if (win) {
                                win.document.write(
                                  `<iframe src="${sub.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                                );
                              }
                            } else {
                              alert(`Mengunduh berkas tugas: ${sub.fileName}`);
                            }
                          }}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg text-[11px] flex items-center gap-1 shrink-0"
                        >
                          <Download className="w-3 h-3" />
                          <span>Lihat File</span>
                        </button>
                      </div>

                      {/* External link if provided */}
                      {sub.externalLink && (
                        <div className="flex items-center gap-1 text-blue-600 text-[11px] truncate">
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <a
                            href={sub.externalLink}
                            target="_blank"
                            rel="noreferrer"
                            className="underline truncate"
                          >
                            {sub.externalLink}
                          </a>
                        </div>
                      )}

                      {/* Student note */}
                      {sub.studentNotes && (
                        <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200 italic">
                          "{sub.studentNotes}"
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>
                          Dikirim:{' '}
                          {new Date(sub.submittedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {sub.isLate && (
                          <span className="text-rose-600 font-semibold">Terlambat</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Teacher Grading Section */}
                  {isSubmitted && (
                    <div>
                      {!isGradingActive ? (
                        <div className="flex items-center justify-between pt-1">
                          {sub.grade !== undefined ? (
                            <div className="text-xs text-slate-600">
                              <span className="font-semibold text-purple-700">Catatan Guru:</span>{' '}
                              <span className="italic">"{sub.feedback || '-'}"</span>
                            </div>
                          ) : (
                            <span className="text-xs text-amber-600 font-medium">
                              Belum diberikan penilaian
                            </span>
                          )}

                          <button
                            onClick={() => startGrading(sub)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs flex items-center gap-1 transition"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>{sub.grade !== undefined ? 'Ubah Nilai' : 'Beri Nilai'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 space-y-2.5 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-900">
                              Formulir Penilaian Guru
                            </span>
                            <button
                              onClick={() => setActiveGradingStudentId(null)}
                              className="text-xs text-slate-400 hover:text-slate-600"
                            >
                              Tutup
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-1">
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Skor (0-100)
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={gradeInput}
                                onChange={(e) =>
                                  setGradeInput(
                                    e.target.value === '' ? '' : Math.min(100, Number(e.target.value))
                                  )
                                }
                                placeholder="85"
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 text-center"
                              />
                            </div>

                            <div className="col-span-2">
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Feedback / Catatan Evaluasi
                              </label>
                              <input
                                type="text"
                                value={feedbackInput}
                                onChange={(e) => setFeedbackInput(e.target.value)}
                                placeholder="Contoh: Bagus sekali, grafik sangat rapi!"
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setActiveGradingStudentId(null)}
                              className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 font-semibold"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveGrade(sub.id)}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Simpan Nilai</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* If not submitted: WhatsApp reminder prompt */}
                  {!isSubmitted && student.phone && (
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                      <span className="text-slate-400">Kontak: {student.phone}</span>
                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            `Mengirim pesan pengingat tugas ke nomor ${student.phone}:\n"Halo ${student.name}, jangan lupa mengumpulkan tugas ${folder.title} pada aplikasi KumpulTugas ya."`
                          )
                        }
                        className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Ingatkan via WA</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
