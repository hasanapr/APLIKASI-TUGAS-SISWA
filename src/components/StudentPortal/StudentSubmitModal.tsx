import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Send,
  Camera,
  Download,
  Award,
  MessageSquareQuote,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AssignmentFolder, Student, Submission } from '../../types';
import { StorageService } from '../../services/storage';

interface StudentSubmitModalProps {
  folder: AssignmentFolder;
  student: Student;
  existingSubmission?: Submission;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const StudentSubmitModal: React.FC<StudentSubmitModalProps> = ({
  folder,
  student,
  existingSubmission,
  onClose,
  onSubmitSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
    dataUrl?: string;
  } | null>(
    existingSubmission
      ? {
          name: existingSubmission.fileName,
          size: existingSubmission.fileSize,
          type: existingSubmission.fileType,
          dataUrl: existingSubmission.fileData,
        }
      : null
  );

  const [studentNotes, setStudentNotes] = useState(existingSubmission?.studentNotes || '');
  const [externalLink, setExternalLink] = useState(existingSubmission?.externalLink || '');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDeadlinePassed = new Date() > new Date(folder.deadline);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (e.g. limit to folder.maxFileSizeMB)
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > folder.maxFileSizeMB) {
      setErrorMessage(
        `Ukuran file terlalu besar (${sizeInMB.toFixed(1)} MB). Batas maksimum adalah ${folder.maxFileSizeMB} MB.`
      );
      return;
    }

    const formatFileSize = (bytes: number) => {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || 'application/octet-stream',
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedFile && !externalLink.trim()) {
      setErrorMessage('Silakan pilih file tugas atau masukkan tautan tugas Anda.');
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      StorageService.submitAssignment({
        folderId: folder.id,
        studentId: student.id,
        studentName: student.name,
        studentClass: student.class,
        fileName: selectedFile ? selectedFile.name : 'Tautan Dokumen Tugas',
        fileSize: selectedFile ? selectedFile.size : 'Tautan Web',
        fileType: selectedFile ? selectedFile.type : 'link',
        fileData: selectedFile?.dataUrl,
        studentNotes: studentNotes.trim(),
        externalLink: externalLink.trim(),
      });

      setIsUploading(false);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore confetti errors
      }

      onSubmitSuccess();
    }, 400);
  };

  const deadlineDate = new Date(folder.deadline);
  const formattedDeadline = deadlineDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {folder.subject} • {folder.targetClass}
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
              {folder.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-slate-700 text-sm">
          {/* Instructions Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Petunjuk Guru
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {folder.description}
            </p>

            {folder.teacherAttachmentName && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {folder.teacherAttachmentName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Lampiran Materi Guru {folder.teacherAttachmentSize ? `• ${folder.teacherAttachmentSize}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Mengunduh file materi: ${folder.teacherAttachmentName}`)}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </button>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Tenggat: {formattedDeadline}
              </span>
              {isDeadlinePassed && (
                <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full font-semibold">
                  Tenggat Terlewat
                </span>
              )}
            </div>
          </div>

          {/* If already graded, show grade and feedback banner */}
          {existingSubmission && existingSubmission.grade !== undefined && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-sm">Hasil Penilaian Guru</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-700">
                    {existingSubmission.grade}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold">/100</span>
                </div>
              </div>

              {existingSubmission.feedback && (
                <div className="mt-2 bg-white/80 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2">
                  <MessageSquareQuote className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-900">Catatan dari Guru:</p>
                    <p className="mt-0.5 italic">"{existingSubmission.feedback}"</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Pengumpulan */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Unggah File Tugas
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={
                  folder.allowedFileType === 'pdf'
                    ? '.pdf'
                    : folder.allowedFileType === 'image'
                    ? 'image/*'
                    : folder.allowedFileType === 'doc'
                    ? '.doc,.docx,.pdf,.txt'
                    : undefined
                }
                className="hidden"
              />

              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-blue-50/30 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-3 group-hover:scale-105 transition">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Klik untuk memilih file dokumen atau foto tugas
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Mendukung format{' '}
                    {folder.allowedFileType === 'pdf'
                      ? 'PDF'
                      : folder.allowedFileType === 'image'
                      ? 'Foto / Gambar (JPG, PNG)'
                      : folder.allowedFileType === 'doc'
                      ? 'Word DOCX / PDF'
                      : 'Semua jenis file'}{' '}
                    (Maks. {folder.maxFileSizeMB} MB)
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5 text-blue-600" />
                      <span>Foto / Ambil File</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {selectedFile.size} • Siap dikirimkan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-2 py-1"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Optional External Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Tautan Tambahan (Opsional)
              </label>
              <input
                type="url"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                placeholder="https://drive.google.com/... atau link dokumen tugas"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            {/* Student Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Catatan untuk Guru (Opsional)
              </label>
              <textarea
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                rows={2}
                placeholder="Tulis pesan atau keterangan terkait tugas Anda..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-70"
              >
                {isUploading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {existingSubmission ? 'Perbarui Pengumpulan Tugas' : 'Kirim Tugas Sekarang'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
