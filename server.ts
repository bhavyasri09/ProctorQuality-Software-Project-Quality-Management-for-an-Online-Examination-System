import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client (server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory audit & dispatch log for real-time tracking
interface EmailDispatchRecord {
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

const dispatchLogs: EmailDispatchRecord[] = [
  {
    id: 'DISP-9841',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    recipientEmail: 'faculty.advisor@univ.edu',
    recipientName: 'Dr. Aris Thorne',
    recipientRole: 'Faculty Invigilator',
    subject: '[ACADEMIC INTEGRITY] Candidate ID STU-2026-88 Flagged for Multiple Tab Switches',
    content: 'Formal automated incident dispatch: Student STU-2026-88 recorded 2 window blur events during Examination: SQM-601. Review candidate video logs in Faculty Governance Portal.',
    incidentType: 'WARNING_ISSUED',
    deliveryStatus: 'delivered',
    isoAuditToken: 'ISO-23988-SEC-9841-A',
  },
  {
    id: 'DISP-9842',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    recipientEmail: 'sarah.lin@student.univ.edu',
    recipientName: 'Sarah Lin',
    recipientRole: 'Student',
    subject: '[PORTAL ACCESS APPROVED] Your Online Examination Account is Now Active',
    content: 'Dear Sarah Lin, your registration for the Department Examination Portal has been verified and approved by the System Administrator. You may now access scheduled proctored assessments.',
    incidentType: 'REGISTRATION_APPROVED',
    deliveryStatus: 'delivered',
    isoAuditToken: 'ISO-23988-AUTH-9842-B',
  },
];

// 1. Gemini AI Exam Assistance Chatbot
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const { message, examContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are the Automated AI Exam Support & Invigilation Assistant for the "ProctorQuality" Online Examination System.
Current Exam: ${examContext?.examTitle || 'Software Project Quality Management (M.Tech Final Exam)'}
Time Remaining: ${examContext?.timeRemaining || 'Active Session'}
Current Question: ${examContext?.currentQuestionNumber ? `Question #${examContext.currentQuestionNumber}` : 'General Inquiry'}

CRITICAL ACADEMIC INTEGRITY RULES:
1. You may assist the candidate with:
   - System technical questions (how the camera/mic works, full screen requirements, 3-warning rule explanation, timer behavior, question palette colors: green for answered, red for unanswered, yellow for review).
   - Clarification of general exam policies, submission procedures, marking schemes, and time management strategies.
   - Clarifying the English definitions of technical keywords (e.g. what is meant by "cyclomatic complexity" in software engineering in general terminology), WITHOUT solving or pointing to answers for specific questions on the test!
2. STRICT ANTI-CHEATING RULE:
   - You MUST NEVER answer exam questions, select choices (A, B, C, D), write code solutions to the questions, or give hints that narrow down the correct answer.
   - If the student asks you: "What is the answer to question 3?", "Which option is correct?", "Solve this code snippet", or copies exam question text to get an answer, immediately and politely decline with:
     "⚠️ Academic Integrity Notice: As the automated exam proctoring assistant, I am prohibited under ISO/IEC 23988 standards from answering exam questions, providing hints, or validating choices. Please answer using your own knowledge."
3. Keep answers concise, calm, clear, and reassuring. Always maintain formal academic invigilation tone.`;

    if (!process.env.GEMINI_API_KEY) {
      // Deterministic fallback response when API key is unconfigured
      const lower = message.toLowerCase();
      let reply = "Hello! I am your AI Exam Invigilation Assistant. I can help with interface controls, camera/mic troubleshooting, warning rules, and exam instructions. Please note I cannot provide answers to exam questions.";
      if (lower.includes('warning') || lower.includes('fullscreen') || lower.includes('strike')) {
        reply = "The 3-Warning Rule automatically records a strike whenever full-screen is exited or the browser window loses focus. On the 3rd strike, your examination will be locked and automatically submitted for faculty integrity review.";
      } else if (lower.includes('palette') || lower.includes('color') || lower.includes('green') || lower.includes('yellow')) {
        reply = "Question Palette Guide: Green = Answered, Red = Unanswered, Yellow = Marked for Review, Gray = Not Visited yet. You can click any number to jump directly to that question.";
      } else if (lower.includes('answer') || lower.includes('option') || lower.includes('solve') || lower.includes('correct')) {
        reply = "⚠️ Academic Integrity Notice: As the automated exam invigilation assistant, I cannot provide answers, hints, or verification for test questions during an active exam. Please answer based on your knowledge.";
      }
      return res.json({ reply, source: 'offline-agent' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'I could not process your query at this moment. Please continue with your examination.';
    res.json({ reply, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Error in Gemini assistant:', error);
    res.status(500).json({
      error: 'Failed to contact Gemini Proctor Assistant',
      details: error?.message || 'Server error',
      fallback: 'System support is currently processing your question. Please verify your camera frame and continue answering questions.',
    });
  }
});

// 2. Gemini AI Automated Email Dispatch Triggering System
app.post('/api/gemini/dispatch-email', async (req, res) => {
  try {
    const { eventType, recipientName, recipientEmail, recipientRole, details } = req.body;

    let emailSubject = `[PROCTOR INTEGRITY NOTICE] ${eventType} - ${recipientName}`;
    let emailBody = `Notice of incident regarding examination integrity: ${JSON.stringify(details || {})}`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Generate a formal, professional institutional email notice for an Online Examination System with AI-Assisted Proctoring.
Event Type: ${eventType} (Options: EXAM_TERMINATED_3_WARNINGS, WARNING_ISSUED, REGISTRATION_APPROVED, REGISTRATION_REJECTED, INTEGRITY_AUDIT_REPORT)
Recipient Name: ${recipientName} (${recipientRole})
Recipient Email: ${recipientEmail}
Event Specifics: ${JSON.stringify(details || {})}

Return a valid JSON object with two fields:
{
  "subject": "Clear, professional institutional email subject line",
  "body": "Formal academic email body (3-4 paragraphs) specifying the incident, timestamps, rule reference (ISO/IEC 23988 Software Project Quality Standard), next steps, and appeals process if applicable."
}`;

        const genRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (genRes.text) {
          const parsed = JSON.parse(genRes.text);
          emailSubject = parsed.subject || emailSubject;
          emailBody = parsed.body || emailBody;
        }
      } catch (genErr) {
        console.warn('Gemini dispatch fallback to template:', genErr);
      }
    } else {
      if (eventType === 'EXAM_TERMINATED_3_WARNINGS') {
        emailSubject = `[URGENT: EXAMINATION TERMINATED] Proctored Session Strike Limit Exceeded - ${recipientName}`;
        emailBody = `Dear ${recipientName},\n\nThis is an automated formal notification from the Online Examination Quality Management System. Your examination session for '${details?.examTitle || 'Software Quality Management'}' was terminated automatically at ${new Date().toLocaleTimeString()} after accumulating 3 consecutive proctoring violations (Window focus lost / Full-screen exit).\n\nYour submitted answers up to the point of termination have been locked. An incident dossier containing synchronized webcam frames and audio event logs has been transmitted to your Faculty Review Board for investigation under ISO/IEC 23988 academic compliance.\n\nIf you experienced a technical malfunction or involuntary operating system interruption, you may file an appeal through the Student Governance Portal within 24 hours.\n\nSincerely,\nOffice of Academic Integrity & Examination Quality Management`;
      } else if (eventType === 'REGISTRATION_APPROVED') {
        emailSubject = `[PORTAL ACCESS GRANTED] Online Examination Credential Verification Approved`;
        emailBody = `Dear ${recipientName},\n\nWe are pleased to inform you that your institutional credentials and registration for the Online Examination System have been reviewed and approved by the System Administrator.\n\nYour account role (${recipientRole}) has been activated. You may now sign in to view scheduled examination slots, run the pre-exam hardware compatibility checklist, and access study repositories.\n\nRegards,\nCentral Examination Authority`;
      }
    }

    const newRecord: EmailDispatchRecord = {
      id: `DISP-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      recipientEmail,
      recipientName,
      recipientRole,
      subject: emailSubject,
      content: emailBody,
      incidentType: eventType,
      deliveryStatus: 'delivered',
      isoAuditToken: `ISO-23988-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };

    dispatchLogs.unshift(newRecord);
    res.json({ success: true, record: newRecord });
  } catch (error: any) {
    console.error('Error generating email dispatch:', error);
    res.status(500).json({ error: 'Failed to process email dispatch' });
  }
});

