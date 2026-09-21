import React, { useState } from 'react';
import { X, FolderPlus, Calendar, Clock, BookOpen, Users, FileType, Paperclip, Save } from 'lucide-react';
import { AssignmentFolder, FileTypeRestriction } from '../../types';
import { StorageService } from '../../services/storage';

interface CreateFolderModalProps {
  existingFolder?: AssignmentFolder;
  availableClasses: string[];
  onClose: () => void;
  onSaveSuccess: () => void;
}

const COMMON_SUBJECTS = [
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'Fisika',
  'Kimia',
  'Biologi',
  'Sejarah',
  'Sosiologi',
  'Ekonomi',
  'Geografi',
  'Informatika',
  'Pendidikan Agama',
  'PPKn',
  'Seni Budaya',
  'PJOK',
];

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  existingFolder,
  availableClasses,
  onClose,
  onSaveSuccess,
}) => {
  const activeTeacher = StorageService.getActiveTeacher();
  const [title, setTitle] = useState(existingFolder?.title || '');
  const [subject, setSubject] = useState(
    existingFolder?.subject || activeTeacher?.subject?.split('&')[0]?.trim() || 'Matematika'
  );
  const [customSubject, setCustomSubject] = useState('');
  const [targetClass, setTargetClass] = useState(existingFolder?.targetClass || 'Semua Kelas');
  const [description, setDescription] = useState(existingFolder?.description || '');
  
  // Default deadline 3 days from now if new
  const defaultDeadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  const [deadline, setDeadline] = useState(existingFolder?.deadline || defaultDeadline);
  
  const [allowedFileType, setAllowedFileType] = useState<FileTypeRestriction>(
    existingFolder?.allowedFileType || 'all'
  );
  const [maxFileSizeMB, setMaxFileSizeMB] = useState(existingFolder?.maxFileSizeMB || 10);
  const [teacherAttachmentName, setTeacherAttachmentName] = useState(
    existingFolder?.teacherAttachmentName || ''
  );
  const [errorMessage, setErrorMessage] = useState('');

  const classOptions = ['Semua Kelas', ...availableClasses.filter((c) => c !== 'Semua Kelas')];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Silakan isi judul folder tugas.');
      return;
    }

    const finalSubject = subject === 'Lainnya' ? customSubject.trim() : subject;
    if (!finalSubject) {
      setErrorMessage('Silakan tentukan mata pelajaran.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Silakan isi petunjuk / deskripsi pengerjaan tugas.');
      return;
    }

    if (!deadline) {
      setErrorMessage('Silakan tentukan batas tenggat waktu pengumpulan.');
      return;
    }

    if (existingFolder) {
      StorageService.updateFolder(existingFolder.id, {
        title: title.trim(),
        subject: finalSubject,
        targetClass,
        description: description.trim(),
        deadline,
        allowedFileType,
        maxFileSizeMB,
        teacherAttachmentName: teacherAttachmentName.trim() || undefined,
      });
    } else {
      StorageService.addFolder({
        title: title.trim(),
        subject: finalSubject,
        targetClass,
        description: description.trim(),
        deadline,
        allowedFileType,
        maxFileSizeMB,
        teacherAttachmentName: teacherAttachmentName.trim() || undefined,
        teacherAttachmentSize: teacherAttachmentName.trim() ? '1.2 MB' : undefined,
        teacherId: activeTeacher.id,
        teacherName: activeTeacher.name,
      });
    }

    onSaveSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {existingFolder ? 'Edit Folder Tugas' : 'Buat Folder Tugas Baru'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {/* Judul Folder Tugas */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Judul Tugas / Folder *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Tugas 1: Praktikum Gerak Parabola"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Grid: Mata Pelajaran & Target Kelas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Mata Pelajaran *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                {COMMON_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value="Lainnya">+ Mata Pelajaran Lainnya</option>
              </select>
              {subject === 'Lainnya' && (
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Ketik nama mata pelajaran"
                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Target Kelas *
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Deskripsi & Petunjuk Tugas */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Petunjuk & Deskripsi Pengerjaan *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan instruksi pengerjaan tugas, format yang diharapkan, dan rubrik penilaian..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Tenggat Waktu (Deadline) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Tenggat Waktu Pengumpulan (Deadline) *
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Format File Diterima */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Jenis File Diterima
              </label>
              <select
                value={allowedFileType}
                onChange={(e) => setAllowedFileType(e.target.value as FileTypeRestriction)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="all">Semua Format File</option>
                <option value="pdf">Hanya PDF (.pdf)</option>
                <option value="image">Foto / Gambar (JPG, PNG)</option>
                <option value="doc">Dokumen Word / Teks (.docx, .doc, .txt)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Batas Ukuran File
              </label>
              <select
                value={maxFileSizeMB}
                onChange={(e) => setMaxFileSizeMB(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value={5}>Maksimum 5 MB</option>
                <option value={10}>Maksimum 10 MB</option>
                <option value={20}>Maksimum 20 MB</option>
                <option value={50}>Maksimum 50 MB</option>
              </select>
            </div>
          </div>

          {/* Lampiran Materi Guru (Opsional) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Lampiran Soal / Modul Guru (Opsional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={teacherAttachmentName}
                onChange={(e) => setTeacherAttachmentName(e.target.value)}
                placeholder="Contoh: Soal_Praktikum_Bab2.pdf"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              File ini akan dapat diunduh oleh siswa di aplikasi mereka sebagai materi acuan tugas.
            </p>
          </div>

          {/* Submit buttons */}
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
              className="flex-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>{existingFolder ? 'Simpan Perubahan' : 'Buat Folder Tugas'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
