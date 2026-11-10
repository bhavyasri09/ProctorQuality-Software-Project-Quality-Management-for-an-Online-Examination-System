import React, { useState, useEffect, useRef } from 'react';
import { Question, QuestionState, ProctorViolationEvent, ExamSubmissionReport, UserProfile, ViolationType } from '../../types';
import { ProctoringEngine } from '../../services/proctoringEngine';
import { ProctorWidget } from './ProctorWidget';
import { QuestionPalette } from './QuestionPalette';
import { AiAssistantDrawer } from './AiAssistantDrawer';
import { WarningModal } from './WarningModal';
import { SubmissionReportModal } from './SubmissionReportModal';
import { triggerEmailDispatch, analyzeProctorLogsWithAI } from '../../services/geminiService';
import { Clock, Bot, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Bookmark, RotateCcw, Send, Maximize2 } from 'lucide-react';

interface ExamDashboardProps {
  currentUser: UserProfile;
  questions: Question[];
  onFinishExam: (report: ExamSubmissionReport) => void;
  isEvaluatorMode?: boolean;
}

export const ExamDashboard: React.FC<ExamDashboardProps> = ({
  currentUser,
  questions,
  onFinishExam,
  isEvaluatorMode = false,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(45 * 60); // 45 minutes

  // Proctoring Engine State
  const [engine, setEngine] = useState<ProctoringEngine | null>(null);
  const [warningCount, setWarningCount] = useState(0);
  const [lastViolation, setLastViolation] = useState<ProctorViolationEvent | null>(null);
  const [violationsList, setViolationsList] = useState<ProctorViolationEvent[]>([]);
  const [faceState, setFaceState] = useState({
    status: 'nominal',
    label: 'Face Centered',
    confidence: 98.4,
  });
  const [audioLevel, setAudioLevel] = useState(24);
  const [speechDetected, setSpeechDetected] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // AI Assistant Drawer
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Final Submission
  const [submissionReport, setSubmissionReport] = useState<ExamSubmissionReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Initialize Proctoring Engine on mount
  useEffect(() => {
    const proctor = new ProctoringEngine({
      onViolation: (violation) => {
        setLastViolation(violation);
        setViolationsList((prev) => [violation, ...prev]);

        // If it was a security strike (fullscreen or tab blur)
        if (violation.type === 'FULLSCREEN_EXIT' || violation.type === 'TAB_SWITCH_BLUR') {
          const nextCount = proctor.getWarningCount();
          setWarningCount(nextCount);
          setIsWarningModalOpen(true);
        }
      },
      onAudioLevelChange: (db, speech) => {
        setAudioLevel(db);
        setSpeechDetected(speech);
      },
      onFaceStateChange: (state) => {
        setFaceState(state);
      },
      onWarningLimitExceeded: async () => {
        setIsTerminated(true);
        setIsWarningModalOpen(true);

        // Auto-terminate exam on 3 strikes!
        await handleFinalSubmission(true);
      },
    });

    setEngine(proctor);
    proctor.startExamSession();

    // Check initial fullscreen
    setIsFullscreen(!!document.fullscreenElement);
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);

    return () => {
      proctor.stopExamSession();
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  // Timer countdown loop
  useEffect(() => {
    if (isTerminated) return;
    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmission(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTerminated]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleRequestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  // Option selection
  const handleSelectOption = (optionId: string) => {
    const currentQ = questions[currentQIndex];
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
    setQuestionStates((prev) => ({ ...prev, [currentQ.id]: 'answered' }));
  };

  const handleMarkForReview = () => {
    const currentQ = questions[currentQIndex];
    setQuestionStates((prev) => ({ ...prev, [currentQ.id]: 'review' }));
  };

  const handleClearResponse = () => {
    const currentQ = questions[currentQIndex];
    setAnswers((prev) => ({ ...prev, [currentQ.id]: null }));
    setQuestionStates((prev) => ({ ...prev, [currentQ.id]: 'unanswered' }));
  };

  const handleNext = () => {
    const currentQ = questions[currentQIndex];
    if (!questionStates[currentQ.id]) {
      setQuestionStates((prev) => ({ ...prev, [currentQ.id]: 'unanswered' }));
    }
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  const handleSimulateViolation = (type: ViolationType) => {
    if (engine) {
      engine.simulateViolation(type);
    }
  };

  const handleFinalSubmission = async (terminatedViaStrikes = false) => {
    if (engine) {
      engine.stopExamSession();
    }

    // Calculate score
    let score = 0;
    let totalMarks = 0;
    const topicScores: Record<string, { score: number; maxScore: number }> = {};

    questions.forEach((q) => {
      totalMarks += q.marks;
      if (!topicScores[q.topic]) {
        topicScores[q.topic] = { score: 0, maxScore: 0 };
      }
      topicScores[q.topic].maxScore += q.marks;

      if (answers[q.id] === q.correctOptionId) {
        score += q.marks;
        topicScores[q.topic].score += q.marks;
      }
    });

    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const passed = percentage >= 50 && !terminatedViaStrikes;

    const topicBreakdown = Object.entries(topicScores).map(([topic, data]) => ({
      topic,
      score: data.score,
      maxScore: data.maxScore,
    }));

    // Call Gemini to analyze proctoring integrity dossier
    const aiIntegrity = await analyzeProctorLogsWithAI({
      candidateName: currentUser.name,
      examTitle: 'Software Project Quality Management (SQM-601)',
      violations: violationsList,
      examScore: Math.round(percentage),
      durationMinutes: Math.round((45 * 60 - timeRemainingSeconds) / 60),
    });

    const report: ExamSubmissionReport = {
      id: `SUB-${Date.now().toString().substring(6)}`,
      candidateId: currentUser.id,
      candidateName: currentUser.name,
      examId: 'EXAM-SQM-601',
      examTitle: 'M.Tech Software Project Quality Management Final Exam',
      submittedAt: new Date().toISOString(),
      score,
      totalMarks,
      percentage,
      passed,
      durationMinutes: Math.max(1, Math.round((45 * 60 - timeRemainingSeconds) / 60)),
      totalViolations: violationsList.length,
      warningCount,
      wasTerminated: terminatedViaStrikes,
      topicBreakdown,
      aiIntegrityAssessment: aiIntegrity,
      answers,
      violations: violationsList,
    };

    setSubmissionReport(report);
    onFinishExam(report);

    // If terminated due to 3 warnings or submitted, trigger Gemini Automated Email Dispatch!
    if (terminatedViaStrikes) {
      await triggerEmailDispatch({
        eventType: 'EXAM_TERMINATED_3_WARNINGS',
        recipientName: currentUser.name,
        recipientEmail: currentUser.email,
        recipientRole: 'Student',
        details: {
          examTitle: 'M.Tech Software Project Quality Management (SQM-601)',
          strikesCount: 3,
          terminationTimestamp: new Date().toISOString(),
          candidateId: currentUser.id,
        },
      });
    }

    setIsReportModalOpen(true);
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="space-y-6">
      {/* Top Cockpit Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase">
            Proctored Assessment Session · SQM-601
          </span>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Software Project Quality Management Final Exam
          </h2>
          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
            <span>Candidate: <strong>{currentUser.name}</strong></span>
            <span>·</span>
            <span>ID: {currentUser.institutionId}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono font-bold text-sm tabular-nums ${
              timeRemainingSeconds < 300
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 animate-pulse'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{formatTimer(timeRemainingSeconds)}</span>
          </div>

          {/* AI Invigilator Chat Button */}
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <Bot className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">AI Invigilator</span>
          </button>

          {/* Manual Submit Button */}
          <button
            onClick={() => handleFinalSubmission(false)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish & Submit</span>
          </button>
        </div>
      </div>

      {/* Main Examination Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question Card & Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {/* Question Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-mono font-bold text-xs border border-indigo-200 dark:border-indigo-800/60">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentQ.topic}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-500">{currentQ.marks} Marks</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">
                  {currentQ.difficulty}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                {currentQ.questionText}
              </p>

              {/* Code Snippet block if question contains code */}
              {currentQ.codeSnippet && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                  <pre>{currentQ.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.id;
                return (
                  <label
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-500/50'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </div>
                    <span className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                      {opt.text}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Bottom Actions Toolbar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkForReview}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl hover:bg-amber-100 transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Mark for Review</span>
                </button>
                <button
                  onClick={handleClearResponse}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Selection</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentQIndex === 0}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
                >
                  <span>{currentQIndex === questions.length - 1 ? 'Save & Review' : 'Save & Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Proctor Overlay & Question Palette (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Live Webcam & AI Proctor HUD */}
          <ProctorWidget
            engine={engine}
            warningCount={warningCount}
            faceState={faceState}
            audioLevel={audioLevel}
            speechDetected={speechDetected}
            onSimulateViolation={handleSimulateViolation}
            isFullscreen={isFullscreen}
            onRequestFullscreen={handleRequestFullscreen}
            isEvaluatorMode={isEvaluatorMode}
          />

          {/* Interactive Question Palette Grid */}
          <QuestionPalette
            questions={questions}
            currentQuestionIndex={currentQIndex}
            questionStates={questionStates}
            onSelectQuestion={(idx) => setCurrentQIndex(idx)}
          />
        </div>
      </div>

      {/* 3-Warning Rule Alert Modal */}
      <WarningModal
        isOpen={isWarningModalOpen}
        warningCount={warningCount}
        lastViolation={lastViolation}
        isTerminated={isTerminated}
        onAcknowledge={() => {
          setIsWarningModalOpen(false);
          handleRequestFullscreen();
        }}
        onViewReport={() => {
          setIsWarningModalOpen(false);
          setIsReportModalOpen(true);
        }}
      />

      {/* AI Assistant Chat Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        examContext={{
          examTitle: 'M.Tech Software Project Quality Management Final Exam',
          timeRemaining: formatTimer(timeRemainingSeconds),
          currentQuestionNumber: currentQIndex + 1,
          totalQuestions: questions.length,
        }}
      />

      {/* Final Submission Report Dossier */}
      <SubmissionReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={submissionReport}
        onReturnToHome={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
