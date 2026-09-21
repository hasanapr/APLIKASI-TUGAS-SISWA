import { AdminAccount, AssignmentFolder, Student, Submission, TeacherAccount } from '../types';

const STORAGE_KEYS = {
  ADMIN: 'kumputugas_admin',
  TEACHERS: 'spensadil_teachers',
  ACTIVE_TEACHER: 'spensadil_active_teacher',
  STUDENTS: 'kumputugas_students',
  FOLDERS: 'kumputugas_folders',
  SUBMISSIONS: 'kumputugas_submissions',
  ACTIVE_STUDENT: 'kumputugas_active_student',
  IS_ADMIN_LOGGED_IN: 'kumputugas_admin_logged_in',
  APP_LOGO: 'spensadil_app_logo',
};

export const INITIAL_TEACHERS: TeacherAccount[] = [
  {
    id: 'teacher-1',
    username: 'admin',
    password: 'admin',
    name: 'Dra. Hj. Sri Wahyuni, M.Pd.',
    teacherName: 'Dra. Hj. Sri Wahyuni, M.Pd.',
    schoolName: 'SMP N 1 Adiluwih Pringsewu',
    nip: '19680512 199403 2 001',
    subject: 'IPA & Manajemen Sekolah',
    role: 'admin',
    avatarColor: 'bg-indigo-600',
    createdAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'teacher-2',
    username: 'budi',
    password: 'guru123',
    name: 'Budi Santoso, S.Pd.',
    teacherName: 'Budi Santoso, S.Pd.',
    schoolName: 'SMP N 1 Adiluwih Pringsewu',
    nip: '19820315 200801 1 012',
    subject: 'Matematika',
    role: 'guru',
    avatarColor: 'bg-emerald-600',
    createdAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'teacher-3',
    username: 'siti',
    password: 'guru123',
    name: 'Siti Rahmawati, M.Pd.',
    teacherName: 'Siti Rahmawati, M.Pd.',
    schoolName: 'SMP N 1 Adiluwih Pringsewu',
    nip: '19850720 201001 2 018',
    subject: 'Bahasa Indonesia',
    role: 'guru',
    avatarColor: 'bg-rose-600',
    createdAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'teacher-4',
    username: 'hasan',
    password: 'guru123',
    name: 'Hasan Apriyanto, S.Kom.',
    teacherName: 'Hasan Apriyanto, S.Kom.',
    schoolName: 'SMP N 1 Adiluwih Pringsewu',
    nip: '19920410 201903 1 005',
    subject: 'Informatika & TIK',
    role: 'guru',
    avatarColor: 'bg-blue-600',
    createdAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'teacher-5',
    username: 'agus',
    password: 'guru123',
    name: 'Agus Kurniawan, S.Pd.',
    teacherName: 'Agus Kurniawan, S.Pd.',
    schoolName: 'SMP N 1 Adiluwih Pringsewu',
    nip: '19891105 201504 1 003',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    role: 'guru',
    avatarColor: 'bg-amber-600',
    createdAt: '2026-08-01T08:00:00.000Z',
  },
];

export const INITIAL_ADMIN: AdminAccount = INITIAL_TEACHERS[0];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    name: 'Ahmad Fauzi',
    birthDate: '2011-05-15',
    nisn: '0111234561',
    class: 'IX A',
    phone: '081234567801',
    avatarColor: 'bg-emerald-500',
    status: 'active',
    gender: 'L',
    createdAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'std-2',
    name: 'Siti Nurhaliza',
    birthDate: '2011-11-20',
    nisn: '0111234562',
    class: 'IX A',
    phone: '081234567802',
    avatarColor: 'bg-rose-500',
    status: 'active',
    gender: 'P',
    createdAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'std-3',
    name: 'Budi Santoso',
    birthDate: '2012-08-10',
    nisn: '0121234563',
    class: 'VIII B',
    phone: '081234567803',
    avatarColor: 'bg-blue-500',
    status: 'active',
    gender: 'L',
    createdAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'std-4',
    name: 'Dewi Lestari',
    birthDate: '2011-01-25',
    nisn: '0111234564',
    class: 'IX A',
    phone: '081234567804',
    avatarColor: 'bg-purple-500',
    status: 'active',
    gender: 'P',
    createdAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'std-5',
    name: 'Rian Pratama',
    birthDate: '2012-12-04',
    nisn: '0121234565',
    class: 'VIII B',
    phone: '081234567805',
    avatarColor: 'bg-amber-500',
    status: 'inactive',
    gender: 'L',
    createdAt: '2026-08-01T08:00:00.000Z',
  },
];

