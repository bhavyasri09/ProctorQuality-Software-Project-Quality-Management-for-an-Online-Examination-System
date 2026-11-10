import React from 'react';
import { UserProfile, PertCpmActivity, SoftwareQualityMetrics } from '../../types';
import { ShieldCheck, UserCheck, Activity, Mail, Server, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AdminHomeDashboardProps {
  currentUser: UserProfile;
  users: UserProfile[];
  pertActivities: PertCpmActivity[];
  qualityMetrics: SoftwareQualityMetrics;
  onNavigateTab: (tab: string) => void;
}

export const AdminHomeDashboard: React.FC<AdminHomeDashboardProps> = ({
  currentUser,
  users,
  pertActivities,
  qualityMetrics,
  onNavigateTab,
}) => {
  const pendingCount = users.filter((u) => u.status === 'pending').length;
  const criticalDuration = pertActivities
    .filter((a) => a.isCritical)
    .reduce((sum, a) => sum + a.expectedDuration, 0)
    .toFixed(1);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 text-white border border-purple-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono">
              Principal Examination Authority
            </span>
            <h1 className="text-2xl font-bold tracking-tight">
              {currentUser.name}
            </h1>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Institutional Admin ID: <span className="font-mono">{currentUser.institutionId}</span> · Department: {currentUser.department}. Enforcing ISO/IEC 23988 security rules and ISO/IEC 25010 project quality standards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('admin-approvals')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-colors shadow-sm flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Approval Queue ({pendingCount})</span>
            </button>
            <button
              onClick={() => onNavigateTab('admin-pert-cpm')}
              className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-semibold text-white transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>PERT / CPM Metrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Pending User Approvals</span>
          <div className="text-2xl font-bold font-mono text-amber-500 mt-1">{pendingCount}</div>
          <span className="text-[10px] text-slate-400">Gatekeeping Verification Queue</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Critical Path Duration</span>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            {criticalDuration} Days
          </div>
          <span className="text-[10px] text-slate-400">Zero Total Slack on 6 tasks</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Defect Density</span>
          <div className="text-2xl font-bold font-mono text-emerald-500 mt-1">
            {qualityMetrics.defectDensity} / KLOC
          </div>
          <span className="text-[10px] text-slate-400">SQM Standard: &lt; 1.0</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Proctor Concurrency</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {qualityMetrics.serverLoadConcurrency} Nodes
          </div>
          <span className="text-[10px] text-emerald-500 font-semibold">WebRTC 18ms Latency</span>
        </div>
      </div>

      {/* Admin Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('admin-approvals')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer shadow-xs space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>User Approval Queue</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Verify student and faculty institutional IDs to unlock portal access before examination start.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('admin-pert-cpm')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer shadow-xs space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>PERT/CPM Quality Metrics</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Examine the critical path network, variance calculations, and ISO/IEC 25010 software quality compliance scorecard.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('admin-dispatches')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer shadow-xs space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>AI Email Dispatches</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            View automated academic notices and violation dossiers generated by Gemini 3.8 Flash.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('admin-logs')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer shadow-xs space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>System Audit Stream</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time audit events, biometric tracker calibrators, and WebRTC prober nodes.
          </p>
        </div>
      </div>
    </div>
  );
};
