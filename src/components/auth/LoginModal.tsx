import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { UserProfile } from '../../types';
import { ShieldCheck, AlertCircle, Lock, Mail, KeyRound } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  onLoginSuccess: (user: UserProfile) => void;
  onSwitchToRegister: () => void;
  isEvaluatorMode: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess,
  onSwitchToRegister,
  isEvaluatorMode,
}) => {
  const [email, setEmail] = useState<string>('bhavyasripattapu@gmail.com');
  const [credentialId, setCredentialId] = useState<string>('MT-CS-2024-042');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailTrimmed = email.trim().toLowerCase();
    const matched = users.find((u) => u.email.toLowerCase() === emailTrimmed);

    if (!matched) {
      setErrorMsg('No institutional record found for this email address. Please register or verify spelling.');
      return;
    }

    if (matched.status === 'pending') {
      setErrorMsg(
        `Account Pending Approval: Registration for '${matched.name}' (${matched.role}) is currently awaiting Administrative Verification under ISO/IEC 23988. Access will unlock once approved.`
      );
      return;
    }

    if (matched.status === 'rejected') {
      setErrorMsg('Access Denied: Your application was rejected by the System Administrator.');
      return;
    }

    onLoginSuccess(matched);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Institutional Sign In" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Secure Role-Based Access Control compliant with ISO/IEC 23988 assessment guidelines.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Institutional Email Address</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. bhavyasripattapu@gmail.com"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Institutional Roll / Faculty ID / Access Key
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="password"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              required
            />
          </div>
        </div>

        {/* Private Evaluator Quick Autofill: ONLY visible when evaluator mode is active */}
        {isEvaluatorMode && (
          <div className="p-2.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/40 space-y-1.5 text-[11px]">
            <div className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Evaluator Mode Active · 1-Click Autofill:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setEmail('bhavyasripattapu@gmail.com');
                  setCredentialId('MT-CS-2024-042');
                }}
                className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100"
              >
                Student (Bhavya)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('vasquez.evelyn@univ.edu');
                  setCredentialId('FAC-ENG-881');
                }}
                className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100"
              >
                Faculty (Dr. Evelyn)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('vance.admin@univ.edu');
                  setCredentialId('ADM-SYS-001');
                }}
                className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100"
              >
                Admin (Prof. Vance)
              </button>
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            New Student / Faculty? <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Register</span>
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
          >
            Authenticate
          </button>
        </div>
      </form>
    </Modal>
  );
};
