import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  KeyRound,
  Trash2,
  Edit2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Download,
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight,
  UserX,
  FileText,
  Table as TableIcon,
  LayoutGrid,
  Info,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Student, Submission } from '../../types';

interface StudentDatabaseTabProps {
  students: Student[];
  submissions: Submission[];
  availableClasses: string[];
  onOpenAddStudent: () => void;
  onOpenEditStudent: (student: Student) => void;
  onOpenChangePassword: (student: Student) => void;
  onOpenDeleteStudent: (student: Student) => void;
  onToggleStatus: (student: Student) => void;
  onDeleteAllInactive: () => void;
  showToast: (msg: string) => void;
}

export const StudentDatabaseTab: React.FC<StudentDatabaseTabProps> = ({
  students,
  submissions,
  availableClasses,
  onOpenAddStudent,
  onOpenEditStudent,
  onOpenChangePassword,
  onOpenDeleteStudent,
  onToggleStatus,
  onDeleteAllInactive,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedPasswordType, setSelectedPasswordType] = useState<'all' | 'custom' | 'birthdate'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showAllPasswords, setShowAllPasswords] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Filter students based on search, class, status, and password type
  const filteredStudents = students.filter((std) => {
    const q = searchQuery.toLowerCase().trim();
    const effectivePass = (std.customPassword || std.birthDate).toLowerCase();
    const matchesSearch =
      !q ||
      std.name.toLowerCase().includes(q) ||
      std.nisn.toLowerCase().includes(q) ||
      std.birthDate.toLowerCase().includes(q) ||
      effectivePass.includes(q) ||
      std.class.toLowerCase().includes(q) ||
      (std.phone && std.phone.includes(q));

    const matchesClass = selectedClass === 'all' || std.class === selectedClass;
    const matchesStatus = selectedStatus === 'all' || std.status === selectedStatus;
    const matchesPassType =
      selectedPasswordType === 'all' ||
      (selectedPasswordType === 'custom' && Boolean(std.customPassword)) ||
      (selectedPasswordType === 'birthdate' && !std.customPassword);

    return matchesSearch && matchesClass && matchesStatus && matchesPassType;
  });

  const activeCount = students.filter((s) => s.status === 'active').length;
  const inactiveCount = students.filter((s) => s.status === 'inactive').length;
  const customPasswordCount = students.filter((s) => Boolean(s.customPassword)).length;

  const handleCopyCredentials = (std: Student) => {
    const pass = std.customPassword || std.birthDate;
    const text = `Username: ${std.name}\nPassword: ${pass}\nKelas: ${std.class}\nNISN: ${std.nisn}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(std.id);
      showToast(`Kredensial siswa ${std.name} berhasil disalin!`);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleCopyAllCredentials = () => {
    if (filteredStudents.length === 0) return;
    const list = filteredStudents
      .map(
        (s, i) =>
          `${i + 1}. Nama/Username: ${s.name} | Password: ${
            s.customPassword || s.birthDate
          } | Kelas: ${s.class} | NISN: ${s.nisn}`
      )
      .join('\n');

    const heading = `DAFTAR KREDENSIAL LOGIN SISWA SPENSADIL (${filteredStudents.length} Siswa)\n----------------------------------------------------\n`;
    navigator.clipboard.writeText(heading + list).then(() => {
      showToast(`${filteredStudents.length} akun siswa berhasil disalin ke clipboard!`);
    });
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const headers = ['No', 'Nama Siswa (Username)', 'Password Login', 'Tipe Password', 'Kelas', 'NISN', 'Status', 'Tanggal Lahir', 'No HP'];
      const rows = filteredStudents.map((s, i) => [
        i + 1,
        `"${s.name.replace(/"/g, '""')}"`,
        `"${(s.customPassword || s.birthDate).replace(/"/g, '""')}"`,
        s.customPassword ? 'Kustom' : 'Tanggal Lahir',
        `"${s.class}"`,
        `\t${s.nisn}`, // tab to prevent scientific notation in excel
        s.status === 'active' ? 'Aktif' : 'Tidak Aktif',
        s.birthDate,
        s.phone || '-',
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Database_Akun_Siswa_Spensadil_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Database akun siswa berhasil diunduh (format CSV)!');
    } catch {
      showToast('Gagal mengekspor data siswa.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header with Title & Action Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Database Kredensial Siswa</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            Daftar username, password, ubah kata sandi, dan kelola pengguna siswa
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddStudent}
          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 shrink-0 transition active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Siswa</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div
          onClick={() => {
            setSelectedStatus('all');
            setSelectedPasswordType('all');
          }}
          className="cursor-pointer bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-2 transition shadow-2xs"
        >
          <span className="text-base font-black text-slate-800">{students.length}</span>
          <p className="text-[9px] font-bold text-slate-500 truncate">Total Siswa</p>
        </div>

        <div
          onClick={() => setSelectedStatus('active')}
          className="cursor-pointer bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-2 transition shadow-2xs"
        >
          <span className="text-base font-black text-emerald-600">{activeCount}</span>
          <p className="text-[9px] font-bold text-emerald-700 truncate">Siswa Aktif</p>
        </div>

        <div
          onClick={() => setSelectedStatus('inactive')}
          className="cursor-pointer bg-white border border-slate-200 hover:border-rose-300 rounded-2xl p-2 transition shadow-2xs"
        >
          <span className="text-base font-black text-rose-600">{inactiveCount}</span>
          <p className="text-[9px] font-bold text-rose-700 truncate">Nonaktif</p>
        </div>

        <div
          onClick={() => setSelectedPasswordType('custom')}
          className="cursor-pointer bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-2 transition shadow-2xs"
        >
          <span className="text-base font-black text-indigo-600">{customPasswordCount}</span>
          <p className="text-[9px] font-bold text-indigo-700 truncate">Pass Kustom</p>
        </div>
      </div>

      {/* Inactive Cleanup Alert if inactive students exist */}
      {inactiveCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs text-rose-900">
          <div className="flex items-center gap-2">
            <UserX className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold leading-tight">
                Terdapat {inactiveCount} akun siswa dinonaktifkan
              </p>
              <p className="text-[11px] text-rose-700">
                Akun ini tidak dapat login dan dapat dihapus sekaligus dari database.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onDeleteAllInactive}
            className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] shrink-0 transition cursor-pointer"
          >
            Hapus Semua
          </button>
        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa, username, NISN, atau password..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Semua Kelas</option>
            {availableClasses.map((cls) => (
              <option key={cls} value={cls}>
                Kelas {cls}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Status: Semua</option>
            <option value="active">Aktif Saja</option>
            <option value="inactive">Nonaktif Saja</option>
          </select>

          {/* Password Type Filter */}
          <select
            value={selectedPasswordType}
            onChange={(e) => setSelectedPasswordType(e.target.value as any)}
            className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Semua Password</option>
            <option value="custom">Password Kustom</option>
            <option value="birthdate">Format Tanggal Lahir</option>
          </select>
        </div>

        {/* Database Controls Toolbar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
          {/* View Mode & Password Visibility Toggles */}
          <div className="flex items-center gap-1.5">
            <div className="bg-slate-100 p-0.5 rounded-lg flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1 rounded-md transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Tabel Database"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1 rounded-md transition cursor-pointer ${
                  viewMode === 'cards' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Kartu"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAllPasswords(!showAllPasswords)}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer"
              title="Perlihatkan atau sembunyikan semua password"
            >
              {showAllPasswords ? <EyeOff className="w-3 h-3 text-slate-600" /> : <Eye className="w-3 h-3 text-slate-600" />}
              <span>{showAllPasswords ? 'Tutup Password' : 'Lihat Password'}</span>
            </button>
          </div>

          {/* Export & Copy Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyAllCredentials}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
              title="Salin semua akun siswa ke clipboard (format teks WhatsApp)"
            >
              <Copy className="w-3 h-3" />
              <span>Salin Kredensial</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={isExporting}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
              title="Unduh database akun siswa ke file Excel/CSV"
            >
              <FileSpreadsheet className="w-3 h-3" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>
          Menampilkan <strong>{filteredStudents.length}</strong> dari {students.length} siswa terdaftar
        </span>
        {(searchQuery || selectedClass !== 'all' || selectedStatus !== 'all' || selectedPasswordType !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedClass('all');
              setSelectedStatus('all');
              setSelectedPasswordType('all');
            }}
            className="text-indigo-600 font-semibold hover:underline cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2 shadow-2xs">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">Tidak ada siswa yang sesuai</p>
          <p className="text-xs text-slate-400">
            Coba sesuaikan kata kunci pencarian atau filter kelas dan status akun.
          </p>
          <button
            type="button"
            onClick={onOpenAddStudent}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Siswa Baru</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE / SPREADSHEET DATABASE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-3 w-8 text-center">No</th>
                  <th className="py-2.5 px-3">Nama Lengkap & NISN</th>
                  <th className="py-2.5 px-3">Username Login</th>
                  <th className="py-2.5 px-3">Password Login</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredStudents.map((std, idx) => {
                  const effectivePass = std.customPassword || std.birthDate;
                  const isCustom = Boolean(std.customPassword);
                  const isCopied = copiedId === std.id;
                  const isInactive = std.status === 'inactive';

                  return (
                    <tr
                      key={std.id}
                      className={`hover:bg-indigo-50/30 transition ${
                        isInactive ? 'bg-rose-50/30 text-slate-400' : ''
                      }`}
                    >
                      {/* No */}
                      <td className="py-3 px-3 text-center text-slate-400 text-[10px]">{idx + 1}</td>

                      {/* Student Info */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg ${
                              isInactive ? 'bg-slate-400' : std.avatarColor || 'bg-indigo-600'
                            } text-white font-bold flex items-center justify-center text-xs shrink-0`}
                          >
                            {std.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs leading-tight">{std.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">NISN: {std.nisn}</p>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[120px]">
                            {std.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(std.name);
                              showToast(`Username "${std.name}" disalin!`);
                            }}
                            className="text-slate-400 hover:text-indigo-600 p-0.5 rounded cursor-pointer"
                            title="Salin Username"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Password */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-indigo-900 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                            {showAllPasswords ? effectivePass : '••••••••'}
                          </span>
                          <span
                            className={`text-[8px] font-bold px-1 rounded uppercase ${
                              isCustom
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isCustom ? 'Kustom' : 'Tgl Lahir'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(effectivePass);
                              showToast(`Password "${effectivePass}" disalin!`);
                            }}
                            className="text-slate-400 hover:text-indigo-600 p-0.5 rounded cursor-pointer"
                            title="Salin Password"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {std.class}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(std)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                            isInactive
                              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                          title="Klik untuk ubah status aktif/nonaktif"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isInactive ? 'bg-rose-600' : 'bg-emerald-600'
                            }`}
                          />
                          <span>{isInactive ? 'Nonaktif' : 'Aktif'}</span>
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Ubah Password */}
                          <button
                            type="button"
                            onClick={() => onOpenChangePassword(std)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
                            title="Ubah Password Siswa"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Siswa */}
                          <button
                            type="button"
                            onClick={() => onOpenEditStudent(std)}
                            className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                            title="Edit Data Siswa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Hapus Siswa */}
                          <button
                            type="button"
                            onClick={() => onOpenDeleteStudent(std)}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Hapus Pengguna Siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="space-y-3">
          {filteredStudents.map((std) => {
            const effectivePass = std.customPassword || std.birthDate;
            const isCustom = Boolean(std.customPassword);
            const isInactive = std.status === 'inactive';
            const studentSubmissions = submissions.filter((s) => s.studentId === std.id);

            return (
              <div
                key={std.id}
                className={`bg-white rounded-2xl border p-4 shadow-2xs transition space-y-3 ${
                  isInactive ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/90 hover:border-indigo-300'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`w-11 h-11 rounded-2xl ${
                        isInactive ? 'bg-slate-400' : std.avatarColor || 'bg-indigo-600'
                      } text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs`}
                    >
                      {std.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{std.name}</h4>
                        {std.gender && (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            ({std.gender === 'L' ? 'L' : 'P'})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          Kelas {std.class}
                        </span>
                        <span>NISN: {std.nisn}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleStatus(std)}
                    className={`px-2 py-1 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1 cursor-pointer transition ${
                      isInactive
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                    title="Ubah status aktif"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isInactive ? 'bg-rose-600' : 'bg-emerald-600'
                      }`}
                    />
                    <span>{isInactive ? 'Nonaktif' : 'Aktif'}</span>
                  </button>
                </div>

                {/* Credentials Details Box */}
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-[11px] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Username Login:</span>
                      <span className="font-bold text-slate-800 truncate block">{std.name}</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 block text-[10px]">Password Login:</span>
                        <span
                          className={`text-[8px] font-bold px-1 rounded uppercase ${
                            isCustom ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isCustom ? 'Kustom' : 'Tgl Lahir'}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-indigo-700 block">
                        {showAllPasswords ? effectivePass : '••••••••'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-indigo-600" />
                      <span>{studentSubmissions.length} Tugas Dikumpulkan</span>
                    </span>
                    <span>Tgl Lahir: {std.birthDate}</span>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenChangePassword(std)}
                    className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Ubah Password</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyCredentials(std)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                      title="Salin kredensial login"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenEditStudent(std)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                      title="Edit data siswa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenDeleteStudent(std)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Hapus pengguna siswa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
