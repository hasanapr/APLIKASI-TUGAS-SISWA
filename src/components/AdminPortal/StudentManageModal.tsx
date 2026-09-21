import React, { useState } from 'react';
import {
  X,
  UserPlus,
  UserCheck,
  Calendar,
  Hash,
  School,
  Phone,
  Save,
  Info,
  AlertCircle,
  ShieldCheck,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Student } from '../../types';
import { StorageService } from '../../services/storage';
import { validateStudentForm, StudentValidationErrors } from '../../utils/studentValidation';

interface StudentManageModalProps {
  existingStudent?: Student;
  availableClasses: string[];
  onClose: () => void;
  onSaveSuccess: () => void;
}

export const StudentManageModal: React.FC<StudentManageModalProps> = ({
  existingStudent,
  availableClasses,
  onClose,
  onSaveSuccess,
}) => {
  const [name, setName] = useState(existingStudent?.name || '');
  const [birthDate, setBirthDate] = useState(existingStudent?.birthDate || '2008-01-01');
  const [nisn, setNisn] = useState(existingStudent?.nisn || '');
  const [studentClass, setStudentClass] = useState(existingStudent?.class || 'X MIPA 1');
  const [customClass, setCustomClass] = useState('');
  const [phone, setPhone] = useState(existingStudent?.phone || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(existingStudent?.status || 'active');
  const [gender, setGender] = useState<'L' | 'P'>(existingStudent?.gender || 'L');
  const [address, setAddress] = useState(existingStudent?.address || '');

  const [fieldErrors, setFieldErrors] = useState<StudentValidationErrors>({});
  const [globalError, setGlobalError] = useState('');

  const allStudents = StorageService.getStudents();

  const classOptions = Array.from(
    new Set([
      ...availableClasses.filter((c) => c !== 'Semua Kelas'),
      'X MIPA 1',
      'X MIPA 2',
      'XI MIPA 1',
      'XI MIPA 2',
      'XII MIPA 1',
      'XII MIPA 2',
    ])
  );

  // Calculate age helper
  const calculateAge = (dateStr: string) => {
    if (!dateStr) return null;
    const bDate = new Date(dateStr);
    if (isNaN(bDate.getTime())) return null;
    const diff = Date.now() - bDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const calculatedAge = calculateAge(birthDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    const targetClass = studentClass === 'Lainnya' ? customClass.trim() : studentClass;

    const validationResult = validateStudentForm(
      {
        name,
        birthDate,
        nisn,
        class: targetClass,
        phone,
        status,
        gender,
        address,
      },
      allStudents,
      existingStudent?.id
    );

    if (!validationResult.isValid) {
      setFieldErrors(validationResult.errors);
      setGlobalError('Terdapat data yang belum sesuai. Silakan periksa kolom yang ditandai merah.');
      return;
    }

    setFieldErrors({});

    if (existingStudent) {
      StorageService.updateStudent(existingStudent.id, {
        name: name.trim(),
        birthDate: birthDate.trim(),
        nisn: nisn.trim(),
        class: targetClass,
        phone: phone.trim() || undefined,
        status,
        gender,
        address: address.trim() || undefined,
      });
    } else {
      StorageService.addStudent({
        name: name.trim(),
        birthDate: birthDate.trim(),
        nisn: nisn.trim(),
        class: targetClass,
        phone: phone.trim() || undefined,
        status,
        gender,
        address: address.trim() || undefined,
      });
    }

    onSaveSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              {existingStudent ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {existingStudent ? 'Edit Data Pengguna Siswa' : 'Tambah Siswa Baru'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {existingStudent ? 'Perbarui informasi profil & kredensial login' : 'Mendaftarkan siswa sebagai acuan akun login'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Information box: Login mapping */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3.5 text-indigo-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-indigo-900">Kredensial Login Siswa:</strong>
              <ul className="list-disc list-inside mt-0.5 text-indigo-800 space-y-0.5">
                <li>
                  Username Siswa: <strong>Nama Lengkap</strong> yang didaftarkan.
                </li>
                <li>
                  Password Siswa: <strong>Tanggal Lahir</strong> (format YYYY-MM-DD).
                </li>
              </ul>
            </div>
          </div>

          {globalError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{globalError}</span>
            </div>
          )}

          {/* Status Akun Siswa (Aktif / Tidak Aktif) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
            <label className="block font-bold text-slate-700 mb-2 uppercase tracking-wider text-[10px]">
              Status Akun Siswa *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                  status === 'active'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aktif (Bisa Login)</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('inactive')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                  status === 'inactive'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Tidak Aktif (Blokir Login)</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">
              {status === 'active'
                ? 'Siswa ini dapat mengakses portal tugas siswa secara normal.'
                : 'Siswa dinonaktifkan dan akan ditolak saat mencoba login ke aplikasi siswa.'}
            </p>
          </div>

          {/* Nama Lengkap Siswa */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Nama Lengkap Siswa (Username Login) *
              </label>
              <span className="text-[10px] text-slate-400">{name.length}/60 karakter</span>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
              }}
              placeholder="Contoh: Muhammad Rizky Pratama"
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white transition ${
                fieldErrors.name
                  ? 'border-rose-400 ring-2 ring-rose-200'
                  : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
              }`}
            />
            {fieldErrors.name && (
              <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Tanggal Lahir (Password Siswa) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Tanggal Lahir (Password Login Siswa) *
              </label>
              {calculatedAge !== null && !isNaN(calculatedAge) && (
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Usia: ±{calculatedAge} Tahun
                </span>
              )}
            </div>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                if (fieldErrors.birthDate) setFieldErrors({ ...fieldErrors, birthDate: undefined });
              }}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white transition ${
                fieldErrors.birthDate
                  ? 'border-rose-400 ring-2 ring-rose-200'
                  : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
              }`}
            />
            {fieldErrors.birthDate ? (
              <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {fieldErrors.birthDate}
              </p>
            ) : (
              <p className="text-[10px] text-slate-400 mt-1">
                Siswa memasukkan tanggal lahir ini sebagai kata sandi login (format: YYYY-MM-DD).
              </p>
            )}
          </div>

          {/* NISN & Kelas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                NISN / No Induk *
              </label>
              <input
                type="text"
                value={nisn}
                onChange={(e) => {
                  setNisn(e.target.value);
                  if (fieldErrors.nisn) setFieldErrors({ ...fieldErrors, nisn: undefined });
                }}
                placeholder="0081234567"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white transition ${
                  fieldErrors.nisn
                    ? 'border-rose-400 ring-2 ring-rose-200'
                    : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
              {fieldErrors.nisn && (
                <p className="text-[10px] text-rose-600 font-semibold mt-1">
                  {fieldErrors.nisn}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Kelas *
              </label>
              <select
                value={studentClass}
                onChange={(e) => {
                  setStudentClass(e.target.value);
                  if (fieldErrors.class) setFieldErrors({ ...fieldErrors, class: undefined });
                }}
                className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white transition ${
                  fieldErrors.class
                    ? 'border-rose-400 ring-2 ring-rose-200'
                    : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              >
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="Lainnya">+ Tambah Kelas Lain</option>
              </select>
              {studentClass === 'Lainnya' && (
                <input
                  type="text"
                  value={customClass}
                  onChange={(e) => setCustomClass(e.target.value)}
                  placeholder="Ketik nama kelas baru"
                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
              )}
              {fieldErrors.class && (
                <p className="text-[10px] text-rose-600 font-semibold mt-1">
                  {fieldErrors.class}
                </p>
              )}
            </div>
          </div>

          {/* Jenis Kelamin & No WhatsApp */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Jenis Kelamin
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setGender('L')}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition ${
                    gender === 'L'
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Laki-laki
                </button>
                <button
                  type="button"
                  onClick={() => setGender('P')}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition ${
                    gender === 'P'
                      ? 'bg-pink-50 border-pink-500 text-pink-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Perempuan
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                No. WhatsApp / HP
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
                }}
                placeholder="08123456789"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white transition ${
                  fieldErrors.phone
                    ? 'border-rose-400 ring-2 ring-rose-200'
                    : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
              {fieldErrors.phone && (
                <p className="text-[10px] text-rose-600 font-semibold mt-1">
                  {fieldErrors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Alamat Siswa (Opsional) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Alamat / Keterangan Domisili (Opsional)
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Jl. Merdeka No. 12, RT 02/05"
              rows={2}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>{existingStudent ? 'Simpan Perubahan' : 'Daftarkan Siswa'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
