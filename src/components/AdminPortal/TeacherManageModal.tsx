import React, { useState } from 'react';
import { X, UserPlus, Save, AlertCircle, Shield, BookOpen, KeyRound, User, Lock, Phone } from 'lucide-react';
import { TeacherAccount } from '../../types';
import { StorageService } from '../../services/storage';

interface TeacherManageModalProps {
  existingTeacher?: TeacherAccount;
  onClose: () => void;
  onSaveSuccess: (teacher: TeacherAccount) => void;
}

const COMMON_SUBJECTS = [
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'Ilmu Pengetahuan Alam (IPA)',
  'Ilmu Pengetahuan Sosial (IPS)',
  'Informatika & TIK',
  'Pendidikan Agama & Budi Pekerti',
  'Pendidikan Pancasila & Kewarganegaraan (PPKn)',
  'Seni Budaya',
  'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)',
  'Prakarya',
  'Bimbingan Konseling (BK)',
];

export const TeacherManageModal: React.FC<TeacherManageModalProps> = ({
  existingTeacher,
  onClose,
  onSaveSuccess,
}) => {
  const isEditing = !!existingTeacher;

  const [name, setName] = useState(existingTeacher?.name || '');
  const [nip, setNip] = useState(existingTeacher?.nip || '');
  const [subject, setSubject] = useState(existingTeacher?.subject || COMMON_SUBJECTS[0]);
  const [customSubject, setCustomSubject] = useState('');
  const [phone, setPhone] = useState(existingTeacher?.phone || '');
  const [role, setRole] = useState<'admin' | 'guru'>(existingTeacher?.role || 'guru');
  const [username, setUsername] = useState(existingTeacher?.username || '');
  const [password, setPassword] = useState(existingTeacher?.password || '');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Silakan masukkan nama lengkap dan gelar guru.');
      return;
    }

    const finalSubject = subject === 'Lainnya' ? customSubject.trim() : subject;
    if (!finalSubject) {
      setErrorMessage('Silakan pilih atau isi mata pelajaran yang diampu.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) {
      setErrorMessage('Silakan isi username login untuk guru.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Silakan isi password login.');
      return;
    }

    // Check duplicate username if adding or changing username
    const allTeachers = StorageService.getTeachers();
    const isDuplicate = allTeachers.some(
      (t) => t.username.toLowerCase() === cleanUsername && (!isEditing || t.id !== existingTeacher?.id)
    );

    if (isDuplicate) {
      setErrorMessage(`Username "${cleanUsername}" sudah digunakan oleh guru lain. Silakan gunakan username lain.`);
      return;
    }

    if (isEditing && existingTeacher) {
      const updated = StorageService.updateTeacher(existingTeacher.id, {
        name: name.trim(),
        nip: nip.trim() || undefined,
        subject: finalSubject,
        phone: phone.trim() || undefined,
        role,
        username: cleanUsername,
        password: password.trim(),
      });
      onSaveSuccess(updated);
    } else {
      const created = StorageService.addTeacher({
        name: name.trim(),
        schoolName: 'SMP N 1 Adiluwih Pringsewu',
        nip: nip.trim() || undefined,
        subject: finalSubject,
        phone: phone.trim() || undefined,
        role,
        username: cleanUsername,
        password: password.trim(),
      });
      onSaveSuccess(created);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
              <UserPlus className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isEditing ? 'Edit Data Akun Guru' : 'Tambah Akun Guru Baru'}
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Portal Guru Spensadil • SMP N 1 Adiluwih Pringsewu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Nama Guru */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Nama Lengkap & Gelar <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso, S.Pd."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* NIP & No HP Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                NIP / NUPTK (Opsional)
              </label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="19820315 200801 1 012"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                No. WhatsApp / HP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Mata Pelajaran */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Mata Pelajaran yang Diampu <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <select
                value={COMMON_SUBJECTS.includes(subject) ? subject : 'Lainnya'}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              >
                {COMMON_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value="Lainnya">+ Mata Pelajaran Lainnya...</option>
              </select>
            </div>
            {subject === 'Lainnya' && (
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Ketik nama mata pelajaran baru..."
                className="mt-2 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            )}
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Peran / Hak Akses
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs cursor-pointer transition ${
                  role === 'guru'
                    ? 'border-indigo-500 bg-indigo-50/70 text-indigo-950 font-semibold'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="guru"
                  checked={role === 'guru'}
                  onChange={() => setRole('guru')}
                  className="text-indigo-600"
                />
                <div>
                  <p>Guru Mata Pelajaran</p>
                  <p className="text-[10px] text-slate-500 font-normal">Kelola tugas mapel</p>
                </div>
              </label>

              <label
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs cursor-pointer transition ${
                  role === 'admin'
                    ? 'border-indigo-500 bg-indigo-50/70 text-indigo-950 font-semibold'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="text-indigo-600"
                />
                <div>
                  <p>Admin Sekolah / Kurikulum</p>
                  <p className="text-[10px] text-slate-500 font-normal">Akses penuh sistem</p>
                </div>
              </label>
            </div>
          </div>

          {/* Kredensial Akun Login */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              Kredensial Login Guru
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username Login <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="misal: budi"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password Login <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="misal: guru123"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Gunakan username dan password ini pada halaman login Portal Guru Spensadil.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan' : 'Daftarkan Guru'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
