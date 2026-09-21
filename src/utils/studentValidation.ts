import { Student } from '../types';

export interface StudentValidationErrors {
  name?: string;
  birthDate?: string;
  nisn?: string;
  class?: string;
  phone?: string;
  status?: string;
}

export interface StudentFormData {
  name: string;
  birthDate: string;
  nisn: string;
  class: string;
  phone?: string;
  status: 'active' | 'inactive';
  gender?: 'L' | 'P';
  address?: string;
}

export function validateStudentForm(
  data: StudentFormData,
  existingStudents: Student[],
  currentStudentId?: string
): { isValid: boolean; errors: StudentValidationErrors } {
  const errors: StudentValidationErrors = {};

  // 1. Validate Name
  const trimmedName = data.name.trim();
  if (!trimmedName) {
    errors.name = 'Nama lengkap siswa wajib diisi.';
  } else if (trimmedName.length < 3) {
    errors.name = 'Nama siswa terlalu pendek (minimal 3 karakter).';
  } else if (trimmedName.length > 60) {
    errors.name = 'Nama siswa maksimal 60 karakter.';
  } else if (!/^[a-zA-Z\s'’.\-]+$/.test(trimmedName)) {
    errors.name = 'Nama hanya boleh mengandung huruf, spasi, titik, tanda petik, dan strip.';
  }

  // 2. Validate Birth Date
  const trimmedBirthDate = data.birthDate.trim();
  if (!trimmedBirthDate) {
    errors.birthDate = 'Tanggal lahir wajib diisi (digunakan sebagai password login).';
  } else {
    const birthDateObj = new Date(trimmedBirthDate);
    const now = new Date();
    if (isNaN(birthDateObj.getTime())) {
      errors.birthDate = 'Format tanggal lahir tidak valid.';
    } else if (birthDateObj > now) {
      errors.birthDate = 'Tanggal lahir tidak boleh di masa mendatang.';
    } else {
      const birthYear = birthDateObj.getFullYear();
      const currentYear = now.getFullYear();
      const age = currentYear - birthYear;
      if (age < 5) {
        errors.birthDate = 'Usia siswa minimal 5 tahun.';
      } else if (age > 35) {
        errors.birthDate = 'Tahun lahir tidak wajar untuk jenjang siswa (maksimal 35 tahun).';
      }
    }
  }

  // 3. Validate NISN
  const trimmedNisn = data.nisn.trim();
  if (!trimmedNisn) {
    errors.nisn = 'NISN / Nomor Induk Siswa wajib diisi.';
  } else if (!/^\d{4,15}$/.test(trimmedNisn)) {
    errors.nisn = 'NISN harus berupa angka (antara 4 hingga 15 digit).';
  } else {
    // Check uniqueness
    const duplicateNisn = existingStudents.find(
      (s) => s.id !== currentStudentId && s.nisn.trim() === trimmedNisn
    );
    if (duplicateNisn) {
      errors.nisn = `NISN ${trimmedNisn} sudah terdaftar untuk siswa "${duplicateNisn.name}".`;
    }
  }

  // 4. Validate Class
  const trimmedClass = data.class.trim();
  if (!trimmedClass) {
    errors.class = 'Kelas wajib dipilih atau ditentukan.';
  }

  // 5. Validate Phone (Optional)
  if (data.phone && data.phone.trim()) {
    const cleanPhone = data.phone.trim().replace(/[\s\-()]/g, '');
    if (!/^(?:\+62|62|08)\d{7,13}$/.test(cleanPhone)) {
      errors.phone = 'Nomor telepon tidak valid. Gunakan format diawali 08 atau +62 (9-14 digit).';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
