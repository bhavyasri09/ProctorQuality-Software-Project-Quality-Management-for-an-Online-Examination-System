import React, { useState } from 'react';
import { Modal } from './Modal';
import { UserProfile } from '../../types';
import { KeyRound, Check, Copy, Shield, GraduationCap, UserCheck, ArrowRight } from 'lucide-react';

interface DemoCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  onSelectUserAndRole: (user: UserProfile) => void;
}

export const DemoCredentialsModal: React.FC<DemoCredentialsModalProps> = ({
  isOpen,
  onClose,
  users,
  onSelectUserAndRole,
}) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleQuickLogin = (user: UserProfile) => {
    onSelectUserAndRole(user);
    onClose();
  };

  const approvedUsers = users.filter((u) => u.status === 'approved');
  const pendingUsers = users.filter((u) => u.status === 'pending');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Demo Credentials & Account Directory" maxWidth="max-w-xl">
      <div className="space-y-5 text-xs">
        <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-slate-700 dark:text-slate-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-400">
            <KeyRound className="w-4 h-4" />
            <span>Pre-Configured Instant Login Profiles</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Click <strong>"Sign In As"</strong> on any account to immediately switch personas, or copy the email to test
            the standard authentication login form.
          </p>
        </div>

        {/* Verified Accounts */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Active Verified Institutional Accounts
          </h4>

          <div className="space-y-2.5">
            {approvedUsers.map((u) => {
              const roleBadge = {
                student: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
                faculty: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40',
                admin: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800/40',
              }[u.role];

              return (
                <div
                  key={u.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-wrap items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{u.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${roleBadge}`}>
                        {u.role}
                      </span>
                    </div>
                    <div className="text-slate-500 font-mono text-[11px]">
                      Email: <strong className="text-slate-700 dark:text-slate-300">{u.email}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ID: {u.institutionId} · {u.department}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(u.email)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                      title="Copy email to clipboard"
                    >
                      {copiedEmail === u.email ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleQuickLogin(u)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-xs flex items-center gap-1"
                    >
                      <span>Sign In As</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Queue Demonstration */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Pending Admin Approval Accounts ({pendingUsers.length})
            </h4>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
              Requires Admin Verification
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            These accounts demonstrate the verification gatekeeping rule. If you try signing in with them before an Admin
            approves them, login is locked.
          </p>

          <div className="space-y-1.5">
            {pendingUsers.map((u) => (
              <div
                key={u.id}
                className="p-2.5 rounded-lg border border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/10 flex items-center justify-between text-[11px]"
              >
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{u.name}</span>{' '}
                  <span className="text-slate-500 font-mono">({u.email})</span>
                  <div className="text-[10px] text-slate-400">{u.role.toUpperCase()} · {u.department}</div>
                </div>
                <button
                  onClick={() => handleCopy(u.email)}
                  className="px-2 py-1 rounded border border-amber-300 dark:border-amber-800/50 text-[10px] font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                >
                  {copiedEmail === u.email ? 'Copied!' : 'Copy Email'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