const deadlineIPA = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
const deadlineBindo = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
const deadlineMatematika = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
const deadlineInformatika = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

export const INITIAL_FOLDERS: AssignmentFolder[] = [
  {
    id: 'folder-1',
    title: 'Tugas 1: Praktikum Gaya dan Gerak Lurus',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    targetClass: 'IX A',
    description: 'Kumpulkan laporan hasil eksperimen mandiri format PDF beserta dokumentasi foto langkah kerja dan analisis data percobaan hukum Newton.',
    deadline: deadlineIPA,
    allowedFileType: 'pdf',
    maxFileSizeMB: 10,
    teacherAttachmentName: 'Panduan_Praktikum_IPA_Gerak.pdf',
    teacherAttachmentSize: '1.4 MB',
    colorTheme: 'indigo',
    teacherId: 'teacher-1',
    teacherName: 'Dra. Hj. Sri Wahyuni, M.Pd.',
    createdAt: '2026-09-18T08:00:00.000Z',
  },
  {
    id: 'folder-2',
    title: 'Esai Argumentasi: Pemanfaatan AI & Literasi Digital',
    subject: 'Bahasa Indonesia',
    targetClass: 'Semua Kelas',
    description: 'Tulis esai argumentatif minimal 500 kata mengenai peluang dan etika penggunaan AI bagi pelajar SMP N 1 Adiluwih. Sertakan referensi yang jelas.',
    deadline: deadlineBindo,
    allowedFileType: 'doc',
    maxFileSizeMB: 15,
    teacherAttachmentName: 'Rubrik_Penilaian_Esai_Argumentasi.pdf',
    teacherAttachmentSize: '850 KB',
    colorTheme: 'blue',
    teacherId: 'teacher-3',
    teacherName: 'Siti Rahmawati, M.Pd.',
    createdAt: '2026-09-19T09:30:00.000Z',
  },
  {
    id: 'folder-3',
    title: 'Latihan Soal Aljabar & Teorema Pythagoras',
    subject: 'Matematika',
    targetClass: 'VIII B',
    description: 'Kerjakan soal latihan halaman 48 No. 1 sampai 10 di buku catatan. Foto atau scan secara rapi dan pastikan tulisan terbaca jelas.',
    deadline: deadlineMatematika,
    allowedFileType: 'image',
    maxFileSizeMB: 20,
    teacherAttachmentName: 'Latihan_Pythagoras_SMP.pdf',
    teacherAttachmentSize: '620 KB',
    colorTheme: 'emerald',
    teacherId: 'teacher-2',
    teacherName: 'Budi Santoso, S.Pd.',
    createdAt: '2026-09-20T11:00:00.000Z',
  },
  {
    id: 'folder-4',
    title: 'Proyek Algoritma: Pemrograman Visual Scratch',
    subject: 'Informatika & TIK',
    targetClass: 'Semua Kelas',
    description: 'Kirimkan laporan file atau screenshot proyek animasi interaktif Scratch bertema kegiatan belajar di SPENSADIL.',
    deadline: deadlineInformatika,
    allowedFileType: 'all',
    maxFileSizeMB: 25,
    teacherAttachmentName: 'Modul_Scratch_Spensadil.pdf',
    teacherAttachmentSize: '2.1 MB',
    colorTheme: 'violet',
    teacherId: 'teacher-4',
    teacherName: 'Hasan Apriyanto, S.Kom.',
    createdAt: '2026-09-20T14:00:00.000Z',
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    folderId: 'folder-1',
    studentId: 'std-1',
    studentName: 'Ahmad Fauzi',
    studentClass: 'IX A',
    submittedAt: '2026-09-19T14:35:00.000Z',
    fileName: 'Laporan_IPA_Ahmad_Fauzi_IXA.pdf',
    fileSize: '2.3 MB',
    fileType: 'application/pdf',
    studentNotes: 'Sudah dilengkapi grafik analisis percobaan gerak lurus pada halaman 4 Bu guru.',
    grade: 95,
    feedback: 'Luar biasa! Grafik sangat detail, analisis data rapi dan kesimpulan sangat tepat.',
    gradedAt: '2026-09-20T08:15:00.000Z',
    isLate: false,
  },
  {
    id: 'sub-2',
    folderId: 'folder-2',
    studentId: 'std-2',
    studentName: 'Siti Nurhaliza',
    studentClass: 'IX A',
    submittedAt: '2026-09-20T16:20:00.000Z',
    fileName: 'Esai_AI_Literasi_Siti_Nurhaliza.docx',
    fileSize: '1.1 MB',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    studentNotes: 'Mohon koreksi dan arahannya Bu.',
    isLate: false,
  },
  {
    id: 'sub-3',
    folderId: 'folder-3',
    studentId: 'std-3',
    studentName: 'Budi Santoso',
    studentClass: 'VIII B',
    submittedAt: '2026-09-20T19:45:00.000Z',
    fileName: 'Jawaban_Pythagoras_Budi_Santoso.jpg',
    fileSize: '3.4 MB',
    fileType: 'image/jpeg',
    studentNotes: 'Sudah dikerjakan sampai nomor 10 lengkap dengan caranya Pak.',
    isLate: false,
  },
];

