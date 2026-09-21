import React, { useState, useEffect } from 'react';
import { AppPortal, Student, AdminAccount } from './types';
import { StorageService } from './services/storage';
import { AndroidFrame } from './components/AndroidFrame';
import { TopNavBar } from './components/TopNavBar';
import { StudentLogin } from './components/StudentPortal/StudentLogin';
import { StudentDashboard } from './components/StudentPortal/StudentDashboard';
import { AdminLogin } from './components/AdminPortal/AdminLogin';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import { QuickGuideModal } from './components/QuickGuideModal';

export default function App() {
  const [currentPortal, setCurrentPortal] = useState<AppPortal>('student');
  const [activeStudent, setActiveStudent] = useState<Student | null>(() =>
    StorageService.getActiveStudent()
  );
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() =>
    StorageService.isAdminLoggedIn()
  );
  const [adminAccount, setAdminAccount] = useState<AdminAccount>(() =>
    StorageService.getAdminAccount()
  );

  // Android device mockup frame vs full screen toggle
  const [isFrameMode, setIsFrameMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');

  // Clock updater for simulated android status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshGlobalData = () => {
    setActiveStudent(StorageService.getActiveStudent());
    setIsAdminLoggedIn(StorageService.isAdminLoggedIn());
    setAdminAccount(StorageService.getAdminAccount());
  };

  const handleStudentLoginSuccess = (student: Student) => {
    setActiveStudent(student);
  };

  const handleStudentLogout = () => {
    StorageService.setActiveStudent(null);
    setActiveStudent(null);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    StorageService.setAdminLoggedIn(false);
    setIsAdminLoggedIn(false);
  };

  const handleQuickDemoStudent = (name: string, birthDate: string) => {
    const verified = StorageService.verifyStudentLogin(name, birthDate);
    if (verified) {
      StorageService.setActiveStudent(verified);
      setActiveStudent(verified);
      setCurrentPortal('student');
    }
  };

  const handleQuickDemoAdmin = (teacher?: any) => {
    if (teacher) {
      StorageService.setActiveTeacher(teacher);
    }
    StorageService.setAdminLoggedIn(true);
    setIsAdminLoggedIn(true);
    setAdminAccount(StorageService.getAdminAccount());
    setCurrentPortal('admin');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Top Universal Bar (Switch between Student App & Teacher App, Full Screen toggle, Demo Guide) */}
      <TopNavBar
        currentPortal={currentPortal}
        onChangePortal={setCurrentPortal}
        activeStudent={activeStudent}
        isAdminLoggedIn={isAdminLoggedIn}
        adminAccount={adminAccount}
        onOpenGuide={() => setIsGuideOpen(true)}
        isFrameMode={isFrameMode}
        onToggleFrameMode={() => setIsFrameMode((prev) => !prev)}
      />

      {/* Android Device Frame / Main App Shell */}
      <AndroidFrame
        isFrameMode={isFrameMode}
        onToggleFrameMode={() => setIsFrameMode((prev) => !prev)}
        currentTime={currentTime}
      >
        {currentPortal === 'student' ? (
          activeStudent ? (
            <StudentDashboard
              student={activeStudent}
              onLogout={handleStudentLogout}
            />
          ) : (
            <StudentLogin
              onLoginSuccess={handleStudentLoginSuccess}
              onSwitchToAdmin={() => setCurrentPortal('admin')}
            />
          )
        ) : isAdminLoggedIn ? (
          <AdminDashboard
            adminAccount={adminAccount}
            onLogout={handleAdminLogout}
            onRefreshGlobalData={handleRefreshGlobalData}
          />
        ) : (
          <AdminLogin
            adminAccount={adminAccount}
            onLoginSuccess={handleAdminLoginSuccess}
            onSwitchToStudent={() => setCurrentPortal('student')}
          />
        )}
      </AndroidFrame>

      {/* Guide & Credentials Help Modal */}
      {isGuideOpen && (
        <QuickGuideModal
          onClose={() => setIsGuideOpen(false)}
          onSelectStudentDemo={handleQuickDemoStudent}
          onSelectAdminDemo={handleQuickDemoAdmin}
        />
      )}
    </div>
  );
}
