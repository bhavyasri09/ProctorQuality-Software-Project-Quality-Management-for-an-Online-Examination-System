export type UserRole = 'student' | 'faculty' | 'admin';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId: string;
  department: string;
  status: ApprovalStatus;
  avatarUrl?: string;
  registeredAt: string;
  approvedBy?: string;
  approvalNotes?: string;
}

export type QuestionState = 'answered' | 'unanswered' | 'review' | 'not_visited';

export interface Question {
  id: number;
  questionText: string;
  codeSnippet?: string;
  options: { id: string; label: string; text: string }[];
  correctOptionId: string;
  marks: number;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation?: string;
}

export interface CandidateAnswer {
  questionId: number;
  selectedOptionId: string | null;
  state: QuestionState;
  timeSpentSeconds: number;
}

export type ViolationType =
  | 'FULLSCREEN_EXIT'
  | 'TAB_SWITCH_BLUR'
  | 'NO_FACE_DETECTED'
  | 'MULTIPLE_FACES_DETECTED'
  | 'HEAD_TURN_ANOMALY'
  | 'BACKGROUND_SPEECH_DETECTED'
  | 'HIGH_NOISE_ANOMALY';

export interface ProctorViolationEvent {
  id: string;
  timestamp: string;
  type: ViolationType;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  snapshotUrl?: string; // Data URL or canvas frame preview
  acknowledged: boolean;
}

export interface ExamSubmissionReport {
  id: string;
  candidateId: string;
  candidateName: string;
  examId: string;
  examTitle: string;
  submittedAt: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  durationMinutes: number;
  totalViolations: number;
  warningCount: number;
  wasTerminated: boolean;
  topicBreakdown: { topic: string; score: number; maxScore: number }[];
  aiIntegrityAssessment?: {
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    confidenceScore: number;
    summary: string;
    recommendation: string;
    complianceStatus: string;
  };
  answers: Record<number, string | null>;
  violations: ProctorViolationEvent[];
}

export interface PertCpmActivity {
  id: string;
  code: string;
  name: string;
  predecessors: string[];
  optimistic: number; // to
  mostLikely: number; // tm
  pessimistic: number; // tp
  expectedDuration: number; // te = (to + 4tm + tp)/6
  variance: number; // ((tp - to)/6)^2
  earliestStart: number;
  earliestFinish: number;
  latestStart: number;
  latestFinish: number;
  slack: number;
  isCritical: boolean;
  owner: string;
  qualityStage: string;
}

export interface SoftwareQualityMetrics {
  defectDensity: number; // defects / KLOC
  mtbfHours: number; // Mean Time Between Failures
  testCoveragePercent: number;
  cyclomaticComplexityAvg: number;
  proctorAiPrecision: number; // %
  proctorAiRecall: number; // %
  serverLoadConcurrency: number;
  iso25010Scores: {
    functionalSuitability: number;
    performanceEfficiency: number;
    compatibility: number;
    usability: number;
    reliability: number;
    security: number;
    maintainability: number;
    portability: number;
  };
}

export interface EmailDispatchRecord {
  id: string;
  timestamp: string;
  recipientEmail: string;
  recipientName: string;
  recipientRole: string;
  subject: string;
  content: string;
  incidentType: string;
  deliveryStatus: 'delivered' | 'queued' | 'simulated';
  isoAuditToken: string;
}
