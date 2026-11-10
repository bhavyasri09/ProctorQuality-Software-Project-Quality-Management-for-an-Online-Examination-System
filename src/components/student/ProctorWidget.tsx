import React, { useRef, useEffect } from 'react';
import { ProctoringEngine } from '../../services/proctoringEngine';
import { Shield, Mic, AlertTriangle, Maximize2 } from 'lucide-react';
import { ViolationType } from '../../types';

interface ProctorWidgetProps {
  engine: ProctoringEngine | null;
  warningCount: number;
  faceState: { status: string; label: string; confidence: number };
  audioLevel: number;
  speechDetected: boolean;
  onSimulateViolation: (type: ViolationType) => void;
  isFullscreen: boolean;
  onRequestFullscreen: () => void;
  isEvaluatorMode?: boolean;
}

export const ProctorWidget: React.FC<ProctorWidgetProps> = ({
  engine,
  warningCount,
  faceState,
  audioLevel,
  speechDetected,
  onSimulateViolation,
  isFullscreen,
  onRequestFullscreen,
  isEvaluatorMode = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (engine && videoRef.current) {
      engine.initializeMedia(videoRef.current);
    }
  }, [engine]);

  const getFaceBadgeColor = () => {
    if (faceState.status === 'nominal') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (faceState.status === 'head_turned') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3.5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Live Proctor Feed
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
          <Shield className="w-3.5 h-3.5 text-indigo-500" />
          <span>Active</span>
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1]"
        />

        {/* Biometric overlay HUD */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2.5 bg-gradient-to-t from-black/60 via-transparent to-black/30">
          <div className="flex items-center justify-between">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border backdrop-blur-md ${getFaceBadgeColor()}`}
            >
              {faceState.label}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-white/90 bg-black/40 border border-white/10 backdrop-blur-md">
              {faceState.confidence}% CONF
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-200">
            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">
              <Mic className={`w-3 h-3 ${speechDetected ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
              <span>{audioLevel} dB</span>
              {speechDetected && <span className="text-rose-400 font-bold">· SPEECH</span>}
            </div>
            <div className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-md text-slate-300">
              WebRTC
            </div>
          </div>
        </div>
      </div>

      {/* 3-Warning Rule Strike Indicators */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className={`w-3.5 h-3.5 ${warningCount > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              3-Warning Rule
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
            {warningCount} / 3 Strikes
          </span>
        </div>

        {/* Visual strike indicators */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((strike) => {
            const isTriggered = warningCount >= strike;
            return (
              <div
                key={strike}
                className={`py-1.5 px-2 text-center rounded-lg border text-[11px] font-mono font-semibold transition-all ${
                  isTriggered
                    ? strike === 3
                      ? 'bg-rose-500/20 text-rose-500 border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                    : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                Strike {strike}
                {isTriggered && (strike === 3 ? ' 🚫' : ' ⚠️')}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen check / toggle */}
      {!isFullscreen && (
        <button
          onClick={onRequestFullscreen}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl hover:bg-amber-100 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Enter Required Fullscreen Mode</span>
        </button>
      )}

      {/* Private Evaluator Simulation Toolbar: ONLY shown when Evaluator Mode is active */}
      {isEvaluatorMode && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase">
            Private Evaluator Triggers:
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onSimulateViolation('FULLSCREEN_EXIT')}
              className="px-2 py-1 text-[10px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-left"
            >
              ⚡ Tab Switch Strike
            </button>
            <button
              onClick={() => onSimulateViolation('HEAD_TURN_ANOMALY')}
              className="px-2 py-1 text-[10px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-left"
            >
              ⚡ Head Turn Alert
            </button>
            <button
              onClick={() => onSimulateViolation('BACKGROUND_SPEECH_DETECTED')}
              className="px-2 py-1 text-[10px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-left"
            >
              ⚡ Audio dB Anomaly
            </button>
            <button
              onClick={() => onSimulateViolation('NO_FACE_DETECTED')}
              className="px-2 py-1 text-[10px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-left"
            >
              ⚡ Face Absent Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
