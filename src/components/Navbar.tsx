import React, { useState, useRef, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';
import { ThemeToggle } from './common/ThemeToggle';
import { ShieldCheck, LogOut, Menu, X, KeyRound, ChevronDown, Check } from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile | null;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenDemoCredentials: () => void;
  onLogout: () => void;
  isEvaluatorMode: boolean;
  onToggleEvaluatorMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenLogin,
  onOpenRegister,
  onOpenDemoCredentials,
  onLogout,
  isEvaluatorMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBrandClick = () => {
    if (activeRole === 'student') onTabChange('student-dashboard');
    else if (activeRole === 'faculty') onTabChange('faculty-questions');
    else if (activeRole === 'admin') onTabChange('admin-approvals');
    setMobileMenuOpen(false);
  };

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <button
          onClick={handleBrandClick}
          className="flex items-center gap-3 shrink-0 text-left hover:opacity-90 transition-opacity focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              ProctorQuality
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-0.5">
              Examination System
            </span>
          </div>
        </button>

        {/* Clean Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
          {activeRole === 'student' && (
            <>
              <button
                onClick={() => handleTabClick('student-dashboard')}
                className={`transition-colors ${
                  activeTab === 'student-dashboard'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleTabClick('student-exam')}
                className={`transition-colors ${
                  activeTab === 'student-exam'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Proctored Assessment
              </button>
              <button
                onClick={() => handleTabClick('student-guidelines')}
                className={`transition-colors ${
                  activeTab === 'student-guidelines'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Integrity Rules
              </button>
            </>
          )}

          {activeRole === 'faculty' && (
            <>
              <button
                onClick={() => handleTabClick('faculty-questions')}
                className={`transition-colors ${
                  activeTab === 'faculty-questions'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Question Bank
              </button>
              <button
                onClick={() => handleTabClick('faculty-grades')}
                className={`transition-colors ${
                  activeTab === 'faculty-grades'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Grade Reports
              </button>
              <button
                onClick={() => handleTabClick('faculty-violations')}
                className={`transition-colors ${
                  activeTab === 'faculty-violations'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Violation Reviews
              </button>
            </>
          )}

          {activeRole === 'admin' && (
            <>
              <button
                onClick={() => handleTabClick('admin-approvals')}
                className={`transition-colors ${
                  activeTab === 'admin-approvals'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                User Approvals
              </button>
              <button
                onClick={() => handleTabClick('admin-pert-cpm')}
                className={`transition-colors ${
                  activeTab === 'admin-pert-cpm'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                PERT/CPM Metrics
              </button>
              <button
                onClick={() => handleTabClick('admin-logs')}
                className={`transition-colors ${
                  activeTab === 'admin-logs'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                System Logs
              </button>
            </>
          )}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Private Evaluator Mode: Only shown when toggled via Ctrl+Shift+D */}
          {isEvaluatorMode && (
            <div className="flex items-center gap-1 p-0.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-300 dark:border-amber-800 text-xs">
              <button
                onClick={() => onRoleChange('student')}
                className={`px-2 py-0.5 rounded font-medium ${
                  activeRole === 'student' ? 'bg-amber-600 text-white' : 'text-amber-800 dark:text-amber-300'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => onRoleChange('faculty')}
                className={`px-2 py-0.5 rounded font-medium ${
                  activeRole === 'faculty' ? 'bg-amber-600 text-white' : 'text-amber-800 dark:text-amber-300'
                }`}
              >
                Faculty
              </button>
              <button
                onClick={() => onRoleChange('admin')}
                className={`px-2 py-0.5 rounded font-medium ${
                  activeRole === 'admin' ? 'bg-amber-600 text-white' : 'text-amber-800 dark:text-amber-300'
                }`}
              >
                Admin
              </button>
            </div>
          )}

          <ThemeToggle />

          {/* User Profile */}
          {currentUser && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold font-mono text-xs flex items-center justify-center">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono capitalize">
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800 space-y-0.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{currentUser.email}</div>
                    <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 capitalize">
                      {currentUser.role} · {currentUser.institutionId}
                    </div>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => {
                        onRoleChange('admin');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        activeRole === 'admin'
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>Admin Persona</span>
                      {activeRole === 'admin' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                    <button
                      onClick={() => {
                        onRoleChange('faculty');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        activeRole === 'faculty'
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>Faculty Persona</span>
                      {activeRole === 'faculty' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                    <button
                      onClick={() => {
                        onRoleChange('student');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        activeRole === 'student'
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>Student Persona</span>
                      {activeRole === 'student' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-1">
          {activeRole === 'student' && (
            <>
              <button
                onClick={() => handleTabClick('student-dashboard')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleTabClick('student-exam')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Proctored Assessment
              </button>
              <button
                onClick={() => handleTabClick('student-guidelines')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Integrity Rules
              </button>
            </>
          )}

          {activeRole === 'faculty' && (
            <>
              <button
                onClick={() => handleTabClick('faculty-questions')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Question Bank
              </button>
              <button
                onClick={() => handleTabClick('faculty-grades')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Grade Reports
              </button>
              <button
                onClick={() => handleTabClick('faculty-violations')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Violation Reviews
              </button>
            </>
          )}

          {activeRole === 'admin' && (
            <>
              <button
                onClick={() => handleTabClick('admin-approvals')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                User Approvals
              </button>
              <button
                onClick={() => handleTabClick('admin-pert-cpm')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                PERT/CPM Metrics
              </button>
              <button
                onClick={() => handleTabClick('admin-logs')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                System Logs
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
