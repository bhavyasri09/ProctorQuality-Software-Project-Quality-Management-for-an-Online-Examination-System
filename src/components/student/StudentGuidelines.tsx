import React from 'react';
import { ShieldCheck, AlertTriangle, Monitor, Mic, Camera, CheckCircle, FileText } from 'lucide-react';

interface StudentGuidelinesProps {
  onStartExam: () => void;
}

export const StudentGuidelines: React.FC<StudentGuidelinesProps> = ({ onStartExam }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ISO/IEC 23988 Examination Quality Standard</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Online Examination Integrity & Proctoring Protocol
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Please review the following rules and automated invigilation procedures prior to starting your scheduled
          proctored assessment.
        </p>
      </div>

      {/* 3-Warning Rule Card */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              The 3-Warning Rule for Academic Integrity
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Automated examination termination is strictly enforced.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/20 space-y-1.5">
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">STRIKE 1 · ADVISORY</span>
            <p className="text-slate-600 dark:text-slate-400">
              Exiting full-screen or switching browser tabs pauses the test and triggers an initial compliance advisory.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/20 space-y-1.5">
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">STRIKE 2 · CRITICAL</span>
            <p className="text-slate-600 dark:text-slate-400">
              A second focus disruption generates a severe warning. Incident frames are timestamped in the faculty log.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-500/30 space-y-1.5">
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">STRIKE 3 · TERMINATION</span>
            <p className="text-slate-600 dark:text-slate-400">
              The exam is automatically locked and submitted. AI incident notification is dispatched to faculty immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Environmental & Hardware Checklist */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Biometric Camera Requirements</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Camera must remain active and unobstructed throughout the examination duration.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Face must be centered in frame with adequate frontal illumination (no backlighting).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Only one candidate is permitted in the camera view at any time.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Mic className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Acoustic & Microphone Protocol</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Microphone must be enabled to track ambient acoustic levels and detect background speech.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Audio intensity above 65 dB or speech transcripts are logged as proctoring anomalies.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Headphones and Bluetooth headsets are strictly prohibited under exam regulations.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Start Button */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold">Ready to take the Proctored Assessment?</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Ensure your webcam and microphone permissions are granted. Fullscreen mode will be requested.
          </p>
        </div>
        <button
          onClick={onStartExam}
          className="px-6 py-3 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md shrink-0"
        >
          Launch Proctored Exam Cockpit
        </button>
      </div>
    </div>
  );
};
