import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types';
import { ShieldCheck, Lock, Mail, User, AlertCircle, CheckCircle2, KeyRound, ArrowRight, Video, FileText, Check } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface AuthLandingPageProps {
  users: UserProfile[];
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterSubmit: (newUser: UserProfile) => void;
  isEvaluatorMode: boolean;
  onToggleEvaluatorMode: () => void;
}

export const AuthLandingPage: React.FC<AuthLandingPageProps> = ({
  users,
  onLoginSuccess,
  onRegisterSubmit,
  isEvaluatorMode,
  onToggleEvaluatorMode,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginCredential, setLoginCredential] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regInstitutionId, setRegInstitutionId] = useState('');
  const [regDepartment, setRegDepartment] = useState('M.Tech Software Engineering');
  const [regSuccessNotice, setRegSuccessNotice] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const emailTrimmed = loginEmail.trim().toLowerCase();
    const matched = users.find((u) => u.email.toLowerCase() === emailTrimmed);

    if (!matched) {
      setLoginError('No institutional credential found with this email. Please verify or register below.');
      return;
    }

    if (matched.status === 'pending') {
      setLoginError(
        `Registration Pending Approval: Your account for '${matched.name}' (${matched.role}) is currently in the Administrative Verification queue. The system administrator must verify credentials before login access is granted.`
      );
      return;
    }

    if (matched.status === 'rejected') {
      setLoginError('Access Denied: Your registration was rejected by the system administrator.');
      return;
    }

    onLoginSuccess(matched);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regInstitutionId) return;

    const newUser: UserProfile = {
      id: `USR-${regRole.toUpperCase().substring(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      role: regRole,
      institutionId: regInstitutionId.trim(),
      department: regDepartment.trim(),
      status: 'pending', // Requires manual approval by Admin!
      registeredAt: new Date().toISOString(),
      approvalNotes: 'Self-registered via public gateway. Pending administrator verification.',
    };

    onRegisterSubmit(newUser);
    setRegSuccessNotice(true);
  };

  const handleQuickAutofill = (email: string, credential: string) => {
    setLoginEmail(email);
    setLoginCredential(credential);
    setLoginError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Header */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                ProctorQuality
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
                Online Examination Gateway
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-mono text-slate-400 border border-slate-800 px-2.5 py-1 rounded-lg">
              ISO/IEC 23988 Secure Assessment Portal
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Hero & Auth Split */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Academic & System Overview (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>M.Tech Software Project Quality Management</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                AI-Assisted Online Examination & Proctoring System
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                Enterprise quality governance platform combining real-time WebRTC computer vision invigilation,
                the strict 3-Warning security rule, PERT/CPM schedule metrics, and Agentic AI assistance under
                ISO/IEC 25010 quality standards.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-400" />
                  <span>WebRTC Biometrics</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Real-time face tracking, head-pose anomaly detection, and decibel audio monitoring.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>3-Warning Rule</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Automated examination termination if full-screen or browser focus is dismissed 3 times.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Admin Verification</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  All student and faculty accounts require administrative approval before login access unlocks.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>PERT/CPM Quality</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Critical Path Method tracking, defect density analysis, and ISO 25010 compliance radar.
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Course: SQM-601 · Examination Authority: Central Academic Council
            </div>
          </div>

          {/* Right Column: Institutional Auth Gateway Card (6 cols) */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
              {/* Tab Selector: Sign In vs Register */}
              <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setLoginError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    activeTab === 'login'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Institutional Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setRegSuccessNotice(false);
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    activeTab === 'register'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Candidate Registration
                </button>
              </div>

              {/* TAB 1: SIGN IN FORM */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginError && (
                    <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Institutional Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. bhavyasripattapu@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Roll Number / Faculty ID / Access Key
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        value={loginCredential}
                        onChange={(e) => setLoginCredential(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Private Evaluator 1-Click Autofill (only visible when toggled via Ctrl+Shift+D or confidential trigger) */}
                  {isEvaluatorMode && (
                    <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-900/50 space-y-1.5 text-[11px]">
                      <div className="font-semibold text-amber-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5" />
                          Evaluator 1-Click Autofill:
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">Private</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickAutofill('bhavyasripattapu@gmail.com', 'MT-CS-2024-042')}
                          className="px-2 py-1 rounded bg-slate-900 border border-amber-800/80 text-amber-200 hover:bg-amber-900/30 text-center"
                        >
                          Student
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAutofill('vasquez.evelyn@univ.edu', 'FAC-ENG-881')}
                          className="px-2 py-1 rounded bg-slate-900 border border-amber-800/80 text-amber-200 hover:bg-amber-900/30 text-center"
                        >
                          Faculty
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAutofill('vance.admin@univ.edu', 'ADM-SYS-001')}
                          className="px-2 py-1 rounded bg-slate-900 border border-amber-800/80 text-amber-200 hover:bg-amber-900/30 text-center"
                        >
                          Admin
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    <span>Sign In to Examination Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center">
                    <span className="text-[11px] text-slate-500">
                      Need account approval or new enrollment?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('register')}
                        className="text-indigo-400 font-semibold hover:underline"
                      >
                        Register
                      </button>
                    </span>
                  </div>
                </form>
              )}

              {/* TAB 2: CANDIDATE / FACULTY REGISTRATION */}
              {activeTab === 'register' && (
                <div>
                  {regSuccessNotice ? (
                    <div className="space-y-4 py-2 text-center">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">Registration Submitted for Verification</h4>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Your credentials have been queued for administrative gatekeeping. The system administrator
                          must verify your enrollment before login access is activated.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-left space-y-1">
                        <div>Applicant: <span className="text-white font-semibold">{regName}</span></div>
                        <div>Email: <span className="text-indigo-400">{regEmail}</span></div>
                        <div>Status: <span className="text-amber-400 font-bold">PENDING_ADMIN_APPROVAL</span></div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('login');
                          setLoginEmail(regEmail);
                        }}
                        className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
                      >
                        Return to Sign In
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-3.5">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setRegRole('student')}
                          className={`py-2 px-3 rounded-xl border text-center transition-all ${
                            regRole === 'student'
                              ? 'border-indigo-500 bg-indigo-950/40 text-indigo-400 font-bold'
                              : 'border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Student / Candidate
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegRole('faculty')}
                          className={`py-2 px-3 rounded-xl border text-center transition-all ${
                            regRole === 'faculty'
                              ? 'border-indigo-500 bg-indigo-950/40 text-indigo-400 font-bold'
                              : 'border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Faculty Member
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Full Legal Name</label>
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Sravani Pattapu"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Institutional Email</label>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="sravani@student.univ.edu"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300">
                            {regRole === 'student' ? 'Roll Number' : 'Employee ID'}
                          </label>
                          <input
                            type="text"
                            value={regInstitutionId}
                            onChange={(e) => setRegInstitutionId(e.target.value)}
                            placeholder={regRole === 'student' ? 'MT-CS-2024-099' : 'FAC-ENG-512'}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300">Department</label>
                          <select
                            value={regDepartment}
                            onChange={(e) => setRegDepartment(e.target.value)}
                            className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="M.Tech Software Engineering">M.Tech Software Eng</option>
                            <option value="M.Tech Computer Science & Eng">M.Tech CSE</option>
                            <option value="Department of Information Tech">Dept of IT</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
                      >
                        Submit Registration for Admin Approval
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Discreet Evaluator Mode Trigger */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            ProctorQuality · Software Project Quality Management System (M.Tech Thesis Prototype)
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>ISO/IEC 25010</span>
            <span>·</span>
            <button
              onClick={onToggleEvaluatorMode}
              className="hover:text-indigo-400 transition-colors"
              title="Toggle Private Evaluator Autofill (Ctrl+Shift+D)"
            >
              ISO/IEC 23988 Assessment Security
            </button>
            <span>·</span>
            <span>Google Gemini 3.8</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
