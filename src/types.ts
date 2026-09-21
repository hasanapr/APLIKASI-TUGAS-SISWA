export interface Student {
  id: string;
  name: string; // Used as student login username
  birthDate: string; // Default student login password (YYYY-MM-DD)
  customPassword?: string; // Custom password set by admin or teacher
  nisn: string;
  class: string;
  phone?: string;
  avatarColor?: string;
  status: 'active' | 'inactive'; // Account status (active or inactive)
  gender?: 'L' | 'P';
  address?: string;
  createdAt: string;
}

export type FileTypeRestriction = 'all' | 'pdf' | 'image' | 'doc';

export interface TeacherAccount {
  id: string;
  username: string; // Unique login username
  password: string; // Login password
  name: string; // e.g. Dra. Hj. Sri Wahyuni, M.Pd.
  teacherName?: string; // Compatibility alias
  schoolName: string; // "SMP N 1 Adiluwih Pringsewu"
  nip?: string;
  subject: string; // e.g. "Matematika", "Bahasa Indonesia", etc.
  phone?: string;
  role: 'admin' | 'guru';
  avatarColor?: string;
  createdAt: string;
}

export type AdminAccount = TeacherAccount;

export interface AssignmentFolder {
  id: string;
  title: string;
  subject: string;
  targetClass: string;
  description: string;
  deadline: string; // ISO string e.g. 2026-09-25T23:59:00
  allowedFileType: FileTypeRestriction;
  maxFileSizeMB: number;
  teacherAttachmentName?: string;
  teacherAttachmentSize?: string;
  colorTheme?: string;
  teacherId?: string;
  teacherName?: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  folderId: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  fileData?: string; // Data URL / text representation for preview
  studentNotes?: string;
  externalLink?: string;
  grade?: number; // 0 - 100
  feedback?: string;
  gradedAt?: string;
  isLate: boolean;
}

export type AppPortal = 'student' | 'admin';
