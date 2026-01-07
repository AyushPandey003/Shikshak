
export enum AppState {
  SETUP = 'SETUP',
  PERMISSIONS = 'PERMISSIONS',
  TESTING = 'TESTING',
  REPORT = 'REPORT'
}

export interface QuestionEntry {
  id: string;
  text: string;
  answer?: string;
}

export interface AssessmentConfig {
  title: string;
  questions: string[];
  validUntil: string;
}

export interface AssessmentReport {
  title: string;
  timestamp: string;
  totalQuestions: number;
  qa: { question: string; answer: string }[];
}
