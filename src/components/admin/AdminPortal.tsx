import React, { useState } from 'react';
import { UserProfile, PertCpmActivity, SoftwareQualityMetrics } from '../../types';
import { Check, X, Shield, Users, Activity, CheckCircle2, Server } from 'lucide-react';
import { triggerEmailDispatch } from '../../services/geminiService';

interface AdminPortalProps {
  users: UserProfile[];
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  pertActivities: PertCpmActivity[];
  qualityMetrics: SoftwareQualityMetrics;
  activeSubTab: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  users,
  onApproveUser,
  onRejectUser,
  pertActivities,
  qualityMetrics,
  activeSubTab,
}) => {
  const [selectedTab, setSelectedTab] = useState<'approvals' | 'pert-cpm' | 'logs'>(
    activeSubTab === 'admin-pert-cpm' ? 'pert-cpm' : activeSubTab === 'admin-logs' ? 'logs' : 'approvals'
  );

  const handleApprove = async (user: UserProfile) => {
    onApproveUser(user.id);
    await triggerEmailDispatch({
      eventType: 'REGISTRATION_APPROVED',
      recipientName: user.name,
      recipientEmail: user.email,
      recipientRole: user.role,
      details: {
        userId: user.id,
        institutionId: user.institutionId,
        department: user.department,
        approvedAt: new Date().toISOString(),
      },
    });
  };

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const approvedUsers = users.filter((u) => u.status === 'approved');

  const criticalPathDuration = pertActivities
    .filter((a) => a.isCritical)
    .reduce((sum, a) => sum + a.expectedDuration, 0)
    .toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Governance Portal</h2>
          <p className="text-xs text-slate-500">ISO/IEC 23988 Examination Security & ISO/IEC 25010 Quality Management</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setSelectedTab('approvals')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedTab === 'approvals'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            User Approvals ({pendingUsers.length})
          </button>
          <button
            onClick={() => setSelectedTab('pert-cpm')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedTab === 'pert-cpm'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            PERT/CPM Metrics
          </button>
          <button
            onClick={() => setSelectedTab('logs')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedTab === 'logs'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            System Logs
          </button>
        </div>
      </div>

      {/* 1. USER APPROVALS */}
      {selectedTab === 'approvals' && (
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Pending Registration Requests ({pendingUsers.length})
              </h3>
              <span className="text-xs text-slate-500">Manual approval required prior to login</span>
            </div>

            {pendingUsers.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto" />
                <p>All candidate and faculty registrations have been reviewed and approved.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
                          {user.role}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                          Pending
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {user.email} · ID: {user.institutionId} · {user.department}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRejectUser(user.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/40 flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleApprove(user)}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Access</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Users List */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Approved Active Accounts ({approvedUsers.length})
            </h3>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono">
                  <tr>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4">Email</th>
                    <th className="py-2.5 px-4">Role</th>
                    <th className="py-2.5 px-4">ID</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {approvedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">{u.email}</td>
                      <td className="py-2.5 px-4 uppercase font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                        {u.role}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-300">{u.institutionId}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PERT / CPM & QUALITY METRICS */}
      {selectedTab === 'pert-cpm' && (
        <div className="space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-mono text-slate-500 uppercase">Critical Path Duration</span>
              <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                {criticalPathDuration} Days
              </div>
              <span className="text-[10px] text-slate-400">Zero slack path</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-mono text-slate-500 uppercase">Defect Density</span>
              <div className="text-2xl font-bold font-mono text-emerald-500 mt-1">
                {qualityMetrics.defectDensity} / KLOC
              </div>
              <span className="text-[10px] text-slate-400">Target: &lt; 1.0</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-mono text-slate-500 uppercase">Test Coverage</span>
              <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                {qualityMetrics.testCoveragePercent}%
              </div>
              <span className="text-[10px] text-slate-400">Mutation verified</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-mono text-slate-500 uppercase">Server Concurrency</span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                {qualityMetrics.serverLoadConcurrency} Users
              </div>
              <span className="text-[10px] text-emerald-500">18ms WebRTC latency</span>
            </div>
          </div>

          {/* WBS & CPM Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                PERT/CPM Schedule & Critical Path Breakdown
              </h4>
              <span className="text-xs font-mono font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Critical Path: A1 → A2 → A3 → A5 → A6 → A7
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto text-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3 font-sans">Task Name</th>
                    <th className="py-2.5 px-3">to</th>
                    <th className="py-2.5 px-3">tm</th>
                    <th className="py-2.5 px-3">tp</th>
                    <th className="py-2.5 px-3">Expected (Te)</th>
                    <th className="py-2.5 px-3">Slack</th>
                    <th className="py-2.5 px-3">Critical?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pertActivities.map((act) => (
                    <tr
                      key={act.id}
                      className={act.isCritical ? 'bg-rose-50/20 dark:bg-rose-950/10' : ''}
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{act.code}</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                        {act.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{act.optimistic}d</td>
                      <td className="py-2.5 px-3 text-slate-500">{act.mostLikely}d</td>
                      <td className="py-2.5 px-3 text-slate-500">{act.pessimistic}d</td>
                      <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">{act.expectedDuration}d</td>
                      <td className="py-2.5 px-3 font-bold">
                        <span className={act.slack === 0 ? 'text-rose-500' : 'text-emerald-500'}>
                          {act.slack.toFixed(1)}d
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {act.isCritical ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40">
                            CRITICAL
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                            Non-critical
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ISO 25010 Quality Model Scorecard */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                ISO/IEC 25010 Software Quality Compliance Radar
              </h4>
              <span className="text-xs font-mono font-bold text-emerald-500">93.8% Overall Index</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {Object.entries(qualityMetrics.iso25010Scores).map(([key, score]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                  <div className="capitalize text-slate-500 text-[11px] truncate">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div className="font-mono font-bold text-base text-slate-900 dark:text-white">{score}%</div>
                  <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SYSTEM LOGS */}
      {selectedTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              System Audit Stream
            </h4>
            <span className="text-xs font-mono text-emerald-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Logging
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 max-h-96 overflow-y-auto">
            <div className="text-emerald-400">[SYSTEM_STARTUP] Port 3000 bound. WebRTC nodes online.</div>
            <div className="text-slate-400">[SECURITY_CHECK] ISO/IEC 23988 proctoring compliance verified.</div>
            <div className="text-indigo-400">[AUTH_AUDIT] Candidate Bhavya Sri Pattapu credential authorized.</div>
            <div className="text-amber-400">[PROCTOR_CALIB] Acoustic baseline calibrated at 24 dB.</div>
            <div className="text-rose-400">[STRIKE_MONITOR] 3-Warning Rule triggered for candidate STU-2026-88.</div>
            <div className="text-indigo-400">[CPM_EVAL] Critical Path evaluated at 38.6 days across 6 activities.</div>
          </div>
        </div>
      )}
    </div>
  );
};
