import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { UserProfile, UserRole } from '../../types';
import { ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSubmit: (newUser: UserProfile) => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSubmit,
  onSwitchToLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [institutionId, setInstitutionId] = useState('');
  const [department, setDepartment] = useState('M.Tech Software Engineering');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !institutionId) return;

    const newUser: UserProfile = {
      id: `USR-${role.toUpperCase().substring(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      institutionId: institutionId.trim(),
      department: department.trim(),
      status: 'pending', // Requires manual approval by Admin before login!
      registeredAt: new Date().toISOString(),
      approvalNotes: 'Self-registered via portal. Pending admin credential verification.',
    };

    onRegisterSubmit(newUser);
    setSubmittedNotice(true);
  };

  const handleFinish = () => {
    setSubmittedNotice(false);
    setName('');
    setEmail('');
    setInstitutionId('');
    onClose();
    onSwitchToLogin();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Institutional Portal Registration" maxWidth="max-w-lg">
      {submittedNotice ? (
        <div className="space-y-4 py-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
              Registration Queued for Admin Verification
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              Under ISO/IEC 23988 security standards, all candidate and faculty credentials must be approved by the
              System Administrator before access is unlocked.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 font-mono">
            <div className="text-slate-500">Applicant: <span className="text-slate-800 dark:text-slate-200 font-semibold">{name}</span></div>
            <div className="text-slate-500">Role: <span className="text-indigo-600 dark:text-indigo-400 uppercase font-semibold">{role}</span></div>
            <div className="text-slate-500">Status: <span className="text-amber-600 font-semibold">PENDING_ADMIN_APPROVAL</span></div>
          </div>

          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-700 dark:text-indigo-300">
            💡 Quick Demo Tip: Switch to the <strong>Admin persona</strong> in the top bar to review and approve this registration immediately!
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
          >
            Acknowledge & Return to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2.5 p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Registration requires manual administrative approval prior to examination login unlock.</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                role === 'student'
                  ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
              onClick={() => setRole('student')}
            >
              <input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => {}} className="sr-only" />
              <span className="text-sm">Student / Candidate</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Online Examination Taker</span>
            </label>

            <label
              className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                role === 'faculty'
                  ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
              onClick={() => setRole('faculty')}
            >
              <input type="radio" name="role" value="faculty" checked={role === 'faculty'} onChange={() => {}} className="sr-only" />
              <span className="text-sm">Faculty Member</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Course Coordinator / Proctored Reviewer</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Legal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sravani Pattapu"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Institutional Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sravani@student.univ.edu"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {role === 'student' ? 'Roll / Enrollment ID' : 'Faculty Employee ID'}
              </label>
              <input
                type="text"
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                placeholder={role === 'student' ? 'MT-CS-2024-099' : 'FAC-ENG-512'}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Academic Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="M.Tech Software Engineering">M.Tech Software Engineering</option>
                <option value="M.Tech Computer Science & Eng">M.Tech Computer Science & Eng</option>
                <option value="M.Tech Cybersecurity & Privacy">M.Tech Cybersecurity & Privacy</option>
                <option value="Department of Information Technology">Department of Information Tech</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToLogin();
              }}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Already registered? <span className="text-indigo-600 dark:text-indigo-400 font-medium">Sign In</span>
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
            >
              Submit for Verification
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
