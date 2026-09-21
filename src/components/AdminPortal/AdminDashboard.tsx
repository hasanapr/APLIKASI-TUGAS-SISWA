import React, { useState } from 'react';
import {
  Folder,
  Users,
  Settings,
  Plus,
  Search,
  Filter,
  LogOut,
  Calendar,
  FileCheck,
  CheckCircle2,
  Trash2,
  Edit2,
  Clock,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  Sparkles,
  School,
  UserCheck,
  UserX,
  Paperclip,
  ExternalLink,
  Lock,
  User,
  AlertCircle,
  Copy,
  ToggleLeft,
  ToggleRight,
  UserPlus,
  ArrowUpDown,
  FileText,
  AlertTriangle,
  Info,
  GraduationCap,
  ChevronDown,
  Image as ImageIcon,
  Database,
} from 'lucide-react';
import { AdminAccount, AssignmentFolder, Student, Submission, TeacherAccount } from '../../types';
import { StorageService } from '../../services/storage';
import { CreateFolderModal } from './CreateFolderModal';
import { FolderSubmissionsModal } from './FolderSubmissionsModal';
import { StudentManageModal } from './StudentManageModal';
import { DeleteStudentModal } from './DeleteStudentModal';
import { TeacherManageModal } from './TeacherManageModal';
import { TeacherListTab } from './TeacherListTab';
import { StudentDatabaseTab } from './StudentDatabaseTab';
import { ChangeStudentPasswordModal } from './ChangeStudentPasswordModal';
import { AppLogoModal } from './AppLogoModal';

