import React, { useEffect } from 'react';
import { Modal } from '../common/Modal';
import { ExamSubmissionReport } from '../../types';
import { Award, CheckCircle2, XCircle, ShieldAlert, ShieldCheck, Clock, Download, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubmissionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ExamSubmissionReport | null;
  onReturnToHome: () => void;
}

export const SubmissionReportModal: React.FC<SubmissionReportModalProps> = ({
  isOpen,
  onClose,
  report,
  onReturnToHome,
}) => {
  useEffect(() => {
    if (isOpen && report && report.passed && !report.wasTerminated) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  }, [isOpen, report]);

  if (!isOpen || !report) return null;

  const getRiskBadge = (risk?: string) => {
    switch (risk) {
      case 'Low':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'High':
      case 'Critical':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Proctored Examination Submission Dossier" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Header Hero Banner */}
        <div
          className={`p-5 rounded-2xl border text-center space-y-2 ${
            report.wasTerminated
              ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
              : report.passed
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
              : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
          }`}
        >
          <div className="flex items-center justify-center">
            {report.wasTerminated ? (
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
            ) : report.passed ? (
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {report.wasTerminated
              ? 'Submission Locked via 3-Warning Rule'
              : report.passed
              ? 'Examination Completed Successfully'
              : 'Examination Submitted'}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Candidate: <strong className="text-slate-900 dark:text-white">{report.candidateName}</strong> · Exam:{' '}
            {report.examTitle}
          </p>

          {/* Key Metric Score Row */}
          <div className="pt-2 grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500">Score</span>
              <div className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {report.score} / {report.totalMarks}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500">Percentage</span>
              <div className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {report.percentage.toFixed(1)}%
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500">Strikes</span>
              <div
                className={`text-base font-bold font-mono ${
                  report.warningCount > 0 ? 'text-amber-500' : 'text-emerald-500'
                }`}
              >
                {report.warningCount} / 3
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500">Duration</span>
              <div className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {report.durationMinutes}m
              </div>
            </div>
          </div>
        </div>

        {/* AI Proctor Integrity Assessment */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                AI Proctor Integrity Risk Analysis
              </h4>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-xs font-mono font-semibold border ${getRiskBadge(
                report.aiIntegrityAssessment?.riskLevel
              )}`}
            >
              Risk Level: {report.aiIntegrityAssessment?.riskLevel || 'Nominal'}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {report.aiIntegrityAssessment?.summary ||
              'Computer vision biometrics and audio telemetry verified normal test-taking environment.'}
          </p>

          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Faculty Recommendation: </span>
            <span className="text-slate-600 dark:text-slate-400">
              {report.aiIntegrityAssessment?.recommendation || 'Direct result validation approved.'}
            </span>
          </div>
        </div>

        {/* Topic Breakdown Grid */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Topic Competency Breakdown
          </h4>
          <div className="space-y-2">
            {report.topicBreakdown.map((t, idx) => {
              const pct = Math.round((t.score / t.maxScore) * 100) || 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{t.topic}</span>
                    <span className="text-slate-500 font-mono">
                      {t.score}/{t.maxScore} pts ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono text-slate-500">
            Dossier Token: ISO-23988-{report.id.substring(4)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onReturnToHome}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Return to Assessment Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