export const StorageService = {
  getTeachers(): TeacherAccount[] {
    const data = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(INITIAL_TEACHERS));
      return INITIAL_TEACHERS;
    }
    try {
      const parsed: TeacherAccount[] = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(INITIAL_TEACHERS));
        return INITIAL_TEACHERS;
      }
      return parsed;
    } catch {
      return INITIAL_TEACHERS;
    }
  },

  saveTeachers(teachers: TeacherAccount[]): void {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  },

  getActiveTeacher(): TeacherAccount {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_TEACHER);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && parsed.username) return parsed;
      } catch {
        // fallback
      }
    }
    const teachers = this.getTeachers();
    return teachers[0] || INITIAL_ADMIN;
  },

  setActiveTeacher(teacher: TeacherAccount | null): void {
    if (!teacher) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TEACHER);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TEACHER, JSON.stringify(teacher));
    }
  },

  verifyTeacherLogin(usernameInput: string, passwordInput: string): TeacherAccount | null {
    const teachers = this.getTeachers();
    const cleanUser = usernameInput.trim().toLowerCase();
    const matched = teachers.find(
      (t) => t.username.trim().toLowerCase() === cleanUser && t.password === passwordInput
    );
    if (matched) {
      this.setActiveTeacher(matched);
      this.setAdminLoggedIn(true);
      return matched;
    }
    return null;
  },

  addTeacher(teacherData: Omit<TeacherAccount, 'id' | 'createdAt'>): TeacherAccount {
    const teachers = this.getTeachers();
    const colors = ['bg-indigo-600', 'bg-blue-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-purple-600', 'bg-teal-600'];
    const newTeacher: TeacherAccount = {
      ...teacherData,
      id: 'teacher-' + Date.now(),
      teacherName: teacherData.name,
      avatarColor: teacherData.avatarColor || colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date().toISOString(),
    };
    teachers.push(newTeacher);
    this.saveTeachers(teachers);
    return newTeacher;
  },

  updateTeacher(id: string, updates: Partial<TeacherAccount>): TeacherAccount {
    const teachers = this.getTeachers();
    const updatedTeachers = teachers.map((t) => {
      if (t.id === id) {
        const updated = {
          ...t,
          ...updates,
          teacherName: updates.name || t.name,
        };
        return updated;
      }
      return t;
    });
    this.saveTeachers(updatedTeachers);

    // Sync active teacher if updated
    const active = this.getActiveTeacher();
    if (active && active.id === id) {
      const updatedActive = updatedTeachers.find((t) => t.id === id);
      if (updatedActive) {
        this.setActiveTeacher(updatedActive);
      }
    }

    const res = updatedTeachers.find((t) => t.id === id);
    return res || teachers[0];
  },

  deleteTeacher(id: string): { success: boolean; message: string } {
    const teachers = this.getTeachers();
    const target = teachers.find((t) => t.id === id);
    if (!target) {
      return { success: false, message: 'Akun guru tidak ditemukan.' };
    }

    const active = this.getActiveTeacher();
    if (active && active.id === id) {
      return {
        success: false,
        message: 'Tidak dapat menghapus akun guru yang sedang aktif digunakan saat ini. Silakan masuk menggunakan akun guru lain terlebih dahulu.',
      };
    }

    // Check if it's the last admin
    if (target.role === 'admin') {
      const adminCount = teachers.filter((t) => t.role === 'admin').length;
      if (adminCount <= 1) {
        return {
          success: false,
          message: 'Tidak dapat menghapus akun admin utama terakhir.',
        };
      }
    }

    const filtered = teachers.filter((t) => t.id !== id);
    this.saveTeachers(filtered);
    return { success: true, message: `Akun guru ${target.name} berhasil dihapus.` };
  },

  getAdminAccount(): AdminAccount {
    return this.getActiveTeacher();
  },

  updateAdminAccount(updated: AdminAccount | Partial<TeacherAccount>): void {
    const active = this.getActiveTeacher();
    if (active && active.id) {
      this.updateTeacher(active.id, updated);
    } else {
      localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(updated));
    }
  },

  getStudents(): Student[] {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    try {
      const parsed: Student[] = JSON.parse(data);
      return parsed.map((s) => ({
        ...s,
        status: s.status || 'active',
      }));
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  saveStudents(students: Student[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  addStudent(student: Omit<Student, 'id' | 'createdAt'>): Student {
    const students = this.getStudents();
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-purple-500', 'bg-teal-500'];
    const newStudent: Student = {
      ...student,
      id: 'std-' + Date.now(),
      status: student.status || 'active',
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date().toISOString(),
    };
    students.unshift(newStudent);
    this.saveStudents(students);
    return newStudent;
  },

  updateStudent(id: string, updated: Partial<Student>): void {
    const students = this.getStudents().map((s) => (s.id === id ? { ...s, ...updated } : s));
    this.saveStudents(students);
    
    // If active student was updated, keep active session in sync
    const active = this.getActiveStudent();
    if (active && active.id === id) {
      const updatedActive = students.find((s) => s.id === id);
      if (updatedActive) {
        if (updatedActive.status === 'inactive') {
          this.setActiveStudent(null);
        } else {
          this.setActiveStudent(updatedActive);
        }
      }
    }
  },

  deleteStudent(id: string): void {
    const students = this.getStudents().filter((s) => s.id !== id);
    this.saveStudents(students);
    // Cleanup submissions for this student
    const submissions = this.getSubmissions().filter((s) => s.studentId !== id);
    this.saveSubmissions(submissions);
    // If deleted student is currently logged in, clear active student
    const active = this.getActiveStudent();
    if (active && active.id === id) {
      this.setActiveStudent(null);
    }
  },

  deleteInactiveStudents(): number {
    const students = this.getStudents();
    const inactiveStudents = students.filter((s) => s.status === 'inactive');
    if (inactiveStudents.length === 0) return 0;
    
    const inactiveIds = new Set(inactiveStudents.map((s) => s.id));
    const remainingStudents = students.filter((s) => !inactiveIds.has(s.id));
    this.saveStudents(remainingStudents);

    // Also cleanup submissions for these inactive students
    const submissions = this.getSubmissions().filter((s) => !inactiveIds.has(s.studentId));
    this.saveSubmissions(submissions);

    // If active student was inactive, clear
    const active = this.getActiveStudent();
    if (active && inactiveIds.has(active.id)) {
      this.setActiveStudent(null);
    }

    return inactiveStudents.length;
  },

  toggleStudentStatus(id: string): 'active' | 'inactive' {
    const students = this.getStudents();
    const target = students.find((s) => s.id === id);
    if (!target) return 'active';

    const newStatus: 'active' | 'inactive' = target.status === 'active' ? 'inactive' : 'active';
    const updated = students.map((s) => (s.id === id ? { ...s, status: newStatus } : s));
    this.saveStudents(updated);

    // Sync active student session
    const active = this.getActiveStudent();
    if (active && active.id === id) {
      if (newStatus === 'inactive') {
        this.setActiveStudent(null);
      } else {
        const student = updated.find((s) => s.id === id);
        if (student) this.setActiveStudent(student);
      }
    }

    return newStatus;
  },

  getFolders(): AssignmentFolder[] {
    const data = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(INITIAL_FOLDERS));
      return INITIAL_FOLDERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_FOLDERS;
    }
  },

  saveFolders(folders: AssignmentFolder[]): void {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  },

  addFolder(folder: Omit<AssignmentFolder, 'id' | 'createdAt'>): AssignmentFolder {
    const folders = this.getFolders();
    const colors = ['indigo', 'blue', 'emerald', 'violet', 'teal', 'amber', 'rose'];
    const newFolder: AssignmentFolder = {
      ...folder,
      id: 'folder-' + Date.now(),
      colorTheme: folder.colorTheme || colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date().toISOString(),
    };
    folders.unshift(newFolder);
    this.saveFolders(folders);
    return newFolder;
  },

  updateFolder(id: string, updated: Partial<AssignmentFolder>): void {
    const folders = this.getFolders().map((f) => (f.id === id ? { ...f, ...updated } : f));
    this.saveFolders(folders);
  },

  deleteFolder(id: string): void {
    const folders = this.getFolders().filter((f) => f.id !== id);
    this.saveFolders(folders);
    // Also cleanup submissions for this folder
    const submissions = this.getSubmissions().filter((s) => s.folderId !== id);
    this.saveSubmissions(submissions);
  },

  getSubmissions(): Submission[] {
    const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  },

  saveSubmissions(submissions: Submission[]): void {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  },

  submitAssignment(submission: Omit<Submission, 'id' | 'submittedAt' | 'isLate'>): Submission {
    const submissions = this.getSubmissions();
    const folders = this.getFolders();
    const targetFolder = folders.find((f) => f.id === submission.folderId);
    const now = new Date();
    const isLate = targetFolder ? now > new Date(targetFolder.deadline) : false;

    // Check if student already submitted for this folder - update or create new
    const existingIndex = submissions.findIndex(
      (s) => s.folderId === submission.folderId && s.studentId === submission.studentId
    );

    const newSub: Submission = {
      ...submission,
      id: existingIndex >= 0 ? submissions[existingIndex].id : 'sub-' + Date.now(),
      submittedAt: now.toISOString(),
      isLate,
      // preserve grade/feedback if re-submitting and already graded
      grade: existingIndex >= 0 ? submissions[existingIndex].grade : undefined,
      feedback: existingIndex >= 0 ? submissions[existingIndex].feedback : undefined,
      gradedAt: existingIndex >= 0 ? submissions[existingIndex].gradedAt : undefined,
    };

    if (existingIndex >= 0) {
      submissions[existingIndex] = newSub;
    } else {
      submissions.unshift(newSub);
    }

    this.saveSubmissions(submissions);
    return newSub;
  },

  gradeSubmission(submissionId: string, grade: number, feedback: string): void {
    const submissions = this.getSubmissions().map((s) => {
      if (s.id === submissionId) {
        return {
          ...s,
          grade,
          feedback,
          gradedAt: new Date().toISOString(),
        };
      }
      return s;
    });
    this.saveSubmissions(submissions);
  },

  // Update password for a student (custom password or reset to undefined)
  updateStudentPassword(id: string, newPassword?: string): void {
    const students = this.getStudents().map((s) => {
      if (s.id === id) {
        return {
          ...s,
          customPassword: newPassword ? newPassword.trim() : undefined,
        };
      }
      return s;
    });
    this.saveStudents(students);

    // Keep active student session in sync
    const active = this.getActiveStudent();
    if (active && active.id === id) {
      const updated = students.find((s) => s.id === id);
      if (updated) this.setActiveStudent(updated);
    }
  },

  // Detailed Student auth check: supports name + customPassword OR birthDate
  verifyStudentAuth(nameInput: string, passwordOrBirthDateInput: string): {
    status: 'success' | 'inactive' | 'not_found';
    student?: Student;
  } {
    const students = this.getStudents();
    const cleanName = nameInput.trim().toLowerCase();
    const rawInput = passwordOrBirthDateInput.trim();
    
    // Normalize date inputs (supports YYYY-MM-DD or DD-MM-YYYY or DD/MM/YYYY)
    let cleanDate = rawInput;
    if (cleanDate.includes('/')) {
      const parts = cleanDate.split('/');
      if (parts[0].length === 2 && parts[2]?.length === 4) {
        cleanDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    } else if (cleanDate.includes('-')) {
      const parts = cleanDate.split('-');
      if (parts[0].length === 2 && parts[2]?.length === 4) {
        cleanDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    const matched = students.find((s) => {
      const matchesName = s.name.trim().toLowerCase() === cleanName;
      if (!matchesName) return false;

      // Check if custom password matches
      if (s.customPassword && s.customPassword.trim() === rawInput) {
        return true;
      }

      // Check if birthdate matches
      const matchesBirthDate = s.birthDate.trim() === cleanDate || s.birthDate.trim() === rawInput;
      return matchesBirthDate;
    });

    if (!matched) {
      return { status: 'not_found' };
    }

    if (matched.status === 'inactive') {
      return { status: 'inactive', student: matched };
    }

    return { status: 'success', student: matched };
  },

  // Student auth check: matches student name and password/birthdate, only active students
  verifyStudentLogin(nameInput: string, birthDateInput: string): Student | null {
    const authResult = this.verifyStudentAuth(nameInput, birthDateInput);
    if (authResult.status === 'success' && authResult.student) {
      return authResult.student;
    }
    return null;
  },

  // Application Logo Management
  getAppLogo(): string {
    return localStorage.getItem(STORAGE_KEYS.APP_LOGO) || '/spensadil_logo.png';
  },

  hasCustomLogo(): boolean {
    return Boolean(localStorage.getItem(STORAGE_KEYS.APP_LOGO));
  },

  setAppLogo(logoUrl: string): void {
    localStorage.setItem(STORAGE_KEYS.APP_LOGO, logoUrl);
  },

  resetAppLogo(): string {
    localStorage.removeItem(STORAGE_KEYS.APP_LOGO);
    return '/spensadil_logo.png';
  },

  getActiveStudent(): Student | null {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setActiveStudent(student: Student | null): void {
    if (!student) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, JSON.stringify(student));
    }
  },

  isAdminLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.IS_ADMIN_LOGGED_IN) === 'true';
  },

  setAdminLoggedIn(isLoggedIn: boolean): void {
    localStorage.setItem(STORAGE_KEYS.IS_ADMIN_LOGGED_IN, isLoggedIn ? 'true' : 'false');
  },

  resetAllDataToDemo(): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(INITIAL_ADMIN));
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(INITIAL_TEACHERS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(INITIAL_FOLDERS));
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TEACHER);
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.APP_LOGO);
  },
};
