import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, Question, ExamSubmissionReport } from './types';
import {
  INITIAL_QUESTIONS,
  INITIAL_USERS,
  INITIAL_PERT_ACTIVITIES,
  INITIAL_QUALITY_METRICS,
  INITIAL_SAMPLE_SUBMISSIONS,
} from './services/mockData';
import { Navbar } from './components/Navbar';
import { AuthLandingPage } from './components/auth/AuthLandingPage';
import { StudentHomeDashboard } from './components/student/StudentHomeDashboard';
import { ExamDashboard } from './components/student/ExamDashboard';
import { StudentGuidelines } from './components/student/StudentGuidelines';
import { FacultyPortal } from './components/faculty/FacultyPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { DemoCredentialsModal } from './components/common/DemoCredentialsModal';

export default function App() {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  // Default to null so the user is required to sign in or register first
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('student-dashboard');

  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [submissions, setSubmissions] = useState<ExamSubmissionReport[]>(INITIAL_SAMPLE_SUBMISSIONS);
  const [pertActivities] = useState(INITIAL_PERT_ACTIVITIES);
  const [qualityMetrics] = useState(INITIAL_QUALITY_METRICS);

  // Private Evaluator Mode (Ctrl+Shift+D)
  const [isEvaluatorMode, setIsEvaluatorMode] = useState<boolean>(false);

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDemoCredentialsOpen, setIsDemoCredentialsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setIsEvaluatorMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    const defaultUserForRole = users.find((u) => u.role === role && u.status === 'approved');
    if (defaultUserForRole) {
      setCurrentUser(defaultUserForRole);
    }

    if (role === 'student') {
      setActiveTab('student-dashboard');
    } else if (role === 'faculty') {
      setActiveTab('faculty-questions');
    } else if (role === 'admin') {
      setActiveTab('admin-approvals');
    }
  };

  const handleRegisterSubmit = (newUser: UserProfile) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleApproveUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'approved', approvedBy: 'Admin (System)' } : u))
    );
  };

  const handleRejectUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'rejected' } : u))
    );
  };

  const handleAddQuestion = (newQ: Question) => {
    setQuestions((prev) => [...prev, newQ]);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleFinishExam = (report: ExamSubmissionReport) => {
    setSubmissions((prev) => [report, ...prev]);
  };

  // FIRST SCREEN: REQUIRE SIGN IN OR REGISTRATION
  if (!currentUser) {
    return (
      <>
        <AuthLandingPage
          users={users}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setActiveRole(user.role);
            if (user.role === 'student') setActiveTab('student-dashboard');
            else if (user.role === 'faculty') setActiveTab('faculty-questions');
            else if (user.role === 'admin') setActiveTab('admin-approvals');
          }}
          onRegisterSubmit={handleRegisterSubmit}
          isEvaluatorMode={isEvaluatorMode}
          onToggleEvaluatorMode={() => setIsEvaluatorMode(!isEvaluatorMode)}
        />

        <DemoCredentialsModal
          isOpen={isDemoCredentialsOpen}
          onClose={() => setIsDemoCredentialsOpen(false)}
          users={users}
          onSelectUserAndRole={(user) => {
            setCurrentUser(user);
            setActiveRole(user.role);
            if (user.role === 'student') setActiveTab('student-dashboard');
            else if (user.role === 'faculty') setActiveTab('faculty-questions');
            else if (user.role === 'admin') setActiveTab('admin-approvals');
          }}
        />
      </>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      <Navbar
        currentUser={currentUser}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenDemoCredentials={() => setIsDemoCredentialsOpen(true)}
        onLogout={() => setCurrentUser(null)}
        isEvaluatorMode={isEvaluatorMode}
        onToggleEvaluatorMode={() => setIsEvaluatorMode(!isEvaluatorMode)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* STUDENT VIEWS */}
        {activeRole === 'student' && (
          <>
            {activeTab === 'student-dashboard' && (
              <StudentHomeDashboard
                currentUser={currentUser}
                submissions={submissions}
                onLaunchExam={() => setActiveTab('student-exam')}
                onViewGuidelines={() => setActiveTab('student-guidelines')}
              />
            )}
            {activeTab === 'student-exam' && (
              <ExamDashboard
                currentUser={currentUser}
                questions={questions}
                onFinishExam={handleFinishExam}
                isEvaluatorMode={isEvaluatorMode}
              />
            )}
            {activeTab === 'student-guidelines' && (
              <StudentGuidelines onStartExam={() => setActiveTab('student-exam')} />
            )}
          </>
        )}

        {/* FACULTY VIEWS */}
        {activeRole === 'faculty' && (
          <FacultyPortal
            questions={questions}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            submissions={submissions}
            activeSubTab={activeTab}
          />
        )}

        {/* ADMIN VIEWS: Clean, essential modules only */}
        {activeRole === 'admin' && (
          <AdminPortal
            users={users}
            onApproveUser={handleApproveUser}
            onRejectUser={handleRejectUser}
            pertActivities={pertActivities}
            qualityMetrics={qualityMetrics}
            activeSubTab={activeTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              M.Tech Project:
            </span>
            <span>Software Project Quality Management for Online Examination System with AI-Assisted Proctoring</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>ISO/IEC 25010</span>
            <span>·</span>
            <button
              onClick={() => setIsEvaluatorMode(!isEvaluatorMode)}
              className="hover:text-indigo-500 transition-colors"
              title="Private Evaluator Toggle (Ctrl+Shift+D)"
            >
              ISO/IEC 23988 Proctoring
            </button>
            <span>·</span>
            <span>Google Gemini 3.8</span>
          </div>
        </div>
      </footer>

      {/* Directory Modals */}
      <DemoCredentialsModal
        isOpen={isDemoCredentialsOpen}
        onClose={() => setIsDemoCredentialsOpen(false)}
        users={users}
        onSelectUserAndRole={(user) => {
          setCurrentUser(user);
          setActiveRole(user.role);
          if (user.role === 'student') setActiveTab('student-dashboard');
          else if (user.role === 'faculty') setActiveTab('faculty-questions');
          else if (user.role === 'admin') setActiveTab('admin-approvals');
        }}
      />
    </div>
  );
}
