import React from 'react';
import { UserProfile, Question, ExamSubmissionReport } from '../../types';
import { BookOpen, Award, ShieldAlert, Plus, Download, Eye, Users, FileCheck, ArrowRight } from 'lucide-react';

interface FacultyHomeDashboardProps {
  currentUser: UserProfile;
  questions: Question[];
  submissions: ExamSubmissionReport[];
  onNavigateTab: (tab: string) => void;
}

export const FacultyHomeDashboard: React.FC<FacultyHomeDashboardProps> = ({
  currentUser,
  questions,
  submissions,
  onNavigateTab,
}) => {
  const flaggedCount = submissions.filter((s) => s.wasTerminated || s.totalViolations > 0).length;
  const avgScore =
    submissions.length > 0
      ? (submissions.reduce((acc, curr) => acc + curr.percentage, 0) / submissions.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Welcome & Course Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono">
              Course Coordinator Portal
            </span>
            <h1 className="text-2xl font-bold tracking-tight">
              {currentUser.name}
            </h1>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Faculty ID: <span className="font-mono">{currentUser.institutionId}</span> · Department: {currentUser.department}. Managing proctored examination <strong>SQM-601: Software Project Quality Management</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('faculty-questions')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Question</span>
            </button>
            <button
              onClick={() => onNavigateTab('faculty-grades')}
              className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-semibold text-white transition-colors flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Grade Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Enrolled Students</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">142</div>
          <span className="text-[10px] text-slate-400">Class Batch: M.Tech CSE 2024-26</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Submissions Evaluated</span>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            {submissions.length}
          </div>
          <span className="text-[10px] text-slate-400">Class Average: {avgScore}%</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Proctor Violation Audits</span>
          <div className="text-2xl font-bold font-mono text-amber-500 mt-1">{flaggedCount}</div>
          <span className="text-[10px] text-slate-400">Flagged for Viva Voce Review</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Active Question Bank</span>
          <div className="text-2xl font-bold font-mono text-emerald-500 mt-1">{questions.length}</div>
          <span className="text-[10px] text-slate-400">MCQs & Code Snippets</span>
        </div>
      </div>

      {/* Navigation Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          onClick={() => onNavigateTab('faculty-questions')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xs space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Question Bank Wizard</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Create, edit, and organize exam questions across White-Box Testing, ISO 25010, PERT/CPM, and Mutation Testing topics.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('faculty-grades')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xs space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Automated Grade Reports</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            View student score distributions, percentile rankings, test completion times, and download formal grade dossiers in CSV format.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('faculty-violations')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xs space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Violation Review Logs</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inspect synchronized camera snapshots, examine Gemini AI risk scores, and record official determinations (Approve, Oral Viva, Disqualify).
          </p>
        </div>
      </div>
    </div>
  );
};
