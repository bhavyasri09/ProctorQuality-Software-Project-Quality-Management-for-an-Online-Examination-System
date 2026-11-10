import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldX, Clock, Lock, ArrowRight } from 'lucide-react';
import { ProctorViolationEvent } from '../../types';

interface WarningModalProps {
  isOpen: boolean;
  warningCount: number;
  lastViolation: ProctorViolationEvent | null;
  isTerminated: boolean;
  onAcknowledge: () => void;
  onViewReport: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  warningCount,
  lastViolation,
  isTerminated,
  onAcknowledge,
  onViewReport,
}) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isOpen && !isTerminated) {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, isTerminated]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95">
        {isTerminated ? (
          // Terminal Strike 3 Lockout
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
              <ShieldX className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest">
                Examination Terminated · Strike 3 of 3
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Academic Integrity Limit Exceeded
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Your examination has been automatically locked and submitted due to reaching the 3-Warning Rule threshold
                (unauthorized window blur, tab switches, or full-screen disengagement).
              </p>
            </div>

            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl text-left space-y-2 text-xs">
              <div className="font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Session Lockout Imposed</span>
              </div>
              <p className="text-rose-700 dark:text-rose-400">
                All responses recorded up to the moment of termination are preserved. A formal incident notice has been
                dispatched to the Course Coordinator under ISO/IEC 23988 compliance.
              </p>
            </div>

            <button
              onClick={onViewReport}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>View Examination Integrity & Score Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // Strikes 1 or 2 Warning Notice
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  warningCount === 2
                    ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                    : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    warningCount === 2 ? 'text-rose-500' : 'text-amber-500'
                  }`}
                >
                  Proctoring Violation Strike {warningCount} of 3
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {warningCount === 2 ? 'FINAL WARNING: Next Strike Terminates Exam' : 'Security Anomaly Detected'}
                </h3>
              </div>
            </div>

            {/* Violation detail */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="text-slate-600 dark:text-slate-300">
                <strong>Event:</strong> {lastViolation?.description || 'Browser window lost focus / full-screen exited.'}
              </div>
              <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Logged at: {lastViolation?.timestamp ? new Date(lastViolation.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Strike 2 Critical Warning */}
            {warningCount === 2 && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-800 dark:text-rose-300 font-medium">
                ⚠️ URGENT: One more violation will immediately disqualify this attempt and transmit incident video frames to the Faculty Review Board.
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {countdown > 0 ? `Reviewing policy... (${countdown}s)` : 'Ready to resume'}
              </span>
              <button
                onClick={onAcknowledge}
                disabled={countdown > 0}
                className="py-2.5 px-5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-all shadow-sm"
              >
                {countdown > 0 ? `Please Wait (${countdown})` : 'Acknowledge & Resume Fullscreen'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