interface AdminDashboardProps {
  adminAccount: AdminAccount;
  onLogout: () => void;
  onRefreshGlobalData: () => void;
  appLogo?: string;
  onUpdateAppLogo?: (newLogo: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminAccount,
  onLogout,
  onRefreshGlobalData,
  appLogo,
  onUpdateAppLogo,
}) => {
  const [activeTab, setActiveTab] = useState<'folders' | 'students' | 'teachers' | 'settings'>('folders');
  
  const [folders, setFolders] = useState<AssignmentFolder[]>(() => StorageService.getFolders());
  const [students, setStudents] = useState<Student[]>(() => StorageService.getStudents());
  const [submissions, setSubmissions] = useState<Submission[]>(() => StorageService.getSubmissions());
  const [teachers, setTeachers] = useState<TeacherAccount[]>(() => StorageService.getTeachers());
  const [activeTeacher, setActiveTeacher] = useState<TeacherAccount>(() => StorageService.getActiveTeacher());
  
  // Modals state
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<AssignmentFolder | undefined>(undefined);
  const [activeFolderSubmissions, setActiveFolderSubmissions] = useState<AssignmentFolder | null>(null);

  // User Management Modals
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | undefined>(undefined);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [studentToChangePassword, setStudentToChangePassword] = useState<Student | null>(null);

  // Logo modal state
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const activeLogo = appLogo || StorageService.getAppLogo();

  // Teacher Management Modals
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<TeacherAccount | undefined>(undefined);

  // Search & Filters
  const [folderSearch, setFolderSearch] = useState('');
  const [folderTeacherFilter, setFolderTeacherFilter] = useState<'all' | 'my'>('all');

  // Teacher Settings state
  const [newUsername, setNewUsername] = useState(activeTeacher.username);
  const [newPassword, setNewPassword] = useState(activeTeacher.password);
  const [teacherNameInput, setTeacherNameInput] = useState(activeTeacher.name);
  const [teacherNipInput, setTeacherNipInput] = useState(activeTeacher.nip || '');
  const [teacherSubjectInput, setTeacherSubjectInput] = useState(activeTeacher.subject);
  const [schoolNameInput, setSchoolNameInput] = useState(activeTeacher.schoolName || 'SMP N 1 Adiluwih Pringsewu');
  const [settingsSuccessMessage, setSettingsSuccessMessage] = useState('');
  const [notificationToast, setNotificationToast] = useState('');

  const refreshData = () => {
    setFolders(StorageService.getFolders());
    setStudents(StorageService.getStudents());
    setSubmissions(StorageService.getSubmissions());
    setTeachers(StorageService.getTeachers());
    const currentActive = StorageService.getActiveTeacher();
    setActiveTeacher(currentActive);
    setNewUsername(currentActive.username);
    setNewPassword(currentActive.password);
    setTeacherNameInput(currentActive.name);
    setTeacherNipInput(currentActive.nip || '');
    setTeacherSubjectInput(currentActive.subject);
    onRefreshGlobalData();
  };

  const showToast = (message: string) => {
    setNotificationToast(message);
    setTimeout(() => setNotificationToast(''), 3000);
  };

  const availableClasses = Array.from(new Set(students.map((s) => s.class)));

  const activeStudentsCount = students.filter((s) => s.status === 'active').length;
  const inactiveStudentsCount = students.filter((s) => s.status === 'inactive').length;

  // Handle Deleting Folder
  const handleDeleteFolder = (folderId: string, folderTitle: string) => {
    if (confirm(`Yakin ingin menghapus folder tugas "${folderTitle}" beserta semua pengumpulan siswa di dalamnya?`)) {
      StorageService.deleteFolder(folderId);
      refreshData();
      showToast(`Folder "${folderTitle}" berhasil dihapus.`);
    }
  };

  // Handle Deleting Student via Modal confirmation
  const handleConfirmDeleteStudent = () => {
    if (!studentToDelete) return;
    const deletedName = studentToDelete.name;
    StorageService.deleteStudent(studentToDelete.id);
    setStudentToDelete(null);
    refreshData();
    showToast(`Akun siswa "${deletedName}" berhasil dihapus.`);
  };

  // Handle Toggle Active/Inactive Status
  const handleToggleStudentStatus = (std: Student) => {
    const newStatus = StorageService.toggleStudentStatus(std.id);
    refreshData();
    showToast(`Status "${std.name}" diubah menjadi ${newStatus === 'active' ? 'Aktif' : 'Tidak Aktif'}.`);
  };

  // Bulk Delete Inactive Students
  const handleDeleteAllInactive = () => {
    if (inactiveStudentsCount === 0) {
      alert('Tidak ada siswa yang berstatus Tidak Aktif.');
      return;
    }
    if (
      confirm(
        `Konfirmasi: Hapus ${inactiveStudentsCount} akun siswa yang berstatus Tidak Aktif secara permanen? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      const count = StorageService.deleteInactiveStudents();
      refreshData();
      showToast(`${count} akun siswa yang tidak aktif telah dihapus.`);
    }
  };

  const handleSwitchTeacher = (teacher: TeacherAccount) => {
    StorageService.setActiveTeacher(teacher);
    setActiveTeacher(teacher);
    setNewUsername(teacher.username);
    setNewPassword(teacher.password);
    setTeacherNameInput(teacher.name);
    setTeacherNipInput(teacher.nip || '');
    setTeacherSubjectInput(teacher.subject);
    showToast(`Beralih ke akun: ${teacher.name}`);
    onRefreshGlobalData();
  };

  const handleDeleteTeacher = (teacher: TeacherAccount) => {
    if (teacher.id === activeTeacher.id) {
      alert('Anda tidak dapat menghapus akun guru yang sedang aktif digunakan.');
      return;
    }
    const admins = teachers.filter((t) => t.role === 'admin');
    if (teacher.role === 'admin' && admins.length <= 1) {
      alert('Sistem harus memiliki minimal 1 akun Admin Sekolah.');
      return;
    }
    if (
      confirm(
        `Hapus akun guru "${teacher.name}" (${teacher.subject})? Folder tugas yang telah dibuat guru ini tetap tersimpan.`
      )
    ) {
      StorageService.deleteTeacher(teacher.id);
      refreshData();
      showToast(`Akun guru "${teacher.name}" berhasil dihapus.`);
    }
  };

  // Handle Changing Teacher / Admin Credentials
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      alert('Username dan password tidak boleh kosong.');
      return;
    }

    StorageService.updateTeacher(activeTeacher.id, {
      username: newUsername.trim().toLowerCase(),
      password: newPassword.trim(),
      name: teacherNameInput.trim() || activeTeacher.name,
      nip: teacherNipInput.trim() || undefined,
      subject: teacherSubjectInput.trim() || activeTeacher.subject,
      schoolName: schoolNameInput.trim() || activeTeacher.schoolName,
    });

    refreshData();
    setSettingsSuccessMessage('Profil dan kredensial akun guru berhasil diperbarui!');
    setTimeout(() => setSettingsSuccessMessage(''), 3500);
  };

  // Reset to default
  const handleResetDemo = () => {
    if (confirm('Kembalikan semua data siswa, data guru, folder tugas, dan kredensial ke pengaturan awal bawaan?')) {
      StorageService.resetAllDataToDemo();
      refreshData();
      alert('Data telah berhasil direset ke pengaturan awal demo.');
    }
  };

  // Filtered folders
  const filteredFolders = folders.filter((f) => {
    if (folderTeacherFilter === 'my' && f.teacherId !== activeTeacher.id) return false;
    if (!folderSearch.trim()) return true;
    const q = folderSearch.toLowerCase();
    return (
      f.title.toLowerCase().includes(q) ||
      f.subject.toLowerCase().includes(q) ||
      f.targetClass.toLowerCase().includes(q) ||
      (f.teacherName && f.teacherName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative pb-16">
      {/* Teacher App Header (Android style) */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white p-5 rounded-b-[32px] shadow-xl border-b border-white/10 relative overflow-hidden">
        {/* Subtle ambient light glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top school identity badge */}
        <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="flex items-center gap-2 hover:opacity-90 transition cursor-pointer group text-left"
              title="Klik untuk ubah logo aplikasi"
            >
              <div className="w-6 h-6 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-xs overflow-hidden group-hover:ring-2 ring-indigo-400">
                <img
                  src={activeLogo}
                  alt="Logo Spensadil"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/spensadil_logo.png';
                  }}
                />
              </div>
              <span className="font-extrabold text-white tracking-tight font-display">Portal Guru Spensadil</span>
              <span className="text-white/30">•</span>
              <span className="text-indigo-200 text-[11px] hidden xs:inline">SMP N 1 Adiluwih</span>
            </button>
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="text-[10px] bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white px-2.5 py-1 rounded-full font-bold transition cursor-pointer flex items-center gap-1.5 border border-white/10"
              title="Ganti logo aplikasi"
            >
              <ImageIcon className="w-3 h-3 text-amber-300" />
              <span>Ubah Logo</span>
            </button>
          </div>

          <button
            onClick={onLogout}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-xl transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Keluar dari portal guru"
          >
            <LogOut className="w-3.5 h-3.5 text-indigo-300" />
            <span>Keluar</span>
          </button>
        </div>

        {/* Current Active Teacher info card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-13 h-13 rounded-2xl ${
                activeTeacher.avatarColor || 'bg-indigo-600'
              } text-white flex items-center justify-center font-black text-xl shadow-lg ring-2 ring-white/25`}
            >
              {activeTeacher.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-black text-base text-white leading-tight font-display">
                  {activeTeacher.name}
                </h1>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold rounded-full">
                  {activeTeacher.role === 'admin' ? 'Super Admin' : 'Guru Mapel'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                Mapel: <strong className="text-white bg-white/10 px-1.5 py-0.2 rounded-md">{activeTeacher.subject}</strong> • User:{' '}
                <span className="font-mono text-indigo-200 font-bold">
                  {activeTeacher.username}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('teachers')}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
            title="Beralih ke akun guru lain"
          >
            <Users className="w-3.5 h-3.5 text-indigo-300" />
            <span className="hidden sm:inline">Ganti Akun</span>
          </button>
        </div>

        {/* Quick Top Stats (4 KPIs) */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-5">
          <div
            onClick={() => setActiveTab('folders')}
            className={`cursor-pointer rounded-2xl p-2.5 text-center border backdrop-blur-md transition ${
              activeTab === 'folders'
                ? 'bg-white/20 border-white/40 shadow-inner'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-base sm:text-lg font-black text-white">{folders.length}</span>
            <p className="text-[10px] font-semibold text-slate-300 leading-tight mt-0.5">Folder</p>
          </div>
          <div
            onClick={() => setActiveTab('students')}
            className={`cursor-pointer rounded-2xl p-2.5 text-center border backdrop-blur-md transition ${
              activeTab === 'students'
                ? 'bg-white/20 border-white/40 shadow-inner'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-base sm:text-lg font-black text-emerald-300">{students.length}</span>
            <p className="text-[10px] font-semibold text-slate-300 leading-tight mt-0.5">Siswa</p>
          </div>
          <div
            onClick={() => setActiveTab('teachers')}
            className={`cursor-pointer rounded-2xl p-2.5 text-center border backdrop-blur-md transition ${
              activeTab === 'teachers'
                ? 'bg-white/20 border-white/40 shadow-inner'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-base sm:text-lg font-black text-cyan-300">{teachers.length}</span>
            <p className="text-[10px] font-semibold text-slate-300 leading-tight mt-0.5">Guru</p>
          </div>
          <div
            onClick={() => setActiveTab('folders')}
            className="bg-white/5 border-white/10 backdrop-blur-md rounded-2xl p-2.5 text-center border cursor-pointer hover:bg-white/10 transition"
          >
            <span className="text-base sm:text-lg font-black text-amber-300">{submissions.length}</span>
            <p className="text-[10px] font-semibold text-slate-300 leading-tight mt-0.5">Tugas Masuk</p>
          </div>
        </div>
      </div>

      {/* Copy/Action notification toast */}
      {notificationToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-medium">{notificationToast}</span>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="flex-1 p-4">
        {/* TAB 1: FOLDER TUGAS */}
        {activeTab === 'folders' && (
          <div className="space-y-4">
            {/* Header row with search and Create Button */}
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={folderSearch}
                  onChange={(e) => setFolderSearch(e.target.value)}
                  placeholder="Cari folder tugas..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                />
              </div>

              <button
                onClick={() => {
                  setFolderToEdit(undefined);
                  setIsCreateFolderOpen(true);
                }}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 shrink-0 transition active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Folder</span>
              </button>
            </div>

            {/* Teacher filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
              <button
                onClick={() => setFolderTeacherFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  folderTeacherFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Semua Guru ({folders.length})
              </button>
              <button
                onClick={() => setFolderTeacherFilter('my')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  folderTeacherFilter === 'my'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Tugas Saya ({folders.filter((f) => f.teacherId === activeTeacher.id).length})
              </button>
            </div>

            {/* Sub-header instruction */}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-bold uppercase tracking-wider text-slate-700">
                Daftar Folder Tugas ({filteredFolders.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Otomatis tampil di portal siswa
              </span>
            </div>

            {/* Folder Cards List */}
            {filteredFolders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <Folder className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">Belum ada folder tugas</p>
                <p className="text-xs text-slate-400 mt-1">
                  Klik tombol "+ Buat Folder" untuk menambahkan tugas baru bagi siswa.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFolders.map((folder) => {
                  const folderSubmissions = submissions.filter((s) => s.folderId === folder.id);
                  const targetClassStudents = students.filter(
                    (s) => folder.targetClass === 'Semua Kelas' || s.class === folder.targetClass
                  );
                  const gradedCount = folderSubmissions.filter((s) => s.grade !== undefined).length;
                  const percent =
                    targetClassStudents.length > 0
                      ? Math.round((folderSubmissions.length / targetClassStudents.length) * 100)
                      : 0;

                  const deadlineDate = new Date(folder.deadline);
                  const formattedDeadline = deadlineDate.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={folder.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition space-y-3"
                    >
                      {/* Top folder card header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded uppercase tracking-wider">
                              {folder.subject}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              Target: {folder.targetClass}
                            </span>
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                              <GraduationCap className="w-3 h-3 text-indigo-600" />
                              <span>{folder.teacherName || 'Guru Spensadil'}</span>
                            </span>
                            {folder.teacherAttachmentName && (
                              <span className="text-[10px] text-indigo-600 flex items-center gap-0.5 font-medium">
                                <Paperclip className="w-3 h-3" />
                                Ada Materi
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-sm text-slate-900 leading-snug">
                            {folder.title}
                          </h3>
                        </div>

                        {/* Actions: Edit & Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setFolderToEdit(folder);
                              setIsCreateFolderOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit folder tugas"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFolder(folder.id, folder.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Hapus folder tugas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Description preview */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {folder.description}
                      </p>

                      {/* Progress Bar & Submissions Counter */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 font-medium">
                            Pengumpulan Siswa:
                          </span>
                          <span className="font-bold text-indigo-900">
                            {folderSubmissions.length} dari {targetClassStudents.length} siswa ({percent}%)
                          </span>
                        </div>
                        {/* Visual Bar */}
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, percent)}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Sudah dinilai: {gradedCount} siswa</span>
                          <span>Tenggat: {formattedDeadline}</span>
                        </div>
                      </div>

                      {/* Action Button: Buka Pengumpulan Tugas */}
                      <button
                        onClick={() => setActiveFolderSubmissions(folder)}
                        className="w-full py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>
                          Periksa Tugas Siswa ({folderSubmissions.length} Masuk)
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DATABASE KREDENSIAL & AKUN SISWA (DATABASE, UBAH PASSWORD, HAPUS SISWA) */}
        {activeTab === 'students' && (
          <StudentDatabaseTab
            students={students}
            submissions={submissions}
            availableClasses={availableClasses}
            onOpenAddStudent={() => {
              setStudentToEdit(undefined);
              setIsStudentModalOpen(true);
            }}
            onOpenEditStudent={(std) => {
              setStudentToEdit(std);
              setIsStudentModalOpen(true);
            }}
            onOpenChangePassword={(std) => {
              setStudentToChangePassword(std);
            }}
            onOpenDeleteStudent={(std) => {
              setStudentToDelete(std);
            }}
            onToggleStatus={(std) => {
              handleToggleStudentStatus(std);
            }}
            onDeleteAllInactive={handleDeleteAllInactive}
            showToast={showToast}
          />
        )}

        {/* TAB 3: DATA GURU (MULTI-GURU MANAGEMENT) */}
        {activeTab === 'teachers' && (
          <TeacherListTab
            teachers={teachers}
            activeTeacher={activeTeacher}
            folders={folders}
            onOpenAddTeacher={() => {
              setTeacherToEdit(undefined);
              setIsTeacherModalOpen(true);
            }}
            onOpenEditTeacher={(teacher) => {
              setTeacherToEdit(teacher);
              setIsTeacherModalOpen(true);
            }}
            onSwitchTeacher={handleSwitchTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            showToast={showToast}
          />
        )}

        {/* TAB 4: PENGATURAN AKUN GURU & SISTEM */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Logo & School Branding Settings Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Logo & Identitas Sekolah
                  </h3>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                  Spensadil
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Ubah logo resmi SMP N 1 Adiluwih Pringsewu. Logo ini langsung diperbarui di halaman login siswa, login guru, navigasi atas, dan panduan.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-xs border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden mx-auto sm:mx-0">
                  <img
                    src={activeLogo}
                    alt="Logo Saat Ini"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/spensadil_logo.png';
                    }}
                  />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <p className="text-xs font-bold text-slate-800">
                    {StorageService.hasCustomLogo() ? 'Logo Kustom Sekolah (Aktif)' : 'Logo Standar Spensadil'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Format didukung: PNG, JPG, JPEG, SVG, WebP
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsLogoModalOpen(true)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                      <span>Ubah Logo Aplikasi</span>
                    </button>
                    {StorageService.hasCustomLogo() && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Kembalikan logo ke logo bawaan SMP N 1 Adiluwih?')) {
                            const def = StorageService.resetAppLogo();
                            if (onUpdateAppLogo) onUpdateAppLogo(def);
                            refreshData();
                            showToast('Logo berhasil direset ke bawaan Spensadil!');
                          }
                        }}
                        className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                      >
                        Reset ke Bawaan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Header info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
              <div className="flex items-center gap-2 mb-1">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pengaturan Akun Guru Aktif
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ubah informasi profil, mata pelajaran, serta username dan password untuk akun yang sedang Anda gunakan saat ini.
              </p>

              {settingsSuccessMessage && (
                <div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{settingsSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="mt-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Username Login
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Username guru"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Password Login
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Password guru"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Nama Lengkap & Gelar Guru
                  </label>
                  <input
                    type="text"
                    value={teacherNameInput}
                    onChange={(e) => setTeacherNameInput(e.target.value)}
                    placeholder="Contoh: Dra. Hj. Sri Wahyuni, M.Pd."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Mata Pelajaran Diampu
                    </label>
                    <input
                      type="text"
                      value={teacherSubjectInput}
                      onChange={(e) => setTeacherSubjectInput(e.target.value)}
                      placeholder="Contoh: Bahasa Indonesia"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      NIP (Nomor Induk Pegawai)
                    </label>
                    <input
                      type="text"
                      value={teacherNipInput}
                      onChange={(e) => setTeacherNipInput(e.target.value)}
                      placeholder="19780512 200501 1 004 (Opsional)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Nama Sekolah
                  </label>
                  <input
                    type="text"
                    value={schoolNameInput}
                    onChange={(e) => setSchoolNameInput(e.target.value)}
                    placeholder="SMP N 1 Adiluwih Pringsewu"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/20 transition active:scale-[0.98] mt-2 cursor-pointer"
                >
                  Simpan Perubahan Akun Guru Ini
                </button>
              </form>
            </div>

            {/* Quick Switch to Other Teacher Accounts */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Daftar Guru Lainnya ({teachers.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('teachers')}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Kelola Semua Guru →
                </button>
              </div>

              <div className="space-y-1.5">
                {teachers.slice(0, 4).map((t) => {
                  const isCurrent = t.id === activeTeacher.id;
                  return (
                    <div
                      key={t.id}
                      className={`p-2 rounded-xl flex items-center justify-between text-xs border ${
                        isCurrent
                          ? 'bg-indigo-50/70 border-indigo-200'
                          : 'bg-slate-50 border-slate-100 hover:bg-indigo-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg ${
                            t.avatarColor || 'bg-indigo-600'
                          } text-white flex items-center justify-center font-bold text-xs`}
                        >
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs leading-tight">{t.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {t.subject} • User: <span className="font-mono text-indigo-800">{t.username}</span>
                          </p>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Aktif
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSwitchTeacher(t)}
                          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-200 px-2 py-1 rounded-lg transition cursor-pointer"
                        >
                          Gunakan
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reset to initial demo data */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Pengaturan Uji Coba (Demo Data)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Ingin mengembalikan data siswa, daftar guru mata pelajaran, folder tugas, dan kredensial ke pengaturan awal bawaan sekolah?
              </p>
              <button
                type="button"
                onClick={handleResetDemo}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset ke Data Bawaan Sistem Spensadil</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Android Bottom Navigation Bar (Modern floating glass style) */}
      <nav className="fixed bottom-2 left-3 right-3 max-w-[396px] mx-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 px-3 py-2 rounded-3xl flex items-center justify-around z-30 shadow-xl shadow-slate-900/10">
        <button
          onClick={() => setActiveTab('folders')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'folders'
              ? 'text-indigo-600 font-bold bg-indigo-50/90 shadow-xs scale-105'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Folder className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Folder Tugas</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'text-indigo-600 font-bold bg-indigo-50/90 shadow-xs scale-105'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Data Siswa</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all relative cursor-pointer ${
            activeTab === 'teachers'
              ? 'text-indigo-600 font-bold bg-indigo-50/90 shadow-xs scale-105'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Data Guru</span>
          <span className="absolute top-1 right-2 px-1.5 py-0.2 bg-indigo-600 text-white text-[8px] font-extrabold rounded-full min-w-[14px] text-center shadow-xs">
            {teachers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'text-indigo-600 font-bold bg-indigo-50/90 shadow-xs scale-105'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Pengaturan</span>
        </button>
      </nav>

      {/* Modals */}
      {isCreateFolderOpen && (
        <CreateFolderModal
          existingFolder={folderToEdit}
          availableClasses={availableClasses}
          onClose={() => setIsCreateFolderOpen(false)}
          onSaveSuccess={() => {
            setIsCreateFolderOpen(false);
            refreshData();
            showToast('Folder tugas berhasil disimpan!');
          }}
        />
      )}

      {activeFolderSubmissions && (
        <FolderSubmissionsModal
          folder={activeFolderSubmissions}
          allStudents={students}
          onClose={() => setActiveFolderSubmissions(null)}
          onRefreshData={refreshData}
        />
      )}

      {isStudentModalOpen && (
        <StudentManageModal
          existingStudent={studentToEdit}
          availableClasses={availableClasses}
          onClose={() => setIsStudentModalOpen(false)}
          onSaveSuccess={() => {
            setIsStudentModalOpen(false);
            refreshData();
            showToast(studentToEdit ? 'Data siswa berhasil diperbarui!' : 'Siswa baru berhasil didaftarkan!');
          }}
        />
      )}

      {studentToDelete && (
        <DeleteStudentModal
          student={studentToDelete}
          onClose={() => setStudentToDelete(null)}
          onConfirmDelete={handleConfirmDeleteStudent}
        />
      )}

      {isTeacherModalOpen && (
        <TeacherManageModal
          existingTeacher={teacherToEdit}
          onClose={() => {
            setIsTeacherModalOpen(false);
            setTeacherToEdit(undefined);
          }}
          onSaveSuccess={() => {
            setIsTeacherModalOpen(false);
            setTeacherToEdit(undefined);
            refreshData();
            showToast(teacherToEdit ? 'Data guru berhasil diperbarui!' : 'Guru baru berhasil didaftarkan!');
          }}
        />
      )}

      {studentToChangePassword && (
        <ChangeStudentPasswordModal
          student={studentToChangePassword}
          onClose={() => setStudentToChangePassword(null)}
          onSuccess={() => {
            setStudentToChangePassword(null);
            refreshData();
            showToast('Password siswa berhasil diperbarui!');
          }}
        />
      )}

      {isLogoModalOpen && (
        <AppLogoModal
          currentLogo={activeLogo}
          onClose={() => setIsLogoModalOpen(false)}
          showToast={showToast}
          onLogoUpdated={(newLogo) => {
            if (onUpdateAppLogo) {
              onUpdateAppLogo(newLogo);
            }
            refreshData();
            showToast('Logo aplikasi Spensadil berhasil diperbarui!');
          }}
        />
      )}
    </div>
  );
};