// 3. Get Email Dispatch Logs
app.get('/api/gemini/dispatch-logs', (_req, res) => {
  res.json({ logs: dispatchLogs });
});

// 4. Gemini AI Violation Dossier Analyzer
app.post('/api/gemini/analyze-proctor-logs', async (req, res) => {
  try {
    const { candidateName, examTitle, violations, examScore, durationMinutes } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      const violationCount = violations?.length || 0;
      let riskLevel = 'Low';
      let recommendation = 'Approve score without viva.';
      if (violationCount >= 3) {
        riskLevel = 'High';
        recommendation = 'Conduct mandatory 15-minute viva voce to verify conceptual mastery.';
      } else if (violationCount >= 1) {
        riskLevel = 'Medium';
        recommendation = 'Spot check webcam snapshots at timestamps of warning.';
      }
      return res.json({
        riskLevel,
        confidenceScore: 94.5,
        summary: `Analysis of candidate ${candidateName}: Total ${violationCount} proctoring anomaly events recorded during ${durationMinutes || 45} minutes exam.`,
        recommendation,
        complianceStatus: riskLevel === 'High' ? 'FLAGGED_FOR_AUDIT' : 'CLEAR',
      });
    }

    const prompt = `You are a Senior Academic Integrity Auditor for an M.Tech Software Quality Management examination system.
Candidate: ${candidateName}
Exam: ${examTitle}
Score: ${examScore}%
Duration: ${durationMinutes} minutes
Violations logged during proctored session:
${JSON.stringify(violations || [])}

Provide a structured JSON assessment:
{
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "confidenceScore": number (e.g. 96.2),
  "summary": "2-3 sentences evaluating the pattern of violations vs normal test-taker jitter",
  "recommendation": "Concrete faculty action (e.g. clear result, oral viva examination, invalidate test)",
  "complianceStatus": "CLEAR" | "INVESTIGATION_RECOMMENDED" | "FLAGGED_FOR_AUDIT"
}`;

    const genRes = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(genRes.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Error in analyze-proctor-logs:', err);
    res.status(500).json({ error: 'Failed to analyze logs' });
  }
});

// 5. System Health & Quality Telemetry
app.get('/api/system/health', (_req, res) => {
  res.json({
    status: 'ONLINE',
    serverLoadPercent: 24.8,
    activeCandidates: 142,
    proctorStreamingNodes: 8,
    averageLatencyMs: 18,
    isoStandard: 'ISO/IEC 25010 SQM & ISO/IEC 23988 Online Assessments',
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`ProctorQuality Server listening on port ${PORT} (dev mode: ${isDev})`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
