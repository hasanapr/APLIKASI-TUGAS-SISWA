import React, { useState, useRef } from 'react';
import { X, Upload, RotateCcw, Check, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { StorageService } from '../../services/storage';

interface AppLogoModalProps {
  currentLogo: string;
  onClose: () => void;
  onLogoUpdated: (newLogoUrl: string) => void;
  showToast: (msg: string) => void;
}

export const AppLogoModal: React.FC<AppLogoModalProps> = ({
  currentLogo,
  onClose,
  onLogoUpdated,
  showToast,
}) => {
  const [selectedLogo, setSelectedLogo] = useState<string>(currentLogo);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultLogo = '/spensadil_logo.png';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setErrorMsg('');
    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Berkas harus berupa gambar (PNG, JPG, JPEG, SVG, atau WebP).');
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Ukuran file gambar maksimal 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedLogo(reader.result);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca berkas gambar. Silakan coba lagi.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSave = () => {
    if (selectedLogo === defaultLogo) {
      StorageService.resetAppLogo();
    } else {
      StorageService.setAppLogo(selectedLogo);
    }
    onLogoUpdated(selectedLogo);
    showToast('Logo aplikasi berhasil diperbarui di semua portal!');
    onClose();
  };

  const handleResetToDefault = () => {
    setSelectedLogo(defaultLogo);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">Ubah Logo Aplikasi</h3>
              <p className="text-[11px] text-indigo-200">Kustomisasi Logo Sekolah & Portal Spensadil</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Live Preview Container */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pratinjau Logo Terpilih
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Preview on Light card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400 font-semibold mb-2">Latar Terang (Login & Dashboard)</span>
                <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-sm border border-slate-200 flex items-center justify-center">
                  <img
                    src={selectedLogo}
                    alt="Pratinjau Logo"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = defaultLogo;
                    }}
                  />
                </div>
                <p className="text-[11px] font-bold text-slate-700 mt-2">SMP N 1 Adiluwih</p>
              </div>

              {/* Preview on Dark Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center text-center text-white">
                <span className="text-[10px] text-slate-400 font-semibold mb-2">Latar Gelap (Top Bar & Banner)</span>
                <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-sm border border-white/20 flex items-center justify-center">
                  <img
                    src={selectedLogo}
                    alt="Pratinjau Logo Gelap"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = defaultLogo;
                    }}
                  />
                </div>
                <p className="text-[11px] font-bold text-slate-200 mt-2">Portal Spensadil</p>
              </div>
            </div>
          </div>

          {/* Upload Box (Drag & Drop or Click) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Unggah Logo Baru Dari Komputer / HP
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Klik untuk memilih gambar atau seret ke sini
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Mendukung PNG, JPG, WebP, SVG (Maks. 2MB)
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Reset to Default Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Gunakan Logo Bawaan Spensadil</span>
            </button>

            {selectedLogo === defaultLogo && (
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Logo Bawaan Terpilih</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/20 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Logo Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
