import React, { useState } from 'react';
import { Question, ExamSubmissionReport, ProctorViolationEvent } from '../../types';
import { Plus, Search, Filter, CheckCircle2, AlertTriangle, ShieldX, Eye, Download, FileText, Check, Trash2, Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';

interface FacultyPortalProps {
  questions: Question[];
  onAddQuestion: (q: Question) => void;
  onDeleteQuestion: (id: number) => void;
  submissions: ExamSubmissionReport[];
  activeSubTab: string;
}

export const FacultyPortal: React.FC<FacultyPortalProps> = ({
  questions,
  onAddQuestion,
  onDeleteQuestion,
  submissions,
  activeSubTab,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'questions' | 'grades' | 'violations'>(
    activeSubTab === 'faculty-grades'
      ? 'grades'
      : activeSubTab === 'faculty-violations'
      ? 'violations'
      : 'questions'
  );

  // Question Wizard State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newCodeSnippet, setNewCodeSnippet] = useState('');
  const [newTopic, setNewTopic] = useState('White-Box Testing & Metrics');
  const [newMarks, setNewMarks] = useState(3);
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOption, setCorrectOption] = useState('A');
  const [searchQuestion, setSearchQuestion] = useState('');

  // Selected Submission for Violation Review
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<ExamSubmissionReport | null>(null);
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});
  const [decisions, setDecisions] = useState<Record<string, 'approved' | 'viva_required' | 'disqualified'>>({});

  // Search in Grade Reports
  const [searchCandidate, setSearchCandidate] = useState('');

  const handleCreateQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !optA || !optB || !optC || !optD) return;

    const newQ: Question = {
      id: Math.max(...questions.map((q) => q.id), 0) + 1,
      questionText: newQuestionText.trim(),
      codeSnippet: newCodeSnippet.trim() ? newCodeSnippet.trim() : undefined,
      options: [
        { id: 'A', label: 'A', text: optA.trim() },
        { id: 'B', label: 'B', text: optB.trim() },
        { id: 'C', label: 'C', text: optC.trim() },
        { id: 'D', label: 'D', text: optD.trim() },
      ],
      correctOptionId: correctOption,
      marks: Number(newMarks),
      topic: newTopic,
      difficulty: newDifficulty,
    };

    onAddQuestion(newQ);
    setIsCreateModalOpen(false);
    // Reset form
    setNewQuestionText('');
    setNewCodeSnippet('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
  };

  const handleExportCSV = () => {
    const headers = ['Candidate ID', 'Name', 'Score', 'Total Marks', 'Percentage', 'Passed', 'Violations', 'Status'];
    const rows = submissions.map((s) => [
      s.candidateId,
      s.candidateName,
      s.score,
      s.totalMarks,
      `${s.percentage.toFixed(1)}%`,
      s.passed ? 'PASSED' : 'FAILED',
      s.totalViolations,
      s.wasTerminated ? 'TERMINATED' : 'COMPLETED',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SQM601_Grade_Report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.questionText.toLowerCase().includes(searchQuestion.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuestion.toLowerCase())
  );

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.candidateName.toLowerCase().includes(searchCandidate.toLowerCase()) ||
      s.candidateId.toLowerCase().includes(searchCandidate.toLowerCase())
  );

  // Compute metrics
  const avgScore =
    submissions.length > 0
      ? (submissions.reduce((acc, curr) => acc + curr.percentage, 0) / submissions.length).toFixed(1)
      : '0.0';
  const passRate =
    submissions.length > 0
      ? ((submissions.filter((s) => s.passed).length / submissions.length) * 100).toFixed(0)
      : '0';
  const flaggedCount = submissions.filter((s) => s.wasTerminated || s.totalViolations > 0).length;

  return (
    <div className="space-y-6">
      {/* Faculty Portal Subnav */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Faculty Governance Portal · Course Coordinator
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Examination Administration & Review
          </h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setSelectedSubTab('questions')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedSubTab === 'questions'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Question Bank ({questions.length})
          </button>
          <button
            onClick={() => setSelectedSubTab('grades')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedSubTab === 'grades'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Grade Reports ({submissions.length})
          </button>
          <button
            onClick={() => setSelectedSubTab('violations')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedSubTab === 'violations'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Violation Review Logs ({flaggedCount})
          </button>
        </div>
      </div>

      {/* TAB 1: QUESTION BANK WIZARD */}
      {selectedSubTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuestion}
                onChange={(e) => setSearchQuestion(e.target.value)}
                placeholder="Search questions by keyword or topic..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Question</span>
            </button>
          </div>

          {/* Questions Grid */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      Q{q.id < 10 ? `0${q.id}` : q.id}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">· {q.topic}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {q.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">{q.marks} Marks</span>
                    <button
                      onClick={() => onDeleteQuestion(q.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {q.questionText}
                </p>

                {q.codeSnippet && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                    <pre>{q.codeSnippet}</pre>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-2 pt-1 text-xs">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                        opt.id === q.correctOptionId
                          ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-medium'
                          : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="font-mono font-bold">{opt.label}:</span>
                      <span>{opt.text}</span>
                      {opt.id === q.correctOptionId && (
                        <Check className="w-3.5 h-3.5 text-emerald-500 ml-auto shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AUTOMATED GRADE REPORTS */}
      {selectedSubTab === 'grades' && (
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-mono text-slate-500 uppercase">Class Average Score</span>
              <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                {avgScore}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-mono text-slate-500 uppercase">Overall Pass Rate</span>
              <div className="text-2xl font-bold font-mono text-emerald-500 mt-1">{passRate}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-mono text-slate-500 uppercase">Integrity Flagged Attempts</span>
              <div className="text-2xl font-bold font-mono text-amber-500 mt-1">{flaggedCount}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchCandidate}
                onChange={(e) => setSearchCandidate(e.target.value)}
                placeholder="Search candidate name or ID..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Grade Dossier (CSV)</span>
            </button>
          </div>

          {/* Submissions Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono">
                <tr>
                  <th className="py-3 px-4 font-medium">Candidate</th>
                  <th className="py-3 px-4 font-medium">Score</th>
                  <th className="py-3 px-4 font-medium">Percentage</th>
                  <th className="py-3 px-4 font-medium">Result</th>
                  <th className="py-3 px-4 font-medium">Duration</th>
                  <th className="py-3 px-4 font-medium">Proctor Strikes</th>
                  <th className="py-3 px-4 font-medium">Integrity Risk</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredSubmissions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{s.candidateName}</div>
                      <div className="text-[10px] font-mono text-slate-500">{s.candidateId}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {s.score} / {s.totalMarks}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {s.percentage.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4">
                      {s.passed ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                          PASSED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50">
                          FAILED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{s.durationMinutes}m</td>
                    <td className="py-3 px-4 font-mono">
                      <span className={s.warningCount > 0 ? 'text-amber-500 font-bold' : 'text-slate-500'}>
                        {s.warningCount} / 3 {s.wasTerminated && '🚫'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                          s.aiIntegrityAssessment?.riskLevel === 'High' || s.wasTerminated
                            ? 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                            : s.aiIntegrityAssessment?.riskLevel === 'Medium'
                            ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                            : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                        }`}
                      >
                        {s.aiIntegrityAssessment?.riskLevel || 'Nominal'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedSubmissionForReview(s)}
                        className="px-2.5 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                      >
                        Review Log
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: VIOLATION REVIEW LOGS */}
      {selectedSubTab === 'violations' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Audit proctoring incident records, review synchronized camera frame snapshots, and issue official faculty
            determinations.
          </p>

          <div className="space-y-4">
            {submissions
              .filter((s) => s.violations && s.violations.length > 0)
              .map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {sub.candidateName}
                        <span className="text-[10px] font-mono text-slate-500 font-normal">
                          ({sub.candidateId})
                        </span>
                      </h4>
                      <span className="text-xs text-slate-500">
                        {sub.violations.length} incidents logged · Result: {sub.score}/{sub.totalMarks} ({sub.percentage.toFixed(1)}%)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase border ${
                          sub.wasTerminated
                            ? 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                            : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                        }`}
                      >
                        {sub.wasTerminated ? 'TERMINATED AT 3 STRIKES' : 'WARNINGS ISSUED'}
                      </span>
                      <button
                        onClick={() => setSelectedSubmissionForReview(sub)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-xs"
                      >
                        Inspect Full Dossier
                      </button>
                    </div>
                  </div>

                  {/* Incident Events List */}
                  <div className="space-y-2">
                    {sub.violations.map((v, vIdx) => (
                      <div
                        key={v.id || vIdx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-rose-500 uppercase">{v.type}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {new Date(v.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">{v.description}</p>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                          Severity: {v.severity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* AI Integrity Assessment Summary */}
                  {sub.aiIntegrityAssessment && (
                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Gemini AI Integrity Analysis ({sub.aiIntegrityAssessment.riskLevel} Risk):</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">
                        {sub.aiIntegrityAssessment.summary}
                      </p>
                      <div className="pt-1 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                        Recommendation: {sub.aiIntegrityAssessment.recommendation}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Create Question Wizard */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Examination Question" maxWidth="max-w-xl">
        <form onSubmit={handleCreateQuestionSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Question Text</label>
            <textarea
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g. Explain how Boundary Value Analysis improves test case quality..."
              rows={3}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Optional Code Snippet (Syntax Box)</label>
            <textarea
              value={newCodeSnippet}
              onChange={(e) => setNewCodeSnippet(e.target.value)}
              placeholder="int calculateCyclomaticComplexity() { ... }"
              rows={2}
              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Topic Area</label>
              <select
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="White-Box Testing & Metrics">White-Box Testing & Metrics</option>
                <option value="ISO/IEC Standards & Quality Models">ISO/IEC Standards & Quality</option>
                <option value="PERT/CPM Project Planning">PERT/CPM Project Planning</option>
                <option value="Fault Injection & Mutation Testing">Fault Injection & Mutation</option>
                <option value="Black-Box Testing Strategies">Black-Box Testing Strategies</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Marks</label>
              <input
                type="number"
                min="1"
                max="10"
                value={newMarks}
                onChange={(e) => setNewMarks(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Multiple Choice Options</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="Option A"
                value={optA}
                onChange={(e) => setOptA(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
              <input
                type="text"
                placeholder="Option B"
                value={optB}
                onChange={(e) => setOptB(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
              <input
                type="text"
                placeholder="Option C"
                value={optC}
                onChange={(e) => setOptC(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
              <input
                type="text"
                placeholder="Option D"
                value={optD}
                onChange={(e) => setOptD(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Correct Answer Option</label>
            <div className="flex gap-4 text-xs font-mono">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="correct"
                    value={opt}
                    checked={correctOption === opt}
                    onChange={() => setCorrectOption(opt)}
                  />
                  <span>Option {opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
            >
              Save to Question Bank
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Full Violation Dossier Review */}
      {selectedSubmissionForReview && (
        <Modal
          isOpen={!!selectedSubmissionForReview}
          onClose={() => setSelectedSubmissionForReview(null)}
          title={`Academic Integrity Dossier: ${selectedSubmissionForReview.candidateName}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Score: {selectedSubmissionForReview.score}/{selectedSubmissionForReview.totalMarks} ({selectedSubmissionForReview.percentage.toFixed(1)}%)
                </span>
                <div className="text-[11px] text-slate-500">
                  Duration: {selectedSubmissionForReview.durationMinutes} mins · Strikes: {selectedSubmissionForReview.warningCount}/3
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
                  selectedSubmissionForReview.wasTerminated ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'
                }`}
              >
                {selectedSubmissionForReview.wasTerminated ? 'TERMINATED AT 3 STRIKES' : 'COMPLETED SESSION'}
              </span>
            </div>

            {/* AI Risk Assessment */}
            {selectedSubmissionForReview.aiIntegrityAssessment && (
              <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300">
                    AI Integrity Assessment Engine
                  </span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                    Confidence: {selectedSubmissionForReview.aiIntegrityAssessment.confidenceScore}%
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedSubmissionForReview.aiIntegrityAssessment.summary}
                </p>
                <div className="pt-1 text-slate-800 dark:text-slate-200 font-medium">
                  Recommended Action: {selectedSubmissionForReview.aiIntegrityAssessment.recommendation}
                </div>
              </div>
            )}

            {/* Incident logs with timestamp */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Recorded Video / Focus Events
              </h5>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedSubmissionForReview.violations.map((v, i) => (
                  <div
                    key={v.id || i}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-rose-500">{v.type}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(v.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Faculty Decision Buttons */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Official Faculty Determination
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDecisions((prev) => ({ ...prev, [selectedSubmissionForReview.id]: 'approved' }));
                    setSelectedSubmissionForReview(null);
                  }}
                  className="py-2.5 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  ✓ Approve Score
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDecisions((prev) => ({ ...prev, [selectedSubmissionForReview.id]: 'viva_required' }));
                    setSelectedSubmissionForReview(null);
                  }}
                  className="py-2.5 px-3 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl hover:bg-amber-100 transition-colors"
                >
                  ⚠️ Flag for Oral Viva
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDecisions((prev) => ({ ...prev, [selectedSubmissionForReview.id]: 'disqualified' }));
                    setSelectedSubmissionForReview(null);
                  }}
                  className="py-2.5 px-3 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  ✕ Disqualify Attempt
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
